/**
 * Created by chendm on 2017/4/1 16:41
 */
define(['vue','frm/hz.db','frm/hz.event','hz/map/map.handle','frm/message','frm/loginUser','frm/hz.event','frm/select'],
    function(vue,db,event,mapHandle,tip,user,hzevent,select){
    var container=$("#showlist");
    var model=new vue({
        el:'#showlist',
        data:{
            list:[]
        },
        methods:{
            locationFloor:function(item,e){
                mapHandle.locationArea(item.id);
                hzevent.emit('hz.building.floor.separate',{area_id:item.id});
                container.children("li.active").removeClass("active");
                e.target.parentNode.classList.add("active");
            }
        }
    });

    var pris=[],arealist={};
    //获取所有楼的id
    db.query({
        request:{
            sqlId:'select_floor_by_cusnumber',
            params:{
                cus:user.cusNumber
            }
        },
        success:function(data){
            loadGram(data);
        }
    });
    //获取各个楼栋的子区域
    function loadGram(data){
        new Promise(function(resolve,reject){
            let temp=data.pop();
            db.query({
                request:{
                    sqlId:'select_areaid_by_pid',
                    params:{
                        pid:temp['abd_area_id'],
                        cus:user.cusNumber
                    }
                },success:function(d){
                    arealist[d[0]['name']]=d[0]['child'];
                    data.length>0?resolve(data):reject(data);
                }
            });
        }).then(loadGram,calculate);
    }
    //统计
    function calculate(){
        db.query({
            request:{
                sqlId:'select_pris_by_areaid',
                params:{cus:user.cusNumber}
            },success:function(data){
                var list={};
                for(var key in arealist){
                    if(key.indexOf("_")!=0)
                        list[key]=0;
                }
                for(var i=0,len=data.length;i<len;i++){
                    for(var key in arealist){
                        if(arealist[key].indexOf(data[i].pid)>-1){
                            list[key]++;
                        }
                    }
                }
                var array=[];
                for(var key in list){
                    var temp=key.split("_");
                    array.push({'text':temp[0],'num':list[key],id:temp[1]});
                }
                hzevent.call('hz.building.label.show',array);
                model.list=array;
            }
        });
    }
    $("#removeid").parent().prev().children("img").click(function(e){
        hzevent.call('hz.building.label.hide');
    });
});