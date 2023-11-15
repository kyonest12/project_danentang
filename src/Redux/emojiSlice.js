import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    postID: "",
    checkEdit: false,
    checkEmoji: false,
    textEmoji: '',
    iconEmoji: '',
    described: '',
    checkImage: false,
    checkVideo: false,
    videoWidth: 0,
    videoHeight: 0,
    image_del: [],
    video_del: false,
    newData: [],
    originalData: [],
    assets: [],
    mergeData: [],
    aggregateData: [],
    userId: null,

}

const emojiSlice = createSlice({
    name: "emoji",
    initialState,
    reducers: {
        resetEmojiSlice: () => initialState,

        showEmoji: (state, action) => {
            state.checkEmoji = true;
            state.textEmoji = action.payload.text;
            state.iconEmoji = action.payload.icon;
        },
        hideEmoji: (state) => {
            state.checkEmoji = false;
        },
        setDescribed: (state, action) => {
            state.described = action.payload;
        },
        setEdit: (state) => {
            state.checkEdit = true;
        },
        setImage: (state) => {
            state.checkImage = true;
            state.checkVideo = false;
        },
        setVideo: (state) => {
            state.checkImage = false;
            state.checkVideo = true;
        },
        setNewData: (state, action) => {
            state.newData = action.payload;
            let mergeData = [];
            state.newData.map(item => {
                mergeData.push({uri: item.uri});
            });
            state.originalData.map(item => {
                mergeData.push({uri: item.url});
            });
            state.aggregateData = mergeData;
            if(mergeData.length==0){
                state.checkImage = false;
                state.checkVideo = false;
            }
        },
        setVideoSize: (state, action) => {
            state.videoWidth = action.payload.videoWidth;
            state.videoHeight = action.payload.videoHeight;
        },
        setAsset: (state, action) => {
            state.assets = action.payload;
        },
        setOriginalData: (state, action) => {
            state.originalData = action.payload;
            let mergeData = [];
            state.newData.map(item => {
                mergeData.push({uri: item.uri});
            });
            state.originalData.map(item => {
                mergeData.push({uri: item.url});
            });
            state.aggregateData = mergeData;
            if(mergeData.length==0){
                state.checkImage = false;
                state.checkVideo = false;
            }
        },
        addImageDel: (state, action) => {
            state.image_del.push(action.payload);
        },
        setVideoDel: (state) => {
            state.video_del = true;
        },
        setPostID: (state, action) => {
            state.postID = action.payload;
        },
        setUserID: (state, action) => {
            state.userId = action.payload;
        }

    }
});
export const { showEmoji, hideEmoji, setDescribed, setEdit, resetEmojiSlice, setNewData, setImage, setVideo, 
    setVideoSize, setAsset, setOriginalData, addImageDel, setVideoDel, setPostID, setUserID } = emojiSlice.actions;
export default emojiSlice.reducer
