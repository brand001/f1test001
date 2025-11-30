import React from "react";

import { translate } from "@/locales/translate";
import { Toasts } from "$Toasts";

import store from "@/lib/redux/store/index.js";

export const PostBonusCalculate = async function({ amount = "", wallet = "", bonusRuleGroupId, bonusId }) {
    let m = amount.toString().replace("đ", "");
    if (!(bonusRuleGroupId > 0 || bonusId > 0) || m <= 0) return;

    const params = {
        bonusMode: "Transfer",
        amount: m,
        wallet,
        couponText: "string",
        uasbleAmount: store.getState()?.userInfo?.uasbleAmount,
    };

    if (bonusRuleGroupId) {
        params.bonusRuleGroupId = bonusRuleGroupId;
    } else {
        if (bonusId) {
            params.bonusId = bonusId;
        }
    }

    let data = null;
    Toasts.loading(translate("加载中,请稍候..."));
    try {
        data = await fetchRequest(ApiPort.BonusCalculate, "POST", params);

        let { isSuccess = false, result = {} } = data;
        if (isSuccess) {
            // return data?.result?.previewMessage || data?.result?.errorMessage || ''
            // 帶優惠轉帳檢查成功不顯示提示訊息，失敗再給訊息，同mockup
            return result;
        } else {
            const errMsg = data?.errors[0]?.message || data?.errors[0]?.description || "";
            return errMsg;
        }
    } catch (err) {
        console.error("Error fetching bonus calculation:", err);
    } finally {
        Toasts.removeAll();
    }

    return null;
};
