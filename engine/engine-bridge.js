(function(global){
  'use strict';
  var bridge = global.AsgardEngineBridge = global.AsgardEngineBridge || {};
  var threeLegacy = global.AsgardThreeLegacy;
  function getThree(){
    return (threeLegacy && typeof threeLegacy.getAPI === 'function') ? threeLegacy.getAPI() : (global.THREE || null);
  }

  /*
   * V1.01.02 — Formal Renderer Bridge Contract
   *
   * Game Core never calls a renderer directly.
   * Runtime -> AsgardEngineBridge -> registered renderer adapter.
   *
   * The proven Three.js adapter remains the default for this milestone.
   * PlayCanvas is registered only when its adapter is actually available.
   */
  bridge.architectureVersion = '1.01.02';
  bridge.rendererPolicy = 'explicit';
  bridge.rendererRegistry = bridge.rendererRegistry || {};
  bridge.activeRendererName = bridge.activeRendererName || 'three';

  bridge.registerRenderer = function(name, adapter, options){
    name = String(name || '').toLowerCase();
    if (!name || !adapter) throw new Error('Invalid renderer registration');
    bridge.rendererRegistry[name] = {
      name: name,
      adapter: adapter,
      available: options && options.available != null ? !!options.available : true,
      active: false
    };
    return bridge.rendererRegistry[name];
  };

  bridge.hasRenderer = function(name){
    name = String(name || '').toLowerCase();
    return !!bridge.rendererRegistry[name];
  };

  bridge.getRenderer = function(name){
    name = String(name || '').toLowerCase();
    var entry = bridge.rendererRegistry[name];
    return entry && entry.adapter || null;
  };

  bridge.getActiveRendererName = function(){
    return bridge.activeRendererName;
  };

  bridge.selectRenderer = function(name){
    name = String(name || '').toLowerCase();
    var entry = bridge.rendererRegistry[name];
    if (!entry) throw new Error('Renderer is not registered: ' + name);
    if (entry.available === false) throw new Error('Renderer is not available: ' + name);
    Object.keys(bridge.rendererRegistry).forEach(function(k){
      bridge.rendererRegistry[k].active = (k === name);
    });
    bridge.activeRendererName = name;
    bridge.setRenderAdapter(name);
    return entry.adapter;
  };

  bridge.inspectRendererRegistry = function(){
    var out = {};
    Object.keys(bridge.rendererRegistry).forEach(function(k){
      var e = bridge.rendererRegistry[k];
      out[k] = {available:!!e.available, active:!!e.active};
    });
    return {
      architectureVersion: bridge.architectureVersion,
      active: bridge.activeRendererName,
      renderers: out
    };
  };


  bridge.engine = 'three';
  bridge.mode = 'formal-bridge';
  /* V1.02.09 Preview Visual Instance facade */
bridge.createPreviewVisualInstanceV209=function(options){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.createPreviewVisualInstanceV209?bridge.playcanvasAdapter.createPreviewVisualInstanceV209(options):null;};
bridge.updatePreviewVisualInstanceV209=function(instance,state){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.updatePreviewVisualInstanceV209?bridge.playcanvasAdapter.updatePreviewVisualInstanceV209(instance,state):false;};
bridge.inspectPreviewVisualInstanceV209=function(instance){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.inspectPreviewVisualInstanceV209?bridge.playcanvasAdapter.inspectPreviewVisualInstanceV209(instance):null;};
bridge.clearPreviewVisualInstanceV209=function(instance){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.clearPreviewVisualInstanceV209?bridge.playcanvasAdapter.clearPreviewVisualInstanceV209(instance):false;};
/* V1.02.11 Preview Visual State Diff + Apply Transaction */
bridge.diffPreviewVisualInstanceV211=function(instance,nextState){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.diffPreviewVisualInstanceV211?bridge.playcanvasAdapter.diffPreviewVisualInstanceV211(instance,nextState):{ok:false,error:'adapter unavailable'};};
bridge.beginPreviewVisualTransactionV211=function(instance,nextState,options){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.beginPreviewVisualTransactionV211?bridge.playcanvasAdapter.beginPreviewVisualTransactionV211(instance,nextState,options):{ok:false,error:'adapter unavailable'};};
bridge.applyPreviewVisualTransactionV211=function(instance,nextState,options){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.applyPreviewVisualTransactionV211?bridge.playcanvasAdapter.applyPreviewVisualTransactionV211(instance,nextState,options):{ok:false,error:'adapter unavailable'};};
bridge.rollbackPreviewVisualTransactionV211=function(instance){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.rollbackPreviewVisualTransactionV211?bridge.playcanvasAdapter.rollbackPreviewVisualTransactionV211(instance):{ok:false,error:'adapter unavailable'};};
bridge.inspectPreviewVisualTransactionV211=function(instance){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.inspectPreviewVisualTransactionV211?bridge.playcanvasAdapter.inspectPreviewVisualTransactionV211(instance):null;};

/* V1.02.12 Preview Visual Frame / Update Lifecycle */
bridge.beginPreviewVisualFrameV212=function(instance,deltaTime,options){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.beginPreviewVisualFrameV212?bridge.playcanvasAdapter.beginPreviewVisualFrameV212(instance,deltaTime,options):{ok:false,error:'adapter unavailable'};};
bridge.updatePreviewVisualFrameV212=function(instance,state,options){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.updatePreviewVisualFrameV212?bridge.playcanvasAdapter.updatePreviewVisualFrameV212(instance,state,options):{ok:false,error:'adapter unavailable'};};
bridge.endPreviewVisualFrameV212=function(instance){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.endPreviewVisualFrameV212?bridge.playcanvasAdapter.endPreviewVisualFrameV212(instance):{ok:false,error:'adapter unavailable'};};
bridge.inspectPreviewVisualFrameV212=function(instance){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.inspectPreviewVisualFrameV212?bridge.playcanvasAdapter.inspectPreviewVisualFrameV212(instance):null;};
bridge.clearPreviewVisualFrameV212=function(instance){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.clearPreviewVisualFrameV212?bridge.playcanvasAdapter.clearPreviewVisualFrameV212(instance):false;};

/* V1.02.13 Preview Visual Frame / State Consistency */
bridge.validatePreviewVisualFrameV213=function(instance,options){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.validatePreviewVisualFrameV213?bridge.playcanvasAdapter.validatePreviewVisualFrameV213(instance,options):{ok:false,error:'adapter unavailable'};};
bridge.inspectPreviewVisualFrameV213=function(instance){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.inspectPreviewVisualFrameV213?bridge.playcanvasAdapter.inspectPreviewVisualFrameV213(instance):null;};
bridge.clearPreviewVisualFrameV213=function(instance){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.clearPreviewVisualFrameV213?bridge.playcanvasAdapter.clearPreviewVisualFrameV213(instance):false;};

/* V1.02.14 Preview Visual Unified Lifecycle */
bridge.beginPreviewVisualLifecycleV214=function(instance,options){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.beginPreviewVisualLifecycleV214?bridge.playcanvasAdapter.beginPreviewVisualLifecycleV214(instance,options):{ok:false,error:'adapter unavailable'};};
bridge.updatePreviewVisualLifecycleV214=function(instance,state,options){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.updatePreviewVisualLifecycleV214?bridge.playcanvasAdapter.updatePreviewVisualLifecycleV214(instance,state,options):{ok:false,error:'adapter unavailable'};};
bridge.endPreviewVisualLifecycleV214=function(instance,options){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.endPreviewVisualLifecycleV214?bridge.playcanvasAdapter.endPreviewVisualLifecycleV214(instance,options):{ok:false,error:'adapter unavailable'};};
bridge.inspectPreviewVisualLifecycleV214=function(instance){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.inspectPreviewVisualLifecycleV214?bridge.playcanvasAdapter.inspectPreviewVisualLifecycleV214(instance):null;};
bridge.clearPreviewVisualLifecycleV214=function(instance){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.clearPreviewVisualLifecycleV214?bridge.playcanvasAdapter.clearPreviewVisualLifecycleV214(instance):false;};

/* V1.02.15 Preview Lifecycle Readiness / Commit Gate */
bridge.evaluatePreviewLifecycleReadinessV215=function(instance,options){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.evaluatePreviewLifecycleReadinessV215?bridge.playcanvasAdapter.evaluatePreviewLifecycleReadinessV215(instance,options):{ok:false,ready:false,error:'adapter unavailable'};};
bridge.commitPreviewLifecycleV215=function(instance,options){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.commitPreviewLifecycleV215?bridge.playcanvasAdapter.commitPreviewLifecycleV215(instance,options):{ok:false,committed:false,error:'adapter unavailable'};};
bridge.inspectPreviewLifecycleGateV215=function(instance){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.inspectPreviewLifecycleGateV215?bridge.playcanvasAdapter.inspectPreviewLifecycleGateV215(instance):null;};
bridge.clearPreviewLifecycleGateV215=function(instance){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.clearPreviewLifecycleGateV215?bridge.playcanvasAdapter.clearPreviewLifecycleGateV215(instance):false;};

/* V1.02.16 Preview Commit Pipeline */
bridge.beginPreviewCommitPipelineV216=function(instance,options){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.beginPreviewCommitPipelineV216?bridge.playcanvasAdapter.beginPreviewCommitPipelineV216(instance,options):{ok:false,error:'adapter unavailable'};};
bridge.advancePreviewCommitPipelineV216=function(instance,stage,data){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.advancePreviewCommitPipelineV216?bridge.playcanvasAdapter.advancePreviewCommitPipelineV216(instance,stage,data):{ok:false,error:'adapter unavailable'};};
bridge.inspectPreviewCommitPipelineV216=function(instance){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.inspectPreviewCommitPipelineV216?bridge.playcanvasAdapter.inspectPreviewCommitPipelineV216(instance):null;};
bridge.clearPreviewCommitPipelineV216=function(instance){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.clearPreviewCommitPipelineV216?bridge.playcanvasAdapter.clearPreviewCommitPipelineV216(instance):false;};

/* V1.02.17 Preview Commit Checkpoint / Rollback */
bridge.createPreviewCommitCheckpointV217=function(instance,label){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.createPreviewCommitCheckpointV217?bridge.playcanvasAdapter.createPreviewCommitCheckpointV217(instance,label):{ok:false,error:'adapter unavailable'};};
bridge.rollbackPreviewCommitCheckpointV217=function(instance){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.rollbackPreviewCommitCheckpointV217?bridge.playcanvasAdapter.rollbackPreviewCommitCheckpointV217(instance):{ok:false,error:'adapter unavailable'};};
bridge.inspectPreviewCommitCheckpointV217=function(instance){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.inspectPreviewCommitCheckpointV217?bridge.playcanvasAdapter.inspectPreviewCommitCheckpointV217(instance):null;};
bridge.clearPreviewCommitCheckpointV217=function(instance){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.clearPreviewCommitCheckpointV217?bridge.playcanvasAdapter.clearPreviewCommitCheckpointV217(instance):false;};

/* V1.02.18 Preview Checkpoint Stack / Recovery Validation */
bridge.createPreviewCheckpointStackV218=function(instance){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.createPreviewCheckpointStackV218?bridge.playcanvasAdapter.createPreviewCheckpointStackV218(instance):{ok:false,error:'adapter unavailable'};};
bridge.pushPreviewCheckpointV218=function(instance,label){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.pushPreviewCheckpointV218?bridge.playcanvasAdapter.pushPreviewCheckpointV218(instance,label):{ok:false,error:'adapter unavailable'};};
bridge.restorePreviewCheckpointV218=function(instance,id){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.restorePreviewCheckpointV218?bridge.playcanvasAdapter.restorePreviewCheckpointV218(instance,id):{ok:false,error:'adapter unavailable'};};
bridge.validatePreviewCheckpointRecoveryV218=function(instance){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.validatePreviewCheckpointRecoveryV218?bridge.playcanvasAdapter.validatePreviewCheckpointRecoveryV218(instance):{ok:false,error:'adapter unavailable'};};
bridge.inspectPreviewCheckpointStackV218=function(instance){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.inspectPreviewCheckpointStackV218?bridge.playcanvasAdapter.inspectPreviewCheckpointStackV218(instance):null;};
bridge.clearPreviewCheckpointStackV218=function(instance){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.clearPreviewCheckpointStackV218?bridge.playcanvasAdapter.clearPreviewCheckpointStackV218(instance):false;};


/* V1.02.19-1.02.21 Recovery Transaction / Audit / History */
bridge.beginRecoveryTransactionV219=function(instance,targetId,options){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.beginRecoveryTransactionV219?bridge.playcanvasAdapter.beginRecoveryTransactionV219(instance,targetId,options):{ok:false,error:'adapter unavailable'};};
bridge.commitRecoveryTransactionV219=function(instance){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.commitRecoveryTransactionV219?bridge.playcanvasAdapter.commitRecoveryTransactionV219(instance):{ok:false,error:'adapter unavailable'};};
bridge.abortRecoveryTransactionV219=function(instance){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.abortRecoveryTransactionV219?bridge.playcanvasAdapter.abortRecoveryTransactionV219(instance):{ok:false,error:'adapter unavailable'};};
bridge.appendPreviewRecoveryAuditV220=function(instance,event,data){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.appendPreviewRecoveryAuditV220?bridge.playcanvasAdapter.appendPreviewRecoveryAuditV220(instance,event,data):false;};
bridge.inspectPreviewRecoveryAuditV220=function(instance){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.inspectPreviewRecoveryAuditV220?bridge.playcanvasAdapter.inspectPreviewRecoveryAuditV220(instance):null;};
bridge.clearPreviewRecoveryAuditV220=function(instance){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.clearPreviewRecoveryAuditV220?bridge.playcanvasAdapter.clearPreviewRecoveryAuditV220(instance):false;};
bridge.recordPreviewRecoveryHistoryV221=function(instance,event,data){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.recordPreviewRecoveryHistoryV221?bridge.playcanvasAdapter.recordPreviewRecoveryHistoryV221(instance,event,data):{ok:false,error:'adapter unavailable'};};
bridge.verifyPreviewRecoveryHistoryV221=function(instance){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.verifyPreviewRecoveryHistoryV221?bridge.playcanvasAdapter.verifyPreviewRecoveryHistoryV221(instance):{ok:false,error:'adapter unavailable'};};
bridge.inspectPreviewRecoveryHistoryV221=function(instance){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.inspectPreviewRecoveryHistoryV221?bridge.playcanvasAdapter.inspectPreviewRecoveryHistoryV221(instance):null;};
bridge.clearPreviewRecoveryHistoryV221=function(instance){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.clearPreviewRecoveryHistoryV221?bridge.playcanvasAdapter.clearPreviewRecoveryHistoryV221(instance):false;};
/* V1.02.22 accelerated Preview Render Readiness */
bridge.createPreviewRenderInstanceV222=function(options){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.createPreviewRenderInstanceV222?bridge.playcanvasAdapter.createPreviewRenderInstanceV222(options):null;};
bridge.bindPreviewRenderResourceV222=function(instance,type,resource){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.bindPreviewRenderResourceV222?bridge.playcanvasAdapter.bindPreviewRenderResourceV222(instance,type,resource):false;};
bridge.bindPreviewRenderMaterialTextureV222=function(instance,material,texture){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.bindPreviewRenderMaterialTextureV222?bridge.playcanvasAdapter.bindPreviewRenderMaterialTextureV222(instance,material,texture):false;};
bridge.bindPreviewRenderAnimationV222=function(instance,animation){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.bindPreviewRenderAnimationV222?bridge.playcanvasAdapter.bindPreviewRenderAnimationV222(instance,animation):false;};
bridge.validatePreviewRenderReadinessV222=function(instance){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.validatePreviewRenderReadinessV222?bridge.playcanvasAdapter.validatePreviewRenderReadinessV222(instance):{ok:false,ready:false,error:'adapter unavailable'};};
bridge.inspectPreviewRenderInstanceV222=function(instance){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.inspectPreviewRenderInstanceV222?bridge.playcanvasAdapter.inspectPreviewRenderInstanceV222(instance):null;};
bridge.clearPreviewRenderInstanceV222=function(instance){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.clearPreviewRenderInstanceV222?bridge.playcanvasAdapter.clearPreviewRenderInstanceV222(instance):false;};

bridge.version = '1.01.44';
  // V1.01.32: renderer adapter registry and active Three.js adapter hand-off. The active renderer remains Three.js.
  // Gameplay/runtime code does not need to know which renderer is active.
  bridge.renderAdapter = bridge.renderAdapter || 'three';
  bridge._renderAdapters = bridge._renderAdapters || {};
  bridge.registerRenderAdapter = bridge.registerRenderAdapter || function(name, adapter){
    if (!name || !adapter) return adapter;
    this._renderAdapters[name] = adapter;
    return adapter;
  };
  bridge.setRenderAdapter = bridge.setRenderAdapter || function(name){
    if (name && this._renderAdapters[name]) this.renderAdapter = name;
    return this._renderAdapters[this.renderAdapter] || null;
  };
  bridge.getRenderAdapter = bridge.getRenderAdapter || function(){
    return this._renderAdapters[this.renderAdapter] || null;
  };
  bridge.setRenderer = bridge.setRenderer || function(name){ this.engine = name || this.engine; };
  bridge.yieldFrame = bridge.yieldFrame || function(){
    return new Promise(function(resolve){ requestAnimationFrame(function(){ resolve(); }); });
  };
  // Phase 3: the main gameplay Scene is now owned by the engine bridge.
  // Runtime keeps all game rules and object construction, but asks the bridge
  // for the active rendering scene. Preview scenes remain untouched.
  bridge.createScene = function(){
    if (!getThree() || !getThree().Scene) {
      throw new Error('Three.js Scene is not available');
    }
    return new (getThree().Scene)();
  };
  // Phase 4: the main world objects now live under a dedicated root.
  // This is an ownership boundary only; object creation and gameplay rules remain in Runtime.
  bridge.createWorldRoot = function(scene){
    if (!scene || !getThree() || !getThree().Group) {
      throw new Error('Three.js World Root is not available');
    }
    var root = new (getThree().Group)();
    root.name = 'AsgardWorldRoot';
    scene.add(root);
    return root;
  };
  // V1.01.33: renderer-neutral object API boundary.
  // This creates a group through the active engine implementation without
  // changing any existing runtime object hierarchy.
  bridge.createRenderGroup = function(name){
    if (!getThree() || !getThree().Group) {
      throw new Error('Three.js Render Group is not available');
    }
    var group = new (getThree().Group)();
    group.name = name || 'AsgardRenderGroup';
    group.userData = group.userData || {};
    group.userData.renderObjectOwner = 'engine-bridge';
    return group;
  };
  bridge.addRenderObject = function(parent, object){
    return this.addWorldObject(parent, object);
  };
  bridge.removeRenderObject = function(parent, object){
    return this.removeWorldObject(parent, object);
  };
  bridge.addWorldObject = function(root, object){
    if (root && object) root.add(object);
    return object;
  };
  // V1.01.19: dedicated ownership boundary for the live gameplay character.
  // The Character Model V2 itself and all gameplay state remain in Runtime.
  bridge.createCharacterRoot = function(scene){
    if (!scene || !getThree() || !getThree().Group) {
      throw new Error('Three.js Character Root is not available');
    }
    var root = new (getThree().Group)();
    root.name = 'AsgardCharacterRoot';
    scene.add(root);
    return root;
  };
  // V1.01.20: dedicated ownership boundary for live character equipment visuals.
  // The runtime still owns all equipment data/rules. This root only owns the
  // existing EquipmentVisuals group so the renderer can later map equipment
  // without changing gameplay logic.
  bridge.createEquipmentRoot = function(character){
    if (!character || !getThree() || !getThree().Group) {
      throw new Error('Three.js Equipment Root is not available');
    }
    var root = new (getThree().Group)();
    root.name = 'AsgardEquipmentRoot';
    character.add(root);
    return root;
  };
  // V1.01.21: weapon/shield visual ownership roots live at the hand anchors.
  // Keeping them under the existing hand mounts preserves every animation and
  // transform while giving the renderer explicit ownership boundaries.
  bridge.createWeaponVisualRoot = function(handMount, side){
    if (!handMount || !getThree() || !getThree().Group) {
      throw new Error('Three.js Weapon Visual Root is not available');
    }
    var root = new (getThree().Group)();
    root.name = 'AsgardWeaponVisualRoot' + (side || '');
    handMount.add(root);
    return root;
  };
  bridge.createShieldVisualRoot = function(handMount, side){
    if (!handMount || !getThree() || !getThree().Group) {
      throw new Error('Three.js Shield Visual Root is not available');
    }
    var root = new (getThree().Group)();
    root.name = 'AsgardShieldVisualRoot' + (side || '');
    handMount.add(root);
    return root;
  };
  // V1.01.22: animation ownership boundary for the live character.
  // The current procedural animation driver remains in Runtime; this empty
  // root is the stable hand-off point for a future PlayCanvas/rig animator.
  bridge.createAnimationRoot = function(character){
    if (!character || !getThree() || !getThree().Group) {
      throw new Error('Three.js Animation Root is not available');
    }
    var root = new (getThree().Group)();
    root.name = 'AsgardAnimationRoot';
    root.userData.animationOwner = 'runtime-procedural';
    character.add(root);
    return root;
  };
  // V1.01.24: passive Character Model V2 ownership boundaries.
  bridge.createBodyRoot = function(character){ if (!character || !getThree() || !getThree().Group) throw new Error('Three.js Body Root is not available'); var root=new (getThree().Group)(); root.name='AsgardBodyRoot'; character.add(root); return root; };
  bridge.createHeadRoot = function(character){ if (!character || !getThree() || !getThree().Group) throw new Error('Three.js Head Root is not available'); var root=new (getThree().Group)(); root.name='AsgardHeadRoot'; character.add(root); return root; };
  bridge.createHairRoot = function(headRoot){ if (!headRoot || !getThree() || !getThree().Group) throw new Error('Three.js Hair Root is not available'); var root=new (getThree().Group)(); root.name='AsgardHairRoot'; headRoot.add(root); return root; };
  bridge.createFaceRoot = function(headRoot){ if (!headRoot || !getThree() || !getThree().Group) throw new Error('Three.js Face Root is not available'); var root=new (getThree().Group)(); root.name='AsgardFaceRoot'; headRoot.add(root); return root; };
  // V1.01.26: passive map/world ownership boundary. Existing world layer
  // hierarchies are intentionally NOT reparented; this avoids changing any
  // transforms, visibility, collision assumptions, or map construction rules.
  bridge.createMapRoot = function(worldRoot, zoneId){
    if (!worldRoot || !getThree() || !getThree().Group) throw new Error('Three.js Map Root is not available');
    var root = new (getThree().Group)();
    root.name = 'AsgardMapRoot' + (zoneId ? ('_' + zoneId) : '');
    root.userData.mapOwner = 'runtime-world';
    worldRoot.add(root);
    return root;
  };
  // V1.01.27: passive map renderer ownership boundary. This root is an
  // identity container only; existing map objects are NOT reparented.
  // Terrain, static objects, NPCs, portals, monsters and gameplay state keep
  // their proven V1.01.26 ownership and construction paths.
  bridge.createMapRendererRoot = function(mapRoot, zoneId){
    if (!mapRoot || !getThree() || !getThree().Group) throw new Error('Three.js Map Renderer Root is not available');
    var root = new (getThree().Group)();
    root.name = 'AsgardMapRendererRoot' + (zoneId ? ('_' + zoneId) : '');
    root.userData.mapRendererOwner = 'runtime-map';
    mapRoot.add(root);
    return root;
  };
  // V1.01.28: passive per-object-category renderer ownership boundaries.
  // These are identity containers only; proven runtime objects are NOT reparented.
  bridge.createMapRendererLayer = function(parent, name){
    if (!parent || !getThree() || !getThree().Group) throw new Error('Three.js Map Renderer Layer is not available');
    var root = new (getThree().Group)();
    root.name = name || 'AsgardMapRendererLayer';
    root.userData.mapRendererLayerOwner = 'runtime-map';
    parent.add(root);
    return root;
  };
  // V1.01.29: unified world render-pipeline boundary.
  // This is an identity/registry boundary only. It deliberately does not
  // reparent any existing runtime object, so transforms and gameplay ownership
  // remain exactly as proven in V1.01.28.
  bridge.createWorldRenderPipeline = function(mapRendererRoot, characterRoot){
    var pipeline = {
      root: mapRendererRoot || null,
      characterRoot: characterRoot || null,
      terrain: null,
      static: null,
      npc: null,
      portal: null,
      monster: null,
      character: characterRoot || null
    };
    if (mapRendererRoot && mapRendererRoot.userData) {
      mapRendererRoot.userData.worldRenderPipelineOwner = 'engine-bridge';
      mapRendererRoot.userData.worldRenderPipelineVersion = '1.01.29';
    }
    return pipeline;
  };
  // V1.01.25: preview/creation ownership boundary. These roots are identity
  // containers only; existing preview model hierarchies are not rebuilt.
  bridge.createPreviewRoot = function(scene, name){
    if (!scene || !getThree() || !getThree().Group) throw new Error('Three.js Preview Root is not available');
    var root = new (getThree().Group)();
    root.name = name || 'AsgardPreviewRoot';
    root.userData.previewOwner = 'runtime-preview';
    scene.add(root);
    return root;
  };
  bridge.createAnimationController = function(animationRoot){
    var controller = {
      root: animationRoot || null,
      state: 'idle',
      moving: false,
      attack: false,
      phase: 0,
      speed: 0,
      setState: function(name){ this.state = name || 'idle'; },
      setMoving: function(value, speed){ this.moving = !!value; this.speed = Number(speed) || 0; },
      setAttack: function(value){ this.attack = !!value; },
      update: function(dt){ if (this.moving) this.phase += Math.max(0, Number(dt) || 0) * Math.max(1, this.speed || 6) * 1.65; }
    };
    if (animationRoot) animationRoot.userData.animationController = controller;
    return controller;
  };
  bridge.removeWorldObject = function(root, object){
    if (root && object) root.remove(object);
  };
  // V1.01.37: renderer-neutral Resource Registry API boundary.
  // This registry is opt-in only. It does not load, replace, dispose, or
  // reparent any existing runtime resource. It provides a stable ownership
  // contract that a future PlayCanvas adapter can implement independently.
  bridge.createResourceRegistry = function(name){
    var registry = {
      name: name || 'AsgardResourceRegistry',
      resources: Object.create(null),
      register: function(id, resource){
        if (!id) return resource;
        this.resources[String(id)] = resource;
        return resource;
      },
      get: function(id){
        return id ? this.resources[String(id)] : undefined;
      },
      has: function(id){
        return !!(id && Object.prototype.hasOwnProperty.call(this.resources, String(id)));
      },
      release: function(id){
        if (!id) return undefined;
        var key = String(id);
        var resource = this.resources[key];
        delete this.resources[key];
        return resource;
      },
      clear: function(){
        this.resources = Object.create(null);
      },
      keys: function(){
        return Object.keys(this.resources);
      }
    };
    return registry;
  };
  bridge.registerRenderResource = function(registry, id, resource){
    return registry && typeof registry.register === 'function' ? registry.register(id, resource) : resource;
  };
  bridge.getRenderResource = function(registry, id){
    return registry && typeof registry.get === 'function' ? registry.get(id) : undefined;
  };
  bridge.hasRenderResource = function(registry, id){
    return !!(registry && typeof registry.has === 'function' && registry.has(id));
  };
  bridge.releaseRenderResource = function(registry, id){
    return registry && typeof registry.release === 'function' ? registry.release(id) : undefined;
  };
  bridge.clearRenderResources = function(registry){
    if (registry && typeof registry.clear === 'function') registry.clear();
    return registry;
  };
  // V1.01.36: renderer-neutral Texture / Resource API boundary.
  // These helpers are opt-in only. Existing runtime textures/materials/geometries
  // are not touched unless a caller explicitly invokes a setter or disposer.
  bridge.createTexture = function(source, options){
    if (!getThree() || !getThree().TextureLoader) throw new Error('Three.js Texture API is not available');
    var o = options || {};
    if (source && typeof source === 'object' && source.isTexture) return source;
    if (!source) return null;
    var loader = o.loader && typeof o.loader.load === 'function' ? o.loader : new (getThree().TextureLoader)();
    return loader.load(String(source));
  };
  bridge.setTextureProperty = function(texture, key, value){
    if (!texture || !key) return texture;
    texture[key] = value;
    if (texture.needsUpdate !== undefined) texture.needsUpdate = true;
    return texture;
  };
  bridge.getTextureProperty = function(texture, key){
    return texture && key ? texture[key] : undefined;
  };
  bridge.disposeGeometry = function(geometry){
    if (geometry && typeof geometry.dispose === 'function') geometry.dispose();
    return geometry;
  };
  bridge.disposeMaterial = function(material){
    if (material && typeof material.dispose === 'function') material.dispose();
    return material;
  };
  bridge.disposeTexture = function(texture){
    if (texture && typeof texture.dispose === 'function') texture.dispose();
    return texture;
  };

  // V1.01.35: renderer-neutral Geometry / Material / Visual API boundary.
  // These helpers are opt-in only and do not mutate any existing runtime object
  // unless a caller explicitly invokes a setter.
  bridge.createGeometry = function(type, options){
    if (!getThree()) throw new Error('Three.js Geometry API is not available');
    var o = options || {};
    var t = String(type || 'box').toLowerCase();
    var C = {
      box: getThree().BoxGeometry,
      sphere: getThree().SphereGeometry,
      plane: getThree().PlaneGeometry,
      cylinder: getThree().CylinderGeometry,
      cone: getThree().ConeGeometry,
      circle: getThree().CircleGeometry,
      ring: getThree().RingGeometry,
      torus: getThree().TorusGeometry
    }[t];
    if (!C) throw new Error('Unsupported geometry type: ' + type);
    var args = Array.isArray(o.args) ? o.args : [];
    return new (Function.prototype.bind.apply(C, [null].concat(args)))();
  };
  bridge.createMaterial = function(type, options){
    if (!getThree()) throw new Error('Three.js Material API is not available');
    var o = Object.assign({}, options || {});
    var t = String(type || 'standard').toLowerCase();
    var C = {
      basic: getThree().MeshBasicMaterial,
      standard: getThree().MeshStandardMaterial,
      phong: getThree().MeshPhongMaterial,
      lambert: getThree().MeshLambertMaterial,
      physical: getThree().MeshPhysicalMaterial,
      depth: getThree().MeshDepthMaterial,
      normal: getThree().MeshNormalMaterial
    }[t];
    if (!C) throw new Error('Unsupported material type: ' + type);
    return new C(o);
  };
  bridge.setMaterialProperty = function(material, key, value){
    if (!material || !key) return material;
    material[key] = value;
    if (material.needsUpdate !== undefined) material.needsUpdate = true;
    return material;
  };
  bridge.getMaterialProperty = function(material, key){
    return material && key ? material[key] : undefined;
  };
  bridge.setMeshVisual = function(object, visual){
    if (!object || !visual) return object;
    if (visual.visible != null) object.visible = !!visual.visible;
    if (visual.castShadow != null) object.castShadow = !!visual.castShadow;
    if (visual.receiveShadow != null) object.receiveShadow = !!visual.receiveShadow;
    if (visual.frustumCulled != null) object.frustumCulled = !!visual.frustumCulled;
    if (visual.renderOrder != null) object.renderOrder = Number(visual.renderOrder) || 0;
    return object;
  };
  bridge.getMeshVisual = function(object){
    if (!object) return null;
    return {visible:!!object.visible, castShadow:!!object.castShadow, receiveShadow:!!object.receiveShadow, frustumCulled:!!object.frustumCulled, renderOrder:Number(object.renderOrder)||0};
  };

  // V1.01.34: renderer-neutral Transform API boundary.
  // These helpers operate on existing objects without changing their current
  // transforms unless explicitly called by a future renderer-aware system.
  bridge.getObjectPosition = function(object){
    return object && object.position ? object.position : null;
  };
  bridge.setObjectPosition = function(object, x, y, z){
    if (!object || !object.position) return object;
    if (x && typeof x === 'object') {
      object.position.set(Number(x.x)||0, Number(x.y)||0, Number(x.z)||0);
    } else {
      object.position.set(Number(x)||0, Number(y)||0, Number(z)||0);
    }
    return object;
  };
  bridge.getObjectRotation = function(object){
    return object && object.rotation ? object.rotation : null;
  };
  bridge.setObjectRotation = function(object, x, y, z){
    if (!object || !object.rotation) return object;
    if (x && typeof x === 'object') {
      object.rotation.set(Number(x.x)||0, Number(x.y)||0, Number(x.z)||0);
    } else {
      object.rotation.set(Number(x)||0, Number(y)||0, Number(z)||0);
    }
    return object;
  };
  bridge.getObjectScale = function(object){
    return object && object.scale ? object.scale : null;
  };
  bridge.setObjectScale = function(object, x, y, z){
    if (!object || !object.scale) return object;
    if (x && typeof x === 'object') {
      object.scale.set(Number(x.x)||1, Number(x.y)||1, Number(x.z)||1);
    } else {
      object.scale.set(Number(x)||1, Number(y)||1, Number(z)||1);
    }
    return object;
  };
  bridge.getObjectTransform = function(object){
    if (!object) return null;
    return { position: object.position || null, rotation: object.rotation || null, scale: object.scale || null };
  };
  bridge.setObjectTransform = function(object, transform){
    if (!object || !transform) return object;
    if (transform.position) this.setObjectPosition(object, transform.position);
    if (transform.rotation) this.setObjectRotation(object, transform.rotation);
    if (transform.scale) this.setObjectScale(object, transform.scale);
    return object;
  };

  // V1.01.39: renderer-neutral Light API boundary.
  // These helpers are opt-in only. Existing runtime lights and scene lighting
  // are not changed unless a caller explicitly creates or mutates a light.
  bridge.createLight = function(type, options){
    if (!getThree()) throw new Error('Three.js Light API is not available');
    var o = options || {};
    var t = String(type || 'ambient').toLowerCase();
    var color = o.color != null ? o.color : 0xffffff;
    var intensity = o.intensity != null ? Number(o.intensity) : 1;
    var light;
    if (t === 'ambient') light = new (getThree().AmbientLight)(color, intensity);
    else if (t === 'hemisphere' && getThree().HemisphereLight) light = new (getThree().HemisphereLight)(o.skyColor != null ? o.skyColor : color, o.groundColor != null ? o.groundColor : 0x444444, intensity);
    else if (t === 'directional') light = new (getThree().DirectionalLight)(color, intensity);
    else if (t === 'point') light = new (getThree().PointLight)(color, intensity, Number(o.distance) || 0, o.decay != null ? Number(o.decay) : 2);
    else if (t === 'spot') light = new (getThree().SpotLight)(color, intensity, Number(o.distance) || 0, o.angle != null ? Number(o.angle) : Math.PI / 3, o.penumbra != null ? Number(o.penumbra) : 0, o.decay != null ? Number(o.decay) : 2);
    else throw new Error('Unsupported light type: ' + type);
    if (o.castShadow != null) light.castShadow = !!o.castShadow;
    return light;
  };
  bridge.setLightProperty = function(light, key, value){
    if (!light || !key) return light;
    light[key] = value;
    return light;
  };
  bridge.getLightProperty = function(light, key){
    return light && key ? light[key] : undefined;
  };
  bridge.setLightColor = function(light, color){
    if (!light || !light.color) return light;
    light.color.set(color);
    return light;
  };
  bridge.getLightColor = function(light){
    if (!light || !light.color) return null;
    return light.color;
  };

  // V1.01.41: renderer-neutral Environment / Scene Visual API boundary.
  // These helpers are opt-in only. Existing scene background/fog/environment
  // state is not changed unless a caller explicitly invokes a setter.
  bridge.getSceneBackground = function(scene){
    if (!scene) return null;
    return scene.background !== undefined ? scene.background : null;
  };
  bridge.setSceneBackground = function(scene, background){
    if (!scene) return scene;
    if ('background' in scene) scene.background = background;
    return scene;
  };
  bridge.getSceneFog = function(scene){
    if (!scene) return null;
    return scene.fog !== undefined ? scene.fog : null;
  };
  bridge.setSceneFog = function(scene, fog){
    if (!scene) return scene;
    if ('fog' in scene) scene.fog = fog;
    return scene;
  };
  bridge.getSceneEnvironment = function(scene){
    if (!scene) return null;
    return scene.environment !== undefined ? scene.environment : null;
  };
  bridge.setSceneEnvironment = function(scene, environment){
    if (!scene) return scene;
    if ('environment' in scene) scene.environment = environment;
    return scene;
  };
  bridge.setSceneVisualProperty = function(scene, key, value){
    if (!scene || !key) return scene;
    scene[key] = value;
    return scene;
  };
  bridge.getSceneVisualProperty = function(scene, key){
    return scene && key ? scene[key] : undefined;
  };

  // V1.01.43: renderer-neutral Viewport / Scissor API boundary.
  // These helpers are opt-in only. They do not alter the existing main renderer
  // viewport or scissor state unless a caller explicitly invokes a setter.
  bridge.getViewport = function(renderer){
    if (!renderer) return null;
    if (typeof renderer.getViewport === 'function') {
      var box = new (getThree() && getThree().Vector4 ? getThree().Vector4 : function(){ this.x=0; this.y=0; this.z=0; this.w=0; })();
      var result = renderer.getViewport(box);
      return { x:Number(result.x)||0, y:Number(result.y)||0, width:Number(result.z)||0, height:Number(result.w)||0 };
    }
    return renderer.__asgardViewport || null;
  };
  bridge.setViewport = function(renderer, x, y, width, height){
    if (!renderer) return renderer;
    var v = { x:Number(x)||0, y:Number(y)||0, width:Math.max(0, Number(width)||0), height:Math.max(0, Number(height)||0) };
    if (typeof renderer.setViewport === 'function') renderer.setViewport(v.x, v.y, v.width, v.height);
    renderer.__asgardViewport = v;
    return renderer;
  };
  bridge.getScissor = function(renderer){
    if (!renderer) return null;
    if (typeof renderer.getScissor === 'function') {
      var box = new (getThree() && getThree().Vector4 ? getThree().Vector4 : function(){ this.x=0; this.y=0; this.z=0; this.w=0; })();
      var result = renderer.getScissor(box);
      return { x:Number(result.x)||0, y:Number(result.y)||0, width:Number(result.z)||0, height:Number(result.w)||0 };
    }
    return renderer.__asgardScissor || null;
  };
  bridge.setScissor = function(renderer, x, y, width, height){
    if (!renderer) return renderer;
    var v = { x:Number(x)||0, y:Number(y)||0, width:Math.max(0, Number(width)||0), height:Math.max(0, Number(height)||0) };
    if (typeof renderer.setScissor === 'function') renderer.setScissor(v.x, v.y, v.width, v.height);
    renderer.__asgardScissor = v;
    return renderer;
  };
  bridge.getScissorTest = function(renderer){
    if (!renderer) return null;
    if (typeof renderer.getScissorTest === 'function') return !!renderer.getScissorTest();
    return renderer.__asgardScissorTest === true;
  };
  bridge.setScissorTest = function(renderer, enabled){
    if (!renderer) return renderer;
    var value = !!enabled;
    if (typeof renderer.setScissorTest === 'function') renderer.setScissorTest(value);
    renderer.__asgardScissorTest = value;
    return renderer;
  };

  // V1.01.45: renderer-neutral Render Pass / Pipeline API boundary.
  // Opt-in descriptors only. Existing frame flow is untouched until a caller
  // explicitly uses these helpers. The contract is renderer-neutral so a
  // future PlayCanvas adapter can map passes to camera/layer/render pipeline
  // stages without changing gameplay code.
  bridge.createRenderPass = function(options){
    var o = options || {};
    return {
      id: o.id != null ? String(o.id) : '',
      name: o.name != null ? String(o.name) : '',
      enabled: o.enabled !== false,
      order: Number.isFinite(Number(o.order)) ? Number(o.order) : 0,
      scene: o.scene || null,
      camera: o.camera || null,
      target: o.target || null,
      viewport: o.viewport || null,
      clear: o.clear !== false,
      clearColor: o.clearColor != null ? o.clearColor : null,
      clearDepth: o.clearDepth !== false,
      clearStencil: o.clearStencil === true,
      metadata: o.metadata || {}
    };
  };
  bridge.getRenderPassProperty = function(pass, key){
    return pass && key ? pass[key] : undefined;
  };
  bridge.setRenderPassProperty = function(pass, key, value){
    if (!pass || !key) return pass;
    pass[key] = value;
    return pass;
  };
  bridge.setRenderPassEnabled = function(pass, enabled){
    if (!pass) return pass;
    pass.enabled = !!enabled;
    return pass;
  };
  bridge.getRenderPassEnabled = function(pass){
    return pass ? pass.enabled !== false : false;
  };
  bridge.createRenderPipeline = function(options){
    var o = options || {};
    return {
      id: o.id != null ? String(o.id) : '',
      name: o.name != null ? String(o.name) : '',
      passes: Array.isArray(o.passes) ? o.passes.slice() : [],
      enabled: o.enabled !== false,
      metadata: o.metadata || {}
    };
  };
  bridge.addRenderPass = function(pipeline, pass){
    if (!pipeline || !pass) return pipeline;
    if (!Array.isArray(pipeline.passes)) pipeline.passes = [];
    if (pipeline.passes.indexOf(pass) === -1) pipeline.passes.push(pass);
    return pipeline;
  };
  bridge.removeRenderPass = function(pipeline, pass){
    if (!pipeline || !Array.isArray(pipeline.passes)) return pipeline;
    var i = pipeline.passes.indexOf(pass);
    if (i >= 0) pipeline.passes.splice(i, 1);
    return pipeline;
  };
  bridge.getRenderPasses = function(pipeline){
    return pipeline && Array.isArray(pipeline.passes) ? pipeline.passes.slice() : [];
  };

  // V1.01.46: renderer-neutral Render Command / Submission API boundary.
  // Descriptor-only helpers. They do not submit or execute any render command
  // and therefore do not alter the existing Three.js frame flow. A future
  // PlayCanvas adapter can map these descriptors to layer/camera draw work.
  bridge.createRenderCommand = function(options){
    var o = options || {};
    return {
      id: o.id != null ? String(o.id) : '',
      name: o.name != null ? String(o.name) : '',
      enabled: o.enabled !== false,
      order: Number.isFinite(Number(o.order)) ? Number(o.order) : 0,
      object: o.object || null,
      scene: o.scene || null,
      camera: o.camera || null,
      material: o.material || null,
      geometry: o.geometry || null,
      target: o.target || null,
      metadata: o.metadata || {}
    };
  };
  bridge.getRenderCommandProperty = function(command, key){
    return command && key ? command[key] : undefined;
  };
  bridge.setRenderCommandProperty = function(command, key, value){
    if (!command || !key) return command;
    command[key] = value;
    return command;
  };
  bridge.setRenderCommandEnabled = function(command, enabled){
    if (!command) return command;
    command.enabled = !!enabled;
    return command;
  };
  bridge.getRenderCommandEnabled = function(command){
    return command ? command.enabled !== false : false;
  };
  bridge.createRenderQueue = function(options){
    var o = options || {};
    return {
      id: o.id != null ? String(o.id) : '',
      name: o.name != null ? String(o.name) : '',
      commands: Array.isArray(o.commands) ? o.commands.slice() : [],
      enabled: o.enabled !== false,
      metadata: o.metadata || {}
    };
  };
  bridge.addRenderCommand = function(queue, command){
    if (!queue || !command) return queue;
    if (!Array.isArray(queue.commands)) queue.commands = [];
    if (queue.commands.indexOf(command) === -1) queue.commands.push(command);
    return queue;
  };
  bridge.removeRenderCommand = function(queue, command){
    if (!queue || !Array.isArray(queue.commands)) return queue;
    var i = queue.commands.indexOf(command);
    if (i >= 0) queue.commands.splice(i, 1);
    return queue;
  };
  bridge.getRenderCommands = function(queue){
    return queue && Array.isArray(queue.commands) ? queue.commands.slice() : [];
  };

  // V1.01.47: renderer-neutral Render Batch / Instancing API boundary.
  // Descriptor-only helpers. They do not merge, reparent, clone, or replace any
  // existing runtime geometry. A future PlayCanvas adapter can map these
  // descriptors to batched or instanced draw resources without changing gameplay.
  bridge.createRenderBatch = function(options){
    var o = options || {};
    return {
      id: o.id != null ? String(o.id) : '',
      name: o.name != null ? String(o.name) : '',
      enabled: o.enabled !== false,
      mode: o.mode != null ? String(o.mode) : 'instances',
      geometry: o.geometry || null,
      material: o.material || null,
      instances: Array.isArray(o.instances) ? o.instances.slice() : [],
      maxInstances: Math.max(0, Number(o.maxInstances) || 0),
      metadata: o.metadata || {}
    };
  };
  bridge.getRenderBatchProperty = function(batch, key){
    return batch && key ? batch[key] : undefined;
  };
  bridge.setRenderBatchProperty = function(batch, key, value){
    if (!batch || !key) return batch;
    batch[key] = value;
    return batch;
  };
  bridge.setRenderBatchEnabled = function(batch, enabled){
    if (!batch) return batch;
    batch.enabled = !!enabled;
    return batch;
  };
  bridge.getRenderBatchEnabled = function(batch){
    return batch ? batch.enabled !== false : false;
  };
  bridge.addRenderInstance = function(batch, instance){
    if (!batch || !instance) return batch;
    if (!Array.isArray(batch.instances)) batch.instances = [];
    if (batch.maxInstances > 0 && batch.instances.length >= batch.maxInstances) return batch;
    if (batch.instances.indexOf(instance) === -1) batch.instances.push(instance);
    return batch;
  };
  bridge.removeRenderInstance = function(batch, instance){
    if (!batch || !Array.isArray(batch.instances)) return batch;
    var i = batch.instances.indexOf(instance);
    if (i >= 0) batch.instances.splice(i, 1);
    return batch;
  };
  bridge.getRenderInstances = function(batch){
    return batch && Array.isArray(batch.instances) ? batch.instances.slice() : [];
  };

  // V1.01.48: renderer-neutral Render Culling / Visibility Query API boundary.
  // Descriptor/query-only helpers. They do not change visibility, remove objects,
  // or alter the existing render loop. A future PlayCanvas adapter can map the
  // same contract to frustum culling / spatial culling without changing gameplay.
  bridge.createRenderCullingContext = function(options){
    var o = options || {};
    return {
      id: o.id != null ? String(o.id) : '',
      name: o.name != null ? String(o.name) : '',
      enabled: o.enabled !== false,
      mode: o.mode != null ? String(o.mode) : 'frustum',
      layerMask: o.layerMask != null ? o.layerMask : 0xFFFFFFFF,
      camera: o.camera || null,
      bounds: o.bounds || null,
      metadata: o.metadata || {}
    };
  };
  bridge.getRenderCullingProperty = function(context, key){
    return context && key ? context[key] : undefined;
  };
  bridge.setRenderCullingProperty = function(context, key, value){
    if (!context || !key) return context;
    context[key] = value;
    return context;
  };
  bridge.setRenderCullingEnabled = function(context, enabled){
    if (!context) return context;
    context.enabled = !!enabled;
    return context;
  };
  bridge.getRenderCullingEnabled = function(context){
    return context ? context.enabled !== false : false;
  };
  bridge.testRenderVisibility = function(context, object){
    if (!context || !object) return false;
    if (!context.enabled) return true;
    if (context.layerMask != null) {
      var mask = bridge.getObjectLayerMask(object);
      if (mask != null && (mask & context.layerMask) === 0) return false;
    }
    return bridge.getObjectVisibility(object) !== false;
  };
  bridge.getRenderVisibleObjects = function(context, objects){
    var list = Array.isArray(objects) ? objects : [];
    return list.filter(function(object){ return bridge.testRenderVisibility(context, object); });
  };
  bridge.getRenderCullingStats = function(context, objects){
    var list = Array.isArray(objects) ? objects : [];
    var visible = bridge.getRenderVisibleObjects(context, list);
    return { total: list.length, visible: visible.length, culled: list.length - visible.length };
  };

  // V1.01.49: renderer-neutral Render Bounds / Spatial Query API boundary.
  // Descriptor/query-only helpers. They do not move, hide, remove, or reparent
  // existing game objects. A future PlayCanvas adapter can map this contract to
  // entity bounds / spatial partition queries without changing gameplay.
  bridge.createRenderBounds = function(options){
    var o = options || {};
    var min = o.min || {x:0,y:0,z:0};
    var max = o.max || {x:0,y:0,z:0};
    return {
      id: o.id != null ? String(o.id) : '',
      name: o.name != null ? String(o.name) : '',
      min: {x:Number(min.x)||0,y:Number(min.y)||0,z:Number(min.z)||0},
      max: {x:Number(max.x)||0,y:Number(max.y)||0,z:Number(max.z)||0},
      enabled: o.enabled !== false,
      metadata: o.metadata || {}
    };
  };
  bridge.getRenderBoundsProperty = function(bounds, key){
    return bounds && key ? bounds[key] : undefined;
  };
  bridge.setRenderBoundsProperty = function(bounds, key, value){
    if (!bounds || !key) return bounds;
    bounds[key] = value;
    return bounds;
  };
  bridge.setRenderBoundsEnabled = function(bounds, enabled){
    if (!bounds) return bounds;
    bounds.enabled = !!enabled;
    return bounds;
  };
  bridge.getRenderBoundsEnabled = function(bounds){
    return bounds ? bounds.enabled !== false : false;
  };
  bridge.setRenderBounds = function(bounds, min, max){
    if (!bounds) return bounds;
    min = min || bounds.min || {x:0,y:0,z:0};
    max = max || bounds.max || {x:0,y:0,z:0};
    bounds.min = {x:Number(min.x)||0,y:Number(min.y)||0,z:Number(min.z)||0};
    bounds.max = {x:Number(max.x)||0,y:Number(max.y)||0,z:Number(max.z)||0};
    return bounds;
  };
  bridge.getRenderBounds = function(bounds){
    if (!bounds) return null;
    return {min:{x:bounds.min.x,y:bounds.min.y,z:bounds.min.z},max:{x:bounds.max.x,y:bounds.max.y,z:bounds.max.z}};
  };
  bridge.testRenderBoundsIntersection = function(a, b){
    if (!a || !b || a.enabled === false || b.enabled === false) return false;
    var amin=a.min||a, amax=a.max||a, bmin=b.min||b, bmax=b.max||b;
    return amin.x<=bmax.x && amax.x>=bmin.x && amin.y<=bmax.y && amax.y>=bmin.y && amin.z<=bmax.z && amax.z>=bmin.z;
  };
  bridge.getRenderObjectsInBounds = function(queryBounds, objects, getBounds){
    var list=Array.isArray(objects)?objects:[];
    var resolver=typeof getBounds==='function'?getBounds:function(object){return object && object.userData ? object.userData.renderBounds : null;};
    return list.filter(function(object){var bounds=resolver(object);return bounds&&bridge.testRenderBoundsIntersection(queryBounds,bounds);});
  };
  bridge.getRenderBoundsStats = function(queryBounds, objects, getBounds){
    var list=Array.isArray(objects)?objects:[];
    var visible=bridge.getRenderObjectsInBounds(queryBounds,list,getBounds);
    return {total:list.length,intersecting:visible.length,nonIntersecting:list.length-visible.length};
  };

  // V1.01.51: renderer-neutral Render Post-Process / Effect API boundary.
  // Descriptor-only helpers. No existing renderer, scene, camera, material,
  // or game object is modified until a caller explicitly applies an effect.
  bridge.createRenderEffect = function(options){
    var o = options || {};
    return {
      id: o.id != null ? String(o.id) : '',
      name: o.name != null ? String(o.name) : '',
      type: o.type != null ? String(o.type) : 'custom',
      enabled: o.enabled !== false,
      priority: Number(o.priority) || 0,
      properties: o.properties || {},
      metadata: o.metadata || {}
    };
  };
  bridge.getRenderEffectProperty = function(effect, key){
    if (!effect || !key) return undefined;
    if (key === 'properties') return effect.properties;
    return effect[key];
  };
  bridge.setRenderEffectProperty = function(effect, key, value){
    if (!effect || !key) return effect;
    if (key === 'properties') effect.properties = value || {};
    else effect[key] = value;
    return effect;
  };
  bridge.setRenderEffectEnabled = function(effect, enabled){
    if (!effect) return effect;
    effect.enabled = !!enabled;
    return effect;
  };
  bridge.getRenderEffectEnabled = function(effect){
    return effect ? effect.enabled !== false : false;
  };
  bridge.setRenderEffectParameter = function(effect, key, value){
    if (!effect || !key) return effect;
    if (!effect.properties || typeof effect.properties !== 'object') effect.properties = {};
    effect.properties[key] = value;
    return effect;
  };
  bridge.getRenderEffectParameter = function(effect, key){
    if (!effect || !effect.properties || !key) return undefined;
    return effect.properties[key];
  };
  bridge.createRenderEffectChain = function(options){
    var o = options || {};
    var effects = Array.isArray(o.effects) ? o.effects.slice() : [];
    effects.sort(function(a,b){ return (Number(a && a.priority)||0) - (Number(b && b.priority)||0); });
    return {
      id: o.id != null ? String(o.id) : '',
      name: o.name != null ? String(o.name) : '',
      enabled: o.enabled !== false,
      effects: effects,
      metadata: o.metadata || {}
    };
  };
  bridge.addRenderEffect = function(chain, effect){
    if (!chain || !effect) return chain;
    if (!Array.isArray(chain.effects)) chain.effects = [];
    chain.effects.push(effect);
    chain.effects.sort(function(a,b){ return (Number(a && a.priority)||0) - (Number(b && b.priority)||0); });
    return chain;
  };
  bridge.removeRenderEffect = function(chain, effectOrIndex){
    if (!chain || !Array.isArray(chain.effects)) return chain;
    var index = typeof effectOrIndex === 'number' ? effectOrIndex : chain.effects.indexOf(effectOrIndex);
    if (index >= 0 && index < chain.effects.length) chain.effects.splice(index, 1);
    return chain;
  };
  bridge.getRenderEffects = function(chain){
    return chain && Array.isArray(chain.effects) ? chain.effects.slice() : [];
  };

  // V1.01.53: renderer-neutral Render Asset / Model Resource API boundary.
  // Descriptor/query-only helpers. They do not load, replace, reparent, or
  // rebuild any existing game object or Character Model V2 hierarchy.
  bridge.createRenderAsset = function(options){
    var o = options || {};
    return {
      id: o.id != null ? String(o.id) : '',
      name: o.name != null ? String(o.name) : '',
      type: o.type != null ? String(o.type) : 'model',
      source: o.source != null ? String(o.source) : '',
      state: o.state != null ? String(o.state) : 'unloaded',
      enabled: o.enabled !== false,
      dependencies: Array.isArray(o.dependencies) ? o.dependencies.slice() : [],
      properties: o.properties && typeof o.properties === 'object' ? Object.assign({}, o.properties) : {},
      metadata: o.metadata && typeof o.metadata === 'object' ? Object.assign({}, o.metadata) : {}
    };
  };
  bridge.getRenderAssetProperty = function(asset, key){
    if (!asset || !key) return undefined;
    if (key === 'dependencies') return asset.dependencies;
    if (key === 'properties') return asset.properties;
    if (key === 'metadata') return asset.metadata;
    return asset[key];
  };
  bridge.setRenderAssetProperty = function(asset, key, value){
    if (!asset || !key) return asset;
    if (key === 'dependencies') asset.dependencies = Array.isArray(value) ? value.slice() : [];
    else if (key === 'properties') asset.properties = value && typeof value === 'object' ? value : {};
    else if (key === 'metadata') asset.metadata = value && typeof value === 'object' ? value : {};
    else asset[key] = value;
    return asset;
  };
  bridge.setRenderAssetState = function(asset, state){
    if (!asset) return asset;
    asset.state = state != null ? String(state) : 'unloaded';
    return asset;
  };
  bridge.getRenderAssetState = function(asset){
    return asset ? asset.state : undefined;
  };
  bridge.setRenderAssetEnabled = function(asset, enabled){
    if (!asset) return asset;
    asset.enabled = !!enabled;
    return asset;
  };
  bridge.getRenderAssetEnabled = function(asset){
    return asset ? asset.enabled !== false : false;
  };
  bridge.addRenderAssetDependency = function(asset, dependency){
    if (!asset || dependency == null) return asset;
    if (!Array.isArray(asset.dependencies)) asset.dependencies = [];
    if (asset.dependencies.indexOf(dependency) < 0) asset.dependencies.push(dependency);
    return asset;
  };
  bridge.removeRenderAssetDependency = function(asset, dependency){
    if (!asset || !Array.isArray(asset.dependencies)) return asset;
    asset.dependencies = asset.dependencies.filter(function(item){ return item !== dependency; });
    return asset;
  };
  bridge.getRenderAssetDependencies = function(asset){
    return asset && Array.isArray(asset.dependencies) ? asset.dependencies.slice() : [];
  };
  bridge.createRenderAssetRegistry = function(options){
    var o = options || {};
    return {
      id: o.id != null ? String(o.id) : '',
      name: o.name != null ? String(o.name) : '',
      assets: {},
      metadata: o.metadata && typeof o.metadata === 'object' ? Object.assign({}, o.metadata) : {}
    };
  };
  bridge.registerRenderAsset = function(registry, asset, id){
    if (!registry || !asset) return asset;
    if (!registry.assets || typeof registry.assets !== 'object') registry.assets = {};
    var key = id != null ? String(id) : (asset.id != null ? String(asset.id) : '');
    if (!key) return asset;
    registry.assets[key] = asset;
    return asset;
  };
  bridge.getRenderAsset = function(registry, id){
    if (!registry || !registry.assets || id == null) return undefined;
    return registry.assets[String(id)];
  };
  bridge.hasRenderAsset = function(registry, id){
    return !!(registry && registry.assets && id != null && Object.prototype.hasOwnProperty.call(registry.assets, String(id)));
  };
  bridge.releaseRenderAsset = function(registry, id){
    if (!registry || !registry.assets || id == null) return undefined;
    var key = String(id), asset = registry.assets[key];
    delete registry.assets[key];
    return asset;
  };
  bridge.clearRenderAssets = function(registry){
    if (!registry) return registry;
    registry.assets = {};
    return registry;
  };

  // V1.01.55: renderer-neutral Render Model Instance API boundary.
  // Descriptor/query-only helpers. They do not create, reparent, replace, or
  // rebuild any existing game object or Character Model V2 hierarchy.
  bridge.createRenderModelInstance = function(options){
    var o = options || {};
    return {
      id: o.id != null ? String(o.id) : '',
      name: o.name != null ? String(o.name) : '',
      assetId: o.assetId != null ? String(o.assetId) : '',
      state: o.state != null ? String(o.state) : 'unbound',
      enabled: o.enabled !== false,
      visible: o.visible !== false,
      properties: o.properties && typeof o.properties === 'object' ? Object.assign({}, o.properties) : {},
      metadata: o.metadata && typeof o.metadata === 'object' ? Object.assign({}, o.metadata) : {}
    };
  };
  bridge.getRenderModelInstanceProperty = function(instance, key){
    if (!instance || !key) return undefined;
    if (key === 'properties') return instance.properties;
    if (key === 'metadata') return instance.metadata;
    return instance[key];
  };
  bridge.setRenderModelInstanceProperty = function(instance, key, value){
    if (!instance || !key) return instance;
    if (key === 'properties') instance.properties = value && typeof value === 'object' ? value : {};
    else if (key === 'metadata') instance.metadata = value && typeof value === 'object' ? value : {};
    else instance[key] = value;
    return instance;
  };
  bridge.setRenderModelInstanceState = function(instance, state){
    if (!instance) return instance;
    instance.state = state != null ? String(state) : 'unbound';
    return instance;
  };
  bridge.getRenderModelInstanceState = function(instance){
    return instance ? instance.state : undefined;
  };
  bridge.setRenderModelInstanceEnabled = function(instance, enabled){
    if (!instance) return instance;
    instance.enabled = !!enabled;
    return instance;
  };
  bridge.getRenderModelInstanceEnabled = function(instance){
    return instance ? instance.enabled !== false : false;
  };
  bridge.setRenderModelInstanceVisible = function(instance, visible){
    if (!instance) return instance;
    instance.visible = !!visible;
    return instance;
  };
  bridge.getRenderModelInstanceVisible = function(instance){
    return instance ? instance.visible !== false : false;
  };
  bridge.createRenderModelInstanceRegistry = function(options){
    var o = options || {};
    return {
      id: o.id != null ? String(o.id) : '',
      name: o.name != null ? String(o.name) : '',
      instances: {},
      metadata: o.metadata && typeof o.metadata === 'object' ? Object.assign({}, o.metadata) : {}
    };
  };
  bridge.registerRenderModelInstance = function(registry, instance, id){
    if (!registry || !instance) return instance;
    if (!registry.instances || typeof registry.instances !== 'object') registry.instances = {};
    var key = id != null ? String(id) : (instance.id != null ? String(instance.id) : '');
    if (!key) return instance;
    registry.instances[key] = instance;
    return instance;
  };
  bridge.getRenderModelInstance = function(registry, id){
    if (!registry || !registry.instances || id == null) return undefined;
    return registry.instances[String(id)];
  };
  bridge.hasRenderModelInstance = function(registry, id){
    return !!(registry && registry.instances && id != null && Object.prototype.hasOwnProperty.call(registry.instances, String(id)));
  };
  bridge.releaseRenderModelInstance = function(registry, id){
    if (!registry || !registry.instances || id == null) return undefined;
    var key = String(id), instance = registry.instances[key];
    delete registry.instances[key];
    return instance;
  };
  bridge.clearRenderModelInstances = function(registry){
    if (!registry) return registry;
    registry.instances = {};
    return registry;
  };

  // V1.01.54: renderer-neutral Render Animation / Clip Resource API boundary.
  // Descriptor/query-only helpers. They do not bind, play, retarget, or modify
  // any existing Character Model V2 animation hierarchy.
  bridge.createRenderAnimationClip = function(options){
    var o = options || {};
    return {
      id: o.id != null ? String(o.id) : '',
      name: o.name != null ? String(o.name) : '',
      source: o.source != null ? String(o.source) : '',
      duration: Number(o.duration) || 0,
      state: o.state != null ? String(o.state) : 'unloaded',
      enabled: o.enabled !== false,
      loop: o.loop !== false,
      speed: o.speed == null ? 1 : Number(o.speed),
      properties: o.properties && typeof o.properties === 'object' ? Object.assign({}, o.properties) : {},
      metadata: o.metadata && typeof o.metadata === 'object' ? Object.assign({}, o.metadata) : {}
    };
  };
  bridge.getRenderAnimationClipProperty = function(clip, key){
    if (!clip || !key) return undefined;
    if (key === 'properties') return clip.properties;
    if (key === 'metadata') return clip.metadata;
    return clip[key];
  };
  bridge.setRenderAnimationClipProperty = function(clip, key, value){
    if (!clip || !key) return clip;
    if (key === 'properties') clip.properties = value && typeof value === 'object' ? value : {};
    else if (key === 'metadata') clip.metadata = value && typeof value === 'object' ? value : {};
    else clip[key] = value;
    return clip;
  };
  bridge.setRenderAnimationClipState = function(clip, state){
    if (!clip) return clip;
    clip.state = state != null ? String(state) : 'unloaded';
    return clip;
  };
  bridge.getRenderAnimationClipState = function(clip){
    return clip ? clip.state : undefined;
  };
  bridge.setRenderAnimationClipEnabled = function(clip, enabled){
    if (!clip) return clip;
    clip.enabled = !!enabled;
    return clip;
  };
  bridge.getRenderAnimationClipEnabled = function(clip){
    return clip ? clip.enabled !== false : false;
  };
  bridge.setRenderAnimationClipLoop = function(clip, loop){
    if (!clip) return clip;
    clip.loop = !!loop;
    return clip;
  };
  bridge.getRenderAnimationClipLoop = function(clip){
    return clip ? clip.loop !== false : false;
  };
  bridge.setRenderAnimationClipSpeed = function(clip, speed){
    if (!clip) return clip;
    var value = Number(speed);
    if (isFinite(value)) clip.speed = value;
    return clip;
  };
  bridge.getRenderAnimationClipSpeed = function(clip){
    return clip ? clip.speed : undefined;
  };
  bridge.createRenderAnimationRegistry = function(options){
    var o = options || {};
    return {
      id: o.id != null ? String(o.id) : '',
      name: o.name != null ? String(o.name) : '',
      clips: {},
      metadata: o.metadata && typeof o.metadata === 'object' ? Object.assign({}, o.metadata) : {}
    };
  };
  bridge.registerRenderAnimationClip = function(registry, clip, id){
    if (!registry || !clip) return clip;
    if (!registry.clips || typeof registry.clips !== 'object') registry.clips = {};
    var key = id != null ? String(id) : (clip.id != null ? String(clip.id) : '');
    if (!key) return clip;
    registry.clips[key] = clip;
    return clip;
  };
  bridge.getRenderAnimationClip = function(registry, id){
    if (!registry || !registry.clips || id == null) return undefined;
    return registry.clips[String(id)];
  };
  bridge.hasRenderAnimationClip = function(registry, id){
    return !!(registry && registry.clips && id != null && Object.prototype.hasOwnProperty.call(registry.clips, String(id)));
  };
  bridge.releaseRenderAnimationClip = function(registry, id){
    if (!registry || !registry.clips || id == null) return undefined;
    var key = String(id), clip = registry.clips[key];
    delete registry.clips[key];
    return clip;
  };
  bridge.clearRenderAnimationClips = function(registry){
    if (!registry) return registry;
    registry.clips = {};
    return registry;
  };

  // V1.01.56: renderer-neutral Render Animation Controller API boundary.
  // Descriptor/query-only helpers. They do not start/stop/rebind any existing
  // Character Model V2 animation or alter the live gameplay animation loop.
  bridge.createRenderAnimationController = function(options){
    var o = options || {};
    return {
      id: o.id != null ? String(o.id) : '',
      name: o.name != null ? String(o.name) : '',
      state: o.state != null ? String(o.state) : 'idle',
      enabled: o.enabled !== false,
      playing: !!o.playing,
      clipId: o.clipId != null ? String(o.clipId) : '',
      time: Number(o.time) || 0,
      speed: o.speed == null ? 1 : Number(o.speed),
      loop: o.loop !== false,
      properties: o.properties && typeof o.properties === 'object' ? Object.assign({}, o.properties) : {},
      metadata: o.metadata && typeof o.metadata === 'object' ? Object.assign({}, o.metadata) : {}
    };
  };
  bridge.getRenderAnimationControllerProperty = function(controller, key){
    if (!controller || !key) return undefined;
    if (key === 'properties') return controller.properties;
    if (key === 'metadata') return controller.metadata;
    return controller[key];
  };
  bridge.setRenderAnimationControllerProperty = function(controller, key, value){
    if (!controller || !key) return controller;
    if (key === 'properties') controller.properties = value && typeof value === 'object' ? value : {};
    else if (key === 'metadata') controller.metadata = value && typeof value === 'object' ? value : {};
    else controller[key] = value;
    return controller;
  };
  bridge.setRenderAnimationControllerState = function(controller, state){
    if (!controller) return controller;
    controller.state = state != null ? String(state) : 'idle';
    return controller;
  };
  bridge.getRenderAnimationControllerState = function(controller){ return controller ? controller.state : undefined; };
  bridge.setRenderAnimationControllerEnabled = function(controller, enabled){
    if (!controller) return controller; controller.enabled = !!enabled; return controller;
  };
  bridge.getRenderAnimationControllerEnabled = function(controller){ return controller ? controller.enabled !== false : false; };
  bridge.setRenderAnimationControllerPlaying = function(controller, playing){
    if (!controller) return controller; controller.playing = !!playing; return controller;
  };
  bridge.getRenderAnimationControllerPlaying = function(controller){ return controller ? !!controller.playing : false; };
  bridge.setRenderAnimationControllerClip = function(controller, clipId){
    if (!controller) return controller; controller.clipId = clipId != null ? String(clipId) : ''; return controller;
  };
  bridge.getRenderAnimationControllerClip = function(controller){ return controller ? controller.clipId : undefined; };
  bridge.setRenderAnimationControllerTime = function(controller, time){
    if (!controller) return controller; var value = Number(time); controller.time = isFinite(value) ? value : 0; return controller;
  };
  bridge.getRenderAnimationControllerTime = function(controller){ return controller ? controller.time : undefined; };
  bridge.setRenderAnimationControllerSpeed = function(controller, speed){
    if (!controller) return controller; var value = Number(speed); controller.speed = isFinite(value) ? value : 1; return controller;
  };
  bridge.getRenderAnimationControllerSpeed = function(controller){ return controller ? controller.speed : undefined; };
  bridge.setRenderAnimationControllerLoop = function(controller, loop){
    if (!controller) return controller; controller.loop = !!loop; return controller;
  };
  bridge.getRenderAnimationControllerLoop = function(controller){ return controller ? controller.loop !== false : false; };
  bridge.createRenderAnimationControllerRegistry = function(options){
    var o = options || {};
    return { id:o.id != null ? String(o.id) : '', name:o.name != null ? String(o.name) : '', controllers:{}, metadata:o.metadata && typeof o.metadata === 'object' ? Object.assign({}, o.metadata) : {} };
  };
  bridge.registerRenderAnimationController = function(registry, controller, id){
    if (!registry || !controller) return controller;
    if (!registry.controllers || typeof registry.controllers !== 'object') registry.controllers = {};
    var key = id != null ? String(id) : (controller.id != null ? String(controller.id) : '');
    if (!key) return controller; registry.controllers[key] = controller; return controller;
  };
  bridge.getRenderAnimationController = function(registry, id){ return registry && registry.controllers && id != null ? registry.controllers[String(id)] : undefined; };
  bridge.hasRenderAnimationController = function(registry, id){ return !!(registry && registry.controllers && id != null && Object.prototype.hasOwnProperty.call(registry.controllers, String(id))); };
  bridge.releaseRenderAnimationController = function(registry, id){
    if (!registry || !registry.controllers || id == null) return undefined; var key=String(id), controller=registry.controllers[key]; delete registry.controllers[key]; return controller;
  };
  bridge.clearRenderAnimationControllers = function(registry){ if (!registry) return registry; registry.controllers = {}; return registry; };

  // V1.01.57: renderer-neutral Render Animation State Machine API boundary.
  // Descriptor/query-only helpers. They do not drive, replace, or rebind any
  // existing Character Model V2 animation runtime.
  bridge.createRenderAnimationStateMachine = function(options){
    var o = options || {};
    return {
      id: o.id != null ? String(o.id) : '',
      name: o.name != null ? String(o.name) : '',
      state: o.state != null ? String(o.state) : 'idle',
      enabled: o.enabled !== false,
      currentState: o.currentState != null ? String(o.currentState) : '',
      states: o.states && typeof o.states === 'object' ? Object.assign({}, o.states) : {},
      transitions: Array.isArray(o.transitions) ? o.transitions.slice() : [],
      parameters: o.parameters && typeof o.parameters === 'object' ? Object.assign({}, o.parameters) : {},
      properties: o.properties && typeof o.properties === 'object' ? Object.assign({}, o.properties) : {},
      metadata: o.metadata && typeof o.metadata === 'object' ? Object.assign({}, o.metadata) : {}
    };
  };
  bridge.getRenderAnimationStateMachineProperty = function(machine, key){
    if (!machine || !key) return undefined;
    if (key === 'states') return machine.states;
    if (key === 'transitions') return machine.transitions;
    if (key === 'parameters') return machine.parameters;
    if (key === 'properties') return machine.properties;
    if (key === 'metadata') return machine.metadata;
    return machine[key];
  };
  bridge.setRenderAnimationStateMachineProperty = function(machine, key, value){
    if (!machine || !key) return machine;
    if (key === 'states') machine.states = value && typeof value === 'object' ? value : {};
    else if (key === 'transitions') machine.transitions = Array.isArray(value) ? value.slice() : [];
    else if (key === 'parameters') machine.parameters = value && typeof value === 'object' ? value : {};
    else if (key === 'properties') machine.properties = value && typeof value === 'object' ? value : {};
    else if (key === 'metadata') machine.metadata = value && typeof value === 'object' ? value : {};
    else machine[key] = value;
    return machine;
  };
  bridge.setRenderAnimationStateMachineState = function(machine, state){
    if (!machine) return machine;
    machine.state = state != null ? String(state) : 'idle';
    return machine;
  };
  bridge.getRenderAnimationStateMachineState = function(machine){ return machine ? machine.state : undefined; };
  bridge.setRenderAnimationStateMachineEnabled = function(machine, enabled){
    if (!machine) return machine;
    machine.enabled = !!enabled;
    return machine;
  };
  bridge.getRenderAnimationStateMachineEnabled = function(machine){ return machine ? machine.enabled !== false : false; };
  bridge.setRenderAnimationStateMachineCurrentState = function(machine, state){
    if (!machine) return machine;
    machine.currentState = state != null ? String(state) : '';
    return machine;
  };
  bridge.getRenderAnimationStateMachineCurrentState = function(machine){ return machine ? machine.currentState : undefined; };
  bridge.addRenderAnimationState = function(machine, id, definition){
    if (!machine || id == null) return machine;
    if (!machine.states || typeof machine.states !== 'object') machine.states = {};
    machine.states[String(id)] = definition;
    return machine;
  };
  bridge.removeRenderAnimationState = function(machine, id){
    if (!machine || !machine.states || id == null) return machine;
    delete machine.states[String(id)];
    return machine;
  };
  bridge.getRenderAnimationStates = function(machine){
    if (!machine || !machine.states) return {};
    return Object.assign({}, machine.states);
  };
  bridge.addRenderAnimationTransition = function(machine, transition){
    if (!machine || !transition) return machine;
    if (!Array.isArray(machine.transitions)) machine.transitions = [];
    machine.transitions.push(transition);
    return machine;
  };
  bridge.removeRenderAnimationTransition = function(machine, transition){
    if (!machine || !Array.isArray(machine.transitions)) return machine;
    var index = machine.transitions.indexOf(transition);
    if (index >= 0) machine.transitions.splice(index, 1);
    return machine;
  };
  bridge.getRenderAnimationTransitions = function(machine){
    return machine && Array.isArray(machine.transitions) ? machine.transitions.slice() : [];
  };
  bridge.setRenderAnimationParameter = function(machine, key, value){
    if (!machine || !key) return machine;
    if (!machine.parameters || typeof machine.parameters !== 'object') machine.parameters = {};
    machine.parameters[key] = value;
    return machine;
  };
  bridge.getRenderAnimationParameter = function(machine, key){
    if (!machine || !machine.parameters || !key) return undefined;
    return machine.parameters[key];
  };
  bridge.createRenderAnimationStateMachineRegistry = function(options){
    var o = options || {};
    return { id:o.id != null ? String(o.id) : '', name:o.name != null ? String(o.name) : '', machines:{}, metadata:o.metadata && typeof o.metadata === 'object' ? Object.assign({}, o.metadata) : {} };
  };
  bridge.registerRenderAnimationStateMachine = function(registry, machine, id){
    if (!registry || !machine) return machine;
    if (!registry.machines || typeof registry.machines !== 'object') registry.machines = {};
    var key = id != null ? String(id) : (machine.id != null ? String(machine.id) : '');
    if (!key) return machine;
    registry.machines[key] = machine;
    return machine;
  };
  bridge.getRenderAnimationStateMachine = function(registry, id){ return registry && registry.machines && id != null ? registry.machines[String(id)] : undefined; };
  bridge.hasRenderAnimationStateMachine = function(registry, id){ return !!(registry && registry.machines && id != null && Object.prototype.hasOwnProperty.call(registry.machines, String(id))); };
  bridge.releaseRenderAnimationStateMachine = function(registry, id){
    if (!registry || !registry.machines || id == null) return undefined;
    var key=String(id), machine=registry.machines[key];
    delete registry.machines[key];
    return machine;
  };
  bridge.clearRenderAnimationStateMachines = function(registry){ if (!registry) return registry; registry.machines = {}; return registry; };

  // V1.01.58: renderer-neutral Render Animation Layer / Blend API boundary.
  // Descriptor/query-only helpers. They do not drive, replace, or rebind any
  // existing Character Model V2 animation runtime.
  bridge.createRenderAnimationLayer = function(options){
    var o = options || {};
    return {
      id: o.id != null ? String(o.id) : '',
      name: o.name != null ? String(o.name) : '',
      state: o.state != null ? String(o.state) : 'idle',
      enabled: o.enabled !== false,
      weight: o.weight != null ? Number(o.weight) : 1,
      blendMode: o.blendMode != null ? String(o.blendMode) : 'override',
      mask: o.mask && typeof o.mask === 'object' ? Object.assign({}, o.mask) : {},
      clips: Array.isArray(o.clips) ? o.clips.slice() : [],
      parameters: o.parameters && typeof o.parameters === 'object' ? Object.assign({}, o.parameters) : {},
      properties: o.properties && typeof o.properties === 'object' ? Object.assign({}, o.properties) : {},
      metadata: o.metadata && typeof o.metadata === 'object' ? Object.assign({}, o.metadata) : {}
    };
  };
  bridge.getRenderAnimationLayerProperty = function(layer, key){
    if (!layer || !key) return undefined;
    if (key === 'mask') return layer.mask;
    if (key === 'clips') return layer.clips;
    if (key === 'parameters') return layer.parameters;
    if (key === 'properties') return layer.properties;
    if (key === 'metadata') return layer.metadata;
    return layer[key];
  };
  bridge.setRenderAnimationLayerProperty = function(layer, key, value){
    if (!layer || !key) return layer;
    if (key === 'mask') layer.mask = value && typeof value === 'object' ? value : {};
    else if (key === 'clips') layer.clips = Array.isArray(value) ? value.slice() : [];
    else if (key === 'parameters') layer.parameters = value && typeof value === 'object' ? value : {};
    else if (key === 'properties') layer.properties = value && typeof value === 'object' ? value : {};
    else if (key === 'metadata') layer.metadata = value && typeof value === 'object' ? value : {};
    else layer[key] = value;
    return layer;
  };
  bridge.setRenderAnimationLayerState = function(layer, state){
    if (!layer) return layer;
    layer.state = state != null ? String(state) : 'idle';
    return layer;
  };
  bridge.getRenderAnimationLayerState = function(layer){ return layer ? layer.state : undefined; };
  bridge.setRenderAnimationLayerEnabled = function(layer, enabled){
    if (!layer) return layer;
    layer.enabled = !!enabled;
    return layer;
  };
  bridge.getRenderAnimationLayerEnabled = function(layer){ return layer ? layer.enabled !== false : false; };
  bridge.setRenderAnimationLayerWeight = function(layer, weight){
    if (!layer) return layer;
    var value = Number(weight);
    layer.weight = isFinite(value) ? value : 1;
    return layer;
  };
  bridge.getRenderAnimationLayerWeight = function(layer){ return layer ? layer.weight : undefined; };
  bridge.setRenderAnimationLayerBlendMode = function(layer, mode){
    if (!layer) return layer;
    layer.blendMode = mode != null ? String(mode) : 'override';
    return layer;
  };
  bridge.getRenderAnimationLayerBlendMode = function(layer){ return layer ? layer.blendMode : undefined; };
  bridge.setRenderAnimationLayerMask = function(layer, mask){
    if (!layer) return layer;
    layer.mask = mask && typeof mask === 'object' ? mask : {};
    return layer;
  };
  bridge.getRenderAnimationLayerMask = function(layer){ return layer && layer.mask ? Object.assign({}, layer.mask) : {}; };
  bridge.addRenderAnimationLayerClip = function(layer, clip){
    if (!layer || clip == null) return layer;
    if (!Array.isArray(layer.clips)) layer.clips = [];
    if (layer.clips.indexOf(clip) < 0) layer.clips.push(clip);
    return layer;
  };
  bridge.removeRenderAnimationLayerClip = function(layer, clip){
    if (!layer || !Array.isArray(layer.clips)) return layer;
    layer.clips = layer.clips.filter(function(item){ return item !== clip; });
    return layer;
  };
  bridge.getRenderAnimationLayerClips = function(layer){
    return layer && Array.isArray(layer.clips) ? layer.clips.slice() : [];
  };
  bridge.setRenderAnimationLayerParameter = function(layer, key, value){
    if (!layer || !key) return layer;
    if (!layer.parameters || typeof layer.parameters !== 'object') layer.parameters = {};
    layer.parameters[key] = value;
    return layer;
  };
  bridge.getRenderAnimationLayerParameter = function(layer, key){
    if (!layer || !layer.parameters || !key) return undefined;
    return layer.parameters[key];
  };
  bridge.createRenderAnimationLayerRegistry = function(options){
    var o = options || {};
    return { id:o.id != null ? String(o.id) : '', name:o.name != null ? String(o.name) : '', layers:{}, metadata:o.metadata && typeof o.metadata === 'object' ? Object.assign({}, o.metadata) : {} };
  };
  bridge.registerRenderAnimationLayer = function(registry, layer, id){
    if (!registry || !layer) return layer;
    if (!registry.layers || typeof registry.layers !== 'object') registry.layers = {};
    var key = id != null ? String(id) : (layer.id != null ? String(layer.id) : '');
    if (!key) return layer;
    registry.layers[key] = layer;
    return layer;
  };
  bridge.getRenderAnimationLayer = function(registry, id){ return registry && registry.layers && id != null ? registry.layers[String(id)] : undefined; };
  bridge.hasRenderAnimationLayer = function(registry, id){ return !!(registry && registry.layers && id != null && Object.prototype.hasOwnProperty.call(registry.layers, String(id))); };
  bridge.releaseRenderAnimationLayer = function(registry, id){
    if (!registry || !registry.layers || id == null) return undefined;
    var key=String(id), layer=registry.layers[key];
    delete registry.layers[key];
    return layer;
  };
  bridge.clearRenderAnimationLayers = function(registry){ if (!registry) return registry; registry.layers = {}; return registry; };

  // V1.01.59: renderer-neutral Render Animation Event / Marker API boundary.
  // Descriptor/query-only helpers. They do not execute callbacks, mutate clips,
  // or connect to the existing Character Model V2 animation runtime.
  bridge.createRenderAnimationMarker = function(options){
    var o = options || {};
    return {
      id: o.id != null ? String(o.id) : '',
      name: o.name != null ? String(o.name) : '',
      time: o.time != null ? Number(o.time) : 0,
      type: o.type != null ? String(o.type) : 'marker',
      enabled: o.enabled !== false,
      data: o.data && typeof o.data === 'object' ? Object.assign({}, o.data) : {},
      properties: o.properties && typeof o.properties === 'object' ? Object.assign({}, o.properties) : {},
      metadata: o.metadata && typeof o.metadata === 'object' ? Object.assign({}, o.metadata) : {}
    };
  };
  bridge.getRenderAnimationMarkerProperty = function(marker, key){
    if (!marker || !key) return undefined;
    if (key === 'data') return marker.data;
    if (key === 'properties') return marker.properties;
    if (key === 'metadata') return marker.metadata;
    return marker[key];
  };
  bridge.setRenderAnimationMarkerProperty = function(marker, key, value){
    if (!marker || !key) return marker;
    if (key === 'data') marker.data = value && typeof value === 'object' ? value : {};
    else if (key === 'properties') marker.properties = value && typeof value === 'object' ? value : {};
    else if (key === 'metadata') marker.metadata = value && typeof value === 'object' ? value : {};
    else marker[key] = value;
    return marker;
  };
  bridge.setRenderAnimationMarkerEnabled = function(marker, enabled){
    if (!marker) return marker;
    marker.enabled = !!enabled;
    return marker;
  };
  bridge.getRenderAnimationMarkerEnabled = function(marker){ return marker ? marker.enabled !== false : false; };
  bridge.setRenderAnimationMarkerTime = function(marker, time){
    if (!marker) return marker;
    var value = Number(time);
    marker.time = isFinite(value) ? value : 0;
    return marker;
  };
  bridge.getRenderAnimationMarkerTime = function(marker){ return marker ? marker.time : undefined; };
  bridge.createRenderAnimationMarkerRegistry = function(options){
    var o = options || {};
    return { id:o.id != null ? String(o.id) : '', name:o.name != null ? String(o.name) : '', markers:{}, metadata:o.metadata && typeof o.metadata === 'object' ? Object.assign({}, o.metadata) : {} };
  };
  bridge.registerRenderAnimationMarker = function(registry, marker, id){
    if (!registry || !marker) return marker;
    if (!registry.markers || typeof registry.markers !== 'object') registry.markers = {};
    var key = id != null ? String(id) : (marker.id != null ? String(marker.id) : '');
    if (!key) return marker;
    registry.markers[key] = marker;
    return marker;
  };
  bridge.getRenderAnimationMarker = function(registry, id){ return registry && registry.markers && id != null ? registry.markers[String(id)] : undefined; };
  bridge.hasRenderAnimationMarker = function(registry, id){ return !!(registry && registry.markers && id != null && Object.prototype.hasOwnProperty.call(registry.markers, String(id))); };
  bridge.releaseRenderAnimationMarker = function(registry, id){
    if (!registry || !registry.markers || id == null) return undefined;
    var key=String(id), marker=registry.markers[key];
    delete registry.markers[key];
    return marker;
  };
  bridge.clearRenderAnimationMarkers = function(registry){ if (!registry) return registry; registry.markers = {}; return registry; };

  // V1.01.60: renderer-neutral Render Animation Event Binding API boundary.
  // Descriptor/query-only helpers. They do not execute callbacks, attach to
  // existing animation runtimes, or modify Character Model V2.
  bridge.createRenderAnimationEventBinding = function(options){
    var o = options || {};
    return {
      id: o.id != null ? String(o.id) : '',
      name: o.name != null ? String(o.name) : '',
      markerId: o.markerId != null ? String(o.markerId) : '',
      eventType: o.eventType != null ? String(o.eventType) : 'marker',
      enabled: o.enabled !== false,
      payload: o.payload && typeof o.payload === 'object' ? Object.assign({}, o.payload) : {},
      metadata: o.metadata && typeof o.metadata === 'object' ? Object.assign({}, o.metadata) : {}
    };
  };
  bridge.getRenderAnimationEventBindingProperty = function(binding, key){
    if (!binding || !key) return undefined;
    if (key === 'payload') return binding.payload;
    if (key === 'metadata') return binding.metadata;
    return binding[key];
  };
  bridge.setRenderAnimationEventBindingProperty = function(binding, key, value){
    if (!binding || !key) return binding;
    if (key === 'payload') binding.payload = value && typeof value === 'object' ? value : {};
    else if (key === 'metadata') binding.metadata = value && typeof value === 'object' ? value : {};
    else binding[key] = value;
    return binding;
  };
  bridge.setRenderAnimationEventBindingEnabled = function(binding, enabled){
    if (!binding) return binding;
    binding.enabled = !!enabled;
    return binding;
  };
  bridge.getRenderAnimationEventBindingEnabled = function(binding){
    return binding ? binding.enabled !== false : false;
  };
  bridge.setRenderAnimationEventBindingMarker = function(binding, markerId){
    if (!binding) return binding;
    binding.markerId = markerId != null ? String(markerId) : '';
    return binding;
  };
  bridge.getRenderAnimationEventBindingMarker = function(binding){
    return binding ? binding.markerId : undefined;
  };
  bridge.createRenderAnimationEventBindingRegistry = function(options){
    var o = options || {};
    return {
      id: o.id != null ? String(o.id) : '',
      name: o.name != null ? String(o.name) : '',
      bindings: {},
      metadata: o.metadata && typeof o.metadata === 'object' ? Object.assign({}, o.metadata) : {}
    };
  };
  bridge.registerRenderAnimationEventBinding = function(registry, binding, id){
    if (!registry || !binding) return binding;
    if (!registry.bindings || typeof registry.bindings !== 'object') registry.bindings = {};
    var key = id != null ? String(id) : (binding.id != null ? String(binding.id) : '');
    if (!key) return binding;
    registry.bindings[key] = binding;
    return binding;
  };
  bridge.getRenderAnimationEventBinding = function(registry, id){
    if (!registry || !registry.bindings || id == null) return undefined;
    return registry.bindings[String(id)];
  };
  bridge.hasRenderAnimationEventBinding = function(registry, id){
    return !!(registry && registry.bindings && id != null && Object.prototype.hasOwnProperty.call(registry.bindings, String(id)));
  };
  bridge.releaseRenderAnimationEventBinding = function(registry, id){
    if (!registry || !registry.bindings || id == null) return undefined;
    var key = String(id), binding = registry.bindings[key];
    delete registry.bindings[key];
    return binding;
  };
  bridge.clearRenderAnimationEventBindings = function(registry){
    if (!registry) return registry;
    registry.bindings = {};
    return registry;
  };

  // V1.01.61: renderer-neutral Render Animation Timeline / Keyframe API boundary.
  // Descriptor/query-only helpers. They do not alter existing animation data,
  // evaluate timelines, or modify Character Model V2.
  bridge.createRenderAnimationTimeline = function(options){
    var o = options || {};
    return {
      id: o.id != null ? String(o.id) : '',
      name: o.name != null ? String(o.name) : '',
      duration: Number.isFinite(o.duration) ? Math.max(0, o.duration) : 0,
      enabled: o.enabled !== false,
      tracks: Array.isArray(o.tracks) ? o.tracks.slice() : [],
      metadata: o.metadata && typeof o.metadata === 'object' ? Object.assign({}, o.metadata) : {}
    };
  };
  bridge.getRenderAnimationTimelineProperty = function(timeline, key){
    if (!timeline || !key) return undefined;
    if (key === 'tracks') return timeline.tracks;
    if (key === 'metadata') return timeline.metadata;
    return timeline[key];
  };
  bridge.setRenderAnimationTimelineProperty = function(timeline, key, value){
    if (!timeline || !key) return timeline;
    if (key === 'tracks') timeline.tracks = Array.isArray(value) ? value.slice() : [];
    else if (key === 'metadata') timeline.metadata = value && typeof value === 'object' ? value : {};
    else timeline[key] = value;
    return timeline;
  };
  bridge.setRenderAnimationTimelineEnabled = function(timeline, enabled){
    if (!timeline) return timeline;
    timeline.enabled = !!enabled;
    return timeline;
  };
  bridge.getRenderAnimationTimelineEnabled = function(timeline){
    return timeline ? timeline.enabled !== false : false;
  };
  bridge.setRenderAnimationTimelineDuration = function(timeline, duration){
    if (!timeline) return timeline;
    var value = Number(duration);
    timeline.duration = Number.isFinite(value) ? Math.max(0, value) : 0;
    return timeline;
  };
  bridge.getRenderAnimationTimelineDuration = function(timeline){
    return timeline ? timeline.duration : undefined;
  };
  bridge.addRenderAnimationTrack = function(timeline, track){
    if (!timeline || track == null) return timeline;
    if (!Array.isArray(timeline.tracks)) timeline.tracks = [];
    timeline.tracks.push(track);
    return timeline;
  };
  bridge.removeRenderAnimationTrack = function(timeline, track){
    if (!timeline || !Array.isArray(timeline.tracks)) return timeline;
    var index = timeline.tracks.indexOf(track);
    if (index >= 0) timeline.tracks.splice(index, 1);
    return timeline;
  };
  bridge.getRenderAnimationTracks = function(timeline){
    return timeline && Array.isArray(timeline.tracks) ? timeline.tracks.slice() : [];
  };
  bridge.createRenderAnimationKeyframe = function(options){
    var o = options || {};
    return {
      id: o.id != null ? String(o.id) : '',
      time: Number.isFinite(o.time) ? Math.max(0, o.time) : 0,
      value: o.value,
      interpolation: o.interpolation != null ? String(o.interpolation) : 'linear',
      enabled: o.enabled !== false,
      metadata: o.metadata && typeof o.metadata === 'object' ? Object.assign({}, o.metadata) : {}
    };
  };
  bridge.getRenderAnimationKeyframeProperty = function(keyframe, key){
    if (!keyframe || !key) return undefined;
    if (key === 'metadata') return keyframe.metadata;
    return keyframe[key];
  };
  bridge.setRenderAnimationKeyframeProperty = function(keyframe, key, value){
    if (!keyframe || !key) return keyframe;
    if (key === 'metadata') keyframe.metadata = value && typeof value === 'object' ? value : {};
    else keyframe[key] = value;
    return keyframe;
  };
  bridge.setRenderAnimationKeyframeTime = function(keyframe, time){
    if (!keyframe) return keyframe;
    var value = Number(time);
    keyframe.time = Number.isFinite(value) ? Math.max(0, value) : 0;
    return keyframe;
  };
  bridge.getRenderAnimationKeyframeTime = function(keyframe){
    return keyframe ? keyframe.time : undefined;
  };
  bridge.setRenderAnimationKeyframeEnabled = function(keyframe, enabled){
    if (!keyframe) return keyframe;
    keyframe.enabled = !!enabled;
    return keyframe;
  };
  bridge.getRenderAnimationKeyframeEnabled = function(keyframe){
    return keyframe ? keyframe.enabled !== false : false;
  };
  bridge.createRenderAnimationTimelineRegistry = function(options){
    var o = options || {};
    return {
      id: o.id != null ? String(o.id) : '',
      name: o.name != null ? String(o.name) : '',
      timelines: {},
      metadata: o.metadata && typeof o.metadata === 'object' ? Object.assign({}, o.metadata) : {}
    };
  };
  bridge.registerRenderAnimationTimeline = function(registry, timeline, id){
    if (!registry || !timeline) return timeline;
    if (!registry.timelines || typeof registry.timelines !== 'object') registry.timelines = {};
    var key = id != null ? String(id) : (timeline.id != null ? String(timeline.id) : '');
    if (!key) return timeline;
    registry.timelines[key] = timeline;
    return timeline;
  };
  bridge.getRenderAnimationTimeline = function(registry, id){
    if (!registry || !registry.timelines || id == null) return undefined;
    return registry.timelines[String(id)];
  };
  bridge.hasRenderAnimationTimeline = function(registry, id){
    return !!(registry && registry.timelines && id != null && Object.prototype.hasOwnProperty.call(registry.timelines, String(id)));
  };
  bridge.releaseRenderAnimationTimeline = function(registry, id){
    if (!registry || !registry.timelines || id == null) return undefined;
    var key = String(id), timeline = registry.timelines[key];
    delete registry.timelines[key];
    return timeline;
  };
  bridge.clearRenderAnimationTimelines = function(registry){
    if (!registry) return registry;
    registry.timelines = {};
    return registry;
  };

  // V1.01.64: renderer-neutral Render Model / Skeleton / Skinning system boundary.
  // Descriptor/query-only helpers. They do not inspect, reparent, rebuild, or
  // replace any existing Character Model V2 hierarchy or live render objects.
  bridge.createRenderSkeleton = function(options){
    var o=options||{};
    return {id:o.id!=null?String(o.id):'',name:o.name!=null?String(o.name):'AsgardSkeleton',enabled:o.enabled!==false,bones:{},rootBone:o.rootBone!=null?String(o.rootBone):'',metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}};
  };
  bridge.getRenderSkeletonProperty = function(skeleton,key){
    if(!skeleton||!key) return undefined;
    if(key==='bones') return skeleton.bones;
    if(key==='metadata') return skeleton.metadata;
    return skeleton[key];
  };
  bridge.setRenderSkeletonProperty = function(skeleton,key,value){
    if(!skeleton||!key) return skeleton;
    if(key==='bones') skeleton.bones=value&&typeof value==='object'?value:{};
    else if(key==='metadata') skeleton.metadata=value&&typeof value==='object'?value:{};
    else skeleton[key]=value;
    return skeleton;
  };
  bridge.setRenderSkeletonEnabled=function(skeleton,enabled){ if(!skeleton) return skeleton; skeleton.enabled=!!enabled; return skeleton; };
  bridge.getRenderSkeletonEnabled=function(skeleton){ return skeleton?skeleton.enabled!==false:false; };
  bridge.addRenderBone=function(skeleton,bone,id){
    if(!skeleton||!bone) return bone;
    if(!skeleton.bones||typeof skeleton.bones!=='object') skeleton.bones={};
    var key=id!=null?String(id):(bone.id!=null?String(bone.id):'');
    if(!key) return bone;
    skeleton.bones[key]=bone; return bone;
  };
  bridge.removeRenderBone=function(skeleton,id){
    if(!skeleton||!skeleton.bones||id==null) return undefined;
    var key=String(id),bone=skeleton.bones[key]; delete skeleton.bones[key]; return bone;
  };
  bridge.getRenderBones=function(skeleton){ return skeleton&&skeleton.bones?Object.keys(skeleton.bones).map(function(k){return skeleton.bones[k];}):[]; };
  bridge.setRenderSkeletonRootBone=function(skeleton,id){ if(!skeleton) return skeleton; skeleton.rootBone=id!=null?String(id):''; return skeleton; };
  bridge.getRenderSkeletonRootBone=function(skeleton){ return skeleton?skeleton.rootBone:undefined; };
  bridge.createRenderSkeletonRegistry=function(options){ var o=options||{}; return {id:o.id!=null?String(o.id):'',name:o.name!=null?String(o.name):'AsgardSkeletonRegistry',skeletons:{},metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}}; };
  bridge.registerRenderSkeleton=function(registry,skeleton,id){ if(!registry||!skeleton) return skeleton; if(!registry.skeletons||typeof registry.skeletons!=='object') registry.skeletons={}; var key=id!=null?String(id):(skeleton.id!=null?String(skeleton.id):''); if(!key) return skeleton; registry.skeletons[key]=skeleton; return skeleton; };
  bridge.getRenderSkeleton=function(registry,id){ return registry&&registry.skeletons&&id!=null?registry.skeletons[String(id)]:undefined; };
  bridge.hasRenderSkeleton=function(registry,id){ return !!(registry&&registry.skeletons&&id!=null&&Object.prototype.hasOwnProperty.call(registry.skeletons,String(id))); };
  bridge.releaseRenderSkeleton=function(registry,id){ if(!registry||!registry.skeletons||id==null) return undefined; var key=String(id),skeleton=registry.skeletons[key]; delete registry.skeletons[key]; return skeleton; };
  bridge.clearRenderSkeletons=function(registry){ if(registry) registry.skeletons={}; return registry; };

  bridge.createRenderSkinning=function(options){ var o=options||{}; return {id:o.id!=null?String(o.id):'',name:o.name!=null?String(o.name):'AsgardSkinning',enabled:o.enabled!==false,skeleton:o.skeleton||null,influences:o.influences&&typeof o.influences==='object'?Object.assign({},o.influences):{},properties:o.properties&&typeof o.properties==='object'?Object.assign({},o.properties):{},metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}}; };
  bridge.getRenderSkinningProperty=function(skinning,key){ if(!skinning||!key) return undefined; if(key==='influences') return skinning.influences; if(key==='properties') return skinning.properties; if(key==='metadata') return skinning.metadata; return skinning[key]; };
  bridge.setRenderSkinningProperty=function(skinning,key,value){ if(!skinning||!key) return skinning; if(key==='influences'||key==='properties'||key==='metadata') skinning[key]=value&&typeof value==='object'?value:{}; else skinning[key]=value; return skinning; };
  bridge.setRenderSkinningEnabled=function(skinning,enabled){ if(!skinning) return skinning; skinning.enabled=!!enabled; return skinning; };
  bridge.getRenderSkinningEnabled=function(skinning){ return skinning?skinning.enabled!==false:false; };
  bridge.setRenderSkinningSkeleton=function(skinning,skeleton){ if(!skinning) return skinning; skinning.skeleton=skeleton||null; return skinning; };
  bridge.getRenderSkinningSkeleton=function(skinning){ return skinning?skinning.skeleton:undefined; };
  bridge.createRenderSkinningRegistry=function(options){ var o=options||{}; return {id:o.id!=null?String(o.id):'',name:o.name!=null?String(o.name):'AsgardSkinningRegistry',skinnings:{},metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}}; };
  bridge.registerRenderSkinning=function(registry,skinning,id){ if(!registry||!skinning) return skinning; if(!registry.skinnings||typeof registry.skinnings!=='object') registry.skinnings={}; var key=id!=null?String(id):(skinning.id!=null?String(skinning.id):''); if(!key) return skinning; registry.skinnings[key]=skinning; return skinning; };
  bridge.getRenderSkinning=function(registry,id){ return registry&&registry.skinnings&&id!=null?registry.skinnings[String(id)]:undefined; };
  bridge.hasRenderSkinning=function(registry,id){ return !!(registry&&registry.skinnings&&id!=null&&Object.prototype.hasOwnProperty.call(registry.skinnings,String(id))); };
  bridge.releaseRenderSkinning=function(registry,id){ if(!registry||!registry.skinnings||id==null) return undefined; var key=String(id),skinning=registry.skinnings[key]; delete registry.skinnings[key]; return skinning; };
  bridge.clearRenderSkinnings=function(registry){ if(registry) registry.skinnings={}; return registry; };

  bridge.createRenderMorph=function(options){ var o=options||{}; return {id:o.id!=null?String(o.id):'',name:o.name!=null?String(o.name):'AsgardMorph',enabled:o.enabled!==false,weight:o.weight==null?0:Number(o.weight),properties:o.properties&&typeof o.properties==='object'?Object.assign({},o.properties):{},metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}}; };
  bridge.getRenderMorphProperty=function(morph,key){ if(!morph||!key) return undefined; if(key==='properties') return morph.properties; if(key==='metadata') return morph.metadata; return morph[key]; };
  bridge.setRenderMorphProperty=function(morph,key,value){ if(!morph||!key) return morph; if(key==='properties'||key==='metadata') morph[key]=value&&typeof value==='object'?value:{}; else morph[key]=value; return morph; };
  bridge.setRenderMorphEnabled=function(morph,enabled){ if(!morph) return morph; morph.enabled=!!enabled; return morph; };
  bridge.getRenderMorphEnabled=function(morph){ return morph?morph.enabled!==false:false; };
  bridge.setRenderMorphWeight=function(morph,weight){ if(!morph) return morph; morph.weight=Number(weight)||0; return morph; };
  bridge.getRenderMorphWeight=function(morph){ return morph?morph.weight:undefined; };
  bridge.createRenderMorphRegistry=function(options){ var o=options||{}; return {id:o.id!=null?String(o.id):'',name:o.name!=null?String(o.name):'AsgardMorphRegistry',morphs:{},metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}}; };
  bridge.registerRenderMorph=function(registry,morph,id){ if(!registry||!morph) return morph; if(!registry.morphs||typeof registry.morphs!=='object') registry.morphs={}; var key=id!=null?String(id):(morph.id!=null?String(morph.id):''); if(!key) return morph; registry.morphs[key]=morph; return morph; };
  bridge.getRenderMorph=function(registry,id){ return registry&&registry.morphs&&id!=null?registry.morphs[String(id)]:undefined; };
  bridge.hasRenderMorph=function(registry,id){ return !!(registry&&registry.morphs&&id!=null&&Object.prototype.hasOwnProperty.call(registry.morphs,String(id))); };
  bridge.releaseRenderMorph=function(registry,id){ if(!registry||!registry.morphs||id==null) return undefined; var key=String(id),morph=registry.morphs[key]; delete registry.morphs[key]; return morph; };
  bridge.clearRenderMorphs=function(registry){ if(registry) registry.morphs={}; return registry; };

  bridge.createRenderModelSystem=function(options){ var o=options||{}; return {id:o.id!=null?String(o.id):'',name:o.name!=null?String(o.name):'AsgardModelSystem',enabled:o.enabled!==false,components:{instances:{},assets:{},skeletons:{},skinnings:{},morphs:{}},parameters:o.parameters&&typeof o.parameters==='object'?Object.assign({},o.parameters):{},metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}}; };
  bridge.getRenderModelSystemProperty=function(system,key){ if(!system||!key) return undefined; if(key==='components'||key==='parameters'||key==='metadata') return system[key]; return system[key]; };
  bridge.setRenderModelSystemProperty=function(system,key,value){ if(!system||!key) return system; if(key==='components'||key==='parameters'||key==='metadata') system[key]=value&&typeof value==='object'?value:{}; else system[key]=value; return system; };
  bridge.setRenderModelSystemEnabled=function(system,enabled){ if(!system) return system; system.enabled=!!enabled; return system; };
  bridge.getRenderModelSystemEnabled=function(system){ return system?system.enabled!==false:false; };
  bridge.setRenderModelSystemParameter=function(system,key,value){ if(!system||!key) return system; if(!system.parameters||typeof system.parameters!=='object') system.parameters={}; system.parameters[key]=value; return system; };
  bridge.getRenderModelSystemParameter=function(system,key){ return system&&system.parameters&&key!=null?system.parameters[key]:undefined; };
  bridge.registerRenderModelComponent=function(system,type,component,id){ if(!system||!component||!type) return component; if(!system.components||typeof system.components!=='object') system.components={}; if(!system.components[type]||typeof system.components[type]!=='object') system.components[type]={}; var key=id!=null?String(id):(component.id!=null?String(component.id):''); if(!key) return component; system.components[type][key]=component; return component; };
  bridge.getRenderModelComponent=function(system,type,id){ return system&&system.components&&system.components[type]&&id!=null?system.components[type][String(id)]:undefined; };
  bridge.hasRenderModelComponent=function(system,type,id){ return !!(system&&system.components&&system.components[type]&&id!=null&&Object.prototype.hasOwnProperty.call(system.components[type],String(id))); };
  bridge.releaseRenderModelComponent=function(system,type,id){ if(!system||!system.components||!system.components[type]||id==null) return undefined; var key=String(id),component=system.components[type][key]; delete system.components[type][key]; return component; };
  bridge.clearRenderModelComponents=function(system,type){ if(!system) return system; if(type){if(!system.components) system.components={}; system.components[type]={};}else system.components={instances:{},assets:{},skeletons:{},skinnings:{},morphs:{}}; return system; };
  bridge.createRenderModelSystemRegistry=function(options){ var o=options||{}; return {id:o.id!=null?String(o.id):'',name:o.name!=null?String(o.name):'AsgardModelSystemRegistry',systems:{},metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}}; };
  bridge.registerRenderModelSystem=function(registry,system,id){ if(!registry||!system) return system; if(!registry.systems||typeof registry.systems!=='object') registry.systems={}; var key=id!=null?String(id):(system.id!=null?String(system.id):''); if(!key) return system; registry.systems[key]=system; return system; };
  bridge.getRenderModelSystem=function(registry,id){ return registry&&registry.systems&&id!=null?registry.systems[String(id)]:undefined; };
  bridge.hasRenderModelSystem=function(registry,id){ return !!(registry&&registry.systems&&id!=null&&Object.prototype.hasOwnProperty.call(registry.systems,String(id))); };
  bridge.releaseRenderModelSystem=function(registry,id){ if(!registry||!registry.systems||id==null) return undefined; var key=String(id),system=registry.systems[key]; delete registry.systems[key]; return system; };
  bridge.clearRenderModelSystems=function(registry){ if(registry) registry.systems={}; return registry; };

  // V1.01.63: renderer-neutral Render Animation System facade boundary.
  // This aggregates the already isolated animation descriptors without executing
  // animation, touching existing Character Model V2 objects, or changing runtime flow.
  bridge.createRenderAnimationSystem = function(options){
    var o = options || {};
    return {
      id: o.id != null ? String(o.id) : '',
      name: o.name != null ? String(o.name) : 'AsgardAnimationSystem',
      enabled: o.enabled !== false,
      components: {
        clips: {},
        controllers: {},
        stateMachines: {},
        layers: {},
        timelines: {},
        blendTrees: {},
        markers: {},
        eventBindings: {}
      },
      parameters: o.parameters && typeof o.parameters === 'object' ? Object.assign({}, o.parameters) : {},
      metadata: o.metadata && typeof o.metadata === 'object' ? Object.assign({}, o.metadata) : {}
    };
  };
  bridge.getRenderAnimationSystemProperty = function(system, key){
    if (!system || !key) return undefined;
    if (key === 'components') return system.components;
    if (key === 'parameters') return system.parameters;
    if (key === 'metadata') return system.metadata;
    return system[key];
  };
  bridge.setRenderAnimationSystemProperty = function(system, key, value){
    if (!system || !key) return system;
    if (key === 'components' || key === 'parameters' || key === 'metadata') {
      system[key] = value && typeof value === 'object' ? value : {};
    } else {
      system[key] = value;
    }
    return system;
  };
  bridge.setRenderAnimationSystemEnabled = function(system, enabled){
    if (!system) return system;
    system.enabled = !!enabled;
    return system;
  };
  bridge.getRenderAnimationSystemEnabled = function(system){
    return system ? system.enabled !== false : false;
  };
  bridge.setRenderAnimationSystemParameter = function(system, key, value){
    if (!system || !key) return system;
    if (!system.parameters || typeof system.parameters !== 'object') system.parameters = {};
    system.parameters[key] = value;
    return system;
  };
  bridge.getRenderAnimationSystemParameter = function(system, key){
    if (!system || !system.parameters || key == null) return undefined;
    return system.parameters[key];
  };
  bridge.registerRenderAnimationComponent = function(system, type, component, id){
    if (!system || !component || !type) return component;
    if (!system.components || typeof system.components !== 'object') system.components = {};
    if (!system.components[type] || typeof system.components[type] !== 'object') system.components[type] = {};
    var key = id != null ? String(id) : (component.id != null ? String(component.id) : '');
    if (!key) return component;
    system.components[type][key] = component;
    return component;
  };
  bridge.getRenderAnimationComponent = function(system, type, id){
    if (!system || !system.components || !system.components[type] || id == null) return undefined;
    return system.components[type][String(id)];
  };
  bridge.hasRenderAnimationComponent = function(system, type, id){
    return !!(system && system.components && system.components[type] && id != null && Object.prototype.hasOwnProperty.call(system.components[type], String(id)));
  };
  bridge.releaseRenderAnimationComponent = function(system, type, id){
    if (!system || !system.components || !system.components[type] || id == null) return undefined;
    var key=String(id), component=system.components[type][key];
    delete system.components[type][key];
    return component;
  };
  bridge.clearRenderAnimationComponents = function(system, type){
    if (!system) return system;
    if (type) {
      if (!system.components) system.components = {};
      system.components[type] = {};
    } else {
      system.components = {clips:{},controllers:{},stateMachines:{},layers:{},timelines:{},blendTrees:{},markers:{},eventBindings:{}};
    }
    return system;
  };
  bridge.createRenderAnimationSystemRegistry = function(options){
    var o=options||{};
    return {id:o.id!=null?String(o.id):'',name:o.name!=null?String(o.name):'AsgardAnimationSystemRegistry',systems:{},metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}};
  };
  bridge.registerRenderAnimationSystem = function(registry, system, id){
    if (!registry || !system) return system;
    if (!registry.systems || typeof registry.systems !== 'object') registry.systems={};
    var key=id!=null?String(id):(system.id!=null?String(system.id):'');
    if (!key) return system;
    registry.systems[key]=system;
    return system;
  };
  bridge.getRenderAnimationSystem = function(registry, id){
    return registry && registry.systems && id!=null ? registry.systems[String(id)] : undefined;
  };
  bridge.hasRenderAnimationSystem = function(registry, id){
    return !!(registry && registry.systems && id!=null && Object.prototype.hasOwnProperty.call(registry.systems,String(id)));
  };
  bridge.releaseRenderAnimationSystem = function(registry, id){
    if (!registry || !registry.systems || id==null) return undefined;
    var key=String(id), system=registry.systems[key]; delete registry.systems[key]; return system;
  };
  bridge.clearRenderAnimationSystems = function(registry){
    if (registry) registry.systems={};
    return registry;
  };

  // V1.01.62: renderer-neutral Render Animation Blend Tree API boundary.
  // Descriptor/query-only helpers. They do not drive, replace, retarget, or
  // reparent any existing animation runtime or Character Model V2 hierarchy.
  bridge.createRenderAnimationBlendTree = function(options){
    var o = options || {};
    return {
      id: o.id != null ? String(o.id) : '',
      name: o.name != null ? String(o.name) : '',
      enabled: o.enabled !== false,
      rootNode: o.rootNode != null ? String(o.rootNode) : '',
      nodes: Array.isArray(o.nodes) ? o.nodes.slice() : [],
      parameters: o.parameters && typeof o.parameters === 'object' ? Object.assign({}, o.parameters) : {},
      properties: o.properties && typeof o.properties === 'object' ? Object.assign({}, o.properties) : {},
      metadata: o.metadata && typeof o.metadata === 'object' ? Object.assign({}, o.metadata) : {}
    };
  };
  bridge.getRenderAnimationBlendTreeProperty = function(tree, key){
    if (!tree || !key) return undefined;
    if (key === 'nodes') return tree.nodes;
    if (key === 'parameters') return tree.parameters;
    if (key === 'properties') return tree.properties;
    if (key === 'metadata') return tree.metadata;
    return tree[key];
  };
  bridge.setRenderAnimationBlendTreeProperty = function(tree, key, value){
    if (!tree || !key) return tree;
    if (key === 'nodes') tree.nodes = Array.isArray(value) ? value.slice() : [];
    else if (key === 'parameters') tree.parameters = value && typeof value === 'object' ? value : {};
    else if (key === 'properties') tree.properties = value && typeof value === 'object' ? value : {};
    else if (key === 'metadata') tree.metadata = value && typeof value === 'object' ? value : {};
    else tree[key] = value;
    return tree;
  };
  bridge.setRenderAnimationBlendTreeEnabled = function(tree, enabled){
    if (!tree) return tree;
    tree.enabled = !!enabled;
    return tree;
  };
  bridge.getRenderAnimationBlendTreeEnabled = function(tree){
    return tree ? tree.enabled !== false : false;
  };
  bridge.setRenderAnimationBlendTreeRootNode = function(tree, nodeId){
    if (!tree) return tree;
    tree.rootNode = nodeId != null ? String(nodeId) : '';
    return tree;
  };
  bridge.getRenderAnimationBlendTreeRootNode = function(tree){
    return tree ? tree.rootNode : undefined;
  };
  bridge.addRenderAnimationBlendNode = function(tree, node){
    if (!tree || !node) return tree;
    if (!Array.isArray(tree.nodes)) tree.nodes = [];
    tree.nodes.push(node);
    return tree;
  };
  bridge.removeRenderAnimationBlendNode = function(tree, node){
    if (!tree || !Array.isArray(tree.nodes)) return tree;
    tree.nodes = tree.nodes.filter(function(item){ return item !== node; });
    return tree;
  };
  bridge.getRenderAnimationBlendNodes = function(tree){
    return tree && Array.isArray(tree.nodes) ? tree.nodes.slice() : [];
  };
  bridge.setRenderAnimationBlendParameter = function(tree, key, value){
    if (!tree || !key) return tree;
    if (!tree.parameters || typeof tree.parameters !== 'object') tree.parameters = {};
    tree.parameters[key] = value;
    return tree;
  };
  bridge.getRenderAnimationBlendParameter = function(tree, key){
    if (!tree || !tree.parameters || key == null) return undefined;
    return tree.parameters[key];
  };
  bridge.createRenderAnimationBlendTreeRegistry = function(options){
    var o = options || {};
    return {
      id: o.id != null ? String(o.id) : '',
      name: o.name != null ? String(o.name) : '',
      trees: {},
      metadata: o.metadata && typeof o.metadata === 'object' ? Object.assign({}, o.metadata) : {}
    };
  };
  bridge.registerRenderAnimationBlendTree = function(registry, tree, id){
    if (!registry || !tree) return tree;
    if (!registry.trees || typeof registry.trees !== 'object') registry.trees = {};
    var key = id != null ? String(id) : (tree.id != null ? String(tree.id) : '');
    if (!key) return tree;
    registry.trees[key] = tree;
    return tree;
  };
  bridge.getRenderAnimationBlendTree = function(registry, id){
    if (!registry || !registry.trees || id == null) return undefined;
    return registry.trees[String(id)];
  };
  bridge.hasRenderAnimationBlendTree = function(registry, id){
    return !!(registry && registry.trees && id != null && Object.prototype.hasOwnProperty.call(registry.trees, String(id)));
  };
  bridge.releaseRenderAnimationBlendTree = function(registry, id){
    if (!registry || !registry.trees || id == null) return undefined;
    var key = String(id), tree = registry.trees[key];
    delete registry.trees[key];
    return tree;
  };
  bridge.clearRenderAnimationBlendTrees = function(registry){
    if (!registry) return registry;
    registry.trees = {};
    return registry;
  };

  // V1.01.65: renderer-neutral Render World / Scene system boundary.
  // Descriptor/query-only helpers. They do not replace, reparent, rebuild, or
  // mutate existing live world objects unless a caller explicitly uses a setter.
  bridge.createRenderWorldSystem=function(options){var o=options||{};return{id:o.id!=null?String(o.id):'',name:o.name!=null?String(o.name):'AsgardWorldSystem',enabled:o.enabled!==false,components:{scene:null,world:null,map:null,terrain:null,static:null,npc:null,portal:null,monster:null},parameters:o.parameters&&typeof o.parameters==='object'?Object.assign({},o.parameters):{},metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}};};
  bridge.getRenderWorldSystemProperty=function(system,key){if(!system||!key)return undefined;if(key==='components'||key==='parameters'||key==='metadata')return system[key];return system[key];};
  bridge.setRenderWorldSystemProperty=function(system,key,value){if(!system||!key)return system;if(key==='components'||key==='parameters'||key==='metadata')system[key]=value&&typeof value==='object'?value:{};else system[key]=value;return system;};
  bridge.setRenderWorldSystemEnabled=function(system,enabled){if(!system)return system;system.enabled=!!enabled;return system;};
  bridge.getRenderWorldSystemEnabled=function(system){return system?system.enabled!==false:false;};
  bridge.setRenderWorldSystemParameter=function(system,key,value){if(!system||!key)return system;if(!system.parameters)system.parameters={};system.parameters[key]=value;return system;};
  bridge.getRenderWorldSystemParameter=function(system,key){return system&&system.parameters&&key?system.parameters[key]:undefined;};
  bridge.setRenderWorldSystemComponent=function(system,type,component){if(!system||!type)return system;if(!system.components)system.components={};system.components[String(type)]=component||null;return system;};
  bridge.getRenderWorldSystemComponent=function(system,type){return system&&system.components&&type!=null?system.components[String(type)]:undefined;};
  bridge.createRenderWorldRegistry=function(options){var o=options||{};return{id:o.id!=null?String(o.id):'',name:o.name!=null?String(o.name):'AsgardWorldRegistry',worlds:{},metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}};};
  bridge.registerRenderWorld=function(registry,world,id){if(!registry||!world)return world;if(!registry.worlds)registry.worlds={};var key=id!=null?String(id):(world.id!=null?String(world.id):'');if(!key)return world;registry.worlds[key]=world;return world;};
  bridge.getRenderWorld=function(registry,id){return registry&&registry.worlds&&id!=null?registry.worlds[String(id)]:undefined;};
  bridge.hasRenderWorld=function(registry,id){return !!(registry&&registry.worlds&&id!=null&&Object.prototype.hasOwnProperty.call(registry.worlds,String(id)));};
  bridge.releaseRenderWorld=function(registry,id){if(!registry||!registry.worlds||id==null)return undefined;var k=String(id),v=registry.worlds[k];delete registry.worlds[k];return v;};
  bridge.clearRenderWorlds=function(registry){if(registry)registry.worlds={};return registry;};
  bridge.createRenderSceneDescriptor=function(options){var o=options||{};return{id:o.id!=null?String(o.id):'',name:o.name!=null?String(o.name):'AsgardScene',enabled:o.enabled!==false,background:o.background,environment:o.environment,fog:o.fog,metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}};};
  bridge.getRenderSceneDescriptorProperty=function(scene,key){return scene&&key?scene[key]:undefined;};
  bridge.setRenderSceneDescriptorProperty=function(scene,key,value){if(scene&&key)scene[key]=value;return scene;};
  bridge.createRenderMapDescriptor=function(options){var o=options||{};return{id:o.id!=null?String(o.id):'',name:o.name!=null?String(o.name):'AsgardMap',scene:o.scene||null,terrain:o.terrain||null,staticRoot:o.staticRoot||null,npcRoot:o.npcRoot||null,portalRoot:o.portalRoot||null,monsterRoot:o.monsterRoot||null,metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}};};
  bridge.getRenderMapDescriptorProperty=function(map,key){return map&&key?map[key]:undefined;};
  bridge.setRenderMapDescriptorProperty=function(map,key,value){if(map&&key)map[key]=value;return map;};
  bridge.createRenderWorldComponentRegistry=function(options){var o=options||{};return{id:o.id!=null?String(o.id):'',name:o.name!=null?String(o.name):'AsgardWorldComponentRegistry',components:{},metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}};};
  bridge.registerRenderWorldComponent=function(registry,type,component,id){if(!registry||!component||!type)return component;if(!registry.components)registry.components={};var group=String(type);if(!registry.components[group])registry.components[group]={};var k=id!=null?String(id):(component.id!=null?String(component.id):'');if(!k)return component;registry.components[group][k]=component;return component;};
  bridge.getRenderWorldComponent=function(registry,type,id){return registry&&registry.components&&type!=null&&id!=null&&registry.components[String(type)]?registry.components[String(type)][String(id)]:undefined;};
  bridge.hasRenderWorldComponent=function(registry,type,id){return !!(registry&&registry.components&&type!=null&&id!=null&&registry.components[String(type)]&&Object.prototype.hasOwnProperty.call(registry.components[String(type)],String(id)));};
  bridge.releaseRenderWorldComponent=function(registry,type,id){if(!registry||!registry.components||type==null||id==null)return undefined;var g=String(type),k=String(id),v=registry.components[g]?registry.components[g][k]:undefined;if(registry.components[g])delete registry.components[g][k];return v;};
  bridge.clearRenderWorldComponents=function(registry,type){if(!registry)return registry;if(type==null)registry.components={};else registry.components[String(type)]={};return registry;};

  // V1.01.52: renderer-neutral Render Debug / Diagnostics API boundary.
  // Descriptor/query-only helpers. They do not enable debug rendering, alter
  // visibility, or change any existing game object or renderer state.
  bridge.createRenderDiagnostics = function(options){
    var o = options || {};
    return {
      id: o.id != null ? String(o.id) : '',
      name: o.name != null ? String(o.name) : '',
      enabled: o.enabled !== false,
      counters: o.counters && typeof o.counters === 'object' ? Object.assign({}, o.counters) : {},
      properties: o.properties && typeof o.properties === 'object' ? Object.assign({}, o.properties) : {},
      metadata: o.metadata || {}
    };
  };
  bridge.getRenderDiagnosticsProperty = function(diagnostics, key){
    if (!diagnostics || !key) return undefined;
    if (key === 'counters') return diagnostics.counters;
    if (key === 'properties') return diagnostics.properties;
    return diagnostics[key];
  };
  bridge.setRenderDiagnosticsProperty = function(diagnostics, key, value){
    if (!diagnostics || !key) return diagnostics;
    if (key === 'counters') diagnostics.counters = value && typeof value === 'object' ? value : {};
    else if (key === 'properties') diagnostics.properties = value && typeof value === 'object' ? value : {};
    else diagnostics[key] = value;
    return diagnostics;
  };
  bridge.setRenderDiagnosticsEnabled = function(diagnostics, enabled){
    if (!diagnostics) return diagnostics;
    diagnostics.enabled = !!enabled;
    return diagnostics;
  };
  bridge.getRenderDiagnosticsEnabled = function(diagnostics){
    return diagnostics ? diagnostics.enabled !== false : false;
  };
  bridge.setRenderDiagnosticCounter = function(diagnostics, key, value){
    if (!diagnostics || !key) return diagnostics;
    if (!diagnostics.counters || typeof diagnostics.counters !== 'object') diagnostics.counters = {};
    diagnostics.counters[key] = Number(value) || 0;
    return diagnostics;
  };
  bridge.getRenderDiagnosticCounter = function(diagnostics, key){
    if (!diagnostics || !diagnostics.counters || !key) return undefined;
    return diagnostics.counters[key];
  };
  bridge.resetRenderDiagnostics = function(diagnostics){
    if (!diagnostics) return diagnostics;
    diagnostics.counters = {};
    diagnostics.properties = {};
    return diagnostics;
  };

  // V1.01.50: renderer-neutral Render LOD / Quality API boundary.
  // Descriptor/query-only helpers. They do not replace, reparent, hide, or
  // rebuild existing game objects. A future PlayCanvas adapter can map this
  // contract to Entity/RenderComponent LOD or another quality system.
  bridge.createRenderLOD = function(options){
    var o = options || {};
    var levels = Array.isArray(o.levels) ? o.levels.slice() : [];
    levels.sort(function(a,b){ return (Number(a.distance)||0) - (Number(b.distance)||0); });
    return {
      id: o.id != null ? String(o.id) : '',
      name: o.name != null ? String(o.name) : '',
      enabled: o.enabled !== false,
      bias: Number(o.bias) || 0,
      levels: levels,
      metadata: o.metadata || {}
    };
  };
  bridge.getRenderLODProperty = function(lod, key){
    return lod && key ? lod[key] : undefined;
  };
  bridge.setRenderLODProperty = function(lod, key, value){
    if (!lod || !key) return lod;
    lod[key] = value;
    return lod;
  };
  bridge.setRenderLODEnabled = function(lod, enabled){
    if (!lod) return lod;
    lod.enabled = !!enabled;
    return lod;
  };
  bridge.getRenderLODEnabled = function(lod){
    return lod ? lod.enabled !== false : false;
  };
  bridge.addRenderLODLevel = function(lod, level){
    if (!lod || !level) return lod;
    if (!Array.isArray(lod.levels)) lod.levels = [];
    lod.levels.push(level);
    lod.levels.sort(function(a,b){ return (Number(a.distance)||0) - (Number(b.distance)||0); });
    return lod;
  };
  bridge.removeRenderLODLevel = function(lod, levelOrIndex){
    if (!lod || !Array.isArray(lod.levels)) return lod;
    var index = typeof levelOrIndex === 'number' ? levelOrIndex : lod.levels.indexOf(levelOrIndex);
    if (index >= 0 && index < lod.levels.length) lod.levels.splice(index, 1);
    return lod;
  };
  bridge.getRenderLODLevels = function(lod){
    return lod && Array.isArray(lod.levels) ? lod.levels.slice() : [];
  };
  bridge.selectRenderLODLevel = function(lod, distance){
    if (!lod || lod.enabled === false) return null;
    var levels = Array.isArray(lod.levels) ? lod.levels : [];
    if (!levels.length) return null;
    var d = Math.max(0, Number(distance) || 0) + (Number(lod.bias) || 0);
    var selected = levels[0];
    for (var i=0;i<levels.length;i++) {
      if (d >= (Number(levels[i].distance)||0)) selected = levels[i];
      else break;
    }
    return selected;
  };

  // V1.01.44: renderer-neutral Render State / Frame Control API boundary.
  // These helpers are opt-in only. Existing renderer state is not changed unless
  // a caller explicitly invokes a setter. The API keeps frame-state ownership
  // outside gameplay so a future PlayCanvas adapter can map the same contract.
  bridge.getRendererState = function(renderer, key){
    if (!renderer || !key) return undefined;
    if (key === 'autoClear') return renderer.autoClear;
    if (key === 'autoClearColor') return renderer.autoClearColor;
    if (key === 'autoClearDepth') return renderer.autoClearDepth;
    if (key === 'autoClearStencil') return renderer.autoClearStencil;
    if (key === 'toneMapping') return renderer.toneMapping;
    if (key === 'toneMappingExposure') return renderer.toneMappingExposure;
    if (key === 'outputColorSpace') return renderer.outputColorSpace;
    return renderer[key];
  };
  bridge.setRendererState = function(renderer, key, value){
    if (!renderer || !key) return renderer;
    if (key === 'autoClear') renderer.autoClear = !!value;
    else if (key === 'autoClearColor') renderer.autoClearColor = !!value;
    else if (key === 'autoClearDepth') renderer.autoClearDepth = !!value;
    else if (key === 'autoClearStencil') renderer.autoClearStencil = !!value;
    else if (key === 'toneMapping') renderer.toneMapping = value;
    else if (key === 'toneMappingExposure') renderer.toneMappingExposure = Number(value) || 0;
    else if (key === 'outputColorSpace' && 'outputColorSpace' in renderer) renderer.outputColorSpace = value;
    else renderer[key] = value;
    return renderer;
  };
  bridge.clearRenderTarget = function(renderer, target, color, depth, stencil){
    if (!renderer || typeof renderer.clear !== 'function') return renderer;
    if (typeof renderer.setRenderTarget === 'function') renderer.setRenderTarget(target || null);
    renderer.clear(color !== false, depth !== false, stencil === true);
    return renderer;
  };
  bridge.setRenderTarget = function(renderer, target){
    if (!renderer || typeof renderer.setRenderTarget !== 'function') return renderer;
    renderer.setRenderTarget(target || null);
    return renderer;
  };
  bridge.getRenderTarget = function(renderer){
    if (!renderer || typeof renderer.getRenderTarget !== 'function') return null;
    return renderer.getRenderTarget();
  };

  // V1.01.42: renderer-neutral Render Target API boundary.
  // These helpers are opt-in only. They create and mutate render-target
  // descriptors without changing the existing main renderer, scene, camera,
  // or frame flow. The descriptor shape is intentionally renderer-neutral so
  // a future PlayCanvas adapter can map it to RenderTarget/Texture resources.
  bridge.createRenderTarget = function(options){
    var o = options || {};
    var target = {
      width: Math.max(1, Number(o.width) || 1),
      height: Math.max(1, Number(o.height) || 1),
      pixelRatio: Math.max(0.01, Number(o.pixelRatio) || 1),
      format: o.format != null ? o.format : 'rgba8',
      depth: o.depth != null ? !!o.depth : true,
      stencil: o.stencil != null ? !!o.stencil : false,
      samples: Math.max(0, Number(o.samples) || 0),
      texture: o.texture != null ? o.texture : null,
      depthTexture: o.depthTexture != null ? o.depthTexture : null,
      userData: o.userData || {}
    };
    return target;
  };
  bridge.getRenderTargetProperty = function(target, key){
    return target && key ? target[key] : undefined;
  };
  bridge.setRenderTargetProperty = function(target, key, value){
    if (!target || !key) return target;
    target[key] = value;
    return target;
  };
  bridge.setRenderTargetSize = function(target, width, height){
    if (!target) return target;
    target.width = Math.max(1, Number(width) || 1);
    target.height = Math.max(1, Number(height) || 1);
    return target;
  };
  bridge.getRenderTargetSize = function(target){
    if (!target) return null;
    return { width: Number(target.width) || 1, height: Number(target.height) || 1 };
  };

  // V1.01.40: renderer-neutral Shadow API boundary.
  // These helpers are opt-in only. Existing shadow state is not changed unless
  // a caller explicitly invokes a setter.
  bridge.getCastShadow = function(object){
    if (!object) return null;
    return object.castShadow !== undefined ? !!object.castShadow : false;
  };
  bridge.setCastShadow = function(object, enabled){
    if (!object) return object;
    if (object.castShadow !== undefined) object.castShadow = !!enabled;
    return object;
  };
  bridge.getReceiveShadow = function(object){
    if (!object) return null;
    return object.receiveShadow !== undefined ? !!object.receiveShadow : false;
  };
  bridge.setReceiveShadow = function(object, enabled){
    if (!object) return object;
    if (object.receiveShadow !== undefined) object.receiveShadow = !!enabled;
    return object;
  };
  bridge.setShadowProperty = function(shadow, key, value){
    if (!shadow || !key) return shadow;
    shadow[key] = value;
    return shadow;
  };
  bridge.getShadowProperty = function(shadow, key){
    return shadow && key ? shadow[key] : undefined;
  };

  // V1.01.38: renderer-neutral Visibility / Layer API boundary.
  // These helpers are opt-in only. Existing runtime visibility/layer state is
  // not changed unless a caller explicitly invokes a setter.
  bridge.getObjectVisibility = function(object){
    if (!object) return null;
    if (object.visible !== undefined) return !!object.visible;
    return true;
  };
  bridge.setObjectVisibility = function(object, visible){
    if (!object) return object;
    if (object.visible !== undefined) object.visible = !!visible;
    return object;
  };
  bridge.getObjectLayerMask = function(object){
    if (!object) return null;
    if (object.layers && object.layers.mask !== undefined) return object.layers.mask;
    return null;
  };
  bridge.setObjectLayerMask = function(object, mask){
    if (!object || !object.layers) return object;
    var value = Number(mask);
    if (!isFinite(value)) return object;
    if (typeof object.layers.mask === 'number') object.layers.mask = value;
    return object;
  };
  bridge.enableObjectLayer = function(object, layer){
    if (!object || !object.layers || typeof object.layers.enable !== 'function') return object;
    object.layers.enable(Number(layer) || 0);
    return object;
  };
  bridge.disableObjectLayer = function(object, layer){
    if (!object || !object.layers || typeof object.layers.disable !== 'function') return object;
    object.layers.disable(Number(layer) || 0);
    return object;
  };

  // V1.01.16 ownership helpers. These keep gameplay data independent from the renderer.
  bridge.createWorldLayer = function(parent, name){
    var root = this.createWorldRoot(parent);
    root.name = name || 'AsgardWorldLayer';
    return root;
  };
  // V1.01.18 static-world ownership layers. Gameplay data remains in Runtime.
  bridge.createTerrainRoot = function(parent){ return this.createWorldLayer(parent, 'AsgardTerrainRoot'); };
  bridge.createStaticRoot = function(parent){ return this.createWorldLayer(parent, 'AsgardStaticRoot'); };
  // V1.01.66: renderer-neutral Render Camera / View system boundary.
  // Descriptor/query-only helpers. They do not modify the active gameplay camera,
  // viewport, projection, follow/free-camera behavior, or existing scene objects.
  bridge.createRenderView = function(options){
    var o = options || {};
    return {
      id: o.id != null ? String(o.id) : '',
      name: o.name != null ? String(o.name) : '',
      type: o.type != null ? String(o.type) : 'camera',
      mode: o.mode != null ? String(o.mode) : 'free',
      enabled: o.enabled !== false,
      active: !!o.active,
      fov: o.fov == null ? 52 : Number(o.fov),
      aspect: o.aspect == null ? 1 : Number(o.aspect),
      near: o.near == null ? 0.1 : Number(o.near),
      far: o.far == null ? 500 : Number(o.far),
      position: Array.isArray(o.position) ? o.position.slice() : [0,0,0],
      target: Array.isArray(o.target) ? o.target.slice() : [0,0,0],
      up: Array.isArray(o.up) ? o.up.slice() : [0,1,0],
      parameters: o.parameters && typeof o.parameters === 'object' ? Object.assign({}, o.parameters) : {},
      metadata: o.metadata && typeof o.metadata === 'object' ? Object.assign({}, o.metadata) : {}
    };
  };
  bridge.getRenderViewProperty = function(view, key){
    if (!view || !key) return undefined;
    if (key === 'parameters') return view.parameters;
    if (key === 'metadata') return view.metadata;
    return view[key];
  };
  bridge.setRenderViewProperty = function(view, key, value){
    if (!view || !key) return view;
    if (key === 'parameters') view.parameters = value && typeof value === 'object' ? value : {};
    else if (key === 'metadata') view.metadata = value && typeof value === 'object' ? value : {};
    else view[key] = value;
    return view;
  };
  bridge.setRenderViewEnabled = function(view, enabled){ if (view) view.enabled = !!enabled; return view; };
  bridge.getRenderViewEnabled = function(view){ return !!(view && view.enabled !== false); };
  bridge.setRenderViewActive = function(view, active){ if (view) view.active = !!active; return view; };
  bridge.getRenderViewActive = function(view){ return !!(view && view.active); };
  bridge.setRenderViewMode = function(view, mode){ if (view && mode != null) view.mode = String(mode); return view; };
  bridge.getRenderViewMode = function(view){ return view ? view.mode : undefined; };
  bridge.setRenderViewPosition = function(view, position){ if (view && Array.isArray(position)) view.position = position.slice(); return view; };
  bridge.getRenderViewPosition = function(view){ return view && Array.isArray(view.position) ? view.position.slice() : undefined; };
  bridge.setRenderViewTarget = function(view, target){ if (view && Array.isArray(target)) view.target = target.slice(); return view; };
  bridge.getRenderViewTarget = function(view){ return view && Array.isArray(view.target) ? view.target.slice() : undefined; };
  bridge.setRenderViewProjection = function(view, projection){
    if (!view || !projection) return view;
    if (projection.fov != null) view.fov = Number(projection.fov);
    if (projection.aspect != null) view.aspect = Number(projection.aspect);
    if (projection.near != null) view.near = Number(projection.near);
    if (projection.far != null) view.far = Number(projection.far);
    return view;
  };
  bridge.getRenderViewProjection = function(view){
    if (!view) return undefined;
    return {fov:view.fov, aspect:view.aspect, near:view.near, far:view.far};
  };
  bridge.createRenderViewRegistry = function(options){
    var o = options || {};
    return {id:o.id != null ? String(o.id) : '', name:o.name != null ? String(o.name) : '', views:{}, metadata:o.metadata && typeof o.metadata === 'object' ? Object.assign({}, o.metadata) : {}};
  };
  bridge.registerRenderView = function(registry, view, id){
    if (!registry || !view) return view;
    if (!registry.views || typeof registry.views !== 'object') registry.views = {};
    var key = id != null ? String(id) : (view.id != null ? String(view.id) : '');
    if (key) registry.views[key] = view;
    return view;
  };
  bridge.getRenderView = function(registry, id){ return registry && registry.views && id != null ? registry.views[String(id)] : undefined; };
  bridge.hasRenderView = function(registry, id){ return !!(registry && registry.views && id != null && Object.prototype.hasOwnProperty.call(registry.views, String(id))); };
  bridge.releaseRenderView = function(registry, id){ if (!registry || !registry.views || id == null) return undefined; var k=String(id), v=registry.views[k]; delete registry.views[k]; return v; };
  bridge.clearRenderViews = function(registry){ if (registry) registry.views = {}; return registry; };

  // V1.01.67: renderer-neutral Render Lighting / Environment System facade.
  // Descriptor/facade only: no existing lights, shadows, scene visuals or effects
  // are replaced, reparented, or automatically changed.
  bridge.createRenderLightingSystem = function(options){
    var o = options || {};
    return {
      id: o.id != null ? String(o.id) : '',
      name: o.name != null ? String(o.name) : '',
      enabled: o.enabled !== false,
      lights: Array.isArray(o.lights) ? o.lights.slice() : [],
      shadows: Array.isArray(o.shadows) ? o.shadows.slice() : [],
      environment: o.environment && typeof o.environment === 'object' ? Object.assign({}, o.environment) : {},
      parameters: o.parameters && typeof o.parameters === 'object' ? Object.assign({}, o.parameters) : {},
      metadata: o.metadata && typeof o.metadata === 'object' ? Object.assign({}, o.metadata) : {}
    };
  };
  bridge.getRenderLightingSystemProperty = function(system, key){
    if (!system || !key) return undefined;
    return system[key];
  };
  bridge.setRenderLightingSystemProperty = function(system, key, value){
    if (!system || !key) return system;
    system[key] = value;
    return system;
  };
  bridge.setRenderLightingSystemEnabled = function(system, enabled){ if (system) system.enabled = !!enabled; return system; };
  bridge.getRenderLightingSystemEnabled = function(system){ return !!(system && system.enabled !== false); };
  bridge.setRenderLightingSystemParameter = function(system, key, value){
    if (!system || !key) return system;
    if (!system.parameters || typeof system.parameters !== 'object') system.parameters = {};
    system.parameters[key] = value;
    return system;
  };
  bridge.getRenderLightingSystemParameter = function(system, key){
    return system && system.parameters ? system.parameters[key] : undefined;
  };
  bridge.addRenderLighting = function(system, light){
    if (!system || light == null) return system;
    if (!Array.isArray(system.lights)) system.lights = [];
    if (system.lights.indexOf(light) < 0) system.lights.push(light);
    return system;
  };
  bridge.removeRenderLighting = function(system, light){
    if (!system || !Array.isArray(system.lights)) return system;
    system.lights = system.lights.filter(function(item){ return item !== light; });
    return system;
  };
  bridge.getRenderLightings = function(system){
    return system && Array.isArray(system.lights) ? system.lights.slice() : [];
  };
  bridge.setRenderLightingEnvironment = function(system, environment){
    if (!system) return system;
    system.environment = environment && typeof environment === 'object' ? Object.assign({}, environment) : {};
    return system;
  };
  bridge.getRenderLightingEnvironment = function(system){
    return system && system.environment ? Object.assign({}, system.environment) : {};
  };
  bridge.createRenderLightingSystemRegistry = function(options){
    var o = options || {};
    return {id:o.id != null ? String(o.id) : '', name:o.name != null ? String(o.name) : '', systems:{}, metadata:o.metadata && typeof o.metadata === 'object' ? Object.assign({}, o.metadata) : {}};
  };
  bridge.registerRenderLightingSystem = function(registry, system, id){
    if (!registry || !system) return system;
    if (!registry.systems || typeof registry.systems !== 'object') registry.systems = {};
    var key = id != null ? String(id) : (system.id != null ? String(system.id) : '');
    if (key) registry.systems[key] = system;
    return system;
  };
  bridge.getRenderLightingSystem = function(registry, id){ return registry && registry.systems && id != null ? registry.systems[String(id)] : undefined; };
  bridge.hasRenderLightingSystem = function(registry, id){ return !!(registry && registry.systems && id != null && Object.prototype.hasOwnProperty.call(registry.systems, String(id))); };
  bridge.releaseRenderLightingSystem = function(registry, id){ if (!registry || !registry.systems || id == null) return undefined; var k=String(id), s=registry.systems[k]; delete registry.systems[k]; return s; };
  bridge.clearRenderLightingSystems = function(registry){ if (registry) registry.systems = {}; return registry; };

  // V1.01.68: renderer-neutral Render UI / Overlay System facade.
  // Descriptor/query-only boundary. It does not replace, move, rebuild, or
  // automatically alter any existing game UI, DOM, canvas, or gameplay flow.
  bridge.createRenderUIOverlaySystem = function(options){
    var o = options || {};
    return {id:o.id != null ? String(o.id) : '', name:o.name != null ? String(o.name) : '', enabled:o.enabled !== false, overlays:[], properties:o.properties && typeof o.properties === 'object' ? Object.assign({}, o.properties) : {}, metadata:o.metadata && typeof o.metadata === 'object' ? Object.assign({}, o.metadata) : {}};
  };
  bridge.getRenderUIOverlaySystemProperty = function(system,key){
    if (!system || !key) return undefined;
    if (key === 'overlays') return system.overlays;
    if (key === 'properties') return system.properties;
    if (key === 'metadata') return system.metadata;
    return system[key];
  };
  bridge.setRenderUIOverlaySystemProperty = function(system,key,value){
    if (!system || !key) return system;
    if (key === 'overlays') system.overlays = Array.isArray(value) ? value.slice() : [];
    else if (key === 'properties') system.properties = value && typeof value === 'object' ? value : {};
    else if (key === 'metadata') system.metadata = value && typeof value === 'object' ? value : {};
    else system[key] = value;
    return system;
  };
  bridge.setRenderUIOverlaySystemEnabled = function(system,enabled){ if (system) system.enabled=!!enabled; return system; };
  bridge.getRenderUIOverlaySystemEnabled = function(system){ return !!(system && system.enabled !== false); };
  bridge.createRenderUIOverlay = function(options){
    var o=options||{};
    return {id:o.id != null ? String(o.id) : '', name:o.name != null ? String(o.name) : '', type:o.type != null ? String(o.type) : 'overlay', enabled:o.enabled !== false, visible:o.visible !== false, zIndex:o.zIndex != null ? Number(o.zIndex) : 0, position:o.position && typeof o.position === 'object' ? Object.assign({},o.position) : {}, size:o.size && typeof o.size === 'object' ? Object.assign({},o.size) : {}, properties:o.properties && typeof o.properties === 'object' ? Object.assign({},o.properties) : {}, metadata:o.metadata && typeof o.metadata === 'object' ? Object.assign({},o.metadata) : {}};
  };
  bridge.getRenderUIOverlayProperty = function(overlay,key){
    if (!overlay || !key) return undefined;
    if (key === 'position') return overlay.position;
    if (key === 'size') return overlay.size;
    if (key === 'properties') return overlay.properties;
    if (key === 'metadata') return overlay.metadata;
    return overlay[key];
  };
  bridge.setRenderUIOverlayProperty = function(overlay,key,value){
    if (!overlay || !key) return overlay;
    if (key === 'position') overlay.position = value && typeof value === 'object' ? Object.assign({},value) : {};
    else if (key === 'size') overlay.size = value && typeof value === 'object' ? Object.assign({},value) : {};
    else if (key === 'properties') overlay.properties = value && typeof value === 'object' ? value : {};
    else if (key === 'metadata') overlay.metadata = value && typeof value === 'object' ? value : {};
    else overlay[key]=value;
    return overlay;
  };
  bridge.setRenderUIOverlayEnabled = function(overlay,enabled){ if (overlay) overlay.enabled=!!enabled; return overlay; };
  bridge.getRenderUIOverlayEnabled = function(overlay){ return !!(overlay && overlay.enabled !== false); };
  bridge.setRenderUIOverlayVisible = function(overlay,visible){ if (overlay) overlay.visible=!!visible; return overlay; };
  bridge.getRenderUIOverlayVisible = function(overlay){ return !!(overlay && overlay.visible !== false); };
  bridge.addRenderUIOverlay = function(system,overlay){ if (!system || !overlay) return overlay; if (!Array.isArray(system.overlays)) system.overlays=[]; if (system.overlays.indexOf(overlay)<0) system.overlays.push(overlay); return overlay; };
  bridge.removeRenderUIOverlay = function(system,overlayOrIndex){ if (!system || !Array.isArray(system.overlays)) return undefined; var i=typeof overlayOrIndex==='number'?overlayOrIndex:system.overlays.indexOf(overlayOrIndex); if (i<0 || i>=system.overlays.length) return undefined; return system.overlays.splice(i,1)[0]; };
  bridge.getRenderUIOverlays = function(system){ return system && Array.isArray(system.overlays) ? system.overlays.slice() : []; };
  bridge.createRenderUIOverlaySystemRegistry = function(options){ var o=options||{}; return {id:o.id != null ? String(o.id) : '', name:o.name != null ? String(o.name) : '', systems:{}, metadata:o.metadata && typeof o.metadata === 'object' ? Object.assign({},o.metadata) : {}}; };
  bridge.registerRenderUIOverlaySystem = function(registry,system,id){ if (!registry || !system) return system; if (!registry.systems || typeof registry.systems!=='object') registry.systems={}; var k=id!=null?String(id):(system.id!=null?String(system.id):''); if(k) registry.systems[k]=system; return system; };
  bridge.getRenderUIOverlaySystem = function(registry,id){ return registry && registry.systems && id!=null ? registry.systems[String(id)] : undefined; };
  bridge.hasRenderUIOverlaySystem = function(registry,id){ return !!(registry && registry.systems && id!=null && Object.prototype.hasOwnProperty.call(registry.systems,String(id))); };
  bridge.releaseRenderUIOverlaySystem = function(registry,id){ if(!registry || !registry.systems || id==null) return undefined; var k=String(id),v=registry.systems[k]; delete registry.systems[k]; return v; };
  bridge.clearRenderUIOverlaySystems = function(registry){ if(registry) registry.systems={}; return registry; };


  // V1.01.72: renderer-neutral Physics / Collision / Spatial System facade.
  // Descriptor-only boundary. It does not create a physics engine, register
  // listeners, move objects, resolve collisions, or alter gameplay physics.
  bridge.createRenderPhysicsSystem=function(options){ var o=options||{}; return {id:o.id!=null?String(o.id):'',name:o.name!=null?String(o.name):'',enabled:o.enabled!==false,bodies:[],colliders:[],properties:o.properties&&typeof o.properties==='object'?Object.assign({},o.properties):{},metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}}; };
  bridge.getRenderPhysicsSystemProperty=function(system,key){ if(!system||!key)return undefined; if(key==='bodies')return system.bodies; if(key==='colliders')return system.colliders; if(key==='properties')return system.properties; if(key==='metadata')return system.metadata; return system[key]; };
  bridge.setRenderPhysicsSystemProperty=function(system,key,value){ if(!system||!key)return system; if(key==='bodies')system.bodies=Array.isArray(value)?value.slice():[]; else if(key==='colliders')system.colliders=Array.isArray(value)?value.slice():[]; else if(key==='properties')system.properties=value&&typeof value==='object'?value:{}; else if(key==='metadata')system.metadata=value&&typeof value==='object'?value:{}; else system[key]=value; return system; };
  bridge.setRenderPhysicsSystemEnabled=function(system,enabled){if(system)system.enabled=!!enabled;return system;};
  bridge.getRenderPhysicsSystemEnabled=function(system){return !!(system&&system.enabled!==false);};
  bridge.createRenderPhysicsBody=function(options){var o=options||{};return{id:o.id!=null?String(o.id):'',name:o.name!=null?String(o.name):'',type:o.type!=null?String(o.type):'static',enabled:o.enabled!==false,mass:o.mass==null?0:Number(o.mass),position:o.position&&typeof o.position==='object'?Object.assign({},o.position):{x:0,y:0,z:0},velocity:o.velocity&&typeof o.velocity==='object'?Object.assign({},o.velocity):{x:0,y:0,z:0},properties:o.properties&&typeof o.properties==='object'?Object.assign({},o.properties):{},metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}};};
  bridge.getRenderPhysicsBodyProperty=function(body,key){if(!body||!key)return undefined;if(key==='position')return body.position;if(key==='velocity')return body.velocity;if(key==='properties')return body.properties;if(key==='metadata')return body.metadata;return body[key];};
  bridge.setRenderPhysicsBodyProperty=function(body,key,value){if(!body||!key)return body;if(key==='position'||key==='velocity')body[key]=value&&typeof value==='object'?Object.assign({},value):{};else if(key==='properties')body.properties=value&&typeof value==='object'?value:{};else if(key==='metadata')body.metadata=value&&typeof value==='object'?value:{};else body[key]=value;return body;};
  bridge.setRenderPhysicsBodyEnabled=function(body,enabled){if(body)body.enabled=!!enabled;return body;};
  bridge.getRenderPhysicsBodyEnabled=function(body){return !!(body&&body.enabled!==false);};
  bridge.addRenderPhysicsBody=function(system,body){if(!system||!body)return body;if(!Array.isArray(system.bodies))system.bodies=[];if(system.bodies.indexOf(body)<0)system.bodies.push(body);return body;};
  bridge.removeRenderPhysicsBody=function(system,bodyOrIndex){if(!system||!Array.isArray(system.bodies))return undefined;var i=typeof bodyOrIndex==='number'?bodyOrIndex:system.bodies.indexOf(bodyOrIndex);if(i<0||i>=system.bodies.length)return undefined;return system.bodies.splice(i,1)[0];};
  bridge.getRenderPhysicsBodies=function(system){return system&&Array.isArray(system.bodies)?system.bodies.slice():[];};
  bridge.createRenderCollider=function(options){var o=options||{};return{id:o.id!=null?String(o.id):'',name:o.name!=null?String(o.name):'',shape:o.shape!=null?String(o.shape):'box',enabled:o.enabled!==false,isTrigger:!!o.isTrigger,size:o.size&&typeof o.size==='object'?Object.assign({},o.size):{x:1,y:1,z:1},offset:o.offset&&typeof o.offset==='object'?Object.assign({},o.offset):{x:0,y:0,z:0},properties:o.properties&&typeof o.properties==='object'?Object.assign({},o.properties):{},metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}};};
  bridge.getRenderColliderProperty=function(collider,key){if(!collider||!key)return undefined;if(key==='size'||key==='offset'||key==='properties'||key==='metadata')return collider[key];return collider[key];};
  bridge.setRenderColliderProperty=function(collider,key,value){if(!collider||!key)return collider;if(key==='size'||key==='offset')collider[key]=value&&typeof value==='object'?Object.assign({},value):{};else if(key==='properties')collider.properties=value&&typeof value==='object'?value:{};else if(key==='metadata')collider.metadata=value&&typeof value==='object'?value:{};else collider[key]=value;return collider;};
  bridge.setRenderColliderEnabled=function(collider,enabled){if(collider)collider.enabled=!!enabled;return collider;};
  bridge.getRenderColliderEnabled=function(collider){return !!(collider&&collider.enabled!==false);};
  bridge.addRenderCollider=function(system,collider){if(!system||!collider)return collider;if(!Array.isArray(system.colliders))system.colliders=[];if(system.colliders.indexOf(collider)<0)system.colliders.push(collider);return collider;};
  bridge.removeRenderCollider=function(system,colliderOrIndex){if(!system||!Array.isArray(system.colliders))return undefined;var i=typeof colliderOrIndex==='number'?colliderOrIndex:system.colliders.indexOf(colliderOrIndex);if(i<0||i>=system.colliders.length)return undefined;return system.colliders.splice(i,1)[0];};
  bridge.getRenderColliders=function(system){return system&&Array.isArray(system.colliders)?system.colliders.slice():[];};
  bridge.createRenderSpatialQuery=function(options){var o=options||{};return{id:o.id!=null?String(o.id):'',name:o.name!=null?String(o.name):'',type:o.type!=null?String(o.type):'bounds',center:o.center&&typeof o.center==='object'?Object.assign({},o.center):{x:0,y:0,z:0},size:o.size&&typeof o.size==='object'?Object.assign({},o.size):{x:1,y:1,z:1},enabled:o.enabled!==false,properties:o.properties&&typeof o.properties==='object'?Object.assign({},o.properties):{},metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}};};
  bridge.getRenderSpatialQueryProperty=function(query,key){if(!query||!key)return undefined;if(key==='center'||key==='size'||key==='properties'||key==='metadata')return query[key];return query[key];};
  bridge.setRenderSpatialQueryProperty=function(query,key,value){if(!query||!key)return query;if(key==='center'||key==='size')query[key]=value&&typeof value==='object'?Object.assign({},value):{};else if(key==='properties')query.properties=value&&typeof value==='object'?value:{};else if(key==='metadata')query.metadata=value&&typeof value==='object'?value:{};else query[key]=value;return query;};
  bridge.setRenderSpatialQueryEnabled=function(query,enabled){if(query)query.enabled=!!enabled;return query;};
  bridge.getRenderSpatialQueryEnabled=function(query){return !!(query&&query.enabled!==false);};
  bridge.createRenderPhysicsSystemRegistry=function(options){var o=options||{};return{id:o.id!=null?String(o.id):'',name:o.name!=null?String(o.name):'',systems:{},metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}};};
  bridge.registerRenderPhysicsSystem=function(registry,system,id){if(!registry||!system)return system;if(!registry.systems||typeof registry.systems!=='object')registry.systems={};var k=id!=null?String(id):(system.id!=null?String(system.id):'');if(k)registry.systems[k]=system;return system;};
  bridge.getRenderPhysicsSystem=function(registry,id){return registry&&registry.systems&&id!=null?registry.systems[String(id)]:undefined;};
  bridge.hasRenderPhysicsSystem=function(registry,id){return !!(registry&&registry.systems&&id!=null&&Object.prototype.hasOwnProperty.call(registry.systems,String(id)));};
  bridge.releaseRenderPhysicsSystem=function(registry,id){if(!registry||!registry.systems||id==null)return undefined;var k=String(id),v=registry.systems[k];delete registry.systems[k];return v;};
  bridge.clearRenderPhysicsSystems=function(registry){if(registry)registry.systems={};return registry;};

  // V1.01.73: renderer-neutral Physics / Collision / Spatial facade integration.
  // Facade-only boundary. It groups the V1.01.72 descriptor systems without
  // creating a physics engine, performing collision resolution, or moving game objects.
  bridge.createRenderPhysicsCollisionSpatialSystem=function(options){
    var o=options||{};
    return {id:o.id!=null?String(o.id):'',name:o.name!=null?String(o.name):'',enabled:o.enabled!==false,
      physicsSystem:o.physicsSystem||null,collisionSystem:o.collisionSystem||null,spatialQuerySystem:o.spatialQuerySystem||null,
      properties:o.properties&&typeof o.properties==='object'?Object.assign({},o.properties):{},
      metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}};
  };
  bridge.getRenderPhysicsCollisionSpatialSystemProperty=function(system,key){
    if(!system||!key)return undefined;
    if(key==='properties')return system.properties;
    if(key==='metadata')return system.metadata;
    return system[key];
  };
  bridge.setRenderPhysicsCollisionSpatialSystemProperty=function(system,key,value){
    if(!system||!key)return system;
    if(key==='properties')system.properties=value&&typeof value==='object'?value:{};
    else if(key==='metadata')system.metadata=value&&typeof value==='object'?value:{};
    else system[key]=value;
    return system;
  };
  bridge.setRenderPhysicsCollisionSpatialSystemEnabled=function(system,enabled){if(system)system.enabled=!!enabled;return system;};
  bridge.getRenderPhysicsCollisionSpatialSystemEnabled=function(system){return !!(system&&system.enabled!==false);};
  bridge.setRenderPhysicsCollisionSpatialPhysicsSystem=function(system,value){if(system)system.physicsSystem=value||null;return system;};
  bridge.getRenderPhysicsCollisionSpatialPhysicsSystem=function(system){return system?system.physicsSystem:null;};
  bridge.setRenderPhysicsCollisionSpatialCollisionSystem=function(system,value){if(system)system.collisionSystem=value||null;return system;};
  bridge.getRenderPhysicsCollisionSpatialCollisionSystem=function(system){return system?system.collisionSystem:null;};
  bridge.setRenderPhysicsCollisionSpatialQuerySystem=function(system,value){if(system)system.spatialQuerySystem=value||null;return system;};
  bridge.getRenderPhysicsCollisionSpatialQuerySystem=function(system){return system?system.spatialQuerySystem:null;};
  bridge.createRenderPhysicsCollisionSpatialSystemRegistry=function(options){var o=options||{};return{id:o.id!=null?String(o.id):'',name:o.name!=null?String(o.name):'',systems:{},metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}};};
  bridge.registerRenderPhysicsCollisionSpatialSystem=function(registry,system,id){if(!registry||!system)return system;if(!registry.systems||typeof registry.systems!=='object')registry.systems={};var k=id!=null?String(id):(system.id!=null?String(system.id):'');if(k)registry.systems[k]=system;return system;};
  bridge.getRenderPhysicsCollisionSpatialSystem=function(registry,id){return registry&&registry.systems&&id!=null?registry.systems[String(id)]:undefined;};
  bridge.hasRenderPhysicsCollisionSpatialSystem=function(registry,id){return !!(registry&&registry.systems&&id!=null&&Object.prototype.hasOwnProperty.call(registry.systems,String(id)));};
  bridge.releaseRenderPhysicsCollisionSpatialSystem=function(registry,id){if(!registry||!registry.systems||id==null)return undefined;var k=String(id),v=registry.systems[k];delete registry.systems[k];return v;};
  bridge.clearRenderPhysicsCollisionSpatialSystems=function(registry){if(registry)registry.systems={};return registry;};

  // V1.01.71: renderer-neutral Render Interaction System facade.
  // Facade-only boundary. It groups input, picking, and UI interaction
  // descriptors without attaching listeners, performing live picking,
  // moving DOM/canvas elements, or changing gameplay input.
  bridge.createRenderInteractionSystem = function(options){
    var o=options||{};
    return {id:o.id!=null?String(o.id):'', name:o.name!=null?String(o.name):'', enabled:o.enabled!==false, inputSystem:o.inputSystem||null, pickingRegistry:o.pickingRegistry||null, uiOverlaySystem:o.uiOverlaySystem||null, properties:o.properties&&typeof o.properties==='object'?Object.assign({},o.properties):{}, metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}};
  };
  bridge.getRenderInteractionSystemProperty=function(system,key){
    if(!system||!key) return undefined;
    if(key==='properties') return system.properties;
    if(key==='metadata') return system.metadata;
    return system[key];
  };
  bridge.setRenderInteractionSystemProperty=function(system,key,value){
    if(!system||!key) return system;
    if(key==='properties') system.properties=value&&typeof value==='object'?value:{};
    else if(key==='metadata') system.metadata=value&&typeof value==='object'?value:{};
    else system[key]=value;
    return system;
  };
  bridge.setRenderInteractionSystemEnabled=function(system,enabled){ if(system) system.enabled=!!enabled; return system; };
  bridge.getRenderInteractionSystemEnabled=function(system){ return !!(system&&system.enabled!==false); };
  bridge.setRenderInteractionInputSystem=function(system,inputSystem){ if(system) system.inputSystem=inputSystem||null; return system; };
  bridge.getRenderInteractionInputSystem=function(system){ return system?system.inputSystem:null; };
  bridge.setRenderInteractionPickingRegistry=function(system,registry){ if(system) system.pickingRegistry=registry||null; return system; };
  bridge.getRenderInteractionPickingRegistry=function(system){ return system?system.pickingRegistry:null; };
  bridge.setRenderInteractionUIOverlaySystem=function(system,overlaySystem){ if(system) system.uiOverlaySystem=overlaySystem||null; return system; };
  bridge.getRenderInteractionUIOverlaySystem=function(system){ return system?system.uiOverlaySystem:null; };
  bridge.createRenderInteractionSystemRegistry=function(options){
    var o=options||{};
    return {id:o.id!=null?String(o.id):'', name:o.name!=null?String(o.name):'', systems:{}, metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}};
  };
  bridge.registerRenderInteractionSystem=function(registry,system,id){ if(!registry||!system) return system; if(!registry.systems||typeof registry.systems!=='object') registry.systems={}; var k=id!=null?String(id):(system.id!=null?String(system.id):''); if(k) registry.systems[k]=system; return system; };
  bridge.getRenderInteractionSystem=function(registry,id){ return registry&&registry.systems&&id!=null?registry.systems[String(id)]:undefined; };
  bridge.hasRenderInteractionSystem=function(registry,id){ return !!(registry&&registry.systems&&id!=null&&Object.prototype.hasOwnProperty.call(registry.systems,String(id))); };
  bridge.releaseRenderInteractionSystem=function(registry,id){ if(!registry||!registry.systems||id==null) return undefined; var k=String(id),v=registry.systems[k]; delete registry.systems[k]; return v; };
  bridge.clearRenderInteractionSystems=function(registry){ if(registry) registry.systems={}; return registry; };

  // V1.01.69: renderer-neutral Render Input / Interaction System boundary.
  // Descriptor/query-only helpers. They do not attach listeners, capture input,
  // change controls, or alter any existing gameplay/input flow.
  bridge.createRenderInputSystem = function(options){
    var o=options||{};
    return {id:o.id!=null?String(o.id):'', name:o.name!=null?String(o.name):'', enabled:o.enabled!==false, active:o.active!==false, bindings:[], pointers:[], properties:o.properties&&typeof o.properties==='object'?Object.assign({},o.properties):{}, metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}};
  };
  bridge.getRenderInputSystemProperty = function(system,key){
    if(!system||!key) return undefined;
    if(key==='bindings') return system.bindings;
    if(key==='pointers') return system.pointers;
    if(key==='properties') return system.properties;
    if(key==='metadata') return system.metadata;
    return system[key];
  };
  bridge.setRenderInputSystemProperty = function(system,key,value){
    if(!system||!key) return system;
    if(key==='bindings') system.bindings=Array.isArray(value)?value.slice():[];
    else if(key==='pointers') system.pointers=Array.isArray(value)?value.slice():[];
    else if(key==='properties') system.properties=value&&typeof value==='object'?value:{};
    else if(key==='metadata') system.metadata=value&&typeof value==='object'?value:{};
    else system[key]=value;
    return system;
  };
  bridge.setRenderInputSystemEnabled=function(system,enabled){ if(system) system.enabled=!!enabled; return system; };
  bridge.getRenderInputSystemEnabled=function(system){ return !!(system&&system.enabled!==false); };
  bridge.setRenderInputSystemActive=function(system,active){ if(system) system.active=!!active; return system; };
  bridge.getRenderInputSystemActive=function(system){ return !!(system&&system.active!==false); };
  bridge.createRenderInputBinding=function(options){
    var o=options||{};
    return {id:o.id!=null?String(o.id):'', name:o.name!=null?String(o.name):'', type:o.type!=null?String(o.type):'action', action:o.action!=null?String(o.action):'', key:o.key!=null?String(o.key):'', button:o.button!=null?Number(o.button):null, enabled:o.enabled!==false, modifiers:Array.isArray(o.modifiers)?o.modifiers.slice():[], properties:o.properties&&typeof o.properties==='object'?Object.assign({},o.properties):{}, metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}};
  };
  bridge.getRenderInputBindingProperty=function(binding,key){
    if(!binding||!key) return undefined;
    if(key==='modifiers') return binding.modifiers;
    if(key==='properties') return binding.properties;
    if(key==='metadata') return binding.metadata;
    return binding[key];
  };
  bridge.setRenderInputBindingProperty=function(binding,key,value){
    if(!binding||!key) return binding;
    if(key==='modifiers') binding.modifiers=Array.isArray(value)?value.slice():[];
    else if(key==='properties') binding.properties=value&&typeof value==='object'?value:{};
    else if(key==='metadata') binding.metadata=value&&typeof value==='object'?value:{};
    else binding[key]=value;
    return binding;
  };
  bridge.setRenderInputBindingEnabled=function(binding,enabled){ if(binding) binding.enabled=!!enabled; return binding; };
  bridge.getRenderInputBindingEnabled=function(binding){ return !!(binding&&binding.enabled!==false); };
  bridge.addRenderInputBinding=function(system,binding){ if(!system||!binding) return binding; if(!Array.isArray(system.bindings)) system.bindings=[]; if(system.bindings.indexOf(binding)<0) system.bindings.push(binding); return binding; };
  bridge.removeRenderInputBinding=function(system,bindingOrIndex){ if(!system||!Array.isArray(system.bindings)) return undefined; var i=typeof bindingOrIndex==='number'?bindingOrIndex:system.bindings.indexOf(bindingOrIndex); if(i<0||i>=system.bindings.length) return undefined; return system.bindings.splice(i,1)[0]; };
  bridge.getRenderInputBindings=function(system){ return system&&Array.isArray(system.bindings)?system.bindings.slice():[]; };
  bridge.createRenderInputSystemRegistry=function(options){ var o=options||{}; return {id:o.id!=null?String(o.id):'', name:o.name!=null?String(o.name):'', systems:{}, metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}}; };
  bridge.registerRenderInputSystem=function(registry,system,id){ if(!registry||!system) return system; if(!registry.systems||typeof registry.systems!=='object') registry.systems={}; var k=id!=null?String(id):(system.id!=null?String(system.id):''); if(k) registry.systems[k]=system; return system; };
  bridge.getRenderInputSystem=function(registry,id){ return registry&&registry.systems&&id!=null?registry.systems[String(id)]:undefined; };
  bridge.hasRenderInputSystem=function(registry,id){ return !!(registry&&registry.systems&&id!=null&&Object.prototype.hasOwnProperty.call(registry.systems,String(id))); };
  bridge.releaseRenderInputSystem=function(registry,id){ if(!registry||!registry.systems||id==null) return undefined; var k=String(id),v=registry.systems[k]; delete registry.systems[k]; return v; };
  bridge.clearRenderInputSystems=function(registry){ if(registry) registry.systems={}; return registry; };

  // V1.01.70: renderer-neutral Interaction / Picking / Hit-Test System boundary.
  // Descriptor/query-only helpers. They do not attach listeners, raycast the live
  // scene automatically, change controls, or alter existing gameplay interaction.
  bridge.createRenderPickingContext=function(options){
    var o=options||{};
    return {id:o.id!=null?String(o.id):'', name:o.name!=null?String(o.name):'', enabled:o.enabled!==false, mode:o.mode!=null?String(o.mode):'single', camera:o.camera||null, viewport:o.viewport&&typeof o.viewport==='object'?Object.assign({},o.viewport):{}, pointer:o.pointer&&typeof o.pointer==='object'?Object.assign({},o.pointer):{}, properties:o.properties&&typeof o.properties==='object'?Object.assign({},o.properties):{}, metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}};
  };
  bridge.getRenderPickingContextProperty=function(context,key){ if(!context||!key) return undefined; if(key==='viewport') return context.viewport; if(key==='pointer') return context.pointer; if(key==='properties') return context.properties; if(key==='metadata') return context.metadata; return context[key]; };
  bridge.setRenderPickingContextProperty=function(context,key,value){ if(!context||!key) return context; if(key==='viewport') context.viewport=value&&typeof value==='object'?Object.assign({},value):{}; else if(key==='pointer') context.pointer=value&&typeof value==='object'?Object.assign({},value):{}; else if(key==='properties') context.properties=value&&typeof value==='object'?value:{}; else if(key==='metadata') context.metadata=value&&typeof value==='object'?value:{}; else context[key]=value; return context; };
  bridge.setRenderPickingContextEnabled=function(context,enabled){ if(context) context.enabled=!!enabled; return context; };
  bridge.getRenderPickingContextEnabled=function(context){ return !!(context&&context.enabled!==false); };
  bridge.createRenderPickRequest=function(options){ var o=options||{}; return {id:o.id!=null?String(o.id):'', type:o.type!=null?String(o.type):'pointer', x:o.x==null?0:Number(o.x), y:o.y==null?0:Number(o.y), maxDistance:o.maxDistance==null?null:Number(o.maxDistance), layerMask:o.layerMask==null?null:o.layerMask, recursive:o.recursive!==false, enabled:o.enabled!==false, properties:o.properties&&typeof o.properties==='object'?Object.assign({},o.properties):{}, metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}}; };
  bridge.getRenderPickRequestProperty=function(request,key){ if(!request||!key) return undefined; if(key==='properties') return request.properties; if(key==='metadata') return request.metadata; return request[key]; };
  bridge.setRenderPickRequestProperty=function(request,key,value){ if(!request||!key) return request; if(key==='properties') request.properties=value&&typeof value==='object'?value:{}; else if(key==='metadata') request.metadata=value&&typeof value==='object'?value:{}; else request[key]=value; return request; };
  bridge.setRenderPickRequestEnabled=function(request,enabled){ if(request) request.enabled=!!enabled; return request; };
  bridge.getRenderPickRequestEnabled=function(request){ return !!(request&&request.enabled!==false); };
  bridge.createRenderPickResult=function(options){ var o=options||{}; return {hit:!!o.hit, object:o.object||null, distance:o.distance==null?null:Number(o.distance), point:o.point&&typeof o.point==='object'?Object.assign({},o.point):null, normal:o.normal&&typeof o.normal==='object'?Object.assign({},o.normal):null, uv:o.uv&&typeof o.uv==='object'?Object.assign({},o.uv):null, faceIndex:o.faceIndex==null?null:Number(o.faceIndex), metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}}; };
  bridge.getRenderPickResultProperty=function(result,key){ return result&&key?result[key]:undefined; };
  bridge.setRenderPickResultProperty=function(result,key,value){ if(result&&key) result[key]=value; return result; };
  bridge.createRenderInteractionTarget=function(options){ var o=options||{}; return {id:o.id!=null?String(o.id):'', name:o.name!=null?String(o.name):'', object:o.object||null, enabled:o.enabled!==false, actions:Array.isArray(o.actions)?o.actions.slice():[], properties:o.properties&&typeof o.properties==='object'?Object.assign({},o.properties):{}, metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}}; };
  bridge.getRenderInteractionTargetProperty=function(target,key){ if(!target||!key) return undefined; if(key==='actions') return target.actions; if(key==='properties') return target.properties; if(key==='metadata') return target.metadata; return target[key]; };
  bridge.setRenderInteractionTargetProperty=function(target,key,value){ if(!target||!key) return target; if(key==='actions') target.actions=Array.isArray(value)?value.slice():[]; else if(key==='properties') target.properties=value&&typeof value==='object'?value:{}; else if(key==='metadata') target.metadata=value&&typeof value==='object'?value:{}; else target[key]=value; return target; };
  bridge.setRenderInteractionTargetEnabled=function(target,enabled){ if(target) target.enabled=!!enabled; return target; };
  bridge.getRenderInteractionTargetEnabled=function(target){ return !!(target&&target.enabled!==false); };
  bridge.addRenderInteractionAction=function(target,action){ if(!target||action==null) return target; if(!Array.isArray(target.actions)) target.actions=[]; if(target.actions.indexOf(action)<0) target.actions.push(action); return target; };
  bridge.removeRenderInteractionAction=function(target,actionOrIndex){ if(!target||!Array.isArray(target.actions)) return undefined; var i=typeof actionOrIndex==='number'?actionOrIndex:target.actions.indexOf(actionOrIndex); if(i<0||i>=target.actions.length) return undefined; return target.actions.splice(i,1)[0]; };
  bridge.getRenderInteractionActions=function(target){ return target&&Array.isArray(target.actions)?target.actions.slice():[]; };
  bridge.createRenderPickingRegistry=function(options){ var o=options||{}; return {id:o.id!=null?String(o.id):'', name:o.name!=null?String(o.name):'', contexts:{}, targets:{}, metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}}; };
  bridge.registerRenderPickingContext=function(registry,context,id){ if(!registry||!context) return context; if(!registry.contexts||typeof registry.contexts!=='object') registry.contexts={}; var k=id!=null?String(id):(context.id!=null?String(context.id):''); if(k) registry.contexts[k]=context; return context; };
  bridge.getRenderPickingContext=function(registry,id){ return registry&&registry.contexts&&id!=null?registry.contexts[String(id)]:undefined; };
  bridge.hasRenderPickingContext=function(registry,id){ return !!(registry&&registry.contexts&&id!=null&&Object.prototype.hasOwnProperty.call(registry.contexts,String(id))); };
  bridge.releaseRenderPickingContext=function(registry,id){ if(!registry||!registry.contexts||id==null) return undefined; var k=String(id),v=registry.contexts[k]; delete registry.contexts[k]; return v; };
  bridge.registerRenderInteractionTarget=function(registry,target,id){ if(!registry||!target) return target; if(!registry.targets||typeof registry.targets!=='object') registry.targets={}; var k=id!=null?String(id):(target.id!=null?String(target.id):''); if(k) registry.targets[k]=target; return target; };
  bridge.getRenderInteractionTarget=function(registry,id){ return registry&&registry.targets&&id!=null?registry.targets[String(id)]:undefined; };
  bridge.hasRenderInteractionTarget=function(registry,id){ return !!(registry&&registry.targets&&id!=null&&Object.prototype.hasOwnProperty.call(registry.targets,String(id))); };
  bridge.releaseRenderInteractionTarget=function(registry,id){ if(!registry||!registry.targets||id==null) return undefined; var k=String(id),v=registry.targets[k]; delete registry.targets[k]; return v; };
  bridge.clearRenderPickingRegistry=function(registry){ if(registry){ registry.contexts={}; registry.targets={}; } return registry; };

  // V1.01.74: renderer-neutral Audio / Sound System facade.
  // Descriptor/query-only helpers. They do not create, start, stop, or attach
  // any live WebAudio/HTMLAudio resource and do not alter existing gameplay audio.
  bridge.createRenderAudioSystem=function(options){var o=options||{};return{id:o.id!=null?String(o.id):'',name:o.name!=null?String(o.name):'',enabled:o.enabled!==false,masterVolume:o.masterVolume==null?1:Number(o.masterVolume),muted:!!o.muted,sounds:Array.isArray(o.sounds)?o.sounds.slice():[],music:Array.isArray(o.music)?o.music.slice():[],properties:o.properties&&typeof o.properties==='object'?Object.assign({},o.properties):{},metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}};};
  bridge.getRenderAudioSystemProperty=function(system,key){if(!system||!key)return undefined;if(key==='sounds')return system.sounds;if(key==='music')return system.music;if(key==='properties')return system.properties;if(key==='metadata')return system.metadata;return system[key];};
  bridge.setRenderAudioSystemProperty=function(system,key,value){if(!system||!key)return system;if(key==='sounds')system.sounds=Array.isArray(value)?value.slice():[];else if(key==='music')system.music=Array.isArray(value)?value.slice():[];else if(key==='properties')system.properties=value&&typeof value==='object'?value:{};else if(key==='metadata')system.metadata=value&&typeof value==='object'?value:{};else system[key]=value;return system;};
  bridge.setRenderAudioSystemEnabled=function(system,enabled){if(system)system.enabled=!!enabled;return system;};
  bridge.getRenderAudioSystemEnabled=function(system){return !!(system&&system.enabled!==false);};
  bridge.setRenderAudioSystemVolume=function(system,volume){if(system)system.masterVolume=Math.max(0,Math.min(1,Number(volume)));return system;};
  bridge.getRenderAudioSystemVolume=function(system){return system?Number(system.masterVolume):0;};
  bridge.setRenderAudioSystemMuted=function(system,muted){if(system)system.muted=!!muted;return system;};
  bridge.getRenderAudioSystemMuted=function(system){return !!(system&&system.muted);};
  bridge.createRenderSound=function(options){var o=options||{};return{id:o.id!=null?String(o.id):'',name:o.name!=null?String(o.name):'',source:o.source!=null?String(o.source):'',type:o.type!=null?String(o.type):'sfx',volume:o.volume==null?1:Number(o.volume),loop:!!o.loop,enabled:o.enabled!==false,state:o.state!=null?String(o.state):'stopped',properties:o.properties&&typeof o.properties==='object'?Object.assign({},o.properties):{},metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}};};
  bridge.getRenderSoundProperty=function(sound,key){if(!sound||!key)return undefined;if(key==='properties')return sound.properties;if(key==='metadata')return sound.metadata;return sound[key];};
  bridge.setRenderSoundProperty=function(sound,key,value){if(!sound||!key)return sound;if(key==='properties')sound.properties=value&&typeof value==='object'?value:{};else if(key==='metadata')sound.metadata=value&&typeof value==='object'?value:{};else sound[key]=value;return sound;};
  bridge.setRenderSoundState=function(sound,state){if(sound)sound.state=state!=null?String(state):'stopped';return sound;};
  bridge.getRenderSoundState=function(sound){return sound?sound.state:undefined;};
  bridge.setRenderSoundEnabled=function(sound,enabled){if(sound)sound.enabled=!!enabled;return sound;};
  bridge.getRenderSoundEnabled=function(sound){return !!(sound&&sound.enabled!==false);};
  bridge.setRenderSoundVolume=function(sound,volume){if(sound)sound.volume=Math.max(0,Math.min(1,Number(volume)));return sound;};
  bridge.getRenderSoundVolume=function(sound){return sound?Number(sound.volume):0;};
  bridge.setRenderSoundLoop=function(sound,loop){if(sound)sound.loop=!!loop;return sound;};
  bridge.getRenderSoundLoop=function(sound){return !!(sound&&sound.loop);};
  bridge.createRenderAudioRegistry=function(options){var o=options||{};return{id:o.id!=null?String(o.id):'',name:o.name!=null?String(o.name):'',systems:{},sounds:{},metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}};};
  bridge.registerRenderAudioSystem=function(registry,system,id){if(!registry||!system)return system;if(!registry.systems||typeof registry.systems!=='object')registry.systems={};var k=id!=null?String(id):(system.id!=null?String(system.id):'');if(k)registry.systems[k]=system;return system;};
  bridge.getRenderAudioSystem=function(registry,id){return registry&&registry.systems&&id!=null?registry.systems[String(id)]:undefined;};
  bridge.hasRenderAudioSystem=function(registry,id){return !!(registry&&registry.systems&&id!=null&&Object.prototype.hasOwnProperty.call(registry.systems,String(id)));};
  bridge.releaseRenderAudioSystem=function(registry,id){if(!registry||!registry.systems||id==null)return undefined;var k=String(id),v=registry.systems[k];delete registry.systems[k];return v;};
  bridge.registerRenderSound=function(registry,sound,id){if(!registry||!sound)return sound;if(!registry.sounds||typeof registry.sounds!=='object')registry.sounds={};var k=id!=null?String(id):(sound.id!=null?String(sound.id):'');if(k)registry.sounds[k]=sound;return sound;};
  bridge.getRenderSound=function(registry,id){return registry&&registry.sounds&&id!=null?registry.sounds[String(id)]:undefined;};
  bridge.hasRenderSound=function(registry,id){return !!(registry&&registry.sounds&&id!=null&&Object.prototype.hasOwnProperty.call(registry.sounds,String(id)));};
  bridge.releaseRenderSound=function(registry,id){if(!registry||!registry.sounds||id==null)return undefined;var k=String(id),v=registry.sounds[k];delete registry.sounds[k];return v;};
  bridge.clearRenderAudio=function(registry){if(registry){registry.systems={};registry.sounds={};}return registry;};

  // V1.01.75: renderer-neutral Runtime / Network / Asset Lifecycle facade.
  // Descriptor/query-only helpers. They do not open sockets, schedule work,
  // load assets, or alter existing gameplay/runtime state.
  bridge.createRenderRuntimeSystem=function(options){var o=options||{};return{id:o.id!=null?String(o.id):'',name:o.name!=null?String(o.name):'',enabled:o.enabled!==false,state:o.state!=null?String(o.state):'idle',tickRate:o.tickRate==null?0:Number(o.tickRate),parameters:o.parameters&&typeof o.parameters==='object'?Object.assign({},o.parameters):{},metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}};};
  bridge.getRenderRuntimeSystemProperty=function(system,key){return system&&key?system[key]:undefined;};
  bridge.setRenderRuntimeSystemProperty=function(system,key,value){if(system&&key)system[key]=value;return system;};
  bridge.setRenderRuntimeSystemEnabled=function(system,enabled){if(system)system.enabled=!!enabled;return system;};
  bridge.getRenderRuntimeSystemEnabled=function(system){return !!(system&&system.enabled!==false);};
  bridge.setRenderRuntimeSystemState=function(system,state){if(system)system.state=state!=null?String(state):'idle';return system;};
  bridge.getRenderRuntimeSystemState=function(system){return system?system.state:undefined;};
  bridge.setRenderRuntimeSystemParameter=function(system,key,value){if(system&&key){if(!system.parameters)system.parameters={};system.parameters[key]=value;}return system;};
  bridge.getRenderRuntimeSystemParameter=function(system,key){return system&&system.parameters&&key?system.parameters[key]:undefined;};
  bridge.createRenderRuntimeRegistry=function(options){var o=options||{};return{id:o.id!=null?String(o.id):'',name:o.name!=null?String(o.name):'',systems:{},metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}};};
  bridge.registerRenderRuntimeSystem=function(registry,system,id){if(!registry||!system)return system;if(!registry.systems)registry.systems={};var k=id!=null?String(id):(system.id!=null?String(system.id):'');if(k)registry.systems[k]=system;return system;};
  bridge.getRenderRuntimeSystem=function(registry,id){return registry&&registry.systems&&id!=null?registry.systems[String(id)]:undefined;};
  bridge.hasRenderRuntimeSystem=function(registry,id){return !!(registry&&registry.systems&&id!=null&&Object.prototype.hasOwnProperty.call(registry.systems,String(id)));};
  bridge.releaseRenderRuntimeSystem=function(registry,id){if(!registry||!registry.systems||id==null)return undefined;var k=String(id),v=registry.systems[k];delete registry.systems[k];return v;};
  bridge.clearRenderRuntimeSystems=function(registry){if(registry)registry.systems={};return registry;};

  bridge.createRenderNetworkSystem=function(options){var o=options||{};return{id:o.id!=null?String(o.id):'',name:o.name!=null?String(o.name):'',enabled:o.enabled!==false,state:o.state!=null?String(o.state):'offline',transport:o.transport!=null?String(o.transport):'',endpoint:o.endpoint!=null?String(o.endpoint):'',parameters:o.parameters&&typeof o.parameters==='object'?Object.assign({},o.parameters):{},metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}};};
  bridge.getRenderNetworkSystemProperty=function(system,key){return system&&key?system[key]:undefined;};
  bridge.setRenderNetworkSystemProperty=function(system,key,value){if(system&&key)system[key]=value;return system;};
  bridge.setRenderNetworkSystemEnabled=function(system,enabled){if(system)system.enabled=!!enabled;return system;};
  bridge.getRenderNetworkSystemEnabled=function(system){return !!(system&&system.enabled!==false);};
  bridge.setRenderNetworkSystemState=function(system,state){if(system)system.state=state!=null?String(state):'offline';return system;};
  bridge.getRenderNetworkSystemState=function(system){return system?system.state:undefined;};
  bridge.createRenderNetworkRegistry=function(options){var o=options||{};return{id:o.id!=null?String(o.id):'',name:o.name!=null?String(o.name):'',systems:{},metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}};};
  bridge.registerRenderNetworkSystem=function(registry,system,id){if(!registry||!system)return system;if(!registry.systems)registry.systems={};var k=id!=null?String(id):(system.id!=null?String(system.id):'');if(k)registry.systems[k]=system;return system;};
  bridge.getRenderNetworkSystem=function(registry,id){return registry&&registry.systems&&id!=null?registry.systems[String(id)]:undefined;};
  bridge.hasRenderNetworkSystem=function(registry,id){return !!(registry&&registry.systems&&id!=null&&Object.prototype.hasOwnProperty.call(registry.systems,String(id)));};
  bridge.releaseRenderNetworkSystem=function(registry,id){if(!registry||!registry.systems||id==null)return undefined;var k=String(id),v=registry.systems[k];delete registry.systems[k];return v;};
  bridge.clearRenderNetworkSystems=function(registry){if(registry)registry.systems={};return registry;};

  bridge.createRenderAssetLifecycle=function(options){var o=options||{};return{id:o.id!=null?String(o.id):'',name:o.name!=null?String(o.name):'',enabled:o.enabled!==false,state:o.state!=null?String(o.state):'idle',phase:o.phase!=null?String(o.phase):'unloaded',progress:o.progress==null?0:Number(o.progress),parameters:o.parameters&&typeof o.parameters==='object'?Object.assign({},o.parameters):{},metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}};};
  bridge.getRenderAssetLifecycleProperty=function(lifecycle,key){return lifecycle&&key?lifecycle[key]:undefined;};
  bridge.setRenderAssetLifecycleProperty=function(lifecycle,key,value){if(lifecycle&&key)lifecycle[key]=value;return lifecycle;};
  bridge.setRenderAssetLifecycleState=function(lifecycle,state){if(lifecycle)lifecycle.state=state!=null?String(state):'idle';return lifecycle;};
  bridge.getRenderAssetLifecycleState=function(lifecycle){return lifecycle?lifecycle.state:undefined;};
  bridge.setRenderAssetLifecyclePhase=function(lifecycle,phase){if(lifecycle)lifecycle.phase=phase!=null?String(phase):'unloaded';return lifecycle;};
  bridge.getRenderAssetLifecyclePhase=function(lifecycle){return lifecycle?lifecycle.phase:undefined;};
  bridge.setRenderAssetLifecycleProgress=function(lifecycle,progress){if(lifecycle)lifecycle.progress=Math.max(0,Math.min(1,Number(progress)));return lifecycle;};
  bridge.getRenderAssetLifecycleProgress=function(lifecycle){return lifecycle?Number(lifecycle.progress):0;};
  bridge.createRenderAssetLifecycleRegistry=function(options){var o=options||{};return{id:o.id!=null?String(o.id):'',name:o.name!=null?String(o.name):'',items:{},metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}};};
  bridge.registerRenderAssetLifecycle=function(registry,lifecycle,id){if(!registry||!lifecycle)return lifecycle;if(!registry.items)registry.items={};var k=id!=null?String(id):(lifecycle.id!=null?String(lifecycle.id):'');if(k)registry.items[k]=lifecycle;return lifecycle;};
  bridge.getRenderAssetLifecycle=function(registry,id){return registry&&registry.items&&id!=null?registry.items[String(id)]:undefined;};
  bridge.hasRenderAssetLifecycle=function(registry,id){return !!(registry&&registry.items&&id!=null&&Object.prototype.hasOwnProperty.call(registry.items,String(id)));};
  bridge.releaseRenderAssetLifecycle=function(registry,id){if(!registry||!registry.items||id==null)return undefined;var k=String(id),v=registry.items[k];delete registry.items[k];return v;};
  bridge.clearRenderAssetLifecycles=function(registry){if(registry)registry.items={};return registry;};

  // V1.01.83: renderer-neutral Material / Texture / Rarity / Holy-Demon visual facade.
  // Descriptor/query-only helpers. They do not mutate existing Character Model V2
  // materials, textures, equipment visuals, or renderer state unless explicitly applied.
  bridge.createRenderMaterialVisual=function(options){var o=options||{};return{id:o.id!=null?String(o.id):'',name:o.name!=null?String(o.name):'',materialType:o.materialType!=null?String(o.materialType):'standard',enabled:o.enabled!==false,visible:o.visible!==false,properties:o.properties&&typeof o.properties==='object'?Object.assign({},o.properties):{},textureIds:Array.isArray(o.textureIds)?o.textureIds.slice():[],rarity:o.rarity!=null?String(o.rarity):'common',glow:o.glow&&typeof o.glow==='object'?Object.assign({},o.glow):{},metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}};};
  bridge.getRenderMaterialVisualProperty=function(v,key){return v&&key?v[key]:undefined;};
  bridge.setRenderMaterialVisualProperty=function(v,key,value){if(v&&key)v[key]=value;return v;};
  bridge.setRenderMaterialVisualEnabled=function(v,enabled){if(v)v.enabled=!!enabled;return v;};
  bridge.getRenderMaterialVisualEnabled=function(v){return !!(v&&v.enabled!==false);};
  bridge.setRenderMaterialVisualVisible=function(v,visible){if(v)v.visible=!!visible;return v;};
  bridge.getRenderMaterialVisualVisible=function(v){return !!(v&&v.visible!==false);};
  bridge.setRenderMaterialVisualRarity=function(v,rarity){if(v)v.rarity=rarity!=null?String(rarity):'common';return v;};
  bridge.getRenderMaterialVisualRarity=function(v){return v?v.rarity:undefined;};
  bridge.setRenderMaterialVisualGlow=function(v,glow){if(v)v.glow=glow&&typeof glow==='object'?Object.assign({},glow):{};return v;};
  bridge.getRenderMaterialVisualGlow=function(v){return v?v.glow:undefined;};
  bridge.addRenderMaterialTexture=function(v,textureId){if(v&&textureId!=null){if(!Array.isArray(v.textureIds))v.textureIds=[];var id=String(textureId);if(v.textureIds.indexOf(id)<0)v.textureIds.push(id);}return v;};
  bridge.removeRenderMaterialTexture=function(v,textureId){if(v&&Array.isArray(v.textureIds)&&textureId!=null){var id=String(textureId);v.textureIds=v.textureIds.filter(function(x){return String(x)!==id;});}return v;};
  bridge.getRenderMaterialTextures=function(v){return v&&Array.isArray(v.textureIds)?v.textureIds.slice():[];};
  bridge.createRenderTextureVisual=function(options){var o=options||{};return{id:o.id!=null?String(o.id):'',name:o.name!=null?String(o.name):'',enabled:o.enabled!==false,state:o.state!=null?String(o.state):'ready',source:o.source!=null?String(o.source):'',wrapS:o.wrapS!=null?String(o.wrapS):'repeat',wrapT:o.wrapT!=null?String(o.wrapT):'repeat',offset:o.offset&&typeof o.offset==='object'?Object.assign({},o.offset):{x:0,y:0},repeat:o.repeat&&typeof o.repeat==='object'?Object.assign({},o.repeat):{x:1,y:1},metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}};};
  bridge.getRenderTextureVisualProperty=function(v,key){return v&&key?v[key]:undefined;};
  bridge.setRenderTextureVisualProperty=function(v,key,value){if(v&&key)v[key]=value;return v;};
  bridge.setRenderTextureVisualEnabled=function(v,enabled){if(v)v.enabled=!!enabled;return v;};
  bridge.getRenderTextureVisualEnabled=function(v){return !!(v&&v.enabled!==false);};
  bridge.setRenderTextureVisualState=function(v,state){if(v)v.state=state!=null?String(state):'ready';return v;};
  bridge.getRenderTextureVisualState=function(v){return v?v.state:undefined;};
  bridge.createRenderRarityVisual=function(options){var o=options||{};return{id:o.id!=null?String(o.id):'',rarity:o.rarity!=null?String(o.rarity):'common',label:o.label!=null?String(o.label):'',glow:o.glow&&typeof o.glow==='object'?Object.assign({},o.glow):{},tone:o.tone!=null?String(o.tone):'',intensity:o.intensity==null?0:Number(o.intensity),metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}};};
  bridge.getRenderRarityVisualProperty=function(v,key){return v&&key?v[key]:undefined;};
  bridge.setRenderRarityVisualProperty=function(v,key,value){if(v&&key)v[key]=value;return v;};
  bridge.setRenderRarityVisualRarity=function(v,rarity){if(v)v.rarity=rarity!=null?String(rarity):'common';return v;};
  bridge.getRenderRarityVisualRarity=function(v){return v?v.rarity:undefined;};
  bridge.setRenderRarityVisualGlow=function(v,glow){if(v)v.glow=glow&&typeof glow==='object'?Object.assign({},glow):{};return v;};
  bridge.getRenderRarityVisualGlow=function(v){return v?v.glow:undefined;};
  bridge.createRenderHolyDemonVisual=function(options){var o=options||{};return{id:o.id!=null?String(o.id):'',alignment:o.alignment!=null?String(o.alignment):'none',enabled:o.enabled!==false,wingGlow:o.wingGlow&&typeof o.wingGlow==='object'?Object.assign({},o.wingGlow):{},materialGlow:o.materialGlow&&typeof o.materialGlow==='object'?Object.assign({},o.materialGlow):{},aura:o.aura&&typeof o.aura==='object'?Object.assign({},o.aura):{},metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}};};
  bridge.getRenderHolyDemonVisualProperty=function(v,key){return v&&key?v[key]:undefined;};
  bridge.setRenderHolyDemonVisualProperty=function(v,key,value){if(v&&key)v[key]=value;return v;};
  bridge.setRenderHolyDemonVisualAlignment=function(v,alignment){if(v)v.alignment=alignment!=null?String(alignment):'none';return v;};
  bridge.getRenderHolyDemonVisualAlignment=function(v){return v?v.alignment:undefined;};
  bridge.setRenderHolyDemonVisualEnabled=function(v,enabled){if(v)v.enabled=!!enabled;return v;};
  bridge.getRenderHolyDemonVisualEnabled=function(v){return !!(v&&v.enabled!==false);};
  bridge.setRenderHolyDemonVisualGlow=function(v,kind,glow){if(v){v[kind==='wing'?'wingGlow':'materialGlow']=glow&&typeof glow==='object'?Object.assign({},glow):{};}return v;};
  bridge.getRenderHolyDemonVisualGlow=function(v,kind){return v?v[kind==='wing'?'wingGlow':'materialGlow']:undefined;};

  // V1.01.84: renderer-neutral Terrain / Static World / Lighting / Environment facade.
  // Descriptor/query-only helpers. They do not alter existing world objects, lights,
  // scene environment, terrain, or Three.js renderer state unless explicitly applied.
  bridge.createRenderTerrainVisual=function(options){var o=options||{};return{id:o.id!=null?String(o.id):'',name:o.name!=null?String(o.name):'',enabled:o.enabled!==false,visible:o.visible!==false,size:o.size&&typeof o.size==='object'?Object.assign({},o.size):{x:0,y:0,z:0},material:o.material!=null?String(o.material):'',textureId:o.textureId!=null?String(o.textureId):'',metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}};};
  bridge.getRenderTerrainVisualProperty=function(v,key){return v&&key?v[key]:undefined;};
  bridge.setRenderTerrainVisualProperty=function(v,key,value){if(v&&key)v[key]=value;return v;};
  bridge.setRenderTerrainVisualEnabled=function(v,enabled){if(v)v.enabled=!!enabled;return v;};
  bridge.getRenderTerrainVisualEnabled=function(v){return !!(v&&v.enabled!==false);};
  bridge.setRenderTerrainVisualVisible=function(v,visible){if(v)v.visible=!!visible;return v;};
  bridge.getRenderTerrainVisualVisible=function(v){return !!(v&&v.visible!==false);};
  bridge.createRenderStaticWorldVisual=function(options){var o=options||{};return{id:o.id!=null?String(o.id):'',name:o.name!=null?String(o.name):'',enabled:o.enabled!==false,visible:o.visible!==false,category:o.category!=null?String(o.category):'static',castShadow:o.castShadow!==false,receiveShadow:o.receiveShadow!==false,metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}};};
  bridge.getRenderStaticWorldVisualProperty=function(v,key){return v&&key?v[key]:undefined;};
  bridge.setRenderStaticWorldVisualProperty=function(v,key,value){if(v&&key)v[key]=value;return v;};
  bridge.setRenderStaticWorldVisualEnabled=function(v,enabled){if(v)v.enabled=!!enabled;return v;};
  bridge.getRenderStaticWorldVisualEnabled=function(v){return !!(v&&v.enabled!==false);};
  bridge.setRenderStaticWorldVisualVisible=function(v,visible){if(v)v.visible=!!visible;return v;};
  bridge.getRenderStaticWorldVisualVisible=function(v){return !!(v&&v.visible!==false);};
  bridge.createRenderEnvironmentVisual=function(options){var o=options||{};return{id:o.id!=null?String(o.id):'',name:o.name!=null?String(o.name):'',enabled:o.enabled!==false,background:o.background,skybox:o.skybox!=null?String(o.skybox):'',fog:o.fog&&typeof o.fog==='object'?Object.assign({},o.fog):{},ambient:o.ambient&&typeof o.ambient==='object'?Object.assign({},o.ambient):{},metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}};};
  bridge.getRenderEnvironmentVisualProperty=function(v,key){return v&&key?v[key]:undefined;};
  bridge.setRenderEnvironmentVisualProperty=function(v,key,value){if(v&&key)v[key]=value;return v;};
  bridge.setRenderEnvironmentVisualEnabled=function(v,enabled){if(v)v.enabled=!!enabled;return v;};
  bridge.getRenderEnvironmentVisualEnabled=function(v){return !!(v&&v.enabled!==false);};
  bridge.setRenderEnvironmentVisualBackground=function(v,bg){if(v)v.background=bg;return v;};
  bridge.getRenderEnvironmentVisualBackground=function(v){return v?v.background:undefined;};
  bridge.setRenderEnvironmentVisualFog=function(v,fog){if(v)v.fog=fog&&typeof fog==='object'?Object.assign({},fog):{};return v;};
  bridge.getRenderEnvironmentVisualFog=function(v){return v?v.fog:undefined;};
  bridge.createRenderWorldLightingVisual=function(options){var o=options||{};return{id:o.id!=null?String(o.id):'',name:o.name!=null?String(o.name):'',enabled:o.enabled!==false,lights:Array.isArray(o.lights)?o.lights.slice():[],environment:o.environment||null,metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}};};
  bridge.getRenderWorldLightingVisualProperty=function(v,key){return v&&key?v[key]:undefined;};
  bridge.setRenderWorldLightingVisualProperty=function(v,key,value){if(v&&key)v[key]=value;return v;};
  bridge.setRenderWorldLightingVisualEnabled=function(v,enabled){if(v)v.enabled=!!enabled;return v;};
  bridge.getRenderWorldLightingVisualEnabled=function(v){return !!(v&&v.enabled!==false);};
  bridge.addRenderWorldLighting=function(v,light){if(v&&light){if(!Array.isArray(v.lights))v.lights=[];if(v.lights.indexOf(light)<0)v.lights.push(light);}return v;};
  bridge.removeRenderWorldLighting=function(v,light){if(v&&Array.isArray(v.lights)){var i=v.lights.indexOf(light);if(i>=0)v.lights.splice(i,1);}return v;};
  bridge.getRenderWorldLightings=function(v){return v&&Array.isArray(v.lights)?v.lights.slice():[];};
  bridge.setRenderWorldLightingEnvironment=function(v,env){if(v)v.environment=env||null;return v;};
  bridge.getRenderWorldLightingEnvironment=function(v){return v?v.environment:undefined;};

  // V1.01.91 — Character Model V2 Appearance Data Bridge.
  // Normalizes default-character / appearance data without reading files or
  // touching the live Character Model V2 hierarchy.
  bridge.createCharacterAppearanceDataBridge=function(options){var o=options||{};return{version:'1.01.91',type:'character-appearance-data-bridge',source:o.source||'default-character.json',characterId:o.characterId==null?null:o.characterId,gender:o.gender==null?null:o.gender,className:o.className==null?null:o.className,appearance:o.appearance&&typeof o.appearance==='object'?Object.assign({},o.appearance):{},metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{},active:false,applied:false};};
  bridge.getCharacterAppearanceDataProperty=function(data,key){return data&&key!=null?data[String(key)]:undefined;};
  bridge.setCharacterAppearanceDataProperty=function(data,key,value){if(data&&key!=null)data[String(key)]=value;return data;};
  bridge.createCharacterAppearanceDataReference=function(options){var o=options||{};return{version:'1.01.91',type:'character-appearance-data-reference',source:o.source||'default-character.json',path:o.path||'',characterId:o.characterId==null?null:o.characterId,resolved:false,data:null};};
  bridge.resolveCharacterAppearanceDataReference=function(reference,data){if(reference){reference.data=data||reference.data||null;reference.resolved=!!reference.data;}return reference;};
  bridge.createCharacterAppearanceFieldMap=function(options){var o=options||{};return{version:'1.01.91',type:'character-appearance-field-map',fields:o.fields&&typeof o.fields==='object'?Object.assign({},o.fields):{},body:o.body&&typeof o.body==='object'?Object.assign({},o.body):{},face:o.face&&typeof o.face==='object'?Object.assign({},o.face):{},hair:o.hair&&typeof o.hair==='object'?Object.assign({},o.hair):{},colors:o.colors&&typeof o.colors==='object'?Object.assign({},o.colors):{},metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}};};
  bridge.createCharacterAppearanceMappingContext=function(options){var o=options||{};return{version:'1.01.91',type:'character-appearance-mapping-context',data:o.data||null,fieldMap:o.fieldMap||null,modelMapping:o.modelMapping||null,previewMapping:o.previewMapping||null,target:o.target||'character',active:false,applied:false};};
  bridge.setCharacterAppearanceMappingContextData=function(context,data){if(context)context.data=data||null;return context;};
  bridge.getCharacterAppearanceMappingContextData=function(context){return context?context.data:null;};
  bridge.setCharacterAppearanceMappingContextTarget=function(context,target){if(context)context.target=target==null?'character':String(target);return context;};
  bridge.getCharacterAppearanceMappingContextTarget=function(context){return context?context.target:undefined;};
  bridge.createCharacterAppearanceSnapshot=function(options){var o=options||{};return{version:'1.01.91',type:'character-appearance-snapshot',characterId:o.characterId==null?null:o.characterId,gender:o.gender==null?null:o.gender,className:o.className==null?null:o.className,body:o.body&&typeof o.body==='object'?Object.assign({},o.body):{},face:o.face&&typeof o.face==='object'?Object.assign({},o.face):{},hair:o.hair&&typeof o.hair==='object'?Object.assign({},o.hair):{},colors:o.colors&&typeof o.colors==='object'?Object.assign({},o.colors):{},metadata:o.metadata&&typeof o.metadata==='object'?Object.assign({},o.metadata):{}};};
  bridge.applyCharacterAppearanceDataBridge=function(context){return !!(context&&context.data);};
  bridge.createCharacterAppearanceDataRegistry=function(){return{items:{}};};
  bridge.registerCharacterAppearanceData=function(registry,id,data){if(!registry||id==null)return data;registry.items[String(id)]=data;return data;};
  bridge.getCharacterAppearanceData=function(registry,id){return registry&&id!=null?registry.items[String(id)]||null:null;};
  bridge.hasCharacterAppearanceData=function(registry,id){return !!(registry&&id!=null&&Object.prototype.hasOwnProperty.call(registry.items,String(id)));};
  bridge.releaseCharacterAppearanceData=function(registry,id){if(!registry||id==null)return false;var k=String(id);if(!Object.prototype.hasOwnProperty.call(registry.items,k))return false;delete registry.items[k];return true;};
  bridge.clearCharacterAppearanceData=function(registry){if(registry)registry.items={};return registry;};

  

// V1.01.93: PlayCanvas Character Asset Binding validation / isolated test layer.
// Explicit-call only. This validates references against a supplied asset map and
// never touches the live Three.js Character Model V2 hierarchy.
bridge.validateCharacterAssetBinding=function(binding,assets){
  var b=binding||{}; var a=assets||{};
  var required=['modelAssetId','bodyAssetId','headAssetId','hairAssetId','faceAssetId','wingAssetId'];
  var resolved={}; var missing=[];
  required.forEach(function(k){
    var id=b[k];
    if(id){ resolved[k]=a[id]||null; if(!resolved[k]) missing.push(id); }
  });
  ['equipmentAssetIds','weaponAssetIds'].forEach(function(k){
    var ids=Array.isArray(b[k])?b[k]:[];
    resolved[k]=ids.map(function(id){return a[id]||null;});
    ids.forEach(function(id,i){if(!resolved[k][i]) missing.push(id);});
  });
  return {valid:missing.length===0,resolved:resolved,missing:missing,checked:true,applied:false};
};
bridge.createCharacterAssetBindingTest=function(options){
  var o=options||{};
  return {version:'1.01.93',type:'character-asset-binding-test',binding:o.binding||null,assets:o.assets&&typeof o.assets==='object'?Object.assign({},o.assets):{},result:null,executed:false,applied:false};
};
bridge.runCharacterAssetBindingTest=function(test){
  if(!test) return null;
  test.result=bridge.validateCharacterAssetBinding(test.binding,test.assets);
  test.executed=true; test.applied=false;
  return test.result;
};

// V1.01.92: PlayCanvas Character Appearance -> Asset Binding preparation.
// Preparation-only descriptors. No asset loading, replacement, reparenting, or
// Character Model V2 mutation is performed by these helpers.
bridge.createCharacterAssetBinding=function(options){var o=options||{};return {id:o.id||null,characterId:o.characterId||null,appearanceId:o.appearanceId||null,modelAssetId:o.modelAssetId||null,bodyAssetId:o.bodyAssetId||null,headAssetId:o.headAssetId||null,hairAssetId:o.hairAssetId||null,faceAssetId:o.faceAssetId||null,equipmentAssetIds:Array.isArray(o.equipmentAssetIds)?o.equipmentAssetIds.slice():[],weaponAssetIds:Array.isArray(o.weaponAssetIds)?o.weaponAssetIds.slice():[],wingAssetId:o.wingAssetId||null,anchors:o.anchors||{},enabled:o.enabled!==false,state:o.state||'prepared'};};
bridge.getCharacterAssetBindingProperty=function(binding,key){return binding?binding[key]:undefined;};
bridge.setCharacterAssetBindingProperty=function(binding,key,value){if(binding)binding[key]=value;return binding;};
bridge.setCharacterAssetBindingState=function(binding,state){if(binding)binding.state=state;return binding;};
bridge.getCharacterAssetBindingState=function(binding){return binding?binding.state:undefined;};
bridge.addCharacterAssetReference=function(binding,type,assetId){if(!binding||!assetId)return binding;var key=type==='equipment'?'equipmentAssetIds':type==='weapon'?'weaponAssetIds':type==='hair'?'hairAssetIds':type==='face'?'faceAssetIds':null;if(key){binding[key]=binding[key]||[];if(binding[key].indexOf(assetId)<0)binding[key].push(assetId);}return binding;};
bridge.removeCharacterAssetReference=function(binding,type,assetId){if(!binding)return binding;var key=type==='equipment'?'equipmentAssetIds':type==='weapon'?'weaponAssetIds':type==='hair'?'hairAssetIds':type==='face'?'faceAssetIds':null;if(key&&Array.isArray(binding[key]))binding[key]=binding[key].filter(function(id){return id!==assetId;});return binding;};
bridge.createCharacterAssetBindingRegistry=function(){return {items:Object.create(null)};};
bridge.registerCharacterAssetBinding=function(registry,binding){if(registry&&binding&&binding.id)registry.items[binding.id]=binding;return binding;};
bridge.getCharacterAssetBinding=function(registry,id){return registry&&registry.items?registry.items[id]:undefined;};
bridge.hasCharacterAssetBinding=function(registry,id){return !!(registry&&registry.items&&Object.prototype.hasOwnProperty.call(registry.items,id));};
bridge.releaseCharacterAssetBinding=function(registry,id){if(registry&&registry.items)delete registry.items[id];};
bridge.clearCharacterAssetBindings=function(registry){if(registry)registry.items=Object.create(null);};
bridge.resolveCharacterAssetBinding=function(binding,assets){var a=assets||{};return {model:a[binding&&binding.modelAssetId]||null,body:a[binding&&binding.bodyAssetId]||null,head:a[binding&&binding.headAssetId]||null,hair:a[binding&&binding.hairAssetId]||null,face:a[binding&&binding.faceAssetId]||null,wing:a[binding&&binding.wingAssetId]||null};};
bridge.attachIsolatedCharacterPreviewAsset=function(instance,part,asset){
  if(!instance||instance.destroyed)return false;
  instance.previewAssetRefs=instance.previewAssetRefs||{}; instance.previewAssetRefs[part]=asset||null; return !!asset;
};
bridge.detachIsolatedCharacterPreviewAsset=function(instance,part){
  if(!instance||!instance.previewAssetRefs||!instance.previewAssetRefs[part])return false;
  delete instance.previewAssetRefs[part]; return true;
};
bridge.applyIsolatedCharacterPreviewAppearance=function(instance,appearance){
  if(!instance||instance.destroyed)return false; instance.appearance=appearance||null; instance.appearanceApplied=true; return true;
};
bridge.applyIsolatedCharacterPreviewAssetBinding=function(instance,binding,assets){
  if(!instance||instance.destroyed||!binding)return {applied:false,attached:[],missing:[]};
  var a=assets||{}, refs=[]; ['model','body','head','hair','face','wing'].forEach(function(k){var id=binding[k+'AssetId'];if(id)refs.push({part:k,id:id});});
  ['equipment','weapon'].forEach(function(k){(binding[k+'AssetIds']||[]).forEach(function(id){refs.push({part:k,id:id});});});
  var missing=refs.filter(function(r){return !a[r.id];}); var attached=refs.filter(function(r){return !!a[r.id];});
  instance.previewAssetBindingResult={applied:missing.length===0,attached:attached,missing:missing}; return instance.previewAssetBindingResult;
};
bridge.getIsolatedCharacterPreviewApplyResult=function(instance){return instance?{appearanceApplied:!!instance.appearanceApplied,binding:instance.previewAssetBindingResult||null}:null;};
bridge.createIsolatedCharacterModelV2Sync=function(options){options=options||{};return {version:'1.02.01',type:'isolated-character-model-v2-sync',id:options.id||('cmv2-sync-'+Date.now()),active:false,applied:false,revision:0,parts:{}};};
bridge.syncIsolatedCharacterPreviewToCharacterModelV2=function(instance,composition,sync){if(!sync||!instance||instance.destroyed)return {applied:false};sync.active=true;sync.applied=true;sync.revision=(sync.revision||0)+1;sync.parts={};return {applied:true,revision:sync.revision};};
bridge.validateIsolatedCharacterModelV2Sync=function(instance,composition,sync){
  if(!instance||instance.destroyed||!sync)return {valid:false,reason:'invalid-instance-or-sync',changes:[],missing:[]};
  var expected=(composition&&composition.assetRequests)||{}, actual=sync.parts||{}, changes=[], missing=[], keys={};
  Object.keys(expected).forEach(function(k){keys[k]=true;}); Object.keys(actual).forEach(function(k){keys[k]=true;});
  Object.keys(keys).forEach(function(part){var e=expected[part]||null,a=actual[part]||null,eid=e&&e.id||null,aid=a&&a.requestId||null,es=e&&e.state||null,as=a&&a.state||null;if(eid!==aid||es!==as)changes.push({part:part,expected:{requestId:eid,state:es},actual:{requestId:aid,state:as}});if(eid&&(!a||aid!==eid||as!=='loaded'))missing.push({part:part,requestId:eid,state:as||'missing'});});
  var r={version:'1.02.01',valid:changes.length===0&&missing.length===0,changed:changes.length>0,changes:changes,missing:missing,checked:true,revision:sync.revision||0}; sync.validation=r; return r;
};
bridge.applyIsolatedCharacterModelV2Sync=function(instance,composition,sync){var c=bridge.validateIsolatedCharacterModelV2Sync(instance,composition,sync);if(!c.valid){sync.applied=false;sync.lastDecision='rejected';sync.lastResult={version:'1.02.01',applied:false,decision:'rejected',validation:c};return sync.lastResult;}sync.applied=true;sync.active=true;sync.lastDecision='applied';sync.revision=(sync.revision||0)+1;sync.lastResult={version:'1.02.01',applied:true,decision:'applied',revision:sync.revision,parts:Object.keys(sync.parts||{})};return sync.lastResult;};
bridge.rejectIsolatedCharacterModelV2Sync=function(sync,reason){if(!sync)return false;sync.applied=false;sync.active=false;sync.lastDecision='rejected';sync.lastResult={version:'1.02.01',applied:false,decision:'rejected',reason:reason||'manual-reject',revision:sync.revision||0};return true;};
bridge.beginIsolatedCharacterModelV2ApplyTransaction=function(instance,composition,sync){return bridge.playcanvas&&bridge.playcanvas.beginIsolatedCharacterModelV2ApplyTransaction?bridge.playcanvas.beginIsolatedCharacterModelV2ApplyTransaction(instance,composition,sync):{ok:false,error:'PlayCanvas adapter unavailable'};};
bridge.commitIsolatedCharacterModelV2ApplyTransaction=function(sync){return bridge.playcanvas&&bridge.playcanvas.commitIsolatedCharacterModelV2ApplyTransaction?bridge.playcanvas.commitIsolatedCharacterModelV2ApplyTransaction(sync):false;};
bridge.rollbackIsolatedCharacterModelV2ApplyTransaction=function(sync){return bridge.playcanvas&&bridge.playcanvas.rollbackIsolatedCharacterModelV2ApplyTransaction?bridge.playcanvas.rollbackIsolatedCharacterModelV2ApplyTransaction(sync):false;};
bridge.getIsolatedCharacterModelV2ApplyTransaction=function(sync){return bridge.playcanvas&&bridge.playcanvas.getIsolatedCharacterModelV2ApplyTransaction?bridge.playcanvas.getIsolatedCharacterModelV2ApplyTransaction(sync):null;};
bridge.inspectIsolatedCharacterModelV2Sync=function(sync){return sync?{version:'1.02.00',id:sync.id,active:!!sync.active,applied:!!sync.applied,revision:sync.revision||0,parts:Object.assign({},sync.parts||{})}:null;};
bridge.createIsolatedCharacterModelV2ShadowInstance=function(options){return bridge.playcanvas&&bridge.playcanvas.createIsolatedCharacterModelV2ShadowInstance?bridge.playcanvas.createIsolatedCharacterModelV2ShadowInstance(options):null;};
bridge.buildIsolatedCharacterModelV2ShadowInstance=function(sync,shadow){return bridge.playcanvas&&bridge.playcanvas.buildIsolatedCharacterModelV2ShadowInstance?bridge.playcanvas.buildIsolatedCharacterModelV2ShadowInstance(sync,shadow):{ok:false,error:'PlayCanvas adapter unavailable'};};
bridge.validateIsolatedCharacterModelV2ShadowInstance=function(shadow){return bridge.playcanvas&&bridge.playcanvas.validateIsolatedCharacterModelV2ShadowInstance?bridge.playcanvas.validateIsolatedCharacterModelV2ShadowInstance(shadow):{valid:false,reason:'PlayCanvas adapter unavailable'};};
bridge.getIsolatedCharacterModelV2ShadowPart=function(shadow,part){return bridge.playcanvas&&bridge.playcanvas.getIsolatedCharacterModelV2ShadowPart?bridge.playcanvas.getIsolatedCharacterModelV2ShadowPart(shadow,part):null;};
bridge.inspectIsolatedCharacterModelV2ShadowInstance=function(shadow){return bridge.playcanvas&&bridge.playcanvas.inspectIsolatedCharacterModelV2ShadowInstance?bridge.playcanvas.inspectIsolatedCharacterModelV2ShadowInstance(shadow):null;};
bridge.clearIsolatedCharacterModelV2ShadowInstance=function(shadow){return bridge.playcanvas&&bridge.playcanvas.clearIsolatedCharacterModelV2ShadowInstance?bridge.playcanvas.clearIsolatedCharacterModelV2ShadowInstance(shadow):false;};
bridge.clearIsolatedCharacterModelV2Sync=function(sync){if(!sync)return false;sync.active=false;sync.applied=false;sync.parts={};sync.revision=(sync.revision||0)+1;return true;};
// Phase 1: ONLY the main WebGL renderer is owned by the bridge.
  // Scene, camera, game state, character systems and gameplay remain in the proven runtime.
  bridge.createRenderer = function(options){
    if (!getThree() || !getThree().WebGLRenderer) {
      throw new Error('Three.js WebGLRenderer is not available');
    }
    return new (getThree().WebGLRenderer)(options || {antialias:true, powerPreference:'high-performance'});
  };
  // Phase 2: main gameplay camera is now owned by the bridge.
  // Character/equipment preview cameras remain inside their existing preview systems.
  bridge.createCamera = function(options){
    if (!getThree() || !getThree().PerspectiveCamera) {
      throw new Error('Three.js PerspectiveCamera is not available');
    }
    var o = options || {};
    return new (getThree().PerspectiveCamera)(
      o.fov == null ? 52 : o.fov,
      o.aspect == null ? (global.innerWidth / global.innerHeight) : o.aspect,
      o.near == null ? .1 : o.near,
      o.far == null ? 500 : o.far
    );
  };
})(window);

/* V1.02.05 accelerated Character Composition transaction facade */
bridge.createCharacterCompositionSnapshotV205=function(instance){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.createCharacterCompositionSnapshotV205?bridge.playcanvasAdapter.createCharacterCompositionSnapshotV205(instance):null;};
bridge.diffCharacterCompositionV205=function(before,after){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.diffCharacterCompositionV205?bridge.playcanvasAdapter.diffCharacterCompositionV205(before,after):null;};
bridge.beginCharacterCompositionTransactionV205=function(instance){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.beginCharacterCompositionTransactionV205?bridge.playcanvasAdapter.beginCharacterCompositionTransactionV205(instance):{ok:false};};
bridge.rollbackCharacterCompositionTransactionV205=function(instance){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.rollbackCharacterCompositionTransactionV205?bridge.playcanvasAdapter.rollbackCharacterCompositionTransactionV205(instance):{ok:false};};
bridge.commitCharacterCompositionTransactionV205=function(instance){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.commitCharacterCompositionTransactionV205?bridge.playcanvasAdapter.commitCharacterCompositionTransactionV205(instance):{ok:false};};
bridge.inspectCharacterCompositionTransactionV205=function(instance){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.inspectCharacterCompositionTransactionV205?bridge.playcanvasAdapter.inspectCharacterCompositionTransactionV205(instance):null;};

/* V1.02.04 accelerated Shadow Character composition facade */
bridge.shadowCharacterCompositionV204=function(instance,options){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.shadowCharacterCompositionV204?bridge.playcanvasAdapter.shadowCharacterCompositionV204(instance,options):{ok:false,error:'adapter unavailable'}};
bridge.inspectShadowCharacterCompositionV204=function(instance){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.inspectShadowCharacterCompositionV204?bridge.playcanvasAdapter.inspectShadowCharacterCompositionV204(instance):null};
bridge.clearShadowCharacterCompositionV204=function(instance){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.clearShadowCharacterCompositionV204?bridge.playcanvasAdapter.clearShadowCharacterCompositionV204(instance):false};

/* V1.02.07 accelerated Character Preview visual state facade */
bridge.createCharacterPreviewVisualStateV206=function(instance,options){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.createCharacterPreviewVisualStateV206?bridge.playcanvasAdapter.createCharacterPreviewVisualStateV206(instance,options):null;};
bridge.applyCharacterPreviewVisualStateV206=function(instance,state){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.applyCharacterPreviewVisualStateV206?bridge.playcanvasAdapter.applyCharacterPreviewVisualStateV206(instance,state):{ok:false};};
bridge.setCharacterPreviewAnimationV206=function(instance,clip,options){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.setCharacterPreviewAnimationV206?bridge.playcanvasAdapter.setCharacterPreviewAnimationV206(instance,clip,options):{ok:false};};
bridge.setCharacterPreviewMaterialVisualV206=function(instance,part,options){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.setCharacterPreviewMaterialVisualV206?bridge.playcanvasAdapter.setCharacterPreviewMaterialVisualV206(instance,part,options):{ok:false};};
bridge.inspectCharacterPreviewVisualStateV206=function(instance){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.inspectCharacterPreviewVisualStateV206?bridge.playcanvasAdapter.inspectCharacterPreviewVisualStateV206(instance):null;};
bridge.clearCharacterPreviewVisualStateV206=function(instance){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.clearCharacterPreviewVisualStateV206?bridge.playcanvasAdapter.clearCharacterPreviewVisualStateV206(instance):false;};

/* V1.02.23 Render State Snapshot / Commit / Rollback */
bridge.createPreviewRenderCheckpointV223=function(i){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.createPreviewRenderCheckpointV223?bridge.playcanvasAdapter.createPreviewRenderCheckpointV223(i):null;};
bridge.validatePreviewRenderConsistencyV223=function(i){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.validatePreviewRenderConsistencyV223?bridge.playcanvasAdapter.validatePreviewRenderConsistencyV223(i):{ok:false,error:'adapter unavailable'};};
bridge.commitPreviewRenderCheckpointV223=function(i){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.commitPreviewRenderCheckpointV223?bridge.playcanvasAdapter.commitPreviewRenderCheckpointV223(i):{ok:false,status:'unavailable'};};
bridge.rollbackPreviewRenderCheckpointV223=function(i){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.rollbackPreviewRenderCheckpointV223?bridge.playcanvasAdapter.rollbackPreviewRenderCheckpointV223(i):{ok:false,status:'unavailable'};};
bridge.inspectPreviewRenderCheckpointV223=function(i){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.inspectPreviewRenderCheckpointV223?bridge.playcanvasAdapter.inspectPreviewRenderCheckpointV223(i):null;};

/* V1.02.24 accelerated Preview Render Resource Lifecycle */
bridge.beginPreviewRenderResourceLifecycleV224=function(i,r,o){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.beginPreviewRenderResourceLifecycleV224?bridge.playcanvasAdapter.beginPreviewRenderResourceLifecycleV224(i,r,o):{ok:false,error:'adapter unavailable'};};
bridge.updatePreviewRenderResourceBindingV224=function(i,k,b){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.updatePreviewRenderResourceBindingV224?bridge.playcanvasAdapter.updatePreviewRenderResourceBindingV224(i,k,b):{ok:false,error:'adapter unavailable'};};
bridge.validatePreviewRenderReadinessV224=function(i){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.validatePreviewRenderReadinessV224?bridge.playcanvasAdapter.validatePreviewRenderReadinessV224(i):{ok:false,ready:false,error:'adapter unavailable'};};
bridge.commitPreviewRenderResourceLifecycleV224=function(i){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.commitPreviewRenderResourceLifecycleV224?bridge.playcanvasAdapter.commitPreviewRenderResourceLifecycleV224(i):{ok:false,error:'adapter unavailable'};};
bridge.releasePreviewRenderResourceLifecycleV224=function(i){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.releasePreviewRenderResourceLifecycleV224?bridge.playcanvasAdapter.releasePreviewRenderResourceLifecycleV224(i):false;};
bridge.inspectPreviewRenderResourceLifecycleV224=function(i){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.inspectPreviewRenderResourceLifecycleV224?bridge.playcanvasAdapter.inspectPreviewRenderResourceLifecycleV224(i):null;};


/* V1.02.26 Character Model V2 Render Instance */
bridge.createCharacterModelV2RenderInstanceV226=function(o){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.createCharacterModelV2RenderInstanceV226?bridge.playcanvasAdapter.createCharacterModelV2RenderInstanceV226(o):null;};
bridge.bindCharacterModelV2RenderPartV226=function(i,p,b){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.bindCharacterModelV2RenderPartV226?bridge.playcanvasAdapter.bindCharacterModelV2RenderPartV226(i,p,b):false;};
bridge.syncCharacterModelV2RenderStateV226=function(i,s){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.syncCharacterModelV2RenderStateV226?bridge.playcanvasAdapter.syncCharacterModelV2RenderStateV226(i,s):{ok:false};};
bridge.validateCharacterModelV2RenderInstanceV226=function(i){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.validateCharacterModelV2RenderInstanceV226?bridge.playcanvasAdapter.validateCharacterModelV2RenderInstanceV226(i):{ok:false};};
bridge.commitCharacterModelV2RenderInstanceV226=function(i){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.commitCharacterModelV2RenderInstanceV226?bridge.playcanvasAdapter.commitCharacterModelV2RenderInstanceV226(i):{ok:false};};
bridge.rollbackCharacterModelV2RenderInstanceV226=function(i){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.rollbackCharacterModelV2RenderInstanceV226?bridge.playcanvasAdapter.rollbackCharacterModelV2RenderInstanceV226(i):false;};
bridge.inspectCharacterModelV2RenderInstanceV226=function(i){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.inspectCharacterModelV2RenderInstanceV226?bridge.playcanvasAdapter.inspectCharacterModelV2RenderInstanceV226(i):null;};

/* V1.02.28 Accelerated Character Model V2 Render Composition */

bridge.createCharacterModelV2RenderInstanceV228=function(o){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.createCharacterModelV2RenderInstanceV228?bridge.playcanvasAdapter.createCharacterModelV2RenderInstanceV228(o):null;};
bridge.bindCharacterModelV2RenderPartV228=function(i,p,d){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.bindCharacterModelV2RenderPartV228?bridge.playcanvasAdapter.bindCharacterModelV2RenderPartV228(i,p,d):false;};
bridge.bindCharacterModelV2RenderResourcesV228=function(i,r){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.bindCharacterModelV2RenderResourcesV228?bridge.playcanvasAdapter.bindCharacterModelV2RenderResourcesV228(i,r):false;};
bridge.applyCharacterModelV2VisualStateV228=function(i,s){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.applyCharacterModelV2VisualStateV228?bridge.playcanvasAdapter.applyCharacterModelV2VisualStateV228(i,s):false;};
bridge.validateCharacterModelV2RenderV228=function(i){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.validateCharacterModelV2RenderV228?bridge.playcanvasAdapter.validateCharacterModelV2RenderV228(i):null;};
bridge.commitCharacterModelV2RenderV228=function(i){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.commitCharacterModelV2RenderV228?bridge.playcanvasAdapter.commitCharacterModelV2RenderV228(i):null;};
bridge.rollbackCharacterModelV2RenderV228=function(i){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.rollbackCharacterModelV2RenderV228?bridge.playcanvasAdapter.rollbackCharacterModelV2RenderV228(i):false;};
bridge.inspectCharacterModelV2RenderV228=function(i){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.inspectCharacterModelV2RenderV228?bridge.playcanvasAdapter.inspectCharacterModelV2RenderV228(i):null;};
bridge.clearCharacterModelV2RenderV228=function(i){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.clearCharacterModelV2RenderV228?bridge.playcanvasAdapter.clearCharacterModelV2RenderV228(i):false;};

/* V1.02.29 accelerated Character Model V2 render pipeline */
bridge.createCharacterRenderPipelineV229=function(o){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.createCharacterRenderPipelineV229?bridge.playcanvasAdapter.createCharacterRenderPipelineV229(o):null;};
bridge.updateCharacterRenderPipelineV229=function(p,x){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.updateCharacterRenderPipelineV229?bridge.playcanvasAdapter.updateCharacterRenderPipelineV229(p,x):{ok:false,error:'adapter unavailable'};};
bridge.validateCharacterRenderPipelineV229=function(p){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.validateCharacterRenderPipelineV229?bridge.playcanvasAdapter.validateCharacterRenderPipelineV229(p):{ok:false,ready:false,error:'adapter unavailable'};};
bridge.commitCharacterRenderPipelineV229=function(p){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.commitCharacterRenderPipelineV229?bridge.playcanvasAdapter.commitCharacterRenderPipelineV229(p):{ok:false,committed:false};};
bridge.rollbackCharacterRenderPipelineV229=function(p){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.rollbackCharacterRenderPipelineV229?bridge.playcanvasAdapter.rollbackCharacterRenderPipelineV229(p):false;};
bridge.inspectCharacterRenderPipelineV229=function(p){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.inspectCharacterRenderPipelineV229?bridge.playcanvasAdapter.inspectCharacterRenderPipelineV229(p):null;};

/* V1.02.30 unified Character Render Pipeline */
bridge.createCharacterRenderPipelineV230=function(o){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.createCharacterRenderPipelineV230?bridge.playcanvasAdapter.createCharacterRenderPipelineV230(o):null;};
bridge.updateCharacterRenderPipelineV230=function(p,x){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.updateCharacterRenderPipelineV230?bridge.playcanvasAdapter.updateCharacterRenderPipelineV230(p,x):{ok:false,error:'adapter unavailable'};};
bridge.validateCharacterRenderPipelineV230=function(p){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.validateCharacterRenderPipelineV230?bridge.playcanvasAdapter.validateCharacterRenderPipelineV230(p):{ok:false,error:'adapter unavailable'};};
bridge.commitCharacterRenderPipelineV230=function(p){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.commitCharacterRenderPipelineV230?bridge.playcanvasAdapter.commitCharacterRenderPipelineV230(p):{ok:false,error:'adapter unavailable'};};
bridge.rollbackCharacterRenderPipelineV230=function(p){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.rollbackCharacterRenderPipelineV230?bridge.playcanvasAdapter.rollbackCharacterRenderPipelineV230(p):false;};
bridge.inspectCharacterRenderPipelineV230=function(p){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.inspectCharacterRenderPipelineV230?bridge.playcanvasAdapter.inspectCharacterRenderPipelineV230(p):null;};

/* V1.02.31 Character Render Instance Runtime */
bridge.createCharacterRenderRuntimeV231=function(o){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.createCharacterRenderRuntimeV231?bridge.playcanvasAdapter.createCharacterRenderRuntimeV231(o):null;};
bridge.updateCharacterRenderRuntimeV231=function(r,p,d){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.updateCharacterRenderRuntimeV231?bridge.playcanvasAdapter.updateCharacterRenderRuntimeV231(r,p,d):{ok:false,error:'adapter unavailable'};};
bridge.validateCharacterRenderRuntimeV231=function(r){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.validateCharacterRenderRuntimeV231?bridge.playcanvasAdapter.validateCharacterRenderRuntimeV231(r):{ok:false,error:'adapter unavailable'};};
bridge.commitCharacterRenderRuntimeV231=function(r){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.commitCharacterRenderRuntimeV231?bridge.playcanvasAdapter.commitCharacterRenderRuntimeV231(r):{ok:false,error:'adapter unavailable'};};
bridge.rollbackCharacterRenderRuntimeV231=function(r){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.rollbackCharacterRenderRuntimeV231?bridge.playcanvasAdapter.rollbackCharacterRenderRuntimeV231(r):false;};
bridge.inspectCharacterRenderRuntimeV231=function(r){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.inspectCharacterRenderRuntimeV231?bridge.playcanvasAdapter.inspectCharacterRenderRuntimeV231(r):null;};
bridge.clearCharacterRenderRuntimeV231=function(r){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.clearCharacterRenderRuntimeV231?bridge.playcanvasAdapter.clearCharacterRenderRuntimeV231(r):false;};

/* V1.03.00 integrated Character Model V2 Runtime */
bridge.createCharacterModelV2RuntimeV300=function(o){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.createCharacterModelV2RuntimeV300?bridge.playcanvasAdapter.createCharacterModelV2RuntimeV300(o):null;};
bridge.updateCharacterModelV2RuntimeV300=function(r,p,d){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.updateCharacterModelV2RuntimeV300?bridge.playcanvasAdapter.updateCharacterModelV2RuntimeV300(r,p,d):{ok:false,error:'adapter unavailable'};};
bridge.validateCharacterModelV2RuntimeV300=function(r){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.validateCharacterModelV2RuntimeV300?bridge.playcanvasAdapter.validateCharacterModelV2RuntimeV300(r):{ok:false,error:'adapter unavailable'};};
bridge.commitCharacterModelV2RuntimeV300=function(r){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.commitCharacterModelV2RuntimeV300?bridge.playcanvasAdapter.commitCharacterModelV2RuntimeV300(r):{ok:false,error:'adapter unavailable'};};
bridge.rollbackCharacterModelV2RuntimeV300=function(r){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.rollbackCharacterModelV2RuntimeV300?bridge.playcanvasAdapter.rollbackCharacterModelV2RuntimeV300(r):false;};
bridge.inspectCharacterModelV2RuntimeV300=function(r){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.inspectCharacterModelV2RuntimeV300?bridge.playcanvasAdapter.inspectCharacterModelV2RuntimeV300(r):null;};
bridge.clearCharacterModelV2RuntimeV300=function(r){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.clearCharacterModelV2RuntimeV300?bridge.playcanvasAdapter.clearCharacterModelV2RuntimeV300(r):false;};


/* V1.04.00 Character Model V2 Live Visual Layer facade */
bridge.createCharacterModelV2LiveInstanceV104=function(o){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.createCharacterModelV2LiveInstanceV104?bridge.playcanvasAdapter.createCharacterModelV2LiveInstanceV104(o):null;};
bridge.updateCharacterModelV2LiveInstanceV104=function(i,s,d){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.updateCharacterModelV2LiveInstanceV104?bridge.playcanvasAdapter.updateCharacterModelV2LiveInstanceV104(i,s,d):{ok:false,error:'adapter unavailable'};};
bridge.validateCharacterModelV2LiveInstanceV104=function(i){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.validateCharacterModelV2LiveInstanceV104?bridge.playcanvasAdapter.validateCharacterModelV2LiveInstanceV104(i):{ok:false,error:'adapter unavailable'};};
bridge.commitCharacterModelV2LiveInstanceV104=function(i){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.commitCharacterModelV2LiveInstanceV104?bridge.playcanvasAdapter.commitCharacterModelV2LiveInstanceV104(i):{ok:false,error:'adapter unavailable'};};
bridge.rollbackCharacterModelV2LiveInstanceV104=function(i){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.rollbackCharacterModelV2LiveInstanceV104?bridge.playcanvasAdapter.rollbackCharacterModelV2LiveInstanceV104(i):false;};
bridge.inspectCharacterModelV2LiveInstanceV104=function(i){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.inspectCharacterModelV2LiveInstanceV104?bridge.playcanvasAdapter.inspectCharacterModelV2LiveInstanceV104(i):null;};
bridge.clearCharacterModelV2LiveInstanceV104=function(i){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.clearCharacterModelV2LiveInstanceV104?bridge.playcanvasAdapter.clearCharacterModelV2LiveInstanceV104(i):false;};

/* V1.05.00 Character Model V2 Asset Instance Runtime */
bridge.createCharacterV2AssetInstanceV105=function(o){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.createCharacterV2AssetInstanceV105?bridge.playcanvasAdapter.createCharacterV2AssetInstanceV105(o):null;};
bridge.bindCharacterV2AssetV105=function(i,p,a,o){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.bindCharacterV2AssetV105?bridge.playcanvasAdapter.bindCharacterV2AssetV105(i,p,a,o):{ok:false};};
bridge.updateCharacterV2AppearanceV105=function(i,s){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.updateCharacterV2AppearanceV105?bridge.playcanvasAdapter.updateCharacterV2AppearanceV105(i,s):false;};
bridge.updateCharacterV2EquipmentV105=function(i,s){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.updateCharacterV2EquipmentV105?bridge.playcanvasAdapter.updateCharacterV2EquipmentV105(i,s):false;};
bridge.updateCharacterV2AnimationV105=function(i,s){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.updateCharacterV2AnimationV105?bridge.playcanvasAdapter.updateCharacterV2AnimationV105(i,s):false;};
bridge.updateCharacterV2MaterialV105=function(i,s){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.updateCharacterV2MaterialV105?bridge.playcanvasAdapter.updateCharacterV2MaterialV105(i,s):false;};
bridge.updateCharacterV2ResourcesV105=function(i,s){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.updateCharacterV2ResourcesV105?bridge.playcanvasAdapter.updateCharacterV2ResourcesV105(i,s):false;};
bridge.validateCharacterV2AssetInstanceV105=function(i){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.validateCharacterV2AssetInstanceV105?bridge.playcanvasAdapter.validateCharacterV2AssetInstanceV105(i):{ok:false};};
bridge.commitCharacterV2AssetInstanceV105=function(i,l){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.commitCharacterV2AssetInstanceV105?bridge.playcanvasAdapter.commitCharacterV2AssetInstanceV105(i,l):{ok:false};};
bridge.updateCharacterV2AssetInstanceFrameV105=function(i,d){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.updateCharacterV2AssetInstanceFrameV105?bridge.playcanvasAdapter.updateCharacterV2AssetInstanceFrameV105(i,d):false;};
bridge.rollbackCharacterV2AssetInstanceV105=function(i){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.rollbackCharacterV2AssetInstanceV105?bridge.playcanvasAdapter.rollbackCharacterV2AssetInstanceV105(i):false;};
bridge.inspectCharacterV2AssetInstanceV105=function(i){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.inspectCharacterV2AssetInstanceV105?bridge.playcanvasAdapter.inspectCharacterV2AssetInstanceV105(i):null;};
bridge.clearCharacterV2AssetInstanceV105=function(i){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.clearCharacterV2AssetInstanceV105?bridge.playcanvasAdapter.clearCharacterV2AssetInstanceV105(i):false;};
bridge.version='1.05.00';


/* V1.06.00 Current Character Model V2 Source Bridge */
bridge.createCurrentCharacterModelV2SourceV106=function(s,o){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.createCurrentCharacterModelV2SourceV106?bridge.playcanvasAdapter.createCurrentCharacterModelV2SourceV106(s,o):null;};
bridge.bindCurrentCharacterModelV2SourceV106=function(i,s,o){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.bindCurrentCharacterModelV2SourceV106?bridge.playcanvasAdapter.bindCurrentCharacterModelV2SourceV106(i,s,o):{ok:false};};
bridge.validateCurrentCharacterModelV2SourceV106=function(s){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.validateCurrentCharacterModelV2SourceV106?bridge.playcanvasAdapter.validateCurrentCharacterModelV2SourceV106(s):{ok:false};};
bridge.applyCurrentCharacterModelV2SourceToAssetInstanceV106=function(i,s,o){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.applyCurrentCharacterModelV2SourceToAssetInstanceV106?bridge.playcanvasAdapter.applyCurrentCharacterModelV2SourceToAssetInstanceV106(i,s,o):{ok:false};};
bridge.inspectCurrentCharacterModelV2SourceV106=function(i){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.inspectCurrentCharacterModelV2SourceV106?bridge.playcanvasAdapter.inspectCurrentCharacterModelV2SourceV106(i):null;};


/* V1.07.00 Chase Character Asset Test Bridge */
bridge.createChaseCharacterAssetTestV107=function(options){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.createChaseCharacterAssetTestV107?bridge.playcanvasAdapter.createChaseCharacterAssetTestV107(options):null;};
bridge.loadChaseCharacterAssetTestV107=function(test,options){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.loadChaseCharacterAssetTestV107?bridge.playcanvasAdapter.loadChaseCharacterAssetTestV107(test,options):{ok:false,error:'adapter unavailable'};};
bridge.inspectChaseCharacterAssetTestV107=function(test){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.inspectChaseCharacterAssetTestV107?bridge.playcanvasAdapter.inspectChaseCharacterAssetTestV107(test):null;};
bridge.releaseChaseCharacterAssetTestV107=function(test){return bridge.playcanvasAdapter&&bridge.playcanvasAdapter.releaseChaseCharacterAssetTestV107?bridge.playcanvasAdapter.releaseChaseCharacterAssetTestV107(test):false;};
