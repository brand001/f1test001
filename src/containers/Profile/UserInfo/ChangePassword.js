import React from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { connect } from "react-redux";

import { newPasswordReg } from "@/actions/Reg";
import { GetGlobalModal } from "$Utils/globalModal";
import Color from "$Components/Color";
import CustomTextInput from "$Components/CustomTextInput";
import FilledButton from "$Components/FilledButton";
import PasswordRequirements from "$Components/PasswordRequirements";
import { translate } from "$locales/translate";
import { Toasts } from "$Toasts";
import { LogoutUtil } from "$Utils";
import StorageUtil from "$Utils/Storage";
import { Actions } from "react-native-router-flux";
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";


import Styles from "./Styles.js";

class ChangePassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password1: "",
            password2: "",
            password3: "",
            passwordST1: "",
            passwordST2: "",
            passwordST3: "",
            changeBtn: false,
            showPasswordRequirements2: false,
        };
    }

    password1(value) {
        let passwordST1 = "";

        if (value == "") {
            passwordST1 = translate("请输入当前密码");
        } else if (value == this.state.password2) {
            passwordST1 = translate("新密码不能与旧密码相同");
        } else if (value == this.state.password3) {
            passwordST1 = translate("新密码不能与旧密码相同");
        } else if (this.state.password2 && this.state.password2 == this.state.password3) {
            this.setState({
                passwordST2: "",
                passwordST3: "",
            });
        }

        this.setState(
            {
                passwordST1,
                password1: value,
            },
            () => {
                this.validation();
            },
        );
    }
    password2(value) {
        let passwordST2 = "";
        const hasPasswordError = value !== "" && !newPasswordReg.test(value);

        if (value == "") {
            passwordST2 = translate("请输入新密码");
        } else if (value == this.state.password1) {
            passwordST2 = translate("新密码不能与旧密码相同");
        } else if (this.state.password3 != "" && value != this.state.password3) {
            passwordST2 = translate("密码不一致");
        } else if (value == this.state.password3) {
            this.setState({ passwordST3: "" });
        }
        if (this.state.passwordST1 == translate("新密码不能与旧密码相同")) {
            this.setState({ passwordST1: "" });
        }

        this.setState(
            {
                passwordST2,
                password2: value,
                showPasswordRequirements2: hasPasswordError,
            },
            () => {
                this.validation();
            },
        );
    }
    password3(value) {
        let passwordST3 = "";

        if (value == "") {
            passwordST3 = translate("请再次输入新密码");
        } else if (value == this.state.password1) {
            passwordST3 = translate("新密码不能与旧密码相同");
        } else if (this.state.password2 != "" && value != this.state.password2) {
            passwordST3 = translate("密码不一致");
        } else if (value == this.state.password2) {
            this.setState({ passwordST2: "" });
        }
        if (this.state.passwordST1 == translate("新密码不能与旧密码相同")) {
            this.setState({ passwordST1: "" });
        }
        this.setState(
            {
                passwordST3,
                password3: value,
            },
            () => {
                this.validation();
            },
        );
    }

    validation() {
        const st = this.state;
        let changeBtn = true;
        if (!st.password1 || !st.password2 || !st.password3 || st.password2 != st.password3 || st.password1 == st.password2 || st.passwordST1 || st.passwordST2 || st.showPasswordRequirements2) {
            changeBtn = false;
        }
        this.setState({ changeBtn });
    }

    changeBtn() {
        if (!this.state.changeBtn) {
            return;
        }
        let userName = this.props.userInfo?.userName;

        const MemberData = {
            oldPassword: this.state.password1,
            newPassword: this.state.password2,
            blackboxValue: E2Backbox,
        };
        Toasts.loading(translate("加载中,请稍候..."), 200);

        fetchRequest(ApiPort.ChangePassword, "PUT", MemberData)
            .then(res => {
                Toasts.removeAll();
                if (res?.isSuccess) {
                    // console.log("关闭快捷登录方式")
                    let fastLoginKey = "fastLogin" + userName.toLowerCase();

                    StorageUtil.remove(fastLoginKey);
                    Toasts.success(translate("更新成功!"), 3, () => {
                        LogoutUtil({
                            callBack: () => {
                                Actions.Login({ from: "ChangePassword" });
                            }
                        });
                    });
                    PiwikEventDataHandle({
                        eventTitle: "changePassword1",
                        isSuccess: 2,
                    });
                } else {
                    let errorCode = res?.errors?.[0]?.errorCode;
                    let message = res?.errors?.[0]?.description || translate("网络错误，请稍后重试");

                    // Handle specific error codes with global pop modal
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
                    } else if (["MEM00059", "MEM00145", "MEM00206"].includes(errorCode)) {
                        // Use the description from API response for other specific error codes
                        message = res?.errors?.[0]?.description;
                        Toasts.fail(message);
                    } else {
                        // Show network error for unknown error codes
                        Toasts.fail(translate("网络错误，请稍后重试"), 2);
                    }

                    // Determine Piwik event based on error code
                    let eventTitle = "changePassword1";
                    if (errorCode === "MEM00207") {
                        eventTitle = "ChangePasswordDummyPopup";
                    } else if (errorCode === "MEM00208") {
                        eventTitle = "ChangePasswordSensitivePopup";
                    }

                    PiwikEventDataHandle({
                        eventTitle: eventTitle,
                        isSuccess: 1,
                        customProperties: {
                            API_Error: errorCode + " - " + message
                        },
                    });
                }
            })
            .catch(error => {});
    }

    render() {
        const { passwordST1, passwordST2, passwordST3, password1, password2, password3, changeBtn, showPasswordRequirements2 } = this.state; //註冊訊息

        return (
            <View style={Styles.viewContainer}>
                <KeyboardAwareScrollView>
                    <View style={[Styles.commonWrap]}>
                        <CustomTextInput
                            title={translate("当前密码")}
                            titleStyle={Styles.inputTitle}
                            errorMessage={passwordST1}
                            type={"error"}
                            value={password1}
                            placeholder={translate("请输入8-20位数的密码")}
                            placeholderTextColor={"#999999"}
                            onChangeText={value => {
                                this.password1(value.trim());
                            }}
                            maxLength={20}
                            showEyes={true}
                        />

                        <CustomTextInput
                            title={translate("新的密码")}
                            titleStyle={Styles.inputTitle}
                            errorMessage={passwordST2}
                            hasError={showPasswordRequirements2}
                            type={"error"}
                            value={password2}
                            placeholder={translate("请输入8-20位数的密码")}
                            onChangeText={value => {
                                this.password2(value.trim());
                            }}
                            maxLength={20}
                            showEyes={true}
                        />

                        <PasswordRequirements showRequirements={showPasswordRequirements2} />

                        <CustomTextInput
                            title={translate("确认密码")}
                            titleStyle={Styles.inputTitle}
                            errorMessage={passwordST3}
                            type={"error"}
                            value={password3}
                            placeholder={translate("请再次输入新的密码")}
                            onChangeText={value => {
                                this.password3(value.trim());
                            }}
                            maxLength={20}
                            showEyes={true}
                        />
                    </View>

                    <FilledButton
                        text={translate("提交")}
                        enable={changeBtn}
                        onPress={() => {
                            this.changeBtn();
                        }}
                    />
                </KeyboardAwareScrollView>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    userInfo: state.userInfo,
    maintainStatus: state.maintainStatus,
    userSetting: state.userSetting,
});

export default connect(mapStateToProps)(ChangePassword);
