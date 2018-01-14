import React, {Component} from 'react';
// import ReactDOM from 'react-dom'
import {View, ListView, StyleSheet, Text, TouchableOpacity, TouchableHighlight, Image} from 'react-native'
import {Button, Flex, InputItem, List, TextareaItem ,WingBlank, ImagePicker, Modal, WhiteSpace} from 'antd-mobile';
// import {Route} from 'react-router';
import {connect} from 'react-redux';
import Layer, {LayerRouter} from '../../components/Layer';
import SubNavBar from '../../components/SubNavBar';
import Comment from '../../components/Comment'

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
})


class SendPage extends Component {
    state = {
      
    }
    
    render() {
        
        return (
          <Layer style={{flexDirection: 'column', paddingBottom: 5}}>
                <SubNavBar title='我' 
                right={
                  <TouchableOpacity activeOpacity={0.7}  onPress={this.submit} >
                      <View>
                        <Text style={{color: 'white', fontSize:16}}>设置</Text>
                      </View>
                  </TouchableOpacity>
                  }>

                   <View  style={styles.list}>
                     <View style={styles.header}>
                          <Image style={styles.icon} source={require('https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1515868814197&di=744ee9f65e84173f67137d8da3e0b9d4&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimage%2Fc0%253Dshijue1%252C0%252C0%252C294%252C40%2Fsign%3Dcd21589de350352aa56c2d4b3b2a9187%2Fc75c10385343fbf245c3f109ba7eca8065388f29.jpg')} />
                          <View style={styles.headerRight}>
                                 <Text style={{fontSize: 16,color: '#333', fontWeight:'blod'}}>凉凉</Text>
                                 <Text style={{color: '#333'}}>xxxxxxx</Text>
                          </View>
                      </View>
                    </View>

                    <WhiteSpace size='sm' />

                    <Comment/>


                    <View>
                        <Text></Text>
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