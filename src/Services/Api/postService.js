import data from "../../Screens/img/emoji";
import axios from "../../setups/custom_axios";
import { deepCopy, _getCache, _setCache } from "../Helper/common";

const createPost = async (data) => {
  const { described, status, formData, isMedia, videoWidth, videoHeight } = data;
  console.log("___________________________________________________", videoHeight, videoWidth)
  const requestBody = new FormData();
  requestBody.append('described', described);
  requestBody.append('status', status);

  if (isMedia) {
    requestBody.append('image', videoWidth);
    requestBody.append('video', videoHeight);
    requestBody.append('media', formData);
  }

  return await axios.post('/add_post', requestBody, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const getListPosts = async (lastId, index, count) => {
  return await axios.post(
    '/get_list_posts',
    {
      last_id: lastId,
      index: index,
      count: count
    }
  );
};
const editPost = async (data) => {
  const { id, described, status, formData, isMedia, videoWidth, videoHeight, image_del, video_del } = data;
  if (video_del) {
    if (isMedia) {
      return axios.post(`/edit_post?&id=${id}&described=${described}&status=${status}&videoWidth=${videoWidth}&videoHeight=${videoHeight}&image_del=${image_del}&video_del=${"true"}`,
        formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    return await axios.post(`/edit_post?&id=${id}&described=${described}&status=${status}&video_del=${"true"}`);
  }
  if (isMedia) {
    return axios.post(`/edit_post?&id=${id}&described=${described}&status=${status}&videoWidth=${videoWidth}&videoHeight=${videoHeight}&image_del=${image_del}`,
      formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  }
  return axios.post(`/edit_post?&id=${id}&described=${described}&status=${status}&image_del=${image_del}`);

}
const deletePost = async (data) => {
  const {id} = data;
  return await axios.post(`/delete_post?&id=${id}`);
}
const getListVideos = (lastId, index, count) => {
  return axios.post(`/get_list_videos?last_id=${lastId}&index=${index}&count=${count}`);
};
const likePost = (postId) => {
  return axios.post(`like?id=${postId}`);
}
const getPost = (postId) => {
  return axios.post(
    '/get_post',
    {
      id:postId
    }
  );
}
const reportPost = (data) => {
  const { id, subject, details } = data;
  return axios.post(`report_post?id=${id}&subject=${subject}&details=${details}`);
}
const getListPostByUserId = (userId) => {
  return axios.post(`get_post_by_userId?userId=${userId}`);
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
  getListVideos,
  likePost,
  getPost,
  updateListPostsCache,
  getListPostsCache,
  removePostsCache,
  getListPostByUserId,
  createPost,
  reportPost,
  editPost,
  deletePost,
};
export default postService;
