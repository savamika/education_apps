import React from 'react'
import { View, Text, ScrollView, SafeAreaView, Dimensions, StyleSheet } from 'react-native';
import { Paragraph, Dialog, Portal } from 'react-native-paper';
const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
    },
})
const Alert = (props) => {
    var icon = '';
    if (props.icon == "" || props.icon == null || props.icon == 'undefined') {
        icon = "alert";
    } else {
        icon = props.icon;
    }

    return (
        <Portal>
            <Dialog visible={props.visible} onDismiss={props.hideDialog}>
                <Dialog.Icon icon={icon} />
                <Dialog.Title style={styles.title}>{props.title}</Dialog.Title>
                <Dialog.Content>
                    <Paragraph>{props.description}</Paragraph>
                </Dialog.Content>
            </Dialog>
        </Portal>

    )
}

export default Alert;
