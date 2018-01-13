import React, { Component } from 'react'
import {Text, View} from 'react-native'
import { List} from 'antd-mobile'
import Time from 'react-time-format'
import DatePicker from './DatePicker'


class DatePickerItem extends Component {

    constructor(props){
        super(props)
        this.state = {
            visible: false,
            dpValue: props.defaultValue,
            value: props.value
        }
    }
    

    
    

    componentWillReceiveProps = (nextProps) => {
        this.setState({ value: nextProps.value, dpValue: nextProps.defaultValue })
    }

    onOk = (date)=>{
        this.setState({ value: date, visible: false })
        if(this.props.onChange){
            this.props.onChange(date);
        }
    }


    render() {
        let fmtValue = '';
        let fmt = this.props.formatStr;

        if (!fmt) {
            switch (this.props.mode) {
                case 'date':
                    fmt = 'YYYY-MM-DD';
                    break;
                case 'time':
                    fmt = 'HH:mm';
                    break;
                case 'datetime':
                    fmt = 'YYYY-MM-DD HH:mm:ss';
                    break;
                case 'year':
                    fmt = 'YYYY';
                    break;
                case 'month':
                    fmt = 'MM';
                    break;
                default:
                    break;
            }
        }
        if(this.state.value!=null && typeof this.state.value!=='undefined'){
            fmtValue = Time.format(this.state.value, fmt);
        }

        let dpProps = {
            minDate: this.props.minDate,
            maxDate: this.props.maxDate,
            mode: this.props.mode,
            use12Hours : this.props.use12Hours ,
            minuteStep: this.props.minuteStep,
            title: this.props.title,
        }
       
        return (
            <View>
                <List.Item
                    extra={<Text>{fmtValue}{this.props.extra}</Text>}
                    arrow = {this.props.arrow}
                    disabled = {this.props.disabled}
                    error={this.props.error}
                    className={this.props.className}
                    onClick={() => this.setState({ visible: true })}
                >
                {this.props.children}
                </List.Item>
                <DatePicker
                    {...dpProps}
                    visible={this.state.visible}
                    value={ this.state.value || this.state.dpValue}
                    onOk={this.onOk}
                    onDismiss={() => this.setState({ visible: false })}
                />
            </View>
        )
    }
}

export default DatePickerItem;