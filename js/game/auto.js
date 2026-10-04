/* 自動戰鬥 */
function autoAct(){const hp=hero.position;{const nw=performance.now();if(nw-lastAP>700){if(S.autoHp>0&&S.hp<maxHp()*S.autoHp/100&&S.pot>0){usePot();lastAP=nw}else if(S.autoMp>0&&S.mp<maxMp()*S.autoMp/100&&S.mpPot>0){useMpPot();lastAP=nw}}}let tm=S.tm&&!S.tm.dead?S.tm:null;
 if(!tm&&!S.dest){
  // AUTO 戰鬥只負責找怪，不會因為附近沒有怪而自己跑去撿掉落物或亂走。
  let b=null,md=90;
  mons.forEach(m=>{
    if(m.dead||(m.T.boss&&S.lv<ZN[Z].lv+6))return;
    const d=m.g.position.distanceTo(hp);
    if(d<md){md=d;b=m}
  });
  if(b){S.tm=b;tm=b}
 }
 /* 依技能列順序，每次最多施放一個技能 */
 (S.sbar||[]).some(id=>{if(!id)return false;const sk=Skills.get(id),L=Skills.level(S,id);
  if(!sk||!L||S.skcd[id]>0||S.mp<Skills.mpCost(sk,L,S)||!Skills.condOk(sk,S.hp,maxHp()))return false;
  if(sk.k=='heal')return S.hp<maxHp()*.55&&useSk(id);
  if(sk.k=='buff'){if(sk.cond=='lowhp')return !!tm&&useSk(id);
   const on=Object.keys(sk.buf).every(k=>S.buff[k]>0);return !!tm&&!on&&hp.distanceTo(tm.g.position)<8&&useSk(id)}
  if(!tm)return false;
  if(sk.k=='hit')return hp.distanceTo(tm.g.position)<=sk.r&&useSk(id);
  const near=mons.filter(m=>!m.dead&&m.g.position.distanceTo(hp)<sk.rad).length;
  return (sk.at?hp.distanceTo(tm.g.position)<(sk.r||9):near>=(tm.T.boss?1:2))&&useSk(id)})}
const b3=document.createElement('button');b3.textContent='自動戰鬥';b3.onclick=()=>{S.auto=!S.auto;ui()};tb.appendChild(b3);
$('autoBtn').onclick=()=>{S.auto=!S.auto;ui()};
[['背包 B',()=>{$('bag').classList.toggle('o');bagUI()}],['藥水 R',()=>usePot()],['重置視角',()=>{cmY=.785;cmP=.75;cmD=16}]].forEach(([t,f])=>{const b=document.createElement('button');b.textContent=t;b.onclick=f;tb.appendChild(b)});
addEventListener('keydown',e=>{if(e.code=='KeyA'&&document.activeElement.tagName!='INPUT'&&S.mode=='play'){S.auto=!S.auto;ui()}});
