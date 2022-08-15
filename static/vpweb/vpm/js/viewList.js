var flag=true;
var showFlag=true;
var objTable;//������ ����ߵ���ʾ
var objView;//�������ʾ�ı����ж��� ��������ֵ���ʾ
var objViewBG;//����ж��� ��񱳾�����ɫ����ʾ
var objViewList;//�����б�����Ĳ���� ���������б����ʾ
var viewWidth;//���Ŀ��
var listText="";//ѡ�����ʾ���ı�
var listValue="";//ѡ����ı���valueֵ

/**
 * ����ƶ��ı����ʱ �л���ʽ ������������ĳ�ʼֵ
 *
 * @param table ������
 */
function selectMove(table){
   //��ȡ������
   objTable=table;
   //��ȡ����ж���
   objViewBG=table.rows.item(0);
   //��ȡ�������ʾ�ı����ж���
   objView=table.rows.item(0).cells.item(0);
   //��ȡ������Ŀ��
   viewWidth=table.width;
   //���߿�����Ϊ��ɫ
   table.bgColor="#000000";
   //��������ɫ����Ϊ��ɫ
   objViewBG.bgColor="#FFCC00";

   showFlag=true;
}
/**
 * ����ƿ��ı����ʱ �л���ʽ
 *
 * @param table ������
 */
function selectOut(table){
   //�ж��������Ƿ���ʾ �����ʾ�����л���ʽ
   if(flag){
      table.bgColor="";
      objViewBG.bgColor="";
   }
}
/**
 * ��ʾ������ ���ó�ʼֵ
 *
 * @param obj �����б�����Ĳ����
 */
function displaySelect(obj){
   //��ȡ�����б�����Ĳ����
   objViewList=obj;
   //��������б��Ѿ���ʾ ���µ�����µļ�ͷʱ �Ͳ������� ���ջ������������
   if(!showFlag){
    showFlag=true;
    return;
   }
   if(obj.style.display=="none"){
      	//��ȡX����
   	var left=event.clientX-event.offsetX;
      	//��ȡY����
   	var top=event.clientY-event.offsetY;
      	//��ȡ���
   	var width=objView.offsetWidth;
      	//���ò�X����
      	obj.style.left=left-4-width;
      	//���ò�Y����
   	obj.style.top=top+15;
      	//���ò�Ŀ��
   	obj.style.width=viewWidth;
   	obj.style.display="";
      	selectMove(objTable);
   	flag=false;
      	//�����������ý��� �Ժ����ʧȥ����ķ���
   	obj.children.item(0).focus();
   }
}
/**
 * ������ʧȥ����ʱ���� ����������
 */
function hidden(){
   objViewList.style.display="none";
   showFlag=false;
   flag=true;
   selectOut(objTable);
}
/**
 * ѡ����������ĳһ��ʱ ����ѡ�е�ֵ
 *
 * @param objItem �����б�ѡ�еĶ���
 */
function clickList(objItem){
   //��ȡ�����б���ѡ�е��ı�
   listText=objItem.innerText;
   //��ȡ�����б���ѡ�е��ı���valueֵ
   listValue=objItem.value;
   //���������ʾ���ı��滻��ѡ�е��ı�
   objView.innerText=objItem.innerText;
}
/**
 * ���������б���ѡ�е��ı�
 */
function getText(){
   return listText;
}
/**
 * ���������б���ѡ�е��ı���valueֵ
 */
function getValue(){
   return listValue;
}
/**
 * ��껬����ѡ��ʱ �л���ʽ
 *
 * @param objItem �����б�ѡ�еĶ���
 */
function itemMove(objItem){
   objItem.bgColor="#6C829B";
   objItem.style.color="#FFFFFF";
}
/**
 * ����뿪��ѡ��ʱ �л���ʽ
 *
 * @param objItem �����б�ѡ�еĶ���
 */
function itemOut(objItem){
   objItem.bgColor="";
   objItem.style.color="";
}
