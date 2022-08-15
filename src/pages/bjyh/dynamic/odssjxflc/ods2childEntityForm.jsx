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
// const isChrome = !!window.chrome && !!window.chrome.webstore
const { Search } = Input;
// ODS数据下发流程--流程子表单
class ods2childEntityForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            number: 1,
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
            onMainFormSaveSuccess: "onMainFormSaveSuccess"  //同步保存时，主表单保存成功后
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

    getFormValues(options,errorCallback){
        let _this = this
        console.log('getFormValues',options);
        console.log('_this', _this)
        // console.log('selectedFlowScondition', _this.parentForm.props.form.getFieldValue('scondition'))
        if (_this.parentForm.props.form.getFieldValue('scondition') != 'SYSE') {
            vpAdd('/{bjyh}/odssjxflc/thirdTofourthStep', { flowId: this.props.piid, jsonData: JSON.stringify(this.state.tableRowData)
            }).then((res) => {
                if (res.data != null && res.data != '') {
                    console.log('success~v~')
                    errorCallback(null,null)
                } else {
                    console.error('接口调用失败')
                    errorCallback(true,null)
                }
            })
        }
        errorCallback(null,null)
    }


    controlAddButton = (numPerPage, resultList) => {
        this.state.tableRowData = resultList;
        this.state.number += resultList.length;
        this.state.save_number = resultList.length;
    }

    /**
     * 获取表头
     */
    getEditHeader = () => {
        let _this = this;
        let _headerNew = [
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
                title: '分行是否已下发', dataIndex: 'thsfyxf', key: 'thsfyxf',
            },
            {
                title: '是否同意所有分行下发', dataIndex: 'sftysyfhxf', key: 'sftysyfhxf',
            }
        ];
        _this.setState({ table_headers: _headerNew, tableloading: false });
    }

    /**
     * 子表单数据源
     * @returns {string}
     */
    getDataUrl = () => {
        return '/{bjyh}/odssjxflc/getDetailChildDataByFlowId';
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

    render() {
        return (<div style={{ marginLeft: 30, marginRight: 30 }}>
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

            </div>
        </div>)
    }

}
ods2childEntityForm = EditTable.createClass(ods2childEntityForm)
export default ods2childEntityForm
