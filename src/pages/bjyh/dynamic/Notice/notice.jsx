import React, { Component } from 'react'
import {
    vpQuery,
    vpAdd,
    VpTable,
    VpIcon,
    VpTooltip,
    VpForm,
    VpModal,
    VpButton,
    VpRow,
    VpCol,
    VpFormCreate,
    VpPopconfirm,
    vpDownLoad 
} from 'vpreact';
import "./notice.less";
export default class notice extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formData:this.props.formData || {}
        }

    }
    componentDidMount() {
        $(".ucontent").append(this.state.formData.odynamic)
    }

    filedownload=(iid)=>{
        vpDownLoad(window.vp.config.URL.download, {
            fileid:iid,
            iaccesslevel:1,
        })
    }

    handleSubmit = () => {
	    this.props.closeModal()
    }


    render() {
        let {formData} = this.state
        return (
            <div style={{position: 'relative', height: '100%'}}>
            <div className="bg-white notice full-height" style={{overflow:'auto',paddingBottom:50}}>
                <VpRow className="p-t-sm">
                    <VpCol span={3} className="">
                        <div className="title-top">
                            标题
                        </div>
                    </VpCol>
                    <VpCol span={19} className="p-b-sm b-b m-b-sm">
                        <div className="title-top rowheight">
                            {formData.sname}
                        </div>
                    </VpCol>
                </VpRow>

                <VpRow >
                    <VpCol span={3} className="p-b-sm  m-b-sm">
                        <div className="title">
                            类别
                        </div>
                    </VpCol>
                    <VpCol span={19} className="p-b-sm b-b m-b-sm">
                        <div className="title rowheight">
                        {formData.iclassname}
                        </div>
                    </VpCol>
                </VpRow>

                <VpRow >
                    <VpCol span={3} className="p-b-sm  m-b-sm">
                        <div className="title ">
                            发布人
                        </div>
                    </VpCol>
                    <VpCol span={19} className="p-b-sm b-b m-b-sm">
                        <div className="title rowheight">
                        {formData.username}
                        </div>
                    </VpCol>
                </VpRow>

                <VpRow>
                    <VpCol span={3} className="p-b-sm  m-b-sm">
                        <div className="title">
                            发布日期
                        </div>
                    </VpCol>
                    <VpCol span={19} className="p-b-sm b-b m-b-sm">
                        <div className="title rowheight">
                        {formData.dproposetime}
                        </div>
                    </VpCol>
                </VpRow>

                <VpRow className="container_textmate">
                    <VpCol span={1}></VpCol>
                    <VpCol span={22}>
                        <div className="box-textmate">
                            <div className="p-t-sm ucontent">
                            
                            </div>
                        </div>
                    </VpCol>
                </VpRow>
                {
                   formData.filelist && formData.filelist.length?
                   <VpRow className="m-t-sm">
                    <VpCol span={3} className="p-b-sm  m-b-sm">
                        <div className="title">
                            附件
                        </div>
                    </VpCol>
                    <VpCol span={19} className="p-b-sm b-b m-b-sm">
                        <div>
                            <ul>
                                {
                                    formData.filelist.map((item,index)=>{
                                        return(
                                            <li key = {index} className="list-file" onClick={()=>this.filedownload(item.iid)}>{item.sname}</li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </VpCol>
                </VpRow>
                   : null
                }
               
            </div>
            <div className="footFixed p-sm b-t text-center">
                    <VpButton className="vp-btn-br"  type="ghost" onClick={() => this.handleSubmit()}>关闭</VpButton>
            </div>
            </div>
        );
    }
}
