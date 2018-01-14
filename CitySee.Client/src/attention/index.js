import React, { Component, Children } from 'react';
import { List, Modal,ActionSheet } from 'antd-mobile';
import { Platform, StatusBar, View, ScrollView, Text, StyleSheet, TouchableOpacity, Image, ListView } from 'react-native'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux';
import NavBar from '../components/NavBar'
import AttentionItem from '../components/attentionItem'
import Layer, {LayerRouter} from '../components/Layer';
import SubNavBar from '../components/SubNavBar';


const style = StyleSheet.create(
    {
        main: {
            // padding: 5,
            marginBottom: 10,
            borderStyle: 'solid',
            borderBottomColor: '#e5e5e5',
            borderBottomWidth: 1
        }
    }
)

class HomePage extends Component {

    constructor(props) {
        super(props)
        const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID]
        const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID]

        this._sections = ['SDEFAULT']
        this._rowIds = [[]]
        this._data = { 'SDEFAULT': '' }

        const dataSource = new ListView.DataSource({
            getRowData,
            getSectionHeaderData: getSectionData,
            rowHasChanged: (row1, row2) => row1 !== row2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        })


        this.state = {
            dataSource,
            loading: false,
            keyword: '',
            pageIndex: 1,
            pageSize: 20,
            list: [
                {
                  name: '成都银泰中心',
                  place:  '四川省成都市高新区银泰中心',
                  imgSource:  require('../images/timg.jpg'),
                  isAttention: true                  
                },
                {
                  name: '安邦成都金融广场',
                  place:  '四川省成都市高新区安邦成都金融广场',
                  imgSource:  require('../images/timg.jpg'),      
                  isAttention: true                  
                },
                {
                  name: '东方希望中心',
                  place:  '四川省成都市高新区东方希望中心',
                  imgSource:  require('../images/timg.jpg'),    
                  isAttention: false                  
                },
                {
                  name: '首座MAX',
                  place:  '四川省成都市高新区首座MAX',
                  imgSource:  require('../images/timg.jpg'), 
                  isAttention: false                                   
                },
                {
                  name: '创新时代广场',
                  place:  '四川省成都市高新区创新时代广场',
                  imgSource:  require('../images/timg.jpg'),       
                  isAttention: false                             
                },
                {
                  name: '成都银泰中心',
                  place:  '四川省成都市高新区银泰中心',
                  imgSource:  require('../images/timg.jpg'),   
                  isAttention: false               
                },
                {
                  name: '成都银泰中心',
                  imgSource:  require('../images/timg.jpg'),                                    
                  place:  '四川省成都市高新区银泰中心',
                  isAttention: true
                },
                {
                  name: '成都银泰中心',
                  imgSource:  require('../images/timg.jpg'),              
                  place:  '四川省成都市高新区银泰中心',
                  isAttention: false
                },
            ]
        }
    }
    
    componentDidMount() {
        this.state.list.forEach((v,i) => {
            this._data[i] = v
            this._rowIds[0].push(i)
        })
        let ns = {
            dataSource: this.state.dataSource.cloneWithRowsAndSections(this._data, this._sections, this._rowIds),
            loading: false
        }
        this.setState(ns)
    }
   
    render() {
        const row = (rowData, sectionID, rowID) => {
            return <AttentionItem item={rowData} />
        }
        return (
            <Layer>
                <SubNavBar  title='我的关注'>
                    <View style={{padding: 10, height: '100%'}}>
                        <ListView
                            ref={el => this.lv = el}
                            onScroll={() => { console.log('scroll') }}
                            scrollRenderAheadDistance={500}
                            onEndReached={this.onEndReached}
                            onEndReachedThreshold={10}
                            style={{height: 1000}}
                            renderFooter={() => (<View style={{ padding: 30, display: 'flex', justifyContent:'center', alignItems: 'center' }}>
                                <Text>{this.state.loading ? '正在获取数据...' : ''}</Text>
                            </View>)}
                            dataSource={this.state.dataSource}
                            renderRow={row}
                        >
                        </ListView>
                    </View>
                </SubNavBar>
            </Layer>
        )
    }
}

const mapStateToProps = (state, action) => {
    return {
       
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)