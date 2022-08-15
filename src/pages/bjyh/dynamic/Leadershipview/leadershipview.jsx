/* jshint esversion: 6 */
import React from 'react';
import { VpCard, VpRow, VpCol, VpTabs, VpIconFont, VpSelect, VpOption, VpTooltip, VpIcon, VpTable, VpRadioGroup, VpRadio, VpModal, vpQuery } from 'vpreact';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
import up from './img/9.png';
import down from './img/8.png';
import project from './img/11.png';
import implement from './img/3.png';
import operation from './img/5.png';
import production from './img/1.png';
import prompt from './img/2.png';
// 引入环形图
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import { RightBox } from 'vpbusiness';
import './index.less';
const TabPane = VpTabs.TabPane;
export default class Lacers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeKey: '1',
            isMax: false,
            Status:false,
            visible: false,
            demandValue: 1,
            serviceValue: 1,
            modifyValue: 1,
            operationValue: 1,
            implementValue: 1,
            selectNum:0,
            radioValue: 0,
            flexStatus: 'none',
            flexStatusScots: 'none',
            flexStatusPrompt: 'none',
            blockStatus: {},
            matrixValue: 1,
            showRightBox: false,
            reportData: {},
            reportDadas: {},
            xmlxqkDate: [],
            columns: [],
            xqslqklistLegend: [],
            dataMap: {},
            cardTitle:{},
            timeDate: [],
            numberOption:'',
            dataSource: [],
            colors: ['#0994FF', '#3C63E5', '#79D5C7', '#FF675C', '#FFA75B', '#336699', '#00CFE6', '#00E68A', '#00E617', '#5CE600', '#CFE600'],
            total:0
        };
    }
    componentWillMount() {
        this.reportgetdata();
        this.reportscxtzs();
        this.xqslqklist(1,0);
    }
    componentDidMount() {
        this.demand(this.state.demandValue, this.state.radioValue);
        this.implement(1);
        this.xtslxqs();
        this.service(1);

    }
    componentWillUnmount() {

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
            matrixValue: value
        })
        this.xqslqklist(value,this.state.selectNum);
    }
    xqslqklist =(value,num) => {
        let { cardTitle } = this.state;
        vpQuery('/{bjyh}/Reports/xqslqklist', {
            id: value
        }).then((response) => {
            let month = [];
            response.data.map(item => {
                if(value === 1){
                    month.push(`${item}月`);
                }else{
                    month.push(item);
                }
            });
            let legenddata = [];
            cardTitle.bqxz = response.bqxz;
            cardTitle.bsy = response.bsy;
            let datamap = { dataPI: { 1: [], 2: [], 3: [] }, dataSI: { 1: [], 2: [], 3: [] }, dataTI: { 1: [], 2: [], 3: [] }, dataTH: { 1: [], 2: [], 3: [] } };
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
                    datamap.dataPI[index + 1].push(obj);
                    datamap.dataSI[index + 1].push(obj2);
                    datamap.dataTI[index + 1].push(obj3);
                    datamap.dataTH[index + 1].push(obj4);
                    arr.push(list.sname);
                })
                legenddata.push(arr);
            })
            this.setState({
                xqslqklistLegend: legenddata,
                dataMap: datamap,
                timeDate:response.data
            }, () => {
                this.charmaine11(legenddata[num],datamap,month);
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
    demand = (id, type)  => {
        vpQuery('/{bjyh}/api/esb/xmlxqk', {
            id: id,
            type: type,
            zq: ''
        }).then(({ data }) => {
            this.charmaine12(data);
        });
    }
    // TODO实施中项目数
    implement_handleChange = (value) => {
        this.setState({
            implementValue: value
        })
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
    // TODO 系统受理需求数排名TOP5
    xtslxqs() {
        vpQuery('/{bjyh}/api/esb/xtslxqs', {
            zq: ''
        }).then((data) => {
            data.data.map((item, index) => {
                item.itemStyle = { color: this.state.colors[index] }
            })
            this.charmaine23(data.legenddata, data.data);
        });
    }
    // TODO 项目变更情况排名TOP5
    modify_handleChange = (value) => {
        this.setState({
            modifyValue: value
        })
        this.modify(value);
    }
    modify(id) {
        vpQuery('/{bjyh}/api/esb/xmbgqk', {
            id: id,
            zq: ''
        }).then(({ data }) => {
            data.result.map((item, index) => {
                item.type = 'bar';
                item.value = item.data;
                item.label = {
                    show: true,
                    position: 'right',
                    color: '#000'
                };
            })
            this.charmaine31(data.legenddata, data.ydata, data.result);
        });
    }
    //   TODO 项目投产分析
    operation_handleChange = (value) => {
        this.setState({
            operationValue: value
        })
        this.operation(value);
    }
    operation(id) {
        vpQuery('/{bjyh}/api/esb/xmfxtc', {
            id: id,
            type: ''
        }).then(({ data }) => {
            this.charmaine32(data.legendData, data.data1, data.data2);
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

    // TODO 未来三月资源供需情况
    wlzrgg() {
        vpQuery('/{bjyh}/api/esb/wlzrgg', {}).then(({ data }) => {
            data.result.map((item, index) => {
                item.type = 'line';
                item.lineStyle = { width: 4 }
            });
            this.charmaine41(data.legendData, data.xData, data.result);
        });
    }
    callback = (key) => {
        let { Status } = this.state;
        if (key ==2 && !Status) {
            this.setState({
                activeKey: key,
                Status:true
            })
            this.modify(1);
            this.operation(1);
            this.wlzrgg();
        }else{
            this.setState({
                activeKey: key,
            })
        }
    }
    charmaine11 = (legenddata,datamap,timeDate) => {
        let _this = this;
        const { numberOption , matrixValue} = this.state;
        var myChart = echarts.init(this.refs.charmaine11);
        myChart.off('click');
        myChart.setOption({
            baseOption: {
                timeline: {
                    axisType: 'category',
                    autoPlay: false,
                    playInterval: 1000,
                    data: timeDate,
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
                    right: 80,
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
        })
        myChart.on('click', function (params) {
            if(typeof(params.data) === 'number'){
                console.log(params.data);
                _this.setState({
                    numberOption: params.name,
                    selectNum:params.data
                })
                _this.xqslqklist(matrixValue,params.data);
            }else{
                vpQuery('/{bjyh}/Report/xqslqklistzq', {
                    id: matrixValue,
                    type:params.seriesName,
                    deptname:  params.name,
                    fz: matrixValue === 1 ? _this.state.numberOption.substring(0,1) :　_this.state.numberOption
                }).then((data) => {
                    _this.setState({
                        columns: [{ title: '项目名称', dataIndex: 'sname', key: 'sname',width:200 },
                        { title: '需求提出部门', dataIndex: 'dptname', key: 'dptname' },
                        { title: '项目经理', dataIndex: 'xmjl', key: 'xmjl' },
                        { title: '开发负责人', dataIndex: 'kffzr', key: 'kffzr' }],
                        dataSource: data.list,
                        showRightBox: true
                    })
                })
            }
            
        })
    }
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
                    center: ['40%', '50%'],
                    radius: ['60%', '80%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: true,
                        formatter: '{b}:{c}',
                        fontSize: 12
                    },
                    labelLine: {
                        length: 7,
                        length2: 7
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
            vpQuery('/{bjyh}/api/esb/xmlxqkzq', {
                id: _this.state.demandValue,
                type: _this.state.radioValue,
                zq: params.data.pid
            }).then((data) => {
                _this.setState({
                    columns: [{ title: '项目名称', dataIndex: 'projectname', key: 'projectname',width:300 },
                    { title: '需求提出部门', dataIndex: 'partment', key: 'partment' },
                    { title: '项目经理', dataIndex: 'xmmanager', key: 'xmmanager' },
                    { title: '开发负责人', dataIndex: 'xmcharger', key: 'xmcharger' },
                    { title: '立项时间', dataIndex: 'bggzl', key: 'bggzl' }],
                    dataSource: data.result,
                    showRightBox: true
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
                data: legendData
            },
            series: [{
                name: '服务承诺执行情况',
                type: 'bar',
                // stack: '总量',
                barWidth: 20,
                label: {
                    show: true,
                    position: 'inside',
                    formatter: '{b}:{c}',
                    fontSize: 10
                },
                data: data
            }]
        });
        myChart.on('click', function (params) {
            console.log(params);
            vpQuery('/{bjyh}/api/esb/fwcnzxqkzq', {
                id: _this.state.serviceValue,
                zq: params.data.sname
            }).then((data) => {
                _this.setState({
                    columns: [{ title: '项目名称', dataIndex: 'projectname', key: 'projectname',width:300 },
                    { title: '需求提出部门', dataIndex: 'partment', key: 'partment' },
                    { title: '步骤处理人', dataIndex: 'stepdeler', key: 'stepdeler' }],
                    dataSource: data.result,
                    showRightBox: true
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
            console.log(params.name, 'params');
            vpQuery('/{bjyh}/api/esb/sszxmszq', {
                id: _this.state.implementValue,
                zq: params.name
            }).then((data) => {
                _this.setState({
                    columns: [{ title: '项目名称', dataIndex: 'projectname', key: 'projectname',width:300 },
                    { title: '需求提出部门', dataIndex: 'partment', key: 'partment' },
                    { title: '项目经理', dataIndex: 'xmmanager', key: 'xmmanager' },
                    { title: '开发负责人', dataIndex: 'xmcharger', key: 'xmcharger' }],
                    dataSource: data.result,
                    total: data.total,
                    showRightBox: true
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
            vpQuery('/{bjyh}/api/esb/xtslxqszq', {
                zq: params.name
            }).then((data) => {
                _this.setState({
                    columns: [{ title: '项目名称', dataIndex: 'projectname', key: 'projectname',width:300 },
                    { title: '需求提出部门', dataIndex: 'partment', key: 'partment' },
                    { title: '项目经理', dataIndex: 'xmmanager', key: 'xmmanager' },
                    { title: '开发负责人', dataIndex: 'xmcharger', key: 'xmcharger' }],
                    dataSource: data.result,
                    showRightBox: true
                })
            });
        })
    }
    charmaine31 = (legend, yData, data) => {
        let _this = this;
        let myChart = echarts.init(this.refs.charmaine31);
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
                right: '18%',
                bottom: '3%',
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
            series: data
        })
        myChart.on('click', function (params) {
            let type;
            if (params.name === "变更次数") {
                type = 2;
            } else {
                type = 1;
            }
            vpQuery('/{bjyh}/api/esb/xmbgqkzq', {
                id: _this.state.modifyValue,
                depName: params.seriesName,
                type: type
            }).then((data) => {
                if (type === 1) {
                    _this.setState({
                        columns: [{ title: '项目名称', dataIndex: 'projectname', key: 'projectname' , width:300 },
                        { title: '需求提出部门', dataIndex: 'partment', key: 'partment' },
                        { title: '项目经理', dataIndex: 'xmmanager', key: 'xmmanager' },
                        { title: '开发负责人', dataIndex: 'xmcharger', key: 'xmcharger' },
                        { title: '变更工作量(人月)加和', dataIndex: 'xmcharger1', key: 'xmcharger1' }],
                        dataSource: data.result,
                        showRightBox: true
                    })
                } else {
                    _this.setState({
                        columns: [{ title: '项目名称', dataIndex: 'projectname', key: 'projectname',width:300 },
                        { title: '需求提出部门', dataIndex: 'partment', key: 'partment' },
                        { title: '项目经理', dataIndex: 'xmmanager', key: 'xmmanager' },
                        { title: '开发负责人', dataIndex: 'xmcharger', key: 'xmcharger' },
                        { title: '累计变更次数', dataIndex: 'xmcharger1', key: 'xmcharger1' }],
                        dataSource: data.result,
                        showRightBox: true
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
            color: ['#FFA75B' , '#FF675C','#79D5C7','#3C63E5','#0994FF'],
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
                    center: ['37%', '50%'],
                    radius: [0, '50%'],
                    label: {
                        position: 'inside',
                        formatter: '{d}%',
                        color: '#000',
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
                    center: ['37%', '50%'],
                    radius: ['70%', '95%'],
                    label: {
                        show: true,
                        position: 'inside',
                        formatter: '{d}%',
                        color: '#000',
                        fontSize: 10
                    },
                    data: data1
                }
            ]
        })
        myChart.on('click', function (params) {
            vpQuery('/{bjyh}/api/esb/xmfxtczq', {
                id: _this.state.operationValue,
                type: params.data.pid
            }).then((data) => {
                _this.setState({
                    columns: [{ title: '项目名称', dataIndex: 'projectname', key: 'projectname', width:300},
                    { title: '需求提出部门', dataIndex: 'partment', key: 'partment'},
                    { title: '项目经理', dataIndex: 'xmmanager', key: 'xmmanager' },
                    { title: '开发负责人', dataIndex: 'xmcharger', key: 'xmcharger'},
                    { title: '投产时间', dataIndex: 'bggzl', key: 'bggzl' ,render(value) {
                        return (
                            <div>
                                {value.substring(0,10)}
                            </div>
                        )
                    }}],
                    dataSource: data.result,
                    showRightBox: true
                })
            });
        })
    }
    charmaine41 = (legendData, xData, data) => {
        var myChart = echarts.init(this.refs.charmaine41);
        myChart.setOption({
            color: ['#0994FF', '#3C63E5', '#79D5C7', '#FF675C', '#FFA75B'],
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
    onChange = (e) => {
        this.setState({
            radioValue: e.target.value,
        });
        this.demand(this.state.demandValue, e.target.value)
    }
    closeModal = () => {
        this.setState({
            showRightBox: false
        })
    }
    onCancel = () => {
        this.setState({
            visible: false
        })
    }
    alertmodel = (event) => {
        let styles = {
            top: event.clientY - 55,
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
    render() {
        const pagination = {
            total: this.state.total,
            showSizeChanger: false,
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
        const { reportData , reportDadas , radioValue , flexStatus , blockStatus ,flexStatusScots ,flexStatusPrompt ,showRightBox ,columns , dataSource , cardTitle} = this.state;
        return (
            <div className="leader-container">
                <VpTabs activeKey={this.state.activeKey} onChange={this.callback}>
                    <TabPane tab="项目总览" key="1">
                        <VpRow gutter={16}>
                            <VpCol span={6}>
                                <img className="box-title-logo" style={{ height: 35, top: 10, left: 15 }} src={project} alt="" />
                                <VpCard title={`本年度立项项目数：${reportData.bndlxxms || 0}`}>
                                    <div className="card-title">与去年同期相比：<img src={reportData.qn > 0 ? up : down} alt="" />  {Math.abs(reportData.qn)}</div>
                                    <div className="card-title">与前年同期相比：<img src={reportData.qiannian > 0 ? up : down} alt="" /> {Math.abs(reportData.qiannian)}</div>
                                    <div className="card-title">本月立项项目数： {reportData.bydlxxms}</div>
                                </VpCard>
                            </VpCol>
                            <VpCol span={6}>
                                <img className="box-title-logo" src={implement} alt="" />
                                <VpCard title={`当前实施中项目数：${reportData.dqsszxms || 0}`}>
                                    <div className="card-title">与去年同期相比：<img src={reportData.qnxiangbi > 0 ? up : down} alt="" /> {Math.abs(reportData.qnxiangbi)}</div>
                                    <div className="card-title">与前年同期相比：<img src={reportData.qiannxiangbi > 0 ? up : down} alt="" /> {Math.abs(reportData.qiannxiangbi)}</div>
                                    <div className="card-title">当前暂停项目数： {reportData.dqztxms}</div>
                                    <div className="particulars" onClick={(e) => this.alertmodel(e)}>人均详情展示</div>
                                </VpCard>
                            </VpCol>
                            <VpCol span={6}>
                                <img className="box-title-logo" src={operation} alt="" />
                                <VpCard title={`本年度投产次数：${reportData.bndtccs || 0}`} >
                                    <div className="card-title">与去年同期相比：<img src={reportData.bndjqun > 0 ? up : down} alt="" /> {Math.abs(reportData.bndjqun)}</div>
                                    <div className="card-title">与前年同期相比：<img src={reportData.bndjqianun > 0 ? up : down} alt="" /> {Math.abs(reportData.bndjqianun)}</div>
                                    <div className="card-title">本月投产数量： {reportData.bydtccs}</div>
                                </VpCard>
                            </VpCol>
                            <VpCol span={6}>
                                <img className="box-title-logo" src={production} alt="" />
                                <VpCard title={`生产系统总数：${reportDadas.syscxt || 0}`} >
                                    <div className="card-title">实施中项目涉及系统总数：{reportDadas.sszxmsjxt}</div>
                                    <div className="card-title">在建系统数：<a onClick={(e) => this.modelFour(e)}>{reportDadas.size}</a></div>
                                    <div className="card-title"></div>
                                </VpCard>
                            </VpCol>
                        </VpRow>
                        <VpRow gutter={16}>
                            <VpCol span={12}>
                                <VpCard title="需求受理情况">
                                    <VpSelect defaultValue="1" onChange={this.matrix_handleChange}>
                                        <VpOption value="1">月度</VpOption>
                                        <VpOption value="2">季度</VpOption>
                                        <VpOption value="3">年度</VpOption>
                                    </VpSelect>
                                    <div className="card-head-title">
                                        <span>本期新增:{cardTitle.bqxz}</span>
                                        <span>比上月:{cardTitle.bsy}</span>
                                    </div>
                                    <div className="content-grids" ref="charmaine11"></div>
                                </VpCard>
                            </VpCol>
                            <VpCol span={12}>
                                <VpCard title="项目立项情况">
                                    <VpSelect defaultValue="1" onChange={this.demand_handleChange}>
                                        <VpOption value="1">月度</VpOption>
                                        <VpOption value="2">季度</VpOption>
                                        <VpOption value="3">年度</VpOption>
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
                                </VpCard>
                            </VpCol>
                            <VpCol span={7}>
                                <VpCard title="系统受理需求数排名TOP5">
                                    <div className="content-grids" ref="charmaine23"></div>
                                </VpCard>
                            </VpCol>
                        </VpRow>
                    </TabPane>
                    <TabPane tab="专项分析" key="2">
                        <VpRow gutter={16}>
                            <VpCol span={12}>
                                <VpCard title="项目变更情况排名TOP5">
                                    <VpSelect defaultValue="1" onChange={this.modify_handleChange}>
                                        <VpOption value="1">月度</VpOption>
                                        <VpOption value="2">季度</VpOption>
                                        <VpOption value="3">年度</VpOption>
                                    </VpSelect>
                                    <div className="content-grids" ref="charmaine31"></div>
                                </VpCard>
                            </VpCol>
                            <VpCol span={12}>
                                <VpCard title="项目投产分析">
                                    <VpSelect defaultValue="1" onChange={this.operation_handleChange}>
                                        <VpOption value="1">月度</VpOption>
                                        <VpOption value="2">季度</VpOption>
                                        <VpOption value="3">年度</VpOption>
                                    </VpSelect>
                                    <div className="content-grids" ref="charmaine32"></div>
                                </VpCard>
                            </VpCol>
                        </VpRow>
                        <VpRow gutter={16}>
                            <VpCol span={12}>
                                <VpCard title="未来三月资源供需情况">
                                    <div className="content-grids" ref="charmaine41"></div>
                                </VpCard>
                            </VpCol>
                            <VpCol span={12}>
                                <VpCard title="重要报表快捷查看链接">
                                    <div className="content-grids">
                                        <div className="layui-loop">
                                            <VpIconFont type="vpicon-bar-chart" />
                                            <a className="link" href="javascript:void(0)">延期项目统计表</a>
                                        </div>
                                        <div className="layui-loop">
                                            <VpIconFont type="vpicon-area-chart" />
                                            <a className="link" href="javascript:void(0)">项目标签一览表</a>
                                        </div>
                                    </div>
                                </VpCard>
                            </VpCol>
                        </VpRow>
                    </TabPane>
                </VpTabs>
                <div className="flex-container" style={{ display: flexStatus }} onClick={(e) => this.handle_model(e)}>
                    <div className="flex-status model" style={blockStatus}> 
                        <h5 style={{ background: "#3C63E5" }}>人均详情展示</h5>
                        <div>项目经理人均：{reportData.xmjlrj}</div>
                        <div>开发负责人人均：{reportData.kfrj}</div>
                        <div>运维代表人均：{reportData.yyrj}</div>
                        <div>需求提出人人均：{reportData.xqrj}</div>
                        <div>需求提出人负责最高：{reportData.xqtczd}</div>
                    </div>
                </div>
                <div className="flex-container-scxtzs" style={{ display: flexStatusScots }} onClick={(e) => this.handle_model(e)}>
                    <div className="flex-status model" style={{ top: 160, right: 20 }}>
                        <h5 style={{ background: "#FF675C" }}>系统数详情展示</h5>
                        {reportDadas.map && reportDadas.map.map((item, index) => {
                            return <div>({index + 1}) {item.sname}</div>
                        })}
                    </div>
                </div>
                <div className="flex-container-prompt" style={{display:flexStatusPrompt}}  onClick={(e) => this.handle_model(e)}>
                    <div className="flex-status model" style={{top:'69%',left:'47%'}}>
                        <h5 style={{ background: "#30788e",textAlign:"left" }}>服务承诺执行标准</h5>
                        <div style={{width:250}}>
                            1.受理申请时限（需求受理人审核确认项目类型）：当日<br/>
                            2.需求初审时限（项目经理申请资源）：1个工作日<br/>
                            3.分配科技资源时限（开发、测试、运营指派资源）：1个工作日<br/>
                            4.技术经理审核时限（开发负责人审核）：1个工作日<br/>
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
                            这里是相应属性的标题信息
                        </div>
                    }
                    show={showRightBox}>
                    <VpTable
                        className="loader_tbody"
                        columns={columns}
                        dataSource={dataSource}
                        scroll={{ x: 2000, y: 730 }}
                        resize
                        title={() => ''}
                        pagination={pagination}
                    />
                </RightBox>
            </div>
        );
    }
}