/* 對話／系統訊息 */
function say(t,c,col){$('log').textContent=t;logMsg(c||'系統',t,col)}
// ---------- chat / info box ----------
const CHT=['全部','戰鬥','掉落','系統','狀態'],CHC={戰鬥:'#ff9a8a',掉落:'#ffd54a',系統:'#8ad0ff'},chatLog=[];let chTab='全部';
{const w=$('chTabs');CHT.forEach(n=>{const b=document.createElement('button');b.className='ct'+(n==chTab?' on':'');b.textContent=n;b.dataset.t=n;w.appendChild(b)});
 const m=document.createElement('button');m.id='chMin';m.textContent='▾';m.title='收合／展開';w.appendChild(m);
 w.onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.id=='chMin'){const c=$('chat').classList.toggle('min');b.textContent=c?'▸':'▾';return}
  chTab=b.dataset.t;[...w.querySelectorAll('.ct')].forEach(x=>x.classList.toggle('on',x.dataset.t==chTab));chRender()}}
function chLine(m){const d=document.createElement('div'),t=document.createElement('span'),g=document.createElement('span'),x=document.createElement('span');
 t.className='t';t.textContent=m.time;g.className='tg';g.textContent=m.c;g.style.color=CHC[m.c]||'#fff';x.textContent=m.t;if(m.col)x.style.color=m.col;
 d.appendChild(t);if(chTab=='全部')d.appendChild(g);d.appendChild(x);return d}
function chRender(){const b=$('chBody');if(chTab=='狀態'){chatStats();return}b.innerHTML='';chatLog.filter(m=>chTab=='全部'||m.c==chTab).slice(-80).forEach(m=>b.appendChild(chLine(m)));b.scrollTop=b.scrollHeight}
function logMsg(c,t,col){const d=new Date(),m={c,t,col,time:String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')};chatLog.push(m);if(chatLog.length>300)chatLog.shift();
 if(chTab=='全部'||chTab==c){const b=$('chBody'),nb=b.scrollHeight-b.scrollTop-b.clientHeight<40;b.appendChild(chLine(m));while(b.children.length>80)b.removeChild(b.firstChild);if(nb)b.scrollTop=b.scrollHeight}}
function chatStats(){if(chTab!='狀態'||$('chat').classList.contains('min'))return;const cl=CL[S.cls],e=S.eq||{},act=Skills.list(S.cls).filter(k=>Skills.level(S,k.id)>0);
 const rows=[['角色',S.name+'・'+cl.n+' Lv.'+S.lv],['經驗',S.exp+' / '+nextExp()],['HP / MP',Math.max(0,Math.round(S.hp))+'/'+maxHp()+'　'+Math.round(S.mp)+'/'+maxMp()],
  ['攻擊',(cl.d[0]+S.lv+atkB())+' ~ '+(cl.d[1]+S.lv+atkB())],['暴擊率',critP()+'%'],['移速加成','+'+spdB()+'%'],['減傷',defP()+'%'],['金幣 / 藥水','💰'+S.gold+'　♥'+S.pot+'　💧'+S.mpPot],
  ['地圖',ZN[Z].n],['技能點',Skills.points(S)+'（已學 '+act.length+'/'+Skills.list(S.cls).length+' 種）'],['技能列',(S.sbar||[]).map(id=>id?Skills.get(id).n:'—').join(' / ')],['裝備',['weapon','armor','boots'].map(k=>e[k]?e[k].name:'—').join(' / ')]];
 const h='<table>'+rows.map(r=>'<tr><td>'+r[0]+'</td><td>'+r[1]+'</td></tr>').join('')+'</table>';const b=$('chBody');if(b.dataset.h!==h){b.dataset.h=h;b.innerHTML=h}}
