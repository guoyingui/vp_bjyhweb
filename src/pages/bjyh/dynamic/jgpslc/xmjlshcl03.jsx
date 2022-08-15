/*
 * @author: SL.
 */
/*
 * @author: SL.
 */
import React, {
    Component
} from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';

import { validationRequireField, singleInputFill } from '../code';

//项目经理审核材料
class xmjlshcl03 extends FlowForm.Component {
    constructor(props) {
        super(props);
    }

    // 加载成功后执行
    onDataLoadSuccess = (formData, _handlers) => {

    }

    handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let flag = e.target.value == 'SYSK' ? true : false
        validationRequireField(_this, 'sxmjlshclyj', flag)
    }

    onBeforeSave(formData, btnName) {
        //if (btnName == 'ok') { 
            singleInputFill(formData, btnName, 'sxmjlshclyj', true)    
        //}
    }

}
xmjlshcl03 = FlowForm.createClass(xmjlshcl03);
export default xmjlshcl03;