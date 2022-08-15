import React, { Component } from 'react';
import { requireFile } from 'utils/utils';
import {VpButton, VpFormCreate, VpIcon,VpPopconfirm ,VpDropdown,VpTabs 
    ,VpForm,VpFInput,VpCol,VpRadioGroup,VpRadio,VpFUpload
} from 'vpreact'
import EntityList from '../../../templates/dynamic/List/index';
import AddButton from "../../../templates/dynamic/List/AddButton";
import {vpAdd} from 'vpreact';

import {mergeButtons,randomKey} from "../../../templates/dynamic/utils";
import { VpFRadio,VpRow } from 'vpreact/public/Vp';
import { CustomVpFUploader } from "../../../templates/dynamic/Form/VpFUploader"

/**
 * 自定义添加按钮
 */
class CustomAddButton  extends AddButton.Component{   
    constructor(props){
        super(props);       
    }

    //注入参数
    getFormOptions(){       
        let _this = this
        return {
            accesserData:this.props.accesserData
        }
    }
    getRightBoxOptions(){
        return {
            max:false
        }
    }

    onSaveSuccess(formData,btnName){
        const taskid = this.accesserData.taskid;
        const piid = this.accesserData.piid;
        //建立评审流程与问题的关联关系
        vpAdd("/{bjyh}/flowAccess/accessProblemFormSave", {
            itemid:formData.data.iid,
            ...this.accesserData
        }).then((response) => {           
            if(btnName != 'saveAndNew'){
                this.closeRightModal();
            }
        })
 
    }
    
}
CustomAddButton = AddButton.createClass(CustomAddButton);


class ASK extends EntityList.NormalTable.Component{
    constructor(props){
        super(props);
        //console.log('Normal props ',this.props);
        
    }
    //自定义表更属性
    getCustomTableOptions(){
        return {
            scroll:{y:300},
            className:'problemList',
        }
    }

    //自定义操作列
    getCustomOperationColButtons(record){
        return ['delete']
    }

    //自定义表头，其他人屏蔽操作列
    onLoadHeaderSuccess(header){
        if(this.props.disable){
            for (let i = 0; i < header.length; i++) {
                if(header[i].key === 'operation'){
                    header.splice(i,1)
                    break
                }
            }
        }
    }

    //数据加载完后
    controlAddButton (numPerPage, resultList)  {        
        if(this.props.disable){
            super.controlAddButton(numPerPage,resultList)
        }else{
            let expandArr = this.getExpandedRowa(resultList, [])        
            //设置展开行
            this.setState({
                tableloading: false,
                expandedRowKeys: expandArr,
                tableHeight: resultList.length==0?150:resultList.length*40+10
            })
        }
    }

}
ASK = EntityList.NormalTable.createClass(ASK);

/**
 * 自定义表格
 */
class CustomizedEntityList2 extends  EntityList.Component{
    constructor(props){
        super(props);        
    }

    /**
     * 自定义按钮
     * @returns {*[]}
     */
    getCustomeButtons() {
        let _this = this;
        if(this.props.disable){
            return []
        }else{
            return [{
                name: "add",
                render: function (_thislist, props) {                
                    return (
                        <CustomAddButton {..._this.props} formType={''} entityid={_thislist.props.entityid} _contextid={_thislist._contextid} />
                    )
                }
            }]
        }
    }

    //搜索框隐藏
    showSearchInput(){
        return false;
    }

    //过滤器隐藏
    getFilterPosition =() => {
        return ''
    }

    renderNormalTable(props){        
        return <ASK  {...props} {...this.props} />;
    }

}
CustomizedEntityList2 = EntityList.createClass(CustomizedEntityList2);

 class Problemlist extends Component {
    constructor(props) {
        super(props)
        console.log('ProblemList -- ',this.props);
        this._contextid = this.props._contextid||randomKey();
    }

    render() {
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 19 },
            disabled:true
        };
        const fiedData = this.props.accesserData
        return (
            <div>

            {this.props.disable?
            <div style={{'margin-top':'50px'}}>
                <VpForm horizontal ref='form'>
                    <VpRow key='s0'>
                        <VpCol key='assesserval' span='12'>
                            <VpFInput disabled
                                label="评审人" labelCol={{span:6}} wrapperCol={{span:14 }}
                                value={fiedData.assesserval||''}
                                />
                        </VpCol>
                        <VpCol key='resultdate' span='12'>
                            <VpFInput disabled
                            label="反馈时间" labelCol={{span:6}} wrapperCol={{span:14}} 
                            value={fiedData.resdate||''}
                            />
                        </VpCol>
                    </VpRow>

                    <VpRow key='s1'>
                        <VpCol key='res' span='24'>
                            <VpFRadio
                                label="评审结论"
                                {...formItemLayout}>
                                <VpRadioGroup defaultValue={fiedData.results}>
                                    <VpRadio key='1' value='1'>{this.props.resultVal[1]}</VpRadio>
                                    <VpRadio key='3' value='3'>{this.props.resultVal[3]}</VpRadio>
                                    <VpRadio key='2' value='2'>{this.props.resultVal[2]}</VpRadio>
                                </VpRadioGroup>
                            </VpFRadio>    
                        </VpCol>
                    </VpRow>

                    <VpRow key='s2'>
                        <VpCol key='advice' span='24'>
                            <VpFInput type='textarea' rows={4} maxLength={2000}
                                label="评审意见" {...formItemLayout}
                                value={fiedData.advice}
                                />
                        </VpCol>
                    </VpRow>

                    {/* <VpRow key='s3'>
                        <VpCol key='files' span='24'>
                            <VpFUpload label='附件上传11' {...formItemLayout} >
                            </VpFUpload>
                        </VpCol>
                    </VpRow> */}
                </VpForm>
            </div>
            :null}

            {/* <div>
                <CustomizedEntityList2
                    entityid={16}
                    formType={'tabs'}
                    {...this.props}
                    defaultCondition={JSON.stringify([{
                        field_name:"saccessid",
                        field_value:this.props.accesserData.iid,
                        expression:'eq'
                    }
                ])}
                accesserData={this.props.accesserData} />
            </div> */}
            </div>

        )
    }
};

export default Problemlist = VpFormCreate(Problemlist);

