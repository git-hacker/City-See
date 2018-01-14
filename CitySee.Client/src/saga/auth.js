import {put, call, takeLatest} from 'redux-saga/effects'
import ApiClient from '../utils/apiClient'
import WebApiConfig from '../constants/webApiConfig';
import * as actionTypes from '../constants/actionTypes'
import {store} from '../index';
import {Toast} from 'antd-mobile';
import getApiResult from './sagaUtil';


export function* refreshTokenAsync() {
    let authUrl = WebApiConfig.refreshToken;//store.getState().config.auth + "/connect/token";
    let postData = {
        grant_type: 'refresh_token',
        scope: 'openid offline_access',
        client_id: 'wx',
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
    let result = {isOk: false, extension: {}, msg: '获取核列详细失败！'};
    let url = WebApiConfig.login;
    try {
        let res = yield call(ApiClient.postFormUrlEncode, url)
        getApiResult(res, result);
        console.log(`url:${url},result:${JSON.stringify(res)}`);
        if (result.isOk) {
            yield put({type: actionTypes.LOGIN_AUTHOR_COMPLETE, payload: result.extension});
        }
    } catch (e) {
        result.msg = "获取核列详细接口调用异常！";
    }
    if (!result.isOk) {
        Toast.fail({
            description: result.msg
        });
    }
}

export default function* watchIncrementAsync() {
    yield takeLatest(actionTypes.LOGIN_REFRESH_TOKEN, refreshTokenAsync)
    yield takeLatest(actionTypes.LOGIN_AUTHOR, loginAsync)
}