var Common = {
		Data: {
			//返回当前时间 格式为 yyyy-MM-dd hh:mm:ss
			getDate: function(){
			    var objDate=new Date();//创建一个日期对象表示当前时间

				var dateFmt = "yyyy-MM-dd hh:mm:ss";
				with(objDate){
					var month = getMonth()+1;
					var date = getDate();
					var hours = getHours();
					var minutes = getMinutes();
					var seconds = getSeconds();
			
					if(month < 10){
						month = "0" + month;
					}
					if(date < 10){
						date = "0" + date;
					}
					if(hours < 10){
						hours = "0" + hours;
					}
					if(minutes < 10){
						minutes = "0" + minutes;
					}
					if(seconds < 10){
						seconds = "0" + seconds;
					}
					dateFmt = dateFmt.replace('yyyy', getFullYear());
					dateFmt = dateFmt.replace('MM', month);
					dateFmt = dateFmt.replace('dd', date);
					dateFmt = dateFmt.replace('hh', hours);
					dateFmt = dateFmt.replace('mm', minutes);
					dateFmt = dateFmt.replace('ss', seconds);
				}
			
				return dateFmt;
			},
			//判断是否是数字 否返回false
			isNumber: function(str){
				if(str.match("\^[-]?[0-9]+([.][0-9]*)?\$")){
				       return true;
				}else{
				       return false;
				}
			},
			//替换字符串 str 被替换的字符串 x 被替换的字符 y 替换后的字符
			replaceAll: function(str, x, y){
				while(str.indexOf(x) != -1){
					str = str.replace(x,y);
				}
				return str;
			}
		}		
		
}