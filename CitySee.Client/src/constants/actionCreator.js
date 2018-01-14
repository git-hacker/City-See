import {createAction} from 'redux-actions';
import * as actionTypes from './actionTypes';
//登录相关
export const login = createAction(actionTypes.LOGIN_AUTHOR)
export const refreshToken = createAction(actionTypes.LOGIN_REFRESH_TOKEN)
export const updateToken = createAction(actionTypes.TOKEN_UPDATED)
//评论相关
export const sendComment = createAction(actionTypes.SEND_COMMENT);