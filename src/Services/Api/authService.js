import data from "../../Screens/img/emoji";
import axios from "../../setups/custom_axios";
import { _getCache, _setCache } from "../Helper/common";
import postService from "./postService";
const login = async (email, password) => {
  console.log(password, email);
  return await axios.post(
    '/login',
    {
      email: email,
      password: password,
      uuid: 'string'
    }
  );
};
const signup = async (email, password, name, birthday) => {
  console.log(password, email, name, birthday);
  return await axios.post(
    '/signup',
    {
      email: email,
      password: password,
      uuid: "string"
      //birthday: Date(birthday),
    }
  );
};
const changePassword = async (password, newPassword) => {
  return await axios.post(`/change_password?password=${password}&new_password=${newPassword}`);
}

const checkExistEmail = async (email) => {
  console.log(email);
  return await axios.post(
    '/check_email',
    {
      email: email,
    }
  );
}

const checkVerifyCode = async (email, code) => {
  console.log(email, code);
  return await axios.post(
    '/check_verify_code',
    {
      email: email,
      code_verify: code
    }
  );
}
const getVerifyCode = async (email) => {
  console.log(email);
  return await axios.post(
    '/get_verify_code',
    {
      email: email,
    }
  );
}
const verifyToken = async () => {
  return await axios.get(`/verifyToken`);
}
const logout = async () => {
  // remove token
  try {
    await _setCache("token", "");
    await _setCache("user", "");
    // clear cache
    await postService.removePostsCache();
    return axios.post(`/logout`);
  }
  catch (e) {
    console.log(e);
  }
  // call api remove token
};
const setToken = async (token) => {
  try {
    await _setCache("token", token);
  }
  catch (e) {
    console.log(e);
  }
};
const getToken = async () => {
  try {
    return await _getCache("token");
  }
  catch (e) {
    console.log(e);
  }
};
const saveLoginInfo = async (user) => {
  try {
    console.log(user);
    let loginInfo = JSON.parse(await _getCache("loginInfo"));
    if (loginInfo === null || loginInfo === undefined || loginInfo === "") loginInfo = [];
    let listPhoneNumber = loginInfo.map(o => o.phonenumber);
    let index = listPhoneNumber.indexOf(user.phonenumber);
    if (index === -1) loginInfo.push(user);
    else {
      loginInfo[index] = user;
    }
    // remove cache
    // await _setCache("loginInfo", "");
    await _setCache("loginInfo", JSON.stringify(loginInfo));
  }
  catch (e) {
    console.log(e);
  }
}
const getListLoginInfo = async () => {
  try {
    let loginInfo = JSON.parse(await _getCache("loginInfo"));
    if (loginInfo === null || loginInfo === undefined || loginInfo === "") loginInfo = [];
    return loginInfo;
  }
  catch(e){
    console.log(e);
  }
}
const removeLoginInfo = async (user) => {
  try {
    let loginInfo = await getListLoginInfo();
    let index = loginInfo.map(o => o.email).indexOf(user.email);
    if (index !== -1){
      loginInfo.splice(index, 1);
    }
    await _setCache("loginInfo", JSON.stringify(loginInfo));
    console.log(loginInfo);
  }
  catch(e){
    console.log(e);
  }
}
const authService = {
  login, logout, verifyToken, setToken,
  getToken, signup, checkExistEmail, checkVerifyCode,
  getVerifyCode, saveLoginInfo, getListLoginInfo,
  removeLoginInfo, changePassword
};
export default authService;
