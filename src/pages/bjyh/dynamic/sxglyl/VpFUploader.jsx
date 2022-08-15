import React, { Component } from 'react';
import uploader from 'webuploader';
import { VpTooltip, VpIconFont, VpAlertMsg, VpModal, VpIcon, VpTable, VpUploader, VpButton, vpAdd, vpDownLoad, VpDatePicker, VpInput } from 'vpreact';
import { formatDateTime } from 'utils/utils';
import {vpPostAjax2} from "pages/templates/dynamic/utils";
// 表单附件上传
export class VpFUploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            childNodes: [],
            updateid: '',
            visible: false,
            fileNumLimit: 300,
            params: {user_code:vp.cookie.getTkInfo().userid,user_name:vp.cookie.getTkInfo().nickname},
            selectType: '',
            dataSource: [],
            columns: [
                {
                    title: '序号',
                    dataIndex: 'num',
                    key: 'num',
                },
                {
                    title: '附件名称',
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    title: '版本',
                    dataIndex: 'version',
                    key: 'version',
                },
                {
                    title: '上传日期',
                    dataIndex: 'date',
                    key: 'date',
                },
                {
                    title: '上传人',
                    dataIndex: 'people',
                    key: 'people',
                },
                {
                    title: '操作',
                    key: 'todo',
                    render: (text, record) => {
                        let file = record;
                        //获取全局附件预览开关值
                        file.options.preview = window.vp.config.fileView;
                        const { disabled, readonly } = this.props.item;
                        return (
                            <div className="upload-option">
                                {
                                    file.options.download ?
                                        // <span onClick={this.downloadFile.bind(this, file.fileid)}>下载</span> :
                                        <VpTooltip title="下载">
                                            <VpIconFont type="text-info m-lr-xs cursor vpicon-clouddownloado" onClick={this.downloadFile.bind(this, file.fileid)} />
                                        </VpTooltip> :
                                        null
                                }
                                {
                                    file.options.update && !(disabled || readonly) ?
                                        // <span onClick={this.updateFile.bind(this, file.fileid, file.doctype,true)}>重新上传</span> :
                                        <VpTooltip title="版本更新">
                                            <VpIconFont type="text-info m-lr-xs cursor vpicon-clouduploado" onClick={this.updateFile.bind(this, file.fileid, file.doctype, true)} />
                                        </VpTooltip> :
                                        null
                                }
                                {
                                    file.options.delete && !(disabled || readonly) ?
                                        // <span onClick={this.removeFile.bind(this, file.fileid)}>删除</span> :
                                        <VpTooltip title="删除">
                                            <VpIconFont type="text-danger m-lr-xs cursor vpicon-shanchu" onClick={this.removeFile.bind(this, file.fileid)} />
                                        </VpTooltip> :
                                        null
                                }
                                {
                                    file.options.preview  && !(disabled || readonly) ?
                                        // <span onClick={this.preView.bind(this, file.fileextension)}>预览</span> :
                                        <VpTooltip title="在线预览">
                                            <VpIconFont type="text-info m-lr-xs cursor vpicon-see-o" onClick={this.preView.bind(this, file)} />
                                        </VpTooltip> :
                                        null
                                }
                                {
                                    file.options.edit && !(disabled || readonly) ?
                                        <VpTooltip title="在线编辑">
                                            <VpIconFont type="text-info m-lr-xs cursor vpicon-edit" />
                                        </VpTooltip> :
                                        null
                                }
                            </div>
                        )
                    }
                }
            ]
        }
        this.getUploaderQueue = this.getUploaderQueue.bind(this)
    }
    componentWillMount() {
        const { item, downloadUrl, uploadUrl } = this.props;
        const { filestyle, ischosefiletype } = this.props.item;
        filestyle == 1 && ischosefiletype == 1 ?
            this.state.columns.splice(2, 0, {
                title: '附件类型',
                dataIndex: 'type'
            })
            : null;
        // const childNodes = JSON.parse(JSON.stringify(item.widget.load_template).toLowerCase()) || [];
        const childNodes = item.widget.load_template || [];
        childNodes.map((file, idx) => {
            //  file.id 是upload插件内的标识 ， file.fileId 是前后台传输的唯一标识
            if (!file.id) {
                childNodes[idx].id = childNodes[idx].fileid;
            }
        })
        this.setState({
            childNodes,
            fileTypes: item.widget.select_type || []
        })
        this.uploadUrl = (item.widget && item.widget.upload_url) || uploadUrl || window.vp.config.jgjk.xqbg.uploadfileUrl;
        this.downloadUrl = window.vp.config.jgjk.xqbg.downloadfileUrl;
    }
    componentDidMount() {
        const _this = this;
        let _uploader = uploader.create({
            // dnd: this.refs.dnd,
            swf: '../vpstatic/plugins/webUploader/Uploader.swf',
            disableGlobalDnd: true,
            timeout: 0,
            auto: true,
            server: window.vp.config.jgjk.xqbg.uploadfileUrl,
            pick: {
                id: this.refs.upload,
                multiple: false,
            },
        });


        _uploader.on('dndAccept', (items) => {
            // console.log(items);
        })
        _uploader.on('fileQueued', (file) => {
            _uploader.makeThumb(file, (error, src) => {
                let childNodes = _this.state.childNodes.slice(0);
                console.log(file.Status, src)
                childNodes.push({ ...file, status: 'queued' });
                _this.setState({ childNodes });
            });
        });

        _uploader.on('uploadBeforeSend', (obj, data, headers) => {
            if (!_this.updateid) return;
            headers['Authorization'] = 'Bearer ' + window.vp.cookie.getToken()
            data.fileid = _this.updateid;
            if (_this.props.params) {
                for (var key in _this.props.params) {
                    data[key] = _this.props.params[key];
                }
            }
            _this.updateid = '';
        });

        _uploader.on('startUpload', (file) => {
            console.log('开始上传时触发。');
            console.log(file);
        });

        _uploader.on('uploadProgress', (file, percentage) => {
            const fileIdx = _this.findFileIdx(file);
            let childNodes = _this.state.childNodes.slice(0);
            childNodes[fileIdx].status = 'progress';
            childNodes[fileIdx].percentage = percentage;
            _this.setState({
                childNodes
            })
        })

        _uploader.on('uploadAccept', (file, ret) => {
            const infocode = ret.infocode ? ret.infocode.slice(0, 3) : '';
            // const newData = JSON.parse(JSON.stringify(ret.data).toLowerCase());
            const newData = ret.data;
            switch (infocode) {
                case 'VP0':
                    const { setFieldsValue, getFieldValue } = _this.props.form;
                    console.log(file, ret)
                    const fileIdx = _this.findFileIdx(file.file);

                    let childNodes = _this.state.childNodes.slice(0);
                    const idx = childNodes.findIndex((file) => {
                        return newData.fileid == file.fileid
                    })

                    childNodes[fileIdx].status = 'complete';
                    childNodes[fileIdx].creator = newData.creator;
                    childNodes[fileIdx].doctype = newData.doctype || '';
                    childNodes[fileIdx].filename = newData.filename;
                    childNodes[fileIdx].createtime = newData.createtime;
                    childNodes[fileIdx].fileid = newData.fileid;
                    childNodes[fileIdx].options = newData.options || {};
                    childNodes[fileIdx].fileextension = newData.fileextension;
                    if (idx !== -1) {
                        childNodes[idx] = childNodes[fileIdx];
                        childNodes.pop();
                    }

                    _this.setState({
                        childNodes
                    }, () => {
                        let formValue = this.state.childNodes.slice(0).map((file) => {
                            return file.fileid;
                        }).join(',');
                        setFieldsValue({ [_this.props.item.field_name]: formValue })
                    })
                    break;
                case 'VP1':
                    VpAlertMsg({
                        message: "消息提示",
                        description: `${ret.infocode}：${ret.msg}`,
                        type: "info",
                        closeText: "关闭",
                        showIcon: true
                    }, 5);
                    return false;
                    break;
                case 'VP2':
                    VpAlertMsg({
                        message: "警告提示",
                        description: `${ret.infocode}：${ret.msg}`,
                        type: "warning",
                        closeText: "关闭",
                        showIcon: true
                    }, 5);
                    return false;
                    break;
                case 'VP3':
                    VpAlertMsg({
                        message: "错误提示",
                        description: `${ret.infocode}：${ret.msg}`,
                        type: "error",
                        closeText: "关闭",
                        showIcon: true
                    });
                    return false;
                    break;
                default:
                    break;
            }
        })

        _uploader.on('uploadError', (file) => {
            const fileIdx = _this.findFileIdx(file);
            let childNodes = _this.state.childNodes.slice(0);
            childNodes[fileIdx].status = 'error'
            _this.setState({
                childNodes
            })
            console.log(file);
        });

        _uploader.on('error', (type) => {
            switch (code) {
                case 'Q_EXCEED_NUM_LIMIT':
                    code = '超出可上传数量';
                    break;
                case 'Q_EXCEED_SIZE_LIMIT':
                    code = '超出可上传大小';
                    break;
                case 'Q_TYPE_DENIED':
                    code = '文件类型不满足或上传大小为0';
                    break;
                case 'F_DUPLICATE':
                    code = '请勿重复上传文件';
                    break;
            }
            VpAlertMsg({
                message: "警告提示",
                description: `${code}`,
                type: "warning",
                closeText: "关闭",
                showIcon: true
            }, 5);
        })

        this.upload = _uploader;
        let id = '.' + this.props.item.field_name;
        this.upload.addButton({
            id,
            innerHTML: '版本更新'
        });
    }
    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.data) !== JSON.stringify(this.props.data)) {
            this.setState({
                // childNodes: JSON.parse(JSON.stringify(nextProps.data).toLowerCase())
                childNodes: []
            })
        }
    }
    componentDidUpdate() {
        let id = '.' + this.props.item.field_name;
        this.upload.addButton({
            id,
            innerHTML: '版本更新'
        });
        this.upload.refresh();
    }
    findFileIdx = (file) => {
        const childNodes = this.state.childNodes.slice(0);
        return childNodes.findIndex((item) => {
            return item.id == (file.id ? file.id : file)
        })
    }
    removeFile = (fileid) => {
        const { setFieldsValue, getFieldValue } = this.props.form;
        let childNodes = this.state.childNodes.slice(0);
        const idx = childNodes.findIndex((file) => {
            return fileid == file.fileid
        })

        this.setState({
            childNodes: [
                ...childNodes.slice(0, idx),
                ...childNodes.slice(idx + 1),
            ]
        }, () => {
            let formValue = this.state.childNodes.slice(0).map((file) => {
                return file.fileid;
            }).join(',');
            setFieldsValue({ [this.props.item.field_name]: formValue })
        })
    }
    chooseFileOptions = (file) => {
        const { disabled, readonly } = this.props.item;
        if (file.status == 'progress') {
            return (
                <div>
                    <VpIcon type="clock-circle" className="text-warning p-r-sm" />
                    <b>{file.filename}</b>
                    <div className="upload-option">
                        <div className="progress">
                            <span className="text">{(file.percentage * 100).toFixed(2)}%</span>
                            <span className="percentage" style={{ width: file.percentage }}></span>
                        </div>
                    </div>
                </div>
            )
        } else if (file.status == 'complete' || file.options) {
            //获取全局附件预览开关值
            //file.options.preview = window.vp.config.fileView;
            file.options.preview = true;
            return (
                <div>
                    <VpIcon type="check-circle" className="text-success p-r-sm" />
                    <b>{file.filename}</b>
                    {
                        file.options ?
                            <div className="upload-option">
                                {file.options.delete && !(disabled || readonly) ? <span onClick={this.removeFile.bind(this, file.fileid)}>删除</span> : null}
                                {file.options.download ? <span onClick={this.downloadFile.bind(this, file.fileid)}>下载</span> : null}
                                {file.options.preview ? <span onClick={this.preView.bind(this, file)}>预览</span> : null}
                                {file.options.edit && !(disabled || readonly) ? <span>在线编辑</span> : null}
                                {/* {file.options.update ? <div style={{display: 'inline-block',padding: '0 5px',lineHeight: '25px'}} className={this.props.item.field_name} onClick={this.updateFile.bind(this, file.fileid)}></div> : null} */}
                                {file.options.update && !(disabled || readonly) ? <span onClick={this.updateFile.bind(this, file.fileid, file.doctype)}>版本更新</span> : null}
                            </div>
                            : null
                    }
                </div>
            )
        } else if (file.status == 'error') {
            return (
                <div>
                    <VpIcon type="cross-circle" className="text-danger p-r-sm" />
                    <b>{file.filename}</b>
                    <div className="upload-option">
                        <span data-id={file.id} onClick={this.removeFile}>删除</span>
                    </div>
                </div>
            )
        }
    }
    updateFile = (updateid, doctype, reset) => {
        this.updateid = updateid
        this.setState({
            fileNumLimit: 1,
            params: { fileid: updateid },
            visible: true,
            selectType: doctype
        });
        // $("#" + this.props.item.field_name + " .webuploader-element-invisible").click();
    }

    preView = (file) => {
        let { fileid, filename } = file;
        filePrevire(fileid, filename);
    }
    downloadFile = (fileid) => {
        vpDownLoad(this.downloadUrl, { fileid, iaccesslevel: 1 })
    }
    uploadFile = () => {
        this.setState({
            visible: true,
            selectType: '',
            dataSource: []
        });
    }
    handleCancel = () => {
        this.updateid = '';
        this.setState({
            visible: false,
            fileNumLimit: 300
        });
    }

    getUploaderQueue() {
        return this.refs.uploadModal.getUploaderQueue()
    }

    handleOk = () => {
        const { setFieldsValue, getFieldValue } = this.props.form;
        const uploadList = this.refs.uploadModal.getUploaderQueue();
        let childNodes = [...this.state.childNodes];
        this.props.onChange && this.props.onChange(uploadList, childNodes)
        if (this.updateid) {
            const idx = childNodes.findIndex((file) => {
                return this.updateid == file.fileid
            })
            if (idx !== -1) {
                childNodes[idx] = uploadList[0];
            }
            this.updateid = '';
        } else {
            childNodes = [...this.state.childNodes, ...uploadList]
        }
        this.setState({
            visible: false,
            fileNumLimit: 300,
            childNodes
        }, () => {
            let formValue = '';
            if (this.props.item.widget.select_type) {
                formValue = this.state.childNodes.slice(0).map((file) => {
                    return { id: file.fileid, type: file.doctype }
                })
                formValue = JSON.stringify(formValue);
            } else {
                formValue = this.state.childNodes.slice(0).map((file) => {
                    return file.fileid;
                }).join(',');
            }

            setFieldsValue({ [this.props.item.field_name]: formValue })
        });
    }
    filenameOnChange = (e, idx) => {
        const { childNodes } = this.state
        childNodes[idx].filename = e.target.value
        this.setState(() => childNodes)
    }
    createTimeOnChange = (e, idx) => {
        const { childNodes } = this.state
        childNodes[idx].createtime = +e
        this.setState(() => childNodes)
    }
    render() {
        const { disabled, readonly, filestyle, ischosefiletype, tableheight, modalheight } = this.props.item;
        this.state.dataSource = [];
        return (
            <div className="dynamic-upload-wrapper">
                <div ref="dnd">
                    {
                        !filestyle ?
                            <div className="inline-display">
                                <ul ref="list" className="uploader-list">
                                    {
                                        this.state.childNodes.map((file, idx) => {
                                            return (
                                                <li key={file.fileid && file.createtime ? file.fileid + file.createtime : idx}>
                                                    {this.chooseFileOptions(file)}
                                                    <p>
                                                        文件名:{
                                                            (this.props.sxsqflag && (file.creator == vp.cookie.getTkInfo('nickname')))?
                                                                <span className="inline-display"><VpInput style={{ width: '500px' }} onChange={(e) => this.filenameOnChange(e, idx)} rows={1} type="textarea" defaultValue={file.filename} /></span> :
                                                                <span>{file.filename}&nbsp;&nbsp;&nbsp;</span>
                                                        }
                                                        文件大小: {uploader.formatSize(file.size)}&nbsp;&nbsp;&nbsp;
                                                        {file.creator ? <span>上传人: {file.creator} </span> : null}&nbsp;&nbsp;&nbsp;
                                                        {
                                                            //file.createtime ? <span>上传时间:{formatDateTime(new Date(parseInt(file.createtime)))} </span> : null
                                                            //上帝模式中 上传时间渲染成可编辑的Input，可供修改
                                                            file.createtime ? this.props.godMode ?
                                                                <span>上传时间:<VpDatePicker format="yyyy-MM-dd HH:mm:ss" onChange={(e) => this.createTimeOnChange(e, idx)}
                                                                    showTime defaultValue={file.createtime} />
                                                                </span>
                                                                :
                                                                <span>上传时间:{file.createtime} </span>
                                                                : null
                                                        }
                                                    </p>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                                {
                                    disabled || readonly ? null :
                                        <div className="upload-option" onClick={this.uploadFile}>
                                            <span>添加附件</span>
                                        </div>
                                }
                            </div>
                            :
                            <div className="bg-white bottom-icon">
                                {
                                    this.state.childNodes.map((item, index) => {
                                        this.state.dataSource.push({
                                            fileid: item.fileid,
                                            num: index + 1,
                                            name: item.filename,
                                            type: item.fileresponse ? item.fileresponse.sfiletype : item.sfiletype,
                                            version: item.fileresponse ? item.fileresponse.sversion : item.sversion,
                                            date: formatDateTime(new Date(parseInt(item.createtime))),
                                            people: item.creator,
                                            options: item.options
                                        });
                                    })
                                }
                                <VpTable
                                    columns={this.state.columns}
                                    dataSource={this.state.dataSource}
                                    emptyData
                                    scroll={{ y: tableheight }}
                                    pagination={false} />
                                <div className="clearfix m-sm m-b-none">
                                    {
                                        disabled || readonly ? null :
                                            <div className="fl">
                                                <div className="page-options-wrapper">
                                                    <span className="p-r-sm">
                                                        <VpTooltip placement={'top'} title={"上传"}>
                                                            <VpIcon type="vpicon-clouduploado text-info cursor" onClick={this.uploadFile} />
                                                        </VpTooltip>
                                                    </span>
                                                </div>
                                            </div>
                                    }
                                    <div className="fr">
                                        <span>{`共 ${this.state.dataSource.length} 条`}</span>
                                    </div>
                                </div>
                            </div>
                    }
                    <div className="hide" id={this.props.item.field_name} ref="upload"></div>
                    <VpModal
                        width="60%"
                        // style={{ height: '70%', maxHeight: '630px'}}
                        style={{ height: modalheight }}
                        title="附件上传"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={
                            <div className="text-center">
                                <VpButton type="primary vp-btn-br" onClick={this.props.handleOk || this.handleOk}>确定</VpButton>
                                <VpButton type="ghost vp-btn-br" onClick={this.props.handleCancel || this.handleCancel}>取消</VpButton>
                            </div>
                        }>
                        {this.state.visible ? <VpUploader
                            fileTypes={this.state.fileTypes}
                            fileNumLimit={this.state.fileNumLimit}
                            params={{ ...this.props.params, ...this.state.params }}
                            selectType={this.state.selectType}
                            server={window.vp.config.jgjk.xqbg.uploadfileUrl}
                            onUploadAccept={this.props.onUploadAccept ? this.props.onUploadAccept : () => { }}
                            onUploadError={this.props.onUploadError ? this.props.onUploadError : () => { }}
                            ref="uploadModal"
                            auto={true} /> : null}
                    </VpModal>
                </div>

            </div>
        )
    }
}
//根据文件名获取文件格式，解决保存后获取不到fileextension
export function getFileType(filename) {
    return filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
}
//附件预览方法
export function filePrevire(fileid, filename) {
    //保存成功后，调用“流程表单同步到实体表单”接口
    let urls=window.vp.config.jgjk.xqbg.getprevireurl+fileid+"/get-online-edit-url?user_id="+vp.cookie.getTkInfo('userid');
    // console.log("urls",urls)
    vpQuery(urls,{}).then((res) => {
        // console.log("response7",res)
        let url=  res.response.url;
        if(url!=null||url!='') {
            //调用预览服务
            window.open(url);
        }
    });

}