
import React from 'react';
import {
    vpAdd, vpDownLoad, VpPopconfirm, VpRow, VpCol, VpTooltip,
    VpInputUploader,
    VpButton,
    VpAlertMsg,
    VpFormCreate,
    VpProgress,
    VpModal,
    VpSpin
} from 'vpreact';
import './style.less';
import { } from 'vpreact/public/Vp';


class xmzxhpjImprot extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            disabled: false,
            showImpInfo:false,
            errorinfo:[]
        }
    }

    downloadTemp = () => {
        vpDownLoad('/{bjyh}/xmzxhpj/templateDownload', {
            iid:this.state.iid,...this.state.delayedInfo,
        }).then((response) => {
            
        })
    }

    uploadClick = () => {
        this.inputUploader.upload.on("beforeFileQueued", (file) => {
            this.props.form.setFieldsValue({ "file_label": file.name })
        })
    }

    uploadSuccess = (file, res) => {
        if(res.data.errorInfo && res.data.errorInfo.length>0){
            let array = []
            if(res.data.succCount>0){
                array.push(<VpRow>`导入${res.data.succCount}条数据。`</VpRow>);
            }
            res.data.errorInfo.forEach((element,index) => {
                array.push(<VpRow >{element}</VpRow>)
            });         
            this.setState({
                errorinfo:array
            })
        }else{
            this.setState({errorinfo:`导入成功，导入${res.data.succCount}条数据`})
        }
 
        this.setState({
            percent: 100,
            loading: false,
            showImpInfo:true,
            loading: false,
            tips:'导入完毕'
        },()=>{
            setTimeout(() => {
                this.cancelModal()
            }, 1000);
        })
        this.props.form.setFieldsValue({ "sql": "", "file_label": "" })
        this.inputUploader.upload.reset()
    }
    increase = () => {
        let percent = this.state.percent + 10;
        if (percent > 90) {
            percent = 90;
            window.clearInterval(this.inter);
        }
        this.setState({ percent });
    }
    configUpdate = () => {
        let file_label = this.props.form.getFieldValue("file_label");
        if (file_label == '' || file_label == undefined) {
            VpAlertMsg({
                message: "消息提示",
                description: '请选择文件！',
                type: "info",
                closeText: "关闭",
                showIcon: true
            }, 5)
        } else {
            this.doConfirm()
        }
    }
    doConfirm = () => {
        const _this = this
        this.setState({
            entityVisible: true,
            percent: 0,
            loading: true,
            tips: '导入中...',
        })
        this.inputUploader.upload.upload()
    }
    cancel = () => {
        console.log('点击了取消');
    }
    decline = () => {
        let percent = this.state.percent - 10;
        if (percent < 0) {
            percent = 0;
        }
        this.setState({ percent });
    }
    cancelModal = () => {
        this.setState({
            entityVisible: false,
            percent: 0
        })
    }
    openBackModel = () => {
        const _this = this
        vpAdd('/{vpplat}/xmzxhpjImprot/getBackList', {}
        ).then(function (res) {
            if (res.data.list) {
                _this.setState({
                    backVisible: true, backFileList: res.data.list
                })
            }
        }).catch(function (err) {
            console.log(err)
        });
    }
    download = (filepath) => {
        vpDownLoad('/{vpplat}/xmzxhpjImprot/download',
            {
                filepath: filepath
            }
        )
    }
    cancelBackModal = () => {
        this.setState({
            backVisible: false
        })
    }
    render() {
        return (
            <div className="business-container pr full-height">
                <div onClick={this.uploadClick}  style={{height: '100%',overflow:'hidden'}}>
                    <VpRow key={'inputRow'} >
                        <VpCol span={24}>
                            <VpInputUploader
                                form={this.props.form} item={{
                                    field_name: "excel",				    
                                    widget_type: "inputupload",
                                    field_label: "选择文件",
                                    all_line: 2,
                                    tips: '请选择（*.xls,*.xlsx）',
                                    auto: false,
                                    widget: {
                                        accept: {
                                            title: 'Excel',
                                            extensions: 'xls,xlsx',
                                    },
                                        upload_url: (window.vp.config.URL.devflag ? "" : "/zuul") + "/{bjyh}/xmzxhpj/xmzxhpjImprot",
                                    }
                                }}
				                uploaderOptions={{timeout: 0}}
                                ref={upload => this.inputUploader = upload}
                                onUploadAccept={this.uploadSuccess} />
                        </VpCol>
                    </VpRow>

                    {this.state.showImpInfo?
                        <VpRow key={'successinfo'} style={{height: '100%'}} >
                            <VpCol span={24} style={{height: '100%'}} >
                                <div style={{textAlign:'center',overflow:'auto',height:'calc(100% - 100px)'}}>
                                    {this.state.errorinfo}
                                </div>
                            </VpCol>
                        </VpRow>
                    :null}
                    
                </div>

                <div className="footFixed p-sm b-t text-center" >
                            {
                                this.state.entityVisible
                                    ? <VpButton className="vp-btn-br" type="primary" onClick={() => this.configUpdate()} disabled>导入</VpButton>
                                    : <VpButton className="vp-btn-br" type="primary" onClick={() => this.configUpdate()} >导入</VpButton>
                            }

                            {/* <VpButton className="vp-btn-br" style={{ marginLeft: 10 }} type="primary" onClick={this.downloadTemp} >下载模板</VpButton> */}
                </div>

                <VpModal
                    title='导入'
                    visible={this.state.entityVisible}
                    onCancel={() => this.cancelModal()}
                    width={'30%'}
                    footer={null}
                    style={{ height: '60%' }}
                    maskClosable={false}
                    wrapClassName='modal-no-footer'>
                    {
                        this.state.entityVisible ?
                            <VpSpin size={"large"} spinning={this.state.loading}>
                                <div style={{ marginLeft: "20%" }}>
                                    <VpProgress
                                        width={200}
                                        type="circle"
                                        percent={this.state.percent}
                                        format={() => this.state.tips}
                                    />

                                </div>
                            </VpSpin>
                            : null
                    }
                </VpModal>
                
            </div>
        );
    }
}
export default xmzxhpjImprot = VpFormCreate(xmzxhpjImprot);