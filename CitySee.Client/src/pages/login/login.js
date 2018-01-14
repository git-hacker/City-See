import React, {Component} from 'react';
// import ReactDOM from 'react-dom'
import {View, ListView, StyleSheet, Text, TouchableOpacity, TouchableHighlight, Image} from 'react-native'
import {Button, Flex, InputItem, List, Toast} from 'antd-mobile';
import {Route} from 'react-router';
import {push} from 'react-router-redux';
import {connect} from 'react-redux';
import Layer, {LayerRouter} from '../../components/Layer';
import {login} from '../../constants/actionCreator';



const locationImg = require('../../images/loginLocation.png');
const backImg = require('../../images/loginBackground.png');
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


class LoginPage extends Component {
    state = {
        loginInfo: {
            username: '',
            password: ''
        }
    }
    componentDidMount = () => {

    }
    getPath = (path) => {
        console.log("path:======", `${this.props.match.url}${path}`);
        return `${this.props.match.url}${path}`
    }
    gotoPath = (path, par) => {
        this.props.dispatch(push(this.getPath(path), par));
    }

    forgetPwd = () => {//忘记密码
        this.gotoPath('ForgetPwdPage', null);
    }
    UserRegister = () => {//用户注册
        this.gotoPath('RegisterPage', null);
    }
    onFieldChange = (value, Field) => {
        let loginInfo = this.state.loginInfo;
        loginInfo[Field] = value;
        this.setState({loginInfo: loginInfo});
    }

    loginSubmit = () => {
        if (this.state.loginInfo.username.length === 0) {
            Toast.fail("请输入用户名");
            return;
        }
        if (this.state.loginInfo.password.length === 0) {
            Toast.fail("请输入密码");
            return;
        }
        console.log("提交的信息:" + JSON.stringify(this.state.loginInfo));
        this.props.dispatch(login(this.state.loginInfo));
    }

    render() {
        return (
            <Layer style={{flexDirection: 'column', paddingBottom: 5}}>
                <View style={{alignContent: 'center', alignItems: 'center', flex: 1}}>
                    <Image source={backImg} style={{width: '100%', marginTop: '-10%', height: 720, opacity: 0.88}} resizeMode={Image.resizeMode.scale} />
                </View>
                <View style={{flex: 3, padding: 30, paddingTop: 0}}>
                    <Flex style={{paddingBottom: 30}}>
                        <Flex.Item></Flex.Item>
                        <View style={{width: 60, height: 60}} ><Image style={{width: '100%', height: '100%'}} source={locationImg} /></View>
                        <Flex.Item></Flex.Item>
                    </Flex>
                    <Flex>
                        <Flex.Item style={{flex: 1}}><Image source={userNameImg} style={[styles.inputImg]} /></Flex.Item>
                        <Flex.Item style={{flex: 9}}><List><InputItem placeholder='+86 手机号码' value={this.state.loginInfo.username} onChange={(e) => this.onFieldChange(e, 'username')} /></List></Flex.Item>
                    </Flex>
                    <Flex style={{marginTop: 10}}>
                        <Flex.Item style={{flex: 1}}><Image source={pwdImg} style={[styles.inputImg]} /></Flex.Item>
                        <Flex.Item style={{flex: 9}}><List><InputItem placeholder='请输入密码' value={this.state.loginInfo.password} onChange={(e) => this.onFieldChange(e, 'password')} /></List></Flex.Item>
                    </Flex>
                    <Flex>
                        <Flex.Item style={{marginTop: 30}}><Button type="warning" style={{borderRadius: 22, backgroundColor: '#f94771'}} onClick={this.loginSubmit}>登录</Button></Flex.Item>
                    </Flex>
                    <Flex style={{marginTop: 15}}>
                        <Flex.Item style={{flex: 1}}><TouchableOpacity onPress={this.forgetPwd}><Text style={[styles.frontColor]}>忘记密码</Text></TouchableOpacity></Flex.Item>
                        <Flex.Item style={{flex: 1, alignItems: 'flex-end'}}><TouchableOpacity onPress={this.UserRegister}><Text style={styles.frontColor}>新用户注册</Text></TouchableOpacity></Flex.Item>
                    </Flex >
                </View>
                <View style={{justifyContent: 'flex-end'}}>
                    <Flex>
                        <Flex.Item style={{flex: 1}}></Flex.Item>
                        <Flex.Item style={[styles.inlineBlock, {flex: 4}]}>
                            <TouchableOpacity><Text style={styles.frontColor}>《服务协议》</Text></TouchableOpacity>
                            <TouchableOpacity style={[styles.inlineBlock, {marginLeft: 20}]}><Text>客服电话：</Text><Text style={styles.frontColor}>4001069818</Text></TouchableOpacity>
                        </Flex.Item>
                        <Flex.Item style={{flex: 1}}></Flex.Item>
                    </Flex >
                </View>
                {/* <LayerRouter>
                    <Route path={this.getPath('RegisterPage')} component={RegisterPage} />
                    <Route path={this.getPath('ForgetPwdPage')} component={ForgetPwdPage} />
                </LayerRouter> */}
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
        dispatch
    }
}

export default connect(mapState, mapDispatch)(LoginPage);