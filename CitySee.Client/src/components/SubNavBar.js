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

const navLeft = require('../images/navLeft.png');

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
        // position: 'relative',
        // top: 3*u + sbHeight,
        // width: '100%',
        // bottom: 0 
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
        // bottom:0,
        // position:'absolute',
        width: '100%',
        zIndex: 2
    }
})

const navbarStyles = StyleSheet.create({
    statusBar: {
        //  backgroundColor: 'red',

    },
    navBar: {
        backgroundColor: '#f3f3f3',
        height: 3 * u,
        paddingLeft: 8,
        paddingRight: 8
    },
    //   title: {
    //     color: '#fff',
    //   },
    //   buttonText: {
    //     color: '#b5b5b5',
    //   },
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
            <View style={[LayerStyles.xyhLayer, {display: 'flex', flexDirection: 'column'}]}>
                <NavBar style={navbarStyles}>


                    {hideBackIcon ? null :
                        <Button style={styles.backBtn} size="small" onClick={this.goBack}>
                            {/* <Icon name='chevron-left' size={32} color='#474747' /> */}
                            <Image source={navLeft} />
                        </Button>
                    }




                    <View style={{flex: 1}}>
                        <View style={{width: '100%', justifyContent: 'center', opacity: this.props.titleOpacity, alignItems: 'center'}}>{
                            (typeof this.props.title === 'string') ?
                                <Text style={{color: '#474747'}}>{this.props.title}</Text> : this.props.title
                        }</View>
                    </View>



                    {this.props.right ?
                        ((typeof this.props.right === 'string') ? <Text>this.props.right</Text> : this.props.right) : null
                    }

                </NavBar>

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
            // <div className="layer-page relative">
            //     <NavBar leftContent="" className={`sub-nav-bar ${tc}`} style={{ position: 'fixed', width: '100%', zIndex: 3, ...style }}
            //         onLeftClick={this.goBack}
            //         mode="light"
            //         icon={hideBackIcon?null:<Icon type="left" />}
            //         rightContent={
            //             this.props.right
            //         }
            //     ><span style={{display:'flex', width:'100%', justifyContent:'center', opacity: titleOpacity}}>{this.props.title}</span></NavBar>
            //     <div className={`page-content ${this.props.contentClassName||''} ${tc} ${footer === false ? '' : 'has-footer'}`}>
            //         {children}
            //         {
            //             this.props.overflowLoading && this.props.loading ?
            //             <div className="relative">
            //                 <Spinner style={{ position: 'absolute' }} />
            //             </div>: null
            //         }
            //     </div>
            //     {footer !== false ? (
            //         <div className="footer-content">
            //             {footer}
            //         </div>
            //     ) : null}
            //     {this.props.loading ?
            //         <div className={`page-content ${this.props.contentClassName||''} ${tc}`}  style={{ zIndex: 4, background:'transparent' }}>
            //             <div className="relative">
            //                 <Spinner style={{ position: 'absolute' }} />
            //             </div>

            //         </div> : null
            //     }


            // </div>
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