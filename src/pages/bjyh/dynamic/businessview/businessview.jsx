/* jshint esversion: 6 */
import React from 'react';
import { VpCard, VpRow, VpCol, VpSelect, VpOption, VpTooltip, VpIcon, VpTable, vpQuery } from 'vpreact';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
import prompt from './img/ti.png';
import { RightBox } from 'vpbusiness';
import './index.less';

export default class business extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showRightBox: false,
            columns: [],
            dataSource: [],
            xqprojectData: {},
            bmxqttlData: {},
            ydsxqkData: {},
            flexStatus: 'none',
            modelValue: '',
            evClient: {},
            total: 0,
        };
    }
    componentWillMount() {
    }
    componentDidMount() {
        // todo 项目情况概览：
        vpQuery('/{bjyh}/YwbLdReport/getdata', {}).then((result) => {
            result.ywjlrjxqs = Math.floor(result.ywjlrjxqs * 100) / 100
            this.setState({
                xqprojectData: result
            });
        });
        // TODO 月度上线情况 
        vpQuery('/{bjyh}/YwbLdReport/ydsxqk', {}).then((result) => {
            this.setState({
                ydsxqkData: result
            })
        })
        // todo 部门需求吞吐量 
        this.bmxqttl(1);
        // todo 项目实施情况
        this.QueryList(1);
        // todo 项目需求变更率
        this.bmxqbgl(1);
    }
    componentWillUnmount() {
    }
    bmxqttl = (value) => {
        vpQuery('/{bjyh}/YwbLdReport/bmxqttl', { id: value }).then((result) => {
            result.data1 = [];
            result.data2 = [];
            result.month = [];
            result.data.map(item => {
                if (value === 1) {
                    result.month.push(`${item}月`);
                } else {
                    result.month.push(item);
                }
            });
            result.lengtgdate.map((res) => {
                result.list.map((item) => {
                    let obj = {};
                    obj.name = res;
                    obj.fz = item.fz;
                    obj.jssj = item.jssj;
                    obj.kssj = item.kssj;
                    if (res === '受理需求') {
                        obj.value = item.slxql;
                        result.data1.push(obj);
                    }
                    if (res === '交付需求') {
                        obj.value = item.jfxql;
                        result.data2.push(obj);
                    }
                })
            });
            this.charmaine12(result);
        }).catch(() => {

        });
    }
    QueryList = (value) => {
        vpQuery('/{bjyh}/YwbLdSsqkReport/QueryList', { id: value }).then((result) => {
            let dataMap = [];
            let sname = ['立项中', '分析中', '实施中', '已交付', '已暂停', '已退回'];
            result.list.map((item) => {
                let arr = [];
                sname.map((list) => {
                    let obj = {};
                    obj.name = list;
                    obj.jssj = item.jssj;
                    obj.kssj = item.kssj;
                    switch (list) {
                        case '立项中':
                            obj.value = item.lxz;
                            obj.type = 0;
                            break;
                        case '分析中':
                            obj.value = item.fxz;
                            obj.type = 0;
                            break;
                        case '实施中':
                            obj.value = item.ssz;
                            obj.type = 3;
                            break;
                        case '已交付':
                            obj.value = item.yjf;
                            obj.type = 4;
                            break;
                        case '已暂停':
                            obj.value = item.yzt;
                            obj.type = 5;
                            break;
                        case '已退回':
                            obj.value = item.yth;
                            obj.type = 6;
                            break;
                        default:
                            break;
                    }
                    arr.push(obj);
                })
                dataMap.push(arr);
            });
            let month = [];
            let option = [];
            result.data.map((item, index) => {
                value === 1 ? month.push(`${item}月`) : month.push(item);
                let obj = {};
                obj.series = [{ data: dataMap[index] }, { data: dataMap[index] }];
                option.push(obj);
            });
            this.charmaine11(month, option,value);
        }).catch(() => {
        })
    }
    bmxqbgl = (value) => {
        vpQuery('/{bjyh}/YwbLdReport/bmxqbgl', { tj: value }).then((result) => {
            this.charmaine21(result, value);
        }).catch(() => {
        });
    }
    sxmodel = (time) => {
        vpQuery('/{bjyh}/YwbLdReport/ydsxqkzq', {
            sj: time,
            flag: time !== "非标准日"
        }).then((data) => {
            this.setState({
                showRightBox: true,
                columns: [{ title: '项目名称', dataIndex: 'sname', key: 'sname', width: 200 },
                { title: '业务代表', dataIndex: 'ywdb', key: 'ywdb' },
                { title: '项目经理', dataIndex: 'xmjl', key: 'xmjl' },
                { title: '开发负责人', dataIndex: 'kffzr', key: 'kffzr' },
                {
                    title: '投产时间', dataIndex: 'dsqsxsj', key: 'dsqsxsj', render(value) {
                        return <div>{value.substring(0, 10)}</div>
                    }
                }],
                dataSource: data.list,
            })
        })
    }
    charmaine11 = (month, option,value) => {
        let _this = this;
        var myChart = echarts.init(this.refs.charmaine11);
        myChart.setOption({
            baseOption: {
                color: ['#0994FF', '#3C63E5', '#79D5C7', '#FF675C', '#FFA75B', '#7C3DD9'],
                timeline: {
                    axisType: 'category',
                    currentIndex: month.length - 1,
                    autoPlay: false,
                    playInterval: 3000,
                    data: month,
                    left: 50,
                    right: 50
                },
                title: {
                    subtext: ''
                },
                tooltip: {},
                legend: {
                    data: [],
                },
                calculable: true,
                grid: {
                    top: '2%',
                    left: '6%',
                    right: '4%',
                    bottom: 70,
                },
                xAxis: [{
                    'type': 'category',
                    'axisLabel': {
                        'interval': 0
                    },
                    'data': [
                        '立项中', '分析中', '实施中', '已交付', '已暂停', '已退回', '', ''
                    ],
                }],
                yAxis: [{
                    type: 'value',
                    name: 'GDP',
                    splitLine: {
                        show: false
                    }
                }],
                series: [{
                    name: '项目实施情况',
                    type: 'bar',
                    barWidth: 30,
                    label: {
                        show: true,
                        position: 'inside'
                    }
                },
                {
                    name: '',
                    type: 'pie',
                    center: ['80%', '30%'],
                    radius: '35%',
                    labelLine: {
                        length: 5,
                        length2: 5
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{b}:  {d}%'
                    },
                    z: 100
                }
                ]
            },
            options: option
        })
        myChart.on('click', function (params) {
            if (typeof (params.data) !== 'number') {
                let columnsList = [{ title: '项目名称', dataIndex: 'pjname', key: 'pjname', width: 200 },
                { title: '业务代表', dataIndex: 'ywdb', key: 'ywdb' },
                { title: '项目经理', dataIndex: 'xmjl', key: 'xmjl' },
                { title: '开发负责人', dataIndex: 'kffzr', key: 'kffzr' }];
                switch (params.data.type) {
                    case 3:
                        columnsList.push({ title: '当前阶段', dataIndex: 'dqjd', key: 'dqjd' });
                        columnsList.push({ title: '计划上线日期', dataIndex: 'sxjhjsrq', key: 'sxjhjsrq', render(value) { return <div>{value.substring(0, 10)}</div> } });
                        break;
                    case 4:
                        columnsList.push({ title: '当前阶段', dataIndex: 'dqjd', key: 'dqjd' });
                        columnsList.push({ title: '实际上线日期', dataIndex: 'dsqsxsj', key: 'dsqsxsj', render(value) { return <div>{value.substring(0, 10)}</div> } });
                        break;
                    case 5:
                        columnsList.push({ title: '当前阶段', dataIndex: 'dqjd', key: 'dqjd' });
                        columnsList.push({ title: '暂停原因', dataIndex: 'sztyy', key: 'sztyy' });
                        break;
                    case 6:
                        columnsList.push({ title: '退回原因', dataIndex: 'thyy', key: 'thyy' });
                        break;
                    default:
                        break;
                }
                params.data.type !== 0 && vpQuery('/{bjyh}/YwbLdSsqkReport/getdatazq', {
                    id: value,
                    type: params.data.type,
                    kssj: params.data.kssj,
                    jssj: params.data.jssj
                }).then((data) => {
                    _this.setState({
                        columns: columnsList,
                        dataSource: data.list,
                        showRightBox: true
                    })
                })
            }
        })
    }
    charmaine12 = (bmxqttlData) => {
        let _this = this;
        let myChart = echarts.init(this.refs.charmaine12);
        myChart.off('click');
        myChart.setOption({
            color: ['#0994FF', '#FFA75B', '#79D5C7', '#FF675C', '#FFA75B'],
            title: {

            },
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                top: '2%',
                left: '2%',
                right: '2%',
                bottom: '8%',
                containLabel: true
            },
            legend: {
                bottom: 0,
                data: bmxqttlData.legenddata
            },
            xAxis: {
                type: 'category',
                data: bmxqttlData.month
            },
            yAxis: [
                {
                    type: 'value',
                },
            ],
            series: [{
                name: '受理需求',
                type: 'bar',
                stack: '总量',
                barWidth: 35,
                data: bmxqttlData.data1,
                label: {
                    show: true,
                    position: 'inside'
                },
            },
            {
                name: '交付需求',
                type: 'bar',
                stack: '总量',
                barWidth: 35,
                data: bmxqttlData.data2,
                label: {
                    show: true,
                    position: 'inside'
                },
            }]
        });
        myChart.on('click', function (params) {
            vpQuery('/{bjyh}/YwbLdReport/bmxqttlzq', {
                fz: params.name === "受理需求" ? "A" : "B",
                kssj: params.data.kssj,
                jssj: params.data.jssj
            }).then((data) => {
                _this.setState({
                    columns: params.name === "受理需求" ?
                        [{ title: '需求名称', dataIndex: 'sname', key: 'sname', width: 200 },
                        { title: '业务代表', dataIndex: 'ywdb', key: 'ywdb' },
                        { title: '项目经理', dataIndex: 'xmjl', key: 'xmjl' },
                        { title: '开发负责人', dataIndex: 'kffzr', key: 'kffzr' },
                        { title: '当前阶段', dataIndex: 'dqjd', key: 'dqjd' },
                        {
                            title: '计划上线日期', dataIndex: 'sxjhjsrq', key: 'sxjhjsrq', render(value) {
                                return <div>{value.substring(0, 10)}</div>
                            }
                        }] :
                        [{ title: '需求名称', dataIndex: 'sname', key: 'sname', width: 200 },
                        { title: '业务代表', dataIndex: 'ywdb', key: 'ywdb' },
                        { title: '项目经理', dataIndex: 'xmjl', key: 'xmjl' },
                        { title: '开发负责人', dataIndex: 'kffzr', key: 'kffzr' },
                        { title: '当前阶段', dataIndex: 'dqjd', key: 'dqjd' },
                        {
                            title: '实际上线日期', dataIndex: 'dzzsxsj', key: 'dzzsxsj', render(value) {
                                return <div>{value.substring(0, 10)}</div>
                            }
                        }],
                    dataSource: data.list,
                    showRightBox: true
                })
            })
        })
    }
    charmaine21 = (data, radioValue) => {
        let _this = this;
        let myChart = echarts.init(this.refs.charmaine21);
        let allzl = data.allzl === '0' ? '100' : data.allzl.replace(',','');
        let outData = (allzl - data.zl.replace(',','') ).toFixed(2);
        myChart.off('click');
        myChart.setOption({
            title: {
                text: `全行平均需求变更率${data.allbfb}%`,
                textStyle: {
                    color: '#02a0fd',
                    fontSize: 14
                }
            },
            tooltip: {
                show:false,
                trigger: 'item',
            },
            legend: {
                bottom: 0,
                data: ['变更工作量', '总工作量']
            },
            series: [
                {
                    name: '变更',
                    type: 'pie',
                    radius: ['60%', '80%'],
                    avoidLabelOverlap: false,
                    hoverOffset: 5,
                    // hoverAnimation: false,
                    label: {
                        show: true,
                        position: 'inside',
                        formatter: function (params) {
                            if (params.name === "总工作量") {
                                return params.value
                            }
                            return '';
                        }
                    },
                    emphasis: {
                        itemStyle: {
                            shadowColor: 'rgba(0, 0, 0, 0.4)',
                            shadowBlur: 5
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        {
                            value: data.zl,
                            name: '总工作量',
                            itemStyle: {
                                color: '#79D5C7'
                            }
                        },
                        {
                            value: outData,
                            name: '剩余',
                            selected: false,
                            itemStyle: {
                                color: '#eaeaea'
                            },
                            emphasis: {
                                itemStyle: {
                                    opacity: 0.7
                                }
                            },
                        },
                    ]
                },
                {
                    name: '总量',
                    type: 'pie',
                    radius: ['45%', '53%'],
                    avoidLabelOverlap: false,
                    hoverOffset: 5,
                    label: {
                        show: true,
                        position: 'inside',
                        formatter: function (params) {
                            if (params.name === "变更工作量") {
                                return params.value
                            }
                            return '';
                        }
                    },
                    emphasis: {
                        itemStyle: {
                            shadowColor: 'rgba(0, 0, 0, 0.4)',
                            shadowBlur: 5
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        {
                            value: data.bgzl,
                            name: '变更工作量',
                            itemStyle: {
                                color: '#0994FF'
                            }
                        },
                        {
                            value: (data.allbgzl === '0' ? '100' : data.allbgzl) - data.bgzl,
                            name: '剩余',
                            selected: false,
                            itemStyle: {
                                color: '#eaeaea'
                            },
                            emphasis: {
                                itemStyle: {
                                    opacity: 0.7
                                }
                            },
                        },
                    ]
                }, {
                    name: '完成率',
                    type: 'pie',
                    radius: ['0%', '35%'],
                    avoidLabelOverlap: false,
                    hoverAnimation: false,
                    label: {
                        show: true,
                        position: 'center',
                        color: '#000',
                        fontSize: '30',
                        fontWeight: 'bold',
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '30',
                            fontWeight: 'bold',
                            color: '#000'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        {
                            value: '', name: `${data.bfb}%`, itemStyle: {
                                color: '#fff'
                            }
                        },
                    ],
                    tooltip: {
                        formatter: '{a}<br >{d}%'
                    }
                }
            ]
        });
        myChart.on('click', function (params) {
            console.log(params);
            (params.name !== "剩余" && params.name !== "总工作量") && vpQuery('/{bjyh}/YwbLdReport/bmxqbglzq', {
                tj: radioValue,
            }).then((data) => {
                _this.setState({
                    columns: [{ title: '项目名称', dataIndex: 'pjname', key: 'pjname', width: 200 },
                    { title: '需求提出部门', dataIndex: 'deptname', key: 'deptname' },
                    { title: '项目经理', dataIndex: 'xmjl', key: 'xmjl' },
                    { title: '开发负责人', dataIndex: 'kffzr', key: 'kffzr' },
                    { title: '变更工作量', dataIndex: 'bgzl', key: 'bgzl' }],
                    dataSource: data.result,
                    showRightBox: true
                })
            })
        })
    }
    closeModal = () => {
        this.setState({
            showRightBox: false
        })
    }
    // * 模态框隐藏
    handle_model = () => {
        this.setState({
            flexStatus: 'none'
        })
    }
    // *模态框显示位置
    clickModel = (e, value) => {
        let Rwidth = document.documentElement.clientWidth - e.clientX;
        let mleft;
        if (Rwidth < 200) {
            mleft = e.clientX - 200;
        } else {
            mleft = e.clientX - 100;
        }
        let evClient = {
            top: e.clientY + 25,
            left: mleft
        }
        this.setState({
            flexStatus: 'block',
            blockStatus: evClient,
            modelValue: value
        })
    }
    demand_handleChange = (value) => {
        this.QueryList(value);
    }
    bmxqttl_handleChange = (value) => {
        this.bmxqttl(value);
    }
    service_handleChange = (value) => {
        this.bmxqbgl(value);
    }
    render() {
        const { xqprojectData, showRightBox, flexStatus, modelValue, columns, dataSource, ydsxqkData, total } = this.state;
        const pagination = {
            total: total,
            showSizeChanger: true,
            onShowSizeChange(current, pageSize) {
                console.log('Current: ', current, '; PageSize: ', pageSize);
            },
            onChange(current) {
                console.log('Current: ', current);
            },
        };
        const deptname = vp.cookie.getTkInfo('dptname');
        return (
            <div className="leader-container business">
                <h4 style={{ padding: '0 10px 10px 5px', fontWeight: 600 }}>{deptname}需求项目情况概览：</h4>
                <VpRow gutter={16}>
                    <VpCol span={6}>
                        <img className="box-title-logo" src={prompt} alt="" onClick={(e) => this.clickModel(e, '本部门本年度,本月立项数量')} />
                        <VpCard title={`本年度新立项项目数：${xqprojectData.bndlxxms || 0}`}>
                            <div className="card-title">本月新立项项目数： {xqprojectData.bydlxxms}&nbsp;&nbsp;&nbsp;</div>
                        </VpCard>
                    </VpCol>
                    <VpCol span={6}>
                        <img className="box-title-logo" src={prompt} alt="" onClick={(e) => this.clickModel(e, '目前正在实施项目数量,暂停项目数量')} />
                        <VpCard title={`实施中项目数：${xqprojectData.dqsszxms || 0}`}>
                            <div className="card-title">暂停项目数： {xqprojectData.dqztzxms}</div>
                        </VpCard>
                    </VpCol>
                    <VpCol span={6}>
                        <img className="box-title-logo" src={prompt} alt="" onClick={(e) => this.clickModel(e, '本部门本年度,本月项目投产次数')} />
                        <VpCard title={`本年度投产次数：${xqprojectData.bndtc || 0}`} >
                            <div className="card-title">本月投产次数： {xqprojectData.bydtc}</div>
                        </VpCard>
                    </VpCol>
                    <VpCol span={6}>
                        <img className="box-title-logo" src={prompt} alt="" onClick={(e) => this.clickModel(e, '本部门业务经理平均在途项目数量,本部门业务经理最多在途需求数量')} />
                        <VpCard title={`业务经理人均需求数：${ xqprojectData.ywjlrjxqs || 0 }`} >
                            <div className="card-title">业务经理最多需求数：{xqprojectData.slzd}&nbsp;&nbsp;&nbsp;</div>
                        </VpCard>
                    </VpCol>
                </VpRow>
                <VpRow gutter={16}>
                    <VpCol span={12}>
                        <VpCard title="项目实施情况">
                            <VpSelect defaultValue="1" onChange={this.demand_handleChange}>
                                <VpOption value="1">本月</VpOption>
                                <VpOption value="2">本季</VpOption>
                            </VpSelect>
                            <div className="content-grids" ref="charmaine11"/>
                        </VpCard>
                    </VpCol>
                    <VpCol span={12}>
                        <VpCard title="部门需求吞吐量">
                            <VpSelect defaultValue="1" onChange={this.bmxqttl_handleChange}>
                                <VpOption value="1">本月</VpOption>
                                <VpOption value="2">本季</VpOption>
                            </VpSelect>
                            <div className="content-grids" ref="charmaine12"/>
                        </VpCard>
                    </VpCol>
                </VpRow>
                <VpRow gutter={16}>
                    <VpCol span={12}>
                        <VpCard title="项目需求变更率">
                            <VpSelect defaultValue="1" onChange={this.service_handleChange}>
                                <VpOption value="1">本月</VpOption>
                                <VpOption value="2">本季</VpOption>
                            </VpSelect>
                            <div className="content-grids" ref="charmaine21"/>
                        </VpCard>
                    </VpCol>
                    <VpCol span={12}>
                        <VpCard title="本月上线情况">
                            <div className="content-grids">
                                <div className="td-body">
                                    <div className="td-container">
                                        <h5>实际上线总个数</h5>{ydsxqkData.sjsxs}
                                    </div>
                                    <div className="td-container">
                                        <h5>计划上线总个数</h5>{ydsxqkData.jhsxzs}
                                    </div>
                                    <div className="device-use">
                                        {
                                            ydsxqkData.list && ydsxqkData.list.map((item) => {
                                                return (
                                                    <div className="time-use" key={item.sj} onClick={() => this.sxmodel(item.sj)} >
                                                        <div>{item.count}</div>
                                                        <span>{item.sj}</span>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </VpCard>
                    </VpCol>
                </VpRow>
                <div className="flex-container" style={{ display: flexStatus }} onClick={(e) => this.handle_model(e)}>
                    <div className="flex-status model" style={this.state.blockStatus}>
                        <h5 style={{ background: "#30788e", padding: '0 10px' }}>说明：</h5>
                        <div style={{ width: 200, whiteSpace: 'pre-line' }}>
                            {modelValue}
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
                    show={showRightBox} destroyOnClose >
                    {showRightBox &&   //dataSource ? <div className="table_loading"><img src={loading} alt="" /></div> :
                        <VpTable
                            className="loader_tbody"
                            columns={columns}
                            dataSource={dataSource}
                            scroll={{ x: 2000, y: 1500 }}
                            resize
                            title={() => ''}
                            pagination={pagination}
                        />}
                </RightBox>
            </div>
        );
    }
}