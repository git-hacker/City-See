import React, {Component} from 'react';
// import ReactDOM from 'react-dom'
import {View, ListView, StyleSheet, Text, TouchableOpacity, TouchableHighlight, Image} from 'react-native'
import {Button, Flex, InputItem, List} from 'antd-mobile';
// import {Route} from 'react-router';
import {connect} from 'react-redux';
import Layer, {LayerRouter} from '../../components/Layer';
import SubNavBar from '../../components/SubNavBar';

const identityCodeImg = require('../../images/identityCode.png');
const userNameImg = require('../../images/userName.png');
const pwdImg = require('../../images/pwd.png');
const styles = StyleSheet.create({
    frontColor: {
        color: '#f94771',
        alignContent: 'center',
        alignItems: 'center'
    },
    inputImg: {
        width: 32,
        height: 32,
        alignContent: 'center'
    },
    inlineBlock: {
        flexDirection: 'row'

    }
});


class ForgetPwdPage extends Component {
    componentDidMount = () => {

    }

    forgetPwd = () => {//忘记密码

    }
    UserRegister = () => {//用户注册

    }

    render() {
        return (
            <Layer style={{flexDirection: 'column', paddingBottom: 5}}>
                <SubNavBar title='忘记密码'>
                    <View style={{flex: 3, padding: 30, paddingTop: 10}}>
                        <Flex>
                            <Flex.Item style={{flex: 1}}><Image source={userNameImg} style={[styles.inputImg]} /></Flex.Item>
                            <Flex.Item style={{flex: 9}}><List><InputItem placeholder='+86 手机号码' /></List></Flex.Item>
                        </Flex>
                        <Flex style={{marginTop: 10}}>
                            <Flex.Item style={{flex: 1}}><Image source={pwdImg} style={[styles.inputImg]} /></Flex.Item>
                            <Flex.Item style={{flex: 9}}><List><InputItem placeholder='设置新密码' /></List></Flex.Item>
                        </Flex>
                        <Flex style={{marginTop: 10}}>
                            <Flex.Item style={{flex: 1}}><Image source={identityCodeImg} style={[styles.inputImg]} /></Flex.Item>
                            <Flex.Item style={{flex: 5}}><List><InputItem placeholder='请输入验证码' /></List></Flex.Item>
                            <Flex.Item style={{flex: 5}}><Button><Text style={{color: '#f94771'}}>获取验证码</Text></Button></Flex.Item>
                        </Flex>
                        <Flex>
                            <Flex.Item style={{marginTop: 30}}><Button type="warning" style={{borderRadius: 22, backgroundColor: '#f94771'}}><Text>开启眷城</Text></Button></Flex.Item>
                        </Flex>
                    </View>
                    <LayerRouter>
                    </LayerRouter>
                </SubNavBar>
            </Layer >
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

export default connect(mapState, mapDispatch)(ForgetPwdPage);