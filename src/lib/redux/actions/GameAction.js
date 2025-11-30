import { Buffer } from "buffer";
import CryptoJS from "crypto-js";
import { Actions } from "react-native-router-flux";

import { GetGlobalModal } from "$Utils/globalModal";
import { allowGuestCode, MIN_LIMIT_MONEY } from "$LIB/data/game";
import { translate } from "$locales/translate";
import { removeVendorToken } from "$Utils/SbSportsBridge";

import { PiwikEventDataHandle } from "@/actions/PiwikEventData";


import { Toasts } from "$Toasts";
import { CheckLogin, GameLockToast, GetSelfExclusionPopup, GetLaunchGameCode } from "$Utils";
import Types from "./types";
import store from "@/lib/redux/store/index.js";
import RecentPlayed from "$ALLSHARED_UTILS/GameUtil/recentPlayed/index";

// 清空
export const ACTION_ClearGameInfo = () => {
    const action = {
        type: Types.ACTION_GAMES_UPDATE,
        payload: {}
    };

    return action;
};

// 啟動遊戲
// checkAnn 是否檢查公告，只有sb和keno會是true
// sportPopup 顯示體育彈窗

export function ACTION_PlayGame(gameInfo) {

    let {
        categoryCode = "",
        providerCode = "",
        gameName = "",
    } = gameInfo;




    categoryCode = categoryCode?.toLocaleUpperCase();
    return async dispatch => {
        providerCode = providerCode?.toLocaleUpperCase() || "";



        if (!allowGuestCode?.includes(providerCode)) {
            if (CheckLogin()) return Promise.resolve();
        }

        //自我限制CXFUN88-3816
        let isSelfExclusionPopup = await GetSelfExclusionPopup();
        if (isSelfExclusionPopup) return Promise.resolve();

        if (GameLockToast()) return Promise.resolve();
        const state = store.getState();
        const balanceTotal = state?.userInfo?.balanceTotal;
        if ((balanceTotal < MIN_LIMIT_MONEY[window.LANGUAGE] && ApiPort.UserLogin)) {
            GetGlobalModal({
                title: translate("余额提醒"),
                message: translate("您的可用余额低于10 元 。请向您的账户存入更多资金，以获得舒适流畅的投注体验。"),
                confirmText: translate("立即存款"),
                onConfirm: () => {
                    Actions.DepositCenter({
                        from: "GamePage",
                        isTriggeredByInsufficientFlow: true,
                        returnToGame: () => {
                            Actions.pop();
                            return LaunchGame({
                                gameInfo,
                                dispatch
                            });
                        }
                    });

                    PiwikEventDataHandle({
                        category: `${categoryCode}`,
                        action: "Go to Deposit",
                        name: `${categoryCode}_BalanceReminder_Popup_C_Deposit`,
                        path: `${categoryCode}_balance_reminder_popup`,
                        title: `${categoryCode} Balance Reminder Popup`,

                        customProperties: {}
                    });
                },
                cancelText: translate("启动游戏"),
                onCancel: () => {
                    PiwikEventDataHandle({
                        category: `${categoryCode}`,
                        action: `Launch Game ${gameName || categoryCode}`,
                        name: `${categoryCode}_BalanceReminder_Popup_C_${providerCode}_Game`,
                        path: `${categoryCode}_balance_reminder_popup`,
                        title: `${categoryCode} Balance Reminder Popup`,
                        customProperties: {
                            [`${categoryCode}_BalanceReminder_Popup_C_${providerCode}_GameName`]: gameName || categoryCode
                        }
                    });
                    return LaunchGame({
                        gameInfo,
                        dispatch
                    });
                },
            });
            return Promise.resolve();
        }

        return LaunchGame({
            gameInfo,
            dispatch
        });

    };
}
export async function LaunchGame({
    gameInfo = {},
    dispatch = () => {}
}) {

    const isDemo = !ApiPort.UserLogin;
    let {
        gameId = null,
        categoryCode = "",
        from = "",
        isJackPot = false,
        providerCode = "",
        isReloadGame = false,
        gameName = ""
    } = gameInfo;

    let params = {};

    switch (providerCode) {
        case "SBT":
            params = {
                providerCode: providerCode,
                isDemo: isDemo,
                hostName: SBTDomain,
                sportsMenu: "",
                vendorQuery: "",
                mobileLobbyUrl: SBTDomain,
                bankingUrl: SBTDomain,
                logoutUrl: SBTDomain + "/accessdenied",
                sportid: "",
                eventId: "",
            };
            break;

        case "TGP":
        case "TG":
        case "JKR":
            params = {
                providerCode: providerCode + "_" + categoryCode,
                isDemo: isDemo,
                // 測試環境AGL，要帶http才能開
                hostName: window.isStaging === "ST" ? common_url.replace("https", "http") : common_url,
                sportsMenu: "",
                vendorQuery: "",
                mobileLobbyUrl: common_url,
                bankingUrl: common_url,
                logoutUrl: common_url + "/accessdenied",
                sportid: "",
                eventId: "",
            };
            break;

        default:
            params = {
                providerCode: providerCode,
                isDemo: isDemo,
                // 測試環境AGL，要帶http才能開
                hostName: window.isStaging === "ST" && ["AGL", "NLE", "GPI", "SAL", "AG", "JIF", "JIR"].includes(providerCode) ? common_url.replace("https", "http") : common_url,
                sportsMenu: "",
                vendorQuery: "",
                mobileLobbyUrl: common_url,
                bankingUrl: common_url,
                logoutUrl: common_url + "/accessdenied",
                sportid: "",
                eventId: "",
            };
            break;
    }

    if (gameId) {
        params.gameId = gameId;
    }

    params.gameCode = await GetLaunchGameCode(gameInfo);

    if (categoryCode?.toLocaleUpperCase() == "SLOT") {
        params.recommendationId = gameInfo?.zAImeta?.recommendationId || "";
        params.position = gameInfo?.index;
        params.category = gameInfo?.position || "";
    }

    //處理sb2.0遊戲token (開官方網頁版，會刷掉先前獲取的token)
    const codeToSportMapping = { IPSB: "im", OWS: "saba", SBT: "bti" };
    const targetSport = codeToSportMapping[providerCode];
    if (targetSport) {
        removeVendorToken(targetSport);
    }



    Toasts.loading(translate("正在启动游戏,请稍候..."), 2000);

    return fetchRequest(ApiPort.Games + `isDemo=${isDemo}&`, "POST", params)
        .then(res => {
            Toasts.removeAll();
            let { isSuccess = false, result = {} } = res;
            let { isGameMaintenance = false, accessDenied = false, gameLobbyUrl = "", contents = {} } = result;
            if (isSuccess) {

                if (isGameMaintenance) {
                    GetGlobalModal({
                        title: translate("维护中"),
                        showCloseIcon: true,
                        message: translate("我们的游戏正在更新全新内容，只为您打造更好的体验！请稍后再来查看"),
                        confirmText: translate("我知道了(维护中)"),
                        onConfirm: () => {},
                    });
                    return Promise.resolve();
                }

                if (accessDenied) {
                    Toasts.fail(translate("拒绝访问"), 2);
                    return Promise.resolve();
                }

                let gameUrl = gameLobbyUrl;

                if (providerCode === "PGS" && contents?.body) {
                    let body = contents?.body;
                    gameUrl = CryptoJS?.enc?.Base64?.parse(body)?.toString(CryptoJS.enc.Utf8) || new Buffer(body, "base64").toString();
                }
                if (!isReloadGame) {
                    if (gameUrl?.length) {
                        const sceneKey = from === "sb" ? "SbAirCraftWrap" : "GamePage";
                        Actions[sceneKey]({
                            isJackPot,
                            providerCode: providerCode,
                            categoryCode: categoryCode,
                            gameInfo,
                            gameRescult: result || {},
                            gameParams: params
                        });
                    }
                }

                dispatch({
                    type: Types.ACTION_GAMES_UPDATE,
                    payload: {
                        GameOpenUrl: gameUrl
                    }
                });



                try {
                    if (categoryCode?.toLocaleUpperCase() == "SLOT") {
                        RecentPlayed.add({ ...gameInfo, langauage: window.LANGUAGE }, "Slot");
                    }
                } catch (error) {

                }

                // PiwikEventDataHandle({
                //     category: `${categoryCode}_Lobby`,
                //     action: `Launch Game ${gameName}`,
                //     name: `${categoryCode}_Lobby_C_${providerCode}_Game`,
                //     title: "Home",
                //     path: "home",
                //     customProperties: {
                //         [`${categoryCode}_Lobby_C_${providerCode}_GameName`]: gameName,
                //         [`${categoryCode}_Lobby_C_GameSession`]: ""
                //     }
                // });

                return Promise.resolve({
                    success: true,
                    gameUrl: gameUrl,
                    result: result
                });
            } else {
                let message = res?.errors[0]?.message;
                Toasts.fail(message || "");
                return Promise.resolve();
            }
        }).catch(error => {
            Toasts.removeAll();
            return Promise.reject();
        });
}

// Aviator遊戲資料
export const ACTION_AviatorGameData = data => {
    const action = {
        type: Types.ACTION_GAMES_UPDATE,
        payload: {
            sprHotGame: data,
        },
    };

    return action;
};
