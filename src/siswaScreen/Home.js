import React, { useState, useCallback } from 'react'
import { RefreshControl, View, Text, ScrollView, SafeAreaView, StatusBar, Dimensions, ToastAndroid, BackHandler, ImageBackground, PermissionsAndroid, Alert, TouchableOpacity } from 'react-native';
import { Appbar, TextInput, Button, Avatar, Card, Title, Paragraph, Dialog, Searchbar } from 'react-native-paper';
import * as  config from '../common/config'
import * as String from '../common/String'
import { useSelector } from 'react-redux'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MentorTerdekat from './MentorTerdekat';
import MentorPilihan from './MentorPilihan';
import MentorPilihanFlatList from './MentorPilihanFlatList';
import MentorTerdekatFlatList from './MentorTerdekatFlatList';
import { useEffect } from 'react';
import Geolocation from '@react-native-community/geolocation'
import GeocoderOsm from 'react-native-geocoder-osm'
import openMap from 'react-native-open-maps';
import { useFocusEffect } from '@react-navigation/native';

const Home = (props) => {
    const [searchQuery, setSearchQuery] = useState('');
    const LeftContent = props => <Avatar.Icon {...props} icon="folder" />
    const [refreshing, setRefreshing] = useState(false);
    const [ALAMAT, setALAMAT] = useState('');
    // const ALAMAT = useSelector((state) => state.counter.ALAMAT)
    const [dataUser, setdataUser] = useState([])
    const [longitude, setLongitude] = useState(0)
    const [latitude, setLatitude] = useState(0)


    const _setUserData = async () => {
        const dataUserX = JSON.parse(await AsyncStorage.getItem('USERDATA'))
        setdataUser((e) => dataUserX)
        setALAMAT((e) => dataUserX.address)
    }
    // const dataUser = {
    //     "id": "f4dfe06fa93305caa76fe4e4a2499063650c97022cd832ec890fa32a79114864",
    //     "firstname": "Muhammad",
    //     "lastname": "Iqbal",
    //     "username": "miqbal",
    //     "phone_number": "089602823846",
    //     "email": "iqbal@mail.com",
    //     "password": "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4",
    //     "address": "Jln. ATS Bogor",
    //     "gender": "Male",
    //     "picture": "picture.jpg",
    //     "file_cv": "",
    //     "district": "Seplak Barat",
    //     "sub_district": "Kemang",
    //     "city": "Bogor",
    //     "latitude": "-6.5504374",
    //     "longitude": "106.7526387",
    //     "skill": "skill",
    //     "sub_skill": "sub_skill",
    //     "is_user": "MENTOR",
    //     "is_verified": "0",
    //     "refresh_token": null,
    //     "createdAt": "2022-12-20T16:53:59.000Z",
    //     "updatedAt": "2022-12-20T16:53:59.000Z"
    // }
    const navigation = props.navigation;


    // console.log('ALAMAT', ALAMAT);

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);

    const onChangeSearch = query => setSearchQuery(query);

    const _setLocationName = () => {
        Geolocation.getCurrentPosition(
            (pos) => {
                console.log('pos.longitude', pos.coords.longitude)
                console.log('pos.latitude', pos.coords.latitude)
                setLongitude((state) => pos.coords.longitude)
                setLatitude((state) => pos.coords.latitude)
                GeocoderOsm.getGeoCodePosition(pos.coords.latitude, pos.coords.longitude).then((res) => {
                    // res is an Array of geocoding object
                    // console.log("getGeoCodePosition", res)
                    let displayName = res[0].display_name
                    setALAMAT(() => displayName)
                }).catch((e) => {
                    console.log('getGeoCodePosition error', e)
                });
            },
            (error) => Alert.alert('GetCurrentPosition Error', JSON.stringify(error)),
            { enableHighAccuracy: true }
        );
    }

    async function requestLocationPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    'title': 'Example App',
                    'message': 'Example App access to your location '
                }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the location")

            } else {
                console.log("location permission denied")

            }
        } catch (err) {
            console.warn(err)
        }
    }

    var back = 0
    const handler = () => {
        console.log('home..')

        back++;
        if (back > 1) {
            BackHandler.exitApp()
        } else {
            ToastAndroid.show('tekan sekali lagi untuk keluar', ToastAndroid.SHORT);
            setTimeout(() => {
                back = 0;
            }, 2000);
            return true;
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {


                return true;
            };

            const subscription = BackHandler.addEventListener('hardwareBackPress', handler);

            return () => subscription.remove();
        }, [])
    );

    useEffect(() => {
        _setUserData()
        requestLocationPermission().then(() => _setLocationName())
    }, [])

    return (
        <View style={{ flex: 2, backgroundColor: 'white', flexDirection: 'column' }}>
            <StatusBar hidden={false} backgroundColor='white' barStyle={'dark-content'} />

            <View style={{ flex: 1, flexDirection: 'row', paddingRight: 15, paddingLeft: 15 }}>
                <View style={{ backgroundColor: 'white', flex: 1, justifyContent: 'center', alignItems: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
                    <Icon name='map-marker-alt' size={20} />
                </View>
                <View style={{ flex: 10, flexDirection: 'column' }}>
                    <View style={{ paddingRight: 15, flex: 6, flexDirection: 'column', justifyContent: 'flex-end' }}>
                        <Text style={{ fontSize: 10, fontWeight: '900' }}>lokasi kamu</Text>
                    </View>
                    <View style={{ flex: 6, flexDirection: 'column' }}>
                        <TouchableOpacity onPress={() => {
                            console.log('press')
                            console.log('longitude', longitude)
                            console.log('latitude', latitude)
                            if (longitude != 0 && latitude != 0) {
                                // const daddr = `${latitude},${longitude}`;
                                // let url = `geo:${daddr}` + '?q=';
                                // console.log('url map', url)
                                // Linking.openURL(url);

                                openMap({ provider: 'google', latitude: latitude, longitude: longitude })
                            }
                        }} >
                            <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{ALAMAT == '' || ALAMAT == null ? String.text.NO_ADDRESS : ALAMAT}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Avatar.Image size={30} style={{ backgroundColor: config.color.abuabu }} source={{ uri: dataUser.picture }} />
                </View>
            </View>
            <View style={{ flex: 10 }}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }>
                    <SafeAreaView style={{ backgroundColor: 'white', padding: 10 }}>
                        <View style={{ flexDirection: 'column' }}>
                            <View style={{}}>
                                <Searchbar
                                    placeholder="cari mentor"
                                    placeholderTextColor={config.color.abuabu}
                                    onChangeText={onChangeSearch}
                                    value={searchQuery}
                                    elevation="0"
                                    style={{
                                        borderColor: '#e5e5e5',
                                        borderWidth: 1
                                    }}
                                    onIconPress={() => navigation.navigate('SearchMentor', { query: searchQuery })}
                                />

                            </View>
                            <View style={{ paddingTop: 10, flexDirection: 'row', justifyContent: 'center' }}>
                                <View style={{ paddingRight: 5, flex: 6 }}>
                                    <Card style={{ minHeight: 100, backgroundColor: config.color.primery2 }} onPress={() => navigation.navigate('PrivateMentor')}>
                                        <Card.Content style={{}} >
                                            <View style={{ flex: 12, flexDirection: 'row' }}>
                                                <View style={{ flex: 5, alignContent: 'center', justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
                                                    <ImageBackground style={{
                                                        flex: 1,
                                                        resizeMode: "stretch",
                                                        width: 60,
                                                        height: 60,
                                                    }} source={require('../assets/Books.png')} />
                                                </View>
                                                <View style={{ flex: 7 }}>
                                                    <View><Text style={{ fontWeight: 'bold', color: 'white' }}>Privat Mentor</Text></View>
                                                    <View><Text style={{ fontSize: 10, color: 'white' }}>Belajar dirumah dengan mentor</Text></View>
                                                </View>
                                            </View>
                                        </Card.Content>
                                    </Card>
                                </View>
                                <View style={{ paddingLeft: 5, flex: 6 }}>
                                    <Card style={{ minHeight: 100 }}>
                                        <Card.Content >
                                            <View style={{ flex: 12, flexDirection: 'row' }}>
                                                <View style={{ flex: 5, alignContent: 'center', justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
                                                    <ImageBackground style={{
                                                        flex: 1,
                                                        resizeMode: "stretch",
                                                        width: 60,
                                                        height: 60,
                                                    }} source={require('../assets/OnlineStudy.png')} />
                                                </View>
                                                <View style={{ flex: 7 }}>
                                                    <View><Text style={{ fontWeight: 'bold' }}>Kelas Online</Text></View>
                                                    <View><Text style={{ fontSize: 10 }}>Ambil kelas online dengan mentor</Text></View>
                                                </View>
                                            </View>
                                        </Card.Content>
                                    </Card>
                                </View>
                            </View>

                            <View style={{ paddingTop: 10 }}>
                                <Card style={{ backgroundColor: 'white' }} elevation={1} onPress={() => { navigation.navigate('Donasi') }}>
                                    <Card.Content style={{}} >
                                        <View style={{ flex: 12, flexDirection: 'row' }}>
                                            <View style={{ flex: 1 }}><FontAwesome5 size={30} color={config.color.primery2} name='gift' /></View>
                                            <View style={{ paddingLeft: 10, flex: 9, flexDirection: 'column' }}>
                                                <View><Text style={{ fontSize: 12, fontWeight: 'bold' }}>Donasi</Text></View>
                                                <View><Text style={{ fontSize: 10 }}>Beri Donasi Untuk Pengembangan kami</Text></View>
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Icon size={25} name='arrow-right' />
                                            </View>

                                        </View>
                                    </Card.Content>
                                </Card>
                            </View>

                            <View style={{ marginTop: 10, maxHeight: 100, backgroundColor: 'white' }}>
                                <Card style={{ backgroundColor: 'white', width: '100%', height: '100%' }} elevation={1}>
                                    <Card.Cover style={{ maxHeight: 100 }} source={{ uri: 'https://picsum.photos/700' }} />
                                </Card>
                            </View>
                            <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ flex: 6 }}>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Mentor Terdekat</Text>
                                </View>
                                <View style={{ flex: 6, alignItems: 'flex-end' }}>
                                    <Button textColor={config.color.link} contentStyle={{ flexDirection: 'row-reverse' }} icon="arrow-right" mode="text" onPress={() => console.log('Pressed')}>
                                        Semua
                                    </Button>
                                </View>

                            </View>

                            <View>
                                <ScrollView horizontal={false} style={{ width: '100%' }}
                                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                                >
                                    <View style={{ width: '100%', alignItems: 'center' }}>
                                        <MentorTerdekatFlatList navigation={navigation} />
                                    </View>
                                </ScrollView>

                            </View>

                            <View style={{ paddingTop: 10 }}>
                                <Card style={{ backgroundColor: 'white' }} elevation={1}>
                                    <Card.Content style={{}} >
                                        <View style={{ flex: 12, flexDirection: 'row' }}>
                                            <View style={{ flex: 2 }}>
                                                <ImageBackground style={{
                                                    flex: 1,
                                                    resizeMode: "stretch",
                                                    width: 60,
                                                    height: 60,
                                                }} source={require('../assets/School.png')} />
                                            </View>
                                            <View style={{ paddingLeft: 10, flex: 9, flexDirection: 'column' }}>
                                                <View><Text style={{ fontSize: 12, fontWeight: 'bold' }}>Bergabung Menjadi Mentor Kami</Text></View>
                                                <View><Text style={{ fontSize: 10 }}>Mari bergabung sekarang, untuk menjadi mentor atau intruktur dikelas kami</Text></View>
                                                <View style={{ height: '50%', justifyContent: 'flex-end', alignItems: 'flex-end' }}><Button mode="contained" style={{ width: '50%' }} labelStyle={{ fontSize: 10 }} buttonColor={config.color.primery2} icon="arrow-right" onPress={() => console.log('pres')} >Bergabunglah</Button></View>
                                            </View>

                                        </View>
                                    </Card.Content>
                                </Card>
                            </View>
                            <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ flex: 6 }}>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Mentor Pilihan</Text>
                                </View>
                            </View>
                            <View>
                                {/* <MentorPilihan navigation={navigation} /> */}
                                <ScrollView horizontal={true} style={{ width: '100%', height: '100%' }}
                                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                                >
                                    <View style={{ width: '100%', alignItems: 'center' }}>
                                        <MentorPilihanFlatList navigation={navigation} />

                                    </View>
                                </ScrollView>

                            </View>

                        </View>
                    </SafeAreaView>
                </ScrollView>
            </View>

        </View >

    )
}
export default Home;
