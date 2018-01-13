import React, {Component} from 'react'
import {View, StyleSheet, Platform, AsyncStorage, Text, BackHandler} from 'react-native'
// import {MapView, Marker, Polyline} from 'react-native-amap3d'
import {Provider} from 'react-redux';
import {applyMiddleware} from 'redux'
import {ConnectedRouter, routerMiddleware} from 'react-router-redux'
import Layer, {LayerRouter} from './components/Layer'
import {Route} from 'react-router';
import createHistory from 'history/createMemoryHistory'
import Storage from 'react-native-storage';
import createSagaMiddleware from 'redux-saga';
import ignoreSubspaceMiddleware from './ignoreSubspaceMiddleware'
import {createStore} from 'redux-dynamic-reducer'
import rootReducer from './reducers';
// import LoginPage from './login/login';
import {composeWithDevTools} from 'redux-devtools-extension';
import runSaga from './saga'
import TabBar from './components/TopToolbar'

const history = createHistory();

const storage = new Storage({
  size: 1000,
  // 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
  // 如果不指定则数据只会保存在内存中，重启后即丢失
  storageBackend: AsyncStorage,
  // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
  defaultExpires: null,
  // 读写时在内存中缓存数据。默认启用。
  enableCache: true
})
global.storage = storage;

export const sagaMiddleware = createSagaMiddleware();
global.sagaMiddleware = sagaMiddleware;

const isIos = Platform.OS === 'ios'


const globalActions = [
  /.*(@@redux-form.*)/,
  /.*(@@router.*)/,
  /.*(@@dic.*)/,
  /.*(@@SET_CURRENT_TOOL.*)/,
  /.*(@@SET_JPUSH_ID_ASYNC.*)/,
  /.*(@@SET_JPUSH_ID.*)/,
];
export function configure(initialState) {
  const im = ignoreSubspaceMiddleware(globalActions);
  const rm = routerMiddleware(history);
  const middleware = composeWithDevTools(applyMiddleware(im, rm, sagaMiddleware));
  const store = createStore(rootReducer, middleware);

  return store;
}



export const store = configure({});
global.store = store;

runSaga(sagaMiddleware);

// const tc = require('./tools');
// const getToolComponent = tc.default;
// const tools = tc.tools;



const RouteWithSubRoutes = (route) => {
  let tid = route.id;
  let ToolComponent = getToolComponent(tid);
  return (
    <Route path={route.path} render={props => (
      <ToolComponent {...props} />
    )} />
  )
}

const receiveCustomMsgEvent = "receivePushMsg";
const receiveNotificationEvent = "receiveNotification";
const openNotificationEvent = "openNotification";
const getRegistrationIdEvent = "getRegistrationId";

class IndexPage extends Component {
  constructor(props) {
    super(props);

    //android only

    this.hardwareBackPress = this.hardwareBackPress.bind(this)
    this.backCount = 0;

  }

  componentWillMount() {

  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress)
  }
  hardwareBackPress() {
    console.log(history)
    if (history.index === 0) {
      this.backCount++;
      if (this.backCount === 1) {
        Toast.info('再按一次退出应用', 2)
      } else if (this.backCount >= 2) {
        BackHandler.exitApp();
      }
    } else {
      this.backCount = 0;
      store.dispatch(goBack())
    }

    return true;
  }


  componentWillUnmount() {
    // JPushModule.removeReceiveCustomMsgListener(receiveCustomMsgEvent);
    // JPushModule.removeReceiveNotificationListener(receiveNotificationEvent);
    // JPushModule.removeReceiveOpenNotificationListener(openNotificationEvent);
    // JPushModule.clearAllNotifications();
    BackHandler.removeEventListener("hardwareBackPress", this.hardwareBackPress)
  }
  render() {
    let td = [];
    for (let i = 0; i < 100; i++) {
      td.push(i)
    }
    console.log('ConnectedRouter')
    return (
      <Provider store={store}>

        <ConnectedRouter history={history}>
          <Layer>
            <Route exact path='/' component={TabBar} />
            {/* <View><Text>sjfasdjf</Text></View> */}
          </Layer>
        </ConnectedRouter>
      </Provider >
      // <View><Text>sjfasdjf</Text></View>
    )
  }
}

export default IndexPage;