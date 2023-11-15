import { StyleSheet, Dimensions } from 'react-native'

const { width } = Dimensions.get('window')

export default styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },

    bgAvatar: {
        flex: 3
    },

    name: {
        flex: 1
    },

    avatar:{
        width: width*15/100,
        height: width*15/100,
        borderRadius: width*10/100,
    },
})