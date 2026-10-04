/* 掉落與背包規則（純邏輯）：只吃 state 與 rng，不碰 DOM／THREE，可直接搬到伺服器。
   st = { cls, gold, pot, mpPot, hp, mp, ae, auto, autoLootTier, skl:{}, books:{}, inv:[], eq:{weapon,armor,boots,ring,amulet} }
   依賴：資料層 NW、NX、WKM、SLOTN 與 Rules.itemPrice */
const Loot=(()=>{
 const INV_MAX=24,rand=(rng,a,b)=>a+rng()*(b-a),cl=(v,a,b)=>Math.max(a,Math.min(b,v));
 const L={INV_MAX,
  tierOf:it=>it?(Number.isInteger(it.t)?cl(it.t,0,5):cl(Math.floor(((Number(it.lv)||1)-1)/8),0,5)):-1,
  itemName:(slot,t,d,cls)=>{t=cl(t|0,0,5);d=(d|0)&1;const a=slot=='weapon'?NW[WKM[cls]||'sword']:NX[slot];return a?a[t][d]:String(slot)},
  isValid:it=>!!(it&&typeof it==='object'&&SLOTN[it.slot]),
  better:(it,c)=>!c||it.r>c.r||(it.r==c.r&&it.v>c.v),
  /* 自動戰鬥時是否自動拾取：低於「自動拾取最低稀有度」的裝備留在地上 */
  wantsPickup:(st,d)=>!st.auto||d.k!=='item'||d.it.r>=cl(Number(st.autoLootTier)||0,0,4),
  /* 掉落裝備：r=稀有度 0~4 */
  makeItem:(slot,r,lvl,cls,rng)=>{
   const t=L.tierOf({lv:lvl}),d=rng()<.5?1:0,v=slot=='weapon'?(r+1)*2+lvl:slot=='armor'?(r+1)*8+lvl*2:slot=='boots'?(r+1)*3:(r+1)*2;
   return{slot,r,t,v:v+t*(slot=='armor'?10:slot=='weapon'?4:2),lv:lvl,d,name:L.itemName(slot,t,d,cls)}},
  /* 擊殺後掉落清單：[{k:'gold',g}|{k:'book',id}|{k:'pot',ptype}|{k:'item',it}] */
  rollDrops:(st,mon,zone,rng)=>{
   const T=mon.T,out=[];
   out.push({k:'gold',g:Math.round(rand(rng,3,8)*(mon.lvl+2)*(T.boss?5:1))});
   /* 技能書：依怪物等級與各技能掉落率擲骰（見 core/skills.js） */
   const bk=Skills.rollBook(st,mon,zone,rng);if(bk)out.push({k:'book',id:bk});
   if(rng()<.22)out.push({k:'pot',ptype:rng()<.5?'hp':'mp'});
   if(!T.boss&&rng()>Math.min(.7,.3+T.lv*.03))return out;
   const slots=Object.keys(SLOTN);
   for(let i=0;i<(T.boss?2:1);i++){
    const p=Math.pow(rng(),1-zone*.1);let r=p<.55?0:p<.8?1:p<.93?2:p<.985?3:4;if(T.boss)r=Math.max(r,i?3:4);
    /*
     * 自動戰鬥的「裝備拾取階級」現在同時作為「掉落最低階級」：
     * 例如設定「稀有以上」(2)，自動戰鬥擊殺時不會生成粗製/精良裝備。
     * 手動戰鬥不受此設定影響。
     */
    const minDropTier=st.auto?cl(Number(st.autoLootTier)||0,0,4):0;
    if(st.auto&&r<minDropTier)continue;
    out.push({k:'item',it:L.makeItem(slots[Math.floor(rand(rng,0,5))],r,mon.lvl,st.cls,rng)})}
   return out},
  /* 拿到裝備：自動穿戴 → 放背包 → 背包滿自動賣出。回傳 {type:'equip'|'bag'|'sold',it,old?,soldOld?,gold?} */
  addItem:(st,it)=>{const c=st.eq[it.slot];
   if(st.ae&&L.better(it,c)){st.eq[it.slot]=it;let soldOld=0;
    if(c){if(st.inv.length<INV_MAX)st.inv.push(c);else{soldOld=Rules.itemPrice(c);st.gold+=soldOld}}
    return{type:'equip',it,old:c||null,soldOld}}
   if(st.inv.length<INV_MAX){st.inv.push(it);return{type:'bag',it}}
   const g=Rules.itemPrice(it);st.gold+=g;return{type:'sold',it,gold:g}},
  /* 撿起掉落物（技能書交給 Skills 登記，不自動學習）。回傳事件描述 */
  pickup:(st,d)=>{
   if(d.k=='gold'){st.gold+=d.g;return{type:'gold',g:d.g}}
   if(d.k=='pot'){const mp=d.ptype==='mp';if(mp)st.mpPot++;else st.pot++;return{type:'pot',ptype:mp?'mp':'hp'}}
   if(d.k=='book')return{type:'book',id:d.id,isNew:Skills.giveBook(st,d.id)};
   return L.addItem(st,d.it)},
  equipFromBag:(st,idx)=>{const it=st.inv[idx];if(!it)return null;st.inv.splice(idx,1);const o=st.eq[it.slot];st.eq[it.slot]=it;if(o)st.inv.push(o);return{it,old:o||null}},
  unequip:(st,slot)=>{const i=st.eq[slot];if(!i||st.inv.length>=INV_MAX)return false;st.inv.push(i);st.eq[slot]=null;return true},
  sellFromBag:(st,idx)=>{if(!st.inv[idx])return 0;const g=Rules.itemPrice(st.inv.splice(idx,1)[0]);st.gold+=g;return g},
  sellByRarity:(st,r)=>{let n=0,g=0;st.inv=st.inv.filter(it=>{if(it.r===r){g+=Rules.itemPrice(it);n++;return false}return true});st.gold+=g;return{n,g}},
  /* 喝水：不可用回傳 null，否則 {kind,amount}；max 為該資源上限 */
  usePotion:(st,kind,max)=>{
   if(kind==='hp'){if(st.pot<1||st.hp>=max)return null;st.pot--;const a=Math.round(max*.4);st.hp=Math.min(max,st.hp+a);return{kind,amount:a}}
   if(st.mpPot<1||st.mp>=max)return null;st.mpPot--;const a=Math.round(max*.45);st.mp=Math.min(max,st.mp+a);return{kind,amount:a}},
  sanitize:inv=>(Array.isArray(inv)?inv:[]).filter(L.isValid)
 };return L})();
