import React, { useState, useCallback, useRef, useEffect } from 'react'
import { RefreshControl, Button, useWindowDimensions, TouchableOpacity, View, Text, ScrollView, SafeAreaView, StatusBar, Dimensions, StyleSheet, Image, ImageBackground } from 'react-native';
import { Button as Btn, Badge, Appbar, TextInput, Avatar, Card, Title, Paragraph, Dialog, Chip, Searchbar, Snackbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import * as  config from '../common/config'
import * as String from '../common/String'
import ActionSheet from "react-native-actions-sheet";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from '../common/Spinner'
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';

import DetailPembayaranSvg from '../assets/detailPembayaran.svg';

const style = StyleSheet.create({
    viewTop: {
        width: "100%",
        borderWidth: 1,
        borderColor: config.color.abuabu,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    viewlogo: {
        alignItems: 'center',
        borderBottomWidth: 1,
        borderStyle: 'dotted',
        width: '100%',
        borderColor: config.color.abuabu,
        padding: 30
    },
    viewDetail: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: config.color.abuabu
    },
    textRight: {
        alignSelf: 'flex-end',
        fontSize: 12,
        fontWeight: 'bold',
        paddingTop: 10
    },
    textLeft: {
        fontSize: 12,
        paddingTop: 10
    }
})

const DetailPembayaran = ({ route, navigation }) => {

    const [DATA_BILLING, setDATA_BILLING] = useState(route.params.DATA_BILLING);
    const [DATA_MENTOR, setDATA_MENTOR] = useState(route.params.DATA_MENTOR);
    const BASE_URL = useSelector((state) => state.counter.BASE_URL)
    const [metodePembayaran, setMetodePembayaran] = useState('Bayar ditempat')
    const [atasNama, setAtasNama] = useState(DATA_BILLING.siswa_name)
    const [kepada, setKepada] = useState(DATA_BILLING.mentor_name)
    const [noTransaksi, setNoTransaksi] = useState(DATA_BILLING.trn_number)
    const [durasi, setDurasi] = useState(DATA_BILLING.duration)
    const [durasiTambahan, setDurasiTambahan] = useState(DATA_BILLING.additional_duration)
    const [totalBayar, setTotalBayar] = useState(DATA_BILLING.total)

    const [visibleNotif, setVisibleNotif] = useState(false);
    const [spinnervisible, setSpinnervisible] = useState(false);
    const [messageNotif, setMessageNotif] = useState(false);

    const onDismissSnackBar = () => setVisibleNotif(false);

    const width = Dimensions.get('window').width;
    const btnBottom = (width) - 10;
    const goBack = (navigation) => {
        console.log('back');
        navigation.goBack()
    }

    const _konfirmasi = async () => {
        setSpinnervisible((e) => true)
        let param = {
            status: "PAID"
        }

        await axios
            .put(BASE_URL + '/paymentconfirm/trxnumber/' + noTransaksi,
                param,
                {
                    timeout: 1000 * 30 //30 detik
                }
            )
            .then(async function (response) {
                // handle success
                var rs = response.data;

                if (!rs.error) {

                    navigation.navigate('GiveRatingMentor', { DATA_MENTOR: DATA_MENTOR })
                } else {
                    setMessageNotif(String.text.ALERT_KONEKSI);
                    setVisibleNotif(true);
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
    }


    useEffect(() => {

    }, [])

    return (
        <View style={{ flex: 1, height: '100%', backgroundColor: config.color.white }}>
            <ScrollView>
                <View>
                    <Spinner visible={spinnervisible} />
                    <StatusBar backgroundColor={config.color.primery} />
                    <Appbar.Header style={{ backgroundColor: config.color.white }}>
                        <Appbar.BackAction onPress={() => { goBack(navigation) }} />
                        <Appbar.Content titleStyle={{ fontSize: 14, fontWeight: 'bold' }} mode='small' title="Detail Pembayaran" />
                    </Appbar.Header>
                </View>
                <SafeAreaView style={{ padding: 10 }}>

                    <View style={style.viewTop}>
                        <View style={style.viewlogo}>
                            <DetailPembayaranSvg />
                        </View>
                        <View style={{ padding: 10 }}>
                            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Detail Transaksi</Text>
                        </View>
                        <View style={style.viewDetail}>
                            <View style={[{ flex: 6 }]}>
                                <Text style={style.textLeft}>Jenis Transaksi</Text>
                                <Text style={style.textLeft}>Atas Nama</Text>
                                <Text style={style.textLeft}>Kepada</Text>
                                <Text style={style.textLeft}>No. Transaksi</Text>
                                <Text style={style.textLeft}>Durasi</Text>
                                <Text style={style.textLeft}>Durasi Tambahan</Text>
                            </View>
                            <View style={{ flex: 6 }}>
                                <Text style={style.textRight}>{metodePembayaran}</Text>
                                <Text style={style.textRight}>{atasNama}</Text>
                                <Text style={style.textRight}>{kepada}</Text>
                                <Text style={style.textRight}>{noTransaksi}</Text>
                                <Text style={style.textRight}>{durasi} Jam</Text>
                                <Text style={style.textRight}>{durasiTambahan} Jam</Text>
                            </View>

                        </View>
                        <View style={{ flexDirection: 'row', padding: 10 }}>
                            <View style={{ flex: 6 }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: config.color.primery }}>Total</Text>
                            </View>
                            <View style={{ flex: 6 }}>
                                <Text style={{ alignSelf: 'flex-end', fontSize: 16, fontWeight: 'bold', color: config.color.primery }}>RP. {config.formatRupiah(totalBayar)}</Text>
                            </View>
                        </View>
                    </View>

                </SafeAreaView>
            </ScrollView>
            <View style={{ padding: 10 }}>
                <Btn
                    mode="contained"
                    buttonColor={config.color.primery}
                    style={{ width: btnBottom }}
                    onPress={async () => {
                        _konfirmasi()
                    }}
                    icon="arrow-right"
                >
                    Konfirmasi Pembayaran</Btn>
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

export default DetailPembayaran