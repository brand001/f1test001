import React, { useState, useRef, useEffect } from "react";
import { Dimensions, Platform, StatusBar, View } from "react-native";

import CustomWebView from "$Components/CustomWebView.js";
const { width, height } = Dimensions.get("window");
import SystemNavigationBar from "react-native-system-navigation-bar";

const SmarticoGame = ({
    smarticoBrandKey,
    smarticoLabelKey,
    smarticoDomain,
    smarticoParams,
    smarticoLanguage,
    smarticoMemberCode,
    smarticoUserLogin,
    smarticoBaseUrl,
    onSmarticoPlayGame = () => {},
    onSmarticoPop = () => {},
    onSmarticoErr = () => {},
}) => {
    const [gameWidth, setGameWidth] = useState(width);
    const [gameHeight, setGameHeight] = useState(height);
    const [webViewKey, setWebViewKey] = useState(Date.now());
    const [htmlContent, setHtmlContent] = useState(null);
    const webViewRef = useRef(null);

    const generateHtmlContent = (labelKey, brandKey) => {
        let domain = smarticoDomain;
        const { deepLink = "dp:gf" } = smarticoParams || {};
        domain = (domain?.endsWith(".js")
            ? domain
            : `${domain}/smartico.js`);

        const dpLink = deepLink || "dp:gf";
        return `
      <!DOCTYPE html>
      <html style="width: 100%; height: 100%;">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
          <style>
            body {
              margin: 0;
              padding: 0;
            }
          </style>
          <script>
            (function(d, r, b, h, s){
              h = d.getElementsByTagName('head')[0];
              s = d.createElement('script');
              s.onload = b;
              s.src = r;
              h.appendChild(s);
            })(document, '${domain}', function() {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'loaded' }));
              registerEventListeners();
              _smartico.on("init", (errCode) => {
                if (errCode === 0) {
                 _smartico.dp('${dpLink}');
                } else {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'init',
                    errCode: errCode,
                  }));
                }
              });
              _smartico.init('${labelKey}', { brand_key: '${brandKey}' });
            });

            const registerEventListeners = () => {
              const events = [
                {
                  name: 'init',
                  handler: (errCode, props) => {
                    console.log('init errCode', errCode);
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'init',
                      errCode: errCode,
                    }));
                  }
                },
                {
                  name: 'identify',
                  handler: (errCode, props) => {
                    console.log('identify errCode', errCode);
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'identify',
                      errCode: errCode,
                      props: props,
                    }));
                  }
                },
                {
                  name: 'login',
                  handler: (errCode) => {
                    console.log('login errCode', errCode);
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'login',
                      errCode: errCode,
                    }));
                  }
                },
                {
                  name: 'gf_starting',
                  handler: (props) => {
                    console.log('gf_starting', props);
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'gf_starting',
                      props: props,
                    }));
                  }
                },
                {
                  name: 'gf_closing',
                  handler: (props) => {
                    console.log('gf_closing', props);
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'gf_closing',
                      props: props,
                    }));
                  }
                },
                {
                  name: 'props_change',
                  handler: (props) => {
                    console.log('props', props);
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'props_change',
                      props: props,
                    }));
                  }
                },
                {
                  name: 'ach_game_opening',
                  handler: (props) => {
                    console.log('props', props);
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'ach_game_opening',
                      props: props,
                    }));
                  }
                }
              ];

              events.forEach(event => _smartico.on(event.name, event.handler));
            };
          </script>
        </head>
        <body style="width: 100%; height: 100%;">
        </body>
      </html>
    `;
    };

    const openGame = () => {
        setHtmlContent(generateHtmlContent(smarticoLabelKey, smarticoBrandKey));
        setWebViewKey(Date.now());
    };

    const loadEnd = () => {
        // 使用 ref 調用 loadEnd
        if (webViewRef.current) {
            webViewRef.current.loadEnd();
        }
    };

    const initGame = () => {
        // 使用 ref 調用 initGame
        if (webViewRef.current) {
            webViewRef.current.initGame();
        }
    };

    const handleError = (errCode) => {
        console.log("handleError");
        if (errCode !== 0) {
            onSmarticoErr();
            loadEnd();
        }
    };

    const handleMessage = (event) => {
        const message = JSON.parse(event.nativeEvent.data);
        console.log("message ", message);

        switch (message.type) {
            case "init":
            case "identify":
                console.log(`${message.type} errCode`, message.errCode);
                handleError(message.errCode);
                break;
            case "props_change":
                console.log("props_change ", message.props);
                break;
            case "gf_starting":
                loadEnd();
                console.log("gf_starting ", message.props);
                break;
            case "gf_closing":
                openGame();
                onSmarticoPop();
                console.log("gf_closing ", message.props);
                break;
            case "ach_game_opening": {
                onSmarticoPlayGame(message);
                break;
            }
            default:
                break;
        }
    };

    const onLayout = (event) => {
        const { width: layoutWidth, height: layoutHeight } = event.nativeEvent.layout;
        setGameHeight(layoutHeight);
        setGameWidth(layoutWidth);
        if (Platform.OS === "android") {
            SystemNavigationBar?.navigationShow();
            StatusBar?.setHidden(false);
        }
    };

    // 合併所有 effect 邏輯
    const prevDeepLinkRef = useRef(smarticoParams?.deepLink || "dp:gf");
    const prevWebViewKeyRef = useRef(webViewKey);
    const isMountedRef = useRef(false);

    useEffect(() => {
        const currentDeepLink = smarticoParams?.deepLink || "dp:gf";

        // 組件掛載時打開遊戲
        if (!isMountedRef.current) {
            isMountedRef.current = true;
            openGame();
            return;
        }

        // 當 deepLink 變化時，重新刷新遊戲
        if (prevDeepLinkRef.current !== currentDeepLink) {
            console.log("deepLink 變化，重新刷新:", prevDeepLinkRef.current, "->", currentDeepLink);
            prevDeepLinkRef.current = currentDeepLink;
            openGame();
            return;
        }

        // 當 webViewKey 變化時，調用 initGame（WebView 已重新渲染）
        if (prevWebViewKeyRef.current !== webViewKey) {
            prevWebViewKeyRef.current = webViewKey;
            initGame();
        }
    }, [smarticoParams?.deepLink, webViewKey]);

    const injectedJS = `
      window._smartico_user_id = ${smarticoUserLogin ? `'${smarticoMemberCode}'` : null};
      window._smartico_language = ${smarticoUserLogin ? smarticoLanguage : null};
    `;

    return (
        <View style={{ flex: 1, backgroundColor: "#000" }} onLayout={onLayout}>
            <View
                style={{
                    width: gameWidth,
                    height: gameHeight - (gameWidth < gameHeight && window.DeviceInfoIos ? 0 : 0),
                    backgroundColor: "#000",
                }}>
                <CustomWebView
                    ref={webViewRef}
                    key={webViewKey}
                    source={{ html: htmlContent, baseUrl: smarticoBaseUrl }}
                    webViewStyle={{
                        width: gameWidth,
                        height: gameHeight - (gameWidth < gameHeight && window.DeviceInfoIos ? 30 : 0),
                    }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    originWhitelist={["*"]}
                    scalesPageToFit={false}
                    allowsInlineMediaPlayback
                    mediaPlaybackRequiresUserAction={false}
                    allowFileAccess
                    onMessage={handleMessage}
                    injectedJavaScript={injectedJS}
                />
            </View>
        </View>
    );
};

export default SmarticoGame;
