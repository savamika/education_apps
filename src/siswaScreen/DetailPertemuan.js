import React, { useState, useCallback, useRef, useEffect } from 'react'
import { RefreshControl, Button, useWindowDimensions, TouchableOpacity, View, Text, ScrollView, SafeAreaView, StatusBar, Dimensions, StyleSheet, Image, ImageBackground } from 'react-native';
import { Button as Btn, Badge, Appbar, TextInput, Avatar, Card, Title, Paragraph, Dialog, Chip, Searchbar, Snackbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import * as  config from '../common/config'
import * as String from '../common/String'
import ActionSheet from "react-native-actions-sheet";
import TambahDurasi from './TambahDurasi';
import NotifRequest from './NotifRequest';
// import CountDown from 'react-native-countdown-component';
import { Timer, Countdown } from 'react-native-element-timer';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from '../common/Spinner';

const DetailPertemuan = ({ route, navigation }) => {
    const BASE_URL = useSelector((state) => state.counter.BASE_URL)
    const BOOKING_ID = route.params.BOOKING_ID
    const actionSheetTambahDurasiRef = useRef();
    const actionSheetNotifTimeoutMentor = useRef();
    const [spinnervisible, setSpinnervisible] = useState(false);
    const [visibleNotif, setVisibleNotif] = useState(false);
    const [messageNotif, setMessageNotif] = useState(false);

    const [step1_waiting, setStep1_waiting] = useState('flex');
    const [step1_accept, setStep1_accept] = useState('none');

    const [BADGE_1, setBADGE_1] = useState(config.color.abuabu);
    const [BADGE_2, setBADGE_2] = useState(config.color.abuabu);
    const [BADGE_3, setBADGE_3] = useState(config.color.abuabu);
    const [dsb_jadwal_ulang, setDsb_jadwal_ulang] = useState(false);
    const [dsb_mentor_absen, setDsb_mentor_absen] = useState(false);
    const [dsb_bayar, setDsb_bayar] = useState(true);
    const countdownRef = useRef(null);

    //sementara
    // let tmp_data_booking = { "data": [{ "booking_date": "0000-00-00", "class_method": "OFFLINE", "course_id": "Matematika", "days": "SENIN,SELASA", "end_time": "00:00:00", "id": "54e05bf73c76fe8e849b06ea52eab2daeba4a8f11d4fe7b4d05123bf074ba200", "latitude": null, "longitude": null, "mentor_id": "f4dfe06fa93305caa76fe4e4a2499063650c97022cd832ec890fa32a79114864", "note": "", "packet_method": "REGULAR", "packet_subscription": 1, "req_end": "00:00:16", "req_start": "00:00:15", "request_time": "2023-01-27T08:22:59.000Z", "siswa_id": "6866fe07a3334860093b296ad7a6ba1e6e2419e475b01c384dfeaee05521fdeb", "start_time": "00:00:00", "status": "WAITING", "trn_number": "J7S9CBHZD39B", "updated_time": "0000-00-00 00:00:00" }], "error": false, "message": "transaksi tersedia" }
    // const [DATA_BOOKING, setDATA_BOOKING] = useState(tmp_data_booking.data);
    // const [statusBooking, setStatusBooking] = useState(tmp_data_booking.data.status)

    const [DATA_BOOKING, setDATA_BOOKING] = useState();
    const [DATA_MENTOR, setDATA_MENTOR] = useState();
    const [firstname_mentor, setFirstname_mentor] = useState();
    const [lastname_mentor, setLastname_mentor] = useState();
    const [statusBooking, setStatusBooking] = useState('')
    const [packet_method, setPacket_method] = useState() // REGULAR , MONTHLY
    const [databooking_days, setDatabooking_days] = useState()
    const [databooking_req_start, setDatabooking_req_start] = useState()
    const [databooking_req_end, setDatabooking_req_end] = useState()

    var _packet_method = '';
    var _DATA_BOOKING;


    const [tarif, setTarif] = useState()
    const [durasi, setDurasi] = useState()
    const [reminder, setReminder] = useState('') // HARI INI , BESOK
    const [MONTHLY_DATE, setMONTHLY_DATE] = useState('') // HARI INI , BESOK

    const [tambahDurasi, setTambahDurasi] = useState('00:00');
    const width = Dimensions.get('window').width;
    const btnBottom = (width / 2) - 10;
    const height = Dimensions.get('window').height;
    const heightSheet = (height / 2) - 50;

    const [countDown, setCountDown] = useState(1800) //1800 =30 menit


    const onDismissSnackBar = () => setVisibleNotif(false);

    const _gettransaction = async (id) => {
        setSpinnervisible(true);

        if (id == '' || typeof id == 'undefined') {
            return false;
        }
        let url = BASE_URL + '/gettransaction/getbyid/' + id;
        console.log(url);
        await axios
            .get(url, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(async function (response) {
                // handle success

                let rs = response.data
                console.log('rsXXXXXXXX', rs)
                if (!rs.error) {
                    let data = rs.data[0];
                    setDATA_BOOKING((states) => data)
                    setStatusBooking((states) => data.status)
                    setPacket_method((states) => data.packet_method)
                    _packet_method = data.packet_method;
                    _DATA_BOOKING = data;
                    setDurasi((states) => data.duration)
                    setDatabooking_days((state) => data.days)

                    let start_time = data.req_start.split(':')[0] + ':' + data.req_start.split(':')[1]
                    let end_time = data.req_end.split(':')[0] + ':' + data.req_end.split(':')[1]
                    setDatabooking_req_start((state) => start_time)
                    setDatabooking_req_end((state) => end_time)

                    _findUser(data.mentor_id)

                    set_badge_color(data)

                    let req_date = new Date(data.request_time)
                    let cur_date = new Date()

                    if (data.status == 'WAITING') {
                        //selisih untuk menncari berapa lama waktu berlalu semenjak request
                        let selisih = cur_date.getTime() - req_date.getTime();
                        selisih = selisih / 1000 //milisec to sec
                        setCountDown((state) =>
                            state - selisih
                        )
                        countdownRef.current.start();
                    } else {
                        setCountDown((state) => 0)
                    }
                }
            })
            .catch(function (error) {
                // handle error
                console.log('error', error);
                setSpinnervisible(false);
            })
            .finally(() => {
                //complates
                // setSpinnervisible(false);
            });
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
                let data = response.data[0];
                setDATA_MENTOR((state) => data)
                setTarif((state) => data.service_fee)
                setLastname_mentor((state) => data.lastname)
                setFirstname_mentor((state) => data.firstname)

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

    const getItemTambahDurasi = (item) => {
        // Function for click on an item
        // alert('Id : ' + item.id + ' Title : ' + item.title);
        setTambahDurasi((e) => item.title)
        actionSheetTambahDurasiRef.current?.hide()
    };

    const goBack = (nv) => {
        console.log('navigation', nv);
        // myStopFunction()
        // nv.goBack()
        nv.navigate('BottomNavigation')
    }




    function myStopFunction() {
        try {
            // Get a reference to the last interval + 1
            const interval_id = window.setInterval(function () { }, Number.MAX_SAFE_INTEGER);

            // Clear any timeout/interval up to that id
            for (let i = 1; i < interval_id; i++) {
                window.clearInterval(i);
            }
        } catch (error) {
            console.log('error', error)
        }
    }



    const set_badge_color = async (DATA_BOOKING) => {
        console.log('set_badge_color', DATA_BOOKING)
        console.log('statusBooking', DATA_BOOKING.status)
        console.log('packet_method', DATA_BOOKING.packet_method)
        let STATUS = await DATA_BOOKING.status;

        set_step2_ragular(DATA_BOOKING)

        if (STATUS == 'WAITING') {
            setBADGE_1((e) => config.color.primery)

        }
        else if (STATUS == 'ACCEPT') {
            setBADGE_1((e) => config.color.primery)

            setStep1_waiting((e) => 'none')
            setStep1_accept((e) => 'flex')

        }
        else if (STATUS == 'DECLINE') {
            setBADGE_1((e) => config.color.abuabu)
            setBADGE_2((e) => config.color.abuabu)

            myStopFunction()
        }
        else if (STATUS == 'COMPLETED') {
            setBADGE_1((e) => config.color.primery)
            setBADGE_2((e) => config.color.primery)
            setBADGE_3((e) => config.color.primery)

            myStopFunction()
        }
    }

    const set_step2_ragular = (DATA_BOOKING) => {
        let tmp_packet_method = DATA_BOOKING.packet_method;
        let tmp_day = DATA_BOOKING.days;
        let tmp_booking_date = DATA_BOOKING.booking_date;
        let STATUS = DATA_BOOKING.status;
        let arr_num_days = new Array()


        if (tmp_booking_date == '' || tmp_booking_date == null) {
            const cur = new Date();
            let monthx = parseInt(cur.getMonth()) + 1;
            if (monthx < 10) {
                monthx = '0' + monthx
            }
            tmp_booking_date = cur.getFullYear() + '-' + monthx + '-' + cur.getDate()
        }

        if (tmp_day == '' || tmp_day == null) {
            const cur = new Date();
            tmp_day = cur.getDay();
        }

        if (tmp_packet_method == 'REGULAR') {
            let can_split = tmp_day.includes(",");
            if (can_split) { // jika banyak hari
                let arr_day = tmp_day.split(',')

                arr_day.forEach(element => {
                    let tmp_num = config.number_of_day(element)
                    arr_num_days.push(tmp_num.toString())
                });
            } else { // jika hari hanya 1
                if (tmp_day != '') {
                    arr_num_days.push(config.number_of_day(tmp_day).toString())
                }
            }

            const d = new Date();
            let day = d.getDay().toString();

            if (STATUS == 'ACCEPT' || STATUS == 'COMPLETED') {
                // if (arr_num_days.includes(day)) {
                setBADGE_2((e) => config.color.primery)
                setDsb_jadwal_ulang((e) => true)
                setDsb_mentor_absen((e) => true)
                // }
            }


            arr_num_days.sort().forEach((val, i) => {
                let tmp_days = parseInt(val);
                let curday = parseInt(day);
                let selisih = curday - tmp_days
                if (selisih == -1) {
                    setReminder((e) => '(besok)')
                }
                if (selisih == 0) {
                    setReminder((e) => '(hari ini)')

                }

            })
        } else if (tmp_packet_method == 'MONTHLY') {
            const d = new Date();
            const booking = new Date(tmp_booking_date);

            setMONTHLY_DATE((e) => config.beauty_date(tmp_booking_date))

            if (d.getFullYear() == booking.getFullYear()) {
                if (d.getMonth() == booking.getMonth()) {
                    let selisih = d.getDate() - booking.getDate()
                    if (selisih == -1) {
                        setReminder((e) => '(besok)')
                    }
                    if (selisih == 0) {
                        setReminder((e) => '(hari ini)')

                        if (STATUS == 'ACCEPT' || STATUS == 'COMPLETED') {

                            setBADGE_2((e) => config.color.primery)
                            setDsb_jadwal_ulang((e) => true)
                            setDsb_mentor_absen((e) => true)

                        }
                    }
                }
            }

        }

    }


    console.log('DATA_BOOKING', DATA_BOOKING)
    useEffect(() => {
        _gettransaction(route.params.BOOKING_ID)

        // let mYinterval = setInterval(async () => {
        //     console.log('run interval...')
        //     console.log('status = ', await statusBooking)


        // }, 1000)
        // interval cleanup on component unmount
        // return () => clearInterval(mYinterval)


    }, [])

    return (
        <View style={{ backgroundColor: config.color.white, height: '100%' }}>
            <Spinner visible={spinnervisible} />
            <ScrollView style={{ height: '80%' }}>
                <SafeAreaView style={{ padding: 10 }}>
                    <View>
                        <StatusBar backgroundColor={config.color.primery} />
                        <Appbar.Header style={{ backgroundColor: config.color.white }}>
                            <Appbar.BackAction onPress={() => { goBack(navigation) }} />
                            <Appbar.Content titleStyle={{ fontSize: 14, fontWeight: 'bold' }} mode='small' title="Detail Pertemuan" />
                        </Appbar.Header>
                    </View>
                    <View >
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ paddingRight: 10 }}>
                                <Badge style={{ fontSize: 20, backgroundColor: BADGE_1 }} size={60}>1</Badge>
                            </View>
                            <View style={{ width: '80%', display: step1_waiting }} >
                                <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Menunggu konfirmasi dari mentor</Text>
                                <Text>Kami telah mengirim jadwal pertemuan ke mentor</Text>
                                <Card>
                                    <Card.Content style={{ backgroundColor: config.color.white }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ flex: 8 }}>
                                                <Text variant="bodySmall" style={{ fontWeight: 'bold', color: config.color.link, paddingBottom: 10 }}>Jadwal Pertemuan</Text>
                                                <Text>Jadwal Pertemuan diatur :</Text>
                                                <Text style={{ fontWeight: 'bold', paddingTop: 5 }}>{firstname_mentor} {lastname_mentor}</Text>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, paddingTop: 5 }}>{`(`} {packet_method}{`)`}</Text>
                                                <View style={{ paddingTop: 5 }}>
                                                    <Button title='Batalkan Pertemuan' color={config.color.abuabu} />
                                                </View>
                                                <Text style={{ fontSize: 10, paddingTop: 10 }}>*Jadwal pertemuan akan otomatis dibatalkan apabila melebihi waktu yang ditentukan</Text>
                                            </View>
                                            <View style={{}}>
                                                {/* <CountDown
                                                    until={countDown}
                                                    size={15}
                                                    onFinish={async () => {

                                                        myStopFunction();
                                                        try {
                                                            if (await statusBooking == 'WAITING' || await statusBooking == 'DECLINE') {

                                                                actionSheetNotifTimeoutMentor.current?.show()
                                                            }
                                                        } catch (error) {
                                                            console.log('error', error)
                                                        }

                                                    }}
                                                    digitStyle={{ backgroundColor: config.color.primery }}
                                                    digitTxtStyle={{ color: 'white' }}
                                                    timeToShow={['M', 'S']}
                                                    timeLabels={{ m: '', s: '' }}
                                                /> */}

                                                <Countdown
                                                    ref={countdownRef}
                                                    initialSeconds={countDown}
                                                    formatTime='hh:mm:ss'
                                                    textStyle={{ fontSize: 40, fontWeight: 'bold', color: config.color.gold }}
                                                    onTimes={e => {
                                                        console.log('e==========================s', e)
                                                        setStatusBooking(async (state) => {
                                                            let tmp_status = await state
                                                            console.log('tmp_status', await tmp_status)

                                                            if (tmp_status == 'WAITING' || tmp_status === 'undefined') {
                                                                console.log(BASE_URL + '/gettransaction/getbyid/' + BOOKING_ID)
                                                                const last_status = await axios.get(BASE_URL + '/gettransaction/getbyid/' + BOOKING_ID,
                                                                    {
                                                                        timeout: 1000 * 2 //30 detik
                                                                    }
                                                                ).then(function (response) {
                                                                    // handle success
                                                                    console.log('response booking', response.data)
                                                                    let rs = response.data;
                                                                    console.log('rs.data[0].status', rs.data[0].status)
                                                                    console.log('rs.error', rs.error)
                                                                    console.log('masuk 44')
                                                                    if (rs.error == false) {
                                                                        console.log('masuk 22')
                                                                        if (rs.data[0].status != 'WAITING') {

                                                                            return rs.data[0].status;
                                                                        } else {
                                                                            console.log('masuk 11')
                                                                            return 'WAITING';
                                                                        }

                                                                    } else {
                                                                        console.log('masuk 66')
                                                                        return 'WAITING';
                                                                    }
                                                                }).catch(function (error) {
                                                                    // handle error
                                                                    console.log('masuk 77')
                                                                    console.log('error', error);
                                                                    return 'WAITING';
                                                                })
                                                                console.log('last_status==========', last_status)
                                                                let nr = await last_status.toString()
                                                                console.log('nr==========', nr)
                                                                if (nr != 'WAITING') {
                                                                    set_badge_color(nr)
                                                                }

                                                                return nr;



                                                            } else if (tmp_status == 'ACCEPT') {
                                                                console.log('masuk ACC')
                                                                console.log('_packet_method', _packet_method)
                                                                console.log('_DATA_BOOKING', _DATA_BOOKING)

                                                                if (_packet_method == 'REGULAR') {

                                                                    let tmp_day = _DATA_BOOKING.days;
                                                                    let arr_num_days = new Array()
                                                                    let can_split = tmp_day.includes(",");

                                                                    if (can_split) { // jika banyak hari
                                                                        let arr_day = tmp_day.split(',')

                                                                        arr_day.forEach(element => {
                                                                            let tmp_num = config.number_of_day(element)
                                                                            arr_num_days.push(tmp_num.toString())
                                                                        });
                                                                    } else { // jika hari hanya 1
                                                                        if (tmp_day != '') {
                                                                            arr_num_days.push(config.number_of_day(tmp_day).toString())
                                                                        }
                                                                    }

                                                                    const d = new Date();
                                                                    let day = d.getDay().toString();

                                                                    arr_num_days.sort().forEach((val, i) => {
                                                                        let tmp_days = parseInt(val);
                                                                        let curday = parseInt(day);
                                                                        let selisih = curday - tmp_days

                                                                        if (selisih == 0) {
                                                                            console.log('check time over')
                                                                            let time = _DATA_BOOKING.req_end.replace('.', ':');
                                                                            console.log('time', time)
                                                                            const cur = new Date();

                                                                            let monthx = parseInt(cur.getMonth()) + 1;
                                                                            if (monthx < 10) {
                                                                                monthx = '0' + monthx
                                                                            }
                                                                            let date = cur.getFullYear() + '-' + monthx + '-' + cur.getDate()

                                                                            let booking_date = date
                                                                            console.log('date', date)
                                                                            const booking = new Date(date + ' ' + time);
                                                                            let selisih = cur.getTime() - booking.getTime()
                                                                            console.log('selisih', selisih)
                                                                            if (selisih > 0) { //sudah lewat dan sudah selesai

                                                                                setBADGE_1((e) => config.color.primery)
                                                                                setBADGE_2((e) => config.color.primery)
                                                                                setBADGE_3((e) => config.color.primery)

                                                                                setDsb_bayar((e) => false)
                                                                                myStopFunction()
                                                                            }

                                                                            set_step2_ragular(tmp_status)

                                                                        }

                                                                    })



                                                                } else if (_packet_method == 'MONTHLY') {
                                                                    console.log('check time over')
                                                                    let time = _DATA_BOOKING.req_end.replace('.', ':');
                                                                    let booking_date = _DATA_BOOKING.booking_date;
                                                                    console.log('time', time)
                                                                    const cur = new Date();
                                                                    if (booking_date == '' || booking_date == null) {
                                                                        let monthx = parseInt(cur.getMonth()) + 1;
                                                                        if (monthx < 10) {
                                                                            monthx = '0' + monthx
                                                                        }
                                                                        let date = cur.getFullYear() + '-' + monthx + '-' + cur.getDate()
                                                                        booking_date = date
                                                                    }
                                                                    console.log(booking_date + ' ' + time)
                                                                    const booking = new Date(booking_date + ' ' + time);
                                                                    let selisih = cur - booking
                                                                    console.log('cur', cur)
                                                                    console.log(' booking', booking)
                                                                    console.log('selisih', selisih)
                                                                    if (selisih > 0) { //sudah lewat dan sudah selesai

                                                                        setBADGE_1((e) => config.color.primery)
                                                                        setBADGE_2((e) => config.color.primery)
                                                                        setBADGE_3((e) => config.color.primery)

                                                                        setDsb_bayar((e) => false)
                                                                        myStopFunction()
                                                                    }

                                                                    set_step2_ragular(tmp_status)
                                                                }

                                                                return 'ACCEPT'
                                                            } else {
                                                                return state
                                                            }

                                                        })
                                                    }}
                                                    onPause={e => { }}
                                                    onEnd={(e) => { }}
                                                />
                                                {/* <Chip style={{ fontSize: 14, backgroundColor: config.color.primery }} ><Text style={{ color: config.color.white, alignSelf: 'center' }}>29:00</Text></Chip > */}
                                            </View>

                                        </View>
                                    </Card.Content>
                                </Card>
                            </View>
                            <View style={{ width: '80%', display: step1_accept }} >
                                <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Jadwal telah dikonfirmasi</Text>
                                <Text>jadwal pertemuan telah dikonfirmasi oleh mentor</Text>
                                <Card>
                                    <Card.Content style={{ backgroundColor: config.color.white }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ flex: 8 }}>
                                                <Text variant="bodySmall" style={{ fontWeight: 'bold', color: config.color.link, paddingBottom: 10 }}>Jadwal Pertemuan</Text>
                                                <Text>Jadwal Pertemuan diatur :</Text>
                                                <Text style={{ fontWeight: 'bold', paddingTop: 5 }}>{firstname_mentor} {lastname_mentor}</Text>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, paddingTop: 5 }}>{`(`} {packet_method}{`)`}</Text>
                                                <View style={{ paddingTop: 5 }}>
                                                    <Button title='Jadwalkan Ulang' color={config.color.primery} disabled={dsb_jadwal_ulang} />
                                                </View>
                                                <View style={{ paddingTop: 5 }}>
                                                    <Button title='Mentor Tidak Datang' color={config.color.red} disabled={dsb_mentor_absen} />
                                                </View>

                                            </View>
                                        </View>
                                    </Card.Content>
                                </Card>
                            </View>
                        </View>

                        <View pointerEvents="auto" style={{ flexDirection: 'row', paddingTop: 20 }}>
                            <View style={{ paddingRight: 10 }}>
                                <Badge style={{ fontSize: 20, backgroundColor: BADGE_2 }} size={60}>2</Badge>
                            </View>
                            <View style={{ width: '80%' }}>
                                <View>
                                    <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Sesi Pembelajaran {reminder}</Text>
                                </View>
                                <View>
                                    <Text numberOfLines={2} >Sesi pembelajaran bersama mentor {'\n'}berlangsung dari:</Text>
                                </View>

                                <View style={{}}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{}}>
                                            <Text style={{ fontWeight: 'bold', fontSize: 14, paddingTop: 5, color: config.color.primery }}>{databooking_req_start} - {databooking_req_end}</Text>
                                        </View>
                                    </View>
                                    <View style={{ display: packet_method == 'REGULAR' ? 'flex' : 'none' }}>
                                        <Text style={{ fontSize: 11 }}>{databooking_days}</Text>
                                    </View>
                                    <View style={{ display: packet_method == 'MONTHLY' ? 'flex' : 'none' }}>
                                        <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{MONTHLY_DATE}</Text>
                                    </View>
                                    {/* <View style={{ paddingTop: 10 }}>
                                        <Text>Tambah Durasi</Text>
                                        <TextInput
                                            mode='outlined'
                                            onPressIn={() => { actionSheetTambahDurasiRef.current?.show(); }}
                                            value={tambahDurasi}
                                            right={<TextInput.Icon icon="chevron-down" />} />
                                    </View> */}
                                </View>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', paddingTop: 20 }}>
                            <View style={{ paddingRight: 10 }}>
                                <Badge style={{ fontSize: 20, backgroundColor: BADGE_3 }} size={60}>3</Badge>
                            </View>
                            <View style={{ width: '80%' }}>
                                <View>
                                    <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Sesi Selesai</Text>
                                </View>
                                <View>
                                    <Text numberOfLines={2} >Sesi pembelajaran telah selesai, silahkan konfirmasi untuk melakukan pembayaran.</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ paddingTop: 10 }}>
                            {/* <Btn
                                mode="contained"
                                buttonColor={config.color.primery}
                                onPress={() => {
                                    navigation.navigate('BottomNavigation')
                                }}
                                icon="arrow-left"
                            >
                                kembali ke halaman utama</Btn> */}
                        </View>
                    </View>
                </SafeAreaView>
            </ScrollView>
            <View style={{
                elevation: 20,
                height: '10%'
            }}>
                <View style={{ flexDirection: 'row', margin: 10, justifyContent: 'center' }}>
                    <Btn
                        mode="contained"
                        buttonColor={config.color.abuabu}
                        style={{ width: btnBottom, marginRight: 5 }}
                        onPress={async () => {

                        }}
                        icon="comment-processing-outline"
                    >
                        Chat</Btn>
                    <Btn
                        mode="contained"
                        buttonColor={config.color.primery}
                        style={{ width: btnBottom }}
                        onPress={async () => {
                            setSpinnervisible(true);

                            console.log(BASE_URL + '/getbilling/trxnumber/' + DATA_BOOKING.trn_number)
                            await axios
                                .get(BASE_URL + '/getbilling/trxnumber/' + DATA_BOOKING.trn_number,
                                    {
                                        timeout: 1000 * 10
                                    }
                                )
                                .then(function (response) {
                                    // handle success
                                    // console.log('response', response)
                                    var rs = response.data;
                                    console.log('rs', rs)
                                    if (rs.error == false) {
                                        console.log('rs.data', rs.data)
                                        navigation.navigate('DetailPembayaran', { DATA_BILLING: rs.data[0], DATA_MENTOR: DATA_MENTOR })
                                    } else {

                                    }

                                    setSpinnervisible(false);
                                })
                                .catch(async function (error) {
                                    // handle error
                                    console.log('error', error);
                                    setMessageNotif(String.text.ALERT_KONEKSI);
                                    setVisibleNotif(true);
                                    setSpinnervisible(false);
                                })
                                .finally(() => {
                                    //complates
                                    setSpinnervisible(false);
                                });


                        }}
                        icon="arrow-right"
                        disabled={dsb_bayar}
                    // disabled={false}
                    >
                        Bayar</Btn>
                </View>
            </View>

            <ActionSheet ref={actionSheetTambahDurasiRef}>
                <View style={{ height: heightSheet }}>
                    <TambahDurasi getItem={getItemTambahDurasi} />
                </View>
            </ActionSheet>
            <ActionSheet ref={actionSheetNotifTimeoutMentor}>
                <View style={{ height: heightSheet }}>
                    <NotifRequest navigation={navigation} />
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

export default DetailPertemuan