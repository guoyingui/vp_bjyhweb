import React, { Component } from "react"
import {
    vpQuery, VpMWarning
} from 'vpreact'

import DynamicForm from "../../../templates/dynamic/DynamicForm/DynamicForm"
import { common } from "../code";

// 分行自建项目申请--流程实体
class fhzjxmsqEntityForm extends DynamicForm.Component {

    constructor(props) {
        super(props)
    }

    /**
     * 表单数据加载成功后
     * @param formData
     */
    onDataLoadSuccess = formData => {
        let _this = this
        console.log(_this)
        // 获取字段
        const userId = common.userid
        vpQuery('/{bjyh}/fhzjxmsq/getUserInfoByUserId', {
            id: userId
        }).then((res) => {
            if (res.data) {
                _this.props.form.setFieldsValue({
                    'rsqry': userId,
                    'rsqry_label': common.nickname,
                    'dsqsj': common.currentDate,
                    'ssqrkjrydh': res.data.hasOwnProperty('sphone') && res.data.sphone != null ? res.data.sphone : ''
                })
            }
        })
    }

}
fhzjxmsqEntityForm = DynamicForm.createClass(fhzjxmsqEntityForm)
export default fhzjxmsqEntityForm
