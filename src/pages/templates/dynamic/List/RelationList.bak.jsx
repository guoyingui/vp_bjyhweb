import React, { Component } from 'react'
import {
    VpFormCreate,VpPopconfirm,vpAdd
} from 'vpreact';
import {
    SeachInput,
    RightBox,
} from 'vpbusiness';

import {connect} from 'react-redux';
import {changeQueryParams} from 'reduxs/actions/action';

import EntityList from './index';
import {mergeButtons,randomKey} from "../utils";

let NormalTable = EntityList.NormalTable;
let EditTable = EntityList.EditTable;
import RelEntityButton from './RelEntityButton';

/**
 * 关联关系关系标签页，一定要挂载在实体属性弹出框的标签页中
 *
 */



/**
 * 关联关系定制的列表表格，与NormalTable区别主要在列表操作列操作按钮
 */
class CustomNormalTable extends NormalTable.Component{

    /**
     * 移除关系
     * @param record
     */
    doRemoveRel(record) {
        const _this = this;
        let sparam = {
            irelationentityiid: record.iid,
            mainentityid: this.props.mainentityid,
            mainentityiid: this.props.mainentityiid,
            irelationentity: this.props.entityid,
            stabparam: this.props.stabparam
        }
        vpAdd('/{vpplat}/vfrm/entity/deleteRelation', {
            sparam: JSON.stringify(sparam)
        }).then(function (data) {
            _this.reloadTable();
        })

    }
    /**
     * 获取操作列列表的按钮
     */
    getOperationColButtons(record){
        let _this = this;
        let defaultBtns  ={
            "edit":{
                name:"like",
                title:'编辑',
                iconType:"vpicon-edit",
                iconClassName:"text-primary m-lr-xs cursor",
                handler:function(record){
                    _this.onRowClick(record);
                },
            },
            "delete":{
                name:"delete",
                title:'删除',
                iconType:'vpicon-close',
                iconClassName:"text-primary m-lr-xs cursor",
                doRemoveRel:this.doRemoveRel.bind(this,record),
                render:function(ContentClass,record,props,_thislist){
                    return <VpPopconfirm title="确定要删除这条信息吗？" onConfirm={props.doRemoveRel}>
                        <span><ContentClass /></span>
                    </VpPopconfirm>
                }
            }
        }

        let buttons = this.getCustomOperationColButtons(record);
        if(!buttons){
            //如果没有自定义操作按钮，使用默认提供的
            buttons = [];
            if(this.props.entityaddrole){
                buttons.push("edit");
                buttons.push("delete");
            }
        }
        buttons = mergeButtons(buttons,defaultBtns);
        return buttons.map((btnItem,btnIndex) => {
            if(btnItem.handler){
                btnItem.handlerWrap = this.onOperationColButtonClick.bind(this,btnItem,record);
            }
            return btnItem;
        });
    }
}
CustomNormalTable = NormalTable.createClass(CustomNormalTable); //一定记得调用此方法


/**
 * 关联关系列表定义类，与EntityList主要区别在
 *  1. 表格上方操作按钮
 *      表格上方按钮只有添加和关联
 *  2. props参数转换
 *      将从实体属性tabs中传进来的参数转换成EntityList识别的参数
 */
 class RelationList extends EntityList.Component{
     /**
      *
      * @param props {
      *     entityid:  //主实体id,
      *     iid: //主实体iid,
      *     entityrole: //是否可写
      *     stabparam: //关联关系字段
      *     iaccesslevel:  //(0:读1:写)
      * }
      */
     constructor(props){

         debugger;
         /**
          * 因为RelationList是挂接在tabs下的所以传入的参数与从链接传入的参数不同，需要做转换：
          * 将entityid转换成mainentityid、iid转成mainentityiid等,从skey提取entityid
          */
         let {entityid,iid,skey,...otherProps} = props;
         let curentityid = skey.replace(/[^0-9]/ig, "")//权限码中提取数字，数字即为当前挂起的实体id
         let newProps = {...otherProps||{}}
         newProps.mainentityid = entityid; //主实体entityid
         newProps.mainentityiid = iid; //主实体iid
         newProps.entityid = curentityid;
         newProps.formType='tabs';//从关联关系标签页中
         newProps.viewtype='list';

         super(newProps);
         console.log(this.props);
     }

     renderViewSwitch(){
         //不显示视图切换
         return null;
     }

     getFilterPosition(){
         //不显示过滤器
         return "none";
     }

     renderNormalTable(props){
         return (
             <CustomNormalTable {...props} />
         )
     }

     getCustomeButtons(){
         if(!this.state.entityaddrole){
             //没有编辑权限时
             return [];
         }

         return ["add",{
             //关联实体按钮
             name:"relEntity",
             render:function(_thislist,props){
                 return (
                     <RelEntityButton {...props} />
                 )
             }
         }]
     }
 }
RelationList = EntityList.createClass(RelationList); //一定记得调用此方法
RelationList.NormalTable = CustomNormalTable;

export default RelationList;