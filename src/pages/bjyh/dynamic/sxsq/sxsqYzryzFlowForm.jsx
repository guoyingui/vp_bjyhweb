import React, { Component } from "react";

import FlowForm from "../../../templates/dynamic/Flow/FlowForm";

import { findWidgetByName } from "../../../templates/dynamic/Form/Widgets";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import { vpQuery, VpAlertMsg } from "vpreact";
import { xmsxsq, fileValidation } from '../code';
import moment from "moment";


//项目上线申请流程 验证人验证 审批节点
class sxsqYzryzFlowForm extends FlowForm.Component {
    constructor(props) {
        super(props);
        console.log("sxsqYzryzFlowForm");
        console.log("date", this);
    }
    onGetFormDataSuccess = data => {
        let _this = this

        console.log("handlers", data.handlers)
        // 业务验证人验证：默认流程发起人员，即<提交上线申请>环节发起人  SYSA
        let promise = new Promise(resolve => {
            vpQuery('/{bjyh}/ZKXmsxFrom/queryPiidByUsers', {
                ppid: _this.props.piid, stepKey: 'SYSA',tableName:'WFENT_SXSQLC'
            }).then((response) => {
                let fzr = ''
                let ids = ''
                if (response.data.length > 0) {
                    let res = response.data
                    for (let i = 0; i < res.length; i++) {
                        ids += res[i].iid + ','
                        fzr += res[i].sname + ','
                    }
                    ids = ids.substring(0, ids.length - 1)
                    fzr = fzr.substring(0, fzr.length - 1)
                    console.log("ids", ids)
                    console.log("fzr", fzr)
                    // 业务验证人验证：默认流程发起人员，即<提交上线申请>环节发起人 
                    for (var i = 0; i < data.handlers.length; i++) {
                        console.log(data.handlers.length)

                        data.handlers[0].ids = ids
                        data.handlers[0].names = fzr

                    }
                    resolve(data)
                } else {
                    resolve(data)
                }
            })
        })
        return promise
    }
     //自定义控件行为
  onDataLoadSuccess = formData => {
    let _this=this;
    //是否通过1
    let iywyzsftg11=formData.findWidgetByName('iywyzsftg');
    iywyzsftg11.field.props.label="是否通过";
    //是否返回业务1
    let isffhyw11=formData.findWidgetByName('isffhyw1');
    isffhyw11.field.props.label="是否返回业务";
    //是否与需求符合6
    let ixqfh66=formData.findWidgetByName('ixqfh6');
    ixqfh66.field.props.label="是否与需求符合";
    //是否与需求符合7
    let ixqfh77=formData.findWidgetByName('ixqfh7');
    ixqfh77.field.props.label="是否与需求符合";

  }
}

sxsqYzryzFlowForm = FlowForm.createClass(sxsqYzryzFlowForm);
export default sxsqYzryzFlowForm;