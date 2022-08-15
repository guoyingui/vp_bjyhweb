import React, { Component } from 'react';
import echarts from 'echarts/lib/echarts';
export default class LineEchart extends Component{
    constructor(props){
        super(props);
        this.state = {
        }
    }
    componentDidMount(){
        console.log(this.props)
        let _this = this;
        let myChart = echarts.init(this.refs.charmaine);
        myChart.off('click');
        let option = {
            ...this.props.options,
            series: this.props.seriesOptions
        }
        setTimeout(() => {
            myChart.setOption(option);
        },1000)
        myChart.on('click',function (params) {
            _this.props.clickEvent(params.data,params);
        })
    }
    render(){
        console.log(this.props.Length);
        return(
            <div className="full-height" style={{marginTop: 40,paddingBottom:50,overflow:'auto'}}>
                <div className="full-height" style={{height: this.props.Length*30 }} ref="charmaine"></div>
            </div>
        )
    }
}