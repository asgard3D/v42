/* 增益外觀：每個增益在主角身上的「持續」視覺效果
   ① 腳下旋轉魔法陣（內圈＋反向外圈符文）  ② 身體發光（疊加所有增益的光色，隱身則半透明）
   ③ 頭頂紋章（多個增益並排）  ④ 護罩（防禦類）  ⑤ 光柱  ⑥ 環繞／上升／飄落粒子
   資料在 data/buff-fx.js（BUFF_FX）；增益清單讀 Skills.activeBuffs(S)。
   增益開始 → 淡入＋彈出；剩餘 4 秒 → 閃爍（與增益列一致）；結束 → 淡出後釋放資源。
   依賴：THREE、scene、cam、hero、gH、S、Skills、BUFF_FX（皆為全域）。 */
const BuffFx=(()=>{
 const TAU=Math.PI*2,css=c=>'#'+c.toString(16).padStart(6,'0'),TEX={};
 const cv=n=>{const c=document.createElement('canvas');c.width=c.height=n;return c};
 const mkTex=(key,n,fn)=>TEX[key]||(TEX[key]=(()=>{const c=cv(n),x=c.getContext('2d');fn(x,n);return new THREE.CanvasTexture(c)})());
 const rn=i=>{const s=Math.sin(i*127.1+311.7)*43758.5453;return s-Math.floor(s)};
 const gcd=(a,b)=>b?gcd(b,a%b):a;

 /* ---------- 魔法陣貼圖（單位圓半徑=1） ---------- */
 function circleTex(t,c1,c2){return mkTex('c'+t+c1+c2,512,(x,n)=>{
  x.translate(n/2,n/2);x.scale(n/2-8,n/2-8);x.lineCap='round';x.lineJoin='round';x.shadowColor=c1;x.shadowBlur=10;
  const S=(c,w)=>{x.strokeStyle=c||c1;x.lineWidth=w;x.stroke()},
  ring=(r,w,c)=>{x.beginPath();x.arc(0,0,r,0,TAU);S(c,w)},
  poly=(k,r,rot,w,c)=>{x.beginPath();for(let i=0;i<=k;i++){const a=rot+i/k*TAU;x[i?'lineTo':'moveTo'](Math.cos(a)*r,Math.sin(a)*r)}S(c,w)},
  star=(k,s,r,rot,w,c)=>{const g=gcd(k,s),m=k/g;x.beginPath();for(let j=0;j<g;j++)for(let i=0;i<=m;i++){const a=rot+((j+i*s)%k)/k*TAU;x[i?'lineTo':'moveTo'](Math.cos(a)*r,Math.sin(a)*r)}S(c,w)},
  ticks=(k,r1,r2,w,c,rot)=>{x.beginPath();for(let i=0;i<k;i++){const a=(rot||0)+i/k*TAU;x.moveTo(Math.cos(a)*r1,Math.sin(a)*r1);x.lineTo(Math.cos(a)*r2,Math.sin(a)*r2)}S(c,w)},
  dots=(k,r,rad,c,rot)=>{x.fillStyle=c||c1;for(let i=0;i<k;i++){const a=(rot||0)+i/k*TAU;x.beginPath();x.arc(Math.cos(a)*r,Math.sin(a)*r,rad,0,TAU);x.fill()}},
  rays=(k,r1,r2,hw,c)=>{x.fillStyle=c||c1;for(let i=0;i<k;i++){const a=i/k*TAU,L=typeof r2==='function'?r2(i):r2;x.beginPath();x.moveTo(Math.cos(a-hw)*r1,Math.sin(a-hw)*r1);x.lineTo(Math.cos(a)*L,Math.sin(a)*L);x.lineTo(Math.cos(a+hw)*r1,Math.sin(a+hw)*r1);x.closePath();x.fill()}},
  arcs=(r,a0,a1,w,c)=>{x.beginPath();x.arc(0,0,r,a0,a1);S(c,w)};
  switch(t){
   case'shield':ring(.95,.03);ring(.88,.012,c2);poly(6,.8,0,.03);star(6,2,.8,0,.025,c2);dots(6,.8,.05);ring(.42,.02);dots(6,.42,.035,c2,.5);break;
   case'rune':ring(.92,.03);ring(.78,.015,c2);ticks(48,.93,.99,.012);
    x.beginPath();for(let i=0;i<30;i++){const a=i/30*TAU,r0=.6+rn(i)*.04,r1=.72-rn(i+9)*.05,d=(rn(i+3)-.5)*.1;x.moveTo(Math.cos(a)*r0,Math.sin(a)*r0);x.lineTo(Math.cos(a+d)*r1,Math.sin(a+d)*r1);if(i%3==0){x.moveTo(Math.cos(a-.04)*r1,Math.sin(a-.04)*r1);x.lineTo(Math.cos(a+.04)*r1,Math.sin(a+.04)*r1)}}S(c1,.022);
    ring(.52,.02);poly(3,.5,-1.57,.022,c2);poly(3,.5,1.57,.022,c2);break;
   case'pent':ring(.95,.035);ring(.82,.015,c2);star(5,2,.82,-1.57,.035);dots(5,.82,.06,c2,-1.57);ring(.32,.02);ticks(5,.82,1,.025,c1,-1.57+.63);break;
   case'fortress':poly(4,.82,Math.PI/4,.035);poly(4,.82,0,.035);ring(.95,.025);ring(.56,.02,c2);
    x.beginPath();for(let i=0;i<24;i++){const a=i/24*TAU;if(i%2==0){x.moveTo(Math.cos(a)*.88,Math.sin(a)*.88);x.lineTo(Math.cos(a)*.99,Math.sin(a)*.99)}}S(c1,.03);dots(4,.82,.05,c2,0);break;
   case'crescent':for(let i=0;i<3;i++){const a=i/3*TAU-1.57,cx=Math.cos(a)*.6,cy=Math.sin(a)*.6;x.save();x.shadowBlur=0;x.fillStyle=c1;x.beginPath();x.arc(cx,cy,.25,0,TAU);x.fill();
     x.globalCompositeOperation='destination-out';x.beginPath();x.arc(cx+Math.cos(a)*.11,cy+Math.sin(a)*.11,.21,0,TAU);x.fill();x.restore()}
    ring(.95,.03);ring(.86,.012,c2);poly(3,.34,-1.57,.025,c2);poly(3,.34,1.57,.025,c2);dots(3,.88,.04,c2,-1.57+1.05);break;
   case'wind':for(let k=0;k<4;k++){x.beginPath();for(let i=0;i<=40;i++){const u=i/40,r=.12+u*.78,a=k*TAU/4+u*2.8;x[i?'lineTo':'moveTo'](Math.cos(a)*r,Math.sin(a)*r)}S(k%2?c2:c1,.04-.02*(k%2))}
    ring(.95,.02);ticks(24,.9,.99,.012,c2);break;
   case'poison':poly(6,.9,0,.03);ring(.95,.012,c2);for(let i=0;i<3;i++){const a=i/3*TAU-1.57;x.beginPath();x.arc(Math.cos(a)*.3,Math.sin(a)*.3,.34,0,TAU);S(c1,.03)}
    ring(.14,.03,c2);dots(6,.9,.05,c2);dots(3,.72,.07,c2,-1.57+1.05);break;
   case'holycross':ring(.95,.03);ring(.86,.012,c2);x.beginPath();x.moveTo(0,-.86);x.lineTo(0,.86);x.moveTo(-.86,0);x.lineTo(.86,0);S(c1,.045);
    dots(4,.86,.07,c2,0);ring(.36,.025,c2);ticks(4,.5,.66,.03,c1,Math.PI/4);poly(4,.36,Math.PI/4,.015,c2);break;
   case'sun':ring(.96,.02);ring(.82,.03,c2);ring(.46,.03);rays(16,.5,i=>i%2?.72:.9,.09,c1);ticks(16,.84,.95,.015,c2,.2);break;
   case'life':ring(.95,.025);ring(.88,.012,c2);for(let i=0;i<8;i++){const a=i/8*TAU;x.save();x.rotate(a);x.beginPath();x.ellipse(.55,0,.32,.13,0,0,TAU);S(c1,.025);x.restore()}ring(.26,.03,c2);dots(8,.86,.04,c2);break;
   case'star':star(8,3,.88,0,.03);ring(.95,.025,c2);ring(.4,.02);ticks(8,.4,.52,.03,c2,.39);dots(8,.88,.045,c2);break;
   case'halo':ring(.97,.03);ring(.88,.015,c2);ring(.62,.02);rays(12,.64,.84,.07,c2);star(6,2,.58,0,.02);dots(12,.93,.03,c2,.26);ticks(36,.9,.94,.01);break;
   case'bagua':ring(.97,.02);ring(.5,.02,c2);ring(.6,.012);for(let i=0;i<8;i++){const a=i/8*TAU+.39;for(let j=0;j<3;j++){const r=.68+j*.09;if((i>>j)&1){arcs(r,a-.2,a+.2,.035)}else{arcs(r,a-.2,a-.03,.035);arcs(r,a+.03,a+.2,.035)}}}
    x.beginPath();x.arc(0,0,.3,0,TAU);S(c1,.02);x.fillStyle=c2;x.beginPath();x.arc(0,-.15,.08,0,TAU);x.fill();x.beginPath();x.arc(0,.15,.08,0,TAU);x.fill();break;
   case'flame':ring(.62,.035);ring(.5,.015,c2);for(let i=0;i<8;i++){const a=i/8*TAU;x.fillStyle=c1;x.globalAlpha=.55;x.beginPath();x.moveTo(Math.cos(a-.24)*.66,Math.sin(a-.24)*.66);
     x.quadraticCurveTo(Math.cos(a-.05)*.9,Math.sin(a-.05)*.9,Math.cos(a+.18)*.99,Math.sin(a+.18)*.99);x.quadraticCurveTo(Math.cos(a+.12)*.8,Math.sin(a+.12)*.8,Math.cos(a+.24)*.66,Math.sin(a+.24)*.66);x.closePath();x.fill();x.globalAlpha=1;S(c2,.015)}
    poly(8,.4,0,.02,c2);star(8,3,.4,0,.015);break;
   case'outer':ring(.97,.02);ring(.9,.01,c2);ticks(60,.9,.97,.01);
    x.beginPath();for(let i=0;i<36;i++){const a=i/36*TAU,d=(rn(i+5)-.5)*.08,r0=.78,r1=.86-rn(i+1)*.04;x.moveTo(Math.cos(a)*r0,Math.sin(a)*r0);x.lineTo(Math.cos(a+d)*r1,Math.sin(a+d)*r1)}S(c2,.02);break}
 })}

 /* ---------- 頭頂紋章貼圖（圓形徽章＋圖樣） ---------- */
 function emblemTex(e,c1,c2){return mkTex('e'+e.t+(e.ch||'')+c1+c2,128,(x,n)=>{
  const g=x.createRadialGradient(64,64,30,64,64,64);g.addColorStop(0,c1+'cc');g.addColorStop(.7,c1+'44');g.addColorStop(1,c1+'00');x.fillStyle=g;x.fillRect(0,0,n,n);
  x.fillStyle='rgba(8,10,24,.78)';x.beginPath();x.arc(64,64,47,0,TAU);x.fill();
  x.strokeStyle=c1;x.lineWidth=4;x.beginPath();x.arc(64,64,47,0,TAU);x.stroke();x.lineWidth=1.5;x.strokeStyle=c2;x.beginPath();x.arc(64,64,42,0,TAU);x.stroke();
  x.save();x.translate(64,66);x.scale(31,31);x.lineCap='round';x.lineJoin='round';
  const F=(fill,stroke,w)=>{x.fillStyle=fill;x.fill();x.strokeStyle=stroke;x.lineWidth=w||.1;x.stroke()},
  shield=()=>{x.beginPath();x.moveTo(0,-1);x.lineTo(.85,-.65);x.lineTo(.85,.1);x.quadraticCurveTo(.85,.75,0,1.1);x.quadraticCurveTo(-.85,.75,-.85,.1);x.lineTo(-.85,-.65);x.closePath();F(c2,c1)},
  heart=()=>{x.beginPath();x.moveTo(0,.9);x.bezierCurveTo(-1.25,.1,-.8,-.95,0,-.35);x.bezierCurveTo(.8,-.95,1.25,.1,0,.9);x.closePath();F(c1,c2,.08)},
  wing=(s)=>{x.save();x.scale(s,1);for(let i=0;i<4;i++){x.save();x.translate(-.15,.55);x.rotate(-.35-i*.3);x.beginPath();x.ellipse(.55,0,.75-i*.1,.17,0,0,TAU);F(c2,c1,.06);x.restore()}x.restore()};
  switch(e.t){
   case'shield':shield();x.beginPath();x.moveTo(0,-.7);x.lineTo(0,.85);x.strokeStyle=c1;x.lineWidth=.08;x.stroke();break;
   case'shieldcross':shield();x.fillStyle=c1;x.fillRect(-.12,-.6,.24,1.2);x.fillRect(-.5,-.2,1,.24);break;
   case'tower':x.beginPath();x.rect(-.6,-.15,1.2,1.15);F(c2,c1,.09);[-.6,-.16,.28].forEach(a=>{x.beginPath();x.rect(a,-.62,.32,.47);F(c2,c1,.07)});x.beginPath();x.arc(0,1,.28,Math.PI,0);x.lineTo(.28,1);x.lineTo(-.28,1);x.closePath();x.fillStyle=c1;x.fill();break;
   case'heart':heart();break;
   case'heartplus':heart();x.fillStyle=c2;x.fillRect(-.1,-.15,.2,.7);x.fillRect(-.35,.1,.7,.2);break;
   case'swords':[1,-1].forEach(s=>{x.save();x.scale(s,1);x.beginPath();x.moveTo(-.85,.85);x.lineTo(.7,-.7);x.strokeStyle=c1;x.lineWidth=.3;x.stroke();x.strokeStyle=c2;x.lineWidth=.14;x.stroke();
     x.beginPath();x.moveTo(-.65,.35);x.lineTo(-.25,.75);x.strokeStyle=c1;x.lineWidth=.2;x.stroke();x.restore()});break;
   case'eye':x.beginPath();x.moveTo(-.98,0);x.quadraticCurveTo(0,-.95,.98,0);x.quadraticCurveTo(0,.95,-.98,0);F(c2,c1,.07);x.fillStyle=c1;x.beginPath();x.arc(0,0,.34,0,TAU);x.fill();
    x.beginPath();x.moveTo(-.8,.8);x.lineTo(.8,-.8);x.strokeStyle='#0a0a18';x.lineWidth=.3;x.stroke();x.strokeStyle=c1;x.lineWidth=.12;x.stroke();break;
   case'wing':x.translate(0,-.1);wing(1);break;
   case'wings':x.translate(0,-.05);x.scale(.85,.85);x.save();x.translate(-.12,0);wing(-1);x.restore();x.save();x.translate(.12,0);wing(1);x.restore();x.beginPath();x.arc(0,.1,.2,0,TAU);x.fillStyle=c1;x.fill();break;
   case'drop':x.beginPath();x.moveTo(0,-1);x.bezierCurveTo(.25,-.5,.85,.05,.85,.4);x.arc(0,.4,.85,0,Math.PI,false);x.bezierCurveTo(-.85,.05,-.25,-.5,0,-1);F(c1,c2,.08);
    x.fillStyle=c2;x.beginPath();x.arc(-.3,.3,.14,0,TAU);x.fill();x.beginPath();x.arc(.28,.6,.09,0,TAU);x.fill();break;
   case'crit':x.beginPath();for(let i=0;i<8;i++){const a=i/8*TAU-1.57,r=i%2?.3:1.05;x[i?'lineTo':'moveTo'](Math.cos(a)*r,Math.sin(a)*r)}x.closePath();F(c2,c1,.07);x.fillStyle=c1;x.beginPath();x.arc(0,0,.22,0,TAU);x.fill();break;
   case'crown':x.beginPath();x.moveTo(-.85,.6);x.lineTo(-.85,-.15);x.lineTo(-.42,.2);x.lineTo(0,-.55);x.lineTo(.42,.2);x.lineTo(.85,-.15);x.lineTo(.85,.6);x.closePath();F(c2,c1,.08);
    x.fillStyle=c1;[-.55,0,.55].forEach(a=>{x.beginPath();x.arc(a,.35,.1,0,TAU);x.fill()});x.beginPath();x.ellipse(0,-.88,.5,.14,0,0,TAU);x.strokeStyle=c2;x.lineWidth=.1;x.stroke();break;
   case'ankh':x.beginPath();x.arc(0,-.42,.38,0,TAU);x.moveTo(0,-.04);x.lineTo(0,1);x.moveTo(-.6,.22);x.lineTo(.6,.22);x.strokeStyle=c1;x.lineWidth=.28;x.stroke();x.strokeStyle=c2;x.lineWidth=.12;x.stroke();break;
   case'text':x.restore();x.save();x.translate(64,67);x.font='bold 62px "Noto Sans TC","Microsoft JhengHei","PingFang TC",sans-serif';x.textAlign='center';x.textBaseline='middle';
    x.lineWidth=7;x.strokeStyle=c1;x.lineJoin='round';x.strokeText(e.ch||'?',0,0);x.fillStyle=c2;x.fillText(e.ch||'?',0,0);break}
  x.restore()})}
 const softTex=()=>mkTex('soft',64,(x,n)=>{const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.4,'rgba(255,255,255,.5)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,n,n)});
 const pillarTex=()=>mkTex('pillar',64,(x,n)=>{const g=x.createLinearGradient(0,0,0,n);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.55,'rgba(255,255,255,.22)');g.addColorStop(1,'rgba(255,255,255,.95)');x.fillStyle=g;x.fillRect(0,0,n,n)});

 /* ---------- 建立／釋放 ---------- */
 const AD=THREE.AdditiveBlending,add=(o,p)=>{p.add(o);return o};
 const am=(map,c,o)=>new THREE.MeshBasicMaterial({map,color:c==null?0xffffff:c,transparent:true,opacity:o==null?1:o,blending:AD,depthWrite:false,side:THREE.DoubleSide});
 let seq=0;const rigs=new Map();
 function mkRig(id){const f=BUFF_FX[id],c1=css(f.col),c2=css(f.col2||f.col),root=new THREE.Group(),r={id,f,root,seq:seq++,k:0,t:99,on:true,parts:{}};
  const cp=f.circle,cm=new THREE.Mesh(new THREE.PlaneGeometry(2,2),am(circleTex(cp.t,c1,c2)));cm.rotation.x=-Math.PI/2;cm.position.y=.05+(r.seq%5)*.004;cm.scale.set(cp.r,cp.r,1);add(cm,root);r.parts.circle=cm;
  const om=new THREE.Mesh(new THREE.PlaneGeometry(2,2),am(circleTex('outer',c2,c1)));om.rotation.x=-Math.PI/2;om.position.y=.045+(r.seq%5)*.004;om.scale.set(cp.r*1.22,cp.r*1.22,1);add(om,root);r.parts.outer=om;
  if(f.pillar){const m=new THREE.Mesh(new THREE.CylinderGeometry(.8,.95,3.4,28,1,true),am(pillarTex(),f.col));m.position.y=1.7;add(m,root);r.parts.pillar=m}
  if(f.dome){const g=new THREE.Group();g.position.y=1;
   if(f.dome.t==='hex'){const w=new THREE.Mesh(new THREE.IcosahedronGeometry(f.dome.r,1),new THREE.MeshBasicMaterial({color:f.col,wireframe:true,transparent:true,opacity:.4,blending:AD,depthWrite:false}));
    const s=new THREE.Mesh(new THREE.SphereGeometry(f.dome.r*.98,20,14),am(null,f.col,.07));g.add(w,s);g.userData={w,s}}
   else{const rs=[0,1,2].map(i=>{const t=new THREE.Mesh(new THREE.TorusGeometry(f.dome.r,.022,6,56),am(null,i==1?f.col2:f.col,.7));t.rotation.set(i*1.05,i*.7,i*.4);g.add(t);return t});g.userData={rs}}
   add(g,root);r.parts.dome=g}
  const n=f.ptc.n,geo=new THREE.BufferGeometry(),pos=new Float32Array(n*3),col=new Float32Array(n*3),cA=new THREE.Color(f.col),cB=new THREE.Color(f.col2||f.col);
  r.ph=[];r.an=[];r.rd=[];r.bc=[];for(let i=0;i<n;i++){r.ph.push(Math.random());r.an.push(Math.random()*TAU);r.rd.push(.45+Math.random()*.55);const c=i%2?cB:cA;r.bc.push(c.r,c.g,c.b)}
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3));geo.setAttribute('color',new THREE.BufferAttribute(col,3));
  const smoke=f.ptc.t==='smoke',pt=new THREE.Points(geo,new THREE.PointsMaterial({size:smoke?.6:f.ptc.t==='bubble'?.2:.16,map:softTex(),vertexColors:true,transparent:true,opacity:smoke?.5:.95,depthWrite:false,blending:AD,sizeAttenuation:true}));
  pt.frustumCulled=false;add(pt,root);r.parts.pts=pt;r.n=n;
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:emblemTex(f.emblem,c1,c2),transparent:true,depthTest:false,depthWrite:false,opacity:0}));sp.renderOrder=20;sp.scale.set(.01,.01,1);add(sp,root);r.parts.emb=sp;
  scene.add(root);return r}
 function freeRig(r){scene.remove(r.root);r.root.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose()})}

 /* ---------- 粒子 ---------- */
 function ptcUpdate(r,t,vis){const P=r.parts.pts,pa=P.geometry.attributes.position,ca=P.geometry.attributes.color,a=pa.array,c=ca.array,ty=r.f.ptc.t,t0=t*(r.f.ptc.sp||1);
  for(let i=0;i<r.n;i++){const ph=r.ph[i],an=r.an[i],rd=r.rd[i];let x,y,z,fa=1;
   switch(ty){
    case'rise':{const u=(ph+t0*.28)%1;y=u*2.8;const q=rd*.85*(1-u*.4);x=Math.cos(an+u*2)*q;z=Math.sin(an+u*2)*q;fa=Math.sin(Math.PI*u);break}
    case'orbit':{const q=1.05+Math.sin(ph*30)*.12,aa=an+t0*(i%2?1:-1)*.9;x=Math.cos(aa)*q;z=Math.sin(aa)*q;y=.35+ph*1.5+Math.sin(t*2+ph*20)*.1;break}
    case'swirl':{const u=(ph+t0*.25)%1;y=.1+u*2.6;const q=.95-u*.25,aa=an+t0*1.3-u*4;x=Math.cos(aa)*q;z=Math.sin(aa)*q;fa=Math.sin(Math.PI*u);break}
    case'fall':{const u=(ph+t0*.22)%1;y=3-u*3;const q=rd*1.15;x=Math.cos(an)*q+Math.sin(t*1.5+ph*9)*.08;z=Math.sin(an)*q;fa=Math.sin(Math.PI*u);break}
    case'spark':{const u=(ph+t0*.45)%1;y=.1+u*2.2;const q=.5+rd*.55;x=Math.cos(an+t*.8)*q;z=Math.sin(an+t*.8)*q;fa=Math.sin(Math.PI*u)*(.6+.4*Math.sin(t*20+ph*50));break}
    case'smoke':{const u=(ph+t0*.15)%1;y=.2+u*2;const q=.3+u*.8*rd;x=Math.cos(an+u)*q;z=Math.sin(an+u)*q;fa=Math.sin(Math.PI*u);break}
    default:{const u=(ph+t0*.3)%1;y=.1+u*2.4;const q=.7*rd;x=Math.cos(an)*q+Math.sin(t*3+ph*30)*.1;z=Math.sin(an)*q+Math.cos(t*2.6+ph*20)*.1;fa=Math.sin(Math.PI*u)}}
   a[i*3]=x;a[i*3+1]=y;a[i*3+2]=z;const m=Math.max(0,fa)*vis;c[i*3]=r.bc[i*3]*m;c[i*3+1]=r.bc[i*3+1]*m;c[i*3+2]=r.bc[i*3+2]*m}
  pa.needsUpdate=true;ca.needsUpdate=true}

 /* ---------- 角色身體：發光／半透明（記錄原值，增益結束後還原） ---------- */
 const MO=new WeakMap(),gc=new THREE.Color(),tmpC=new THREE.Color();let applied=false;
 function heroMats(fn){hero.traverse(o=>{const ms=o.material;if(!ms)return;(Array.isArray(ms)?ms:[ms]).forEach(fn)})}
 function applyHero(glow,alpha){
  heroMats(m=>{let o=MO.get(m);if(!o){o={e:m.emissive?m.emissive.clone():null,i:m.emissiveIntensity,op:m.opacity,tr:m.transparent,fl:false};MO.set(m,o)}
   if(glow&&o.e){tmpC.copy(o.e).multiplyScalar(o.i==null?1:o.i);m.emissive.copy(tmpC).add(glow);m.emissiveIntensity=1}
   else if(o.e){m.emissive.copy(o.e);if(o.i!=null)m.emissiveIntensity=o.i}
   if(alpha<.999){if(!o.fl){o.fl=true;m.transparent=true;m.needsUpdate=true}m.opacity=o.op*alpha}
   else if(o.fl){o.fl=false;m.transparent=o.tr;m.opacity=o.op;m.needsUpdate=true}})}

 /* ---------- 每幀 ---------- */
 const _r=new THREE.Vector3();
 function update(dt,T){
  const play=S.mode==='play'&&hero,on={};
  if(play)Skills.activeBuffs(S).forEach(b=>{if(BUFF_FX[b.id])on[b.id]=b});
  for(const id in on)if(!rigs.has(id))rigs.set(id,mkRig(id));
  if(!rigs.size){if(applied&&hero){applyHero(null,1);applied=false}return}
  const hp=hero.position,gy=gH(hp.x,hp.z);_r.setFromMatrixColumn(cam.matrixWorld,0);
  const list=[...rigs.values()].sort((a,b)=>a.seq-b.seq);let alpha=1;gc.setRGB(0,0,0);
  list.forEach((r,idx)=>{const b=on[r.id];r.on=!!b;if(b)r.t=b.t;
   r.k+=((b?1:0)-r.k)*Math.min(1,dt*(b?5:3.5));
   if(!b&&r.k<.03){freeRig(r);rigs.delete(r.id);return}
   const f=r.f,P=r.parts,blink=r.on&&r.t<4?.55+.45*Math.sin(T*14):1,vis=r.k*blink,pul=1+.3*Math.sin(T*(f.pulse||3)+r.seq);
   r.root.position.set(hp.x,gy,hp.z);
   P.circle.rotation.z=T*f.circle.spd;P.circle.material.opacity=Math.min(1,vis*(.8+.2*Math.sin(T*2+r.seq)));
   P.circle.scale.setScalar(f.circle.r*(.6+.4*Math.min(1,r.k*1.4)));
   P.outer.rotation.z=-T*f.circle.spd*.6;P.outer.material.opacity=vis*.55;P.outer.scale.setScalar(f.circle.r*1.22*(.6+.4*Math.min(1,r.k*1.4)));
   if(P.pillar){P.pillar.rotation.y=T*.6;P.pillar.material.opacity=Math.min(1,f.pillar*vis*(.75+.25*Math.sin(T*3+r.seq)))}
   if(P.dome){const d=P.dome,u=d.userData;d.scale.setScalar(.9+.1*r.k+.015*Math.sin(T*3+r.seq));
    if(u.w){d.rotation.y=T*.4;u.w.material.opacity=vis*(.3+.12*Math.sin(T*2.4));u.s.material.opacity=vis*.07}
    else u.rs.forEach((t,i)=>{t.rotation.x+=dt*(.6+i*.3);t.rotation.y+=dt*(.9-i*.25);t.material.opacity=vis*.7})}
   ptcUpdate(r,T,vis);
   const em=P.emb,n=list.length,lx=(idx-(n-1)/2)*.64,pop=r.k<1?1+Math.sin(Math.min(1,r.k)*Math.PI)*.25:1;
   em.position.set(_r.x*lx,2.6+Math.sin(T*2+idx)*.05,_r.z*lx);em.scale.setScalar(.62*Math.min(1,r.k*1.3)*pop);em.material.opacity=Math.min(1,vis);em.material.rotation=Math.sin(T*1.6+idx)*.08;
   const g=f.glow*vis*pul;tmpC.set(f.col);gc.r+=tmpC.r*g;gc.g+=tmpC.g*g;gc.b+=tmpC.b*g;
   if(f.alpha!=null)alpha=Math.min(alpha,1-(1-f.alpha)*Math.min(1,r.k))});
  gc.r=Math.min(1,gc.r);gc.g=Math.min(1,gc.g);gc.b=Math.min(1,gc.b);
  applyHero(gc,alpha);applied=true};
 return{update,rigs}})();
