import React, { useState, useEffect, useRef, useCallback } from 'react'
import { View, StyleSheet, Button, Text, ScrollView, Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
const ServiceRateOptionDate = (props) => {

    const onDateChangeDate = (date) => {
        let tgl = new Date(date).getDate().toString();
        let bln = new Date(date).getMonth() + 1;
        let year = new Date(date).getFullYear().toString();

        if (bln.toString().length == 1) {
            bln = '0' + bln.toString();
        }
        if (tgl.length == 1) {
            tgl = '0' + tgl;
        }
        let curdate = year + "-" + bln + "-" + tgl;
        props.getItem(curdate);
    }

    return (
        <View>
            <CalendarPicker
                onDateChange={onDateChangeDate}
                minDate={new Date()}
            />
        </View>
    )
}

export default ServiceRateOptionDate