import React from "react";
import { GetGlobalModal } from "$Utils/globalModal";
import { translate } from "$locales/translate";
import { Toasts } from "$Toasts";
import { LiveChatOpenGlobe } from "$Utils";

import store from "@/lib/redux/store/index.js";

//  isQueleaRegistered
//   isActiveCampaign
// https://whimsical.com/raf-throughout-check-RhonvcsCK2KPYNc1GVSe2U

export async function judgeMemberStatus() {
    const { memberInfo = {} } = store.getState().userInfo;
    const { isQueleaRegistered = false, displayReferee = false } = memberInfo;

    if (isQueleaRegistered) {
        GetQueleaReferreeTaskStatus();
    } else {
    }
}

export function postThroughoutVerification() {
    fetchRequest(ApiPort.PostThroughoutVerification, "POST").then(res => {
        Toasts.removeAll();
        let { result = false, isSuccess = false } = res;
        if (!isSuccess) return;
        if (result) {
            // 符合資格    1111111
            GetGlobalModal({
                name: "RecommendGamesModal",
                showCloseIcon: true,
                wrapStyle: { width: "90%" },
            });
        } else {
            GetGlobalModal({
                title: translate("不符合资格"),
                iconName: "warning",
                message: translate("抱歉，目前您的账户不符合推荐好友活动的资格。请尝试申请其他优惠，或联系在线客服咨询。"),
                cancelText: translate("关闭1"),
                onCancel: () => {},
                confirmText: translate("联系在线客服1"),
                onConfirm: () => {
                    LiveChatOpenGlobe();
                },
            });
        }
    });
}

export async function GetQueleaReferreeTaskStatus() {
    let res = (await fetchRequest(ApiPort.GetQueleaReferreeTaskStatus, "GET")) || {};
    const { memberInfo = {} } = store.getState().userInfo;
    const displayReferee = (memberInfo?.displayReferee || false);
    let { isSuccess = false, result = {} } = res;
    Toasts.removeAll();
    if (isSuccess) {
        let { isActiveCampaign = false, isWithinReconciliation = false } = result;
        if (isActiveCampaign || isWithinReconciliation) {
            if (displayReferee) {
                GetGlobalModal({
                    name: "RecommendRefereeModal",
                    wrapStyle: { width: "90%" },
                    title: "新手注册专享等你领！",
                    showCloseIcon: true,
                    modalData: result,
                    modalCallBack: () => {
                        judgeMemberStatus();
                    },
                });
            } else {
                postThroughoutVerification();
            }
        } else {

        }
    }
}
