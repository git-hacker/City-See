import React, { Component } from 'react';
import { StyleSheet,View } from 'react-native';
import Spinner from 'react-native-spinkit';

const styles = StyleSheet.create({
    root: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        backgroundColor: 'rgba(108, 108, 108, 0.14)'

    },
    inner: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        marginLeft: -15,
        marginTop: -40
    }

});

class SpinnerEx extends Component {
    render() {
        let color = 'red'
        let name = 'WanderingCubes';
        if (this.props.color) {
            color = this.props.color;
        }
        if (this.props.type) {
            name = this.props.type;
        }
       
        return (
            <View  style={[styles.root, this.props.style] }>
                <Spinner style={styles.inner} color={color} type={name} />
            </View>
        )
    }
}

export default SpinnerEx;