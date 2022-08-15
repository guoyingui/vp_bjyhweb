

jQuery.fn.selectToUISlider = function(settings){
	var selects = jQuery(this);
	
	//accessible slider options
	var options = jQuery.extend({
		labels: 3, //number of visible labels
		tooltip: true, //show tooltips, boolean
		tooltipSrc: 'text',//accepts 'value' as well
		labelSrc: 'value',//accepts 'value' as well	,
		sliderOptions: null,
		renderTo:'',
		data1:'',
		data2:'',
		lable1:'',
		lable2:''
	}, settings);


	//handle ID attrs - selects each need IDs for handles to find them
	var handleIds = (function(){
		var tempArr = [];
		selects.each(function(){
			tempArr.push('handle_'+jQuery(this).attr('id'));
		});
		return tempArr;
	})();
	
	//array of all option elements in select element (ignores optgroups)
	var selectOptions = (function(){
		var opts = [];
		selects.eq(0).find('option').each(function(){
			opts.push({
				value: jQuery(this).attr('value'),
				text: jQuery(this).text()
			});
		});
		return opts;
	})();
	
	//array of opt groups if present
	var groups = (function(){
		if(selects.eq(0).find('optgroup').size()>0){
			var groupedData = [];
			selects.eq(0).find('optgroup').each(function(i){
				groupedData[i] = {};
				groupedData[i].label = jQuery(this).attr('label');
				groupedData[i].options = [];
				jQuery(this).find('option').each(function(){
					groupedData[i].options.push({text: jQuery(this).text(), value: jQuery(this).attr('value')});
				});
			});
			return groupedData;
		}
		else return null;
	})();	
	
	//check if obj is array
	function isArray(obj) {
		return obj.constructor == Array;
	}
	//return tooltip text from option index
	function ttText(optIndex){
		return (options.tooltipSrc == 'text') ? selectOptions[optIndex].text : selectOptions[optIndex].value;
	}
	
	//plugin-generated slider options (can be overridden)
	var sliderOptions = {
		step: 1,
		min: 0,
		orientation: 'horizontal',
		max: selectOptions.length-1,
		range: selects.length > 1,//multiple select elements = true
		slide: function(e, ui) {//slide function
				var thisHandle = jQuery(ui.handle);
				//handle feedback 
				var textval = ttText(ui.value);
				thisHandle
					.attr('aria-valuetext', textval)
					.attr('aria-valuenow', ui.value)
					.find('.ui-slider-tooltip .ttContent')
						.text( textval );

				//control original select menu
				var selectid=thisHandle.attr('id').split('handle_')[1];
				
				var currSelect = jQuery('#' +selectid);
				currSelect.find('option').eq(ui.value).attr('selected', 'selected');

				if(selectid==options.data1)
					changLabelText(options.lable1,options.data1);
				if(selectid==options.data2)
					changLabelText(options.lable2,options.data2);
				
		},
		values: (function(){
			var values = [];
			selects.each(function(){
				values.push( jQuery(this).get(0).selectedIndex );
			});
			return values;
		})()
	};
	
	//slider options from settings
	options.sliderOptions = (settings) ? jQuery.extend(sliderOptions, settings.sliderOptions) : sliderOptions;
		
	//select element change event	
	selects.bind('change keyup click', function(){
		var thisIndex = jQuery(this).get(0).selectedIndex;
		var thisHandle = jQuery('#handle_'+ jQuery(this).attr('id'));
		var handleIndex = thisHandle.data('handleNum');
		thisHandle.parents('.ui-slider:eq(0)').slider("values", handleIndex, thisIndex);
	});
	

	//create slider component div
	var sliderComponent = jQuery('#'+options.renderTo);

	//CREATE HANDLES
	selects.each(function(i){
		var hidett = '';
		
		//associate label for ARIA
		var thisLabel = jQuery('label[for=' + jQuery(this).attr('id') +']');
		//labelled by aria doesn't seem to work on slider handle. Using title attr as backup
		var labelText = (thisLabel.size()>0) ? 'Slider control for '+ thisLabel.text()+'' : '';
		var thisLabelId = thisLabel.attr('id') || thisLabel.attr('id', 'label_'+handleIds[i]).attr('id');
		
		
		if( options.tooltip == false ){hidett = ' style="display: none;"';}
		jQuery('<a '+
				'href="#" tabindex="0" '+
				'id="'+handleIds[i]+'" '+
				'class="ui-slider-handle" '+
				'role="slider" '+
				'aria-labelledby="'+thisLabelId+'" '+
				'aria-valuemin="'+options.sliderOptions.min+'" '+
				'aria-valuemax="'+options.sliderOptions.max+'" '+
				'aria-valuenow="'+options.sliderOptions.values[i]+'" '+
				'aria-valuetext="'+ttText(options.sliderOptions.values[i])+'" '+
			'><span class="screenReaderContext">'+labelText+'</span>'+
			'<span class="ui-slider-tooltip ui-widget-content ui-corner-all"'+ hidett +'><span class="ttContent"></span>'+
				'<span class="ui-tooltip-pointer-down ui-widget-content"><span class="ui-tooltip-pointer-down-inner"></span></span>'+
			'</span></a>')
			.data('handleNum',i)
			.appendTo(sliderComponent);
	});
	
	//CREATE SCALE AND TICS
	
	//write dl if there are optgroups
	if(groups) {
		var inc = 0;
		var scale = sliderComponent.append('<dl class="ui-slider-scale ui-helper-reset" role="presentation"></dl>').find('.ui-slider-scale:eq(0)');
		jQuery(groups).each(function(h){
			scale.append('<dt style="width: '+ (100/groups.length).toFixed(2) +'%' +'; left:'+ (h/(groups.length-1) * 100).toFixed(2)  +'%' +'"><span>'+this.label+'</span></dt>');//class name becomes camelCased label
			var groupOpts = this.options;
			jQuery(this.options).each(function(i){
				var style = (inc == selectOptions.length-1 || inc == 0) ? 'style="display: none;"' : '' ;
				var labelText = (options.labelSrc == 'text') ? groupOpts[i].text : groupOpts[i].value;
				scale.append('<dd style="left:'+ leftVal(inc) +'"><span class="ui-slider-label">'+ labelText +'</span><span class="ui-slider-tic ui-widget-content"'+ style +'></span></dd>');
				inc++;
			});
		});
	}
	//write ol
	else {
		var scale = sliderComponent.append('<ol class="ui-slider-scale ui-helper-reset" role="presentation"></ol>').find('.ui-slider-scale:eq(0)');
		jQuery(selectOptions).each(function(i){
			var style = (i == selectOptions.length-1 || i == 0) ? 'style="display: none;"' : '' ;
			var labelText = (options.labelSrc == 'text') ? this.text : this.value;
			scale.append('<li style="left:'+ leftVal(i) +'"><span class="ui-slider-label">'+ labelText +'</span><span class="ui-slider-tic ui-widget-content"'+ style +'></span></li>');
		});
	}
	
	function leftVal(i){
		return (i/(selectOptions.length-1) * 100).toFixed(2)  +'%';
		
	}
	

	
	
	//show and hide labels depending on labels pref
	//show the last one if there are more than 1 specified
	if(options.labels > 1) sliderComponent.find('.ui-slider-scale li:last span.ui-slider-label, .ui-slider-scale dd:last span.ui-slider-label').addClass('ui-slider-label-show');

	//set increment
	var increm = Math.max(1, Math.round(selectOptions.length / options.labels));
	//show em based on inc
	for(var j=0; j<selectOptions.length; j+=increm){
		if((selectOptions.length - j) > increm){//don't show if it's too close to the end label
			sliderComponent.find('.ui-slider-scale li:eq('+ j +') span.ui-slider-label, .ui-slider-scale dd:eq('+ j +') span.ui-slider-label').addClass('ui-slider-label-show');
		}
	}

	//style the dt's
	sliderComponent.find('.ui-slider-scale dt').each(function(i){
		jQuery(this).css({
			'left': ((100 /( groups.length))*i).toFixed(2) + '%'
		});
	});
	

	//inject and return 
	sliderComponent
	.insertAfter(jQuery(this).eq(this.length-1))
	.slider(options.sliderOptions)
	.attr('role','application')
	.find('.ui-slider-label')
	.each(function(){
		jQuery(this).css('marginLeft', -jQuery(this).width()/2);
	});
	
	//update tooltip arrow inner color
	sliderComponent.find('.ui-tooltip-pointer-down-inner').each(function(){
				var bWidth = jQuery('.ui-tooltip-pointer-down-inner').css('borderTopWidth');
				var bColor = jQuery(this).parents('.ui-slider-tooltip').css('backgroundColor')
				jQuery(this).css('border-top', bWidth+' solid '+bColor);
	});
	
	var values = sliderComponent.slider('values');
	
	if(isArray(values)){
		jQuery(values).each(function(i){
			sliderComponent.find('.ui-slider-tooltip .ttContent').eq(i).text( ttText(this) );
		});
	}
	else {
		sliderComponent.find('.ui-slider-tooltip .ttContent').eq(0).text( ttText(values) );
	}
	(function(){
		
		changLabelText(options.lable1,options.data1);
		changLabelText(options.lable2,options.data2);
		fixToolTipColor();
	})();
	return this;
}

function changLabelText(lable,select){
			var daystr=jQuery('#'+select).find("option:selected").attr('daystr');
			var date=jQuery('#'+select).find("option:selected").text();
			var timeIndex=jQuery('#'+select).find("option:selected").attr('timeIndex');
			var value=jQuery('#'+select).find("option:selected").val();
			
			jQuery('#'+lable).text(daystr);
			jQuery('#'+lable).attr('daystr',daystr);
			jQuery('#'+lable).attr('val',value);
			jQuery('#'+lable).attr('timeIndex',timeIndex);
			jQuery('#'+lable).attr('date',date);

		}

		function initSelects(sp,ep,select1,select2,onum,isWeek){
			var unit;
			var cyclenum;
			var dayinterval;
			var date=new Date();
			if(isWeek){
				unit='周';
				cyclenum=7;
				//dayinterval=new Date().getDay()-1;
				dayinterval=getdayOffset(date);
				
			}else{
				unit='天';
				cyclenum=1;
				dayinterval=0;
			}
			sp+=onum+1;
			ep+=onum+1;
			
			var ws=[(0-onum),onum];
			var wnum=onum*2+1;
			var daytime=24*3600*1000;
			date.setTime(date.getTime()-((0-ws[0])*cyclenum+dayinterval)*daytime);
			var fday=date.getTime();
			var perDate=new Date();
			var ops1='',ops2='';
			
			for(var i=0;i<wnum;i++){
				perDate.setTime(fday);
				var curMonth=perDate.getMonth()+1;
				var curDate=perDate.getDate();

				//var value=((curMonth<10?'0':'')+curMonth)+'/'+((curDate<10?'0':'')+curDate);
				var value=i-onum;
				var daystr=genSelectText(onum+1,(i+1),unit);
				var timeid=ws[0]+i;
				var datestr=(curMonth+'月'+curDate+'日');

				if(sp==(i+1))
					ops1+='<option selected="selected" timeIndex="'+timeid+'" daystr="'+daystr+'" value="'+value+'">'+datestr+'</option>';
				else
					ops1+='<option  timeIndex="'+timeid+'" daystr="'+daystr+'" value="'+value+'">'+datestr+'</option>'; 
					
					
				if(ep==(i+1))
					ops2+='<option selected="selected" timeIndex="'+timeid+'" daystr="'+daystr+'" value="'+value+'">'+datestr+'</option>';
				else
					ops2+='<option  timeIndex="'+timeid+'" daystr="'+daystr+'" value="'+value+'">'+datestr+'</option>'; 
				fday+=daytime*cyclenum;
			}
			jQuery('#'+select1).html('');
			jQuery('#'+select1).html(ops1)
			jQuery('#'+select2).html('');
			jQuery('#'+select2).html(ops2);
		}
		
		

		function genSelectText(middler,index,unit){
			if(index==middler)
				return '当前'+unit;
			else if(index<middler)
				return '前'+((middler-index)>9?(middler-index):(' '+(middler-index)))+unit;
			else if(index>middler)
				return '后'+((index-middler)>9?(index-middler):(' '+(index-middler)))+unit;
		}
		
		function fixToolTipColor(){
			//grab the bg color from the tooltip content - set top border of pointer to same
			$('.ui-tooltip-pointer-down-inner').each(function(){
				var bWidth = $('.ui-tooltip-pointer-down-inner').css('borderTopWidth');
				var bColor = $(this).parents('.ui-slider-tooltip').css('backgroundColor')
				$(this).css('border-top', bWidth+' solid '+bColor);
			});	
		}
		
		function getStartDayOfWeek(){
				var url='/project/resource/resourceLoadAction.do?&themethod=getStartDayOfweek';
				var dayofweek;
			    jQuery.ajax({
			        url: url,                               
			        type: 'post',                                                 
			        async: false,
			        success: function(day){
			        	
						dayofweek=day;
			        }
			    });
			    return parseInt(dayofweek);
		}
		
		
	function getdayOffset(date){
		var curday=date.getDay();
		var offset;
		var dayOfweek=getStartDayOfWeek();
		if(!(curday<dayOfweek))
			offset= (curday-dayOfweek);
		else
			offset= (7-dayOfweek+curday);
		return offset;
	}
