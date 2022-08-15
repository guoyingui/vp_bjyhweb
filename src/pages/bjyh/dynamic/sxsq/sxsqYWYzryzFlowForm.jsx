import React, { Component } from "react";

import FlowForm from "../../../templates/dynamic/Flow/FlowForm";

import { findWidgetByName } from "../../../templates/dynamic/Form/Widgets";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import { vpQuery, VpAlertMsg } from "vpreact";
import { xmsxsq, fileValidation } from '../code';
import moment from "moment";


//项目上线申请流程 验证人验证 审批节点
class sxsqYWYzryzFlowForm extends FlowForm.Component {
    constructor(props) {
        super(props);
        console.log("sxsqYWYzryzFlowForm");
        console.log("date", this);
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

sxsqYWYzryzFlowForm = FlowForm.createClass(sxsqYWYzryzFlowForm);
export default sxsqYWYzryzFlowForm;