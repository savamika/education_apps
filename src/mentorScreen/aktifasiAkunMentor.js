import React, { useState, useEffect, useRef, useCallback } from 'react'
import { View, StyleSheet, Button, Text, ScrollView, Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';
import { Appbar, TextInput, Button as Btn, Avatar, Card, Title, Paragraph, Snackbar } from 'react-native-paper';
import * as config from '../common/config'
import * as String from '../common/String'
import Spinner from '../common/Spinner';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import {
    updateIS_VERIF,
    updateFIST_NAME
} from '../store/CounterSlice'
import ActionSheet from "react-native-actions-sheet";

import DesaList from './DesaList';
import KecamatanList from './KecamatanList';
import KotaList from './KotaList';
import ServiceRateList from './ServiceRateList';
import DocumentPicker, { types } from 'react-native-document-picker';
import { useForm, Controller } from "react-hook-form";
import AsyncStorage from '@react-native-async-storage/async-storage';

const style = StyleSheet.create({
    rowCenter: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: 'center',
        padding: 10
    },
    detailPengguna: {
        fontWeight: 'bold'
    }
})


const AktifasiAkunMentor = ({ navigation }) => {
    var USER_ID;
    const BASE_URL = useSelector((state) => state.counter.BASE_URL)
    const alert_requert = <Text style={{ color: 'red' }}>{String.text.REQUIRED}</Text>;
    const dispatch = useDispatch();

    const [colorL, setColorL] = useState(config.color.primery);
    const [colorP, setColorP] = useState(config.color.abuabu);

    const [gender, setGender] = useState('L');
    const [username, setUsername] = useState('');
    const [nama, setNama] = useState('');
    const [email, setEmail] = useState(useSelector((state) => state.counter.EMAIL));
    const [keahlian, setKeahlian] = useState('');
    const [subkeahlian, setSubkeahlian] = useState('');
    const [avaImg, setAvaImg] = useState([]);

    const [cvPdf, setCvPdf] = useState([]);
    const [namacvPdf, setNamaCvPdf] = useState('');
    const [warnaBgPdf, setWarnaBgPdf] = useState(config.color.primery)

    const [uri_img, setUri_img] = useState('empty');
    const [display_camera_ava, setDisplay_camera_ava] = useState('flex');
    const [display_pic_ava, setDisplay_pic_ava] = useState('none');

    const [desa, setDesa] = useState('');
    const [displayDesa, setDisplayDesa] = useState('');

    const [kota, setKota] = useState('');
    const [displayKota, setDisplayKota] = useState('');

    const [kecamatan, setKecamatan] = useState('');
    const [displayKecamatan, setDisplayKecamatan] = useState('');

    const [about, setAbout] = useState('');
    const [service_fee, setService_fee] = useState('');

    const [bgvisible, setBgvisible] = useState('');


    const [serviceRate, setServiceRate] = useState('');
    const [displayServiceRate, setDisplayServiceRate] = useState('');

    const [alamat, setAlamat] = useState('');
    const [spinnervisible, setSpinnervisible] = useState(false);

    const [visibleNotif, setVisibleNotif] = useState(true);
    const [messageNotif, setMessageNotif] = useState(false);

    const actionSheetDesaKelurahanRef = useRef();
    const actionSheetKecamatanRef = useRef();
    const actionSheetKotaRef = useRef();
    const actionSheetServiceRateRef = useRef();

    const elm_laki = useRef();
    const elm_perempuan = useRef();



    const { trigger, setValue, control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            id: USER_ID,
            username: 'toni',
            firstname: 'toni',
            lastname: 'kroos',
            email: email,
            gender: 'Male',
            picture: '',
            file_cv: '',
            district: 'jagarska',
            sub_district: 'durentiga',
            city: 'jakarta selatan',
            address: 'jerman',
            latitude: '0',
            longitude: '0',
            skill: 'bola',
            sub_skill: 'gelandang',
            service_rate: 'hourly', //hourly, monthly
            service_fee: '85000',
            about_mentor: 'kreativ'
        }
    });



    const getDesaKelurahan = (item) => {
        // Function for click on an item

        setDesa((e) => item.title)
        setValue('sub_district', item.title);
        setDisplayDesa((e) => item.title)
        actionSheetDesaKelurahanRef.current?.hide()
        trigger('sub_district')
    };

    const getKecamatan = (item) => {
        // Function for click on an item

        setKecamatan((e) => item.title)
        setValue('district', item.title);
        setDisplayKecamatan((e) => item.title)
        actionSheetKecamatanRef.current?.hide()
        trigger('district')
    };

    const getKota = (item) => {
        // Function for click on an item

        setKota((e) => item.title)
        setValue('city', item.title);
        setDisplayKota((e) => item.title)
        actionSheetKotaRef.current?.hide()
        trigger('city')
    };

    const getServiceRate = (item) => {
        // Function for click on an item
        setServiceRate((e) => item.title)
        setValue('service_rate', item.title);
        setDisplayServiceRate((e) => item.title)
        actionSheetServiceRateRef.current?.hide()
        trigger('service_rate')
    };

    const width = Dimensions.get('window').width;
    const widthHari = (width / 3) - 20;
    const widthMetodePembayaran = (width / 2) - 10;
    const height = Dimensions.get('window').height;
    const heightSheet = (height / 2) - 50;


    const onDismissSnackBar = () => setVisibleNotif(false);



    const _set_data = async () => {
        let USER_IDX = await AsyncStorage.getItem('USER_ID')
        USER_ID = USER_IDX;
        console.log('USER_IDX', USER_IDX)
        setValue('gender', 'male'); //default
        setValue('id', USER_IDX); //default
    }



    const goBack = (navigation) => {
        console.log('back');
        navigation.goBack()
    }

    const setPage = (gender) => {
        setGender((state) => gender)
        if (gender == 'L') {
            setColorL(config.color.primery)
            setColorP(config.color.abuabu)
            setValue('gender', 'male');
        } else {
            setColorP(config.color.primery)
            setColorL(config.color.abuabu)
            setValue('gender', 'female');
        }
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

            setValue('picture', response[0]);
            trigger('picture')

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

            setValue('file_cv', response[0]);
            console.log('pdf', response)
            trigger('file_cv')

        } catch (err) {
            console.log(err);
        }
    }, []);

    const onError = (errors, e) => console.log(errors, e);
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
        body_data.append('email', data.email);
        body_data.append('gender', data.gender);
        body_data.append('picture', _imgava);
        body_data.append('file_cv', _cvpdf);
        body_data.append('district', data.district);
        body_data.append('sub_district', data.sub_district);
        body_data.append('city', data.city);
        body_data.append('address', data.address);
        body_data.append('latitude', 0);
        body_data.append('longitude', 0);
        body_data.append('skill', data.skill);
        body_data.append('sub_skill', data.sub_skill);
        body_data.append('service_fee', data.service_fee);
        body_data.append('service_rate', data.service_rate);
        body_data.append('about_mentor', data.about_mentor);

        console.log(BASE_URL + '/users/activation', body_data)

        // return false;
        await axios
            .post(BASE_URL + '/users/activation',
                body_data,
                {
                    timeout: 1000 * 30, //30 detik
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            )
            .then(function (response) {
                // handle success
                var data = JSON.stringify(response.data);
                console.log('data----------', data)
                var rs = response.data;
                console.log('data', data);
                if (!rs.error) {
                    dispatch(updateFIST_NAME(username));
                    dispatch(updateIS_VERIF(rs.data.is_verified));
                    setMessageNotif(rs.message)
                    setBgvisible(config.color.green)
                    setVisibleNotif((state) => true)
                    setTimeout(() => {
                        navigation.navigate('StatusAktivasi')

                    }, 200);
                } else {
                    setMessageNotif(rs.message)
                    setBgvisible(config.color.black)
                    setVisibleNotif((state) => true)
                }


                setSpinnervisible(false);
            })
            .catch(function (error) {
                // handle error
                console.log('error xx', error.message);
                setMessageNotif(error.message)
                setBgvisible(config.color.black)
                setVisibleNotif((state) => true)
                setSpinnervisible(false);
            })
            .finally(() => {
                //complates
                setSpinnervisible(false);
            });

    };


    console.log('USER_ID', USER_ID);
    useEffect(() => {
        _set_data();
    }, [])

    return (
        <View style={{ height: '100%' }}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => { goBack(navigation) }} />
                <Appbar.Content title="Aktifasi Akun" mode='small' titleStyle={{ fontSize: 14 }} />

            </Appbar.Header>
            <SafeAreaView style={{ marginTop: 10 }}>
                <ScrollView contentContainerStyle={{}}>
                    <Spinner visible={spinnervisible} />
                    <View style={{ backgroundColor: 'white', padding: 10, paddingBottom: 150 }}>
                        <View style={style.rowCenter}>
                            <TouchableOpacity onPress={handleDocumentSelection}>
                                <Avatar.Icon size={100} icon="camera" style={{ display: display_camera_ava }} />
                                <Avatar.Image size={100} source={{ uri: uri_img }} style={{ display: display_pic_ava }} />
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) =>
                                    (
                                        <></>
                                    )}
                                    name="picture"
                                />
                                {errors.picture && alert_requert}
                            </TouchableOpacity>
                            {/* <Button title="Select 📑" onPress={handleDocumentSelection} /> */}
                        </View>
                        <View>
                            <Text style={style.detailPengguna}>Detail Pengguna</Text>
                        </View>
                        <View style={style.rowCenter}>
                            {/* <Avatar.Image size={24} source={require('../assets/avatar.png')} /> */}

                            <View style={[{ width: "50%", margin: 5, backgroundColor: "#E6E6E6" }]}>
                                <Button
                                    onPress={() => { setPage('L') }}
                                    title="Laki-laki"
                                    color={colorL}
                                    ref={elm_laki}
                                />
                            </View>
                            <View style={[{ width: "50%", margin: 5, backgroundColor: "#E6E6E6" }]}>
                                <Button
                                    onPress={() => { setPage('P') }}
                                    title="Perempuan"
                                    color={colorP}
                                    ref={elm_perempuan}
                                />
                            </View>

                        </View>
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (

                                <TextInput
                                    mode="outlined"
                                    label="Username"
                                    placeholder="input here"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                // right={<TextInput.Affix text="/100" />}
                                />
                            )}
                            name="username"
                        />
                        {errors.username && alert_requert}

                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (

                                <TextInput
                                    mode="outlined"
                                    label="Firstname"
                                    placeholder="input here"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                // right={<TextInput.Affix text="/100" />}
                                />
                            )}
                            name="firstname"
                        />
                        {errors.firstname && alert_requert}

                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (

                                <TextInput
                                    mode="outlined"
                                    label="Lastname"
                                    placeholder="input here"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                // right={<TextInput.Affix text="/100" />}
                                />
                            )}
                            name="lastname"
                        />
                        {errors.lastname && alert_requert}

                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    mode="outlined"
                                    label="Email"
                                    placeholder="input here"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    disabled
                                />
                            )}
                            name="email"
                        />
                        {errors.email && alert_requert}

                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    mode="outlined"
                                    label="Keahlian"
                                    placeholder="input here"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                />
                            )}
                            name="skill"
                        />
                        {errors.skill && alert_requert}

                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    mode="outlined"
                                    label="subkeahlian"
                                    placeholder="input here"
                                    value={value}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                />
                            )}
                            name="sub_skill"
                        />
                        {errors.sub_skill && alert_requert}


                        <View style={{ marginTop: 35 }}>
                            <Text style={style.detailPengguna}>Alamat Asal</Text>
                        </View>

                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    mode="outlined"
                                    label="Kota/Kabupaten"
                                    placeholder="input here"
                                    showSoftInputOnFocus={false}
                                    onPressIn={() => { actionSheetKotaRef.current?.show(); }}
                                    value={displayKota}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                />
                            )}
                            name="city"
                        />
                        {errors.city && alert_requert}

                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    mode="outlined"
                                    label="Kecamatan"
                                    placeholder="input here"
                                    showSoftInputOnFocus={false}
                                    onPressIn={() => { actionSheetKecamatanRef.current?.show(); }}
                                    value={displayKecamatan}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                />
                            )}
                            name="district"
                        />
                        {errors.district && alert_requert}



                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (

                                <TextInput
                                    mode="outlined"
                                    label="Desa/Kelurahan"
                                    placeholder="input here"
                                    showSoftInputOnFocus={false}
                                    onPressIn={() => { actionSheetDesaKelurahanRef.current?.show(); }}
                                    value={displayDesa}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                />

                            )}
                            name="sub_district"
                        />
                        {errors.sub_district && alert_requert}


                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    mode="outlined"
                                    label="alamat"
                                    placeholder="input here"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    multiline
                                    numberOfLines={4}

                                />
                            )}
                            name="address"
                        />
                        {errors.address && alert_requert}


                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    mode="outlined"
                                    label="Service Rate"
                                    placeholder="input here"
                                    showSoftInputOnFocus={false}
                                    value={displayServiceRate}
                                    onPressIn={() => { actionSheetServiceRateRef.current?.show(); }}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                />
                            )}
                            name="service_rate"
                        />
                        {errors.service_rate && alert_requert}

                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    mode="outlined"
                                    label="Service Fee"
                                    placeholder="input here"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    keyboardType='number-pad'
                                />
                            )}
                            name="service_fee"
                        />
                        {errors.service_fee && alert_requert}

                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    mode="outlined"
                                    label="About Mentor"
                                    placeholder="input here"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    multiline
                                    numberOfLines={4}

                                />
                            )}
                            name="about_mentor"
                        />
                        {errors.about_mentor && alert_requert}

                        <View style={{ marginTop: 35 }}>
                            <Text style={style.detailPengguna}>Upload CV</Text>
                        </View>
                        <View style={{ marginTop: 10 }}>
                            <TouchableOpacity onPress={handleDocumentSelectionCV}>
                                <Card style={{ backgroundColor: warnaBgPdf }}>
                                    <Card.Content >
                                        <View style={{
                                            justifyContent: "center",
                                            alignItems: 'center',
                                            margin: 15
                                        }}>
                                            <Avatar.Icon style={{ backgroundColor: 'white' }} size={50} icon="file-document" />
                                        </View>
                                        <View style={{ alignItems: 'center', margin: 5 }}>
                                            <Text style={{ color: 'white' }}>{namacvPdf}</Text>
                                        </View>
                                        <View style={{ alignItems: 'center', margin: 5 }}>
                                            <Text style={{ color: 'white' }}>Ukuran file max 1MB (PDF)</Text>
                                        </View>

                                        <Btn icon="arrow-up" mode="contained" buttonColor='white' textColor='#007DF1'>pilih file</Btn>
                                    </Card.Content>
                                </Card>
                            </TouchableOpacity>
                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field: { onChange, onBlur, value } }) =>
                                (
                                    <></>
                                )}
                                name="file_cv"
                            />
                            {errors.file_cv && alert_requert}
                        </View>
                        <View style={{ marginTop: 35 }}>

                            {/* <Button title="Submit" onPress={handleSubmit(onSubmit)} /> */}
                            <Btn
                                icon="arrow-right"
                                mode="contained"
                                buttonColor='#2D68FF'
                                onPress={handleSubmit(onSubmit)}
                            >Aktifkan Akun
                            </Btn>
                        </View>
                    </View>


                </ScrollView>
            </SafeAreaView>
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
            <ActionSheet ref={actionSheetServiceRateRef}>
                <View style={{ height: heightSheet }}>
                    <ServiceRateList getItem={getServiceRate} />
                </View>
            </ActionSheet>
            <Snackbar
                visible={visibleNotif}
                onDismiss={onDismissSnackBar}
                style={{ backgroundColor: bgvisible }}
                action={{
                    label: 'ok',
                    labelStyle: { color: 'white' },
                    onPress: () => {
                        setVisibleNotif(false)
                    },
                }}>
                {messageNotif}
            </Snackbar>
        </View>
    )
}

export default AktifasiAkunMentor