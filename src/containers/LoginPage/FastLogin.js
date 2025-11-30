import React from "react";
import { Alert, Dimensions, Image, ImageBackground, Platform, Text, View } from "react-native";
import { Actions } from "react-native-router-flux";
import Touch from "react-native-touch-once";
import { connect } from "react-redux";

import { translate } from "@/locales/translate";
import Color from "$Components/Color";
import FilledButton from "$Components/FilledButton";
import LiveChat from "$Components/LiveChat";

import { login } from "../../lib/redux/actions/AuthAction";
import PasswordGesture from "./gesturePassword/index";
import { ErrorMsg, FingerprintPopupAndroid, FingerprintPopupIOS } from "./LoginTouch";
import styles from "./style";
import NavBack from "$Components/Nav/NavBack";
const { width, height } = Dimensions.get("window");
import { FaceIcon, FingerprinIcon, PatterIcon } from "$Components/icons/index";
import { ColumnCenterCenter } from "$Components/CustomView";
import StorageUtil from "$Utils/Storage";

// 设置图形解锁
class FastLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            LoginTouchNum: window.LoginTouchNum,
            faceId: true,
            winHeight: height,
            scrollEnabled: true,
            FastLogin: "",
            step: 1,
            status: "normal",
            timeOut: 300,
            message: translate("请输入您的图形密码"),
            userName: this.props.userName,
            loginPwd: "",
            patternPass: "2369",
        };
    }
    componentWillMount() {
        if (window.LoginPatternNum >= 3 && this.props.FastLogin == "LoginPattern") {
            Alert.alert(translate("图形解锁功能已关闭"), translate("图形辨识失败3次，请使用一般登入或是 联系客服。"), [{ text: translate("确认3"), onPress: () => {} }]);
            return;
        }

        if (window.LoginTouchNum > 2 || (((DeviceInfoIos && window.LoginTouchNum > 1) || (!DeviceInfoIos && window.LoginTouchNum > 0)) && Platform.OS == "ios")) {
            //ios一次等于3次
            let title = (DeviceInfoIos ? translate("脸部解锁") : translate("指纹辨识")) + translate("功能已关闭");
            let message = DeviceInfoIos ? translate("脸部辨识失败4次，请使用一般登入或是联系客服。") : translate("指纹辨识失败3次，请使用一般登入或是 联系客服。");
            Alert.alert(title, message, [{ text: translate("确认3"), onPress: () => {} }]);
            return;
        }

        this.getPattern();
        this.getUserName();
    }

    getPattern() {
        const userName = this.state?.userName?.toLowerCase();
        let storageKey = "patternKey" + userName;
        StorageUtil.load(storageKey)
            .then(ret => {
                this.setState({ patternPass: ret });
            });
    }

    getUserName() {
        //获取记住用户密码
        let fastLoginKey = "fastLoginPass" + this.state?.userName?.toLowerCase();
        StorageUtil.load(fastLoginKey)
            .then(ret => {
                if (ret) {
                    this.setState({ loginPwd: ret });
                } else {
                    //拿不到密码清除快速登录
                    const userName = this.state?.userName?.toLowerCase();
                    let fastLogin = "fastLogin" + userName;
                    StorageUtil.remove(fastLogin);
                }
            });
    }

    //验证成功情况登陆
    successActive(loginType) {
        window.LoginTouchNum = 0;
        window.fastLogin && window.fastLogin(this.state.userName, this.state.loginPwd, loginType, "FastLogin"); // 辨别登录类型以及统计PIW
    }

    onStart() {
        if (window.LoginPatternNum >= 3) {
            Alert.alert(translate("图形解锁功能已关闭"), translate("图形辨识失败3次，请使用一般登入或是 联系客服。"), [{ text: translate("确认3"), onPress: () => {} }]);
            return;
        }
        this.setState({
            status: "normal",
            message: translate("请输入您的图形密码"),
            scrollEnabled: false,
        });
        if (this.state.timeOut) {
            clearTimeout(this.time);
        }
    }

    onEnd(password) {
        const { patternPass } = this.state;
        this.setState({ scrollEnabled: true });

        if (password == patternPass) {
            //密码正确
            window.LoginPatternNum = 0;
            this.setState({
                status: "right",
                message: translate("图形密码输入正确"), //图形密码输入正确,
            });
            setTimeout(() => {
                this.successActive("LoginPattern");
            }, 1000);
        } else {
            this.setState({
                status: "wrong",
                message: translate("图形密码输入错误，请重新输入"), //图形密码输入错误，请重新输入,
            });
            window.LockLoginFun && window.LockLoginFun(1);
            window.LoginPatternNum += 1;
        }
        StorageUtil.save({
            key: `lockPattern${this.state.userName}`,
            data: window.LoginPatternNum,
        });
    }

    render() {
        const { faceId, LoginTouchNum, message } = this.state;
        return (
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
                <BGTOP LoginBanner={this.props.LoginBanner} />
                {
                    this.props.FastLogin == "LoginTouch" &&
                    <View>

                        <ColumnCenterCenter style={styles.loginView}>
                            <Text style={styles.loginTypeText}>
                                {DeviceInfoIos ? translate("脸部辨识快速登录2") : translate("使用指纹辨识")}
                            </Text>

                            {
                                DeviceInfoIos
                                    ?
                                    <FaceIcon fill={Color.darkGray} width={44} height={44} />
                                    :
                                    <FingerprinIcon fill={Color.darkGray} width={44} height={44} />
                            }

                            <FilledButton
                                text={translate("一般登入")}
                                onPress={() => {
                                    Actions.pop();
                                }}
                                wrapStyle={{
                                    width: width - 40,
                                    marginTop: 40,
                                }} />
                        </ColumnCenterCenter>
                    </View>
                }

                {
                    this.props.FastLogin == "LoginPattern" &&
                    <View>
                        <ColumnCenterCenter style={styles.loginView}>
                            <Text style={styles.loginTypeText}>{message}</Text>
                            <PasswordGesture
                                status={this.state.status}
                                // message={this.state.message}
                                onStart={() => this.onStart()}
                                onEnd={password => this.onEnd(password)}
                                innerCircle={true}
                                outerCircle={true}
                                allowCross={true}
                                interval={this.state.timeOut}
                                normalColor={"#666"}
                                rightColor={"#0CCC3C"}
                                rightLineColor={"#0CCC3C"}
                                wrongColor={"#F92D2D"}
                                // transparentLine={true}
                                textStyle={{
                                    textAlign: "center",
                                    lineHeight: 22,
                                    color: "#fff",
                                }}
                                style={styles.PasswordGestureStyle}></PasswordGesture>

                            <FilledButton
                                text={translate("一般登入")}
                                onPress={() => {
                                    Actions.pop();
                                }}
                                wrapStyle={{
                                    marginTop: 20,
                                }} />
                        </ColumnCenterCenter>
                    </View>
                }

                {
                    // 指纹脸部
                    this.props.FastLogin == "LoginTouch" &&
                    <View>
                        {/* ios指纹脸部  */}
                        {Platform.OS == "ios" && faceId && ((DeviceInfoIos && LoginTouchNum < 2) || (!DeviceInfoIos && LoginTouchNum == 0)) && (
                            <FingerprintPopupIOS
                                errCallback={err => {
                                    ErrorMsg(
                                        err,
                                        LoginTouchNum => {
                                            if (LoginTouchNum == 0) {
                                                return;
                                            }

                                            window.LockLoginFun && window.LockLoginFun(DeviceInfoIos ? 2 : 3);

                                            this.setState({
                                                LoginTouchNum,
                                            });
                                        },
                                        "FastLogin",
                                    );
                                    //脸部识别需要2次打开,错误是回调，所以小于2
                                    if (DeviceInfoIos && err == "UserCancel") {
                                        this.setState({
                                            faceId: false,
                                        });
                                        setTimeout(() => {
                                            this.setState({
                                                faceId: true,
                                            });
                                        }, 500);
                                    }
                                }}
                                successCallback={() => {
                                    this.successActive("LoginTouch");
                                }}
                            />
                        )}
                        {/* android指纹 */}
                        {Platform.OS == "android" && LoginTouchNum < 3 && (
                            <FingerprintPopupAndroid
                                loginType={true} //登陆时候第一次 不显示弹窗提示
                                errCallback={LoginTouchNum => {
                                    // this.errorMessage(err);
                                    this.setState({ LoginTouchNum });
                                }}
                                successCallback={() => {
                                    this.successActive("LoginTouch");
                                }}
                                isFromFastLogin={true}
                            />
                        )}
                    </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(FastLogin);

export class BGTOP extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <ImageBackground source={this.props.LoginBanner} style={styles.bgView} resizeMode={"stretch"}>
                <View style={{ height: DeviceInfoIos ? 50 : 10 }}></View>
                <View style={styles.loginNav}>
                    <NavBack
                        wrapStyle={{}}
                        onPress={() => {
                            Actions.pop();
                        }} />
                    <LiveChat />
                </View>
            </ImageBackground>
        );
    }
}
