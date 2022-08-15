import React, { Component } from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';

import {
    vpQuery, vpAdd, VpAlertMsg
} from 'vpreact';

class xmjltjlcFlowForm01 extends FlowForm.Component {
    constructor(props) {
        super(props);
    }

    // 加载成功后执行
    onDataLoadSuccess = (formData,_handlers) => {
        let _this = this;
        if(!_this.props.isHistory){
            //申请名称自动生成
            const sname = formData.findWidgetByName('sname');
            const ssqmc = formData.findWidgetByName('ssqmc');
            const pjName = sname && sname.field.fieldProps.initialValue + '架构评审'
            _this.props.form.setFieldsValue({
                ssqmc: pjName
            })
            console.log(_this ,sname);
            
            //带出需求提出人
            vpAdd('/{vpplat}/objteam/getObjTeam',{
                ientityid:_this.props.iobjectentityid,
                iid:_this.props.iobjectid
            }).then(res=>{
                if(res){
                    const setFieldObj = {}
                    res.data.data.map(item=>{
                        switch (item.iroleid*1) {
                            case 1000018://项目经理
                                setFieldObj.rxqtcr = item.iuserid
                                setFieldObj.rxqtcr_label = item.username
                                break;
                            case 1000014:
                                setFieldObj.rxqtcr = item.iuserid
                                setFieldObj.rxqtcr_label = item.username
                                break;
                            case 6:
                                setFieldObj.rxmjl = item.iuserid
                                setFieldObj.rxmjl_label = item.username
                                break;    
                        }
                    })

                    //需求提出人联系方式
                    vpQuery('/{bjyh}/fhzjxmsq/getUserInfoByUserId',{
                        id: setFieldObj.rxqtcr
                    }).then(res=>{
                        if(res.data){
                            _this.props.form.setFieldsValue({
                                sxqtcrlxfs: res.data.sphone || ''
                            })
                        }       
                    })
                    _this.props.form.setFieldsValue(setFieldObj)
                }       
            })
            //业务主管部门：查询项目涉及系统中的‘业务主管部门’
            vpQuery('{bjyh}/designReview/getProjectSystemMainDpt',{
                projectID: _this.props.iobjectid
            }).then(res => {
                if(res.data){
                    const arr = res.data
                    const arrID = []
                    const arrValue = []
                    const ywfzrValue = []
                    const ywfzrID = []
                    const xk = []
                    const kf = []
                    arr.map(item => {
                        item.dptid && arrID.push(item.dptid)
                        item.dptname && arrValue.push(item.dptname)
                        item.ywfzrnames && ywfzrValue.push(item.ywfzrnames)
                        item.ywfzrids && ywfzrID.push(item.ywfzrids)
                        item.xkfzzname && xk.push(item.xkfzzname)
                        item.kffzzname && kf.push(item.kffzzname)
                    })
                    _this.props.form.setFieldsValue({
                        sywzgbm: arrValue.length ? arrValue.join(',') : '',
                        sywfzr: ywfzrValue.length ? ywfzrValue.join(',') : '',
                        sxkfzz: xk.length ? xk.join(',') : '',
                        srkfzz: kf.length ? kf.join(',') : '',
                    })
                }
            })
            
            //预设处理人 带出开发负责人、运营代表
            const ryydb = formData.findWidgetByName('ryydb');
            const rkffzr = formData.findWidgetByName('rkffzr');
            const arr = []
            arr.push(ryydb.field.fieldProps.initialValue)
            arr.push(rkffzr.field.fieldProps.initialValue)
            const arr2 = []
            arr2.push(ryydb.field.props.initialName)
            arr2.push(rkffzr.field.props.initialName)
            _this.props.form.setFieldsValue({
                [_handlers[0].stepkey]:arr.join(','),
                [_handlers[0].stepkey+'_label']:arr2.join(','),
            })

        }
        
    }

    onBeforeSave = (_formData,_btnName)=>{
        // singleInputFill(formData, btnName, 'sbgsclyj', true)
        // singleInputFill(formData, btnName, 'sbgsspyj', true)

    }   

}
xmjltjlcFlowForm01 = FlowForm.createClass(xmjltjlcFlowForm01);
export default xmjltjlcFlowForm01;