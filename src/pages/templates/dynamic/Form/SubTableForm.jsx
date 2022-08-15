/**
 * 主子表中的子表单
 */
import React,{Component} from 'react';
import EntityList from '../List/index';
import SubForm from "./SubForm";

/**
 * 子表格表单由SubTableForm、SubTableForm.EntityList、SubTableForm.EntityList.EditTable组成
 *
 */

const EditTable = EntityList.EditTable;
class CustomEditTable extends EditTable.Component{
    getCustomTableBottomToolbars(){
        return ["add",/*"save",*/"refresh"]; //不要保存按钮
    }

    /**
     * 重置表格高度
     */
    resetTableHeight(){
    }
}
CustomEditTable = EditTable.createClass(CustomEditTable); //一定记得调用此方法


/**
 * 子表格表单
 */
class CustomList extends EntityList.Component {

    constructor(props){
        super(props);
    }

    /**
     * 只保留导出、查询按钮
     * @return {string[]}
     */
    getCustomeButtons(){
        return ["export","search"];
    }
    renderEditTable(props){
        return <CustomEditTable {...props} />;
    }

    getFilterPosition(){
       return "none";
    }

    renderViewSwitch(){
            return null;
    }



}
CustomList = EntityList.createClass(CustomList); //一定记得调用此方法
CustomList.EditTable = CustomEditTable;



/**
 * 子表格表单
 */
class SubTableForm extends SubForm.Component {

    constructor(props){
        super(props);
        this.onListRef = this.onListRef.bind(this);

    }
    onListRef(ref){
        this.listRef = ref;
    }

    /**
     * 保存前校验接口
     */
    onValidate(options,callback){
        callback();
    }

    /**
     * 保存接口
     */
    onSave({iid,formData},callback){
        callback();
    }

    getFormValues(options,callback){
        let sparam = this.listRef.tableRef.state.editrowdata;
        let formData = {
            sparam: JSON.stringify(sparam),
            mainentity: this.state.mainentity,//主实体ID
            mainentityiid: this.state.mainentityiid,//主实体数据ID
            entityid: this.state.entityid,//关联实体ID
            stabparam:this.state.stabparam//关系码
        }
        return callback(formData);
    }

    onMainFormSaveSuccess(options){
        this.listRef.tableRef.reloadTable();
    }
    /**
     * 自定义渲染列表类名
     * @param props
     * @return 返回自定义列表类名
     */
    getCustomListClass(){
        return CustomList;
    }

    /**
     * 自定义渲染列表参数
     */
    getCustomListOptions(){

    }

    render(){
        let List = this.getCustomListClass();
        return (
            <List
                entityid={this.state.entityid}
                mainentityid={this.state.mainentityid}
                mainentityiid={this.state.mainentityiid}
                stabparam={this.state.stabparam}
                type={"edit"}
                entityrole={this.props.entityrole}
                onRef={this.onListRef}
                formType={'tabs'} //从关联关系标签页中
                {...this.getCustomListOptions()}
            />
        );
    }
}


/**
 * 方便二次开发人员继承用
 * 二次开发时,先申明类，并继承XX.Component,然后再调用xx.createClass,
 * 例子：
 * class CustomComponent extends SubForm.Component {
 *
 * }
 * CustomComponent = SubForm.createClass(CustomComponent);
 * @param newClass
 */
let createClass = function(newClass){
    let wrapClass = SubForm.createClass(newClass);
    wrapClass.List = CustomList;
    return wrapClass;
}
export default createClass(SubTableForm);

