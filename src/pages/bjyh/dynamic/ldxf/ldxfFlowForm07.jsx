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
class CoustomFlowForm07 extends FlowForm.Component {
    constructor(props) {
        super(props);
    }
    handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let flag = e.target.value == 'REFUSE' ? true : false;
        // 拒绝时将sjgsshyj设置为必填
        validationRequireField(_this, 'sdescription', flag)
    }
    onGetFormDataSuccess(data) {
        if(data.handlers){
            data.handlers.map(item=>{
                //设置弹出窗为单选实体
                item.widget_type = 'selectmodel';
            })
        }
    }
}
CoustomFlowForm07 = FlowForm.createClass(CoustomFlowForm07);
export default CoustomFlowForm07;