import { StyleSheet, Dimensions } from 'react-native'

const { width } = Dimensions.get('window')

export default styles = StyleSheet.create({
   wrapper: {
    flexDirection: 'column',
       flex: 1,
       backgroundColor: 'white'
   },
   title: {
       fontSize: 24,
       fontWeight: 'bold',
       color: 'black',
       padding: 20
   },
   container: {
       flex: 1,
       flexDirection: 'row',
       paddingHorizontal: 10,
       paddingVertical: 5,
   },

    bgAvatar: {
        flex: 2
    },
    avatar:{
        width: width*15/100,
        height: width*15/100,
        borderRadius: width*10/100,
    },
    info: {
        flex: 8,
        flexDirection: 'column',
        paddingLeft: 10,
        justifyContent: 'center'

    },
    name: {
        fontWeight: 'bold',
        color: 'black',
        fontSize: 16,
        paddingBottom: 3
    },
    bgSeen: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    avatarSeen: {
        width: width*5/100,
        height: width*5/100,
        borderRadius: width*2.5/100,
    },

    item: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100
    },

    inItem: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: 20
    },
    icon: {
        fontSize: width*6/100,
    },

    friendItem: {
        flex: 2,
    },

    chatItem: {
        flex: 8
    },
    searchView: {
        width: width*95/100,
        height: 40,
        marginHorizontal: width*2.5/100,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 5
    },
    search: {
        paddingLeft: width*2/100,
        paddingTop: 5
    }

})

