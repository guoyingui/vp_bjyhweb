import React, { Component } from "react"
import {common, fhzjxmsq, validationRequireField, singleInputMonitor, singleInputFill} from '../code';

import FlowForm from "../../../templates/dynamic/Flow/FlowForm";
import { vpQuery } from "vpreact";

//分行自建项目申请--流程--项目经理初审
class xmjlcsFlowApproveForm extends FlowForm.Component {

    constructor(props) {
        super(props)
    }

    /**
     * 表单数据加载成功后
     * @param formData
     */
    onDataLoadSuccess = formData => {
        // 附件增加删除功能
        let rfj = formData.findWidgetByName('rfj');
        let arrfile = rfj.field.props.widget.load_template;
        arrfile.map(item=>{
            item.options.delete = true;
        })
    }

    /**
     * 表单加载之前动作
     * @param data
     */
    onGetFormDataSuccess(data){
        let _this = this
        return new Promise(resolve => {
            let handlers = data.handlers
            if (handlers) {
                for (let i = 0; i < handlers.length; i++) {
                    if (handlers[i].flag == 'SYSG') {
                        handlers[i].ids = common.userid
                        handlers[i].names = common.nickname
                    } else if (handlers[i].flag == 'SYSH') {
                        vpQuery('/{bjyh}/fhzjxmsq/getIcreatorByFlowEntityId',{ entityId: _this.props.iobjectid
                        }).then((res) => {
                            if (res) {
                                handlers[i].ids = res.data.iid + ""
                                handlers[i].names = res.data.sname
                            }
                            resolve(data)
                        })
                    }
                }
            }
            resolve(data)
        })
    }

    /**
     * 监听单选框
     * @param e
     */
    handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let flag = e.target.value == 'SYSH' ? true : false
        validationRequireField(_this,  'sxmjlcsyj', flag)
    }

    /**
     * 保存前拦截
     * @param saveData 要保存的数据
     * @return Promise<any> 如果返回false,则不执行保存，不返回或返回其他值都执行保存
     *
     */
    onBeforeSave = (formData, btnName) => {
        let _this = this
        singleInputFill(formData, btnName, 'sxmjlcsyj', true)
    }
}

xmjlcsFlowApproveForm = FlowForm.createClass(xmjlcsFlowApproveForm)
export default xmjlcsFlowApproveForm
