/* 存檔（localStorage）與讀檔 */
const SK='ainor_save_v2';const curZone=()=>zoneHint!=null?zoneHint:Z;/* 地圖載入失敗時，存檔仍記住原本的地圖 */
function save(){try{localStorage.setItem(SK,JSON.stringify({n:S.name,cls:S.cls,hs:S.hs,hc:S.hc,lv:S.lv,exp:S.exp,gold:S.gold,pot:S.pot,mpPot:S.mpPot,mp:S.mp,inv:S.inv,eq:S.eq,quick:S.quick,skl:S.skl,books:S.books,sbar:S.sbar,skv:3,ahp:S.autoHp,amp:S.autoMp,alt:Math.max(0,Math.min(4,Number(S.autoLootTier)||0)),quickBarVersion:2,z:curZone(),offline:S.offline}))}catch(e){}}
let sv=null;try{sv=JSON.parse(localStorage.getItem(SK))}catch(e){sv=null}
try{const altSaved=localStorage.getItem('ainor_auto_loot_tier');if(sv&&altSaved!==null&&Number.isFinite(Number(altSaved)))sv.alt=Math.max(0,Math.min(4,Number(altSaved)||0))}catch(e){}
/* 技能存檔正規化：skl 等級、books 技能書、sbar 技能列；舊存檔 learned:[0,1,0] 會轉成技能書 */
function normSkills(v,cls,lv){
 const ids=new Set(Skills.list(cls).map(x=>x.id)),books={},skl={};
 if(v&&v.books&&typeof v.books==='object')Object.keys(v.books).forEach(id=>{if(ids.has(id)&&v.books[id])books[id]=1});
 if(v&&Number(v.skv)!==3&&Array.isArray(v.learned))Object.assign(books,Skills.migrateLearned(cls,v.learned));
 if(v&&v.skl&&typeof v.skl==='object')Object.keys(v.skl).forEach(id=>{const sk=Skills.get(id),L=Math.floor(Number(v.skl[id]));if(ids.has(id)&&L>0){skl[id]=Math.min(sk.max,L);books[id]=1}});
 /* 投入的點數不可超過目前等級可得的點數；超過時整體重置 */
 const spent=Object.values(skl).reduce((a,b)=>a+b,0);if(spent>lv){Object.keys(skl).forEach(k=>delete skl[k])}
 const tmp={cls,lv,skl,books};
 return{skl,books,sbar:Skills.cleanBar(tmp,v&&v.sbar)};
}
function normalizeSave(v){
 const eq0={weapon:null,armor:null,boots:null,ring:null,amulet:null},eq=Object.assign(eq0,(v&&v.eq&&typeof v.eq==='object')?v.eq:{});
 Object.keys(eq).forEach(k=>{const it=eq[k];if(it&&typeof it==='object'&&SLOTN[it.slot]){it.t=tierOf(it);it.d=(it.d|0)&1;it.name=ITN(it.slot,it.t,it.d,CL[v&&v.cls]?v.cls:'warrior')}else eq[k]=null});
 const inv=Array.isArray(v&&v.inv)?v.inv.filter(it=>it&&typeof it==='object'&&SLOTN[it.slot]&&Number.isFinite(Number(it.v))&&Number.isFinite(Number(it.lv))).map(it=>Object.assign({},it,{slot:String(it.slot),v:Number(it.v)||0,lv:Number(it.lv)||1,name:ITN(String(it.slot),tierOf(it),(it.d|0)&1,CL[v&&v.cls]?v.cls:'warrior'),t:tierOf(it),d:(it.d|0)&1})):[];
 let z=Number(v&&v.z);if(!Number.isInteger(z)||z<0||z>=ZN.length)z=0;
 let lv=Math.max(1,Math.min(99,Number(v&&v.lv)||1));
 let quick=Array.isArray(v&&v.quick)?v.quick.slice(0,30):Array(30).fill(null);while(quick.length<30)quick.push(null);
 // 一次性清除舊版本曾綁定技能／預設藥水的快捷欄；新版本之後才保留玩家手動配置。
 if(Number(v&&v.quickBarVersion)!==2)quick=Array(30).fill(null);
 for(let i=0;i<quick.length;i++){if(quick[i]!=='pot'&&quick[i]!=='mpPot')quick[i]=null;}
 const off=v&&v.offline&&Number.isFinite(Number(v.offline.start))?{start:Number(v.offline.start),z:Number.isInteger(Number(v.offline.z))?Number(v.offline.z):z,lv:Math.max(1,Math.min(99,Number(v.offline.lv)||lv)),cls:CL[v&&v.cls]?v.cls:'warrior',lootTier:Math.max(0,Math.min(4,Number(v.offline.lootTier)||0)),active:false}:null;
 return {offline:off,ahp:pcv(v&&v.ahp,35),amp:pcv(v&&v.amp,30),alt:Math.max(0,Math.min(4,Number(v&&v.alt)||0)),...normSkills(v,CL[v&&v.cls]?v.cls:'warrior',lv),n:String(v&&v.n||'冒險者').slice(0,10),cls:CL[v&&v.cls]?v.cls:'warrior',hs:Number.isInteger(v&&v.hs)?v.hs:0,hc:Number.isInteger(v&&v.hc)?v.hc:0,lv,exp:Math.max(0,Number(v&&v.exp)||0),gold:Math.max(0,Number(v&&v.gold)||0),pot:Math.max(0,Number(v&&v.pot)||0),mpPot:Math.max(0,Number(v&&v.mpPot)||0),mp:Math.max(0,Number(v&&v.mp)||0),inv,eq,quick,z};
}
if(sv&&CL[sv.cls]){$('ct').style.display='block';$('ct').textContent='繼續遊戲：'+sv.n+' Lv.'+sv.lv;$('ct').onclick=()=>{
 const d=normalizeSave(sv);
 S.name=d.n;try{const altSaved=localStorage.getItem('ainor_auto_loot_tier');if(altSaved!==null&&Number.isFinite(Number(altSaved)))d.alt=Math.max(0,Math.min(4,Number(altSaved)||0))}catch(e){}
Object.assign(S,{cls:d.cls,hs:d.hs,hc:d.hc,lv:d.lv,exp:d.exp,gold:d.gold,pot:d.pot,mpPot:d.mpPot,mp:d.mp,inv:d.inv,eq:d.eq,skl:d.skl,books:d.books,sbar:d.sbar,autoHp:d.ahp,autoMp:d.amp,autoLootTier:d.alt,quick:d.quick,offline:d.offline,mode:'play',dest:null,tm:null,auto:false,atk:0,buff:{atk:0,spd:0,def:0,hp:0,crit:0,eva:0},bp:{},bo:{},bfx:{},skcd:{}});
 if(S.offline)S.offline.active=true;
 try{enterZone(d.z)}catch(err){console.error('讀取地圖失敗',d.z,err);const want=d.z;enterZone(0);zoneHint=want;setTimeout(()=>say('地圖「'+ZN[want].n+'」載入失敗，暫時停留新手森林；存檔仍保留原地圖','系統','#ff8a8a'),300)}
 rebuild();
 hero.position.set(0,0,0);hero.rotation.y=0;hero.visible=true;hero.traverse(o=>o.visible=true);
 document.body.classList.remove('create');S.mode='play';$('autoBtn').style.display='flex';S.hp=Math.min(maxHp(),Math.max(1,Number(d.hp)||maxHp()));S.mp=Math.min(maxMp(),Math.max(0,Number(d.mp)||maxMp()));renderSk();ui();bagUI();rs();
 cmY=.785;cmP=.75;cmD=16;
 say('已繼續遊戲：'+S.name);if(S.offline){S.offline.active=false;settleOffline();}if(S.mode==='play'){S.offline={start:Date.now(),z:curZone(),lv:S.lv,cls:S.cls,lootTier:Math.max(0,Math.min(4,Number(S.autoLootTier)||0)),active:true};}offlineUI();save();
}}
