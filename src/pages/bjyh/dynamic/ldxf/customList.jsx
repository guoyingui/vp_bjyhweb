import React, { Component } from 'react'

import EntityList from '../../../templates/dynamic/List/index';
import ListFilter from '../../../templates/dynamic/List/ListFilter';
import { VpButton, VpFormCreate,VpTooltip,VpMsgSuccess,VpMsgWarning,VpMsgError,vpAdd, VpIcon, VpAlertMsg,VpPopconfirm, VpDropdown, VpTabs, vpQuery } from 'vpreact'

class CustomNormalTable extends EntityList.NormalTable.Component {
    constructor(props) {
        super(props)
        this.state={
            ...this.state,
            selectedRowKeys:[],
            selectedRows:[]
        }
    }
    /**
     * 表格自定义属性,查询数据
     */
     getCustomTableOptions() {
        return {
            dataUrl:'/{vpplat}/vfrm/entity/dynamicListDataForLdxfBatchApply'
        }
    }
    renderBatchApplyTable=(props)=>{
        return <BatchApplyTable {...props}/>;
    }
    render(){
        //如果点击的是批量审批按钮，则渲染批量审批table。
        let filtervalue=this.props.queryParams.filtervalue||0;
        return filtervalue==666?this.renderBatchApplyTable(this.props):super.render();
    }
}

CustomNormalTable = EntityList.NormalTable.createClass(CustomNormalTable);
/**
 * 批量审批页面table。定制可以写在这里面。
 */
class BatchApplyTable extends EntityList.NormalTable.Component {
    constructor(props) {
        super(props)
        this.state={
            ...this.state,
            selectedRowKeys:[],
            selectedRows:[]
        }
        if(props.batchApplyTableRef){
            props.batchApplyTableRef(this);
        }
    }
    //列表项是否可选择
    onSelectChange = (selectedRowKeys, selectedRows) => {
        //将选中的数据给列表组件
        this.props.getSelections(selectedRowKeys, selectedRows);
        this.setState({
            selectedRowKeys: selectedRowKeys,
            selectedRows: selectedRows
        });
    }
    /**
     * 表格自定义属性,查询数据
     */
    getCustomTableOptions() {
        return {
            rowSelection:{
                onChange:this.onSelectChange,
                selectedRowKeys:this.state.selectedRowKeys
            },
            dataUrl:'/{vpplat}/vfrm/entity/dynamicListDataForLdxfBatchApply'
        }
    }
}
BatchApplyTable = EntityList.NormalTable.createClass(BatchApplyTable);

class CustomEntityList extends EntityList.Component {
    constructor(props) {
        super(props)
        this.state={
            ...this.state,
            selectedRowKeys:[],
            selectedRows:[]
        }
    }
    onCustBtnClick=()=>{
        if(this.state.selectedRows.length==0){
            VpMsgWarning('请至少选择一条数据',3);
            return
        }
        //将表格设置加载中
        this.batchApplyTableRef.setState({
            tableloading:true
        });
        //将选中的数据传入后台进行提交处理。
        vpAdd('/{bjyh}/flowBatchApply/ldxfFlowBatchApply',{
            selectedRowKeys:this.state.selectedRowKeys.join(",")
        }).then((res)=>{
            if(res.status){
                VpMsgSuccess('批量处理成功！',3);
            }else{
                VpMsgError('批量处理失败！请联系管理员',3);
            }
            this.setState({
                selectedRowKeys:[],
                selectedRows:[]
            })
            //将表格加载状态置为false。取消行选择。
            this.batchApplyTableRef.setState({
                selectedRowKeys:[],
                selectedRows:[],
                tableloading:false
            },()=>{
                this.batchApplyTableRef.tableRef.getTableData();
            })
        })

    }
    /**
     * 自定义按钮
     * @return {GamepadButton[] | number}
     */
     getCustomeButtons() {
        let _this=this;
        let customBtns = this.props.buttons;
        console.log(22222,this.state.filtervalue)
        if(!customBtns){
            //没有自定义按钮时，用默认的
            customBtns = [];
            //如果点击的是批量审批下的待处理过滤器，则只显示一键审批按钮。
            if(this.state.filtervalue==666){
                customBtns.push({
                    name:"cust",
                    render:function(_thislist,props){
                        return (
                            <VpButton type="primary" icon="retweet" className="m-l-xs" onClick={_this.onCustBtnClick}>
                                一键审批
                            </VpButton>
                        )
                    }
                },{
                    name:"tip",
                    render:function(_thislist,props){
                        return (
                            <VpTooltip placement="topLeft" title="该列表只会显示流程在第一步并且处理人是当前登录人的数据。是批量导入数据后，方便直接提交到第二步开发的定制功能。">
                                <VpIcon style={{"padding-left": "10px"}} type="question-circle"/>
                            </VpTooltip>
                        );
                    }
                })
            }else{
                if(this.state.entityaddrole){
                    if(this.state.addflag == '1'){
                        customBtns.push("add");
                    }
                    customBtns.push("export");
                }
                customBtns.push("search");
            }
        }
        return customBtns;
    }
    /**
     * 获取选择的数据项
     */
    getSelections=(selectedRowKeys,selectedRows)=>{
        this.setState({
            selectedRowKeys: selectedRowKeys,
            selectedRows: selectedRows
        })
    }
    /**
     * 将过滤器值对象设置到entitylist中。
     * @param {选中过滤器的值对象} obj 
     */
     setParentState=(obj)=>{
        this.setState(obj);
    }
    /**
     * 渲染过滤器
     * @returns {*}
     */
     renderTableFilter(props){
        return <CustomListFilter setParentState={this.setParentState} {...props}/>;
    }

    renderNormalTable(props) {
        let myProps={
            ...props,
            batchApplyTableRef:c=>this.batchApplyTableRef=c,
            getSelections:this.getSelections
        }
        return <CustomNormalTable {...myProps} />; 
    }
    
}
CustomEntityList = EntityList.createClass(CustomEntityList);

class CustomListFilter extends ListFilter.Component{
    constructor(props) {
        super(props)
    }
    /**
     * 过滤器变更事件
     */
     onChange(filterVal){
        super.onChange(filterVal);
        this.props.setParentState&&this.props.setParentState(filterVal);
    }
    /**
     * 获取过滤器列表
     */
    getFilters = (props) => {
        if(!props.filterData){
            return null;
        }
        let filterGroups = [];
        let filtervalue = props.filtervalue;
        let {filters,statusFilters,classFilters} = props.filterData;
        filtervalue = filtervalue ? filtervalue:'0'
        let currentkey = 'filter';
        if(filters){
            filterGroups.push({
                key:"filter",
                type:"vpicon-filter",
                text:"过滤器",
                filters:filters
            });
        }
        if(statusFilters){
            filterGroups.push({
                key:"status",
                type:"vpicon-loading",
                text:"状态",
                filters:statusFilters
            });
        }
        // if(classFilters){
        //     filterGroups.push({
        //         key:"class",
        //         type:"vpicon-fenlei",
        //         text:"类别",
        //         filters:classFilters
        //     });
        // }
        //专业给漏洞修复流程增加批量处理功能。只能处理第一步的数据。
        filterGroups.push({
            key:"batchApply",
            type:"vpicon-handle",
            text:"批量处理",
            filters:[{name:'待处理',value:'666'}]
        });

        let filterVal = {
            filtervalue: filtervalue,
            currentkey: currentkey,
            openKeys: [currentkey],
        }
        this.setState({
            ...filterVal,
            filters: filterGroups,
        });
        this.changeQueryParams({
            filtervalue,currentkey
        });
    }
}
CustomListFilter = ListFilter.createClass(CustomListFilter);

class MyEntityList extends Component {
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



export default MyEntityList;