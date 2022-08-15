import React, {
    Component
} from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';

import {
    vpQuery,
    vpAdd,
    VpAlertMsg
} from 'vpreact';
import { validationRequireField, singleInputFill } from '../code';
import {findFiledByName} from 'utils/utils';

//分行外部信息主管领导审批
class fhwbxxzgldsp02 extends FlowForm.Component {
    constructor(props) {
        super(props);
    }

    // 加载成功后执行
    onDataLoadSuccess = (formData, _handlers) => {
        let _this = this;
        console.log('_handlers', _handlers);
        

    }

    onGetFormDataSuccess = data => {
        const {handlers} = data
        let scondition = findFiledByName(data.form, 'scondition')
        let rzhlxr = findFiledByName(data.form, 'rzhlxr')
        const obj = {}
        obj.ids = rzhlxr.field.widget.default_value
        obj.names = rzhlxr.field.widget.default_label
        handlers.map(item => {
            item.flag === 'SYSL' && (item.ids = obj.ids,item.names = obj.names)
        })
                

        // if (rzhlxr && rzhlxr.field.widget.default_value) {
        //     const flag = rzhlxr.field.widget.default_value == 2 ? 'SYSA' : 'SYSB';
        //     data.scondition = flag
        //     scondition.field.widget.load_template.map(item => {
        //         if (item.value != flag) {
        //             item.hidden = true
        //         }
        //     })
        //     scondition.field.widget.default_value = flag
        // }
    }

    handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let flag = e.target.value == 'SYSM' ? true : false
        validationRequireField(_this, 'sfhzgldsp', flag)
    }

    onBeforeSave(formData, btnName) {
        singleInputFill(formData, btnName, 'sfhzgldsp', true)
    }

}
fhwbxxzgldsp02 = FlowForm.createClass(fhwbxxzgldsp02);
export default fhwbxxzgldsp02;