import React, {Component} from 'react';
// import ReactDOM from 'react-dom'
import {View, ListView, StyleSheet, Text, TouchableOpacity, TouchableHighlight, Image} from 'react-native'
import {Button, Flex, InputItem, List, TextareaItem ,WingBlank, ImagePicker, Modal, Checkbox, WhiteSpace} from 'antd-mobile';
// import {Route} from 'react-router';
import {connect} from 'react-redux';
import Layer, {LayerRouter} from '../../components/Layer';
import SubNavBar from '../../components/SubNavBar';

const CheckboxItem = Checkbox.CheckboxItem;
const styles = StyleSheet.create({
  myHouse: {
      display: 'flex',
      flex: 1,
      marginTop: 10,
      flexDirection: 'row',
      paddingLeft: 10,
      paddingRight: 10,
      alignItems:'center',
      justifyContent: 'space-between'
    }
})


class SendPage extends Component {
    state = {
      files: [],
      showPickerSelector: false,
      canEdit: false
    }
    chooseImage = (e) => {
      this.setState({ showPickerSelector: true })
    }

    pickerSelected = async (idx) => {
            this.setState({ showPickerSelector: false })
            let images = null;
            if (idx === 0) {
              images = await ImageCropPicker.openCamera({
                multiple: false,
                mediaType: 'photo',
                compressImageQuality: 1,
              })
            } else if (idx === 1) {
              images = await ImageCropPicker.openPicker({
                multiple: false,
                mediaType: 'photo',
                compressImageQuality: 1,
              })
            } else {
        
            }
            if (images) {
              let path = images.path;
              if (path) {
                try {
                  await this._uploadFile({
                    name: 'khtx.jpg',
                    file: path
                  })
                } catch (e) {
                  Toast.fail(`上传文件失败：${(e || {}).message || ''}`)
                }
              }
        
            }
        }

    _uploadFile = async (file, callback) => {
        let uploadUrl = this.props.config.upload;
        uploadUrl = `${uploadUrl}/file/upload/${this.state.addId}`
        let fileGuid = await UUIDGenerator.getRandomUUID();
        let fd = new FormData();
        fd.append("fileGuid", fileGuid)
        fd.append("name", file.name)
        let fileData = {
          uri: file.file,
          type: 'multipart/form-data',
          name: file.name
        }
        fd.append("file", fileData);

        Toast.loading('正在上传...', 600, () => {

        })

        let response = await fetch(uploadUrl, {
          method: 'POST',
          body: fd
        });
        let data = await response.json();

        Toast.hide();
        if (data.code === "0") {

          let uf = {
            fileGuid: fileGuid,
            from: 'wx-upload',
            WXPath: data.extension,
            sourceId: this.state.addId,
            appId: '',
            localUrl: file.file
          }
          await this.saveFile(uf);
        } else {
          Toast.fail('上传失败：' + data.message)
        }

      }
      saveFile = async (file, isWx) => {
        let url = this.props.config.api;
        url = `${url}/api/dealfiles/customer/upload/${this.state.addId}`;
        this.setState({ uploading: true });
        let data = await ApiClient.post(url, file, { source: 'wx' });
        let res = data.data || {};
        this.setState({ uploading: false })
      
        if (res.code === '0') {
          this.setState({
            files: this.state.files.concat({
              url: file.localUrl,
              id: file.fileGuid
            })
          });
        } else {
          Toast.fail('上传文件失败: ' + (res.message || ''))
        }

      }
    deleteFile = (index, files) => {
        alert('确认', '您确定要删除此图片吗？', [
          { text: '取消', onPress: () => { }, style: 'default' },
          {
            text: '确定', onPress: () => {
              let fileList = this.state.files
              fileList.splice(index, 1)
              this.setState({
                files: fileList
              })
            }
          },
        ])
    }
    onChangeFile = (files, type, index) => {
      if (type === 'remove') { // 移除
        this.deleteFile(index, files)
        return
      }
      this._uploadFile(files[files.length - 1], () => {
      })
    }

    onChange = (val) => {
      console.log(val);
    }
    submit = () => {
      console.log('发送')
    }
    changeTextArea = (val) => {
      console.log(val, 123)
      if (val) {
        this.setState({
          canEdit: true
        })
      } else {
        this.setState({
          canEdit: false
        })
      }
      
    }
    render() {
        const { files } = this.state;
        return (
            <Layer style={{flexDirection: 'column', paddingBottom: 5}}>
                <SubNavBar title='分享' hideBackIcon={true}
                right={this.state.canEdit? 
                  <TouchableOpacity activeOpacity={0.7}  onPress={this.submit} >
                      <View>
                        <Text style={{color: 'white', fontSize:16}}>发送</Text>
                      </View>
                  </TouchableOpacity>
                      : null}>
                  
                    <View style={{marginTop: 5}}>
                        <TextareaItem
                          placeholder="一起来分享你的故事吧..."
                          rows={6}
                          style={{borderWidth: 0}}
                          onChange= {this.changeTextArea}
                        />
                        <WingBlank style={{marginTop: 15,marginBottom: 10}}>
                            <ImagePicker
                                files={files}
                                onImageClick={(index, fs) => this.deleteFile(index, fs)}
                                onAddImageClick={this.chooseImage}
                            />
                        </WingBlank>
                    </View>
                    <CheckboxItem onChange={this.onChange()}>
                      <Text>匿名</Text>
                    </CheckboxItem>
                    <WhiteSpace size='sm' />
                    <View style={styles.myHouse}>
                      <View style={{justifyContent: 'flex-start',flexDirection: 'row', alignItems:'center'}}>
                          <Image source={require('../../images/myHouse.png')}/>
                          <Text style={{marginLeft: 10}}>所在建筑</Text>
                      </View>
                      <View style={{justifyContent: 'flex-end'}}>
                        <Image source={require('../../images/right.png')} style={{width: 25, height:25}}/>
                      </View>
                    </View>

                <Modal
                    popup
                    visible={this.state.showPickerSelector}
                    onClose={() => this.setState({ showPickerSelector: false })}
                    animationType="slide-up"
                >
                    <List >
                    {['拍照', '从手机相册选择', "取消"].map((i, index) => (
                        <List.Item onClick={() => this.pickerSelected(index)} key={index}>{i}</List.Item>
                    ))}
                    </List>
                </Modal>
                </SubNavBar>


            </Layer >
        )
    }
}



const mapState = (state, props) => {
    return {

    }
}

const mapDispatch = (dispatch) => {
    return {
        dispatch,

    }
}

export default connect(mapState, mapDispatch)(SendPage);