import { ActionConst } from "react-native-router-flux";

import { PROFILE_UPDATED } from "./ProfileAction";
export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
/**
 * This Action Creator can be used without `redux-thunk` middleware
 * Note that it accepts `dispatch` arguments
 */
export const login = (dispatch, loginDetails) => {
    //const url = 'http://192.168.43.147/login.json';

    console.log(loginDetails);
    const payload = {
        authToken: "111111111",
        email: loginDetails.email,
    };
    let action = {
        type: LOGIN,
        payload,
    };
    dispatch(action);

    // change scene
    action = {};
    action.type = ActionConst.FOCUS;
    action.payload = "drawer";
    dispatch(action);
    // set profile
    action = {};
    action.type = PROFILE_UPDATED;
    action.payload = "2222";
    dispatch(action);
};
export const logout = (loginDetails = "login") => {
    return dispatch => {
        // 清空登录信息
        dispatch({
            type: LOGOUT,
            payload: {
                authToken: "",
                email: "",
            },
        });

        // 切换页面场景
        dispatch({
            type: ActionConst.FOCUS,
            payload: loginDetails === "home" ? "home" : "login",
        });

        // 清空 profile
        dispatch({
            type: PROFILE_UPDATED,
            payload: "",
        });
    };
};
