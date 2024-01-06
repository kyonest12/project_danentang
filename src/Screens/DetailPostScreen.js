import React, { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import PostInHome from "../Components/PostInHome";
import { useSelector } from "react-redux";
import postService from "../Services/Api/postService";
import { TouchableOpacity } from "react-native";
import { COMMON_COLOR } from "../Services/Helper/constant";

export default function DetailPostScreen({navigation, route}){

    var postId = route?.params?.post.post.id;
    // console.log('post data: ',postId);
    const [postData, setPostData] = useState({});
    useEffect(() => {
        postService.getPost(postId).then((res) => {
            console.log('get post: ', res);
            setPostData(res.data);
            console.log('media: ', res.data.image)
        }).catch((e) => {
            console.log('Loi: ', e.response);
        })
    },[])
    const { user } = useSelector(
        (state) => state.auth
    );

    function updateTimeAgo(time) {
        const now = new Date();
        const then = new Date(time);
        const timeDiff = now - then;
        
        const minutes = Math.floor(timeDiff / (1000 * 60));
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) {
        return days + ' ngày trước';
        } else if (hours > 0) {
        return hours + ' giờ trước';
        } else if (minutes > 0) {
        return minutes + ' phút trước';
        } else {
        return 'Vừa xong'
        }
    };

    return <View>
        <View style={{flexDirection: 'row', marginTop: 15, alignItems: 'center'}}>
            <TouchableOpacity>
                <Image source={
                    !postData.author?.avatar ? require('../../assets/images/default_avatar.jpg')
                        : { uri: postData?.author?.avatar }
                } style={{ width: 60, height: 60, borderRadius: 30, borderColor: COMMON_COLOR.GRAY_COLOR_BACKGROUND, borderWidth: 1, marginLeft: 15 }} />
            </TouchableOpacity>
            <View style={{marginLeft: 20}}>
                <Text>
                    <Text style={{fontWeight: 'bold'}}>{postData?.author?.name }</Text> đang cảm thấy {postData?.state}
                </Text>
                <Text>{updateTimeAgo(postData?.created)}</Text>
            </View>
        </View>

        <Text style={{marginLeft: 15, marginTop: 10, marginBottom: 10}}>{postData?.described}</Text>

        {
            (postData?.image?.length > 0) && (
                <View>
                    {postData?.image.map((item) => (
                        <View key={item.id}>
                            <Image source={{uri: item?.url}} style={{height: 300, width: 'auto'}}></Image>
                            <Text style={{marginBottom: 5}}></Text>
                        </View>
                    ))}
                </View>
            )
        }
        {/* feeling bars */}

    </View>
}