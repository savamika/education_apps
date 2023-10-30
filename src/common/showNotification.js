import { View, StyleSheet } from 'react-native';
import { Button, Snackbar } from 'react-native-paper';


const ShowNotif = (props) => {
    var duration = 1500;

    if (props.duration == '' || typeof (props.duration) == 'undefined') {

    } else {
        duration = props.duration;
    }



    return (
        <View style={styles.container}>
            <Snackbar
                visible={props.visible}
                onDismiss={typeof (props.actionDismissSnackBaron) == 'undefined' ? {} : props.actionDismissSnackBaron}
                action={props.action}
                duration={duration}
            >
                {props.message}
            </Snackbar>
        </View>

    )

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
});

export default ShowNotif;
