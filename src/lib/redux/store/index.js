// lib/redux/store/index.js
import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { createAppReducer } from "../reducers/AppReducer";

const logger = store => next => action => {
    if (typeof action === "function") {
        console.log("%c dispatching a function ", "background: #ABDCFB; color: #000");
    } else {
        console.log("%c dispatching", "background: #ABDCFB; color: #000", action);
    }
    const result = next(action);
    console.log("%c next state", "background: #A3F7B5; color: #000", store.getState());
    return result;
};

const middlewares = [logger, thunk];

// ✅ 创建初始 reducer（默认语言）
let currentReducer = createAppReducer();
const store = createStore(currentReducer, composeWithDevTools(applyMiddleware(...middlewares)));

// ✅ 动态替换 reducer 的函数
export const resetReducer = () => {
    const newReducer = createAppReducer(); // 重新根据 window.LANGUAGE 创建
    store.replaceReducer(newReducer);
};

// ✅ 清除所有 Redux 数据的方法
export const clearAllReduxData = () => {
    // 发送清除所有数据的 action
    store.dispatch({ type: "CLEAR_ALL_REDUX_DATA" });
};

export default store;
