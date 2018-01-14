import { store } from '../index';
import URLSearchParams from 'url-search-params';

const testToken = window._TEST_TOKEN;

function logResponseError(rc, res) {
    if (res && res.hasOwnProperty('code') && res.code !== '0') {
        logToServer(rc, 'RESPONSE_ERROR', JSON.stringify(res))
    }
}
function logRequestError(rc, res) {
    if (!res.ok) {
        res.text().then(text => {
            logToServer(rc, 'REQUEST_ERROR', text)
        });
    }
}
function logException(rc, error) {
    logToServer(rc, 'REQUEST_FAIL', JSON.stringify({ message: error.message, stack: error.stack }));
}

function logCost(rc) {
    // if(process.env.NODE_ENV==='development'){
    //     console.log('request:', rc);
    // }
    if (rc.cost >= 1000) {
        logToServer(rc, 'TIME_TO_LONG', `cost: ${rc.cost}ms`)
    }
}

function logRequestStart(rc){
    if(process.env.NODE_ENV==='development'){
        console.log('request start:', rc);
    }
}

function logToServer(rc, type, response) {
    let ui = rc.userInfo || {};
    let options = rc.options || {};
    let headers = [];
    if (options.headers) {
        options.headers.forEach((v, k) => {
            headers.push(`${k || ''}:${v || ''}`)
        })
    }
    let logContent = {
        userName: ui.name || '',
        trueName: ui.nickname || '',
        method: options.method || '',
        url: rc.url,
        headers: headers.join('\r\n'),
        body: options.body || '',
        cost: rc.cost,
        responseStatus : rc.responseStatus||'',
        responseStatusText : rc.responseStatusText||'',
        logType: type
    }

    if (type !== "TIME_TO_LONG") {
        logContent.response = response || '';
    }

    let url = (window._appRoot || 'http://localhost/') + 'wx/Log';
    var postData = JSON.stringify(logContent);

    console.log(logContent)

    const headers2 = new Headers();
    headers2.append("Content-Type", "application/json");
    const options2 = {
        method: 'POST',
        headers: headers2,
        body: postData
    };
    try{
    fetch(url, options2)
        .then((res) => {
            console.log('错误日志已记录')
        }).catch(e=>{
          
            console.log(e)
        })
    }catch(e){
        alert(e.message||'')
    }

}

const ApiClient = {
    get(url, useToken = true, qs, stoken) {
        let rc = {};
        let startTime = Date.now().valueOf();
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append("Content-Type", "application/json");
        // if (useToken) {
        //     let user = store.getState().oidc.user || {};
        //     let token = user.access_token;
        //     if (user && user.userInfo) {
        //         rc.userInfo = user.userInfo;

        //     }
        //     if(stoken){
        //         token = stoken;
        //     }
        //     if (!token && module.hot) {
        //         token = testToken;
        //     }
        //     rc.token = token;
        //     headers.append('Authorization', `Bearer ${token}`);
        // }
        const options = {
            method: 'GET',
            headers,
            mode: 'cors'
        };
        rc.options = options;
        const params = new URLSearchParams();
        if (qs) {
            Object.keys(qs).forEach(key => params.append(key, qs[key]));
            url = url + "?" + params.toString();
        }

        rc.url = url;
        logRequestStart(rc)
        return fetch(url, options)
            .then((res) => {
                console.log(res, 'rsesasdadas')
                let endTime = Date.now().valueOf();
                rc.cost = endTime - startTime;
                rc.responseStatus = res.status.toString();
                rc.responseStatusText = res.statusText;
                if (res.ok) {
                    logCost(rc);
                    return res.json();
                }
                logRequestError(rc, res);
                return { code: res.status.toString(),requestError:true, message: res.statusText };
            })
            .then((data) => {
                if(!data.requestError){
                    logResponseError(rc, data);
                }
                return { data };
            })
            .catch((error) => {
                //message  stack
                logException(rc, error);
                console.log(error);
                return { error };
            });
    },
    post(url, body, qs, method = 'POST', stoken) {
        let rc = {};
        let startTime = Date.now().valueOf();
        let user = store.getState().oidc.user || {};
        let token = user.access_token;
        if (user && user.userInfo) {
            rc.userInfo = user.userInfo;

        }
        if (!token && module.hot) {
            token = testToken;
        }
        if(stoken){
            token = stoken;
        }
        rc.token = token;


        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append("Content-Type", "application/json");
        headers.append('Authorization', `Bearer ${token}`);

        var postData = undefined;
        if (body) {
            postData = JSON.stringify(body);
        }

        const options = {
            method: method,
            headers,
            mode: 'cors',
            body: postData
        };
        rc.options = options;

        const params = new URLSearchParams();
        if (qs) {
            Object.keys(qs).forEach(key => params.append(key, qs[key]));
            url = url + "?" + params.toString();
        }
        rc.url = url;
        logRequestStart(rc)
        return fetch(url, options)
            .then((res) => {
                let endTime = Date.now().valueOf();
                rc.cost = endTime - startTime;
                rc.responseStatus = res.status.toString();
                rc.responseStatusText = res.statusText;
                if (res.ok) {
                    logCost(rc);
                    return res.json();
                } else {
                    logRequestError(rc, res);
                    return { code: res.status.toString(),requestError:true, message: res.statusText };
                }
            })
            .then((data) => {
                if(!data.requestError){
                    logResponseError(rc, data);
                }
                return { data }
            })
            .catch((error) => {
                logException(rc, error);
                console.log(error);
                return { error }
            });
    },
    postForm(url, body, qs, method = 'POST', headerSetter) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        if (headerSetter) {
            headerSetter(headers);
        }
        const params = new URLSearchParams();
        if (qs) {
            Object.keys(qs).forEach(key => params.append(key, qs[key]));
            url = url + "?" + params.toString();
        }


        const options = {
            method: method,
            headers,
            mode: 'cors'
        };
        var fd = new FormData();
        if (body) {
            for (var k in body) {
                if (body.hasOwnProperty(k)) {
                    fd.append(k, body[k]);
                }
            }
            options.body = fd;
        }


        return fetch(url, options)
            .then((res) => res.json())
            .then((data) => ({ data }));
    },
    postFormUrlEncode(url, body, qs, method = 'POST', headerSetter) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Accept', 'application/json');
        if (headerSetter) {
            headerSetter(headers);
        }
        const params = new URLSearchParams();
        if (qs) {
            Object.keys(qs).forEach(key => params.append(key, qs[key]));
            url = url + "?" + params.toString();
        }

        const options = {
            method: method,
            headers,
            mode: 'cors'
        };
        if (body) {
            const bodyParams = new URLSearchParams();

            Object.keys(body).forEach(key => bodyParams.append(key, body[key]));
            options.body = bodyParams.toString();

        }

        return fetch(url, options)
            .then((res) => res.json())
            .then((data) => ({ data }));
    }
}


export default ApiClient;

