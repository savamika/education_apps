import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, SafeAreaView, Dimensions, StyleSheet, PermissionsAndroid, TouchableOpacity } from 'react-native';
import { Appbar, TextInput, Button, Snackbar, Card, Title, Paragraph } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
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
import axios from 'axios';
import Spinner from '../common/Spinner';
import ShowNotif from '../common/showNotification';
import * as String from '../common/String'
import { config } from '@fortawesome/fontawesome-svg-core';
import * as common_config from '../common/config'
import Logo from '../assets/login.svg';

const style = StyleSheet.create({
    btnLogin: {

        justifyContent: "center",
        alignItems: 'center',
    }
})

const Login = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [visibleNotif, setVisibleNotif] = useState(false);
    const [spinnervisible, setSpinnervisible] = useState(false);
    const [messageNotif, setMessageNotif] = useState(false);

    const BASE_URL = useSelector((state) => state.counter.BASE_URL)
    const APILogin = useSelector((state) => state.counter.APILogin)
    const count = useSelector((state) => state.counter.value)
    const dispatch = useDispatch();

    const _check_guide = async () => {
        // await AsyncStorage.setItem('GUIDE', ''); //# OPEN JIKA INGIN MENUJU GUIDE
        let guide = await AsyncStorage.getItem('GUIDE');
        console.log('guide', guide)
        if (guide != '1') {
            navigation.replace('Guide')
        }
    }

    useEffect(() => {
        _check_guide();
        setPage()

    });

    const onToggleSnackBar = () => setVisibleNotif(!visible);

    const onDismissSnackBar = () => setVisibleNotif(false);
    const setPage = async () => {
        const IS_LOGIN = await AsyncStorage.getItem('@IS_LOGIN');
        const LEVEL = await AsyncStorage.getItem('@LEVEL');
        // console.log('IS_LOGIN', IS_LOGIN);
        console.log('LEVEL', LEVEL);
        if (IS_LOGIN == '1') {
            if (LEVEL == 'MENTOR') {
                // navigation.replace('HomeMentor');
                navigation.replace('BottomNavigationMentor');
            } else if (LEVEL == 'SISWA') {
                navigation.replace('BottomNavigation')
            } else {
                navigation.replace('Login')
            }
        } else {
        }

    }
    const changeUsername = (e) => {
        setUsername(e);
    }

    const changePassword = (e) => {
        setPassword(e);
    }

    const submitLogin = async () => {
        console.log('press masuk')

        if (username == '') {
            setMessageNotif('username kosong');
            setVisibleNotif(true);
            return false
        }
        if (password == '') {
            setMessageNotif('password kosong');
            setVisibleNotif(true);
            return false
        }
        setSpinnervisible(true);
        let param = {
            username_or_email: username,
            password: password
        }
        console.log('param', param)
        await axios
            .post(BASE_URL + '/users/login',
                param,
                {
                    timeout: 1000 * 30 //30 detik
                }
            )
            .then(async function (response) {
                // handle success
                var data = JSON.stringify(response.data);
                console.log('data----------', data)
                var rs = response.data;
                // console.log('data', data);
                if (!rs.error) {
                    dispatch(updateAPILogin(data));
                    dispatch(updateUSER_ID(rs.data[0].id));
                    dispatch(updateIS_VERIF(rs.data[0].is_verified));
                    dispatch(updateLevel(rs.data[0].is_user));
                    dispatch(updateFIST_NAME(rs.data[0].firstname));
                    dispatch(updateLAST_NAME(rs.data[0].lastname));
                    dispatch(updateUSERNAME(rs.data[0].username));
                    dispatch(updateEMAIL(rs.data[0].email));
                    dispatch(updateALAMAT(rs.data[0].address));

                    console.log('rs.data[0].id', rs.data[0].id)
                    console.log('data', data)
                    await AsyncStorage.setItem('@IS_LOGIN', '1');
                    await AsyncStorage.setItem('@LEVEL', rs.data[0].is_user);
                    await AsyncStorage.setItem('USER_ID', rs.data[0].id);
                    await AsyncStorage.setItem('USERDATA', JSON.stringify(rs.data[0]));

                    _findUser(rs.data[0].id)



                } else {
                    await AsyncStorage.setItem('@IS_LOGIN', '0');
                    setMessageNotif(rs.message);
                    setTimeout(() => {
                        setVisibleNotif(true);
                    }, 200);
                }


                setSpinnervisible(false);
            })
            .catch(function (error) {
                // handle error
                // console.log('String', String);
                console.log('error', error);
                setMessageNotif(String.text.ALERT_KONEKSI);
                setVisibleNotif(true);
                setSpinnervisible(false);
            })
            .finally(() => {
                //complates
                setSpinnervisible(false);
            });




        let is_login = await AsyncStorage.getItem('@IS_LOGIN');
        let LEVEL = await AsyncStorage.getItem('@LEVEL');

        // console.log('is_login', is_login);
        // console.log('level', level);
        if (is_login == '1') {
            if (LEVEL == 'MENTOR') {
                // navigation.replace('HomeMentor');
                navigation.replace('BottomNavigationMentor');
            } else if (LEVEL == 'SISWA') {
                navigation.replace('BottomNavigation')
            } else {
                navigation.replace('Login')
            }
        } else {


        }
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
                let data = JSON.stringify(response.data[0]);
                dispatch(updateAPIFindUser(data))
                await AsyncStorage.setItem('USERDATA', data);

            })
            .catch(function (error) {
                // handle error
                console.log('error', error);
                setSpinnervisible(false);
            })
            .finally(() => {
                //complates
                setSpinnervisible(false);
            });
    }



    return (
        <View style={{ backgroundColor: '#1C8CF4', flex: 1 }}>

            <Spinner visible={spinnervisible} />
            <SafeAreaView style={{ marginTop: 0 }}>
                <ScrollView >
                    <View style={{ paddingLeft: 10, paddingRight: 10, paddingBottom: 50, flex: 1, flexDirection: 'column' }}>
                        <View style={{ flex: 4, marginLeft: 'auto', marginRight: 'auto', alignContent: 'center', justifyContent: 'center' }}>
                            <Logo width={200} height={200} />
                        </View>
                        <View style={{ flex: 2, paddingTop: 30 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 32, color: 'white' }}>Selamat{"\n"}Datang!</Text>
                        </View>
                        <View style={{ flex: 3, paddingTop: 30 }}>

                            <TextInput
                                mode="outlined"
                                label="Username"
                                placeholder="input here"
                                value={username}
                                onChangeText={text => changeUsername(text)}
                                textColor='white'
                                style={{ backgroundColor: '#1C8CF4' }}
                                outlineColor='white'
                                activeOutlineColor='white'
                                placeholderTextColor='white'
                                theme={{
                                    colors: {
                                        label: 'white'
                                    },
                                }}
                                colors='white'
                            />
                            <TextInput
                                mode="outlined"
                                label="Password"
                                placeholder="input here"
                                value={password}
                                onChangeText={text => changePassword(text)}
                                secureTextEntry
                                style={{ backgroundColor: '#1C8CF4' }}
                                outlineColor='white'
                                activeOutlineColor='white'
                                textColor='white'
                                placeholderTextColor='white'
                            />
                            <TouchableOpacity onPress={() => navigation.navigate('ForgetPassword')} style={{ paddingTop: 5 }} activeOpacity={0.9}><Text style={{ color: 'white' }}>lupa password ?</Text></TouchableOpacity>
                        </View>
                        <View style={{ flex: 3, paddingTop: 30 }}>



                            <Button mode="contained" buttonColor={common_config.color.gold} icon="arrow-right" onPress={() => submitLogin()} >Login</Button>
                            <Button style={{ marginTop: 3 }} buttonColor='white' mode="outlined" onPress={() => navigation.navigate('Registrasi')} >Daftar Akun</Button>

                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
            <Snackbar
                visible={visibleNotif}
                onDismiss={onDismissSnackBar}
                duration={1000}
            >
                {messageNotif}
            </Snackbar>
        </View >


    )
}

export default Login;
