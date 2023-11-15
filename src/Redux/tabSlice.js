import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";

export const resetTabSlice = createAction('resetTabSlice');
export const onChangeCurrentTabIndex = createAction('onChangeCurrentTabIndex');

const initialState = {
    currentTabIndex: 0,
};

const tabSlice = createSlice({
  name: "tab",
  initialState,
  reducers: {},
  extraReducers: {
    [onChangeCurrentTabIndex]: (state, action) => {
      console.log(action);
      state.currentTabIndex = action.payload;
    },
    [resetTabSlice]: () => initialState
  },
});

export default tabSlice.reducer;
