import React, { createContext, useContext, useReducer } from "react";

// 初始状态
const initialState = {
    gameSequences: null,
    promotionData: null,
    gameBanner: null,
    memberData: null,
    cmsMainsiteStatus: {
        affiliateUrl: `https://www.f952luckyld.com/${window.DefaultConfig?.Culture}`,
        sabaicoIsActive: false,
        smarticoDomain: "https://libs-smartico-ai.wanfbaba098.com",
        smarticoIsActive: true,
    },
};

// Action types
const ActionTypes = {
    SET_GAME_SEQUENCES: "SET_GAME_SEQUENCES",
    SET_PROMOTION_DATA: "SET_PROMOTION_DATA",
    SET_GAME_BANNER: "SET_GAME_BANNER",
    SET_MEMBER_DATA: "SET_MEMBER_DATA",
    SET_CMS_MAINSITE_STATUS: "SET_CMS_MAINSITE_STATUS"
};

// Reducer
const appReducer = (state, action) => {
    switch (action?.type) {
        case ActionTypes?.SET_GAME_SEQUENCES:
            return {
                ...state,
                gameSequences: action?.payload
            };
        case ActionTypes?.SET_PROMOTION_DATA:
            return {
                ...state,
                promotionData: action?.payload
            };
        case ActionTypes?.SET_GAME_BANNER:
            return {
                ...state,
                gameBanner: action?.payload
            };
        case ActionTypes?.SET_MEMBER_DATA:
            return {
                ...state,
                memberData: action?.payload
            };
        case ActionTypes?.SET_CMS_MAINSITE_STATUS:
            return {
                ...state,
                cmsMainsiteStatus: action?.payload
            };
        default:
            return state;
    }
};

// 创建Context
const AppContext = createContext();

// Context Provider组件
export const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    // Context值 - 只提供數據和內部 dispatch
    const contextValue = {
        ...state,
        _dispatch: dispatch  // 內部使用，不暴露給外部組件
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

// 自定义Hook来使用Context
export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useApp must be used within an AppProvider");
    }
    return context;
};

// 導出 ActionTypes 供 hooks 使用
export { ActionTypes };

export default AppContext;