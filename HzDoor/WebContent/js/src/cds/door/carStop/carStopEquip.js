//define(
//    ['jquery','vue','frm/hz.db',"frm/loginUser","frm/treeUtil","frm/model","frm/treeSelect","frm/message","frm/localData","frm/select"],
//    function($,tpl,db,login,util,modelUtil,treeSelect,tip,localData){
define(function(require){
    var $ = require('jquery');
    var vue = require('vue');
    var db = require('frm/hz.db');
    var table = require('frm/table');
    var dialog = require('frm/dialog');
    var tip = require('frm/message');
    var modelUtil = require('frm/model');
    var util = require('frm/treeUtil');
    var login = require('frm/loginUser');
    var select = require('frm/select');
    var treeSelect = require('frm/treeSelect');
    var localData = require('frm/localData');

    var treeContainer,
        orgContainer,
        tId;
    
    var reg=/^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;
    var regNumber = /^[0-9]+$/;

    var model=new vue({
        el:"#form",
        data:{
            main:{
                cai_id:'',          //系统设备编号
                cai_other_id:'',    //厂商设备编号
                cai_name:'',        //厂商设备名称
                cai_brand:'',       //设备品牌
                cai_type:'',        //设备类型
                cai_ip:'',          //IP地址
                cai_port:'',        //端口
                cai_dept_id:'',     //所属部门
                cai_dept_name:'',     //部门名称
                cai_area_id:'',     //所属区域
                cai_area_name:'',   //区域名称
                cai_addrs:'',        //安装位置
                cai_work_stts:'',        //设备状态：0.正常、1.故障
                cai_use_stts:'',        //设备使用状态：2.已打开、3.已关闭
                cai_seq:'' ,         //序号
                tid:'',
                userid:login.userId?login.userId:'',
                cus:''
            },
            dataTree:[]
        },
        computed:{
        	cai_area_name(){
        		return this.main.cai_area_name;
        	}
        },
        watch:{
        	cai_area_name:function(val,old){
        		console.log("cai_area_name---val==>"+val);
        		console.log("cai_area_name---oldVal==>"+old);
        	}
        }
    });

    //树形设置
    var setting={
        path:'../../../../libs/ztree/css/zTreeStyle/img/',
        edit: {enable: true,showRenameBtn:false,showRemoveBtn: false},
        view: {dblClickExpand: false},
        data: {simpleData: {enable: true,pIdKey: "pid"}},
        callback:{
            onDblClick:function(e,id,node){
                if (node.type != 1) {
                } else {
                    tId='';
                    var p = node.getParentNode();
                    model.main.tid = node.tId;
                    db.query({
                        request:{
                            sqlId:'query_arrester_by_node',
                            params:{cai_id:node.id,cai_cus_number:login.cusNumber}
                        },
                        success:function(data){
                            var list = data[0];
                            model.main.cai_id=list.cai_id;          //系统设备编号
                            model.main.cai_other_id=list.cai_other_id;    //厂商设备编号
                            model.main.cai_name=list.cai_name;        //厂商设备名称
                            model.main.cai_brand=list.cai_brand;       //设备品牌
                            model.main.cai_type=list.cai_type;        //设备类型
                            model.main.cai_ip=list.cai_ip;          //IP地址
                            model.main.cai_port=list.cai_port;        //端口
                            model.main.cai_dept_id=list.cai_dept_id;     //所属部门
                            model.main.cai_area_id=list.cai_area_id;     //所属区域
                            model.main.cai_addrs=list.cai_addrs;        //安装位置
                            model.main.cai_work_stts=list.cai_work_stts;        //设备状态：0.正常、1.故障
                            model.main.cai_use_stts=list.cai_use_stts;        //设备使用状态：2.已打开、3.已关闭
                            model.main.cai_seq=list.cai_seq;
                            var dep = orgContainer.getNodeByParam('id', model.main['cai_dept_id'], null);
                            model.main.cai_dept_name = dep && dep.name;
                            model.main.cai_area_name =p && p.name;
                            model.main.userid = login.userId;
                        },
                        error:function(errorCode, errorMsg){
    						message.alert(errorCode + ":" + errorMsg);
    					}
                    });
                }

            },
            onClick:function(e,evnt,node){
                if(node.type==0){
                    if('children' in node){
                    	if(node.children.length>0){
                    		if(node.children[0].type == 1){
                                tId=node.tId;
                                model.main.cai_area_name=node.name;
                                model.main.cai_area_id=node.gid;
                                model.main.cus=model.main.cus?model.main.cus:node.cus;
                            }
                    	}else{
                    		tId=node.tId;
                            model.main.cai_area_name=node.name;
                            model.main.cai_area_id=node.gid;
                            model.main.cus=model.main.cus?model.main.cus:node.cus;
                    	}
                    }else{
                        tId=node.tId;
                        model.main.cai_area_name=node.name;
                        model.main.cai_area_id=node.gid;
                        model.main.cus=model.main.cus?model.main.cus:node.cus;
                    }
                }
            }
        }
    };

    function initTreeS(){
        //初始化左侧树，系统管理员，一般用户,省局用户
        db.query({
            request:{
                sqlId:'query_car_arrester_tree',
//                params:{org:login.sysAdmin||login.dataAuth==2?login.cusNumber:login.deptId,type:(!login.cusNumber||login.dataAuth==2)?'3':'2'},
                params:{org:login.cusNumber,type:(!login.cusNumber||login.dataAuth==2)?'3':'2'},
                orderId:'0',
                whereId:(!login.cusNumber||login.dataAuth==2)?'':'0'
            },success:function(data){
                model.dataTree = [];
                for(var i= 0,leg=data.length;i<leg;i++){
                    if(model){
                        model.dataTree.push(data[i]);
                    }
                }
                treeContainer=$.fn.zTree.init($("#tree"),setting,model.dataTree);
                var node = treeContainer.getNodeByTId("tree_1");
                treeContainer.expandNode(node, true, false, true); 

            }
        });
        $("#input").keyup(function(){
            util.searchTree("name",this.value,"tree",model.dataTree,setting);
        });

        //初始化部门树，系统管理员，一般用户
        db.query({
            request:{
                sqlId:'query_org_dep_alarm',
                params:{org:login.cusNumber}
            },success:function(data){
                var set={
                    path:setting.path,
                    edit:setting.edit,
                    view:setting.view,
                    data:setting.data,
                    callback:{
                        onClick:function(id,e,node){
                            model.main.cai_dept_name=node.name;
                            model.main.cai_dept_id=node.id;
                        }
                    }
                };
                orgContainer=treeSelect.init("dep", set,data);
                orgContainer.expandNode(orgContainer.getNodes()[0]);
            }
        });
    }
    initTreeS();
    //增删改
    $("div.buttons").on("click","a",function(){
        if(this.textContent=="保存"){
            if(validate())return;
            if(model.main.cai_ip.length>0){
        		if(!reg.test(model.main.cai_ip)){
        			tip.alert('ip地址格式不正确');
        			return false;
        		}
        	}
            if(model.main.cai_seq.length>0){
            	if(!regNumber.test(model.main.cai_seq)){
            		tip.alert("序号必须为正整数");
            		return false;
            	}
            }	
            if(model.main.cai_port.length>0){
            	if(!regNumber.test(model.main.cai_port)){
            		tip.alert("端口必须为正整数");
            		return false;
            	}
            }
            
            
            tip.saving();

            if((model.main.cai_id+'').length){//修改
                db.updateByParamKey({
                    request:{
                        sqlId:'update_arrester',
                        params:[model.main]
                    },success:function(){
                        var nodes = treeContainer.getNodes();
                        tidLoop(nodes[0]);
                        var temp=treeContainer.getNodeByTId(model.main.tid);
                        model.dataTree.changeTrees(model.main);

                        modelUtil.modelData(temp,model.main);
                        //移动
                        if(tId&&tId!=model.main.tid){
                            treeContainer.moveNode(treeContainer.getNodeByTId(tId),temp,"inner");
                        }
                        temp.name = model.main.cai_name;
                        treeContainer.updateNode(temp);

                        modelUtil.clear(model.door,{'cusnumber':'','user_id':''});

                        tip.alert("更新成功");
                        
                        modelUtil.clear(model.main,{userid:''});
                        initTreeS();
                        $("#input").val("");
                    }
                });
            }else{//新增
            	
            	
                db.updateByParamKey({
                    request:{
                        sqlId:'insert_arrester',
                        params:[model.main]
                    },success:function(data){

                        var  pnode=treeContainer.getNodeByTId(tId);

                        var  temp=model.main;

                        temp.icon="alarm.png";
                        temp.name = model.main.cai_name;
                        temp.id=data.data[0]['seqList'][0];

                        temp.type=1;
                        temp.seq = model.main.cai_seq;
                        var newNodes = treeContainer.addNodes(pnode,-1,temp);
                        model.dataTree.addTrees(newNodes[0]);
                        modelUtil.clear(model.main,{'userId':''});

                        tip.alert("新增成功");
                        
                        initTreeS();
                        tId=null;
                        $("#input").val("");
                    }

                });
            }
        }else if(this.textContent=='删除'){
            if(!model.main.cai_id){
                tip.alert("请双击选择要删除的报警器");
                return;
            }
            tip.confirm("确认删除该阻车器？",function(){
                db.updateByParamKey({
                    request:{
                        sqlId:'delete_arrester',
                        params:[{cai_id:model.main.cai_id}]
                    },success:function(){
//                    	var a = treeContainer.getNodesByParam("id", model.main.cai_id, null);
//                    	console.log(a);
//                        treeContainer.removeNode(treeContainer.getNodesByParam("id", model.main.cai_id, null));
//                        model.dataTree.removeTrees(model.main);
                        modelUtil.clear(model.main);
                        initTreeS();
                        tip.alert("删除成功");
                        $("#input").val("");
                    },error:function(){

                    }
                });
            });
        }else{
            modelUtil.clear(model.main,{'userId':''});
        }
    });
    function tidLoop(node){
        if(node.id == model.main.cai_id){
            model.main.tid = node.tId;
        }else if(node.children){
                for(var i= 0,leg=node.children.length;i<leg;i++){
                    tidLoop(node.children[i]);
            }
        }
    }
    /*增*/
    Array.prototype.addTrees = function (val) {
        var fal = true;
        var leg = this.length;
        for(var i=0;i<leg;i++){
            if(this[i].id == val.id){
                fal = false;
            }
        }
        if(fal){
            this.push(val);
        }
    };
    /*改*/
    Array.prototype.changeTrees=function(val){
        var leg = this.length;
        for(var i=0;i<leg;i++){
            if (this[i].id != val.id) {
            } else {
                for (var j in this[i]) {
                    this[i][j] = val[j] ? val[j] : this[i][j];
                }
            }
        }
    };
    /*删除本地缓存的树数据
     * */
    Array.prototype.removeTrees=function(video){
        for(var i= 0,leg=this.length;i<leg;i++){
            var num = this[i].id;
            if(num.split("_").length == 2){
                if(num == num.split("_")[0]+"_"+video.cai_id){
                    this.splice(i, 1);
                    break;
                }
            }else if(num.split("-").length == 2){
                if(num == num.split("-")[0]+"-"+video.cai_id){
                    this.splice(i, 1);
                    break;
                }
            }else if(!isNaN(Number(num))){
                if(num == video.cai_id){
                    this.splice(i, 1);
                    break;
                }
            }
        }
    };
    function validate(){
    	var regT = /^$|^(?:0|[1-9][0-9]?|10000000)$/;
        return  !model.main.cai_area_name.length && !tip.alert('请选择所属区域')||
            	!model.main.cai_dept_id && !tip.alert('请选择所属部门')||
            	!model.main.cai_other_id && !tip.alert('请输入厂商设备编号')||
            	model.main.cai_other_id.length>10 && !tip.alert('厂商设备编号应少于10个字')||
                !model.main.cai_name && !tip.alert('请输入厂商设备名称')||
                model.main.cai_name.length >20 && !tip.alert('厂商设备名称应少于20个字') ||
                !model.main.cai_brand && !tip.alert('请选择设备品牌') ||
                !model.main.cai_type && !tip.alert('请选择设备类型') ||
                model.main.cai_ip.length >15 && !tip.alert('ip地址格式错误') ||
                model.main.cai_port.length >5 && !tip.alert('端口号应少于5个字')||
                model.main.cai_addrs.length > 80 && !tip.alert("安装地址应少于80个字")||
                !model.main.cai_work_stts && !tip.alert('请选择设备状态') ||
                !model.main.cai_use_stts && !tip.alert('请选择设备使用状态') ||
                model.main.cai_seq.length >15 && !tip.alert('序号少于15个字');
    }
});