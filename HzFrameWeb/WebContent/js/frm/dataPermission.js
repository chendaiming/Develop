define(["frm/ajaxhook","frm/loginUser","frm/hz.db"],function(hook,login,db){
	//需要过滤的sql
	var requireCheck=[{
			"select_model_point_for_map_handle":{//摄像机
				key:"mpi_link_id",
				type:"1",
				cache:[]
			}
			/*"select_model_point_for_map_handle":{//摄像机
				key:"mpi_link_id",
				type:'1'
			},
			"select_model_point_for_map_handle":{//摄像机
				key:"mpi_link_id",
				type:'1'
			}*/
	}];
	
	//
	var requestd={
			params:{user:login.userId,org:login.dataAuth==0?login.deptId:login.cusNumber},
			sqlId:"select_permission_"
	};
	//拦截请求
	hook.hookAjax({
		onload:function(xhr){
			if(xhr.permission&&xhr.permission.length){
				xhr.responseText=checkData(xhr.responseText,xhr.key,xhr.permission);
			}
		},
		send:function(param,xhr,that){
			
			var temp=param[0]?param[0]:'';
			
			for(var i=0;i<requireCheck.length;i++){
				
				var key=Object.keys(requireCheck[i])[0];
				
				if(temp.indexOf(key)>-1){
					
					//requestd.sqlId=requestd.sqlId.substring(0,requestd.sqlId.lastIndexOf("_")+1)+requireCheck[i][key]['type'];
					
					db.query({
						request:requestd,
						success:function(data){
							that.permission=data[0].id.split(",");
							that.key=requireCheck[i][key]['key'];
							requireCheck[i][key]['cache']=that.permission;
						},
						async:false
					})
					break;
				}
			}
		}
	});
	
	function checkData(list,key,permission){
		var response =JSON.parse(list);
		list=response.data;
		var temp=[];
		for(var i=0;i<list.length;i++){
			if(permission.includes(list[i][key]+'')){
				temp.push(list[i]);
			}
		}
		response.data=temp;
		return JSON.stringify(response);
	}
});