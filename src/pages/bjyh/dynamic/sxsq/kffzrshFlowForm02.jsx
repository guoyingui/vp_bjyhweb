/*
 * @Author:SL.
 * @Date: 2020-05-24 12:46:36
 * @LastEditTime: 2020-10-28 17:02:51
 * @LastEditors: Please set LastEditors
 * @Description: 【开发负责人审核】节点流程表单中增加“开发负责人审核意见”字段，多行文本，“审批结果”=批准，“开发负责人审核意见”自动填写“同意和签批人：姓名”，流程提交到【开发负责人提供上线文档】节点；“审批结果”=拒绝，系统提示：请填写“开发负责人审核意见”，填写完成后，自动填写“签批人：姓名”，流程提交到【提交上线申请】
 * @FilePath: \bjyhweb\src\pages\bjyh\dynamic\sxsq\kffzrshFlowForm02.jsx
 */
import React, {
    Component
} from "react";
import FlowForm from "../../../templates/dynamic/Flow/FlowForm";
import {
    singleInputFill,
    validationRequireField
} from '../code';
import { vpQuery,VpConfirm } from "vpreact";
import {findFiledByName} from 'utils/utils';

//开发负责人审核02
class kffzrshFlowForm02 extends FlowForm.Component {
    constructor(props) {
        super(props);
    }
    handleCondition(e) {
        let _this = this
        //增加逻辑处理
        const handlerNew = _this.state.handlers.filter(item => {return item.flag === 'SYSZH'})
        if(handlerNew.length && e.target.flag === 'childRef'){
            const ixqfh7 = _this.props.form.getFieldValue('ixqfh7')
            ixqfh7 == '2' && (e.target.value = 'SYSZG')
            _this.props.form.setFieldsValue({scondition: e.target.value})
        }
        super.handleCondition(e)
        let scondition = e.target.value == "SYSZG" ? true : false
        validationRequireField(_this, 'skffzrshyj', scondition)
    }
    onBeforeSave = (formData, btnName) => {
        let sparam = JSON.parse(formData.sparam)
        singleInputFill(formData, btnName, 'skffzrshyj', true)
        if(btnName=='ok'){
            if(sparam.scondition === 'SYSZI'){
                return new Promise(resolve => {
                    VpConfirm({
                        title: '提示',
                        content: '点击确定后，本次上线申请流程将终止，上线流程需业务部门重新发起。',
                        onOk(){resolve(true);},
                        onCancel(){resolve(false);}
                    }); 
                })
            } 
        }

    }
    onDataLoadSuccess = (formData,handlers) => {
        
        //20201023增加了节点及分支条件 根据handlers是否包涵SYSZH（不具备上线条件）分支判断
        const handlersNew= handlers.filter(item => {return item.flag === 'SYSZH'})
        let ixqfh7 = formData.findWidgetByName('ixqfh7');
        ixqfh7.field.props.label="是否与需求符合";
        ixqfh7.field.fieldProps.onChange = e => {
            //1是 2 否
            let val = e.target.value
            let eobj = {target:{value:''}}
            switch(val*1){
                case 1:
                    //是否需求符合‘是’时候，走涉及系统是否为空判断获取分支flag
                    if (handlersNew.length) {
                        const flag = this.getFlagBySysInfo(val)
                        this.props.form.setFieldsValue({scondition: flag})
                        eobj.target.value = flag
                        this.handleCondition(eobj)
                    } else {
                        this.props.form.setFieldsValue({scondition:'SYSZF'})
                        eobj.target.value='SYSZF'
                        this.handleCondition(eobj)
                    }
                    break
                case 2:
                    this.props.form.setFieldsValue({scondition:'SYSZG'})
                    eobj.target.value='SYSZG'
                    this.handleCondition(eobj)
                    break
            }
        }
    }

    onGetFormDataSuccess(data) {
        let _this = this
        let ixqfh7 = findFiledByName(data.form,'ixqfh7')
        let scondition = findFiledByName(data.form,'scondition')
        
        if (ixqfh7.field.widget.default_value == '1') {
            //实际可能会被sxsqSysEditChildPage.controlAddButton影响
            data.scondition = 'SYSZF'
            scondition.field.widget.default_value='SYSZF'
        } else {
            data.scondition = 'SYSZG'
            scondition.field.widget.default_value='SYSZG'
        }
        //先将SYSZH、SYSZF其中一个设置隐藏，再根据子页面数据变化
        // scondition.field.widget.load_template.map(item => {
        //     item.value === 'SYSZH' && (item.hidden = true)
        // })
        //如果回退覆盖上面的定制
        let sjumpflag01 = findFiledByName(data.form, 'sjumpflag01')
        const jumpflag = sjumpflag01 && sjumpflag01.field.widget.default_value
        if(jumpflag) {
            data.scondition = jumpflag
            scondition.field.widget.load_template.map(item => {
                if (item.value != jumpflag && item.value != 'SYSZG') {
                    item.hidden = true
                }
            })
            scondition.field.widget.default_value = jumpflag
        }
        
        let promise = new Promise(resolve => {
            vpQuery('/{bjyh}/xmqx/queryDesignatedRoleByProjectId', {
                tableName: "BOBJ_PRODUCTION_APPLY_EXT",
                projectid: _this.props.iobjectid
            }).then((response) => {
                if (response.data.length > 0) {
                    let res = response.data
                    let xmjl_kffzr = ''
                    let ids = ''
                    for (let i = 0; i < res.length; i++) {
                        if (res[i].rolename == "开发负责人") {
                            ids += res[i].iuserid + ','
                            xmjl_kffzr += res[i].username + ','
                        }
                    }
                    ids = ids.substring(0, ids.length - 1)
                    xmjl_kffzr = xmjl_kffzr.substring(0, xmjl_kffzr.length - 1)
                    // 自动获取该项目的项目经理和开发负责人
                    for (var i = 0; i < data.handlers.length; i++) {
                        if (data.handlers[i].flag == "SYSZH") {
                            data.handlers[i].ids = ids
                            data.handlers[i].names = xmjl_kffzr
                        }
                    }
                    resolve(data)
                } else {
                    resolve(data)
                }
            })
        })
        return promise
    }

    //根据系统子页面获取分支条件
    getFlagBySysInfo = (val) => {
        const childRef = this.subFormList.map(item => {return item })
        if (childRef.length) {
            const tableRowData = childRef[0].object.state.tableRowData
            console.log('tableRowData', tableRowData);
            val = tableRowData.length === 0 ? 'SYSZH' : 'SYSZF' 
        }
        return val
    }
}

kffzrshFlowForm02 = FlowForm.createClass(kffzrshFlowForm02);
export default kffzrshFlowForm02;