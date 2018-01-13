import React, { Component, Children } from 'react';
import { List, Modal,ActionSheet } from 'antd-mobile';
import { Platform, StatusBar, View, ScrollView, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux';
import {IndexPageStyles} from './indexPageStyle'
import NavBar from '../../components/NavBar'
import TabBar from '../../components/TopToolbar'
import ProjectItem from '../../components/ProjectItem'
class HomePage extends Component {

    state = {
      list: [
        {
        name: '成都银泰中心',
        imgSource:  require('../../images/timg.jpg'),
        },
        {
          name: '首座max',
          imgSource:  require('../../images/timg.jpg'),
        },
        {
          name: '成都银泰中心',
          imgSource:  require('../../images/timg.jpg'),
        },
        {
          name: '成都银泰中心',
          imgSource:  require('../../images/timg.jpg'),
        },
        {
          name: '成都银泰中心',
          imgSource:  require('../../images/timg.jpg'),
        },
        {
          name: '成都银泰中心',
          imgSource:  require('../../images/timg.jpg'),
        },
        {
          name: '成都银泰中心',
          imgSource:  require('../../images/timg.jpg'),
        },
        {
          name: '成都银泰中心',
          imgSource:  require('../../images/timg.jpg'),
        },
    ]
    }

    
    
    componentDidMount() {
        
    }
   
    render() {
    
        return (
            <View style={IndexPageStyles.content}>
                <NavBar/>
                <ScrollView  horizontal> 
                <View style={IndexPageStyles.topBuilding}>
                  {
                    this.state.list.map((item, index) => {
                      return (
                        <ProjectItem key={index} name={item.name} imgSource={item.imgSource}/>
                      )
                    })
                  }
                 </View>
                </ScrollView>
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


