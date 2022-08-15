import React from 'react';
import {
    VpRow, 
    VpCol, 
    VpIconFont,
    VpTooltip,
    VpRadioGroup, 
    VpRadioButton,
    VpModal,
    vpQuery,
    VpIframe
} from 'vpreact';
import { Link } from 'react-router';
import { SeachInput } from 'vpbusiness';
import './index.less';

export default class extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            icontype: {},
            showreport:false,
            title:'报表',
            quickvalue:'',
            filter:'',
            listdata:[],
            url:''
        }
    }
    componentWillMount() {
        this.getData()
    }
    getData=()=>{
        vpQuery('/{vpplat}/reportboard/list', {
            quickvalue:this.state.quickvalue,
            filter:this.state.filter
        }).then((response)=>{
            this.setState({
                listdata:response.data
            })
        })
    }
    handleClick = (e,index) => {
        $(`.dropDown-box_${index}`).slideToggle();
        if (this.state.icontype[index]) {
            this.state.icontype[index] = null;
        }else {
            this.state.icontype[index] = "vpicon-arrow-down";
        }
        this.setState({ icontype: this.state.icontype });
    }
    cardClick=(item)=>{
        this.setState({
            showreport:true,
            title:item.sname,
            url:item.staburl
        })
    }
    handleLike=(item)=>{
        let flag = 0;
        if(item.iflag == 0){
            flag = 1
        }else{
            flag = 0
        }
        vpQuery('/{vpplat}/reportboard/handlelike', {
            iid:item.iid,flag
        }).then((response)=>{
            this.getData()
        })
    }
    cancelModal=()=>{
        this.setState({
            showreport:false
        })
    }
    // 搜索框确定事件
    handlesearch=(value)=>{
        const searchVal = value.replace(/\s/g, "");
        this.setState({
            quickvalue: searchVal
        },()=>{
            this.getData()
        })
    }
    //过滤器
    handleViewChange = (e) => {
        this.setState({
            filter: e.target.value
        },()=>{
            this.getData()
        })
    }

    // 方法
    handleOpen=(item)=>{
	function getvl(name) {
            var reg = new RegExp("(^|\\?|&)"+ name +"=([^&]*)(\\s|&|$)", "i");
            if (reg.test(item.staburl)) return unescape(RegExp.$2.replace(/\+/g, " "));
            return "";
        };
	// alert(getvl("rpx"));
	
        var fulls = "left=0,screenX=0,top=0,screenY=0,scrollbars=1";    //定义弹出窗口的参数
	if (window.screen) {
	     var ah = screen.availHeight - 30;
	     var aw = screen.availWidth - 15;
	     fulls += ",height=" + ah;
	     fulls += ",innerHeight=" + ah;
	     fulls += ",width=" + aw;
	     fulls += ",innerWidth=" + aw;
	     fulls += ",resizable"
	} else {
	     fulls += ",resizable"; // 对于不支持screen属性的浏览器，可以手工进行最大化。 manually
	}
		
	vpQuery('/{vpplat}/api/all/getEReportParameter', {
            rpx: getvl('rpx'),
        }).then((response)=>{
	    var rpturl = rpthost+"/vpreport/valmRpt.jsp?sid=" + response.data.surl + "&stitle=" + item.sname;
	    window.open(rpturl, item.sname, fulls);
        })
    }


    render() {
        return(
            <div className="work-space pr full-height">
                <div className="subAssembly b-b bg-white">
                    <VpRow>
                        <VpCol span={4}><SeachInput onSearch={this.handlesearch}/></VpCol>
                        <VpCol span={4} className="p-l-sm">
                            <VpRadioGroup defaultValue="" onChange={this.handleViewChange}>
                                <VpRadioButton value="">全部</VpRadioButton>
                                <VpRadioButton value="like">我关注的</VpRadioButton>
                            </VpRadioGroup>
                        </VpCol>
                    </VpRow>
                </div>
                <div className="full-height scroll-y bg-white p-sm">
                    {
                        this.state.listdata.map((obj_item,obj_index) => {
                            return (
                                <VpRow gutter={20} key={obj_index}>
                                    <VpCol span={24} className="p-lr-sm fw">
                                        <div className="line-title dropDown pr p-b-xs">
                                            <span className="p-lr-sm bg-white pr">{obj_item.title}</span>
                                            <VpIconFont 
                                            type={this.state.icontype[obj_index] ? this.state.icontype[obj_index] : "vpicon-arrow-up"} 
                                            className="f12 pr cursor p-r-xs bg-white" 
                                            onClick={(e)=>this.handleClick(e,obj_index)} />
                                        </div>
                                    </VpCol>
                                    <VpCol span={24} className={`dropDown-box_${obj_index}`}>
                                        {
                                            obj_item.data.map((item, index) => {
                                                return (
                                                    <VpCol onClick={()=>this.cardClick(item)} key={index} className="gutter-row" style={{ paddingRight: 30 }} span={6}>
                                                        <div className="gutter-box b bg-white p-lg cursor pr">
                                                            <VpTooltip placement="top" title="关注">
                                                                <VpIconFont onClick={(e)=>{e.stopPropagation();this.handleLike(item)}} className="type" type={item.iflag==1?"vpicon-star":"vpicon-star-o"} />
                                                            </VpTooltip>
                                                            <VpRow gutter={16}>
                                                                <VpCol span={5} className="p-tb-md text-center">
                                                                    <VpIconFont className="text-primary f30" type={item.icontype ? item.icontype : "vpicon-charts"} />
                                                                </VpCol>
                                                                <VpCol className="p-sm" span={18} onClick={(e)=>{e.stopPropagation();this.handleOpen(item)}}>
                                                                    <p className="f16">
                                                                        <span>{item.sname}</span>
                                                                    </p>
                                                                    <p className="f12 m-t-xs text-muted">
                                                                        <span title={item.desc}>
                                                                            {item.desc||''}
                                                                        </span>
                                                                    </p>
                                                                </VpCol>
                                                            </VpRow>
                                                        </div>
                                                    </VpCol>
                                                )
                                            })
                                        }
                                    </VpCol>
                                </VpRow>
                            )
                        })
                    }
                </div>
		{
		/*
                <VpModal
                    title={this.state.title}
                    visible={this.state.showreport}
                    onCancel={() => this.cancelModal()}
                    width={'90%'}
                    style={{ top: '10%' }}
                    footer={null}
                    wrapClassName='modal-no-footer'
                >
                {
                  this.state.showreport?
                    <VpIframe url={this.state.url}/>
                  :null  
                }
                </VpModal>
		*/
		}
            </div>
        )
    }
}