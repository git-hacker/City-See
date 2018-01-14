import React, { Component } from 'react'
import {View, Image, TouchableWithoutFeedback, ScrollView, Text, TouchableHighlight, ListView, StyleSheet} from 'react-native'
import { Button } from 'antd-mobile'

const styles = StyleSheet.create(
    {
        main: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
            paddingBottom: 5,
            width: '100%',
            flexWrap: 'nowrap',
            borderStyle : 'solid',
            borderBottomColor: '#e5e5e5',
            borderBottomWidth: 1
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
            width: '100%',
            flexShrink: 1,
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        rightLeft: {
            width:'60%',
            marginLeft: 10
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
                        <Text numberOfLines={1}>{rowData.place}</Text>
                    </View>
                    <Button type='primary' size='small' style={{backgroundColor: '#f94771', borderColor: '#f94771'}}>{rowData.isAttention ? '取消关注' : '关注'}</Button>
                </View>
            </View>
        )
    }
}


export default attentionItem;