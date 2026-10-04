/* 技能樹介面（類似 RO，但沒有轉職）＋ 技能列
   - 技能樹：節點依「前置技能」連線；技能書掉落後才能學，升級消耗技能點（每升 1 級 +1 點）
   - 技能列：6 格（Q W E Z X C），只放已學會的主動技能；被動技能學會即生效
   規則一律呼叫 Skills（core/skills.js），這裡只負責畫面 */
const SKC=70,SKR=80,SKP=8,SKN=56;
let skSel=null,skTreeSig='',skBarSig='';
const skPts=()=>Skills.points(S);
const dropLine=s=>{const mn=Skills.dropMinLv(s),zi=Skills.skillZoneIndex(s.lv),bp=Math.min(60,s.dp*5);
 return '「'+(ZN[zi]?.n||'對應等級地圖')+'」限定（怪物 Lv.'+mn+' 以上；一般 '+s.dp+'%／Boss '+bp+'%'+(bp>=60?' 上限':'')+'）'};
function skState(s){const L=Skills.level(S,s.id);
 if(L>=s.max)return'max';if(L>0)return Skills.canLearn(S,s.id).ok?'on ok':'on';
 if(!Skills.hasBook(S,s.id))return'nobook';return Skills.canLearn(S,s.id).ok?'ok':'wait'}
function skTreeHTML(){
 const list=Skills.list(S.cls);let mr=0,mc=0;list.forEach(s=>{mr=Math.max(mr,s.pos[1]);mc=Math.max(mc,s.pos[0])});
 const W=mc*SKC+SKN+SKP*2,H=mr*SKR+SKN+SKP*2,cx=s=>SKP+s.pos[0]*SKC+SKN/2,cy=s=>SKP+s.pos[1]*SKR+SKN/2;
 const lines=list.map(s=>s.pre.map(([pid,pl])=>{const p=Skills.get(pid);return '<line class="'+(Skills.level(S,pid)>=pl?'on':'')+'" x1="'+cx(p)+'" y1="'+cy(p)+'" x2="'+cx(s)+'" y2="'+cy(s)+'"/>'}).join('')).join('');
 const nodes=list.map(s=>{const L=Skills.level(S,s.id);
  return '<button class="skn '+skState(s)+(skSel===s.id?' sel':'')+(S.sbar.includes(s.id)?' inbar':'')+'" data-n="'+s.id+'" style="left:'+(SKP+s.pos[0]*SKC)+'px;top:'+(SKP+s.pos[1]*SKR)+'px" title="'+s.n+'"><i>'+s.ic+'</i><b>'+L+'/'+s.max+'</b><small>Lv.'+s.lv+'</small></button>'}).join('');
 return '<div class="sktree" style="width:'+W+'px;height:'+H+'px"><svg width="'+W+'" height="'+H+'">'+lines+'</svg>'+nodes+'</div>'}
function skDetailHTML(){
 const s=skSel&&Skills.get(skSel);if(!s||s.cls!==S.cls)return '<div class="skdt skhint">點選技能查看說明。<br>技能書由怪物掉落，取得後即可用技能點學習；有金色光暈的技能現在就能升級。</div>';
 const L=Skills.level(S,s.id),have=Skills.hasBook(S,s.id),cn=Skills.canLearn(S,s.id),act=Skills.isActive(s);
 const need=s.pre.map(([pid,pl])=>{const p=Skills.get(pid),ok=Skills.level(S,pid)>=pl;return '<span class="'+(ok?'ok':'no')+'">'+(ok?'✔':'✖')+' '+p.n+' Lv.'+pl+'</span>'}).join('')||'<span class="ok">無</span>';
 let h='<div class="skdt"><div class="skh"><span class="skic2">'+s.ic+'</span><div><b>'+s.n+'</b> <em class="tag">'+s.cat+(s.k==='passive'?'・被動':'')+'</em>'+(SK_ELEM[s.elem]?' <em class="tag">'+SK_ELEM[s.elem]+'</em>':'')+'<br><small>等級 '+L+' / '+s.max+(act?'　CD '+Skills.cooldown(s,Math.max(1,L))+' 秒・MP '+Skills.mpCost(s,Math.max(1,L),S):'')+'</small></div></div>'+
  '<div class="skd">'+s.desc+'</div>'+
  '<div class="skl"><span>目前</span>'+(L?Skills.describe(s,L):'—')+'</div>'+
  (L<s.max?'<div class="skl"><span>下一級</span>'+Skills.describe(s,L+1)+'</div>':'<div class="skl"><span>狀態</span>已達等級上限</div>')+
  '<div class="skl"><span>需求</span>角色 Lv.'+s.lv+(S.lv>=s.lv?' ✔':' ✖')+'　'+need+'</div>'+
  '<div class="skl"><span>技能書</span>'+(have?'<span class="ok">✔ 已取得</span>':'<span class="no">✖ 未取得</span>')+'<br><small>'+dropLine(s)+'</small></div>'+
  '<div class="skb2"><button data-up'+(cn.ok?'':' disabled')+'>'+(L?'升級':'學習')+'（1 點）</button>'+(cn.ok||L>=s.max?'':'<small class="no">'+cn.why+'</small>')+'</div>';
 if(act&&L>0){h+='<div class="skl"><span>技能列</span><div class="slots">'+S.sbar.map((id,i)=>'<button data-slot="'+i+'" class="'+(id===s.id?'on':'')+'" title="'+(id?Skills.get(id).n:'空')+'">'+SK_KEYN[i]+'<small>'+(id&&id!==s.id?Skills.get(id).ic:id===s.id?'●':'＋')+'</small></button>').join('')+'<button data-clr'+(S.sbar.includes(s.id)?'':' disabled')+'>移除</button></div></div>'}
 else if(!act&&L>0)h+='<div class="skl"><span>效果</span>被動技能，已自動生效</div>';
 return h+'</div>'}
function skPanelHTML(){const cl=CL[S.cls],p=skPts();
 return '<div class="bh"><b style="color:var(--gold)">🌳 '+cl.n+'技能樹</b><span class="skpts'+(p?' has':'')+'">技能點 <b>'+p+'</b></span><button data-x aria-label="關閉">✕</button></div>'+
  '<div class="skwrap">'+skTreeHTML()+'</div>'+skDetailHTML()+
  '<div class="skfoot"><button data-reset>重置技能點</button><small>已學 '+Skills.list(S.cls).filter(s=>Skills.level(S,s.id)>0).length+' / '+Skills.list(S.cls).length+'　技能書 '+Skills.list(S.cls).filter(s=>Skills.hasBook(S,s.id)).length+' / '+Skills.list(S.cls).length+'</small></div>'}
function skTreeRefresh(force){const el=$('skp');if(!el.classList.contains('o'))return;
 const sig=S.cls+'|'+S.lv+'|'+JSON.stringify(S.skl)+JSON.stringify(S.books)+S.sbar.join()+'|'+skSel;
 if(!force&&sig===skTreeSig)return;skTreeSig=sig;
 const sc=el.querySelector('.skwrap'),top=sc?sc.scrollTop:0,dt=el.scrollTop;el.innerHTML=skPanelHTML();
 const n=el.querySelector('.skwrap');if(n)n.scrollTop=top;el.scrollTop=dt}
function skBarUI(){const L=S.sbar||[],sig=S.cls+'|'+L.join()+'|'+L.map(id=>id?Skills.level(S,id):0).join();
 if(sig!==skBarSig){skBarSig=sig;
  $('skb').innerHTML=L.map((id,i)=>{const s=id&&Skills.get(id);
   if(!s)return '<button class="sb empty" data-e="'+i+'" title="空的技能列：按 K 開啟技能樹，學會技能後可放入"><span class="kn">'+SK_KEYN[i]+'</span><i>＋</i></button>';
   const lv=Skills.level(S,id);
   return '<button class="sb" data-s="'+id+'" title="'+s.n+' Lv.'+lv+'｜快捷鍵 '+SK_KEYN[i]+'"><span class="kn">'+SK_KEYN[i]+'</span><em class="mc">MP'+Skills.mpCost(s,lv,S)+'</em><i>'+s.ic+'</i>'+s.n+'<span class="cd"></span></button>'}).join('')}
 [...$('skb').children].forEach((b,i)=>{const id=L[i];if(!id)return;const s=Skills.get(id),lv=Skills.level(S,id),c=Math.ceil(S.skcd[id]||0),e=b.querySelector('.cd');
  e.style.display=c>0?'flex':'none';e.textContent=c;b.classList.toggle('nomp',S.mp<Skills.mpCost(s,lv,S));b.classList.toggle('lowhp',s.cond==='lowhp'&&!Skills.condOk(s,S.hp,maxHp()))})}
function skUI(){skBarUI();buffUI();skTreeRefresh();const p=skPts(),b=$('menuSkBtn');if(b){const sp=b.querySelector('span'),t='技能樹'+(p?' ●'+p:'');if(sp.textContent!==t)sp.textContent=t;b.classList.toggle('has',p>0)}}
$('skb').onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.s)useSk(b.dataset.s);else if('e' in b.dataset)$('skp').classList.add('o'),skTreeRefresh(true)};
$('skp').onclick=e=>{const b=e.target.closest('button');if(!b)return;const D=b.dataset;
 if('x' in D){$('skp').classList.remove('o');return}
 if(D.n){skSel=D.n;skTreeRefresh();return}
 if('up' in D&&skSel){const s=Skills.get(skSel),r=Skills.learn(S,skSel);
  if(r.ok){if(r.lv===1)S.sbar=Skills.autoPlace(S,S.sbar,skSel);say((r.lv===1?'學會技能：':'技能升級：')+s.n+' Lv.'+r.lv,'技能','#8ad0ff');fl(hero.position,'✨ '+s.n+' Lv.'+r.lv,'#ffe9a0');Sfx.ui('learn');save()}else say(r.why,'技能','#ff9a9a');
  skTreeRefresh();skBarUI();return}
 if('slot' in D&&skSel){const s=Skills.get(skSel),i=+D.slot;S.sbar=S.sbar.map(x=>x===skSel?null:x);S.sbar[i]=skSel;say(s.n+' 已放入技能列 '+SK_KEYN[i],'技能','#8ad0ff');save();skTreeRefresh();skBarUI();return}
 if('clr' in D&&skSel){S.sbar=S.sbar.map(x=>x===skSel?null:x);save();skTreeRefresh();skBarUI();return}
 if('reset' in D){if(!Skills.spent(S)){say('目前沒有已投入的技能點','技能');return}
  if(!confirm('重置所有技能點？已取得的技能書會保留，技能點全數返還。'))return;
  const n=Skills.resetPoints(S);S.sbar=Skills.cleanBar(S,S.sbar);say('已重置技能，返還 '+n+' 點','技能','#8ad0ff');save();skTreeRefresh();skBarUI()}};
/* 取得技能書：由 collectDrop 呼叫（Loot.pickup 已登記技能書，這裡只做提示） */
function bookGot(ev){const s=Skills.get(ev.id);if(!s)return;
 if(ev.isNew){Sfx.ui('book');say('獲得技能書：'+s.n+'（按 K 開啟技能樹學習）','掉落','#8ad0ff');fl(hero.position,'📘 '+s.n,'#ffe9a0');skTreeRefresh()}
 else say('重複的技能書：'+s.n,'掉落','#9aa7bb')}
Events.on('levelup',d=>{Sfx.ui('levelup');const n=d.lv-d.from;if(n>0)say('技能點 +'+n+'（可用 '+skPts()+'）','技能','#ffe9a0')});
addEventListener('keydown',e=>{if(e.code=='KeyK'&&S.mode=='play'&&document.activeElement.tagName!='INPUT'){$('skp').classList.toggle('o');skTreeRefresh(true)}});
{const MI={'+10級':['⏫','+10級'],'重新創角':['🔄','重新創角'],'自動戰鬥':['⚔️','自動戰鬥'],'背包 B':['🎒','背包'],'藥水 R':['🧪','藥水'],'重置視角':['🎥','視角']};
 const shut=()=>{menuPanel.classList.remove('o');menuBtn.setAttribute('aria-expanded','false')};
 [...tb.children].forEach(b=>{const t=b.textContent,m=Object.entries(MI).find(([k])=>t.startsWith(k));if(m){b.className='mb';b.innerHTML='<i>'+m[1][0]+'</i><span>'+m[1][1]+'</span>'}if(t.startsWith('背包'))b.addEventListener('click',shut)});
 const mk3=(ic,lb,f,close)=>{const b=document.createElement('button');b.className='mb';b.innerHTML='<i>'+ic+'</i><span>'+lb+'</span>';b.onclick=()=>{f();if(close)shut()};return b};
 const skBtn=mk3('🌳','技能樹',()=>{$('skp').classList.toggle('o');skTreeRefresh(true)},1);skBtn.id='menuSkBtn';
 tb.insertBefore(skBtn,tb.children[1]);
 const sndBtn=mk3('🔊','音效 開',()=>Sfx.toggle(),0);
 const sndSync=()=>{sndBtn.firstChild.textContent=Sfx.isMuted()?'🔇':'🔊';sndBtn.querySelector('span').textContent='音效 '+(Sfx.isMuted()?'關':'開');sndBtn.classList.toggle('on',!Sfx.isMuted());
  const r=$('sfxr');if(r){r.value=Math.round(Sfx.volume()*100);$('sfxv').textContent=Math.round(Sfx.volume()*100)+'%'}};
 /* 自動設定面板加上音量滑桿 */
 {const a=$('asp'),l=document.createElement('label');l.innerHTML='音效音量：<b id="sfxv"></b><input type="range" id="sfxr" min="0" max="100" step="5">';a.insertBefore(l,a.querySelector('small'));
  $('sfxr').oninput=e=>{Sfx.setVolume(e.target.value/100)};$('sfxr').onchange=()=>Sfx.ui('learn')}
 Sfx.onChange(sndSync);sndSync();
 tb.appendChild(sndBtn);
 tb.appendChild(mk3('⚙️','自動設定',()=>$('asp').classList.toggle('o'),1));tb.appendChild(mk3('❓','說明',()=>$('menuHelp').classList.toggle('o')))}
