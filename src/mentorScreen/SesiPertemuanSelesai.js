import React, { useState, useCallback, useRef, useEffect } from 'react'
import { RefreshControl, useWindowDimensions, TouchableOpacity, View, Text, ScrollView, SafeAreaView, StatusBar, Dimensions, StyleSheet, Image, ImageBackground } from 'react-native';
import { Button, Badge, Appbar, TextInput, Avatar, Card, Title, Paragraph, Dialog, Chip, Searchbar, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as  config from '../common/config'
import ActionSheet from "react-native-actions-sheet";
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import ShowNotif from '../common/showNotification';
import * as String from '../common/String'
import { useSelector, useDispatch } from 'react-redux';
import Centang_ijo from '../assets/centang_ijo.svg';

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
        fontSize: 16
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

const SesiPertemuanSelesai = ({ route, navigation }) => {
    const BASE_URL = useSelector((state) => state.counter.BASE_URL)
    const ID_TRANSAKSI = route.params.id;
    const [spinnervisible, setSpinnervisible] = useState(false);

    const [nama_siswa, setNama_siswa] = useState('');
    const [request_time, setRequest_time] = useState('');
    const [lokasi_pertemuan, setLokasi_pertemuan] = useState('');

    const [jenis_transaksi, setJenis_transaksi] = useState('Bayar ditempat');
    const [no_transaksi, setNo_transaksi] = useState('');
    const [durasi, setDurasi] = useState('');
    const [durasiTambahan, setDurasiTambahan] = useState('0 jam');
    const [totalPembayaran, setTotalPembayaran] = useState('');


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
                console.log('rs', rs)
                if (!rs.error) {
                    let data = rs.data[0];
                    let packet_method = data.packet_method;

                    setNama_siswa((e) => data.siswa_name)
                    setLokasi_pertemuan((e) => data.address)
                    setNo_transaksi((e) => data.trn_number)
                    setDurasi((e) => data.duration + ' jam')
                    setTotalPembayaran((e) => data.total_payment)

                    let req_date = new Date(data.booking_date)



                    let only_req_year = req_date.getFullYear();
                    let only_req_month = req_date.getMonth() + 1;
                    let only_req_date = req_date.getDate();

                    let tmp_m = only_req_month < 10 ? '0' + only_req_month : only_req_month;
                    let tmp_d = only_req_date < 10 ? '0' + only_req_date : only_req_date;
                    let ymd = only_req_year + '-' + tmp_m + '-' + tmp_d;
                    ymd = config.beauty_date(ymd);


                    var time_start = new Date(only_req_year + '-' + only_req_month + '-' + only_req_date + ' ' + data.req_start);
                    var time_end = new Date(only_req_year + '-' + only_req_month + '-' + only_req_date + ' ' + data.req_end);

                    let tmp_time_start = time_start.getHours() + ':' + time_start.getMinutes()
                    let tmp_time_end = time_end.getHours() + ':' + time_end.getMinutes()

                    let fulldate = ymd + ', ' + tmp_time_start + ' - ' + tmp_time_end + ' ( ' + data.duration + ' jam)';
                    setRequest_time((e) => fulldate)

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

    const goBack = (navigation) => {
        console.log('back');
        navigation.goBack()
    }
    useEffect(() => {
        _gettransaction(ID_TRANSAKSI)
    }, [])
    return (
        <View style={{ height: '100%', backgroundColor: config.color.white }}>
            <Spinner visible={spinnervisible} />
            <View style={{ height: '80%' }}>
                <Appbar.Header style={{ elevation: 1 }}>
                    <Appbar.BackAction onPress={() => { goBack(navigation) }} />
                    <Appbar.Content title="Sesi Pertemuan Selesai" mode='small' titleStyle={{ fontSize: 14, fontWeight: 'bold' }} />
                </Appbar.Header>
                <View style={{ padding: 10 }}>
                    <View>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Centang_ijo />
                            <View>
                                <Text style={[style.style5, { textAlign: 'center' }]}>Sesi telah selesai</Text>
                                <Text style={{ textAlign: 'center' }}>Pastikan materi tersampaikan dengan baik</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ borderWidth: 1, borderRadius: 2, borderColor: config.color.abuabu, marginTop: 20 }}>
                        <View style={{ padding: 10 }}>
                            <Text style={style.style3}>Jadwal Pertemuan</Text>
                        </View>
                        <View style={{ padding: 10, borderBottomWidth: 1, borderColor: config.color.abuabu }}>
                            <Text style={style.style4}>Jadwal Permintaan Pertemuan:</Text>
                            <Text style={style.style5}>{nama_siswa}</Text>
                            <Text style={style.style5}>{request_time}</Text>
                        </View>
                        <View>
                            <View style={{ marginTop: 10, marginBottom: 10, padding: 10 }}>

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
                                        <Text style={{ fontWeight: 'bold' }}>{durasiTambahan}</Text>
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
                        </View>
                    </View>


                </View>
            </View>
            <View style={{ height: '20%', flexDirection: 'row', padding: 10 }}>
                <View style={{ width: '100%', justifyContent: 'flex-end', padding: 5 }}>
                    <Button
                        mode="contained"
                        buttonColor={config.color.primery}
                        onPress={async () => {
                            navigation.navigate('DetailPembayaranMentor', { id: ID_TRANSAKSI })
                        }}
                        icon="arrow-right"
                        disabled={false}
                    >
                        Konfirmasi
                    </Button>

                </View>
            </View>
        </View>
    )
}

export default SesiPertemuanSelesai;