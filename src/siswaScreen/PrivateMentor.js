import * as React from 'react';
import {
    Animated,
    View,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    RefreshControl, Text, ScrollView, SafeAreaView, Dimensions, Image, ImageBackground
} from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { Appbar, TextInput, Button, Avatar, Card, Title, Paragraph, Dialog, Searchbar } from 'react-native-paper';
import * as  config from '../common/config'

import Regular from './Regular'
import Harian from './Harian';



const goBack = (navigation) => {
    console.log('back');
    navigation.goBack()
}

export default class TabViewExample extends React.Component {
    state = {
        index: 0,
        routes: [
            { key: 'harian', title: 'Harian' },
            { key: 'regular', title: 'Ragular' },
        ],
    };

    FirstRoute = () => (
        <Harian navigation={this.props.navigation} />
    );


    SecondRoute = () => (
        <Regular navigation={this.props.navigation} />
    );

    _handleIndexChange = (index) => this.setState({ index });

    _renderTabBar = (props) => {
        const inputRange = props.navigationState.routes.map((x, i) => i);

        return (
            <View>
                <View style={styles.tabBar}>

                    {props.navigationState.routes.map((route, i) => {
                        const opacity = props.position.interpolate({
                            inputRange,
                            outputRange: inputRange.map((inputIndex) =>
                                inputIndex === i ? 1 : 0.5
                            ),
                        });

                        return (
                            <TouchableOpacity
                                style={styles.tabItem}
                                onPress={() => this.setState({ index: i })}>
                                <Animated.Text style={{ opacity, fontWeight: 'bold', color: 'white' }}>{route.title}</Animated.Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

        );
    };

    _renderScene = SceneMap({
        harian: this.FirstRoute,
        regular: this.SecondRoute,
    });

    render() {
        return (
            <TabView
                navigationState={this.state}
                renderScene={this._renderScene}
                renderTabBar={this._renderTabBar}
                onIndexChange={this._handleIndexChange}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: config.color.primery2
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
        backgroundColor: config.color.primery2
    },
});
