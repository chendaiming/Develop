define(["jquery","vue","frm/hz.drag","frm/hz.event","frm/loginUser",'frm/hz.db',"frm/localStorage"],function($,tpl,drag,hzEvent,login,db,ls){
	var model ;
	var callRoll;
	var arrayList=[], cacheList={},permission=[],named=[];

	//绑定模型
	function bingModel(msg){
		model=new tpl({
			el:callRoll,
			data:{
				total:0,
				callList:msg?[msg]:[],
				areaPage:1,
				cur:'',
				already:0,
				alreadyS:0,
				flagInint:false,
				fla:true,
				totalNum:named.length,
				currentArea:{
					detail:{},
					detailList:[],
					detailPage:0,
					flag:1,
					finish:false
				}
			},
			methods:{
				slideup:function(e){
					//callRoll.classList.remove("slideup");
					$("section#police_name").show();
				},
				showDetail:function(item){
					var that = this;
					$('section#detail').show();
					that.currentArea.detail=item;
					that.cur=item['crm_record_id'];
					var list=cacheList[that.cur];//list,finish,time
					this.currentArea.detailList=list?(list.length?list:[]):[];//获取缓存中的数据
					if(item.flag){//历史点名
						model.flagInint = false;
						queryNoCalled(this.currentArea.detail['crm_record_id']);
						//callRoll.previousElementSibling.classList.remove("roll");
						that.currentArea.detail['time'] =item.crm_begin_time+"-"+item.crm_end_time;
						namedS(that.cur);
					}
					history_record();
					/*地图不联动hzEvent.call('callRoll.openDetail')；地图联动 hzEvent.call("callRollMain.linkageByDprt", item.crm_dprt_id)*/
					item.flag?hzEvent.call('callRoll.openDetail') :hzEvent.call("callRollMain.linkageByDprt", item.crm_dprt_id);
					//this.currentArea.flag=this.currentArea.detailPage=list.length<10?1: Math.ceil(list.length/10);
					model.$nextTick(function(){
						scrollBtm();
					});
				},
				getCalledList: function () {
					var list = cacheList[this.cur] || [];
					return list.map(function(item){
						return item.crd_prisoner_id;
					});
				},
				changeS:function(e,type){
					e.target.parentNode.childNodes.forEach(function(item){
						item.classList&&item.classList.remove("active");
					});
					e.target.classList.add("active");
					
					if(type==1){//已点
						/*var l=new */
						namedS(this.cur);

					}else{
						queryNoCalled(this.currentArea.detail['crm_record_id']);
					}
					model.$nextTick(function(){
						scrollBtm();
					});
				},
				close:function(e,type,el){
					var pos=e.target.getBoundingClientRect();
					if(el == 'fanhiu'){//定位
						$('#detail').hide();
						$("section#police_name").show();
					}else if(el == "shouqi"){//定位
						//e.target.parentNode.parentNode.classList.add('h');
						callRoll.previousElementSibling.classList.remove("show");
						$('#detail').hide();
						//hzEvent.call("callRollMain.clearStyle");
						$("section#police_name").hide();
					}
				},
				nameListS:function(e,type){
					e.target.parentNode.childNodes.forEach(function(item){
						item.classList&&item.classList.remove("active");
					});
					e.target.classList.add("active");

					if(type == 1){//正在点名
						this.fla = true;
						model.callList = [];
						for(var i= 0,leg=arrayList.length;i<leg;i++){
							if(!arrayList[i]['crm_end_time']){
								model.callList.push(arrayList[i]);
							}
						};
					}else{//历史点名
						this.fla = false;
						history_record();
						model.callList = named;
					};
					model.$nextTick(function(){
						scrollName();
					});
				}
			}
		});
	}

	var hzRightNav = null;
	/*
	 * 加载rightnav对象
	 */
	hzEvent.load('hz.rightnav', function (rightNav) {
		var jqNav = rightNav.add('callbutton','点名','iconfont icon-dianming');
		if (jqNav) {
			jqNav.on('click',function(e){
				$("section#police_name").show();
			});
		}
		hzRightNav = rightNav;
	});

	/*
	 * 设置显示数量
	 */
	function setNum () {
		hzRightNav && hzRightNav.setNum('callbutton', model ? model.total : 0);
	}


	//已點名
	function namedS(cur){

		db.query({
			request:{
				sqlId:'select_call_roll_point_history',
				params:{id:cur}
			},success:function(data){
				var area= [];
				for(var i= 0,leg=data.length;i<leg;i++){
					if(data[i].crd_time!=''){
						area.push(data[i]);
					}
				}
				area = (area.length==0)?[]:area.unique1();

				model.currentArea.detailList = area;
				model.already=model.currentArea.detailList.length;
				//model.alreadyS = (model.currentArea.detail['crm_predict_num']-model.already)<=0?0:(model.currentArea.detail['crm_predict_num']-model.already);
				model.$nextTick(function(){
					scrollBtm();
				})
			}
		});

	}
	//加载页面
	  function ajaxHtml(){
		  $("#callRoll").load("page/cds/callroll/callRoll.html",function (responseText, textStatus, XMLHttpRequest) {
			  $(callRoll).html(XMLHttpRequest.responseText) ;
			 bingModel();
			  /*var detail=callRoll.querySelector("#detail");
			  document.body.insertBefore(detail,callRoll);
			  drag.on(detail);*/
		  });
		  setNum();
	  }

	//未點名
	function queryNoCalled(recordid){
		db.query({
			request:{
				sqlId:'select_no_call_roll_list',
				params:[login.cusNumber,recordid],
				whereId:0

			},success:function(data){

				if(model.flagInint){
					model.currentArea.detailList=data;
					//model.currentArea.flag=1;
					model.currentArea.detailPage=Math.ceil(data.length/10);
					var noCall=data.map(function (item){
						return item.crd_prisoner_id;
					});
					model.$nextTick(function(){
						scrollBtm();
					})
					hzEvent.call("callRollMain.noCallPeople",noCall);
				}else{
					model.alreadyS = data.length;
					model.flagInint = true;
				}

			}
		});
	}
	//获取点名历史
	function history_record(){
		var cusData = (login.dataAuth==0)?login.deptId:login.cusNumber;
		db.query({
			request:{
				sqlId:'select_call_roll_hository',
				params:{cus: cusData}
			},success:function(data){
				named = data;
				if(model){
					model.totalNum = named.length;
				}
			},
			error:function(data){
				console.error(data)
			}
		});
	}
	history_record();
	//开始结束点名
	function beginRoll(data){
		var msg = data.msg[0];

		if(!permission.includes(msg['crm_dprt_id'])||isRepeat(arrayList,msg['crm_record_id'],'crm_record_id')){
			return;
		}
		msg.finish=false;
		msg.time=msg['crm_begin_time'];
		cacheList[msg['crm_record_id']] =[];

		//发布事件
		hzEvent.call("callRollMain.callrollBegin");


		if(!msg['crm_end_time']){//开始点名
			arrayList.push(msg);
			if(!callRoll.childElementCount){//加载面板
				$(callRoll).load("page/cds/callroll/callRoll.html",function (responseText, textStatus, XMLHttpRequest) {

					callRoll.innerHTML = XMLHttpRequest.responseText;

					//bingModel(msg);//只执行一次

					/*var detail=callRoll.querySelector("#detail");

					document.body.insertBefore(detail,callRoll);

					drag.on(detail);*/
				});
			} else {//显示点名区域
				initPage(msg);

			}
		}else{//结束点名
			endRoll(msg);

		};
		model.$nextTick(function(){
			scrollName();
			scrollBtm();
		});
		model.total=arrayList.length;
		setNum();
		//model&&model.total++;
		callRoll.classList.remove('h');

	}
	//正在点名
	function rolling(data){
		var msg = data.msg[0];
		if(!cacheList[msg['crd_record_id']]||isRepeat(cacheList[msg['crd_record_id']],msg['crd_prisoner_id'],'crd_prisoner_id')){
			return;
		}

		hzEvent.call("callRollMain.callrolling", msg.crd_prisoner_id);

		var curList=cacheList[msg['crd_record_id']];

		curList.push(msg);//缓存数据crd_record_id
		curList.unique1();
		cacheList.unique1();
		ls.setItem('cacheList',cacheList);
		if(model.cur!=msg['crd_record_id']){
			return;
		}
		//model.currentArea.flag!=1&&(model.currentArea.flag=1);//永远展示最后一页

		var arrLen=curList.length;
		model.currentArea.detailList.push(msg);
		model.already=model.currentArea.detailList.length;
		model.alreadyS = (model.currentArea.detail['crm_predict_num']-model.already)<=0?0:(model.currentArea.detail['crm_predict_num']-model.already)
		model.$nextTick(function(){
			scrollBtm();
		})

	}
	//判断是否重复
	function  isRepeat(list,id,key){
		for(var i=0,len=list.length;i<len;i++){
			if(list[i][key]==id){
				return true;
			}
		}
		return false;
	}
	//监控滚动条置底
	function scrollBtm(){
		document.getElementById('detail_ul').scrollTop = document.getElementById('detail_ul').scrollHeight;
	}
	function scrollName(){
		document.getElementById('detailName').scrollTop = document.getElementById('detailName').scrollHeight;
	}
	//数组去重
	Array.prototype.unique1 = function(){
		var res = [this[0]];
		for(var i = 1; i < this.length; i++){
			var repeat = false;
			for(var j = 0; j < res.length; j++){
				if(this[i]["crd_prisoner_id"] == res[j]["crd_prisoner_id"]){
					repeat = true;
					break;
				}
			}
			if(!repeat){
				res.push(this[i]);
			}
		}
		return res;
	}
	//删除数组中指定元素
	Array.prototype.removeByValue = function(val) {
		for(var i=0; i<this.length; i++) {
			if (this[i] == val) {
				this.splice(i, 1); break;
			}
		}
	}
	//结束点名

	function endRoll(data){
		if(!model)return;
		data=data.msg[0];
		for(var i=0,len=arrayList.length;i<len;i++){
			if(data['crm_record_id']==arrayList[i]['crm_record_id']){
				arrayList[i]['finish']=true;
				arrayList[i]['time']=data['crm_end_time'];
				arrayList[i]['crm_fact_num']=data['crm_fact_num'];
				arrayList[i]['crm_predict_num']=data['crm_predict_num'];
				arrayList[i]['flag'] = 1;
				named.push(arrayList[i]);
				ls.setItem('named',named);
				if(model.fla){
					model.callList.removeByValue(arrayList[i]);
				}else{
					model.callList = named;
				}
				arrayList.removeByValue(arrayList[i]);
				model.totalNum = named.length;
				model.total=arrayList.length;
				setNum();
				break;
			}
		}
		hzEvent.call("callRollMain.callrollEnd");
	}
	function initPage(msg){

		if(model.fla){
			model.callList = arrayList;
		};

	}
	/*
	 * 初始化事件消息监听
	 */
	function initSubs () {
		var wm = window.top.webmessage;
		if (wm) {
			wm.on('CALLROLL_BEGIN','callRollBegin',beginRoll);
			wm.on('CALLROLL_END','callRollEnd',endRoll);
			wm.on('CALLROLL_ING','callRolling',rolling);
		} else {
			setTimeout(initSubs, 200);
		}

	}
	db.query({
		request:{
			sqlId:'select_permission_dep',
			params:[login.dataAuth>0?login.cusNumber:login.deptId]
		},
		success:function(data){
			data.length&&(permission=data[0].child.split(",").map(function(item){return parseInt(item);}));
		}
	});
	//追加面板
	(function (){
		callRoll = document.createElement("section");
		callRoll.id = "callRoll";
		callRoll.classList.add("callRoll", "vbox");
		top.document.body.appendChild(callRoll);
		drag.on(callRoll);

		
		var calledList = null;
		hzEvent.on('callRoll.openDetail', function () {
			calledList = model.getCalledList();
			//callRoll.classList.add("slideup");
			$("section#police_name").hide();
			//callRoll.previousElementSibling.classList.add("show");
		});

		hzEvent.on('callRoll.getCalledList', function () {
			return calledList || [];
		});
	})();
	ajaxHtml();
	initSubs();
});