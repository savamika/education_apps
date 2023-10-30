import React, { useState, useCallback, useRef, useEffect } from 'react'
import { RefreshControl, Button, useWindowDimensions, TouchableOpacity, View, Text, ScrollView, SafeAreaView, StatusBar, Dimensions, StyleSheet, Image, ImageBackground } from 'react-native';
import { Button as btn, Appbar, TextInput, Avatar, Card, Title, Paragraph, Dialog, Chip, Searchbar, Snackbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import * as  config from '../common/config'
import * as String from '../common/String'
import ActionSheet from "react-native-actions-sheet";
import DatePicker from 'react-native-date-picker'
import PaketPertemuanList from './PaketPertemuanList';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from '../common/Spinner';
import { abs } from 'react-native-reanimated';
import Geolocation from '@react-native-community/geolocation'
const BookingFormReguler = (props) => {
    const navigation = props.navigation;
    const DATA_MENTOR = props.dataMentor;
    const DATA_SEARCH_PARAM = props.searchParam;
    const LEVEL = useSelector((state) => state.counter.LEVEL)
    const BASE_URL = useSelector((state) => state.counter.BASE_URL)

    const width = Dimensions.get('window').width;
    const widthHari = (width / 3) - 20;
    const widthMetodePembayaran = (width / 2) - 10;
    const height = Dimensions.get('window').height;
    const heightSheet = (height / 2) - 50;


    const _setAsyncStorage = async () => {
        let USER_IDX = await AsyncStorage.getItem('USER_ID')
        setUSER_ID((e) => USER_IDX)
    }


    const [disabled_submit, setDisabled_submit] = useState(false);

    const [USER_ID, setUSER_ID] = useState('');
    const [visibleNotif, setVisibleNotif] = useState(false);
    const [messageNotif, setMessageNotif] = useState('');
    const [spinnervisible, setSpinnervisible] = useState(false);
    const [btnSenin, setBtnSenin] = useState(config.color.abuabu);
    const [btnSelasa, setBtnSelasa] = useState(config.color.abuabu);
    const [btnRabu, setBtnRabu] = useState(config.color.abuabu);
    const [btnKamis, setBtnKamis] = useState(config.color.abuabu);
    const [btnJumat, setBtnJumat] = useState(config.color.abuabu);
    const [btnSabtu, setBtnSabtu] = useState(config.color.abuabu);
    const [btnMinggu, setBtnMinggu] = useState(config.color.abuabu);
    const [btnMetodePembayaran, setBtnMetodePembayaran] = useState('BAYAR DITEMPAT');
    const [paketPertemuan, setPaketPertemuan] = useState('1 Minggu');
    const [displayPaketPertemuan, setDisplayPaketPertemuan] = useState('1 Minggu');
    const [dateMulai, setDateMulai] = useState(new Date())
    const [dateSelesai, setDateSelesai] = useState(new Date())
    const [durasi, setDurasi] = useState(0)
    const [tarif, setTarif] = useState(0)

    const [longitude, setLongitude] = useState(0)
    const [latitude, setLatitude] = useState(0)
    const actionSheetPaketPertemuanRef = useRef();

    const onDismissSnackBar = () => setVisibleNotif(false);

    const setPembayaran = (metode) => {

    }

    const getPaketPertemuan = (item) => {
        // Function for click on an item
        // alert('Id : ' + item.id + ' Title : ' + item.title);
        setPaketPertemuan((e) => item.id)
        setDisplayPaketPertemuan((e) => item.title)
        actionSheetPaketPertemuanRef.current?.hide()
    };

    const _hitungTarif = (mulai, selesai) => {
        let tmp_diff = ((selesai - mulai) / 1000) / 60 //per menit
        let abs_diff = Math.abs(tmp_diff) //per menit
        abs_diff = Math.ceil(abs_diff / 60)
        // console.log('abs_diff', abs_diff)
        setDurasi((e) => abs_diff)

        let tarifx = abs_diff * DATA_MENTOR.service_fee;
        setTarif((e) => tarifx)
    }

    const setBtnColor = (day) => {
        switch (day) {
            case 'Senin':
                if (btnSenin == config.color.abuabu) {
                    setBtnSenin((e) => config.color.primery)
                } else {
                    setBtnSenin((e) => config.color.abuabu)
                }
                break;
            case 'Selasa':
                if (btnSelasa == config.color.abuabu) {
                    setBtnSelasa((e) => config.color.primery)
                } else {
                    setBtnSelasa((e) => config.color.abuabu)
                }
                break;
            case 'Rabu':
                if (btnRabu == config.color.abuabu) {
                    setBtnRabu((e) => config.color.primery)
                } else {
                    setBtnRabu((e) => config.color.abuabu)
                }
                break;
            case 'Kamis':
                if (btnKamis == config.color.abuabu) {
                    setBtnKamis((e) => config.color.primery)
                } else {
                    setBtnKamis((e) => config.color.abuabu)
                }
                break;
            case 'Jumat':
                if (btnJumat == config.color.abuabu) {
                    setBtnJumat((e) => config.color.primery)
                } else {
                    setBtnJumat((e) => config.color.abuabu)
                }
                break;
            case 'Sabtu':
                if (btnSabtu == config.color.abuabu) {
                    setBtnSabtu((e) => config.color.primery)
                } else {
                    setBtnSabtu((e) => config.color.abuabu)
                }
                break;
            case 'Minggu':
                if (btnMinggu == config.color.abuabu) {
                    setBtnMinggu((e) => config.color.primery)
                } else {
                    setBtnMinggu((e) => config.color.abuabu)
                }
                break;

            default:
                break;
        }
    }

    const _submitPesanan = async () => {
        let hari = '';
        if (btnSenin == config.color.primery) {
            hari += 'SENIN,'
        }
        if (btnSelasa == config.color.primery) {
            hari += 'SELASA,'
        }
        if (btnRabu == config.color.primery) {
            hari += 'RABU,'
        }
        if (btnKamis == config.color.primery) {
            hari += 'KAMIS,'
        }
        if (btnJumat == config.color.primery) {
            hari += 'JUMAT,'
        }
        if (btnSabtu == config.color.primery) {
            hari += 'SABTU,'
        }
        if (btnMinggu == config.color.primery) {
            hari += 'MINGGU,'
        }

        if (hari != '') {
            hari = hari.slice(0, -1); //delete karater terakhir untuk menghilangkan koma
        } else {
            setMessageNotif('hari pertemuan belum dipilih')
            setVisibleNotif(true);
            setSpinnervisible((e) => false)
            setDisabled_submit((e) => false)
            return false
        }

        let tmp_jam = dateMulai.getHours() < 10 ? '0' + dateMulai.getHours().toString() : dateMulai.getHours().toString()
        let tmp_minute = dateMulai.getMinutes() < 10 ? '0' + dateMulai.getMinutes().toString() : dateMulai.getMinutes().toString()

        let jam_mulai = tmp_jam + ':' + tmp_minute

        tmp_jam = dateSelesai.getHours() < 10 ? '0' + dateSelesai.getHours().toString() : dateSelesai.getHours().toString()
        tmp_minute = dateSelesai.getMinutes() < 10 ? '0' + dateSelesai.getMinutes().toString() : dateSelesai.getMinutes().toString()
        let jam_selesai = tmp_jam + ':' + tmp_minute

        let param = {
            user_id: USER_ID,
            mentor_id: DATA_MENTOR.id,
            packet_subscription: paketPertemuan,
            class_method: "OFFLINE",
            packet_method: "REGULAR",
            days: hari,
            booking_date: "",
            req_start: jam_mulai,
            req_end: jam_selesai,
            note: "",
            course_id: DATA_SEARCH_PARAM.mataPelajaran,
            duration: durasi
        }


        console.log('param', param)
        console.log('POST', BASE_URL + '/mentor/booking')

        await axios
            .post(BASE_URL + '/mentor/booking',
                param,
                {
                    timeout: 1000 * 30 //30 detik
                }
            )
            .then(function (response) {
                // handle success
                // console.log('response', response)
                var rs = response.data;
                console.log('rs', rs)
                let id = rs.data.tran_id;
                if (typeof id != 'undefined') {
                    navigation.navigate('DetailPertemuan', { BOOKING_ID: id })
                } else {
                    setMessageNotif((e) => String.ALERT_KONEKSI);
                    setTimeout(() => {
                        setVisibleNotif(true);
                    }, 500);
                }


            })
            .catch(async function (error) {
                // handle error
                // console.log('String', String);
                console.log('error', error);

                setMessageNotif((e) => String.ALERT_KONEKSI);
                setTimeout(() => {
                    setVisibleNotif(true);
                }, 500);
            })
            .finally(() => {
                //complates
                setSpinnervisible((e) => false)
                setDisabled_submit((e) => false)
            });

    }

    const _getLocation = () => {
        Geolocation.getCurrentPosition(
            (pos) => {
                console.log('pos.longitude', pos.coords.longitude)
                console.log('pos.latitude', pos.coords.latitude)

                setLongitude((state) => pos.coords.longitude)
                setLatitude((state) => pos.coords.latitude)
            },
            (error) => alert('GetCurrentPosition Error', JSON.stringify(error)),
            { enableHighAccuracy: true }
        );
    }

    useEffect(() => {
        _setAsyncStorage()
        _getLocation();
    }, [])


    return (
        <View>
            <Spinner visible={spinnervisible} />
            <View style={{ backgroundColor: config.color.white }}>
                <ScrollView style={{ height: '85%' }}>
                    <SafeAreaView style={{ padding: 10, paddingBottom: 20 }}>
                        <View>
                            <Text style={{ fontSize: 12 }}>Paket Pertemuan</Text>
                            <TextInput
                                mode='outlined'
                                onPressIn={() => { actionSheetPaketPertemuanRef.current?.show(); }}
                                value={displayPaketPertemuan}
                                right={<TextInput.Icon icon="chevron-down" />} />
                        </View>

                        <View style={{ paddingTop: 20 }}>
                            <Text style={{ fontSize: 12 }}>Hari Pertemuan</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <View style={{ width: widthHari, padding: 5 }}>
                                    <Button title='Senin' onPress={() => { setBtnColor('Senin') }} color={btnSenin} ></Button>
                                </View>
                                <View style={{ width: widthHari, padding: 5 }}>
                                    <Button title='Selasa' onPress={() => { setBtnColor('Selasa') }} color={btnSelasa} ></Button>
                                </View>
                                <View style={{ width: widthHari, padding: 5 }}>
                                    <Button title='Rabu' onPress={() => { setBtnColor('Rabu') }} color={btnRabu}></Button>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <View style={{ width: widthHari, padding: 5 }}>
                                    <Button title='Kamis' onPress={() => { setBtnColor('Kamis') }} color={btnKamis}></Button>
                                </View>
                                <View style={{ width: widthHari, padding: 5 }}>
                                    <Button title='Jumat' onPress={() => { setBtnColor('Jumat') }} color={btnJumat}></Button>
                                </View>
                                <View style={{ width: widthHari, padding: 5 }}>
                                    <Button title='Sabtu' onPress={() => { setBtnColor('Sabtu') }} color={btnSabtu}></Button>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <View style={{ width: widthHari, padding: 5 }}>
                                    <Button title='Minggu' onPress={() => { setBtnColor('Minggu') }} color={btnMinggu} ></Button>
                                </View>
                            </View>


                        </View>
                        <View style={{ paddingTop: 20 }}>
                            <Text style={{ fontSize: 12 }}>Jam Pertemuan (Setiap harinya)</Text>
                            <View style={{ flexDirection: "row" }}>
                                <View style={{ flex: 6, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 12, color: config.color.primery, fontWeight: 'bold' }}>Mulai</Text>
                                    <DatePicker mode='time' date={dateMulai} onDateChange={
                                        (val) => {
                                            setDateMulai((e) => val)
                                            _hitungTarif(val, dateSelesai)
                                        }
                                    } />
                                </View>
                                <View style={{ flex: 6, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 12, color: config.color.primery, fontWeight: 'bold' }}>Selesai</Text>
                                    <DatePicker mode='time' date={dateSelesai} onDateChange={
                                        (val) => {

                                            setDateSelesai((e) => val)
                                            _hitungTarif(dateMulai, val)

                                        }
                                    } />
                                </View>
                            </View>
                        </View>
                        <View style={{ paddingTop: 20 }}>
                            <Text style={{ fontSize: 12 }}>Metode Pembayaran</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ width: widthMetodePembayaran, padding: 5 }}>
                                    <Button title='Bayar ditempat' onPress={() => { setPembayaran('BAYAR DITEMPAT') }} color={config.color.primery}></Button>
                                </View>
                                <View style={{ width: widthMetodePembayaran, padding: 5 }}>
                                    <Button title='Transfer Bank' onPress={() => { setPembayaran('BANK TRANSFER') }} color={config.color.abuabu} disabled></Button>
                                </View>
                            </View>
                        </View>
                    </SafeAreaView>
                </ScrollView>
                <View style={{ height: '15%', backgroundColor: 'white', elevation: 10, justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row', padding: 10 }}>
                        <View style={{ flex: 4 }}>
                            <Text style={{ fontSize: 12 }}>Total Pembayaran</Text>
                            <Text style={{ fontSize: 12 }}>{config.formatRupiah(DATA_MENTOR.service_fee)} x {durasi}</Text>
                            <Text style={{ fontWeight: 'bold', fontSize: 14 }}>{config.formatRupiah(tarif, 'Rp. ')}</Text>
                        </View>
                        <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
                            <Icon name='clipboard-text-outline' size={30} />
                        </View>
                        <View style={{ flex: 6, justifyContent: 'center' }}>
                            <Button
                                mode="contained"
                                buttonColor={config.color.primery2}
                                textColor={config.color.white}
                                onPress={() => {
                                    setDisabled_submit((e) => true)
                                    setSpinnervisible((e) => true)
                                    setTimeout(() => {
                                        _submitPesanan()
                                    }, 1000);

                                }}
                                title="Booking"
                                disabled={disabled_submit}
                            >

                            </Button>
                        </View>
                    </View>
                </View>



            </View>

            <ActionSheet ref={actionSheetPaketPertemuanRef}>
                <View style={{ height: heightSheet }}>
                    <PaketPertemuanList getItem={getPaketPertemuan} />
                </View>
            </ActionSheet>

            <Snackbar
                visible={visibleNotif}
                onDismiss={onDismissSnackBar}
                duration={1000}
            >
                {messageNotif}
            </Snackbar>
        </View>
    )
}

export default BookingFormReguler