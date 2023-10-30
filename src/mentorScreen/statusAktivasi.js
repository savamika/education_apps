import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text } from 'react-native';
import { Appbar, TextInput, Button as Btn, Avatar, Card, Title, Snackbar } from 'react-native-paper';
import * as common_config from '../common/config'
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

const StatusAktivasi = ({ navigation }) => {
    const [USER_ID, setUSER_ID] = useState('');
    const BASE_URL = useSelector((state) => state.counter.BASE_URL)

    const dispatch = useDispatch();

    const [visibleNotif, setVisibleNotif] = useState(false);
    const [spinnervisible, setSpinnervisible] = useState(false);
    const [messageNotif, setMessageNotif] = useState(false);

    const onToggleSnackBar = () => setVisibleNotif(!visible);
    const onDismissSnackBar = () => setVisibleNotif(false);

    const _findUser = async (id) => {
        setSpinnervisible(true);

        console.log(BASE_URL + '/getuser/' + id);
        await axios
            .get(BASE_URL + '/getuser/' + id, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(async function (response) {
                // handle success
                let data = JSON.stringify(response.data[0]);
                dispatch(updateAPIFindUser(data))

                dispatch(updateAPILogin(data));
                dispatch(updateUSER_ID(response.data[0].id));
                dispatch(updateIS_VERIF(response.data[0].is_verified));
                dispatch(updateLevel(response.data[0].is_user));
                dispatch(updateFIST_NAME(response.data[0].firstname));
                dispatch(updateLAST_NAME(response.data[0].lastname));
                dispatch(updateUSERNAME(response.data[0].username));
                dispatch(updateEMAIL(response.data[0].email));
                dispatch(updateALAMAT(response.data[0].address));

                await AsyncStorage.setItem('USERDATA', data);
                setTimeout(() => {
                    navigation.navigate('HomeMentor');
                }, 500);


            })
            .catch(function (error) {
                // handle error
                setMessageNotif(String.text.ALERT_KONEKSI);
                setVisibleNotif(true);
                console.log('error', error);
                setSpinnervisible(false);
            })
            .finally(() => {
                //complates
                setSpinnervisible(false);
            });
    }

    const _set_data = async () => {
        let USER_IDX = await AsyncStorage.getItem('USER_ID')
        setUSER_ID((e) => USER_IDX)
    }

    useEffect(() => {
        _set_data();
    })

    return (
        <View style={{
            backgroundColor: common_config.color.primery2,
            height: '100%',
            padding: 10
        }}>
            <Spinner visible={spinnervisible} />

            <View style={{
                justifyContent: 'center',
                flex: 8
            }}>

                <View style={{ flexDirection: 'column', alignContent: 'center', justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
                    <Logo />
                </View>
                <View style={{ alignContent: 'center', justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
                    <Text style={{ fontSize: 32, color: 'white', fontWeight: 'bold' }}> BERHASIL!</Text>
                </View>
                <View style={{ alignContent: 'center', justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
                    <Text style={{ fontSize: 12, color: 'white' }}> Aktifasi akun sedang kami proses paling lambat 48 jam kerja.</Text>
                </View>

            </View>
            <View style={{ flex: 4, flexDirection: 'row', paddingBottom: 15 }}>
                <View style={{ alignSelf: 'flex-end', width: '100%' }}>
                    <Btn
                        mode="outlined"
                        icon="arrow-right"
                        buttonColor='white'
                        onPress={async () => {
                            _findUser(USER_ID)

                        }}
                    >
                        lanjut</Btn>
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

export default StatusAktivasi;