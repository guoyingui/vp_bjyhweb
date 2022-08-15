import React, { Component } from "react"
import { vpQuery } from 'vpreact'

import DynamicForm from "../../../templates/dynamic/DynamicForm/DynamicForm"
import { common, dateToString } from "../code";

// ODS数据下发流程--流程实体
class odssjxflcEntityForm extends DynamicForm.Component {

    constructor(props) {
        super(props)
    }

    /**
     * 表单数据加载成功后
     * @param formData
     */
    onDataLoadSuccess = formData => {
        let _this = this
        // 获取字段
        const userId = common.userid
        if (_this.props.add) {
            vpQuery('/{bjyh}/fhzjxmsq/getUserInfoByUserId', {
                id: userId
            }).then((res) => {
                if (res.data) {
                    _this.props.form.setFieldsValue({
                        'rsqry': userId,
                        'rsqry_label': common.nickname,
                        'ssqrdh': res.data.hasOwnProperty('sphone') && res.data.sphone != null ? res.data.sphone : '',
                        'ssqryx': res.data.hasOwnProperty('semail') && res.data.semail != null ? res.data.semail : ''
                    })
                }
                _this.props.form.setFieldsValue({
                    'sname': dateToString(common.currentDate, '') + common.dptname + '申请数据下发'
                })
            })
        }
    }

}
odssjxflcEntityForm = DynamicForm.createClass(odssjxflcEntityForm)
export default odssjxflcEntityForm
