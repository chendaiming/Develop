/**
 * Created by chendm on 2017/3/30 16:20
 */
define(['vue','frm/hz.db','frm/loginUser','frm/message','frm/hz.event','frm/dialog','hz/map/map.handle'],
    function(vue,db,user,message,hzEvent,dialog,mapHandle){
    var track = mapHandle.hzThree.Track;
    var fr =window.frameElement.parentNode.parentNode;
    var vm =new vue({
        el:'#trackMoveEdit',
        data:{
            pointName:'',
            checkAll:false,
            checkeds:[],
            routes:[]
        },
        watch:{
            'checkAll':function(){
                if(this.checkAll){
                    this.checkeds = [];
                    for(var i=0,j=this.routes.length;i<j;i++){
                        this.checkeds.push(this.routes[i]);
                    }
                }else{
                    this.checkeds = [];
                }
            }
        },
        methods:{
            delTrackMove:function(){
                delTrackMoves();
            },
            trackClick:function(item){
                sessionStorage.setItem("trackMove",JSON.stringify(item));
                dialog.top.open({
                        id:'cdm-track-move',
                        type:2,
                        title:'修改移动轨迹',
                        w:700,
                        h:400,
                        top:100,
                        url:'page/map/trackMove/trackMove.html',
                        closeCallback:function(){
                            track.stopTrack();
                            hzEvent.off('trackMove.edit');
                        }
                });
                hzEvent.call('trackMove.edit',item);
            }
        }
    });

    function delTrackMoves(){
        if(vm.checkeds.length==0){
            return;
        }
        message.confirm('确定要删除选中轨迹吗？',function(){
            var ids=[];
            for(var i=0;i<vm.checkeds.length;i++){
                ids.push({id:vm.checkeds[i].omg_id});
            }
            db.updateByParamKey({
                request: [{
                    sqlId:'delete_trackmove',
                    params:ids
                }],
                success:function(res){
                    if(res){
                        db.updateByParamKey({
                            request: [{
                                sqlId:'delete_trackmove_point',
                                params:ids
                            }],
                            success:function(res){
                                queryTrackMoves();
                            }
                        });

                    }
                }
            });
        })
    }
    function queryTrackMoves(){
        db.query({
            request:{
                sqlId:'select_trackmove_list',
                whereId:0,
                params:{cusNumber:user.cusNumber}
            },
            success:function(res){
                vm.routes =res;
            }
        });
    }
    queryTrackMoves();
    hzEvent.on('trackMove.isGo',function(){
        var p=window.frameElement.parentNode.nextElementSibling.children;
        if(!$(p[1]).hasClass("layui-layer-maxmin")){
            p[0].click();
        }
    });
    hzEvent.on('trackMove.isStop',function(){
        var p=window.frameElement.parentNode.nextElementSibling.children;
        p[1].click();
    });
    hzEvent.on('trackMove.reload',function(){
        queryTrackMoves();
    });
});