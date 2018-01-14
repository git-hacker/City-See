import React, { Component, Children } from 'react';
import { List, TabBar, Modal,ActionSheet } from 'antd-mobile';
import { Platform, StatusBar, View, ScrollView, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux';

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#f94771',
  },
  title:{
    paddingTop: 25,
    paddingBottom: 15,
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
  }
})


class NavBar extends Component {

    state = {
      
    }

   
    render() {
    
        return (
            <View style={styles.header}>
                <Text style={styles.title}>{this.props.text}</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)


