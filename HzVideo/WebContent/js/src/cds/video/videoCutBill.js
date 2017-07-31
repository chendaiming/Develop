define(function(require){
	var $ = require("jquery");
	var db = require('frm/hz.db');
	var ztree = require('ztree');
	var vue = require('vue');
	var select = require('frm/select');
	var treeSelect = require("frm/treeSelect");
	var message = require('frm/message');
	var datepicker = require("frm/datepicker");
	var treeUtil = require('frm/treeUtil');
	var loginUser = require('frm/loginUser');
	var dialog = require('frm/dialog');
	var videoClient = require('frm/hz.videoclient');
	var hzEvent = require('frm/hz.event');
	var table = require("frm/table");
	var model = require("frm/model");
	var videoCutTable;
	
	var vm = new vue({
		el:'body',
		data:{
			person:[],
			img:'',
			activeTab:1,
			selectIndex:[],
			search:{
				cusNumber:loginUser.cusNumber,
				status:'',
				fileType:'',
				createUser:'',
				pushUser:'',
				receiveUser:'',
				startTime:'',
				endTime:''
			}
		},
		methods:{
			setActiveTab:function(n){
				this.activeTab = n;
				if(!vm.contains(n)){ 
					vm.selectIndex.push(n);
					if(n == 1){
						initVideoCutTable();
					}else if(n == 2){
						//initAlreadyCreateBillTable();
					}else if(n == 3){
						//initAlreadySendBillTable();
					}else{
						//initAlreadyReceiveBillTable();
					}
				}
			},
			contains:function(val){
				if(vm.selectIndex){
					for(var i = 0; i < vm.selectIndex.length;i++){
						if(vm.selectIndex[i] == val) return true;
					}
				}
				return false;
			},
			showTableSearch:function(i){		//弹出表格查询
				 dialog.open({targetId:'searchTable1',title:'查询',h:"230",w:'500'});
			},
			resetSearchTable:function(){	//重置查询
				//清空并保留cusNumber
				model.clear(vm.search,{cusNumber:loginUser.cusNumber});
			},
			searchTable:function(i){		//查询表格
				dialog.close();
				var whereId = '0';
				if(i == 1){
					whereId = '1';	//截图信息查询
				}else if(i == 2){
					whereId = '1';	//已建监督单查询
				}else if(i == 3){
					whereId = '4';	//已发监督单查询
				}else if(i == 4){
					whereId = '7';	//已收监督单查询
				}
				table.method("refresh",{
    			 	request:{
    			 		whereId:whereId,
    			 		params:vm.search
    			 	}
			 	});
			},

			updateBill:function(){
				
			},
			deleteBill:function(){
				
			}
		}
	}); 
	
	//查看图片
	function showImg(url){
		if(url){
			vm.img = url;
			var image = new Image();
			image.src = url+'?'+Date.parse(new Date());
			image.onload = function(){
				var h = image.height + 49;
				var w = image.width + 8;
				var d = dialog.open({targetId:'showImg',title:'查看截图',h:h,w:w});
				layer.style(d.index,{
					width:w+'px',
					height:h+'px'
				})
			};
			image.onerror = function(){
				message.alert('图片无效');
			}
		}else{
			message.alert('暂无图片');
		}

	}
	
	
	//初始化视频截图表格
	function initVideoCutTable(){
		//table表
		videoCutTable = table.init("table1",{
			request:{
				sqlId:'select_video_cut_info',
				whereId:'0',
				params:{
					cusNumber:loginUser.cusNumber
				}
			},
			search:[
				{
					key:'vcd_title',
					name:'截图标题',
					whereId:'2'
				}
			],
			/*clickToSelect:true,*/
			columns: [[  
						{
						    field: 'state',
						    checkbox: true
						},
		                  {
		                    title: '截图标题',
		                    field: 'vcd_title',
		                    align: 'center',
		                    valign: 'middle'
		                },

		                {
		                    title: '监控地点',
		                    field: 'vcd_place',
		                    align: 'center',
		                    valign: 'middle'
		                },
		                {
		                    title: '记录时间',
		                    field: 'vcd_time',
		                    align: 'center',
		                    valign: 'middle'
		                },
		                {
		                    title: '记录人',
		                    field: 'ubd_name',
		                    align: 'center',
		                    valign: 'middle'
		                },
						{
							title: '详细描述',
							field: 'vcd_detail',
							width: '20%',
							align: 'center',
							valign: 'middle'
						},
						{
							title: '操作',
							field: 'vcd_cut_url',
							align: 'center',
							valign: 'middle',
							formatter:function(row){
								return '<button class="btn btn-sm btn-primary">查看</button>';
							}
						}
		     ]],
			onClickCell:function(field, value, row){
				if(field == 'vcd_cut_url'){
					showImg(value);
				}
			}
		});
	}
	initVideoCutTable();
	
	
});