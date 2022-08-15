import React, { Component } from 'react';
import {
    VpRow,
    VpCol,
    VpTable,
    VpTag} from 'vpreact';

class childFormModel extends Component {
    constructor(props) {
        super(props);
        this.state={
            searchStr: '',
            selectedRowKeys: [],
            selectItem: [],
            table_userHeaders: '',
            entity_data_url: '',

        }
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
        }
        return (
            <div className="split-modal-content f14">
                <VpRow>
                    <VpCol span={5} className="p-tb-xs">
                        <VpSearchInput onPressEnter={this.handlesearch}
                                       searchButton={this.handlesearch} onChange={this.handleChange} placeholder="输入用户编号或者名称" />
                    </VpCol>
                </VpRow>
                <div className="p-sm" style={{mixHeight:'320px' ,maxHeight: '350px', overflow: 'auto' }}>
                    <VpTable
                        className="m-tb-sm"
                        rowSelection={rowSelection}
                        columns={this.state.table_userHeaders}
                        dataUrl={this.state.entity_data_url}
                        params={({
                            "quickSearch": this.state.searchStr,
                            "viewtype": "list", "entityid": 2, "viewcode": "list",
                            "currentkey": "filter",
                        })}

                    />
                </div>
                <VpRow>
                    <VpCol span={24}>
                        <span className="inline-display">要添加的评审人:</span>
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
            </div>
        )
    }
}
export default childFormModel

