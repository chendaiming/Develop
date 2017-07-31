define(function(require){
	var localStorage = require('frm/localStorage');

	/*
	 * 查询绑定用户信息的字段说明（以下列出来的是人员信息查询必须要的字段，其它的可以根据业务自行添加）：
	 * peopleInfo = {
	 * 		"id":"人员编号（系统生成编号）", 
	 * 		"code":"人员编码（页面输入编号）", 
	 * 		"name":"人员姓名", 
	 * 		"photo":"照片地址", 
	 * 		"dptt_id":"所在部门编号", 
	 * 		"dptt_cn":"所在部门名称",
	 * 		...
	 * }
	 */
	if (!top.userInfodd) {
		var userInfo = localStorage.getItem('userInfo');
		var peopleInfo = null;
		var peopleName = null;

		if (userInfo) {
			peopleInfo = userInfo.peopleInfo || {};
			peopleName = userInfo.nickname || peopleInfo.name || userInfo.user_name;

			top.userInfodd = {
				userId: userInfo.id, 			// 用户ID
				userName: userInfo.user_name, 	// 登录用户名
				realName: peopleName,			// 真实姓名
				cusNumber: userInfo.cus_number, // 登录用户所属机构号
				cusNumberName: userInfo.cus_number_name, // 登录用户所属机构名称
				dataAuth: userInfo.data_auth, 	// 登录用户拥有权限 （数据权限: 0本辖区（默认）1全监狱 2全省3超级管理员）
				deptId: userInfo.dept_id, 		// 登录用户所属部门IDdept_id
				deptName: userInfo.dept_name, 	// 登录用户所属部门名称
				sysAdmin: userInfo.admin, 		// 是否为系统管理员
				childDep: userInfo.childDep, 	// 登录用户所属部门的子级部门
				admin: userInfo.ubd_admin, 		// 超级管理员
				doorpwd: userInfo.doorpwd, 		// 门禁开关门密码
				doorAvoid: userInfo.dooravoid, 	// 是否免密
				nickname: peopleName, 			// 昵称（姓名）
				plcLinkId: peopleInfo.id, 		// 关联的民警编号
				roles: userInfo.roles,			// 用户绑定的角色
				peopleType: userInfo.people_type,	// 用户绑定人员类型
				peopleId: userInfo.people_id,		// 用户绑定人员编号
				peopleInfo: peopleInfo				// 用户绑定人员信息
			};
		} else {
			top.location.href = ctx + "login.html";
		}
	}

	return top.userInfodd;

});