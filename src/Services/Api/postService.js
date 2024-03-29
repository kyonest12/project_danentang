import data from "../../Screens/img/emoji";
import axios from "../../setups/custom_axios";
import { deepCopy, _getCache, _setCache } from "../Helper/common";

const createPost = (data) => {
  const { described, status, formData, isMedia } = data;
  formData.append('described', described);
  formData.append('status', status);
  return axios.post(`/add_post`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
};

const getNumMark = async (postId) => {
  return await axios.post(
    '/get_num_mark',
    {
      id: postId
    }
  );
}

const getNumFeel = async (postId) => {
  return await axios.post(
    '/get_num_feel',
    {
      id: postId
    }
  );
}

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
  formData.append('id', id);
  formData.append('described', described);
  formData.append('status', status);
  return axios.post(`/edit_post`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

}
const deletePost = async (data) => {
  const {id} = data;
  return await axios.post(`/delete_post`, {id: id});
}
const getListVideos = async (lastId, index, count) => {
  return await axios.post(
    '/get_list_videos',
    {
      last_id: lastId,
      index: index,
      count: count
    }
  );
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
  return axios.post(
    '/report_post',
      {
        id:id,
        subject:subject,
        details:details
      }
    );
}
const getListPostByUserId = async (userId, lastId, index, count) => {
  return await axios.post(
    '/get_list_posts?',
    {
      user_id: userId,
      last_id: lastId,
      index: index,
      count: count,
    }
  );
}
const setMarkComment = async (data) => {
  return axios.post(
    '/set_mark_comment', 
    data
    );
}
const getMarkComment = async (postId, index, count) => {
  return axios.post(
    'get_mark_comment',
    {
      id: postId,
      index: index,
      count: count
    }
  )
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

const getNoti = async(index, count) => {
  return await axios.post(
    '/get_notification',
    {
      index: index,
      count: count
    }
  );
}

const feel = async(id, type) => {
  return await axios.post(
    '/feel',
    {
      id: id,
      type: type
    }
  );
}

const deleteFeel = async(id) => {
  return await axios.post(
    '/delete_feel',
    {
      id: id,
    }
  );
}

const getListFeel = async(id, index, count) => {
  return await axios.post(
    '/get_list_feels',
    {
      id: id,
      index: index,
      count: count
    }
  )
}
const postService = {
  getListPosts,
  getListVideos,
  setMarkComment,
  getPost,
  updateListPostsCache,
  getListPostsCache,
  removePostsCache,
  getListPostByUserId,
  createPost,
  reportPost,
  editPost,
  deletePost,
  getMarkComment,
  getNumFeel,
  getNumMark,
  getNoti,
  feel,
  deleteFeel,
  getListFeel,
  likePost
};
export default postService;
