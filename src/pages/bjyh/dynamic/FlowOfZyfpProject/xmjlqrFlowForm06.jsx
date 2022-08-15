import React, { Component } from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';

import {
    vpQuery, vpAdd, VpAlertMsg,VpMWarning
} from 'vpreact';

import {
    formDataToWidgetProps
} from '../../../templates/dynamic/Form/Widgets';
import {validationRequireField, singleInputFill,xmsqHiddenColumn } from '../code';
import {findFiledByName} from 'utils/utils';



/**
 * 项目经理申请资源
 */
class xmjlqrFlowForm06 extends FlowForm.Component {
    constructor(props) {
        super(props);
        this.state.moduserprops={
            ismoduser:true,//是否启用更改处理人
        }
    }
    componentWillMount() {
        super.componentWillMount()
    }

    componentDidMount(){
        super.componentDidMount()
        this.checkPJnameRepeat()
    }
    // 加载成功后执行
    onDataLoadSuccess = (formData,handlers) => {
        let _this = this
        console.log(_this,formData);

        /* 根据项目经理结论影响审批radio */
        let ixmjlqrjl = formData.findWidgetByName('ixmjlqrjl')
        let scondition = formData.findWidgetByName('scondition')
        

        //根据预算数量隐藏...
        xmsqHiddenColumn(formData)
    }


    //检验是否已有重复项目名称
    checkPJnameRepeat=()=>{
        let _this = this
        vpAdd('/{bjyh}/xmsq/checkPJnameRepeat',{
            piid:_this.props.piid,
            ientityid:_this.props.iobjectentityid,
            iobjectid:_this.props.iobjectid
        }).then(res=>{
            if(res.data&&res.data.isrepeat===true){
                //_this.props.form.getFieldValue({})
                VpMWarning({
                    title: '提示',
                    content: `需求名称'${res.data.xmsqname}' 与现有项目名称重复，请重新填写！`,
                    okText:'确定'
                })
            }
        })
    }

}
xmjlqrFlowForm06 = FlowForm.createClass(xmjlqrFlowForm06);
export default xmjlqrFlowForm06;