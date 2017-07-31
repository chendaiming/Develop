define(["jquery","frm/dialog",'hz/map/map.handle',"frm/message","frm/loginUser","frm/hz.door","frm/loginUser","frm/hz.db","vue","frm/hz.videoclient"],function($,dialog,map,tip,login,doorCmd,login,db,tpl,video){
	
	var tempList=[{
		doorID:'',//门禁
		doorName:'',//门禁名称
		cardID:'',//刷卡卡号
		peopleName:'',//刷卡人员姓名
		brushCardTime:'',//刷卡时间
		peopleType:'',//人员类型
		inOutFlag :'',//进出标识
		status:'',//状态
		remark:''
	}];
	var p;
	var tipsCotainer=$("#doorRecord");
	if(!tipsCotainer)return;

	//事件注册
	tipsCotainer.on("click","a",function(){
		this.parentNode.classList.toggle("slidown");
		this.classList.remove("active");
	});
	/*//动画结束事件
	tipsCotainer[0].addEventListener("animationend",function(e){
		tipsCotainer.children("a").css("tranform","rotateX(-180deg)");
	});*/
	//代理事件开门关门
	tipsCotainer.on("click","li a",function(){
		var dataset=this.parentNode.dataset;
		var type='';
		if(!dataset.doorid){
			return;
		}
		map.locationDvc(2,dataset.doorid);//this.parentNode.dataset.doorid,定位
		if(this.textContent=='定位'){
			//打开门禁所关联的摄像机
			fnc.openLinkCamera(dataset.doorid);
		}else if(this.textContent=='开门'){
			login.doorAvoid=='0'?openPwd("open",this):fnc['open'](dataset.doorid);
		}else{
			login.doorAvoid=='0'?openPwd("close",this):fnc['close'](dataset.doorid);
		}
		//opr.record({'cus':login.cusNumber,'plc':dataset.plc,'doorId':dataset.doorid,'user':login.userId,'type':type});
	});
	//方法集合
	var fnc={
			open:function(id){
				var device=id?id:p.dataset.device;
				//发送远程开关门指令
				doorCmd.openDoor({
					request:{
						cusNumber:login.cusNumber,
						userId:login.id,
						doorId:[device]
					},
					success:function(result){
						if(!result.success){
							tip.alert("指令发送失败");
							return;
						}
						var modelName=p.dataset.modelName;
						if(modelName){
							map.door.open(modelName);
							return;
						}
						db.query({
							request:{
								sqlId:'select_model_door_name',
								params:{cus:login.cusNumber,device:device},
								whereId:'0'
							},success:function(data){
								if(data.length){
									p.dataset.modelName=data[0]['mpi_rltn_model_name'];
									p.dataset.modelName.length&&map.door.open(p.dataset.modelName);//开门
								}
							}
						});
					}
				});
			},
			lock:function(){
				//map.door.close(data.original.mpi_rltn_model_name);
			},
			close:function(id){
				var device=id?id:p.dataset.device;
				doorCmd.closeDoor({
					request:{
						cusNumber:login.cusNumber,
						userId:login.id,
						doorId:[device]
					},
					success:function(result){
						if(!result.success){
							tip.alert("指令发送失败");
							return;
						}
						var modelName=p.dataset.modelName;
						if(modelName){	
							map.door.close(modelName);
							return;
						}
						//查询模型
						db.query({
							request:{
								sqlId:'select_model_door_name',
								params:{cus:login.cusNumber,device:device},
								whereId:'0'
							},success:function(data){
								if(data.length){
									p.dataset.modelName=data[0]['mpi_rltn_model_name'];
									p.dataset.modelName.length&&map.door.close(p.dataset.modelName);//关门
								}
							}
						});
					}
				});
			},
			openLinkCamera:function(id){
				db.query({
					request:{
						sqlId:'query_link_device_by_device',
						whereId:'0',
						params:{'cusNumber':login.cusNumber,'mainType':'2','dtlsType':'1','id':id}
					},
					success:function(data){
						if(data.length==0){
							return;
						}
						var list=[];
						data.forEach(function(row){
							list.push(row['dld_dvc_id']);
						});
						if(list.length > 0){
							video.setLayout(list.length);
							video.play(list);
						}
					}
				});
			}
	}
	//打开密码框
	function openPwd(fnc,$this){
		p.dataset.pwd=login.doorpwd;
		p.dataset.fnc=fnc;
		p.dataset.device=$this.parentNode.dataset.doorid;
		if(p.parentNode&&p.parentNode.parentNode.style.display=="none"){
			p.parentNode.parentNode.style.display="block";
			p.firstElementChild.focus();
			for(var i=0,len=p.children.length;i<len;i++){
				p.children[i].value=null;
			}
			return;
		}
		layer.open({type: 1,title: false ,area:['300px','80px'],id: 'LAY_layuipro',shade:false,
			  moveType: 1 ,//拖拽模式，0或者1
			  success:function(layero,index){ 	
				  p.style.display='block';
				  layero.find("div.layui-layer-content").next().remove().end()[0].appendChild(p);
				  p.firstElementChild.focus();
			  }
		});
	}
	//
	//密码输入框事件
	(function(){
		!p&&(p=document.getElementById("passwordd"));

		for(var i=0,list=p.children,len=list.length;i<len;i++){
			list[i].oninput=function(e){
				if(this.value=='')return;
				if(this.nextElementSibling){
					this.nextElementSibling.focus();
				}else{
					if(pwds()!=p.dataset.pwd){
						tip.alert("密码不正确");
						for(var i=0,len=p.children.length;i<len;i++){
							p.children[i].value=null;
						}
						p.firstElementChild.focus();
						return;
					}
					p.parentNode.parentNode.style.display="none";
					p.dataset.fnc&&fnc[p.dataset.fnc]();
				}
			}
			list[i].onkeydown=function(e){ 
				e.keyCode==8&&this.previousElementSibling&&this.previousElementSibling.focus();
			}
			list[i].onfocus=function(){
				this.value='';
			}
		}
		function pwds(){
			var child=p.children,pwd='';
			for(var i=0,len=child.length;i<len;i++){
				pwd=pwd+""+child[i].value;
			}
			return pwd;
		}
		
		p.onclick=function(e){
			if(e.layerY<20&&e.layerX>280){
				p.parentNode.parentNode.style.display="none";
			}
		}
	})();
	//门禁列表
	var model=new tpl({
		el:"#doorlist",
		data:{
			doorList:[]
		}
	});
	var doorList=document.getElementById("doorlist");
	//后台消息到达时触发
	function doorFnc(data){
		//如果已经超出了50个，则重新渲染
		if(model.doorList.length>10){
			model.doorList=[];
		}
		model.doorList.push(data.msg);
		doorList.parentNode.classList.add("slidown");
		model.$nextTick(function(){
			doorList.scrollTop=doorList.scrollHeight;
			var child=doorList.children;
		});
	}

	function doorOpr(data){
//		console.log(data);
	}

	//监听事件
	(function init(wm) {
		if (wm = window.top.webmessage){
			wm.on('DOOR001','door',doorFnc);
			wm.on('DOOR006','doorlisten',doorOpr);
		} else {
			setTimeout(init, 100);
		}
	})();
});   