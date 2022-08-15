/*
用于特性表单验证
使用方法：放在提交方法中
*/
function validate(){
   //需要验证的数据数量
   var len = document.forms[0].valuedata.length;
   for(var i=0;i<len;i++){
      	//空件名称
    	var name = document.forms[0].valuedata.options[i].value;
      	//提示名称
        var text = document.forms[0].valuedata.options[i].text;
        //数据类型
        var dataType = name.split('_')[1];
        var isMandatory = name.split('_')[3];
        //add by huming
        //有些特性被设置为“自动计算”，所以其在页面中为readOnly
        if(dataType!='D'&&document.getElementById(name).readOnly==true){
           continue;
        }
        //add end
        if(dataType=='C' && isMandatory==1){
           if(!getSelector(name)){
              alert(text+"必须选择");
              return false;
           }
        }else if(dataType=='L' && isMandatory==1){
           if(eval("document.forms[0]."+name).value==""){
              alert(text+"必须选择");
              return false;
           }
        }else if(isMandatory==1){
        	if(eval("document.forms[0]."+name).value==""){
        		alert(text+"不能为空");
                        try{
                        eval("document.forms[0]."+name).focus();
                        }catch(e){}
                	return false;
      		}
      	}
      	if(dataType=='I'){
   		if(!isnumber(eval("document.forms[0]."+name).value)){
                	alert(text+"必须为数字");
                        try{
                        eval("document.forms[0]."+name).focus();
                        }catch(e){}
			return false;
               	}
      	}
      	
   }
   return true;
}

//判断是否为数字
function isnumber(str){
 if(str.match("^\[-]?[0-9]+\$")){
	return true;
 }else{
	return false;
 }
}

//选择空件是否被选择
function getSelector(name){
   var len = eval("document.forms[0]."+name).length;
   for(var i=0;i<len;i++){
   	if(eval("document.forms[0]."+name)[i].checked){
        	return true;
      	}
   }
   return false;
}


