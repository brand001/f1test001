import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";

import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import FilledButton from "$Components/FilledButton";
import UnderlinedButton from "$Components/UnderlinedButton";
import { translate } from "$locales/translate";
import { ImagesUrl } from "@/images/index";
import { Toasts } from "$Toasts";
import { LiveChatOpenGlobe, LogoutUtil } from "$Utils";
import { ColumnCenterCenter, RowCenterAround, RowCenterBetween } from "$Components/CustomView";
import { OtpPhoneIcon, OtpMailIcon, OtpCstIcon } from "$Components/icons/index";

class LoginOtp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            emailVerifyTime: 5,
            smsVerifyTime: 5,

            smsShow: true,
            emailShow: true,
            serviceAction: this.props.formPage === "reSetPwd" ? "Revalidate" : "OTP",
        };
    }

    componentWillMount() {
        this.props.navigation.setParams({
            title: this.props.formPage === "loginOTP" ? translate("安全验证") : translate("安全系统升级"),
        });
    }

    getVerifyTimes() {
        //获取剩余次数
        Toasts.loading(translate("加载中,请稍候..."), 100);
        let processed = ["Email", "SMS"].map(v => fetchRequest(ApiPort.VerificationAttempt + `?ServiceAction=${this.state.serviceAction}&channelType=${v}&`, "GET"));
        Promise.all(processed)
            .then(res => {
                if (Array.isArray(res) && res.length) {
                    Toasts.removeAll();
                    let first = res[0]?.result?.count || res[0]?.result;
                    let second = res[1]?.result?.count || res[1]?.result;

                    let emailVerifyTime = first?.attempt || first?.attempts || first;
                    let smsVerifyTime = second?.attempt || second?.attempts || second;

                    this.setState(
                        {
                            emailVerifyTime,
                            emailShow: emailVerifyTime == 0 ? false : true,

                            smsVerifyTime,
                            smsShow: smsVerifyTime == 0 ? false : true,
                        },
                        () => {
                            let { emailShow, smsShow } = this.state;
                            if (emailShow && !smsShow) {
                                PiwikEventDataHandle("otpexceed3");
                                return;
                            }

                            if (!emailShow && smsShow) {
                                PiwikEventDataHandle("otpexceed4");
                                return;
                            }

                            if (!emailShow && !smsShow) {
                                PiwikEventDataHandle("otpexceed2");
                                return;
                            }
                        },
                    );
                    // 兩種驗證次數都剩0 顯示客服
                    // 其中一種驗證次數剩0 顯示另外一種
                }
            })
            .catch(err => {
                Toasts.removeAll();
            });
    }

    goSetPassword(type) {
        Actions.Verification({
            verificaType: type,
            formPage: this.props.formPage,
            callBack: type => this.updateState(type),
            serviceAction: this.props.formPage === "reSetPwd" ? "Revalidate" : "OTP",
        });
    }

    updateState = type => {
        this.getVerifyTimes();
        if (type === "email") {
            this.setState({ emailShow: false });
        }
        if (type === "phone") {
            this.setState({ smsShow: false });
        }
    };

    render() {
        const { emailShow, smsShow } = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.inforBox}>
                    {window.LANGUAGE != "TH" && <Text style={styles.inforBoxTitle}>{translate("保护您的账户安全")}</Text>}
                    <Text style={styles.inforBoxText}>{translate("为了更好的保护您的账户安全，提高账户安全等级，反劫持并降低交易风险，我们需要您进行账户信息验证。")}</Text>

                    <View style={{ display: "flex", alignItems: "flex-end" }}>
                        <FilledButton
                            text={translate("了解更多")}
                            outlined={true}
                            wrapStyle={{ paddingHorizontal: 10, height: 40 }}
                            onPress={() => {
                                Actions.SecurityNotice({
                                    formPage: this.props.formPage,
                                });
                                PiwikEventDataHandle(`${this.props.formPage}1`);
                            }}
                            textStyle={{}} />
                    </View>
                </View>

                <RowCenterAround style={styles.containerBox}>
                    {smsShow &&
                        <ColumnCenterCenter style={styles.btnTouch}>
                            <OtpPhoneIcon wrapStyle={styles.imgIcon} />

                            <FilledButton
                                onPress={() => {
                                    this.goSetPassword("phone");
                                    PiwikEventDataHandle(`${this.props.formPage}2`);
                                }}
                                text={translate("通过手机验证")}
                                wrapStyle={{
                                    width: !emailShow ? "50%" : "100%",
                                }}
                                fullWidth={false}
                                textStyle={styles.btnTouchText}
                            />
                        </ColumnCenterCenter>
                    }

                    {smsShow && emailShow && <View style={{ flex: 0.1 }} />}

                    {emailShow &&
                        <ColumnCenterCenter style={styles.btnTouch}>
                            <OtpMailIcon wrapStyle={styles.imgIcon} />

                            <FilledButton
                                onPress={() => {
                                    this.goSetPassword("email");
                                    PiwikEventDataHandle(`${this.props.formPage}3`);
                                }}
                                text={translate("通过邮箱验证")}
                                wrapStyle={{
                                    width: !smsShow ? "50%" : "100%",
                                }}
                                fullWidth={false}
                                textStyle={styles.btnTouchText}
                            />
                        </ColumnCenterCenter>
                    }

                    {!smsShow && !emailShow && (
                        <ColumnCenterCenter style={styles.btnTouch}>
                            <OtpCstIcon wrapStyle={styles.imgIcon} />
                            <FilledButton
                                onPress={() => {
                                    LiveChatOpenGlobe();
                                }}
                                text={translate("联系在线客服")}
                                wrapStyle={{
                                    width: "50%",
                                    paddingHorizontal: 20,
                                }}
                                fullWidth={false}
                                textStyle={styles.btnTouchText}
                            />
                        </ColumnCenterCenter>
                    )}
                </RowCenterAround>

                <UnderlinedButton
                    text={translate("跳过验证")}
                    onPress={() => {
                        Actions.jump("Home");
                        LogoutUtil();
                        PiwikEventDataHandle(`${this.props.formPage}4`);
                    }}
                    wrapStyle={{ marginTop: 60 }}
                />
            </View>
        );
    }
}

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(LoginOtp);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    inforBox: {
        borderRadius: 8,
        backgroundColor: "#EFEFF4",
        padding: 16,
    },
    inforBoxTitle: {
        color: "#000",
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 15,
    },
    inforBoxText: {
        color: "#000",
        paddingBottom: 16,
        fontWeight: "400",
        fontSize: 14,
    },
    containerBox: {
        marginTop: 15,
    },
    btnTouch: {
        flex: 1,
        backgroundColor: "#EFEFF4",
        borderRadius: 8,
        padding: 15,
    },
    imgIcon: {
        width: 54,
        height: 54,
        marginBottom: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    btnTouchText: {
        fontSize: 12,
        fontWeight: "400",
    },
});
