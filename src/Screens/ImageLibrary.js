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
import { setDataImage } from "../Redux/emojiSlice";
import { setImage, setVideo } from "../Redux/emojiSlice";

export default function ImageLibrary({ navigation }) {
  const dispatch = useDispatch();
  const allTypeEqual = (assets) => {
    return assets.every(x => x.mediaType === assets[0].mediaType);
  };
  const allTimeVideo = (assets) => {
    return assets.every(x => x.mediaType === assets[0].mediaType);
  };

  return (
    <View style={{ flex: 1 }}>
      <ImagePicker
        onSave={(assets) => {
          if (allTypeEqual(assets)) {
            if (assets[0].mediaType == "video") {
              if (assets.length > 1) {
                ToastAndroid.show("Không thể upload nhiều video!", ToastAndroid.SHORT);
              } else if (assets[0].duration < 1) {
                ToastAndroid.show("Không thể upload video quá ngắn!", ToastAndroid.SHORT);
              } else {
                dispatch(setDataImage(assets));
                dispatch(setVideo());
                navigation.navigate("createPost");
              }
            } else {
              dispatch(setDataImage(assets));
              dispatch(setImage());
              navigation.navigate("createPost");
            }
          } else {
            ToastAndroid.show("Không thể upload ảnh và video cùng lúc!", ToastAndroid.SHORT);
          }
        }}
        limit={4}
        multiple
        video
        galleryColumns={3}
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