define(["jquery","bootstrap","table","table-export"],function($){
	var $table;
	var url = '';

	var base={
			init:function(selector,options){
				var queryMethod = "queryByParamKey";
				var paramsStr = JSON.stringify(options.request.params);
				if(paramsStr && paramsStr.indexOf("[") == 0){
					queryMethod = "query";
				}
				url = '/' + prjName + '/dbCtrl/' + queryMethod;
				if (typeof prjNameB !='undefined') {
					url = '/' + prjNameB + '/dbCtrl/' + queryMethod;
				}

				$table = $("#"+selector);

				options = $.extend({
					height: $table.parent().height(),
					url: options.request.url || url,
					sidePagination: "server",
					pagination: options.pagination ? options.pagination : true,
					pageSize: options.pageSize || 10,
					pageList: [10,20,30],
					searchAlign:'left',
					//showRefresh:true,
					search: options.search ? true : false,
					showColumns: options.showColumns ? options.showColumns : true,
					iconSize:'sm',
					showExport:'true',
					method:"post",
					contentType: "application/x-www-form-urlencoded; charset=utf-8",
					dataType: "json",
					queryParams:function(params,arg){

						options.request.minRow = params.offset;
						options.request.maxRow = params.offset + params.limit;
						options.request.params || (options.request.params = {});

						if(!$.isArray(options.search)){
							options.search = [options.search];
						}

						if(params.searchData){
							var temp={};

							for(var i = 0; i < options.search.length;i++){
								temp[options.search[i].key] = params.searchData[options.search[i].key];
								if(options.search[i].key == params.searchKey){
									temp[params.searchKey] = params.search;
									options.request.whereId = options.search[i].whereId;
								}
							}
							options.request.params = $.extend(options.request.params, temp);
						}

						arg&&(params.request=$.extend(options.request,arg));
						
						return {args:JSON.stringify(options.request)};
					},
					responseHandler:function(res){
						return res.success&&{rows:res.data.data,total:res.data.count}
					}
				},options);
				options.data&&(options.url=null);
				return $table.bootstrapTable(options);
			},
			method:function(method,parameter){
				return $table.bootstrapTable(method, parameter);
			}
	};
	return base;
});