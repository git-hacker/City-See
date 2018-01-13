import React, { Component, Children } from 'react';
import { List, Modal,ActionSheet } from 'antd-mobile';
import { Platform, StatusBar, View, ScrollView, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux';
import {IndexPageStyles} from './indexPageStyle'
import NavBar from '../../components/NavBar'
import TabBar from '../../components/TopToolbar'

class HomePage extends Component {

    state = {
      
    }

    
    
    componentDidMount() {
        
    }
   
    render() {
    
        return (
            <View style={IndexPageStyles.content}>
                <NavBar/>
                <ScrollView style={{
                  flex: 1
                }}> 
                  <Text>这是中间的滚动页面</Text>
                  <Text>页面展示在这个组件中</Text>
                </ScrollView>
                <View style={{justifyContent: 'flex-end', height: 96}}>
                  <TabBar />
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

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)


