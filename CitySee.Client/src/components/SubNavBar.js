import React, {Component, Children} from 'react';
import PropTypes from 'prop-types'
import {StyleSheet, View, Image, ScrollView, StatusBar, Text, ListView, Platform} from 'react-native'
import {globalAction} from 'redux-subspace'
import {goBack} from 'react-router-redux'
import {connect} from 'react-redux'
import {Button} from 'antd-mobile'
// import Icon from 'react-native-vector-icons/EvilIcons';
import Spinner from './Spinner'
import NavBar, {NavButton, NavButtonText, NavTitle} from 'react-native-nav'
import LayerStyles from './LayerStyle';

const left = require('../images/left.png');

let sbHeight = StatusBar.currentHeight || 0;
if (Platform.OS === 'android' && (Platform.Version * 1) <= 20) {
    sbHeight = 0;
}

const u = global.unitPixel;
const styles = StyleSheet.create({
    backBtn: {
        backgroundColor: "transparent",
        borderColor: "transparent",
        borderRadius: 0,
        paddingLeft: 0,
        paddingRight: 0
    },
    pageContent: {
        flex: 1
    },
    transparent: {
        top: 0
    },
    hasFooter: {
        bottom: 3.5 * u
    },
    footerContent: {
        height: 3.5 * u,
        width: '100%',
        zIndex: 2
    },
    myNavBar: {
        display: 'flex',
        flexDirection:'row',
        alignItems: 'center',
        height: 60,
        backgroundColor: '#f94771',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 25,
        paddingBottom: 15,
    }
})

export class PageFooter extends Component {
    render() {
        return this.props.children ? this.props.children : null;
    }
}

//子页面导航
class SubNavBar extends Component {

    goBack = () => {
        this.props.dispatch(globalAction(goBack()));
    }

    filterChildren() {
        let footer = false;
        let otherChildren = [];
        Children.map(this.props.children, (element) => {
            if (element) {
                if (element.type === PageFooter) {
                    footer = element;
                } else {
                    otherChildren = [...otherChildren, element];
                }
            }
        });

        return [footer, ...otherChildren];
    }

    render() {

        const [footer, ...children] = this.filterChildren();
        let tc = this.props.transparent ? 'transparent' : '';

        let style = {}
        if (this.props.backgroundColor) {
            style.backgroundColor = this.props.backgroundColor
        }
        let titleOpacity = this.props.titleOpacity;
        if (typeof titleOpacity !== "number") {
            titleOpacity = 1;
        }
        if (titleOpacity < 1) {
            tc = `${tc} circle-back`;
        }
        let hideBackIcon = this.props.hideBackIcon === true;

        return (
            <View style={[LayerStyles.tarBar, {display: 'flex', flexDirection: 'column'}]}>
                <View style={styles.myNavBar}>


                    {hideBackIcon ? null :
                        <Button style={styles.backBtn} size="small" onClick={this.goBack}>
                            {/* <Icon name='chevron-left' size={32} color='#474747' /> */}
                            <Image source={left} style={{width:80,height: 80}}/>
                        </Button>
                    }




                    <View style={{flex: 1}}>
                        <View style={{width: '100%', justifyContent: 'center', opacity: this.props.titleOpacity, alignItems: 'center'}}>{
                            (typeof this.props.title === 'string') ?
                                <Text style={{color: 'white',fontSize: 20,}}>{this.props.title}</Text> : this.props.title
                        }</View>
                    </View>



                    {this.props.right ?
                        ((typeof this.props.right === 'string') ? <Text>this.props.right</Text> : this.props.right) : null
                    }

                </View>

                <View style={{flex: 1, display: 'flex'}}>
                    <View style={[styles.pageContent, {flex: 1}, this.props.contentStyle]}>
                        {
                            this.props.noScroll ? <View style={LayerStyles.scrollPanel}>{children}</View> : <ScrollView style={LayerStyles.scrollPanel} keyboardShouldPersistTaps="handled">

                                {children}

                            </ScrollView>
                        }

                    </View>
                    {footer !== false && footer ? (
                        <View style={[styles.footerContent, this.props.footerStyle]}>
                            {footer}
                        </View>
                    ) : null}
                    {this.props.loading ?
                        <View style={[LayerStyles.xyhLayer, this.props.transparent && styles.transparent, {zIndex: 4, backgroundColor: 'transparent'}]}>

                            <Spinner />


                        </View> : null
                    }
                </View>
            </View>
        )
    }
}

SubNavBar.propTypes = {
    title: PropTypes.any
}


const mapDispatchToProps = (dispatch) => {
    return {
        dispatch
    }
}

export default connect(null, mapDispatchToProps)(SubNavBar);