/*
�������Ա���֤
ʹ�÷����������ύ������
*/
function validate(){
   //��Ҫ��֤����������
   var len = document.forms[0].valuedata.length;
   for(var i=0;i<len;i++){
      	//�ռ�����
    	var name = document.forms[0].valuedata.options[i].value;
      	//��ʾ����
        var text = document.forms[0].valuedata.options[i].text;
        //��������
        var dataType = name.split('_')[1];
        var isMandatory = name.split('_')[3];
        //add by huming
        //��Щ���Ա�����Ϊ���Զ����㡱����������ҳ����ΪreadOnly
        if(dataType!='D'&&document.getElementById(name).readOnly==true){
           continue;
        }
        //add end
        if(dataType=='C' && isMandatory==1){
           if(!getSelector(name)){
              alert(text+"����ѡ��");
              return false;
           }
        }else if(dataType=='L' && isMandatory==1){
           if(eval("document.forms[0]."+name).value==""){
              alert(text+"����ѡ��");
              return false;
           }
        }else if(isMandatory==1){
        	if(eval("document.forms[0]."+name).value==""){
        		alert(text+"����Ϊ��");
                        try{
                        eval("document.forms[0]."+name).focus();
                        }catch(e){}
                	return false;
      		}
      	}
      	if(dataType=='I'){
   		if(!isnumber(eval("document.forms[0]."+name).value)){
                	alert(text+"����Ϊ����");
                        try{
                        eval("document.forms[0]."+name).focus();
                        }catch(e){}
			return false;
               	}
      	}
      	
   }
   return true;
}

//�ж��Ƿ�Ϊ����
function isnumber(str){
 if(str.match("^\[-]?[0-9]+\$")){
	return true;
 }else{
	return false;
 }
}

//ѡ��ռ��Ƿ�ѡ��
function getSelector(name){
   var len = eval("document.forms[0]."+name).length;
   for(var i=0;i<len;i++){
   	if(eval("document.forms[0]."+name)[i].checked){
        	return true;
      	}
   }
   return false;
}


