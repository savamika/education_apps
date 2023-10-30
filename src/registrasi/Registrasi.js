import React, { useState, useEffect, useRef } from 'react'
import { View, Text, ScrollView, SafeAreaView, Dimensions, StyleSheet, Button } from 'react-native';
import { Appbar, Avatar, TextInput, Card, Title, Paragraph, Button as Btn, Snackbar } from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import {
    updateLevel,
    updateAPIRegistration,
    updatePhoneNumber,
    updateUSER_ID,
    updateIS_VERIF
} from '../store/CounterSlice'
import * as config from '../common/config';
import ShowNotif from '../common/showNotification';
import * as String from '../common/String'
import Logo from '../assets/registrasi.svg'
import AsyncStorage from '@react-native-async-storage/async-storage';

const style = StyleSheet.create({
    rowCenter: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: 'center'
    },
    spinnerTextStyle: {
        color: '#FFF'
    },
})

export default function Registrasi({ navigation }) {
    const ACTIVE = '#004D95';
    const INACTIVE = '#E6E6E6';
    const [bgButtonLevelSiswa, setBgButtonLevelSiswa] = useState(ACTIVE);
    const [bgButtonLevelMentor, setBgButtonLevelMentor] = useState(INACTIVE);
    const [levelUser, setLevelUser] = useState('SISWA');
    const [email, setEmail] = useState('');
    const [emailvalid, setEmailvalid] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');
    const [visibleSpinner, setVisibleSpinner] = useState(false);
    const [visibleMessage, setVisibleMessage] = useState(false);
    const [visibleNotif, setVisibleNotif] = useState(false);
    const [messageNotif, setMessageNotif] = useState(false);
    const dispatch = useDispatch()
    const LEVEL = useSelector((state) => state.counter.LEVEL)
    const BASE_URL = useSelector((state) => state.counter.BASE_URL)

    const txt_email = useRef();
    const txt_phone_number = useRef();
    const txt_password = useRef();
    const txt_repassword = useRef();

    const _submit = async () => {

        if (emailvalid) {
            setMessageNotif('email tidak valid');
            setVisibleNotif(true);
            txt_email.current.focus();
            return false;
        }
        if (email == '') {
            setMessageNotif('email kosong');
            setVisibleNotif(true);
            txt_email.current.focus();
            return false;
        }
        if (phoneNumber == '') {
            setMessageNotif('phone number kosong');
            setVisibleNotif(true);
            txt_phone_number.current.focus();
            return false;
        }
        if (password == '') {
            setMessageNotif('password kosong');
            setVisibleNotif(true);
            txt_password.current.focus();
            return false;
        }
        if (repassword == '') {
            setMessageNotif('repassword kosong');
            setVisibleNotif(true);
            txt_repassword.current.focus();
            return false;
        }
        if (levelUser == '') {
            setMessageNotif('level kosong');
            setVisibleNotif(true);
            return false;
        }
        if (password != repassword) {
            setMessageNotif('password tidak sama ');
            setVisibleNotif(true);
            txt_password.current.focus();
            return false;
        }
        setVisibleMessage('loading...')
        setVisibleSpinner(true);


        console.log('url', BASE_URL + '/registration')
        await axios
            .post(BASE_URL + '/registration',
                {
                    email: email,
                    phone_number: '0' + phoneNumber,
                    password: password,
                    retrypass: repassword,
                    is_user: levelUser
                },
                {
                    timeout: 1000 * 60
                })
            .then(function (response) {
                // handle success
                var data = JSON.stringify(response.data);
                let rs = response.data;
                if (!rs.error) {
                    console.log('data', data);
                    dispatch(updateAPIRegistration(data));
                    dispatch(updateUSER_ID(response.data.data.userId));
                    dispatch(updateIS_VERIF(response.data.data.is_verified));
                    dispatch(updateLevel(response.data.data.is_user));
                    dispatch(updatePhoneNumber(phoneNumber));

                    console.log('LEVEL', LEVEL);
                    // navigation.navigate('OTP');
                    if (LEVEL == 'MENTOR') {
                        AsyncStorage.setItem('@IS_LOGIN', '1');
                        navigation.navigate('HomeMentor')
                    } else if (LEVEL == 'SISWA') {
                        AsyncStorage.setItem('@IS_LOGIN', '1');
                        navigation.navigate('BottomNavigation')
                    } else {
                        // setVisible(true)
                    }
                } else {
                    setMessageNotif(rs.message);
                    setVisibleNotif(true);
                }



                setVisibleSpinner(false);

            })
            .catch(function (error) {
                // handle error
                console.log('error response', error.response)
                console.log('email', email);
                console.log('phoneNumber', phoneNumber);
                console.log('password', password);
                console.log('repassword', repassword);
                console.log('levelUser', levelUser);
                console.log('error', error);

                setVisibleSpinner(false);
                setMessageNotif(String.text.ALERT_KONEKSI);
                setVisibleNotif(true);
                setVisibleMessage(error.toString());

            })
            .then(() => {
                //complates
                setVisibleSpinner(false);
            });

    }
    const goBack = (navigation) => {
        console.log('back');
        navigation.goBack()
    }
    const onDismissSnackBar = () => setVisibleNotif(false);

    useEffect(() => {
        if (levelUser == 'SISWA') {
            setBgButtonLevelSiswa(ACTIVE)
            setBgButtonLevelMentor(INACTIVE)
        } else {
            setBgButtonLevelSiswa(INACTIVE)
            setBgButtonLevelMentor(ACTIVE)
        }
    })
    return (
        // <SafeAreaView >
        //     <ScrollView contentContainerStyle={{}}>
        <View style={{ padding: 10, flex: 1, backgroundColor: config.color.primery }}>
            <View style={{ flex: 2 }}>
                <Appbar.BackAction color='white' onPress={() => { goBack(navigation) }} />
                <Spinner
                    visible={visibleSpinner}
                    textContent={'Loading...'}
                    textStyle={style.spinnerTextStyle}
                />

            </View>
            <View style={{ flex: 2 }}>
                {/* <Logo /> */}
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 32 }}>Hi Teman!</Text>
                <Text style={{ color: 'white', fontSize: 12 }}>Silahkan pilih jenis akun yang akan kamu daftarkan</Text>
            </View>
            <View style={{ flex: 6 }}>
                <Card>
                    <Card.Content>
                        <View style={style.rowCenter}>

                            <View style={[{ width: "50%", margin: 5, backgroundColor: { bgButtonLevelSiswa } }]}>
                                <Button
                                    onPress={() => {
                                        setLevelUser('SISWA')
                                        dispatch(updateLevel('SISWA'));
                                    }}
                                    title="SISWA"
                                    color={bgButtonLevelSiswa}
                                />
                            </View>
                            <View style={[{ width: "50%", margin: 5, backgroundColor: { bgButtonLevelMentor } }]}>
                                <Button
                                    onPress={() => {
                                        setLevelUser('MENTOR');

                                    }}
                                    title="MENTOR"
                                    color={bgButtonLevelMentor}
                                />
                            </View>
                        </View>
                        <View>
                            <TextInput
                                mode="outlined"
                                placeholder="Email"
                                value={email}
                                onChangeText={text => {
                                    console.log(text);
                                    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
                                    if (reg.test(text) === false) {
                                        console.log("Email is Not Correct");
                                        setEmail(text)
                                        setEmailvalid(true);
                                        return false;
                                    }
                                    else {
                                        setEmail(text)
                                        setEmailvalid(false);
                                        console.log("Email is Correct");
                                    }
                                    // setEmail(text)
                                }}
                                ref={txt_email}
                            />

                        </View>
                        <View style={style.rowCenter}>

                            <TextInput
                                mode="outlined"
                                placeholder="Phone Number"
                                value={'+62'}
                                onChangeText={text => setPhoneNumber(text)}
                                style={{ width: '20%' }}
                                disabled
                            />
                            <TextInput
                                mode="outlined"
                                placeholder="Phone Number"
                                value={phoneNumber}
                                onChangeText={(text) => {
                                    let cleanNumber = text.replace(/[^0-9]/g, "");

                                    setPhoneNumber(cleanNumber)
                                }}
                                textContentType='telephoneNumber'
                                style={{ width: '80%' }}
                                keyboardType='number-pad'
                                ref={txt_phone_number}
                                maxLength={14}
                            />
                        </View>
                        <View>
                            <TextInput
                                mode="outlined"
                                placeholder="Password"
                                value={password}
                                onChangeText={text => setPassword(text)}
                                ref={txt_password}
                                secureTextEntry

                            />

                        </View>
                        <View>
                            <TextInput
                                mode="outlined"
                                placeholder="Ulangi Password"
                                value={repassword}
                                onChangeText={text => setRepassword(text)}
                                ref={txt_repassword}
                                secureTextEntry
                            />
                        </View>
                    </Card.Content>
                    <Card.Actions>
                        <Btn mode="contained" buttonColor='#DAAA00' icon="arrow-right" onPress={() => _submit()} >Daftar</Btn>
                    </Card.Actions>
                </Card>
            </View>
            <View style={{ flex: 3 }}>


                <Snackbar
                    visible={visibleNotif}
                    duration={3000}
                    onDismiss={onDismissSnackBar}
                    action={{
                        label: 'ok',
                        labelStyle: { color: 'white' },
                        onPress: () => {
                            setVisibleNotif(false)
                        },
                    }}>
                    {messageNotif}
                </Snackbar>
            </View>
        </View>
        //     </ScrollView>
        // </SafeAreaView>

    )
}
