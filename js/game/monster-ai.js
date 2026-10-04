/* 怪物行為／Boss 技能 */
// ---------- 怪物行為：走路方式／攻擊預警／遠程／群體圍攻／Boss 技能 ----------
function qAdd(t,fn){mq.push({t,fn})}
function tickQ(dt){for(let i=mq.length-1;i>=0;i--){const e=mq[i];if(!e)continue;e.t-=dt;if(e.t<=0){mq.splice(i,1);try{e.fn()}catch(_){}}}}
function teleC(x,z,r,dur){const g=new THREE.Group(),ol=new THREE.Mesh(new THREE.RingGeometry(r*.95,r,48),bm(0xff3a3a,.85)),fi=new THREE.Mesh(new THREE.CircleGeometry(r,48),bm(0xff2a2a,.3));
 ol.rotation.x=fi.rotation.x=-Math.PI/2;g.add(ol,fi);g.position.set(x,gH(x,z)+.1,z);
 vf(g,dur,(o,k)=>{const s=Math.max(.03,k);fi.scale.set(s,s,1);fi.material.opacity=.18+.32*k;ol.material.opacity=.55+.4*Math.abs(Math.sin(k*20))})}
function teleL(x,z,dx,dz,len,wid,dur){const g=new THREE.Group(),a=new THREE.PlaneGeometry(wid,len);a.translate(0,len/2,0);
 const ol=new THREE.Mesh(a,bm(0xff3a3a,.18)),fi=new THREE.Mesh(a,bm(0xff2a2a,.38));
 ol.rotation.x=fi.rotation.x=Math.PI/2;g.add(ol,fi);g.position.set(x,gH(x,z)+.1,z);g.rotation.y=Math.atan2(dx,dz);
 vf(g,dur,(o,k)=>{fi.scale.set(1,Math.max(.03,k),1);fi.material.opacity=.25+.35*k})}
function hurtP(m,mul,tag){const T0=m.T,hp=hero.position;
 if(Rules.dodge(S,Math.random)){fl(hp,'MISS','#9ad0ff');Sfx.ui('miss');return}/* 閃避：被動技能或隱身增益 */
 const dm=Rules.monsterDamage(S,T0,m.lvl,mul,Math.random);
 S.hp-=dm;fl(hp,'-'+dm,'#ff7070');logMsg('戰鬥',T0.n+(tag?' 的'+tag:'')+' 對你造成 '+dm+' 傷害','#ff8a8a');
 if(S.hp<=0){S.hp=maxHp();hp.set(0,0,0);S.tm=null;S.dest=null;say('倒下了，已在營地復活','戰鬥','#ff8a8a');
  mons.forEach(x=>{x.act=(x.act||0)+1;if(x.st!==undefined){x.st='idle';x.cT=0;x.cdAtk=2;if(!x.sum)x.al=0}})}}
function alertGroup(m){if(m.dead)return;if(m.T.boss){m.al=15;return}
 const hp=hero.position,P=m.g.position;m.al=m.sum?999:7;
 mons.forEach(o=>{if(o!==m&&!o.dead&&!o.T.boss&&!o.sum&&o.g.position.distanceTo(P)<11)o.al=Math.max(o.al||0,7)});
 const L=mons.filter(o=>!o.dead&&o.al>0&&!o.T.boss&&o.T.ai!=='spore'),base=Math.atan2(P.x-hp.x,P.z-hp.z);
 L.forEach((o,i)=>o.fa=base+i*6.2832/L.length)}
function killSummons(){mons.forEach(x=>{if(x.sum&&!x.dead){x.dead=true;setTimeout(()=>{scene.remove(x.g);const i=mons.indexOf(x);if(i>=0)mons.splice(i,1)},900)}})}
function summonMinions(b){const bp=b.g.position;let n=0;mons.forEach(x=>{if(x.sum&&!x.dead)n++});
 for(let i=0;i<Math.min(2,4-n);i++){const a=R(0,6.28),x=bp.x+Math.cos(a)*3.5,z=bp.z+Math.sin(a)*3.5,mm=spawn('m0');
  mm.g.position.set(x,gH(x,z),z);mm.home.set(x,0,z);mm.wd.set(x,0,z);mm.sum=true;mm.al=999;
  pillar(new THREE.Vector3(x,0,z),0xaa44ff,.6,6,.6,i*120);burst(new THREE.Vector3(x,.4,z),0xcc88ff,14,3,4)}}
const KN={slam:'重擊',charge:'衝撞',summon:'召喚'};
function startWind(m,kind,dur){const p=m.g.position,hp=hero.position,T0=m.T;m.st='wind';m.kind=kind;m.wd=dur;m.stT=dur;m.act=(m.act||0)+1;m.cT=0;
 const dx=hp.x-p.x,dz=hp.z-p.z,d=Math.hypot(dx,dz)||1,ux=dx/d,uz=dz/d;m.lx=ux;m.lz=uz;
 if(kind=='bump')teleC(p.x,p.z,T0.rg+.6,dur);
 else if(kind=='spore'){m.tx=hp.x;m.tz=hp.z;teleC(m.tx,m.tz,1.5,dur+.8)}
 else if(kind=='lunge'){m.len=Math.min(6.5,d+1.5);teleL(p.x,p.z,ux,uz,m.len,1.6,dur)}
 else if(kind=='slam'){m.rad=m.enr?4.8:4.2;teleC(p.x,p.z,m.rad,dur)}
 else if(kind=='charge')teleL(p.x,p.z,ux,uz,10,2.6,dur);
 else if(kind=='summon'){ring(new THREE.Vector3(p.x,0,p.z),0xaa44ff,5);burst(new THREE.Vector3(p.x,.5,p.z),0xcc88ff,16,3,5)}
 if(KN[kind])logMsg('戰鬥',T0.n+' 發動「'+KN[kind]+'」！','#ffb070')}
function fireAct(m,hp){const p=m.g.position,T0=m.T,k=m.kind,B=!!T0.boss,dist=Math.hypot(hp.x-p.x,hp.z-p.z),live=S.mode!='create';
 m.nextCd=B?R(2,3.2)*(m.enr?.65:1):T0.cd+(T0.ai=='spore'?1.2:T0.ai=='lunge'?R(.3,1):0);
 const rec=t=>{m.st='rec';m.rd=m.stT=t};
 if(k=='bump'){if(live&&dist<=T0.rg+.6)hurtP(m,1);burst(new THREE.Vector3(p.x,.2,p.z),0xffffff,8,2,2);rec(.45)}
 else if(k=='spore'){const pc=T0.pc||0xc8ff6a,a=new THREE.Vector3(p.x,1.3+(m.b.userData.hover||0),p.z),b=new THREE.Vector3(m.tx,.2,m.tz),s=new THREE.Mesh(new THREE.SphereGeometry(.22,10,8),bm(pc,.95)),tx=m.tx,tz=m.tz;
  s.position.copy(a);vf(s,.8,(o,kk)=>{o.position.lerpVectors(a,b,kk);o.position.y+=Math.sin(kk*Math.PI)*2.4});
  qAdd(.8,()=>{burst(new THREE.Vector3(tx,.3,tz),pc,14,3.5,3);const q=hero.position;if(S.mode!='create'&&Math.hypot(q.x-tx,q.z-tz)<=1.5)hurtP(m,.8,T0.an||'孢子')});rec(.4)}
 else if(k=='lunge'){m.st='dash';m.stT=.28;m.dsp=m.len/.28;m.hitD=false;m.hr=1.15;m.dmul=1.25;m.tag=T0.an||'撲咬'}
 else if(k=='slam'){shk=.55;ring(new THREE.Vector3(p.x,0,p.z),0xffaa55,m.rad*.9);burst(new THREE.Vector3(p.x,.3,p.z),0xffc080,24,6,5);if(live&&dist<=m.rad)hurtP(m,1.6,'重擊');rec(.9)}
 else if(k=='charge'){m.st='dash';m.stT=.6;m.dsp=10/.6;m.hitD=false;m.hr=1.9;m.dmul=1.5;m.tag='衝撞';shk=.2}
 else if(k=='summon'){summonMinions(m);rec(.7)}}
function applyPose(m,o,q){m.b.scale.set(q*o.wx,m.by/q*o.wy,q*o.wx);m.b.position.y=o.yo+(m.b.userData.hover||0);m.b.rotation.z=o.rz;m.b.rotation.x=o.rx}
function monTick(m,dt,hp,cr){
 const p=m.g.position,T0=m.T,B=!!T0.boss,ai=B?'boss':T0.ai,gt=T0.gait;
 if(m.dead){m.g.scale.multiplyScalar(.9);return}
 if(m.st===undefined)Object.assign(m,{st:'idle',stT:0,ph:R(0,6.28),al:0,fa:0,cdAtk:R(.4,1.4),act:0,cT:0,cs:1,mvL:false,sm:1,lstS:0,nextCd:1});
 m.sq=Math.max(0,m.sq-dt);p.y=gH(p.x,p.z);
 const ud=m.b.userData,Lg=ud.legs,Ar=ud.arms,q=1+m.sq*(ud.k||3),o={wx:1,wy:1,yo:0,rz:0,rx:0};let lf=null,af=null;
 if(cr){applyPose(m,o,q);return}
 const dxp=hp.x-p.x,dzp=hp.z-p.z,dp=Math.hypot(dxp,dzp)||.001;
 m.cdAtk-=dt;if(m.al>0&&m.al<900)m.al-=dt;
 if(!m.sum&&Math.hypot(p.x-m.home.x,p.z-m.home.z)>30)m.al=0;
 const ag=T0.ag,aggro=dp<ag||m.al>0;
 if(B&&!m.enr&&m.hp<m.max*.3){m.enr=1;shk=.45;logMsg('戰鬥',T0.n+' 進入狂暴狀態！','#ff6a6a');say(T0.n+' 狂暴了！','戰鬥','#ff6a6a')}
 // 走路方式：依怪物種類調整步頻與移動速度節奏
 m.sm=gt=='hop'?.1+2.8*Math.max(0,Math.sin(m.ph)):gt=='sway'?.65+.6*Math.abs(Math.cos(m.ph)):gt=='stomp'?.65+.6*Math.abs(Math.sin(m.ph)):1;
 let moving=false,sv=T0.sp;
 const walk=(tx,tz,spd,stop)=>{const dx=tx-p.x,dz=tz-p.z,d=Math.hypot(dx,dz);if(d>stop){const s=spd*m.sm*dt;p.x+=dx/d*s;p.z+=dz/d*s;face(m.g,dx,dz,dt,8);moving=true}},
 strafe=sp=>{const nx=dxp/dp,nz=dzp/dp,k=Math.max(-1,Math.min(1,(dp-3.6)*.5)),vx=-nz*m.cs+nx*k,vz=nx*m.cs+nz*k,vl=Math.hypot(vx,vz)||1;
  p.x+=vx/vl*sp*dt;p.z+=vz/vl*sp*dt;face(m.g,dxp,dzp,dt,10);moving=true};
 if(m.st=='wind'){
  m.stT-=dt;const trk=m.kind=='bump'||m.kind=='spore'||m.kind=='slam'||m.kind=='summon';
  if(trk)face(m.g,dxp,dzp,dt,10);else face(m.g,m.lx,m.lz,dt,14);
  if(m.stT<=0)fireAct(m,hp)}
 else if(m.st=='dash'){
  m.stT-=dt;const s=m.dsp*dt;p.x+=m.lx*s;p.z+=m.lz*s;
  if(!m.hitD&&Math.hypot(hp.x-p.x,hp.z-p.z)<m.hr){m.hitD=true;hurtP(m,m.dmul,m.tag)}
  if(m.stT<=0){m.st='rec';m.rd=m.stT=B?.9:.5}}
 else if(m.st=='rec'){m.stT-=dt;if(m.stT<=0){m.st='idle';m.cdAtk=m.nextCd}}
 else if(aggro){
  sv=T0.ch*(m.enr?1.25:1);
  if(ai=='spore'){
   face(m.g,dxp,dzp,dt,8);
   if(dp<4.2)walk(p.x-dxp,p.z-dzp,sv*1.1,.1);else if(dp>7.2)walk(hp.x,hp.z,sv,0);
   if(m.cdAtk<=0&&dp<=8.2&&dp>=1.8)startWind(m,'spore',.6)}
  else if(ai=='lunge'){
   if(m.cT>0){m.cT-=dt;strafe(sv*.85);if(m.cT<=0)startWind(m,'lunge',.5)}
   else if(m.cdAtk<=0){if(dp<=2.4)startWind(m,'lunge',.4);else if(dp<=6.5){m.cT=R(.9,1.6);m.cs=Math.random()<.5?-1:1}else walk(hp.x,hp.z,sv,T0.rg*.8)}
   else if(dp<4.8)strafe(sv*.6);
   else{let tx=hp.x,tz=hp.z;if(m.al>0&&dp<10){tx=hp.x+Math.sin(m.fa)*3.2;tz=hp.z+Math.cos(m.fa)*3.2}walk(tx,tz,sv,T0.rg*.8)}}
  else if(B){
   if(m.cdAtk<=0){
    if(!m.s1&&m.hp<=m.max*.66){m.s1=1;startWind(m,'summon',1)}
    else if(!m.s2&&m.hp<=m.max*.33){m.s2=1;startWind(m,'summon',1)}
    else if(dp>4.8&&dp<=13)startWind(m,'charge',1);
    else if(dp<=4.8)startWind(m,'slam',1.1)}
   if(m.st=='idle')walk(hp.x,hp.z,sv,T0.rg*.8)}
  else{
   let tx=hp.x,tz=hp.z,stop=T0.rg*.8;
   if(m.al>0&&dp>T0.rg*1.3&&dp<10){const rr=T0.rg*.8;tx=hp.x+Math.sin(m.fa)*rr;tz=hp.z+Math.cos(m.fa)*rr;stop=.35}
   walk(tx,tz,sv,stop);
   if(m.cdAtk<=0&&dp<=T0.rg+.3)startWind(m,'bump',.55)}}
 else{m.wt-=dt;if(m.wt<=0){m.wt=R(2,4);m.wd=m.home.clone().add(new THREE.Vector3(R(-4,4),0,R(-4,4)))}walk(m.wd.x,m.wd.z,T0.sp,.3)}
 // 怪物之間互相推開，避免疊在一起（圍攻時會散開站位）
 if(m.st!='dash')mons.forEach(x=>{if(x===m||x.dead)return;const dx=p.x-x.g.position.x,dz=p.z-x.g.position.z,d=Math.hypot(dx,dz),rr=(B||x.T.boss)?2.2:1;
  if(d<rr&&d>.001){const pu=(rr-d)*.5*Math.min(1,dt*8);p.x+=dx/d*pu;p.z+=dz/d*pu}});
 p.x=Math.max(-38,Math.min(38,p.x));p.z=Math.max(-38,Math.min(38,p.z));
 m.mvL=moving;if(moving)m.ph+=dt*(T0.pr||8)*(aggro?1.25:1);
 const ph=m.ph;
 if(m.st=='idle'||m.st=='wind'&&false){
  if(gt=='hop'){if(moving){const s=Math.sin(ph),hop=Math.max(0,s),ln=Math.max(0,-s);o.yo=hop*.45;o.wy=1+.14*hop-.2*ln;o.wx=1-.06*hop+.1*ln}else{o.wy=1+Math.sin(T*2+m.lvl)*.04;o.wx=1-Math.sin(T*2+m.lvl)*.02}}
  else if(gt=='sway'){if(moving){o.rz=Math.sin(ph)*.17;o.yo=Math.abs(Math.sin(ph))*.07;o.wy=1+Math.sin(ph*2)*.03}else o.rz=Math.sin(T*1.6+m.lvl)*.02}
  else if(gt=='run'){if(moving){lf=l=>Math.sin(ph+l.ph)*.75;o.yo=(Math.sin(ph*2)*.5+.5)*.07;o.rx=Math.sin(ph*2)*.025;o.rz=Math.sin(ph)*.03}else o.wy=1+Math.sin(T*2.2+m.lvl)*.015}
  else if(gt=='fly'){o.yo=Math.sin(T*3+m.ph)*.12;if(moving){o.rz=Math.sin(ph)*.06;o.rx=-.08;lf=l=>Math.sin(ph*1.5+l.ph)*.3}}
   else{if(moving){lf=l=>Math.sin(ph+l.ph)*.5;af=a=>Math.sin(ph+(a.s>0?Math.PI:0))*.38;o.yo=Math.abs(Math.sin(ph))*.1;o.rz=Math.sin(ph)*.05;
    const sg=Math.sin(ph)>=0?1:-1;if(m.lstS&&sg!==m.lstS&&dp<14)shk=Math.max(shk,.1);m.lstS=sg}else o.wy=1+Math.sin(T*1.5)*.012}}
 else{
  const k=m.kind,w=m.st=='wind',d=m.st=='dash',r=m.st=='rec',u=w?1-Math.max(0,m.stT)/m.wd:1,v=r?1-Math.max(0,m.stT)/m.rd:0,e=Math.sin(v*Math.PI);
  if(k=='bump'){if(w){o.wy=1-.38*u;o.wx=1+.22*u}else if(r){o.yo=e*.6;o.wy=1+.18*e;o.wx=1-.06*e}}
  else if(k=='spore'){if(w){o.wx=o.wy=1+.35*u;o.rx=-.3*u}else if(r){o.wx=o.wy=1.35-.35*v;o.rx=-.3*(1-v)}}
  else if(k=='lunge'){if(w){o.yo=-.16*u;o.rx=.22*u;lf=()=>.45*u}else if(d){o.rx=-.12;o.yo=.12;lf=l=>Math.sin(T*26+l.ph)*.95}}
  else if(k=='slam'){if(w){af=()=>-2.5*u;o.rx=-.12*u}else if(r){af=()=>v<.33?-2.5+2.8*(v/.33):.3*(1-(v-.33)/.67);o.rx=.2*e}}
  else if(k=='charge'){if(w){o.rx=-.25*u;af=()=>.7*u}else if(d){o.rx=.3;o.yo=.1;af=()=>1;lf=l=>Math.sin(T*14+l.ph)*.7}}
  else if(k=='summon'){if(w){af=()=>-2.2*u+Math.sin(T*22)*.1;o.yo=.18*u}else if(r)af=()=>-2.2*(1-v)}}
 applyPose(m,o,q);
 if(ud.wings){const fa=gt=='fly'?.65:.12,fs=(moving||aggro)?16:9;ud.wings.forEach(w=>{w.g.rotation.z=w.s*Math.sin(T*fs+m.ph)*fa})}
  if(ud.spin)ud.spin.forEach(s=>{s.rotation.z+=dt*2.2});
  const kk=Math.min(1,dt*14);
 if(Lg)Lg.forEach((l,i)=>{const t=lf?lf(l,i):0;l.g.rotation.x+=(t-l.g.rotation.x)*kk});
 if(Ar)Ar.forEach((a,i)=>{const t=af?af(a,i):0;a.g.rotation.x+=(t-a.g.rotation.x)*kk})}
