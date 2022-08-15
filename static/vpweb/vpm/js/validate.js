//��֤�ַ����Ƿ���money��ʽ
function isMoney(str){
 str=replaceAll(str,",","");
 if(isFloat(str)){
	return true;
 }else{
	return false;
 }
}
//��֤�Ƿ�������
function isInt(str){
 if(str.match("^\[-]?[0-9]+\$")){
	return true;
 }else{
	return false;
 }
}
//��֤�Ƿ���������
function isSignlessInt(str){
 if(str.match("^\[0-9]+\$")){
	return true;
 }else{
	return false;
 }
}
//��֤�Ƿ��Ǹ�����
function isFloat(str){
 if(str.match("\^[-]?[0-9]+([.][0-9]*)?\$")){
        return true;
 }else{
        return false;
 }
}
//��֤�Ƿ�Ϊ��
function isEmpty(str){
   str = str.replace(/(^\s*)|(\s*$)/g, "");
	if(str.match("\^\$")){
		return true;
	}else{
		return false;
	}
}
//��֤��ѡť��ѡť�Ƿ�ѡ��
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
//�滻�ַ���
function replaceAll(str,regex,replacement){
   while(str.indexOf(regex)!=-1){
      str=str.replace(regex,replacement);
   }
   return str;
}
//��ȡ�ַ������ַ����� ����Ϊ2 Ӣ��Ϊ1
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
