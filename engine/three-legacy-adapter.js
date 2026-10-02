(function(global){
  'use strict';

  /*
   * 神之領域3D — Three.js Legacy Renderer Adapter
   * V1.01.23
   *
   * This is the only migration-layer module that owns the direct Three.js
   * renderer bootstrap API. Game Core remains renderer-neutral and the
   * runtime accesses Three through this boundary instead of resolving the
   * global engine object itself.
   */
  var api = global.AsgardThreeLegacy = global.AsgardThreeLegacy || {};

  api.version = '1.01.25';
  api.engine = 'three';

  api.getAPI = function(){
    return global.THREE || null;
  };

  api.available = function(){
    var t = api.getAPI();
    return !!(t && t.Scene && t.WebGLRenderer && t.PerspectiveCamera);
  };

  api.createScene = function(){
    var t = api.getAPI();
    if (!t || !t.Scene) throw new Error('Three.js Scene is not available');
    return new t.Scene();
  };

  api.createGroup = function(){
    var t = api.getAPI();
    if (!t || !t.Group) throw new Error('Three.js Group is not available');
    return new t.Group();
  };

  // V1.01.25: runtime no longer owns the main renderer bootstrap helpers.
  api.createClock = function(){
    var t = api.getAPI();
    if (!t || !t.Clock) throw new Error('Three.js Clock is not available');
    return new t.Clock();
  };

  api.mountMainRenderer = function(renderer, host){
    if (!renderer || !renderer.domElement || !host) throw new Error('Main renderer mount target is not available');
    var el = renderer.domElement;
    el.style.width = '100%';
    el.style.height = '100%';
    el.style.zIndex = '2';
    host.appendChild(el);
    return el;
  };

  api.createRenderer = function(options){
    var t = api.getAPI();
    if (!t || !t.WebGLRenderer) throw new Error('Three.js WebGLRenderer is not available');
    return new t.WebGLRenderer(options || {antialias:true, powerPreference:'high-performance'});
  };

  api.createCamera = function(options){
    var t = api.getAPI();
    if (!t || !t.PerspectiveCamera) throw new Error('Three.js PerspectiveCamera is not available');
    var o = options || {};
    return new t.PerspectiveCamera(
      o.fov != null ? o.fov : 52,
      o.aspect != null ? o.aspect : 1,
      o.near != null ? o.near : .1,
      o.far != null ? o.far : 500
    );
  };

  api.configureRenderer = function(renderer, options){
    if (!renderer) return renderer;
    var o = options || {};
    if (o.width != null && o.height != null && renderer.setSize) renderer.setSize(o.width, o.height, false);
    if (o.pixelRatio != null && renderer.setPixelRatio) renderer.setPixelRatio(o.pixelRatio);
    var t = api.getAPI();
    if (renderer.shadowMap) {
      renderer.shadowMap.enabled = true;
      if (t && t.PCFSoftShadowMap) renderer.shadowMap.type = t.PCFSoftShadowMap;
    }
    if (t && t.SRGBColorSpace && 'outputColorSpace' in renderer) renderer.outputColorSpace = t.SRGBColorSpace;
    return renderer;
  };

  api.resizeRenderer = function(renderer, width, height, pixelRatio){
    if (!renderer) return renderer;
    if (renderer.setPixelRatio && pixelRatio != null) renderer.setPixelRatio(pixelRatio);
    if (renderer.setSize) renderer.setSize(width, height, false);
    return renderer;
  };

  api.render = function(renderer, scene, camera){
    if (renderer && renderer.render) return renderer.render(scene, camera);
  };

  api.getConstant = function(name){
    var t = api.getAPI();
    return t ? t[name] : undefined;
  };

  api.inspect = function(){
    return {version:api.version, engine:api.engine, available:api.available()};
  };
})(window);
