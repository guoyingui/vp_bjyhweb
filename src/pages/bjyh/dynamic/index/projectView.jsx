import React,{ Component } from 'react';
import {
    VpRow,
    VpCol,
    VpCard,
    VpIconFont,
    VpIcon,
    VpTooltip,
    VpDropdown,
    VpMenu,
    VpMenuItem,
    VpButton,
    VpModal,
    vpQuery,
    VpBadge,
    vpAdd,
    VpAlertMsg
} from "vpreact";
import ReactEcharts from 'echarts-for-react';
import "./index.less";

class IEcharts extends Component {

    getOption = () => {
        var option21 = {
            tooltip: {},
            legend: {
                data: [''],
            },
            grid: {
                top: '2%',
                left: '1%',
                right: '1%',
                bottom: '0',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: ["J系统", "I系统", "H系统", "H系统", "F系统", "E系统", "D系统", "C系统", "B系统", "A系统"],
                axisLabel: {
                    rotate: 15,
                    fontFamily: "宋体"
                }
            },
            yAxis: [{
                type: 'value',
                max: 30,
                interval: 5
            }],
            series: [{
                name: '系统',
                type: 'bar',
                barWidth: 30,
                data: [15, 16, 17, 19, 21, 22, 25, 26, 27, 29],
                color: "#EA4877"
            }]
        };
        return option21;
    };
    getProject = () => {
        var option = {
            tooltip: {},
            legend: {
                data: [''],
            },
            grid: {
                top: '2%',
                left: '1%',
                right: '1%',
                bottom: '0',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                max: 14,
                interval: 2
            },
            yAxis: [{
                data: ["A系统", "B系统", "C系统", "D系统", "E系统", "F系统", "G系统", "H系统", "I系统", "J系统"],
                axisTick: {
                    inside: true,
                    length: '3'
                },
                axisLabel: {
                    margin: 5,
                    fontFamily: "宋体"
                }
            }],
            series: [{
                name: '系统',
                type: 'bar',
                stack: '总量',
                data: [2, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                color: "#2D99FF"
            }]
        };
        return option;
    };
    getPerson = () => {
        var option = {
            tooltip: {
                formatter: "{a} <br/>{b} : {c}%"
            },
            grid: {
                top: '2%',
                left: '1%',
                right: '1%',
                bottom: '0',
                containLabel: true
            },
            series: [{
                name: '人员饱和度',
                type: 'gauge',
                detail: {
                    formatter: '{value}%'
                },
                data: [{
                    value: 92.86,
                    name: '完成率'
                }]
            }]
        };
        return option;
    };
    getProjectIntf = () => {
        var option31 = {
            title: {
                text: '当前受理中需求40个，排队需求共10个',
                left: 'center',
                top: 20,
                textStyle: {
                    fontSize: 14
                }
            },
            tooltip: {},
            legend: {
                // bottom: 10,
                left: 'center',
                data: ['大于5', '大于2小于5', '小于2']
            },
            grid: {
                left: '1%',
                right: '1%',
                bottom: '0%',
                containLabel: true
            },
            series: [{
                type: 'pie',
                radius: '65%',
                center: ['50%', '50%'],
                selectedMode: 'single',
                data: [{
                        value: 3,
                        name: "大于5",
                        itemStyle: {
                            color: '#E16C7D',
                        },
                    },
                    {
                        value: 5,
                        name: "大于2小于5",
                        itemStyle: {
                            color: '#F5D459'
                        },
                    },
                    {
                        value: 2,
                        name: "小于2",
                        itemStyle: {
                            color: '#72C77C',
                        },
                    },
                ],
            }]
        };
        return option31;
    };
    getProjectMAging = () => {
        var option12 = {
            tooltip: {},
            legend: {
                data: [''],
            },
            grid: {
                top: '1%',
                left: '1%',
                right: '1%',
                bottom: '0%',
                containLabel: true
            },
            xAxis: {
                data: ["5-2", "5-3", "5-4", "6-1"],
            },
            yAxis: [{
                type: 'value',
                max: 9,
                interval: 1
            }],
            series: [{
                name: '',
                type: 'line',
                data: [5, 7, 4, 8],
                color: "#ED7D31"
            }]
        };
        return option12;
    };
    getProjectNew = () => {
        var option11 = {
            title: {
                textVerticalAlign: 'top',
                top: 0
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: function (params, ticket, callback) {
                    var val = '';
                    params.map(function (item,index) {
                        if (item.value !== "") {
                            val += item.marker + item.seriesName + ': ' + item.value + '</br>'
                        }
                    })
                    return val;
                }
            },
            legend: {
                data: ['部门1', '部门2', '部门3', '部门4', '部门5', '部门6', '部门7', '部门8', '部门9', '部门10', '部门11',
                    '部门12', '部门13', '部门14', '部门15'
                ],
                type: 'scroll',
            },
            grid: {
                left: '1%',
                right: '1%',
                bottom: '0%',
                containLabel: true
            },
            xAxis: {
                // position:'top',
                type: 'category',
                data: ["业务线A", "业务线B", "业务线C", "业务线D", "业务线E", "业务线F"],
                axisLabel: {
                    rotate: 25,
                    fontFamily: "宋体"
                }
            },
            yAxis: [{
                type: 'value',
                max: 7,
                interval: 1
            }],
            series: [{
                name: '部门1',
                type: 'bar',
                stack: '业务线A',
                barWidth: 40,
                barGap: '-100%',
                data: [2, '', '', '', '', ''],
                color: "#FFDD6F"
            }, {
                name: '部门2',
                type: 'bar',
                stack: '业务线A',
                barWidth: 40,
                barGap: '-100%',
                data: [3, '', '', '', '', ''],
                color: "#F16481"
            }, {
                name: '部门3',
                type: 'bar',
                stack: '业务线A',
                barGap: 0,
                barWidth: 40,
                barGap: '-100%',
                data: [1, '', '', '', '', ''],
                color: "#733988"
            }, {
                name: '部门4',
                type: 'bar',
                stack: '业务线B',
                barWidth: 40,
                barGap: '-100%',
                barCategoryGap: 0,
                data: ['', 1, '', '', '', ''],
                color: "#FFC000"
            }, {
                name: '部门5',
                type: 'bar',
                stack: '业务线B',
                barWidth: 40,
                barGap: '-100%',
                data: ['', 2, '', '', '', ''],
                color: "#5ED6BB"
            }, {
                name: '部门6',
                type: 'bar',
                stack: '业务线B',
                barWidth: 40,
                barGap: '-100%',
                data: ['', 3, '', '', '', ''],
                color: "#39BB84"
            }, {
                name: '部门7',
                type: 'bar',
                stack: '业务线C',
                barWidth: 40,
                barGap: '-100%',
                data: ['', '', 1, '', '', ''],
                color: "#78F284"
            }, {
                name: '部门8',
                type: 'bar',
                stack: '业务线C',
                barWidth: 40,
                barGap: '-100%',
                data: ['', '', '', '', '', ''],
                color: "#508B8C"
            }, {
                name: '部门9',
                type: 'bar',
                stack: '业务线C',
                barWidth: 40,
                barGap: '-100%',
                data: ['', '', 1, '', '', ''],
                color: "#78F284"
            }, {
                name: '部门10',
                type: 'bar',
                stack: '业务线D',
                barWidth: 40,
                barGap: '-100%',
                data: ['', '', '', 1, '', ''],
                color: "#3680AD"
            }, {
                name: '部门11',
                type: 'bar',
                stack: '业务线D',
                barWidth: 40,
                barGap: '-100%',
                data: ['', '', '', 1, '', ''],
                color: "#FF6872"
            }, {
                name: '部门12',
                type: 'bar',
                stack: '业务线E',
                barWidth: 40,
                barGap: '-100%',
                data: ['', '', '', '', 2, ''],
                color: "#00B050"
            }, {
                name: '部门13',
                type: 'bar',
                stack: '业务线E',
                barWidth: 40,
                barGap: '-100%',
                data: ['', '', '', '', 1, ''],
                color: "#FFE95C"
            }, {
                name: '部门14',
                type: 'bar',
                stack: '业务线F',
                barWidth: 40,
                barGap: '-100%',
                data: ['', '', '', '', '', 2],
                color: "#92D050"
            }, {
                name: '部门15',
                type: 'bar',
                stack: '业务线F',
                barWidth: 40,
                barGap: '-100%',
                data: ['', '', '', '', '', 3],
                color: "#F4B183"
            }]
        };
        return option11;
    };
    getProjectWarnings = () => {
        var option33 = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                // bottom:10,
                type: 'scroll',
                data: ['业务线A', '业务线B', '业务线C', '业务线D', '业务线E', "业务线F"]
            },
            grid: {
                left: '1%',
                right: '1%',
                bottom: '0%',
                containLabel: true
            },
            series: [{
                name: '项目情况',
                type: 'pie',
                radius: ['30%', '50%'],
                center: ["50%", "55%"],
                label: {
                    normal: {
                        formatter: '{c}'
                    },
                },
                data: [{
                        value: 48,
                        name: '业务线A'
                    },
                    {
                        value: 35,
                        name: '业务线B'
                    },
                    {
                        value: 33,
                        name: '业务线C'
                    },
                    {
                        value: 23,
                        name: '业务线D'
                    },
                    {
                        value: 22,
                        name: '业务线E'
                    },
                    {
                        value: 20,
                        name: '业务线F'
                    }
                ]
            }]
        };
        return option33;
    };
    getProjectMonth = () => {
        var option22 = {
            title: {

            },
            tooltip: {},
            legend: {
                data: ['正常', '紧急'],
            },
            grid: {
                left: '1%',
                right: '1%',
                bottom: '0%',
                containLabel: true
            },
            xAxis: {
                data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                axisLabel: {
                    rotate: 50,
                    fontFamily: "宋体"
                }
            },
            yAxis: [{
                type: 'value',
                max: 50,
                interval: 5
            }],
            series: [{
                    name: '正常',
                    type: 'bar',
                    data: [30, 18, 28, 32, 35, 41, 39, 42, 45, 39, 44, 28],
                    color: "#FFE700"
                },
                {
                    name: '紧急',
                    type: 'bar',
                    data: [10, 12, 8, 10, 7, 9, 5, 11, 7, 6, 8, 3],
                    color: "#FF6C40"
                }
            ]
        };
        return option22;
    }
    render() {
        return (
            <div className="code-box-demo">
                <VpRow>
                    <VpCol span="12">
                        <VpIcon type="appstore"/>
                        <VpCard title="&nbsp;&nbsp;&nbsp;各系统在途项目情况" bordered={false}>
                            <ReactEcharts
                                option={this.getOption()}
                            />
                        </VpCard>
                    </VpCol>
                    <VpCol span="6">
                        <VpIcon type="appstore"/>
                        <VpCard title="&nbsp;&nbsp;&nbsp;各系统新建项目TOP10" bordered={false}>
                            <ReactEcharts
                                option={this.getProject()}
                            />
                        </VpCard>
                    </VpCol>
                    <VpCol span="6">
                        <VpIcon type="appstore"/>
                        <VpCard title="&nbsp;&nbsp;&nbsp;人员饱和度" bordered={false}>
                            <ReactEcharts
                                option={this.getPerson()}
                            />
                        </VpCard>
                    </VpCol>
                </VpRow>
                <VpRow>
                    <VpCol span="12">
                        <VpIcon type="appstore"/>
                        <VpCard title="&nbsp;&nbsp;&nbsp;项目立项排队情况统计" bordered={false}>
                            <ReactEcharts
                                option={this.getProjectIntf()}
                            />
                        </VpCard>
                    </VpCol>
                    <VpCol span="12">
                        <VpIcon type="appstore"/>
                        <VpCard title="&nbsp;&nbsp;&nbsp;项目立项时效" bordered={false}>
                            <ReactEcharts
                                option={this.getProjectMAging()}
                            />
                        </VpCard>
                    </VpCol>
                </VpRow>
                <VpRow>
                    <VpCol span="8">
                        <VpIcon type="appstore"/>
                        <VpCard title="&nbsp;&nbsp;&nbsp;各业务线新建项目情况一览" bordered={false}>
                            <ReactEcharts
                            option={this.getProjectNew()}
                        />
                        </VpCard>
                    </VpCol>
                    <VpCol span="8">
                        <VpIcon type="appstore"/>
                        <VpCard title="&nbsp;&nbsp;&nbsp;各业务线在途项目情况一览" bordered={false}>
                        <ReactEcharts
                                option={this.getProjectWarnings()}
                            />
                        </VpCard>
                    </VpCol>
                    <VpCol span="8">
                        <VpIcon type="appstore"/>
                        <VpCard title="&nbsp;&nbsp;&nbsp;月度投产情况" bordered={false}>
                        <ReactEcharts
                                option={this.getProjectMonth()}
                            />
                        </VpCard>
                    </VpCol>
                </VpRow>
            </div>
        )
    }
}
export default IEcharts;