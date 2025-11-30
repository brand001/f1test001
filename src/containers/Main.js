import React from "react";
import { BackHandler, Dimensions, Image, Platform, StyleSheet, TouchableOpacity, AppState, View } from "react-native";
import DeviceInfo, { getDeviceId } from "react-native-device-info"; //獲取設備信息
import { connect } from "react-redux";
import Orientation from "react-native-orientation-locker";
import { Actions, Lightbox, Modal, Router, Scene, Stack } from "react-native-router-flux";

import { translate } from "$locales/translate";
import { CheckLogin, GoSmartico, LogoutUtil } from "$Utils";

import actions from "@/lib/redux/actions/index";

import { hideAllModals } from "$Utils/globalModal";
import { LogoIcon } from "$Components/icons/index";



import Login from "./Login/Login";
import ForgetName from "./Login/ForgetName";
import LoginTouch from "./LoginPage/LoginTouch";
import LoginPattern from "./LoginPage/LoginPattern";
import SetLogin from "./LoginPage/SetLogin";
import FastLogin from "./LoginPage/FastLogin";
import LoginOtp from "./LoginOtp/index.js";
import SecurityNotice from "./LoginOtp/SecurityNotice";
import SetPassword from "./RestPassword/SetPassword";
import CustomWebView from "../components/CustomWebView";



import PromoTab from "./PromoTab/index";
import PromotionsDetail from "./PromoTab/PromotionsDetail.js";
import ApplyManual from "./PromoTab/ApplyManual";
import ApplyBonus from "./PromoTab/ApplyBonus";
import ConfirmBonus from "./PromoTab/BonusList/ConfirmBonus";
import RecordDetail from "../components/RecordDetail";
import PromotionsAddress from "./Profile/PromotionsAddress";
import Newaddress from "./Profile/PromotionsAddress/Newaddress.js";


import Smartico from "./Smartico";
import { GetSbComponents } from "$Utils/SbSportsBridge";
import GamePage from "./Game/GamePage";
import ProductIntro from "./Game/ProductIntro/ProductIntro";
import ProductGamePage from "./Game/ProductGamePage/index";
import GameInforPage from "./Game/GameInforPage.js";
import GameSearchPage from "./Game/GameSearchPage.js";
import GameListPage from "./Game/GameListPage";
import GameLobbyPage from "./Game/GameLobbyPage";
import GameFilterPage from "./Game/GameFilterPage";

import Home from "./Home/index";



import LiveChatMain from "./LiveChat/index.js";
import DeviceInformation from "./LiveChat/DeviceInformation.js";
import AmityChat from "./LiveChat/AmityChat";
import RestrictPage from "./LiveChat/RestrictPage.js"; //限制页面


import BettingRecord from "./BettingRecord/index";


import NotificationDetail from "./notificationDetail";

import User from "./Profile";
import UserInfor from "./Profile/UserInfo";
import SecurityCheck from "./Profile/SecurityCheck";
import VIP from "./Profile/VIP/index";
import UserUpdateInfo from "./Profile/UserInfo/UserUpdateInfo";
import ChangePassword from "./Profile/UserInfo/ChangePassword";
import SecurityQuestion from "./Profile/UserInfo/SecurityQuestion";
import AboutUSDT from "./Profile/AboutUSDT/index";
import USDTHelpCenter from "./Profile/AboutUSDT/USDTHelpCenter";
import USDTWalletProtocols from "./Profile/AboutUSDT/USDTWalletProtocols";
import UsdtGuide from "./Profile/AboutUSDT/UsdtGuide";
import LanguageSetting from "./Profile/LanguageSetting";
import UserRule from "./Profile/UserRule.js";

import LockedBalance from "./Profile/LockedBalance";
import SelfExclusion from "./Profile/SelfExclusion/SelfExclusion";
import SecurityCode from "./Profile/SecurityCode.js";
import UploadFile from "./Profile/UploadFile";
import UploadExample from "./Profile/UploadFile/UploadExample";
import UploadFileGuide from "./Profile/UploadFile/UploadFileGuide";
import News from "./Profile/News";
import NewsDetail from "./Profile/News/NewsDetail";
import PromotionMsgDetail from "./Profile/News/PromotionMsgDetail";

import Verification from "./Verification";

import Sponsor from "./Profile/Sponsor";
import Recommend from "./Profile/Recommend";
import RecommendPage from "./Profile/Recommend/RecommendPage";

import MobileVerificationMethod from "./MobileVerificationMethod/MobileVerificationMethod";
import OTPLimitExceed from "./OTPLimitExceed";


import DepositCenter from "./Bank/DepositCenter";
import WithdrawCenter from "./Bank/WithdrawCenter";
import Recordes from "./Bank/Recordes";
import BankCard from "./Bank/BankCard";


import TabIcon from "./TabIcon.js";

const RouterWithRedux = connect()(Router);

import { LiveChatPagePiwik, PiwikEventDataHandle } from "@/actions/PiwikEventData";
import LiveChat from "$Components/LiveChat";
import NavBack from "$Components/Nav/NavBack.js";
import Color from "$Components/Color";
import { ColumnCenterCenter } from "$Components/CustomView";


let backTime = 0;
let lastBackPressed = 0;

//6小时-5分钟
const END_HOURS = 21300000;

// 定义禁止返回键的页面列表
const DISABLED_BACK_PAGES = [
    "RestrictPage"
];

const onBackPress = () => {
    if (Platform.OS === "android") {
        // 获取当前路由名称
        const currentRouteName = Actions.currentScene;

        // 检查当前页面是否在禁止返回的列表中
        if (DISABLED_BACK_PAGES.includes(currentRouteName)) {
            // 禁止返回，直接返回 true 阻止默认行为
            return true;
        }

        const now = new Date().getTime();
        if (now - lastBackPressed < 500) {
            // 两次按下的时间小于2秒，执行退出
            BackHandler.exitApp();
            return true;
        }

        lastBackPressed = now;

        // if (Actions.state.index == 0) {
        //     // 在首页显示提示
        //     Toasts.info(translate("再按一次退出应用"), 2);
        //     return true;
        // }

        // 非首页，执行返回上一页
        Actions.pop();
        return true;
    }
    return true;
};

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            random: Math.random(),
            isDynamicIslandIOS: false, // ios手机型号動態島的樣式
            oldIos: false, //舊的ios手机型号
        };

        this.appState = AppState.currentState;
        this.tokenDownTime = null;
        this.lastBackgroundTime = null;
    }
    componentDidMount() {
        Orientation.lockToPortrait();
        this.getDeviceInfoIos();
        this.getDeviceBrand();


        this.subscription = AppState.addEventListener("change", this.handleAppStateChange);
    }


    //6小时-5分钟更新token
    ReloadToken59 = (times = END_HOURS) => {
        this.tokenDownTime && clearTimeout(this.tokenDownTime);
        this.tokenDownTime = null;
        this.tokenDownTime = setTimeout(() => {
            this.ReloadTokenB();
        }, times);
    };
    handleAppStateChange = (nextAppState) => {
        if ((this.appState === "background" || this.appState === "inactive") && nextAppState === "active") {
            if (this.lastBackgroundTime) {
                const countdown = END_HOURS - (Date.now() - this.lastBackgroundTime);
                if (countdown < 0) {
                    //app回到前台，并且时间大于6h -5m，直接登出
                    LogoutUtil();
                } else {
                    //没超出时间就重新加入倒计时
                    this.ReloadToken59(countdown);
                }
            }
        }
        this.appState = nextAppState;
    };

    ReloadTokenB() { //重新獲取token
        let data = {
            "grantType": "refresh_token",
            "clientId": window.DefaultConfig.clientId,
            "clientSecret": window.DefaultConfig.clientSecret,
            "refreshToken": ApiPort.ReToken
        };
        if (this.lastBackgroundTime && (Date.now() - this.lastBackgroundTime > (END_HOURS + 5000))) {
            //超过6h-5m，token过期，直接登出
            LogoutUtil();
            return;
        }
        if (!ApiPort.UserLogin) { return; }

        fetchRequest(ApiPort.ReTokenApi, "POST", data)
            .then(data => {
                if (data.accessToken) {
                    ApiPort.Token = data.tokenType + " " + data.accessToken;
                    ApiPort.ReToken = data.refreshToken;
                    // ApiPort.LogoutTokey = data.refreshToken
                    // ApiPort.access_token = data.accessToken
                    this.ReloadToken59(END_HOURS);
                    this.lastBackgroundTime = Date.now();//开始时间，时间超过6h-5m, 直接登出
                } else {
                    LogoutUtil();
                }
            }).catch(error => {
                LogoutUtil();
            });
    }


    //判断iphonex以上型号
    getDeviceInfoIos = () => {
        const getModel = DeviceInfo.getModel();
        if (Platform.OS === "android") {
            window.DeviceInfoIos = false;
        } else {
            //ios手机型号是有指纹的
            let iphoneXMax = ["iPhone 5", "iPhone 5s", "iPhone 6", "iPhone 6s", "iPhone 6s Plus", "iPhone 7", "iPhone 7 Plus", "iPhone 8", "iPhone 8 Plus", "iPhone SE"];

            //ios手机型号是有動態島的
            let iphoneDynamic = [
                "iPhone 14 Pro",
                "iPhone 14 Pro Max",
                "iPhone15,2", // iPhone 14 Pro
                "iPhone 15 Pro",
                "iPhone15,3", // iPhone 14 Pro Max
                "iPhone15,4", // iPhone 15
                "iPhone15,5", // iPhone 15 Plus
                "iPhone16,1", // iPhone 15 Pro
                "iPhone16,2", // iPhone 15 Pro Max
                "iPhone17,1", // iPhone 16
                "iPhone17,2", // iPhone 16 Plus
                "iPhone17,3", // iPhone 16 Pro
                "iPhone17,4", // iPhone 16 Pro Max
                "iPhone 17 Pro",
                "iPhone 17 Pro Max",
                "iPhone18,1", // iPhone 16
                "iPhone18,2", // iPhone 16 Plus
                "iPhone18,3", // iPhone 16 Pro
                "iPhone18,4", // iPhone 16 Pro Max
            ];
            // 由於 getModel 拿不到iPhone 14 Pro 型號, 改用 getDeviceId
            const getIphoneDynamic = getDeviceId();
            const getModel = DeviceInfo.getModel();

            if (iphoneDynamic.includes(getIphoneDynamic)) {
                this.setState({ isDynamicIslandIOS: true });
                window.isDynamicIslandIOS = true;
            }

            if (iphoneXMax.includes(getModel)) {
                this.setState({ oldIos: true });
                window.DeviceInfoIos = false;
            }
        }

        window.deviceModel = DeviceInfo.getModel();
        window.osVersion = DeviceInfo.getSystemVersion();
    };

    getDeviceBrand = () => {
        window.deviceBrand = Platform.OS == "ios" ? DeviceInfo.getManufacturerSync() || DeviceInfo.getManufacturer() : "Google";
    };


    // 提取内联函数到组件方法
    renderNavBack = () => <NavBack />;

    renderLiveChatIcon = (type) => {
        return (
            <LiveChat
                wrapStyle={{ marginRight: 10 }}
                callBack={() => {
                    LiveChatPagePiwik(type);
                }}
            />
        );
    };

    renderLiveChatIconWithVip = (type) => () => (
        <LiveChat
            wrapStyle={{ marginRight: 10 }}
            callBack={() => {
                LiveChatPagePiwik(type);
            }}
            showVip={true}
        />
    );


    renderLogoTitle = () => (
        <LogoIcon
            scale={window.LANGUAGE === "CN" ? 1 : 0.7}
        />
    );

    renderLeftLogo = () => (
        <ColumnCenterCenter style={{ marginLeft: 10, height: "100%" }}
            onPress={() => {
                Actions.Home();
            }}
        >
            <LogoIcon
                scale={window.LANGUAGE === "CN" ? 1 : 0.65}
            />
        </ColumnCenterCenter>
    );

    renderNull = () => null;

    renderNavBackWithClose = () => <NavBack action="close" />;

    // 优化 tabBarOnPress 方法
    handleHomeTabPress = () => {
        Actions.jump("Home");
        window.CheckUptateGlobe && window.CheckUptateGlobe(false);
        this.props.getCmsMainsiteStatus();
        PiwikEventDataHandle("NavBar1");
    };

    handlePromotionTabPress = () => {
        Actions.jump("Promotion");
        window.CheckUptateGlobe && window.CheckUptateGlobe(false);
        this.props.getCmsMainsiteStatus();
        PiwikEventDataHandle("NavBar2");
    };

    handleBettingRecordTabPress = () => {
        Actions.jump("BettingRecord");
        window.CheckUptateGlobe && window.CheckUptateGlobe(false);
        this.props.getCmsMainsiteStatus();
        PiwikEventDataHandle("NavBar3");
    };

    handleBettingRecordTabPressLogin = () => {
        CheckLogin();
        window.CheckUptateGlobe && window.CheckUptateGlobe(false);
        this.props.getCmsMainsiteStatus();
        PiwikEventDataHandle("NavBar3");
    };

    handleSmarticoTabPress = async () => {
        PiwikEventDataHandle("NavBar4");
        await this.props.getCmsMainsiteStatus();
        GoSmartico();
    };

    handleSmarticoTabPressLogin = async () => {
        PiwikEventDataHandle("NavBar4");
        await this.props.getCmsMainsiteStatus();
        GoSmartico({
            isLoginCallBack: true,
        });
    };

    handlePersonalTabPress = () => {
        Actions.jump("Personal");
        window.CheckUptateGlobe && window.CheckUptateGlobe(false);
        this.props.getCmsMainsiteStatus();
        PiwikEventDataHandle("NavBar5");
    };

    render() {
        const { isDynamicIslandIOS, oldIos } = this.state;

        // 优化tabBarHeight计算
        const tabBarHeight = Platform.OS === "ios" ?
            (oldIos ? 50 : (isDynamicIslandIOS ? 70 : 50)) : 50;

        // 提取SB组件 - 避免每次渲染重新解构
        const { SbTabBar, SbSports, Rules, BetTutorial, Betting_detail, betRecord, search, Setting, SetTingModle, NewsSb, NewsDetailSb, DrawerContent } = GetSbComponents(window.LANGUAGE);

        // 优化窗口重载token函数
        window.ReloadToken = () => {
            this.lastBackgroundTime = Date.now();
            this.ReloadToken59(END_HOURS);
        };

        // 优化导航栏样式
        const navigationBarStyle = getNavigationBarStyle(DeviceInfoIos, window.isDynamicIslandIOS);

        const tabBarStyleWithHeight = [styles.tabBarStyle, { height: tabBarHeight }];

        return (
            <RouterWithRedux
                backAndroidHandler={onBackPress}
                onStateChange={(prevState, newState, action) => {
                    this.props.setRouterName(action?.routeName);
                    if (action?.routeName == "Home" || action?.type.includes("BACK")) {
                        console.log("BOOOOOOOOOOO");
                        this.props.getCmsMainsiteStatus(true);
                    }
                    hideAllModals();
                }}>
                <Modal key="modal" hideNavBar>
                    <Lightbox key="lightbox">
                        <Stack
                            key="root"
                            navigationBarStyle={navigationBarStyle}
                            headerLayoutPreset="center"
                            hideNavBar
                        >
                            <Stack key="drawer" panHandlers={null} hideNavBar initial={this.props.scene === "drawer"}>
                                {ApiPort.UserLogin ? (
                                    <Scene
                                        key="tabbar"
                                        tabs={true}
                                        tabBarPosition="bottom"
                                        showLabel={false}
                                        tabBarStyle={tabBarStyleWithHeight}
                                        tabBarSelectedItemStyle={styles.tabBarSelectedItemStyle}
                                        sceneStyle={styles.sceneStyle}
                                        titleStyle={styles.titleStyle}>
                                        <Scene
                                            key="Home"
                                            component={Home}
                                            icon={TabIcon}
                                            tabBarOnPress={this.handleHomeTabPress}
                                            title={" "}
                                            titleStyle={styles.titleStyle}
                                        />
                                        <Scene
                                            key="Promotion"
                                            component={PromoTab}
                                            icon={TabIcon}
                                            tabBarOnPress={this.handlePromotionTabPress}
                                            title={" "}
                                            titleStyle={styles.titleStyle}
                                        />
                                        <Scene
                                            key="BettingRecord"
                                            component={BettingRecord}
                                            icon={TabIcon}
                                            tabBarOnPress={this.handleBettingRecordTabPress}
                                            title={" "}
                                            titleStyle={styles.titleStyle}
                                        />
                                        <Scene
                                            key="Smartico"
                                            component={Smartico}
                                            icon={TabIcon}
                                            tabBarOnPress={this.handleSmarticoTabPress}
                                            title={" "}
                                            titleStyle={[styles.titleStyle, { zIndex: 9999 }]}
                                        />
                                        <Scene
                                            key="Personal"
                                            component={User}
                                            icon={TabIcon}
                                            tabBarOnPress={this.handlePersonalTabPress}
                                            title={" "}
                                            titleStyle={styles.titleStyle}
                                        />
                                    </Scene>
                                ) : (
                                    <Scene
                                        key="tabbar"
                                        tabs={true}
                                        tabBarPosition="bottom"
                                        showLabel={false}
                                        tabBarStyle={tabBarStyleWithHeight}
                                        tabBarSelectedItemStyle={styles.tabBarSelectedItemStyle}
                                        titleStyle={styles.titleStyle}>
                                        <Scene
                                            key="Home"
                                            component={Home}
                                            icon={TabIcon}
                                            tabBarOnPress={this.handleHomeTabPress}
                                            // hideNavBar
                                            title={" "}
                                            titleStyle={styles.titleStyle}
                                        />
                                        <Scene
                                            key="Promotion"
                                            component={PromoTab}
                                            icon={TabIcon}
                                            tabBarOnPress={this.handlePromotionTabPress}
                                            title={" "}
                                            titleStyle={styles.titleStyle}
                                        />
                                        <Scene
                                            key="BettingRecord"
                                            component={BettingRecord}
                                            icon={TabIcon}
                                            tabBarOnPress={this.handleBettingRecordTabPressLogin}
                                            title={" "}
                                            titleStyle={styles.titleStyle}
                                        />
                                        <Scene
                                            key="Smartico"
                                            component={User}
                                            icon={TabIcon}
                                            tabBarOnPress={this.handleSmarticoTabPressLogin}
                                            title={" "}
                                            titleStyle={[styles.titleStyle, { zIndex: 9999 }]}
                                        />
                                        <Scene
                                            key="Personal"
                                            component={User}
                                            icon={TabIcon}
                                            tabBarOnPress={this.handlePersonalTabPress}
                                            title={" "}
                                            titleStyle={styles.titleStyle}
                                        />
                                    </Scene>
                                )}
                            </Stack>

                            {/* login */}
                            <Stack
                                key="Login"
                                headerLayoutPreset="center"
                                navigationBarStyle={styles.hideNavigationBar}
                                panHandlers={null}
                                initial={this.props.scene === "Login"}>
                                <Scene
                                    key="Login"
                                    component={Login}
                                    panHandlers={null} />
                            </Stack>

                            <Stack
                                key="ForgetName"
                                headerLayoutPreset="center"
                                navigationBarStyle={styles.navigationBarStyle}
                                renderLeftButton={this.renderNull}
                                renderRightButton={this.renderNull}
                                title={" "}>
                                <Scene
                                    key="ForgetName"
                                    component={ForgetName} />
                            </Stack>

                            <Stack
                                key="LoginTouch"
                                headerLayoutPreset="center"
                                renderLeftButton={this.renderNavBack}
                                titleStyle={styles.titleStyle}
                                title={translate("脸部辨识认证")}
                                renderRightButton={this.renderLiveChatIcon}
                                navigationBarStyle={styles.navigationBarStyle}>
                                <Scene
                                    key="LoginTouch"
                                    component={LoginTouch}
                                />
                            </Stack>

                            <Stack
                                key="LoginPattern"
                                headerLayoutPreset="center"
                                renderLeftButton={this.renderNavBack}
                                titleStyle={styles.titleStyle}
                                title={translate("设定图形密码")}
                                renderRightButton={this.renderLiveChatIcon}
                                navigationBarStyle={styles.navigationBarStyle}>
                                <Scene
                                    key="LoginPattern"
                                    component={LoginPattern}
                                />
                            </Stack>

                            <Stack
                                key="SetLogin"
                                headerLayoutPreset="center"
                                renderLeftButton={this.renderNavBack}
                                titleStyle={styles.titleStyle}
                                title={translate("快速登入")}
                                renderRightButton={this.renderLiveChatIcon}
                                navigationBarStyle={styles.navigationBarStyle}>
                                <Scene
                                    key="SetLogin"
                                    component={SetLogin}
                                />
                            </Stack>

                            <Stack
                                key="FastLogin"
                                headerLayoutPreset="center"
                                navigationBarStyle={styles.hideNavigationBar}>
                                <Scene
                                    key="FastLogin"
                                    component={FastLogin} />
                            </Stack>

                            <Stack key="LoginOtp"
                                headerLayoutPreset="center"
                                titleStyle={styles.titleStyle}
                                panHandlers={null}
                                navigationBarStyle={styles.navigationBarStyle}>
                                <Scene
                                    key="LoginOtp"
                                    component={LoginOtp}
                                    panHandlers={null} />
                                <Scene
                                    key="SecurityNotice"
                                    component={SecurityNotice}
                                    panHandlers={null} />
                            </Stack>

                            <Stack
                                key="MobileVerificationMethod"
                                headerLayoutPreset="center"
                                navigationBarStyle={styles.navigationBarStyle}
                                renderLeftButton={this.renderNavBack}
                                renderRightButton={this.renderLiveChatIcon}
                                titleStyle={styles.titleStyle}
                                panHandlers={null}
                                title={translate("验证您的身份")}
                            >
                                <Scene
                                    component={MobileVerificationMethod}
                                    key="MobileVerificationMethod"
                                    panHandlers={null}
                                />
                            </Stack>

                            <Stack
                                key="OTPLimitExceed"
                                headerLayoutPreset="center"
                                navigationBarStyle={styles.navigationBarStyle}
                                renderLeftButton={this.renderNavBack}
                                panHandlers={null}
                                titleStyle={styles.titleStyle}
                                component={OTPLimitExceed}
                                title={translate("通过手机验证")}
                                renderRightButton={this.renderLiveChatIcon}
                            >
                                <Scene
                                    key="OTPLimitExceed"
                                    panHandlers={null}
                                />
                            </Stack>

                            <Stack
                                key="SetPassword"
                                headerLayoutPreset="center"
                                titleStyle={styles.titleStyle}
                                title={translate("更换密码")}
                                panHandlers={null}
                                navigationBarStyle={styles.navigationBarStyle}
                                renderLeftButton={this.renderNavBack}
                                renderRightButton={this.renderLiveChatIcon}>
                                <Scene
                                    key="SetPassword"
                                    component={SetPassword}
                                    panHandlers={null} />
                            </Stack>

                            <Stack
                                key="CustomWebView"
                                headerLayoutPreset="center"
                                navigationBarStyle={[styles.navigationBarStyle]}
                                renderRightButton={this.renderNull}
                                titleStyle={styles.titleStyle}
                                renderLeftButton={this.renderNavBack}
                                title=" ">
                                <Scene
                                    key="CustomWebView"
                                    component={CustomWebView} />
                            </Stack>

                            {/* 优惠 */}
                            <Stack
                                key="PromotionsDetail"
                                headerLayoutPreset="center"
                                navigationBarStyle={styles.navigationBarStyle}
                                renderLeftButton={this.renderNavBack}
                                title={translate("优惠活动详情")}
                                titleStyle={styles.titleStyle}
                                renderRightButton={this.renderLiveChatIcon("PromotionsDetail")}>
                                <Scene
                                    key="PromotionsDetail"
                                    component={PromotionsDetail} />
                            </Stack>

                            <Stack
                                key="ApplyManual"
                                headerLayoutPreset="center"
                                renderLeftButton={this.renderNavBack}
                                renderRightButton={this.renderLiveChatIcon}
                                title={translate("优惠活动申请2")}
                                titleStyle={[styles.titleStyle]}
                                navigationBarStyle={styles.navigationBarStyle}>
                                <Scene
                                    key="ApplyManual"
                                    component={ApplyManual} />
                            </Stack>

                            <Stack
                                key="ApplyBonus"
                                headerLayoutPreset="center"
                                renderLeftButton={this.renderNavBack}
                                renderRightButton={this.renderLiveChatIcon}
                                titleStyle={[styles.titleStyle]}
                                title={translate("优惠活动申请2")}
                                navigationBarStyle={styles.navigationBarStyle}>
                                <Scene
                                    key="ApplyBonus"
                                    component={ApplyBonus} />
                            </Stack>

                            <Stack
                                key="ConfirmBonus"
                                headerLayoutPreset="center"
                                renderLeftButton={this.renderNavBack}
                                title={translate("优惠活动申请")}
                                titleStyle={[styles.titleStyle]}
                                navigationBarStyle={styles.navigationBarStyle}
                                renderRightButton={this.renderLiveChatIcon}>
                                <Scene
                                    key="ConfirmBonus"
                                    component={ConfirmBonus} />
                            </Stack>

                            <Stack
                                key="RecordDetail"
                                headerLayoutPreset="center"
                                renderLeftButton={this.renderNavBack}
                                title=" "
                                titleStyle={styles.titleStyle}
                                navigationBarStyle={styles.navigationBarStyle}>
                                <Scene
                                    key="RecordDetail"
                                    component={RecordDetail} />
                            </Stack>

                            <Stack
                                key="PromotionsAddress"
                                headerLayoutPreset="center"
                                renderLeftButton={this.renderNavBack}
                                title={translate("收货地址")}
                                titleStyle={styles.titleStyle}
                                navigationBarStyle={styles.navigationBarStyle}
                                renderRightButton={this.renderLiveChatIcon("PromotionsAddress")}>
                                <Scene
                                    key="PromotionsAddress"
                                    component={PromotionsAddress} />
                            </Stack>

                            <Stack
                                key="Newaddress"
                                headerLayoutPreset="center"
                                renderLeftButton={this.renderNull}
                                title={translate("新增收货地址")}
                                titleStyle={styles.titleStyle}
                                navigationBarStyle={styles.navigationBarStyle}
                                renderRightButton={this.renderLiveChatIcon("Newaddress")}>
                                <Scene
                                    key="Newaddress"
                                    component={Newaddress} />
                            </Stack>



                            {/* game */}
                            <Stack
                                key="GamePage"
                                headerLayoutPreset="center"
                                renderRightButton={this.renderNull}
                                renderLeftButton={this.renderNull}
                                navigationBarStyle={styles.navigationBarStyle}
                                title={" "}>
                                <Scene
                                    key="GamePage"
                                    component={GamePage} />
                            </Stack>

                            <Stack
                                key="ProductIntro"
                                headerLayoutPreset="center"
                                renderLeftButton={this.renderLeftLogo}
                                renderRightButton={this.renderNull}
                                navigationBarStyle={styles.navigationBarStyle}
                                titleStyle={styles.titleStyle}
                                title={" "}>
                                <Scene
                                    key="ProductIntro"
                                    component={ProductIntro} />
                            </Stack>

                            <Stack
                                key="ProductGamePage"
                                headerLayoutPreset="center"
                                navigationBarStyle={styles.navigationBarStyle}
                                titleStyle={styles.titleStyle}
                                renderLeftButton={this.renderLeftLogo}
                                renderRightButton={this.renderNull}
                                title={" "}
                            >
                                <Scene
                                    key="ProductGamePage"
                                    component={ProductGamePage} />
                            </Stack>


                            <Stack
                                key="GameInforPage"
                                headerLayoutPreset="center"
                                navigationBarStyle={styles.navigationBarStyle}
                                titleStyle={styles.titleStyle}
                                renderLeftButton={this.renderLeftLogo}
                                renderRightButton={this.renderNull}
                                title={" "}
                            >
                                <Scene
                                    key="GameInforPage"
                                    component={GameInforPage} />
                            </Stack>


                            <Stack
                                key="GameSearchPage"
                                headerLayoutPreset="center"
                                navigationBarStyle={styles.navigationBarStyle}
                                titleStyle={styles.titleStyle}
                                renderLeftButton={this.renderLeftLogo}
                                renderRightButton={this.renderNull}
                                title={" "}
                            >
                                <Scene
                                    key="GameSearchPage"
                                    component={GameSearchPage} />
                            </Stack>

                            <Stack
                                key="GameLobbyPage"
                                headerLayoutPreset="center"
                                navigationBarStyle={styles.navigationBarStyle}
                                titleStyle={styles.titleStyle}
                                renderLeftButton={this.renderLeftLogo}
                                renderRightButton={this.renderNull}
                                title={" "}
                            >
                                <Scene
                                    key="GameLobbyPage"
                                    component={GameLobbyPage} />
                            </Stack>

                            <Stack
                                key="GameFilterPage"
                                headerLayoutPreset="center"
                                navigationBarStyle={styles.navigationBarStyle}
                                titleStyle={styles.titleStyle}
                                renderLeftButton={this.renderLeftLogo}
                                renderRightButton={this.renderNull}
                                title={" "}
                            >
                                <Scene
                                    key="GameFilterPage"
                                    component={GameFilterPage} />
                            </Stack>

                            <Stack
                                key="GameListPage"
                                headerLayoutPreset="center"
                                navigationBarStyle={styles.navigationBarStyle}
                                titleStyle={styles.titleStyle}
                                renderLeftButton={this.renderLeftLogo}
                                renderRightButton={this.renderNull}
                                title={" "}
                            >
                                <Scene
                                    key="GameListPage"
                                    component={GameListPage} />
                            </Stack>




                            {/* user */}
                            <Stack
                                key="UserInfor"
                                headerLayoutPreset="center"
                                renderLeftButton={this.renderNavBack}
                                titleStyle={styles.titleStyle}
                                navigationBarStyle={styles.navigationBarStyle}
                                renderRightButton={this.renderLiveChatIcon}
                                title={translate("账户资料1")}
                            >
                                <Scene
                                    key="UserInfor"
                                    component={UserInfor} />
                            </Stack>

                            <Stack
                                key="SecurityQuestion"
                                headerLayoutPreset="center"
                                renderLeftButton={this.renderNavBack}
                                title={translate("安全提问")}
                                titleStyle={styles.titleStyle}
                                navigationBarStyle={styles.navigationBarStyle}
                                renderRightButton={this.renderLiveChatIcon}
                            >
                                <Scene
                                    key="SecurityQuestion"
                                    component={SecurityQuestion} />
                            </Stack>


                            <Stack
                                key="ChangePassword"
                                headerLayoutPreset="center"
                                renderLeftButton={this.renderNavBack}
                                title={translate("密码修改")}
                                titleStyle={styles.titleStyle}
                                navigationBarStyle={styles.navigationBarStyle}
                                renderRightButton={this.renderLiveChatIcon}
                            >
                                <Scene
                                    key="ChangePassword"
                                    component={ChangePassword} />
                            </Stack>


                            <Stack
                                key="UserUpdateInfo"
                                headerLayoutPreset="center"
                                title={" "}
                                renderLeftButton={this.renderNavBack}
                                titleStyle={styles.titleStyle}
                                navigationBarStyle={styles.navigationBarStyle}
                                renderRightButton={this.renderLiveChatIcon("UserInfor")}>
                                <Scene
                                    key="UserUpdateInfo"
                                    component={UserUpdateInfo} />
                            </Stack>


                            <Stack
                                key="AboutUSDT"
                                headerLayoutPreset="center"
                                navigationBarStyle={styles.navigationBarStyle}
                                titleStyle={styles.titleStyle}
                                title={translate("USDT介绍")}
                                renderLeftButton={this.renderNavBack}>
                                <Scene
                                    key="AboutUSDT"
                                    component={AboutUSDT}
                                />
                            </Stack>

                            <Stack
                                key="USDTHelpCenter"
                                headerLayoutPreset="center"
                                navigationBarStyle={styles.navigationBarStyle}
                                titleStyle={styles.titleStyle}
                                title="常见问题"
                                renderLeftButton={this.renderNavBack}>
                                <Scene
                                    key="USDTHelpCenter"
                                    component={USDTHelpCenter}
                                />
                            </Stack>
                            <Stack
                                key="UsdtGuide"
                                headerLayoutPreset="center"
                                navigationBarStyle={styles.navigationBarStyle}
                                titleStyle={styles.titleStyle}
                                renderLeftButton={this.renderNavBack}>
                                <Scene
                                    key="UsdtGuide"
                                    component={UsdtGuide} />
                            </Stack>
                            <Stack
                                key="USDTWalletProtocols"
                                headerLayoutPreset="center"
                                navigationBarStyle={styles.navigationBarStyle}
                                titleStyle={[styles.titleStyle, { fontSize: window.LANGUAGE == "VN" ? 12 : 16 }]}
                                title={translate("钱包协议的区别title")}
                                renderLeftButton={this.renderNavBack}>
                                <Scene
                                    key="USDTWalletProtocols"
                                    component={USDTWalletProtocols} />
                            </Stack>


                            <Stack
                                key="LockedBalance"
                                headerLayoutPreset="center"
                                renderLeftButton={this.renderNavBackWithClose}
                                titleStyle={[styles.titleStyle]}
                                title={translate("未完成流水金额2")}
                                navigationBarStyle={styles.navigationBarStyle}
                                renderRightButton={this.renderLiveChatIcon("LockedBalance")}>
                                <Scene
                                    key="LockedBalance"
                                    component={LockedBalance} />
                            </Stack>

                            <Stack
                                key="SelfExclusion"
                                headerLayoutPreset="center"
                                renderLeftButton={this.renderNavBack}
                                title={translate("自我限制")}
                                titleStyle={styles.titleStyle}
                                navigationBarStyle={styles.navigationBarStyle}
                                renderRightButton={this.renderLiveChatIcon}>
                                <Scene
                                    key="SelfExclusion"
                                    component={SelfExclusion} />
                            </Stack>

                            <Stack
                                key="SecurityCode"
                                headerLayoutPreset="center"
                                renderLeftButton={this.renderNavBack}
                                titleStyle={styles.titleStyle}
                                title={translate("创建安全码")}
                                navigationBarStyle={styles.navigationBarStyle}
                                renderRightButton={this.renderLiveChatIcon}>
                                <Scene
                                    key="SecurityCode"
                                    component={SecurityCode} />
                            </Stack>

                            <Stack
                                key="UploadFile"
                                headerLayoutPreset="center"
                                renderLeftButton={this.renderNavBack}
                                titleStyle={styles.titleStyle}
                                title={translate("验证中心")}
                                navigationBarStyle={styles.navigationBarStyle}
                                renderRightButton={this.renderLiveChatIcon}
                            >
                                <Scene
                                    key="UploadFile"
                                    component={UploadFile} />
                            </Stack>


                            <Stack
                                key="UploadExample"
                                headerLayoutPreset="center"
                                renderLeftButton={this.renderNavBack}
                                titleStyle={styles.titleStyle}
                                navigationBarStyle={styles.navigationBarStyle}
                                renderRightButton={this.renderLiveChatIcon}>
                                <Scene
                                    key="UploadExample"
                                    component={UploadExample} />
                            </Stack>

                            <Stack
                                key="UploadFileGuide"
                                headerLayoutPreset="center"
                                renderLeftButton={this.renderNavBack}
                                title={translate("如何上传您的文件")}
                                titleStyle={styles.titleStyle}
                                navigationBarStyle={styles.navigationBarStyle}
                                renderRightButton={this.renderLiveChatIcon}>
                                <Scene
                                    key="UploadFileGuide"
                                    component={UploadFileGuide} />
                            </Stack>

                            <Stack
                                key="Sponsor"
                                headerLayoutPreset="center"
                                navigationBarStyle={styles.navigationBarStyle}
                                renderLeftButton={this.renderNavBack}
                                title={translate("赞助伙伴")}
                                titleStyle={styles.titleStyle}
                                renderRightButton={this.renderLiveChatIcon}>
                                <Scene
                                    key="Sponsor"
                                    component={Sponsor} />
                            </Stack>

                            <Stack
                                key="UserRule"
                                headerLayoutPreset="center"
                                navigationBarStyle={styles.navigationBarStyle}
                                titleStyle={styles.titleStyle}
                                title={translate("条款与规则")}
                                renderLeftButton={this.renderNavBack}>
                                <Scene
                                    key="UserRule"
                                    component={UserRule} />
                            </Stack>

                            <Stack
                                key="Recommend"
                                headerLayoutPreset="center"
                                navigationBarStyle={styles.navigationBarStyle}
                                title={translate("推荐好友标题")}
                                titleStyle={styles.titleStyle}
                                renderLeftButton={this.renderNavBack}>
                                <Scene
                                    key="Recommend"
                                    component={Recommend} />
                            </Stack>


                            <Stack
                                key="RecommendPage"
                                headerLayoutPreset="center"
                                navigationBarStyle={styles.navigationBarStyle}
                                title={translate("推荐好友标题")}
                                titleStyle={styles.titleStyle}
                                renderLeftButton={this.renderNavBack}>
                                <Scene
                                    key="RecommendPage"
                                    component={RecommendPage} />
                            </Stack>

                            <Stack
                                key="SecurityCheck"
                                headerLayoutPreset="center"
                                renderLeftButton={this.renderNavBack}
                                titleStyle={styles.titleStyle}
                                title={translate("安全检查")}
                                renderRightButton={this.renderLiveChatIcon}
                                navigationBarStyle={styles.navigationBarStyle}>
                                <Scene
                                    key="SecurityCheck"
                                    component={SecurityCheck}
                                />
                            </Stack>
                            <Stack
                                key="VIP"
                                headerLayoutPreset="center"
                                renderLeftButton={this.renderNavBack}
                                title={" "}
                                titleStyle={styles.titleStyle}
                                navigationBarStyle={styles.navigationBarStyle}>
                                <Scene
                                    key="VIP"
                                    component={VIP}
                                />
                            </Stack>

                            <Stack
                                key="Verification"
                                headerLayoutPreset="center"
                                renderLeftButton={this.renderNavBack}
                                titleStyle={styles.titleStyle}
                                renderRightButton={this.renderLiveChatIcon("Verification")}
                                navigationBarStyle={styles.navigationBarStyle}>
                                <Scene
                                    key="Verification"
                                    component={Verification}
                                />
                            </Stack>

                            <Stack
                                key="News"
                                headerLayoutPreset="center"
                                navigationBarStyle={styles.navigationBarStyle}
                                renderRightButton={this.renderLiveChatIcon("Notification")}
                                title=" "
                                renderLeftButton={this.renderNavBack}>
                                <Scene
                                    key="News"
                                    component={News} />
                            </Stack>

                            <Stack
                                key="NewsDetail"
                                headerLayoutPreset="center"
                                navigationBarStyle={styles.navigationBarStyle}
                                renderRightButton={this.renderLiveChatIcon("Notification")}
                                title={translate("信息内容")}
                                titleStyle={styles.titleStyle}
                                renderLeftButton={this.renderNavBack}>
                                <Scene
                                    key="NewsDetail"
                                    component={NewsDetail} />
                            </Stack>

                            <Stack
                                key="PromotionMsgDetail"
                                headerLayoutPreset="center"
                                navigationBarStyle={styles.navigationBarStyle}
                                renderRightButton={this.renderLiveChatIcon("Notification")}
                                titleStyle={styles.titleStyle}
                                title={translate("信息内容")}
                                renderLeftButton={this.renderNavBack}>
                                <Scene
                                    key="PromotionMsgDetail"
                                    component={PromotionMsgDetail} />
                            </Stack>


                            <Stack
                                key="LanguageSetting"
                                headerLayoutPreset="center"
                                renderLeftButton={this.renderNavBack}
                                titleStyle={styles.titleStyle}
                                title={translate("语言")}
                                navigationBarStyle={styles.navigationBarStyle}
                            >
                                <Scene
                                    key="LanguageSetting"
                                    component={LanguageSetting} />
                            </Stack>

                            {/* payment */}
                            <Stack
                                key="DepositCenter"
                                headerLayoutPreset="center"
                                renderLeftButton={this.renderNavBack}
                                titleStyle={styles.titleStyle}
                                title={translate("存款")}
                                renderRightButton={this.renderLiveChatIconWithVip("DepositCenter")}
                                navigationBarStyle={styles.navigationBarStyle}>
                                <Scene
                                    key="DepositCenter"
                                    component={DepositCenter}
                                />
                            </Stack>

                            <Stack
                                key="Withdrawal"
                                headerLayoutPreset="center"
                                renderLeftButton={this.renderNavBack}
                                titleStyle={styles.titleStyle}
                                title={translate("提款")}
                                renderRightButton={this.renderLiveChatIconWithVip("Withdrawal")}
                                navigationBarStyle={styles.navigationBarStyle}>
                                <Scene
                                    key="Withdrawal"
                                    component={WithdrawCenter}
                                />
                            </Stack>


                            <Stack
                                key="Recordes"
                                headerLayoutPreset="center"
                                renderLeftButton={this.renderNavBack}
                                renderRightButton={this.renderLiveChatIconWithVip("Recordes")}
                                title={translate("交易记录1")}
                                titleStyle={styles.titleStyle}
                                navigationBarStyle={styles.navigationBarStyle}>
                                <Scene
                                    key="Recordes"
                                    component={Recordes}
                                />
                            </Stack>

                            <Stack
                                key="BankCard"
                                headerLayoutPreset="center"
                                renderLeftButton={this.renderNavBack}
                                titleStyle={styles.titleStyle}
                                navigationBarStyle={styles.navigationBarStyle}>
                                <Scene
                                    key="BankCard"
                                    component={BankCard}
                                />
                            </Stack>



                            {/* 使用tabBarComponent 客製化tabBar */}
                            {/* ====== SB 2.0 ====== start*/}
                            <Scene key="SBTabbar"
                                tabs={true}
                                wrap={false}
                                showLabel={false}
                                tabBarPosition={"bottom"}
                                panHandlers={null}
                                lazy
                                tabBarComponent={SbTabBar}>
                                <Scene
                                    key="SbSports"
                                    component={SbSports}
                                    hideNavBar
                                    titleStyle={styles.titleStyle} />
                                <Stack
                                    key="promotionSBWrap"
                                    titleStyle={styles.titleStyle}
                                    title=" ">
                                    <Scene
                                        key="promotionSB"
                                        title=" "
                                        component={PromoTab} />
                                </Stack>
                                <Stack
                                    title=" "
                                    key="betRecordSBWrap"
                                    titleStyle={styles.titleStyle}>
                                    <Scene
                                        title=" "
                                        key="betRecordSB"
                                        component={betRecord} />
                                </Stack>


                                <Scene
                                    key="SbAirCraftWrap"
                                    hideNavBar
                                    titleStyle={styles.titleStyle}
                                    navigationBarStyle={styles.navBar}
                                    component={GamePage}
                                // title={` `}
                                />
                                <Stack key="personalSBWrap" titleStyle={styles.titleStyle} hideTabBar={true} hideNavBar={true}>
                                    <Scene key="personalSB" component={DrawerContent} />
                                </Stack>
                            </Scene>

                            <Stack key="personalSBWrapStack" titleStyle={styles.titleStyle} hideTabBar={true} hideNavBar={true}>
                                <Scene key="personalSB" component={DrawerContent} />
                            </Stack>

                            <Stack
                                key="NewsSb"
                                headerLayoutPreset="center"
                                renderRightButton={this.renderLiveChatIcon}
                                renderLeftButton={this.renderNavBack}
                                navigationBarStyle={styles.navigationBarStyle}
                                title={" "}>
                                <Scene
                                    key="NewsSb"
                                    component={NewsSb} />
                            </Stack>

                            <Stack
                                key="NewsDetailSb"
                                headerLayoutPreset="center"
                                renderLeftButton={this.renderNavBack}
                                navigationBarStyle={styles.navigationBarStyle}>
                                <Scene titleStyle={styles.titleStyle} key="NewsDetailSb" component={NewsDetailSb} title="消息详情" />
                            </Stack>

                            <Stack
                                key="BetTutorial"
                                headerLayoutPreset="center"
                                renderRightButton={this.renderLiveChatIcon}
                                renderLeftButton={this.renderNavBack}
                                navigationBarStyle={styles.navigationBarStyle}
                                title={" "}
                                titleStyle={styles.titleStyle}
                            >
                                <Scene
                                    key="BetTutorial"
                                    component={BetTutorial} />
                            </Stack>

                            <Stack
                                key="Rules"
                                headerLayoutPreset="center"
                                renderRightButton={this.renderLiveChatIcon}
                                renderLeftButton={this.renderNavBack}
                                navigationBarStyle={styles.navigationBarStyle}
                                title={" "}
                                titleStyle={styles.titleStyle}>
                                <Scene key="Rules" component={Rules} />
                            </Stack>

                            <Stack
                                key="Setting"
                                headerLayoutPreset="center"
                                renderLeftButton={this.renderNavBack}
                                titleStyle={styles.titleStyle}
                                title={translate("系统设置")}
                                navigationBarStyle={styles.navigationBarStyle}>
                                <Scene
                                    key="Setting"
                                    component={Setting} />
                            </Stack>

                            <Stack
                                key="SetTingModle"
                                headerLayoutPreset="center"
                                renderLeftButton={this.renderNavBack}
                                titleStyle={styles.titleStyle}
                                title={translate("自定义快捷金额")}
                                navigationBarStyle={styles.navigationBarStyle}>
                                <Scene
                                    key="SetTingModle"
                                    component={SetTingModle} />
                            </Stack>

                            <Stack
                                key="search"
                                renderRightButton={this.renderNull}
                                renderLeftButton={this.renderNull}
                                navigationBarStyle={styles.navigationBarStyle}
                                title={" "}
                            >
                                <Scene key="search" component={search} />
                            </Stack>

                            <Stack key="Betting_detail_Stack" headerLayoutPreset="center" navigationBarStyle={styles.navigationBarStyle} hideNavBar>
                                <Scene key="Betting_detail" component={Betting_detail} />
                            </Stack>

                            <Stack key="betRecord" headerLayoutPreset="center" navigationBarStyle={styles.navigationBarStyleHeightsmall} hideNavBar>
                                <Scene key="betRecord" component={betRecord} />
                            </Stack>

                            <Stack key="Betting_detail" headerLayoutPreset="center" navigationBarStyle={styles.navigationBarStyleHeightsmall} hideNavBar>
                                <Scene key="Betting_detail" component={Betting_detail} />
                            </Stack>
                            {/* ====== SB 2.0 ====== end*/}
                        </Stack>
                    </Lightbox>

                    <Stack
                        key="NotificationDetail"
                        headerLayoutPreset="center"
                        renderLeftButton={this.renderNavBack}
                        titleStyle={styles.titleStyle}
                        title="消息详情"
                        navigationBarStyle={styles.navigationBarStyle}>
                        <Scene
                            key="NotificationDetail"
                            component={NotificationDetail} />
                    </Stack>

                    {/* cs */}
                    <Stack
                        key="LiveChat"
                        headerLayoutPreset="center"
                        navigationBarStyle={[styles.navigationBarStyle]}
                        renderRightButton={this.renderNull}
                        renderLeftButton={this.renderNull}
                        titleStyle={styles.titleStyle}
                        title=" ">
                        <Scene
                            key="LiveChat"
                            component={LiveChatMain} />
                    </Stack>


                    <Stack
                        key="DeviceInformation"
                        headerLayoutPreset="center"
                        navigationBarStyle={[styles.navigationBarStyle]}
                        renderLeftButton={this.renderNavBack}
                        titleStyle={styles.titleStyle}
                        title={translate("设备信息")}>
                        <Scene
                            key="DeviceInformation"
                            component={DeviceInformation} />
                    </Stack>

                    <Stack
                        key="AmityChat"
                        headerLayoutPreset="center"
                        navigationBarStyle={[styles.navigationBarStyle]}
                        renderLeftButton={this.renderNavBack}
                        titleStyle={styles.titleStyle}
                        title={translate("VIP 客户经理")}>
                        <Scene
                            key="AmityChat"
                            component={AmityChat} />
                    </Stack>


                    <Stack
                        key="RestrictPage"
                        headerLayoutPreset="center"
                        navigationBarStyle={styles.navigationBarStyle}
                        panHandlers={null}
                        renderTitle={this.renderLogoTitle}>
                        <Scene
                            key="RestrictPage"
                            component={RestrictPage}
                            panHandlers={null} />
                    </Stack>
                </Modal>
            </RouterWithRedux>
        );
    }
}

const mapStateToProps = state => {
    return {
        scene: state.scene.scene,
    };
};

const mapDispatchToProps = dispatch => ({
    setRouterName: routerName => dispatch(actions.ACTION_RouterName(routerName)),
    getCmsMainsiteStatus: flag => dispatch(actions.ACTION_CMSMAINSITESTATUS(flag)),
    userInfo_logout: () => dispatch(actions.ACTION_UserInfo_logout()),
    selfExclusions_clear: () => dispatch(actions.ACTION_ClearSelfExclusions()),
    loginAfterCallBack: data => dispatch(actions.ACTION_LoginAfterCallBack(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);

// 提取样式对象到组件外部，避免每次渲染重新创建
const getNavigationBarStyle = (deviceInfoIos, isDynamicIslandIOS) => ({
    borderBottomWidth: 0,
    borderTopWidth: 0,
    borderBottomColor: Color.transparent,
    borderTopColor: Color.transparent,
    backgroundColor: Color.theme,
    height: Platform.OS == "ios" ? (deviceInfoIos ? (isDynamicIslandIOS ? 40 + 20 : 40) : 20) : 0,
});

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: Color.lightSilver,
    },
    titleStyle: {
        color: Color.white,
        fontSize: 16,
        fontWeight: "bold",
    },
    titleStyle1: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    navigationBarStyle: {
        backgroundColor: Color.theme,
        borderBottomWidth: 0,
        marginLeft: 15,
    },
    hideNavigationBar: {
        backgroundColor: Color.theme,
        height: 0,
        borderBottomWidth: 0,
    },
    navBarGameList: {
        height: 45,
        color: "#220000",
        backgroundColor: "#fff",
        borderBottomWidth: 0,
    },
    gameListTitle: { color: "#220011" },
    navBar: {
        // height: 45,
        color: "#fff",
        backgroundColor: Color.theme,
        borderBottomWidth: 0,
    },
    navigationBarStyleHeightsmall: {
        backgroundColor: Color.theme,
        height: 0,
        borderBottomWidth: 0,
    },
    tabBarStyle: {
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#EFEFF4",
        // height: 0.21 * (width - 60),
    },
    tabBarSelectedItemStyle: {
        backgroundColor: Color.transparent,
        borderBottomWidth: 0,
        borderTopWidth: 0,
        height: 0
    },
    sceneStyle: {
        backgroundColor: Color.theme,
        borderBottomWidth: 0,
        borderTopWidth: 0,
        height: 0
    },
});
