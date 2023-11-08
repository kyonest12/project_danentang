import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import authReducer from "./authSlice";
import postReducer from "./postSlice";
import emojiReducer from "./emojiSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
    post: postReducer,
    emoji: emojiReducer
  },
});
