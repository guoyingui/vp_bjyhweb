/**
 * <p>菜单控制</p>
 *
 * <p>页面上的所有菜单控制的方法</p>
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
var clickMenuNum=0;//存放单击过哪一个菜单的号

/**
 * 用于处理菜单中的url请求 其中fromeName为页面的初始变量
 *
 * return 卡号 1-N
 */
function goto(url){
	var frame = mybody.getIframe(frameName);
	if(url.indexOf('&')>=0||url.indexOf('?')>=0)
		url +='&r='+Math.random()*10000;
	frame.src=url;
}


//翻卡菜单方法区----开始---------------------------------------------------------------------------

/**
 * 单击翻卡菜单 切换样式和完成url请求
 *
 * @param index 菜单号 1-N
 * @param url 点击翻卡后页面的url请求
 */
function clickCard(index,url){
	if(top.bottom!=undefined&&top.bottom.document.getElementById("successMessage")!=undefined){
		top.bottom.document.getElementById("successMessage").innerHTML='&nbsp;加载中&nbsp;<img   src="/project/images/loading_bar3.gif" alt"..."/>&nbsp;';
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
	//	top.bottom.document.getElementById("successMessage").innerHTML='&nbsp;加载中&nbsp;<img   src="/project/images/loading_bar3.gif" alt"..."/>&nbsp;';
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
 * 切换翻卡菜单在前面的样式
 *
 * @param index 菜单号 1-N
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
 * 切换翻卡菜单在后面的样式
 *
 * @param index 菜单号 1-N
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
 * 查找翻卡菜单在前面的卡号 其中maxCardNum为页面的初始变量
 *
 * return 菜单号 1-N
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
//翻卡菜单方法区----结束---------------------------------------------------------------------------


//二级菜单方法区----开始---------------------------------------------------------------------------

/**
 * 当鼠标移动到菜单上时 切换样式
 *
 * @param index 菜单号 1-N
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
 * 当鼠标离开菜单时 切换样式
 *
 * @param index 菜单号 1-N
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
 * 单击菜单时 切换样式和完成url请求
 *
 * @param index 菜单号 1-N
 */
function clickMenu(index,url){
	if(top.bottom!=undefined&&top.bottom.document.getElementById("successMessage")!=undefined){
		top.bottom.document.getElementById("successMessage").innerHTML='&nbsp;加载中&nbsp;<img   src="/project/images/loading_bar3.gif" alt"..."/>&nbsp;';
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
 * 初始化菜单
 *
 * @param index 菜单号 1-N
 * @param url 点击菜单后页面的url请求
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
//二级菜单方法区----结束---------------------------------------------------------------------------
