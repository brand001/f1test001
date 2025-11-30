import { clearGameInfo, gameIsMaintain, getCurrentGameInfo } from "../actions/GameInfoAction";

export const initialState = {
    result: {
        category: "",
        gameId: "",
        provider: "",
        GameOpenUrl: "",
        launchGameCode: "",
    },
    maintainStatus: {
        providers: "",
        gameName: "",
        isComingSoon: false,
        isNew: false,
        isHot: false,
    },
};

const GameInfoReducer = (state = initialState, action) => {
    switch (action.type) {
        case getCurrentGameInfo:
            return { ...state, result: action.payload };
        case gameIsMaintain:
            return { ...state, maintainStatus: action.payload };
        case clearGameInfo:
            return { ...state, result: initialState.result };
        default:
            return state;
    }
};

export default GameInfoReducer;
