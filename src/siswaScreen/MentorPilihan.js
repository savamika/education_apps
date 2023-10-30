import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Dimensions, StyleSheet, ImageBackground } from 'react-native';
import { Appbar, TextInput, Button, Avatar, Card, Title, Paragraph, Dialog, Searchbar } from 'react-native-paper';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import {
    updateLIST_MENTOR
} from '../store/CounterSlice';
import Icon from 'react-native-vector-icons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import * as config from '../common/config'

const style = StyleSheet.create({
    card: {

    }
})

const MentorPilihan = (props) => {
    const navigation = props.navigation
    const [arrDataMentor, setArrDataMentor] = useState([]);
    const [GetAPi, setGetAPi] = useState(false);
    const [arr, setArr] = useState();
    const [render, setrender] = useState(false);
    const [dsb_profile, setDsb_profile] = useState(false);
    const dispatch = useDispatch();

    const width = Math.floor((Dimensions.get('window').width / 2) - 25);
    const height = Math.floor(width + (width / 2));
    const widthRating = width / 5;
    const heightRating = widthRating * (3 / 4);

    const dataMentor = useSelector((state) => state.counter.LIST_MENTOR)
    const BASE_URL = useSelector((state) => state.counter.BASE_URL)
    // var GetAPi = false;
    var arrx = [<Text>0</Text>, <Text>1</Text>, <Text>3</Text>];
    var tmp_card;

    var last_index = 0;
    var is_ganjil = false;

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
                    mataPelajaran: "",
                    gender: "",
                    kelas: "",
                    tanggal: ""
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

    const getDataMentor = async () => {
        if (GetAPi) {

            let listTerdekat = useSelector((state) => state.counter.LIST_MENTOR)
            if (listTerdekat != '') {
                const tmp_arr = JSON.parse(listTerdekat);

                setArrDataMentor((state) => tmp_arr.data)
                if (arrDataMentor.length % 2 == 1) is_ganjil = true;
                if (is_ganjil) last_index = arrDataMentor.length - 1;
            } else {
                getDataMentor();
            }
            return false;
        }
        await axios
            .post(BASE_URL + '/mentor/getlistmentor',
                {
                    category: 'PILIHAN'
                },
                {
                    timeout: 1000 * 30 //30 detik
                }
            )
            .then(async function (response) {
                // handle success
                var data = JSON.stringify(response.data);

                var rs = response.data;
                // console.log('data', data)
                if (!rs.error) {
                    dispatch(updateLIST_MENTOR(data));
                    // console.log('dataMentor', dataMentor);

                    setArrDataMentor((state) => rs.data)
                    if (arrDataMentor.length % 2 == 1) is_ganjil = true;
                    if (is_ganjil) last_index = arrDataMentor.length - 1;

                    setGetAPi(true);
                } else {
                    // dataMentor = arr;
                }


            })
            .catch(function (error) {
                // handle error
                console.log('error xxx', error);
            })
            .finally(() => {
                //complates

                setGetAPi((s) => true);
            });
    }

    useEffect(() => {
        try {
            getDataMentor().catch((err) => console.log(err));

        } catch (error) {

        }

    }, [arrDataMentor])

    return (

        <View key={'mentorPilihan'} style={{ flex: 1, padding: 5 }}>
            {

                typeof arrDataMentor != 'undefined' ?

                    arrDataMentor.map((item, index) => {


                        if (index % 2 == 0) { //genap
                            tmp_card = (


                                <Card style={{ width: width, height: height }}>
                                    <Card.Content style={{ margin: -7 }}>
                                        <View style={{ flexDirection: 'column', height: '100%' }}>
                                            <View style={{ flex: 9, borderRadius: 30 }}>
                                                <ImageBackground source={{ uri: item.picture }} resizeMethod='scale' style={{ width: '100%', height: '100%', flexDirection: 'row', justifyContent: 'flex-end' }} imageStyle={{ borderRadius: 5 }}>
                                                    <View style={{ alignContent: 'center', justifyContent: 'center', margin: 5, backgroundColor: 'white', borderRadius: 5, width: widthRating, height: heightRating }} >
                                                        <View style={{ alignItems: 'center', marginLeft: 'auto', marginRight: 'auto', flexDirection: 'row' }}>
                                                            <FontAwesome name='star' size={8} color={config.color.gold} />
                                                            <Text style={{ fontSize: 8 }} >{item.rating}</Text>
                                                        </View>
                                                    </View>
                                                </ImageBackground>

                                            </View>
                                            <View style={{ flex: 3 }}>
                                                <View>
                                                    <Text style={{ fontSize: 12, fontWeight: 'bold', maxWidth: width }} numberOfLines={1} >{item.firstname} {item.lastname}  </Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                                                    <FontAwesome name='book' size={8} style={{ marginRight: 5 }} />
                                                    <Text style={{ fontSize: 8 }}>{item.skill == '' || item.skill == 'null' || item.skill == null ? 'unknown' : item.skill}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                                                    <FontAwesome5 name='map-marker-alt' size={8} style={{ marginRight: 5 }} />
                                                    <Text style={{ fontSize: 8 }}>{item.city == '' || item.city == 'null' || item.city == null ? 'unknown' : item.city}</Text>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                                                <TouchableOpacity
                                                    style={{
                                                        alignItems: "center",
                                                        backgroundColor: config.color.primery2,
                                                        padding: 5,
                                                        borderRadius: 5,
                                                        width: '100%'
                                                    }}
                                                    activeOpacity={0.8}
                                                    onPress={() => {
                                                        getDataProfileMentor(item.mentor_id)
                                                    }
                                                    }
                                                    disabled={dsb_profile}
                                                >
                                                    <Text style={{ fontSize: 10, color: 'white' }}>Pilih Kelas</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </Card.Content>
                                </Card>
                            )
                        } else if (index % 2 == 1) { //ganjil

                            return (
                                <View key={index} style={{ flexDirection: 'row', flex: 1, paddingTop: 10 }}>
                                    <View style={{ flex: 6, paddingRight: 3 }}>
                                        {tmp_card}
                                    </View>

                                    <View style={{ flex: 6, paddingLeft: 3 }}>

                                        <Card style={{ width: width, height: height }}>
                                            <Card.Content style={{ margin: -7 }}>
                                                <View style={{ flexDirection: 'column', height: '100%' }}>
                                                    <View style={{ flex: 9, borderRadius: 30 }}>
                                                        <ImageBackground source={{ uri: item.picture }} resizeMethod='scale' style={{ width: '100%', height: '100%', flexDirection: 'row', justifyContent: 'flex-end' }} imageStyle={{ borderRadius: 5 }}>
                                                            <View style={{ alignContent: 'center', justifyContent: 'center', margin: 5, backgroundColor: 'white', borderRadius: 5, width: widthRating, height: heightRating }} >
                                                                <View style={{ alignItems: 'center', marginLeft: 'auto', marginRight: 'auto', flexDirection: 'row' }}>
                                                                    <FontAwesome name='star' size={8} color={config.color.gold} />
                                                                    <Text style={{ fontSize: 8 }} >{item.rating}</Text>
                                                                </View>
                                                            </View>
                                                        </ImageBackground>

                                                    </View>
                                                    <View style={{ flex: 3 }}>
                                                        <View>
                                                            <Text style={{ fontSize: 12, fontWeight: 'bold', maxWidth: width }} numberOfLines={1} >{item.firstname} {item.lastname}  </Text>
                                                        </View>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                                                            <FontAwesome name='book' size={8} style={{ marginRight: 5 }} />
                                                            <Text style={{ fontSize: 8 }}>{item.skill == '' || item.skill == 'null' || item.skill == null ? 'unknown' : item.skill}</Text>
                                                        </View>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                                                            <FontAwesome5 name='map-marker-alt' size={8} style={{ marginRight: 5 }} />
                                                            <Text style={{ fontSize: 8 }}>{item.city == '' || item.city == 'null' || item.city == null ? 'unknown' : item.city}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                                                        <TouchableOpacity
                                                            style={{
                                                                alignItems: "center",
                                                                backgroundColor: config.color.primery2,
                                                                padding: 5,
                                                                borderRadius: 5,
                                                                width: '100%'
                                                            }}
                                                            activeOpacity={0.8}
                                                            onPress={() => {
                                                                getDataProfileMentor(item.mentor_id)
                                                            }
                                                            }
                                                            disabled={dsb_profile}
                                                        >
                                                            <Text style={{ fontSize: 10, color: 'white' }}>Pilih Kelas</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </Card.Content>
                                        </Card>

                                    </View>

                                </View>

                            )

                        } else if (is_ganjil == true && index == last_index) {
                            return (
                                <View key={index} style={{ flexDirection: 'row', flex: 1, paddingTop: 10 }}>
                                    <View style={{ flex: 6, paddingRight: 3 }}>

                                        <Card style={{ width: width, height: height }}>

                                            <Card.Content style={{ margin: -7 }}>
                                                <View style={{ flexDirection: 'column', height: '100%' }}>
                                                    <View style={{ flex: 9, borderRadius: 30 }}>
                                                        <ImageBackground source={{ uri: item.picture }} resizeMethod='scale' style={{ width: '100%', height: '100%', flexDirection: 'row', justifyContent: 'flex-end' }} imageStyle={{ borderRadius: 5 }}>
                                                            <View style={{ alignContent: 'center', justifyContent: 'center', margin: 5, backgroundColor: 'white', borderRadius: 5, width: widthRating, height: heightRating }} >
                                                                <View style={{ alignItems: 'center', marginLeft: 'auto', marginRight: 'auto', flexDirection: 'row' }}>
                                                                    <FontAwesome name='star' size={8} color={config.color.gold} />
                                                                    <Text style={{ fontSize: 8 }} >{item.rating}</Text>
                                                                </View>
                                                            </View>
                                                        </ImageBackground>

                                                    </View>
                                                    <View style={{ flex: 3 }}>
                                                        <View>
                                                            <Text style={{ fontSize: 12, fontWeight: 'bold', maxWidth: width }} numberOfLines={1} >{item.firstname} {item.lastname}  </Text>
                                                        </View>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                                                            <FontAwesome name='book' size={8} style={{ marginRight: 5 }} />
                                                            <Text style={{ fontSize: 8 }}>{item.skill == '' || item.skill == 'null' || item.skill == null ? 'unknown' : item.skill}</Text>
                                                        </View>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                                                            <FontAwesome5 name='map-marker-alt' size={8} style={{ marginRight: 5 }} />
                                                            <Text style={{ fontSize: 8 }}>{item.city == '' || item.city == 'null' || item.city == null ? 'unknown' : item.city}</Text>
                                                        </View>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                                                            <TouchableOpacity
                                                                style={{
                                                                    alignItems: "center",
                                                                    backgroundColor: config.color.primery2,
                                                                    padding: 5,
                                                                    borderRadius: 5,
                                                                    width: '100%'
                                                                }}
                                                                activeOpacity={0.8}
                                                                onPress={() => {
                                                                    getDataProfileMentor(item.mentor_id)
                                                                }
                                                                }
                                                                disabled={dsb_profile}
                                                            >
                                                                <Text style={{ fontSize: 10, color: 'white' }}>Pilih Kelas</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </View>
                                            </Card.Content>
                                        </Card>

                                    </View>

                                    <View style={{ flex: 6, paddingLeft: 3 }}>


                                    </View>

                                </View>

                            )
                        }


                    })
                    :
                    console.log('undefined')
            }

        </View>
    )
}

export default MentorPilihan;
