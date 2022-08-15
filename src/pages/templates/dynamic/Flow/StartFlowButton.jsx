import React,{Component} from 'react';
import {VpButton, VpIcon, vpQuery, VpTooltip} from "vpreact";
import {RightBox} from "vpbusiness";
import {connect} from 'react-redux';
import {changeQueryParams} from 'reduxs/actions/action';
import StartFlow from './startflow';
import Flowtabs from './FlowHandler';


/**
 * 启动流程按钮
 */
class StartFlowButton extends Component {
    constructor(props) {
        super(props);
        this.state ={
            showRightBox:false,
        }
        this.onClick = this.onClick.bind(this);
        this.refreshFormData = this.refreshFormData.bind(this);
        this.closeRightBox = this.closeRightBox.bind(this);
    }

    onClick(e){
        this.setState({ startflow: true })
    }

    refreshFormData(){
        this.changeQueryParams({
            _k:new Date().getTime()
        });
    }

    changeQueryParams(queryParams){
        this.props.changeQueryParams && this.props.changeQueryParams(this.props._contextid,queryParams);
    }

    //销毁发起流程DOM
    destoryDom = (record) => {
        this.setState({ startflow: false })
        if (record == undefined)
            return
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

    closeRightBox(){
        this.setState({ showRightBox: false, })
    }

    closeRight = (msg) => {
        this.setState({
            showRightBox: msg,
            staskid: ''
        })
        this.refreshFormData();
    }

    render() {
        return (
            <div style={{display:'inline-block'}} className="text-left" >{/*加text-left样式是为了抵消父div中有text-right样式*/}
                <VpButton type="primary" shape="circle" icon="plus" onClick={this.onClick}></VpButton>
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
                            getData={this.refreshFormData}
                        /> : null}
                </RightBox>
                {
                    this.state.startflow ?
                        <StartFlow
                            entityid={this.props.entityid}
                            iid={this.props.iid}
                            refreshFormData={this.refreshFormData}
                            destoryDom={(record) => this.destoryDom(record)}
                        />
                        : ''
                }
            </div>
        )
    }
}

function mapStateToProps(state,ownProps){
    return {
    }
}



function mapToDispatchToProps(dispatch,ownProps){
    return {
        changeQueryParams:function(_contextid,queryParams){
            dispatch(changeQueryParams(_contextid,queryParams));
        }
    }
}

/**
 * 方便二次开发人员继承用
 * 二次开发时,先申明类，并继承XX.Component,然后再调用xx.createClass,
 * 例子：
 * class CustomComponent extends XX.Component {
 *
 * }
 * CustomComponent = XX.createClass(CustomComponent);
 * @param newClass
 */
let createClass = function(newClass){
    let wrapClass = connect(mapStateToProps,mapToDispatchToProps)(newClass);
    wrapClass.Component = newClass;
    wrapClass.createClass = createClass;
    return wrapClass;
}
export default createClass(StartFlowButton);