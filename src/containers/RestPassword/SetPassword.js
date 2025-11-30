import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Actions } from "react-native-router-flux";

import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import { GetGlobalModal } from "$Utils/globalModal";
import { translate } from "@/locales/translate";
import CustomTextInput from "$Components/CustomTextInput";
import FilledButton from "$Components/FilledButton";
import InfoBar from "$Components/InfoBar";
import StepProgressBar from "$Components/StepProgressBar";
import { Toasts } from "$Toasts";
import CountdownUtil from "$Utils/CountdownUtil";
import { LogoutUtil } from "$Utils";
import StorageUtil from "$Utils/Storage";
import Touch from "react-native-touch-once";
import Color from "$Components/Color";

import { newPasswordReg } from "../../actions/Reg";
import PasswordRequirements from "$Components/PasswordRequirements";
const Time = 600;

class SetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password2: "",
            password3: "",
            passwordST2: "",
            passwordST3: "",
            Countdown: "10:00",
            showPasswordRequirements: false,
        };
        this.countdown = null; // 倒计时实例
        this.passwordResetCompleted = false; // Use class property instead of state
    }

    componentDidMount() {
        if (!this.props.isMandatoryReset) {
            this.startCountdown(Time); // 10分钟倒计时
        }

        // Hide navigation title and left button for mandatory reset
        if (this.props.isMandatoryReset) {
            this.props?.navigation?.setParams({
                leftButton: () => null
            });
        }
    }

    componentWillUnmount() {
        this.countdown?.clear();
        // Only logout if user is navigating back (not when completing password reset)
        if (this.props.needResetPwd && !this.passwordResetCompleted) {
            LogoutUtil({ skipHomeNavigation: true });
        }
    }

    password2(value) {
        let passwordST2 = "";
        let passwordST3 = "";
        const hasPasswordError = value !== "" && !newPasswordReg.test(value);

        if (value == "") {
            passwordST2 = translate("请输入新密码");
        }

        // Re-validate password3 if it exists and doesn't match the new password2
        if (this.state.password3 && value !== this.state.password3) {
            passwordST3 = translate("密码不一致");
        }

        this.setState({
            passwordST2,
            passwordST3,
            password2: value,
            showPasswordRequirements: hasPasswordError,
        });
    }
    password3(value) {
        let passwordST3 = "";

        if (value == "") {
            passwordST3 = translate("请再次输入新密码1");
        } else if (value != this.state.password2 && this.state.password2) {
            passwordST3 = translate("密码不一致");
        }

        this.setState({
            passwordST3,
            password3: value,
        });
    }

    async changeBtn() {
        const MemberData = {
            newPassword: this.state.password2,
            blackboxValue: E2Backbox,
        };

        Toasts.loading(translate("加载中,请稍候..."), 20000000000000);

        let res = await fetchRequest(ApiPort.Password, "PUT", MemberData);
        Toasts.removeAll();
        if (res?.isSuccess) {
            //修改成功后退出
            this.passwordResetCompleted = true;
            Toasts.success(translate("密码更新成功，请使用新密码重新登录"), 2);
            PiwikEventDataHandle({
                eventTitle: "Revalidate",
                isSuccess: 2,
            });

            // Wait for the toast to be shown for 2 seconds before logging out
            setTimeout(() => {
                LogoutUtil({
                });
            }, 2000);
        } else {
            // CXFUN88-6312
            let errorCode = res?.errors?.[0]?.errorCode;
            let message = res?.errors?.[0]?.description || translate("密码更新失败，请稍后再重试");

            // Check for password popup error codes
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
            } else if (["MEM00059", "MEM00206"].includes(errorCode)) {
                // Use the description from API response for new error codes
                message = res?.errors?.[0]?.description;
                Toasts.fail(message);
            } else if (errorCode === "MEM00145") {
                // Show error for password2 field instead of toast and block process
                // message = res?.errors?.[0]?.description;
                message = translate("新密码不能与旧密码相同");
                this.setState({
                    passwordST2: message
                });
            }
            else {
                // Show network error for unknown error codes
                Toasts.fail(translate("密码更新失败，请稍后再重试"), 2);
            }
            // Determine Piwik event based on error code
            let eventTitle = "Revalidate";
            if (errorCode === "MEM00207") {
                eventTitle = "SetPasswordDummyPopup";
            } else if (errorCode === "MEM00208") {
                eventTitle = "SetPasswordSensitivePopup";
            }

            PiwikEventDataHandle({
                eventTitle: eventTitle,
                isSuccess: 1,
                customProperties: {
                    API_Error: errorCode + " - " + message
                },
            });
        }
    }

    startCountdown(time) {
        this.countdown?.clear();

        this.countdown = new CountdownUtil(
            time,
            formattedTime => {
                this.setState({ Countdown: formattedTime });
            },
            () => {
                this.countdown?.clear();
                GetGlobalModal({
                    title: translate("等待超时"),
                    message: translate("该次登录已经超时\n您该次登录已经超时，请再次登录以验证并更新密码。"),
                    confirmText: translate("重新登录"),
                    onConfirm: () => {
                        LogoutUtil({
                            callBack: () => {
                                Actions.Login({ from: "setPwd" });
                            }
                        });
                    },
                });
            },
        );

        this.countdown.start();
    }

    render() {
        const { passwordST2, passwordST3, password2, password3, Countdown, showPasswordRequirements } = this.state;
        let btnStatus = password2.length > 0 && password3.length > 0 && passwordST2.length <= 0 && passwordST3.length <= 0;
        const needResetNotMandatory = this.props.needResetPwd && !this.props.isMandatoryReset;
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: "#fff",
                    paddingHorizontal: 10,
                }}>
                <KeyboardAwareScrollView style={{ flex: 1, paddingTop: 35 }}>

                    {!this.props.needResetPwd && <StepProgressBar step={2} />}
                    <InfoBar
                        type={"warn"}
                        wrapStyle={{
                            marginBottom: 20,
                            marginTop: 0,
                            paddingVertical: 12,
                            paddingHorizontal: 16,

                        }}
                        text={this.props.needResetPwd ? translate("为了保障您的账户安全，我们已升级密码安全系统。请及时更新密码，提高账户安全等级。") : translate("{x} 分钟来更新新密码。\n请在时间结束前更改密码。", { x: Countdown })}
                    />

                    <CustomTextInput
                        errorMessage={passwordST2}
                        hasError={showPasswordRequirements}
                        type={"error"}
                        value={password2}
                        placeholder={translate("新密码")}
                        onChangeText={value => {
                            this.password2(value);
                        }}
                        maxLength={20}
                        showEyes={true}
                        wrapStyle={{ borderColor: showPasswordRequirements ? Color.alertRed : Color.lightSilver }}
                    />

                    <PasswordRequirements showRequirements={true} useDefaultColors={!showPasswordRequirements} />

                    <CustomTextInput
                        errorMessage={passwordST3}
                        type={"error"}
                        value={password3}
                        placeholder={translate("确认新密码")}
                        onChangeText={value => {
                            this.password3(value);
                        }}
                        maxLength={20}
                        showEyes={true}
                        containerStyle={{ marginTop: 20 }}
                        wrapStyle={{ borderColor: passwordST3 ? Color.alertRed : Color.lightSilver }}
                    />

                    <FilledButton
                        text={translate("更新")}
                        enable={btnStatus}
                        onPress={() => {
                            this.changeBtn();
                        }}
                        wrapStyle={{
                            marginTop: 20,
                            backgroundColor: btnStatus ? Color.theme : Color.lightSilver
                        }}
                        textStyle={{
                            color: btnStatus ? Color.white : Color.placeholderGray
                        }}
                    />

                    {needResetNotMandatory && <Touch
                        onPress={() => {
                            // Store needResetPwdCache in global storage for 24 hours
                            const expireTime = new Date().getTime() + (24 * 60 * 60 * 1000); // 24 hours from now
                            // Store needResetPwdCache in global storage for 5 seconds (for testing)
                            // const expireTime = new Date().getTime() + (5 * 1000);
                            StorageUtil.save({
                                key: "needResetPwdCache",
                                data: {
                                    timestamp: new Date().getTime(),
                                    expireTime: expireTime
                                },
                                expires: expireTime
                            });

                            // Set flag to prevent logout on unmount
                            this.passwordResetCompleted = true;

                            // Call the login success callback if provided
                            if (this.props.onLoginSuccess) {
                                this.props.onLoginSuccess();
                            } else {
                                // Navigate to home
                                Actions.Home();
                            }
                        }}
                        style={{ backgroundColor: "transparent", marginTop: 35 }}
                    >
                        <Text style={[styles.getCodeBtnText]}>{translate("稍后再说2")}</Text>
                    </Touch>}
                </KeyboardAwareScrollView>
            </View>
        );
    }
}

export default SetPassword;

const styles = StyleSheet.create({
    getCodeBtnText: {
        color: "#00A6FF",
        textAlign: "center",
        fontWeight: "bold",
    },
});