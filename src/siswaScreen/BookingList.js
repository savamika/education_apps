import React, { useState, useCallback, useEffect, useRef } from 'react'
import { RefreshControl, TouchableOpacity, View, Text, ScrollView, SafeAreaView, StatusBar, Dimensions, StyleSheet, Image, FlatList } from 'react-native';
import { ActivityIndicator, Appbar, Button, Avatar, Card, Chip, Title, Paragraph, Dialog, Searchbar, TextInput } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import * as String from '../common/String'
import * as Config from '../common/config'
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import axios from 'axios';
import ActionSheet from "react-native-actions-sheet";
import CalendarPicker from 'react-native-calendar-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const style = StyleSheet.create({
    disabled: {
        fontSize: 10,
        color: Config.color.abuabu,
        paddingLeft: 10
    },
    hubungiStyle: {
        backgroundColor: Config.color.abuabu,
        borderRadius: 5,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        height: '50%',
        activeOpacity: 1
    },
    profileStyle: {
        backgroundColor: Config.color.primery2,
        borderRadius: 5,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        height: '50%'
    }
})


const BookingList = ({ navigation }) => {
    var USER_ID;
    const BASE_URL = useSelector((state) => state.counter.BASE_URL)
    const [html, setHtml] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [waiting, setWaiting] = useState(true);
    // const [USER_ID, setUSER_ID] = useState('');
    const [DATA_TRANSACTION_LIST, setDATA_TRANSACTION_LIST] = useState([]);
    const _setAsyncStorage = async () => {
        let USER_IDX = await AsyncStorage.getItem('USER_ID')
        USER_ID = USER_IDX
    }

    var tmp_arr = [];

    const onRefresh = useCallback(() => {
        setRefreshing((e) => true);

        _setListData();
    }, []);

    const _setListData = async () => {

        console.log(BASE_URL + '/gettransaction/' + USER_ID)
        await axios
            .get(BASE_URL + '/gettransaction/' + USER_ID,
                {
                    timeout: 1000 * 30 //30 detik
                }
            )
            .then(async function (response) {
                // handle success
                var data = JSON.stringify(response.data);
                // console.log('data', data)
                var rs = response.data;
                if (!rs.error) {
                    let data_list = response.data.data;

                    setDATA_TRANSACTION_LIST((state) => data_list)
                } else {

                }


            })
            .catch(function (error) {
                // handle error
            })
            .finally(() => {
                //complates
                setTimeout(() => {
                    setRefreshing((e) => false);
                }, 1000);
            });
    }

    const Item = ({ data }) => {
        let btdate = data.booking_date;
        let tmp_booking_

        if (btdate != '0000-00-00') {
            let tmp_date = new Date(btdate);
            let tmp_m = tmp_date.getMonth() + 1;
            tmp_m = tmp_m < 10 ? '0' + tmp_m.toString() : tmp_m.toString()
            let dt = tmp_date.getFullYear() + '-' + tmp_m + '-' + tmp_date.getDate();
            tmp_booking_ = Config.beauty_date(dt)
        } else {
            tmp_booking_ = 'INVALID DATE'
        }

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
                colorStatus = Config.color.green
            }
            else if (status == 'DECLINE') {
                colorStatus = Config.color.red
            }
            else if (status == 'WAITING') {
                colorStatus = Config.color.primery
            }
            else if (status == 'ACCEPT') {
                colorStatus = Config.color.yellow
            }

        } catch (error) {

        }
        return (

            <TouchableOpacity activeOpacity={0.7} delayPressIn={700} onPress={() => {
                if (data.status == 'WAITING' || data.status == 'ACCEPT') {
                    navigation.navigate('DetailPertemuan', { BOOKING_ID: data.id })
                } else {
                    // navigation.navigate('DetailPertemuanMentor', { data: data })
                }
            }}>
                <View key={data.id} style={{ marginTop: 5 }}>
                    <Card style={{ height: 130, backgroundColor: 'white' }}>
                        <Card.Content style={{ height: '100%', width: '100%' }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{ flex: 3, alignItems: 'center' }}>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{start_time}</Text>
                                    <Text style={{ fontSize: 10, color: Config.color.abuabu }}>START</Text>
                                </View>
                                <View style={{ flex: 6, alignItems: 'center' }}>
                                    <Text style={{ color: colorStatus, fontWeight: 'bold' }}>{status}</Text>

                                    {/* <Text style={{ fontSize: 12 }}>{data.siswa_name}</Text> */}
                                    {/* <Text style={{ fontSize: 10 }}>Matematika</Text> */}
                                    <Text style={{ fontSize: 12 }}>{data.packet_method}</Text>
                                </View>
                                <View style={{ flex: 3, alignItems: 'center' }}>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{end_time}</Text>
                                    <Text style={{ fontSize: 10, color: Config.color.abuabu }}>END</Text>
                                </View>
                            </View>
                            <View style={{ borderTopWidth: 2, borderStyle: 'dotted', borderTopColor: Config.color.abuabu, flexDirection: "row" }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 10, fontWeight: 'bold' }}>Request time</Text>
                                    <Text style={{ fontSize: 10, display: data.packet_method == 'REGULAR' ? 'none' : 'flex' }}>{tmp_booking_}</Text>
                                    <Text style={{ fontSize: 10 }}>{data.days}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ alignSelf: 'flex-end', justifyContent: 'flex-end', fontSize: 9 }}>KODE BOOKING : {data.trn_number}</Text>
                                </View>
                            </View>
                        </Card.Content>
                    </Card>
                </View>
            </TouchableOpacity>

        )
    };

    useEffect(() => {
        _setAsyncStorage().then(() => {
            setTimeout(() => {
                onRefresh();
            }, 500);
        });

    }, [])

    return (
        <View>
            <Appbar.Header style={{ elevation: 5 }}>
                <Appbar.Content title="Booking List" mode='small' titleStyle={{ fontSize: 14, fontWeight: 'bold' }} />
            </Appbar.Header>
            <SafeAreaView style={{ padding: 10 }}>
                {/* <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }>
                    <ActivityIndicator color={Config.color.primery} animating={waiting} /> */}
                {/* {html} */}
                {/* </ScrollView> */}

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
                />
            </SafeAreaView>

        </View>
    )
}

export default BookingList