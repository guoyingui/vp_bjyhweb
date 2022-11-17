import React, { Component } from 'react';
import { Row, Col, Rate, Badge, Input } from 'antd';

// function Clock(props) {
//     return (
//         <div>
//             <h2>Hello, world!</h2>

//             <h2>It is {new Date().toLocaleTimeString()}.</h2>

//             <h2>{props.date.toLocaleTimeString()}</h2>
//         </div>
//     )
// }

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            childValue: this.props.demoValue
        }
        console.log(this.props.demoValue, '父组件传的值');
    }
    handleOnChange = (e) => {
        this.setState({
            childValue: e.target.value
        })
    }
    handleAdd = () => {
        this.props.onChildChange(this.state.childValue)
    }
    render() {
        return (
            <div>
                <Input onChange={this.handleOnChange} type="text" value={this.state.childValue} />
                <button onClick={this.handleAdd}>修改父的值</button>
            </div>
        )
    }
}

export default class Demo extends Component {
    // 构造函数 初化生命周期函数
    constructor(props) {
        // 用来实现继承
        super(props);
        this.state = {
            iValue: '123',
            count: 0,
            obj: {
                name: 'admin',
            },
            date: new Date()
        };
        this.timer = null
        // this.handleChange = this.handleChange.bind(this);
    }
    // 挂载前
    componentWillMount() {
        console.log(this.props, 'this.props');
        console.log('componentWillMount');
    }
    // 挂载后,渲染完成
    componentDidMount() {
        console.log('componentDidMount');
    }
    // shouldComponentUpdate(newProps,newState) {
    //     console.log('shouldComponentUpdate', newProps, newState);
        // return true;
    // }
    componentWillUpdate(newProps,newState,newContext) {
        console.log('componentWillUpdate', newProps,newState,newContext);
    }
    componentDidUpdate(newProps,newState,newContext) {
        console.log('componentDidUpdate', newProps,newState,newContext);
    }
    // 销毁
    componentWillUnmount() {
        console.log('componentWillUnmount');
    }
    handleOnChange = (e) => {
        this.setState({
            iValue: e.target.value
        })
        
    }
    onChild = (value) => {
        console.log(value, '子组件传过来的值');
        this.setState({
            iValue: value
        })
    }
    handleChange = (value) => {
        this.setState({
            count: value
        })
        this.props.setBreadCrumb('测试页面')
    }
    // 开始
    handleState = () => {
        this.timer = setInterval(() => {
            this.setState({
                date: new Date()
            })
        })
    }
    handleEnd = () => {
        clearInterval(this.timer)
    }
    render() {
        console.log('render');
        const { iValue, count }  = this.state;
        return (
            // 必须有一层父元素
            <div className="container_textmate">
                {/* <div className="gutter-example">
                    <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                            <div className="gutter-box">col-6</div>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <div className="gutter-box">col-6</div>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <div className="gutter-box">col-6</div>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <div className="gutter-box">col-6</div>
                        </Col>
                    </Row>
                </div> */}
                <div>
                    <Badge count={count} showZero={true}>
                        <a href="#" className="head-example" />
                    </Badge>
                    <br/>
                    <Rate onChange={this.handleChange} />
                    <Input onChange={this.handleOnChange}  value={iValue} placeholder='基本使用' />
                    {/* <input ref={this.inputRef} onChange={this.onChange} type="text" name="" id="" value='' /> */}
                </div>
                {/* <div>
                    <Clock date={this.state.date} />
                    <button onClick={this.handleState}>开始</button>
                    <button onClick={this.handleEnd}>暂停</button>
                </div> */}

                <h2>子组件</h2>
                <App demoValue={iValue} onChildChange={this.onChild} />
            </div> 
        )
    }
}
