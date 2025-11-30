import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Actions } from "react-native-router-flux";
import { PromotionDetail } from "@/actions/CmsApi";

import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import { getMoneyFormat, CheckLogin, GetSelfExclusionPopup } from "$Utils";
import { GetGlobalModal } from "$Utils/globalModal";
import store from "@/lib/redux/store/index.js";
import { translate } from "@/locales/translate";
import Color from "$Components/Color";
import CustomLinkText from "$Components/CustomLinkText";
import { Toasts } from "$Toasts";
import { RowCenterStart, RowStartCenter } from "$Components/CustomView";
import { ArrowIcon } from "$Components/icons/index";
import FilledButton from "$Components/FilledButton";

export function ErrorCodeHandler({ result = {}, okFuntion = () => {}, messageFromApi = false }) {
    let { errorCode = "", message = "" } = result;
    errorCode = errorCode.toLocaleUpperCase();

    let errorCodeObj = {
        // Manual Pre-Bonus Prmotion Flow (Need Applied)
        CP30001: {
            //Keep previous status popup // 11111111111111111111111111111111111
            title: translate("优惠已申请") || "优惠已申请",
            msg: translate("优惠审核中，稍候更新状态") || "优惠审核中，稍候更新状态",
            buttonText: translate("我知道了") || "我知道了",
        },
        CP30003: {
            //领取 6,999 元预付彩金 ///                 111111111111111111111111
            title: translate("优惠已领取") || "优惠已领取",
            msg: translate("优惠已领取，稍候更新状态") || "优惠已领取，稍候更新状态",
            buttonText: translate("我知道了") || "我知道了",
        },

        // CP30004/CP30005/CP30006/CP30007/CP30008/CP30014/CP30015    111111111111111111111111
        CP30004: {
            title: translate("无法申请") || "无法申请",
            msg: translate("优惠已失效，请选择其他优惠") || "优惠已失效，请选择其他优惠",
            buttonText: translate("我知道了") || "我知道了",
        },
        CP30005: {
            ///   1111111111111111111111111
            title: translate("无法申请") || "无法申请",
            msg: translate("优惠已失效，请选择其他优惠") || "优惠已失效，请选择其他优惠",
            buttonText: translate("我知道了") || "我知道了",
        },
        CP30006: {
            ///   1111111111111111111111111
            title: translate("无法申请") || "无法申请",
            msg: translate("优惠已失效，请选择其他优惠") || "优惠已失效，请选择其他优惠",
            buttonText: translate("我知道了") || "我知道了",
        },
        CP30007: {
            ///   1111111111111111111111111
            title: translate("无法申请") || "无法申请",
            msg: translate("优惠已失效，请选择其他优惠") || "优惠已失效，请选择其他优惠",
            buttonText: translate("我知道了") || "我知道了",
        },
        CP30008: {
            ///   1111111111111111111111111
            title: translate("无法申请") || "无法申请",
            msg: translate("优惠已失效，请选择其他优惠") || "优惠已失效，请选择其他优惠",
            buttonText: translate("我知道了") || "我知道了",
        },
        CP30014: {
            ///   1111111111111111111111111
            title: translate("无法申请") || "无法申请",
            msg: translate("优惠已失效，请选择其他优惠") || "优惠已失效，请选择其他优惠",
            buttonText: translate("我知道了") || "我知道了",
        },
        CP30015: {
            //Expired popup   ///   1111111111111111111111111
            title: translate("无法申请") || "无法申请",
            msg: translate("优惠已失效，请选择其他优惠") || "优惠已失效，请选择其他优惠",
            buttonText: translate("我知道了") || "我知道了",
        },

        CP30002: {
            //Participate-once     111111111111111111111111
            title: translate("优惠已申请") || "优惠已申请",
            msg: translate("优惠已申请，稍候更新状态") || "优惠已申请，稍候更新状态",
            buttonText: translate("我知道了") || "我知道了",
        },
        // CP10001/CP10002/CP10003/CP10010/CP30009/CP30010/CP30012/CP30016/CP30017/CP30022    系统忙碌中，请稍后尝试      ///   1111111111111111111111111

        // Reload Bonus
        //GET /api/Bonus/Applications/Eligible
        BP00122: {
            // Expired       ///   1111111111111111111111111
            title: translate("无法申请") || "无法申请",
            msg: translate("优惠已失效，请选择其他优惠") || "优惠已失效，请选择其他优惠",
            buttonText: translate("我知道了") || "我知道了",
        },
        BP00025: {
            // Ongoing TO reminder    1111111111111111111111111
            title: translate("无法申请") || "无法申请",
            msg: translate("您还有彩金优惠还没完成流水需求，请在完成流水需求后再进行申请") || "您还有彩金优惠还没完成流水需求，请在完成流水需求后再进行申请",
            buttonText: translate("我知道了") || "我知道了",
        },
        BP00005: {
            //Hit the max applicant   1111111111111111111111111
            title: translate("申请名额已满") || "申请名额已满",
            msg: translate("此优惠名额已达上限，请选择其他彩金优惠") || "此优惠名额已达上限，请选择其他彩金优惠",
            buttonText: translate("我知道了") || "我知道了",
        },
        BP00013: {
            // Have sent or hit the max applications   1111111111111111111111111
            title: translate("无法申请") || "无法申请",
            msg: translate("申请表格已发送过或已达到最大申请次数") || "申请表格已发送过或已达到最大申请次数",
            buttonText: translate("我知道了") || "我知道了",
        },
    };

    let errorCodeArr = Object.keys(errorCodeObj);
    let isFromApi = errorCodeArr.includes(errorCode) && messageFromApi && message;

    let tempObj = errorCodeObj[errorCode] || {};

    if (Array.isArray(Object.keys(tempObj)) && Object.keys(tempObj).length) {
        let { title = "", msg = "", buttonText = "" } = tempObj;

        GetGlobalModal({
            title: title,
            message: isFromApi ? message.replace(/\\n/g, "\n") : msg,
            confirmText: buttonText,
            onConfirm: () => {
                okFuntion();
            },
        });
    } else {
        Toasts.fail(translate("系统忙碌中，请稍后再试"));
        return;
    }
}

export async function checkReloadBonus({ StrApiDetail = {}, BoffApiDetail = {}, callBack = () => {} }) {
    let { campaignId = "", promoId = "", campaignApplicationType = "", bonusId = "" } = StrApiDetail;

    let { bonusGroupId = "", groupID = "", bonusRuleGroupId = "", id = "", bonusData = {} } = BoffApiDetail || {};

    let data = null;
    try {
        Toasts.loading(translate("加载中,请稍候..."));
        data = await fetchRequest(`${ApiPort.BonusEligible}BonusGroupId=${bonusId}&`, "GET");

        Toasts.removeAll();
    } catch (err) {
        Toasts.removeAll();
    }

    let { isSuccess = false, result = {} } = data;

    if (isSuccess && result?.isEligible) {
        const { minAccept = 0 } = BoffApiDetail?.bonusData || { minAccept: 0 };

        // let balanceObj = store.getState()?.userInfo?.balanceObj || {}
        // let balance = (balanceObj[wallet] || balanceObj[account])?.balance
        let balanceTotal = store.getState()?.userInfo?.balanceTotal;
        if (balanceTotal >= minAccept) {
            Actions.ApplyBonus({
                StrApiDetail,
                BoffApiDetail,
                EligibleApiDetail: result,
                callBack,
            });
        } else {
            GetGlobalModal({
                title: translate("余额不足"),
                message: translate("抱歉，您的余额目前不足以参加本次活动，请存款并继续参与"),
                cancelText: translate("忍痛放弃"),
                onCancel: () => {},
                confirmText: translate("立即存款2"),
                onConfirm: () => {
                    Actions.DepositCenter({
                        StrApiDetail,
                        BoffApiDetail,
                        EligibleApiDetail: result,
                    });
                },
            });
        }
    } else {
        ErrorCodeHandler({ result, messageFromApi: true });
    }
}

export async function checkManualWhichWay({ StrApiDetail = {}, BoffApiDetail = {}, callBack = () => {} }) {
    // 決定要走哪條路

    // 2. 在显示 application form 之前要call POST
    // /api/Campaign/Enrollments actionType = 1
    // (CHECK_ELIGIBILITY) 来验证会员是否能提交申请

    // 3. 如果那个 campaign 不需要 application form 的话，只需
    // 要直接 call action type = 2 就好了
    let { campaignId = "", promoId = "", actionType = "" } = StrApiDetail;

    let entryPeriodId = BoffApiDetail?.entryPeriodId;
    let isForm = actionType == "APPLY_FORM";
    if (isForm) {
        const params = {
            entryPeriodId: entryPeriodId,
        };
        let data2 = null;
        try {
            Toasts.loading(translate("加载中,请稍候..."));
            data2 = await fetchRequest(`${ApiPort.CampaignEnrollments}actionType=1&`, "POST", params);
            Toasts.removeAll();
            PiwikEventDataHandle("PromoMainPage8");
        } catch (err) {
            Toasts.removeAll();
        }

        let { isSuccess = false, result = {} } = data2;
        if (isSuccess && result?.isSuccess) {
            Actions.ApplyManual({ StrApiDetail, BoffApiDetail, callBack });



        } else {
            ErrorCodeHandler({ result, messageFromApi: true });
        }
    } else {
        const params = {
            entryPeriodId: entryPeriodId,
            siteId: window.siteId,
            formData: {
                formType: 6,
            },
        };
        let data3 = null;
        try {
            Toasts.loading(translate("加载中,请稍候..."));
            data3 = await fetchRequest(ApiPort.CampaignEnrollments + "actionType=2" + "&", "POST", params);
            Toasts.removeAll();


            PiwikEventDataHandle("PromoMainPage8");
        } catch (err) {
            Toasts.removeAll();
        }

        let { isSuccess = false, result = {} } = data3;
        if (isSuccess && result?.isSuccess) {
            Toasts.success(translate("优惠申请成功"));
            Actions.pop();
            callBack();
        } else {
            ErrorCodeHandler({ result, messageFromApi: true });
        }


    }

}

export async function checkManualPrebonus({ StrApiDetail = {}, BoffApiDetail = {}, callBack = () => {}, isApplied = false }) {
    // Manual pre-bonus
    let { campaignId = "", promoId = "", campaignApplicationType = "" } = StrApiDetail;
    let data1 = {};
    try {
        Toasts.loading(translate("加载中,请稍候..."));
        data1 = await fetchRequest(`${ApiPort.CampaignAssignedClaims}`, "GET");
        Toasts.removeAll();
    } catch (err) {
        Toasts.removeAll();
    }

    // 	GET - /api/Campaign/AssignedClaims
    // 1. 用strapi actiontype: apply_form/no_form

    let { isSuccess = false, result = {} } = data1;
    if (isSuccess && result?.isSuccess) {
        let CampaignAssignedClaimsDetail = result.data;
        if (isApplied) {
            let entryPeriodId = BoffApiDetail?.entryPeriodId;
            let promotionDetails = CampaignAssignedClaimsDetail.find(v => v.entryPeriodId == entryPeriodId) || {};
            if (Object.keys(promotionDetails).length <= 0) {
                Toasts.fail(translate("系统忙碌中，请稍后再试"));
                return;
            }
            Actions.ConfirmBonus({
                promotionDetails: promotionDetails,
                callBack: () => {
                    callBack();
                },
            });

        } else {
            await checkManualWhichWay({
                StrApiDetail,
                BoffApiDetail,
                callBack,
            });
        }
    } else {
        ErrorCodeHandler({ result, messageFromApi: true });
    }
}

export async function checkManualItemBouns({ StrApiDetail = {}, BoffApiDetail = {}, callBack = () => {} }) {
    await checkManualWhichWay({ StrApiDetail, BoffApiDetail, callBack });
}

const NO_ACTION = {
    text: "查看詳情",
    callBack: () => {}, //进入TNC 隐藏按钮
    HomeIcon: ({ enable }) => {
        return (
            <RowCenterStart>
                <Text style={[styles.homeBtnText, { color: Color.theme, marginRight: 4 }]}>{translate("查看详情")}</Text>
                <ArrowIcon width={14} height={14} fill={Color.theme} direction='right'></ArrowIcon>
            </RowCenterStart>
        );
    },
    TncBtn: ({}) => {
        return null;
    },
};

export const DefaultHomeIcon = ({ enable }) => {
    return (
        <RowCenterStart>
            <Text style={[styles.homeBtnText, { color: Color.theme, marginRight: 4 }]}>{translate("查看详情")}</Text>
            <ArrowIcon width={14} height={14} fill={Color.theme} direction='right'></ArrowIcon>
        </RowCenterStart>
    );
};


const PENDING_RESULT = {
    // ????????????????????????????
    text: "审核中",
    callBack: () => {},
    HomeIcon: ({ enable }) => {
        return (
            <FilledButton
                text={translate("审核中2")}
                type='small'
                wrapStyle={styles.homeBtn}
                enable={false}
            />
        );
    },
    TncBtn: ({ buttonStyle = {}, StrApiDetail = {}, BoffApiDetail = {}, callBack = () => {}, promotionType = "", onPress = () => {} }) => {
        return (
            <FilledButton
                enable={false}
                text={translate("审核中2")} />
        );
    },
};


const ALREADY_APPLIED = {
    //123123123123
    text: "已申请",
    callBack: () => {},
    HomeIcon: ({ enable }) => {
        return (
            <FilledButton
                text={translate("已申请")}
                type='small'
                wrapStyle={styles.homeBtn}
                enable={false}
            />
        );
    },
    TncBtn: ({ buttonStyle = {}, StrApiDetail = {}, BoffApiDetail = {}, callBack = () => {} }) => {
        return (
            <FilledButton
                enable={false}
                text={translate("已申请")}
            />
        );
    },
};

export const ManualItemStatus = {
    // done
    REQUIRED_LOGIN: {
        text: "立即申请",
        callBack: () => {},
        HomeIcon: ({ enable }) => {
            return DefaultHomeIcon({ enable });
        },
        TncBtn: ({ buttonStyle = {}, StrApiDetail = {}, BoffApiDetail = {}, callBack = () => {} }) => {
            return (
                <FilledButton
                    onPress={async () => {
                        if (await CheckLoginSelfExclusion()) return;


                        checkManualItemBouns({
                            StrApiDetail,
                            BoffApiDetail,
                            callBack,
                        });
                    }}
                    text={translate("立即申请")} //////
                />
            );
        },
    },
    READY_TO_ENROLL: {
        //111111111111111111
        text: "立即申请",
        callBack: () => {},
        HomeIcon: ({ enable }) => {
            return DefaultHomeIcon({ enable });
        },
        TncBtn: ({ buttonStyle = {}, StrApiDetail = {}, BoffApiDetail = {}, callBack = () => {} }) => {
            return (
                <FilledButton
                    onPress={async () => {
                        if (await CheckLoginSelfExclusion()) return;
                        checkManualItemBouns({
                            StrApiDetail,
                            BoffApiDetail,
                            callBack,
                        });
                    }}
                    text={translate("立即申请")} /////
                />
            );
        },
    },
    ALREADY_APPLIED,
    PENDING_RESULT,
    NO_ACTION: NO_ACTION,
};

export const ManualPreBonusStatus = {
    REQUIRED_LOGIN: {
        /////123123123123
        text: "立即申请",
        callBack: () => {},
        HomeIcon: ({ enable }) => {
            return DefaultHomeIcon({ enable });
        },
        TncBtn: ({ buttonStyle = {}, StrApiDetail = {}, BoffApiDetail = {}, callBack = () => {} }) => {
            return (
                <FilledButton
                    onPress={async () => {
                        if (await CheckLoginSelfExclusion()) return;

                        checkManualPrebonus({
                            StrApiDetail,
                            BoffApiDetail,
                            callBack,
                        });
                    }}
                    text={translate("立即申请")} /////
                />
            );
        },
    },
    READY_TO_ENROLL: {
        ///12312312312313
        text: "立即申请",
        callBack: () => {},
        HomeIcon: ({ enable }) => {
            return DefaultHomeIcon({ enable });
        },
        TncBtn: ({ buttonStyle = {}, StrApiDetail = {}, BoffApiDetail = {}, callBack = () => {} }) => {
            return (
                <FilledButton
                    onPress={async () => {
                        if (await CheckLoginSelfExclusion()) return;


                        checkManualPrebonus({
                            StrApiDetail,
                            BoffApiDetail,
                            callBack,
                        });
                    }}
                    text={translate("立即申请")} /////
                />
            );
        },
    },
    PENDING_RESULT,
    START_TO_CLAIM: {
        ///123123123
        text: "符合资格",
        callBack: () => {},
        HomeIcon: ({ enable }) => {
            return (
                <FilledButton
                    text={translate("符合资格")}
                    type='small'
                    wrapStyle={[styles.homeBtn, { backgroundColor: Color.theme }]}
                    enable={false}
                    textStyle={{ color: Color.white }}
                />
            );
        },
        TncBtn: ({ buttonStyle = {}, StrApiDetail = {}, BoffApiDetail = {}, callBack = () => {} }) => {
            let givenAmount = BoffApiDetail?.givenAmount || StrApiDetail?.givenAmount || 0;
            return (
                <FilledButton
                    text={translate("开始优惠")}
                    onPress={async () => {
                        if (await CheckLoginSelfExclusion()) return;

                        PiwikEventDataHandle({
                            eventTitle: "PromotionDetail6",
                            customProperties: {
                                "Promotion_C_StartPromotion_PromoName_PrmoID": StrApiDetail.promoTitle + "_" + BoffApiDetail.campaignId, // 修正 key 格式
                            },
                        });

                        checkManualPrebonus({
                            StrApiDetail,
                            BoffApiDetail,
                            callBack,
                            isApplied: true,
                        });
                    }}>
                    <View style={styles.manualPreStart}>
                        <CustomLinkText
                            norMaltextStyle={styles.manualPreStartText}
                            themeTextStyle={{ color: Color.theme }}
                            wrapStyle={{ marginVertical: 0 }}
                            text={translate("领取 {{x}} 元预付彩金", {
                                x: getMoneyFormat(givenAmount),
                            })}
                        />
                    </View>
                </FilledButton>
            );
        },
    },
    ALREADY_APPLIED,
    ALREADY_CLAIMED: {
        text: "已领取",
        callBack: () => {},
        HomeIcon: ({ enable }) => {
            return (
                <FilledButton
                    text={translate("已领取")}
                    type='small'
                    wrapStyle={styles.homeBtn}
                    enable={false}
                />
            );
        },
        TncBtn: ({ buttonStyle = {}, StrApiDetail = {}, BoffApiDetail = {}, callBack = () => {} }) => {
            return (
                <FilledButton
                    enable={false}
                    text={translate("已领取")}
                />
            );
        },
    },

    NO_ACTION: NO_ACTION,
};

export const ReloadBonusType = {
    FUND_IN: {
        text: "立即申请",
        callBack: () => {},
        HomeIcon: ({ enable }) => {
            return DefaultHomeIcon({ enable });
        },
        TncBtn: ({ buttonStyle = {}, StrApiDetail = {}, BoffApiDetail = {}, callBack = () => {} }) => {
            let { bonusData = {} } = BoffApiDetail;
            return Object.keys(bonusData)?.length > 0 && <FilledButton
                onPress={async () => {
                    if (await CheckLoginSelfExclusion()) return;


                    checkReloadBonus({
                        StrApiDetail,
                        BoffApiDetail,
                        callBack,
                    });
                }}
                text={translate("立即申请")} //////
            />;
        },
        ReloadBonusStatus: {
            isApplied: {
                text: "已申请",
                callBack: () => {},
                HomeIcon: ({ enable }) => {
                    return (
                        <FilledButton
                            text={translate("已申请")}
                            type='small'
                            wrapStyle={styles.homeBtn}
                            enable={false}
                        />
                    );
                },
                TncBtn: ({ buttonStyle = {}, StrApiDetail = {}, BoffApiDetail = {}, callBack = () => {} }) => {
                    return (
                        <FilledButton
                            enable={false}
                            text={translate("已申请")}
                        />
                    );
                },
            },
        },
    },
    DEPOSIT_PAGE_ONLY: {
        text: "立即申请",
        callBack: () => {},
        HomeIcon: ({ enable }) => {
            return DefaultHomeIcon({ enable });
        },
        TncBtn: ({ buttonStyle = {}, StrApiDetail = {}, BoffApiDetail = {}, callBack = () => {} }) => {
            return (
                <FilledButton
                    onPress={async () => {
                        if (await CheckLoginSelfExclusion()) return;

                        Actions.DepositCenter({
                            StrApiDetail,
                            BoffApiDetail,
                        });
                    }}
                    text={translate("立即申请")} /////
                />
            );
        },
    },
    NO_ACTION: NO_ACTION,
};

export const CheckLoginSelfExclusion = async () => {
    if (CheckLogin()) return true;

    let isSelfExclusionPopup = await GetSelfExclusionPopup();
    if (isSelfExclusionPopup) return true;
};


export const PromotionsTypeObj = {
    ManualItem: ManualItemStatus,
    ManualPreBonus: ManualPreBonusStatus,
    Bonus: ReloadBonusType,
};

export async function SignupBonusStatus({ productGroup, callBack = () => {} }) {
    Toasts.loading(translate("加载中,请稍候..."), 2000);
    fetchRequest(ApiPort.GetMemberServingSignupBonusStatus + `productGroup=${productGroup}&`, "GET")
        .then(res => {
            Toasts.removeAll();
            if (res?.isSuccess && res?.result) {
                GetGlobalModal({
                    title: translate("确认取消优惠") || "确认取消优惠",
                    message: translate("此优惠仅能申请一次，若取消后将无法再次申请") || "此优惠仅能申请一次，若取消后将无法再次申请",
                    confirmText: translate("确认4") || translate("我知道了"),
                    onConfirm: () => {
                        callBack();
                    },
                    cancelText: translate("返回"),
                    onCancel: () => {},
                });
            } else {
                callBack();
            }
        })
        .catch(err => console.log(err));
}


const styles = StyleSheet.create({
    homeBtn: {
        paddingHorizontal: 6,
        borderRadius: 6
    },
    homeBtnText: {
        fontSize: 12,
        color: Color.gray,
    },


    manualPreStart: {
        backgroundColor: Color.charcoal,
        borderRadius: 6,
        borderBottomLeftRadius: 0,
        paddingVertical: 6,
        paddingHorizontal: 10,
        position: "absolute",
        right: 20,
        top: -20,
        zIndex: 999999,
    },
    manualPreStartText: {
        fontSize: 14,
        fontWeight: "600",
        color: Color.white,
    },
});




