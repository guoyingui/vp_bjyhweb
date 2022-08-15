import React, { Component } from "react";

import FlowForm from "../../../templates/dynamic/Flow/FlowForm";

import {findWidgetByName} from "../../../templates/dynamic/Form/Widgets";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import {vpQuery,VpAlertMsg} from "vpreact";
import {  xmsxsq, fileValidation, validationRequireField,singleInputFill } from '../code';
import moment from "moment";


//项目上线申请流程 执行人执行 审批节点
class  sxsqZxrzxFlowForm extends FlowForm.Component{
    constructor(props){
        super(props);
        console.log("sxsqZxrzxFlowForm") ;
        console.log("date",this) ; 
        this.state.moduserprops={
           ismoduser:true,//是否启用更改处理人
           ajaxurl:'',//数据源接口地址：不定义则使用默认地址
           moduserCondition:[{//更改处理人用户列表查询条件
                field_name:'idepartmentid',
                field_value:"1110,100012",//系统运营部
                expression:'in'
            }]//系统运营部
        }
    }
    // onGetFormDataSuccess = data => {
    //     let _this = this
        // let  promise = new Promise(resolve => {
        //     vpQuery('/{bjyh}/ZKXmsxFrom/queryNameByUsers',{ Sname:'运营代表/执行人/验证人'
        //     }).then((response) => {
        //         console.log("运营代表/执行人/验证人",response)

        //         let fzr = ''
        //         let ids = ''
        //         if (response.data.length > 0) {
        //             let res = response.data
        //             for (let i = 0; i < res.length; i++) {
        //                     ids += res[i].iid + ','
        //                     fzr += res[i].sname + ','
        //             }
        //             ids = ids.substring(0, ids.length - 1)
        //             fzr = fzr.substring(0, fzr.length - 1)
        //             console.log("ids",ids)
        //             console.log("fzr",fzr)
        //             // 自动获取业务部领导负责人
        //             for (var i = 0; i <   data.handlers.length; i++) {
        //                 console.log( data.handlers[i].flag)
        //                 if(data.handlers[i].flag=="SYSZD"){
        //                     data.handlers[i].ids = ids
        //                     data.handlers[i].names = fzr
        //                 }
        //             }  
        //             resolve(data)
        //         }else{
        //             resolve(data)
        //         }
        //     })
        // })
        // return promise
    // }
         //自定义控件行为
    onDataLoadSuccess = formData => {
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
        
        //执行时间
        var dzxsj = formData.findWidgetByName("dzxsj");
        var dsqsxsj = formData.findWidgetByName("dsqsxsj");
        dzxsj.field.fieldProps.onChange = function (v) {
            console.log("value1",v);
            console.log("dsqsxsj",dsqsxsj.field.fieldProps.initialValue);
            // let value = v.target.value;
            let t1 = moment().format('YYYYMMDD');
            let t2 = moment(v).format("YYYYMMDD")
            let t3 = moment(dsqsxsj.field.fieldProps.initialValue).format("YYYYMMDD")

            console.log("当前日期：",t1)
            console.log("选中日期：",t2)
            console.log("上线日期：",t3)
            console.log("比较：",moment(t2).isBefore(t1))
            // 执行时间：与申请上线日期不一致，则系统弹出“您输入的执行时间和申请上线时间不同”提醒框
            if(t2==t3){
                console.log("两个日期一致")
            }else{
                VpAlertMsg({
                    message:"消息提示",
                    description: "您输入的执行时间和申请上线时间不同！",
                    type:"warning",
                    onClose:this.onClose,
                    closeText:"关闭",
                    showIcon: true
                }, 5) ;
            }
        }
        //是否完成
        let isfwc=formData.findWidgetByName('isfwc');
        if(isfwc){
            isfwc.field.fieldProps.onChange = this.isfwcChange;
            this.isfwcChange(isfwc.field.fieldProps.initialValue);
        }

    }
    /**
     * 是否完成onchange
     */
    isfwcChange = (value) =>{
        const { setFieldsValue } = this.props.form;
        let scondition;
        if(value=="1"){
            scondition = "SYSZE"
        }else{
            scondition = "SYSZD"
        }
        setFieldsValue({"scondition":scondition})
        if(this.state.formData){
            this.handleCondition({target:{value:scondition}});
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

        let flag = e.target.value == 'SYSZE' ? true : false
        validationRequireField(_this, 'sdescription', flag)
    }
}

sxsqZxrzxFlowForm=FlowForm.createClass(sxsqZxrzxFlowForm);
export default sxsqZxrzxFlowForm;