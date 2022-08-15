import React,{Component} from 'react';

import {
    VpRangePicker,VpModal,VpAlertMsg,
    VpInput,vpAdd,VpIcon,VpButton,vpDownLoad,VpIconGroup,VpRadioGroup,VpRadio,VpConfirm,
    VpRow,VpCol,VpSelect,VpOption
} from 'vpreact';
import './projectDelayed.less'

import moment from "moment";

import {requireFile } from 'utils/utils';
import {connect} from 'react-redux';
import List from "../../../templates/dynamic/List/index";
import NormalTable from "../../../templates/dynamic/List/NormalTable";

const yqyydlData = ['','需求变更导致无法按期完成', '业务测试进展缓慢','技术实施阶段未按计划完成','初始项目计划制定不合理','因外部原因导致本项目延期','原始数据质量问题','其他原因（需填写具体原因）','资源紧张','生产导数过程缓慢'];
const yqyyxlData = {
  需求变更导致无法按期完成: ['前期需求不明确,导致需求变更','增加新需求,导致需求变更'],
  业务测试进展缓慢: ['系统缺陷过多，测试无法高效进行', '测试环境不稳定，测试无法高效进行', '业务测试人员未按时间计划测试'],
  技术实施阶段未按计划完成:['开发负责人负责项目过多','相同业务部室的项目调整了优先级','该部分功能技术难度较大','该部分功能重要性较低，业务不急于推动'],
  初始项目计划制定不合理:['需求不明确导致初始计划不合理','初始计划未获得项目组成员承诺','组间沟通不足'],
  因外部原因导致本项目延期:['相关联项目未完成导致本项目延期','第三方原因'],
  原始数据质量问题:[],
  '其他原因（需填写具体原因）':[],
  资源紧张:[],
  生产导数过程缓慢:[],
};
/**
 * 项目延期列表表格
 */
class ProjectDelayed extends NormalTable.Component{
    constructor(props){
        super(props);
        this.state.record={};
        this.state.rowClickModalV=false
        this.state.delayedInfo={//初始化
          yqyyxl:yqyydlData[0]?yqyyxlData[yqyydlData[0]][0]:'',
          yqyydl:yqyydlData[0],
          gjcs:'',jtyy:''
        }
        this.state.yqyyxlValues = yqyydlData[0]?yqyyxlData[yqyydlData[0]]:[]
        this.state.secondXL = yqyydlData[0]?yqyyxlData[yqyydlData[0]][0]:''
    }

    getQueryParams(){
        let {quickSearch:quickvalue,filtervalue,_k} = this.props.queryParams || {};
        return {
            accessRole: this.props.accessRole || false,
            quickvalue,
            filtervalue,
            _k
        }
    }

    getCustomTableOptions(){
        return {
            dataUrl:'/{bjyh}/delayed/getDelayedList',
        }
    }

    /**
     * 行点击事件
     */
    onRowClick = (record, index) => {
      console.log('record',record);
      let delayedInfo = {
        gjcs: record.gjcs,
        yqyydl: record.yqyydl||yqyydlData[0],
        yqyyxl: record.yqyyxl,
        jtyy: record.jtyy,
      }
      console.log('delayedInfo', delayedInfo);
      
      this.setState({
        rowClickModalV: true,
        iid:record.iid,
        delayedInfo: delayedInfo
      })
    }

    getHeader(){
        let _header = [
            { title: '改进措施', dataIndex: 'gjcs', key: 'gjcs' },
            { title: '延期原因大类', dataIndex: 'yqyydl', key: 'yqyydl' },
            { title: '延期原因小类', dataIndex: 'yqyyxl', key: 'yqyyxl' },
            { title: '具体原因', dataIndex: 'jtyy', key: 'jtyy' },
            { title: '项目编号', dataIndex: 'scode', key: 'scode',width:140},
            { title: '项目名称', dataIndex: 'pjname', key: 'pjname' },
            { title: '提出部门', dataIndex: 'dptname', key: 'idepartmentid' },
            { title: '需求提出人', dataIndex: 'xqtcrname', key: 'xqtcrid' },
            { title: '项目经理', dataIndex: 'xmjlname', key: 'xmjlid' },
            { title: '开发负责人', dataIndex: 'kffzrname', key: 'kffzrid' },
            { title: '测试负责人', dataIndex: 'csfzrname', key: 'csfzrid' },
            { title: '运营代表', dataIndex: 'ryydbname', key: 'ryydb' },
            { title: '项目类别', dataIndex: 'classname', key: 'iclassid' },
            { title: '项目等级', dataIndex: 'xmdjname', key: 'xmdjid' },
            { title: '项目属性', dataIndex: 'xmsxname', key: 'ixmsx' },
            { title: '项目状态', dataIndex: 'statename', key: 'istatusid' },
            { title: '项目阶段', dataIndex: 'sphasename', key: 'sphasename' },
            { title: '计划上线时间', dataIndex: 'dplanenddate', key: 'dplanenddate',auto:true,
              render:val => <span title={val}>{moment(val).format('YYYY-MM-DD')}</span>
            },
            { title: '本次延期开始时间', dataIndex: 'createdate', key: 'createdate',width: 130 },
            { title: '当前延期次数', dataIndex: 'delaynum', key: 'delaynum' },
            { title: '当前延期天数', dataIndex: 'diffdays', key: 'diffdays' },
            { title: '是否修改计划', dataIndex: 'ismodify', key: 'ismodify' },
          ];
        this.setState({
            table_headers: _header,
        });
    }

    //编辑Modal点击确定
    rowClickModalOK=()=>{
      let _this = this
      let delayedInfo = this.state.delayedInfo
      if(delayedInfo.yqyydl.includes('其他原因（需填写具体原因）') && !delayedInfo.jtyy){
        VpAlertMsg({
          message: "消息提示",
          description: "请填写填写具体原因。",
          type: "warning",
          onClose: this.onClose,
          closeText: "关闭",
          showIcon: true
        }, 5);
        return;
      }
      vpAdd('/{bjyh}/delayed/saveDelayedInfo', {
          iid:_this.state.iid,...delayedInfo
      }).then((response) => {
          _this.reloadTable()
      })
      this.setState({rowClickModalV:false, delayedInfo: {}})
    }
    rowClickModalCancel=()=>{
      this.setState({rowClickModalV:false, delayedInfo: {} })
    }
    
    delayedInfoChange=(e,flag)=>{
      let _this= this;
      let _delayedInfo = _this.state.delayedInfo
      _delayedInfo[flag]=e.target.value
      _this.setState({delayedInfo:_delayedInfo})
    }

    yqyydlChange=(value)=> {
      this.setState({
          yqyyxlValues: yqyyxlData[value],
          delayedInfo:{...this.state.delayedInfo,yqyyxl:yqyyxlData[value][0],yqyydl:value}
      });
    }
    secondXLChange=(value)=> {
      this.setState({
        delayedInfo:{...this.state.delayedInfo,yqyyxl:value}
      });
    }

    render(){
      return(
        <div id="delayList">
        {super.render()}
        <VpModal height={450} width={600}
          title="延期信息登记"
          visible={this.state.rowClickModalV}
          onOk={this.rowClickModalOK} 
          onCancel={this.rowClickModalCancel}
          maskClosable={false}
          okText="确定" cancelText="取消">
              <div>
                  <div className='ant-row ant-form-item'>    
                      <VpCol span="3" className='ant-form-item-label'>
                          <label>改进措施</label>
                      </VpCol>
                      <VpCol span="21" className='ant-form-item-control' >
                          <VpInput type='textarea' rows={3} maxLength={2000}
                                      value={this.state.delayedInfo.gjcs||''} 
                                      onChange={e=>this.delayedInfoChange(e,'gjcs')}>
                          </VpInput>
                      </VpCol>
                  </div>
                  <div className='ant-row ant-form-item'>    
                      <VpCol span="3" className='ant-form-item-label'>
                          <label>改进大类</label>
                      </VpCol>
                      <VpCol span="9" className='ant-form-item-control' >
                        <VpSelect value={this.state.delayedInfo.yqyydl} style={{ width: '95%' }}
                            onChange={this.yqyydlChange} > 
                            {yqyydlData.map(yqyydl => <VpOption key={yqyydl||0}>{yqyydl||''}</VpOption>)}
                        </VpSelect>
                        
                      </VpCol>
                      <VpCol span="3" className='ant-form-item-label'>
                          <label>改进小类</label>
                      </VpCol>
                      <VpCol span="9" className='ant-form-item-control' >
                        <VpSelect value={this.state.delayedInfo.yqyyxl} style={{ width: '100%' }}
                            onChange={this.secondXLChange} > 
                            {this.state.yqyyxlValues.length===0?<VpOption key={0} >{''}</VpOption>:
                            this.state.yqyyxlValues.map(yqyyxl => <VpOption key={yqyyxl} >{yqyyxl}</VpOption>)}
                        </VpSelect>
                      </VpCol>
                  </div>
                  <div className='ant-row ant-form-item'>    
                      <VpCol span="3" className='ant-form-item-label'>
                          <label>具体原因</label>
                      </VpCol>
                      <VpCol span="21" className='ant-form-item-control' >
                          <VpInput type='textarea' rows={3} maxLength={1000}
                                      value={this.state.delayedInfo.jtyy||''} 
                                      onChange={e=>this.delayedInfoChange(e,'jtyy')}>
                          </VpInput>
                      </VpCol>
                  </div>
              </div>   
        </VpModal>
        </div>
      )
    }
}
ProjectDelayed = NormalTable.createClass(ProjectDelayed);

class ProjectDelayedTab extends List.Component{

    constructor(props) {
        super(props);
        this.state.filterparams={//初始化
          yqyyxl:yqyydlData[0]?yqyyxlData[yqyydlData[0]][0]:'',
          yqyydl:yqyydlData[0],
          dateSelect:[]
        }
        this.state.yqyyxlValues = yqyydlData[0]?yqyyxlData[yqyydlData[0]]:[]
        this.state.secondXL = yqyydlData[0]?yqyyxlData[yqyydlData[0]][0]:''
    }

    /**
     * 配置信息，表头、过滤器
     */
    getConfig(){
       
    }

    /**
     * 渲染TOP过滤器
     */
    _renderTableFilter(){
      return null
      return (
        <div>
            <VpCol span="6" >
              <VpRangePicker style={{ width: 120 }} onChange={this.dateSelect} />
            </VpCol>
            <VpCol span="3" className='ant-form-item-label'>
                <label>改进大类</label>
            </VpCol>
            <VpCol span="6" className='ant-form-item-control' >
              <VpSelect defaultValue={yqyydlData[0]} style={{ width: '95%' }}
                  onChange={this.yqyydlChange} > 
                  {yqyydlData.map(yqyydl => <VpOption key={yqyydl||0}>{yqyydl||''}</VpOption>)}
              </VpSelect>
              
            </VpCol>
            <VpCol span="3" className='ant-form-item-label'>
                <label>改进小类</label>
            </VpCol>
            <VpCol span="6" className='ant-form-item-control' >
              <VpSelect value={this.state.filterparams.yqyyxl} style={{ width: '100%' }}
                  onChange={this.secondXLChange} > 
                  {this.state.yqyyxlValues.length===0?<VpOption key={0} >{''}</VpOption>:
                  this.state.yqyyxlValues.map(yqyyxl => <VpOption key={yqyyxl} >{yqyyxl}</VpOption>)}
              </VpSelect>
            </VpCol>
                  
        </div>
        
      );
    }
    //日期选择onchange
    dateSelect=(value, dateString)=>{
      console.log('dateSelect',value);
      console.log('dateSelect',dateString,this);
      let _filterparams = this.state.filterparams
      _filterparams.dateSelect=dateString
      this.setState({filterparams:_filterparams})
      this.changeQueryParams({filtervalue:JSON.stringify(_filterparams)})
    }

    yqyydlChange=(value)=> {
      this.setState({
          yqyyxlValues: yqyyxlData[value],
          filterparams:{...this.state.filterparams,yqyyxl:yqyyxlData[value][0],yqyydl:value}
      });
      console.log('yqyydlChange', value, yqyyxlData[value]);
      
      this.changeQueryParams({filtervalue:JSON.stringify(this.state.filterparams)})
    }

    secondXLChange=(value)=> {
      this.setState({
        filterparams:{...this.state.filterparams,yqyyxl:value}
      });
      this.changeQueryParams({filtervalue:JSON.stringify(this.state.filterparams)})
    }
    

  renderViewSwitch(){
    let _this = this
        return (
          <VpButton type="primary" shape="circle" className="vp-btn-br-lg" onClick={this.exportdata}>
              <VpIcon type="export" />
          </VpButton>
      )
  }

  exportdata=()=>{
    vpDownLoad('/{bjyh}/delayed/exportProjectData', {
        iid:this.state.iid,...this.state.delayedInfo,
    }).then((response) => {
        
    })
  }
  /**
   * 是否显示快捷搜索
   */
  showSearchInput(){
    return true
  }
  /**
   * 过滤器位置
   * @returns {string}
   */
  getFilterPosition(){
      return "top";
  }
  /**
   * 渲染列表
   * @returns {*}
   */
  renderNormalTable(props){
      return <ProjectDelayed {...this.props} {...props} iid={this.props.iid} 
              />;
  }
}

let createClass = function(newClass){
    let wrapClass = List.createClass(newClass);
    wrapClass.createClass = createClass;
    wrapClass.Table = ProjectDelayed;
    return wrapClass;
}
export default createClass(ProjectDelayedTab);