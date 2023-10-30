import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, SafeAreaView, Dimensions, StyleSheet, PermissionsAndroid, TouchableOpacity } from 'react-native';
import { Appbar, TextInput, Button, Snackbar, Card, Title, Paragraph } from 'react-native-paper';
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
import axios from 'axios';
import Spinner from '../common/Spinner';
import ShowNotif from '../common/showNotification';
import * as String from '../common/String'
import { config } from '@fortawesome/fontawesome-svg-core';
import * as common_config from '../common/config'
import Logo from '../assets/login.svg';

const style = StyleSheet.create({
    text: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'white'
    }
})

const ForgetPassword = ({ navigation }) => {
    const BASE_URL = useSelector((state) => state.counter.BASE_URL)
    const [email, setEmail] = useState('');
    const [spinnervisible, setSpinnervisible] = useState(false);
    const [message, serMessage] = useState('');
    const [txt_color, setTxt_color] = useState('white');

    const goBack = (navigation) => {
        console.log('back');
        navigation.goBack()
    }

    const changeEmail = (txt) => {
        setEmail((state) => txt)
    }

    const _submit = async () => {
        if (email == '') {
            setTxt_color(() => 'red');
            serMessage('masukan email anda');
            return false;
        }

        setSpinnervisible(true);
        let param = {
            email: email
        }
        await axios
            .post(BASE_URL + '/users/forgot',
                param,
                {
                    timeout: 1000 * 30 //30 detik
                }
            )
            .then(async function (response) {
                // handle success
                var data = JSON.stringify(response.data);
                console.log('data----------', data)
                var rs = response.data;
                // console.log('data', data);
                if (!rs.error) {
                    setTxt_color(() => 'white');
                    serMessage(rs.message);
                } else {

                }


                setSpinnervisible(false);
            })
            .catch(function (error) {
                // handle error
                // console.log('String', String);
                console.log('error', error);

                setSpinnervisible(false);
            })
            .finally(() => {
                //complates
                setSpinnervisible(false);
            });
    }



    return (
        <View style={{ height: '100%', backgroundColor: common_config.color.primery2 }}>
            <Spinner visible={spinnervisible} />
            <View>
                <Appbar.BackAction color='white' onPress={() => { goBack(navigation) }} />
            </View>
            <View style={{ padding: 10 }}>
                <Text style={style.text}>Lupa</Text>
                <Text style={style.text}>Password?</Text>

                <TextInput
                    focusable={true}
                    mode="outlined"
                    label="Email"
                    placeholder="input here"
                    value={email}
                    onChangeText={text => changeEmail(text)}
                    textColor='white'
                    style={{ backgroundColor: common_config.color.primery2 }}
                    outlineColor='white'
                    activeOutlineColor='white'
                    placeholderTextColor='white'
                    theme={{
                        colors: {
                            label: 'white'
                        },
                    }}
                    colors='white'
                />
                <Text style={{ color: txt_color }}>{message}</Text>
                <Button mode="contained" onPress={() => _submit()} buttonColor={common_config.color.gold} icon="arrow-right" style={{ marginTop: 10 }}>Submit</Button>
            </View>
        </View>
    )
}

export default ForgetPassword