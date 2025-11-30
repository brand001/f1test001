import * as Sentry from "@sentry/react-native";
import CryptoJS from "crypto-js";
import base64 from "crypto-js/enc-base64";
import moment from "moment";
import React from "react";
import { Alert, Dimensions, Image, ImageBackground, Linking, NativeModules, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import DeviceInfo from "react-native-device-info"; //獲取設備信息
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { PiwikEventDataHandle, PiwikMemberCode } from "@/actions/PiwikEventData";
import actions from "@/lib/redux/actions/index";
import { Toasts } from "$Toasts";
import { checkEmail, checkLoginPassword, checkLoginUserName, checkPhone, checkUserName, LiveChatOpenGlobe, GetSeonFingerprint } from "$Utils";
import StorageUtil from "$Utils/Storage";
import { newPasswordReg } from "@/actions/Reg.js";
import { judgeMemberStatus } from "$Utils/quelea";
import { GetGlobalModal } from "$Utils/globalModal";
import { NotificationDevice } from "../../actions/NotificationDevice";
import { parses } from "../../actions/parses";
import { login } from "../../lib/redux/actions/AuthAction";
const { Openinstall, UMPushModule, Iovation } = NativeModules;
const { width, height } = Dimensions.get("window");
let bgImg = {
    login: null,
    register: null,
};
import ImageEditor from "@react-native-community/image-editor";

import ReactCaptcha from "$Components/Captcha/ReactCaptcha";
import Color from "$Components/Color";
import CustomCheckbox from "$Components/CustomCheckbox";
import CustomLinkText from "$Components/CustomLinkText";
import CustomTextInput from "$Components/CustomTextInput";
import { RowCenterBetween, RowCenterCenter, ColumnCenterCenter, RowCenterStart, ColumnStartCenter } from "$Components/CustomView";
import FilledButton from "$Components/FilledButton";
import InfoBar from "$Components/InfoBar";
import LiveChat from "$Components/LiveChat";
import UnderlinedButton from "$Components/UnderlinedButton";
import PasswordRequirements from "$Components/PasswordRequirements";
import { translate } from "$locales/translate";
import NavTab from "$Components/Nav/NavTab";
import { DefaultConfig } from "../../../platform.es.config";
import { suggestedEmailDomain, HelpKnowledgeBaseIDObj, LoginErrorPop } from "./data";
import { ImagesUrl } from "@/images/index";
import { CloseIcon, FaceIcon, FingerprinIcon, PatterIcon } from "$Components/icons/index";
import { MIN_AGE } from "@/lib/constants";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkName: false,
            type: this.props?.tabType || "login", // login register
            emptyLogName: "",
            emptyLogMsg: "",
            loginUsername: "",
            invalidLoginUsername: "",
            loginPwd: "",
            invalidLogPwd: "",
            loginPwdS: "",
            registerUsername: "",
            registerPwd: "",
            registerRePwd: "",
            emailAddress: "",
            checkBox1: false,
            affCodeEditable: true,
            version: Rb88Version,
            affCode: "", //代理號(用户主动输入)
            Devicetoken: "", //用戶唯一識別
            userMAC: "", //mac
            registerNumber: "", //注册手机号
            showRegTipPopUp: false, //注册提示弹窗
            emptyLogNameST: false, // 登录-用户名格式。
            emptyLogPwd: false, // 登录-空密码。
            emptyLogPwdST: false, // 登录-空密码。
            emptyRegName: false, // 注册-空用户名。
            invalidRegName: "", // 注册-错误格式的用户名。
            emptyRegPhone: false, // 注册-空手机号码
            invalidRegPhone: "", // 注册-错误的手机号码
            invalidRegPwd: "", // 注册-错误的密码
            differentRegPwd: false, // 注册-不一致的密码
            emptyEmail: false, //注册--请输入邮箱地址
            invalidRegEmail: "", //注册--邮箱地址不正确
            invalidAff: false, //注册--推荐代码格式不符
            canLogin: false,
            canReg: false,
            registerPadding: false,
            CMS_GameProvidersList: [],
            registerBottom: false,
            showTerms: false,
            getGameKey: 0,
            CategoryData: "", //游戏分类
            ProvidersData: "", //游戏供应商
            showPatternPage: false, //弹出图案登录
            showTouchPage: false, //弹出脸部识别或指纹
            isLogin: false, //是否登录，
            prefixes: [],
            getUniqueId: "",
            queleareferrerid: "",
            showSuggestedEmailDomain: false,
            prefixesMaxLength: window.LANGUAGE == "CN" ? 11 : 9,
            emailVerifyTime: 5,
            smsVerifyTime: 5,
            zaloVerifyTime: 5,
            voiceVerifyTime: 5,

            captchaVisible: false,
            captchaIsDisabled: false,

            isPhoneEditable: false, // 等取得Prefix再給編輯
            isPhoneLoading: true,

            loginType: "", // 区别登录类型，便于上传PIW
            isRegister: false,
            sponsorship: [
                // {
                //     mobile_image: ImagesUrl.sponsorship1,
                //     get mobile_text() {
                //         return translate("纽卡斯尔联\n亚洲官方合作伙伴");
                //     },
                // },
                // {
                //     mobile_image: ImagesUrl.sponsorship2,
                //     get mobile_text() {
                //         return translate("伊卡尔·卡西利亚斯\n乐天堂品牌大使");
                //     },
                // }
            ],
            phone: "",
            email: "",
            isImageEditorAvailable: false, // ImageEditor 可用性检测
            showPasswordRequirements: false,
            fraudSignature: ""
        };

        this._loginInput1 = React.createRef();
        this._loginInput2 = React.createRef();

        this._registerInput1 = React.createRef();
        this._registerInput2 = React.createRef();
        this._registerInput3 = React.createRef();
        this._registerInput4 = React.createRef();
        this.transaction = null;
    }

    componentWillMount() {
        // 检测 ImageEditor.cropImage 是否可用
        this.checkImageEditorAvailability();

        this.transaction = Sentry.startTransaction({
            name: "Login",
            op: "navigation",
        });
        // this.setState({ loginUsername: 'funtest991' }); qatestthb001
        // this.setState({ loginPwd: 'today1234', canLogin: true });

        //mobile传token登陆
        window.isMobileOpen && this.mobileOpen();
        //获取记住用户名密码
        this.getUserName();
        // 获取MAC
        this.getMACAddress();

        //otp获取设备参数
        this.getUniqueId();
        //e2
        this.getE2();

        // if (__DEV__) {
        // 	setTimeout(() => {
        // 		this.login()
        // 	}, 500);
        // }
    }

    async componentDidMount() {
        this.GetPhonePrefix();
        if (this.props.reLogin) {
            this.setState(
                {
                    loginUsername: this.props.loginUsername,
                    loginPwd: this.props.loginPwd,
                    canLogin: true,
                },
                () => {
                    this.login("", this.props.queleaReferreeStatus, this.props.from);
                },
            );
        }
        //this.getSponsorshipImg();
        this.getBanner();

        // ImmersiveMode.setBarTranslucent(true);
        // ImmersiveMode.setBarColor('transparent');
        this.transaction && this.transaction.finish && this.transaction.finish();
        let fraudSignature = await GetSeonFingerprint();
        this.setState({ fraudSignature });
        setTimeout(() => {
            // 获取代理码
            this.setState({
                affCodeEditable: !affCodeKex,
                affCode: affCodeKex,
                queleareferrerid: rafCodeKex,
            });
        }, 2000);
    }

    componentWillUnmount() {
        // StatusBar.setTranslucent(false)
        // StatusBar.setBackgroundColor('#00A6FF')
        this.timeOut && clearTimeout(this.timeOut);
        this.props.loginAfterCallBack({
            callBack: () => {

            }
        });
    }

    // 检测 ImageEditor.cropImage 是否可用（实际调用测试）
    checkImageEditorAvailability() {
        try {
            if (ImageEditor && typeof ImageEditor.cropImage === "function") {
                // 实际调用测试 ImageEditor.cropImage 是否能正常工作
                // 参考 Captcha.js 中的正确使用方式进行测试
                const testParams = {
                    offset: { x: 0, y: 0 },
                    size: { width: 10, height: 10 },
                    resizeMode: "contain",
                    displaySize: { width: 10, height: 10 }
                };

                // 使用空字符串或无效URI进行测试，检测原生代码是否正常响应
                ImageEditor.cropImage("invalid_test_uri", testParams)
                    .then(() => {
                        // 意外成功，说明方法可用
                        this.setState({ isImageEditorAvailable: true });
                        console.log("ImageEditor.cropImage test succeeded unexpectedly - method is available");
                    })
                    .catch((error) => {
                        // 分析错误类型来判断方法是否可用
                        const errorStr = error?.message || error?.toString() || "";
                        console.log("ImageEditor.cropImage test error:", errorStr);

                        // 这些错误说明方法可用，只是测试参数的问题
                        if (errorStr.includes("Image could not be loaded") ||
                            errorStr.includes("Invalid image") ||
                            errorStr.includes("Unable to load") ||
                            errorStr.includes("file not found") ||
                            errorStr.includes("Failed to load") ||
                            errorStr.includes("bad url") ||
                            errorStr.includes("null") ||
                            errorStr.match(/invalid.*uri/i)) {

                            this.setState({ isImageEditorAvailable: true });
                            console.log("ImageEditor.cropImage is working - got expected parameter error");
                        } else {
                            // 其他错误可能是原生实现问题
                            this.setState({ isImageEditorAvailable: false });
                            console.log("ImageEditor.cropImage native implementation may be broken:", error);
                        }
                    });
            } else {
                this.setState({ isImageEditorAvailable: false });
                console.log("ImageEditor.cropImage method not found");
            }
        } catch (error) {
            // 同步异常，说明原生代码有严重问题
            console.log("ImageEditor.cropImage threw synchronous error:", error);
            this.setState({ isImageEditorAvailable: false });
        }
    }

    getE2() {
        //获取E2
        if (Platform.OS === "android") {
            Iovation.getE2BlackBox &&
                Iovation.getE2BlackBox(
                    event => {
                        E2Backbox = event;
                        IovationVal = event;
                    },
                    errorCallback => {},
                );
        } else {
            Openinstall.getE2BlackBox &&
                Openinstall.getE2BlackBox((error, event) => {
                    if (error) {
                    } else {
                        E2Backbox = event;
                        IovationVal = event;
                    }
                });
        }
    }

    GetPhonePrefix = () => {
        fetchRequest(ApiPort.PhonePrefix, "GET").then(res => {
            if (res && res.result) {
                this.setState({
                    prefixes: res?.result || [],
                });
                this.props.phone_setting(res?.result);
            }
        });
    };

    async getSponsorshipImg() {
        StorageUtil.load("SponsorshipImg")
            .then(sponsorship => {
                this.setState({
                    sponsorship,
                });
            });

        let res = await fetchRequestCMS(`${Strapi_Domain + ApiPort.CMS_LoginRegisterFooter}`, "GET");

        let sponsorship = res?.data?.login_page || res?.data?.sponsorship || [];
        if (sponsorship.length <= 0) return;
        sponsorship.forEach((v, i) => {
            let { mobile_image, mobile_image_webp, mobile_image_avif, mobile_text } = v;
            let tempImg = mobile_image || mobile_image_webp || mobile_image_avif;
            v.mobile_image = tempImg ? { uri: tempImg } : sponsorship[i].mobile_image;
            v.mobile_text = mobile_text || "";
        });
        this.setState({
            sponsorship,
        });

        StorageUtil.save({
            key: "SponsorshipImg",
            data: sponsorship,
        });
    }

    async getBanner() {
        StorageUtil.load("LoginBanner")
            .then(res => {
                if (res?.login && res?.register) {
                    bgImg = res;
                }
            });

        try {
            const fetchBanner = type => fetchRequestCMS(`${Strapi_Domain + ApiPort.CMS_LoginRegisterBanner}${type}?login=before&displaying_webp`, "GET");
            let res = await Promise.all([fetchBanner("login"), fetchBanner("register")]);

            let [login = [{}], register = [{}]] = res;

            let loginImg = login[0]?.cmsImageUrl || "";
            bgImg.login =
                loginImg && loginImg?.includes("http")
                    ? {
                        uri: loginImg,
                    }
                    : bgImg.login;

            let registerImg = register[0]?.cmsImageUrl || "";
            bgImg.register =
                registerImg && registerImg?.includes("http")
                    ? {
                        uri: registerImg,
                    }
                    : bgImg.register;
        } catch (err) {}
        StorageUtil.save({
            key: "LoginBanner",
            data: bgImg,
        });
    }

    getDeviceSignatureBlackBox() {
        let uniqueId = this.state.getUniqueId;
        if (uniqueId == "") {
            uniqueId = DeviceInfo.getUniqueId();
        }
        if (uniqueId && uniqueId.length <= 15) {
            uniqueId = "0" + DeviceInfo.getUniqueId();
        }
        let GUID = uuidv4();
        let keyHex = CryptoJS.enc.Utf8.parse("@NcRfTjWnZr4u7x!A%D*G-KaPdSgVkYp");
        if (window.isStaging == "ST") {
            //测试key
            keyHex = CryptoJS.enc.Utf8.parse("WmZq4t7w!z%C*F-JaNdRgUkXp2r5u8x/");
        } else if (window.isStaging == "SL") {
            keyHex = CryptoJS.enc.Utf8.parse("$B&E)H@McQfTjWnZr4u7x!A%C*F-JaNd");
        }
        let ivHex = CryptoJS.lib.WordArray.create(new Uint8Array(parses(GUID)));
        let texts = moment().utc().toISOString().split(".")[0] + "Z" + uniqueId;
        let messageHex = CryptoJS.enc.Utf8.parse(texts);
        let encrypted = CryptoJS.AES.encrypt(messageHex, keyHex, {
            iv: ivHex,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });
        var boxValue = GUID + encrypted.ciphertext.toString(base64);
        uniqueId &&
            StorageUtil.save({
                key: "getUniqueId",
                data: uniqueId,
            });
        return boxValue;
    }

    async getUserName() {
        //获取记住用户名密码
        try {
            let ret;
            try {
                ret = await StorageUtil.load("userName");
            } catch (err) {
                try {
                    ret = await StorageUtil.load("username");
                } catch (err) {}
            }
            if (ret) {
                this.setState({ loginUsername: ret });
                userNameDB = ret;

                try {
                    const lockLoginVal = await StorageUtil.load(`lockLogin${ret.toLowerCase()}`);
                    window.lockLogin = Number(lockLoginVal);
                } catch (err) {}

                //九宫格锁定次数
                try {
                    const lockPatternVal = await StorageUtil.load(`lockPattern${ret.toLowerCase()}`);
                    window.LoginPatternNum = Number(lockPatternVal);
                } catch (err) {}

                //指纹脸部锁定次数
                try {
                    const lockTouchVal = await StorageUtil.load(`lockTouch${ret.toLowerCase()}`);
                    window.LoginTouchNum = Number(lockTouchVal);
                } catch (err) {}
            }
        } catch (err) {}

        try {
            const passwordRet = await StorageUtil.load("password");
            this.setState({
                loginPwd: passwordRet,
                canLogin: true,
                checkName: true,
            });
        } catch (err) {}
    }

    // 获取MAC
    getMACAddress = () => {
        if (Platform.OS === "android") {
            window.DeviceInfoIos = false;
            DeviceInfo.getMacAddress().then(mac => {
                //拿mac地址
                this.setState({
                    userMAC: mac,
                });
                window.userMAC = mac;
            });
        } else {
            //ios手机型号是有指纹的
            let iphoneXMax = ["iPhone 5", "iPhone 5s", "iPhone 6", "iPhone 6s", "iPhone 6s Plus", "iPhone 7", "iPhone 7 Plus", "iPhone 8", "iPhone 8 Plus", "iPhone SE"];
            const getModel = DeviceInfo.getModel();
            if (iphoneXMax.indexOf(getModel) > -1) {
                window.DeviceInfoIos = false;
            }
        }
    };

    //mobile传token登陆
    mobileOpen() {
        window.isMobileOpen = false;
        let data = this.props?.openList;
        //   sb20://token=aaa&rtoken=bbb&deeplink=im&sid=2&eid=45678&lid=89012

        if (data.token) {
            ApiPort.Token = "Bearer " + data.token; // 寫入用戶token  token要帶Bearer
            ApiPort.ReToken = data.rtoken; // 寫入用戶token  token要帶Bearer

            this.setState({ isLogin: true });
            this.props?.userInfo_getBalanceSB(true); //redux 獲取SB餘額
            ApiPort.UserLogin = true;
            global.localStorage.setItem("loginStatus", "1");
            this.getUser("mobileOpen");
            //获取用户配置
            this.getSeting();
        }
    }

    //mobile打开登陆获取用户信息写入
    getMemberCode(data) {
        userNameDB = data.userName;

        // this.props?.userInfo_login(data.UserName); //redux 紀錄登入態
        localStorage.setItem("memberCode", JSON.stringify(data.memberCode));
        //追蹤membercode piwik
        PiwikMemberCode(data?.memberCode);

        memberCode = data.memberCode; //寫入用戶 memberCode

        let openList = this.props?.openList;

        setTimeout(() => {
            let userName = "loginok";
            let password = "loginok";
            this.props?.login({ userName, password });
        }, 2000);
    }

    getUniqueId() {
        StorageUtil.load("getUniqueId")
            .then(getUniqueId => {
                this.setState({ getUniqueId });
            })
            .catch(err => {});
    }

    handleLoginInput(key, value) {
        this.setState({ [key]: value }, () => {
            this.verifyLoginDetail(key);
        });
    }

    handleRegisterInput(key, value, flag) {
        console.log("handleRegisterInput");
        this.setState({ [key]: value }, () => {
            this.verifyRegisterDetail(key, flag);
        });
    }
    // 登录前先校验登录信息
    verifyLoginDetail(key) {
        const { loginUsername, loginPwd } = this.state;

        if (key == "loginUsername") {
            this.setState(
                {
                    invalidLoginUsername: checkLoginUserName(loginUsername),
                },
                () => {
                    this.checkCanLog();
                },
            );
        }

        //密码
        if (key == "loginPwd") {
            this.setState(
                {
                    invalidLogPwd: checkLoginPassword(loginPwd),
                },
                () => {
                    this.checkCanLog();
                },
            );
        }
    }

    checkCanLog() {
        let { invalidLogPwd, loginPwd, invalidLoginUsername, loginUsername } = this.state;
        this.setState({
            canLogin: invalidLogPwd == "" && loginPwd !== "" && invalidLoginUsername == "" && loginUsername != "",
        });
    }

    // 注册前先校验信息
    verifyRegisterDetail(key, flag) {
        const { registerUsername, registerPwd, registerNumber, emailAddress, prefixes } = this.state;

        //用户名
        if (key == "registerUsername") {
            this.setState(
                {
                    invalidRegName: checkUserName(registerUsername),
                },
                () => {
                    this.checkCanReg();
                },
            );
        }
        //密码
        if (key == "registerPwd") {
            const hasPasswordError = registerPwd !== "" && !newPasswordReg.test(registerPwd);
            this.setState(
                {
                    invalidRegPwd: registerPwd === "" ? translate("请输入密码") : "",
                    showPasswordRequirements: hasPasswordError,
                },
                () => {
                    this.checkCanReg();
                },
            );
        }
        //手机号码
        if (key == "registerNumber") {
            let { error = "", prefixesMaxLength } = checkPhone(registerNumber);
            this.setState(
                {
                    invalidRegPhone: error,
                    prefixesMaxLength: prefixesMaxLength,
                },
                () => {
                    this.checkCanReg();
                },
            );
        }

        //邮箱
        if (key == "emailAddress") {
            this.setState(
                {
                    invalidRegEmail: checkEmail(emailAddress),
                },
                () => {
                    this.checkCanReg();
                },
            );
        }
    }

    checkCanReg() {
        let { invalidRegEmail, invalidRegPhone, invalidRegPwd, invalidRegName, registerUsername, registerPwd, registerNumber, emailAddress, showPasswordRequirements } = this.state;
        this.setState({
            canReg:
                invalidRegEmail == "" &&
                emailAddress != "" &&
                invalidRegPhone == "" &&
                registerNumber != "" &&
                invalidRegPwd == "" &&
                registerPwd != "" &&
                !showPasswordRequirements &&
                invalidRegName == "" &&
                registerUsername != "",
        });
    }

    /**
     *
     * @param {string} key 登录类型:直接登录/注册登录/快速登录
     * @param boolean flag:true表示注册时调用的登录
     */
    async login(fastLogin, queleaReferreeStatus, from) {
        const { type, loginUsername, loginPwd, registerUsername, registerPwd, canLogin } = this.state;
        if (!canLogin && type == "login") return;

        let userName, password;
        if (type == "login") {
            // 直接登录时的用户名和密码
            userName = loginUsername;
            password = loginPwd;
        } else {
            // 注册时的用户名和密码
            userName = registerUsername;
            password = registerPwd;
        }
        window.userNameDB = userName;
        window.DeviceSignatureBlackBox = this.getDeviceSignatureBlackBox();
        let date = {
            deviceSignatureBlackbox: window.DeviceSignatureBlackBox,
            hostName: common_url,
            captchaId: "30172f1a-c2c9-4fb7-afaf-2a4eb9391e44",
            captchaCode: "999999",
            grantType: "password",
            clientId: window.DefaultConfig.clientId,
            clientSecret: window.DefaultConfig.clientSecret,
            userName,
            password,
            scope: "Mobile.Service offline_access",
            appId: DeviceInfo?.getBundleId?.() || "",
            siteId: window.siteId,
            e2: E2Backbox || "",
            ipAddress: "",
            fraudSignature: this.state.fraudSignature || ""
        };

        !this.state.isRegister && !this?.props?.reLogin && Toasts.loading(translate("正在登录中，请稍候..."), 2000000);
        fetchRequest(ApiPort.login, "POST", date)
            .then(async data => {
                if (data.isSuccess) {
                    this.setState({
                        emptyLogMsg: "",
                    });
                    let memberInfo = data?.result?.memberInfo;
                    let accessToken = data?.result?.accessToken;
                    let needResetPwd = data?.result?.memberInfo?.needResetPwd;
                    let isMandatoryReset = data?.result?.memberInfo?.isMandatoryReset;

                    if (Boolean(memberInfo?.currency) && (memberInfo?.currency || "").toLocaleUpperCase() != window.DefaultConfig?.currency) {
                        Toasts.removeAll();
                        this.setState({
                            emptyLogMsg: translate("用户名称或密码错误！请重新输入！"),
                        });
                        return;
                    }
                    this.setState({ isLogin: true });
                    ApiPort.Token = (accessToken?.token_type || accessToken?.tokenType) + " " + (accessToken?.access_token || accessToken.accessToken); // 寫入用戶token  token要帶Bearer
                    ApiPort.ReToken = accessToken?.refresh_token || accessToken?.refreshToken; // 寫入用戶token  token要帶Bearer
                    ApiPort.UserLogin = true;
                    global.localStorage.setItem("loginStatus", "1");

                    window.lockLogin = 0;

                    StorageUtil.save({
                        key: `lockLogin${userName}`,
                        data: 0,
                    });
                    //保存快捷登陆方式的密码 ，快速登录使用
                    let fastLoginKey = "fastLoginPass" + userName.toLowerCase();
                    StorageUtil.save({
                        key: fastLoginKey,
                        data: password,
                    });
                    if (fastLogin) {
                        //快速登陆验证密码成功
                        window.FastLoginErr = false;
                        window.FastLoginBack && window.FastLoginBack();
                        Toasts.removeAll();
                        return;
                    } else {
                        window.LoginPatternNum = 0;
                        window.LoginTouchNum = 0;
                    }
                    this.keepNamePassw(userName, password);
                    this.props?.userInfo_login(userName); //redux 紀錄登入態

                    this.getUser("", userName, password, queleaReferreeStatus, from, needResetPwd, isMandatoryReset);
                    this.props?.getSelfExclusionsAction();

                    this.piwikEventLogin(true);
                } else {
                    Toasts.removeAll();
                    this.piwikEventLogin(false, data);
                    let errorCode = data?.result?.error_details?.code || data?.result?.errorCode || (!!data?.errors ? data?.errors?.[0]?.errorCode : "");

                    let isCaptchaEnabled = data?.result?.isCaptchaEnabled;
                    if (fastLogin && errorCode == "MEM00059") {
                        StorageUtil.save({
                            key: "lockLogin" + userName,
                            data: window.lockLogin += 1,
                        });

                        return;
                    }

                    if (LoginErrorPop[errorCode]) {
                        LoginErrorPop[errorCode]({ self: this });
                    } else {
                        let { errors, result } = data;
                        let errorsMessage = result?.message || result?.description;
                        if (!errorsMessage && Array.isArray(errors) && errors.length) {
                            errorsMessage = errors[0]?.description || errors[0]?.message;
                        }
                        Toasts.fail(errorsMessage, 2);
                    }
                }
            })
            .catch(error => {
                Toasts.removeAll();
            });
    }

    captchaOnMatch = () => {
        this.setState(
            {
                captchaVisible: false,
            },
            () => {
                this.postRegist(false);
            },
        );
    };

    captchaIsDisabled = () => {
        if (this.state.captchaIsDisabled) return;

        this.setState({
            captchaVisible: false,
            captchaIsDisabled: true
        }, () => {
            this.postRegist(false);
        });
    };

    piwikEventLogin(flag, error) {
        try {
            let loginType = this.state.loginType;
            if (flag) {
                if (loginType == "") {
                    PiwikEventDataHandle({
                        eventTitle: "login1",
                        isSuccess: 2,
                    });
                } else if (loginType == "LoginPattern") {
                    PiwikEventDataHandle({
                        eventTitle: "login1.2",
                        isSuccess: 2,
                    });
                } else if (loginType == "LoginTouch") {
                    if (DeviceInfoIos) {
                        PiwikEventDataHandle({
                            eventTitle: "login1.3",
                            isSuccess: 2,
                        });
                    } else {
                        PiwikEventDataHandle({
                            eventTitle: "login1.1",
                            isSuccess: 2,
                        });
                    }
                }
            } else {
                let description = error?.result?.error_details?.description || !!error?.errors && error?.errors[0]?.description;
                let loginType = this.state.loginType;
                if (loginType == "") {
                    PiwikEventDataHandle({
                        eventTitle: "login1",
                        isSuccess: 1,
                        customProperties: {
                            "Login_S_Login_ErroMsg": description || "", // 修正 key 格式
                        },
                    });
                } else if (loginType == "LoginPattern") {
                    PiwikEventDataHandle({
                        eventTitle: "login1.2",
                        isSuccess: 1,
                        customProperties: {
                            "Login_S_Pattern_ErroMsg": description || "", // 修正 key 格式
                        },
                    });
                } else if (loginType == "LoginTouch") {
                    if (DeviceInfoIos) {
                        PiwikEventDataHandle({
                            eventTitle: "login1.3",
                            isSuccess: 1,
                            customProperties: {
                                "Login_S_FaceID_ErroMsg": description || "", // 修正 key 格式
                            },
                        });
                    } else {
                        PiwikEventDataHandle({
                            eventTitle: "login1.1",
                            isSuccess: 1,
                            customProperties: {
                                "Login_S_FingerPrint_ErroMsg": description || "", // 修正 key 格式
                            },
                        });
                    }
                }
            }
        } catch (err) {

        }
    }

    //  注册
    async postRegist(showCaptcha = false) {
        const { registerUsername, registerPwd, registerNumber, emailAddress, canReg, isImageEditorAvailable } = this.state;

        if (!canReg) return;

        // 检测 ImageEditor.cropImage 是否可用，如果可用则执行验证码逻辑
        if (isImageEditorAvailable) {
            if (window.LANGUAGE) {
                // https://arcadie.atlassian.net/browse/FSC-188
                if (showCaptcha && !this.state.captchaVisible) {
                    if (this.captcha) {
                        this.captcha.getCaptchaInfo(registerUsername);
                    }
                    this.setState({ captchaVisible: true });
                    return;
                }
            }
        } else {
            // ImageEditor.cropImage 不可用时，跳过验证码逻辑
            console.log("ImageEditor.cropImage not available, skipping captcha logic");
        }

        let affc = affCodeKex || this.state.affCode;
        affc = affc.replace(/[^\w\.\/]/gi, "");
        window.DeviceSignatureBlackBox = this.getDeviceSignatureBlackBox();

        const date = {
            deviceSignatureBlackBox: window.DeviceSignatureBlackBox,
            currency: window.DefaultConfig?.currency,
            wallet: "",
            referer: "",
            blackboxvalue: IovationVal,
            gender: null,
            nationid: 1,
            msgertype: 0,
            dob: "",
            placeofbirth: null,
            hostname: common_url,
            regwebsite: window.siteId,
            nationality: "1",
            language: window.DefaultConfig?.Culture,
            mobile: window.DefaultConfig?.countryCallingCode + "-" + registerNumber,
            zipcode: null,
            city: null,
            websiteid: 0,
            brandcode: "fun88",
            membercode: "",
            membertempid: "",
            mediacode: "",
            affiliatecode: affc,
            lastname: null,
            email: emailAddress,
            msgerid: null,
            password: registerPwd,
            address: null,
            firstname: null,
            membertemppassword: "",
            pixelvalue: null,
            userName: registerUsername,
            queleareferrerid: this.state.queleareferrerid,
            challengeuuid: this.captcha?.state?.challengeUuid,
            fraudSignature: this.state.fraudSignature || ""
        };

        Toasts.loading(translate("正在注册中，请稍候..."), 20000000);
        fetchRequest(ApiPort.MemberRegister, "POST", date)
            .then(data => {
                if (data.isSuccess) {
                    // 注册成功且登录
                    this.setState(
                        {
                            isRegister: true,
                        },
                        () => {
                            this.login("", "", "");
                        },
                    );
                    PiwikEventDataHandle({
                        eventTitle: "register1",
                        isSuccess: 2,
                        customProperties: {
                            AffiliateCode: affc,
                        },
                    });
                } else {
                    Toasts.removeAll();
                    let { errors, result } = data;
                    let errorsMessage = result?.message || result?.description;
                    if (!errorsMessage && Array.isArray(errors) && errors.length) {
                        errorsMessage = errors[0]?.description || errors[0]?.message;
                    }

                    // Handle specific error codes with global pop modal
                    let errorCode = errors?.[0]?.errorCode || result?.errorCode;
                    if (["MEM00207", "MEM00208"].includes(errorCode)) {
                        GetGlobalModal({
                            title: translate("密码存在风险"),
                            ...(window.LANGUAGE === "TH" && {
                                titleStyle: {
                                    fontSize: 14,
                                },
                                messageStyle: {
                                    fontSize: 13,
                                }
                            }),
                            iconName: "warning",
                            message: translate("您的密码与个人信息或常见密码过于相似，请重设更安全的密码。"),
                            confirmText: translate("重新设置"),
                            onConfirm: () => {}
                        });
                    } else {
                        Toasts.fail(errorsMessage, 1.5);
                    }

                    // Determine Piwik event based on error code
                    let eventTitle = "register1";
                    if (errorCode === "MEM00207") {
                        eventTitle = "LoginDummyPopup";
                    } else if (errorCode === "MEM00208") {
                        eventTitle = "LoginSensitivePopup";
                    }

                    PiwikEventDataHandle({
                        eventTitle: eventTitle,
                        isSuccess: 1,
                        customProperties: {
                            API_Error: errorCode + " - " + errorsMessage,
                            AffiliateCode: affc,
                        },
                    });
                }
            })
            .catch(err => {
                Toasts.removeAll();
            });
    }

    //获取用户信息
    async getUser(key, userName, password, queleaReferreeStatus = false, from = "", needResetPwd, isMandatoryReset) {
        fetchRequest(ApiPort.Member, "GET")
            .then(async data => {
                Toasts.removeAll();
                if (data && data.result) {
                    Toasts.removeAll();
                    const { memberInfo = {}, memberNewInfo = {} } = data.result;
                    //const memberNewInfo = data.result.memberNewInfo;
                    key == "mobileOpen" && this.getMemberCode(memberInfo);
                    let isOtp = memberInfo?.loginOTP || memberNewInfo?.isLoginOTP;
                    let isRevalidate = memberInfo?.revalidate || memberNewInfo?.revalidate;
                    let showDisplayReferee = isOtp || isRevalidate ? false : true;
                    this.props?.userInfo_updateMemberInfo({
                        result: data.result,
                        showDisplayReferee: showDisplayReferee,
                    }); //redux 紀錄用戶資料

                    localStorage.setItem("memberInfo", JSON.stringify(memberInfo));

                    StorageUtil.save({
                        key: "memberInfo",
                        data: memberInfo,
                    });
                    userNameDB = memberInfo.userName;

                    localStorage.setItem("memberCode", JSON.stringify(memberInfo.memberCode));
                    NotificationDevice(memberInfo.memberCode);
                    memberCode = memberInfo.memberCode; //寫入用戶 memberCode

                    //追蹤membercode piwik
                    PiwikMemberCode(memberInfo?.memberCode);

                    // 檢測國家
                    if (isOtp) {
                        Actions.LoginOtp({
                            memberInfo: memberInfo,
                            formPage: "loginOTP",
                        });
                        return;
                    } else if (isRevalidate) {
                        if (window.LANGUAGE == "VN") {
                            this.getVerifyTimes();
                            this.showRevalidateModal(memberInfo);
                            return;
                        } else {
                            Actions.LoginOtp({
                                memberInfo: memberInfo,
                                formPage: "reSetPwd",
                            });
                            return;
                        }
                    }

                    if (needResetPwd) {
                        if (isMandatoryReset) {
                            Actions.SetPassword({
                                queleaReferreeStatus,
                                isMandatoryReset,
                                needResetPwd,
                                onLoginSuccess: this.handleLoginSuccess,
                            });
                            Toasts.removeAll();
                            return;
                        } else {
                            // Check if user recently dismissed password reset prompt
                            const shouldShowPasswordReset = await this.checkPasswordResetCache(queleaReferreeStatus, isMandatoryReset, needResetPwd, this.handleLoginSuccess);
                            if (shouldShowPasswordReset) {
                                return;
                            }
                        }
                    }

                    //this.timeOut = setTimeout(() => {
                    let userName = "loginok";
                    let password = "loginok";

                    if (from === "setPwd") {
                        this.props?.login({ userName, password });
                        judgeMemberStatus({ queleaReferreeStatus, from });
                    } else {
                        this.props?.login({ userName, password });
                        Actions.Home();
                    }

                    this.props?.userInfo_getBalance(true).then(() => {
                        this.props.userSetting?.loginCallBackFunObj?.callBack();
                    }); //redux 獲取SB餘額
                    Toasts.success(`${translate("登入成功 ")}${userNameDB}`, 2);
                    window.LANGUAGE != "CN" && this.state.isRegister && GetGlobalModal({
                        name: "RegisterSuccessModal",
                        wrapStyle: { width: "90%" },
                    });
                    //}, 2000);
                }
            })
            .catch(error => {
                Toasts.removeAll();
            });
    }

    // New method to show the revalidation modal
    showRevalidateModal = (memberInfo) => {
        // Extract phone and email from memberInfo contacts
        const phoneData = memberInfo.contacts?.filter(
            (item) => item.contactType.toLocaleLowerCase() == "phone"
        )[0];
        const emailData = memberInfo.contacts?.filter(
            (item) => item.contactType.toLocaleLowerCase() == "email"
        )[0];

        let phone = phoneData && phoneData.contact || "";
        let email = emailData && emailData.contact || "";

        GetGlobalModal({
            title: translate("保护您的账户安全"),
            iconName: "warning",
            message: translate("为确保您的帐户安全受到保护，请验证您的信息。这有助于防止身份盗用并减少交易风险。如果您现在退出，您的登录将不会成功。"),
            cancelText: translate("跳过验证"),
            onCancel: () => {},
            confirmText: translate("进行验证"),
            onConfirm: () => {
                if (this.state.zaloVerifyTime == 0 && !(this.state.smsVerifyTime == 0 && this.state.voiceVerifyTime == 0 && this.state.emailVerifyTime == 0)) {
                    Actions.MobileVerificationMethod({
                        memberInfo: memberInfo,
                        from: "reSetPwd",
                        serviceAction: "Revalidate"
                    });
                }
                // if other method also exceed attempt limit
                else if (this.state.smsVerifyTime == 0 && this.state.voiceVerifyTime == 0 && this.state.emailVerifyTime == 0) {
                    Actions.OTPLimitExceed();
                }
                else {
                    Actions.Verification({
                        dataPhone: phone,
                        dataEmail: email,
                        verificaType: "phone",
                        verificationMethod: "Zalo",
                        memberCode: memberInfo.memberCode,
                        noMoreverifcation: false,
                        formPage: "reSetPwd",
                        getUser: () => {
                            this.getUser();
                        },
                        serviceAction: "Revalidate",
                        memberInfo: memberInfo,
                    });
                }
            }
        });
    };

    keepfastLogin(userName, password) {
        //快速登陆记住用户名密码
        let passwordKey = "passwordKey" + userName.toLowerCase();
        StorageUtil.save({
            key: passwordKey,
            data: password,
        });
    }

    fastLogins(key) {
        const loginUsername = this.state.loginUsername.toLowerCase();
        let fastLoginKey = "fastLogin" + loginUsername;
        let sfastLoginId = "fastLogin" + loginUsername;
        let emptyLogMsg = "";
        if (loginUsername == "") {
            this.setState({
                canLogin: false,
                invalidLoginUsername: translate("请输入您的用户名"),
            });
            return;
        }

        StorageUtil.load(fastLoginKey)
            .then(data => {
                if (key == data) {
                    //已经有登陆记录，直接跳转登陆
                    Actions.FastLogin({
                        userName: this.state.loginUsername.toLowerCase(),
                        FastLogin: data,
                        LoginBanner: bgImg[this.state.type],
                    });
                } else {
                    //	有登陆记录，但是Android选择有两种 ，选中不是缓存的跳转重新设定
                    Actions[key]({
                        userName: this.state.loginUsername.toLowerCase(),
                        LoginBanner: bgImg[this.state.type],
                    });
                }
            })
            .catch(err => {
                //	没有登陆记录，跳转设置
                Actions[key]({
                    userName: this.state.loginUsername.toLowerCase(),
                    LoginBanner: bgImg[this.state.type],
                });
            });
    }

    keepNamePassw(userName, password) {
        //记住我
        StorageUtil.save({
            key: "userName",
            data: userName,
        });
        if (this.state.checkName) {
            StorageUtil.save({
                key: "password",
                data: password,
            });
        } else {
            StorageUtil.remove("password");
        }

        StorageUtil.save({
            key: "username",
            data: userName,
        });
        StorageUtil.save({
            key: "userName",
            data: userName,
        });
        StorageUtil.save({
            key: "password",
            data: password,
        });
    }

    //忘記密碼 名字
    forget() {
        Actions.ForgetName();
    }

    eyes(key) {
        this.setState({
            [key]: !this.state[key],
        });
    }

    // 切换类型:登录/注册
    toggleType(type) {
        this.setState({
            type,
            emptyLogName: "",
            emptyLogNameST: false, // 登录-用户名格式。
            emptyLogPwd: false, // 登录-空密码。
            emptyLogPwdST: false, // 登录-空密码。
            emptyRegName: false, // 注册-空用户名。
            invalidRegName: "", // 注册-错误格式的用户名。
            emptyRegPhone: false, // 注册-空手机号码
            invalidRegPhone: "", // 注册-错误的手机号码
            invalidRegPwd: "", // 注册-错误的密码
            invalidRegEmail: "",
            differentRegPwd: false, // 注册-不一致的密码
            canLogin: this.state.canLogin ? true : false,
            canReg: false,
            emailAddress: "",
            registerNumber: "",
            registerPwd: "",
            registerUsername: "",
            isFocusRegUsername: false,
            isFocusRegEmail: false,
            showPasswordRequirements: false,
        });
        if (type == "register") {
            //获取注册手机格式验证
            const transaction = Sentry.startTransaction({
                name: "Register",
                op: "navigation",
            });
            transaction && transaction.finish && transaction.finish();
        }
    }

    lockLoginFun(num) {
        //指纹脸部识别，call一次密码api可以识别3次，
        // android指纹错误1次call一次
        //ios指纹错误1次call3次
        //ios脸部错误1次call2次

        window.lockLogin += 1;

        let apiUrl = common_url + "/api/Login?siteId=31&api-version=1.0&brand=tlc&Platform=ios";
        let header = {
            "Content-Type": "application/json; charset=utf-8",
            Culture: window.DefaultConfig?.Culture,
        };

        let params = {
            hostName: common_url,
            captchaId: "30172f1a-c2c9-4fb7-afaf-2a4eb9391e44",
            captchaCode: "999999",
            grantType: "password",
            clientId: window.DefaultConfig.clientId,
            clientSecret: window.DefaultConfig.clientSecret,
            userName: this.state.loginUsername,
            password: this.state.loginPwd,
            scope: "Mobile.Service offline_access",
            appId: "net.GB2BC.FUN88",
            siteId: window.siteId,
            ipAddress: "1.1.1.1",
            e2: E2Backbox || "",
        };

        const fetchData = {
            method: "POST",
            headers: header,
            body: JSON.stringify(params),
        };
        return fetch(apiUrl, fetchData)
            .then(response => response.json())
            .then(jsonData => {
                if (jsonData.error_details && jsonData.error_details.Code == "MEM00060") {
                    window.lockLogin = 6;

                    // Alert.alert('密码错误', '提交次数上限为五次，已超过尝试的限制，请联系客服！',
                    // [{ text: 'Xác Nhận', onPress: () => {LiveChatOpenGlobe()} }],);
                } else {
                    num > 1 && this.lockLoginFun(num - 1);
                }
                StorageUtil.save({
                    key: `lockLogin${this.state.loginUsername}`,
                    data: window.lockLogin,
                });
            });
    }

    async InfoValidity(key) {
        let { registerUsername, emailAddress, invalidRegName, invalidRegEmail } = this.state;
        let value = key == "Username" ? registerUsername : emailAddress;
        if (key == "Username") {
            if (!(registerUsername.length && invalidRegName == "")) return;
        }
        if (key == "Email") {
            if (!(emailAddress.length && invalidRegEmail == "")) return;
        }

        try {
            let data = await fetchRequest(ApiPort.InfoValidity + `key=${key}&value=${value}&`, "GET");
            if (!(data.isSuccess && data.result)) {
                this.catchErr(key);
            }
        } catch (err) {
            //this.catchErr(key)
        }
    }

    catchErr(key) {
        if (key == "Email") {
            this.setState(
                {
                    invalidRegEmail: translate("该电子电子邮箱不可用。请输入其他电子邮箱。"),
                },
                () => {
                    this.checkCanReg();
                },
            );
            return;
        }

        if (key == "Username") {
            this.setState(
                {
                    invalidRegName: translate("用户名不可用，请尝试其他用户名"),
                },
                () => {
                    this.checkCanReg();
                },
            );
            return;
        }
    }

    // New method to handle login success
    handleLoginSuccess = () => {
        let userName = "loginok";
        let password = "loginok";
        this.props?.login({ userName, password });
        this.props?.userInfo_getBalance(true); //redux 獲取SB餘額
    };

    async checkPasswordResetCache(queleaReferreeStatus, isMandatoryReset, needResetPwd, loginSuccessCallback) {
        try {
            const cacheCheck = await StorageUtil.load("needResetPwdCache");

            console.log("cacheCheck found:", cacheCheck);

            // Check if cache exists, has expireTime, and is still valid (not expired)
            if (cacheCheck && cacheCheck.expireTime && new Date().getTime() < cacheCheck.expireTime) {
                // Cache exists and not expired - skip password reset
                console.log("Password reset cache found and not expired, skipping prompt");
                return false; // Don't show password reset, continue with normal flow
            } else {
                // Cache exists but expired - show password reset
                console.log("Password reset cache expired, showing reset prompt");
                Actions.SetPassword({
                    queleaReferreeStatus,
                    isMandatoryReset,
                    needResetPwd,
                    onLoginSuccess: loginSuccessCallback
                });
                Toasts.removeAll();
                return true; // Password reset was triggered, stop normal flow
            }
        } catch (error) {
            // Cache not found (first time) or other error - show password reset
            console.log("Password reset cache not found (first time), showing reset prompt");
            Actions.SetPassword({
                queleaReferreeStatus,
                isMandatoryReset,
                needResetPwd,
                onLoginSuccess: loginSuccessCallback
            });
            Toasts.removeAll();
            return true; // Password reset was triggered, stop normal flow
        }
    }

    renderSuggestedEmailDomain = domain => {
        const { emailAddress } = this.state;
        const userName = emailAddress.split("@")[0];
        const suggestedEmail = userName + "@" + domain;
        return (
            <Pressable
                key={domain}
                style={({ pressed }) => [styles.suggestedEmailDomain, pressed ? { backgroundColor: "#00A6FF" } : {}]}
                onPress={() => {
                    this.setState({ showSuggestedEmailDomain: false });
                    this.handleRegisterInput("emailAddress", suggestedEmail, true);
                }}>
                {({ pressed }) => <Text style={[styles.suggestedEmailText, pressed ? styles.suggestedEmailTextPressed : null]}>{suggestedEmail}</Text>}
            </Pressable>
        );
    };

    getVerifyTimes() {
        let processed = ["SMS", "Voice", "Email", "Zalo"].map(v =>
            fetchRequest(ApiPort.VerificationAttempt + `?serviceAction=Revalidate&channelType=${v}&`, "GET")
        );
        Promise.all(processed).then((res) => {
            if (Array.isArray(res) && res.length) {
                // Each result: SMS, Voice, Email, Zalo
                let smsVerifyTime = res[0]?.isSuccess ? (res[0]?.result?.count || res[0]?.result) : 0;
                let voiceVerifyTime = res[1]?.isSuccess ? (res[1]?.result?.count || res[1]?.result) : 0;
                let emailVerifyTime = res[2]?.isSuccess ? (res[2]?.result?.count || res[2]?.result) : 0;
                let zaloVerifyTime = res[3]?.isSuccess ? (res[3]?.result?.count || res[3]?.result) : 0;

                this.setState({
                    zaloVerifyTime,
                    smsVerifyTime,
                    voiceVerifyTime,
                    emailVerifyTime,
                });
            }
        }).catch(err => {
            console.error("Error checking verification attempts:", err);
            // Set all attempts to 0 on error
            this.setState({
                zaloVerifyTime: 0,
                smsVerifyTime: 0,
                voiceVerifyTime: 0,
                emailVerifyTime: 0,
            });
        });
    }

    renderSponsorship(v, i) {
        let { mobile_image, mobile_forwarding_url = "", mobile_text = "" } = v;
        return (
            <ColumnStartCenter
                key={i}
                style={[styles.sponsorshipList]}
                onPress={() => {
                    if (!mobile_forwarding_url) return;

                    if (window.LANGUAGE === "CN") {
                        Actions.CustomWebView({
                            pageTitle: mobile_text,
                            source: mobile_forwarding_url,
                        });
                    } else {
                        Linking.openURL(mobile_forwarding_url);
                    }
                }}
            >
                <Image
                    resizeMode="stretch"
                    source={mobile_image}
                    style={styles.sponsorshipImage}
                />

                <ColumnCenterCenter>
                    {
                        mobile_text.split(/[\n]+/).map((line, index) => (
                            <Text
                                key={index}
                                style={styles.sponsorshipText}
                            >
                                {line}
                            </Text>
                        ))
                    }
                </ColumnCenterCenter>
            </ColumnStartCenter>
        );
    }

    renderSponsorshipLayout(sponsorship) {
        if (!sponsorship || sponsorship.length === 0) {
            return null;
        }

        const { length } = sponsorship;

        // 1-2个赞助商：显示在一行
        if (length <= 2) {
            return (
                <RowCenterCenter style={styles.sponsorship}>
                    {sponsorship.map(this.renderSponsorship)}
                </RowCenterCenter>
            );
        }

        // 3个赞助商：第一行2个，第二行1个
        if (length === 3) {
            return (
                <View>
                    <RowCenterCenter style={styles.sponsorship}>
                        {sponsorship.slice(0, 2).map(this.renderSponsorship)}
                    </RowCenterCenter>
                    <RowCenterCenter style={styles.sponsorship}>
                        {sponsorship.slice(2).map(this.renderSponsorship)}
                    </RowCenterCenter>
                </View>
            );
        }

        // 4个或更多赞助商：每行2个
        return (
            <View>
                <RowCenterCenter style={styles.sponsorship}>
                    {sponsorship.slice(0, 2).map(this.renderSponsorship)}
                </RowCenterCenter>
                <RowCenterCenter style={styles.sponsorship}>
                    {sponsorship.slice(2, 4).map(this.renderSponsorship)}
                </RowCenterCenter>
            </View>
        );
    }

    render() {
        const {
            checkName,
            loginUsername,
            loginPwd,
            registerUsername,
            registerPwd,
            emailAddress,
            registerNumber,
            type,
            affCode,
            invalidRegName,
            invalidRegPhone,
            invalidRegPwd,
            invalidRegEmail,
            canLogin,
            affCodeEditable,
            canReg,
            registerPadding,
            emptyLogMsg,
            invalidLogPwd,
            invalidLoginUsername,
            prefixesMaxLength,
            showSuggestedEmailDomain,
            captchaVisible,
            sponsorship,
            showPasswordRequirements,
        } = this.state;

        window.LockLoginFun = num => {
            this.lockLoginFun(num);
        };

        //指纹脸部九宫格快捷登陆
        window.fastLogin = (loginUsername, loginPwd, key, page) => {
            this.setState(
                {
                    type: "login",
                    loginUsername,
                    loginPwd,
                    canLogin: true,
                },
                () => {
                    let keyTemp = "";
                    //key,快捷登陆方式，登陆成功保存本地
                    if (page == "FastLogin") {
                        this.setState({
                            loginType: key,
                        });
                        keyTemp = "";
                    } else {
                        keyTemp = key;
                    }
                    this.login(keyTemp);
                },
            );
        };

        const filteredSuggestedEmailDomains = suggestedEmailDomain[window.LANGUAGE].filter(domain => domain.startsWith(emailAddress.split("@")[1]));
        let tempImg = bgImg[this.state.type];
        return (
            <KeyboardAwareScrollView style={styles.scrollContainer}>
                <ImageBackground source={tempImg} style={styles.bgView}>
                    <View style={styles.topSpacer}></View>
                    <RowCenterBetween style={styles.loginNav}>
                        <CloseIcon
                            width={20}
                            height={20}
                            fill={Color.charcoal}
                            onPress={() => {
                                Actions.pop();
                            }}
                            wrapStyle={styles.closeIconWrap}
                        />
                        <LiveChat
                            callBack={() => {
                                type == "login" ? PiwikEventDataHandle("login6") : PiwikEventDataHandle("register4");
                            }}
                        />
                    </RowCenterBetween>
                </ImageBackground>



                <ColumnCenterCenter style={styles.loginView}>
                    <NavTab
                        wrapStyle={styles.loginType}
                        activeKey={type == "login" ? 0 : 1}
                        tabData={[translate("登录"), translate("注册")]}
                        activeBackGroundColor={Color.theme}
                        navWidth={window.LANGUAGE == "VN" ? 220 : 192}
                        textStyle={styles.navTabText}
                        textActiveStyle={styles.navTabTextActive}
                        callBack={({ key }) => {
                            if (key == 0) {
                                this.toggleType("login");
                                PiwikEventDataHandle("login2");
                            } else {
                                this.toggleType("register");
                                PiwikEventDataHandle("register3");
                            }
                        }}></NavTab>

                    {type == "login" &&
                        <View style={styles.registerWrap}>
                            {emptyLogMsg != "" && <InfoBar type={"error"} text={emptyLogMsg} />}

                            <CustomTextInput
                                leftIconName={"user"}
                                errorMessage={invalidLoginUsername}
                                type={"error"}
                                ref={this._loginInput1}
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    this._loginInput2.current?.focus();
                                }}
                                underlineColorAndroid="transparent"
                                value={loginUsername}
                                placeholder={translate("用户名")}
                                placeholderTextColor="#BCBEC3"
                                maxLength={20}
                                textContentType="username"
                                onChangeText={value => this.handleLoginInput("loginUsername", value)}
                            />

                            <CustomTextInput
                                leftIconName={"password"}
                                errorMessage={invalidLogPwd}
                                type={"error"}
                                showEyes={true}
                                ref={this._loginInput2}
                                returnKeyType="done"
                                underlineColorAndroid="transparent"
                                value={loginPwd}
                                placeholder={translate("密码")}
                                placeholderTextColor="#BCBEC3"
                                maxLength={20}
                                textContentType="password"
                                onChangeText={value => this.handleLoginInput("loginPwd", value)}
                            />

                            <RowCenterBetween style={styles.checkBoxFlex}>
                                <CustomCheckbox
                                    isFull={true}
                                    isCheck={checkName}
                                    text={translate("记住我")}
                                    onPress={checkName => {
                                        this.setState({ checkName: checkName });
                                        PiwikEventDataHandle("login3");
                                    }}
                                    wrapStyle={{ marginVertical: 0 }}
                                />

                                <UnderlinedButton
                                    text={translate("忘记用户名或密码？")}
                                    onPress={() => {
                                        this.forget();
                                        PiwikEventDataHandle("login4");
                                    }}
                                    textDecorationLine={"none"}
                                    wrapStyle={{ marginBottom: 0 }}
                                />
                            </RowCenterBetween>

                            <FilledButton
                                text={translate("登录")}
                                enable={loginUsername !== "" && loginPwd !== "" && canLogin}
                                onPress={() => {
                                    this.login();
                                }}
                            />

                            <View>
                                {
                                    Platform.OS == "ios" && DeviceInfoIos &&
                                    <FilledButton
                                        text={DeviceInfoIos ? translate("脸部辨识快速登录") : translate("使用指纹辨识")}
                                        onPress={() => {
                                            this.fastLogins("LoginTouch");
                                            PiwikEventDataHandle("login1.2");
                                        }}
                                        wrapStyle={{
                                            backgroundColor: "#E5F6FF",
                                            marginTop: 12,
                                        }}
                                        textStyle={[styles.loginIconWrapText, {
                                            marginLeft: 6
                                        }]}>
                                        {
                                            DeviceInfoIos
                                                ?
                                                <FaceIcon fill={Color.theme} />
                                                :
                                                <FingerprinIcon fill={Color.theme} />
                                        }
                                    </FilledButton>
                                }

                                {
                                    Platform.OS == "android" &&
                                    <RowCenterBetween style={styles.mt12}>
                                        <FilledButton
                                            text={translate("使用指纹辨识")}
                                            onPress={() => {
                                                this.fastLogins("LoginTouch", 1);
                                            }}
                                            wrapStyle={styles.loginIconWrap}
                                            textStyle={styles.loginIconWrapText}>
                                            <FingerprinIcon fill={Color.theme} />
                                        </FilledButton>

                                        <FilledButton
                                            text={translate("使用图形密码")}
                                            onPress={() => {
                                                this.fastLogins("LoginPattern", 2);
                                            }}
                                            wrapStyle={styles.loginIconWrap}
                                            textStyle={styles.loginIconWrapText}>
                                            <PatterIcon fill={Color.theme} />
                                        </FilledButton>
                                    </RowCenterBetween>
                                }

                                <UnderlinedButton
                                    text={translate("先去逛逛")}
                                    onPress={() => {
                                        this.props.from ? Actions.pop() : Actions.Home();
                                        PiwikEventDataHandle("login5");
                                    }}
                                    titleStyle={{
                                        color: Color.theme,
                                        fontWeight: "600",
                                    }}
                                    textDecorationLine={"none"}
                                    wrapStyle={{ marginTop: 28, height: 44 }}
                                />
                            </View>

                            {this.renderSponsorshipLayout(sponsorship)}


                        </View>
                    }

                    {type == "register" &&
                        <View
                            style={[styles.registerWrap, registerPadding ? styles.registerWrapPadding : null]}>
                            <CustomTextInput
                                leftIconName={"user"}
                                errorMessage={invalidRegName}
                                type={"error"}
                                ref={this._registerInput1}
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    this._registerInput2.current?.focus();
                                }}
                                underlineColorAndroid="transparent"
                                value={registerUsername}
                                placeholder={translate("用户名")}
                                placeholderTextColor="#BCBEC3"
                                maxLength={14}
                                textContentType="username"
                                onChangeText={value => this.handleRegisterInput("registerUsername", value)}
                                onFocus={() => {
                                    this.setState({ registerPadding: true });
                                }}
                                onBlur={this.InfoValidity.bind(this, "Username")}
                            />

                            <CustomTextInput
                                leftIconName={"password"}
                                errorMessage={invalidRegPwd}
                                hasError={showPasswordRequirements}
                                type={"error"}
                                showEyes={true}
                                ref={this._registerInput2}
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    this._registerInput3.current?.focus();
                                }}
                                underlineColorAndroid="transparent"
                                value={registerPwd}
                                placeholder={translate("密码")}
                                placeholderTextColor="#BCBEC3"
                                maxLength={20}
                                textContentType="password"
                                onChangeText={value => this.handleRegisterInput("registerPwd", value)}
                            />

                            <PasswordRequirements showRequirements={showPasswordRequirements} />

                            <CustomTextInput
                                leftIconName={"phone"}
                                renderInnerLeft={() => {
                                    return <Text style={styles.countryCodeText}> + {DefaultConfig[window.LANGUAGE]?.countryCallingCode}</Text>;
                                }}
                                errorMessage={invalidRegPhone}
                                type={"error"}
                                ref={this._registerInput3}
                                onSubmitEditing={() => {
                                    this._registerInput4.current?.focus();
                                }}
                                style={[styles.input, { paddingLeft: 0 }]}
                                underlineColorAndroid="transparent"
                                value={registerNumber}
                                placeholder={translate("联系电话")}
                                placeholderTextColor="#BCBEC3"
                                maxLength={prefixesMaxLength}
                                keyboardType="number-pad"
                                textContentType="telephoneNumber"
                                // textContentType="phone-pad"
                                onChangeText={value =>
                                    //CXF1-7294
                                    this.handleRegisterInput("registerNumber", value.replace(/[^0-9]/g, ""))
                                }
                            />

                            <CustomTextInput
                                leftIconName={"email"}
                                errorMessage={invalidRegEmail}
                                type={"error"}
                                containerStyle={styles.relativeZ2}
                                ref={this._registerInput4}
                                returnKeyType="done"
                                underlineColorAndroid="transparent"
                                value={emailAddress}
                                placeholder={translate("电子邮箱")}
                                placeholderTextColor="#BCBEC3"
                                maxLength={50}
                                textContentType="emailAddress"
                                onBlur={this.InfoValidity.bind(this, "Email")}
                                onChangeText={value => {
                                    let stillShowed = value.includes("@");
                                    this.setState({
                                        showSuggestedEmailDomain: stillShowed,
                                    });
                                    this.handleRegisterInput("emailAddress", value);
                                }}
                                onFocus={() => {
                                    this.setState({ registerPadding: true });
                                }}>
                                {showSuggestedEmailDomain &&
                                    <View style={styles.suggestedEmailDomainContainer}>
                                        <View>
                                            {filteredSuggestedEmailDomains.map(item => {
                                                return this.renderSuggestedEmailDomain(item);
                                            })}
                                        </View>
                                    </View>
                                }
                            </CustomTextInput>

                            <CustomTextInput
                                leftIconName={"code"}
                                renderRight={() => {
                                    return (
                                        <View style={styles.codeRightWrap}>
                                            <Text style={styles.optionalHint}>{translate("(非必填)")}</Text>
                                        </View>
                                    );
                                }}
                                disabled={!affCodeEditable}
                                underlineColorAndroid="transparent"
                                value={affCode}
                                placeholder={translate("推荐代码")}
                                placeholderTextColor="#BCBEC3"
                                maxLength={16}
                                textContentType="username"
                                onChangeText={value => {
                                    let val = value.replace(/[^a-zA-Z0-9]/, "");
                                    this.handleRegisterInput("affCode", val);
                                }}
                            />

                            <CustomLinkText
                                text={translate("点击“注册”即确认您已年满{X}周岁，且理解并接受我们的{条款}", { X: MIN_AGE })}
                                wrapStyle={styles.registerTipsWrap}
                                textAlign={"center"}
                                onPressList={[
                                    () => {
                                        let temp = HelpKnowledgeBaseIDObj[window.LANGUAGE];
                                        // https://arcadie.atlassian.net/browse/FSC-472
                                        LiveChatOpenGlobe({
                                            csp: true,
                                            articleNumber: temp[`${window.isStaging}articleNumber`],
                                            categoryUID: temp[`${window.isStaging}categoryUID`],
                                        });
                                        PiwikEventDataHandle("register2");
                                    },
                                ]}></CustomLinkText>

                            <FilledButton
                                text={translate("注册")}
                                enable={canReg}
                                onPress={() => {
                                    this.postRegist(true);
                                }}
                            />

                            { // // https://arcadie.atlassian.net/browse/FSC-188
                                <ReactCaptcha
                                    key={registerUsername}
                                    captchaVisible={captchaVisible}
                                    getCaptchaInfo={props => {
                                        this.captcha = props;
                                    }}
                                    closePopup={() => this.setState({ captchaVisible: false })}
                                    onMatch={this.captchaOnMatch.bind(this)}
                                    captchaIsDisabled={this.captchaIsDisabled}
                                />
                            }
                        </View>
                    }
                </ColumnCenterCenter>
            </KeyboardAwareScrollView>
        );
    }
}

const mapStateToProps = state => ({
    authToken: state.auth.authToken,
    email: state.auth.email,
    userSetting: state.userSetting,
});

const mapDispatchToProps = dispatch => ({
    loginAfterCallBack: data => dispatch(actions.ACTION_LoginAfterCallBack(data)),
    login: loginDetails => {
        login(dispatch, loginDetails);
    },
    userInfo_login: userName => dispatch(actions.ACTION_UserInfo_login(userName)),
    userInfo_updateMemberInfo: data => dispatch(actions.ACTION_UserInfo_updateMemberInfo(data)),
    userInfo_getBalance: (forceUpdate = false) => dispatch(actions.ACTION_UserInfo_getBalanceAll(forceUpdate)),
    userSetting_updateListDisplayType: currentType => actions.ACTION_UserSetting_Update(currentType),
    phone_setting: phonePrefix => dispatch(actions.ACTION_PhoneSetting_Update(phonePrefix)),
    getSelfExclusionsAction: (forceUpdate = false) => dispatch(actions.ACTION_SelfExclusionsAction(forceUpdate)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);

const styles = StyleSheet.create({
    checkBoxFlex: {
        marginVertical: 20,
        marginTop: 15
    },
    bgView: {
        height: width * 0.752,
        width: width,
        top: 0,
        left: 0,
    },
    loginNav: {
        width: width,
        padding: 14,
    },
    loginView: {
        top: -30,
        backgroundColor: "#fff",
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        padding: 16,
        width: width,
    },
    loginType: {
        backgroundColor: "#7676801F",
        marginBottom: 20,
    },
    sponsorship: {
        marginTop: 28,
        marginBottom: 24,
    },
    sponsorshipList: {
        width: 160,
        height: 110, // 添加固定高度
        marginHorizontal: 6, // 添加水平间距
    },
    sponsorshipImage: {
        width: 58,
        height: 58,
        marginBottom: 15,
    },
    sponsorshipText: {
        color: "#BCBEC3",
        fontSize: 12,
        textAlign: "center",
        flexWrap: "wrap",
        fontWeight: "400",
    },
    revalidateModalText: {
        fontSize: 14,
        textAlign: "center",
        color: "#222",
        paddingHorizontal: 20,
        fontWeight: "400",
    },
    loginIconWrap: {
        backgroundColor: "#E5F6FF",
        width: "48.5%",
    },
    registerWrapPadding: {
        paddingBottom: 250,
    },
    navTabText: {
        color: Color.placeholderGray,
    },
    navTabTextActive: {
        color: Color.white,
    },
    scrollContainer: {
        flex: 1,
        backgroundColor: "#fff",
    },
    topSpacer: {
        height: DeviceInfoIos ? 50 : 10,
    },
    registerWrap: {
        paddingHorizontal: 15,
        width,
    },
    mt12: {
        marginTop: 12,
    },
    relativeZ2: {
        position: "relative",
        zIndex: 2,
    },
    codeRightWrap: {
        position: "absolute",
        right: 10,
    },
    optionalHint: {
        color: "#bcbec3",
    },
    closeIconWrap: {
        backgroundColor: Color.white,
        width: 28,
        height: 28,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    visitWrap: {
        marginTop: 28,
        height: 44,
    },
    countryCodeText: {
        color: "#BCBEC3",
    },
    suggestedEmailText: {
        color: "#000000",
    },
    suggestedEmailTextPressed: {
        color: "#FFF",
    },
    registerTipsWrap: {
        paddingHorizontal: 30,
        marginBottom: 10,
    },
    loginIconWrapText: {
        color: Color.theme,
        fontWeight: window.LANGUAGE == "VN" && Platform.OS == "android" ? "400" : "500",
        fontSize: window.LANGUAGE == "VN" && Platform.OS == "android" ? 8 : 14
    },

    suggestedEmailDomainContainer: {
        position: "absolute",
        top: 50,
        overflow: "hidden",
        zIndex: 9999999,
        elevation: 2,
        borderRadius: 8,
        borderColor: "#E6E6EB",
        borderWidth: 1,
    },
    suggestedEmailDomain: {
        height: 38,
        marginBottom: 0,
        backgroundColor: "#FFF",
        alignItems: "center",
        flexDirection: "row",
        elevation: 2,
        zIndex: 2,
        paddingLeft: 10,
        paddingRight: 10,
        borderColor: "#E6E6EB",
        borderBottomWidth: 1,
        width: width - 30,
    },
});
