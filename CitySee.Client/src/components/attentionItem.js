import React, { Component } from 'react'
import {View, Image, TouchableWithoutFeedback, ScrollView, Text, TouchableHighlight, ListView, StyleSheet} from 'react-native'
import { Button } from 'antd-mobile'

const styles = StyleSheet.create(
    {
        main: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            // justifyContent: 'center'
        },
        img:{
            width: 50,
            height: 50,
            borderRadius: 50,
            flexShrink: 0
        },
        right: {
            display: 'flex',
            flexDirection: 'row'
        }
    }
)

class attentionItem extends Component {

    render() {
        let rowData = this.props.item || {};
        return (
            <View style={styles.main}>
                <Image style={styles.img} source={rowData.imgSource}/>
                <View style={styles.right}>
                    <View style={styles.rightLeft}>
                        <Text>{rowData.name}</Text>
                        <Text>{rowData.place}</Text>
                    </View>
                    <Button type='primary'>关注</Button>
                </View>
            </View>
        )
    }
}


export default attentionItem;