import {handleActions} from 'redux-actions';
import * as actionTypes from '../constants/actionTypes';
import {refreshToken, checkWxJSSDKConfig} from '../constants/actionCreator'
import {store} from '../index'

const initState = {
    hasAuthority: false,
    user: {}
};

reducerMap[actionTypes.TOKEN_UPDATED] = (state, action) => {

}


export default handleActions(reducerMap, initState);