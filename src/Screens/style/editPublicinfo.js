import {StyleSheet, Dimensions} from 'react-native';
const { width, height } = Dimensions.get('window');
export default style = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        flex: 9,
        backgroundColor: 'white'
    },
    viewButtonSave: {
        flex: 1,
        backgroundColor:'white',
        borderTopWidth: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButton: {
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#2374E1',
        height: height*0.05,
        alignItems: 'center',
        justifyContent: 'center',
        width: width - 20
    },
    firstView: {
        height: 100,
        borderBottomWidth: 0.5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 15
    },
    text: {
        fontSize: 20,
        fontWeight: 'w300',
    },
    secondView: {
        height: 110,
        paddingHorizontal: 10,
        borderBottomWidth: 0.5
    },
    thirdView: {
        height: 350,
        borderBottomWidth: 0.5,
        paddingHorizontal: 10,
    },
    textThirddView: {
        fontSize: 20,
        fontWeight: 'w300',
        marginBottom: 5
    },

})