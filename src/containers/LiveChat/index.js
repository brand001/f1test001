import React from "react";
import { Dimensions, Image, Keyboard, Linking, Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";

import { translate } from "$locales/translate";
import { Toasts } from "$Toasts";
const { width, height } = Dimensions.get("window");
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import { CloseIcon, PhoneIcon } from "$Components/icons/index";
import CustomWebView from "$Components/CustomWebView";
import Color from "$Components/Color";
let fireLoad = false;
const patchPostMessageFunction = function() {
    var originalPostMessage = window.postMessage;

    var patchedPostMessage = function(message, targetOrigin, transfer) {
        originalPostMessage(message, targetOrigin, transfer);
    };

    patchedPostMessage.toString = function() {
        return String(Object.hasOwnProperty).replace("hasOwnProperty", "postMessage");
    };

    window.postMessage = patchedPostMessage;
    setTimeout(() => {
        //防止亂彈瀏覽器
        var a = document.getElementsByTagName("a");

        for (var i = 0; i < a.length; i++) {
            a[i].onclick = function(event) {
                window.postMessage(this.href);
                event.preventDefault();
            };
        }
    }, 5000);
};
const patchPostMessageJsCode = "(" + String(patchPostMessageFunction) + ")()";
const LiveUrlMap = {
    "CN": "https://roseapp.hihi2u.com/roseapp",
    "TH": "https://orchidapp.hihi2u.com/orchidapp",
    "VN": "https://mulberryapp.hihi2u.com/app",
};

class LiveChat extends React.Component {
    constructor(props) {
        super(props);
        this._onNavigationStateChange = this._onNavigationStateChange.bind(this);
        this.state = {
            initialHeight: height - 80,
            heightXJ: height - 80,
            LiveChatXT: "",
        };
    }

    componentDidMount(props) {
        this.getLiveChatX();
        let { type = "" } = this.props?.query || {};
        let ServerSpecialEvent = {
            closeOut: {
                callBack: () => {},
            },
            zoomOut: {
                callBack: () => {},
            },
        };

        let ServerSpecialEventItem = ServerSpecialEvent[type ? type : "closeOut"];
        let { icon } = ServerSpecialEventItem;

        this.props.navigation.setParams({
            title: translate("在线客服1"),
            rightButton: () => {
                return (
                    <View style={styles.rightWrap}>
                        {
                            ApiPort.UserLogin && window.LANGUAGE != "CN" &&
                            <PhoneIcon
                                fill={Color.white}
                                onPress={() => {
                                    Keyboard.dismiss();
                                    Actions.DeviceInformation();
                                }}
                                wrapStyle={{ marginRight: 6 }}
                            />
                        }

                        <CloseIcon onPress={() => {
                            Actions.pop();
                            PiwikEventDataHandle({
                                category: "HelpCenter",
                                action: "Minimize CS",
                                name: "HelpCenter_C_MinimizeCS",
                                path: "help_center_live_chat",
                                title: "Help Center Live Chat",
                            });
                        }} />
                    </View>
                );
            },
            leftButton: () => {
                return null;
            },
        });

        //  监听键盘打开事件
        if (Platform.OS === "android") {
            this.keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", this._keyboardDidShow.bind(this));
            //  监听键盘关闭事件
            this.keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", this._keyboardDidHide.bind(this));
        }
    }

    componentWillUnmount() {
        if (Platform.OS === "android") {
            this.keyboardDidShowListener.remove();
            this.keyboardDidHideListener.remove();
        }
    }

    //拿客服链接
    getLiveChatX() {
        const DefaultLiveUrl = LiveUrlMap[window.LANGUAGE];
        this.setState({
            LiveChatXT: DefaultLiveUrl,
        });
        let { type = "", listingParams = "" } = this.props?.query || {};
        fetchRequest(ApiPort.LiveChat, "GET")
            .then(data => {
                Toasts.removeAll();
                let { isSuccess = false, result = DefaultLiveUrl } = data;
                if (isSuccess) {
                    this.setState({
                        LiveChatXT: ["http", "https"].includes(result.split(":")[0].toLocaleLowerCase()) ? result : DefaultLiveUrl,
                    });
                } else {
                    this.setState({
                        LiveChatXT: result,
                    });
                }
            })
            .catch(() => {
                Toasts.removeAll();
                this.setState({
                    LiveChatXT: DefaultLiveUrl,
                });
            });
    }

    _keyboardDidShow(e) {
        this.setState({
            heightXJ: this.state.initialHeight - e.endCoordinates.height,
        });
    }

    _keyboardDidHide(e) {
        this.setState({ heightXJ: this.state.initialHeight });
    }

    _onNavigationStateChange(e) {
        const { LiveChatXT } = this.state;
        if (fireLoad == false) {
            return;
        }
        if (LiveChatXT == "") {
            return;
        }

        if (e.url.split("?")[0] != LiveChatXT.split("?")[0]) {
            this._webView?.stopLoading();
            setTimeout(() => {
                Linking.openURL(e.url);
                this.getLiveChatX();
            }, 1000);

            return false;
        }
        return true;
    }

    render() {
        const { heightXJ, LiveChatXT = LiveUrlMap[window.LANGUAGE] } = this.state;

        const mobileOS = Platform.OS === "android" ? "Android" : "Ios";
        const urlLastChar = LiveChatXT.substring(LiveChatXT.length, LiveChatXT.length - 1);
        let liveChatUrl = LiveChatXT;
        if (ApiPort.UserLogin) {
            liveChatUrl += `&CUSTOM!ReferringSite=${mobileOS},${Rb88Version}`;
        } else {
            switch (urlLastChar) {
                case "?":
                    liveChatUrl += `CUSTOM!ReferringSite=${mobileOS},${Rb88Version}`;
                    break;
                case "/":
                    liveChatUrl = `${liveChatUrl.substring(0, liveChatUrl.length - 1)}?CUSTOM!ReferringSite=${mobileOS},${Rb88Version}`;
                    break;
                default:
                    if (LiveChatXT.includes("?")) {
                        liveChatUrl += `&CUSTOM!ReferringSite=${mobileOS},${Rb88Version}`;
                    } else {
                        liveChatUrl += `?CUSTOM!ReferringSite=${mobileOS},${Rb88Version}`;
                    }
            }
        }

        let { listingParams = "" } = this.props?.query || {};
        return (
            <View style={styles.viewContainer}>
                <CustomWebView
                    ref={ref => {
                        this._webView = ref;
                    }}
                    key={liveChatUrl}
                    source={{ uri: liveChatUrl + `${listingParams || ""}` }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    scalesPageToFit={false}
                    onNavigationStateChange={this._onNavigationStateChange}
                    webViewStyle={{ width: width, height: heightXJ, marginTop: 0 }}
                    thirdPartyCookiesEnabled={true}
                />
            </View>
        );
    }
}

export default connect()(LiveChat);

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: "#fff",
    },
    rightWrap: {
        flexDirection: "row",
        alignItems: "center",
        paddingRight: 10,
    },
});
