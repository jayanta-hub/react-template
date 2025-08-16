import { createSlice } from "@reduxjs/toolkit";
import { musafirLoginApi } from "../musafirLoginApi";
import { useSelector } from "react-redux";

const initialState: any = {
  userLoginInfo: {},
  token:{},
  tokenObj:{}
};

export const loginSlice = createSlice({
  name: "loginSlice",
  initialState,
  reducers: {
    logout: (state) => {
      state.userLoginInfo = {};
    },
    setAuthTokens: (state, action) => {
      state.tokenObj = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(musafirLoginApi.endpoints.login.matchFulfilled, (state, { payload }) => {
      state.userLoginInfo = payload;
    });
    builder.addMatcher(musafirLoginApi.endpoints.login.matchRejected, (state, { payload }) => {
      state.userLoginInfo = payload;
    });
    builder.addMatcher(musafirLoginApi.endpoints.login.matchFulfilled, (state, { payload }) => {
      state.userLoginInfo = payload;  
  //     state.tokenObj = {
  //     AccessToken:{Name: "jeetat",
  //     value: "accesstoken value from API",
  //     Expiry: "AccessToken Expiry"},
  //     RefreshToken:{Name: "musafir2.0",
  //     value: "refreshtoken value from API",
  //     Expiry: "RefreshToken Expiry"}

  // };
    });
    builder.addMatcher(musafirLoginApi.endpoints.createToken.matchFulfilled, (state, { payload }) => {
      state.token = payload;
    });
  },
});
export const { logout,setAuthTokens } = loginSlice.actions;
export default loginSlice.reducer;