import axios from "../../setups/custom_axios";
import { deepCopy, _getCache, _setCache } from "../Helper/common";

const createPost = (data) => {
  const { described, status, formData, isMedia } = data;
  if (isMedia) return axios.post(`/post/add_post?&described=${described}&status=${status}`,
    formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  return axios.post(`/post/add_post?&described=${described}&status=${status}`);
};
const getListPosts = (lastId, index, count) => {
  return axios.post(`post/get_list_posts?last_id=${lastId}&index=${index}&count=${count}`);
};
const likePost = (postId) => {
  return axios.post(`like/like?id=${postId}`);
}
const getPost = (postId) => {
  return axios.post(`post/get_post?id=${postId}`);
}
const updateListPostsCache = async (newlistPosts) => {
  let listPosts = JSON.parse(await _getCache("listPosts"));
  // console.log('listPosts', listPosts);
  //console.log('start list post', JSON.stringify(listPosts));
  if (listPosts === undefined || listPosts === null || listPosts === "") listPosts = [];
  for (let i = 0; i < newlistPosts.length; i++) {
    let ids = listPosts.map(o => o.id);
    let index = ids.indexOf(newlistPosts[i].id);
    //console.log(index);
    if (index === -1) {
      listPosts.push(newlistPosts[i]);
    }
    else {
      listPosts[index] = newlistPosts[i];
    }
  }
  //console.log('update', JSON.stringify(listPosts));
  // remove cache
  // await _setCache("listPosts", "");
  await _setCache("listPosts", JSON.stringify(listPosts));
}
const getListPostsCache = async () => {

  let listPosts = JSON.parse(await _getCache("listPosts"))
  if (listPosts === undefined || listPosts === null || listPosts === "") listPosts = [];
  console.log('get cache post', listPosts.length);
  return listPosts;
}
const removePostsCache = async () => {
  await _setCache("listPosts", "");
}
const postService = {
  getListPosts,
  likePost,
  getPost,
  updateListPostsCache,
  getListPostsCache,
  removePostsCache,
  createPost
};
export default postService;
