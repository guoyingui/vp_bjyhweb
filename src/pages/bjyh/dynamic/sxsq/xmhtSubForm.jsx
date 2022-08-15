import React, { Component } from "react";
import { 
    VpModal,  
    VpTable,
    VpButton,
    vpDownLoad,
} from "vpreact";

/**
 * 项目合同子页面
 */
class xmhtSubForm extends Component{
    constructor(props){
        super(props);
        this.state = {
            tableHeight:200,
            visible:false,
            visible1:false,
        }
    }

    componentWillMount() {
        this.registerSubForm();
    }
    //注册子表单到父表单中,
    registerSubForm(){
        //调用this.props.registerSubForm注册子表单到父表单中，父表单返回父表单this
        this.parentForm = this.props.registerSubForm(this.props.field_name,this,this.getRegisterSubFormOptions());
    }
    /**
     * 注册子表单到父表单参数,不做操作
     */
    getRegisterSubFormOptions(){
        return {
            asyncSave: true, //是否是同时保存主子表，如果为true,则子表单类必须实现getFormValues接口,如果为false,则实现onSave接口
            onValidate:"onValidate", //如果默认的onValidate与类有冲突时，可以使用自定义名称替换onValidate函数
        }
    }

    /**
     * 校验接口,提供给父表单保存前校验时调用
     * @param callback 交验后回调
     */
    onValidate(options,callback){
        callback(null, null);//不做检验
    }

    getHeader = () => {
        return [
            {
                title: '合同编号', dataIndex: 'contract_code', key: 'contract_code',
            },
            {
                title: '合同名称', dataIndex: 'contract_name', key: 'contract_name',
            },
            {
                title: '合同签订日期', dataIndex: 'contract_sign_date', key: 'contract_sign_date',
            },
            // {
            //     title: '合同金额', dataIndex: 'contract_amount', key: 'contract_amount',
            // },
            {
                title: '合同供应商', dataIndex: 'supplier_name', key: 'supplier_name',
            },
            {
                title: '对应系统', dataIndex: 'system_name', key: 'system_name',
            }
        ];
    }

    getHeader1 = () => {
        return [
            {
                title: '订单编号', dataIndex: 'apply_code', key: 'contract_code',
            },
            {
                title: '订单名称', dataIndex: 'apply_name', key: 'contract_name',
            },
            // {
            //     title: '金额', dataIndex: 'apply_amount', key: 'contract_sign_date',
            // },
            {
                title: '供应商', dataIndex: 'supplier_name', key: 'contract_amount',
            },
            {
                title: '申请开始时间', dataIndex: 'tba_starttime', key: 'supplier_name',
            },
            {
                title: '申请结束时间', dataIndex: 'tba_endtime', key: 'supplier_name',
            },
            {
                title: '对应系统', dataIndex: 'system_name', key: 'system_name',
            }
        ];
    }

    getQueryParams = () => {
        const params = {
            iid:this.props.iid,
            ientityid:this.props.ientityid,
            piid:this.props.piid,
            taskid:this.props.taskid
        }
        return params;
    }

    controlAddButton = (numPerPage, resultList) => {
        let theight = vp.computedHeight(resultList.length,'.xmhtSubForm')-50
        this.setState({
            tableHeight: theight
        })
    }

    showModal = () => {
        this.setState({
            visible:true
        })
    }

    showModal1 = () => {
        this.setState({
            visible1:true
        })
    }

    // 附件批量下载
    fileDownload = () => {
        let _this = this
        let taskid = _this.props.taskid;
        console.log('taskid', taskid);
        vpDownLoad('/{bjyh}/pcl/downloadZipFiles2', {
            taskid: taskid
        }).then((res) => {
            console.log(res)
        });
    }

    handleCancel = () => {
        this.setState({
            visible:false
        })
    }

    handleCancel1 = () => {
        this.setState({
            visible1:false
        })
    }

    render(){
        return (
            <div>
            {!this.parentForm.props.isHistory?
            (<div style={{height:40,marginLeft: 20}}>
            <VpButton type="primary" onClick={this.showModal} id="hetongbut">
                项目合同
            </VpButton>
            <VpButton type="primary" onClick={this.showModal1} id="dingdanbut">
                项目订单
            </VpButton>
            <VpButton type="primary" onClick={this.fileDownload} >
                批量下载所有上传文档
            </VpButton>
            </div>)
            :null}
            { this.state.visible ?
            <VpModal title="项目合同"
                width={"70%"}
                visible={this.state.visible}
                onOk={this.handleCancel}
                onCancel={this.handleCancel} >
                    <div className={"pr full-height"} >
                        {/* <div style={{ marginLeft: 20, marginRight: 20 }} > */}
                        <VpTable
                            className={"xmhtSubForm"}
                            columns={this.getHeader()}
                            dataUrl={"/{bjyh}/contract/getXmhtByDyxt"}
                            params={this.getQueryParams()}
                            controlAddButton={
                                (numPerPage, resultList) => {
                                    this.controlAddButton(numPerPage, resultList)
                                }
                            }
                            scroll={{y:this.state.tableHeight}}
                            size='small'
                            pagination={false}
                            bordered={true}
                            resize
                        />
                        {/* </div> */}
                    </div>
            </VpModal>
            :null }

           { this.state.visible1 ?
            <VpModal title="项目订单"
                width={"70%"}
                visible={this.state.visible1}
                onOk={this.handleCancel1}
                onCancel={this.handleCancel1} >
                    <div className={"pr full-height"} >
                        {/* <div style={{ marginLeft: 20, marginRight: 20 }} > */}
                        <VpTable
                            className={"xmhtSubForm"}
                            columns={this.getHeader1()}
                            dataUrl={"/{bjyh}/contract/getXmddByDyxt"}
                            params={this.getQueryParams()}
                            controlAddButton={
                                (numPerPage, resultList) => {
                                    this.controlAddButton(numPerPage, resultList)
                                }
                            }
                            scroll={{y:this.state.tableHeight}}
                            size='small'
                            pagination={false}
                            bordered={true}
                            resize
                        />
                        {/* </div> */}
                    </div>
            </VpModal>
            :null }
            </div>
        )
    }
}

export default xmhtSubForm;