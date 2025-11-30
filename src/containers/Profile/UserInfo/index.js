import React from "react";
import { ScrollView, Text, View } from "react-native";
import Touch from "react-native-touch-once";
import { connect } from "react-redux";

import Color from "$Components/Color";
import { RowCenterCenter } from "$Components/CustomView";
import { ArrowIcon, SuccessIcon, WarningIcon } from "$Components/icons/index.js";
import { translate } from "$locales/translate";
import { Actions } from "react-native-router-flux";
import { GetGlobalModal } from "$Utils/globalModal";
import { LiveChatOpenGlobe } from "$Utils";
import Sumsub from "central-kyc-sumsub/SumsubNative";
import actions from "$LIB/redux/actions/index";
import { Toasts } from "$Toasts";
import { getSumsubColors } from "@/containers/Profile/UploadFile/data";

import { UserInfoData, FilterList, KycStatusModalTranslation } from "./../data";
import Styles from "./Styles";

class UserInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            zaloAttempts: 0,
            smsAttempts: 0,
            voiceAttempts: 0,
            emailAttempts: 0,
        };
    }

    async componentDidMount(props) {
        // 首次進入頁面時顯示載入中，等待檢查完成
        Toasts.loading(translate("加载中,请稍候..."), 2000);
        try {
            await this.checkResendAttempt();
        } finally {
            Toasts.removeAll();
        }
    }

    async checkResendAttempt() {
        try {
            let processed = ["SMS", "Voice", "Zalo", "Email"].map(v =>
                fetchRequest(ApiPort.ResendAttempt + `?serviceAction=ProfileVerification&channelType=${v}&`, "GET")
            );

            const res = await Promise.all(processed);

            if (Array.isArray(res) && res.length) {
                let smsAttempts = res[0]?.isSuccess ? (res[0]?.result?.count || res[0]?.result) : 0;
                let voiceAttempts = res[1]?.isSuccess ? (res[1]?.result?.count || res[1]?.result) : 0;
                let zaloAttempts = res[2]?.isSuccess ? (res[2]?.result?.count || res[2]?.result) : 0;
                let emailAttempts = res[3]?.isSuccess ? (res[3]?.result?.count || res[3]?.result) : 0;

                this.setState({
                    smsAttempts,
                    voiceAttempts,
                    zaloAttempts,
                    emailAttempts
                });
            }
        } catch (err) {
            console.error("Error checking verification attempts:", err);
            // Set attempts to 0 on error
            this.setState({
                smsAttempts: 0,
                voiceAttempts: 0,
                zaloAttempts: 0,
                emailAttempts: 0
            });
        }
    }

    handlePhoneVerification = async () => {
        await this.checkResendAttempt();

        if (window.LANGUAGE == "VN" && this.state.zaloAttempts > 0) {
            Actions.Verification({
                dataPhone: this.state.phone,
                dataEmail: this.state.email,
                verificaType: "phone",
                verificationMethod: "Zalo",
                memberCode: this.state.memberCode,
                noMoreverifcation: false,
                formPage: "profile",
                getUser: () => {
                    this.getUser();
                },
                serviceAction: "ProfileVerification",
                memberInfo: this.state.memberInfor,
            });
        }
        // if other method also exceed attempt limit
        else if (this.state.smsAttempts == 0 && (window.LANGUAGE == "CN" ? true : this.state.voiceAttempts == 0)) {
            GetGlobalModal({
                title: translate("您已达到今日的 OTP 请求上限"),
                message: translate("请明天再试，或通过在线客服联系客服人员。"),
                confirmText: translate("明天再尝试"),
                onConfirm: () => {
                },
                cancelText: translate("联系在线客服4"),
                onCancel: () => { LiveChatOpenGlobe(); },
            });
        } else if (window.LANGUAGE == "CN" && this.state.smsAttempts > 0) {
            Actions.Verification({
                dataPhone: this.state.phone,
                dataEmail: this.state.email,
                verificaType: "phone",
                verificationMethod: "SMS",
                memberCode: this.state.memberCode,
                noMoreverifcation: false,
                formPage: "profile",
                getUser: () => {
                    this.getUser();
                },
                serviceAction: "ProfileVerification",
                memberInfo: this.state.memberInfor,
            });
        }
        else if (window.LANGUAGE == "TH" && this.state.smsAttempts > 0) {
            Actions.Verification({
                dataPhone: this.state.phone,
                dataEmail: this.state.email,
                verificaType: "phone",
                verificationMethod: "SMS",
                memberCode: this.state.memberCode,
                noMoreverifcation: false,
                formPage: "profile",
                getUser: () => {
                    this.getUser();
                },
                serviceAction: "ProfileVerification",
                memberInfo: this.state.memberInfor,
            });
        }
        else {
            Actions.MobileVerificationMethod({
                memberInfo: this.state.memberInfor,
                from: "profile",
                serviceAction: "ProfileVerification"
            });
        }
    };

    getResendAttempt = async (type) => {
        await this.checkResendAttempt();
        const isVN = window.LANGUAGE == "VN";
        const isCN = window.LANGUAGE == "CN";

        if ((type == "SMS" && (
            (isVN && this.state.zaloAttempts > 0) ||
            (isCN && this.state.smsAttempts > 0) ||
            (!isVN && !isCN && (this.state.smsAttempts > 0 || this.state.voiceAttempts > 0))
        )) || (type == "Email" && this.state.emailAttempts > 0)) {
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
            verificationMethod = this.state.zaloAttempts > 0 ? "Zalo" : "SMS";
        } else if (type === "SMS") {
            verificationMethod = "SMS";
        } else {
            verificationMethod = "Email";
        }

        console.log("12345!!!!", isTH, this.state.smsAttempts, type);

        if (type === "Email" && this.state.emailAttempts > 0) {
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
        } else if (isVN && this.state.zaloAttempts > 0 && type === "SMS") {
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
        } else if (isCN && type === "SMS" && this.state.smsAttempts > 0) {
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
        } else if (isTH && type === "SMS" && this.state.smsAttempts > 0) {
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
            Actions.MobileVerificationMethod({
                memberInfo: this.state.memberInfor,
                from: "profile",
                serviceAction: "ProfileVerification",
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
                        }
                        else {
                            Toasts.removeAll();
                            GetGlobalModal({
                                title: kycStatusModalTranslation?.title,
                                message: kycStatusModalTranslation?.description,
                                confirmText: kycStatusModalTranslation?.okText,
                                onConfirm: () => {
                                    // Existing okFunction logic
                                    kycStatusModalTranslation?.okFunction();

                                    // New API call only when newKycStatus is "No"
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
                if (res?.isSuccess && res?.result?.token) {
                    Toasts.removeAll();
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
                                this.verifyFaceAuth(actionIdFromLog, type);
                                this.props.userInfo_updateMemberInfo();
                                console.log("[Sumsub] Extracted actionId:", actionIdFromLog);
                            }

                            // if (eventType === "onStatusChanged") {
                            //     const status = payload?.newStatus;
                            //     console.log("[Sumsub] Status changed:", status);

                            //     if ((status === "Approved" && actionIdFromLog)) {
                            //         console.log("[Sumsub] Verified successfully, now calling verifyFaceAuth", actionIdFromLog);
                            //         this.verifyFaceAuth(actionIdFromLog, type);
                            //         this.props.userInfo_updateMemberInfo();
                            //     }
                            // }
                        }
                    );
                } else if (res?.errors?.some(error => error.errorCode === "CPL10028")) {
                    Toasts.removeAll();
                    GetGlobalModal({
                        title: translate("账户异常需验证身份"),
                        message: translate("查询到您的账户存在异常行为，需验证账户身份以确保账户安全和交易顺利。请前往“验证中心”上传所需文件以验证您的身份。"),
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
                    // Navigate to respective page
                    this.navigateToVerification(type);
                }
            })
            .catch(err => {
                console.error("Error during face verification:", err);
                Toasts.removeAll();
                Toasts.fail(translate("网络错误，请重试"), 3);
            });
    };

    render() {
        let memberInfo = this.props?.userInfo?.memberInfo;

        let { userName = "", memberCode, firstName = "", gender = "", dob = "", documentID = "", identityCard = "", contacts = [] } = memberInfo || {};

        let tempEmail = contacts.find(v => v.contactType.toLocaleLowerCase() === "email");
        let email = tempEmail ? tempEmail.contact : "";
        let tempPhone = contacts.find(v => v.contactType.toLocaleLowerCase() === "phone");
        let phone = tempPhone ? tempPhone.contact : "";

        let phoneStatus = !memberInfo?.phoneStatus;
        let emailStatus = !memberInfo?.emailStatus;

        let tempTelegram = contacts.find(v => v.contactType.toLocaleLowerCase() === "telegram" || v.contactType.toLocaleLowerCase() == 15);
        let telegram = tempTelegram?.contact || "";

        let tempFacebook = contacts.find(v => v.contactType.toLocaleLowerCase() === "facebook" || v.contactType.toLocaleLowerCase() == 14);
        let facebook = tempFacebook?.contact || "";

        let tempLine = contacts.find(v => v.contactType.toLocaleLowerCase() === "line" || v.contactType.toLocaleLowerCase() == 9);
        let line = tempLine?.contact || "";

        const qq = contacts.find(item => item.contactType == "QQ")?.contact || "";
        const weChat = contacts.find(item => item.contactType == "WeChat")?.contact || "";

        dob = dob?.toLocaleUpperCase().split("T")[0];

        const UserInfor = {
            firstName,
            dob,
            gender,
            identityCard,
            userName: userName,
            memberCode: memberCode,
            phone: phone,
            email: email,
            changePWD: "",
            contact: "",
            telegram: telegram,
            language: translate("中文"),
            currency: translate("人民币"),
            securityQuestion: "",
            documentID,
            qq,
            weChat,
            facebook,
            line,
        };

        return (
            <View style={Styles.viewContainer}>
                <ScrollView>
                    {
                        UserInfoData.map((v1, i1) => {
                            return (
                                <View key={i1} style={{ marginTop: 18 }}>
                                    <Text style={Styles.inputTitle}>{translate(v1.title)}</Text>

                                    <View style={[Styles.commonWrap, Styles.commonWrapIndex]}>
                                        {
                                            v1.data.filter(FilterList).map((v, i) => {
                                                let { text = "", type = "", rightText, rightCallBack, renderRight, allowEdit = false } = v;
                                                let value = UserInfor[type];
                                                let status = type == "phone" ? phoneStatus : emailStatus;
                                                let Tag = ["phone", "email"].includes(type) ?
                                                    (Touch) :
                                                    (allowEdit ? Touch : (Boolean(value) ? View : Touch));
                                                let resendAttemptType = type == "phone" ? "SMS" : "Email";

                                                return (
                                                    <Tag
                                                        style={Styles.listContentWrap}
                                                        key={i}
                                                        onPress={() => {
                                                            if ((type == "phone" || type == "email") && status === false) {
                                                                Toasts.loading(translate("加载中,请稍候..."), 10);
                                                                this.getResendAttempt(resendAttemptType);
                                                            } else if (type == "phone") {
                                                                console.log("handlePhoneVerification");
                                                                this.handlePhoneVerification();
                                                            } else {
                                                                rightCallBack({ type });
                                                            }
                                                        }}>
                                                        <Text style={Styles.listLeftTitle}>{translate(text)}</Text>

                                                        {
                                                            renderRight({ status, value })
                                                        }
                                                    </Tag>
                                                );
                                            })
                                        }
                                    </View>

                                    {
                                        i1 == 0 && <Text style={Styles.tipText}>{translate("姓名/身份证号码/出生日期/性别只允许更新一次，更新后无法再做修改。")}</Text>
                                    }
                                </View>
                            );
                        })
                    }
                    <View style={{ height: 80 }}></View>
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    userInfo: state.userInfo,
});

const mapDispatchToProps = dispatch => ({
    userInfo_updateMemberInfo: data => dispatch(actions.ACTION_UserInfo_updateMemberInfo(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserInfo);
