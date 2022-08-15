import React from 'react';

import {VpButton,VpIcon,VpAlertMsg} from 'vpreact'

import EntityList from '../templates/dynamic/List/index';

class CustomNormalTable extends  EntityList.NormalTable.Component{

    handleCust = () => {
        VpAlertMsg({ message:"操作成功", type:"info"})
    }

    /**
     * 表格自定义属性
     * @returns {}
     */
    getCustomTableOptions(){
        return {
            //dataUrl:'/{bjyh}/list'
        }
    }


    onLoadHeaderSuccess(headerData){
        headerData.splice(1,0,{
            dataIndex: "sdepartmentcode",
            key: "sdepartmentcode",
            sorter: false,
            title: "部门编码",
            width: 150,
        });
    }

    getCustomOperationColButtons(record){
        return ["like",{
            name:"cust",
            title:"自定义",
            iconType: "vpicon-mail",
            iconClassName:"text-primary m-lr-xs cursor",
            handler:this.handleCust,
        }]
    }
}
CustomNormalTable = EntityList.NormalTable.createClass(CustomNormalTable);

class ClassCustomList  extends EntityList.Component{

    renderNormalTable(props){
        return <CustomNormalTable {...props} />; //返回自定义的表格
    }

    onCustBtnClick = ()=> {
        VpAlertMsg({ message:"成功提示的文案", type:"info"})
    }
    getCustomeButtons() {
        let _this = this;
        return ["add","export",{
            name:"cust",
            render:function(_thislist,props){
                return (
                    <VpButton type="ghost" shape="circle" className="m-l-xs" onClick={_this.onCustBtnClick}>
                        <VpIcon type="book" />
                    </VpButton>
                )
            }
        }];
    }

}
ClassCustomList = EntityList.createClass(ClassCustomList);


class entitylist extends React.Component{

    render(){
        return (
            <ClassCustomList
                entityid = {this.props.params.entityid}//实体id
            />
        )
    }
}


export default entitylist;