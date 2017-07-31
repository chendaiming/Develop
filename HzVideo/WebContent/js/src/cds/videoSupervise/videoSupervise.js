define(function(require){
	var $ = require("jquery");
	var tpl = require('vue');
	var utils = require('frm/hz.utils');
	var db = require('frm/hz.db');
	var login =  require('frm/loginUser');
	var util  = require('frm/treeUtil');
	var modelUtil = require('frm/model');	
	var treeSelect = require('frm/treeSelect');
	var tip = require('frm/message');
	var videoClient = require('frm/hz.videoclient');
	var datepicker = require('frm/datepicker');
	
	var treeContainer;
	model=new tpl({
		el:'body',
		data:{
			activeTab:1,//当前选择的选项卡
			searchPic:'',
			searchDay:(function(){return new Date().toLocaleString().substr(0,10).replace('/','-').replace('/','-').trim()})(),
		},
		methods:{
			setActiveTab:function(n){
				this.activeTab = n;
			},
		},
		watch:{
			activeTab:function(val){
			},
			searchDay:function(date){
				
			}
		}
	});
});