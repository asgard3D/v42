/* 技能特效 */
// ---------- skill VFX ----------
const vfx=[];let shk=0;
const bm=(c,o)=>new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:o==null?1:o,depthWrite:false,side:THREE.DoubleSide});
const fade=(o,a)=>o.traverse(x=>{if(x.material)x.material.opacity=a});
const tor=(r,t,c,o)=>new THREE.Mesh(new THREE.TorusGeometry(r,t,6,28),bm(c,o));
function vf(o,life,up,dl){const go=()=>{scene.add(o);vfx.push({o,t:0,life,up})};dl?setTimeout(go,dl):go();return o}
function trail(p,col){const m=new THREE.Mesh(new THREE.SphereGeometry(.14,5,4),bm(col,.8));m.position.copy(p);vf(m,.35,(o,k)=>{o.scale.setScalar(Math.max(.01,1-k));fade(o,.8*(1-k))})}
function burst(p,col,n,sp,up,sz){for(let i=0;i<n;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(sz||.09,5,4),bm(col)),a=R(0,6.283),v=R(.3,1)*sp,vx=Math.cos(a)*v,vz=Math.sin(a)*v,vy=R(.3,1)*(up==null?sp:up);m.position.copy(p);
 vf(m,.8,(o,k,dt)=>{o.position.x+=vx*dt;o.position.z+=vz*dt;o.position.y=Math.max(.05,o.position.y+vy*(1-k*1.6)*dt);fade(o,1-k)})}}
function pillar(p,col,r,h,life,dl){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r*1.25,h,16,1,true),bm(col,.7));m.position.set(p.x,h/2,p.z);vf(m,life,(o,k)=>{o.scale.set(Math.max(.05,1-k*.7),1,Math.max(.05,1-k*.7));fade(o,.7*(1-k))},dl)}
function slash(p,col,sc,angs,dl){angs.forEach(r=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(2.4*sc,.16*sc),bm(col,.95));m.position.set(p.x,1,p.z);m.quaternion.copy(cam.quaternion);m.rotateZ(r);
 vf(m,.28,(o,k)=>{o.scale.set(1+k*.2,1+k*2.5,1);fade(o,.95*(1-k))},dl||0)})}
/* 技能特效：依 sk.fx 類型與 sk.col 顏色產生（類型共用，顏色／範圍由技能資料決定）
   tm=目標怪物（可為 null）；c=範圍中心（aoe）或施放者位置 */
function skFx(sk,tm,c){const hp=hero.position.clone(),tp=tm?tm.g.position.clone():null,col=sk.col||0xffffff,rad=sk.rad||3;
 {const f=SKFX[sk.id];if(f){f(sk,tm,c,hp,tp,col,rad);return}}/* 有專屬特效就用專屬的（render/skill-fx.js） */
 switch(sk.fx){
 case'smash':slash(tp,col,1.4,[.8]);ring(tp,col,2.6);burst(tp.clone().setY(.6),col,16,4,4);shk=Math.min(.7,.2+(sk.m||1)*.07);break;
 case'slash':slash(tp,col,1.3,[.7,-.7],60);ring(tp,col,2);burst(tp.clone().setY(.8),col,12,4,3);break;
 case'multi':{const n=Math.min(6,sk.hits||1);for(let i=0;i<n;i++)setTimeout(()=>{if(!tm)return;const p=tm.g.position.clone();p.x+=R(-.3,.3);p.y=R(.7,1.4);burst(p,col,8,3,2,.07);
   const f=new THREE.Mesh(new THREE.SphereGeometry(.3,8,6),bm(0xfff0c0,.9));f.position.copy(p);vf(f,.2,(o,k)=>{o.scale.setScalar(.6+k);fade(o,.9*(1-k))})},i*150);break}
 case'dash':for(let i=0;i<6;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.3,8,6),bm(col,.5));m.scale.set(.9,1.9,.9);m.position.copy(hp.clone().lerp(tp,i/6)).setY(1);vf(m,.45,(o,k)=>fade(o,.5*(1-k)),i*25)}
  slash(tp,0xffffff,1.3,[.7,-.7],80);burst(tp.clone().setY(.8),col,12,4,3);ring(tp,col,2);break;
 case'spin':{const g=new THREE.Group(),sc=rad/1.3;[.4,.9].forEach(y=>{const t=tor(1.3,.06,col,.8);t.rotation.x=Math.PI/2;t.position.y=y;g.add(t)});
  for(let i=0;i<4;i++){const b=new THREE.Mesh(new THREE.PlaneGeometry(1.2,.22),bm(0xffffff,.85)),a=i*1.571;b.position.set(Math.cos(a)*1.25,.65,Math.sin(a)*1.25);b.rotation.set(-Math.PI/2,0,-a-Math.PI/2);g.add(b)}
  g.position.set(hp.x,0,hp.z);vf(g,.6,(o,k,dt)=>{o.rotation.y+=dt*20;o.scale.setScalar(.5+(sc-.5)*Math.min(1,k*2.5));fade(o,k>.6?.9*(1-(k-.6)/.4):.9)});burst(hp,col,14,5,3);shk=.2;break}
 case'shout':for(let i=0;i<3;i++)pillar(hp,col,1.3,3.2,.7,i*160);burst(hp.clone().setY(.3),col,18,2.5,6);shk=.2;break;
 case'shield':{const sh=new THREE.Mesh(new THREE.SphereGeometry(1.15,16,12),bm(col,.35));vf(sh,1.3,(o,k)=>{o.position.set(hero.position.x,1,hero.position.z);o.scale.setScalar(1+Math.sin(k*18)*.04+k*.15);fade(o,k<.7?.35:.35*(1-(k-.7)/.3))});pillar(hp,col,1,4,.9);burst(hp.clone().setY(.4),col,14,2.5,4);break}
 case'swift':for(let i=0;i<3;i++){const t=tor(.65,.03,col,.85);t.rotation.x=Math.PI/2;vf(t,.6,(o,k)=>{o.position.set(hero.position.x,k*2,hero.position.z);o.scale.setScalar(1+k*.3);fade(o,.85*(1-k))},i*120)}burst(hp.clone().setY(.3),col,14,3,3);break;
 case'cloud':{const g=new THREE.Group(),r0=sk.rad||2;for(let i=0;i<16;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(R(.7,1.2)*(r0/4+.5),8,6),bm(i%3?col:0x9a4fd0,.4)),a=R(0,6.283),d=Math.sqrt(Math.random())*r0*.85;m.position.set(Math.cos(a)*d,R(.3,1),Math.sin(a)*d);g.add(m)}
  g.position.set(c.x,0,c.z);vf(g,1.6,(o,k)=>{o.position.y=k*.6;o.scale.setScalar(.6+Math.min(1,k*3)*.5);fade(o,.4*(1-k))});break}
 case'proj':shoot(tm,col,.34,col,col);burst(hp.clone().setY(1.2),col,8,2,2);break;
 case'blast':setTimeout(()=>{const e=new THREE.Mesh(new THREE.SphereGeometry(1,14,10),bm(col,.85));e.position.set(c.x,.6,c.z);vf(e,.45,(o,k)=>{o.scale.setScalar(.5+k*rad*.55);fade(o,.85*(1-k))});
   burst(c.clone().setY(.4),col,24,rad*1.2,6,.12);ring(c,0xffffff,rad*.7);shk=.35},200);shoot(tm,col,.3,col,col);break;
 case'meteor':{const s0=c.clone().add(new THREE.Vector3(5,16,-4)),m=new THREE.Mesh(new THREE.SphereGeometry(.7,10,8),bm(col));m.position.copy(s0);
  vf(m,.45,(o,k)=>{o.position.set(s0.x+(c.x-s0.x)*k,s0.y+(.7-s0.y)*k,s0.z+(c.z-s0.z)*k);trail(o.position,0xffa040)});
  setTimeout(()=>{const e=new THREE.Mesh(new THREE.SphereGeometry(1,14,10),bm(0xff9a33,.85));e.position.set(c.x,.6,c.z);vf(e,.45,(o,k)=>{o.scale.setScalar(.5+k*rad*.55);fade(o,.85*(1-k))});
   burst(c.clone().setY(.4),0xffc060,30,6,7,.13);ring(c,0xffdd66,rad*.7);shk=.6},450);break}
 case'nova':{const g=new THREE.Group();for(let i=0;i<16;i++){const a=i/16*6.283,r=rad*(.5+.4*(i%2)),cn=new THREE.ConeGeometry(.22,1.6,5);cn.translate(0,.8,0);
  const m=new THREE.Mesh(cn,bm(i%2?0xffffff:col,.9));m.position.set(Math.cos(a)*r,0,Math.sin(a)*r);m.rotation.set(Math.sin(a)*.25,0,-Math.cos(a)*.25);g.add(m)}
  g.position.set(c.x,0,c.z);vf(g,1,(o,k)=>{o.children.forEach(ch=>ch.scale.y=Math.min(1,k*5));fade(o,k>.55?.9*(1-(k-.55)/.45):.9)});ring(c,col,rad*.6);burst(c.clone().setY(.3),col,18,rad*.8,5);shk=.3;break}
 case'bolt':{const p=tp.clone();[0,120].forEach(dl=>{const b=new THREE.Mesh(new THREE.CylinderGeometry(.09,.22,14,6,1,true),bm(col,.95));b.position.set(p.x,7,p.z);vf(b,.35,(o,k)=>{o.scale.set(1+k*2,1,1+k*2);fade(o,.95*(1-k))},dl)});
  burst(p.clone().setY(.5),col,22,5,7,.1);ring(p,col,2.4);shk=.55;break}
 case'storm':{for(let i=0;i<8;i++){const a=R(0,6.283),d=Math.sqrt(Math.random())*rad*.9,p=new THREE.Vector3(c.x+Math.cos(a)*d,0,c.z+Math.sin(a)*d);pillar(p,i%2?col:0xffd060,.8,6,.7,i*90)}
  ring(c,col,rad*.7);burst(c.clone().setY(.4),col,24,rad,6);shk=.4;break}
 case'pillar':[c,...mons.filter(m=>!m.dead&&m.g.position.distanceTo(c)<rad).map(m=>m.g.position.clone())].forEach((p,i)=>pillar(p,col,i?.55:1,12,.6,i*40));burst(c.clone().setY(.5),col,20,rad*.7,6);ring(c,col,rad*.5);break;
 case'heal':for(let i=0;i<14;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.07,5,4),bm(col)),a=i/14*6.283;vf(m,1,(o,k)=>{const r=.8-.4*k,an=a+k*5;o.position.set(hero.position.x+Math.cos(an)*r,.1+k*2.2,hero.position.z+Math.sin(an)*r);fade(o,1-k)},i*35)}
  {const g=new THREE.Group();g.add(new THREE.Mesh(new THREE.BoxGeometry(.1,.38,.05),bm(col)),new THREE.Mesh(new THREE.BoxGeometry(.38,.1,.05),bm(col)));vf(g,.9,(o,k)=>{o.position.set(hero.position.x,2.3+k*.8,hero.position.z);o.quaternion.copy(cam.quaternion);fade(o,1-k)})}break;
 case'bless':{const t=tor(.55,.04,col,.95);t.rotation.x=Math.PI/2;vf(t,1.1,(o,k)=>{o.position.set(hero.position.x,3.4-1.2*Math.min(1,k*2),hero.position.z);fade(o,k>.6?.95*(1-(k-.6)/.4):.95)});pillar(hp,col,.9,5,.8);burst(hp.clone().setY(.5),col,16,2.5,5);break}
 }}
