import React, { Component } from 'react'
import {
    VpIcon,
    VpTooltip,
    vpQuery,
    VpAlertMsg,
    vpAdd,
    VpIconFont,
    VpDropdown,
    VpPopconfirm,
    VpMenu,
    VpMenuItem
} from 'vpreact';
import './index.less';
import { requireFile } from 'utils/utils';
import { connect } from 'react-redux';
import { changeQueryParams } from 'reduxs/actions/action';

import {
    RightBox,
    VpDTable
} from 'vpbusiness';
import EntityDetail from "../DynamicForm/EntityDetail";
import { mergeButtons, endWithStr } from '../utils';


/**
 * 普通表格
 * 普通表格提供以下扩展接口
 * onLoadHeaderSuccess 表头加载成功后
 * getOperationColButtons
 *
 */
class NormalTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            table_headers: [],
            expandedRowKeys: [],
            tableData: []
        }
        this.onRowClick = this.onRowClick.bind(this);
        this.reloadTable = this.reloadTable.bind(this);
        this.handleLike = this.handleLike.bind(this);
        this.handleDiscuss = this.handleDiscuss.bind(this);
        this.doDeleteRow = this.doDeleteRow.bind(this);
        this.onExpand = this.onExpand.bind(this);//展开点击函数
        this.props.onRef && this.props.onRef(this); //将对象注册到父类中
    }

    componentWillMount() {
        this.getHeader();
    }

    onLoadHeaderSuccess(header) {

    }

    /**
     * 获取查询条件
     * @returns {*|{}}
     */
    getQueryParams() {
        //合并默认查询条件
        let { defaultCondition, ...otherParams } = this.props.queryParams || {};
        otherParams = otherParams || {};
        if (defaultCondition) {
            let condition = otherParams.condition;
            defaultCondition = JSON.parse(defaultCondition);
            if (condition) {
                condition = JSON.parse(condition);
            } else {
                condition = [];
            }
            condition = condition.concat(defaultCondition);
            otherParams.condition = JSON.stringify(condition);
        }
        return otherParams;
    }

    handleLike({ ientityid, iid }) {
        vpAdd('/{vpplat}/vfrm/entity/handleLike', {
            ientityid,
            iid
        }).then((data) => {
            this.reloadTable();
        })
    }

    handleDiscuss = (record) => {
        let { ientityid, iid } = record
        let skey = 'entity' + ientityid + '_discuss';
        this.setState({
            defaultActiveKey: skey + 'tab',
            showRightBox: true,
            iid: iid,
            entityid: ientityid,
            record: record
        });
    }

    //删除数据确认事件
    doDeleteRow({ ientityid, iid }) {
        const _this = this;
        vpAdd('/{vpplat}/vfrm/entity/deleteData', {
            iid: iid,
            entityid: ientityid
        }).then(function (data) {
            _this.reloadTable();
        })
    }

    /**
     * 默认的列表操作列按钮
     * @param record
     */
    getDefaultOperationColButtons(record) {
        let defaultBtns = {
            "like": {
                name: "like",
                title: record.ilike == 0 ? "关注" : '取消关注',
                iconType: record.ilike == 1 ? "vpicon-star" : "vpicon-star-o",
                iconClassName: "text-primary m-lr-xs cursor",
                handler: this.handleLike,
            },
            "discuss": {
                name: "discuss",
                title: '评论',
                iconType: 'vpicon-pinglun',
                iconClassName: "text-primary m-lr-xs cursor",
                handler: this.handleDiscuss,
            },
            "delete": {
                name: "delete",
                title: '删除',
                iconType: 'vpicon-shanchu',
                iconClassName: "text-primary m-lr-xs cursor  text-danger",
                doDeleteRow: this.doDeleteRow.bind(this, record),
                render: function (ContentClass, record, props, _thislist) {
                    return <VpPopconfirm title="确定要删除这条信息吗？" onConfirm={props.doDeleteRow}>
                        <span><ContentClass /></span>
                    </VpPopconfirm>
                }
            }
        }
        return defaultBtns;
    }

    /**
     * 获取自定义操作按钮
     */
    getCustomOperationColButtons(record) {
        let buttons = this.props.buttons;
        if (!buttons) {
            //如果没有自定义操作按钮，使用默认提供的
            buttons = [];
            buttons.push("like");
            buttons.push("discuss");
            if (record.istatusflag == '0' && this.props.entityaddrole && record.principal != '0'
                && this.state.delflag == '1') {
                buttons.push("delete");
            }
        }
        return buttons;
    }
    /**
     * 获取操作列列表的按钮
     */
    getOperationColButtons(record) {
        let defaultBtns = this.getDefaultOperationColButtons(record);
        let buttons = this.getCustomOperationColButtons(record);
        buttons = mergeButtons(buttons, defaultBtns);
        return buttons.map((btnItem, btnIndex) => {
            if (btnItem.handler) {
                btnItem.handlerWrap = this.onOperationColButtonClick.bind(this, btnItem, record);
            }
            return btnItem;
        });

    }

    /**
     * 操作列按钮点击
     */
    onOperationColButtonClick(btnItem, record) {
        btnItem.handler && btnItem.handler(record, btnItem);
    }


    //获取表头数据
    getHeader() {
        this.setState({
            tableloading: true
        })
        let _this = this;
        vpQuery('/{vpplat}/vfrm/entity/getheaders', {
            entityid: _this.props.entityid
        }).then(function (data) {
            if (data) {
                if (data.hasOwnProperty('data')) {
                    let delflag = data.data.delflag
                    let addflag = data.data.addflag
                    _this.props.getAddflag(true,addflag)
                    _this.setState({ loading: false, delflag });
                    if (data.data.hasOwnProperty('grid')) {
                        let _header = [];
                        if (data.data.grid.hasOwnProperty('fields')) {
                            data.data.grid.fields.map(function (records, index) {
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
                                            key: data_index,
                                            fixed: _fixed,
                                            width: _field_width,
                                            sorter: true
                                        });
                                    }
                                }
                            });

                            let _headerNew = _header;
                            _headerNew.push(_this.getOperationCol(_headerNew));
                            _this.onLoadHeaderSuccess(_headerNew);
                            _this.setState({ table_headers: _headerNew, tableloading: false });
                        }
                    }
                }
            }
        }).catch(function (err) {
            console.log(err);
        });
    }

    /**
     * 拼接操作列
      * @param _headerNew
     */
    getOperationCol = (_headerNew) => {
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
                let renderBtn = (btnItem, ismenu) => {
                    let ConentClass = (props) => {
                        let newProps = { ...btnItem, ...props };
                        let { render, handler, handlerWrap, iconClassName, iconType, ...otherProps } = newProps;
                        otherProps = otherProps || {};
                        otherProps.className = iconClassName;
                        otherProps.type = iconType;


                        if (ismenu) {
                            //如果时菜单形式的
                            return (
                                <span onClick={handlerWrap}>
                                    <VpIconFont  {...otherProps} />
                                    {btnItem.title}
                                </span>
                            )
                        } else {
                            return <VpIconFont {...otherProps} onClick={handlerWrap} />;
                        }
                    }


                    //如果有render，则用render渲染，如果没有则用默认的渲染规则
                    let newContent = btnItem.render ? btnItem.render(ConentClass, record, btnItem, _this) : <ConentClass />;
                    if (ismenu) {
                        //如果展示形式是菜单，则需要VpMenuItem包裹
                        return (
                            <VpMenuItem key={btnItem.name}>
                                {newContent}
                            </VpMenuItem>
                        )
                    } else {
                        return newContent;
                    }
                }
                let moreBtns = [];
                let btnHtml = [];
                operationBtns.map((btnItem, btnIndex) => {
                    //按钮少于四个时，直接显示按钮,如果按钮数大于4个时，则第四个显示为”更多“按钮
                    if (btnIndex < 2 || (operationBtns.length <= 3 && btnIndex == 2)) {
                        btnHtml.push(
                            <VpTooltip placement="top" title={btnItem.title}>
                                {renderBtn(btnItem, false)}
                            </VpTooltip>
                        )
                    } else if (operationBtns.length > 3 && btnIndex >= 2) {
                        moreBtns.push(
                            renderBtn(btnItem, true)
                        )
                    }
                });
                if (operationBtns.length > 3) {
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
                return <span onClick={(e) => { e.stopPropagation(); }}>{btnHtml}</span>;

            }
        }
    }

    onRowClick(record) {
        let _this = this;
        let iid = record.iid;
        let sname = record.sname;
        let scode = record.scode;
        let ientityid = record.ientityid;
        this.setState({
            showRightBox: true,
            iid: iid,
            record: record
        });
    }

    reloadTable() {
        this.changeQueryParams({
            _k: new Date().getTime()
        })
    }

    changeQueryParams(queryParams) {
        this.props.changeQueryParams && this.props.changeQueryParams(queryParams);
    }

    /**
     * 关闭详情框
     */
    closeRightModal = () => {
        this.setState({
            showRightBox: false
        })
        this.tableRef.getTableData();//刷新页面
    }

    //异步加载树
    onExpand(expanded, record) {
        if (!expanded) {
            const idx = this.state.expandedRowKeys.findIndex((iid) => record.key === iid)
            this.setState({
                expandedRowKeys: [...this.state.expandedRowKeys.slice(0, idx), ...this.state.expandedRowKeys.slice(idx + 1)]
            })
        } else {
            this.setState({
                expandedRowKeys: [...this.state.expandedRowKeys, record.key]
            })
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

    controlAddButton(numPerPage, resultList) {
        let theight = vp.computedHeight(resultList.length, '.entityTable')
        if (this.props.fromtype == 'resource') {
            theight = theight - 50
        }
        let expandArr = this.getExpandedRowa(resultList, [])
        //设置展开行
        this.setState({
            tableloading: false,
            expandedRowKeys: expandArr,
            tableHeight: theight
        })
    }

    /**
     * 表格自定义属性
     * @returns {}
     */
    getCustomTableOptions() {
        return {
            dataUrl: '/{vpplat}/vfrm/entity/dynamicListData'
        }
    }

    /**
     * 渲染右侧弹出框内容
     */
    _renderRightBoxBody() {
        let props = {
            entityid: this.state.record.ientityid,
            iid: this.state.iid,
            closeRightModal: this.closeRightModal,
            defaultActiveKey: this.state.defaultActiveKey,
        }
        return this.renderRightBoxBody(props);
    }
    renderRightBoxBody(props) {
    console.log(props, 'node');
        return <EntityDetail {...props} />;
    }



    render() {
        let options = [];
        return (
            <div id="vp-entity-drown">
                <VpDTable
                    loading={this.state.tableloading}
                    ref={table => this.tableRef = table}
                    queryMethod="POST"
                    onExpand={this.onExpand}
                    expandedRowKeys={this.state.expandedRowKeys}
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
                    tableOptions={options}
                    bindThis={this}
                    rowKey={"key"}
                    onRowClick={this.onRowClick}
                    showTotal={false}
                    resize
                    scroll={{ y: this.state.tableHeight }}
                    {...this.getCustomTableOptions()}
                />
                <RightBox
                    //关联页签新建弹半框
                    max={this.props.formType != 'tabs'}
                    button={
                        <div className="icon p-xs" onClick={this.closeRightModal}>
                            <VpTooltip placement="top" title=''>
                                <VpIcon type="right" />
                            </VpTooltip>
                        </div>}
                    show={this.state.showRightBox}>
                    {this.state.showRightBox ? this._renderRightBoxBody() : null}
                </RightBox>
            </div>
        );
    }
}


function mapStateToProps(state, ownProps) {
    return {
        queryParams: state[ownProps._contextid]
    }
}

function mapToDispatchToProps(dispatch, ownProps) {
    return {
        changeQueryParams: function (queryParams) {
            dispatch(changeQueryParams(ownProps._contextid, queryParams));
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
let createClass = function (newClass) {
    let wrapClass = connect(mapStateToProps, mapToDispatchToProps)(newClass);
    wrapClass.Component = newClass;
    wrapClass.createClass = createClass;
    return wrapClass;
}
export default createClass(NormalTable);
