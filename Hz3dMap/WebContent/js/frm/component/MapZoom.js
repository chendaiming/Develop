define(function(require) {
    var EventConsts = require('frm/events/EventConsts');
    var MapZoom = function(dom) {
        var _this = this;
        var hzThree = EventConsts.hzThree;
        var controls = hzThree.Controls;
        var zoom_html_txt = '<div id="zoom-div" oncontextmenu="return false">' +
            '<button class="zoom-button zoom-in" id="zoom_in_btn"><div class="zoom-icon"></div></button>' +
            '<div id="zoom_bar"></div>' +
            '<div>' +
            '<div class="widget-zoom-slider-seek-bar">' +
            '<a oncontextmenu="return false" id="zoom_sub" class="widget-zoom-slider-scrubber"></a>' +
            '</div>' +
            '</div>' +
            '<button class="zoom-button zoom-out" id="zoom_out_btn"><div class="zoom-icon zoom-out-icon"></div></button>' +
            '</div>';


        var map = document.createElement("div");
        map.innerHTML = zoom_html_txt;
        dom.appendChild(map);
        var div = document.getElementById('zoom-div');
        var zoom_in_btn = document.getElementById('zoom_in_btn'); //离进
        var zoom_out_btn = document.getElementById('zoom_out_btn'); //离进
        var zoom_bar = document.getElementById('zoom_bar');
        var zoom_sub = document.getElementById('zoom_sub');


        zoom_in_btn.addEventListener('click', zoomIn);
        zoom_in_btn.addEventListener('touchstart', zoomIn);
        zoom_out_btn.addEventListener('click', zoomOut);
        zoom_out_btn.addEventListener('touchstart', zoomOut);

        zoom_bar.addEventListener('click', zoomBarClick, false);
        zoom_bar.addEventListener('touchstart', zoomBarClick, false);


        zoom_sub.addEventListener('mousedown', zoomSubMouseDown);
        zoom_sub.addEventListener('touchstart', zoomSubMouseDown);
        zoom_sub.addEventListener('mouseup', zoomSubMouseUp);
        zoom_sub.addEventListener('touchend', zoomSubMouseUp);

        controls.addEventListener('zoom_change', zoomChange);

        this.step = 0;
        this.stepNum = 1;
        var onTouchMoveData = null;


        updateZoom(mapToBar());
        /**
         * 从地图数据转换成滚动条数据
         */
        function mapToBar() {
            var value = (controls.getZoomRadius() * 145) / (controls.maxDistance);
            return value;
        }

        function barToMap() {
            var value = ((controls.maxDistance) * _this.step) / 145;
            return value;
        }

        function zoomChange() {
            updateZoom(mapToBar());
        }

        function updateZoom(value) {
            _this.step = value;
            if (_this.step < 0) {
                _this.step = 0;
            }
            if (_this.step > 145) {
                _this.step = 145;
            }
            zoom_sub.style.top = _this.step + 'px';
        }

        function zoomIn(e) {

            _this.step -= _this.stepNum;
            if (_this.step < 0) {
                _this.step = 0;
            }
            zoom_sub.style.top = _this.step + 'px';
            var a = barToMap();
            controls.setZoomRadius(a / controls.getZoomRadius());
        }

        function zoomOut(e) {

            _this.step += _this.stepNum;
            if (_this.step > 145) {
                _this.step = 145;
            }
            zoom_sub.style.top = _this.step + 'px';
            var a = barToMap();
            controls.setZoomRadius(a / controls.getZoomRadius());
        }

        function zoomBarClick(e) {
            var offset = 0;
            if (e.touches !== undefined) {
                offset = e.touches[0].pageY - e.touches[0].target.offsetParent.offsetTop - 29;
                zoom_bar.addEventListener('mousemove', zoomSubmouseMove);
                window.addEventListener('mouseup', stopMoveFun);

                zoom_bar.addEventListener('touchmove', zoomSubmouseMove);
                window.addEventListener('touchend', stopMoveFun);
            } else {
                offset = e.offsetY;
            }


            if (offset > 150) {
                offset = 150;
            }
            if (offset < 5) {
                offset = 5;
            }
            _this.step = offset - 5;
            zoom_sub.style.top = _this.step + 'px';

            var a = barToMap();
            controls.setZoomRadius(a / controls.getZoomRadius());

        }

        function stopMoveFun(e) {

            zoom_bar.removeEventListener('mousemove', zoomSubmouseMove);
            window.removeEventListener('mouseup', stopMoveFun);


            zoom_bar.removeEventListener('touchmove', zoomSubmouseMove);
            window.removeEventListener('touchend', stopMoveFun);
        }

        function zoomSubMouseDown(e) {
            zoom_bar.addEventListener('mousemove', zoomSubmouseMove);
            window.addEventListener('mouseup', stopMoveFun);

            zoom_bar.addEventListener('touchmove', zoomSubmouseMove);
            window.addEventListener('touchend', stopMoveFun);
        }

        function zoomSubMouseUp(e) {
            stopMoveFun();
        }

        function zoomSubmouseMove(e) {

            var offset = 0;
            if (e.touches !== undefined) {
                offset = e.touches[0].pageY - e.touches[0].target.offsetParent.offsetTop - 29;
                onTouchMoveData = offset;
                return;
            } else {
                offset = e.offsetY;
            }

            if (offset > 150) {
                offset = 150;
            }
            if (offset < 5) {
                offset = 5;
            }
            _this.step = offset - 5;
            zoom_sub.style.top = _this.step + 'px';


            var a = barToMap();
            controls.setZoomRadius(a / controls.getZoomRadius());
        }
        this.onTouchMove = function() {
            if (onTouchMoveData !== null) {


                if (onTouchMoveData > 150) {
                    onTouchMoveData = 150;
                }
                if (onTouchMoveData < 5) {
                    onTouchMoveData = 5;
                }
                _this.step = onTouchMoveData - 5;
                zoom_sub.style.top = _this.step + 'px';


                var a = barToMap();
                controls.setZoomRadius(a / controls.getZoomRadius());
                onTouchMoveData = null;
            }
        };
        this.show = function() {

            if (div.style.display !== 'block') {
                div.style.display = 'block';
            }
        };
    };
    return MapZoom;
});