define(["vue","frm/hz.db","frm/loginUser","frm/hz.videoclient","frm/dialog","frm/message"],function(tpl,db,login,video,dialog,tip){
	var model ,noticeContainer;
	var planId;
	
	var flag=false;
	var tempList=[];
	function task(data){
		notice=data.msg.notice;
		//users推送的消息字符串 []
		var users=notice.users.split(",");
		//与当前登陆用户关联的民警编号比较
		if(users.indexOf(login.userId+'')<0)return;
		
		if(!model){//初始化时多条记录
			if(flag){
				tempList.push(notice);
			}else{
				init(notice);
				flag=true;//已经初始化
			}
		}else{
			//ul
			noticeContainer.parentNode.parentNode.classList.add("noticeH");
			
			noticeContainer.style.height='';
			
			if(model.notice.length>10){
				model.notice=[notice];
			}
			model.notice.push(notice);
			
			model.$nextTick(function(){
				
				noticeContainer.scrollTop=noticeContainer.scrollHeight;
				
			});
			noticeContainer.classList.add("noticeH");
		}
	}
	function init(msg){
		
		return new Promise(function(reslove,reject){
			
			noticeContainer = document.createElement("section");
			
			noticeContainer.id = "personal_notice";
			
			noticeContainer.classList.add("notice");
			
			top.document.body.appendChild(noticeContainer);
			
			$(noticeContainer).load("page/cds/patrolPlan/notice.html",function(responseText, textStatus, XMLHttpRequest){
				
				noticeContainer.innerHTML = XMLHttpRequest.responseText;
				
				tempList.push(msg);
				
				model=new tpl({
					el:noticeContainer,
					data:{
						notice:tempList,//提醒
						cameras:[],//带查看摄像机
						mark:'',//备注
						planid:'',
						excute:''
					},
					methods:{
						detail:function(t){
							detail(t);
							/*noticeContainer.parentNode.nextElementSibling.style.display="block";
							noticeContainer.parentNode.parentNode.classList.remove("noticeH");*/
						},
						play:function(c,e){
							var target=e.target;
							if(!target.classList.contains("play")){
								video.play([c.id]);
								target.classList.add("play");
								//更新记录
								update(c.id);
								
								tip.alert("获取视频中...");
								
								/*target=target.parentNode;
								
								var len=target.querySelectorAll("span.play");
								
								if(len&&len.length==target.childElementCount){
									tip.alert('执行完成窗口即将关闭');
									setTimeout(function(){
										target.parentNode.parentNode.parentNode.querySelector("a.layui-layer-close").click();
									},2000);
								}*/
							}else{
								tip.alert('该视频已查看');
							}
						},
						sub:function(e){
							if(model.mark.length>200){
								tip.alert("请输入100个以内字符");
								return;
							}
							db.updateByParamKey({
								request:{
									sqlId:'update_record_mark',
									params:{mark:model.mark,planid:model.planid,user:login.userId,excute:model.excute}
								},success:function(){
									tip.alert('提交成功');
									e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector("a.layui-layer-close").click();
								},error:function(){
									e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector("a.layui-layer-close").click();
								}
							});
						}
					}
				});
				noticeContainer.classList.add("noticeH");
				
				noticeContainer=noticeContainer.querySelector("ul");
				
				reslove();
			});
		});
	}
	function  update(camera){
		db.updateByParamKey({
			request:{
				sqlId:'update_plan_record',
				params:{cus:login.cusNumber,planid:model.planid,userid:login.userId,camera:camera}
			}
		});
	}
	//
	function detail(notice){
		db.query({
			request:{
				sqlId:'select_plan_detail',
				params:{cus:login.cusNumber,planid:notice.id,user:login.userId,extime:notice.vpp_excute_time}
			},success:function(data){
				model.mark='';
				model.cameras=data;
				model.planid=notice.id;
				model.excute=notice.vpp_excute_time;
				
				dialog.open({targetId:'detailCameras',title:'视频巡视',h:"55",w:'65'});
				
				if(model.notice.length==1){
					setTimeout(function(){
						for(var i=0;i<model.notice.length;i++){
							if(model.notice[i].id==notice.id){
								model.notice.splice(i,1);
								i--;
							}
						}
					},1000);
					noticeContainer.parentNode.parentNode.classList.remove("noticeH");
				}else{
					for(var i=0;i<model.notice.length;i++){
						if(model.notice[i].id==notice.id){
							model.notice.splice(i,1);
							i--;
						}
					}
				}
			}
		});
	}
	//监听事件
	function bindLisenter(){
		if (window.top.webmessage) {
			window.top.webmessage.on('VEDIO_PLAN_NOTICE', 'prisonal_task', task, true);
		} else {
			setTimeout(bindLisenter,200);
		}
	}
	bindLisenter();
});