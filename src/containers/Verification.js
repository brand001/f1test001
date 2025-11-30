import { WhiteSpace } from "@ant-design/react-native";
import React from "react";
import { Dimensions, Image, StyleSheet, Text, View, Keyboard, TouchableOpacity, TextInput } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Actions } from "react-native-router-flux";
import Touch from "react-native-touch-once";
const { width, height } = Dimensions.get("window");
import { connect } from "react-redux";

import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import { ImagesUrl } from "@/images/index";
import CustomLinkText from "$Components/CustomLinkText";
import FilledButton from "$Components/FilledButton";
import InfoBar from "$Components/InfoBar";
import StepProgressBar from "$Components/StepProgressBar";
import UnderlinedButton from "$Components/UnderlinedButton";
import actions from "$LIB/redux/actions/index";
import { translate } from "$locales/translate";
import { Toasts } from "$Toasts";
import { LiveChatOpenGlobe, checkEmail, checkPhone, GetSeonFingerprint } from "$Utils";
import { WarningIcon, ArrowIcon, EditIcon } from "$Components/icons/index";
import { KycStatusModalTranslation } from "@/containers/Profile/data";

import VerificationCodeInput from "../components/VerificationCodeInput";
import { judgeMemberStatus } from "../lib/utils/quelea";
import Color from "$Components/Color";
import NavBack from "$Components/Nav/NavBack";
import { ColumnCenterCenter, RowCenterBetween, RowCenterCenter, RowStartBetween, RowStartStart } from "$Components/CustomView";
import { GetGlobalModal } from "$Utils/globalModal";
import Sumsub from "central-kyc-sumsub/SumsubNative";
import { maskEmail, maskPhone4 } from "@/actions/Reg";
import { getSumsubColors } from "@/containers/Profile/UploadFile/data";

let VerificationType = {
    phone: {
        navTitle: "手机验证",
        title: "手机接收验证码",
        txt1: "为了确保您帐户的安全，请按照以下说明验证您的手机号码。",
        txt2: "手机号码",
        txt3: "如果您想更新手机号码，请联系我们的{在线客服}",
        txt4: "请输入您手机收到的验证码",
    },
    sms: {
        navTitle: "手机验证",
        title: "手机接收验证码",
        txt1: "一次性OTP验证码将通过短信发送至您的手机号码。",
        txt2: "手机号码",
        txt3: "如果您想更新手机号码，请联系我们的{在线客服}",
        txt4: "请输入您手机收到的验证码",
    },
    voice: {
        navTitle: "手机验证",
        title: "手机接收验证码",
        txt1: "一次性OTP验证码将通过语音电话发送至您的手机号码。",
        txt2: "手机号码",
        txt3: "如果您想更新手机号码，请联系我们的{在线客服}",
        txt4: "请输入您手机收到的验证码",
    },
    zalo: {
        navTitle: "手机验证",
        title: "手机接收验证码",
        txt1: "一次性OTP验证码将通过Zalo发送至您的手机号码。",
        txt2: "手机号码",
        txt3: "如果您想更新手机号码，请联系我们的{在线客服}",
        txt4: "请输入您手机收到的验证码",
    },
    email: {
        navTitle: "邮箱验证",
        title: "邮箱接收验证码",
        txt1: "为了确保您帐户的安全，请按照以下说明验证您的电子邮件。",
        txt2: "电子邮箱",
        txt3: "如果您想更新电子邮箱，请联系我们的{在线客服}",
        txt4: "请输入您邮箱收到的验证码",
    },
    phoneEdit: {
        navTitle: "新手机验证",
        title: "新手机接收验证码",
        txt1: "为了确保您帐户的安全，请按照以下说明验证您的新手机号码。",
        txt2: "新手机号码",
        txt4: "请输入您新手机收到的验证码",
    },
    emailEdit: {
        navTitle: "新邮箱验证",
        title: "新邮箱接收验证码",
        txt1: "为了确保您帐户的安全，请按照以下说明验证您的新电子邮箱。",
        txt2: "新电子邮箱",
        txt4: "请输入您新邮箱收到的验证码",
    },
};

// 个人资料--手机验证/邮箱验证
class Verification extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errCode: 0,
            verifyTimes: 5, //剩余次数
            getCodePhone: 1,
            getCodeEmail: 1,
            verificationCode: "",
            CountdownPhone: "60", //60
            CountdownEmail: "60", //60
            CountdownPhone_minutes: "1:00", //1:00
            CountdownEmail_minutes: "1:00", //1:00
            issubmitBtn: false,
            verificaType: this.props.verificaType,
            verificationMethod: this.props.verificationMethod || (this.props.verificaType == "phone" ? "SMS" : "Email"),
            phone: "",
            email: "",
            verification: true,
            memberCode: "",
            smsType: "SMS",
            descriptionMessage: "",
            serviceAction: this.props.serviceAction || "ProfileVerification",
            memberInfo: this.props.userInfo.memberInfo,
            invalidEmailMessage: "",
            invalidPhoneMessage: "",
            prefixes: [],
            prefixesMaxLength: window.LANGUAGE == "CN" ? 11 : 9,
            fraudSignature: ""
        };
    }
    async componentDidMount() {
        const { verificaType, isEditingPhone, isEditingEmail } = this.props;
        const navTitle = isEditingPhone ? VerificationType.phoneEdit?.navTitle :
            isEditingEmail ? VerificationType.emailEdit?.navTitle :
                VerificationType[verificaType]?.navTitle;
        this.props?.navigation?.setParams({
            title: translate(navTitle),
            leftButton: () =>
                <NavBack
                    onPress={() => {
                        if (isEditingPhone || isEditingEmail) {
                            const childrenTxt = isEditingPhone ? translate("您的新手机号码尚未验证，若要离开，新手机号码将不会被保存。") : translate("您的新电子邮箱尚未验证，若要离开，新电子邮箱将不会被保存。");
                            GetGlobalModal({
                                title: translate("提醒2"),
                                message: childrenTxt,
                                confirmText: translate("继续验证2"),
                                onConfirm: () => {},
                                cancelText: translate("确定离开2"),
                                onCancel: () => {
                                    Actions.pop();
                                },
                            });
                        } else {
                            Actions.pop();
                        }
                    }}
                />
            ,
        });
        !isEditingEmail && !isEditingPhone && this.setData();
        this.getAllVerifyTimes();
        this.getPhonePrefixes();

        let fraudSignature = await GetSeonFingerprint();
        this.setState({ fraudSignature });
    }

    componentWillUnmount() {
        this.CountdownPhones && clearInterval(this.CountdownPhones);
        this.CountdownEmails && clearInterval(this.CountdownEmails);
        let { formPage = "" } = this.props;
        if (formPage == "Referee") {
            this?.props?.callBack?.(true); // 继续回调出现弹窗 完成任务
        } else {
            this?.props?.callBack?.();
        }
        this.props.userInfo_updateMemberInfo({});
    }

    setData() {
        let { formPage = "" } = this.props;
        let memberInfo = this.props.userInfo.memberInfo;
        let contacts = memberInfo?.contacts;

        const phoneData = contacts?.find(v => v.contactType.toLocaleLowerCase() === "phone");
        const emailData = contacts?.find(v => v.contactType.toLocaleLowerCase() === "email");
        let phone = phoneData?.contact || this.props.dataPhone || "";
        let email = emailData?.contact || this.props.dataEmail || "";

        let memberCode = memberInfo?.memberCode;
        this.setState({ phone, email, memberCode });

        if (formPage == "Recommend" || formPage == "Referee") {
            let phoneStatus = memberInfo?.phoneStatus;
            let emailStatus = memberInfo?.emailStatus;
            if (emailStatus) {
                // 邮箱验证success
                if (phoneStatus) {
                    // 电话验证success
                } else {
                    this.setState(
                        {
                            verificaType: "phone",
                        },
                        () => {
                            this.getVerifyTimes();
                        },
                    );
                }
            } else {
                this.setState(
                    {
                        verificaType: "email",
                    },
                    () => {
                        this.getVerifyTimes();
                    },
                );
            }
        } else {
            this.getVerifyTimes();
        }
    }

    async getAllVerifyTimes() {
        //获取剩余次数
        const isZalo = this.state.verificationMethod === "Zalo" && window.LANGUAGE == "VN";
        const apiEndpoint = this.state.serviceAction === "Revalidate" ? ApiPort.VerificationAttempt : ApiPort.ResendAttempt;
        let processed = ["SMS", "Voice", "Email", ...isZalo ? ["Zalo"] : []].map(v => fetchRequest(apiEndpoint + `?serviceAction=${this.state.serviceAction}&channelType=${v}&`, "GET"));
        Promise.all(processed).then((res) => {
            if (Array.isArray(res) && res.length) {
                Toasts.removeAll();
                // Each result: SMS, Voice, Email, Zalo (if VN)
                let smsVerifyTime = res[0]?.isSuccess ? (res[0]?.result?.count || res[0]?.result) : 0;
                let voiceVerifyTime = res[1]?.isSuccess ? (res[1]?.result?.count || res[1]?.result) : 0;
                let emailVerifyTime = res[2]?.isSuccess ? (res[2]?.result?.count || res[2]?.result) : 0;
                let zaloVerifyTime = isZalo ? (res[3]?.isSuccess ? (res[3]?.result?.count || res[3]?.result) : 0) : 0;

                this.setState({
                    zaloShow: isZalo && zaloVerifyTime > 0,
                    smsShow: smsVerifyTime > 0,
                    voiceShow: voiceVerifyTime > 0,
                    emailShow: emailVerifyTime > 0,
                    zaloVerifyTime,
                    smsVerifyTime,
                    voiceVerifyTime,
                    emailVerifyTime,
                }, () => {
                    // Call showVerificationFailModal after state is updated
                    this.showVerificationFailModal();
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

    hasOtherMethodsRemaining(currentMethod) {
        const {
            zaloVerifyTime,
            smsVerifyTime,
            voiceVerifyTime,
            emailVerifyTime,
        } = this.state;

        const attemptsMap = {
            Zalo: zaloVerifyTime,
            SMS: smsVerifyTime,
            Voice: voiceVerifyTime,
            Email: emailVerifyTime,
        };

        return Object.entries(attemptsMap).some(([method, count]) => {
            return method !== currentMethod && count > 0;
        });
    }

    getVerifyTimes(smsType = "SMS") {
        const { formPage = "" } = this.props;
        const { verificaType, serviceAction } = this.state;
        //获取剩余次数
        let types;
        if (this.state.verificationMethod === "Zalo") {
            types = "Zalo";
        } else if (this.state.verificaType === "email") {
            types = "Email";
        } else {
            types = smsType;
        }
        const apiEndpoint = serviceAction === "Revalidate" ? ApiPort.VerificationAttempt : ApiPort.ResendAttempt;
        let api = `${apiEndpoint}?serviceAction=${serviceAction}&channelType=${types}&`;

        Toasts.loading(translate("加载中,请稍候..."), 2000000);
        fetchRequest(api, "GET")
            .then(data => {
                Toasts.removeAll();
                if (data.isSuccess) {
                    let result = data?.result;
                    let verifyTimes = result?.count || result?.attempt || result?.attempts || result;

                    this.setState({ verifyTimes });
                    if (verifyTimes == 0) {
                        this.setState({ verification: false }, () => {
                            this.getAllVerifyTimes();
                            this.postPiwErr();
                        });
                    } else {
                    }
                } else {
                    Toasts.removeAll();
                    this.catchErrdescriptionMessage(data);
                }
            })
            .catch(err => {
                Toasts.removeAll();
                let { getCodePhone, getCodeEmail } = this.state;
                if (getCodePhone == 1 || getCodeEmail == 1) {
                    let message = err?.errors[0]?.description || "";
                    Toasts.fail(message, 1.5);
                }
            });
    }

    //发送验证码
    getCode(smsType) {
        this.clearCode();

        this.setState(
            {
                smsType,
                verificationMethod: smsType,
            },
            () => {
                if (this.state.verificaType == "phone") {
                    this.getPhoneCode(smsType);
                }
            },
        );
        if (this.state.verificaType == "email") {
            this.getEamilCode();
        }
    }

    getVoiceSMScode(smsType) {
        let { formPage = "", isEditingPhone } = this.props;
        let param = {
            siteId: window.siteId,
            memberCode: this.state.memberCode,
            serviceAction: this.state.serviceAction,
            channelType: smsType,
            BlackBoxValue: E2Backbox || "",
            ActionType: isEditingPhone ? "VerifyNewPhone" : "VerifyPhoneContact",
            ...(isEditingPhone && {
                contact: `${window.DefaultConfig?.countryCallingCode}-${this.state.phone}`,
            }),
            ...(isEditingPhone && {
                fraudSignature: this.state.fraudSignature || "",
            }),
        };
        let url = smsType == "SMS" || smsType == "Zalo" ? ApiPort.PhoneVerify : ApiPort.VoiceVerify;
        return fetchRequest(url, "POST", param);
    }

    //TODO: 发送短信验证码
    async getPhoneCode(smsType) {
        let { formPage = "" } = this.props;
        let res = "";
        // {
        //   isSuccess: true,
        //   result: {
        //     isSent: true
        //   }
        // }

        this.setState({
            descriptionMessage: "",
        });
        Toasts.loading(translate("发送中.."), 100000);
        try {
            res = await this.getVoiceSMScode(smsType);
        } catch (err) {
            res = err;
        }
        Toasts.removeAll();

        if (formPage === "loginOTP" || formPage === "reSetPwd") {
            if (smsType == "SMS") {
                PiwikEventDataHandle(`${formPage}6.11`);
            } else {
                PiwikEventDataHandle(`${formPage}6.21`);
            }
        }

        if (res == "") return;
        let result = res?.result;
        if (res?.isSuccess) {
            //&& result && result?.isSent
            const isZalo = smsType === "Zalo";
            Toasts.success(isZalo ? translate("Zalo验证码发送成功") : translate("发送成功"), 2);
            this.CountdownPhones && clearInterval(this.CountdownPhones);
            this.CountdownEmails && clearInterval(this.CountdownEmails);
            this.CountdownPhone(60); //60
        } else {
            const isZalo = smsType == "Zalo";
            if (isZalo) {
                Toasts.fail(translate("无法通过Zalo发送验证码,请稍后再试"), 2);
            } else {
                this.catchErrdescriptionMessage(res);
            }
        }
        this.clearCode();
    }

    //TODO: 获取邮箱验证码
    async getEamilCode() {
        let { formPage = "", isEditingEmail } = this.props;
        this.setState({
            descriptionMessage: "",
        });

        const data = {
            siteId: window.siteId,
            serviceAction: this.state.serviceAction,
            BlackBoxValue: E2Backbox || "",
            ActionType: isEditingEmail ? "VerifyNewEmail" : "VerifyEmailContact",
            memberCode: this.state.memberCode,
            ...(isEditingEmail && {
                contact: this.state.email,
            }),
            ...(isEditingEmail && {
                fraudSignature: this.state.fraudSignature || "",
            }),
            // userName: this.state.memberCode,
            // CurrencyCode: window.DefaultConfig?.currency,
        };
        let res = "";
        Toasts.loading(translate("发送中.."), 100000);
        try {
            res = await fetchRequest(window.ApiPort.EmailVerify, "POST", data);
        } catch (err) {
            res = err;
        }
        Toasts.removeAll();

        if (res == "") return;
        let result = res?.result;
        if (res?.isSuccess) {
            //&& result && result?.isSent
            Toasts.success(translate("发送成功"), 2);
            this.CountdownPhones && clearInterval(this.CountdownPhones);
            this.CountdownEmails && clearInterval(this.CountdownEmails);
            this.CountdownEmail(60); //60
        } else {
            this.catchErrdescriptionMessage(res);
        }
        this.clearCode();


    }

    verifyVoiceSMSTAC(smsType) {
        let { formPage = "", isEditingPhone } = this.props;
        const param = {
            siteId: window.siteId,
            serviceAction: this.state.serviceAction,
            verificationCode: this.state.verificationCode,
            CurrencyCode: window.DefaultConfig?.currency,
            channelType: smsType,
            BlackBoxValue: E2Backbox || "",
            ActionType: isEditingPhone ? "VerifyNewPhone" : "VerifyPhoneContact",
            ...(isEditingPhone && {
                contact: `${window.DefaultConfig?.countryCallingCode}-${this.state.phone}`,
            }),
            ...(isEditingPhone && {
                fraudSignature: this.state.fraudSignature || "",
            }),
        };
        let url = smsType == "SMS" || smsType == "Zalo" ? ApiPort.PhoneTAC : ApiPort.VoiceTAC;
        return fetchRequest(url, "PATCH", param);
    }

    //TODO: 校验短信验证码
    async verifyPhoneTAC() {
        let { formPage = "" } = this.props;
        this.setState({
            descriptionMessage: "",
        });
        const { smsType } = this.state;
        let res = "";
        Toasts.loading(translate("加载中,请稍候..."), 100000);
        try {
            res = await this.verifyVoiceSMSTAC(this.state.smsType);
        } catch (err) {
            res = err;
        }
        Toasts.removeAll();

        if (res == "") return;
        let result = res?.result || {};
        let arr = Object.keys(result);
        let flag = arr.includes("isVerified");
        if (res?.isSuccess && (flag ? result?.isVerified : true)) {
            let queleaReferreeStatus = res?.result?.queleaReferreeStatus;

            // Check if editing phone and show global modal
            if (this.props.isEditingPhone) {
                GetGlobalModal({
                    title: translate("更改手机成功"),
                    renderMessage: ({ hideModalWithAnimation = () => {} }) => <CustomLinkText
                        textAlign="center"
                        norMaltextStyle={{
                            fontSize: 14,
                            color: "#666666",
                        }}
                        themeTextStyle={{ fontSize: 14 }}
                        onPressList={[() => {
                            hideModalWithAnimation();
                            LiveChatOpenGlobe();
                        }]}
                        text={translate("您已成功更改您的手机号码。若您有任何疑问，请联系我们的{在线客服}。")}
                    />,
                    confirmText: translate("我知道了2"),
                    onConfirm: () => {
                        this.QueleaThroughoutFlow(queleaReferreeStatus);
                    },
                });
            } else {
                Toasts.successInfo(translate("验证成功"), 2000, () => {

                    this.QueleaThroughoutFlow(queleaReferreeStatus);
                });
            }

            if (formPage === "loginOTP" || formPage === "reSetPwd") {
                if (smsType == "SMS") {
                    PiwikEventDataHandle({
                        eventTitle: `${formPage}6.2`,
                        isSuccess: 2,
                    });
                } else {
                    PiwikEventDataHandle({
                        eventTitle: `${formPage}6.1`,
                        isSuccess: 2,
                    });
                }
            }

        } else {
            this.catchErrdescriptionMessage(res);
            this.setState({ isShowErrMessage: true });
            this.clearCode();

            let descriptionMessage = result?.message;
            if (formPage === "loginOTP" || formPage === "reSetPwd") {
                if (smsType == "SMS") {
                    PiwikEventDataHandle({
                        eventTitle: `${formPage}6.2`,
                        isSuccess: 1,
                        customProperties: {
                            Phone_Verify_S_SMSOTP_ErrorMsg: descriptionMessage || "Mã xác thực không chính xác, vui lòng kiểm tra lại và chắc chắn bạn nhập đúng mã số được cung cấp.",
                        },
                    });
                } else {
                    PiwikEventDataHandle({
                        eventTitle: `${formPage}6.1`,
                        isSuccess: 1,
                        customProperties: {
                            Phone_Verify_S_VoiceOTP_ErrorMsg: descriptionMessage || "Mã xác thực không chính xác, vui lòng kiểm tra lại và chắc chắn bạn nhập đúng mã số được cung cấp.",
                        },
                    });
                }
            }
        }
    }

    // TODO:校验邮件验证码
    async verifyEmailTAC() {
        let { formPage = "", isEditingEmail } = this.props;
        this.setState({
            descriptionMessage: "",
        });
        const data = {
            siteId: window.siteId,
            serviceAction: this.state.serviceAction,
            verificationCode: this.state.verificationCode,
            CurrencyCode: window.DefaultConfig?.currency,
            BlackBoxValue: E2Backbox || "",
            ActionType: isEditingEmail ? "VerifyNewEmail" : "VerifyEmailContact",
            ...(isEditingEmail && {
                contact: this.state.email,
            }),
            ...(isEditingEmail && {
                fraudSignature: this.state.fraudSignature || "",
            }),
        };
        Toasts.loading(translate("加载中,请稍候..."), 100000);
        let res = "";
        try {
            res = await fetchRequest(window.ApiPort.EmailTAC, "PATCH", data);
        } catch (err) {
            res = err;
        }
        Toasts.removeAll();

        if (res == "") return;
        let result = res?.result;
        if (res?.isSuccess && result?.isVerified) {
            let queleaReferreeStatus = res?.result?.queleaReferreeStatus;

            // Check if editing email and show global modal
            if (this.props.isEditingEmail) {
                GetGlobalModal({
                    title: translate("更改邮箱成功"),
                    renderMessage: ({ hideModalWithAnimation = () => {} }) => <CustomLinkText
                        textAlign="center"
                        norMaltextStyle={{
                            fontSize: 14,
                            color: "#666666",
                        }}
                        themeTextStyle={{ fontSize: 14 }}
                        onPressList={[() => {
                            hideModalWithAnimation();
                            LiveChatOpenGlobe();
                        }]}
                        text={translate("您已成功更改您的电子邮箱。若您有任何疑问，请联系我们的{在线客服}。")}
                    />,
                    confirmText: translate("我知道了2"),
                    onConfirm: () => {
                        this.QueleaThroughoutFlow(queleaReferreeStatus);
                    },
                });
            } else {
                Toasts.successInfo(translate("验证成功"), 2000, () => {
                    this.QueleaThroughoutFlow(queleaReferreeStatus);
                });
            }

            if (formPage === "loginOTP" || formPage === "reSetPwd") {
                PiwikEventDataHandle({
                    eventTitle: `${formPage}9`,
                    isSuccess: 2,
                });
            }
        } else {
            this.catchErrdescriptionMessage(res);

            this.clearCode();

            let descriptionMessage = result?.message;
            if (formPage === "loginOTP" || formPage === "reSetPwd") {
                PiwikEventDataHandle({
                    eventTitle: `${formPage}9`,
                    isSuccess: 1,
                    customProperties: {
                        "Email_Verify_S_OTP_ErrorMsg": descriptionMessage || "Mã xác thực không chính xác, vui lòng kiểm tra lại và chắc chắn bạn nhập đúng mã số được cung cấp.",
                    },
                });
            }
        }
    }

    QueleaThroughoutFlow(queleaReferreeStatus) {
        this.props.userInfo_updateMemberInfo({});
        let { formPage = "", callBack = () => {}, userInfo = {} } = this.props;

        if (formPage === "loginOTP" || formPage === "profile") {
            if (formPage == "loginOTP") {
                Actions.pop();
                Actions.pop();
            }
            Actions.pop();
            // judgeMemberStatus({
            //     queleaReferreeStatus: queleaReferreeStatus,
            //     formPage,
            // });
        } else {
            let memberInfo = userInfo.memberInfo;
            let phoneStatus = memberInfo?.phoneStatus;
            let emailStatus = memberInfo?.emailStatus;

            if (formPage == "Recommend" || formPage == "Referee") {
                if (formPage == "Recommend") {
                    callBack();
                }
                if (this.state.verificaType === "email") {
                    if (phoneStatus) { // 已经验证
                        Actions.pop();
                        // judgeMemberStatus({
                        //     queleaReferreeStatus: queleaReferreeStatus,
                        //     formPage,
                        // });
                    } else {
                        this.setState(
                            {
                                verificaType: "phone",
                            },
                            () => {
                                this.getVerifyTimes();
                            },
                        );
                    }
                } else {
                    if (emailStatus) {
                        Actions.pop();
                        // judgeMemberStatus({
                        //     queleaReferreeStatus: queleaReferreeStatus,
                        //     formPage,
                        // });
                    } else {
                        this.setState(
                            {
                                verificaType: "email",
                            },
                            () => {
                                this.getVerifyTimes();
                            },
                        );
                    }

                }
            } else if (formPage == "reSetPwd") {
                Actions.pop();
                Actions.SetPassword({ queleaReferreeStatus });
            } else {
                Actions.pop();
            }
        }
    }

    //手机验证码倒计时处理
    CountdownPhone(item) {
        this.setState({ getCodePhone: 2 });
        let time = item;
        let m, s, ms;
        this.CountdownPhones = setInterval(() => {
            time -= 1;
            m = "0" + parseInt(time / 60).toString();
            s = time - m * 60;
            if (s < 10) {
                s = "0" + s.toString();
            }
            ms = m + ":" + s;
            this.setState({ CountdownPhone: time, CountdownPhone_minutes: ms });
            if (m == 0 && s == 0) {
                this.setState({ getCodePhone: 3 }, () => {
                    this.clearCode();
                });

                clearInterval(this.CountdownPhones);
            }
        }, 1000);
    }

    //邮箱验证码倒计时处理
    CountdownEmail(item) {
        this.setState({ getCodeEmail: 2 });
        let time = item;
        let m, s, ms;
        this.CountdownEmails = setInterval(() => {
            time -= 1;
            m = "0" + parseInt(time / 60).toString();
            s = time - m * 60;
            if (s < 10) {
                s = "0" + s.toString();
            }
            ms = m + ":" + s;
            this.setState({ CountdownEmail: time, CountdownEmail_minutes: ms });
            if (m == 0 && s == 0) {
                this.setState({ getCodeEmail: 3 }, () => {
                    this.clearCode();
                });
                clearInterval(this.CountdownEmails);
            }
        }, 1000);
    }

    //提交验证
    submitBtn() {
        if (this.state.verificationCode.length != 6) {
            return;
        }
        // TODO: 提交验证码
        if (this.state.verificaType == "phone") {
            this.verifyPhoneTAC();
        }
        if (this.state.verificaType == "email") {
            this.verifyEmailTAC();
        }
    }

    // 清空验证码
    clearCode(flag) {
        let errCode = this.state.errCode;
        errCode += 1;
        this.setState({
            issubmitBtn: false,
            verificationCode: "",
            errCode,
        });
    }

    checked(code) {
        if (code.length == 6) {
            this.setState({
                issubmitBtn: true,
                verificationCode: code,
            });
        } else {
            this.setState({ issubmitBtn: false });
        }
    }

    changType() {
        let { formPage = "" } = this.props;
        Actions.pop();

        if (this.state.verificaType == "phone") {
            PiwikEventDataHandle(`${formPage}7`);
        } else {
            PiwikEventDataHandle(`${formPage}10`);
        }
    }

    catchErrdescriptionMessage(err) {
        let { getCodePhone, getCodeEmail, verificaType } = this.state;
        Toasts.removeAll();
        this.clearCode();
        let errorCode = "";
        let description = "";
        if (err.isSuccess) {
            description = err?.result?.message;
        } else {
            errorCode = err?.errors[0]?.errorCode;
            description = err?.errors[0]?.description;
        }

        // Check if the error code is otp expired
        // if (errorCode === "VERI40002") {
        //     description = translate("验证码失效，请重新获取新的验证码");
        // }
        // else {
        //     description = translate("验证码有误，请检查并确保您输入了正确的验证码");
        // }

        let resendCounter = err?.result?.resendCounter || err?.result?.remainingAttempt;
        // if (resendCounter == 0) {
        //     this.setState(
        //         {
        //             verification: false,
        //         },
        //         () => {
        //             this.getAllVerifyTimes();
        //             this.postPiwErr();
        //         },
        //     );
        //     return;
        // } else 
        // if (resendCounter > 0) {
        //     this.setState({
        //         verifyTimes: resendCounter,
        //     });
        // }

        this.setState({
            descriptionMessage: description,
        });

        if (errorCode == "VAL18013" || errorCode == "VAL18015" || errorCode == "P109001") {
            this.setState({ verification: false }, () => {
                this.getAllVerifyTimes();
                this.postPiwErr();
            });
        } else {
            this.getAllVerifyTimes();
            if (getCodePhone == 1 && verificaType == "phone" || getCodeEmail == 1 && verificaType == "email") {
                Toasts.fail(description);
                return;
            }
        }
    }

    postPiwErr() {
        let { formPage = "", callBack = () => {} } = this.props;
        this.CountdownEmails && clearInterval(this.CountdownEmails);
        this.CountdownPhones && clearInterval(this.CountdownPhones);
        (formPage === "loginOTP" || formPage === "reSetPwd") && callBack(this.state.verificaType);

        PiwikEventDataHandle("otpexceed1");
    }

    showVerificationFailModal() {
        const isVN = window.LANGUAGE == "VN";
        const isCN = window.LANGUAGE == "CN";
        const hasOtherMethods = isVN ?
            (this.state.zaloVerifyTime > 0 || this.state.smsVerifyTime > 0 || this.state.voiceVerifyTime > 0) :
            isCN ?
                this.state.smsVerifyTime > 0 :
                (this.state.smsVerifyTime > 0 || this.state.voiceVerifyTime > 0);

        if (this.state.verificaType == "phone") {
            // Check if current method still has attempts
            const currentMethodHasAttempts = this.state.verificationMethod === "Zalo" ? this.state.zaloVerifyTime > 0 :
                this.state.verificationMethod === "SMS" ? this.state.smsVerifyTime > 0 :
                    this.state.verificationMethod === "Voice" ? this.state.voiceVerifyTime > 0 : false;

            if (!currentMethodHasAttempts) {
                this.setState({
                    verification: false,
                });

                if (hasOtherMethods) {
                    GetGlobalModal({
                        title: translate("您已达到通过{X}接收OTP的限制", {
                            X: this.state.verificationMethod === "Voice" && window.LANGUAGE === "TH" ? "เสียงโทรศัพท" :
                                this.state.verificationMethod === "Voice" && window.LANGUAGE === "VN" ? "Điện Thoại" :
                                    this.state.verificationMethod
                        }),
                        message: translate("请尝试其他验证方式2"),
                        confirmText: translate("尝试其他方式2"),
                        onConfirm: () => {
                            Actions.pop();
                            Actions.MobileVerificationMethod({
                                memberInfo: this.state.memberInfo,
                                from: this.props.formPage,
                                serviceAction: this.state.serviceAction,
                                isEditingPhone: this.props.isEditingPhone,
                                isEditingEmail: this.props.isEditingEmail,
                            });
                        },
                        cancelText: translate("关闭"),
                        onCancel: () => {
                            this.setState({
                                verification: true,
                            });
                        },
                    });
                } else {
                    GetGlobalModal({
                        title: translate("您已达到今日的 OTP 请求上限"),
                        message: translate("请明天再试，或通过在线客服联系客服人员。"),
                        confirmText: translate("明天再尝试"),
                        onConfirm: () => {
                            this.setState({
                                verification: true,
                            });
                        },
                        cancelText: translate("联系在线客服4"),
                        onCancel: () => { LiveChatOpenGlobe(); },
                    });
                }
            }
        } else if (this.state.verificaType == "email") {
            // Check if email method still has attempts
            const emailHasAttempts = this.state.emailVerifyTime > 0;

            if (!emailHasAttempts) {
                this.setState({
                    verification: false,
                });

                GetGlobalModal({
                    title: translate("您已达到今日的 OTP 请求上限"),
                    message: translate("请明天再试，或通过在线客服联系客服人员。"),
                    confirmText: translate("明天再尝试"),
                    onConfirm: () => {
                        this.setState({
                            verification: true,
                        });
                    },
                    cancelText: translate("联系在线客服4"),
                    onCancel: () => { LiveChatOpenGlobe(); },
                });
            }
        }
    }

    createVerifica() {
        let { verificaType, descriptionMessage, verifyTimes, issubmitBtn, errCode, CountdownPhone } = this.state;
        let { isEditingPhone, isEditingEmail } = this.props;
        const isZalo = this.state.verificationMethod == "Zalo";
        const isSMS = this.state.verificationMethod == "SMS";
        const isVoice = this.state.verificationMethod == "Voice";

        const getVerificationType = () => {
            if (isEditingPhone) return VerificationType.phoneEdit;
            if (isEditingEmail) return VerificationType.emailEdit;
            if (isZalo) return VerificationType.zalo;
            if (isSMS) return VerificationType.sms;
            if (isVoice) return VerificationType.voice;
            return VerificationType[this.state.verificaType];
        };

        const titles = getVerificationType();
        return (
            <View style={styles.inputContainer}>
                <Text style={styles.inputContainerTitle}>{translate(titles.txt4)}</Text>

                <VerificationCodeInput
                    err={Boolean(descriptionMessage)}
                    key={errCode}
                    inputSize={6} //默认value是 6
                    TextInputChange={value => {
                        this.checked(value);
                    }}
                />

                {Boolean(descriptionMessage && descriptionMessage.length) &&
                    <InfoBar type={"error"} wrapStyle={{ marginTop: 10 }} text={descriptionMessage} />
                }

                {/* {verifyTimes >= 0 &&
                    <CustomLinkText
                        textAlign="center"
                        wrapStyle={{ marginTop: 15 }}
                        text={translate("您还有 ({{X}}) 次尝试机会", {
                            X: verifyTimes,
                        })}
                    />
                } */}

                <FilledButton
                    text={translate("立即验证")}
                    enable={issubmitBtn}
                    wrapStyle={{
                        marginTop: 15,
                        backgroundColor: issubmitBtn ? "#42D200" : "#D4D7DD",
                        borderColor: issubmitBtn ? "#42D200" : "#D4D7DD"
                    }}
                    textStyle={{
                        color: issubmitBtn ? "#fff" : "#999999"
                    }}
                    onPress={() => {
                        this.submitBtn();
                    }} />

                {/* {verificaType == "phone" && window.LANGUAGE != "CN" && !isZalo &&
                    <Touch
                        onPress={() => {
                            if (CountdownPhone > 0) return;
                            if (this.state.smsType == "Voice") {
                                this.getCode("SMS");
                            } else {
                                this.getCode("Voice");
                            }
                        }}
                        style={[
                            styles.getCodeBtn,
                            {
                                backgroundColor: "transparent",
                                borderWidth: CountdownPhone > 0 ? 0 : 1,
                            },
                        ]}>
                        <Text
                            style={[
                                styles.getCodeBtnText,
                                {
                                    color: CountdownPhone > 0 ? "#BCBEC3" : "#00A6FF",
                                },
                            ]}>
                            {this.state.smsType == "Voice" ? translate("发送短信验证码") : translate("发送语音验证码")}
                        </Text>
                    </Touch>
                } */}
            </View>
        );
    }

    validateEmail(email) {
        const errorMessage = checkEmail(email);
        this.setState({ invalidEmailMessage: errorMessage });
    }

    validatePhone(phone) {
        const { error } = checkPhone(phone, [window.DefaultConfig?.countryCallingCode]);
        this.setState({ invalidPhoneMessage: error });
    }

    getPhonePrefixes = () => {
        fetchRequest(ApiPort.PhonePrefix, "GET").then(res => {
            if (res && res.result) {
                this.setState({
                    prefixes: res.result || [],
                });
            }
        });
    };

    getResendAttempt = async (type) => {
        await this.getAllVerifyTimes();
        const isVN = window.LANGUAGE == "VN";
        const isCN = window.LANGUAGE == "CN";

        if ((type == "SMS" && (
            (isVN && this.state.zaloVerifyTime > 0) ||
            (isCN && this.state.smsVerifyTime > 0) ||
            (!isVN && !isCN && (this.state.smsVerifyTime > 0 || this.state.voiceVerifyTime > 0))
        )) || (type == "Email" && this.state.emailVerifyTime > 0)) {
            this.getCustomFlag(type);
        } else {
            Toasts.removeAll();
            GetGlobalModal({
                title: translate("您已达到今日的 OTP 请求上限"),
                message: translate("请明天再试，或通过在线客服联系客服人员。"),
                confirmText: translate("明天再尝试"),
                onConfirm: () => {
                },
                cancelText: translate("联系在线客服4"),
                onCancel: () => { LiveChatOpenGlobe(); },
            });
        }
    };

    navigateToVerification = (type) => {
        const verificaType = type === "SMS" ? "phone" : "email"; // Default to "phone" if not "email"
        const isVN = window.LANGUAGE == "VN";
        const isCN = window.LANGUAGE == "CN";
        const isTH = window.LANGUAGE == "TH";
        let verificationMethod;

        if (isVN && type === "SMS") {
            verificationMethod = this.state.zaloVerifyTime > 0 ? "Zalo" : "SMS";
        } else if (type === "SMS") {
            verificationMethod = "SMS";
        } else {
            verificationMethod = "Email";
        }

        if (type === "Email" && this.state.emailVerifyTime > 0) {
            Actions.Verification({
                verificaType,
                verificationMethod: "Email",
                formPage: "profile",
                serviceAction: "ProfileVerification",
                getUser: () => {
                    this.getUser();
                },
                memberCode: this.state.memberCode,
                memberInfo: this.state.memberInfor,
                isEditingPhone: verificaType === "phone",
                isEditingEmail: verificaType === "email",
            });
        } else if (isVN && this.state.zaloVerifyTime > 0 && type === "SMS") {
            Actions.Verification({
                verificaType,
                verificationMethod: "Zalo",
                formPage: "profile",
                serviceAction: "ProfileVerification",
                getUser: () => {
                    this.getUser();
                },
                memberCode: this.state.memberCode,
                memberInfo: this.state.memberInfor,
                isEditingPhone: verificaType === "phone",
                isEditingEmail: verificaType === "email",
            });
        } else if (isCN && type === "SMS" && this.state.smsVerifyTime > 0) {
            Actions.Verification({
                verificaType,
                verificationMethod: "SMS",
                formPage: "profile",
                serviceAction: "ProfileVerification",
                getUser: () => {
                    this.getUser();
                },
                memberCode: this.state.memberCode,
                memberInfo: this.state.memberInfor,
                isEditingPhone: verificaType === "phone",
                isEditingEmail: verificaType === "email",
            });
        } else if (isTH && type === "SMS" && this.state.smsVerifyTime > 0) {
            Actions.Verification({
                verificaType,
                verificationMethod: "SMS",
                formPage: "profile",
                serviceAction: "ProfileVerification",
                getUser: () => {
                    this.getUser();
                },
                memberCode: this.state.memberCode,
                memberInfo: this.state.memberInfor,
                isEditingPhone: verificaType === "phone",
                isEditingEmail: verificaType === "email",
            });
        }
        else {
            Actions.Verification({
                verificaType,
                verificationMethod: this.state.verificationMethod,
                formPage: "profile",
                serviceAction: "ProfileVerification",
                getUser: () => {
                    this.getUser();
                },
                memberCode: this.state.memberCode,
                memberInfo: this.state.memberInfor,
                isEditingPhone: verificaType === "phone",
                isEditingEmail: verificaType === "email",
            });
        }
    };

    getCustomFlag = (type) => {
        fetchRequest(ApiPort.CustomFlag, "GET")
            .then(response => {
                if (response.isSuccess) {
                    const { isPhoneEditable, isEmailEditable } = response.result;
                    const isEditable = (type === "SMS" && isPhoneEditable) || (type === "Email" && isEmailEditable);
                    const newKycStatus = this.props.userInfo?.memberInfo?.newKycStatus;
                    const isKycStatusApproved = newKycStatus == "Approved";
                    const kycStatusModalTranslation = KycStatusModalTranslation[newKycStatus];

                    if (isEditable) {
                        if (isKycStatusApproved) {
                            this.getSumsubFaceVerification(type);
                        } else {
                            Toasts.removeAll();
                            GetGlobalModal({
                                title: kycStatusModalTranslation?.title,
                                message: kycStatusModalTranslation?.description,
                                confirmText: kycStatusModalTranslation?.okText,
                                onConfirm: () => {
                                    // Existing okFunction logic
                                    kycStatusModalTranslation?.okFunction();

                                    // Call MemberKycVerification if newKycStatus is "No"
                                    if (newKycStatus === "No") {
                                        fetchRequest(ApiPort.MemberKycVerification, "POST", {
                                            actionType: type === "SMS" ? "VerifyNewPhone" : "VerifyNewEmail",
                                        })
                                            .then(res => {
                                                if (res.isSuccess) {
                                                    this.props.userInfo_updateMemberInfo();
                                                }
                                            })
                                            .catch(err => {
                                                console.error("API call error:", err);
                                            });
                                    }
                                },
                                ...(kycStatusModalTranslation?.noText && {
                                    cancelText: kycStatusModalTranslation?.noText,
                                    onCancel: kycStatusModalTranslation?.noFunction,
                                })
                            });
                        }
                    } else {
                        Toasts.removeAll();
                        GetGlobalModal({
                            title: translate("账户安全提醒"),
                            message: translate("今天您已更改过一次，请明天再试。如果您认为您的账户可能已被盗用，请更改密码以及联系我们的在线客服。"),
                            confirmText: translate("明天再尝试"),
                            onConfirm: () => {},
                            cancelText: translate("联系在线客服4"),
                            onCancel: () => { LiveChatOpenGlobe(); },
                        });
                    }
                }
            })
            .catch(error => {
                Toasts.removeAll();
                Toasts.fail(translate("网络错误，请重试"), 3);
                console.error("Error retrieving custom flag:", error);
            });
    };

    getSumsubFaceVerification = async (type) => {
        const { userInfo } = this.props;
        const newKycStatus = userInfo?.memberInfo?.newKycStatus;

        if (newKycStatus === "No") {
            Toasts.removeAll();
            await this.getKycVerificationLink();
        }

        // Language mapping for Sumsub
        const sumsubLangMap = {
            CN: "zh",
            TH: "th",
            VN: "vi",
        };

        fetchRequest(ApiPort.SumsubToken, "POST", {
            type: "faceAuth",
            blackBoxValue: E2Backbox || "",
            actionType: type === "SMS" ? "VerifyNewPhone" : "VerifyNewEmail",
        })
            .then(res => {
                let actionIdFromLog = null;
                Toasts.removeAll();
                if (res?.isSuccess && res?.result?.token) {
                    Sumsub(
                        {
                            token: res.result.token,
                            lang: sumsubLangMap[window.LANGUAGE] || "zh",
                            theme: "light",
                            styleColor: getSumsubColors(),
                        },
                        () => Promise.resolve(res.result.token),
                        async (eventType, payload) => {
                            console.log("SumsubTokenResult", eventType, payload);
                            if (eventType === "onLaunch" && (payload?.status === "Approved" || payload?.status === "FinallyRejected") && payload?.actionId) {
                                actionIdFromLog = payload?.actionId;
                                console.log("[Sumsub] Extracted actionId:", actionIdFromLog);
                                this.verifyFaceAuth(actionIdFromLog, type);
                                this.props.userInfo_updateMemberInfo();
                            }
                        }
                    );
                } else if (res?.errors?.some(error => error.errorCode === "CPL10028")) {
                    Toasts.removeAll();
                    GetGlobalModal({
                        title: translate("账户异常需验证身份2"),
                        message: translate("查询到您的账户存在异常行为，需验证账户身份以确保账户安全和交易顺利。请前往“验证中心”上传所需文件以验证您的身份。2"),
                        confirmText: translate("马上验证2"),
                        onConfirm: () => {
                            Actions.UploadFile({
                                fromPage: "Profile",
                            });
                        },
                        cancelText: translate("稍后再说2"),
                        onCancel: () => {},
                    });
                }
            })
            .catch(err => {
                Toasts.removeAll();
                GetGlobalModal({
                    title: translate("系統异常"),
                    message: translate("该服务暂时不可用，请稍后再试。"),
                    confirmText: translate("晚点再尝试"),
                    onConfirm: () => {},
                    cancelText: translate("联系在线客服5"),
                    onCancel: () => { LiveChatOpenGlobe(); },
                });
                console.log("error", err);
            });
    };

    verifyFaceAuth = (actionId, type) => {
        fetchRequest(ApiPort.SumsubVerifyFaceAuth + `actionId=${actionId}&`, "POST", {
            blackBoxValue: E2Backbox || "",
            actionType: type === "SMS" ? "VerifyNewPhone" : "VerifyNewEmail",
        })
            .then(res => {
                if (res?.isSuccess) {
                    console.log("Face verification successful");
                    Actions.pop();
                    this.navigateToVerification(type);
                }
            })
            .catch(err => {
                Toasts.removeAll();
                Toasts.fail(translate("网络错误，请重试"), 3);
                console.error("Error during face verification:", err);
            });
    };

    render() {
        const { email, phone, getCodePhone, getCodeEmail, verificaType, verificationMethod, verification, CountdownPhone_minutes, CountdownEmail_minutes, prefixesMaxLength } = this.state;
        let { formPage = "", isEditingPhone, isEditingEmail } = this.props;
        const isZalo = verificationMethod == "Zalo";
        const isSMS = verificationMethod == "SMS";
        const isVoice = verificationMethod == "Voice";

        const getVerificationType = () => {
            if (isEditingPhone) return VerificationType.phoneEdit;
            if (isEditingEmail) return VerificationType.emailEdit;
            if (isZalo) return VerificationType.zalo;
            if (isSMS) return VerificationType.sms;
            if (isVoice) return VerificationType.voice;
            return VerificationType[this.state.verificaType];
        };

        const titles = getVerificationType();

        //5次错误
        // if (verification == false) {
        //     const {
        //         zaloVerifyTime = 0,
        //         smsVerifyTime = 0,
        //         voiceVerifyTime = 0,
        //         emailVerifyTime = 0,
        //     } = this.state;
        //     const isFromProfile = this.props.formPage === "profile";
        //     const isVN = window.LANGUAGE == "VN";
        //     // If from profile no need to check email
        //     const allAttemptUsed = isFromProfile
        //         ? isVN ? zaloVerifyTime == 0 && smsVerifyTime == 0 && voiceVerifyTime == 0 : smsVerifyTime == 0 && voiceVerifyTime == 0
        //         : isVN ? zaloVerifyTime == 0 && smsVerifyTime == 0 && voiceVerifyTime == 0 && emailVerifyTime == 0 : smsVerifyTime == 0 && voiceVerifyTime == 0 && emailVerifyTime == 0;
        //     return (
        //         isVN
        //             ?
        //             <ColumnCenterCenter style={styles.verificationFail}>
        //                 <WarningIcon width={65} height={65} fill={"#F5B200"} />
        //                 <Text style={styles.verificationFailTitle}>{translate(allAttemptUsed ? "您今天已达OTP请求上限" : "您已经达到通过{{X}}接收OTP的限制", { X: verificationMethod })}</Text>
        //                 <CustomLinkText
        //                     textAlign="center"
        //                     norMaltextStyle={{
        //                         fontSize: 14,
        //                         color: "#222222",
        //                     }}
        //                     themeTextStyle={{ fontSize: 14 }}
        //                     onPressList={[LiveChatOpenGlobe]}
        //                     text={translate(allAttemptUsed ? "请于明日再试，或通过{在线客服}联系我们" : "请尝试其他验证方式")}
        //                 />

        //                 {
        //                     isVN &&
        //                     <FilledButton
        //                         onPress={() => {
        //                             if (allAttemptUsed || verificaType == "email") {
        //                                 Actions.pop();
        //                             } else {
        //                                 Actions.pop();
        //                                 Actions.MobileVerificationMethod({
        //                                     memberInfo: this.state.memberInfo,
        //                                     from: this.props.formPage,
        //                                     serviceAction: this.state.serviceAction,
        //                                     isEditingPhone: this.props.isEditingPhone,
        //                                     isEditingEmail: this.props.isEditingEmail,
        //                                 });
        //                             }
        //                         }}
        //                         text={allAttemptUsed || !isVN ? translate("关闭") : translate("尝试其他方式")}
        //                     />
        //                 }
        //             </ColumnCenterCenter>

        //             :
        //             <ColumnCenterCenter style={styles.verificationFail}>
        //                 <WarningIcon width={65} height={65} fill={"#F5B200"} />
        //                 <Text style={styles.verificationFailTitle}>{translate("您已经超过5次尝试")}</Text>

        //                 <CustomLinkText
        //                     textAlign="center"
        //                     norMaltextStyle={{
        //                         fontSize: 14,
        //                         color: "#222222",
        //                     }}
        //                     themeTextStyle={{ fontSize: 14 }}
        //                     onPressList={[LiveChatOpenGlobe]}
        //                     text={translate("您已超过5次尝试, 请24小时之后再试。\n或联系我们的{在线客服}进行验证")}
        //                 />
        //             </ColumnCenterCenter>

        //     );
        // }

        return (
            <View style={styles.viewContainer}>
                <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}>
                    <WhiteSpace size="lg" />
                    <WhiteSpace size="lg" />

                    {(formPage == "Recommend" || formPage == "Referee" || formPage == "reSetPwd") && <StepProgressBar step={1}></StepProgressBar>}

                    <View>
                        <View style={styles.pageInforBox}>
                            <Text style={styles.pageInforTitle}>{translate(titles.title)}</Text>
                            <Text style={styles.pageInforText}>{translate(titles.txt1)}</Text>
                        </View>
                        <Text style={styles.verificationTypeText}>{translate(titles.txt2)}</Text>
                        {verificaType == "email" && (
                            <>
                                <View style={[styles.verificationNumBox, this.state.invalidEmailMessage && isEditingEmail && { borderColor: "#F15858", borderWidth: 1 }]}>
                                    {isEditingEmail ? (
                                        <TextInput
                                            style={styles.textInput}
                                            value={getCodeEmail === 1 ? email : maskEmail(email)} // Use maskEmail when getCodeEmail is not 1
                                            placeholder={translate("请输入新的电子邮箱")}
                                            placeholderTextColor="#BCBEC3"
                                            keyboardType="email-address"
                                            maxLength={50}
                                            textContentType="emailAddress"
                                            onBlur={() => this.validateEmail(email)} // Add validation on blur
                                            onChangeText={(text) => this.setState({ email: text })}
                                            editable={getCodeEmail == 1}
                                        />
                                    ) : (
                                        <RowStartBetween>
                                            <Text style={styles.verificationNumText}>{email}</Text>
                                            {this.props.formPage == "profile" && <Touch onPress={() => {
                                                Toasts.loading(translate("加载中,请稍候..."), 10);
                                                this.getResendAttempt("Email");
                                            }}>
                                                <EditIcon width={24} height={24} fill="#666666" />
                                            </Touch>}
                                        </RowStartBetween>
                                    )}
                                </View>
                                {this.state.invalidEmailMessage && isEditingEmail && (
                                    <Text style={styles.errorText}>{translate("邮件地址不正确，请重新输入")}</Text>
                                )}
                            </>
                        )}
                        {verificaType == "phone" && (
                            <>
                                <RowCenterBetween>
                                    <ColumnCenterCenter style={styles.phoneCountry}>
                                        <Text style={styles.verificationNumText}>+{window.DefaultConfig?.countryCallingCode}</Text>
                                    </ColumnCenterCenter>
                                    <View
                                        style={[
                                            styles.verificationNumBox,
                                            { width: width - 30 - 44 - 15 },
                                            this.state.invalidPhoneMessage && isEditingPhone && { borderColor: "#F15858", borderWidth: 1 }
                                        ]}
                                    >
                                        {isEditingPhone ? (
                                            <TextInput
                                                style={styles.textInput} // Add appropriate styles
                                                value={getCodePhone === 1 ? phone : maskPhone4(phone)}
                                                placeholder={translate("请输入新的手机号码")}
                                                placeholderTextColor="#BCBEC3"
                                                keyboardType="phone-pad"
                                                maxLength={getCodePhone === 1 ? prefixesMaxLength : 15}
                                                textContentType="telephoneNumber"
                                                onBlur={() => this.validatePhone(phone)} // Add validation on blur
                                                onChangeText={(text) => this.setState({ phone: text })}
                                                editable={getCodePhone == 1}
                                            />
                                        ) : (
                                            <RowStartBetween>
                                                <Text style={styles.verificationNumText}>{phone}</Text>
                                                {this.props.formPage == "profile" && <Touch onPress={() => {
                                                    Toasts.loading(translate("加载中,请稍候..."), 10);
                                                    this.getResendAttempt("SMS");
                                                }}>
                                                    <EditIcon width={24} height={24} fill="#666666" />
                                                </Touch>}
                                            </RowStartBetween>

                                        )}
                                    </View>

                                </RowCenterBetween>
                                {this.state.invalidPhoneMessage && isEditingPhone && (
                                    <Text style={styles.errorText}>{translate("手机号码不正确，请重新输入")}</Text>
                                )}
                            </>
                        )}

                        {/* {titles.txt3 && (
                                <CustomLinkText
                                    text={translate(titles.txt3)}
                                    wrapStyle={styles.liveBox}
                                    themeTextStyle={{
                                        textDecorationLine: "underline",
                                    }}
                                    onPressList={[
                                        () => {
                                            LiveChatOpenGlobe();
                                            if (formPage === "loginOTP" || formPage === "reSetPwd") {
                                                if (this.state.verificaType == "phone") {
                                                    PiwikEventDataHandle(`${formPage}5`);
                                                } else {
                                                    PiwikEventDataHandle(`${formPage}8`);
                                                }
                                            }
                                        },
                                    ]}
                                />
                            )} */}

                        {verificaType == "email" &&
                            <>
                                {getCodeEmail == 1 && (
                                    <FilledButton
                                        text={translate("发送")}
                                        onPress={() => {
                                            // Validate email before getting the code
                                            isEditingEmail && this.validateEmail(email);
                                            if (!this.state.invalidEmailMessage) {
                                                this.getCode("Email");
                                            }
                                        }}
                                        wrapStyle={{ marginTop: 25 }}
                                    />
                                )}

                                {getCodeEmail == 2 &&
                                    <FilledButton
                                        text={`${translate("重新发送验证码")} ${CountdownEmail_minutes}`}
                                        enable={false}
                                        wrapStyle={{ marginTop: 10 }}
                                    />
                                }

                                {getCodeEmail == 3 &&
                                    <Touch
                                        onPress={() => {
                                            this.getCode("Email");
                                        }}
                                        style={styles.getCodeBtn}>
                                        <Text style={styles.getCodeBtnText}>{translate("重新发送验证码1")}</Text>
                                    </Touch>
                                }

                                {getCodeEmail > 1 && this.createVerifica()}
                            </>
                        }

                        {verificaType == "phone" && (
                            <>
                                {getCodePhone == 1 && (
                                    <View style={{ marginTop: 15 }}>
                                        {(() => {
                                            const verificationMethods = {
                                                Zalo: {
                                                    type: "Zalo",
                                                    text: translate("发送Zalo验证码"),
                                                    image: ImagesUrl.verificationZalo
                                                },
                                                SMS: {
                                                    type: "SMS",
                                                    text: translate("发送短信验证码"),
                                                },
                                                Voice: {
                                                    type: "Voice",
                                                    text: translate("发送语音验证码"),
                                                }
                                            };

                                            const currentMethod = isZalo ? "Zalo" : isSMS ? "SMS" : "Voice";
                                            const method = verificationMethods[currentMethod];

                                            return (
                                                <RowCenterCenter
                                                    onPress={() => {
                                                        if (isEditingPhone) {
                                                            const { phone, prefixes } = this.state;
                                                            const { error, prefixesMaxLength } = checkPhone(phone, prefixes);
                                                            this.setState({ invalidPhoneMessage: error, prefixesMaxLength });

                                                            if (!error) {
                                                                this.getCode(method.type); // Proceed with getCode if valid
                                                            }
                                                        } else {
                                                            this.getCode(method.type); // Directly proceed with getCode
                                                        }
                                                    }}
                                                    style={[styles.getCodeBtn]}
                                                >
                                                    {method.image && <Image source={method.image} style={{ width: 20, height: 20, marginRight: 10 }} resizeMode="contain" />}
                                                    <Text style={styles.getCodeBtnText}>{method.text}</Text>
                                                </RowCenterCenter>
                                            );
                                        })()}
                                    </View>
                                )}

                                {getCodePhone == 2 &&
                                    <FilledButton
                                        text={`${translate("重新发送验证码")} ${CountdownPhone_minutes}`}
                                        enable={false}
                                        wrapStyle={{ marginTop: 10 }}
                                    />
                                }

                                {getCodePhone == 3 &&
                                    <Touch
                                        onPress={() => {
                                            this.getCode(this.state.smsType);
                                        }}
                                        style={[styles.getCodeBtn]}>
                                        <Text style={[styles.getCodeBtnText]}>{isZalo ? translate("发送Zalo验证码") : translate("重新发送验证码1")}</Text>
                                    </Touch>
                                }

                                {getCodePhone > 1 && this.createVerifica()}

                                {!(formPage == "loginOTP" || formPage == "reSetPwd") && window.LANGUAGE != "CN" &&
                                    <Touch
                                        onPress={() => {
                                            Actions.pop();
                                            Actions.MobileVerificationMethod({
                                                memberInfo: this.state.memberInfo,
                                                from: this.props.formPage,
                                                serviceAction: this.state.serviceAction,
                                                isEditingPhone: this.props.isEditingPhone,
                                                isEditingEmail: this.props.isEditingEmail,
                                            });
                                        }}
                                        style={{ backgroundColor: "transparent", marginTop: 15 }}
                                    >
                                        <Text style={[styles.getCodeBtnText, { color: "#00A6FF" }]}>{translate("更换验证方式")}</Text>
                                    </Touch>
                                }
                            </>
                        )}

                        {(formPage == "Recommend" || formPage == "Referee") &&
                            <UnderlinedButton
                                text={translate("跳过验证")}
                                onPress={() => {
                                    Actions.pop();

                                }}
                                wrapStyle={{ marginTop: 50 }}
                            />
                        }

                        {(formPage == "loginOTP" || formPage == "reSetPwd") &&
                            <Touch
                                style={{ backgroundColor: "transparent", marginTop: 30 }}
                                onPress={() => {
                                    if (window.LANGUAGE == "VN") {
                                        Actions.pop();
                                        Actions.MobileVerificationMethod({
                                            memberInfo: this.state.memberInfo,
                                            from: this.props.formPage,
                                            serviceAction: this.state.serviceAction,
                                            isEditingPhone: this.props.isEditingPhone,
                                            isEditingEmail: this.props.isEditingEmail,
                                        });
                                    } else {
                                        this.changType();
                                    }
                                }}
                            >
                                <Text style={[styles.getCodeBtnText, { color: "#00A6FF" }]}>{translate("更换验证方式")}</Text>
                            </Touch>
                        }
                    </View>
                </KeyboardAwareScrollView>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        userInfo: state.userInfo,
    };
};

const mapDispatchToProps = dispatch => ({
    userInfo_updateMemberInfo: data => dispatch(actions.ACTION_UserInfo_updateMemberInfo(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Verification);

const styles = StyleSheet.create({
    getCodeBtn: {
        backgroundColor: "#00a6ff",
        borderRadius: 10,
        marginTop: 10,
        width: "100%",
        height: 44,
        borderWidth: 1,
        borderColor: "#00a6ff",
        alignItems: "center",
        justifyContent: "center",
    },
    getCodeBtnText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold",
    },
    verificationFail: {
        flex: 1,
        backgroundColor: "#fff",
        marginTop: -150,
        paddingHorizontal: 20,
    },
    verificationFailTitle: {
        fontSize: 20,
        color: "#222222",
        paddingTop: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
    viewContainer: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 15,
    },
    pageInforBox: {
        borderBottomColor: "#c4c4c4",
        borderBottomWidth: 1,
    },
    pageInforTitle: {
        color: "#171717",
        fontSize: 18,
        fontWeight: "bold",
    },
    pageInforText: {
        color: "#999",
        paddingTop: 12,
        paddingBottom: 15,
    },
    verificationTypeText: {
        paddingTop: 15,
        paddingBottom: 8,
        color: "#2D2D2D",
    },
    verificationNumBox: {
        borderRadius: 10,
        backgroundColor: "#efeff4",
        paddingHorizontal: 15,
        height: 44,
        justifyContent: "center",
    },
    verificationNumText: {
        color: "#000000",
    },
    phoneCountry: {
        borderRadius: 10,
        backgroundColor: "#efeff4",
        width: 44,
        height: 44,
    },
    liveBox: {
        borderRadius: 10,
        backgroundColor: "#F7F7FC",
        marginTop: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    inputContainer: {
        paddingHorizontal: 10,
        paddingVertical: 15,
        backgroundColor: "#EFEFF4",
        borderRadius: 10,
        marginTop: 15,
    },
    inputContainerTitle: {
        color: "#000",
        fontSize: 12,
        textAlign: "center",
        marginBottom: 15,
        fontWeight: "600",
    },
    textInput: {
        flex: 1,
        color: "#000000",
        fontSize: 16,
        paddingVertical: 0,
        paddingHorizontal: 0,
    },
    errorText: {
        color: "#F15858",
        fontSize: 12,
        fontWeight: "400",
        marginTop: 5,
    },
});
