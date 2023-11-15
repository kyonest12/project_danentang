import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, ToastAndroid } from "react-native";
import {
  PermissionsAndroid, Platform, SafeAreaView,
  ScrollView,
  TouchableOpacity, Button, Image, FlatList,
} from "react-native";
import SwipeUpDown from "react-native-swipe-up-down";
import { ImagePicker, Album, Asset } from "expo-image-multiple-picker";
import * as MediaLibrary from 'expo-media-library';
import { useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setNewData } from "../Redux/emojiSlice";
import { setImage, setVideo, setVideoSize, setAsset } from "../Redux/emojiSlice";

export default function ImageLibrary({ navigation }) {
  const dispatch = useDispatch();
  const post = useSelector((state) => state.emoji);
  const allTypeEqual = (assets) => {
    return assets.every(x => x.mediaType === assets[0].mediaType);
  };
  const getType = (filename) => {
    return filename.split('.').pop();
  }

  return (
    <View style={{ flex: 1 }}>
      <ImagePicker
        onSave={(assets) => {
          if (post.originalData.length == 0) {
            if (allTypeEqual(assets)) {
              if (assets[0].mediaType == "video") {
                if (assets.length > 1) {
                  ToastAndroid.show("Không thể upload nhiều video!", ToastAndroid.SHORT);
                } else if (assets[0].duration < 1) {
                  ToastAndroid.show("Không thể upload video quá ngắn!", ToastAndroid.SHORT);
                } else {
                  //console.log(assets);
                  dispatch(setNewData([{ filename: assets[0].filename, uri: assets[0].uri, type: 'video/' + getType(assets[0].filename) }]));
                  dispatch(setVideo());
                  dispatch(setAsset(assets));
                  dispatch(setVideoSize({ videoWidth: assets[0].width, videoHeight: assets[0].height }));
                  navigation.navigate("createPost");
                }
              } else {

                let image = [];
                assets.map(item => { image.push({ filename: item.filename, uri: item.uri, type: 'image/' + getType(item.filename) }) })
                dispatch(setNewData(image));
                dispatch(setAsset(assets));
                dispatch(setImage());
                navigation.navigate("createPost");
              }
            } else {
              ToastAndroid.show("Không thể upload ảnh và video cùng lúc!", ToastAndroid.SHORT);
            }
          } else {
            if (!allTypeEqual(assets)) {
              ToastAndroid.show("Không thể đăng ảnh và video cùng lúc!", ToastAndroid.SHORT);
            } else {
              if (post.checkVideo) {
                if (assets[0].mediaType == "image") {
                  ToastAndroid.show("Không thể đăng ảnh và video cùng lúc!", ToastAndroid.CENTER);
                } else {
                  ToastAndroid.show("Không thể đăng nhiều video!", ToastAndroid.CENTER);
                }
              } else {
                if (assets[0].mediaType == "video") {
                  ToastAndroid.show("Không thể đăng ảnh và video cùng lúc!", ToastAndroid.CENTER);
                } else {
                  if (assets.length + post.originalData.length > 4) {
                    ToastAndroid.show("Không thể đăng quá 4 ảnh", ToastAndroid.SHORT);
                  } else {
                    let image = [];
                    assets.map(item => { image.push({ filename: item.filename, uri: item.uri, type: 'image/' + getType(item.filename) }) })
                    dispatch(setNewData(image));
                    dispatch(setAsset(assets));
                    navigation.navigate("createPost");
                  }
                }
              }
            }
          }
        }}
        limit={4}
        multiple
        video
        galleryColumns={3}
        selected={post.assets}
        onCancel={() => console.log('no permissions or user go back')}>
      </ImagePicker>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  img: {
    marginLeft: 5,
    width: 30,
    height: 30,
    marginBottom: 5
  },


});