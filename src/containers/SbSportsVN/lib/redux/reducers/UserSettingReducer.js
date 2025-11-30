import { ACTION_USERSETTING_UPDATE } from "../actions/UserSettingAction";

//用戶設置 全域數據
export const getInitialState = () => ({
    //盘口显示方式
    ListDisplayType: 1, //1纵向(默認) 2横向
    phonePrefix: {}, //手機號前綴
    selfExclusions: {
        selfExcludeSetDate: "",
        selfExcludeDuration: 0,
        disableDeposit: false,
        disableFundIn: false,
        disableBetting: false,
        betLimit: 0, // CXFUN88-5732 transferLimit 參數換成 --> betLimit
    }
});

const UserSettingReducer = (state = getInitialState(), action) => {
    switch (action.type) {
    case ACTION_USERSETTING_UPDATE: //更新數據
        //console.log('===usersetting update to : ', action.payload);
        return { ...state, ...action.payload };
    default:
        return state;
    }
};

export default UserSettingReducer;
