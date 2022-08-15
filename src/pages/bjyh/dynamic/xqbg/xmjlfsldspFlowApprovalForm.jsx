import React, { Component } from "react"
import {
    vpQuery,
    VpAlertMsg, VpMWarning
} from 'vpreact'

import FlowForm from "../../../templates/dynamic/Flow/FlowForm";
import {common, xqbg, singleInputFill, validationRequireField} from '../code';
import {findWidgetByName} from "../../../templates/dynamic/Form/Widgets";

//需求变更--流程--项目经理发送领导审批
class xmjlfsldspFlowApprovalForm extends FlowForm.Component {

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

        let handlers = data.handlers
        for (let i = 0; i < data.handlers.length; i++) {
             if (handlers[i].hasOwnProperty('flag') && handlers[i].flag == 'SYSG') {
                
                let szjbmspField = findWidgetByName.call(data.form,'fljbggzl')
                console.log('fljbggzl', szjbmspField.field.widget.default_value)
                //累计变更工作了<20% 带出科技领导 
                //累计变更工作了>20% 也带出科技领导  索性大小20 全带科技领导
               /* if(szjbmspField.field.widget.default_value < 20){
                    return new Promise(resolve => {
                        vpQuery('/{bjyh}/xqbg/getKjbld',{ tableName: 'BOBJ_REQ_CHANGE_EXT', entityId: _this.props.iobjectid
                        }).then((response) => {
                            if (response.data != null) {
                                let res = response.data
                                let hqld_label = ''
                                let hqld = ''
                                // 自动获取该项目的相关负责人
                                for (let j = 0; j < res.length; j++) {
                                    hqld += res[j].iuserid + ','
                                    hqld_label += res[j].sname + ','
                                }
                                hqld = hqld.substring(0, hqld.length - 1)
                                hqld_label = hqld_label.substring(0, hqld_label.length - 1)
                                data.handlers[i].ids = hqld
                                data.handlers[i].names = hqld_label
                            }
                            resolve(data)
                        })
                    })
                }else{*/
                    return new Promise(resolve => {
                        vpQuery('/{bjyh}/xqbg/queryLduserid',{ tableName: 'BOBJ_REQ_CHANGE_EXT', entityId: _this.props.iobjectid
                        }).then((response) => {
                            if (response.data != null) {
                                data.handlers.map(item => {
                                    console.log("item:", item)
                                    if(item.flag=='SYSG') {
                                        if (item.ids != '' && item.ids != null && item.ids != undefined) {
                                            if(item.ids.indexOf(response.data.ids)==-1){
                                                item.ids = item.ids + "," + response.data.ids
                                                item.names = item.names + "," + response.data.names
                                            }
                                        } else {
                                            item.ids = response.data.ids
                                            item.names = response.data.names
                                        }
                                        _this.props.form.setFieldsValue({
                                            [item.stepkey]:item.ids ,
                                            [item.stepkey + '_label']:item.names
                                        })
                                    }
                                    resolve(data)
                                })
                            }
                            resolve(data)
                        })
                    })
                /*}*/
            }
        }





    }

    /**
     * 监听单选框
     * @param e
     */
    handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let flag = e.target.value == 'SYSH' ? true : false
        validationRequireField(_this, 'sxmjlyj', flag)
    }
    /**
     * 保存前事件
     * @param formData
     * @param btnName
     */
    onBeforeSave = (formData, btnName) => {
        let _this = this
        // 处理项目经理意见
        singleInputFill(formData, btnName, 'sxmjlyj', true)
        let sparam = JSON.parse(formData.sparam)    // 流程表单数据
        if(sparam.hasOwnProperty('scondition') && sparam['scondition'] == 'SYSG' && btnName == 'ok') {
            let ysclrArr = []   // 预设处理人
            let groups = _this.state.formData.groups
            // 获取预设处理人
            for (let i = groups.length - 1; i >= 0; i--) {
                if (groups[i].hasOwnProperty('group_code') && groups[i].group_code == 'flow_handler') {
                    ysclrArr = sparam[groups[i].fields[0].field_name].split(',')
                    break
                }
            }
            let ids='';
            for (let index = 0; index < ysclrArr.length; index++) {
                if(ids.indexOf(ysclrArr[index])==-1) {
                    ids += ysclrArr[index]+",";
                }
            }
            if(ids!=null&&ids!=''){
                ids = ids.substring(0, ids.length - 1)
            }
                // 判断变更申请部门 是否属于软件开发部 或 信息科技部
          //  let rbgsqbm = _this.props.form.getFieldValue("rbgsqbm")
            //累计变更工作量 小于20 不弹出警告
            let fljbggzl = _this.props.form.getFieldValue("fljbggzl")
            if(fljbggzl<20){
                return true
            }else{
                return  new Promise(resolve => {
                    vpQuery('/{bjyh}/xqbg/queryMsg',{ entityId: _this.props.iobjectid,idsArr:ids
                    }).then((response) => {
                        if (response.data != null) {
                           // rbgsqbm = response.data.smsg
                           // if (rbgsqbm && rbgsqbm.indexOf(xqbg.rjkfbbh) == -1 && rbgsqbm.indexOf(xqbg.xxkjglbbh) == -1 && ysclrArr.length < 3) {
                             if(response.data.sMsg){
                                VpMWarning({
                                    title: '这是一条警告通知',
                                    content: response.data.sMsg
                                })
                                resolve(false)
                            } else {
                                resolve(true)
                            }
                        }
                        resolve(false)
                    })
                })
            }
        } else {
            return true
        }
    }
}

xmjlfsldspFlowApprovalForm = FlowForm.createClass(xmjlfsldspFlowApprovalForm)
export default xmjlfsldspFlowApprovalForm
