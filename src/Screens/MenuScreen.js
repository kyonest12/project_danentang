import React, { useEffect, useState, memo } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Button
} from 'react-native';
import { connect } from 'react-redux';
import { useDispatch, useSelector } from "react-redux";
import {
    _getCache,
    _setCache
} from '../Services/Helper/common';
import { logout, resetAuthSlice } from "../Redux/authSlice";
import { resetPostSlice } from '../Redux/postSlice';
function MenuScreen() {
    const dispatch = useDispatch();
    const handleLogout = () => {
        // reset store
        dispatch(resetPostSlice());
        dispatch(resetAuthSlice());
        dispatch(logout());
    }   
    return (
        <View style={{flex: 1}}>
            <Text>Setting</Text>
            <Button
                onPress={() => handleLogout()}
                title="Đăng xuất"
                color="#841584"
                accessibilityLabel="Learn more about this purple button"
            />
        </View>
    );
}


export default memo(MenuScreen);
