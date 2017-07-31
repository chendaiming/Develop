/**
 * 
 */
define(function(require) {
	var db = require('frm/hz.db');
	var loginUser = require('frm/loginUser');
	var hzDrag = require('frm/hz.drag');
	var $panel = $('div.map-func-panel.view-menu-add');

	var zModelTree, zViewTree, 
		moreStatus = false,
		hzThree = window.hzThree;



	hzDrag.on($panel);

});