import React, { Component } from "react";

import FlowForm from "../../../templates/dynamic/Flow/FlowForm";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import {vpQuery,VpAlertMsg} from "vpreact";


//项目暂停
class  xmztFlowForm extends FlowForm.Component{
    constructor(props){
        super(props);
    }
    onGetFormDataSuccess(data){
        let _this = this
        console.log("iobjectid", _this.props.iobjectid)
        let  promise = new Promise(resolve => {
            vpQuery('/{bjyh}/xmqx/queryDesignatedRoleByProjectId',{tableName:"BOBJ_PROJECT_SUSPEND_EXT", projectid: _this.props.iobjectid
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
                }else{
                    resolve(data)
                }
            })
        })
        return promise
    }




}

xmztFlowForm=FlowForm.createClass(xmztFlowForm);
export default xmztFlowForm;