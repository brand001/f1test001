import { ACTION_AviatorGameData, ACTION_ClearGameInfo, ACTION_PlayGame } from "./GameAction";
import { ACTION_GameIsMaintain, ACTION_GetCurrentGameInfo, ACTION_InitialGameInfo } from "./GameInfoAction";
import { ACTION_MaintainStatus_NoTokenBTI, ACTION_MaintainStatus_NoTokenIM, ACTION_MaintainStatus_SetBTI, ACTION_MaintainStatus_SetIM } from "./MaintainStatusAction";
import {
    ACTION_UserInfo_getBalanceAll,
    ACTION_UserInfo_getBalanceSB,
    ACTION_UserInfo_login,
    ACTION_UserInfo_logout,
    ACTION_UserInfo_updateBalance,
    ACTION_UserInfo_updateMemberInfo,
} from "./UserInfoAction";
import {
    ACTION_ClearSelfExclusions,
    ACTION_CMSMAINSITESTATUS,
    ACTION_LoginAfterCallBack,
    ACTION_ONECLICKPOPUP,
    ACTION_PhoneSetting_Update,
    ACTION_RouterName,
    ACTION_SelfExclusionsAction,
    ACTION_TutorialManagerIndex,
    ACTION_UserSetting_ToggleListDisplayType,
    ACTION_UserSetting_Update,
} from "./UserSettingAction";

// Clear all redux data action
export const ACTION_ClearAllReduxData = () => ({
    type: "CLEAR_ALL_REDUX_DATA",
});

export default {
    ACTION_UserInfo_updateBalance,
    ACTION_UserInfo_updateMemberInfo,
    ACTION_UserInfo_logout,
    ACTION_UserInfo_login,
    ACTION_UserSetting_ToggleListDisplayType,
    ACTION_SelfExclusionsAction,
    ACTION_UserSetting_Update,
    ACTION_UserInfo_getBalanceAll,
    ACTION_UserInfo_getBalanceSB,
    ACTION_MaintainStatus_NoTokenBTI,
    ACTION_MaintainStatus_NoTokenIM,
    ACTION_MaintainStatus_SetBTI,
    ACTION_MaintainStatus_SetIM,
    ACTION_PhoneSetting_Update,
    ACTION_ClearGameInfo,
    ACTION_PlayGame,
    ACTION_ONECLICKPOPUP,
    ACTION_ClearSelfExclusions,
    ACTION_GetCurrentGameInfo,
    ACTION_InitialGameInfo,
    ACTION_GameIsMaintain,
    ACTION_AviatorGameData,
    ACTION_CMSMAINSITESTATUS,
    ACTION_RouterName,
    ACTION_LoginAfterCallBack,
    ACTION_ClearAllReduxData,
    ACTION_TutorialManagerIndex,
};
