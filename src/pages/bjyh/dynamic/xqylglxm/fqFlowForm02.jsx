import React, {
    Component
} from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';

import { validationRequireField, singleInputFill } from '../code';
import { vpQuery, vpAdd, VpConfirm } from "vpreact";

class fqFlowForm02 extends FlowForm.Component {
    constructor(props) {
        super(props);
    }
    //自定义控件行为
    onDataLoadSuccess = formData => {
        let _this = this;
        console.log("fqFlowForm02")
        const isHistory = _this.props.isHistory//是否历史数据
        console.log("isHistory1",isHistory)
        this.state.moduserprops = {
            ismoduser: true,//是否启用更改处理人
        }
    }

      //子页面接口调用父页面重置下一步处理人条件过滤
      change = () => {
        console.log("change")
        let _this=this;
        //都不通过返回1，都通过返回2，部分通过返回3
        let url = window.vp.config.jgjk.ylxz.cscheckyllist;
        let jsonPara = {
            flow_id: _this.props.piid
        }
        let eobj = {target:{value:''}}

        vpAdd(url, {
            jsonPara: JSON.stringify(jsonPara)
        }).then((response) => {
            console.log("response",response)
            let passStatus=response.passStatus;
            // let userNoPass=response.userNoPass;//当前流程下当前人所属部门的所有用例全部不通过返回 true 反之 false
            // let allNoPass=response.allNoPass;//当前流程下所有用例全部不通过返回 true 反之 false
            if(passStatus>0){
                if(passStatus==1){//都不通过返回1 直接不通过
                    _this.props.form.setFieldsValue({scondition:'3'})
                    eobj.target.value='3'
                    _this.handleCondition(eobj) 
    
                    _this.props.form.setFieldsValue({scondition:'3'})
                    eobj.target.value='3'
                    _this.handleCondition(eobj) 
                }else{
                    _this.props.form.setFieldsValue({ scondition: '1' })
                    eobj.target.value = '1'
                    _this.handleCondition(eobj)

                    _this.props.form.setFieldsValue({ scondition: '1' })
                    eobj.target.value = '1'
                    _this.handleCondition(eobj)
                }
            }
           
        });
    }

    onBeforeSave(formData, btnName) {
        let _this = this
        console.log(" this.props.piid", this.props.piid)
        let jsonPara = {
            case_status: '3',
            flow_id: this.props.piid
        }
        let sparam = JSON.parse(formData.sparam);
        let scondition = sparam.scondition;
        console.log(" scondition", scondition)
        return new Promise(resolve => {
            let flag=true;
            if (scondition == "3") {
                VpConfirm({
                    title: '您当前选择的分支为不通过，当前流程下所有用例全部会修改成"未通过"状态并结束流程,是否继续？',
                    onOk() {
                        vpAdd(window.vp.config.jgjk.ylxz.switchFlag, {
                            jsonPara: JSON.stringify(jsonPara)
                        }).then((response) => {
                            console.log("用例全部不通过成功！")
                            flag=true
                            resolve(flag)
                        })
                    },
                    onCancel() { 
                        flag=false
                        resolve(flag)
                    }
                })
            }else{
                resolve(flag)
            }

        })
    }
    onGetFormDataSuccess = data => {
        let _this = this
        return new  Promise(resolve => {
        vpQuery('/{bjyh}/xqyl/model/queryUserLead',{
            Sname: '业务部领导', idepartmentid: vp.cookie.getTkInfo('idepartmentid'),
            piid:_this.props.piid
        }).then((response) => {
            console.log("业务线领导/总监", response)
            let rywbldfzr = ''
            let ids = ''
                if(response.data.flag){
                    ids=response.data.ids
                    rywbldfzr=response.data.names
                }
            data.handlers.map(item => {
                console.log("item:",item)
                if(item.flag=="1"||item.flag=="2"){
                    item.ids=ids
                    item.names=rywbldfzr
                }
            })
            resolve(data)
        })
        })

    }

}
fqFlowForm02 = FlowForm.createClass(fqFlowForm02);
export default fqFlowForm02;