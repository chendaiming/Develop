define(function(require){

	var piny = require('frm/pinyin');
	
	
	var newData = [];
	return {
		 /**
		  * key：搜索key值
		  * val：搜索key对应的 val
		  * treeId： 树的elid
		  * treeData：树的所有数据（初始化时候的保留数据）
		  * setting（每个页面可能不一样）
		  */
		 searchTree:function(key,val,treeId,treeData,setting){
			 if(typeof treeId=="string"){
				 treeId='#'+treeId;
			 }
			 var me =this;
			 me.setting = setting;
			 
			 me.idKey = "id";
			 if(me.setting.data.simpleData && me.setting.data.simpleData.idKey){
				 me.idKey = me.setting.data.simpleData.idKey;
			 }
			 
			 me.pidKey = "pid";
			 if(me.setting.data.simpleData && me.setting.data.simpleData.pIdKey){
				 me.pidKey = me.setting.data.simpleData.pIdKey;
			 }

			 newData = [];
			 me.treeData = treeData;
			 
			 if(val.length==0){
				 return $.fn.zTree.init($(treeId),setting,me.treeData);
			 }

			 var searchDatas=[], newNodes = [];
			 var len = treeData?treeData.length:0;
			 var node, nodeVal;
			 for(var i=0;i<len;i++){
				 node = me.treeData[i];
				 nodeVal = node[key];
				 if (nodeVal && me.getNodeDataById(node[me.idKey])==-1) {
					 if(nodeVal.indexOf(val) != -1 || piny.convertPinyin(nodeVal).indexOf(val) != -1 || piny.convertFirstPinyin(nodeVal).indexOf(val) != -1){
	 					searchDatas.push(node);
					 }
				 }
			 }
//			 if(searchDatas.length==0){
//				 return;
//			 }

			 for(var i=0,j=searchDatas.length;i<j;i++){
				 me.isTreeRoot(searchDatas[i], newNodes);
			 }
			 return $.fn.zTree.init($(treeId), setting, newData);
		 },
		 pushNode:function(node,newNodes){
			 var me=this;
			 if($.inArray(node[me.idKey],newNodes)==-1){
				 node.open=true;
				 newNodes.push(node[me.idKey]);
				 newData.push(node);
			 }
		 },
		 isTreeRoot:function(nodeData,newNodes){
			 var me =this;
			 me.pushNode(nodeData,newNodes);
			 if(me.getNodeDataByPid(nodeData[me.pidKey])!=-1){
				 me.isTreeRoot(me.getNodeDataByPid(nodeData[me.pidKey]),newNodes);
			 }
		 },
		 getNodeDataByPid:function(pid){
			 var me =this;
			 for(var i=0,j=me.treeData.length;i<j;i++){
				 if(pid == me.treeData[i][me.idKey]){
					 return me.treeData[i];
				 }
			 }
			 return -1;
		 },
		 getNodeDataById:function(id){
			 var me =this;

			 for(var i=0,j=me.treeData.length;i<j;i++){
				 if(id == me.treeData[i][me.pidKey]){
					 return me.treeData[i];
				 }
			 }
			 return -1;
		 }
	}
})