import React, { Component } from 'react';
import { requireFile } from 'utils/utils';
import {VpButton, VpFormCreate, VpIcon,VpPopconfirm ,VpDropdown,VpTabs } from 'vpreact'
import EntityList from '../../templates/dynamic/List/index';
import AddButton from "../../templates/dynamic/List/AddButton";
//import CustomDynamicForm from "../../../sample/form/customDynamicForm";
// import Entity from './entity';//跨服务用requireFile来引用

/**
 * 自定义表格
 */
class CustomizedEntityList extends  EntityList.Component{
    constructor(props){
        super(props);
    }

}
CustomizedEntityList = EntityList.createClass(CustomizedEntityList);

 class entitylist extends Component {
    constructor(props) {
        super(props)
        console.log('customlist',props);
        
    }
    render() {
        let defaultFilter = {};
        if(this.props.location.state && this.props.location.state.param){
            let urlparam = this.props.location.state.param
            defaultFilter = {
                filtervalue : urlparam.filter,
                currentkey : urlparam.currentkey
            }
        }
        return (
                <CustomizedEntityList
                    entityid = {this.props.params.entityid}//实体id
                    type={this.props.params.type}//视图类型
                    {...defaultFilter}
                    {...this.props}
                />
        )
    }
};

export default entitylist = VpFormCreate(entitylist);

