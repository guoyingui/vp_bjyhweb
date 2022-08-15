Ext.require([
    'Ext.data.*',
    'Ext.grid.*',
    'Ext.tree.*'
]);

//����������������
Ext.override(Ext.grid.column.Column, {
	getSortParam: function() {
		var columnID = this.dataIndex;
		if(columnID.indexOf('_Money_Sort') > 0){
			columnID = columnID.replace('_Money_Sort','');
		}
	    return columnID;
	}
});
//��ֹ����ͼ�����ɰ�
Ext.override(Ext.view.AbstractView, {
	beforeRender: function() {
		this.loadMask = false;//��������ͼ�����ɰ壨�����Ҫ�ɰ��ȥ���˾䣩
        this.callParent(arguments);
        this.getSelectionModel().beforeViewRender(this);
    }
});
//���������껬��ʱ��ˮƽ�������ƶ�������
Ext.override(Ext.panel.Table, {
	onMouseWheel: function(e) {
	    var me = this,
	        vertScroller = me.getVerticalScroller(),
	        horizScroller = me.getHorizontalScroller(),
	        scrollDelta = -me.scrollDelta,
	        deltas = e.getWheelDeltas(),
	        deltaX = scrollDelta * deltas.x,
	        deltaY = scrollDelta * deltas.y,
	        vertScrollerEl, horizScrollerEl,
	        vertScrollerElDom, horizScrollerElDom,
	        horizontalCanScrollLeft, horizontalCanScrollRight,
	        verticalCanScrollDown, verticalCanScrollUp;
	
	    
//	    if (horizScroller) {
//	        horizScrollerEl = horizScroller.scrollEl;
//	        if (horizScrollerEl) {
//	            horizScrollerElDom = horizScrollerEl.dom;
//	            horizontalCanScrollRight = horizScrollerElDom.scrollLeft !== horizScrollerElDom.scrollWidth - horizScrollerElDom.clientWidth;
//	            horizontalCanScrollLeft  = horizScrollerElDom.scrollLeft !== 0;
//	        }
//	    }
	    if (vertScroller) {
	        vertScrollerEl = vertScroller.scrollEl;
	        if (vertScrollerEl) {
	            vertScrollerElDom = vertScrollerEl.dom;
	            verticalCanScrollDown = vertScrollerElDom.scrollTop !== vertScrollerElDom.scrollHeight - vertScrollerElDom.clientHeight;
	            verticalCanScrollUp   = vertScrollerElDom.scrollTop !== 0;
	        }
	    }
	
//	    if (horizScroller) {
//	        if ((deltaX < 0 && horizontalCanScrollLeft) || (deltaX > 0 && horizontalCanScrollRight)) {
//	            e.stopEvent();
//	            horizScroller.scrollByDeltaX(deltaX);
//	        }
//	    }
	    if (vertScroller) {
	        if ((deltaY < 0 && verticalCanScrollUp) || (deltaY > 0 && verticalCanScrollDown)) {
	            e.stopEvent();
	            vertScroller.scrollByDeltaY(deltaY);
	        }
	    }
	}
});
NULL = undefined;
var store;
//��װTreeGrid��
TreeGrid = function(config){
	
	//�б���Ⱦ�����
	if(config.afterRenderer){
		if(!this.viewConfig){
			this.viewConfig={};
		}
		this.viewConfig.listeners = {refresh:config.afterRenderer};
	}
	this.config = config;
	Ext.apply(this, config);
	
	TreeGrid.superclass.constructor.call(this, config);
};
var cmList = [];
var dsList = [];
//�̳�TreePanel��
Ext.extend(TreeGrid, Ext.tree.Panel, {
	initComponent: function(){
		//����columns��store������
		for(var i=0;i<this.column.length;i++){
			var c = this.column[i];
			if(c.header != "hidden"){
				var cmObj = new Object();
				cmObj = c;
				cmObj.dataIndex = c.id;
				if(c.text == NULL){
					cmObj.text = c.header;
				}
				cmObj.menuDisabled = true;
				cmList.push(cmObj);
			}
			//Store�еĶ���
			var dsObj = new Object();
			dsObj.name = c.id;
			dsObj.type = c.type;
			dsList.push(dsObj);
		}
		this.rowLines = true;
		//�ж��Ƿ����϶�
		if(this.listenerTF&&this.listenerTF!=undefined){
			if(this.viewConfig){
				this.viewConfig.loadMask= false;
				this.viewConfig.stripeRows=true;
				//�϶����Ըı�˳���
				this.viewConfig.plugins={
	                ptype: 'treeviewdragdrop',
	                containerScroll: true
	            } ;
			}else{
				this.viewConfig = {
						loadMask: false,
						stripeRows:true,
						//�϶����Ըı�˳���
						plugins:{
			                ptype: 'treeviewdragdrop',
			                containerScroll: true
			            } //
				};
			}
			
		}else{
			if(this.viewConfig){
				this.viewConfig.loadMask=false;
				this.viewConfig.stripeRows=true;
			}else{
				this.viewConfig = {
						loadMask: false,
						stripeRows:true
					};
			}
			
		}
		
		
		if(this.beforeitemmove==undefined){
			this.beforeitemmove=function(node, oldParent,newParent, index, eOpts){};
		}
		if(this.itemmove==undefined){
			this.itemmove=function(node, oldParent,newParent, index, eOpts){};
		}
		//����ͼ��ק��ļ���
		this.listeners={
		    //�϶�ǰ�ж�
			beforeitemmove : this.beforeitemmove,
			//�϶���ִ��
			itemmove : this.itemmove
		};
		if(this.plugins){
			if(Object.prototype.toString.apply(this.plugins)=='[object Array]'){
				this.plugins.push({
					ptype: 'bufferedrenderer',
					trailingBufferZone: 10,
					leadingBufferZone: 20
				});
			}else{
				this.plugins=[this.plugins,{
					ptype: 'bufferedrenderer',
					trailingBufferZone: 10,
					leadingBufferZone: 20
				}];
			}
		}else{
			this.plugins = {
					ptype: 'bufferedrenderer',
					trailingBufferZone: 10,
					leadingBufferZone: 20
				};
		}
        
      
		this.columns = cmList;
		Ext.define('commonModel', {
			idProperty:(this.config||{}).idProperty||'id',
	        extend: 'Ext.data.Model',
	        fields: dsList
	    });
		
	    store = Ext.create('Ext.data.TreeStore', {
	        model: 'commonModel',
	        proxy: {
	            type: 'ajax',
	            timeout: 300000,
	            url: this.url
	        }
	        //folderSort: true
	    });
		
		this.store = store;
		
		store.on("load",function(){
			//gt.doLayout();
			/*if(showLevelTemp > 1){
				if(!window.addEventListener && isFirstExpand){
					disableButton();
				}
			}*/
			//if(showLevelTemp <= 1 || window.addEventListener){
				try{
					disableToolbarBtn4other();
				}catch(e){}
			//}
			//gridtree.setHeight(gridtree.getBodyHeight()-changeheigh+10);
			//gridtree.setHeight(gridtree.getBodyHeight()-changeheigh);
			if(isFirstExpand){
				try{
					window.parent.hiddenMask();
				}catch(e){}
				try{
					mask.hide();
				}catch(e){}
			}
			isEnter = true;
		});
		//������������в���ʾ������
		store.on("sort",function(){
			/*var childNodes = store.getRootNode().childNodes;
			for(var i=0;i<childNodes.length;i++){
				if(childNodes[i].childNodes.length > 0){
					if(childNodes[i].data.expanded){
						childNodes[i].collapse();
						childNodes[i].expand();
					}else{
						childNodes[i].expand();
						childNodes[i].collapse();
					}
				}
			}
			try{
				var HScroll = gridtree.getHorizontalScroller();
				HScroll.setScrollLeft(0);
			}catch(e){}*/
		});
		
		//���ص�div�Զ�100%��ȣ����ڼ���grid�Ŀ��
		if(document.getElementById("hidden_width") == NULL){
			var mydiv = document.createElement("div");
			mydiv.setAttribute("id","hidden_width");
			document.body.appendChild(mydiv);
		}
		var changeheigh=0;//�������ø߶�
		if(this.changeheigh !=null){
			changeheigh=this.changeheigh;
		}
		//���ø߶ȣ�û�и߶�ʱ�Զ��ſ�
		if(this.height != NULL){
			if(this.height == '100%'){
				this.height = this.getBodyHeight()-changeheigh;
			}
		}
	    //���ÿ�ȣ�û�п��ʱ�Զ��ſ�
		if(this.width != NULL){
			if(this.width == '100%'){
				this.width = document.body.clientWidth;
			}
		}
		changeheigh = 36;
		//window���ڸı��Сʱ�Ŀ������
		var gridtree = this;
		if(window.addEventListener){ // Mozilla, Netscape, Firefox
	        window.addEventListener('resize', function(){
	        	if(gridtree.config.width != NULL){
					if(gridtree.config.width == '100%'){
						gridtree.setWidth($(window.parent.parent.document.body).width());
					}
				}
	        	if(gridtree.config.height != NULL){
					if(gridtree.config.height == '100%'){
						gridtree.setHeight(gridtree.getBodyHeight()-changeheigh);
					}
				}
	        }, false);
	    } else { // IE
	        window.attachEvent('onresize', function(){
	        	if(gridtree.config.width != NULL){
					if(gridtree.config.width == '100%'){
						gridtree.setWidth(document.body.clientWidth);
					}	
				}
	        	if(gridtree.config.height != NULL){
					if(gridtree.config.height == '100%'){
						gridtree.setHeight(gridtree.getBodyHeight()-changeheigh);
					}
				}
	        });
	    }
		//���ø����initComponent����
		TreeGrid.superclass.initComponent.call(this);
	},
	getBodyHeight: function(){
    	var headObj = document.getElementById('headRegion');
    	var headObjHeight = 0;
    	var bodyHeight = document.body.clientHeight;
    	if(headObj != NULL){
    		headObjHeight = headObj.offsetHeight;
    	}
    	
    	bodyHeight = bodyHeight -  headObjHeight;
    	return bodyHeight;
    },
    getBodyWidth: function(){
    	var headObj = document.getElementById('headRegion');
    	var headObjWidth = 0;
    	var bodyWidth = document.body.clientWidth;
    	if(headObj != NULL){
    		headObjWidth = headObj.offsetWidth;
    	}
    	
    	bodyWidth = bodyWidth -  headObjWidth;
    	return bodyWidth;
    },
    load: function(url){
    	store.proxy.url = url;
    	store.load();
    },
    reload: function(){
    	isSearch=true;
    	genGridTree(gridUrl);
    },
    getStore: function(){
    	return store;
    },
    getData: function(){
    	var data = [];
    	var childNodes = store.getRootNode().childNodes;
    	this.genDataArr(data,childNodes);
    	return data;
    },
    genDataArr: function(data,root){
		for(var i=0;i<root.length;i++){
    		data.push(root[i].raw);
    		var childNodes = root[i].childNodes;
    		if(root[i].isExpanded()){
    			this.genDataArr(data,childNodes);
    		}
    	}
    },
	appendNewChild: function(nodeId, cfg){
		if(nodeId == -1){
			store.tree.root.appendChild(cfg);
			this.defaultSort();
		}else{
			var node = store.getNodeById(nodeId);
			if(node.isExpanded()){
				node.leaf = false;
				node.appendChild(cfg);
				this.defaultSort();
			}else{
				node.expand();
				this.defaultSort();
			}
		}
	},
	defaultSort: function(){
		var sortObj = store.sorters.items;
		if(sortObj.length >= 2){
			store.sort(sortObj[1].property, sortObj[1].direction);
		}else{
			if(this.sortColumn){
				store.sort(this.sortColumn);
			}
		}
	},
	
	updateNodeData: function(nodeId, cfg){
		var node = store.getNodeById(nodeId);
		for(key in cfg){
			node.set(key, cfg[key]);
		}
	}
});
var isFirstExpand = true;
function overExpand(){
	isFirstExpand = true;
	enableButton();
	gt.doLayout();
}
function expandNode4OneByOne(level,length){
	if(store.getRootNode().childNodes.length == 0){
		overExpand();
		return;
	}	
	if(level == store.getRootNode().childNodes.length){
		overExpand();
		return;
	}
	var currentLevel = level.split('-');
	var code = 'store.getRootNode()';
	for(var i = 0; i < currentLevel.length; i++){
		code += '.childNodes['+currentLevel[i]+']';
	}
	if(eval(code + '.isExpanded()')){
		overExpand();
		return;
	}
	setTimeout(code + '.expand();',0);
	if(length == undefined){
		length = store.getRootNode().childNodes.length;
	}
	//�жϵ�ǰ�ڵ��Ƿ�չ����չ������չ��
	setTimeout('isExpand("'+level+'","'+code+'",'+length+')',10);
}
function isExpand(level,code,length4Parent){
	var newCode = code + '.isExpanded()';
	if(eval(newCode) || eval(code + '.isLeaf()')){
		var currentLevel = level.split('-');
		var length = eval(code + '.childNodes.length');
		if(length > 0 && currentLevel.length < showLevelTemp - 1){
			level += '-0';
			length4Parent = length;
		}else{
			if(level == store.getRootNode().childNodes.length - 1){
				overExpand();
				return;
			}
			currentLevel[currentLevel.length - 1] = currentLevel[currentLevel.length - 1] * 1 + 1;
			level = '';
			if(currentLevel[currentLevel.length - 1] < length4Parent){
				for(var i = 0; i < currentLevel.length; i++){
					if(i == 0){
						level += currentLevel[i];
					}else{
						level += '-' + currentLevel[i];
					}
				}
			}else{
				for(var i = 0; i < currentLevel.length - 1; i++){
					if(i == currentLevel.length - 2){
						if(level == ''){
							length4Parent = store.getRootNode().childNodes.length;
						}else{
							var lengthArr = level.substring(0,level.length-1).split('-');
							var lenCode= 'store.getRootNode()';
							for(var i = 0; i < lengthArr.length; i++){
								lenCode += '.childNodes['+lengthArr[i]+']';
							}
							length4Parent = eval(lenCode + '.childNodes.length');
						}
						level += currentLevel[i] * 1 + 1;
					}else{
						level += currentLevel[i] + '-';
					}
				}
			}
		}
		if(level == ''){
			overExpand();
			return;
		}else{
			expandNode4OneByOne(level,length4Parent)
		}
	}else{
		setTimeout('isExpand("'+level+'","'+code+'",'+length4Parent+')',10);
	}
}

function disableButton(){
	window.parent.disableToolbarBtn('addBtn');
	window.parent.disableToolbarBtn('searchBtn');
	window.parent.disableToolbarBtn('exportBtn');
	window.parent.disableToolbarBtn('showLevelBtn');
	$('#quickSearchText').attr('disabled','disabled');
	document.getElementById("quickSearchImg").onclick = function(){};
	$('#filterSelect').attr('disabled','disabled');
	try{
		window.parent.hiddenMask();
	}catch(e){}
	try{
		mask.hide();
	}catch(e){}
	isFirstExpand = false;
	
	expandNode4OneByOne("0");
}
function enableButton(){
	//�ж��Ƿ���Ҫ�����½���ť
	disableToolbarBtn4other();
	$('#quickSearchText').removeAttr('disabled');
	document.getElementById("quickSearchImg").onclick = quickSearch;
	$('#filterSelect').removeAttr('disabled');
}