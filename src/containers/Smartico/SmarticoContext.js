import React, { createContext, useContext, useState, useEffect } from "react";

// 全局引用，用於在非 React 函數中設置參數
let setParamsGlobal = null;

// 創建 Context
const SmarticoContext = createContext();

// Context Provider 組件（內部使用）
const SmarticoProvider = ({ children }) => {
    const [params, setParams] = useState(null);

    // 設置全局引用
    useEffect(() => {
        setParamsGlobal = setParams;

        // 處理待處理的參數
        if (window.__pendingSmarticoParams) {
            setParams(window.__pendingSmarticoParams);
            delete window.__pendingSmarticoParams;
        }

        return () => {
            setParamsGlobal = null;
        };
    }, []);

    // 設置參數的方法
    const setSmarticoParams = (newParams) => {
        setParams(newParams);
    };

    // 清除參數的方法
    const clearSmarticoParams = () => {
        setParams(null);
    };

    // Context 值
    const contextValue = {
        params,
        setSmarticoParams,
        clearSmarticoParams,
    };

    return (
        <SmarticoContext.Provider value={contextValue}>
            {children}
        </SmarticoContext.Provider>
    );
};

// 自定義 Hook 來使用 Context（內部使用）
export const useSmartico = () => {
    const context = useContext(SmarticoContext);
    if (!context) {
        throw new Error("useSmartico must be used within SmarticoProvider");
    }
    return context;
};

// 導出設置參數的全局函數（供外部使用）
export const setSmarticoParams = (params) => {
    if (setParamsGlobal) {
        setParamsGlobal(params);
    } else {
        // 如果組件還沒掛載，先保存到 window
        window.__pendingSmarticoParams = params;
    }
};

// 導出 Provider 供組件內部使用
export { SmarticoProvider };

