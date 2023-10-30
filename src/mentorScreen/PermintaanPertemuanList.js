import React, { useEffect, useState, useCallback } from 'react'
import { View, StyleSheet, Text, StatusBar, FlatList, TouchableOpacity, RefreshControl, SafeAreaView } from 'react-native';
import { Appbar, TextInput, Button as Btn, Avatar, Card, Title, Snackbar } from 'react-native-paper';
import * as config from '../common/config'
import Logo from '../assets/pesawat.svg'
import axios from 'axios';
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
import Spinner from '../common/Spinner';

const PermintaanPertemuanList = ({ navigation }) => {
    var USER_ID;
    const BASE_URL = useSelector((state) => state.counter.BASE_URL)
    const [refreshing, setRefreshing] = useState(false);
    const [DATA_TRANSACTION_LIST, setDATA_TRANSACTION_LIST] = useState([]);

    const dispatch = useDispatch();

    const [visibleNotif, setVisibleNotif] = useState(false);
    const [spinnervisible, setSpinnervisible] = useState(false);
    const [messageNotif, setMessageNotif] = useState(false);

    const onToggleSnackBar = () => setVisibleNotif(!visible);
    const onDismissSnackBar = () => setVisibleNotif(false);

    const _set_data = async () => {
        let USER_IDX = await AsyncStorage.getItem('USER_ID')
        // setUSER_ID((e) => USER_IDX)
        // setUSER_ID(USER_IDX)
        USER_ID = USER_IDX;
        console.log('USER_IDX', USER_IDX);


    }

    const onRefresh = useCallback(() => {
        setRefreshing((e) => true);

        _getListTransaction();

    }, []);

    const _getListTransaction = async () => {
        console.log(BASE_URL + '/gettransaction/' + USER_ID);

        // let URL = BASE_URL + '/gettransaction/' + USER_ID;
        let URL = BASE_URL + '/gettransaction/' + USER_ID;
        await axios
            .get(URL, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(async function (response) {
                // handle success
                // console.log('res', response.data.data)
                let rs = response.data;
                let data_list = response.data.data;
                if (!rs.error) {
                    setDATA_TRANSACTION_LIST((state) => data_list)
                }
            })
            .catch(function (error) {
                // handle error
                console.log('error', error);
                setRefreshing(false);
            })
            .finally(() => {
                //complates
                setTimeout(() => {
                    setRefreshing((e) => false);
                }, 500);
            });
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
                console.log('rsXXXXXXXX', rs)
                if (!rs.error) {
                    let data = rs.data[0];
                    setSpinnervisible((state) => false);
                    if (data.status == 'WAITING') {
                        navigation.navigate('PermintaanPertemuan', { data: data })
                    }
                    else if (data.status == 'ACCEPT') {
                        navigation.navigate('DetailPertemuanMentor', { id: data.id })
                    }
                    else if (data.status == 'COMPLETED') {

                    }
                    else {
                        navigation.navigate('DetailPertemuanMentor', { id: data.id })
                    }
                }
            })
            .catch(function (error) {
                // handle error
                console.log('error', error);
                setSpinnervisible(false);
                setRefreshing((e) => true);
            })
            .finally(() => {
                //complates
                // setSpinnervisible(false);
            });
    }

    const Item = ({ data }) => {
        let booking_date = data.booking_date;
        let btdate = data.request_time;
        let dt_booking;

        let tmp_date = new Date(btdate);
        let tmp_m = tmp_date.getMonth() + 1;
        tmp_m = tmp_m < 10 ? '0' + tmp_m.toString() : tmp_m.toString()
        let dt = tmp_date.getFullYear() + '-' + tmp_m + '-' + tmp_date.getDate();

        if (booking_date != '0000-00-00') {
            let tmp_booking_date = new Date(booking_date);
            let tmp_booking_date_m = tmp_booking_date.getMonth() + 1;
            tmp_booking_date_m = tmp_booking_date_m < 10 ? '0' + tmp_booking_date_m.toString() : tmp_booking_date_m.toString()
            dt_booking = tmp_booking_date.getFullYear() + '-' + tmp_booking_date_m + '-' + tmp_booking_date.getDate();
            dt_booking = config.beauty_date(dt_booking)

        } else if (booking_date == '0000-00-00') {
            dt_booking = 'INVALID DATE'
        }


        let tmp_booking_ = config.beauty_date(dt)
        let tmp_time_ = tmp_date.getHours() + ':' + tmp_date.getMinutes();
        // console.log('tmp_date', tmp_date)
        // console.log('tmp_time_', tmp_date.getHours())
        let start_time
        let end_time
        try {
            let tmp_req_start = data.req_start.split(':')
            start_time = tmp_req_start[0] + ":" + tmp_req_start[1]
            let tmp_end_time = data.req_end.split(':')
            end_time = tmp_end_time[0] + ":" + tmp_end_time[1]
        } catch (error) {

        }
        let status
        let colorStatus
        try {
            status = data.status
            if (status == 'COMPLETED') {
                colorStatus = config.color.green
            }
            else if (status == 'DECLINE') {
                colorStatus = config.color.red
            }
            else if (status == 'WAITING') {
                colorStatus = config.color.primery
            }
            else if (status == 'ACCEPT') {
                colorStatus = config.color.yellow
            }

        } catch (error) {

        }
        return (

            <TouchableOpacity activeOpacity={0.7} delayPressIn={700} onPressIn={() => {
                if (data.status == 'COMPLETED') {

                } else {
                    setSpinnervisible((state) => true);
                    _gettransaction(data.id)
                }
            }}>
                <View key={data.id} style={{ marginTop: 5, marginBottom: 5 }}>
                    <Card style={{ height: 130, backgroundColor: 'white' }}>
                        <Card.Content style={{ height: '100%', width: '100%' }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{ flex: 3, alignItems: 'center' }}>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{start_time}</Text>
                                    <Text style={{ fontSize: 10, color: config.color.abuabu }}>START</Text>
                                </View>
                                <View style={{ flex: 6, alignItems: 'center' }}>
                                    <Text style={{ color: colorStatus, fontWeight: 'bold' }}>{status}</Text>

                                    <Text style={{ fontSize: 12 }}>{data.siswa_name}</Text>
                                    {/* <Text style={{ fontSize: 10 }}>Matematika</Text> */}
                                    <Text style={{ fontSize: 12 }}>{data.packet_method}</Text>
                                </View>
                                <View style={{ flex: 3, alignItems: 'center' }}>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{end_time}</Text>
                                    <Text style={{ fontSize: 10, color: config.color.abuabu }}>END</Text>
                                </View>
                            </View>
                            <View style={{ borderTopWidth: 2, borderStyle: 'dotted', borderTopColor: config.color.abuabu, flexDirection: "row" }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 10, fontWeight: 'bold' }}>Request time</Text>
                                    {/* <Text style={{ fontSize: 10 }}>{booking_date}</Text> */}
                                    <Text style={{ fontSize: 10, display: data.packet_method == 'REGULAR' ? 'none' : 'flex' }}>{dt_booking}</Text>
                                    <Text style={{ fontSize: 10 }}>{data.days}</Text>

                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ alignSelf: 'flex-end', justifyContent: 'flex-end', fontSize: 9 }}>KODE BOOKING : {data.trn_number}</Text>
                                    <Text style={{ alignSelf: 'flex-end', justifyContent: 'flex-end', fontSize: 9 }}>{tmp_booking_} - {tmp_time_}</Text>
                                    {/* <Text style={{ alignSelf: 'flex-end', justifyContent: 'flex-end', fontSize: 9 }}></Text> */}
                                </View>
                            </View>
                        </Card.Content>
                    </Card>
                </View>
            </TouchableOpacity>

        )
    };

    const goBack = (navigation) => {
        console.log('back');
        navigation.goBack()
    }

    useEffect(() => {
        _set_data().then((s) => {

            setTimeout(() => {
                onRefresh();
            }, 500);
        });
    }, [])

    return (
        <View style={{ height: '100%' }}>

            <Appbar.Header style={{ elevation: 5 }}>
                <Appbar.BackAction onPress={() => { goBack(navigation) }} />
                <Appbar.Content title="Booking List" mode='small' titleStyle={{ fontSize: 14, fontWeight: 'bold' }} />
            </Appbar.Header>
            <Spinner visible={spinnervisible} />
            <View style={{ padding: 10, paddingBottom: 70 }}>
                <SafeAreaView>
                    <FlatList
                        data={DATA_TRANSACTION_LIST}
                        renderItem={({ item }) => <Item data={item} />}
                        keyExtractor={item => item.id}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                    // style={{ paddingBottom: 100 }}
                    />
                </SafeAreaView>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 32,
    },
});

export default PermintaanPertemuanList;