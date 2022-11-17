import React from "react";
import { vpQuery } from 'vpreact';
import RelationList from '../../../templates/dynamic/List/RelationList';
/**
 *  项目tab的子风险列表
 */
const NormalTable = RelationList.List.NormalTable;
const List = RelationList.List;
//自定义列表表格
class CustomNormalTable extends NormalTable.Component {
    getCustomOperationColButtons(record) {
        const _this = this;
        return [{
            name: "quxiao",
            title: "取消",
            iconType: "vpicon-cross-circle",
            iconClassName: "text-primary m-lr-xs cursor",
            handler: function (record) {
                _this.onRowClick(record);
            }
        }];
    }
    _renderRightBoxBody() {
        let props = {
            entityid: this.state.record.ientityid,
            iid: this.state.iid,
            closeRightModal: this.closeRightModal,
            defaultActiveKey: this.state.defaultActiveKey
        }
        return this.renderRightBoxBody(props);
    }
    controlAddButton(numPerPage, resultList) {
        let thought = vp.computedHeight(resultList.length, ".entityTable");
        thought = thought - 50;
        //设置表格的高度
        this.setState({
            tableHeight: thought,
        });
    }
}
CustomNormalTable = NormalTable.createClass(CustomNormalTable);
//自定义列表，
class CustomEntityList extends List.Component {
    getCustomeButtons() {
        return [];
    }
    //返回自定义的表格
    renderNormalTable(props) {
        return <CustomNormalTable {...props} />;
    }
}
CustomEntityList = List.createClass(CustomEntityList);
class CustomRelationList extends RelationList.Component {
    renderList(props) {
        return (
            <CustomEntityList {...props} />
        );
    }
}
CustomRelationList = RelationList.createClass(CustomRelationList);
export default CustomRelationList;