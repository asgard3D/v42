/* 掉落、背包、裝備 */
const atkB=()=>Rules.atkBonus(S),spdB=()=>Rules.spdBonus(S),hex=r=>'#'+RC[r].toString(16).padStart(6,'0');
const drops=[],critP=()=>Rules.critChance(S),defP=()=>Rules.defReduce(S);
const potImg=t=>'<img src="data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(POT_ICON[t])+'" alt="'+(t==='hp'?'HP水':'MP水')+'" style="width:30px;height:30px;vertical-align:middle;object-fit:contain">';
const SH={weapon:'⚔',armor:'🧥',boots:'👢',ring:'💍',amulet:'📿'},SU={weapon:'攻',armor:'HP',boots:'%速',ring:'%暴',amulet:'%減傷'},price=it=>Rules.itemPrice(it),sd=it=>'+'+it.v+SU[it.slot];
function dropMat(c,rough=.55,metal=0){return new THREE.MeshStandardMaterial({color:c,roughness:rough,metalness:metal,emissive:new THREE.Color(c).multiplyScalar(.08),emissiveIntensity:.7})}
function dropGem(c){return new THREE.Mesh(new THREE.IcosahedronGeometry(.105,1),dropMat(c,.25,.45))}
const DROP_GLOW=[
 {c:0xe8edf5,p:0.24,ring:0.72,beam:0.00},
 {c:0x55e06b,p:0.34,ring:0.95,beam:0.00},
 {c:0x55a8ff,p:0.43,ring:1.12,beam:0.00},
 {c:0xc06aff,p:0.68,ring:1.34,beam:1.35},
 {c:0xffb52e,p:0.82,ring:1.62,beam:1.70}
];
function addDropGlow(g,r){
 const q=DROP_GLOW[Math.max(0,Math.min(4,Number(r)||0))];
 const glow=new THREE.Group();glow.name='tierGlow';
 const ring=new THREE.Mesh(new THREE.RingGeometry(.22,.34,32),new THREE.MeshBasicMaterial({color:q.c,transparent:true,opacity:q.p,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));
 ring.rotation.x=-Math.PI/2;ring.position.y=-.47;glow.add(ring);
 const aura=new THREE.Mesh(new THREE.SphereGeometry(.31,16,12),new THREE.MeshBasicMaterial({color:q.c,transparent:true,opacity:q.p*.12,depthWrite:false,blending:THREE.AdditiveBlending}));
 aura.scale.y=.72;glow.add(aura);
 if(q.beam){
  // 直升天空的圓形光柱：外柱 + 亮芯，使用 AdditiveBlending 提高夜景辨識度。
  const beamH=r>=4?7.8:6.2;
  const beam=new THREE.Mesh(new THREE.CylinderGeometry(r>=4?.42:.34,r>=4?.62:.50,beamH,32,1,true),new THREE.MeshBasicMaterial({color:q.c,transparent:true,opacity:q.beam*.24,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending}));
  beam.position.y=beamH*.5-.42;glow.add(beam);
  const core=new THREE.Mesh(new THREE.CylinderGeometry(r>=4?.10:.075,r>=4?.16:.11,beamH*.94,20,1,true),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:r>=4?.48:.34,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending}));
  core.position.y=beamH*.47-.42;glow.add(core);
  const top=new THREE.Mesh(new THREE.RingGeometry(r>=4?.34:.25,r>=4?.70:.52,40),new THREE.MeshBasicMaterial({color:q.c,transparent:true,opacity:r>=4?.68:.50,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));
  top.rotation.x=-Math.PI/2;top.position.y=beamH-.42;glow.add(top);
  const star=new THREE.Mesh(new THREE.OctahedronGeometry(r>=4?.085:.065,1),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:r>=4?.92:.82,depthWrite:false,blending:THREE.AdditiveBlending}));
  star.position.y=beamH-.32;glow.add(star);glow.userData.beam=beam;glow.userData.core=core;glow.userData.top=top;glow.userData.star=star;
 }
 glow.userData.ring=ring;glow.userData.aura=aura;glow.userData.r=r;g.add(glow);return glow;
}
function dropIcon(k,x){
 const g=new THREE.Group();
 if(k==='gold'){
  const c=new THREE.Mesh(new THREE.CylinderGeometry(.23,.23,.055,16),dropMat(0xffd54a,.28,.75));
  c.rotation.z=Math.PI/2;g.add(c);
  const e=new THREE.Mesh(new THREE.TorusGeometry(.12,.018,6,14),dropMat(0xfff1a0,.25,.7));e.rotation.y=Math.PI/2;g.add(e);
 }else if(k==='pot'){
  const blue=x&&x.ptype==='mp',col=blue?0x3f8fff:0xff4a6a;
  const b=new THREE.Mesh(new THREE.SphereGeometry(.18,12,9),dropMat(col,.32,.12));b.scale.y=1.15;g.add(b);
  const n=new THREE.Mesh(new THREE.CylinderGeometry(.07,.09,.16,10),dropMat(0xe9e9e9,.4,.2));n.position.y=.205;g.add(n);
  const cap=new THREE.Mesh(new THREE.CylinderGeometry(.085,.085,.045,10),dropMat(0xd9b66a,.28,.35));cap.position.y=.31;g.add(cap);
  const band=new THREE.Mesh(new THREE.TorusGeometry(.13,.012,5,16),dropMat(0xffffff,.35,.15));band.position.y=.03;g.add(band);
 }else if(k==='book'){
  const cover=dropMat(0x4c79a8,.5,.12),page=dropMat(0xf4e8c8,.75,0);
  const body=new THREE.Mesh(new THREE.BoxGeometry(.34,.42,.13),cover);g.add(body);
  const pg=new THREE.Mesh(new THREE.BoxGeometry(.285,.36,.018),page);pg.position.z=.078;g.add(pg);
  const spine=new THREE.Mesh(new THREE.BoxGeometry(.035,.39,.15),dropMat(0x294a76,.42,.15));spine.position.x=-.16;g.add(spine);
  const mark=dropGem(0x8ad0ff);mark.scale.set(.7,1.25,.35);mark.position.set(.035,.02,.09);g.add(mark);
 }else{
  const r=RC[x.it.r];
  if(x.it.slot==='weapon'){
   const sh=new THREE.Shape();sh.moveTo(-.055,0);sh.lineTo(-.055,.43);sh.lineTo(0,.58);sh.lineTo(.055,.43);sh.lineTo(.055,0);sh.closePath();
   const blade=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:.045,bevelEnabled:true,bevelThickness:.012,bevelSize:.012,bevelSegments:1}),dropMat(r,.3,.65));blade.position.z=-.022;g.add(blade);
   const h=new THREE.Mesh(new THREE.CylinderGeometry(.065,.065,.18,8),dropMat(0x7a4b2b,.6,.1));h.position.y=-.09;g.add(h);
   const guard=new THREE.Mesh(new THREE.BoxGeometry(.22,.035,.065),dropMat(0xd6aa45,.28,.6));guard.position.y=-.01;g.add(guard);
  }else if(x.it.slot==='armor'){
   const body=new THREE.Mesh(new THREE.BoxGeometry(.34,.4,.18),dropMat(r,.48,.28));body.scale.x=.92;g.add(body);
   [-1,1].forEach(q=>{const sh=new THREE.Mesh(new THREE.SphereGeometry(.105,10,8),dropMat(r,.45,.25));sh.scale.set(1,.72,.8);sh.position.set(q*.18,.15,0);g.add(sh)});
   const gem=dropGem(0xffffff);gem.position.z=.105;gem.scale.set(.55,1,.45);g.add(gem);
  }else if(x.it.slot==='boots'){
   const leg=new THREE.Mesh(new THREE.CylinderGeometry(.085,.11,.28,9),dropMat(r,.48,.22));leg.position.y=.09;g.add(leg);
   const foot=new THREE.Mesh(new THREE.BoxGeometry(.2,.13,.34),dropMat(r,.4,.28));foot.position.set(0,-.055,.1);g.add(foot);
   const sole=new THREE.Mesh(new THREE.BoxGeometry(.22,.035,.36),dropMat(0x22252b,.65,.25));sole.position.set(0,-.13,.1);g.add(sole);
  }else if(x.it.slot==='ring'){
   const ring=new THREE.Mesh(new THREE.TorusGeometry(.13,.045,10,20),dropMat(r,.24,.8));ring.rotation.x=Math.PI/2;g.add(ring);
   const gem=dropGem(r);gem.position.y=.11;gem.scale.set(1.15,.7,.8);g.add(gem);
  }else{
   const chain=new THREE.Mesh(new THREE.TorusGeometry(.13,.018,6,18),dropMat(r,.3,.7));chain.rotation.x=Math.PI/2;chain.position.y=.09;g.add(chain);
   const gem=dropGem(r);gem.position.y=-.03;gem.scale.set(.8,1.15,.6);g.add(gem);
  }
 }
 g.rotation.y=R(0,Math.PI*2);g.scale.setScalar(k==='item'?1.15:1);return g;
}
function mkDrop(p,k,x){const o=dropIcon(k,x);o.position.copy(p);scene.add(o);
 if(k==='item'){
  addDropGlow(o,x.it.r);
 }
 drops.push(Object.assign({o,k,t:60},x))}
function dropLoot(m){const at=()=>new THREE.Vector3(m.g.position.x+R(-.8,.8),.6,m.g.position.z+R(-.8,.8));
 Loot.rollDrops(S,m,Z,Math.random).forEach(d=>mkDrop(at(),d.k,d))}
function startDropFly(d){if(!d||d.fly)return;d.fly=true;d.flyT=0;d.flyStart=d.o.position.clone()}
function collectDrop(d){
 scene.remove(d.o);const ix=drops.indexOf(d);if(ix>=0)drops.splice(ix,1);
 const ev=Loot.pickup(S,d);
 if(ev.type=='book')bookGot(ev);
 else{if(ev.type=='equip')rebuild();Events.emit('loot',ev);if(ev.type=='pot'){renderSk();eqUI()}bagUI()}
 save();
}
function dropTick(dt){for(let i=drops.length-1;i>=0;i--){const d=drops[i];d.t-=dt;d.o.rotation.y+=dt*2;
  if(d.k==='item'){
   const gl=d.o.getObjectByName('tierGlow');
   if(gl){const pulse=1+Math.sin(T*4.5+i)*.08,spin=dt*(d.it.r>=3?1.5:.8);gl.scale.setScalar(pulse);if(gl.userData.ring)gl.userData.ring.rotation.z+=spin;if(gl.userData.beam){const bp=1+Math.sin(T*3+i)*.10;gl.userData.beam.scale.x=bp;gl.userData.beam.scale.z=bp;}if(gl.userData.core){const cp=1+Math.sin(T*4.2+i)*.14;gl.userData.core.scale.x=cp;gl.userData.core.scale.z=cp;}if(gl.userData.top){gl.userData.top.rotation.z+=dt*(d.it.r>=4?.55:.35);const tp=1+Math.sin(T*3.6+i)*.12;gl.userData.top.scale.setScalar(tp);}if(gl.userData.star)gl.userData.star.rotation.y+=dt*3.5;}
  }
  if(!d.fly){
    d.o.position.y=gH(d.o.position.x,d.o.position.z)+.6+Math.sin(T*3+i)*.1;
    if(d.t<=0){scene.remove(d.o);drops.splice(i,1);continue}
    // 掉落物生成後短暫展示，之後無論自動戰鬥或手動戰鬥，都會自動飛向角色。
    // 不再要求玩家先走近掉落物。
    if(d.t<=59.55 && Loot.wantsPickup(S,d))startDropFly(d);
  }
  if(d.fly){
    d.flyT=(d.flyT||0)+dt;
    const target=hero.position.clone();target.y+=1.15;
    const k=Math.min(1,d.flyT/.45),e=1-Math.pow(1-k,3);
    d.o.position.lerpVectors(d.flyStart||d.o.position,target,e);
    if(k>=1){collectDrop(d)}
  }
 }}
function usePot(){if(S.mode!='play')return;const r=Loot.usePotion(S,'hp',maxHp());if(!r)return;renderSk();bagUI();save();fl(hero.position,'+'+r.amount,'#7fff9a');ring(hero.position,0xff6a8a,2)}
function useMpPot(){if(S.mode!='play')return;const r=Loot.usePotion(S,'mp',maxMp());if(!r)return;renderSk();bagUI();save();fl(hero.position,'+'+r.amount,'#70b7ff');ring(hero.position,0x3f8fff,2)}
let sel=-1;
const cmp=it=>{const c=S.eq[it.slot],d=it.v-(c?c.v:0);return '已裝備：'+(c?c.name+' '+sd(c):'無')+'　<span style="color:'+(d>=0?'#7fff9a':'#ff7a7a')+'">'+(d>=0?'+':'')+d+'</span>'};
function bagUI(){S.inv=Loot.sanitize(S.inv);if(sel>=S.inv.length)sel=-1;$('aeb').textContent='自動穿戴：'+(S.ae?'開':'關');
 $('bs').innerHTML=Object.keys(SLOTN).map(s=>{const i=S.eq[s];return '<button data-u="'+s+'" style="border-color:'+(i?hex(i.r):'#34568c')+'">'+SH[s]+' '+SLOTN[s]+'<br><small style="color:'+(i?hex(i.r):'#789')+'">'+(i?i.name+' '+sd(i):'—')+'</small></button>'}).join('');
 $('bg').innerHTML=Array.from({length:24},(_,k)=>{if(k===0)return '<button data-p="hp" title="HP水">'+potImg('hp')+'<small>HP水 ×'+S.pot+'</small></button>';if(k===1)return '<button data-p="mp" title="MP水">'+potImg('mp')+'<small>MP水 ×'+S.mpPot+'</small></button>';const i=S.inv[k-2];const valid=i&&SLOTN[i.slot];return '<button data-i="'+(k-2)+'" class="'+(k-2==sel?'on':'')+'" style="border-color:'+(valid?hex(i.r):'#34568c')+';color:'+(valid?hex(i.r):'#789')+'">'+(valid?(SH[i.slot]||'◆')+'<small>+'+(Number(i.v)||0)+'</small>':'')+'</button>'}).join('');
 const it=S.inv[sel];$('bi').innerHTML=it?'<b style="color:'+hex(it.r)+'">'+it.name+'</b> Lv.'+it.lv+' '+sd(it)+' <small style="opacity:.75">'+PRE[it.r]+'・'+TN[tierOf(it)]+'階</small>'+'<br>'+cmp(it)+'<br><button data-e>裝備</button> <button data-s>賣出 💰'+price(it)+'</button>':'點選 HP水／MP水可直接使用；其他物品可查看詳情。';}
$('bag').onclick=e=>{const b=e.target.closest('button');if(!b)return;const D=b.dataset;
 if('p' in D){const type=D.p==='hp'?'pot':'mpPot';if(quickTarget<0){say('請先點擊一個空的快捷欄格');return;}S.quick[quickTarget]=type;const slot=(quickTarget%QSIZE);quickTarget=-1;quickAssign=false;mpQuickAssign=false;renderSk();bagUI();save();say((type==='pot'?'HP水':'MP水')+' 已放入快捷欄 '+((slot+1)%10));return;}
 if('i' in D)sel=+D.i;
 else if('u' in D){if(Loot.unequip(S,D.u))rebuild()}
 else if('e' in D&&S.inv[sel]){Loot.equipFromBag(S,sel);sel=-1;rebuild()}
 else if('s' in D&&S.inv[sel]){Loot.sellFromBag(S,sel);sel=-1}
 else if('tierpick' in D){
   const r=Number(D.tierpick);
   if(Number.isInteger(r)&&r>=0&&r<PRE.length){
     const{n,g}=Loot.sellByRarity(S,r);sel=-1;
     if(n)say('已販賣 '+PRE[r]+'裝備 ×'+n+'，獲得 '+g+' 金幣','背包','#ffd54a');
     else say('沒有 '+PRE[r]+' 裝備可販賣','背包','#ffd54a');
     save();
   }
 }
 else if('ae' in D)S.ae=S.ae?0:1;
 else if('x' in D)$('bag').classList.remove('o');
 bagUI()};
function eqUI(){const h='💰 '+S.gold+'　♥ '+S.pot+'　💧 '+S.mpPot+'<br>📍 '+ZN[Z].n;$('gd').textContent='💰 '+S.gold+'　♥ '+S.pot+'　💧 '+S.mpPot;const ms=$('menuStats');if(ms)ms.innerHTML=h}
let lastAP=0;
