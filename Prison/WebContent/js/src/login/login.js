define(["jquery","frm/message","frm/localStorage"],function($,tip,local){

	function login (force) {
		var txtUser = encodeURI($('#username').val());
		var txtPwd = $('#password').val();

		if (txtUser && txtPwd) {
			$.post("sys/login",{"password":txtPwd, "userName":txtUser, "force":force}, function (data) {
				if (typeof data != 'object')
					data = JSON.parse(JSON.parse(data));

				if (typeof data == "number") {
					switch(data){
						case -1: tipMsg("用户名或密码不正确，请重试!"); break;
						case -2: tipMsg("账户未启用，请联系管理员!"); break;
						case -3: tipMsg("账户已过期，请联系管理员!"); break;
					}
				} else {
					if (data.ip) {
						tip.confirm("账户已在"+data.ip+"登录是否强制登录?", function(r){
							r && login(true);
						});
					} else {
						local.setItem('userInfo', data);
						window.location.href = "index.html";
					}
				}
			}).error(function () {
				tipMsg('服务器请求失败!');
			});
		} else {
			tipMsg("用户名或密码不能为空!");
		}
	};

	var timerId = null;
	function tipMsg (msg) {
		$('div.login-msg').stop(true).fadeIn().find('>span').html(msg);
		timerId && clearTimeout(timerId);
		timerId = setTimeout(hideMsg, 3000);
	}

	function hideMsg () {
		$('div.login-msg').fadeOut(1000);
	}


	try {
		$("#btnLogin").click(function(){
			login(false);
		});
		window.onkeyup = function(e){
			e.which == 13 && $("#btnLogin").click();
		}
	} catch (e) {
		// TODO: handle exception
	}
});