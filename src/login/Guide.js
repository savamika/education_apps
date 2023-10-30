import React, { useRef, useState } from 'react';
import * as config from '../common/config'
import { Animated, Dimensions, Text, View, SafeAreaView, FlatList, Image, StatusBar } from 'react-native';
import Pagination from './Pagination';
import { Button } from 'react-native-paper';
import Spinner from '../common/Spinner';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Guide = ({ navigation }) => {
    const width = Dimensions.get('screen').width;
    const [initialScrollIndex, setInitialScrollIndex] = useState(0)
    const flatSlide = useRef();
    const [spinnervisible, setSpinnervisible] = useState(false);

    const slide = [
        <>
            <Image source={require('../assets/Presentation.png')} />
            <Text style={{ fontSize: 18, color: 'white', fontWeight: 'bold' }}>Semua Mata Pelajaran</Text>
            <Text style={{ fontSize: 12, color: 'white', textAlign: 'center' }}>Berbagai macam mata pelajaran dan instruktur yang sesuai</Text>
            <Button
                style={{ backgroundColor: config.color.gold, marginTop: 20 }}
                mode="contained"
                icon="arrow-right"
                onPress={() => {
                    flatSlide.current?.scrollToIndex({
                        index: 1,
                        Animated: true
                    });
                }}>lanjut</Button>
        </>,
        <>
            <Image source={require('../assets/GradHat.png')} />
            <Text style={{ fontSize: 18, color: 'white', fontWeight: 'bold' }}>Lebih Berprestasi</Text>
            <Text style={{ fontSize: 12, color: 'white', textAlign: 'center' }}>Metode pembelajaran yang variatif dapat mempermudah balajarmu</Text>
            <Button
                style={{ backgroundColor: config.color.gold, marginTop: 20 }}
                mode="contained"
                icon="arrow-right"
                onPress={() => {
                    flatSlide.current?.scrollToIndex({
                        index: 2,
                        Animated: true
                    });
                }}>lanjut</Button>
        </>,
        <>
            <Image source={require('../assets/Bag.png')} />
            <Text style={{ fontSize: 18, color: 'white', fontWeight: 'bold' }}>Belajar Dari Mana Saja</Text>
            <Text style={{ fontSize: 12, color: 'white', textAlign: 'center' }}>Belajar dimana saja dengan pilihan mentor yang profesional</Text>
            <Button
                style={{ backgroundColor: config.color.gold, marginTop: 20 }}
                mode="contained"
                icon="arrow-right"
                onPress={() => {
                    setSpinnervisible((state) => true)
                    setTimeout(async () => {
                        await AsyncStorage.setItem('GUIDE', '1')
                        navigation.replace('Login')
                    }, 1500);
                }}>Selesai</Button>
        </>,
    ]

    const [index, setIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;

    const handleOnScroll = event => {
        Animated.event(
            [
                {
                    nativeEvent: {
                        contentOffset: {
                            x: scrollX,
                        },
                    },
                },
            ],
            {
                useNativeDriver: false,
            },
        )(event);
    };

    const handleOnViewableItemsChanged = useRef(({ viewableItems }) => {
        // console.log('viewableItems', viewableItems);
        setIndex(viewableItems[0].index);
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    const ItemView = ({ item }) => {
        return (
            <View style={{ backgroundColor: config.color.primery2, width: width, justifyContent: 'center', alignItems: 'center' }}>
                {item}
            </View>
        );
    };

    const ItemSeparatorView = () => {
        return (
            // Flat List Item Separator
            <View
                style={{
                    height: 0.5,
                    width: 0,
                    backgroundColor: '#white',
                }}
            />
        );
    };
    return (
        <View style={{ height: '100%', flex: 1 }}>
            <StatusBar backgroundColor={config.color.primery2} />
            <Spinner visible={spinnervisible} />
            <SafeAreaView >
                <FlatList
                    ref={flatSlide}
                    initialScrollIndex={initialScrollIndex}
                    data={slide}
                    keyExtractor={(item, index) => {
                        return index.toString();
                    }}
                    ItemSeparatorComponent={ItemSeparatorView}
                    renderItem={ItemView}
                    horizontal={true}
                    pagingEnabled={true}
                    style={{ height: '100%' }}
                    snapToAlignment="center"
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleOnScroll}
                    onViewableItemsChanged={handleOnViewableItemsChanged}
                    viewabilityConfig={viewabilityConfig}
                />
                <Pagination data={slide} scrollX={scrollX} index={index} />
            </SafeAreaView>
        </View>
    )
}

export default Guide