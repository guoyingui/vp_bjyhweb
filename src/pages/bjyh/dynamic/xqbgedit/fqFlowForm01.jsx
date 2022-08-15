import React, {
    Component
} from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';

import { validationRequireField, singleInputFill } from '../code';
import { vpQuery, vpAdd, VpAlertMsg } from "vpreact";

class fqFlowForm01 extends FlowForm.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            deptList: ""
        }
    }
    //自定义控件行为
    onDataLoadSuccess = formData => {
        let _this = this;
        const isHistory = _this.props.isHistory//是否历史数据
        console.log("isHistory1", isHistory)

        let ryscssp = formData.findWidgetByName('ryscssp')
        ryscssp.field.props.modalProps.ajaxurl = '/{bjyh}/ZKXmsxFrom/queryNameByUsers';
        ryscssp.field.props.modalProps.condition = ['业务部领导', vp.cookie.getTkInfo('idepartmentid')];

    }
    onGetFormDataSuccess = data => {
        let _this = this
        console.log("this", _this)
        let url = window.vp.config.jgjk.ylxz.getXqylDeptList;
        let jsonPara = {
            flow_id: _this.props.piid
        }
        vpQuery('/{bjyh}/xqyl/model/qeurySjzdLead').then((res)=>{
                console.log("res:",res)
                if(res){
                    this.setState({ deptList: res.data.iid })
                }
        })


        return new Promise(resolve => {

            vpAdd(url, {
                jsonPara: JSON.stringify(jsonPara)
            }).then((response) => {
                // console.log("response1", response)
                // console.log("response1", response.rows)
                // console.log("response1。response.total", response.total)
            // console.log("response1。response.total", response.total>0)
            let flag=response.total>0
            // console.log("flag", flag)
            if(flag){
                    data.handlers.map(item => {
                        // console.log("item:", item)
                        item.searchCondition = [{
                            field_name: 'idepartmentid',
                            field_value: "select iid from ORG_DEPARTMENT where iid in (" + response.rows[0] + ","+this.state.deptList+") or IDEPARTMENTID in (" + response.rows[0] + ","+this.state.deptList+")",
                            expression: 'in'
                        }
                        ]
                    })
                }else{
                    data.handlers.map(item => {
                        // console.log("item:", item)
                        item.searchCondition = [{
                            field_name: 'idepartmentid',
                            field_value: "select iid from ORG_DEPARTMENT where iid in ("+this.state.deptList+") or IDEPARTMENTID in ("+this.state.deptList+")",
                            expression: 'in'
                        }
                        ]
                    })
                }
                resolve(data)
            })
        })
    }
    //子页面接口调用父页面重置下一步处理人条件过滤
    change = () => {
        let _this = this
        // console.log("deptList",this.state.deptList);
        console.log(" this.props.formData.", this.props.formData);
        let url = window.vp.config.jgjk.ylxz.getXqylDeptList;
        let jsonPara = {
            flow_id: _this.props.piid
        }
        vpAdd(url, {
            jsonPara: JSON.stringify(jsonPara)
        }).then((response) => {
            // console.log("response2", response)
            // console.log("response2", response.rows)
            // console.log("response2。response.total", response.total)
            // console.log("response2。response.total", response.total>0)
            let flag=response.total>0
            // console.log("flag", flag)
            if(flag){
                this.props.formData.handlers[0].searchCondition[0].field_value = "select iid from ORG_DEPARTMENT where iid in (" + response.rows[0] + ","+this.state.deptList+") or IDEPARTMENTID in (" + response.rows[0] + ","+this.state.deptList+")";
            }else{
                this.props.formData.handlers[0].searchCondition[0].field_value = "select iid from ORG_DEPARTMENT where iid in ("+this.state.deptList+") or IDEPARTMENTID in ("+this.state.deptList+")";
            }
        })
    }

    /**
     * 表单提交前
     * @param formData
     * @returns {Promise<any>}
     */
    onBeforeSave = (formData, btnName) => {
        console.log("formData", formData)
        let _this = this
        let url = window.vp.config.jgjk.ylxz.getXqylDeptList;
        let jsonPara = {
            flow_id: formData.piid
        }
        let ideptids = "";
        return new Promise(resolve => {
            vpAdd(url, {
                jsonPara: JSON.stringify(jsonPara)
            }).then((response) => {
                console.log("response", response.rows[0])
                ideptids = response.rows[0]+","+this.state.deptList;
                console.log("11111")
                vpAdd("/{bjyh}/xqyl/model/checkFqlcclr", {
                    ideptids: ideptids,
                    userid: formData.sparam,
                    flowkey:"xqylbglc"
                }).then((response) => {
                    console.log("response", response)
                    if (!response.data.flag) {
                        if (response.data.state == "2") {
                            VpAlertMsg({
                                message: "消息提示",
                                description: "部门：" + response.data.deptname + ",选择了多个人，请修改！",
                                type: "error",
                                onClose: this.onClose,
                                closeText: "关闭",
                                showIcon: true
                            }, 5);
                        } else if (response.data.state == "3") {
                            VpAlertMsg({
                                message: "消息提示",
                                description: "部门：" + response.data.deptname + ",未选择用户处理，请选择！",
                                type: "error",
                                onClose: this.onClose,
                                closeText: "关闭",
                                showIcon: true
                            }, 5);
                        }
                        console.log("222222")
                        resolve(response.data.flag)
                    }
                    if (response.data.flag) {
                        console.log("33333")
                        resolve(response.data.flag)
                    }
                })
            })
        })
    }

}
fqFlowForm01 = FlowForm.createClass(fqFlowForm01);
export default fqFlowForm01;