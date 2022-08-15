
Form.SearchField = function(cfg){
//	var cfg = {
//			id: id,
//			value: value,
//			hidvalue: hidID,
//			mustInput : 0 | 1 | 2,	//0：只读 1：可选输入 2：必须输入
//			propertyType//0字符串 1文本框 2数字。。。
//			systype//1系统属性
//			title
//			onvc
//			objEid
//			option | valueList 
//	};
	this.getName = function(){
		return "SearchField";
	}
	var property = Form.getProperty(cfg);
	var className;
	if(cfg.mustInput==0){
		className = "inputSelectRead";
	}else if(cfg.mustInput==2){
		className = "inputSelectCheck";
	}else{
		className = "inputSelect";
	}
	var titleStr = "";
	if(cfg.title && cfg.title!="" && cfg.title!="null" && cfg.title!="undefined"){
		titleStr = 'title="'+cfg.title+'"';
	}
	var attrs = ' hideFieldOptions="true"';
	if(cfg.mustInput==0){
		attrs += ' readonly="true"';
	}else if(cfg.mustInput==2){
		attrs += ' must="true"';
	}
	if(cfg.objEid){
		attrs += ' entityId="'+cfg.objEid+'"';
	}
	if(cfg.option || cfg.valueList){
		window.selFieldOptions && (window.selFieldOptions[cfg.id] = cfg.option||cfg.valueList);
	}
	this.getHtml = function(){
		var str = '<td class="textCell textCell2"><table id="'+cfg.id+'" height="20px" onvc="'+cfg.onvc+'" '+titleStr+' type="'+cfg.propertyType+'" class="dynField selField '+className+' selFieldBorder" hidID="'+cfg.hidvalue+'" '+attrs+' >'
				+'<tr><td>&nbsp;</td></tr>'
			+'</table></td>';
		return str;
	}
};
Form.make = function(el){
	document.getElementById(el).innerHTML = _strHTML;
//	document.getElementById(el).innerHTML = _strHTML+'<div style="height: 300px;"/>';
};
//102：时间区间
Form.FieldHelper.registHandler({
	handleThis: function(field){
		return true;
//		0：字符串 1：多行文本 2:金额 4：数字 8：时间 11：单选列表 12：复选列表 15 单选框 16 复选框 
//		91选择用户 92选择项目 93选择部门 81选择用户（多选） 82选择项目（选择项多选） 83选择部门（多选） 
//		94关联实体 112 选择项目群 110图片
		return ",0,1,2,4,8,11,12,15,16,102,".indexOf(field.propertyType)>=0;
	},
	process: function(field){
		var obj = document.getElementById(field.id);
		if(obj){
			field.value = obj.value;
		}else{
			field.value = "";
		}
		return field;
	}
});