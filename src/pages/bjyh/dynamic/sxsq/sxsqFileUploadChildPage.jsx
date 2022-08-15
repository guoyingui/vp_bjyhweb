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
    VpCheckbox,
    vpDownLoad
} from "vpreact";
import { EditTableCol } from 'vpbusiness';
import EditTable from '../../../templates/dynamic/List/EditTable';
import XqfxchildFormModel from '../xqfx/xqfxchildFormModel'

// 需求分析流程--流程子表单
class sxsqFileUploadChildPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            number: 1,
            tableRowData: [{
                id: '',
                prj_code: '',
                sys_name: '',
                batch_name: '',
                att_file_name: '',
                case_nums: '',
                reg_date: '',
                att_size: '',
                report_state: '',
            }],
            deleteRow:[],
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
        this.setCondition();
    }
    componentDidMount() {
        $(".entityTable").css('height', 300);
    }
    setCondition = () => {
        vpAdd('{bjyh}/sxsqChildPage/getProjectSystem',{
            objectId: this.props.iid,
            entityId: this.props.entityid,
        }).then(data => {
            console.log(data);  
            let ids = []              
            if(data.status === 200){
                data.data.forEach(e => {
                    if(e.iid){
                        ids.push(e.iid)
                    }
                });
                this.setState({
                    projectSystemIds:ids
                });
            }
        })
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

    getFormValues(options, callback) {
        let filterArr = this.state.tableRowData;
        let sparam = JSON.stringify(filterArr);
        let objectid = this.state.objectid;
        let processid = this.state.processid;
        let taskid = this.props.taskid||this.props.staskid||this.props.formData.curtask.taskId;
        vpAdd('/{bjyh}/sxsqFileUploadChildPageRest/save', { 
            sparam: sparam, 
            objectid: objectid, 
            piid: processid ,
            taskid: taskid,
            deleteRow: this.state.deleteRow,
            submit: options.btnName == 'ok' ? true : false,
        }).then((response) => {
            if (response.status == 200) {
                callback(null, null)
            } else {
                this.alertMsg('保存子页面错误！', 'error')
                callback(true, null)
            }
        })
    }

    /**
     * @description: {desc 弹框内容, type 类型warning, message 弹框头信息}
     * @param {desc 弹框内容, type 类型warning, message 弹框头信息} 
     */
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
     * } 校验验后回调
     * @param options {
     *     btnName,触发按钮名称
     * }
     */
    onValidate(options, callback) {
        //分支为拒绝时不进行校验
        let condition = this.parentForm.state.condition
        if (condition.indexOf('SYSJ') != -1) {
            return callback(null, null)
        }
        var flagfilename = '1';
        const fileNames = this.parentForm.rfjRef.state.childNodes;     // 上传文件的集合
        let filterFiles = '';  // 文件去重后
        fileNames.map(v => {
            let filename = v.filename.substring(0, v.filename.lastIndexOf('.'));
            filterFiles = filterFiles + filename;
        })
        if (filterFiles.indexOf('测试案例') == -1 || filterFiles.indexOf('测试报告') == -1) {
            flagfilename = '0';
        }

        switch (options.btnName) {
            case 'ok':
                var testflag = '0';
                let _accesserData = this.state.tableRowData;
                _accesserData.map((item, i) => {
                    if (item.report_state == '1') {
                        testflag = 1;
                    }
                })
                if(testflag == 0 && flagfilename == 0){
                    this.alertMsg('从测试报告中必须选择一个或者上传测试案例和测试报告！', 'error')
                    callback(true, null)
                }
                callback(null, null)
                break;
            case 'save':
                var testflag = '0';
                _accesserData = this.state.tableRowData;
                _accesserData.map((item, i) => {
                    if (item.report_state == '1') {
                        testflag = 1;
                    }
                })
                if(testflag == 0 && flagfilename == 0){
                    this.alertMsg('从测试报告中必须选择一个或者上传测试案例和测试报告！', 'error')
                    callback(true, null)
                }
                callback(null, null)
                break;
        }
    }

    controlAddButton = (numPerPage, resultList) => {
        this.state.tableRowData = resultList;
        this.state.number += resultList.length;
        this.state.save_number = resultList.length;
    }

    // 下载文件
    onRowClick = (record) => {
        console.log('record', record)
        vpDownLoad('/{bjyh}/sxsqFileUploadChildPageRest/singleFileDownload', 
        {id: record.id,att_file_name:record.att_file_name})
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

    // 下拉
    selectFn(record, index) {
        this.state.tableRowData[index].sfsjcxbg = record.sfsjcxbg;
        this.setState({
            tableRowData: this.state.tableRowData,
        }, () => {
            this.tableRef.setTableData(this.state.tableRowData);
        });
    }

    // chenkbox动作处理
    changeFn(value, index) {
        if(value == 0){
            this.state.tableRowData[index]['report_state'] = '1';
        }else{
            this.state.tableRowData[index]['report_state'] = '0';
        }
        this.setState({
            tableRowData: this.state.tableRowData,
        }, () => {
            this.tableRef.setTableData(this.state.tableRowData);
        });
    }

    /**
     * 获取表头
     */
    getEditHeader = () => {
        let _this = this;
        let _headerNew = [
            {
                title: "操作",
                key: "report_state",
                dataIndex: "report_state",
                width: 30,
                render: (text, record, k) => {
                    return (
                        <div>
                            <VpCheckbox options={[{label: '', value: '1'}]} value={text} onChange={() => this.changeFn(_this.state.tableRowData[k].report_state, k)}/>
                        </div>
                    )
                }
            },
            {
                title: '系统名称', dataIndex: 'sys_name', key: 'sys_name',width: 110,
            },
            {
                title: '批次名称', dataIndex: 'batch_name', key: 'batch_name',width: 80,
            },
            {
                title: '案例数', dataIndex: 'case_nums', key: 'case_nums',width: 30,
            },
            {
                title: '大小', dataIndex: 'att_size', key: 'att_size',width: 30,
            },
            {
                title: '生成日期', dataIndex: 'reg_date', key: 'reg_date',width: 110,
            },
            {
                title: "下载",
                key: "operate",
                dataIndex: "operate",
                width: 30,
                render: (text, record, k) => {
                    return (
                        <div>
                            <VpTooltip placement="right" title="下载">
                                <VpIconFont className="cursor m-lr-xs f16 text-danger" type="vpicon-download" onClick={() => this.onRowClick(record)} />
                            </VpTooltip>
                        </div>
                    )
                }
            },
        ];
        _this.setState({ table_headers: _headerNew, tableloading: false });
    }

    /**
     * 全选
     */
    vpiconPlus = () => {
        this.state.tableRowData.map((item, i) => {
            item.report_state = '1'
        });
        this.setState({
            tableRowData: this.state.tableRowData,
        }, () => {
            this.tableRef.setTableData(this.state.tableRowData);
        });
    }

        /**
     * 全不选
     */
    vpiconClose = () => {
        this.state.tableRowData.map((item, i) => {
            item.report_state = '0'
        });
        this.setState({
            tableRowData: this.state.tableRowData,
        }, () => {
            this.tableRef.setTableData(this.state.tableRowData);
        });
    }

    /**
     * 子表单数据源
     * @returns {string}
     */
    getDataUrl = () => {
        return '/{bjyh}/sxsqFileUploadChildPageRest/list';
    }

    /**
     * 子表单请求参数
     * @returns {{piid: *, entityid: *, objectid: *}}
     */
    getQueryParams = () => {
        return {
            entityid: this.props.entityid,
            objectid: this.props.iid,
            piid: this.props.piid,
            ishistory: this.parentForm.props.isHistory
        };
    }

    onModelRef = ref => {
        this.chooseModel = ref
    }

    setParamsToChild = (colnum, bnt, index) => {
        this.chooseModel.setState({
            searchCol: colnum,
            select_type: 'radio',
            index: index,
            viewFlag: false,
        })
    }

    closeRightModal = () => {
        this.handleCancel()
    }

    handleOk = () => {
        let dataList = this.state.tableRowData
        const sysname = this.chooseModel.state.record.sname
        const sysid = this.chooseModel.state.record.iid
        //判断是否重复选择
        let isRepeat = false;
        dataList.map(item => {
            if(item.sysid == sysid){
                isRepeat = true
            }
        })
        if(isRepeat){
            this.alertMsg('不允许添加重复系统信息!','warning')
            this.handleCancel()
            return;
        }
        dataList[this.chooseModel.state.index].sysname = sysname
        dataList[this.chooseModel.state.index].sysid = sysid
        
        this.setState({ tableRowData: dataList }, () => {
            this.tableRef.setTableData(this.state.tableRowData);
        })
        this.handleCancel()
    }

    handleCancel = () => {
        this.chooseModel.setState({ selectItem: [] })
        this.chooseModel.setState({ selectedRowKeys: [] })
        this.setState({ showModel: false });
    }
    getHeaders = () => {
        return (
            [
                { title: '项目编号', width: '150', dataIndex: 'prj_code', key: 'id' },
                { title: '系统名称', width: '150', dataIndex: 'sys_name', key: '1' },
                { title: '批次名称', width: '150', dataIndex: 'batch_name', key: '2' },
                { title: '测报名称', width: '150', dataIndex: 'att_file_name', key: '3' },
                { title: '案例数', width: '150', dataIndex: 'case_nums', key: '4' },
                { title: '大小', width: '150', dataIndex: 'att_size', key: '5' },
            ]
        )
    }

    getOptions = () => {
        return {
            columns: this.getHeaders(),
        }
    }
    /**
     * @description: 弹框组件实体查询条件
     * @return: object
     */
    getCondition = () => {
        return {
            condition:JSON.stringify([{
                field_name:'iid',
                field_value:this.state.projectSystemIds.join(','),
                expression:'in'
            }])
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
                title: '全选',
                icon: 'vpicon-plus',
                type: 'primary',
                onClick: this.vpiconPlus
            },
            {
                title: '全不选',
                icon: 'vpicon-close',
                type: 'primary',
                onClick: this.vpiconClose
            }
        ]
       
        return (<div style={{ marginLeft: 0, marginRight: 60 ,padding: '0 5%'}}>
            <div style={{ textAlign: "left", marginBottom: 5 }}><VpWidgetGroup widgets={options} /></div>
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
                    {this.state.showModel?
                        <XqfxchildFormModel entityid={81} options={this.getOptions()} 
                        queryParams={this.getCondition()}
                        onModelRef={this.onModelRef} />
                    :null}
                </VpModal>
            </div>
        </div>)
    }

}
sxsqFileUploadChildPage = EditTable.createClass(sxsqFileUploadChildPage)
export default sxsqFileUploadChildPage
