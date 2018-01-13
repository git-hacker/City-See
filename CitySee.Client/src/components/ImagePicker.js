import React, {Component} from 'react';
import classnames from 'classnames';
import TouchFeedback from 'rmc-feedback';
import {Flex} from 'antd-mobile';
import PropsTypes from 'prop-types'

function noop() { }


export default class ImagePicker extends Component {
  static defaultProps = {
    prefixCls: 'am-image-picker',
    files: [],
    onChange: noop,
    onImageClick: noop,
    onAddImageClick: noop,
    onFail: noop,
    selectable: true,
  };

  

  constructor(props){
    super(props);
    let fileSelectorInput=undefined;
  }
 
  getOrientation = (file, callback) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const view = new DataView((e.target).result);
      if (view.getUint16(0, false) !== 0xFFD8) {
        return callback(-2);
      }
      let length = view.byteLength;
      let offset = 2;
      while (offset < length) {
        const marker = view.getUint16(offset, false);
        offset += 2;
        if (marker === 0xFFE1) {
          let tmp = view.getUint32(offset += 2, false);
          if (tmp !== 0x45786966) {
            return callback(-1);
          }
          let little = view.getUint16(offset += 6, false) === 0x4949;
          offset += view.getUint32(offset + 4, little);
          let tags = view.getUint16(offset, little);
          offset += 2;
          for (let i = 0; i < tags; i++) {
            if (view.getUint16(offset + (i * 12), little) === 0x0112) {
              return callback(view.getUint16(offset + (i * 12) + 8, little));
            }
          }
        } else if ((marker & 0xFF00) !== 0xFF00) {
          break;
        } else {
          offset += view.getUint16(offset, false);
        }
      }
      return callback(-1);
    };
    reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
  }

  getRotation = (orientation = 1) => {
    let imgRotation = 0;
    switch (orientation) {
      case 3:
        imgRotation = 180;
        break;
      case 6:
        imgRotation = 90;
        break;
      case 8:
        imgRotation = 270;
        break;
      default:
    }
    return imgRotation;
  }

  removeImage = (index) => {
    const newImages = [];
    const { files = [] } = this.props;
    files.forEach((image, idx) => {
      if (index !== idx) {
        newImages.push(image);
      }
    });
    if (this.props.onChange) {
      this.props.onChange(newImages, 'remove', index);
    }
  }

  addImage = (imgItem) => {
    const { files = [] } = this.props;
    const newImages = files.concat(imgItem);
    if (this.props.onChange) {
      this.props.onChange(newImages, 'add');
    }
  }

  onImageClick = (index) => {
    if (this.props.onImageClick) {
      this.props.onImageClick(index, this.props.files);
    }
  }

  onFileChange = () => {
    const fileSelectorEl = this.fileSelectorInput;
    if (fileSelectorEl && fileSelectorEl.files && fileSelectorEl.files.length) {
      const file = fileSelectorEl.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataURL = (e.target).result;
        if (!dataURL) {
          if (this.props.onFail) {
            this.props.onFail('Fail to get image');
          }
          return;
        }

        let orientation = 1;
        this.getOrientation(file, (res) => {
          // -2: not jpeg , -1: not defined
          if (res > 0) {
            orientation = res;
          }
          this.addImage({
            url: dataURL,
            orientation,
            file,
          });

          fileSelectorEl.value = '';
        });
      };
      reader.readAsDataURL(file);
    }
  }

  render() {
    const {
      prefixCls, style, className, files = [], selectable, onAddImageClick,
    } = this.props;

    const imgItemList  = [];

    const wrapCls = classnames(`${prefixCls}`, className);

    files.forEach((image, index) => {
      const imgStyle = {
        backgroundImage: `url(${image.url})`,
        transform: `rotate(${this.getRotation(image.orientation)}deg)`,
      };
      imgItemList.push(
        <Flex.Item key={`item-${index}`}>
          <div key={index} className={`${prefixCls}-item`} >
            <div
              className={`${prefixCls}-item-remove`}
              role="button"
              aria-label="Click and Remove this image"
              onClick={() => { this.removeImage(index); }}
            />
            <div
              className={`${prefixCls}-item-content`}
              role="button"
              aria-label="Image can be clicked"
              onClick={() => { this.onImageClick(index); }}
              style={imgStyle}
            />
            {
                image.tag?  <div className={`am-image-tag ${this.props.imageClassName||''}`}>{image.tag}</div>: null
            }
           
          </div>
        </Flex.Item>,
      );
    });
    const selectEl = (
      <Flex.Item key="select">
        <TouchFeedback activeClassName={`${prefixCls}-upload-btn-active`}>
          <div
            className={`${prefixCls}-item ${prefixCls}-upload-btn`}
            onClick={onAddImageClick}
            role="button"
            aria-label="Choose and add image"
          >
            <input
              ref={(input) => { this.fileSelectorInput = input; }}
              type="file"
              accept="image/jpg,image/jpeg,image/png,image/gif"
              onChange={() => { this.onFileChange(); }}
            />
          </div>
        </TouchFeedback>
      </Flex.Item>
    );
    let allEl = selectable ? imgItemList.concat([selectEl]) : imgItemList;
    const length = allEl.length;
    if (length !== 0 && length % 4 !== 0) {
      const blankCount = 4 - length % 4;
      let fillBlankEl = [];
      for (let i = 0; i < blankCount; i++) {
        fillBlankEl.push(<Flex.Item key={`blank-${i}`} />);
      }
      allEl = allEl.concat(fillBlankEl);
    }
    const flexEl = [];
    for (let i = 0; i < allEl.length / 4; i++) {
      const rowEl = allEl.slice(i * 4, i * 4 + 4);
      flexEl.push(rowEl);
    }
    const renderEl = flexEl.map((item, index) => (
      <Flex key={`flex-${index}`}>
        {item}
      </Flex>
    ));
    return (
      <div className={wrapCls} style={style}>
        <div className={`${prefixCls}-list`} role="group">
          {renderEl}
        </div>
      </div>
    );
  }
}

ImagePicker.propTypes = {
    style: PropsTypes.object,
    files: PropsTypes.array,
    onChange: PropsTypes.func,
    onImageClick:PropsTypes.func,
    onAddImageClick: PropsTypes.func,
    onFail: PropsTypes.func,
    selectable: PropsTypes.bool,
    prefixCls: PropsTypes.string,
    className: PropsTypes.string
} 