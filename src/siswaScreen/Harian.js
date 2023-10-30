import React, { useState, useRef } from 'react'
import { TouchableOpacity, View, Text, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { Button, TextInput, Card, Title } from 'react-native-paper';
import CalendarPicker from 'react-native-calendar-picker';

import * as  config from '../common/config'
import ActionSheet from "react-native-actions-sheet";
import MataPelajaran from './MataPelajaran';
import KelasList from './KelasList';



const Harian = (props) => {
    const [value, setValue] = React.useState('');
    const [mataPelajaran, setMataPelajaran] = useState('');
    const [kelas, setKelas] = useState('');
    const [dateSelected, setDateSelected] = useState('');
    const [btnSemua, setBtnSemua] = useState({ text: config.color.white, bg: config.color.primery2 });
    const [btnLaki, setBtnLaki] = useState({ text: config.color.black, bg: config.color.white });
    const [btnPerempuan, setBtnPerempuan] = useState({ text: config.color.black, bg: config.color.white });
    const [gender, setGender] = useState('Semua');

    const actionSheetRef = useRef();
    const actionSheetKelasRef = useRef();
    const navigation = props.navigation
    const goBack = (navigation) => {
        console.log('back');
        navigation.goBack()
    }

    const getItemMataPelajaran = (item) => {
        // Function for click on an item
        // alert('Id : ' + item.id + ' Title : ' + item.title);
        setMataPelajaran((e) => item.title)
        actionSheetRef.current?.hide()
    };
    const getItemKelas = (item) => {
        // Function for click on an item
        // alert('Id : ' + item.id + ' Title : ' + item.title);
        setKelas((e) => item.title)
        actionSheetKelasRef.current?.hide()
    };

    const onDateChange = (date) => {
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
        setDateSelected((e) => curdate)
    }

    const pressBtnGender = (genre) => {

        switch (genre) {
            case 'semua':
                if (btnSemua.text == config.color.black) {
                    //enable
                    let arr = { text: config.color.white, bg: config.color.primery2 };
                    setBtnSemua((e) => arr)

                    //disable
                    let arr1 = { text: config.color.black, bg: config.color.white }
                    setBtnLaki((e) => arr1)

                    //disable
                    let arr2 = { text: config.color.black, bg: config.color.white }
                    setBtnPerempuan((e) => arr2)

                    setGender((e) => 'Semua')

                } else {
                    //disable
                    let arr = { text: config.color.black, bg: config.color.white }
                    setBtnSemua((e) => arr)


                }
                break;
            case 'laki':
                if (btnLaki.text == config.color.black) {
                    //enable
                    let arr = { text: config.color.white, bg: config.color.primery2 };
                    setBtnLaki((e) => arr)

                    //disable semua
                    let arr1 = { text: config.color.black, bg: config.color.white }
                    setBtnSemua((e) => arr1)

                    //disable perempuan
                    let arr2 = { text: config.color.black, bg: config.color.white }
                    setBtnPerempuan((e) => arr2)

                    setGender((e) => 'Laki-Laki')
                } else {
                    //disable
                    let arr = { text: config.color.black, bg: config.color.white }
                    setBtnLaki((e) => arr)
                }
                break;
            case 'perempuan':
                if (btnPerempuan.text == config.color.black) {
                    //enable
                    let arr = { text: config.color.white, bg: config.color.primery2 };
                    setBtnPerempuan((e) => arr)

                    //disable semua
                    let arr1 = { text: config.color.black, bg: config.color.white }
                    setBtnSemua((e) => arr1)

                    //disable laki
                    let arr2 = { text: config.color.black, bg: config.color.white }
                    setBtnLaki((e) => arr2)

                    setGender((e) => 'Perempuan')
                } else {
                    //disable
                    let arr = { text: config.color.black, bg: config.color.white }
                    setBtnPerempuan((e) => arr)
                }
                break;
            default:
                break;
        }
    }

    const width = Dimensions.get('window').width;
    const btngenrewidth = (width / 3) - 20;
    const height = Dimensions.get('window').height;
    const heightSheet = (height / 2) - 50;

    return (
        <ScrollView>
            <View style={{ padding: 10 }}>

                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    {/* <DatePicker
                    options={{
                        mainColor: 'pink',
                    }}
                    mode="calendar"
                    current='2023-01-15'
                    minimumDate='2023-01-15'
                    selected={getFormatedDate(new Date(), 'jYYYY/jMM/jDD')}
                // maximumDate="2020-07-25"
                /> */}
                    <CalendarPicker
                        onDateChange={onDateChange}
                        minDate={new Date()}
                    />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                    <View style={{ margin: 5, backgroundColor: btnSemua.bg, borderRadius: 5 }}>
                        <TouchableOpacity key={1} onPress={() => { pressBtnGender('semua') }} style={{ width: btngenrewidth, padding: 10, justifyContent: 'center' }} >
                            <Text style={{ color: btnSemua.text, textAlign: 'center' }}>Semua</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ margin: 5, backgroundColor: btnLaki.bg, borderRadius: 5 }}>
                        <TouchableOpacity key={2} onPress={() => { pressBtnGender('laki') }} style={{ width: btngenrewidth, padding: 10, justifyContent: 'center' }} >
                            <Text style={{ color: btnLaki.text, textAlign: 'center' }}>Laki-laki</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ margin: 5, backgroundColor: btnPerempuan.bg, borderRadius: 5 }}>
                        <TouchableOpacity key={3} onPress={() => { pressBtnGender('perempuan') }} style={{ width: btngenrewidth, padding: 10, justifyContent: 'center' }} >
                            <Text style={{ color: btnPerempuan.text, textAlign: 'center' }}>Perempuan</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ marginTop: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Mata Pelajaran</Text>
                    <TextInput
                        showSoftInputOnFocus={false}
                        mode='outlined'
                        onPressIn={() => { actionSheetRef.current?.show(); }}
                        value={mataPelajaran}
                        right={<TextInput.Icon icon="chevron-down" />}></TextInput>
                </View>
                <View style={{ marginTop: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Kelas</Text>
                    <TextInput mode='outlined' showSoftInputOnFocus={false} onPressIn={() => { actionSheetKelasRef.current?.show(); }} value={kelas} right={<TextInput.Icon icon="chevron-down" />}></TextInput>
                </View>
                <View style={{ marginTop: 15 }}>
                    <Button icon="arrow-right"
                        mode="contained"

                        buttonColor={config.color.primery2}
                        textColor={config.color.white}
                        onPress={() => { navigation.navigate('SearchResult', { tanggal: dateSelected, gender: gender, mataPelajaran: mataPelajaran, kelas: kelas }) }}
                    >Cari Mentor</Button>
                </View>
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

            </View>
        </ScrollView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
});


export default Harian;