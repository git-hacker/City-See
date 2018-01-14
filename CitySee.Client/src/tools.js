import React from 'react';
import Loadable from 'react-loadable';
import LoadableLoading from './components/LoadableLoading';
// import FaMapMarker from 'react-icons/lib/fa/map-marker'
// import FaBlackTie from 'react-icons/lib/fa/black-tie'
/* eslint-disable */
// import * as Vendor from './vendor'
/* eslint-enable  */
function createLoadableComponent(loader) {
    return Loadable({
        loader: loader,
        loading: () => <LoadableLoading />,
    });
}

export const tools = [
    {
        path: '/indexList',
        id: 'indexList',
        //icon: <FaMapMarker size="1.5rem" />,
        order: 50,
        component: () => createLoadableComponent(() => import('../pages/HomePage')),
    },
    {
        path: '/login',
        id: 'login',
        // icon: <FaBlackTie size="1.5rem" />,
        order: 50,
        component: () => createLoadableComponent(() => import('../pages/login')),
    },
    {
        path: '../map',
        id: 'map',
        // icon: <FaBlackTie size="1.5rem" />,
        order: 60,
        component: () => createLoadableComponent(() => import('../pages/map')),
    }
];


export function getToolDefine(id) {
    let tool = tools.find(x => x.id === id);
    if (tool) {
        let toolCopy = {...tool};
        delete toolCopy.cache;
        return toolCopy;
    }
    return tool;
}

export default function getToolComponent(id) {
    let tool = tools.find(x => x.id === id);
    if (tool) {
        if (tool.cache) {
            return tool.cache;
        }
        tool.cache = tool.component();
        return tool.cache;
    }
    return null;
}

const rvIconStyle = {
    width: '100%',
    height: '100%'
}