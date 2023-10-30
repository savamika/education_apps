import React, { useState, useCallback, useRef, useEffect } from 'react'
import { RefreshControl, Button, useWindowDimensions, TouchableOpacity, View, Text, ScrollView, SafeAreaView, StatusBar, Dimensions, StyleSheet, Image, ImageBackground, Alert } from 'react-native';
import { Button as btn, Appbar, TextInput, Avatar, Card, Title, Paragraph, Dialog, Chip, Searchbar, Snackbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import * as  config from '../common/config'
import * as String from '../common/String'
import ActionSheet from "react-native-actions-sheet";
import DatePicker from 'react-native-date-picker'
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from '../common/Spinner';
import Geolocation from '@react-native-community/geolocation'

const BookingFormHarian = (props) => {
    const navigation = props.navigation;
    const DATA_MENTOR = props.dataMentor;
    const DATA_SEARCH_PARAM = props.searchParam;
    const LEVEL = useSelector((state) => state.counter.LEVEL)
    const BASE_URL = useSelector((state) => state.counter.BASE_URL)
    const [USER_ID, setUSER_ID] = useState('');
    const _setAsyncStorage = async () => {
        let USER_IDX = await AsyncStorage.getItem('USER_ID')
        setUSER_ID((e) => USER_IDX)
    }


    const width = Dimensions.get('window').width;
    const widthHari = (width / 3) - 20;
    const widthMetodePembayaran = (width / 2) - 10;
    const height = Dimensions.get('window').height;
    const heightSheet = (height / 2) - 50;

    const [html_available_time, setHtml_available_time] = useState([<Text>-</Text>]);
    const [spinnervisible, setSpinnervisible] = useState(false);
    const [disabled_submit, setDisabled_submit] = useState(false);

    const [btnMetodePembayaran, setBtnMetodePembayaran] = useState('BAYAR DITEMPAT');

    const [dateMulai, setDateMulai] = useState(new Date())
    const [dateSelesai, setDateSelesai] = useState(new Date())
    const [durasi, setDurasi] = useState(0)
    const [tarif, setTarif] = useState(0)
    const [visibleNotif, setVisibleNotif] = useState(false);
    const [messageNotif, setMessageNotif] = useState('');
    const [longitude, setLongitude] = useState(0)
    const [latitude, setLatitude] = useState(0)
    const onDismissSnackBar = () => setVisibleNotif(false);

    const _hitungTarif = (mulai, selesai) => {
        let tmp_diff = ((selesai - mulai) / 1000) / 60 //per menit
        let abs_diff = Math.abs(tmp_diff) //per menit
        abs_diff = Math.ceil(abs_diff / 60)
        // console.log('abs_diff', abs_diff)
        setDurasi((e) => abs_diff)

        let tarifx = abs_diff * DATA_MENTOR.service_fee;
        setTarif((e) => tarifx)
    }

    const setPembayaran = (metode) => {

    }
    const setAvailabletime = () => {
        let time = DATA_MENTOR.available_time;
        let arr_html = new Array()
        if (time.includes(',')) {
            let arr = time.split(',')

            var i = 0;
            arr.forEach(element => {
                let html = (
                    <View key={i} style={{ padding: 5 }}>
                        <Card style={{ marginRight: 2, backgroundColor: config.color.white }}>
                            <Card.Content>
                                <Text key={i}>{element}</Text>
                            </Card.Content>
                        </Card>
                    </View>

                )
                arr_html.push(html)
                i++
            });
        } else {
            let html = (
                <View key={i} style={{ padding: 5 }}>
                    <Card style={{ marginRight: 2, backgroundColor: config.color.white }}>
                        <Card.Content>
                            <Text >{time}</Text>
                        </Card.Content>
                    </Card>
                </View>
            )
            arr_html.push(html)
        }

        setHtml_available_time((e) => arr_html)
    }

    const checkAvaliableTime = () => {
        let dt = DATA_MENTOR.available_date

        if (dt == '' || dt == '0000-00-00' || dt == 'null') {
            setDisabled_submit((state) => true)
        }
    }


    const _submitPesanan = async () => {

        let tmp_jam = dateMulai.getHours() < 10 ? '0' + dateMulai.getHours().toString() : dateMulai.getHours().toString()
        let tmp_minute = dateMulai.getMinutes() < 10 ? '0' + dateMulai.getMinutes().toString() : dateMulai.getMinutes().toString()

        let jam_mulai = tmp_jam + ':' + tmp_minute

        tmp_jam = dateSelesai.getHours() < 10 ? '0' + dateSelesai.getHours().toString() : dateSelesai.getHours().toString()
        tmp_minute = dateSelesai.getMinutes() < 10 ? '0' + dateSelesai.getMinutes().toString() : dateSelesai.getMinutes().toString()
        let jam_selesai = tmp_jam + ':' + tmp_minute

        let param = {
            user_id: USER_ID,
            mentor_id: DATA_MENTOR.id,
            packet_subscription: "",
            class_method: "OFFLINE",
            packet_method: "MONTHLY",
            days: "",
            booking_date: DATA_MENTOR.available_date,
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
                if (rs.error == false) {

                    let id = rs.data.tran_id;
                    if (typeof id != 'undefined') {
                        navigation.navigate('DetailPertemuan', { BOOKING_ID: id })
                    } else {
                        setMessageNotif((e) => String.ALERT_KONEKSI);
                        setTimeout(() => {
                            setVisibleNotif(true);
                        }, 500);
                    }
                } else {

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
            (error) => Alert.alert('GetCurrentPosition Error', JSON.stringify(error)),
            { enableHighAccuracy: true }
        );
    }
    useEffect(() => {
        _setAsyncStorage()
        setAvailabletime();
        checkAvaliableTime();
        _getLocation();
    }, [])


    return (
        <View>
            <Spinner visible={spinnervisible} />
            <View style={{ backgroundColor: config.color.white }}>
                <ScrollView style={{ height: '85%' }}>
                    <SafeAreaView style={{ padding: 10, paddingBottom: 20 }}>
                        <View>
                            <Text style={{ fontSize: 12 }}>Waktu Tersedia</Text>
                            <Text>{DATA_MENTOR.available_date}</Text>
                            <ScrollView horizontal={true} >

                                {html_available_time}

                            </ScrollView>
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
                                    }
                                    />
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
                <View style={{ height: '15%', backgroundColor: 'white', elevation: 10 }}>
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
                            <Text style={{ fontSize: 10, fontStyle: 'italic', display: disabled_submit ? 'flex' : 'none' }}>*mentor tidak tersedia</Text>
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

export default BookingFormHarian