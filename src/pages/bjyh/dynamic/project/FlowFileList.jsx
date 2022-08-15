import React,{Component} from 'react';

import {
    VpButton,
    vpDownLoad,
    VpIcon,
    VpConfirm, VpAlertMsg,
} from 'vpreact';

import {requireFile } from 'utils/utils';
import "./FlowFileList.less";
import List from "../../../templates/dynamic/List/index";
/**
 * 项目流程附件列表npm
 */
class FlowFileList extends List.NormalTable.Component{
    constructor(props){
        super(props);
        this.closeRight = this.closeRight.bind(this);
        this.handleStop = this.handleStop.bind(this);
        this.state={
            ...this.state,
            selectedRowKeys: [],
            selectItem: [],
        }
    }

    getQueryParams(){
        let {quickSearch:quickvalue,filtervalue,_k} = this.props.queryParams || {};
        return {
            projectId: this.props.iid,//主实体iid
            piId: this.props.piId,
            _k
        }
    }

    //列表配置项
    getCustomTableOptions(){
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            onSelect: this.handleSelect,
            onSelectAll: this.handleSelectAll,
            selectedRowKeys,
            onChange: this.onSelectChange,
        }
        return {
            dataUrl:'/{bjyh}/pcl/getFlowFJByProjectId',
            pagination: false,
            rowSelection:rowSelection
        }
    }

    handleSelect = (record, selected, selectedRows) => {
        this.setState({ record });
        let idx = 0;
        if (selected) {
            let comments = this.state.selectItem
            if(this.state.select_type==='radio'){
                comments = []
            }
            comments.push(record)
            this.setState({
                selectItem: comments
            })
            this.props.updateState(comments)
        } else {
            this.state.selectItem.forEach((element, i) => {
                if (element.key === record.key) {
                    idx = i
                }
            });
            this.setState({
                selectItem: [...this.state.selectItem.slice(0, idx), ...this.state.selectItem.slice(idx + 1)]
            })
            this.props.updateState([...this.state.selectItem.slice(0, idx), ...this.state.selectItem.slice(idx + 1)])
        }
    }

    //全选
    handleSelectAll = (selected, selectedRows, changeRows) => {
        let selectItem = this.state.selectItem
        if(selected){
            this.setState({selectItem:selectedRows})
            this.props.updateState(selectedRows)
        }else{
            selectItem = selectItem.filter(i=>{
                if(!JSON.stringify(changeRows).includes(JSON.stringify(i))){
                    return i
                }
            })
            this.setState({selectItem:selectItem})
            this.props.updateState(selectItem)
        }
    }

    /**
     * 选中事件
     */
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }

    onRowClick = (record) => {
        console.log('record', record)
        vpDownLoad('/{bjyh}/pcl/singleFileDownload', {
            fileid: record.fileid,
            id:record.id,
            sname:record.filename,
            datasoure:record.datasoure,

        })
    }

    closeRight = (msg) => {
        let _this = this
        this.setState({
            showRightBox: msg,
            staskid: ''
        })
        this.reloadTable();
        //使流程页面返回列表页
        this.props.closeRightModal && this.props.closeRightModal()
    }

    handleStop (e, record) {
        e.stopPropagation();
        let _this = this
        record.entityid = _this.props.entityid
        record.iid = _this.props.iid
        let param = { pdId: record.pdId, piId: record.piId }
        VpConfirm({
            title: '提示',
            content: '是否确认强行终止流程？',
            onOk(){},//TODO
            onCancel(){}
        });
    }

    getHeader(){
        let _header = [
            { title: '名称', dataIndex: 'filename', key: 'filename', width: 200 },
            { title: '所属流程', dataIndex: 'flowname', key: 'flowname', width: 200 },
            { title: '流程发起时间', dataIndex: 'startdate', key: 'startdate', width: 300 },
            { title: '上线申请时间', dataIndex: 'sxdate', key: 'sxdate', width: 150 }
        ];
        this.setState({
            table_headers: _header,
        });
        this.props.getAddflag(true,1)
    }
    
}
FlowFileList = List.NormalTable.createClass(FlowFileList);

/**
 * 实体详情页附件列表页面
 */
class FileListTabs extends List.Component{

    constructor(props) {
        super(props);
        this.state.selectItem = []
    }

//     /*  模态框中：去掉多选框全选按钮 */
// .ant-table-header .ant-table-thead .ant-checkbox-wrapper {
//     display:none !important;
// }
//     componentDidMount(){
//         // super.componentDidMount();
//         // $(".ant-table-header .ant-table-thead .ant-checkbox-wrapper").removeAttr("display")    display: block !important;
//         $("body .ant-table-header .ant-table-thead .ant-checkbox-wrapper ").removeAttr("display")
//     }

    //搜索框隐藏
    showSearchInput(){
        return false;
    }
    updateState = (v) => {
        this.setState({selectItem: v})
    }

    //过滤器隐藏
    getFilterPosition =() => {
        return ''
    }
    // 附件批量下载
    fileDownload = () => {
        let _this = this
        let fileList = this.state.selectItem;
        if (fileList.length <= 0) {
            VpAlertMsg({
                message:"消息提示",
                description: '请至少选择一个文件！',
                type:"warning",
                closeText:"关闭",
                showIcon: true
            }, 5);
            return
        }
        // console.log('fileList', fileList)
        let files = JSON.stringify(fileList);
        // console.log('files', files)
        vpDownLoad('/{bjyh}/pcl/downloadZipFiles', {
            projectId: _this.props.iid,
            list: files
        }).then((res) => {
            console.log(res)
        });
    }
    getCustomeButtons(){
        let _this = this
        return [{
            name:"下载",
            render:function(_thislist,props){
                return (
                    <VpButton type="primary" shape="circle" className="vp-btn-br-lg" onClick={_this.fileDownload}>
                        <VpIcon type="download" />
                    </VpButton>
                )
            }
        }]
    }

    /**
     * 渲染列表
     * @returns {*}
     */
    renderNormalTable(props){
        return <FlowFileList  {...props} iid={this.props.iid}
        closeRightModal={this.props.closeRightModal}
        updateState = {this.updateState}
        />;
    }

}

let createClass = function(newClass){
    let wrapClass = List.createClass(newClass);
    wrapClass.createClass = createClass;
    wrapClass.Table = FlowFileList;
    return wrapClass;
}
export default createClass(FileListTabs);