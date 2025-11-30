import Types from "../actions/types";

//用戶設置 全域數據
export const getInitialState = () => ({
    //盘口显示方式
    ListDisplayType: 1, //1纵向(默認) 2横向
    phonePrefix: {}, //手機號前綴
    selfExclusions: {
        selfExcludeSetDate: new Date(),
        selfExcludeDuration: 0,
        disableDeposit: false,
        disableFundIn: false,
        disableBetting: false,
        betLimit: 0, // CXFUN88-5732 transferLimit 參數換成 --> betLimit
    },
    sbTransferPopup: false,
    sbBetCartTransferPopup: false, // sb bet card transfer pop up
    oneClickPopup: {
        flag: false,
        walletCode: "SB",
    },
    cmsMainsiteStatus: {
        sabaicoIsActive: true,
        smarticoIsActive: true,
        isAlreadyGoOtherPages: false,
        affiliateUrl: `https://www.h32lucky.com/${window.DefaultConfig?.Culture}/`,
    },
    loginCallBackFunObj: {
        callBack: () => {},
    },
    routerName: "",
    tutorialManager: {
        index: -1, // -1: 不显示，0: HomeHeader显示，1: TabIcon显示
        hasCache: true, // 是否有缓存，用于控制是否执行引导
    },
});

const UserSettingReducer = (state = getInitialState(), action) => {
    switch (action.type) {
        case Types.ACTION_USERSETTING_UPDATE: //更新數據
            //console.log('===usersetting update to : ', action.payload);
            return { ...state, ...action.payload };
        default:
            return state;
    }
};

export default UserSettingReducer;
