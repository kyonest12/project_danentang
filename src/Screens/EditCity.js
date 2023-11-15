import {View, TouchableOpacity, Text, Image} from 'react-native';
import { TextInput, Button, Stack } from "@react-native-material/core";
import styles from './style/editDescription';
import React, { useEffect, useState, memo } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from 'react-native-vector-icons';
import {setUserCity, setUserCountry} from '../Redux/userSlice';

export default function EditCity({navigation, route}) {
    const {isEditCity} = route.params
    console.log(isEditCity);
    const dispatch = useDispatch();
    const [isActive, setActive] = useState(false);
    const {userInfor} = useSelector((state) => state.user);
    const [city, setCity] = useState(isEditCity? userInfor.city:userInfor.country);
    const {user} = useSelector(
        (state) => state.auth
    );
    useEffect(() => {
        if (city != userInfor.city ) {
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
    },[city]);

    const setUserPublicInfor = () => {
        if (isEditCity) dispatch(setUserCity({city: city, userId: user.id}));
        else dispatch(setUserCountry({country: city, userId: user.id}))
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
            defaultValue={isEditCity? userInfor.city : userInfor.country}
            onChangeText={(text) => {setCity(text)}}
            maxLength = {101}
        />
    </View>
}
