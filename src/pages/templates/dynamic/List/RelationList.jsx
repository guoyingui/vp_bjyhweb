import React, { Component } from 'react'
import {
    VpFormCreate,VpPopconfirm,vpAdd
} from 'vpreact';
import {
    SeachInput,
    RightBox,
} from 'vpbusiness';

import {connect} from 'react-redux';
import {changeQueryParams} from 'reduxs/actions/action';

import EntityList from './index';
import {mergeButtons,randomKey} from "../utils";
import AddButton from "../../../templates/dynamic/List/AddButton";
import RelationDynamicForm from "../../../templates/dynamic/DynamicForm/RelationDynamicForm";
let NormalTable = EntityList.NormalTable;
let EditTable = EntityList.EditTable;
import RelEntityButton from './RelEntityButton';
import { requireFile } from 'utils/utils';

/**
 * 关联关系列表
 * 二次开发样例
 *  import RelationList from 'templates/dynamic/List/RelationList';
    const NormalTable = RelationList.RelationList.List.NormalTable;
    const List = RelationList.RelationList.List;
    //自定义列表表格
    class CustomNormalTable extends NormalTable.Component{
        ...定制方法见src/pages/templates/dynamic/List/NormalTable.jsx
    }
    //自定义列表，
    class CustomEntityList extends List.Component{
        //返回自定义的表格
        renderNormalTable(props){
            return (
                <CustomNormalTable {...props} />
            )
        }
        ...其它定制方法见src/pages/templates/dynamic/List/index.jsx
    }
    class CustomRelationList extends RelationList.Component{
        //返回自定义的列表
        renderList(props){
            return <CustomEntityList {...props} />;
        }
    }
 */


//===========================================================
/**
 * 关联关系定制的列表表格，与NormalTable区别主要在列表操作列操作按钮
 */
class CustomNormalTable extends NormalTable.Component{

    /**
     * 移除关系
     * @param record
     */
    doRemoveRel(record) {
        const _this = this;
        let sparam = {
            irelationentityiid: record.iid,
            mainentityid: this.props.mainentityid,
            mainentityiid: this.props.mainentityiid,
            irelationentity: this.props.entityid,
            stabparam: this.props.stabparam
        }
        vpAdd('/{vpplat}/vfrm/entity/deleteRelation', {
            sparam: JSON.stringify(sparam)
        }).then(function (data) {
            _this.reloadTable();
        })

    }

    getDefaultOperationColButtons(record){
        let _this = this;
        let defaultBtns  ={
            "edit":{
                name:"edit",
                title:'编辑',
                iconType:"vpicon-edit",
                iconClassName:"text-primary m-lr-xs cursor",
                handler:function(record){
                    _this.onRowClick(record);
                },
            },
            "delete":{
                name:"delete",
                title:'删除',
                iconType:'vpicon-close',
                iconClassName:"text-primary m-lr-xs cursor",
                doRemoveRel:this.doRemoveRel.bind(this,record),
                render:function(ContentClass,record,props,_thislist){
                    return <VpPopconfirm title="确定要删除这条信息吗？" onConfirm={props.doRemoveRel}>
                        <span><ContentClass /></span>
                    </VpPopconfirm>
                }
            }
        }
        return defaultBtns;
    }

    /**
     * 获取自定义操作按钮
     */
    getCustomOperationColButtons(record){
        let buttons = this.props.buttons;
        if(!buttons){
            //如果没有自定义操作按钮，使用默认提供的
            buttons = [];
            if(this.props.entityaddrole){
                buttons.push("edit");
                buttons.push("delete");
            }
        }
        return buttons;
    }
    /**
     * 表格自定义属性
     * @returns {}
     */
    getCustomTableOptions(){
        return {
            dataUrl:'/{vpplat}/vfrm/entity/dynamicListData'
        }
    }
    controlAddButton (numPerPage, resultList)  {
        let theight = vp.computedHeight(resultList.length, '.entityTable')-50
        if (this.props.fromtype == 'resource') {
            theight = theight - 50
        }
        let expandArr = this.getExpandedRowa(resultList, [])
        //设置展开行
        this.setState({
            tableloading: false,
            expandedRowKeys: expandArr,
            tableHeight: theight
        })
    }
}
CustomNormalTable = NormalTable.createClass(CustomNormalTable); //一定记得调用此方法

/**,
 * 自定义添加按钮
 */
class CustomAddButton extends AddButton.Component {

    componentWillMount() {
        this.queryclassList();
        this.queryNewForm();
        if(this.props.addtype == "relation"){
            $('.footFixed').css('z-index',1)
        }
        
    }

    /**
     * 自定义表单
     */
    getFormClass() {
            return RelationDynamicForm;
    }
}
CustomAddButton = AddButton.createClass(CustomAddButton);


/**
 * 关联关系列表定义类，与EntityList主要区别在表格上方操作按钮
 *
 */
class CustomEntityList extends EntityList.Component{

    renderViewSwitch(){
        //不显示视图切换
        return null;
    }

    getFilterPosition(){
        //不显示过滤器
        return "none";
    }

    renderNormalTable(props){
        return (
            <CustomNormalTable {...props} />
        )
    }

    getCustomeButtons(){
        if(!this.state.entityaddrole){
            //没有编辑权限时
            return [];
        }

        return [{
            name: "add",
            render: function (_thislist, props) {                
                return (
                    <CustomAddButton {...props} 
                    entityid={_thislist.props.entityid} 
                    _contextid={_thislist._contextid} 
                    addtype ={"relation"}/>
                )
            }
        },{
            //关联实体按钮
            name:"relEntity",
            render:function(_thislist,props){
                return (
                    <RelEntityButton {...props} />
                )
            }
        }]
    }
}
CustomEntityList = EntityList.createClass(CustomEntityList); //一定记得调用此方法


class RelationList extends Component {
    constructor(props) {
        super(props)
        //给当前list起个唯一名称
        this.state = {

        }
        this._contextid = this.props._contextid||randomKey();
    }
    componentWillMount() {
        let skey = this.props.skey
        let entityid = skey.replace(/[^0-9]/ig, "")//权限码中提取数字，数字即为当前挂起的实体id
        this.setState({
            entityid
        })
    }

    renderList(props){
        return <CustomEntityList {...props} />;
    }

    render() {
        let _this = this
        let props = {
            _contextid:this._contextid,
            entityid:this.state.entityid, //当前
            mainentityid:this.props.entityid, //主实体entityid
            mainentityiid:this.props.iid, //主实体iid
            iaccesslevel:this.props.iaccesslevel,//(0:读1:写)
            entityrole:this.props.entityrole,  //是否可写
            stabparam:this.props.stabparam, //关联关系字段
            formType:'tabs', //从关联关系标签页中
            viewtype:'list',
        }
        return this.renderList(props);
    }
}



function mapStateToProps(state,ownProps){
    return {
    }
}


function mapToDispatchToProps(dispatch,ownProps){
    return {
        changeQueryParams:function(listId,queryParams){
            dispatch(changeQueryParams(listId,queryParams));
        }
    }
}

/**
 * 方便二次开发人员继承用
 * 二次开发时,先申明类，并继承XX.Component,然后再调用xx.createClass,
 * 例子：
 * class CustomComponent extends StatusButton.Component {
 *
 * }
 * CustomComponent = DynamicForm.createClass(CustomComponent);
 * @param newClass
 */
let createClass = function(newClass){
    let wrapClass = connect(mapStateToProps,mapToDispatchToProps)(newClass);
    wrapClass.Component = newClass;
    wrapClass.List = CustomEntityList;
    wrapClass.createClass = createClass;
    return wrapClass;
}
export default createClass(RelationList);