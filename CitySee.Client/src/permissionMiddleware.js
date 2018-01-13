import ApiClient from './utils/apiClient'
//import {getToolDefine} from './tools'
import clone from 'clone'
import { setAppList, setCurrentTool } from './actions/actionCreators'

function startWith(source, sw) {
    let reg = new RegExp("^" + sw)
    return reg.test(source);
}

export default function permissionMiddleware() {
    return (store) => next => action => {
        try {
            if (action.type === '@@router/LOCATION_CHANGE') {
                let state = store.getState();
                let appList = (state.oidc || {}).appList || [];
                let routePath = action.payload.pathname;
                if (routePath === '/' || startWith(routePath, "/Login") || startWith(routePath, "/Logout") || startWith(routePath, '/Feedback')) {

                } else {
                    if (appList.length === 0) {
                        action.type="XYH_IGNORE_ROUTE";
                        let newAction = clone(action, false, true);
                        let dispatch = store.dispatch;
                        //获取引用列表
                        let url = state.config.auth;
                        url = `${url}/api/Application/list`;

                        ApiClient.post(url, {
                            "ApplicationTypes": ["wx"]
                        }).then((res) => {
                            let getToolDefine = require('./tools').getToolDefine;
                            let appList = res.data.extension;
                            if (!appList || appList.length === 0) {
                                return;
                            }
                            let sortedList = appList.sort((a, b) => a.order - b.order);
                            sortedList.forEach(app => {
                                let t = getToolDefine(app.clientId)
                                if (t) {
                                    app.path = t.path;
                                }
                            });

                            appList = sortedList;
                            dispatch(setAppList(appList))
                            let app = appList.find(x => startWith(routePath, x.path));
                            if (app) {
                                dispatch(setCurrentTool(app))
                            } else {
                                newAction.payload.pathname = '/nopermission'
                            }
                            dispatch(newAction);

                        }).catch(e => {
                            newAction.payload.pathname = '/nopermission'
                            dispatch(newAction);                            
                        });
                    } else {
                        let app = appList.find(x => startWith(routePath, x.path));
                        if (app) {
                            
                        } else {
                            action.payload.pathname = '/nopermission'
                        }
                    }
                }

             }
        } catch (e) {
            //   alert(e);
        }
        return next(action)
    }
}