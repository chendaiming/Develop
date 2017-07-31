define(function(require){
	var $ = require("jquery");
	var tpl = require("vue");
	var db = require('frm/hz.db'); 
	var tip = require('frm/message');
	var ls = require("frm/localStorage");
	var hzEvent = require('frm/hz.event');
	var data =ls.getItem("data");
	var model = new tpl({
		el:'#form',
		data:{
			prisoner:{
				'id':'',//数据库中存放的罪犯编号
				'prisonerid':'',//监狱内部罪犯编号
				'name':'',//罪犯姓名
				'pid':'',//所属监区(编号)
				'pname':'',//监区名称
				'pbd_crtfcts_type':'',//证件类别(常量)
				'pbd_crtfcts_id':'',//证件号码
				'pbd_sex_indc':'',//性别(常量)
				'pbd_birth_date':'',//出生日期
				'pbd_cltre_level':'',//文化程度
				'pbd_mrrge_stts':'',//婚姻状况
				'pbd_arrst_cmpny':'',//捕前单位
				'pbd_nation':'',//民族
				'pbd_native_addrs':'',//籍贯
				'pbd_home_addrs':'',//家庭住址
				'pbd_detain_type':'',//收押类别
				'pbd_charge_type':'',//分押类别
				'pbd_sprt_mnge':'',//分管等级
				'pbd_accstn':'',//罪名
				'pbd_sntn_type':'',//刑种
				'pbd_sntn_term':'',//判处刑期
				'pbd_sntn_start_date':'',//判处起日
				'pbd_sntn_end_date':'',//判处止日
				'pbd_entry_prisoner_date':'',//入监日期
				'pbd_serious_prsnr':'',//重点案犯
				'pbd_type_indc':'',//犯人类型(常量)
				'pbd_sntn_dprvtn_term':'',//判处剥权年限
				'pbd_stts_indc':'',//罪犯在监状态(常量)
				'pbd_prsnr_stts':'',//罪犯状态
				'pbd_grp_name':'',
				'pbd_grp_leader_indc':'',
				'img_url':'', //人脸库照片
				'img_url_scene':'',//现场照片
				'pbd_remark':'',
			}
		}
	})
	model.prisoner = data;
	hzEvent.on('personData',function(data){
		model.prisoner = data.data;
	});
	/*model.$watch('prisoner.prisonerid',function(){
		alert("数据发生变化")
		})

var mod = new tpl({
	   	el:top.document.getElementById("inputData"),
		data:{
			inputd:ls.getItem("data")
		},
		watch:{
			inputd:function(val, oldVal){
				alert('ddd')
				model.prisoner = data[0];
		}
			
		}
	})*/
	
});