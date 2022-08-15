import React, {
    Component
} from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';

import {findWidgetByName} from "../../../templates/dynamic/Form/Widgets";
import { validationRequireField, singleInputFill,validationRequireFieldBitian  } from '../code';
import {vpQuery,vpAdd} from "vpreact";

class fqFlowForm05 extends FlowForm.Component {
    constructor(props) {
        super(props);
    }
    //自定义控件行为
    onDataLoadSuccess = (formData, handlers) => {
        let _this = this;
        console.log("fqFlowForm05",_this)
        console.log('handlers', handlers);
        const isHistory = _this.props.isHistory//是否历史数据
        console.log("isHistory1",isHistory)

        let scondition = formData.findWidgetByName('scondition');
        console.log("scondition",scondition)
        scondition.field.props.disabled = true;
        var rysldr = formData.findWidgetByName('rysldr')
        if(rysldr){
            _this.props.form.setFieldsValue({rysldr:'',rysldr_label:''})
        }
        // rysldr.field.props.modalProps.ajaxurl = '/{bjyh}/ZKXmsxFrom/queryNameByUsers';
        // rysldr.field.props.modalProps.condition = ['业务线领导', vp.cookie.getTkInfo('idepartmentid')];
        rysldr.field.props.modalProps.condition = [{
            field_name: 'idepartmentid',
            field_value: "select iid from ORG_DEPARTMENT where iid in (" +vp.cookie.getTkInfo('idepartmentid')+") or IDEPARTMENTID in (" + vp.cookie.getTkInfo('idepartmentid')+")",
            expression: 'in'
        }
        ]
    }
    //子页面接口调用父页面重置下一步处理人条件过滤
    change = () => {
        let _this=this
        console.log("change",_this)
        console.log(vp.cookie.getTkInfo())

        let url = window.vp.config.jgjk.ylxz.xghqcheckyllist;
        let jsonPara = {
            flow_id: _this.props.piid,
            task_step_id:_this.props.staskid,
            user_code:vp.cookie.getTkInfo('username')
        }


        let eobj = {target:{value:''}}

        vpAdd(url, {
            jsonPara: JSON.stringify(jsonPara)
        }).then((response) => {
            console.log("response",response)
            let userNoPass=response.userNoPass;//当前流程下当前人所属部门的所有用例全部不通过返回 true 反之 false
            let allNoPass=response.allNoPass;//当前流程下所有用例全部不通过返回 true 反之 false
           
            //预设会签领导
            let rysldr =  _this.props.form.getFieldsValue(['rysldr']);
            console.log("rysldr",rysldr)
            //屏蔽会签领导节点
            let ysldr=_this.state.formData.findWidgetByName('rysldr');
            console.log("ysldr",ysldr)

            if(userNoPass){//userNoPass==true的时候 不需要强制填写预设会签领导
                let isHistory= _this.props.isHistory;
                // console.log("isHistory", isHistory)
                //历史流程不需要消除
                if(!isHistory){
                    if(rysldr){
                        _this.props.form.setFieldsValue({rysldr:'',rysldr_label:''})
                    }
                }
                validationRequireField(_this,'rysldr',false );
                ysldr.field.hidden=true;
            }else{
                validationRequireField(_this,'rysldr',true,"请填写会签领导" );
                ysldr.field.hidden=false;
            }


            if(allNoPass){//allNoPass==true的时候 当前流程直接结束！
                _this.props.form.setFieldsValue({scondition:'0'})
                eobj.target.value='0'
                _this.handleCondition(eobj) 

                _this.props.form.setFieldsValue({scondition:'0'})
                eobj.target.value='0'
                _this.handleCondition(eobj) 
            }else{
                _this.props.form.setFieldsValue({scondition:'1'})
                eobj.target.value='1'
                _this.handleCondition(eobj) 
                
                _this.props.form.setFieldsValue({scondition:'1'})
                eobj.target.value='1'
                _this.handleCondition(eobj) 
            }
        })


             
    }
    onGetFormDataSuccess = data => {
        let _this = this
        console.log("data:",data)
        var ryscssp = findWidgetByName.call(data.form,'ryscssp')

        let rywbldfzr = ''
        let ids = ''
        if(ryscssp){
            rywbldfzr = ryscssp.field.widget.default_label
            ids = ryscssp.field.widget.default_value
            data.handlers.map(item => {
                console.log("item:",item)
                if(item.stepcode=="02"){
                    item.ids=ids
                    item.names=rywbldfzr
                    item.disabled = true
                }
            })
        } 
        


    }

    /**
    * 监听单选框
     * @param e
     */
     handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let scondition = e.target.value
        console.log("scondition",scondition)
        console.log("_this",_this)
    }

   //保存前
    onBeforeSave(formData, btnName) {
        console.log("")
        let flag = true;
        let _this = this;
        let rysldr = _this.props.form.getFieldsValue(['rysldr']);
        let scondition = _this.props.form.getFieldsValue(['scondition']);
        console.log("_this",_this)
        console.log("rysldr",rysldr)
        console.log("scondition",scondition.scondition)//0不通过 1通过 
        console.log(rysldr.rysldr!="")
        console.log(rysldr.rysldr=="")
        return new Promise(resolve => {
            if(scondition.scondition=="1"){
                if(rysldr.rysldr!=""){
                    //通过的情况下 保存当前会签领导
                    vpAdd("/{bjyh}/xqyl/model/xgrysp", {
                        piid:_this.props.piid,
                        staskid:_this.props.staskid,
                        userid:vp.cookie.getTkInfo("userid"),
                        rysldr:rysldr.rysldr
                    }).then((response) => {
                        console.log("response", response)
                        resolve(response.data.flag)
                    })
                }else{
                    resolve(true)
                }
               
            }else{
                resolve(true)
            }
        })
        
    }
}
fqFlowForm05 = FlowForm.createClass(fqFlowForm05);
export default fqFlowForm05;