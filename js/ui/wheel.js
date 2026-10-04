/* 手機半圓輪：攻擊鍵＋技能圓框＋藥水、對話框圖示化、提示條
   版面座標來自 wheel-layout.js；這裡只負責寫入 CSS 變數與互動。僅在「手機」模式啟用。 */
(function(){
 const B=document.body,root=document.documentElement,el=id=>document.getElementById(id);
 const isPhone=()=>B.classList.contains('dev-phone');
 /* ---------- 建立元件 ---------- */
 const atk=document.createElement('button');atk.id='atkBtn';atk.type='button';atk.setAttribute('aria-label','攻擊');atk.textContent='⚔️';
 const mkPot=(id,t)=>{const b=document.createElement('button');b.id=id;b.type='button';b.className='potBtn';b.setAttribute('aria-label',(t=='hp'?'HP':'MP')+'藥水');b.innerHTML=potIconImg(t)+'<b>0</b>';return b};
 const potHp=mkPot('potHp','hp'),potMp=mkPot('potMp','mp');
 const chatBtn=document.createElement('button');chatBtn.id='chatBtn';chatBtn.type='button';chatBtn.setAttribute('aria-label','對話框');chatBtn.innerHTML='💬<span class="dot"></span>';
 const toast=document.createElement('div');toast.id='toast';
 B.append(atk,potHp,potMp,chatBtn,toast);
 const chat=el('chat');
 const closeB=document.createElement('button');closeB.id='chClose';closeB.type='button';closeB.textContent='✕';closeB.title='關閉';
 el('chTabs').appendChild(closeB);
 /* 橫向：對話框可收合（只剩一個小標籤），狀態會記住 */
 const foldB=document.createElement('button');foldB.id='chFold';foldB.type='button';foldB.title='收合／展開';
 el('chTabs').appendChild(foldB);
 const FK='ainoChatFold';
 function setFold(on){B.classList.toggle('chat-fold',on);foldB.textContent=on?'💬 ▴':'▾';try{localStorage.setItem(FK,on?'1':'0')}catch(_){}if(!on){try{chRender()}catch(_){}}}
 let f0=false;try{f0=localStorage.getItem(FK)==='1'}catch(_){}
 setFold(f0);
 foldB.onclick=e=>{e.stopPropagation();setFold(!B.classList.contains('chat-fold'))};
 /* 橫向：透明模式（無底板、只顯示文字，觸控穿透到遊戲），狀態會記住 */
 const fadeB=document.createElement('button');fadeB.id='chFade';fadeB.type='button';fadeB.title='透明／實心';fadeB.textContent='◐';
 el('chTabs').insertBefore(fadeB,foldB);
 const TK='ainoChatClear';
 function setClear(on){B.classList.toggle('chat-clear',on);try{localStorage.setItem(TK,on?'1':'0')}catch(_){}}
 let t0=false;try{t0=localStorage.getItem(TK)==='1'}catch(_){}
 setClear(t0);
 fadeB.onclick=e=>{e.stopPropagation();setClear(!B.classList.contains('chat-clear'))};
 /* ---------- 版面 ---------- */
 const probe=document.createElement('div');
 probe.style.cssText='position:fixed;left:0;top:0;width:0;height:0;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)';
 B.appendChild(probe);
 const px=n=>Math.round(n*10)/10+'px',set=(k,v)=>root.style.setProperty(k,v);
 let lastSig='';
 function layout(){
  if(!isPhone())return;
  const W=innerWidth,H=innerHeight,land=W>H,c=getComputedStyle(probe);
  const sa={t:parseFloat(c.paddingTop)||0,r:parseFloat(c.paddingRight)||0,b:parseFloat(c.paddingBottom)||0,l:parseFloat(c.paddingLeft)||0};
  B.classList.toggle('ph-land',land);B.classList.toggle('ph-port',!land);
  const sig=[W,H,sa.t,sa.r,sa.b,sa.l].join();if(sig===lastSig)return;lastSig=sig;
  const L=WheelLayout.calc(W,H,sa,land);
  set('--skS',px(L.K));set('--atS',px(L.A));set('--ptS',px(L.P));set('--R',px(L.R));set('--cx',px(L.cx));set('--cy',px(L.cy));set('--wTop',px(L.wTop));
  L.sk.forEach((p,i)=>{set('--x'+(i+1),px(p.x));set('--y'+(i+1),px(p.y))});
  set('--ax',px(L.atk.x));set('--ay',px(L.atk.y));set('--hx',px(L.hp.x));set('--hy',px(L.hp.y));set('--mx',px(L.mp.x));set('--my',px(L.mp.y));
 }
 /* ---------- 攻擊：鎖定最近的怪，主角會自己追過去普攻；按住＝連續鎖定下一隻 ---------- */
 const live=()=>S.tm&&!S.tm.dead;
 function nearest(maxD){let best=null,md=maxD||40;const hp=hero.position;
  mons.forEach(m=>{if(m.dead)return;const d=m.g.position.distanceTo(hp);if(d<md){md=d;best=m}});return best}
 function lockNearest(){const m=nearest();if(!m)return false;S.tm=m;S.dest=null;try{mk2.visible=false}catch(_){}return true}
 let noMonAt=0;
 function doAttack(){
  if(S.mode!='play'||!isPhone())return;
  if(live())return;
  if(!lockNearest()){const n=performance.now();if(n-noMonAt>1500){noMonAt=n;showToast('附近沒有怪物')}}
 }
 let holdT=null;
 const stopHold=()=>{if(holdT){clearInterval(holdT);holdT=null}atk.classList.remove('hold')};
 atk.addEventListener('pointerdown',e=>{e.preventDefault();try{atk.setPointerCapture(e.pointerId)}catch(_){}
  atk.classList.add("hold");doAttack();holdT=setInterval(doAttack,300);atk.classList.add('hold')});
 ['pointerup','pointercancel','lostpointercapture'].forEach(t=>atk.addEventListener(t,stopHold));
 atk.addEventListener('contextmenu',e=>e.preventDefault());
 /* 需要目標的技能：沒有目標時先自動鎖定最近的怪 */
 el('skb').addEventListener('click',e=>{
  if(!isPhone()||S.mode!='play')return;
  const b=e.target.closest('button[data-s]');if(!b)return;
  const sk=Skills.get(b.dataset.s);if(!sk)return;
  if((sk.k=='hit'||(sk.k=='aoe'&&sk.at))&&!live())lockNearest();
 },true);
 /* ---------- 藥水 ---------- */
 potHp.onclick=()=>usePot();potMp.onclick=()=>useMpPot();
 /* 背包內點藥水：手機沒有快捷欄，直接使用 */
 el('bag').addEventListener('click',e=>{
  if(!isPhone())return;const b=e.target.closest('button[data-p]');if(!b)return;
  e.stopImmediatePropagation();b.dataset.p==='hp'?usePot():useMpPot();
 },true);
 /* ---------- 對話框：圖示按下才彈出 ---------- */
 let unread=0;
 function setOpen(on){
  chat.classList.toggle('open',on);chatBtn.classList.toggle('open',on);B.classList.toggle('chat-open',on);
  if(on){unread=0;chatBtn.classList.remove('unread');chRender();chatStats()}
 }
 chatBtn.onclick=()=>setOpen(!chat.classList.contains('open'));
 closeB.onclick=e=>{e.stopPropagation();setOpen(false)};
 document.addEventListener('pointerdown',e=>{
  if(!isPhone()||!chat.classList.contains('open'))return;
  if(chat.contains(e.target)||chatBtn.contains(e.target))return;
  setOpen(false)});
 /* ---------- 提示條 ---------- */
 let tt=null;
 function showToast(t){toast.textContent=t;toast.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>toast.classList.remove('show'),2600)}
 const _lm=window.logMsg;
 window.logMsg=function(c,t,col){_lm(c,t,col);
  if(!isPhone()||S.mode!='play')return;
  const open=chat.classList.contains('open');
  if(c!=='戰鬥'&&!open){unread=Math.min(unread+1,9);chatBtn.querySelector('.dot').textContent=unread>=9?'9+':unread;chatBtn.classList.add('unread')}
  if(!open&&(c==='系統'||c==='技能'||c==='背包'||(c==='掉落'&&!/^獲得/.test(t))))showToast(t)};
 /* ---------- 狀態同步（藥水數量、攻擊鍵鎖定狀態） ---------- */
 let cHp=-1,cMp=-1,cOn=null;
 setInterval(()=>{
  if(!isPhone()||S.mode!='play')return;
  if(S.pot!==cHp){cHp=S.pot;potHp.querySelector('b').textContent=S.pot;potHp.classList.toggle('zero',!S.pot)}
  if(S.mpPot!==cMp){cMp=S.mpPot;potMp.querySelector('b').textContent=S.mpPot;potMp.classList.toggle('zero',!S.mpPot)}
  const on=!!live();if(on!==cOn){cOn=on;atk.classList.toggle('on',on)}
 },150);
 /* ---------- 模式／方向切換 ---------- */
 new MutationObserver(()=>{layout();if(!isPhone())setOpen(false)}).observe(B,{attributes:true,attributeFilter:['class']});
 addEventListener('resize',()=>{lastSig='';layout()});
 addEventListener('orientationchange',()=>setTimeout(()=>{lastSig='';layout()},250));
 layout();
})();
