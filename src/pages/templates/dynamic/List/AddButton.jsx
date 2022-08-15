import React, { Component } from 'react'
import {
    VpButton,
    VpDropdown,
    VpIconFont,
    VpMenu,
    VpMenuItem,
    VpTooltip,
    vpQuery,
    VpIcon,
    VpTabs,
    VpTabPane,
    VpFormCreate
} from "vpreact";
import {QuickCreate, RightBox} from "vpbusiness";
import DynamicForm from '../DynamicForm/DynamicForm';
import {connect} from 'react-redux';
import {changeQueryParams,setContext} from 'reduxs/actions/action';
import {randomKey} from "../utils";
import { requireFile } from 'utils/utils';

/**
 * 添加按钮
 */
class AddButton extends Component {
    constructor(props){
        super(props);
        this.state = {
            classList:null,
            viewcode:'',
            currentclassid:'',
            newformurl:''
        }
        this.closeRightModal = this.closeRightModal.bind(this);
        this._formcontextid = randomKey();
    }

    componentWillMount() {
        this.queryclassList();
        this.queryNewForm();
    }

    /**
     * 自定义add按钮类别
     */
    getCustomClassList(){
        return '/{vpplat}/vfrm/tasks/classList';
    }

    queryNewForm = () => {
        vpQuery('/{vpplat}/vfrm/entity/newformurl', {
            entityid: this.props.entityid
        }).then((response) => {
            let newformurl = response.data;
            this.setState({
                newformurl
            })
        });
    }
    /**
     * 查询实体类别，绑定表单
     */
    queryclassList = () => {
        vpQuery(this.getCustomClassList(), {
            entityid: this.props.entityid
        }).then((response) => {
            let classList = response.data
            this.setState({
                classList
            })
            if(this.props.entityid == 2){
                if(classList.length == 1){
                    let viewcode = classList[0].scode
                    let currentclassid = classList[0].iid
                    this.setState({
                        viewcode,
                        currentclassid
                    });
                }
            }
        })
    }


    /**
     * 新增实体： 选择实体类别后触发
     * @param e
     */
    handleNewFormClick=(e)=>{
        let viewcode = e.key.split(",")[1]
        let currentclassid = e.key.split(",")[0]
        this.setState({
            statusList: [],
            showRightBox: true,
            defaultActiveKey: '0',
            viewcode,
            currentclassid
        })
    }

    // 新增实体，没有多个实体类别时点击触发
    addNewAttr = (e) => {
        let viewcode = ''
        let currentclassid = ''
        let {classList} = this.state
        if(classList.length == 1){
            viewcode = classList[0].scode
            currentclassid = classList[0].iid
        }
        this.setState({
            showRightBox: true,
            statusList: [],
            defaultActiveKey: '0',
            viewcode,
            currentclassid
        });
    }

    changeQueryParams(queryParams){       
        this.props.changeQueryParams && this.props.changeQueryParams(queryParams);
    }

    /**
     * 设置成表单不加载状态
     */
    setFormSubmiting = (flag) => {
        this.props.setFormSubmiting && this.props.setFormSubmiting(this._formcontextid,flag);
    }

    /**
     * 渲染新建表单
     * @returns {*}
     */
    getFormClass(){
        return !this.state.newformurl ? DynamicForm: requireFile(this.state.newformurl)
    }
    /**
     * 表单自定义属性
     * @returns {}
     */
    getFormOptions(){
        return {

        }
    }

    getRightBoxOptions(){
        return {}
    }

    onSaveSuccess(formData,btnName){
        if(btnName === 'ok'){
            this.closeRightModal();
        }
    }

    renderNewForm = () => {    
        let params = {
            iid: this.props.iid,
            entityrole: true,
            entityid: this.props.entityid,
            formType:this.props.formType, //分辨出这个实体挂在tab页的，还是一级实体
            mainentity:  this.props.mainentityid,  //从左边导航点进来的实体ID
            mainentityiid:  this.props.mainentityiid,       //主实体的当前行数据ID
            stabparam: this.props.stabparam,
            data:{
                currentclassid: this.state.currentclassid,
                viewcode: this.state.viewcode
            }
        }
        let DynamicForm = this.getFormClass();
        return (
            <VpTabs defaultActiveKey={'0'} destroyInactiveTabPane>
                {
                        <VpTabPane tab='属性' key={'0'} >
                            <DynamicForm
                                entityid={this.props.entityid}
                                params={params}
                                entityrole={true}
                                onSaveSuccess={this.onSaveSuccess}
                                closeRightModal={this.closeRightModal}
                                reloadTable={this.reloadTable.bind(this)}
                                changeQueryParams={this.changeQueryParams}
                                add={true}
                                formType={params.formType}
                                stabparam={params.stabparam}
                                mainentity={params.mainentity}
                                mainentityiid={params.mainentityiid}
                                //注入参数
                                {...this.getFormOptions()}
                            />
                        </VpTabPane>
                }
            </VpTabs>
        );
    }
    // 关闭右侧弹出
    closeRightModal() {       
        this.setState({
            showRightBox: false,
        }, () => {
            this.changeQueryParams({
                _k:new Date().getTime()
            })
        })
        this.setFormSubmiting(false);
        //this.props.setBreadCrumb()
    }
    
    // sl. 刷新table页
    reloadTable(){
        console.log('rreloadTable');
        
        this.changeQueryParams({
            _k:new Date().getTime()
        })
    }

    render() {
        let _this = this;
        if(!this.state.classList || !this.state.classList.length){
            return null;
        }

        /**
         * 实体类型选择
         */
        const classList = (
            <VpMenu onClick={this.handleNewFormClick}>
                {
                    this.state.classList.map((item, index) => {
                        return <VpMenuItem key={item.iid + ',' + item.scode}><VpIconFont type={item.icon} /> {item.sname}</VpMenuItem>
                    })

                }
            </VpMenu>
        )
        return (
            <div style={{display:'inline-block'}}  className="text-left">
                {
                    this.state.classList.length > 1 ?
                        <VpTooltip placement="top" title={this.props.title||'快速创建'}>
                            <VpDropdown
                                trigger={['click']}
                                overlay={classList}
                            >
                                <div style={{display: 'inline-block'}}>
                                    <VpButton type="primary" shape="circle" icon="plus" className="m-l-xs"/>
                                </div>
                            </VpDropdown>
                        </VpTooltip> :
                        <div style={{display: 'inline-block'}} onClick={_this.addNewAttr}><QuickCreate/></div>
                }
                <RightBox
                    //关联页签新建弹半框
                    max={this.props.formType != 'tabs'}
                    button={
                        <div className="icon p-xs" onClick={this.closeRightModal}>
                            <VpTooltip placement="top" title=''>
                                <VpIcon type="right" />
                            </VpTooltip>
                        </div>}
                    show={this.state.showRightBox}
                    {...this.getRightBoxOptions()}>
                    
                    {this.state.showRightBox ? this.renderNewForm() : null}></RightBox>
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
        changeQueryParams:function(queryParams){
            dispatch(changeQueryParams(ownProps._contextid,queryParams));
        },
        setFormSubmiting : (contextid,submiting) =>{
            dispatch(setContext(contextid,{
                submiting
            }));
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
export default createClass(AddButton);