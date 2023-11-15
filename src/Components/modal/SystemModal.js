import React, { useState, useEffect } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons'; 
export default function SystemModal ({ icon, body }){
    const [modalVisible, setModalVisible] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setModalVisible(false);
        }, 2000);
        return () => clearTimeout(timer);
      }, []);
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
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
                        onPress={() => setModalVisible(!modalVisible)}

                    >
                        <AntDesign name="closecircle" size={15} color="black" />
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    modalView: {
        width: '95%',
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        margin: 5,
        backgroundColor: "white",
        borderRadius: 5,
        padding: 12,
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
        textAlign: "center"
    }
});