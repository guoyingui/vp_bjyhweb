	

var changegrid;		//������ѭ�����ñ�ʾ
var changing=false;	 //���������ڽ��б�ʾ
var renderTo;
var cm=[];			//columnModel����
var csum=0;			//child�����͸��ٱ�־
var childNumArray=[];//������������
var fileds;			//json��ȡ����	
var store;	//�������ݵ�dataStore
var tcount;	//grid�е���������
var j=0;	//���childNumArray�������ñ�ʾ
var dgrid;//����չʾ���ݵ�grid.
var firstColumnFunc;
var outpanel;
var hasSpecialRow=false;
var specialRow=0;
var specialRowHeight=0;
var expanded=false;
var bodyMask;
var maskingCount=0;
var initedMaskCount=false;
var defConfig;
function initAutoLoad(config){
	if(config.autoLoad==undefined)
		config.autoLoad=true;
	defConfig=config;
}
function LockGrid(config){
	initAutoLoad(config)
	bodyMask.show();	
	initCmAndFileds(config);
	
	 store=initDataStore(config);
	
	//����չʾ���ݵ�grid
    dgrid =genGridPanel(config.pageSize);
    
    
    //�������panel
	put2OutPanel(config,dgrid);
	
	//��������
	if(config.autoLoad){
    	store.load({params:{start:0,limit:config.pageSize},callback : function(r, options, success) {
				maskingCount=store.getCount();
				initedMaskCount=true;
				if(maskingCount==0){
					bodyMask.hide();
					initedMaskCount=true;
				}
			}});
	}else{
			bodyMask.hide();
	}
    dgrid.show();
    
    //������
    //startFixGrid();
    

	
 this.load = function(url,size){
    	if(url){
    		store.proxy = new Ext.data.HttpProxy({url:url});
    	}
		store.load({params:{start:0, limit:size},
			callback : function(r, options, success) {
				maskingCount=store.getCount();
				initedMaskCount=true;
				if(maskingCount==0){
					bodyMask.hide();
					initedMaskCount=true;
				}
			}
		});
		
    };

    this.reload = function(){
    	
    	store.reload();
    };
   this.reconfig=function(config){
	   	outpanel.removeAll();
	   	initCmAndFileds(config);
		
		 store=initDataStore(config);
		
		
		 dgrid =genGridPanel(config.pageSize);
		 //put2OutPanel(config,dgrid);
		 outpanel.add(dgrid);
		 outpanel.doLayout();
		 store.load({params:{start:0,limit:config.pageSize}});
	    

	   //startFixGrid();
   }
}


function fRender(value,metadata,record,rowIndex){
		var html=value;
		if(firstColumnFunc)
			html=(firstColumnFunc)(value,metadata,record,rowIndex);
		return initExpander(value,metadata,record,rowIndex,html);
}

function initExpander(value,metadata,record,rowIndex,html){

	if(tcount!=store.getCount())
			tcount=store.getCount();
			initChildNumArray(value,metadata,record,rowIndex);
	var thtml='';
	if((!(record.get('childnum')===''))&&(record.get('childnum')>0))
		thtml='<a hide="'+getHidevalue()+'" childnum="'+record.get('childnum')+'" href="#" onclick="hideNext(this)" style="float:left;">'+getExpandImage()+'</a><div style="width:10px;border:0px solid #000;float:left;"></div><div style="float:left;">'+html+'</div>';
	else if((!(record.get('childnum')===''))&&(record.get('childnum')==='0')){
			thtml='<div style="width:0px;border:0px solid #000;float:left;"></div><div style="float:left;">'+html+'</div></div>';

	}else
			thtml='<div style="width:35px;border:0px solid #000;float:left;"></div><div style="float:left;">'+html+'</div></div>';
	return thtml;
}

function showMask(){
	bodyMask.show();
}

function hideMask(){
	if(!initedMaskCount)
		return;
	else{
		if(maskingCount==0){
			initedMaskCount=false;
			bodyMask.hide();
		}
	}
}
function initCmAndFileds(config){
	initVars(config);
	tcount=0;
				
	//��ʼ��		
	(function(){
		var buildFucntion=false;
		renderTo=config.renderTo;
		//cm.push(expandHeader);
		cm=[];
		fileds=[];
		for(var i=0;i<config.userCm.length;i++){
			if(!buildFucntion){
				if(config.userCm[i].locked){
					firstColumnFunc=config.userCm[i].renderer;
					config.userCm[i].renderer=fRender;
					buildFucntion=true;
				}	
			}
			cm.push(config.userCm[i]);
			if(config.userCm[i].header!='childnum')
				fileds.push({name:config.userCm[i].dataIndex,type:'string'});
		}
		fileds.push({name: 'childnum',type:'string'});
		
		//config.userFileds.push({name: 'childnum'});
		//fileds=config.userFileds;
		
		
			
			
		/*for(var j=0;j<config.data.length;){
			if(config.data[j].childnum>0){
				childNumArray.push(config.data[j].childnum);
				j+=config.data[j].childnum+1;
			}else{
				childNumArray.push(0);
				j++;
			}
			
		}*/
	})();
	
	
	
}

function initVars(config){
	hasSpecialRow=config.hasSpecialRow;
	specialRow=config.specialRow;
	specialRowHeight=config.specialRowHeight;
	expanded=config.expanded;
}

function getHidevalue(){

	if(expanded)
		return '0';
	else
		return '1';
}

function getExpandImage(){


	var imagesrc='';
	if(expanded)
		imagesrc= '<img src="/project/vframe/images/ext/default/grid/group-collapse.gif"/>';
	else
		imagesrc= '<img src="/project/vframe/images/ext/default/grid/group-expand.gif"/>';
	return imagesrc;
}

function initDataStore(config){
	return new Ext.data.Store({
			proxy: new Ext.data.HttpProxy({url:config.url}),
			reader: new Ext.data.JsonReader({
			totalProperty: 'totalProperty',
			root: 'root',
			successProperty: 'successProperty',
			autoLoad: config.autoLoad
			},fileds),
			remoteSort:((config.remoteSort===false)?false:true)
		});
}


function genGridPanel(psize){
	var lcm=new Ext.ux.grid.LockingColumnModel(cm);
	lcm.config[0].locked = true;
	var pconfig={
		loadMask:false,
		enableColumnMove:false,
        store: store,
        colModel:lcm,
        stripeRows: true,
        view: new Ext.ux.grid.LockingGridView(),
        hidden:true,
        viewConfig:{
        forceFit:true
        }
    };
     if(psize){
    	pconfig.bbar=new Ext.PagingToolbar({
            pageSize: psize,
            store: store,
           	displayInfo: false,
            displayMsg: '��ʾ���� {0} - {1} ��,����{2}��',
            emptyMsg: "û������",
            height:28
            
        });
    }
	var loacaltPanel= new Ext.grid.GridPanel(pconfig);
   
    return loacaltPanel;
}

function initChildNumArray(value,metadata,record,rowIndex){
	if(rowIndex==0){//��һ��
		bodyMask.show();
		childNumArray=[];
	}
							
	if(record.get('childnum')>0){
		childNumArray.push(parseInt(record.get('childnum')));
		j+=parseInt(record.get('childnum'))+1;
	}else{
		if(!(rowIndex<j)){
			childNumArray.push(0);
			j++;
		}
	}
	//if(rowIndex!=0&&rowIndex==tcount-1)					
	if(rowIndex==tcount-1){
		j=0;
		startFixGrid();
	}	

}


function put2OutPanel(config,grid){

	var headRegion=Ext.get(config.headRegion);
	var pheight=config.height;
	if(config.headRegion){
		pheight -=headRegion.getComputedHeight();
	}
	
	outpanel= new Ext.Panel({
		layout:'fit',
        renderTo: config.renderTo,
        height:pheight,
       // html:"",
        items:[grid]
    });
}

function startFixGrid(){

	if(tcount==0)
		return;

	 if(!changing){
    	changing=true;
    	hideGridbody();
    	changegrid=setInterval("fixGrid()",5);
    }

}


function hideGridbody(){
	jQuery('#'+renderTo).find('.x-grid3-body').each(function(){
		jQuery(this).css('display','none');
	});

}

function showGridbody(){
	jQuery('#'+renderTo).find('.x-grid3-body').each(function(){
		jQuery(this).css('display','block');
	});

}


	function fixGrid(){

		if(jQuery('#'+renderTo).find('.x-grid3-row').length==tcount*2){
			 changeGrid();
			 clearInterval(changegrid);
			 changing=false;
			 
		}
		initedMaskCount=false;
		bodyMask.hide();
	}
	





		//��������庯��
		function changeGrid(){
			
			jQuery('#'+renderTo).find('.x-grid3-body').each(function(){
				var n=0,r=0;
				jQuery(this).find('.x-grid3-row').each(function(i){
					if(jQuery(this).css('display')=='none')
						return;	
					if(i>0&&(!(i>r)))
						return;
					else
						r=i;
					n=i==0?0:n;
					
					var tempobj=jQuery(this);
					for(var k=0;k<childNumArray[n];k++){
						if(hasSpecialRow){
							if(k==specialRow){
								tempobj.next('div').css('height',specialRowHeight+'px');
							}
						}
						if(!expanded)
							tempobj.next('div').css('display','none');	
						tempobj=tempobj.next('div');
						r++;
						
						
					}
					n++;
					
					
			});
			
		});
			//dgrid.show();
			showGridbody();
			
	}
	
	
	

	
	
	//�������ʶ�д�������
	function hideNext(obj){
		var childnum=parseInt(jQuery(obj).attr('childnum'));
		var tempobj=jQuery(".x-grid3-row-selected"); 
		if(jQuery(obj).attr('hide')=='0'){
			for(var i=0;i<childnum;i++){
				tempobj.next('div').css('display','none');
				tempobj=tempobj.next('div');
			}
			jQuery(obj).attr('hide','1');
			jQuery(obj).find('img').each(function(){
				jQuery(this).attr('src','/project/vframe/images/ext/default/grid/group-expand.gif');
			});
		}else{
			for(var i=0;i<childnum;i++){
				tempobj.next('div').css('display','block');
				tempobj=tempobj.next('div');
			}
			jQuery(obj).attr('hide','0');
			jQuery(obj).find('img').each(function(){
				jQuery(this).attr('src','/project/vframe/images/ext/default/grid/group-collapse.gif');
			});
		}
		

	}
	
	function initMask(maskDiv){
 		bodyMask=new Ext.LoadMask(Ext.get(maskDiv), {msg:"��ȡ��..."});
	}

	(function(){
		document.write('<style type="text/css">'+
						'.x-panel-bbar .x-toolbar{padding:4px 0px 3px 0px !important; }'+
						'.x-toolbar-cell .x-btn-text{font-size:0px !important;height:15px !important;}'+
						'</style>');
	})();
	
	