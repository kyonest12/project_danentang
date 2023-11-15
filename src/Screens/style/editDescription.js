import {StyleSheet} from 'react-native';

export default styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 15
    },

    firstView: {
        flexDirection: 'row',
        height: 55,
        marginTop: 20,
        marginBottom: 10
    },
    avatar: {
        width: 55,
        height: 55,
        borderRadius: 55,
    },
    username: {
        fontSize: 20,
        fontWeight: 'bold',

    },

    editView: {
        height: 193,
        borderLeftWidth: 0.8,
        borderRightWidth: 1,
        borderTopWidth: 0.8,
        borderColor: '#afafaf'
    },

    editViewFocus: {
        height: 193,
        borderLeftWidth: 2,
        borderRightWidth: 1,
        borderTopWidth: 1,
        borderColor: '#1a53ff',
    }

})
