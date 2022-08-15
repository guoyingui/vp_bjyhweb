import React, {
    Component
} from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';

import {
    vpQuery,
    vpAdd,
    VpAlertMsg
} from 'vpreact';
import { common, validationRequireField, singleInputFill } from '../code';
import {findWidgetByName} from "../../../templates/dynamic/Form/Widgets";

//各部门领导审批
class xgbmldsp07 extends FlowForm.Component {
    constructor(props) {
        super(props);
        this.state.beValidateFieldArr = []
    }

    onGetFormDataSuccess = data => {
        let _this = this
        let checkFieldArr = []
        //若当前登陆人
        let rywbldsp = findWidgetByName.call(data.form,"rywbldsp") && findWidgetByName.call(data.form,"rywbldsp").field.widget.default_value ;
        if(common.userid == rywbldsp) {
            checkFieldArr.push('sywbldsp')
            _this.setState({beValidateFieldArr: checkFieldArr})
        }
        return new Promise(resolve => {
            //查询数据字典中配置的信科领导和软开领导 wbxx_hqld
            vpQuery('/{bjyh}/externalData/getDictionaryItem',{
                groupID: 'wbxx_hqld'
            }).then(res => {
                if(res.data) {
                    res.data.forEach(lel => {
                        if(lel.userid == common.userid) {
                            checkFieldArr.push(lel.stext == 'xxkj' ? 'sxkbldsp' : 'srjkfbldsp');
                        }
                    })
                }
                !checkFieldArr.length && checkFieldArr.push('sywbldsp')
                this.setState({beValidateFieldArr: checkFieldArr})
                resolve(data)
            })
        })
    }

    /**
     * 表单数据加载成功后
     * @param formData
     */
    onDataLoadSuccess = formData => {
        const _this = this
        const {beValidateFieldArr} = _this.state
        const allFields = ['sxkbldsp','srjkfbldsp','sywbldsp']
        const beRequired = allFields.filter(item => {return beValidateFieldArr.indexOf(item) === -1})
        beRequired.forEach(name => { this.retractNode(formData,name) })
    }

    /**
     * 收起指定节点
     * @param formData
     * @param fieldName
     */
    retractNode = (formData, fieldName) => {
        let nodeValue = formData.findWidgetByName(fieldName)
        nodeValue.field.props.disabled = true
        formData.groups[nodeValue.groupIndex].group_type = 2
    }

    /**
     * 监听单选框
     * @param e
     */
    handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let scondition = e.target.value
        // 校验标志
        let flag = scondition == 'SYSK' ? true : false
        const {beValidateFieldArr} = this.state
        beValidateFieldArr.forEach(element => {
            validationRequireField(_this, element, flag)
        }); 
    }

    /**
     * 保存前事件
     * @param formData
     * @param btnName
     */
    onBeforeSave = (formData, btnName) => {
        const {beValidateFieldArr} = this.state
        beValidateFieldArr.forEach(element => {
            singleInputFill(formData, btnName, element, true)
        })
    }

}

xgbmldsp07 = FlowForm.createClass(xgbmldsp07);
export default xgbmldsp07;