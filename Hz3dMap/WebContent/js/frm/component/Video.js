/**
 * {
 *     videoUrl:xxxxx//视频地址
 *     loop: false,    //是否循环
 *     autoPlay: false, //是否自动播放
 * }
 */

define(function(require) {
    require('THREE');
    require('frm/core/expand');
    var EventConsts = require('frm/events/EventConsts');
    var Events = EventConsts.Events;
    var Video = function(screenW, screenH) {
        THREE.Object3D.call(this);
        var scope = this;
        this.videoUrl = undefined; //视频地址 ogg,mp4格式
        this.screenPlane = undefined;
        this.screenWidth = screenW || 1000;
        this.screenHeight = screenH || 1000;
        this.video = undefined;
        this.autoplay = false;
        this.loop = false;
        this.data = undefined;

        this.video = document.createElement('video');

        var playOver = function() {
            var evt = new Events(Video.event.PLAY_OVER);
            scope.dispatchEvent(evt);
        };
        var clickFun = function(e) {
            var evt = new Events(Video.event.CLICK);
            scope.dispatchEvent(evt);
        };

        function initEvents() {
            scope.video.addEventListener('ended', playOver);
            scope.screenPlane.on('modelclick', clickFun);
        }
        this.removeVideoEvents = function() {
            this.video.removeEventListener('ended', playOver);

        };



        var texture = new THREE.VideoTexture(this.video);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.format = THREE.RGBFormat;

        var geometry = new THREE.PlaneGeometry(this.screenWidth, this.screenHeight, 2);
        var material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide

        });
        this.screenPlane = new THREE.Mesh(geometry, material);
        this.add(this.screenPlane);

        initEvents();

    };
    Video.event = {
        PLAY_OVER: 'play_over',
        CLICK: 'click'
    };
    Video.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
        constructor: Video,

        play: function() {
            this.video.play();
        },
        stop: function() {
            this.video.currentTime = 0;
            this.video.pause();

        },
        pause: function() {
            this.video.pause();
        },
        resume: function() {
            this.video.play();
        },
        /**
         * 音量
         * @param  {[type]} val [description]
         * @return {[type]}     [description]
         */
        volume: function(val) {
            this.video.volume = val;
        },
        /**
         * {
         *     videoUrl:
         *     loop:
         *     autoPlay:
         * }
         */
        setData: function(value) {
            this.data = value;
            this.autoplay = value.autoplay || false;
            this.loop = value.autoplay || false;
            this.videoUrl = value.videoUrl;
            if (this.videoUrl === undefined) {
                console.warn('没有传入视频地址');
                return;
            }
            this.video.src = this.videoUrl;
            this.video.setAttribute('crossorigin', 'anonymous');
            this.video.autoplay = this.autoplay;
            this.video.loop = this.loop;
        },
        dispose: function() {
            this.video.pause();
            this.removeVideoEvents();
            this.video = undefined;
            this.screenPlane.removeAllEvents();
            this.remove(this.screenPlane);
            this.screenPlane.dispose();
            this.screenPlane = undefined;
        }


    });
    return Video;
});