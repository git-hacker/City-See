import React from 'react'
import {View, Text, StyleSheet} from 'react-native'

const styles = StyleSheet.create({
    badage:{
        backgroundColor:'#ffe7e5',
        paddingLeft:8,
        paddingRight:8,
        paddingBottom:2,
        paddingTop:2,
        borderRadius:10,
        marginRight: 6
    },
    text:{
        fontSize:12,
        color:'#ef0a0a'
    }
})

function Badage(props){
    return <View style={[styles.badage, props.style]}>
        <Text style={[styles.text, props.textStyle]}>{props.text}</Text>
        </View>
}

export default Badage;