define(['vue','frm/hz.db','frm/message','frm/select'],function(vue,db,tip){
	
	let files=document.getElementById('upfile'),headerKey=document.getElementById("headerKey");
	let headd,thead;
	headerKey.onmouseleave=function(){
		this.style.display="none";
	};
	var model=new vue({
		el:'#import',
		data:{
			file:{
				hfile:'',
				rfile:''
			},
			tbody:[],
			header:[],
			checkall:'checked',
			dataType:{
				type:'',
				keywords:[],
				mappingKey:[],
				keys:{}
			}
		},
		methods:{
			choice:function(e){
				if(!model.dataType.type){
					tip.alert('<span style="color:white;">请先选择类型</span>');
					return;
				}
				this.file.rfile='';
				e.target.nextElementSibling.click();
			},
			selectKey:function(item){
				var index=headerKey.dataset.index;
				model.dataType.keys[item]=model.dataType.keywords[index].id;
				model.dataType.mappingKey[index]['key']=item;
				headerKey.style.display='none';
			},
			slideDown:function(e,index){
				if(!model.header.length){
					tip.alert('<p style="color:white;">请先选择文件</p>');
					return;
				}
				var pos=e.target.getBoundingClientRect();
				headerKey.style.left=pos.left;
				headerKey.style.top=pos.top+e.target.clientHeight-4;
				headerKey.style.width=e.target.clientWidth;
				headerKey.style.display='block';
				headerKey.dataset.index=index;
			},
			import:function(){
			    if(!Object.keys(model.dataType.keys).length){
			    	tip.alert('<p style="color:white;">请先设置标题映射</p>');
			    	return;
			    }
			    
			    let oReq = new XMLHttpRequest();
				oReq.open("POST", top.ctx+'upload/insert');
				oReq.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=UTF-8");
				oReq.onload = function(e) { 
				    if(this.status == 200||this.status == 304){ 
				        var json=JSON.parse(this.responseText);
				    } else {
				    	tip.alert('<p style="color:white;">导入失败，请检查映射是否匹配</p>');
				    } 
			    };
			    let arr=model.tbody.slice();
			    let index=0;
			    headd.querySelectorAll("input:not(:checked)").forEach(function(item,index){
			    	arr.splice(item.dataset.index-index,1);
			    	index++;
			    });
				oReq.send('data='+JSON.stringify(compressData(arr))+"&sqlId="+model.dataType.type);
			}
		},
		watch:{
			'file.hfile':function(val,old){
				if(!val)return;
				this.file.rfile=val;
				val!=''&&upload();
			},
			'dataType.type':function(val){
				val&&db.query({
					request:{
						sqlId:'select_constant_bycode',
						params:[val],
						whereId:'0'
					},success:function(data){
						for(let i=0,len=data.length;i<len;i++){
							model.dataType['mappingKey'].push({key:'请选择映射'});
						}
						model.dataType['keywords']=data;
					}
				});
			},
			checkall:function(val,old){
				if(old=='checked')return;
				if(val){
					headd.querySelectorAll("input:not(:checked)").forEach(function(item){
						item.checked=true;
					});
				}else{
					headd.querySelectorAll("input:checked").forEach(function(item){
						item.checked=false;
					});
				}
			}
		}
	});
	//上传文件
	function upload(){
		var file=new FormData();
		file.append("file",files.files[0]);
		let oReq = new XMLHttpRequest();
		oReq.open("POST", top.ctx+'upload/parse');
		oReq.onload = function(e) { 
		    if(this.status == 200||this.status == 304){
		    	let json=JSON.parse(this.responseText);
		        model.header=json.header;
		        model.tbody=json.body;
		        model.$nextTick(function(){setWidth();});
		    }
	    };
	    oReq.send(file);
	    model.file.hfile='';
	}
	//压缩数据
	function compressData(body){
		let keys=model.dataType.keys;
		let list=[],temp=[];
		for(let i=0,len=body.length;i<len;i++){
			temp=body[i];
			list[i]={};
			for(let td of temp){
				for(let o in td){
					keys[o]&&(list[i][keys[o].toLowerCase()]=td[o]);
				}
			}
		}
		return list;
	}
	
	function setWidth(){
		!thead&&(thead=document.getElementById("thead"));
		!headd&&(headd=document.getElementById("headd"));
		if(!thead)return;
		let temp=thead.querySelectorAll("th");
		headd.querySelector("tr:first-child").querySelectorAll("td").forEach(function(item,index){
			temp[index].style.width=item.clientWidth;
		});
	}
	window.onresize=setWidth;
});