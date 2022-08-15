import React, { Component } from 'react'
import {
    VpDropdown, VpTabs, vpQuery
} from "vpreact";
import { FindCheckbox } from "vpbusiness";
import SearchForm from "./SearchForm";
import { connect } from 'react-redux';
import { changeQueryParams } from 'reduxs/actions/action';
/**
 * 添加按钮
 */
class SearchButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            s_visible: false
        }
    }
    componentWillMount() {
        this.querySearchFormData();
    }


    /**
     *  在弹出查询框中点击查询事件
     */
    handleSearchForm = (searchData) => {
        this.props.changeQueryParams && this.props.changeQueryParams({
            condition: JSON.stringify(searchData)
        })
        this.hideSearchModal();
    }


    /**
     *  在弹出查询框中点击取消查询事件
     */
    cancelSearch = () => {
        this.hideSearchModal();
    }
    /**
     * 关闭查询对话框
     */
    hideSearchModal = () => {
        this.setState({
            s_visible: false
        })
    }


    /**
     * 过滤器变化后
     */
    onFilterChange = (filterValue) => {
        this.setState({
            filterValue: filterValue
        });
    }

    /**
     * 显示搜索框
     */
    handleVisibleChange = () => {
  
        if (!this.chooseVisible) {
            let { formData } = this.state
            if (formData && formData.length > 0) {
                this.setState({ s_visible: !this.state.s_visible })
            } else {
                VpAlertMsg({
                    message: "消息提示",
                    description: '暂无可搜索项，请配置搜索表单！',
                    type: "error",
                    onClose: this.onClose,
                    closeText: "关闭",
                    showIcon: true
                }, 5)
            }
        }
    }

    querySearchFormData = () => {
        vpQuery('/{vpplat}/vfrm/entity/searchForm', {
            entityid: this.props.entityid, scode: 'search'
        }).then((response) => {
            let formData = response.data.form || {};
            this.setState({
                formData: formData.groups
            });
        })
    }

    // 返回参数给父层控制是否关闭下拉层
    chooseModalVisible = (visible) => {
        this.chooseVisible = visible
    }

    render() {

        //查询框
        const menu = (
            <div className="search-form bg-white ant-dropdown-menu">
                <SearchForm
                    chooseModalVisible={this.chooseModalVisible}
                    cancelSearch={this.cancelSearch}
                    handleSearchForm={this.handleSearchForm}
                    entityid={this.props.entityid}
                    formData={this.state.formData} />
            </div>
        )
        return (
            <div style={{ display: 'inline-block' }} className="text-left">
                <VpDropdown
                    onClick={this.handleVisibleChange}
                    trigger={['click']}
                    overlay={menu}
                    onVisibleChange={this.handleVisibleChange}
                    visible={this.state.s_visible}>
                    <div style={{ display: 'inline-block' }} id="searchbox">
                        <FindCheckbox />
                    </div>
                </VpDropdown>
            </div>
        )
    }
}




function mapStateToProps(state, ownProps) {
    return {
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
export default createClass(SearchButton);