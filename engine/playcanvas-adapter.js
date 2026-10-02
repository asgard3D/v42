(function(global){
  'use strict';

  // V1.01.81 — PlayCanvas Character Appearance / Hair / Face / Body Implementation Layer.
  // Passive preparation layer only. It does NOT load PlayCanvas, create a
  // PlayCanvas application, replace the active renderer, or alter gameplay.
  var pc = global.pc || null;
  var adapter = global.AsgardPlayCanvasAdapter = global.AsgardPlayCanvasAdapter || {};

  /* V1.02.09 Preview Visual Instance facade */
adapter.createPreviewVisualInstanceV209=function(options){
  options=options||{};
  var instance={version:'1.02.09',id:options.id||('preview-visual-'+Date.now()),state:options.state||null,revision:0,active:false,created:false};
  instance.created=true;
  return instance;
};
adapter.updatePreviewVisualInstanceV209=function(instance,state){
  if(!instance||!instance.created)return false;
  instance.state=state||null; instance.revision=(instance.revision||0)+1; instance.active=true; return true;
};
adapter.inspectPreviewVisualInstanceV209=function(instance){
  if(!instance)return null;
  return {version:'1.02.09',id:instance.id,created:!!instance.created,active:!!instance.active,revision:instance.revision||0,state:instance.state||null};
};
adapter.clearPreviewVisualInstanceV209=function(instance){
  if(!instance)return false; instance.state=null; instance.active=false; instance.revision=(instance.revision||0)+1; return true;
};
/* V1.02.11 Preview Visual State Diff + Apply Transaction */
adapter.diffPreviewVisualInstanceV211=function(instance,nextState){
  if(!instance||!instance.created)return {ok:false,error:'preview visual instance unavailable'};
  var prev=instance.state||{}; var next=nextState||{}; var keys=['animation','equipment','material','rarity','holyDemon','appearance','mapping','composition'];
  var changes={}; var changedKeys=[];
  keys.forEach(function(key){
    var a=JSON.stringify(prev[key]===undefined?null:prev[key]);
    var b=JSON.stringify(next[key]===undefined?null:next[key]);
    if(a!==b){changes[key]={from:prev[key]===undefined?null:prev[key],to:next[key]===undefined?null:next[key]};changedKeys.push(key);}
  });
  return {ok:true,version:'1.02.11',changed:changedKeys.length>0,changedKeys:changedKeys,changes:changes,fromRevision:instance.revision||0};
};
adapter.beginPreviewVisualTransactionV211=function(instance,nextState,options){
  if(!instance||!instance.created)return {ok:false,error:'preview visual instance unavailable'};
  options=options||{}; instance.transactionV211={active:true,revisionBefore:instance.revision||0,stateBefore:instance.state||null,visualUpdateBefore:instance.visualUpdate||null,nextState:nextState||{},source:options.source||'preview',startedAt:Date.now()};
  return {ok:true,version:'1.02.11',revisionBefore:instance.transactionV211.revisionBefore,source:instance.transactionV211.source};
};
adapter.applyPreviewVisualTransactionV211=function(instance,nextState,options){
  if(!instance||!instance.created)return {ok:false,error:'preview visual instance unavailable'};
  var tx=instance.transactionV211; if(!tx||!tx.active)return {ok:false,error:'transaction not active'};
  options=options||{}; var diff=adapter.diffPreviewVisualInstanceV211(instance,nextState||tx.nextState||{});
  if(!diff.ok)return diff;
  instance.state=nextState||tx.nextState||{}; instance.revision=(instance.revision||0)+1; instance.active=true;
  instance.visualUpdate={version:'1.02.11',revision:instance.revision,changedKeys:diff.changedKeys,updatedAt:Date.now(),source:options.source||tx.source||'preview'};
  instance.transactionV211.active=false; instance.transactionV211.committed=true; instance.transactionV211.revisionAfter=instance.revision; instance.transactionV211.diff=diff;
  return {ok:true,version:'1.02.11',revision:instance.revision,diff:diff};
};
adapter.rollbackPreviewVisualTransactionV211=function(instance){
  if(!instance||!instance.created)return {ok:false,error:'preview visual instance unavailable'};
  var tx=instance.transactionV211; if(!tx||!tx.active)return {ok:false,error:'transaction not active'};
  instance.state=tx.stateBefore; instance.visualUpdate=tx.visualUpdateBefore; instance.revision=tx.revisionBefore; instance.active=!!instance.state;
  instance.transactionV211.active=false; instance.transactionV211.rolledBack=true; instance.transactionV211.revisionAfter=instance.revision;
  return {ok:true,version:'1.02.11',revision:instance.revision};
};
adapter.inspectPreviewVisualTransactionV211=function(instance){
  if(!instance)return null; return {version:'1.02.11',active:!!(instance.transactionV211&&instance.transactionV211.active),transaction:instance.transactionV211||null};
};

/* V1.02.12 Preview Visual Frame / Update Lifecycle */
adapter.beginPreviewVisualFrameV212=function(instance,deltaTime,options){
  if(!instance||!instance.created)return {ok:false,error:'preview visual instance unavailable'};
  options=options||{};
  instance.frameV212=instance.frameV212||{frame:0,elapsed:0,delta:0,active:false,source:null};
  instance.frameV212.frame+=1;
  instance.frameV212.delta=Number(deltaTime)||0;
  instance.frameV212.elapsed+=instance.frameV212.delta;
  instance.frameV212.active=true;
  instance.frameV212.source=options.source||'preview';
  instance.frameV212.startedAt=Date.now();
  return {ok:true,version:'1.02.12',frame:instance.frameV212.frame,elapsed:instance.frameV212.elapsed,delta:instance.frameV212.delta};
};
adapter.updatePreviewVisualFrameV212=function(instance,state,options){
  if(!instance||!instance.created)return {ok:false,error:'preview visual instance unavailable'};
  options=options||{};
  var frame=instance.frameV212||{frame:0,elapsed:0,delta:0,active:false};
  var next=state||instance.state||{};
  instance.state=next;
  instance.active=true;
  instance.visualFrameV212={version:'1.02.12',frame:frame.frame||0,delta:frame.delta||0,elapsed:frame.elapsed||0,revision:instance.revision||0,updatedAt:Date.now(),source:options.source||'preview'};
  return {ok:true,frame:instance.visualFrameV212.frame,revision:instance.revision||0,state:instance.state,visualFrame:instance.visualFrameV212};
};
adapter.endPreviewVisualFrameV212=function(instance){
  if(!instance||!instance.created)return {ok:false,error:'preview visual instance unavailable'};
  if(instance.frameV212)instance.frameV212.active=false;
  return {ok:true,version:'1.02.12',frame:instance.frameV212?instance.frameV212.frame:0,elapsed:instance.frameV212?instance.frameV212.elapsed:0};
};
adapter.inspectPreviewVisualFrameV212=function(instance){
  if(!instance)return null;
  return {version:'1.02.12',id:instance.id,created:!!instance.created,active:!!(instance.frameV212&&instance.frameV212.active),frame:instance.frameV212||null,visualFrame:instance.visualFrameV212||null};
};
adapter.clearPreviewVisualFrameV212=function(instance){
  if(!instance)return false;
  instance.frameV212=null; instance.visualFrameV212=null; return true;
};

/* V1.02.13 Preview Visual Frame / State Consistency */
adapter.validatePreviewVisualFrameV213=function(instance,options){
  if(!instance||!instance.created)return {ok:false,error:'preview visual instance unavailable'};
  options=options||{};
  var frame=instance.frameV212||null;
  var visualFrame=instance.visualFrameV212||null;
  var state=instance.state||null;
  var checks={
    frameExists:!!frame,
    visualFrameExists:!!visualFrame,
    frameMatches:!!(frame&&visualFrame&&frame.frame===visualFrame.frame),
    elapsedMatches:!!(frame&&visualFrame&&Number(frame.elapsed)===Number(visualFrame.elapsed)),
    deltaMatches:!!(frame&&visualFrame&&Number(frame.delta)===Number(visualFrame.delta)),
    stateExists:!!state,
    revisionValid:Number.isFinite(Number(instance.revision||0))
  };
  var valid=checks.frameExists&&checks.visualFrameExists&&checks.frameMatches&&checks.elapsedMatches&&checks.deltaMatches&&checks.revisionValid;
  instance.frameValidationV213={version:'1.02.13',valid:valid,checks:checks,frame:frame,visualFrame:visualFrame,revision:instance.revision||0,validatedAt:Date.now(),source:options.source||'preview'};
  return {ok:true,version:'1.02.13',valid:valid,checks:checks,revision:instance.revision||0};
};
adapter.inspectPreviewVisualFrameV213=function(instance){
  if(!instance)return null;
  return {version:'1.02.13',id:instance.id,created:!!instance.created,frame:instance.frameV212||null,visualFrame:instance.visualFrameV212||null,validation:instance.frameValidationV213||null,revision:instance.revision||0};
};
adapter.clearPreviewVisualFrameV213=function(instance){
  if(!instance)return false;
  instance.frameValidationV213=null;
  return true;
};

/* V1.02.14 Preview Visual Unified Lifecycle */
adapter.beginPreviewVisualLifecycleV214=function(instance,options){
  if(!instance||!instance.created)return {ok:false,error:'preview visual instance unavailable'};
  options=options||{};
  instance.lifecycle=instance.lifecycle||{};
  instance.lifecycle.version='1.02.14';
  instance.lifecycle.active=true;
  instance.lifecycle.frame=(instance.lifecycle.frame||0)+1;
  instance.lifecycle.startedAt=Date.now();
  instance.lifecycle.source=options.source||'preview';
  return {ok:true,lifecycle:instance.lifecycle};
};
adapter.updatePreviewVisualLifecycleV214=function(instance,state,options){
  if(!instance||!instance.created)return {ok:false,error:'preview visual instance unavailable'};
  options=options||{};
  var result=adapter.updatePreviewVisualInstanceV210?adapter.updatePreviewVisualInstanceV210(instance,state,options):null;
  instance.lifecycle=instance.lifecycle||{};
  instance.lifecycle.version='1.02.14';
  instance.lifecycle.updatedAt=Date.now();
  instance.lifecycle.stateRevision=instance.revision||0;
  instance.lifecycle.updated=!!(result&&result.ok!==false);
  return {ok:instance.lifecycle.updated,lifecycle:instance.lifecycle,result:result};
};
adapter.endPreviewVisualLifecycleV214=function(instance,options){
  if(!instance||!instance.created)return {ok:false,error:'preview visual instance unavailable'};
  options=options||{};
  instance.lifecycle=instance.lifecycle||{};
  instance.lifecycle.version='1.02.14';
  instance.lifecycle.endedAt=Date.now();
  instance.lifecycle.active=false;
  instance.lifecycle.reason=options.reason||'frame-end';
  return {ok:true,lifecycle:instance.lifecycle};
};
adapter.inspectPreviewVisualLifecycleV214=function(instance){
  if(!instance)return null;
  return {version:'1.02.14',id:instance.id||null,created:!!instance.created,active:!!instance.active,lifecycle:instance.lifecycle||null,revision:instance.revision||0};
};
adapter.clearPreviewVisualLifecycleV214=function(instance){
  if(!instance)return false;
  instance.lifecycle=null;
  return true;
};


/* V1.02.15 Preview Lifecycle Readiness / Commit Gate */
adapter.evaluatePreviewLifecycleReadinessV215=function(instance,options){
  options=options||{};
  if(!instance||!instance.created)return {ok:false,ready:false,error:'preview visual instance unavailable'};
  var frame=instance.frameState||instance.frame||null;
  var visual=instance.visualUpdate||null;
  var state=instance.state||null;
  var checks={
    instance:!!instance.created&&!instance.destroyed,
    active:!!instance.active,
    state:!!state,
    visualUpdate:!!visual,
    frame:!!frame,
    revisionConsistent:!frame||!visual||frame.visualRevision==null||visual.revision==null||frame.visualRevision===visual.revision
  };
  var ready=Object.keys(checks).every(function(k){return checks[k]===true;});
  instance.readinessV215={version:'1.02.15',ready:ready,checks:checks,revision:instance.revision||0,checkedAt:Date.now(),source:options.source||'preview'};
  return {ok:true,ready:ready,checks:checks,readiness:instance.readinessV215};
};
adapter.commitPreviewLifecycleV215=function(instance,options){
  options=options||{};
  var result=adapter.evaluatePreviewLifecycleReadinessV215(instance,options);
  if(!result.ok||!result.ready){
    if(instance)instance.commitV215={ok:false,committed:false,reason:'readiness-gate',readiness:result.readiness||result};
    return {ok:false,committed:false,reason:'readiness-gate',readiness:result.readiness||result};
  }
  instance.commitV215={ok:true,committed:true,revision:instance.revision||0,committedAt:Date.now(),source:options.source||'preview'};
  return {ok:true,committed:true,commit:instance.commitV215};
};
adapter.inspectPreviewLifecycleGateV215=function(instance){
  if(!instance)return null;
  return {version:'1.02.15',readiness:instance.readinessV215||null,commit:instance.commitV215||null};
};
adapter.clearPreviewLifecycleGateV215=function(instance){
  if(!instance)return false;
  instance.readinessV215=null; instance.commitV215=null; return true;
};

/* V1.01.15 Character Visual A/B Test Gate */
adapter.setCharacterWeaponAttackVisualTestV115=function(sync,visible){
  if(!sync||!sync.entity)return {ok:false,error:'weapon/attack mirror unavailable'};
  sync.entity.enabled=!!visible; sync.visualTestV115=!!visible;
  if(sync.sourceWeaponRootR)sync.sourceWeaponRootR.visible=!visible; if(sync.sourceWeaponRootL)sync.sourceWeaponRootL.visible=!visible;
  if(sync.visualMirrorR)sync.visualMirrorR.enabled=!!visible; if(sync.visualMirrorL)sync.visualMirrorL.enabled=!!visible;
  return {ok:true,version:'1.01.16',visible:!!visible};
};
adapter.inspectCharacterWeaponAttackVisualTestV115=function(sync){
  if(!sync)return null;
  return {version:'1.01.16',visible:!!(sync.entity&&sync.entity.enabled),frame:sync.frame||0,state:sync.lastState||null};
};

adapter.version = '1.02.14';
  adapter.engine = 'playcanvas';
  adapter.active = false;
  adapter.available = !!pc;

  adapter.capabilities = adapter.capabilities || {
    engineDetected: !!pc,
    application: !!(pc && pc.Application),
    entity: !!(pc && pc.Entity),
    graphNode: !!(pc && pc.GraphNode),
    camera: !!(pc && pc.CameraComponent),
    render: !!(pc && pc.RenderComponent),
    model: !!(pc && pc.Model),
    mesh: !!(pc && pc.Mesh),
    material: !!(pc && pc.StandardMaterial),
    texture: !!(pc && pc.Texture),
    animation: !!(pc && (pc.AnimationComponent || pc.AnimComponent || pc.AnimStateGraph)),
    rigidbody: !!(pc && pc.RigidBodyComponent),
    collision: !!(pc && pc.CollisionComponent),
    audio: !!(pc && pc.SoundManager),
    light: !!(pc && pc.LightComponent),
    cameraComponent: !!(pc && pc.CameraComponent)
  };

  adapter.refresh = function(){
    pc = global.pc || null;
    adapter.available = !!pc;
    adapter.capabilities.engineDetected = !!pc;
    adapter.capabilities.application = !!(pc && pc.Application);
    adapter.capabilities.entity = !!(pc && pc.Entity);
    adapter.capabilities.graphNode = !!(pc && pc.GraphNode);
    adapter.capabilities.camera = !!(pc && pc.CameraComponent);
    adapter.capabilities.render = !!(pc && pc.RenderComponent);
    adapter.capabilities.model = !!(pc && pc.Model);
    adapter.capabilities.mesh = !!(pc && pc.Mesh);
    adapter.capabilities.material = !!(pc && pc.StandardMaterial);
    adapter.capabilities.texture = !!(pc && pc.Texture);
    adapter.capabilities.animation = !!(pc && (pc.AnimationComponent || pc.AnimComponent || pc.AnimStateGraph));
    adapter.capabilities.rigidbody = !!(pc && pc.RigidBodyComponent);
    adapter.capabilities.collision = !!(pc && pc.CollisionComponent);
    adapter.capabilities.audio = !!(pc && pc.SoundManager);
    adapter.capabilities.light = !!(pc && pc.LightComponent);
    adapter.capabilities.cameraComponent = !!(pc && pc.CameraComponent);
    return adapter.capabilities;
  };

  adapter.getCapability = function(name){
    adapter.refresh();
    return !!adapter.capabilities[name];
  };

  adapter.supports = function(name){
    return adapter.getCapability(name);
  };

  adapter.getRuntimeInfo = function(){
    adapter.refresh();
    return {
      version: adapter.version,
      engine: adapter.engine,
      available: adapter.available,
      active: adapter.active,
      playCanvasVersion: pc && pc.version || null,
      capabilities: Object.assign({}, adapter.capabilities)
    };
  };

  // The following factories are intentionally passive. They only operate
  // when PlayCanvas is already supplied by the host page/application.
  adapter.createEntity = function(name){
    adapter.refresh();
    if (!pc || !pc.Entity) return null;
    return new pc.Entity(name || 'AsgardEntity');
  };

  adapter.createGraphNode = function(name){
    adapter.refresh();
    if (!pc || !pc.GraphNode) return null;
    return new pc.GraphNode(name || 'AsgardGraphNode');
  };

  adapter.createVec3 = function(x,y,z){
    adapter.refresh();
    if (!pc || !pc.Vec3) return null;
    return new pc.Vec3(x || 0, y || 0, z || 0);
  };

  adapter.createColor = function(r,g,b,a){
    adapter.refresh();
    if (!pc || !pc.Color) return null;
    return new pc.Color(r == null ? 1 : r, g == null ? 1 : g, b == null ? 1 : b, a == null ? 1 : a);
  };

  adapter.createStandardMaterial = function(){
    adapter.refresh();
    if (!pc || !pc.StandardMaterial) return null;
    return new pc.StandardMaterial();
  };

  adapter.createTexture = function(graphicsDevice, options){
    adapter.refresh();
    if (!pc || !pc.Texture || !graphicsDevice) return null;
    return new pc.Texture(graphicsDevice, options || {});
  };

  adapter.createApplication = function(canvas, options){
    adapter.refresh();
    if (!pc || !pc.Application || !canvas) return null;
    return new pc.Application(canvas, options || {});
  };



  // V1.01.77 implementation layer. These factories are dormant and are only
  // executed when a caller explicitly invokes them. The live game continues
  // to use Three.js; nothing here is wired into the existing boot/render loop.
  adapter.createScene = function(){
    adapter.refresh();
    if (!pc || !pc.Scene) return null;
    return new pc.Scene();
  };

  adapter.createCamera = function(options){
    adapter.refresh();
    if (!pc || !pc.Entity) return null;
    options = options || {};
    var entity = new pc.Entity(options.name || 'AsgardCamera');
    if (entity.addComponent && pc.CameraComponent) {
      entity.addComponent('camera', options.camera || {});
    }
    return entity;
  };

  adapter.createRendererContext = function(canvas, options){
    adapter.refresh();
    if (!pc || !pc.Application || !canvas) return null;
    options = options || {};
    return {
      canvas: canvas,
      options: Object.assign({}, options),
      engine: 'playcanvas',
      created: false,
      application: null
    };
  };

  adapter.createApplicationContext = function(canvas, options){
    adapter.refresh();
    if (!pc || !pc.Application || !canvas) return null;
    return {
      canvas: canvas,
      options: Object.assign({}, options || {}),
      engine: 'playcanvas',
      application: null,
      started: false
    };
  };

  adapter.getSceneFromApplication = function(application){
    if (!application) return null;
    return application.scene || null;
  };

  adapter.getCameraFromEntity = function(entity){
    if (!entity) return null;
    return entity.camera || null;
  };

  /* V1.01.30 — Full Map Bridge
   * Mirrors the complete runtime map object hierarchy into an isolated
   * PlayCanvas scene. The proven Three.js map remains authoritative for this
   * milestone; PlayCanvas receives the same transforms/materials/geometry so
   * the entire map can be switched over later without rebuilding map logic.
   */
  adapter.createFullMapBridgeV130=function(options){
    adapter.refresh(); options=options||{};
    var bridge={version:'1.01.30',id:options.id||('full-map-bridge-'+Date.now()),zone:options.zone||null,
      enabled:options.enabled!==false,sourceRoot:null,pcRoot:null,entities:[],meshCount:0,groupCount:0,
      skipped:0,created:false,lastSync:0,error:null};
    return bridge;
  };
  // V1.01.42 — PlayCanvas map resource cache. The previous mirror rebuilt a
  // Mesh + StandardMaterial for every visible Three.js mesh node. Large cities
  // often reuse the same BufferGeometry/Material objects many times, so that
  // conversion was unnecessarily CPU-heavy and created excessive GPU resources.
  // WeakMap keeps the cache renderer-local without preventing Three.js resources
  // from being garbage-collected when the authoritative world is cleared.
  adapter._pcGeometryCache = adapter._pcGeometryCache || new WeakMap();
  adapter._pcMaterialCache = adapter._pcMaterialCache || new WeakMap();
  adapter._pcColorHex=function(material){
    try{
      var c=Array.isArray(material)?material[0]?.color:material?.color;
      return c&&c.getHex?c.getHex():0x808080;
    }catch(e){return 0x808080;}
  };
  adapter._pcMaterial=function(device,threeMaterial){
    if(!pc||!pc.StandardMaterial)return null;
    var source=Array.isArray(threeMaterial)?threeMaterial[0]:threeMaterial;
    if(source&&typeof source==='object'){
      var cached=adapter._pcMaterialCache.get(source);
      if(cached)return cached;
    }
    var m=new pc.StandardMaterial();
    var h=adapter._pcColorHex(threeMaterial); m.diffuse=new pc.Color(((h>>16)&255)/255,((h>>8)&255)/255,(h&255)/255);
    var opacity=Number(source?.opacity); if(!Number.isFinite(opacity))opacity=1;
    if(opacity<.999){m.opacity=opacity;m.blendType=pc.BLEND_NORMAL;m.depthWrite=false;}
    m.roughness=Number.isFinite(Number(source?.roughness))?Number(source.roughness):.8;
    m.metalness=Number.isFinite(Number(source?.metalness))?Number(source.metalness):0;
    m.update();
    if(source&&typeof source==='object')adapter._pcMaterialCache.set(source,m);
    return m;
  };
  adapter._pcGeometry=function(device,g){
    if(!pc||!pc.Mesh||!pc.VertexFormat||!g?.attributes?.position)return null;
    try{
      var cached=adapter._pcGeometryCache.get(g);
      if(cached)return cached;
      var pos=g.attributes.position.array, nor=g.attributes.normal?.array, uv=g.attributes.uv?.array;
      var count=g.attributes.position.count, data=[];
      for(var i=0;i<count;i++){
        data.push(pos[i*3],pos[i*3+1],pos[i*3+2]);
        if(nor)data.push(nor[i*3],nor[i*3+1],nor[i*3+2]); else data.push(0,1,0);
        if(uv)data.push(uv[i*2],uv[i*2+1]); else data.push(0,0);
      }
      var elements=[{semantic:pc.SEMANTIC_POSITION,components:3,type:pc.TYPE_FLOAT32},{semantic:pc.SEMANTIC_NORMAL,components:3,type:pc.TYPE_FLOAT32},{semantic:pc.SEMANTIC_TEXCOORD0,components:2,type:pc.TYPE_FLOAT32}];
      var vf=new pc.VertexFormat(device,elements), mesh=new pc.Mesh(device);
      mesh.vertexBuffer=new pc.VertexBuffer(device,vf,count,pc.BUFFER_STATIC);
      var vb=mesh.vertexBuffer.lock(); new Float32Array(vb).set(new Float32Array(data)); mesh.vertexBuffer.unlock();
      var idx=g.index?.array; var indices=idx?Array.from(idx):Array.from({length:count},(_,k)=>k);
      var max=Math.max.apply(null,indices); var ibType=max>65535?pc.INDEXFORMAT_UINT32:pc.INDEXFORMAT_UINT16;
      mesh.indexBuffer=new pc.IndexBuffer(device,ibType,indices.length,pc.BUFFER_STATIC);
      var ib=mesh.indexBuffer.lock(); var C=ibType===pc.INDEXFORMAT_UINT32?Uint32Array:Uint16Array; new C(ib).set(indices); mesh.indexBuffer.unlock();
      mesh.primitive[0]={type:pc.PRIMITIVE_TRIANGLES,base:0,count:indices.length,indexed:true};
      mesh.primitive[0].count=indices.length; mesh.aabb.computeMinMax(mesh.vertexBuffer,0,count);
      adapter._pcGeometryCache.set(g,mesh);
      return mesh;
    }catch(e){return null;}
  };
  adapter._mirrorNodeV130=function(bridge,node,parentEntity,device){
    if(!node||!parentEntity||!device)return;
    var ent=new pc.Entity(node.name||'MapNode'); parentEntity.addChild(ent);
    ent.setLocalPosition(node.position.x,node.position.y,node.position.z);
    ent.setLocalEulerAngles(node.rotation.x*180/Math.PI,node.rotation.y*180/Math.PI,node.rotation.z*180/Math.PI);
    ent.setLocalScale(node.scale.x,node.scale.y,node.scale.z);
    bridge.entities.push(ent);
    if(node.isMesh&&node.geometry){
      var mesh=adapter._pcGeometry(device,node.geometry), mat=adapter._pcMaterial(device,node.material);
      if(mesh&&mat){ent.addComponent('render',{type:'asset'}); ent.render.meshInstances=[new pc.MeshInstance(mesh,mat)]; bridge.meshCount++;}
      else bridge.skipped++;
    }else if(node.children?.length) bridge.groupCount++;
    if(node.children)node.children.forEach(ch=>adapter._mirrorNodeV130(bridge,ch,ent,device));
  };
  /* V1.01.04 — Full Map visible renderer. The runtime remains authoritative;
   * PlayCanvas becomes the visible map renderer when successfully initialized. */
  adapter.prepareFullMapRendererV104=function(application,options){
    options=options||{};
    if(!application||!pc||!pc.Entity)return {ok:false,error:'PlayCanvas application unavailable'};
    try{
      var root=application.root;
      var camera=new pc.Entity('AsgardPCCamera');
      root.addChild(camera); camera.addComponent('camera',{clearColor:new pc.Color(0,0,0,1),fov:52,nearClip:.1,farClip:500});
      camera.setPosition(0,6,10); camera.lookAt(0,1,0);
      var light=new pc.Entity('AsgardPCKeyLight');
      root.addChild(light); light.addComponent('light',{type:'directional',color:new pc.Color(1,0.92,0.78),intensity:1.4,castShadows:false});
      light.setEulerAngles(-48,32,0);
      var fill=new pc.Entity('AsgardPCFillLight');
      root.addChild(fill); fill.addComponent('light',{type:'omni',color:new pc.Color(.55,.65,1),intensity:1.1,range:180});
      fill.setPosition(0,12,0);
      application.scene.activeCamera=camera.camera;
      application.scene.gammaCorrection=pc.GAMMA_SRGB||0;
      application.scene.toneMapping=pc.TONEMAP_FILMIC||0;
      application.autoRender=true;
      return {ok:true,camera:camera,light:light,fill:fill};
    }catch(e){return {ok:false,error:String(e&&e.message||e)};}
  };
  adapter.syncFullMapCameraV104=function(ctx,threeCamera){
    if(!ctx||!ctx.camera||!threeCamera)return false;
    try{
      var p=threeCamera.position, r=threeCamera.rotation;
      ctx.camera.setPosition(p.x,p.y,p.z);
      ctx.camera.setEulerAngles(r.x*180/Math.PI,r.y*180/Math.PI,r.z*180/Math.PI);
      return true;
    }catch(e){return false;}
  };
  adapter.setFullMapVisibleV104=function(visible){
    var c=window.__ASGARD_PC_CANVAS__; if(!c)return false;
    c.style.display=visible?'block':'none';
    return true;
  };

  adapter.syncFullMapV130=function(bridge,sourceRoot,application){
    if(!bridge||!sourceRoot||!application||!pc)return {ok:false,error:'map bridge source/application unavailable'};
    try{
      if(bridge.pcRoot)bridge.pcRoot.destroy();
      bridge.entities=[];bridge.meshCount=0;bridge.groupCount=0;bridge.skipped=0;
      bridge.sourceRoot=sourceRoot;
      bridge.pcRoot=new pc.Entity('AsgardFullMap_'+(bridge.zone||'active'));
      application.root.addChild(bridge.pcRoot);
      var device=application.graphicsDevice;
      sourceRoot.children?.forEach(function(ch){adapter._mirrorNodeV130(bridge,ch,bridge.pcRoot,device);});
      bridge.created=true;bridge.lastSync=Date.now();bridge.error=null;
      return {ok:true,version:'1.01.30',zone:bridge.zone,meshCount:bridge.meshCount,groupCount:bridge.groupCount,skipped:bridge.skipped};
    }catch(e){bridge.error=String(e&&e.message||e);return {ok:false,error:bridge.error};}
  };
  // V1.01.19 — non-blocking full-map mirror. Build the PlayCanvas mirror in
  // small frame-sized batches so large procedural maps (especially 路爾斯城)
  // do not monopolize the main thread during entry. Visual fidelity and source
  // geometry/material data are unchanged; only scheduling is different.
  adapter.syncFullMapV130Async=function(bridge,sourceRoot,application,options){
    options=options||{};
    if(!bridge||!sourceRoot||!application||!pc)return Promise.resolve({ok:false,error:'map bridge source/application unavailable'});
    var batch=Math.max(24,Number(options.batch)||90), frameBudget=Math.max(3,Number(options.frameBudgetMs)||7), self=adapter;
    try{
      if(bridge.pcRoot)bridge.pcRoot.destroy();
      bridge.entities=[];bridge.meshCount=0;bridge.groupCount=0;bridge.skipped=0;
      bridge.sourceRoot=sourceRoot;
      bridge.pcRoot=new pc.Entity('AsgardFullMap_'+(bridge.zone||'active'));
      application.root.addChild(bridge.pcRoot);
      var device=application.graphicsDevice, queue=[];
      (sourceRoot.children||[]).forEach(function(ch){queue.push({node:ch,parent:bridge.pcRoot});});
      return new Promise(function(resolve){
        function step(){
          var count=0, frameStart=performance.now();
          try{
            while(queue.length && count<batch && (performance.now()-frameStart)<frameBudget){
              var item=queue.shift(), node=item.node, parent=item.parent;
              if(!node||node.visible===false){count++;continue;}
              var ent=new pc.Entity(node.name||'MapNode'); parent.addChild(ent);
              ent.setLocalPosition(node.position.x,node.position.y,node.position.z);
              ent.setLocalEulerAngles(node.rotation.x*180/Math.PI,node.rotation.y*180/Math.PI,node.rotation.z*180/Math.PI);
              ent.setLocalScale(node.scale.x,node.scale.y,node.scale.z);
              bridge.entities.push(ent);
              if(node.isMesh&&node.geometry){
                var mesh=self._pcGeometry(device,node.geometry), material=self._pcMaterial(device,node.material);
                if(mesh&&material){ent.addComponent('render',{type:'asset'});ent.render.meshInstances=[new pc.MeshInstance(mesh,material)];bridge.meshCount++;}
                else bridge.skipped++;
              }else if(node.children?.length) bridge.groupCount++;
              if(node.children)node.children.forEach(function(ch){queue.push({node:ch,parent:ent});});
              count++;
            }
            if(queue.length){requestAnimationFrame(step);return;}
            bridge.created=true;bridge.lastSync=Date.now();bridge.error=null;
            resolve({ok:true,version:'1.01.30',zone:bridge.zone,meshCount:bridge.meshCount,groupCount:bridge.groupCount,skipped:bridge.skipped,async:true});
          }catch(e){bridge.error=String(e&&e.message||e);resolve({ok:false,error:bridge.error});}
        }
        requestAnimationFrame(step);
      });
    }catch(e){bridge.error=String(e&&e.message||e);return Promise.resolve({ok:false,error:bridge.error});}
  };

  adapter.inspectFullMapV130=function(bridge){
    if(!bridge)return null;
    return {version:'1.01.30',id:bridge.id,zone:bridge.zone,created:!!bridge.created,meshCount:bridge.meshCount,groupCount:bridge.groupCount,skipped:bridge.skipped,lastSync:bridge.lastSync,error:bridge.error||null};
  };
  adapter.clearFullMapV130=function(bridge){
    if(!bridge)return false; try{if(bridge.pcRoot)bridge.pcRoot.destroy();}catch(e){} bridge.pcRoot=null;bridge.entities=[];bridge.created=false;bridge.meshCount=0;bridge.groupCount=0;bridge.skipped=0;return true;
  };

  // V1.01.79 implementation layer. World / Map / Entity factories are
  // dormant and only execute when explicitly called by a future migration
  // step. They never attach to the live Three.js world automatically.
  adapter.createWorld = function(options){
    adapter.refresh();
    options = options || {};
    if (!pc || !pc.Entity) return null;
    var world = new pc.Entity(options.name || 'AsgardWorld');
    return world;
  };

  adapter.createMapRoot = function(options){
    adapter.refresh();
    options = options || {};
    if (!pc || !pc.Entity) return null;
    return new pc.Entity(options.name || 'AsgardMap');
  };

  adapter.createWorldEntity = function(options){
    adapter.refresh();
    options = options || {};
    if (!pc || !pc.Entity) return null;
    return new pc.Entity(options.name || 'AsgardWorldEntity');
  };

  adapter.addChild = function(parent, child){
    if (parent && child && typeof parent.addChild === 'function') parent.addChild(child);
    return child;
  };

  adapter.removeChild = function(parent, child){
    if (parent && child && typeof parent.removeChild === 'function') parent.removeChild(child);
    return child;
  };

  adapter.setEntityPosition = function(entity, x, y, z){
    if (!entity) return entity;
    if (typeof entity.setPosition === 'function') entity.setPosition(x || 0, y || 0, z || 0);
    return entity;
  };

  adapter.setEntityRotation = function(entity, x, y, z){
    if (!entity) return entity;
    if (typeof entity.setEulerAngles === 'function') entity.setEulerAngles(x || 0, y || 0, z || 0);
    return entity;
  };

  adapter.setEntityScale = function(entity, x, y, z){
    if (!entity) return entity;
    if (typeof entity.setLocalScale === 'function') entity.setLocalScale(x == null ? 1 : x, y == null ? 1 : y, z == null ? 1 : z);
    return entity;
  };

  adapter.getEntityPosition = function(entity){
    if (!entity || typeof entity.getPosition !== 'function') return null;
    var v = entity.getPosition();
    return {x:v.x, y:v.y, z:v.z};
  };

  adapter.getEntityRotation = function(entity){
    if (!entity || typeof entity.getEulerAngles !== 'function') return null;
    var v = entity.getEulerAngles();
    return {x:v.x, y:v.y, z:v.z};
  };

  adapter.getEntityScale = function(entity){
    if (!entity || typeof entity.getLocalScale !== 'function') return null;
    var v = entity.getLocalScale();
    return {x:v.x, y:v.y, z:v.z};
  };

  adapter.addRenderComponent = function(entity, options){
    adapter.refresh();
    if (!entity || typeof entity.addComponent !== 'function' || !pc || !pc.RenderComponent) return null;
    entity.addComponent('render', options || {});
    return entity.render || null;
  };

  adapter.addCollisionComponent = function(entity, options){
    adapter.refresh();
    if (!entity || typeof entity.addComponent !== 'function' || !pc || !pc.CollisionComponent) return null;
    entity.addComponent('collision', options || {});
    return entity.collision || null;
  };

  adapter.addRigidBodyComponent = function(entity, options){
    adapter.refresh();
    if (!entity || typeof entity.addComponent !== 'function' || !pc || !pc.RigidBodyComponent) return null;
    entity.addComponent('rigidbody', options || {});
    return entity.rigidbody || null;
  };

  adapter.addLightComponent = function(entity, options){
    adapter.refresh();
    if (!entity || typeof entity.addComponent !== 'function' || !pc || !pc.LightComponent) return null;
    entity.addComponent('light', options || {});
    return entity.light || null;
  };

  adapter.findEntity = function(root, name){
    if (!root || name == null) return null;
    if (root.name === name) return root;
    if (typeof root.findByName === 'function') return root.findByName(name) || null;
    return null;
  };

  adapter.destroyEntity = function(entity){
    if (entity && typeof entity.destroy === 'function') entity.destroy();
    return null;
  };

  // V1.01.79 implementation layer. Character / NPC / Monster / Portal
  // factories are dormant and explicit-call only. They create independent
  // PlayCanvas entities and never touch the live Three.js character/world.
  adapter.createCharacterEntity = function(options){
    adapter.refresh();
    options = options || {};
    if (!pc || !pc.Entity) return null;
    var entity = new pc.Entity(options.name || 'AsgardCharacter');
    entity.__asgardType = 'character';
    entity.__asgardClass = options.className || options.characterClass || null;
    return entity;
  };

  adapter.createNPCEntity = function(options){
    adapter.refresh();
    options = options || {};
    if (!pc || !pc.Entity) return null;
    var entity = new pc.Entity(options.name || 'AsgardNPC');
    entity.__asgardType = 'npc';
    entity.__asgardNpcId = options.npcId == null ? null : options.npcId;
    return entity;
  };

  adapter.createMonsterEntity = function(options){
    adapter.refresh();
    options = options || {};
    if (!pc || !pc.Entity) return null;
    var entity = new pc.Entity(options.name || 'AsgardMonster');
    entity.__asgardType = 'monster';
    entity.__asgardMonsterId = options.monsterId == null ? null : options.monsterId;
    entity.__asgardBoss = !!options.boss;
    return entity;
  };

  adapter.createPortalEntity = function(options){
    adapter.refresh();
    options = options || {};
    if (!pc || !pc.Entity) return null;
    var entity = new pc.Entity(options.name || 'AsgardPortal');
    entity.__asgardType = 'portal';
    entity.__asgardPortalId = options.portalId == null ? null : options.portalId;
    entity.__asgardDestination = options.destination == null ? null : options.destination;
    return entity;
  };

  adapter.setEntityEnabled = function(entity, enabled){
    if (entity && typeof entity.enabled !== 'undefined') entity.enabled = !!enabled;
    return entity;
  };

  adapter.getEntityEnabled = function(entity){
    if (!entity || typeof entity.enabled === 'undefined') return null;
    return !!entity.enabled;
  };

  adapter.setEntityName = function(entity, name){
    if (entity && name != null) entity.name = String(name);
    return entity;
  };

  adapter.getEntityName = function(entity){
    return entity && entity.name != null ? entity.name : null;
  };

  adapter.setEntityTag = function(entity, key, value){
    if (!entity || key == null) return entity;
    entity.__asgardTags = entity.__asgardTags || {};
    entity.__asgardTags[String(key)] = value;
    return entity;
  };

  adapter.getEntityTag = function(entity, key){
    if (!entity || !entity.__asgardTags || key == null) return null;
    return Object.prototype.hasOwnProperty.call(entity.__asgardTags, String(key))
      ? entity.__asgardTags[String(key)] : null;
  };

  // V1.01.80 implementation layer. Character Model / Animation / Equipment
  // factories are dormant and explicit-call only. They create independent
  // PlayCanvas entities and never touch the live Three.js character or
  // Character Model V2 hierarchy.
  adapter.createCharacterModelEntity = function(options){
    adapter.refresh();
    options = options || {};
    if (!pc || !pc.Entity) return null;
    var entity = new pc.Entity(options.name || 'AsgardCharacterModel');
    entity.__asgardType = 'character-model';
    entity.__asgardModelId = options.modelId == null ? null : options.modelId;
    entity.__asgardBody = options.body == null ? null : options.body;
    entity.__asgardHead = options.head == null ? null : options.head;
    entity.__asgardHair = options.hair == null ? null : options.hair;
    entity.__asgardFace = options.face == null ? null : options.face;
    return entity;
  };

  adapter.createSkeletonEntity = function(options){
    adapter.refresh();
    options = options || {};
    if (!pc || !pc.Entity) return null;
    var entity = new pc.Entity(options.name || 'AsgardSkeleton');
    entity.__asgardType = 'skeleton';
    entity.__asgardSkeletonId = options.skeletonId == null ? null : options.skeletonId;
    entity.__asgardRootBone = options.rootBone == null ? null : options.rootBone;
    return entity;
  };

  adapter.createBoneEntity = function(options){
    adapter.refresh();
    options = options || {};
    if (!pc || !pc.Entity) return null;
    var entity = new pc.Entity(options.name || 'AsgardBone');
    entity.__asgardType = 'bone';
    entity.__asgardBoneId = options.boneId == null ? null : options.boneId;
    entity.__asgardBoneIndex = options.index == null ? null : options.index;
    return entity;
  };

  adapter.createAnimationEntity = function(options){
    adapter.refresh();
    options = options || {};
    if (!pc || !pc.Entity) return null;
    var entity = new pc.Entity(options.name || 'AsgardCharacterAnimation');
    entity.__asgardType = 'animation';
    entity.__asgardAnimationId = options.animationId == null ? null : options.animationId;
    entity.__asgardClip = options.clip == null ? null : options.clip;
    entity.__asgardState = options.state || 'idle';
    return entity;
  };

  adapter.addAnimationComponent = function(entity, options){
    adapter.refresh();
    if (!entity || typeof entity.addComponent !== 'function') return null;
    if (!pc || !pc.AnimComponent && !pc.AnimationComponent) return null;
    try {
      entity.addComponent('anim', options || {});
      return entity.anim || null;
    } catch (e) {
      return null;
    }
  };

  adapter.setAnimationState = function(entity, state){
    if (!entity) return entity;
    entity.__asgardAnimationState = state == null ? null : String(state);
    return entity;
  };

  adapter.getAnimationState = function(entity){
    return entity && entity.__asgardAnimationState != null
      ? entity.__asgardAnimationState : null;
  };

  adapter.setAnimationSpeed = function(entity, speed){
    if (!entity) return entity;
    entity.__asgardAnimationSpeed = speed == null ? 1 : Number(speed);
    return entity;
  };

  adapter.getAnimationSpeed = function(entity){
    return entity && entity.__asgardAnimationSpeed != null
      ? entity.__asgardAnimationSpeed : null;
  };

  adapter.createEquipmentEntity = function(options){
    adapter.refresh();
    options = options || {};
    if (!pc || !pc.Entity) return null;
    var entity = new pc.Entity(options.name || 'AsgardEquipment');
    entity.__asgardType = 'equipment';
    entity.__asgardSlot = options.slot == null ? null : options.slot;
    entity.__asgardItemId = options.itemId == null ? null : options.itemId;
    entity.__asgardClass = options.className == null ? null : options.className;
    entity.__asgardRarity = options.rarity == null ? null : options.rarity;
    return entity;
  };

  adapter.attachEquipment = function(characterEntity, equipmentEntity, options){
    options = options || {};
    if (!characterEntity || !equipmentEntity) return equipmentEntity;
    if (typeof characterEntity.addChild === 'function') characterEntity.addChild(equipmentEntity);
    equipmentEntity.__asgardEquipmentAnchor = options.anchor == null ? null : options.anchor;
    return equipmentEntity;
  };

  adapter.createWeaponEntity = function(options){
    options = options || {};
    var entity = adapter.createEquipmentEntity({
      name: options.name || 'AsgardWeapon',
      slot: options.slot || 'weapon',
      itemId: options.itemId,
      className: options.className,
      rarity: options.rarity
    });
    if (entity) entity.__asgardWeaponType = options.weaponType == null ? null : options.weaponType;
    return entity;
  };

  adapter.createArmorEntity = function(options){
    options = options || {};
    var entity = adapter.createEquipmentEntity({
      name: options.name || 'AsgardArmor',
      slot: options.slot || 'armor',
      itemId: options.itemId,
      className: options.className,
      rarity: options.rarity
    });
    if (entity) entity.__asgardArmorType = options.armorType == null ? null : options.armorType;
    return entity;
  };

  // V1.01.81 implementation layer. Appearance data is kept as a renderer-neutral
  // descriptor and only mapped to PlayCanvas when explicitly requested. The live
  // Three.js Character Model V2 is never reparented, rebuilt, or modified here.
  adapter.createCharacterAppearance = function(options){
    options = options || {};
    return {
      version: '1.01.81',
      characterId: options.characterId == null ? null : options.characterId,
      gender: options.gender == null ? null : options.gender,
      className: options.className == null ? null : options.className,
      body: options.body && typeof options.body === 'object' ? Object.assign({}, options.body) : {},
      face: options.face && typeof options.face === 'object' ? Object.assign({}, options.face) : {},
      hair: options.hair && typeof options.hair === 'object' ? Object.assign({}, options.hair) : {},
      eyes: options.eyes && typeof options.eyes === 'object' ? Object.assign({}, options.eyes) : {},
      mouth: options.mouth && typeof options.mouth === 'object' ? Object.assign({}, options.mouth) : {},
      skinColor: options.skinColor == null ? null : options.skinColor,
      hairColor: options.hairColor == null ? null : options.hairColor,
      eyeColor: options.eyeColor == null ? null : options.eyeColor,
      metadata: options.metadata && typeof options.metadata === 'object' ? Object.assign({}, options.metadata) : {}
    };
  };

  adapter.setCharacterAppearanceProperty = function(appearance, key, value){
    if (!appearance || !key) return appearance;
    if (key === 'body' || key === 'face' || key === 'hair' || key === 'eyes' || key === 'mouth' || key === 'metadata') {
      appearance[key] = value && typeof value === 'object' ? Object.assign({}, value) : {};
    } else {
      appearance[key] = value;
    }
    return appearance;
  };

  adapter.getCharacterAppearanceProperty = function(appearance, key){
    if (!appearance || !key) return undefined;
    return appearance[key];
  };

  adapter.createHairDescriptor = function(options){
    options = options || {};
    return {
      style: options.style == null ? null : options.style,
      color: options.color == null ? null : options.color,
      length: options.length == null ? null : options.length,
      layer: options.layer == null ? null : options.layer,
      metadata: options.metadata && typeof options.metadata === 'object' ? Object.assign({}, options.metadata) : {}
    };
  };

  adapter.createFaceDescriptor = function(options){
    options = options || {};
    return {
      eyeStyle: options.eyeStyle == null ? null : options.eyeStyle,
      eyeColor: options.eyeColor == null ? null : options.eyeColor,
      mouthStyle: options.mouthStyle == null ? null : options.mouthStyle,
      noseStyle: options.noseStyle == null ? null : options.noseStyle,
      metadata: options.metadata && typeof options.metadata === 'object' ? Object.assign({}, options.metadata) : {}
    };
  };

  adapter.createBodyDescriptor = function(options){
    options = options || {};
    return {
      gender: options.gender == null ? null : options.gender,
      proportions: options.proportions && typeof options.proportions === 'object' ? Object.assign({}, options.proportions) : {},
      skinColor: options.skinColor == null ? null : options.skinColor,
      metadata: options.metadata && typeof options.metadata === 'object' ? Object.assign({}, options.metadata) : {}
    };
  };

  adapter.createCharacterAppearanceBinding = function(characterEntity, appearance){
    return {
      entity: characterEntity || null,
      appearance: appearance || null,
      active: false,
      applied: false
    };
  };

  adapter.applyCharacterAppearance = function(binding){
    // Deliberately no live visual mutation in V1.01.81.
    if (!binding) return false;
    binding.applied = false;
    return false;
  };

  // V1.01.82 implementation layer. Equipment / Weapon / Armor / Wing visual
  // mapping is descriptor-based and explicit-call only. It does not create live
  // visual assets, load resources, or modify the existing Three.js character.
  adapter.createEquipmentVisualMapping = function(options){
    options = options || {};
    return {
      version: '1.01.82',
      slot: options.slot == null ? null : String(options.slot),
      itemId: options.itemId == null ? null : String(options.itemId),
      className: options.className == null ? null : String(options.className),
      rarity: options.rarity == null ? null : String(options.rarity),
      materialTone: options.materialTone == null ? null : options.materialTone,
      glow: options.glow == null ? null : options.glow,
      anchor: options.anchor == null ? null : String(options.anchor),
      visible: options.visible !== false,
      metadata: options.metadata && typeof options.metadata === 'object' ? Object.assign({}, options.metadata) : {}
    };
  };

  adapter.createWeaponVisualMapping = function(options){
    options = options || {};
    var mapping = adapter.createEquipmentVisualMapping(options);
    mapping.type = 'weapon';
    mapping.weaponType = options.weaponType == null ? null : String(options.weaponType);
    mapping.hand = options.hand == null ? null : String(options.hand);
    mapping.dualWield = !!options.dualWield;
    return mapping;
  };

  adapter.createArmorVisualMapping = function(options){
    options = options || {};
    var mapping = adapter.createEquipmentVisualMapping(options);
    mapping.type = 'armor';
    mapping.armorType = options.armorType == null ? null : String(options.armorType);
    mapping.bodyLayer = options.bodyLayer == null ? null : String(options.bodyLayer);
    return mapping;
  };

  adapter.createWingVisualMapping = function(options){
    options = options || {};
    return {
      version: '1.01.82',
      type: 'wing',
      itemId: options.itemId == null ? null : String(options.itemId),
      rarity: options.rarity == null ? null : String(options.rarity),
      wingType: options.wingType == null ? null : String(options.wingType),
      holy: !!options.holy,
      demon: !!options.demon,
      glow: options.glow == null ? null : options.glow,
      anchor: options.anchor == null ? 'back' : String(options.anchor),
      offset: options.offset && typeof options.offset === 'object' ? Object.assign({}, options.offset) : {},
      scale: options.scale && typeof options.scale === 'object' ? Object.assign({}, options.scale) : {},
      visible: options.visible !== false,
      metadata: options.metadata && typeof options.metadata === 'object' ? Object.assign({}, options.metadata) : {}
    };
  };

  adapter.bindEquipmentVisual = function(characterEntity, mapping){
    return {
      entity: characterEntity || null,
      mapping: mapping || null,
      active: false,
      applied: false
    };
  };

  adapter.bindWingVisual = function(characterEntity, mapping){
    return {
      entity: characterEntity || null,
      mapping: mapping || null,
      active: false,
      applied: false
    };
  };

  adapter.applyEquipmentVisualMapping = function(binding){
    // Intentionally descriptor-only in V1.01.82.
    if (!binding) return false;
    binding.applied = false;
    return false;
  };

  adapter.applyWingVisualMapping = function(binding){
    // Intentionally descriptor-only in V1.01.82.
    if (!binding) return false;
    binding.applied = false;
    return false;
  };


  // V1.01.85 implementation layer. UI / Input / Interaction helpers are
  // dormant and explicit-call only. They do not attach listeners to the live
  // game, replace DOM UI, or alter the existing Three.js input flow.
  adapter.createUIOverlayContext = function(options){
    options = options || {};
    return {
      version: '1.01.85',
      type: 'ui-overlay',
      name: options.name == null ? 'AsgardUIOverlay' : String(options.name),
      element: options.element || null,
      enabled: options.enabled !== false,
      visible: options.visible !== false,
      position: options.position && typeof options.position === 'object' ? Object.assign({}, options.position) : {x:0,y:0},
      size: options.size && typeof options.size === 'object' ? Object.assign({}, options.size) : {x:0,y:0},
      zIndex: options.zIndex == null ? 0 : Number(options.zIndex),
      active: false
    };
  };

  adapter.setUIOverlayEnabled = function(overlay, enabled){ if (overlay) overlay.enabled = !!enabled; return overlay; };
  adapter.setUIOverlayVisible = function(overlay, visible){ if (overlay) overlay.visible = !!visible; return overlay; };
  adapter.setUIOverlayPosition = function(overlay, x, y){ if (overlay) overlay.position = {x:Number(x)||0,y:Number(y)||0}; return overlay; };
  adapter.setUIOverlaySize = function(overlay, width, height){ if (overlay) overlay.size = {x:Number(width)||0,y:Number(height)||0}; return overlay; };

  adapter.createInputContext = function(options){
    options = options || {};
    adapter.refresh();
    var keyboard = pc && pc.Keyboard ? new pc.Keyboard(options.keyboardTarget || (typeof window !== 'undefined' ? window : null)) : null;
    var mouse = pc && pc.Mouse ? new pc.Mouse(options.mouseTarget || (typeof window !== 'undefined' ? window : null)) : null;
    return {
      version: '1.01.85',
      keyboard: keyboard,
      mouse: mouse,
      enabled: options.enabled !== false,
      active: false,
      bindings: {},
      listenersAttached: false
    };
  };

  adapter.bindInputAction = function(context, action, binding){
    if (!context || action == null) return context;
    context.bindings[String(action)] = binding || {};
    return context;
  };

  adapter.unbindInputAction = function(context, action){
    if (context && context.bindings && action != null) delete context.bindings[String(action)];
    return context;
  };

  adapter.getInputBinding = function(context, action){
    return context && context.bindings && action != null ? context.bindings[String(action)] : undefined;
  };

  adapter.createInteractionContext = function(options){
    options = options || {};
    return {
      version: '1.01.85',
      enabled: options.enabled !== false,
      active: false,
      input: options.input || null,
      picking: options.picking || null,
      targets: {},
      actions: {}
    };
  };

  adapter.registerInteractionTarget = function(context, id, target){
    if (!context || id == null) return target;
    context.targets[String(id)] = target || {};
    return target;
  };

  adapter.unregisterInteractionTarget = function(context, id){
    if (context && context.targets && id != null) delete context.targets[String(id)];
    return context;
  };

  adapter.registerInteractionAction = function(context, id, action){
    if (!context || id == null) return action;
    context.actions[String(id)] = action || {};
    return action;
  };

  adapter.activateUIOverlay = function(overlay){
    // No live DOM or PlayCanvas UI attachment in V1.01.85.
    if (!overlay) return false;
    overlay.active = false;
    return false;
  };

  adapter.activateInput = function(context){
    // Deliberately does not attach PlayCanvas event listeners yet.
    if (!context) return false;
    context.listenersAttached = false;
    context.active = false;
    return false;
  };

  adapter.activateInteraction = function(context){
    if (!context) return false;
    context.active = false;
    return false;
  };

  // V1.01.86 implementation layer. Audio / Physics / Runtime / Network
  // helpers are passive and explicit-call only. They do not start audio,
  // create physics simulation, schedule runtime work, open sockets, or alter
  // the live Three.js game.
  adapter.createAudioContext = function(options){
    options = options || {};
    adapter.refresh();
    return {
      version: '1.01.86',
      type: 'audio',
      enabled: options.enabled !== false,
      masterVolume: options.masterVolume == null ? 1 : Number(options.masterVolume),
      muted: !!options.muted,
      sounds: {},
      active: false,
      started: false
    };
  };
  adapter.createSound = function(context, options){
    options = options || {};
    return {
      context: context || null,
      id: options.id == null ? '' : String(options.id),
      name: options.name == null ? '' : String(options.name),
      volume: options.volume == null ? 1 : Number(options.volume),
      loop: !!options.loop,
      state: options.state == null ? 'stopped' : String(options.state),
      source: options.source || null,
      active: false
    };
  };
  adapter.setAudioMasterVolume = function(context, value){ if(context) context.masterVolume=Number(value); return context; };
  adapter.setAudioMuted = function(context, muted){ if(context) context.muted=!!muted; return context; };
  adapter.playSound = function(sound){ if(sound) sound.active=false; return false; };
  adapter.stopSound = function(sound){ if(sound) { sound.active=false; sound.state='stopped'; } return sound; };

  adapter.createPhysicsContext = function(options){
    options = options || {};
    adapter.refresh();
    return {
      version: '1.01.86',
      type: 'physics',
      enabled: options.enabled !== false,
      gravity: options.gravity && typeof options.gravity === 'object' ? Object.assign({}, options.gravity) : {x:0,y:-9.8,z:0},
      bodies: [],
      colliders: [],
      active: false,
      simulated: false
    };
  };
  adapter.createPhysicsBody = function(context, options){
    options=options||{};
    return {context:context||null,id:options.id==null?'':String(options.id),type:options.type==null?'static':String(options.type),mass:options.mass==null?0:Number(options.mass),enabled:options.enabled!==false,position:options.position&&typeof options.position==='object'?Object.assign({},options.position):{x:0,y:0,z:0},velocity:options.velocity&&typeof options.velocity==='object'?Object.assign({},options.velocity):{x:0,y:0,z:0}};
  };
  adapter.createCollider = function(context, options){
    options=options||{};
    return {context:context||null,id:options.id==null?'':String(options.id),shape:options.shape==null?'box':String(options.shape),enabled:options.enabled!==false,size:options.size&&typeof options.size==='object'?Object.assign({},options.size):{x:1,y:1,z:1}};
  };
  adapter.addPhysicsBody = function(context, body){ if(context&&body&&!context.bodies.includes(body)) context.bodies.push(body); return body; };
  adapter.addCollider = function(context, collider){ if(context&&collider&&!context.colliders.includes(collider)) context.colliders.push(collider); return collider; };
  adapter.simulatePhysics = function(){ return false; };

  adapter.createRuntimeContext = function(options){
    options=options||{};
    return {version:'1.01.86',type:'runtime',enabled:options.enabled!==false,state:options.state==null?'idle':String(options.state),tickRate:options.tickRate==null?0:Number(options.tickRate),parameters:options.parameters&&typeof options.parameters==='object'?Object.assign({},options.parameters):{},active:false};
  };
  adapter.setRuntimeState = function(context,state){ if(context) context.state=String(state); return context; };
  adapter.setRuntimeParameter = function(context,key,value){ if(context&&key!=null) context.parameters[String(key)]=value; return context; };
  adapter.tickRuntime = function(){ return false; };

  adapter.createNetworkContext = function(options){
    options=options||{};
    return {version:'1.01.86',type:'network',enabled:options.enabled!==false,state:options.state==null?'offline':String(options.state),transport:options.transport==null?'':String(options.transport),endpoint:options.endpoint==null?'':String(options.endpoint),parameters:options.parameters&&typeof options.parameters==='object'?Object.assign({},options.parameters):{},active:false,connected:false};
  };
  adapter.setNetworkState = function(context,state){ if(context) context.state=String(state); return context; };
  adapter.connectNetwork = function(){ return false; };
  adapter.disconnectNetwork = function(context){ if(context) { context.connected=false; context.active=false; context.state='offline'; } return context; };

  // V1.01.87 — PlayCanvas Asset Loading / Resource Management preparation.
  // Resource descriptors and registries only. No network fetch, PlayCanvas
  // asset loading, decoding, replacement, or renderer takeover is performed.
  adapter.createAssetResource = function(options){
    options = options || {};
    return {
      version:'1.01.88', type:'asset-resource',
      id: options.id==null?'':String(options.id),
      url: options.url==null?'':String(options.url),
      typeName: options.typeName==null?'':String(options.typeName),
      state: options.state==null?'declared':String(options.state),
      progress: options.progress==null?0:Number(options.progress),
      enabled: options.enabled!==false, active:false, loaded:false,
      asset:null, dependencies:[]
    };
  };
  adapter.getAssetResourceProperty = function(resource,key){ return resource && key!=null ? resource[String(key)] : undefined; };
  adapter.setAssetResourceProperty = function(resource,key,value){ if(resource&&key!=null) resource[String(key)]=value; return resource; };
  adapter.setAssetResourceState = function(resource,state){ if(resource) resource.state=String(state); return resource; };
  adapter.getAssetResourceState = function(resource){ return resource ? resource.state : undefined; };
  adapter.setAssetResourceProgress = function(resource,value){ if(resource) resource.progress=Math.max(0,Math.min(1,Number(value)||0)); return resource; };
  adapter.getAssetResourceProgress = function(resource){ return resource ? Number(resource.progress)||0 : 0; };
  adapter.addAssetDependency = function(resource,dependency){ if(resource&&dependency&&!resource.dependencies.includes(dependency)) resource.dependencies.push(dependency); return resource; };
  adapter.removeAssetDependency = function(resource,dependency){ if(resource){ var i=resource.dependencies.indexOf(dependency); if(i>=0) resource.dependencies.splice(i,1); } return resource; };
  adapter.getAssetDependencies = function(resource){ return resource ? resource.dependencies.slice() : []; };
  adapter.createAssetRegistry = function(){ return {version:'1.01.88',type:'asset-registry',items:Object.create(null)}; };
  adapter.registerAssetResource = function(registry,resource){ if(registry&&resource) registry.items[resource.id]=resource; return resource; };
  adapter.getAssetResource = function(registry,id){ return registry&&id!=null ? registry.items[String(id)]||null : null; };
  adapter.hasAssetResource = function(registry,id){ return !!(registry&&id!=null&&registry.items[String(id)]); };
  adapter.releaseAssetResource = function(registry,id){ if(registry&&id!=null) delete registry.items[String(id)]; return registry; };
  adapter.clearAssetResources = function(registry){ if(registry) registry.items=Object.create(null); return registry; };
  adapter.requestAssetLoad = function(resource){
    // Deliberately declaration-only in V1.01.87; never fetches or loads.
    if(resource){ resource.state='declared'; resource.active=false; resource.loaded=false; }
    return false;
  };
  adapter.unloadAssetResource = function(resource){ if(resource){ resource.asset=null; resource.loaded=false; resource.state='released'; resource.active=false; } return resource; };
  // V1.01.88 — PlayCanvas Model / Texture / Audio Asset Loader.
  // Explicit-call only. It uses PlayCanvas only when a host has already
  // supplied global.pc and a caller explicitly invokes these loader methods.
  // Nothing is loaded during startup and Three.js remains the active renderer.
  adapter.createAssetLoader = function(options){
    options=options||{};
    return {version:'1.01.88',type:'asset-loader',enabled:options.enabled!==false,active:false,loading:false,loaded:0,total:0,items:[]};
  };
  adapter.getAssetLoaderProperty = function(loader,key){ return loader&&key!=null ? loader[String(key)] : undefined; };
  adapter.setAssetLoaderProperty = function(loader,key,value){ if(loader&&key!=null) loader[String(key)]=value; return loader; };
  adapter.createPlayCanvasAsset = function(options){
    adapter.refresh();
    options=options||{};
    if(!pc || !pc.Asset) return null;
    var id=options.id==null?'':String(options.id);
    var name=options.name==null?id:String(options.name);
    var type=options.type==null?'container':String(options.type);
    var url=options.url==null?'':String(options.url);
    try {
      return new pc.Asset(name,type,url,options.data||{},options.file||undefined);
    } catch(e){ return null; }
  };
  adapter.loadPlayCanvasAsset = function(asset,loader,callback){
    adapter.refresh();
    if(!pc || !pc.Asset || !asset || !pc.app || !pc.app.assets) return false;
    if(loader) { loader.active=true; loader.loading=true; loader.total=Math.max(1,Number(loader.total)||1); }
    try {
      var done=function(err){
        if(loader){ loader.loading=false; loader.active=false; loader.loaded=err?0:1; }
        if(typeof callback==='function') callback(err||null,asset);
      };
      asset.once && asset.once('load',function(){done(null);});
      asset.once && asset.once('error',function(err){done(err||new Error('PlayCanvas asset load failed'));});
      if(!asset.registry) pc.app.assets.add(asset);
      pc.app.assets.load(asset);
      return true;
    } catch(e){
      if(loader){ loader.loading=false; loader.active=false; }
      if(typeof callback==='function') callback(e,asset);
      return false;
    }
  };
  adapter.loadModelAsset = function(url,options,callback){
    options=options||{};
    var asset=adapter.createPlayCanvasAsset({id:options.id,name:options.name||'asgard-model',type:options.type||'container',url:url,data:options.data,file:options.file});
    if(!asset) return false;
    return adapter.loadPlayCanvasAsset(asset,options.loader||null,callback);
  };
  adapter.loadTextureAsset = function(url,options,callback){
    options=options||{};
    var asset=adapter.createPlayCanvasAsset({id:options.id,name:options.name||'asgard-texture',type:'texture',url:url,data:options.data,file:options.file});
    if(!asset) return false;
    return adapter.loadPlayCanvasAsset(asset,options.loader||null,callback);
  };
  adapter.loadAudioAsset = function(url,options,callback){
    options=options||{};
    var asset=adapter.createPlayCanvasAsset({id:options.id,name:options.name||'asgard-audio',type:'audio',url:url,data:options.data,file:options.file});
    if(!asset) return false;
    return adapter.loadPlayCanvasAsset(asset,options.loader||null,callback);
  };
  adapter.unloadPlayCanvasAsset = function(asset){
    adapter.refresh();
    if(!asset) return false;
    try {
      if(pc && pc.app && pc.app.assets && asset.id!=null) pc.app.assets.remove(asset);
      if(typeof asset.unload==='function') asset.unload();
      return true;
    } catch(e){ return false; }
  };

  // V1.01.90 — PlayCanvas Character Model V2 Preview / Creation / Selection mapping layer.
  // Mapping/descriptors only. This does not inspect, rebuild, reparent, or
  // replace the live Character Model V2 hierarchy.
  adapter.createCharacterModelMapping = function(options){
    options=options||{};
    return {
      version:'1.01.90', type:'character-model-v2-mapping',
      assetId: options.assetId==null?'':String(options.assetId),
      modelAsset: options.modelAsset||null,
      root: options.root==null?'Character Model V2':String(options.root),
      body: options.body||null, head: options.head||null,
      hair: options.hair||null, face: options.face||null,
      skeleton: options.skeleton||null, skinning: options.skinning||null,
      appearance: options.appearance||null,
      equipment: options.equipment||null,
      anchors: options.anchors&&typeof options.anchors==='object'?Object.assign({},options.anchors):{},
      active:false, applied:false
    };
  };
  adapter.getCharacterModelMappingProperty=function(mapping,key){ return mapping&&key!=null?mapping[String(key)]:undefined; };
  adapter.setCharacterModelMappingProperty=function(mapping,key,value){ if(mapping&&key!=null) mapping[String(key)]=value; return mapping; };
  adapter.setCharacterModelMappingPart=function(mapping,part,value){ if(mapping&&part!=null) mapping[String(part)]=value; return mapping; };
  adapter.getCharacterModelMappingPart=function(mapping,part){ return mapping&&part!=null?mapping[String(part)]:undefined; };
  adapter.createCharacterModelAssetBinding=function(options){
    options=options||{};
    return {version:'1.01.90',type:'character-model-v2-asset-binding',mapping:options.mapping||null,asset:options.asset||null,entity:options.entity||null,enabled:options.enabled!==false,active:false,bound:false};
  };
  adapter.bindCharacterModelAsset=function(binding,mapping,asset){
    if(binding){ binding.mapping=mapping||binding.mapping||null; binding.asset=asset||binding.asset||null; binding.active=false; binding.bound=false; }
    return binding;
  };
  adapter.unbindCharacterModelAsset=function(binding){ if(binding){ binding.bound=false; binding.active=false; } return binding; };
  adapter.createCharacterModelPartMap=function(options){
    options=options||{};
    return {version:'1.01.90',type:'character-model-v2-part-map',parts:{body:options.body||null,head:options.head||null,hair:options.hair||null,face:options.face||null},anchors:options.anchors&&typeof options.anchors==='object'?Object.assign({},options.anchors):{}};
  };
  adapter.createCharacterModelAssetReference=function(options){
    options=options||{};
    return {version:'1.01.90',type:'character-model-v2-asset-reference',assetId:options.assetId==null?'':String(options.assetId),url:options.url==null?'':String(options.url),typeName:options.typeName==null?'container':String(options.typeName),role:options.role==null?'character-model':String(options.role),resolved:false};
  };
  adapter.resolveCharacterModelAssetReference=function(reference,registry){
    if(reference&&registry&&typeof registry.get==='function') reference.asset=registry.get(reference.assetId)||null;
    if(reference) reference.resolved=!!reference.asset;
    return reference;
  };
  adapter.applyCharacterModelMapping=function(){
    // Intentionally inert in V1.01.90. The live Three.js Character Model V2
    // hierarchy must remain untouched until a later controlled migration step.
    return false;
  };

  // V1.01.90 — PlayCanvas Character Model V2 Preview / Creation / Selection mapping.
  // Descriptor-only. No preview scene is created, no model is rebuilt, and no live
  // Character Model V2 hierarchy is reparented or modified.
  adapter.createCharacterPreviewMapping=function(options){
    options=options||{};
    return {version:'1.01.90',type:'character-preview-mapping',mode:options.mode||'selection',root:options.root||'Character Model V2',asset:options.asset||null,appearance:options.appearance||null,parts:options.parts&&typeof options.parts==='object'?Object.assign({},options.parts):{},anchors:options.anchors&&typeof options.anchors==='object'?Object.assign({},options.anchors):{},active:false,applied:false};
  };
  adapter.setCharacterPreviewMode=function(mapping,mode){ if(mapping) mapping.mode=mode==null?'selection':String(mode); return mapping; };
  adapter.getCharacterPreviewMode=function(mapping){ return mapping?mapping.mode:undefined; };
  adapter.createCharacterCreationPreviewMapping=function(options){
    options=options||{};
    return {version:'1.01.90',type:'character-creation-preview',mode:'creation',slot:options.slot==null?null:options.slot,appearance:options.appearance||null,career:options.career||null,hair:options.hair||null,face:options.face||null,body:options.body||null,active:false,applied:false};
  };
  adapter.createCharacterSelectionPreviewMapping=function(options){
    options=options||{};
    return {version:'1.01.90',type:'character-selection-preview',mode:'selection',slot:options.slot==null?null:options.slot,appearance:options.appearance||null,active:false,applied:false};
  };
  adapter.createCharacterLiveMapping=function(options){
    options=options||{};
    return {version:'1.01.90',type:'character-live-mapping',mode:'live',slot:options.slot==null?null:options.slot,appearance:options.appearance||null,model:options.model||null,active:false,applied:false};
  };
  adapter.linkCharacterPreviewToAppearance=function(mapping,appearance){ if(mapping) mapping.appearance=appearance||null; return mapping; };
  adapter.linkCharacterPreviewToModel=function(mapping,model){ if(mapping) mapping.model=model||null; return mapping; };
  adapter.applyCharacterPreviewMapping=function(){ return false; };
  adapter.applyCharacterCreationPreviewMapping=function(){ return false; };
  adapter.applyCharacterSelectionPreviewMapping=function(){ return false; };
  adapter.applyCharacterLiveMapping=function(){ return false; };

  // V1.01.94 — PlayCanvas Character Model V2 isolated preview instance.
  // Explicit-call only. The instance is detached from the live Three.js game.
  // No CDN loading, renderer switch, or live Character Model V2 reparenting occurs.
  adapter.createIsolatedCharacterPreviewInstance=function(options){
    options=options||{};
    adapter.refresh();
    var instance={version:'1.01.94',type:'playcanvas-isolated-character-preview',id:options.id||('character-preview-'+Date.now()),mode:options.mode||'selection',root:null,parts:{},appearance:options.appearance||null,mapping:options.mapping||null,active:false,attached:false,created:false,destroyed:false};
    if(!(pc&&pc.Entity)) return instance;
    try{
      instance.root=new pc.Entity(instance.id);
      instance.created=true;
      ['body','head','hair','face','equipment','weapon','wing'].forEach(function(part){
        var child=new pc.Entity(part);
        instance.root.addChild(child);
        instance.parts[part]=child;
      });
    }catch(e){
      instance.error=String(e&&e.message||e);
      instance.root=null;
      instance.parts={};
      instance.created=false;
    }
    return instance;
  };
  adapter.setIsolatedCharacterPreviewAppearance=function(instance,appearance){if(instance&&!instance.destroyed)instance.appearance=appearance||null;return instance;};
  adapter.setIsolatedCharacterPreviewMapping=function(instance,mapping){if(instance&&!instance.destroyed)instance.mapping=mapping||null;return instance;};
  adapter.getIsolatedCharacterPreviewPart=function(instance,part){return instance&&instance.parts?instance.parts[String(part)]||null:null;};
  adapter.attachIsolatedCharacterPreview=function(instance,parent){
    if(!instance||instance.destroyed||!instance.root||!parent||typeof parent.addChild!=='function')return false;
    try{parent.addChild(instance.root);instance.attached=true;instance.active=true;return true;}catch(e){return false;}
  };
  adapter.detachIsolatedCharacterPreview=function(instance){
    if(!instance||!instance.root)return false;
    try{if(instance.root.parent)instance.root.parent.removeChild(instance.root);instance.attached=false;instance.active=false;return true;}catch(e){return false;}
  };
  adapter.destroyIsolatedCharacterPreviewInstance=function(instance){
    if(!instance)return false;
    try{
      if(instance.root&&instance.root.parent)instance.root.parent.removeChild(instance.root);
      if(instance.root&&typeof instance.root.destroy==='function')instance.root.destroy();
    }catch(e){}
    instance.root=null;instance.parts={};instance.active=false;instance.attached=false;instance.destroyed=true;
    return true;
  };
  adapter.beginIsolatedCharacterPreviewApplyTransaction=function(instance){
  if(!instance||instance.destroyed)return {ok:false,error:'Invalid preview instance'};
  instance.applyTransaction={
    active:true,
    committed:false,
    rolledBack:false,
    startedAt:Date.now(),
    snapshot:{
      appearance:instance.appearance||null,
      mapping:instance.mapping||null,
      attachedAssets:instance.attachedAssets||{},
      applyResult:instance.applyResult||null,
      sync:instance.sync||null
    }
  };
  return {ok:true,active:true};
};
adapter.commitIsolatedCharacterPreviewApplyTransaction=function(instance){
  if(!instance||!instance.applyTransaction||!instance.applyTransaction.active)return false;
  instance.applyTransaction.active=false;
  instance.applyTransaction.committed=true;
  instance.applyTransaction.committedAt=Date.now();
  return true;
};
adapter.rollbackIsolatedCharacterPreviewApplyTransaction=function(instance){
  if(!instance||!instance.applyTransaction||!instance.applyTransaction.active)return false;
  var snap=instance.applyTransaction.snapshot||{};
  instance.appearance=snap.appearance||null;
  instance.mapping=snap.mapping||null;
  instance.applyResult=snap.applyResult||null;
  instance.sync=snap.sync||null;
  if(instance.attachedAssets&&snap.attachedAssets){
    Object.keys(instance.attachedAssets).forEach(function(part){
      if(snap.attachedAssets[part]!==instance.attachedAssets[part]){
        var old=instance.attachedAssets[part];
        if(old&&old.parent)old.parent.removeChild(old);
      }
    });
    instance.attachedAssets=snap.attachedAssets;
  }
  instance.applyTransaction.active=false;
  instance.applyTransaction.rolledBack=true;
  instance.applyTransaction.rolledBackAt=Date.now();
  return true;
};
adapter.getIsolatedCharacterPreviewApplyTransaction=function(instance){
  if(!instance)return null;
  return instance.applyTransaction||null;
};
adapter.inspectIsolatedCharacterPreviewInstance=function(instance){
    return instance?{version:instance.version,id:instance.id,created:!!instance.created,active:!!instance.active,attached:!!instance.attached,destroyed:!!instance.destroyed,partCount:instance.parts?Object.keys(instance.parts).length:0,hasAppearance:!!instance.appearance,hasMapping:!!instance.mapping,attachedAssets:instance.attachedAssets?Object.assign({},instance.attachedAssets):{}}:null;
  };

  // V1.01.95 — Explicit isolated Preview Asset Attach / Appearance Apply test.
  // Only operates on the isolated PlayCanvas preview instance. No loading/fetching occurs.
  adapter.attachIsolatedCharacterPreviewAsset=function(instance,part,asset){
    if(!instance||instance.destroyed||!instance.parts||!instance.parts[part]||!asset)return false;
    var parent=instance.parts[part], node=null;
    try{
      if(asset instanceof pc.Entity) node=asset;
      else if(asset.resource&&asset.resource instanceof pc.Entity) node=asset.resource;
      else if(asset.resource&&typeof asset.resource.instantiate==='function') node=asset.resource.instantiate();
      else if(typeof asset.instantiate==='function') node=asset.instantiate();
      if(!node||typeof parent.addChild!=='function')return false;
      if(node.parent)node.parent.removeChild(node);
      parent.addChild(node);
      instance.attachedAssets=instance.attachedAssets||{};
      if(instance.attachedAssets[part]&&instance.attachedAssets[part]!==node&&instance.attachedAssets[part].parent){instance.attachedAssets[part].parent.removeChild(instance.attachedAssets[part]);}
      instance.attachedAssets[part]=node;
      return true;
    }catch(e){instance.error=String(e&&e.message||e);return false;}
  };
  adapter.detachIsolatedCharacterPreviewAsset=function(instance,part){
    if(!instance||instance.destroyed)return false;
    var node=instance.attachedAssets&&instance.attachedAssets[part];
    if(!node)return false;
    try{if(node.parent)node.parent.removeChild(node);if(typeof node.destroy==='function')node.destroy();}catch(e){}
    delete instance.attachedAssets[part];
    return true;
  };
  adapter.applyIsolatedCharacterPreviewAppearance=function(instance,appearance){
    if(!instance||instance.destroyed)return false;
    instance.appearance=appearance||null;
    instance.appearanceApplied=true;
    instance.appearanceApplyResult={applied:true,source:appearance&&appearance.source||null,fields:appearance&&appearance.appearance?Object.keys(appearance.appearance).length:0};
    return true;
  };
  adapter.applyIsolatedCharacterPreviewAssetBinding=function(instance,binding,assets){
    if(!instance||instance.destroyed||!binding)return {applied:false,attached:[],missing:[]};
    var map=assets||{}, attached=[], missing=[];
    var refs={model:binding.modelAssetId,body:binding.bodyAssetId,head:binding.headAssetId,hair:binding.hairAssetId,face:binding.faceAssetId,wing:binding.wingAssetId};
    Object.keys(refs).forEach(function(part){
      var id=refs[part];
      if(!id)return;
      var asset=map[id];
      if(!asset){missing.push({part:part,assetId:id});return;}
      if(adapter.attachIsolatedCharacterPreviewAsset(instance,part,asset))attached.push({part:part,assetId:id});
      else missing.push({part:part,assetId:id});
    });
    ['equipment','weapon'].forEach(function(kind){
      var ids=Array.isArray(binding[kind+'AssetIds'])?binding[kind+'AssetIds']:[];
      ids.forEach(function(id,index){var asset=map[id];if(!asset){missing.push({part:kind+index,assetId:id});return;}if(adapter.attachIsolatedCharacterPreviewAsset(instance,kind,asset))attached.push({part:kind,assetId:id});else missing.push({part:kind+index,assetId:id});});
    });
    instance.bindingApplied=attached.length>0||Object.keys(refs).every(function(k){return !refs[k];});
    instance.bindingApplyResult={applied:instance.bindingApplied,attached:attached,missing:missing};
    return instance.bindingApplyResult;
  };
  adapter.getIsolatedCharacterPreviewApplyResult=function(instance){
    return instance?{appearance:instance.appearanceApplyResult||null,binding:instance.bindingApplyResult||null}:null;
  };

  // V1.01.96 — Explicit PlayCanvas Asset Loading for isolated Character Preview.
  // Real loading occurs only when this API is explicitly called. No startup load,
  // no renderer switch, and no live Three.js Character Model V2 mutation.
  adapter.createIsolatedCharacterPreviewAssetLoadRequest=function(options){
    options=options||{};
    return {
      version:'1.01.98',type:'playcanvas-preview-asset-load-request',
      id:options.id==null?'':String(options.id),
      name:options.name||options.id||'asgard-preview-asset',
      type:options.type||'container',url:options.url==null?'':String(options.url),
      part:options.part==null?'':String(options.part),
      state:'requested',progress:0,asset:null,error:null,attached:false,
      startedAt:null,finishedAt:null
    };
  };
  adapter.loadIsolatedCharacterPreviewAsset=function(instance,request,callback){
    adapter.refresh();
    if(!instance||instance.destroyed||!request){
      if(request){request.state='error';request.error='Invalid preview instance or load request';}
      if(typeof callback==='function')callback(new Error(request&&request.error||'Invalid preview instance or load request'),request||null);
      return false;
    }
    if(!pc||!pc.Asset||!pc.app||!pc.app.assets){
      request.state='error';request.error='PlayCanvas application/assets registry unavailable';request.finishedAt=Date.now();
      if(typeof callback==='function')callback(new Error(request.error),request);
      return false;
    }
    if(!request.url){
      request.state='error';request.error='Asset URL is required';request.finishedAt=Date.now();
      if(typeof callback==='function')callback(new Error(request.error),request);
      return false;
    }
    request.state='loading';request.progress=0;request.startedAt=Date.now();request.error=null;
    var asset=null;
    try{
      asset=new pc.Asset(request.name,request.type,request.url,request.data||{},request.file||undefined);
      request.asset=asset;
      var finish=function(err){
        if(err){request.state='error';request.progress=0;request.error=String(err&&err.message||err);}
        else{request.state='loaded';request.progress=1;request.error=null;}
        request.finishedAt=Date.now();
        if(typeof callback==='function')callback(err||null,request);
      };
      if(asset.once){
        asset.once('load',function(){finish(null);});
        asset.once('error',function(err){finish(err||new Error('PlayCanvas asset load failed'));});
      }
      pc.app.assets.add(asset);
      pc.app.assets.load(asset);
      return true;
    }catch(e){
      request.state='error';request.progress=0;request.error=String(e&&e.message||e);request.finishedAt=Date.now();
      if(typeof callback==='function')callback(e,request);
      return false;
    }
  };
  adapter.attachLoadedIsolatedCharacterPreviewAsset=function(instance,request){
    if(!instance||instance.destroyed||!request||request.state!=='loaded'||!request.asset)return false;
    var part=request.part||'body';
    var parent=instance.parts&&instance.parts[part];
    if(!parent)return false;
    var resource=request.asset.resource,node=null;
    try{
      if(resource&&typeof resource.instantiateRenderEntity==='function') node=resource.instantiateRenderEntity();
      else if(resource&&typeof resource.instantiate==='function') node=resource.instantiate();
      else if(request.asset.resource&&request.asset.resource instanceof pc.Entity) node=request.asset.resource;
      if(!node)return false;
      if(node.parent)node.parent.removeChild(node);
      parent.addChild(node);
      instance.attachedAssets=instance.attachedAssets||{};
      if(instance.attachedAssets[part]&&instance.attachedAssets[part]!==node&&instance.attachedAssets[part].parent){instance.attachedAssets[part].parent.removeChild(instance.attachedAssets[part]);}
      instance.attachedAssets[part]=node;
      request.attached=true;
      return true;
    }catch(e){request.error=String(e&&e.message||e);return false;}
  };
  adapter.unloadIsolatedCharacterPreviewAsset=function(request){
    adapter.refresh();
    if(!request)return false;
    try{
      if(request.asset&&pc&&pc.app&&pc.app.assets&&request.asset.id!=null)pc.app.assets.remove(request.asset);
      if(request.asset&&typeof request.asset.unload==='function')request.asset.unload();
    }catch(e){request.error=String(e&&e.message||e);}
    request.asset=null;request.attached=false;request.state='released';request.progress=0;request.finishedAt=Date.now();
    return true;
  };
  adapter.getIsolatedCharacterPreviewAssetLoadState=function(request){
    return request?{version:request.version,id:request.id,name:request.name,type:request.type,url:request.url,part:request.part,state:request.state,progress:Number(request.progress)||0,attached:!!request.attached,error:request.error||null,startedAt:request.startedAt||null,finishedAt:request.finishedAt||null}:null;
  };

  // V1.01.97 — Isolated Preview Asset Instance Lifecycle.
  // Keeps loaded Preview assets explicitly owned and replaceable without touching
  // the live Three.js Character Model V2. No automatic load/attach is introduced.
  adapter.replaceLoadedIsolatedCharacterPreviewAsset=function(instance,request){
    if(!instance||instance.destroyed||!request||request.state!=='loaded'||!request.asset)return false;
    var part=request.part||'body';
    if(!instance.parts||!instance.parts[part])return false;
    try{
      if(instance.attachedAssets&&instance.attachedAssets[part]&&instance.attachedAssets[part].parent){
        var old=instance.attachedAssets[part];
        old.parent.removeChild(old);
        if(typeof old.destroy==='function')old.destroy();
        delete instance.attachedAssets[part];
      }
      request.attached=false;
      return adapter.attachLoadedIsolatedCharacterPreviewAsset(instance,request);
    }catch(e){request.error=String(e&&e.message||e);return false;}
  };
  adapter.releaseIsolatedCharacterPreviewAssetRequest=function(request){
    if(!request)return false;
    if(request.attached)request.attached=false;
    if(request.asset&&pc&&pc.app&&pc.app.assets&&request.asset.id!=null){
      try{pc.app.assets.remove(request.asset);}catch(e){}
    }
    try{if(request.asset&&typeof request.asset.unload==='function')request.asset.unload();}catch(e){request.error=String(e&&e.message||e);}
    request.asset=null;
    request.state='released';
    request.progress=0;
    request.finishedAt=Date.now();
    return true;
  };
  adapter.createIsolatedCharacterPreviewAssetRequestRegistry=function(){
    return {version:'1.01.98',type:'playcanvas-preview-asset-request-registry',items:Object.create(null)};
  };
  adapter.registerIsolatedCharacterPreviewAssetRequest=function(registry,request){
    if(!registry||!registry.items||!request||!request.id)return request;
    registry.items[String(request.id)]=request;
    return request;
  };
  adapter.getIsolatedCharacterPreviewAssetRequest=function(registry,id){
    return registry&&registry.items&&id!=null?registry.items[String(id)]||null:null;
  };
  adapter.hasIsolatedCharacterPreviewAssetRequest=function(registry,id){
    return !!(registry&&registry.items&&id!=null&&Object.prototype.hasOwnProperty.call(registry.items,String(id)));
  };
  adapter.releaseIsolatedCharacterPreviewAssetRequestFromRegistry=function(registry,id){
    if(!registry||!registry.items||id==null)return false;
    var key=String(id),request=registry.items[key];
    if(!request)return false;
    adapter.releaseIsolatedCharacterPreviewAssetRequest(request);
    delete registry.items[key];
    return true;
  };
  adapter.clearIsolatedCharacterPreviewAssetRequestRegistry=function(registry){
    if(!registry||!registry.items)return registry;
    Object.keys(registry.items).forEach(function(key){adapter.releaseIsolatedCharacterPreviewAssetRequest(registry.items[key]);});
    registry.items=Object.create(null);
    return registry;
  };

  // V1.01.98 — Isolated Preview Multi-Part Asset Composition.
  // Explicit-call only. Multiple loaded assets can be composed by body/head/hair/
  // face/equipment/weapon/wing without changing the live Three.js hierarchy.
  adapter.createIsolatedCharacterPreviewComposition=function(options){
    options=options||{};
    return {
      version:'1.01.98',
      type:'playcanvas-preview-multi-part-composition',
      id:options.id||('preview-composition-'+Date.now()),
      order:Array.isArray(options.order)?options.order.slice():['body','head','face','hair','equipment','weapon','wing'],
      parts:{},
      applied:false,
      attached:0,
      missing:[],
      errors:[]
    };
  };
  adapter.setIsolatedCharacterPreviewCompositionPart=function(composition,part,request){
    if(!composition||!part)return composition;
    composition.parts[String(part)]=request||null;
    composition.applied=false;
    return composition;
  };
  adapter.getIsolatedCharacterPreviewCompositionPart=function(composition,part){
    return composition&&composition.parts?composition.parts[String(part)]||null:null;
  };
  adapter.applyIsolatedCharacterPreviewComposition=function(instance,composition){
    if(!instance||instance.destroyed||!composition)return {applied:false,attached:0,missing:[],errors:[]};
    var attached=0,missing=[],errors=[],parts=composition.parts||{};
    (composition.order||Object.keys(parts)).forEach(function(part){
      var request=parts[part];
      if(!request){return;}
      if(request.state!=='loaded'||!request.asset){missing.push({part:part,state:request.state||'unknown',assetId:request.id||null});return;}
      request.part=part;
      try{
        if(adapter.attachLoadedIsolatedCharacterPreviewAsset(instance,request)) attached++;
        else errors.push({part:part,assetId:request.id||null,error:request.error||'Asset attach failed'});
      }catch(e){errors.push({part:part,assetId:request.id||null,error:String(e&&e.message||e)});}
    });
    composition.applied=errors.length===0&&missing.length===0;
    composition.attached=attached;
    composition.missing=missing;
    composition.errors=errors;
    instance.composition=composition;
    return {applied:composition.applied,attached:attached,missing:missing,errors:errors};
  };
  adapter.detachIsolatedCharacterPreviewComposition=function(instance,composition){
    if(!instance||instance.destroyed)return false;
    var parts=composition&&composition.parts?composition.parts:{};
    Object.keys(parts).forEach(function(part){
      var request=parts[part];
      if(request) request.attached=false;
      adapter.detachIsolatedCharacterPreviewAsset(instance,part);
    });
    if(instance.composition)instance.composition.applied=false;
    return true;
  };
  adapter.inspectIsolatedCharacterPreviewComposition=function(composition){
    if(!composition)return null;
    var parts={};
    Object.keys(composition.parts||{}).forEach(function(part){
      var request=composition.parts[part];
      parts[part]=request?adapter.getIsolatedCharacterPreviewAssetLoadState(request):null;
    });
    return {version:composition.version,id:composition.id,order:(composition.order||[]).slice(),parts:parts,applied:!!composition.applied,attached:Number(composition.attached)||0,missing:(composition.missing||[]).slice(),errors:(composition.errors||[]).slice()};
  };
  adapter.clearIsolatedCharacterPreviewComposition=function(instance,composition,releaseRequests){
    if(!composition)return false;
    if(instance)adapter.detachIsolatedCharacterPreviewComposition(instance,composition);
    if(releaseRequests){Object.keys(composition.parts||{}).forEach(function(part){var request=composition.parts[part];if(request)adapter.releaseIsolatedCharacterPreviewAssetRequest(request);});}
    composition.parts={};composition.attached=0;composition.missing=[];composition.errors=[];composition.applied=false;
    if(instance&&instance.composition===composition)instance.composition=null;
    return true;
  };

  // V1.01.99 — Appearance → Asset Mapping → Preview Composition.
  // Explicit-call only. Converts a Character Model V2 appearance/asset binding
  // description into the isolated Preview composition without touching live Three.js.
  adapter.createIsolatedCharacterPreviewAppearanceComposition=function(options){
    options=options||{};
    var composition=adapter.createIsolatedCharacterPreviewComposition({
      id:options.id||('appearance-composition-'+Date.now()),
      order:options.order
    });
    composition.version='1.01.99';
    composition.type='playcanvas-preview-appearance-composition';
    composition.appearance=options.appearance||null;
    composition.binding=options.binding||null;
    composition.assetIds=options.assetIds&&typeof options.assetIds==='object'?Object.assign({},options.assetIds):{};
    return composition;
  };
  adapter.setIsolatedCharacterPreviewAppearanceCompositionAsset=function(composition,part,requestOrAssetId){
    if(!composition||!part)return composition;
    var request=requestOrAssetId;
    if(typeof requestOrAssetId==='string'){
      request=composition.assetRequests&&composition.assetRequests[requestOrAssetId]||null;
      composition.assetIds=composition.assetIds||{};
      composition.assetIds[String(part)]=requestOrAssetId;
    }
    composition.assetRequests=composition.assetRequests||{};
    composition.assetRequests[String(part)]=request||null;
    adapter.setIsolatedCharacterPreviewCompositionPart(composition,part,request);
    return composition;
  };
  adapter.bindIsolatedCharacterPreviewAppearanceComposition=function(composition,appearance,binding,requestRegistry){
    if(!composition)return composition;
    composition.appearance=appearance||composition.appearance||null;
    composition.binding=binding||composition.binding||null;
    var registry=requestRegistry&&requestRegistry.items?requestRegistry.items:{};
    var b=composition.binding||{};
    var refs={
      model:b.modelAssetId,body:b.bodyAssetId,head:b.headAssetId,
      hair:b.hairAssetId,face:b.faceAssetId,wing:b.wingAssetId
    };
    ['model','body','head','hair','face','wing'].forEach(function(part){
      if(refs[part])adapter.setIsolatedCharacterPreviewCompositionPart(composition,part,registry[refs[part]]||null);
    });
    ['equipment','weapon'].forEach(function(part){
      var ids=Array.isArray(b[part+'AssetIds'])?b[part+'AssetIds']:[];
      var request=ids.length?registry[ids[0]]||null:null;
      if(request)adapter.setIsolatedCharacterPreviewCompositionPart(composition,part,request);
    });
    composition.bound=true;
    composition.applied=false;
    return composition;
  };
  adapter.applyIsolatedCharacterPreviewAppearanceComposition=function(instance,composition){
    if(!instance||instance.destroyed||!composition)return {applied:false,attached:0,missing:[],errors:[]};
    var result=adapter.applyIsolatedCharacterPreviewComposition(instance,composition);
    result.version='1.01.99';
    result.type='appearance-composition-apply-result';
    instance.appearanceCompositionResult=result;
    return result;
  };
  adapter.inspectIsolatedCharacterPreviewAppearanceComposition=function(composition){
    if(!composition)return null;
    var base=adapter.inspectIsolatedCharacterPreviewComposition(composition);
    base.version='1.01.99';
    base.type='appearance-composition-inspection';
    base.bound=!!composition.bound;
    base.appearance=composition.appearance||null;
    base.binding=composition.binding||null;
    base.assetIds=Object.assign({},composition.assetIds||{});
    return base;
  };
  adapter.clearIsolatedCharacterPreviewAppearanceComposition=function(instance,composition,releaseRequests){
    if(!composition)return false;
    adapter.clearIsolatedCharacterPreviewComposition(instance,composition,releaseRequests);
    composition.appearance=null;
    composition.binding=null;
    composition.assetIds={};
    composition.assetRequests={};
    composition.bound=false;
    return true;
  };

  // V1.02.00 — Isolated Preview → Character Model V2 Instance Sync Layer.
  // This is an isolated PlayCanvas-side sync descriptor. It never reparents or
  // mutates the live Three.js Character Model V2 hierarchy.
  adapter.createIsolatedCharacterModelV2Sync=function(options){
    options=options||{};
    return {version:'1.02.01',type:'isolated-character-model-v2-sync',id:options.id||('cmv2-sync-'+Date.now()),instance:null,composition:null,appearance:null,mapping:null,parts:{},active:false,applied:false,revision:0};
  };
  adapter.syncIsolatedCharacterPreviewToCharacterModelV2=function(instance,composition,sync){
    if(!instance||instance.destroyed||!sync)return {applied:false,reason:'invalid-instance-or-sync'};
    sync.instance=instance;
    sync.composition=composition||null;
    sync.appearance=composition&&composition.appearance||instance.appearance||null;
    sync.mapping=composition&&composition.binding||null;
    sync.parts={};
    var source=(composition&&composition.assetRequests)||{};
    Object.keys(source).forEach(function(part){
      if(source[part])sync.parts[part]={requestId:source[part].id||null,state:source[part].state||'unknown'};
    });
    sync.active=true;
    sync.applied=true;
    sync.revision++;
    sync.lastResult={version:'1.02.00',applied:true,revision:sync.revision,parts:Object.keys(sync.parts)};
    return sync.lastResult;
  };
  // V1.02.01 — Preview Sync Diff / Apply / Reject validation layer.
  // Validation is descriptor-only and never mutates the live Three.js Character Model V2.
  adapter.validateIsolatedCharacterModelV2Sync=function(instance,composition,sync){
    if(!instance||instance.destroyed||!sync)return {valid:false,reason:'invalid-instance-or-sync',changes:[],missing:[]};
    var expected=(composition&&composition.assetRequests)||{};
    var actual=sync.parts||{};
    var changes=[],missing=[];
    var keys={}; Object.keys(expected).forEach(function(k){keys[k]=true;}); Object.keys(actual).forEach(function(k){keys[k]=true;});
    Object.keys(keys).forEach(function(part){
      var e=expected[part]||null, a=actual[part]||null;
      var eid=e&&e.id||null, aid=a&&a.requestId||null, es=e&&e.state||null, as=a&&a.state||null;
      if(eid!==aid||es!==as)changes.push({part:part,expected:{requestId:eid,state:es},actual:{requestId:aid,state:as}});
      if(eid&&(!a||aid!==eid||as!=='loaded'))missing.push({part:part,requestId:eid,state:as||'missing'});
    });
    var result={version:'1.02.01',valid:changes.length===0&&missing.length===0,changed:changes.length>0,changes:changes,missing:missing,checked:true,revision:sync.revision||0};
    sync.validation=result;
    return result;
  };
  adapter.applyIsolatedCharacterModelV2Sync=function(instance,composition,sync){
    var check=adapter.validateIsolatedCharacterModelV2Sync(instance,composition,sync);
    if(!check.valid){sync.applied=false;sync.lastDecision='rejected';sync.lastResult={version:'1.02.01',applied:false,decision:'rejected',validation:check};return sync.lastResult;}
    sync.applied=true;sync.active=true;sync.lastDecision='applied';sync.revision=(sync.revision||0)+1;
    sync.lastResult={version:'1.02.01',applied:true,decision:'applied',revision:sync.revision,parts:Object.keys(sync.parts||{})};
    return sync.lastResult;
  };
  adapter.rejectIsolatedCharacterModelV2Sync=function(sync,reason){
    if(!sync)return false; sync.applied=false;sync.active=false;sync.lastDecision='rejected';sync.lastResult={version:'1.02.01',applied:false,decision:'rejected',reason:reason||'manual-reject',revision:sync.revision||0};return true;
  };
  adapter.beginIsolatedCharacterModelV2ApplyTransaction=function(instance,composition,sync){
    if(!sync)return {ok:false,error:'Invalid sync'};
    sync.applyTransaction={active:true,committed:false,rolledBack:false,startedAt:Date.now(),snapshot:{active:!!sync.active,applied:!!sync.applied,revision:sync.revision||0,parts:Object.assign({},sync.parts||{}),appearance:sync.appearance||null,mapping:sync.mapping||null,validation:sync.validation||null,lastDecision:sync.lastDecision||null,lastResult:sync.lastResult||null}};
    return {ok:true,active:true};
  };
  adapter.commitIsolatedCharacterModelV2ApplyTransaction=function(sync){
    if(!sync||!sync.applyTransaction||!sync.applyTransaction.active)return false;
    sync.applyTransaction.active=false;sync.applyTransaction.committed=true;sync.applyTransaction.committedAt=Date.now();return true;
  };
  adapter.rollbackIsolatedCharacterModelV2ApplyTransaction=function(sync){
    if(!sync||!sync.applyTransaction||!sync.applyTransaction.active)return false;
    var snap=sync.applyTransaction.snapshot||{};
    sync.active=!!snap.active;sync.applied=!!snap.applied;sync.revision=snap.revision||0;sync.parts=Object.assign({},snap.parts||{});sync.appearance=snap.appearance||null;sync.mapping=snap.mapping||null;sync.validation=snap.validation||null;sync.lastDecision=snap.lastDecision||null;sync.lastResult=snap.lastResult||null;
    sync.applyTransaction.active=false;sync.applyTransaction.rolledBack=true;sync.applyTransaction.rolledBackAt=Date.now();return true;
  };
  adapter.getIsolatedCharacterModelV2ApplyTransaction=function(sync){return sync?sync.applyTransaction||null:null;};
  adapter.inspectIsolatedCharacterModelV2Sync=function(sync){
    if(!sync)return null;
    return {version:'1.02.01',id:sync.id,type:sync.type,active:!!sync.active,applied:!!sync.applied,revision:sync.revision||0,parts:Object.assign({},sync.parts||{}),appearance:sync.appearance||null,mapping:sync.mapping||null,validation:sync.validation||null,lastDecision:sync.lastDecision||null,lastResult:sync.lastResult||null};
  };
  adapter.clearIsolatedCharacterModelV2Sync=function(sync){
    if(!sync)return false;
    sync.instance=null;sync.composition=null;sync.appearance=null;sync.mapping=null;sync.parts={};sync.active=false;sync.applied=false;sync.lastResult=null;sync.revision=(sync.revision||0)+1;
    return true;
  };

  // V1.02.03 — Isolated Character Model V2 Shadow Instance.
  // A shadow descriptor mirrors the validated sync state without touching the live
  // Three.js Character Model V2 hierarchy. It is intended for pre-apply verification.
  adapter.createIsolatedCharacterModelV2ShadowInstance=function(options){
    options=options||{};
    return {version:'1.02.03',type:'isolated-character-model-v2-shadow',id:options.id||('cmv2-shadow-'+Date.now()),sourceSync:null,parts:{},appearance:null,mapping:null,revision:0,active:false,valid:false,createdAt:Date.now(),lastResult:null};
  };
  adapter.buildIsolatedCharacterModelV2ShadowInstance=function(sync,shadow){
    if(!sync||!shadow)return {ok:false,error:'Invalid sync or shadow'};
    shadow.sourceSync=sync.id||null;
    shadow.parts=Object.assign({},sync.parts||{});
    shadow.appearance=sync.appearance||null;
    shadow.mapping=sync.mapping||null;
    shadow.revision=sync.revision||0;
    shadow.active=!!sync.active;
    shadow.valid=!!sync.applied && !!sync.active;
    shadow.lastResult={version:'1.02.03',ok:true,sourceRevision:shadow.revision,parts:Object.keys(shadow.parts),valid:shadow.valid};
    return shadow.lastResult;
  };
  adapter.validateIsolatedCharacterModelV2ShadowInstance=function(shadow){
    if(!shadow)return {valid:false,reason:'Invalid shadow'};
    var missing=[];
    Object.keys(shadow.parts||{}).forEach(function(part){var item=shadow.parts[part]||{};if(item.requestId&&item.state!=='loaded')missing.push({part:part,requestId:item.requestId,state:item.state||'unknown'});});
    var result={version:'1.02.03',valid:!!shadow.active&&!!shadow.valid&&missing.length===0,active:!!shadow.active,missing:missing,revision:shadow.revision||0};
    shadow.lastResult=result;return result;
  };
  adapter.getIsolatedCharacterModelV2ShadowPart=function(shadow,part){return shadow&&shadow.parts?shadow.parts[String(part)]||null:null;};
  adapter.inspectIsolatedCharacterModelV2ShadowInstance=function(shadow){
    if(!shadow)return null;
    return {version:'1.02.03',id:shadow.id,type:shadow.type,sourceSync:shadow.sourceSync,active:!!shadow.active,valid:!!shadow.valid,revision:shadow.revision||0,parts:Object.assign({},shadow.parts||{}),lastResult:shadow.lastResult||null};
  };
  adapter.clearIsolatedCharacterModelV2ShadowInstance=function(shadow){
    if(!shadow)return false;shadow.sourceSync=null;shadow.parts={};shadow.appearance=null;shadow.mapping=null;shadow.active=false;shadow.valid=false;shadow.revision=(shadow.revision||0)+1;shadow.lastResult=null;return true;
  };

  // V1.01.91 — Character Model V2 Appearance Data Bridge.
  // Data mapping only. No automatic file read, fetch, asset creation, or live
  // Character Model V2 mutation is performed here.
  adapter.createCharacterAppearanceDataBridge=function(options){options=options||{};return{version:'1.01.91',type:'character-appearance-data-bridge',source:options.source||'default-character.json',characterId:options.characterId==null?null:options.characterId,gender:options.gender==null?null:options.gender,className:options.className==null?null:options.className,appearance:options.appearance&&typeof options.appearance==='object'?Object.assign({},options.appearance):{},metadata:options.metadata&&typeof options.metadata==='object'?Object.assign({},options.metadata):{},active:false,applied:false};};
  adapter.getCharacterAppearanceDataProperty=function(data,key){return data&&key!=null?data[String(key)]:undefined;};
  adapter.setCharacterAppearanceDataProperty=function(data,key,value){if(data&&key!=null)data[String(key)]=value;return data;};
  adapter.createCharacterAppearanceDataReference=function(options){options=options||{};return{version:'1.01.91',type:'character-appearance-data-reference',source:options.source||'default-character.json',path:options.path||'',characterId:options.characterId==null?null:options.characterId,resolved:false,data:null};};
  adapter.resolveCharacterAppearanceDataReference=function(reference,data){if(reference){reference.data=data||reference.data||null;reference.resolved=!!reference.data;}return reference;};
  adapter.createCharacterAppearanceFieldMap=function(options){options=options||{};return{version:'1.01.91',type:'character-appearance-field-map',fields:options.fields&&typeof options.fields==='object'?Object.assign({},options.fields):{},body:options.body&&typeof options.body==='object'?Object.assign({},options.body):{},face:options.face&&typeof options.face==='object'?Object.assign({},options.face):{},hair:options.hair&&typeof options.hair==='object'?Object.assign({},options.hair):{},colors:options.colors&&typeof options.colors==='object'?Object.assign({},options.colors):{},metadata:options.metadata&&typeof options.metadata==='object'?Object.assign({},options.metadata):{}};};
  adapter.createCharacterAppearanceMappingContext=function(options){options=options||{};return{version:'1.01.91',type:'character-appearance-mapping-context',data:options.data||null,fieldMap:options.fieldMap||null,modelMapping:options.modelMapping||null,previewMapping:options.previewMapping||null,target:options.target||'character',active:false,applied:false};};
  adapter.setCharacterAppearanceMappingContextData=function(context,data){if(context)context.data=data||null;return context;};
  adapter.getCharacterAppearanceMappingContextData=function(context){return context?context.data:null;};
  adapter.setCharacterAppearanceMappingContextTarget=function(context,target){if(context)context.target=target==null?'character':String(target);return context;};
  adapter.getCharacterAppearanceMappingContextTarget=function(context){return context?context.target:undefined;};
  adapter.createCharacterAppearanceSnapshot=function(options){options=options||{};return{version:'1.01.91',type:'character-appearance-snapshot',characterId:options.characterId==null?null:options.characterId,gender:options.gender==null?null:options.gender,className:options.className==null?null:options.className,body:options.body&&typeof options.body==='object'?Object.assign({},options.body):{},face:options.face&&typeof options.face==='object'?Object.assign({},options.face):{},hair:options.hair&&typeof options.hair==='object'?Object.assign({},options.hair):{},colors:options.colors&&typeof options.colors==='object'?Object.assign({},options.colors):{},metadata:options.metadata&&typeof options.metadata==='object'?Object.assign({},options.metadata):{}};};
  adapter.applyCharacterAppearanceDataBridge=function(context){return !!(context&&context.data);};
  adapter.createCharacterAppearanceDataRegistry=function(){return{items:{}};};
  adapter.registerCharacterAppearanceData=function(registry,id,data){if(!registry||id==null)return data;registry.items[String(id)]=data;return data;};
  adapter.getCharacterAppearanceData=function(registry,id){return registry&&id!=null?registry.items[String(id)]||null:null;};
  adapter.hasCharacterAppearanceData=function(registry,id){return !!(registry&&id!=null&&Object.prototype.hasOwnProperty.call(registry.items,String(id)));};
  adapter.releaseCharacterAppearanceData=function(registry,id){if(!registry||id==null)return false;var k=String(id);if(!Object.prototype.hasOwnProperty.call(registry.items,k))return false;delete registry.items[k];return true;};
  adapter.clearCharacterAppearanceData=function(registry){if(registry)registry.items={};return registry;};


  // V1.01.93 — isolated Character Asset Binding validation/test layer.
  // These calls validate supplied references only; they do not load assets or
  // modify the live Three.js Character Model V2.
  adapter.validateCharacterAssetBinding=function(binding,assets){
    var b=binding||{}, a=assets||{}, required=['modelAssetId','bodyAssetId','headAssetId','hairAssetId','faceAssetId','wingAssetId'], resolved={}, missing=[];
    required.forEach(function(k){var id=b[k];if(id){resolved[k]=a[id]||null;if(!resolved[k])missing.push(id);}});
    ['equipmentAssetIds','weaponAssetIds'].forEach(function(k){var ids=Array.isArray(b[k])?b[k]:[];resolved[k]=ids.map(function(id){return a[id]||null;});ids.forEach(function(id,i){if(!resolved[k][i])missing.push(id);});});
    return {valid:missing.length===0,resolved:resolved,missing:missing,checked:true,applied:false};
  };
  adapter.createCharacterAssetBindingTest=function(options){options=options||{};return{version:'1.01.93',type:'character-asset-binding-test',binding:options.binding||null,assets:options.assets&&typeof options.assets==='object'?Object.assign({},options.assets):{},result:null,executed:false,applied:false};};
  adapter.runCharacterAssetBindingTest=function(test){if(!test)return null;test.result=adapter.validateCharacterAssetBinding(test.binding,test.assets);test.executed=true;test.applied=false;return test.result;};

  // Explicitly remains dormant until a later migration phase.
  adapter.activate = function(){
    return false;
  };

  adapter.deactivate = function(){
    adapter.active = false;
    return adapter;
  };

  adapter.refresh();
})(window);

/* V1.02.05 accelerated Character Composition transaction/diff layer */
adapter.createCharacterCompositionSnapshotV205=function(instance){
  if(!instance)return null;
  var snap={version:'1.02.05',parts:{},appearance:instance.appearance||null,mapping:instance.mapping||null};
  ['body','head','hair','face','equipment','weapon','wing'].forEach(function(part){
    snap.parts[part]={attached:!!(instance.attachedAssets&&instance.attachedAssets[part])};
  });
  return snap;
};
adapter.diffCharacterCompositionV205=function(before,after){
  var parts=['body','head','hair','face','equipment','weapon','wing'],changed=[];
  before=before||{parts:{}}; after=after||{parts:{}};
  parts.forEach(function(part){
    var a=before.parts&&before.parts[part]||{},b=after.parts&&after.parts[part]||{};
    if(!!a.attached!==!!b.attached)changed.push(part);
  });
  return {version:'1.02.05',changedParts:changed,changedCount:changed.length,identical:changed.length===0};
};
adapter.beginCharacterCompositionTransactionV205=function(instance){
  if(!instance)return {ok:false,error:'instance unavailable'};
  instance.v205Transaction={active:true,snapshot:adapter.createCharacterCompositionSnapshotV205(instance)};
  return {ok:true,version:'1.02.05'};
};
adapter.rollbackCharacterCompositionTransactionV205=function(instance){
  if(!instance||!instance.v205Transaction)return {ok:false,error:'transaction unavailable'};
  instance.v205Transaction.active=false; instance.v205Transaction.rolledBack=true;
  return {ok:true,restoredSnapshot:instance.v205Transaction.snapshot};
};
adapter.commitCharacterCompositionTransactionV205=function(instance){
  if(!instance||!instance.v205Transaction)return {ok:false,error:'transaction unavailable'};
  instance.v205Transaction.active=false; instance.v205Transaction.committed=true;
  instance.v205Transaction.after=adapter.createCharacterCompositionSnapshotV205(instance);
  instance.v205Transaction.diff=adapter.diffCharacterCompositionV205(instance.v205Transaction.snapshot,instance.v205Transaction.after);
  return {ok:true,diff:instance.v205Transaction.diff};
};
adapter.inspectCharacterCompositionTransactionV205=function(instance){return instance&&instance.v205Transaction||null;};

/* V1.02.04 accelerated Shadow Character composition validation */
adapter.shadowCharacterCompositionV204=function(instance,options){options=options||{};if(!instance)return{ok:false,error:'shadow instance unavailable'};var parts=['body','head','hair','face','equipment','weapon','wing'],result={version:'1.02.04',ok:true,parts:{},appearanceApplied:false,compositionApplied:false,rollbackReady:false};try{result.snapshot=adapter.inspectIsolatedCharacterPreviewInstance?adapter.inspectIsolatedCharacterPreviewInstance(instance):null;result.rollbackReady=!!result.snapshot;parts.forEach(function(part){result.parts[part]={present:!!(instance.parts&&instance.parts[part]),attached:!!(instance.attachedAssets&&instance.attachedAssets[part])};});if(options.appearance&&typeof adapter.applyIsolatedCharacterPreviewAppearance==='function')result.appearanceApplied=!!adapter.applyIsolatedCharacterPreviewAppearance(instance,options.appearance);if(options.binding&&typeof adapter.applyIsolatedCharacterPreviewAssetBinding==='function')result.compositionApplied=!!adapter.applyIsolatedCharacterPreviewAssetBinding(instance,options.binding);result.ok=result.appearanceApplied||result.compositionApplied||(!options.appearance&&!options.binding);}catch(e){result.ok=false;result.error=String(e&&e.message||e)}instance.v204ShadowComposition=result;return result};
adapter.inspectShadowCharacterCompositionV204=function(instance){return instance&&instance.v204ShadowComposition||null};
adapter.clearShadowCharacterCompositionV204=function(instance){if(instance)instance.v204ShadowComposition=null;return true};

/* V1.02.07 accelerated Character Model V2 Preview visual state layer */
adapter.createCharacterPreviewVisualStateV206=function(instance,options){
  options=options||{};
  if(!instance)return null;
  var state={version:'1.02.06',instanceId:instance.id||null,animation:{clip:options.animationClip||'idle',playing:options.animationPlaying!==false,loop:options.animationLoop!==false},equipment:{},materials:{},revision:(instance.v206VisualRevision||0)+1};
  ['body','head','hair','face','equipment','weapon','wing'].forEach(function(part){
    state.equipment[part]={attached:!!(instance.attachedAssets&&instance.attachedAssets[part]),visible:true};
    state.materials[part]={rarity:null,glow:null,holyDemon:null};
  });
  instance.v206VisualState=state; instance.v206VisualRevision=state.revision; return state;
};
adapter.applyCharacterPreviewVisualStateV206=function(instance,state){
  if(!instance||!state)return {ok:false,error:'instance or state unavailable'};
  instance.v206VisualState=JSON.parse(JSON.stringify(state));
  instance.v206VisualState.version='1.02.06';
  instance.v206VisualState.instanceId=instance.id||null;
  instance.v206VisualRevision=(instance.v206VisualRevision||0)+1;
  instance.v206VisualState.revision=instance.v206VisualRevision;
  return {ok:true,version:'1.02.06',revision:instance.v206VisualRevision};
};
adapter.setCharacterPreviewAnimationV206=function(instance,clip,options){
  if(!instance)return {ok:false,error:'instance unavailable'};
  options=options||{}; if(!instance.v206VisualState)adapter.createCharacterPreviewVisualStateV206(instance,options);
  instance.v206VisualState.animation={clip:clip==null?'idle':String(clip),playing:options.playing!==false,loop:options.loop!==false};
  instance.v206VisualRevision=(instance.v206VisualRevision||0)+1; instance.v206VisualState.revision=instance.v206VisualRevision;
  return {ok:true,animation:instance.v206VisualState.animation,revision:instance.v206VisualRevision};
};
adapter.setCharacterPreviewMaterialVisualV206=function(instance,part,options){
  if(!instance||!part)return {ok:false,error:'instance or part unavailable'};
  options=options||{}; if(!instance.v206VisualState)adapter.createCharacterPreviewVisualStateV206(instance,options);
  instance.v206VisualState.materials[part]=Object.assign({},instance.v206VisualState.materials[part]||{},options);
  instance.v206VisualRevision=(instance.v206VisualRevision||0)+1; instance.v206VisualState.revision=instance.v206VisualRevision;
  return {ok:true,part:String(part),material:instance.v206VisualState.materials[part],revision:instance.v206VisualRevision};
};
adapter.inspectCharacterPreviewVisualStateV206=function(instance){return instance&&instance.v206VisualState?JSON.parse(JSON.stringify(instance.v206VisualState)):null;};
adapter.clearCharacterPreviewVisualStateV206=function(instance){if(!instance)return false;instance.v206VisualState=null;instance.v206VisualRevision=(instance.v206VisualRevision||0)+1;return true;};

/* V1.02.18 Preview Checkpoint Stack / Recovery Validation */
adapter.createPreviewCheckpointStackV218=function(instance){
  if(!instance||!instance.created)return {ok:false,error:'preview visual instance unavailable'};
  instance.checkpointsV218=[];
  instance.checkpointSeqV218=0;
  return {ok:true,count:0};
};
adapter.pushPreviewCheckpointV218=function(instance,label){
  if(!instance||!instance.created)return {ok:false,error:'preview visual instance unavailable'};
  if(!instance.checkpointsV218)instance.checkpointsV218=[];
  var checkpoint={id:'cp-'+(++instance.checkpointSeqV218||1),label:label||'checkpoint',revision:instance.revision||0,frame:instance.frame||null,pipeline:instance.commitPipelineV216?JSON.parse(JSON.stringify(instance.commitPipelineV216)):null,createdAt:Date.now()};
  instance.checkpointsV218.push(checkpoint);
  return {ok:true,checkpoint:checkpoint,count:instance.checkpointsV218.length};
};
adapter.restorePreviewCheckpointV218=function(instance,id){
  if(!instance||!instance.checkpointsV218)return {ok:false,error:'checkpoint stack unavailable'};
  var cp=null; for(var i=instance.checkpointsV218.length-1;i>=0;i--){if(instance.checkpointsV218[i].id===id){cp=instance.checkpointsV218[i];break;}}
  if(!cp)return {ok:false,error:'checkpoint not found'};
  if(cp.pipeline)instance.commitPipelineV216=JSON.parse(JSON.stringify(cp.pipeline));
  instance.revision=cp.revision||0; instance.frame=cp.frame||null;
  instance.recoveryV218={status:'restored',checkpointId:cp.id,restoredAt:Date.now()};
  return {ok:true,recovery:instance.recoveryV218};
};
adapter.validatePreviewCheckpointRecoveryV218=function(instance){
  if(!instance)return {ok:false,error:'instance unavailable'};
  var p=instance.commitPipelineV216, r=instance.recoveryV218;
  var ok=!!(r&&r.status==='restored'&&(!p||p.revision===instance.revision));
  return {ok:ok,version:'1.02.18',revision:instance.revision||0,frame:instance.frame||null,pipelineRevision:p?p.revision:null,recovery:r||null};
};
adapter.inspectPreviewCheckpointStackV218=function(instance){
  if(!instance)return null;
  return {version:'1.02.18',count:instance.checkpointsV218?instance.checkpointsV218.length:0,checkpoints:instance.checkpointsV218||[],recovery:instance.recoveryV218||null};
};
adapter.clearPreviewCheckpointStackV218=function(instance){if(!instance)return false;instance.checkpointsV218=[];instance.recoveryV218=null;return true;};


/* V1.02.21 Recovery History Verification */
adapter.beginRecoveryTransactionV219=function(instance,targetId,options){
  if(!instance||!instance.created)return {ok:false,error:'preview visual instance unavailable'};
  options=options||{};
  instance.recoveryTransactionV219={version:'1.02.19',status:'prepared',targetId:targetId||null,
    revision:instance.revision||0,frame:instance.frame||null,startedAt:Date.now(),source:options.source||'preview'};
  return {ok:true,transaction:instance.recoveryTransactionV219};
};
adapter.commitRecoveryTransactionV219=function(instance){
  if(!instance||!instance.recoveryTransactionV219)return {ok:false,error:'recovery transaction unavailable'};
  instance.recoveryTransactionV219.status='committed'; instance.recoveryTransactionV219.committedAt=Date.now();
  return {ok:true,transaction:instance.recoveryTransactionV219};
};
adapter.abortRecoveryTransactionV219=function(instance){
  if(!instance||!instance.recoveryTransactionV219)return {ok:false,error:'recovery transaction unavailable'};
  instance.recoveryTransactionV219.status='aborted'; instance.recoveryTransactionV219.abortedAt=Date.now();
  return {ok:true,transaction:instance.recoveryTransactionV219};
};
adapter.appendPreviewRecoveryAuditV220=function(instance,event,data){
  if(!instance||!instance.created)return false;
  instance.recoveryAuditV220=instance.recoveryAuditV220||[];
  instance.recoveryAuditV220.push({version:'1.02.20',event:event||'unknown',revision:instance.revision||0,
    frame:instance.frame||null,timestamp:Date.now(),data:data||null});
  return true;
};
adapter.inspectPreviewRecoveryAuditV220=function(instance){
  if(!instance)return null;
  return {version:'1.02.20',count:(instance.recoveryAuditV220||[]).length,events:instance.recoveryAuditV220||[]};
};
adapter.clearPreviewRecoveryAuditV220=function(instance){
  if(!instance)return false; instance.recoveryAuditV220=[]; return true;
};
adapter.recordPreviewRecoveryHistoryV221=function(instance,event,data){
  if(!instance||!instance.created)return {ok:false,error:'preview visual instance unavailable'};
  instance.recoveryHistoryV221=instance.recoveryHistoryV221||[];
  var item={version:'1.02.21',event:event||'unknown',revision:instance.revision||0,frame:instance.frame||null,
    timestamp:Date.now(),data:data||null};
  instance.recoveryHistoryV221.push(item);
  return {ok:true,item:item,count:instance.recoveryHistoryV221.length};
};
adapter.verifyPreviewRecoveryHistoryV221=function(instance){
  if(!instance)return {ok:false,error:'instance unavailable'};
  var h=instance.recoveryHistoryV221||[], valid=true, errors=[];
  for(var i=1;i<h.length;i++){ if(h[i].timestamp<h[i-1].timestamp){valid=false;errors.push('timestamp-order');} }
  return {ok:valid,version:'1.02.21',count:h.length,errors:errors,history:h};
};
adapter.inspectPreviewRecoveryHistoryV221=function(instance){
  if(!instance)return null;
  return {version:'1.02.21',count:(instance.recoveryHistoryV221||[]).length,history:instance.recoveryHistoryV221||[]};
};
adapter.clearPreviewRecoveryHistoryV221=function(instance){
  if(!instance)return false; instance.recoveryHistoryV221=[]; return true;
};


/* V1.02.23 Render State Snapshot / Commit / Rollback */
adapter.createPreviewRenderCheckpointV223=function(instance){
  if(!instance||instance.destroyed)return null;
  var snapshot={version:'1.02.23',revision:instance.revision||0,state:instance.state||null,visualUpdate:instance.visualUpdate||null,renderState:instance.renderState||null,bindings:instance.renderBindings||null};
  instance.renderCheckpoint=snapshot;
  return snapshot;
};
adapter.validatePreviewRenderConsistencyV223=function(instance){
  if(!instance)return {ok:false,error:'preview instance unavailable'};
  var b=instance.renderBindings||{};
  var checks={resource:!!b.resource,material:!!b.material,texture:!!b.texture,animation:!!b.animation};
  var ready=!!(instance.renderReadiness&&instance.renderReadiness.ready);
  var ok=ready&&Object.keys(checks).every(function(k){return checks[k]===true;});
  instance.renderConsistency={version:'1.02.23',ok:ok,ready:ready,checks:checks,revision:instance.revision||0};
  return instance.renderConsistency;
};
adapter.commitPreviewRenderCheckpointV223=function(instance){
  var v=adapter.validatePreviewRenderConsistencyV223(instance);
  if(!instance||!v.ok)return {ok:false,status:'rejected',validation:v};
  instance.renderCommit={version:'1.02.23',status:'committed',revision:instance.revision||0,checkpoint:instance.renderCheckpoint||null};
  return {ok:true,status:'committed',revision:instance.revision||0};
};
adapter.rollbackPreviewRenderCheckpointV223=function(instance){
  if(!instance||!instance.renderCheckpoint)return {ok:false,status:'unavailable'};
  var s=instance.renderCheckpoint;
  instance.revision=s.revision||0; instance.state=s.state||null; instance.visualUpdate=s.visualUpdate||null; instance.renderState=s.renderState||null; instance.renderBindings=s.bindings||null;
  instance.renderCommit={version:'1.02.23',status:'rolled-back',revision:instance.revision};
  return {ok:true,status:'rolled-back',revision:instance.revision};
};
adapter.inspectPreviewRenderCheckpointV223=function(instance){
  if(!instance)return null;
  return {version:'1.02.23',checkpoint:instance.renderCheckpoint||null,consistency:instance.renderConsistency||null,commit:instance.renderCommit||null};
};

/* V1.02.24 accelerated Preview Render Resource Lifecycle */
adapter.beginPreviewRenderResourceLifecycleV224=function(instance,resources,options){
  if(!instance||!instance.created)return {ok:false,error:'preview visual instance unavailable'};
  options=options||{}; resources=resources||{};
  var lifecycle={version:'1.02.24',id:'render-resource-'+Date.now(),status:'prepared',resources:resources,bindings:options.bindings||{},revision:instance.revision||0};
  instance.renderResourceLifecycle=lifecycle; return {ok:true,lifecycle:lifecycle};
};
adapter.updatePreviewRenderResourceBindingV224=function(instance,key,binding){
  if(!instance||!instance.renderResourceLifecycle)return {ok:false,error:'render resource lifecycle unavailable'};
  instance.renderResourceLifecycle.bindings=instance.renderResourceLifecycle.bindings||{};
  instance.renderResourceLifecycle.bindings[key]=binding||null;
  instance.renderResourceLifecycle.status='bound';
  return {ok:true,key:key,binding:binding||null};
};
adapter.validatePreviewRenderReadinessV224=function(instance){
  if(!instance||!instance.renderResourceLifecycle)return {ok:false,ready:false,error:'render resource lifecycle unavailable'};
  var l=instance.renderResourceLifecycle, b=l.bindings||{}, required=['material','texture','animation'];
  var missing=required.filter(function(k){return b[k]==null;});
  var ready=missing.length===0;
  l.readiness={version:'1.02.24',ready:ready,missing:missing,revision:instance.revision||0};
  l.status=ready?'ready':'incomplete';
  return {ok:true,ready:ready,missing:missing,readiness:l.readiness};
};
adapter.commitPreviewRenderResourceLifecycleV224=function(instance){
  if(!instance||!instance.renderResourceLifecycle)return {ok:false,error:'render resource lifecycle unavailable'};
  var check=adapter.validatePreviewRenderReadinessV224(instance);
  if(!check.ready)return {ok:false,committed:false,error:'render readiness validation failed',missing:check.missing};
  instance.renderResourceLifecycle.status='committed';
  instance.renderResourceLifecycle.committedRevision=instance.revision||0;
  return {ok:true,committed:true,revision:instance.revision||0};
};
adapter.releasePreviewRenderResourceLifecycleV224=function(instance){
  if(!instance)return false;
  if(instance.renderResourceLifecycle){instance.renderResourceLifecycle.status='released';instance.renderResourceLifecycle.bindings={};}
  instance.renderResourceLifecycle=null;
  return true;
};
adapter.inspectPreviewRenderResourceLifecycleV224=function(instance){
  if(!instance)return null;
  return {version:'1.02.24',lifecycle:instance.renderResourceLifecycle||null};
};


/* V1.02.26 Character Model V2 Render Instance */
adapter.createCharacterModelV2RenderInstanceV226=function(options){
  options=options||{};
  var instance={version:'1.02.26',id:options.id||('cmv2-render-'+Date.now()),created:true,active:false,committed:false,revision:0,parts:{},appearance:null,animation:null,equipment:null,ready:false};
  ['body','head','hair','face','equipment','weapon','wing'].forEach(function(part){instance.parts[part]={bound:false,resource:null,state:null};});
  return instance;
};
adapter.bindCharacterModelV2RenderPartV226=function(instance,part,binding){
  if(!instance||!instance.created||!instance.parts||!instance.parts[part])return false;
  instance.parts[part].bound=!!binding; instance.parts[part].resource=binding||null; instance.revision++; return true;
};
adapter.syncCharacterModelV2RenderStateV226=function(instance,state){
  if(!instance||!instance.created)return {ok:false,error:'instance unavailable'};
  state=state||{}; instance.appearance=state.appearance||instance.appearance; instance.animation=state.animation||instance.animation; instance.equipment=state.equipment||instance.equipment; instance.active=true; instance.revision++; return {ok:true,revision:instance.revision};
};
adapter.validateCharacterModelV2RenderInstanceV226=function(instance){
  if(!instance||!instance.created)return {ok:false,ready:false,error:'instance unavailable'};
  var parts=['body','head','hair','face']; var missing=[]; parts.forEach(function(p){if(!instance.parts[p]||!instance.parts[p].bound)missing.push(p);});
  instance.ready=missing.length===0; return {ok:instance.ready,ready:instance.ready,missing:missing,revision:instance.revision};
};
adapter.commitCharacterModelV2RenderInstanceV226=function(instance){
  var check=adapter.validateCharacterModelV2RenderInstanceV226(instance); if(!check.ready)return {ok:false,committed:false,validation:check}; instance.committed=true; instance.active=true; instance.revision++; return {ok:true,committed:true,revision:instance.revision};
};
adapter.rollbackCharacterModelV2RenderInstanceV226=function(instance){
  if(!instance||!instance.created)return false; instance.committed=false; instance.active=false; instance.ready=false; instance.revision++; return true;
};
adapter.inspectCharacterModelV2RenderInstanceV226=function(instance){
  if(!instance)return null; return {version:'1.02.26',id:instance.id,created:!!instance.created,active:!!instance.active,committed:!!instance.committed,ready:!!instance.ready,revision:instance.revision||0,parts:instance.parts||{}};
};

/* V1.02.28 Accelerated Character Model V2 Render Composition */

(function(){
  function ok(instance){return !!(instance&&instance.created&&!instance.destroyed);}
  function ensure(instance){
    if(!ok(instance)) return false;
    instance.v228=instance.v228||{revision:0,parts:{},resources:{},visual:null,history:[]};
    return true;
  }
  adapter.createCharacterModelV2RenderInstanceV228=function(options){
    options=options||{};
    var i={version:'1.02.28',id:options.id||('cmv2-render-'+Date.now()),created:true,destroyed:false,active:false,parts:{},resources:{},visual:null,revision:0};
    i.v228={revision:0,parts:{},resources:{},visual:null,history:[]};
    ['body','head','hair','face','equipment','weapon','wing'].forEach(function(k){i.parts[k]={bound:false,asset:null,material:null,texture:null,animation:null};});
    return i;
  };
  adapter.bindCharacterModelV2RenderPartV228=function(i,part,data){
    if(!ensure(i)||!i.parts[part])return false;
    data=data||{}; i.parts[part]=Object.assign(i.parts[part],data,{bound:true});
    i.v228.revision++; i.revision=i.v228.revision; i.active=true; return true;
  };
  adapter.bindCharacterModelV2RenderResourcesV228=function(i,resources){
    if(!ensure(i))return false; i.resources=resources||{}; i.v228.resources=i.resources; i.v228.revision++; i.revision=i.v228.revision; return true;
  };
  adapter.applyCharacterModelV2VisualStateV228=function(i,state){
    if(!ensure(i))return false; i.visual=state||{}; i.v228.visual=i.visual; i.v228.revision++; i.revision=i.v228.revision; return true;
  };
  adapter.validateCharacterModelV2RenderV228=function(i){
    if(!ensure(i))return {ok:false,error:'instance unavailable'};
    var keys=['body','head','hair','face','equipment','weapon','wing'], missing=[];
    keys.forEach(function(k){if(!i.parts[k]||!i.parts[k].bound)missing.push(k);});
    return {ok:missing.length===0,version:'1.02.28',revision:i.revision,missing:missing,resourceBound:!!i.resources&&Object.keys(i.resources).length>0,visualBound:!!i.visual};
  };
  adapter.commitCharacterModelV2RenderV228=function(i){
    if(!ensure(i))return {ok:false,error:'instance unavailable'};
    var v=adapter.validateCharacterModelV2RenderV228(i); if(!v.ok)return {ok:false,validation:v};
    i.v228.history.push({revision:i.revision,parts:JSON.parse(JSON.stringify(i.parts)),resources:i.resources,visual:i.visual});
    return {ok:true,version:'1.02.28',revision:i.revision};
  };
  adapter.rollbackCharacterModelV2RenderV228=function(i){
    if(!ensure(i)||!i.v228.history.length)return false;
    var h=i.v228.history[i.v228.history.length-1]; i.parts=JSON.parse(JSON.stringify(h.parts)); i.resources=h.resources; i.visual=h.visual; i.revision=h.revision; i.v228.revision=h.revision; return true;
  };
  adapter.inspectCharacterModelV2RenderV228=function(i){
    if(!i)return null; return {version:'1.02.28',id:i.id,created:!!i.created,active:!!i.active,revision:i.revision||0,parts:i.parts||{},resources:i.resources||{},visual:i.visual||null,history:i.v228&&i.v228.history?i.v228.history.length:0};
  };
  adapter.clearCharacterModelV2RenderV228=function(i){
    if(!ensure(i))return false; i.parts={}; i.resources={}; i.visual=null; i.active=false; i.destroyed=false; i.revision++; i.v228.revision=i.revision; i.v228.history=[]; return true;
  };
})();

/* V1.02.30 unified Character Render Pipeline */
adapter.createCharacterRenderPipelineV230=function(options){
  options=options||{};
  var instance={version:'1.02.30',id:options.id||('character-render-'+Date.now()),instance:options.instance||null,state:options.state||null,revision:0,stage:'created',committed:false,rolledBack:false};
  return instance;
};
adapter.updateCharacterRenderPipelineV230=function(pipeline,payload){
  if(!pipeline)return {ok:false,error:'pipeline unavailable'};
  payload=payload||{};
  pipeline.state=payload.state||pipeline.state||null;
  pipeline.instance=payload.instance||pipeline.instance||null;
  pipeline.resources=payload.resources||pipeline.resources||null;
  pipeline.materials=payload.materials||pipeline.materials||null;
  pipeline.animation=payload.animation||pipeline.animation||null;
  pipeline.appearance=payload.appearance||pipeline.appearance||null;
  pipeline.equipment=payload.equipment||pipeline.equipment||null;
  pipeline.revision=(pipeline.revision||0)+1;
  pipeline.stage='updated';
  pipeline.committed=false; pipeline.rolledBack=false;
  return {ok:true,revision:pipeline.revision,stage:pipeline.stage};
};
adapter.validateCharacterRenderPipelineV230=function(pipeline){
  if(!pipeline)return {ok:false,error:'pipeline unavailable'};
  var checks={instance:!!pipeline.instance,resources:!!pipeline.resources,materials:!!pipeline.materials,animation:!!pipeline.animation,appearance:!!pipeline.appearance,equipment:!!pipeline.equipment};
  var ok=Object.keys(checks).every(function(k){return checks[k];});
  pipeline.validation={ok:ok,checks:checks,revision:pipeline.revision||0};
  pipeline.stage=ok?'validated':'invalid';
  return pipeline.validation;
};
adapter.commitCharacterRenderPipelineV230=function(pipeline){
  var v=adapter.validateCharacterRenderPipelineV230(pipeline);
  if(!v.ok)return {ok:false,stage:'rejected',validation:v};
  pipeline.committed=true; pipeline.rolledBack=false; pipeline.stage='committed'; pipeline.revision=(pipeline.revision||0)+1;
  return {ok:true,stage:pipeline.stage,revision:pipeline.revision};
};
adapter.rollbackCharacterRenderPipelineV230=function(pipeline){
  if(!pipeline)return false;
  pipeline.committed=false; pipeline.rolledBack=true; pipeline.stage='rolled-back'; pipeline.revision=(pipeline.revision||0)+1;
  return true;
};
adapter.inspectCharacterRenderPipelineV230=function(pipeline){
  if(!pipeline)return null;
  return {version:'1.02.30',id:pipeline.id,stage:pipeline.stage,revision:pipeline.revision||0,committed:!!pipeline.committed,rolledBack:!!pipeline.rolledBack,validation:pipeline.validation||null};
};

/* V1.02.29 accelerated Character Model V2 render pipeline */
adapter.createCharacterRenderPipelineV229=function(options){
  options=options||{};
  return {version:'1.02.29',id:options.id||('char-render-'+Date.now()),instance:options.instance||null,state:options.state||null,resources:options.resources||null,bindings:options.bindings||null,ready:false,committed:false,revision:0,checkpoint:null,error:null};
};
adapter.updateCharacterRenderPipelineV229=function(pipeline,payload){
  if(!pipeline)return {ok:false,error:'pipeline unavailable'};
  payload=payload||{}; pipeline.state=payload.state||pipeline.state||null; pipeline.resources=payload.resources||pipeline.resources||null; pipeline.bindings=payload.bindings||pipeline.bindings||null; pipeline.revision=(pipeline.revision||0)+1; pipeline.ready=!!(pipeline.state&&pipeline.resources&&pipeline.bindings); return {ok:true,ready:pipeline.ready,revision:pipeline.revision};
};
adapter.validateCharacterRenderPipelineV229=function(pipeline){
  if(!pipeline)return {ok:false,ready:false,error:'pipeline unavailable'};
  var checks={instance:!!pipeline.instance,state:!!pipeline.state,resources:!!pipeline.resources,bindings:!!pipeline.bindings}; var ready=Object.keys(checks).every(function(k){return checks[k];}); pipeline.ready=ready; return {ok:ready,ready:ready,checks:checks,revision:pipeline.revision||0};
};
adapter.commitCharacterRenderPipelineV229=function(pipeline){
  var v=adapter.validateCharacterRenderPipelineV229(pipeline); if(!v.ok)return {ok:false,committed:false,validation:v}; pipeline.checkpoint={state:pipeline.state,resources:pipeline.resources,bindings:pipeline.bindings,revision:pipeline.revision||0}; pipeline.committed=true; return {ok:true,committed:true,revision:pipeline.revision||0};
};
adapter.rollbackCharacterRenderPipelineV229=function(pipeline){
  if(!pipeline||!pipeline.checkpoint)return false; pipeline.state=pipeline.checkpoint.state; pipeline.resources=pipeline.checkpoint.resources; pipeline.bindings=pipeline.checkpoint.bindings; pipeline.revision=pipeline.checkpoint.revision||pipeline.revision||0; pipeline.committed=false; return true;
};
adapter.inspectCharacterRenderPipelineV229=function(pipeline){
  if(!pipeline)return null; return {version:'1.02.29',id:pipeline.id,ready:!!pipeline.ready,committed:!!pipeline.committed,revision:pipeline.revision||0,hasInstance:!!pipeline.instance,hasState:!!pipeline.state,hasResources:!!pipeline.resources,hasBindings:!!pipeline.bindings,hasCheckpoint:!!pipeline.checkpoint};
};

/* V1.02.31 Character Render Instance Runtime */
adapter.createCharacterRenderRuntimeV231=function(options){
  options=options||{};
  return {version:'1.02.31',id:options.id||('character-runtime-'+Date.now()),instance:options.instance||null,state:options.state||null,frame:0,elapsed:0,delta:0,revision:0,active:false,committed:false,checkpoint:null,validation:null};
};
adapter.updateCharacterRenderRuntimeV231=function(runtime,payload,delta){
  if(!runtime)return {ok:false,error:'runtime unavailable'};
  payload=payload||{}; delta=Number(delta)||0;
  runtime.delta=delta; runtime.elapsed+=(delta>0?delta:0); runtime.frame=(runtime.frame||0)+1;
  if(payload.instance)runtime.instance=payload.instance;
  if(payload.state)runtime.state=payload.state;
  if(payload.appearance)runtime.appearance=payload.appearance;
  if(payload.equipment)runtime.equipment=payload.equipment;
  if(payload.weapon)runtime.weapon=payload.weapon;
  if(payload.wing)runtime.wing=payload.wing;
  if(payload.material)runtime.material=payload.material;
  if(payload.texture)runtime.texture=payload.texture;
  if(payload.animation)runtime.animation=payload.animation;
  runtime.revision=(runtime.revision||0)+1; runtime.active=true; runtime.committed=false;
  return {ok:true,frame:runtime.frame,elapsed:runtime.elapsed,delta:runtime.delta,revision:runtime.revision};
};
adapter.validateCharacterRenderRuntimeV231=function(runtime){
  if(!runtime)return {ok:false,error:'runtime unavailable'};
  var checks={instance:!!runtime.instance,state:!!runtime.state,active:!!runtime.active};
  var ok=Object.keys(checks).every(function(k){return checks[k];});
  runtime.validation={version:'1.02.31',ok:ok,checks:checks,frame:runtime.frame||0,revision:runtime.revision||0};
  return runtime.validation;
};
adapter.commitCharacterRenderRuntimeV231=function(runtime){
  var v=adapter.validateCharacterRenderRuntimeV231(runtime);
  if(!v.ok)return {ok:false,committed:false,validation:v};
  runtime.checkpoint=JSON.parse(JSON.stringify({state:runtime.state,appearance:runtime.appearance,equipment:runtime.equipment,weapon:runtime.weapon,wing:runtime.wing,material:runtime.material,texture:runtime.texture,animation:runtime.animation,frame:runtime.frame,elapsed:runtime.elapsed,delta:runtime.delta,revision:runtime.revision}));
  runtime.committed=true; runtime.active=true; runtime.revision=(runtime.revision||0)+1;
  return {ok:true,committed:true,revision:runtime.revision};
};
adapter.rollbackCharacterRenderRuntimeV231=function(runtime){
  if(!runtime||!runtime.checkpoint)return false;
  var c=runtime.checkpoint;
  runtime.state=c.state; runtime.appearance=c.appearance; runtime.equipment=c.equipment; runtime.weapon=c.weapon; runtime.wing=c.wing; runtime.material=c.material; runtime.texture=c.texture; runtime.animation=c.animation; runtime.frame=c.frame||0; runtime.elapsed=c.elapsed||0; runtime.delta=c.delta||0; runtime.revision=(c.revision||runtime.revision||0)+1; runtime.committed=false;
  return true;
};
adapter.inspectCharacterRenderRuntimeV231=function(runtime){
  if(!runtime)return null;
  return {version:'1.02.31',id:runtime.id,active:!!runtime.active,committed:!!runtime.committed,frame:runtime.frame||0,elapsed:runtime.elapsed||0,delta:runtime.delta||0,revision:runtime.revision||0,validation:runtime.validation||null,state:runtime.state||null,appearance:runtime.appearance||null,equipment:runtime.equipment||null,weapon:runtime.weapon||null,wing:runtime.wing||null,material:runtime.material||null,texture:runtime.texture||null,animation:runtime.animation||null};
};
adapter.clearCharacterRenderRuntimeV231=function(runtime){
  if(!runtime)return false; runtime.state=null; runtime.appearance=null; runtime.equipment=null; runtime.weapon=null; runtime.wing=null; runtime.material=null; runtime.texture=null; runtime.animation=null; runtime.frame=0; runtime.elapsed=0; runtime.delta=0; runtime.revision=(runtime.revision||0)+1; runtime.active=false; runtime.committed=false; runtime.checkpoint=null; runtime.validation=null; return true;
};

/* V1.03.00 integrated Character Model V2 Runtime */
adapter.createCharacterModelV2RuntimeV300=function(options){
  options=options||{};
  return {version:'1.03.00',id:options.id||('cmv2-runtime-'+Date.now()),active:false,committed:false,frame:0,elapsed:0,delta:0,revision:0,appearance:null,parts:{body:null,head:null,hair:null,face:null,equipment:null,weapon:null,wing:null},visual:{material:null,texture:null,animation:null},resource:{bindings:{},status:'idle'},checkpoint:null,validation:null};
};
adapter.updateCharacterModelV2RuntimeV300=function(runtime,payload,delta){
  if(!runtime)return {ok:false,error:'runtime unavailable'};
  payload=payload||{}; delta=Number(delta)||0;
  if(delta<0)delta=0;
  runtime.delta=delta; runtime.elapsed=(runtime.elapsed||0)+delta; runtime.frame=(runtime.frame||0)+1;
  if(payload.appearance!==undefined)runtime.appearance=payload.appearance;
  ['body','head','hair','face','equipment','weapon','wing'].forEach(function(k){if(payload[k]!==undefined)runtime.parts[k]=payload[k];});
  ['material','texture','animation'].forEach(function(k){if(payload[k]!==undefined)runtime.visual[k]=payload[k];});
  if(payload.resource!==undefined)runtime.resource=payload.resource||runtime.resource;
  runtime.revision=(runtime.revision||0)+1; runtime.active=true;
  return {ok:true,version:'1.03.00',frame:runtime.frame,elapsed:runtime.elapsed,delta:runtime.delta,revision:runtime.revision};
};
adapter.validateCharacterModelV2RuntimeV300=function(runtime){
  if(!runtime)return {ok:false,error:'runtime unavailable'};
  var checks={instance:runtime.version==='1.03.00',active:!!runtime.active,parts:!!runtime.parts,visual:!!runtime.visual,resource:!!runtime.resource,frame:runtime.frame>=0,delta:runtime.delta>=0};
  var ok=Object.keys(checks).every(function(k){return !!checks[k];});
  runtime.validation={version:'1.03.00',ok:ok,checks:checks,frame:runtime.frame,revision:runtime.revision};
  return runtime.validation;
};
adapter.commitCharacterModelV2RuntimeV300=function(runtime){
  var v=adapter.validateCharacterModelV2RuntimeV300(runtime); if(!v.ok)return {ok:false,committed:false,validation:v};
  runtime.checkpoint=JSON.parse(JSON.stringify({appearance:runtime.appearance,parts:runtime.parts,visual:runtime.visual,resource:runtime.resource,frame:runtime.frame,elapsed:runtime.elapsed,delta:runtime.delta,revision:runtime.revision}));
  runtime.committed=true; runtime.revision=(runtime.revision||0)+1; return {ok:true,committed:true,revision:runtime.revision};
};
adapter.rollbackCharacterModelV2RuntimeV300=function(runtime){
  if(!runtime||!runtime.checkpoint)return false; var c=runtime.checkpoint;
  runtime.appearance=c.appearance; runtime.parts=c.parts; runtime.visual=c.visual; runtime.resource=c.resource; runtime.frame=c.frame; runtime.elapsed=c.elapsed; runtime.delta=c.delta; runtime.revision=(c.revision||runtime.revision||0)+1; runtime.committed=false; return true;
};
adapter.inspectCharacterModelV2RuntimeV300=function(runtime){
  if(!runtime)return null; return {version:'1.03.00',id:runtime.id,active:!!runtime.active,committed:!!runtime.committed,frame:runtime.frame,elapsed:runtime.elapsed,delta:runtime.delta,revision:runtime.revision,appearance:runtime.appearance,parts:runtime.parts,visual:runtime.visual,resource:runtime.resource,validation:runtime.validation};
};
adapter.clearCharacterModelV2RuntimeV300=function(runtime){
  if(!runtime)return false; runtime.appearance=null; runtime.parts={body:null,head:null,hair:null,face:null,equipment:null,weapon:null,wing:null}; runtime.visual={material:null,texture:null,animation:null}; runtime.resource={bindings:{},status:'idle'}; runtime.frame=0; runtime.elapsed=0; runtime.delta=0; runtime.revision=(runtime.revision||0)+1; runtime.active=false; runtime.committed=false; runtime.checkpoint=null; runtime.validation=null; return true;
};


/* V1.04.00 PlayCanvas Character Model V2 Live Visual Layer */
adapter.createCharacterModelV2LiveInstanceV104=function(options){
  options=options||{};
  var inst={version:'1.04.00',id:options.id||('pc-character-v2-'+Date.now()),created:false,active:false,revision:0,frame:0,parts:{},appearance:null,equipment:null,animation:null,material:null,resources:null,committed:false,history:[]};
  if(!(pc&&pc.Entity)) return inst;
  try{
    inst.root=new pc.Entity(inst.id);
    ['body','head','hair','face','equipment','weapon','wing'].forEach(function(part){var e=new pc.Entity(part);inst.root.addChild(e);inst.parts[part]=e;});
    inst.created=true; inst.active=true;
  }catch(e){inst.error=String(e&&e.message||e);}
  return inst;
};
adapter.updateCharacterModelV2LiveInstanceV104=function(inst,state,dt){
  if(!inst||!inst.created)return {ok:false,error:'character render instance unavailable'};
  state=state||{}; dt=Number(dt)||0;
  inst.frame=(inst.frame||0)+1; inst.revision=(inst.revision||0)+1;
  inst.appearance=state.appearance||inst.appearance; inst.equipment=state.equipment||inst.equipment;
  inst.animation=state.animation||inst.animation; inst.material=state.material||inst.material;
  inst.resources=state.resources||inst.resources; inst.lastDeltaTime=dt; inst.active=true;
  return {ok:true,version:'1.04.00',revision:inst.revision,frame:inst.frame,active:true};
};
adapter.validateCharacterModelV2LiveInstanceV104=function(inst){
  if(!inst)return {ok:false,error:'instance unavailable'};
  var required=['body','head','hair','face','equipment','weapon','wing'],missing=[];
  required.forEach(function(k){if(!inst.parts||!inst.parts[k])missing.push(k);});
  return {ok:!!(inst.created&&missing.length===0),created:!!inst.created,active:!!inst.active,missing:missing,revision:inst.revision||0,frame:inst.frame||0};
};
adapter.commitCharacterModelV2LiveInstanceV104=function(inst){
  var v=adapter.validateCharacterModelV2LiveInstanceV104(inst); if(!v.ok)return {ok:false,validation:v};
  inst.committed=true; inst.history=inst.history||[]; inst.history.push({revision:inst.revision||0,frame:inst.frame||0,at:Date.now()}); return {ok:true,revision:inst.revision,frame:inst.frame};
};
adapter.rollbackCharacterModelV2LiveInstanceV104=function(inst){
  if(!inst)return false; inst.committed=false; inst.active=false; inst.revision=(inst.revision||0)+1; return true;
};
adapter.inspectCharacterModelV2LiveInstanceV104=function(inst){
  if(!inst)return null; return {version:'1.04.00',id:inst.id,created:!!inst.created,active:!!inst.active,committed:!!inst.committed,revision:inst.revision||0,frame:inst.frame||0,parts:Object.keys(inst.parts||{}),appearance:inst.appearance||null,equipment:inst.equipment||null,animation:inst.animation||null,material:inst.material||null,resources:inst.resources||null};
};
adapter.clearCharacterModelV2LiveInstanceV104=function(inst){
  if(!inst)return false; inst.active=false;inst.committed=false;inst.appearance=null;inst.equipment=null;inst.animation=null;inst.material=null;inst.resources=null;inst.revision=(inst.revision||0)+1;return true;
};

/* V1.05.00 Character Model V2 Asset Instance Runtime */
adapter.createCharacterV2AssetInstanceV105=function(options){
  options=options||{};
  var inst={version:'1.05.00',id:options.id||('pc-character-v2-asset-'+Date.now()),created:true,active:false,revision:0,frame:0,parts:{},assets:{},appearance:null,equipment:null,animation:null,material:null,resources:null,bindings:null,committed:false,history:[],lastValidation:null};
  ['body','head','hair','face','equipment','weapon','wing'].forEach(function(p){inst.parts[p]={part:p,bound:false,asset:null,state:null};});
  return inst;
};
adapter.bindCharacterV2AssetV105=function(inst,part,asset,options){
  if(!inst||!inst.created||!inst.parts||!inst.parts[part])return {ok:false,error:'instance or part unavailable'};
  options=options||{}; inst.parts[part].bound=!!asset; inst.parts[part].asset=asset||null; inst.parts[part].state=options.state||null;
  inst.assets[part]=asset||null; inst.revision++; return {ok:true,part:part,revision:inst.revision};
};
adapter.updateCharacterV2AppearanceV105=function(inst,appearance){if(!inst||!inst.created)return false;inst.appearance=appearance||null;inst.revision++;return true;};
adapter.updateCharacterV2EquipmentV105=function(inst,equipment){if(!inst||!inst.created)return false;inst.equipment=equipment||null;inst.revision++;return true;};
adapter.updateCharacterV2AnimationV105=function(inst,animation){if(!inst||!inst.created)return false;inst.animation=animation||null;inst.revision++;return true;};
adapter.updateCharacterV2MaterialV105=function(inst,material){if(!inst||!inst.created)return false;inst.material=material||null;inst.revision++;return true;};
adapter.updateCharacterV2ResourcesV105=function(inst,resources){if(!inst||!inst.created)return false;inst.resources=resources||null;inst.revision++;return true;};
adapter.validateCharacterV2AssetInstanceV105=function(inst){
  if(!inst||!inst.created)return {ok:false,error:'instance unavailable'};
  var missing=[]; Object.keys(inst.parts).forEach(function(p){if(!inst.parts[p].bound)missing.push(p);});
  var result={ok:missing.length===0,version:'1.05.00',revision:inst.revision,missingParts:missing,appearanceBound:!!inst.appearance,equipmentBound:!!inst.equipment,animationBound:!!inst.animation,materialBound:!!inst.material,resourcesBound:!!inst.resources};
  inst.lastValidation=result; return result;
};
adapter.commitCharacterV2AssetInstanceV105=function(inst,label){
  var v=adapter.validateCharacterV2AssetInstanceV105(inst); if(!v.ok)return {ok:false,validation:v};
  inst.committed=true; inst.active=true; inst.history.push({type:'commit',label:label||'character-v2-asset',revision:inst.revision,frame:inst.frame,time:Date.now()}); return {ok:true,revision:inst.revision};
};
adapter.updateCharacterV2AssetInstanceFrameV105=function(inst,dt){if(!inst||!inst.created)return false;inst.frame++;inst.lastDelta=Math.max(0,Number(dt)||0);inst.active=true;return true;};
adapter.rollbackCharacterV2AssetInstanceV105=function(inst){if(!inst||!inst.created)return false;inst.committed=false;inst.active=false;inst.history.push({type:'rollback',revision:inst.revision,frame:inst.frame,time:Date.now()});return true;};
adapter.inspectCharacterV2AssetInstanceV105=function(inst){if(!inst)return null;return {version:'1.05.00',id:inst.id,created:!!inst.created,active:!!inst.active,committed:!!inst.committed,revision:inst.revision||0,frame:inst.frame||0,parts:inst.parts,appearance:inst.appearance,equipment:inst.equipment,animation:inst.animation,material:inst.material,resources:inst.resources,lastValidation:inst.lastValidation,history:inst.history.slice()};};
adapter.clearCharacterV2AssetInstanceV105=function(inst){if(!inst)return false;inst.active=false;inst.committed=false;inst.assets={};inst.appearance=null;inst.equipment=null;inst.animation=null;inst.material=null;inst.resources=null;inst.revision++;return true;};
adapter.version='1.05.00';

/* V1.06.00 Current Character Model V2 Source Bridge
 * Uses the existing procedural Character Model V2 as the source descriptor.
 * No reparenting and no conversion of the live Three.js hierarchy occurs.
 */
adapter.createCurrentCharacterModelV2SourceV106=function(source,options){
  options=options||{};
  var parts=(source&&source.userData&&source.userData.parts)||{};
  var keys=['body','head','hair','face','equipment','weapon','wing'];
  var snapshot={version:'1.06.00',id:options.id||('current-cmv2-source-'+Date.now()),sourceType:'threejs-character-model-v2',liveSource:!!source,characterModelVersion:(source&&source.userData&&source.userData.characterModelVersion)||null,parts:{},appearance:options.appearance||null,equipment:options.equipment||null,animation:options.animation||null,material:options.material||null,revision:0};
  keys.forEach(function(k){snapshot.parts[k]={present:!!parts[k],sourceNode:parts[k]||null};});
  return snapshot;
};
adapter.bindCurrentCharacterModelV2SourceV106=function(instance,source,options){
  if(!instance||!source)return {ok:false,error:'current Character Model V2 source unavailable'};
  var snap=adapter.createCurrentCharacterModelV2SourceV106(source,options);
  instance.currentSource=snap;
  instance.currentSourceRevision=(instance.currentSourceRevision||0)+1;
  instance.revision=(instance.revision||0)+1;
  return {ok:true,revision:instance.revision,sourceRevision:instance.currentSourceRevision,parts:snap.parts};
};
adapter.validateCurrentCharacterModelV2SourceV106=function(source){
  var snap=adapter.createCurrentCharacterModelV2SourceV106(source);
  var missing=[];Object.keys(snap.parts).forEach(function(k){if(!snap.parts[k].present)missing.push(k);});
  return {ok:!!source&&missing.length===0,version:'1.06.00',sourceType:snap.sourceType,characterModelVersion:snap.characterModelVersion,missingParts:missing};
};
adapter.applyCurrentCharacterModelV2SourceToAssetInstanceV106=function(instance,source,options){
  if(!instance||!source)return {ok:false,error:'instance or source unavailable'};
  var validation=adapter.validateCurrentCharacterModelV2SourceV106(source);
  if(!validation.ok)return {ok:false,validation:validation};
  var snap=adapter.createCurrentCharacterModelV2SourceV106(source,options);
  instance.currentSource=snap;
  instance.sourceMode='current-procedural-character-model-v2';
  instance.revision=(instance.revision||0)+1;
  instance.lastSourceApply={version:'1.06.00',revision:instance.revision,parts:Object.keys(snap.parts),time:Date.now()};
  return {ok:true,revision:instance.revision,sourceMode:instance.sourceMode,validation:validation};
};
adapter.inspectCurrentCharacterModelV2SourceV106=function(instance){
  if(!instance)return null;
  return {version:'1.06.00',id:instance.id||null,sourceMode:instance.sourceMode||null,sourceRevision:instance.currentSourceRevision||0,currentSource:instance.currentSource||null,lastSourceApply:instance.lastSourceApply||null};
};


/* V1.07.00 Chase Character Asset Test Bridge
 * Explicitly loads the user-provided scene.gltf into an isolated PlayCanvas instance.
 * No automatic startup loading and no modification/reparenting of the live Three.js model.
 */
adapter.createChaseCharacterAssetTestV107=function(options){
  options=options||{};
  return {version:'1.07.00',id:options.id||('chase-character-test-'+Date.now()),url:options.url||'test-assets/chase/scene.gltf',state:'idle',asset:null,instance:null,parts:{},error:null,revision:0};
};
adapter.loadChaseCharacterAssetTestV107=function(test,options){
  options=options||{};
  if(!test)return {ok:false,error:'chase test instance unavailable'};
  adapter.refresh();
  if(!(pc&&pc.Asset))return {ok:false,error:'PlayCanvas Asset API unavailable'};
  var url=options.url||test.url||'test-assets/chase/scene.gltf';
  test.url=url; test.state='loading'; test.revision=(test.revision||0)+1;
  try{
    var asset=new pc.Asset(test.id+'-asset','container',{url:url});
    test.asset=asset;
    asset.once('load',function(){test.state='loaded';test.revision=(test.revision||0)+1;});
    asset.once('error',function(err){test.state='error';test.error=String(err||'asset load error');test.revision=(test.revision||0)+1;});
    if(pc.app&&pc.app.assets)pc.app.assets.add(asset);
    if(pc.app&&pc.app.assets)pc.app.assets.load(asset);
    else if(pc.app&&typeof pc.app.assets==='object'&&pc.app.assets.load)pc.app.assets.load(asset);
    return {ok:true,state:test.state,url:url,id:asset.id};
  }catch(e){test.state='error';test.error=String(e&&e.message||e);return {ok:false,error:test.error};}
};
adapter.inspectChaseCharacterAssetTestV107=function(test){
  if(!test)return null;
  return {version:'1.07.00',id:test.id,url:test.url,state:test.state,revision:test.revision||0,assetId:test.asset?test.asset.id:null,error:test.error||null};
};
adapter.releaseChaseCharacterAssetTestV107=function(test){
  if(!test)return false;
  try{if(test.asset&&pc&&pc.app&&pc.app.assets){if(test.asset.resource&&test.asset.resource.destroy)test.asset.resource.destroy();pc.app.assets.remove(test.asset);}}catch(e){}
  test.asset=null;test.instance=null;test.state='released';test.revision=(test.revision||0)+1;return true;
};

/* V1.01.06 — Character Transform / Walk Sync Bridge
 * Passive mirror only. The live Three.js Character Model V2 remains visible
 * and authoritative. This layer never hides/reparents/rebuilds that model.
 */
adapter.createCharacterTransformSyncV106=function(application,options){
  options=options||{};
  if(!application||!pc||!pc.Entity)return {ok:false,error:'PlayCanvas application unavailable'};
  try{
    var entity=new pc.Entity(options.name||'AsgardCharacterTransformMirror');
    entity.__asgardType='character-transform-mirror';
    entity.__asgardVisible=false;
    application.root.addChild(entity);
    entity.enabled=false;
    return {ok:true,version:'1.06.00',entity:entity,active:false,frame:0,lastSync:0,lastState:null,error:null};
  }catch(e){return {ok:false,error:String(e&&e.message||e)};}
};
adapter.syncCharacterTransformV106=function(sync,source,options){
  options=options||{};
  if(!sync||!sync.entity||!source)return {ok:false,error:'character transform source unavailable'};
  try{
    var p=source.position, r=source.rotation, s=source.scale;
    if(!p||!r)return {ok:false,error:'character transform invalid'};
    sync.entity.setPosition(Number(p.x)||0,Number(p.y)||0,Number(p.z)||0);
    sync.entity.setEulerAngles((Number(r.x)||0)*180/Math.PI,(Number(r.y)||0)*180/Math.PI,(Number(r.z)||0)*180/Math.PI);
    if(s)sync.entity.setLocalScale(Number(s.x)||1,Number(s.y)||1,Number(s.z)||1);
    var moving=!!options.moving;
    sync.frame=(sync.frame||0)+1; sync.lastSync=Date.now(); sync.lastState={moving:moving,action:moving?'walk':'idle',speed:Number(options.speed)||0,x:Number(p.x)||0,y:Number(p.y)||0,z:Number(p.z)||0,ry:Number(r.y)||0};
    sync.active=true; sync.error=null;
    return {ok:true,version:'1.06.00',frame:sync.frame,state:sync.lastState};
  }catch(e){sync.error=String(e&&e.message||e);return {ok:false,error:sync.error};}
};

/* V1.01.08 — Character Weapon / Attack State Sync
 * Passive mirror only. The existing Three.js Character Model V2 remains
 * authoritative and visible. PlayCanvas receives equipment/weapon state and
 * attack timeline data for the next renderer migration stage.
 */
adapter.createCharacterWeaponAttackSyncV108=function(application,options){
  options=options||{};
  if(!application||!pc||!pc.Entity)return {ok:false,error:'PlayCanvas application unavailable'};
  try{
    var root=new pc.Entity(options.name||'AsgardCharacterWeaponAttackMirror');
    root.__asgardType='character-weapon-attack-mirror';
    // V1.01.16: PlayCanvas weapon visuals are enabled by default. F10 remains
    // an emergency fallback to the original Three.js weapon visuals.
    root.enabled=options.visible!==false;
    var right=new pc.Entity('WeaponMountR');
    var left=new pc.Entity('WeaponMountL');
    var attack=new pc.Entity('AttackState');
    root.addChild(right); root.addChild(left); root.addChild(attack);
    application.root.addChild(root);
    return {ok:true,version:'1.01.08',entity:root,weaponR:right,weaponL:left,attack:attack,active:false,frame:0,lastSync:0,lastState:null,error:null,visualTestV115:true,visualMirrorR:null,visualMirrorL:null,visualSourceR:null,visualSourceL:null,app:application};
  }catch(e){return {ok:false,error:String(e&&e.message||e)};}
};
/* V1.01.16 — mirror the actual Character Model V2 held-weapon meshes into PlayCanvas. */
adapter._syncHeldVisualTreeV116=function(sync,sourceRoot,pcParent,key){
  if(!sync||!sourceRoot||!pcParent||!pc)return null;
  try{
    var srcChildren=sourceRoot.children||[];
    var mirror=sync[key];
    var side=key==='visualMirrorR'?'R':'L';
    var sig=srcChildren.map(function(o){return o.uuid||o.name||'';}).join('|');
    if(!mirror||sync['visualSource'+side]!==sig){
      if(mirror&&mirror.destroy)mirror.destroy();
      mirror=new pc.Entity('HeldWeaponVisual'+side); pcParent.addChild(mirror); sync[key]=mirror; sync['visualSource'+side]=sig;
      var device=sync.app&&sync.app.graphicsDevice;
      var build=function(src,dst){
        (src.children||[]).forEach(function(ch){
          var e=new pc.Entity(ch.name||'WeaponPart'); dst.addChild(e);
          e.__asgardSourceUUID=ch.uuid||null;
          if(ch.isMesh&&ch.geometry&&device){
            var mesh=adapter._pcGeometry(device,ch.geometry), mat=adapter._pcMaterial(device,ch.material);
            if(mesh&&mat){e.addComponent('render',{type:'asset'});e.render.meshInstances=[new pc.MeshInstance(mesh,mat)];}
          }
          build(ch,e);
        });
      };
      build(sourceRoot,mirror);
    }
    var syncTree=function(src,dst){
      if(!src||!dst)return;
      var p=src.position,r=src.rotation,sc=src.scale;
      if(p)dst.setLocalPosition(Number(p.x)||0,Number(p.y)||0,Number(p.z)||0);
      if(r)dst.setLocalEulerAngles((Number(r.x)||0)*180/Math.PI,(Number(r.y)||0)*180/Math.PI,(Number(r.z)||0)*180/Math.PI);
      if(sc)dst.setLocalScale(Number(sc.x)||1,Number(sc.y)||1,Number(sc.z)||1);
      var byId={};(dst.children||[]).forEach(function(c){if(c.__asgardSourceUUID)byId[c.__asgardSourceUUID]=c;});
      (src.children||[]).forEach(function(ch){var d=byId[ch.uuid];if(d)syncTree(ch,d);});
    };
    syncTree(sourceRoot,mirror); return mirror;
  }catch(e){sync.error=String(e&&e.message||e);return null;}
};

adapter.syncCharacterWeaponAttackV108=function(sync,source,options){
  options=options||{};
  if(!sync||!sync.entity||!source)return {ok:false,error:'weapon/attack source unavailable'};
  try{
    var parts=(source.userData&&source.userData.parts)||{};
    var eq=options.equipment||{};
    var weapon=eq.weapon||null, offhand=eq.offhand||null;
    var attackState=options.attack||{};
    var wr=parts.weaponMountR, wl=parts.weaponMountL;
    var sourceR=parts.weaponVisualRootR, sourceL=parts.weaponVisualRootL;
    if(sourceR)adapter._syncHeldVisualTreeV116(sync,sourceR,sync.weaponR,'visualMirrorR');
    if(sourceL)adapter._syncHeldVisualTreeV116(sync,sourceL,sync.weaponL,'visualMirrorL');
    sync.sourceWeaponRootR=sourceR||sync.sourceWeaponRootR||null; sync.sourceWeaponRootL=sourceL||sync.sourceWeaponRootL||null;
    // V1.01.15: synchronize the mirror root to the same world transform as
    // Character Model V2. This is a visual-only bridge; gameplay remains Three.js-authoritative.
    var pp=source.position, rr=source.rotation;
    if(pp&&sync.entity) sync.entity.setPosition(Number(pp.x)||0,Number(pp.y)||0,Number(pp.z)||0);
    if(rr&&sync.entity) sync.entity.setEulerAngles(0,(Number(rr.y)||0)*180/Math.PI,0);
    if(wr&&sync.weaponR){sync.weaponR.setLocalPosition(Number(wr.position.x)||0,Number(wr.position.y)||0,Number(wr.position.z)||0);sync.weaponR.setLocalEulerAngles((Number(wr.rotation.x)||0)*180/Math.PI,(Number(wr.rotation.y)||0)*180/Math.PI,(Number(wr.rotation.z)||0)*180/Math.PI);}
    if(wl&&sync.weaponL){sync.weaponL.setLocalPosition(Number(wl.position.x)||0,Number(wl.position.y)||0,Number(wl.position.z)||0);sync.weaponL.setLocalEulerAngles((Number(wl.rotation.x)||0)*180/Math.PI,(Number(wl.rotation.y)||0)*180/Math.PI,(Number(wl.rotation.z)||0)*180/Math.PI);}
    sync.frame=(sync.frame||0)+1; sync.lastSync=Date.now();
    sync.lastState={
      weaponId:weapon&&weapon.id||null, weaponName:weapon&&weapon.name||null,
      weaponFamily:weapon&&weapon.family||null, offhandId:offhand&&offhand.id||null,
      offhandName:offhand&&offhand.name||null, offhandFamily:offhand&&offhand.family||null,
      weaponVisible:!!(parts.weaponVisualRootR&&parts.weaponVisualRootR.visible),
      offhandVisible:!!(parts.weaponVisualRootL&&parts.weaponVisualRootL.visible),
      attacking:!!attackState.active, attackType:attackState.type||null,
      attackTime:Number(attackState.t)||0, attackDuration:Number(attackState.duration)||0,
      moving:!!options.moving, speed:Number(options.speed)||0
    };
    var usePcVisuals=sync.visualTestV115!==false && !!sync.entity.enabled;
    if(sourceR)sourceR.visible=!usePcVisuals; if(sourceL)sourceL.visible=!usePcVisuals;
    if(sync.visualMirrorR)sync.visualMirrorR.enabled=usePcVisuals; if(sync.visualMirrorL)sync.visualMirrorL.enabled=usePcVisuals;
    sync.active=true; sync.error=null;
    return {ok:true,version:'1.01.08',frame:sync.frame,state:sync.lastState};
  }catch(e){sync.error=String(e&&e.message||e);return {ok:false,error:sync.error};}
};

/* V1.01.10 Character Weapon / Attack Timeline Bridge
 * Keep the existing V1.01.08 equipment mirror intact, while exposing a
 * renderer-neutral attack phase for the next visible PlayCanvas weapon stage.
 */
adapter.syncCharacterAttackTimelineV110=function(sync,source,options){
  options=options||{};
  if(!sync||!source)return {ok:false,error:'attack timeline source unavailable'};
  try{
    var a=options.attack||{};
    var duration=Math.max(.001,Number(a.duration)||.001);
    var t=Math.max(0,Number(a.t)||0);
    var phase=Math.max(0,Math.min(1,t/duration));
    var active=!!a.active;
    var segment='idle';
    if(active){
      if(phase<.34) segment='windup';
      else if(phase<.66) segment='strike';
      else segment='recover';
    }
    var family=(options.weaponFamily||null);
    sync.attackTimelineV110={version:'1.01.10',active:active,type:a.type||null,t:t,duration:duration,phase:phase,segment:segment,weaponFamily:family,moving:!!options.moving,speed:Number(options.speed)||0,updatedAt:Date.now()};
    if(sync.attack) sync.attack.__asgardAttackTimeline=sync.attackTimelineV110;
    sync.timelineFrame=(sync.timelineFrame||0)+1;
    return {ok:true,version:'1.01.10',frame:sync.timelineFrame,timeline:sync.attackTimelineV110};
  }catch(e){sync.error=String(e&&e.message||e);return {ok:false,error:sync.error};}
};

/* V1.01.18 — Character visual/animation bridge extension.
 * Keeps the V1.01.17 Character Model V2 hierarchy authoritative while exposing
 * a renderer-neutral visual state for idle/walk/attack.
 */
adapter.syncCharacterVisualStateV118=function(sync,state){
  if(!sync)return {ok:false,error:'character visual sync unavailable'};
  state=state||{};
  var attack=state.attack||{};
  var segment='idle';
  if(attack.active){
    var duration=Math.max(.001,Number(attack.duration)||.6);
    var phase=Math.max(0,Math.min(1,(Number(attack.t)||0)/duration));
    segment=phase<.34?'windup':(phase<.66?'strike':'recover');
  }else if(state.moving){ segment='walk'; }
  sync.animationStateV118={segment:segment,moving:!!state.moving,speed:Number(state.speed)||0,attackActive:!!attack.active,updatedAt:Date.now()};
  return {ok:true,version:'1.01.18',state:sync.animationStateV118};
};

/* V1.01.17 — Character Model V2 body / class-equipment visual integration.
 * Mirrors the CURRENT live Character Model V2 hierarchy into PlayCanvas. The
 * Three.js model remains the source of truth; PlayCanvas receives the same
 * geometry, materials, transforms, visibility and equipment composition.
 */
adapter.createCharacterVisualIntegrationV117=function(application,options){
  options=options||{};
  if(!application||!pc||!pc.Entity)return {ok:false,error:'PlayCanvas application unavailable'};
  try{
    var root=new pc.Entity(options.name||'AsgardCharacterVisualV117');
    root.__asgardType='character-visual-v117';
    root.enabled=options.visible!==false;
    application.root.addChild(root);
    return {ok:true,version:'1.01.17',entity:root,app:application,active:false,visible:root.enabled,frame:0,signature:null,error:null,lastState:null};
  }catch(e){return {ok:false,error:String(e&&e.message||e)};}
};
adapter._characterVisualSignatureV117=function(source){
  var out=[];
  function walk(n){ if(!n)return; out.push((n.uuid||n.name||'')+':'+(n.children?n.children.length:0)+':'+(n.isMesh?'m':'')); (n.children||[]).forEach(walk); }
  walk(source); return out.join('|');
};
adapter._buildCharacterVisualTreeV117=function(sync,source){
  var device=sync.app&&sync.app.graphicsDevice, root=sync.entity;
  if(!device||!root||!source)return false;
  while(root.children.length)root.removeChild(root.children[0]);
  var build=function(src,parent){
    (src.children||[]).forEach(function(ch){
      var e=new pc.Entity(ch.name||'CharacterPart');
      e.__asgardSourceUUID=ch.uuid||null;
      parent.addChild(e);
      if(ch.isMesh&&ch.geometry){
        var mesh=adapter._pcGeometry(device,ch.geometry), mat=adapter._pcMaterial(device,ch.material);
        if(mesh&&mat){ e.addComponent('render',{type:'asset'}); e.render.meshInstances=[new pc.MeshInstance(mesh,mat)]; }
      }
      build(ch,e);
    });
  };
  build(source,root); sync.signature=_characterVisualSignatureV117(source); return true;
};
adapter._syncCharacterVisualTreeV117=function(source,dst){
  if(!source||!dst)return;
  var p=source.position,r=source.rotation,sc=source.scale;
  if(p)dst.setLocalPosition(Number(p.x)||0,Number(p.y)||0,Number(p.z)||0);
  if(r)dst.setLocalEulerAngles((Number(r.x)||0)*180/Math.PI,(Number(r.y)||0)*180/Math.PI,(Number(r.z)||0)*180/Math.PI);
  if(sc)dst.setLocalScale(Number(sc.x)||1,Number(sc.y)||1,Number(sc.z)||1);
  dst.enabled=source.visible!==false;
  var byId={}; (dst.children||[]).forEach(function(c){if(c.__asgardSourceUUID)byId[c.__asgardSourceUUID]=c;});
  (source.children||[]).forEach(function(ch){var d=byId[ch.uuid];if(d)adapter._syncCharacterVisualTreeV117(ch,d);});
};
adapter.syncCharacterVisualIntegrationV117=function(sync,source,options){
  options=options||{};
  if(!sync||!sync.entity||!source)return {ok:false,error:'character visual source unavailable'};
  try{
    var sig=adapter._characterVisualSignatureV117(source);
    if(sync.signature!==sig)adapter._buildCharacterVisualTreeV117(sync,source);
    var pp=source.position,rr=source.rotation,ss=source.scale;
    if(pp)sync.entity.setPosition(Number(pp.x)||0,Number(pp.y)||0,Number(pp.z)||0);
    if(rr)sync.entity.setEulerAngles((Number(rr.x)||0)*180/Math.PI,(Number(rr.y)||0)*180/Math.PI,(Number(rr.z)||0)*180/Math.PI);
    if(ss)sync.entity.setLocalScale(Number(ss.x)||1,Number(ss.y)||1,Number(ss.z)||1);
    sync._syncCharacterVisualTreeV117(source,sync.entity);
    sync.frame=(sync.frame||0)+1; sync.active=true; sync.visible=!!sync.entity.enabled; sync.lastState={classId:options.classId||null,level:Number(options.level)||1,hairStyle:options.hairStyle||null,armor:options.armor||null,helmet:options.helmet||null,cloak:options.cloak||null,weapon:options.weapon||null,offhand:options.offhand||null,moving:!!options.moving,attack:options.attack||null}; sync.error=null;
    return {ok:true,version:'1.01.17',frame:sync.frame,state:sync.lastState};
  }catch(e){sync.error=String(e&&e.message||e);return {ok:false,error:sync.error};}
};
adapter.setCharacterVisualIntegrationV117=function(sync,visible){
  if(!sync||!sync.entity)return {ok:false,error:'character visual integration unavailable'};
  sync.entity.enabled=!!visible; sync.visible=!!visible; return {ok:true,version:'1.01.17',visible:!!visible};
};
adapter.inspectCharacterVisualIntegrationV117=function(sync){
  if(!sync)return null; return {version:'1.01.17',active:!!sync.active,visible:!!(sync.entity&&sync.entity.enabled),frame:sync.frame||0,signature:sync.signature||null,state:sync.lastState||null,error:sync.error||null};
};

adapter.inspectCharacterAttackTimelineV110=function(sync){
  if(!sync)return null;
  return {version:'1.01.10',frame:sync.timelineFrame||0,timeline:sync.attackTimelineV110||null,error:sync.error||null};
};

adapter.inspectCharacterWeaponAttackSyncV108=function(sync){
  if(!sync)return null;
  return {version:'1.01.08',active:!!sync.active,frame:sync.frame||0,lastSync:sync.lastSync||0,lastState:sync.lastState||null,error:sync.error||null};
};
adapter.inspectCharacterTransformSyncV106=function(sync){
  if(!sync)return null;
  return {version:'1.06.00',active:!!sync.active,frame:sync.frame||0,lastSync:sync.lastSync||0,lastState:sync.lastState||null,error:sync.error||null};
};
