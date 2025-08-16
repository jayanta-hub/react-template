import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { musafirLoginApi } from "./musafirLoginApi";
// import { approvalAutoSearchgqlReducerApi } from "./slice/ApprovalAutoCompletegqlSlice";
import { loginSlice } from "./slice/LoginSlice";

const appReducer = combineReducers({
  [musafirLoginApi.reducerPath]: musafirLoginApi.reducer,
  loginSlice: loginSlice.reducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    "loginSlice",
  ],
};

const rootReducer = (state: any, action: any) => {
  if (action.type === "RESET_STATE") {
    state = {};
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      musafirLoginApi.middleware,
    ),
});

export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
