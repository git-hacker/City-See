import {put, call, takeLatest} from 'redux-saga/effects'
import ApiClient from '../utils/apiClient'
import WebApiConfig from '../constants/webApiConfig';
import * as actionTypes from '../constants/actionTypes';
import {store} from '../index';
import {Toast} from 'antd-mobile';
import getApiResult from './sagaUtil';


export function* getNearbyCommentAsync(action) {
    let result = {isOk: false, extension: [], msg: '系统参数获取失败！'};
    let url = WebApiConfig.search.getNearByComment;
    let postData = {...action.payload};
    try {
        let res = yield call(ApiClient.post, url, postData);
        console.log(res);
        getApiResult(res, result);
        yield put({type: actionTypes.GET_COMMENT_LIST_COMPLETE, payload: result.result.extension});
    } catch (e) {
        console.error(e);
    }
    if (!result.isOk) {
        Toast.fail(result.msg);
    }
}

export function* sendCommentAsync(action) {
    let result = {isOk: false, extension: [], msg: '眷城发送失败！'};
    let url = WebApiConfig.search.getNearByComment;
    let postData = {...action.payload};
    try {
        let res = yield call(ApiClient.post, url, postData);
        console.log(res);
        getApiResult(res, result);
        if (result.isOk) {
            yield put({type: actionTypes.GET_COMMENT_LIST_COMPLETE, payload: result.extension});
            result.msg = '眷城发送成功!';
        }
    } catch (e) {
        console.error(e);
    }
    if (result.isOk) {
        Toast.info(result.msg);
    } else {
        Toast.fail(result.msg);
    }
}


export default function* watchIncrementAsync() {
    yield takeLatest(actionTypes.GET_COMMENT_LIST, getNearbyCommentAsync)
    yield takeLatest(actionTypes.SEND_COMMENT, sendCommentAsync)
}