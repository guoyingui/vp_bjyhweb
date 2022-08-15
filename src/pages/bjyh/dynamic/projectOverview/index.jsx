/* jshint esversion: 6 */
import React, { Component } from 'react';
import { vpAdd,VpCard, VpRow, VpCol, VpSelect, VpOption, VpTooltip, VpIcon, VpTable, VpButton, VpRadioGroup, VpRadio, vpQuery, VpEchart } from 'vpreact';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/tooltip';
import up from './img/9.png';
import down from './img/8.png';
import project from './img/11.png';
import implement from './img/3.png';
import operation from './img/5.png';
import production from './img/1.png';
import prompt from './img/2.png';
import loading from '../../images/loading.gif';
import { RightBox } from 'vpbusiness';
import  LineEchart from './lineEcharts';
import './index.less';
import EntityDetail from "../../../templates/dynamic/DynamicForm/EntityDetail";


export default class projectOverview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            btnStatus: false,
            Status: false,
            demandValue: 1,
            serviceValue: 1,
            implementValue: 1,
            radioValue: 0,
            Length:0,
            flexStatus: 'none',
            flexStatusScots: 'none',
            flexStatusPrompt: 'none',
            blockStatus: {},
            matrixValue: 1,
            MoreRightBox: false,
            showRightBox: false,
            detailsRightBox:false,
            reportData: {},
            reportDadas: {},
            columns: [],
            dataSource: [],
            details_columns:[],
            details_dataSource: [],
            time: [],
            datamap: {},
            cardTitle: {},
            numberOption: '',
            xqsllegenddata: [],
            xqsllegenddatas: [],
            jz_legendOptions: [],
            jz_seriesOptionsData: [],
            total: 0,
            loading: false,
            echartshow:false,
            gif_loading: true,
            seriesOptions:[],
            options:{},
            colors: ['#0994FF', '#3C63E5', '#79D5C7', '#FF675C', '#FFA75B', '#336699', '#00CFE6', '#00E68A', 'rgb(88, 173, 214)', 'rgb(215, 47, 218)', '#CFE600']
        };
    }
    componentWillMount() {
        this.reportgetdata();
        this.reportscxtzs();
        this.xqslqklist(1);
    }
    componentDidMount() {
        this.demand(this.state.demandValue, this.state.radioValue);
        this.implement(1);
        this.xtslxqs();
        this.service(1);
    }
    reportgetdata() {
        vpQuery('/{bjyh}/Report/getdata', {}).then((response) => {
            this.setState({
                reportData: response
            })
        });
    }
    reportscxtzs() {
        vpQuery('/{bjyh}/Report/scxtzs', {}).then((response) => {
            this.setState({
                reportDadas: response
            })
        });
    }
    // TODO 需求受理情况
    matrix_handleChange = (value) => {
        this.setState({
            matrixValue: value,
            gif_loading: true,
        })
        this.xqslqklist(value);
    }
    xqslqklist = (value) => {
        let { cardTitle } = this.state;
        vpQuery('/{bjyh}/ReportsFunc/QueryList', {
            id: value
        }).then((response) => {
            let month = [];
            response.data.map(item => {
                if (value === 1) {
                    month.push(`${item}月`);
                } else {
                    month.push(item);
                }
            });
            let legenddata = [];
            let dataMap = { dataPI: { 1: [], 2: [], 3: [] }, dataSI: { 1: [], 2: [], 3: [] }, dataTI: { 1: [], 2: [], 3: [] }, dataTH: { 1: [], 2: [], 3: [] } };
            cardTitle.bqxz = response.bqxz;
            cardTitle.bsy = response.bsy;
            response.list.map((item, index) => {
                let arr = [];
                item.map((list, i) => {
                    let obj = { name: "", value: "" };
                    let obj2 = { name: "", value: "" };
                    let obj3 = { name: "", value: "" };
                    let obj4 = { name: "", value: "" };
                    obj.name = list.sname;
                    obj2.name = list.sname;
                    obj3.name = list.sname;
                    obj4.name = list.sname;
                    obj.value = parseInt(list.lxz);
                    obj2.value = parseInt(list.ssz);
                    obj3.value = parseInt(list.ysx);
                    obj4.value = parseInt(list.yth);
                    obj.time = response.data[index];
                    obj2.time = response.data[index];
                    obj3.time = response.data[index];
                    obj4.time = response.data[index];
                    dataMap.dataPI[index + 1].push(obj);
                    dataMap.dataSI[index + 1].push(obj2);
                    dataMap.dataTI[index + 1].push(obj3);
                    dataMap.dataTH[index + 1].push(obj4);
                    arr.push(list.sname);
                })
                legenddata.push(arr);
            })
            this.setState({
                gif_loading: false,
                time: month,
                datamap: dataMap,
                xqsllegenddata: legenddata,
            }, () => {
                this.charmaine11(legenddata[0]);
            });
        });
    }
    // TODO 项目立项情况
    demand_handleChange = (value) => {
        this.setState({
            demandValue: value
        }, () => {
            this.demand(value, this.state.radioValue);
        });
    };
    demand = (id, type) => {
        vpQuery('/{bjyh}/api/esb/xmlxqk', {
            id: id,
            type: type,
            zq: ''
        }).then(({ data }) => {
            data.map(item => {
                item.name = `${item.name.slice(0, 4)}\n${item.name.slice(4)}`;
            });
            this.charmaine12(data);
        });
    }
    // TODO 服务承诺执行情况
    service_handleChange = (value) => {
        this.setState({
            serviceValue: value
        })
        this.service(value);
    }
    service(id) {
        vpQuery('/{bjyh}/api/esb/fwcnzxqk', {
            id: id,
            zq: ''
        }).then((data) => {
            data.data.map((item, index) => {
                switch (item.name) {
                    case '需求受理人审核确认项目类型': case '项目经理申请资源': case 'PMO评审':
                        item.sname = item.name;
                        item.name = "信科";
                        item.itemStyle = {
                            color: '#FFA75B'
                        }
                        break;
                    case '开发领导指派开发资源': case '测试组长指派测试资源': case '开发负责人审核':
                        item.sname = item.name;
                        item.name = "开发";
                        item.itemStyle = {
                            color: '#79D5C7'
                        }
                        break;
                    case '运维领导指派运维资源':
                        item.sname = item.name;
                        item.name = "运维";
                        item.itemStyle = {
                            color: '#3C63E5'
                        }
                        break;
                    default:
                        break;
                }
            })
            this.charmaine21(data.legenddata, data.data);
        });
    }
    // TODO实施中项目数
    implement_handleChange = (value) => { 
        this.setState({
            implementValue: value
        }) 
        if(value !== '1'){
            this.setState({btnStatus: true});
          }else if(value === '1'){
            this.setState({btnStatus: false});
          }
        this.implement(value);
    }
    implement = (id) => {
        vpQuery('/{bjyh}/api/esb/sszxms', {
            id: id,
            zq: ''
        }).then((data) => {
            data.data.map((item, index) => {
                item.itemStyle = { color: this.state.colors[index] }
            })
            this.charmaine22(data.legenddata, data.data);
        });
    }
    // TODO 系统受理需求数排名
    xtslxqs() {
        vpQuery('/{bjyh}/api/esb/xtslxqs', {
            zq: ''
        }).then((data) => {
            data.data.map((item, index) => {
                item.itemStyle = { color: this.state.colors[index] }
            });
            this.setState({
                jz_legendOptions: data.legenddata,
                jz_seriesOptionsData: data.data
            })
            this.charmaine23(data.legenddata, data.data);
        });
    }
    charmaine11 = (legenddata) => {
        let _this = this;
        const { matrixValue, datamap, time, xqsllegenddata } = this.state;
        var myChart = echarts.init(this.refs.charmaine11);
        myChart.off('click');
        let option = {
            baseOption: {
                timeline: {
                    axisType: 'category',
                    autoPlay: false,
                    currentIndex: 0,
                    playInterval: 3000,
                    data: time,
                    timelinePlayChange: function (event) {
                        console.log(event, 'event');
                    }
                },
                color: ['#0994FF', '#3C63E5', '#79D5C7', '#FF675C', '#FFA75B'],
                title: {
                },
                tooltip: {
                },
                legend: {
                    orient: 'vertical',
                    right: '0',
                    top: 'middle',
                    itemWidth: 14,
                    data: ['立项中', '实施中', '已上线', '已退回'],
                },
                calculable: true,
                grid: {
                    top: 10,
                    bottom: 80,
                    right: 90,
                    tooltip: {
                        trigger: 'axis'
                    }
                },
                xAxis: [
                    {
                        type: 'category',
                        axisLabel: {
                            rotate: 20,
                        },
                        data: legenddata,
                        splitLine: { show: false }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        splitLine: {
                            show: false
                        }
                    }
                ],
                series: [
                    {
                        name: '立项中',
                        type: 'bar',
                    },
                    {
                        name: '实施中',
                        type: 'bar',
                    },
                    {
                        name: '已上线',
                        type: 'bar',
                    },
                    {
                        name: '已退回',
                        type: 'bar',
                    }
                ]
            },
            options: [
                {
                    series: [
                        { data: datamap.dataPI['1'] },
                        { data: datamap.dataSI['1'] },
                        { data: datamap.dataTI['1'] },
                        { data: datamap.dataTH['1'] },
                    ]
                },
                {
                    series: [
                        { data: datamap.dataPI['2'] },
                        { data: datamap.dataSI['2'] },
                        { data: datamap.dataTI['2'] },
                        { data: datamap.dataTH['2'] }
                    ]
                },
                {
                    series: [
                        { data: datamap.dataPI['3'] },
                        { data: datamap.dataSI['3'] },
                        { data: datamap.dataTI['3'] },
                        { data: datamap.dataTH['3'] },
                    ]
                }
            ]
        };
        myChart.setOption(option, true);
        myChart.on('timelinechanged', function (params) {
            option.baseOption.xAxis[0].data = xqsllegenddata[params.currentIndex];
            option.baseOption.timeline.currentIndex = params.currentIndex;
            myChart.setOption(option, true);
        });
        myChart.on('timelineplaychanged', function (params) {
            option.baseOption.timeline.autoPlay = params.playState;
        });
        myChart.on('click', function (params) {
            if (typeof (params.data) !== 'number') {
                _this.setState({
                    showRightBox: true
                });
                vpQuery('/{bjyh}/Reports/xqslqklistzq', {
                    id: matrixValue,
                    type: params.seriesName,
                    deptname: params.data.name,
                    fz: params.data.time,
                }).then((data) => {
                    _this.setState({
                        columns: [
                            { title: '项目编号', dataIndex: 'scode', key: 'scode', width: 150  ,render(text, record){
                                return (
                                    <div onClick={()=>_this.fromonclick(record)}>{record.scode}</div>
                                )
                            } },
                            { title: '项目名称', dataIndex: 'pjname', key: 'pjname' },
                            { title: '项目级别', dataIndex: 'xxmdj', key: 'xxmdj' },
                            { title: '业务代表', dataIndex: 'ywdb', key: 'ywdb' },
                            { title: '需求提出部门', dataIndex: 'sname', key: 'sname' },
                            { title: '项目经理', dataIndex: 'xmjl', key: 'xmjl' },
                            { title: '开发负责人', dataIndex: 'kffzr', key: 'kffzr' }],
                        dataSource: data.result,
                        total: data.total,
                        loading: false
                    });
                });
            }
        });
    };
    charmaine12 = (data) => {
        let _this = this;
        let myChart = echarts.init(this.refs.charmaine12);
        myChart.off('click');
        myChart.setOption({
            color: ['#0994FF', '#3C63E5', '#79D5C7', '#FF675C', '#FFA75B', '#336699'],
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'horizontal',
                bottom: 5,
                left: 'center',
                data: ['']
            },
            series: [
                {
                    name: 'A/B',
                    type: 'pie',
                    center: ['45%', '50%'],
                    radius: ['55%', '75%'],
                    avoidLabelOverlap: true,
                    label: {
                        show: true,
                        formatter: '{b}:{c}',
                        fontSize: 12
                    },
                    labelLine: {
                        length: 10,
                        length2: 10
                    },
                    data: data
                }, {
                    name: 'C',
                    type: 'pie',
                }, {
                    name: '其他',
                    type: 'pie',
                }]
        });
        myChart.on('click', function (params) {
            console.log(params, 'params');
            _this.setState({
                showRightBox: true
            })
            vpQuery('/{bjyh}/api/esb/xmlxqkzq', {
                id: _this.state.demandValue,
                type: _this.state.radioValue,
                zq: params.data.pid
            }).then((data) => {
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
                        {
                            title: '立项时间', dataIndex: 'bggzl', key: 'bggzl', render(value) {
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
    charmaine21 = (legendData, data) => {
        let _this = this;
        let myChart = echarts.init(this.refs.charmaine21);
        myChart.off('click');
        myChart.setOption({
            color: ['#0994FF', '#3C63E5', '#79D5C7', '#FF675C', '#FFA75B', '#336699'],
            title: {
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                bottom: 0,
                left: 'middle',
                itemWidth: 14,
                // orient: 'vertical',
                data: ['']
            },
            grid: {
                top: '2%',
                left: '3%',
                right: '9%',
                bottom: 0,
                containLabel: true
            },
            xAxis: {
                show: false,
                type: 'value',
            },
            yAxis: {
                type: 'category',
                inverse: true,
                data: legendData
            },
            series: [{
                name: '服务承诺执行情况',
                type: 'bar',
                // stack: '总量',
                barWidth: 20,
                label: {
                    show: true,
                    position: 'right',
                    formatter: '{b}:{c}',
                    fontSize: 10
                },
                data: data
            }]
        });
        myChart.on('click', function (params) {
            _this.setState({
                showRightBox: true
            })
            vpQuery('/{bjyh}/api/esb/fwcnzxqkzq', {
                id: _this.state.serviceValue,
                zq: params.data.sname
            }).then((data) => {
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
                        { title: '步骤处理人', dataIndex: 'stepdeler', key: 'stepdeler' },
                        { title: '超时时间', dataIndex: 'timeout', key: 'timeout' },
                        { title: '规定处理时间', dataIndex: 'sometimes', key: 'sometimes' }],
                    dataSource: data.result,
                    total: data.total,
                    loading: false
                })
            });
        })
    }
    charmaine22 = (yData, data) => {
        let _this = this;
        let myChart = echarts.init(this.refs.charmaine22);
        myChart.off('click');
        myChart.setOption({
            color: ['#1EE2DA', '#3C63E5', '#79D5C7', '#FF675C', '#FFA75B'],
            title: {
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                bottom: 0,
                // left: 'middle',
                itemWidth: 14,
                // orient: 'vertical',
                data: []
            },
            grid: {
                top: '2%',
                left: '3%',
                right: '3%',
                bottom: 0,
                containLabel: true
            },
            xAxis: {
                show: false,
                type: 'value',
            },
            yAxis: {
                type: 'category',
                inverse: true,
                data: yData
            },
            series: [{
                name: '实施中项目数',
                type: 'bar',
                barWidth: 20,
                // barCategoryGap:'30%',
                label: {
                    show: true,
                    position: 'inside',
                    color: '#fff'
                },
                data: data
            }]
        })
        myChart.on('click', function (params) {
            _this.setState({
                showRightBox: true
            })
            vpQuery('/{bjyh}/api/esb/sszxmszq', {
                id: _this.state.implementValue,
                zq: params.name
            }).then((data) => {
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
                        { title: '开发负责人', dataIndex: 'xmcharger', key: 'xmcharger' }],
                    dataSource: data.result,
                    total: data.total,
                    loading: false
                })
            });
        })
    }
    charmaine23 = (yData, data) => {
        let _this = this;
        let myChart = echarts.init(this.refs.charmaine23);
        myChart.off('click');
        myChart.setOption({
            color: ['#0994FF', '#3C63E5', '#79D5C7', '#FF675C', '#FFA75B'],
            title: {},
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                // formatter: function (params) {
                //     var tar = params[1];
                //     return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
                // }
            },
            grid: {
                top: '2%',
                left: '3%',
                right: '3%',
                bottom: 0,
                containLabel: true
            },
            xAxis: {
                show: false,
                type: 'value'
            },
            yAxis: {
                type: 'category',
                inverse: true,
                data: yData
            },
            series: [{
                name: '系统受理需求数排名',
                type: 'bar',
                stack: '总量',
                barWidth: 20,
                label: {
                    show: true,
                    position: 'inside'
                },
                data: data,
            }
            ]
        })
        myChart.on('click', function (params) {
            _this.setState({
                showRightBox: true
            });
            vpQuery('/{bjyh}/api/esb/xtslxqszq', {
                zq: params.name
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
                        { title: '开发负责人', dataIndex: 'xmcharger', key: 'xmcharger' }],
                    dataSource: data.result,
                    total: data.total,
                    loading: false
                })
            });
        })
    }
    
    fromonclick(record, index) {
        console.log("record",record);
        // console.log("record.scode",record.scode);
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



    onChange = (e) => {
        this.setState({
            radioValue: e.target.value,
        });
        this.demand(this.state.demandValue, e.target.value)
    }
    closeModal = () => {
        this.setState({
            showRightBox: false,
            MoreRightBox: false,
            dataSource: []
        })
    }
    alertmodel = (event) => {
        let styles = {
            top: event.clientY - 10,
            left: event.clientX - 90,
        };
        this.setState({
            flexStatus: 'block',
            blockStatus: styles
        });
    }
    modelFour = (e) => {
        this.setState({
            flexStatusScots: 'block',
        });
    }
    promptClick = () => {
        this.setState({
            flexStatusPrompt: 'block'
        })
    }
    handle_model = (event) => {
        this.setState({
            flexStatus: 'none',
            flexStatusScots: 'none',
            flexStatusPrompt: 'none'
        });
    }
    // more更多弹框
    moreClick = () => {
        let seriesOptions = [];
        let options = {};
        let num = 0;
        let Length;
        let colors = ['#0994FF', '#3C63E5', '#79D5C7', '#FF675C', '#FFA75B', '#336699', '#00CFE6', '#00E68A', 'rgb(88, 173, 214)', 'rgb(215, 47, 218)', '#CFE600'];
        
        const { implementValue } = this.state;
        vpQuery('/{bjyh}/api/esb/sszxmsAll',{ id: implementValue , zq:''}).then((result) => {
            Length = result.data.length;
            for (let i = 0; i < result.data.length; i++) {
                const element = result.data[i];
                if (num > 10) {
                    num = 0
                }
                element.itemStyle = { color: `${colors[num++]}` };
            }
            options = {
                color: ['#1EE2DA', '#3C63E5', '#79D5C7', '#FF675C', '#FFA75B'],
                title: {
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    bottom: 0,
                    itemWidth: 14,
                    data: []
                },
                grid: {
                    top: '2%',
                    left: '3%',
                    right: '3%',
                    bottom: 0,
                    containLabel: true
                },
                xAxis: {
                    show: false,
                    type: 'value',
                    splitNumber: 10,
                },
                yAxis: {
                    type: 'category',
                    inverse: true,
                    data: result.legenddata
                },
            };
            seriesOptions = [{
                name: '实施中项目数',
                type: 'bar',
                barWidth: 20,
                label: {
                    show: true,
                    position: 'inside',
                    color: '#fff'
                },
                data: result.data
            }]
            this.setState({
                seriesOptions,
                options,
                Length,
                MoreRightBox: true,
                echartshow:true
            })
        }).catch((err) => { });
       
    }
    echartEvent = (data, param) => {
        let _this = this;
        const { implementValue } = this.state; 
        console.log('you click:', data, param);
        console.log('you seriesName:', param.seriesName);

        let fwdz="/{bjyh}/api/esb/sszxmszq";
        if(param.seriesName=="系统受理需求数排名"){
            fwdz="/{bjyh}/api/esb/xtslxqszq"
        }
        console.log("fwdz",fwdz);
        vpQuery(fwdz, {
            id:implementValue,
            zq: param.name
        }).then((data) => {
            this.setState({
                details_columns: [
                    { title: '项目编号', dataIndex: 'scode', key: 'scode', width: 150 ,render(text, record){
                        return (
                            <div onClick={()=>_this.fromonclick(record)}>{record.scode}</div>
                        )
                    } },
                    { title: '项目名称', dataIndex: 'projectname', key: 'projectname' ,width: 150 },
                    { title: '项目级别', dataIndex: 'xxmdj', key: 'xxmdj' },
                    { title: '业务代表', dataIndex: 'ywdb', key: 'ywdb' },
                    { title: '需求提出部门', dataIndex: 'partment', key: 'partment' },
                    { title: '项目经理', dataIndex: 'xmmanager', key: 'xmmanager' },
                    { title: '开发负责人', dataIndex: 'xmcharger', key: 'xmcharger' }],
                details_dataSource: data.result,
                detailsRightBox: true ,
                total:data.total
            })
        }); 
    }
    // more更多弹框
    moreClickxq = () => {
        let seriesOptions = [];
        let options = {};
        let num = 0;
        let Length;
        let colors = ['#0994FF', '#3C63E5', '#79D5C7', '#FF675C', '#FFA75B', '#336699', '#00CFE6', '#00E68A', 'rgb(88, 173, 214)', 'rgb(215, 47, 218)', '#CFE600'];
        
        const { implementValue } = this.state;
        vpQuery('/{bjyh}/api/esb/xtslxqsAll',{ id: implementValue , zq:''}).then((result) => {
            Length = result.data.length;
            for (let i = 0; i < result.data.length; i++) {
                const element = result.data[i];
                if (num > 10) {
                    num = 0
                }
                element.itemStyle = { color: `${colors[num++]}` };
            }
            options = {
                color: ['#1EE2DA', '#3C63E5', '#79D5C7', '#FF675C', '#FFA75B'],
                title: {
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    bottom: 0,
                    itemWidth: 14,
                    data: []
                },
                grid: {
                    top: '2%',
                    left: '3%',
                    right: '3%',
                    bottom: 0,
                    containLabel: true
                },
                xAxis: {
                    show: false,
                    type: 'value',
                },
                yAxis: {
                    type: 'category',
                    inverse: true,
                    data: result.legenddata
                },
            };
            seriesOptions = [{
                name: '系统受理需求数排名',
                type: 'bar',
                barWidth: 20,
                label: {
                    show: true,
                    position: 'inside',
                    color: '#fff'
                },
                data: result.data
            }]
            this.setState({
                seriesOptions,
                options,
                Length,
                MoreRightBox: true,
                echartshow:true
            })
        }).catch((err) => { });
       
    }
    // todo closeDetails 关闭视图详情
    closeDetails = () => {
        this.setState({
            detailsRightBox:false
        })
    }
    render() {
        const { reportData, reportDadas, radioValue, flexStatus, blockStatus, flexStatusScots, flexStatusPrompt, showRightBox, columns, dataSource,
            cardTitle, MoreRightBox, total, detailsRightBox ,details_columns , details_dataSource , seriesOptions , options , Length} = this.state;
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
        const radioStyle = {
            display: 'block',
            height: '35px',
            lineHeight: '35px',
        };
        return (
            <div className="leader-container">
                <VpRow gutter={16}>
                    <VpCol span={6}>
                        <img className="box-title-logo" style={{ height: 35, top: 10, left: 15 }} src={project} alt="" />
                        <VpCard title={`本年度立项项目数：${reportData.bndlxxms || 0}`}>
                            <div className="card-title">与去年同期相比：<img src={reportData.qn > 0 ? up : down} alt="" />  {Math.abs(reportData.qn) || ''}</div>
                            <div className="card-title">与前年同期相比：<img src={reportData.qiannian > 0 ? up : down} alt="" /> {Math.abs(reportData.qiannian) || ''}</div>
                            <div className="card-title">本月立项项目数： {reportData.bydlxxms || ''}</div>
                        </VpCard>
                    </VpCol>
                    <VpCol span={6}>
                        <img className="box-title-logo" src={implement} alt="" />
                        <VpCard title={`当前实施中项目数：${reportData.dqsszxms || 0}`}>
                            <div className="card-title">与去年同期相比：<img src={reportData.qnxiangbi > 0 ? up : down} alt="" /> {Math.abs(reportData.qnxiangbi) || ''}</div>
                            <div className="card-title">与前年同期相比：<img src={reportData.qiannxiangbi > 0 ? up : down} alt="" /> {Math.abs(reportData.qiannxiangbi) || ''}</div>
                            <div className="card-title">当前暂停项目数： {reportData.dqztxms || ''}</div>
                            <div className="particulars" onClick={(e) => this.alertmodel(e)}>人均情况</div>
                        </VpCard>
                    </VpCol>
                    <VpCol span={6}>
                        <img className="box-title-logo" src={operation} alt="" />
                        <VpCard title={`本年度投产次数：${reportData.bndtccs || 0}`} >
                            <div className="card-title">与去年同期相比：<img src={reportData.bndjqun > 0 ? up : down} alt="" /> {Math.abs(reportData.bndjqun) || ''}</div>
                            <div className="card-title">与前年同期相比：<img src={reportData.bndjqianun > 0 ? up : down} alt="" /> {Math.abs(reportData.bndjqianun) || ''}</div>
                            <div className="card-title">本月投产数量： {reportData.bydtccs || ''}</div>
                        </VpCard>
                    </VpCol>
                    <VpCol span={6}>
                        <img className="box-title-logo" src={production} alt="" />
                        <VpCard title={`生产系统总数：${reportDadas.syscxt || 0}`} >
                            <div className="card-title">实施中项目涉及系统总数：{reportDadas.sszxmsjxt || ''}</div>
                            <div className="card-title">在建系统清单：<a onClick={(e) => this.modelFour(e)}>{reportDadas.size || ''}</a></div>
                            <div className="card-title"></div>
                        </VpCard>
                    </VpCol>
                </VpRow>
                <VpRow gutter={16}>
                    <VpCol span={12}>
                        <VpCard title="需求受理情况">
                            <VpSelect defaultValue="1" onChange={this.matrix_handleChange}>
                                <VpOption value="1">本月</VpOption>
                                <VpOption value="2">本季</VpOption>
                                <VpOption value="3">本年</VpOption>
                            </VpSelect>
                            <div className="card-head-title">
                                <span>本期新增:{cardTitle.bqxz}</span>
                                <span>比上月:{cardTitle.bsy}</span>
                            </div>
                            <div style={{ textAlign: 'center', display: this.state.gif_loading ? 'block' : 'none' }}><img src={loading} alt="" /></div>
                            <div className={`content-grids ${this.state.gif_loading ? 'hidden' : ''}`} ref="charmaine11"></div>
                        </VpCard>
                    </VpCol>
                    <VpCol span={12}>
                        <VpCard title="项目立项情况">
                            <VpSelect defaultValue="1" onChange={this.demand_handleChange}>
                                <VpOption value="1">本月</VpOption>
                                <VpOption value="2">本季</VpOption>
                                <VpOption value="3">本年</VpOption>
                            </VpSelect>
                            <VpRadioGroup onChange={this.onChange} value={radioValue}>
                                <VpRadio style={radioStyle} key="a" value={0}>全部</VpRadio>
                                <VpRadio style={radioStyle} key="b" value={1}>A</VpRadio>
                                <VpRadio style={radioStyle} key="c" value={2}>B</VpRadio>
                                <VpRadio style={radioStyle} key="d" value={3}>C/无</VpRadio>
                            </VpRadioGroup>
                            <div className="content-grids" ref="charmaine12" style={{ height: 334 }}></div>
                        </VpCard>
                    </VpCol>
                </VpRow>
                <VpRow gutter={16}>
                    <VpCol span={10}>
                        <VpCard title="服务承诺执行情况">
                            <img className="card_prompt" onClick={this.promptClick} src={prompt} alt="" />
                            <VpSelect defaultValue="1" onChange={this.service_handleChange}>
                                <VpOption value="1">当日</VpOption>
                                <VpOption value="2">本周</VpOption>
                                <VpOption value="3">本月</VpOption>
                            </VpSelect>
                            <div className="content-grids" ref="charmaine21"></div>
                        </VpCard>
                    </VpCol>
                    <VpCol span={7}>
                        <VpCard title="实施中项目数">
                            <VpSelect defaultValue="1" onChange={this.implement_handleChange}>
                                <VpOption value="1">业务线</VpOption>
                                <VpOption value="2">部门</VpOption>
                            </VpSelect>
                            <div className="content-grids" ref="charmaine22"></div>

                            {this.state.btnStatus===false ? <VpButton disabled type="dashed" onClick={() => this.moreClick()}>More</VpButton>
                        : <VpButton type="dashed" onClick={() => this.moreClick()}>More</VpButton>}

                            
                        </VpCard>
                    </VpCol>
                    <VpCol span={7}>
                        <VpCard title="系统受理需求数排名">
                            <div className="content-grids" ref="charmaine23"></div>
                            <VpButton type="dashed" onClick={() => this.moreClickxq()}>More</VpButton>
                        </VpCard>
                    </VpCol>
                </VpRow>
                <div className="flex-container" style={{ display: flexStatus }} onClick={(e) => this.handle_model(e)}>
                    <div className="flex-status model" style={blockStatus}>
                        <h5 style={{ background: "#3C63E5" }}>人均情况</h5>
                        <div>项目经理人均：{reportData.xmjlrj}</div>
                        <div>开发负责人人均：{reportData.kfrj}</div>
                        <div>开发人员参与项目人均数：{reportData.kfrycsxmrjs}</div>
                        <div>运维代表人均：{reportData.yyrj}</div>
                        <div>需求提出人人均：{reportData.xqrj}</div>
                        <div>需求提出人负责最高：{reportData.xqtczd}</div>
                    </div>
                </div>
                <div className="flex-container-scxtzs" style={{ display: flexStatusScots }} onClick={(e) => this.handle_model(e)}>
                    <div className="flex-status model" style={{ top: 115, right: 20, maxHeight: 250, overflow: 'auto' }}>
                        <h5 style={{ background: "#FF675C" }}>系统数详情展示</h5>
                        {reportDadas.map && reportDadas.map.map((item, index) => {
                             return (
                                <div onClick={()=>this.fromonclick(item)}>{item.sname}</div>
                            ) 
                        })}
                    </div>
                </div>
                <div className="flex-container-prompt" style={{ display: flexStatusPrompt }} onClick={(e) => this.handle_model(e)}>
                    <div className="flex-status model" style={{ top: '69%', left: '47%' }}>
                        <h5 style={{ background: "#30788e", textAlign: "left" }}>服务承诺执行标准</h5>
                        <div style={{ width: 250 }}>
                            1.受理申请时限（需求受理人审核确认项目类型）：当日<br />
                            2.需求初审时限（项目经理申请资源）：1个工作日<br />
                            3.分配科技资源时限（开发、测试、运营指派资源）：1个工作日<br />
                            4.技术经理审核时限（开发负责人审核）：1个工作日<br />
                            5.PMO评审时限：1个工作日
                        </div>
                    </div>
                </div>
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
                        title={() => ''}
                        pagination={pagination}
                    />}
                </RightBox>
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
                    show={MoreRightBox}
                    destroyOnClose >
                   {options && <LineEchart Length={Length} options={options} seriesOptions={seriesOptions} clickEvent={this.echartEvent} />}
                </RightBox>
                <RightBox
                    onClose={this.closeDetails}
                    max={true}
                    tips={
                        <div className="tips p-xs">
                            <VpTooltip placement="top" title="0000">
                                <VpIcon type="exclamation-circle text-muted m-r-xs" />
                            </VpTooltip>
                        </div>
                    }
                    show={detailsRightBox}
                    destroyOnClose >
                    <VpTable
                        className="loader_tbody"
                        columns={details_columns}
                        dataSource={details_dataSource}
                        scroll={{ x: 2000, y: 730 }}
                        resize
                        title={() => ''}
                        pagination={pagination}
                    />
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
            </div>
        )
    }
}