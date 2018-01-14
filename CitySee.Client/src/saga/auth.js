import {put, call, takeLatest} from 'redux-saga/effects'
import ApiClient from '../utils/apiClient'
import WebApiConfig from '../constants/webApiConfig';
import * as actionTypes from '../constants/actionTypes'
import {store} from '../index';
import {Toast} from 'antd-mobile';
import getApiResult from './sagaUtil';
import {updateToken} from '../constants/actionCreator'


export function* refreshTokenAsync() {
    let authUrl = WebApiConfig.refreshToken;//store.getState().config.auth + "/connect/token";
    let postData = {
        grant_type: 'refresh_token',
        scope: 'openid offline_access',
        client_id: 'citysee',
        refresh_token: store.getState().oidc.user.refresh_token
    };
    try {
        let res = yield call(ApiClient.postFormUrlEncode, authUrl, postData);
        console.log(res);
        if (res.data.access_token) {

            yield put(updateToken(res.data))
            //    Modal.alert('更新令牌令牌：' + JSON.stringify(res.data));
        }
    } catch (e) {
        console.error(e);
    }

}

export function* loginAsync(action) {
    let result = {isOk: false, extension: {}, msg: '用户名或密码错误！'};
    let url = WebApiConfig.login;
    try {
        let body = {
            client_id: "citysee",
            grant_type: "password",
            client_secret: "123456",
            scope: "openid offline_access profile",
            ...action.payload
        }
        let res = yield call(ApiClient.postFormUrlEncode, url, body, {});
        //getApiResult(res, result);
        console.log(`url:${url},result:${JSON.stringify(res)}`);
        if (res && res.data && res.data.access_token) {
            result.isOk = true;
            let now = Math.round(new Date().valueOf() / 1000);
            var user = {
                access_token: res.data.access_token,
                refresh_token: res.data.refresh_token,
                userInfo: res.data.userInfo,
                expired: false,
                expires_to: now + res.data.expires_in,
                expires_in: res.data.expires_in
            }
            yield put({type: actionTypes.LOGIN_AUTHOR_COMPLETE, payload: user});
        }
    } catch (e) {
        result.msg = "认证接口调用异常！" + e;
        // console.log("异常", e);
    }
    if (!result.isOk) {
        Toast.fail(result.msg);
    }
}

export default function* watchIncrementAsync() {
    yield takeLatest(actionTypes.LOGIN_REFRESH_TOKEN, refreshTokenAsync)
    yield takeLatest(actionTypes.LOGIN_AUTHOR, loginAsync)
}