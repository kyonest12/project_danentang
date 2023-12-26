import data from "../../Screens/img/emoji";
import axios from "../../setups/custom_axios";
import {ToastAndroid} from 'react-native'

const getAllUsers = () => {
  return axios.get("/get-all-users");
};

const getUserInfor = (user_id) => {
  return axios.post(
    '/get_user_info',
    {
      user_id:user_id
    }
  );
}

const changeInforAfterSignup = async (name, avatar) => {
  console.log(name, avatar);
  let formData = new FormData();
  formData.append("username", name);
  formData.append("avatar", avatar);
  return await axios.post(
    '/change_profile_after_signup',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
}

const setUserDescription = (descrtiption, userId) => {
  return axios.post(`/set_user_info?user_id=${userId}&description=${descrtiption}`);
}

const setUserName = (userName) => {
  return axios.post(`/set_user_info?username=${userName}`);
}

const setAvatar = async (data) => {
  const {formData, userId} = data;
  let response =  axios.post(`/set_user_info?user_id=${userId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  return response;
}

const setCoverImage = async (data) => {
  const {formData, userId} = data;
  return axios.post(`/set_user_info?user_id=${userId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
}

const setUserCity = async (data) => {
  const {city, userId} = data;
  return axios.post(`/set_user_info?user_id=${userId}&city=${city}`);
}

const setUserCountry = async (data) => {
  const {country, userId} = data;
  return axios.post(`/set_user_info?user_id=${userId}&country=${country}`);
}

// const userService = {
//   getAllUsers,
//   getUserInfor,
//   setUserDescription,
//   setAvatar,
//   setCoverImage,
//   setUserCity,
//   setUserCountry
const getListFriendRequest = (index, count) => {
  return axios.post(`/get_requested_friends`, {index: index, count: count});
}
const setAcceptFriend = (userId, isAccept) => {
  return axios.post(`/set_accept_friend`, {user_id: userId, is_accept: isAccept});
}
const setRequestFriend = (userId) => {
  return axios.post(`/set_request_friend`, {user_id: userId});
}
const getUserFriends = (userId, index, count) => {
  return axios.post(`/get_user_friends`, {user_id: userId, index: index, count: count});
}
const getSuggestFriends = (index, count) => {
  return axios.post(`/get_suggested_friends`, {index: index, count: count});
}
const setBlock = (userId, type) => {
  return axios.post(`/set_block?user_id=${userId}&type=${type}`);
}
const unFriend = (userId) => {
  return axios.post(`/unfriend`, {user_id: userId});
}
const delRequestFriend = (userId) => {
  return axios.post(`/unfriend?user_id=${userId}`);
}
const getUserInforWithToken = (userId, token) =>  {
  return axios.post(`/get_user_info?user_id=${userId}&token=${token}`);
}
const userService = {
  setUserName,
  getAllUsers,
  getListFriendRequest,
  setAcceptFriend,
  getUserFriends,
  setBlock,
  unFriend,
  setRequestFriend,
  getSuggestFriends,
  getUserInfor,
  setUserDescription,
  setAvatar,
  setCoverImage,
  setUserCity,
  setUserCountry,
  getUserInforWithToken,
  changeInforAfterSignup,
  delRequestFriend
};


export default userService;
