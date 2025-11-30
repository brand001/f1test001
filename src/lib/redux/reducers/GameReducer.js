import Types from "../actions/types";

export const getInitialState = () => ({
    sprHotGame: {},
    GameOpenUrl: ""
});

const GameReducer = (state = getInitialState(), action) => {
    switch (action.type) {
    case Types.ACTION_GAMES_UPDATE: //更新數據
        //console.log('===usersetting update to : ', action.payload);
        return { ...state, ...action.payload };
    default:
        return state;
    }
};

export default GameReducer;
