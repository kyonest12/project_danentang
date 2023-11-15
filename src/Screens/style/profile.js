import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from 'react-native-paper';
import { COMMON_COLOR } from '../../Services/Helper/constant';
const { width, height } = Dimensions.get('window');

export default styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ccc'
    },
    firstView: {
        flexDirection: 'column',
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#ffffff',
        height: height*0.62
    },
    coverImage: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        height: height*0.3,
        width: '100%',
        resizeMode: 'cover'
    },
    avatar: {
        marginTop: height*0.3 - width*0.2,
        position: 'absolute',
        width: width,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarImg: {
        width: width*40/100,
        height: width*40/100,
        borderRadius: width*40/100
    },
    name: {
        marginTop: height*0.01,
        fontWeight: 'bold',
        fontSize: 24
    },
    addNews: {
        borderRadius: 5,
        backgroundColor: '#2374E1',
        height: height*0.05,
        alignItems: 'center',
        justifyContent: 'center',
        width: width*0.9,
        flexDirection: 'row',
        marginTop: height*0.02,
        marginBottom: height*0.01
    },
    addNewsText: {
        fontSize: 15,
        color: '#ffffff',
        paddingStart: width*0.02,
        fontWeight: '500'
    },
    edit: {
        // flexDirection:' row',
        width: width*0.9
    },
    editInfor: {
        flex: 10,
        backgroundColor: '#E4E6EB',
        height: height*0.05,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderRadius: 5
    },
    editText: {
        fontSize: 15,
        color: '#000000',
        paddingStart: width*0.02,
        fontWeight: '500'
    },
    setting: {
        flex: 2,
        height: height*0.05,
        backgroundColor: '#E4E6EB',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginStart: width*0.02
    },

    secondView: {
        marginTop: 10,
        paddingHorizontal: 10,
        // height: 820,
        backgroundColor: '#FFFFFF',
    },

    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: height*0.02
    },
    rowInfor: {
        marginTop: height*0.02,
        flexDirection: 'row',
    },
    icon: {
        size: 20,
    },
    hardTextAddress: {
        fontSize: 15,
        marginStart: width*0.03
    },
    hardTextCountry: {
        fontSize: 15,
        marginStart: width*0.045
    },
    data: {
        fontSize: 15,
        fontWeight: 'bold',
        marginStart: 4,
        numberOfLines: 1,
    },
    editPublicInfor: {
        borderRadius: 5,
        backgroundColor: Colors.blue100,
        height: height*0.05,
        marginTop: 0.02*height,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textEditPublic: {
        fontSize: 15,
        color: COMMON_COLOR.BLUE_COLOR
    },
    thirdView: {
        marginTop: 10,
        paddingHorizontal: 10,
        height: 150,
        backgroundColor: '#FFFFFF',
    },
    titleThird: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 0.03*height
    },
    thinking: {
        marginTop: 0.03*height,
        flexDirection: 'row',
        height: 0.12*width,
        marginRight: 30
    },
    postImage: {
        height: 0.12*width,
        width: 0.12*width,
        borderRadius: 0.12*width,
    },
    thinkText: {
        fontSize:15,
        marginStart: 0.03*width,
        marginTop: 0.03*width
    },
    imageIcon: {
        marginTop: 0.03*width,
        marginStart: 0.35*width,
    },

    modalBox: {
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "flex-end",
        height: height,
        backgroundColor: "transparent"
    },
    contentAva: {
        position: "relative",
        bottom: 0,
        width,
        height: 280,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: "white",
        paddingTop: 30
    },
    rowModal: {
        flexDirection:'row',
        paddingHorizontal: 20,
        marginBottom: 15
    },
    iconModal: {
        height: 40,
        width:40,
        borderRadius: 40,
        backgroundColor: '#E4E6EB',
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15
    },
    contentCover: {
        position: "relative",
        bottom: 0,
        width,
        height: 350,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: "white",
        paddingTop: 30
    },
    friendCard: {
        // height: 140,
    },
    imageFr: {
        height: 110,
        width: 110,
        borderRadius: 15,
        marginBottom:5,
        marginTop: 10
    },
    titleButton: {
        fontSize: 15,
        fontWeight: '400',
        color: COMMON_COLOR.BLUE_COLOR,
        marginTop: height*0.03
    },

})