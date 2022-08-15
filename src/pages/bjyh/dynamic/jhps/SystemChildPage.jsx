import React, { Component } from "react";
import { vpQuery,vpAdd,VpInput,VpIcon,VpModal,VpButton } from 'vpreact';
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';
import NormalTable from '../../../templates/dynamic/List/NormalTable';
import Choose from '../../../templates/dynamic/Form/ChooseEntity';
import {
    EditTableCol,VpVerifyTableCol
} from 'vpbusiness';
/**
 * 涉及系统子页面
 */
class appSystem extends NormalTable.Component {
    constructor(props) {
        super(props);
        this.state={
            ...this.state,
            showModel:false,
            tableData:[],
            sysRoleArr:[],
        }
    }
    componentWillMount() {        
        this.getHeader();
        this.registerSubForm();
    }
    componentDidMount(){
        this.getHeader();
        this.forceUpdate();
    }
    //表头
    getHeader() {
        let _headerNew = [
            { title: '涉及系统', dataIndex: 'sysname',key:'sysid',
                render: (text, record,index) => {
                    //return this.state.tableData && this.state.tableData[index].sysname          
                    return text
                   }
            },
            { title: '系统负责人', dataIndex: 'sysrolename',key:'sysroleid',
                render: (text, record,index) => {
                    let widget = {
                        "widget_type": "text",
                        "widget_name": "sysrolename"
                    }
                    return (
                        <VpInput value={text} readOnly={true}
                            // onChange={(e) => { this.sysroleChange(e, record, index) }} 
                            onClick={() => this.sysroleSelect(text,record,index)}
                            suffix={
                                <VpIcon onClick={() => this.sysroleSelect(text,record,index)} type='search' style={{ marginTop: 7 }} />
                        }/>
                    )
                }
            },
        ];
        this.setState({ table_headers: _headerNew, tableloading: false });
    }
    //自定义属性
    getCustomTableOptions() {       
        return {
            dataUrl: (!!this.parentForm.props.isHistory || !this.parentForm.props.staskid) ? '/{bjyh}/programEva/system/list' : '/{bjyh}/programEva/system/initlist',
            params:{
                piid:this.props.piid,
                taskid:this.props.taskid||this.props.staskid||this.props.formData.curtask.taskId,
                iid:this.props.iid,
                entityid:this.props.entityid
            },
            tableOptions:[],//底部功能按钮
            bordered:true,
            pagination: false,
            size:'small',
            onRowClick:null,
        }
    }
    //父子页面通讯注册,注册子表单到父表单中。
    registerSubForm(){
        //调用this.props.registerSubForm注册子表单到父表单中，父表单返回父表单this
        this.parentForm = this.props.registerSubForm(this.props.field_name,this,{
            asyncSave: true, //是否是同时保存主子表，如果为true,则子表单类必须实现getFormValues接口,如果为false,则实现onSave接口
            //onValidate:"onValidate", //如果默认的onValidate与类有冲突时，可以使用自定义名称替换onValidate函数
            //onSave:"onSave",  //如果默认的onSave与类有冲突时，可以使用自定义名称替换onSave函数
            getFormValues:"onFormSave", //如果默认的getFormValues与类有冲突时，可以使用自定义名称替换getFormValues函数
            //onMainFormSaveSuccess:"onMainFormSaveSuccess"  //同步保存时，主表单保存成功后
        });
    }
    //数据加载完成后
    controlAddButton = (numPerPage, resultList) => {
        this.state.tableDataRel = resultList
        this.setState({
            tableData: resultList,
            tableloading: false,
            tableHeight: resultList.length==0?200:resultList.length*40+10,
        })
        let sysRoleArr = resultList.filter(item => {
            return item.sysroleid
        })
        this.parentForm.handlerProcess && this.parentForm.handlerProcess(sysRoleArr,resultList)
    }
    //系统负责人选择器
    sysroleSelect = (val,record,index) => {
        this.setState({
            showModel:true,
            clickRow: index,
            chooseItem:{
                iid:record.sysroleid,
                sname:record.sysrolename,
            },
        })
    }
    //模态框取消
    onModelCancel = (selectItem) => {
        this.setState({showModel:false})
    }
    //模态框确定
    onModelOk = (selectItem) => {
        this.state.tableDataRel[this.state.clickRow].sysroleid = selectItem.length>0?selectItem[0].iid:''
        this.state.tableDataRel[this.state.clickRow].sysrolename = selectItem.length>0?selectItem[0].sname:''
        this.setState({
            showModel: false,
            tableData: this.state.tableDataRel,
        })
        //带入到父页面的预设处理人中
        let sysRoleArr = this.state.tableDataRel.filter(item => {
            return item.sysroleid
        })
        this.parentForm.handlerProcess && this.parentForm.handlerProcess(sysRoleArr)
    }
    //子表单保存
    onFormSave = (options,errorCallback) => {
        vpAdd('/{bjyh}/programEva/system/save', {
            piid:this.props.piid,
            taskid:this.props.taskid||this.props.staskid||this.props.formData.curtask.taskId,
            iid:this.props.iid,
            entityid:this.props.entityid,
            sparam:JSON.stringify(this.state.tableData)
        }).then((response) => {
            errorCallback(null,null)
        })
    }

    render(){
        const itemProps = {
            irelationentityid:2,
            widget_type:'selectmodel',
        }
        let initValue = [this.state.chooseItem]
        return (
            <div style={{ marginLeft: 30, marginRight: 30, textAlign: "right", marginBottom: 5 }}>
               {super.render()}
               <VpModal
                    title={'请选择'}
                    width={'70%'}
					wrapClassName='modal-no-footer dynamic-modal'
                    visible={this.state.showModel}
                    onCancel={this.onModelCancel}
                    footer={null}
                    >
                    {
                        this.state.showModel?
                        <Choose item={itemProps} initValue={initValue} onCancel={this.onModelCancel} onOk={this.onModelOk}/>
                        :null
                    }
                </VpModal>
            </div>
        )
    }
}
appSystem = FlowForm.createClass(appSystem);
export default appSystem;