import React, { useState, useCallback, useEffect } from 'react'
import { RefreshControl, TouchableOpacity, View, Text, ScrollView, SafeAreaView, StatusBar, Dimensions, StyleSheet, Image, ImageBackground } from 'react-native';
import { Appbar, Button, Avatar, Card, Chip, Title, Paragraph, Dialog, Searchbar } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import * as String from '../common/String'
import * as Config from '../common/config'
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import axios from 'axios';

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

const SearchMentor = ({ route, navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [arrDataMentor, setArrDataMentor] = useState([]);
    const [html, setHtml] = useState();
    const [GetAPi, setGetAPi] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const dispatch = useDispatch();
    var tmp_arr = [];
    const BASE_URL = useSelector((state) => state.counter.BASE_URL)

    const heightCard = (Dimensions.get('screen').height / 4) - 10

    const goBack = (navigation) => {
        console.log('back');
        navigation.goBack()
    }
    const onRefresh = useCallback(() => {
        setRefreshing((e) => true);
        // wait(2000).then(() => setRefreshing(false));
        getDataMentor().catch((e) => setRefreshing((e) => false))
    }, []);

    const getDataMentor = async () => {
        setRefreshing((e) => true);
        setHtml((e) => []);

        if (searchQuery == '') {
            setRefreshing((e) => false)
            return false;
        }
        await axios
            .post(BASE_URL + '/mentor/getlistmentor',
                {
                    category: searchQuery
                },
                {
                    timeout: 1000 * 30 //30 detik
                }
            )
            .then(async function (response) {
                // handle success
                var data = JSON.stringify(response.data);

                var rs = response.data;
                if (!rs.error) {

                    setArrDataMentor((state) => rs.data)

                    rs.data.map((item, i) => {
                        let dt
                        if (data.available_date != 'null' && data.available_date != '0000-00-00') {
                            dt = new Date(item.available_date);
                            let d = dt.getDate() < 10 ? '0' + dt.getDate().toString() : dt.getDate().toString()
                            let m = dt.getMonth() < 10 ? '0' + dt.getMonth().toString() : dt.getMonth().toString()
                            let Y = dt.getFullYear()

                            dt = Y + '-' + m + '-' + d;
                            dt = Config.beauty_date(dt)
                        }


                        // tmp_arr
                        tmp_arr.push(
                            <View key={i} style={{ marginTop: 5 }}>
                                <Card style={{ height: heightCard, backgroundColor: 'white' }}>
                                    <Card.Content style={{ height: '100%', width: '100%' }}>
                                        <View style={{ flex: 1, flexDirection: 'row' }}>
                                            <View style={{ flex: 4, borderRadius: 30 }}>
                                                <ImageBackground source={{ uri: item.picture }} resizeMethod='scale' style={{ width: '100%', height: '100%', flexDirection: 'row', justifyContent: 'flex-end' }} imageStyle={{ borderRadius: 5 }}>

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
                                                        }} >4.5</Chip>

                                                    <Text style={{ fontSize: 12, paddingLeft: 5, fontWeight: 'bold', width: '70%' }} numberOfLines={1} >{item.firstname} {item.lastname}</Text>
                                                </View>
                                                <View style={{ paddingTop: 5, flexDirection: 'row', alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Text style={style.disabled}>0 kursus online</Text>
                                                    <Text style={style.disabled}>|</Text>
                                                    <Text style={style.disabled}>{item.siswa} siswa</Text>
                                                    <Text style={style.disabled}>|</Text>
                                                    <Text style={style.disabled}>{item.review} Review</Text>
                                                </View>
                                                <View style={{ paddingTop: 5, flexDirection: 'row', alignItems: 'center' }}>
                                                    <View style={{ flex: 1 }}>
                                                        <FontAwesome name='book' size={12} style={{ marginRight: 5 }} />
                                                    </View>
                                                    <View style={{ flex: 11 }}>
                                                        <Text style={{ fontSize: 12 }}>{item.skill}</Text>
                                                    </View>
                                                </View>
                                                <View style={{ paddingTop: 5, flexDirection: 'row', alignItems: 'center' }}>
                                                    <View style={{ flex: 1 }}>
                                                        <FontAwesome5 name='map-marker-alt' size={12} style={{ marginRight: 5 }} />
                                                    </View>
                                                    <View style={{ flex: 11 }}>
                                                        <Text style={{ fontSize: 12 }}>{item.city}</Text>
                                                    </View>
                                                    <View style={{ flex: 11 }}>
                                                        <Text style={{ fontSize: 12 }}>{dt}</Text>
                                                    </View>
                                                </View>
                                                <View style={{ paddingTop: 5, flexDirection: 'row' }}>
                                                    <View style={{ flex: 6, padding: 5 }}>
                                                        <TouchableOpacity style={style.hubungiStyle}>
                                                            <Text style={{ color: Config.color.primery2 }}>Hubungi</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                    <View style={{ flex: 6, padding: 5 }}>
                                                        <TouchableOpacity style={style.profileStyle}>
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
                    });

                    setHtml((e) => tmp_arr);
                } else {
                    // dataMentor = arr;
                    tmp_arr = [];
                    tmp_arr.push(<Text style={{ alignSelf: 'center' }}>{String.text.NO_RESULT}</Text>)
                    setHtml((e) => tmp_arr);

                }


            })
            .catch(function (error) {
                // handle error
                console.log('error xxx', error);
                tmp_arr = [];
                tmp_arr.push(<Text style={{ alignSelf: 'center' }}>{String.text.NO_RESULT}</Text>)
                setHtml((e) => tmp_arr);
            })
            .finally(() => {
                //complates
                setRefreshing((e) => false)
                setGetAPi((s) => true);
            });
    }

    useEffect(() => {
        setSearchQuery((e) => route.params.query)
        getDataMentor().catch((e) => console.log('err', e))
    }, [])



    const onChangeSearch = query => setSearchQuery(query);
    return (
        <View>
            <Appbar.Header>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 2 }}>
                        <Appbar.BackAction onPress={() => { goBack(navigation) }} />
                    </View>
                    <View style={{ flex: 8 }}>
                        <Searchbar
                            placeholder="Search"
                            placeholderTextColor={Config.color.abuabu}
                            onChangeText={onChangeSearch}
                            value={searchQuery}
                            onIconPress={() => getDataMentor().catch((e) => console.log('err', e))}
                        />
                    </View>
                    <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                        <FontAwesome5 name='filter' solid={true} size={20} />

                    </View>
                </View>
            </Appbar.Header >
            <View>
                <SafeAreaView style={{ padding: 10 }}>
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }>


                        {html}
                    </ScrollView>
                </SafeAreaView>
            </View>
        </View >
    )
}

export default SearchMentor;
