import { DatePicker } from 'antd-mobile'


class DatePickerEx extends DatePicker {
    //bug修正
    fixOnOk = (picker) => {
        if (picker) {
            picker.onOk = this.onOk;
        }
    }
}

export default DatePickerEx;