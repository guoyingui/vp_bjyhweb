/*
 * @author: SL.
 */
import React, {
    Component
} from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';

import {
    vpQuery,
    vpAdd,
    VpAlertMsg
} from 'vpreact';
import {findFiledByName} from 'utils/utils';

//开发负责人、运营代表编写并上传材料
class kfywtxzl02 extends FlowForm.Component {
    constructor(props) {
        super(props);
    }

    // 加载成功后执行
    onDataLoadSuccess = (formData, _handlers) => {

    }

    onGetFormDataSuccess = data => {
        let sjumpflag02 = findFiledByName(data.form, 'sjumpflag02')
        let scondition = findFiledByName(data.form, 'scondition')
        const flag = sjumpflag02.field.widget.default_value
        if (flag) {
            data.scondition = flag
            scondition.field.widget.load_template.map(item => {
                if (item.value != flag) {
                    item.hidden = true
                }
            })
            scondition.field.widget.default_value = flag
        } else {
            data.scondition = 'SYSA'
            scondition.field.widget.default_value = 'SYSA'
            scondition.field.widget.load_template.map(item => {
                if (item.value != 'SYSA') {
                    item.hidden = true
                }
            })
        }

        let xmjl = findFiledByName(data.form,'rxmjl')        
        xmjl && data.handlers.map(item => {
            if(item.flag === 'SYSA') {
                item.ids = xmjl.field.widget.default_value ||''
                item.names = xmjl.field.widget.default_label || ''
            }
        })

    }

}
kfywtxzl02 = FlowForm.createClass(kfywtxzl02);
export default kfywtxzl02;