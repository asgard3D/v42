/* HUD 與創角介面 */
// ---------- UI ----------
function ui(){
 const isCreate=S.mode==='create';
 document.body.classList.toggle('create',isCreate);
 $('autoBtn').style.display=isCreate?'none':'flex';
 $('lv').textContent='Lv.'+S.lv;
 const bf=[S.buff.atk>0?'⚔':'',S.buff.spd>0?'💨':'',S.buff.def>0?'🛡':''].join('');
 $('cn').textContent=S.name+'・'+CL[S.cls].n+' '+bf;
 $('hp').firstChild.style.width=Math.max(0,S.hp/maxHp()*100)+'%';$('mp').firstChild.style.width=Math.max(0,S.mp/maxMp()*100)+'%';$('xp').firstChild.style.width=S.exp/nextExp()*100+'%';$('xp').dataset.p=(Math.floor(Math.max(0,S.exp/nextExp()*100)*10)/10).toFixed(1)+'%';
 $('hp').lastChild.textContent='HP '+Math.max(0,Math.ceil(S.hp))+' / '+maxHp();$('mp').lastChild.textContent='MP '+Math.max(0,Math.floor(S.mp))+' / '+maxMp();$('xp').lastChild.textContent='EXP '+S.exp+' / '+nextExp()+'（'+Math.floor(S.exp/nextExp()*100)+'%）';asSync();
 [...document.querySelectorAll('[data-k]')].forEach(b=>b.classList.toggle('on',b.dataset.k==S.cls));
 [...document.querySelectorAll('[data-h]')].forEach(b=>b.classList.toggle('on',b.dataset.h==S.hs));
 [...document.querySelectorAll('[data-c]')].forEach(b=>b.style.outline=b.dataset.c==S.hc?'2px solid #e9c880':'none');
 $('cd').textContent=DESC[S.cls];b3.innerHTML='<i>⚔️</i><span>自動戰鬥 '+(S.auto?'開':'關')+'</span>';b3.classList.toggle('on',!!S.auto);skUI();$('autoBtn').textContent='AUTO';$('autoBtn').classList.toggle('on',!!S.auto);eqUI();chatStats()}
Object.keys(CL).forEach(k=>{const b=document.createElement('button');b.textContent=CL[k].n;b.dataset.k=k;b.onclick=()=>{S.cls=k;rebuild()};$('cc').appendChild(b)});
HS.forEach((n,i)=>{const b=document.createElement('button');b.textContent=n;b.dataset.h=i;b.onclick=()=>{S.hs=i;rebuild()};$('ch').appendChild(b)});
HC.forEach((c,i)=>{const b=document.createElement('button');b.className='sw';b.dataset.c=i;b.setAttribute('aria-label',HC_NAME[i]||('髮色'+(i+1)));b.title=HC_NAME[i]||('髮色'+(i+1));b.style.background='linear-gradient(135deg,#'+c[0].toString(16).padStart(6,'0')+' 0%,#'+c[1].toString(16).padStart(6,'0')+' 100%)';b.onclick=()=>{S.hc=i;rebuild()};$('cs').appendChild(b)});
['cc','ch','cs'].forEach(id=>$(id).className='row');
document.addEventListener('keydown',e=>{if(S.mode!='play'||document.activeElement.tagName=='INPUT')return;const k=e.key==='0'?9:(e.key>='1'&&e.key<='9'?Number(e.key)-1:-1);if(k>=0){e.preventDefault();const a=S.quick&&S.quick[qPage*QSIZE+k];if(a==='pot')usePot();else if(a==='mpPot')useMpPot();}});
