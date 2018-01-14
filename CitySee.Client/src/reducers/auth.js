import {handleActions} from 'redux-actions';
import * as actionTypes from '../constants/actionTypes';

const initState = {
    // showLoading: false,
    userToken: ''
};
let reducerMap = {};

//
reducerMap[actionTypes.LOGIN_AUTHOR_COMPLETE] = function (state, action) {

    return Object.assign({}, state, {userToken: action.payload});
}


export default handleActions(reducerMap, initState);