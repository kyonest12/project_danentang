import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";

export const resetVideoSlice = createAction('resetVideoSlice');
export const onChangeMute = createAction('onChangeMute');
export const onChangeDuration = createAction('onChangeDuration');
export const onChangePlayVideoTab = createAction('onChangePlayVideoTab');
export const onChangePlayVideoDetail = createAction('onChangePlayVideoDetail');

const initialState = {
  isMuted: true,
  videoDuration: 0,
  playInVideoTab: true,
  playInVideoDetail: false
};

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {},
  extraReducers: {
    [onChangeMute]: (state, action) => {
      console.log(action);
      state.isMuted = action.payload;
    },
    [onChangeDuration]: (state, action) => {
      console.log(action);
      state.videoDuration = action.payload;
    },
    [onChangePlayVideoTab]: (state, action) => {
      console.log(action);
      state.playInVideoTab = action.payload;
    },
    [onChangePlayVideoDetail]: (state, action) => {
      console.log(action);
      state.playInVideoDetail = action.payload;
    },
    [resetVideoSlice]: () => initialState
  },
});

export default videoSlice.reducer;
