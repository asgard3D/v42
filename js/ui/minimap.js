/* 小地圖與地圖切換 */
// ---------- minimap ----------
const mmc=$('miniMapCanvas'),mmx=mmc.getContext('2d');
function initMapSelect(){const w=$('mapSelect');w.innerHTML=ZN.map((z,i)=>`<option value="${i}">${z.n} Lv.${z.lv}+</option>`).join('');w.onchange=()=>{const zi=+w.value;if(S.lv<ZN[zi].lv){say('需要 Lv.'+ZN[zi].lv+' 才能進入 '+ZN[zi].n);w.value=Z;return}enterZone(zi);hero.position.set(0,0,0);S.dest=null;S.tm=null;mk2.visible=false;say('已切換至 '+ZN[zi].n)};}
function drawMiniMap(){if(S.mode!='play')return;const w=mmc.width,h=mmc.height,p=12,sc=(w-p*2)/80;mmx.clearRect(0,0,w,h);mmx.fillStyle='#'+new THREE.Color(ZN[Z].gr).multiplyScalar(.45).getHexString();mmx.fillRect(0,0,w,h);mmx.strokeStyle='rgba(180,220,180,.25)';mmx.strokeRect(p,p,w-p*2,h-p*2);
 // 地圖地形
 mmx.fillStyle='rgba(120,170,110,.18)';mmx.beginPath();mmx.arc(w/2,h/2,sc*7,0,Math.PI*2);mmx.fill();
 // 傳送門
 portals.forEach(q=>{const x=p+(q.x+40)*sc,y=p+(q.z+40)*sc;mmx.fillStyle='#65d8ff';mmx.beginPath();mmx.arc(x,y,4,0,Math.PI*2);mmx.fill()});
 // 怪物
 mons.forEach(m=>{if(m.dead)return;const x=p+(m.g.position.x+40)*sc,y=p+(m.g.position.z+40)*sc;mmx.fillStyle=m.T.boss?'#ff7b30':'#e85d72';mmx.beginPath();mmx.arc(x,y,m.T.boss?3.5:2,0,Math.PI*2);mmx.fill()});
 // 玩家
 const x=p+(hero.position.x+40)*sc,y=p+(hero.position.z+40)*sc;mmx.fillStyle='#ffe07a';mmx.beginPath();mmx.arc(x,y,4,0,Math.PI*2);mmx.fill();mmx.strokeStyle='#fff4c0';mmx.stroke();
 const sel=$('mapSelect');if(sel.value!==String(Z))sel.value=String(Z);$('miniMapTitle').textContent=ZN[Z].n+' · 小地圖';}
