import React,{Component} from 'react';

import {
    VpFormCreate,
    vpQuery,
    VpSpin,
    VpTabs,
    VpTabPane,
} from 'vpreact';

import {connect} from 'react-redux';
import FlowForm from "./HistroyFlowForm";
import ProcessDiagram from '../../templates/dynamic/Flow/ProcessDiagram';
import ProcessStepHistory from '../../templates/dynamic/Flow/ProcessStepHistory';


/**
 * 流程处理页面（已处理节点使用，固定使用只有取消按钮的flowfrom表单的）
 */
class HistoryFlowHandler extends Component{
    constructor(props){
        super(props);
        this.state = {
            flowtabs_array:[],
            spinning:false
        }
    }

    componentWillMount(){
        this.loadFormData();
    }
    componentWillReceiveProps(nextProps, nextContext) {
    }

    /**
     * 加载表单数据
     */
    loadFormData(){
        let { entityid, iobjectentityid, iobjectid, piid, staskid, stepkey } = this.props;
        let _this = this;
        vpQuery('/{vpflow}/cust/flowentity/getform', { entityid, iobjectentityid, iobjectid, piid, staskid, stepkey, isHistory:true })
            .then(function (response) {
                let formurl = response.data.formurl; //表单url
                let flowtabs_array = response.data.flowtabs_array; //表单标签
                let data = response.data
                _this.setState({
                    formData:data,
                    flowtabs_array,//显示的tab页签
                    ijump: data.ijump=='0'?true:false,
                    formurl,
                });
            });
    }

    /**
     * 渲染流程表单tab
     * @private
     */
    _renderFlowForm(){
        const _this = this
        let formProps = {
            ...this.props,
            formData:this.state.formData,
        }
        return (
            <div className="form-edit-table full-height bg-white scroll-y">
                {this.renderFlowForm(formProps)}
            </div>
        )
    }

    renderFlowForm(props){
         //let formurl = this.state.formurl
         let FormModal = FlowForm;//只用于查看已处理节点的信息，默认固定使用只有取消按钮的表单
        //  if (formurl != '' && formurl != undefined) {
        //      FormModal = requireFile(formurl)|| NotFind
        //  }
        return (
            <FormModal {...props} />
        )
      }

    render(){
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 16 },
        };
        const { getFieldProps } = this.props.form;
        if (this.state.flowtabs_array.length == 0)
            return (<div></div>);
        return (
            <VpSpin spinning={this.state.spinning} size="large">
                <div className="flowtabs workflow full-height">
                    <VpTabs defaultActiveKey="0" onChange={this.tabsChange}>
                        {
                            this.state.flowtabs_array.map((item,index) => {
                                if (item.skey == 'flow_step') {
                                    return (
                                        <VpTabPane tab={this.props.activityName||item.sname} key={index}>
                                            {this._renderFlowForm()}
                                        </VpTabPane>
                                    )
                                }else if(item.skey == 'flow_diagram'){
                                    return (
                                        <VpTabPane tab={item.sname} key={index}>
                                            <div style={{ height: "100%" }}>
                                                <ProcessDiagram
                                                    pdid={this.props.pdid}
                                                    piid={this.props.piid}
                                                />
                                            </div>
                                        </VpTabPane>
                                    )
                                }else if(item.skey == 'flow_log'){
                                    return (
                                        <VpTabPane tab={item.sname} key={index}>
                                            <div className="full-height bg-white scroll-y">
                                                <ProcessStepHistory
                                                    piid={this.props.piid}
                                                />
                                            </div>
                                        </VpTabPane>
                                    )
                                }else if(item.skey == 'flow_approvallog'){
                                    //审批意见，只显示领导的审批意见
                                    return (
                                        <VpTabPane tab={item.sname} key={index}>
                                            <div className="full-height bg-white scroll-y">
                                            </div>
                                        </VpTabPane>
                                    )
                                }else{
                                    return <VpTabPane tab='没有配置' key={index}></VpTabPane>
                                }
                            })
                        }
                    </VpTabs>
                </div>
            </VpSpin>
        )
    }
}



function mapStateToProps(state,ownProps){
    return {
    }
}

function mapToDispatchToProps(dispatch,ownProps){
    return {
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
 */
let createClass = function(newClass){
    let wrapClass = VpFormCreate(connect(mapStateToProps,mapToDispatchToProps)(newClass));
    wrapClass.Component = newClass;
    wrapClass.createClass = createClass;
    return wrapClass;
}
export default createClass(HistoryFlowHandler);