import React from "react";
import ImageMap from "@/locales/Images";

import moment from "moment";
import { Linking, Platform, StyleSheet, View, Text } from "react-native";
import { Actions } from "react-native-router-flux";

import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import { IdentityCardReg, LineReg, QqReg, TelegramReg } from "@/actions/Reg";
import { GetGlobalModal } from "$Utils/globalModal";
import { ImagesUrl } from "@/images/index";
import store from "@/lib/redux/store/index.js";
import RegMap from "@/locales/Reg";
import { translate } from "$locales/translate";
import { LiveChatOpenGlobe, GetDownloadUrl, GoSmartico } from "$Utils";
import { ColumnCenterCenter, RowCenterCenter, RowCenterBetween, RowCenterStart, ColumnCenterStart } from "$Components/CustomView";
import {
    ArrowIcon, SuccessIcon, WarningIcon, VnIcon, CnIcon, ThIcon, DiamondIcon, StarIcon, CrownIcon, MaintenanceIcon,
    UserRuleIcon, AboutUsdtIcon, SponsorIcon, UnionIcon, UserInforIcon, PromotionsAddressIcon, BankCardIcon, SelfExclusionIcon, SecurityCodeIcon, UploadFileIcon, SetLoginIcon, DownloadAppIcon, VersionIcon, ContactcsIcon, LanguageSettingIcon,
    DepositIcon,
    DiamondClubIcon,
    FriendIcon,
    KingClubIcon,
    NewsIcon,
    RecordesIcon,
    WithdrawalIcon,
    LevelIdIcon,
    LevelPhoneIcon,
    LevelMailIcon,
} from "$Components/icons/index.js";





export function FilterList(item) {
    return __DEV__
        ? true
        : Array.isArray(item.language) && item.language.length
            ? item.language.includes(window.LANGUAGE)
            : true;
}

export const FianceLists = [
    {
        text: "存款",
        needLogin: true,
        img: "DepositIcon",
        callBack: ({ from = "" }) => {
            Actions.DepositCenter();

            let flag = from == "home";
            flag ? PiwikEventDataHandle("HomePage2") : PiwikEventDataHandle("MemberCenter14");
        },
    },
    {
        text: "提款",
        needLogin: true,
        img: "WithdrawalIcon",
        callBack: ({ from = "" }) => {
            Actions.Withdrawal();

            let flag = from == "home";
            flag ? PiwikEventDataHandle("HomePage4") : PiwikEventDataHandle("MemberCenter16");
        },
    },
];

export const MangerListsTopArr = [
    ...FianceLists,
    {
        text: "交易记录",
        needLogin: true,
        img: "RecordesIcon",
        callBack: () => {
            Actions.Recordes({
                reportType: "deposit",
            });
            PiwikEventDataHandle("MemberCenter17");
        },
    },
    {
        text: "通知中心",
        needLogin: true,
        img: "NewsIcon",
        callBack: ({ getMessageCount }) => {
            Actions.News({
                getMessageCount: () => {
                    getMessageCount?.();
                },
            });
            PiwikEventDataHandle("MemberCenter18");
        },
        key: "news",
        renderRight: ({ unreadTotalCount = 0 }) => {
            return unreadTotalCount > 0 && <RowCenterCenter
                style={[
                    styles.news,
                    {
                        paddingHorizontal: unreadTotalCount?.length > 1 ? 2 : 5,
                    },
                ]}>
                <Text style={styles.unreadCountText}>{unreadTotalCount}</Text>
            </RowCenterCenter>;
        }
    },
    {
        text: "天王俱乐部",
        needLogin: false,
        img: "KingClubIcon",
        callBack: () => {
            GoSmartico({
                isLoginCallBack: true,
                //deepLink: "dp:gf_store",
            });
            PiwikEventDataHandle("RewardPage");
        },
        // renderRight: () => {
        //     let KingColor = {
        //         CN: "#fff",
        //         TH: "#836915",
        //         VN: "#836915"
        //     };
        //     return window.LANGUAGE != "VN" && <View style={styles.kingClubView}>
        //         <Text style={[styles.kingClubText, { color: KingColor[window.LANGUAGE] }]}>{translate("新品")}</Text>
        //     </View>;
        // }
        renderRight: () => {
            let isMaintenance = !store.getState()?.userSetting?.cmsMainsiteStatus?.smarticoIsActive || false;
            return isMaintenance && <View style={styles.maintenanceView}>
                <MaintenanceIcon width={12} height={12} />
            </View>;
        }
    },
    {
        text: "VIP 俱乐部",
        needLogin: false,
        img: "DiamondClubIcon",
        callBack: () => {
            Actions.VIP();
            PiwikEventDataHandle("MemberCenter19");
        },
    },
    {
        text: "推荐好友",
        needLogin: false,
        img: "FriendIcon",
        callBack: ({ goRecommend }) => {
            goRecommend?.();
            PiwikEventDataHandle("MemberCenter23");
        },
    },
];

const MangerListsArr1 = [
    {
        text: "USDT介绍",
        needLogin: false,
        img: "AboutUsdtIcon",
        callBack: () => {
            Actions.AboutUSDT();
            PiwikEventDataHandle("MemberCenter27");
        },
        // language: ["CN"],
    },
    {
        text: "赞助伙伴",
        needLogin: false,
        img: "SponsorIcon",
        callBack: () => {
            Actions.Sponsor();
            PiwikEventDataHandle("MemberCenter21");
        },
    },
    {
        text: "联盟合作",
        needLogin: false,
        img: "UnionIcon",
        callBack: () => {
            PiwikEventDataHandle("MemberCenter22");
            let agentUrl = store.getState()?.userSetting?.cmsMainsiteStatus?.affiliateUrl || `https://www.h32lucky.com/${window.DefaultConfig?.Culture}/`;
            GetGlobalModal({
                title: translate("温馨提醒"),
                message: translate("页面将会开启另一个窗口"), // https://arcadie.atlassian.net/issues/FSC-624
                cancelText: translate("取消"),
                onCancel: () => {},
                confirmText: translate("确定"),
                onConfirm: () => {
                    Linking.openURL(agentUrl);
                },
            });
        },
    },
];
const MangerListsArr2 = [
    {
        text: "账户资料",
        needLogin: true,
        img: "UserInforIcon",
        callBack: () => {
            Actions.UserInfor();
            PiwikEventDataHandle("MemberCenter1");
        },
    },
    {
        text: "收货地址",
        needLogin: true,
        img: "PromotionsAddressIcon",
        callBack: () => {
            Actions.PromotionsAddress({

            });
            PiwikEventDataHandle("MemberCenter2");
        },
        //language: ["TH", "VN"],
    },
    {
        text: "银行信息",
        needLogin: true,
        img: "BankCardIcon",
        callBack: () => {
            if (window.LANGUAGE == "TH") {
                if (store.getState()?.userInfo?.memberInfo?.firstName) {
                    Actions.BankCard();
                } else {
                    Actions.UserUpdateInfo({
                        updateType: "firstName",
                        formPage: "bankInfo",
                        callBack: () => {
                            Actions.BankCard();
                        }
                    });
                }
            } else {
                Actions.BankCard();
            }

            PiwikEventDataHandle("MemberCenter3");
        },
    },
    {
        text: "自我限制",
        needLogin: true,
        img: "SelfExclusionIcon",
        callBack: () => {
            Actions.SelfExclusion();
            PiwikEventDataHandle("MemberCenter4");
        },
    },
    {
        text: "创建安全码",
        needLogin: true,
        img: "SecurityCodeIcon",
        callBack: () => {
            Actions.SecurityCode();
            PiwikEventDataHandle("MemberCenter5");
        },
    },
    {
        text: "验证中心",
        needLogin: true,
        img: "UploadFileIcon",
        callBack: () => {
            Actions.UploadFile({
                fromPage: "Profile",
            });
            PiwikEventDataHandle("MemberCenter6");
        },
        renderRight: () => {
            const isPendingKycStatus = store.getState()?.userInfo?.memberInfo?.newKycStatus == "Pending";
            const isRejectedKycStatus = store.getState()?.userInfo?.memberInfo?.newKycStatus == "Rejected";

            return (isPendingKycStatus || isRejectedKycStatus) && <RowCenterCenter>
                <WarningIcon width={20} height={20} fill="#FFAC0A" />
                <Text style={styles.warningText}>{translate(isRejectedKycStatus ? "重新验证" : "去验证")}</Text>
            </RowCenterCenter>;
        },
    },
];
const MangerListsArr3 = [
    {
        text: Platform.OS == "ios" ? "脸部辨识快速登录" : "快速登入",
        needLogin: true,
        img: "SetLoginIcon",
        get otherText() {
            return "";
        },
        callBack: ({ setFastLogin }) => {
            setFastLogin?.();
            PiwikEventDataHandle("MemberCenter7");
        },
        key: "fastLogin",
        renderRight: ({ faceLogin }) => {
            return <Text style={{ color: "#999999", marginRight: 10 }}>{Platform.OS === "ios" && ApiPort.UserLogin && (faceLogin ? translate("启用") : translate("关闭2"))}</Text>;
        }
    },
    // {
    //     text: "下载App",
    //     needLogin: false,
    //     img: "DownloadAppIcon",
    //     callBack: () => {
    //         GetDownloadUrl();

    //         PiwikEventDataHandle("MemberCenter8");
    //     },
    // },
    // https://cloudmiicorph011-my.sharepoint.com/:p:/g/personal/tsai_ellen_ogglobal_net/EVyuWsHsQl5Bq8971KZN6-QB-i_Pyl9u-1_vFUTCkp_ymg?e=ybVfU8&ovuser=5fe9dbda-6ad3-4988-b970-d9ddd3928ff2%2Cwinter.lu%40ogglobal.net&clickparams=eyJBcHBOYW1lIjoiVGVhbXMtRGVza3RvcCIsIkFwcFZlcnNpb24iOiIxNDE1LzI1MDcxNzE0ODE1IiwiSGFzRmVkZXJhdGVkVXNlciI6ZmFsc2V9
    // slide 11
    {
        text: "版本更新",
        key: "version",
        needLogin: false,
        img: "VersionIcon",
        get otherText() {
            return " " + window.Rb88Version;
        },
        callBack: () => {
            window.CheckUptateGlobe && window.CheckUptateGlobe(true);
            PiwikEventDataHandle("MemberCenter10");
        },
    },
    {
        text: "条款与规则",
        needLogin: false,
        img: "UserRuleIcon",
        callBack: () => {
            Actions.UserRule();
            PiwikEventDataHandle("MemberCenter26");
        },
    },
    {
        text: "帮助中心",
        needLogin: false,
        img: "ContactcsIcon",
        callBack: () => {
            LiveChatOpenGlobe({
                csp: true,
            });
            PiwikEventDataHandle("MemberCenter28");
        },
    },

];

export const ProfileIconMap = {
    AboutUsdtIcon: AboutUsdtIcon,
    SponsorIcon: SponsorIcon,
    UnionIcon: UnionIcon,
    UserInforIcon: UserInforIcon,
    PromotionsAddressIcon: PromotionsAddressIcon,
    BankCardIcon: BankCardIcon,
    SelfExclusionIcon: SelfExclusionIcon,
    SecurityCodeIcon: SecurityCodeIcon,
    UploadFileIcon: UploadFileIcon,
    SetLoginIcon: SetLoginIcon,
    DownloadAppIcon: DownloadAppIcon,
    VersionIcon: VersionIcon,
    ContactcsIcon: ContactcsIcon,
    LanguageSettingIcon: LanguageSettingIcon,
    UserRuleIcon: UserRuleIcon,
    DepositIcon: DepositIcon,
    DiamondClubIcon: DiamondClubIcon,
    FriendIcon: FriendIcon,
    KingClubIcon: KingClubIcon,
    NewsIcon: NewsIcon,
    RecordesIcon: RecordesIcon,
    WithdrawalIcon: WithdrawalIcon,
};
const MangerListsArr4 = [
    {
        text: "语言",
        needLogin: false,
        get show() {
            return !ApiPort.UserLogin;
        },
        img: "LanguageSettingIcon",
        callBack: () => {
            Actions.LanguageSetting();
        },
    },
];
export const MangerListsBottomArr = [MangerListsArr1, MangerListsArr2, MangerListsArr3, MangerListsArr4];

export const UserInfoData1 = [
    {
        text: "真实姓名",
        type: "firstName",
        rightCallBack: ({ type }) => {
            Actions.UserUpdateInfo({
                updateType: type,
            });
        },
        renderRight: (data) => {
            return BasicInfoStatus({
                value: data.value,
                rightText: ({ value }) => value
            });
        }
    },

    {
        text: "身份证号码",
        type: "identityCard",
        rightCallBack: ({ type }) => {
            Actions.UserUpdateInfo({
                updateType: type,
            });
        },
        renderRight: (data) => {
            return BasicInfoStatus({
                value: data.value,
                rightText: ({ value }) => "************" + value.slice(-6)
            });
        },
        language: ["CN"],
    },

    {
        text: "出生日期",
        type: "dob",
        rightCallBack: ({ type }) => {
            Actions.UserUpdateInfo({
                updateType: type,
            });
        },
        renderRight: (data) => {
            return BasicInfoStatus({
                value: data.value,
                rightText: ({ value }) => window.LANGUAGE == "CN" ? `${moment(value).format("YYYY年MM月DD日").slice(0, 2) + "**/**/**"}` : `${moment(value).format("**/**/YYYY").slice(0, -2)}**`
            });
        }
    },
    {
        text: "性别",
        type: "gender",
        rightCallBack: ({ type }) => {
            Actions.UserUpdateInfo({
                updateType: type,
            });
        },
        renderRight: (data) => {
            return BasicInfoStatus({
                value: data.value,
                rightText: ({ value }) => value === "Female" ? translate("女") : translate("男")
            });
        }
    },
];

export const UserInfoData2 = [
    {
        text: "登录昵称",
        type: "userName",
        rightCallBack: ({ type }) => {},
        renderRight: (data) => {
            return ArrowContentStatus({
                value: data.value,
                rightText: ({ value }) => value
            });
        }
    },

    {
        text: "会员账号",
        type: "memberCode",
        rightCallBack: ({ type }) => {},
        renderRight: (data) => {
            return ArrowContentStatus({
                value: data.value,
                rightText: ({ value }) => value
            });
        }
    },

    {
        text: "电子邮箱",
        type: "email",
        rightCallBack: ({ type }) => {
            Actions.Verification({
                verificaType: type,
                formPage: "profile",
                serviceAction: "ProfileVerification",
            });
        },
        renderRight: (data) => {
            return PhoneEmailStatus(data);
        }
    },

    {
        text: "手机",
        type: "phone",
        rightCallBack: ({ type }) => {
            Actions.Verification({
                verificaType: type,
                formPage: "profile",
                serviceAction: "ProfileVerification",
            });
        },
        renderRight: (data) => {
            return PhoneEmailStatus(data);
        }
    },

    {
        text: "密码修改",
        type: "changePWD",
        rightCallBack: ({ type }) => {
            Actions.ChangePassword();
        },
        renderRight: (data) => {
            return ArrowContentStatus({
                value: data.value,
                rightText: ({ value }) => ""
            });
        }
    },

    {
        text: "联系方式",
        type: "contact",
        rightCallBack: ({ type }) => {
            Actions.UserUpdateInfo({
                updateType: type,
            });
        },
        renderRight: (data) => {
            return ArrowContentStatus({
                value: data.value,
                rightText: ({ value }) => ""
            });
        }
    },

    {
        text: "QQ号",
        type: "qq",
        rightCallBack: ({ type }) => {
            Actions.UserUpdateInfo({
                updateType: type,
            });
        },
        renderRight: (data) => {
            return ArrowContentStatus({
                value: data.value,
                rightText: ({ value }) => value
            });
        },
        language: ["CN"],
    },

    {
        text: "微信号",
        type: "weChat",
        rightCallBack: ({ type }) => {
            Actions.UserUpdateInfo({
                updateType: type,
            });
        },
        renderRight: (data) => {
            return ArrowContentStatus({
                value: data.value,
                rightText: ({ value }) => value
            });
        },
        language: ["CN"],
    },

    {
        text: "纸飞机",
        type: "telegram",
        allowEdit: true,
        rightCallBack: ({ type }) => {
            Actions.UserUpdateInfo({
                updateType: type,
            });
        },
        renderRight: (data) => {
            return AllowEditStatus(data);
        },
        language: ["VN"],
    },

    {
        text: "脸书",
        type: "facebook",
        allowEdit: true,
        rightCallBack: ({ type }) => {
            Actions.UserUpdateInfo({
                updateType: type,
            });
        },
        renderRight: (data) => {
            return AllowEditStatus(data);
        },
        language: ["TH"],
    },
];

export const UserInfoData3 = [
    {
        text: "语言",
        type: "language",
        rightCallBack: ({ type }) => {},
        renderRight: (data) => {
            return ArrowContentStatus({
                value: data.value,
                rightText: ({ value }) => value
            });
        }
    },

    {
        text: "货币",
        type: "currency",
        rightCallBack: ({ type }) => {},
        renderRight: (data) => {
            return ArrowContentStatus({
                value: data.value,
                rightText: ({ value }) => value
            });
        }
    },

    {
        text: "安全提问",
        type: "securityQuestion",
        rightCallBack: ({ type }) => {
            Actions.SecurityQuestion({});
        },
        renderRight: (data) => {
            return ArrowContentStatus({
                value: data.value,
                rightText: ({ value }) => value
            });
        }
    },
];

export const UserInfoData = [
    {
        title: "基本信息",
        data: UserInfoData1,
    },
    {
        title: "隐私安全",
        data: UserInfoData2,
    },
    {
        title: "其他设置",
        data: UserInfoData3,
    },
];

const FirstNmaeReg = ({ value = "" }) => {
    let FirstNameReg = RegMap.FirstNameReg;
    let obj = {};

    // 防止一开始输入空格
    if (value.length === 1 && value.startsWith(" ")) {
        value = "";
    }

    if (window.LANGUAGE == "CN") {
        obj.value = value.trim();

        if (value.length > 0) {
            obj.inputError = FirstNameReg.test(value.trim()) ? "" : "真实姓名格式不正确";
        } else {
            obj.inputError = "请填写真实姓名";
        }
    } else {
        // 计算当前输入的空格数量
        let spaceCount = (value.match(/ /g) || []).length;

        // 如果尝试输入第 6 个空格，则阻止它
        if (spaceCount > 5 && value.endsWith(" ")) {
            value = value.slice(0, -1);
        }

        // 防止多个连续空格，只允许单个空格
        value = value.replace(/ {2,}/g, " ");

        obj.value = value;



        // 校验输入值是否符合规则
        if (value.length > 0) {
            if (!/\S/.test(value.charAt(0))) {
                obj.inputError = "真实姓名格式不正确";
            } else if (!/\s/.test(value)) {
                obj.inputError = "真实姓名格式不正确";
            } else if (/ {2,}/.test(value)) {
                obj.inputError = "真实姓名格式不正确";
            } else if (!/^[a-zA-Z\u0E00-\u0E7F]+(?:\s[a-zA-Z\u0E00-\u0E7F]+)+\s?$/.test(value)) {
                obj.inputError = "真实姓名格式不正确";
            } else {
                obj.inputError = FirstNameReg.test(value.trim()) ? "" : "真实姓名格式不正确";
            }
        } else {
            obj.inputError = "请填写真实姓名";
        }
    }
    return obj;
};

export const UserUpdateInfoDetail = {
    firstName: {
        title: "真实姓名",
        inputTitle: "真实姓名1",
        inputTitle2: "真实姓名2",
        inforText: "姓名只允许更新一次。",
        placeholder: "请填写真实姓名",
        maxLength: window.LANGUAGE == "CN" ? 15 : 50,
        regTest: ({ value = "" }) => {
            return FirstNmaeReg({ value });
        },
        isModal: true,
        isInput: true,
    },
    dob: {
        title: "出生日期",
        inputTitle: "出生日期",
        inforText: "出生日期只允许更新一次。",
        regTest: value => {},
        isModal: true,
    },
    gender: {
        title: "性别",
        inputTitle: "性别",
        inforText: "性别只允许更新一次。",
        regTest: value => {},
        isModal: true,
    },
    identityCard: {
        title: "身份证号码",
        inputTitle: "身份证号码",
        inforText: "身份证号码只允许更新一次。",
        placeholder: "请输入您的身份证号码",
        maxLength: 18,
        regTest: ({ value = "" }) => {
            value = value?.trim();
            let obj = {};
            obj.value = value;
            if (Boolean(value?.length)) {
                obj.inputError = IdentityCardReg.test(value) ? "" : "身份证号码格式错误";
            } else {
                obj.inputError = "请输入您的身份证号码";
            }
            return obj;
        },
        isModal: true,
        isInput: true,
    },

    contact: {
        title: "联系方式",
        inputTitle: "选择联系方式",
        inforText: "您可选择至少两种以上方式，以便奖励派发、 礼品寄送、新的活动时，我们及时联系到您！",
        regTest: ({ value = "" }) => {},
        isModal: false,
    },

    line: {
        title: "联系方式",
        inputTitle: "选择联系方式",
        inforText: "",
        placeholder: "请输入您的 Line ID 或 Line 电话号码。",
        maxLength: 20,
        regTest: ({ value = "" }) => {
            value = value?.trim();
            let obj = {};
            obj.value = value;
            if (Boolean(value?.length)) {
                obj.inputError = LineReg.test(value) ? "" : "格式无效";
            } else {
                obj.inputError = "请输入您的 Line ID 或 Line 电话号码。";
            }
            return obj;
        },
        isModal: false,
        isInput: false,
    },

    telegram: {
        title: "纸飞机",
        inputTitle: "纸飞机",
        inforText: "",
        placeholder: "输入你的 Telegram 账户",
        maxLength: 32,
        regTest: ({ value = "" }) => {
            value = value?.trim();
            let obj = {};
            obj.value = value;
            if (Boolean(value?.length)) {
                obj.inputError = TelegramReg.test(value) ? "" : "仅接受 5-32 个字符：字母 a-z、数字 0-9 和下划线 _";
            } else {
                obj.inputError = "Telegram 账户不能为空";
            }
            return obj;
        },
        isModal: false,
        isInput: true,
    },
    deposit: {
        title: "验证账户",
        inputTitle: "真实姓名1",
        inputTitle2: "真实姓名2",
        inforText: "",
        placeholder: "请填写真实姓名",
        maxLength: 50,
        regTest: ({ value = "" }) => {
            return FirstNmaeReg({ value });
        },
        isModal: false,
    },

    qq: {
        title: "QQ号",
        inputTitle: "QQ号",
        inforText: "",
        placeholder: "请输入您的QQ号",
        maxLength: undefined,
        regTest: ({ value = "" }) => {
            value = value?.trim();
            let obj = {};
            obj.value = value;
            if (Boolean(value?.length)) {
                obj.inputError = QqReg.test(value) ? "" : "QQ号格式错误";
            } else {
                obj.inputError = "请输入您的QQ号";
            }
            return obj;
        },
        isModal: false,
        isInput: true,
    },
    weChat: {
        title: "微信号",
        inputTitle: "微信号",
        inforText: "",
        placeholder: "请输入您的微信号",
        maxLength: undefined,
        regTest: ({ value = "" }) => {
            value = value?.trim();
            let obj = {};
            obj.value = value;
            if (Boolean(value?.length)) {
                obj.inputError = value.length >= 6 ? "" : "微信号格式错误";
            } else {
                obj.inputError = "请输入您的微信号";
            }
            return obj;
        },
        isModal: false,
        isInput: true,
    },

    facebook: {
        title: "脸书",
        inputTitle: "脸书",
        inforText: "",
        placeholder: "请输入您的 Facebook 帐户",
        maxLength: 50,
        regTest: ({ value = "" }) => {
            value = value?.trim();
            let obj = {};
            obj.value = value;
            if (Boolean(value?.length)) {
                obj.inputError = TelegramReg.test(value) ? "" : "格式无效";
            } else {
                obj.inputError = "请输入您的 Facebook 帐户";
            }
            return obj;
        },
        isModal: false,
        isInput: true,
    },
};

export const ContactArr = [
    {
        type: "IsCall",
        text: "电话",
    },
    {
        type: "IsSMS",
        text: "短信",
    },
    {
        type: "IsEmail",
        text: "邮箱",
    },
    {
        type: "IsLine",
        text: "Line",
        language: ["TH"],
    },
];

export const GenderArr = [
    {
        type: "male",
        text: "男",
    },
    {
        type: "female",
        text: "女",
    },
];

export const DatePickerLocale = {
    DatePickerLocale: {
        year: "",
        month: "",
        day: "",
        hour: "",
        minute: "",
    },
    okText: "Chọn",
    dismissText: "Đóng",
};

export const VerificationTypeArr = [
    {
        type: "identityCard",
        Icon: LevelIdIcon,
        title: "实名认证",
        text: "验证实名信息",
        callBack: () => {
            Actions.UserUpdateInfo({
                updateType: "firstName",
            });
        },
    },
    {
        type: "phone",
        Icon: LevelPhoneIcon,
        title: "验证手机",
        text: "验证有效手机号",
        callBack: () => {
            Actions.Verification({
                verificaType: "phone",
                formPage: "profile",
                serviceAction: "ProfileVerification",
            });
        },
    },
    {
        type: "email",
        Icon: LevelMailIcon,
        title: "验证邮箱",
        text: "验证有效邮箱",
        callBack: () => {
            Actions.Verification({
                verificaType: "email",
                formPage: "profile",
                serviceAction: "ProfileVerification",
            });
        },
    },
];

export function PhoneEmailStatus({ value, status }) {
    return (
        <RowCenterCenter>
            <Text style={styles.listRightText}>
                {value}
            </Text>
            {
                status ? (
                    <RowCenterCenter>
                        <WarningIcon
                            fill={Color.vividRed}
                            width={18}
                            height={18}
                            wrapStyle={{
                                marginHorizontal: 5,
                            }}
                        />
                        <ArrowIcon fill={Color.gray} width={12} height={12} direction="right" />
                    </RowCenterCenter>
                )
                    : (
                        <RowCenterCenter>
                            <SuccessIcon
                                fill={Color.vividGreen}
                                width={18}
                                height={18}
                                wrapStyle={{
                                    marginLeft: 5,
                                }}
                            />
                            <Text style={styles.editText}>
                                {translate("更改")}
                            </Text>
                        </RowCenterCenter>
                    )}
        </RowCenterCenter>
    );
}


export function AllowEditStatus({ value }) {
    return (
        <RowCenterCenter>
            <Text style={styles.listRightText}>
                {value[0] ? value[0] + "*********" : ""}
            </Text>
            <ArrowIcon fill={Color.gray} width={12} height={12} direction="right" />
        </RowCenterCenter>
    );
}

export function ArrowContentStatus({ value, rightText }) {
    return Boolean(value)
        ?
        <Text style={styles.listRightText}>{rightText({ value })}</Text>
        :
        <ArrowIcon fill={Color.gray} width={12} height={12} direction="right" />;
}

export function BasicInfoStatus({ value, rightText }) {
    return (
        <RowCenterCenter>
            <Text style={[styles.listRightText, !value && styles.emptyValueText]}>
                {value ? rightText({ value }) : translate("填写")}
            </Text>
            {!value && <ArrowIcon fill={Color.gray} width={12} height={12} direction="right" />}
        </RowCenterCenter>
    );
}

export const SECURITY_LEVELS = {
    High: {
        color: "#0CCC3C",
        text: "高",
        message: "已完成验证,账户安全受保护中",
    },
    Medium: {
        color: "#FABE47",
        text: "中",
        message: "马上验证,提高账户安全性",
    },
    Low: {
        color: "#EB2121",
        text: "低",
        message: "马上验证,提高账户安全性",
    },
};



export const LanguageSettingData = [
    {
        text: "中文",
        Icon: <CnIcon></CnIcon>,
        key: "CN"
    },
    {
        text: "ภาษาไทย",
        Icon: <ThIcon></ThIcon>,
        key: "TH"
    },
    {
        text: "Tiếng Việt",
        Icon: <VnIcon></VnIcon>,
        key: "VN"
    },
];



import Color from "$Components/Color";
let Crown = () => <CrownIcon fill={Color.white} width={16} height={16} />;
let Diamond = () => <DiamondIcon fill={Color.white} width={16} height={16} />;
let Star = () => <StarIcon fill={Color.white} width={16} height={16} />;

// Common color schemes
const COLOR_SCHEMES = {
    SILVER: ["#FFFFFF", "#AAB3BB", "#6F6F6F"],
    GOLD: ["#FFFDFA", "#FFBB1B", "#B17C00"],
    PLATINUM: ["#FFFFFF", "#76A3E7", "#254A81"],
    STARLIGHT: ["#D2D3ED", "#9B9EEC", "#4A4EA7"]
};

// Common location configurations
const LOCATIONS = {
    DEFAULT: [0, 0.07, 1],
    GOLD: [0, 0.075, 1],
    STAR: [0, 0.14, 1]
};

export const LevelConfig = {
    get [translate("白银会员")]() {
        return {
            colors: COLOR_SCHEMES.SILVER,
            Icon: Crown,
            get name() {
                return translate("白银会员");
            },
            locations: LOCATIONS.DEFAULT
        };
    },
    get [translate("黄金会员")]() {
        return {
            colors: COLOR_SCHEMES.GOLD,
            Icon: Crown,
            get name() {
                return translate("黄金会员");
            },
            locations: LOCATIONS.GOLD
        };
    },
    get [translate("铂金会员")]() {
        return {
            colors: COLOR_SCHEMES.PLATINUM,
            Icon: Crown,
            get name() {
                return translate("铂金会员");
            },
            locations: LOCATIONS.DEFAULT
        };
    },
    get [translate("星光会员")]() {
        return {
            colors: COLOR_SCHEMES.STARLIGHT,
            Icon: Star,
            get name() {
                return translate("星光会员");
            },
            locations: LOCATIONS.STAR
        };
    },
    get [translate("银钻会员")]() {
        return {
            colors: COLOR_SCHEMES.SILVER,
            Icon: Diamond,
            get name() {
                return translate("银钻会员");
            },
            locations: LOCATIONS.DEFAULT
        };
    },
    get [translate("金钻会员")]() {
        return {
            colors: COLOR_SCHEMES.GOLD,
            Icon: Diamond,
            get name() {
                return translate("金钻会员");
            },
            locations: LOCATIONS.GOLD
        };
    },
    get [translate("星钻会员")]() {
        return {
            colors: COLOR_SCHEMES.PLATINUM,
            Icon: Diamond,
            get name() {
                return translate("星钻会员");
            },
            locations: LOCATIONS.DEFAULT
        };
    },

};

export const KycStatusModalTranslation = {
    No: {
        get title() {
            return translate("账户资料尚未完善");
        },
        get description() {
            return translate("您的账户资料尚未完善，请前往“验证中心”页面上传所需文件以验证您的身份，或联系在线客服寻求协助。");
        },
        get okText() {
            return translate("马上验证2");
        },
        get noText() {
            return translate("稍后再说2");
        },
        get okFunction() {
            return () => {
                Actions.UploadFile({
                    fromPage: "Profile",
                });
            };
        },
        get noFunction() {
            return () => {};
        },
    },
    Pending: {
        get title() {
            return translate("账户异常需验证身份");
        },
        get description() {
            return translate("查询到您的账户存在异常行为，需验证账户身份以确保账户安全和交易顺利。请前往“验证中心”上传所需文件以验证您的身份。");
        },
        get okText() {
            return translate("马上验证2");
        },
        get noText() {
            return translate("稍后再说2");
        },
        get okFunction() {
            return () => {
                Actions.UploadFile({
                    fromPage: "Profile",
                });
            };
        },
        get noFunction() {
            return () => {};
        },
    },
    Verifying: {
        get title() {
            return translate("温馨提醒4");
        },
        get description() {
            return translate("您的帐户资料正在进行审核中，请稍后再次尝试，谢谢");
        },
        get okText() {
            return translate("我知道了3");
        },
        get okFunction() {
            return () => {};
        },
    },
    Rejected: {
        get title() {
            return translate("身份验证不通过");
        },
        get description() {
            return translate("抱歉，您的身份验证不通过，请前往“验证中心“再次验证。");
        },
        get okText() {
            return translate("马上验证2");
        },
        get noText() {
            return translate("稍后再说2");
        },
        get okFunction() {
            return () => {
                Actions.UploadFile({
                    fromPage: "Profile",
                });
            };
        },
        get noFunction() {
            return () => {};
        },
    },
};

export const RuleData = [
    {
        get text() {
            return translate("条款与条规");
        },
        articleNumberMap: {
            CN: {
                ST: "000017495",
                LIVE: "000006905"
            },
            TH: {
                ST: "000017506",
                LIVE: "000006816"
            },
            VN: {
                ST: "000017502",
                LIVE: "000009352"
            },
        },
    },
    {
        get text() {
            return translate("免责声明​");
        },
        articleNumberMap: {
            CN: {
                ST: "000017496",
                LIVE: "000010219"
            },
            TH: {
                ST: "000017499",
                LIVE: "000010222"
            },
            VN: {
                ST: "000017503",
                LIVE: "000010217"
            },
        },
    },
    {
        get text() {
            return translate("理性博彩");
        },
        articleNumberMap: {
            CN: {
                ST: "000017497",
                LIVE: "000010221"
            },
            TH: {
                ST: "000017500",
                LIVE: "000010223"
            },
            VN: {
                ST: "000017504",
                LIVE: "000009797"
            },
        },
    },
    {
        get text() {
            return translate("隐私政策​");
        },
        articleNumberMap: {
            CN: {
                ST: "000017498",
                LIVE: "000010233"
            },
            TH: {
                ST: "000017501",
                LIVE: "000010234"
            },
            VN: {
                ST: "000017505",
                LIVE: "000010235"
            },
        },
    },
];


const styles = StyleSheet.create({
    news: {
        borderRadius: 1000,
        paddingVertical: 2,
        paddingHorizontal: 2,
        backgroundColor: "#FF1C1C",
        position: "absolute",
        top: -4,
        right: 20,
    },
    unreadCountText: {
        color: Color.white,
        fontSize: 10,
        fontWeight: "bold",
        textAlign: "center",
    },
    kingClubView: {
        backgroundColor: "#FABE47",
        paddingVertical: 2,
        paddingHorizontal: 5,
        borderWidth: 1,
        borderColor: "#fff",
        borderRadius: 99999,
        position: "absolute",
        top: -8,
        right: 10
    },
    kingClubText: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "600"
    },
    maintenanceView: {
        backgroundColor: Color.gray,
        borderRadius: 4,
        width: 18,
        height: 18,
        paddingVertical: 2,
        paddingHorizontal: 5,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#fff",
        position: "absolute",
        top: -8,
        right: 15
    },
    listRightText: {
        color: Color.charcoal,
        fontSize: 14,
        fontWeight: "400",
    },
    emptyValueText: {
        color: Color.placeholderGray,
        marginRight: 6
    },
    warningText: {
        color: "#FABE47",
        paddingHorizontal: 4,
        fontSize: 12,
        fontWeight: "600",
    },
    editText: {
        color: Color.theme,
        fontSize: 14,
        fontWeight: "400",
        marginLeft: 5,
    },
});
