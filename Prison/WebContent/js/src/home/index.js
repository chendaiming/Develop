define(function(require){
   var layer = require('layer');

   layer.config({
		shift:0, //默认动画风格
		extend: ['blue/style.css'],
		skin: 'layer-ext-blue',
		path:ctx+'libs/layer/' //layer.js所在的目录，requirejs必须用
	});

    var	vue = require('vue'),
    	dialog = require('frm/dialog'),
    	ls = require('frm/localStorage'),
    	panel = require('frm/panel'),
    	select = require('frm/select'),
    	loginUser = require('frm/loginUser'),
    	message = require('frm/message'),
    	frmwebmessage = require('frm/webmessage'),
    	hzDB = require('frm/hz.db'),
    	hzDrag = require('frm/hz.drag'),
    	hzEvent = require('frm/hz.event'),
    	hzVC = require('frm/hz.videoclient');

    var hzMap = require('hz/map/map.handle');

    var webmessage;

    if (loginUser.cusNumber) {
    	webmessage = window.top.webmessage = new frmwebmessage();
    	webmessage.init(websocketUrl, function () {
    		webmessage.websocket.on('onconnecting','showTip', function(event){
                console.log('系统已断开连接，正在尝试连接中...');
                $('#connectionTip').show();
            });
    		webmessage.websocket.on('onopen','showTip', function(event){
    			message.alert('系统连接成功!');
            });

    		webmessage.send({
                "serviceId": "LoginService",
                "method": "login",
                "cusNumber": loginUser.cusNumber,
                "userId": loginUser.userId,
                "msgId": loginUser.userId + '' + (new Date()).getTime()
            });

    		console.log('系统连接成功!');
    		$('#connectionTip').hide();
    	});
    }

    var vm = window.homeVm = new vue({
    	el:'#addVideoPlanPanel',
    	data:{
    		menuIsExpand: false,
    		curViewMenu: null,
    		boxSelect: 1,//当前框选模式
    		boxSelectCameras: [],
    		rightMenus: [],
			plan: {
				id:'',
				dgm_cus_number:loginUser.cusNumber,
				name:'',
				plan_type:'',
				dgm_use_range:0,
				dgm_crte_user_id:loginUser.userId,
				dgm_updt_user_id:loginUser.userId
			}
    	},
    	methods:{
    		saveVideoPlan: function(n){
    			savePlan(n);
    		},
    		closeVideoPlanPanel:function(){
    			$('#addVideoPlanPanel').hide();
    		},
    		setBoxSelect:function(n){
    			this.boxSelect = n;
    		}
    	}
    });


	hzEvent.subs('map.infopanel.click', 'loadPrisoner', function (data, target) {
		ls.setItem('prisonerCode',data.code);
		dialog.open({
			id:'259',
			title:'罪犯信息查询',
			type:2,
			url:'page/cds/prisoner/prisonerInfoNew.html'
		});
	}, true);



	function openModuleMenu (m) {		
		var curLayer = $('#'+m.id);
		if (curLayer.length == 0) {
			dialog.open({
				id:m.id,
				type:m.type,
				title:m.name,
				w:m.width,
				h:m.height,
				url:m.url,
				closeCallback:function(data){
					data && menuCloseCallBack(data);
				}
			});
			return;
		}

		$('.layui-layer').css('z-index',1990);
		curLayer.parent().css('zIndex',1990100);
		var minH = curLayer.parent().height();
		var maxminBtn = curLayer.parent().find('.layui-layer-maxmin');
		if(minH<50 && maxminBtn.length>0){
			curLayer.parent().find('.layui-layer-maxmin').trigger('click');
		}
	}


	/**
	 * 菜单窗口回调函数，根据url判断是哪一个窗口回调
	 */
	function menuCloseCallBack(data){
		var url = data.url;
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
		if(vm.plan.name.length>26){
			message.alert('预案名称过长，请输入26个以内字符');
			return;
		}
		var sqlId  = !vm.plan.id ? 'insert_videoplan' : 'update_videoplan';
		hzDB.updateByParamKey({
			request:[{
				sqlId:sqlId,
				params:vm.plan
			}],
			success:function(data){
				var grpId = !vm.plan.id ? data.data[0].seqList[0] : vm.plan.id;
				var pcs = [];
				var pname = vm.plan.name;
				for(var i=0;i<vm.boxSelectCameras.length;i++){
					pcs.push({
						dgr_cus_number:loginUser.cusNumber,
						dgr_dvc_id:vm.boxSelectCameras[i].linkId,
						dgr_grp_id:grpId,
						dgr_seq:i,
						dgr_crte_user_id:loginUser.userId
					});
				}
				hzDB.updateByParamKey({
					request:[{
						sqlId:'delete_videoplan_rltn',
						whereId:0,
						params:{dgr_grp_id:grpId,dgr_cus_number:loginUser.cusNumber}
					},{
						sqlId:'insert_videoplan_rltn',
						params:pcs
					}],
					success:function(data){
						message.alert('保存成功');
						resetPlan();
						$('#addVideoPlanPanel').hide();
					}
				});
			},
			error:function(){}
		});
	}

	function resetPlan(){
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

	//获取门禁密码，
	hzDB.query({
		request:{
			sqlId:'select_door_pwd_by_userId',
			params:{userId:loginUser.userId,cus:loginUser.cusNumber},
			whereId:'0'
		},success:function(data){
			if (data && data.length) {
				top.userInfodd.doorpwd = data[0].doorpwd;
				top.userInfodd.doorAvoid = data[0].dooravoid;
			}
		}
	});


	var initKeys = [
		'trackMove'	//移动轨迹
	];
	var initDatas = {};

	function initData(){
		for(var i = 0; i < initKeys.length; i++){
			var key = initKeys[i];
			hzEvent.on('get.'+key+'.initData', function (data) {
		    	return initDatas[data.key];
			});
			hzEvent.on('set.'+key+'.initData', function (data) {
				initDatas[data.key] = data;
			});
		}
	}


	/*
	 * 加载页面
	 * @param selecter 	页面容器（ID或样式名称）
	 * @param url 		页面地址
	 */
	function loadPage (selecter, url) {
//		var section = document.createElement('section');
//		
//		if (selecter.indexOf('#') == 0) {
//			section.id = selecter.replace('#', '');
//		}
//		if (selecter.indexOf('.') == 0) {
//			section.className = selecter.replace('.', '');
//		}
//
//		document.body.appendChild(section);

		$(selecter).load(url, function (responseText, textStatus, XMLHttpRequest) {
			$(selecter).html(XMLHttpRequest.responseText);
		});
	}


	/*
	 * 主页加载页面插件
	 */
	hzEvent.on('index.load.page', function (selecter, url) {
		loadPage(selecter, url);
	});

	try {

		//loadPage('#viewMenuAdd', 'page/map/viewMenu/viewMenuAdd.html');
		//loadPage('#addPointPanel', 'page/map/mapPoint/mapPoint.html');
		//loadPage('#roomDetail', 'page/map/roomDetail/roomDetail.html');
		loadPage('#alarmHandle', 'page/cds/alarm/alarmHandle.html');

	    hzDrag.on($('#addPointPanel'));
	    hzDrag.on($('#addVideoPlanPanel'));
	    hzDrag.on($('#roomDetail'));

	    require(['frm/hz.rightnav']);
	    require(['frm/hz.handledesc']);
		require(['hz/home/search']);
		require(['hz/home/map.load']);

		require(['frm/hz.core'], function (hzCore) {
			hzCore.init(basePath);
		});

		require(['sys/menu/menus'], function (menu) {
			menu.initMenu('#menuSection');

			function openMenu (data, attr) {
				openModuleMenu({
					'id': data.id,
					'pid': data.pid,
					'name': data.name,
					'icon': attr.icon,
					'width': attr.width,
					'height': attr.height,
					'url': attr.url,
					'permission': attr.permission,
					'type': attr.type,
					'seq': attr.seq
				});
			}

			hzEvent.subs('hz.menu.open', function (data){
				var attr = data.attributes;
				var type = data.attributes.type;
				var url = data.attributes.url;

				switch(type) {
					case 1:
					case 2: openMenu(data, attr); break;
					case 3: location.href = url; break;
					case 4: window.open(url); break;
				}
			});
		});

		require(['hz/map/viewMenu/viewMenus'], function (menu) {
			menu.initMenu('#viewSection');

		    /*
		     * 视角菜单
		     */
		    hzEvent.subs('hz.viewmenu.click', 'index', function (menu) {
		    	$('#vname').val(menu.name);
				$('#vid').val(menu.id);
				hzEvent.emit('view.menu.onclick', menu);
		    	hzMap.location(menu.id);
		    });
		});

//		require(['cds/video/videoRecord'],function(video){
//			video.initMenu('#videoRecordSection');
//		});
		
//		require(['cds/alarm/addAlarmPlan'],function(vp){
//			vp.initMenu('#addAlarmPlanSection');
//		});

		initData();
	} catch (e) {
		console.error(e);
	}
});
