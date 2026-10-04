/* 技能規則（純函式）：技能等級、點數、學習條件、數值成長、被動、技能書掉落。
   不讀全域狀態、不碰 DOM／THREE，只吃 state 與 rng，可直接搬到伺服器。
   st = { cls, lv, skl:{技能id:等級}, books:{技能id:1} }；依賴資料層 SKILLS／SK_BY_ID */
const Skills=(()=>{
 const cl=(v,a,b)=>Math.max(a,Math.min(b,v));
 const list=cls=>(typeof SKILLS!=='undefined'&&SKILLS[cls])||[];
 const S={
  list,
  get:id=>(typeof SK_BY_ID!=='undefined'&&SK_BY_ID[id])||null,
  level:(st,id)=>(st.skl&&st.skl[id])|0,
  hasBook:(st,id)=>!!(st.books&&st.books[id]),
  /* 技能點：每升 1 級得 1 點，已投入的扣除 */
  spent:st=>list(st.cls).reduce((a,s)=>a+S.level(st,s.id),0),
  points:st=>Math.max(0,(st.lv|0)-S.spent(st)),
  /* 技能書只在「技能需求等級所屬的地圖」掉落。
     * 地圖由 ZN 的 lv 作為起始等級：例如 Lv1~9 = 新手森林、Lv10~19 = 赤砂荒漠。
     * 同時保留怪物等級門檻（需求等級 - 10），避免地圖內過低等怪物掉高等技能書。
     */
  dropMinLv:sk=>Math.max(1,sk.lv-10),
  skillZoneIndex:lv=>{
   if(typeof ZN==='undefined'||!Array.isArray(ZN)||!ZN.length)return -1;
   let zi=0;
   for(let i=0;i<ZN.length;i++){if(lv>=Number(ZN[i].lv)||i===0)zi=i;else break}
   return zi;
  },
  dropChance:(sk,mon)=>{const p=sk.dp/100*(mon.T&&mon.T.boss?5:1);return Math.min(.6,p)},
  /* 目前可掉的技能書（尚未取得、怪物等級夠、且位於對應等級地圖） */
  droppable:(st,mon,zone)=>{
   const zi=Number.isInteger(zone)?zone:(zone&&Number.isInteger(zone.index)?zone.index:-1);
   return list(st.cls).filter(s=>!S.hasBook(st,s.id)&&mon.lvl>=S.dropMinLv(s)&&(zi<0||S.skillZoneIndex(s.lv)===zi));
  },
  /* 擊殺時擲骰，最多掉 1 本。回傳技能 id 或 null */
  rollBook:(st,mon,zone,rng)=>{
   /* 向下相容舊呼叫：rollBook(st,mon,rng) 仍可使用，但正式遊戲一律傳入 zone。 */
   if(typeof zone==='function'){rng=zone;zone=-1}
   const c=S.droppable(st,mon,zone);
   for(let i=c.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[c[i],c[j]]=[c[j],c[i]]}
   for(const s of c)if(rng()<S.dropChance(s,mon))return s.id;
   return null},
  /* 學習／升級條件。回傳 {ok,why} */
  canLearn:(st,id)=>{
   const s=S.get(id);if(!s||s.cls!==st.cls)return{ok:false,why:'無此技能'};
   const L=S.level(st,id);
   if(!S.hasBook(st,id))return{ok:false,why:'尚未取得技能書'};
   if(L>=s.max)return{ok:false,why:'已達等級上限'};
   if(st.lv<s.lv)return{ok:false,why:'需要角色 Lv.'+s.lv};
   for(const[pid,pl]of s.pre){if(S.level(st,pid)<pl){const p=S.get(pid);return{ok:false,why:'需要「'+p.n+'」Lv.'+pl}}}
   if(S.points(st)<1)return{ok:false,why:'技能點不足'};
   return{ok:true,why:''}},
  learn:(st,id)=>{const r=S.canLearn(st,id);if(!r.ok)return r;if(!st.skl)st.skl={};st.skl[id]=S.level(st,id)+1;return{ok:true,lv:st.skl[id]}},
  /* 取得技能書（不扣點，也不自動學習）。回傳是否為新取得 */
  giveBook:(st,id)=>{const s=S.get(id);if(!s||s.cls!==st.cls||S.hasBook(st,id))return false;if(!st.books)st.books={};st.books[id]=1;return true},
  resetPoints:st=>{const n=S.spent(st);st.skl={};return n},
  /* 數值成長（Lv1 為基準） */
  mult:(sk,L)=>sk.m*(1+.15*(Math.max(1,L)-1)),
  mpCost:(sk,L,st)=>Math.max(1,Math.round(sk.mp*(1+.08*(Math.max(1,L)-1))*(1-cl(S.passive(st,'mpred'),0,60)/100))),
  cooldown:(sk,L)=>Math.max(.5,+(sk.cd*(1-.03*(Math.max(1,L)-1))).toFixed(2)),
  healPct:(sk,L)=>sk.pct*(1+.15*(Math.max(1,L)-1)),
  buffDur:(sk,L)=>sk.dur+2*(Math.max(1,L)-1),
  /* 增益強度（隨等級成長，並限制上限） */
  buffPower:(sk,L)=>{const o={},g=1+.12*(Math.max(1,L)-1);
   for(const k in sk.buf){const v=sk.buf[k]*g;o[k]=k==='def'?Math.min(.8,v):k==='eva'?Math.min(.75,v):k==='crit'?Math.round(v):+v.toFixed(3)}return o},
  /* 施放增益：寫入 buff／bp（Rules 讀取），並記錄「由哪個技能提供」供畫面顯示剩餘時間。
     後施放的技能覆蓋同屬性時，被完全覆蓋的舊技能會從顯示中移除。回傳 {pw,dur} */
  applyBuff:(st,sk,L)=>{const pw=S.buffPower(sk,L),dur=S.buffDur(sk,L);
   ['buff','bp','bo','bfx'].forEach(k=>{if(!st[k])st[k]={}});
   for(const k in pw){st.buff[k]=dur;st.bp[k]=pw[k];st.bo[k]=sk.id}
   st.bfx[sk.id]={t:dur,d:dur,lv:L};
   for(const id of Object.keys(st.bfx)){const o=S.get(id);if(!o||!o.buf||!Object.keys(o.buf).some(k=>st.bo[k]===id))delete st.bfx[id]}
   return{pw,dur}},
  /* 每幀倒數：buff 各屬性、以及顯示用的 bfx */
  tickBuffs:(st,dt)=>{for(const k in st.buff)st.buff[k]=Math.max(0,st.buff[k]-dt);
   if(st.bfx)for(const id of Object.keys(st.bfx)){st.bfx[id].t-=dt;if(st.bfx[id].t<=0)delete st.bfx[id]}},
  /* 目前生效的增益清單（依剩餘時間由少到多）：[{id,sk,t,d,lv}] */
  activeBuffs:st=>Object.keys(st.bfx||{}).map(id=>({id,sk:S.get(id),t:st.bfx[id].t,d:st.bfx[id].d,lv:st.bfx[id].lv})).filter(b=>b.sk&&b.t>0).sort((a,b)=>a.t-b.t),
  passiveValue:(sk,L)=>sk.v*L,
  /* 某屬性被動加成總和（%）：已學的被動技能 */
  passive:(st,key)=>{if(!st||!st.skl)return 0;let t=0;
   list(st.cls).forEach(s=>{if(s.k==='passive'&&s.st===key){const L=S.level(st,s.id);if(L>0)t+=S.passiveValue(s,L)}});return t},
  /* 施放條件：cond:'lowhp' 需 HP<30% */
  condOk:(sk,hp,maxHp)=>sk.cond==='lowhp'?hp<maxHp*.3:true,
  isActive:sk=>sk.k!=='passive',
  /* 舊存檔（learned:[0,1,0]）轉換：依序給予該職業前 3 個主動技能的技能書 */
  migrateLearned:(cls,learned)=>{const out={};if(!Array.isArray(learned))return out;
   const act=list(cls).filter(S.isActive).slice(0,3);learned.slice(0,3).forEach((v,i)=>{if(v&&act[i])out[act[i].id]=1});return out},
  /* 技能列：6 格，只放已學會的主動技能 */
  BAR_SIZE:6,
  cleanBar:(st,bar)=>{const a=Array.isArray(bar)?bar.slice(0,6):[];while(a.length<6)a.push(null);
   return a.map(id=>{const s=S.get(id);return s&&s.cls===st.cls&&S.isActive(s)&&S.level(st,id)>0?id:null})},
  autoPlace:(st,bar,id)=>{const s=S.get(id);if(!s||!S.isActive(s)||bar.includes(id))return bar;const i=bar.indexOf(null);if(i>=0)bar[i]=id;return bar},
  /* 技能說明（目前等級與下一級） */
  describe:(sk,L)=>{
   const l=Math.max(1,L);
   if(sk.k==='passive')return SK_STAT_NAME[sk.st]+' +'+S.passiveValue(sk,l)+'%';
   if(sk.k==='heal')return '回復 '+Math.round(S.healPct(sk,l)*100)+'% HP';
   if(sk.k==='buff'){const b=S.buffPower(sk,l),t=Object.keys(b).map(k=>SK_BUF_NAME[k]+(k==='def'?' -':' +')+(k==='crit'?b[k]:Math.round(b[k]*100))+'%').join('、');return t+'，持續 '+S.buffDur(sk,l)+' 秒'}
   return (sk.k==='aoe'?'範圍傷害':'單體傷害')+' ×'+S.mult(sk,l).toFixed(2)+(sk.hits?'（'+sk.hits+' 連擊）':'')}
 };
 return S})();
