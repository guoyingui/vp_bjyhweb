import React,{Component} from 'react';
import {VpIframe,VpTooltip,VpIcon,VpTabs,VpTabPane,VpAlertMsg,vpQuery ,VpFormCreate} from 'vpreact';
import {RightBox} from 'vpbusiness';
import Form from '../Form/Form';
import {formDataToWidgetProps} from '../Form/Widgets';
import FlowForm from "../../../templates/dynamic/Flow/FlowForm";
import {requireFile } from 'utils/utils'
import './index.less';

/**
 * 流程图
 */
class ProcessDiagram extends Component{

    /**
     *
     * @param props {
     *     pdid: '', 流程定义id,
     *     piid: '', //流程实例id
     * }
     */
    constructor(props){
        super(props);
        this.state = {
            stepFlag:false  //是否显示步骤弹出框
        }

        window.flowtabs = this; //将流程tab暴露出去，流程图跳转时通过parent.window.flowtabs.iframeClick调用
    }


    /**
     * 流程图被点击时触发
     * @param taskId
     * @param piId
     * @param iobjectentityid
     * @param iobjectid
     * @param formkey
     * @param iflowentityid
     * @param stepkey
     */
    iframeClick = (taskId, piId, iobjectentityid, iobjectid, formkey, iflowentityid, stepkey) => {
        if (taskId == '') {
            VpAlertMsg({
                message: "消息提示",
                description: '没有该节点表单信息！',
                type: "error",
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 5)
            return;
        }
        let _this = this
        vpQuery('/{vpflow}/rest/flowentity/getform', {
            entityid: iflowentityid,
            iobjectentityid: iobjectentityid,
            iobjectid: iobjectid,
            piid: piId,
            staskid: taskId,
            stepkey: stepkey,
            formcode: formkey,
            isHistory: true,
        }).then((response) => {
            let formurl = response.data.formurl; //表单url
            let flowtabs_array = response.data.flowtabs_array; //表单标签
            let data = response.data
            _this.setState({
                formData:data,
                flowtabs_array,//显示的tab页签
                stepFlag: true,
                formurl,
                entityid: iflowentityid,
                iobjectentityid: iobjectentityid,
                iobjectid: iobjectid,
                piid: piId,
                staskid: taskId
            });

        })
    }

    //流程图节点表单
    stepForm = () => {
        const _this = this
        let formurl = this.state.formurl
        let FormModal = FlowForm;
        if (formurl != '' && formurl != undefined) {
            FormModal = requireFile(formurl)|| FlowForm
        }

        return (
            <VpTabs defaultActiveKey="0">
                <VpTabPane tab='流程表单' key={0}>
                    <FormModal 
                        formData={this.state.formData}
                        className="p-sm full-height scroll p-b-xxlg"
                        buttons={["cancel"]}
                        tablePagination={false}
                        closeRight={this.handleStepCancel} 
                        isHistory={true}
                        entityid= {this.state.entityid}
                        iobjectentityid= {this.state.iobjectentityid}
                        iobjectid= {this.state.iobjectid}
                        piid= {this.state.piid}
                        staskid= {this.state.staskid}
                        assessid={ this.props.assessid}
                        />
                </VpTabPane>
            </VpTabs>
        );
    }

    handleStepCancel = () => {
        this.closeRightModal();
    }

    closeRightModal = () => {
        this.setState({
            stepFlag: false
        });
    }

    render() {
        return (
            <span>
                <VpIframe url={getFlowPagePath() + '/diagram-viewer/index.html?processDefinitionId=' + this.props.pdid + '&processInstanceId=' + this.props.piid} />
                <RightBox
                    button={
                        <div className="icon p-xs" onClick={this.closeRightModal}>
                            <VpTooltip placement="top" title=''>
                                <VpIcon type="right" />
                            </VpTooltip>
                        </div>}
                    show={this.state.stepFlag}>
                    {this.state.stepFlag ? this.stepForm() : null}
                </RightBox>
            </span>
        )
    }
}
/**
 * 方便二次开发人员继承用
 * 二次开发时,先申明类，并继承XX.Component,然后再调用xx.createClass,
 * 例子：
 * class CustomComponent extends ProcessDiagram.Component {
 *
 * }
 * CustomComponent = ProcessDiagram.createClass(CustomComponent);
 * @param newClass
 */
let createClass = function(newClass){
    //let wrapClass = connect(mapStateToProps,mapToDispatchToProps)(newClass);
    let wrapClass = VpFormCreate(newClass);
    wrapClass.Component = newClass;
    wrapClass.createClass = createClass;
    return wrapClass;
}
export default createClass(ProcessDiagram);