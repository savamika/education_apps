import React, { useState, useCallback, useEffect, useRef } from 'react'
import { RefreshControl, TouchableOpacity, View, Text, ScrollView, SafeAreaView, StatusBar, Dimensions, StyleSheet, FlatList, ImageBackground } from 'react-native';
import { ActivityIndicator, Appbar, Button, Avatar, Card, Chip, Title, Paragraph, Dialog, Searchbar, TextInput } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import * as String from '../common/String'
import * as Config from '../common/config'
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import axios from 'axios';
import MataPelajaran from './MataPelajaran';
import KelasList from './KelasList';
import JenisKelamin from './JenisKelamin';
import ActionSheet from "react-native-actions-sheet";
import CalendarPicker from 'react-native-calendar-picker';

// import SkeletonContent from 'react-native-skeleton-content';


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

const SearchResult = ({ route, navigation }) => {
    const [warningempty, setWarningempty] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [matapelajaran, setMatapelajaran] = useState('');
    const [kelas, setKelas] = useState('');
    const [genre, setGenre] = useState('');
    const [tanggal, setTanggal] = useState('');
    const [dsb_profile, setDsb_profile] = useState(false);
    var html_filter = [];
    const [DATA_TRANSACTION_LIST, setDATA_TRANSACTION_LIST] = useState([]);

    const actionSheetRef = useRef();
    const actionSheetKelasRef = useRef();
    const actionSheetJenisKelaminRef = useRef();
    const actionSheetCalenderRef = useRef();
    const height = Dimensions.get('window').height;
    const heightSheet = (height / 2) - 50;

    const [arrDataMentor, setArrDataMentor] = useState([]);
    const [html, setHtml] = useState();
    const [GetAPi, setGetAPi] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const dispatch = useDispatch();
    const [alert_html, setAlert_html] = useState();

    var tmp_arr = [];
    const BASE_URL = useSelector((state) => state.counter.BASE_URL)


    const heightCard = (Dimensions.get('screen').height / 3.5) - 10

    const getItemMataPelajaran = (item) => {
        // Function for click on an item
        // alert('Id : ' + item.id + ' Title : ' + item.title);
        setMatapelajaran((e) => item.title)
        actionSheetRef.current?.hide()
    };
    const getItemKelas = (item) => {
        // Function for click on an item
        // alert('Id : ' + item.id + ' Title : ' + item.title);
        setKelas((e) => item.title)
        actionSheetKelasRef.current?.hide()
    };
    const getItemJenisKelamin = (item) => {
        // Function for click on an item
        // alert('Id : ' + item.id + ' Title : ' + item.title);
        setGenre((e) => item.title)
        actionSheetJenisKelaminRef.current?.hide()
    };


    const getItemCalender = (date) => {
        let tgl = new Date(date).getDate().toString();
        let bln = new Date(date).getMonth() + 1;
        let year = new Date(date).getFullYear().toString();

        if (bln.toString().length == 1) {
            bln = '0' + bln.toString();
        }
        if (tgl.length == 1) {
            tgl = '0' + tgl;
        }
        setTanggal((e) => curdate)
        actionSheetCalenderRef.current?.hide()
    }

    const goBack = (navigation) => {
        console.log('back');
        navigation.goBack()
    }
    const onRefresh = useCallback(() => {
        setRefreshing((e) => true);
        // wait(2000).then(() => setRefreshing(false));
        let param = {
            matapelajaran: route.params.mataPelajaran,
            tanggal: route.params.tanggal,
            kelas: route.params.kelas,
            gender: route.params.gender == 'Laki-laki' ? 'Male' : route.params.gender == 'Perempuan' ? 'Female' : ''

        }
        getDataMentor(param).catch((e) => setRefreshing((e) => false))
    }, []);

    const getDataMentor = async (param) => {
        setRefreshing((e) => true);
        setHtml((e) => []);


        let params = {
            category: param.matapelajaran,
            // available_date: param.tanggal,
            available_date: param.tanggal,
            gender: param.gender,
            sub_skill: '',
            class: param.kelas
        };

        console.log('========getlistmentor', params)
        await axios
            .post(BASE_URL + '/mentor/getlistmentor',
                params,
                {
                    timeout: 1000 * 30 //30 detik
                }
            )
            .then(async function (response) {
                // handle success

                var data = JSON.stringify(response.data);

                var rs = response.data;

                if (!rs.error) {
                    tmp_arr = [];
                    setArrDataMentor((state) => rs.data)
                    setDATA_TRANSACTION_LIST((state) => rs.data);

                    if (rs.data.length == 0) {
                        setWarningempty(String.text.NO_RESULT);
                    } else {
                        setWarningempty('');
                    }

                    setHtml((e) => tmp_arr);
                } else {
                    // dataMentor = arr;
                    setWarningempty(String.text.NO_RESULT);
                    setAlert_html(tmp_arr)
                    setHtml((e) => tmp_arr);

                }

                setGetAPi((s) => true);
                setTimeout(() => {
                    setRefreshing((e) => false)
                }, 1000);


            })
            .catch(function (error) {
                // handle error
                console.log('error xxx', error);
                console.log('URL error', BASE_URL + '/mentor/getlistmentor/' + matapelajaran);
                tmp_arr = [];
                tmp_arr.push(<Text style={{ alignSelf: 'center' }}>{String.text.NO_RESULT}</Text>)
                setHtml((e) => tmp_arr);
                setAlert_html(tmp_arr)

                setTimeout(() => {
                    setRefreshing((e) => false)
                }, 1000);
            })
            .finally(() => {
                //complates

            });
    }


    const getDataProfileMentor = async (mentor_id) => {

        console.log('mentor_id', mentor_id)
        setDsb_profile((e) => true)
        console.log('setDsb_profile', true)

        await axios
            .get(BASE_URL + '/getuser/' + mentor_id, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 1000 * 30
            })
            .then(function (response) {
                // handle success
                let data = JSON.stringify(response.data[0]);

                let param = {
                    mataPelajaran: route.params.mataPelajaran,
                    gender: route.params.gender,
                    kelas: route.params.kelas,
                    tanggal: route.params.tanggal
                }
                navigation.navigate('ProfileMentor', { data: response.data[0], param: param })
            })
            .catch(function (error) {
                // handle error
                console.log('error', error);
            })
            .finally(() => {
                //complates
                setDsb_profile((e) => false)
            });
    }

    if (route.params.tanggal != 'null' && route.params.tanggal != null) {
        console.log('route.params.tanggal', route.params.tanggal);
        html_filter.push(
            <View style={{ flexDirection: 'row', paddingLeft: 5, paddingRight: 5 }}>
                <View style={{ flex: 6, paddingRight: 5 }}>
                    <Text style={{ fontSize: 8, color: Config.color.white }}>Tanggal</Text>
                    <TextInput
                        style={{ backgroundColor: Config.color.primery }}
                        outlineColor={Config.color.primery}
                        activeOutlineColor={Config.color.primery}
                        textColor='white'
                        value={tanggal}
                        right={<TextInput.Icon iconColor='white' icon="chevron-down" />}
                        mode='outlined'
                    // onPressIn={() => { actionSheetJenisKelaminRef.current?.show(); }}
                    ></TextInput>
                </View>
                <View style={{ flex: 6, paddingLeft: 5 }}>
                    <Text style={{ fontSize: 8, color: Config.color.white }}>Jenis Kelamin</Text>
                    <TextInput
                        style={{ backgroundColor: Config.color.primery }}
                        outlineColor={Config.color.primery}
                        activeOutlineColor={Config.color.primery}
                        textColor='white'
                        value={genre}
                        right={<TextInput.Icon iconColor='white' icon="chevron-down" />}
                        mode='outlined'
                        onPressIn={() => { actionSheetJenisKelaminRef.current?.show(); }}
                    ></TextInput>
                </View>
            </View>
        )
    } else {
        html_filter.push(
            <View style={{ flexDirection: 'row', paddingLeft: 5, paddingRight: 5 }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 8, color: Config.color.white }}>Jenis Kelamin</Text>
                    <TextInput
                        style={{ backgroundColor: Config.color.primery }}
                        outlineColor={Config.color.primery}
                        activeOutlineColor={Config.color.primery}
                        textColor='white'
                        value={genre}
                        right={<TextInput.Icon iconColor='white' icon="chevron-down" />}
                        mode='outlined'
                        onPressIn={() => { actionSheetJenisKelaminRef.current?.show(); }}
                    ></TextInput>
                </View>
            </View>
        )
    }

    useEffect(() => {
        setMatapelajaran((e) => route.params.mataPelajaran)
        setGenre((e) => route.params.gender)
        setKelas((e) => route.params.kelas)
        setTanggal((e) => route.params.tanggal)


        let param = {
            matapelajaran: route.params.mataPelajaran,
            tanggal: route.params.tanggal,
            kelas: route.params.kelas,
            gender: route.params.gender == 'Laki-laki' ? 'Male' : route.params.gender == 'Perempuan' ? 'Female' : ''

        }

        setTimeout(() => {
            getDataMentor(param).catch((e) => console.log('err', e))
        }, 1000);

    }, [])
    const onChangeSearch = query => setSearchQuery(query);

    const Item = ({ data }) => {
        let dt

        if (data.available_date != 'null' && data.available_date != '0000-00-00') {
            dt = new Date(data.available_date);
            let d = dt.getDate() < 10 ? '0' + dt.getDate().toString() : dt.getDate().toString()
            let m = dt.getMonth() < 10 ? '0' + dt.getMonth().toString() : dt.getMonth().toString()
            let Y = dt.getFullYear()

            dt = Y + '-' + m + '-' + d;
            dt = Config.beauty_date(dt)
        }
        return (

            <View key={data.mentor_id} style={{ marginTop: 5 }}>
                <Card style={{ height: heightCard, backgroundColor: 'white' }}>
                    <Card.Content style={{ height: '100%', width: '100%' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ flex: 4, borderRadius: 30 }}>
                                <ImageBackground source={{ uri: data.picture }} resizeMethod='scale' style={{ width: '100%', height: '100%', flexDirection: 'row', justifyContent: 'flex-end' }} imageStyle={{ borderRadius: 5 }}>

                                </ImageBackground>
                            </View>
                            <View style={{ flex: 8, paddingLeft: 10 }}>
                                <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
                                    <Chip
                                        elevated={true}
                                        icon={() => (
                                            <Icon name="star" size={16} color={Config.color.gold} />
                                        )}
                                        style={{
                                            width: '25%', backgroundColor: 'white'
                                        }} >{data.rating}</Chip>

                                    <Text style={{ fontSize: 12, paddingLeft: 5, fontWeight: 'bold', width: '70%' }} numberOfLines={1} >{data.firstname} {data.lastname}</Text>
                                </View>
                                <View style={{ paddingTop: 5, flexDirection: 'row', alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={style.disabled}>0 kursus online</Text>
                                    <Text style={style.disabled}>|</Text>
                                    <Text style={style.disabled}>{data.siswa} siswa</Text>
                                    <Text style={style.disabled}>|</Text>
                                    <Text style={style.disabled}>{data.review} Review</Text>
                                </View>
                                <View style={{ paddingTop: 5, flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ flex: 1 }}>
                                        <FontAwesome name='book' size={12} style={{ marginRight: 5 }} />
                                    </View>
                                    <View style={{ flex: 11 }}>
                                        <Text style={{ fontSize: 12 }}>{data.skill} - {data.sub_skill}</Text>
                                    </View>
                                </View>
                                <View style={{ paddingTop: 5, flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ flex: 1 }}>
                                        <FontAwesome5 name='map-marker-alt' size={12} style={{ marginRight: 5 }} />
                                    </View>
                                    <View style={{ flex: 11 }}>
                                        <Text style={{ fontSize: 12 }}>{data.city}</Text>
                                    </View>
                                </View>
                                <View style={{ paddingTop: 5, flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ flex: 12 }}>
                                        <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Jadwal</Text>
                                    </View>
                                </View>
                                <View style={{ paddingTop: 5, flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ flex: 12 }}>
                                        <Text style={{ fontSize: 12 }}>{dt}</Text>
                                    </View>
                                    <View style={{ flex: 12 }}>
                                        <Text style={{ fontSize: 12 }}>{data.available_time}</Text>
                                    </View>
                                </View>

                                <View style={{ paddingTop: 5, flexDirection: 'row' }}>
                                    <View style={{ flex: 6, padding: 5, height: '80%' }}>
                                        <TouchableOpacity style={style.hubungiStyle}>
                                            <Text style={{ color: Config.color.primery2 }}>Hubungi</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flex: 6, padding: 5, height: '80%' }}>
                                        <TouchableOpacity style={style.profileStyle} onPress={() => { getDataProfileMentor(data.mentor_id) }} disabled={dsb_profile}>
                                            {/* <ActivityIndicator hidesWhenStopped={true} animating={false} color={Config.color.white} /> */}
                                            <Text style={{ color: 'white' }}>Profile</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Card.Content>
                </Card>
            </View>

        )
    };

    return (
        <View style={{ height: "100%" }}>
            <StatusBar backgroundColor={Config.color.primery2} />
            <ActionSheet ref={actionSheetRef}>
                <View style={{ height: heightSheet }}>
                    <MataPelajaran getItem={getItemMataPelajaran} />
                </View>
            </ActionSheet>
            <ActionSheet ref={actionSheetKelasRef}>
                <View style={{ height: heightSheet }}>
                    <KelasList getItem={getItemKelas} />
                </View>
            </ActionSheet>
            <ActionSheet ref={actionSheetJenisKelaminRef}>
                <View style={{ height: heightSheet }}>
                    <JenisKelamin getItem={getItemJenisKelamin} />
                </View>
            </ActionSheet>
            <ActionSheet ref={actionSheetCalenderRef}>
                <View style={{ height: heightSheet }}>
                    <CalendarPicker
                        onDateChange={getItemCalender}
                        minDate={new Date()}
                    />
                </View>
            </ActionSheet>
            <View style={{ flex: 1 }}>
                <Appbar.Header style={{ backgroundColor: Config.color.primery2 }}>
                    <Appbar.BackAction color='white' onPress={() => { goBack(navigation) }} />
                    <Appbar.Content titleStyle={{ fontSize: 14, fontWeight: 'bold' }} color='white' mode='small' title="Hasil Pencarian Regular" />
                </Appbar.Header>
            </View>

            <View style={{ backgroundColor: Config.color.primery2, paddingLeft: 10, paddingRight: 10, paddingBottom: 10, flex: 3, justifyContent: 'center' }}>
                <View style={{ flexDirection: 'row', paddingBottom: 5 }}>
                    <View style={{ flex: 7, paddingLeft: 5, paddingRight: 5 }}>
                        <Text style={{ fontSize: 8, color: Config.color.white }}>Mata Pelajaran</Text>
                        <TextInput
                            style={{ backgroundColor: Config.color.primery }}
                            outlineColor={Config.color.primery}
                            activeOutlineColor={Config.color.primery}
                            textColor='white'
                            mode='outlined'
                            value={matapelajaran}
                            right={<TextInput.Icon iconColor='white' icon="chevron-down" />}
                            onPressIn={() => { actionSheetRef.current?.show(); }}
                        ></TextInput>
                    </View>
                    <View style={{ flex: 5, paddingLeft: 5, paddingRight: 5 }}>
                        <Text style={{ fontSize: 8, color: Config.color.white }}>Kelas</Text>
                        <TextInput
                            style={{ backgroundColor: Config.color.primery }}
                            outlineColor={Config.color.primery}
                            activeOutlineColor={Config.color.primery}
                            textColor='white'
                            value={kelas}
                            right={<TextInput.Icon iconColor='white' icon="chevron-down" />}
                            mode='outlined'
                            onPressIn={() => { actionSheetKelasRef.current?.show(); }}
                        ></TextInput>
                    </View>
                </View>

                {
                    html_filter
                }



            </View>
            <View style={{ flex: 8 }}>
                <SafeAreaView style={{ padding: 10 }}>
                    <FlatList
                        data={DATA_TRANSACTION_LIST}
                        renderItem={({ item }) => <Item data={item} />}
                        keyExtractor={item => item.id}
                        ListEmptyComponent={<Text style={{ alignSelf: 'center' }}>{warningempty}</Text>}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                        style={{ height: '100%' }}
                    />

                </SafeAreaView>

            </View>
        </View >
    )
}

export default SearchResult;
