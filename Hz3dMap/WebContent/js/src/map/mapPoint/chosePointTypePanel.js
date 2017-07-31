/**
 * Created by chendm on 2017/4/1 14:13
 */
define(['vue','frm/localStorage', 'hz/map/map.handle'],function(vue,ls, mapHandle){
    ls.remove('isAddPointState');
    var vm = new vue({
        el:'#chose-panel',
        data:{
            active:{name:'',id:0},
            items:[
                {name:'添加摄像机点位',id:1},
                {name:'添加门禁点位',id:2},
                {name:'添加对讲机点位',id:3},
                {name:'添加网络报警点位',id:6},
                {name:'添加RFID基站点位', id:15},
                {name:'添加巡更刷卡点位', id:16},
                {name:'添加犯人点位', id:98},
                {name:'添加消防点位', id: 97},
                {name:'添加电话机点位', id: 95}
            ]
        },
        methods:{
            setActive:function (item) {
                this.active = item;
                mapHandle.setHandleStatus(mapHandle.EDITMODEL);
                window.top.hasChosePointType = true;
                window.top.addPointViewModel.point.mpi_link_type = item.id;
            }
        }
    });

    try {
		window.onbeforeunload = function () {
			mapHandle.setHandleNormal();
			mapHandle.removeModelPointById('20161209');
			mapHandle.setTransForm(false);

			var mapPointData = window.top._mapPointData;
			if (mapPointData && mapPointData.curDoorModelObj){
				mapPointData.curDoorModelObj.instacne.setBorderShow(false);
				mapPointData.curDoorModelObj = null;
			}
			window.top.hasChosePointType = false;
			$('#addPointPanel').hide();
		}
	} catch (e) {
		console.error(e);
	}
});