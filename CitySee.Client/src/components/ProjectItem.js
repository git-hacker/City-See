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
      width: 50,
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: '#cdcdcd'
    },
    content: {
      padding: 5,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    img: {
      width: 30,
      height: 30,
      marginBottom: 5,
      borderRaduis: 30,
      position: 'relative'
    },
    name: {
      color: '#333'
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
            <Text style={styles.img}>
              <Image source={require('../../images/timg.jpg')} style={{width: '100%', height: '100%'}}/>
            </Text>
            <Text style={styles.num}>99</Text>
            <Text style={styles.name}>
              眷城
            </Text>
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