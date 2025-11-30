//這個沒用到 改用appReducer.js

import { combineReducers } from "redux";

import BetCartReducer from "./BetCartReducer";
import GameReducer from "./GameReducer";
import MaintainStatus from "./MaintainStatusReducer";
import RouterLogReducer from "./RouterLogReducer";
import UserInfoReducer from "./UserInfoReducer";
import UserSettingReducer from "./UserSettingReducer";

const RootReducer = combineReducers({
    userInfo: UserInfoReducer,
    userSetting: UserSettingReducer,
    betCartInfo: BetCartReducer,
    maintainStatus: MaintainStatus,
    routerLog: RouterLogReducer,
    game: GameReducer,
});

export default RootReducer;
