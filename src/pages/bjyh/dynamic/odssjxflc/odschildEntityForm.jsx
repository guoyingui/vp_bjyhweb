import React, { Component } from "react";
import {
    VpIconFont,
    VpRow,
    VpTable,
    VpPopconfirm,
    VpCol,
    VpModal,
    VpInput,
    VpIcon,
    VpFormCreate,
    vpAdd,
    VpTooltip,
    VpSwitch,
    VpButton,
    VpAlertMsg,
    vpQuery,
    VpTag,
    VpWidgetGroup,
    VpInputUploader,
    vpDownLoad
} from "vpreact";
import { EditTableCol, VpSearchInput } from 'vpbusiness';
import EditTable from '../../../templates/dynamic/List/EditTable';
import ChildFormModel from '../common/childFormModel'
import { Input, Checkbox } from 'antd';
import {common, odssjxf} from "../code";
// const isChrome = !!window.chrome && !!window.chrome.webstore
const { Search } = Input;
// ODS数据下发流程--流程子表单
class odschildEntityForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            number: 1,
            tableRowData: {
                ywbm: '',
                zwbm: '',
                zdm: '',
                ssxt: '',
                gszhywbm: '',
                xfpd: '日',
                bhsfyxf: '否',
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
            flag_filed: 0, // 弹窗请求地址 true: 字段 ， false: 表,
            // isOnComposition: false
            firstStep: true, // 是否是第一个节点
        }
        this.registerSubForm();
        this.change_ywbm = this.change_ywbm.bind(this)
        this.change_zwbm = this.change_zwbm.bind(this)
        this.change_zdm = this.change_zdm.bind(this)
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
            onMainFormSaveSuccess: "onMainFormSaveSuccess"  //同步保存时，主表单保存成功后
        }
    }

    //注册子表单到父表单中,
    registerSubForm() {
        //调用this.props.registerSubForm注册子表单到父表单中，父表单返回父表单this
        this.parentForm = this.props.registerSubForm(this.props.field_name, this, this.getRegisterSubFormOptions());
        this.state.firstStep = this.parentForm.props.formData.curtask.stepcode == odssjxf.lcbzbm_odssjxf
    }

    onSave(options, successCallback, errorCallback) {
        errorCallback(null, null)
    }

    getFormValues(options,errorCallback){
        {
            this.state.firstStep ?
                vpAdd('/{bjyh}/odssjxflc/firToSecStep', { flowId: this.props.piid, jsonData: JSON.stringify(this.state.tableRowData)
                    }).then((res) => {
                        if (res.data != null && res.data != '') {
                            console.log('success ~v~')
                            errorCallback(null,null)
                        } else {
                            console.error('接口调用失败')
                            errorCallback(true,null)
                        }
                    })
                :
                errorCallback(null,null)
        }

    }
    onMainFormSaveSuccess(saveReturnData) {
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
        let _this = this;
        console.log(this.state.tableRowData)
        if (options.btnName == 'ok') {
            let list = [...this.state.tableRowData]
            if (list.length <= 0) {
                _this.alertMsg('尚未添加下发数据！','error')
                callback(true,null)
            }
            list.map(lt => {
                if (!lt.ywbm) {
                    _this.alertMsg('请选择英文表名！','error')
                    callback(true,null)
                    return
                }
                if (!lt.zwbm) {
                    _this.alertMsg('请选择中文表名！','error')
                    callback(true,null)
                    return
                }
                if (!lt.zdm) {
                    _this.alertMsg('请选择字段名！','error')
                    callback(true,null)
                    return
                }
            })
        }
        callback(null); //如果校对通过则errors为null,否则为不通过描述，同form.validateFieldsAndScroll方法返回值
    }


    alertMsg=(desc,type,message)=>{
        return(
            VpAlertMsg({
                message: message||"消息提示",
                description: desc||'!',
                type: type||'info',
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 3)
        )
    }

    controlAddButton = (numPerPage, resultList) => {
        this.state.tableRowData = resultList;
        this.state.number += resultList.length;
        this.state.save_number = resultList.length;
    }
    remove = (k) => {
        this.state.tableRowData.splice(k, 1);
        this.setState({
            tableRowData: this.state.tableRowData,
        }, () => {
            this.controlAddButton(0, this.state.tableRowData);
        });
    }

    ywbmSelect = (index) => {
        this.setState({ showModel: true, model_name: '英文表名查询', flag_field: 0 }, () => {
            this.setParamsToChild('ywbm', true, index, false)
        })
    }
    ywbmValue = (text, record, index) => {
        // return this.state.ywbm || 'asdasdasd'
        return text
    }
    change_ywbm(e, record, index) {
        let reg = /[a-z_0-9]+/g
        let value = e.target.value.match(reg) ? e.target.value.match(reg).join('') : ''
        this.state.tableRowData[index].ywbm = value
        vpQuery(`/{bjyh}/odssjxflc/isNotXFByZYwbm`, {yxffh: common.idepartmentid, ywbm: record.ywbm, zwbm: record.zwbm }).then((res) => {
            // console.log('res', res.data)
            this.state.tableRowData[index].bhsfyxf = res.data ? '是' : '否'
            this.setState({
                tableRowData: this.state.tableRowData,
            }, () => {
                this.tableRef.setTableData(this.state.tableRowData);
            });
        })
    }
    zwbmSelect = (index) => {
        this.setState({ showModel: true, model_name: '中文表名查询', flag_field: 0 }, () => {
            this.setParamsToChild('zwbm', true, index, false)
        })
    }
    zwbmValue = (text, record, index) => {
        return text
    }

    change_zwbm(e, record, index) {
        let reg = /([A-Za-z0-9]|[\u4e00-\u9fa5])*/g
        let value = e.target.value.match(reg) ? e.target.value.match(reg).join('') : ''
        this.state.tableRowData[index].zwbm = value
        this.setState({
            tableRowData: this.state.tableRowData,
        }, () => {
            this.tableRef.setTableData(this.state.tableRowData);
        });
        vpQuery(`/{bjyh}/odssjxflc/isNotXFByZYwbm`, {yxffh: common.idepartmentid, ywbm: record.ywbm, zwbm: record.zwbm }).then((res) => {
            this.state.tableRowData[index].bhsfyxf = res.data ? '是' : '否'
            this.setState({
                tableRowData: this.state.tableRowData,
            }, () => {
                this.tableRef.setTableData(this.state.tableRowData);
            });
        })
    }
    zdmSelect = (index) => {
        if (this.state.tableRowData[index].ywbm) {
            this.setState({ showModel: true, model_name: '字段名查询', flag_field: 1 }, () => {
                this.setParamsToChild('zdm', false, index, true)
            })
        } else {
            VpAlertMsg({
                message: "消息提示",
                description: "先确定表名，才能确定字段名",
                type: "error",
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 5)
            callback(true, null)
            return
        }

    }
    zdmValue = (text, record, index) => {
        return text
    }

    change_zdm(e, index) {
        console.log('eeeeee', e)
        console.log('index', index)
        let reg = /([A-Za-z0-9,]|[\u4e00-\u9fa5])*/g
        let value = e.target.value.match(reg) ? e.target.value.match(reg).join('') : ''
        this.state.tableRowData[index].zdm = value
        this.setState({
            tableRowData: this.state.tableRowData,
        }, () => {
            this.tableRef.setTableData(this.state.tableRowData);
        });
    }
    ssxtSelect = (index) => {
        this.setState({ showModel: true, model_name: '所属系统查询', flag_field: 2 }, () => {
            this.setParamsToChild('ssxt', true, index, false)
        })
    }
    ssxtValue = (text, record, index) => {
        return text
    }


    gszhywbmSelect = (index) => {
        this.setState({ showModel: true, model_name: '归属总行业务部门查询', flag_field: 3 }, () => {
            this.setParamsToChild('gszhywbm', false, index, false)
        })
    }
    gszhywbmValue = (text, record, index) => {
        return text
    }


    /**
     * 获取表头
     */
    getEditHeader = () => {
        let _this = this;

        let _headerNew = this.state.firstStep ?
            [
                {
                    title: "操作",
                    key: "operate",
                    dataIndex: "operate",
                    width: 50,
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
                    title: '英文表名', dataIndex: 'ywbm', key: 'ywbm',
                    render: (text, record, index) => {
                        let widget = {
                            "widget_type": "text",
                            "widget_name": "ywbm"
                        }
                        return (
                            <VpInput value={this.ywbmValue(text, record, index)} onChange={(e) => { this.change_ywbm(e, record, index) }} suffix={
                                <VpIcon onClick={() => this.ywbmSelect(index)} type='search' style={{ marginTop: 7 }} />
                            } placeholder="请输入相应内容" />
                        )
                    }
                },
                {
                    title: '中文表名', dataIndex: 'zwbm', key: 'zwbm',
                    render: (text, record, index) => {
                        let widget = {
                            "widget_type": "text",
                            "widget_name": "zwbm"
                        }
                        return (
                            <VpInput value={this.zwbmValue(text, record, index)}
                                onChange={(e) => { this.change_zwbm(e, record, index) }}
                                suffix={
                                    <VpIcon onClick={() => this.zwbmSelect(index)} type='search' style={{ marginTop: 7 }} />
                                } placeholder="请输入相应内容" />
                        )
                    }
                },
                {
                    title: '字段名', dataIndex: 'zdm', key: 'zdm',
                    render: (text, record, index) => {
                        let widget = {
                            "widget_type": "text",
                            "widget_name": "zdm"
                        }
                        return (
                            <VpInput value={this.zdmValue(text, record, index)}
                                onChange={(e) => { this.change_zdm(e, index) }}
                                suffix={
                                    <VpIcon onClick={() => this.zdmSelect(index)} type='search' style={{ marginTop: 7 }} />
                                } placeholder="请输入相应内容" />
                        )
                    }
                },
                {
                    title: '所属系统', dataIndex: 'ssxtvalue', key: 'ssxtvalue',
                    render: (text, record, index) => {
                        let widget = {
                            "widget_type": "text",
                            "widget_name": "ssxtvalue"
                        }
                        return (
                            <VpInput disabled='true' value={this.ssxtValue(text, record, index)} suffix={
                                <VpIcon onClick={() => this.ssxtSelect(index)} type='search' style={{ marginTop: 7 }} />
                            } placeholder="请输入相应内容" />
                        )
                    }
                },
                {
                    title: '归属总行业务部门', dataIndex: 'gszhywbmvalue', key: 'gszhywbmvalue',
                    render: (text, record, index) => {
                        let widget = {
                            "widget_type": "text",
                            "widget_name": "gszhywbmvalue"
                        }
                        return (
                            <VpInput disabled='true' value={this.gszhywbmValue(text, record, index)} suffix={
                                <VpIcon onClick={() => this.gszhywbmSelect(index)} type='search' style={{ marginTop: 7 }} />
                            } placeholder="请输入相应内容" />
                        )
                    }
                },
                {
                    title: '下发频度', dataIndex: 'xfpd', key: 'xfpd',
                    render: (text, record) => {
                        let widget = {
                            "widget_type": "select",
                            "widget_name": "xfpd",
                            "default_value_name": "xfpd",
                            "load_template": [
                                { "value": "日", "label": '日' },
                                { "value": "月", "label": '月' },
                                { "value": "年", "label": '年' }
                            ]
                        }
                        return (
                            <EditTableCol
                                value={text}
                                record={record}
                                id="iid"
                                callBack={_this.callBack}
                                widget={widget} />
                        )
                    }
                },
                {
                    title: '本行是否已下发', dataIndex: 'bhsfyxf', key: 'bhsfyxf',
                    render: (text, record) => {
                        return text
                    }
                }
            ] :
            [
                {
                    title: '英文表名', dataIndex: 'ywbm', key: 'ywbm',
                },
                {
                    title: '中文表名', dataIndex: 'zwbm', key: 'zwbm',
                },
                {
                    title: '字段名', dataIndex: 'zdm', key: 'zdm',
                },
                {
                    title: '所属系统', dataIndex: 'ssxtvalue', key: 'ssxtvalue',
                },
                {
                    title: '归属总行业务部门', dataIndex: 'gszhywbmvalue', key: 'gszhywbmvalue',
                },
                {
                    title: '下发频度', dataIndex: 'xfpd', key: 'xfpd',
                },
                {
                    title: '本行是否已下发', dataIndex: 'bhsfyxf', key: 'bhsfyxf',
                }
            ];
        _this.setState({ table_headers: _headerNew, tableloading: false });
    }

    /**
     * 新增一行
     */
    addTableRow = () => {

        let _obj = {
            ywbm: '',
            zwbm: '',
            zdm: '',
            gszhywbm: '',
            gszhywbmvalue: '',
            xfpd: '日',
            bhsfyxf: '否',
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
        this.setState({
            tableRowData: tableRowData,
        }, () => {
            this.tableRef.setTableData(this.state.tableRowData);
        });

    }

    /**
     * 子表单数据源
     * @returns {string}
     */
    getDataUrl = () => {
        return '/{bjyh}/odssjxflc/getChildDataByFlowId';
    }

    /**
     * 子表单请求参数
     * @returns {{piid: *, entityid: *, objectid: *}}
     */
    getQueryParams = () => {
        return {
            entityid: this.props.entityid,
            objectid: this.props.piid,
            piid: this.props.piid
        };
    }

    onModelRef = ref => {
        this.chooseModel = ref
    }

    getOptions = (flag) => {

        switch (flag) {
            case 0 :
                return {
                    dataUrl: '/{bjyh}/odssjxflc/getTableByCond',
                    columns: this.getHeaders(flag),
                }
            case 1 :
                return {
                    dataUrl: '/{bjyh}/odssjxflc/getTableZdmByCond',
                    columns: this.getHeaders(flag),
                }
            case 2 :
                return {
                    dataUrl: '/{bjyh}/odssjxflc/getSystem',
                    columns: this.getHeaders(flag),
                }
            case 3 :
                return {
                    dataUrl: '/{bjyh}/odssjxflc/getDepartment',
                    columns: this.getHeaders(flag),
                }
        }

        // return {
        //     dataUrl: flag ? '/{bjyh}/odssjxflc/getTableByCond' : '/{bjyh}/odssjxflc/getTableZdmByCond',
        //     columns: this.getHeaders(flag),
        // }
    }

    /**
     * @param colnum 所选字段
     * @param bnt 单复选
     * @param index 所在行
     * @param flag 是否是'字段名' 字段
     */
    setParamsToChild = (colnum, bnt, index, flag) => {
        this.chooseModel.setState({
            searchCol: colnum,
            select_type: bnt ? 'radio' : 'checkbox',
            index: index,
            //ywbm: flag ? this.state.tableRowData[index].ywbm : '',
            queryParams:{ywbm:flag ? this.state.tableRowData[index].ywbm : ''}
        })
    }

    closeRightModal = () => {
        this.handleCancel()
    }
    handleOk = () => {
        let dataList = this.state.tableRowData
        console.log('this.chooseModel.state ', this.chooseModel.state)
        switch (this.chooseModel.state.searchCol) {
            case 'ywbm' :
            case 'zwbm' :
                console.log('this.chooseModel.state.searchCol',this.chooseModel.state)
                dataList[this.chooseModel.state.index].ywbm = this.chooseModel.state.record.ywbm
                dataList[this.chooseModel.state.index].zwbm = this.chooseModel.state.record.zwbm
                dataList[this.chooseModel.state.index].ssxtvalue = this.chooseModel.state.record.ssxtvalue
                dataList[this.chooseModel.state.index].gszhywbmvalue = this.chooseModel.state.record.gszhywbmvalue
                dataList[this.chooseModel.state.index].ssxt = this.chooseModel.state.record.ssxt
                dataList[this.chooseModel.state.index].gszhywbm = this.chooseModel.state.record.gszhywbm
                dataList[this.chooseModel.state.index].bhsfyxf = this.chooseModel.state.record.yxffh.indexOf(common.idepartmentid) > -1 ? '是' : '否'
                this.setState({ tableRowData: dataList }, () => {
                    this.tableRef.setTableData(this.state.tableRowData);
                })
                break
            case 'zdm':
                let zdmData1 = []
                this.chooseModel.state.selectItem.map((item) => {
                    zdmData1.push(item.zdm)
                })
                dataList[this.chooseModel.state.index].zdm = zdmData1.join(',')
                this.setState({ tableRowData: dataList }, () => {
                    this.tableRef.setTableData(this.state.tableRowData);
                })
                break
            case 'ssxt':
                dataList[this.chooseModel.state.index].ssxt = this.chooseModel.state.record.iid
                dataList[this.chooseModel.state.index].ssxtvalue = this.chooseModel.state.record.sname
                this.setState({ tableRowData: dataList }, () => {
                    this.tableRef.setTableData(this.state.tableRowData);
                })
                break
            case 'gszhywbm':
                let gsywbm1_id = []
                let gsywbm1_name = []
                this.chooseModel.state.selectItem.map((item) => {
                    gsywbm1_id.push(item.iid)
                    gsywbm1_name.push(item.sname)
                })
                dataList[this.chooseModel.state.index].gszhywbm = gsywbm1_id.join(',')
                dataList[this.chooseModel.state.index].gszhywbmvalue = gsywbm1_name.join(',')
                this.setState({ tableRowData: dataList }, () => {
                    this.tableRef.setTableData(this.state.tableRowData);
                })
                break
        }

        // if(this.chooseModel.state.select_type == 'radio'){
        //     dataList[this.chooseModel.state.index].ywbm = this.chooseModel.state.record.ywbm
        //     dataList[this.chooseModel.state.index].zwbm = this.chooseModel.state.record.zwbm
        //     dataList[this.chooseModel.state.index].ssxtvalue = this.chooseModel.state.record.ssxtvalue
        //     dataList[this.chooseModel.state.index].gszhywbmvalue = this.chooseModel.state.record.gszhywbmvalue
        //     dataList[this.chooseModel.state.index].ssxt = this.chooseModel.state.record.ssxt
        //     dataList[this.chooseModel.state.index].gszhywbm = this.chooseModel.state.record.gszhywbm
        //     this.setState({ tableRowData: dataList }, () => {
        //         this.tableRef.setTableData(this.state.tableRowData);
        //     })
        // }
        // if (this.chooseModel.state.select_type == 'checkbox') {
        //     let zdmData1 = this.chooseModel.state.selectItem.map((item) => {
        //         return item.zdm
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
        switch (flag) {
            case 0 :
                return (
                    [
                        { title: '英文表名', width: '150', dataIndex: 'ywbm', key: '1' },
                        { title: '中文表名', width: '150', dataIndex: 'zwbm', key: '2' },
                        { title: '所属系统', width: '150', dataIndex: 'ssxtvalue', key: '3' },
                        { title: '归属总行业务部门', width: '150', dataIndex: 'gszhywbmvalue', key: '4' }
                    ]
                )
            case 1 :
                return (
                    [
                        { title: '字段名', width: '200', dataIndex: 'zdm', key: '1' },
                        { title: '所属系统', width: '200', dataIndex: 'ssxtvalue', key: '2' },
                        { title: '归属总行业务部门', width: '200', dataIndex: 'gszhywbmvalue', key: '3' }
                    ]
                )
            case 2 :
                return (
                    [
                        { title: '系统编号', width: '200', dataIndex: 'sname', key: '1' },
                        { title: '系统名称', width: '200', dataIndex: 'scode', key: '2' },
                        { title: '元系统三位简称', width: '200', dataIndex: 'syxtswjc', key: '3' }
                    ]
                )
            case 3 :
                return (
                    [
                        { title: '部门ID', width: '200', dataIndex: 'iid', key: '1' },
                        { title: '部门编号', width: '200', dataIndex: 'scode', key: '2' },
                        { title: '部门名称', width: '200', dataIndex: 'sname', key: '3' }
                    ]
                )
        }
        // if (flag == 0) {  // 不是字段名
        //     return (
        //         [
        //             { title: '英文表名', width: '150', dataIndex: 'ywbm', key: '1' },
        //             { title: '中文表名', width: '150', dataIndex: 'zwbm', key: '2' },
        //             { title: '所属系统', width: '150', dataIndex: 'ssxtvalue', key: '3' },
        //             { title: '归属总行业务部门', width: '150', dataIndex: 'gszhywbmvalue', key: '4' }
        //         ]
        //     )
        // } else { // 是字段名
        //     return (
        //         [
        //             { title: '字段名', width: '200', dataIndex: 'zdm', key: '1' },
        //             { title: '所属系统', width: '200', dataIndex: 'ssxtvalue', key: '2' },
        //             { title: '归属总行业务部门', width: '200', dataIndex: 'gszhywbmvalue', key: '3' }
        //         ]
        //     )
        // }
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
    getChildFormModel = () => {
        if (this.state.showModel) {
            return <ChildFormModel options={this.getOptions(this.state.flag_field)} onModelRef={this.onModelRef} />
        } else {
            return ''
        }
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
        return (<div style={{ marginLeft: 30, marginRight: 30 }}>
            <div style={{ textAlign: "right", marginBottom: 5 }}>{ this.state.firstStep ? <VpWidgetGroup widgets={options} /> : null}</div>
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
                    style={{top:'50px',height:'107%'}}
                    visible={this.state.showModel}
                    onCancel={this.handleCancel}
                    footer={
                        <div className="text-center">
                            <VpButton type="primary" onClick={this.handleOk}>确定</VpButton>
                            <VpButton type="ghost" onClick={this.handleCancel}>取消</VpButton>
                        </div>
                    }>


                    {this.getChildFormModel()}

                </VpModal>
            </div>
        </div>)
    }


}
odschildEntityForm = EditTable.createClass(odschildEntityForm)
export default odschildEntityForm
