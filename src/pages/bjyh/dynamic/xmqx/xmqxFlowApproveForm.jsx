import React, {Component} from "react"
import {
    vpQuery,
} from 'vpreact'

import { common, validationRequireField, singleInputFill } from '../code';
import FlowForm from "../../../templates/dynamic/Flow/FlowForm";

//项目取消--流程--审批
class xmqxFlowApproveForm extends FlowForm.Component {

    constructor(props) {
        super(props)
    }

    /**
     * 表单数据加载成功后
     * @param formData
     */
    onDataLoadSuccess = formData => {
        let _this = this
        // 1.节点收缩 意见订制
        let spyjValue = ''
        return new Promise(resolve => {
            this.getThisRole((res) => {
                if (res != null) {
                    // 开发负责人与项目经理是不是同一人 需要
                    if (res.length > 0 && res.length != 2) {
                        //收缩节点 意见订制
                        spyjValue = formData.findWidgetByName(res[0].rolename == "项目经理" ? 'skffzryj' : 'sxmjlyj')
                        spyjValue.field.props.disabled = true
                        formData.groups[spyjValue.groupIndex].group_type = 2
                    }
                }
                resolve(formData)
            })
        })
    }

    /**
     * 获取当前登录人在该项目中的角色
     * @param callback
     */
    getThisRole(callback) {
        let _this = this
        let userid = common.userid
        vpQuery('/{bjyh}/xmqx/queryDesignatedRoleByProjectId',{tableName:"BOBJ_PROJECT_CANCEL_EXT", projectid: _this.props.iobjectid
        }).then((response) => {
            if (response.data.length > 0) {
                callback(response.data.filter(v => v.iuserid == userid))
            }
            callback(null)
        })
    }

    /**
     * 监听单选框
     * @param e
     */
    handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let flag = e.target.value == 'SYSB' ? true : false
        this.getThisRole((res) => {
            if (res != null) {
                // 开发负责人与项目经理是同一人
                if (res.length == 2) {
                    validationRequireField(_this, 'sxmjlyj', flag)
                    validationRequireField(_this, 'skffzryj', flag)
                } else {
                    validationRequireField(_this, res[0].rolename == "项目经理" ? 'sxmjlyj' : 'skffzryj', flag)
                    
                }
            }
        })
    }

    /**
     * 表单提交前
     * @param formData
     * @returns {Promise<any>}
     */
    onBeforeSave = (formData, btnName) => {
        let _this = this
        console.log('_this', _this)
        if (btnName == 'ok') {
            return new Promise(resolve => {
                this.getThisRole((res) => {
                    if (res != null) {
                        // 开发负责人与项目经理是同一人
                        if (res.length == 2) {
                            singleInputFill(formData, btnName, 'skffzryj', true)
                            singleInputFill(formData, btnName, 'sxmjlyj', false)
                            resolve(formData)
                        } else {
                            singleInputFill(formData, btnName, res[0].rolename == "项目经理" ? 'sxmjlyj' : 'skffzryj', true)
                            resolve(formData)
                        }
                        resolve(formData)
                    } else {
                        resolve(formData)
                    }
                })
            })
        }
    }

}

xmqxFlowApproveForm = FlowForm.createClass(xmqxFlowApproveForm)
export default xmqxFlowApproveForm
