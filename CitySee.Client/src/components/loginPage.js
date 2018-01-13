import React from 'react';
import {Platform,  View, Text, Image, TextInput, StyleSheet, Alert, StatusBar, Linking } from 'react-native'
import { reduxForm } from 'redux-form'
import {List, InputItem, Toast, Button, WhiteSpace, WingBlank } from 'antd-mobile'
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux'
import Layer from './Layer'
import ApiClient from '../utils/apiClient'
import { setAuthInfo, setAppList,setCurrentTool } from '../actions/actionCreators'
import Spinner from './Spinner'
import Baidu from '../Baidu'
import TrackService from '../utils/trackService'

const LOGIN_USER_RECORD_KEY = 'LOGINUSERNAME';
const u = global.unitPixel;
const styles = StyleSheet.create({
  root: {
    padding: 12
  },
  avator: {
    width: 64,
    height: 64,
    alignSelf: 'center',
    marginTop: 20+(StatusBar.currentHeight || 20),
    marginBottom: 20
  },
  avatorImage:{
    width: '100%',
    height: '100%'
  },
  faceUserName:{
    fontSize: 1.5*u,
    textAlign:'center',
    color:'#6e6e6e',
    marginTop: 10
  },
  input: {

  },
  btn: {

  },
  linkBtn: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderRadius: 0,
    color: 'red'
  },
  linkBtnText: {

    color: 'red'

  }
})


class LoginPage extends React.Component {



  constructor(props) {
    super(props);
    this.state = {
      userName: "admin",
      userPassword: "123456",
      userNameError: '',
      userPasswordError: '',
      picture: '',
      showPwd: false,
      loading: false,
      enableFace: false,
      enableSound: true,
      faceUserName:'',
      loginType: 'password'
    }
    if (process.env.NODE_ENV === 'development') {
      //  this.state.userName = 'XYH17080191';
      //  this.state.userPassword = '123456';
    }
  }
  componentWillMount() {
    //先检查storage中是否有用户名
    storage.load({
      key: LOGIN_USER_RECORD_KEY
    }).then(user => {
      //找到上次登录用户,

      this.setState({ userName: user.name, faceUserName: user.name, picture: user.picture });
      //获取刷脸参数
      let url = `${this.props.config.auth}/api/user/face/par`;
      return ApiClient.get(url, false, { username: user.name })
        .then(r => {
          let res = r.data || {};

          if (res.code === '0') {
            return res.extension || [];
          }
          throw { message: '' };
        });
    })
      .then(res => {
        //ENABLE_FACE_LOGIN
        //FACE_REGISTERED
        let faceLoginPar = res.find(x => x.parName === 'ENABLE_FACE_LOGIN') || {};
        let faceRegisteredPar = res.find(x => x.parName === 'FACE_REGISTERED') || {};
        if (faceLoginPar.parValue === '1' && faceRegisteredPar.parValue === '1') {
          this.setState({ loginType: 'face', enableFace: true })
        }
        let enableSound = res.find(x => x.parName === 'ENABLE_FACE_SOUND_TIP');
        if (enableSound && enableSound.parValue === '0') {
          this.setState({ enableSound: false });
        }

        return res;
      }).then(r => {
        this.setState({ loading: false })
      })
      .catch(err => {
        this.setState({ loading: false })
        if (err.name === 'NotFoundError' || err.name === 'ExpiredError') {

        } else {
          alert(`获取参数失败：${err.message || ''}`)
        }

      })

  };


  onErrorClick = (key) => {
    Toast.info(this.state[key], 2);
  }

  //点击登录按钮，触发后台接口提供的验证，对数据的处理等方法
  handleClick = () => {
  
    let hasError = false;
    this.setState({ userNameError: '', userPasswordError: '' })

    if (!this.state.userName) {
      hasError = true;
      this.setState({
        userNameError: "* 用户名不能为空"
      })
    }
    if (!this.state.userPassword) {
      hasError = true;
      this.setState({
        userPasswordError: "* 密码不能为空"
      })
    }
    if (hasError)
      return;

    const loginData = {
      username: this.state.userName,
      password: this.state.userPassword,
      client_id: 'wx',
      grant_type: 'password',
      scope: 'openid offline_access profile'
    }

    let url = `${this.props.config.auth}/connect/token`
    this.setState({ loading: true })
    ApiClient.postFormUrlEncode(url, loginData).then((data) => {
      let res = data.data;

      if (res.error) {
        throw { message: res.error_description }
      }
      return {token:res, loginType:'password'};
    })
      .then(this.login)
      .then(res => {
        this.setState({ loading: false });
      })
      .catch(e => {

        this.setState({ loading: false });
        Toast.fail(`无法登录：${e.message || ''}`)

      });
  }

  faceLogin = () => {
    Baidu.FaceLivenessExp(this.state.enableSound).then(r => {
      const loginData = {
        username: this.state.userName,
        image: r,
        client_id: 'wx',
        grant_type: 'face',
        scope: 'openid offline_access profile'
      }

      let url = `${this.props.config.auth}/connect/token`
      this.setState({ loading: true })
      return ApiClient.postFormUrlEncode(url, loginData).then((data) => {
        let res = data.data;

        if (res.error) {
          throw { message: res.error_description }
        }
        return {token:res, loginType:'face'};
      })
    }, (a, b) => {
      throw { message: '无法识别人脸,' + (a || '') }
    }).then(this.login)
      .then(res => {
        this.setState({ loading: false });
      })
      .catch(e => {

        this.setState({ loading: false });
        Toast.fail(`无法登录：${e.message || ''}`, 1)

      });



  }
  login = (tokenRes) => {
    //获取用户
    let token = tokenRes.token;
    let loginType = tokenRes.loginType;
    let url = `${this.props.config.auth}/api/userinfo`
    return ApiClient.get(url, true, null, token.access_token).then((data) => {
      let res = data.data;
      if (res.code === '401') {
        throw { message: '非法登录，用户令牌无效' }
      }

      TrackService.login(loginType, res);

      return {
        token: token,
        userInfo: res
      }
    }).then(token=>{



      let uid = token.userInfo.sub;
      let url = `${this.props.config.auth}/api/user/extensions`
     
      return ApiClient.post(url,[
        {"parName":"APP_PUSH_ID","parValue": this.props.pushID }
      ], null, 'POST', token.token.access_token).then(data=>{
        
        return token;
      }).catch(e=>{
        return token;
      });



    }).then(token => {
      //设置全局用户信息
      storage.save({
        key: LOGIN_USER_RECORD_KEY,
        data: token.userInfo,
        expires: 1000 * 3600 * 24 * 10000
      })

      let now = Math.round(new Date().valueOf() / 1000);
      var user = {
        access_token: token.token.access_token,
        refresh_token: token.token.refresh_token,
        userInfo: token.userInfo,
        expired: false,
        expires_to: now + token.token.expires_in,
        expires_in: token.token.expires_in
      }
      this.props.dispatch(setAuthInfo(user));
      //获取应用列表  
      let url = `${this.props.config.auth}/api/Application/list`;
      return ApiClient.post(url, {
        "ApplicationTypes": ["wx"]
      }).then(data => {
        let res = data.data || {};
        if (res.code === '0') {
          return res.extension;
        } else {
          throw { message: `获取工具列表失败：${res.message || ''}` }
        }
      })
    }).then(applist => {
      if (!applist || applist.length === 0) {
        throw { message: '您没有任何工具的使用权限，请联系管理员赋权' }
      }
      const tc = require('../tools');
      const getToolDefine = tc.getToolDefine;

      let sortedList = applist.sort((a, b) => a.order - b.order);
      sortedList.forEach(app => {
        let t = getToolDefine(app.clientId)
        if (t) {
          app.path = t.path;
        }
      });
      this.props.dispatch(setAppList(sortedList));

      //跳转
      this.props.dispatch(setCurrentTool(sortedList[0]))
      let tool = getToolDefine(sortedList[0].clientId);
      if (tool) {
        setTimeout(() => {
          this.props.dispatch(replace(tool.path))
        }, 0);

      } else {
        throw { message: '工具不存在' }

      }



    })
  }

  sms=()=>{
    ImagePicker.openPicker({
      multiple: false,
      mediaType:'photo',
      compressImageQuality:1,
    }).then(images => {
      console.log(images);
    });

    //this.props.dispatch(replace('/zc'))
    // if(Platform.OS==="ios"){
    //   Linking.openURL("sms:12345678901&body=短信内容");
    //  }else{
    //   Linking.openURL("sms:12345678901?body=短信内容");
    //  }
    // if(Platform.OS==="ios"){
    //   Linking.openURL("tel:12345678901");
    //  }else{
    //   Linking.openURL("tel:12345678901");
    //  }

    // let x= ['a'];
    // for(let i = 0;i<2000;i++){
    //   x.push('a')
    // }
    // Linking.openURL('sms:?body='+x.join(''))
  }

  sms2=()=>{
    // Baidu.FaceLivenessExp(false).then(r=>{

    // });'
    // Baidu.VoiceRecognition().then(r=>{

    // },x=>{
    //   console.log(x.message)
    // })
    ImagePicker.openCamera({
      multiple: false,
      mediaType:'photo',
      compressImageQuality:1,
    }).then(images => {
      console.log(images);
    });
  }

  render() {
    let { showPwd, loginType, picture,userName, faceUserName,loading } = this.state;
    let isRemoteAvator = false;
    if(/^(http|https):\/\//.test(picture||'')){
      isRemoteAvator=true;
      
    }
    return (
      <Layer style={styles.root} showLoading={loading} >
        <View style={styles.avator}>
          <Image style={styles.avatorImage} source={isRemoteAvator? {uri: picture} : require('../images/logo.png') } />
        </View>
        {/* <List>
              <Text>账号名称</Text>
            </List> */}
        {
          loginType === 'password' ?

            <List style={styles.input}>
              <InputItem
                type="text"
                clear={true}
                disabled={this.state.loading}
                placeholder="输入员工编号"
                error={this.state.userNameError !== ''}
                onErrorClick={() => this.onErrorClick('userNameError')}
                onChange={(val) => this.setState({ userName: val })}
                value={this.state.userName}
                // value='admin'
              >账号</InputItem>
              <InputItem
                type={showPwd ? 'text' : 'password'}
                clear={true}
                disabled={this.state.loading}
                placeholder="输入您的密码"
                error={this.state.userPasswordError !== ''}
                extra={<Ionicons size={24} name={showPwd ? 'ios-eye-outline' : 'ios-eye-off-outline'} />}
                onExtraClick={() => this.setState({ showPwd: !this.state.showPwd })}
                onErrorClick={() => this.onErrorClick('userPasswordError')}
                onChange={(val) => this.setState({ userPassword: val })}
                value={this.state.userPassword}
                // value='123456'
              >密码</InputItem>

              <WhiteSpace />
              <View style={styles.btn}>
                <Button disabled={this.state.loading} type='primary' onClick={this.handleClick}>登录</Button>
                {
                  this.state.enableFace ?
                    <Button disabled={this.state.loading} type='link' onClick={() => this.setState({ loginType: 'face' })}>刷脸登录</Button> : null
                }
              </View>
            </List> : <List>
               <Text style={styles.faceUserName}>{faceUserName}</Text> 
              <WingBlank style={styles.btn}>
                <WhiteSpace />
                <Button disabled={this.state.loading} type='primary' onClick={this.faceLogin}>刷脸登录</Button>
                <WhiteSpace />
                <Button disabled={this.state.loading} type='link' onClick={() => this.setState({ loginType: 'password' })}>密码登录</Button>
              </WingBlank>
            </List>


        }
<Button onClick={this.sms}>照片111</Button>
<Button onClick={this.sms2}>相机</Button>
        {/* <Button onClick={this.sms}>发短信</Button> */}
      </Layer>


    )

  }
}


function mapStateToProps(state) {
  return {
    user: state.oidc.user,
    pushID: state.oidc.jpushID,
    config: state.config
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);