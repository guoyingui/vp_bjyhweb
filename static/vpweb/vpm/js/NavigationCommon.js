var NavCommon={
		 checkAreaName:function(eid,name,ideskid){
			var right=false;encodeURIComponent
			jQuery.ajax({
				url: '/project/system/navigation/NavigationManageAction.do',
				data: {
					themethod: 'checkAreaName',
					eid: eid,
					ideskid: ideskid,
					name: encodeURIComponent(name)
				},
				type: 'post',
				async: false,
				success: function(res) {
					right=res.successful;
				},
				dataType: 'json'
			});
			return right;
		},
		getImgsrc:function(canMoved,canMoveOff){
			if(canMoved==0){
				return '/project/images/icon_fix.gif';
			}else{
				if(canMoveOff==0){
					return '/project/images/icon_cycle.gif';
				}else{
					return '/project/images/icon_updown.gif';
				}
			}
			
		}
		,
		genImgTip:function(canMoved,canMoveOff){
			if(canMoved==0){
				return '位置固定';
			}else{
				if(canMoveOff==0){
					return '可在区域内移动';
				}else{
					return '可随意移动';
				}
			}
		},
		Tip:{
				  getTipDiv:function(ele){ 
					 if(!document.getElementById('wlt:tip')){
						 var cur=document.createElement('div');
						 document.body.appendChild(cur);
						 cur.setAttribute('id','wlt:tip');
						 cur.style.position='absolute';
						 cur.style.left='0px';
						 cur.style.top='0px';
						 cur.style.display='none';
						 cur.style.zIndex='1000';
						  cur.style.fontSize='12px';
						  cur.style.width='200px';
						  cur.style.border='1px solid #000';
						  cur.style.padding='2px';
						  cur.style.background='#FFFACD';
						  cur.style.color='#000';
					
					 }
					return document.getElementById('wlt:tip'); 

					  }, 
				  mousePos:function(e){ 
					var x,y; 
					var e = e||window.event; 
					return{
							x:e.clientX+document.body.scrollLeft+document.documentElement.scrollLeft, 
							y:e.clientY+document.body.scrollTop+document.documentElement.scrollTop
					}; 
				  }, 
				  show:function(obj,isRight){ 
					var self = this; 
					var t = self.getTipDiv(); 
					obj.onmousemove=function(e){ 
					  var mouse = self.mousePos(e);   
					  t.style.left = mouse.x - (isRight?200:-10) + 'px'; 
					  t.style.top = mouse.y + 10 + 'px'; 
					  t.innerHTML = obj.getAttribute("tips"); 
					  t.style.display = ''; 
					}; 
					obj.onmouseout=function(){ 
					  t.style.display = 'none'; 
					}; 
				  } 
			  }
 };