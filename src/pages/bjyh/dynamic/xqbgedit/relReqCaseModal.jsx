import React, { Component } from 'react';
import {
    VpRow,
    VpCol,
    VpButton,
    VpTable,
    VpTag,
    vpQuery,
    vpAdd
} from 'vpreact';
import logopic from 'vpstatic/images/logosm.jpg';
import {
    SeachInput
} from 'vpbusiness';

import './ChooseEntity.less';
class RelReqCaseModal extends Component{
    
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            table_headers: [],
            selectItem: [],
            table_array: [],
            cur_page: 1,
            page: 1,
            pagination: {},
            limit: 10, //每页记录数
            quickvalue: '',
            idepartmentid: '',
            item: {modalProps:{},...this.props.item},
            params: this.props.params || {}
        }
        this.onRowClick = this.onRowClick.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleSelectAll = this.handleSelectAll.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.onOk = this.onOk.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.tableChange = this.tableChange.bind(this);
        this.onShowSizeChange = this.onShowSizeChange.bind(this);
        this.getListData = this.getListData.bind(this);
        this.getListHeader = this.getListHeader.bind(this);
        this.handlesearch = this.handlesearch.bind(this);
        this.onRowClicks = this.onRowClicks.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.visible) {
            let initValue = nextProps.initValue||[];
            let selectsValues = initValue[0]!=undefined?initValue[0].iid==""?[]:initValue:[]
            this.setState({
                params: nextProps.params,
                selectItem: selectsValues,
                selectedRowKeys: selectsValues.map((item, i) => {
                    return item.iid
                })
            }, () => {
                this.getListHeader()
                this.getListData()
            })
        }
    }
    componentWillMount() {
        console.log(this.props.project_code,this.props.project_name)
        let initValue = this.props.initValue||[]
        let selectsValues = initValue[0]!=undefined?initValue[0].iid==""||!initValue[0].sname?[]:initValue:[]
        this.setState({
            item: {modalProps:{},...this.props.item},
            selectItem: selectsValues,
            selectedRowKeys: selectsValues.map((item, i) => {
                return item.iid
            })
        }, () => {
            this.getListHeader()
            this.getListData()
        })        
    }

    componentDidMount(){
        $('.search').find('input').attr('maxlength',400)
    }
    getListHeader() {
        const columns = [
            { title: '用例编号', width: 100, dataIndex: 'case_code', },
            { title: '用例名称', width: 100, dataIndex: 'case_name', },
            { title: '任务编号', dataIndex: 'task_code', width: 150 },
            { title: '任务名称', dataIndex: 'task_name', width: 150 },
            { title: '用例类型名称', dataIndex: 'case_type_name', width: 150 },
            { title: '涉及系统', dataIndex: 'rel_system', width: 150 },
            { title: '用例状态', dataIndex: 'case_status_name', width: 150 }
            /* { title: '创建人', dataIndex: 'user_name',  width: 150 },*/
            /*{ title: '创建时间', dataIndex: 'creat_time',  width: 150 },*/
            ];
            this.setState({
                table_headers:columns
            })
    }
    getListData() {
        const _this = this;
        const { cur_page, limit, item } = _this.state;
        //console.log("item",item)
        const params = _this.state.params || {};
        let ientityid = item.ientityid;
        let jsonPara={
            //vpQuery('/{vpczccb}/flowConf/getFlowGroupList', {
                pageNum:cur_page,pageSize:limit,quickSearch:this.state.quickvalue,flow_id:this.props.piid,flow_type:2,
                user_code: vp.cookie.getTkInfo('username')
            }
        vpAdd(window.vp.config.jgjk.xqbg.xqbgRelReqCaseListUrl, {
            //vpQuery('/{vpczccb}/flowConf/getFlowGroupList', {
                jsonPara:JSON.stringify(jsonPara)
            }).then((datas) => {
                if(datas.rows){
                    let data = datas.rows;
                    let showTotal = () => {
                        return '共' + datas.total + '条'
                    }
                    _this.setState({
                        table_array: data,
                        cur_page: cur_page,
                        total_rows: datas.total,
                        num_perpage: limit,
                        pagination: {
                            total: datas.total,
                            showTotal: showTotal,
                            pageSize: limit,
                            onShowSizeChange: _this.onShowSizeChange,
                            showSizeChanger: true,
                            showQuickJumper: true,
                        }
                    })
                }
            })
    }
    // 初始化表头信息
    initHeaders(table_headers) {
        const _this = this;
        let headers = table_headers.map((item, i) => {
            let column = { title: item.field_label, width: item.iwidth, dataIndex: item.field_name, key: i }
            if (item.sort) {
                column.sorter = true;
            }
            return column
        })
        return headers;
    }

    // 搜索框确定事件
    handlesearch(value) {
        const searchVal = $.trim(value);//value.replace(/\s/g, "");
        this.setState({
            quickvalue: searchVal,
            cur_page:1
        }, () => {
            this.getListData()
        })
    }

    // 表格的变动事件
    tableChange(pagination, filters, sorter) {
        let sorttype = ''
        if (sorter.order === 'descend') {
            sorttype = 'desc';
        } else if (sorter.order === 'ascend') {
            sorttype = 'asc';
        }
        this.setState({
            cur_page: pagination.current || this.state.cur_page,
            sortfield: sorter.field,
            sorttype,
            limit: pagination.pageSize || this.state.limit,
        }, () => {
            this.getListData()
        })
    }

    onShowSizeChange(value) {
        //console.log(value)
    }

    onRowClick(record, index) {
        this.setState({
            idepartmentid: record.iid,
            cur_page:1
        }, () => {
            this.getListData()
        })
    }
    onExpandedRowsChange(expandedRows) {
        //console.log(expandedRows)
    }
    onExpand(expanded, record) {
        //console.log(expanded, record)
    }
    onClose(item, i) {
        let newList = [...this.state.selectItem.slice(0, i), ...this.state.selectItem.slice(i + 1)];
        this.setState({
            selectItem: newList,
            selectedRowKeys: newList.map((item, i) => {
                return item.iid
            })
        })
    }
    handleSelect(record, selected, selectedRows) {
        //console.log(record)
        let idx = 0;
        if (this.props.item.widget_type == 'selectmodel') {
            if (selected) {
                this.setState({
                    selectItem: [record]
                })
            }
        } else {
            if (selected) {
                this.setState({
                    selectItem: [...this.state.selectItem, record]
                })
            } else {
                this.state.selectItem.forEach((element, i) => {
                    if (element.iid === record.iid) {
                        idx = i
                    }
                });
                this.setState({
                    selectItem: [...this.state.selectItem.slice(0, idx), ...this.state.selectItem.slice(idx + 1)]
                })
            }
        }


    }

    //点击当前行选中
    onRowClicks(record, index) {
        const selectedIdx = this.state.selectItem.findIndex((item) => record.iid === item.iid)
        if (selectedIdx != -1) {
            this.setState({
                selectItem: [
                    ...this.state.selectItem.slice(0, selectedIdx),
                    ...this.state.selectItem.slice(selectedIdx + 1)
                ],
                selectedRowKeys: [
                    ...this.state.selectedRowKeys.slice(0, selectedIdx),
                    ...this.state.selectedRowKeys.slice(selectedIdx + 1)
                ]

            })
        } else {
            if (this.props.item.widget_type == 'selectmodel') {
                this.setState({
                    selectedRowKeys: [record.iid],
                    selectItem: [record]
                })
            } else {
                this.setState({
                    selectItem: [
                        ...this.state.selectItem.slice(0),
                        record
                    ],
                    selectedRowKeys: [
                        ...this.state.selectedRowKeys.slice(0),
                        record.iid
                    ],
                })
            }
        }
    }

    onSelectChange(selectedRowKeys) {
        //console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }
    handleSelectAll(selected, selectedRows, changeRows) {
        //console.log(selected, selectedRows, changeRows)
        this.setState({
            selectItem: selectedRows
        })
    }
    onOk() {
        let jsonPara={
            flow_type:2,
            flow_id:this.props.piid,
            vpCaseQueryRes:this.state.selectItem||[]
        }
        vpAdd(window.vp.config.jgjk.xqbg.xqbgRelReqCaseUrl,{jsonPara:JSON.stringify(jsonPara)}).then(res=>{
            this.setState({
                selectItem: []
            },()=>{
                this.props.onOk();
            })
        })
    }
    onCancel() {
        this.props.onOk();
        this.setState({
            selectItem: this.props.initValue,
        })
    }
    onRowDoubleClick=(record, index)=>{
        let widget_type = this.props.item.widget_type
        if(widget_type == 'selectmodel'){
            this.props.onOk([record]);
            this.setState({
                selectItem: []
            })
        }
    }
    //其他按钮，用于查询全部数据
    reloadAll = () =>{
        this.setState({
            item:{...this.props.item,
                modalProps:{},
                groupids:'',
                condition:[],
                idepartmentid:'',
                currentPage: 1,
                pageSize: 10,
            }
        },()=>{
            this.getListData()
        })
        
    }
    render() {
        const columns = [
            { title: '编号', dataIndex: 'sname', key: 'sname' }
        ]
        const { selectedRowKeys } = this.state;
        let type = this.props.item.widget_type == 'selectmodel' ? 'radio' : 'checkbox';
        const rowSelection = {
            type: type,
            onSelect: this.handleSelect,
            onSelectAll: this.handleSelectAll,
            selectedRowKeys,
            onChange: this.onSelectChange,
        }
        return (
            <div className="bg-gray full-height vpselectentity" >
                <div className="p-sm full-height">
                    <div className="full-height scroll-y">
                    <VpRow gutter={2} className="overflow">
                        <VpCol span={24}>
                            <div className="bg-white">
                                <div className="p-sm fw infinite bg-white">
                                    <SeachInput onSearch={this.handlesearch} />
                                </div>
                                <div className={this.state.table_array.length ? "p-sm infinite hasdata" : "p-sm infinite"}>
                                    <VpTable
                                        columns={this.state.table_headers}
                                        size="small"
                                        dataSource={this.state.table_array}
                                        rowSelection={rowSelection}
                                        onChange={this.tableChange}
                                        onRowClick={this.onRowClicks}
                                        onDoubleClick={this.onRowDoubleClick}
                                        pagination={this.state.pagination}
                                        resize
                                        // bordered
                                        rowKey={record => record.iid}
                                    />
                                </div>
                            </div>
                        </VpCol>
                    </VpRow>
                    <VpRow>
                        <VpCol span={24}>
                            <div className="bg-white m-t-sm" style={{ minHeight: '100px' }}>
                                {
                                this.state.selectItem?
                                    this.state.selectItem.map((item, i) => {
                                        return (
                                            <VpTag className='tag-select' key={item.iid} closable onClose={this.onClose.bind(this, item, i)}>
                                                <img src={logopic} alt="" />
                                                {item.case_name}
                                            </VpTag>)
                                    }):''
                                }
                            </div>
                        </VpCol>
                    </VpRow>
                    </div>
                </div>
                <div className="footer-button-wrap ant-modal-footer" style={{ position: 'absolute' }}>
                    <VpButton type="primary" className="vp-btn-br" onClick={this.onOk}>确定</VpButton>
                    <VpButton type="ghost" className="vp-btn-br" onClick={this.onCancel}>取消</VpButton>
                </div>
            </div>
        )
    }
}
export default RelReqCaseModal;