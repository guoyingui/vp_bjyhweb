import React, { Component } from "react"
import FlowForm from "../../../templates/dynamic/Flow/FlowForm";
import {vpAdd} from "vpreact";
import {nextStepHandler} from "../fhzjxmsq/fhzjxmsq";
import {fhzjxmsq} from "../code";

//ODS数据下发流程--流程--提交申请
class odssjxflcFlowApplyForm extends FlowForm.Component {

    constructor(props) {
        super(props)
    }

    /**
     * 保存前拦截
     * @param saveData 要保存的数据
     * @return Promise<any> 如果返回false,则不执行保存，不返回或返回其他值都执行保存
     *
     */
    onGetFormDataSuccess = (data) => {
        return nextStepHandler(data, fhzjxmsq.lcyhz_fhkjld)
    }
}

odssjxflcFlowApplyForm = FlowForm.createClass(odssjxflcFlowApplyForm)
export default odssjxflcFlowApplyForm
