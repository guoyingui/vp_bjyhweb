import React, { Component } from "react"
import {
    vpQuery,
} from 'vpreact'

import { common, fhzjxmsq } from '../code';
import FlowForm from "../../../templates/dynamic/Flow/FlowForm";

//分行自建项目取消--流程--提交申请
class fhzjxmqxApplyForm extends FlowForm.Component {

    constructor(props) {
        super(props)
    }

    /**
     * 表单加载之前动作
     * @param data
     */
    onGetFormDataSuccess(data){
        let _this = this

        _this.props.form.setFieldsValue({
            'icreator_label': common.nickname ,
            'dqxsj': common.currentDate
        })

        return new Promise(resolve => {
            vpQuery('/{bjyh}/fhzjxmqx/getDesignatedNodePer',{ sname: fhzjxmsq.lcbzbm_fhkjzgldsh, entityId: _this.props.iobjectid
            }).then((response) => {
                if (response.data.length > 0) {
                    let res = response.data
                    // 自动获取该项目的项目经理和开发负责人
                    data.handlers[0].ids = response.data[0].userid
                    data.handlers[0].names = response.data[0].username
                    resolve(data)
                }else{
                    resolve(data)
                }
            })
        })
    }

}
fhzjxmqxApplyForm = FlowForm.createClass(fhzjxmqxApplyForm)
export default fhzjxmqxApplyForm
