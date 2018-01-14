import { takeEvery, takeLatest } from 'redux-saga'
import { put, call } from 'redux-saga/effects'
import {Toast} from 'antd-mobile'
import ApiClient from '../utils/apiClient'        
import * as actionTypes from '../constants/actionTypes'


export function* getBuildList(action) {
    let url = `http://restapi.amap.com/v3/place/around?key=${key}&location=104.060601,30.670957&radius=500`
    try {
      let res = yield call(ApiClient.get, url)
      console.log('resresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresres',res)
    } catch (e) {
        yield call(Toast.fail, "获取列表失败!", showDelay);
    }
}

export default function* watchIncrementAsync() {
  yield takeLatest(actionTypes.GET_NEARBY_BUILDLIST, getBuildList)
}