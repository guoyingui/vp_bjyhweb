import React, { Component } from 'react'; //必须引入，因为jsx最终会被编译成React调用函数
import { VpInput } from 'vpreact';

/**
 * react加载过程
 * constructor
 * componentWillMount
 * render
 * componentDidMount
 * 更新过程
 * componentWillReceiveProps
 * shouldComponentUpdate
 * componentWillUpdate
 * render
 * componentDidUpdate
 *
 * react常用函数
 * this.setState 更新状态，触发组件更新
 * this.forceUpdate 强制更新组件
 */
class ReactComponent extends Component{

    /**
     * 第一次被渲染时调用
     * @props [注明支持哪些属性]
     * 如：
     * entityid  string  实体ID
     */
    constructor(props){
        /**
         * props 父组件向子组件传递参数用，
         * 参数可以是函数，所以如要实现子组件反馈信息给父组件时，可以通过父组件传递一个函数进来供子组件调用
         */
        super(props);
        /**
         * state 为组件内部状态变迁用，
         * 通过调用this.setState可以实现组件更新
         * 注意：直接修改state值不会触发更新，只能通过this.setState
         */
        this.state = {
            name:"初始"
        }

        this.changeName = this.changeName.bind(this);
    }

    /**
     * 第一次加载时调用，在调用render前调用
     */
    componentWillMount() {

    }

    /**
     * 父类重新渲染时调用
     * @param nextProps
     * @param nextContext
     *
     * 说明：
     * 通过this.setState 方法触发的更新过程不会调用这个函数，这是因为这个函数
         适合根据新的 props 值（也就是参数 nextProps ）来计算出是不是要更新内部状态 state (this.setState)
     */
    componentWillReceiveProps(nextProps, nextContext) {
    }

    /**
     * 是否需要重新渲染
     * @param nextProps
     * @param nextState
     * @param nextContext
     * @return true：允许更新，false:不允许更新
     * 说明：通过nextProps、nextState来决定是否需要重新渲染组件，尽量避免不必要的渲染次，提高性能.
     */
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        /**
         样例
        if(nextProps.entityid != this.props.entityid){
            return true;
        }
         return false;
         */
        return true;
    }

    /**
     * 组件更新前
     * @param nextProps
     * @param nextState
     * @param nextContext
     */
    componentWillUpdate(nextProps, nextState, nextContext) {

    }

    changeName(e){
        this.setState({
            name:e.target.value
        })
    }

    /**
     * 渲染，以下集中情况会调用
     * 1. 第一次渲染时调用
     * 2. 父组件重新渲染时
     * 3. 调用this.setState时
     * @returns 返回html/jsx代码
     * 注意：
     * 1. render方法内不可以直接调用setState方法，否则会出现死循环
     * 2. 返回元素只能有一个根元素，错误写法：<p>1</p><p>2</p>，正确写法: <div><p>1</p><p>2</p></div>
     */
    render(){
        console.log("my component render");
        return (

            <div>
                hello <span>{this.state.name}</span>
                <VpInput onPressEnter={this.changeName} />
             </div>
        )
    }

    /**
     * 第一次渲染成功后，即将render中的html代码渲染到浏览器后触发，
     * 此方法了可以使用像jquery的工具操作dom元素，但不建议这样使用
     */
    componentDidMount() {
    }

    /**
     * 更新完成后，将html重新渲染到浏览器后
     * @param prevProps
     * @param prevState
     * @param snapshot
     */
    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    /**
     * 组件卸载前
     */
    componentWillUnmount() {

    }
}

export default ReactComponent;