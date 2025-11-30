import moment from "moment";

// 👉 Central Payment 模組開關
export const ACTION_TOGGLE_CENTRAL_PAYMENT = "TOGGLE_CENTRAL_PAYMENT";
export const ACTION_FORCE_TOGGLE_CENTRAL_PAYMENT = "ACTION_FORCE_TOGGLE_CENTRAL_PAYMENT";
export const ACTION_SET_DEPOSIT_STEP_TWO_DETAILS = "SET_DEPOSIT_STEP_TWO_DETAILS";
export const ACTION_SET_CENTRAL_PAYMENT_STATUS = "SET_CENTRAL_PAYMENT_STATUS";

// 強制設定中心化開關
export const ACTION_ForceToggleCentralPayment = (useCentralPayment = false) => {
    return {
        type: ACTION_FORCE_TOGGLE_CENTRAL_PAYMENT,
        payload: useCentralPayment,
    };
};

// 切換是否使用新 central-payment 模組
export const toggleCentralPayment = (useNewModule) => ({
    type: ACTION_TOGGLE_CENTRAL_PAYMENT,
    payload: useNewModule, // true: 使用新模組(central-payment), false: 使用舊模組
});

/**
 * 設定 Central Payment 完整狀態資料
 * @param {Object} statusData - API 回應的完整數據
 * @returns 
 */
export const Actions_setCentralPaymentStatus = (statusData) => ({
    // const result = {
    //     "isSuccess": true,
    //     "result": true,
    //     "paymentRiskList": [
    //         // "VVIP",
    //         "VIP",
    //         "Loyal1",
    //         "Loyal2",
    //         "New/Not Qualify 1",
    //         "New/Not Qualify 2",
    //         "New/Not Qualify 3",
    //         "VIPTrial",
    //         "Testing",
    //         "DORMANT",
    //         "AffiliateMember",
    //         "Troublemaker",
    //         "NOPII",
    //         "VVVIP",
    //         "ZDEP",
    //         "Newcrypto2",
    //         "Crypto3",
    //         "Newcrypto1",
    //         "Crypto2",
    //         "Crypto1",
    //         "New/Not Qualify 4"
    //     ],
    //     "updateTime": "2025-07-18T08:29:43.680Z"
    // };
    type: ACTION_SET_CENTRAL_PAYMENT_STATUS,
    payload: statusData, // { isSuccess, result, paymentRiskList, updateTime }
});


/**
 * 取得存款步驟二進行中的詳細資料
 * @returns 
 */
export const actions_fetchDepositStepTwoInProgressDetails = () => {
    /**
     * 設定存款步驟二進行中的詳細資料
     * @param {Object} details 詳細資料
     * @returns 
     */
    const setDepositStepTwoDetails = (details) => ({
        type: ACTION_SET_DEPOSIT_STEP_TWO_DETAILS,
        payload: details,
    });
    return async (dispatch) => {
        try {
            const res = await fetchRequest(ApiPort.GetDepositStepTwoInProgressDetails, "GET");

            // 若後端回傳失敗(isSuccess=false) 視同錯誤直接進 catch
            if (!res?.isSuccess) {
                throw new Error(res?.result?.message || "API response isSuccess=false");
            }

            const result = res?.result || [];
            // const result = [ // 測試用
            //     {
            //         "dynamicObject": {
            //             "TimeoutSetting": 900,
            //             "TimeoutAt": "2025-11-10T15:26:32.472Z",
            //             "RemainingCountdownTime": "00:14:58.4160000",
            //             "MemberBankBankAccountID": 323564,
            //             "MemberBankAccount": {
            //                 "AccountHolderName": "paymentthb",
            //                 "AccountNumber": "1653872441",
            //                 "BankName": "Kasikorn Bank"
            //             },
            //             "Amount": 100.0,
            //             "PaymentMethodId": "LB",
            //             "MethodType": "DEFAULT",
            //         }
            //     },
            //     {
            //         "dynamicObject": {
            //             "TimeoutSetting": 900,
            //             "TimeoutAt": "2025-11-10T15:26:32.472Z",
            //             "RemainingCountdownTime": "00:14:58.4160000",
            //             "MemberBankBankAccountID": 323564,
            //             "MemberBankAccount": {
            //                 "AccountHolderName": "paymentthb",
            //                 "AccountNumber": "1653872441",
            //                 "BankName": "Kasikorn Bank"
            //             },
            //             "Amount": 100.0,
            //             "PaymentMethodId": "QD",
            //             "MethodType": "DEFAULT",
            //         }
            //     }
            // ];

            if (Array.isArray(result) && result?.length) {
                const now = moment();
                const offlinePaymentMethods = ["LB", "QD", "LBQR", "BQR"];
                const filterData = result
                    .map(item => {
                        const { dynamicObject = {} } = item || {};
                        if (!dynamicObject) return null;
                        const { TimeoutAt, PaymentMethodId } = dynamicObject;
                        const endTime = TimeoutAt ? moment(TimeoutAt) : null;
                        const ongoingDeposit = endTime ? endTime.isAfter(now) : false;
                        return offlinePaymentMethods.includes(PaymentMethodId?.toUpperCase())
                            ? { ...dynamicObject, ongoingDeposit }
                            : null;
                    })
                    .filter(Boolean);

                const payload = {
                    ongoingPayments: filterData,
                };

                // payload.ongoingPayments 有任一 ongoingDeposit 為 true 就設 true
                const ongoingDeposit = filterData.some(item => item.ongoingDeposit);
                dispatch(setDepositStepTwoDetails({ ...payload, ongoingDeposit }));
            } else {
                const payload = {
                    ongoingDeposit: false,
                };
                dispatch(setDepositStepTwoDetails(payload));
            }
        } catch (error) {
            console.log("fetchDepositStepTwoInProgressDetails error, fallback to mock:", error);

            // 顯示錯誤訊息
            const errorMessage = error?.message || "獲取存款詳情失敗";

            const payload = {
                ongoingDeposit: false,
                error: errorMessage
            };
            dispatch(setDepositStepTwoDetails(payload));
        }
    };
}; 
