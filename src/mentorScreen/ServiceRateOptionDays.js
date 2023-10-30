import React, { useState, useEffect, useRef, useCallback } from 'react'
import { View, StyleSheet, Button, Text, ScrollView, Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';
import * as  config from '../common/config'
import * as String from '../common/String'
const ServiceRateOptionDays = (props) => {
    const width = Dimensions.get('window').width;
    const widthHari = (width / 3) - 20;
    const [btnSenin, setBtnSenin] = useState(config.color.abuabu);
    const [btnSelasa, setBtnSelasa] = useState(config.color.abuabu);
    const [btnRabu, setBtnRabu] = useState(config.color.abuabu);
    const [btnKamis, setBtnKamis] = useState(config.color.abuabu);
    const [btnJumat, setBtnJumat] = useState(config.color.abuabu);
    const [btnSabtu, setBtnSabtu] = useState(config.color.abuabu);
    const [btnMinggu, setBtnMinggu] = useState(config.color.abuabu);

    const setBtnColor = (day) => {
        switch (day) {
            case 'Senin':
                if (btnSenin == config.color.abuabu) {
                    setBtnSenin((e) => config.color.primery)
                } else {
                    setBtnSenin((e) => config.color.abuabu)
                }
                break;
            case 'Selasa':
                if (btnSelasa == config.color.abuabu) {
                    setBtnSelasa((e) => config.color.primery)
                } else {
                    setBtnSelasa((e) => config.color.abuabu)
                }
                break;
            case 'Rabu':
                if (btnRabu == config.color.abuabu) {
                    setBtnRabu((e) => config.color.primery)
                } else {
                    setBtnRabu((e) => config.color.abuabu)
                }
                break;
            case 'Kamis':
                if (btnKamis == config.color.abuabu) {
                    setBtnKamis((e) => config.color.primery)
                } else {
                    setBtnKamis((e) => config.color.abuabu)
                }
                break;
            case 'Jumat':
                if (btnJumat == config.color.abuabu) {
                    setBtnJumat((e) => config.color.primery)
                } else {
                    setBtnJumat((e) => config.color.abuabu)
                }
                break;
            case 'Sabtu':
                if (btnSabtu == config.color.abuabu) {
                    setBtnSabtu((e) => config.color.primery)
                } else {
                    setBtnSabtu((e) => config.color.abuabu)
                }
                break;
            case 'Minggu':
                if (btnMinggu == config.color.abuabu) {
                    setBtnMinggu((e) => config.color.primery)
                } else {
                    setBtnMinggu((e) => config.color.abuabu)
                }
                break;

            default:
                break;
        }
    }

    const _confirm = () => {
        let hari = '';
        if (btnSenin == config.color.primery) {
            hari += 'SENIN,'
        }
        if (btnSelasa == config.color.primery) {
            hari += 'SELASA,'
        }
        if (btnRabu == config.color.primery) {
            hari += 'RABU,'
        }
        if (btnKamis == config.color.primery) {
            hari += 'KAMIS,'
        }
        if (btnJumat == config.color.primery) {
            hari += 'JUMAT,'
        }
        if (btnSabtu == config.color.primery) {
            hari += 'SABTU,'
        }
        if (btnMinggu == config.color.primery) {
            hari += 'MINGGU,'
        }
        if (hari != '') {
            hari = hari.slice(0, -1); //delete karater terakhir untuk menghilangkan koma
        } else {
            return false
        }

        props.getItem(hari)
    }

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
            <View style={{ padding: 10 }}>
                <Text style={{ fontSize: 12 }}>Hari Pertemuan</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <View style={{ width: widthHari, padding: 5 }}>
                        <Button title='Senin' onPress={() => { setBtnColor('Senin') }} color={btnSenin} ></Button>
                    </View>
                    <View style={{ width: widthHari, padding: 5 }}>
                        <Button title='Selasa' onPress={() => { setBtnColor('Selasa') }} color={btnSelasa} ></Button>
                    </View>
                    <View style={{ width: widthHari, padding: 5 }}>
                        <Button title='Rabu' onPress={() => { setBtnColor('Rabu') }} color={btnRabu}></Button>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <View style={{ width: widthHari, padding: 5 }}>
                        <Button title='Kamis' onPress={() => { setBtnColor('Kamis') }} color={btnKamis}></Button>
                    </View>
                    <View style={{ width: widthHari, padding: 5 }}>
                        <Button title='Jumat' onPress={() => { setBtnColor('Jumat') }} color={btnJumat}></Button>
                    </View>
                    <View style={{ width: widthHari, padding: 5 }}>
                        <Button title='Sabtu' onPress={() => { setBtnColor('Sabtu') }} color={btnSabtu}></Button>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <View style={{ width: widthHari, padding: 5 }}>
                        <Button title='Minggu' onPress={() => { setBtnColor('Minggu') }} color={btnMinggu} ></Button>
                    </View>
                </View>
            </View>
            <View style={{ padding: 10 }}>
                <Button title='konfirmasi' onPress={() => { _confirm() }} />
            </View>
        </View>
    )
}

export default ServiceRateOptionDays