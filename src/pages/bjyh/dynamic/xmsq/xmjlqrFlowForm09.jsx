import React, { Component } from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';
import { vpQuery, vpAdd, VpAlertMsg, VpMWarning } from 'vpreact';
import { formDataToWidgetProps } from '../../../templates/dynamic/Form/Widgets';
import { validationRequireField, singleInputFill, initHiddenColumn, xmsqHiddenColumn, initHiddenColumn_history, initHiddenColumn_swxx } from '../code';
import { findFiledByName } from 'utils/utils';

//项目申请
var iyspctemp = '0';

/**
 * 项目经理申请资源
 */
class xmjlqrFlowForm09 extends FlowForm.Component {
    constructor(props) {
        super(props);
        this.state.moduserprops = {
            ismoduser: true,//是否启用更改处理人
        }
    }
    componentWillMount() {
        super.componentWillMount()
    }

    componentDidMount() {
        super.componentDidMount()
        !this.props.isHistory && this.checkPJnameRepeat()
    }

    onFormRenderSuccess(formData) {
        initHiddenColumn(iyspctemp)
        vpQuery('/{bjyh}/xzxt/shifouzfry', { loginname: vp.cookie.getTkInfo('username') }).then((response) => {
            if (response.flag == '1') {
                initHiddenColumn_swxx(formData);
                const buttons = this.state.newButtons;
                buttons.map(item => {
                    if (item.name === 'ok') {
                        item.className = 'hidden'
                    }
                })
                this.setState({ newButtons: buttons })
            }
        })
    }

    // 加载成功后执行
    onDataLoadSuccess = (formData, handlers) => {

        // 删除生产环境的bjyhweb的div标签元素
        let devflag = window.vp.config.URL.devflag;
        if (!devflag) {
            if (document.getElementById("bjyhweb")) {
                document.getElementById("bjyhweb").remove()
            }
        }

        let _this = this
        let ixmbq1 = formData.findWidgetByName('ixmbq1')
        ixmbq1.field.props.label = "项目标签";
        //增加了ixmbq2 自动赋值
        const ixmbq2 = formData.findWidgetByName('ixmbq2')
        ixmbq2 && (ixmbq2.field.props.label = "项目标签");
        if (ixmbq1.field.fieldProps.initialValue == null || ixmbq1.field.fieldProps.initialValue == '' || ixmbq1.field.fieldProps.initialValue == undefined) {
            ixmbq2 && (ixmbq1.field.fieldProps.initialValue = ixmbq2.field.fieldProps.initialValue);
        }
        
        //1） 如果预算为0，则默认自主开发；预算非0,则默认合作开发；
        let ikfms = formData.findWidgetByName('ikfms');
        if (ikfms.field.fieldProps.initialValue == null || ikfms.field.fieldProps.initialValue == '' || ikfms.field.fieldProps.initialValue == undefined) {
            let fbxmyjtrjeVal = formData.findWidgetByName('fbxmyjtrje').field.fieldProps.initialValue;
            if (fbxmyjtrjeVal == 0) {
                ikfms.field.fieldProps.initialValue = '0';
            } else {
                ikfms.field.fieldProps.initialValue = '1';
            }
        }

        /* pmo退回时(08) 默认展开pmo节点 */
        let pmoStepKey = ''
        handlers.map(item => {
            if (item.flag == 'SYSN') {
                pmoStepKey = item.stepkey
            }
        })

        // 附件增加删除功能
        let rfj = formData.findWidgetByName('rfj');
        let arrfile = rfj.field.props.widget.load_template;
        arrfile.map(item => {
            item.options.delete = true;
        })
        if(pmoStepKey){
            vpAdd('/{bjyh}/xmsq/getStepInfoBysid', {
                piid: _this.props.piid, stepkey: pmoStepKey
            }).then(res => {
                if (!res.data) {
                    //找到pmo节点
                    let _formDataGroup = JSON.parse(JSON.stringify(formData.groups))
                    let pmoIndex = ''
                    for (let index = 0; index < _formDataGroup.length; index++) {
                        const element = _formDataGroup[index]
                        if (element.group_code == '08') {//PMO节点编码08
                            pmoIndex = index
                            element.group_type = 1
                            break
                        }
                    }
                    //将state.activeKeys存的是要‘展开’的节点的编码/index？ 数组类型
                    //通过数组操作添加或移除节点编号 来实现节点的展开/折叠
                    _this.state.activeKeys.splice(_this.state.activeKeys.findIndex(item => item == pmoIndex), 1)
                    _this.setState({ activeKeys: _this.state.activeKeys })
    
                }
            })
        }
        
        /*  */

        /* 根据项目经理结论影响审批radio */
        let ixmjlqrjl = formData.findWidgetByName('ixmjlqrjl');
        let scondition = formData.findWidgetByName('scondition');
        /*if(scondition&&ixmjlqrjl){
            
            switch(ixmjlqrjl.field.fieldProps.initialValue*1){
                case 1:
                    scondition.field.props.options_.map(item=>{
                        if(item.value=='SYSO'){
                            item.hidden=false
                        }else if(item.value=='SYSP'){
                            item.hidden=true
                        }
                    })
                    this.props.form.setFieldsValue({scondition:'SYSO'})
                    break
                case 2:
                    this.props.form.setFieldsValue({scondition:'SYSN'})
                    break
                case 3:
                    scondition.field.props.options_.map(item=>{
                        if(item.value=='SYSP'){
                            item.hidden=false
                        }else if(item.value=='SYSO'){
                            item.hidden=true
                        }
                    })
                    this.props.form.setFieldsValue({scondition:'SYSP'})
                    break
            }
        } */
        //兼顾旧版本,20211012后开始不用这个字段了，后续的开发者，可适当取消下面的这段代码。
        if(ixmjlqrjl){
            //项目经理结论radio点击事件
            ixmjlqrjl.field.fieldProps.onChange = e => {
                let val = e.target.value
                let eobj = { target: { value: '' } }
                //SYSN:PMO,SYSO:返回开发,SYSP:返回业务
                switch (val * 1) {
                    case 1:
                        scondition.field.props.options_.map(item => {
                            if (item.value == 'SYSO') {
                                item.hidden = false
                            } else if (item.value == 'SYSP') {
                                item.hidden = true
                            }
                        })
                        this.props.form.setFieldsValue({ scondition: 'SYSO' })
                        eobj.target.value = 'SYSO'
                        this.handleCondition(eobj)
                        break
                    case 2:
                        this.props.form.setFieldsValue({ scondition: 'SYSN' })
                        eobj.target.value = 'SYSN'
                        this.handleCondition(eobj)
                        break
                    case 3:
                        scondition.field.props.options_.map(item => {
                            if (item.value == 'SYSP') {
                                item.hidden = false
                            } else if (item.value == 'SYSO') {
                                item.hidden = true
                            }
                        })
                        this.props.form.setFieldsValue({ scondition: 'SYSP' })
                        eobj.target.value = 'SYSP'
                        this.handleCondition(eobj)
                        break
                }
            }
        }else{
            //获取项目等级信息
            let ixmdj_xmsxxx = formData.findWidgetByName('ixmdj_xmsxxx');
            if(ixmdj_xmsxxx){
                //根据项目等级处理是否进行架构评审。只有A级项目才进行架构评审。
                ixmdj_xmsxxx.field.fieldProps.onChange = e =>{
                    //下拉选中的值
                    let val = e
                    let eobj = { target: { value: '' } }
                    //sysn:提交pmo sysp:返回业务 syso:返回开发 */
                    if(val==1){
                        //如果是A类项目:显示提交架构隐藏提交PMO分支
                        scondition.field.props.options_.map(item => {
                            if (item.value == 'SYSJ') {
                                item.hidden = false
                            } else if (item.value == 'SYSN') {
                                item.hidden = true
                            }
                        })
                        this.props.form.setFieldsValue({ scondition: 'SYSJ' })
                        eobj.target.value = 'SYSJ'
                        this.handleCondition(eobj)
                    }else{
                        //不是A类项目，则默认提交到PMO
                        scondition.field.props.options_.map(item => {
                            if (item.value == 'SYSN') {
                                item.hidden = false
                            } else if (item.value == 'SYSJ') {
                                item.hidden = true
                            }
                        })
                        this.props.form.setFieldsValue({ scondition: 'SYSN' })
                        eobj.target.value = 'SYSN'
                        this.handleCondition(eobj)
                    }
                }
            }
        }
        /*  */
        //根据预算数量隐藏...
        let iyspc = formData.findWidgetByName('iyspc');
        if (_this.props.isHistory) {
            initHiddenColumn_history(formData)
        }
        iyspctemp = iyspc && iyspc.field.fieldProps.initialValue;
        iyspc.field.fieldProps.onChange = (v) => {
            if (v == "0") {
                _this.props.form.setFieldsValue({
                    'sysbh1': '',
                    'sysbh2': '',
                    'sysbh3': '',
                    'sysbh4': '',
                    'sysbh5': '',
                    'sysmc1': '',
                    'sysmc2': '',
                    'sysmc3': '',
                    'sysmc4': '',
                    'sysmc5': '',
                })
                document.getElementById('sysbh1').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysbh2').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysbh3').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysbh4').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysbh5').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysmc1').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysmc2').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysmc3').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysmc4').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysmc5').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
            } else if (v == "1") {
                _this.props.form.setFieldsValue({
                    'sysbh2': '',
                    'sysbh3': '',
                    'sysbh4': '',
                    'sysbh5': '',
                    'sysmc2': '',
                    'sysmc3': '',
                    'sysmc4': '',
                    'sysmc5': '',
                })
                document.getElementById('sysbh1').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysbh2').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysbh3').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysbh4').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysbh5').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysmc1').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysmc2').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysmc3').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysmc4').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysmc5').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
            } else if (v == "2") {
                let obj = _this.props.form.getFieldsValue(['sysbh1', 'sysmc1', 'scpmc'])
                console.log('obj...', obj);
                _this.props.form.setFieldsValue({
                    'sysbh3': '',
                    'sysbh4': '',
                    'sysbh5': '',
                    'sysmc3': '',
                    'sysmc4': '',
                    'sysmc5': '',
                })
                document.getElementById('sysbh1').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysbh2').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysbh3').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysbh4').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysbh5').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysmc1').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysmc2').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysmc3').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysmc4').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysmc5').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
            } else if (v == "3") {
                _this.props.form.setFieldsValue({
                    'sysbh4': '',
                    'sysbh5': '',
                    'sysmc4': '',
                    'sysmc5': '',
                })
                document.getElementById('sysbh1').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysbh2').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysbh3').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysbh4').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysbh5').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysmc1').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysmc2').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysmc3').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysmc4').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysmc5').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
            } else if (v == "4") {
                _this.props.form.setFieldsValue({
                    'sysbh5': '',
                    'sysmc5': '',
                })
                document.getElementById('sysbh1').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysbh2').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysbh3').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysbh4').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysbh5').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysmc1').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysmc2').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysmc3').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysmc4').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysmc5').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
            } else if (v == "5") {
                document.getElementById('sysbh1').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysbh2').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysbh3').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysbh4').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysbh5').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysmc1').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysmc2').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysmc3').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysmc4').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysmc5').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
            }
        }
        /**
         * 修改表单上 
         *  1.项目等级_项目属性信息 -> 项目等级
         *  2.项目属性_PMO -> 项目属性
         *  3.涉及系统_PMO -> 涉及系统
         * 字段的展示名称
         */
        //
        try {
            let ixmdj_xmsxxx = formData.findWidgetByName('ixmdj_xmsxxx');
            ixmdj_xmsxxx.field.props.label = '项目等级';
            //
            let ixmsx_pmo = formData.findWidgetByName('ixmsx_pmo');
            ixmsx_pmo.field.props.label = '项目属性';
            //
            let rsjxt_pmo = formData.findWidgetByName('rsjxt_pmo');
            rsjxt_pmo.field.props.label = '涉及系统';
        } catch (e) {

        }
    }

    // 动态表单事件
    handleCondition(e){
        let scondition = e.target.value
        let handlers = this.state.handlers

        let condition = ""
        let newdata = handlers ? handlers.filter((item) => {
            let flag;
            if(scondition=='SYSO'||scondition=='SYSP'){
                flag = item.flag == scondition || item.condition == null || item.condition == ''
            }else{
                flag = item.flag == scondition || item.condition == null || item.condition == ''||(item.condition+"'").indexOf("'6'")!=-1
            }
            if(flag){
                condition = item.condition;
            }
            //这里定制是为了配合后端跳过架构管理室指派架构师步骤，如果切换分支时，不把隐藏的分支的值清掉。传到后台处理时，不会自动跳过。隐藏的分支只会把_lable的字段删除了，但是真实的值还在，所以也要把校验去掉，否则点击提交会校验不通过。
            if(scondition=='SYSN'&&item.flag=='SYSJ'){
                this.props.form.setFieldsValue({[item.stepkey]:''})
                this.props.form.getFieldProps(item.stepkey,{rules:[]})
            }else if(scondition=='SYSJ'&&item.flag=='SYSJ'){
                this.props.form.setFieldsValue({[item.stepkey]:item.ids})
                this.props.form.getFieldProps(item.stepkey,{rules:[{required:true}]})
            }
            return flag
        }) : []
        this.state.condition = condition;
        newdata = newdata.map(x => {
            return {
                all_line: 2,
                field_label: x.stepname,
                field_name: x.stepkey,
                irelationentityid: x.irelationentityid,
                disabled: x.lastuserflag == 1 && !(x.ids == null || x.ids == '') ? true : false,
                //url: "vfm/ChooseEntity/ChooseEntity",
                url:'bjyh/templates/Form/ChooseEntity',
                groupids:x.groupids||"",//新增按流程用户组用户过滤用户选择
                condition:x.searchCondition||'',//增加查询条件
                ajaxurl:x.ajaxurl,//模态框自定义url
                validator: { message: "输入内容不能为空！", required: true },
                widget: { default_value: x.ids, default_label: x.names },
                widget_type: x.widget_type||"multiselectmodel"
            }
        });

        //将数据转换成新
        let flowHandlerGroupData = formDataToWidgetProps({
            groups:[{
                fields:newdata
            }]
        },this);

        let formData = this.state.formData

        /* 去除非选中分支处理人校验 */
        let handlerGroups = null;
        formData.groups.map(x => {
            if (x.group_code == "flow_handler") {
                handlerGroups = x;
            }
        });
        if(handlerGroups == null){
            //没有处理人节
            return;
        }
        if(handlerGroups.fields){
            //清空处理人字段
            const form = this.props.form;
            handlerGroups.fields.forEach((field)=>{
                form.getFieldProps(field.field_name,{
                    rules:[] //清空校验
                })
                form.getFieldProps(field.field_name+"_label",{
                    rules:[] //清空校验
                })
            });
        }

        
        formData.groups = formData.groups.map(x => {
            if (x.group_code == "flow_handler") {
                x.fields = flowHandlerGroupData.groups[0].fields
                return x
            }
            return x
        }) 
        this.props.form.resetFields(['sdescription'])

    }
    onGetFormDataSuccess = data => {

        /* 根据项目经理结论影响审批radio sysn:提交pmo sysp:返回业务 syso:返回开发 */
        let ixmjlqrjl = findFiledByName(data.form, 'ixmjlqrjl')
        let scondition = findFiledByName(data.form, 'scondition')
        if (scondition) {
            //通过【项目经理确认结论】字段控制实际的流程分支按钮。
            if(ixmjlqrjl){
                switch (ixmjlqrjl.field.widget.default_value * 1) {
                    case 1:
                        scondition.field.widget.default_value = 'SYSO'
                        data.scondition = 'SYSO'
                        break
                    case 2:
                        scondition.field.widget.default_value = 'SYSN'
                        data.scondition = 'SYSN'
                        break
                    case 3:
                        data.scondition = 'SYSP'
                        scondition.field.widget.default_value = 'SYSP'
                        break
                }
            }
            //新的版本去掉了【项目经理确认结论】字段，所以要根据项目的等级进行判断分支。A级项目：要进行架构评审 B级项目：直接还是到PMO评审节点
            //获取项目等级信息
            let ixmdj_xmsxxx = findFiledByName(data.form,'ixmdj_xmsxxx');
            if(!ixmjlqrjl&&ixmdj_xmsxxx){
                if(ixmdj_xmsxxx.field.widget.default_value*1==1){
                        //如果是A类项目:显示提交架构隐藏提交PMO分支
                        scondition.field.widget.load_template.map(item => {
                            if (item.value == 'SYSJ') {
                                item.hidden = false
                            } else if (item.value == 'SYSN') {
                                item.hidden = true
                            }
                        })
                        scondition.field.widget.default_value = 'SYSJ'
                        data.scondition = 'SYSJ'
                }else{
                    //不是A类项目，则默认提交到PMO
                    scondition.field.widget.load_template.map(item => {
                        if (item.value == 'SYSN') {
                            item.hidden = false
                        } else if (item.value == 'SYSJ') {
                            item.hidden = true
                        }
                    })
                    scondition.field.widget.default_value = 'SYSN'
                    data.scondition = 'SYSN'
                }
                //是否数据管理部退回
                let isfsjglbth = findFiledByName(data.form,'isfsjglbth');
                let isfsjglbthVal='';
                if(isfsjglbth){
                    isfsjglbthVal=isfsjglbth.field.widget.default_value;
                }
                //是否架构师退回
                let isfjgsth = findFiledByName(data.form,'isfjgsth');
                let isfjgsthVal='';
                if(isfjgsth){
                    isfjgsthVal=isfjgsth.field.widget.default_value;
                }
                console.log(data)
                let sdescription = findFiledByName(data.form,'sdescription');
                //如果是数据管理部退回则默认返回业务
                if(isfsjglbthVal==1&&isfjgsthVal==null){
                    scondition.field.widget.default_value = 'SYSP'
                    data.scondition = 'SYSP'
                    if(sdescription){
                        sdescription.field.widget.default_value="详见数据管理部审核意见";
                    }
                }
                //如果是架构师退回则默认返回开发
                if(isfjgsthVal==1&&isfsjglbthVal==null){
                    scondition.field.widget.default_value = 'SYSO'
                    data.scondition = 'SYSO'
                    if(sdescription){
                        sdescription.field.widget.default_value="详见架构室审核意见";
                    }
                }
            }
        }
    }

    onBeforeSave(formData, btnName) {
        debugger;
        let _this = this;
        let sparam = JSON.parse(formData.sparam);
        let ixmdj = sparam.ixmdj_xmsxxx;//项目等级
        let scondition = sparam.scondition
        let ixmlb = sparam.ixmlb;    //项目类别
        let fbxmyjtrje = sparam.fbxmyjtrje;
        let ixmjlqrjl = sparam.ixmjlqrjl; //项目经理确认结论（1.返回开发 2.提交PMO 3.返回业务）
        let isfxjxt = sparam.isfxjxt;//是否新建系统
        let ikfms = sparam.ikfms; //开发模式

        //提交时校验项目等级
        if (ixmdj && ixmlb && btnName == 'ok') {
            //2） 如预算为0，开发模式为非自主开发则报错，如预算非0，开发模式为非合作开发或外包开发则报错
            // if (fbxmyjtrje == 0 && ikfms != 0) {
            //     this.alertMsg('如预算为0，开发模式只能是自主模式!', 'warning');
            //     return false;
            // } else if (fbxmyjtrje != 0 && ikfms == 0) {
            //     this.alertMsg('如预算不为0，开发模式只能是合作开发或外包开发!', 'warning');
            //     return false;
            // }
            //新版本流程去掉了该ixmjlqrjl字段，这个是为了兼顾以前旧版本。
            if(ixmjlqrjl){
                switch (ixmjlqrjl) {
                    case '2':
                        if (0 == ixmlb) {
                            if ('0' != ixmdj) {
                                this.alertMsg('支持类的项目等级只能是无!', 'warning');
                                return false;
                            }
                        } else {
                            if (0 == ixmdj) {
                                this.alertMsg('开发类的项目等级不能是无!', 'warning');
                                return false;
                            }
                            /**
                             * 项目管理系统（六期）项目 56.立项级别与新建系统与预算强制校验
                             * 项目申请的PMO评审中项目级别和预算不一致，则流程无法提交。
                             * 项目申请中“是否新建系统”为是或“本项目预计投入费用”>=300万，则项目级别只能A级，如项目级别选择不正确，则流程无法提交。
                             * 项目等级 ixmdj  0无 1A 2B ,是否新建系统 isfxjxt 0否 1是
                             */
                            if (fbxmyjtrje * 1 >= 3000000 && ixmdj != "1") {
                                this.alertMsg('本项目预计投入费用大于或等于300万，项目级别只能A级，请修改项目等级!', 'warning');
                                return false;
                            }
                            if ("1" == isfxjxt && ixmdj != "1") {
                                this.alertMsg('本项目是新建系统的项目，项目级别只能A级，请修改项目等级!', 'warning');
                                return false;
                            }
                            // 当“本项目预计投入费用”<300万 并且“是否新建系统”为否 时 只能项目级别只能B级
                            if ("0" == isfxjxt && fbxmyjtrje * 1 < 3000000 && ixmdj != "2") {
                                this.alertMsg('“本项目预计投入费用”<300万 并且“是否新建系统”为否，项目级别只能B级，请修改项目等级!', 'warning');
                                return false;
                            }
    
                        }
                        break;
                    case '1':
                        break;
                    case '3':
                        break;
                }
            }else{
                //如果表单没有ixmjlqrjl该字段，则根据系统自带的分支条件进行处理。
                //如果分支条件选的是提交PMO或者提交架构管理室，则控制项目等级不能为无。
                if(scondition=='SYSJ'||scondition=='SYSN'){
                    if (0 == ixmlb) {
                        if ('0' != ixmdj) {
                            this.alertMsg('支持类的项目等级只能是无!', 'warning');
                            return false;
                        }
                    }else{
                        if (0 == ixmdj) {
                            this.alertMsg('开发类的项目等级不能是无!', 'warning');
                            return false;
                        }
                        /**
                         * 项目管理系统（六期）项目 56.立项级别与新建系统与预算强制校验
                         * 项目申请的PMO评审中项目级别和预算不一致，则流程无法提交。
                         * 项目申请中“是否新建系统”为是或“本项目预计投入费用”>=300万，则项目级别只能A级，如项目级别选择不正确，则流程无法提交。
                         * 项目等级 ixmdj  0无 1A 2B ,是否新建系统 isfxjxt 0否 1是
                         */
                        if (fbxmyjtrje * 1 >= 3000000 && ixmdj != "1") {
                            this.alertMsg('本项目预计投入费用大于或等于300万，项目级别只能A级，请修改项目等级!', 'warning');
                            return false;
                        }
                        if ("1" == isfxjxt && ixmdj != "1") {
                            this.alertMsg('本项目是新建系统的项目，项目级别只能A级，请修改项目等级!', 'warning');
                            return false;
                        }
                        // 当“本项目预计投入费用”<300万 并且“是否新建系统”为否 时 只能项目级别只能B级
                        if ("0" == isfxjxt && fbxmyjtrje * 1 < 3000000 && ixmdj != "2") {
                            this.alertMsg('“本项目预计投入费用”<300万 并且“是否新建系统”为否，项目级别只能B级，请修改项目等级!', 'warning');
                            return false;
                        }
                    }
                }
            }
            
        }
        //同步保存
        sparam.ixmsx_pmo = sparam.ixmsx;
        sparam.rsjxt_pmo = sparam.rsjxt1;
        sparam.ixmdj = sparam.ixmdj_xmsxxx;

        if (btnName == "ok") {
            if (scondition == 'SYSP') {
                sparam.szjtjxmjlquer = '1'
            }
        }
        formData.sparam = JSON.stringify(sparam)

    }

    //检验是否已有重复项目名称
    checkPJnameRepeat = () => {
        let _this = this
        vpAdd('/{bjyh}/xmsq/checkPJnameRepeat', {
            piid: _this.props.piid,
            ientityid: _this.props.iobjectentityid,
            iobjectid: _this.props.iobjectid
        }).then(res => {
            if (res.data && res.data.isrepeat === true) {
                //_this.props.form.getFieldValue({})
                VpMWarning({
                    title: '提示',
                    content: `需求名称'${res.data.xmsqname}' 与现有项目名称重复，请重新填写！`,
                    okText: '确定'
                })
            }
        })
    }


    getStepInfo = (piid, stepkey) => {
        let a = ''
        vpAdd('/{bjyh}/xmsq/getStepInfoBysid', {
            piid: piid, stepkey: stepkey
        }).then(res => {
            res.data ? a == '123' : null
        })
        return a
    }

    //右上角弹框提示
    alertMsg = (desc, type, message) => {
        return (
            VpAlertMsg({
                message: message || "消息提示",
                description: desc || '!',
                type: type || 'info',
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 3)
        )
    }
}
xmjlqrFlowForm09 = FlowForm.createClass(xmjlqrFlowForm09);
export default xmjlqrFlowForm09;