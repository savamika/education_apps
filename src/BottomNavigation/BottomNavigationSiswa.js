import React from 'react'
import { RefreshControl, View, Text, ScrollView, SafeAreaView, StatusBar, Dimensions, StyleSheet, Image, ImageBackground } from 'react-native';
import { Appbar, BottomNavigation, TextInput, Button, Avatar, Card, Title, Paragraph, Dialog, Searchbar } from 'react-native-paper';
import HomeSiswa from '../siswaScreen/Home'
import ProfileSiswa from '../siswaScreen/ProfileSiswa'
import BookingList from '../siswaScreen/BookingList'



const BottomNavigationSiswa = ({ navigation }) => {

    const HomeSiswaPage = () => <HomeSiswa navigation={navigation} />;
    const AlbumsRoute = () => <Text>album</Text>;
    const RecentsRoute = () => <BookingList navigation={navigation} />;
    const NotificationsRoute = () => <Text>Notifications</Text>;
    const Hand = () => <Text>Hand</Text>;
    const profile = () => <ProfileSiswa navigation={navigation} />;

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'homeSiswa', title: 'Favorites', focusedIcon: 'home-variant', unfocusedIcon: 'home-variant-outline' },
        { key: 'albums', title: 'Albums', focusedIcon: 'newspaper-variant', unfocusedIcon: 'newspaper-variant-outline' },
        { key: 'recents', title: 'Recents', focusedIcon: 'ticket-confirmation', unfocusedIcon: 'ticket-confirmation-outline' },
        { key: 'hand', title: 'Hand', focusedIcon: 'hand-back-right', unfocusedIcon: 'hand-back-right-outline' },
        { key: 'profile', title: 'Notifications', focusedIcon: 'account', unfocusedIcon: 'account-outline' },
        // { key: 'profile', title: 'Notifications', focusedIcon: 'bell', unfocusedIcon: 'bell-outline' },
    ]);

    const renderScene = BottomNavigation.SceneMap({
        homeSiswa: HomeSiswaPage,
        albums: AlbumsRoute,
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

export default BottomNavigationSiswa;
