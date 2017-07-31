define(['jquery','vue','frm/hz.db',"frm/message","frm/model","frm/loginUser","hz/map/map.handle","frm/hz.videoclient","frm/searchByPinyin","frm/treeUtil", 'frm/hz.event',"ztree"],function($,tpl,db,tip,modelData,login,mapHandle,video,sp,util, hzEvent){
	//窗口设置
	var p=window.frameElement.parentNode.parentNode;//包含iframe的div
	setTimeout(function(){p.classList.add("flip")},400);
	
	var cameraList=[],patrlTimer,positive='left',accept=true,searchList=[];//接收事件,//巡视过程中的摄像机
	//地图api
	var map = mapHandle.routePatrol;
	//返回标志
	var backflag=true,timed=10;
	
	//
	var layout=1;
	//创建数据模型
	var model=new tpl({
		el:"#modelcontainer",
		data:{
			patrol:[],//预案列表
			camera:[],//摄像机列表
			name:'',//线路名称
			route:[],//线路坐标
			routeid:'',//线路id
			type:'',//设备类型
			linkdevice:[],//线路关联的设备
			cameraSeach:'',//搜索
			count:{//
				selects:'',
				total:''
			},
			view:{
				height:'',
				speed:'',
				radius:'',
				stoptime:10,
				disabled:false
			},
			treeKey:'',
			
			hasUpdateSpeed: false,	// 是否正在调整速度
			updateSpeedTID: null	// 自动调整速度的定时器ID
		},
		watch:{
			linkdevice:function(val,old){
				var temp=getSelect(edit[0].querySelector("ul"));
				cameraList=temp.length?temp:model.linkdevice;//JSON.parse(JSON.stringify(val));
			},
			cameraSeach:function(val,old){
				if(val.length!=0){
					this.camera=sp.search(val,"name",searchList);
				}else{
					this.camera=searchList;
				}
				model.$nextTick(function(){setchecked();});
			},
			'view.radius':function(val,old){
				if(old.length&&val.length){
					map.editRoute(map.getRoute(), {searchRadius:parseInt(val),searchLinkTypes:1});//
				}
			}
		},
		methods:{
			stop:function(e){//暂停
				clearTimeout(patrlTimer);
				if(!e.target.classList.contains("play")){
					map.pausePatrol();
					e.target.classList.add("play");
					accept=false;
					editTime=true;
				}else {
					startPatrol();
					accept=true;
					e.target.classList.remove("play");
					
					clearTimeout(timeShow);
					
					this.view.disabled=false;
					
					this.view.stoptime=timed;
				}
			},
			over:function(e){//结束
				accept=true;
				clearTimeout(patrlTimer);
				
				clearTimeout(timeShow);
				model.view.disabled=false;
				model.view.stoptime=timed;
				
				map.stopPatrol();
				e.target.previousElementSibling.classList.remove("play");
			//	map.editRoute(map.getRoute(), {searchRadius:model.view['radius'], searchLinkTypes:1});//
			},
			play:function(e,item){//播放视频
				var pos=e.target.getBoundingClientRect();
				if(30>e.x&&e.x>0&&e.y<pos.bottom&&pos.top<e.y<pos.bottom){
					video.play([item.linkId]);
				}
			},

			/*
			 * 按下调整速度
			 */
			updateSpeed: function (flag) {
				if(this.view.disabled) return;

				// 调整速度时锁定状态
				this.hasUpdateSpeed = true;

				// 按下时先调整一次速度
				this.changeSpeed(flag);

				// 长按0.5秒后连续调整速度值（默认速度时1秒10次）
				this.updateSpeedTID = setTimeout(function () {
					model.updateSpeedTID = setInterval(function (flag){
						model.changeSpeed(flag);
					}, 100, flag);
				}, 500);

				map.pausePatrol();
			},

			/*
			 * 弹起恢复巡视
			 */
			restorePatrol: function (flag) {
				// 清除长按定时任务
				clearTimeout(this.updateSpeedTID);
				clearInterval(this.updateSpeedTID);

				if (this.view.disabled) return;

				// 释放锁定状态
				this.hasUpdateSpeed = false;

				// 设置速度并开始巡视
				map.setParam('walkSpeed', model.view.speed);

				// 如果调整速度时是巡视状态，则调整完之后继续
				if (accept) {
					map.startPatrol();				
				}
			},

			/*
			 * 改变巡视速度
			 */
			changeSpeed: function (flag) {
				this.view.speed += flag;
				if (this.view.speed > 350) {
					this.view.speed = 350;
				} else if (this.view.speed < 0) {
					this.view.speed = 0;
				}
			}
		}
	});
	
	//加载按钮！ 立即执行
	for(var list=document.getElementById("mainopr").children, i=0;i<4;i++){
		
		if(list.length){
			if(list[0].classList&&list[0].classList.contains("speedcontrol")){
				var temp=list[0].querySelectorAll("input");
				//速度
				temp[0].oninput=function(e){
					if(isNaN(this.value)){
						model.view.speed=this.value=0;
					}else{
						this.value=this.value>800?800:this.value;
						model.view.speed=Math.abs(this.value);
					}
				}
				//暂停时间
				temp[1].oninput=function(e){
					this.value=isNaN(this.value)?0:Math.abs(this.value);
					if(!editTime)return;
					timed=this.value;
				}
			}
			//每次追加一个
			p.appendChild(list[0]);
		}
	}
	
	//初始化列表线路
	db.query({
		request:{
			sqlId:'select_patrol_list',
			params:{"cus":login.cusNumber,'user':login.userId},//省局用户要查出下面的所有机构号
		},success:function(data){
			model.patrol=data;
			video.setLayout(1);
		}
	});

	//划线的时候搜索
	map.onSearch(function(list){ 
		console.log(list);
		model.cameraSeach='';
		model.camera=searchList=list;
		model.count.total=list.length;
		sortSelfNode();
		model.$nextTick(function(){setchecked();});
	},"ck_seach_device");

	//巡视的时候搜索
	map.onPatrolMove(function(data){
		
		if(!accept)return;//接收事件)
		
		var list=getCameras(data.pos,data.dis);//
		
		if(list.length){//如果设备存在则暂停巡视 启用客户端
			//p.children[4].textContent='跳过';
			map.pausePatrol();
			layout!=list.length&&(layout=list.length,video.setLayout(layout));
			video.play(list);
			setCarmer(list);
			patrlTimer=setTimeout(function(){startPatrol();},model.view.stoptime*1000);//暂停
		}
	},"move_play_video");
	//倒计时
	var timeShow,editTime=false;
	function settime(){
		
		editTime=false;
		
		model.view.disabled=true;
		
		if(model.view.stoptime==0){
			clearTimeout(timeShow);
			model.view.stoptime=timed;
			model.view.disabled=false;
			editTime=true;
			p.children[4].classList.remove("play");
		}else{
			model.view.stoptime--;
			timeShow=setTimeout(settime,1000);
			p.children[4].classList.add("play");
		}
	}
	//设置摄像机状态
	function setCarmer(list){
		var camera=p.children[6];
		var temp;
		var child=camera.children;
		for(var i=0,len=child.length;i<len;i++){
			child[i].style.animation='';
		}
		for(var i=0,len=list.length;i<len;i++){
			temp=camera.querySelector("li[data-rel='"+list[i]+"']");
			temp&&(temp.style.animation='videoplay 1s infinite',(temp.offsetLeft+temp.clientWidth>p.clientWidth)&&(p.children[6].style[positive]='-'+(temp.offsetLeft-p.clientWidth/2)+'px'));
		}
		if(list.length){
			//清除定时器
			clearTimeout(timeShow);
			
			model.view.stoptime=timed==0?0:(parseInt(timed)+1);
			
			timed!=0&&(model.view.disabled=false,settime());
			
			
			editTime=true;
		}
	}


	/*
	 * 开始巡视
	 */
	function startPatrol (data, params) {
		accept=true;
		map.startPatrol(data, params);
		hzEvent.emit('3d.patrol.startPatrol');
	}

	//巡视结束
	map.onPatrolStop(function(){
		accept&&patrolOver();
		hzEvent.emit('3d.patrol.patrolOver');
	},'move_play_over');

	//获取行进线路中的摄像机 ----改版 f上下
	function getCameras(pos,f){
		var temp=[];
		
		var x,y,z,camera;
		
		for(var i=0;i<cameraList.length;i++){
			
			camera=cameraList[i];
			
			x=camera.x-pos.x;
			y=camera.y-pos.y;
			z=camera.z-pos.z;
			
			if(( x*x+y*y + z*z)<=f){
				temp.push(cameraList.splice(i,1)[0]['device']);//摄像机id
				i--;
			}
		}
		return temp;
	}
	/*---按钮操作---*/
	var edit=$("#editmap");
	//正面操作按钮
	var oprs=edit.prev().on("click","a",function(){
		if(this.textContent=="新增"){//旋转到北面
			p.style.animationName="toleft1";
			model.routeid=model.type=model.name='';
			model.linkdevice=model.route=model.camera=[];
			map.setEditStatus(true,{searchRadius:200});
			carmeraCheck.attr("checked",false);
			model.view['speed']='100';
			model.view['height']='180';
			model.view['radius']='200';
			model.cameraSeach='';
			model.count['selects']=model.count['total']=0;
			searchList=[];
			p.classList.add("point");
		
			//设置树形结果check
			treeSelect();
		}else if(this.textContent=='删除'){//删除线路
			deleteRoute();
		}
	});
	//北面操作按钮
	edit.on("click","a",function(){
		backflag=false;
		p.classList.remove("point");
		p.lastChild.classList.add("h");
		if(this.textContent=="返回"){//线路未保存提示
			model.view.speed=100;
			model.cameraSeach='';
			model.count['selects']=model.count['total']=0;
			searchList=[];
			map.setEditStatus(false);
			map.clearRoute();
			p.style.animationName="toright1";
			model.routeid='';
			backflag=true;
			p.classList.remove("transa");
			p.children[6].style.transform="rotateY(0deg)";
		}else if(this.name=="save"){//保存线路
			
			if(model.name.length>25){
				tip.alert("<p>名称长度不能超过25个</p>");
				return;
			}else if(model.view.height<0||model.view.speed<0||model.view.radius<0){
				tip.alert("<p>高度，速度，搜索范围不能小于0</p>");
				return;
			}else if(model.view.speed>100){
				tip.alert('<p>速度不能大于150</p>');
				return;
			}
			if(model.routeid.length){//更新
				updateRoute(model.routeid,this.dataset.type);
			}else{//新增
				saveRoute(this.dataset.type);
			}
		}else if(this.textContent=='预览'){
			
			model.view.speed=isNaN(model.view.speed)?0:Math.abs(model.view.speed);
			
			var temproute=map.getRoute();
			
			if(temproute.length==0){
				tip.alert('<p>请先标注线路</p>');
				return;
			}
			model.linkdevice=getSelect(edit[0].querySelector("ul"));
			
			cameraList=getSelect(edit[0].querySelector("ul"));//model.linkdevice.slice(0,model.linkdevice.length);
			
			var carmers='';
			for(var i=0,len=model.linkdevice.length;i<len;i++){
				carmers+='<li data-rel='+model.linkdevice[i].device+'>'+model.linkdevice[i].name+'</li>';
			}
			setCarmer([]);
			
			p.children[6].innerHTML=carmers.length?carmers:'暂未关联设备';
			
			p.style.animationName="slidup";
			
			p.children[6].style.transform=p.style.transform="rotateY(-180deg)";
			
			p.children[6].style.right='0px';
			
			p.children[6].style.left='';
			
			p.classList.add("transa");
			
			startPatrol(temproute?temproute:model.route,{"walkSpeed":parseInt(model.view.speed), "defalutY":parseInt(model.view.height)});
		}
	});
	var cutentLi,dbclick=false,timer,clickTime=0;//当前选中的线路
	//单击事件翻转双击巡视
	oprs.on("click","p",function(){
		clickTime++;
		if(clickTime>2)return;
		model.name='';
		model.linkdevice=model.route=model.camera=[];
		cutentLi=this;
		
		var zz=cutentLi.previousElementSibling;
		model.routeid=zz.value;
		model.view['speed']=zz.dataset.speed;
		model.view['height']=zz.dataset.height;
		model.view['radius']=zz.dataset.radius;
		p.children[6].style.left='0px';
		//model.view.speed=100;
		model.view.stoptime=10;
		if(dbclick){
			clearTimeout(timer);
			dbclick=false;
			p.classList.remove("point");
			db.query({
				request:{//查询摄像机
					sqlId:'select_device_query',
					params:{'routid':model.routeid}
				},success:function(camera){
					db.query({//查询点位
						request:{
							sqlId:'select_pos_query',
							params:{'routid':model.routeid}
						},success:function(data){
							if(data.length==0){
								tip.alert("请先标注线路");
								
								setTimeout(function(){clickTime=0;},230);
								clearTimeout(timer);
								return;
							}
							var carmers='';
							
							for(var i=0,len=camera.length;i<len;i++){
								carmers+='<li data-rel='+camera[i].device+'>'+camera[i].name+'</li>';
							}
							p.children[6].innerHTML=carmers.length?carmers:'暂未关联设备';
							p.style.animationName='slidup';
							model.linkdevice=camera; //当前线路已经关联的设备
							model.route=data;//线路的坐标点
							startPatrol(data,{"walkSpeed":parseInt(model.view.speed), "defalutY":parseInt(model.view.height)});
						}
					});
				}
			});
		}else{
			timer=setTimeout(function(){
				clickTime=0;
				dbclick=false
				var name=cutentLi.textContent;
				model.type=cutentLi.previousElementSibling.dataset.type;
				db.query({
					request:{//查询摄像机
						sqlId:'select_device_query',
						params:{'routid':model.routeid}
					},success:function(camera){
						db.query({//查询点位
							request:{
								sqlId:'select_pos_query',
								params:{'routid':model.routeid}
							},success:function(data){
								var carmers='';
								
								for(var i=0,len=camera.length;i<len;i++){
									carmers+='<li data-rel='+camera[i].device+'>'+camera[i].name+'</li>';
								}
								p.children[6].innerHTML=carmers.length?carmers:'暂未关联设备';
								model.linkdevice=camera; //当前线路已经关联的设备
								model.route=data;//线路的坐标点
								model.name=name;//线路名称
								p.style.animationName="toleft1";//旋转
								map.editRoute(data, {searchRadius:model.view['radius'], searchLinkTypes:1});//
								p.classList.add("point");
								
								//设置树形结果check
								treeSelect();
							}
						});
					}
				});
			},210);
			dbclick=true;
		}
	});
	//保存线路
	function saveRoute(type){
		if(model.name.length==0){
			tip.alert("<p>请输入线路名称</p>");
			return;
		}
		db.updateByParamKey({
			request:[{sqlId:'insert_patrol_sql',params:{'cus':login.cusNumber,'name':model.name,'type':type,'user':login.userId,'radius':model.view.radius,'speed':model.view.speed,'height':model.view.height}}],//线路信息
			success:function(data){
				
				var seq=data.data[0]['seqList'][0];
				
				var temp=map.getRoute();
				//保存线路坐标
				model.route=temp;
				//获取当前线路的点位
				var list=temp.map(function(row,index){
					row.routeid=seq;//
					row.cus=login.cusNumber;
					row.seq=index;
					return row;
				});
				//获取勾选的摄像机
				var dlist=getSelect(edit[0].querySelector("ul")).map(function(row,index){
					row.routeid=seq;
					row.cus=login.cusNumber;
					row.seq=index;
					return row;
				});
				db.updateByParamKey({
					request:[{sqlId:'insert_pos_sql',params:list},{sqlId:'insert_device_sql',params:dlist}],
					success:function(){
						model.patrol=model.patrol.concat({'id':seq,"name":model.name,"speed":model.view.speed,"height":model.view.height,"radius":model.view.radius});
						map.clearRoute();
						map.setEditStatus(false);
						checkAll.attr('checked',false);
						p.style.animationName="toright1";//旋转
						
						p.children[6].style.transform="rotateY(0deg)";
					}
				});
			}
		});
	}
	//更新线路
	function updateRoute(routeid,type){
		
		db.updateByParamKey({
			
			request:[{sqlId:'update_patrol_sql',params:{'routeid':routeid,'name':model.name,'type':type,'user':login.userId,'radius':model.view.radius,'speed':model.view.speed,'height':model.view.height}},{sqlId:'delete_device_batch',params:{'routeid':routeid}},{sqlId:'delete_pos_batch',params:{'routeid':routeid}}],//线路信息
			success:function(data){
				//获取当前线路的点位
				var list=map.getRoute().map(function(row,index){
					row.routeid=routeid;
					row.cus=login.cusNumber;
					row.seq=index;
					return row;
				});
				//获取勾选的摄像机
				var dlist=getSelect(edit[0].querySelector("ul")).map(function(row,index){
					row.routeid=routeid;
					row.cus=login.cusNumber;
					row.seq=index;
					return row;
				});
				db.updateByParamKey({
					request:[{sqlId:'insert_pos_sql',params:list},{sqlId:'insert_device_sql',params:dlist}],
					success:function(){
						map.setEditStatus(false);
						cutentLi.textContent=model.name;
						var zz=cutentLi.previousElementSibling;
						zz.dataset.speed=model.view.speed;
						zz.dataset.height=model.view.height;
						zz.dataset.radius=model.view.radius;
						p.style.animationName="toright1";
						model.name='';
						p.children[6].style.transform="rotateY(0deg)";
					}
				});
			}
		});
	}
	//删除线路
	function deleteRoute(){
		
		var list=getSelect(oprs[0].querySelector("ul"),'routeid');
		
		if(!list.length){
			tip.alert("请选择要操作的线路");
			return;
		}
		tip.confirm("确认删除该线路?",function(){
			db.updateByParamKey({
				request:[{sqlId:'delete_device_batch',params:list},{sqlId:'delete_pos_batch',params:list},{sqlId:'delete_patrol_batch',params:list}],
				success:function(data){
					oprs[0].querySelector("ul").querySelectorAll("input:checked").forEach(function(item){
						for(var i=0,len=model.patrol.length;i<len;i++){
							if(model.patrol[i].id==item.value){
								model.patrol.splice(i,1);
								break;
							}
						}
					});
					checkAll.attr('checked',false);
				}
			});
		});
	}
	//获取选中的check
	function getSelect(container,key){
		var list=container.querySelectorAll("input:checked"),temp=[];
		if(key){
			for(var i=0,len=list.length;i<len;i++){
				temp[i]={};
				temp[i][key]=list[i].value;
			}
		}else{
			var dataset;
			for(var i=0,len=list.length;i<len;i++){
				dataset=list[i].dataset;
				//id为设备
				temp.push({'device':list[i].value,'type':dataset.type,'x':dataset.x,'y':dataset.y,'z':dataset.z,'name':list[i].nextElementSibling.textContent,'rdl_link_type':dataset.rdl_link_type?dataset.rdl_link_type:'0'});
			}
		}
		return temp;
	}
	//设置设备为勾选状态
	var cCon=edit[0];
	function setchecked(){
		var list=edit[0].querySelector("ul").querySelectorAll("input");
		
		var cameras=model.linkdevice.slice();
		
		var count=0;
		
		if(cameras.length){
			for(var i=0,len=list.length;i<len;i++){
					for(var j=0,jl=cameras.length;j<jl;j++){
						if(list[i].value==cameras[j].device){
							list[i].checked=true;
							cameras.splice(j,1);
							count++;
							break;
						}
					}
				}
		}
		if(count&&(count==list.length)){
			edit[0].querySelector("#checkboxd").checked='checked';
		}else{
			edit[0].querySelector("#checkboxd").checked='';
		}
		model.count.selects=count;
	}
	//旋转终止
	p.addEventListener("animationend",function(e){
		accept=false;
		if(e.animationName=='toleft1'){
			edit.show();oprs.hide();
			p.style.animationName="toleft2";
			p.children[0].style.transform="rotateY(-180deg)";
			p.children[2].style.display="none";
			positive='right';
		}else if(e.animationName=='toright1'){
			edit.hide();oprs.show();
			p.style.animationName="toright2";
			p.children[0].style.transform="rotateY(0deg)";
			p.children[2].style.display="";
			positive='left';
		}else if(e.animationName=='slidup'){
			p.children[6].style.display='';
			p.classList.add("mapopr");
			accept=true;//接收事件
			clickTime=0;
			p.style.left=(top.innerWidth-p.clientWidth)/2+"px";
		}else if(e.animationName=='toright2'){
			p.children[0].style.transform=p.style.transform='rotateY(0deg)';
			!backflag&&tip.alert("保存成功");
			backflag=false;
		}
	});
	//巡视结束
	function patrolOver(){
		
		p.classList.add("point");
		
		var left=p.offsetLeft+p.clientWidth/2;
		
		p.style.animationName='sliddown';
		
		p.classList.remove("mapopr","transa");
		
		p.children[6].style.display='none';
		
		p.style.left=left-p.children[0].clientWidth/2+"px";
		
		(p.style.transform=='rotateY(0deg)'||p.style.transform=='')&&(map.setEditStatus(false),map.clearRoute(),p.children[2].style.display='');//关闭最大化最小化
		
		map.editRoute(map.getRoute(), {searchRadius:model.view['radius'], searchLinkTypes:1});//
	}
	//搜索
	$("#search").keyup(function (){
			var list=oprs.find("li");
			var key=this.value;
			if(key&&key.length){
				for(var i=0,len=list.length;i<len;i++){
					if(list[i].textContent.indexOf(key)>0){
						list[i].style.display="";
					}else{
						list[i].style.display="none";
					}
				}
			}else{
				for(var i=0,len=list.length;i<len;i++){
					list[i].style.display="";
				}
			}
	});
	//checkbox  线路
	var checkAll=$("#checkall").click(function(){
		var list=oprs.find("ul")[0].querySelectorAll("input");
		if(this.checked){
			for(var i =0,len=list.length;i<len;i++){
				list[i].checked='checked';
			}
		}else{
			for(var i =0,len=list.length;i<len;i++){
				list[i].checked='';
			}
		}
	});
	//checkbox 摄像机
	var carmeraCheck=$("#checkboxd").click(function(){
		var list=edit.find("ul")[0].querySelectorAll("input");
		var tlist;
		if(this.checked){
			for(var i =0,len=list.length;i<len;i++){
				tlist=list[i];
				tlist.checked='checked';
				//如果linkdevice中没有则加入
				var exist= false;
				model.linkdevice.forEach(function(row){
					if(row.device==tlist.value){
						exist=true;
					}
				});
				!exist&&model.linkdevice.push({
						type:tlist.dataset.type,
						name:tlist.nextElementSibling.innerText,
						device:tlist.value,
						"rdl_link_type":tlist.dataset.rdl_link_type,
						x:tlist.dataset.x,
						y:tlist.dataset.y,
						z:tlist.dataset.z
					});
			}
			model.count.selects=list.length;
		}else{
			for(var j =0,len=list.length;j<len;j++){
				list[j].checked='';
				for(var i=0;i<model.linkdevice.length;i++){
					if((model.linkdevice[i].device+'').trim()==(list[i].value+'').trim()){
						model.linkdevice.splice(i,1);
						i--;
					}
				}
			}
			model.count.selects=0;
		}
	});
	//
	$("#modelcontainer").on("click","li input",function(){
		var p=this.parentNode.parentNode;
		if(this.checked){
			(p.childElementCount)==(p.querySelectorAll("input:checked").length)&&(p.previousElementSibling.children[0].checked="checked");
			model.count.selects++;
			
			//如果linkdevice中没有则加入
			var exist= false;
			model.linkdevice.forEach(function(row){
				if(row.device==this.value){
					exist=true;
				}
			});
			!exist&&model.linkdevice.push({
					type:this.dataset.type,
					name:this.nextElementSibling.innerText,
					device:this.value,
					"rdl_link_type":this.dataset.rdl_link_type,
					x:this.dataset.x,
					y:this.dataset.y,
					z:this.dataset.z
				});
		}else{
			p.previousElementSibling.children[0].checked="";
			model.count.selects--;
			
			for(var i=0;i<model.linkdevice.length;i++){
				if((model.linkdevice[i].device+'').trim()==(this.value+'').trim()){
					model.linkdevice.splice(i,1);
					i--;
				}
			}
			//如果该摄像机为自定义，则取消勾选时要从列表中删除
	        if(this.dataset.rdl_link_type==1){
				var vt=this.value;
				selfTree.checkNode(selfTree.getNodeByParam("id",vt), false, false);
				model.camera.forEach(function(item,index){
					if(vt==item.linkId){
						model.camera.splice(index,1);
					}
				});
	        }
		}

		// 切换路径与点位的连接线颜色
		changeLinkLine(this.id, this.checked);
	});
	//选中自定义摄像机时要添加到
	function treeSelect(){
		if(!selfTree){
			return;
		}
		selfTree.checkAllNodes(false);
		var temp;
		for(var i=0,len=model.camera.length;i<len;i++){
			temp=selfTree.getNodeByParam("id",model.camera[i]['linkId']);
			if(temp){
				selfTree.checkNode(temp,true,false);
			}
		}
	}
	var selfTree;
	//摄像机树形容器
	var t=document.querySelector("#selfSearch");
	//添加自定义弹窗
	p.appendChild(t);
	function  initCameraTree(){
		db.query({
			request:{
				sqlId:'select_vedio_by_permission',
				whereId:login.dataAuth>0?login.cusNumber:'',
			    orderId:'0',
				params:{
					user:login.userId,
					org:login.deptId,
					type:login.dataAuth==2?"3":"2"
				}
			},success:function(data){
				//树形设置
				var setting={
						path:'./libs/ztree/css/zTreeStyle/img/',
						edit: {enable: true,showRenameBtn:false,showRemoveBtn: false},
						data: {simpleData: {enable: true,pIdKey: "pid"}},
						view: {dblClickExpand: false},
						check:{enable:true,chkboxType:{ "Y": "p", "N": "s" }},
						callback:{
							beforeCheck:function(treeId, node){
								for(var i=0,len=model.camera.length;i<len;i++){
									if(model.camera[i].linkId==node.id&&model.camera[i]['rdl_link_type']!=1){
										tip.alert("<span style='transform: rotateY(-180deg);'>该节点不可编辑</span>");
										return false;
									}
								}
							},
							onCheck:function(e,tree,node){
								if(!posSelf){
									tip.alert("请先标注关联点");
								}
								if(node.checked){
									addSelfNode(model.camera,posSelf,[node]);
									model.linkdevice.push({name:node.name,device:node.id,"rdl_link_type":'1',x:posSelf.x,y:posSelf.y,z:posSelf.z});
									model.count.selects++;
									model.$nextTick(function(){
										cCon.querySelector("input[value='"+node.id+"']").checked=true;
									});
								}else{
									for(var i=0,len=model.camera.length;i<len;i++){
										if(model.camera[i].linkId==node.id){
											model.camera.splice(i,1);
											model.count.total--;
											model.count.selects--;
											break;
										}
									}
								}
							}
						}
				}
				var data=keepLeaf(data);
				
				var tree=p.querySelector("#selfTree");
				
				selfTree=$.fn.zTree.init($(tree),setting,data);
				
				model.$watch("treeKey",function(val,old){
					util.searchTree("name",val,tree,data,setting);
				});
				p.classList.add("point");
				
				p.lastChild.classList.remove("h");
				
				treeSelect();
			}
		});
	}
	//添加自定义设备
	var posSelf;
	map.onSelectPoint(function(v){
		console.log(new Date());
		posSelf=v;
		if(!selfTree){
			initCameraTree();
		}
		p.lastChild.classList.remove("h");
	},"ck_select_point");
	map.onAddPoint(function(Vector3){
		if(!selfTree){
			initCameraTree();
		}
		posSelf=Vector3;
		
		p.lastChild.classList.remove("h");
	},"addPoint");
	//
	map.onMovePoint(function(v){
		var list=cCon.querySelectorAll("input[data-rdl_link_type='1']");
		var pos;
		for(var i=0,len=list.length;i<len;i++){
			pos=list[i].dataset;
			if(posSelf.x==pos.x&&posSelf.y==pos.y&&posSelf.z==pos.z){
				pos.x=v.x;
				pos.y=v.y;
				pos.z=v.z;
				for(var j=0,len=model.linkdevice.length;i<len;i++){
					if(model.linkdevice[i].device=list[i].value){
						model.linkdevice.x=v.x;
						model.linkdevice.y=v.y;
						model.linkdevice.z=v.z;
					}
				}
			}
		}
	},"ck_move_point");
	//删除自定义点位
	map.onRemovePoint(function(v){
		var list=model.camera;
		var pos,temp;
		for(var i=0;i<list.length;i++){
			pos=list[i].searchPos;
			if(pos.x==v.x&&pos.y==v.y&&pos.z==v.z){
				temp=selfTree?selfTree.getNodeByParam("id",list[i]['linkId']):false;
				if(temp){
					selfTree.checkNode(temp,true,false);
				}
				list.splice(i,1);
				i--;
			}
		}
		
		list=model.linkdevice;
		for(var i=0;i<list.length;i++){
			if(list[i].x==v.x&&list[i].y==v.y&&list[i].z==v.z){
				list.splice(i,1);
				i--;
			}
		}
		p.lastChild.classList.add("h");
	},"ck_remove_point");
	//添加自定义摄像机
	function addSelfNode(list,pos,nodes){
		var x,y,z,x1,y1,z1,p,prep;
		var lens=[];
		
		for(var i=0,len=list.length;i<len;i++){
			p=list[i].searchPos;
			x=p.x-pos.x;
			y=p.y-pos.y;
			z=p.z-pos.z;
			l=Math.sqrt(x*x+y*y+z*z);
			lens.push(l);
		}
		if(lens.length){
			var min=lens[0],index=0;
			
			for(var i=1,len=lens.length;i<len;i++){
				if(min>lens[i]){
					min=lens[i];
					index=i;
				}
			}
		}
		model.count.total=model.count.total+nodes.length;
		
		for(var i=0,len=nodes.length;i<len;i++){
			p=list[index].searchPos;
			if(index>0){//
				prep=list[index-1].searchPos;
				x=pos.x-p.x;
				y=pos.y-p.y;
				z=pos.z-p.z;
				
				x1=prep.x-pos.x;
				y1=prep.y-pos.y;
				z1=prep.z-pos.z;
				
				if((x*x1+y*y1+z*z1)<0){
					if(lens.lastIndexOf(lens[index])!=index){
						index=lens.lastIndexOf(lens[index]);
					}
					index++;
				}
			}else {
				prep=list[index+1].searchPos;
				
				x=pos.x-prep.x;
				y=pos.y-prep.y;
				z=pos.z-prep.z;
				
				x1=p.x-pos.x;
				y1=p.y-pos.y;
				z1=p.z-pos.z;
				
				if((x*x1+y*y1+z*z1)>0){
					if(lens.lastIndexOf(lens[index])!=index){
						index=lens.lastIndexOf(lens[index]);
					}
					index++;
				}
			}
			
			list.splice(index,0,{"searchPos":pos,"name":nodes[i].name,"linkId":nodes[i].id?nodes[i].id:nodes[i].device,"type":1,"modelType":nodes[i].icontype?nodes[i].icontype:nodes[i].type,"rdl_link_type":'1'});
		}
	}
	function sortSelfNode(){
		
		var temp={},pos;
		for(var i=0,len=model.linkdevice.length;i<len;i++){
			if(model.linkdevice[i]['rdl_link_type']==1){
				pos=parseInt(model.linkdevice[i]['x'])+parseInt(model.linkdevice[i]['y'])+parseInt(model.linkdevice[i]['z']);
				!temp[pos]&&(temp[pos]=[]);
				temp[pos].push(model.linkdevice[i]);
			}
		}
		for(var i in temp){
			addSelfNode(model.camera,{'x':temp[i][0].x,'y':temp[i][0].y,'z':temp[i][0].z},temp[i]);
		}
		
	}
	//保留子节点
	function keepLeaf(list){
		var leaf=[];
		//获取子元素
		for(var i=0;i<list.length;i++){
			if(list[i]['type']==1){
				leaf.push(list.splice(i,1)[0]);
				i--;
			}
		}
		var pid=[];
		//获取父元素id
		for(var j=0;j<leaf.length;j++){
			if(pid.indexOf(leaf[j]['pid'])<0){
				pid.push(leaf[j]['pid'])
			}
		}
		var treeArray=[];
		//搜索父级元素
		var searchP=function(pid){
			for(var i=0;i<list.length;i++){
				if(list[i]['id']==pid){
					var temp=list.splice(i,1)[0];
					treeArray.push(temp);
					searchP(temp['pid']);
					i--;
				}
			}
		};
		//根据父id搜索
		for(var l=0;l<pid.length;l++){
			searchP(pid[l]);
		}
		return treeArray.concat(leaf);
	}





	/*
	 * 根据线路ID查询三维巡视路线配置的模型点位数据
	 * @param routeId 三维巡视路线编号
	 */
	function queryModelPoint (routeId) {
		// 加载指定视角点位
		hzMap.loadModelPoints({
			sqlId: 'select_model_point_for_map_handle_by_auth',
			whereId: 3,
			params: {
				'cusNumber': login.cusNumber,
				'userId': login.userId,
				'routeId': routeId
			}
		}, function (array) {
			// TODO: 成功处理
		}, function (code, desc) {
			// TODO: 失败处理			
		})
	}


	/*
	 * 改变连接线的颜色
	 * @param id 点位编号
	 * @param checked 是否选中
	 */
	function changeLinkLine (id, checked) {
		map.changeShowLine(id, checked ? 0x00FFFF : 0x000FF)
	}
}); 