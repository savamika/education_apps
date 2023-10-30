import React, { useState, useCallback, useRef, useEffect } from 'react'
import { RefreshControl, Button, useWindowDimensions, TouchableOpacity, View, Text, ScrollView, SafeAreaView, StatusBar, Dimensions, StyleSheet, Image, ImageBackground, Alert } from 'react-native';
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
import { useForm, Controller } from "react-hook-form";
import DocumentPicker, { types } from 'react-native-document-picker';
import KotaList from '../mentorScreen/KotaList';
import KecamatanList from '../mentorScreen/KecamatanList';
import DesaList from '../mentorScreen/DesaList';
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
import Geolocation from '@react-native-community/geolocation'

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

const ProfileDataDiri = ({ route, navigation }) => {
    var USER_ID;
    const BASE_URL = useSelector((state) => state.counter.BASE_URL)
    const DATA_USER = route.params.data_user;
    const [NAME, setNAME] = useState('');
    const [spinnervisible, setSpinnervisible] = useState(false);
    const alert_requert = <Text style={{ color: 'red' }}>{String.text.REQUIRED}</Text>;
    const [colorL, setColorL] = useState(config.color.primery);
    const [colorP, setColorP] = useState(config.color.abuabu);
    const [editable, setEditable] = useState(true);
    const height = Dimensions.get('window').height;
    const heightSheet = (height / 2) - 50;
    const dispatch = useDispatch();
    const [longitude, setLongitude] = useState(0)
    const [latitude, setLatitude] = useState(0)

    const [visible, setVisible] = React.useState(false);
    const [bgvisible, setBgvisible] = React.useState('');
    const onToggleSnackBar = () => setVisible(!visible);
    const onDismissSnackBar = () => setVisible(false);
    const [message, setMessage] = React.useState('');

    const _getLocation = () => {
        Geolocation.getCurrentPosition(
            (pos) => {
                console.log('pos.longitude', pos.coords.longitude)
                console.log('pos.latitude', pos.coords.latitude)
                setLongitude((state) => pos.coords.longitude)
                setLatitude((state) => pos.coords.latitude)

            },
            (error) => Alert.alert('GetCurrentPosition Error', JSON.stringify(error)),
            { enableHighAccuracy: true }
        );
    }

    const getDesaKelurahan = (item) => {
        // Function for click on an item
        setValue('sub_district', item.title);
        actionSheetDesaKelurahanRef.current?.hide()
        trigger('sub_district')
    };

    const getKecamatan = (item) => {
        // Function for click on an item

        setValue('district', item.title);
        actionSheetKecamatanRef.current?.hide()
        trigger('district')
    };

    const getKota = (item) => {
        // Function for click on an item

        setValue('city', item.title);
        actionSheetKotaRef.current?.hide()
        trigger('city')
    };

    const { trigger, getValues, setValue, control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            id: DATA_USER.id,
            username: DATA_USER.username,
            firstname: DATA_USER.firstname,
            lastname: DATA_USER.lastname,
            email: DATA_USER.email,
            gender: DATA_USER.gender,
            picture: DATA_USER.picture,
            file_cv: DATA_USER.file_cv,
            district: DATA_USER.district,
            sub_district: DATA_USER.sub_district,
            city: DATA_USER.city,
            address: DATA_USER.address,
            latitude: DATA_USER.latitude,
            longitude: DATA_USER.longitude,
            skill: DATA_USER.skill,
            sub_skill: DATA_USER.sub_skill,
            service_rate: DATA_USER.service_rate, //hourly, monthly
            service_fee: DATA_USER.service_fee,
            about_mentor: DATA_USER.about_mentor
        }
    });

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

    const actionSheetDesaKelurahanRef = useRef();
    const actionSheetKecamatanRef = useRef();
    const actionSheetKotaRef = useRef();

    const _set_data = async () => {
        let USER_IDX = await AsyncStorage.getItem('USER_ID')
        USER_ID = USER_IDX;
        setValue('id', USER_IDX); //default

        if (DATA_USER.gender == 'female') {
            setColorP(config.color.primery)
            setColorL(config.color.abuabu)
            setValue('gender', 'female');
            setGender('female')
        } else {
            setColorL(config.color.primery)
            setColorP(config.color.abuabu)
            setValue('gender', 'male');
            setGender('male')
        }


        let last = DATA_USER.lastname == null ? '' : DATA_USER.lastname;
        let fullname = DATA_USER.firstname + ' ' + last
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

    const setGenderProfile = (gender) => {
        setGender((state) => gender)
        if (gender == 'male') {
            setColorL(config.color.primery)
            setColorP(config.color.abuabu)
            setValue('gender', 'male');
        } else {
            setColorP(config.color.primery)
            setColorL(config.color.abuabu)
            setValue('gender', 'female');
        }
    }



    const goBack = (navigation) => {
        console.log('back');
        // navigation.goBack()
        navigation.navigate('BottomNavigation')
    }

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
                let rs = response.data[0];

                let firstname = getValues("firstname");
                let lastname = getValues("lastname");
                setNAME((state) => firstname + ' ' + lastname)

                dispatch(updateAPIFindUser(data))
                await AsyncStorage.setItem('USERDATA', data);

                _set_edit();
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

    const onSubmit = async data => {
        setSpinnervisible(true);


        if (USER_ID == '') {
            return false;
        }
        const body_data = new FormData()
        let _imgava
        let _cvpdf
        try {
            _imgava = avaImg[0]
        } catch (error) {

        }
        try {
            _cvpdf = cvPdf[0]
        } catch (error) {

        }

        body_data.append('id', data.id);
        body_data.append('firstname', data.firstname);
        body_data.append('lastname', data.lastname);
        body_data.append('username', data.username);
        body_data.append('email', DATA_USER.email);
        body_data.append('gender', data.gender);
        if (typeof _imgava == 'undefined') {
            // body_data.append('picture', '-');
        } else {
            body_data.append('picture', _imgava);
        }
        // body_data.append('file_cv', '');
        body_data.append('district', data.district);
        body_data.append('sub_district', data.sub_district);
        body_data.append('city', data.city);
        body_data.append('address', data.address);
        body_data.append('latitude', latitude);
        body_data.append('longitude', longitude);
        // body_data.append('skill', '');
        // body_data.append('sub_skill', '');
        // body_data.append('service_fee', '');
        // body_data.append('service_rate', '');
        // body_data.append('about_mentor', '');
        console.log('data', body_data)



        await axios
            .put(BASE_URL + '/users/update/' + data.id,
                // {
                //     id: data.id,
                //     firstname: data.firstname,
                //     lastname: data.lastname,
                //     username: data.username,
                //     email: DATA_USER.email,
                //     gender: data.gender,
                //     district: data.district,
                //     sub_district: data.sub_district,
                //     city: data.city,
                //     address: data.address,
                //     latitude: latitude,
                //     longitude: longitude
                // }
                body_data
                ,
                {
                    timeout: 1000 * 30, //30 detik
                    headers: {
                        // 'Content-Type': 'application/json'
                        "Content-Type": "multipart/form-data",
                    },
                }
            )
            .then(async function (response) {
                // handle success
                console.log('response.data', response.data)
                let rs = response.data;
                if (!rs.error) {
                    _findUser(data.id)
                    setBgvisible(config.color.green)
                    setMessage(rs.message);
                    setVisible(true)
                } else {

                }



            })
            .catch(function (error) {
                // handle error
                console.log('error', error);
                // alert(error)
                setBgvisible(config.color.black)
                setMessage(String.text.ALERT_KONEKSI);
                setVisible(true);
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


    _set_edit = () => {
        if (editable) {
            setEditable((e) => false);
        } else {
            setEditable((e) => true);
        }
    }

    useEffect(() => {
        _getLocation();
        _set_data();
    }, [])

    return (
        <View style={{ height: '100%', backgroundColor: config.color.white }}>
            <ScrollView>
                <Spinner visible={spinnervisible} />
                <Appbar.Header style={{ elevation: 5 }}>
                    <Appbar.BackAction onPress={() => { goBack(navigation) }} />
                    <Appbar.Content title="Profil" mode='small' titleStyle={{ fontSize: 14, fontWeight: 'bold' }} />
                </Appbar.Header>
                <View style={{ padding: 10 }}>
                    <View>
                        <View style={{ backgroundColor: config.color.white, flexDirection: 'row' }}>
                            <View style={{ flex: 4, alignItems: 'center' }}>

                                <Avatar.Icon size={100} icon="camera" style={{ display: display_camera_ava }} />
                                <Avatar.Image size={100} source={{ uri: uri_img }} style={{ display: display_pic_ava }} />

                                <TouchableOpacity onPress={handleDocumentSelection}>
                                    <Text style={{ color: config.color.link, display: editable == true ? 'none' : 'flex' }}>ubah foto</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 8 }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{NAME}</Text>
                                <Text style={{ fontSize: 12, marginTop: 2 }}>{gender}</Text>
                            </View>
                        </View>

                        <Card style={style.Card}>
                            <Card.Content>
                                <View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={[{ flex: 1 }, style.judul]}>Username</Text>
                                        <View style={{ alignItems: 'flex-end', flex: 1 }}>
                                            <TouchableOpacity onPress={(e) => {
                                                _set_edit()
                                            }}>
                                                <FontAwesome size={15} name='pencil-square-o' />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View>
                                        <Controller
                                            control={control}
                                            rules={{
                                                required: true,
                                            }}
                                            render={({ field: { onChange, onBlur, value } }) => (

                                                <TextInput
                                                    mode="outlined"
                                                    // label="Username"
                                                    placeholder="input here"
                                                    value={value}
                                                    onChangeText={onChange}
                                                    onBlur={onBlur}
                                                    disabled={editable}
                                                />
                                            )}
                                            name="username"
                                        />
                                        {errors.username && alert_requert}
                                    </View>
                                </View>
                                <View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={[{ flex: 1 }, style.judul]}>Firstname</Text>
                                        <View style={{ alignItems: 'flex-end', flex: 1 }}>
                                        </View>
                                    </View>
                                    <View>
                                        <Controller
                                            control={control}
                                            rules={{
                                                required: true,
                                            }}
                                            render={({ field: { onChange, onBlur, value } }) => (

                                                <TextInput
                                                    mode="outlined"
                                                    // label="Username"
                                                    placeholder="input here"
                                                    value={value}
                                                    onChangeText={onChange}
                                                    onBlur={onBlur}
                                                    disabled={editable}
                                                />
                                            )}
                                            name="firstname"
                                        />
                                        {errors.firstname && alert_requert}
                                    </View>
                                </View>
                                <View style={{ marginTop: 5 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={[{ flex: 1 }, style.judul]}>Lastname  </Text>
                                    </View>
                                    <View>
                                        <Controller
                                            control={control}
                                            rules={{
                                                required: true,
                                            }}
                                            render={({ field: { onChange, onBlur, value } }) => (

                                                <TextInput
                                                    mode="outlined"
                                                    // label="Username"
                                                    placeholder="input here"
                                                    value={value}
                                                    onChangeText={onChange}
                                                    onBlur={onBlur}
                                                    disabled={editable}
                                                />
                                            )}
                                            name="lastname"
                                        />
                                        {errors.lastname && alert_requert}
                                    </View>
                                </View>
                                <View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={[{ flex: 1 }, style.judul]}>Gender</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={[{ width: "45%", margin: 5, backgroundColor: "#E6E6E6" }]}>
                                            <Button
                                                onPress={() => { setGenderProfile('male') }}
                                                title="Laki-laki"
                                                color={colorL}
                                                disabled={editable}
                                            />
                                        </View>
                                        <View style={[{ width: "45%", margin: 5, backgroundColor: "#E6E6E6" }]}>
                                            <Button
                                                onPress={() => { setGenderProfile('female') }}
                                                title="Perempuan"
                                                color={colorP}
                                                disabled={editable}
                                            />
                                        </View>
                                    </View>
                                </View>
                                <View style={{ marginTop: 5 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={[{ flex: 1 }, style.judul]}>Kota/Kabupaten</Text>
                                    </View>
                                    <View>
                                        <Controller
                                            control={control}
                                            rules={{
                                                required: true,
                                            }}
                                            render={({ field: { onChange, onBlur, value } }) => (

                                                <TextInput
                                                    mode="outlined"
                                                    // label="Username"
                                                    placeholder="input here"
                                                    value={value}
                                                    onChangeText={onChange}
                                                    onBlur={onBlur}
                                                    disabled={editable}
                                                    showSoftInputOnFocus={false}
                                                    onPressIn={() => { actionSheetKotaRef.current?.show(); }}
                                                />
                                            )}
                                            name="city"
                                        />
                                        {errors.city && alert_requert}
                                    </View>
                                </View>
                                <View style={{ marginTop: 5 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={[{ flex: 1 }, style.judul]}>Kecamatan</Text>
                                    </View>
                                    <View>
                                        <Controller
                                            control={control}
                                            rules={{
                                                required: true,
                                            }}
                                            render={({ field: { onChange, onBlur, value } }) => (

                                                <TextInput
                                                    mode="outlined"
                                                    // label="Username"
                                                    placeholder="input here"
                                                    value={value}
                                                    onChangeText={onChange}
                                                    onBlur={onBlur}
                                                    disabled={editable}
                                                    showSoftInputOnFocus={false}
                                                    onPressIn={() => { actionSheetKecamatanRef.current?.show(); }}
                                                />
                                            )}
                                            name="district"
                                        />
                                        {errors.district && alert_requert}
                                    </View>
                                </View>
                                <View style={{ marginTop: 5 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={[{ flex: 1 }, style.judul]}>Desa/Kelurahan</Text>
                                    </View>
                                    <View>
                                        <Controller
                                            control={control}
                                            rules={{
                                                required: true,
                                            }}
                                            render={({ field: { onChange, onBlur, value } }) => (

                                                <TextInput
                                                    mode="outlined"
                                                    // label="Username"
                                                    placeholder="input here"
                                                    value={value}
                                                    onChangeText={onChange}
                                                    onBlur={onBlur}
                                                    disabled={editable}
                                                    showSoftInputOnFocus={false}
                                                    onPressIn={() => { actionSheetDesaKelurahanRef.current?.show(); }}
                                                />
                                            )}
                                            name="sub_district"
                                        />
                                        {errors.sub_district && alert_requert}
                                    </View>
                                </View>
                                <View style={{ marginTop: 5 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={[{ flex: 1 }, style.judul]}>Alamat</Text>
                                    </View>
                                    <View>
                                        <Controller
                                            control={control}
                                            rules={{
                                                required: true,
                                            }}
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <TextInput
                                                    mode="outlined"
                                                    placeholder="input here"
                                                    value={value}
                                                    onChangeText={onChange}
                                                    onBlur={onBlur}
                                                    multiline
                                                    numberOfLines={4}
                                                    disabled={editable}

                                                />
                                            )}
                                            name="address"
                                        />
                                        {errors.address && alert_requert}
                                    </View>
                                    <Text>{latitude},{longitude}</Text>
                                </View>


                            </Card.Content>
                        </Card>
                        <ActionSheet ref={actionSheetDesaKelurahanRef}>
                            <View style={{ height: heightSheet }}>
                                <DesaList getItem={getDesaKelurahan} />
                            </View>
                        </ActionSheet>
                        <ActionSheet ref={actionSheetKecamatanRef}>
                            <View style={{ height: heightSheet }}>
                                <KecamatanList getItem={getKecamatan} />
                            </View>
                        </ActionSheet>
                        <ActionSheet ref={actionSheetKotaRef}>
                            <View style={{ height: heightSheet }}>
                                <KotaList getItem={getKota} />
                            </View>
                        </ActionSheet>
                    </View>
                </View>
            </ScrollView >
            <View style={{ elevation: 10, height: '10%', padding: 10 }}>
                <Btn
                    mode="contained"
                    buttonColor={config.color.primery}
                    onPress={
                        handleSubmit(onSubmit)
                    }
                    icon="arrow-right"
                    disabled={editable}
                >
                    Simpan</Btn>
            </View>
            <Snackbar
                visible={visible}
                duration={3000}
                onDismiss={onDismissSnackBar}
                style={{ backgroundColor: bgvisible }}
                action={{
                    label: 'ok',
                    labelStyle: { color: 'white' },
                    onPress: () => {
                        // Do something
                    },
                }}>
                {message}
            </Snackbar>
        </View >
    )
}

export default ProfileDataDiri