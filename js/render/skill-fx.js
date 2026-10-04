/* 各技能專屬特效：依技能 id 對應（SKFX[id]），沒有對應的技能才退回 vfx.js 的類型通用特效。
   簽名：SKFX[id](sk, tm, c, hp, tp, col, rad)
   tm=目標怪物（可為 null）｜c=範圍中心（無 at 的範圍技＝施放者位置）｜hp=施放者位置｜tp=目標位置（可為 null）
   依賴 vfx.js 的 vf/bm/fade/burst/pillar/trail/tor/ring 與全域 cam、mons、R、shk */
const SKFX={};
(()=>{
const PI=Math.PI,V3=(x,y,z)=>new THREE.Vector3(x,y,z),U=p=>p.clone().setY(1),later=(f,ms)=>ms?setTimeout(f,ms):f();
const am=(c,o,map)=>new THREE.MeshBasicMaterial({color:c,map:map||null,transparent:true,opacity:o==null?1:o,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending});
const _tx={},ctex=(key,draw,n)=>_tx[key]||(_tx[key]=(()=>{const c=document.createElement('canvas');c.width=c.height=n;draw(c.getContext('2d'),n);return new THREE.CanvasTexture(c)})());
const near=(c,r)=>mons.filter(m=>!m.dead&&m.g.position.distanceTo(c)<r);
const bill=(o,rot)=>{o.quaternion.copy(cam.quaternion);if(rot)o.rotateZ(rot)};
const env=k=>k<.15?k/.15:k>.65?(1-k)/.35:1;

/* ---------- 基本元件 ---------- */
const glowTex=()=>ctex('glow',(x,n)=>{const g=x.createRadialGradient(n/2,n/2,0,n/2,n/2,n/2);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.35,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,n,n)},64);
function flash(p,col,sz,life,dl){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex(),color:col,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));
 s.position.copy(p);vf(s,life||.25,(o,k)=>{o.scale.setScalar(sz*(.4+k*.9));o.material.opacity=1-k},dl||0)}
const tap=(L,W)=>{const s=new THREE.Shape();s.moveTo(-L/2,0);s.lineTo(0,W/2);s.lineTo(L/2,0);s.lineTo(0,-W/2);s.closePath();return new THREE.ShapeGeometry(s)};
/* 面向鏡頭的銳利光痕（斬擊／突刺／拳風） */
function streak(p,col,len,w,rot,life,dl,hold){const m=new THREE.Mesh(tap(len,w),am(col,1)),h=hold==null?.35:hold;m.position.copy(p);
 vf(m,life||.22,(o,k)=>{bill(o,rot);o.scale.set(Math.min(1,k*5)*(1+k*.15),1-k*.5,1);fade(o,k<h?1:1-(k-h)/(1-h))},dl||0)}
/* 貼地光痕（衝鋒氣流、地裂） */
function gstreak(p,col,len,w,ang,life,dl){const m=new THREE.Mesh(tap(len,w),am(col,.9));m.position.set(p.x,.08,p.z);m.rotation.set(-PI/2,0,ang);
 vf(m,life||.3,(o,k)=>{o.scale.set(1+k*.3,1,1);fade(o,.9*(1-k))},dl||0)}
/* 八芒命中星＋光暈 */
function star(p,col,sz,dl,n){const s=new THREE.Shape(),N=(n||8)*2;for(let i=0;i<N;i++){const a=i/N*2*PI,r=i%2?.22:1;i?s.lineTo(Math.cos(a)*r,Math.sin(a)*r):s.moveTo(Math.cos(a)*r,Math.sin(a)*r)}s.closePath();
 const m=new THREE.Mesh(new THREE.ShapeGeometry(s),am(col,1)),r0=R(0,3);m.position.copy(p);vf(m,.28,(o,k)=>{bill(o,r0+k*.8);o.scale.setScalar(sz*(.4+k*.8));fade(o,1-k)},dl||0);flash(p,col,sz*1.2,.25,dl)}
/* 月牙形（中間粗、兩端尖） */
function cgeo(span,th){const s=new THREE.Shape(),N=18;for(let i=0;i<=N;i++){const a=-span+2*span*i/N;i?s.lineTo(Math.cos(a),Math.sin(a)):s.moveTo(Math.cos(a),Math.sin(a))}
 for(let i=N;i>=0;i--){const a=-span+2*span*i/N,t=i/N*2-1,r=1-th*(1-t*t);s.lineTo(Math.cos(a)*r,Math.sin(a)*r)}return new THREE.ShapeGeometry(s)}
function cres(p,col,sc,rot,life,dl,span,th,sw){const m=new THREE.Mesh(cgeo(span||1.1,th||.5),am(col,.95));m.position.copy(p);
 vf(m,life,(o,k)=>{bill(o,rot+(k-.3)*(sw==null?1.2:sw));o.scale.setScalar(sc*(.7+Math.min(1,k*4)*.3+k*.1));fade(o,k<.3?.95:.95*(1-(k-.3)/.7))},dl||0)}
function gcres(c,col,rad,life,dl,span,th,spin){const m=new THREE.Mesh(cgeo(span||1.3,th||.4),am(col,.9));m.rotation.x=-PI/2;m.position.set(c.x,.1,c.z);
 vf(m,life,(o,k,dt)=>{o.rotation.z+=dt*(spin||9);o.scale.setScalar(rad*(.3+Math.min(1,k*2.5)*.7));fade(o,.9*(1-k*k))},dl||0)}
/* 地面魔法陣（canvas 繪製，單色疊加） */
function glyph(c,col,r,life,kind,dl,spin){const t=ctex('g'+kind,(x,n)=>{const h=n/2;x.translate(h,h);x.strokeStyle=x.fillStyle='#fff';x.lineCap='round';
  const ring=(r,w)=>{x.lineWidth=w;x.beginPath();x.arc(0,0,r,0,PI*2);x.stroke()},poly=(k,r,rot,w,st)=>{x.lineWidth=w;x.beginPath();for(let i=0;i<=k;i++){const a=rot+i*(st||1)/k*PI*2;i?x.lineTo(Math.cos(a)*r,Math.sin(a)*r):x.moveTo(Math.cos(a)*r,Math.sin(a)*r)}x.stroke()},
  tick=(k,r0,r1,w)=>{x.lineWidth=w;for(let i=0;i<k;i++){const a=i/k*PI*2;x.beginPath();x.moveTo(Math.cos(a)*r0,Math.sin(a)*r0);x.lineTo(Math.cos(a)*r1,Math.sin(a)*r1);x.stroke()}};
  ring(h*.96,4);ring(h*.88,1.5);
  if(kind=='hex'){poly(6,h*.8,0,3);poly(6,h*.8,.5236,3);ring(h*.45,2);tick(12,h*.88,h*.96,2)}
  else if(kind=='star'){poly(5,h*.84,-1.57,3,2);ring(h*.35,2);tick(30,h*.88,h*.95,1.5)}
  else if(kind=='sun'){for(let i=0;i<16;i++){const a=i/16*PI*2;x.beginPath();x.moveTo(Math.cos(a-.1)*h*.55,Math.sin(a-.1)*h*.55);x.lineTo(Math.cos(a)*h*.86,Math.sin(a)*h*.86);x.lineTo(Math.cos(a+.1)*h*.55,Math.sin(a+.1)*h*.55);x.fill()}ring(h*.5,3);ring(h*.3,2)}
  else if(kind=='dark'){poly(3,h*.8,-1.57,3);poly(3,h*.8,1.57,3);poly(8,h*.62,0,2,3);ring(h*.25,3)}
  else{tick(48,h*.8,h*.95,2);ring(h*.7,2);poly(4,h*.6,.78,2);poly(4,h*.6,0,2)}},256);
 const m=new THREE.Mesh(new THREE.PlaneGeometry(2,2),am(col,1,t)),g=new THREE.Group();m.rotation.x=-PI/2;g.add(m);g.position.set(c.x,.06,c.z);
 vf(g,life,(o,k,dt)=>{m.rotation.z+=dt*(spin==null?1:spin);o.scale.setScalar(r*(.6+Math.min(1,k*4)*.4));fade(o,env(k))},dl||0)}
function disc(c,col,rad,life,op,dl,add){const m=new THREE.Mesh(new THREE.CircleGeometry(1,28),add===false?bm(col,op):am(col,op));m.rotation.x=-PI/2;m.position.set(c.x,.04,c.z);
 vf(m,life,(o,k)=>{o.scale.setScalar(rad*(.3+Math.min(1,k*3)*.7));fade(o,op*(k<.6?1:1-(k-.6)/.4))},dl||0)}
function puff(p,col,n,r,life,op){for(let i=0;i<n;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(R(.25,.5)*r,7,6),bm(col,op||.45)),a=R(0,6.283),d=R(0,r);
 m.position.set(p.x+Math.cos(a)*d,R(.2,.6),p.z+Math.sin(a)*d);vf(m,life||.7,(o,k)=>{o.position.y+=.012;o.scale.setScalar(1+k*1.4);fade(o,(op||.45)*(1-k))},R(0,60))}}
function cloud(c,rad,cols,n,life,rise){for(let i=0;i<n;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(R(.6,1.1),8,6),bm(cols[i%cols.length],.5)),a=R(0,6.283),d=Math.sqrt(Math.random())*rad*.85;
 m.position.set(c.x+Math.cos(a)*d,R(.3,1),c.z+Math.sin(a)*d);vf(m,life,(o,k)=>{o.position.y+=(rise||.004);o.scale.setScalar(.3+Math.min(1,k*4)*.9);fade(o,.5*(k<.7?1:1-(k-.7)/.3))},R(0,180))}}
function rocks(p,col,n,sp,sz){for(let i=0;i<n;i++){const s=sz||.2,m=new THREE.Mesh(new THREE.BoxGeometry(s,s,s),bm(col,1)),a=R(0,6.283),v=R(.4,1)*sp,vx=Math.cos(a)*v,vz=Math.sin(a)*v,vy=R(3,6);
 m.position.set(p.x,.2,p.z);m.rotation.set(R(0,3),R(0,3),0);vf(m,.8,(o,k,dt)=>{o.position.x+=vx*dt;o.position.z+=vz*dt;o.position.y=Math.max(.05,o.position.y+(vy-k*9)*dt);o.rotation.x+=dt*8;fade(o,k<.7?1:1-(k-.7)/.3)})}}
function flames(c,rad,col,n,life,dl,h){for(let i=0;i<n;i++){const a=R(0,6.283),d=Math.sqrt(Math.random())*rad,hh=(h||1.6)*R(.6,1.2),ph=R(0,6),
  m=new THREE.Mesh(new THREE.ConeGeometry(R(.2,.4),hh,6),am(i%3?col:0xffe070,.85));m.position.set(c.x+Math.cos(a)*d,hh/2,c.z+Math.sin(a)*d);
  vf(m,life||1,(o,k)=>{const sy=(1+Math.sin(k*30+ph)*.25)*(1-k*.4);o.scale.set(1,sy,1);o.position.y=hh*sy/2;fade(o,.85*env(k))},(dl||0)+R(0,250))}}
/* 冰錐：up＝從地面長出，down＝從天而降 */
function ice(p,col,h,life,dl,dir){const g=new THREE.Group(),cn=new THREE.ConeGeometry(.34,h,6);g.add(new THREE.Mesh(cn,bm(col,.9)));const i2=new THREE.Mesh(cn.clone(),am(0xffffff,.6));i2.scale.set(.5,.96,.5);g.add(i2);
 if(dir=='down')g.rotation.x=PI;g.position.set(p.x,0,p.z);
 vf(g,life,(o,k)=>{if(dir=='down'){const f=Math.min(1,k/.25);o.position.y=h/2+12*(1-f)*(1-f)}else{const f=Math.min(1,k/.2);o.scale.y=Math.max(.01,f);o.position.y=h*f/2}fade(o,k<.65?.9:.9*(1-(k-.65)/.35))},dl||0)}
function zig(a,b,col,w,life,dl,n){n=n||7;const g=new THREE.Group(),pts=[a.clone()];for(let i=1;i<n;i++){const p=a.clone().lerp(b,i/n);p.x+=R(-.5,.5);p.z+=R(-.5,.5);if(Math.abs(b.y-a.y)<2)p.y+=R(-.4,.4);pts.push(p)}pts.push(b.clone());
 for(let i=0;i<pts.length-1;i++){const d=pts[i+1].clone().sub(pts[i]),m=new THREE.Mesh(new THREE.BoxGeometry(w,w,d.length()),am(col,1));m.position.copy(pts[i]).addScaledVector(d,.5);m.lookAt(pts[i+1]);g.add(m)}
 vf(g,life||.3,(o,k)=>fade(o,k<.5?1:1-(k-.5)*2),dl||0)}
/* 沿直線飛行（可加弧高 h）；結束時呼叫 cb */
function fly(a,b,m,life,cb,tr,dl,h){m.position.copy(a);m.lookAt(b);const sp=b.clone().sub(a);let n=0;
 vf(m,life,(o,k)=>{o.position.copy(a).addScaledVector(sp,k);if(h)o.position.y+=Math.sin(k*PI)*h;if(tr)tr(o.position,k,n++)},dl||0);if(cb)setTimeout(cb,(dl||0)+life*1000)}
const hand=hp=>hp.clone().setY(1.4);
function boom(d,col,rad){const e=new THREE.Mesh(new THREE.SphereGeometry(1,14,10),am(col,.8));e.position.set(d.x,.7,d.z);vf(e,.4,(o,k)=>{o.scale.setScalar(.4+k*rad*.5);fade(o,.8*(1-k))});
 flash(V3(d.x,.8,d.z),0xffe0a0,rad*1.2,.3);ring(d,0xffd080,rad*.7);burst(V3(d.x,.4,d.z),0xffa040,16,rad,5,.1);flames(d,rad*.5,col,6,.7)}
function fball(a,d,sz,life,col,dl,rad){const g=new THREE.Group();g.add(new THREE.Mesh(new THREE.SphereGeometry(sz,10,8),bm(0xffe080,1)),new THREE.Mesh(new THREE.SphereGeometry(sz*1.6,10,8),am(col,.55)));
 fly(a,d,g,life,()=>boom(d,col,rad),(p,k,n)=>{if(n%2==0)trail(p,0xff8a30)},dl,1.2)}
/* 投擲炸彈：拋物線飛到 c，爆成指定顏色的煙霧 */
function bomb(hp,c,col,cloudCols,rad,spark){const b=new THREE.Mesh(new THREE.SphereGeometry(.2,8,6),bm(0x3a3028,1)),a=hand(hp),d=V3(c.x,.4,c.z);
 fly(a,d,b,.4,()=>{flash(d,col,rad*1.3,.3);ring(c,col,rad*.7);burst(V3(c.x,.4,c.z),spark||col,16,rad*.9,4,.08);cloud(c,rad,cloudCols,16,1.3);shk=.2},(p,k,n)=>{b.rotation.x+=.5;if(n%3==0)trail(p,0x999999)},0,2.4)}

/* ================= 戰士 ================= */
SKFX.w_charge=(sk,tm,c,hp,tp,col)=>{const d=tp.clone().sub(hp).setY(0),L=d.length()||1;d.normalize();const a=Math.atan2(-d.z,d.x),sd=V3(-d.z*.5,0,d.x*.5);
 for(let i=0;i<6;i++){const o=hp.clone().addScaledVector(d,L*i/6),m=new THREE.Mesh(new THREE.SphereGeometry(.3,8,6),bm(col,.5));m.scale.set(.9,1.9,.9);m.position.copy(o).setY(1);vf(m,.4,(q,k)=>fade(q,.5*(1-k)),i*25);
  later(()=>{gstreak(o,0xffffff,2.8,.16,a);gstreak(o.clone().add(sd),col,2.2,.12,a);gstreak(o.clone().sub(sd),col,2.2,.12,a);puff(o,0xc8b8a0,2,.5,.5)},i*30)}
 later(()=>{star(U(tp),col,3.2);ring(tp,col,2.4);burst(U(tp),col,14,4,3);rocks(tp,0xb09070,6,3);shk=.3},170)};
SKFX.w_smash=(sk,tm,c,hp,tp,col)=>{streak(tp.clone().setY(1.7),0xffffff,3.4,.5,1,.24);streak(tp.clone().setY(1.6),col,4.4,1,1,.32);
 later(()=>{flash(U(tp),col,3.4,.3);ring(tp,col,2.8);rocks(tp,0xb09070,10,4);puff(tp,0xc8b8a0,6,.8,.7);shk=.45},90)};
SKFX.w_stab=(sk,tm,c,hp,tp,col)=>{const p=U(tp);streak(p,0xffffff,3.8,.22,.35,.2);streak(p,col,4.6,.5,.35,.26,30);star(p,col,2,90,6);burst(p,col,8,3,2,.06)};
SKFX.w_hammer=(sk,tm,c,hp,tp,col)=>{streak(tp.clone().setY(2.3),0xffffff,4.6,.8,PI/2,.26);streak(tp.clone().setY(2.1),col,5.4,1.4,PI/2,.34);
 later(()=>{for(let i=0;i<6;i++)gstreak(tp,col,2.8,.22,i*PI/3+.3,.6);flash(U(tp),col,4,.3);ring(tp,col,3.2);ring(tp,0xffffff,2);rocks(tp,0xa08060,14,5,.25);puff(tp,0xc8b8a0,8,1,.8);shk=.6},110)};
SKFX.w_crescent=(sk,tm,c,hp,tp,col,rad)=>{const p=hp.clone().setY(1.2);streak(p,0xffffff,rad*1.6,.2,.62,.16);streak(p,col,rad*1.9,.55,.62,.22,40);
 later(()=>{cres(p,col,rad*.5,.62,.6,0,1.1,.55,.7);cres(p,0xffffff,rad*.38,.62,.45,40,1.1,.35,.7);gcres(hp,col,rad,.5,0,1.3,.4,10);flash(p,col,rad*1.4,.4);
  for(let i=0;i<16;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.07,5,4),am(0xe8f6ff,1)),a=R(-.9,.9),r0=R(.2,1)*rad*.5,x0=p.x+Math.cos(.62+a)*r0,z0=p.z+Math.sin(.62+a)*r0*.3;
   m.position.set(x0,p.y+Math.sin(.62+a)*r0*.6,z0);vf(m,R(.5,.9),(o,k)=>{o.position.y-=.015;o.position.x+=.004;fade(o,1-k)},R(0,200))}},60);
 near(c,rad).forEach((m,i)=>{const q=U(m.g.position);streak(q,0xffffff,2.2,.18,.62,.18,120+i*30);star(q,col,1.6,130+i*30,6)})};
SKFX.w_double=(sk,tm,c,hp,tp,col)=>{const p=U(tp);streak(p,0xffffff,3.4,.3,.7,.2);streak(p,col,4,.7,.7,.26);star(p,col,2.2,40);
 streak(p,0xffffff,3.4,.3,-.7,.2,150);streak(p,col,4,.7,-.7,.26,150);star(p,col,2.6,190);ring(tp,col,2.4)};
SKFX.w_flame=(sk,tm,c,hp,tp,col)=>{const p=U(tp);streak(p,0xffe070,4.6,.7,.7,.3);streak(p,col,5.4,1.3,.7,.36,20);cres(p,col,1.8,.7,.45,30,1,.5,.8);
 later(()=>{flash(p,col,4,.35);flames(tp,.9,col,12,.9);ring(tp,col,2.4);burst(V3(tp.x,.6,tp.z),0xffc060,16,3,5,.07);disc(tp,col,1.6,.5,.5)},80)};
SKFX.w_fury=(sk,tm,c,hp,tp,col)=>{const p=U(tp),A=[.8,-.8,.2,-.35];A.forEach((a,i)=>{streak(p,0xffffff,3.4,.3,a,.18,i*150);streak(p,col,4,.7,a,.24,i*150);star(p,col,2+i*.3,i*150+40,6)});
 later(()=>{flash(p,col,5,.4);ring(tp,col,3.2);ring(tp,0xffffff,2);burst(p,col,22,5,4,.09);rocks(tp,0x883030,8,4);shk=.55},640)};
SKFX.w_power=(sk,tm,c,hp,tp,col)=>{const p=U(tp);flash(hand(hp),col,3,.4);glyph(hp,col,2.4,.5,'sun');
 later(()=>{streak(p.clone().setY(4),0xffffff,8,1,1.25,.28);streak(p.clone().setY(3.8),col,9,2.2,1.25,.34)},160);
 later(()=>{flash(p,0xffffff,7,.45);ring(tp,col,5);ring(tp,0xffffff,3);pillar(tp,col,1.3,10,.6);rocks(tp,0xc8a070,22,6,.26);puff(tp,0xd8c8a8,10,1.4,.9);burst(p,col,26,6,6,.12);shk=.95},300)};

/* ================= 法師 ================= */
SKFX.m_bolt=(sk,tm,c,hp,tp,col)=>{const a=hand(hp),b=U(tp),g=new THREE.Group();g.add(new THREE.Mesh(new THREE.SphereGeometry(.2,10,8),bm(0xffffff,1)),new THREE.Mesh(new THREE.SphereGeometry(.38,10,8),am(col,.5)));
 flash(a,col,1.4,.2);fly(a,b,g,.28,()=>{flash(b,col,2.4,.3);burst(b,col,12,3,3,.07);ring(tp,col,1.6)},(p,k,n)=>{if(n%2==0)trail(p,col)})};
SKFX.m_firearrow=(sk,tm,c,hp,tp,col)=>{const a=hand(hp),b=U(tp),g=new THREE.Group(),cn=new THREE.ConeGeometry(.15,1,6);cn.rotateX(PI/2);g.add(new THREE.Mesh(cn,am(col,.95)));
 const co=new THREE.Mesh(cn.clone(),am(0xfff0a0,1));co.scale.set(.5,.5,.9);g.add(co);const tl=new THREE.Mesh(new THREE.SphereGeometry(.3,8,6),am(col,.5));tl.position.z=-.5;g.add(tl);
 flash(a,col,1.4,.2);fly(a,b,g,.26,()=>{flash(b,col,2.6,.3);flames(tp,.5,col,5,.6);burst(b,0xffa040,12,3,3,.07);ring(tp,col,1.8)},(p,k,n)=>{trail(p,n%2?0xffd060:col)})};
SKFX.m_fireball=(sk,tm,c,hp,tp,col,rad)=>{flash(hand(hp),col,2.2,.25);fball(hand(hp),V3(c.x,.5,c.z),.5,.4,col,0,rad)};
SKFX.m_windarrow=(sk,tm,c,hp,tp,col)=>{const a=hand(hp),b=U(tp),g=new THREE.Group();for(let i=0;i<3;i++){const t=tor(.24-i*.04,.035,col,.9);t.position.z=-i*.3;g.add(t)}g.add(new THREE.Mesh(new THREE.SphereGeometry(.12,8,6),am(0xffffff,1)));
 flash(a,col,1.4,.2);fly(a,b,g,.28,()=>{streak(b,0xffffff,3,.18,.7,.2);streak(b,col,3,.18,-.7,.2);ring(tp,col,2.2);burst(b,col,12,3.5,2,.06);flash(b,col,2,.25)},(p,k,n)=>{g.rotation.z+=.6;if(n%2==0){const t=tor(.3,.03,col,.6);t.position.copy(p);t.lookAt(b);vf(t,.35,(o,q)=>{o.scale.setScalar(1+q*1.2);fade(o,.6*(1-q))})}})};
SKFX.m_blast=(sk,tm,c,hp,tp,col,rad)=>{const a=hand(hp);for(let i=0;i<4;i++){const d=i?V3(c.x+R(-rad*.6,rad*.6),.5,c.z+R(-rad*.6,rad*.6)):V3(c.x,.5,c.z);fball(a,d,.32,.34,col,i*110,rad*.55)}later(()=>{ring(c,col,rad*.9);shk=.4},520)};
SKFX.m_icearrow=(sk,tm,c,hp,tp,col)=>{const a=hand(hp),b=U(tp),g=new THREE.Group(),oc=new THREE.OctahedronGeometry(.25);oc.scale(1,1,2.4);g.add(new THREE.Mesh(oc,bm(col,.95)));const i2=new THREE.Mesh(oc.clone(),am(0xffffff,.7));i2.scale.setScalar(.5);g.add(i2);
 flash(a,col,1.4,.2);fly(a,b,g,.28,()=>{flash(b,0xdff6ff,2.6,.3);for(let i=0;i<7;i++)ice(V3(tp.x+Math.cos(i)*.7,0,tp.z+Math.sin(i)*.7),col,R(.9,1.6),.7,0,'up');ring(tp,col,2);burst(b,0xffffff,14,3,3,.06)},(p,k,n)=>{g.rotation.z+=.3;if(n%2==0)burst(p,0xdff6ff,2,.6,.3,.05)})};
SKFX.m_stone=(sk,tm,c,hp,tp,col)=>{const a=hand(hp),b=U(tp),g=new THREE.Mesh(new THREE.DodecahedronGeometry(.36),bm(col,1));
 flash(a,col,1.2,.2);fly(a,b,g,.3,()=>{rocks(tp,col,14,4.5,.22);puff(tp,0xc8b8a0,5,.8,.7);flash(b,0xffe0b0,2.4,.25);ring(tp,col,2);shk=.3},(p,k,n)=>{g.rotation.x+=.4;g.rotation.y+=.3;if(n%2==0)trail(p,0xa89070)},0,.8)};
SKFX.m_plain=(sk,tm,c,hp,tp,col,rad)=>{glyph(c,col,rad,1.5,'rune');glyph(c,0xffd060,rad*.6,1.3,'star',0,-2);disc(c,col,rad,1.3,.35);flames(c,rad*.95,col,36,1.3,0,2);ring(c,col,rad);ring(c,0xffd060,rad*.6);burst(V3(c.x,.4,c.z),0xffb040,24,rad,6,.09);shk=.4};
SKFX.m_icestorm=(sk,tm,c,hp,tp,col,rad)=>{glyph(c,col,rad,1.5,'hex');for(let i=0;i<18;i++){const a=R(0,6.283),d=Math.sqrt(Math.random())*rad*.9,p=V3(c.x+Math.cos(a)*d,0,c.z+Math.sin(a)*d),dl=i*55;ice(p,col,R(1.6,2.4),.9,dl,'down');
  later(()=>{flash(V3(p.x,.6,p.z),0xdff6ff,2,.25);burst(V3(p.x,.3,p.z),0xffffff,6,1.8,2.5,.05)},dl+230)}
 later(()=>{ring(c,col,rad*.8);shk=.4},500)};
SKFX.m_meteor=(sk,tm,c,hp,tp,col,rad)=>{const s0=c.clone().add(V3(6,17,-5)),d=V3(c.x,.7,c.z),g=new THREE.Group();g.add(new THREE.Mesh(new THREE.SphereGeometry(.85,10,8),bm(0x7a3a1a,1)),new THREE.Mesh(new THREE.SphereGeometry(1.25,10,8),am(col,.55)));
 glyph(c,col,rad*.9,.9,'star');fly(s0,d,g,.45,()=>{boom(d,col,rad*1.3);flash(d,0xffffff,rad*1.8,.4);ring(c,0xffdd66,rad*.9);ring(c,col,rad*.6);rocks(c,0x703018,18,6,.26);disc(c,0x201008,rad*.5,1.4,.5,0,false);flames(c,rad*.6,col,14,1.1);shk=.8},(p,k,n)=>{trail(p,0xffa040);if(n%2==0)trail(p.clone().add(V3(.4,.9,-.3)),0xff6020)})};
SKFX.m_thunder=(sk,tm,c,hp,tp,col)=>{const top=V3(tp.x+1.5,15,tp.z),g0=V3(tp.x,.2,tp.z);flash(V3(tp.x,10,tp.z),0xffffff,9,.3);
 [0,110].forEach(dl=>{zig(top,g0,0xffffff,.22,.3,dl,10);zig(top,g0,col,.5,.32,dl,10)});
 later(()=>{flash(U(tp),0xffffff,7,.4);ring(tp,col,3);disc(tp,0x201808,1.5,1,.5,0,false);for(let i=0;i<4;i++)zig(V3(tp.x,.5,tp.z),V3(tp.x+Math.cos(i*1.57+.7)*2.6,.1,tp.z+Math.sin(i*1.57+.7)*2.6),col,.1,.25,0,4);burst(U(tp),col,22,5,7,.1);shk=.6},40)};
SKFX.m_frost=(sk,tm,c,hp,tp,col,rad)=>{glyph(c,0xdff6ff,rad,1.6,'star');glyph(c,col,rad*.55,1.4,'hex',0,-1.5);disc(c,col,rad,1.3,.3);ring(c,0xffffff,rad);ring(c,col,rad*.6);
 for(let i=0;i<14;i++){const a=i/14*PI*2;ice(V3(c.x+Math.cos(a)*rad*.8,0,c.z+Math.sin(a)*rad*.8),col,R(2,3),1.2,i*25,'up')}
 for(let i=0;i<8;i++){const a=i/8*PI*2+.4;ice(V3(c.x+Math.cos(a)*rad*.45,0,c.z+Math.sin(a)*rad*.45),0xdff6ff,R(2.6,3.6),1.2,200+i*25,'up')}
 ice(V3(c.x,0,c.z),0xffffff,5,1.3,350,'up');puff(c,0xe6f6ff,12,rad*.6,1.1,.35);burst(V3(c.x,.4,c.z),0xffffff,26,rad,5,.07);shk=.45};
SKFX.m_firewall=(sk,tm,c,hp,tp,col,rad)=>{const d=tp?tp.clone().sub(hp).setY(0).normalize():V3(1,0,0),px=-d.z,pz=d.x,n=14;
 for(let i=0;i<n;i++){const t=(i/(n-1)-.5)*rad*2,p=V3(c.x+px*t,0,c.z+pz*t);flames(p,.3,col,3,1.7,i*35,2.8);flames(p,.2,0xffe070,2,1.7,i*35+60,1.8)}
 for(let i=0;i<5;i++){const t=(i/4-.5)*rad*2;later(()=>flash(V3(c.x+px*t,.7,c.z+pz*t),col,2.2,.4),i*80)}
 disc(c,col,rad*.9,1.6,.2);ring(c,col,rad*.7);burst(V3(c.x,.4,c.z),0xffb040,18,rad*.8,6,.08);shk=.35};

/* ================= 盜賊 ================= */
SKFX.r_stab=(sk,tm,c,hp,tp,col)=>{const p=U(tp);streak(p,0xffffff,3.2,.18,.3,.16);streak(p,col,3.8,.4,.3,.22,25);star(p,col,1.6,70,6);burst(p,col,8,3,2,.05)};
SKFX.r_spin=(sk,tm,c,hp,tp,col,rad)=>{const g=new THREE.Group();for(let i=0;i<4;i++){const b=new THREE.Mesh(new THREE.BoxGeometry(.9,.05,.18),bm(0xffffff,.95)),a=i*PI/2;b.position.set(Math.cos(a)*1.3,1,Math.sin(a)*1.3);b.rotation.y=-a;g.add(b)}
 g.position.set(hp.x,0,hp.z);vf(g,.5,(o,k,dt)=>{o.rotation.y+=dt*22;o.scale.setScalar(.7+Math.min(1,k*3)*(rad/1.3-.7)*.8);fade(o,k<.6?.95:.95*(1-(k-.6)/.4))});
 gcres(hp,col,rad,.45,0,3,.12,16);gcres(hp,0xffffff,rad*.8,.35,40,3,.08,-14);ring(hp,col,rad*.9);burst(hp.clone().setY(.8),col,16,rad,3,.06)};
SKFX.r_double=(sk,tm,c,hp,tp,col)=>{const p=U(tp);streak(p,0xffffff,3.2,.2,.45,.16);streak(p,col,3.6,.4,.45,.2);star(p,col,1.6,40,6);streak(p,0xffffff,3.2,.2,-.45,.16,150);streak(p,col,3.6,.4,-.45,.2,150);star(p,col,1.9,190,6)};
SKFX.r_claw=(sk,tm,c,hp,tp,col)=>{const p=U(tp);[0,150,300].forEach((dl,j)=>{const a=j%2?-.9:.9;for(let i=-1;i<=1;i++){const q=p.clone();q.y+=i*.35;streak(q,j==2?0xff4466:col,3+(j==2?1.2:0),.2,a,.22,dl+Math.abs(i)*25);streak(q,0xffffff,2.6,.08,a,.18,dl+Math.abs(i)*25)}star(p,col,1.8+j*.4,dl+50,6)});
 burst(p,0xff4466,10,3,3,.06)};
SKFX.r_rupture=(sk,tm,c,hp,tp,col)=>{const p=U(tp);[0,150].forEach((dl,i)=>{const a=i?-.55:.55;streak(p,0xffffff,3.6,.3,a,.2,dl);streak(p,col,4.2,.7,a,.26,dl);star(p,col,2+i*.5,dl+40,6)});
 streak(p,0xaa1122,3.6,.2,.55,.8,60,.5);burst(p,0xcc1122,20,3.5,5,.07);ring(tp,col,2.2)};
SKFX.r_sand=(sk,tm,c,hp,tp,col,rad)=>bomb(hp,c,col,[0xd8c080,0xc0a468,0xe8d8a0],rad);
SKFX.r_pepper=(sk,tm,c,hp,tp,col,rad)=>{bomb(hp,c,col,[0xff5a3a,0xd83a20,0xff9a40],rad,0xffe070);for(let i=0;i<8;i++)later(()=>flash(V3(c.x+R(-rad,rad)*.6,R(.4,1.4),c.z+R(-rad,rad)*.6),0xffd060,1.2,.25),420+i*70)};
SKFX.r_toxin=(sk,tm,c,hp,tp,col,rad)=>{bomb(hp,c,col,[0x7ad43a,0x4a9a2a,0x9a4fd0],rad,0xb0ff60);for(let i=0;i<12;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(R(.08,.18),6,5),bm(0xb8ff70,.7)),a=R(0,6.283),d=Math.sqrt(Math.random())*rad*.8;
  m.position.set(c.x+Math.cos(a)*d,.3,c.z+Math.sin(a)*d);vf(m,1,(o,k)=>{o.position.y+=.025;fade(o,.7*(1-k))},450+i*60)}};
SKFX.r_clone=(sk,tm,c,hp,tp,col)=>{const p=U(tp);for(let i=0;i<4;i++){const a=i*PI/2+.6,g=new THREE.Group();g.add(new THREE.Mesh(new THREE.CylinderGeometry(.28,.34,1.1,8),bm(0x2a1a3a,.55)),new THREE.Mesh(new THREE.SphereGeometry(.26,8,6),bm(0x2a1a3a,.55)));g.children[0].position.y=.7;g.children[1].position.y=1.5;
  const s=V3(tp.x+Math.cos(a)*2.4,0,tp.z+Math.sin(a)*2.4);g.position.copy(s);vf(g,.7,(o,k)=>{const f=Math.min(1,k*2.5);o.position.set(s.x+(tp.x-s.x)*f*.7,0,s.z+(tp.z-s.z)*f*.7);fade(o,k<.15?.55*k/.15:k>.7?.55*(1-(k-.7)/.3):.55)},i*40);flash(V3(s.x,1,s.z),col,1.6,.25,i*40)}
 for(let i=0;i<6;i++){const a=R(-1.2,1.2);streak(p,0xffffff,3,.18,a,.16,150+i*110);streak(p,col,3.4,.4,a,.2,150+i*110);star(p,col,1.3,190+i*110,6)}later(()=>{flash(p,col,4.5,.4);ring(tp,col,2.8);shk=.35},950)};
SKFX.r_shadow=(sk,tm,c,hp,tp,col,rad)=>{glyph(hp,col,rad,1.5,'dark',0,2);disc(hp,0x14081f,rad,1.5,.45,0,false);
 const g=new THREE.Group();for(let i=0;i<6;i++){const m=new THREE.Mesh(cgeo(.9,.5),am(i%2?0xffffff:col,.9)),a=i/6*PI*2;m.rotation.x=-PI/2;m.rotation.z=a+PI/2;m.position.set(Math.cos(a)*rad*.7,.9,Math.sin(a)*rad*.7);m.scale.setScalar(1.1);g.add(m)}
 g.position.set(hp.x,0,hp.z);vf(g,1.4,(o,k,dt)=>{o.rotation.y+=dt*(8+k*8);fade(o,.9*env(k))});
 [0,250,500,750].forEach((dl,i)=>{gcres(hp,i%2?0xffffff:col,rad,.4,dl,1.6,.3,i%2?11:-11);later(()=>{ring(hp,col,rad*.9);burst(hp.clone().setY(.5),0x6a2aaa,10,rad*.8,3,.07)},dl)});cloud(hp,rad,[0x2a1048,0x14081f,0x4a1a78],14,1.5,.006);shk=.45};

/* ================= 祭司 ================= */
/* 驅邪術：十字光從天而降，打在範圍內每隻怪身上 */
function cross(p,col,sz,dl){const g=new THREE.Group(),bar=(w,h,y,cl,o)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),am(cl,o));m.position.y=y;g.add(m)};
 bar(.55,2.8,0,col,.55);bar(1.8,.55,.55,col,.55);bar(.24,2.5,0,0xffffff,1);bar(1.5,.24,.55,0xffffff,1);
 const gl=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex(),color:col,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));gl.scale.setScalar(4);g.add(gl);
 pillar(p,col,.45,14,.5,dl);
 vf(g,.95,(o,k)=>{bill(o);const f=Math.min(1,k/.2);o.position.set(p.x,1.6+6*(1-f)*(1-f),p.z);o.scale.setScalar(sz*(f<1?1:1+(k-.2)*.4));fade(o,k<.7?1:1-(k-.7)/.3)},dl||0);
 later(()=>{flash(V3(p.x,1.6,p.z),0xffffff,sz*3.2,.35);ring(p,col,sz*1.8);ring(p,0xffffff,sz);burst(V3(p.x,.5,p.z),col,14,2.5,5,.07)},(dl||0)+190)}
SKFX.p_exorcism=(sk,tm,c,hp,tp,col,rad)=>{const list=near(c,rad).slice(0,6);if(tm&&!list.includes(tm))list.unshift(tm);glyph(c,col,rad*.6,.9,'sun',0,2);
 list.forEach((m,i)=>cross(m.g.position,col,m===tm?1.5:1.2,i*70));shk=.3};
SKFX.p_barrier=(sk,tm,c,hp,tp,col,rad)=>{glyph(hp,col,rad,1.4,'hex',0,.8);const dm=new THREE.Group(),sg=new THREE.SphereGeometry(1,24,12,0,PI*2,0,PI/2);dm.add(new THREE.Mesh(sg,am(col,.18)),new THREE.Mesh(sg.clone(),(()=>{const m=am(0xffffff,.45);m.wireframe=true;return m})()));
 dm.position.set(hp.x,0,hp.z);vf(dm,1.3,(o,k)=>{o.scale.setScalar(rad*(.3+Math.min(1,k*3)*.7));fade(o,env(k)*.6)});
 for(let i=0;i<8;i++){const a=i/8*PI*2;pillar(V3(hp.x+Math.cos(a)*rad*.9,0,hp.z+Math.sin(a)*rad*.9),col,.2,6,.9,i*40)}
 ring(hp,col,rad);ring(hp,0xffffff,rad*.6);flash(hp.clone().setY(1),0xffffff,rad,.4);burst(hp.clone().setY(.5),col,20,rad,4,.07);shk=.3};
SKFX.p_field=(sk,tm,c,hp,tp,col,rad)=>{glyph(c,col,rad,1.7,'sun',0,.6);glyph(c,0xffffff,rad*.65,1.5,'rune',0,-1.2);disc(c,col,rad,1.5,.25);
 for(let i=0;i<12;i++)gstreak(c,col,rad*1.8,.25,i*PI/12,.8,i*20);
 for(let i=0;i<14;i++){const a=R(0,6.283),d=Math.sqrt(Math.random())*rad*.9;pillar(V3(c.x+Math.cos(a)*d,0,c.z+Math.sin(a)*d),i%2?col:0xffffff,.22,R(4,8),.8,i*60)}
 flash(V3(c.x,1,c.z),0xffffff,rad*1.2,.5);ring(c,col,rad);ring(c,0xffffff,rad*.55);burst(V3(c.x,.3,c.z),0xfff0a0,28,rad*.7,5,.06);shk=.35};
SKFX.p_totem=(sk,tm,c,hp,tp,col,rad)=>{glyph(hp,col,rad,1.7,'rune',0,1);const g=new THREE.Group(),st=0xd8c090;
 [[.7,.6,0],[.55,.55,.65],[.7,.55,1.25]].forEach(([w,h,y])=>{const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,w),bm(st,1));b.position.y=y+.3;g.add(b);[-1,1].forEach(s=>{const e=new THREE.Mesh(new THREE.SphereGeometry(.07,6,5),am(0xffffff,1));e.position.set(s*.14,y+.35,w/2+.01);g.add(e)})});
 const tip=new THREE.Mesh(new THREE.ConeGeometry(.4,.7,6),bm(st,1));tip.position.y=2.4;g.add(tip);g.position.set(hp.x,-2,hp.z);
 vf(g,1.5,(o,k)=>{o.position.y=-2+2*Math.min(1,k/.2);o.rotation.y+=.02;fade(o,k<.7?1:1-(k-.7)/.3)});pillar(hp,col,.6,12,1,200);
 [0,250,500].forEach(dl=>later(()=>{ring(hp,col,rad);ring(hp,0xffffff,rad*.6);flash(hp.clone().setY(1.5),col,rad*.9,.35);burst(hp.clone().setY(.4),col,14,rad*.9,4,.07);shk=.4},200+dl));
 for(let i=0;i<12;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.07,5,4),am(0xfff0b0,1)),a=R(0,6.283),d=R(.5,rad*.8);m.position.set(hp.x+Math.cos(a)*d,.2,hp.z+Math.sin(a)*d);vf(m,1.1,(o,k)=>{o.position.y+=.04;fade(o,1-k)},300+i*50)}};

/* ================= 武道家 ================= */
SKFX.k_smash=(sk,tm,c,hp,tp,col)=>{const p=U(tp);flash(hand(hp),col,1.5,.15);star(p,0xffffff,3.4,60);ring(tp,col,2.6);ring(tp,0xffffff,1.6);for(let i=0;i<6;i++)streak(p,col,3.2,.16,i*PI/6,.2,60);puff(tp,0xc8b8a0,4,.7,.6);shk=.4};
SKFX.k_lightning=(sk,tm,c,hp,tp,col)=>{const a=hand(hp),b=U(tp);zig(a,b,0xffffff,.1,.22,0,8);zig(a,b,col,.28,.26,0,8);zig(a,b,col,.12,.22,50,8);later(()=>{star(b,col,2.6);for(let i=0;i<3;i++)zig(b,V3(b.x+R(-1.8,1.8),R(.2,1.8),b.z+R(-1.8,1.8)),col,.07,.2,0,4);burst(b,col,12,4,3,.06);ring(tp,col,2)},60)};
SKFX.k_kick=(sk,tm,c,hp,tp,col)=>{const p=tp.clone().setY(.7);cres(p,0xffffff,1.9,.15,.3,0,1.2,.4,1.6);cres(p,col,2.4,.15,.4,20,1.2,.55,1.6);gcres(tp,col,2.2,.35,30,1.6,.3,12);later(()=>{star(U(tp),col,2.6);ring(tp,col,2.4);puff(tp,0xc8b8a0,5,.8,.6);shk=.3},60)};
SKFX.k_spiral=(sk,tm,c,hp,tp,col)=>{const a=hand(hp),b=U(tp);for(let i=0;i<9;i++){const t=tor(.55-i*.04,.04,i%2?0xffffff:col,.9),p=a.clone().lerp(b,i/9);t.position.copy(p);t.lookAt(b);vf(t,.3,(o,k)=>{o.rotation.z+=.5;fade(o,.9*(1-k))},i*18)}
 later(()=>{const t=tor(.5,.07,col,1);t.position.copy(b);vf(t,.35,(o,k)=>{o.quaternion.copy(cam.quaternion);o.rotation.z+=k*8;o.scale.setScalar(1+k*3);fade(o,1-k)});star(b,col,2.8);burst(b,col,16,4,3,.06);ring(tp,col,2.2);shk=.3},170)};
SKFX.k_double=(sk,tm,c,hp,tp,col)=>{const p=U(tp);[0,150].forEach((dl,i)=>{const q=p.clone();q.x+=i?.4:-.4;flash(hand(hp),col,1.2,.12,dl);star(q,i?0xffffff:col,2.4+i*.4,dl+40);ring(tp,col,1.8+i*.6);streak(q,col,2.8,.2,i?-.5:.5,.18,dl+40)})};
SKFX.k_hundred=(sk,tm,c,hp,tp,col)=>{const p=U(tp);for(let i=0;i<6;i++){const q=p.clone();q.x+=R(-.6,.6);q.y=R(.5,1.7);const a=R(-1.2,1.2);streak(q,0xffffff,2.6,.16,a,.15,i*150);streak(q,col,3,.34,a,.18,i*150);star(q,col,1.1+(i==5?1.4:0),i*150+30,6)}
 later(()=>{flash(p,col,5,.4);ring(tp,col,3);burst(p,col,20,5,4,.08);shk=.5},830)};
SKFX.k_fistqi=(sk,tm,c,hp,tp,col)=>{const a=hand(hp),b=U(tp),g=new THREE.Group();g.add(new THREE.Mesh(new THREE.SphereGeometry(.28,10,8),bm(0xfff0a0,1)),new THREE.Mesh(new THREE.SphereGeometry(.55,10,8),am(col,.6)));
 flash(a,col,3,.3);flames(hp,.5,col,6,.5,0,1.1);fly(a,b,g,.2,()=>{flash(b,0xffffff,5,.35);star(b,col,3.6);ring(tp,col,3);ring(tp,0xffffff,1.8);burst(b,col,22,5,4,.09);flames(tp,.7,col,8,.7);shk=.45},(p,k,n)=>{trail(p,col)},120)};
SKFX.k_qigong=(sk,tm,c,hp,tp,col)=>{const a=hand(hp),b=U(tp),L=a.distanceTo(b)||1;flash(a,col,2.6,.3);ring(hp,col,1.4);
 later(()=>{const g=new THREE.Group(),cy=new THREE.CylinderGeometry(.4,.4,L,12,1,true);cy.rotateX(PI/2);g.add(new THREE.Mesh(cy,am(col,.6)));const co=new THREE.Mesh(cy.clone(),am(0xffffff,.9));co.scale.set(.4,.4,1);g.add(co);
  g.position.copy(a).lerp(b,.5);g.lookAt(b);vf(g,.35,(o,k)=>{o.scale.set(1+Math.sin(k*PI)*.3,1+Math.sin(k*PI)*.3,1);fade(o,k<.5?.9:.9*(1-(k-.5)*2))});
  for(let i=0;i<4;i++){const t=tor(.5,.05,col,.8);t.position.copy(a).lerp(b,i/4);t.lookAt(b);vf(t,.3,(o,k)=>{o.scale.setScalar(1+k);fade(o,.8*(1-k))},i*30)}
  flash(b,col,5,.4);ring(tp,col,3);burst(b,col,18,4,3,.08);shk=.35},150)};
SKFX.k_dragon=(sk,tm,c,hp,tp,col)=>{const a=hand(hp),b=U(tp),d=b.clone().sub(a),L=d.length()||1,pd=V3(-d.z/L,0,d.x/L);flash(a,col,3.5,.35);glyph(hp,col,2.2,.6,'sun',0,3);
 const at=(k,i)=>a.clone().addScaledVector(d,k).addScaledVector(pd,Math.sin(k*9+i*.1)*.7).add(V3(0,Math.cos(k*9)*.5,0));
 for(let i=0;i<14;i++){const g=new THREE.Group();g.add(new THREE.Mesh(new THREE.SphereGeometry(i?.4-i*.02:.5,8,6),bm(i%2?0xffe27a:col,.95)));
  if(!i){const h=new THREE.ConeGeometry(.3,.8,6);h.rotateX(PI/2);const sn=new THREE.Mesh(h,bm(0xffd23a,1));sn.position.z=.5;g.add(sn);[-1,1].forEach(s=>{const hn=new THREE.Mesh(new THREE.ConeGeometry(.08,.5,4),bm(0xffffff,1));hn.position.set(s*.25,.4,-.1);hn.rotation.z=-s*.4;g.add(hn);const e=new THREE.Mesh(new THREE.SphereGeometry(.07,5,4),am(0xff3a3a,1));e.position.set(s*.2,.2,.3);g.add(e)})}
  vf(g,.5,(o,k)=>{o.position.copy(at(k,i));const n=at(Math.min(1,k+.03),i);o.lookAt(n);fade(o,k<.85?.95:.95*(1-(k-.85)/.15))},i*24)}
 later(()=>{flash(b,0xffffff,8,.5);flash(b,col,10,.5);ring(tp,col,5);ring(tp,0xffffff,3);ring(tp,col,2);pillar(tp,col,1.2,10,.6);burst(b,col,30,6,6,.12);rocks(tp,0xe8c060,10,5);shk=.85},500)};
})();
