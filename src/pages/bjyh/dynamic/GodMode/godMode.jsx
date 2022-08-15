import React, { Component } from 'react'
import { vpAdd, vpQuery, VpModal, VpTable, VpIcon, VpTooltip, VpRow, VpCol, VpInput } from 'vpreact';
import {
    SeachInput,
    CheckRadio,
    RightBox,
} from 'vpbusiness';
import FlowInfo from './FlowInfo';
import { godModeStaticData } from './godModeStaticData';
//上帝模式
class godeMode extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tableHeader: [],
            quickvalue: '',
            showRightBox: false,
            staskid: '',
            entityid: '',
            iid: '',
            record: {},
            usermode: '',
            formkey: '',
            activityName: '',
            steps: [],
            taskId: '',
            tableHeight: '',
            waitParam: true,
            loading: false,
        }

    }
    componentWillMount() {
        this.getHeader()
    }
    componentDidMount() {
        let tHeight = vp.computedHeight('.godMode')
        this.setState({
            tableHeight: tHeight + 50,
        })
    }

    //获取列头
    getHeader = () => {
        let headers = godModeStaticData.godMode_headers || []
        this.setState({
            tableHeader: headers
        })
    }

    // 搜索框确定事件
    handleSearch = (value) => {
        const searchVal = $.trim(value);//value.replace(/\s/g, "");
        this.setState({
            waitParam: false,
            loading: true,
            quickvalue: searchVal,
            _k: +new Date()
        })
    }

    // 关闭右侧弹出    
    closeRightModal = () => {
        this.setState({
            showRightBox: false,
        })
    }

    //点击渲染流程步骤信息RightBox
    onRowClick = (record, index) => {
        this.setState({
            record: record,
            showRightBox: true,
        })
    }

    controlAddButton = (numPerPage, resultList) => {
        let theight = vp.computedHeight(resultList.length, '.godMode', 220)
        this.setState({
            loading: false,
            tableHeight: theight,
            resultList: resultList.length
        })
    }

    addNewDom = () => {
        let record = this.state.record
        return (
            <FlowInfo
                {...record}
            />
        )
    }

    render() {
        let _this = this
        return (
            <div className="business-container pr full-height entity">
                <div className="subAssembly b-b bg-white">
                    <VpRow gutter={1}>
                        <VpCol className="gutter-row text-right" span={4}>
                            <div className="m-b-sm search entitysearch" >
                                <SeachInput onSearch={_this.handleSearch} />
                            </div>
                        </VpCol>
                        {/* <VpCol className="gutter-row text-right" span={4}>
                            <VpInput id={'quicktext'} placeholder="输入名称查找" suffix={<VpIcon type='search' style={{ marginTop: 7 }} onClick={this.handleSearch} />} onPressEnter={() => { this.handleSearch() }} />
                        </VpCol> */}
                    </VpRow>
                </div>
                <div className="business-wrapper p-t-sm full-height overflow">
                    <div className="p-sm bg-white full-height scroll-y" >
                        <VpTable
                            ref={table => this.tableRef = table}
                            waitParam={this.state.waitParam}
                            loading={this.state.loading}
                            params={{
                                quickvalue: this.state.quickvalue,
                                _k: this.state._k || ''
                            }}
                            controlAddButton={
                                (numPerPage, resultList) => {
                                    this.controlAddButton(numPerPage, resultList)
                                }
                            }
                            dataUrl={'/{bjyh}/God/flowList'}
                            columns={this.state.tableHeader}
                            onRowClick={this.onRowClick}
                            bindThis={this}
                            className="godMode"
                            scroll={{ y: this.state.tableHeight }}
                            resize
                        // bordered
                        />
                    </div>
                </div>
                <RightBox
                    max={true}
                    button={
                        <div className="icon p-xs" onClick={this.closeRightModal}>
                            <VpTooltip placement="top" title=''>
                                <VpIcon type="right" />
                            </VpTooltip>
                        </div>}
                    tips={
                        <div className="tips p-xs">
                            <VpTooltip placement="top" title="对象名称">
                                <VpIcon type="exclamation-circle text-muted m-r-xs" />
                            </VpTooltip>
                            {this.state.record.objectname || ''}
                        </div>
                    }
                    show={this.state.showRightBox}>
                    {this.state.showRightBox ? this.addNewDom() : null}
                </RightBox>

            </div>
        );
    }
}


export default godeMode;