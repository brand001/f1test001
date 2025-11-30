// reducers/AppReducer.js
import { combineReducers } from "redux";

// 创建一个高阶 reducer，用于处理 CLEAR_ALL_REDUX_DATA action
const createClearableReducer = (reducer) => {
    return (state, action) => {
        if (action.type === "CLEAR_ALL_REDUX_DATA") {
            return reducer(undefined, action);
        }
        return reducer(state, action);
    };
};

export const createAppReducer = () => {
    const isVN = window.LANGUAGE === "VN";

    const DepositReducer = isVN
        ? require("$CentralPayment/Deposit/M3/store/reducers/DepositReducer")
        : require("$CentralPayment/Deposit/M2/store/reducers/DepositReducer");

    const rootReducer = combineReducers({
        // 中心支付
        DepositMisc: DepositReducer?.DepositMisc ?? (() => null),
        MethodsDetails: DepositReducer?.MethodsDetails,
        Methods: DepositReducer?.Methods,
        MethodsActive: DepositReducer?.MethodsActive,
        DepositMoneyStatus: DepositReducer?.DepositMoneyStatus,
        DepositMemberBanks: DepositReducer?.DepositMemberBanks,
        BanksBankAccounts: DepositReducer?.BanksBankAccounts,
        DepositBankSearch: DepositReducer?.DepositBankSearch,
        DepositBankActive: DepositReducer?.DepositBankActive,
        DepositMemberBanksActive: DepositReducer?.DepositMemberBanksActive,
        DepositDateSelect: DepositReducer?.DepositDateSelect,
        UploadFileList: DepositReducer?.UploadFileList,
        UploadFileErr: DepositReducer?.UploadFileErr,
        DepositTimeSelect: DepositReducer?.DepositTimeSelect,
        DepositPayments: DepositReducer?.DepositPayments,
        DepositNextStep: DepositReducer?.DepositNextStep,
        DepositTimer: DepositReducer?.DepositTimer ?? (() => null),
        MethodCodeActive: DepositReducer?.MethodCodeActive,
        DepositSuccessPage: DepositReducer?.DepositSuccessPage,
        UploadFileStatus: DepositReducer?.UploadFileStatus,
        DepositCardNumber_CC: DepositReducer?.DepositCardNumber_CC,
        DepositCardPIN_CC: DepositReducer?.DepositCardPIN_CC,
        SuggestedAmounts: DepositReducer?.SuggestedAmounts,
        MemberCancelDeposit: DepositReducer?.MemberCancelDeposit,
        DepositOldBank: DepositReducer?.DepositOldBank,
        DepositOldBankSixNumberStatus: DepositReducer?.DepositOldBankSixNumberStatus,
        RemoveAllReducersState: DepositReducer?.RemoveAllReducersState,
        CopyKey: DepositReducer?.CopyKey,
        DepositAccountByAmount: DepositReducer?.DepositAccountByAmount,
        MemberInfo: DepositReducer?.MemberInfo,
        Announcement: DepositReducer?.Announcement,
        LoginOTP: DepositReducer?.LoginOTP,
        ReverseBankDefault: DepositReducer?.ReverseBankDefault ?? (() => null),
        DepositBouns: DepositReducer?.DepositBouns,
        DepositTriggerFrom: DepositReducer?.DepositTriggerFrom,
        LBOfflineRefNo: DepositReducer?.LBOfflineRefNo ?? (() => null),
        InvoiceExchangerate: DepositReducer?.InvoiceExchangerate ?? (() => ({})),
        DepositModal: DepositReducer?.DepositModal,

        // 非支付
        centralPayment: require("./CentralPaymentReducer").default,
        auth: require("./AuthReducer").default,
        profile: require("./ProfileReducer").default,
        scene: require("./SceneReducer").default,
        game: require("./GameReducer").default,
        userInfo: require("./UserInfoReducer").default,
        betCartInfo: require("./BetCartReducer").default,
        maintainStatus: require("./MaintainStatusReducer").default,
        routerLog: require("./RouterLogReducer").default,
        userSetting: require("./UserSettingReducer").default,
        gameInfo: require("./GameInfoReducer").default,
    });

    // 返回包装了清除功能的 reducer
    return createClearableReducer(rootReducer);
};
