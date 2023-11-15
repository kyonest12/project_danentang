import { Text, View, Button, StyleSheet, Image, TextInput, TouchableOpacity } from "react-native";
import LoadingDots from '../Components/LoadingDots';

export default function LoadingScreen({ navigation }) {
    
    return <View style={styles.container}>
        <Image
            style={styles.logoFacebook}
            source={require('../../assets/images/logo_facebook.png')}
        />
        <LoadingDots numberOfDots={5}
        style={{
            color: '#66B2FF',
            fontSize: 60,
          }}/>
    </View>
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
        backgroundColor: 'white'
    },
    logoFacebook: {
        width: 70,
        height: 70
    }
});