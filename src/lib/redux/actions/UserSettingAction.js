import { getInitialState } from "../reducers/UserSettingReducer";
import { ApiPortSB } from "$Utils/SbSportsBridge";
import Types from "./types";
import { Actions } from "react-native-router-flux";

//切換 盘口显示方式
export const ACTION_UserSetting_ToggleListDisplayType = () => {
    return (dispatch, getState) => {
        let currentType = getState().userSetting.ListDisplayType;
        let newType = 2;
        if (parseInt(currentType) === 2) {
            newType = 1;
        }

        const action = {
            type: Types.ACTION_USERSETTING_UPDATE,
            payload: { ListDisplayType: newType },
        };

        //console.log('===ACTION_UserSetting_ToggleListDisplayType',action);

        const actionDispatchPromise = dispatch(action);

        if (!getState().userInfo.isLogin) return actionDispatchPromise; //沒登入不用更新

        if (typeof window !== "undefined") {
            //防抖
            const debounce = (func, wait = 5, immediate = true) => {
                return () => {
                    const later = () => {
                        window.ACTION_UserSetting_ToggleListDisplayType_TimeOut = null;
                        if (!immediate && func) func();
                    };
                    const callNow = immediate && !window.ACTION_UserSetting_ToggleListDisplayType_TimeOut;
                    clearTimeout(window.ACTION_UserSetting_ToggleListDisplayType_TimeOut);
                    window.ACTION_UserSetting_ToggleListDisplayType_TimeOut = setTimeout(later, wait);
                    if (callNow && func) func();
                };
            };

            //配置 更新到服務器
            const UpdateServerSetting = newSettings => {
                //console.log('====newSettings', newSettings);

                //獲取memberCode
                const localMemberInfoJSON = localStorage.getItem("memberInfo");
                let localMemberInfo = {};
                if (localMemberInfoJSON) {
                    localMemberInfo = JSON.parse(localMemberInfoJSON);
                }
                let memberCode = localMemberInfo["memberCode"];
                if (memberCode) {
                    const defaultSetting = {
                        amount1: 99999,
                        amount2: 1000,
                        amount3: 100,
                        oddsType: "HK",
                        alwaysAcceptBetterOdds: true,
                        betSlipVibration: false,
                        betSlipSound: false,
                        goalNotification: true,
                        goalMyFavorite: true,
                        goalIBet: true,
                        goalAllRB: false,
                        goalSound: true,
                        goalSoundType: 1,
                        goalVibration: true,
                        listDisplayType: 1,
                    };

                    let updateData = defaultSetting;

                    const jsonString = localStorage.getItem("NotificationSetting-" + memberCode);
                    if (jsonString) {
                        const jsonData = JSON.parse(jsonString);
                        if (jsonData) {
                            updateData = Object.assign({}, defaultSetting, jsonData, newSettings);
                        }
                    }

                    //console.log('====updateData', JSON.parse(JSON.stringify(updateData)));

                    window.fetchRequest(ApiPortSB.EditMemberNotificationSetting, "POST", updateData)
                        .then(res => {
                            if (res.isSuccess == true) {
                                //更新緩存
                                localStorage.setItem("NotificationSetting-" + res.result.memberCode, JSON.stringify(updateData));
                            }
                        })
                        .catch(err => {
                            // console.log('API:' + ApiPort.EditMemberNotificationSetting + ' has error: ' + err);
                        });
                }
            };

            //防抖2秒，避免用戶切著玩
            const UpdateServerSettingWithDebounce = debounce(() => UpdateServerSetting({ listDisplayType: newType }), 2000, false);
            UpdateServerSettingWithDebounce();
        }

        return actionDispatchPromise;
    };
};

//手機號前綴
export const ACTION_PhoneSetting_Update = phonePrefix => {
    const action = {
        type: Types.ACTION_USERSETTING_UPDATE,
        payload: { phonePrefix: phonePrefix },
    };

    return action;
};

//用戶設置變更
export const ACTION_UserSetting_Update = newSetting => {
    const action = {
        type: Types.ACTION_USERSETTING_UPDATE,
        payload: newSetting,
    };

    return action;
};

//自我限制
export const ACTION_SelfExclusionsAction = () => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            fetchRequest(ApiPort.SelfExclusions, "GET")
                .then(res => {
                    if (res.isSuccess) {
                        dispatch({
                            type: Types.ACTION_USERSETTING_UPDATE,
                            payload: {
                                selfExclusions: res.result || getInitialState().selfExclusions,
                            },
                        });
                        resolve(res);
                    } else {
                        reject(new Error("不成功的響應"));
                    }
                })
                .catch(err => {
                    reject(err);
                });
        });
    };
};

export const ACTION_ONECLICKPOPUP = (data = {}) => {
    return (dispatch, getState) => {
        let tempData = getState().userSetting.oneClickPopup;
        let action = {
            type: Types.ACTION_USERSETTING_UPDATE,
            payload: {
                oneClickPopup: { ...tempData, ...data },
            },
        };
        return dispatch(action);
    };
};

export const ACTION_CMSMAINSITESTATUS = (flag = false) => {
    return async (dispatch, getState) => {
        let data = {
            sabaicoIsActive: false,
            smarticoIsActive: false,
            isAlreadyGoOtherPages: false,
            affiliateUrl: `https://www.h32lucky.com/${window.DefaultConfig?.Culture}/`,
        };
        let cmsMainsiteStatus = getState()?.userSetting?.cmsMainsiteStatus;
        if (flag) {
            data = {
                ...cmsMainsiteStatus,
                ...{ isAlreadyGoOtherPages: true },
            };
        } else {
            let res = await fetchRequestCMS(`${Strapi_Domain + ApiPort.GETcsjackpotStatus}`, "GET");

            try {
                if (res?.isSuccess) {
                    data = {
                        ...res?.result,
                        ...{
                            isAlreadyGoOtherPages: cmsMainsiteStatus.isAlreadyGoOtherPages,
                        },
                    };
                } else {
                }
            } catch (err) {}
        }

        let action = {
            type: Types.ACTION_USERSETTING_UPDATE,
            payload: {
                cmsMainsiteStatus: data,
            },
        };
        return dispatch(action);
    };
};

export const ACTION_RouterName = (routerName = "") => {
    if (routerName == "") return;
    let action = {
        type: Types.ACTION_USERSETTING_UPDATE,
        payload: {
            routerName: routerName,
        },
    };

    return action;
};

//清空
export const ACTION_ClearSelfExclusions = () => {
    const action = {
        type: Types.ACTION_USERSETTING_UPDATE,
        payload: { selfExclusions: getInitialState().selfExclusions },
    };
    return action;
};

// sb bet cart one click popup
export const ACTION_SbBetCartTransferPopup = flag => {
    console.log("flag", flag);
    return (dispatch, getState) => {
        const action = {
            type: Types.ACTION_USERSETTING_UPDATE,
            payload: {
                sbBetCartTransferPopup: flag === "close" ? false : !getState().userSetting.sbBetCartTransferPopup,
            },
        };
        return dispatch(action);
    };
};

// 登录之后启动特定游戏或特定页面
export const ACTION_LoginAfterCallBack = loginCallBackFunObj => {
    let action = {
        type: Types.ACTION_USERSETTING_UPDATE,
        payload: {
            loginCallBackFunObj,
        },
    };

    return action;
};

// 教程管理器索引更新
export const ACTION_TutorialManagerIndex = (index = -1, hasCache = false) => {
    let currentScene = Actions.currentScene?.toLowerCase();

    // 如果不在 home 頁面或未登入，返回空 action
    if (!(currentScene.includes("home") && ApiPort.UserLogin)) {
        return {
            type: Types.ACTION_USERSETTING_UPDATE,
            payload: {
                tutorialManager: {
                    index: -1,
                    hasCache: false,
                },
            },
        };
    }

    // 如果已经有缓存，不执行引导
    if (hasCache) {
        return {
            type: Types.ACTION_USERSETTING_UPDATE,
            payload: {
                tutorialManager: {
                    index: -1, // 不执行引导
                    hasCache: true, // 设置缓存状态
                },
            },
        };
    }

    let action = {
        type: Types.ACTION_USERSETTING_UPDATE,
        payload: {
            tutorialManager: {
                index: index,
                hasCache: false, // 没有缓存
            },
        },
    };

    return action;
};
