import { configureStore } from "@reduxjs/toolkit";
import userReducer  from "./userSlice";
 
export const AppStore = configureStore({
  reducer: {
    user: userReducer,
  },
});
