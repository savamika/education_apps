import React from 'react'
import { RefreshControl, View, Text, ScrollView, SafeAreaView, StatusBar, Dimensions, StyleSheet, Image, ImageBackground } from 'react-native';
import { Appbar, BottomNavigation, TextInput, Button, Avatar, Card, Title, Paragraph, Dialog, Searchbar } from 'react-native-paper';
import HomeSiswa from '../siswaScreen/Home'
import ProfileMentor from '../mentorScreen/homeScreen'
import BookingList from '../mentorScreen/PermintaanPertemuanList'
import Chat from '../common/Chat'

const BottomNavigationMentor = ({ navigation }) => {

    const HomeSiswaPage = () => <HomeSiswa navigation={navigation} />;
    const MessageRoute = () => <Chat navigation={navigation} />;
    const RecentsRoute = () => <BookingList navigation={navigation} />;
    const NotificationsRoute = () => <Text>Notifications</Text>;
    const Hand = () => <Text>Hand</Text>;
    const profile = () => <ProfileMentor navigation={navigation} />;

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'homeSiswa', title: 'Favorites', focusedIcon: 'home-variant', unfocusedIcon: 'home-variant-outline' },
        { key: 'message', title: 'message', focusedIcon: 'message', unfocusedIcon: 'message-outline' },
        { key: 'recents', title: 'Recents', focusedIcon: 'ticket-confirmation', unfocusedIcon: 'ticket-confirmation-outline' },
        { key: 'hand', title: 'Hand', focusedIcon: 'hand-back-right', unfocusedIcon: 'hand-back-right-outline' },
        { key: 'profile', title: 'Notifications', focusedIcon: 'account', unfocusedIcon: 'account-outline' },
        // { key: 'profile', title: 'Notifications', focusedIcon: 'bell', unfocusedIcon: 'bell-outline' },
    ]);

    const renderScene = BottomNavigation.SceneMap({
        homeSiswa: HomeSiswaPage,
        message: MessageRoute,
        recents: RecentsRoute,
        notifications: NotificationsRoute,
        hand: Hand,
        profile: profile
    });
    return (

        <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene}
            sceneAnimationEnabled={true}
            sceneAnimationType='shifting'
            labeled={false}
            barStyle={{ height: '10%', paddingTop: -100 }}
            style={{ backgroundColor: 'red' }}
            safeAreaInsets={{ bottom: 10 }}
        />
    )
}

export default BottomNavigationMentor;
