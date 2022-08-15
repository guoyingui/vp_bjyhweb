
Form.SearchField = function(cfg){
//	var cfg = {
//			id: id,
//			value: value,
//			hidvalue: hidID,
//			mustInput : 0 | 1 | 2,	//0��ֻ�� 1����ѡ���� 2����������
//			propertyType//0�ַ��� 1�ı��� 2���֡�����
//			systype//1ϵͳ����
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
//102��ʱ������
Form.FieldHelper.registHandler({
	handleThis: function(field){
		return true;
//		0���ַ��� 1�������ı� 2:��� 4������ 8��ʱ�� 11����ѡ�б� 12����ѡ�б� 15 ��ѡ�� 16 ��ѡ�� 
//		91ѡ���û� 92ѡ����Ŀ 93ѡ���� 81ѡ���û�����ѡ�� 82ѡ����Ŀ��ѡ�����ѡ�� 83ѡ���ţ���ѡ�� 
//		94����ʵ�� 112 ѡ����ĿȺ 110ͼƬ
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