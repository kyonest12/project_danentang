import React, { useState, useEffect } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, TouchableOpacity } from "react-native";
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import authService from "../../Services/Api/authService";
export default function RemoveLoginInfoModal({ user, onClose, onRemoveLoginInfo }) {
    const handleRemoveLoginInfo = async () => {
        Alert.alert(`Xác nhận xóa thông tin đăng nhập của tài khoản ${user.username}?`, 
        "Mọi dữ liệu về tài khoản sẽ bị xóa có trong máy.", 
        [
            {
                text: "Hủy",
                onPress: () => null,
            },
            {
                text: "Xóa", onPress: () => {
                    onRemoveLoginInfo();
                    onClose();
                }
            }
        ]);

    }
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={true}
            onRequestClose={() => onClose()}
        >
            <View style={styles.container}>
                <View style={styles.modalView}>
                    {/* <Text style={styles.modalText}>Thao tác</Text> */}
                    <TouchableOpacity style={{ height: 30, margin: 5 }} onPress={() => handleRemoveLoginInfo()}>
                        <Text style={{ fontSize: 16 }}>Gỡ tài khoản khỏi thiết bị</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ height: 30, margin: 5, marginBottom: 0 }}>
                        <Text style={{ fontSize: 16 }}>Tắt thông báo đẩy</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalView: {
        // width: '95%',
        flexDirection: "column",
        backgroundColor: "white",
        borderRadius: 5,
        padding: 10,
        // height: 100,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        textAlign: "center",
        fontSize: 18
    }
});