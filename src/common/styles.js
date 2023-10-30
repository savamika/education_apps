import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import './colors';
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    containerPage: {
        flex: 1,
        padding: 20
    },
    container: {
        borderRadius: 15,
        padding: 0,
        height: 150,
        backgroundColor: global.colors.accent,
        justifyContent: 'flex-start',
        alignItems: 'center',
        shadowColor: "#fff",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
    },
    imgContainer: {
        height: '90%',
        width: '80%',
        bottom: 0,
        right: 1,
        backgroundColor: 'transparent',
        position: 'absolute',
        borderBottomEndRadius: 14,
        borderTopStartRadius: 14,
    },
    innerContainer: {
        borderRadius: 15,
        padding: 10,
        height: 120,
        width: '100%',
        backgroundColor: '#95a5a6',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    img: {
        width: '80%',
        height: '90%',
        position: 'absolute',
        bottom: 5,
        right: 5,
    },
    menuContainer: {
        height: 'auto',
        width: width,
        paddingHorizontal: '5%',
        paddingTop: '20%',
        marginTop: 30,
        backgroundColor: '#f0f0f0',
        flexWrap: 'wrap',
        flexDirection: 'row',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
    },
    gridLabel: {
        position: 'absolute',
        top: 30,
        left: 30,
        textAlign: 'left',
        fontWeight: 'bold',
        color: global.colors.primary,
        fontSize: 16,
    },
    gridContainer: {
        width: '50%',
        height: 'auto',
        paddingHorizontal: '5%',
        backgroundColor: 'transparent'
    },
    gridItems: {
        width: '100%',
        height: 170,
        backgroundColor: 'transparent'
    },
    countContainer: {
        height: '40%',
        width: '30%',
        top: 0,
        left: 0,
        backgroundColor: '#9eacad',
        position: 'absolute',
        borderBottomEndRadius: 14,
        borderTopStartRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    count: {
        fontSize: 20,
        fontWeight: 'bold',
        color: global.colors.light,
    },
    countSmall: {
        fontSize: 10,
        fontWeight: 'bold',
        color: global.colors.light,
    },
    textContainer: {
        padding: 5,
        height: 25,
        width: 130,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textTitle: {
        textAlign: 'center',
        fontSize: 12,
        color: '#fff',
        fontWeight: '600',
    },
})

export default styles;