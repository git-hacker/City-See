import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux'
import authReducer from './auth'
export default combineReducers({
    router: routerReducer,
    auth: authReducer
});