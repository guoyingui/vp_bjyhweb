
var NavCfg={
		cache:null,
		genRow:null,
		init:function(cfg){
			this.selObj={l1:0,l2:0,l3:0};
			this.height=cfg.height||550;
			this.width=cfg.width||850;
			this.cache=cfg.data;
			this.genRow=cfg.genRow;
			this.outter=jQuery('#'+cfg.renderTo);
			this.outter.html('<div id="nav-sortable-div"></div>');
			this.target=jQuery('#nav-sortable-div');
			this.genRowObj=cfg.genRowObj;
			this.headTable=cfg.headTable;
			this.useSelfRefresh=cfg.refresh||function(){};
			this.render();
			
		},
		genSeleStastic:function(){
			this.ssObj={};
			this.ssObj.level1Num=this.target.find('.drag-unit[isChecked=1][level=1]').length;
			this.ssObj.level2Num=this.target.find('.drag-unit[isChecked=1][level=2]').length;
			this.ssObj.level3Num=this.target.find('.drag-unit[isChecked=1][level=3]').length;
		},
		disabled:function(){
			jQuery('#nav-sortable-div').sortable("disabled");
		},
		searchAllUnit:function(){
			this.allUnits=[];
			this.target.find('.drag-unit').each(function(){
				//alert(jQuery(this).attr('sequenceKey'));
				NavCfg.allUnits.push(NavCfg.genRowObj(jQuery(this)).toString());
			});
			return encodeURIComponent('{navs:['+this.allUnits.join(',')+']}');
			
		},
		updateKeys:function(res){
			this.target.find('.drag-unit').each(function(i){
				var cur=jQuery(this),newcur=res[i];
				cur.attr({canMoveOff:newcur.canMoveOff,sequenceKey:newcur.sequenceKey,parentId:newcur.parentId});
				/*cur.find('.canmoveoff').each(function(){
					jQuery(this).text(newcur.canMoveOff);
				});
				cur.find('.sequencekey').each(function(){
					jQuery(this).text(newcur.sequenceKey);
				});
				cur.find('.parentid').each(function(){
					jQuery(this).text(newcur.parentId);
				});*/
			});
		},
		update:function(curItem,curSortable,drag){
			//jQuery(this).sortable("cancel");
			if(drag==1&&curItem.attr("canMoved")==0){
				curSortable.sortable("cancel");
			}
			jQuery.ajax({
				url: '/project/system/navigation/NavigationManageAction.do',
				data: {
					themethod:'updateNavList',
					codeType:'utf-8',
					navs:NavCfg.searchAllUnit(),
					curId:drag==1?curItem.attr("id"):0,
					drag:drag
				},
				type: 'post',
				async: false,
				success: function(res) {
					if(res.successful){
						if(drag==1){
							NavCfg.updateKeys(res.res);
						}else{
							// modify by oyq 删除后重新刷新问题，原因：导航分类初始化后删除时无法有效删除等操作
							// window.location.reload();
							window.location = window.location.href.replace("init=true","init=false");
						}
						//
						
					}else{
						if(drag==1){
							curSortable.sortable("cancel");
						}
					}
					
				},
				dataType: 'json'
			});
		},
		render:function(){
			this.target.remove();
			var outterHtml='<div >'+this.headTable+'<div id="nav-sortable-div" style="height:'+this.height+'px;width:'+this.width+'px;overflow-y:scroll;"></div>';
			this.outter.html(outterHtml);	
			this.target=jQuery('#nav-sortable-div');
			
			var thtml='';
			for(var i=0;i<this.cache.length;i++){
				thtml+=this.genRow(this.cache[i]);
			}

			this.target.html(thtml);
			
			
			this.sortableTarget();

		},
		refreshSize:function(height,width){
			jQuery('#nav-sortable-div').css({height:height+'px',width:width+'px'});
			this.useSelfRefresh(height,width);
		},
		kickChildrenOut:function(){

			var cc=this.childrenCache;
			for(var i=cc.length;i>-1;i--){
				this.curMoveJO.after(cc[i]);
			}
			cc=null;
		},
		sortableTarget:function(){
			this.target.sortable({
				opacity:0.8,
				forcePlaceholderSize:true ,
				placeholder:"ui-state-highlight",
				stop:function(event, ui){
					NavCfg.kickChildrenOut();
				},
				update : function(event, ui) {
					
					var curItem=ui.item,curSortable=jQuery(this),drag=1;
					NavCfg.update(curItem,curSortable,drag);
				}
				});
		},
		wrapChild:function(obj){
			var parent=jQuery(obj);
			this.curMoveJO=parent;
			this.curMoveEl=this.genRowObj(parent);
			
			this.childrenCache=[];
			
			if(parent.hasClass('level1')){
				parent.nextAll('div .drag-unit').each(function(i){
					var cur=jQuery(this);
					if(cur.hasClass('level1')){
						return false;
					}else{
						NavCfg.childrenCache.push(cur);
						parent.append(cur);
						
					}
					
				});
			}else if(parent.hasClass('level2')){
				parent.nextAll('div .drag-unit').each(function(i){
					var cur=jQuery(this);
					if(cur.hasClass('level1')||cur.hasClass('level2')){
						return false;
					}else{
						parent.append(cur);
						NavCfg.childrenCache.push(cur);
					}
					
				});
			}
			this.curMoveLength=(parent.find('.drag-unit').length||0)+1;
		},
		refresh:function(obj){
			this.genTempCatche();
			if(this.check()){
				this.cache=this.tempCache;
				//this.scheduleSK();
			}else{
				;
			}
			if(this.jumpCheck){
				this.jumpCheck=false;
				return;
			}
			//this.render();
		},
		clearChanged:function(){
			this.changed=[];
		},
		collectChanged:function(el){
			if(!this.changed){
				this.changed=[];
			}else{
				this.changed.push(el);
			}
		},
		setSequenceKey:function(el,sequenceKey){
			if(el.sequenceKey!=sequenceKey){
				//alert(el.sequenceKey+'--'+sequenceKey)
				el.sequenceKey=sequenceKey;
				this.collectChanged(el);
			}
		},
		scheduleSK:function(){
			var levelMark={l1:0,l2:0,l3:0,canMoveOff:1,l1Id:-1,l2Id:-1};
			for(var i=0;i<this.cache.length;i++){
				if(this.cache[i].level==1){
					levelMark.l1++;
					levelMark.l2=0;
					levelMark.l3=0;
					levelMark.canMoveOff=this.cache[i].canMoveOff;
					this.cache[i].parentId=-1;
					levelMark.l1Id=this.cache[i].id;
				}else if(this.cache[i].level==2){
					levelMark.l2++;
					levelMark.l3=0;
					this.cache[i].parentId=levelMark.l1Id;
					levelMark.l2Id=this.cache[i].id;
				}else{
					levelMark.l3++;
					this.cache[i].parentId=levelMark.l2Id;
				}
				var code=this.genSingleKey(levelMark.l1)+this.genSingleKey(levelMark.l2)+this.genSingleKey(levelMark.l3);
				this.setSequenceKey(this.cache[i],code);
				this.cache[i].canMoveOff=levelMark.canMoveOff;
			}  
			//alert(this.changed.length);
			this.clearChanged();
		},
		genSingleKey:function(num){
			var code;
			if(num<1){
				return '';
			}else if(num<10){
				code= '000'+num;
			}else if(num<100){
				code= '00'+num;
			}else if(num<1000){
				code= '0'+num;
			}else if(num<100){
				code= ''+num;
			}
			return code;
		},
		
		updateSequenceKey:function(){
			jQuery.ajax({
				url: '/project/system/navigation/NavigationManageAction.do',
				data: {
					themethod:'updateNavList',
					codeType:'utf-8',
					navs:NavCfg.searchAllUnit()
				},
				type: 'post',
				async: false,
				success: function(res) {
					data = res.res;
				}, 
				dataType: 'json'
			});
		},
		deleteRows:function(){
			var cArray=[],containsNotSelectedChild=false,containsGodUnit=false;
			this.target.find('.drag-unit[isChecked=1]').each(function(){
				var cur=jQuery(this),curlevel=cur.attr('level'),pushed=false;
				if(cur.attr('canDelete')==0){
					containsGodUnit=true;
					return false;
				}
				if(curlevel==3){
					NavCfg.pushDelEl(cArray,cur);
					pushed=true;
					return;
				}else if(curlevel==2){
					cur.find('.drag-unit').each(function(){
						if(jQuery(this).attr('isChecked')==0){
							containsNotSelectedChild=true;
							return false;
						}
					});
					if(containsNotSelectedChild){
						return false;
					}
					cur.nextAll('.drag-unit').each(function(){
						child=jQuery(this);
						if(child.attr('level')==2||child.attr('level')==1){
							NavCfg.pushDelEl(cArray,cur);
							pushed=true;
							return false;
						}else{
							if(child.attr('isChecked')==0){
								containsNotSelectedChild=true;
								return false;
							}
						}
					});
					if(containsNotSelectedChild){
						return false;
					}
					
				}else if(curlevel==1){
					cur.find('.drag-unit').each(function(){
						var curSec=jQuery(this);
						if(curSec.attr('isChecked')==0){
							containsNotSelectedChild=true;
							return false;
						}

						curSec.find('.drag-unit').each(function(){
							if(jQuery(this).attr('isChecked')==0){
								containsNotSelectedChild=true;
								return false;
							}
						});
						if(containsNotSelectedChild){
							return false;
						}
					});
					if(containsNotSelectedChild){
						return false;
					}
					cur.nextAll('.drag-unit').each(function(){
						child=jQuery(this);
						if(child.attr('level')==1){
							NavCfg.pushDelEl(cArray,cur);
							pushed=true;
							return false;
						}else{
							if(child.attr('isChecked')==0){
								containsNotSelectedChild=true;
								return false;
							}
						}
					});
				}
				if(containsNotSelectedChild){
					return false;
				}else{
					if(!pushed){
						NavCfg.pushDelEl(cArray,cur);
					}
				}
				
			});
			
			if(containsGodUnit){
				alert('您选择了不能删除的节点，请重新确认!');
				
			}else if(containsNotSelectedChild){ 
				alert('你要删除的节点下存在下级元素，请重新确认!');
				
			}else{
				if(cArray.length<1){
					alert('您未选择任何节点，请重新确认!');
					return;
				}
				var ok=confirm('您确认删除吗?'),tempCache=[];
				/*for(var i=0;i<cArray.length;i++){
					cArray[i].remove();
				}*/
				if(ok){
					var ids='',delLst=[];
					for(var i=0;i<this.cache.length;i++){
						if((!this.cache[i].willDie)||this.cache[i].willDie==0){
							tempCache.push(this.cache[i]);
						}else{
							if(ids!=''){
								ids+=','+this.cache[i].id;
							}else{
								ids+=this.cache[i].id;
							}
							delLst.push(this.cache[i]);
						}
					}
					
					this.delRowsOnServer(ids,delLst);
					
					
				}
			}
			this.clearPreSelect();
		},
		delRowsOnServer:function(ids,delLst){
			jQuery.ajax({
				url: '/project/system/navigation/NavigationManageAction.do',
				data: {
					themethod: 'deleteNavs',
					ids:ids
				},
				type: 'post',
				async: false,
				success: function(res) {
					if(res.successful){
						//NavCfg.cache=tempCache;
						//NavCfg.render();
						jQuery('.drag-unit').each(function(){
							var curdel=jQuery(this);
							for(var j=0;j<delLst.length;j++){
								if(curdel.attr('id')==delLst[j].id){
									curdel.remove();
									break;
								}
							}
						});
						NavCfg.update(null, null, 0);
						
					}
				},
				dataType: 'json'
			});
		},
		clearPreSelect:function(){
			for(var i=0;i<this.cache.length;i++){
				this.cache[i].willDie=0;
			}
		},
		pushDelEl:function(array,el){
			array.push(el);
			var id=el.attr('id');
			for(var i=0;i<this.cache.length;i++){
				if(this.cache[i].id==id){
					this.cache[i].willDie=1;
					break;
				}
			}
		},
		genTempCatche:function(){
			var tempCache=[],newIndex=-1,preIndex=-1;
			if(!NavCfg.curMoveEl){
				this.jumpCheck=true;
				return;
			}
			this.target.find('.drag-unit,.ui-state-highlight').each(function(i){
				var newObj=NavCfg.genRowObj(jQuery(this));
				if(newObj.sequenceKey==NavCfg.curMoveEl.sequenceKey){
					preIndex=i;
				}else if(!newObj.sequenceKey){
					newObj=NavCfg.curMoveEl;
					newIndex=i;
				}
				tempCache.push(newObj);
			});
			if(newIndex==-1||preIndex==-1){
				this.jumpCheck=true;
			}if(preIndex<newIndex){
				var a1=tempCache.slice(0,preIndex),
				a2=tempCache.slice(preIndex+this.curMoveLength,newIndex),
				a3=tempCache.slice(preIndex,preIndex+this.curMoveLength),
				a4=tempCache.slice(newIndex+1,tempCache.length),
				a5=a1.concat(a2).concat(a3).concat(a4);
				this.tempCache=a5;
			}else{
				var a1=tempCache.slice(0,newIndex),
				a2=tempCache.slice(preIndex,preIndex+this.curMoveLength),
				a3=tempCache.slice(newIndex+1,preIndex),
				a4=tempCache.slice(preIndex+this.curMoveLength,tempCache.length),
				a5=a1.concat(a2).concat(a3).concat(a4);
				this.tempCache=a5;
			}
			
		},
		selectCurRow:function(obj){
			var cur=jQuery(obj),curParent=cur.parents('.drag-unit');
			var checked,level;
			level=curParent.attr('level');
			if(cur.is(':checked')){
				curParent.attr('isChecked',1);
				checked=true;
			}else{
				curParent.attr('isChecked',0);
				checked=false;
			}
			this.configSelObj(level,checked);
		},
		configSelObj:function(level,checked){
			if(checked){
				if(level==1){
					this.selObj.l1++;
				}else if(level==2){
					this.selObj.l2++;
				}else if(level==3){
					this.selObj.l3++;
				}
			}else{
				if(level==1){
					this.selObj.l1--;
				}else if(level==2){
					this.selObj.l2--;
				}else if(level==3){
					this.selObj.l3--;
				}
			}
			
			this.cfgButtons();
		},
		cfgButtons:function(){
			
		},
		check:function(){
			if(this.jumpCheck){
				return false;
			}
			var tempCache=this.tempCache,curMove=this.curMoveEl;
			for(var i=0;i<tempCache.length;i++){
				if(tempCache[i].sequenceKey&&(tempCache[i].sequenceKey==curMove.sequenceKey)){
					if(curMove.level==1){
						if(curMove.canMoved==0){
							return false;
						}
						if(i+1==tempCache.length){
							return true;
						}
						for(var j=i+1;j<tempCache.length;j++){
							if(tempCache[j].level==1){
								return true;
							}else{
								if(tempCache[j].sequenceKey.indexOf(curMove.sequenceKey)!=0){
									return false;
								}
							}
						}
						return true;
					}else{
						if(i==0){
							return false;
						}
						if(curMove.canMoveOff==0){
							for(var j=i;j>-1;j--){
								if(tempCache[j].level==1){
									if(curMove.sequenceKey.indexOf(tempCache[j].sequenceKey)!=0){
										return false;
									}else{
										break;
									}
								}
							}
						}
						
						if(curMove.level==2){
							if(i+1==tempCache.length){
								return true;
							}
							for(var j=i+1;j<tempCache.length;j++){
								if(tempCache[j].level==1||tempCache[j].level==2){
									return true;
								}else{
									if(tempCache[j].sequenceKey.indexOf(curMove.sequenceKey)!=0){
										return false;
									}
								}
							}
							return true;
					}else if(curMove.level==3){
						if(i==0){
							return false;
						}else{
							if(tempCache[i-1].level==1){
								return false;
							}else{
								return true;
							}
						}
						
					}
				}
				}
			}
		},
		clickCB:function(obj,cv,v){
			if(cv==v){
				jQuery(obj).attr("checked","checked")
			}else{
				jQuery(obj).removeAttr("checked");
			}
		},
		appendArea:function(obj){
			var str=this.genRow(obj),areas=this.target.find('.drag-unit[level=1]'),lastArea=jQuery(areas[areas.length-1]);
			if(lastArea.attr('canMoved')==1){
				this.append(str);
			}else{
				lastArea.before(str);
			}
			NavCfg.update(null,null,0);
			return false;
		},
		append:function(str){
			this.target.append(str);
		},
		findFUnit:function(){
			return this.target.find('.drag-unit[isChecked=1]')[0];
		},
		findFOneLevelUnit:function(){
			return this.target.find('.drag-unit[isChecked=1][level=1]')[0];
		},
		findFSecLevelUnit:function(){
			return this.target.find('.drag-unit[isChecked=1][level=2]')[0];
		},
		updateArea:function(obj){
			this.target.find('.drag-unit[id='+obj.id+']').each(function(){
				
				var unit=jQuery(this);
				
				unit.attr('name',obj.name);
				unit.attr('iconId',obj.iconId);
				unit.attr('iconUrl',obj.iconUrl);
				unit.attr('isSelfdefining',obj.isSelfdefining);
				
				unit.find('.name-div').each(function(){
					jQuery(this).text(obj.name);
					return false;
				});
				unit.find('.iconId').each(function(){
					jQuery(this).text(obj.iconId);
					return false;
				});
				return false;
			});
			
		},
		updateSet:function(obj){
			this.target.find('.drag-unit[id='+obj.id+']').each(function(){
				
				var unit=jQuery(this);
				
				unit.attr('name',obj.name);
				unit.attr('navHidden',obj.navHidden);
				
				
				unit.find('.name-div').each(function(){
					jQuery(this).text(obj.name);
					return false;
				});
				unit.find('.navHidden').each(function(){
					if(obj.navHidden==1){
						jQuery(this).attr('checked',true);
					}else{
						jQuery(this).removeAttr('checked');
					}
					
					return false;
				});
				return false;
			});
			
		},
		updateLink:function(obj){
			this.target.find('.drag-unit[id='+obj.id+']').each(function(){
				
				var unit=jQuery(this);			
				unit.attr('name',obj.name);
				
				
				unit.find('.link-name-div').each(function(){
					jQuery(this).text(obj.name);
					return false;
				});
				return false;
			});
			
		}
		
};