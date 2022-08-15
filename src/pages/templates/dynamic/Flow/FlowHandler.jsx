import React,{Component} from 'react';

import {
    VpFormCreate,
    VpInput,
    VpForm,
    VpRow,
    VpCol,
    VpFCollapse,
    VpPanel,
    FormItem,
    VpButton,
    vpQuery,
    VpSpin,
    VpTabs,
    VpTabPane,
    VpIframe,
    VpTable
} from 'vpreact';

import {requireFile } from 'utils/utils';
import {connect} from 'react-redux';
import {NotFind} from "vplat";
import FlowForm from "./FlowForm";
import ProcessDiagram from './ProcessDiagram';
import ProcessStepHistory from './ProcessStepHistory';
import {formDataToWidgetProps} from "../Form/Widgets";

/**
 * 流程处理页面
 */
class FlowHandler extends Component{
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
        vpQuery('/{vpflow}/rest/flowentity/getform', { entityid, iobjectentityid, iobjectid, piid, staskid, stepkey })
            .then(function (response) {
                let formurl = response.data.formurl; //表单url
                let flowtabs_array = response.data.flowtabs_array; //表单标签
                let data = response.data;
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
         let formurl = this.state.formurl
         let FormModal = FlowForm;
         if (formurl != '' && formurl != undefined) {
             FormModal = requireFile(formurl)|| NotFind
         }
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
                                        <VpTabPane tab={item.sname} key={index}>
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
                                                    assessid={this.props.assessid}
                                                />
                                            </div>
                                        </VpTabPane>
                                    )
                                }else if(item.skey == 'flow_log'){
                                    return (
                                        <VpTabPane tab={item.sname} key={index}>
                                            <ProcessStepHistory
                                                {...this.props}
                                                piid={this.props.piid}
                                             />
                                        </VpTabPane>
                                    )
                                }else{
                                    return <VpTabPane tab='没有配置' key='0'></VpTabPane>
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
export default createClass(FlowHandler);