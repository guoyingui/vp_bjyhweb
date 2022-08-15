import React, { Component } from "react";
import {
    vpAdd,
    VpIconFont,
    VpRow,
    VpCol,
    VpModal,
    VpTooltip,
    VpButton, VpIcon,
    VpPopconfirm,
    VpAlertMsg,
    VpSwitch,
    VpFormCreate,
    VpInputUploader,
    VpUploader,
    vpQuery,
    VpForm,
    VpFInput,
    VpSelect,
    VpOption,
    VpFRadio,
    VpRadioGroup, VpRadio, vpDownLoad, VpFSelect,
} from "vpreact";
import { VpDTable, VpDynamicForm, VpSelectObject } from 'vpbusiness';

import  RelReqCaseModal  from './relReqCaseModal';
import { VpFUploader } from './VpFUploader';
import XqylFormModel from "./xqylFormModel";
import VpChooseModal from "./VpChooseModal";
import './style.less'
class AccessList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading:false,//加载
            isinuser:false,//当前登陆人是否包含在会签节点
            flowiflag:2, //流程状态
            prj_scode: '',
            prj_sname: '',
            all_id:0,//当前登录人是否是数据字典领导
            jsonP: {},
            entity_id: '',
            split_user1: false,
            split_user: false,
            rfj_flag: false,
            entityVisible: false,
            entityyyl: false,
            data_array: [],
            selectItem: [],
            resultList: [],
            showRightBox: false,
            toInfoData: {},
            selectedRowKeys: [],
            errinfo: [],
            // page: 1,
            //task_id:this.props.data.task_id||"",
            //task_name:this.props.data.task_name||"",
            pagination: {},
            relReqCaseModalVisible: false,//关联用例框是否弹出
            reqCaseEditAttrVisible: false,//属性框是否弹出
            reqCaseReadOnlyAttrVisible: false,
            tableHeight: 300, //表格高度
            formData: {},//属性表单值
            parentForm: this.props.registerSubForm && this.props.registerSubForm(this.props.field_name, this, {
                asyncSave: true, //是否是同时保存主子表，如果为true,则子表单类必须实现getFormValues接口,如果为false,则实现onSave接口
                //onValidate:"onValidate", //如果默认的onValidate与类有冲突时，可以使用自定义名称替换onValidate函数
                //onSave:"onSave",  //如果默认的onSave与类有冲突时，可以使用自定义名称替换onSave函数
                getFormValues: "onFormSave", //如果默认的getFormValues与类有冲突时，可以使用自定义名称替换getFormValues函数
                //onMainFormSaveSuccess:"onMainFormSaveSuccess"  //同步保存时，主表单保存成功后
            }),
            columns:[],
            item: {
                field_label: "附件",
                field_name: "rfj",
                iconstraint: 1,
                ientityid: 10006,
                irelationentityid: 0,
                iwidth: 0,
                label: "附件",
                default_value: "",
                readonly: false,
                labelCol: { span: 3 },
                widget: {
                    // load_template:[{
                    //         createtime: 1649704173000,
                    //         creator: "刘嘉文",
                    //         entityid: "flow",
                    //         fileid: "6919303725265715224",
                    //         filename: "总经理办公会会议纪要.txt",
                    //         instanceid: 16325,
                    //         options: {update: true, preview: false, edit: false, delete: false, download: true},
                    //         size: 45,
                    //         status: "complete"
                    //     }],
                    default_value: ''
                }
            },
             itemdp : {
                widget_type: "selectmodel",
                field_name: "dept_name",
                field_label: "部门名称",
                select_type: "radio",
                all_line: 1,
                widget: {
                    treeUrl: "/{bjyh}/xqyl/model/getDptTree",
                    treeKey: "iid",
                    tableHeaderUrl: "/{vpplat}/vfrm/entity/getlistHeader?irelentityid=1&scode=modelList",
                    tableDataUrl: "/{bjyh}/xqyl/model/getDptList",
                    tableMethod: "GET",
                    tableKey: "iid",
                }
            }

        }
        this.checkUserLead();
        this.registerSubForm();//调用子表单
    }
    componentWillMount() {
        this.registerSubForm();//调用子表单
        //解决问题被遮住的问题
        $('.footFixed').css('z-index', 1)

        console.log("this.props.stepcode:",this.props.stepcode)
        console.log("this.parentForm.props.isHistory:",this.parentForm.props.isHistory)
        const  COLUMNS = [
            { title: '用例编号', width: 100, dataIndex: 'case_code', },
            { title: '用例名称', width: 100, dataIndex: 'case_name', },
            { title: '任务编号', dataIndex: 'task_code', width: 150 },
            { title: '任务名称', dataIndex: 'task_name', width: 150 },
            { title: '用例类型名称', dataIndex: 'case_type_name', width: 150 },
            { title: '涉及系统', dataIndex: 'rel_system', width: 150 },
            { title: '审批状态', dataIndex: 'case_status_name', width: 150 },
            /* { title: '创建人', dataIndex: 'user_name',  width: 150 },*/
            /*{ title: '创建时间', dataIndex: 'creat_time',  width: 150 },*/
            {
                title: '操作', dataIndex: 'do', key: 'do',
                render: (text, record) => {
                    return (
                        <div onClick={(e) => { e.stopPropagation() }} >
                            {/* <VpTooltip placement="topLeft" title="编辑用例" arrowPointAtCenter>
                                <VpIcon type="text-info m-lr-xs cursor vpicon-edit" onClick={this.toProblemInfo} />
                            </VpTooltip> */}
                            {this.parentForm.props.isHistory?"":this.props.stepcode=="01"?
                            <VpPopconfirm title="确定要删除这个用例吗？" onConfirm={(e) => { this.deleteConfirm(record) }} onCancel={this.cancel}>
                                <VpTooltip title="删除1">
                                    <VpIcon className="cursor m-lr-xs f16 text-danger" type="vpicon-shanchu" onClick={(e) => { e.stopPropagation() }} />
                                </VpTooltip>
                            </VpPopconfirm>
                            
                            :
                            this.state.flowiflag==0?
                            <VpTooltip title="是否通过">
                                <VpSwitch defaultChecked={record.case_status == 2 ? true : false} onChange={e => this.switchChange(e, record)}
                                    checkedChildren="是" unCheckedChildren="否" />
                            </VpTooltip>
                            :""
                            }
                            
                        </div>
                    )
                }
            }]; 
            const  COLUMNSONE = [
                { title: '用例编号', width: 100, dataIndex: 'case_code', },
                { title: '用例名称', width: 100, dataIndex: 'case_name', },
                { title: '任务编号', dataIndex: 'task_code', width: 150 },
                { title: '任务名称', dataIndex: 'task_name', width: 150 },
                { title: '用例类型名称', dataIndex: 'case_type_name', width: 150 },
                { title: '涉及系统', dataIndex: 'rel_system', width: 150 },
                // { title: '审批状态', dataIndex: 'case_status_name', width: 150 },
                /* { title: '创建人', dataIndex: 'user_name',  width: 150 },*/
                /*{ title: '创建时间', dataIndex: 'creat_time',  width: 150 },*/
                {
                    title: '操作', dataIndex: 'do', key: 'do',
                    render: (text, record) => {
                        return (
                            <div onClick={(e) => { e.stopPropagation() }} >
                                {/* <VpTooltip placement="topLeft" title="编辑用例" arrowPointAtCenter>
                                    <VpIcon type="text-info m-lr-xs cursor vpicon-edit" onClick={this.toProblemInfo} />
                                </VpTooltip> */}
                                {this.parentForm.props.isHistory?"":this.props.stepcode=="01"?
                                 <VpPopconfirm title="确定要取消关联这个用例吗？" onConfirm={(e)=>{this.unlinkClick(record)}}>
                                    <VpTooltip placement="topLeft" title="取消关联" arrowPointAtCenter>
                                        <VpIconFont type="vpicon-unlink" onClick={(e) => { e.stopPropagation() }} className='text-danger m-lr-xs'/>
                                    </VpTooltip>
                                </VpPopconfirm>
                                :
                                this.state.flowiflag==0?
                                <VpTooltip title="是否通过">
                                    <VpSwitch defaultChecked={record.case_status == 2 ? true : false} onChange={e => this.switchChange(e, record)}
                                        checkedChildren="是" unCheckedChildren="否" />
                                </VpTooltip>
                                :""
                                }
                                
                            </div>
                        )
                    }
                }]; 


        this.setState({
            prj_scode: this.state.parentForm.props.form.getFieldValue('scode'),
            prj_sname: this.state.parentForm.props.form.getFieldValue('sname'),
            entity_id: this.state.parentForm.props.iobjectentityid
        });
        if(this.parentForm.props.isHistory){
            if(this.props.stepcode=="01"){
                this.setState({columns:COLUMNSONE})
            }else{
                this.setState({columns:COLUMNS})
            }
           
        }else{
            if(this.props.stepcode=="01"){
                this.setState({columns:COLUMNSONE})
            }else{
                this.setState({columns:COLUMNS})
            }
        }
    }
    componentDidMount() {
        $('.footFixed').css('z-index', 1)
    }

    checkUserLead =()=>{
        //console.log("checkUserLead")
         //判断当前登录人是否配置部门员工
         vpQuery("/{bjyh}/xqyl/model/checkUserLead", {
            usercode:vp.cookie.getTkInfo('username')
        }).then((response) => {
            console.log("checkUserLead",response)
            if(response.data.flag==1){
                this.setState({ all_id: 1 })
            }
            this.queryisinUser();
        })
    }

    handleChange = (e) => {
        this.value = e;
    }
    queryisinUser=()=>{
        console.log("queryisinUser",this.props)
        vpQuery("/{bjyh}/xqyl/model/queryUserList", {
            piid:this.props.piid,
            userid:vp.cookie.getTkInfo('userid'),
            stepcode:this.props.stepcode,
            flowkey:"xqylglxm"
        }).then((response) => {
            this.setState({
                isinuser: response.data.userflag,
                flowiflag: response.data.flowiflag
            });
            this.getData();
        })

    }

    onRowClick = (record) => {
        //console.log(record)
        this.props.form.setFieldsValue({ "task_id_label": record.task_name })
        //console.log("this.state.item", this.state.item)
        
        //console.log("this.props", this.props.stepcode)
        if(this.parentForm.props.isHistory){
        }else{
            if(this.props.stepcode=="01"){
                console.log("record.file_id",record.file_id)
                console.log("record.file_id",record.file_id==null)
                if(record.file_id==null){
                    this.setState({ showRightBox: true, split_user1: false, formData: record,item: {
                        ...this.state.item,
                        widget: {
                            // load_template: [{
                            //     createtime: record.file_uptime,
                            //     entityid: "flow",
                            //     fileid: record.file_id,
                            //     filename: record.file_name,
                            //     instanceid: 16325,
                            //     options: { update: false, preview: false, edit: false, delete: true, download: true },
                            //     size: record.isize,
                            //     status: "complete"
                            // }]
                        }
                    },
                    itemdp: {
                        ...this.state.itemdp,
                        widget: {
                            ...this.state.itemdp.widget,
                            default_value: record.department_id,
                            default_label: record.department_name,
                        }
                    }
                 });
                }else{
                    this.setState({ showRightBox: true, split_user1: false, formData: record,item: {
                        ...this.state.item,
                        widget: {
                            load_template: [{
                                createtime: record.file_uptime,
                                entityid: "flow",
                                fileid: record.file_id,
                                filename: record.file_name,
                                instanceid: 16325,
                                options: { update: false, preview: true, edit: false, delete: false, download: true },
                                size: record.isize,
                                status: "complete"
                            }]
                        }
                    },
                    itemdp: {
                        ...this.state.itemdp,
                        widget: {
                            ...this.state.itemdp.widget,
                            default_value: record.department_id,
                            default_label: record.department_name,
                        }
                    }
                 });
                }
                
            }else{
                if(record.file_id==null){
                    this.setState({ showRightBox: true, split_user1: false, formData: record,item: {
                        ...this.state.item,
                        widget: {
                            // load_template: [{
                            //     createtime: record.file_uptime,
                            //     entityid: "flow",
                            //     fileid: record.file_id,
                            //     filename: record.file_name,
                            //     instanceid: 16325,
                            //     options: { update: false, preview: false, edit: false, delete: true, download: true },
                            //     size: record.isize,
                            //     status: "complete"
                            // }]
                        }
                    },
                    itemdp: {
                        ...this.state.itemdp,
                        widget: {
                            ...this.state.itemdp.widget,
                            default_value: record.department_id,
                            default_label: record.department_name,
                        }
                    }
                 });
                }else{
                    this.setState({ showRightBox: true, split_user1: false, formData: record,item: {
                        ...this.state.item,
                        widget: {
                            load_template: [{
                                createtime: record.file_uptime,
                                entityid: "flow",
                                fileid: record.file_id,
                                filename: record.file_name,
                                instanceid: 16325,
                                options: { update: false, preview: true, edit: false, delete: false, download: true },
                                size: record.isize,
                                status: "complete"
                            }]
                        }
                    },
                    itemdp: {
                        ...this.state.itemdp,
                        widget: {
                            ...this.state.itemdp.widget,
                            default_value: record.department_id,
                            default_label: record.department_name,
                        }
                    }
                 });
                }
            }
        }
        //console.log("this.state.item", this.state.item)
        //console.log("formData", this.state.formData)
    }



    //行删除操作
    deleteConfirm = (record) => {
        let jsonPara = {
            flow_type: '4',
            entity_id: this.state.parentForm.props.iobjectentityid,
            flow_id: this.props.piid,
            project_code: this.state.prj_scode,
            project_name: this.state.prj_sname,
            case_id: record.case_id
        }
        vpAdd(window.vp.config.jgjk.ylxz.deleteyl == '' || window.vp.config.jgjk.ylxz.deleteyl == undefined ? "/{bjyh}/ylgl/confirmJg" : window.vp.config.jgjk.ylxz.deleteyl, {
            jsonPara: JSON.stringify(jsonPara)
        }).then((response) => {
            //console.log(response);
            this.getData();
        })
    }

//取消关联事件
unlinkClick=(record)=>{
    console.log("取消关联",record);
    console.log("主表单",this.state.parentForm);
    console.log("项目编号",this.state.parentForm.props.form.getFieldValue('sxmbh'),this.state.parentForm.props.form.getFieldValue('rxmmc_label'));
    let jsonPara={
        case_id:record.case_id,
        flow_id:this.props.piid
    }
    vpAdd(window.vp.config.jgjk.xqbg.deleteVpCaseAdd,{jsonPara:JSON.stringify(jsonPara)}).then(res=>{
        if(res.code==200){
            VpAlertMsg({
                message:"消息提示",
                description:"取消关联成功",
                type:"success",
                showIcon: true
            }, 3)
            this.getData();
        }else{
            VpAlertMsg({
                message:"消息提示",
                description:"取消关联失败",
                type:"success",
                showIcon: true
            }, 3)
        }
    })
}
    switchChange = (flag, record) => {
        // console.log("flag", flag);///
        //console.log("record", record);
        let state = 2;
        if (!flag) {
            state = 3;
        }
        let _this = this
        let jsonPara = {
        }

        let url=window.vp.config.jgjk.ylxz.switchFlag;
        if(this.props.stepcode == "03"){ //领导会签节点审批通过不通过
            url=window.vp.config.jgjk.ylxz.hqswitchFlag;
            jsonPara = {
                flow_type: 4,
                entity_id: this.state.entity_id,
                flow_id: this.props.piid,
                project_code: this.state.prj_scode,
                project_name: this.state.prj_sname,
                case_id: record.case_id,
                case_status: state,
                all_id: this.state.all_id,
                task_step_id: this.props.taskid,
                user_code: vp.cookie.getTkInfo('username'),
                user_name: vp.cookie.getTkInfo('nickname'),
                department_id: vp.cookie.getTkInfo('idepartmentid'),
            }
        }else if(this.props.stepcode == "05"){//相关用户会签节点审批通过不通过
            url=window.vp.config.jgjk.ylxz.xghqswitchFlag;
            jsonPara = {
                flow_type: 4,
                entity_id: this.state.entity_id,
                flow_id: this.props.piid,
                project_code: this.state.prj_scode,
                project_name: this.state.prj_sname,
                case_id: record.case_id,
                case_status: state,
                all_id: this.state.all_id,
                task_step_id: this.props.taskid,
                user_code: vp.cookie.getTkInfo('username'),
                user_name: vp.cookie.getTkInfo('nickname'),
                department_id: vp.cookie.getTkInfo('idepartmentid'),
            }
        }else{
            jsonPara = {
                flow_type: '4',
                entity_id: this.state.entity_id,
                flow_id: this.props.piid,
                project_code: this.state.prj_scode,
                project_name: this.state.prj_sname,
                case_id: record.case_id,
                case_status: state
            }
        }

        vpAdd(url, {//告知架构平台此用例未通过
            jsonPara: JSON.stringify(jsonPara)
        }).then((response) => {
            this.getData();
        })
    }
 
    //提交流程表单前校验
    // onFormSave(options,errorCallback){
    // vpAdd('/{bjyh}/programEva/system/save', {
    //     piid:this.props.piid,
    //     taskid:this.props.taskid||this.props.staskid||this.props.formData.curtask.taskId,
    //     iid:this.props.iid,
    //     entityid:this.props.entityid,
    //     sparam:JSON.stringify(this.state.tableData)
    // }).then((response) => {
    //     errorCallback(null,null)
    // })
    // }


    /**
     * 弹出添加用例
     */
    addPerson = (record) => {
        //console.log("record", record)

        this.setState({
            formData: {}, item: {
                ...this.state.item,
                widget: {
                    load_template: []
                }
            }
        });
        //console.log("formData", this.state.formData)

        //console.log("_this.state.formData", this.state.formData == undefined ? this.state.formData : "1")
        let _this = this;
        _this.updateStatus({
            split_user: true,
        });

        /* })*/

    }

    //关联用例按钮模态窗打开事件
    relReqCase=(record)=>{
        this.setState({relReqCaseModalVisible:true});
    }
    //关联用例按钮模态窗关闭事件
    handleCancel = () => {
        this.setState({
            reqCaseEditAttrVisible: false,
            relReqCaseModalVisible:false,
            reqCaseReadOnlyAttrVisible:false
        },()=>{
            this.getData();
        });
    }
    /**
     * 关联已有用例
     */
    uploadyyyl = (v) => {
        this.setState({
            entityyyl: true
        })
    }
    /**
     * 批量导入用例
     */
    uploadyl = (v) => {
        this.setState({
            entityVisible: true
        })
    }

    splitUserOk = (ids) => {
        let _this = this
        this.setState({
            loading: true
        })
        let result = false;
        let jsonPara = {};
        this.props.form.validateFields((errors, values) => {
            console.log("splitUserOkvalue:", values)
            //console.log("_this.state.formData", _this.state.formData)
            result = this.validationXqylField(values);
            jsonPara = {
                case_id: _this.state.formData.case_id,//主键';
                case_code: values.case_code,//用例编号';
                case_name: values.case_name,//用例名称';
                project_code: values.project_code,//项目编号';
                project_name: values.project_name,//项目名称';
                entity_id: this.state.entity_id,//vp的实体id';
                flow_id: this.props.piid,//vps的流程id';
                task_id: values.task_id,//任务id';
                case_type: values.case_type,//用例类型';
                department_id: values.dept_name,//部门id';
                case_des: values.case_des,//用例简述概要';
                rel_system: values.rel_system,//涉及系统';
                case_status: values.case_status,//用例状态';
                user_code: vp.cookie.getTkInfo('username'),//创建人工号';
                user_name: vp.cookie.getTkInfo('nickname'),//创建人姓名';
                //creat_time: values.//创建时间';
                //upate_time: values.//更新时间';
                rel_filename: '',//values.//关联附件名称,只有在（用例新增流程）中用到';
                flow_type: 4,//流程类型：1需求用例新增，2未关联项目的需求用例变更，3已关联项目的需求用例变更，4需求用例与项目关联，5上线流程';
                //rel_flag: values.//创建关联标识,只有在（已关联项目的需求用例变更流程）中用到';
                // case_change_name: values.//用例变更是:取消关联,创建关联,变更内容,只有在（已关联项目的需求用例变更流程）中用到';
                flow_status: 0,//流程状态，0代表正在运行时，1代表强行终止，2代表正常结束';
                file_id: values.rfj
            }
        })
        //console.log("result", result)
        if (result) {
            //console.log("",)
            //console.log("jsonPara", jsonPara)
            vpAdd(window.vp.config.jgjk.ylxz.xzsave == '' || window.vp.config.jgjk.ylxz.xzsave == undefined ? "/{bjyh}/flowAccess/addAssesser" : window.vp.config.jgjk.ylxz.xzsave, {
                jsonPara: JSON.stringify(jsonPara)
            }).then((response) => {
                console.log("response",response)
                if(response.msg=="1"){
                    VpAlertMsg({
                        message: "消息提示",
                        description: '用例名称重复,已重置成空，请修改！',
                        type: "error",
                        onClose: this.onClose,
                        closeText: "关闭",
                        showIcon: true
                    }, 3)
                    this.setState({
                        loading: false
                    })
                }else{
                    VpAlertMsg({
                        message: "消息提示",
                        description: '操作成功！',
                        type: "info",
                        onClose: this.onClose,
                        closeText: "关闭",
                        showIcon: true
                    }, 3)
                    
                    this.setState({
                        loading: false,
                        showRightBox: false,
                        split_user1: false
                    })
                    
                    this.handleUserCancel();
                    this.getData();
                    // _this.child.tableRef.getTableData()//刷新子页面
                    _this.parentForm.getAssessInfo && _this.parentForm.getAssessInfo()
                }
            })
        }else{
            this.setState({
                loading: false
            })
        }
    }
    //校验用例属性必填是否填写
    validationXqylField = (values) => {

        //console.log("this1", this.state.item.widget)
        //console.log("this2", this.state.item.widget.load_template.length)
        //console.log("values.case_name", values.case_name)
        //console.log("values.case_name", values.case_name == undefined)
        //console.log("values.rfj", values.rfj)
        if (values.rfj > 0) {
        } else {
            try{
                if (this.state.item.widget.load_template.length > 0) {
                    values.rfj = this.state.item.widget.load_template[0].fileid;
                }
            }catch(e){
                VpAlertMsg({
                    message: "消息提示",
                    description: '请添加附件！',
                    type: "error",
                    onClose: this.onClose,
                    closeText: "关闭",
                    showIcon: true
                }, 3)
                return false
            }
        }
        
        //console.log("values", values)
        if (values.case_name == undefined) {
            VpAlertMsg({
                message: "消息提示",
                description: '请输入用例名称！',
                type: "error",
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 3)
            return false
        }else if (values.case_name == "") {
            VpAlertMsg({
                message: "消息提示",
                description: '请输入用例名称！',
                type: "error",
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 3)
            return false
        }else if (values.dept_name == null) {
            VpAlertMsg({
                message: "消息提示",
                description: '请输入部门名称！',
                type: "error",
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 3)
            return false
        } else if (values.case_type == undefined) {
            VpAlertMsg({
                message: "消息提示",
                description: '请输入用例类型！',
                type: "error",
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 3)
            return false
        } else if (values.case_des == undefined) {
            VpAlertMsg({
                message: "消息提示",
                description: '请输入用例简要概述！',
                type: "error",
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 3)
            return false
        } else if (values.rfj == undefined) {
            VpAlertMsg({
                message: "消息提示",
                description: '请添加附件！',
                type: "error",
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 3)
            return false
        } else {
            return true;
        }


    }
    getUserContent = () => {
        if (this.state.split_user) {
            return this.showUsertem(0);
        } else {
            return '';
        }
    }
    getUserContent2 = () => {
        if (this.state.showRightBox) {
            return this.showUsertem(1);
        } else {
            return '';
        }
    }



    /**
     * 系统负责人弹框取消
     */
    handleUserCancel = (e) => {
        this.setState({ split_user: false });
    }

    /**
     * 注册子表单到父表单参数
     */
     getRegisterSubFormOptions() {
        return {
            asyncSave: true, //是否是同时保存主子表，如果为true,则子表单类必须实现getFormValues接口,如果为false,则实现onSave接口
            onValidate: "onValidate", //如果默认的onValidate与类有冲突时，可以使用自定义名称替换onValidate函数
            onSave: "onSave",  //如果默认的onSave与类有冲突时，可以使用自定义名称替换onSave函数
            getFormValues: "getFormValues", //如果默认的getFormValues与类有冲突时，可以使用自定义名称替换getFormValues函数
            //onMainFormSaveSuccess: "onMainFormSaveSuccess"  //同步保存时，主表单保存成功后
        }
    }

    //注册子表单到父表单中,
    registerSubForm() {
        //console.log("registerSubForm")
        //调用this.props.registerSubForm注册子表单到父表单中，父表单返回父表单this
        this.parentForm = this.props.registerSubForm(this.props.field_name, this, this.getRegisterSubFormOptions());
    }

    //获取用户header
    getData() {
        //console.log("this.props", this.props)
        //console.log("this.parentForm",this.parentForm)
        const isHistory = this.parentForm.props.isHistory//是否历史数据
        //console.log("isHistory2",isHistory)
        
        
        let jsonPara = {}
        //console.log("jsonPara", jsonPara)
        //console.log("ylglzymlist", window.vp.config)
        //console.log("ylglzymlist", vp.cookie.getTkInfo())
       

        console.log("getData-all_id", this.state.all_id)
        let url=window.vp.config.jgjk.ylxz.ylglzymlist;
       console.log("this,",this)
        if(this.props.stepcode == "03"){ //领导会签接口
            url=window.vp.config.jgjk.ylxz.hqylglzymlist;
            jsonPara = {
                flow_type: 4,
                entity_id: this.state.parentForm.props.iobjectentityid,
                flow_id: this.props.piid,
                project_code: this.state.prj_scode,
                project_name: this.state.prj_sname,
                all_id:  this.state.all_id,
                task_step_id: this.props.taskid,
                user_code: vp.cookie.getTkInfo('username'),
                user_name: vp.cookie.getTkInfo('nickname'),
                department_id: vp.cookie.getTkInfo('idepartmentid'),
                isinuser:this.state.isinuser//亮总判断当前登陆人是否在会签节点中
            }

        }else if(this.props.stepcode == "05"){ //相关用户会签接口
            url=window.vp.config.jgjk.ylxz.xghqylglzymlist;
            jsonPara = {
                flow_type: 4,
                entity_id: this.state.parentForm.props.iobjectentityid,
                flow_id: this.props.piid,
                project_code: this.state.prj_scode,
                project_name: this.state.prj_sname,
                all_id:  this.state.all_id,
                task_step_id: this.props.taskid,
                user_code: vp.cookie.getTkInfo('username'),
                user_name: vp.cookie.getTkInfo('nickname'),
                department_id: vp.cookie.getTkInfo('idepartmentid'),
                isinuser:this.state.isinuser//亮总判断当前登陆人是否在会签节点中
            }
        }else if(this.props.stepcode == "02"){ 
            jsonPara = {
                flow_type: 4,
                flow_id: this.props.piid,
                // case_status:2,
                step_id:3//只差初审页面的数据
            }
        }else{
            jsonPara = {
                flow_type: 4,
                flow_id: this.props.piid
                // entity_id: this.state.parentForm.props.iobjectentityid,
                // project_code: this.state.prj_scode,
                // project_name: this.state.prj_sname,
                // isinuser:this.state.isinuser//亮总判断当前登陆人是否在会签节点中
            }
        }

        vpAdd(url, {
            jsonPara: JSON.stringify(jsonPara)
        }).then((response) => {
            console.log("data_array=", response.rows)
            this.setState({ data_array: response.rows })
        })



        
        // console.log("this.parentForm",this.parentForm)
        // console.log("this.parentForm",this.parentForm.props.formData.handlers[0].searchCondition[0].field_value)
        // this.parentForm.props.formData.handlers[0].searchCondition[0].field_value="1";
        //刷新页面时，让父页面重新加载下一步处理人过滤条件
        this.parentForm.change();
        // this.parentForm.onGetFormDataSuccess();
    }


    handleFileCancelyl = () => {
        this.chooseModel.setState({ selectItem: [] })
        this.chooseModel.setState({ selectedRowKeys: [] })
        this.setState({
            entityyyl: false
        })
    }

    selectmodelChange = (val, names) => {
        this.setState({ selectValue: val })
    }

    /**
     * 需要填写的信息
     */
    showUsertem = (bool) => {
        //console.log("this.props.form", this.props.form)
        //console.log("this.stata.rfj_flag", this.state.rfj_flag)
        const formData = this.props.data
        const { getFieldProps } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 20 },
        };
        const item = this.state.item;
        const taskProps = {
            data: { initialValue: ""/*formData.task_id*/ },
            widget_type: "selectmodel",
            field_name: "task_id",
            field_label: "任务名称",
            irelationentityid: 81,
            labelCol: { "span": 5 },
            wrapperCol: { "span": 18 },
            readOnly: false,
            label: "任务名称",
            modalProps: {
                url: 'bjyh/templates/Form/ChooseEntity',
                ajaxurl: window.vp.config.jgjk.ylxz.addtaskList
            },
            value: '',
            onChange: this.selectmodelChange,
            "data-meta": {
                "rules": [{ "required": true }],
                "validate": [{
                    "trigger": ["onChange"],
                    "rules": [{ "required": true }]
                }]
            }
        }
        let sparam = {
            idpttype: 0
        }
        const itemdp = this.state.itemdp;

        return (
            <div className="split-modal-content f14">
                <VpForm horizontal ref='form'>
                    <VpRow key='s1' className='ant-row ant-form-item'>
                        <VpCol key='case_code' span='12'>
                            <VpFInput disabled {...getFieldProps('case_code', {
                                initialValue: this.state.formData.case_code
                            })}
                                label="用例编号1" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}
                            />
                        </VpCol>
                        <VpCol key='case_name' span='12'>
                            <VpFInput {...getFieldProps('case_name', {
                                initialValue: this.state.formData.case_name,
                                rules: [
                                    {
                                        required: true,
                                        message: '用例名称不能为空!'
                                    },
                                ],
                            })}
                                label="用例名称" labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}
                            />
                        </VpCol>
                    </VpRow>
                    <VpRow key='s2' className='ant-row ant-form-item'>

                        <VpCol key='task_id' span='12' style={{ display: "none" }}>
                            <VpFInput  {...getFieldProps('task_id', {
                                initialValue: this.state.formData.task_id
                            })}
                                label="任务id" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}
                            />
                        </VpCol>
                        <VpCol key='task_code' span='12'>
                            <VpFInput disabled {...getFieldProps('task_code', {
                                initialValue: this.state.formData.task_code
                            })}
                                label="任务编号" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}
                            />
                        </VpCol>
                        <VpCol key='task_name'span='12'>
                        <VpChooseModal  {...taskProps} form={this.props.form}/>
                        </VpCol>
                        
                    </VpRow>
                    <VpRow key='s3' className='ant-row ant-form-item'>
                        <VpCol key='rel_system' span='12'>
                            <VpFInput  {...getFieldProps('rel_system', {
                                initialValue: this.state.formData.rel_system
                            })}
                                label="涉及系统" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}
                            // value={this.state.formData.rel_system==undefined?"":this.state.formData.rel_system}
                            />
                        </VpCol>

                        <VpCol key='case_type' span='12'>
                            <VpFSelect label="用例类型" labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}  >
                                <VpSelect {...getFieldProps('case_type', { initialValue: this.state.formData.case_type, 
                                    rules: [{ required: true, message: "用例类型不能为空" }] })
                                    }  >
                                    <VpOption value="1">业务服务类</VpOption>
                                    <VpOption value="2">产品配置类</VpOption>
                                    <VpOption value="3">交互式视觉类</VpOption>
                                    <VpOption value="4">接口API</VpOption>
                                    <VpOption value="5">参数化维护与数据补录类</VpOption>
                                    <VpOption value="6">查询报表类</VpOption>
                                </VpSelect>
                            </VpFSelect>

                        </VpCol>
                    </VpRow>
                    <VpRow key='s4' className='ant-row ant-form-item'>
                    <VpCol key='dept_id'  span='12' >
                        <VpSelectObject  
                                form={this.props.form}
                                item={itemdp}
                                bindThis={this}
                            />
                        </VpCol>
                        <VpCol key='user_code' span='12'>
                            <VpFInput disabled
                                {...getFieldProps('user_code', {
                                    initialValue: vp.cookie.getTkInfo('nickname'),
                                })}
                                label="创建人" labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}
                            //value={}
                            />
                        </VpCol>
                        
                    </VpRow>
                    <VpRow key='s5' className='ant-row ant-form-item'>
                    <VpCol key='case_status' span='12'>
                            <VpFRadio
                                label="用例状态"
                                {...formItemLayout}
                                {...getFieldProps('radio', { initialValue: this.state.formData.case_status == undefined ? "1" : this.state.formData.case_status })}
                                labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}
                            >
                                <VpRadioGroup defaultValue={this.state.formData.case_status == undefined ? "1" : this.state.formData.case_status} disabled  >
                                    <VpRadio key='1' value='1'>新增</VpRadio>
                                    <VpRadio key='2' value='2'>已审批</VpRadio>
                                    <VpRadio key='3' value='3'>未通过</VpRadio>
                                    <VpRadio key='4' value='4'>已投产</VpRadio>
                                </VpRadioGroup>
                            </VpFRadio>
                        </VpCol>
                    </VpRow>
                    
                    <VpRow key='s6' className='ant-row ant-form-item'>
                        <VpCol key='case_status' span='24'>
                            <VpFInput type='textarea' {...getFieldProps('case_des', {
                                initialValue: this.state.formData.case_des,
                                rules: [
                                    {
                                        required: true,
                                        message: '用例简要概述不能为空!'
                                    },
                                ],
                            })}
                                rows={4} maxLength={2000}
                                label="用例简要概述" {...formItemLayout}
                            // value={this.state.formData.case_des==undefined?"":this.state.formData.case_des}
                            >
                            </VpFInput>
                        </VpCol>
                    </VpRow>
                    <VpRow key='s7' className='ant-row ant-form-item'>
                        <VpCol span="3" className='ant-form-item-label'>
                            <label>附件</label>
                        </VpCol>
                        <VpCol span="21" className='ant-form-item-label' style={{ textAlign: 'left' }}>
                            <VpFUploader
                                {...getFieldProps('rfj', { initialValue: item.defaultValue, rules: [{ required: true, message: "上传附件不能为空" }] })}
                                form={this.props.form}
                                item={item}
                            />
                        </VpCol>
                    </VpRow>
                </VpForm>
            </div>
        )
    }
    //关闭
    closeeditModal = () => {
        this.setState({
            showRightBox: false,
            split_user1: false
        })

    }
    toProblemInfo = (record) => {
        //console.log("record:", record)
        record.stopPropagation();
        this.setState({
            split_user: false,
            showRightBox: true,
            toInfoData: { ...record }
        })
    }


    /**
     * 更新此组件的state方法
     */
    updateStatus = (v) => {
        this.setState(v);
    }

    /**
     * 父组件调用子组件
     */
    testChild = (ref) => {
        this.child = ref
    }




    //关闭变迁状态弹出的模态框
    cancelModal = () => {
        this.setState({
            visible: false,
            entityVisible: false,
            showError: false,
            errinfo: []
        })
    }
    handleSubmit = (type) => {
        if (type == 'upload') {
            let file_label = this.props.form.getFieldValue("xls_label");
            this.inputUploader.upload.options.formData.jsonPara = {
                entity_id: this.state.parentForm.props.iobjectentityid,
                flow_id: this.props.piid,
                user_code: vp.cookie.getTkInfo('username'),
                user_name: vp.cookie.getTkInfo('nickname'),
                file_name: file_label
            }
            //导入数据
            this.inputUploader.upload.upload()
        } else {
            const _this = this;
            let condition = {
                filePath: '',
                fileName: 'fqxqylxmdrmb.xlsx',
                downLoadName: 'fqxqylxmdrmb.xlsx'
            }
            vpDownLoad('/{bjyh}/util/fileDownload', condition)
        }
    }
    uploadSuccess = (file, res) => {
        if (res.errorInfo.length > 0) {
            //let errinfo = res.data.join('\n');
            VpAlertMsg({
                message: "消息提示",
                description: "导入失败",
                type: "warning",
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 5)
            this.setState({
                showError: true,
                errinfo: res.errorInfo || []
            });
        } else {
            VpAlertMsg({
                message: "消息提示",
                description: '导入成功！',
                type: "success",
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 5)
            this.setState({
                entityVisible: false
            });
        }

    }

    uploadClick = () => {

        this.inputUploader.upload.on("beforeFileQueued", (file) => {
            this.props.form.setFieldsValue({ "xls_label": file.name })
        })
    }
    getHeaders = () => {
        return (
            [
                { title: '用例名称', dataIndex: 'case_name', key: 'case_name' }
                , { title: '任务编号', dataIndex: 'task_code', key: 'task_code' }
                , { title: '任务名称', dataIndex: 'task_name', key: 'task_name' }
                , { title: '用例类型', dataIndex: 'case_type_name', key: 'case_type_name' }
                , { title: '用例状态', dataIndex: 'case_status_name', key: 'case_status_name' }
                , { title: '创建人员工号', dataIndex: 'user_code', key: 'user_code' }]
        )
    }
    getOptions = () => {
        return {
            columns: this.getHeaders(),
            piid:this.props.piid
        }
    }

    /**
     * @description: 弹框组件实体查询条件
     * @return: object
     */
    getCondition = () => {
        return {

        }
    }
    onModelRef = ref => {
        this.chooseModel = ref
    }
    //关联用例完成后保存到李亮他们平台
    onSaveyyyl = () => {
        console.log(this.chooseModel.state.selectItem);

        let jsonPara = {
            flow_type: '4',
            entity_id: this.state.parentForm.props.iobjectentityid,
            flow_id: this.props.piid,
            vpCaseQueryRes: this.chooseModel.state.selectItem
        }

        vpAdd(window.vp.config.jgjk.ylxz.savePassYl == '' || window.vp.config.jgjk.ylxz.savePassYl == undefined ? "{bjyh}/ylbg/queryfaldname2" : window.vp.config.jgjk.ylxz.savePassYl, {
            jsonPara : JSON.stringify(jsonPara)
        }).then((response) => {
            // this.chooseModel.setState({ selectItem: [] })
            // this.chooseModel.setState({ selectedRowKeys: [] })
            // this.chooseModel.setState({ searchStr: '' })
            this.setState({
                entityyyl: false
            })
            this.getData();
        })

    }
    render() {
       

        return (
            <div className="full-height p-sm bg-white pr requirement">
                <VpRow className="bg-white">
                    {this.parentForm.props.isHistory?"":this.props.stepcode == "01" ?
                        <VpCol span={24} className={"text-right"} >

                            <VpButton type="primary" className="vp-btn-br m-l-xs" onClick={this.relReqCase}>
                                关联用例
                            </VpButton> 
                            {/* <VpButton type="primary" className="vp-btn-br m-l-xs" onClick={this.addPerson} >
                                创建用例
                            </VpButton>
                            {<VpButton type="primary" className="vp-btn-br m-l-xs" onClick={this.uploadyyyl} >
                                关联已有用例
                            </VpButton>}
                            {<VpButton type="primary" className="vp-btn-br m-l-xs" onClick={this.uploadyl} >
                                批量导入用例
                            </VpButton>} */}

                        </VpCol>
                        : ""
                    }
                </VpRow>
                <VpRow className="b-b bg-white" style={{ top: 10 }}>
                    <VpCol span={24}>
                        <VpDTable
                            columns={this.state.columns}
                            dataSource={this.state.data_array}
                            scroll={{ y: 350 }}
                            resize
                            bindThis={this}
                            pagination={false}
                            onRowClick={this.onRowClick}
                        />
                    </VpCol>
                </VpRow>
                <VpModal
                    title="添加用例"
                    width={'70%'}
                    height={'80%'}
                    visible={this.state.split_user}
                    onCancel={this.handleUserCancel}
                    footer={
                        <div className="text-center">
                            <VpButton type="primary" loading={this.state.loading} onClick={this.splitUserOk}>确定</VpButton>
                            <VpButton type="ghost" onClick={this.handleUserCancel}>取消</VpButton>
                        </div>
                    }>
                    {this.getUserContent()};
                </VpModal>
                <VpModal
                    title="选择需要关联的需求用例"
                    visible={this.state.relReqCaseModalVisible}
                    onCancel={this.handleCancel}
                    width={'70%'}
					wrapClassName='modal-no-footer dynamic-modal'
                    footer={null}>
                    {this.state.relReqCaseModalVisible?
                    <RelReqCaseModal
                    onOk={this.handleCancel}
                    piid={this.props.piid||''}
                    taskid={this.props.taskid||''}
                    item={{
                        irelationentityid:2,
                        modalProps:{ajaxurl:""},
                        widget_type:""
                    }}
                    // {...obj}
                    />:null}
                </VpModal>
                <VpModal
                    title='导入用例和附件'
                    visible={this.state.entityVisible}
                    onCancel={() => this.cancelModal()}
                    width={'70%'}
                    height={'80%'}
                    footer={null}
                    wrapClassName='modal-no-footer'
                >
                    {
                        this.state.entityVisible ?
                            <div className="business-container full-height" onClick={this.uploadClick}>
                                <VpRow>
                                    <VpCol span={18}>
                                        <VpInputUploader form={this.props.form} item={{
                                            field_name: "xls",
                                            widget_type: "inputupload",
                                            field_label: "选择用例",
                                            all_line: 2,
                                            tips: '请选择文件（*.xls,*.xlsx)',
                                            auto: false,
                                            widget: {
                                                accept: {
                                                    title: 'Xls',
                                                    extensions: 'xlsx,xls',
                                                },
                                                upload_url: window.vp.config.jgjk.ylxz.batchYlupload,
                                            }
                                        }}
                                            uploaderOptions={{
                                                formData: {
                                                    entity_id: this.state.parentForm.props.iobjectentityid,
                                                    flow_id: this.props.piid,
                                                    user_code: vp.cookie.getTkInfo('username'),
                                                    user_name: vp.cookie.getTkInfo('nickname'),
                                                }, timeout: 0
                                            }}
                                            ref={upload => this.inputUploader = upload}
                                            onUploadAccept={this.uploadSuccess} />
                                    </VpCol>
                                    <VpCol span={6}>
                                        <VpButton type="primary" onClick={() => this.handleSubmit('upload')}>导入数据</VpButton>
                                        <VpButton type="primary" style={{ marginLeft: '10px' }} onClick={() => this.handleSubmit('download')}>下载模板</VpButton>
                                    </VpCol>
                                </VpRow>

                                {this.state.showError ?
                                    <div className='text-content' style={{ 'height': '50%' }}>
                                        <ul>
                                            {this.state.errinfo.map((item, i) => {
                                                return <li>{item}</li>
                                            })}
                                        </ul>
                                    </div>
                                    : null}

                                <VpRow span={24}>
                                    <VpCol style={{ fontSize: 15, lineHeight: '60px' }} span={2}>
                                        选择附件
                                    </VpCol>
                                    {<VpCol className="gutter-row" span={22}>
                                        <VpUploader
                                            server={window.vp.config.jgjk.ylxz.batchFileUpload}
                                            onUploadAccept={this.onUploadAccept}
                                            params={{
                                                entity_id: this.state.parentForm.props.iobjectentityid,
                                                flow_id: this.props.piid,
                                                user_code: vp.cookie.getTkInfo('username'),
                                                user_name: vp.cookie.getTkInfo('nickname'),
                                            }}
                                            fileTypes={this.state.doctypelist}
                                            selectType={this.state.selectType}
                                        />
                                    </VpCol>}
                                </VpRow>
                            </div>
                            : null
                    }

                </VpModal>

                <VpModal
                    title="修改用例"
                    width={'70%'}
                    height={'80%'}
                    visible={this.state.showRightBox}
                    onOk={this.splitUserOk}
                    onCancel={this.closeeditModal}
                    footer={
                        this.state.split_user1 ? "" :
                            <div className="text-center">
                                <VpButton type="primary" loading={this.state.loading} onClick={this.splitUserOk}>确定</VpButton>
                                <VpButton type="ghost" onClick={this.closeeditModal}>取消</VpButton>
                            </div>
                    }>
                    {this.getUserContent2()};
                </VpModal>

                <VpModal
                    title="选择已有用例"
                    visible={this.state.entityyyl}
                    onCancel={this.handleFileCancelyl}
                    width={'70%'}
                    height={'90%'}
                    wrapClassName='modal-no-footer dynamic-modal'
                    footer={
                        <div className="text-center">
                            <VpButton type="primary" onClick={this.onSaveyyyl}>确定</VpButton>
                            <VpButton type="ghost" onClick={this.handleFileCancelyl}>取消</VpButton>
                        </div>
                    }>
                    {this.state.entityyyl ? <XqylFormModel options={this.getOptions()}
                        queryParams={this.getCondition()}
                        onModelRef={this.onModelRef} /> : null
                    }
                </VpModal>
            </div>
        );
    }
}
export default VpFormCreate(AccessList);