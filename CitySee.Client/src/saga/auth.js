import {put,call, takeLatest} from 'redux-saga/effects'
import ApiClient from '../utils/apiClient'
// import * as actionTypes from '../constants/actionTypes'
// import {store} from '../index'
// import {updateToken, setJpushId } from '../actions/actionCreators'
// import { SET_JPUSH_ID } from '../constants/actionTypes';


// export function* refreshTokenAsync(){
//     let authUrl = store.getState().config.auth + "/connect/token";
//     let postData = {
//         grant_type: 'refresh_token',
//         scope:'openid offline_access',
//         client_id:'wx',
//         refresh_token: store.getState().oidc.user.refresh_token
//     };
//     console.log(window._authUrl);
//     console.log(postData);
//    // Modal.alert('刷新令牌：' + JSON.stringify(postData));
//     try{
//         let res = yield call(ApiClient.postFormUrlEncode, authUrl,postData);
//         console.log(res);
//         if(res.data.access_token){
            
//             yield put(updateToken(res.data))
//         //    Modal.alert('更新令牌令牌：' + JSON.stringify(res.data));
//         }
//     }catch(e){
//         console.error(e);
//     }
    
// }

// export function* setJpushIdAsync(action){
//     let oidc = store.getState().oidc;
//     if(oidc.user && oidc.user.access_token){
//         let authUrl = store.getState().config.auth;
//         let uid = oidc.user.userInfo.sub;
//         let url = `${authUrl}/api/user/extensions`

//         yield call(ApiClient.post,url, [
//             {"parName":"APP_PUSH_ID","parValue": action.payload.jpushID }
//           ] );
        
//     }
//     yield put(setJpushId({jpushID: action.payload.jpushID}))
// }

export default function* watchIncrementAsync(){
    // yield takeLatest(actionTypes.REFRESH_TOKEN_ASYNC,refreshTokenAsync)
    // yield takeLatest(actionTypes.SET_JPUSH_ID_ASYNC, setJpushIdAsync)
  
}