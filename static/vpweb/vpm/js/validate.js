//验证字符串是否是money格式
function isMoney(str){
 str=replaceAll(str,",","");
 if(isFloat(str)){
	return true;
 }else{
	return false;
 }
}
//验证是否是整数
function isInt(str){
 if(str.match("^\[-]?[0-9]+\$")){
	return true;
 }else{
	return false;
 }
}
//验证是否是正整数
function isSignlessInt(str){
 if(str.match("^\[0-9]+\$")){
	return true;
 }else{
	return false;
 }
}
//验证是否是浮点数
function isFloat(str){
 if(str.match("\^[-]?[0-9]+([.][0-9]*)?\$")){
        return true;
 }else{
        return false;
 }
}
//验证是否为空
function isEmpty(str){
   str = str.replace(/(^\s*)|(\s*$)/g, "");
	if(str.match("\^\$")){
		return true;
	}else{
		return false;
	}
}
//验证单选钮或复选钮是否选中
function isCheck(obj){
   	var len = 0;
   	try{
      		len = obj.length;
   	}catch(e){return false;}
	if(obj.length==undefined){
		return obj.checked;
	}else{
		for(var i=0;i<obj.length;i++){
			if(obj[i].checked==true){
				return true;
			}
		}
	}
	return false;
}
//替换字符串
function replaceAll(str,regex,replacement){
   while(str.indexOf(regex)!=-1){
      str=str.replace(regex,replacement);
   }
   return str;
}
//获取字符串的字符长度 中文为2 英文为1
function getCharLen(str){
	var len = 0;
	for(var i=0;i<str.length;i++){
		if(str.charCodeAt(i) < 255){
			len++;
		}else{
			len+=2;
		}
	}
	return len;
}
