(function(global){
  'use strict';

  /*
   * 神之領域3D — Game Core
   * V1.01.02 Formal Core Contract
   *
   * IMPORTANT:
   * - This module owns renderer-neutral game state/commands only.
   * - It must never import Three.js or PlayCanvas.
   * - Existing legacy runtime remains the authoritative gameplay implementation
   *   during the incremental migration.
   */
  var Core = global.AsgardGameCore = global.AsgardGameCore || {};

  Core.version = '1.01.02';
  Core.rendererIndependent = true;
  Core.architecture = 'GameCore -> EngineBridge -> RendererAdapter';

  Core.createState = function(initial){
    var s = initial || {};
    return {
      version: Core.version,
      player: s.player || null,
      world: s.world || null,
      npcs: s.npcs || [],
      enemies: s.enemies || [],
      portals: s.portals || [],
      camera: s.camera || null,
      input: s.input || {},
      render: s.render || {},
      meta: s.meta || {}
    };
  };

  Core.snapshot = function(state){
    if (!state) return null;
    try { return JSON.parse(JSON.stringify(state)); }
    catch(e) { return null; }
  };

  Core.createCommand = function(type, payload){
    return {
      type: String(type || ''),
      payload: payload == null ? null : payload,
      timestamp: Date.now()
    };
  };

  Core.isCommand = function(command){
    return !!(command && typeof command.type === 'string' && command.type.length);
  };

  Core.applyCommand = function(state, command){
    if (!state || !Core.isCommand(command)) return state;
    /*
     * Commands are intentionally conservative in this migration stage.
     * Gameplay-specific mutations stay in the existing runtime until their
     * corresponding module has been migrated and verified.
     */
    state.meta = state.meta || {};
    state.meta.lastCommand = command.type;
    state.meta.lastCommandAt = command.timestamp;
    return state;
  };

  Core.createRenderState = function(state){
    state = state || {};
    return {
      player: state.player || null,
      world: state.world || null,
      npcs: state.npcs || [],
      enemies: state.enemies || [],
      portals: state.portals || [],
      camera: state.camera || null
    };
  };

  Core.validate = function(state){
    return !!(state && typeof state === 'object' &&
      Array.isArray(state.npcs) &&
      Array.isArray(state.enemies) &&
      Array.isArray(state.portals));
  };
})(window);
