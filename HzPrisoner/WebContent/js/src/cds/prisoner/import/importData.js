define(function(require){
	var $ = require("jquery");
	
	$("#redFile").click(function(){
		  $(".file").click();
	});
	$(".file").on('change',function(){
		var fileName = $(".file").val();
		fileName = fileName.substring(12,fileName.length);
		$("#redFile").val(fileName)
	})
	$(".btn").click(function(){
		 $("#fileUpload").attr('action',top.ctx+'excl/upload');
		$("#submitFile").click();
		//readFile($(".file").val());
		//var ifram = JSON.parse(document.body.innerText);
		//var ifram = document.body.innerText
		//alert(ifram)
//		 var win = document.getElementById('iframe').contentWindow;
//			alert(win.document.body.innerText)
//			alert(1231353);
//		$("#fileUpload").submit()
	});
	
	document.getElementById('iframe').onload=function(){
		console.log(arguments);
		var data = this.contentWindow.document.body.innerText;
		alert(data)
		
	}
	document.getElementById('iframe').onreadystatechange=function(){
		console.log(arguments);
	} 
	
	function readFile(url){
		var file=new FileReader();
		file.onLoadStart= function(){
			console.log(3333333);
		}
		file.onprogress=function(){
			console.log(222);
		}
		file.onload= function(){
			console.log(11111);
		}
		file.readAsText(url);
	}
	
/*	//上传并返回文件数据
	function upload(){
		alert(top.ctx+'excl/upload');
			$.ajax({
			    url: top.ctx+'excl/upload',
			    type: 'POST',
			    cache: false,
			    data: new FormData($('#fileUpload')[0]),
			    processData: false,
			    contentType: false
			}).done(function(res) {}).fail(function(res) {}); 
		}*/
	
})