import React, { useState, useEffect, useRef } from 'react'
import { View, Text, ScrollView, SafeAreaView, Dimensions, StyleSheet } from 'react-native';
import { Appbar, TextInput, Button, Snackbar, Card, Title, Paragraph, Dialog, Portal } from 'react-native-paper';
import * as  config from '../common/config'
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import ShowNotif from '../common/showNotification';
import Spinner from '../common/Spinner';
import * as common_config from '../common/config'
import Alert_custom from '../common/alert';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { SvgUri } from 'react-native-svg';
import Logo from '../assets/banner2Artboard61.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import { Timer, Countdown } from 'react-native-element-timer';

const OTP = ({ navigation }) => {
    const [otp1, setOtp1] = useState("");
    const [otp2, setOtp2] = useState("");
    const [otp3, setOtp3] = useState("");
    const [otp4, setOtp4] = useState("");
    const [otp5, setOtp5] = useState("");
    const [otp6, setOtp6] = useState("");
    const [time, setTime] = useState(60 * 1);

    const [display_krmLg, setdisplay_krmLg] = useState("none");

    var cur_time;

    const ref_input1 = useRef();
    const ref_input2 = useRef();
    const ref_input3 = useRef();
    const ref_input4 = useRef();
    const ref_input5 = useRef();
    const ref_input6 = useRef();

    const countdownRef = useRef();
    const [countDownx, setCountDownx] = useState(60)

    const dispatch = useDispatch();
    const LEVEL = useSelector((state) => state.counter.LEVEL);

    const [visible, setVisible] = useState(false);
    const [visibleSpinner, setVisibleSpinner] = useState(false);

    const [visibleNotif, setVisibleNotif] = useState(false);
    const [messageNotif, setMessageNotif] = useState('');
    const [disabledSubmit, setDisabledSubmit] = useState(false);

    const hideDialog = () => setVisible(false);
    const BASE_URL = useSelector((state) => state.counter.BASE_URL)
    const USER_ID = useSelector((state) => state.counter.USER_ID);
    const PHONE_NUMBER = useSelector((state) => state.counter.phoneNumber);
    var MASKING_PHONE_NUMBER = '';
    const [MASKING_PHONE_NUMBER_x, setMASKING_PHONE_NUMBER_x] = useState('');

    const onDismissSnackBar = () => setVisibleNotif(false);

    useEffect(() => {
        masking(PHONE_NUMBER)

    }, [])

    const masking = (nmb) => {
        console.log('nmb', nmb)
        if (nmb == '' || typeof (nmb) == 'undefined') {
            return false;
        }
        let num = nmb.toString();
        num.split('').map((v, i) => {
            if (i > 5 && i < 9) {

                MASKING_PHONE_NUMBER += 'x';
            } else {
                MASKING_PHONE_NUMBER += v;
            }
        })
        setMASKING_PHONE_NUMBER_x((state) => '+62' + MASKING_PHONE_NUMBER)
    }

    const goBack = (navigation) => {
        navigation.goBack()
    }

    const _submit = async () => {
        setVisibleSpinner((state) => true)
        if (cur_time <= 0) {
            setMessageNotif('Waktu OTP berakhir');
            setVisibleNotif((state) => true)
            return false;
        }

        // console.log('1=' + otp1 + '|2=' + otp2 + '|3=' + otp3 + '|4=' + otp4 + '|5=' + otp5 + '|6=' + otp6)
        if (otp1 == '') {
            ref_input1.current.focus();
            return false;
        }
        if (otp2 == '') {
            ref_input2.current.focus();
            return false;
        }
        if (otp3 == '') {
            ref_input3.current.focus();
            return false;
        }
        if (otp4 == '') {
            ref_input4.current.focus();
            return false;
        }
        if (otp5 == '') {
            ref_input5.current.focus();
            return false;
        }
        if (otp6 == '') {
            ref_input6.current.focus();
            return false;
        }

        let OTP = otp1 + '' + otp2 + '' + otp3 + '' + otp4 + '' + otp5 + '' + otp6;

        console.log('OTP', OTP)
        console.log('USER_ID', USER_ID)
        console.log(BASE_URL + '/otp/checkotp')
        await axios
            .post(BASE_URL + '/otp/checkotp', {
                user_id: USER_ID,
                otp: OTP
            },
                {
                    timeout: 1000 * 5 //30 detik
                })
            .then(function (response) {
                // handle success
                var data = JSON.stringify(response.data);
                let rs = response.data;
                console.log('data', data)
                if (!rs.error) {
                    _findUser(USER_ID)
                } else {
                    setMessageNotif(rs.message);
                    setVisibleNotif((state) => true)
                }
            })
            .catch(function (error) {
                // handle error
                console.log('error', error);
            })
            .then(() => {
                //complates
                setVisibleSpinner((state) => false)
            });
    }


    const _findUser = (id) => {
        console.log(BASE_URL + '/getuser/' + id);
        setVisibleSpinner((state) => true)
        axios
            .get(BASE_URL + '/getuser/' + id, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(function (response) {
                // handle success
                let data = JSON.stringify(response.data[0]);
                dispatch(updateAPIFindUser(data))
                dispatch(updateAPILogin(data));
                dispatch(updateUSER_ID(data.id));
                dispatch(updateIS_VERIF(data.is_verified));
                dispatch(updateLevel(data.is_user));
                dispatch(updateFIST_NAME(data.firstname));
                dispatch(updateLAST_NAME(data.lastname));
                dispatch(updateUSERNAME(data.username));
                dispatch(updateEMAIL(data.email));
                dispatch(updateALAMAT(data.address));

                AsyncStorage.setItem('USERDATA', data);
                AsyncStorage.setItem('@LEVEL', LEVEL);
                AsyncStorage.setItem('USER_ID', id);

                if (LEVEL == 'MENTOR') {
                    AsyncStorage.setItem('@IS_LOGIN', '1');
                    navigation.navigate('HomeMentor')
                } else if (LEVEL == 'SISWA') {
                    AsyncStorage.setItem('@IS_LOGIN', '1');
                    navigation.navigate('BottomNavigation')
                } else {
                    setVisible(true)
                }



            })
            .catch(function (error) {
                // handle error
                console.log('error', error);
            })
            .finally(() => {
                //complates
                setVisibleSpinner((state) => false)
            });
    }

    const _krmUlang = () => {
        if (USER_ID == '') {
            return false;
        }
        setVisibleSpinner((state) => true)
        console.log(BASE_URL + '/otp/requestotp/' + USER_ID)
        axios
            .get(BASE_URL + '/otp/requestotp/' + USER_ID,
                {
                    timeout: 1000 * 30 //30 detik
                })
            .then(function (response) {
                // handle success
                var data = JSON.stringify(response.data);
                console.log('data', data);
                let rs = response.data;
                if (!rs.error) {

                    countdownRef.current?.stop();
                    setCountDownx(60 * 1)
                    countdownRef.current?.start();
                    setDisabledSubmit(false);
                    setdisplay_krmLg((state) => 'none')
                } else {
                    setMessageNotif(rs.message);
                    setVisibleNotif(true)
                }
                console.log('data', data);
            })
            .catch(function (error) {
                // handle error
                console.log('error', error);

            })
            .then(() => {
                //complates
                setVisibleSpinner((state) => false)
            });
    }

    return (
        <View style={{ flex: 1, backgroundColor: config.color.primery, padding: 10 }}>
            <View style={{ flex: 1 }}>
                {/* <Appbar.BackAction color='white' onPress={() => { goBack(navigation) }} /> */}
                <Spinner visible={visibleSpinner} />
            </View>
            <View style={{ flex: 3, marginLeft: 'auto', marginRight: 'auto', justifyContent: 'center', alignContent: 'center' }}>
                <Logo />
            </View>
            <View style={{ flex: 1, paddingTop: 30 }}>
                <Text style={{ fontSize: 32, color: 'white', fontWeight: 'bold' }} >Kode OTP</Text>
            </View>
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, color: 'white' }} >Kami telah mengirim kode OTP ke no {MASKING_PHONE_NUMBER_x}</Text>
            </View>
            <View style={{ flex: 3 }}>
                <Card >
                    <Card.Content>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <View style={{ margin: 5 }}>
                                <TextInput
                                    mode='outlined'
                                    value={otp1}
                                    numberOfLines={1}
                                    textAlign='center'
                                    maxLength={1}
                                    cursorColor='white'
                                    onChangeText={text => {
                                        console.log('text', text)
                                        let cleanNumber = text.replace(/[^0-9]/g, "");
                                        if (text == ' ' || text == ',' || text == '.' || text == '-') {

                                        } else {
                                            setOtp1(cleanNumber)
                                            if (cleanNumber != '') {
                                                ref_input2.current.focus()
                                            }
                                        }
                                    }}
                                    onKeyPress={e => {
                                        console.log('e', e)
                                    }}

                                    ref={ref_input1}
                                    keyboardType='number-pad'
                                />
                            </View>
                            <View style={{ margin: 5 }}>
                                <TextInput
                                    mode='outlined'
                                    value={otp2}
                                    numberOfLines={1}
                                    textAlign='center'
                                    maxLength={1}
                                    cursorColor='white'
                                    onChangeText={text => {
                                        let cleanNumber = text.replace(/[^0-9]/g, "");
                                        if (text == ' ' || text == ',' || text == '.' || text == '-') {

                                        } else {
                                            setOtp2(cleanNumber)
                                            if (cleanNumber != '') {
                                                ref_input3.current.focus()
                                            }
                                        }
                                    }}
                                    ref={ref_input2}
                                    keyboardType='number-pad'
                                />

                            </View>
                            <View style={{ margin: 5 }}>
                                <TextInput
                                    mode='outlined'
                                    value={otp3}
                                    numberOfLines={1}
                                    textAlign='center'
                                    maxLength={1}
                                    cursorColor='white'
                                    onChangeText={text => {
                                        let cleanNumber = text.replace(/[^0-9]/g, "");
                                        if (text == ' ' || text == ',' || text == '.' || text == '-') {

                                        } else {
                                            setOtp3(cleanNumber)
                                            if (cleanNumber != '') {
                                                ref_input4.current.focus()
                                            }
                                        }
                                    }}
                                    ref={ref_input3}
                                    keyboardType='number-pad'
                                />

                            </View>
                            <View style={{ margin: 5 }}>
                                <TextInput
                                    mode='outlined'
                                    value={otp4}
                                    numberOfLines={1}
                                    textAlign='center'
                                    maxLength={1}
                                    cursorColor='white'
                                    onChangeText={text => {
                                        let cleanNumber = text.replace(/[^0-9]/g, "");
                                        if (text == ' ' || text == ',' || text == '.' || text == '-') {

                                        } else {
                                            setOtp4(cleanNumber)
                                            if (cleanNumber != '') {
                                                ref_input5.current.focus()
                                            }
                                        }
                                    }}
                                    ref={ref_input4}
                                    keyboardType='number-pad'
                                />
                            </View>
                            <View style={{ margin: 5 }}>
                                <TextInput
                                    mode='outlined'
                                    value={otp5}
                                    numberOfLines={1}
                                    textAlign='center'
                                    maxLength={1}
                                    cursorColor='white'
                                    onChangeText={text => {
                                        let cleanNumber = text.replace(/[^0-9]/g, "");
                                        if (text == ' ' || text == ',' || text == '.' || text == '-') {

                                        } else {
                                            setOtp5(cleanNumber)
                                            if (cleanNumber != '') {
                                                ref_input6.current.focus()
                                            }
                                        }
                                    }}
                                    ref={ref_input5}
                                    keyboardType='number-pad'
                                />
                            </View>
                            <View style={{ margin: 5 }}>
                                <TextInput
                                    mode='outlined'
                                    value={otp6}
                                    numberOfLines={1}
                                    textAlign='center'
                                    maxLength={1}
                                    cursorColor='white'
                                    onChangeText={text => {
                                        let cleanNumber = text.replace(/[^0-9]/g, "");
                                        setOtp6(cleanNumber)
                                    }
                                    }
                                    ref={ref_input6}
                                    keyboardType='number-pad'
                                />
                            </View>

                        </View>
                    </Card.Content>
                    <Card.Actions>
                        <View >

                            <Countdown
                                ref={countdownRef}
                                initialSeconds={countDownx}
                                autoStart={true}
                                formatTime='hh:mm:ss'
                                textStyle={{ fontSize: 12 }}
                                onTimes={e => {
                                    console.log('e==========================s', e)
                                    cur_time = e;
                                    if (e == 0) {
                                        setDisabledSubmit((state) => true);
                                        setdisplay_krmLg((state) => 'flex')
                                    }

                                }}
                                onPause={e => { }}
                                onEnd={(e) => { }}
                            />
                        </View>
                        <View>
                            <Button style={{ display: display_krmLg }} loading={false} mode="text" onPress={() => _krmUlang()}>kirim ulang</Button>
                        </View>
                        <Button
                            buttonColor={common_config.color.gold}
                            icon="arrow-right"
                            style={{ display: 'none' }}
                            onPress={() => {
                                _submit()
                            }}
                            disabled={disabledSubmit}>
                            submit
                        </Button>
                    </Card.Actions>

                </Card>
            </View>

            <View style={{ flex: 3 }}>
                <Alert_custom icon="alert" visible={visible} hideDialog={hideDialog} title="LEVEL TIDAK DITEMUKAN" description="periksa kembali aplikasi anda" />
                <Snackbar
                    visible={visibleNotif}
                    onDismiss={onDismissSnackBar}
                    duration={1000}
                >
                    {messageNotif}
                </Snackbar>
            </View>
        </View>

    )
}

export default OTP;
