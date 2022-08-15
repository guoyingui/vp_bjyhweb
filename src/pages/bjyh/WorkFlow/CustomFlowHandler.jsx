import React, { Component } from 'react';

import { VpAlertMsg, VpIcon, vpQuery, VpTooltip, VpIconFont } from "vpreact";
import FlowHandler from "../../templates/dynamic/Flow/FlowHandler";
import { menuEntryWrap } from "../../templates/dynamic/utils";
import { RightBox } from "vpbusiness";
import HistoryFlowHandler from "./HistoryFlowHandler";
import './index.less';

/**
 *
 */
class CustomFlowHandler extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isHistoryTask: false,
            show: true
        }
    }

    componentDidMount() {
        this.loadTaskInfo(this.props.taskId, this.props.assessid);
        console.log(this.props.taskId);
        console.log(this.props.assessid);
        console.log(1);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.taskId != this.props.taskId) {
            this.loadTaskInfo(nextProps.taskId, this.props.assessid);
            console.log(2);
        }
    }

    //加载节点信息
    loadTaskInfo(taskId, assessid) {
        let that = this
        vpQuery('/{vpflow}/rest/process/task-info_assess', {
            taskId: taskId, assessid: assessid
        }).then((response) => {
            if (response.data == undefined) {
                that.loadHistoryTaskInfo(taskId, response.msg);
                // VpAlertMsg({
                //     message: "消息提示",
                //     description: response.msg,
                //     type: "error",
                //     onClose: this.onClose,
                //     closeText: "关闭",
                //     showIcon: true
                // }, 5)
                // return
            } else {
                let data = response.data
                that.setTaskData(data, false);
            }
        })
    }

    //加载已处理的节点信息
    loadHistoryTaskInfo(taskId, msg) {
        let that = this
        vpQuery('/{vpflow}/foticflow/entity/history-task-info', {
            taskId
        }).then((response) => {
            if (response.data == undefined) {
                VpAlertMsg({
                    message: "消息提示",
                    description: response.msg || msg,
                    type: "error",
                    onClose: this.onClose,
                    closeText: "关闭",
                    showIcon: true
                }, 5)
                return
            }
            let data = response.data
            that.setTaskData(data, true);
        })
    }

    //节点信息赋值
    setTaskData(data, isHistoryTaskFlag) {
        this.setState({
            showRightBox: true,
            record: data.record,
            staskid: data.taskId,
            operrole: data.operrole,//操作权限
            flowiid: data.objectId,
            // usermode: data.usermode == 2 ? false : true,
            usermode: true,
            flowentityid: data.entityId,
            activityName: data.activityName,
            isHistoryTask: isHistoryTaskFlag
        })
    }

    addNewDom = () => {
        let record = this.state.record
        return (
            this.state.isHistoryTask ?
                <HistoryFlowHandler
                    activityName={record.activityName}
                    usermode={this.state.usermode}
                    stepkey={record.activityId}
                    staskid={this.state.staskid}
                    piid={record.piId}
                    pdid={record.pdId}
                    iobjectentityid={this.state.flowentityid}
                    iobjectid={this.state.flowiid}
                    entityid={record.iflowentityid}
                    endTime={record.endTime}
                    operrole={this.state.operrole}
                    closeRight={() => this.closeRightModal()}
                />
                :
                <FlowHandler
                    activityName={this.state.activityName}
                    usermode={this.state.usermode}
                    stepkey={record.activityId}
                    staskid={this.state.staskid}
                    piid={record.piId}
                    pdid={record.pdId}
                    iobjectentityid={this.state.flowentityid}
                    iobjectid={this.state.flowiid}
                    entityid={record.iflowentityid}
                    endTime={record.endTime}
                    assessid={this.props.assessid}
                    operrole={this.state.operrole}
                    closeRight={() => this.closeRightModal()}
                />
        )
    }

    closeRightModal = () => {
        window.location.replace("");
    }
    closeRightBox = () => {
        window.location.replace("");
    }
    render() {
        let record = this.state.record
        if (!record) {
            return null;
        }
        return (
            <div>
                <RightBox
                    className="custom-flow-handler-right-box-max"
                    max={true}
                    button={
                        <div className="icon p-xs" onClick={this.closeRightBox}>
                            <VpTooltip placement="top" title=''>
                                <VpIcon type="right" />
                            </VpTooltip>
                        </div>}
                    tips={
                        <div className="tips p-xs">
                            <VpTooltip placement="top" title="0000">
                                <VpIcon type="exclamation-circle text-muted m-r-xs" />
                            </VpTooltip>
                        </div>
                    }
                    show={this.state.showRightBox}>
                    {this.state.showRightBox ? this.addNewDom() : null}
                </RightBox>
            </div>
        )
    }
}

export default menuEntryWrap(CustomFlowHandler);