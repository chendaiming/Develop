define(["jquery","hz/map/map.handle",'frm/hz.db',"frm/loginUser","vue","frm/message","layer","frm/hz.door"],function($,mapHandle,db,login,vue,tip,layer,door){
	//注册框选事件
	var boxSelect = mapHandle.boxSelect;
	//密码弹框
	var p=document.querySelector("#password");
	//ul容器
	var container=document.querySelector("ul.container");
	//
	var cache=[];
	//数据模型
	var model=new vue({
		el:"#formddd",
		data:{
			list:[],
			password:[],
			pwd:login.doorpwd,
			checked:true,
			search:'',
			selects:[]
		},
		watch:{
			search:function(val){
				if(val==''){
					model.list=cache;
				}else{
					model.list=search(val);
				}
			}
		},
		methods:{
			selectAll:function(e){
				if(e.target.checked){
					[].forEach.call(container.querySelectorAll("li"),function(item){
						item.classList.add("active");
					});
				}else{
					[].forEach.call(container.querySelectorAll("li.active"),function(item){
						item.classList.remove("active");
					});
				}
			},
			reSelect:function(){
				var temp=window.frameElement.parentNode.parentNode;
				temp.classList.add("doorSelect");
				temp.querySelector("div.layui-layer-title").children[0].innerHTML="等待框选。。。";
				model.list=[];
				this.search='';
				if(p.parentNode.id!='formddd'){
					p.parentNode.parentNode.style.display=="none"
				}
			},
			opr:function(opr){
				
				model.selects=fnc['validate']();
				if(!model.selects.length){
					return;
				}
				p.dataset.fnc=opr;
				if(login.avoid){
					fnc[opr]();
				}else{
					if(p.parentNode&&p.parentNode.parentNode.style.display=="none"){
						p.parentNode.parentNode.style.display="block";
						p.firstElementChild.focus();
						for(var i=0,len=p.children.length;i<len;i++){
							p.children[i].value=null;
						}
					}else{
						layer.open({type: 1,title: false ,area:['300px','80px'],id: 'LAY_layuipro',shade:false,
							  moveType: 1 ,//拖拽模式，0或者1
							  success:function(layero,index){
								  p.style.display='block';
								  layero.find("div.layui-layer-content").next().remove().end()[0].appendChild(p);
								  p.firstElementChild.focus();
							  }
						});
					}
				}
				
			}
		}
	});
	function search(val){
		var temp=[];
		for(var i=0,len=cache.length;i<len;i++){
			if(cache[i].name.indexOf(val)>-1){
				temp.push(cache[i]);
			}
		}
		return temp;
	}
	//click
	$(container).on("click","li",function(e){
		e.target.classList.toggle("active");
		if(container.querySelectorAll("li.active").length==model.list.length){
			model.checked=true;
		}else{
			model.checked=false;
		}
	});

	var rectPoints = []; // 框选区域的四个点
	
	//启动框选
	boxSelect.setSelectStatus(true,{dvcTypes:[2]});
	boxSelect.onSelect(function(arr){
		// TODO: 临时处理代码、2017.06.09、xie.yh add --BEGIN
		if (arr && arr.length) {
			var modelObj = boxSelect.selectedObjs[0];
			var pointY = modelObj.position.y - 50;
			rectPoints = boxSelect.getBoxSelect().getRectWorldPos();
			rectPoints[0].y = pointY;
			rectPoints[1].y = pointY;
			rectPoints[2].y = pointY;
			rectPoints[3].y = pointY;
		}
		// TODO: 临时处理代码、2017.06.09、xie.yh add --END

		var temp=window.frameElement.parentNode.parentNode;
		
		temp.querySelector("div.layui-layer-title").children[0].innerHTML="门禁框选";
		temp.classList.remove("doorSelect");
		temp.style.left=(top.window.screen.availWidth-temp.clientWidth)/2 +'px';

		window.frameElement.style.height=temp.clientHeight-42+'px';

		model.checked=true;
		model.list = cache = arr;
		
	}, 'doorSelect');
	//关闭时取消框选
	window.onbeforeunload=function(){
		boxSelect.disabledBoxSelect();
		boxSelect.setSelectStatus(false);
		boxSelect.offSelect('doorSelect');
		model.$destroy();
	};
	//开关门
	var fnc={
			open:function(){

				model.selects.length&&door.openDoor({
					request:{
						cusNumber:login.cusNumber,
						userId:login.id,
						doorId:model.selects
					},
					success:function(result){
						
						model.selects.length==1&&db.query({
							request:{
								sqlId:'select_model_door_name',
								params:{cus:login.cusNumber,device:model.selects[0]},
								whereId:'0'
							},success:function(data){
								if(data.length){
									mapHandle.door.open(data[0]['mpi_rltn_model_name']);//开门
									
									// TODO: 临时处理代码、2017.06.09、xie.yh add
									mapHandle.hzThree.removePlane('CLOSE_AREA_0001');
								}
							}
						});
						tip.alert("发送开门指令成功");
					}
				});
			},
			close:function(){
				
				model.selects.length&&door.closeDoor({
					request:{
						cusNumber:login.cusNumber,
						userId:login.id,
						doorId:model.selects
					},
					success:function(result){
						model.selects.length==1&&db.query({//查询模型
							request:{
								sqlId:'select_model_door_name',
								params:{cus:login.cusNumber,device:model.selects[0]},
								whereId:'0'
							},success:function(data){
								if(data.length){
									mapHandle.door.close(data[0]['mpi_rltn_model_name']);//关门

									// TODO: 临时处理代码、2017.06.09、xie.yh add
									mapHandle.hzThree.removePlane('CLOSE_AREA_0001');
									mapHandle.hzThree.drawPlane('CLOSE_AREA_0001', rectPoints, {
										'color': 0xFF0000,
										'transparent': true,
										'opacity': .35,
										'depthTest': true,
										'alphaTest': .35
									});
								}
							}
						});
						tip.alert("发送关门指令成功");
					}
				});
			},
			validate:function(){
				
				var list=container.querySelectorAll("li.active");
				
				if(list.length==0){
					tip.alert("请选择要操作的门");
					return [];
				}
				return [].map.call(list,function(item){
					return item.dataset.rel;
				});
			}
	};
	//密码输入框事件
	(function(){
		var p=document.getElementById("password");
		
		for(var i=0,list=p.children,len=list.length;i<len;i++){
			list[i].oninput=function(e){
				if(this.value=='')return;
				if(this.nextElementSibling){
					this.nextElementSibling.focus();
				}else{
					if(model.password.join('')!=model['pwd']){
						tip.alert("密码不正确");
						for(var i=0,len=p.children.length;i<len;i++){
							p.children[i].value=null;
						}
						p.firstElementChild.focus();
						return;
					}
					p.parentNode.parentNode.style.display="none";
					//调用方法
					fnc[p.dataset.fnc]&&fnc[p.dataset.fnc]();
				}
			}
			
			list[i].onkeydown=function(e){ 
				e.keyCode==8&&this.previousElementSibling&&this.previousElementSibling.focus();
			}
			list[i].onfocus=function(){
				this.value='';
			}
		}
		//点击其他地方隐藏密码框
		window.onclick=function(e){
			if(p.parentNode.id=="formddd"||e.target.id=="password"||e.target.tagName=='SPAN'||e.target.tagName=='A'||e.target.tagName=='I'||e.target.tagName=='INPUT')return;
				p.parentNode.parentNode.style.display="none";
		}
	})();
});