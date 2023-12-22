import {View, TouchableOpacity, Text, Image} from 'react-native';
import { TextInput, Button, Stack } from "@react-native-material/core";
import styles from './style/editDescription';
import React, { useEffect, useState, memo } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from 'react-native-vector-icons';
import { updateAddress } from '../Redux/userSlice';

export default function EditAddress({navigation, route}){

    const dispatch = useDispatch();
    const [isActive, setActive] = useState(false);
    const {userInfor} = useSelector((state) => state.user);
    const [address, setAddress] = useState(userInfor.address);
    const {user} = useSelector(
        (state) => state.auth
    );
    useEffect(() => {
        if (address != userInfor.address ) {
            navigation.setOptions({
                headerRight: () => (
                    <TouchableOpacity onPress={() => { setUserPublicInfor(); navigation.goBack() }}>
                        <Text style={{ color: 'black', fontSize: 18 }}>Lưu</Text>
                    </TouchableOpacity>
                )
            })
        } else {
            navigation.setOptions({
                headerRight: () => (
                    <Text style={{ color: '#6b6b6b', fontSize: 18 }}>Lưu</Text>
                )
            })
        }
    },[address]);

    const setUserPublicInfor = () => {
        // if (isEditCity) dispatch(setUserCity({city: city, userId: user.id}));
        // else dispatch(setUserCountry({country: city, userId: user.id}))
        dispatch(updateAddress(address));
    }

    return <View style={styles.container}>
        <View style={styles.firstView}>
            <Image source={user?.avatar === null ? require('../../assets/images/default_avatar.jpg') :{uri: user.avatar}} style = {styles.avatar}/>
            <View style={{ marginStart: 10 }}>
                <Text style={styles.username}>
                    {user.username}
                </Text>
                <View style={{flexDirection: 'row', marginTop: 3}}>
                    <Ionicons name='earth' size={16} color='#6b6b6b' style={{ marginTop: 3 }}/>
                    <Text style={{ fontSize: 16, color: '#6b6b6b', marginStart: 2}}>
                        Công khai
                    </Text>
                </View>
            </View>
        </View>
        <TextInput
            variant="standard"
            textAlignVertical = 'top'
            color='#1a53ff'
            style ={{paddingTop: 20}}
            defaultValue={userInfor.address}
            onChangeText={(text) => {setAddress(text)}}
            maxLength = {101}
        />
    </View> 
}