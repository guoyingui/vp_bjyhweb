import React, { Component } from "react";

import FlowForm from "../../../templates/dynamic/Flow/FlowForm";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import {vpQuery,VpAlertMsg} from "vpreact";
import {  xmsxsq, fileValidation, validationRequireField,singleInputFill } from '../code';
import moment from "moment";


//项目上线申请流程 运营代表审批节点
class  sxsqYydbspFlowForm extends FlowForm.Component{
    constructor(props){
        super(props);
        console.log("sxsqYydbspFlowForm") ;
        console.log("date",this) ;
        this.state.moduserprops={
            ismoduser:true,//是否启用更改处理人
            ajaxurl:'',//数据源接口地址：不定义则使用默认地址
            moduserCondition:[{//更改处理人用户列表查询条件
                field_name:'idepartmentid',
                field_value:"1110,100012",//系统运营部
                expression:'in'
            }]
        }
    }
    onGetFormDataSuccess(data){
        let _this = this
        console.log("data", data)
        console.log("data", data.handlers.length)
        console.log("iobjectid", _this.props.iobjectid)
        console.log("projectid", _this.props.iobjectid)

        let  promise = new Promise(resolve => {
            vpQuery('/{bjyh}/xmqx/queryDesignatedRoleByProjectId',{tableName:"BOBJ_PRODUCTION_APPLY_EXT", projectid: _this.props.iobjectid
            }).then((response) => {
                if (response.data.length > 0) {
                    let res = response.data
                    let xmjl_kffzr = ''
                    let ids = ''
                    for (let i = 0; i < res.length; i++) {
                        console.log("res[i].rolename",res[i].rolename)
                        if(res[i].rolename=="项目经理"){
                            ids += res[i].iuserid + ','
                            xmjl_kffzr += res[i].username + ','
                        }
                    }
                    ids = ids.substring(0, ids.length - 1)
                    xmjl_kffzr = xmjl_kffzr.substring(0, xmjl_kffzr.length - 1)
                    // 自动获取该项目的项目经理和开发负责人
                    for (var i = 0; i <   data.handlers.length; i++) {
                        console.log( data.handlers[i].flag)
                        if(data.handlers[i].flag=="SYSK"){
                            data.handlers[i].ids = ids
                            data.handlers[i].names = xmjl_kffzr
                        }
                    }

                    resolve(data)
                }else{
                    resolve(data)
                }
            })
        })
        return promise
    }

    /**
     * 表单数据加载成功后
     * @param formData
     */
    onBeforeSave(formData, btnName) {
        let _this = this  
        //流程步骤通用定制
        if (btnName == 'ok') {
            singleInputFill(formData, btnName, 'syydbspyj', true)
        }
    }
    /**
     * 表单数据加载成功后
     * @param formDat
     */
    onDataLoadSuccess = (formData,handlers) => {

        let _this=this
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
        
            //默认屏蔽两个节点
            let scondition = formData.findWidgetByName('scondition')
            if(scondition){
                scondition.field.props.options_.map(item=>{
                            item.value=='SYSL'?item.hidden=true:null
                            // item.value=='SYSM'?item.hidden=true:null
                })
            }
           

        //获取字段
       

        //ifhkffzr开发负责人 ifhywdb 返回业务代表
        let ifhywdb = formData.findWidgetByName('ifhywdb')
        let ifhkffzr = formData.findWidgetByName('ifhkffzr')
        //ifhkffzr开发负责人 ifhywdb 返回业务代表 默认为0
        _this.props.form.setFieldsValue({
            ifhywdb:"0",
            ifhkffzr:"0"
        })


        
        //判断运维部组长
        var rywbzz = formData.findWidgetByName("rywbzz");
        console.log("rywbzz", rywbzz)
        
       
        
        rywbzz.field.props.modalProps.ajaxurl='/{bjyh}/ZKXmsxFrom/queryNameByUsers';
        rywbzz.field.props.modalProps.condition=['运维部领导',vp.cookie.getTkInfo('idepartmentid')];
        //是否为测试环境上线 1是 2否
        //“是否为测试环境上线”为是，【运营代表审批】审批节点中预设处理人不显示运维部组长
        let iwcshjsx = formData.findWidgetByName('iwcshjsx')
        let cshjsx=iwcshjsx.field.fieldProps.initialValue;
        console.log("是否为测试环境上线",cshjsx);
        if(cshjsx==1){
            _this.props.form.setFieldsValue({
                'rywbzz':'0',//id
                'rywbzz_label':'null'//显示的汉字
            })
            rywbzz.field.hidden=true;
        }else{
            _this.props.form.setFieldsValue({
                'rywbzz':'',//id
                'rywbzz_label':''//显示的汉字
            })
        }
        //监听业务代表业务代表
        ifhywdb.field.fieldProps.onChange = function (v) {
            // console.log("TEST 监听！"+isfbfsx);
            // console.log("isfbfsx",isfbfsx);
            // console.log("isfbfsx",isfbfsx.checked);
            //isfzzsx.field.checked=true;
            let value = v.target.value;
            console.log("ifhywdb",ifhywdb);
            console.log("value",value);
            let eobj = {target:{value:''}}
            //1 是 0否
            //【返回业务代表=是，则步骤结果为“拒绝”，【返回开发负责人】只读，且值为否，并设置【业务直返运营项目】=1
            if(value==1){
                //屏蔽其他 节点分支未作
                // isffhyw.field.props.disabled = true;
                //返回业务代表 拒绝意见必填 
                validationRequireField(_this,'syydbspyj',true )
                ifhkffzr.field.props.disabled = true;
            //业务直返运营项目=1
                _this.props.form.setFieldsValue({
                    sywzfyyxm:"1"
                })
                //返回开发负责人只读
                scondition.field.props.options_.map(item=>{
                    if(item.value=='SYSL'){
                        item.hidden=true
                    }else if(item.value=='SYSM'){
                        item.hidden=false
                    }
                })
                _this.props.form.setFieldsValue({scondition:'SYSM'})
                eobj.target.value='SYSM'
                _this.handleCondition(eobj)
                _this.props.form.setFieldsValue({
                    'rywbzz':'0',//id
                    'rywbzz_label':'null'//显示的汉字
                })
                rywbzz.field.hidden=true;
            }else{
                //返回业务代表 拒绝意见必填 
                validationRequireField(_this,'syydbspyj',false )
                ifhkffzr.field.props.disabled = false;
                scondition.field.props.options_.map(item=>{
                    if(item.value=='SYSM'){
                        item.hidden=true
                    }else if(item.value=='SYSL'){
                        item.hidden=false
                    }
                })
                _this.props.form.setFieldsValue({scondition:'SYSK'})
                eobj.target.value='SYSK'
                _this.handleCondition(eobj)
                //是否为测试环境上线
                if(cshjsx!=1){
                    _this.props.form.setFieldsValue({
                        'rywbzz':'',//id
                        'rywbzz_label':''//显示的汉字
                    })
                    rywbzz.field.hidden=false;
                }
            }

        }
        //监听开发负责人
        ifhkffzr.field.fieldProps.onChange = function (v) {
            // console.log("TEST 监听！"+isfbfsx);
            // console.log("isfbfsx",isfbfsx);
            // console.log("isfbfsx",isfbfsx.checked);
            //isfzzsx.field.checked=true;
            let value = v.target.value;
            console.log("ifhkffzr",ifhkffzr);
            console.log("value",value);

            let eobj = {target:{value:''}}
            //1 是 0否
            //【返回开发负责人】=是，则步骤结果为“拒绝”，【返回业务代表】只读，且值为否
            if(value==1){
                //屏蔽其他 节点分支未作
                // isffhyw.field.props.disabled = true;
                
                //返回业务代表 拒绝意见必填
                validationRequireField(_this,'syydbspyj', true)
                //返回业务代表只读
                ifhywdb.field.props.disabled = true;
                scondition.field.props.options_.map(item=>{
                    if(item.value=='SYSM'){
                        item.hidden=true
                    }else if(item.value=='SYSL'){
                        item.hidden=false
                    }
                })
                _this.props.form.setFieldsValue({scondition:'SYSL'})
                eobj.target.value='SYSL'
                _this.handleCondition(eobj)
                _this.props.form.setFieldsValue({
                    'rywbzz':'0',//id
                    'rywbzz_label':'null'//显示的汉字
                })
                rywbzz.field.hidden=true;
            }else{
                //返回业务代表 拒绝意见必填 
                validationRequireField(_this,'syydbspyj',false )
                ifhywdb.field.props.disabled = false;
                scondition.field.props.options_.map(item=>{
                    if(item.value=='SYSL'){
                        item.hidden=true
                    }else if(item.value=='SYSM'){
                        item.hidden=false
                    }
                })
                _this.props.form.setFieldsValue({scondition:'SYSK'})
                eobj.target.value='SYSK'
                _this.handleCondition(eobj)
                //是否为测试环境上线
                if(cshjsx!=1){
                    _this.props.form.setFieldsValue({
                        'rywbzz':'',//id
                        'rywbzz_label':''//显示的汉字
                    })
                    rywbzz.field.hidden=false;
                }
            }

        }
    }
    // /**
    //  * 监听单选框
    //  * @param e
    //  */
    // handleCondition(e) {
    //     super.handleCondition(e)
    //     let _this = this
    //     let scondition = e.target.value
    //     console.log("scondition",scondition)
    //     console.log("_this",_this)
    //     if(scondition=="SYSM"){
    //         //隐藏运维部组长领导
    //     }
    // }


}

sxsqYydbspFlowForm=FlowForm.createClass(sxsqYydbspFlowForm);
export default sxsqYydbspFlowForm;