import React, {Component} from 'react';
// import ReactDOM from 'react-dom'
import {View, ListView, StyleSheet, Text, TouchableOpacity, TouchableHighlight} from 'react-native'
// import {Flex, WhiteSpace} from 'antd-mobile';
// import {Route} from 'react-router';
import {connect} from 'react-redux';
import Layer, {LayerRouter} from '../components/Layer'
// import zh from 'moment/locale/zh-cn'
// import {push} from 'react-router-redux';
// import {globalAction} from 'redux-subspace';
// import Layer, {LayerRouter} from '../components/Layer';

const styles = StyleSheet.create({

});


class LoginPage extends Component {
    componentDidMount = () => {

    }


    render() {
        return (
            <Layer>

                <View >
                    <Text>wulalal</Text>
                </View >

                <LayerRouter>
                </LayerRouter>
            </Layer>
        )
    }
}

export const MessageRouter = (getPath) => {
    return [
        //<Route key={'msgDetail'} path={getPath('msgdetail/:flowid')} component={Details} />
    ]
}

const mapState = (state, props) => {
    return {

    }
}

const mapDispatch = (dispatch) => {
    return {
        dispatch,

    }
}

export default connect(mapState, mapDispatch)(LoginPage);