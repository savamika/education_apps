import React, { useState, useCallback, useRef, useEffect } from 'react'
import { RefreshControl, Button, useWindowDimensions, TouchableOpacity, View, Text, ScrollView, SafeAreaView, StatusBar, Dimensions, StyleSheet, Image, ImageBackground } from 'react-native';
import { Button as Btn, Snackbar, Appbar, TextInput, Avatar, Card, Title, Paragraph, Dialog, Chip, Searchbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useSelector, useDispatch } from 'react-redux';
import { CLEAR_STORE } from '../store/CounterSlice';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import * as  config from '../common/config'
import ActionSheet from "react-native-actions-sheet";
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import * as String from '../common/String'
import { multiply } from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';

const style = StyleSheet.create({
    viewImg: {
        backgroundColor: config.color.primery2,
        padding: 10,
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        height: '35%'
    },
    textPertanyaan: {
        fontSize: 16,
        fontWeight: 'bold',
        color: config.color.white,
        paddingTop: 10
    },
    textInfo: {
        fontSize: 12,
        color: config.color.white,
        paddingTop: 2
    },
    container: {
        flexDirection: "row",
        // backgroundColor: 'black'
    },
    square: {
        width: '30%',
        height: 40,
        marginRight: 5,
        marginLeft: 5
    },
    spinnerTextStyle: {
        color: '#FFF'
    },
})

const ProfileSiswa = (props) => {
    const navigation = props.navigation;
    const [refreshing, setRefreshing] = useState(false);
    const FIRST_NAME = useState(useSelector((state) => state.counter.FIRST_NAME));
    const [dataUser, setDataUser] = useState({});
    const _setData = async () => {
        try {
            let tmp_data = JSON.parse(await AsyncStorage.getItem('USERDATA'));
            console.log('tmp_data', tmp_data)
            setDataUser((e) => tmp_data)
            let tmp_lastname = tmp_data.lastname == null ? '' : tmp_data.lastname
            setNamaSiswa((e) => tmp_data.firstname + ' ' + tmp_lastname)
        } catch (error) {

        }
        setRefreshing((state) => false);
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        _setData();

        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);


    const [namaSiswa, setNamaSiswa] = useState('');
    const [visibleSpinner, setVisibleSpinner] = useState(false);
    const dispatch = useDispatch();

    const width = Dimensions.get('window').width;
    const btnBottom = (width) - 10;

    const widthCard = (width / 3) - 10
    const haightCard = (widthCard / 2) + (widthCard * (20) / 100)

    const [visible, setVisible] = React.useState(false);
    const onToggleSnackBar = () => setVisible(!visible);
    const onDismissSnackBar = () => setVisible(false);

    // useEffect(() => {
    //     _setData()
    // }, [])
    useFocusEffect(() => {
        _setData()
    })

    const goBack = (navigation) => {
        console.log('back');
        navigation.goBack()
    }


    return (
        <View style={{ height: '100%' }}>
            <View style={{ padding: 10, backgroundColor: config.color.primery2 }}>
                <StatusBar backgroundColor={config.color.primery2} />
                {/* <Appbar.Header style={{ backgroundColor: config.color.primery2 }}>
                    <Appbar.BackAction color={config.color.white} onPress={() => { goBack(navigation) }} />
                </Appbar.Header> */}
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Akun anda</Text>
            </View>
            <View style={style.viewImg}>
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }>
                    <Avatar.Image
                        size={104}
                        source={{ uri: dataUser.picture }}
                        style={{ backgroundColor: config.color.abuabu }}
                    />
                    <View style={{ alignItems: 'center' }}>
                        <Text style={style.textPertanyaan}>
                            {namaSiswa}
                        </Text>
                        <Chip style={{ marginTop: 5, height: 30, fontWeight: 'bold', backgroundColor: config.color.primery, color: 'white' }} >
                            <Icon name='check-bold' color="white"></Icon>
                            <Text icon='check' style={{ color: 'white' }}>Siswa</Text>
                        </Chip>
                    </View>
                </ScrollView>
            </View>
            <View style={{ flex: 1 }}>
                <View style={{ padding: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Pembelajaran</Text>
                </View>
                <View style={style.container}>
                    <View style={style.square}>
                        <Card style={{ width: widthCard, height: haightCard }}>
                            <Card.Content style={{}}>
                                <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                    <Icon size={20} name='book-open-outline' />
                                    <Text style={{ fontSize: 12, paddingTop: 10 }}>Private</Text>
                                </View>
                            </Card.Content>
                        </Card>
                    </View>
                    <View style={style.square}>
                        <Card style={{ width: widthCard, height: haightCard }}>
                            <Card.Content style={{}}>
                                <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                    <Icon size={20} name='google-classroom' />
                                    <Text style={{ fontSize: 12, paddingTop: 10 }}>Kelas</Text>
                                </View>
                            </Card.Content>
                        </Card>
                    </View>
                    <View style={style.square}>
                        <Card style={{ width: widthCard, height: haightCard }}>
                            <Card.Content style={{}}>
                                <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                    <Icon size={20} name='calendar-blank-outline' />
                                    <Text style={{ fontSize: 12, paddingTop: 10 }}>Jadwal</Text>
                                </View>
                            </Card.Content>
                        </Card>
                    </View>
                </View>
            </View>
            <View style={{ flex: 1, paddingTop: 20 }}>
                <View style={{ padding: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Pengaturan</Text>
                </View>
                <View style={style.container}>
                    <View style={style.square}>
                        <Card style={{ width: widthCard, height: haightCard }} onPress={async (e) => {
                            let tmp_data = JSON.parse(await AsyncStorage.getItem('USERDATA'));
                            navigation.navigate('ProfileDataDiri', { data_user: tmp_data })

                        }}>
                            <Card.Content style={{}}>
                                <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                    <Icon size={20} name='card-account-details-outline' />
                                    <Text style={{ fontSize: 12, paddingTop: 10 }}>Profile</Text>
                                </View>
                            </Card.Content>
                        </Card>
                    </View>
                    <View style={style.square}>
                        <Card style={{ width: widthCard, height: haightCard }}>
                            <Card.Content style={{}}>
                                <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                    <Icon size={20} name='lock-outline' />
                                    <Text style={{ fontSize: 12, paddingTop: 10 }}>Keamanan</Text>
                                </View>
                            </Card.Content>
                        </Card>
                    </View>
                    <View style={style.square}>
                        <Card style={{ width: widthCard, height: haightCard }}>
                            <Card.Content style={{}}>
                                <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                    <Icon size={20} name='bell-outline' />
                                    <Text style={{ fontSize: 12, paddingTop: 10 }}>Notifikasi</Text>
                                </View>
                            </Card.Content>
                        </Card>
                    </View>
                </View>
            </View>


            <View style={{ padding: 10, flex: 1, justifyContent: 'flex-end' }}>
                <Btn
                    mode="outlined"
                    onPress={async () => {
                        setVisibleSpinner(true);
                        dispatch(CLEAR_STORE());
                        await AsyncStorage.setItem('@IS_LOGIN', '0');
                        await AsyncStorage.setItem('@LEVEL', '');
                        setTimeout(() => {
                            navigation.navigate('Login');
                        }, 1000);

                    }}
                >
                    Keluar</Btn>
            </View>
            <Spinner
                visible={visibleSpinner}
                textContent={'Loading...'}
                textStyle={style.spinnerTextStyle}
            />

        </View>
    )
}

export default ProfileSiswa