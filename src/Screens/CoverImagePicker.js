import { ImagePicker, Album, Asset } from "expo-image-multiple-picker";
import {useDispatch, useSelector} from 'react-redux';
import {View, TouchableOpacity, Text, ToastAndroid} from 'react-native';
import userServices from '../Services/Api/userService';
import {resetInforWithData} from '../Redux/userSlice';

export default function CoverImagePicker({navigation}) {
    const dispatch = useDispatch();
    const {user} = useSelector(
        (state) => state.auth
    );
    const {userInfor} = useSelector((state) => state.user);
    const getType = (filename) => {
        return filename.split('.').pop();
    }
    const showToast = (message) => {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    };
    navigation.setOptions({
        headerRight: () => (
            <TouchableOpacity onPress={() => { navigation.goBack() }}>
                <Text style={{ color: '#6b6b6b', fontSize: 18 }}>Hủy</Text>
            </TouchableOpacity>
        )
    });
    const setCover = (assets) => {
        let formData = new FormData();
        formData.append("cover_image", { name: assets[0].filename, uri: assets[0].uri, type: 'image/' + getType(assets[0].filename) });
        userServices.setCoverImage({formData: formData, userId: user.id}).then((result) => {
            dispatch(resetInforWithData(result))
            showToast('Cập nhật ảnh bìa thành công!');
        }).catch((e) => {
            Alert.alert("Có lỗi xảy ra", "Vui lòng thử lại sau.", [
                { text: "OK", onPress: () => null }
            ]);
        });
        navigation.goBack();
    }
    return <View style={{flex: 1}}>
        <ImagePicker
            onSave={(assets) => {
               setCover(assets);
            }}
            onCancel={() => console.log('no permissions or user go back')}
        />
    </View>
}