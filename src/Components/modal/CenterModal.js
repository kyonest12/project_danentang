import React, { useState, useEffect } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View } from "react-native";
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
export default function CenterModal({ icon, body, onClose }) {
    const [modalVisible, setModalVisible] = useState(true);
    useEffect(() => {
        // const timer = setTimeout(() => {
        //     setModalVisible(false);
        // }, 2000);
        // return () => clearTimeout(timer);
    }, []);
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={true}
        >
            <View style={styles.container}>
                <View style={styles.modalView}>

                    {
                        icon === 'wifi' ?
                            <AntDesign name="wifi" size={15} color="black" /> :
                            icon === 'wifi-off' ?
                                <Feather name="wifi-off" size={15} color="black" /> :
                                <></>
                    }
                    <Text style={styles.modalText}>{body}</Text>
                    <Pressable
                        style={{ top: 3, right: 6, position: 'absolute' }}
                        onPress={() => {
                                //setModalVisible(!modalVisible);
                                onClose();
                            }
                        }
                    >
                        <Ionicons name="md-close" size={25} color="#626262" />
                    </Pressable>
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
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
    modalView: {
        width: '95%',
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        margin: 5,
        backgroundColor: "white",
        borderRadius: 5,
        padding: 30,
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
        fontSize: 18,
        color: '#ABABAB'
    }
});