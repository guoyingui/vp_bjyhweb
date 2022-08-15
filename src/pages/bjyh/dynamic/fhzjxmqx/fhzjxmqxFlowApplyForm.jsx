import React,{Component} from 'react';
import FlowListTab from '../../../templates/dynamic/Flow/FlowListTab';
import {VpConfirm, VpAlertMsg, vpQuery, VpMSuccess, VpModal, VpInput, vpAdd} from "vpreact";


//分行自建项目取消--流程--发起
class CustomFlowListTabTable extends FlowListTab.Table.Component{
    constructor(props){
        super(props);
        this.state.visible=false
    }

    handleStop(e,record){
        e.stopPropagation()
        let _this = this
        if (record.pdId.startsWith('fhzjxmqx')) {
            e.stopPropagation()
            let param = { pdId: record.pdId, piId: record.piId }
            vpQuery('/{vpflow}/rest/process/end-process', {
                ...param
            }).then((response) => {
                _this.reloadTable();
            })
        } else {
            vpQuery('/{bjyh}/fhzjxmqx/queryDesignatedNodeIsExist', {
                entityId: record.piId
            }).then((response) => {
                // 经过指定节点（pmo审核）需发起取消流程
                if (response.data) {
                    console.log("发起取消流程----------")
                    VpConfirm({
                        title: '分行项目申请已到项目经理，不可强行终止，是否发起【分行自建项目取消】流程？',
                        onOk() {
                            vpQuery('/{vpflow}/rest/process/start-process',{ // 发起分行自建项目取消流程
                                skey:'fhzjxmqx',
                                ientityid: _this.props.entityid,
                                iobjectid : _this.props.iid
                            }).then((response)=>{

                                if(response.data == undefined){
                                    VpAlertMsg({
                                        message:"消息提示",
                                        description:response.msg,
                                        type:"error",
                                        closeText:"关闭",
                                        showIcon: true
                                    }, 5);
                                    return
                                }
                                VpAlertMsg({
                                    message:"消息提示",
                                    description:'流程发起成功！',
                                    type:"success",
                                    closeText:"关闭",
                                    showIcon: true
                                }, 5)
                                _this.reloadTable() // 流程发起成功刷新列表
                                let record =  response.data.record
                                let piId = record.piId
                                // 跳转至流程提交节点
                                vpQuery('/{vpflow}/rest/process/activitytask', {
                                    piId: piId
                                }).then((response) => {
                                    _this.setState({
                                        showRightBox: true,
                                        modaltitle: record.sname,
                                        record: record,
                                        staskid: response.data.taskId,
                                        usermode: response.data.usermode == 2 ? false : true,
                                        formkey: response.data.formkey || ''
                                    })
                                })
                            })
                        },
                        onCancel(){}
                    })
                } else { // 未经过指定节点（pmo审核）直接终止流程
                    this.forceStopFlow(e, record)

                    // VpConfirm({
                    //     title: '分行项目申请未到项目经理，可强行终止，请输入终止原因！',
                    //     onOk() {
                    //         alert(1)
                    //     },
                    //     onCancel(){
                    //         alert(2)
                    //     }
                    //
                    // })
                    // e.stopPropagation()
                    // let param = { pdId: record.pdId, piId: record.piId }
                    // vpQuery('/{vpflow}/rest/process/end-process', {
                    //     ...param
                    // }).then((response) => {
                    //     this.reloadTable();
                    // })
                    // VpMSuccess({
                    //     title: '这是一条成功通知',
                    //     content: '流程已终止~'
                    // })
                    // return false
                }
            })
        }
    }

    forceStopFlow = (e, record) => {
        console.log('rEcOd...',record);
        e.stopPropagation();
        this.setState({
            visible:true,
            stopRecord:record
        })
    }

    sReason =(e,s)=>{
        this.setState({reason:e.target.value})
    }

    /**
     * 操作模态框
     */
    handleOk = () => {
        if(!this.state.reason){
            VpAlertMsg({
                message: "提示",
                description: '请填写终止原因',
                type: "warning",
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 3)
            return
        }
        this.setState({visible: false});
        let param = {pdId:this.state.stopRecord.pdId, piId:this.state.stopRecord.piId }
        vpQuery('/{vpflow}/rest/process/end-process', {
            ...param
        }).then((response) => {
            this.reloadTable();
        })

        vpQuery('/{bjyh}/fhzjxmsq/getDesignatedNodeHandlers', {
            flowId: this.state.stopRecord.piId
        }).then((res) => {
            vpQuery('/{vpplat}/vfrm/api/sendmail', {
                title: '分行自建项目申请流程终止',
                content: res.data.flowEntityName + this.state.reason,
                receiver: res.data.semail
            }).then((res1) => {
                console.log('发送终止邮件【给pmo节点及之前的所有处理人发送邮件】')
            })
        })
    }
    handleCancel = () => {
        console.log('点击了取消');
        this.setState({
            visible: false,
        });
    }
    render(){
        return(
            <div>
                {super.render()}
                <VpModal title="分行项目申请未到项目经理，可强行终止" height={350}
                         visible={this.state.visible}
                         onOk={this.handleOk}
                         confirmLoading={this.state.confirmLoading||false}
                         onCancel={this.handleCancel} >

                    <label>请输入强行终止原因:</label>
                    <VpInput type='textarea' rows={4} maxLength={2000}
                             value={this.state.reason||''}
                             onChange={(e) => this.sReason(e,'reason')}>
                    </VpInput>
                </VpModal>
            </div>
        )
    }




}
CustomFlowListTabTable = FlowListTab.Table.createClass(CustomFlowListTabTable);
/**
 * 实体详情页流程列表页面
 */
class CustomFlowListTab extends FlowListTab.Component{

    constructor(props) {
        super(props);
    }

    /**
     * 渲染列表
     * @returns {*}
     */
    renderNormalTable(props){
        return <CustomFlowListTabTable  {...props} iid={this.props.iid} flowRole={this.state.flowRole} />;
    }

}
CustomFlowListTab = FlowListTab.createClass(CustomFlowListTab);
export default CustomFlowListTab;