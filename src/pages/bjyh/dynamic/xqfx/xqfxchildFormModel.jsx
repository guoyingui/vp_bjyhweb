import React, { Component } from 'react';
import {
    VpRow,
    VpCol,
    VpTable, vpQuery,
    VpTag
} from 'vpreact';

import {
    VpSearchInput
} from 'vpbusiness';
import { Checkbox } from 'antd';

class xqfxchildFormModel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            queryParams: this.props.queryParams||{},
            searchStr: '',
            searchCol: '',
            select_type: '',
            selectedRowKeys: [],
            selectItem: [],
            table_userHeaders: [],//选择用户表头
            entity_data_url: "/{vpplat}/vfrm/entity/dynamicListData",
        }
        this.props.onModelRef && this.props.onModelRef(this)
    }

    componentWillMount() {
        this.getUserHeader();
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
            selectItem: this.state.selectItem.concat(selectedRows)
        });
    }

    /**
     * 快速搜索
     */
    handlesearch = () => {
        this.setState({
            searchStr: this.searchValue
        }, () => {
            this.VpTable.getTableData();
        })
    }
    /**
     * 快速搜索框
     */
    handleChange = (e) => {
        this.searchValue = e.target.value;
    }

    /**
     * 选中事件
     */
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }
    //ONCLOSE
    onClose(item, i) {
        let newList = [...this.state.selectItem.slice(0, i), ...this.state.selectItem.slice(i + 1)];
        this.setState({
            selectItem: newList,
            selectedRowKeys: newList.map((item, i) => {
                return item.iid
            })
        })
    }

    render() {
        const { selectedRowKeys } = this.state
        const rowSelection = {
            onSelect: this.handleUserSelect,
            onSelectAll: this.handleSelectAll,
            selectedRowKeys,
            onChange: this.onSelectChange,
            type: this.state.select_type
        }

        if (this.state.viewFlag) {
            return (
                <div className="split-modal-content f14">
                    <VpRow>
                        <VpCol span={5} className="p-tb-xs">
                            <VpSearchInput onPressEnter={this.handlesearch}
                                searchButton={this.handlesearch} onChange={this.handleChange} placeholder="输入要搜索的数据" />
                        </VpCol>
                    </VpRow>
                    <div className="p-sm" style={{ minHeight: '500px', maxHeight: '600px' }}>
                        <VpTable
                            className="m-tb-sm"
                            rowSelection={rowSelection}
                            columns={this.state.table_userHeaders}
                            dataUrl={this.state.entity_data_url}
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
                    <VpRow>
                        <VpCol span={24}>
                            {/* this.state.select_type=="checkbox"? */}
                            <span className="inline-display">要添加的数据:</span>
                            <div className="split-tag-select bg-white b m-t-sm p-sm" style={{ minHeight: '100px' }}>
                                {

                                    this.state.selectItem.map((item, i) => {
                                        return (
                                            <VpTag key={item.iid} closable onClose={this.onClose.bind(this, item, i)}>
                                                <span title={item.sname}>{item.sname}</span>
                                            </VpTag>
                                        )
                                    })
                                }
                            </div>

                        </VpCol>
                    </VpRow>
                </div>)
        } else {
            return (
                <div className="split-modal-content f14">
                    <VpRow>
                        <VpCol span={3} className="p-tb-xs">
                        {this.state.searchCol == "ssxt" ? 
                            <label htmlFor="">所属系统名:</label> : 
                            <label htmlFor="">公司名称:</label>
                        }
                        </VpCol>
                        <VpCol span={10} className="p-tb-xs">
                            <VpSearchInput onPressEnter={this.handlesearch} searchButton={this.handlesearch}
                                onChange={this.handleChange} placeholder="输入要搜索的数据" />
                        </VpCol>
                    </VpRow>
                    <div className="p-sm" style={{ minHeight: '380px', maxHeight: '460px' }}>
                        <VpTable
                            className="m-tb-sm"
                            rowSelection={rowSelection}
                            columns={this.state.table_userHeaders}
                            dataUrl={this.state.entity_data_url}
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
                </div>)
        }
    }
}

export default xqfxchildFormModel
