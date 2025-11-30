import React from "react";
import { Alert, Dimensions, Image, Linking, Modal, NativeModules, Platform, Text, View } from "react-native";
import { connect } from "react-redux";

import { Toasts } from "$Toasts";
const { Openinstall } = NativeModules;
import FingerprintScanner from "react-native-fingerprint-scanner";
import { Actions } from "react-native-router-flux";
import Touch from "react-native-touch-once";

import { passwordReg } from "../../actions/Reg";
import { login } from "../../lib/redux/actions/AuthAction";
import styles from "./style";
const { width, height } = Dimensions.get("window");

import CustomTextInput from "$Components/CustomTextInput";
import FilledButton from "$Components/FilledButton";
import { translate } from "$locales/translate";
import { LiveChatOpenGlobe, LogoutUtil } from "$Utils";
import StorageUtil from "$Utils/Storage";
import { SuccessIcon, FaceIcon, FingerprinIcon, PatterIcon } from "$Components/icons/index";
import Color from "$Components/Color";

// 指纹识别
class LoginTouch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            LoginTouchNum: window.LoginTouchNum,
            msgtype: 100,
            loginBtn: false,
            emptyLogMsg: "",
            imagesArray: [],
            loginPwd: "",
            validation: "",
            validationActive: "",
            validationSuccess: false,
            loginUsername: this.props.userName || "",
            passErr: 0,
        };
    }

    componentDidMount() {
        this.props.navigation &&
            this.props.navigation.setParams({
                title: DeviceInfoIos ? translate("脸部辨识认证") : translate("指纹辨识认证"), // '脸部辨识快速登录' : '指纹辨识认证'
            });

        // 添加 null 检查
        const loginTouchNum = window.LoginTouchNum || 0;
        if (loginTouchNum > 2 || (((DeviceInfoIos && loginTouchNum > 1) || (!DeviceInfoIos && loginTouchNum > 0)) && Platform.OS == "ios")) {
            //ios一次等于3次
            let title = (DeviceInfoIos ? translate("脸部解锁") : translate("指纹辨识")) + translate("功能已关闭"); /// '脸部解锁' : '指纹辨识'}功能已关闭`
            let message = `${DeviceInfoIos ? translate("脸部辨识失败4次") : translate("指纹辨识失败3次")}，${translate("请使用一般登入或是 联系客服。")}`; // "脸部辨识失败4次" : "指纹辨识失败3次"}，请使用一般登入或是 联系客服。`
            Alert.alert(title, message, [
                {
                    text: translate("确认3"),
                    onPress: () => {
                        Actions.Login({ from: "LoginTouch" });
                    },
                },
            ]);
            return;
        }
    }
    componentWillUnmount() {
        try {
            Platform.OS == "android" && FingerprintScanner.release();
        } catch (error) {
            console.log("FingerprintScanner.release error:", error);
        }
        this.setState({ validationSuccess: false });
    }

    handleTextInput(key, value) {
        let emptyLogMsg = "";
        let loginBtn = true;
        if (!passwordReg.test(value) || value === "") {
            emptyLogMsg = translate("请输入正确的密码。");
            loginBtn = false;
        }
        this.setState({ emptyLogMsg, loginBtn });

        this.setState({
            [key]: value,
        });
    }

    // 提交按钮
    okBtn() {
        const { loginPwd } = this.state;
        if (this.state.emptyLogMsg || this.state.loginPwd == "") {
            return;
        }
        const loginTouchNum = window.LoginTouchNum || 0;
        if (loginTouchNum > 2 || (((DeviceInfoIos && loginTouchNum > 1) || (!DeviceInfoIos && loginTouchNum > 0)) && Platform.OS == "ios")) {
            //ios一次等于3次
            let title = `${DeviceInfoIos ? translate("脸部解锁") : translate("指纹辨识")}` + translate("功能已关闭"); // '脸部解锁' : '指纹辨识'}功能已关闭
            let message = `${DeviceInfoIos ? translate("脸部辨识失败4次") : translate("指纹辨识失败3次")}，${translate("请使用一般登入或是 联系客服。")}`; // "脸部辨识失败4次" : "指纹辨识失败3次"}，请使用一般登入或是 联系客服。`
            Alert.alert(title, message, [{ text: translate("确认3"), onPress: () => {} }]);
            return;
        }

        if (this.props.fastChange) {
            //我的 -》本地密码对比，没问题保存修改
            let fastLoginKey = "fastLoginPass" + this.state.loginUsername.toLowerCase();
            StorageUtil.load(fastLoginKey)
                .then(ret => {
                    if (!ret) {
                        // 没有数据，执行之前的 catch 逻辑
                        Toasts.fail(translate("网络错误，请重新登陆"));
                        // m1 邏輯
                        LogoutUtil({
                            callBack: () => {
                                Actions.pop();
                            }
                        });
                        return;
                    }
                    if (ret != this.state.loginPwd) {
                        //5崔退出，密码错误弹窗
                        let passErr = this.state.passErr;
                        passErr += 1;
                        this.setState({ passErr });
                        Alert.alert(translate("密码错误"), translate("请重新输入，错误5次将强制登出账号。"), [
                            {
                                text: translate("确认3"),
                                onPress: () => {
                                    if (passErr == 5) {
                                        LogoutUtil({
                                            callBack: () => {
                                                Actions.pop();
                                            }
                                        });
                                    }
                                },
                            },
                        ]);
                    } else {
                        this.setState({ validationActive: "" });
                        setTimeout(() => {
                            this.setState({ validationActive: "active" });
                        }, 500);
                    }
                });
        } else {
            //先去登陆，在验证指纹脸部
            window.FastLoginErr += 1;
            window.fastLogin && window.fastLogin(this.state.loginUsername, this.state.loginPwd, "LoginTouch");
        }
    }

    // 返回按钮
    goBack() {
        Actions.pop();
    }
    successActive() {
        //验证成功
        window.LoginTouchNum = 0;
        this.setState({ validationActive: "success" });
        //保存快捷登陆方式
        let fastLoginKey = "fastLogin" + this.state.loginUsername.toLowerCase();
        StorageUtil.save({
            key: fastLoginKey,
            data: "LoginTouch",
        });
        StorageUtil.save({
            key: `lockTouch${userNameDB.toLowerCase()}`,
            data: window.LoginTouchNum,
        });
    }

    //设置成功按钮
    successBtn() {
        //验证成功跳转
        if (this.props.fastChange) {
            console.log("yesssssssssss");
            //我的页面  进入
            this.props.changeBack();
            Actions.pop();
        } else {
            console.log("noooooooooooooo");
            // 登陆页面进入
            let userName = "loginok";
            let password = "loginok";
            this.props.login({ userName, password });
        }
    }

    render() {
        const { LoginTouchNum, msgtype, loginBtn, emptyLogMsg, imagesArray, loginPwd, validation, loginUsername, validationActive, validationSuccess } = this.state;

        //登陆成功
        window.FastLoginBack = key => {
            Toasts.hide();
            this.setState({ validationActive: "" });
            setTimeout(() => {
                this.setState({ validationActive: "active" });
            }, 500);
        };

        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: "#fff",
                    paddingHorizontal: 20,
                }}>
                <View style={styles.validation}>
                    {/* 输入用户名和密码 */}
                    {(validationActive == "" || validationActive == "active") && (
                        <View style={styles.inputBoxView}>
                            {/*------------- 请输入您的密码确认启用 -------------*/}
                            <Text style={styles.titleTxt}>{translate("请输入您的密码确认启用")}</Text>

                            <View
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    display: "flex",
                                }}>
                                {
                                    DeviceInfoIos
                                        ?
                                        <FaceIcon fill={Color.darkGray} width={44} height={44} />
                                        :
                                        <FingerprinIcon fill={Color.darkGray} width={44} height={44} />
                                }
                                <Text style={{ color: "#666", padding: 10 }}>{loginUsername}</Text>
                            </View>

                            {/* 密码 */}

                            <CustomTextInput
                                leftIconName={"password"}
                                errorMessage={emptyLogMsg}
                                type={"error"}
                                infoBarPosition={"top"}
                                showEyes={true}
                                underlineColorAndroid="transparent"
                                value={loginPwd}
                                placeholder={translate("密码")}
                                placeholderTextColor="#BCBEC3"
                                maxLength={20}
                                textContentType="password"
                                onChangeText={value => this.handleTextInput("loginPwd", value)}
                            />

                            {/* 提交按钮 */}

                            <FilledButton
                                text={translate("确认")}
                                enable={loginBtn}
                                onPress={() => {
                                    this.okBtn();
                                }}
                                wrapStyle={{
                                    width: "100%",
                                    marginTop: 40,
                                }} />
                        </View>
                    )}
                    {validationActive == "active" && (
                        <View>
                            {/* ios指纹脸部  */}
                            {Platform.OS == "ios" && ((DeviceInfoIos && window.LoginTouchNum < 2) || (!DeviceInfoIos && window.LoginTouchNum == 0)) && (
                                <FingerprintPopupIOS
                                    errCallback={err => {
                                        ErrorMsg(err, LoginTouchNum => {
                                            this.setState({
                                                LoginTouchNum,
                                            });
                                        });
                                        //脸部识别需要2次打开,错误是回调，所以小于2
                                    }}
                                    successCallback={() => {
                                        this.successActive();
                                    }}
                                />
                            )}
                            {/* android指纹 */}
                            {Platform.OS == "android" && (
                                <FingerprintPopupAndroid
                                    errCallback={err => {
                                        // this.errorMessage(err);
                                    }}
                                    successCallback={() => {
                                        this.successActive();
                                    }}
                                />
                            )}
                        </View>
                    )}
                </View>

                {/* 设定成功 */}
                {validationActive == "success" && (
                    <View style={styles.inputBoxView}>
                        {/*  ----------- 设定成功，下次登入即可使用脸部辨识认证 / 设定成功，下次登入即可使用指纹辨识认证 -----------*/}
                        <Text style={styles.titleTxt}>{DeviceInfoIos ? translate("设定成功，下次登入即可使用脸部辨识认证") : translate("设定成功，下次登入即可使用指纹辨识认证")}</Text>

                        <View
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                                display: "flex",
                            }}>
                            {
                                DeviceInfoIos
                                    ?
                                    <FaceIcon fill={Color.darkGray} width={44} height={44} />
                                    :
                                    <FingerprinIcon fill={Color.darkGray} width={44} height={44} />
                            }
                            <Text
                                style={{
                                    color: "#666",
                                    marginTop: 5,
                                    marginBottom: 40,
                                }}>
                                {loginUsername}
                            </Text>
                            <SuccessIcon
                                width={18}
                                height={18}
                                wrapStyle={{
                                    position: "absolute",
                                    top: 30,
                                    right: 20,
                                    backgroundColor: "#fff",
                                    borderRadius: 40,
                                }}></SuccessIcon>
                        </View>

                        {/* 提交按钮 : 完成设定 */}
                        <Touch
                            style={{
                                width: width - 40,
                                backgroundColor: "#00A6FF",
                                borderRadius: 8,
                            }}
                            onPress={() => {
                                this.successBtn();
                            }}>
                            <Text
                                style={{
                                    color: "#fff",
                                    lineHeight: 45,
                                    textAlign: "center",
                                }}>
                                {translate("完成设定")}
                            </Text>
                        </Touch>
                    </View>
                )}
            </View>
        );
    }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
    login: loginDetails => {
        login(dispatch, loginDetails);
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginTouch);

export class FingerprintPopupIOS extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        try {
            FingerprintScanner.authenticate({
                // "温馨提示,使用臉部快速登入" : "温馨提示,使用指紋辨識",
                description: DeviceInfoIos ? translate("温馨提示,使用脸部辨识") : translate("温馨提示,使用指纹辨识"),
                fallbackEnabled: false,
            })
                .then(() => {
                    this.props.successCallback();
                })
                .catch(error => {
                    this.props.errCallback(error.name);
                });
        } catch (error) {
            console.log("FingerprintScanner.authenticate iOS error:", error);
            this.props.errCallback("FingerprintScannerNotSupported");
        }
    }

    render() {
        return false;
    }
}

export class FingerprintPopupAndroid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: true,
            // 使用指纹辨识
            errorMessage: translate("使用指纹辨识3"),
            onLock: false, //锁定
            touchNull: false,
        };
    }

    componentDidMount() {
        if (window.LoginTouchNum > 3 && window.lockLogin < 5) {
            this.onLockMsg(translate("指纹辨识失败3次，请使用一般登入或是 联系客服。")); // 指纹辨识失败3次，请使用一般登入或是 联系客服。
            this.props.errCallback(4);
            return;
        }
        try {
            FingerprintScanner.authenticate({
                onAttempt: this.handleAuthenticationAttempted,
                title: translate("提醒你"),
                description: translate("使用指纹辨识3"),
                cancelButton: translate("确认3"),
            })
                .then(() => {
                    this.props.successCallback();
                })
                .catch(error => {
                    // this.props.errCallback(error.name);
                    this.errorMessage(error.name);
                });
        } catch (error) {
            console.log("FingerprintScanner.authenticate Android error:", error);
            this.errorMessage("FingerprintScannerNotSupported");
        }
    }

    componentWillUnmount() {
        try {
            FingerprintScanner.release();
        } catch (error) {
            console.log("FingerprintScanner.release Android error:", error);
        }
    }

    //验证失败
    handleAuthenticationAttempted = error => {
        this.errorMessage(error.name);
    };
    //指纹验证错误提示
    errorMessage(err) {
        let title = translate("温馨提醒"); // 温馨提醒
        let message = "";
        let touchNull = false;
        let onLock = false;
        let active = false;

        window.LoginTouchNum += 1;

        switch (err) {
            case "AuthenticationNotMatch":
                //不匹配
                message = translate("辨别失败，请重新输入。");
                window.LockLoginFun && window.LockLoginFun(1);
                window.lockLogin < 5 && this.setState({ active: true });
                break;
            case "AuthenticationFailed":
                //指纹不匹配
                message = translate("辨别失败，请重新输入。");
                active = true;
                break;
            case "UserCancel":
                //点击取消
                message = translate("您已取消验证"); // 您已取消验证
                active = true;
                break;
            case "UserFallback":
                //点击输入密码
                message = translate("您已取消验证"); // 您已取消验证
                active = true;
                break;
            case "SystemCancel":
                //进入后台
                message = translate("系统已取消验证"); // 系统已取消验证
                active = true;
                break;
            case "PasscodeNotSet":
                //手机没有设置密码
                message = translate("您还未设置密码"); // 您还未设置密码
                active = true;
                break;
            case "FingerprintScannerNotAvailable":
                //无法使用指纹功能
                message = "指纹登入无法启动，此手机没有指纹识别功能";
                active = true;
                break;
            case "FingerprintScannerNotEnrolled":
                //手机没有预先设置指纹
                window.LoginTouchNum -= 1;
                touchNull = true;
                message = DeviceInfoIos ? translate("未检测到您有录入脸部辨识信息。 请至系统设定修改。") : translate("没有设定指纹！至少设定一个。"); // "未检测到您有录入脸部辨识信息。 请至系统设定修改。" : "没有设定指纹！至少设定一个。";
                break;
            case "FingerprintScannerUnknownError":
                //验证错误次数过多，请使用密码登录
                message = translate("指纹辨识失败3次，请使用一般登入或是 联系客服。"); // 指纹辨识失败3次，请使用一般登入或是 联系客服。
                this.onLockMsg(message);
                break;
            case "FingerprintScannerNotSupported":
                //设备不支持
                message = translate("此手机不支持该功能"); // 此手机不支持该功能
                active = true;
                break;
            case "DeviceLocked":
                //认证不成功，锁定30秒
                message = translate("指纹辨识失败3次，请使用一般登入或是 联系客服。"); // 指纹辨识失败3次，请使用一般登入或是 联系客服。
                this.onLockMsg(message);
                onLock = true;
                break;

            default:
                message = "Unusable due to error"; // 错误原因导致无法使用
                active = true;
                break;
        }

        if (window.lockLogin >= 5) {
            this.props.errCallback(4);
            this.setState({ active: false });
            // '密码错误', '你已超过尝试的限制，请联系管理员' , '确定'
            Alert.alert(translate("密码错误"), translate("你已超过尝试的限制，请联系管理员"), [
                {
                    text: translate("确认3"),
                    onPress: () => {
                        LiveChatOpenGlobe();
                    },
                },
            ]);
            return;
        }

        StorageUtil.save({
            key: `lockTouch${userNameDB.toLowerCase()}`,
            data: window.LoginTouchNum,
        });
        if (window.LoginTouchNum > 2) {
            //错误是回调，第三次错误提示
            this.setState({ active: false });
            onLock = true;
            this.onLockMsg(translate("指纹辨识失败3次，请使用一般登入或是 联系客服。")); // 指纹辨识失败3次，请使用一般登入或是 联系客服。
            this.props.errCallback(window.LoginTouchNum);
            return;
        }
        this.props.errCallback(window.LoginTouchNum);
        if (touchNull) {
            //没有 设置过指纹, 兩按鈕 左：取消, 右：前往設定
            Alert.alert(title, message, [
                {
                    text: translate("取消"),
                    onPress: () => {
                        Actions.pop();
                    },
                },
                {
                    text: translate("前往设定"),
                    onPress: () => {
                        Actions.pop();
                        //没有开始该功能，跳转手机设置
                        if (Platform.OS == "ios") {
                            Linking.openSettings.catch(err => {
                                Toasts.fail(translate("请手动打开手机设置")); // 请手动打开手机设置
                            });
                        } else {
                            if (!Openinstall.openNetworkSettings) {
                                Toasts.fail(translate("请手动打开手机设置")); // 请手动打开手机设置
                                return;
                            }
                            Openinstall.openNetworkSettings(data => {
                                !data && Toasts.fail(translate("请手动打开手机设置")); // 请手动打开手机设置
                            });
                        }
                    },
                },
            ]);
            this.setState({ active: false });
            return;
        }
        this.setState({ errorMessage: "" });
        setTimeout(() => {
            this.setState({ errorMessage: message });
        }, 500);
    }

    onLockMsg(msg) {
        this.setState({ active: false }, () => {
            // 指纹辨识功能已关闭
            Alert.alert(translate("指纹辨识功能已关闭"), msg, [{ text: translate("确认3"), onPress: () => {} }]);
        });
    }

    render() {
        const { errorMessage } = this.state;

        return (
            <View>
                <Modal animationType="none" transparent={true} visible={this.state.active} onRequestClose={() => {}}>
                    <View style={styles.modals}>
                        <View style={styles.modalView}>
                            {/*------------- 温馨提醒 -------------*/}
                            <Text style={styles.modalTitle}>{translate("温馨提醒")}</Text>
                            <Text style={{ color: "#000" }}>{errorMessage}</Text>
                            <View style={styles.modalImg}>
                                <FingerprinIcon fill={Color.darkGray} width={50} height={50} />
                            </View>
                            {/*------------- 取消 -------------*/}
                            <Text
                                style={{
                                    color: "#2ECC9D",
                                    textAlign: "right",
                                    fontSize: 17,
                                }}
                                onPress={() => {
                                    this.setState({ active: false });
                                }}>
                                {translate("取消")}
                            </Text>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

export const ErrorMsg = (err, callBack, FastLogin) => {
    // 指纹验证错误提示
    let message = "";
    let title = translate("温馨提醒"); // 温馨提醒
    let set = false; //android前往设置提示语
    let close = false;

    console.log("IOS ErrorMsg err -----> ", err);

    // window.LoginTouchNum += 1
    switch (err) {
        case "AuthenticationNotMatch":
            //不匹配
            title = (DeviceInfoIos ? translate("脸部解锁") : translate("指纹辨识")) + translate("功能已关闭"); // '脸部解锁' : '指纹辨识') + '功能已关闭'
            message = DeviceInfoIos ? "translate('脸部辨识失败4次，请使用一般登入或是联系客服。')" : translate("指纹辨识失败3次，请使用一般登入或是 联系客服。"); // "脸部辨识失败4次，请使用一般登入或是联系客服。" : "指纹辨识失败3次，请使用一般登入或是 联系客服。";
            break;
        case "AuthenticationFailed":
            //指纹不匹配
            title = (DeviceInfoIos ? translate("脸部解锁") : translate("指纹辨识")) + translate("功能已关闭"); // '脸部解锁' : '指纹辨识') + '功能已关闭'
            message = DeviceInfoIos ? "translate('脸部辨识失败4次，请使用一般登入或是联系客服。')" : translate("指纹辨识失败3次，请使用一般登入或是 联系客服。"); // "脸部辨识失败4次，请使用一般登入或是联系客服。" : "指纹辨识失败3次，请使用一般登入或是 联系客服。";
            break;
        case "UserCancel":
            //点击取消
            DeviceInfoIos ? "" : (window.LoginTouchNum = 0);
            message = translate("您已取消验证"); // 您已取消验证
            close = true;
            break;
        case "UserFallback":
            //点击输入密码
            message = translate("您已取消验证"); // 您已取消验证
            close = true;
            break;
        case "SystemCancel":
            //进入后台
            message = translate("系统已取消验证"); // 系统已取消验证
            break;
        case "PasscodeNotSet":
            //手机没有设置密码
            message = translate("您还未设置密码"); // 您还未设置密码
            break;
        case "FingerprintScannerNotAvailable":
            message = DeviceInfoIos ? translate("未检测到您有录入脸部辨识信息。 请至系统设定修改。") : translate("指纹登入无法启动，您手机内还未设置指纹"); // "未检测到您有录入脸部辨识信息。 请至系统设定修改。" : "指纹登入无法启动，您手机内还未设置指纹";
            title = translate("系统错误"); // 系统错误
            set = true;
            break;
        case "FingerprintScannerNotEnrolled":
            //手机没有预先设置指纹
            message = DeviceInfoIos ? translate("未检测到您有录入脸部辨识信息。 请至系统设定修改。") : translate("指纹登入无法启动，您手机内还未设置指纹"); // "未检测到您有录入脸部辨识信息。 请至系统设定修改。" : "指纹登入无法启动，您手机内还未设置指纹";
            title = translate("系统错误"); // 系统错误
            set = true;
            break;
        case "FingerprintScannerUnknownError":
            //验证错误次数过多，请使用密码登录
            message = DeviceInfoIos ? "translate('脸部辨识失败4次，请使用一般登入或是联系客服。')" : translate("指纹辨识失败3次，请使用一般登入或是 联系客服。"); // "脸部辨识失败4次，请使用一般登入或是联系客服。" : "指纹辨识失败3次，请使用一般登入或是 联系客服。";
            window.LoginTouchNum = 4;
            break;
        case "FingerprintScannerNotSupported":
            //手机没有预先设置指纹
            message = DeviceInfoIos ? translate("未检测到您有录入脸部辨识信息。 请至系统设定修改。") : translate("指纹登入无法启动，您手机内还未设置指纹"); // "未检测到您有录入脸部辨识信息。 请至系统设定修改。" : "指纹登入无法启动，您手机内还未设置指纹";
            window.LoginTouchNum = 0;
            title = translate("系统错误"); // 系统错误
            set = true;
            break;
        case "DeviceLocked":
            //认证不成功，锁定30秒
            message = DeviceInfoIos ? "translate('脸部辨识失败4次，请使用一般登入或是联系客服。')" : translate("指纹辨识失败3次，请使用一般登入或是 联系客服。"); // "脸部辨识失败4次，请使用一般登入或是联系客服。" : "指纹辨识失败3次，请使用一般登入或是 联系客服。";
            window.LoginTouchNum = 4;
            break;
        default:
            message = "Unusable due to error"; // 错误原因导致无法使用
            break;
    }

    callBack(DeviceInfoIos && window.lockLogin >= 4 && FastLogin ? 3 : window.LoginTouchNum);

    if ((!DeviceInfoIos && window.lockLogin >= 2 && FastLogin) || (DeviceInfoIos && window.lockLogin >= 4 && FastLogin)) {
        // '密码错误', '你已超过尝试的限制，请联系管理员' , '确定'
        Alert.alert(translate("密码错误"), translate("你已超过尝试的限制，请联系管理员"), [
            {
                text: translate("确认3"),
                onPress: () => {
                    LiveChatOpenGlobe();
                },
            },
        ]);
        return;
    }
    StorageUtil.save({
        key: `lockTouch${userNameDB.toLowerCase()}`,
        data: window.LoginTouchNum,
    });

    if ((DeviceInfoIos && window.LoginTouchNum > 1) || (!DeviceInfoIos && window.LoginTouchNum > 0)) {
        //脸部解锁需要2次,错误是回调，第二次错误提示
        title = (DeviceInfoIos ? translate("脸部解锁") : translate("指纹辨识")) + translate("功能已关闭"); // '脸部解锁' : '指纹辨识') + '功能已关闭'
        message = DeviceInfoIos ? "translate('脸部辨识失败4次，请使用一般登入或是联系客服。')" : translate("指纹辨识失败3次，请使用一般登入或是 联系客服。"); // "脸部辨识失败4次，请使用一般登入或是联系客服。" : "指纹辨识失败3次，请使用一般登入或是 联系客服。";
        Alert.alert(title, message, [{ text: translate("确认3"), onPress: () => {} }]);
        return;
    }
    !close &&
        Alert.alert(title, message, [
            {
                text: translate("确认3"),
                onPress: () => {
                    set && Linking.openSettings(err => {});
                },
            },
        ]);
    Actions.pop();
};
