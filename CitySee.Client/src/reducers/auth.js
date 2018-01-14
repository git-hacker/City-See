import {handleActions} from 'redux-actions';
import * as actionTypes from '../constants/actionTypes';
import {refreshToken, checkWxJSSDKConfig} from '../actions/actionCreators'
import {store} from '../index'

const authid = "openid_auth";
const authStr = sessionStorage.getItem(authid);
let storeUser = null;
if (authStr) {
    storeUser = JSON.parse(authStr);
    //alert(authStr);
} else {
    //alert(document.cookie)
}

window.setInterval(() => {
    store.dispatch(checkWxJSSDKConfig());
}, 1000 * 60 * 10)


const initState = {
    hasAuthority: false,
    user: {}
};
let tid = 0;
let now = Math.round(new Date().valueOf() / 1000);
let reducerMap = {};
//
reducerMap[actionTypes.LOGIN_AUTHOR_COMPLETE] = function (state, action) {

    sessionStorage.setItem(authid, JSON.stringify(action.payload))
    if (tid) {
        window.clearTimeout(tid);
    }
    let time = ((action.payload.expires_in - now) / 2) * 1000;
    tid = window.setTimeout(() => {
        store.dispatch(refreshToken());
    }, time)
    return Object.assign({}, state, {user: action.payload, hasAuthority: true});
}

authReducerMap[actionTypes.TOKEN_UPDATED] = (state, action) => {
    let token = action.payload;
    if (token && token.access_token) {
        let now = Math.round(new Date().valueOf() / 1000);
        let user = {
            access_token: token.access_token,

            expired: false,
            expires_to: now + token.expires_in,
            expires_in: token.expires_in
        }
        if (token.refresh_token) {
            user.refresh_token = token.refresh_token;
        }
        user.userInfo = state.user.userInfo;
        sessionStorage.setItem(authid, JSON.stringify(user))

        if (tid) {
            window.clearTimeout(tid);
        }
        let time = ((user.expires_to - now) / 2) * 1000;
        tid = window.setTimeout(() => {
            store.dispatch(refreshToken());
        }, time)


        return Object.assign({}, state, {user: user});
    }

    return state;

}



export default handleActions(reducerMap, initState);