/**
 * Created by chendm on 2017/4/1 16:33
 */
define(['vue','frm/hz.db','frm/treeUtil','hz/map/map.handle','frm/message','frm/loginUser','ztree','frm/select'],
    function(vue,db,treeUtil,mapHandle,message,user,select){
    var mngTree;
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
        el:'#modelComponentMng',
        data:{
            searchTree:'',
            checked:[],
            treeData:[]
        },
        watch:{
            'searchTree':function(){
                treeUtil.searchTree('name',this.searchTree,'mngTree',vm.treeData,treeSetting);
            }
        },
        methods:{
            refresh:function(){
                queryModelComponents();
            },
            delComponents:function(){
                var deletes = mngTree.getCheckedNodes(true);
                if(deletes.length==0){
                    return;
                }
                message.confirm('确定要删除选择的组件吗？',function(){
                    db.updateByParamKey({
                        request:{
                            sqlId:'delete_model_component',
                            params:deletes
                        },
                        success:function(res){
                            message.alert('删除成功');
                            for(var i=0;i<vm.checked.length;i++){
                                mapHandle.removeComponentById(vm.checked[i]);
                            }
                            vm.checked = [];
                            for(var i = 0;i < deletes.length;i++){
                                mngTree.removeNode(deletes[i]);
                            }
                            queryModelComponents();
                        }
                    });
                });
            }
        }
    });

    function queryModelComponents(){
        db.query({
            request:{
                sqlId:'select_model_component_manager',
                whereId:0,
                params:{cusNumber:user.cusNumber}
            },
            success:function(data){
                data.push({
                    id:'all_map',
                    name:'全图加载',
                    pid:0,
                    nocheck:true,
                    isParent:true
                });
                data.push({
                    id:'v_',
                    name:'视角加载',
                    pid:0,
                    nocheck:true,
                    isParent:true
                });
                vm.treeData = data;
                mngTree = $.fn.zTree.init($('#mngTree'),treeSetting,data);
            }
        });
    }

    queryModelComponents();
});