import React, { Component, Children } from 'react';
import { List, TabBar, Modal,ActionSheet } from 'antd-mobile';
// import Icon from 'react-native-vector-icons/FontAwesome';
import { Platform, StatusBar, View, ScrollView, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux';
// import signals from 'signals'
import LayerStyles from './LayerStyle';
import MapIndex from '../map'
import IndexPage from '../pages/indexList/indexPage'

let sbHeight = StatusBar.currentHeight;
if (Platform.OS === 'android' && (Platform.Version * 1) <= 20) {
    sbHeight = 0;
}


class TopToolbar extends Component {

    state = {
        selectedTab: 'index'
    }

    
    onSelect = (tool,app) => {
       
    }

    componentDidMount() {
        
    }

    changeTab = (tab) => {
        if (this.state.selectedTab !== tab) {
            this.setState({ selectedTab: tab })
        }
    }

    render() {
    
        return (
            <View style={[LayerStyles.tarBar]}>
                <View style={LayerStyles.tarBar}>
                <TabBar tintColor='red'>
                    <TabBar.Item title='首页'
                        iconStyle={{width:20,height:20}}
                        icon={require('../images/home.png')} 
                        selectedIcon={require('../images/home2.png')}
                        selected={this.state.selectedTab === 'index'} onPress={() => this.changeTab('index')}>
                        <IndexPage actived={this.state.selectedTab === 'index'} match={this.props.match}/>
                    </TabBar.Item>
                    <TabBar.Item title="地标"
                        iconStyle={{width:20,height:20}}
                        icon={require('../images/location.png')} 
                        selectedIcon={require('../images/location2.png')}
                        selected={this.state.selectedTab === 'map'} onPress={() => this.changeTab('map')}>
                        <MapIndex actived={this.state.selectedTab === 'map'} match={this.props.match}/>
                    </TabBar.Item>
                    <TabBar.Item
                        iconStyle={{ width:20,height:20 }}
                        icon={require('../images/sy-20x20.png')}
                        selectedIcon={require('../images/sy2-20x20.png')}
                        selected={this.state.selectedTab === 'message'} onPress={() => this.changeTab('message')}>
                    </TabBar.Item>
                    <TabBar.Item title="关注"
                        iconStyle={{width:20,height:20}}
                        icon={require('../images/heart.png')} 
                        selectedIcon={require('../images/heart2.png')}
                        selected={this.state.selectedTab === 'message'} onPress={() => this.changeTab('message')}>
                    </TabBar.Item>
                    <TabBar.Item title="我"
                        iconStyle={{width:20,height:20}}
                        icon={require('../images/person.png')}
                        selectedIcon={require('../images/person2.png')}
                        selected={this.state.selectedTab === 'my'} onPress={() => this.changeTab('my')}>
                    </TabBar.Item>

                </TabBar>

</View>
        
              
            </View>
 
        )
    }
}

const mapStateToProps = (state, action) => {
    return {
       
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopToolbar)


