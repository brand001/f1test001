import _ from "lodash";
import React from "react";
import { Dimensions, Platform, StyleSheet, View, StatusBar, Animated, Text } from "react-native";
import { Actions } from "react-native-router-flux";
import { WebView } from "react-native-webview";
import { connect } from "react-redux";
import LoadIngWebViewGif from "$Components/LoadIngWebViewGif.js";
import actions from "$LIB/redux/actions/index";
const { width, height } = Dimensions.get("window");
import Draggable from "react-native-draggable";
import Orientation from "react-native-orientation-locker";
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import { ProductMapWalletCode } from "@/images/index";
import GamePageNavLeft from "$Components/Nav/GameNav/GamePageNavLeft";
import GamePageNavRight from "$Components/Nav/GameNav/GamePageNavRight";
import { mergeUrls, AllowRotationGame, MIN_LIMIT_MONEY } from "$LIB/data/game";
import { translate } from "$locales/translate";
import OneWallet from "./AviatorGame/index";
import { ColumnCenterCenter, RowCenterBetween, RowCenterEnd } from "$Components/CustomView";
import Color from "$Components/Color";
import { HideNavBar } from "$Utils";
import StorageUtil from "$Utils/Storage";

import { useGame } from "$Hooks";
import GameQuitModal from "$ALLSHARED/APP/components/GameQuitModal/index.js";

const ZoomIconWidth = 36;
const DeviceInfoIosHeight = 30;
const ExitGameTimeOut = 3 * 60 * 1000;

import { _ALLSHARED_recentPlayed_Slot } from "@/actions/Reg";
import { ZoomInIcon, ZoomOutIcon } from "$Components/icons/index.js";

// 新增的函數組件
const GamePageWrapper = ({ children }) => {
    const { getCategoryName, getSubProvidersMap } = useGame();

    return (
        <View style={styles.wrapperContainer}>
            {React.cloneElement(children, { getCategoryName, getSubProvidersMap })}
        </View>
    );
};

const INITIAL_STATE = {
    loadD: true,
    loadone: 1,
    widthS: width,
    heightS: height, // 初始默认值
    gameKey: Math.random(),
    menuOpen: false,
    Noreload: true,
    displayInstantGamesTutorial: false,
    walletCodeMoney: "",
    goHome: false,
    isAlreadyExited: false,
    walletCode: "SB",
    orientation: "PORTRAIT", // LANDSCAPE-RIGHT
    insabajacpot: false,
    sabajackpot_list: false,
    balanceItem: {
        walletProductGroupName: "",
        balance: 0,
        lockedBalance: 0,
        usableAmount: "",
    },
    navTitle: "",
    isFull: false,
    showDraggableTooltip: true,
    showMoneyTooltip: false,
    isGameTimeout: false, // 标记游戏是否超过3分钟超时时间
    shouldShowGameQuitModal: false, // 标记是否应该显示退出弹窗
};

class GamePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...INITIAL_STATE,
            providerCode: props?.providerCode,
        };

        // 动画值
        this.animatedWidth = new Animated.Value(width);
        this.animatedHeight = new Animated.Value(height);

        this._onOrientationDidChange = this._onOrientationDidChange.bind(this);
        this.handleDepositOrPop = this.handleDepositOrPop.bind(this);
        this.onReceiveMessage = this.onReceiveMessage.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        const { allBalance } = this.props.userInfo;
        const { allBalance: prevAllBalance } = prevProps.userInfo;

        if (!_.isEqual(prevAllBalance, allBalance)) {
            this.getWalletCode();
        }

        if (prevState.orientation != this.state.orientation && this.state.orientation == "PORTRAIT") {
            this.renderNav(false);
            this.setState({
                isFull: false
            });
        }

        if (prevState.orientation != this.state.orientation && (this.state.orientation == "LANDSCAPE-LEFT" || this.state.orientation == "LANDSCAPE-RIGHT")) {
            this.renderNav(true);
            this.setState({
                isFull: true
            });
        }
    }

    async componentDidMount(props) {
        this.getWalletCode();

        let { categoryCode, providerCode } = this.props;
        if (categoryCode?.toLocaleUpperCase() == "SLOT") {
            this.quitModalTimer = setTimeout(() => {
                this.setState({ isGameTimeout: true });
            }, ExitGameTimeOut); // 3分钟
        }

        let navTitle = this.props.getCategoryName(categoryCode || providerCode);

        this.setState({
            navTitle
        }, () => {
            this.renderNav(false);
        });
        this.rotatePage();
        this.props.changeOnClickPopup({ flag: false });


        // 2400ms后隐藏tooltip (400ms + 2000ms)
        // await new Promise(resolve => setTimeout(() => {
        //     this.setState({ showDraggableTooltip: false });
        //     resolve();
        // }, 2000));

    }

    rotatePage() {
        Orientation.getAutoRotateState((isAutoRotateEnabled) => {
            if (isAutoRotateEnabled) {
                Orientation.unlockAllOrientations(); // ✅ 跟随系统设置
            } else {
                Orientation.lockToPortrait(); // ❌ 系统禁止旋转，强制竖屏
            }
        });

        Orientation.addOrientationListener(this._onOrientationDidChange);
    }

    _onOrientationDidChange(orientation) {
        this.setState({
            orientation: orientation,
        });
    }

    async componentWillUnmount() {
        // 清除3分钟计时器
        if (this.quitModalTimer) {
            clearTimeout(this.quitModalTimer);
        }


        Orientation.removeOrientationListener(this._onOrientationDidChange); // ✅ 正确移除监听器
        Orientation.lockToPortrait(); // ✅ 恢复竖屏

        HideNavBar(false);
        const { loadone, loadD } = this.state;
        this.props?.gameInfo_clear({});
        if (ApiPort.UserLogin && !loadD && loadone == 2) {
            this.props?.userInfo_getBalance();
        }
        this.props.changeOnClickPopup({ flag: false });

        let { categoryCode } = this.props;
        if (categoryCode?.toLocaleUpperCase() == "SLOT") {
            StorageUtil.save({
                key: _ALLSHARED_recentPlayed_Slot,
                data: localStorage.getItem(_ALLSHARED_recentPlayed_Slot),
            });
        }

    }


    async reloadGamePage2() {
        // 針對 小遊戲 重刷會失去token, 故重新拿link
        if (ApiPort.UserLogin) {
            this.props.changeOnClickPopup({ flag: false });
            this.props?.userInfo_getBalance();
        }

        await this.props.playGame({
            ...this.props.gameParams,
            isReloadGame: true
        });

        this.setState({
            gameKey: Math.random(),
            loadD: true,
            loadone: 1,
        });
    }

    _onLayout = event => {
        //获取高度，，横屏竖屏展示游戏
        let { width, height } = event.nativeEvent.layout;
        const { widthS, heightS, isFull } = this.state;

        // 防抖处理，避免频繁触发
        if (this.layoutTimer) {
            clearTimeout(this.layoutTimer);
        }

        // 立即更新尺寸，延迟执行其他操作
        this.setState({ heightS: height, widthS: width });
    };


    renderNav(hideNavBar) {
        const { navTitle } = this.state;
        const { gameInfo, navigation, categoryCode } = this.props;
        const title = gameInfo?.gameName || navTitle;

        if (!navigation) return;

        const leftButton = () => (
            <GamePageNavLeft
                title={title}
                //showRefresh={!ApiPort.UserLogin}
                onLeft={() => {
                    if (this.state.isGameTimeout) {
                        this.setState({ shouldShowGameQuitModal: true });
                    } else {
                        Actions.pop();
                    }

                    ApiPort.UserLogin &&
                        this.props.changeOnClickPopup({
                            flag: false,
                        });
                }}
                refreshCallBack={this.piwikReloadCallBack}
            />
        );

        const rightButton = () => (
            <GamePageNavRight
                type='more'
                showRefresh={true}
                showCs={!ApiPort.UserLogin}
                expandCallBack={this.piwikGameNavRight.bind(this)}
                csCallBack={this.piwikGameNavRight.bind(this)}
                refreshCallBack={this.piwikReloadCallBack}
                loginCallBack={() => {
                    PiwikEventDataHandle({
                        category: `In${categoryCode}`,
                        action: "Go to Login",
                        name: `In${categoryCode}_C_Login`,
                        path: `in${categoryCode}_${title}`,
                        title: `In${categoryCode} ${title}`
                    });
                }}
                registCallBack={() => {
                    PiwikEventDataHandle({
                        category: `In${categoryCode}`,
                        action: "Go to Register",
                        name: `In${categoryCode}_C_Register`,
                        path: `in${categoryCode}_${title}`,
                        title: `In${categoryCode} ${title}`
                    });
                }}
            >
                {
                    this.state.showMoneyTooltip &&
                    <View style={styles.notificationDot}></View>
                }

                {/* <CustomTooltip
                    isShowCloseImg={true}
                    textStyle={styles.tipText}
                    containerStyle={{
                        width: 0.9 * width,
                        paddingTop: 15,
                        left: window.LANGUAGE == "TH" ? 0 : 20,
                        paddingRight: 25,
                    }}
                    Icon={
                        <View style={styles.notificationDot}></View>
                    }
                    text={translate("[总投注金额] 为您在本站所有游戏平台的下注总额。[总输/赢] 为您在本站所有游戏平台的输赢总额")}></CustomTooltip> */}

            </GamePageNavRight>
        );

        navigation.setParams({
            hideNavBar,
            leftButton,
            rightButton,
        });
        HideNavBar(hideNavBar);
    }



    piwikReloadCallBack = () => {
        this.reloadGamePage2();
        let { categoryCode } = this.props;
        const { navTitle } = this.state;
        const title = this.props?.gameInfo?.gameName || navTitle;
        PiwikEventDataHandle({
            category: `In${categoryCode}`,
            action: "Refresh Game",
            name: `In${categoryCode}_C_Refresh_Game`,
            path: `in${categoryCode}_${title}`,
            title: `In${categoryCode} ${title}`
        });
    };

    checkNavigationStateChangeUrl(onNavigationStateChangeData) {
        let { url = "", loading, canGoBack, navigationType, target } = onNavigationStateChangeData;
        const { common_url } = window;
        let tempUrl = url?.toLocaleLowerCase();
        let [newTempUrl1 = "", newTempUrl2 = ""] = tempUrl.split("://");
        let [newUrlStr1 = "", newUrlStr2 = ""] = newTempUrl2.split(".com/");
        let [common_urlStrTemp1 = "", common_urlStrTemp2 = ""] = common_url.split("://");
        let [common_urlStr1 = "", common_urlStr2 = ""] = common_urlStrTemp2.split(".com");
        return newUrlStr1?.toLocaleLowerCase() === common_urlStr1?.toLocaleLowerCase();
    }

    getWalletCode() {
        if (!ApiPort.UserLogin) return;
        let { categoryCode } = this.props;
        categoryCode = categoryCode?.toLocaleUpperCase();
        let { balanceTotal = 0, allBalance = [] } = this.props.userInfo;
        let { walletCode, walletProductGroupId } = ProductMapWalletCode[this.props?.providerCode === "JIF" ? "P2P" : categoryCode];
        let balanceItem = allBalance.find(v => v.walletProductGroupId === walletProductGroupId || v?.walletProductGroupName?.toLocaleUpperCase().replace(/\s+/g, "") === walletCode) || {};

        this.setState({
            balanceItem,
        });
        if ((balanceTotal < MIN_LIMIT_MONEY[window.LANGUAGE])) {
            this.setState({
                showMoneyTooltip: true,
            }, async () => {
                this.renderNav(this.state.isFull);
                await new Promise(resolve => setTimeout(() => {
                    this.setState({
                        showMoneyTooltip: false
                    }, () => {
                        this.renderNav(this.state.isFull);
                    });
                    resolve();
                }, 4000));
            });
        }
    }

    onReceiveMessage(event) {
        const data = event.nativeEvent.data;
        let lastData = JSON.parse(data);
        switch (lastData.type) {
            case "GalaxsysHome":
                Actions.Home();
                break;
        }
    }

    handleDepositOrPop(onNavigationStateChangeData) {
        let { isAlreadyExited } = this.state;
        let { url } = onNavigationStateChangeData;
        let provider = this.props?.providerCode;
        if (provider === "AGL") {
            //IMOPT  BSG  EVORT  EVO  MGP
            if (url?.includes("@method=et")) {
                this.goPopPage();
                return;
            }
        }

        let isSameUrl = this.checkNavigationStateChangeUrl(onNavigationStateChangeData);
        if (!isAlreadyExited && isSameUrl) {
            if (provider === "GLX") return;
            this.goDepositGage(provider);
            return;
        }
    }

    goPopPage() {
        Actions.pop();
        this.setState({
            isAlreadyExited: true,
        });
    }

    goDepositGage() {
        let { walletCode } = this.state;
        this.props?.changeOnClickPopup({
            walletCode,
            flag: true,
        });
        this.setState({
            isAlreadyExited: false,
        });
        this.reloadGamePage2();
    }

    piwikGameNavRight = ({ type = "cs" }) => {
        const { categoryCode = "" } = this.props;
        let provider = this.props?.providerCode || "";
        const tempData = "In" + categoryCode;
        if (tempData) {
            if (type == "cs") {
                PiwikEventDataHandle({
                    category: tempData,
                    action: "Contact CS",
                    name: `${tempData}_C_CS`,
                    path: tempData,
                    title: tempData?.toLocaleLowerCase(),
                });
            } else if (type == "expand") {
                PiwikEventDataHandle({
                    category: tempData,
                    action: "Expand Side Menu",
                    name: `${tempData}_${provider}_C_SideMenu`,
                    path: tempData,
                    title: tempData?.toLocaleLowerCase(),
                });
            }
        }
    };

    render() {
        const { GameOpenUrl = "" } = this.props?.game || {};
        const { isFull, loadone, loadD, gameKey, widthS, heightS, orientation, balanceItem, navTitle } = this.state;
        const { providerCode, userSetting, navigation, categoryCode } = this.props;

        const isSbAirCraft = navigation?.state.routeName === "SbAirCraftWrap";
        const isVTG = providerCode === "VTG";
        const isPgsHtml = providerCode === "PGS" && !["http", "https"]?.includes(GameOpenUrl.split(":")[0]?.toLocaleLowerCase());

        let openUrl = this.getGameUrl(GameOpenUrl);

        const injectedJavascript = this.getInjectedJavascript();

        const webViewHeight = heightS - (widthS < heightS && window.DeviceInfoIos ? DeviceInfoIosHeight : 0);
        const webViewWidth = widthS - (orientation === "LANDSCAPE-LEFT" && window.DeviceInfoIos ? DeviceInfoIosHeight : 0);

        return (
            <View style={styles.container} onLayout={this._onLayout}>
                {isSbAirCraft && this.renderTopNav(navTitle)}
                {
                    this.state.shouldShowGameQuitModal &&
                    <GameQuitModal
                        gameType="Slot"
                        gameInfo={this.props.gameInfo}
                        providersMap={this.props.getSubProvidersMap("slot")}
                        onExit={() => {
                            this.setState({ shouldShowGameQuitModal: false });
                            Actions.pop();
                        }}
                        onGameInfoClick={(gameInfo) => {
                            Actions.GameInforPage({
                                categoryCode,
                                productGamePageInfor: gameInfo
                            });
                        }}
                        onClose={() => {
                            this.setState({ shouldShowGameQuitModal: false });
                        }}
                    />
                }


                {
                    this.state.showMoneyTooltip &&
                    <View style={styles.tooltipContainer1}>
                        <View style={styles.tooltipArrow1}></View>

                        <Text style={styles.tooltipText1}>{translate("余额不足，请存款")}</Text>
                    </View>
                }


                <View
                    style={[
                        styles.webViewContainer,
                        {
                            width: webViewWidth,
                            height: webViewHeight,
                            paddingLeft: orientation === "LANDSCAPE-LEFT" && window.DeviceInfoIos ? DeviceInfoIosHeight : 0,
                        }
                    ]}>
                    {Boolean(GameOpenUrl) && (
                        <WebView
                            key={gameKey}
                            onLoadStart={() => this.setState({ loadD: true })}
                            onLoadEnd={() => this.setState({ loadD: false, loadone: 2 })}
                            source={
                                isPgsHtml
                                    ? { html: openUrl }
                                    : !isVTG
                                        ? { uri: openUrl, baseUrl: SBTDomain }
                                        : {
                                            html: openUrl,
                                            baseUrl: SBTDomain,
                                        }
                            }
                            onNavigationStateChange={this.handleDepositOrPop}
                            injectedJavaScript={injectedJavascript}
                            onMessage={this.onReceiveMessage}
                            mixedContentMode="always"
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            originWhitelist={["*"]}
                            scalesPageToFit={false}
                            allowsInlineMediaPlayback
                            mediaPlaybackRequiresUserAction={false}
                            allowFileAccess
                            // 性能优化配置
                            cacheEnabled={true}
                            startInLoadingState={false}
                            renderToHardwareTextureAndroid={true}
                            removeClippedSubviews={true}
                            bounces={false}
                            scrollEnabled={true}
                            // 新增性能优化配置
                            androidHardwareAccelerationDisabled={false}
                            androidLayerType="hardware"
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            decelerationRate="normal"
                            overScrollMode="never"
                            // 横屏滚动优化
                            contentInsetAdjustmentBehavior="never"
                            automaticallyAdjustContentInsets={false}
                            keyboardDisplayRequiresUserAction={false}
                            style={[
                                styles.webView,
                                {
                                    width: webViewWidth,
                                    height: webViewHeight,
                                }
                            ]}
                        />
                    )}
                    <LoadIngWebViewGif loadStatus={loadD && loadone === 1} />

                    {ApiPort.UserLogin && userSetting?.oneClickPopup?.flag && (
                        <OneWallet
                            fromPage={isSbAirCraft ? "SB2" : ""}
                            top={0}
                            balanceItem={balanceItem}
                            categoryCode={providerCode === "JIF" ? "P2P" : this.props.categoryCode}
                            wrapStyle={{ width: widthS, height: heightS }}
                            style={[
                                styles.oneWallet,
                                {
                                    width: heightS > widthS ? widthS * 0.9 : widthS * 0.45,
                                }
                            ]}
                            piwikGameCategory={this.props.gameInfo?.category || ""}
                        />
                    )}
                </View>

                {/* 缩放按钮 - 放在最后确保最高层级 */}
                {/* 暂时隐藏缩放按钮 (CXF1-7958) */}

                {/* {
                    !isSbAirCraft && !userSetting?.oneClickPopup?.flag &&
                    <Draggable
                        key={orientation}
                        x={widthS - 16 - ZoomIconWidth}
                        y={isFull && window.DeviceInfoIos && orientation == "PORTRAIT" ? 46 : 16}
                        minX={0}
                        maxX={widthS - ZoomIconWidth}
                        minY={isFull && window.DeviceInfoIos && orientation == "PORTRAIT" ? 46 : 0}
                        maxY={heightS - ZoomIconWidth}>
                        <View pointerEvents="box-none">
                            <ColumnCenterCenter style={styles.zoomBox} onPress={() => {
                                this.setState({
                                    isFull: !isFull
                                }, () => {
                                    this.renderNav(!isFull);
                                });
                                const title = this.props?.gameInfo?.gameName || navTitle;
                                PiwikEventDataHandle({
                                    category: `In${categoryCode}`,
                                    action: "Expand Fullscreen",
                                    name: `In${categoryCode}_C_Fullscreen`,
                                    path: `in${categoryCode}_${title}`,
                                    title: `InGameCategory ${title}`
                                });
                            }}>
                                {
                                    isFull
                                        ?
                                        <ZoomOutIcon />
                                        :
                                        <ZoomInIcon />
                                }
                            </ColumnCenterCenter>

                            {
                                this.state.showDraggableTooltip &&
                                <View style={styles.tooltipContainer}>
                                    <View style={styles.tooltipArrow}></View>

                                    <Text style={styles.tooltipText}>{translate("拖动以重新定位")}</Text>
                                </View>
                            }
                        </View>
                    </Draggable>
                } */}

            </View>
        );
    }

    renderTopNav(navTitle) {
        return (
            <View>
                <View
                    style={[
                        styles.statusBarSpace,
                        { backgroundColor: Color.theme }
                    ]}></View>
                <RowCenterBetween
                    style={[styles.topNav, { paddingLeft: 10 }]}>
                    <GamePageNavLeft
                        action={""}
                        title={navTitle}
                        refreshCallBack={this.piwikReloadCallBack}
                    />
                    <GamePageNavRight
                        //showRefresh={true}
                        type='more'
                        expandCallBack={this.piwikGameNavRight.bind(this)}
                        csCallBack={this.piwikGameNavRight.bind(this)}
                        refreshCallBack={this.piwikReloadCallBack}
                    />
                </RowCenterBetween>
            </View>
        );
    }

    getGameUrl(GameOpenUrl) {
        const { providerCode, isJackPot } = this.props;

        if (providerCode === "OWS" && isJackPot) {
            return mergeUrls(GameOpenUrl);
        } else if (providerCode == "SAL") {
            return this.getSALUrl(this.props.gameRescult);
        } else if (providerCode == "SBT") {
            return this.getSBTUrl(GameOpenUrl);
        } else {
            return GameOpenUrl;
        }
    }


    getSALUrl = (data) => {
        let { gameLobbyUrl = "", sagDetails = {} } = data;
        const { language = "", lobby = "", options = "", token = "", username = "" } = sagDetails;
        return `${gameLobbyUrl}?username=${username}&token=${token}&lobby=${lobby}&lang=${language}`;
    };

    getSBTUrl(GameOpenUrl) {
        const { SBTDomain, common_url } = window;
        const token = ApiPort.Token;
        const referUrl = `ReferURL=${encodeURIComponent(SBTDomain)}`;
        const apiUrl = `APIUrl=${encodeURIComponent(bffsc_url)}`;
        const memberToken = `MemberToken=${encodeURIComponent(token)}`;
        //https://arcadie.atlassian.net/browse/INCIDENT-68692
        // BTI 余额刷新问题
        //语言不同， 路径还不一样， 哎
        // F1-STATIC
        // ├── Assets
        // │   └── Scripts
        // │       └── int
        // │           ├── btiv3.js
        // │           ├── btiv3th.js
        // │           ├── btiv3vn.js
        let realGameOpenUrl = window.LANGUAGE == "CN" ? GameOpenUrl : GameOpenUrl.replace(/btiv3/i, "btiv3" + window.LANGUAGE.toLocaleLowerCase());
        return `${realGameOpenUrl}&${referUrl}&oddsstyleid=3&${apiUrl}&${memberToken}`;
    }

    getInjectedJavascript() {
        const { providerCode } = this.props;

        if (providerCode === "GLX") {
            return `(function() {
                window.addEventListener('message', (event) => {
                    window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(event.data));
                });
            })();`;
        }

        if (providerCode === "IPSB") {
            return `(function() {
                document.querySelectorAll('iframe').forEach(iframe => {
                    iframe.setAttribute('allow', 'autoplay');
                });
            })();
            true;`;
        }

        return "";
    }
}

const mapStateToProps = state => ({
    userInfo: state.userInfo,
    game: state.game,
    userSetting: state.userSetting,
});
const mapDispatchToProps = dispatch => ({
    userInfo_login: userName => actions.ACTION_UserInfo_login(userName),
    userInfo_getBalance: (forceUpdate = false) => dispatch(actions.ACTION_UserInfo_getBalanceAll(forceUpdate)),
    userInfo_updateBalance: newBalance => dispatch(actions.ACTION_UserInfo_updateBalance(newBalance)),
    gameInfo_update: gameObj => dispatch(actions.ACTION_GetCurrentGameInfo(gameObj)),
    gameInfo_clear: gameObj => dispatch(actions.ACTION_InitialGameInfo(gameObj)),
    ACTION_GameWalletInfo: gameWallet => {
        dispatch(actions.ACTION_GameWalletInfo);
    },
    changeOnClickPopup: flag => {
        dispatch(actions.ACTION_ONECLICKPOPUP(flag));
    },
    playGame: data => dispatch(actions.ACTION_PlayGame(data)),
});

const ConnectedGamePage = connect(mapStateToProps, mapDispatchToProps)(GamePage);

// 用 GamePageWrapper 包裝 GamePage
const WrappedGamePage = (props) => (
    <GamePageWrapper>
        <ConnectedGamePage {...props} />
    </GamePageWrapper>
);

export default WrappedGamePage;
export { GamePageWrapper };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000"
    },
    webViewContainer: {
        flex: 1,
        backgroundColor: "#000",
    },
    webView: {
        flex: 1,
        backgroundColor: "#000",
    },
    oneWallet: {
        height: "100%",
        position: "absolute",
        right: 0,
    },
    notificationDot: {
        backgroundColor: "#FABE47",
        borderRadius: 9999,
        width: 4,
        height: 4,
        position: "absolute",
        top: 10,
        right: 0,
        zIndex: 9
    },
    tooltipContainer1: {
        backgroundColor: "#222",
        padding: 16,
        borderRadius: 10,
        alignSelf: "flex-start",
        position: "absolute",
        right: 0,
        top: 20,
        zIndex: 999999
    },
    tooltipArrow1: {
        borderTopColor: "transparent",
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: "#222",
        position: "absolute",
        top: -16,
        right: 10,
        width: 0,
        height: 0,
        borderStyle: "solid",
        borderWidth: 8,
    },
    tooltipText1: {
        fontSize: 14,
        fontWeight: "400",
        color: "white"
    },
    tooltipContainer: {
        backgroundColor: "#222",
        padding: 16,
        borderRadius: 10,
        alignSelf: "flex-start",
        position: "absolute",
        right: -ZoomIconWidth,
        top: ZoomIconWidth + 10
    },
    tooltipArrow: {
        borderTopColor: "transparent",
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: "#222",
        position: "absolute",
        top: -16,
        right: 10,
        width: 0,
        height: 0,
        borderStyle: "solid",
        borderWidth: 8,
    },
    tooltipText: {
        fontSize: 14,
        fontWeight: "400",
        color: "white"
    },
    statusBarSpace: {
        height: Platform.OS == "ios" ? (window.DeviceInfoIos ? 40 : 20) : 0,
    },
    topNav: {
        width: "100%",
        height: 46,
        zIndex: 100,
        position: "relative",
        backgroundColor: Color.theme,
    },
    zoomBox: {
        backgroundColor: "rgba(0, 0, 0, .6)",
        width: ZoomIconWidth,
        height: ZoomIconWidth,
        borderRadius: 9999,
        position: "absolute",
        elevation: 9999,
        zIndex: 9999999
    },
    // 新增函數組件的樣式
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000"
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000"
    },
    wrapperContainer: {
        flex: 1
    }
});