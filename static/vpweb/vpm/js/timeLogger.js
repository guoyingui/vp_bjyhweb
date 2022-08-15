/**
* 计算页面加载时间
* 用法：tl.log('加载位置');
*       最后一个加载位置后写：tl.show();
*/
var tl=timeLog={
			pinList:[{reson:'',time:new Date().getTime(),interval:0,total:0}],
			log:function(reson){
				var curTime=new Date().getTime(),me=this,pres=me.pinList,pre=pres[pres.length-1];
				
				var cur={reson:reson,time:curTime,interval:curTime-pre.time,total:curTime-pres[0].time};
				pres.push(cur);
			},
			showLog:function(){
				var logs=document.createElement('ul');
				logs.style.height='500px';
				logs.style.width='330px';
				logs.style.position='absolute';
				logs.style['list-style-type']='none';
				logs.style.padding='0px';
				logs.style.left='400px';
				logs.style.top='200px';
				logs.style.zIndex=2000;
				logs.style.overflowY='auto';
				logs.style.overflowX='hidden';
				logs.style.background='white';
				logs.style.border='1px solid #000';
				document.body.appendChild(logs);
				this.logs=logs;
			},
			showLogItem:function(log,color){
				var item=document.createElement('li');
				item.style.height='20px';
				item.style.width='330px';
				//item.style.backgroundColor=log.interval?'red':color;
				item.style.borderBottom='1px solid #aaa';
				item.innerHTML='<div style="width:110px;float:left;overflow:hidden;">'+log.reson+'</div><div style="width:110px;float:left;">'+(log.interval)+'ms</div><div style="width:110px;float:left;">'+(log.total)+'ms</div>';
				this.logs.appendChild(item);
			},showMap:function(log,color){
				var item=document.createElement('li');
				item.style.height='20px';
				item.style.width='330px';
				item.style.backgroundColor=color;
				item.style.borderBottom='1px solid #aaa';
				item.innerHTML='<div style="width:110px;float:left;">'+log.reson+'</div><div style="width:110px;float:left;">'+(log.times)+' </div><div style="width:110px;float:left;">'+(log.time)+' </div>';
				this.logs.appendChild(item);
			},init:function(){
				this.showLog();
			},
			show:function(){
				this.init();
				var ls=this.pinList;
				
				for(var i=0,l=ls.length;i<l;i++){
					this.showLogItem(ls[i],i%2==0?'#ccc':'#fff');
					
				}
			}
		};