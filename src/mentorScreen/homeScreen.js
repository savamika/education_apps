import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { View, RefreshControl, ScrollView, StyleSheet, SafeAreaView, BackHandler, Alert, ToastAndroid } from 'react-native';
import { Appbar, Text, Avatar, Card, Chip, Title, Paragraph, Button, Snackbar } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { white } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { useSelector, useDispatch } from 'react-redux';
import { CLEAR_STORE } from '../store/CounterSlice';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as config from '../common/config'
import {
    updateLevel,
    updateAPIFindUser,
    updateUSER_ID,
    updateIS_VERIF,
    updateAPILogin,
    updateFIST_NAME,
    updateLAST_NAME,
    updateUSERNAME,
    updateEMAIL,
    updateALAMAT
} from '../store/CounterSlice'
import { useFocusEffect } from '@react-navigation/native';


const styles = StyleSheet.create({
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
});


function MyComponent({ route, navigation }) {
    const IS_VERIF = useSelector((state) => state.counter.IS_VERIF)
    const USER_ID = useSelector((state) => state.counter.USER_ID)
    const BASE_URL = useSelector((state) => state.counter.BASE_URL)
    const [visibleSpinner, setVisibleSpinner] = useState(false);

    const [NAME, setNAME] = useState('NO NAME');
    const [IS_VERIF_USER, setIS_VERIF_USER] = useState(IS_VERIF);

    const [rating, setRating] = useState('0');
    const [jumlah_siswa, setJumlah_siswa] = useState('0');
    const [review, setReview] = useState('0');

    const [url_img, setUrl_img] = useState('image');
    const [display_img_ava1, setDisplay_img_ava1] = useState('flex');
    const [display_img_ava2, setDisplay_img_ava2] = useState('none');

    const [LEVEL, setLEVEL] = useState(useSelector((state) => state.counter.LEVEL));
    const dispatch = useDispatch();
    const apiLogin = useSelector((state) => state.counter.APILogin)

    const [visible, setVisible] = React.useState(false);

    const onToggleSnackBar = () => setVisible(!visible);

    const onDismissSnackBar = () => setVisible(false);

    const [ALAMAT, setALAMAT] = useState('');
    // const ALAMAT = useSelector((state) => state.counter.ALAMAT)
    const [dataUser, setdataUser] = useState([]);

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        _findUser(USER_ID)
        _setUserData();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);


    const _setUserData = async () => {
        const dataUserX = JSON.parse(await AsyncStorage.getItem('USERDATA'))
        console.log('firstname', dataUserX.firstname)
        console.log('firstname', dataUserX.firstname)
        setdataUser((e) => dataUserX)
        setALAMAT((e) => dataUserX.address)
        let fullname = dataUserX.firstname + ' ' + dataUserX.lastname
        if (fullname == null || fullname == '') {
            fullname = dataUserX.email;
        }
        setNAME((e) => fullname)

        if (IS_VERIF_USER == '' || IS_VERIF_USER == null) {
            setIS_VERIF_USER((state) => dataUserX.is_verified)
        } else {
        }
        if (LEVEL == '' || LEVEL == null) {
            setLEVEL((state) => dataUserX.is_user)
        }

        if (USER_ID == '' || USER_ID == null) {
            dispatch(updateUSER_ID(dataUserX.id));
            dispatch(updateAPILogin(JSON.stringify(dataUserX)));
            dispatch(updateIS_VERIF(dataUserX.is_verified));
            dispatch(updateLevel(dataUserX.is_user));
            dispatch(updateFIST_NAME(dataUserX.firstname));
            dispatch(updateLAST_NAME(dataUserX.lastname));
            dispatch(updateUSERNAME(dataUserX.username));
            dispatch(updateEMAIL(dataUserX.email));
            dispatch(updateALAMAT(dataUserX.address));
        }

        if (dataUserX.picture == '' || dataUserX.picture == null) {
            setDisplay_img_ava1((state) => 'flex');
            setDisplay_img_ava2((state) => 'none');
        } else {
            setDisplay_img_ava1((state) => 'none');
            setDisplay_img_ava2((state) => 'flex');
            setUrl_img((state) => dataUserX.picture)
        }


        setRating((state) => dataUserX.rating)
        setJumlah_siswa((state) => dataUserX.siswa)
        setReview((state) => dataUserX.review)

        _findUser(dataUserX.id)

    }

    const _findUser = async (id) => {
        console.log(BASE_URL + '/getuser/' + id);
        await axios
            .get(BASE_URL + '/getuser/' + id, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(async function (response) {
                // handle success
                let rs = response.data[0];
                let data = JSON.stringify(response.data[0]);
                dispatch(updateAPIFindUser(data))
                await AsyncStorage.setItem('USERDATA', data);
                _setUserDataByAPI(rs)

            })
            .catch(function (error) {
                // handle error
                console.log('error', error);
            })
            .finally(() => {
                //complates
            });
    }

    const _setUserDataByAPI = async (dataUserX) => {
        // console.log('dataUserAPIX', dataUserX)
        setdataUser((e) => dataUserX)
        setALAMAT((e) => dataUserX.address)
        let fullname = dataUserX.firstname + ' ' + dataUserX.lastname
        if (fullname == null || fullname == '' || fullname == ' ') {
            fullname = dataUserX.email;
        }
        setNAME((e) => fullname)

        console.log('dataUserX.is_verified', dataUserX.is_verified)
        // if (IS_VERIF_USER == '' || IS_VERIF_USER == null) {
        setIS_VERIF_USER((state) => dataUserX.is_verified)
        // }
        if (LEVEL == '' || LEVEL == null) {
            setLEVEL((state) => dataUserX.is_user)
        }

        if (USER_ID == '' || USER_ID == null) {
            dispatch(updateUSER_ID(dataUserX.id));
            dispatch(updateAPILogin(JSON.stringify(dataUserX)));
            dispatch(updateIS_VERIF(dataUserX.is_verified));
            dispatch(updateLevel(dataUserX.is_user));
            dispatch(updateFIST_NAME(dataUserX.firstname));
            dispatch(updateLAST_NAME(dataUserX.lastname));
            dispatch(updateUSERNAME(dataUserX.username));
            dispatch(updateEMAIL(dataUserX.email));
            dispatch(updateALAMAT(dataUserX.address));
        }

        if (dataUserX.picture == '' || dataUserX.picture == null) {
            setDisplay_img_ava1((state) => 'flex');
            setDisplay_img_ava2((state) => 'none');
        } else {
            setDisplay_img_ava1((state) => 'none');
            setDisplay_img_ava2((state) => 'flex');
            setUrl_img((state) => dataUserX.picture)
        }


        setRating((state) => dataUserX.rating)
        setJumlah_siswa((state) => dataUserX.siswa)
        setReview((state) => dataUserX.review)


    }

    var back = 0
    const handler = () => {
        console.log('home..')

        back++;
        if (back > 1) {
            BackHandler.exitApp()
        } else {
            ToastAndroid.show('tekan sekali lagi untuk keluar', ToastAndroid.SHORT);
            setTimeout(() => {
                back = 0;
            }, 2000);
            return true;
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {


                return true;
            };

            const subscription = BackHandler.addEventListener('hardwareBackPress', handler);

            return () => subscription.remove();
        }, [])
    );


    useEffect(() => {
        _setUserData()




        // const backHandler = BackHandler.addEventListener("hardwareBackPress", handler);

        // return () => backHandler.remove();

    }, [])

    return (

        <View style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >

            <Spinner
                visible={visibleSpinner}
                textContent={'Loading...'}
                textStyle={styles.spinnerTextStyle}
            />

            <View style={{ backgroundColor: '#1C8CF4', padding: 10, flexDirection: "column", height: '70%' }}>
                {/* <Avatar.Image size={24} source={require('../assets/avatar.png')} /> */}
                <View style={{ flex: 1 }}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Akun anda</Text>
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 5 }}>
                    <ScrollView

                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }>
                        <SafeAreaView style={{ alignItems: 'center', justifyContent: 'center' }}>

                            <Avatar.Icon size={104} icon="account" style={{ display: display_img_ava1 }} />
                            <Avatar.Image size={104} source={{ uri: url_img }} style={{ display: display_img_ava2 }} />

                            <Text style={{ color: 'white', alignItems: 'center', fontWeight: 'bold' }}>{NAME}</Text>
                            <Chip style={{ marginTop: 5, height: 30, fontWeight: 'bold', backgroundColor: '#007DF1', color: 'white' }} >
                                <Icon name='check' color="white"></Icon>
                                <Text icon='check' style={{ color: 'white' }}>
                                    {LEVEL == 'MENTOR' ? 'Mentor' : LEVEL == 'SISWA' ? 'Siswa' : 'UNKNOWN'}
                                </Text>
                            </Chip>
                        </SafeAreaView>
                    </ScrollView>
                </View>

                <View style={[styles.container, { flex: 2 }]}>
                    <View style={styles.square}>
                        <Card >
                            <Card.Content style={{ alignItems: 'center', paddingTop: 0 }}>
                                <Paragraph>

                                    <Title style={{ fontSize: 10 }}>Rating</Title>
                                </Paragraph>
                                <Paragraph>
                                    <Icon name='star' color={config.color.gold} />
                                    <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{rating}</Text>
                                </Paragraph>
                            </Card.Content>
                        </Card>
                    </View>
                    <View style={styles.square}>
                        <Card>
                            <Card.Content style={{ marginTop: 0, alignItems: 'center', paddingTop: 0 }}>
                                <Paragraph>
                                    <Title style={{ fontSize: 10 }}>Jumlah Siswa</Title>
                                </Paragraph>
                                <Paragraph>
                                    <Icon name='user-graduate' color={config.color.primery} />
                                    <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{jumlah_siswa}</Text>
                                </Paragraph>
                            </Card.Content>
                        </Card>
                    </View>
                    <View style={styles.square}>
                        <Card>
                            <Card.Content style={{ marginTop: 0, alignItems: 'center', paddingTop: 0 }}>
                                <Paragraph>
                                    <Title style={{ fontSize: 10 }}>Review</Title>
                                </Paragraph>
                                <Paragraph>
                                    <Icon name='comment' color={config.color.primery} />
                                    <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{review}</Text>
                                </Paragraph>
                            </Card.Content>
                        </Card>
                    </View>
                </View>
                <View style={{ flex: 4, marginTop: 0 }}>
                    <Card style={{ display: IS_VERIF_USER == 'NEW' ? 'flex' : 'none' }}>
                        <Card.Title title="Akun Mentor Belum Aktif"
                            style={{ flexDirection: 'row' }}
                            titleStyle={{ fontWeight: 'bold', color: "#333333" }}
                            titleVariant='titleMedium'

                            subtitleStyle={{ flexShrink: 1 }}
                        />
                        <Card.Content style={{ marginTop: 0, alignItems: 'center' }}>
                            <Text>Silahkan melakukan verifikasi untuk menggunakan akun sebagai mentor</Text>
                            <Button icon="arrow-right" mode="contained" onPress={() => navigation.navigate('AktivasiAkunMentor')}>
                                Verifikasi sekarang
                            </Button>
                        </Card.Content>
                    </Card>
                    <Card style={{ display: IS_VERIF_USER == 'WAITING' ? 'flex' : 'none' }}>
                        <Card.Title title="Akun Mentor Belum Aktif"
                            style={{ flexDirection: 'row' }}
                            titleStyle={{ fontWeight: 'bold', color: "#333333" }}
                            titleVariant='titleMedium'
                            // subtitle='Akun anda masih dalam tahap verifikasi oleh tim kami, mohon untuk menunggu'
                            subtitleStyle={{ flexShrink: 1 }}
                        />
                        <Card.Content style={{ marginTop: 0, alignItems: 'center' }}>
                            <Text>Akun anda masih dalam tahap verifikasi oleh tim kami, mohon untuk menunggu</Text>
                        </Card.Content>
                    </Card>
                </View>

            </View>
            <View style={{ padding: 5, flexDirection: "column", height: '30%' }}>
                <View style={{ flex: 2 }}>

                    <Text style={{ color: '#333333', fontWeight: 'bold' }}>Pengaturan</Text>
                </View>
                <View style={[styles.container, { flex: 6 }]}>
                    <View style={styles.square}>
                        <Card onPress={() => {
                            // console.log('navigation', navigation)

                            navigation.navigate('ProfileDataDiriMentor', { data_user: dataUser })
                        }} >
                            <Card.Content style={{ alignItems: 'center', paddingTop: 0 }}>
                                <Paragraph>
                                    <Icon name='address-card' color={config.color.primery} />
                                </Paragraph>
                                <Paragraph>
                                    <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Profile</Text>
                                </Paragraph>
                            </Card.Content>
                        </Card>
                    </View>
                    <View style={styles.square}>
                        <Card>
                            <Card.Content style={{ marginTop: 0, alignItems: 'center', paddingTop: 0 }}>
                                <Paragraph>
                                    <Icon name='lock' color={config.color.primery} />
                                </Paragraph>
                                <Paragraph>
                                    <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Keamanan</Text>
                                </Paragraph>
                            </Card.Content>
                        </Card>
                    </View>
                    <View style={styles.square}>
                        <Card onPress={() => {
                            navigation.navigate('PermintaanPertemuanList')
                        }} >
                            <Card.Content style={{ marginTop: 0, alignItems: 'center', paddingTop: 0 }}>
                                <Paragraph>
                                    <Icon name='bell' color={config.color.primery} />
                                </Paragraph>
                                <Paragraph>
                                    <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Notifikasi</Text>
                                </Paragraph>
                            </Card.Content>
                        </Card>
                    </View>
                </View>
                <View style={{ flex: 4 }}>
                    <Button
                        mode="outlined"
                        onPress={() => {
                            Alert.alert('', 'Apakah anda yakin ingin keluar ?', [
                                {
                                    text: 'batal',
                                    onPress: () => back = 0,
                                    style: 'batal',
                                },
                                {
                                    text: 'ya', onPress: async () => {
                                        setVisibleSpinner(true);
                                        dispatch(CLEAR_STORE());
                                        await AsyncStorage.setItem('@IS_LOGIN', '0');
                                        await AsyncStorage.setItem('@LEVEL', '');
                                        setTimeout(() => {
                                            navigation.reset({
                                                index: 0,
                                                routes: [{ name: 'Login' }]
                                            })
                                            navigation.navigate('Login');
                                        }, 1000);
                                    }
                                },
                            ]);


                        }}
                    >
                        Keluar</Button>


                </View>
            </View>
        </View>
    )
}






export default MyComponent;

// ... other code from the previous section