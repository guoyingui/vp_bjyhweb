import React, { Component } from "react";
import FlowForm from "../../../templates/dynamic/Flow/FlowForm";
import { singleInputFill, validationRequireField } from '../code';
import { vpQuery, VpConfirm, vpAdd } from "vpreact";
import { findFiledByName } from 'utils/utils';

//系统负责人上传文档
class xtfzrscwdFlowForm03 extends FlowForm.Component {
    constructor(props) {
        super(props);
    }

    onDataLoadSuccess = (formData, handlers) => {
        const _this = this
        let ixqfh7 = formData.findWidgetByName('ixqfh7');
        ixqfh7.field.props.label = "是否与需求符合";
        let rfj = formData.findWidgetByName('rfj');
        rfj && (rfj.field.fieldProps.onChange = (v, v1) => {
            //子页面point
            const childTableRowData = _this.sxsqChildPageRef ? _this.sxsqChildPageRef.state.tableRowData : null
            if (childTableRowData && childTableRowData.length) {
                //从子页面获取当前登陆人所负责系统
                let sysname = '';
                const userid = vp.cookie.getTkInfo('userid')
                childTableRowData.map(ele => { userid == ele.sysroleid && (sysname = ele.sysname) })
                //拼上系统名称
                const fileUpdate = this.state.fileUpdate || [];
                sysname && v.map(item => {
                    const filename = item.filename;
                    const s = item.ext ? filename.substr(filename, filename.lastIndexOf('.')) : filename
                    const e = filename.substr(filename.lastIndexOf('.'))
                    item.filename = s + '_' + sysname + e
                    item.fileid && (fileUpdate.push({ fileid: item.fileid, filename: item.filename }))
                })
                _this.setState({ fileUpdate: fileUpdate })
            }
        })
    }

    onSaveSuccess = (response, btnName, formData) => {
        const _this = this
        //新增的文件名字处理
        const fileArr = _this.rfjRef.state.childNodes;
        console.log("fileArr", fileArr);
        let fileUpdate = [];
        fileArr.map(item => {
            fileUpdate.push({ fileid: item.fileid, filename: item.filename })
        })
        console.log("fileUpdate", fileUpdate);
        if (fileUpdate && fileUpdate.length) {
            vpAdd('/{bjyh}/sxsqChildPage/updateFileName', { fileInfo: JSON.stringify(fileUpdate) })
        }
        //将多个附件字段合并到wfent表中去
        if (btnName === 'ok') {
            let sparam = JSON.parse(formData.sparam)
            let fileIds = sparam.hasOwnProperty('rfj') ? sparam['rfj'] : '';
            fileIds && vpAdd('/{bjyh}/sxsqChildPage/synFlowFileField', {
                fileIds: fileIds,
                piid: _this.props.piid,
                stepDefKey: _this.props.formData.curtask.stepkey
            })
        }
    }

    onGetFormDataSuccess = data => {
        data.form.groups.map(item => {
            if (item.group_label == '基本信息') {
                item.fields.map(item1 => {
                    if (item1.field_name == 'rfj') {
                        item1.sxsqflag = true;
                    }
                })
            }
        })
    }
}

xtfzrscwdFlowForm03 = FlowForm.createClass(xtfzrscwdFlowForm03);
export default xtfzrscwdFlowForm03;