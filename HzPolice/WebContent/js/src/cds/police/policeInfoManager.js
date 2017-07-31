//var updatePoliceIMG;
//var model;
define(function(require){
	var $ = require("jquery");
	var tpl = require('vue');
	var db = require('frm/hz.db');
	var login =  require('frm/loginUser');
	var util  = require('frm/treeUtil');
	var modelUtil = require('frm/model');	
	var treeSelect = require('frm/treeSelect');
	var tip = require('frm/message');
	var dialog = require('frm/dialog');
	var select = require('frm/select');
	var bootstrap = require('bootstrap');
	var datepicker = require('frm/datepicker');
	  
	var treeContainer,deptree,controltree;
	var image = $('#imageview img');
	var tId;
        model=new tpl({
			el:'#form',
			data:{
				police:{
					'id':'',
					'tid':'',
					'policeid':'',
					'name':'',
					'pid':'',
					'pbd_drptmnt':'',
					'pbd_pstn_name':'',
					'pbd_sex':'',
					'pbd_age':'',
					'pbd_political_status':'',
					'pbd_official_title':'',
					'pbd_birth_date':'',
					'pbd_fixed_phone':'',
					'pbd_ip_phone':'',
					'pbd_phone':'',
					'pbd_short_phone':'',
					'pbd_fax':'',
					'pbd_talk_num':'',
					'pbd_email':'',
					'pbd_oa_system':'',
					'pbd_police_cmmnct':'',
					'pbd_family_phone':'',
					'pbd_img':'',
					'pbd_img':'',
					'pbd_police_type_indc':'',
					'pbd_degree_indc':'',
					'pbd_profession':'',
					'pbd_job_date':'',
					'pbd_remark':'',
					'pbd_cus_number':login.cusNumber,
					'user_id':login.userId//更新创建人
				},
				policeOldId:''
			}
	});
	//左侧警员信息树形结构
	db.query({
		request:{
			sqlId:'select_police_info_tree',
			whereId:'0',
			orderId:'0',
			params:[login.cusNumber,login.cusNumber]
		},
		success:function(data){
			//树形设置
			var setting={
					path:'../../../libs/ztree/css/zTreeStyle/img/',
					edit: {enable: true,showRenameBtn:false,showRemoveBtn: false},
					view: {dblClickExpand: false},
					data: {simpleData: {enable: true,pIdKey: "pid"}},
					callback:{
						onDblClick:function(e,id,node){
							if(!node.type) return;
							if(node.type==1){
								var dep = deptree.getNodeByParam("id",node.pid.replace('1-',''));
								model.police['policeid']=node.policeid?node.policeid:'';
								model.policeOldId=node.policeid?node.policeid:'';
								model.police['name']=node.name?node.name:'';
								model.police['pid']=dep?dep['id']:'';
								model.police['pbd_drptmnt']=dep?dep['name']:'';
								//根据用户编号异步异步加载用户信息
								model.police['tid'] = node.tId;
								model.police['id']  = node.id?node.id:'';
								getPoliceInfoByid(node.id);
							}
						},
						onClick:function(e,evnt,node){
//							if(!node.type) return;
							if(node.type!=1){//自动选择部门
								var dep = deptree.getNodeByParam("id",node['id']);
								model.police['pid']=dep?dep['id']:'';
								model.police['pbd_drptmnt']=dep?dep['name']:'';
								tId=node.id;
							}
						}
					}
			}
			treeContainer=$.fn.zTree.init($("#tree"), setting,data);
			$("#input").keyup(function(){
				util.searchTree("name",this.value,"tree",data,setting);
			});
		},
		error:function(errorCode, errorMsg){
			tip.alert(errorCode + ":" + errorMsg);
		}
	});
	//警员所属机构树
	db.query({
		request:{
			sqlId:'select_org_dept',
			whereId:'0',
			params:[login.cusNumber]
		},
		async:false,
		success:function(data){
			var setting={
					key:'name',
					data: {simpleData: {enable: true,pIdKey: "pid"}},
					check: {enable: false},
					callback:{
						onClick:function(e,id,node){
							model.police['pid']=node.id;
							model.police['pbd_drptmnt']=node.name;
							tId = node.id;
						}
					}
			}
			deptree=treeSelect.init("dep",setting,data);
			deptree.expandNode(deptree.getNodes()[0],true,false,true);
		},
		error:function(errorCode, errorMsg){
			tip.alert(errorCode + ":" + errorMsg);
		}
	});
	//保存，删除，新增
	$("#form").on("click",".buttons a",function(){
		if(this.textContent=='删除'){
			if(model.police['id'] == ''){
				tip.alert("请双击选择要删除的项");
				return;
			}
			tip.confirm("确认删除该警员信息？",function(){
				db.updateByParamKey({
					request:{
						sqlId:'delete_police_info_byid',
						whereId:'0',
						params:[{id:model.police['id']}]
					},
					success:function(data){
						treeContainer.removeNode(treeContainer.getNodeByTId(model.police['tid']));
						modelUtil.clear(model.police,{'pbd_cus_number':'','user_id':''});
						hideImage();
						tip.alert("删除成功");
					}
				});
			});
			//刷新redis缓存
			_refreshCache('delete');
		}else if(this.textContent=='保存'){
			//去空格
			modelUtil.modelData(model.police,model.police);
			if(validate())return;
			tip.saving();
			db.query({
				request:{
					sqlId:'select_if_repeat_police_id',
					params:{plc:model.police['policeid']}
				},
				success:function(re){
					var total=re[0].total;
					if(total>0){
						if(model.police['id']!=''){
							//更新
							if(model.police['policeid']==model.policeOldId){
								saveItemById();
							}else{
								tip.alert("警员编号已存在");
							}
						}else{
							tip.alert("警员编号已存在");
						}
					}else{
						saveItemById();
					}
					
				}
			});

			
			
			
		}else{//重置
			modelUtil.clear(model.police,{'pbd_cus_number':'','user_id':''});
			hideImage();
		}
	});
	
	function saveItemById(){
		
			if(model.police['id']!=''){//更新
				db.updateByParamKey({
					request:{
						sqlId:'update_police_baseinfo_byid',
						params:[model.police]
					},
					success:function(){
						var temp=treeContainer.getNodeByTId(model.police["tid"]);
	 		 			modelUtil.modelData(temp,model.police);
	 		 			temp.icon="user.png";
 		 				temp.pid = model.police.pid;
 		 				temp.type = 1;
			 			//移动
			 			if(tId&&tId!=model.police['tid']){ 
			 				treeContainer.moveNode(treeContainer.getNodeByParam("id",tId),temp,"inner");
			 			}
			 			treeContainer.updateNode(temp);
			 			modelUtil.clear(model.police,{'pbd_cus_number':'','user_id':''});
			 			hideImage();
			 			tip.alert("更新成功");
			 			tId=null;
					},
					error:function(errorCode, errorMsg){
						tip.alert(errorCode + ":" + errorMsg);
					}
				});
				//刷新redis缓存
				_refreshCache('update');
			}else{//新增
				db.updateByParamKey({
					request:{
						sqlId:'insert_police_baseinfo',
						params:[model.police]
					},
					success:function(data){
						//根据用户所选部门找到父节点
						var  pnode=treeContainer.getNodeByParam("id",model.police.pid);
 		 				var  temp=model.police;
 		 				
 		 				//新节点赋值
 		 				temp.icon="user.png";
 		 				temp.id=data.data[0]['seqList'][0];
 		 				temp.policeid = model.police.policeid;
 		 				temp.name = model.police.name;
 		 				temp.pid = model.police.pid;
 		 				temp.type = 1;
 		 				 
 		 				//新增节点
 		 				treeContainer.addNodes(pnode,-1,temp);
 		 				modelUtil.clear(model.police,{'pbd_cus_number':'','user_id':''});
 		 				tip.alert("新增成功");
 		 				tId=null;
					},
					error: function (errorCode, errorMsg) {
						tip.alert(errorCode + ":" + errorMsg);
					}
				});
				//刷新redis缓存
				_refreshCache('add');
			}
		
	}
	
	
	function _refreshCache(action){
		//刷新redis缓存数据
		db.refreshCache({
			request:{
				serviceName:'policeBaseDtlsCache',
				action:action,
				params:{
					cusNumber:login.cusNumber,
					id:model.police.id,
					policeId:model.police.policeid
				}
			},
			success:function(data){
				console.log('刷新民警缓存数据成功');
			},
			error:function(errorCode, errorMsg){
				console.log('刷新民警缓存数据失败'+errorCode + ":" + errorMsg);
			}
		});
	}
	
	$('.bottom .import').on("click",function(){
		 //重新添加一次文件选择按钮,防止该按钮点击无效
		 uploader.addButton({ id: '#filePicker',label: '点击选择Excel文件'});
		 uploader.option('accept',{
			 title: 'files',
			 extensions: 'excel'
		 });
		 //设定上传类型为excel 
		 upload_type = 'police_excel';
		 dialog.open({targetId:'upload_dialog',title:'导入',h:"400",w:"420",top:"15%"});
	});
		
	$('.bottom .export').on("click",function(){
		tip.alert('导出');
	});
	
	
	function validate(){
		return (!model.police['policeid'] || $.trim(model.police['policeid']).length == 0) && !tip.alert("请填写警员编号")||
			   (!model.police['name'] || $.trim(model.police['name']).length == 0)&&!tip.alert("请填写警员姓名")||
			   (!model.police['pbd_drptmnt'] || $.trim(model.police['pbd_drptmnt']).length == 0)&&!tip.alert("请选择所属部门")||
			   (model.police.pbd_birth_date && model.police.pbd_job_date && (model.police.pbd_job_date<model.police.pbd_birth_date))
			   && !tip.alert("工作日期不可小于出生日期")||
			   (model.police.pbd_age && isNaN(model.police.pbd_age) && ( !tip.alert("年龄仅可输入数字")));
 	}
  /**
   * 更新警员照片路径到数据库
   */	
  updateIMG = function(filePath){
	  model.police['pbd_img'] = filePath;
	  db.updateByParamKey({
			request:{
				sqlId:'update_police_imageurl_byid',
				params:[model.police]
			},
			success:function(){
	 			dialog.close();
	 			$('#imageupload').hide();
	 			$('#imageview img').attr('src',filePath).show();
	 			tip.alert("上传成功");
			},
			error:function(errorCode, errorMsg){
				tip.alert(errorCode + ":" + errorMsg);
			}
		});
  	}
  /**
   * 根据警员编号查询详细信息
   */
  function getPoliceInfoByid(id){
	  db.query({
			request:{
				sqlId:'select_police_info_byid',
				whereId:'0',
				params:[login.cusNumber,id]
			},
			success:function(data){
				var data = data[0];
				model.police['pbd_pstn_name'] = data.pbd_pstn_name;
				model.police['pbd_sex'] = data.pbd_sex;
				model.police['pbd_age'] = data.pbd_age;
				model.police['pbd_political_status'] = data.pbd_political_status;
				model.police['pbd_official_title'] = data.pbd_official_title;
				model.police['pbd_birth_date'] = data.pbd_birth_date;
				model.police['pbd_fixed_phone'] = data.pbd_fixed_phone;
				model.police['pbd_ip_phone'] = data.pbd_ip_phone;
				model.police['pbd_phone'] = data.pbd_phone;
				model.police['pbd_short_phone'] = data.pbd_short_phone;
				model.police['pbd_fax'] = data.pbd_fax;
				model.police['pbd_talk_num'] = data.pbd_talk_num;
				model.police['pbd_email'] = data.pbd_email;
				model.police['pbd_oa_system'] = data.pbd_oa_system;
				model.police['pbd_police_cmmnct'] = data.pbd_police_cmmnct;
				model.police['pbd_family_phone'] = data.pbd_family_phone;
				model.police['pbd_img'] = data.pbd_img;
				model.police['pbd_police_type_indc'] = data.pbd_police_type_indc;
				model.police['pbd_degree_indc'] = data.pbd_degree_indc;
				model.police['pbd_profession'] = data.pbd_profession;
				model.police['pbd_job_date'] = data.pbd_job_date;
				model.police['pbd_remark'] = data.pbd_remark;
				//加载照片信息
				if(data.pbd_img != ''){
					var $img = $('#imageview img');
					var $div = $('#imageview');
					$img.off('mouseenter mouseleave click');
		            $img.on( 'mouseenter', function() {
		                $('.reupload').show();
		            });

		            $img.on( 'mouseleave', function() {
		            	$('.reupload').hide();
		            });   
		            
		            $div.on( 'click',showImageUpload);
		            $img.attr('src',data.pbd_img).show();
		            $('#imageupload').hide();
				}else{
					$('#imageupload').show();
					$('#imageview img').hide();
				}
			},
			error:function(errorCode, errorMsg){
				tip.alert(errorCode + ":" + errorMsg);
			}
		});
  }
  
  /**
   * 显示图片上传对话框
   */
  function showImageUpload(){
	  	 if(model.police.id == ''){
	  		 tip.alert('请先选择一个节点');
	  		 return;
	  	 }
		 //重新添加一次文件选择按钮,防止该按钮点击无效
		 uploader.addButton({ id: '#filePicker',label: '点击选择图片'});
		 uploader.option('accept',{
				 title: 'Images',
				 extensions: 'gif,jpg,jpeg,bmp,png',
				 mimeTypes: 'image/gif,image/jpg,image/jpeg,image/bmp,image/png'
		 });
		 //设定上传类型为police_image 
		 upload_type = 'police_image';
		 dialog.open({targetId:'upload_dialog',title:'上传照片',h:"400",w:"420",top:"15%"});
  }
  function hideImage(){
	  $('#imageview img').attr('src','').hide();
	  $('#imageupload').show();
  }
  $('#imageupload').on("click",showImageUpload);
  /** 警员编号输入框添加oninput事件 */
  $('#input_policeid').on('input',function(){
	  checkValue();
  });
  $('#input_age').on('input',function(){
	  var _value = $('#input_age').val();
	  var reg = /^[0-9]*$/g;
	  if(!reg.test(_value)){
		  tip.alert("年龄仅可输入正整数")
		  $('#input_age').val("");
		  $('#input_age').focus();
	  }else{
		  model.police.pbd_age =  parseInt(_value);
	  }
  });
  
  /**
   * 校验输入是否合法
   */
  function checkValue(){
	  var obj = $('#input_policeid');
	  var reg = /^[0-9a-zA-Z]*$/g;
	  if(!reg.test(obj.val())){
			tip.alert('只能输入字母或者数字,请重新输入');
			obj.val('');
			obj.focus();
			return;
	  }
  }
});


