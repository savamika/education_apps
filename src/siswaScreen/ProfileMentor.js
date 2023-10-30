import React, { useState, useCallback, useRef, useEffect } from 'react'
import { RefreshControl, TouchableOpacity, View, Text, ScrollView, SafeAreaView, PermissionsAndroid, Dimensions, StyleSheet, Alert, ImageBackground } from 'react-native';
import { Button, Appbar, TextInput, Avatar, Card, Title, Paragraph, Snackbar, Chip, Searchbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as  config from '../common/config'
import * as string from '../common/String'
import RNFetchBlob from 'rn-fetch-blob';

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        // backgroundColor: 'black'
    },
    square: {
        width: '30%',
        height: 40,
        marginRight: 5,
        marginLeft: 5
    },
    spinnerTextStyle: {
        color: '#FFF'
    },
});


const ProfileMentor = ({ route, navigation }) => {
    const [visibleNotif, setVisibleNotif] = useState(false);
    const [messageNotif, setMessageNotif] = useState(false);

    const dataProfile = route.params.data;
    const searchParam = route.params.param;
    const width = Dimensions.get('window').width;
    const btnBottom = (width / 2) - 10;

    const fileUrl = dataProfile.file_cv;

    const onToggleSnackBar = () => setVisibleNotif(!visibleNotif);
    const onDismissSnackBar = () => setVisibleNotif(false);

    const goBack = (navigation) => {
        console.log('back');
        navigation.goBack()
    }

    const checkPermission = async () => {

        // Function to check the platform
        // If Platform is Android then check for permissions.

        if (Platform.OS === 'ios') {
            downloadFile();
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'Storage Permission Required',
                        message:
                            'Application needs access to your storage to download File',
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    // Start downloading
                    downloadFile();
                    console.log('Storage Permission Granted.');
                } else {
                    // If permission denied then show alert
                    Alert.alert('Error', 'Storage Permission Not Granted');
                }
            } catch (err) {
                // To handle permission related exception
                console.log("++++" + err);
            }
        }
    };


    const downloadFile = () => {

        // Get today's date to add the time suffix in filename
        let date = new Date();
        // File URL which we want to download
        let FILE_URL = fileUrl;
        // Function to get extention of the file url
        let file_ext = getFileExtention(FILE_URL);

        file_ext = '.' + file_ext[0];

        // config: To get response by passing the downloading related options
        // fs: Root directory path to download
        const { config, fs } = RNFetchBlob;
        let RootDir = fs.dirs.PictureDir;
        let options = {
            fileCache: true,
            addAndroidDownloads: {
                path:
                    RootDir +
                    '/file_' +
                    Math.floor(date.getTime() + date.getSeconds() / 2) +
                    file_ext,
                description: 'downloading file...',
                notification: true,
                // useDownloadManager works with Android only
                useDownloadManager: true,
            },
        };
        config(options)
            .fetch('GET', FILE_URL)
            .then(res => {
                // Alert after successful downloading
                console.log('res -> ', JSON.stringify(res));
                // setMessageNotif((s)=>'nice! download berhasil')
                setMessageNotif((s) => string.text.DOWNLOAD_SUCCESS)
                setVisibleNotif((s) => true);
            });
    };

    const getFileExtention = fileUrl => {
        // To get the file extension
        return /[.]/.exec(fileUrl) ?
            /[^.]+$/.exec(fileUrl) : undefined;
    };

    useEffect(() => {

    }, [])

    return (
        <View style={{ backgroundColor: config.color.white }}>
            <ScrollView style={{ height: '90%' }}>
                <SafeAreaView style={{ paddingLeft: 10, paddingRight: 10 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Appbar.BackAction onPress={() => { goBack(navigation) }} />
                    </View>
                    <View style={{ flexDirection: 'row', padding: 5 }}>
                        <View style={{ flex: 5, borderRadius: 30, padding: 10, height: 170, width: 120 }}>
                            <ImageBackground
                                // source={require('../assets/profilfoto.png')}
                                source={{ uri: dataProfile.picture }}
                                resizeMethod='scale'
                                style={{ width: '100%', height: '100%', flexDirection: 'row', justifyContent: 'flex-end' }}
                                imageStyle={{ borderRadius: 5 }}
                            >

                            </ImageBackground>
                        </View>
                        <View style={{ padding: 5, flex: 7 }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{dataProfile.firstname} {dataProfile.lastname}</Text>
                            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                                <Chip style={{ fontWeight: 'bold', backgroundColor: config.color.primery, color: 'white' }} >
                                    <Icon name='check' color="white"></Icon>
                                    <Text icon='check' style={{ color: 'white', fontSize: 10 }}>
                                        Private Offline
                                    </Text>
                                </Chip>
                                {/* <Chip style={{ marginLeft: 5, fontWeight: 'bold', backgroundColor: config.color.primery, color: 'white' }} >
                                    <Icon name='check' color="white"></Icon>
                                    <Text icon='check' style={{ color: 'white', fontSize: 10 }}>
                                        Kelas Online
                                    </Text>
                                </Chip> */}
                            </View>
                            <View style={{ paddingTop: 5, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ flex: 1 }}>
                                    <FontAwesome5 color={config.color.gold} name='book' size={12} style={{ marginRight: 5 }} />
                                </View>
                                <View style={{ flex: 11 }}>
                                    <Text style={{ fontSize: 12 }}>{dataProfile.skill} - {dataProfile.sub_skill}</Text>
                                </View>
                            </View>
                            <View style={{ paddingTop: 5, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ flex: 1 }}>
                                    {/* <FontAwesome name='book' size={12} style={{ marginRight: 5 }} /> */}
                                    <FontAwesome5 color={config.color.primery} name='map-marker-alt' size={12} style={{ marginRight: 5 }} />
                                </View>
                                <View style={{ flex: 11 }}>
                                    <Text style={{ fontSize: 12 }}>{dataProfile.city}</Text>
                                </View>
                            </View>
                            <View style={{ paddingTop: 5, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ flex: 1 }}>
                                    {/* <FontAwesome name='book' size={12} style={{ marginRight: 5 }} /> */}
                                    <FontAwesome5 color='#219653' name='money-bill' size={12} style={{ marginRight: 5 }} />
                                </View>
                                <View style={{ flex: 11 }}>
                                    <Text style={{ fontSize: 12 }}>{config.formatRupiah(dataProfile.service_fee, 'Rp.')}/jam</Text>
                                </View>
                            </View>
                        </View>


                    </View>
                    <View style={[styles.container, { flex: 2, height: 80 }]}>
                        <View style={styles.square}>
                            <Card >
                                <Card.Content style={{ alignItems: 'center', paddingTop: 0 }}>
                                    <Paragraph>

                                        <Title style={{ fontSize: 10 }}>Rating</Title>
                                    </Paragraph>
                                    <Paragraph>
                                        <Icon name='star' color={config.color.gold} />
                                        <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{dataProfile.rating}</Text>
                                    </Paragraph>
                                </Card.Content>
                            </Card>
                        </View>
                        <View style={styles.square}>
                            <Card>
                                <Card.Content style={{ marginTop: 0, alignItems: 'center', paddingTop: 0 }}>
                                    <Paragraph>
                                        <Title style={{ fontSize: 10 }}>Jumlah Siswa</Title>
                                    </Paragraph>
                                    <Paragraph>
                                        <Icon name='user-graduate' color={config.color.primery} />
                                        <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{dataProfile.siswa}</Text>
                                    </Paragraph>
                                </Card.Content>
                            </Card>
                        </View>
                        <View style={styles.square}>
                            <Card>
                                <Card.Content style={{ marginTop: 0, alignItems: 'center', paddingTop: 0 }}>
                                    <Paragraph>
                                        <Title style={{ fontSize: 10 }}>Review</Title>
                                    </Paragraph>
                                    <Paragraph>
                                        <Icon name='comment' color={config.color.primery} />
                                        <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{dataProfile.review}</Text>
                                    </Paragraph>
                                </Card.Content>
                            </Card>
                        </View>
                    </View>
                    <View>
                        <Button
                            mode="contained"
                            style={{ backgroundColor: config.color.gold }}
                            onPress={async () => {
                                checkPermission();
                            }}
                            icon="arrow-collapse-down"
                        >
                            Unduh CV Mentor</Button>
                    </View>
                    <View style={{ paddingTop: 10 }}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Tentang Pengajar</Text>
                        <Paragraph style={{ fontSize: 12 }}>
                            {dataProfile.about_mentor}
                        </Paragraph>
                    </View>
                </SafeAreaView>
            </ScrollView>
            <View style={{ backgroundColor: 'white', height: '10%', elevation: 20 }}>
                <View style={{ flexDirection: 'row', margin: 10, justifyContent: 'center' }}>
                    <Button
                        mode="contained"
                        buttonColor={config.color.abuabu}
                        style={{ width: btnBottom, marginRight: 5 }}
                        onPress={async () => {

                        }}
                        icon="comment-processing-outline"
                    >
                        Chat</Button>
                    <Button
                        mode="contained"
                        buttonColor={config.color.primery}
                        style={{ width: btnBottom }}
                        onPress={async () => {
                            navigation.navigate('BookingForm', { data: dataProfile, searchParam: searchParam })
                        }}
                        icon="calendar-blank-outline"
                    >
                        Booking</Button>
                </View>

            </View>


            <Snackbar
                visible={visibleNotif}
                onDismiss={onDismissSnackBar}
                duration={1000}
            >
                {messageNotif}
            </Snackbar>
        </View>
    )
}

export default ProfileMentor