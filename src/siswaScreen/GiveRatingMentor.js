import React, { useState, useCallback, useRef, useEffect } from 'react'
import { RefreshControl, Button, useWindowDimensions, TouchableOpacity, View, Text, ScrollView, SafeAreaView, StatusBar, Dimensions, StyleSheet, Image, ImageBackground } from 'react-native';
import { Button as Btn, Badge, Appbar, TextInput, Avatar, Card, Title, Paragraph, Dialog, Chip, Searchbar, Snackbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import * as  config from '../common/config'
import * as String from '../common/String'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from '../common/Spinner';

const style = StyleSheet.create({
    viewImg: {
        backgroundColor: config.color.primery2,
        padding: 10,
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textPertanyaan: {
        fontSize: 16,
        fontWeight: 'bold',
        color: config.color.white,
        paddingTop: 10
    },
    textInfo: {
        fontSize: 12,
        color: config.color.white,
        paddingTop: 2
    }
})

const GiveRatingMentor = ({ route, navigation }) => {
    const [USER_ID, setUSER_ID] = useState('');
    const [DATA_MENTOR, setDATA_MENTOR] = useState(route.params.DATA_MENTOR);

    const [visibleNotif, setVisibleNotif] = useState(false);
    const [spinnervisible, setSpinnervisible] = useState(false);
    const [messageNotif, setMessageNotif] = useState(false);

    const BASE_URL = useSelector((state) => state.counter.BASE_URL)

    const onDismissSnackBar = () => setVisibleNotif(false);

    let full_name = DATA_MENTOR.firstname + ' ' + DATA_MENTOR.lastname
    const [namaMentor, setNamaMentor] = useState(full_name);
    const [color1, setColor1] = useState(config.color.abuabu);
    const [color2, setColor2] = useState(config.color.abuabu);
    const [color3, setColor3] = useState(config.color.abuabu);
    const [color4, setColor4] = useState(config.color.abuabu);
    const [color5, setColor5] = useState(config.color.abuabu);
    const [rating, setRating] = useState(0);
    const width = Dimensions.get('window').width;
    const btnBottom = (width) - 10;

    const _setAsyncStorage = async () => {
        let USER_IDX = await AsyncStorage.getItem('USER_ID')
        setUSER_ID((e) => USER_IDX)
    }

    const setStar1 = (color) => {
        setColor1((e) => color)
    }
    const setStar2 = (color) => {
        setColor2((e) => color)

    }
    const setStar3 = (color) => {
        setColor3((e) => color)
    }
    const setStar4 = (color) => {
        setColor4((e) => color)
    }
    const setStar5 = (color) => {
        setColor5((e) => color)
    }

    const onSetStart = (level) => {
        console.log('press', level)
        setRating((e) => level)
        if (level == 1) {
            setStar1(config.color.gold)
            setStar2(config.color.abuabu)
            setStar3(config.color.abuabu)
            setStar4(config.color.abuabu)
            setStar5(config.color.abuabu)

        }
        else if (level == 2) {
            setStar1(config.color.gold)
            setStar2(config.color.gold)
            setStar3(config.color.abuabu)
            setStar4(config.color.abuabu)
            setStar5(config.color.abuabu)
        }
        else if (level == 3) {
            setStar1(config.color.gold)
            setStar2(config.color.gold)
            setStar3(config.color.gold)
            setStar4(config.color.abuabu)
            setStar5(config.color.abuabu)
        }
        else if (level == 4) {
            setStar1(config.color.gold)
            setStar2(config.color.gold)
            setStar3(config.color.gold)
            setStar4(config.color.gold)
            setStar5(config.color.abuabu)
        }
        else if (level == 5) {
            setStar1(config.color.gold)
            setStar2(config.color.gold)
            setStar3(config.color.gold)
            setStar4(config.color.gold)
            setStar5(config.color.gold)
        }
    }

    const goBack = (navigation) => {
        console.log('back');
        navigation.goBack()
    }

    const saveRating = async () => {
        setSpinnervisible(true);

        let param = {
            user_id: USER_ID,
            mentor_id: DATA_MENTOR.id,
            rating: rating
        }

        console.log('param', param)
        await axios
            .post(BASE_URL + '/mentor/giverating',
                param,
                {
                    timeout: 1000 * 30 //30 detik
                }
            )
            .then(async function (response) {
                // handle success
                var rs = response.data;
                console.log('data', rs);
                if (!rs.error) {
                    navigation.navigate('BottomNavigation')
                } else {
                    setMessageNotif(String.text.NO_RESULT);
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

    useEffect((e) => {
        _setAsyncStorage()
    }, [])

    return (
        <View style={{ height: '100%' }}>
            <Spinner visible={spinnervisible} />
            <View>
                <StatusBar backgroundColor={config.color.primery2} />
                <Appbar.Header style={{ backgroundColor: config.color.primery2 }}>
                    <Appbar.BackAction color={config.color.white} onPress={() => { goBack(navigation) }} />
                </Appbar.Header>
            </View>
            <View style={style.viewImg}>
                <Avatar.Image size={200} source={{ uri: DATA_MENTOR.picture }} />
                <View style={{ alignItems: 'center' }}>
                    <Text style={style.textPertanyaan}>
                        Apakah sesi mentoring memuaskan?
                    </Text>
                    <Text style={style.textInfo}>Pembelajaran privat anda telah selesai</Text>
                </View>
            </View>
            <View style={{ padding: 10 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Beri Rating:</Text>
            </View>
            <View style={{ justifyContent: 'center', flexDirection: 'row', paddingTop: 30 }}>
                <View style={{ marginRight: 15 }} onTouchStart={() => { onSetStart(1) }}><FontAwesome name='star' size={30} color={color1} /></View>
                <View style={{ marginRight: 15 }} onTouchStart={() => { onSetStart(2) }}><FontAwesome name='star' size={30} color={color2} /></View>
                <View style={{ marginRight: 15 }} onTouchStart={() => { onSetStart(3) }}><FontAwesome name='star' size={30} color={color3} /></View>
                <View style={{ marginRight: 15 }} onTouchStart={() => { onSetStart(4) }}><FontAwesome name='star' size={30} color={color4} /></View>
                <View style={{ marginRight: 15 }} onTouchStart={() => { onSetStart(5) }}><FontAwesome name='star' size={30} color={color5} /></View>
            </View>
            <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', paddingTop: 10 }}>{namaMentor}</Text>
            </View>
            <View style={{ padding: 10, flex: 1, justifyContent: 'flex-end' }}>
                <Btn
                    mode="contained"
                    buttonColor={config.color.primery}
                    onPress={async () => {
                        saveRating();
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

export default GiveRatingMentor