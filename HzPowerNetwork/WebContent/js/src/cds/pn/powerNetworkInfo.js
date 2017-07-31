define(function(require){
	var $ = require("jquery");
	var select = require('frm/select');
	var db = require('frm/hz.db');
	var ztree = require('ztree');
	var echarts = require('echarts');
	var vue = require('vue');
	var message = require('frm/message');
	var treeUtil = require('frm/treeUtil');
	var piny = require('frm/pinyin');
	var loginUser = require('frm/loginUser');
	var pnVoltage,pnFlow,pnDeviceDataTemp;
	var pnVoltageFlag,pnFlowFlag;
	var pnVoltageData = [];
	var pnFlowData = [];
	
	/**
	 * 初始化左侧区域电网设备列表
	 * @returns
	 */
	function initPNDeviceList(){
		var pnDeviceData = []; 
		db.query({
			request: {
				sqlId: 'select_pn_device_tree',
				whereId: 0,
				params: {'cusNumber':loginUser.cusNumber}
			},
			success: function (data) {
				for(var i=0,j=data.length;i<j;i++){
					data[i].power_voltage = '';
					data[i].power_flow = '';
					pnDeviceData.push(data[i]);
				}
			},
			async:false,
			error: function (code, msg) {}
		});
		pnDeviceDataTemp = pnDeviceData;
		return pnDeviceData;
	}
	
	var vm = new vue({
		el:'body',
		data:{
			pnDeviceData:initPNDeviceList(),
			searchTree:'',
			chooseClassIndex:0
		},
		methods:{
			choosePNDevice:function(index){
				this.chooseClassIndex = index;
				//初始化折线图数据
				pnVoltageFlag = false;
				pnFlowFlag = false;
				pnVoltageData = [];
				pnFlowData = [];
			}
		}
	});
	
	
	
	/**
	  * 电网设备列表搜索监听函数
	  */
	 vm.$watch('searchDevice',function(){
		 vm.pnDeviceData = pnDeviceDataTemp;
		 var searchDatas = [];
		 var key = "pnb_name";
		 var val = vm.searchDevice;
		 
		 if(val.length==0){
			 return;
		 }
		 
		 for (var i = 0; i < vm.pnDeviceData.length; i++) {
			 var node = vm.pnDeviceData[i];
			 if(node[key].indexOf(val) != -1 || piny.convertPinyin(node[key]).indexOf(val) != -1 || piny.convertFirstPinyin(node[key]).indexOf(val) != -1){
					searchDatas.push(node);
			 }
		 }
		 vm.pnDeviceData = searchDatas;
	 });
	
	/**
	 * 加载电压折线图
	 */
	function loadVoltageData(cacheList,echartsData){
		if(!pnVoltageFlag){
			pnVoltageData = cacheList;
			pnVoltageFlag = true;
			$("#pn_voltage").html("");
			var option = {
		        title: {
		            text: '电压（kv）',
		            left:20,
		            textStyle: {
		                color: '#fff'          
		            },
		        },
		        tooltip: {
		            trigger: 'axis'
		        },
		        xAxis: {
		            data: pnVoltageData.map(function (item) {
		                return item[0];
		            })
		        },
		        yAxis: {
		            splitLine: {
		                show: false
		            }
		        },
		        textStyle:{
		        	color:'#fff'
		        },
		        toolbox: {
		            left: 'center',
		            feature: {
//		                restore: {},
//		                saveAsImage: {}
		            }
		        },
		        dataZoom: [{
		            startValue: pnVoltageData[pnVoltageData.length > 10 ? pnVoltageData.length - 10 : 0][0],
		            textStyle: {
		                color: '#fff'          
		            },
		            handleColor: 'rgba(0,0,0,0)',
		            borderColor: '#333',       // 提示边框颜色
		        }, {
		            type: 'inside'
		        }],
		        visualMap: {
		            top: 10,
		            right: 10,
		            textStyle: {
		                color: '#fff'          
		            },
		            pieces: [{
		                lte: parseInt(echartsData.minVlotage?echartsData.minVlotage:0),
		                color: '#cc0033'
		            }, {
		                gt: parseInt(echartsData.minVlotage?echartsData.minVlotage:0),
		                lte: parseInt(echartsData.maxVlotage?echartsData.maxVlotage:0),
		                color: '#096'
		            },{
		                gt: parseInt(echartsData.maxVlotage?echartsData.maxVlotage:0),
		                color: '#cc0033'
		            }],
		            outOfRange: {
		                color: '#999'
		            }
		        },
		        series: {
		            name: '电压',
		            type: 'line',
		            right:20,
		            data: pnVoltageData.map(function (item) {
		                return item[1];
		            })
		        }
		    }
			pnVoltage = echarts.init(document.getElementById('pn_voltage'));
			pnVoltage.setOption(option);
		}else{
			if(pnVoltageData.length > 1000){
				pnVoltageData.shift();	
			}
			pnVoltageData.push([echartsData.time, echartsData.voltage]);
		    pnVoltage.setOption({
		        series: [{
		            data: pnVoltageData.map(function (item) {
		                return item[1];
		            })
		        }],
		        xAxis: {
		            data: pnVoltageData.map(function (item) {
		                return item[0];
		            })
		        }
		    });
	    }
	}
	
	/**
	 * 加载电流折线图
	 */
	function loadFlowData(flowCacheList,echartsData){
		if(!pnFlowFlag){
			pnFlowData = flowCacheList;
			pnFlowFlag = true;
			$("#pn_flow").html("");
			var option = {
		        title: {
		            text: '电流（A）',
		            left:20,
		            textStyle: {
		                color: '#fff'          
		            },
		        },
		        tooltip: {
		            trigger: 'axis'
		        },
		        xAxis: {
		            data: pnFlowData.map(function (item) {
		                return item[0];
		            })
		        },
		        yAxis: {
		            splitLine: {
		                show: false
		            }
		        },
		        textStyle:{
		        	color:'#fff'
		        },
		        toolbox: {
		            left: 'center',
		            feature: {
//		                restore: {},
//		                saveAsImage: {}
		            }
		        },
		        dataZoom: [{
		            startValue: pnFlowData[pnFlowData.length > 10 ? pnFlowData.length - 10 : 0][0],
		            textStyle: {
		                color: '#fff'          
		            },
		            handleColor: 'rgba(0,0,0,0)',
		            borderColor: '#333',       // 提示边框颜色
		        }, {
		            type: 'inside'
		        }],
		        visualMap: {
		            top: 10,
		            right: 10,
		            textStyle: {
		                color: '#fff'          
		            },
		            pieces: [{
		                lte: parseInt(echartsData.minFlow?echartsData.minFlow:0),
		                color: '#cc0033'
		            }, {
		                gt: parseInt(echartsData.minFlow?echartsData.minFlow:0),
		                lte: parseInt(echartsData.maxFlow?echartsData.maxFlow:0),
		                color: '#096'
		            },{
		                gt: parseInt(echartsData.maxFlow?echartsData.maxFlow:0),
		                color: '#cc0033'
		            }],
		            outOfRange: {
		                color: '#999'
		            }
		        },
		        series: {
		            name: '电流',
		            type: 'line',
		            right:20,
		            data: pnFlowData.map(function (item) {
		                return item[1];
		            })
		        }
		    }
			pnFlow = echarts.init(document.getElementById('pn_flow'));
			pnFlow.setOption(option);
		}else{
			if(pnFlowData.length > 1000){
				pnFlowData.shift();	
			}
			pnFlowData.push([echartsData.time, echartsData.flow]);
			pnFlow.setOption({
		        series: [{
		            data: pnFlowData.map(function (item) {
		                return item[1];
		            })
		        }],
		        xAxis: {
		            data: pnFlowData.map(function (item) {
		                return item[0];
		            })
		        }
		    });
	    }
	}
	
	//消息回调
    function powerNetworkMsg(msg){
    	var map = JSON.parse(msg['msg']);
    	var echartsData = map.echartsData;
    	var pnid = $(".tablist .active").attr("data-id");
    	var cusNum = $(".tablist .active").attr("data-cusNum");
    	if(echartsData.id == pnid && echartsData.cusNumber == cusNum){
    		//电压缓存数据
        	var voltageCacheList = JSON.parse(map.voltageCacheList);
        	//电流缓存数据
        	var flowCacheList = JSON.parse(map.flowCacheList);
        	//加载电压折线图
    		loadVoltageData(voltageCacheList,echartsData);
    		//加载电流折线图
    		loadFlowData(flowCacheList,echartsData);
    	}
    	
		for(var j = 0; j < vm.pnDeviceData.length; j++){
			//匹配的电网刷新数据
			if(echartsData.id == vm.pnDeviceData[j].pnb_id && echartsData.cusNumber == vm.pnDeviceData[j].pnb_cus_number){
				vm.pnDeviceData[j].power_voltage = echartsData.voltage;
				vm.pnDeviceData[j].power_flow = echartsData.flow;
			}
		}
    	console.log('高压电网消息处理 msg='+msg);
    }
    
	
	//订阅后台推送消息
    window.top.webmessage.off('POWER001','powerNetwork');
    window.top.webmessage.on('POWER001','powerNetwork',powerNetworkMsg);
    
});