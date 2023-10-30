import React, { useState, useCallback, useRef, useEffect } from 'react'
import { RefreshControl, Button, PermissionsAndroid, TouchableOpacity, View, Text, ScrollView, SafeAreaView, StatusBar, Dimensions, StyleSheet, BackHandler, ImageBackground, Alert } from 'react-native';
import { Button as Btn, Appbar, TextInput, Avatar, Card, Title, Paragraph, Dialog, Chip, Searchbar, Snackbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import * as  config from '../common/config'
import * as Stringx from '../common/String'
import ActionSheet from "react-native-actions-sheet";
import DatePicker from 'react-native-date-picker'
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from '../common/Spinner';
import { useForm, Controller } from "react-hook-form";
import DocumentPicker, { types } from 'react-native-document-picker';
import KotaList from './KotaList';
import KecamatanList from './KecamatanList';
import DesaList from './DesaList';
import ServiceRateList from './ServiceRateList';
import {
    updateAPIFindUser
} from '../store/CounterSlice'
import ServiceRateOptionDate from './ServiceRateOptionDate';
import ServiceRateOptionDays from './ServiceRateOptionDays';
import RNFetchBlob from 'rn-fetch-blob';
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

const ProfileDataDiriMentor = ({ route, navigation }) => {
    var USER_ID;
    const BASE_URL = useSelector((state) => state.counter.BASE_URL)
    const DATA_USER = route.params.data_user;
    const [NAME, setNAME] = useState('Loading...');
    const [spinnervisible, setSpinnervisible] = useState(false);
    const alert_requert = <Text style={{ color: 'red' }}>{Stringx.text.REQUIRED}</Text>;
    const [colorL, setColorL] = useState(config.color.primery);
    const [colorP, setColorP] = useState(config.color.abuabu);
    const [editable, setEditable] = useState(true);
    const [displayServiceRate, setDisplayServiceRate] = useState(DATA_USER.service_rate);
    const [dateSelected, setDateSelected] = useState('');
    const [htmlSelectedSchedule, setHtmlSelectedSchedule] = useState('');

    const [fileUrl, setfileUrl] = useState(DATA_USER.file_cv);

    // console.log('DATA_USER', DATA_USER)

    const height = Dimensions.get('window').height;
    const heightSheet = (height / 2) - 50;
    const dispatch = useDispatch();
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

    const getServiceRate = (item) => {
        // Function for click on an item
        setValue('service_rate', item.title);
        setDisplayServiceRate((e) => item.title)
        actionSheetServiceRateRef.current?.hide()
        if (item.title == 'hourly') {
            actionSheetServiceRateOptionDateRef.current?.show()
        } else if (item.title == 'monthly') {
            actionSheetServiceRateOptionDaysRef.current?.show()
        }
        trigger('service_rate')
    };

    const getServiceRateOptionDate = (item) => {
        // Function for click on an item
        console.log('item date', item)
        setValue('available_date', item);
        setHtmlSelectedSchedule(<Text>Available Date : {config.beauty_date(item)} </Text>)
        actionSheetServiceRateOptionDateRef.current?.hide()

    };
    const getServiceRateOptionDays = (item) => {
        // Function for click on an item
        console.log('item days', item)
        setValue('available_days', item);
        setHtmlSelectedSchedule(<Text>Available Days : {item} </Text>)
        actionSheetServiceRateOptionDaysRef.current?.hide()
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
            about_mentor: DATA_USER.about_mentor,
            available_date: DATA_USER.available_date,
            available_days: DATA_USER.available_days
        }
    });
    const [longitude, setLongitude] = useState(0)
    const [latitude, setLatitude] = useState(0)
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
    const [warnaBgPdf, setWarnaBgPdf] = useState(config.color.abuabu)

    const [visibleNotif, setVisibleNotif] = useState(false);
    const [bgvisible, setBgvisible] = useState(config.color.black);
    const [messageNotif, setMessageNotif] = useState('');
    const onToggleSnackBar = () => setVisibleNotif(!visibleNotif);
    const onDismissSnackBar = () => setVisibleNotif(false);

    const actionSheetDesaKelurahanRef = useRef();
    const actionSheetKecamatanRef = useRef();
    const actionSheetKotaRef = useRef();
    const actionSheetServiceRateRef = useRef();
    const actionSheetServiceRateOptionDateRef = useRef();
    const actionSheetServiceRateOptionDaysRef = useRef();

    const _set_data = async () => {
        let USER_IDX = await AsyncStorage.getItem('USER_ID')
        USER_ID = USER_IDX;
        setValue('id', USER_IDX); //default

        _setLocation();

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


        let lastnm = DATA_USER.lastname == null ? '' : DATA_USER.lastname;
        let fullname = DATA_USER.firstname + ' ' + lastnm
        if (fullname == null || fullname == '') {
            fullname = DATA_USER.email;
        }
        // console.log('fullname', fullname)
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

        if (DATA_USER.service_rate == 'hourly') {
            setHtmlSelectedSchedule(<Text>Available Date : {config.beauty_date(DATA_USER.available_date)} </Text>)
        } else if (DATA_USER.service_rate == 'monthly') {
            setHtmlSelectedSchedule(<Text>Available day : {DATA_USER.available_days} </Text>)
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

    const checkPermission = async () => {

        // Function to check the platform
        // If Platform is Android then check for permissions.

        if (Platform.OS === 'ios') {
            downloadFile();
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'Storage Permission Required',
                        message:
                            'Application needs access to your storage to download File',
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    // Start downloading
                    downloadFile();
                    console.log('Storage Permission Granted.');
                } else {
                    // If permission denied then show alert
                    alert('Error', 'Storage Permission Not Granted');
                }
            } catch (err) {
                // To handle permission related exception
                console.log("++++" + err);
            }
        }
    };


    const downloadFile = () => {

        // Get today's date to add the time suffix in filename
        let date = new Date();
        // File URL which we want to download
        let FILE_URL = fileUrl;
        // Function to get extention of the file url
        let file_ext = getFileExtention(FILE_URL);

        file_ext = '.' + file_ext[0];

        // config: To get response by passing the downloading related options
        // fs: Root directory path to download
        const { config, fs } = RNFetchBlob;
        let RootDir = fs.dirs.PictureDir;
        let options = {
            fileCache: true,
            addAndroidDownloads: {
                path:
                    RootDir +
                    '/file_' +
                    Math.floor(date.getTime() + date.getSeconds() / 2) +
                    file_ext,
                description: 'downloading file...',
                notification: true,
                // useDownloadManager works with Android only
                useDownloadManager: true,
            },
        };
        config(options)
            .fetch('GET', FILE_URL)
            .then(res => {
                // Alert after successful downloading
                console.log('res -> ', JSON.stringify(res));
                // setMessageNotif((s)=>'nice! download berhasil')
                setMessageNotif((s) => Stringx.text.DOWNLOAD_SUCCESS)
                setVisibleNotif((s) => true);
            });
    };

    const getFileExtention = fileUrl => {
        // To get the file extension
        return /[.]/.exec(fileUrl) ?
            /[^.]+$/.exec(fileUrl) : undefined;
    };

    const goBack = (navigation) => {
        console.log('back');
        navigation.goBack()
    }

    const _findUser = async (id) => {
        console.log(BASE_URL + '/getuser/' + id);
        setSpinnervisible(true);
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

                dispatch(updateAPIFindUser(data))
                await AsyncStorage.setItem('USERDATA', data);


                let firstname = getValues("firstname");
                let lastname = getValues("lastname");
                setNAME((state) => firstname + ' ' + lastname)
                setfileUrl((state) => rs.file_cv)

                _set_edit();
            })
            .catch(function (error) {
                // handle error
                console.log('error _findUser', error);
                setSpinnervisible(false);
            })
            .finally(() => {
                //complates
                setSpinnervisible(false);
            });
    }


    const _setLocation = () => {
        Geolocation.getCurrentPosition(
            (pos) => {

                setLongitude((state) => pos.coords.longitude)
                setLatitude((state) => pos.coords.latitude)

            },
            (error) => Alert.alert('GetCurrentPosition Error', JSON.stringify(error)),
            { enableHighAccuracy: true }
        );
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
            if (typeof _imgava == 'undefined') {
                // body_data.append('picture', '');
            } else {
                body_data.append('picture', _imgava);
            }
        } catch (error) {
            // body_data.append('picture', '');
        }
        try {
            _cvpdf = cvPdf[0]
            if (typeof _cvpdf == 'undefined') {
                // body_data.append('file_cv', '');
            } else {
                body_data.append('file_cv', _cvpdf);
            }

        } catch (error) {
            // body_data.append('file_cv', '');
        }

        body_data.append('id', data.id);
        body_data.append('firstname', data.firstname);
        body_data.append('lastname', data.lastname);
        body_data.append('username', data.username);
        body_data.append('email', DATA_USER.email);
        body_data.append('gender', data.gender);
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

        if (data.service_rate == 'hourly') {
            body_data.append('available_date', data.available_date);
        } else if (data.service_rate == 'monthly') {
            body_data.append('available_days', data.available_days);
        }
        console.log('data', body_data)
        console.log(BASE_URL + '/users/update/' + data.id)

        // return false;
        await axios
            .put(BASE_URL + '/users/update/' + data.id,
                body_data,
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
                //     latitude: longitude,
                //     longitude: latitude,
                //     skill: data.skill,
                //     sub_skill: data.sub_skill,
                //     service_fee: data.service_fee,
                //     service_rate: data.service_rate,
                //     about_mentor: data.about_mentor,
                //     available_date: data.available_date,
                //     available_days: data.available_days
                // },
                {
                    timeout: 1000 * 60, //30 detik
                    headers: {
                        "Content-Type": "multipart/form-data",
                        // "Content-Type": "application/json",
                    },
                }
            )
            .then(async function (response) {
                // handle success
                console.log('response.data', typeof response)
                let rs = response.data;
                console.log('rs', rs);
                if (!rs.error) {
                    _findUser(data.id)
                    setMessageNotif(rs.message)
                    setBgvisible(config.color.green)
                    setVisibleNotif((state) => true)
                }



            })
            .catch(function (error) {
                // handle error
                console.log('error', error);
                // alert(error)
                setSpinnervisible(false);
                setBgvisible(config.color.black)
                setMessageNotif(Stringx.text.ALERT_KONEKSI.toString());
                setVisibleNotif(true);
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
            setWarnaBgPdf(config.color.primery)
        } else {
            setEditable((e) => true);
            setWarnaBgPdf(config.color.abuabu)
        }
    }

    useEffect(() => {
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
                                <TouchableOpacity onPress={checkPermission}>
                                    <Text style={{ fontSize: 12, color: config.color.link }}>unduh cv</Text>
                                </TouchableOpacity>
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
                                </View>
                                <View style={{ marginTop: 5 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={[{ flex: 1 }, style.judul]}>Skill  </Text>
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
                                            name="skill"
                                        />
                                        {errors.skill && alert_requert}
                                    </View>
                                </View>
                                <View style={{ marginTop: 5 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={[{ flex: 1 }, style.judul]}>Sub Skill  </Text>
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
                                            name="sub_skill"
                                        />
                                        {errors.sub_skill && alert_requert}
                                    </View>
                                </View>
                                <View style={{ marginTop: 5 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={[{ flex: 1 }, style.judul]}>Service fee  </Text>
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
                                            name="service_fee"
                                        />
                                        {errors.service_fee && alert_requert}
                                    </View>
                                </View>
                                <View style={{ marginTop: 5 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={[{ flex: 1 }, style.judul]}>Service Rate  </Text>
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
                                                    onChangeText={onChange}
                                                    onBlur={onBlur}
                                                    disabled={editable}
                                                    showSoftInputOnFocus={false}
                                                    value={displayServiceRate}
                                                    onPressIn={() => { actionSheetServiceRateRef.current?.show(); }}
                                                />
                                            )}
                                            name="service_rate"
                                        />
                                        {htmlSelectedSchedule}
                                        {errors.service_rate && alert_requert}
                                    </View>
                                </View>
                                <View style={{ marginTop: 5 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={[{ flex: 1 }, style.judul]}>About Mentor</Text>
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
                                            name="about_mentor"
                                        />
                                        {errors.about_mentor && alert_requert}
                                    </View>
                                </View>
                                <View style={{ marginTop: 5, display: 'flex' }}>
                                    <TouchableOpacity onPress={handleDocumentSelectionCV} disabled={editable}>
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
                        <ActionSheet ref={actionSheetServiceRateRef}>
                            <View style={{ height: heightSheet }}>
                                <ServiceRateList getItem={getServiceRate} />
                            </View>
                        </ActionSheet>
                        <ActionSheet ref={actionSheetServiceRateOptionDateRef}>
                            <View style={{ height: heightSheet }}>
                                <ServiceRateOptionDate getItem={getServiceRateOptionDate} />
                            </View>
                        </ActionSheet>
                        <ActionSheet ref={actionSheetServiceRateOptionDaysRef}>
                            <View style={{ height: heightSheet }}>
                                <ServiceRateOptionDays getItem={getServiceRateOptionDays} />
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
        </View >
    )
}

export default ProfileDataDiriMentor