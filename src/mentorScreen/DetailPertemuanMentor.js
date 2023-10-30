import React, { useState, useCallback, useRef, useEffect } from 'react'
import { RefreshControl, useWindowDimensions, TouchableOpacity, View, Text, ScrollView, SafeAreaView, StatusBar, Dimensions, StyleSheet, Image, Linking } from 'react-native';
import { Button, Badge, Appbar, TextInput, Avatar, Card, Title, Paragraph, Dialog, Chip, Searchbar, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as  config from '../common/config'
import ActionSheet from "react-native-actions-sheet";
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import ShowNotif from '../common/showNotification';
import * as String from '../common/String'
import Timecount1 from '../assets/timecount1.svg';
import { Timer, Countdown } from 'react-native-element-timer';
import MapSvg from '../assets/map.svg';
import Bell from '../assets/Bell_perspective_matte.svg';
import TambahDurasi from '../siswaScreen/TambahDurasi';
// import Logo from '../assets/login.svg';
const style = StyleSheet.create({
    timerstyle: {
        fontSize: 32,
        color: config.color.white,
        fontWeight: 'bold',
        marginLeft: 5,
        marginRight: 5
    },
    statusSesi: {
        fontSize: 16,
        fontWeight: 'bold',
        color: config.color.white,
        textAlign: 'center'
    },
    dcsSesi: {
        fontSize: 12,
        color: config.color.white,
        textAlign: 'center'
    }, style3: {
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

const DetailPertemuanMentor = ({ route, navigation }) => {
    const BASE_URL = useSelector((state) => state.counter.BASE_URL)
    console.log('route', route)
    const ID_TRANSAKSI = route.params.id;
    const actionSheetTambahDurasiRef = useRef();

    const [spinnervisible, setSpinnervisible] = useState(false);
    const [latitude, setLatitude] = useState(0)
    const [longitude, setLongitude] = useState(0)
    var status = 'KONFIRMASI'; //KONFIRMASI , ONGOING , SELESAI

    const actionSheetConfirmRef = useRef();
    const actionSheetNotifRef = useRef();
    const actionSheetNambahDurasiRef = useRef();
    const countdownRef = useRef();
    const timerRef = useRef();

    const [btn_dsb_hentikan_sesi, setBtn_dsb_hentikan_sesi] = useState(true)
    const [btn_dsb_mulai_sesi, setBtn_dsb_mulai_sesi] = useState(true)
    const height = Dimensions.get('window').height;
    const heightSheet = (height / 2) - 50;

    const [time, setTime] = useState(0)
    const [txtminutes, setTxtminutes] = useState('flex')
    const [txthour, setTxthour] = useState('flex')
    const [statusSesi, setStatusSesi] = useState('Sesi belum dimulai')
    const [txt_info, setTxt_info] = useState('Silahkan mulai sesi apabila anda telah \n datang dilokasi pertemuan')

    const [nama_siswa, setNama_siswa] = useState('');
    const [request_time, setRequest_time] = useState('');
    const [lokasi_pertemuan, setLokasi_pertemuan] = useState('');

    const [jenis_transaksi, setJenis_transaksi] = useState('Bayar ditempat');
    const [no_transaksi, setNo_transaksi] = useState('');
    const [durasi, setDurasi] = useState('');
    const [durasiTambahan, setDurasiTambahan] = useState(0);
    const [totalPembayaran, setTotalPembayaran] = useState('Rp. 80.000');

    const [tambahDurasi, setTambahDurasi] = useState(0);

    const [displayStep1, setSisplayStep1] = useState('flex');
    const [displayStep2, setSisplayStep2] = useState('none');

    const getItemTambahDurasi = (item) => {
        // Function for click on an item
        // alert('Id : ' + item.id + ' Title : ' + item.title);
        console.log(item.title);
        setTambahDurasi((e) => item.body)
        // actionSheetTambahDurasiRef.current?.hide()
    };

    const step1 = () => {
        setSisplayStep1('flex');
        setSisplayStep2('none')
    }
    const step2 = () => {
        setSisplayStep1('none');
        setSisplayStep2('flex')
    }

    const notifMauHabis = () => {
        actionSheetNotifRef.current?.show();
    }

    const nambahDurasi = () => {
        actionSheetNambahDurasiRef.current?.show();
    }
    const confirmasi = () => {
        actionSheetConfirmRef.current?.show();
    }

    const _gettransaction = async (id) => {
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
                // console.log('rs', rs)
                if (!rs.error) {
                    let data = rs.data[0];
                    let packet_method = data.packet_method;

                    setNama_siswa((e) => data.siswa_name)
                    setLokasi_pertemuan((e) => data.address)
                    setNo_transaksi((e) => data.trn_number)
                    setDurasi((e) => data.duration + ' jam')
                    setTotalPembayaran((e) => data.total_payment)
                    setLatitude((state) => data.latitude)
                    setLongitude((state) => data.longitude)

                    if (packet_method == 'MONTHLY') {


                        _start_check(data)
                    }

                    console.log('done')
                    setSpinnervisible(false);
                }
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


    const _start_check = (data) => {

        let req_date = new Date(data.booking_date)



        let only_req_year = req_date.getFullYear();
        let only_req_month = req_date.getMonth() + 1;
        let only_req_date = req_date.getDate();

        let tmp_m = only_req_month < 10 ? '0' + only_req_month : only_req_month;
        let tmp_d = only_req_date < 10 ? '0' + only_req_date : only_req_date;
        let ymd = only_req_year + '-' + tmp_m + '-' + tmp_d;
        ymd = config.beauty_date(ymd);



        let showstarttime = only_req_year + '-' + only_req_month + '-' + only_req_date + ' ' + data.req_start;
        let showendtime = only_req_year + '-' + only_req_month + '-' + only_req_date + ' ' + data.req_end;


        var time_start = new Date(showstarttime);
        var time_end = new Date(showendtime);

        let tmp_time_start = time_start.getHours() + ':' + time_start.getMinutes()
        let tmp_time_end = time_end.getHours() + ':' + time_end.getMinutes()

        let fulldate = ymd + ', ' + tmp_time_start + ' - ' + tmp_time_end + ' ( ' + data.duration + ' jam)';
        setRequest_time((e) => fulldate)

        var tambah_durasi_sesi = tambahDurasi * 3600 * 1000;
        var waktu_end = time_end.getTime() + tambah_durasi_sesi;

        var refreshId = setInterval(function () {
            let cur_date = new Date()
            if (status == 'SELESAI') {
                // clearInterval(refreshId);
                return false;
            }



            console.log('showstarttime', showstarttime)
            console.log('showendtime', showendtime)

            console.log('check==============')
            console.log('year : ' + req_date.getFullYear() + "==" + cur_date.getFullYear())
            console.log('month : ' + req_date.getMonth() + "==" + cur_date.getMonth())
            console.log('date : ' + req_date.getDate() + "==" + cur_date.getDate())

            if (req_date.getFullYear() == cur_date.getFullYear() && req_date.getMonth() == cur_date.getMonth() && req_date.getDate() == cur_date.getDate()) {
                console.log('time : ' + time_start.getTime() + "==" + cur_date.getTime())
                console.log('time : ' + time_end.getTime() + "==" + waktu_end)

                if (cur_date.getTime() > time_start.getTime() && cur_date.getTime() < waktu_end) {
                    console.log('start sesi..')

                    setStatusSesi((state) => 'Sesi sedang berlangsung')
                    setTxt_info((state) => 'timer akan otomatis betambah apabila \n ada penambahan durasi pertemuan')

                    if (status != 'ONGOING') {

                        setBtn_dsb_mulai_sesi((state) => false)
                        status = 'ONGOING';

                        step2();
                        timerRef.current?.start();
                        console.log('ONGOING...')

                        let initial_duration = cur_date.getTime() - time_start.getTime();
                        initial_duration = Math.ceil(initial_duration / 1000)
                        setTime((s) => initial_duration)
                        // clearInterval(refreshId);
                        return false;
                    }


                } else if (cur_date.getTime() > waktu_end) {
                    console.log('sesi habis')
                    status = 'SELESAI';

                    setStatusSesi((state) => 'Sesi sudah berakhir')
                    setTxt_info((state) => 'timer akan otomatis betambah apabila \n ada penambahan durasi pertemuan')
                    clearInterval(refreshId);

                    step2();
                    notifMauHabis()
                    timerRef.current?.pause();
                    setBtn_dsb_hentikan_sesi((e) => false);
                    clearInterval(refreshId);

                }
            } else {

            }


        }, 1000);

    }

    const _tambah_durasi = () => {
        let id = ID_TRANSAKSI;
        if (id == '' || typeof id == 'undefined') {
            return false;
        }
        setSpinnervisible(true);

        let url = BASE_URL + '/mentor/additionaltime/' + id;
        axios
            .post(url,
                {
                    trn_number: trn_number,
                    duration: 1
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
                    console.log('API SEND ', rs)
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

    const _SETSTATUS = (STATUS) => {
        let id = ID_TRANSAKSI;
        if (id == '' || typeof id == 'undefined') {
            return false;
        }
        setSpinnervisible(true);

        console.log('UPDATE STATUS ' + STATUS)
        console.log(BASE_URL + '/updatetransaction/tranid/' + id)
        axios
            .put(BASE_URL + '/updatetransaction/tranid/' + id,
                {
                    status: STATUS
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
                    console.log('API SEND ' + STATUS)
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

    const goBack = (navigation) => {
        console.log('back');
        // navigation.goBack()
        navigation.navigate('PermintaanPertemuanList');
    }
    console.log('ID_TRANSAKSI', ID_TRANSAKSI)
    useEffect(() => {

        _gettransaction(ID_TRANSAKSI);


    }, [])

    return (
        <View style={{ backgroundColor: config.color.white, height: '100%' }}>
            <Spinner visible={spinnervisible} />
            <View style={{ height: '80%' }}>
                <ScrollView>
                    <Appbar.Header style={{ elevation: 0 }}>
                        <Appbar.BackAction onPress={() => { goBack(navigation) }} />
                        <Appbar.Content title="Detail Pertemuan" mode='small' titleStyle={{ fontSize: 14, fontWeight: 'bold' }} />
                    </Appbar.Header>
                    {/* <Button onPress={() => { console.log('step 1'); notifMauHabis() }}>
                        notif mau habis
                    </Button>
                    <Button onPress={() => { console.log('step 2'); nambahDurasi() }}>
                        notif nambah durasi
                    </Button> */}
                    <View style={{ height: '100%', padding: 10 }}>
                        <Card style={{ backgroundColor: config.color.primery2 }}>
                            <View style={{ padding: 10, alignItems: 'center' }}>
                                <View style={{ padding: 20, flexDirection: 'row' }}>
                                    {/* <Text style={{ display: txthour }}>00 :</Text>
                                    <Text style={{ display: txtminutes }}>00 :</Text> */}
                                    <Timer
                                        ref={timerRef}
                                        textStyle={style.timerstyle}
                                        formatTime='hh:mm:ss'
                                        onTimes={e => {
                                            // console.log('e', e)
                                            // if (e == 2) {
                                            //     setTxtminutes((state) => 'none')
                                            //     console.log('hideeee menit')
                                            // }
                                            // if (e == 3600) {
                                            //     setTxthour((state) => 'none')
                                            //     console.log('hideeee jam')
                                            // }
                                        }}
                                        onPause={e => { }}
                                        onEnd={e => { }}
                                        initialSeconds={time}
                                    />
                                </View>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={style.statusSesi}>{statusSesi}</Text>
                                    <Text style={style.dcsSesi}>{txt_info}</Text>
                                </View>
                            </View>

                        </Card>
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

                                <View style={{ display: displayStep1, marginTop: 10, marginBottom: 10 }}>
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
                                                        </View>
                                                    </View>
                                                    <View style={{ flex: 1 }}>
                                                        <Icon size={25} name='arrow-right' />
                                                    </View>

                                                </View>
                                            </Card.Content>
                                        </Card>
                                    </View>

                                </View>

                                <Divider />


                                <View style={{ display: displayStep2, marginTop: 10, marginBottom: 10 }}>

                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ width: '50%' }}>
                                            <Text>Jenis Transaksi</Text>
                                        </View>
                                        <View style={{ width: '50%', alignItems: 'flex-end' }}>
                                            <Text style={{ fontWeight: 'bold' }}>{jenis_transaksi}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                        <View style={{ width: '50%' }}>
                                            <Text>No. Transaksi</Text>
                                        </View>
                                        <View style={{ width: '50%', alignItems: 'flex-end' }}>
                                            <Text style={{ fontWeight: 'bold' }}>{no_transaksi}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                        <View style={{ width: '50%' }}>
                                            <Text>Durasi</Text>
                                        </View>
                                        <View style={{ width: '50%', alignItems: 'flex-end' }}>
                                            <Text style={{ fontWeight: 'bold' }}>{durasi}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 5 }}>
                                        <View style={{ width: '50%' }}>
                                            <Text>Durasi Tambahan</Text>
                                        </View>
                                        <View style={{ width: '50%', alignItems: 'flex-end' }}>
                                            <Text style={{ fontWeight: 'bold' }}>{durasiTambahan} jam</Text>
                                        </View>
                                    </View>

                                    <Divider />

                                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                        <View style={{ width: '50%' }}>
                                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: config.color.primery }}>Total</Text>
                                        </View>
                                        <View style={{ width: '50%', alignItems: 'flex-end' }}>
                                            <Text style={{ fontWeight: 'bold', fontSize: 16, fontWeight: 'bold', color: config.color.primery }}>{totalPembayaran}</Text>
                                        </View>
                                    </View>

                                </View>


                            </Card>

                        </View>

                    </View>
                </ScrollView>
            </View>
            <View style={{ height: '20%', padding: 10, flexDirection: 'row', display: displayStep1 }}>

                <View style={{ width: '100%', justifyContent: 'flex-end', padding: 5 }}>
                    <Button
                        mode="contained"
                        buttonColor={config.color.primery}
                        onPress={async () => {
                            confirmasi();
                        }}
                        icon="arrow-right"
                        disabled={btn_dsb_mulai_sesi}
                    >
                        Memulai Sesi
                    </Button>
                </View>
            </View>
            <View style={{ height: '20%', padding: 10, flexDirection: 'row', display: displayStep2 }}>
                <View style={{ width: '100%', justifyContent: 'flex-end', padding: 5 }}>
                    <Button
                        mode="contained"
                        buttonColor={config.color.green}
                        style={{ marginBottom: 5 }}
                        onPress={async () => {
                            actionSheetTambahDurasiRef.current?.show();
                        }}
                        icon="plus"
                    >
                        Tambah Durasi
                    </Button>
                    <Button
                        mode="contained"
                        buttonColor={config.color.primery}
                        onPress={async () => {
                            navigation.navigate('SesiPertemuanSelesai', { id: ID_TRANSAKSI })
                        }}
                        icon="arrow-right"
                        disabled={btn_dsb_hentikan_sesi}
                    >
                        Hentikan sesi
                    </Button>
                </View>
            </View>
            <ActionSheet ref={actionSheetNotifRef}>
                <View style={{ height: heightSheet, padding: 10 }}>
                    <View style={{ alignItems: 'center', height: '100%', justifyContent: 'center' }}>
                        <Bell />
                        <Text style={{ marginTop: 20, fontWeight: 'bold' }}>Waktu sesi Berakhir</Text>
                    </View>
                </View>
            </ActionSheet>
            <ActionSheet ref={actionSheetConfirmRef}>
                <View style={{ height: heightSheet, padding: 10 }}>
                    <View style={{ alignItems: 'center', height: '70%' }}>
                        <MapSvg />
                        <Text style={{ marginTop: 20, fontWeight: 'bold' }}>Apakah anda telah sampai dilokasi pertemuan?</Text>

                    </View>
                    <View style={{ justifyContent: 'flex-end', height: '30%' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: '50%', paddingRight: 5 }}>
                                <Button
                                    mode="contained"
                                    buttonColor={config.color.abuabu}
                                    onPress={async () => {
                                        actionSheetConfirmRef.current?.hide();
                                    }}
                                    // disabled={dsb_bayar}
                                    disabled={false}
                                >
                                    Belum
                                </Button>
                            </View>
                            <View style={{ width: '50%', paddingLeft: 5 }}>
                                <Button
                                    mode="contained"
                                    buttonColor={config.color.primery}
                                    onPress={async () => {

                                        step2();
                                        setStatusSesi((state) => 'Sesi Sedang berlangsung')
                                        actionSheetConfirmRef.current?.hide();
                                    }}
                                    // disabled={dsb_bayar}
                                    disabled={false}
                                >
                                    Sudah
                                </Button>
                            </View>


                        </View>
                    </View>
                </View>
            </ActionSheet>
            {/* <ActionSheet backgroundInteractionEnabled={false} ref={actionSheetNambahDurasiRef}>
                <View style={{ height: heightSheet }}>
                    <View style={{ alignItems: 'center', height: '70%', justifyContent: 'center' }}>
                        <Avatar.Image size={72} source={require('../assets/profilfoto.png')} />
                        <Text style={{ marginTop: 5, fontWeight: 'bold', color: config.color.primery }}>{nama_siswa}</Text>
                        <Text style={{ marginTop: 5 }}>Ingin menambah durasi sesi pertemuan</Text>
                        <Text style={{ marginTop: 10, fontWeight: 'bold', fontSize: 30 }}>1 JAM</Text>
                    </View>
                    <View style={{ height: '30%', flexDirection: 'row', padding: 10 }}>
                        <View style={{ width: '50%', justifyContent: 'flex-end', padding: 5 }}>
                            <Button
                                mode="contained"
                                buttonColor={config.color.abuabu}
                                onPress={async () => {

                                }}
                                // icon="arrow-right"
                                // disabled={dsb_bayar}
                                disabled={false}
                            >
                                Tolak
                            </Button>

                        </View>
                        <View style={{ width: '50%', justifyContent: 'flex-end', padding: 5 }}>
                            <Button
                                mode="contained"
                                buttonColor={config.color.primery}
                                onPress={async () => {

                                }}
                                // icon="arrow-right"
                                // disabled={dsb_bayar}
                                disabled={false}
                            >
                                Terima
                            </Button>
                        </View>
                    </View>

                </View>
            </ActionSheet> */}
            <ActionSheet ref={actionSheetTambahDurasiRef} backgroundInteractionEnabled={false} >
                <View style={{ flexDirection: 'column', height: heightSheet }}>
                    <View style={{ height: '60%' }}>
                        <TambahDurasi getItem={getItemTambahDurasi} />
                    </View>
                    {/* <View style={{ height: '30%' }}>
                        <Text>Menabah durasi</Text>
                    </View> */}
                    <View style={{ height: '40%', flexDirection: 'row' }}>

                        <View style={{ width: '50%', justifyContent: 'flex-end', padding: 5 }}>
                            <Text style={{ fontWeight: 'bold' }}>Menabah durasi : {tambahDurasi} jam</Text>
                            <Button
                                mode="contained"
                                buttonColor={config.color.abuabu}
                                onPress={async () => {
                                    console.log('presss batal')
                                    actionSheetTambahDurasiRef.current?.hide();
                                }}
                                disabled={false}
                            >
                                batal
                            </Button>

                        </View>
                        <View style={{ width: '50%', justifyContent: 'flex-end', padding: 5 }}>
                            <Button
                                mode="contained"
                                buttonColor={config.color.primery}
                                onPress={async () => {
                                    setDurasiTambahan((state) => tambahDurasi)
                                }}
                                disabled={false}
                            >
                                Terima
                            </Button>
                        </View>
                    </View>
                </View>
            </ActionSheet>
        </View>
    )
}

export default DetailPertemuanMentor