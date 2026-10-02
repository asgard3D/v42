# V1.01.07 Audit

- Runtime syntax: PASS (`node --check js/asgard-runtime.js`)
- Camera-relative WASD: PASS — updateMovement uses state.cam.yaw and ignores pitch.
- Global EXP: PASS — MONSTER_EXP_RATE = 2.25 and zoneExpMultiplier is no longer applied.
- Skill-book drop: PASS — skillBookChance = 0.01.
- Skill-book consumption: PASS — learn button decrements qty and removes the item at zero.
- PlayCanvas Map: unchanged.
- Character renderer/fallback: unchanged.
