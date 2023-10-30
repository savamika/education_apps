import React, { useState, useEffect, useRef } from 'react'
import { View, Text, ScrollView, SafeAreaView, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { Appbar, Button, TextInput, Snackbar, Card, Title, Paragraph, Dialog, Portal } from 'react-native-paper';
import * as  config from '../common/config'
import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';

import BCA from '../assets/bca.svg';
import BNI from '../assets/bni.svg';
import BRI from '../assets/bri.svg';

const Donasi = ({ navigation }) => {
    const [nominalNominasi, setnominalNominasi] = useState();
    const [nominalNominasiView, setnominalNominasiView] = useState();
    const goBack = (navigation) => {
        navigation.goBack()
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <Appbar.Header mode='small'>
                    <Appbar.BackAction onPress={() => { goBack(navigation) }} />
                    <Appbar.Content mode='small' titleStyle={{ fontSize: 14, fontWeight: 'bold' }} title="Donasi" />
                </Appbar.Header>
            </View>
            <View style={{ flex: 10, padding: 20 }}>
                <View>
                    <Text style={{ fontSize: 32, color: config.color.primery2, fontWeight: 'bold' }}>Hi Teman Baik!</Text>
                </View>
                <View>
                    <Text>Hasil donasi anda akan kami gunakan untuk mengembangkan aplikasi dsupaya menjadi labih baik</Text>
                </View>
                <View style={{ marginTop: 10 }}>
                    <Text style={{ fontWeight: 'bold' }}>Jumlah Donasi</Text>
                </View>
                <View style={{ marginTop: 10, flexDirection: 'row', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => { setnominalNominasi('10000'); setnominalNominasiView('Rp. 10.000'); }}><Text style={{ fontSize: 16, fontWeight: 'bold', color: config.color.primery2, margin: 20 }}>Rp. 10.000</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => { setnominalNominasi('50000'); setnominalNominasiView('Rp. 50.000'); }}><Text style={{ fontSize: 16, fontWeight: 'bold', color: config.color.primery2, margin: 20 }}>Rp. 50.000</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => { setnominalNominasi('100000'); setnominalNominasiView('Rp. 100.000'); }}><Text style={{ fontSize: 16, fontWeight: 'bold', color: config.color.primery2, margin: 20 }}>Rp. 100.000</Text></TouchableOpacity>
                </View>
                <View>
                    <TextInput
                        placeholder='Rp. 0'
                        value={nominalNominasiView}
                        mode="outlined"
                        editable={false}
                        placeholderTextColor={config.color.abuabu}
                    />
                </View>
                <View style={{ marginTop: 30 }}>
                    <Text style={{ fontWeight: 'bold' }}>Metode Pembaran</Text>
                </View>
                <View>
                    <Card style={{ marginTop: 10 }}>
                        <Card.Content>
                            <View style={{ height: 25, flexDirection: 'row' }}>
                                <View style={{ flex: 11 }}>
                                    <View>
                                        <Text style={{ fontSize: 12 }}>Bank BCA Virtual Account</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text><BCA /></Text>
                                        <Text style={{ fontSize: 12, fontWeight: 'bold', marginLeft: 5 }}>321168621616165</Text>
                                    </View>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <Icon size={15} name='arrow-right' />
                                </View>
                            </View>
                        </Card.Content>
                    </Card>
                    <Card style={{ marginTop: 10 }}>
                        <Card.Content>
                            <View style={{ height: 25, flexDirection: 'row' }}>
                                <View style={{ flex: 11 }}>
                                    <View>
                                        <Text style={{ fontSize: 12 }}>Bank BNI Virtual Account</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text><BNI /></Text>
                                        <Text style={{ fontSize: 12, fontWeight: 'bold', marginLeft: 5 }}>364698445415161</Text>
                                    </View>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <Icon size={15} name='arrow-right' />
                                </View>
                            </View>
                        </Card.Content>
                    </Card>
                    <Card style={{ marginTop: 10 }}>
                        <Card.Content>
                            <View style={{ height: 25, flexDirection: 'row' }}>
                                <View style={{ flex: 11 }}>
                                    <View>
                                        <Text style={{ fontSize: 12 }}>Bank BRI Virtual Account</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text><BRI /></Text>
                                        <Text style={{ fontSize: 12, fontWeight: 'bold', marginLeft: 5 }}>56416816586846</Text>
                                    </View>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <Icon size={15} name='arrow-right' />
                                </View>
                            </View>
                        </Card.Content>
                    </Card>
                    <Card style={{ marginTop: 10 }}>
                        <Card.Content>
                            <View style={{ height: 25, flexDirection: 'row', justifyContent: 'center' }}>
                                <View style={{ flex: 11 }}>
                                    <Text style={{ fontSize: 12 }}>Tidak punya akun Bank diatas</Text>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <Icon size={15} name='arrow-right' />
                                </View>
                            </View>
                        </Card.Content>
                    </Card>

                </View>
            </View>
        </View>

    )


}

export default Donasi;
