import React, { Component, Children } from 'react';
import { List, Modal,ActionSheet } from 'antd-mobile';
import { Platform, StatusBar, View, ScrollView, Text, StyleSheet, TouchableOpacity, Image, ListView } from 'react-native'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux';
import {IndexPageStyles} from './indexPageStyle'
import NavBar from '../../components/NavBar'
import ProjectItem from '../../components/ProjectItem'
import TabBar from '../../components/TopToolbar'
import ListItem from '../../components/listItem'
import Comment from '../../components/Comment'

const style = StyleSheet.create(
    {
        main: {
            // padding: 5,
            marginBottom: 10,
            borderStyle: 'solid',
            borderBottomColor: '#e5e5e5',
            borderBottomWidth: 1
        },
        right:{
            height: 120,
            position: 'absolute',
            // backgroundColor: 'red',
            right:0,
            top:0,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '10%'
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
            height: 300,
            list: [
                {
                name: '成都银泰中心',
                imgSource:  require('../../images/timg.jpg'),
                },
                {
                  name: '安邦成都金融广场',
                  imgSource:  require('../../images/timg.jpg'),
                },
                {
                  name: '东方希望中心',
                  imgSource:  require('../../images/timg.jpg'),
                },
                {
                  name: '首座MAX',
                  imgSource:  require('../../images/timg.jpg'),
                },
                {
                  name: '创新时代广场',
                  imgSource:  require('../../images/timg.jpg'),
                },
                {
                  name: '成都银泰中心',
                  imgSource:  require('../../images/timg.jpg'),
                },
                {
                  name: '成都银泰中心',
                  imgSource:  require('../../images/timg.jpg'),
                },
                {
                  name: '成都银泰中心',
                  imgSource:  require('../../images/timg.jpg'),
                },
            ]
        }
    }
    
    componentDidMount() {
        for (let i = 0; i < 5 ; i++) {
            this._data[i] = {
                icon: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1515868814197&di=744ee9f65e84173f67137d8da3e0b9d4&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimage%2Fc0%253Dshijue1%252C0%252C0%252C294%252C40%2Fsign%3Dcd21589de350352aa56c2d4b3b2a9187%2Fc75c10385343fbf245c3f109ba7eca8065388f29.jpg',
                name: '成都银泰中心',
                time: '1小时前',
                userName: '匿名用户',
                content: '哈哈哈哈',
                imgs: ['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1515868636772&di=f0555db77693d4958df0507261b3a839&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimage%2Fc0%253Dpixel_huitu%252C0%252C0%252C294%252C40%2Fsign%3D98a762398c44ebf8797c6c7fb081b246%2F0dd7912397dda1445ef33788b9b7d0a20cf48616.jpg','https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1515868636770&di=7d36c2aba37068678f86d94ed9562990&imgtype=0&src=http%3A%2F%2Fwan.kud6.com%2Ffiles%2F2014-9%2F20140916145249168918.jpg', 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1515868636768&di=9315a73ca164514cbb73776ee1633542&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimage%2Fc0%253Dpixel_huitu%252C0%252C0%252C294%252C40%2Fsign%3Dbd7885fadcca7bcb6976cf6fd7710e0f%2Fc75c10385343fbf27d671a1abb7eca8065388f44.jpg']
            }
            this._rowIds[0].push(i)
        }
        let ns = {
            dataSource: this.state.dataSource.cloneWithRowsAndSections(this._data, this._sections, this._rowIds),
            loading: false
        }
        this.setState(ns);
    }
   
    render() {
        const row = (rowData, sectionID, rowID) => {
            return <View style={style.main}>
                      <ListItem item={rowData}  onClick={() => this.gotoDetail(rowData)} />
                      <Comment/>
                   </View>
        }
        return (
            <View style={IndexPageStyles.content}>
                <NavBar titleName={this.props.page === 'attention' ? '关注' : '眷城'}/>
                <View style={{padding: 10, height: '100%'}}>
                    <ScrollView style={{height: 240, width: this.props.page === 'attention' ? '90%' : '100%'}} horizontal>
                    <View style={[IndexPageStyles.topBuilding]}>
                    {
                        this.state.list.map((item, index) => {
                            return (
                                <ProjectItem key={index} name={item.name} imgSource={item.imgSource}/>
                            )
                        })
                    }
                    </View>
                    </ScrollView>
                    {
                        this.props.page === 'attention' ?
                        <View style={style.right}>
                            <Image style={{height:30, width: 30}} source={require('../../images/right_b.png')}/>
                        </View>
                        :
                        null
                    }
                    
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
                
                
            </View>
 
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


