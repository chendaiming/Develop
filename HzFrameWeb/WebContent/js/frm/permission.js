define(['jquery',"layer","frm/localStorage"],function($, tip, local){
	//在ajax请求完成后执行,权限控制
	var permissions = window.btns, msg;

	//初始页面的权限控制
//	$("a.hbtn").each(function(){ 
//		var _this=$(this);
//		if(permissions.indexOf(this.textContent)<0){
//			_this.remove();
//		}
//	});

	function toLogin () {
		top.location.href = ctx + "login.html";
	}


	/*
	 * 消息提示
	 */
	function msgTip () {
		layer.confirm(msg, {title:'错误', btn:['确定','取消']},function(index){
			toLogin();
		});
	}

	//子页面的权限控制
	$.ajaxSetup({
		dataFilter: function (data) {
			//如果返回的不是html页面则直接返回
			if(!(/^</i).test(data.trim())){
				if (data.startsWith('{"fail"')) {
					data = JSON.parse(data);
					msg = data.fail == -1 ? '登录信息错误!' : (data.fail || '未知错误信息!');
					msgTip();
					return false;
				}

				//如果是菜单列表则处理后再返回
				return data;
			} else {
				//如果是html页面，则将没有权限的按钮删除后返回html
				var container = $(data);

				//全局筛选
				container.find("[data-permission]").each(function(){
					if (permissions.indexOf($(this).data("permission").trim()) < 0){
						$(this).remove();
					}
				});
				return container.prop("outerHTML");
			}
		}
	});


	/*
	 * 请求前的校验处理
	 */
	$.ajaxPrefilter(function(options, org, xhr){
		if (msg) {
			xhr.abort();
			msgTip();
		}
	});
});
