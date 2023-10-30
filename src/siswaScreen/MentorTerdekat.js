import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, StatusBar, Dimensions, StyleSheet, ImageBackground } from 'react-native';
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

const MentorTerdekat = () => {
    const [arrDataMentor, setArrDataMentor] = useState([]);
    const [GetAPi, setGetAPi] = useState(false);
    const [arr, setArr] = useState();
    const [render, setrender] = useState();
    const dispatch = useDispatch();
    const width = Math.floor((Dimensions.get('window').width / 3) - 5);
    const height = Math.floor(width + (width / 2));
    const widthRating = width / 5;
    const heightRating = widthRating * (3 / 4);
    const dataMentor = useSelector((state) => state.counter.LIST_MENTOR)
    const BASE_URL = useSelector((state) => state.counter.BASE_URL)
    // var GetAPi = false;
    var arrx = [<Text>0</Text>, <Text>1</Text>, <Text>3</Text>];

    const getDataMentor = async () => {
        if (GetAPi) {
            // console.log('arrDataMentor', arrDataMentor)

            let listTerdekat = useSelector((state) => state.counter.LIST_MENTOR)

            if (listTerdekat != '') {
                const tmp_arr = JSON.parse(listTerdekat);

                setArrDataMentor((state) => tmp_arr.data)
            } else {
                getDataMentor();
            }
            return false;
        }
        await axios
            .post(BASE_URL + '/mentor/getlistmentor',
                {
                    category: 'TERDEKAT'
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

                    setArrDataMentor(rs.data);
                    // console.log('arrDataMentor', arrDataMentor);
                    console.log('set DONE')
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
                console.log('hit complate')
                // console.log('finally arrDataMentor', arrDataMentor)

                setGetAPi((s) => true);
                // GetAPi = true;
            });
    }

    var html = [];
    const _preRender = () => {
        if (typeof arrDataMentor != 'undefined') {

            arrDataMentor.map((item, index) => {

                html.push(
                    <View key={'index_' + index} style={{ paddingRight: 10 }}>
                        <Card style={{ width: width, height: height }}>
                            <Card.Content style={{ margin: -7 }}>
                                <View style={{ flexDirection: 'column', height: '100%' }}>
                                    <View style={{ flex: 9, borderRadius: 30 }}>
                                        <ImageBackground source={require('../assets/profilfoto.png')} resizeMethod='scale' style={{ width: '100%', height: '100%', flexDirection: 'row', justifyContent: 'flex-end' }} imageStyle={{ borderRadius: 5 }}>
                                            <View style={{ alignContent: 'center', justifyContent: 'center', margin: 5, backgroundColor: 'white', borderRadius: 5, width: widthRating, height: heightRating }} >
                                                <View style={{ alignItems: 'center', marginLeft: 'auto', marginRight: 'auto', flexDirection: 'row' }}>
                                                    <FontAwesome name='star' size={8} color={config.color.gold} />
                                                    <Text style={{ fontSize: 8 }} >4.5</Text>
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
                                </View>
                            </Card.Content>
                        </Card>
                    </View>

                )


            })

            setrender((s) => html)
        }


    }

    useEffect(() => {
        try {
            getDataMentor().finally(() => _preRender()).catch((err) => console.log(err));
        } catch (error) {

        }


    }, [arrDataMentor])


    return (

        <View key={'MentorTerdekat'} style={{ flex: 1, padding: 10, flexDirection: 'row' }}>
            {


            }
            {render}
        </View>
    )
}

export default MentorTerdekat;
