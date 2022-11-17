import React, { Component } from "react";
import { VpRadioGroup, VpRadio } from 'vpreact';
import EntityList from '../../../templates/dynamic/List/index';
/**
 *  FILES 项目子风险列表
 */
class RiskNormalTable extends EntityList.NormalTable.Component {
    componentDidMount() {
    }
    // TODO 获取表头数据
    getHeader() {
        this.props.getAddflag(true,true)
        const _header = [
            {
                title: '编号',
                dataIndex: 'scode'
            },{
                title: '名称',
                dataIndex: 'sname',
                width: 200,
            },{
                title: '风险等级',
                dataIndex: 'ifxdj'
            },{
                title: '风险状态',
                dataIndex: 'istatusid'
            },{
                title: '是否影响上线', width: 200, key: 'operation',
                render: (text, record) => {
                    // tableData.push({[record.scode]: record.ifxflvpval})
                    return (
                        <span onClick={(e) => { e.stopPropagation() }}>
                            <VpRadioGroup onChange={e=>this.accessRadioChange(e,record)}  value={record.ifxflvpval || '1'}>
                                <VpRadio key='is_meeting1' value='1'>否</VpRadio>
                                <VpRadio key='is_meeting2' value='2'>是</VpRadio>
                            </VpRadioGroup>
                        </span>
                    )
                }
            }]
        this.setState({table_headers: _header})
    }
    accessRadioChange(e,record) {
        let tableData = this.tableRef.getCurrentData()
        tableData.map((item) => {
            if (item.scode === record.scode) {
                item.ifxflvpval = e.target.value
            }
        })
        this.tableRef.setTableData(tableData)
        if (e.target.value === '2') {
            this.onRowClick(record)
        }
    }
    onRowClick(record) {
        let iid = record.iid;
        this.setState({
            showRightBox: true,
            iid: iid,
            record: record
        });
    }
}
RiskNormalTable = EntityList.NormalTable.createClass(RiskNormalTable)

class RiskListFilter extends EntityList.ListFilter.Component {
    /**
    * 获取过滤器列表
    */
    getFilters = (props) => {
        if (!props.filterData) {
            return null;
        }
        let filterGroups = [];
        let filtervalue = props.filterData.statusFilters[0].value || '0';
        let { statusFilters } = props.filterData;
        let currentkey = "status";
        if (statusFilters) {
            filterGroups.push({
                key: "status",
                type: "vpicon-loading",
                text: "状态",
                filters: statusFilters,
            });
        }
        let filterVal = {
            filtervalue,
            currentkey,
            openKeys: ["status"],
        };
        this.setState({
            ...filterVal,
            filters: filterGroups,
        });
        this.changeQueryParams({
            filtervalue,
            currentkey,
        });
    };
}
RiskListFilter = EntityList.ListFilter.createClass(RiskListFilter)
class RiskEntityList extends EntityList.Component {
    getCustomeButtons() {
        return ["add"];
    }
    /**
    * 渲染过滤器
    * @returns {*}
    */
    renderTableFilter(props) {
        console.log(props,"props");
        return <RiskListFilter {...props} />;
    }
    renderNormalTable(props) {
        return <RiskNormalTable {...props} />;
    }
}
RiskEntityList = EntityList.createClass(RiskEntityList);
class RiskList extends Component {
    render() {
        return (
            <RiskEntityList
                entityid={this.props.params.entityid} //实体id
                {...this.props}
            />
        );
    }
}
export default RiskList;
