import {StyleSheet} from 'react-native';
import { Colors } from 'react-native-paper';
export default styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        paddingHorizontal: 10,
    },
    editAvatar: {
        height: 220,
        borderBottomWidth: 0.3,
        marginTop: 10,
        justifyContent: 'center',
    },
    titleAvatars: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.black
    },
    titleButton: {
        fontSize: 18,
        fontWeight: '400',
        color: 'blue'
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 150
    },
    editCover: {
        height: 300,
        borderBottomWidth: 0.3,
        marginTop: 10,
    },
    cover: {
        marginTop: 10,
        height: 240,
        borderRadius: 20,
    },
    description: {
        height: 80,
        borderBottomWidth: 0.3,
        marginTop: 10,
        justifyContent: 'center',
    },
    descriptionTitle: {
        fontSize: 20,
        color: '#7e8181'
    },
    rowInfor: {
        marginTop: 15,
        flexDirection: 'row',
    },
    icon: {
        size: 20,
    },
    hardTextAddress: {
        fontSize: 18,
        marginStart: 9
    },
    hardTextCountry: {
        fontSize: 18,
        marginStart: 13.5
    },
    hideText: {
        color:'#A3a4a4',
        fontSize: 18,
        marginStart: 8
    },
    data: {
        fontSize: 18,
        fontWeight: 'bold',
        marginStart: 4,
        numberOfLines: 1,
    },
    publicInfor: {
        marginTop: 10,
        height: 300,
        borderBottomWidth: 0.3,
    },
    favorite: {
        marginTop: 10,
        height: 50,
        borderBottomWidth: 0.3,
    },
    editInforButton: {
        borderRadius: 5,
        backgroundColor: '#e7f3ff',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10
    }
})