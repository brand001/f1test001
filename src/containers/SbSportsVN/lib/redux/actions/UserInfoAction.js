import { getInitialState } from "../reducers/UserInfoReducer";
import { Decimal } from "decimal.js";
import { ApiPortSB } from "../../SPORTAPI";

export const ACTION_USERINFO_UPDATE = "ACTION_USERINFO_UPDATE";

//用戶登入
export const ACTION_UserInfo_login = (userName) => {
    const payload = { ...getInitialState(), isLogin: true, userName: userName };
    const action = {
        type: ACTION_USERINFO_UPDATE,
        payload: payload,
    };
    return action;
};

//用戶登出
export const ACTION_UserInfo_logout = () => {
    const action = {
        type: ACTION_USERINFO_UPDATE,
        payload: getInitialState(),
    };

    return action;
};

export const ACTION_UserInfo_updateBalanceSB = (newBalanceSB) => {
    const action = {
        type: ACTION_USERINFO_UPDATE,
        payload: { balanceSB: newBalanceSB },
    };

    return action;
};

