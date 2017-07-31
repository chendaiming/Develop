define(function(require){
	var login = require('frm/loginUser');
	var message = require('frm/message');
	var dialog = require('frm/dialog');
	var vue = require('vue');

	var hzMap = require('hz/map/map.handle');
	var hzEvent = require('frm/hz.event');
	var hzDB = require('frm/hz.db');
	

	//搜索容器
	var searchAll = document.getElementById("searchAll");
	//搜索输入框
	var inputSearch = searchAll.children[0];
	//搜索类型
	var searchList = {
			'1':{//查询学员
				icon:'',
				type:'2',
				tip:'信息',
				cache:[],
				request: {
					sqlId:'select_search_by_prisoner',
					whereId:'1',
					orderId:'0',
					params:{cus:login.cusNumber}
				}
			}
	};
	var model = new vue({
		el: '#searchAll',
		data:{
			key:"",
			type:'1',//搜索类型
			searchs:[]
		}, 
		methods:{
			find:function(params){
				if (params && params.id) {
					choseSearchResult(params);
					model.key = '';
				} else {
					message.alert('请选择要查询的项');
				}
			}
		},
		watch:{
			key:function(val){
				if(val.length==0){
					this.searchs=[];
					return;
				}
				var cur = searchList[this.type];
				if (cur.cache.length==0) {
					initData(searchList[this.type]);
					return;
				}
				var tempList=search(cur.cache,val,cur.tip);
				if(tempList.length==0){
					this.searchs=[{name:'暂无相关信息'}];
				}else{
					this.searchs=tempList;
				}
			}
		}
	});


	/*
	 * 选择搜索结果
	 */
	function choseSearchResult (data) {
		if (data) {
			hzEvent.emit('search.people.location', window.top.searchPeopleParams = {
					'id': data.id, 
					'name': data.name.split("-")[0]
			});
		}
		enabledSearch(false);
	}



	function search(list,value,tip){
		var temp=[],key='';
		if(Number.isNaN(Number.parseInt(value))){
			key='name';
		}else{
			key='id';
		}
		for(var i=0,len=list.length;i<len;i++){
			if(list[i][key].toString().includes(value)){
				temp.push({name:list[i].name,tip:tip,id:list[i].id});
			}
		}
		return temp;
	}

	//缓存数据用作搜索
	function initData(search){
		hzDB.query({
			request:search.request,
			success:function(data){
				search.cache=data;
				delete search.request;
			}
		});
	}


	try {
		var searchVisible = false;
		var hasKeyUp = true;

		/*
		 * 启用搜索
		 */
		function enabledSearch (v) {
			hzMap.hzThree.setControlKeysEnable(!v);
			searchAll.style.display = v ? 'block' : 'none';

			if (searchVisible = v) {
				model.searchs = [];
				inputSearch.value = "";
				inputSearch.focus();
			}
		}


		/*
		 * 绑定F2快捷键
		 */
		hzEvent.bind(window.top, 'keydown', function (e) {
			if (e.key == 'F2') {
				e.preventDefault();

				if (hasKeyUp) {
					hasKeyUp = false;
					enabledSearch(!searchVisible);
				}
			}
		});


		/*
		 * 绑定F2快捷键
		 */
		hzEvent.bind(window.top, 'keyup', function (e) {
			if (e.key == 'F2') {
				e.preventDefault();
				hasKeyUp = true;
			}
		});


		/*
		 * 绑定输入框的回车事件
		 */
		inputSearch.onkeydown = function(e){
			if (e.keyCode == 13) {
				if (model.searchs.length) {
					choseSearchResult(model.searchs[0]);
				} else {
					enabledSearch(false);
				}
			}
		}

		hzEvent.load('hz.handledesc', function (handleDesc) {
			handleDesc.add('SEARCH.001', '快捷键F2', '按下F2可以打开人员搜索面板搜索人员信息!');
		});

		initData(searchList['1']);
	} catch (e) {
		console.error(e);
	}
});