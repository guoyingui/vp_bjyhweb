import React, { Component } from 'react'
import { VpModal, VpAlertMsg, VpIconFont, VpTable, vpAdd, vpQuery, VpFormCreate, VpIcon, VpRow, VpCol, VpTooltip, VpButton, VpTabs, VpTabPane, VpForm, VpFInput } from 'vpreact';
import { VpDynamicForm, RightBox ,VpVerifyTableCol,EditTableCol} from 'vpbusiness';




/**
 * 流程限制及提示的特殊提示框 
 * 
 */
export default class FlowSpecialMsg extends Component {
    constructor(props) {
        super(props)
        this.state = {
            curuser: vp.cookie.getTkInfo().userid  
            ,table1Columns:[
                { title: '项目名称', dataIndex: 'projectname', key: 'projectname'}
                ,{ title: '流程名称', dataIndex: 'flowname', key: 'flowname'} 
                ,{ title: '步骤名称', dataIndex: 'stepname', key: 'stepname'}
            ]
            ,table2Columns:[
                { title: '项目编号', dataIndex: 'xmbh', key: 'xmbh'}
                ,{ title: '项目名称', dataIndex: 'xmmc', key: 'xmmc'} 
                ,{ title: '项目经理', dataIndex: 'xmjl', key: 'xmjl'}
                ,{ title: '开发负责人', dataIndex: 'kffzr', key: 'kffzr'}
            ]
            ,table3Columns:[
                { title: '项目编号', dataIndex: 'xmbh', key: 'xmbh'}
                ,{ title: '项目名称', dataIndex: 'xmmc', key: 'xmmc'} 
                ,{ title: '项目经理', dataIndex: 'xmjl', key: 'xmjl'}
                ,{ title: '开发负责人', dataIndex: 'kffzr', key: 'kffzr'}
            ]
            ,tableHeight : 200
            ,table1Data :this.props.data1
            ,table2Data :this.props.data2
            ,table3Data :this.props.data3
            ,msg1 : this.props.msg1
            ,msg2 : this.props.msg2
            ,msg3 : this.props.msg3
            ,scroll:300

        }
    }

    componentWillReceiveProps(nextProps) {

    }

    //12312222222
    componentWillMount() {       
        this.getTableScroll();
    }

    getTableScroll(){
        let tableCount = 0 ;
        if(this.state.table1Data && this.state.table1Data.length>0 ) tableCount++
        if(this.state.table2Data && this.state.table2Data.length>0 ) tableCount++
        if(this.state.table3Data && this.state.table3Data.length>0 ) tableCount++

        let AllTableHeigth = document.body.clientHeight * 0.8-150
         
        this.setState(
            {tableHeight:AllTableHeigth/tableCount}
        )
    }

    render() {

        return (
            <div className="subAssembly b-b bg-white"  >
                {this.state.msg1}
                <div className="p-sm" style={{ maxHeight: this.state.tableHeight, overflow: 'auto' }}>
                {
                    this.state.table1Data && this.state.table1Data.length > 0 ?
                    <VpTable 
                        columns={this.state.table1Columns}   
                        dataSource={this.state.table1Data} 
                        scroll={{ y: this.state.scroll }} 
                        height 
                    /> 
                    :''                
                }
                </div>
                
                {this.state.msg2}
                <div className="p-sm" style={{ maxHeight: this.state.tableHeight, overflow: 'auto' }}>
                {
                    this.state.table2Data && this.state.table2Data.length > 0 ?
                    <VpTable columns={this.state.table2Columns}   dataSource={this.state.table2Data} scroll={{ y: this.state.scroll }} /> 
                    :''                
                }
                </div>                
                {this.state.msg3}
                <div className="p-sm" style={{ maxHeight: this.state.tableHeight, overflow: 'auto' }}>
                {
                    this.state.table3Data && this.state.table3Data.length > 0 ?
                    <VpTable columns={this.state.table3Columns}   dataSource={this.state.table3Data} scroll={{ y: this.state.scroll }} />       
                    :''                
                }
                </div>                                        
            </div>                
        )
    }    
}