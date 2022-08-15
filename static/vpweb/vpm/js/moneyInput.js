var MoneyObj={
	covert2MoneyStr:function(value){
		if(value=='')return '';
		value = value.replaceAll(",", "");
		var vstr=new String(value),index=vstr.indexOf('.'),ll=(index>-1?index-1:(vstr.length-1)),newstr='';
		for(var i=ll;i>-1;){
			newstr=vstr.charAt(i--)+newstr;
			if(i!=-1&&(ll-i)%3==0&&(vstr.charAt(i)!='-'&&vstr.charAt(i)!='+')){
				newstr=','+newstr;
			}
		}
		if(index>-1){
			newstr+='.'+vstr.substring(index+1,vstr.length)+((vstr.length-index<3)?(vstr.length-index<2?'00':'0'):'');
		}else{
			newstr+='.00';
		}
		return newstr;
	},
	covertGridValue:function(value){

		value = this.covert2MoneyStr(value);
		value='<div style="text-align:right;width:100%;">'+value+'</div>';

		return value;
		
	},
	convert2Money:function (obj){
	
		var id=obj.id, value=document.getElementById(id).value;
		if(isNaN(value)){
			alert('请输入数字!');
			obj.focus();
			return;
		}else{
			//this.copy2HidValue(obj);
			document.getElementById(id).value=this.covert2MoneyStr(value);
		}
	},
	removeMoneyFormat:function (obj){
		var tempv = obj.value;
		if(tempv){
			obj.value=obj.value.replace(/[^\d\.-]/g, "");
		}
	},
	textIsNumbers:function (e,obj)   
	{   
		var keynum;   
		var keychar;   
		var numcheck;   
		  
		if(window.event) // IE   
		{   
			keynum = e.keyCode;   
		}   
		else if(e.which) // Netscape/Firefox/Opera   
		{   
			keynum = e.which;   
		}  
		keychar = String.fromCharCode(keynum);
		numcheck = /[^\d\.-]/g;  
		if(/-/.test(obj.value)&&/-/.test(keychar)){
			return false;
		}
		if(/\./.test(obj.value)&&/\./.test(keychar)){
			return false;
		} 
		return !numcheck.test(keychar);   
	},
	getMoneyInputValue:function (id)   
	{   
		var value=document.getElementById(id).value;
		return parseFloat(value.replace(/[^\d\.-]/g, "")).toFixed(2);   
	},
	judgeMoney:function(field){
			field.value=field.value.replace(/,/g,'');
			if(isNaN(field.value)){
				alert(field.propertyText + "不是数字类型");
				return NULL;
			}
			if(9999999999999999.99 < parseFloat(field.value)){
				alert(field.propertyText + "超出精度范围，不能大于[9999999999999999.99]");
				return NULL;
			}
			field.value=parseFloat(field.value);
			return true;
	}

};