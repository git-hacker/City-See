import React, { Component } from 'react'
import { View, findNodeHandle, NativeModules,ScrillView, Modal, StyleSheet, TouchableWithoutFeedback, ScrollView } from 'react-native'
import {List, Radio} from 'antd-mobile'

const styles = StyleSheet.create({
    container:{ 
        width: '100%',
        display:'flex', 
        flexDirection:'row',
        backgroundColor:'white',
        borderWidth:1,
        borderColor:'rgba(0,0,0,0.1)'
    },
    list:{
        borderWidth:1,
        borderColor:'rgba(0,0,0,0.1)'
    },
    list2:{
        borderLeftWidth:0
    }
})

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showPopover: false,
            popoverAnchor: { x: 0, y: 0, width: 0, height: 0 },
            data:[],
            value:[],
            valueObjects : []
        };
    
        this.trigger = null;
        this.setRef = this.setRef.bind(this)
    }

    componentDidMount=()=>{
        this.setState({data: this.props.data, value: this.props.value})
        if(this.props.value && this.props.data){
            this._updateValueObject(this.props.data, this.props.value)
        }
        
    }

    componentWillReceiveProps=(nextProps)=>{
        let mustUpdate = false;
        if(this.props.data!= nextProps.data){
            this.setState({data: nextProps.data})
            mustUpdate = true;
        }
        if(this.props.value!= nextProps.value){
            this.setState({value: nextProps.value})
            mustUpdate = true;
        }
        if(mustUpdate && nextProps.value){
            this._updateValueObject(nextProps.data, nextProps.value)
        }
    }
    _updateValueObject= (data, value)=>{
        let parent =null;
        this.valueObjects=[];
        for(let i = 0;i<value.length;i++){
            let curVal = value[i]
            if(i===0){
                parent = data.find(x=>x.value === curVal)
            }else if(parent){
                parent = (parent.children||[]).find(x=>x.value === curVal)
            }
            if(parent){
                this.valueObjects.push(parent);
            }else{
                break;
            }
        }
    }

    setRef(ref) {
        this.touchable = ref;
    };

    onPress = () => {
        const handle = findNodeHandle(this.touchable);
        if (handle) {
            NativeModules.UIManager.measure(handle, this.onTouchableMeasured);
        }
    };

    onTouchableMeasured = (x0, y0, width, height, x, y) => {
        this.setState(
            {
                showPopover: true,
                popoverAnchor: { x, y, width, height },
            },
            () => {
                if (this.props.onPopoverDisplayed) {
                    this.props.onPopoverDisplayed();
                }
            },
        );
    };

    _selected=(idx, item, parent)=>{
       
        let na = [...this.state.valueObjects]
        na.splice(idx,0, item)
        this.setState({
            valueObjects:na
        },()=>{
            if(idx === (this.props.cols-1)){
                this.setState({showPopover:false},()=>{
                    if(this.props.onChanged){
                        this.props.onChanged(this.state.valueObjects.map(x=>x.value))
                    }
                })
                
            }else{
                if(this.props.onLevelClick){
                    this.props.onLevelClick(item, idx)
                }
            }
        })
    }

    onClosePopover = () => this.setState({ showPopover: false });

    _renderMenuList =()=>{
        let cols = this.props.cols || 1;
        let coloums = [];
        
        for(let i =0;i<cols;i++){
            let obj = this.state.valueObjects[i]
            let parent = null;
            if(i>0){
                parent = this.state.valueObjects[i-1]
            }
            let data= this.state.data||[]
            coloums.push(<ScrollView style={{flex:1}} key={i}>
                {
                    i===0?
                    <List style={[styles.list]}>
                        {
                            data.map(item=>{
                                return <Radio.RadioItem  key={item.value} checked={item===obj} onChange={()=>this._selected(i,item)}>{item.label}</Radio.RadioItem>
                            })
                        }
                    </List>:
                    <List style={[styles.list, styles.list2]}>
                           {
                               (parent && parent.children)?
                               parent.children.map(item=>{
                                return <Radio.RadioItem key={item.value} checked={item===obj} onChange={()=>this._selected(i,item, parent)}>{item.label}</Radio.RadioItem>
                               }):null
                           }         
                    </List>
                }
               
            </ScrollView>)
        }
      
        return coloums;
    }

    render() {
        const children = React.Children.toArray(this.props.children);
        if (
            children.length !== 1
        ) {
            throw new Error('必须包含一个子组件');
        }
        let anchor = this.state.popoverAnchor;
        let top = anchor.y + anchor.height;
        let height = this.props.height || 350
        
        return (
            <View style={this.props.style}>
                {
                    React.cloneElement(children[0], {
                        ref: this.setRef,
                        onPress: this.onPress,
                    })
                }
                <Modal
                    visible={this.state.showPopover}
                    transparent={true}
                    onRequestClose = {this.onClosePopover}
                    onClose={this.onClosePopover}
                    style={{top: 40}}
                    animationType="fade">

                    
                        <View style={{ flex: 1 }} >
                        <TouchableWithoutFeedback onPress={this.onClosePopover}>
                            <View style={{position:'absolute',width:'100%',top:0, height: top}} >
                            </View>
                        </TouchableWithoutFeedback>
                        {
                            this.props.mask ?
                            <TouchableWithoutFeedback onPress={this.onClosePopover}>
                                <View style={[StyleSheet.absoluteFill,
                                { backgroundColor: 'rgba(0, 0, 0, 0.1)', top: top },
                                this.props.maskStyle]}>
                                </View></TouchableWithoutFeedback>: null
                        }

                            <View style={[styles.container,{top: top, height: height}, this.props.contentStyle]}>
                                {
                                    this._renderMenuList()
                                }
                            </View>
                        </View>
                        

                </Modal>

            </View>
        );
    }
}



export default Menu;