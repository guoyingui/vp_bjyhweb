import React, {
    Component
} from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';

import { validationRequireField, singleInputFill } from '../code';
import {vpQuery} from "vpreact";

class fqFlowForm03 extends FlowForm.Component {
    constructor(props) {
        super(props);
    }
    //自定义控件行为
    onDataLoadSuccess = formData => {
        let _this = this;
        console.log("fqFlowForm03")
        const isHistory = _this.props.isHistory//是否历史数据
        console.log("isHistory1",isHistory)
    } 

    change = () => {
        console.log("change")
        
    }

}
fqFlowForm03 = FlowForm.createClass(fqFlowForm03);
export default fqFlowForm03;