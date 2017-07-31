/**
 * 指南针
 */
define(function(require) {
    var EventConsts = require('frm/events/EventConsts');
    require('THREE');
    var Compass = function(dom) {
        var _this = this;
        var evtDispatcher = EventConsts.evtDispatcher;
        var HzEvent = EventConsts.HzEvent;
        // var Events = EventConsts.Events;
        this.offsetAngle = -20; //偏移角度  //偏移量
        this.pointer = null;
        var div = document.createElement('div');
        this.pointer = document.createElement('div');
        dom.appendChild(div);
        div.appendChild(this.pointer);
        div.id = 'compass';
        this.pointer.id = 'compass-pointer';
        div.oncontextmenu = function() {
            return false;
        };

        this.rotate = function(val) {
            //       console.log(val);
            _this.pointer.style.transform = 'rotate(' + val + 'deg)';
        };
        //地图的
        this.mapToPointer = function(val) {
            var deg = val.data - 90 - _this.offsetAngle;
            _this.rotate(deg);
        };

        evtDispatcher.addEventListener(HzEvent.UPDATE_CAMERA_ROTATE, _this.mapToPointer);

    };
    Object.assign(Compass.prototype, THREE.EventDispatcher.prototype, {

    });
    return Compass;
});