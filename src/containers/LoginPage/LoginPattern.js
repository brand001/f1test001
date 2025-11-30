import React from "react";
import { Alert, Dimensions, Image, Text, View } from "react-native";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";

import { Toasts } from "$Toasts";
import { FaceIcon, FingerprinIcon, PatterIcon, SuccessIcon } from "$Components/icons/index";
import { passwordReg } from "../../actions/Reg";
import { login } from "../../lib/redux/actions/AuthAction";
import PasswordGesture from "./gesturePassword/index";
import styles from "./style";
const { width, height } = Dimensions.get("window");

import { translate } from "@/locales/translate";
import Color from "$Components/Color";
import CustomTextInput from "$Components/CustomTextInput";
import FilledButton from "$Components/FilledButton";
import { LogoutUtil } from "$Utils";
import StorageUtil from "$Utils/Storage";

// 设置图形解锁
class LoginPattern extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            passErr: 0, //密码错误5次需要重新登陆
            loginBtn: false,
            emptyLogMsg: "",
            imagesArray: [],
            loginPwd: "",
            message: this.props.forgotPass ? translate("请输入旧密码以便重新设定图形密码锁") : translate("此图形密码锁，用于快速登录应用程序\n请连续画出四至九个点"),
            step: 1,
            forgotPass: this.props.forgotPass,
            status: "normal",
            timeOut: 300,
            beforPassword: "", //首次图形密码
            secondPassword: "", //第二次图形密码
            validationActive: this.props.forgotPass ? "active" : "", //设置图案状态
            loginUsername: this.props.userName || "",
        };
    }
    componentDidMount() {
        // if (LoginPatternNum >= 3) {
        // 	Alert.alert('Tính năng mở khóa bằng hình vẽ đã bị tắt', 'Đăng nhập mật khẩu hình vẽ không thành công 3 lần, vui lòng đăng nhập bằng Mật Khẩu thông thường hoặc liên hệ với Hỗ Trợ Trực Tuyến', [{ text: 'Xác Nhận', onPress: () => { } }]);
        // 	return
        // }
    }

    componentWillUnmount() {}

    handleTextInput(key, value) {
        let emptyLogMsg = "";
        let loginBtn = true;
        if (!passwordReg.test(value)) {
            emptyLogMsg = translate("请输入正确的密码。"); // 请输入正确的密码。
            loginBtn = false;
        }
        this.setState({ emptyLogMsg, loginBtn });

        this.setState({
            [key]: value,
        });
    }
    // 提交按钮,验证密码,
    okBtn() {
        if (this.state.emptyLogMsg || this.state.loginPwd == "") {
            return;
        }
        if (this.props.fastChange) {
            //我的 -》本地密码对比，没问题保存修改
            let fastLoginKey = "fastLoginPass" + this.state.loginUsername.toLowerCase();
            StorageUtil.load(fastLoginKey)
                .then(ret => {
                    if (!ret) {
                        // 没有数据，执行之前的 catch 逻辑
                        Toasts.error(translate("网络错误，请重新登陆"));
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
                                text: translate("确定2"),
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
                        window.LoginPatternNum = 0;
                        this.setState({ validationActive: "active" });
                    }
                });
        } else {
            //登陆页面-》设置成功后去登陆，
            window.FastLoginErr += 1;
            window.fastLogin && window.fastLogin(this.state.loginUsername, this.state.loginPwd, "LoginPattern");
        }
    }

    // 返回按钮
    goBack() {
        Actions.pop();
    }

    onStart() {
        // if (LoginPatternNum >= 3) {
        // 	Alert.alert('Tính năng mở khóa bằng hình vẽ đã bị tắt', 'Đăng nhập mật khẩu hình vẽ không thành công 3 lần, vui lòng đăng nhập bằng Mật Khẩu thông thường hoặc liên hệ với Hỗ Trợ Trực Tuyến', [{ text: 'Xác Nhận', onPress: () => { } }]);
        // 	return
        // }
        this.setState({ status: "normal" });
        if (this.state.timeOut) {
            clearTimeout(this.time);
        }
    }

    onEnd(password) {
        const { timeOut, beforPassword, step } = this.state;
        const loginUsername = this.state.loginUsername.toLowerCase();
        if (window.LoginPatternNum >= 3) {
            return;
        }
        // console.log("passwordpasswordpassword", password);
        if (step == 1) {
            if (this.props.fastChange && this.state.forgotPass) {
                //修图形密码
                this.getPattern(password);
                return;
            }
            // 第一次输入图案
            if (password.length < 4) {
                this.setState({
                    status: "wrong",
                    message: translate("此图形密码锁，用于快速登录应用程序\n请连续画出四至九个点"),
                });
                // Toasts.fail("请连续画出四至九个点", 2);
                return;
            } else {
                window.LoginPatternNum = 0;
                this.setState({
                    beforPassword: password,
                    status: "right",
                    message: translate("请再确认一次图形密码锁"),
                    step: 2,
                });
            }
        } else {
            // step==2
            // 第二次输入图案
            if (password === beforPassword) {
                window.LoginPatternNum = 0;
                this.setState({
                    status: "right",
                    secondPassword: password,
                });
                setTimeout(() => {
                    //成功设置九宫格密码
                    this.setState({ validationActive: "success" });
                    //登陆成功,保存图形密码
                    let storageKey = "patternKey" + loginUsername;
                    StorageUtil.save({
                        key: storageKey,
                        data: this.state.beforPassword,
                    });
                    //保存快捷登陆方式
                    let fastLoginKey = "fastLogin" + loginUsername;
                    StorageUtil.save({
                        key: fastLoginKey,
                        data: "LoginPattern",
                    });
                }, 1000);
            } else {
                this.setState({
                    status: "wrong",
                    message: translate("两次密码不同，请重新输入"),
                });
            }
        }
        StorageUtil.save({
            key: `lockPattern${loginUsername}`,
            data: window.LoginPatternNum,
        });
    }

    getPattern(pass) {
        //修改九宫格密码研制旧图形
        const userName = this.state.loginUsername.toLowerCase();
        let storageKey = "patternKey" + userName;
        StorageUtil.load(storageKey)
            .then(ret => {
                if (!ret) {
                    // 没有数据，执行之前的 catch 逻辑
                    this.setState({
                        status: "wrong",
                        message: translate("图形密码输入错误，请重新输入2"),
                    });
                    return;
                }
                if (pass == ret) {
                    window.LoginPatternNum = 0;
                    this.setState({
                        validationActive: "active",
                        forgotPass: false,
                    });
                    this.setState({
                        status: "right",
                        message: translate("请输入新的图形密码锁，此图形密码锁，\n用于快速登录应用程序，请连续画出四至九个点。"),
                    });
                } else {
                    window.LoginPatternNum += 1;
                    this.setState({
                        status: "wrong",
                        message: translate("图形密码输入错误，请重新输入2"),
                    });
                }
                StorageUtil.save({
                    key: `lockPattern${userName}`,
                    data: window.LoginPatternNum,
                });
            });
    }

    successBtn() {
        //验证成功跳转
        if (this.props.fastChange) {
            //我的页面  进入
            this.props.changeBack();
            Actions.pop();
            Actions.jump("Home");
        } else {
            // 登陆页面进入
            let userName = "loginok";
            let password = "loginok";
            this.props.login({ userName, password });
        }
    }

    //重新输入
    errorBack() {
        this.setState({
            status: "normal",
            step: 1,
            beforPassword: "",
            message: translate("此图形密码锁，用于快速登录应用程序，\n请连续画出四至九个点"),
        });
    }

    render() {
        //登陆成功
        window.FastLoginBack = key => {
            Toasts.removeAll();
            window.LoginPatternNum = 0;
            this.setState({ validationActive: "active" });
        };
        let { forgotPass, loginBtn, emptyLogMsg, validationActive, loginUsername, loginPwd, beforPassword, step, status, message } = this.state;
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: "#fff",
                    paddingHorizontal: 20,
                }}>
                {
                    //设置前验证密码
                    validationActive == "" && (
                        <View style={styles.inputBoxView}>
                            <Text style={styles.titleTxt}>{translate("请输入您的密码确认启用")}</Text>

                            <View
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    display: "flex",
                                }}>
                                <PatterIcon fill={Color.darkGray} width={44} height={44} />
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
                                onChangeText={value => this.handleTextInput("loginPwd", value)}></CustomTextInput>

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
                    )
                }
                {
                    //设置图形密码
                    validationActive == "active" && (
                        <View style={{ flex: 1, alignItems: "center" }}>
                            <View style={{ height: 100 }}>
                                <Text style={[styles.msgText]}>{this.state.message}</Text>
                            </View>
                            <PasswordGesture
                                ref="pg"
                                status={this.state.status}
                                message={this.state.message}
                                onStart={() => this.onStart()}
                                onEnd={password => this.onEnd(password)}
                                innerCircle={true}
                                outerCircle={true}
                                allowCross={true}
                                interval={this.state.timeOut}
                                normalColor={"#666"}
                                rightColor={"#666"}
                                wrongColor={"#EB2121"}
                                textStyle={{
                                    textAlign: "center",
                                    lineHeight: 22,
                                    color: "#000",
                                }}
                                style={{ backgroundColor: "#fff" }}
                            />

                            {beforPassword != "" && (
                                <FilledButton
                                    text={translate("重新输入图形密码")}
                                    outlined={true}
                                    onPress={() => {
                                        Alert.alert(translate("图形密码清除设定提醒"), translate("点击确认后，图形密码将清除并重新设定。"), [
                                            {
                                                text: translate("取消"),
                                                onPress: () => {},
                                                style: "cancel",
                                            },
                                            {
                                                text: translate("确认2"),
                                                onPress: () => {
                                                    this.errorBack();
                                                },
                                            },
                                        ]);
                                    }}
                                    wrapStyle={{
                                        width: "100%",
                                        marginTop: 40,
                                        position: "absolute",
                                        top: height / 1.4,
                                    }} />
                            )}

                            {this.props.fastChange && forgotPass && (
                                <FilledButton
                                    text={translate("忘记图形密码")}
                                    outlined={true}
                                    onPress={() => {
                                        this.setState({
                                            validationActive: "",
                                            LoginPatternNum: 0,
                                            forgotPass: false,
                                            message: translate("此图形密码锁，用于快速登录应用程序，\n请连续画出四至九个点"),
                                        });
                                    }}
                                    wrapStyle={{
                                        width: "100%",
                                        marginTop: 40,
                                        position: "absolute",
                                        top: height / 1.4,
                                    }} />
                            )}
                        </View>
                    )
                }

                {
                    //设置成功
                    validationActive == "success" && (
                        <View style={styles.inputBoxView}>
                            <Text style={styles.titleTxt}>{translate("图形密码设定完成，下次登录即可使用图形密码")}</Text>

                            <View
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    display: "flex",
                                }}>
                                <PatterIcon fill={Color.darkGray} width={44} height={44} />
                                <Text style={{ color: "#666", padding: 10 }}>{loginUsername}</Text>
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

                            <FilledButton
                                text={translate("完成设定")}
                                onPress={() => {
                                    this.successBtn();
                                }}
                                wrapStyle={{
                                    width: "100%",
                                    marginTop: 40,
                                }} />
                        </View>
                    )
                }
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginPattern);
