import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {View, Text, Image} from 'react-native'
import ZCIndex from './zc'
import YWYIndex from './ywy'
import ProjectReview from './zc/pages/projects/ProjectReview'
import ShopReview from './zc/pages/shops/ShopReview'
import TransferReview from './ywy/pages/client/TransferReview'
import ShopsHotReview from './zc/pages/dynamic/ShopsHotReview'
import ShopsAddReview from './zc/pages/dynamic/ShopsAddReview'
import ReportRuleReview from './zc/pages/dynamic/ReportRuleReview'
import CommissionReview from './zc/pages/dynamic/CommissionReview'
import BuildingNoReview from './zc/pages/dynamic/BuildingNoReview'
import DiscountPolicyReview from './zc/pages/dynamic/DiscountPolicyReview'
import ShopPriceReview from './zc/pages/dynamic/ShopPriceReview'

export const tools = [
    {
        path: '/login',
        id: 'login',
        icon: <Icon name="map-marker" />,
        order: 50,
        component: ZCIndex,
    },
    // {
    //     path: '/zyw',
    //     id:'wx-zszygj',
    //     icon: <Icon name="black-tie"/>,
    //     order: 50,
    //     component: ()=>createLoadableComponent(()=>import('./zyw')),
    // },
    {
        path: '/ywy',
        id: 'wx-ywygj',
        icon: <Icon name="map-marker" />,
        order: 20,
        component: YWYIndex
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
        return tool.component;
    }
    return null;
}



const rvIconStyle={
    width:'100%',
    height: '100%'
}

function defaultDesc(item){
    return <Text>{item.ext1}  {item.ext2}</Text>
}

//审核
export const reviewTypes=[
    {
        contentType:'building',
        title:'新增楼盘',
        icon:<Image style={rvIconStyle} source={require('./images/building.png')} alt='...' />,
        sencordLine: defaultDesc,
        component: ProjectReview
    },
    {
        contentType:'shops',
        title:'新增商铺',
        icon:<Image style={rvIconStyle} source={require('./images/building.png')} alt='...' />,
        sencordLine: (item)=>{
            return <Text>{item.ext4}  {item.ext1}-{item.ext2}-{item.ext3}</Text>
        },
        component: ShopReview
    },
    {
        contentType:'TransferCustomer', //TransferCustomer
        title:'调客',
        icon:<Image style={rvIconStyle} source={require('./images/tk.png')} alt='...' />,
        sencordLine: defaultDesc,
        component: TransferReview
    },
    {
        contentType:'ShopsHot', //ShopsHot 
        title:'热卖户型推荐',
        icon:<Image style={rvIconStyle} source={require('./images/dt.png')} alt='...' />,
        sencordLine: defaultDesc,
        component: ShopsHotReview
    },
    {
        contentType:'ShopsAdd', //ShopsHot 
        title:'加推',
        icon:<Image style={rvIconStyle} source={require('./images/dt.png')} alt='...' />,
        sencordLine:defaultDesc,
        component: ShopsAddReview
    },
    {
        contentType:'ReportRule', //ReportRule 
        title:'报备规则',
        icon:<Image style={rvIconStyle} source={require('./images/dt.png')} alt='...' />,
        sencordLine: (item)=>{
            return <Text>{item.contentName}  {item.ext2}</Text>
        },
        component: ReportRuleReview
    },
    {
        contentType:'CommissionType', //CommissionType  
        title:'佣金方案',
        icon:<Image style={rvIconStyle} source={require('./images/dt.png')} alt='...' />,
        sencordLine: (item)=>{
            return <Text>{item.contentName}  {item.ext2}</Text>
        },
        component: CommissionReview
    },
    {
        contentType:'BuildingNo', //BuildingNo   
        title:'楼栋批次',
        icon:<Image style={rvIconStyle} source={require('./images/dt.png')} alt='...' />,
        sencordLine: (item)=>{
            return <Text>{item.contentName}  {item.ext2}</Text>
        },
        component: BuildingNoReview
    },
    {
        contentType:'DiscountPolicy', //DiscountPolicy   
        title:'优惠政策',
        icon:<Image style={rvIconStyle} source={require('./images/dt.png')} alt='...' />,
        sencordLine: (item)=>{
            return <Text>{item.contentName}  {item.ext2}</Text>
        },
        component: DiscountPolicyReview
    },
    {
        contentType:'Price', //DiscountPolicy   
        title:'商铺价格',
        icon:<Image style={rvIconStyle} source={require('./images/dt.png')} alt='...' />,
        sencordLine: (item)=>{
            return <Text>{item.contentName}  {item.ext2}  {item.ext3}</Text>
        },
        component: ShopPriceReview
    }

    
]

export function getReviewDefine(contentType){
    let pd = reviewTypes.find(x=>x.contentType.toLowerCase() === contentType.toLowerCase());
    
    return pd;
}


export function getReviewComponent(contentType){
    let page = reviewTypes.find(x=>x.contentType.toLowerCase() === contentType.toLowerCase());
    if(page){
        if(page.cache){            
            return page.cache;
        }
        page.cache = page.component;
        return page.cache;
    }
    return null;
}