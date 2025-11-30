import { Linking } from "react-native";
import { Actions } from "react-native-router-flux";

import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import actions from "@/lib/redux/actions/index";
import { CheckLogin, GoSmartico, LiveChatOpenGlobe, GetSelfExclusionPopup } from "$Utils";

import store from "@/lib/redux/store/index.js";
import { ProductGamePageGameMap } from "@/lib/data/game";
import { useGame, usePromotion } from "./index";
import { useApp, ActionTypes } from "@/contexts/AppContext";


/**
 * Banner 動作相關的自定義 Hook
 * 提供優惠點擊動作處理功能和遊戲 Banner 數據管理
 */
const useBanner = () => {
    const { getCategoryCode } = useGame();
    const { getPromotionStatusDetail } = usePromotion();
    const { gameBanner, _dispatch } = useApp();

    /**
     * 處理 Banner 點擊動作
     * @param item 優惠資料
     * @param from 從哪頁過來 例:Home, Profile
     * @param type 類型 例：Feature
     *
     * actionId: 28 = actionName: "Link To"
     * actionId: 29 = actionName: "Promotion"
     * actionId: 30 = actionName: "Sponsorship"
     * actionId: 31 = actionName: "Deposit"
     * actionId: 32 = actionName: "Launch Game"
     * actionId: 33 = actionName: "Live Chat"
     * actionId: 34 = actionName: sportLaunchType＝HOME - 直接打開體育首頁    DEEPLINK 打开具体的SB特定页面
     * actionId: 0 = actionName: "No Action"
     *
     * @returns {void|*}
     */
    const onBannerClick = async (item) => {
        const action = item.action;

        if (!action) {
            return;
        }

        switch (action.actionId) {
            case 0:
                return;

            case 202211:
                if (action.matchInfo && action.matchInfo.event_id) {
                    window.openSB20Detail("im", 1, action.matchInfo.event_id * 1, 30455);
                }
                break;

            case 34: {
                if (window.LANGUAGE == "TH") return;
                let isSelfExclusionPopup = await GetSelfExclusionPopup();
                if (isSelfExclusionPopup) return true;

                let sportLaunchTypeUpperCase = action?.sportLaunchType?.toLocaleUpperCase();
                let sportUIType = action?.sportUIType?.toLocaleUpperCase();
                if (sportLaunchTypeUpperCase == "HOME") {
                    if (sportUIType.includes("IM")) {
                        Actions.SbSports({ sbType: "IPSB" });
                    } else {
                        Actions.SbSports({ sbType: "OWS" });
                    }
                } else if (sportLaunchTypeUpperCase == "DEEPLINK") {
                    if (action?.sportId && action?.leagueId && action?.eventId) {
                        window.openSB20Detail("im", action?.sportId * 1, action?.eventId * 1, action?.leagueId * 1);
                    }
                }
                break;
            }

            case 28:
                linkToAction(action);
                break;

            case 29:
                getPromotionStatusDetail({ promotionId: action.ID });
                break;
            case 30:
                Actions.Sponsor();
                break;

            case 31: {
                if (CheckLogin()) return;
                let isSelfExclusionPopup = await GetSelfExclusionPopup();
                if (isSelfExclusionPopup) return true;

                Actions.DepositCenter();
                return;
            }

            case 32: {
                let cgmsVendorCode = action?.cgmsVendorCode;
                let categoryCode = getCategoryCode(cgmsVendorCode)?.toLocaleUpperCase();

                let categoryCodeArr = ["SPORTSBOOK", "ESPORTS"];
                if (categoryCodeArr?.includes(categoryCode)) {
                    store.dispatch(
                        actions.ACTION_PlayGame({
                            providerCode: cgmsVendorCode,
                            gameId: action?.gameId || null,
                            categoryCode: categoryCode,
                        }),
                    );
                    return;
                }

                let launchMode = action?.launchMode;

                if (launchMode == "lobby") {
                    gameLobbyAction(action);
                    return;
                }

                if (launchMode == "web_view") {
                    if (cgmsVendorCode == "SPR") {
                        if (CheckLogin()) return;
                        window.getAviator();
                        return;
                    } else {
                        gameLobbyAction(action);
                        return;
                    }
                }

                if (launchMode == "game_id") {
                    let categoryCode = getCategoryCode(cgmsVendorCode);
                    store.dispatch(
                        actions.ACTION_PlayGame({
                            providerCode: cgmsVendorCode,
                            gameId: action?.gameId,
                            categoryCode,
                        }),
                    );
                    return;
                }
                break;
            }

            case 33:
                LiveChatOpenGlobe();
                break;

            default:
                break;
        }
    };

    const gameLobbyAction = async (action) => {
        let providerCode = action?.cgmsVendorCode;
        let categoryCode = getCategoryCode(providerCode);
        if (ProductGamePageGameMap[window.LANGUAGE]?.includes(categoryCode?.toLocaleUpperCase())) {
            Actions.GameFilterPage({
                categoryCode,
                providerCode,
                presetConditionConfig: {
                    routeType: "provider",
                    presetCondition: providerCode
                }
            });
            return;
        }
    };

    const linkToAction = action => {
        console.log("action.url ", action.url);

        if (action?.url.includes("questhub") || action?.url.includes("rewards")) {
            GoSmartico({ isLoginCallBack: true });
            return;
        }

        if (["/fishing", "/depositCTC"]?.includes(action.url)) {
            if (CheckLogin()) return;
        } else if (action?.url) {
            const upperUrl = action.url.toLocaleUpperCase();

            if (upperUrl.includes("LABORDAY")) {
                PiwikEventDataHandle({
                    category: "Home",
                    action: "Click Banner (Laborday)",
                    name: "Home_C_LaborDay2024",
                    path: "",
                    title: "",
                });
                Actions.Lottery();
                return;
            } else if (action.url.indexOf("event_MidAutumn2022") !== -1) {
                Actions.PoppingGame();
                return;
            } else if (action.url.indexOf("CNY2023") !== -1) {
                Actions.CNY2023();
                return;
            } else if (action.url.indexOf("/event_15thAnni2023") !== -1) {
                Actions.Anniversary();
                return;
            } else if (action.url.indexOf("nationalday2022") !== -1) {
                Actions.GoldenWeek();
                return;
            } else if (action.url.indexOf("WC2022") !== -1) {
                //Actions.WorldCup();
                return;
            } else if (upperUrl.includes("EURO")) {
                Actions.LotteryEuro({});
                PiwikEventDataHandle({
                    category: "Home",
                    action: "Click Banner (Euro2024)",
                    name: "Home_C_Euro2024",
                    path: "",
                    title: "",
                });
            } else if (!["/fishing", "/depositCTC"].includes(action.url)) {
                if (!action.url.match(/https|http/gi)) {
                    Linking.openURL(SBTDomain + action.url);
                } else {
                    Linking.openURL(action.url);
                }
                return;
            }
        }
    };

    /**
     * 從 API 獲取遊戲 Banner 數據並更新到 Context
     * @param {boolean} forceUpdate - 是否強制更新，默認 false
     * @returns {Promise<Array>} Banner 數據數組
     */
    const updateGameBanner = async (forceUpdate = false) => {
        try {
            const login = ApiPort.UserLogin ? "after" : "before";
            const data = await fetchRequestCMS(`${Strapi_Domain + ApiPort.CMS_ProductLobby}?login=${login}&`, "GET");

            if (Array.isArray(data) && data.length > 0) {
                // 更新 Context 中的數據
                _dispatch({
                    type: ActionTypes.SET_GAME_BANNER,
                    payload: data
                });

                return data;
            } else {
                return [];
            }
        } catch (error) {
            console.error("獲取遊戲 Banner 失敗:", error);
            return gameBanner || [];
        }
    };

    /**
     * 獲取特定的 Banner 數據
     * @param {string} categoryCode - 分類代碼，可選
     * @returns {Array} 過濾後的 Banner 數據
     */
    const getGameBanner = (categoryCode = null) => {
        if (!gameBanner) {
            return [];
        }

        // 如果沒有指定分類代碼，返回所有數據
        if (!categoryCode) {
            return gameBanner;
        }
        categoryCode = categoryCode?.toLocaleUpperCase();
        // 根據分類代碼過濾數據
        const normalizedCategoryCode = categoryCode === "KENOLOTTERY" ? "KENO" : categoryCode;

        return gameBanner.filter(item => {
            const category = item.gameLobbyCategory?.toLowerCase().replace(/\s+/g, "");
            return category === normalizedCategoryCode.toLowerCase().replace(/\s+/g, "");
        });
    };

    return {
        onBannerClick,
        gameLobbyAction,
        linkToAction,
        updateGameBanner,
        getGameBanner,
        gameBanner
    };
};

// 保持向後兼容性，導出一個默認的 hook 實例
export default useBanner;
export { useBanner };
