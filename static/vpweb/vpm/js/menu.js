/**
 * <p>�˵�����</p>
 *
 * <p>ҳ���ϵ����в˵����Ƶķ���</p>
 *
 * <p>Copyright: 2006-2-29</p>
 *
 * <p>Company: </p>
 * @author wudi
 * @version 1.0
 */
var mybody = {};
mybody.all = function(str){
	return window.document.getElementById(str);
}
mybody.getIframe = function(fname){
	var frames = window.document.getElementsByTagName("iframe");
	for(var i=0;i<frames.length;i++){
		if(frames[i].name == fname){
			return frames[i];
		}
	}
}
var clickMenuNum=0;//��ŵ�������һ���˵��ĺ�

/**
 * ���ڴ���˵��е�url���� ����fromeNameΪҳ��ĳ�ʼ����
 *
 * return ���� 1-N
 */
function goto(url){
	var frame = mybody.getIframe(frameName);
	if(url.indexOf('&')>=0||url.indexOf('?')>=0)
		url +='&r='+Math.random()*10000;
	frame.src=url;
}


//�����˵�������----��ʼ---------------------------------------------------------------------------

/**
 * ���������˵� �л���ʽ�����url����
 *
 * @param index �˵��� 1-N
 * @param url ���������ҳ���url����
 */
function clickCard(index,url){
	if(top.bottom!=undefined&&top.bottom.document.getElementById("successMessage")!=undefined){
		top.bottom.document.getElementById("successMessage").innerHTML='&nbsp;������&nbsp;<img   src="/project/images/loading_bar3.gif" alt"..."/>&nbsp;';
	}
	var cardNum=findIndex();
	if(cardNum!=0){
		downCard(cardNum);
	}
	upCard(index);
	goto(url);
}
function clickCardUnloading(index,url){
	//if(top.bottom!=undefined&&top.bottom.document.getElementById("successMessage")!=undefined){
	//	top.bottom.document.getElementById("successMessage").innerHTML='&nbsp;������&nbsp;<img   src="/project/images/loading_bar3.gif" alt"..."/>&nbsp;';
	//}
	var cardNum=findIndex();
	if(cardNum!=0){
		downCard(cardNum);
	}
	upCard(index);
	goto(url);
}
function clickCardByName(pName,url){
    //alert(pName);
	var index=findIndexByName(pName);
	//alert(pName+' '+index);
	clickCard(index,url);
}
/**
 * �л������˵���ǰ�����ʽ
 *
 * @param index �˵��� 1-N
 */
function upCard(index){
	try{
		if(index==1){
			var bg=mybody.all("bg"+index);
			bg.className="upCardBGFirst";
			var border=mybody.all("border"+index);
	               	border.height="21";
			border.className="upCardBorder";
			var text=mybody.all("text"+index);
			text.className="upCardText";
		}else{
			var bg=mybody.all("bg"+index);
			bg.className="upCardBG";
			var border=mybody.all("border"+index);
	               	border.height="21";
			border.className="upCardBorder";
			var text=mybody.all("text"+index);
			text.className="upCardText";
		}
	}catch(e){
		
	}
	
}
/**
 * �л������˵��ں������ʽ
 *
 * @param index �˵��� 1-N
 */
function downCard(index){
	if(index==1){
		var bg=mybody.all("bg"+index);
		bg.className="downCardBGFirst";
		var border=mybody.all("border"+index);
               	border.height="20";
		border.className="downCardBorder";
		var text=mybody.all("text"+index);
		text.className="downCardText";
	}else{
		var bg=mybody.all("bg"+index);
		bg.className="downCardBG";
		var border=mybody.all("border"+index);
               	border.height="20";
		border.className="downCardBorder";
		var text=mybody.all("text"+index);
		text.className="downCardText";
	}
}
/**
 * ���ҷ����˵���ǰ��Ŀ��� ����maxCardNumΪҳ��ĳ�ʼ����
 *
 * return �˵��� 1-N
 */
function findIndex(){
try{
	for(var i=1;i<=maxCardNum;i++){
		var text=mybody.all("text"+i);
		if(text.className=="upCardText"){
			return i;
		}
	}}catch(e){}
	return 0;
}
function findIndexByName(pName){
	for(var i=1;i<=maxCardNum;i++){
		var text=mybody.all("text"+i);
		if(text.innerHTML==pName){
			return i;
		}
	}
	return 0;
}
//�����˵�������----����---------------------------------------------------------------------------


//�����˵�������----��ʼ---------------------------------------------------------------------------

/**
 * ������ƶ����˵���ʱ �л���ʽ
 *
 * @param index �˵��� 1-N
 */
function moveMenu(index){
	var td=mybody.all("menu"+index);
	if(index==1){
		td.className="moveMenuFirst";
	}else{
		td.className="moveMenu";
	}
}
/**
 * ������뿪�˵�ʱ �л���ʽ
 *
 * @param index �˵��� 1-N
 */
function outMenu(index){
	if(index==clickMenuNum) return;
	var td=mybody.all("menu"+index);
	if(index==1){
		td.className="outMenuFirst";
	}else{
		td.className="outMenu";
	}
}
/**
 * �����˵�ʱ �л���ʽ�����url����
 *
 * @param index �˵��� 1-N
 */
function clickMenu(index,url){
	if(top.bottom!=undefined&&top.bottom.document.getElementById("successMessage")!=undefined){
		top.bottom.document.getElementById("successMessage").innerHTML='&nbsp;������&nbsp;<img   src="/project/images/loading_bar3.gif" alt"..."/>&nbsp;';
	}
	var td=mybody.all("menu"+index);
	var boforeNum=clickMenuNum;
	clickMenuNum=index;
	if(index==1){
		td.className="moveMenuFirst";
	}else{
		td.className="moveMenu";
	}
	outMenu(boforeNum);
	goto(url);
}
/**
 * ��ʼ���˵�
 *
 * @param index �˵��� 1-N
 * @param url ����˵���ҳ���url����
 */
function init(index,url){
	var td=mybody.all("menu"+index);
	clickMenuNum=index;
	if(index==1){
		td.className="moveMenuFirst";
	}else{
		td.className="moveMenu";
	}
	goto(url);
}
//�����˵�������----����---------------------------------------------------------------------------
