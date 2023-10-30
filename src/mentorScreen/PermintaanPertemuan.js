import React, { useState, useCallback, useRef, useEffect } from 'react'
import { RefreshControl, useWindowDimensions, TouchableOpacity, View, Text, ScrollView, SafeAreaView, StatusBar, Dimensions, StyleSheet, Image, Linking } from 'react-native';
import { Button, Badge, Appbar, TextInput, Avatar, Card, Title, Paragraph, Dialog, Chip, Searchbar } from 'react-native-paper';
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
import ShowNotif from '../common/showNotification';
import * as String from '../common/String'
import { multiply } from 'react-native-reanimated';
import Timecount1 from '../assets/timecount1.svg';
import { Timer, Countdown } from 'react-native-element-timer';
import { RectButton } from 'react-native-gesture-handler';
import Centang_ijo from '../assets/centang_ijo.svg';
import Error_perspective_matte from '../assets/Error_perspective_matte.svg';

const style = StyleSheet.create({
    style1: {
        fontWeight: 'bold',
        color: config.color.primery,
        fontSize: 14
    },
    style2: {
        fontSize: 12
    },
    style3: {
        fontWeight: 'bold',
        color: config.color.primery,
        fontSize: 12
    },
    style4: {
        fontSize: 12
    },
    style5: {
        fontWeight: 'bold',
        fontSize: 12
    },
    style6: {
        fontSize: 8,
        color: config.color.disabled
    },
    style7: {
        fontSize: 14,
        fontWeight: 'bold'
    },
    card1: {
        backgroundColor: config.color.white,
        padding: 10
    }
})

const PermintaanPertemuan = ({ route, navigation }) => {
    console.log('route', route.params)
    const BASE_URL = useSelector((state) => state.counter.BASE_URL)
    const DATA_REQUEST = route.params.data;
    const [time, setTime] = useState(0);
    const [nama_siswa, setNama_siswa] = useState(DATA_REQUEST.siswa_name);
    const [dsb_terima, setDsb_terima] = useState(true);
    const [spinnervisible, setSpinnervisible] = useState(false);
    const [messageNotif, setMessageNotif] = useState(false);
    const [latitude, setLatitude] = useState(DATA_REQUEST.latitude)
    const [longitude, setLongitude] = useState(DATA_REQUEST.longitude)


    const actionSheetConfirmRef = useRef();
    const actionSheetConfirmRef2 = useRef();
    const height = Dimensions.get('window').height;
    const heightSheet = (height / 2) - 50;

    let tmp_request_time = '';
    if (DATA_REQUEST.packet_method == 'MONTHLY') {
        tmp_request_time = DATA_REQUEST.days + ' (MONTHLY)';
    } else {

    }
    // const [request_time, setRequest_time] = useState('2 Oktober 2022, 11.00 - 13.00 (2 Jam)');
    const [request_time, setRequest_time] = useState(tmp_request_time);
    const [lokasi_pertemuan, setLokasi_pertemuan] = useState(DATA_REQUEST.address);
    const width = Dimensions.get('window').width;
    const btnBottom = (width / 2) - 25;
    const countdownRef = useRef(null);

    const _setData = (DATA_REQUEST) => {
        switch (DATA_REQUEST.status) {
            case 'WAITING':
                let req_date = new Date(DATA_REQUEST.request_time);
                let cur_date = new Date();

                if (req_date.getFullYear() == cur_date.getFullYear() && req_date.getMonth() == cur_date.getMonth() && req_date.getDate() == cur_date.getDate()) {
                    let dif = cur_date.getTime() - req_date.getTime();
                    console.log('cur_date.getTime()', cur_date.getTime())
                    console.log('req_date.getTime()', req_date.getTime())
                    console.log('dif', dif)

                    let timestart = (60 * 30) - (dif / 1000)
                    console.log('timestart', timestart)
                    if (timestart < 0) {
                        console.log('<0', timestart)
                        setTime((state) => 0);
                        setDsb_terima((state) => true)
                    } else {
                        setTime((state) => timestart);
                        setDsb_terima((state) => false)
                        countdownRef.current.start();
                    }

                } else {
                    setTime((state) => 0);
                    setDsb_terima((state) => true)
                    console.log('masuk sini');

                }

                // countdownRef.current.initialSeconds()

                break;
            case 'ACCEPT':

                break;
            default:
                break;
        }
    }

    const goBack = (navigation) => {
        console.log('back');
        // navigation.goBack()
        navigation.navigate('PermintaanPertemuanList');
    }

    const _terima = async (STATUS_REQUEST) => {
        let id = DATA_REQUEST.id;
        if (id == '' || typeof id == 'undefined') {
            return false;
        }
        setSpinnervisible(true);

        await axios
            .put(BASE_URL + '/updatetransaction/tranid/' + id,
                {
                    status: STATUS_REQUEST
                },
                {
                    timeout: 1000 * 30, //30 detik
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            .then(function (response) {
                // handle success
                console.log('response', response.data)
                let rs = response.data;

                if (!rs.error) {
                    console.log('dalsee')
                    countdownRef.current.stop();
                    if (STATUS_REQUEST == 'ACCEPT') {
                        navigation.navigate('DetailPertemuanMentor', { id: DATA_REQUEST.id })
                    } else if (STATUS_REQUEST == 'DECLINE') {
                        goBack(navigation);
                    }
                }


                setSpinnervisible(false);
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

    useEffect(() => {

        _setData(DATA_REQUEST)
    }, [])

    return (
        <View style={{ backgroundColor: config.color.white, height: '100%' }}>
            <Spinner visible={spinnervisible} />
            <ScrollView>
                <Appbar.Header style={{ elevation: 0 }}>
                    <Appbar.BackAction onPress={() => { goBack(navigation) }} />
                    <Appbar.Content title="permintaan pertemuan" mode='small' titleStyle={{ fontSize: 14, fontWeight: 'bold' }} />
                </Appbar.Header>
                <View style={{ padding: 10, height: '100%' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 2, alignItems: 'center' }}>
                            <Timecount1 />
                        </View>
                        <View style={{ flex: 10 }}>
                            <Text style={style.style1}>Yay!, Anda mendapat Permintaan</Text>
                            <Text style={style.style2}>Anda mendapatkan permintaan sesi privat, silahkan melakukan konfirmasi</Text>
                        </View>
                    </View>
                    <View style={{ paddingTop: 20 }}>
                        <Card style={style.card1}>
                            <View>
                                <Text style={style.style3}>Jadwal Pertemuan</Text>
                            </View>
                            <View style={{ paddingTop: 5 }}>
                                <Text style={style.style4}>Jadwal Permintaan Pertemuan:</Text>
                                <Text style={style.style5}>{nama_siswa}</Text>
                                <Text style={style.style5}>{request_time}</Text>
                            </View>
                            <View style={{ paddingTop: 5 }}>
                                <Text style={style.style6}>Pastikan Anda dapat datang tepat waktu sesuai dengan jadwal yang ditentukan.</Text>
                            </View>
                            <View style={{ paddingTop: 15 }}>
                                <Card onPress={() => {
                                    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
                                    const latLng = `${latitude},${longitude}`;
                                    const label = lokasi_pertemuan;
                                    const url = Platform.select({
                                        ios: `${scheme}${label}@${latLng}`,
                                        android: `${scheme}${latLng}(${label})`
                                    });


                                    Linking.openURL(url);
                                }} style={{ backgroundColor: config.color.primery3 }} elevation={0}>
                                    <Card.Content>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                <FontAwesome5 name='map-marker-alt' size={20} />
                                            </View>
                                            <View style={{ paddingLeft: 10, flex: 9, flexDirection: 'column' }}>
                                                <View><Text style={{ fontSize: 12, fontWeight: 'bold' }}>Lokasi Pertemuan</Text></View>
                                                <View>
                                                    <Text style={{ fontSize: 10 }}>{lokasi_pertemuan}</Text>
                                                    <Text style={{ fontSize: 8 }}>{latitude + '+' + longitude}</Text>
                                                </View>
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Icon on size={25} name='arrow-right' />
                                            </View>

                                        </View>
                                    </Card.Content>
                                </Card>
                            </View>
                            <View style={{ paddingTop: 5 }}>
                                <Button
                                    mode="contained"
                                    buttonColor={config.color.abuabu}
                                    onPress={async () => {

                                    }}
                                    icon="comment-processing-outline"

                                >
                                    Chat</Button>
                            </View>
                        </Card>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={style.style7}>Konfirmasi permintaan sebelum:</Text>
                        </View>
                        <View style={{ paddingTop: 5, alignItems: 'center' }}>
                            <Countdown
                                ref={countdownRef}
                                initialSeconds={time}
                                formatTime='hh:mm:ss'
                                textStyle={{ fontSize: 40, fontWeight: 'bold', color: config.color.gold }}
                                onTimes={e => { }}
                                onPause={e => { }}
                                onEnd={(e) => { }}
                            />


                            {/* <Button
                                onPress={() => {
                                    countdownRef.current.start();
                                }}
                            >Start</Button>
                            <Button
                                onPress={() => {
                                    countdownRef.current.pause();
                                }}
                            >Pause</Button>
                            <Button
                                onPress={() => {
                                    countdownRef.current.resume();
                                }}
                            >Resume</Button>
                            <Button
                                onPress={() => {
                                    countdownRef.current.stop();
                                }}
                            >Stop</Button> */}
                        </View>
                        <View style={{ alignItems: 'center', paddingTop: 5 }}>
                            <Text style={{ textAlign: 'center' }}>Permintaan akan otomatis dibatalkan {'\n'} apabila melebihi waktu yang {'\n'}  ditentukan</Text>
                        </View>
                        <View style={{ marginTop: 30, justifyContent: 'flex-end' }}>
                            <View style={{ flexDirection: 'row', height: '100%', justifyContent: 'center' }}>
                                <View>
                                    <Button
                                        mode="contained"
                                        buttonColor={config.color.abuabu}
                                        style={{ width: btnBottom, marginRight: 5 }}
                                        onPress={async () => {
                                            actionSheetConfirmRef.current?.show();
                                        }}
                                        icon="comment-processing-outline"
                                    >
                                        Tolak
                                    </Button>
                                </View>
                                <View>
                                    <Button
                                        mode="contained"
                                        buttonColor={config.color.primery}
                                        style={{ width: btnBottom }}
                                        onPress={async () => {
                                            // _terima('ACCEPT');
                                            actionSheetConfirmRef2.current?.show();
                                        }}
                                        icon="arrow-right"
                                        disabled={dsb_terima}
                                    >
                                        Terima
                                    </Button>
                                </View>


                            </View>
                        </View>
                    </View>

                </View>
            </ScrollView>
            <ActionSheet ref={actionSheetConfirmRef}>
                <View style={{ height: heightSheet, padding: 10 }}>
                    <View style={{ alignItems: 'center', height: '20%' }}>
                        <Text style={{ marginTop: 20, fontWeight: 'bold' }}>Apakah anda yakin menolak pertemuan?</Text>
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'center', height: '50%' }}>
                        <Error_perspective_matte />
                    </View>
                    <View style={{ justifyContent: 'flex-end', height: '30%' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: '100%', paddingRight: 5 }}>
                                <Button
                                    mode="contained"
                                    buttonColor={config.color.red}
                                    onPress={async () => {
                                        _terima('DECLINE');
                                        actionSheetConfirmRef.current?.hide();
                                    }}
                                    // disabled={dsb_bayar}
                                    disabled={false}
                                >
                                    Ya
                                </Button>
                            </View>
                        </View>
                    </View>
                </View>
            </ActionSheet>
            <ActionSheet ref={actionSheetConfirmRef2}>
                <View style={{ height: heightSheet, padding: 10 }}>
                    <View style={{ alignItems: 'center', height: '20%' }}>
                        <Text style={{ marginTop: 20, fontWeight: 'bold' }}>Apakah anda menerima pertemuan?</Text>

                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'center', height: '50%' }}>
                        <Centang_ijo />
                    </View>
                    <View style={{ justifyContent: 'flex-end', height: '30%' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: '100%', paddingRight: 5 }}>
                                <Button
                                    mode="contained"
                                    buttonColor={config.color.green}
                                    onPress={async () => {
                                        _terima('ACCEPT');
                                        actionSheetConfirmRef2.current?.hide();
                                    }}
                                    // disabled={dsb_bayar}
                                    disabled={false}
                                >
                                    Ya
                                </Button>
                            </View>
                        </View>
                    </View>
                </View>
            </ActionSheet>
        </View>
    )
}

export default PermintaanPertemuan