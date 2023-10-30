import React, { useState, useCallback, useRef, useEffect } from 'react'
import { RefreshControl, useWindowDimensions, TouchableOpacity, View, Text, ScrollView, SafeAreaView, StatusBar, Dimensions, StyleSheet, Image, ImageBackground } from 'react-native';
import { Button, Badge, Appbar, TextInput, Avatar, Card, Title, Paragraph, Dialog, Chip, Searchbar, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as  config from '../common/config'
import ActionSheet from "react-native-actions-sheet";
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import ShowNotif from '../common/showNotification';
import * as String from '../common/String'
import Goodjob from '../assets/goodjob.svg';


const PertemuanSelesaiMentor = ({ route, navigation }) => {

    const goBack = (navigation) => {
        console.log('back');
        navigation.goBack()
    }

    function myStopFunction() {
        try {
            // Get a reference to the last interval + 1
            const interval_id = window.setInterval(function () { }, Number.MAX_SAFE_INTEGER);

            // Clear any timeout/interval up to that id
            for (let i = 1; i < interval_id; i++) {
                window.clearInterval(i);
            }

            setTimeout(() => {
                navigation.navigate('HomeMentor')
            }, 500);
        } catch (error) {
            console.log('error', error)
        }
    }

    useEffect(() => {

    })
    return (
        <View style={{ height: '100%', backgroundColor: config.color.primery }}>
            <StatusBar hidden={false} backgroundColor={config.color.primery} barStyle={'dark-content'} />
            <View style={{ height: '80%', justifyContent: 'center', alignItems: 'center' }}>
                <Goodjob />
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: config.color.white }}>Kerja Bagus!</Text>
            </View>
            <View style={{ height: '20%', flexDirection: 'row', padding: 10 }}>
                <View style={{ width: '100%', justifyContent: 'flex-end', padding: 5 }}>
                    <Button
                        mode="contained"
                        buttonColor={config.color.abuabu}
                        onPress={async () => {
                            myStopFunction()

                        }}
                        disabled={false}
                        icon="arrow-right"
                        style={{ marginTop: 5 }}
                        textColor={config.color.primery}
                    >
                        home
                    </Button>

                </View>

            </View>
        </View>
    )
}

export default PertemuanSelesaiMentor;