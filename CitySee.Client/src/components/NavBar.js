import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native'
import TopToolbar, {NavSignal as signal} from './TopToolbar'

//只为了与Web兼容

class NavBar extends Component {

   
    render() {
        return (
            <TopToolbar {...this.props} />
            
        )
    }
}


export default NavBar;

export const NavSignal = signal;