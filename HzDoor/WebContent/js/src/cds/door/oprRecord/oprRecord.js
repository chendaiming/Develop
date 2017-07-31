define(["frm/hz.db"],function(db){
	//{'cus':'机构号','plc':'刷卡人','user':'操作人','type':'操作类型'}
	 function  record(params,callback){
		if(!params.cus||!params.user||!params.type){
			alert('参数不完整');
			return;
		}
		db.updateByParamKey({
			request:{
				sqlId:'insert_into_door_log',
				params:params
			},success:function(){
				callback&&callback();
			}
		});
	}
	 return {"record":record};
});