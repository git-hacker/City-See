import React, { Component, Children } from 'react';
import { List, TabBar, Modal,ActionSheet } from 'antd-mobile';
import { Platform, StatusBar, View, ScrollView, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'

let sbHeight = StatusBar.currentHeight;
if (Platform.OS === 'android' && (Platform.Version * 1) <= 20) {
    sbHeight = 0;
}

const styles = StyleSheet.create({
    box: {
      width: 80,
      height: 100,
      borderStyle: 'solid',
      borderBottomWidth: 1,
      borderBottomColor: '#cdcdcd'
    },
    content: {
      padding: 10,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    img: {
      width: 60,
      height: 60,
      borderRadius: 60,
    },
    imgBox: {
      width: 65,
      height: 65,
      borderStyle: 'solid',
      borderColor: '#f94771',
      borderWidth: 1,
      borderRadius: 65,
      display:'flex',
      alignItems:'center',
      justifyContent: 'center'
    },
    name: {
      color: '#333',
      width: 70,
      textAlign: 'center'
    },
    num: {
      position: 'absolute',
      bottom: 0,
      right:-10,
      color: 'red',
    }
})

class ProjectListItem extends Component {
  render() {
      return (
        <View style={styles.box}>
          <View style={styles.content}>
          <View style={styles.imgBox}>
            <Image source={this.props.imgSource} style={styles.img}/>
          </View>
            <Text style={styles.name} numberOfLines={1}>{this.props.name}</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProjectListItem)