import React, { useState, useCallback, useRef, useEffect } from 'react'
import { RefreshControl, Button, useWindowDimensions, TouchableOpacity, View, Text, ScrollView, SafeAreaView, StatusBar, Dimensions, StyleSheet, Image, ImageBackground } from 'react-native';
import { Button as Btn, Appbar, TextInput, Avatar, Card, Title, Paragraph, Dialog, Chip, Searchbar, Snackbar } from 'react-native-paper';
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

import DocumentPicker, { types } from 'react-native-document-picker';
import { useFocusEffect } from '@react-navigation/native';

const style = StyleSheet.create({
    Card: {
        backgroundColor: config.color.white,
        marginTop: 5
    },
    judul: {
        fontWeight: 'bold',
        fontSize: 14,
        color: config.color.primery2
    },
    paddingCard: {

    }
})

const Profile = ({ route, navigation }) => {

    const DATA_USER = route.params.data_user;
    const [NAME, setNAME] = useState('Loading...');

    const [gender, setGender] = useState(DATA_USER.gender)
    const [uri_img, setUri_img] = useState(DATA_USER.picture)
    const [noHp, setNoHp] = useState(DATA_USER.phone_number)
    const [keahlian, setKeahlian] = useState(DATA_USER.skill)
    const [alamat, setAlamat] = useState(DATA_USER.address)
    const [tentangMentor, setTentangMentor] = useState(DATA_USER.about_mentor)
    const [harga, setHarga] = useState(DATA_USER.service_fee)
    const [cv, setCv] = useState(DATA_USER.file_cv)
    const [display_camera_ava, setDisplay_camera_ava] = useState('flex');
    const [display_pic_ava, setDisplay_pic_ava] = useState('none');

    const [btnSimpan, setBtnSimpan] = useState(true);

    const [avaImg, setAvaImg] = useState([]);

    const [cvPdf, setCvPdf] = useState([]);
    const [namacvPdf, setNamaCvPdf] = useState('');
    const [warnaBgPdf, setWarnaBgPdf] = useState(config.color.primery)

    const _set_data = () => {
        let fullname = DATA_USER.firstname + ' ' + DATA_USER.lastname == null ? '' : DATA_USER.lastname
        if (fullname == '' || fullname == null) {
            fullname = DATA_USER.email
        }
        setNAME((e) => fullname)

        if (uri_img == '' || uri_img == null) {
            setDisplay_camera_ava(() => 'flex')
            setDisplay_pic_ava(() => 'none')
        } else {
            setDisplay_camera_ava(() => 'none')
            setDisplay_pic_ava(() => 'flex')
        }

        if (DATA_USER.is_verified == 'NEW' || DATA_USER.is_verified == 'WAITING') {
            setBtnSimpan((s) => true)
        } else {
            setBtnSimpan((s) => false)
        }
    }



    const goBack = (navigation) => {
        console.log('back');
        navigation.goBack()
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
                let data = JSON.stringify(response.data[0]);
                dispatch(updateAPIFindUser(data))
                await AsyncStorage.setItem('USERDATA', data);

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

    const handleDocumentSelection = useCallback(async () => {
        try {
            const response = await DocumentPicker.pick({
                presentationStyle: 'fullScreen',
                type: [types.images]
            });
            setAvaImg(response);
            console.log('img', response)
            setUri_img((state) => response[0].uri)

            setDisplay_camera_ava((state) => 'none');
            setDisplay_pic_ava((state) => 'flex');

        } catch (err) {
            console.log(err);
        }
    }, []);

    const handleDocumentSelectionCV = useCallback(async () => {
        try {
            const response = await DocumentPicker.pick({
                presentationStyle: 'fullScreen',
                type: [types.pdf]
            });
            setCvPdf(response);
            setNamaCvPdf(response[0].name)
            setWarnaBgPdf(config.color.green)
            console.log('pdf', response)

        } catch (err) {
            console.log(err);
        }
    }, []);


    useEffect(() => {
        _set_data();
    })
    useFocusEffect(() => {
        _setData()
    })

    return (
        <View style={{ height: '100%', backgroundColor: config.color.white }}>
            <ScrollView>
                <Appbar.Header style={{ elevation: 5 }}>
                    <Appbar.BackAction onPress={() => { goBack(navigation) }} />
                    <Appbar.Content title="Profil" mode='small' titleStyle={{ fontSize: 14, fontWeight: 'bold' }} />
                </Appbar.Header>
                <View style={{ padding: 10 }}>
                    <View>
                        <View style={{ backgroundColor: config.color.white, flexDirection: 'row' }}>
                            <View style={{ flex: 4, alignItems: 'center' }}>
                                {/* <Avatar.Image size={100} source={{ uri: 'https://cdns.klimg.com/bola.net/library/upload/21/2022/07/645x430/casillas-1_712888b.jpg' }} /> */}
                                <TouchableOpacity onPress={handleDocumentSelection}>
                                    <Avatar.Icon size={100} icon="camera" style={{ display: display_camera_ava }} />
                                    <Avatar.Image size={100} source={{ uri: uri_img }} style={{ display: display_pic_ava }} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 8 }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{NAME}</Text>
                                <Text style={{ fontSize: 12, marginTop: 2 }}>{gender}</Text>
                                {/* <Chip style={{ backgroundColor: config.color.yellow2, width: 110, marginTop: 2 }} textStyle={{ fontSize: 11, color: config.color.white, alignSelf: 'center' }}>
                                    <Icon name='check-bold' color="white"></Icon>
                                    Terferifikasi
                                </Chip > */}
                                {/* <Chip style={{ backgroundColor: config.color.abuabu, marginTop: 2, width: 150 }} textStyle={{ fontSize: 11, color: config.color.black, alignSelf: 'center' }}>
                                    belum verifikasi
                                </Chip > */}
                                <View style={{ backgroundColor: config.color.abuabu, marginTop: 2, width: 150, padding: 5, borderRadius: 20 }}>
                                    <Text style={{ textAlign: 'center' }}>belum verifikasi</Text>
                                </View>
                            </View>
                        </View>

                        <Card style={style.Card}>
                            <Card.Content>
                                <View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={[{ flex: 1 }, style.judul]}>Kontak</Text>
                                        <View style={{ alignItems: 'flex-end', flex: 1 }}>
                                            <FontAwesome size={15} name='pencil-square-o' />
                                        </View>
                                    </View>
                                    <View>
                                        <Text >{noHp}</Text>
                                    </View>

                                </View>
                            </Card.Content>
                        </Card>
                        <Card style={style.Card}>
                            <Card.Content >
                                <View >
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={style.judul}>Keahlian</Text>
                                        <View style={{ alignItems: 'flex-end', flex: 1 }}>
                                            <FontAwesome size={15} name='pencil-square-o' />
                                        </View>
                                    </View>
                                    <View>
                                        <Text >{keahlian}</Text>
                                    </View>

                                </View>
                            </Card.Content>
                        </Card>
                        <Card style={style.Card}>
                            <Card.Content >
                                <View >
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={style.judul}>Alamat Asal</Text>
                                        <View style={{ alignItems: 'flex-end', flex: 1 }}>
                                            <FontAwesome size={15} name='pencil-square-o' />
                                        </View>
                                    </View>
                                    <View>
                                        <Text >{alamat}</Text>
                                    </View>

                                </View>
                            </Card.Content>
                        </Card>
                        <Card style={style.Card}>
                            <Card.Content >
                                <View >
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={style.judul}>Tentang Kamu</Text>
                                        <View style={{ alignItems: 'flex-end', flex: 1 }}>
                                            <FontAwesome size={15} name='pencil-square-o' />
                                        </View>
                                    </View>
                                    <View>
                                        <Text >{tentangMentor}</Text>
                                    </View>

                                </View>
                            </Card.Content>
                        </Card>
                        <Card style={style.Card}>
                            <Card.Content >
                                <View >
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={style.judul}>Rate Harga</Text>
                                        <View style={{ alignItems: 'flex-end', flex: 1 }}>
                                            <FontAwesome size={15} name='pencil-square-o' />
                                        </View>
                                    </View>
                                    <View>
                                        <Text >{harga}</Text>
                                    </View>

                                </View>
                            </Card.Content>
                        </Card>
                        <Card style={style.Card}>
                            <Card.Content >
                                <View >
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={style.judul}>CV anda</Text>
                                        <View style={{ alignItems: 'flex-end', flex: 1 }}>
                                            <FontAwesome size={15} name='pencil-square-o' />
                                        </View>
                                    </View>
                                    <View>
                                        <Text >{cv}</Text>
                                    </View>

                                </View>
                            </Card.Content>
                        </Card>

                    </View>
                </View>
            </ScrollView >
            <View style={{ elevation: 10, height: '10%', padding: 10 }}>
                <Btn
                    mode="contained"
                    buttonColor={config.color.primery}
                    onPress={async () => {

                    }}
                    icon="arrow-right"
                    disabled={btnSimpan}
                >
                    Simpan</Btn>
            </View>
        </View >
    )
}

export default Profile