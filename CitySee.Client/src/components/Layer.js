import React, { Component, Children } from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import LayerStyles from './LayerStyle';
import Spinner from './Spinner'

export class LayerRouter extends Component {
    render() {
        return this.props.children ? this.props.children:null;
    }
}


class Layer extends Component {

    constructor(props) {
        super(props);

        this.scrollPage = this.scrollPage.bind(this)
    }

    componentWillUnmount() {
        if (this.pageElement) {
            this.pageElement.removeEventListener('scroll', this.scrollPage)
        }
    }

    filterChildren() {
        let router = '';
        let otherChildren = [];
        Children.map(this.props.children, (element) => {
            if (element) {
                if (element.type === LayerRouter) {
                    router = element;
                } else {
                    otherChildren = [...otherChildren, element];
                }
            }
        });

        return [router, ...otherChildren];
    }

    scrollPage = () => {
        console.log(arguments);
    }

    render() {
        const [router, ...children] = this.filterChildren();

        return (
            <View style={LayerStyles.tarBar}>
                <View style={[LayerStyles.scrollPanel, this.props.style]}>
                    {children}
                </View>
                {router ? router : null}
                {this.props.showLoading ? (<Spinner></Spinner>) : null}
            </View>
        )
    }
}

export default Layer;
