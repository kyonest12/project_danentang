import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import postService from "../Services/Api/postService";
export const fetchListPost = createAsyncThunk(
  "post/fetchListPost",
  async (data, thunkAPI) => {
    try {
      const { lastId, index, count } = data;
      return await postService.getListPosts(lastId, index, count);
    } catch (e) {
      console.log("error", e);
      return thunkAPI.rejectWithValue("something went wrong");
    }
  }
);
export const createPost = createAsyncThunk(
  "post/createPost",
  async (data, thunkAPI) => {
    try {
      return await postService.createPost(data);
    } catch (e) {
      console.log("error", e);
      return thunkAPI.rejectWithValue("something went wrong");
    }
  }
); 
export const resetPostSlice = createAction('resetPostSlice');
const initialState = {
  postList: [],
  isPostListLoading: false,
  isPendingCreatePost: false,
  isErrorCreatePost: undefined,
  newCreatePostData: undefined
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchListPost.pending]: (state) => {
      console.log("fetchListPost pending");
      state.isPostListLoading = true;
      state.isErrorAddPost = undefined
    },
    [fetchListPost.fulfilled]: (state, action) => {
      console.log("fetchListPost actiion ful", action);
      state.isPostListLoading = false;
      state.postList = action?.payload?.data?.posts;
      postService.updateListPostsCache(action?.payload?.data?.posts);
    },
    [fetchListPost.rejected]: (state, action) => {
      console.log("fetchListPost action rej", action);
      state.isPostListLoading = false;
      state.postList = [];
    },
    [createPost.pending]: (state) => {
      console.log("createPost pending");
      state.isPendingCreatePost = true;
      state.newCreatePostData = undefined;
      state.isErrorCreatePost = undefined;
    },
    [createPost.fulfilled]: (state, action) => {
      console.log("createPost actiion ful", action);
      state.isPendingCreatePost = false;
      state.newCreatePostData = action?.payload?.data;
      state.isErrorCreatePost = false;
    },
    [createPost.rejected]: (state, action) => {
      console.log("createPost action rej", action);
      state.isPendingCreatePost = false;
      state.isErrorCreatePost = true;
    },
    [resetPostSlice]: () => initialState
  },
});

export default postSlice.reducer;
