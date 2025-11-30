import React from "react";
import { useSelector } from "react-redux";
import { SmarticoProvider, useSmartico } from "./SmarticoContext";
import SmarticoGame from "./game";
import store from "@/lib/redux/store/index.js";
import actions from "@/lib/redux/actions/index";
import { translate } from "@/locales/translate";
import { Toasts } from "$Toasts";
import { GoSmartico } from "$Utils";
import { Actions } from "react-native-router-flux";

// 內部組件：使用 Context 獲取參數（定義在外部，避免每次重新創建）
// const SmarticoContent = ({
//     smarticoBrandKey,
//     smarticoLabelKey,
//     smarticoLanguage,
//     smarticoDomain,
//     smarticoUrl,
//     smarticoBaseUrl,
//     onSmarticoPlayGame,
//     onSmarticoErr,
//     onSmarticoPop
// }) => {
//     const { params } = useSmartico();

//     return (
//         <SmarticoGame
//             smarticoBaseUrl={smarticoBaseUrl}
//             smarticoBrandKey={smarticoBrandKey}
//             smarticoLabelKey={smarticoLabelKey}
//             smarticoLanguage={smarticoLanguage}
//             smarticoDomain={smarticoDomain || smarticoUrl}
//             smarticoParams={params}
//             smarticoMemberCode={window.memberCode}
//             smarticoUserLogin={window.ApiPort?.UserLogin}
//             onSmarticoPlayGame={onSmarticoPlayGame}
//             onSmarticoErr={onSmarticoErr}
//             onSmarticoPop={onSmarticoPop}
//         />
//     );
// };

// 主組件：自己包裹 Provider，完全自包含，開袋即用
const Smartico = () => {
    const smarticoLabelKey = window.isStaging === "ST" ? "f431c8e7-f95b-447c-b02c-d1c74e91a50c-5" : "6ad0eca6-51c2-4e71-bdb2-f85a3b33088d-5";
    const smarticoBrandKey = window.isStaging === "ST" ? "1fad10fb" : "e620af5f";

    // 語言配置 map
    const languageConfigMap = {
        VN: {
            language: "'vi'",
            domain: "https://libs.smartico.ai/smartico.js",
        },
        CN: {
            language: "'zh'",
            domain: "https://libs-smartico-ai.wanfbaba098.com/s7.js",
        },
        TH: {
            language: "'th'",
            domain: "https://libs.smartico.ai/smartico.js",
        },
    };

    const smarticoLanguage = languageConfigMap[window.LANGUAGE]?.language || "'zh'";
    const smarticoUrl = languageConfigMap[window.LANGUAGE]?.domain || "https://libs-smartico-ai.wanfbaba098.com/s7.js";

    //const smarticoDomain = useSelector(state => state.userSetting)?.cmsMainsiteStatus?.smarticoDomain;

    // 處理 ach_game_opening 事件：根據 ext_game_id 查找遊戲並啟動
    const onSmarticoPlayGame = async (message) => {
        const extGameId = message.props?.ext_game_id || "";
        const gameProvider = message.props?.game_public_meta?.game_provider || "";
        const gameCategory = message.props?.game_public_meta?.game_categories || "";

        // 根據 ext_game_id 查找對應的遊戲
        const findGameByUnifiedId = async (unifiedGameId) => {
            try {
                const fetchurl = `${window.Strapi_Domain}${window.ApiPort.CMS_GetGame}gameType=${gameCategory}&gameSortingType=Default&platform=app`;
                const res = await window.fetchRequestCMS(fetchurl, "GET");

                if (res.isSuccess && res.result && res.result.gameDetails) {
                    const game = res.result.gameDetails.find(
                        game => game.unifiedGameId === unifiedGameId
                    );

                    if (game) {
                        console.log("找到遊戲:", JSON.stringify(game, null, 2));
                        return game.launchGameCode;
                    } else {
                        Toasts.fail(translate("网络错误，请重试"), 3);
                        return null; // Return null to indicate game not found
                    }
                }
                Toasts.fail(translate("网络错误，请重试"), 3);
                return null;
            } catch (error) {
                console.error("查找遊戲失敗:", error);
                Toasts.fail(translate("网络错误，请重试"), 3);
                return null;
            }
        };
        console.log("ach_game_opening ", message.props);
        // 使用 async/await 處理遊戲查找
        (async () => {
            const launchGameCode = await findGameByUnifiedId(extGameId);

            // 如果找不到遊戲，停止執行
            if (!launchGameCode) {
                console.log("遊戲未找到，停止執行");
                return;
            }

            store.dispatch(
                actions.ACTION_PlayGame({
                    providerCode: gameProvider,
                    launchGameCode: launchGameCode,
                    categoryCode: gameCategory,
                }),
            );
        })();
    };

    // 錯誤處理函數
    const onSmarticoErr = () => {
        GoSmartico({
            isMaintain: true,
        });
    };


    const onSmarticoPop = () => {
        Actions.pop();
    };

    const SmarticoContent = () => {
        const { params } = useSmartico();


        return (
            <SmarticoGame
                smarticoBaseUrl={window.SBTDomain}
                smarticoBrandKey={smarticoBrandKey}
                smarticoLabelKey={smarticoLabelKey}
                smarticoLanguage={smarticoLanguage}
                smarticoDomain={useSelector(state => state.userSetting)?.cmsMainsiteStatus?.smarticoDomain || smarticoUrl}
                smarticoParams={params}
                smarticoMemberCode={window.memberCode}
                smarticoUserLogin={window.ApiPort?.UserLogin}
                onSmarticoPlayGame={onSmarticoPlayGame}
                onSmarticoErr={onSmarticoErr}
                onSmarticoPop={onSmarticoPop}
            />
        );
    };

    return (
        <SmarticoProvider>
            <SmarticoContent
            // smarticoBaseUrl={window.SBTDomain}
            // smarticoBrandKey={smarticoBrandKey}
            // smarticoLabelKey={smarticoLabelKey}
            // smarticoLanguage={smarticoLanguage}
            // smarticoDomain={smarticoDomain || smarticoUrl}
            // smarticoMemberCode={window.memberCode}
            // smarticoUserLogin={window.ApiPort?.UserLogin}
            // onSmarticoPlayGame={onSmarticoPlayGame}
            // onSmarticoErr={onSmarticoErr}
            // onSmarticoPop={onSmarticoPop}
            />
        </SmarticoProvider>
    );
};

export default Smartico;
