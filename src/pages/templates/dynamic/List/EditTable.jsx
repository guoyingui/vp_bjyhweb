import React, { Component } from 'react'
import {
    VpTooltip,
    VpModal,
    VpFormCreate,
    VpIconFont,
    vpQuery,
    vpAdd,
    VpPopconfirm,
    VpUploader,
    VpAlertMsg,
    VpDropdown,
    VpMenu,
    VpMenuItem, VpIcon
} from 'vpreact';
import './index.less';
import { requireFile } from 'utils/utils';
import {connect} from 'react-redux';
import {changeQueryParams} from 'reduxs/actions/action';
import {mergeButtons,endWithStr} from '../utils';

import {
    EditTableCol, RightBox,
    VpDTable
} from 'vpbusiness';
import EntityDetail from "../DynamicForm/EntityDetail";


class EditTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            table_headers:[], //表头数据
            expandedRowKeys: [],
            editrowdata: {},//需要保存的编辑数据
            filearr: {}, //上传附件
            doctypelist: [],//编辑类表上传文档类型数据源
            selectType: '',
        }
        this.objectid = 0; //用来生成临时数据id

        this.onUploadAccept = this.onUploadAccept.bind(this);
        this.handleFileCancel = this.handleFileCancel.bind(this);
        this.closeRightModal = this.closeRightModal.bind(this);

        this.props.onRef && this.props.onRef(this); //将对象注册到父类中
    }
    componentWillMount() {
        this.getEditHeader();
        this.loadDocType();
    }

    //编辑列表获取上传文档类型
    loadDocType = () => {
        vpQuery('/{vpplat}/vfrm/entity/doctype', {
            entityid: this.props.entityid
        }).then((response) => {
            this.setState({
                doctypelist: response.data,
                selectType: response.data[0].value
            })
        })
    }


    //编辑表格触发回调
    callBack = (rowdata) => {
        let iid = rowdata.iid
        this.state.editrowdata[iid] = rowdata
        this.setState({
            editrowdata: this.state.editrowdata
        })
    }

    //删除数据确认事件
    confirm = (entityid, iid) => {
        const _this = this;
        vpAdd('/{vpplat}/vfrm/entity/deleteData', {
            iid: iid,
            entityid: entityid
        }).then(function (data) {
            _this.tableRef.getTableData()
        })
    }

    /**
     * 获取自定义操作按钮
     */
    getCustomOperationColButtons(record){
        return this.props.buttons;
    }
    /**
     * 操作列按钮点击
     */
    onOperationColButtonClick(btnItem,record){
        btnItem.handler && btnItem.handler(record,btnItem,this);
    }

    //保存附件
    onUploadAccept(file, response){
        let fileinfo = { fileid: response.data.fileid, doctype: response.data.doctype }
        let oldfilearr = this.state.filearr[record.iid] || [];
        oldfilearr.push(fileinfo);
        this.setState({
            filearr: oldfilearr
        })
    }

    //删除数据确认事件
    doDeleteRow (record) {
        const _this = this;
        vpAdd('/{vpplat}/vfrm/entity/deleteData', {
            iid: record.iid,
            entityid: record.ientityid
        }).then(function (data) {
            _this.tableRef.getTableData(); //触发数据刷新
        })
    }

    changeQueryParams(queryParams){
        this.props.changeQueryParams && this.props.changeQueryParams(queryParams);
    }

    /**
     * 关闭附件上传窗口
     */
    handleFileCancel() {
        this.setState({
            VpUploader: false
        })
    }

    /**
     * 获取操作列列表的按钮
     */
    getOperationColButtons(record){
     
        let defaultBtns  ={
            "file":{
                name:"file",
                title:'附件',
                iconType:"vpicon-paperclip",
                iconClassName:"text-primary m-lr-xs cursor",
                handler:function(record,btnItem,_thislist){
                    _thislist.state.editrowdata[record.iid] = record;
                    _thislist.setState({
                        VpUploader:true,
                        currentiid: record.iid,
                    });
                }
            },
            "detail":{
                name:"detail",
                title:'查看详情',
                iconType:'vpicon-navopen',
                iconClassName:"text-primary m-lr-xs cursor",
                handler:function(record,btnItem,_thislist){
                    _thislist.setState({
                        showRightBox:true,
                        iid:record.iid
                    });
                },
            },
            "delete":{
                name:"delete",
                title:'删除',
                iconType:'vpicon-shanchu',
                iconClassName:"text-danger m-lr-xs cursor",
                render:function(ContentClass,record,props,_thislist){
                    return <VpPopconfirm title="确定要删除这条信息吗？" onConfirm={() => _thislist.doDeleteRow(record)}>
                        <span><ContentClass /></span>
                    </VpPopconfirm>
                }
            }
        }

        let buttons = this.getCustomOperationColButtons(record);
        if(!buttons){
            //如果没有自定义操作按钮，使用默认提供的
            buttons = [];
            buttons.push("file");
            buttons.push("detail");
            if(record.istatusflag == '0' && this.state.entityaddrole && record.principal != '0'){
                buttons.push("delete");
            }
        }
        buttons = mergeButtons(buttons,defaultBtns);
        return buttons.map((btnItem,btnIndex) => {
            if(btnItem.handler){
                btnItem.handlerWrap = this.onOperationColButtonClick.bind(this,btnItem,record);
            }
            return btnItem;
        });

    }

    onLoadHeaderSuccess(header){

    }

    /**
     * 关闭详情框
     */
    closeRightModal = () => {
        this.setState({
            showRightBox:false
        })
    }

    getEditHeader = () => {
        let _this = this;
        let param = {
            entityid: _this.props.entityid,
            viewcode: 'editlist',
        }
        vpQuery('/{vpplat}/vfrm/entity/editGrids', {
            ...param
        }).then(function (data) {
            if (data) {
                if (data.hasOwnProperty('data')) {
                    let _header = [];
                    let newData = data.data.fields
                    if (newData.length == 0) {
                        VpAlertMsg({
                            message: "消息提示",
                            description: '未查询到编辑列表视图！',
                            type: "error",
                            //onClose: this.onClose,
                            closeText: "关闭",
                            showIcon: true
                        }, 5)
                        _this.setState({ table_headers: [] });
                        return
                    }
                    let len = newData.length
                    newData.map(function (records, index) {
                        let _title, data_index, _field_width, _fixed;
                        for (let key in records) {
                            key == 'field_label' ? _title = records[key] :
                                key == 'field_name' ? data_index = records[key] : '';
                            if (key == 'fixed') {
                                _fixed = records[key];
                            }
                            if (key == 'iwidth') {
                                _field_width = records[key];
                            }
                        }
                        if (_title && data_index) {
                            if (_fixed == 'left' || _fixed == 'right') {
                                _header.push({
                                    title: _title,
                                    dataIndex: data_index,
                                    key: data_index,
                                    width: _field_width,
                                    fixed: _fixed
                                });
                            } else {
                                _header.push({
                                    title: _title,
                                    dataIndex: data_index,
                                    width: _field_width,
                                    key: data_index,
                                    fixed: _fixed,
                                    render: !records.edit_col ? null : (text, record) => {
                                        return (
                                            <EditTableCol
                                                callBack={_this.callBack}
                                                record={record}
                                                widget={records.widget}
                                                item={{ ...records.widget, irelationentityid: records.irelationentityid }}
                                                value={text}
                                            />
                                        )
                                    }
                                });
                            }
                        }
                    });
                    _header.push(_this.getOperationCol(_header));
                    _this.onLoadHeaderSuccess(_header);
                    _this.setState({ table_headers: _header, tableloading: false });
                }
            }
        }).catch(function (err) {
            console.log(err);
            _this.setState({ tableloading: false });
        });

    }
    /**
     * 拼接操作列
     * @param _header
     */
    getOperationCol = (_header) => {
        let _this = this;
        return {
            title: '操作', fixed: 'right', width: 140, key: 'operation',
            render: (text, record) => {
                let operationBtns = _this.getOperationColButtons(record);
                /**
                 * 创建按钮项
                 * @param btnItem
                 * @param ismenu  是否显示形式是下拉菜单形式（但按钮数大于4时，第3个（含）以后的按钮显示成下拉形式）
                 * @returns {*|void}
                 */
                let renderBtn = (btnItem,ismenu) => {
                    let ConentClass = (props) => {
                        let newProps = {...btnItem,...props};
                        let {render,handler,handlerWrap,iconClassName,iconType,...otherProps} = newProps;
                        otherProps = otherProps || {};
                        otherProps.className = iconClassName;
                        otherProps.type = iconType;


                        if(ismenu){
                            //如果时菜单形式的
                            return (
                                <span onClick={handlerWrap}>
                                    <VpIconFont  {...otherProps} />
                                    {btnItem.title}
                                </span>
                            )
                        }else{
                            return <VpIconFont {...otherProps} onClick={handlerWrap} />;
                        }
                    }


                    //如果有render，则用render渲染，如果没有则用默认的渲染规则
                    let newContent = btnItem.render?btnItem.render(ConentClass,record,btnItem,_this):<ConentClass />;
                    if(ismenu){
                        //如果展示形式是菜单，则需要VpMenuItem包裹
                        return (
                            <VpMenuItem key={btnItem.name}>
                                {newContent}
                            </VpMenuItem>
                        )
                    }else{
                        return newContent;
                    }
                }
                let moreBtns = [];
                let btnHtml = [];
                operationBtns.map((btnItem,btnIndex) => {
                    //按钮少于四个时，直接显示按钮,如果按钮数大于4个时，则第四个显示为”更多“按钮
                    if(btnIndex<2 || (operationBtns.length<=3 && btnIndex==2)){
                        btnHtml.push(
                            <VpTooltip placement="top" title={btnItem.title}>
                                { renderBtn(btnItem,false) }
                            </VpTooltip>
                        )
                    }else if(operationBtns.length>3 && btnIndex>=2){
                        moreBtns.push(
                            renderBtn(btnItem,true)
                        )
                    }
                });
                if(operationBtns.length>4){
                    btnHtml.push(
                        <VpTooltip placement="top" title="更多">
                            <VpDropdown overlay={(
                                <VpMenu >
                                    {moreBtns}
                                </VpMenu>
                            )}
                                        trigger={['click']}
                                        getPopupContainer={() => document.body}
                            >
                                <VpIconFont data-id={record.iid} className="cursor m-lr-xs f16" type='vpicon-wait-x'
                                            onClick={(e) => e.stopPropagation()}
                                />
                            </VpDropdown>
                        </VpTooltip>
                    )
                }
                return <span onClick={(e) => {e.stopPropagation(); }}>{btnHtml}</span>;

            }
        }
    }

    // 展开行
    getExpandedRowa = (srcArr, resArr) => {
        const _this = this
        let expandArr = resArr
        if (srcArr.length) {
            let tmpArr = []
            srcArr.map((item) => {
                expandArr.push(item.key)
                if (item.hasOwnProperty('children')) {
                    tmpArr = _this.getExpandedRowa(item.children, expandArr)
                    tmpArr.map((tmpid) => {
                        const idx = expandArr.findIndex((iid) => tmpid === iid)
                        if (idx == -1) {
                            expandArr.push(tmpid)
                        }
                    })
                }
            })
        }
        return expandArr
    }

    /**
     *  重置表格高度
     */
    resetTableHeight(){
        // let theight = vp.computedHeight(resultList.length, '.entityTable')
        // if (this.props.fromtype == 'resource') {
        //     theight = theight - 50
        // }
        let theight = vp.computedHeight(1);
        this.setState({
            tableHeight: theight
        })
    }

    reloadTable(){
        this.changeQueryParams({
            _k:new Date().getTime()
        })
    }

    controlAddButton = (numPerPage, resultList) => {
        let expandArr = this.getExpandedRowa(resultList, [])
        //设置展开行
        this.setState({
            tableloading: false,
            expandedRowKeys: expandArr,
        })
        this.resetTableHeight();
    }

    //编辑表格新增
    handleEditAdd = () => {
        this.tableRef.addTableRow({ iid: this.objectid-- });
        this.resetTableHeight();
    }

    /**
     * 保存前拦截
     * @param saveData 要保存的数据
     * @return boolean 如果返回false,则不执行保存，不返回或返回其他值都执行保存
     *
     */
    onBeforeSave(saveData){

    }

    /**
     * 保存接口
     * @return {string}
     */
    getCustomSaveUrl(){
        return '/{vpplat}/vfrm/entity/saveEditData';
    }

    /**
     *  保存
     * @param saveData
     */
    onSave(saveData){
        vpAdd(this.getCustomSaveUrl(), {
            entityid: this.props.entityid,
            editData: JSON.stringify(saveData)
        }).then((response) => {
            this.tableRef.getTableData()
            this.setState({
                editrowdata: {},//需要保存的编辑数据
                filearr: {}
            })
        })
    }
    //编辑表格保存
    handleEditSave = () => {
        let editData = this.state.editrowdata;
        if ($.isEmptyObject(editData)) {
            VpAlertMsg({
                message: "消息提示",
                description: '暂无可保存的数据！',
                type: "error",
                //onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 5)
            return;
        }
        let saveData = []
        for (const key in editData) {
            if (editData.hasOwnProperty(key)) {
                const rowdatas = editData[key];
                delete rowdatas['undefined'];
                delete rowdatas['className'];
                let fileinfo = this.state.filearr[rowdatas.iid]
                if (fileinfo != '' && fileinfo != undefined) {
                    rowdatas['fileinfo'] = fileinfo
                }
                for (const field in rowdatas) {
                    if (endWithStr(field, 'val')) {
                        let newfield = field.replace("val", "")
                        rowdatas[newfield] = rowdatas[field]
                    }
                }
                rowdatas.iid = rowdatas.iid > 0 ? rowdatas.iid : ""
                saveData.push(rowdatas)
            }
        }
        if(this.onBeforeSave(saveData) === false){
            //如果返回false,则不执行保存，不返回或返回其他值都执行保存
            return;
        }
        this.onSave(saveData);
    }

    //编辑表格刷新
    handleReload = () => {
        this.setState({
            tableloading: true
            //editrowdata:{}
        })
        this.tableRef.getTableData()
    }


    /**
     * 获取查询条件
     * @returns {*|{}}
     */
    getQueryParams(){
        //合并默认查询条件
        let {defaultCondition,...otherParams} = this.props.queryParams||{};
        otherParams = otherParams||{};
        if(defaultCondition){
            let condition = otherParams.condition;
            defaultCondition = JSON.parse(defaultCondition);
            if(condition){
                condition = JSON.parse(condition);
            }else{
                condition = [];
            }
            condition = condition.concat(defaultCondition);
            otherParams.condition = JSON.stringify(condition);
        }
        return otherParams;
    }

    /**
     * 表格自定义属性
     * @returns {}
     */
    getCustomTableOptions(){
        return {

        }
    }


    /**
     * 自定义表格底部工具栏，参数见http://www.vpsoft.cn:8082/apiweb/#/VpDTable?_k=n20rng的tableOptions
     **/
    getCustomTableBottomToolbars(){

    }

    /**
     * 获取表格底部工具栏按钮
     **/
    getTableBottomToolbars(){
        let defaultBtns ={
            add:{
                title: '新增',
                tooltip: false,
                className: 'cursor blue',
                type: 'plus-circle-o',
                iconClickFunction: this.handleEditAdd,
            },
            save:{
                title: '保存',
                    tooltip: false,
                className: 'cursor green',
                type: 'save',
                iconClickFunction: this.handleEditSave
            },
            refresh:{
                title: '刷新',
                tooltip: false,
                className: 'cursor sky_blue',
                type: 'reload',
                iconClickFunction: this.handleReload
            }
        }
        let customBtns = this.getCustomTableBottomToolbars();
        if(!customBtns){
            customBtns = ["add","save","refresh"];
        }
        let newButtons = mergeButtons(customBtns,defaultBtns);
        return newButtons;
    }

    render() {
        return (
            <div id="vp-entity-drown" className={"batch-table" }>
                <VpDTable
                    loading={this.state.tableloading}
                    ref={table => this.tableRef = table}
                    queryMethod="POST"
                    controlAddButton={
                        (numPerPage, resultList) => {
                            this.controlAddButton(numPerPage, resultList)
                        }
                    }
                    dataUrl={'/{vpplat}/vfrm/entity/dynamicListData'}
                    params={this.getQueryParams()}
                    className="entityTable"
                    expandIconColumnIndex={0}
                    columns={this.state.table_headers}
                    tableOptions={this.getTableBottomToolbars()}
                    bindThis={this}
                    rowKey="iid"
                    showTotal="false"
                    resize
                    scroll={{ y: this.state.tableHeight }}
                    {...this.getCustomTableOptions()}
                />
                {/*详情*/}
                <RightBox
                    button={
                        <div className="icon p-xs" onClick={this.closeRightModal}>
                            <VpTooltip placement="top" title=''>
                                <VpIcon type="right" />
                            </VpTooltip>
                        </div>}
                    show={this.state.showRightBox}>
                    {this.state.showRightBox ? <EntityDetail entityid={this.props.entityid} iid={this.state.iid} closeRightModal={this.closeRightModal} defaultActiveKey={this.state.defaultActiveKey}/> : null}
                </RightBox>
                <VpModal
                    max={true}
                    title="选择附件"
                    visible={this.state.VpUploader}
                    onOk={this.handleFileCancel}
                    onCancel={this.handleFileCancel}
                    width={'70%'}
                    height={'80%'}
                    wrapClassName='modal-no-footer dynamic-modal'>
                    {
                        this.state.VpUploader ?
                            <VpUploader
                                server="/zuul/{vpplat}/file/uploadfile"
                                onUploadAccept={this.onUploadAccept}
                                fileTypes={this.state.doctypelist}
                                selectType={this.state.selectType}
                            />
                            : null
                    }
                </VpModal>
            </div>
        );
    }
}




function mapStateToProps(state,ownProps){
    return {
        queryParams:state[ownProps._contextid]
    }
}

function mapToDispatchToProps(dispatch,ownProps){
    return {
        changeQueryParams:function(queryParams){
            dispatch(changeQueryParams(ownProps._contextid,queryParams));
        }
    }
}


/**
 * 方便二次开发人员继承用
 * 二次开发时,先申明类，并继承XX.Component,然后再调用xx.createClass,
 * 例子：
 * class CustomComponent extends StatusButton.Component {
 *
 * }
 * CustomComponent = DynamicForm.createClass(CustomComponent);
 * @param newClass
 */
let createClass = function(newClass){
    let wrapClass = connect(mapStateToProps,mapToDispatchToProps)(newClass);
    wrapClass.Component = newClass;
    wrapClass.createClass = createClass;
    return wrapClass;
}
export default createClass(EditTable);
