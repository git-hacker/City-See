import React from 'react';
import {StyleSheet, Text, TouchableHighlight, TextInput} from "react-native";
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {InputItem, Toast, List, Checkbox, TextareaItem, Modal} from 'antd-mobile';
import DatePickerItem from '../components/DatePickerItem'
import Picker from '../components/Picker'

const CheckboxItem = Checkbox.CheckboxItem;
let alert = Modal.alert;

const styles = StyleSheet.create({
  icon: {
    alignSelf: 'flex-end'
  }
})

const showError = (error) => {
  Toast.info(error, 1);
}

function ErrorIcon(props) {
  return <TouchableHighlight underlayColor='rgb(250,250,250)' style={styles.icon} onPress={() => showError(props.error)}>
  {/* <MaterialIcons size={24} color='red' name='error-outline' /> */}
  </TouchableHighlight>
}

// const errorIcon = (error)=>{
//   return <TouchableHighlight underlayColor='rgb(250,250,250)' style={styles.icon} onPress={()=>showError(error)}><MaterialIcons size={24}  color='red' name='error-outline' /></TouchableHighlight>
// }

export const renderTextField = (
  {
    input,
    label,
    meta: {touched, error},
    brief,
    ...custom
  }
) => {
  let hasError = error != '' && error != null;
  let children = [];
  if (label) {
    children.push((typeof label === 'string') ? <Text>{label}</Text> : label);
  }
  if (brief) {
    children.push((typeof brief === 'string') ? <Text>{brief}</Text> : brief);
  }
  return (
    <InputItem
      {...input} {...custom}
      error={error && touched}
      style={custom.style}
      onErrorClick={() => showError(error)}
    >
      {
        (children && children.length > 0) ? children : null
      }
    </InputItem>
  )
}

export const renderDateField = (
  {
    input,
    label,
    meta: {touched, error},
    ...custom
  }
) => {
  let hasError = error && touched;
  return (
    <DatePickerItem title="选择日期"
      arrow="horizontal"
      error={hasError}
      mode='date'  {...input} {...custom}
      disabled={custom.disabled}
      extra={hasError ? <ErrorIcon error={error} /> : null}
    >
      {label ? (typeof label === 'string') ? <Text>{label}</Text> : label : null}
    </DatePickerItem>


  )
}



export const renderCheckboxField = (
  {
    input,
    label,
    meta: {touched, error},
    brief,
    ...custom
  }
) => {
  return (
    <CheckboxItem checked={input.value}   {...input} {...custom}>
      {label ? (typeof label === 'string') ? <Text>{label}</Text> : label : null}
      {brief ? (typeof brief === 'string') ? <Text>{brief}</Text> : brief : null}
    </CheckboxItem>

  )
}



export const renderTextareaField = (
  {
    input,
    label,
    meta: {touched, error},
    ...custom
  }
) => {

  return (
    <TextareaItem  {...input} {...custom}
      error={error && touched}
      // title={label} //rn不支持
      onErrorClick={() => showError(error)}>

    </TextareaItem>

  )
}



export const renderPickerField = (
  {
    input,
    label,
    meta: {touched, error},
    ...custom
  }
) => {
  let hasError = error && touched;
  let areaOverride = {};
  if (custom.isArea) {
    areaOverride.onChange = () => {}
  }
  return (
    <Picker
      {...input} {...custom}
      onPickerChange={custom.onPickerChange}
      {...areaOverride}
      extra={hasError ? <ErrorIcon error={error} /> : null}
    //extra={<View style={{ float: 'right' }} onClick={(e) => { showError(error); e.preventDefault(); e.stopPropagation(); return false; }} className="am-input-error-extra" />}
    >
      <List.Item
        arrow="horizontal"
        disabled={custom.disabled}
        className={hasError ? 'am-input-error' : ''}
        error={hasError}
      >{label ? (typeof label === 'string') ? <Text>{label}</Text> : label : null}</List.Item>
    </Picker>
  )
}



//* 验证错误 */
export const checkValidateError = (values, validator, showAlert = true) => {
  let errors = validator(values);

  let keys = Object.keys(errors);
  let lines = [];
  for (let i = 0; i < keys.length; i++) {

    lines.push(<li key={i}>{errors[keys[i]]}</li>)
  }
  if (lines.length > 0 && showAlert) {
    alert('错误', <ul className="error-list">
      {lines}
    </ul>)
  }

  return lines;
}


export const renderListItem = (
  {
    input,
    label,
    meta: {touched, error},
    brief,
    ...custom,
    extra
    }
) => {
  let hasError = error && touched;

  return (
    <List.Item
      error={hasError}
      {...custom}
      // extra={hasError? <ErrorIcon error={error}/>:extra}>
      extra={hasError?<View style={{ float: 'right' }} onClick={(e) => { showError(error); e.preventDefault(); e.stopPropagation(); return false; }} className="am-input-error-extra" />: custom.extra}>
     {label?(typeof label==='string')?<Text>{label}</Text>:label:null}
     {brief?(typeof brief==='string')?<Text>{brief}</Text>:brief:null}
    </List.Item>

  )
}
      //extra={hasError?<View style={{ float: 'right' }} onClick={(e) => { showError(error); e.preventDefault(); e.stopPropagation(); return false; }} className="am-input-error-extra" />: custom.extra}>
