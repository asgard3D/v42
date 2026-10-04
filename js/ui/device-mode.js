/* 裝置介面模式（手機／平板／電腦）與浮動搖桿 */
// ================= 裝置介面模式（自動偵測 / 手機 / 平板 / 電腦）=================
(function(){
 const KEY='ainoDevMode',NAME={phone:['📱','手機'],tablet:['📟','平板'],desktop:['🖥️','電腦']};
 let pref='auto',cur='';
 try{pref=localStorage.getItem(KEY)||'auto'}catch(_){}
 if(pref!=='auto'&&!NAME[pref])pref='auto';
 const coarse=()=>{try{return matchMedia('(pointer:coarse)').matches}catch(_){return 'ontouchstart' in window}};
 function detect(){
  const w=innerWidth,short=Math.min(innerWidth,innerHeight);
  if(coarse())return short<600?'phone':'tablet';
  return w<700?'phone':(w<1000?'tablet':'desktop');
 }
 function sync(){
  document.querySelectorAll('.devSw button').forEach(b=>{
   const v=b.dataset.dev;b.classList.toggle('on',v===pref);
   if(v==='auto'){const s=b.querySelector('small');if(s)s.textContent=pref==='auto'?NAME[cur][1]:''}
  });
 }
 function apply(){
  /* 平板（直向／橫向）使用與手機相同的介面 */
  const m0=pref==='auto'?detect():pref,m=m0==='tablet'?'phone':m0,changed=m!==cur;
  if(changed){
   cur=m;
   document.body.classList.remove('dev-phone','dev-tablet','dev-desktop');
   document.body.classList.add('dev-'+m);
   try{ren.setPixelRatio(Math.min(devicePixelRatio,m==='phone'?1.5:2))}catch(_){}
   try{cmD=m==='phone'?20:m==='tablet'?18:16}catch(_){}
   const ch=document.getElementById('chat');
   if(ch){ch.classList.remove('min');ch.classList.remove('open');document.body.classList.remove('chat-open');
    if(m==='phone'){/* 手機：對話框改為圖示彈出，清掉拖曳留下的位置 */ch.style.left=ch.style.top=ch.style.bottom=ch.style.right=''}}
   resetJoy();
  }
  try{rs()}catch(_){}
  sync();
 }
 function build(box){
  box.innerHTML='<button data-dev="auto"><i style="font-style:normal">🔄</i><br>自動<small></small></button>'+
   Object.keys(NAME).map(k=>'<button data-dev="'+k+'"><i style="font-style:normal">'+NAME[k][0]+'</i><br>'+NAME[k][1]+'</button>').join('');
  box.onclick=e=>{
   const b=e.target.closest('button[data-dev]');if(!b)return;
   pref=b.dataset.dev;try{localStorage.setItem(KEY,pref)}catch(_){}
   apply();
   try{say('介面模式：'+(pref==='auto'?'自動（'+NAME[cur][1]+'）':NAME[pref][1]))}catch(_){}
  };
 }
 // 功能表內的切換區
 const mp=document.getElementById('menuPanel');
 if(mp){
  const sec=document.createElement('div');sec.className='menuSec';sec.id='menuDev';
  sec.innerHTML='<b>介面模式</b><div class="devSw"></div>';
  mp.insertBefore(sec,mp.children[1]||null);build(sec.querySelector('.devSw'));
 }
 // 角色建立畫面內的切換區
 const go=document.getElementById('go');
 if(go){
  const w=document.createElement('div');
  w.innerHTML='<div class="lb">介面模式</div><div class="devSw"></div>';
  go.parentNode.insertBefore(w,go);build(w.querySelector('.devSw'));
 }
 // 浮動虛擬搖桿：平常透明，按住觸發區才在手指位置出現
 const zone=document.getElementById('joyZone'),joy=document.getElementById('joy'),knob=joy.firstElementChild;let jid=null,cx=0,cy=0;
 function setK(l,r,u,d){K.ArrowLeft=l;K.ArrowRight=r;K.ArrowUp=u;K.ArrowDown=d}
 function resetJoy(){jid=null;joy.classList.remove('act');knob.style.transform='';try{setK(0,0,0,0)}catch(_){}}
 function jmove(e){
  const R=joy.offsetWidth/2;let dx=e.clientX-cx,dy=e.clientY-cy;const d=Math.hypot(dx,dy);
  if(d>R*.7){dx*=R*.7/d;dy*=R*.7/d}
  knob.style.transform='translate('+dx+'px,'+dy+'px)';
  if(d<R*.22){setK(0,0,0,0);return}
  const nx=dx/d,ny=dy/d;
  setK(nx<-.38?1:0,nx>.38?1:0,ny<-.38?1:0,ny>.38?1:0);
 }
 zone.addEventListener('pointerdown',e=>{e.preventDefault();jid=e.pointerId;try{zone.setPointerCapture(jid)}catch(_){}
  const R=joy.offsetWidth/2;cx=Math.max(R,Math.min(innerWidth-R,e.clientX));cy=Math.max(R,Math.min(innerHeight-R,e.clientY));
  joy.style.left=cx+'px';joy.style.top=cy+'px';joy.classList.add('act');jmove(e)});
 zone.addEventListener('pointermove',e=>{if(e.pointerId===jid)jmove(e)});
 ['pointerup','pointercancel','lostpointercapture'].forEach(t=>zone.addEventListener(t,e=>{if(e.pointerId===jid)resetJoy()}));
 zone.addEventListener('contextmenu',e=>e.preventDefault());
 // 對話框可拖曳（拖曳把手；雙擊把手還原預設位置），位置會記住
 const chat=document.getElementById('chat');
 if(chat){
  const hd=document.createElement('div');hd.id='chDrag';hd.textContent='⋯ 拖曳移動 ⋯';hd.title='拖曳移動對話框，雙擊還原';
  chat.insertBefore(hd,chat.firstChild);
  const PK='ainoChatPos';let drag=null;
  const place=(x,y)=>{const w=chat.offsetWidth,hh=chat.offsetHeight;
   x=Math.max(0,Math.min(innerWidth-w,x));y=Math.max(0,Math.min(innerHeight-hh,y));
   chat.style.left=x+'px';chat.style.top=y+'px';chat.style.bottom='auto';chat.style.right='auto';return[x,y]};
  try{const sp=JSON.parse(localStorage.getItem(PK)||'null');if(sp)place(sp[0],sp[1])}catch(_){}
  hd.addEventListener('pointerdown',e=>{e.preventDefault();const r=chat.getBoundingClientRect();drag={id:e.pointerId,ox:e.clientX-r.left,oy:e.clientY-r.top};try{hd.setPointerCapture(e.pointerId)}catch(_){}});
  hd.addEventListener('pointermove',e=>{if(drag&&e.pointerId===drag.id)place(e.clientX-drag.ox,e.clientY-drag.oy)});
  const end=e=>{if(!drag||e.pointerId!==drag.id)return;drag=null;const r=chat.getBoundingClientRect();try{localStorage.setItem(PK,JSON.stringify([r.left,r.top]))}catch(_){}};
  hd.addEventListener('pointerup',end);hd.addEventListener('pointercancel',end);
  hd.addEventListener('dblclick',()=>{chat.style.left=chat.style.top=chat.style.bottom=chat.style.right='';try{localStorage.removeItem(PK)}catch(_){}});
  addEventListener('resize',()=>{if(chat.style.top){const r=chat.getBoundingClientRect();place(r.left,r.top)}});
 }
 addEventListener('resize',apply);addEventListener('orientationchange',()=>setTimeout(apply,200));
 apply();
 window.setDeviceMode=m=>{pref=m;try{localStorage.setItem(KEY,m)}catch(_){}apply()};
})();
