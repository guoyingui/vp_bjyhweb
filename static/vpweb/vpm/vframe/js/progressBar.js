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
		var renderTo = '';    //������ʾ��������div ID
		var width = 100;    //���������(���ص�λ,Ĭ��100)
		var height = 18;    //�������߶�(���ص�λ,Ĭ��18)
		//var cssName = '';   //������дCSS�����ý��ȵ���ɫ
		var imgUrl = '/project/vframe/images/other/jdt_bg.gif';  //������ͼƬ(ͼƬ���ظ߶�Ҫ��������߶����)
		//var borderColor = '#d9d9d9';  //�������߿�ɫ
		var backgroundColor = '#E8E8E8'; //����������ɫ
		var percent = 0;  //�������ٷֱ�ֵ  �� 58% �봫58(���ص�λ)
		var title = '%';  //�����ͣ�ڽ�������ʱ��ʾ������(Ĭ����ʾ��ǰ�ٷֱ�ֵ)

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