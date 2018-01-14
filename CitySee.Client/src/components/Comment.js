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
  text: {
    marginLeft: 10
  },
  text2 : {
    color: '#f94771',
    marginLeft: 10
  },
  line:{
    height:20,
    width:1,
    backgroundColor: '#999'
  }
})
const dz = require('../images/dz.png')
const dz2 = require('../images/dz2.png')
const pl = require('../images/pl.png')


class CommentPage extends Component {
  state = {
    isDz: false,
  }
  handleDianZan = () => {
    this.setState({
      isDz: !this.state.isDz,
    })
  }
  render() {
      return (
        <View style={styles.comment}>
         <TouchableOpacity activeOpacity={0.7}  onPress={this.handleDianZan} style={[styles.item]}>
              <Image source={this.state.isDz ? dz2 : dz} style={{width: 22, height: 22}}/>
              <Text style={[this.state.isDz ? styles.text2 : styles.text]}>123</Text>
        </TouchableOpacity>
            <View style={styles.line}></View>
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