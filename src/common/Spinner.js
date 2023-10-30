import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

const style = StyleSheet.create({
    spinnerTextStyle: {
        color: '#FFF'
    },
})
const Spinners = (props) => {
    const [visibleSpinner, setVisibleSpinner] = useState(false);
    let message = '';
    if (props.message == 'undefined' || props.message == '') {
        message = 'Loading...';
    } else {
        message = props.message
    }
    return (
        <Spinner
            visible={props.visible}
            textContent={message}
            textStyle={style.spinnerTextStyle}
        />
    )
}

export default Spinners