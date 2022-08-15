var flag=true;
var showFlag=true;
var objTable;//表格对象 表格线的显示
var objView;//表格中显示文本的列对象 表格中文字的显示
var objViewBG;//表格行对象 表格背景的颜色的显示
var objViewList;//下拉列表最外的层对象 控制下拉列表的显示
var viewWidth;//表格的宽度
var listText="";//选择后显示的文本
var listValue="";//选择后文本的value值

/**
 * 鼠标移动的表格上时 切换样式 设置其它对象的初始值
 *
 * @param table 表格对象
 */
function selectMove(table){
   //获取表格对象
   objTable=table;
   //获取表格行对象
   objViewBG=table.rows.item(0);
   //获取表格中显示文本的列对象
   objView=table.rows.item(0).cells.item(0);
   //获取表格对象的宽度
   viewWidth=table.width;
   //将边框设置为黑色
   table.bgColor="#000000";
   //将背景颜色设置为黄色
   objViewBG.bgColor="#FFCC00";

   showFlag=true;
}
/**
 * 鼠标移开的表格上时 切换样式
 *
 * @param table 表格对象
 */
function selectOut(table){
   //判断下拉框是否显示 如果显示将不切换样式
   if(flag){
      table.bgColor="";
      objViewBG.bgColor="";
   }
}
/**
 * 显示下拉框 设置初始值
 *
 * @param obj 下拉列表最外的层对象
 */
function displaySelect(obj){
   //获取下拉列表最外的层对象
   objViewList=obj;
   //如果下拉列表已经显示 重新点击向下的箭头时 就不做处理 起到收回下拉框的作用
   if(!showFlag){
    showFlag=true;
    return;
   }
   if(obj.style.display=="none"){
      	//获取X坐标
   	var left=event.clientX-event.offsetX;
      	//获取Y坐标
   	var top=event.clientY-event.offsetY;
      	//获取宽度
   	var width=objView.offsetWidth;
      	//设置层X坐标
      	obj.style.left=left-4-width;
      	//设置层Y坐标
   	obj.style.top=top+15;
      	//设置层的宽度
   	obj.style.width=viewWidth;
   	obj.style.display="";
      	selectMove(objTable);
   	flag=false;
      	//设置下拉框获得焦点 以后调用失去焦点的方法
   	obj.children.item(0).focus();
   }
}
/**
 * 下拉框失去焦点时调用 隐藏下拉框
 */
function hidden(){
   objViewList.style.display="none";
   showFlag=false;
   flag=true;
   selectOut(objTable);
}
/**
 * 选择下拉框中某一项时 设置选中的值
 *
 * @param objItem 下拉列表选中的对象
 */
function clickList(objItem){
   //获取下拉列表中选中的文本
   listText=objItem.innerText;
   //获取下拉列表中选中的文本的value值
   listValue=objItem.value;
   //将表格中显示的文本替换成选中的文本
   objView.innerText=objItem.innerText;
}
/**
 * 返回下拉列表中选中的文本
 */
function getText(){
   return listText;
}
/**
 * 返回下拉列表中选中的文本的value值
 */
function getValue(){
   return listValue;
}
/**
 * 鼠标滑过待选项时 切换样式
 *
 * @param objItem 下拉列表选中的对象
 */
function itemMove(objItem){
   objItem.bgColor="#6C829B";
   objItem.style.color="#FFFFFF";
}
/**
 * 鼠标离开待选项时 切换样式
 *
 * @param objItem 下拉列表选中的对象
 */
function itemOut(objItem){
   objItem.bgColor="";
   objItem.style.color="";
}
