import React from "react";
import { StyleSheet, View, Text } from "react-native";

export default function App() {
    return (
        <View style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <View style={{ backgroundColor: "#7CA1B4", width: '100%', flex: 1 }}>
                <Text>Left</Text>
            </View>
            <View style={{ backgroundColor: "#7cb48f", width: '100%', flex: 2 }}>
                <Text>Right</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#7CA1B4",
        flex: 1,
        alignItems: "center", // ignore this - we'll come back to it
        justifyContent: "center", // ignore this - we'll come back to it
        flexDirection: "row",
    },
    square: {
        backgroundColor: "#7cb48f",
        width: 100,
        height: 100,
        margin: 4,
    },
});