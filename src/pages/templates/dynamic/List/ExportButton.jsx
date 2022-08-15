import React, { Component } from 'react'
import {
    VpButton,
    VpDropdown,
    VpMenu,
    VpMenuItem,
    VpTooltip,
    vpQuery,
    VpIcon,
    vpDownLoad, VpAlertMsg, VpInputUploader, VpModal, VpFormCreate, VpTabs
} from "vpreact";
import {connect} from 'react-redux';
import {changeQueryParams} from 'reduxs/actions/action';

/**
 * 添加按钮
 */
class ExportButton extends Component {
    constructor(props){
        super(props);
        this.state = {
            exList:null,
            viewcode:'',
            currentclassid:'',
            showError:false,
            errinfo:[]
        }
    }
    componentWillMount() {
        this.exTypeData();
    }

    //获取导出类型
    exTypeData = () => {
        vpQuery('/{vpplat}/vfrm/entity/exListType', {
            entityid: this.props.entityid
        }).then((repsonse) => {
            this.setState({
                exList: repsonse.data
            })
        })
    }


    changeQueryParams(queryParams){
        this.props.changeQueryParams && this.props.changeQueryParams(queryParams);
    }

  
    /**
     * 获取查询条件
     * @returns {*|{}}
     */
    getQueryParams(){
        //合并默认查询条件
        let {defaultCondition,...otherParams} = this.props.queryParams||{};
        otherParams = otherParams||{};
        if(defaultCondition){
            let condition = otherParams.condition;
            defaultCondition = JSON.parse(defaultCondition);
            if(condition){
                condition = JSON.parse(condition);
            }else{
                condition = [];
            }
            condition = condition.concat(defaultCondition);
            otherParams.condition = JSON.stringify(condition);
        }
        otherParams.quickvalue = otherParams.quickSearch;
        return otherParams;
    }



    //导入导出模板点击事件
    handleMenuClick = (e) => {
        let type = e.item.props.type
        let key = e.key
        if (type == 5) {
            //导入
            this.setState({
                entityVisible: true
            })
        } else {
            //导出数据
            vpDownLoad("/{vpplat}/vfrm/ent/exportfile", {
                type: 'expdata',
                viewcode: 'expexcel',
                ...this.getQueryParams(),
                ientityid: this.props.entityid
            });
        }
    }

    handleSubmit = (type) => {
        if (type == 'upload') {
            //导入数据
            this.inputUploader.upload.upload()
        } else {
            //导出模板数据
            vpDownLoad("/{vpplat}/vfrm/ent/exportfile",
                {
                    ientityid: this.props.entityid,
                    type: ''
                })
        }
    }

    uploadSuccess = (file, res) => {
        if(!!res.data&&res.data!=''){
            //let errinfo = res.data.join('\n');
            this.setState({
                showError: true,
                errinfo:res.data||[]
            });
            VpAlertMsg({
                message: "消息提示",
                description:"导入失败",
                type: "warning",
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 5)
        }else{
            VpAlertMsg({
                message: "消息提示",
                description: '导入成功！',
                type: "success",
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 5)
            this.setState({
                entityVisible: false
            });
        }

        this.changeQueryParams({
            _k:new Date().getTime()
        });
    }

    uploadClick = () => {
        this.inputUploader.upload.on("beforeFileQueued", (file) => {
            this.props.form.setFieldsValue({ "xls_label": file.name })
        })
    }

    //关闭变迁状态弹出的模态框
    cancelModal = () => {
        this.setState({
            visible: false,
            entityVisible: false,
            varilsForm: {},
            showError:false,
            errinfo:[]
        })
    }


    render() {
        let _this = this;
        if(!this.state.exList || !this.state.exList.length){
            return null;
        }

        //导入导出下拉选项
        const extypeList = (
            <VpMenu onClick={this.handleMenuClick}>
                {
                    _this.state.exList.map((item, index) => {
                        return (
                            <VpMenuItem key={item.iid} type={item.iviewtype}>{item.sname}</VpMenuItem>
                        )
                    })
                }
            </VpMenu>
        )
        return (

            <div style={{display:'inline-block'}}  className="text-left">
                <VpDropdown
                    trigger={['click']}
                    overlay={extypeList}
                >
                    <div style={{ display: 'inline-block' }}>
                        <VpTooltip placement="top" title="导入导出">
                            <VpButton type="ghost" shape="circle" className="m-l-xs">
                                <VpIcon type="cloud-upload" />
                            </VpButton>
                        </VpTooltip>
                    </div>
                </VpDropdown>
                <VpModal
                    title='实体导入'
                    visible={this.state.entityVisible}
                    onCancel={() => this.cancelModal()}
                    width={'70%'}
                    footer={null}
                    wrapClassName='modal-no-footer'
                >
                    {
                        this.state.entityVisible ?
                            <div onClick={this.uploadClick}>
                                <VpInputUploader form={this.props.form} item={{
                                    field_name: "xls",
                                    widget_type: "inputupload",
                                    field_label: "选择文件",
                                    all_line: 2,
                                    tips: '请选择文件（*.xls,*.xlsx)',
                                    auto: false,
                                    widget: {
                                        accept: {
                                            title: 'Xls',
                                            extensions: 'xlsx,xls',
                                        },
                                        upload_url: window.vp.config.URL.localHost + "/zuul/{vpplat}/vfrm/ent/importfileforentity?entityid=" + this.props.entityid,
                                    }
                                }}
                                                 ref={upload => this.inputUploader = upload}
                                                 onUploadAccept={this.uploadSuccess} />
                            </div>
                            : null
                    }
                    
                    {this.state.showError?
                        <div className='text-content' style={{'height':'80%'}}>
                            <ul>
                                {this.state.errinfo.map((item,i)=>{
                                    return <li>{item}</li>     
                                })}
                            </ul>
                        </div>
                    :null}

                    <div className="footFixed p-sm b-t text-center">
                        <VpButton type="primary" onClick={() => this.handleSubmit('upload')}>导入数据</VpButton>
                        <VpButton style={{ marginLeft: '10px' }} type="primary" onClick={() => this.handleSubmit('download')}>下载模板</VpButton>
                    </div>
                </VpModal>
            </div>
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
    let wrapClass = VpFormCreate(connect(mapStateToProps,mapToDispatchToProps)(newClass));
    wrapClass.Component = newClass;
    wrapClass.createClass = createClass;
    return wrapClass;
}
export default createClass(ExportButton);