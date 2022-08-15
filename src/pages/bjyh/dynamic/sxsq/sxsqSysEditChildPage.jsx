import React, { Component } from "react";
import {
    vpQuery,
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
import XqfxchildFormModel from '../xqfx/xqfxchildFormModel'
import Choose from '../../../templates/dynamic/Form/ChooseEntity';

// 需求分析流程--流程子表单
class sxsqSysEditChildPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            number: 1,
            tableRowData: {
                sysid: '',
                sysname: '',
                sfsjcxbg: '',
            },
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
            chooseItem: [],
            table_userHeaders: '',
            entity_data_url: '',
            showModel: false, // 显示弹窗
            showModelChoose: false, // 显示弹窗
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
        this.parentForm.sxsqChildPageRef = this;
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
        let condition = this.parentForm.state.condition
        if(condition.includes('SYSZG')){
            return callback(null, null)
        }
        let filterArr = this.state.tableRowData.filter(item => {
            return item.sysid
        });
        if(filterArr <= 0 && this.state.deleteRow <= 0){
            return callback(null, null)
        }
        let sparam = JSON.stringify(filterArr);
        let objectid = this.state.objectid;
        let processid = this.state.processid;
        let taskid = this.props.taskid||this.props.staskid||this.props.formData.curtask.taskId;
        vpAdd('/{bjyh}/sxsqChildPage/save', { 
            sparam: sparam, 
            objectid: objectid, 
            piid: processid ,
            taskid: taskid,
            deleteRow: this.state.deleteRow,
            submit: options.btnName == 'ok' ? true : false,
            stepcode: this.props.stepcode,
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
        if (condition.indexOf('SYSZG') != -1) {
            return callback(null, null)
        }
        switch (options.btnName) {
            case 'ok':
                const enableArr = this.state.tableRowData.filter(item => {
                    return item.sysid
                });
                // if (enableArr.length < 1) {
                //     this.alertMsg('请至少增加一个系统！', 'warning')
                //     return callback(true, null)
                // }
                const filterArr = this.state.tableRowData.filter(item => {
                    return (!item.sfsjcxbg || !item.sysroleid)
                });
                if (filterArr.length > 0) {
                    this.alertMsg('‘系统负责人’或‘是否涉及程序变更’不能为空。', 'warning')
                    callback(true, null)
                }
                callback(null, null)
                break;
            case 'save':
                callback(null, null)
                break;
        }
    }

    controlAddButton = (numPerPage, resultList) => {
        this.state.tableRowData = resultList;
        this.state.number += resultList.length;
        this.state.save_number = resultList.length;
        const jumpflag = this.parentForm.props.form.getFieldValue('sjumpflag01');
        const handlerNew = this.parentForm.state.handlers.filter(item => {return item.flag === 'SYSZH'})
        if(!jumpflag && handlerNew.length) {
            const flag = resultList.length === 0 ? 'SYSZH' : 'SYSZF'
            const instance = this.parentForm.props.form.getFieldInstance('scondition')
            instance && instance.props.options_.map(item => {
                if(resultList.length === 0) {
                    item.value === 'SYSZF' && (item.hidden = true)
                } else {
                    item.value === 'SYSZH' ? (item.hidden = true) : (item.hidden = false)
                }
                // (resultList.length === 0 && item.value === 'SYSZF') ? (item.hidden = true) : (item.hidden = false)
            })
            this.parentForm.props.form.setFieldsValue({scondition: flag})
            let obj = {target:{value: flag, flag: 'childRef'}}
            this.parentForm.handleCondition(obj)
        }
    }

    // 删除项
    remove = (k, record) => {
        let deleteRow = this.state.deleteRow||[];
        if(!record.newRow){
            deleteRow.push(record.iid);
        }
        this.state.tableRowData.splice(k, 1);
        //删除系统时，同步更新父页面预设处理人SYSZF
        const jumpflag = this.parentForm.props.form.getFieldValue('sjumpflag01');
        const handlerNew = this.parentForm.state.handlers.filter(item => {return item.flag === 'SYSZH'})
        if(!jumpflag && handlerNew.length) {
            const userids = record.sysroleid
            const {handlers} = this.parentForm.state
            handlers.map(item => {
                if(item.flag == 'SYSZF' && userids){
                    let idsArr = item.ids.split(',')
                    let namesArr = item.names.split(',')
                    const idIdx = idsArr.indexOf(userids);
                    idsArr.splice(idIdx, 1)
                    namesArr.splice(idIdx, 1)
                    item.ids = idsArr.join()
                    item.names = namesArr.join()
                }
            })
            this.parentForm.setState(handlers) 
        }
        //删除所有系统后分支跳转到SYSZH
        if(this.state.tableRowData.length === 0 && !jumpflag && handlerNew.length) {
            //antd.form 组件的getFieldInstance可获取渲染元素的强引用
            const instance = this.parentForm.props.form.getFieldInstance('scondition')
            instance && instance.props.options_.map(item => {
                item.value == 'SYSZF'? (item.hidden = true) : (item.hidden = false)
            })
            this.parentForm.props.form.setFieldsValue({scondition: 'SYSZH'})
            let obj = {target:{value:'SYSZH', flag: 'childRef'}}
            this.parentForm.handleCondition(obj)
        }
        this.setState({
            tableRowData: this.state.tableRowData,
            deleteRow: deleteRow,
        }, () => {
            this.controlAddButton(0, this.state.tableRowData);
        });
        
    }

    toDecimal = (x) => {
        var f = parseFloat(x);
        if (isNaN(f)) { return; }
        f = Math.round(x * 100) / 100;
        return f;
    }
    //系统选择器
    ssxtSelect = (index) => {
        this.setState({ showModel: true, model_name: '系统查询',}, () => {
            this.setParamsToChild('ssxt', true, index)
        })
        this.setState({ flag: true });
    } 
    //系统负责人选择器
    ssxtRoleSelect = (val,record,index) => {
        this.setState({
            showModelChoose:true,
            onClickRowIdx: index,
            chooseItem:{
                iid: record.sysroleid,
                sname: record.sysrolename,
            },
        })
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

    /**
     * 获取表头
     */
    getEditHeader = () => {
        let _this = this;
        let _headerNew = [
            {
                title: "操作",
                key: "operate",
                dataIndex: "operate",
                width: 65,
                render: (text, record, k) => {
                    return (
                        <div>
                            <VpTooltip placement="right" title="删除">
                                <VpIconFont className="cursor m-lr-xs f16 text-danger" type="vpicon-shanchu" onClick={() => this.remove(k,record)} />
                            </VpTooltip>
                        </div>
                    )
                }
            },
            {
                title: '本次上线涉及系统',
                dataIndex: 'sysname',
                key: 'sysname',
                render: (text, record, index) => {
                    return (
                            <VpInput style={{width:'100%'}} readOnly={true} value={text} onClick={() => this.ssxtSelect(index)} suffix={
                                <VpIcon onClick={() => this.ssxtSelect(index)} type='search' style={{ marginTop: 7 }} />
                            } />
                    )
                }
            },
            {
                title: '系统负责人',
                dataIndex: 'sysrolename',
                key: 'sysrolename',
                render: (text, record, index) => {
                    return (
                            <VpInput style={{width:'100%'}} readOnly={true} value={text} onClick={() => this.ssxtRoleSelect(text, record, index)} suffix={
                                <VpIcon onClick={() => this.ssxtRoleSelect(text, record, index)} type='search' style={{ marginTop: 7 }} />
                            } />
                    )
                }
            },
            {
                title: "是否仅涉及程序变更", dataIndex: 'sfsjcxbg', key: 'sfsjcxbg',
                render: (text, record, index) => {
                    let widget = {
                        "widget_type": "select",
                        "widget_name": "sfsjcxbg",
                        "default_value_name": "sfsjcxbg",
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
        ];
        _this.setState({ table_headers: _headerNew, tableloading: false });
    }

    /**
     * 新增一行
     */
    addTableRow = () => {
        let _obj = {
            sysid: '',
            sysname: '',
            sysrolename: '',
            sysroleid: '',
            sfsjcxbg: '',
            newRow:true,
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
        return '/{bjyh}/sxsqChildPage/list';
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
        
        //添加系统负后 自动设置父页面预设处理人为系统负责人
        // const handlerNew = this.parentForm.state.handlers.filter(item => {return item.flag === 'SYSZH'})
        // const jumpflag = this.parentForm.props.form.getFieldValue('sjumpflag01');
        // if(!jumpflag && handlerNew.length) {
        //     const instance = this.parentForm.props.form.getFieldInstance('scondition')
        //     instance && instance.props.options_.map(item => {
        //         item.value == 'SYSZH'? (item.hidden = true) : (item.hidden = false)
        //     })
        //     this.parentForm.props.form.setFieldsValue({scondition: 'SYSZF'})
        //     let obj = {target:{value:'SYSZF', flag: 'childRef'}}
        //     this.parentForm.handleCondition(obj)                
        // }
        this.setState({ tableRowData: dataList }, () => {
            this.tableRef.setTableData(this.state.tableRowData);   
        })
        this.handleCancel()
    }
    //系统负责人选择器OK
    onModelOk = (selectItem) => {
        let dataList = this.state.tableRowData
        const deleteUser ={}
        deleteUser.id = dataList[this.state.onClickRowIdx].sysroleid
        deleteUser.name = dataList[this.state.onClickRowIdx].sysrolename

        dataList[this.state.onClickRowIdx].sysroleid = selectItem[0] && selectItem[0].iid || ''
        dataList[this.state.onClickRowIdx].sysrolename = selectItem[0] && selectItem[0].sname||''
        //const isNew = !!!dataList[this.state.onClickRowIdx].sysid     
        //添加系统负责人后 自动设置父页面预设处理人为系统负责人
        const handlerNew = this.parentForm.state.handlers.filter(item => {return item.flag === 'SYSZH'})
        const jumpflag = this.parentForm.props.form.getFieldValue('sjumpflag01');
        if(!jumpflag && handlerNew.length) {
            const userids = selectItem[0] && selectItem[0].iid || ''
            const usernames = selectItem[0] && selectItem[0].sname || ''
            const {handlers} = this.parentForm.state
            handlers.map(item => {
                if(item.flag === 'SYSZF') {
                    item.ids = (item.ids ) ? (userids?(item.ids+','+userids):item.ids) : userids
                    item.names = ((item.names ) ? (userids?(item.names+','+usernames):item.names) : usernames).split(',')
                    //去重复
                    const obj = {}
                    item.ids.split(',').map((ele, idx) => {
                        obj[ele] = item.names[idx] 
                    })
                    //删除deleteUser
                    delete obj[deleteUser.id]
                    item.ids = Object.keys(obj).join(),item.names = Object.values(obj).join()
                }
            })
            const instance = this.parentForm.props.form.getFieldInstance('scondition')
            instance && instance.props.options_.map(item => {
                item.value == 'SYSZH'? (item.hidden = true) : (item.hidden = false)
            })
            this.parentForm.setState(handlers,()=>{
                this.parentForm.props.form.setFieldsValue({scondition: 'SYSZF'})
                let obj = {target:{value:'SYSZF', flag: 'childRef'}}
                this.parentForm.handleCondition(obj)
            })
        }
        this.handleCancel()
    }

    handleCancel = () => {
        this.chooseModel && this.chooseModel.setState({ selectItem: [] })
        this.chooseModel && this.chooseModel.setState({ selectedRowKeys: [] })
        this.setState({ showModel: false, showModelChoose: false });
    }
    getHeaders = () => {
        return (
            [
                { title: '系统编号', width: '150', dataIndex: 'scode', key: 'iid' },
                { title: '系统名称', width: '150', dataIndex: 'sname', key: '1' },
                { title: '元系统三位简称', width: '150', dataIndex: 'syxtswjc', key: '2' },
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
                title: '新增',
                icon: 'vpicon-plus',
                type: 'primary',
                onClick: this.addTableRow
            }
        ]
        //用户选择器参数
        const itemProps = {
            irelationentityid:2,
            widget_type:'selectmodel',
        }
        let initValue = [this.state.chooseItem]
       
        return (<div style={{ marginLeft: 0, marginRight: 60 ,padding: '0 15%'}}>
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
                    {this.state.showModel?
                        <XqfxchildFormModel entityid={81} options={this.getOptions()} 
                        queryParams={this.getCondition()}
                        onModelRef={this.onModelRef} />
                    :null}
                </VpModal>
            </div>
            <div>
                <VpModal
                    title={'请选择'}
                    width="70%"
                    wrapClassName='modal-no-footer dynamic-modal'
                    visible={this.state.showModelChoose}
                    onCancel={this.handleCancel}
                    footer={null}
                    >
                    {this.state.showModelChoose?
                        <Choose item={itemProps} initValue={initValue} onCancel={this.handleCancel} onOk={this.onModelOk}/>
                    :null}
                </VpModal>
            </div>
        </div>)
    }

}
sxsqSysEditChildPage = EditTable.createClass(sxsqSysEditChildPage)
export default sxsqSysEditChildPage
