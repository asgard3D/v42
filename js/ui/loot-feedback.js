/* 掉落回饋（顯示層）：訂閱 Loot 規則層事件 */
Events.on('loot',ev=>{
 if(ev.type=='gold'){logMsg('掉落','獲得 '+ev.g+' 金幣','#ffd54a');fl(hero.position,'+'+ev.g+' 金幣','#ffd54a')}
 else if(ev.type=='pot'){const mp=ev.ptype=='mp',c=mp?'#70b7ff':'#ff7a8a',n=mp?'MP':'HP';logMsg('掉落','獲得 '+n+'水 ×1',c);fl(hero.position,'+'+n+'水',c)}
 else if(ev.type=='equip'){say('裝備 '+ev.it.name,'掉落',hex(ev.it.r));fl(hero.position,'裝備 '+ev.it.name,hex(ev.it.r))}
 else if(ev.type=='bag'){say('獲得 '+ev.it.name,'掉落',hex(ev.it.r));fl(hero.position,ev.it.name,hex(ev.it.r))}
 else if(ev.type=='sold')say('背包已滿，自動賣出 '+ev.it.name,'掉落')});
