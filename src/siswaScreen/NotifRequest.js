import React, { useState, useCallback, useRef, useEffect } from 'react'
import { RefreshControl, Button, useWindowDimensions, TouchableOpacity, View, Text, ScrollView, SafeAreaView, StatusBar, Dimensions, StyleSheet, Image, ImageBackground } from 'react-native';
import { Button as Btn, Badge, Appbar, TextInput, Avatar, Card, Title, Paragraph, Dialog, Chip, Searchbar } from 'react-native-paper';
import Logo from '../assets/Error_perspective_matte.svg';
import * as  config from '../common/config'

const NotifRequest = (props) => {
    const navigation = props.navigation;
    return (
        <View style={{ padding: 20, height: '100%', flexDirection: 'column' }}>
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 10 }}>
                <Logo />
                <Text style={{ fontSize: 16, color: config.color.primery2 }}>maaf yaa!</Text>
                <Text>Mentor tidak dapat menerima permintaan jadwal sesi anda</Text>
            </View>

            <View style={{ flex: 2, flexDirection: 'column' }}>
                <Btn style={{ alignSelf: 'center' }}
                    icon="arrow-right"
                    mode="contained"
                    buttonColor={config.color.primery2}
                    onPress={() => {
                        navigation.navigate('BottomNavigation')
                    }}
                >
                    Cari Mentor Lagi
                </Btn>
            </View>

        </View>
    )
}

export default NotifRequest