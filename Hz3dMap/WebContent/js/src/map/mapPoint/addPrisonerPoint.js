/**
 * Created by chendm on 2017/3/30 16:52
 */
define(['vue','frm/hz.db','hz/map/map.handle','frm/message','frm/loginUser','hz/map/mapPoint/map.prisoner','frm/hz.event','frm/select'],
    function(vue,db,mapHandle,tip,user,MapPrisoner,hzEvent,select){
        var model = new vue({
            el:'#prisonerPoint',
            data:{
                isMore:false,
                panelPoint:{
                    ppi_cus_number:user.cusNumber,
                    ppi_view_id:'',
                    ppi_panel_width:80,
                    ppi_panel_height:40,
                    ppi_link_type:98,
                    ppi_link_id:'',
                    ppi_pos_x:'',
                    ppi_pos_y:'',
                    ppi_pos_z:'',
                    ppi_rot_x:'',
                    ppi_rot_y:'',
                    ppi_rot_z:'',
                    ppi_point_flag:0,
                    ppi_distance_min:'',
                    ppi_distance_max:'',
                    ppi_line_height:'',
                    ppi_view_pos_x:'',
                    ppi_view_pos_y:'',
                    ppi_view_pos_z:'',
                    ppi_view_rot_x:'',
                    ppi_view_rot_y:'',
                    ppi_view_rot_z:'',
                    ppi_view_tar_x:'',
                    ppi_view_tar_y:'',
                    ppi_view_tar_z:'',
                    ppi_create_uid:user.userId,
                    ppi_update_uid:user.userId
                }
            },
            watch:{
              'panelPoint.ppi_link_id':function(){
                  ipt_add();
              }
            },
            methods:{
                showMore:function(){
                    this.isMore = !this.isMore;
                    if(this.isMore){
                        $("#prisonerPoint").height(260);
                    }else{
                        $("#prisonerPoint").height(160);
                    }
                },
                save:function(){
                    savePanelPoint();
                },
                reset:function(){
                    clearForm();
                }
            }
        });
        /**
         * 查询罪犯信息
         */
        var prisonerList = [];
        db.query({
            request: {
                sqlId: 'select_panelPoint_prisoner_info',
                whereId: 0,
                params: [user.cusNumber]
            },
            async: false,
            success: function (data) {
                prisonerList = data;
            }
        });

        var infoPanel = null;
        var position = {x:0, y:0, z:0};
        var mapPrisoner = new MapPrisoner();

        mapPrisoner.enabledEdit(function (data) {
            position = data;
            ipt_add();
        });
        /**
         * 添加面板
         */
        window.ipt_add = function () {
            var curViewMenu = mapHandle.curViewMenu;
            if (curViewMenu) {
                model.panelPoint.ppi_view_id = curViewMenu.id;
            }else{
                tip.alert("请选择视角菜单");
                return;
            }
            if(!validate()){
                return;
            }
            if (infoPanel) {
                mapPrisoner.removeByObj(infoPanel);
                infoPanel = null;
            }
            var prisonerId = "";
            var prisonerName = "";
            var imgUrl = "";
            var bedCode = '';
            var bedName = '';
            var addData = null;

            prisonerList.forEach(function (data) {
            	if (model.panelPoint.ppi_link_id == data.id) {
//            		prisonerId = data.prisonerid;
//                    prisonerName = data.name;
//                    imgUrl = data.img_url;
//                    bedCode = data.bed_code;
//                    bedName = data.bed_name;
                    console.log('selected.prisoner -->' + JSON.stringify(data));

                    addData = {
                        'id': data.id,
                        'code': data.prisonerid + "",
                        'name': data.name,
                        'image': basePath + 'css/image/zfpic.png',
                        'position': position,
                        'width': model.panelPoint.ppi_panel_width,
                        'height': model.panelPoint.ppi_panel_height,
                        'bedCode': data.bed_code,
                        'bedName': data.bed_name
                    };
            	}
            });

            if (infoPanel == null) {
//            	{
//                    'id': model.panelPoint.ppi_link_id,
//                    'code': prisonerId + "",
//                    'name': prisonerName,
//                    'image': basePath + 'css/image/zfpic.png',
//                    'position': position,
//                    'width': model.panelPoint.ppi_panel_width,
//                    'height': model.panelPoint.ppi_panel_height,
//                    'bedCode': bedCode,
//                    'bedName': bedName
//                }
                mapPrisoner.add(addData, function (panelObj) {
                    infoPanel = panelObj;
                    infoPanel.on('click', function (event) {
                        var target = event.target || {};
                        var data = target.data;
                        hzEvent.emit('map.infopanel.click', data, target);
                    });
                    model.panelPoint.ppi_pos_x = infoPanel.position.x;
                    model.panelPoint.ppi_pos_y = infoPanel.position.y;
                    model.panelPoint.ppi_pos_z = infoPanel.position.z;
                });
            }
        }
        /**
         * 保存面板点位
         */
        function savePanelPoint(){
            if(!validate()){
                return;
            }else if(!infoPanel){
                tip.alert("请在地图上标注罪犯点位");
                return;
            }
            var request=[{
                sqlId:'insert_map_panel_point_info',
                params: model.panelPoint
            }];
            tip.saving();
            db.updateByParamKey({
                request:request,
                success:function(data){
                    tip.close();
                    tip.alert("保存成功");
                    clearForm();
                    infoPanel = null;
                }
            })
        }
        /**
         * 清空表单
         */
        function clearForm(){
            model.panelPoint.ppi_panel_width = 80;
            model.panelPoint.ppi_panel_height = 40;
            model.panelPoint.ppi_link_id = "";
            model.panelPoint.ppi_pos_x = "";
            model.panelPoint.ppi_pos_y = "";
            model.panelPoint.ppi_pos_z = "";
            infoPanel && mapPrisoner.removeByObj(infoPanel);
            infoPanel = null;
        }
        /**
         * 表单校验
         */
        function validate(){
            var flag = true;
            if(!model.panelPoint.ppi_link_id){
                tip.alert("请选择罪犯");
                flag = false;
            }else if(!model.panelPoint.ppi_panel_width){
                tip.alert("请填写面板宽度");
                flag = false;
            }else if(isNaN(model.panelPoint.ppi_panel_width)){
                tip.alert("宽度必须为数字");
                flag = false;
            }else if(model.panelPoint.ppi_panel_width < 0){
                tip.alert("宽度不能为负数");
                flag = false;
            }else if(!model.panelPoint.ppi_panel_height){
                tip.alert("请填写面板高度");
                flag = false;
            }else if(isNaN(model.panelPoint.ppi_panel_height)){
                tip.alert("宽度必须为数字");
                flag = false;
            }else if(model.panelPoint.ppi_panel_height < 0){
                tip.alert("宽度不能为负数");
                flag = false;
            }
            return flag;
        }

        try {
			window.onbeforeunload = function () {
				mapPrisoner.disabledEdit();
                infoPanel && mapPrisoner.removeByObj(infoPanel);
                infoPanel = null;
			}
		} catch (e) {
			// TODO: handle exception
		}
    });