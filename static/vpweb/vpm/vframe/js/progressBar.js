var ProgressBar = {//function()
	showProgressBar : function(data,callback){
		this.makeBar(data,callback);
	},
	makeBar : function(data,callback){
		this.RndNum = function (n){
			var rnd="";
			for(var i=0;i<n;i++)
			rnd+=Math.floor(Math.random()*10);
			return rnd;
		};
		var renderTo = '';    //用于显示进度条的div ID
		var width = 100;    //进度条宽度(像素单位,默认100)
		var height = 18;    //进度条高度(像素单位,默认18)
		//var cssName = '';   //可自行写CSS来配置进度的颜色
		var imgUrl = '/project/vframe/images/other/jdt_bg.gif';  //进度条图片(图片像素高度要与进度条高度相等)
		//var borderColor = '#d9d9d9';  //进度条边框色
		var backgroundColor = '#E8E8E8'; //进度条背景色
		var percent = 0;  //进度条百分比值  如 58% 请传58(像素单位)
		var title = '%';  //鼠标悬停在进度条上时显示的文字(默认显示当前百分比值)

		var randomID = this.RndNum(9);
//		var divHTML = '<div id="_progressOutBar"><div id="_progressInBar"></div></div>';
		var divHTML = '<table id="_progressOutBar'+randomID+'"><tr><td><div id="_progressInBar'+randomID+'"></div></td></tr></div>';

		if(data.renderTo){
			renderTo = data.renderTo;
		}
		if(data.width){
			if(data.width<10){
				width = 100;
			}else{
				width = parseInt(data.width);
			}
		}
		if(data.height){
			if(data.height<0){
				height = 18;
			}else{
				height = parseInt(data.height);
			}
		}
		//if(data.cssName){
		//	cssName = data.cssName;
		//}
		if(data.imgUrl){
			imgUrl = data.imgUrl;
		}
		//if(data.borderColor){
		//	borderColor = data.borderColor;
		//}
		if(data.backgroundColor){
			backgroundColor = data.backgroundColor;
		}
		if(data.percent){
			percent = parseFloat(data.percent);
		}
		if(data.title){
			title = data.title;
		}else{
			title = data.percent+'%';
		}

		$('#'+renderTo).html(divHTML);
		$('#_progressOutBar'+randomID).attr('title',title)
			.css({
				//'border':'1px solid '+borderColor,
				'width':(width+2)+'px',
				'background-color':backgroundColor,
				'height':height+'px'
			});
		var _temp_percent = percent;
		if(percent<0){
			_temp_percent = 0;
		}
		var innerDivWidth = _temp_percent*(width/100);
		$('#_progressInBar'+randomID).css({
			'height': (height-2)+'px',
			'width':innerDivWidth+'px',
			'left':'0px',
			'background':'transparent url('+imgUrl+') repeat-x 0 0'
		});
		if(callback){
			$('#_progressOutBar'+randomID).css('cursor','hand').click(function(){callback();});
		}
	}
};