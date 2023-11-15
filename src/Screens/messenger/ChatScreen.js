import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TextInput, View, Button, Touchable, TouchableOpacity, Image, ScrollView, BackHandler } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { useDispatch, useSelector } from "react-redux";
import { getTextWithIcon } from "../../Services/Helper/common";
//đây là mỗi phần tử tin nhắn, props gồm mess, avt, role(của ai)
import useKeyBoard from '../../Components/UseKeyBoard';
import ViewWithIcon from "../../Components/ViewWithIcon";
function MessageItem(props) {
  // const {socket} = props;

  // const handleAddDialog = () => {
  //   socket?.emit('client_add_dialog', {
  //     token: user.token,
  //     senderId: user.id,
  //     //id của người muốn nhắn
  //     targetUserId: '639315083fa4155480da25f0',
  //     content: 'Tin nhắn 3'
  //   })
  // }
  // useEffect(() => {
  //   socket?.emit('client_join_conversation', {
  //     // thisUserId, targetUserId, token
  //     token: user.token,
  //     thisUserId: user.id,
  //     //id của người muốn nhắn
  //     targetUserId: '639315083fa4155480da25f0'
  //   })
  //   socket?.on('server_send_conversation', (data) => {
  //     console.log('server_send_conversation', data);
  //   })
  // }, [])


  if (props.idSender != props.idUser)
    return (
      <View style={[styles.messContainer, { alignSelf: "flex-start" }]}>

        <Image
          style={{ width: 25, height: 25, borderRadius: 100 }}
          source={{
            uri: props?.avt,
          }}
        />
        {/* //nội dung tin nhắn */}
        <View style={styles.messItemLeft}>
          <ViewWithIcon value={props.mess}
            styleText={{ color: "#0b0b0b", fontSize: 16 }}
            styleIcon={{ width: 17, height: 17 }} />
        </View>
      </View>
    );
  else
    return (
      <View style={[styles.messContainer, { alignSelf: "flex-end" }]}>
        {/* //nội dung tin nhắn */}
        <View style={{ flexDirection: "row-reverse", alignSelf: "flex-end", width: "100%", alignItems: "flex-end", paddingRight: 12 }}>
          <Image
            style={{ width: 16, height: 16, borderRadius: 100, top: -2 }}
            source={
              props.unread == 0 ?
                props.lastSeenMessage ? {
                  uri: props.avt,
                }
                  : { uri: 'no' }

                : require('../../../assets/icons/tich-xanh.png')
            }
          />
          <View style={styles.messItemRight}>
            <ViewWithIcon value={props.mess}
              styleText={{ color: "white", fontSize: 16 }}
              styleIcon={{ width: 17, height: 17 }} />
          </View>

        </View>
      </View>
    );
}

export default function ChatScreen({ navigation, socket, route }) {
  const avt = "https://th.bing.com/th/id/R.48ac79937e802aca754189ff2ff01335?rik=YtcCFFZstPA2Ag&riu=http%3a%2f%2fwww.tackrus.com%2fv%2fimages%2fConchos%2fCo382.jpg&ehk=QANjYCteo%2bodzasMutgC6Hd4yGP4TxJKNyDzF%2fvU8cc%3d&risl=&pid=ImgRaw&r=0";
  const time = "17 THG 12, 2023 LÚC 10:00";
  const name = "Nguyễn A";
  const info = "Đã học tại Đại học Back khoa Hà Nội";
  const { user } = useSelector(
    (state) => state.auth
  );
  // danh sach cac tin nhan
  const [conversation, setCoversation] = useState([]);
  //thông tin người đang nhắn
  const { userName, userId, avatar } = route.params;
  //tin nhắn muốn gửi
  const [textMessage, setTextMessage] = useState("");
  const [lastSeenMessage, setLastSeenMessage] = useState();
  const mess = useRef();
  const handleAddDialog = (mess) => {
    socket?.emit('client_add_dialog', {
      token: user.token,
      senderId: user.id,
      targetUserId: userId,
      content: getTextWithIcon(mess + " ")
    })
  }
  const isKeyboardVisible = useKeyBoard();
  const handleBack = () => {
    socket?.emit('client_leave_conversation', {
      token: user.token,
      thisUserId: user.id,
      targetUserId: userId
    })
    navigation.goBack();
  }
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        handleBack();
        return true;
      }
    );
    return () => backHandler.remove();
  }, []);
  useEffect(() => {
    mess.current.scrollToEnd({ animated: true })
  }, [isKeyboardVisible])
  useEffect(() => {
    socket?.emit('client_join_conversation', {
      // thisUserId, targetUserId, token
      token: user.token,
      thisUserId: user.id,
      targetUserId: userId
    })
    socket?.on('server_send_conversation', (data) => {
      if (data.message != "OK") return;
      setCoversation(data.data.dialog);
      let list = data.data.dialog;
      for (let i = list.length - 1; i >= 0; i--) {
        if (list[i].unread == "0" && list[i].sender == user.id) {
          setLastSeenMessage(list[i]._id);
          break;
        }
      }
      // console.log("data kkkkkk", typeof conversation);
    })
    //set option cho thanh tren cung
    navigation.setOptions({
      headerLeft: () => (
        <>
          <TouchableOpacity
            style={{ marginRight: 10, marginTop: 5 }}
            onPress={() => handleBack()}>
            <AntDesign name="arrowleft" size={25} />
          </TouchableOpacity>
          <View style={{ flexDirection: "row", marginHorizontal: 20 }}>
            <Image
              style={{ width: 40, height: 40, borderRadius: 100, marginLeft: -20 }}
              source={(!avatar) ? require('../../../assets/images/default_avatar.jpg') : { uri: avatar }}
            />
            <Text style={{ fontWeight: 'bold', fontSize: 20, marginTop: 8, marginLeft: 5 }}>{userName}</Text>
          </View>
        </>
      ),
      headerTitle: () => null,
      headerRight: () => (
        <View style={{ flexDirection: "row", height: 50, alignItems: "center" }}>
          <Ionicons name="call" size={24} color="#0099ff" style={{ marginLeft: 5 }} />
          <FontAwesome name="video-camera" size={24} color="#0099ff" style={{ marginLeft: 15 }} />
          <FontAwesome name="info-circle" size={24} color="#0099ff" style={{ marginLeft: 15 }} />
        </View>
      )
    });
  }, [socket])
  return (
    <View style={styles.container}>
      {/* thanh tim kiem */}
      <View style={{ marginTop: 10 }}>
        <TextInput
          style={{
            fontSize: 17,
            backgroundColor: '#f1f2f4',
            marginTop: 0,
            height: 40,
            paddingRight: 10,
            paddingLeft: 10,
            borderRadius: 25
          }}
          placeholder=" Tìm kiếm trong cuộc trò chuyện "
          keyboardType="default"
        >
          <Ionicons style={{ border: 1, width: 20, marginTop: 2 }} name="search" size={20} color="grey" />
          <Text style={{ color: "grey" }}> Tìm kiếm trong cuộc trò chuyện </Text>
        </TextInput>
      </View>


      <ScrollView showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        ref={ref => { mess.current = ref }}
        onContentSizeChange={() => mess.current.scrollToEnd({ animated: true })}
        style={{ width: "100%" }}>
        <View style={{ alignItems: "center", marginLeft: 5, marginRight: 2 }}>
          <Image source={(!avatar) ? require('../../../assets/images/default_avatar.jpg') : { uri: avatar }} style={{ width: 110, height: 110, borderRadius: 500, marginTop: 50 }} />
          <Text style={{ fontWeight: "bold", fontSize: 22, marginTop: 5 }}>{userName}</Text>
          <Text style={{ fontSize: 15, marginTop: 10 }}>Các bạn là bạn bè trên Facebook</Text>
          <Text style={{ fontSize: 15, marginTop: 5, color: "grey" }}>{info}</Text>
          <Text style={{ fontSize: 15, marginTop: 35, color: "grey", marginBottom: 25 }}>{time}</Text>
          {conversation.map((e, index) =>
            <MessageItem key={e._id} lastSend={index === conversation.length - 1} lastSeenMessage={lastSeenMessage == e._id}
              mess={e.content} avt={avatar} idSender={e.sender} idUser={user.id} unread={e.unread} keyExtractor={(e) => e._id} />
          )}
        </View>
      </ScrollView>

      {/* thanh nhập tin nhắn */}
      <View style={styles.nhapTinNhan}>
        <AntDesign name="appstore1" size={24} color="#0099ff" style={{ marginLeft: 5 }} />
        <Entypo name="camera" size={24} color="#0099ff" style={{ marginLeft: 10 }} />
        <Entypo name="image" size={24} color="#0099ff" style={{ marginLeft: 10 }} />
        <Entypo name="mic" size={24} color="#0099ff" style={{ marginLeft: 10 }} />
        <TextInput
          style={{
            fontSize: 17,
            backgroundColor: '#f2f3f4',
            marginLeft: 10,
            height: 40,
            width: "50%",
            paddingRight: 10,
            paddingLeft: 10,
            borderRadius: 25
          }}
          placeholder=" Aa"
          keyboardType="default"
          value={getTextWithIcon(textMessage)}
          onChangeText={(text) => { setTextMessage(text); }}
          onSubmitEditing={async () => { await handleAddDialog(textMessage); setTextMessage("") }}
        ></TextInput>
        <AntDesign name="like1" size={24} color="#0099ff" style={{ marginLeft: 10 }} />
      </View>

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white"
  },
  messContainer: {
    width: '80%',
    shadowColor: "#000",
    flexDirection: "row",
    marginTop: 3,
    alignItems: "flex-end"
  },
  messItemLeft: {
    borderRadius: 20,
    backgroundColor: '#f1f2f6',
    marginLeft: 5,
    marginRight: 30,
    marginBottom: 0,
    width: 'auto',
    padding: 10
  },
  messItemRight: {
    borderRadius: 20,
    backgroundColor: '#f1f2f6',
    marginRight: 2,
    marginBottom: 0,
    width: 'auto',
    padding: 10,
    backgroundColor: "#0099ff"
  },
  nhapTinNhan: {
    flexDirection: "row",
    height: 50,
    width: "100%",
    alignItems: "center"
  }

});
