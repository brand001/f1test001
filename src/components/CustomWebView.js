import React, { forwardRef, useState, useRef, useEffect, useMemo, useImperativeHandle } from "react";
import { Animated, Dimensions, Easing, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import Video from "react-native-video";

import { ImagesUrl } from "@/images/index";

const { width } = Dimensions.get("window");

/**
 * CustomWebView 組件
 * 合併 WebView 和 LoadIngWebViewGif，主要用於處理 loading 狀態和錯誤處理
 * 支持 WebView 和 Video 兩種模式
 * 
 * @param {Object} props
 * @param {string} props.type - 組件類型："webview" | "video"，默認為 "webview"
 * @param {boolean} props.showLoading - 是否顯示 loading 動畫，默認為 true
 * @param {Function} props.onLoadStart - 開始載入時的回調
 * @param {Function} props.onLoadEnd - WebView 載入完成時的回調（僅 WebView）
 * @param {Function} props.onLoad - Video 載入完成時的回調（僅 Video）
 * @param {Function} props.onError - 發生錯誤時的回調（包括一般錯誤和 HTTP 錯誤）
 * @param {Object} props.source - source 屬性（WebView 或 Video）
 * @param {string} props.pageTitle - 頁面標題（僅 WebView）
 * @param {Object} props.webViewStyle - WebView/Video 的樣式
 * @param {Object} props.containerStyle - 容器樣式
 * @param {Object} props.navigation - 導航對象（僅 WebView）
 * @param {...any} webViewProps - WebView/Video 的其他所有 props
 */
const CustomWebView = forwardRef(({
    type = "webview", // "webview" | "video"
    showLoading = true,
    onLoadStart = () => {},
    onLoadEnd = () => {},
    onLoad = () => {},
    onError = () => {},
    source = null,
    pageTitle = "",
    webViewStyle = {},
    containerStyle = {},
    navigation = {},
    ...webViewProps
}, ref) => {
    // 檢查 source 是否為 http 形式
    // 只有通過 uri 且是 http/https 的才需要 loading
    // HTML 內容（{ html: '...' }）、file://、data: 等都不需要 loading
    const isHttpSource = (src) => {
        if (!src) return false;

        // 如果是字符串，檢查是否為 http（轉為小寫後檢查）
        if (typeof src === "string") {
            const lowerSrc = src.toLowerCase();
            return lowerSrc.startsWith("http://") || lowerSrc.startsWith("https://");
        }

        // 如果是對象，檢查是否有 html 屬性（HTML 內容不需要 loading）
        if (src.html) {
            return false;
        }

        // 只有通過 uri 且是 http/https 的才需要 loading（轉為小寫後檢查）
        const uri = (src.uri || "").toLowerCase();
        return uri.startsWith("http://") || uri.startsWith("https://");
    };

    // 處理 source，確保格式正確（使用 useMemo 緩存）
    const componentSource = useMemo(() => {
        if (!source) {
            // 如果沒有 source，根據類型返回默認值
            if (type === "video") {
                return null; // Video 不設置 source 會顯示錯誤，但我們通過 onError 處理
            }
            return { uri: "about:blank" };
        }
        // 如果是字符串，轉換為對象格式
        if (typeof source === "string") {
            return { uri: source };
        }
        // 如果已經是對象，直接返回
        return source;
    }, [source, type]);

    // 檢查當前 source 是否需要 loading
    const shouldShowLoading = useMemo(() => isHttpSource(componentSource), [componentSource]);

    // 根據 source 是否為 http 形式來設置初始 loading 狀態
    const [isLoading, setIsLoading] = useState(() => isHttpSource(componentSource));

    // 動畫值
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const backdropOpacityAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.92)).current;

    // 內部 WebView ref
    const webViewRef = useRef(null);

    // 監聽 source、loading 狀態和頁面標題變化
    useEffect(() => {
        // 只在 WebView 模式下設置頁面標題
        if (type === "webview" && pageTitle) {
            navigation?.setParams?.({
                title: pageTitle,
            });
        }

        // 觸發動畫
        if (isLoading) {
            // 重置動畫值
            opacityAnim.setValue(0);
            backdropOpacityAnim.setValue(0);
            scaleAnim.setValue(0.92);

            // 顯示動畫：使用 Spring 動畫（iOS 風格，更自然）
            Animated.parallel([
                // Backdrop 淡入（稍快）
                Animated.timing(backdropOpacityAnim, {
                    toValue: 1,
                    duration: 200,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
                // 內容淡入 + 縮放（Spring 效果）
                Animated.parallel([
                    Animated.timing(opacityAnim, {
                        toValue: 1,
                        duration: 250,
                        easing: Easing.out(Easing.cubic),
                        useNativeDriver: true,
                    }),
                    Animated.spring(scaleAnim, {
                        toValue: 1,
                        tension: 50,
                        friction: 7,
                        useNativeDriver: true,
                    }),
                ]),
            ]).start();
        } else {
            // 隱藏動畫：快速淡出（Material Design 風格）
            Animated.parallel([
                Animated.timing(backdropOpacityAnim, {
                    toValue: 0,
                    duration: 150,
                    easing: Easing.in(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0,
                    duration: 150,
                    easing: Easing.in(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 0.95,
                    duration: 150,
                    easing: Easing.in(Easing.ease),
                    useNativeDriver: true,
                }),
            ]).start();
        }
        // ref (opacityAnim, backdropOpacityAnim, scaleAnim) 不會變化，不需要在依賴中
    }, [shouldShowLoading, isLoading, pageTitle, type, navigation]);

    // 處理載入開始
    const handleLoadStart = (event) => {
        // 只有 source 是 http 形式時，才允許 loading
        if (shouldShowLoading) {
            setIsLoading(true);
        }
        onLoadStart(event);
    };

    // 處理載入完成（WebView）
    const handleLoadEnd = (event) => {
        // 只有之前設置了 loading，才需要關閉
        if (shouldShowLoading) {
            setIsLoading(false);
        }
        onLoadEnd(event);
    };

    // 處理載入完成（Video）
    const handleVideoLoad = (event) => {
        // 只有之前設置了 loading，才需要關閉
        if (shouldShowLoading) {
            setIsLoading(false);
        }
        onLoad(event);
    };

    // 處理錯誤（包括一般錯誤和 HTTP 錯誤）
    const handleError = (event) => {
        // 只有之前設置了 loading，才需要關閉
        if (shouldShowLoading) {
            setIsLoading(false);
        }
        onError(event);
    };

    // 暴露方法給父組件
    useImperativeHandle(ref, () => ({
        // 暴露內部 WebView 的方法（如果存在）
        ...(webViewRef.current || {}),
        // 自定義方法 - 強制控制 loading 狀態
        loadEnd: () => {
            setIsLoading(false);
        },
        initGame: () => {
            setIsLoading(true);
        },
    }), []);

    // 渲染 WebView 或 Video
    const renderComponent = () => {
        if (type === "video") {
            // Video 組件：如果 webViewStyle 有明確的尺寸，就不使用 flex: 1
            const videoStyle = Object.keys(webViewStyle).length > 0 &&
                (webViewStyle.width || webViewStyle.height)
                ? webViewStyle
                : [styles.webView, webViewStyle];

            return (
                <Video
                    ref={ref}
                    source={componentSource}
                    style={videoStyle}
                    {...webViewProps}
                    // 確保我們的處理函數在最後，覆蓋 webViewProps 中可能存在的同名 props
                    onLoadStart={handleLoadStart}
                    onLoad={handleVideoLoad}
                    onError={handleError}
                />
            );
        }

        return (
            <WebView
                ref={webViewRef}
                source={componentSource}
                style={[styles.webView, webViewStyle]}
                {...webViewProps}
                // 確保我們的處理函數在最後，覆蓋 webViewProps 中可能存在的同名 props
                onLoadStart={handleLoadStart}
                onLoadEnd={handleLoadEnd}
                onError={handleError}
                onHttpError={handleError}
            />
        );
    };

    return (
        <View style={[styles.container, containerStyle]}>
            {renderComponent()}
            {showLoading && (shouldShowLoading || isLoading) && (
                <Animated.View
                    style={[
                        styles.loadingContainer,
                        {
                            opacity: backdropOpacityAnim,
                            zIndex: isLoading ? 1 : -100,
                        },
                    ]}
                    pointerEvents={isLoading ? "auto" : "none"}
                >
                    <Animated.View
                        style={{
                            opacity: opacityAnim,
                            transform: [{ scale: scaleAnim }],
                        }}
                    >
                        <Animated.Image
                            resizeMode="contain"
                            style={styles.loadingImg}
                            source={ImagesUrl.gameLoad}
                        />
                    </Animated.View>
                </Animated.View>
            )}
        </View>
    );
});

CustomWebView.displayName = "CustomWebView";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative",
    },
    webView: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, .8)",
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        zIndex: 100,
    },
    loadingImg: {
        width: 0.35 * width,
        height: 0.35 * width,
    },
});

export default CustomWebView;

