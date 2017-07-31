define(function(require){
	var $ = require("jquery");
	var tpl = require('vue');
	var utils = require('frm/hz.utils');
	var tip = require('frm/message');
	var datepicker = require('frm/datepicker');
	var table = require('frm/table');
	var select = require('frm/select');
	var dialog = require('frm/dialog');
	
	model=new tpl({
		el:'body',
		data:{
			search:{              
				'startTime':'2016-12-02',
				'endTime':new Date().Format("yyyy-MM-dd") + ' 23:59',
				'phoneNum':''
			},
			auditionAudio:''
		},
		methods:{	
			searchRecord:function(){
				table.method("refresh",{'params':model.search});
			}
		},
	});
	//=============================
	//========查询通话录音
	//=============================
	//初始化表格
	var initTable = function(){
		table.init("table",{
			request:{
				url:ctx +'iccPhoneCtrl/record',
				params:model.search
			},
			showColumns:true,
			showRefresh:true,
			onlyInfoPagination :true,
			columns: [[  
						{field: 'rn',align: 'center',valign: 'middle'},
						{title: '主叫',field: 'calling',align: 'center',valign: 'middle'},
						{title: '被叫',field: 'callnum',align: 'center',valign: 'middle'},
						{title: '坐席编号',field: 'sheet_id',align: 'center',valign: 'middle',visible:false},
						{title: '日期',field: 'ndate',align: 'center',valign: 'middle',visible:false},
						{title: '呼叫时间',field: 'sdate',align: 'center',valign: 'middle'},
		                {title: '结束时间',field: 'edate',align: 'center',valign: 'middle',visible:false},
		                {title: '通话时长',field: 'sumchar',align: 'center',valign: 'middle'},
		                {title: '状态',field: 'call_to',align: 'center',valign: 'middle',visible:false},
		                {title: '文件目录',field: 'dirfile',align: 'center',valign: 'middle',visible:false},
		                {title: '录音',field: 'playfile',align: 'center',valign: 'middle',
		                    formatter:function(value,row,index){
		                    	return value?'<span class="play">播放录音</span>':'没有录音';
		                    }
		                }
		              ]],
	         onClickCell:function(field,value, row, $element){
	        	if(field == 'playfile'){
	        		play(value);
	        	}else{
	        		return;
	        	}
	         },
	     	toolbar:".toolbar"
		});
	}
	
	initTable();
	/**
	 * 录音播放
	 */
	function play(value){
		model.auditionAudio =  value;
		var obj = document.getElementById("audio-path")
		obj.load();
		dialog.open({targetId:'audio-div',title:'录音播放',h:'75px',w:'300',closeCallback:function(){
			//音乐窗口关闭回调
			document.getElementById("audio-path").pause();
		}});
		obj.play();
	}
});