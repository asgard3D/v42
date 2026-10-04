/* 戰鬥回饋（顯示層）：訂閱規則層事件，負責聊天記錄、浮動文字 */
Events.on('damage',({m,dmg,crit})=>{
 logMsg('戰鬥','你對 '+m.T.n+' 造成 '+dmg+' 傷害'+(crit?'（暴擊）':''),crit?'#ff9a3a':null);
 fl(m.g.position,(crit?'暴擊 -':'-')+dmg,crit?'#ff9a3a':'#ffd870')});
Events.on('kill',({m,exp})=>say('擊倒 '+m.T.n+' Lv.'+m.lvl+'　+'+exp+' EXP','戰鬥','#9fe3a8'));
Events.on('levelup',({lv})=>{say('升級！Lv.'+lv,'系統','#7fe0ff');fl(hero.position,'LEVEL UP','#7fe0ff')});
