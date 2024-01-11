import React, { useEffect, useState, memo } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Button,
  View,
  Image,
  Dimensions,
  ScrollView,
  ToastAndroid,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SimpleGrid } from "react-native-super-grid";
import { connect } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import CommentModal from "../Components/modal/CommentModal";
import Icon from "react-native-vector-icons/Ionicons";
import { MaterialIcons } from "react-native-vector-icons";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import {
  FontAwesome5,
  FontAwesome,
  AntDesign,
  Fontisto,
} from "react-native-vector-icons";
import ModalBottom from "react-native-modalbox";
import { delay, _getCache, _setCache } from "../Services/Helper/common";
import styles from "./style/profile";
import postService from "../Services/Api/postService";
import userService from "../Services/Api/userService";
import PostInHome from "../Components/PostInHome";
import { resetEmojiSlice } from "../Redux/emojiSlice";
import { resetAddUpdateDeletePost } from "../Redux/postSlice";
import Modal from "react-native-modal";
import { TextInput } from "react-native-paper";

function ProfileScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const { width } = Dimensions.get("window");
  const { userList, isLoading } = useSelector((state) => state.user);

  const {
    postList,
    isPostListLoading,
    isPendingCreatePost,
    newCreatePostData,
    isErrorCreatePost,
    isPendingEditPost,
    isErrorEditPost,
    messageEditPost,
    isPendingDeletePost,
    isErrorDeletePost,
    messageDeletePost,
  } = useSelector((state) => state.post);

  let av =
    "https://phongreviews.com/wp-content/uploads/2022/11/avatar-facebook-mac-dinh-13.jpg";
  var userId = route?.params?.userId;
  var cur = userId;
  const defaultCount = 5;
  const [defaultIndex, setDefaultIndex] = useState(0);
  const [defaultLastId, setDefaultLastId] = useState(0);
  const [loadingScroll, setLoadingScroll] = useState(false);

  const [showModalAva, setShowModalAva] = useState(false);
  const [showModalCover, setShowModalCover] = useState(false);
  const [listPost, setListPost] = useState([]);
  const [friends, setFriends] = useState([]);
  const [cntFriend, setCntFriend] = useState(0);
  const [listPostTotal, setListPostTotal] = useState([]);
  const [is_friend, setIsFriend] = useState(0);
  const { user } = useSelector((state) => state.auth);
  if (userId === undefined) {
    cur = user.id;
  }
  const [action, setAction] = useState(0);
  const { currentTabIndex } = useSelector((state) => state.tab);
  const [refreshing, setRefreshing] = useState(false);
  const [reload, setReload] = useState(false);
  const { userInfor, successChangeAva } = useSelector((state) => state.user);
  // console.log(userInfor);
  const [isModalVisible, setModalVisible] = useState(false);
  const [userInfors, setUserInfors] = useState(userInfor);
  const onRefresh = async () => {
    setRefreshing(true);
    setListPostTotal([])
    setDefaultIndex(0),
    setDefaultLastId(0),
    handleGetData();
    await delay(2000);
    setRefreshing(false);
    setModalVisible(false);
  };

  const [isCoinLoading, setIsCoinLoading] = useState(false);
  const [coinAmount, setCoinAmount] = useState("");
  const handlePress = () => {
    setModalVisible(true);
  };
  const handelBuyCoin = (coinAmount) => {
    try {
      setIsCoinLoading(true);
      userService.buyCoin(coinAmount);
      setIsCoinLoading(false);
      Alert.alert(
        "Nạp thêm coin",
        `Bạn đã nạp thành công ${coinAmount} coin.`,
        [{ text: "OK", onPress: onRefresh }]
      );
    } catch (error) {
      console.error("Error:", error);
      setIsCoinLoading(false);
      Alert.alert("Lỗi", "Đã có lỗi xảy ra khi nạp coin.");
    }
  };

  const handleGetListPost = () => {
    postService
      .getListPostByUserId(cur, defaultLastId, defaultIndex, defaultCount)
      .then((result) => {
        defaultIndex.current += defaultCount;
        setListPost(result.data.post);
      })
      .catch((e) => {
        setListPost([]);
        console.log(e.response.data);
      });
  };
  useEffect(() => {
    let newList = listPostTotal;
    newList = newList.concat(listPost);
    setListPostTotal(newList);
  }, [listPost]);

  function handleScroll() {
    setLoadingScroll(true);
    postService
      .getListPostByUserId(
        cur,
        defaultLastId,
        listPostTotal.length,
        defaultCount
      )
      .then((result) => {
        //console.log(result.data.post);
        //add to listFriendTotal
        result.data.forEach((item) => {
          listPostTotal.push(item);
        });
        setLoadingScroll(false);
      })
      .catch((e) => {
        setListPost([]);
        // console.log(e.response.data);
        setLoadingScroll(false);
      });
  }

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    const paddingToBottom = 50;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const handleGetData = () => {
    handleGetListPost();
    //console.log("POSST: ", listPostTotal)
    //console.log(userId)
    if (userId) {
      userService
        .getUserInfor(userId)
        .then((result) => {
          setUserInfors(result.data);
          setIsFriend(result.data.is_friend);
          console.log("####", result.data);
          // console.log ("####", result.data.is_friend)
        })
        .catch((e) => {
          console.log(e);
        });
      userService
        .getUserFriends(userId, 0, 5)
        .then((result) => {
          //console.log(result);
          setCntFriend(result.data.friends.length);
          setFriends(result.data.friends.slice(0, 6));
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };
  useEffect(() => {
    handleGetData();
  }, [reload, userId]);

  useEffect(() => {
    if (isPendingCreatePost === false && isErrorCreatePost === false) {
      if (currentTabIndex === 3)
        ToastAndroid.show("Đăng bài viết thành công", ToastAndroid.SHORT);
      dispatch(resetAddUpdateDeletePost());
      onRefresh();
    }
    if (isErrorCreatePost) {
      dispatch(resetAddUpdateDeletePost());
      if (currentTabIndex === 3)
        Alert.alert("Đăng bài không thành công", "Vui lòng thử lại sau.", [
          { text: "OK", onPress: () => null },
        ]);
    } else {
      // popup noti đăng bài thành công
    }
  }, [isPendingCreatePost, newCreatePostData, isErrorCreatePost]);
  useEffect(() => {
    if (isErrorEditPost === true) {
      if (currentTabIndex === 3)
        ToastAndroid.show(
          "Chỉnh sửa không thành công, vui lòng thử lại sau!",
          ToastAndroid.SHORT
        );
      dispatch(resetAddUpdateDeletePost());
    }
    if (isErrorEditPost === false) {
      // popup noti chỉnh sửa bài thành công
      if (isPendingEditPost === false && messageEditPost) {
        if (currentTabIndex === 3)
          ToastAndroid.show(
            "Chỉnh sửa bài viết thành công",
            ToastAndroid.SHORT
          );
        dispatch(resetAddUpdateDeletePost());
        onRefresh();
        //console.log("refesh", isErrorEditPost, isPendingEditPost);
      }
    }
  }, [isPendingEditPost, isErrorEditPost, messageEditPost]);
  useEffect(() => {
    if (isErrorDeletePost) {
      if (currentTabIndex === 3)
        ToastAndroid.show(
          "Có lỗi xảy ra, vui lòng thử lại sau!",
          ToastAndroid.SHORT
        );
      dispatch(resetAddUpdateDeletePost());
    } else if (isErrorDeletePost === false) {
      // popup noti chỉnh sửa bài thành công
      if (isPendingDeletePost === false && messageDeletePost) {
        if (currentTabIndex === 3)
          ToastAndroid.show(
            "Đã chuyển bài viết vào thùng rác",
            ToastAndroid.SHORT
          );
        dispatch(resetAddUpdateDeletePost());
        onRefresh();
      }
    }
  }, [isPendingDeletePost, isErrorDeletePost, messageDeletePost]);

  const showModalAvatar = () => {
    setShowModalAva(true);
  };
  return (
    <>
      {!userId ? (
        <>
          <ModalBottom
            backdropPressToClose={true}
            isOpen={showModalAva}
            style={styles.modalBox}
            onClosed={() => setShowModalAva(false)}
          >
            <View style={styles.contentAva}>
              <View style={styles.rowModal}>
                <View style={styles.iconModal}>
                  <MaterialIcons name="filter-frames" size={25} />
                </View>
                <Text style={{ fontSize: 20, marginTop: 5, fontWeight: "500" }}>
                  Thêm khung
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate("pickAvatar")}
              >
                <View style={styles.rowModal}>
                  <View style={styles.iconModal}>
                    <FontAwesome5 name="images" size={25} />
                  </View>
                  <Text
                    style={{ fontSize: 20, marginTop: 5, fontWeight: "500" }}
                  >
                    Chọn ảnh đại diện
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={styles.rowModal}>
                <View style={styles.iconModal}>
                  <FontAwesome5 name="user-circle" size={25} />
                </View>
                <Text style={{ fontSize: 20, marginTop: 5, fontWeight: "500" }}>
                  Xem ảnh đại diện
                </Text>
              </View>
            </View>
          </ModalBottom>

          <ModalBottom
            backdropPressToClose={true}
            isOpen={showModalCover}
            style={styles.modalBox}
            onClosed={() => setShowModalCover(false)}
          >
            <View style={styles.contentCover}>
              <View style={styles.rowModal}>
                <View style={styles.iconModal}>
                  <FontAwesome5 name="image" size={25} />
                </View>
                <Text style={{ fontSize: 20, marginTop: 5, fontWeight: "500" }}>
                  Xem ảnh bìa
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate("pickCover")}
              >
                <View style={styles.rowModal}>
                  <View style={styles.iconModal}>
                    <FontAwesome name="upload" size={25} />
                  </View>
                  <Text
                    style={{ fontSize: 20, marginTop: 5, fontWeight: "500" }}
                  >
                    Tải ảnh lên
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={styles.rowModal}>
                <View style={styles.iconModal}>
                  <MaterialCommunityIcons name="facebook" size={25} />
                </View>
                <Text style={{ fontSize: 20, marginTop: 5, fontWeight: "500" }}>
                  Chọn ảnh trên facebook
                </Text>
              </View>
              <View style={styles.rowModal}>
                <View style={styles.iconModal}>
                  <AntDesign name="appstore1" size={25} />
                </View>
                <Text style={{ fontSize: 20, marginTop: 5, fontWeight: "500" }}>
                  Tạo nhóm ảnh bìa
                </Text>
              </View>
            </View>
          </ModalBottom>
        </>
      ) : (
        <></>
      )}
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#0f80f7"]}
          />
        }
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            handleScroll();
          }
        }}
      >
        <View style={styles.firstView}>
          <TouchableOpacity onPress={() => setShowModalCover(true)}>
            <Image
              source={
                (userId ? !userInfors?.cover_image : !userInfor?.cover_image)
                  ? require("../../assets/images/default_avatar.jpg")
                  : {
                      uri: userId
                        ? userInfors?.cover_image
                        : userInfor?.cover_image,
                    }
              }
              style={styles.coverImage}
            />
          </TouchableOpacity>
          <View style={styles.avatar}>
            <TouchableOpacity onPress={() => showModalAvatar()}>
              <Image
                source={
                  (userId ? !userInfors?.avatar : !userInfor?.avatar)
                    ? require("../../assets/images/default_avatar.jpg")
                    : { uri: userId ? userInfors?.avatar : userInfor?.avatar }
                }
                style={styles.avatarImg}
              />
            </TouchableOpacity>
            <Text style={styles.name}>{userInfors?.username}</Text>
            <TouchableOpacity
              onPress={() => {
                if (userId) {
                  navigation.navigate("chatscreen", {
                    userId: userId,
                    userName: userInfors?.username,
                    avatar: userInfors?.avatar,
                  });
                }
              }}
              style={styles.addNews}
            >
              {userId ? (
                <Fontisto name="messenger" size={20} color="#ffffff" />
              ) : (
                <Icon name="add-circle-sharp" size={20} color="#ffffff" />
              )}

              {userId ? (
                <Text style={styles.addNewsText}>Nhắn tin</Text>
              ) : (
                <Text style={styles.addNewsText}>Thêm vào tin</Text>
              )}
            </TouchableOpacity>
            <View style={{ flexDirection: "row", width: 0.9 * width }}>
              {userId ? (
                <TouchableOpacity
                  onPress={() => {
                    if (is_friend == 2) {
                      setIsFriend(0);
                      userService
                        .delRequestFriend(cur)
                        .then((res) => console.log("Xóa kết bạn thành công "))
                        .catch((e) => console.log(e));
                    }
                    if (is_friend == 0) {
                      setIsFriend(2);
                      userService
                        .setRequestFriend(cur)
                        .then((res) => console.log("thêm bạn thành công"))
                        .catch((e) => console.log(e));
                    }
                  }}
                  style={styles.editInfor}
                >
                  <View style={styles.editInfor}>
                    {is_friend == 1 ? (
                      <>
                        <FontAwesome5
                          name="user-check"
                          size={20}
                          color="black"
                        />
                        <Text style={styles.editText}>{"Bạn bè"}</Text>
                      </>
                    ) : (
                      <>
                        {is_friend == 2 ? (
                          <>
                            <FontAwesome5
                              name="user-times"
                              size={20}
                              color="black"
                            />
                            <Text style={styles.editText}>{"Hủy"}</Text>
                          </>
                        ) : (
                          <>
                            <FontAwesome5
                              name="user-plus"
                              size={20}
                              color="black"
                            />
                            <Text style={styles.editText}>{"Thêm bạn bè"}</Text>
                          </>
                        )}
                      </>
                    )}
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("editProfile");
                  }}
                  style={styles.editInfor}
                >
                  <View style={styles.editInfor}>
                    <MaterialCommunityIcons
                      name="pencil"
                      size={20}
                      color="#000000"
                    />
                    <Text style={styles.editText}>
                      {"Chỉnh sửa trang cá nhân"}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              {userId != undefined && (
                <TouchableOpacity
                  style={styles.setting}
                  onPress={() =>
                    navigation.navigate("setting", { userId: userId })
                  }
                >
                  <View>
                    <MaterialIcons
                      name="more-horiz"
                      size={20}
                      color="#000000"
                    />
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        <View style={styles.secondView}>
          <Text style={styles.title}>Chi tiết</Text>
          <Text style={styles.description}>{userInfors?.description}</Text>
          <Text style={styles.title}>Coin</Text>
          <View style={styles.rowModal}>
            <View style={styles.iconModal}>
              <FontAwesome5 name="coins" size={15} />
            </View>
            <Text style={{ fontSize: 15, marginTop: 5, fontWeight: "500" }}>
              {userInfors.coins} coins
            </Text>
            {userInfors.id === user.id && (
              <TouchableOpacity onPress={handlePress}>
                <View style={styles.iconModal}>
                  <FontAwesome5 name="plus" size={15} />
                </View>
              </TouchableOpacity>
            )}
            {isModalVisible && (
              <View
                style={{
                  top: -70,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  marginLeft: 15,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 50,
                  width: 100,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    top: 70,
                  }}
                >
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderRadius: 5,
                      padding: 5,
                      margin: 10,
                      height: 30,
                      width: 120,
                      marginRight: 5,
                    }}
                    placeholder="Nhập coin"
                    keyboardType="numeric"
                    value={coinAmount}
                    onChangeText={(text) => setCoinAmount(text)}
                  />
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={{ padding: 0 }}
                  >
                    <FontAwesome5 name="times" size={20} color="#626262" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handelBuyCoin(coinAmount)}
                    style={{ padding: 5 }}
                  >
                    <FontAwesome5 name="check" size={20} color="#626262" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
          {isCoinLoading && (
            <View>
              <ActivityIndicator animating={true} size="large" color="green" />
            </View>
          )}
          {/* <View style={styles.rowInfor}>
                        <MaterialCommunityIcons name='school' size={27} color='#909698' />
                        <Text style={styles.hardTextAddress}>
                            Học tại
                        </Text>
                        <Text style={styles.data} numberOfLines={2}>
                            Đại học Bách Khoa Hà Nội
                        </Text>
                    </View>
                    <View style={styles.rowInfor}>
                        <MaterialCommunityIcons name='school' size={27} color='#909698' />
                        <Text style={styles.hardTextAddress}>
                            Từng học tại
                        </Text>
                        <Text style={styles.data}>
                            Đại học Bách Khoa Hà Nội
                        </Text>
                    </View>
                    <View style={styles.rowInfor}>
                        <MaterialCommunityIcons name='school' size={27} color='#909698' />
                        <Text style={styles.hardTextAddress}>
                            Đã học tại
                        </Text>
                        <Text style={styles.data}>
                            Tôi yêu bách khoa
                        </Text>
                    </View> */}
          {(userId ? userInfors.city : userInfor.city) ? (
            <View style={styles.rowInfor}>
              <Icon name="home-sharp" size={25} color="#909698" />
              <Text style={styles.hardTextAddress}>Sống tại</Text>
              <Text style={styles.data}>
                {userId ? userInfors.address : userInfor.address}
              </Text>
            </View>
          ) : (
            <View></View>
          )}
          {(userId ? userInfors.address : userInfor.address) ? (
            <View style={styles.rowInfor}>
              <FontAwesome5 name="map-marker-alt" size={25} color="#909698" />
              <Text style={styles.hardTextCountry}>Đến từ</Text>
              <Text style={styles.data}>{userInfors?.city}</Text>
            </View>
          ) : (
            <View></View>
          )}
          {(userId ? userInfors.country : userInfor.country) ? (
            <View style={styles.rowInfor}>
              <FontAwesome5 name="map-marker-alt" size={25} color="#909698" />
              <Text style={styles.hardTextCountry}>Đến từ</Text>
              <Text style={styles.data}>{userInfors?.country}</Text>
            </View>
          ) : (
            <View></View>
          )}
          {(userId ? userInfors.link : userInfor.link) ? (
            <View style={styles.rowInfor}>
              <FontAwesome5 name="link" size={25} color="#909698" />
              <Text style={styles.data}>{userInfors?.link}</Text>
            </View>
          ) : (
            <View></View>
          )}
          <View style={styles.rowInfor}>
            <MaterialIcons name="more-horiz" size={27} color="#909698" />
            <Text style={styles.hardTextAddress}>Xem thông tin giới thiệu</Text>
          </View>
          {!userId && (
            <TouchableOpacity
              onPress={() => navigation.navigate("editProfile")}
            >
              <View style={styles.editPublicInfor}>
                <Text style={styles.textEditPublic}>
                  Chỉnh sửa chi tiết công khai
                </Text>
              </View>
            </TouchableOpacity>
          )}
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.title}>Bạn bè</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("allfriend", {
                  title: userInfors?.username,
                  targetUserId: userInfors?.id,
                })
              }
            >
              <Text style={styles.titleButton}>Tìm bạn bè</Text>
            </TouchableOpacity>
          </View>
          <SimpleGrid
            data={friends}
            spacing={2}
            renderItem={({ item }) => (
              <Friend data={item} navigation={navigation} userId={user?.id} />
            )}
          />
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("allfriend", {
                title: userInfors?.username,
                targetUserId: userInfors?.id,
              })
            }
            style={{
              marginTop: 20,
              marginBottom: 20,
              backgroundColor: "#E4E6EB",
              height: 40,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              borderRadius: 5,
            }}
          >
            <Text style={styles.editText}>Xem tất cả bạn bè</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.thirdView}>
          <Text style={styles.titleThird}>Bài viết</Text>
          <TouchableOpacity
            onPress={() => {
              dispatch(resetEmojiSlice());
              navigation.navigate("createPost");
            }}
          >
            <View style={styles.thinking}>
              <Image
                source={
                  (userId ? !userInfors?.avatar : !userInfor.avatar)
                    ? require("../../assets/images/default_avatar.jpg")
                    : { uri: userId ? userInfors?.avatar : userInfor?.avatar }
                }
                style={styles.postImage}
              />
              <Text style={styles.thinkText}>Bạn đang nghĩ gì?</Text>
              <View style={styles.imageIcon}>
                <FontAwesome5 name="images" size={25} color="#61ec84" />
              </View>
            </View>
          </TouchableOpacity>
        </View>
        {listPostTotal?.map((item, index) => {
          return (
            <PostInHome
              navigation={navigation}
              key={index}
              postData={item}
              avatar={
                (userId ? !userInfors?.avatar : !userInfor.avatar)
                  ? require("../../assets/images/default_avatar.jpg")
                  : { uri: userId ? userInfors?.avatar : userInfor?.avatar }
              }
              userID={user.id}
            />
          );
        })}
      </ScrollView>
    </>
  );
}

function Friend({ data, navigation, userId }) {
  return (
    <TouchableOpacity
      onPress={() => {
        if (userId != data?.id) {
          navigation.navigate("profile", { userId: data?.id });
        }
      }}
    >
      <View style={styles.friendCard}>
        <Image
          source={
            !data?.avatar
              ? require("../../assets/images/default_avatar.jpg")
              : { uri: data?.avatar }
          }
          style={styles.imageFr}
        />
        <Text style={{ marginStart: 5, fontSize: 18, fontWeight: "500" }}>
          {data?.username}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default memo(ProfileScreen);
