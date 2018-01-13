import {Picker} from 'antd-mobile'


class PickerEx extends Picker{
        //bug修正
        fixOnOk = (picker) => {
            if (picker) {
                picker.onOk = this.onOk;
            }
        }
}

export default PickerEx;