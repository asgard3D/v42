/* 主角建模與重建 */
// ---------- hero ----------
const FACE=(()=>{const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');
 const ell=(a,b,rx,ry,fill)=>{x.fillStyle=fill;x.beginPath();x.ellipse(a,b,rx,ry,0,0,6.283);x.fill()};
 [[92,305],[420,305]].forEach(([a,b])=>{const g=x.createRadialGradient(a,b,0,a,b,44);g.addColorStop(0,'rgba(255,115,120,.5)');g.addColorStop(1,'rgba(255,115,120,0)');x.fillStyle=g;x.fillRect(a-46,b-46,92,92)});
 [[132,-1],[380,1]].forEach(([px,sd])=>{x.save();x.translate(px,228);x.scale(.92,.96);
  ell(0,0,50,58,'#fbf1ec');
  const g=x.createLinearGradient(0,-52,0,58);g.addColorStop(0,'#2a0510');g.addColorStop(.45,'#9a1426');g.addColorStop(1,'#ff7a86');
  ell(0,4,42,54,g);ell(0,6,17,28,'#14030a');ell(-14,-22,13,15,'#fff');ell(14,24,6,7,'#ffd6dc');ell(-6,36,3,3,'#fff');
  x.strokeStyle='#120a0e';x.lineWidth=13;x.lineCap='round';x.beginPath();x.ellipse(0,0,52,58,0,3.45,5.95);x.stroke();
  x.lineWidth=7;x.beginPath();x.moveTo(sd*46,-30);x.lineTo(sd*74,-46);x.stroke();
  x.lineWidth=3;x.strokeStyle='rgba(70,28,34,.75)';x.beginPath();x.ellipse(0,0,50,57,0,.3,2.9);x.stroke();
  x.restore()});
 x.strokeStyle='#241418';x.lineWidth=9;x.lineCap='round';
 [[92,116,130,106,172,122],[340,122,382,106,420,116]].forEach(p=>{x.beginPath();x.moveTo(p[0],p[1]);x.quadraticCurveTo(p[2],p[3],p[4],p[5]);x.stroke()});
 x.strokeStyle='rgba(190,120,110,.7)';x.lineWidth=3;x.beginPath();x.moveTo(252,292);x.lineTo(256,300);x.lineTo(262,300);x.stroke();
 x.strokeStyle='#8a4a4a';x.lineWidth=4;x.beginPath();x.moveTo(240,352);x.quadraticCurveTo(256,355,272,352);x.stroke();
 const t=new THREE.CanvasTexture(c);t.anisotropy=4;return t})();
const RC=[0xbfc4cc,0x5fd16a,0x4aa0ff,0xb060ff,0xff9a2a];
const TC=[0x9a7a55,0x8a94a2,0xd2dcea,0x5ee0d0,0xff8a3a,0xd070ff];
const FAB=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');x.fillStyle='#ddd';x.fillRect(0,0,64,64);
 for(let i=0;i<64;i+=2){x.fillStyle=i%4?'#fff':'#e6e6e6';x.fillRect(i,0,1,64);x.fillStyle=i%4?'#f2f2f2':'#e2e2e2';x.fillRect(0,i,64,1)}
 for(let i=0;i<500;i++){x.fillStyle='rgba(0,0,0,.03)';x.fillRect(Math.random()*64,Math.random()*64,1,1)}
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(2,2);return t})();
const cloth=c=>new THREE.MeshStandardMaterial({color:c,roughness:1,metalness:0,side:THREE.DoubleSide});
function flap(w,h,m,ph){const g=new THREE.PlaneGeometry(w,h,6,10),p=g.attributes.position;
 for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),k=.5-y/h;p.setX(i,x*(1+k*.2));p.setZ(i,Math.sin(x/w*16+ph)*.012*k+k*k*.03)}
 g.translate(0,-h/2,0);g.computeVertexNormals();const o=new THREE.Mesh(g,m);o.castShadow=true;return o}
function bladeGeo(len,w,th){const sh=new THREE.Shape();sh.moveTo(-w/2,0);sh.lineTo(-w/2,len*.8);sh.lineTo(0,len);sh.lineTo(w/2,len*.8);sh.lineTo(w/2,0);sh.closePath();
 const g=new THREE.ExtrudeGeometry(sh,{depth:th,bevelEnabled:true,bevelThickness:th*.6,bevelSize:th*.5,bevelSegments:1});g.translate(0,0,-th/2);g.rotateY(Math.PI/2);return g}
function makeHeroProc(k,lv,hs){
 // 戒指、耳環、項鍊只保留裝備資料，不建立角色外觀模型。
 const cl=CL[k],g=new THREE.Group(),st=[1,11,21,41,61,71,81,91].filter(x=>lv>=x).length-1,V=THREE.Vector3,Y=new V(0,1,0),E=S.eq||{};
 const wt=E.weapon?E.weapon.r:-1,at=E.armor?E.armor.r:-1,bt=E.boots?E.boots.r:-1;
 // 外觀階段改以裝備等級決定；稀有度 r 仍只負責數值／掉落／名稱，不再主導裝備顏色。
 const wT=E.weapon?equipVisualTier(E.weapon):-1,aT=E.armor?equipVisualTier(E.armor):-1,bT=E.boots?equipVisualTier(E.boots):-1,dd=x=>x?(x.d|0)&1:0,wD=dd(E.weapon),aD=dd(E.armor),bD=dd(E.boots),
  dk=(c,f)=>new THREE.Color(c).multiplyScalar(f).getHex(), // 乘暗：用來壓低色塊、增加黑色比例
  ep=t=>equipColors(k,Math.max(0,t)),eqBase=(t)=>t>=0?ep(t).base:0x1a1a22,eqAccent=(t)=>t>=0?ep(t).accent:0xd9b45a,eqShadow=(t)=>t>=0?ep(t).shadow:0x3a2a22,eqHi=(t)=>t>=0?ep(t).highlight:0xd9b45a,
  tmat=(t,d)=>{const p=ep(t),c=d?eqHi(t):p.accent;return new THREE.MeshStandardMaterial({color:c,roughness:.3,metalness:.62,emissive:c,emissiveIntensity:t>=5?.12:.035})};
 const blk=cloth(0x101114),cm=cloth(dk(cl.c,.7)),gold=new THREE.MeshStandardMaterial({color:eqHi(Math.max(aT,wT,bT)),metalness:.58,roughness:.4}),eqDark=new THREE.MeshStandardMaterial({color:eqBase(Math.max(aT,wT,bT)),metalness:.35,roughness:.7}),
  rc=r=>new THREE.MeshStandardMaterial({color:RC[r],roughness:.96,metalness:0,side:THREE.DoubleSide}),
  rm=r=>new THREE.MeshStandardMaterial({color:RC[r],roughness:.32,metalness:.72}),
  trim=aT>=0?tmat(aT,aD):at>=2?rc(at):gold,glow=new THREE.MeshBasicMaterial({color:cl.g}),skin=M(0xf8dcc8),hc=HC[S.hc||0][0],hk=HC[S.hc||0][1],hair=M(hc),wh=cloth(0xf2f2f2);
 const tip=new THREE.MeshLambertMaterial({color:hk,emissive:hk,emissiveIntensity:.35});
 const mk=(geo,mat,x,y,z,p)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;(p||g).add(m);return m};
 const cyl=(r1,r2,h,m,x,y,z,p,sg)=>mk(new THREE.CylinderGeometry(r1,r2,h,sg||12),m,x,y,z,p);
 const sph=(r,m,x,y,z,p)=>mk(new THREE.SphereGeometry(r,12,10),m,x,y,z,p);
 const bx=(w,h,d,m,x,y,z,p)=>mk(new THREE.BoxGeometry(w,h,d),m,x,y,z,p);
 g.legs=[-1,1].map(s=>{const p=new THREE.Group();p.position.set(s*.11,.85,0);g.add(p);
  const k=new THREE.Group();k.position.y=-.55;p.add(k);p.shin=k; // 膝關節：小腿與腳掌掛在 k 上
  cyl(.1,.075,.55,blk,0,-.27,0,p);sph(.08,blk,0,-.55,0,p);cyl(.095,.1,.3,blk,0,-.13,0,k);
  cyl(.103,.103,.05,bt>=0?rc(bt):gold,0,-.5,0,p);cyl(.102,.102,.04,cm,0,-.03,0,k);if(bt>=3)cyl(.108,.108,.025,rc(bt),0,-.17,0,k);
  bx(.18,.09,.26,blk,0,-.25,.05,k);bx(.19,.03,.1,bt>=0?rc(bt):gold,0,-.22,.13,k);return p});
 cyl(.24,.17,.5,blk,0,1.13,0,null,14).scale.z=.65;
 cyl(.215,.215,.06,gold,0,.93,0,null,14).scale.z=.7;bx(.1,.08,.04,gold,0,.93,.15);
 const CY=(rt,rb,h,y,sz,mat,t0,len,o,P)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(rt+o,rb+o,h,24,1,true,t0,len),mat);m.position.set(0,P?y-.95:y,0);m.scale.z=sz;m.castShadow=true;(P||g).add(m)};
 const skF=new THREE.Group();skF.position.set(0,.95,0);g.add(skF);g.skF=skF;
 const SR=[.19,.34,.7,.6,.72],TR=[.245,.17,.56,1.1,.65];
 CY(...SR,blk,.75,6.283-1.5,0);CY(...SR,blk,-.75,1.5,0,skF);
 [.28,-.62].forEach(t0=>{CY(...TR,cm,t0,.34,.008);CY(...SR,cm,t0,.34,.008,skF)}); // 職業色只留窄條，其餘為黑
 [.245,.62,-.28,-.655].forEach(t0=>{CY(...TR,trim,t0,.035,.012);CY(...SR,trim,t0,.035,.012,skF)});
 const tl=.85+.1*Math.max(at,0),tg=new THREE.Group();tg.position.set(0,.95,0);tg.rotation.x=.1;g.add(tg);
 const tm=new THREE.Mesh(new THREE.CylinderGeometry(.2,.4+.03*Math.max(at,0),tl,24,6,true,Math.PI-.9,1.8),new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,side:THREE.DoubleSide}));tm.position.y=-tl/2;tm.scale.z=.78;tm.castShadow=true;tg.add(tm);g.tails=[tg];
 {const pp=tm.geometry.attributes.position,cc=new Float32Array(pp.count*3),c0=new THREE.Color(GR[k][0]),c1=new THREE.Color(GR[k][1]).multiplyScalar(.8);
  for(let i=0;i<pp.count;i++){const c=c0.clone().lerp(c1,Math.pow((tl/2-pp.getY(i))/tl,2.1));cc.set([c.r,c.g,c.b],i*3)}
  tm.geometry.setAttribute('color',new THREE.BufferAttribute(cc,3));
  const em=new THREE.Group();em.position.set(0,-tl*.38,-.235);tg.add(em);
  mk(new THREE.BoxGeometry(.04,.26,.01),gold,0,0,0,em);mk(new THREE.BoxGeometry(.16,.04,.01),gold,0,.05,0,em);mk(new THREE.OctahedronGeometry(.05),glow,0,-.03,0,em)}
 mk(new THREE.OctahedronGeometry(.05),glow,0,1.22,.17).scale.y=1.7;
 cyl(.07,.075,.1,skin,0,1.46,0);cyl(.14,.19,.14,blk,0,1.41,0);cyl(.195,.195,.02,at>=3?rc(at):gold,0,1.35,0);
 g.fore=[];g.arms=[-1,1].map(s=>{const p=new THREE.Group();p.position.set(s*.33,1.3,0);g.add(p);
  cyl(.075,.06,.3,blk,0,-.14,0,p);sph(.07,blk,0,-.01,0,p);
  const f=new THREE.Group();f.position.y=-.29;p.add(f);g.fore.push(f);sph(.058,blk,0,0,0,f);
  cyl(.06,.052,.28,blk,0,-.14,0,f);cyl(.062,.062,.05,gold,0,-.23,0,f);sph(.07,wh,0,-.3,0,f);return p});
 [-1,1].forEach(s=>{sph(.13,wh,s*.33,1.36,0).scale.y=.6;if(st>=2)sph(.045,gold,s*.33,1.43,0);
  if(at>=2){const c=mk(new THREE.ConeGeometry(.045,.18+.03*at,5),rc(at),s*.37,1.47,0);c.rotation.z=-s*.5}});
 const tcl=(t,d)=>cloth(t<0?0x6a5238:dk(d?eqHi(t):eqAccent(t),.7)),tcd=(t,d)=>cloth(t<0?0x3a2a1a:(d?dk(eqShadow(t),.7):dk(eqAccent(t),.3))),
  rib=(p,x,y,z,t,n,len,back)=>{for(let i=0;i<n;i++){const q=i%2?-1:1,f=flap(.06+.015*(n-i),len*(1-i*.12),i%2?t[1]:t[0],i);f.position.set(x,y,z);
   if(back)f.rotation.set(.5+.1*i,0,q*.25*(1+i));else f.rotation.z=q*(.9+.18*i);p.add(f)}};
 // ===== 外套：疊層布條（與原本腰裙／胸前布條同一設計語言）=====
 if(aT>=0){
  const nL=1+Math.ceil(aT/2);
  for(let i=0;i<nL;i++){ // 腰裙疊層：每層更外擴、更短，前片掛在 skF 上隨腿掀動
   const h=.6-.075*i,L=[.19,.19+.15*h/.7,h,.95-h/2,.72],o=.014*(i+1),m=i%2?tcd(aT,aD):tcl(aT,aD),len=.74+.07*i;
   [1,-1].forEach(q=>{const t0=q*(aD?.64:.46)-len/2;CY(...L,m,t0,len,o,skF);CY(...L,tmat(aT,aD),t0,.035,o+.006,skF);CY(...L,tmat(aT,aD),t0+len-.035,.035,o+.006,skF)});
   if(i>=1||aD)[1,-1].forEach(q=>CY(...L,m,q*1.55-.45,.9,o))}
  for(let i=0;i<Math.ceil(aT/2);i++){ // 胸前疊層
   const h=.44-.06*i,m=i%2?tcd(aT,aD):tcl(aT,aD),o=.014*(i+1);
   [1,-1].forEach(q=>{CY(.245,.245-.075*h/.56,h,1.38-h/2,.65,m,q*(aD?.66:.48)-.28,.56,o);CY(.245,.245-.075*h/.56,h,1.38-h/2,.65,tmat(aT,aD),q*(aD?.66:.48)-.28,.03,o+.006)})}
  [-1,1].forEach(s=>{ // 肩甲：半球布殼疊層 + 垂墜布條
   for(let i=0;i<1+Math.floor(aT/2);i++){const d=new THREE.Mesh(new THREE.SphereGeometry(.15+.028*i,16,8,0,6.283,0,1.45),i%2?tcd(aT,aD):tcl(aT,aD));
    d.position.set(s*.34,1.375+.012*i,0);d.scale.set(1,(aD?.8:.5)+.04*i,1.05);d.rotation.z=-s*(.18+.05*i);d.castShadow=true;g.add(d)}
   if(aT>=2){const f=flap(.16,.28+.05*aT,tcl(aT,aD),s);f.position.set(s*.43,1.34,0);f.rotation.y=s*1.5708;g.add(f)}});
  if(aT>=2&&aD)[-1,0,1].forEach(x=>{const f=flap(.09,.52+.04*aT-(x?.1:0),x?tcl(aT,aD):tcd(aT,aD),x);f.position.set(x*.1,0,.168);f.rotation.x=-.16;skF.add(f)});else if(aT>=2)for(let i=0;i<(aT>=4?2:1);i++){ // 腰前垂布（長的在後、短的在前）
   const f=flap(.2-.05*i,.55+.04*aT-.12*i,i||aT<4?tcl(aT,aD):tcd(aT,aD),i);f.position.set(0,0,.168+.014*i);f.rotation.x=-.16;skF.add(f)}
  if(aT>=3){const cp=new THREE.Group();cp.position.set(0,1.4,-.19);cp.rotation.x=.25;g.add(cp);g.cape=cp; // 披風布條疊層
   if(aD)[-1,1].forEach(s=>{const f=flap(.22,.85+.05*aT-(s>0?.15:0),tcd(aT,aD),s);f.position.set(s*.16,0,0);cp.add(f)});else cp.add(flap(.5,.8+.05*aT,tcd(aT,aD),0));
   if(aT>=4){const f2=flap(.36,.62+.05*aT,tcl(aT,aD),2);f2.position.set(0,-.02,.014);cp.add(f2)}
   if(aT>=5)[-1,1].forEach(s=>{const f=flap(.07,1,new THREE.MeshBasicMaterial({color:cl.g,side:THREE.DoubleSide}),s);f.position.set(s*.17,0,-.012);cp.add(f)})}
 }
 const _s0=new Set();g.traverse(o=>_s0.add(o)); // 快照：此刻以前建立的都屬於「舊身體」
 // ===== 武器 =====
 const wp=new THREE.Group();wp.position.set(0,-.3,.02);wp.scale.setScalar(1+(cl.w=='dagger'?.025:.07)*Math.max(wT,0));g.fore[1].add(wp);
 const wm=wT>=0?tmat(wT,wD):M(0xdfe6f0),stf=cl.w=='staff',nR=wT>=0?Math.min(3,Math.ceil((wT+1)/2)):0;
 g.rest=cl.w=='fist'?[{ru:-.4,rf:-1.2,sw:1},{ru:-.4,rf:-1.2}]:stf?[{ru:0,rf:-.15},{ru:-.3,rf:-.9}]:[{ru:0,rf:-.15},{ru:-.35,rf:-1.15}];
 const grip=()=>{cyl(.021,.021,.16,wT>=0?tcd(wT,wD):cloth(0x3a2a22),0,-.05,0,wp,10);sph(.03,gold,0,-.15,0,wp);for(let i=0;i<nR;i++)cyl(.026,.026,.02,i%2?tcl(wT,wD):tcd(wT,wD),0,-.01-.04*i,0,wp,10)},
  guard=r=>{mk(new THREE.TorusGeometry(r,.013,6,14,Math.PI),gold,0,.04,0,wp).rotation.set(0,Math.PI/2,Math.PI)};
 if(cl.w=='sword'){wp.rotation.x=Math.PI-.3;const L=.95+.03*Math.max(wT,0);mk(bladeGeo(L*(wD?.9:1),(.08+.01*Math.max(wT,0))*(wD?1.6:1),.014),wm,0,.04,0,wp);guard(wD?.15:.1);grip();
  if(wT>=2)mk(bladeGeo(L*.8,.022,.02),gold,0,.07,0,wp);if(wT>=3)sph(.035,glow,0,.04,0,wp);
  if(wT>=5)mk(new THREE.TorusGeometry(.12,.01,6,20),glow,0,.04,0,wp).rotation.y=Math.PI/2;rib(wp,0,.03,0,[tcl(wT,wD),tcd(wT,wD)],nR,.34)}
 else if(cl.w=='dagger'){wp.rotation.x=Math.PI-.3;const L=(.23+.012*Math.max(wT,0))*(wD?1.12:1);mk(bladeGeo(L,wD?.04:.05,.011),wm,0,.04,0,wp);if(wD)mk(bladeGeo(L*.55,.03,.01),wm,0,.04,.05,wp).rotation.x=-.3;guard(.065);grip();
  if(wT>=3)mk(bladeGeo(L*.6,.014,.016),glow,0,.07,0,wp);rib(wp,0,.03,0,[tcl(wT,wD),tcd(wT,wD)],nR,.26)}
 else if(stf&&k=='priest'){wp.rotation.x=1.2;cyl(.028,.028,1.6,tcd(wT,wD),0,.5,0,wp,8);
  mk(new THREE.TorusGeometry(.13,.028,8,18),wT>=0?wm:gold,0,1.42,0,wp);cyl(.014,.014,.28,gold,0,1.42,0,wp,8);cyl(.014,.014,.2,gold,0,1.46,0,wp,8).rotation.z=Math.PI/2;sph(.045,glow,0,1.42,0,wp);if(wD)[-1,1].forEach(q=>{const w=mk(new THREE.ConeGeometry(.06,.4,4),gold,q*.2,1.44,0,wp);w.rotation.z=-q*1.25;w.scale.z=.3});
  rib(wp,0,1.28,0,[tcl(wT,wD),tcd(wT,wD)],nR,.42);if(wT>=4)mk(new THREE.TorusGeometry(.24,.012,6,24),glow,0,1.42,0,wp)}
 else if(stf){wp.rotation.x=1.2;cyl(.03,.022,1.6,tcd(wT,wD),0,.5,0,wp,6);
  if(wD)mk(new THREE.TorusGeometry(.17,.022,8,20,Math.PI*1.4),wT>=0?wm:M(0x6b4a2a),0,1.38,0,wp).rotation.set(0,Math.PI/2,Math.PI*.8);else [0,1,2].forEach(i=>{const a=i*2.094;const c=mk(new THREE.ConeGeometry(.035,.34,4),wT>=0?wm:M(0x6b4a2a),Math.sin(a)*.1,1.3,Math.cos(a)*.1,wp);c.rotation.set(Math.cos(a)*.35,0,-Math.sin(a)*.35)});
  sph(.08+.008*Math.max(wT,0),glow,0,1.38,0,wp);if(wT>=3)sph(.035,wm,.14,1.5,0,wp);if(wT>=5)mk(new THREE.TorusGeometry(.18,.012,6,24),glow,0,1.38,0,wp);rib(wp,0,1.2,0,[tcl(wT,wD),tcd(wT,wD)],nR,.42)}
 else g.fore.forEach(f=>{const km=wt>=0?wm:gold,nW=wT>=0?1+Math.ceil(wT/2):1;
  for(let i=0;i<nW;i++){const wr=new THREE.Mesh(new THREE.CylinderGeometry(.068+.008*i,.072+.008*i,.05,14,1,true),i%2?(wT>=0?tcd(wT,wD):cloth(0x5a3a2a)):(wT>=0?tcl(wT,wD):cloth(0xb0845a)));wr.position.set(0,-.18-.042*i,0);wr.castShadow=true;f.add(wr)}
  [-.054,-.018,.018,.054].forEach(x=>sph(.024,km,x,-.35,.09,f));if(wD)[-.054,-.018,.018,.054].forEach(x=>{const c=mk(new THREE.ConeGeometry(.016,.14,5),km,x,-.4,.13,f);c.rotation.x=1.3});if(wT>=1)rib(f,0,-.2,-.06,[tcl(wT,wD),tcd(wT,wD)],Math.min(2,nR),.3,1)});
 

g.wp=wp;g.wp0=wp.rotation.x;if(stf){const tp=new THREE.Object3D();tp.position.set(0,1.4,0);wp.add(tp);g.tipO=tp}
{const mkO=(par,y)=>{const o=new THREE.Object3D();o.position.set(0,y,0);par.add(o);return o},mw=Math.max(wT,0);
 if(cl.w=='sword')g.bladeO=mkO(wp,.04+(.95+.03*mw)*(wD?.9:1));
 else if(cl.w=='dagger')g.bladeO=mkO(wp,.04+(.23+.012*mw)*(wD?1.12:1));
 g.fxF=[mkO(g.fore[0],-.42),mkO(g.fore[1],-.42)]}
const _s1=new Set();g.traverse(o=>_s1.add(o)); // 武器／拳套布條 = _s1 − _s0
if(E.boots){
  // 鞋子直接掛在原角色的腿／腳掌 Group 上。
  // 這樣走路時會跟著 hero.legs[0/1] 一起擺動，不會像固定在地上的裝備。
  const bc=bT>=0?tmat(bT,bD):rc(bt);
  heroBoots=[];
  g.legs.forEach((leg,q)=>{
    const shoeG=new THREE.Group();
    shoeG.position.set(0,-.23,.035);
    leg.shin.add(shoeG);
    heroBoots.push(shoeG);

    // 鞋身：以橢圓球貼住原本腳掌，而不是獨立世界座標。
    const shoe=new THREE.Mesh(new THREE.SphereGeometry(.145,20,12),bc);
    shoe.scale.set(.72,.48,1.12);
    shoe.position.set(0,.005,.045);
    shoe.castShadow=true;
    shoeG.add(shoe);

    // 圓潤鞋頭，沿原腳掌前方延伸。
    const toe=new THREE.Mesh(new THREE.SphereGeometry(.105,20,12),bc);
    toe.scale.set(.78,.50,1.18);
    toe.position.set(0,.005,.14);
    toe.castShadow=true;
    shoeG.add(toe);

    // 薄鞋底，仍然跟著腳掌節點移動。

    // 鞋口／短靴筒貼在原本小腿末端。
    const cuff=new THREE.Mesh(new THREE.CylinderGeometry(.095,.105,.13,18),bc);
    cuff.position.set(0,.10,0);
    cuff.castShadow=true;
    shoeG.add(cuff);
    const nB=1+Math.floor(bT/2);for(let i=0;i<nB;i++){const cf=new THREE.Mesh(new THREE.CylinderGeometry(.105+.008*(i+1)+(bD?.012:0),.115+.008*(i+1)+(bD?.012:0),.07,18,1,true),i%2?tcd(bT,bD):tcl(bT,bD));cf.position.set(0,.13+(bD?.07:.055)*i,0);cf.castShadow=true;shoeG.add(cf)}
    if(bD){const tc2=new THREE.Mesh(new THREE.ConeGeometry(.055,.2,8),tcl(bT,bD));tc2.rotation.x=Math.PI/2;tc2.position.set(0,.01,.24);shoeG.add(tc2)}
    if(bT>=2)rib(shoeG,bD?.11:0,.17,bD?0:-.1,[tcl(bT,bD),tcd(bT,bD)],Math.min(2,Math.ceil(bT/2)),.2+.03*bT,bD?0:1);
    if(bT>=4){const an=new THREE.Mesh(new THREE.TorusGeometry(.112,.012,6,18),glow);an.rotation.x=Math.PI/2;an.position.set(0,.1,0);shoeG.add(an)}
  });
}

const _s2=new Set();g.traverse(o=>_s2.add(o));
if(st>=3||at>=4){g.aura=new THREE.Mesh(new THREE.TorusGeometry(.7,.03,6,32),at>=4?rc(at):glow);g.aura.rotation.x=Math.PI/2;g.aura.position.y=.08;g.add(g.aura)}
 if(st>=5)[-1,1].forEach(q=>{const w=mk(new THREE.ConeGeometry(.12,.9,4),glow,q*.22,1.35,-.22);w.rotation.z=-q*.9;w.rotation.x=-.2;w.scale.z=.25});
const _s3=new Set();g.traverse(o=>_s3.add(o));g.userData.keep=new Set(); // 光環／翅膀 = _s3 − _s2
 [..._s1].forEach(o=>{if(!_s0.has(o))g.userData.keep.add(o)});[..._s3].forEach(o=>{if(!_s2.has(o))g.userData.keep.add(o)});
 const h=new THREE.Group();h.position.set(0,1.72,0);g.add(h);g.head=h;
 if(st>=7){const ha=new THREE.Mesh(new THREE.TorusGeometry(.2,.015,6,24),glow);ha.rotation.x=Math.PI/2;ha.position.y=.52;h.add(ha);g.userData.keep.add(ha)}
 if(k=='rogue'){const mm=new THREE.Mesh(new THREE.SphereGeometry(.275,20,8,Math.PI/2-1.1,2.2,1.95,.65),cloth(0x5a2a90));mm.scale.set(1,.98,.95);h.add(mm)}
 sph(.25,skin,0,0,0,h).scale.set(1,.98,.95);
 [-1,1].forEach(s=>sph(.055,skin,s*.25,-.02,0,h).scale.x=.5);
 const dc=new THREE.Mesh(new THREE.SphereGeometry(.262,32,24,Math.PI/2-.8,1.6,Math.PI/2-.65,1.7),new THREE.MeshLambertMaterial({map:FACE,transparent:true,depthWrite:false}));dc.scale.set(1,.98,.95);h.add(dc);


 sph(hs==2?.27:.285,hair,0,.035,-.045,h);
 const [len,up,bang,side,tl2,curl,ah,part]=HP[hs]||HP[0];
 const bl=(par,px,py,pz,dx,dy,dz,ln,wd,mt2)=>{const d=new V(dx,dy,dz).normalize(),z=new V().crossVectors(new V(1,0,0),d);if(z.lengthSq()<1e-4)z.set(0,0,1);z.normalize();const tx=new V().crossVectors(d,z).normalize(),m=new THREE.Mesh(SG,mt2);m.scale.set(wd,ln,wd*.35);m.position.set(px,py,pz).addScaledVector(d,ln/2);m.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(tx,d,z));m.castShadow=true;par.add(m);return m},pdx=i=>part?Math.sign(i)*.2:side*.12;
 const cn=(r,l,mt,x,y,z,d)=>{const m=mk(new THREE.ConeGeometry(r,l,5),mt,x,y,z,h);m.quaternion.setFromUnitVectors(Y,new V(d[0],d[1],d[2]).normalize());return m};
 const shard=(a,th,l,w,mt,lf,dx,fo)=>{const r0=fo||.27,t2=Math.min(2.2,th+l/(2*r0)*.95),
  n=new V(Math.sin(th)*Math.sin(a),Math.cos(th),Math.sin(th)*Math.cos(a)),n2=new V(Math.sin(t2)*Math.sin(a),Math.cos(t2),Math.sin(t2)*Math.cos(a)),
  d=new V(Math.cos(t2)*Math.sin(a),-Math.sin(t2),Math.cos(t2)*Math.cos(a)).addScaledVector(n2,lf).add(new V(dx,0,0)).normalize(),
  tx=new V(Math.cos(a),0,-Math.sin(a)),m=new THREE.Mesh(SG,mt);m.scale.set(w,l,w*.35);
  m.position.copy(n).multiplyScalar(r0).addScaledVector(d,l/2);if(!fo)m.position.add(new V(0,.035,-.045));
  m.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(tx,d,new V().crossVectors(tx,d).normalize()));h.add(m)};
 const mt=(i,j)=>(i+j)%4?hair:tip;
 [.3,.9,1.5,2.05].forEach((th,j)=>{const n=9+j*3;for(let i=0;i<n;i++){const a=(i+j%2*.5)/n*6.283+R(-.04,.04),fr=Math.cos(a),sd=Math.abs(Math.sin(a));
  if(th>.5&&fr>.2&&sd<.9)continue;if(th>1.2&&sd>.8&&len<.4)continue;if(th>1.8&&len<.2)continue;
  const l=Math.min(len>=.4?.6:.46,.2+len*.6+j*.04)*(i%2?1.12:.92)+(j<1?up*(i%2?1.2:.6):0);
  shard(a,th,l,.12+j*.012,mt(i,j),j<1?.2:.1,0)}});
 for(let i=-8;i<=8;i++){const a=i*.13+side*.12,k=1+side*i*.04,l=(.08+bang*.8)*k*(i%2?1.12:.82)*R(.92,1.08);
  shard(a,.5,l,.1,mt(i,0),.1,pdx(i),.276);shard(a+.07,.85,l*.55,.09,mt(i,1),.1,pdx(i)*.8,.27)}
 if(bang>.15)(side?[[side*.39,.4],[side*.18,.36],[side*.6,.32]]:[[-.39,.36],[.39,.36],[-.15,.32],[.15,.32],[0,.38]]).forEach(([a0,L],i)=>shard(a0,.5,L*R(.95,1.08),.095,mt(i,2),.1,0,.28));
 if(len>.1)[-1,1].forEach(q=>{[1.1,1.32].forEach((a,i)=>shard(q*a,1.1+i*.1,.2+len*.35,.08,mt(i,q+1),.1,0,.275))});
 if(len>=.4)[-1,1].forEach(q=>{for(let i=0;i<4;i++)shard(q*(1.6+i*.2),1.3+i*.1,len*.9*R(.9,1.1),.1,mt(i,q),.2,0)});
 if(curl)for(let i=0;i<12;i++){const a=R(0,6.28);let th=R(.2,1);if(Math.cos(a)>0&&th>.6)th=.4;sph(.07,i%3?hair:tip,Math.sin(th)*Math.sin(a)*.26,Math.cos(th)*.26+.04,Math.sin(th)*Math.cos(a)*.26-.04,h)}
 if(tl2==1)for(let i=-4;i<=4;i++)shard(Math.PI+i*.2,1.95,.44+R(0,.12)+(4-Math.abs(i))*.04,.09,mt(i,0),.05,0);
 if(tl2==2){sph(.075,hair,0,.2,-.28,h);mk(new THREE.TorusGeometry(.065,.015,5,10),gold,0,.18,-.27,h);[-1,0,1].forEach(i=>cn(.07,.75,i?tip:hair,i*.06,-.02,-.55,[i*.2,-.7,-1]))}
 if(tl2==3){sph(.085,hair,0,.33,-.04,h);mk(new THREE.TorusGeometry(.07,.013,5,10),gold,0,.29,-.04,h).rotation.x=Math.PI/2}
 if(ah)for(let i=0;i<ah;i++)bl(h,i?-.1:.03,.28,i?.06:.04,i?-.55:.3,1,i?.5:.35,i?.24:.34,.07,i?hair:tip);
 if(tl2==4){const pv=new THREE.Group();pv.position.set(0,.31,-.2);h.add(pv);sph(.1,hair,0,0,0,pv);mk(new THREE.TorusGeometry(.085,.016,6,14),gold,0,.01,0,pv).rotation.x=Math.PI/2;
  for(let i=-5;i<=5;i++){const ai=Math.abs(i),x=i*.02,l1=.2+(5-ai)*.012,l2=.5+(5-ai)*.07+(i%2?.06:0),m2=mt(i,3);bl(pv,x,0,0,i*.05,.12,-1,l1,.12,m2);bl(pv,x+i*.01,.03,-l1,i*.11,-1,-.3,l2,.115,m2)}
  if(g.tails)g.tails.push(pv);
  [-1,1].forEach(q=>[.95,1.12,1.3].forEach((a0,i)=>shard(q*a0,1.0+i*.06,.5+i*.07+R(0,.06),.085,mt(i,q+1),.1,0,.275)))}
 if(tl2==5){for(let t=0;t<4;t++){const n=11-t;for(let i=0;i<n;i++){const k=(i/(n-1)-.5)*2,a=Math.PI+k*(1.15-t*.12),L=.26+t*.12+(1-Math.abs(k))*.18+R(0,.06);shard(a,1.75+t*.22,L,.115,mt(i,t),.1,0)}}
  [-1,1].forEach(q=>[1.25,1.45].forEach((a0,i)=>shard(q*a0,1.3+i*.12,.55+i*.1,.1,mt(i,q+1),.15,0,.275)))}
 {const up=new THREE.Group();up.position.y=.85;g.children.slice().forEach(c=>{if(g.legs.includes(c)||c===g.aura)return;g.remove(c);c.position.y-=.85;up.add(c)});g.add(up);g.up=up}
 g.scale.setScalar(.85);return g}
/* 有骨架模型資料時，把方塊人換成骨架模型（動畫參數仍由 hero-anim.js 驅動）；沒有就維持舊外觀 */
function makeHero(k,lv,hs){const g=makeHeroProc(k,lv,hs);return HeroModel.ready?HeroModel.dress(g,k):g}
let hero;
function rebuild(){
 const p=hero&&hero.position?hero.position.clone():new THREE.Vector3(0,0,0),r=hero&&Number.isFinite(hero.rotation.y)?hero.rotation.y:0;
 if(hero){scene.remove(hero);try{hero.traverse(o=>{if(o.geometry)o.geometry.dispose()})}catch(_){}}
 S.cls=CL[S.cls]?S.cls:'warrior';S.hs=Number.isInteger(S.hs)&&S.hs>=0?S.hs%HS.length:0;S.hc=Number.isInteger(S.hc)&&S.hc>=0&&S.hc<HC.length?S.hc:0;
 hero=makeHero(S.cls,Math.max(1,Number(S.lv)||1),S.hs);
 hero.position.copy(p);hero.rotation.y=r;hero.visible=true;hero.traverse(o=>o.visible=true);
 scene.add(hero);ui()}
