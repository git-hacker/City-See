import React, { Component, Children } from 'react';
import { Icon, List, TabBar, Modal,ActionSheet } from 'antd-mobile';
import { Platform, StatusBar, View, ScrollView, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux';
import signals from 'signals'
import NavBar, { NavButton, NavButtonText, NavTitle } from 'react-native-nav'
import SideMenu from 'react-native-side-menu'
import LayerStyles from './LayerStyle';
import { getToolDefine } from '../tools'
import Layer, { LayerRouter } from './Layer'
import MessageCenter, {MessageRouter} from '../messageCenter'
import PersonalCenter,{PersonRouter}  from '../personal'
import Spinner from './Spinner'
import {setCurrentTool} from '../actions/actionCreators'

let sbHeight = StatusBar.currentHeight;
if (Platform.OS === 'android' && (Platform.Version * 1) <= 20) {
    sbHeight = 0;
}

const styles = StyleSheet.create({
    icon: {
        width: 18,
        height: 18
    },
    navBarContainer: {

    },
    statusBar: {
        backgroundColor: 'transparent',
        height: 0
    },
    navBar: {
        height: 56 + sbHeight,
        padding: 0
    },
    opbar: {
        position: 'absolute',
        flexDirection: "row",
        position: "absolute",
        top: sbHeight,
        padding: 16,
        width: "100%",
        left: 0,
        right: 0,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    back: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
    }
})

class TopToolbar extends Component {

    state = {
        open: false,
        tools: false,
        selectedTab: ''
        //openKeys: [],
        //selectedKeys: []
    }

    onOpenChange = () => {
        this.setState({
            open: !this.state.open
        })
    }
    onSelect = (tool,app) => {
        if(tool.id === (this.props.currentTool||{}).clientId){
         //   this.setState({tools:false})
            return;
        }

        // this.setState({
        //     tools: false
        // }, () => {
           
            this.props.dispatch(setCurrentTool(app))
            setTimeout(() => {
                this.props.dispatch(replace(tool.path))
            }, 0);
          
           // alert(JSON.stringify(tool.path))
   //     })
    }
    _createAppItem = (appList) => {
        let menu = [];
        appList.forEach((app) => {
            let tool = getToolDefine(app.clientId)
            if (tool) {
                menu.push(<List.Item className="top-toolbar-menu-item" onClick={()=> this.onSelect(tool,app)} key={tool.id} value={tool.path} icon={tool.icon} >{app.displayName}</List.Item>)
            }
        })
        return menu;
    }

    filterChildren() {
        let router = '';
        let otherChildren = [];
        Children.map(this.props.children, (element) => {
            if (element) {
                if (element.type === LayerRouter) {
                  router = element;
                  
                } else {
                    otherChildren = [...otherChildren, element];
                }
            }
        });

        return [router, ...otherChildren];
    }

    getPath = (path) => {
        return `${this.props.match.url}/${path}`
    }

    componentDidMount() {
        this.changeTab('index')
    }

    changeTab = (tab) => {
      
        
        if (this.state.selectedTab === 'index' && tab === 'index') {
            //this.setState({ tools: true })
            const { appList } = this.props;
            let menu = [];
            let validApps = [];
            appList.forEach((app) => {
                let tool = getToolDefine(app.clientId)
                if (tool) {
                    menu.push(app.displayName)
                    validApps.push(app)
                   // menu.push(<List.Item className="top-toolbar-menu-item" onClick={()=> this.onSelect(tool,app)} key={tool.id} value={tool.path} icon={tool.icon} >{app.displayName}</List.Item>)
                }
            })
            menu.push('取消');
          

            ActionSheet.showActionSheetWithOptions({
                options: menu,
                cancelButtonIndex: menu.length - 1,
                destructiveButtonIndex: menu.length - 1,
                title:'工具切换',
                maskClosable: true
                },
            (buttonIndex) => {
                
                if(buttonIndex<(validApps.length)){
                    let app = validApps[buttonIndex];
                  
                    if(app){
                        let tool = getToolDefine(app.clientId);
                        this.onSelect(tool,app)
                    }
                   
                }
                
            });

          
            return;
        }
        if (this.state.selectedTab !== tab) {
            this.setState({ selectedTab: tab });
           
        }
    }

    back = (type, ...args)=>{
        NavSignal.back.dispatch(type, ...args)
    }

    render() {
        const { appList } = this.props;
        const [router, ...children] = this.filterChildren();
        let toolName = (this.props.currentTool||{}).displayName||'';
        console.log(this.props.currentTool)
       // const menu = this._createAppItem();
        let navStyles = { ...styles };
        let bs = StyleSheet.flatten(navStyles.navBar);
        if (this.props.style) {
            bs = { ...bs, ...this.props.style };
        }
        navStyles.navBar = bs;
        return (
            <View style={LayerStyles.xyhLayer}>
                <View style={LayerStyles.xyhLayer}>
                <TabBar tintColor='red'>
                    <TabBar.Item title={toolName}
                        iconStyle={{width:20,height:20}}
                        icon={require('../images/sy-20x20.png')} 
                        selectedIcon={require('../images/sy2-20x20.png')}
                        selected={this.state.selectedTab === 'index'} onPress={() => this.changeTab('index')}>
                         <View style={LayerStyles.xyhLayer}>
                            <ScrollView style={[LayerStyles.scrollPanel, { backgroundColor: 'transparent', zIndex: 1 }]}>
                                <View>
                                    {
                                        this.props.background ? this.props.background : null
                                    }
                                </View>
                                 {children} 

                                {this.props.showLoading ? (<Spinner></Spinner>) : null}
                            </ScrollView>
                            {
                                this.props.pageBackground ?
                                    this.props.pageBackground : null
                            }
                        </View>

                    </TabBar.Item>
                    <TabBar.Item title="审核"
                        iconStyle={{width:20,height:20}}
                        icon={require('../images/sh-20x20.png')}
                        selectedIcon={require('../images/sh2-20x20.png')}
                        selected={this.state.selectedTab === 'auth'} onPress={() => this.changeTab('auth')}>
                        {/* <ReviewCenter actived={this.state.selectedTab === 'auth'} match={this.props.match} /> */}
                    </TabBar.Item>
                    <TabBar.Item title="消息"
                        iconStyle={{width:20,height:20}}
                        icon={require('../images/xx-20x20.png')}
                        selectedIcon={require('../images/xx2-20x20.png')}
                        selected={this.state.selectedTab === 'message'} onPress={() => this.changeTab('message')}>
                        <MessageCenter actived={this.state.selectedTab === 'message'} match={this.props.match}/>
                    </TabBar.Item>
                    <TabBar.Item title="我的"
                        iconStyle={{width:20,height:20}}
                        icon={require('../images/wd-20x20.png')}
                        selectedIcon={require('../images/wd2-20x20.png')}
                        selected={this.state.selectedTab === 'my'} onPress={() => this.changeTab('my')}>
                         <PersonalCenter actived={this.state.selectedTab === 'my'} ref={e=>this.myEle=e} match={this.props.match}/>
                    </TabBar.Item>

                </TabBar>

</View>
{router?router.props.children:null}
{MessageRouter(this.getPath, this.back)}          
{PersonRouter(this.getPath, this.back)}          
                {/* <SideMenu menu={menu}
                    isOpen={this.state.open}
                    onChange={this.onOpenChange}

                >
                <View style={LayerStyles.xyhLayer}>
                    <ScrollView style={[LayerStyles.scrollPanel,{backgroundColor:'transparent',zIndex: 1}]}>

                        <NavBar style={navStyles} >
                            <View style={[styles.back, this.props.containerStyle]}>
                            {
                                this.props.background? this.props.background:null
                            }
                            </View>
                            <View style={styles.opbar}>
                                <NavButton style={{ paddingLeft: 0, marginLeft:0 }} onPress={this.props.onClick}>
                                    <Image style={styles.icon}
                                        source={require('../images/grzx.png')} />


                                </NavButton>
                                <View>
                                    <View style={{ width: '100%', justifyContent: 'center', opacity: this.props.titleOpacity }}>{
                                        (typeof this.props.title === 'string') ?
                                            <Text>{this.props.title}</Text> : this.props.title
                                    }</View>
                                </View>

                                <NavButton onPress={() => { this.toggleMenu() }}>

                                    <Image style={styles.icon}
                                        source={require('../images/fl.png')} />

                                </NavButton>
                            </View>
                        </NavBar>
                        {children}
                    </ScrollView>
                    {
                        this.props.pageBackground?
                        this.props.pageBackground:null
                    }
                   </View>
                </SideMenu>
                {router ? router : null}
                {this.props.showLoading ? (<Spinner></Spinner>) : null} */}

            </View>
 
        )
    }
}

const mapStateToProps = (state, action) => {
    return {
        appList: state.oidc.appList ||[],
        currentTool: state.oidc.currentTool
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopToolbar)


export const NavSignal = {
    back: new signals.Signal()
}