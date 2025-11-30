import Types from "../actions/types";

//用戶全域數據
export const getInitialState = () => ({
    //是否已登入
    isLogin: false,
    //用戶名
    userName: "",
    //SB餘額
    balanceSB: 0,
    //總餘額
    balanceTotal: 0,
    //是否正在刷新餘額
    isGettingBalance: false,
    //所有餘額
    allBalance: [],
    balanceObj: {
        MAIN: {
            walletProductGroupId: 1,
            walletProductGroupName: "Tổng Số Dư",
            balance: 0,
            lockedBalance: 0,
            usableAmount: 0,
            walletProductGroupCode: "MAIN",
        },
        SB: {
            walletProductGroupId: 2,
            walletProductGroupName: "Thể Thao / Esports ",
            balance: 0,
            lockedBalance: 0,
            usableAmount: 0,
            walletProductGroupCode: "SB",
        },
        LD: {
            walletProductGroupId: 4,
            walletProductGroupName: "Casino",
            balance: 0,
            lockedBalance: 0,
            usableAmount: 0,
            walletProductGroupCode: "LD",
        },
        P2P: {
            walletProductGroupId: 24,
            walletProductGroupName: "3D Casino / Game Siêu Tốc / Bắn Cá",
            balance: 0,
            lockedBalance: 0,
            usableAmount: 0,
            walletProductGroupCode: "P2P",
        },
        SLOT: {
            walletProductGroupId: 32,
            walletProductGroupName: "Slots",
            balance: 0,
            lockedBalance: 0,
            usableAmount: 0,
            walletProductGroupCode: "SLOT",
        },
        KENO: {
            walletProductGroupId: 64,
            walletProductGroupName: "Xổ Số",
            balance: 0,
            lockedBalance: 0,
            usableAmount: 0,
            walletProductGroupCode: "KENO",
        },
    },
    totalContractBalance: 0,
    withdrawableBalance: 0,
    uasbleAmount: 0,
    isToggleBalance: false,
    memberInfo: {},
    memberNewInfo: {},
    referreeTaskStatus: {},
});

const UserInfoReducer = (state = getInitialState(), action) => {
    switch (action.type) {
        case Types.ACTION_USERINFO_UPDATE: //更新數據
            //console.log('===userinfo update to : ', action.payload);
            return { ...state, ...action.payload };
        default:
            return state;
    }
};

export default UserInfoReducer;
