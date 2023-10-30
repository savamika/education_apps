import React, { createContext, useState, useEffect } from 'react';
import { Button, View } from 'react-native';
import { BottomNavigation, Text } from 'react-native-paper';


import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
// import Mentor from './mentorScreen/flex'


//GENERAL
import LoginPage from './login/Login'
import Registrasi from './registrasi/Registrasi'
import Otp from './login/OTP'
import ForgetPassword from './login/ForgetPassword';
import Guide from './login/Guide';
import Donasi from './login/Donasi';

//SISWA
import HomeSiswa from './siswaScreen/Home'
import ProfileSiswa from './siswaScreen/ProfileSiswa'
import SearchMentor from './siswaScreen/SearchMentor'
import BottomNavigationSiswa from './BottomNavigation/BottomNavigationSiswa'
import PrivateMentorTabNavigation from './siswaScreen/PrivateMentorTabNavigation'
import SearchResult from './siswaScreen/SearchResult';
import ProfileMentor from './siswaScreen/ProfileMentor';
import BookingForm from './siswaScreen/BookingForm';
import GiveRatingMentor from './siswaScreen/GiveRatingMentor';
import BookingList from './siswaScreen/BookingList';
import DetailPertemuan from './siswaScreen/DetailPertemuan';
import DetailPembayaran from './siswaScreen/DetailPembayaran';
import ProfileDataDiri from './siswaScreen/ProfileDataDiri';

//MENTOR
import Mentor from './mentorScreen/homeScreen'
import StatusAktivasi from './mentorScreen/statusAktivasi'
import AktivasiAkunMentor from './mentorScreen/aktifasiAkunMentor'
import Profile from './mentorScreen/Profile'
import ProfileDataDiriMentor from './mentorScreen/ProfileDataDiriMentor'
import PermintaanPertemuan from './mentorScreen/PermintaanPertemuan';
import DetailPertemuanMentor from './mentorScreen/DetailPertemuanMentor';
import SesiPertemuanSelesai from './mentorScreen/SesiPertemuanSelesai';
import DetailPembayaranMentor from './mentorScreen/DetailPembayaranMentor';
import PertemuanSelesaiMentor from './mentorScreen/PertemuanSelesaiMentor';
import PermintaanPertemuanList from './mentorScreen/PermintaanPertemuanList';
import BottomNavigationMentor from './BottomNavigation/BottomNavigationMentor'


import NotifRequest from './siswaScreen/NotifRequest';




const Stack = createNativeStackNavigator();


function App() {

    return (
        <>
            <NavigationContainer independent={true}>
                <Stack.Navigator
                    // initialRouteName={initial}
                    initialRouteName='Login'
                    // initialRouteName='Donasi'
                    // initialRouteName='BottomNavigation'
                    // initialRouteName='ProfileMentor'
                    // initialRouteName='DetailPertemuan'
                    // initialRouteName='NotifRequest'
                    // initialRouteName='GiveRatingMentor'
                    // initialRouteName='ProfileSiswa'
                    // initialRouteName='BookingList'
                    // initialRouteName='OTP'

                    // initialRouteName='ProfileMentorFromMentor'
                    // initialRouteName='DetailPertemuanMentor'
                    // initialRouteName='SesiPertemuanSelesai'
                    // initialRouteName='PermintaanPertemuanList'
                    // initialRouteName='ForgetPassword'
                    // initialRouteName='StatusAktivasi'

                    screenOptions={{
                        headerShown: false
                    }}
                >
                    {/* GENERAL */}
                    <Stack.Screen name="Login" component={LoginPage} />
                    <Stack.Screen name="Registrasi" component={Registrasi} />
                    <Stack.Screen name="OTP" component={Otp} />
                    <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
                    <Stack.Screen name="Guide" component={Guide} />
                    <Stack.Screen name="Donasi" component={Donasi} />

                    {/* SISWA */}
                    <Stack.Screen name="HomeSiswa" component={HomeSiswa} />
                    <Stack.Screen name="ProfileSiswa" component={ProfileSiswa} />
                    <Stack.Screen name="SearchMentor" component={SearchMentor} />
                    <Stack.Screen name="PrivateMentor" component={PrivateMentorTabNavigation} />
                    <Stack.Screen name="BottomNavigation" component={BottomNavigationSiswa} />
                    <Stack.Screen name="SearchResult" component={SearchResult} />
                    <Stack.Screen name="ProfileMentor" component={ProfileMentor} />
                    <Stack.Screen name="BookingForm" component={BookingForm} />
                    <Stack.Screen name="DetailPertemuan" component={DetailPertemuan} />
                    <Stack.Screen name="DetailPembayaran" component={DetailPembayaran} />
                    <Stack.Screen name="GiveRatingMentor" component={GiveRatingMentor} />
                    <Stack.Screen name="NotifRequest" component={NotifRequest} />
                    <Stack.Screen name="BookingList" component={BookingList} />
                    <Stack.Screen name="ProfileDataDiri" component={ProfileDataDiri} />

                    {/* MENTOR */}
                    <Stack.Screen name="HomeMentor" component={Mentor} />
                    <Stack.Screen name="AktivasiAkunMentor" component={AktivasiAkunMentor} />
                    <Stack.Screen name="StatusAktivasi" component={StatusAktivasi} />
                    <Stack.Screen name="ProfileMentorFromMentor" component={Profile} />
                    <Stack.Screen name="PermintaanPertemuan" component={PermintaanPertemuan} />
                    <Stack.Screen name="DetailPertemuanMentor" component={DetailPertemuanMentor} />
                    <Stack.Screen name="SesiPertemuanSelesai" component={SesiPertemuanSelesai} />
                    <Stack.Screen name="DetailPembayaranMentor" component={DetailPembayaranMentor} />
                    <Stack.Screen name="PertemuanSelesaiMentor" component={PertemuanSelesaiMentor} />
                    <Stack.Screen name="PermintaanPertemuanList" component={PermintaanPertemuanList} />
                    <Stack.Screen name="ProfileDataDiriMentor" component={ProfileDataDiriMentor} />
                    <Stack.Screen name="BottomNavigationMentor" component={BottomNavigationMentor} />

                </Stack.Navigator>
            </NavigationContainer>

        </>



    )
}
export default App;
