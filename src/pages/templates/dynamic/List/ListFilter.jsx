import React, { Component } from 'react'
import './index.less';
import { requireFile } from 'utils/utils';
import {VpIconFont, VpMenu, VpMenuItem, vpQuery, VpSubMenu,VpRadioGroup,VpRadioButton } from "vpreact";
import {connect} from 'react-redux';
import {changeQueryParams} from 'reduxs/actions/action';
import {CheckRadio} from "vpbusiness";



/**
 *
 * @param props
 * entityid  string 实体id
 * filterValue string 默认过滤值
 * openKeys array 默认展开的过滤器组
 */
class ListFilter extends Component {

    constructor(props) {
        super(props)
        let {filtervalue,currentkey} = props;

        this.state = {
            filters: null,
            openKeys: [currentkey],
            filtervalue:filtervalue,
        }

        this.handleClick = this.handleClick.bind(this);
    }

    componentWillMount() {
        this.getFilters(this.props);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if(!this.state.filters && nextProps.filterData){
            //第一次没有加载过滤器数据，第二次有过滤器数据时
            this.getFilters(nextProps);
        }
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
        if(classFilters){
            filterGroups.push({
                key:"class",
                type:"vpicon-fenlei",
                text:"类别",
                filters:classFilters
            });
        }

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

    /**
     * 改变查询条件
     * @param queryParams
     */
    changeQueryParams(queryParams){
        this.props.changeQueryParams && this.props.changeQueryParams(queryParams);
    }

    /**
     * 过滤器变更事件
     */
    onChange(filterVal){
        this.setState(filterVal);
        this.changeQueryParams(filterVal);
    }

    //点击菜单
    handleClick = (e) => {
        let filterVal;
        if(this.props.position === 'top'){
            //如果是头部显示的话
            let filtervalue = e.target.value;
            filterVal ={
                filtervalue
            }
        }else{
            let filtervalue = e.key;
            let openKeys = e.keyPath.slice(1);
            let currentkey = e.keyPath.slice(1)[0];
            filterVal = {
                filtervalue,
                openKeys,
                currentkey
            }
        }
        if (this.state.filtervalue == filterVal.filtervalue && this.state.currentkey == filterVal.currentkey) {
            return;
        }
        this.onChange(filterVal);
    }

    onToggle = (info) => {
        this.setState({
            openKeys: info.open ? info.keyPath : info.keyPath.slice(1),
        });
    }

    render(){
        if(!this.state.filters || !this.state.filters.length){
            return null;
        }
        if(this.props.position === 'top'){
            // return <CheckRadio filterData={this.state.filters[0].filters} defaultValue={this.state.filtervalue} onChange={this.handleClick} />;
            return <VpRadioGroup className="m-b-sm"   showType="button" defaultValue={this.state.filtervalue} onChange={this.handleClick} >
                {
                    this.state.filters[0].filters.map(item=>{
                         return <VpRadioButton value={item.value}>{item.name}</VpRadioButton>
                    })
                }
            </VpRadioGroup>
        }

        return (
            <VpMenu className="full-height scroll-y entity-left-css" onClick={this.handleClick}
                    openKeys={this.state.openKeys}
                    onOpen={this.onToggle}
                    onClose={this.onToggle}
                    selectedKeys={[this.state.filtervalue]}
                    mode="inline">
                {
                    this.state.filters.map((groupItem,groupIndex) => {
                        return (
                            <VpSubMenu key={groupItem.key} title={<span><VpIconFont type={groupItem.type} className="m-r-xs" /><span>{groupItem.text}</span></span>}>
                                {
                                    groupItem.filters.map((item, index) => {
                                        return <VpMenuItem key={item.value} className="menu-text-overflow">{item.name}</VpMenuItem>
                                    })
                                }
                            </VpSubMenu>
                        );
                    })
                }
            </VpMenu>
        )
    }
}



function mapStateToProps(state,ownProps){
    return {
        queryParams:state[ownProps._contextid]
    }
}

function mapToDispatchToProps(dispatch,ownProps){
    return {
        changeQueryParams:function(queryParams){
            dispatch(changeQueryParams(ownProps._contextid,queryParams));
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
    wrapClass.createClass = createClass;
    return wrapClass;
}
export default createClass(ListFilter);
