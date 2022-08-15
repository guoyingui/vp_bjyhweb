import React, { Component } from 'react'
import {VpIcon, vpQuery, VpTooltip} from "vpreact";
import {RightBox} from "vpbusiness";
import {connect} from 'react-redux';
import {changeQueryParams} from 'reduxs/actions/action';
import StartFlow from './startflow';
import Flowtabs from './FlowHandler';

export default class FirstFlow extends Component {
    constructor(props) {
        super(props)
        this.state ={
            showRightBox:false,
            startflow:true
        }
        this.closeRightBox = this.closeRightBox.bind(this);
    }
    closeRight = (msg) =>{
        this.setState({
            showRightBox: msg,
            staskid: ''
        })
        this.props.refreshFormData('saveAndFlow');
        this.props.destoryDom('startflow');
    }
    closeRightBox(){
        this.setState({ showRightBox: false})
        this.props.destoryDom('startflow');
    }
    //销毁发起流程DOM
    destoryDom = (record) => {
        this.setState({ startflow: false })
        if (record == undefined){
            this.props.destoryDom('startflow');
            return
        }
        vpQuery('/{vpflow}/rest/process/activitytask', {
            piId: record.piId
        }).then((response) => {
            this.setState({
                showRightBox: true,
                modaltitle: record.sname,
                record: record,
                staskid: response.data.taskId,
                usermode: response.data.usermode == 2 ? false : true,
                formkey: response.data.formkey || ''
            })
        })
    }
    render() {
        return (
            <div style={{display:'inline-block'}} className="text-left" >{/*加text-left样式是为了抵消父div中有text-right样式*/}
                <RightBox
                    max={true}
                    button={
                        <div className="icon p-xs" onClick={this.closeRightBox}>
                            <VpTooltip placement="top" title=''>
                                <VpIcon type="right" />
                            </VpTooltip>
                        </div>}
                    show={this.state.showRightBox}>
                    {this.state.showRightBox ?
                        <Flowtabs
                            activityName={this.state.record.activityName}
                            usermode={this.state.usermode}
                            staskid={this.state.staskid}
                            formkey={this.state.formkey}
                            iobjectentityid={this.props.entityid}
                            iobjectid={this.props.iid}
                            stepkey={this.state.record.activityId}
                            piid={this.state.record.piId}
                            pdid={this.state.record.pdId}
                            entityid={this.state.record.iflowentityid}
                            endTime={this.state.record.endTime}
                            closeRight={msg => this.closeRight(msg)}
                            getData={this.props.refreshFormData}
                        /> : null}
                </RightBox>
                {
                    this.state.startflow ?
                        <StartFlow
                            entityid={this.props.entityid}
                            iid={this.props.iid}
                            refreshFormData={this.props.refreshFormData}
                            destoryDom={(record) => this.destoryDom(record)}
                        />
                        : ''
                }
            </div>
        )
    }
}
