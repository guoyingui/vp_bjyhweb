/*
 * @author: SL.
 */
import React, {
    Component
} from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';

import {
    vpQuery,
    vpAdd,
    VpAlertMsg
} from 'vpreact';
import {findFiledByName} from 'utils/utils';
import { validationRequireField, singleInputFill } from '../code';

//架构管理办公室上传评审会议纪要
class jgglbgsJSxsys06 extends FlowForm.Component {
    constructor(props) {
        super(props);
    }

    onBeforeSave(formData, btnName) {
        singleInputFill(formData, btnName, 'sjgglbgspshyj', true)
    }

    handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let flag = e.target.value == 'SYSH' ? true : false
        validationRequireField(_this, 'sjgglbgspshyj', flag)
    }

}
jgglbgsJSxsys06 = FlowForm.createClass(jgglbgsJSxsys06);
export default jgglbgsJSxsys06;