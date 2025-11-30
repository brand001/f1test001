import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import Touch from "react-native-touch-once";
import { Actions } from "react-native-router-flux";
const { width } = Dimensions.get("window");
import { connect } from "react-redux";
import { Toasts } from "$Toasts";
import { GetGlobalModal } from "$Utils/globalModal";
import { translate } from "@/locales/translate";
import { ArrowIcon, VerificationZalaIcon, VerificationVoiceIcon, VerificationPhoneIcon, VerificationMailIcon } from "$Components/icons/index.js";
import Color from "$Components/Color";
import NavBack from "$Components/Nav/NavBack";
import { RowCenterBetween } from "$Components/CustomView";

class MobileVerificationMethod extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phones: false,
            emails: false,
            memberCode: "",
            memberInfo: this.props.memberInfo,
            emailVerifyTime: 5,
            smsVerifyTime: 5,
            zaloVerifyTime: 5,
            voiceVerifyTime: 5,

            zaloShow: true,
            smsShow: true,
            voiceShow: true,
            emailShow: true,
            serviceAction: this.props.serviceAction || "ProfileVerification",
        };
    }

    componentWillMount() {
        let memberInfo = this.props.memberInfo || "";
        if (memberInfo) {
            const phoneData = memberInfo.contacts?.filter(
                (item) => item.contactType.toLocaleLowerCase() == "phone"
            )[0];
            const emailData = memberInfo.contacts?.filter(
                (item) => item.contactType.toLocaleLowerCase() == "email"
            )[0];

            let memberCode = memberInfo.memberCode;
            let phones = phoneData && phoneData.contact || false;
            let emails = emailData && emailData.contact || false;

            this.setState({ phones, emails, memberCode });
            this.getVerifyTimes();
        }
    }

    componentDidMount() {
        this.getVerifyTimes();
        this.props.navigation.setParams({
            leftButton: () => {
                return (
                    <NavBack
                        fill={Color.white}
                        width={15}
                        height={15}
                        direction='left'
                        onPress={() => {
                            if (this.props.from === "reSetPwd") {
                                this.CancelLoginPopup();
                            } else {
                                Actions.pop();
                            }
                        }}
                    />
                );
            }
        });
    }

    componentWillUnmount() {
    }

    CancelLoginPopup() {
        GetGlobalModal({
            title: translate("您将取消您的登录尝试"),
            iconName: "warning",
            message: translate("如果您现在离开，您的登录将不会成功。请完成验证以确保您的账户安全"),
            cancelText: translate("离开"),
            onCancel: () => {
                Actions.pop();
            },
            confirmText: translate("留下"),
            onConfirm: () => {}
        });
    }

    getVerifyTimes() {
        const apiEndpoint = this.state.serviceAction === "Revalidate" ? ApiPort.VerificationAttempt : ApiPort.ResendAttempt;
        let processed = ["SMS", "Voice", "Email", "Zalo"].map(v =>
            fetchRequest(apiEndpoint + `?serviceAction=${this.state.serviceAction}&channelType=${v}&`, "GET")
        );
        Promise.all(processed).then((res) => {
            Toasts.removeAll();
            if (Array.isArray(res) && res.length) {
                // Each result: SMS, Voice, Email, Zalo
                let smsVerifyTime = res[0]?.isSuccess ? (res[0]?.result?.count || res[0]?.result) : 0;
                let voiceVerifyTime = res[1]?.isSuccess ? (res[1]?.result?.count || res[1]?.result) : 0;
                let emailVerifyTime = res[2]?.isSuccess ? (res[2]?.result?.count || res[2]?.result) : 0;
                let zaloVerifyTime = res[3]?.isSuccess ? (res[3]?.result?.count || res[3]?.result) : 0;

                this.setState({
                    zaloShow: zaloVerifyTime > 0,
                    smsShow: smsVerifyTime > 0,
                    voiceShow: voiceVerifyTime > 0,
                    emailShow: emailVerifyTime > 0,
                    zaloVerifyTime,
                    smsVerifyTime,
                    voiceVerifyTime,
                    emailVerifyTime,
                });
            }
        }).catch(err => {
            console.error("Error checking verification attempts:", err);
            Toasts.removeAll();
            // Set all attempts to 0 on error
            this.setState({
                zaloShow: false,
                smsShow: false,
                voiceShow: false,
                emailShow: false,
                zaloVerifyTime: 0,
                smsVerifyTime: 0,
                voiceVerifyTime: 0,
                emailVerifyTime: 0,
            });
        });
    }


    goVerification(key, type) {
        let verificationType = "phone";
        if (type === "Email") {
            verificationType = "email";
        }
        Actions.pop();
        Actions.Verification({
            dataPhone: this.state.phones,
            dataEmail: this.state.emails,
            verificaType: verificationType,
            verificationMethod: type,
            memberCode: this.state.memberCode,
            smsShow: this.state.smsShow,
            emailShow: this.state.emailShow,
            formPage: this.props.from,
            updateState: (type) => this.updateState(type),
            serviceAction: this.state.serviceAction,
            getUser: () => {},
            memberInfo: this.state.memberInfo,
            isEditingPhone: this.props.isEditingPhone,
            isEditingEmail: this.props.isEditingEmail,
        });
    }

    updateState = (type) => {
        this.getVerifyTimes();
        if (type === "email") {
            this.setState({ emailShow: false });
        }
        if (type === "phone") {
            this.setState({ smsShow: false });
        }
    };

    render() {
        window.PromptPagPop = () => {
            Actions.pop();
        };
        return (
            <View style={{ flex: 1 }}>
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ paddingHorizontal: 16, paddingVertical: 24 }}>
                        <Text style={{ color: "#222222", fontSize: 16, fontWeight: "700" }}>{translate("请选择一种验证方式")}</Text>
                        {/* Button List */}
                        <View style={{ marginTop: 20 }}>
                            {/* Zalo */}
                            {window.LANGUAGE == "VN" && <RowCenterBetween
                                style={[
                                    styles.methodRow,
                                    !this.state.zaloShow && styles.methodRowDisabled
                                ]}
                                onPress={() => {
                                    if (this.state.zaloShow) {
                                        this.goVerification(this.state.phones, "Zalo");
                                    } else {
                                        Toasts.fail(translate("请尝试其他验证方式"), 2);
                                    }
                                }}
                            >
                                <VerificationZalaIcon
                                    fill={this.state.zaloShow ? "#00A6FF" : "#999999"}
                                    wrapStyle={[
                                        styles.iconWrap, {
                                            backgroundColor: this.state.zaloShow ? "#E6F6FF" : "#EFEFF4",
                                        }]}
                                />
                                <Text
                                    style={[
                                        styles.methodText,
                                        !this.state.zaloShow && styles.methodTextDisabled
                                    ]}
                                >
                                    {translate("通过Zalo发送验证码")}
                                </Text>
                                <ArrowIcon
                                    fill={Color.gray}
                                    width={12}
                                    height={12}
                                    direction='right'
                                    wrapStyle={[
                                        styles.arrowIcon,
                                        !this.state.zaloShow && styles.arrowIconDisabled
                                    ]}
                                />
                            </RowCenterBetween>}

                            {/* SMS */}
                            <RowCenterBetween
                                style={[
                                    styles.methodRow,
                                    !this.state.smsShow && styles.methodRowDisabled
                                ]}
                                onPress={() => {
                                    if (this.state.smsShow) {
                                        this.goVerification(this.state.phones, "SMS");
                                    } else {
                                        Toasts.fail(translate("请尝试其他验证方式"), 2);
                                    }
                                }}
                            >
                                <VerificationVoiceIcon
                                    fill={this.state.smsShow ? "#00A6FF" : "#999999"}
                                    wrapStyle={[
                                        styles.iconWrap, {
                                            backgroundColor: this.state.smsShow ? "#E6F6FF" : "#EFEFF4",
                                        }]}
                                />
                                <Text
                                    style={[
                                        styles.methodText,
                                        !this.state.smsShow && styles.methodTextDisabled
                                    ]}
                                >
                                    {translate("通过短信发送验证码")}
                                </Text>
                                <ArrowIcon
                                    fill={Color.gray}
                                    width={12}
                                    height={12}
                                    direction='right'
                                    wrapStyle={[
                                        styles.arrowIcon,
                                        !this.state.smsShow && styles.arrowIconDisabled
                                    ]}
                                />
                            </RowCenterBetween>

                            {/* Note: we dont have telegram yet */}
                            {/* Telegram */}
                            {/* <Touch
                style={[
                  styles.methodRow,
                  !this.state.telegramShow && styles.methodRowDisabled
                ]}
                onPress={() => {
                  if (this.state.telegramShow) {
                    this.goSetPassword(this.state.phones, "telegram");
                  } else {
                    Toasts.fail(translate("请尝试其他验证方式"), 2);
                  }
                }}
              >
                <View style={styles.iconWrap}>
                  <Image
                    source={this.state.telegramShow ? ImagesUrl.verificationTelegram : ImagesUrl.verificationTelegramDisabled}
                    style={[
                      styles.methodIcon,
                      !this.state.telegramShow && styles.methodIconDisabled
                    ]}
                  />
                </View>
                <Text
                  style={[
                    styles.methodText,
                    !this.state.telegramShow && styles.methodTextDisabled
                  ]}
                >
                  Gửi mã OTP qua Telegram
                </Text>
                 <ArrowIcon
                    fill={Color.gray}
                    width={12}
                    height={12}
                    direction='right'
                    wrapStyle={[
                        styles.arrowIcon,
                        !this.state.telegramShow && styles.arrowIconDisabled
                    ]}
                />
              </Touch> */}

                            {/* Voice */}
                            <RowCenterBetween
                                style={[
                                    styles.methodRow,
                                    !this.state.voiceShow && styles.methodRowDisabled
                                ]}
                                onPress={() => {
                                    if (this.state.voiceShow) {
                                        this.goVerification(this.state.phones, "Voice");
                                    } else {
                                        Toasts.fail(translate("请尝试其他验证方式"), 2);
                                    }
                                }}
                            >
                                <VerificationPhoneIcon
                                    fill={this.state.voiceShow ? "#00A6FF" : "#999999"}
                                    wrapStyle={[
                                        styles.iconWrap, {
                                            backgroundColor: this.state.voiceShow ? "#E6F6FF" : "#EFEFF4",
                                        }]}
                                />
                                <Text
                                    style={[
                                        styles.methodText,
                                        !this.state.voiceShow && styles.methodTextDisabled
                                    ]}
                                >
                                    {translate("通过语音发送验证码")}
                                </Text>
                                <ArrowIcon
                                    fill={Color.gray}
                                    width={12}
                                    height={12}
                                    direction='right'
                                    wrapStyle={[
                                        styles.arrowIcon,
                                        !this.state.voiceShow && styles.arrowIconDisabled
                                    ]}
                                />
                            </RowCenterBetween>

                            {/* Email */}
                            {this.props.from !== "profile" &&
                                <RowCenterBetween
                                    style={[
                                        styles.methodRow,
                                        !this.state.emailShow && styles.methodRowDisabled
                                    ]}
                                    onPress={() => {
                                        if (this.state.emailShow) {
                                            this.goVerification(this.state.emails, "Email");
                                        } else {
                                            Toasts.fail(translate("请尝试其他验证方式"), 2);
                                        }
                                    }}
                                >
                                    <VerificationMailIcon
                                        fill={this.state.emailShow ? "#00A6FF" : "#999999"}
                                        wrapStyle={[
                                            styles.iconWrap, {
                                                backgroundColor: this.state.emailShow ? "#E6F6FF" : "#EFEFF4",
                                            }]}
                                    />
                                    <Text
                                        style={[
                                            styles.methodText,
                                            !this.state.emailShow && styles.methodTextDisabled
                                        ]}
                                    >
                                        {translate("通过电子邮件发送验证码")}
                                    </Text>
                                    <ArrowIcon
                                        fill={Color.gray}
                                        width={12}
                                        height={12}
                                        direction='right'
                                        wrapStyle={[
                                            styles.arrowIcon,
                                            !this.state.emailShow && styles.arrowIconDisabled
                                        ]}
                                    />
                                </RowCenterBetween>
                            }
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(MobileVerificationMethod);

const styles = StyleSheet.create({
    methodRow: {
        backgroundColor: "#fff",
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    iconWrap: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 6,
        marginRight: 12,
    },
    methodText: {
        flex: 1,
        fontSize: 14,
        color: "#666666",
        fontWeight: "400",
    },
    arrowIcon: {
        width: 24,
        height: 24,
        tintColor: "#BCBEC3",
        alignItems: "center",
        justifyContent: "center",
    },
    methodTextDisabled: {
        opacity: 0.7,
    },
    arrowIconDisabled: {
        opacity: 0.7,
    },
    methodRowDisabled: {
        opacity: 0.6,
    },
});
