/* 快捷欄與技能施放 */
// ---------- quick bar ----------
let skb=[],qPage=0;
const QPAGES=3,QSIZE=10;
function renderSk(){
 const w=$('sks');w.innerHTML='';skb=[];
 if(!Array.isArray(S.quick))S.quick=Array(30).fill(null);
 while(S.quick.length<30)S.quick.push(null);
 for(let i=0;i<30;i++){if(S.quick[i]!=='pot'&&S.quick[i]!=='mpPot')S.quick[i]=null;}
 const prev=document.createElement('button');prev.className='qp';prev.textContent='‹';prev.title='上一頁';prev.onclick=()=>{qPage=(qPage+QPAGES-1)%QPAGES;renderSk()};w.appendChild(prev);
 for(let slot=0;slot<QSIZE;slot++){
   const idx=qPage*QSIZE+slot, a=S.quick[idx];
   const isPot=a==='pot',isMpPot=a==='mpPot';
   const b=document.createElement('button');b.className='qb'+((isPot||isMpPot)?'':' empty')+((isPot||isMpPot)?' potSlot':'');
   b.innerHTML='<span class="qn">'+((slot+1)%10)+'</span>'+((isPot||isMpPot)?'<span class="qi">'+potIconImg(isMpPot?'mp':'hp')+'</span><span class="qc">'+(isMpPot?'MP':'HP')+' ×'+(isMpPot?S.mpPot:S.pot)+'</span>':'<span class="qc">—</span>');
   b.title=isPot?'HP藥水 ×'+S.pot+'｜快捷鍵 '+((slot+1)%10):isMpPot?'MP藥水 ×'+S.mpPot+'｜快捷鍵 '+((slot+1)%10):'空快捷欄｜點擊開啟背包';
   b.disabled=false;b.style.pointerEvents='auto';
   b.onclick=()=>{
   if(isMpPot){useMpPot();return;}
   if(isPot){usePot();return;}
   // 空快捷格：記住目標格並直接開啟背包。
   quickTarget=idx;quickAssign=false;mpQuickAssign=false;
   $('bag').classList.add('o');
   bagUI();
   say('已選擇快捷欄 '+((slot+1)%10)+'，請在背包點選 HP水或 MP水');
 };
   b.oncontextmenu=e=>{e.preventDefault();if(S.quick&&S.quick[idx]){S.quick[idx]=null;renderSk();save();say('已清除快捷欄 '+((slot+1)%10))}};
   w.appendChild(b);skb.push(b);
 }
 const pg=document.createElement('button');pg.className='qpage';pg.innerHTML='<b>'+(qPage+1)+'</b>/'+QPAGES;pg.title='點擊切換頁面';pg.onclick=()=>{qPage=(qPage+1)%QPAGES;renderSk()};w.appendChild(pg);
 const next=document.createElement('button');next.className='qp';next.textContent='›';next.title='下一頁';next.onclick=()=>{qPage=(qPage+1)%QPAGES;renderSk()};w.appendChild(next);
}

/* 施放技能（id 為技能代號）。成功施放回傳 true。數值由 Skills（core/skills.js）依技能等級計算 */
const SK_KEYS=['KeyQ','KeyW','KeyE','KeyZ','KeyX','KeyC'],SK_KEYN=['Q','W','E','Z','X','C'];
function useSk(id){if(S.mode!='play')return false;const sk=Skills.get(id);if(!sk||sk.cls!==S.cls||!Skills.isActive(sk))return false;
 const L=Skills.level(S,id);if(!L){say('尚未學會「'+sk.n+'」：按 K 開啟技能樹投入技能點');return false}
 if(!Skills.condOk(sk,S.hp,maxHp())){say('「'+sk.n+'」需要 HP 低於 30% 才能使用');return false}
 const mp=Skills.mpCost(sk,L,S);if(S.mp<mp){say('MP 不足（需要 '+mp+'）','系統','#7fb7ff');return false}
 if(Number(S.skcd[id]||0)>0)return false;
 const cl=CL[S.cls],tm=S.tm&&!S.tm.dead?S.tm:null,hp=hero.position,eff=Object.assign({},sk,{m:Skills.mult(sk,L)}),dm=()=>Rules.skillDamage(S,cl,eff,Math.random);
 if(sk.k=='hit'){if(!tm){say('先點選一隻怪物');return false}
  if(hp.distanceTo(tm.g.position)>sk.r){say('距離太遠');return false}
  skFx(sk,tm,hp);if(sk.dash){ring(hp,sk.col,2);const d=hp.clone().sub(tm.g.position).setY(0).normalize();hero.position.copy(tm.g.position).addScaledVector(d,1.3)}
  for(let h=0;h<(sk.hits||1);h++)setTimeout(()=>hit(tm,dm()),h*150)}
 else if(sk.k=='aoe'){if(sk.at&&!tm){say('先點選一隻怪物');return false}
  if(sk.at&&sk.r&&hp.distanceTo(tm.g.position)>sk.r){say('距離太遠');return false}
  const c=sk.at?tm.g.position.clone():hp.clone();if(!SKFX[sk.id])ring(c,sk.col,sk.rad);skFx(sk,tm,c);
  setTimeout(()=>mons.forEach(m=>{if(!m.dead&&m.g.position.distanceTo(c)<sk.rad)hit(m,dm())}),sk.at?450:0)}
 else if(sk.k=='heal'){const h=Rules.healAmount(S,Skills.healPct(sk,L));S.hp=Math.min(maxHp(),S.hp+h);fl(hp,'+'+h,'#7fff9a');ring(hp,0x66ff99,2.5);skFx(sk,null,hp)}
 else if(sk.k=='buff'){const m0=maxHp(),{pw}=Skills.applyBuff(S,sk,L);
  if(pw.hp)S.hp=Math.min(maxHp(),S.hp+(maxHp()-m0));/* 最大 HP 增益同時補上增加的量 */
  ring(hp,sk.col,2.5);fl(hp,sk.n,'#ffe9a0');skFx(sk,null,hp)}
 else return false;
 Sfx.skill(sk);S.mp-=mp;S.skcd[id]=Skills.cooldown(sk,L);S.atk=.0001;S.fT=.9;S.pd=!S.pd;say('施放 '+sk.n+' Lv.'+L,'戰鬥','#ffe9a0');return true}
/* 技能列快捷鍵：Q W E Z X C 對應技能列 1~6 格 */
addEventListener('keydown',e=>{const i=SK_KEYS.indexOf(e.code);if(i>=0&&document.activeElement.tagName!='INPUT'&&S.mode=='play'&&S.sbar&&S.sbar[i])useSk(S.sbar[i])});
