import React, { Component } from 'react'
import RelationList from '../../../templates/dynamic/List/RelationList'
import {VpIcon, VpIconFont, VpInput, VpTable, VpTooltip, VpWidgetGroup} from "vpreact";
import {EditTableCol} from "vpbusiness";
import {odssjxf} from "../code";

const RelationListEntityList = RelationList.List; //关联组件中列表组件
const RelationListNormalTable = RelationList.List.NormalTable; //关联组件中列表中表格组件

class CustomRelationListNormalTable extends  RelationListNormalTable.Component{
    getDefaultOperationColButtons(){
        return [];
    }
    getCustomTableOptions(){
        return {
            controlAddButton:null,
            onRowClick:null
        }
    }
    onLoadHeaderSuccess(header){
        header.splice(header.length-1,1);
    }
}
CustomRelationListNormalTable = RelationListNormalTable.createClass(CustomRelationListNormalTable);


class CustomRelationListList extends  RelationListEntityList.Component{
    getCustomeButtons(){
        return [];
    }
    //是否显示搜索
    showSearchInput(){
        return false;
    }
    renderNormalTable(props){
        return (
            <CustomRelationListNormalTable {...props} />
        )
    }
}
CustomRelationListList = RelationListEntityList.createClass(CustomRelationListList);


class CustomRelationList extends  RelationList.Component{
    renderList(props){
        return <CustomRelationListList {...props} showTopBar={false} style={{height:"34%"}}/>;
    }
}
CustomRelationList = RelationList.createClass(CustomRelationList);


export default class XmhtList extends Component{
    constructor(props){
        super(props);
        this.state = {
            tableDataFir: {
                contract_code: '',
                contract_name: '',
                contract_sign_date: '',
                contract_amount: '',
                supplier_name: ''
            },
        }
    }

    componentWillMount() {
        this.getFirstHeader();
        this.getSecondHeader();
        this.getThirdHeader();
    }

    getDataUrl = (flag) => {
        switch (flag) {
            case 1: return '/{bjyh}/contract/getContractInfoByProjectIdOne'
                break
            case 2: return '/{bjyh}/contract/getContractInfoByProjectIdTwo'
                break
            case 3: return '/{bjyh}/contract/getContractInfoByProjectIdThree'
                break
        }
    }

    controlAddButton = (numPerPage, resultList) => {
        console.log(numPerPage,resultList);
        this.state.tableRowData = resultList;
        this.state.number += resultList.length;
        this.state.save_number = resultList.length;
    }

    getQueryParams = () => {
        return {
            projectId: this.props.iid
        };
    }

    getFirstHeader = () => {
        let _this = this;
        let _headerNew =
            [
                {
                    title: '合同编号', dataIndex: 'contract_code', key: 'contract_code',
                    render: (text, record) => {
                        return <div style={{whiteSpace: 'normal'}}>{text}</div>
                    }
                },
                {
                    title: '合同名称', dataIndex: 'contract_name', key: 'contract_name',
                    render: (text, record) => {
                        return <div style={{whiteSpace: 'normal'}}>{text}</div>
                    }
                },
                {
                    title: '合同签订日期', dataIndex: 'contract_sign_date', key: 'contract_sign_date',
                },
                // {
                //     title: '合同金额', dataIndex: 'contract_amount', key: 'contract_amount',
                // },
                {
                    title: '合同供应商', dataIndex: 'supplier_name', key: 'supplier_name',
                    render: (text, record) => {
                        return <div style={{whiteSpace: 'normal'}}>{text}</div>
                    }
                },
                {
                    title: '对应系统', dataIndex: 'system_name', key: 'system_name',
                    render: (text, record) => {
                        return <div style={{whiteSpace: 'normal'}}>{text}</div>
                    }
                }
            ];
        _this.setState({ table_headers_fir: _headerNew });
    }

    getSecondHeader = () => {
        let _this = this;
        let _headerNew =
            [
                {
                    title: '商务编号', dataIndex: 'result_code', key: 'result_code',
                    render: (text, record) => {
                        return <div style={{whiteSpace: 'normal'}}>{text}</div>
                    }
                },
                {
                    title: '商务名称', dataIndex: 'result_name', key: 'result_name',
                    render: (text, record) => {
                        return <div style={{whiteSpace: 'normal'}}>{text}</div>
                    }
                },
                {
                    title: '商务谈判时间', dataIndex: 'tbr_starttime', key: 'tbr_starttime',
                },
                {
                    title: '商务审批结束时间', dataIndex: 'tbr_endtime', key: 'tbr_endtime',
                },
                {
                    title: '结果中标供应商', dataIndex: 'tbr_supplier_name', key: 'tbr_supplier_name',
                    render: (text, record) => {
                        return <div style={{whiteSpace: 'normal'}}>{text}</div>
                    }
                },
                {
                    title: '合同审批开始时间', dataIndex: 'tc_starttime', key: 'tc_starttime',
                },
                {
                    title: '合同审批结束时间', dataIndex: 'tc_endtime', key: 'tc_endtime',
                }
            ];
        _this.setState({ table_headers_sec: _headerNew });
    }

    getThirdHeader = () => {
        let _this = this;
        let _headerNew =
            [
                {
                    title: '订单编号', dataIndex: 'apply_code', key: 'apply_code',
                },
                {
                    title: '订单名称', dataIndex: 'apply_name', key: 'apply_name',
                    render: (text, record) => {
                        return <div style={{whiteSpace: 'normal'}}>{text}</div>
                    }
                },
                // {
                //     title: '金额', dataIndex: 'apply_amount', key: 'apply_amount',
                // },
                {
                    title: '供应商', dataIndex: 'supplier_name', key: 'supplier_name',
                    render: (text, record) => {
                        return <div style={{whiteSpace: 'normal'}}>{text}</div>
                    }
                },
                {
                    title: '申请开始时间', dataIndex: 'tba_starttime', key: 'tba_starttime',
                },
                {
                    title: '申请结束时间', dataIndex: 'tba_endtime', key: 'tba_endtime',
                },
                {
                    title: '对应系统', dataIndex: 'system_name', key: 'system_name',
                    render: (text, record) => {
                        return <div style={{whiteSpace: 'normal'}}>{text}</div>
                    }
                }
            ];
        _this.setState({ table_headers_thi: _headerNew });
    }

    render() {
        return (

        <div className="scroll">
            <div style={{ marginLeft: 30, marginRight: 30 }} >
            <VpTable
                loading={false}
                ref={table => this.tableRef1 = table}
                queryMethod="POST"
                controlAddButton={
                    (numPerPage, resultList) => {
                        this.controlAddButton(numPerPage, resultList)
                    }
                }
                dataUrl={this.getDataUrl(1)}
                params={this.getQueryParams()}
                className="entityTable"
                columns={this.state.table_headers_fir}
                bindThis={this}
                rowKey="iid"
                showTotal="false"
                resize
                size='small'
                bordered={true}
                scroll={{ y: 250, x: true }}
                pagination={false}
                auto={false}
                resize={false}
            />
            <VpTable
                loading={false}
                ref={table => this.tableRef2 = table}
                queryMethod="POST"
                controlAddButton={
                    (numPerPage, resultList) => {
                        this.controlAddButton(numPerPage, resultList)
                    }
                }
                dataUrl={this.getDataUrl(2)}
                params={this.getQueryParams()}
                className="entityTable"
                columns={this.state.table_headers_sec}
                bindThis={this}
                rowKey="iid"
                showTotal="false"
                resize
                size='small'
                bordered={true}
                scroll={{ y: 250, x: true }}
                pagination={false}
                auto={false}
                resize={false}
            />
            <VpTable
                loading={false}
                ref={table => this.tableRef3 = table}
                queryMethod="POST"
                controlAddButton={
                    (numPerPage, resultList) => {
                        this.controlAddButton(numPerPage, resultList)
                    }
                }
                dataUrl={this.getDataUrl(3)}
                params={this.getQueryParams()}
                className="entityTable"
                columns={this.state.table_headers_thi}
                bindThis={this}
                rowKey="iid"
                showTotal="false"
                resize
                size='small'
                bordered={true}
                scroll={{ y: 250, x: true }}
                pagination={false}
                auto={false}
                resize={false}
            />
            </div>
        </div>
        )
    }
}