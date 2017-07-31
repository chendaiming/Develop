define(['frm/pinyin'],function(p){
	
	var searchUtil={
		search:function(value,key,list){
			var temp=[];
			if(/[a-zA-Z]/.test(value)){
				for(var t of list){
					if(p.convertFirstPinyin(t[key]).indexOf(value)>-1){
						temp.push(t);
					}
				}
			}else{
				for(var t of list){
					if(t[key].indexOf(value)>-1){
						temp.push(t);
					}
				}
			}
			return temp;
		}	
	}
	
	return searchUtil;
});