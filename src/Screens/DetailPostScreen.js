import React from "react";
import { Text, View } from "react-native";
import PostInHome from "../Components/PostInHome";
import { useSelector } from "react-redux";

export default function DetailPostScreen({navigation, route}){

    var post = route?.params?.post;
    console.log(post);
    const { user } = useSelector(
        (state) => state.auth
    );

    return <View>
        <PostInHome navigation={navigation} postData={post} userID={user.id} />
    </View>
}