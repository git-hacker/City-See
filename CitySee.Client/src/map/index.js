import React,{Component} from 'react'
import {View, StyleSheet, Text, Platform, ViewPropTypes, Image, TouchableWithoutFeedback} from 'react-native'
import {MapView, Marker, Polyline, MultiPoint} from 'react-native-amap3d'
import { SearchBar, Toast } from 'antd-mobile'
import { connect } from 'react-redux'
import ApiClient from '../utils/apiClient'

const key = '5ce45efffba463e5a2b1827ced847b7d'

const styles = StyleSheet.create(
  {
    item: {
      width: 50,
      height: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    map: {
      flex: 1,
      ...Platform.select({
        ios: {
          marginBottom: 54,
        },
      }),
    },
    imgStyle: {
      width: 50,
      height: 50,
      position: 'absolute',
      left:0,
      top:0
    },
    box: {
      padding: 6,
      borderRadius: 5,
      backgroundColor: '#2e3845'
    }
  }
)

class MapIndex extends Component{

  state={
    index: 0
  }
  _points = [
    {
      latitude: 30.671697,
      longitude: 104.060501,
      total: '10',
      name: '东方新希望a'
    },{
      latitude: 30.670047,
      longitude: 104.060201,
      total: '20',
      name: '中航国际b'
    },{
      latitude: 30.670957,
      longitude: 104.060601,
      total: '60',
      name: '美年广场c'
    }
  ]

  componentWillMount () {
    ApiClient.get(`http://restapi.amap.com/v3/geocode/regeo?key=${key}&location=116.396574,39.992706`).then(res=> {
      console.log(res)
    }).catch((err) => {
      console.log(err)
    })
    ApiClient.get(`http://restapi.amap.com/v3/ip?key=${key}`).then(res=> {
      console.log(res)
    }).catch((err) => {
      console.log(err)
    })
  }

  onLocation = async(v) => {
    console.log(v)
    // this.props.searchMarks()
  }

  _onItemPress = (v, index) => {
    this.setState({
      index: index
    })
  }

  onSubmit = (val) => {
    let index = this._points.findIndex(v => {
      return v.name.indexOf(val) !== -1
    })
    if (index === -1) {
      Toast.info('未找到该建筑', 2)
      return
    }
    this.setState({
      index: index
    })
  }

  onInfoWindowPress = (v) => {
    console.log('zzzzzzzzzzz')
  }

  render(){
    return <View style={StyleSheet.absoluteFill}>
      <View>
        <SearchBar clearTextOnFocus={true} placeholder='对你附近的地名进行搜索' placeholderTextColor='#999' onSubmit={val => this.onSubmit(val)} />
      </View>
      <MapView
        rotateEnabled={true}
        locationEnabled={true}
        zoomLevel={17}
        tilt={60}
        tiltEnabled={true}
        coordinate={{
          latitude: 30.67,
          longitude: 104.06
        }}
        locationInterval={3000}
        showsLocationButton={true}
        onLocation={({nativeEvent}) => this.onLocation(nativeEvent)}
        showsBuildings={true}
        showsLabels={true}
        style={styles.map}>
          {/* <MultiPoint
            icon={() => <Image style={styles.imgStyle} source={require('./images/mess.png')} />}
            points={this._points}
            onItemPress={this._onItemPress}
          /> */}
          {
            this._points.map((v, index) => {
              return (
            //   <Marker
            //   key={index}
            //   title={v.total}
            //   active={index === this.state.index}
            //   onPress={(v, index) => this._onItemPress(v, index)}
            //   onInfoWindowPress={() => this.onInfoWindowPress()}
            //   icon={() =>
            //     <View style={styles.item}>
            //       <Image style={styles.imgStyle} source={require('./images/mess.png')} />
            //     </View>
            //   }
            //   coordinate={v}
            // />
                <Marker key={index} icon={() => <Image style={styles.imgStyle} source={require('../images/mess.png')} />} coordinate={v}>
                  <TouchableWithoutFeedback onPress={() => this.onInfoWindowPress()}>
                    <View style={styles.box}>
                      <Text style={{color: '#fff'}}>自定义信息窗体</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </Marker>
              )
            })
          }
      </MapView>
    </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(MapIndex)