import React, { Component } from "react";
import { VpFormCreate } from 'vpreact';
import EntityList from '../../../templates/dynamic/List/index';
/**
 *  项目子风险列表
 */
class RiskNormalTable extends EntityList.NormalTable.Component {
    getCustomOperationColButtons(record) {
        return ["delete"];
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
