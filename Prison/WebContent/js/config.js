/*
	requirejs config 配置项
	Rui.Zhou
	baseUrl:默认的第三方插件库路径
	paths:自定义的插件库路径 key val 形式；
				其中 key 即为调用时的虚拟目录
				如下方的 "hz":'../js/src' 在页面调用 requirejs(['hz/home/index']);其实就是加载的 js/src/home/index.js
*/

// 全局常量配置
window.top.PATROL3D_HELP_LINE = true;	// 三维巡视点位的辅助线：false表示不显示，其它值都表示显示


var ip = "192.168.3.125";
var domain = "http://" + ip,
	prjName = "Prison",
	port = "8080",
	ctx = domain + ":" + port + "/" + prjName + "/";

var basePath = ctx;

var mapLoadMode = window.top.mapLoadMode = 'obj';	// 地图加载模式：obj|u3d
var mapBasePath = 'http://' + ip + ':8080/MapResource/';
var pathFindingURL = 'http://' + ip + ':8080/MapResource/mesh-data/';		// 寻路网格的数据文件地址

var websocketUrl='ws://' + ip + ':8442/websocket';
var videoWebsocketUrl='ws://127.0.0.1:4502/websocket';

/** 数字广播http服务地址(用于试听文件) **/
var http_broadcast = 'http://192.168.3.85/mp3/';


// 访问路径映射配置
var requirejs_paths = {
	"hz":"../js/src",
	"sys":"../js/src/sys",
	"cds":"../js/src/cds",
	"userSetting":"../js/src/syscontrol/userSetting/userSetting",
	"frm":"../js/frm",
	"jquery":"jquery/jquery",
	"bootstrap":"bootstrap/bootstrap",
	"bootstrapMenu":"bootstrap/BootstrapMenu.min",
	"layui":"layui/layui",
	"layer":"layer/layer",
	"hzdate":"hzdate/hzdate",
	"vue":"vue/vue.min",
	"echarts":"echarts/echarts.min",
	"zrender":"echarts/zrender.min",
	"echarts_theme":"echarts/theme",
	"map":"echarts/map",
	"fastclick":"fastclick/fastclick",//用于触屏消除300ms点击延迟
	"table":"bootstrap/bootstraptable/bootstrap-table",
	'datetimepicker':"bootstrap/bootstrap-datetimepicker.min",
	"table-export":"bootstrap/bootstraptable/table-export",
	"ztree":"ztree/js/jquery.ztree.all.min",
	"webuploader":'webuploader/webuploader.min',
	'moment':'moment/moment.min',
	'twix':'moment/twix.min',
	'cxcolor':'cxcolor/jquery.cxcolor'
};

// 访问依赖配置
var requirejs_shim = {
	//下方可配置jquery的一些插件
	//bootstrap都依赖于jquery
	'bootstrap':['jquery'],
	'frm/datepicker':['jquery'],
	'layer':['jquery'],
	'table':['bootstrap','jquery'],
	'table-export':['table'],
	'ztree':['jquery'],
	'cxcolor':['jquery']
};

/*
 * 使用obj加载模式的时候需要引入THREE所需的模块
 */
if (mapLoadMode == 'obj') {
	var _paths = {
		'hzThree': '../js/frm/hz.three',
		'THREE': 'three/three',
		'MTLLoader': 'three/loaders/MTLLoader',
		'OBJLoader': 'three/loaders/OBJLoader',
		'TWEEN': 'three/libs/tween.min',
		'Stats': 'three/libs/stats.min',
		'Detector':'three/Detector',
		'EffectComposer':'three/postprocessing/EffectComposer',
		'MaskPass':'three/postprocessing/MaskPass',
		'OutlinePass':'three/postprocessing/OutlinePass',
		'RenderPass':'three/postprocessing/RenderPass',
		'ShaderPass':'three/postprocessing/ShaderPass',
		'CopyShader':'three/shaders/CopyShader',
		'FXAAShader':'three/shaders/FXAAShader',
	    'underscore': 'underscore-min',
	    'Patrol': 'patrol'
	};

	var _shim = {
		'THREE': {'exports': 'THREE'},
		'MTLLoader': {'exports': 'MTLLoader','deps': ['THREE']},
		'OBJLoader': {'exports': 'OBJLoader', 'deps': ['THREE']},
		'TWEEN': {'exports': 'TWEEN', 'deps': ['THREE']},
		'Stats': {'exports': 'Stats', 'deps': ['THREE']},
		'underscore': {'exports': 'underscore'},
	    'Detector':{'exports': 'Detector'},
	    'EffectComposer':{'exports': 'EffectComposer', 'deps': ['THREE']},
	    'MaskPass':{'exports': 'MaskPass', 'deps': ['THREE']},
	    'OutlinePass':{'exports': 'OutlinePass', 'deps': ['THREE']},
	    'RenderPass':{'exports': 'RenderPass', 'deps': ['THREE']},
	    'ShaderPass':{'exports': 'ShaderPass', 'deps': ['THREE']},
	    'CopyShader':{'exports': 'CopyShader', 'deps': ['THREE']},
	    'FXAAShader':{'exports': 'FXAAShader', 'deps': ['THREE']}
	};

	for(var key in _paths) {
		requirejs_paths[key] = _paths[key];
	}

	for(var key in _shim) {
		requirejs_shim[key] = _shim[key];
	}
} else {
	requirejs_paths['hzThree'] = '../js/frm/u3d/hz.three';
}

requirejs.config({
	baseUrl: ctx + 'libs',
	"paths": requirejs_paths,
	"shim": requirejs_shim
});

require(['../js/frm/permission']);
