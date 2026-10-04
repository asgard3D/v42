/* 離線收益 */
const OFFSK='ainor_offline_v1';
function offlineSnapshot(){return {start:Number(S.offline&&S.offline.start)||0,z:curZone(),lv:S.lv,cls:S.cls,lootTier:Math.max(0,Math.min(4,Number(S.autoLootTier)||0))}}
function offlineEstimate(hours,snap){
 snap=snap||S.offline||{};
 const zi=Math.max(0,Math.min(ZN.length-1,Number(snap.z)!=null&&Number.isInteger(Number(snap.z))?Number(snap.z):Z));
 const zone=ZN[zi], list=[];
 // 以目前地圖的怪物模板做統計；離線收益是預估，不是即時戰鬥重播。
 zoneRoster(zi).forEach((t,j)=>{const jj=t.boss?3:Math.min(j,2),l=zone.lv+(jj?jj*2:0),hp=Math.max(1,({0:24,1:60,2:48,3:420}[jj]||24)*(1+Math.max(0,zone.lv-1)*.08)),exp=Rules.killExp(t,t.lv,false);list.push({l,hp,exp,boss:!!t.boss})});
 const nm=list.filter(m=>!m.boss),bs=list.find(m=>m.boss),avg=(nm.reduce((a,m)=>a+m.exp,0)/(nm.length||1))*(bs?.97:1)+(bs?bs.exp*.03:0); // Boss 出現率約 3%（與技能書擲骰一致）
 const avgHp=list.reduce((a,m)=>a+m.hp,0)/list.length;
 const calcCls=CL[snap.cls]?snap.cls:S.cls, calcLv=Math.max(1,Number(snap.lv)||S.lv);
 const dmg=Math.max(1,CL[calcCls].d[0]+calcLv+atkB());
 const attacks=Math.max(1,Math.ceil(avgHp/dmg));
 const secPerKill=Math.max(3.5,attacks*.95+1.2);
 const kills=Math.max(0,Math.floor(hours*3600/secPerKill));
 const exp=Math.round(kills*avg);
 const gold=Math.round(kills*5.5*(Math.max(1,zone.lv)+2));
 const itemChance=Math.min(.7,.3+zone.lv*.03), rawItems=Math.round(kills*itemChance*.82);
 const pots=Math.round(kills*.22);
 // 技能書：用本地圖怪物的等級逐隻擲骰（與線上掉落同一套規則），已擁有的不會重複
 const books=[];{const bst={cls:calcCls,lv:calcLv,books:Object.assign({},calcCls===S.cls?S.books:{})},ros=zoneRoster(zi),norm=ros.filter(t=>!t.boss),bos=ros.find(t=>t.boss);
  for(let i=0,n=Math.min(kills,20000);i<n;i++){const t=(bos&&Math.random()<.03)?bos:norm[Math.floor(Math.random()*norm.length)];
   const id=Skills.rollBook(bst,{T:{boss:t.boss?1:0},lvl:t.lv},zi,Math.random);if(id){bst.books[id]=1;books.push(id)}}}
 // 離線掛機沿用離開時的「裝備拾取階級」設定；低於門檻的裝備視為未拾取。
 const lootTier=Math.max(0,Math.min(4,Number(snap.lootTier!=null?snap.lootTier:S.autoLootTier)||0));
 const probs=[.55,.25,.13,.055,.015], tier=[0,0,0,0,0];
 for(let i=0;i<rawItems;i++){let rr=0,roll=Math.random();for(let j=0,c=0;j<5;j++){c+=probs[j];if(roll<c){rr=j;break}}if(rr>=lootTier)tier[rr]++;}
 const items=tier.reduce((a,b)=>a+b,0);
 return {hours,zone:zone.n,kills,exp,gold,items,pots,books,tier,secPerKill,lootTier};
}
function applyOfflineRewards(r){
 const beforeLv=S.lv,PRE=['粗製','精良','稀有','史詩','傳說'],tc=[0,0,0,0,0];let expGain=r.exp;S.exp+=expGain;let levels=0;
 while(S.lv<99&&S.exp>=nextExp()){S.exp-=nextExp();S.lv++;levels++}
 const gotBooks=(r.books||[]).filter(id=>Skills.giveBook(S,id));
 S.gold+=r.gold;const hpPot=Math.ceil(r.pots*.5),mpPot=Math.floor(r.pots*.5);S.pot+=hpPot;S.mpPot+=mpPot;
 let added=0,autoSold=0;
 for(let rr=0;rr<5;rr++) for(let n=0;n<r.tier[rr];n++){
   const slots=Object.keys(SLOTN),slot=slots[Math.floor(Math.random()*slots.length)],v=slot==='weapon'?(rr+1)*2+S.lv:slot==='armor'?(rr+1)*8+S.lv*2:slot==='boots'?(rr+1)*3:(rr+1)*2;
   const it={slot,r:rr,t:tierOf({lv:S.lv}),v:v,lv:S.lv,d:Math.random()<.5?1:0,name:''};it.t=rr;it.name=ITN(slot,it.t,it.d,S.cls);
   const ev=Loot.addItem(S,it);if(ev.type==='sold'||(ev.type==='equip'&&ev.soldOld))autoSold++;
   added++;tc[rr]++;
 }
 const result={hours:r.hours,zone:r.zone,kills:r.kills,exp:r.exp,gold:r.gold,items:added,tier:tc,hpPot,mpPot,books:gotBooks,beforeLv,afterLv:S.lv,levels,autoSold,lootTier:r.lootTier};
 say('離線 '+r.hours.toFixed(1)+' 小時：擊倒約 '+r.kills+' 隻怪，+'+r.exp+' EXP，+'+r.gold+' 金幣','離線','#7fe0ff');if(gotBooks.length)say('離線期間取得技能書：'+gotBooks.map(id=>Skills.get(id).n).join('、'),'掉落','#8ad0ff');renderSk();bagUI();eqUI();rebuild();save();return result;
}
function showOfflineResult(r){
 const tierNames=['粗製','精良','稀有','史詩','傳說'];
 $('offResult').innerHTML='<div class="offsummary">'+
   '<div class="offcard"><small>離線時間</small><b>'+r.hours.toFixed(1)+' 小時</b></div>'+
   '<div class="offcard"><small>擊倒怪物</small><b>'+r.kills+' 隻</b></div>'+
   '<div class="offcard"><small>獲得 EXP</small><b>+'+r.exp.toLocaleString()+'</b></div>'+
   '<div class="offcard"><small>獲得金幣</small><b>+'+r.gold.toLocaleString()+'</b></div></div>'+
   '<div class="offsection"><strong>📦 裝備掉落　×'+r.items+'</strong><div class="offhint">拾取設定：'+tierNames[r.lootTier]+' · 低於此階級的裝備不計入離線收益</div><div class="offgrid">'+tierNames.map((n,i)=>'<div class="offitem offtier'+i+'"><span>'+n+'</span><b>×'+r.tier[i]+'</b></div>').join('')+'</div></div>'+
   '<div class="offsection"><strong>🧪 消耗品</strong><div class="offgrid"><div class="offitem"><span>HP 水</span><b>+'+r.hpPot+'</b></div><div class="offitem"><span>MP 水</span><b>+'+r.mpPot+'</b></div><div class="offitem"><span>技能書</span><b>'+(r.books.length?r.books.map(id=>Skills.get(id).n).join('、'):'無')+'</b></div></div></div>'+
   '<div class="offsection"><strong>📈 角色變化</strong><div class="offgrid"><div class="offitem"><span>等級</span><b>'+r.beforeLv+(r.levels?' → '+r.afterLv:'（無升級）')+'</b></div><div class="offitem"><span>地圖</span><b>'+r.zone+'</b></div></div></div>'+
   (r.autoSold?'<div class="offfoot">背包空間不足：自動出售 '+r.autoSold+' 件裝備並轉換為金幣。</div>':'<div class="offfoot">本次離線收益已全部加入角色資料。</div>');
}
function offlineUI(){const o=S.offline,st=$('offStatus');if(!o||o.active){st.textContent=o&&o.active?'遊戲進行中：已持續保存離線恢復檢查點':'目前沒有待結算的離線收益';return}const elapsed=Math.min(12*3600,Math.max(0,(Date.now()-o.start)/1000));st.textContent='離線 '+(elapsed/3600).toFixed(1)+' / 12 小時　地圖：'+(ZN[o.z]||ZN[0]).n}
function offlineLootTier(){return Math.max(0,Math.min(4,Number(S.autoLootTier)||0))}
function markOfflineStart(){
 if(S.mode!=='play')return;
 S.offline={start:Date.now(),z:curZone(),lv:S.lv,cls:S.cls,lootTier:offlineLootTier(),active:false};
 save();
}
function offlineHeartbeat(){
 if(S.mode!=='play')return;
 // 每 5 秒保存一次「最後仍在遊戲中」時間。即使手機直接終止瀏覽器、沒有 pagehide，
 // 重新開啟時也能從最後檢查點開始計算離線時間。
 S.offline={start:Date.now(),z:curZone(),lv:S.lv,cls:S.cls,lootTier:offlineLootTier(),active:true};
 save();
}
function settleOffline(){
 if(!S.offline)return false;
 const sec=Math.min(12*3600,Math.max(0,(Date.now()-Number(S.offline.start||0))/1000));
 if(sec<=0){S.offline=null;save();return false}
 const hours=sec/3600;
 const pending=Object.assign({},S.offline);
 S.offline=null;
 const r=offlineEstimate(hours,pending);
 const result=applyOfflineRewards(r);
 showOfflineResult(result);
 $('offStatus').textContent='本次離線收益已結算';
 $('offm').classList.add('o');
 save();
 return true;
}
$('offX').onclick=()=>{$('offm').classList.remove('o')};
// 不需要手動按鈕：離開頁面時自動開始計時，下次進入遊戲時自動結算。
let offlinePageExitGuard=false;
function markOfflinePageExit(){
 if(offlinePageExitGuard)return;
 offlinePageExitGuard=true;
 markOfflineStart();
}
// 切到另一個瀏覽器分頁／視窗、最小化瀏覽器或手機切到其他 App 時，
// document.visibilityState 會變成 hidden；這才是「玩家暫時離開遊戲」的離線掛機起點。
let offlineHiddenAt=0;
document.addEventListener('visibilitychange',()=>{
 if(document.visibilityState==='hidden'){
   offlineHiddenAt=Date.now();
   markOfflinePageExit();
   return;
 }
 if(document.visibilityState==='visible'){
   offlinePageExitGuard=false;
   if(offlineHiddenAt && S.mode==='play' && S.offline && !S.offline.active){
     settleOffline();
   }
   offlineHiddenAt=0;
 }
});
// 真正離開／關閉目前文件時也保留離線計時；BFCache 不在這裡重複建立。
window.addEventListener('pagehide',(e)=>{
 if(e && e.persisted)return;
 markOfflinePageExit();
});
window.addEventListener('pageshow',(e)=>{
 if(e && e.persisted){
   offlinePageExitGuard=false;
   if(S.mode==='play' && S.offline && !S.offline.active)settleOffline();
 }
});

// 手機直接關閉／被系統回收時，pagehide 不一定有機會執行。
// 因此開啟頁面後自動恢復上一個已存在角色，不再要求玩家手動按「繼續遊戲」。
function autoResumeSavedGame(){
 if(S.mode==='play')return;
 const btn=$('ct');
 if(!btn||btn.style.display==='none')return;
 try{btn.click()}catch(e){console.error('自動恢復角色失敗',e)}
}
// 等待本頁所有 script 初始化完成後再恢復，避免 enterZone / UI 尚未建立。
setTimeout(autoResumeSavedGame,0);
