import React, { Component, Children } from 'react';
import { List, TabBar, Modal,ActionSheet } from 'antd-mobile';
// import Icon from 'react-native-vector-icons/FontAwesome';
import { Platform, StatusBar, View, ScrollView, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux';


class IndexPage extends Component {

    state = {
      
    }

    
    
    componentDidMount() {
        
    }
   
    render() {
    
        return (
            <View>
                <View>
               

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

export default connect(mapStateToProps, mapDispatchToProps)(IndexPage)


