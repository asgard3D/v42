(function(global){
  'use strict';
  // V1.01.49 — Render Bounds / Spatial Query API boundary.
  // This is an API contract only; it does not replace the existing renderer.
  var api = global.AsgardRenderAdapter = global.AsgardRenderAdapter || {};
  /* V1.02.09 Preview Visual Instance facade */
api.createPreviewVisualInstanceV209=function(options){return bridge.createPreviewVisualInstanceV209(options);};
api.updatePreviewVisualInstanceV209=function(instance,state){return bridge.updatePreviewVisualInstanceV209(instance,state);};
api.inspectPreviewVisualInstanceV209=function(instance){return bridge.inspectPreviewVisualInstanceV209(instance);};
api.clearPreviewVisualInstanceV209=function(instance){return bridge.clearPreviewVisualInstanceV209(instance);};
/* V1.02.11 Preview Visual State Diff + Apply Transaction */
api.diffPreviewVisualInstanceV211=function(instance,nextState){return bridge.diffPreviewVisualInstanceV211(instance,nextState);};
api.beginPreviewVisualTransactionV211=function(instance,nextState,options){return bridge.beginPreviewVisualTransactionV211(instance,nextState,options);};
api.applyPreviewVisualTransactionV211=function(instance,nextState,options){return bridge.applyPreviewVisualTransactionV211(instance,nextState,options);};
api.rollbackPreviewVisualTransactionV211=function(instance){return bridge.rollbackPreviewVisualTransactionV211(instance);};
api.inspectPreviewVisualTransactionV211=function(instance){return bridge.inspectPreviewVisualTransactionV211(instance);};

/* V1.02.12 Preview Visual Frame / Update Lifecycle */
api.beginPreviewVisualFrameV212=function(instance,deltaTime,options){return bridge.beginPreviewVisualFrameV212(instance,deltaTime,options);};
api.updatePreviewVisualFrameV212=function(instance,state,options){return bridge.updatePreviewVisualFrameV212(instance,state,options);};
api.endPreviewVisualFrameV212=function(instance){return bridge.endPreviewVisualFrameV212(instance);};
api.inspectPreviewVisualFrameV212=function(instance){return bridge.inspectPreviewVisualFrameV212(instance);};
api.clearPreviewVisualFrameV212=function(instance){return bridge.clearPreviewVisualFrameV212(instance);};

/* V1.02.13 Preview Visual Frame / State Consistency */
api.validatePreviewVisualFrameV213=function(instance,options){return bridge.validatePreviewVisualFrameV213(instance,options);};
api.inspectPreviewVisualFrameV213=function(instance){return bridge.inspectPreviewVisualFrameV213(instance);};
api.clearPreviewVisualFrameV213=function(instance){return bridge.clearPreviewVisualFrameV213(instance);};

/* V1.02.14 Preview Visual Unified Lifecycle */
api.beginPreviewVisualLifecycleV214=function(instance,options){return bridge.beginPreviewVisualLifecycleV214(instance,options);};
api.updatePreviewVisualLifecycleV214=function(instance,state,options){return bridge.updatePreviewVisualLifecycleV214(instance,state,options);};
api.endPreviewVisualLifecycleV214=function(instance,options){return bridge.endPreviewVisualLifecycleV214(instance,options);};
api.inspectPreviewVisualLifecycleV214=function(instance){return bridge.inspectPreviewVisualLifecycleV214(instance);};
api.clearPreviewVisualLifecycleV214=function(instance){return bridge.clearPreviewVisualLifecycleV214(instance);};

/* V1.02.15 Preview Lifecycle Readiness / Commit Gate */
api.evaluatePreviewLifecycleReadinessV215=function(instance,options){return bridge.evaluatePreviewLifecycleReadinessV215(instance,options);};
api.commitPreviewLifecycleV215=function(instance,options){return bridge.commitPreviewLifecycleV215(instance,options);};
api.inspectPreviewLifecycleGateV215=function(instance){return bridge.inspectPreviewLifecycleGateV215(instance);};
api.clearPreviewLifecycleGateV215=function(instance){return bridge.clearPreviewLifecycleGateV215(instance);};

api.version = '1.01.27';
  api.create = api.create || function(name, implementation){
    implementation = implementation || {};
    var required = ['createRenderInteractionSystem','getRenderInteractionSystemProperty','setRenderInteractionSystemProperty','setRenderInteractionSystemEnabled','getRenderInteractionSystemEnabled','setRenderInteractionInputSystem','getRenderInteractionInputSystem','setRenderInteractionPickingRegistry','getRenderInteractionPickingRegistry','setRenderInteractionUIOverlaySystem','getRenderInteractionUIOverlaySystem','createRenderInteractionSystemRegistry','registerRenderInteractionSystem','getRenderInteractionSystem','hasRenderInteractionSystem','releaseRenderInteractionSystem','clearRenderInteractionSystems','createRenderView','getRenderViewProperty','setRenderViewProperty','setRenderViewEnabled','getRenderViewEnabled','setRenderViewActive','getRenderViewActive','setRenderViewMode','getRenderViewMode','setRenderViewPosition','getRenderViewPosition','setRenderViewTarget','getRenderViewTarget','setRenderViewProjection','getRenderViewProjection','createRenderViewRegistry','registerRenderView','getRenderView','hasRenderView','releaseRenderView','clearRenderViews','createRenderPickingContext','getRenderPickingContextProperty','setRenderPickingContextProperty','setRenderPickingContextEnabled','getRenderPickingContextEnabled','createRenderPickRequest','getRenderPickRequestProperty','setRenderPickRequestProperty','setRenderPickRequestEnabled','getRenderPickRequestEnabled','createRenderPickResult','getRenderPickResultProperty','setRenderPickResultProperty','createRenderInteractionTarget','getRenderInteractionTargetProperty','setRenderInteractionTargetProperty','setRenderInteractionTargetEnabled','getRenderInteractionTargetEnabled','addRenderInteractionAction','removeRenderInteractionAction','getRenderInteractionActions','createRenderPickingRegistry','registerRenderPickingContext','getRenderPickingContext','hasRenderPickingContext','releaseRenderPickingContext','registerRenderInteractionTarget','getRenderInteractionTarget','hasRenderInteractionTarget','releaseRenderInteractionTarget','clearRenderPickingRegistry','createRenderInputSystem','getRenderInputSystemProperty','setRenderInputSystemProperty','setRenderInputSystemEnabled','getRenderInputSystemEnabled','setRenderInputSystemActive','getRenderInputSystemActive','createRenderInputBinding','getRenderInputBindingProperty','setRenderInputBindingProperty','setRenderInputBindingEnabled','getRenderInputBindingEnabled','addRenderInputBinding','removeRenderInputBinding','getRenderInputBindings','createRenderInputSystemRegistry','registerRenderInputSystem','getRenderInputSystem','hasRenderInputSystem','releaseRenderInputSystem','clearRenderInputSystems','createRenderUIOverlaySystem','getRenderUIOverlaySystemProperty','setRenderUIOverlaySystemProperty','setRenderUIOverlaySystemEnabled','getRenderUIOverlaySystemEnabled','createRenderUIOverlay','getRenderUIOverlayProperty','setRenderUIOverlayProperty','setRenderUIOverlayEnabled','getRenderUIOverlayEnabled','setRenderUIOverlayVisible','getRenderUIOverlayVisible','addRenderUIOverlay','removeRenderUIOverlay','getRenderUIOverlays','createRenderUIOverlaySystemRegistry','registerRenderUIOverlaySystem','getRenderUIOverlaySystem','hasRenderUIOverlaySystem','releaseRenderUIOverlaySystem','clearRenderUIOverlaySystems','createRenderer','createScene','createCamera','createGroup','add','remove','render','renderFrame','getRecommendedPixelRatio','configureMainRenderer','resizeMainRenderer','getPosition','setPosition','getRotation','setRotation','getScale','setScale','getTransform','setTransform','createGeometry','createMaterial','setMaterialProperty','getMaterialProperty','setMeshVisual','getMeshVisual','createTexture','setTextureProperty','getTextureProperty','disposeGeometry','disposeMaterial','disposeTexture','createResourceRegistry','registerRenderResource','getRenderResource','hasRenderResource','releaseRenderResource','clearRenderResources','getObjectVisibility','setObjectVisibility','getObjectLayerMask','setObjectLayerMask','enableObjectLayer','disableObjectLayer','createLight','setLightProperty','getLightProperty','setLightColor','getLightColor','getSceneBackground','setSceneBackground','getSceneFog','setSceneFog','getSceneEnvironment','setSceneEnvironment','setSceneVisualProperty','getSceneVisualProperty','createRenderTarget','getRenderTargetProperty','setRenderTargetProperty','setRenderTargetSize','getRenderTargetSize','getViewport','setViewport','getScissor','setScissor','getScissorTest','setScissorTest','getRendererState','setRendererState','clearRenderTarget','setRenderTarget','getRenderTarget','createRenderPass','getRenderPassProperty','setRenderPassProperty','setRenderPassEnabled','getRenderPassEnabled','createRenderPipeline','addRenderPass','removeRenderPass','getRenderPasses','createRenderCommand','getRenderCommandProperty','setRenderCommandProperty','setRenderCommandEnabled','getRenderCommandEnabled','createRenderQueue','addRenderCommand','removeRenderCommand','getRenderCommands','createRenderBatch','getRenderBatchProperty','setRenderBatchProperty','setRenderBatchEnabled','getRenderBatchEnabled','addRenderInstance','removeRenderInstance','getRenderInstances','createRenderCullingContext','getRenderCullingProperty','setRenderCullingProperty','setRenderCullingEnabled','getRenderCullingEnabled','testRenderVisibility','getRenderVisibleObjects','getRenderCullingStats','createRenderBounds','getRenderBoundsProperty','setRenderBoundsProperty','setRenderBoundsEnabled','getRenderBoundsEnabled','setRenderBounds','getRenderBounds','testRenderBoundsIntersection','getRenderObjectsInBounds','getRenderBoundsStats','createRenderLOD','getRenderLODProperty','setRenderLODProperty','setRenderLODEnabled','getRenderLODEnabled','addRenderLODLevel','removeRenderLODLevel','getRenderLODLevels','selectRenderLODLevel','createRenderEffect','getRenderEffectProperty','setRenderEffectProperty','setRenderEffectEnabled','getRenderEffectEnabled','setRenderEffectParameter','getRenderEffectParameter','createRenderEffectChain','addRenderEffect','removeRenderEffect','getRenderEffects','createRenderAsset','getRenderAssetProperty','setRenderAssetProperty','setRenderAssetState','getRenderAssetState','setRenderAssetEnabled','getRenderAssetEnabled','addRenderAssetDependency','removeRenderAssetDependency','getRenderAssetDependencies','createRenderAssetRegistry','registerRenderAsset','getRenderAsset','hasRenderAsset','releaseRenderAsset','clearRenderAssets','createRenderAnimationClip','getRenderAnimationClipProperty','setRenderAnimationClipProperty','setRenderAnimationClipState','getRenderAnimationClipState','setRenderAnimationClipEnabled','getRenderAnimationClipEnabled','setRenderAnimationClipLoop','getRenderAnimationClipLoop','setRenderAnimationClipSpeed','getRenderAnimationClipSpeed','createRenderAnimationRegistry','registerRenderAnimationClip','getRenderAnimationClip','hasRenderAnimationClip','releaseRenderAnimationClip','clearRenderAnimationClips','createRenderModelInstance','getRenderModelInstanceProperty','setRenderModelInstanceProperty','setRenderModelInstanceState','getRenderModelInstanceState','setRenderModelInstanceEnabled','getRenderModelInstanceEnabled','setRenderModelInstanceVisible','getRenderModelInstanceVisible','createRenderModelInstanceRegistry','registerRenderModelInstance','getRenderModelInstance','hasRenderModelInstance','releaseRenderModelInstance','clearRenderModelInstances','createRenderAnimationStateMachine','getRenderAnimationStateMachineProperty','setRenderAnimationStateMachineProperty','setRenderAnimationStateMachineState','getRenderAnimationStateMachineState','setRenderAnimationStateMachineEnabled','getRenderAnimationStateMachineEnabled','setRenderAnimationStateMachineCurrentState','getRenderAnimationStateMachineCurrentState','addRenderAnimationState','removeRenderAnimationState','getRenderAnimationStates','addRenderAnimationTransition','removeRenderAnimationTransition','getRenderAnimationTransitions','setRenderAnimationParameter','getRenderAnimationParameter','createRenderAnimationStateMachineRegistry','registerRenderAnimationStateMachine','getRenderAnimationStateMachine','hasRenderAnimationStateMachine','releaseRenderAnimationStateMachine','clearRenderAnimationStateMachines','createRenderAnimationLayer','getRenderAnimationLayerProperty','setRenderAnimationLayerProperty','setRenderAnimationLayerState','getRenderAnimationLayerState','setRenderAnimationLayerEnabled','getRenderAnimationLayerEnabled','setRenderAnimationLayerWeight','getRenderAnimationLayerWeight','setRenderAnimationLayerBlendMode','getRenderAnimationLayerBlendMode','setRenderAnimationLayerMask','getRenderAnimationLayerMask','addRenderAnimationLayerClip','removeRenderAnimationLayerClip','getRenderAnimationLayerClips','setRenderAnimationLayerParameter','getRenderAnimationLayerParameter','createRenderAnimationLayerRegistry','registerRenderAnimationLayer','getRenderAnimationLayer','hasRenderAnimationLayer','releaseRenderAnimationLayer','clearRenderAnimationLayers','createRenderAnimationMarker','getRenderAnimationMarkerProperty','setRenderAnimationMarkerProperty','setRenderAnimationMarkerEnabled','getRenderAnimationMarkerEnabled','setRenderAnimationMarkerTime','getRenderAnimationMarkerTime','createRenderAnimationMarkerRegistry','registerRenderAnimationMarker','getRenderAnimationMarker','hasRenderAnimationMarker','releaseRenderAnimationMarker','clearRenderAnimationMarkers','createRenderAnimationEventBinding','getRenderAnimationEventBindingProperty','setRenderAnimationEventBindingProperty','setRenderAnimationEventBindingEnabled','getRenderAnimationEventBindingEnabled','setRenderAnimationEventBindingMarker','getRenderAnimationEventBindingMarker','createRenderAnimationEventBindingRegistry','registerRenderAnimationEventBinding','getRenderAnimationEventBinding','hasRenderAnimationEventBinding','releaseRenderAnimationEventBinding','clearRenderAnimationEventBindings','createRenderAnimationController','getRenderAnimationControllerProperty','setRenderAnimationControllerProperty','setRenderAnimationControllerState','getRenderAnimationControllerState','setRenderAnimationControllerEnabled','getRenderAnimationControllerEnabled','setRenderAnimationControllerPlaying','getRenderAnimationControllerPlaying','setRenderAnimationControllerClip','getRenderAnimationControllerClip','setRenderAnimationControllerTime','getRenderAnimationControllerTime','setRenderAnimationControllerSpeed','getRenderAnimationControllerSpeed','setRenderAnimationControllerLoop','getRenderAnimationControllerLoop','createRenderAnimationControllerRegistry','registerRenderAnimationController','getRenderAnimationController','hasRenderAnimationController','releaseRenderAnimationController','clearRenderAnimationControllers','createRenderAnimationTimeline','getRenderAnimationTimelineProperty','setRenderAnimationTimelineProperty','setRenderAnimationTimelineEnabled','getRenderAnimationTimelineEnabled','setRenderAnimationTimelineDuration','getRenderAnimationTimelineDuration','addRenderAnimationTrack','removeRenderAnimationTrack','getRenderAnimationTracks','createRenderAnimationKeyframe','getRenderAnimationKeyframeProperty','setRenderAnimationKeyframeProperty','setRenderAnimationKeyframeTime','getRenderAnimationKeyframeTime','setRenderAnimationKeyframeEnabled','getRenderAnimationKeyframeEnabled','createRenderAnimationTimelineRegistry','registerRenderAnimationTimeline','getRenderAnimationTimeline','hasRenderAnimationTimeline','releaseRenderAnimationTimeline','clearRenderAnimationTimelines','createRenderAnimationBlendTree','getRenderAnimationBlendTreeProperty','setRenderAnimationBlendTreeProperty','setRenderAnimationBlendTreeEnabled','getRenderAnimationBlendTreeEnabled','setRenderAnimationBlendTreeRootNode','getRenderAnimationBlendTreeRootNode','addRenderAnimationBlendNode','removeRenderAnimationBlendNode','getRenderAnimationBlendNodes','setRenderAnimationBlendParameter','getRenderAnimationBlendParameter','createRenderAnimationBlendTreeRegistry','registerRenderAnimationBlendTree','getRenderAnimationBlendTree','hasRenderAnimationBlendTree','releaseRenderAnimationBlendTree','clearRenderAnimationBlendTrees','createRenderAnimationSystem','getRenderAnimationSystemProperty','setRenderAnimationSystemProperty','setRenderAnimationSystemEnabled','getRenderAnimationSystemEnabled','setRenderAnimationSystemParameter','getRenderAnimationSystemParameter','registerRenderAnimationComponent','getRenderAnimationComponent','hasRenderAnimationComponent','releaseRenderAnimationComponent','clearRenderAnimationComponents','createRenderAnimationSystemRegistry','registerRenderAnimationSystem','getRenderAnimationSystem','hasRenderAnimationSystem','releaseRenderAnimationSystem','clearRenderAnimationSystems','createRenderSkeleton','getRenderSkeletonProperty','setRenderSkeletonProperty','setRenderSkeletonEnabled','getRenderSkeletonEnabled','addRenderBone','removeRenderBone','getRenderBones','setRenderSkeletonRootBone','getRenderSkeletonRootBone','createRenderSkeletonRegistry','registerRenderSkeleton','getRenderSkeleton','hasRenderSkeleton','releaseRenderSkeleton','clearRenderSkeletons','createRenderSkinning','getRenderSkinningProperty','setRenderSkinningProperty','setRenderSkinningEnabled','getRenderSkinningEnabled','setRenderSkinningSkeleton','getRenderSkinningSkeleton','createRenderSkinningRegistry','registerRenderSkinning','getRenderSkinning','hasRenderSkinning','releaseRenderSkinning','clearRenderSkinnings','createRenderMorph','getRenderMorphProperty','setRenderMorphProperty','setRenderMorphEnabled','getRenderMorphEnabled','setRenderMorphWeight','getRenderMorphWeight','createRenderMorphRegistry','registerRenderMorph','getRenderMorph','hasRenderMorph','releaseRenderMorph','clearRenderMorphs','createRenderModelSystem','getRenderModelSystemProperty','setRenderModelSystemProperty','setRenderModelSystemEnabled','getRenderModelSystemEnabled','setRenderModelSystemParameter','getRenderModelSystemParameter','registerRenderModelComponent','getRenderModelComponent','hasRenderModelComponent','releaseRenderModelComponent','clearRenderModelComponents','createRenderModelSystemRegistry','registerRenderModelSystem','getRenderModelSystem','hasRenderModelSystem','releaseRenderModelSystem','clearRenderModelSystems','createRenderWorldSystem','getRenderWorldSystemProperty','setRenderWorldSystemProperty','setRenderWorldSystemEnabled','getRenderWorldSystemEnabled','setRenderWorldSystemParameter','getRenderWorldSystemParameter','setRenderWorldSystemComponent','getRenderWorldSystemComponent','createRenderWorldRegistry','registerRenderWorld','getRenderWorld','hasRenderWorld','releaseRenderWorld','clearRenderWorlds','createRenderSceneDescriptor','getRenderSceneDescriptorProperty','setRenderSceneDescriptorProperty','createRenderMapDescriptor','getRenderMapDescriptorProperty','setRenderMapDescriptorProperty','createRenderWorldComponentRegistry','registerRenderWorldComponent','getRenderWorldComponent','hasRenderWorldComponent','releaseRenderWorldComponent','clearRenderWorldComponents','createRenderDiagnostics','getRenderDiagnosticsProperty','setRenderDiagnosticsProperty','setRenderDiagnosticsEnabled','getRenderDiagnosticsEnabled','setRenderDiagnosticCounter','getRenderDiagnosticCounter','resetRenderDiagnostics','getCastShadow','setCastShadow','getReceiveShadow','setReceiveShadow','setShadowProperty','getShadowProperty','createRenderLightingSystem','getRenderLightingSystemProperty','setRenderLightingSystemProperty','setRenderLightingSystemEnabled','getRenderLightingSystemEnabled','setRenderLightingSystemParameter','getRenderLightingSystemParameter','addRenderLighting','removeRenderLighting','getRenderLightings','setRenderLightingEnvironment','getRenderLightingEnvironment','createRenderLightingSystemRegistry','registerRenderLightingSystem','getRenderLightingSystem','hasRenderLightingSystem','releaseRenderLightingSystem','clearRenderLightingSystems','createRenderAudioSystem','getRenderAudioSystemProperty','setRenderAudioSystemProperty','setRenderAudioSystemEnabled','getRenderAudioSystemEnabled','setRenderAudioSystemVolume','getRenderAudioSystemVolume','setRenderAudioSystemMuted','getRenderAudioSystemMuted','createRenderSound','getRenderSoundProperty','setRenderSoundProperty','setRenderSoundState','getRenderSoundState','setRenderSoundEnabled','getRenderSoundEnabled','setRenderSoundVolume','getRenderSoundVolume','setRenderSoundLoop','getRenderSoundLoop','createRenderAudioRegistry','registerRenderAudioSystem','getRenderAudioSystem','hasRenderAudioSystem','releaseRenderAudioSystem','registerRenderSound','getRenderSound','hasRenderSound','releaseRenderSound','clearRenderAudio','createRenderPhysicsSystem','getRenderPhysicsSystemProperty','setRenderPhysicsSystemProperty','setRenderPhysicsSystemEnabled','getRenderPhysicsSystemEnabled','createRenderPhysicsBody','getRenderPhysicsBodyProperty','setRenderPhysicsBodyProperty','setRenderPhysicsBodyEnabled','getRenderPhysicsBodyEnabled','addRenderPhysicsBody','removeRenderPhysicsBody','getRenderPhysicsBodies','createRenderCollider','getRenderColliderProperty','setRenderColliderProperty','setRenderColliderEnabled','getRenderColliderEnabled','addRenderCollider','removeRenderCollider','getRenderColliders','createRenderSpatialQuery','getRenderSpatialQueryProperty','setRenderSpatialQueryProperty','setRenderSpatialQueryEnabled','getRenderSpatialQueryEnabled','createRenderPhysicsSystemRegistry','registerRenderPhysicsSystem','getRenderPhysicsSystem','hasRenderPhysicsSystem','releaseRenderPhysicsSystem','clearRenderPhysicsSystems','createRenderPhysicsCollisionSpatialSystem','getRenderPhysicsCollisionSpatialSystemProperty','setRenderPhysicsCollisionSpatialSystemProperty','setRenderPhysicsCollisionSpatialSystemEnabled','getRenderPhysicsCollisionSpatialSystemEnabled','setRenderPhysicsCollisionSpatialPhysicsSystem','getRenderPhysicsCollisionSpatialPhysicsSystem','setRenderPhysicsCollisionSpatialCollisionSystem','getRenderPhysicsCollisionSpatialCollisionSystem','setRenderPhysicsCollisionSpatialQuerySystem','getRenderPhysicsCollisionSpatialQuerySystem','createRenderPhysicsCollisionSpatialSystemRegistry','registerRenderPhysicsCollisionSpatialSystem','getRenderPhysicsCollisionSpatialSystem','hasRenderPhysicsCollisionSpatialSystem','releaseRenderPhysicsCollisionSpatialSystem','clearRenderPhysicsCollisionSpatialSystems','createRenderRuntimeSystem','getRenderRuntimeSystemProperty','setRenderRuntimeSystemProperty','setRenderRuntimeSystemEnabled','getRenderRuntimeSystemEnabled','setRenderRuntimeSystemState','getRenderRuntimeSystemState','setRenderRuntimeSystemParameter','getRenderRuntimeSystemParameter','createRenderRuntimeRegistry','registerRenderRuntimeSystem','getRenderRuntimeSystem','hasRenderRuntimeSystem','releaseRenderRuntimeSystem','clearRenderRuntimeSystems','createRenderNetworkSystem','getRenderNetworkSystemProperty','setRenderNetworkSystemProperty','setRenderNetworkSystemEnabled','getRenderNetworkSystemEnabled','setRenderNetworkSystemState','getRenderNetworkSystemState','createRenderNetworkRegistry','registerRenderNetworkSystem','getRenderNetworkSystem','hasRenderNetworkSystem','releaseRenderNetworkSystem','clearRenderNetworkSystems','createRenderAssetLifecycle','getRenderAssetLifecycleProperty','setRenderAssetLifecycleProperty','setRenderAssetLifecycleState','getRenderAssetLifecycleState','setRenderAssetLifecyclePhase','getRenderAssetLifecyclePhase','setRenderAssetLifecycleProgress','getRenderAssetLifecycleProgress','createRenderAssetLifecycleRegistry','registerRenderAssetLifecycle','getRenderAssetLifecycle','hasRenderAssetLifecycle','releaseRenderAssetLifecycle','clearRenderAssetLifecycles','createRenderMaterialVisual','getRenderMaterialVisualProperty','setRenderMaterialVisualProperty','setRenderMaterialVisualEnabled','getRenderMaterialVisualEnabled','setRenderMaterialVisualVisible','getRenderMaterialVisualVisible','setRenderMaterialVisualRarity','getRenderMaterialVisualRarity','setRenderMaterialVisualGlow','getRenderMaterialVisualGlow','addRenderMaterialTexture','removeRenderMaterialTexture','getRenderMaterialTextures','createRenderTextureVisual','getRenderTextureVisualProperty','setRenderTextureVisualProperty','setRenderTextureVisualEnabled','getRenderTextureVisualEnabled','setRenderTextureVisualState','getRenderTextureVisualState','createRenderRarityVisual','getRenderRarityVisualProperty','setRenderRarityVisualProperty','setRenderRarityVisualRarity','getRenderRarityVisualRarity','setRenderRarityVisualGlow','getRenderRarityVisualGlow','createRenderHolyDemonVisual','getRenderHolyDemonVisualProperty','setRenderHolyDemonVisualProperty','setRenderHolyDemonVisualAlignment','getRenderHolyDemonVisualAlignment','setRenderHolyDemonVisualEnabled','getRenderHolyDemonVisualEnabled','setRenderHolyDemonVisualGlow','getRenderHolyDemonVisualGlow','createRenderTerrainVisual','getRenderTerrainVisualProperty','setRenderTerrainVisualProperty','setRenderTerrainVisualEnabled','getRenderTerrainVisualEnabled','setRenderTerrainVisualVisible','getRenderTerrainVisualVisible','createRenderStaticWorldVisual','getRenderStaticWorldVisualProperty','setRenderStaticWorldVisualProperty','setRenderStaticWorldVisualEnabled','getRenderStaticWorldVisualEnabled','setRenderStaticWorldVisualVisible','getRenderStaticWorldVisualVisible','createRenderEnvironmentVisual','getRenderEnvironmentVisualProperty','setRenderEnvironmentVisualProperty','setRenderEnvironmentVisualEnabled','getRenderEnvironmentVisualEnabled','setRenderEnvironmentVisualBackground','getRenderEnvironmentVisualBackground','setRenderEnvironmentVisualFog','getRenderEnvironmentVisualFog','createRenderWorldLightingVisual','getRenderWorldLightingVisualProperty','setRenderWorldLightingVisualProperty','setRenderWorldLightingVisualEnabled','getRenderWorldLightingVisualEnabled','addRenderWorldLighting','removeRenderWorldLighting','getRenderWorldLightings','setRenderWorldLightingEnvironment','getRenderWorldLightingEnvironment','createCharacterAssetBinding',
    'getCharacterAssetBindingProperty',
    'setCharacterAssetBindingProperty',
    'setCharacterAssetBindingState',
    'getCharacterAssetBindingState',
    'addCharacterAssetReference',
    'removeCharacterAssetReference',
    'createCharacterAssetBindingRegistry',
    'registerCharacterAssetBinding',
    'getCharacterAssetBinding',
    'hasCharacterAssetBinding',
    'releaseCharacterAssetBinding',
    'clearCharacterAssetBindings',
    'resolveCharacterAssetBinding','validateCharacterAssetBinding','createCharacterAssetBindingTest','runCharacterAssetBindingTest',
    'createIsolatedCharacterPreviewInstance','setIsolatedCharacterPreviewAppearance','setIsolatedCharacterPreviewMapping','getIsolatedCharacterPreviewPart','attachIsolatedCharacterPreview','detachIsolatedCharacterPreview','destroyIsolatedCharacterPreviewInstance','inspectIsolatedCharacterPreviewInstance','attachIsolatedCharacterPreviewAsset','detachIsolatedCharacterPreviewAsset','applyIsolatedCharacterPreviewAppearance','applyIsolatedCharacterPreviewAssetBinding','getIsolatedCharacterPreviewApplyResult','createIsolatedCharacterPreviewAssetLoadRequest','loadIsolatedCharacterPreviewAsset','attachLoadedIsolatedCharacterPreviewAsset','unloadIsolatedCharacterPreviewAsset','getIsolatedCharacterPreviewAssetLoadState','replaceLoadedIsolatedCharacterPreviewAsset','releaseIsolatedCharacterPreviewAssetRequest','createIsolatedCharacterPreviewAssetRequestRegistry','registerIsolatedCharacterPreviewAssetRequest','getIsolatedCharacterPreviewAssetRequest','hasIsolatedCharacterPreviewAssetRequest','releaseIsolatedCharacterPreviewAssetRequestFromRegistry','clearIsolatedCharacterPreviewAssetRequestRegistry','createIsolatedCharacterPreviewAppearanceComposition','setIsolatedCharacterPreviewAppearanceCompositionAsset','bindIsolatedCharacterPreviewAppearanceComposition','applyIsolatedCharacterPreviewAppearanceComposition','inspectIsolatedCharacterPreviewAppearanceComposition','clearIsolatedCharacterPreviewAppearanceComposition','createIsolatedCharacterModelV2Sync','syncIsolatedCharacterPreviewToCharacterModelV2','validateIsolatedCharacterModelV2Sync','applyIsolatedCharacterModelV2Sync','rejectIsolatedCharacterModelV2Sync','inspectIsolatedCharacterModelV2Sync','beginIsolatedCharacterModelV2ApplyTransaction','commitIsolatedCharacterModelV2ApplyTransaction','rollbackIsolatedCharacterModelV2ApplyTransaction','getIsolatedCharacterModelV2ApplyTransaction','clearIsolatedCharacterModelV2Sync','createIsolatedCharacterModelV2ShadowInstance','buildIsolatedCharacterModelV2ShadowInstance','validateIsolatedCharacterModelV2ShadowInstance','getIsolatedCharacterModelV2ShadowPart','inspectIsolatedCharacterModelV2ShadowInstance','clearIsolatedCharacterModelV2ShadowInstance',
    'dispose'];
    var adapter = {name:name || 'unknown', version:api.version};
    required.forEach(function(method){
      adapter[method] = typeof implementation[method] === 'function'
        ? implementation[method] : function(){ throw new Error('Render adapter method not implemented: ' + method); };
    });
    return adapter;
  };

  if (global.AsgardEngineBridge) {
    var bridge = global.AsgardEngineBridge;
    var three = api.create('three', {
      createRenderView:function(options){ return bridge.createRenderView(options); },
      getRenderViewProperty:function(view,key){ return bridge.getRenderViewProperty(view,key); },
      setRenderViewProperty:function(view,key,value){ return bridge.setRenderViewProperty(view,key,value); },
      setRenderViewEnabled:function(view,enabled){ return bridge.setRenderViewEnabled(view,enabled); },
      getRenderViewEnabled:function(view){ return bridge.getRenderViewEnabled(view); },
      setRenderViewActive:function(view,active){ return bridge.setRenderViewActive(view,active); },
      getRenderViewActive:function(view){ return bridge.getRenderViewActive(view); },
      setRenderViewMode:function(view,mode){ return bridge.setRenderViewMode(view,mode); },
      getRenderViewMode:function(view){ return bridge.getRenderViewMode(view); },
      setRenderViewPosition:function(view,position){ return bridge.setRenderViewPosition(view,position); },
      getRenderViewPosition:function(view){ return bridge.getRenderViewPosition(view); },
      setRenderViewTarget:function(view,target){ return bridge.setRenderViewTarget(view,target); },
      getRenderViewTarget:function(view){ return bridge.getRenderViewTarget(view); },
      setRenderViewProjection:function(view,projection){ return bridge.setRenderViewProjection(view,projection); },
      getRenderViewProjection:function(view){ return bridge.getRenderViewProjection(view); },
      createRenderViewRegistry:function(options){ return bridge.createRenderViewRegistry(options); },
      registerRenderView:function(registry,view,id){ return bridge.registerRenderView(registry,view,id); },
      getRenderView:function(registry,id){ return bridge.getRenderView(registry,id); },
      hasRenderView:function(registry,id){ return bridge.hasRenderView(registry,id); },
      releaseRenderView:function(registry,id){ return bridge.releaseRenderView(registry,id); },
      clearRenderViews:function(registry){ return bridge.clearRenderViews(registry); },

      createRenderPickingContext:function(options){ return bridge.createRenderPickingContext(options); },
      getRenderPickingContextProperty:function(context,key){ return bridge.getRenderPickingContextProperty(context,key); },
      setRenderPickingContextProperty:function(context,key,value){ return bridge.setRenderPickingContextProperty(context,key,value); },
      setRenderPickingContextEnabled:function(context,enabled){ return bridge.setRenderPickingContextEnabled(context,enabled); },
      getRenderPickingContextEnabled:function(context){ return bridge.getRenderPickingContextEnabled(context); },
      createRenderPickRequest:function(options){ return bridge.createRenderPickRequest(options); },
      getRenderPickRequestProperty:function(request,key){ return bridge.getRenderPickRequestProperty(request,key); },
      setRenderPickRequestProperty:function(request,key,value){ return bridge.setRenderPickRequestProperty(request,key,value); },
      setRenderPickRequestEnabled:function(request,enabled){ return bridge.setRenderPickRequestEnabled(request,enabled); },
      getRenderPickRequestEnabled:function(request){ return bridge.getRenderPickRequestEnabled(request); },
      createRenderPickResult:function(options){ return bridge.createRenderPickResult(options); },
      getRenderPickResultProperty:function(result,key){ return bridge.getRenderPickResultProperty(result,key); },
      setRenderPickResultProperty:function(result,key,value){ return bridge.setRenderPickResultProperty(result,key,value); },
      createRenderInteractionTarget:function(options){ return bridge.createRenderInteractionTarget(options); },
      getRenderInteractionTargetProperty:function(target,key){ return bridge.getRenderInteractionTargetProperty(target,key); },
      setRenderInteractionTargetProperty:function(target,key,value){ return bridge.setRenderInteractionTargetProperty(target,key,value); },
      setRenderInteractionTargetEnabled:function(target,enabled){ return bridge.setRenderInteractionTargetEnabled(target,enabled); },
      getRenderInteractionTargetEnabled:function(target){ return bridge.getRenderInteractionTargetEnabled(target); },
      addRenderInteractionAction:function(target,action){ return bridge.addRenderInteractionAction(target,action); },
      removeRenderInteractionAction:function(target,actionOrIndex){ return bridge.removeRenderInteractionAction(target,actionOrIndex); },
      getRenderInteractionActions:function(target){ return bridge.getRenderInteractionActions(target); },
      createRenderPickingRegistry:function(options){ return bridge.createRenderPickingRegistry(options); },
      registerRenderPickingContext:function(registry,context,id){ return bridge.registerRenderPickingContext(registry,context,id); },
      getRenderPickingContext:function(registry,id){ return bridge.getRenderPickingContext(registry,id); },
      hasRenderPickingContext:function(registry,id){ return bridge.hasRenderPickingContext(registry,id); },
      releaseRenderPickingContext:function(registry,id){ return bridge.releaseRenderPickingContext(registry,id); },
      registerRenderInteractionTarget:function(registry,target,id){ return bridge.registerRenderInteractionTarget(registry,target,id); },
      getRenderInteractionTarget:function(registry,id){ return bridge.getRenderInteractionTarget(registry,id); },
      hasRenderInteractionTarget:function(registry,id){ return bridge.hasRenderInteractionTarget(registry,id); },
      releaseRenderInteractionTarget:function(registry,id){ return bridge.releaseRenderInteractionTarget(registry,id); },
      clearRenderPickingRegistry:function(registry){ return bridge.clearRenderPickingRegistry(registry); },
      // V1.01.25: main renderer bootstrap facade.
      createClock:function(){
        if (global.AsgardThreeLegacy && global.AsgardThreeLegacy.createClock) return global.AsgardThreeLegacy.createClock();
        throw new Error('Three.js clock adapter is not available');
      },
      mountMainRenderer:function(renderer,host){
        if (global.AsgardThreeLegacy && global.AsgardThreeLegacy.mountMainRenderer) return global.AsgardThreeLegacy.mountMainRenderer(renderer,host);
        if (!renderer || !renderer.domElement || !host) throw new Error('Main renderer mount target is not available');
        host.appendChild(renderer.domElement);
        return renderer.domElement;
      },
      createRenderer:function(options){ return bridge.createRenderer(options); },
      createScene:function(){ return bridge.createScene(); },
      createCamera:function(options){ return bridge.createCamera(options); },
      createGroup:function(name){ return bridge.createRenderGroup(name); },
      add:function(parent, object){ return bridge.addWorldObject(parent, object); },
      remove:function(parent, object){ return bridge.removeWorldObject(parent, object); },
      getPosition:function(object){ return bridge.getObjectPosition(object); },
      setPosition:function(object, x, y, z){ return bridge.setObjectPosition(object, x, y, z); },
      getRotation:function(object){ return bridge.getObjectRotation(object); },
      setRotation:function(object, x, y, z){ return bridge.setObjectRotation(object, x, y, z); },
      getScale:function(object){ return bridge.getObjectScale(object); },
      setScale:function(object, x, y, z){ return bridge.setObjectScale(object, x, y, z); },
      getTransform:function(object){ return bridge.getObjectTransform(object); },
      setTransform:function(object, transform){ return bridge.setObjectTransform(object, transform); },
      createGeometry:function(type, options){ return bridge.createGeometry(type, options); },
      createMaterial:function(type, options){ return bridge.createMaterial(type, options); },
      setMaterialProperty:function(material, key, value){ return bridge.setMaterialProperty(material, key, value); },
      getMaterialProperty:function(material, key){ return bridge.getMaterialProperty(material, key); },
      setMeshVisual:function(object, visual){ return bridge.setMeshVisual(object, visual); },
      getMeshVisual:function(object){ return bridge.getMeshVisual(object); },
      createTexture:function(source, options){ return bridge.createTexture(source, options); },
      setTextureProperty:function(texture, key, value){ return bridge.setTextureProperty(texture, key, value); },
      getTextureProperty:function(texture, key){ return bridge.getTextureProperty(texture, key); },
      createRenderRuntimeSystem:function(options){ return bridge.createRenderRuntimeSystem(options); },      getRenderRuntimeSystemProperty:function(system,key){ return bridge.getRenderRuntimeSystemProperty(system,key); },      setRenderRuntimeSystemProperty:function(system,key,value){ return bridge.setRenderRuntimeSystemProperty(system,key,value); },      setRenderRuntimeSystemEnabled:function(system,value){ return bridge.setRenderRuntimeSystemEnabled(system,value); },      getRenderRuntimeSystemEnabled:function(system){ return bridge.getRenderRuntimeSystemEnabled(system); },      setRenderRuntimeSystemState:function(system,value){ return bridge.setRenderRuntimeSystemState(system,value); },      getRenderRuntimeSystemState:function(system){ return bridge.getRenderRuntimeSystemState(system); },      setRenderRuntimeSystemParameter:function(system,key,value){ return bridge.setRenderRuntimeSystemParameter(system,key,value); },      getRenderRuntimeSystemParameter:function(system,key){ return bridge.getRenderRuntimeSystemParameter(system,key); },      createRenderRuntimeRegistry:function(options){ return bridge.createRenderRuntimeRegistry(options); },      registerRenderRuntimeSystem:function(registry,item,id){ return bridge.registerRenderRuntimeSystem(registry,item,id); },      getRenderRuntimeSystem:function(registry,id){ return bridge.getRenderRuntimeSystem(registry,id); },      hasRenderRuntimeSystem:function(registry,id){ return bridge.hasRenderRuntimeSystem(registry,id); },      releaseRenderRuntimeSystem:function(registry,id){ return bridge.releaseRenderRuntimeSystem(registry,id); },      clearRenderRuntimeSystems:function(registry){ return bridge.clearRenderRuntimeSystems(registry); },      createRenderNetworkSystem:function(options){ return bridge.createRenderNetworkSystem(options); },      getRenderNetworkSystemProperty:function(system,key){ return bridge.getRenderNetworkSystemProperty(system,key); },      setRenderNetworkSystemProperty:function(system,key,value){ return bridge.setRenderNetworkSystemProperty(system,key,value); },      setRenderNetworkSystemEnabled:function(system,value){ return bridge.setRenderNetworkSystemEnabled(system,value); },      getRenderNetworkSystemEnabled:function(system){ return bridge.getRenderNetworkSystemEnabled(system); },      setRenderNetworkSystemState:function(system,value){ return bridge.setRenderNetworkSystemState(system,value); },      getRenderNetworkSystemState:function(system){ return bridge.getRenderNetworkSystemState(system); },      createRenderNetworkRegistry:function(options){ return bridge.createRenderNetworkRegistry(options); },      registerRenderNetworkSystem:function(registry,item,id){ return bridge.registerRenderNetworkSystem(registry,item,id); },      getRenderNetworkSystem:function(registry,id){ return bridge.getRenderNetworkSystem(registry,id); },      hasRenderNetworkSystem:function(registry,id){ return bridge.hasRenderNetworkSystem(registry,id); },      releaseRenderNetworkSystem:function(registry,id){ return bridge.releaseRenderNetworkSystem(registry,id); },      clearRenderNetworkSystems:function(registry){ return bridge.clearRenderNetworkSystems(registry); },      createRenderAssetLifecycle:function(options){ return bridge.createRenderAssetLifecycle(options); },      getRenderAssetLifecycleProperty:function(system,key){ return bridge.getRenderAssetLifecycleProperty(system,key); },      setRenderAssetLifecycleProperty:function(system,key,value){ return bridge.setRenderAssetLifecycleProperty(system,key,value); },      setRenderAssetLifecycleState:function(system,value){ return bridge.setRenderAssetLifecycleState(system,value); },      getRenderAssetLifecycleState:function(system){ return bridge.getRenderAssetLifecycleState(system); },      setRenderAssetLifecyclePhase:function(system,value){ return bridge.setRenderAssetLifecyclePhase(system,value); },      getRenderAssetLifecyclePhase:function(system){ return bridge.getRenderAssetLifecyclePhase(system); },      setRenderAssetLifecycleProgress:function(system,value){ return bridge.setRenderAssetLifecycleProgress(system,value); },      getRenderAssetLifecycleProgress:function(system){ return bridge.getRenderAssetLifecycleProgress(system); },      createRenderAssetLifecycleRegistry:function(options){ return bridge.createRenderAssetLifecycleRegistry(options); },      registerRenderAssetLifecycle:function(registry,item,id){ return bridge.registerRenderAssetLifecycle(registry,item,id); },      getRenderAssetLifecycle:function(registry,id){ return bridge.getRenderAssetLifecycle(registry,id); },      hasRenderAssetLifecycle:function(registry,id){ return bridge.hasRenderAssetLifecycle(registry,id); },      releaseRenderAssetLifecycle:function(registry,id){ return bridge.releaseRenderAssetLifecycle(registry,id); },      clearRenderAssetLifecycles:function(registry){ return bridge.clearRenderAssetLifecycles(registry); },      disposeGeometry:function(geometry){ return bridge.disposeGeometry(geometry); },
      disposeMaterial:function(material){ return bridge.disposeMaterial(material); },
      disposeTexture:function(texture){ return bridge.disposeTexture(texture); },
      createResourceRegistry:function(name){ return bridge.createResourceRegistry(name); },
      registerRenderResource:function(registry, id, resource){ return bridge.registerRenderResource(registry, id, resource); },
      getRenderResource:function(registry, id){ return bridge.getRenderResource(registry, id); },
      hasRenderResource:function(registry, id){ return bridge.hasRenderResource(registry, id); },
      releaseRenderResource:function(registry, id){ return bridge.releaseRenderResource(registry, id); },
      clearRenderResources:function(registry){ return bridge.clearRenderResources(registry); },
      getObjectVisibility:function(object){ return bridge.getObjectVisibility(object); },
      setObjectVisibility:function(object, visible){ return bridge.setObjectVisibility(object, visible); },
      getObjectLayerMask:function(object){ return bridge.getObjectLayerMask(object); },
      setObjectLayerMask:function(object, mask){ return bridge.setObjectLayerMask(object, mask); },
      enableObjectLayer:function(object, layer){ return bridge.enableObjectLayer(object, layer); },
      disableObjectLayer:function(object, layer){ return bridge.disableObjectLayer(object, layer); },
      createLight:function(type, options){ return bridge.createLight(type, options); },
      setLightProperty:function(light, key, value){ return bridge.setLightProperty(light, key, value); },
      getLightProperty:function(light, key){ return bridge.getLightProperty(light, key); },
      setLightColor:function(light, color){ return bridge.setLightColor(light, color); },
      getLightColor:function(light){ return bridge.getLightColor(light); },
      getSceneBackground:function(scene){ return bridge.getSceneBackground(scene); },
      setSceneBackground:function(scene, background){ return bridge.setSceneBackground(scene, background); },
      getSceneFog:function(scene){ return bridge.getSceneFog(scene); },
      setSceneFog:function(scene, fog){ return bridge.setSceneFog(scene, fog); },
      getSceneEnvironment:function(scene){ return bridge.getSceneEnvironment(scene); },
      setSceneEnvironment:function(scene, environment){ return bridge.setSceneEnvironment(scene, environment); },
      setSceneVisualProperty:function(scene, key, value){ return bridge.setSceneVisualProperty(scene, key, value); },
      getSceneVisualProperty:function(scene, key){ return bridge.getSceneVisualProperty(scene, key); },
      createRenderTarget:function(options){ return bridge.createRenderTarget(options); },
      getRenderTargetProperty:function(target, key){ return bridge.getRenderTargetProperty(target, key); },
      setRenderTargetProperty:function(target, key, value){ return bridge.setRenderTargetProperty(target, key, value); },
      setRenderTargetSize:function(target, width, height){ return bridge.setRenderTargetSize(target, width, height); },
      getRenderTargetSize:function(target){ return bridge.getRenderTargetSize(target); },
      getViewport:function(renderer){ return bridge.getViewport(renderer); },
      setViewport:function(renderer, x, y, width, height){ return bridge.setViewport(renderer, x, y, width, height); },
      getScissor:function(renderer){ return bridge.getScissor(renderer); },
      setScissor:function(renderer, x, y, width, height){ return bridge.setScissor(renderer, x, y, width, height); },
      getScissorTest:function(renderer){ return bridge.getScissorTest(renderer); },
      setScissorTest:function(renderer, enabled){ return bridge.setScissorTest(renderer, enabled); },
      getRendererState:function(renderer, key){ return bridge.getRendererState(renderer, key); },
      setRendererState:function(renderer, key, value){ return bridge.setRendererState(renderer, key, value); },
      clearRenderTarget:function(renderer, target, color, depth, stencil){ return bridge.clearRenderTarget(renderer, target, color, depth, stencil); },
      setRenderTarget:function(renderer, target){ return bridge.setRenderTarget(renderer, target); },
      getRenderTarget:function(renderer){ return bridge.getRenderTarget(renderer); },
      createRenderPass:function(options){ return bridge.createRenderPass(options); },
      getRenderPassProperty:function(pass, key){ return bridge.getRenderPassProperty(pass, key); },
      setRenderPassProperty:function(pass, key, value){ return bridge.setRenderPassProperty(pass, key, value); },
      setRenderPassEnabled:function(pass, enabled){ return bridge.setRenderPassEnabled(pass, enabled); },
      getRenderPassEnabled:function(pass){ return bridge.getRenderPassEnabled(pass); },
      createRenderPipeline:function(options){ return bridge.createRenderPipeline(options); },
      addRenderPass:function(pipeline, pass){ return bridge.addRenderPass(pipeline, pass); },
      removeRenderPass:function(pipeline, pass){ return bridge.removeRenderPass(pipeline, pass); },
      getRenderPasses:function(pipeline){ return bridge.getRenderPasses(pipeline); },
      createRenderCommand:function(options){ return bridge.createRenderCommand(options); },
      getRenderCommandProperty:function(command, key){ return bridge.getRenderCommandProperty(command, key); },
      setRenderCommandProperty:function(command, key, value){ return bridge.setRenderCommandProperty(command, key, value); },
      setRenderCommandEnabled:function(command, enabled){ return bridge.setRenderCommandEnabled(command, enabled); },
      getRenderCommandEnabled:function(command){ return bridge.getRenderCommandEnabled(command); },
      createRenderQueue:function(options){ return bridge.createRenderQueue(options); },
      addRenderCommand:function(queue, command){ return bridge.addRenderCommand(queue, command); },
      removeRenderCommand:function(queue, command){ return bridge.removeRenderCommand(queue, command); },
      getRenderCommands:function(queue){ return bridge.getRenderCommands(queue); },
      createRenderBatch:function(options){ return bridge.createRenderBatch(options); },
      getRenderBatchProperty:function(batch, key){ return bridge.getRenderBatchProperty(batch, key); },
      setRenderBatchProperty:function(batch, key, value){ return bridge.setRenderBatchProperty(batch, key, value); },
      setRenderBatchEnabled:function(batch, enabled){ return bridge.setRenderBatchEnabled(batch, enabled); },
      getRenderBatchEnabled:function(batch){ return bridge.getRenderBatchEnabled(batch); },
      addRenderInstance:function(batch, instance){ return bridge.addRenderInstance(batch, instance); },
      removeRenderInstance:function(batch, instance){ return bridge.removeRenderInstance(batch, instance); },
      getRenderInstances:function(batch){ return bridge.getRenderInstances(batch); },
      createRenderCullingContext:function(options){ return bridge.createRenderCullingContext(options); },
      getRenderCullingProperty:function(context, key){ return bridge.getRenderCullingProperty(context, key); },
      setRenderCullingProperty:function(context, key, value){ return bridge.setRenderCullingProperty(context, key, value); },
      setRenderCullingEnabled:function(context, enabled){ return bridge.setRenderCullingEnabled(context, enabled); },
      getRenderCullingEnabled:function(context){ return bridge.getRenderCullingEnabled(context); },
      testRenderVisibility:function(context, object){ return bridge.testRenderVisibility(context, object); },
      getRenderVisibleObjects:function(context, objects){ return bridge.getRenderVisibleObjects(context, objects); },
      getRenderCullingStats:function(context, objects){ return bridge.getRenderCullingStats(context, objects); },
      createRenderBounds:function(options){ return bridge.createRenderBounds(options); },
      getRenderBoundsProperty:function(bounds, key){ return bridge.getRenderBoundsProperty(bounds, key); },
      setRenderBoundsProperty:function(bounds, key, value){ return bridge.setRenderBoundsProperty(bounds, key, value); },
      setRenderBoundsEnabled:function(bounds, enabled){ return bridge.setRenderBoundsEnabled(bounds, enabled); },
      getRenderBoundsEnabled:function(bounds){ return bridge.getRenderBoundsEnabled(bounds); },
      setRenderBounds:function(bounds, min, max){ return bridge.setRenderBounds(bounds, min, max); },
      getRenderBounds:function(bounds){ return bridge.getRenderBounds(bounds); },
      testRenderBoundsIntersection:function(a, b){ return bridge.testRenderBoundsIntersection(a, b); },
      getRenderObjectsInBounds:function(queryBounds, objects, getBounds){ return bridge.getRenderObjectsInBounds(queryBounds, objects, getBounds); },
      getRenderBoundsStats:function(queryBounds, objects, getBounds){ return bridge.getRenderBoundsStats(queryBounds, objects, getBounds); },
      createRenderLOD:function(options){ return bridge.createRenderLOD(options); },
      getRenderLODProperty:function(lod, key){ return bridge.getRenderLODProperty(lod, key); },
      setRenderLODProperty:function(lod, key, value){ return bridge.setRenderLODProperty(lod, key, value); },
      setRenderLODEnabled:function(lod, enabled){ return bridge.setRenderLODEnabled(lod, enabled); },
      getRenderLODEnabled:function(lod){ return bridge.getRenderLODEnabled(lod); },
      addRenderLODLevel:function(lod, level){ return bridge.addRenderLODLevel(lod, level); },
      removeRenderLODLevel:function(lod, levelOrIndex){ return bridge.removeRenderLODLevel(lod, levelOrIndex); },
      getRenderLODLevels:function(lod){ return bridge.getRenderLODLevels(lod); },
      selectRenderLODLevel:function(lod, distance){ return bridge.selectRenderLODLevel(lod, distance); },
      createRenderEffect:function(options){ return bridge.createRenderEffect(options); },
      getRenderEffectProperty:function(effect, key){ return bridge.getRenderEffectProperty(effect, key); },
      setRenderEffectProperty:function(effect, key, value){ return bridge.setRenderEffectProperty(effect, key, value); },
      setRenderEffectEnabled:function(effect, enabled){ return bridge.setRenderEffectEnabled(effect, enabled); },
      getRenderEffectEnabled:function(effect){ return bridge.getRenderEffectEnabled(effect); },
      setRenderEffectParameter:function(effect, key, value){ return bridge.setRenderEffectParameter(effect, key, value); },
      getRenderEffectParameter:function(effect, key){ return bridge.getRenderEffectParameter(effect, key); },
      createRenderEffectChain:function(options){ return bridge.createRenderEffectChain(options); },
      addRenderEffect:function(chain, effect){ return bridge.addRenderEffect(chain, effect); },
      removeRenderEffect:function(chain, effectOrIndex){ return bridge.removeRenderEffect(chain, effectOrIndex); },
      getRenderEffects:function(chain){ return bridge.getRenderEffects(chain); },
      createRenderAsset:function(options){ return bridge.createRenderAsset(options); },
      getRenderAssetProperty:function(asset, key){ return bridge.getRenderAssetProperty(asset, key); },
      setRenderAssetProperty:function(asset, key, value){ return bridge.setRenderAssetProperty(asset, key, value); },
      setRenderAssetState:function(asset, state){ return bridge.setRenderAssetState(asset, state); },
      getRenderAssetState:function(asset){ return bridge.getRenderAssetState(asset); },
      setRenderAssetEnabled:function(asset, enabled){ return bridge.setRenderAssetEnabled(asset, enabled); },
      getRenderAssetEnabled:function(asset){ return bridge.getRenderAssetEnabled(asset); },
      addRenderAssetDependency:function(asset, dependency){ return bridge.addRenderAssetDependency(asset, dependency); },
      removeRenderAssetDependency:function(asset, dependency){ return bridge.removeRenderAssetDependency(asset, dependency); },
      getRenderAssetDependencies:function(asset){ return bridge.getRenderAssetDependencies(asset); },
      createRenderAssetRegistry:function(options){ return bridge.createRenderAssetRegistry(options); },
      registerRenderAsset:function(registry, asset, id){ return bridge.registerRenderAsset(registry, asset, id); },
      getRenderAsset:function(registry, id){ return bridge.getRenderAsset(registry, id); },
      hasRenderAsset:function(registry, id){ return bridge.hasRenderAsset(registry, id); },
      releaseRenderAsset:function(registry, id){ return bridge.releaseRenderAsset(registry, id); },
      clearRenderAssets:function(registry){ return bridge.clearRenderAssets(registry); },
      createRenderAnimationClip:function(options){ return bridge.createRenderAnimationClip(options); },
      getRenderAnimationClipProperty:function(clip, key){ return bridge.getRenderAnimationClipProperty(clip, key); },
      setRenderAnimationClipProperty:function(clip, key, value){ return bridge.setRenderAnimationClipProperty(clip, key, value); },
      setRenderAnimationClipState:function(clip, state){ return bridge.setRenderAnimationClipState(clip, state); },
      getRenderAnimationClipState:function(clip){ return bridge.getRenderAnimationClipState(clip); },
      setRenderAnimationClipEnabled:function(clip, enabled){ return bridge.setRenderAnimationClipEnabled(clip, enabled); },
      getRenderAnimationClipEnabled:function(clip){ return bridge.getRenderAnimationClipEnabled(clip); },
      setRenderAnimationClipLoop:function(clip, loop){ return bridge.setRenderAnimationClipLoop(clip, loop); },
      getRenderAnimationClipLoop:function(clip){ return bridge.getRenderAnimationClipLoop(clip); },
      setRenderAnimationClipSpeed:function(clip, speed){ return bridge.setRenderAnimationClipSpeed(clip, speed); },
      getRenderAnimationClipSpeed:function(clip){ return bridge.getRenderAnimationClipSpeed(clip); },
      createRenderAnimationRegistry:function(options){ return bridge.createRenderAnimationRegistry(options); },
      registerRenderAnimationClip:function(registry, clip, id){ return bridge.registerRenderAnimationClip(registry, clip, id); },
      getRenderAnimationClip:function(registry, id){ return bridge.getRenderAnimationClip(registry, id); },
      hasRenderAnimationClip:function(registry, id){ return bridge.hasRenderAnimationClip(registry, id); },
      releaseRenderAnimationClip:function(registry, id){ return bridge.releaseRenderAnimationClip(registry, id); },
      clearRenderAnimationClips:function(registry){ return bridge.clearRenderAnimationClips(registry); },
      createRenderModelInstance:function(options){ return bridge.createRenderModelInstance(options); },
      getRenderModelInstanceProperty:function(instance, key){ return bridge.getRenderModelInstanceProperty(instance, key); },
      setRenderModelInstanceProperty:function(instance, key, value){ return bridge.setRenderModelInstanceProperty(instance, key, value); },
      setRenderModelInstanceState:function(instance, state){ return bridge.setRenderModelInstanceState(instance, state); },
      getRenderModelInstanceState:function(instance){ return bridge.getRenderModelInstanceState(instance); },
      setRenderModelInstanceEnabled:function(instance, enabled){ return bridge.setRenderModelInstanceEnabled(instance, enabled); },
      getRenderModelInstanceEnabled:function(instance){ return bridge.getRenderModelInstanceEnabled(instance); },
      setRenderModelInstanceVisible:function(instance, visible){ return bridge.setRenderModelInstanceVisible(instance, visible); },
      getRenderModelInstanceVisible:function(instance){ return bridge.getRenderModelInstanceVisible(instance); },
      createRenderModelInstanceRegistry:function(options){ return bridge.createRenderModelInstanceRegistry(options); },
      registerRenderModelInstance:function(registry, instance, id){ return bridge.registerRenderModelInstance(registry, instance, id); },
      getRenderModelInstance:function(registry, id){ return bridge.getRenderModelInstance(registry, id); },
      hasRenderModelInstance:function(registry, id){ return bridge.hasRenderModelInstance(registry, id); },
      releaseRenderModelInstance:function(registry, id){ return bridge.releaseRenderModelInstance(registry, id); },
      clearRenderModelInstances:function(registry){ return bridge.clearRenderModelInstances(registry); },
      createRenderAnimationStateMachine:function(options){ return bridge.createRenderAnimationStateMachine(options); },
      getRenderAnimationStateMachineProperty:function(machine, key){ return bridge.getRenderAnimationStateMachineProperty(machine, key); },
      setRenderAnimationStateMachineProperty:function(machine, key, value){ return bridge.setRenderAnimationStateMachineProperty(machine, key, value); },
      setRenderAnimationStateMachineState:function(machine, state){ return bridge.setRenderAnimationStateMachineState(machine, state); },
      getRenderAnimationStateMachineState:function(machine){ return bridge.getRenderAnimationStateMachineState(machine); },
      setRenderAnimationStateMachineEnabled:function(machine, enabled){ return bridge.setRenderAnimationStateMachineEnabled(machine, enabled); },
      getRenderAnimationStateMachineEnabled:function(machine){ return bridge.getRenderAnimationStateMachineEnabled(machine); },
      setRenderAnimationStateMachineCurrentState:function(machine, state){ return bridge.setRenderAnimationStateMachineCurrentState(machine, state); },
      getRenderAnimationStateMachineCurrentState:function(machine){ return bridge.getRenderAnimationStateMachineCurrentState(machine); },
      addRenderAnimationState:function(machine, id, definition){ return bridge.addRenderAnimationState(machine, id, definition); },
      removeRenderAnimationState:function(machine, id){ return bridge.removeRenderAnimationState(machine, id); },
      getRenderAnimationStates:function(machine){ return bridge.getRenderAnimationStates(machine); },
      addRenderAnimationTransition:function(machine, transition){ return bridge.addRenderAnimationTransition(machine, transition); },
      removeRenderAnimationTransition:function(machine, transition){ return bridge.removeRenderAnimationTransition(machine, transition); },
      getRenderAnimationTransitions:function(machine){ return bridge.getRenderAnimationTransitions(machine); },
      setRenderAnimationParameter:function(machine, key, value){ return bridge.setRenderAnimationParameter(machine, key, value); },
      getRenderAnimationParameter:function(machine, key){ return bridge.getRenderAnimationParameter(machine, key); },
      createRenderAnimationStateMachineRegistry:function(options){ return bridge.createRenderAnimationStateMachineRegistry(options); },
      registerRenderAnimationStateMachine:function(registry, machine, id){ return bridge.registerRenderAnimationStateMachine(registry, machine, id); },
      getRenderAnimationStateMachine:function(registry, id){ return bridge.getRenderAnimationStateMachine(registry, id); },
      hasRenderAnimationStateMachine:function(registry, id){ return bridge.hasRenderAnimationStateMachine(registry, id); },
      releaseRenderAnimationStateMachine:function(registry, id){ return bridge.releaseRenderAnimationStateMachine(registry, id); },
      clearRenderAnimationStateMachines:function(registry){ return bridge.clearRenderAnimationStateMachines(registry); },

      createRenderAnimationLayer:function(options){ return bridge.createRenderAnimationLayer(options); },
      getRenderAnimationLayerProperty:function(layer, key){ return bridge.getRenderAnimationLayerProperty(layer, key); },
      setRenderAnimationLayerProperty:function(layer, key, value){ return bridge.setRenderAnimationLayerProperty(layer, key, value); },
      setRenderAnimationLayerState:function(layer, state){ return bridge.setRenderAnimationLayerState(layer, state); },
      getRenderAnimationLayerState:function(layer){ return bridge.getRenderAnimationLayerState(layer); },
      setRenderAnimationLayerEnabled:function(layer, enabled){ return bridge.setRenderAnimationLayerEnabled(layer, enabled); },
      getRenderAnimationLayerEnabled:function(layer){ return bridge.getRenderAnimationLayerEnabled(layer); },
      setRenderAnimationLayerWeight:function(layer, weight){ return bridge.setRenderAnimationLayerWeight(layer, weight); },
      getRenderAnimationLayerWeight:function(layer){ return bridge.getRenderAnimationLayerWeight(layer); },
      setRenderAnimationLayerBlendMode:function(layer, mode){ return bridge.setRenderAnimationLayerBlendMode(layer, mode); },
      getRenderAnimationLayerBlendMode:function(layer){ return bridge.getRenderAnimationLayerBlendMode(layer); },
      setRenderAnimationLayerMask:function(layer, mask){ return bridge.setRenderAnimationLayerMask(layer, mask); },
      getRenderAnimationLayerMask:function(layer){ return bridge.getRenderAnimationLayerMask(layer); },
      addRenderAnimationLayerClip:function(layer, clip){ return bridge.addRenderAnimationLayerClip(layer, clip); },
      removeRenderAnimationLayerClip:function(layer, clip){ return bridge.removeRenderAnimationLayerClip(layer, clip); },
      getRenderAnimationLayerClips:function(layer){ return bridge.getRenderAnimationLayerClips(layer); },
      setRenderAnimationLayerParameter:function(layer, key, value){ return bridge.setRenderAnimationLayerParameter(layer, key, value); },
      getRenderAnimationLayerParameter:function(layer, key){ return bridge.getRenderAnimationLayerParameter(layer, key); },
      createRenderAnimationLayerRegistry:function(options){ return bridge.createRenderAnimationLayerRegistry(options); },
      registerRenderAnimationLayer:function(registry, layer, id){ return bridge.registerRenderAnimationLayer(registry, layer, id); },
      getRenderAnimationLayer:function(registry, id){ return bridge.getRenderAnimationLayer(registry, id); },
      hasRenderAnimationLayer:function(registry, id){ return bridge.hasRenderAnimationLayer(registry, id); },
      releaseRenderAnimationLayer:function(registry, id){ return bridge.releaseRenderAnimationLayer(registry, id); },
      clearRenderAnimationLayers:function(registry){ return bridge.clearRenderAnimationLayers(registry); },
      createRenderAnimationMarker:function(options){ return bridge.createRenderAnimationMarker(options); },
      getRenderAnimationMarkerProperty:function(marker, key){ return bridge.getRenderAnimationMarkerProperty(marker, key); },
      setRenderAnimationMarkerProperty:function(marker, key, value){ return bridge.setRenderAnimationMarkerProperty(marker, key, value); },
      setRenderAnimationMarkerEnabled:function(marker, enabled){ return bridge.setRenderAnimationMarkerEnabled(marker, enabled); },
      getRenderAnimationMarkerEnabled:function(marker){ return bridge.getRenderAnimationMarkerEnabled(marker); },
      setRenderAnimationMarkerTime:function(marker, time){ return bridge.setRenderAnimationMarkerTime(marker, time); },
      getRenderAnimationMarkerTime:function(marker){ return bridge.getRenderAnimationMarkerTime(marker); },
      createRenderAnimationMarkerRegistry:function(options){ return bridge.createRenderAnimationMarkerRegistry(options); },
      registerRenderAnimationMarker:function(registry, marker, id){ return bridge.registerRenderAnimationMarker(registry, marker, id); },
      getRenderAnimationMarker:function(registry, id){ return bridge.getRenderAnimationMarker(registry, id); },
      hasRenderAnimationMarker:function(registry, id){ return bridge.hasRenderAnimationMarker(registry, id); },
      releaseRenderAnimationMarker:function(registry, id){ return bridge.releaseRenderAnimationMarker(registry, id); },
      clearRenderAnimationMarkers:function(registry){ return bridge.clearRenderAnimationMarkers(registry); },
      createRenderAnimationEventBinding:function(options){ return bridge.createRenderAnimationEventBinding(options); },
      getRenderAnimationEventBindingProperty:function(binding, key){ return bridge.getRenderAnimationEventBindingProperty(binding, key); },
      setRenderAnimationEventBindingProperty:function(binding, key, value){ return bridge.setRenderAnimationEventBindingProperty(binding, key, value); },
      setRenderAnimationEventBindingEnabled:function(binding, enabled){ return bridge.setRenderAnimationEventBindingEnabled(binding, enabled); },
      getRenderAnimationEventBindingEnabled:function(binding){ return bridge.getRenderAnimationEventBindingEnabled(binding); },
      setRenderAnimationEventBindingMarker:function(binding, markerId){ return bridge.setRenderAnimationEventBindingMarker(binding, markerId); },
      getRenderAnimationEventBindingMarker:function(binding){ return bridge.getRenderAnimationEventBindingMarker(binding); },
      createRenderAnimationEventBindingRegistry:function(options){ return bridge.createRenderAnimationEventBindingRegistry(options); },
      registerRenderAnimationEventBinding:function(registry, binding, id){ return bridge.registerRenderAnimationEventBinding(registry, binding, id); },
      getRenderAnimationEventBinding:function(registry, id){ return bridge.getRenderAnimationEventBinding(registry, id); },
      hasRenderAnimationEventBinding:function(registry, id){ return bridge.hasRenderAnimationEventBinding(registry, id); },
      releaseRenderAnimationEventBinding:function(registry, id){ return bridge.releaseRenderAnimationEventBinding(registry, id); },
      clearRenderAnimationEventBindings:function(registry){ return bridge.clearRenderAnimationEventBindings(registry); },
      createRenderAnimationController:function(options){ return bridge.createRenderAnimationController(options); },
      getRenderAnimationControllerProperty:function(controller, key){ return bridge.getRenderAnimationControllerProperty(controller, key); },
      setRenderAnimationControllerProperty:function(controller, key, value){ return bridge.setRenderAnimationControllerProperty(controller, key, value); },
      setRenderAnimationControllerState:function(controller, state){ return bridge.setRenderAnimationControllerState(controller, state); },
      getRenderAnimationControllerState:function(controller){ return bridge.getRenderAnimationControllerState(controller); },
      setRenderAnimationControllerEnabled:function(controller, enabled){ return bridge.setRenderAnimationControllerEnabled(controller, enabled); },
      getRenderAnimationControllerEnabled:function(controller){ return bridge.getRenderAnimationControllerEnabled(controller); },
      setRenderAnimationControllerPlaying:function(controller, playing){ return bridge.setRenderAnimationControllerPlaying(controller, playing); },
      getRenderAnimationControllerPlaying:function(controller){ return bridge.getRenderAnimationControllerPlaying(controller); },
      setRenderAnimationControllerClip:function(controller, clipId){ return bridge.setRenderAnimationControllerClip(controller, clipId); },
      getRenderAnimationControllerClip:function(controller){ return bridge.getRenderAnimationControllerClip(controller); },
      setRenderAnimationControllerTime:function(controller, time){ return bridge.setRenderAnimationControllerTime(controller, time); },
      getRenderAnimationControllerTime:function(controller){ return bridge.getRenderAnimationControllerTime(controller); },
      setRenderAnimationControllerSpeed:function(controller, speed){ return bridge.setRenderAnimationControllerSpeed(controller, speed); },
      getRenderAnimationControllerSpeed:function(controller){ return bridge.getRenderAnimationControllerSpeed(controller); },
      setRenderAnimationControllerLoop:function(controller, loop){ return bridge.setRenderAnimationControllerLoop(controller, loop); },
      getRenderAnimationControllerLoop:function(controller){ return bridge.getRenderAnimationControllerLoop(controller); },
      createRenderAnimationControllerRegistry:function(options){ return bridge.createRenderAnimationControllerRegistry(options); },
      registerRenderAnimationController:function(registry, controller, id){ return bridge.registerRenderAnimationController(registry, controller, id); },
      getRenderAnimationController:function(registry, id){ return bridge.getRenderAnimationController(registry, id); },
      hasRenderAnimationController:function(registry, id){ return bridge.hasRenderAnimationController(registry, id); },
      releaseRenderAnimationController:function(registry, id){ return bridge.releaseRenderAnimationController(registry, id); },
      clearRenderAnimationControllers:function(registry){ return bridge.clearRenderAnimationControllers(registry); },

      createRenderAnimationTimeline:function(options){ return bridge.createRenderAnimationTimeline(options); },
      getRenderAnimationTimelineProperty:function(timeline, key){ return bridge.getRenderAnimationTimelineProperty(timeline, key); },
      setRenderAnimationTimelineProperty:function(timeline, key, value){ return bridge.setRenderAnimationTimelineProperty(timeline, key, value); },
      setRenderAnimationTimelineEnabled:function(timeline, enabled){ return bridge.setRenderAnimationTimelineEnabled(timeline, enabled); },
      getRenderAnimationTimelineEnabled:function(timeline){ return bridge.getRenderAnimationTimelineEnabled(timeline); },
      setRenderAnimationTimelineDuration:function(timeline, duration){ return bridge.setRenderAnimationTimelineDuration(timeline, duration); },
      getRenderAnimationTimelineDuration:function(timeline){ return bridge.getRenderAnimationTimelineDuration(timeline); },
      addRenderAnimationTrack:function(timeline, track){ return bridge.addRenderAnimationTrack(timeline, track); },
      removeRenderAnimationTrack:function(timeline, track){ return bridge.removeRenderAnimationTrack(timeline, track); },
      getRenderAnimationTracks:function(timeline){ return bridge.getRenderAnimationTracks(timeline); },
      createRenderAnimationKeyframe:function(options){ return bridge.createRenderAnimationKeyframe(options); },
      getRenderAnimationKeyframeProperty:function(keyframe, key){ return bridge.getRenderAnimationKeyframeProperty(keyframe, key); },
      setRenderAnimationKeyframeProperty:function(keyframe, key, value){ return bridge.setRenderAnimationKeyframeProperty(keyframe, key, value); },
      setRenderAnimationKeyframeTime:function(keyframe, time){ return bridge.setRenderAnimationKeyframeTime(keyframe, time); },
      getRenderAnimationKeyframeTime:function(keyframe){ return bridge.getRenderAnimationKeyframeTime(keyframe); },
      setRenderAnimationKeyframeEnabled:function(keyframe, enabled){ return bridge.setRenderAnimationKeyframeEnabled(keyframe, enabled); },
      getRenderAnimationKeyframeEnabled:function(keyframe){ return bridge.getRenderAnimationKeyframeEnabled(keyframe); },
      createRenderAnimationTimelineRegistry:function(options){ return bridge.createRenderAnimationTimelineRegistry(options); },
      registerRenderAnimationTimeline:function(registry, timeline, id){ return bridge.registerRenderAnimationTimeline(registry, timeline, id); },
      getRenderAnimationTimeline:function(registry, id){ return bridge.getRenderAnimationTimeline(registry, id); },
      hasRenderAnimationTimeline:function(registry, id){ return bridge.hasRenderAnimationTimeline(registry, id); },
      releaseRenderAnimationTimeline:function(registry, id){ return bridge.releaseRenderAnimationTimeline(registry, id); },
      clearRenderAnimationTimelines:function(registry){ return bridge.clearRenderAnimationTimelines(registry); },
      createRenderAnimationBlendTree:function(options){ return bridge.createRenderAnimationBlendTree(options); },
      getRenderAnimationBlendTreeProperty:function(tree, key){ return bridge.getRenderAnimationBlendTreeProperty(tree, key); },
      setRenderAnimationBlendTreeProperty:function(tree, key, value){ return bridge.setRenderAnimationBlendTreeProperty(tree, key, value); },
      setRenderAnimationBlendTreeEnabled:function(tree, enabled){ return bridge.setRenderAnimationBlendTreeEnabled(tree, enabled); },
      getRenderAnimationBlendTreeEnabled:function(tree){ return bridge.getRenderAnimationBlendTreeEnabled(tree); },
      setRenderAnimationBlendTreeRootNode:function(tree, nodeId){ return bridge.setRenderAnimationBlendTreeRootNode(tree, nodeId); },
      getRenderAnimationBlendTreeRootNode:function(tree){ return bridge.getRenderAnimationBlendTreeRootNode(tree); },
      addRenderAnimationBlendNode:function(tree, node){ return bridge.addRenderAnimationBlendNode(tree, node); },
      removeRenderAnimationBlendNode:function(tree, node){ return bridge.removeRenderAnimationBlendNode(tree, node); },
      getRenderAnimationBlendNodes:function(tree){ return bridge.getRenderAnimationBlendNodes(tree); },
      setRenderAnimationBlendParameter:function(tree, key, value){ return bridge.setRenderAnimationBlendParameter(tree, key, value); },
      getRenderAnimationBlendParameter:function(tree, key){ return bridge.getRenderAnimationBlendParameter(tree, key); },
      createRenderAnimationBlendTreeRegistry:function(options){ return bridge.createRenderAnimationBlendTreeRegistry(options); },
      registerRenderAnimationBlendTree:function(registry, tree, id){ return bridge.registerRenderAnimationBlendTree(registry, tree, id); },
      getRenderAnimationBlendTree:function(registry, id){ return bridge.getRenderAnimationBlendTree(registry, id); },
      hasRenderAnimationBlendTree:function(registry, id){ return bridge.hasRenderAnimationBlendTree(registry, id); },
      releaseRenderAnimationBlendTree:function(registry, id){ return bridge.releaseRenderAnimationBlendTree(registry, id); },
      clearRenderAnimationBlendTrees:function(registry){ return bridge.clearRenderAnimationBlendTrees(registry); },
      createRenderAnimationSystem:function(options){ return bridge.createRenderAnimationSystem(options); },
      getRenderAnimationSystemProperty:function(system, key){ return bridge.getRenderAnimationSystemProperty(system, key); },
      setRenderAnimationSystemProperty:function(system, key, value){ return bridge.setRenderAnimationSystemProperty(system, key, value); },
      setRenderAnimationSystemEnabled:function(system, enabled){ return bridge.setRenderAnimationSystemEnabled(system, enabled); },
      getRenderAnimationSystemEnabled:function(system){ return bridge.getRenderAnimationSystemEnabled(system); },
      setRenderAnimationSystemParameter:function(system, key, value){ return bridge.setRenderAnimationSystemParameter(system, key, value); },
      getRenderAnimationSystemParameter:function(system, key){ return bridge.getRenderAnimationSystemParameter(system, key); },
      registerRenderAnimationComponent:function(system, type, component, id){ return bridge.registerRenderAnimationComponent(system, type, component, id); },
      getRenderAnimationComponent:function(system, type, id){ return bridge.getRenderAnimationComponent(system, type, id); },
      hasRenderAnimationComponent:function(system, type, id){ return bridge.hasRenderAnimationComponent(system, type, id); },
      releaseRenderAnimationComponent:function(system, type, id){ return bridge.releaseRenderAnimationComponent(system, type, id); },
      clearRenderAnimationComponents:function(system, type){ return bridge.clearRenderAnimationComponents(system, type); },
      createRenderAnimationSystemRegistry:function(options){ return bridge.createRenderAnimationSystemRegistry(options); },
      registerRenderAnimationSystem:function(registry, system, id){ return bridge.registerRenderAnimationSystem(registry, system, id); },
      getRenderAnimationSystem:function(registry, id){ return bridge.getRenderAnimationSystem(registry, id); },
      hasRenderAnimationSystem:function(registry, id){ return bridge.hasRenderAnimationSystem(registry, id); },
      releaseRenderAnimationSystem:function(registry, id){ return bridge.releaseRenderAnimationSystem(registry, id); },
      clearRenderAnimationSystems:function(registry){ return bridge.clearRenderAnimationSystems(registry); },

      createRenderSkeleton:function(options){ return bridge.createRenderSkeleton(options); },
      getRenderSkeletonProperty:function(skeleton,key){ return bridge.getRenderSkeletonProperty(skeleton,key); },
      setRenderSkeletonProperty:function(skeleton,key,value){ return bridge.setRenderSkeletonProperty(skeleton,key,value); },
      setRenderSkeletonEnabled:function(skeleton,enabled){ return bridge.setRenderSkeletonEnabled(skeleton,enabled); },
      getRenderSkeletonEnabled:function(skeleton){ return bridge.getRenderSkeletonEnabled(skeleton); },
      addRenderBone:function(skeleton,bone,id){ return bridge.addRenderBone(skeleton,bone,id); },
      removeRenderBone:function(skeleton,id){ return bridge.removeRenderBone(skeleton,id); },
      getRenderBones:function(skeleton){ return bridge.getRenderBones(skeleton); },
      setRenderSkeletonRootBone:function(skeleton,id){ return bridge.setRenderSkeletonRootBone(skeleton,id); },
      getRenderSkeletonRootBone:function(skeleton){ return bridge.getRenderSkeletonRootBone(skeleton); },
      createRenderSkeletonRegistry:function(options){ return bridge.createRenderSkeletonRegistry(options); },
      registerRenderSkeleton:function(registry,skeleton,id){ return bridge.registerRenderSkeleton(registry,skeleton,id); },
      getRenderSkeleton:function(registry,id){ return bridge.getRenderSkeleton(registry,id); },
      hasRenderSkeleton:function(registry,id){ return bridge.hasRenderSkeleton(registry,id); },
      releaseRenderSkeleton:function(registry,id){ return bridge.releaseRenderSkeleton(registry,id); },
      clearRenderSkeletons:function(registry){ return bridge.clearRenderSkeletons(registry); },
      createRenderSkinning:function(options){ return bridge.createRenderSkinning(options); },
      getRenderSkinningProperty:function(skinning,key){ return bridge.getRenderSkinningProperty(skinning,key); },
      setRenderSkinningProperty:function(skinning,key,value){ return bridge.setRenderSkinningProperty(skinning,key,value); },
      setRenderSkinningEnabled:function(skinning,enabled){ return bridge.setRenderSkinningEnabled(skinning,enabled); },
      getRenderSkinningEnabled:function(skinning){ return bridge.getRenderSkinningEnabled(skinning); },
      setRenderSkinningSkeleton:function(skinning,skeleton){ return bridge.setRenderSkinningSkeleton(skinning,skeleton); },
      getRenderSkinningSkeleton:function(skinning){ return bridge.getRenderSkinningSkeleton(skinning); },
      createRenderSkinningRegistry:function(options){ return bridge.createRenderSkinningRegistry(options); },
      registerRenderSkinning:function(registry,skinning,id){ return bridge.registerRenderSkinning(registry,skinning,id); },
      getRenderSkinning:function(registry,id){ return bridge.getRenderSkinning(registry,id); },
      hasRenderSkinning:function(registry,id){ return bridge.hasRenderSkinning(registry,id); },
      releaseRenderSkinning:function(registry,id){ return bridge.releaseRenderSkinning(registry,id); },
      clearRenderSkinnings:function(registry){ return bridge.clearRenderSkinnings(registry); },
      createRenderMorph:function(options){ return bridge.createRenderMorph(options); },
      getRenderMorphProperty:function(morph,key){ return bridge.getRenderMorphProperty(morph,key); },
      setRenderMorphProperty:function(morph,key,value){ return bridge.setRenderMorphProperty(morph,key,value); },
      setRenderMorphEnabled:function(morph,enabled){ return bridge.setRenderMorphEnabled(morph,enabled); },
      getRenderMorphEnabled:function(morph){ return bridge.getRenderMorphEnabled(morph); },
      setRenderMorphWeight:function(morph,weight){ return bridge.setRenderMorphWeight(morph,weight); },
      getRenderMorphWeight:function(morph){ return bridge.getRenderMorphWeight(morph); },
      createRenderMorphRegistry:function(options){ return bridge.createRenderMorphRegistry(options); },
      registerRenderMorph:function(registry,morph,id){ return bridge.registerRenderMorph(registry,morph,id); },
      getRenderMorph:function(registry,id){ return bridge.getRenderMorph(registry,id); },
      hasRenderMorph:function(registry,id){ return bridge.hasRenderMorph(registry,id); },
      releaseRenderMorph:function(registry,id){ return bridge.releaseRenderMorph(registry,id); },
      clearRenderMorphs:function(registry){ return bridge.clearRenderMorphs(registry); },
      createRenderModelSystem:function(options){ return bridge.createRenderModelSystem(options); },
      getRenderModelSystemProperty:function(system,key){ return bridge.getRenderModelSystemProperty(system,key); },
      setRenderModelSystemProperty:function(system,key,value){ return bridge.setRenderModelSystemProperty(system,key,value); },
      setRenderModelSystemEnabled:function(system,enabled){ return bridge.setRenderModelSystemEnabled(system,enabled); },
      getRenderModelSystemEnabled:function(system){ return bridge.getRenderModelSystemEnabled(system); },
      setRenderModelSystemParameter:function(system,key,value){ return bridge.setRenderModelSystemParameter(system,key,value); },
      getRenderModelSystemParameter:function(system,key){ return bridge.getRenderModelSystemParameter(system,key); },
      registerRenderModelComponent:function(system,type,component,id){ return bridge.registerRenderModelComponent(system,type,component,id); },
      getRenderModelComponent:function(system,type,id){ return bridge.getRenderModelComponent(system,type,id); },
      hasRenderModelComponent:function(system,type,id){ return bridge.hasRenderModelComponent(system,type,id); },
      releaseRenderModelComponent:function(system,type,id){ return bridge.releaseRenderModelComponent(system,type,id); },
      clearRenderModelComponents:function(system,type){ return bridge.clearRenderModelComponents(system,type); },
      createRenderModelSystemRegistry:function(options){ return bridge.createRenderModelSystemRegistry(options); },
      registerRenderModelSystem:function(registry,system,id){ return bridge.registerRenderModelSystem(registry,system,id); },
      getRenderModelSystem:function(registry,id){ return bridge.getRenderModelSystem(registry,id); },
      hasRenderModelSystem:function(registry,id){ return bridge.hasRenderModelSystem(registry,id); },
      releaseRenderModelSystem:function(registry,id){ return bridge.releaseRenderModelSystem(registry,id); },
      clearRenderModelSystems:function(registry){ return bridge.clearRenderModelSystems(registry); },
      createRenderWorldSystem:function(options){ return bridge.createRenderWorldSystem(options); },
      getRenderWorldSystemProperty:function(system,key){ return bridge.getRenderWorldSystemProperty(system,key); },
      setRenderWorldSystemProperty:function(system,key,value){ return bridge.setRenderWorldSystemProperty(system,key,value); },
      setRenderWorldSystemEnabled:function(system,enabled){ return bridge.setRenderWorldSystemEnabled(system,enabled); },
      getRenderWorldSystemEnabled:function(system){ return bridge.getRenderWorldSystemEnabled(system); },
      setRenderWorldSystemParameter:function(system,key,value){ return bridge.setRenderWorldSystemParameter(system,key,value); },
      getRenderWorldSystemParameter:function(system,key){ return bridge.getRenderWorldSystemParameter(system,key); },
      setRenderWorldSystemComponent:function(system,type,component){ return bridge.setRenderWorldSystemComponent(system,type,component); },
      getRenderWorldSystemComponent:function(system,type){ return bridge.getRenderWorldSystemComponent(system,type); },
      createRenderWorldRegistry:function(options){ return bridge.createRenderWorldRegistry(options); },
      registerRenderWorld:function(registry,world,id){ return bridge.registerRenderWorld(registry,world,id); },
      getRenderWorld:function(registry,id){ return bridge.getRenderWorld(registry,id); },
      hasRenderWorld:function(registry,id){ return bridge.hasRenderWorld(registry,id); },
      releaseRenderWorld:function(registry,id){ return bridge.releaseRenderWorld(registry,id); },
      clearRenderWorlds:function(registry){ return bridge.clearRenderWorlds(registry); },
      createRenderSceneDescriptor:function(options){ return bridge.createRenderSceneDescriptor(options); },
      getRenderSceneDescriptorProperty:function(scene,key){ return bridge.getRenderSceneDescriptorProperty(scene,key); },
      setRenderSceneDescriptorProperty:function(scene,key,value){ return bridge.setRenderSceneDescriptorProperty(scene,key,value); },
      createRenderMapDescriptor:function(options){ return bridge.createRenderMapDescriptor(options); },
      getRenderMapDescriptorProperty:function(map,key){ return bridge.getRenderMapDescriptorProperty(map,key); },
      setRenderMapDescriptorProperty:function(map,key,value){ return bridge.setRenderMapDescriptorProperty(map,key,value); },
      createRenderWorldComponentRegistry:function(options){ return bridge.createRenderWorldComponentRegistry(options); },
      registerRenderWorldComponent:function(registry,type,component,id){ return bridge.registerRenderWorldComponent(registry,type,component,id); },
      getRenderWorldComponent:function(registry,type,id){ return bridge.getRenderWorldComponent(registry,type,id); },
      hasRenderWorldComponent:function(registry,type,id){ return bridge.hasRenderWorldComponent(registry,type,id); },
      releaseRenderWorldComponent:function(registry,type,id){ return bridge.releaseRenderWorldComponent(registry,type,id); },
      clearRenderWorldComponents:function(registry,type){ return bridge.clearRenderWorldComponents(registry,type); },
      createRenderDiagnostics:function(options){ return bridge.createRenderDiagnostics(options); },
      getRenderDiagnosticsProperty:function(diagnostics, key){ return bridge.getRenderDiagnosticsProperty(diagnostics, key); },
      setRenderDiagnosticsProperty:function(diagnostics, key, value){ return bridge.setRenderDiagnosticsProperty(diagnostics, key, value); },
      setRenderDiagnosticsEnabled:function(diagnostics, enabled){ return bridge.setRenderDiagnosticsEnabled(diagnostics, enabled); },
      getRenderDiagnosticsEnabled:function(diagnostics){ return bridge.getRenderDiagnosticsEnabled(diagnostics); },
      setRenderDiagnosticCounter:function(diagnostics, key, value){ return bridge.setRenderDiagnosticCounter(diagnostics, key, value); },
      getRenderDiagnosticCounter:function(diagnostics, key){ return bridge.getRenderDiagnosticCounter(diagnostics, key); },
      resetRenderDiagnostics:function(diagnostics){ return bridge.resetRenderDiagnostics(diagnostics); },
      getCastShadow:function(object){ return bridge.getCastShadow(object); },
      setCastShadow:function(object, enabled){ return bridge.setCastShadow(object, enabled); },
      getReceiveShadow:function(object){ return bridge.getReceiveShadow(object); },
      setReceiveShadow:function(object, enabled){ return bridge.setReceiveShadow(object, enabled); },
      setShadowProperty:function(shadow, key, value){ return bridge.setShadowProperty(shadow, key, value); },
      getShadowProperty:function(shadow, key){ return bridge.getShadowProperty(shadow, key); },
      createRenderLightingSystem:function(options){ return bridge.createRenderLightingSystem(options); },
      getRenderLightingSystemProperty:function(system, key){ return bridge.getRenderLightingSystemProperty(system, key); },
      setRenderLightingSystemProperty:function(system, key, value){ return bridge.setRenderLightingSystemProperty(system, key, value); },
      setRenderLightingSystemEnabled:function(system, enabled){ return bridge.setRenderLightingSystemEnabled(system, enabled); },
      getRenderLightingSystemEnabled:function(system){ return bridge.getRenderLightingSystemEnabled(system); },
      setRenderLightingSystemParameter:function(system, key, value){ return bridge.setRenderLightingSystemParameter(system, key, value); },
      getRenderLightingSystemParameter:function(system, key){ return bridge.getRenderLightingSystemParameter(system, key); },
      addRenderLighting:function(system, light){ return bridge.addRenderLighting(system, light); },
      removeRenderLighting:function(system, light){ return bridge.removeRenderLighting(system, light); },
      getRenderLightings:function(system){ return bridge.getRenderLightings(system); },
      setRenderLightingEnvironment:function(system, environment){ return bridge.setRenderLightingEnvironment(system, environment); },
      getRenderLightingEnvironment:function(system){ return bridge.getRenderLightingEnvironment(system); },
      createRenderLightingSystemRegistry:function(options){ return bridge.createRenderLightingSystemRegistry(options); },
      registerRenderLightingSystem:function(registry, system, id){ return bridge.registerRenderLightingSystem(registry, system, id); },
      getRenderLightingSystem:function(registry, id){ return bridge.getRenderLightingSystem(registry, id); },
      hasRenderLightingSystem:function(registry, id){ return bridge.hasRenderLightingSystem(registry, id); },
      releaseRenderLightingSystem:function(registry, id){ return bridge.releaseRenderLightingSystem(registry, id); },
      clearRenderLightingSystems:function(registry){ return bridge.clearRenderLightingSystems(registry); },
      createRenderInteractionSystem:function(options){ return bridge.createRenderInteractionSystem(options); },
      getRenderInteractionSystemProperty:function(system,key){ return bridge.getRenderInteractionSystemProperty(system,key); },
      setRenderInteractionSystemProperty:function(system,key,value){ return bridge.setRenderInteractionSystemProperty(system,key,value); },
      setRenderInteractionSystemEnabled:function(system,enabled){ return bridge.setRenderInteractionSystemEnabled(system,enabled); },
      getRenderInteractionSystemEnabled:function(system){ return bridge.getRenderInteractionSystemEnabled(system); },
      setRenderInteractionInputSystem:function(system,inputSystem){ return bridge.setRenderInteractionInputSystem(system,inputSystem); },
      getRenderInteractionInputSystem:function(system){ return bridge.getRenderInteractionInputSystem(system); },
      setRenderInteractionPickingRegistry:function(system,registry){ return bridge.setRenderInteractionPickingRegistry(system,registry); },
      getRenderInteractionPickingRegistry:function(system){ return bridge.getRenderInteractionPickingRegistry(system); },
      setRenderInteractionUIOverlaySystem:function(system,overlaySystem){ return bridge.setRenderInteractionUIOverlaySystem(system,overlaySystem); },
      getRenderInteractionUIOverlaySystem:function(system){ return bridge.getRenderInteractionUIOverlaySystem(system); },
      createRenderInteractionSystemRegistry:function(options){ return bridge.createRenderInteractionSystemRegistry(options); },
      registerRenderInteractionSystem:function(registry,system,id){ return bridge.registerRenderInteractionSystem(registry,system,id); },
      getRenderInteractionSystem:function(registry,id){ return bridge.getRenderInteractionSystem(registry,id); },
      hasRenderInteractionSystem:function(registry,id){ return bridge.hasRenderInteractionSystem(registry,id); },
      releaseRenderInteractionSystem:function(registry,id){ return bridge.releaseRenderInteractionSystem(registry,id); },
      clearRenderInteractionSystems:function(registry){ return bridge.clearRenderInteractionSystems(registry); },
      createRenderInputSystem:function(options){ return bridge.createRenderInputSystem(options); },
      getRenderInputSystemProperty:function(system,key){ return bridge.getRenderInputSystemProperty(system,key); },
      setRenderInputSystemProperty:function(system,key,value){ return bridge.setRenderInputSystemProperty(system,key,value); },
      setRenderInputSystemEnabled:function(system,enabled){ return bridge.setRenderInputSystemEnabled(system,enabled); },
      getRenderInputSystemEnabled:function(system){ return bridge.getRenderInputSystemEnabled(system); },
      setRenderInputSystemActive:function(system,active){ return bridge.setRenderInputSystemActive(system,active); },
      getRenderInputSystemActive:function(system){ return bridge.getRenderInputSystemActive(system); },
      createRenderInputBinding:function(options){ return bridge.createRenderInputBinding(options); },
      getRenderInputBindingProperty:function(binding,key){ return bridge.getRenderInputBindingProperty(binding,key); },
      setRenderInputBindingProperty:function(binding,key,value){ return bridge.setRenderInputBindingProperty(binding,key,value); },
      setRenderInputBindingEnabled:function(binding,enabled){ return bridge.setRenderInputBindingEnabled(binding,enabled); },
      getRenderInputBindingEnabled:function(binding){ return bridge.getRenderInputBindingEnabled(binding); },
      addRenderInputBinding:function(system,binding){ return bridge.addRenderInputBinding(system,binding); },
      removeRenderInputBinding:function(system,bindingOrIndex){ return bridge.removeRenderInputBinding(system,bindingOrIndex); },
      getRenderInputBindings:function(system){ return bridge.getRenderInputBindings(system); },
      createRenderInputSystemRegistry:function(options){ return bridge.createRenderInputSystemRegistry(options); },
      registerRenderInputSystem:function(registry,system,id){ return bridge.registerRenderInputSystem(registry,system,id); },
      getRenderInputSystem:function(registry,id){ return bridge.getRenderInputSystem(registry,id); },
      hasRenderInputSystem:function(registry,id){ return bridge.hasRenderInputSystem(registry,id); },
      releaseRenderInputSystem:function(registry,id){ return bridge.releaseRenderInputSystem(registry,id); },
      clearRenderInputSystems:function(registry){ return bridge.clearRenderInputSystems(registry); },
      createRenderUIOverlaySystem:function(options){ return bridge.createRenderUIOverlaySystem(options); },
      getRenderUIOverlaySystemProperty:function(system,key){ return bridge.getRenderUIOverlaySystemProperty(system,key); },
      setRenderUIOverlaySystemProperty:function(system,key,value){ return bridge.setRenderUIOverlaySystemProperty(system,key,value); },
      setRenderUIOverlaySystemEnabled:function(system,enabled){ return bridge.setRenderUIOverlaySystemEnabled(system,enabled); },
      getRenderUIOverlaySystemEnabled:function(system){ return bridge.getRenderUIOverlaySystemEnabled(system); },
      createRenderUIOverlay:function(options){ return bridge.createRenderUIOverlay(options); },
      getRenderUIOverlayProperty:function(overlay,key){ return bridge.getRenderUIOverlayProperty(overlay,key); },
      setRenderUIOverlayProperty:function(overlay,key,value){ return bridge.setRenderUIOverlayProperty(overlay,key,value); },
      setRenderUIOverlayEnabled:function(overlay,enabled){ return bridge.setRenderUIOverlayEnabled(overlay,enabled); },
      getRenderUIOverlayEnabled:function(overlay){ return bridge.getRenderUIOverlayEnabled(overlay); },
      setRenderUIOverlayVisible:function(overlay,visible){ return bridge.setRenderUIOverlayVisible(overlay,visible); },
      getRenderUIOverlayVisible:function(overlay){ return bridge.getRenderUIOverlayVisible(overlay); },
      addRenderUIOverlay:function(system,overlay){ return bridge.addRenderUIOverlay(system,overlay); },
      removeRenderUIOverlay:function(system,overlayOrIndex){ return bridge.removeRenderUIOverlay(system,overlayOrIndex); },
      getRenderUIOverlays:function(system){ return bridge.getRenderUIOverlays(system); },
      createRenderUIOverlaySystemRegistry:function(options){ return bridge.createRenderUIOverlaySystemRegistry(options); },
      registerRenderUIOverlaySystem:function(registry,system,id){ return bridge.registerRenderUIOverlaySystem(registry,system,id); },
      getRenderUIOverlaySystem:function(registry,id){ return bridge.getRenderUIOverlaySystem(registry,id); },
      hasRenderUIOverlaySystem:function(registry,id){ return bridge.hasRenderUIOverlaySystem(registry,id); },
      releaseRenderUIOverlaySystem:function(registry,id){ return bridge.releaseRenderUIOverlaySystem(registry,id); },
      clearRenderUIOverlaySystems:function(registry){ return bridge.clearRenderUIOverlaySystems(registry); },
      createRenderAudioSystem:function(options){return bridge.createRenderAudioSystem(options);},
      getRenderAudioSystemProperty:function(system,key){return bridge.getRenderAudioSystemProperty(system,key);},
      setRenderAudioSystemProperty:function(system,key,value){return bridge.setRenderAudioSystemProperty(system,key,value);},
      setRenderAudioSystemEnabled:function(system,enabled){return bridge.setRenderAudioSystemEnabled(system,enabled);},
      getRenderAudioSystemEnabled:function(system){return bridge.getRenderAudioSystemEnabled(system);},
      setRenderAudioSystemVolume:function(system,volume){return bridge.setRenderAudioSystemVolume(system,volume);},
      getRenderAudioSystemVolume:function(system){return bridge.getRenderAudioSystemVolume(system);},
      setRenderAudioSystemMuted:function(system,muted){return bridge.setRenderAudioSystemMuted(system,muted);},
      getRenderAudioSystemMuted:function(system){return bridge.getRenderAudioSystemMuted(system);},
      createRenderSound:function(options){return bridge.createRenderSound(options);},
      getRenderSoundProperty:function(sound,key){return bridge.getRenderSoundProperty(sound,key);},
      setRenderSoundProperty:function(sound,key,value){return bridge.setRenderSoundProperty(sound,key,value);},
      setRenderSoundState:function(sound,state){return bridge.setRenderSoundState(sound,state);},
      getRenderSoundState:function(sound){return bridge.getRenderSoundState(sound);},
      setRenderSoundEnabled:function(sound,enabled){return bridge.setRenderSoundEnabled(sound,enabled);},
      getRenderSoundEnabled:function(sound){return bridge.getRenderSoundEnabled(sound);},
      setRenderSoundVolume:function(sound,volume){return bridge.setRenderSoundVolume(sound,volume);},
      getRenderSoundVolume:function(sound){return bridge.getRenderSoundVolume(sound);},
      setRenderSoundLoop:function(sound,loop){return bridge.setRenderSoundLoop(sound,loop);},
      getRenderSoundLoop:function(sound){return bridge.getRenderSoundLoop(sound);},
      createRenderAudioRegistry:function(options){return bridge.createRenderAudioRegistry(options);},
      registerRenderAudioSystem:function(registry,system,id){return bridge.registerRenderAudioSystem(registry,system,id);},
      getRenderAudioSystem:function(registry,id){return bridge.getRenderAudioSystem(registry,id);},
      hasRenderAudioSystem:function(registry,id){return bridge.hasRenderAudioSystem(registry,id);},
      releaseRenderAudioSystem:function(registry,id){return bridge.releaseRenderAudioSystem(registry,id);},
      registerRenderSound:function(registry,sound,id){return bridge.registerRenderSound(registry,sound,id);},
      getRenderSound:function(registry,id){return bridge.getRenderSound(registry,id);},
      hasRenderSound:function(registry,id){return bridge.hasRenderSound(registry,id);},
      releaseRenderSound:function(registry,id){return bridge.releaseRenderSound(registry,id);},
      clearRenderAudio:function(registry){return bridge.clearRenderAudio(registry);},
      createRenderPhysicsSystem:function(options){return bridge.createRenderPhysicsSystem(options);},
      getRenderPhysicsSystemProperty:function(system,key){return bridge.getRenderPhysicsSystemProperty(system,key);},
      setRenderPhysicsSystemProperty:function(system,key,value){return bridge.setRenderPhysicsSystemProperty(system,key,value);},
      setRenderPhysicsSystemEnabled:function(system,enabled){return bridge.setRenderPhysicsSystemEnabled(system,enabled);},
      getRenderPhysicsSystemEnabled:function(system){return bridge.getRenderPhysicsSystemEnabled(system);},
      createRenderPhysicsBody:function(options){return bridge.createRenderPhysicsBody(options);},
      getRenderPhysicsBodyProperty:function(body,key){return bridge.getRenderPhysicsBodyProperty(body,key);},
      setRenderPhysicsBodyProperty:function(body,key,value){return bridge.setRenderPhysicsBodyProperty(body,key,value);},
      setRenderPhysicsBodyEnabled:function(body,enabled){return bridge.setRenderPhysicsBodyEnabled(body,enabled);},
      getRenderPhysicsBodyEnabled:function(body){return bridge.getRenderPhysicsBodyEnabled(body);},
      addRenderPhysicsBody:function(system,body){return bridge.addRenderPhysicsBody(system,body);},
      removeRenderPhysicsBody:function(system,bodyOrIndex){return bridge.removeRenderPhysicsBody(system,bodyOrIndex);},
      getRenderPhysicsBodies:function(system){return bridge.getRenderPhysicsBodies(system);},
      createRenderCollider:function(options){return bridge.createRenderCollider(options);},
      getRenderColliderProperty:function(collider,key){return bridge.getRenderColliderProperty(collider,key);},
      setRenderColliderProperty:function(collider,key,value){return bridge.setRenderColliderProperty(collider,key,value);},
      setRenderColliderEnabled:function(collider,enabled){return bridge.setRenderColliderEnabled(collider,enabled);},
      getRenderColliderEnabled:function(collider){return bridge.getRenderColliderEnabled(collider);},
      addRenderCollider:function(system,collider){return bridge.addRenderCollider(system,collider);},
      removeRenderCollider:function(system,colliderOrIndex){return bridge.removeRenderCollider(system,colliderOrIndex);},
      getRenderColliders:function(system){return bridge.getRenderColliders(system);},
      createRenderSpatialQuery:function(options){return bridge.createRenderSpatialQuery(options);},
      getRenderSpatialQueryProperty:function(query,key){return bridge.getRenderSpatialQueryProperty(query,key);},
      setRenderSpatialQueryProperty:function(query,key,value){return bridge.setRenderSpatialQueryProperty(query,key,value);},
      setRenderSpatialQueryEnabled:function(query,enabled){return bridge.setRenderSpatialQueryEnabled(query,enabled);},
      getRenderSpatialQueryEnabled:function(query){return bridge.getRenderSpatialQueryEnabled(query);},
      createRenderPhysicsSystemRegistry:function(options){return bridge.createRenderPhysicsSystemRegistry(options);},
      registerRenderPhysicsSystem:function(registry,system,id){return bridge.registerRenderPhysicsSystem(registry,system,id);},
      getRenderPhysicsSystem:function(registry,id){return bridge.getRenderPhysicsSystem(registry,id);},
      hasRenderPhysicsSystem:function(registry,id){return bridge.hasRenderPhysicsSystem(registry,id);},
      releaseRenderPhysicsSystem:function(registry,id){return bridge.releaseRenderPhysicsSystem(registry,id);},
      clearRenderPhysicsSystems:function(registry){return bridge.clearRenderPhysicsSystems(registry);},
      createRenderPhysicsCollisionSpatialSystem:function(options){return bridge.createRenderPhysicsCollisionSpatialSystem(options);},
      getRenderPhysicsCollisionSpatialSystemProperty:function(system,key){return bridge.getRenderPhysicsCollisionSpatialSystemProperty(system,key);},
      setRenderPhysicsCollisionSpatialSystemProperty:function(system,key,value){return bridge.setRenderPhysicsCollisionSpatialSystemProperty(system,key,value);},
      setRenderPhysicsCollisionSpatialSystemEnabled:function(system,enabled){return bridge.setRenderPhysicsCollisionSpatialSystemEnabled(system,enabled);},
      getRenderPhysicsCollisionSpatialSystemEnabled:function(system){return bridge.getRenderPhysicsCollisionSpatialSystemEnabled(system);},
      setRenderPhysicsCollisionSpatialPhysicsSystem:function(system,value){return bridge.setRenderPhysicsCollisionSpatialPhysicsSystem(system,value);},
      getRenderPhysicsCollisionSpatialPhysicsSystem:function(system){return bridge.getRenderPhysicsCollisionSpatialPhysicsSystem(system);},
      setRenderPhysicsCollisionSpatialCollisionSystem:function(system,value){return bridge.setRenderPhysicsCollisionSpatialCollisionSystem(system,value);},
      getRenderPhysicsCollisionSpatialCollisionSystem:function(system){return bridge.getRenderPhysicsCollisionSpatialCollisionSystem(system);},
      setRenderPhysicsCollisionSpatialQuerySystem:function(system,value){return bridge.setRenderPhysicsCollisionSpatialQuerySystem(system,value);},
      getRenderPhysicsCollisionSpatialQuerySystem:function(system){return bridge.getRenderPhysicsCollisionSpatialQuerySystem(system);},
      createRenderPhysicsCollisionSpatialSystemRegistry:function(options){return bridge.createRenderPhysicsCollisionSpatialSystemRegistry(options);},
      registerRenderPhysicsCollisionSpatialSystem:function(registry,system,id){return bridge.registerRenderPhysicsCollisionSpatialSystem(registry,system,id);},
      getRenderPhysicsCollisionSpatialSystem:function(registry,id){return bridge.getRenderPhysicsCollisionSpatialSystem(registry,id);},
      hasRenderPhysicsCollisionSpatialSystem:function(registry,id){return bridge.hasRenderPhysicsCollisionSpatialSystem(registry,id);},
      releaseRenderPhysicsCollisionSpatialSystem:function(registry,id){return bridge.releaseRenderPhysicsCollisionSpatialSystem(registry,id);},
      clearRenderPhysicsCollisionSpatialSystems:function(registry){return bridge.clearRenderPhysicsCollisionSpatialSystems(registry);},
      createCharacterAssetBinding:function(options){return bridge.createCharacterAssetBinding(options);},
      getCharacterAssetBindingProperty:function(v,key){return bridge.getCharacterAssetBindingProperty(v,key);},
      setCharacterAssetBindingProperty:function(v,key,value){return bridge.setCharacterAssetBindingProperty(v,key,value);},
      setCharacterAssetBindingState:function(v,value){return bridge.setCharacterAssetBindingState(v,value);},
      getCharacterAssetBindingState:function(v){return bridge.getCharacterAssetBindingState(v);},
      addCharacterAssetReference:function(v,type,id){return bridge.addCharacterAssetReference(v,type,id);},
      removeCharacterAssetReference:function(v,type,id){return bridge.removeCharacterAssetReference(v,type,id);},
      createCharacterAssetBindingRegistry:function(){return bridge.createCharacterAssetBindingRegistry();},
      registerCharacterAssetBinding:function(registry,binding){return bridge.registerCharacterAssetBinding(registry,binding);},
      getCharacterAssetBinding:function(registry,id){return bridge.getCharacterAssetBinding(registry,id);},
      hasCharacterAssetBinding:function(registry,id){return bridge.hasCharacterAssetBinding(registry,id);},
      releaseCharacterAssetBinding:function(registry,id){return bridge.releaseCharacterAssetBinding(registry,id);},
      clearCharacterAssetBindings:function(registry){return bridge.clearCharacterAssetBindings(registry);},
      resolveCharacterAssetBinding:function(binding,assets){return bridge.resolveCharacterAssetBinding(binding,assets);},
      validateCharacterAssetBinding:function(binding,assets){return bridge.validateCharacterAssetBinding(binding,assets);},
      createCharacterAssetBindingTest:function(options){return bridge.createCharacterAssetBindingTest(options);},
      runCharacterAssetBindingTest:function(test){return bridge.runCharacterAssetBindingTest(test);},
      render:function(renderer, scene, camera){
        if (renderer && renderer.render) return renderer.render(scene, camera);
      },
      renderFrame:function(renderer, scene, camera){
        if (renderer && renderer.render) return renderer.render(scene, camera);
      },
      getRecommendedPixelRatio:function(options){
        if (global.AsgardThreeLegacy && global.AsgardThreeLegacy.getRecommendedPixelRatio) return global.AsgardThreeLegacy.getRecommendedPixelRatio(options);
        var o = options || {}, dpr = Number(o.devicePixelRatio != null ? o.devicePixelRatio : (global.devicePixelRatio || 1)), mobile = !!o.mobile;
        return Math.max(1, Math.min(dpr || 1, mobile ? 1.75 : 2.0));
      },
      configureMainRenderer:function(renderer, options){
        if (!renderer) return renderer;
        var o = options || {};
        if (o.width != null && o.height != null) renderer.setSize(o.width, o.height, false);
        if (o.pixelRatio != null && renderer.setPixelRatio) renderer.setPixelRatio(o.pixelRatio);
        if (renderer.shadowMap) {
          renderer.shadowMap.enabled = o.shadows !== false;
          var soft = (global.AsgardThreeLegacy && global.AsgardThreeLegacy.getConstant) ? global.AsgardThreeLegacy.getConstant('PCFSoftShadowMap') : null;
          if (soft != null) renderer.shadowMap.type = soft;
          // V1.01.26: let the engine render high quality shadows continuously;
          // individual light shadow-map sizes remain controlled by scene content.
          renderer.shadowMap.autoUpdate = true;
          renderer.shadowMap.needsUpdate = true;
        }
        var srgb = (global.AsgardThreeLegacy && global.AsgardThreeLegacy.getConstant) ? global.AsgardThreeLegacy.getConstant('SRGBColorSpace') : null;
        if (srgb && 'outputColorSpace' in renderer) renderer.outputColorSpace = srgb;
        var tone = (global.AsgardThreeLegacy && global.AsgardThreeLegacy.getConstant) ? global.AsgardThreeLegacy.getConstant('ACESFilmicToneMapping') : null;
        if (o.toneMapping !== false && tone != null && 'toneMapping' in renderer) {
          renderer.toneMapping = tone;
          if ('toneMappingExposure' in renderer) renderer.toneMappingExposure = Number(o.exposure != null ? o.exposure : 1.0);
        }
        if ('sortObjects' in renderer) renderer.sortObjects = true;
        return renderer;
      },
      resizeMainRenderer:function(renderer, width, height, pixelRatio){
        if (!renderer) return;
        if (renderer.setPixelRatio && pixelRatio != null) renderer.setPixelRatio(pixelRatio);
        if (renderer.setSize) renderer.setSize(width, height, false);
        return renderer;
      },
      /* V1.01.27 — adaptive high-fidelity governor.
         Starts at the highest practical DPR and only steps down after sustained
         frame pressure. Recovery is deliberately slower to avoid oscillation. */
      createRenderPerformanceGovernor:function(options){
        var o=options||{}, mobile=!!o.mobile;
        var nativeDpr=Math.max(1,Number(o.devicePixelRatio!=null?o.devicePixelRatio:(global.devicePixelRatio||1)));
        var maxDpr=Math.min(nativeDpr,mobile?1.75:2.0);
        var minDpr=mobile?1.0:1.15;
        var tiers=(mobile?[1.75,1.5,1.35,1.2,1.0]:[2.0,1.85,1.7,1.5,1.3,1.15]).filter(function(v){return v<=maxDpr+0.001&&v>=minDpr-0.001;});
        if(!tiers.length) tiers=[maxDpr];
        tiers=tiers.filter(function(v,i,a){return i===0||Math.abs(v-a[i-1])>.001;});
        return {version:'1.01.27',mobile:mobile,nativeDpr:nativeDpr,tiers:tiers,index:0,dpr:tiers[0],ema:16.7,pressure:0,recovery:0,stable:0,elapsed:0,lastChange:0};
      },
      updateRenderPerformanceGovernor:function(g,renderer,dt){
        if(!g||!renderer) return {changed:false,dpr:g&&g.dpr,governor:g};
        var ms=Math.max(1,Math.min(100,Number(dt||0)*1000));
        g.ema=g.ema*0.92+ms*0.08; g.elapsed+=ms;
        if(g.elapsed<500) return {changed:false,dpr:g.dpr,governor:g};
        g.elapsed=0;
        var changed=false;
        // Downshift only after repeated pressure. This preserves visual quality.
        if(g.ema>22){ g.pressure++; g.recovery=0; g.stable=0; }
        else if(g.ema<14){ g.stable++; g.pressure=0; g.recovery++; }
        else { g.pressure=Math.max(0,g.pressure-1); g.stable=Math.max(0,g.stable-1); g.recovery=Math.max(0,g.recovery-1); }
        if(g.pressure>=3 && g.index<g.tiers.length-1 && (performance.now()-g.lastChange)>1800){
          g.index++; g.dpr=g.tiers[g.index]; g.lastChange=performance.now(); g.pressure=0; changed=true;
        } else if(g.recovery>=6 && g.index>0 && (performance.now()-g.lastChange)>4500){
          g.index--; g.dpr=g.tiers[g.index]; g.lastChange=performance.now(); g.recovery=0; g.stable=0; changed=true;
        }
        if(changed){
          var el=renderer.domElement, w=Math.max(1,el.clientWidth||global.innerWidth||1), h=Math.max(1,el.clientHeight||global.innerHeight||1);
          if(renderer.setPixelRatio) renderer.setPixelRatio(g.dpr);
          if(renderer.setSize) renderer.setSize(w,h,false);
        }
        return {changed:changed,dpr:g.dpr,ema:g.ema,index:g.index,governor:g};
      },
      inspectRenderPerformanceGovernor:function(g){
        return g?{version:'1.01.27',dpr:g.dpr,ema:g.ema,index:g.index,tiers:g.tiers.slice(),pressure:g.pressure,recovery:g.recovery}:null;
      },
      createRenderMaterialVisual:function(options){ return bridge.createRenderMaterialVisual(options); },
      getRenderMaterialVisualProperty:function(v,key){ return bridge.getRenderMaterialVisualProperty(v,key); },
      setRenderMaterialVisualProperty:function(v,key,value){ return bridge.setRenderMaterialVisualProperty(v,key,value); },
      setRenderMaterialVisualEnabled:function(v,value){ return bridge.setRenderMaterialVisualEnabled(v,value); },
      getRenderMaterialVisualEnabled:function(v){ return bridge.getRenderMaterialVisualEnabled(v); },
      setRenderMaterialVisualVisible:function(v,value){ return bridge.setRenderMaterialVisualVisible(v,value); },
      getRenderMaterialVisualVisible:function(v){ return bridge.getRenderMaterialVisualVisible(v); },
      setRenderMaterialVisualRarity:function(v,value){ return bridge.setRenderMaterialVisualRarity(v,value); },
      getRenderMaterialVisualRarity:function(v){ return bridge.getRenderMaterialVisualRarity(v); },
      setRenderMaterialVisualGlow:function(v,value){ return bridge.setRenderMaterialVisualGlow(v,value); },
      getRenderMaterialVisualGlow:function(v){ return bridge.getRenderMaterialVisualGlow(v); },
      addRenderMaterialTexture:function(v,id){ return bridge.addRenderMaterialTexture(v,id); },
      removeRenderMaterialTexture:function(v,id){ return bridge.removeRenderMaterialTexture(v,id); },
      getRenderMaterialTextures:function(v){ return bridge.getRenderMaterialTextures(v); },
      createRenderTextureVisual:function(options){ return bridge.createRenderTextureVisual(options); },
      getRenderTextureVisualProperty:function(v,key){ return bridge.getRenderTextureVisualProperty(v,key); },
      setRenderTextureVisualProperty:function(v,key,value){ return bridge.setRenderTextureVisualProperty(v,key,value); },
      setRenderTextureVisualEnabled:function(v,value){ return bridge.setRenderTextureVisualEnabled(v,value); },
      getRenderTextureVisualEnabled:function(v){ return bridge.getRenderTextureVisualEnabled(v); },
      setRenderTextureVisualState:function(v,value){ return bridge.setRenderTextureVisualState(v,value); },
      getRenderTextureVisualState:function(v){ return bridge.getRenderTextureVisualState(v); },
      createRenderRarityVisual:function(options){ return bridge.createRenderRarityVisual(options); },
      getRenderRarityVisualProperty:function(v,key){ return bridge.getRenderRarityVisualProperty(v,key); },
      setRenderRarityVisualProperty:function(v,key,value){ return bridge.setRenderRarityVisualProperty(v,key,value); },
      setRenderRarityVisualRarity:function(v,value){ return bridge.setRenderRarityVisualRarity(v,value); },
      getRenderRarityVisualRarity:function(v){ return bridge.getRenderRarityVisualRarity(v); },
      setRenderRarityVisualGlow:function(v,value){ return bridge.setRenderRarityVisualGlow(v,value); },
      getRenderRarityVisualGlow:function(v){ return bridge.getRenderRarityVisualGlow(v); },
      createRenderHolyDemonVisual:function(options){ return bridge.createRenderHolyDemonVisual(options); },
      getRenderHolyDemonVisualProperty:function(v,key){ return bridge.getRenderHolyDemonVisualProperty(v,key); },
      setRenderHolyDemonVisualProperty:function(v,key,value){ return bridge.setRenderHolyDemonVisualProperty(v,key,value); },
      setRenderHolyDemonVisualAlignment:function(v,value){ return bridge.setRenderHolyDemonVisualAlignment(v,value); },
      getRenderHolyDemonVisualAlignment:function(v){ return bridge.getRenderHolyDemonVisualAlignment(v); },
      setRenderHolyDemonVisualEnabled:function(v,value){ return bridge.setRenderHolyDemonVisualEnabled(v,value); },
      getRenderHolyDemonVisualEnabled:function(v){ return bridge.getRenderHolyDemonVisualEnabled(v); },
      setRenderHolyDemonVisualGlow:function(v,kind,value){ return bridge.setRenderHolyDemonVisualGlow(v,kind,value); },
      getRenderHolyDemonVisualGlow:function(v,kind){ return bridge.getRenderHolyDemonVisualGlow(v,kind); },
      createIsolatedCharacterModelV2Sync:function(options){ return adapter.createIsolatedCharacterModelV2Sync(options); },
      syncIsolatedCharacterPreviewToCharacterModelV2:function(instance,composition,sync){ return adapter.syncIsolatedCharacterPreviewToCharacterModelV2(instance,composition,sync); },
      validateIsolatedCharacterModelV2Sync:function(instance,composition,sync){ return adapter.validateIsolatedCharacterModelV2Sync(instance,composition,sync); },
      applyIsolatedCharacterModelV2Sync:function(instance,composition,sync){ return adapter.applyIsolatedCharacterModelV2Sync(instance,composition,sync); },
      rejectIsolatedCharacterModelV2Sync:function(sync,reason){ return adapter.rejectIsolatedCharacterModelV2Sync(sync,reason); },
      inspectIsolatedCharacterModelV2Sync:function(sync){ return adapter.inspectIsolatedCharacterModelV2Sync(sync); },
      beginIsolatedCharacterModelV2ApplyTransaction:function(instance,composition,sync){ return adapter.beginIsolatedCharacterModelV2ApplyTransaction(instance,composition,sync); },
      commitIsolatedCharacterModelV2ApplyTransaction:function(sync){ return adapter.commitIsolatedCharacterModelV2ApplyTransaction(sync); },
      rollbackIsolatedCharacterModelV2ApplyTransaction:function(sync){ return adapter.rollbackIsolatedCharacterModelV2ApplyTransaction(sync); },
      getIsolatedCharacterModelV2ApplyTransaction:function(sync){ return adapter.getIsolatedCharacterModelV2ApplyTransaction(sync); },

      clearIsolatedCharacterModelV2Sync:function(sync){ return adapter.clearIsolatedCharacterModelV2Sync(sync); },
      createIsolatedCharacterModelV2ShadowInstance:function(options){ return adapter.createIsolatedCharacterModelV2ShadowInstance(options); },
      buildIsolatedCharacterModelV2ShadowInstance:function(sync,shadow){ return adapter.buildIsolatedCharacterModelV2ShadowInstance(sync,shadow); },
      validateIsolatedCharacterModelV2ShadowInstance:function(shadow){ return adapter.validateIsolatedCharacterModelV2ShadowInstance(shadow); },
      getIsolatedCharacterModelV2ShadowPart:function(shadow,part){ return adapter.getIsolatedCharacterModelV2ShadowPart(shadow,part); },
      inspectIsolatedCharacterModelV2ShadowInstance:function(shadow){ return adapter.inspectIsolatedCharacterModelV2ShadowInstance(shadow); },
      clearIsolatedCharacterModelV2ShadowInstance:function(shadow){ return adapter.clearIsolatedCharacterModelV2ShadowInstance(shadow); },
      dispose:function(renderer){
        if (renderer && renderer.dispose) renderer.dispose();
      }
    });
    three.engine = 'three';
    three.active = true;
    bridge.registerRenderAdapter('three', three);
    bridge.setRenderAdapter('three');

    // V1.01.02 formal registry: Three is verified/active; PlayCanvas is
    // registered only as an available adapter when its implementation exists.
    bridge.registerRenderer('three', three, {available:true});
    var pcAdapter = global.AsgardPlayCanvasAdapter;
    if (pcAdapter) {
      bridge.registerRenderer('playcanvas', pcAdapter, {
        available: !!pcAdapter.available
      });
    }
    // Safety rule: do not auto-switch renderer during incremental migration.
    bridge.activeRendererName = 'three';
    if (bridge.rendererRegistry.three) bridge.rendererRegistry.three.active = true;
  }
})(window);

/* V1.02.05 accelerated Character Composition transaction facade */
api.createCharacterCompositionSnapshotV205=function(instance){return bridge.createCharacterCompositionSnapshotV205(instance);};
api.diffCharacterCompositionV205=function(before,after){return bridge.diffCharacterCompositionV205(before,after);};
api.beginCharacterCompositionTransactionV205=function(instance){return bridge.beginCharacterCompositionTransactionV205(instance);};
api.rollbackCharacterCompositionTransactionV205=function(instance){return bridge.rollbackCharacterCompositionTransactionV205(instance);};
api.commitCharacterCompositionTransactionV205=function(instance){return bridge.commitCharacterCompositionTransactionV205(instance);};
api.inspectCharacterCompositionTransactionV205=function(instance){return bridge.inspectCharacterCompositionTransactionV205(instance);};

/* V1.02.04 accelerated Shadow Character composition facade */
api.shadowCharacterCompositionV204=function(instance,options){return bridge.shadowCharacterCompositionV204(instance,options)};
api.inspectShadowCharacterCompositionV204=function(instance){return bridge.inspectShadowCharacterCompositionV204(instance)};
api.clearShadowCharacterCompositionV204=function(instance){return bridge.clearShadowCharacterCompositionV204(instance)};

/* V1.02.07 accelerated Character Preview visual state facade */
api.createCharacterPreviewVisualStateV206=function(instance,options){return bridge.createCharacterPreviewVisualStateV206(instance,options);};
api.applyCharacterPreviewVisualStateV206=function(instance,state){return bridge.applyCharacterPreviewVisualStateV206(instance,state);};
api.setCharacterPreviewAnimationV206=function(instance,clip,options){return bridge.setCharacterPreviewAnimationV206(instance,clip,options);};
api.setCharacterPreviewMaterialVisualV206=function(instance,part,options){return bridge.setCharacterPreviewMaterialVisualV206(instance,part,options);};
api.inspectCharacterPreviewVisualStateV206=function(instance){return bridge.inspectCharacterPreviewVisualStateV206(instance);};
api.clearCharacterPreviewVisualStateV206=function(instance){return bridge.clearCharacterPreviewVisualStateV206(instance);};

/* V1.02.18 Preview Checkpoint Stack / Recovery Validation */
api.createPreviewCheckpointStackV218=function(instance){return bridge.createPreviewCheckpointStackV218(instance);};
api.pushPreviewCheckpointV218=function(instance,label){return bridge.pushPreviewCheckpointV218(instance,label);};
api.restorePreviewCheckpointV218=function(instance,id){return bridge.restorePreviewCheckpointV218(instance,id);};
api.validatePreviewCheckpointRecoveryV218=function(instance){return bridge.validatePreviewCheckpointRecoveryV218(instance);};
api.inspectPreviewCheckpointStackV218=function(instance){return bridge.inspectPreviewCheckpointStackV218(instance);};
api.clearPreviewCheckpointStackV218=function(instance){return bridge.clearPreviewCheckpointStackV218(instance);};


/* V1.02.19-1.02.21 Recovery Transaction / Audit / History */
api.beginRecoveryTransactionV219=function(instance,targetId,options){return bridge.beginRecoveryTransactionV219(instance,targetId,options);};
api.commitRecoveryTransactionV219=function(instance){return bridge.commitRecoveryTransactionV219(instance);};
api.abortRecoveryTransactionV219=function(instance){return bridge.abortRecoveryTransactionV219(instance);};
api.appendPreviewRecoveryAuditV220=function(instance,event,data){return bridge.appendPreviewRecoveryAuditV220(instance,event,data);};
api.inspectPreviewRecoveryAuditV220=function(instance){return bridge.inspectPreviewRecoveryAuditV220(instance);};
api.clearPreviewRecoveryAuditV220=function(instance){return bridge.clearPreviewRecoveryAuditV220(instance);};
api.recordPreviewRecoveryHistoryV221=function(instance,event,data){return bridge.recordPreviewRecoveryHistoryV221(instance,event,data);};
api.verifyPreviewRecoveryHistoryV221=function(instance){return bridge.verifyPreviewRecoveryHistoryV221(instance);};
api.inspectPreviewRecoveryHistoryV221=function(instance){return bridge.inspectPreviewRecoveryHistoryV221(instance);};
api.clearPreviewRecoveryHistoryV221=function(instance){return bridge.clearPreviewRecoveryHistoryV221(instance);};


/* V1.02.23 Render State Snapshot / Commit / Rollback */
api.createPreviewRenderCheckpointV223=function(i){return bridge.createPreviewRenderCheckpointV223(i);};
api.validatePreviewRenderConsistencyV223=function(i){return bridge.validatePreviewRenderConsistencyV223(i);};
api.commitPreviewRenderCheckpointV223=function(i){return bridge.commitPreviewRenderCheckpointV223(i);};
api.rollbackPreviewRenderCheckpointV223=function(i){return bridge.rollbackPreviewRenderCheckpointV223(i);};
api.inspectPreviewRenderCheckpointV223=function(i){return bridge.inspectPreviewRenderCheckpointV223(i);};

/* V1.02.24 accelerated Preview Render Resource Lifecycle */
api.beginPreviewRenderResourceLifecycleV224=function(i,r,o){return bridge.beginPreviewRenderResourceLifecycleV224(i,r,o);};
api.updatePreviewRenderResourceBindingV224=function(i,k,b){return bridge.updatePreviewRenderResourceBindingV224(i,k,b);};
api.validatePreviewRenderReadinessV224=function(i){return bridge.validatePreviewRenderReadinessV224(i);};
api.commitPreviewRenderResourceLifecycleV224=function(i){return bridge.commitPreviewRenderResourceLifecycleV224(i);};
api.releasePreviewRenderResourceLifecycleV224=function(i){return bridge.releasePreviewRenderResourceLifecycleV224(i);};
api.inspectPreviewRenderResourceLifecycleV224=function(i){return bridge.inspectPreviewRenderResourceLifecycleV224(i);};


/* V1.02.26 Character Model V2 Render Instance */
api.createCharacterModelV2RenderInstanceV226=function(o){return bridge.createCharacterModelV2RenderInstanceV226(o);};
api.bindCharacterModelV2RenderPartV226=function(i,p,b){return bridge.bindCharacterModelV2RenderPartV226(i,p,b);};
api.syncCharacterModelV2RenderStateV226=function(i,s){return bridge.syncCharacterModelV2RenderStateV226(i,s);};
api.validateCharacterModelV2RenderInstanceV226=function(i){return bridge.validateCharacterModelV2RenderInstanceV226(i);};
api.commitCharacterModelV2RenderInstanceV226=function(i){return bridge.commitCharacterModelV2RenderInstanceV226(i);};
api.rollbackCharacterModelV2RenderInstanceV226=function(i){return bridge.rollbackCharacterModelV2RenderInstanceV226(i);};
api.inspectCharacterModelV2RenderInstanceV226=function(i){return bridge.inspectCharacterModelV2RenderInstanceV226(i);};

/* V1.02.28 Accelerated Character Model V2 Render Composition */

api.createCharacterModelV2RenderInstanceV228=function(o){return bridge.createCharacterModelV2RenderInstanceV228(o);};
api.bindCharacterModelV2RenderPartV228=function(i,p,d){return bridge.bindCharacterModelV2RenderPartV228(i,p,d);};
api.bindCharacterModelV2RenderResourcesV228=function(i,r){return bridge.bindCharacterModelV2RenderResourcesV228(i,r);};
api.applyCharacterModelV2VisualStateV228=function(i,s){return bridge.applyCharacterModelV2VisualStateV228(i,s);};
api.validateCharacterModelV2RenderV228=function(i){return bridge.validateCharacterModelV2RenderV228(i);};
api.commitCharacterModelV2RenderV228=function(i){return bridge.commitCharacterModelV2RenderV228(i);};
api.rollbackCharacterModelV2RenderV228=function(i){return bridge.rollbackCharacterModelV2RenderV228(i);};
api.inspectCharacterModelV2RenderV228=function(i){return bridge.inspectCharacterModelV2RenderV228(i);};
api.clearCharacterModelV2RenderV228=function(i){return bridge.clearCharacterModelV2RenderV228(i);};

/* V1.02.29 accelerated Character Model V2 render pipeline */
api.createCharacterRenderPipelineV229=function(o){return bridge.createCharacterRenderPipelineV229(o);};
api.updateCharacterRenderPipelineV229=function(p,x){return bridge.updateCharacterRenderPipelineV229(p,x);};
api.validateCharacterRenderPipelineV229=function(p){return bridge.validateCharacterRenderPipelineV229(p);};
api.commitCharacterRenderPipelineV229=function(p){return bridge.commitCharacterRenderPipelineV229(p);};
api.rollbackCharacterRenderPipelineV229=function(p){return bridge.rollbackCharacterRenderPipelineV229(p);};
api.inspectCharacterRenderPipelineV229=function(p){return bridge.inspectCharacterRenderPipelineV229(p);};

/* V1.02.30 unified Character Render Pipeline */
api.createCharacterRenderPipelineV230=function(o){return bridge.createCharacterRenderPipelineV230(o);};
api.updateCharacterRenderPipelineV230=function(p,x){return bridge.updateCharacterRenderPipelineV230(p,x);};
api.validateCharacterRenderPipelineV230=function(p){return bridge.validateCharacterRenderPipelineV230(p);};
api.commitCharacterRenderPipelineV230=function(p){return bridge.commitCharacterRenderPipelineV230(p);};
api.rollbackCharacterRenderPipelineV230=function(p){return bridge.rollbackCharacterRenderPipelineV230(p);};
api.inspectCharacterRenderPipelineV230=function(p){return bridge.inspectCharacterRenderPipelineV230(p);};

/* V1.02.31 Character Render Instance Runtime */
api.createCharacterRenderRuntimeV231=function(o){return bridge.createCharacterRenderRuntimeV231(o);};
api.updateCharacterRenderRuntimeV231=function(r,p,d){return bridge.updateCharacterRenderRuntimeV231(r,p,d);};
api.validateCharacterRenderRuntimeV231=function(r){return bridge.validateCharacterRenderRuntimeV231(r);};
api.commitCharacterRenderRuntimeV231=function(r){return bridge.commitCharacterRenderRuntimeV231(r);};
api.rollbackCharacterRenderRuntimeV231=function(r){return bridge.rollbackCharacterRenderRuntimeV231(r);};
api.inspectCharacterRenderRuntimeV231=function(r){return bridge.inspectCharacterRenderRuntimeV231(r);};
api.clearCharacterRenderRuntimeV231=function(r){return bridge.clearCharacterRenderRuntimeV231(r);};

/* V1.03.00 integrated Character Model V2 Runtime */
api.createCharacterModelV2RuntimeV300=function(o){return bridge.createCharacterModelV2RuntimeV300(o);};
api.updateCharacterModelV2RuntimeV300=function(r,p,d){return bridge.updateCharacterModelV2RuntimeV300(r,p,d);};
api.validateCharacterModelV2RuntimeV300=function(r){return bridge.validateCharacterModelV2RuntimeV300(r);};
api.commitCharacterModelV2RuntimeV300=function(r){return bridge.commitCharacterModelV2RuntimeV300(r);};
api.rollbackCharacterModelV2RuntimeV300=function(r){return bridge.rollbackCharacterModelV2RuntimeV300(r);};
api.inspectCharacterModelV2RuntimeV300=function(r){return bridge.inspectCharacterModelV2RuntimeV300(r);};
api.clearCharacterModelV2RuntimeV300=function(r){return bridge.clearCharacterModelV2RuntimeV300(r);};


/* V1.04.00 Character Model V2 Live Visual Layer facade */
api.createCharacterModelV2LiveInstanceV104=function(o){return bridge.createCharacterModelV2LiveInstanceV104(o);};
api.updateCharacterModelV2LiveInstanceV104=function(i,s,d){return bridge.updateCharacterModelV2LiveInstanceV104(i,s,d);};
api.validateCharacterModelV2LiveInstanceV104=function(i){return bridge.validateCharacterModelV2LiveInstanceV104(i);};
api.commitCharacterModelV2LiveInstanceV104=function(i){return bridge.commitCharacterModelV2LiveInstanceV104(i);};
api.rollbackCharacterModelV2LiveInstanceV104=function(i){return bridge.rollbackCharacterModelV2LiveInstanceV104(i);};
api.inspectCharacterModelV2LiveInstanceV104=function(i){return bridge.inspectCharacterModelV2LiveInstanceV104(i);};
api.clearCharacterModelV2LiveInstanceV104=function(i){return bridge.clearCharacterModelV2LiveInstanceV104(i);};

/* V1.05.00 Character Model V2 Asset Instance Runtime */
api.createCharacterV2AssetInstanceV105=function(o){return bridge.createCharacterV2AssetInstanceV105(o);};
api.bindCharacterV2AssetV105=function(i,p,a,o){return bridge.bindCharacterV2AssetV105(i,p,a,o);};
api.updateCharacterV2AppearanceV105=function(i,s){return bridge.updateCharacterV2AppearanceV105(i,s);};
api.updateCharacterV2EquipmentV105=function(i,s){return bridge.updateCharacterV2EquipmentV105(i,s);};
api.updateCharacterV2AnimationV105=function(i,s){return bridge.updateCharacterV2AnimationV105(i,s);};
api.updateCharacterV2MaterialV105=function(i,s){return bridge.updateCharacterV2MaterialV105(i,s);};
api.updateCharacterV2ResourcesV105=function(i,s){return bridge.updateCharacterV2ResourcesV105(i,s);};
api.validateCharacterV2AssetInstanceV105=function(i){return bridge.validateCharacterV2AssetInstanceV105(i);};
api.commitCharacterV2AssetInstanceV105=function(i,l){return bridge.commitCharacterV2AssetInstanceV105(i,l);};
api.updateCharacterV2AssetInstanceFrameV105=function(i,d){return bridge.updateCharacterV2AssetInstanceFrameV105(i,d);};
api.rollbackCharacterV2AssetInstanceV105=function(i){return bridge.rollbackCharacterV2AssetInstanceV105(i);};
api.inspectCharacterV2AssetInstanceV105=function(i){return bridge.inspectCharacterV2AssetInstanceV105(i);};
api.clearCharacterV2AssetInstanceV105=function(i){return bridge.clearCharacterV2AssetInstanceV105(i);};
api.version='1.05.00';


/* V1.06.00 Current Character Model V2 Source Bridge */
api.createCurrentCharacterModelV2SourceV106=function(s,o){return bridge.createCurrentCharacterModelV2SourceV106(s,o);};
api.bindCurrentCharacterModelV2SourceV106=function(i,s,o){return bridge.bindCurrentCharacterModelV2SourceV106(i,s,o);};
api.validateCurrentCharacterModelV2SourceV106=function(s){return bridge.validateCurrentCharacterModelV2SourceV106(s);};
api.applyCurrentCharacterModelV2SourceToAssetInstanceV106=function(i,s,o){return bridge.applyCurrentCharacterModelV2SourceToAssetInstanceV106(i,s,o);};
api.inspectCurrentCharacterModelV2SourceV106=function(i){return bridge.inspectCurrentCharacterModelV2SourceV106(i);};


/* V1.07.00 Chase Character Asset Test Bridge */
api.createChaseCharacterAssetTestV107=function(options){return bridge.createChaseCharacterAssetTestV107(options);};
api.loadChaseCharacterAssetTestV107=function(test,options){return bridge.loadChaseCharacterAssetTestV107(test,options);};
api.inspectChaseCharacterAssetTestV107=function(test){return bridge.inspectChaseCharacterAssetTestV107(test);};
api.releaseChaseCharacterAssetTestV107=function(test){return bridge.releaseChaseCharacterAssetTestV107(test);};
