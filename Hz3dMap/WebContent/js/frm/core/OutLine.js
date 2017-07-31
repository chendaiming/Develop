/**
 * 使用EffectComposer对象 进行一些特殊效果的实现 
 */
define(function(require) {
    require('THREE');
    require('CopyShader');
    require('EffectComposer');
    require('RenderPass');
    require('OutlinePass');
    require('ShaderPass');
    require('FXAAShader');

    var EventConsts = require('frm/events/EventConsts');
    var OutLine = function() {
        var scope = this;
        this.outlineArray = [];
        this.hzThree = EventConsts.hzThree;
        this.composer = new THREE.EffectComposer(EventConsts.renderer);

        this.renderPass = new THREE.RenderPass(EventConsts.scene, EventConsts.camera);
        this.composer.addPass(this.renderPass);
        this.outlinePass = new THREE.OutlinePass(this.hzThree.resolution, EventConsts.scene, EventConsts.camera);
        this.composer.addPass(this.outlinePass);

        this.effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
        this.effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
        this.effectFXAA.renderToScreen = true;
        this.composer.addPass(this.effectFXAA);

        this.setSize = function(width, height) {
            this.composer.setSize(width, height);
            this.effectFXAA.uniforms['resolution'].value.set(1 / this.hzThree.resolution.x, 1 / this.hzThree.resolution.y);
        };
        this.update = function() {
            this.composer.render();
        };
        /**
         *  为对象添加新的数组 
         */
        this.addOutLine = function(obj) {
            scope.outlineArray.add(obj);
            scope.outlinePass.selectedObjects = scope.outlineArray;
        };
        /**
         * 删除边框对象
         */
        this.removeOutline = function(obj) {
            scope.outlineArray.remove(obj);
            scope.outlinePass.selectedObjects = scope.outlineArray;
        };

        this.visibleEdgeColorVal = 0x00FFFF;
        this._visibleEdgeColor = new THREE.Color(0x00FFFF);

        this.hiddenEdgeColorVal = 0x00FFFF;
        this._hiddenEdgeColor = new THREE.Color(0x00FFFF);

        this._edgeGlow = 0.5;
        this._edgeThickness = 1.0;
        this._edgeStrength = 1.5;
        this._pulsePeriod = 0;

        this.outlinePass.visibleEdgeColor = this._visibleEdgeColor;
        this.outlinePass.hiddenEdgeColor = this._hiddenEdgeColor;
        this.outlinePass.edgeGlow = this._edgeGlow;
        this.outlinePass.edgeThickness = this._edgeThickness;
        this.outlinePass.edgeStrength = this._edgeStrength;
        this.outlinePass.pulsePeriod = this._pulsePeriod;

        this.setVisibleEdgeColor = function(val) {
            this.visibleEdgeColor = val;
        };
    };


    Object.assign(OutLine.prototype, THREE.EventDispatcher.prototype, {


    });
    //设置外边框颜色
    Object.defineProperty(OutLine.prototype, 'visibleEdgeColor', {
        set: function(val) {
            this.visibleEdgeColorVal = val;
            this._visibleEdgeColor = new THREE.Color(val);
            this.outlinePass.visibleEdgeColor = this._visibleEdgeColor;

        }








    });

    //设置隐藏起来看不到的颜色
    Object.defineProperty(OutLine.prototype, 'hiddenEdgeColor', {
        set: function(val) {
            this.hiddenEdgeColorVal = val;
            this._hiddenEdgeColor = new THREE.Color(val);
            this.outlinePass.hiddenEdgeColor = this._hiddenEdgeColor;
        }




    });
    Object.defineProperty(OutLine.prototype, 'edgeGlow', {
        set: function(val) {
            this._edgeGlow = val;
            this.outlinePass.edgeGlow = this._edgeGlow;
        }



    });
    //外边框粗细度
    Object.defineProperty(OutLine.prototype, 'edgeThickness', {
        set: function(val) {
            this._edgeThickness = val;
            this.outlinePass.edgeThickness = this.edgeThickness;
        }


    });
    //设置外边框强度
    Object.defineProperty(OutLine.prototype, 'edgeStrength', {
        set: function(val) {
            this._edgeStrength = val;
            this.outlinePass.edgeStrength = this._edgeStrength;
        }


    });
    //闪烁间隔时间如果为0 就不闪烁
    Object.defineProperty(OutLine.prototype, 'pulsePeriod', {
        set: function(val) {
            this._pulsePeriod = val;
            this.outlinePass.pulsePeriod = this._pulsePeriod;
        }


    });
    return OutLine;
});