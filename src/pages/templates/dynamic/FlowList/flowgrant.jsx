import React, { Component } from 'react'
import { VpTable, VpButton } from 'vpreact';
import {
    vpAdd,
    VpFormCreate,
    VpIcon,
} from 'vpreact';

class flowgrant extends Component {
    constructor(props) {
        super(props)
        this.state = {
            filtervalue: '',
            filters:[],
            quickvalue: '',
            tableHeader: [],
            visible: false,
            record:[],
            tableHeight:''
        }

    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            filtervalue:nextProps.filtervalue,
            quickvalue:nextProps.quickvalue
        },()=>{
            this.tableRef.getTableData()
        })
    }
    componentWillMount() {
        this.queryHeader()
    }
   
    componentDidMount() {

    }

    queryHeader = () => {
        const columns = [
            { title: '授权者', dataIndex: 'assigneeName', key: 'assigneeName', },
            { title: '被授予者', dataIndex: 'delegateeName', key: 'delegateeName', },
            { title: '创建时间', dataIndex: 'createtime', key: 'createtime', },
            { title: '开始时间', dataIndex: 'starttime', key: 'starttime', },
            { title: '结束时间', dataIndex: 'endtime', key: 'endtime', },
            { title: '授权类型', dataIndex: 'typeName', key: 'typeName', },
            { title: '流程', dataIndex: 'flowname', key: 'flowname',width: 160, 
                 render: (text, record) => {
                    let flowname =  record.piid == ''? record.flowname:record.piName
                    return (<span>{flowname}</span>) 
            }
            },
            { title: '状态', dataIndex: 'flagName', key: 'flagName', width:50},
            {
                title: '操作',
                fixed: 'right',
                width: 120,
                key: 'operation',
                render: (text, record) => {
                    return (
                        <div>
                            {
                            record.flag==0?
                            <VpIcon title="启用" onClick={(e) => this.handleFlag(e, record)} className="cursor m-lr-xs" type="vpicon-check-circle-o" />
                            :
                            <VpIcon title="禁用" onClick={(e) => this.handleFlag(e, record)} className="cursor m-lr-xs" type="vpicon-refuse-o" />
                            //<VpSwitch  defaultChecked={!(record.flag==0)} onChange={(e) => this.handleFlag(e, record)}/>
                            }
                        </div>
                    )
                }
            },
        ]
        this.setState({
            tableHeader: columns
        })
    }
    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }

    /* // 搜索框确定事件
    handlesearch = (value) => {
        const quickvalue = value.replace(/\s/g, "");
        this.setState({ quickvalue },()=>{
            this.queryHeader()
            this.tableRef.getTableData()
        })
    } */
    handleFlag = (e, record) => {
        vpAdd('/{vpflow}/rest/flowgrant/flag', {
            id: record.id
        }).then((response) => {
            this.setState({
                tableHeader:[]
            },()=>{
                this.queryHeader()
                this.tableRef.getTableData()
            })
        })
    }

   /*  filterChange=(e)=>{
        console.log(e.target)
        this.setState({
            filtervalue: e.target.value
         }, () => {
            this.tableRef.getTableData()
        }) 
    } */

   
    
    
    toolBarAddClick = ()=>{
        this.setState({visible:true});
    }

    onRowClick=(record, index)=>{
    }

    controlAddButton = (numPerPage, resultList) => {
        let theight = vp.computedHeight(resultList.length,'.flowgrant')
        this.setState({
            tableHeight: theight
        })

    }

    render() {
        return (
            <div className="bg-white">
                <VpTable
                    className="flowgrant"
                    ref={table => {
                        this.tableRef = table
                        this.props.bindTable(table)
                    }}
                    controlAddButton={
                        (numPerPage, resultList) => {
                            this.controlAddButton(numPerPage, resultList)
                        }
                    }
                    dataUrl={'/{vpflow}/rest/flowgrant/page2'}
                    scroll={{y: this.state.tableHeight }}
                    params={{
                        quickvalue: this.state.quickvalue,
                        filtervalue: this.state.filtervalue
                    }
                    }
                    columns={this.state.tableHeader}
                    onRowClick={this.onRowClick}
                    bindThis={this}
                    resize
                    // bordered
                />
            </div>
        );
    }
}

export default flowgrant = VpFormCreate(flowgrant);