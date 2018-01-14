import React, {Component} from 'react';
// import ReactDOM from 'react-dom'
import {View, ListView, StyleSheet, Text, TouchableOpacity, TouchableHighlight, Image} from 'react-native'
import {Button, Flex, InputItem, List, TextareaItem ,WingBlank, ImagePicker, Modal, WhiteSpace} from 'antd-mobile';
// import {Route} from 'react-router';
import {connect} from 'react-redux';
import Layer, {LayerRouter} from '../../components/Layer';
import SubNavBar from '../../components/SubNavBar';
import TabBar from '../../components/TopToolbar'
import ListItem from '../../components/listItem'

const styles = StyleSheet.create({
  list:{
    marginTop: 10,
  },
  countBox: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent: 'space-between',
  },
  countLeft: {
    flexDirection:'row',
   flex: 0.5,
   justifyContent:'flex-start'
  },
  countRight: {
    flexDirection:'row',
    flex: 0.5,
    justifyContent:'flex-end'
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
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
  imgs:{
      display: 'flex',
      flexDirection: 'row'            
  },
  img: {
      width:100,
      height: 100,
      marginRight: 10
  },
  content: {
      paddingLeft: 10,
      paddingRight: 10,
      marginTop: 5,
      marginBottom: 5
  }
})


class SendPage extends Component {
    state = {
      
    }
    
    render() {
        const data = {
            icon: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1515868814197&di=744ee9f65e84173f67137d8da3e0b9d4&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimage%2Fc0%253Dshijue1%252C0%252C0%252C294%252C40%2Fsign%3Dcd21589de350352aa56c2d4b3b2a9187%2Fc75c10385343fbf245c3f109ba7eca8065388f29.jpg',
            name: '成都银泰中心',
            time: '1小时前',
            userName: '匿名用户',
            content: '哈哈哈哈',
            imgs: ['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1515868636772&di=f0555db77693d4958df0507261b3a839&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimage%2Fc0%253Dpixel_huitu%252C0%252C0%252C294%252C40%2Fsign%3D98a762398c44ebf8797c6c7fb081b246%2F0dd7912397dda1445ef33788b9b7d0a20cf48616.jpg','https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1515868636770&di=7d36c2aba37068678f86d94ed9562990&imgtype=0&src=http%3A%2F%2Fwan.kud6.com%2Ffiles%2F2014-9%2F20140916145249168918.jpg', 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1515868636768&di=9315a73ca164514cbb73776ee1633542&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimage%2Fc0%253Dpixel_huitu%252C0%252C0%252C294%252C40%2Fsign%3Dbd7885fadcca7bcb6976cf6fd7710e0f%2Fc75c10385343fbf27d671a1abb7eca8065388f44.jpg']
        }
        return (
          <Layer style={{flexDirection: 'column', paddingBottom: 5}}>
                <SubNavBar title='正文'>
                <View style={{padding: 10}}>
                  <ListItem item={data} page='gz'/>
                </View>
                   <View  style={styles.list}>

                     <View style={styles.countBox}>
                       <View style={styles.countLeft}>
                         <Text style={{color: '#333'}}>评论</Text><Text style={{paddingLeft: 10, color: '#f94771'}}>12</Text>
                       </View>
                       <View style={styles.countRight}>
                         <Text style={{color: '#333'}}>赞</Text><Text  style={{paddingLeft: 10, color: '#f94771'}}>12</Text>
                       </View>
                     </View>

                      <View style={{padding: 10, borderStyle: 'solid', borderColor:'#dcdcdc', borderTopWidth: 1,  borderBottomWidth: 1}}>
                          <View style={styles.header}>
                              <Image style={styles.icon} source={{uri: data.icon}} />
                              <View style={styles.headerRight}>
                                  <Text style={{color: '#333333', fontSize: 14}}>匿名用户</Text>
                                  <Text style={{color: '#333333', fontSize: 12}}>1小时前</Text>
                              </View>
                          </View>
                          <Text style={styles.content}>哈哈</Text>
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