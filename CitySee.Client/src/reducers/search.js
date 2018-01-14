import { handleActions } from 'redux-actions';
import * as actionTypes from '../constants/actionType';
import moment from 'moment';

const initState = {
    showLoading: false,
   
};
let reducerMap = {};

// //设置遮罩层
// reducerMap[actionTypes.SET_SEARCH_LOADING] = function (state, action) {
//     return Object.assign({}, state, { showLoading: action.payload });
// }


export default handleActions(reducerMap, initState);