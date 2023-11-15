import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import data from "../Screens/img/emoji";
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
export const editPost = createAsyncThunk(
  "post/editPost",
  async (data, thunkAPI) => {
    try {
      return await postService.editPost(data);
    } catch (e) {
      console.log("error", e.response.data);
      return thunkAPI.rejectWithValue("something went wrong");
    }
  }
);
export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (data, thunkAPI) => {
    try {
      return await postService.deletePost(data);
    }catch (e) {
      console.log("error", e);
      return thunkAPI.rejectWithValue("something went wrong");
    }
  }
);
export const resetPostSlice = createAction('resetPostSlice');
export const resetAddUpdateDeletePost = createAction('resetAddUpdateDeletePost');
const initialState = {
  postList: [],
  isPostListLoading: false,
  isPendingCreatePost: false,
  isErrorCreatePost: undefined,
  newCreatePostData: undefined,
  isPendingEditPost: false,
  isErrorEditPost: undefined,
  messageEditPost: undefined,
  isPendingDeletePost: false,
  isErrorDeletePost: undefined,
  messageDeletePost: undefined,
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
    [editPost.pending]: (state) => {
      console.log("editPost pending");
      state.isPendingEditPost = true;
      state.isErrorEditPost = undefined;
    },
    [editPost.fulfilled]: (state, action) => {
      console.log("editPost actiion ful", action);
      state.isPendingEditPost = false;
      state.messageEditPost = action?.payload?.message;
      state.isErrorEditPost = false;
    },
    [editPost.rejected]: (state, action) => {
      console.log("editPost action rej", action);
      state.isPendingEditPost = false;
      state.isErrorEditPost = true;
    },
    [deletePost.pending]: (state) => {
      console.log("deletePost pending");
      state.isPendingDeletePost = true;
      state.isErrorDeletePost = undefined;
    },
    [deletePost.fulfilled]: (state, action) => {
      console.log("deletePost actiion ful", action);
      state.isPendingDeletePost = false;
      state.messageDeletePost = action?.payload?.message;
      state.isErrorDeletePost = false;
    },
    [deletePost.rejected]: (state, action) => {
      console.log("deletePost action rej", action);
      state.isPendingDeletePost = false;
      state.isErrorDeletePost = true;
    },
    [resetPostSlice]: () => initialState,
    [resetAddUpdateDeletePost]: (state, action) => {
      state.isPendingCreatePost = false;
      state.isErrorCreatePost = undefined;
      state.isPendingEditPost = false;
      state.isErrorEditPost = undefined;
      state.messageEditPost = undefined;
      state.isPendingDeletePost = false;
      state.isErrorDeletePost = undefined;
      state.messageDeletePost = undefined;
      state.newCreatePostData = undefined;
    }
  },
});

export default postSlice.reducer;
