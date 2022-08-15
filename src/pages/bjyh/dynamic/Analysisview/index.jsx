/* jshint esversion: 6 */
import React, { Component } from "react";
import { vpAdd,VpCard, VpRow, VpCol, VpSelect, VpOption, VpTooltip, VpIcon, VpTable, VpButton, VpRadioGroup, VpRadio, vpQuery, VpEchart } from 'vpreact';
import "../projectOverview/index.less";
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/tooltip';
import { RightBox } from 'vpbusiness';
// import ProjectDelayed from "../project/projectDelayed";
import loading from '../../images/loading.gif';
import  LineEchart from './lineEcharts';
import EntityDetail from "../../../templates/dynamic/DynamicForm/EntityDetail";

export default class Analysisview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modifyValue: 1,
            operationValue: 1,
            showRightBox: false,
            delayStatus: false,
            showreport: false,
            modelUrl: '',
            columns: [],
            dataSource: [],
            total: 0,
            loading: false,
            gif_loading1: true,
            gif_loading2: true,
        };
    }
    componentWillMount() {

    }
    componentDidMount() {
        this.modify(1);
        this.operation(1);
        this.wlzrgg();
        this.productionartisan();
    }
    // TODO 项目变更情况排名TOP5
    modify_handleChange = (value) => {
        this.setState({
            modifyValue: value
        })
        this.modify(value);
    }
    modify = (id) => {
        vpQuery('/{bjyh}/api/esb/xmbgqk', {
            id: id,
            zq: ''
        }).then(({ data }) => {
            data.result.map((item, index) => {
                item.type = 'bar';
                item.barWidth = 15;
                item.value = item.data;
                item.label = {
                    show: true,
                    position: 'right',
                    color: '#000'
                };
            });
            this.charmaine31(data.legenddata, data.ydata, data.result);
        });
    }
    //   TODO 项目投产分析
    operation_handleChange = (value) => {
        this.setState({
            operationValue: value,
            gif_loading1: true
        })
        this.operation(value);
    }
    operation(id) {
        vpQuery('/{bjyh}/api/esb/xmfxtc', {
            id: id,
            type: ''
        }).then(({ data }) => {
            this.setState({
                gif_loading1: false
            }, () => {
                this.charmaine32(data.legendData, data.data1, data.data2);
            });
        });
    }
    // TODO 未来三月资源供需情况
    wlzrgg = () => {
        vpQuery('/{bjyh}/api/esb/wlzrgg', {}).then(({ data }) => {
            data.result.map((item, index) => {
                item.type = 'line';
                item.lineStyle = { width: 4 };
                this.setState({ gif_loading2: false });
            });
            this.charmaine41(data.legendData, data.xData, data.result);
        });
    }
    //  TODO 京匠工程项目情况 
    productionartisan = () => {
        vpQuery('/{bjyh}/JjgcReport/QueryList', {}).then((result) => {
            result.list.map(item => {
                item.type = 'bar';
                item.barWidth = 12;
            });
            this.charmaine42(result.list);
        }).catch((err) => {
        });
    }
    charmaine31 = (legend, yData, data) => {
        let _this = this;
        let myChart = echarts.init(this.refs.charmaine31);
        myChart.clear();
        myChart.off('click');
        myChart.setOption({
            color: ['#0994FF', '#3C63E5', '#79D5C7', '#FF675C', '#FFA75B'],
            title: {
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                right: 0,
                top: 'middle',
                orient: 'vertical',
                itemWidth: 14,
                data: legend
            },
            grid: {
                top: '2%',
                left: '3%',
                right: 100,
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                show: false,
                type: 'value',
            },
            yAxis: {
                type: 'category',
                axisTick: {
                    inside: true,
                    length: 50,
                    lineStyle: {
                        color: '#d2d2d2'
                    }
                },
                data: yData
            },
            series: data
        })
        myChart.on('click', function (params) {
            let type;
            if (params.name === "变更次数") {
                type = 2;
            } else {
                type = 1;
            }
            _this.setState({
                showRightBox: true
            })
            vpQuery('/{bjyh}/api/esb/xmbgqkzq', {
                id: _this.state.modifyValue,
                depName: params.seriesName,
                type: type
            }).then((data) => {
                if (type === 1) {
                    _this.setState({
                        columns: [
                            { title: '项目编号', dataIndex: 'scode', key: 'scode', width: 150  ,render(text, record){
                                return (
                                    <div onClick={()=>_this.fromonclick(record)}>{record.scode}</div>
                                )
                            } },
                            { title: '项目名称', dataIndex: 'projectname', key: 'projectname' },
                            { title: '项目级别', dataIndex: 'xxmdj', key: 'xxmdj' },
                            { title: '业务代表', dataIndex: 'ywdb', key: 'ywdb' },
                            { title: '需求提出部门', dataIndex: 'partment', key: 'partment' },
                            { title: '项目经理', dataIndex: 'xmmanager', key: 'xmmanager' },
                            { title: '开发负责人', dataIndex: 'xmcharger', key: 'xmcharger' },
                            { title: '变更工作量(人月)加和', dataIndex: 'bggzl', key: 'bggzl' }],
                        dataSource: data.result,
                        total: data.total,
                        loading: false
                    })
                } else {
                    _this.setState({
                        columns: [
                            { title: '项目编号', dataIndex: 'scode', key: 'scode', width: 150 ,render(text, record){
                                return (
                                    <div onClick={()=>_this.fromonclick(record)}>{record.scode}</div>
                                )
                            } },
                            { title: '项目名称', dataIndex: 'projectname', key: 'projectname' },
                            { title: '项目级别', dataIndex: 'xxmdj', key: 'xxmdj' },
                            { title: '业务代表', dataIndex: 'ywdb', key: 'ywdb' },
                            { title: '需求提出部门', dataIndex: 'partment', key: 'partment' },
                            { title: '项目经理', dataIndex: 'xmmanager', key: 'xmmanager' },
                            { title: '开发负责人', dataIndex: 'xmcharger', key: 'xmcharger' },
                            { title: '累计变更次数', dataIndex: 'bggzl', key: 'bggzl' }],
                        dataSource: data.result,
                        total: data.total,
                        loading: false
                    })
                }
            });
        })
    }
    charmaine32 = (legendData, data1, data2) => {
        let _this = this;
        let myChart = echarts.init(this.refs.charmaine32);
        myChart.off('click');
        myChart.setOption({
            color: ['#FFA75B', '#FF675C', '#79D5C7', '#3C63E5', '#0994FF'],
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                right: 0,
                top: 'middle',
                itemWidth: 14,
                data: legendData
            },
            series: [
                {
                    name: '投产类别',
                    type: 'pie',
                    selectedMode: 'single',
                    center: ['32%', '50%'],
                    radius: [0, '40%'],
                    label: {
                        position: 'inside',
                        formatter: '{d}%',
                        color: '#000',
                        fontWeight: 500,
                        fontSize: 10
                    },
                    labelLine: {
                        show: false
                    },
                    data: data2
                },
                {
                    name: '投产类别',
                    type: 'pie',
                    center: ['32%', '50%'],
                    radius: ['50%', '70%'],
                    label: {
                        show: true,
                        position: 'inside',
                        formatter: '{d}%',
                        color: '#fff',
                        fontSize: 10
                    },
                    data: data1
                }
            ]
        })
        myChart.on('click', function (params) {
            _this.setState({
                showRightBox: true
            })
            vpQuery('/{bjyh}/api/esb/xmfxtczq', {
                id: _this.state.operationValue,
                type: params.data.pid
            }).then((data) => {
                _this.setState({
                    columns: [
                        { title: '项目编号', dataIndex: 'scode', key: 'scode', width: 150 ,render(text, record){
                            return (
                                <div onClick={()=>_this.fromonclick(record)}>{record.scode}</div>
                            )
                        } },
                        { title: '项目名称', dataIndex: 'projectname', key: 'projectname' },
                        { title: '项目级别', dataIndex: 'xxmdj', key: 'xxmdj' },
                        { title: '业务代表', dataIndex: 'ywdb', key: 'ywdb' },
                        { title: '需求提出部门', dataIndex: 'partment', key: 'partment' },
                        { title: '项目经理', dataIndex: 'xmmanager', key: 'xmmanager' },
                        { title: '开发负责人', dataIndex: 'xmcharger', key: 'xmcharger' },
                        {
                            title: '投产时间', dataIndex: 'bggzl', key: 'bggzl', render(value) {
                                return (
                                    <div>
                                        {value.substring(0, 10)}
                                    </div>
                                )
                            }
                        }],
                    dataSource: data.result,
                    total: data.total,
                    loading: false
                })
            });
        })
    }
    charmaine41 = (legendData, xData, data) => {
        var myChart = echarts.init(this.refs.charmaine41);
        myChart.setOption({
            color: ['#FFA75B', '#3C63E5', '#024D4E', '#FF675C', '#FFA75B'],
            tooltip: {
                trigger: 'axis',
                formatter: function (params, ticket, callback) {
                    var tipString = params[0].axisValue + "<br />";
                    var indexColor;
                    for (var i = 0, length = params.length; i < length; i++) {
                        indexColor = params[i].color;
                        tipString += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background:' + indexColor + '"></span>';
                        tipString += params[i].seriesName + '：' + params[i].value + '人月<br />';
                    }
                    return tipString
                }
            },
            legend: {
                right: 0,
                top: 'middle',
                orient: 'vertical',
                data: legendData,
                icon: 'line',
                itemWidth: 14,
            },
            grid: {
                top: '2%',
                left: '3%',
                right: '24%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: xData
            },
            yAxis: {
                type: 'value',
                splitLine: {
                    show: false,
                },
            },
            series: data
        })
    }
    charmaine42 = (data) => {
        const _this = this;
        let myChart = echarts.init(this.refs.charmaine42);
        myChart.off('click');
        myChart.setOption({
            color: ['#0994FF', '#3C63E5', '#79D5C7', '#FF675C', '#FFA75B'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['立项中', '实施中', '已上线'],
                itemWidth: 14,
                top: 0
            },
            grid: {
                top: 30,
                left: '2%',
                bottom: '1%',
                right: '1%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    axisTick: { show: true },
                    axisLabel: {
                        rotate: 20,
                        align: 'right',
                        margin: 7
                    },
                    data: ['核心系统改造', '支付体系提升', '反洗钱系统建设', '数字风控', '数据治理', '零售服务渠道一体化建设', '零售业务中台系统', '普惠金融业务中台', '开放银行生态建设', '机构客户行业解决方案']
                },
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: data
        });
        myChart.on('click', function (params) {
            let type;
            switch (params.seriesName) {
                case '立项中':
                    type = 1;
                    break;
                case '实施中':
                    type = 2;
                    break;
                case '已上线':
                    type = 3;
                    break;
                default:
                    break;
            }
            vpQuery('/{bjyh}/JjgcReport/QueryListzq', {
                type: type,
                index: params.data.index
            }).then((data) => {
                _this.setState({
                    columns: [
                        { title: '项目编号', dataIndex: 'scode', key: 'scode', width: 150 ,render(text, record){
                            return (
                                <div onClick={()=>_this.fromonclick(record)}>{record.scode}</div>
                            )
                        } },
                        { title: '项目名称', dataIndex: 'pjname', key: 'pjname' },
                        { title: '项目级别', dataIndex: 'xxmdj', key: 'xxmdj' },
                        { title: '业务代表', dataIndex: 'ywdb', key: 'ywdb' },
                        { title: '需求提出部门', dataIndex: 'deptname', key: 'deptname' },
                        { title: '项目经理', dataIndex: 'xmjl', key: 'xmjl' },
                        { title: '开发负责人', dataIndex: 'kffzr', key: 'kffzr' }],
                    dataSource: data.result,
                    showRightBox: true,
                    total: data.total,
                });
            });
        })
    }
    closeModal = () => {
        this.setState({
            showRightBox: false,
            delayStatus: false,
            dataSource: []
        })
    }
    reportdelayClick = (e) => {
        this.setState({
            delayStatus: true
        })
    }
    reportClick = (title) => {
        let url = '/{vpui}/vpweb/report.html?rpx=./bjyh/xmbqRpt.rpx';
        this.setState({
            showreport: true,
            modelTitle: title,
            modelUrl: url
        })
    }
    cancelModal = () => {
        this.setState({
            showreport: false
        })
    }
    render() {
        const { showRightBox, columns, dataSource, total } = this.state;
        const pagination = {
            total: total,
            showTotal :()=>{ return '共'+total+'条' },
            showSizeChanger: true,
            onShowSizeChange(current, pageSize) {
                console.log('Current: ', current, '; PageSize: ', pageSize);
            },
            onChange(current) {
                console.log('Current: ', current);
            },
        };
        return (
            <div className="leader-container">
                <VpRow gutter={16}>
                    <VpCol span={12}>
                        <VpCard title="项目变更情况排名TOP5">
                            <VpSelect defaultValue="1" onChange={this.modify_handleChange}>
                                <VpOption value="1">本月</VpOption>
                                <VpOption value="2">本季</VpOption>
                                <VpOption value="3">本年</VpOption>
                            </VpSelect>
                            <div className="content-grids" ref="charmaine31"></div>
                        </VpCard>
                    </VpCol>
                    <VpCol span={12}>
                        <VpCard title="未来三月资源供需情况">
                            <div style={{ textAlign: 'center', display: this.state.gif_loading2 ? 'block' : 'none' }}><img src={loading} alt="" /></div>
                            <div className={`content-grids ${this.state.gif_loading2 ? 'hidden' : ''}`} ref="charmaine41"></div>
                        </VpCard>
                    </VpCol>
                </VpRow>
                <VpRow gutter={16}>
                    <VpCol span={9}>
                        <VpCard title="项目投产分析">
                            <VpSelect defaultValue="1" onChange={this.operation_handleChange}>
                                <VpOption value="1">本月</VpOption>
                                <VpOption value="2">本季</VpOption>
                                <VpOption value="3">本年</VpOption>
                            </VpSelect>
                            <div style={{ textAlign: 'center', display: this.state.gif_loading1 ? 'block' : 'none' }}><img src={loading} alt="" /></div>
                            <div className={`content-grids ${this.state.gif_loading1 ? 'hidden' : ''}`} ref="charmaine32"></div>
                        </VpCard>
                    </VpCol>
                    <VpCol span={15}>
                        <VpCard title="京匠工程项目情况">
                            <div className="content-grids" ref="charmaine42"></div>
                        </VpCard>
                        {/* <VpCard title="重要报表快捷查看链接">
                            <div className="content-grids">
                                <div className="layui-loop">
                                    <VpIconFont type="vpicon-bar-chart" />
                                    <a className="link" onClick={(e) => this.reportdelayClick(e)}>
                                        延期项目统计表</a>
                                </div>
                                {/* <div className="layui-loop">
                                    <VpIconFont type="vpicon-area-chart" />
                                    <a
                                        className="link"
                                        onClick={(e) => this.reportClick("项目标签一览表")}
                                    >
                                        项目标签一览表</a>
                                </div> */}
                        {/* </div>
                        </VpCard> */}
                    </VpCol>
                </VpRow>
                <RightBox
                    onClose={this.closeModal}
                    max={true}
                    tips={
                        <div className="tips p-xs">
                            <VpTooltip placement="top" title="0000">
                                <VpIcon type="exclamation-circle text-muted m-r-xs" />
                            </VpTooltip>
                        </div>
                    }
                    show={showRightBox}
                    destroyOnClose >
                    {showRightBox && dataSource.length === 0 ? <div className="table_loading"><img src={loading} alt="" /></div> : <VpTable
                        className="loader_tbody"
                        columns={columns}
                        dataSource={dataSource}
                        scroll={{ x: 2000, y: 730 }}
                        loading={this.state.loading}
                        resize
                        title={() => ""}
                        pagination={pagination}
                    />}
                </RightBox>
                <RightBox
                    //关联页签新建弹半框
                    max={this.props.formType != 'tabs'}
                    button={
                        <div className="icon p-xs" onClick={this.closeRightModal}>
                            <VpTooltip placement="top" title=''>
                                <VpIcon type="right" />
                            </VpTooltip>
                        </div>}
                    show={this.state.showRightBox1}>
                    {this.state.showRightBox1? this._renderRightBoxBody() : null}
                </RightBox>
                {/* <RightBox
                    className="rightContainer"
                    onClose={this.closeModal}
                    max={true}
                    tips={
                        <div className="tips p-xs">
                            <VpTooltip placement="top" title="0000">
                                <VpIcon type="exclamation-circle text-muted m-r-xs" />
                            </VpTooltip>
                        </div>
                    }
                    show={this.state.delayStatus}
                >
                    {this.state.delayStatus ? <ProjectDelayed accessRole={true} /> : null}
                </RightBox> */}
                {/* <VpModal
                    title={this.state.modelTitle}
                    visible={this.state.showreport}
                    onCancel={() => this.cancelModal()}
                    width={"90%"}
                    style={{ top: "10%" }}
                    footer={null}
                    wrapClassName="modal-no-footer"
                >
                    {this.state.showreport ? (
                        <VpIframe url={this.state.modelUrl} />
                    ) : null}
                </VpModal> */}
            </div>
        );
    }

    
    fromonclick(record, index) {
        console.log("record",record);
        if(record.scode.indexOf("合计")!=-1){
            // console.log("包含合计");
            return;
        }
        let sname = record.sname
        let scode = record.scode
        let ientityid = record.entityid
        let iids = "";
        if(ientityid=="7"){
            iids = record.iid
        }else{
            iids = record.pid
            if(iids==""||iids==null){
                iids = record.iid
            }
        }
        
        
        console.log("ientityid",ientityid); 
        if ((ientityid == '7' || ientityid == '8') && this.state.viewtype == 'pjtree') {
            iids = iids.substr(0, iids.length - 1);
        }
        vpQuery('/{vpplat}/vfrm/entity/EntityCaseExists', {
            entityid: ientityid, iid: iids
        }).then((data) => {
            console.log("date",data);
            let flag = data.data
            if (flag) {
                this.setState({
                    showRightBox1: true,
                    subItemProjectId: record.iprojectid,
                    add: false,
                    entityiid: iids,
                    row_entityid: ientityid,
                    row_id: iids,
                    s_visible: false,
                    defaultActiveKey: "entity7_generaltab",
                    activeKey: 'entity7_generaltab',
                    sname: sname,
                    scode: scode
                }, () => {
                    this.getDynamicTabs(true, ientityid, iids);
                    this.formevent(ientityid, iids, "");
                });
                this.props.setBreadCrumb(sname)
            } else {
                VpAlertMsg({
                    message: "消息提示",
                    description: '该数据已经被删除！',
                    type: "error",
                    closeText: "关闭",
                    showIcon: true
                }, 5)
                this.tableRef.getTableData()
            }
        })
    }
  //查询表单onsave，onload方法
  formevent = (ientityid, iids, viewtype) => {
    vpQuery('/{vpplat}/vfrm/entity/getformevent', {
        entityid: ientityid, iid: iids, viewtype
    }).then((response) => {
        this.setState({
            eventmap: response.data
        })
    })
}
//tabs页签
getDynamicTabs(type, ientityid, iids) {
    if (type) {
        setTimeout(() => {
            vpAdd('/{vpplat}/vfrm/entity/dynamicTabs', {
                entityid: this.state.viewtype == 'pjtree' ? ientityid :ientityid
                , iid: iids,
                functionid: this.state.functionid
            }).then((response) => {
                console.log("response",);
                const tabs = response.data.tabs;
                this.setState({
                    tabs_array: tabs
                }, () => {
                    //优化tabs宽度
                    if ($(".ant-tabs-nav-scroll .ant-tabs-nav").width() < $(".ant-tabs-content").width()) {
                        $(".ant-tabs-nav-container").removeClass("ant-tabs-nav-container-scrolling")
                        $(".ant-tabs-tab-prev").hide()
                        $(".ant-tabs-tab-next").hide()
                    }
                })
            })
        }, 200);
    } else {
        this.setState({
            tabs_array: []
        })
    }

}
   /**
     * 渲染右侧弹出框内容
     */
    _renderRightBoxBody=()=> {
        let props = {
            entityid: this.state.row_entityid,
            iid: this.state.row_id,
            closeRightModal: this.closeRightModal,
            defaultActiveKey: this.state.defaultActiveKey,
        }
        return this.renderRightBoxBody(props);
    }
    renderRightBoxBody=(props)=> {
        return <EntityDetail {...props} />;
    }
  /**
     * 关闭详情框
     */
    closeRightModal = () => {
        this.setState({
            showRightBox1: false
        })
        this.tableRef.getTableData();//刷新页面
    }
}
