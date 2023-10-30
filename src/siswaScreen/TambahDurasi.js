import React, { useEffect, useState } from 'react'
import { Button, FlatList, RefreshControl, TouchableOpacity, View, Text, ScrollView, SafeAreaView, StatusBar, Dimensions, StyleSheet, Image, ImageBackground } from 'react-native';
import { Appbar, TextInput, Avatar, Card, Title, Paragraph, Dialog, Searchbar } from 'react-native-paper';
import * as config from '../common/config';

const TambahDurasi = (props) => {
    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);
    const responseJson = [
        // {
        //     "id": 0,
        //     "title": "00:00",
        //     "body": "00:00"
        // },
        {
            "id": 1,
            "title": "01:00",
            "body": 1
        },
        {
            "id": 2,
            "title": "02:00",
            "body": 2
        },
        {
            "id": 3,
            "title": "03:00",
            "body": 3
        },
        {
            "id": 4,
            "title": "04:00",
            "body": 4
        },
        {
            "id": 5,
            "title": "05:00",
            "body": 5
        },
        {
            "id": 6,
            "title": "06:00",
            "body": 6
        },
        {
            "id": 7,
            "title": "07:00",
            "body": 7
        },
        {
            "id": 8,
            "title": "08:00",
            "body": 8
        },
        {
            "id": 9,
            "title": "09:00",
            "body": 9
        },
        {
            "id": 10,
            "title": "10:00",
            "body": 10
        },
        {
            "id": 11,
            "title": "11:00",
            "body": 11
        },
        {
            "id": 12,
            "title": "12:00",
            "body": 12
        }
        // ,
        // {
        //     "id": 13,
        //     "title": "13:00",
        //     "body": "13:00"
        // },
        // {
        //     "id": 14,
        //     "title": "14:00",
        //     "body": "14:00"
        // },
        // {
        //     "id": 15,
        //     "title": "15:00",
        //     "body": "15:00"
        // },
        // {
        //     "id": 16,
        //     "title": "16:00",
        //     "body": "16:00"
        // },
        // {
        //     "id": 17,
        //     "title": "17:00",
        //     "body": "17:00"
        // },
        // {
        //     "id": 18,
        //     "title": "18:00",
        //     "body": "18:00"
        // },
        // {
        //     "id": 19,
        //     "title": "19:00",
        //     "body": "19:00"
        // },
        // {
        //     "id": 20,
        //     "title": "20:00",
        //     "body": "20:00"
        // },
        // {
        //     "id": 21,
        //     "title": "21:00",
        //     "body": "21:00"
        // },
        // {
        //     "id": 22,
        //     "title": "22:00",
        //     "body": "22:00"
        // },
        // {
        //     "id": 23,
        //     "title": "23:00",
        //     "body": "23:00"
        // },
        // {
        //     "id": 24,
        //     "title": "24:00",
        //     "body": "24:00"
        // }
    ]
    useEffect(() => {

        setFilteredDataSource(responseJson);
        setMasterDataSource(responseJson);
    }, [])

    const searchFilterFunction = (text) => {
        // Check if searched text is not blank
        if (text) {
            // Inserted text is not blank
            // Filter the masterDataSource and update FilteredDataSource
            const newData = masterDataSource.filter(function (item) {
                // Applying filter for the inserted text in search bar
                const itemData = item.title
                    ? item.title.toUpperCase()
                    : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFilteredDataSource(newData);
            setSearch(text);
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            setFilteredDataSource(masterDataSource);
            setSearch(text);
        }
    };

    const ItemView = ({ item }) => {
        return (
            // Flat List Item
            <Text style={styles.itemStyle} onPress={() => props.getItem(item)}>
                {/* {item.id}
                {'.'} */}
                {item.title.toUpperCase()}
            </Text>
        );
    };

    const ItemSeparatorView = () => {
        return (
            // Flat List Item Separator
            <View
                style={{
                    height: 0.5,
                    width: '100%',
                    backgroundColor: '#C8C8C8',
                }}
            />
        );
    };



    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                {/* <TextInput
                    style={styles.textInputStyle}
                    onChangeText={(text) => searchFilterFunction(text)}
                    value={search}
                    underlineColorAndroid="transparent"
                    placeholder="Search Here"
                /> */}
                <Searchbar
                    placeholder="Search"
                    placeholderTextColor={config.color.abuabu}
                    onChangeText={(text) => searchFilterFunction(text)}
                    value={search}
                />
                <FlatList
                    data={filteredDataSource}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={ItemSeparatorView}
                    renderItem={ItemView}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
    itemStyle: {
        padding: 10,
    },
    textInputStyle: {
        height: 40,
        borderWidth: 1,
        paddingLeft: 20,
        margin: 5,
        borderColor: '#009688',
        backgroundColor: '#FFFFFF',
    },
});
export default TambahDurasi;
