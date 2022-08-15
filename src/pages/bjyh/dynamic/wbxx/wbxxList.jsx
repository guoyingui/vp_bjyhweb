import React, { Component } from 'react'

import EntityList from '../../../templates/dynamic/List/index';
import { VpButton, VpFormCreate, vpAdd, VpIcon, VpPopconfirm, VpDropdown, VpTabs, vpQuery } from 'vpreact'

class CustomNormalTable extends EntityList.NormalTable.Component {
    /**
     * 表格自定义属性,查询数据
     */
    getCustomTableOptions() {
        return {
            dataUrl: '/{bjyh}/externalData/dynamicListData'
        }
    }
}
CustomNormalTable = EntityList.NormalTable.createClass(CustomNormalTable);

class CustomEntityList extends EntityList.Component {
    renderNormalTable(props) {
        return <CustomNormalTable {...props} />;
    }
    
}
CustomEntityList = EntityList.createClass(CustomEntityList);

class entityList extends Component {
    constructor(props) {
        super(props)        
    }
    render() {
        let defaultFilter = {};
        if (this.props.location.state && this.props.location.state.param) {
            let urlparam = this.props.location.state.param
            defaultFilter = {
                filtervalue: urlparam.filter,
                currentkey: urlparam.currentkey
            }
        }
        return (
            <CustomEntityList
                entityid={this.props.params.entityid}//实体id
                type={this.props.params.type}//视图类型
                {...defaultFilter}
                {...this.props}
            />
        )
    }
};

export default entityList = VpFormCreate(entityList);