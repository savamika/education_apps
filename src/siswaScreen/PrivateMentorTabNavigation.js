import React, { useState, useCallback } from 'react'
import { RefreshControl, View, Text, ScrollView, SafeAreaView, StatusBar, Dimensions, StyleSheet, Image, ImageBackground } from 'react-native';
import { Appbar, TextInput, Button, Avatar, Card, Title, Paragraph, Dialog, Searchbar } from 'react-native-paper';
import * as  config from '../common/config'
import * as String from '../common/String'
import { useSelector } from 'react-redux'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PrivateMentor from './PrivateMentor'

const PrivateMentorTabNavigation = ({ navigation }) => {

    const goBack = (navigation) => {
        console.log('back');
        navigation.goBack()
    }

    return (
        <>
            <StatusBar backgroundColor={config.color.primery2} />
            <Appbar.Header style={{ backgroundColor: config.color.primery2 }}>
                <Appbar.BackAction color='white' onPress={() => { goBack(navigation) }} />
                <Appbar.Content titleStyle={{ fontSize: 14, fontWeight: 'bold' }} color='white' mode='small' title="Cari Private Mentor" />
            </Appbar.Header>


            <PrivateMentor navigation={navigation} />
        </>
    );
}

export default PrivateMentorTabNavigation;