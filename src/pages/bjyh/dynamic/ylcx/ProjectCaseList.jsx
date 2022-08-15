import React, { Component } from 'react'
import {
    VpIcon,
    VpTooltip,
    VpRow,
    VpCol,
    VpIconFont,
    VpRadioButton,
    VpRadioGroup,
    VpSpin, vpQuery, VpTabs,VpTabPane,vpAdd,VpAlertMsg
} from 'vpreact';
import { VpSearchInput,VpDTable,RightBox } from 'vpbusiness';
import FlowList from './FlowList';
import ReqCaseEditAttr from './reqCaseEditAttr';

class ProjectCaseList extends Component{
    constructor(props) {
        super(props);
        this.state = {
            showRightBox: false,
            cur_page: 1,
            page: 1,
            limit:10,
            quickvalue:'',
            pagination:{},
            rowSelection:{},
            table_array:[]
        }
        this.tableChange = this.tableChange.bind(this);
    }
    componentWillMount(){
        vpQuery('/{bjyh}/xqyl/getProjectInfo',{projectid:this.props.iid||0}).then(res=>{
            if(res.data){
                this.setState({
                    projectinfo:res.data
                },()=>{
                    this.getListData();
                })
            }
        })
    }
    getListData=()=> {
        const _this = this;
        const { cur_page, limit, item } = _this.state;
        vpAdd(window.vp.config.jgjk.xmyl.xmylRelReqCaseListUrl, {
            pageNum:cur_page,pageSize:limit,
            quickSearch:this.state.quickvalue,
            userCode:vp.cookie.getTkInfo("username")
        }).then((datas) => {
            if(datas.rows){
                let data = datas.rows;
                let showTotal = () => {
                    return '共' + datas.total + '条'
                }
                _this.setState({
                    table_array: data,
                    cur_page: cur_page,
                    total_rows: datas.total,
                    num_perpage: limit,
                    pagination: {
                        total: datas.total,
                        showTotal: showTotal,
                        pageSize: limit,
                        showSizeChanger: true,
                        showQuickJumper: true,
                    }
                })
            }
        }).catch((error)=>{
            console.log(error);
            VpAlertMsg({ 
                message:"消息提示",
                description:"调用IT架构平台数据接口异常，请联系系统管理员。",
                type:"error",
                showIcon: true
            }, 3)
        })
    }
    // 表格的变动事件
    tableChange(pagination, filters, sorter) {
        let sorttype = ''
        if (sorter.order === 'descend') {
            sorttype = 'desc';
        } else if (sorter.order === 'ascend') {
            sorttype = 'asc';
        }
        this.setState({
            cur_page: pagination.current || this.state.cur_page,
            sortfield: sorter.field,
            sorttype,
            limit: pagination.pageSize || this.state.limit,
        }, () => {
            this.getListData()
        })
    }
    onRowClick = (r) => {
        this.setState({
            showRightBox: false
        },()=>{
            this.setState({
                showRightBox: true,
                rowSelection:r
            })
        })
    }
    closeModal = () => {
        this.setState({
            showRightBox: false            
        })
    }

    handleEnter = () => {
        this.getListData();
	}
    handleChange = (e) => {
        this.setState({
            quickvalue:e.target.value
        })
	}
    searchButton = () => {
        this.handleEnter();
	}
    render() {
        const _this = this;
        const columns = [
            { title: '用例编号', width: 100, dataIndex: 'caseCode',  },
            { title: '用例名称', width: 100, dataIndex: 'caseName', },
            { title: '用例类型名称', dataIndex: 'caseTypeName',  width: 150 },
            { title: '用例简述概要', dataIndex: 'caseDes', width: 150 },
            // { title: '项目编号', dataIndex: 'projectCode',  width: 150 },
            // { title: '项目名称', dataIndex: 'projectName',  width: 150 },
            { title: '任务编号', dataIndex: 'taskCode',  width: 150 },
            { title: '任务名称', dataIndex: 'taskName', width: 150 },
            { title: '涉及系统', dataIndex: 'relSystem',  width: 150 },
            { title: '用例状态', dataIndex: 'caseStatus',  width: 150 },
            { title: '创建人', dataIndex: 'userName',  width: 150 },
            // { title: '创建时间', dataIndex: 'creatTime',  width: 150 },
        ];
        return (
            <div className="business-container pr full-height entity">
                <div className="subAssembly b-b bg-white" style={this.props.style}>
                    <VpRow gutter={10}>
                        <VpCol className="gutter-row" span={4}>
                            <div className="m-b-sm search entitysearch" >
                            <VpSearchInput 
                                ref={dom => this.searchInput = dom}
                                onPressEnter={this.handleEnter}
                                onChange={this.handleChange}
                                placeholder="请输入搜索内容"
                                searchButton={this.searchButton} />
                            </div>
                        </VpCol>
                        
                        <VpCol className="gutter-row text-right" span={4}>
                            {
                                //放置按钮区
                            }
                        </VpCol>
                    </VpRow>
                </div>

                <div className="business-wrapper p-t-sm full-height" id="table">
                    <div className="bg-white p-sm entity-list full-height">
                        <VpRow gutter={16} className="full-height">
                            <VpCol span={24} className="full-height scroll-y">
                                <VpSpin spinning={false} size="large">
                                    <VpDTable 
                                        columns={columns} 
                                        dataSource={this.state.table_array} 
                                        scroll={{ x: 1500, y: 800 }} 
                                        resize 
                                        onChange={this.tableChange}
                                        onRowClick={this.onRowClick}
                                        pagination={this.state.pagination}
                                        />
                                </VpSpin>
                            </VpCol>
                        </VpRow>
                    </div>
                </div>
                <RightBox
                    onClose={this.closeModal}
                    tips={
                        <div className="tips p-xs">
                            <VpTooltip placement="top" title="0000">
                                <VpIcon type="exclamation-circle text-muted m-r-xs" />
                            </VpTooltip>
                        </div>
                    }
                    show={this.state.showRightBox}>
                        {this.state.showRightBox ? 
                        <VpTabs defaultActiveKey="attr" destroyInactiveTabPane>
                            <VpTabPane tab="属性" key="attr">
                                <ReqCaseEditAttr 
                                parent={this}
                                data={this.state.rowSelection}/>
                            </VpTabPane>
                            <VpTabPane tab="流程" key="flow">
                                <FlowList rowData={this.state.rowSelection}></FlowList>
                            </VpTabPane>
                        </VpTabs> : null}
                </RightBox>
            </div>
        );
    }
}
export default ProjectCaseList