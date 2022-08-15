import React, { Component } from 'react'
import {
    VpIcon,
    VpTooltip,
    VpRow,
    VpCol,
    VpIconFont,
    VpRadioButton,
    VpRadioGroup,
    VpSpin, vpQuery,
} from 'vpreact';
import './index.less';
import { requireFile } from 'utils/utils';
import {connect} from 'react-redux';
import {changeQueryParams} from 'reduxs/actions/action';

import ListFilter from './ListFilter';
import NormalTable from './NormalTable';
import EditTable from './EditTable';
import AddButton from './AddButton';
import ExportButton from './ExportButton';
import SearchButton from './SearchButton';


import {
    CheckRadio,
    SeachInput,
} from 'vpbusiness';
import {mergeButtons,randomKey} from "../utils";


/**
 * 列表组件
 * 列表组件包含几个子组件，对不同位置得定制需要继承不同得子组件
 * NormalTable 普通表格
 * EditTable 编辑表格
 * ListFilter 过滤器
 * AddButton 添加按钮
 * ExportButton 导出按钮
 * SearchButton 查询按钮
 *  SearchForm 查询表单
 *
 * 列表组件提供以下扩展接口，具体使用方法见接口注释
 * getCustomeButtons 自定义表头上面的操作按钮
 * renderNormalTable 自定义普通表格
 * renderEditTable 自定义编辑表格
 * renderTableFilter 自定义过滤器
 * renderViewSwitch 自定义视图切换
 * getFilterPosition 自定义过滤器位置，返回 "left" (左边)、"top"(快速搜索栏右侧）
 *
 * 示例1: 表头添加自定义按钮
 * import EntityList from '/pages/templates/dynamic/List/index';
 * class CustomizedEntityList extends  EntityList.Component{
        getCustomeButtons(){
            //自定义按钮
            let _this = this;
            return ["add","export","search",{
                name:"cust",
                render:function(_thislist,props){
                    return (
                        <VpButton type="ghost" shape="circle" className="m-l-xs" onClick={_this.onCustBtnClick}>
                            <VpIcon type="book" />
                        </VpButton>
                    )
                }
            }]
        }
 * }
 * CustomizedEntityList = EntityList.createClass(CustomizedEntityList); //一定记得调用此方法
 *
 * 示例2：自定义普通表格，普通表格添加虚拟列，表格右侧操作栏添加自定义按钮
 * import EntityList from '/pages/templates/dynamic/List/index';
 * const NormalTable = EntityList.NormalTable;
 * //1. 继承NormalTable类，重写相应扩展接口
 * class CustomNormalTable extends NormalTable.Component{
 *     ...重写表格扩展接口，具体写法见NormalTable的注释
 * }
 * CustomNormalTable = NormalTable.createClass(CustomNormalTable); //一定记得调用此方法
 * //2. 继承EntityList类，重写renderNormalTable方法
 * class CustomEntityList extends EntityList.Component{
 *   renderNormalTable(props){
        return <CustomNormalTable {...props} />; //返回自定义的表格
    }
 * }
 *
 * 示例3：自定义新增表单
 * import EntityList from '/pages/templates/dynamic/List/index';
 * import AddButton from '/pages/templates/dynamic/List/AddButton';
 * import DynamicForm from "/pages/templates/dynamic/DynamicForm/DynamicForm";
 * //1. 自定义新增表单
 * class CustomDynamicForm extends DynamicForm.Component{
 *     ...重写表单扩展接口，详见DynamicForm类的注释
 * }
 * CustomDynamicForm = DynamicForm.createClass(CustomDynamicForm); //一定记得调用此方法
 * //2. 自定义添加按钮
 * class CustomAddButton extends AddButton.Component{
 *     getFormClass(){
          return CustomDynamicForm; //放回自定义表单类
       }
 * }
 * CustomAddButton = AddButton.createClass(CustomAddButton);
 * //3. 重写表单的添加按钮扩展接口
 * class CustomEntityList extends EntityList.Component{
 *     getCustomeButtons(){
        let _this = this;
        return [{
            name:"add",
            render:function(_thislist,props){
                return (
                    <CustomAddButton {...props} /> //返回自定义添加表单
                )
            }
        },"export","search"];
 * }
 * CustomEntityList = EntityList.createClass(CustomEntityList);
 *
 *
 *示例4： 定制列表上方按钮,系统默认提供以下按钮
 * add 添加按钮
 * export 导出
 * search 查询
 *
 * 按钮格式{
 *  name:"add", //名称
        render:function(_thislist,props){
            //渲染动作，_thislist：当前列表实列;props表格属性，默认包含entityid(实体id),_contextid(上下文id)
            return (
                <AddButton {...props} />
            )
        }
 * }
 *
 * 示例：去掉添加按钮，新加挂起按钮，同时保留添加搜索、导入导出按钮
 * import EntityList from '/pages/templates/dynamic/List/index';
 *
 * //先写自定义按钮
 * class HangButton extends Component{
 *      render(){
 *          ...写自定义按钮代码
 *      }
 * }
 *  //重写EntityList提供的自定义按钮方法
 * class CustomizedEntityList extends  EntityList.Component{
 *      getCustomeButtons(){
 *          let buttons = [];
 *          //添加自定义按钮
 *          buttons.push({
 *              name:"hang",
 *              render:function(_thislist,props){
 *                  return (
 *                      <HangButton {...props} /> //返回自定义按钮
 *                  )
 *              }
 *          })
 *          buttons.push({
 *              "export" //如果不修改默认按钮，直接传入名称
 *          })
 *          buttons.push({
 *              "search" //如果不修改默认按钮，直接传入名称
 *          })
 *      }
 * }
 * CustomizedEntityList = EntityList.createClass(CustomizedEntityList); //一定记得调用此方法
 */
class EntityList extends Component {
    /**
     * type: 视图数据类型，list,tree,edit
     * @param props
     */
    constructor(props) {
        super(props);

        this.state = {
            entityaddrole:true,
            spinning: false,
            shrinkShow:props.shrinkShow || 'true', //显示过滤器
            isaddflag:false
        }
        this.handleViewChange = this.handleViewChange.bind(this);
        //给当前list起个唯一名称
        this._contextid = this.props._contextid||randomKey();

        this.props.onRef && this.props.onRef(this); //将对象注册到父类中
    }

    componentWillMount() {
        this.initViewType(this.props);
        this.initQueryParams(this.props);
        this.getConfig();
    }
    initQueryParams(props){
        let params = {
            entityid: props.entityid,
            datafilter: props.datafilter || 'auth',//权限过滤需要加这个参数
            quickSearch:'',
            filtervalue: '',
            condition: "[]",
            defaultCondition:props.defaultCondition
        }
        if(props.formType == "tabs"){
            //以下是在关联实体标签页中有的参数
            params = {
                ...params,
                ientityid: props.mainentityid, //主实体entityid,
                iid:props.mainentityiid, //关联实体iid
                stabparam:props.stabparam, //关联实体关系字段编码
                isTab:true, //是否是标签页中
            }
        }

        this.changeQueryParams(params);
    }

    /**
     * 初始设置视图模式
     *
     * @private
     */
    initViewType(props){
        let viewtype //视图数据类型，后端取数时的数据类型，普通：list、树形：tree,编辑：initeditlist
        let view; //视图类型，显示列表：list,编辑列表：edit
        if(props.type == 'tree'){
            //树行模式的也用列表展示
            viewtype = "tree";
            view = "list";
        }else if(props.type == 'edit'){
            viewtype = "editlist"
            view = "edit";
        }else{
            viewtype = props.type||"list";
            view = props.type||"list";
        }
        this.setState({
            viewtype,
            view
        });
        this.changeQueryParams({
            viewtype
        });
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.initViewType(nextProps);
    }

    //获取实体相关信息
    getConfig(){
        let _this = this
        //获取导航数据
        if(_this.props.entityid == null){
            return;
        }
        vpQuery('/{vpplat}/vfrm/entity/getConfig', {
            entityid: _this.props.entityid
        }).then(function (data) {
            if (data.hasOwnProperty('data')) {
                let filterData,filtervalue;
                if (data.data.hasOwnProperty('search')) {
                    filterData = data.data.search
                    filtervalue = data.data.lastview
                }
                if(filterData){
                    let {filters,statusFilters,classFilters} = filterData;
                    if(filters){
                        filters.push({
                            value:"0",
                            name:"全部"
                        });
                    }
                    if(statusFilters){
                        statusFilters.push({
                            value:"0",
                            name:"全部"
                        });
                    }
                    if(classFilters){
                        classFilters.push({
                            value:"0",
                            name:"全部"
                        });
                    }
                }
                let entityaddrole = _this.props.entityrole;
                if(entityaddrole == null){
                    //只有当没有明确指定entityrole值时才使用查询结果中的entityaddrole
                    entityaddrole = _this.state.entityaddrole;
                    if (data.data.hasOwnProperty('toolbar') && data.data.hasOwnProperty('entityrole')) {
                        entityaddrole = data.data.entityrole;
                    }
                }

                _this.setState({
                    filterData:filterData,
                    filtervalue:filtervalue,
                    entityaddrole:entityaddrole
                });
            }
        })
    }


    // 搜索框确定事件
    handlesearch = (value) => {
        const searchVal = value.replace(/\s/g, "");
        this.changeQueryParams({
            quickSearch: searchVal
        });
    }
    changeQueryParams(queryParams){
        this.props.changeQueryParams && this.props.changeQueryParams(this._contextid,queryParams);
    }

    //左侧过滤器栏伸缩
    shrinkLeft = (e) => {
        this.setState({
            shrinkShow: !this.state.shrinkShow
        })
    }

    /**
     * 自定义按钮
     * @return {GamepadButton[] | number}
     */
    getCustomeButtons() {
        let customBtns = this.props.buttons;
        if(!customBtns){
            //没有自定义按钮时，用默认的
            customBtns = [];
            if(this.state.entityaddrole){
                if(this.state.addflag == '1'){
                    customBtns.push("add");
                }
                customBtns.push("export");
            }
            customBtns.push("search");
        }
        return customBtns;
    }

    /**
     * 系统默认的按钮，系统默认提供add、export、search按钮
     */
    getDefaultButtons(){
        let defaultBtns = {
            "export":{
                name:"export",
                render:function(_thislist,props){
                    return (
                        <ExportButton {...props} />
                    )
                }
            },
            "search":{
                name:"search",
                render:function(_thislist,props){
                    return (
                        <SearchButton {...props} />
                    )
                }
            }
        }
        let addBtn = {
            name:"add",
            render:function(_thislist,props){
                return (
                    <AddButton {...props} />
                )
            }}
        defaultBtns.add = addBtn;
        return defaultBtns;
    }
    /**
     * 渲染按钮
     * @returns {*}
     */
    renderButtons() {
        let defaultBtns = this.getDefaultButtons();
        let customBtns = this.getCustomeButtons();
        let newButtons = mergeButtons(customBtns,defaultBtns);
        return newButtons.map((btnItem,btnIndex) => {
            let {render,name,...props} = btnItem;
            props = props||{};
            props.entityid=this.props.entityid,
                props._contextid=this._contextid;
            props.mainentityid = this.props.mainentityid; //关联关系标签页中的主实体id
            props.mainentityiid = this.props.mainentityiid; //关联关系标签页中的主实体id
            props.stabparam = this.props.stabparam; //关联关系标签页中的主实体id
            props.formType = this.props.formType; //是否是在关联关系标签页中，如果formType=’tabs',表示在标签页中
            props.entityaddrole = this.state.entityaddrole; //是否有编辑权限
            return render&&render(this,props);
        });
    }


    /**
     * 获取子组件NormalTable 中传过来的参数，用来控制新建
     * @param {*} value
     */
    getAddflag(value1,value2){
        let isaddflag = value1
        let addflag = value2
        this.setState({
            isaddflag,
            addflag
        })
    }



    /**
     * 渲染列表
     * @param props{
     *     entityid:this.props.entityid, //实体id
            entityaddrole:this.state.entityaddrole, //是否有添加权限，true/false
            _contextid:this._contextid, //上下文id
            mainentityid:this.props.mainentityid, //关联关系标签页中的主实体id
            mainentityiid:this.props.mainentityiid, //关联关系标签页中的主实体id
            stabparam : this.props.stabparam, //关联关系标签页中的主实体id
            formType : this.props.formType, //是否是在关联关系标签页中，如果formType=’tabs',表示在标签页中
     * }
     * @returns {*}
     */
    renderNormalTable(props){
        return <NormalTable  {...props}/>;
    }

    /**
     * 渲染编辑表格
     * @param props{
     *     entityid:this.props.entityid, //实体id
            entityaddrole:this.state.entityaddrole, //是否有添加权限，true/false
            _contextid:this._contextid, //上下文id
            mainentityid:this.props.mainentityid, //关联关系标签页中的主实体id
            mainentityiid:this.props.mainentityiid, //关联关系标签页中的主实体id
            stabparam : this.props.stabparam, //关联关系标签页中的主实体id
            formType : this.props.formType, //是否是在关联关系标签页中，如果formType=’tabs',表示在标签页中
     * }
     * @returns {*}
     */
    renderEditTable(props){
        return <EditTable {...props}/>;
    }

    _renderTableFilter(){
        let {filtervalue,currentkey} = this.props;
        let props = {
            _contextid:this._contextid,
            entityid:this.props.entityid,
            filterData:this.state.filterData,
            filtervalue:filtervalue||this.state.filtervalue,
            currentkey:currentkey,
            position:this.getFilterPosition()
        }
        return this.renderTableFilter(props);
    }
    /**
     * 渲染过滤器
     * @returns {*}
     */
    renderTableFilter(props){
        return <ListFilter {...props}/>;
    }

    //看板视图(列表、编辑)切换
    handleViewChange(e) {
        let view = e.target.value;
        let viewtype //视图数据类型，后端取数时的数据类型，普通：list、树形：tree,编辑：editlist

        if(view == 'list'){
            //普通列表模式
            if(props.type == 'tree'){
                //树行模式的也用列表展示
                viewtype = "tree";
            }else{
                viewtype = props.type||"list";
            }
        }else if(view == 'edit'){
            viewtype = "editlist";
        }

        this.setState({
            view: view,
            viewtype: viewtype
        });
        this.changeQueryParams({
            viewtype
        });
    }
    /**
     * 列表视图切换
     * @returns {*}
     */
    renderViewSwitch(){
         if(!this.state.entityaddrole){
            this.state.viewtype = this.props.type||'list';
            this.state.view = 'list';
            return null;
        }
        /*
        return (
            <div className="fr m-l-xs">
                <VpRadioGroup defaultValue={this.state.view||'list'} className="radio-tab" onChange={this.handleViewChange}>
                    <VpRadioButton value="list">
                        <VpTooltip placement="top" title="列表视图">
                            <VpIconFont type="vpicon-navlist" />
                        </VpTooltip>
                    </VpRadioButton>
                    <VpRadioButton value="edit">
                        <VpTooltip placement="top" title="编辑视图">
                            <VpIconFont type="vpicon-fenlei" />
                        </VpTooltip>
                    </VpRadioButton>
                </VpRadioGroup>
            </div>
        ) */
        return null
    }

    /**
     * 持有表格ref
     * @param ref
     */
    onTableRef = (ref) => {
        this.tableRef = ref;
    }
    /**
     * 渲染列表
     */
    renderTable(){
        let listProps = {
            entityid:this.props.entityid,
            entityaddrole:this.state.entityaddrole,
            _contextid:this._contextid,
            mainentityid:this.props.mainentityid, //关联关系标签页中的主实体id
            mainentityiid:this.props.mainentityiid, //关联关系标签页中的主实体id
            stabparam : this.props.stabparam, //关联关系标签页中的主实体id
            formType : this.props.formType, //是否是在关联关系标签页中，如果formType=’tabs',表示在标签页中
            onRef:this.onTableRef, //持有表格ref
            getAddflag:this.getAddflag.bind(this)
        };
        return this.state.view=='edit'?this.renderEditTable(listProps):this.renderNormalTable(listProps)
    }

    /**
     * 获取过滤器位置
     * @returns
     * "left" 表格左边
     * "top" 快速搜索栏右侧
     * "none" 不显示
     */
    getFilterPosition(){
        if(this.props.filterPosition){
            return  this.props.filterPosition;
        }
        return "left";
    }
    
    //是否显示搜索
    showSearchInput(){
        return true
    }

    render() {
        const _this = this;
        return (
            <div className="business-container pr full-height entity">
                <div className="subAssembly b-b bg-white" style={this.props.style}>
                    <VpRow gutter={10}>
                        <VpCol className="gutter-row" span={4}>
                        {this.showSearchInput()?
                            <div className="m-b-sm search entitysearch" >
                                <SeachInput onSearch={this.handlesearch} />
                            </div>
                        :null}
                        </VpCol>
                        {
                            this.getFilterPosition() === 'top'?
                                (<VpCol className="gutter-row check-radio" span={16}>
                                    {this._renderTableFilter()}
                                </VpCol>):null
                        }
                        <VpCol className="gutter-row text-right" span={this.getFilterPosition() === 'top'?4:20}>
                            { this.state.isaddflag?
                                this.renderButtons():''
                            }
                            {
                                this.renderViewSwitch()
                            }
                        </VpCol>
                    </VpRow>
                </div>

                <div className="business-wrapper p-t-sm full-height" id="table">
                    <div className="bg-white p-sm entity-list full-height">
                        <VpRow gutter={16} className="full-height">
                            {
                                this.getFilterPosition() === 'left'?(
                                    /*过滤器显示在左边时，才会显示左边过滤器*/
                                    <VpCol span={this.state.shrinkShow ? '4' : '0'} className="full-height pr menuleft">
                                        {this._renderTableFilter()}
                                        {this.state.shrinkShow ?
                                            <div className="navswitch cursor text-center" onClick={this.shrinkLeft}>
                                                <VpIconFont type="vpicon-navclose" />
                                            </div>
                                            :
                                            null
                                        }

                                    </VpCol>
                                ):null
                            }
                            <VpCol span={this.state.shrinkShow&&this.getFilterPosition() === 'left' ? '20' : '24'} className="full-height scroll-y">
                                {/*过滤器显示在左边时，才会显示左边过滤器*/}
                                {this.state.shrinkShow||this.getFilterPosition() !== 'left' ?
                                    null
                                    :
                                    <div className="shrink p-tb-sm cursor text-center" onClick={this.shrinkLeft}>
                                        <VpIconFont type="vpicon-navopen" />
                                    </div>
                                }
                                <VpSpin spinning={this.state.spinning} size="large">
                                    {
                                        this.renderTable()
                                    }
                                </VpSpin>
                            </VpCol>
                        </VpRow>
                    </div>
                </div>

                <div className="drawer-fixed p-sm hide">
                    <div className="pr full-height">
                        <div className="spin-icon" onclick="closeDrawer">
                            <VpIcon type="verticle-left" />
                        </div>
                        <div className="drawer-box">

                        </div>
                    </div>
                </div>
            </div>
        );
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
    wrapClass.createClass = createClass;
    wrapClass.NormalTable = NormalTable;
    wrapClass.EditTable = EditTable;
    wrapClass.ListFilter = ListFilter;
    return wrapClass;
}
export default createClass(EntityList);