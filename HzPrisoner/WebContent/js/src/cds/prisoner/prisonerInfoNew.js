define(function(require){
	var $ = require("jquery");
	var tpl = require('vue');
	var db = require('frm/hz.db');
	var login =  require('frm/loginUser');
	var util  = require('frm/treeUtil');
	var modelUtil = require('frm/model');	
	var treeSelect = require('frm/treeSelect');
	var tip = require('frm/message');
	var dialog = require('frm/dialog');
	var select = require('frm/select');
	var bootstrap = require('bootstrap');
	var video = require('frm/hz.videoclient');
	var ls = require('frm/localStorage');
	var map = require('hz/map/map.handle');
	var MapPrisoner = require('hz/map/mapPoint/map.prisoner');
	var hzTree = require('frm/hz.tree');
	var ztreeExtend = require('frm/ztree.extend');

	var testData=[{id:"1",content:"左肩膀处有一个狼头纹身"},
	              {id:"2",content:"左小腿处有一道10cm的疤痕"},
	              {id:"3",content:"右手小臂有一块胎记"},
	              {id:"4",content:"右大腿处有一块心型纹身"}
	              
	              ];
	
	var testImgUrl=[{id:"0",url:"image/timgG1.jpg"},
	                {id:"1",url:"image/timgG2.jpg"}
	                ];
	var treeSelectNode;
	var ztreeExtendObj;
	var treeContainer;

    var model=new tpl({
			el:'#form',
			data:{
				isDelPoint: false,
				navIndex:"0",//导航选项
				mapPanelList: [],
				prisoner:{
					'id':'',//数据库中存放的罪犯编号
					'prisonerid':'',//监狱内部罪犯编号
					'name':'',//罪犯姓名
					'pid':'',//所属监区(编号)
					'pname':'',//监区名称
					'pbd_crtfcts_type':'',//证件类别(常量)
					'pbd_crtfcts_id':'',//证件号码
					'pbd_sex_indc':'',//性别(常量)
					'pbd_birth_date':'',//出生日期
					'pbd_cltre_level':'',//文化程度
					'pbd_mrrge_stts':'',//婚姻状况
					'pbd_arrst_cmpny':'',//捕前单位
					'pbd_nation':'',//民族
					'pbd_native_addrs':'',//籍贯
					'pbd_home_addrs':'',//家庭住址
					'pbd_detain_type':'',//收押类别
					'pbd_charge_type':'',//分押类别
					'pbd_sprt_mnge':'',//分管等级
					'pbd_accstn':'',//罪名
					'pbd_sntn_type':'',//刑种
					'pbd_sntn_term':'',//判处刑期
					'pbd_sntn_start_date':'',//判处起日
					'pbd_sntn_end_date':'',//判处止日
					'pbd_entry_prisoner_date':'',//入监日期
					'pbd_serious_prsnr':'',//重点案犯
					'pbd_type_indc':'',//犯人类型(常量)
					'pbd_sntn_dprvtn_term':'',//判处剥权年限
					'pbd_stts_indc':'',//罪犯在监状态(常量)
					'pbd_prsnr_stts':'',//罪犯状态
					'pbd_grp_name':'',
					'pbd_grp_leader_indc':'',
					'img_url':'',
					'pbd_remark':'',
					'pbd_cus_number':login.cusNumber,
					'user_id':login.userId//更新创建人
				},
				info:{
					'total':'',//账户余额
					'status':''
				},
				incomepay:[],//消费记录
				healthy:[],//健康状况	
				cameraIds:[],	//摄像机id
				pointInfo:{		//设备地图点位信息
					mpi_point_id:'',
					mpi_point_name:'',
					mpi_view_id:'',
					mpi_link_type:'',
					mpi_link_id:''
				},
				phyDetail:"",
				phyInfoList:testData,
				voiceIndex:0,
				voiceImg:"image/timgG1.jpg",
				voiceDataList:testImgUrl,
				leftExpandShow:true 
				
			},
			methods:{
				selectNav:function(index){
					this.navIndex=index;
				},
				leftExpandChange:function(){
					this.leftExpandShow=!this.leftExpandShow;
					/*if(treeSelectNode){
						console.log($("#"+treeSelectNode).offset().top);
						var top = $("#"+treeSelectNode).offset().top;
						if(top){
							$("#scrollDiv").animate({scrollTop:top},1000);
						}
						*//*$("#scrollDiv").animate({scrollTop:$("#"+treeSelectNode).offset().top},1000);*//*
					}*/
				},
				monitor:function(){		//监控
					if(!model.prisoner.pid){
						tip.alert('请选择监区');
						return;
					}
					queryCamera();	//查询摄像机数据
					openCamera();	//打开摄像机
				},
				openMap:function(){		//地图
					if(!model.prisoner.pid){
						tip.alert('请选择监区');
						return;
					}
					queryCamera();	//查询摄像机数据
					if(!model.cameraIds || model.cameraIds.length <= 0){
			    		tip.alert('['+model.prisoner.pname+']当前时间段无关联地图设备');
			    		return;
			    	}
					//查询地图设备点位信息  
					queryPointViewInfo();
					if(!model.pointInfo || !model.pointInfo.mpi_view_id){
						tip.alert('地图点位查询失败，无法打开地图');
			    		return;
					}
        			//打开地图
        			map.location(model.pointInfo.mpi_view_id);	
				},
				delPoint:function(){
					tip.confirm("确定删除该罪犯的地图点位吗？",function(){
						var request=[{
							sqlId:'delete_map_panel_point_linkId',
							params: [{ppi_cus_number: login.cusNumber, ppi_link_type: 98, ppi_link_id: model.prisoner.id}]
						}];
						db.updateByParamKey({
							request:request,
							success:function(data){
								tip.close();
								tip.alert("删除成功");
								model.isDelPoint = false;
								loadMapPanel();
								var mapPrisoner = new MapPrisoner();
								mapPrisoner.removeById(model.prisoner.id);
							}
						})
					})
				},
				openPhyDetail:function(index){
					this.phyDetail=testData[index].content;
					dialog.open({
						targetId:'openDetail',
						title:'详情'
					})
				},
				testOver:function(){
					
				},
				selecteVoice:function(index){
					this.voiceIndex=index;
					this.voiceImg=this.voiceDataList[index].url;
				}
			}
	});

    //查询地图点位信息
    function queryPointViewInfo(){
    	model.pointInfo = {		
			mpi_point_id:'',
			mpi_point_name:'',
			mpi_view_id:'',
			mpi_link_type:'',
			mpi_link_id:''
		};
    	//获取当前时间段关联的第一个摄像机id
    	var id = model.cameraIds[0];
    	//根据摄像机id查询地图点位信息
    	db.query({
    		request:{
    			sqlId:'select_point_info_by_id_and_type',
    			whereId:'0',
    			params:{
    				cusNumber:login.cusNumber,
    				type:1,
    				id:id
    			}
    		},
    		async:false,
    		success:function(data){
    			if(data && data.length > 0){
    				model.pointInfo = data[0];
    			}
    		},
    		error:function(code,msg){
    			tip.alert(msg);
    		}
    	})
    }
        
    //打开摄像机
    function openCamera(){
    	if(!model.cameraIds || model.cameraIds.length <= 0){
    		tip.alert('['+model.prisoner.pname+']当前时间段无关联摄像机');
    		return;
    	}
    	video.setLayout(model.cameraIds.length);
    	video.play(model.cameraIds);
    }
    
    //查询摄像机
    function queryCamera(){
    	model.cameraIds = [];
    	//根据监区id查询当前时间范围内所有关联的摄像机信息
    	db.query({
    		request:{
    			sqlId:'select_prisoner_rltn_camera_by_deptid',
    			whereId:'0',
    			params:{
    				cusNumber:login.cusNumber,
    				pbc_dept_id:model.prisoner.pid
    			}
    		},
    		async:false,
    		success:function(data){
    			if(data && data.length > 0){
    				for(var i = 0; i < data.length; i++){
        				model.cameraIds.push(data[i].camera_id);
        			}
    			}
    		},
    		error:function(code,msg){
    			tip.alert(msg);
    		}
    	})
    }
    //查询MAP_面板罪犯点位信息
    function loadMapPanel(){
		db.query({
			request:{
				sqlId:'select_map_panel_point_linkId',
				whereId:'0',
				params:[login.cusNumber,98]
			},
			success:function(data){
				model.mapPanelList = data;
			}
		})
    }
    loadMapPanel();


	var sqlId,params,whereId;
	var rfid = sessionStorage.getItem("cdm-rfid-id");
	if(rfid){	//通过地图房间RFID面板点击查看
		sqlId = 'select_prisoner_info_tree_by_rfid';
		params = {
			rmr_monitor_flag: 1,			//过滤RFID进的记录
			rmr_cus_number:login.cusNumber,		//机构号
			rmr_people_type: 2,				//人员类型 2，罪犯
			rbd_id: rfid
		};
		sessionStorage.removeItem("cdm-rfid-id");
	}else{
		var flag = sessionStorage.getItem("cdm-prisoner-flag");
		var deptId = sessionStorage.getItem("cdm-prisoner-deptId");
		sqlId = 'select_prisoner_info_tree';
		params = {
			cusNumber:login.cusNumber
		};
		if(flag == 1001){	//查询全部
			whereId = '0';
		}else if(flag == 1002){	//当日收押点击查看
			whereId = '1';
		}else if(flag == 1003){	//当日释放点击查看
			whereId = '2';
		}else if(flag == 1004){	//自动点名点击查看
			whereId = '3';
			params = $.extend(params,{deptId:deptId})
		}
		sessionStorage.removeItem("cdm-prisoner-flag");
		sessionStorage.removeItem("cdm-prisoner-deptId");
	}

	//左侧罪犯信息树形结构
	db.query({
		request:{
			sqlId:sqlId,
			whereId:whereId,
			orderId:'0',
			params:params
		},
		success:function(data){
			//树形设置
			var setting={
					path:'../../../libs/ztree/css/zTreeStyle/img/',
					edit: {enable: true,showRenameBtn:false,showRemoveBtn: false},
					view: {dblClickExpand: false},
					data: {simpleData: {enable: true,pIdKey: "pid"}},
					callback:{
						onDblClick:function(e,id,node){
							//if(!node.type) return;
							//if(node.type==1){
							if(!node.isParent){
								modelUtil.modelData(model.prisoner,node);
								//根据罪犯编号加载罪犯信息
								getprisonerInfoByid(node.id);
								//根据罪犯编号查询罪犯账户余额
								getprisonerAccountByid(node.id);
								//根据罪犯编号查询罪犯收支情况
								getprisonerBalanceByid(node.id);
								//根据罪犯编号查询罪犯健康状况
								getprisonerHealthByid(node.id);
								//判断罪犯是否标注面板点位
								model.isDelPoint = false;
								var list = model.mapPanelList;
								for(var i=0;i<list.length;i++){
									var id = list[i].id;
									if(id == node.id){
										model.isDelPoint = true;
									}
								}
								model.leftExpandShow=false;
							}
							
						},
						onClick:function(e,id,node){
							if(node.level == 1){
								model.prisoner.pid = node.id;
								model.prisoner.pname = node.name;
							}else{
								model.prisoner.pid = '';
							}
						},
						onAsyncSuccess: zTreeOnAsyncSuccess
					}
			};

			//treeContainer = $.fn.zTree.init($("#tree"), setting, data);

			hzTree.toTree(data, {
				success: function (zNodes) {
					ztreeExtendObj = ztreeExtend.create('scrollDiv', 'tree', zNodes, setting);
					treeContainer = ztreeExtendObj.zTree;

					var nodes = treeContainer.getNodes();
					treeContainer.expandNode(nodes[0],true);

					init();
				}
			});

			$("#input").keyup(function(){
				util.searchTree("name",this.value,"tree",data,setting);
			});
		},
		error:function(errorCode, errorMsg){
			tip.alert(errorCode + ":" + errorMsg);
		}	
	});


  /**
   * 根据罪犯编号查询详细信息
   */
  function getprisonerInfoByid(id){
	  db.query({
			request:{
				sqlId:'select_prisoner_base_dtls_info',
				whereId:'0',
				params:[login.cusNumber,id]
			},
			success:function(data){
				var data = data[0];
				modelUtil.modelData(model.prisoner,data);
			},
			error:function(errorCode, errorMsg){
				tip.alert(errorCode + ":" + errorMsg);
			}
		});
  }

	/**
	 * 根据罪犯编号查询账户余额
	 * @param otherid
     */
  function getprisonerAccountByid(id){
		db.query({
			request:{
				sqlId:'select_prisoner_account_total_byid',
				whereId:'0',
				params:[login.cusNumber,id]
			},
			success:function(data){
				if(!data || data.length == 0) return;
				model.info.total = data[0].total;
			},
			error:function(errorCode, errorMsg){
				tip.alert(errorCode + ":" + errorMsg);
			}
		});
  }
  /**
   * 罪犯收支信息
   */
  function getprisonerBalanceByid(id){
	  model.incomepay = [];
	  db.query({
			request:{
				sqlId:'select_prisoner_income_pay_info',
				whereId:'0',
				params:[login.cusNumber,id,login.cusNumber,id]
			},
			success:function(data){
				if(!data || data.length == 0) return;
				model.incomepay = data;
			},
			error:function(errorCode, errorMsg){
				tip.alert(errorCode + ":" + errorMsg);
			}
		});
  }
  /**
   * 加载罪犯健康档案
   */
  function getprisonerHealthByid(id){
	  model.healthy = [];
	  db.query({
			request:{
				sqlId:'select_prisoner_healthy_byid',
				whereId:'0',
				params:[login.cusNumber,id]
			},
			success:function(data){
				if(!data || data.length == 0) return;
				model.healthy = data[0];
			},
			error:function(errorCode, errorMsg){
				tip.alert(errorCode + ":" + errorMsg);
			}
		});
  }
  
  /**
   * 点击地图面板 弹出
   * @returns
   */

  function zTreeOnAsyncSuccess(event, treeId, treeNode, msg) {
	  if(treeSelectNode){
		  console.log($("#"+treeSelectNode).offset());
		  $("#tree").animate({scrollTop:$("#"+treeSelectNode).offset().top-300},1000);
	  }
  }

  function init(){
	  var prisonerCode = window.top.searchPeopleId || ls.getItem('prisonerCode');

	  delete window.top.searchPeopleId;
	  ls.remove('prisonerCode');

	  if (prisonerCode) {
		  	var node = treeContainer.getNodeByParam('prisonerid',prisonerCode) ||
		  				treeContainer.getNodeByParam('id', prisonerCode);
		  	
		  	if (node) {
		  		// TODO: something
			  	//单独选中节点,并让节点自动滚到到可视区域内
			  	treeContainer.selectNode(node);
				treeSelectNode = node.tId;
				if(treeSelectNode){
					//ztreeExtendObj.pitch('tId', node.tId);
					setTimeout(function () {
						//console.log($("#"+treeSelectNode).position());
						//model.leftExpandShow =false;
						ztreeExtendObj.pitch('name', node.name, 50, 1000);
						//$("#tree").animate({scrollTop:$("#"+node.tId).offset().top},1000);
						model.leftExpandShow=false;
					}, 500);
					//$("#tree").delay({scrollTop:$("#"+treeSelectNode).offset().top},1000);
				}

				/*if(node.tId){
					console.log($("#"+node.tId).offset());
					$("#tree").animate({scrollTop:$("#"+node.tId).offset().top},1000);
				}*/

			  	//加载基本信息
				getprisonerInfoByid(node.id);
				//根据罪犯编号查询罪犯账户余额
				getprisonerAccountByid(node.id);
				//根据罪犯编号查询罪犯收支情况
				getprisonerBalanceByid(node.id);
				//根据罪犯编号查询罪犯健康状况
				getprisonerHealthByid(node.id);
				//判断罪犯是否标注面板点位
				model.isDelPoint = false;
				var list = model.mapPanelList;
				for(var i=0;i<list.length;i++){
					var id = list[i].id;
					if(id == node.id){
						model.isDelPoint = true;
					}
				}
		  	}
	  }
  }
});