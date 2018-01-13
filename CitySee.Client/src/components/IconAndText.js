import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {View,Text, TouchableHighlight} from 'react-native'

const styles = {
    icon: {
        justifyContent:'center',
        alignItems:'center'
    },
    text: {
        textAlign: 'center',
        fontSize: 1*global.unitPixel
    }
}

class IconAndText extends Component {


    render() {
        let iconSize = this.props.iconSize ? this.props.iconSize : 2* global.unitPixel;
      //  let iconColor = this.props.iconColor ? this.props.iconColor : 'white';
        let icon = React.cloneElement(this.props.icon, { size: iconSize });
        let iconStyle = {
            ...styles.icon,
            ...this.props.iconStyle
        }
        let textStyle = {
            ...styles.text,
            ...this.props.textStyle
        }
        if (this.props.fontSize) {
            textStyle.fontSize = this.props.fontSize;
        }
        return (
            <TouchableHighlight underlayColor="rgba(250,250,250,0.5)" activeOpacity={0.5}  onPress={this.props.onClick}>
            <View style={this.props.style}>
                <View style={iconStyle}>{icon}</View>
                <View>
                {
                    (typeof this.props.text==='string')?
                    <Text style={textStyle}>{this.props.text}</Text>: this.props.text
                }
                </View>
            </View>
            </TouchableHighlight>
        )
    }
}


IconAndText.propTypes = {
    icon: PropTypes.node,
    iconColor: PropTypes.string,
    iconSize: PropTypes.any,
    iconStyle: PropTypes.object,
    text: PropTypes.node,
    fontSize: PropTypes.any,
    textStyle: PropTypes.object
}

export default IconAndText;