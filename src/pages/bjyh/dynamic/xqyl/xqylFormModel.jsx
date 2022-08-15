import React, { Component } from 'react';
import {
    VpRow,
    VpCol,
    VpTable, vpQuery,vpAdd,
    VpTag, VpModal
} from 'vpreact';

import {
    VpSearchInput
} from 'vpbusiness';
import { Checkbox } from 'antd';
import logopic from "vpstatic/images/logosm";
class xqylFormModel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            queryParams: this.props.queryParams||{},
            searchStr: '',
            searchCol: '',
            select_type: '',
            selectedRowKeys: [],
            selectItem: [],
            table_array: [],
            currentPage: 1,//当前第几页
            pageSize: 10,//每页记录数
            pagination: {},
            quickvalue: '',
            table_userHeaders: [],//选择用户表头
            entity_data_url: "/{bjyh}/ylbg/queryfaldname",
        }
        this.props.onModelRef && this.props.onModelRef(this)
    }

    componentWillMount() {
        this.getUserHeader();
        this.getListData();
    }
    componentDidMount(){
        $('.search').find('input').attr('maxlength',400)
    }
    onShowSizeChange=(current,pageSize)=>{
        console.log("onShowSizeChange:",current+"--"+pageSize)
        this.setState({
            currentPage:current,
            pageSize:pageSize
            })
        this.getQueryListData(current,pageSize);
            
    }
    onChange=(page)=>{
        console.log("onChange:",page)
        this.setState({
            currentPage: page,
        })
       this.getListData();
    }
    //根据分页和条数查询
    getQueryListData(currentPage,pageSize) {
        const _this = this;
        let jsonPara = {
            flow_type: '1',
            flow_id: this.props.options.piid,
            pageNum:currentPage,
            pageSize:pageSize,
            quickSearch:this.state.searchStr,
            user_code: vp.cookie.getTkInfo('username')
        }
        console.log("jsonPara",jsonPara)
        vpAdd(window.vp.config.jgjk.ylxz.queryNoPassYlList, {
            jsonPara: JSON.stringify(jsonPara)
        }).then((data) => {
            console.log("data:",data)
            let showTotal = () => {
                return '共' + data.total + '条'
            }

            _this.setState({
                table_array: data.rows,
                // currentPage: '2',
                // total_rows: data.total,
                // num_perpage: data.numPerPage==""?10:data.numPerPage,
                // pagination:false
                pagination: {
                    current:this.state.currentPage,
                    total: data.total,
                    pageSize:this.state.pageSize,
                    showTotal: showTotal,
                    onChange:this.onChange,
                    onShowSizeChange: this.onShowSizeChange,
                    showSizeChanger: true,
                    showQuickJumper: true,
                }
            })
            // this.setState({ selectItem })
        })
    }

    getListData() {
        const _this = this;
        let jsonPara = {
            flow_type: '1',
            flow_id: this.props.options.piid,
            pageNum:this.state.currentPage,
            pageSize:this.state.pageSize,
            quickSearch:this.state.searchStr,
            user_code: vp.cookie.getTkInfo('username')
        }
        console.log("jsonPara",jsonPara)
        vpAdd(window.vp.config.jgjk.ylxz.queryNoPassYlList, {
            jsonPara: JSON.stringify(jsonPara)
        }).then((data) => {
            console.log("data:",data)
            let showTotal = () => {
                return '共' + data.total + '条'
            }

            _this.setState({
                table_array: data.rows,
                // currentPage: '2',
                // total_rows: data.total,
                // num_perpage: data.numPerPage==""?10:data.numPerPage,
                // pagination:false
                pagination: {
                    current:this.state.currentPage,
                    total: data.total,
                    pageSize:this.state.pageSize,
                    showTotal: showTotal,
                    onChange:this.onChange,
                    onShowSizeChange: this.onShowSizeChange,
                    showSizeChanger: true,
                    showQuickJumper: true,
                }
            })
            // this.setState({ selectItem })
        })
    }

    //获取用户header
    getUserHeader() {
        vpQuery("{vpplat}/vfrm/entity/getheaders", {
            entityid: this.props.entityid||2
        }).then((response) => {
            const table_userHeaders = this.initHeaders(response.data.grid.fields);
            this.setState({ table_userHeaders })
        })
    }
    // 初始化表头信息
    initHeaders(table_headers) {
        let headers = table_headers.map((item, i) => {
            let column = { title: item.field_label, width: item.width, dataIndex: item.field_name, key: i }
            if (item.sort) {
                column.sorter = true;
            }
            return column
        })
        return headers;
    }

    handleUserSelect = (record, selected, selectedRows) => {
        this.setState({ record });
        let idx = 0;
        if (selected) {
            let comments = this.state.selectItem
            comments.push(record)
            this.setState({
                selectItem: comments
            })
        } else {
            this.state.selectItem.forEach((element, i) => {
                if (element.key === record.key) {
                    idx = i
                }
            });
            this.setState({
                selectItem: [...this.state.selectItem.slice(0, idx), ...this.state.selectItem.slice(idx + 1)]
            })
        }
    }

    //全选
    handleSelectAll = (selected, selectedRows, changeRows) => {
        this.setState({
            selectItem: selectedRows
        })
    }

    /**
     * 快速搜索
     */
    handlesearch = () => {
        this.setState({
            searchStr: this.searchValue
        }, () => {
            this.getListData();
        })
    }
    /**
     * 快速搜索框
     */
    handleChange1 = (e) => {
        this.searchValue = e.target.value;
    }

    /**
     * 选中事件
     */
    // onSelectChange(selectedRowKeys) {
    //     console.log('selectedRowKeys changed: ', selectedRowKeys);
    //     console.log('this ', this);
    //     // this.setState({
    //     //     selectedRowKeys: selectedRowKeys
    //     // })
    // }
    //ONCLOSE
    onClose(item, i) {
        console.log('onClose:', item);
        // let newList = [...this.state.selectItem.slice(0, i), ...this.state.selectItem.slice(i + 1)];
        // this.setState({
        //     selectItem: newList,
        //     selectedRowKeys: newList.map((item, i) => {
        //         return item.iid
        //     })
        // })
    }

    render() {
        const { selectedRowKeys } = this.state
        console.log(selectedRowKeys);
        const rowSelection = {
            onSelect: this.handleUserSelect,
            onSelectAll: this.handleSelectAll,
            // selectedRowKeys,
            // onChange: this.onSelectChange,
            type: this.state.select_type
        }
        return (
            <div className="bg-gray full-height vpselectentity" >
                <div className="p-sm full-height  p-b-xxlg">
                        <div className="full-height scroll-y">
                            <VpRow  gutter={10} className="overflow">
                                <div style={{width: '300px'}}>
                                    <VpSearchInput onPressEnter={this.handlesearch}
                                                   searchButton={this.handlesearch} onChange={this.handleChange1} placeholder="输入要搜索的数据" />
                                </div>
                                <div className="bg-white">
                                    <div className={this.state.table_array.length ? "p-sm infinite hasdata" : "p-sm infinite"}>
                                        <VpTable
                                            className="m-tb-sm"
                                            ref={table => this.tableRef = table}
                                            rowSelection={rowSelection}
                                            columns={this.state.table_userHeaders}
                                            rowKey={(record, index)=>{return record.case_id}}
                                            //dataUrl={this.state.entity_data_url}
                                            dataSource={this.state.table_array}
                                            pagination={this.state.pagination}
                                            params={({
                                                "quickSearch": this.state.searchStr,
                                                "searchCol": this.state.searchCol,
                                                "viewtype": "list", "entityid": this.props.entityid||2, "viewcode": "list",
                                                "currentkey": "filter",
                                                ...this.state.queryParams
                                            })}
                                            {...this.props.options}

                                        />
                                    </div>
                                </div>
                            </VpRow>
                            <VpRow>
                                <VpCol span={24}>
                                    <div className="bg-white m-t-sm" style={{ minHeight: '100px' }}>
                                        {
                                            this.state.selectItem.map((item, i) => {
                                                return (
                                                    <VpTag key={item.iid} className='tag-select' closable onClose={this.onClose.bind(this, item, i)}>
                                                        <img src={logopic} alt="" />
                                                        {item.case_name}
                                                    </VpTag>
                                                )
                                            })
                                        }
                                    </div>
                            </VpCol>
                        </VpRow>
                    </div>
                </div>
            </div>)
    }
}

export default xqylFormModel
