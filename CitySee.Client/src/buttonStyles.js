import React from 'react'

let buttonStyles = require('antd-mobile/lib/button/style/index.native');

buttonStyles.linkHighlight={
    backgroundColor:'transparent',
    borderWidth:0
}
buttonStyles.linkRaw={
    backgroundColor:'transparent',
    borderWidth:0
}
buttonStyles.linkDisabledRaw = {
    opacity: 0.4,
}
buttonStyles.linkHighlightText = {
    color: '#262525',
}
buttonStyles.linkRawText = {
    color: '#424242',
}
buttonStyles.linkDisabledRawText = {
    color: '#9d9d9d',
}

export default buttonStyles;