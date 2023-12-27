import { Alert, Text } from "react-native";
import { View } from "react-native";
import userService from "../Services/Api/userService";
import { useEffect, useState } from "react";
import BlockFriend from "../Components/BlockFriend";

function ListBlock({navigation}){

    const [listBlock, setListBlock] = useState([]);

    useEffect(() => {
        userService.getListBlock("0", "8").then((res) => {
            // console.log('block list: ', res);
            setListBlock(res.data)
            console.log('list block: ', listBlock);
        }).catch((e) => {
            Alert.alert("Có lỗi xảy ra!");
            console.log(e.data);
        })
    }, [])

    return <View>
        <View style={{marginHorizontal: -5}}>
            {
                listBlock?.map((item, index) => {
                    return <View key={index}>
                        <BlockFriend navigation={navigation} data={item}></BlockFriend>
                    </View>
                })
            }
        </View>
    </View>
}

export default ListBlock;