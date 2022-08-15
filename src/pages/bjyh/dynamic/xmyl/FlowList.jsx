import React, { Component } from 'react'
import FlowListTab from '../../../templates/dynamic/Flow/FlowListTab'
class CustomFlowListTab extends FlowListTab.Component{
    constructor(props) {
        super(props);
    }
    /**
     * 配置信息，表头、过滤器
     */
     getConfig(){
        const filterData = {
            filters:[{ name: '全部', value: '-1' }, { name: '运行中', value: '0' }, { name: '终止', value: '1' }, { name: '已完成', value: '2' }]
        }
        this.setState({
            filterData,
        });
    }
    getCustomeButtons(){
        return []
    }
    /**
     * 渲染列表
     * @returns {*}
     */
     renderNormalTable(props){
        return <CustomFlowListTabTable  {...props} iid={this.props.iid} rowData={this.props.rowData}
        flowRole={this.state.flowRole} onStopFlowSuccess={this.onStopFlowSuccess}
        closeRightModal={this.props.closeRightModal}
        />;
    }
}
CustomFlowListTab=FlowListTab.createClass(CustomFlowListTab)
class CustomFlowListTabTable extends FlowListTab.Table.Component{
    constructor(props) {
        super(props);
    }
    getCustomTableOptions(){
        return {
            dataUrl:'/{bjyh}/xqyl/getRelFlowList'
        }
    }
    getQueryParams(){
        console.log(this.props.rowData)
        let {quickSearch:quickvalue,filtervalue,_k} = this.props.queryParams || {};
        return {
            quickvalue,
            filtervalue,
            iobjectid: 22,//主实体iid
            caseid:this.props.rowData.caseId,
            _k
        }
    }
}
CustomFlowListTabTable=FlowListTab.Table.createClass(CustomFlowListTabTable)
export default CustomFlowListTab