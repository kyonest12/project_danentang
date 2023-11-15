import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
// import CheckBox from '@react-native-community/checkbox';
import styles from './style/editPublicinfo.js';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useState} from 'react';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
export default function EditPublicInfor({ navigation }) {
    const dispatch = useDispatch();
    const {userInfor} = useSelector((state) => state.user);
    const [isEditCity, setIsEditCity] = useState(false);
    return  <View style={{flex: 1, flexDirection: 'column'}}>
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.firstView}>
                    <Text style={styles.title}>
                        Chỉnh sửa chi tiết công khai
                    </Text>
                    <Text style={{color: '#8e8e8e', fontSize: 20,  marginTop: 5}}>
                        Chi tiết bạn sẽ chọn hiển thị công khai
                    </Text>
                </View>
                <View style={styles.secondView}>
                    <Text style={styles.title}>
                        Công việc
                    </Text>
                    <View style={{ flexDirection: 'row', marginTop: 20}}>
                        <View style={{flex: 12}}>
                            <Text style = {styles.text}>
                                Student Dean rại Tôi yêu Yên Mô A
                            </Text>
                        </View>
                        <View style={{flex: 1}}>
                            <MaterialCommunityIcons name="pencil" size={30} color='#000000'/>
                        </View>
                    </View>
                </View>

                <View style={styles.thirdView}>
                    <Text style={styles.title}>
                        Công việc
                    </Text>
                    <View style={{ flexDirection: 'row', marginTop: 20, borderBottomWidth: 0.5, marginBottom: 5}}>
                        <View style={{flex: 12}}>
                            <Text style = {styles.textThirddView}>
                                {'Học tại đại học Bách Khoa Hà Nội\n- Hanoi University of Science and\nTechnology'}
                            </Text>
                        </View>
                        <View style={{flex: 1}}>
                            <MaterialCommunityIcons name="pencil" size={30} color='#000000'/>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 20, borderBottomWidth: 0.5, marginBottom: 5}}>
                        <View style={{flex: 12}}>
                            <Text style = {styles.textThirddView}>
                                {'Từng học tại đại học Bách Khoa Hà \nNội- Hanoi University of Science and\nTechnology'}
                            </Text>
                        </View>
                        <View style={{flex: 1}}>
                            <MaterialCommunityIcons name="pencil" size={30} color='#000000'/>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 20, marginBottom: 5}}>
                        <View style={{flex: 12, paddingBottom: 50}}>
                            <Text style = {styles.textThirddView}>
                                {'Đã học tại Tôi yêu Yên Mô A'}
                            </Text>
                        </View>
                        <View style={{flex: 1}}>
                            <MaterialCommunityIcons name="pencil" size={30} color='#000000'/>
                        </View>
                    </View>
                </View>

                <View style={styles.secondView}>
                    <Text style={styles.title}>
                        Tỉnh/Thành phố hiện tại
                    </Text>
                    <View style={{ flexDirection: 'row', marginTop: 20}}>
                        <View style={{flex: 12}}>
                            <Text style = {styles.text}>
                                {'Sống tại ' + userInfor.city}
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('editCity', {isEditCity: true})}
                        >
                            <View style={{flex: 1}}>
                                <MaterialCommunityIcons name="pencil" size={30} color='#000000'/>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.secondView}>
                    <Text style={styles.title}>
                        Quê quán
                    </Text>
                    <View style={{ flexDirection: 'row', marginTop: 20}}>
                        <View style={{flex: 12}}>
                            <Text style = {styles.text}>
                                {'Đến từ ' + userInfor.country}
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('editCity', {isEditCity: false})}
                        >
                            <View style={{flex: 1}}>
                                <MaterialCommunityIcons name="pencil" size={30} color='#000000'/>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
        <View style={styles.viewButtonSave}>
            <View style={styles.saveButton}>
                <Text style ={{color: 'white', fontSize: 20}}>
                    Lưu
                </Text>
            </View>
        </View>
    </View>
}