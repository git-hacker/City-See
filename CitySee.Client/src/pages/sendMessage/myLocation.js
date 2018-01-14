import React, {Component} from 'react';
// import ReactDOM from 'react-dom'
import {View, ListView, StyleSheet, Text, TouchableOpacity, TouchableHighlight, Image} from 'react-native'
import {Button, Flex, InputItem, List, TextareaItem ,WingBlank, ImagePicker, Modal, WhiteSpace} from 'antd-mobile';
// import {Route} from 'react-router';
import {connect} from 'react-redux';
import Layer, {LayerRouter} from '../../components/Layer';
import SubNavBar from '../../components/SubNavBar';

const styles = StyleSheet.create({
  list:{
    marginTop: 10,
  },
  header: {
    display: 'flex',
    flexDirection: 'row'
  },
  headerRight: {
      display: 'flex',
      marginLeft: 10,
      flexDirection: 'column',
      justifyContent: 'space-around'
  },
  icon: {
      width: 50,
      height:50,
      borderRadius: 50
  },
  location: {
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 5,paddingRight: 5,
    color: '#f94771',
    fontSize: 12
  }
})


class SendPage extends Component {
    state = {
      
    }
    
    render() {
        
        return (
          <Layer style={{flexDirection: 'column', paddingBottom: 5}}>
                <SubNavBar title='所在建筑'>
                   <View  style={styles.list}>
                     <View style={styles.header}>
                          <Image style={styles.icon} source={require('https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1515868814197&di=744ee9f65e84173f67137d8da3e0b9d4&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimage%2Fc0%253Dshijue1%252C0%252C0%252C294%252C40%2Fsign%3Dcd21589de350352aa56c2d4b3b2a9187%2Fc75c10385343fbf245c3f109ba7eca8065388f29.jpg')} />
                          <View style={styles.headerRight}>
                              <View style={{flex:1, flexDirection: 'row'}}>
                                 <Text style={{fontSize: 16}}>成都银泰中心</Text>
                                 <View style={{backgroudColor: '#F8E3E8', marginLeft: 10}}><Text style={styles.location}>当前定位</Text></View>
                              </View>
                              <Text style={{color: '#333333', fontSize: 12}}>具体地理位置</Text>
                          </View>
                      </View>
                    </View>
                </SubNavBar>
         </Layer>
        )
    }
}



const mapState = (state, props) => {
    return {

    }
}

const mapDispatch = (dispatch) => {
    return {
        dispatch,

    }
}

export default connect(mapState, mapDispatch)(SendPage);