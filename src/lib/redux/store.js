/*
  目前沒有使用這支Store，使用./store資料夾下的store
*/

import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";

import RootReducer from "./reducers/RootReducer";

// BINDING MIDDLEWARE
const bindMiddleware = middleware => {
    return applyMiddleware(...middleware);
};

const makeStore = ({ isServer }) => {
    console.log("makeStore");
    if (isServer) {
        //If it's on server side, create a store
        return createStore(RootReducer, bindMiddleware([thunk]));
    } else {
        //If it's on client side, create a store which will persist
        const { persistStore, persistReducer } = require("redux-persist");
        const storage = require("redux-persist/lib/storage").default;

        const persistConfig = {
            key: "redux_persist",
            storage, // if needed, use a safer storage
        };

        const persistedReducer = persistReducer(persistConfig, RootReducer); // Create a new reducer with our existing reducer

        const store = createStore(persistedReducer, bindMiddleware([thunk])); // Creating the store again

        store.__persistor = persistStore(store); // This creates a persistor object & push that persisted object to .__persistor, so that we can avail the persistability feature

        return store;
    }
};
