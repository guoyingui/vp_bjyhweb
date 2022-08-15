import React, {
    Component
} from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';

import {
    vpQuery,
    vpAdd,
    VpAlertMsg
} from 'vpreact';
import { validationRequireField, singleInputFill } from '../code';

//外部信息负责人初审
class wbxxfzrcs04 extends FlowForm.Component {
    constructor(props) {
        super(props);
    }

    // 加载成功后执行
    onDataLoadSuccess = (formData, _handlers) => {
        let _this = this;

    }

    handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let flag = 'SYSE,SYSD'.includes(e.target.value) ? true : false
        validationRequireField(_this, 'swbxxfzrcs', flag)
    }

    onBeforeSave(formData, btnName) {
        singleInputFill(formData, btnName, 'swbxxfzrcs', true)
    }

}

wbxxfzrcs04 = FlowForm.createClass(wbxxfzrcs04);
export default wbxxfzrcs04;