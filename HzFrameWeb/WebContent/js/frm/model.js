define(function(){
	var model={
			modelData:function (model,item){
				for(var i in model){
					(item[i]!=null||item[i]!=undefined)&&(model[i]=(typeof item[i] =="string")?item[i].trim():item[i]);
				}
			},
			clear:function (model,keys){
		 		var keys=keys?keys:{};
		 		for(var i in model){
		 			keys[i]==undefined?(model[i]=''):(keys[i]!=''&&(model[i]=keys[i]));
		 		}
		 	}
	}
	return model;
});