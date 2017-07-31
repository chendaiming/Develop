define(function(require){
	var $ = require("jquery");
	var db = require('frm/hz.db');
	var ztree = require('ztree');
	var vue = require('vue');
	var select = require('frm/select');
	var message = require('frm/message');
	var treeUtil = require('frm/treeUtil');
	var loginUser = require('frm/loginUser');
	var piny = require('frm/pinyin');
	var dialog = require('frm/dialog');
	var videoClient = require('frm/hz.videoclient');
	var hzEvent = require('frm/hz.event');
	
	
	var areaTree,planTree,chosePlanTree,setting,planSetting,chosePlanSetting,dial;
	var videoCameras = [],
		videoInterval,
		timeInterval,
		ptimeInterval,
		pvideoInterval,
		curClickBtn;//当前在哪个tab页点击的10S，20S等按钮
	var selectedNodeIndex;
	
	var vm = new vue({
		el:'body',
		data:{
			dataAuth:loginUser.dataAuth,
			activeTab:1,
			treeAllNodes:[],
			cameraData:[],
			searchTree:'',
			searchSelect:'',
			selectCameras:[],//当前选中节点下的所有camera 包括子节点下
			selectAreaName:'',
			planCameras:[],//拖动到预案区的摄像机列表
			layouts:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
			layout:1,//当前选择画面
			index:0,//当前分页数组索引
			check:'',
			plan:{
				id:'',
				dgm_cus_number:loginUser.cusNumber,
				name:'',
				plan_type:'',
				dgm_use_range:0,
				dgm_crte_user_id:loginUser.userId,
				dgm_updt_user_id:loginUser.userId
			},
			showPlanTree:false,
			planQueryParam:{
				whereId:0,
				params:[loginUser.cusNumber,loginUser.userId]
			},
			
			searchPlanTree:'',
			planData:[],
			selectPlans:[],
			selectPlanCameras:[],//视频预案界面 点击某个预案 存放里面的关联摄像机
			selectTypeName:'',
			planIndex:0,
			planLayout:1,
			searchPlan:'',
			
			s10:10,
			s20:20,
			s30:30,
			s60:60,
			curMTag:'',
			//预案按钮
			ys10:10,
			ys20:20,
			ys30:30,
			ys60:60,
			ycurMTag:'',
			
			isSelectChangeIndex:false
		},
		methods:{
			videoRecord : function() {
				
				/*dialog.top.open({
						id : 100002,
						type : 2,
						title : '录像详情',
						w : 15,
						h : 20,
						top : 90,
						url : 'page/cds/video/videoRecord.html'
					});*/
				hzEvent.call('videoRecord.start');
			},
			videoCut:function(){
				//videoClient.setLayout(1);
				dialog.top.open({
					id:10001,
					type:2,
					title:'视频截图',
					w:55,
					h:60,
					top:90,
					url:'page/cds/video/videoCut.html'
				});
			},
			setActiveTab:function(n){
				this.activeTab = n;
			},
			radioCheck:function(){
				if(this.check){
					this.check = '';
				}
			},
			//删除拖过去的设备
			delPlan:function(n){
				if(n.isLoad && vm.planCameras.length==1){
					message.alert('视频预案中至少保留一个关联设备');
					return;
				}
				if(n.isLoad){
					message.confirm('确定要删除该关联设备吗？',function(index){
						db.updateByParamKey({
							request:[{
								sqlId:'delete_videoplan_rltn',
								whereId:1,
								params:{dgr_grp_id:n.dgr_grp_id,dgr_cus_number:loginUser.cusNumber,dgr_dvc_id:n.id}
							}],
							success:function(data){
								vm.planCameras.$remove(n);
								message.alert('删除成功');
							}
						});						
					});
				}else{
					vm.planCameras.$remove(n);
				}
			},
			//打开选择画面布局界面
		    choseLayout:function(){
		    	showLayout();
		    },
		    chosePlanLayout:function(){
		    	showPlanLayout();
		    },
		    setPlanLayout:function(n){
		    	this.planLayout = n ; 
		    	videoClient.setLayout(n);
		    	this.isSelectChangeIndex = false;
		    	planHomePage();
		    	showPlanLayout();
		    },
		    //设置画面布局
		    setLayout:function(index){
		    	this.layout = index ; 
		    	this.homePage();
		    	//调用视频客户端 设置画面布局方法
		    	videoClient.setLayout(index);
		    	this.isSelectChangeIndex = false;
		    	
		    	showLayout();
		    },
		    homePage:function(){
		    	resetTimer();
		    	homePage();
		    },
		    prevPage:function(){
		    	resetTimer();
		    	prevPage();
		    },
		    nextPage:function(){
		    	resetTimer();
		    	nextPage();
		    },
		    endPage:function(){
		    	resetTimer();
		    	endPage();
		    },
		    openAddPlan:function(){
		    	if(this.plan.id){
		    		this.planCameras=[];
		    	}
		    	reset();
		    	openAddWin();
		    },
		    openEditPlan:function(){
		    	openAddWin();
		    },
		    savePrivatePlan:function(){
		    	savePlan(1);
		    },
		    savePublicPlan:function(){
		    	savePlan(0);
		    },
		    delVideoPlan:function(){
		    	delPlan();
		    },
		    videoClient:function(s,tag){
		    	var me=this;
		    	if(me.check=='area'){
		    		if(me.selectCameras.length==0){
		    			return;
		    		}
		    	}else if(me.check=='plan'){
		    		if(me.planCameras.length==0){
		    			return;
		    		}
		    	}else{
		    		if(me.treeAllNodes.length==0){
		    			return;
		    		}
		    	}
		    	closePlanInterval();
		    	clearPlanTags();
		    	if(me.curMTag){
		    		me[tag] = s;
		    		closeInterval();
		    		me.curMTag='';
		    	}else{
		    		me.curMTag = tag;
		    		if(!curClickBtn || curClickBtn == 2){
		    			curClickBtn = 1;
		    		}
		    		if(videoCameras.length != me.layout){
		    			nextPage();		    			
		    		}else{
		    			openVideoClient();
		    		}
		    		videoInterval = setInterval(function(){
		    			nextPage();
		    		},s * 1000);
		    		timeInterval = setInterval(function(){
		    			me[tag]--;
		    			if(me[tag]==0){
		    				me[tag] = s;
		    			}
		    		},1000);
		    	}		    	
		    },
		    planVideoClient:function(s,tag){
		    	var me=this;
		    	if(me.selectPlanCameras.length==0){
		    		return;
		    	}
		    	closeInterval();
		    	clearTags();
		    	if(me.ycurMTag){
		    		me[tag] = s;
		    		closePlanInterval();
		    		me.ycurMTag='';
		    	}else{
		    		me.ycurMTag = tag;
		    		if(!curClickBtn || curClickBtn == 1){
		    			curClickBtn == 2;
		    			planHomePage();
		    		}
		    		openVideoClient();
	    			
		    		pvideoInterval = setInterval(function(){
		    			planVideoClient();
		    		},s * 1000);
		    		ptimeInterval = setInterval(function(){
		    			me[tag]--;
		    			if(me[tag]==0){
		    				me[tag] = s;
		    			}
		    		},1000);
		    	}
		    },
		    queryPlanCamera:function(p){
		    	var me =this;
		    	me.selectPlans.forEach(function(p1){
		    		p1.open = false;
		    	});
		    	p.open = true;
		    	loadPlanCameras(p.id);
		    },
		    openPlanTree:function(){
		    	$('#planCon').css({
		    		left:$('#choseP').offset().left,
		    		top:$('#choseP').offset().top+35
		    	});
		    	this.showPlanTree = !this.showPlanTree;
		    }
		}
	});
	
	/**
	  * 搜索tree监听函数
	  */
	 vm.$watch('searchTree',function(){
		 treeUtil.searchTree('name',vm.searchTree,'areaTree',vm.cameraData,setting);
	 });
	 
	 vm.$watch('searchPlanTree',function(){
		 treeUtil.searchTree('name',vm.searchPlanTree,'planTree',vm.planData,planSetting);
	 });
	 
	 vm.$watch('check',function(){
		 clearSelectCameras();
		 clearPlanCameras();
		 closeInterval();
		 clearTags();
		 if(vm.check=='area'){
			 areaTree.cancelSelectedNode();
			 homePage();
		 }else if(vm.check=='plan'){
			 areaTree.cancelSelectedNode();
			 homePage();
		 }else{
			 homePage();
		 }
	 });
	 
	 vm.$watch('plan.id',function(){
		 if(vm.plan.id){
			 db.query({
				 request:{
					 sqlId:'select_videoplan_rltn',
					 params:{dgr_grp_id:vm.plan.id,dgr_cus_number:loginUser.cusNumber}
				 },
				 success:function(data){
					 vm.planCameras =[];
					 data.forEach(function(item){
						 vm.planCameras.push({
							id:item.id,
							name:item.name,
							dgr_grp_id:item.dgr_grp_id,
							selected:false,
							isLoad:true
						 });
					 })
				 }
			 })
		 }
	 })
	
	/**
	 * 删除视频预案
	 * @returns
	 */
	function delPlan(){
		message.confirm('确定要删除该视频预案吗？',function(index){
			db.updateByParamKey({
				request:[{
					sqlId:'delete_videoplan_rltn',
					whereId:0,
					params:{dgr_grp_id:vm.plan.id,dgr_cus_number:loginUser.cusNumber}
				},{
					sqlId:'delete_videoplan',
					params:{id:vm.plan.id,dgm_cus_number:loginUser.cusNumber}
				}],
				success:function(data){
					reset();
					vm.planCameras = [];
					message.alert('删除成功');
					initVideoPlanTree();
				},
				error:function(){}
			});			
		});
	}
	
	/**
	 * 保存视频预案
	 * @param n
	 * @returns
	 */
	function savePlan(n){
		vm.plan.dgm_use_range = n;
		if(!$.trim(vm.plan.name)){
			message.alert('请填写预案名称');
			return;
		}
		if(n==0 && !vm.plan.plan_type){
			message.alert('保存公共预案必须选择预案类型');
			return;
		}
		if(vm.planCameras.length==0){
			message.alert('您还未拖放摄像机设备至指定区域');
			return;
		}
		if(vm.plan.name.length>26){
			message.alert('预案名称过长，请输入26个以内字符');
			return;
		}
		var sqlId  = !vm.plan.id ? 'insert_videoplan' : 'update_videoplan';
		db.updateByParamKey({
			request:[{
				sqlId:sqlId,
				params:vm.plan
			}],
			success:function(data){
				var grpId = !vm.plan.id ? data.data[0].seqList[0] : vm.plan.id;
				var pcs = [];
				var cid,pname = vm.plan.name;
				for(var i=0;i<vm.planCameras.length;i++){
					cid = vm.planCameras[i].id + '';						
					pcs.push({
						dgr_cus_number:loginUser.cusNumber,
						dgr_dvc_id:cid.replace('c_',''),
						dgr_grp_id:grpId,
						dgr_seq:i,
						dgr_crte_user_id:loginUser.userId
					});					
				}
				db.updateByParamKey({
					request:[{
						sqlId:'delete_videoplan_rltn',
						whereId:0,
						params:{dgr_grp_id:grpId,dgr_cus_number:loginUser.cusNumber}
					},{
						sqlId:'insert_videoplan_rltn',
						params:pcs
					}],
					success:function(data){
						if(sqlId=='insert_videoplan'){
							reset();							
						}
						if(sqlId=='update_videoplan'){
							vm.plan.id='';
						}
						dial.close();
						message.alert('保存成功');
						vm.plan.id = grpId;
						vm.plan.name = pname;
						initVideoPlanTree();
					}
				});
			},
			error:function(){}
		});
	}
	
	function loadPlanCameras(planid){
		db.query({
			 request:{
				 sqlId:'select_videoplan_rltn',
				 params:{dgr_grp_id:planid,dgr_cus_number:loginUser.cusNumber}
			 },
			 success:function(data){
				 vm.selectPlanCameras = [];
				 videoCameras = [];
				 for(var i=0;i<data.length;i++){
					 vm.selectPlanCameras.push({
						 id:data[i].id,
						 name:data[i].name,
						 selected:false
					 });
					 pushVideoClient(data[i].id);
				 }
				 videoClient.setLayout(videoCameras.length);
				 openVideoClient();
			 }
		 })
	}
	
	/**
	 * 重置
	 * @returns
	 */
	function reset(){
		vm.plan={
			id:'',
			dgm_cus_number:loginUser.cusNumber,
			name:'',
			plan_type:'',
			dgm_use_range:0,
			dgm_crte_user_id:loginUser.userId,
			dgm_updt_user_id:loginUser.userId
		}
	}
	
	/**
	 * 视频预案界面 点击10s ,20s等按钮的操作
	 * @returns
	 */
	function planVideoClient(){
		videoCameras = [];
		for(var i=0,j=vm.selectPlanCameras.length;i<j;i++){
			vm.selectPlanCameras[i].selected =false;
		}
		if(vm.planIndex >= vm.selectPlanCameras.length-1){
			vm.planIndex = vm.planLayout - 1;
			for(var i=0;i<vm.planLayout;i++){
				if(vm.selectPlanCameras[i]){
					vm.selectPlanCameras[i].selected=true;
					pushVideoClient(vm.selectPlanCameras[i].id);
				}
			}
		}else{
			for(var i=0;i<vm.planLayout;i++){
				vm.planIndex ++;
				if(vm.selectPlanCameras[vm.planIndex]){
					vm.selectPlanCameras[vm.planIndex].selected=true;
					pushVideoClient(vm.selectPlanCameras[vm.planIndex].id);
				}
			}			
		}
		openVideoClient();
	}
	
	function planHomePage(){
		videoCameras = [];
		vm.planIndex = vm.planLayout - 1;
		for(var i=0,j=vm.selectPlanCameras.length;i<j;i++){
			vm.selectPlanCameras[i].selected =false;
		}
		for(var i=0;i<vm.planLayout;i++){
			vm.selectPlanCameras[i].selected = true;
			pushVideoClient(vm.selectPlanCameras[i].id);
		}
	}
	
	/**
	 * 首页按钮操作
	 * @returns
	 */
	function homePage(isStart){
		videoCameras = [];
		
		vm.index = vm.layout - 1;
		if(vm.check!='area' && vm.check!='plan'){
			areaTree.cancelSelectedNode();
			for(var i=0;i<vm.layout;i++){
				if(vm.treeAllNodes[i]){
					areaTree.selectNode(vm.treeAllNodes[i],true);
					pushVideoClient(vm.treeAllNodes[i].id);
				}
			}			
		}else if(vm.check=='plan'){
			areaTree.cancelSelectedNode();
			clearPlanCameras();
			for(var i=0;i<vm.layout;i++){
				if(vm.planCameras[i]){
					vm.planCameras[i].selected = true;	
					pushVideoClient(vm.planCameras[i].id);
				}
			}
		}else if(vm.check=='area'){
			areaTree.cancelSelectedNode();
			clearSelectCameras();
			for(var i=0;i<vm.layout;i++){
				if(vm.selectCameras[i]){
					vm.selectCameras[i].open = true;
					pushVideoClient(vm.selectCameras[i].id);
				}
			}
		}
		if(isStart){
			openVideoClient();			
		}
	}
	
	/**
	 * 上一页
	 * @returns
	 */
	function prevPage(){
		videoCameras = [];
		
		if(vm.isSelectChangeIndex){
			vm.index = vm.index + vm.layout;
			vm.isSelectChangeIndex = false;
		}
		
		if(vm.index < vm.layout){
			endPage();
    	}else{
    		vm.index = vm.index - vm.layout*2;
    		if(vm.check!='area' && vm.check!='plan'){
    			areaTree.cancelSelectedNode();
    			for(var i=0;i<vm.layout;i++){
    				vm.index++;
    				if(vm.treeAllNodes[vm.index]){
    					areaTree.selectNode(vm.treeAllNodes[vm.index],true);
    					pushVideoClient(vm.treeAllNodes[vm.index].id);
    				}
    			}    		
    		}else if(vm.check=='plan'){
    			clearPlanCameras();
    			for(var j=0;j<vm.layout;j++){
    				vm.index ++;
    				if(vm.planCameras[vm.index]){
    					vm.planCameras[vm.index].selected = true;
    					pushVideoClient(vm.planCameras[vm.index].id);
    				}
    			}
    		}else if(vm.check=='area'){
    			clearSelectCameras();
    			for(var j=0;j<vm.layout;j++){
    				vm.index ++;
    				if(vm.selectCameras[vm.index]){
    					vm.selectCameras[vm.index].open = true;
    					pushVideoClient(vm.selectCameras[vm.index].id);
    				}
    			}
    		}
    	}
		openVideoClient();
	}
	
	/**
	 * 下一页
	 * @returns
	 */
	function nextPage(){
		
		videoCameras = [];
		
		if(vm.isSelectChangeIndex){
			vm.index = vm.index - 1;
			vm.isSelectChangeIndex = false;
		}
		
    	if(vm.check!='area' && vm.check!='plan'){
    		if(vm.index >= vm.treeAllNodes.length-1){
    			homePage(true);
    		}else{
    			areaTree.cancelSelectedNode();
    			for(var j=0;j<vm.layout;j++){
    				vm.index ++;
    				if(vm.treeAllNodes[vm.index]){
    					areaTree.selectNode(vm.treeAllNodes[vm.index],true);
    					pushVideoClient(vm.treeAllNodes[vm.index].id);
    				}
    			}    			
    		}
    	}else if(vm.check=='plan'){
    		if(vm.index >= vm.planCameras.length-1){
    			homePage();
    		}else{
    			clearPlanCameras();
    			for(var j=0;j<vm.layout;j++){
    				vm.index ++;
    				if(vm.planCameras[vm.index]){
    					vm.planCameras[vm.index].selected =true;
    					pushVideoClient(vm.planCameras[vm.index].id);
    				}
    			}
    		}
		}else if(vm.check=='area'){
			if(vm.index >= vm.selectCameras.length-1){
				homePage();
    		}else{
    			clearSelectCameras();
    			for(var j=0;j<vm.layout;j++){
    				vm.index ++;
    				if(vm.selectCameras[vm.index]){
    					vm.selectCameras[vm.index].open =true;
    					pushVideoClient(vm.selectCameras[vm.index].id);
    				}
    			}    			
    		}
		}
    	openVideoClient();
	}
	
	function endPage(){
		videoCameras = [];
		
    	if(vm.check!='area' && vm.check!='plan'){
    		areaTree.cancelSelectedNode();
    		var len = vm.treeAllNodes.length;
    		vm.index =len-1;
    		for(var i=len-1;i>=len-vm.layout;i--){
    			if(vm.treeAllNodes[i]){
    				areaTree.selectNode(vm.treeAllNodes[i],true);    
    				pushVideoClient(vm.treeAllNodes[vm.index].id);
    			}
    		}    		
    	}else if(vm.check=='plan'){
    		clearPlanCameras();
    		var len = vm.planCameras.length;
    		vm.index =len-1;
    		
			for(var i=len-1;i>=len-vm.layout;i--){
				if(vm.planCameras[i]){
					vm.planCameras[i].selected = true;
					pushVideoClient(vm.planCameras[vm.index].id);
				}
			}
		}else if(vm.check=='area'){
			clearSelectCameras();
			var len = vm.selectCameras.length;
    		vm.index =len-1;
    		
			for(var i=len-1;i>=len-vm.layout;i--){
				if(vm.selectCameras[i]){
					vm.selectCameras[i].open=true;
					pushVideoClient(vm.selectCameras[vm.index].id);
				}
			}
		}
    	openVideoClient();
	}
	
	function clearPlanCameras(){
		for(var i=0,j=vm.planCameras.length;i<j;i++){
			vm.planCameras[i].selected =false;
		}
	}
	function clearSelectCameras(){
		for(var i=0,j=vm.selectCameras.length;i<j;i++){
			vm.selectCameras[i].open =false;
		}
	}
	
	$('#pcon').on('mouseover','a',function(){
		$(this).find('img').show();
	});
	$('#pcon').on('mouseleave','a',function(){
		$(this).find('img').hide();
	});
	
	$('.videos').on('dblclick','.cam',function(){
		vm.check='area';
		resetTimer();
		videoCameras = [];
		areaTree.cancelSelectedNode();
		clearPlanCameras();
		clearSelectCameras();
		var cid = $(this).attr('cid');
		for(var i=0;i<vm.selectCameras.length;i++){
			if(vm.selectCameras[i].id == cid){
				vm.index = i;
				vm.selectCameras[i].open = true;
				pushVideoClient(vm.selectCameras[i].id);
				openVideoClient();
			}
		}						
	});
	$('.videos').on('click','.cam',function(){
		vm.check='area';
		resetTimer();
		videoCameras = [];
		vm.isSelectChangeIndex = true;
		clearSelectCameras();
		var cid = $(this).attr('cid');
		for(var i=0;i<vm.selectCameras.length;i++){
			if(vm.selectCameras[i].id == cid){
				vm.index = i;
				vm.selectCameras[i].open = true;					
				pushVideoClient(vm.selectCameras[i].id);
				var node = areaTree.getNodeByParam('id',cid,null);
				if(node){
					$('#'+node.tId+'_a').trigger('click');
				}else{
					message.alert("请先展开相机目录")
				}
				
			}
		}
		var a = $(this).parent().siblings();
		$(this).parent().siblings('.col-xs-4').find('.cam').removeClass("selected");
		$(this).addClass("selected");
	});
	
	/**
	 * 隐藏显示画面布局
	 * @returns
	 */
	function showLayout(){
		var layoutBtn = $("#layoutBtn").offset();
    	var layout = $('#layout');
		if(layout.css('display') == 'block'){
			layout.css('display','none');
    	}else{
    		layout.css({
    			left:layoutBtn.left-400 + "px", 
    			top:layoutBtn.top-450+"px",
    			opacity:0.85
    		}).slideDown("fast");	
    	}
	}
	
	/**
	 * 隐藏显示plan画面布局
	 * @returns
	 */
	function showPlanLayout(){
		var layoutBtn = $("#planLayoutBtn").offset();
    	var layout = $('#planLayout');
		if(layout.css('display') == 'block'){
			layout.css('display','none');
    	}else{
    		layout.css({
    			left:layoutBtn.left-150 + "px", 
    			top:layoutBtn.top-450+"px",
    			opacity:0.85
    		}).slideDown("fast");	
    	}
	}
	
	 /**
	 * 获取当前选中节点下的所有子节点
	 * @param nodes
	 * @returns
	 */
	 function getSelectNodeCameras(nodes){
		vm.selectCameras = [];
		var firstCameras =  areaTree.transformToArray(nodes);
		for(var i=0,j=firstCameras.length;i<j;i++){
			if(!firstCameras[i].isParent){
				vm.selectCameras.push(firstCameras[i]);
			}
		}
		if(vm.check=='area' && vm.selectCameras.length>0){
			homePage();
		}
	 }
	 
	 function getDomsByClickNode(node){
			db.query({
				request : {
					sqlId : 'select_camera_tree',
					whereId : 4,
					orderId : 0,
					params : [loginUser.cusNumber,loginUser.cusNumber,node.id ]
				},
				success : function(data) {
					for(var i=0,j=data.length;i<j;i++){
						data[i].id = 'c_'+data[i].id;
						vm.cameraData.push(data[i]);
					}
					
					vm.selectCameras = [];
					var firstCameras = areaTree.transformTozTreeNodes(data);
					//var firstCameras =  data;
					for(var i=0,j=firstCameras.length;i<j;i++){
						if(!firstCameras[i].isParent){
							firstCameras[i].open=false;
							vm.selectCameras.push(firstCameras[i]);
						}
					}
					if(vm.check=='area' && vm.selectCameras.length>0){
						homePage();
					}
					generateTreeData();
				}
			});
	 }
	 
	 
	 
	/**
	 * 初始化左侧区域摄像机树
	 * @returns
	 */
	function initAreaCameraTree(){
		
		treeArray = [];
		vm.cameraData = []; 
		setting={
			view:{dblClickExpand:false},	 
			data:{
				simpleData:{
					enable:true,
					pIdKey:'pid'
				}
			},
			edit: {
				enable: true,
				drag: {
					prev:false,
					next:false,
					inner:false
				},
				showRemoveBtn:false,
				showRenameBtn:false,
			},
			callback:{
				onDrop:function(e,treeId, treeNodes, targetNode, moveType, isCopy){
					var me=this;
					var ce = $(e.target);
					if(ce.hasClass('plancameras') || ce.hasClass('cameraName') || ce.hasClass('cameras') || ce.hasClass('empty') || ce.hasClass('pl') || ce.hasClass('plan_camera') || ce.hasClass('plan_img')){
						for(var i=0;i<treeNodes.length;i++){
							var isIn = uniqueDvc(treeNodes[i].id);
							if(isIn === false){
								vm.planCameras.push({
									id:treeNodes[i].id,
									name:treeNodes[i].name,
									pid:treeNodes[i].pid,
									cbd_type:treeNodes[i].cbd_type,
									selected:false,
									isLoad:false
								});															
							}
						}	
						areaTree.cancelSelectedNode();
						if(vm.check == 'plan'){
							homePage();
						}
					}
				},
				beforeDrag:function(treeId, treeNodes){
					var me =this;
					me.isDrop = false;
					for(var i=0;i<treeNodes.length;i++){
						return !treeNodes[i].isParent;
					}
				},
				onClick:function(event,treeId,treeNode){
					if(!treeNode){
						return;
					}
					if(treeNode.isParent){
						vm.selectAreaName = treeNode.name;
						//getSelectNodeCameras(treeNode);
						getDomsByClickNode(treeNode);
						
					}else{
//						if(treeNode.cbd_area_name != vm.selectAreaName){
//							if(treeNode.cdb_dept_name != vm.selectAreaName){
//								message.alert("请先选择当前区域");
//								return false;
//							}
//							
//						}
						selectedNodeIndex = -1;
						for(var i = 0;i<vm.selectCameras.length;i++){
							if(treeNode.id == vm.selectCameras[i].id){
								selectedNodeIndex = i;
								vm.selectCameras[i].open = true;
								$(".videos").find('.col-xs-4').find('.cam').removeClass("selected");
								$(".videos").find('.col-xs-4').eq(i).find('.cam').addClass("selected");
//								var a = $(".videos").find('.col-xs-4').eq(i).find('.cam');
//								 $('.videos').animate({
//							            scrollTop: $(a).offset().top - 106
//							        }, 1500);
								//.eq(i).addClass("selected"); 
							}
						}
						if(selectedNodeIndex == -1){
							message.alert('请先选择当前区域再选择摄像头'); 
							return false;
						}
						
						if(vm.check !='plan' && vm.check !='area'){
							resetTimer();
							videoCameras=[];
							vm.isSelectChangeIndex = true;
							for(var i=0;i<vm.treeAllNodes.length;i++){
								if(vm.treeAllNodes[i].id == treeNode.id){
									vm.index = i;
								}
							}							
						}
						addNavDom(treeId,treeNode);
					}
				},
				onDblClick:function(event,treeId,treeNode){
					if(!treeNode || treeNode.isParent){
						return;
					}
					resetTimer();
					videoCameras = [];
					pushVideoClient(treeNode.id);
					openVideoClient();
				},
				onExpand : function(event, treeId, treeNode) {
					
					var haveVal = false;
					$.each(treeArray, function(idx, item){
						if (item == treeNode.tId) {
							haveVal = true;
							return false;
						}
						
					})
					if (haveVal) {
						return false;
					}
					treeArray.push(treeNode.tId);
					
					loadNodeByPNode(treeNode);
					
				}
			}
		}
		switch (loginUser.dataAuth) {
			case 0:
				deptAreaCameraData();			
				break;
			case 1:
				prisonAreaCameraData();
				break;
			case 2:
				provinceAreaCameraData();
				break;
		}
	}
	
	/**
	 * 加载子节点
	 */
	function loadNodeByPNode(treeNode) {
		
		if (loginUser.dataAuth == 0) {
			// 加载摄像机列表
			db.query({
				request: {
					sqlId: 'select_camera_dept',
					whereId : 0,
					orderId:0,
					params: [loginUser.deptId,loginUser.userId, treeNode.id]
				},
				success: function (data) {
					for(var i=0,j=data.length;i<j;i++){
						data[i].id = 'c_'+data[i].id;
						vm.cameraData.push(data[i]);
						
						areaTree.addNodes(treeNode, data[i]);
					}
					generateTreeData();
				}
			});
		} else if (loginUser.dataAuth == 1) {
			// 加载摄像机列表
			db.query({
				request : {
					sqlId : 'select_camera_tree',
					whereId : 2,
					orderId : 0,
					params : [ loginUser.cusNumber, treeNode.id ]
				},
				success : function(data) {
					for (var i = 0, j = data.length; i < j; i++) {
						data[i].id = 'c_' + data[i].id;
						vm.cameraData.push(data[i]);

						areaTree.addNodes(treeNode, data[i]);
					}

					generateTreeData();
				}
			});
		} else if (loginUser.dataAuth == 2) {
			db.query({
				request: {
					sqlId: 'select_camera_tree',
					whereId:'3',
					params: [treeNode.id],
					orderId:0
				},
				success: function (data) {
					for(var i=0,j=data.length;i<j;i++){
						data[i].id = 'c_'+data[i].id;
						vm.cameraData.push(data[i]);
						areaTree.addNodes(treeNode, data[i]);
					}
					generateTreeData();
				}
			});
		}
	}
	
	/**
	 * 省局级别加载区域摄像机树
	 * @returns
	 */
	function provinceAreaCameraData(){
		//加载所有监狱
		db.query({
			async:false,
			request: {
				sqlId: 'select_org_dept',
				whereId:2,
				orderId:0
			},
			success: function (data) {
				for(var i=0,j=data.length;i<j;i++){
					data[i].isParent = true;
					vm.cameraData.push(data[i]);
				}
			}
		});
		//加载区域
		db.query({
			async:false,
			request: {
				sqlId: 'select_province_include_camera_area_tree',
				orderId:0
			},
			success: function (data) {
				for(var i=0,j=data.length;i<j;i++){
					data[i].isParent = true;
					vm.cameraData.push(data[i]);
				}
				areaTree = $.fn.zTree.init($('#areaTree'),setting,vm.cameraData);
				generateTreeData();
				//先初始化首页按钮
				homePage();
			}
		});
	}
	
	/**
	 * 监狱级别加载区域摄像机树
	 * @returns
	 */
	function prisonAreaCameraData(){
		//加载区域
		db.query({
			async:false,
			request: {
				sqlId: 'select_include_camera_area_tree',
				whereId: 0,
				orderId:0,
				params: [loginUser.cusNumber,loginUser.cusNumber]
			},
			success: function (data) {
				for(var i=0,j=data.length;i<j;i++){
					data[i].isParent = true;
					vm.cameraData.push(data[i]);
				}
				
				vm.cameraData.push({
					id:loginUser.cusNumber,
					name:loginUser.cusNumberName,
					pid:0,
					isParent:true
				});
				areaTree = $.fn.zTree.init($('#areaTree'),setting,vm.cameraData);
				generateTreeData();
				//先初始化首页按钮
				homePage();
			}
		});
	}
	
	/**
	 * 部门级别加载区域摄像机树
	 * @returns
	 */
	function deptAreaCameraData(){
		//加载区域
		db.query({
			async:false,
			request: {
				sqlId: 'select_org_dept_byoddid',
				orderId:0,
				params: [loginUser.deptId]
			},
			success: function (data) {
				for(var i=0,j=data.length;i<j;i++){
					data[i].isParent = true;
					vm.cameraData.push(data[i]);
				}
//				vm.cameraData.push({
//				id:loginUser.cusNumber,
//				name:loginUser.cusNumberName,
//				pid:0,
//				isParent:true
//			});
			areaTree = $.fn.zTree.init($('#areaTree'),setting,vm.cameraData);
			generateTreeData();
			//先初始化首页按钮
			homePage();
			}
		});
	}
	
	/**
	 * 树加载完了 做一些操作
	 * @returns
	 */
	function generateTreeData(){
		vm.treeAllNodes = [];
		var nodes = areaTree.getNodes();
		var datas = areaTree.transformToArray(nodes);
		for(var i=0,j=datas.length;i<j;i++){
			if(!datas[i].isParent){
				vm.treeAllNodes.push(datas[i]);				
			}
		}
	}
	
	initAreaCameraTree();
	
	
	function getSelectNodePlans(nodes){
		vm.selectPlans = [];
		var firstPlans =  planTree.transformToArray(nodes);
		for(var i=0,j=firstPlans.length;i<j;i++){
			if(!firstPlans[i].isParent){
				firstPlans[i].open=false;
				vm.selectPlans.push(firstPlans[i]);
			}
		}
	}
	
	/**
	 * 加载视频预案树
	 * @returns
	 */
	function initVideoPlanTree(){
		vm.planData = [];
		vm.selectPlanCameras=[];
		chosePlanSetting = {
			view:{dblClickExpand:false},	
			data:{
				simpleData:{
					enable:true,
					pIdKey:'pid'
				}
			},
			callback:{
				onClick:function(event,treeId,treeNode){
					if(!treeNode){
						return;
					}
					if(!treeNode.isParent){
						vm.plan.id = treeNode.id;
						vm.plan.name = treeNode.name;
						vm.showPlanTree = false;
					}
				}
			}
		}
		planSetting={
			view:{dblClickExpand:false},	 
			data:{
				simpleData:{
					enable:true,
					pIdKey:'pid'
				}
			},
			edit: {
				enable: true,
				drag: {
					prev:false,
					next:false,
					inner:false
				},
				showRemoveBtn:false,
				showRenameBtn:false,
			},
			callback:{
				onDrop:function(e,treeId, treeNodes, targetNode, moveType, isCopy){
					var me=this;
					if(me.isDrop){
						me.isDrop = false;
					}
				},
				beforeDrag:function(treeId, treeNodes){
					var me =this;
					me.isDrop = false;
					for(var i=0;i<treeNodes.length;i++){
						return !treeNodes[i].isParent;
					}
				},
				onDragMove:function(e, treeId, treeNodes){
					var me =this;
					me.targetEl =  $(e.target);
					if(me.targetEl.hasClass('empty') || me.targetEl.attr('id') == 'plancon' || me.targetEl.attr('id') == 'pcon' || me.targetEl.hasClass('row') || me.targetEl.hasClass('pl')){
						me.isDrop = true;
					}
				},
				onClick:function(event,treeId,treeNode){
					if(!treeNode){
						return;
					}
					if(treeNode.isParent){
						vm.selectTypeName = treeNode.name;
						getSelectNodePlans(treeNode);
					}
				},
				onDblClick:function(event,treeId,treeNode){
					if(!treeNode || treeNode.isParent){
						return;
					}
					resetTimer();
					videoCameras=[];
			    	loadPlanCameras(treeNode.id);
				}
			}
		}
		switch (loginUser.dataAuth) {
			case 0:
				prisonVideoPlanData();			
				break;
			case 1:
				prisonVideoPlanData();
				break;
			case 2:
				provinceVideoPlanData();
				break;
		}
	 }
	
	/**
	 * 监狱级别
	 * @returns
	 */
	function prisonVideoPlanData(){
		vm.planData.push({
			id:loginUser.cusNumber,
			name:'公共预案',
			pid:0,
			isParent:true
		});
		vm.planData.push({
			id:'private_'+1,
			name:'个人预案',
			pid:0,
			isParent:true
		});
		db.query({
			async:false,
			request: {
				sqlId: 'select_plantype_tree',
				whereId: 0,
				params: [loginUser.cusNumber]
			},
			success: function (data) {
				for(var i=0,j=data.length;i<j;i++){
					data[i].isParent = true;
					vm.planData.push(data[i]);
				}
			}
		});
		db.query({
			async:false,
			request: {
				sqlId: 'select_plan_tree_public',
				whereId: 0,
				params: [loginUser.cusNumber]
			},
			success: function (data) {
				vm.selectPlans = [];
				for(var i=0,j=data.length;i<j;i++){
					vm.planData.push(data[i]);
					vm.selectPlans.push(data[i]);
				}
				vm.selectTypeName = '公共预案';
			}
		});
		db.query({
			request: {
				sqlId: 'select_plan_tree_private',
				whereId:0,
				params: [loginUser.cusNumber,loginUser.userId]
			},
			success: function (data) {
				for(var i=0,j=data.length;i<j;i++){
					data[i].pid = 'private_'+data[i].pid;
					vm.planData.push(data[i]);
				}
				chosePlanTree = $.fn.zTree.init($('#chosePlanTree'),chosePlanSetting,vm.planData);
				planTree = $.fn.zTree.init($('#planTree'),planSetting,vm.planData);
				planTree.selectNode(planTree.getNodes()[0]);
			}
		});
	}
	/**
	 * 省局级别
	 * @returns
	 */
	function provinceVideoPlanData(){
		vm.planData.push({
			id:loginUser.cusNumber,
			name:'公共预案',
			pid:0,
			isParent:true
		});
		vm.planData.push({
			id:'private_'+1,
			name:'个人预案',
			pid:0,
			isParent:true
		});
		db.query({
			async:false,
			request: {
				sqlId: 'select_org_dept',
				whereId:1,
				orderId:0
			},
			success: function (data) {
				for(var i=0,j=data.length;i<j;i++){
					data[i].isParent = true;
					vm.planData.push(data[i]);
				}
			}
		});
		db.query({
			async:false,
			request: {
				sqlId: 'select_plantype_tree'
			},
			success: function (data) {
				for(var i=0,j=data.length;i<j;i++){
					data[i].isParent = true;
					vm.planData.push(data[i]);
				}
			}
		});
		db.query({
			async:false,
			request: {
				sqlId: 'select_plan_tree_public',
				whereId: 0,
				params: [loginUser.cusNumber]
			},
			success: function (data) {
				vm.selectPlans = [];
				for(var i=0,j=data.length;i<j;i++){
					vm.planData.push(data[i]);
					vm.selectPlans.push(data[i]);
				}
				vm.selectTypeName = '公共预案';
			}
		});
		db.query({
			request: {
				sqlId: 'select_plan_tree_private',
				whereId:0,
				params: [loginUser.cusNumber,loginUser.userId]
			},
			success: function (data) {
				for(var i=0,j=data.length;i<j;i++){
					data[i].pid = 'private_'+data[i].pid;
					vm.planData.push(data[i]);
				}
				planTree = $.fn.zTree.init($('#planTree'),planSetting,vm.planData);
				chosePlanTree = $.fn.zTree.init($('#chosePlanTree'),chosePlanSetting,vm.planData);
			}
		});
	}
	initVideoPlanTree();
	
	
	 function pushVideoClient(cameraId){
		 cameraId = cameraId + '';
		 var newCid  = cameraId.replace('c_','');
		 videoCameras.push(newCid);
	 }
	 function closeInterval(){
		clearInterval(timeInterval);
		clearInterval(videoInterval);
	 }
	 function closePlanInterval(){
		clearInterval(ptimeInterval);
		clearInterval(pvideoInterval);
	 }
	 
	 function clearTags(){
		vm.curMTag = '';
		vm.s10 = 10;
		vm.s20 = 20;
		vm.s30 = 30;
		vm.s60 = 60;
	 }
	 
	 function clearPlanTags(){
		vm.ycurMTag = '';
		vm.ys10 = 10;
		vm.ys20 = 20;
		vm.ys30 = 30;
		vm.ys60 = 60;
	 }
	 
	 function resetTimer(){
		closePlanInterval();
		closeInterval();
		clearPlanTags();
		clearTags();
	 }
	 
	 /**
	  * 打开视频客户端
	  */
	 function openVideoClient(){
		 videoClient.play(videoCameras);
		
		 var temp=[];
		 
		 var flag=true;
		 
		 for(var j=0,jlen=videoCameras.length;j<jlen;j++){
			 var id=videoCameras[j];
			 
			 for(var i=0,len=vm.cameraData.length;i<len;i++){
				if(vm.cameraData[i].id=='c_'+id){
					temp.push(vm.cameraData[i].name);
					flag=false;
					break;
				}
			}
			if(flag){
				for(var i=0,len=vm.selectPlanCameras.length;i<len;i++){
					if(vm.selectPlanCameras[i].id==id){
						temp.push(vm.selectPlanCameras[i].name);
						break;
					}
				}
			}
		 }
		 temp.length&&db.ajax("sys/log",{oprLog:JSON.stringify({
				cusNumber:loginUser.cusNumber, 		// 机构号
				type:'1',			// 操作类型
				userId:loginUser.userId,		// 操作用户ID
				userName:loginUser.userName, 		// 操作用户姓名treeObj.getNodeByParam("id",videoCameras[index], null)
				operatedDesc:'查看->'+temp.join(','), 	// 操作内容
				
			})});
	 }
	 /**
	  * 打开新增预案
	  * @returns
	  */
	function openAddWin(){
		dial = dialog.open({
			targetId:'addPlan',
			title:'新增视频预案',
			w:'45%',
			h:'300'
		});
	}
	
	function addNavDom(treeId,treeNode){
		var tid = treeNode.tId;
		var dom = $('#'+tid+'_a');
		var cameraId =  treeNode.id.replace('c_','');
		var btnSpan  = dom.find('#nav_'+cameraId);
		$('.c_nav').hide();
		if(dom.find('#nav_'+cameraId).length==0){
			btnSpan = $('<img id="nav_'+cameraId+'" src="image/location.png" alt="定位" class="c_nav" />');			
			dom.append(btnSpan);
		}else{
			btnSpan.show();
		}
		$('#nav_'+cameraId).off('click');
		$('#nav_'+cameraId).on('click',function(){
			require(['hz/map/map.handle'],function(hzMap){
				hzMap.locationDvc(1,cameraId);
			})
		})
	}
	
	function uniqueDvc(dvcId){
		for(var i=0;i<vm.planCameras.length;i++){
			if(dvcId == vm.planCameras[i].id){
				return true;
			}
		}
		return false;
	}
	
	/**
	 * 上方区域拖拽事件bind
	 */
	
	$(function(){
		var cname = '',cid='';
		$('.videos').on('drag','.video_item',function(event){
			cid = $(event.target).attr('cid');
			cname = $(event.target).attr('cname');
		});
		$('#plancon').on('drop',function(ev){
			ev.preventDefault();
			var isIn = uniqueDvc(cid);
			if(isIn===false){
				vm.planCameras.push({
					id:cid,
					name:cname,
					selected:false,
					isLoad:false
				});						
			}
			areaTree.cancelSelectedNode();
			if(vm.check == 'plan'){
				homePage();				
			}
		})
		$('#plancon').on('dragover',function(ev){
			ev.preventDefault();
		})
		$('.treeContent').on('mouseleave',function(){
			$('.treeContent').hide();
			vm.showPlanTree=false;
		})
		$('.videos').on('dblclick','.plan',function(){
			resetTimer();
			videoCameras=[];
			var pid = $(this).attr('id');
			vm.selectPlans.forEach(function(p1){
	    		if(pid == p1.id){
	    			p1.open = true;	    			
	    		}else{
	    			p1.open = false;
	    		}
	    	});
	    	loadPlanCameras(pid);
		})
	})
	
	//获取视频记录地点
    hzEvent.on('get.video.cut.place', function (index) {
    	var node = treeObj.getNodeByParam("id",videoCameras[index], null);
    	return node.name;
    });
});