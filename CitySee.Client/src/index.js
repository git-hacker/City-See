import React,{Component} from 'react'
import {View, StyleSheet, Platform} from 'react-native'
import {MapView, Marker, Polyline} from 'react-native-amap3d'

const styles = StyleSheet.create({
    map: {
      flex: 1,
      ...Platform.select({
        ios: {
          marginBottom: 54,
        },
      }),
    }
    
  })

class IndexPage extends Component{
    render(){
        return <View style={StyleSheet.absoluteFill}>
                <MapView 
                   
                    zoomLevel={17}
                    tilt={60}
                    showsBuildings={true}
                    showsLabels={true}
                    style={styles.map}>

                </MapView>
            </View>
    }
}

export default IndexPage;