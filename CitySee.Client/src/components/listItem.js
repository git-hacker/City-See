import React, { Component } from 'react'
import {View, Image, TouchableWithoutFeedback, ScrollView, Text, TouchableHighlight, ListView, StyleSheet} from 'react-native';

const styles = StyleSheet.create(
    {
        main: {
            // padding: 5,
            // paddingBottom: 10,
        },
        header: {
            display: 'flex',
            flexDirection: 'row',
            alignItems:'center',
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
            marginTop: 5,
            marginBottom: 5
        },
        gz: {
            display: 'flex',
            borderStyle: 'solid',
            borderColor: '#f94771',
            borderWidth: 1,
            borderRadius: 5,
            flexDirection: 'row',
            height: 21,
            paddingLeft: 3,
            paddingRight:3,
            paddingBottom:1,
            alignItems: 'center',
            position: 'absolute',
            right:0,
        }
    }
)

class ListItem extends Component {

    render() {
        const rowData = this.props.item||{};
        const imgs = rowData.imgs || []
        return (
            <TouchableWithoutFeedback onPress={this.props.onClick}>
                <View style={styles.main}>
                    <View style={styles.header}>

                        <Image style={styles.icon} source={{uri: rowData.icon}} />

                        <View style={styles.headerRight}>
                            <Text style={{color: '#f94771', fontSize: 16}}>{rowData.name}</Text>
                            <View style={{display: 'flex', flexDirection: 'row'}}>
                                <Text style={{fontSize: 12}}>{rowData.time}</Text>
                                <Text style={{marginLeft: 10,marginRight: 8, fontSize: 12}}>来自</Text>
                                <Text style={{fontSize: 12}}>{rowData.userName}</Text>
                            </View>
                        </View>

                        {
                            this.props.page !== 'gz' ? null : 
                            <View style={styles.gz}>
                                <Image source={require('../images/add.png')} style={{width:20,height: 20}}/>
                                <Text style={{color: '#f94771'}}>关注</Text>
                            </View>
                        }
                    </View>
                    <Text style={styles.content}>{rowData.content}</Text>
                    <View style={styles.imgs}>
                        {
                            imgs.map((v,i) => {
                                return <Image key={i} style={styles.img} source={{uri: v}} />
                            })
                        }
                    </View>
                </View>
            </TouchableWithoutFeedback>
            
        )
    }
}


export default ListItem;