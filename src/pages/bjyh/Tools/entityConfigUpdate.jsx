
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


class entityConfigUpdate extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tabs: '1',
            data_array: [],
            pagination: '',
            perpage: 10000,
            page: 1,
            rows: '',
            disabled: true,
            percent: 0,
            ProgressTitle: '',
            entityVisible: false,
            confirmTitle: '',
            isSelectFile: false,
            tips: '',
            loading: false,
            backFileList: []
        }
    }

    componentWillMount() {
        this.getConfig()
    }
    componentDidMount() {

    }

    getConfig = () => {
        const _this = this
        vpAdd('/{vpplat}/entityConfigUpdate/getConfig', {}
        ).then(function (res) {
            let disabled = true
            if (res.data.accesslevel > 0) {
                disabled = false
            }
            _this.setState({
                disabled: disabled
            })
        }).catch(function (err) {

        });
    }

    uploadClick = () => {
        this.inputUploader.upload.on("beforeFileQueued", (file) => {
            this.props.form.setFieldsValue({ "sql_label": file.name })
            this.setState({
                isSelectFile: true
            })
        })
    }
    uploadSuccess = (file, res) => {
        /* if (this.inter != null) {
            window.clearInterval(this.inter);
        } */
        let tips = '失败'
        if (res.data.sucsess) {
            tips = '成功'
        }
        this.setState({
            percent: 100,
            tips: tips,
            loading: false,
            isSelectFile: false
        })
        this.props.form.setFieldsValue({ "sql": "", "sql_label": "" })
        this.inputUploader.upload.reset()
        if (res.data.sucsess) {
            setTimeout(() => {
                this.cancelModal()
            }, 1000);
        }
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
        let sql_label = this.props.form.getFieldValue("sql_label");
        if (sql_label == '' || sql_label == undefined) {
            this.setState({
                isSelectFile: false
            })
            VpAlertMsg({
                message: "消息提示",
                description: '请选择文件！',
                type: "info",
                closeText: "关闭",
                showIcon: true
            }, 5)
        } else {
            let isSelectFile = false
            let confirmTitle = ''
            if (sql_label.indexOf('init_override') >= 0) { //增量覆盖
                isSelectFile = true
                confirmTitle = '增量覆盖配置数据文件，继续将会更新本地已有的配置数据，是否继续？'
            } else if (sql_label.indexOf('init_complete') >= 0) { //全量覆盖
                isSelectFile = true
                confirmTitle = '全量覆盖配置数据文件，继续会删除本地已有的配置数据，是否继续？'
            } else {
                confirmTitle = ''
            }
            if (isSelectFile) {
                this.setState({
                    confirmTitle: confirmTitle,
                    isSelectFile: isSelectFile
                })
            } else {
                this.doConfirm()
            }

        }
    }
    doConfirm = () => {
        const _this = this
        this.setState({
            entityVisible: true,
            isSelectFile: false,
            tips: '升级中',
            percent: 0,
            loading: true
        }/* , () => {
            _this.inter = setInterval(() => {
                _this.increase()
            }, 200)
        } */)
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
        vpAdd('/{vpplat}/entityConfigUpdate/getBackList', {}
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
        vpDownLoad('/{vpplat}/entityConfigUpdate/download',
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
                <div onClick={this.uploadClick}>
                    <VpRow key={'inputRow'} >
                        <VpCol span={24}>
                            <VpInputUploader
                                form={this.props.form} item={{
                                    field_name: "sql",				    
                                    widget_type: "inputupload",
                                    field_label: "选择文件",
                                    all_line: 2,
                                    tips: '请选择（*.vpsql,*.sql）',
                                    auto: false,
                                    widget: {
                                        accept: {
                                            title: 'sql',
                                            extensions: 'sql,vpsql',
                                        },
                                        upload_url: (window.vp.config.URL.devflag ? "" : "/zuul") + "/{vpplat}/entityConfigUpdate/update",
                                    }
                                }}
				uploaderOptions={{timeout: 0}}
                                ref={upload => this.inputUploader = upload}
                                onUploadAccept={this.uploadSuccess} />
                        </VpCol>
                    </VpRow>
                </div>
                <div className="footFixed p-sm b-t text-center" style={{ marginBottom: 10 }}>
                    {
                        this.state.isSelectFile
                            ? <VpPopconfirm title={this.state.confirmTitle} onConfirm={this.doConfirm} onCancel={this.cancel}>
                                {
                                    this.state.disabled
                                        ? <VpButton className="vp-btn-br" type="primary" onClick={() => this.configUpdate()} disabled>升级</VpButton>
                                        : <VpButton className="vp-btn-br" type="primary" onClick={() => this.configUpdate()} >升级</VpButton>
                                }
                            </VpPopconfirm>
                            : this.state.disabled
                                ? <VpButton className="vp-btn-br" type="primary" onClick={() => this.configUpdate()} disabled>升级</VpButton>
                                : <VpButton className="vp-btn-br" type="primary" onClick={() => this.configUpdate()} >升级</VpButton>
                    }
                    <VpButton className="vp-btn-br" onClick={() => this.openBackModel()} style={{ marginLeft: 10 }}>下载备份</VpButton>
                </div>
                <VpModal
                    title='实体升级'
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
                <VpModal
                    title='备份文件下载'
                    visible={this.state.backVisible}
                    onCancel={() => this.cancelBackModal()}
                    width={'60%'}
                    footer={null}
                    style={{ height: '90%' }}
                    maskClosable={false}
                    wrapClassName='modal-no-footer'>
                    {this.state.backVisible ?
                        <div className="scroll full-height" style={{ marginLeft: 20 }} >
                            {/* <div className="bg-white p-sm" ><h4 className="p-b-sm fw b-b" >文件列表</h4></div>
                            <div className="bg-gray p-sm" key="titleDiv" >
                                <VpRow key={'titleRow'} >
                                    <VpCol span={5} className="text-left "><h4 >备份文件</h4></VpCol>
                                </VpRow>
                            </div> */}
                            <div className="bg-white">
                                {
                                    this.state.backFileList.map((item, index) => {
                                        let marginTop = 1
                                        if (index > 0) {
                                            marginTop = 10
                                        }
                                        return (
                                            <div key={"rowdiv" + index}  >
                                                <VpRow key={"row" + index} style={{ marginTop: marginTop, marginBottom: 3 }} align="left" >
                                                    <VpCol span={24} className="text-left cursor">
                                                        <a id={'filepath' + index} onClick={() => this.download(item.path)} >{item.path}</a>
                                                    </VpCol>
                                                </VpRow>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        : ''}
                </VpModal>
            </div>
        );
    }
}
export default entityConfigUpdate = VpFormCreate(entityConfigUpdate);