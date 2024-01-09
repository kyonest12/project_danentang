import { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
import ViewWithIcon from "./ViewWithIcon";
import { IconButton } from "react-native-paper";
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function ComponentComment(props) {
    const [editing, setEditing] = useState(false);

    // console.log("props: ", props);
    function sendMarkId(id){
        props.callback(id);
    }

    useEffect(() => {
        if(props.checkDoneEdit) setEditing(false);
    }, [props.checkDoneEdit])

    function handleEditComment(){
        setEditing(true);
        props.edit(
            {
                parentId: props.parentId,
                content: props.textComment,
                type: props.type,
                name: props.name
            }
        );
    }


    return (
        <View style={styles.commentContainer}>
            <Image
                style={styles.image}
                source={{
                    uri: props?.urlImage,
                }}
            />

            <View>
                {/* //comment text */}
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={[styles.commentComponent, { marginTop: 0 }]}>
                        <Text style={{ fontWeight: 'bold', fontSize: 17 }}>{props?.name}</Text>
                        <View>
                            {
                                !editing && (
                                    <ViewWithIcon value={props?.textComment}
                                    styleText={{ fontSize: 17 }}
                                    styleIcon={{ width: 17, height: 17 }} />
                                )
                            }
                            {
                                editing && (
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Text style={{color: 'blue'}}>Bình luận đang chỉnh sửa</Text>
                                        <TouchableOpacity onPress={() => {setEditing(false); props.cancelEdit()}}>
                                            <IconButton
                                                icon={() => <Icon name="times" size={15} color="black" />} // Sử dụng icon "đầu X" từ FontAwesome5
                                            />
                                        </TouchableOpacity>
                                    </View>
                                )
                            }
                        </View>
                    </View>
                    {props.isOwner && !editing && props.type != "-1" && (
                        <TouchableOpacity onPress={() => handleEditComment()}>
                            <Icon name="edit" size={20} color="#656766" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* //time+like+response */}
                <View style={{ flexDirection: 'row', marginLeft: 15 }}>
                    <Text style={{ fontSize: 13, color: '#656766', marginRight: 13 }}>{props?.time}</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#656766', marginRight: 13 }}>
                        {props.type == "1" ? "Trust" : (props.type == "0" ? "Fake": " ")}
                    </Text>
                    {props.type != "-1" && (
                        <TouchableOpacity onPress={() => sendMarkId({id: props.markId, name: props.name})}>
                            <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#656766' }}> 
                                Phản hồi
                            </Text>
                    </TouchableOpacity>
                    )}

                    {/* số like comment */}

                    {/* <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#656766', marginLeft: 20, marginRight: 2 }}>1</Text>
                    <View style={{ width: 16, height: 16, marginTop: 2, borderRadius: 20, paddingTop: 1, alignItems: 'center' }}>
                        <Ionicons style={{}} name="happy-outline" size={15} color="#626262" />
                    </View>
                    <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#656766', marginLeft: 20, marginRight: 2 }}>1</Text>
                    <View style={{ width: 16, height: 16, marginTop: 2, borderRadius: 20, paddingTop: 1, alignItems: 'center' }}>
                        <Ionicons style={{}} name="sad-outline" size={15} color="#626262" />
                    </View> */}


                </View>
            </View>


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: "flex-end",
        alignItems: "center",
    },
    modalView: {
        width: '100%',
        height: '100%',
        marginTop: 5,
        backgroundColor: "white",
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 100,

    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        textAlign: "center"
    },

    like: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center"
    },
    phuhopnhat: {

        flex: 1,
        flexDirection: "row",

    },
    comment: {

        flex: 10
    },
    binhluan: {
        flex: 2.4,
        borderTopWidth: 1.5,
        borderTopColor: '#d2d2d2'
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    input: {
        fontSize: 22,
        height: 50,
        backgroundColor: '#f1f2f4',
        borderRadius: 25,
        paddingLeft: 10,
        flex: 9, // Chiếm 80% chiều rộng
    },
    sendButton: {
        marginLeft: 10,
        flex: 1, // Chiếm 20% chiều rộng
    },
    touchable: {
        flexDirection: "row",
        flex: 7
    },


    //phan danh cho phan tu comment
    commentContainer: {
        width: '100%',
        marginTop: 5,
        backgroundColor: "white",
        padding: 10,
        shadowColor: "#000",
        flexDirection: "row",
        marginTop: -8
    },
    image: {
        width: 40,
        height: 40,
        backgroundColor: '#ffd480',
        borderRadius: 100
    },
    commentComponent: {
        borderRadius: 15,
        backgroundColor: '#f1f2f6',
        marginLeft: 5,
        marginRight: 30,
        width: 'auto',
        padding: 10
    }

});