import React,{Component} from 'react';
import {vpQuery,VpTable, VpTooltip, VpIcon, VpTabPane, VpTabs } from 'vpreact';
import {RightBox} from 'vpbusiness';

import FlowForm from "../../../templates/dynamic/Flow/FlowForm";
import {requireFile } from 'utils/utils'
/**
 * 流程历史步骤
 */
class ProcessStepHistory extends Component{

    /**
     *
     * @param props{
     *     piid: '' //流程实例id
     * }
     */
    constructor(props){
        super(props);

        this.state = {
            history_headers:[],
            history_array:[],
            scrollHeight:600,
            showRightBox: false,
        }
    }

    componentWillMount() {
        this.loadHeader();
        this.loadData();
    }

    loadHeader(){
        let history_headers = [
            { title: '操作人', dataIndex: 'user', key: 'user', },
            { title: '操作类型', dataIndex: 'type', key: 'type', },
            { title: '流程/步骤', dataIndex: 'taskName', key: 'taskName', },
            { title: '操作时间', dataIndex: 'endTime', key: 'endTime', width: 160 },
            { title: '审批结果', dataIndex: 'msg1', key: 'msg1', },
            { title: '审批意见', dataIndex: 'msg2', key: 'msg2', },
        ];
        this.setState({
            history_headers
        })
    }

    loadData(){
        vpQuery('/{vpflow}/rest/process/history', {
            piId: this.props.piid
        }).then((response) => {
            this.setState({ history_array: response.data })
        })
    }
    
    onRowClick = (record) => {       
        let _this = this
        const {taskId, stepkey} = record
        const {entityid, iobjectentityid, iobjectid, piid} = this.props
        vpQuery('/{vpflow}/rest/flowentity/getform', {
            entityid: entityid,
            iobjectentityid: iobjectentityid,
            iobjectid: iobjectid,
            piid: piid,
            staskid: taskId,
            stepkey: stepkey,
            isHistory: true,
        }).then((response) => {
            let formurl = response.data.formurl; //表单url
            let data = response.data
            _this.setState({
                formData:data,
                formurl,
                entityid, 
                iobjectentityid, 
                iobjectid, 
                piid,
                showRightBox: true
            });
        })
    }

    historyForm = () => {
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
            showRightBox: false
        });
    }

    render() {
        return (
            <div>
                <VpTable
                    useFixedHeader={true}
                    columns={this.state.history_headers}
                    dataSource={this.state.history_array}
                    onRowClick={this.onRowClick}
                    resize
                />
                <RightBox
                    button={
                        <div className="icon p-xs" onClick={this.closeRightModal}>
                            <VpTooltip placement="top" title=''>
                                <VpIcon type="right" />
                            </VpTooltip>
                        </div>}
                    show={this.state.showRightBox}>
                    {this.state.showRightBox ? this.historyForm() : ''}
                </RightBox>
            </div>
        )
    }
}

/**
 * 方便二次开发人员继承用
 * 二次开发时,先申明类，并继承XX.Component,然后再调用xx.createClass,
 * 例子：
 * class CustomComponent extends ProcessStepHistory.Component {
 *
 * }
 * CustomComponent = ProcessStepHistory.createClass(CustomComponent);
 * @param newClass
 */
let createClass = function(newClass){
    //let wrapClass = connect(mapStateToProps,mapToDispatchToProps)(newClass);
    let wrapClass = newClass;
    wrapClass.Component = newClass;
    wrapClass.createClass = createClass;
    return wrapClass;
}
export default createClass(ProcessStepHistory);