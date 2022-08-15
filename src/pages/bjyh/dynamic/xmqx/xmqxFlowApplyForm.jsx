import React, { Component } from "react"
import {
    vpQuery
} from 'vpreact'

import FlowForm from "../../../templates/dynamic/Flow/FlowForm";

//项目取消--流程--提交申请
class xmqxFlowApplyForm extends FlowForm.Component {

    constructor(props) {
        super(props)
    }

    /**
     * 表单加载之前动作
     * @param data
     */
    onGetFormDataSuccess(data){
        let _this = this

        return new Promise(resolve => {
            vpQuery('/{bjyh}/xmqx/queryDesignatedRoleByProjectId',{ tableName: 'bobj_project_cancel_ext', projectid: _this.props.iobjectid
            }).then((response) => {
                if (response.data.length > 0) {
                    let res = response.data
                    let xmjl_kffzr = ''
                    let ids = ''
                    for (let i = 0; i < res.length; i++) {
                        if (ids.indexOf(res[i].iuserid) == -1) {
                            ids += res[i].iuserid + ','
                            xmjl_kffzr += res[i].username + ','
                        }
                    }
                    ids = ids.substring(0, ids.length - 1)
                    xmjl_kffzr = xmjl_kffzr.substring(0, xmjl_kffzr.length - 1)
                    // 自动获取该项目的项目经理和开发负责人
                    data.handlers[0].ids = ids
                    data.handlers[0].names = xmjl_kffzr
                    resolve(data)
                } else {
                    resolve(data)
                }
            })
        })
    }
}

xmqxFlowApplyForm = FlowForm.createClass(xmqxFlowApplyForm)
export default xmqxFlowApplyForm
