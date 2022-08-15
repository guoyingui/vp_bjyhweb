import React, { Component } from "react"
import {common, xqbg, validationRequireField, singleInputFill} from '../code';
import FlowForm from "../../../templates/dynamic/Flow/FlowForm";
import {VpButton, VpModal, vpQuery, VpTable} from "vpreact";
import {findWidgetByName} from "../../../templates/dynamic/Form/Widgets";
import { VpAlertMsg } from 'vpreact';

//需求变更--流程--项目经理发送领导审批
class gbmldspFlowApprovalForm extends FlowForm.Component {

    constructor(props) {
        super(props)
        this.state={
            ...this.state,
            his_rev:false,  // 历史变更模态框显示隐藏
            historyReview_table_headers:[],//历史变更表头
            historyReview_data_url:"/{bjyh}/xqbg/getHistoryChangeData",
            historyReview_data:[]
        }
        this.state.moduserprops={
            ismoduser:true,//是否启用更改处理人
            ajaxurl:'',//数据源接口地址：不定义则使用默认地址
            moduserCondition:[{//更改处理人用户列表查询条件
                field_name:'idepartmentid',
                field_value:"1109",
                expression:'in'
            }]
        }
    }

    onGetFormDataSuccess = data => {
        let _this = this
        let rbgsqbm = findWidgetByName.call(data.form,"rbgsqbm").field.widget.default_value ;
        
        if (common.username == xqbg.zongyongtao_code) {
            vpQuery('/{vpplat}/vfrm/entity/listDatas', {
                entityid:1,
                condition:JSON.stringify([{
                    field_name:'sname',
                    field_value:'开发部',
                    expression:'like'
                }])
            }).then(res=>{
                if(res.data){
                    let ids = []
                    res.data.map(item=>{
                        ids.push(item.iid)
                    })

                    let moduserprops = {
                        ismoduser:true,
                        ajaxurl:'',
                        moduserCondition:[]
                    }
                    let moduserCondition = []
                    moduserCondition[0] = {
                        field_value: ids.toString(),
                        field_name: 'idepartmentid',
                        expression: 'in'
                    }
                    moduserprops.moduserCondition = moduserCondition
                    _this.setState({
                        moduserprops:moduserprops
                    },()=>{
                        //_this.getButtons()
                    })
                }
            })

        }
        console.log('_this', rbgsqbm)
        console.log('data', )
        return new Promise(resolve => {
            /**
             * 获取当前登录人所在部门编号
             * @param callback
             */
            vpQuery('/{bjyh}/xqbg/isBgsqbm',{ curDepId: common.idepartmentid, bgDepId: rbgsqbm
            }).then((res) => {
                if (res.data != null) {
                    _this.setState({ flag: res.data },()=>{
                        resolve(data)
                    })
                }
            })

        })
        
    }

    /**
     * 表单数据加载成功后
     * @param formData
     */
    onDataLoadSuccess = formData => {
        // let rbgsqbm = formData.findWidgetByName('rbgsqbm').field.fieldProps.initialValue // 变更申请部门ID
        // let idepartmentid = common.idepartmentid // 当前登录人部门ID
        let username = common.username // 当前登录人username

        let sbgsqbmyj = 'sbgsqbmyj'     // 变更申请部门意见
        let sxxxtkfbyj = 'sxxxtkfbyj'   // 软件开发部意见
        let sxxkjglbyj = 'sxxkjglbyj'   // 信息科技管理部意见
        console.log("this", this.props.iobjectid);
        //72.如超过 领导审批步骤中增加提醒“本项目实施周期已超过*月”；
        vpQuery('/{bjyh}/xqbg/whetherSpecialProject',{ id: this.props.iobjectid
        }).then((res) => {
            console.log("res.data.sfcczq",res.data.sfcczq);
            
            if (res.data.sfcczq) {
                VpAlertMsg({
                    message:'超时提醒',
                    description:'本项目实施周期已超过'+res.data.ccys+'月', 
                    closeText:'关闭',
                    type:'info', 
                    showIcon:true
                },30);
            }
        })
        
        // 1. 当前登录部门为 变更申请部门
        if (this.state.flag) {
            return new Promise(resolve => {
                this.getThisRole((res) => {
                    if (res) {
                        // 1.1 当前登录人 不是张华 或 不是软件开发部 则关闭软件开发部
                        if (username != xqbg.zhanghua_code && res.indexOf(xqbg.rjkfbbh) == -1) {
                            this.retractNode(formData, sxxxtkfbyj)
                        }
                        // 1.2 当前登录人 不是信息科技管理部 则关闭信息科技管理部
                        if (res.indexOf(xqbg.xxkjglbbh) == -1) {
                            this.retractNode(formData, sxxkjglbyj)
                        }
                    }
                    resolve(formData)
                })
            })
        } else { // 2. 当前登录部门非 变更申请部门
            // 2.1 关闭变更申请部门
            this.retractNode(formData, sbgsqbmyj)
            return new Promise(resolve => {
                this.getThisRole((res) => {
                    if (res) {
                        // 2.2 当前登录人 不是张华 或 不是软件开发部 则关闭软件开发部 否则关闭信息科技管理部
                        username != xqbg.zhanghua_code && res.indexOf(xqbg.rjkfbbh) == -1 ? this.retractNode(formData, sxxxtkfbyj) : this.retractNode(formData, sxxkjglbyj)
                    }
                    resolve(formData)
                })
            })
        }

    }

    /**
     * 收起指定节点
     * @param formData
     * @param fieldName
     */
    retractNode = (formData, fieldName) => {
        let nodeValue = formData.findWidgetByName(fieldName)
        nodeValue.field.props.disabled = true
        formData.groups[nodeValue.groupIndex].group_type = 2
    }

    /**
     * 获取当前登录人所在部门编号
     * @param callback
     */
    getThisRole(callback) {
        vpQuery('/{bjyh}/xqbg/getDepartmentCodeById',{ id: common.idepartmentid
        }).then((response) => {
            if (response.data != null) {
                callback(response.data)
            }
            callback(null)
        })
    }

    /**
     * 监听单选框
     * @param e
     */
    handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let scondition = e.target.value
        // 校验标志
        let flag = scondition == 'SYSJ' ? true : false
        // let rbgsqbm = _this.props.form.getFieldValue('rbgsqbm') // 变更申请人
        // let idepartmentid = common.idepartmentid // 变更申请部门ID
        let username = common.username // 当前登录人username

        let sbgsqbmyj = 'sbgsqbmyj'     // 变更申请部门意见
        let sxxxtkfbyj = 'sxxxtkfbyj'   // 软件开发部意见
        let sxxkjglbyj = 'sxxkjglbyj'   // 信息科技管理部意见

        // 1. 当前登录部门为 变更申请部门
        if (this.state.flag) {
            validationRequireField(_this, sbgsqbmyj, flag)
            return new Promise(resolve => {
                this.getThisRole((res) => {
                    if (res) {
                        // 1.1 当前登录人 是张华 或 是软件开发部 则校验软件开发部
                        if (username == xqbg.zhanghua_code || res.indexOf(xqbg.rjkfbbh) != -1) {
                            validationRequireField(_this, sxxxtkfbyj, flag)
                        }
                        // 1.2 当前登录人 是信息科技管理部 则校验信息科技管理部
                        if (res.indexOf(xqbg.xxkjglbbh) != -1) {
                            validationRequireField(_this, sxxkjglbyj, flag)
                        }
                    }
                })
            })
        } else { // 2. 当前登录部门非 变更申请部门
            return new Promise(resolve => {
                this.getThisRole((res) => {
                    if (res) {
                        username == xqbg.zhanghua_code || res.indexOf(xqbg.rjkfbbh) != -1 ? validationRequireField(_this, sxxxtkfbyj, flag) : validationRequireField(_this, sxxkjglbyj, flag)
                    }
                })
            })
        }
    }

    /**
     * 保存前事件
     * @param formData
     * @param btnName
     */
    onBeforeSave = (formData, btnName) => {
        // let _this = this
        // let rbgsqbm = _this.props.form.getFieldValue('rbgsqbm') // 变更申请部门ID
        // let idepartmentid = common.idepartmentid // 当前登录人ID
        let username = common.username // 当前登录人username

        // 1. 当前登录部门为 变更申请部门
        if (this.state.flag) {
            return new Promise(resolve => {
                this.getThisRole((res) => {
                    if (res) {
                        if (username == xqbg.zhanghua_code || res.indexOf(xqbg.rjkfbbh) != -1) {
                            singleInputFill(formData, btnName, 'sxxxtkfbyj', true)
                            singleInputFill(formData, btnName, 'sbgsqbmyj', false)
                        } else if (res.indexOf(xqbg.xxkjglbbh) != -1) {
                            singleInputFill(formData, btnName, 'sxxkjglbyj', true)
                            singleInputFill(formData, btnName, 'sbgsqbmyj', false)
                        } else {
                            singleInputFill(formData, btnName, 'sbgsqbmyj', true)
                        }
                    }
                    resolve(formData)
                })
            })
        } else { // 2. 当前登录部门非 变更申请部门
            return new Promise(resolve => {
                this.getThisRole((res) => {
                    if (res) {
                        if (username == xqbg.zhanghua_code || res.indexOf(xqbg.rjkfbbh) != -1) {
                            singleInputFill(formData, btnName, 'sxxxtkfbyj', true)
                        } else {
                            singleInputFill(formData, btnName, 'sxxkjglbyj', true)
                        }
                    }
                    resolve(formData)
                })
            })
        }
    }



    componentWillMount() {
        let _this = this
        super.componentWillMount()
        vpQuery('/{vpplat}/vfrm/entity/listDatas', {
            entityid:1,
            condition:JSON.stringify([{
                field_name:'SSEQUENCEKEY',
                field_value:'100000008001',//	D000801
                expression:'like'
            }])
        }).then(res=>{
            if(res.data){
                let ids = []
                res.data.map(item=>{ ids.push(item.iid) })

                vpQuery('/{vpplat}/vfrm/entity/listDatas', {
                    entityid:1,
                    condition:JSON.stringify([{
                        field_name:'scode',
                        field_value:'D0010',//	D000801
                        expression:'like'
                    }])
                }).then(res=>{
                    if(res.data){
                        let ides = []
                        res.data.map(item=>{ ides.push(item.iid) })
                        console.log("ids1:"+ides);
                        //查询金科运开发部id 拼到‘开发负责人’的查询条件中去
                    vpQuery('/{vpplat}/vfrm/entity/listDatas', {
                        entityid: 1,
                        condition: JSON.stringify([{
                            field_name: 'idepartmentid',
                            field_value: "100013,"+ides.toString(),
                            expression: 'in'
                        }])
                    }).then(res => {
                        if (res.data) {
                            let jkywIds = res.data[0].iid
                            if (jkywIds) {
                                let formData = _this.state.formData
                                let moduserprops=_this.state.moduserprops
                                moduserprops.moduserCondition[0].field_value = jkywIds + ',' + ids.toString()+',1134'
                                _this.setState({ moduserprops: moduserprops, })
                            }
                        }
                    })
                    }
                });
            }
        })
    }

    //底部按钮设置
    getCustomeButtons(){
        let buttons = this.props.buttons;
        if(!buttons){
            //如果没有自定义按钮，用默认的
            buttons = [];
            if(this.props.staskid){
                buttons.push("ok");
                buttons.push("save");
                if(this.props.ijump){
                    //自由跳转
                    buttons.push("jump");
                }
                if(this.props.usermode){
                    //修改处理人
                    buttons.push("moduser");
                }
            }
            buttons.push({
                name: "historyReviewBnt",
                text: "历史变更",
                validate: false,
                handler: this.historyReviewBnt,
                className: `vp-btn-br`,
                size: "default"
            });
            buttons.push("cancel");
        }
        return buttons;
    }

    historyReviewBnt = () => {
        this.setState({his_rev:true})
        this.setFormSubmiting(false)
    }

    //名称、变更工作量、变更比例(%)、累计变更工作量(%)、提出日期）
    historyReview = () => {
        let _this = this
        let headerNew = [
            { title: '名称', dataIndex: 'sname',key:'sname',
                render:  (text, record) => {
                    return text
                }
            },
            { title: '变更工作量', dataIndex: 'fbggzlry',key:'fbggzlry',
                render:  (text, record) => {
                    return text
                }
            },
            { title: '变更比例(%)', dataIndex: 'fbgzlbfb',key:'fbgzlbfb',
                render:  (text, record) => {
                    return text
                }
            },
            { title: '累计变更工作量(%)', dataIndex: 'fljbggzl',key:'fljbggzl',
                render:  (text, record) => {
                    return text
                }
            },
            { title: '提出日期', dataIndex: 'dproposetime',key:'dproposetime',type:'date',
                render:  (text, record) => {
                    return text
                }
            }
        ];
        _this.setState({historyReview_table_headers: headerNew})
    }
    closeHistoryReview = () => {
        this.setState({ his_rev: false });
    }
    getHistoryReview = () => {
        return (<div className="split-modal-content f14">
            <div className="p-sm" style={{mixHeight:'320px' ,maxHeight: '350px', overflow: 'auto' }}>
                <VpTable
                    className="m-tb-sm"
                    controlAddButton={
                        (numPerPage, resultList) => {
                            this.controlAddButton_ods(numPerPage, resultList)
                        }
                    }
                    params={{
                        iobjectid: this.props.iobjectid
                    }}
                    pagination={false}
                    columns={this.state.historyReview_table_headers}
                    dataUrl={this.state.historyReview_data_url}

                />
            </div>
        </div>)
    }

    render(){
        return (
            <div className="full-height">
                {super.render()}
                <VpModal
                    title="历史变更"
                    width="60%"
                    visible={this.state.his_rev}
                    onCancel={this.closeHistoryReview}
                    footer={
                        <div className="text-center">
                            <VpButton type="primary" onClick={this.closeHistoryReview}>关闭</VpButton>
                        </div>
                    }>
                    {this.getHistoryReview()}
                </VpModal>
            </div>
        )
    }
}

gbmldspFlowApprovalForm = FlowForm.createClass(gbmldspFlowApprovalForm)
export default gbmldspFlowApprovalForm
