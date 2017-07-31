define(function(require){
	var user = require('frm/loginUser');
	var db = require('frm/hz.db');
	var ztree = require('ztree');
	var vue = require('vue');
	var treeUtil = require('frm/treeUtil');
	var message = require('frm/message');
	var hzmap = require('hz/map/map.handle');
	var hzEvent = require('frm/hz.event');

	var pointTree;
	var treeSetting = {
		data:{
			simpleData:{
				enable:true,
				pIdKey:'pid'
			}
		},
		path:'../../../',
		check:{enable:true},
		callback:{
			onDblClick:function(event,treeId,treeNode){
				if(!treeNode || treeNode.nocheck){
					return;
				}
				var viewPoint = {
					posX:treeNode.v_pos_x,
					posY:treeNode.v_pos_y,
					posZ:treeNode.v_pos_z,
					rotX:treeNode.v_rot_x,
					rotY:treeNode.v_rot_y,
					rotZ:treeNode.v_rot_z,
					tarX:treeNode.v_tar_x,
					tarY:treeNode.v_tar_y,
					tarZ:treeNode.v_tar_z
				};
				hzmap.location(treeNode.getParentNode().id.replace('v_',''), !viewPoint.posX ? '' : viewPoint);
			},
			onCheck:function(event,treeId,treeNode){
				if(treeNode.checked){
					vm.checked.push(treeNode.id);					
				}else{
					vm.checked.$remove(treeNode.id);
				}
			}
		}
	}
	
	var vm = new vue({
		el:'body',
		data:{
			searchTree:'',
			checked:[],
			treeData:[]
		},
//		watch:{
//			'searchTree':function(){
//				treeUtil.searchTree('name',this.searchTree,'viewMenuZtree',vm.treeData,treeSetting);
//			}
//		},
		methods:{
			delPoints:function(){
				var deletes = pointTree.getCheckedNodes(true);
				if(deletes.length==0){
					return;
				}
				message.confirm('确定要删除所有选择的点位吗？',function(){
					db.updateByParamKey({
						request:{
							sqlId:'delete_view_point',
							params:deletes
						},
						success:function(res){
							message.alert('删除成功');
							for(var i = 0;i < deletes.length;i++){
								pointTree.removeNode(deletes[i]);
								for(var j = 0; j < vm.treeData.length; j++){
									if(vm.treeData[j].id == deletes[i].id){
										vm.treeData.splice(j,1);
									}
								}
							}

						}
					});	
				});
			}
		}
	});
	vm.checked = [];

	function queryPoints(){
		db.query({
			request:{
				sqlId:'select_view_point_ztree',
				whereId:0,
				params:{cusNumber:user.cusNumber}
			},
			success:function(data){
				vm.treeData = data;
				pointTree = $.fn.zTree.init($('#viewMenuZtree'),treeSetting,data);
				$("#input").keyup(function(e){
					if(e.keyCode == 13){
						treeUtil.searchTree('name',this.value,'viewMenuZtree',vm.treeData,treeSetting);
					}
				});
			}
		});
	}

	/*
	 * 注册模型点位加载事件并立即执行
	 */
	hzEvent.onOver('model.point.reload', function () {
		queryPoints();
	}, true);
	queryPoints();
	console.log('点位管理初始化成功!');
});