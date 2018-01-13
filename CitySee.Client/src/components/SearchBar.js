import React,{Component} from 'react'
import {StyleSheet} from 'react-native'
import {SearchBar} from 'antd-mobile'


let cs = StyleSheet.flatten(SearchBar.defaultProps.styles)
let iwStyle =  StyleSheet.flatten(SearchBar.defaultProps.styles.wrapper)
cs.wrapper = StyleSheet.create({
    wrapper:{
        ...iwStyle,
        backgroundColor:'transparent'
    }
}).wrapper;
export default function(props){
    
    return <SearchBar styles={cs} {...props} />
}