import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    checkEmoji:false,
    textEmoji: '',
    iconEmoji: '',
    checkImage: false,
    checkVideo: false,
    data: [],

}

const emojiSlice = createSlice({
    name: "emoji",
    initialState,
    reducers: {
        resetData: () => initialState,

        showEmoji: (state, action) => {
            state.checkEmoji = true;
            state.textEmoji = action.payload.text;
            state.iconEmoji = action.payload.icon;
        },
        hideEmoji: (state) => {
            state.checkEmoji = false;
        },
        setImage: (state) => {
            state.checkImage = true;
            state.checkVideo = false;
        },
        setVideo: (state) => {
            state.checkImage = false;
            state.checkVideo = true;
        },
        setDataImage: (state, action) => {
            state.data = action.payload;
        }
        
    }
});
export const {showEmoji, hideEmoji, resetData, setDataImage, setImage, setVideo} = emojiSlice.actions;
export default emojiSlice.reducer
