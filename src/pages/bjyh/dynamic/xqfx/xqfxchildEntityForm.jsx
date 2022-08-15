import React, { Component } from "react";
import {
    vpAdd,
    VpIconFont,
    VpTable,
    VpModal,
    VpInput,
    VpIcon,
    VpTooltip,
    VpButton,
    VpWidgetGroup,
    VpAlertMsg,
} from "vpreact";
import { EditTableCol } from 'vpbusiness';
import EditTable from '../../../templates/dynamic/List/EditTable';
import XqfxchildFormModel from './xqfxchildFormModel'
import { Input, Checkbox } from 'antd';

const { Search } = Input;
// 需求分析流程--流程子表单
class xqfxchildEntityForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            number: 1,
            tableRowData: {
                ssxt: '',
                ssxtvalue: '',
                sfrlwb: '否',
                ssgs: '',
                ssgsvalue: '',
                xmglhn: 0,
                xmglhw: 0,
                xqfxhn: 0,
                xqfxhw: 0,
                sjkfhn: 0,
                sjkfhw: 0,
                jccshn: 0,
                jccshw: 0,
                xncshn: 0,
                xncshw: 0,
                sxzchn: 0,
                sxzchw: 0,
                xthjhn: 0,
                xthjhw: 0,
            },
            entityid: props.entityid,
            objectid: props.iid,
            processid: props.piid,
            showSelectEntity: false,
            selectEntityData: [],
            entityVisible: false,
            searchStr: '',
            selectedRowKeys: [],
            selectItem: [],
            table_userHeaders: '',
            entity_data_url: '',
            showModel: false, // 显示弹窗
            select_type: '', // 弹窗单选/复选
            model_name: '', // 弹窗字段搜索
            flag: true, // 弹窗请求地址 true: 表 ， false: 字段,
        }
        this.registerSubForm();
    }

    componentWillMount() {
        this.getEditHeader();
        this.registerSubForm();
    }

    componentDidMount() {
        const width = top.window.outerWidth;
        $(".entityTable").css('height', 300);
        //绑定子页面对象到window
        if (!window.flowtabs) {
            window.flowtabs = {};
        }
    }

    /**
     * 注册子表单到父表单参数
     */
    getRegisterSubFormOptions() {
        return {
            asyncSave: true, //是否是同时保存主子表，如果为true,则子表单类必须实现getFormValues接口,如果为false,则实现onSave接口
            onValidate: "onValidate", //如果默认的onValidate与类有冲突时，可以使用自定义名称替换onValidate函数
            onSave: "onSave",  //如果默认的onSave与类有冲突时，可以使用自定义名称替换onSave函数
            getFormValues: "getFormValues", //如果默认的getFormValues与类有冲突时，可以使用自定义名称替换getFormValues函数
            //onMainFormSaveSuccess: "onMainFormSaveSuccess"  //同步保存时，主表单保存成功后
        }
    }

    //注册子表单到父表单中,
    registerSubForm() {
        //调用this.props.registerSubForm注册子表单到父表单中，父表单返回父表单this
        this.parentForm = this.props.registerSubForm(this.props.field_name, this, this.getRegisterSubFormOptions());
    }

    onSave(options, successCallback, errorCallback) {
        errorCallback(null, null)
    }

    getFormValues(options, callback) {
        let sparam = JSON.stringify(this.state.tableRowData);
        console.log("sparam", sparam);
        let objectid = this.state.objectid;
        let processid = this.state.processid;
        vpAdd('/{bjyh}/xzxt/saveGs', { sparam: sparam, objectid: objectid, processid: processid }).then((response) => {

            if (response.success == '0') {
                callback(null, null)
            } else {
                this.alertMsg('保存子页面错误！', 'error')
                callback(true, null)
            }
        })
    }

    onMainFormSaveSuccess(saveReturnData) {
        //this.listRef.tableRef.reloadTable();
    }

    alertMsg = (desc, type, message) => {
        return (
            VpAlertMsg({
                message: message || "消息提示",
                description: desc || '!',
                type: type || 'info',
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 3)
        )
    }

    /**
     * 校验接口,提供给父表单保存前校验时调用
     * @param callback function(errors,values){
     *
     * } 交验后回调
     * @param options {
     *     btnName,触发按钮名称
     * }
     */
    onValidate(options, callback) {
        //如果需要取父表单数据，可以通过this.parentForm.props.form.getFieldsValue()取到
        console.log('onValidate.', options.btnName);
        switch (options.btnName) {
            case 'ok':
                let _accesserData = this.state.tableRowData
                if (_accesserData.length == 0) {
                    this.alertMsg('必须填写工作量信息！', 'error')
                    callback(true, null)
                }
                _accesserData.map((item, i) => {
                    if (item.ssxt == '') {
                        this.alertMsg('系统不能为空！', 'error')
                        callback(true, null)
                    }
                    if (item.xmglhn == null || item.xmglhw == null
                        || item.xqfxhn == null || item.xqfxhw == null
                        || item.sjkfhn == null || item.sjkfhw == null
                        || item.jccshn == null || item.jccshw == null
                        || item.xncshn == null || item.xncshw == null
                        || item.sxzchn == null || item.sxzchw == null) {
                        this.alertMsg('每个工作量不能为空！', 'error')
                        callback(true, null)
                    }
                    if (item.sfrlwb == '是' && item.ssgs == '') {
                        this.alertMsg('是否人力外包是的情况必须选择公司！', 'error')
                        callback(true, null)
                    }
                })
                callback(null, null)
                break;
            case 'save':
                _accesserData = this.state.tableRowData
                if (_accesserData.length == 0) {
                    this.alertMsg('必须填写工作量信息！', 'error')
                    callback(true, null)
                }
                _accesserData.map((item, i) => {
                    if (item.ssxt == '') {
                        this.alertMsg('系统不能为空！', 'error')
                        callback(true, null)
                    }
                    if (item.xmglhn == null || item.xmglhw == null
                        || item.xqfxhn == null || item.xqfxhw == null
                        || item.sjkfhn == null || item.sjkfhw == null
                        || item.jccshn == null || item.jccshw == null
                        || item.xncshn == null || item.xncshw == null
                        || item.sxzchn == null || item.sxzchw == null) {
                        this.alertMsg('每个工作量不能为空！', 'error')
                        callback(true, null)
                    }
                    if (item.sfrlwb == '是' && item.ssgs == '') {
                        this.alertMsg('是否人力外包是的情况必须选择公司！', 'error')
                        callback(true, null)
                    }
                })
                callback(null, null)
                break;
        }
    }

    controlAddButton = (numPerPage, resultList) => {
        this.state.tableRowData = resultList;
        this.state.number += resultList.length;
        this.state.save_number = resultList.length;
    }

    // 删除项
    remove = (k) => {
        this.state.tableRowData.splice(k, 1);
        this.setState({
            tableRowData: this.state.tableRowData,
        }, () => {
            this.controlAddButton(0, this.state.tableRowData);
            console.log("bbb", this.state.tableRowData);
        });
    }

    toDecimal = (x) => {
        var f = parseFloat(x);
        if (isNaN(f)) { return; }
        f = Math.round(x * 100) / 100;
        return f;
    }

    ssxtSelect = (index) => {
        this.setState({ showModel: true, model_name: '系统查询' }, () => {
            this.setParamsToChild('ssxt', true, index)
        })
        this.setState({ flag: true });
    }

    ssxtValue = (text, record, index) => {
        return text
    }

    ssgsSelect = (index) => {
        this.setState({ showModel: true, model_name: '公司' }, () => {
            this.setParamsToChild('ssgs', true, index)
        })
        this.setState({ flag: false });
    }

    ssgsValue = (text, record, index) => {
        return text
    }

    // 下拉
    selectFn(record, index) {
        this.state.tableRowData[index].sfrlwb = record.sfrlwb;
        if(record.sfrlwb == "否"){
            this.state.tableRowData[index].ssgs = "";
            this.state.tableRowData[index].ssgsvalue = "";
        }
        this.setState({
            tableRowData: this.state.tableRowData,
        }, () => {
            this.tableRef.setTableData(this.state.tableRowData);
        });
    }

    // input校验
    changeFn(e, index, i) {
        e.target.value = e.target.value.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符 
        e.target.value = e.target.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的 
        e.target.value = e.target.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        e.target.value = e.target.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数 
        if (e.target.value.indexOf(".") < 0 && e.target.value != "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额 
            e.target.value = parseFloat(e.target.value);
        }
        this.state.tableRowData[index][i] = e.target.value
        this.setState({
            tableRowData: this.state.tableRowData,
        }, () => {
            this.tableRef.setTableData(this.state.tableRowData);
        });
    }

    blurFn(e, index, i) {
        let _accesserData = this.state.tableRowData
        if (/hn$/g.test(i)) {
            this.state.tableRowData[index].xthjhn = 0
            this.state.tableRowData[index].xthjhn = (Number(this.state.tableRowData[index].xmglhn) +
                Number(this.state.tableRowData[index].xqfxhn) + Number(this.state.tableRowData[index].sjkfhn) +
                Number(this.state.tableRowData[index].jccshn) + Number(this.state.tableRowData[index].xncshn) +
                Number(this.state.tableRowData[index].sxzchn) + Number(this.state.tableRowData[index].xthjhn));
            var m_hnrt = '0';
            _accesserData.map((item, i) => {
                m_hnrt = Number(m_hnrt) + Number(item.xthjhn)
            })
            this.parentForm.props.form.setFieldsValue({
                shnrt: String(m_hnrt),
                shnry: String(this.toDecimal(m_hnrt / 22)),
                fkfgzl: String(this.toDecimal(m_hnrt / 22)),
            })
        } else {
            this.state.tableRowData[index].xthjhw = 0
            this.state.tableRowData[index].xthjhw = (Number(this.state.tableRowData[index].xmglhw) +
                Number(this.state.tableRowData[index].xqfxhw) + Number(this.state.tableRowData[index].sjkfhw) +
                Number(this.state.tableRowData[index].jccshw) + Number(this.state.tableRowData[index].xncshw) +
                Number(this.state.tableRowData[index].sxzchw) + Number(this.state.tableRowData[index].xthjhw))
            var m_hwrt = '0';
            _accesserData.map((item, i) => {
                m_hwrt = Number(m_hwrt) + Number(item.xthjhw)
            })
            this.parentForm.props.form.setFieldsValue({
                shwrt: String(m_hwrt),
                shwry: String(this.toDecimal(m_hwrt / 22)),
                fwbgzl: String(this.toDecimal(m_hwrt / 22)),
            })
        }
        this.setState({
            tableRowData: this.state.tableRowData,
        }, () => {
            this.tableRef.setTableData(this.state.tableRowData);
        });
    }

    Value = (text, record, index) => {
        return text
    }

    /**
     * 获取表头
     */
    getEditHeader = () => {
        let _this = this;
        const el_sfrlwb = React.createElement(
            'span',
            { style: { display: 'inline-block', width: '60%', wordWrap: 'break-word', whiteSpace: 'normal' } },
            '是否人力外包'
        );
        const el_xmglhn = React.createElement(
            'span',
            { style: { display: 'inline-block', width: '60%', wordWrap: 'break-word', whiteSpace: 'normal' } },
            '项目管理行内'
        );
        const el_xmglhw = React.createElement(
            'span',
            { style: { display: 'inline-block', width: '60%', wordWrap: 'break-word', whiteSpace: 'normal' } },
            '项目管理行外'
        );
        const el_xqfxhn = React.createElement(
            'span',
            { style: { display: 'inline-block', width: '60%', wordWrap: 'break-word', whiteSpace: 'normal' } },
            '需求分析行内'
        );
        const el_xqfxhw = React.createElement(
            'span',
            { style: { display: 'inline-block', width: '60%', wordWrap: 'break-word', whiteSpace: 'normal' } },
            '需求分析行外'
        );
        const el_sjkfhn = React.createElement(
            'span',
            { style: { display: 'inline-block', width: '60%', wordWrap: 'break-word', whiteSpace: 'normal' } },
            '设计开发行内'
        );
        const el_sjkfhw = React.createElement(
            'span',
            { style: { display: 'inline-block', width: '60%', wordWrap: 'break-word', whiteSpace: 'normal' } },
            '设计开发行外'
        );
        const el_jccshn = React.createElement(
            'span',
            { style: { display: 'inline-block', width: '60%', wordWrap: 'break-word', whiteSpace: 'normal' } },
            '测试行内'
        );
        const el_jccshw = React.createElement(
            'span',
            { style: { display: 'inline-block', width: '60%', wordWrap: 'break-word', whiteSpace: 'normal' } },
            '测试行外'
        );

        const el_xncshn = React.createElement(
            'span',
            { style: { display: 'inline-block', width: '60%', wordWrap: 'break-word', whiteSpace: 'normal' } },
            '性能测试行内'
        );
        const el_xncshw = React.createElement(
            'span',
            { style: { display: 'inline-block', width: '60%', wordWrap: 'break-word', whiteSpace: 'normal' } },
            '性能测试行外'
        );

        const el_sxzchn = React.createElement(
            'span',
            { style: { display: 'inline-block', width: '60%', wordWrap: 'break-word', whiteSpace: 'normal' } },
            '上线支持行内'
        );
        const el_sxzchw = React.createElement(
            'span',
            { style: { display: 'inline-block', width: '60%', wordWrap: 'break-word', whiteSpace: 'normal' } },
            '上线支持行外'
        );

        const el_xthjhn = React.createElement(
            'span',
            { style: { display: 'inline-block', width: '60%', wordWrap: 'break-word', whiteSpace: 'normal' } },
            '系统合计行内'
        );
        const el_xthjhw = React.createElement(
            'span',
            { style: { display: 'inline-block', width: '60%', wordWrap: 'break-word', whiteSpace: 'normal' } },
            '系统合计行外'
        );
        let _headerNew = [
            {
                title: "操作",
                key: "operate",
                dataIndex: "operate",
                width: 20,
                render: (text, record, k) => {
                    return (
                        <div>
                            <VpTooltip placement="right" title="删除">
                                <VpIconFont className="cursor m-lr-xs f16 text-danger" type="vpicon-shanchu" onClick={() => this.remove(k)} />
                            </VpTooltip>
                        </div>
                    )
                }
            },
            {
                title: '系统',
                dataIndex: 'ssxt',
                key: 'ssxt',
                render: (text, record, index) => {
                    let widget = {
                        "widget_type": "text",
                        "widget_name": "ssxt"
                    }
                    return (
                        <VpTooltip placement="top" title={text}>
                            <VpInput disabled="true" value={this.ssxtValue(text, record, index)} onClick={() => this.ssxtSelect(index)} suffix={
                                <VpIcon onClick={() => this.ssxtSelect(index)} type='search' style={{ marginTop: 7 }} />
                            } />
                        </VpTooltip>
                    )
                }
            },
            {
                title: el_sfrlwb, dataIndex: 'sfrlwb', key: 'sfrlwb', width: 34,
                render: (text, record, index) => {
                    let widget = {
                        "widget_type": "select",
                        "widget_name": "sfrlwb",
                        "default_value_name": "sfrlwb",
                        "load_template": [
                            { "value": "是", "label": '是' },
                            { "value": "否", "label": '否' }
                        ]
                    }
                    return (
                        <EditTableCol
                            value={text}
                            record={record}
                            id="iid"
                            callBack={() => { _this.selectFn(record, index) }}
                            widget={widget} />
                    )
                }
            },
            {
                title: '公司', dataIndex: 'ssgs', key: 'ssgs',
                render: (text, record, index) => {
                    let widget = {
                        "widget_type": "text",
                        "widget_name": "ssgs"
                    }
                    if (record.sfrlwb == '否') {
                        return (
                            <VpInput disabled="true" />
                        )
                    } else {
                        return (
                            <VpTooltip placement="top" title={text}>
                                <VpInput disabled="true" value={this.ssgsValue(text, record, index)} onClick={() => this.ssgsSelect(index)} suffix={
                                    <VpIcon onClick={() => this.ssgsSelect(index)} type='search' style={{ marginTop: 7 }} />
                                } />
                            </VpTooltip>

                        )
                    }

                }
            },
            {
                title: el_xmglhn, dataIndex: 'xmglhn', key: 'xmglhn', width: 34,
                render: (text, record, index) => {
                    let widget = {
                        "widget_type": "text",
                        "widget_name": "xmglhn"
                    }
                    return (
                        <VpInput
                            onChange={(e) => this.changeFn(e, index, widget.widget_name)}
                            onBlur={(e) => this.blurFn(e, index, widget.widget_name)}
                            value={this.Value(text, record, index)}
                        />
                    )
                }
            },
            {
                title: el_xmglhw, dataIndex: 'xmglhw', key: 'xmglhw', width: 34,
                render: (text, record, index) => {
                    let widget = {
                        "widget_type": "text",
                        "widget_name": "xmglhw"
                    }
                    return (
                        <VpInput onChange={(e) => this.changeFn(e, index, widget.widget_name)}
                            onBlur={(e) => this.blurFn(e, index, widget.widget_name)}
                            value={this.Value(text, record, index)} />
                    )
                }
            },
            {
                title: el_xqfxhn, dataIndex: 'xqfxhn', key: 'xqfxhn', width: 34,
                render: (text, record, index) => {
                    let widget = {
                        "widget_type": "text",
                        "widget_name": "xqfxhn",
                    }
                    return (
                        <VpInput onChange={(e) => this.changeFn(e, index, widget.widget_name)}
                            onBlur={(e) => this.blurFn(e, index, widget.widget_name)}
                            value={this.Value(text, record, index)} />
                    )
                }
            },
            {
                title: el_xqfxhw, dataIndex: 'xqfxhw', key: 'xqfxhw', width: 35,
                render: (text, record, index) => {
                    let widget = {
                        "widget_type": "text",
                        "widget_name": "xqfxhw",
                    }
                    return (
                        <VpInput onChange={(e) => this.changeFn(e, index, widget.widget_name)}
                            onBlur={(e) => this.blurFn(e, index, widget.widget_name)}
                            value={this.Value(text, record, index)} />
                    )
                }
            },
            {
                title: el_sjkfhn, dataIndex: 'sjkfhn', key: 'sjkfhn', width: 35,
                render: (text, record, index) => {
                    let widget = {
                        "widget_type": "text",
                        "widget_name": "sjkfhn",
                    }
                    return (
                        <VpInput onChange={(e) => this.changeFn(e, index, widget.widget_name)}
                            onBlur={(e) => this.blurFn(e, index, widget.widget_name)}
                            value={this.Value(text, record, index)} />
                    )
                }
            },
            {
                title: el_sjkfhw, dataIndex: 'sjkfhw', key: 'sjkfhw', width: 35,
                render: (text, record, index) => {
                    let widget = {
                        "widget_type": "text",
                        "widget_name": "sjkfhw",
                    }
                    return (
                        <VpInput onChange={(e) => this.changeFn(e, index, widget.widget_name)}
                            onBlur={(e) => this.blurFn(e, index, widget.widget_name)}
                            value={this.Value(text, record, index)} />
                    )
                }
            },
            {
                title: el_jccshn, dataIndex: 'jccshn', key: 'jccshn', width: 35,
                render: (text, record, index) => {
                    let widget = {
                        "widget_type": "text",
                        "widget_name": "jccshn",
                    }
                    return (
                        <VpInput onChange={(e) => this.changeFn(e, index, widget.widget_name)}
                            onBlur={(e) => this.blurFn(e, index, widget.widget_name)}
                            value={this.Value(text, record, index)} />
                    )
                }
            },
            {
                title: el_jccshw, dataIndex: 'jccshw', key: 'jccshw', width: 35,
                render: (text, record, index) => {
                    let widget = {
                        "widget_type": "text",
                        "widget_name": "jccshw",
                    }
                    return (
                        <VpInput onChange={(e) => this.changeFn(e, index, widget.widget_name)}
                            onBlur={(e) => this.blurFn(e, index, widget.widget_name)}
                            value={this.Value(text, record, index)} />
                    )
                }
            },
            {
                title: el_xncshn, dataIndex: 'xncshn', key: 'xncshn', width: 35,
                render: (text, record, index) => {
                    let widget = {
                        "widget_type": "text",
                        "widget_name": "xncshn",

                    }
                    return (
                        <VpInput onChange={(e) => this.changeFn(e, index, widget.widget_name)}
                            onBlur={(e) => this.blurFn(e, index, widget.widget_name)}
                            value={this.Value(text, record, index)} />
                    )
                }
            },
            {
                title: el_xncshw, dataIndex: 'xncshw', key: 'xncshw', width: 35,
                render: (text, record, index) => {
                    let widget = {
                        "widget_type": "text",
                        "widget_name": "xncshw",
                    }
                    return (
                        <VpInput onChange={(e) => this.changeFn(e, index, widget.widget_name)}
                            onBlur={(e) => this.blurFn(e, index, widget.widget_name)}
                            value={this.Value(text, record, index)} />
                    )
                }
            },
            {
                title: el_sxzchn, dataIndex: 'sxzchn', key: 'sxzchn', width: 35,
                render: (text, record, index) => {
                    let widget = {
                        "widget_type": "text",
                        "widget_name": "sxzchn",
                    }
                    return (
                        <VpInput onChange={(e) => this.changeFn(e, index, widget.widget_name)}
                            onBlur={(e) => this.blurFn(e, index, widget.widget_name)}
                            value={this.Value(text, record, index)} />
                    )
                }
            },
            {
                title: el_sxzchw, dataIndex: 'sxzchw', key: 'sxzchw', width: 35,
                render: (text, record, index) => {
                    let widget = {
                        "widget_type": "text",
                        "widget_name": "sxzchw",
                    }
                    return (
                        <VpInput onChange={(e) => this.changeFn(e, index, widget.widget_name)}
                            onBlur={(e) => this.blurFn(e, index, widget.widget_name)}
                            value={this.Value(text, record, index)} />
                    )
                }
            },
            {
                title: el_xthjhn, dataIndex: 'xthjhn', key: 'xthjhn', width: 35,
                render: (text, record, index) => {
                    let widget = {
                        "widget_type": "text",
                        "widget_name": "xthjhn",
                    }
                    return (
                        <VpInput value={this.Value(text, record, index)} disabled="true" />
                    )
                }
            },
            {
                title: el_xthjhw, dataIndex: 'xthjhw', key: 'xthjhw', width: 35,
                render: (text, record, index) => {
                    let widget = {
                        "widget_type": "text",
                        "widget_name": "xthjhw",

                    }
                    return (
                        <VpInput value={this.Value(text, record, index)} disabled="true" />
                    )
                }
            }
        ];
        _this.setState({ table_headers: _headerNew, tableloading: false });
    }

    /**
     * 新增一行
     */
    addTableRow = () => {
        let _obj = {
            ssxt: '',
            ssxtvalue: '',
            sfrlwb: '否',
            ssgs: '',
            ssgsvalue: '',
            xmglhn: 0,
            xmglhw: 0,
            xqfxhn: 0,
            xqfxhw: 0,
            sjkfhn: 0,
            sjkfhw: 0,
            jccshn: 0,
            jccshw: 0,
            xncshn: 0,
            xncshw: 0,
            sxzchn: 0,
            sxzchw: 0,
            xthjhn: 0,
            xthjhw: 0,
            entityid: this.state.entityid,
            objectid: this.state.objectid,
            processid: this.state.processid
        };

        const tableRowData = this.state.tableRowData;
        if (tableRowData.length == 0) {
            _obj = {
                ..._obj,
                iid: this.state.number++,
            }
        } else {
            for (let key in tableRowData[0]) {
                if (key == "iid") {
                    _obj[key] = this.state.number;
                    this.state.number++;
                }
            }
        }

        tableRowData.push(_obj);
        this.setState({ tableRowData: tableRowData, }, () => {
            this.tableRef.setTableData(this.state.tableRowData);
        });
    }

    /**
     * 子表单数据源
     * @returns {string}
     */
    getDataUrl = () => {
        return '/{bjyh}/xzxt/chenkXqfx';
    }

    /**
     * 子表单请求参数
     * @returns {{piid: *, entityid: *, objectid: *}}
     */
    getQueryParams = () => {
        return {
            entityid: this.props.entityid,
            objectid: this.props.iid,
            piid: this.props.piid
        };
    }

    onModelRef = ref => {
        this.chooseModel = ref
    }

    getOptions = (flag) => {
        return {
            dataUrl: flag ? '/{bjyh}/xzxt/getSsxt' : '/{bjyh}/xzxt/getGsmc',
            columns: this.getHeaders(flag),
        }
    }

    setParamsToChild = (colnum, bnt, index) => {
        this.chooseModel.setState({
            searchCol: colnum,
            select_type: bnt ? 'radio' : 'checkbox',
            index: index,
            viewFlag: !bnt,
        })
    }

    closeRightModal = () => {
        this.handleCancel()
    }

    handleOk = () => {
        let dataList = this.state.tableRowData
        if (this.state.flag) {
            dataList[this.chooseModel.state.index].ssxt = this.chooseModel.state.record.sname
            dataList[this.chooseModel.state.index].ssxtvalue = this.chooseModel.state.record.iid
        } else {
            dataList[this.chooseModel.state.index].ssgs = this.chooseModel.state.record.gsmc
            dataList[this.chooseModel.state.index].ssgsvalue = this.chooseModel.state.record.id
        }
        this.setState({ tableRowData: dataList }, () => {
            this.tableRef.setTableData(this.state.tableRowData);
        })
        console.log("aaa", dataList);

        // if (this.chooseModel.state.select_type == 'checkbox') {
        //     let zdmData1 = this.chooseModel.state.selectItem.map((item) => {
        //         return item.zwbm
        //     })
        //     dataList[this.chooseModel.state.index].zdm = zdmData1.join(",")
        //     this.setState({ tableRowData: dataList }, () => {
        //         this.tableRef.setTableData(this.state.tableRowData);
        //     })
        // }
        this.handleCancel()
    }

    handleCancel = () => {
        this.chooseModel.setState({ selectItem: [] })
        this.chooseModel.setState({ selectedRowKeys: [] })
        this.setState({ showModel: false });
    }
    getHeaders = (flag) => {
        if (flag) {
            return (
                [
                    { title: '系统编号', width: '150', dataIndex: 'scode', key: 'iid' },
                    { title: '系统名称', width: '150', dataIndex: 'sname', key: '1' },
                    { title: '元系统三位简称', width: '150', dataIndex: 'syxtswjc', key: '2' },
                ]
            )
        } else {
            return (
                [
                    { title: '公司名称', width: '150', dataIndex: 'gsmc', key: 'id' },
                ]
            )
        }
    }


    gecon = () => {
        if (this.state.showModel) {
            return (<XqfxchildFormModel options={this.getOptions(this.state.flag)} onModelRef={this.onModelRef} />)
        } else {
            return null;
        }
    }

    /**
     * 选中事件
     */
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }

    //ONCLOSE
    onClose(item, i) {
        let newList = [...this.state.selectItem.slice(0, i), ...this.state.selectItem.slice(i + 1)];
        this.setState({
            selectItem: newList,
            selectedRowKeys: newList.map((item, i) => {
                return item.iid
            })
        })
    }




    render() {
        const options = [
            {
                title: '新增',
                icon: 'vpicon-plus',
                type: 'primary',
                onClick: this.addTableRow
            }
        ]
        const { selectedRowKeys } = this.state || [];
        const rowSelection = {
            onSelect: this.handleUserSelect,
            onSelectAll: this.handleSelectAll,
            selectedRowKeys,
            onChange: this.onSelectChange,
        }
        return (<div style={{ marginLeft: 0, marginRight: 30 }}>
            <div style={{ textAlign: "right", marginBottom: 5 }}><VpWidgetGroup widgets={options} /></div>
            <VpTable
                loading={this.state.tableloading}
                ref={table => this.tableRef = table}
                queryMethod="POST"
                controlAddButton={
                    (numPerPage, resultList) => {
                        this.controlAddButton(numPerPage, resultList)
                    }
                }
                dataUrl={this.getDataUrl()}
                params={this.getQueryParams()}
                className="entityTable"
                columns={this.state.table_headers}
                bindThis={this}
                rowKey="iid"
                showTotal="false"
                resize
                size='small'
                bordered={true}
                scroll={{ y: 250, x: true }}
                pagination={false}
                auto={false}
                resize={false}
            />
            <div>
                <VpModal
                    title={this.state.model_name}
                    width="60%"
                    visible={this.state.showModel}
                    onCancel={this.handleCancel}
                    footer={
                        <div className="text-center">
                            <VpButton type="primary" onClick={this.handleOk}>确定</VpButton>
                            <VpButton type="ghost" onClick={this.handleCancel}>取消</VpButton>
                        </div>
                    }>
                    {this.gecon()}
                </VpModal>
            </div>
        </div>)
    }

}
xqfxchildEntityForm = EditTable.createClass(xqfxchildEntityForm)
export default xqfxchildEntityForm
