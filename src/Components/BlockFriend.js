import { useEffect, useState } from "react";
import { Alert, Image, View } from "react-native";
import { TouchableOpacity } from "react-native";
import { COMMON_COLOR } from "../Services/Helper/constant";
import { Text } from "react-native";
import userService from "../Services/Api/userService";


export default function BlockFriend({ navigation, data }) {

    const [friendData, setFriendData] = useState(data);
    const [checkUnblock, setCheckUnblock] = useState(false);
    useEffect(() => {
        setFriendData(data);
    },[])
    // console.log('fr data: ',friendData)

    function handleUnBlock(id){
        userService.unblock(id).then((res) => {
            console.log('unblock: ', res);
            setCheckUnblock(true);
        }).catch((e) => {
            Alert.alert("Có lỗi xảy ra!");
            console.log(e.data);
        })
    }

    return <View style={{ width: '100%', paddingVertical: 5, flexDirection: 'row' }}>
        <TouchableOpacity>
            <Image source={
                !friendData?.avatar ? require('../../assets/images/default_avatar.jpg')
                    : { uri: friendData?.avatar }
            } style={{ width: 80, height: 80, borderRadius: 40, borderColor: COMMON_COLOR.GRAY_COLOR_BACKGROUND, borderWidth: 1, marginLeft: 15 }} />
        </TouchableOpacity>

        <View style={{ justifyContent: 'center', marginLeft: 10, flex: 1 }}>
            <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <View style={{ flexDirection: 'column', flex: 1, marginRight: 10 }}>
                    <Text style={{ fontSize: 17, fontWeight: '600' }}>{friendData?.name}</Text>
                </View>

                {
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', marginRight: 15 }}>
                        {!checkUnblock && <TouchableOpacity onPress={() => handleUnBlock(friendData.id)}
                            style={{ backgroundColor: COMMON_COLOR.BLUE_COLOR, padding: 10, marginRight: 3, borderRadius: 5 }}>
                            <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600', fontSize: 15 }}>Bỏ chặn</Text>
                        </TouchableOpacity>}
                        {checkUnblock && <TouchableOpacity
                            style={{ backgroundColor: COMMON_COLOR.GRAY_COLOR_BACKGROUND, padding: 10, marginRight: 3, borderRadius: 5 }}>
                            <Text style={{ color: 'black', textAlign: 'center', fontWeight: '600', fontSize: 15 }}>Đã bỏ chặn</Text>
                        </TouchableOpacity>}
                    </View>
                }
            </View>
        </View>
    </View>
}