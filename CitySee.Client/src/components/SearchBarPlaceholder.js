import React, {Component} from 'react'
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

const styles = StyleSheet.create({
    container:{
        height:30,
        display:'flex',
        flexDirection:'row',
        borderRadius: 24,
        backgroundColor:'white',
        justifyContent:'center',
        alignItems:'center'
    },
    placeholder:{
        color:'rgba(0,0,0,0.3)',
        marginLeft: 5
    }
})

class SearchBarPlaceholder extends Component{

    render(){
        return(
            <TouchableOpacity activeOpacity={0.8} onPress={this.props.onClick}>
                <View style={[styles.container, this.props.style]}>
                    <Icon size={20} name="ios-search" color="rgba(0,0,0,0.3)"/>
                    <Text style={[styles.placeholder, this.props.textStyle]}>{this.props.placeholder}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

export default SearchBarPlaceholder;