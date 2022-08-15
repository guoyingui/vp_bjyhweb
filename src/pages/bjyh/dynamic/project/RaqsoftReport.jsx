/*
 * @Author: SL
 * @Date: 2020-07-06 09:25:54
 * @LastEditTime: 2020-08-04 17:48:49
 * @Description: 下载项目相关报表zip
 * @FilePath: \bjyhweb\src\pages\bjyh\dynamic\project\RaqsoftReport.jsx
 */ 
import React,{Component} from 'react';
import {VpProgress, VpButton, vpDownLoad, vpQuery, VpSpin } from "vpreact";
import loading from '../../images/loading.gif';
class RaqSoftReport extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            loadSuccess: true,
        }
    }
    /**
     * @description: 下载
     * @param {type} 
     */
    download = () => {
        this.setState({ loading: true , loadSuccess: false })
        
        const request = {
            body: JSON.stringify({
                iid: this.props.iid,
                reports: ['lxbgRpt', 'sxsqbRpt', 'xmsqRpt']
            }),
            type : 'JSON',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': 'Bearer ' + window.vp.cookie.getToken()
            }
        }
        fetch(vp.gateway.handleGateWay('{bjyh}') + '/raqsoft/zipDownload', request).then(response => {
            //const filename = response.headers.get('content-disposition').split(';')[1].split('=')[1]
            response.blob().then(blob => {
                const link = document.createElement('a')
                link.style.display = 'none'
                // a 标签的 download 属性就是下载下来的文件名
                link.download = this.props.entityname + '报表.zip'
                link.href = URL.createObjectURL(blob)
                document.body.appendChild(link)
                link.click()
                // 释放的 URL 对象以及移除 a 标签
                URL.revokeObjectURL(link.href)
                document.body.removeChild(link)
                this.setState({
                    loadSuccess: true
                }, () => {
                    // setTimeout(() => {
                    //     this.setState({
                    //         loading: false,
                    //     })
                    // }, 3000);
                })
            })
        })
        
    }

    render(){
        return(
            <div>
                <div>
                    <VpButton
                        loading={!this.state.loadSuccess} 
                        style={{margin:'0 auto',fontSize: 25}} 
                        onClick={this.download} 
                        type="primary" 
                        size="large"
                        >
                        导出报表
                    </VpButton>
                </div>
                {this.state.loading ?
                    <div style={{display: 'flex', justifyContent: 'center', marginTop:'8%'}}>
                        <p style={{fontSize: 45, }}>
                            {this.state.loadSuccess ? 
                               '导出成功。'
                            : <img src={loading} /> }
                        </p>
                    </div>
                :null}
            </div>
        )
    }

}
export default RaqSoftReport;