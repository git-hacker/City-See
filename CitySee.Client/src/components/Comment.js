import React, { Component, Children } from 'react';
import { List, TabBar, Modal,ActionSheet } from 'antd-mobile';
import { Platform, StatusBar, View, ScrollView, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'
const styles = StyleSheet.create({
  comment: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
  },
  item: {
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'center',
    flex: 0.5,
    paddingTop: 8,
    paddingBottom: 8
  },
  leftItem: {
    borderRightWidth: 1,
    borderStyle: 'solid',
    borderRightColor: '#dcdcdc',
  },
  text: {
    marginLeft: 10
  }
})
const dz = require('../images/dz.png')
const dz2 = require('../images/dz2.png')
const pl = require('../images/pl.png')


class CommentPage extends Component {
  state = {
    isDz: false,
  }
  render() {
      return (
        <View style={styles.comment}>
            <View style={[styles.item, styles.leftItem]}>
              <Image source={this.state.isDz ? dz2 : dz} style={{width: 22, height: 22}}/>
              <Text style={styles.text}>123</Text>
            </View>
            <View style={styles.item}>
              <Image source={pl} style={{width: 22, height: 22}}/>
              <Text style={styles.text} >233</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(CommentPage)