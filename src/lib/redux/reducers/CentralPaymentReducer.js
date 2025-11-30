import { ACTION_TOGGLE_CENTRAL_PAYMENT, ACTION_SET_DEPOSIT_STEP_TWO_DETAILS, ACTION_SET_CENTRAL_PAYMENT_STATUS, ACTION_FORCE_TOGGLE_CENTRAL_PAYMENT } from "../actions/CentralPaymentAction";

const initialState = {
    useCentralPayment: false, // 預設
    forceToggleCentralPayment: false, // 強制切換中心化開關, 用於測試
    centralPaymentStatus: { // 中央支付狀態
        isSuccess: false,
        result: false,
        paymentRiskList: [],
        updateTime: null
    },
    depositStepTwoDetails: {}, // 存款步驟二進行中的詳細資料
};

const centralPaymentReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTION_TOGGLE_CENTRAL_PAYMENT:
            return { ...state, useCentralPayment: action.payload };
        case ACTION_FORCE_TOGGLE_CENTRAL_PAYMENT: // 測試用
            return {
                ...state,
                forceToggleCentralPayment: action.payload,
            };
        case ACTION_SET_DEPOSIT_STEP_TWO_DETAILS:
            return { ...state, depositStepTwoDetails: action.payload };
        case ACTION_SET_CENTRAL_PAYMENT_STATUS:
            return {
                ...state,
                centralPaymentStatus: action.payload,
                // 同時更新 useCentralPayment 以保持向後相容
                useCentralPayment: action.payload?.result || false
            };
        default:
            return state;
    }
};

export default centralPaymentReducer;
