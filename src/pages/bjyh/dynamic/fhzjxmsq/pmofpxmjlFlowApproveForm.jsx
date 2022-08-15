import React, { Component } from "react"
import {validationRequireField, singleInputFill} from '../code';

import FlowForm from "../../../templates/dynamic/Flow/FlowForm";

//分行自建项目申请--流程--PMO分配项目经理审批
class pmofpxmjlFlowApproveForm extends FlowForm.Component {

    constructor(props) {
        super(props)
        this.state.moduserprops={
            ismoduser:true,//是否启用更改处理人
            ajaxurl:'',//数据源接口地址：不定义则使用默认地址
            moduserCondition:[{//更改处理人用户列表查询条件
                field_name:'sloginname',
                field_value:"'gl','gs','ls','kf','yw'",
                expression:'in'
            }]//零售业务、公司及金融市场业务、管理类业务
        }
    }

    /**
     * 监听单选框
     * @param e
     */
    handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let flag = e.target.value == 'SYSF' ? true : false
        validationRequireField(_this,  'spmoclyj', flag)
    }

    /**
     * 保存前拦截
     * @param saveData 要保存的数据
     * @return boolean 如果返回false,则不执行保存，不返回或返回其他值都执行保存
     *
     */
    onBeforeSave = (formData, btnName) => {
        let _this = this

        singleInputFill(formData, btnName, 'spmoclyj', true)
    }
}

pmofpxmjlFlowApproveForm = FlowForm.createClass(pmofpxmjlFlowApproveForm)
export default pmofpxmjlFlowApproveForm
