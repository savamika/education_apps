import React, { useState, useCallback, useRef, useEffect } from 'react'
import { RefreshControl, useWindowDimensions, TouchableOpacity, View, Text, ScrollView, SafeAreaView, StatusBar, Dimensions, StyleSheet, Image, ImageBackground } from 'react-native';
import { Button, Appbar, TextInput, Avatar, Card, Title, Paragraph, Dialog, Chip, Searchbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import * as  config from '../common/config'
import * as String from '../common/String'
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';

import BookingFormReguler from './BookingFormReguler';
import BookingFormHarian from './BookingFormHarian';


const BookingForm = ({ route, navigation }) => {

    // console.log('param', route.data)
    const dataMentor = route.params.data;
    const searchParam = route.params.searchParam;

    const [index, setIndex] = useState(0);
    const [routes] = React.useState([
        { key: 'first', title: 'Harian' },
        { key: 'second', title: 'Regular' },
    ]);

    const FirstRoute = () => (
        <BookingFormHarian navigation={navigation} dataMentor={dataMentor} searchParam={searchParam} />
    );

    const SecondRoute = () => (
        <BookingFormReguler navigation={navigation} dataMentor={dataMentor} searchParam={searchParam} />
    );

    const renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute,
    });

    const goBack = (navigation) => {
        console.log('back');
        navigation.goBack()
    }

    return (
        <View style={{ height: '100%' }}>
            <Appbar.Header style={{}}>
                <Appbar.BackAction onPress={() => { goBack(navigation) }} />
                <Appbar.Content titleStyle={{ fontSize: 14, fontWeight: 'bold' }} mode='small' title="Atur Sesi Pertemuan" />
            </Appbar.Header>
            <TabView
                lazy
                style={{ marginTop: 0 }}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: Dimensions.get('window').width }}
                renderTabBar={props => <TabBar {...props}
                    indicatorStyle={{ backgroundColor: config.color.primery }}
                    style={{ backgroundColor: 'white' }}
                    activeColor={config.color.primery}
                    inactiveColor={config.color.abuabu}
                    renderLabel={({ route, focused, color }) => (
                        <Text key={route.key} style={{ color, margin: 8, fontWeight: 'bold' }}>
                            {route.title}
                        </Text>
                    )}
                />}

            />
        </View>

    )
}

export default BookingForm