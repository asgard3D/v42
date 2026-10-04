/* 怪物建模與生成 */
// ---------- monsters ----------
const bxm=(g,w,h,d,m,x,y,z)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=true;g.add(o);return o};
const sp=(g,r,m,x,y,z)=>{const o=new THREE.Mesh(new THREE.SphereGeometry(r,6,5),m);o.position.set(x,y,z);g.add(o);return o};
const dk=(c,v)=>new THREE.Color(c).offsetHSL(0,0,v);
function org(g,rx,ry,rz,c,x,y,z,o){o=o||{};const ge=new THREE.SphereGeometry(1,20,14),p=ge.attributes.position,cl=new THREE.Color(c),k=new THREE.Color(),cs=[];
 for(let i=0;i<p.count;i++){const a=p.getX(i),b=p.getY(i),d=p.getZ(i),n=1+Math.sin(a*5+b*3)*Math.cos(d*4+b*2)*.05;p.setXYZ(i,a*n,b*n,d*n);k.copy(cl).offsetHSL(0,0,b*.08-.04+Math.sin(a*9+d*7)*.015);cs.push(k.r,k.g,k.b)}
 ge.setAttribute('color',new THREE.Float32BufferAttribute(cs,3));ge.computeVertexNormals();
 const m=new THREE.Mesh(ge,new THREE.MeshPhongMaterial({vertexColors:true,shininess:o.sh||12,transparent:!!o.a,opacity:o.a||1,emissive:o.e||0}));m.scale.set(rx,ry,rz);m.position.set(x,y,z);m.castShadow=true;g.add(m);return m}
const eye=(g,x,y,z,r,c)=>{const e=new THREE.Mesh(new THREE.SphereGeometry(r,12,10),new THREE.MeshPhongMaterial({color:0xffffff,shininess:80}));e.position.set(x,y,z);g.add(e);const i=new THREE.Mesh(new THREE.SphereGeometry(r*.62,10,8),new THREE.MeshBasicMaterial({color:c}));i.position.set(x,y,z+r*.55);g.add(i);const h=new THREE.Mesh(new THREE.SphereGeometry(r*.2,6,5),new THREE.MeshBasicMaterial({color:0xffffff}));h.position.set(x+r*.2,y+r*.25,z+r*.95);g.add(h)};
const limb=(g,r1,r2,len,c,x,y,z,rz)=>{const o=new THREE.Mesh(new THREE.CylinderGeometry(r2,r1,len,10),new THREE.MeshPhongMaterial({color:c,shininess:8}));o.position.set(x,y,z);o.rotation.z=rz||0;o.castShadow=true;g.add(o);return o};
const spk=(g,r,h,c,x,y,z,rx,rz,e)=>{const o=new THREE.Mesh(new THREE.ConeGeometry(r,h,6),new THREE.MeshPhongMaterial({color:c,emissive:e||0,shininess:40}));o.position.set(x,y,z);o.rotation.set(rx||0,0,rz||0);g.add(o);return o};
function mkPoring(g,c,k){const b=new THREE.Group(),C=new THREE.Color(c);g.add(b);
 org(b,.75,.05,.75,c,0,.03,0,{a:.45,sh:60});org(b,.55,.48,.55,c,0,.42,0,{a:.8,sh:100,e:C.clone().multiplyScalar(.2)});org(b,.2,.18,.2,dk(c,-.25),0,.34,.05,{sh:50});org(b,.13,.06,.08,0xffffff,-.2,.76,.22,{a:.7,sh:120});
 [-1,1].forEach(s=>eye(b,s*.17,.5,.44,.085,0x221122));org(b,.08,.025,.03,0x4a1a2a,0,.36,.5);
 if(k==1)[-1,1].forEach(s=>spk(b,.08,.34,0xeeeeee,s*.26,.88,0,0,-s*.4));
 if(k==2)[[.3,.78,.05],[-.28,.82,.12],[0,.92,-.2]].forEach(p=>spk(b,.12,.5,c,p[0],p[1],p[2],0,0,c));
 b.userData.k=3;return b}
function mkMush(g,c,k){const b=new THREE.Group(),C=new THREE.Color(c);g.add(b);
 org(b,.24,.36,.24,0xf0e4c4,0,.34,0,{sh:6});[-1,1].forEach(s=>org(b,.12,.07,.16,0xe0d4b4,s*.2,.06,.08));org(b,.66,.1,.66,0xe8d8b0,0,.62,0);
 org(b,.68,.42,.68,c,0,.78,0,{sh:30,e:k==2?C.clone().multiplyScalar(.5):0});
 [[.3,.2],[-.32,.12],[.05,-.3],[-.1,.38],[.38,-.15]].forEach(p=>org(b,.11,.045,.11,k==1?0xffe070:0xffffff,p[0],.78+.42*Math.sqrt(Math.max(0,1-(p[0]*p[0]+p[1]*p[1])/.46)),p[1]));
 [-1,1].forEach(s=>eye(b,s*.1,.4,.21,.065,0x221122));org(b,.06,.02,.03,0x4a1a1a,0,.28,.24);b.userData.k=3;return b}
function mkWolf(g,c1,c2,k){const b=new THREE.Group();g.add(b);
 org(b,.3,.3,.62,c1,0,.65,0,{sh:6});org(b,.31,.33,.3,c1,0,.7,.36,{sh:6});org(b,.27,.29,.3,dk(c1,-.05),0,.62,-.38,{sh:6});
 org(b,.17,.2,.26,c1,0,.84,.6);org(b,.22,.2,.26,c1,0,.9,.82);org(b,.12,.1,.2,c2,0,.84,1.02);org(b,.05,.04,.04,0x111111,0,.88,1.2);
 [-1,1].forEach(s=>{spk(b,.07,.24,c1,s*.12,1.13,.74);eye(b,s*.11,.96,.98,.045,k==2?0x66ccff:0xff3030);spk(b,.025,.1,0xffffff,s*.06,.74,1.08,Math.PI);
  [.4,-.4].forEach(q=>{const lg=new THREE.Group();lg.position.set(s*.18,.62,q);b.add(lg);limb(lg,.1,.06,.6,c1,0,-.3,0);org(lg,.09,.05,.13,c2,0,-.58,.05);(b.userData.legs=b.userData.legs||[]).push({g:lg,ph:(s>0)==(q>0)?0:Math.PI})})});
 [[.75,-.8,.1],[.85,-1,.08],[.97,-1.16,.06]].forEach(p=>org(b,p[2],p[2],.2,c1,0,p[0],p[1]));
 for(let i=0;i<5;i++)spk(b,.05,k?.4:.18,k?c2:dk(c1,-.1),0,.97,.45-i*.25,-.5,0,k?c2:0);
 b.userData.k=.8;return b}
function mkBoss(g,c1,c2,k){const b=new THREE.Group(),C2=new THREE.Color(c2);g.add(b);
 org(b,.85,1,.62,c1,0,1.55,0,{sh:5});org(b,.4,.45,.22,c2,0,1.65,.5,{e:C2.clone().multiplyScalar(.7),sh:60});org(b,.5,.4,.5,c1,-1,2.25,0);org(b,.5,.4,.5,c1,1,2.25,0);
 [-1,1].forEach(s=>{{const ag=new THREE.Group();ag.position.set(s*1.15,2.15,.1);b.add(ag);limb(ag,.3,.2,1.3,c1,0,-.65,0,s*.12);org(ag,.34,.3,.34,dk(c1,.04),s*.05,-1.37,.05);(b.userData.arms=b.userData.arms||[]).push({g:ag,s})}
  {const lg=new THREE.Group();lg.position.set(s*.45,1,0);b.add(lg);limb(lg,.34,.26,1,c1,0,-.5,0);org(lg,.42,.15,.55,dk(c1,-.06),0,-.9,.1);(b.userData.legs=b.userData.legs||[]).push({g:lg,ph:s>0?0:Math.PI})}eye(b,s*.2,2.85,.4,.09,0xffdd33);
  spk(b,.14,k?1:.5,k?0xd8d0c0:c2,s*.35,3.15,0,0,-s*.35,k?0:c2);if(k)spk(b,.18,.7,0xd8d0c0,s*1.2,2.75,0,0,-s*.6)});
 org(b,.46,.42,.44,c1,0,2.8,.1,{sh:5});org(b,.2,.06,.04,0x120808,0,2.6,.5);
 if(!k)[[0,3.35,0],[.5,3.2,.1],[-.5,3.25,-.1],[0,3.7,-.2]].forEach(p=>org(b,.55,.4,.55,c2,p[0],p[1],p[2],{sh:4}));
 b.userData.k=.8;return b}

// ---------- 新種族造型：鳥類／精靈／惡魔／蟲類／魔像／亡靈／龍族／植物 ----------
const pm=(c,e,s)=>new THREE.MeshPhongMaterial({color:c,shininess:s||10,emissive:e||0,flatShading:true});
const gl=(c,f)=>new THREE.Color(c).multiplyScalar(f);
const grp=(b,x,y,z)=>{const q=new THREE.Group();q.position.set(x,y,z);b.add(q);return q};
function mkBird(g,c1,c2,k){const b=new THREE.Group(),u=b.userData,E=k==2?gl(c2,.3):0;g.add(b);
 org(b,.3,.28,.46,c1,0,.55,0,{sh:20,e:E});org(b,.2,.2,.22,k==1?c2:c1,0,.84,.36,{sh:20});if(k==1)org(b,.1,.2,.1,c2,0,.7,.28);
 spk(b,.07,.26,0xe0a030,0,.8,.62,Math.PI/2,0);org(b,.12,.03,.3,c2,0,.52,-.52);
 [-1,1].forEach(s=>{eye(b,s*.1,.9,.5,.04,0xffcc22);const w=grp(b,s*.26,.66,0);org(w,.62,.05,.3,c2,s*.55,0,-.02,{sh:10,e:E});org(w,.34,.04,.22,c1,s*1.05,0,.02,{e:E});
  if(k==2)spk(w,.04,.3,c2,s*1.3,0,-.1,0,-s*1.57,c2);(u.wings=u.wings||[]).push({g:w,s});limb(b,.03,.025,.28,0xc08a30,s*.1,.22,.05)});
 u.hover=.7;u.k=2;return b}
function mkSpirit(g,c1,c2,k){const b=new THREE.Group(),u=b.userData;g.add(b);
 org(b,.38,.38,.38,c1,0,.6,0,{a:.55,sh:120,e:gl(c1,.45)});org(b,.2,.2,.2,c2,0,.6,0,{e:gl(c2,.9),sh:120});
 [-1,1].forEach(s=>eye(b,s*.12,.66,.3,.06,0x112233));
 const rg=new THREE.Mesh(new THREE.TorusGeometry(.55,.025,6,28),new THREE.MeshBasicMaterial({color:c2,transparent:true,opacity:.6}));rg.rotation.x=Math.PI/2;rg.position.y=.6;b.add(rg);u.spin=[rg];
 if(k==1)for(let i=0;i<5;i++){const a=i*1.2566;spk(b,.07,.4,c2,Math.cos(a)*.34,.6,Math.sin(a)*.34,Math.sin(a)*1.2,-Math.cos(a)*1.2,gl(c2,.5))}
 else if(k==2)[[0,1.05,0],[.2,.98,.1],[-.2,.95,-.1]].forEach(p=>spk(b,.12,.45,c2,p[0],p[1],p[2],0,0,gl(c2,.8)));
 else[-1,1].forEach(s=>{const w=grp(b,s*.3,.75,-.05);org(w,.3,.05,.18,0xffffff,s*.25,0,0,{a:.5,e:0x335566});(u.wings=u.wings||[]).push({g:w,s})});
 spk(b,.12,.45,c1,0,.15,0,Math.PI,0,gl(c1,.4));u.hover=.55;u.k=3;return b}
function mkDemon(g,c1,c2,k){const b=new THREE.Group(),u=b.userData;g.add(b);
 org(b,.3,.38,.22,c1,0,.95,0,{sh:15});org(b,.22,.22,.22,c1,0,1.4,.03,{sh:15});org(b,.1,.05,.08,dk(c1,-.2),0,1.3,.2);
 [-1,1].forEach(s=>{spk(b,.06,.36,c2,s*.15,1.64,0,0,-s*.35,gl(c2,.3));eye(b,s*.09,1.44,.2,.045,0xff4422);
  const ag=grp(b,s*.38,1.2,0);limb(ag,.07,.05,.5,c1,0,-.25,0,s*.1);org(ag,.08,.08,.08,c2,0,-.52,0,{e:gl(c2,.4)});(u.arms=u.arms||[]).push({g:ag,s});
  const lg=grp(b,s*.15,.62,0);limb(lg,.09,.06,.6,c1,0,-.3,0);org(lg,.1,.05,.14,dk(c1,-.1),0,-.6,.05);(u.legs=u.legs||[]).push({g:lg,ph:s>0?0:Math.PI});
  const wg=grp(b,s*.15,1.2,-.18);org(wg,.5,.02,.3,dk(c1,-.12),s*.5,.15,-.05,{sh:6});(u.wings=u.wings||[]).push({g:wg,s})});
 [[.62,-.28,.1],[.5,-.5,.08],[.4,-.7,.06]].forEach(p=>org(b,p[2],p[2],.16,c1,0,p[0],p[1]));spk(b,.08,.22,c2,0,.34,-.9,-Math.PI/2,0,gl(c2,.4));
 if(k==1){limb(b,.025,.025,1.4,0x3a2a1a,.55,.85,.35);org(b,.12,.12,.12,c2,.55,1.6,.35,{e:gl(c2,.9)})}
 if(k==3)u.hover=.6;u.k=3;return b}
function mkSpider(g,c1,c2,k){const b=new THREE.Group(),u=b.userData;g.add(b);
 org(b,.32,.26,.4,c1,0,.5,-.18,{sh:20});org(b,.22,.2,.22,dk(c1,.04),0,.5,.28,{sh:20});
 [-1,1].forEach(s=>{eye(b,s*.08,.58,.46,.045,0xff2020);eye(b,s*.14,.54,.43,.03,0xff2020);spk(b,.03,.18,c2,s*.07,.38,.5,Math.PI*.8,0)});
 const n=k==1?3:4;for(let i=0;i<n;i++)[-1,1].forEach(s=>{const lg=grp(b,s*.2,.5,.2-i*(k==1?.28:.2));limb(lg,.035,.025,.8,c2,s*.42,-.2,0,s*.9);(u.legs=u.legs||[]).push({g:lg,ph:(i+(s>0?0:1))%2?0:Math.PI})});
 if(k==1){[[.55,-.5],[.8,-.62],[1,-.55],[1.12,-.32]].forEach(p=>org(b,.09,.09,.09,c1,0,p[0],p[1]));spk(b,.07,.26,c2,0,1.12,-.1,2.3,0,gl(c2,.4));[-1,1].forEach(s=>org(b,.14,.08,.2,c2,s*.3,.45,.62))}
 u.k=3;return b}
function mkGolem(g,c1,c2,k){const b=new THREE.Group(),u=b.userData,sh=k==1?80:6;g.add(b);
 bxm(b,.8,.9,.5,pm(c1,0,sh),0,1.05,0);bxm(b,.28,.28,.12,pm(c2,gl(c2,.8)),0,1.1,.28);bxm(b,.42,.38,.4,pm(dk(c1,.04),0,sh),0,1.78,.04);
 [-1,1].forEach(s=>{eye(b,s*.1,1.82,.25,.05,0xffee66);bxm(b,.3,.22,.3,pm(c1,0,sh),s*.55,1.62,0);
  const ag=grp(b,s*.6,1.4,0);bxm(ag,.3,.8,.3,pm(c1,0,sh),0,-.4,0);bxm(ag,.4,.36,.4,pm(dk(c1,-.05),0,sh),0,-.9,0);(u.arms=u.arms||[]).push({g:ag,s});
  const lg=grp(b,s*.25,.6,0);bxm(lg,.34,.6,.34,pm(c1,0,sh),0,-.3,0);bxm(lg,.4,.14,.5,pm(dk(c1,-.06),0,sh),0,-.62,.05);(u.legs=u.legs||[]).push({g:lg,ph:s>0?0:Math.PI})});
 if(k==1)[[-.3,1.62],[.25,1.7],[0,1.5],[.4,1.45]].forEach((p,i)=>spk(b,.09,.5,c2,p[0],p[1]+.2,-.1,0,(i-1.5)*.2,gl(c2,.5)));
 u.k=1.2;return b}
function mkUndead(g,c1,c2,k){const b=new THREE.Group(),u=b.userData;g.add(b);
 limb(b,.04,.04,.5,c1,0,1.0,0);[0,1,2].forEach(i=>org(b,.26-i*.03,.03,.1,c1,0,1.18-i*.14,.04));org(b,.2,.06,.12,c1,0,.72,0);
 org(b,.17,.19,.17,c1,0,1.6,.02,{sh:30});org(b,.1,.05,.1,c1,0,1.43,.1);
 [-1,1].forEach(s=>{org(b,.04,.04,.03,c2,s*.07,1.62,.17,{e:gl(c2,1)});
  const ag=grp(b,s*.3,1.22,0);limb(ag,.035,.03,.55,c1,0,-.27,0);org(ag,.05,.05,.05,c1,0,-.56,0);(u.arms=u.arms||[]).push({g:ag,s});
  const lg=grp(b,s*.12,.7,0);limb(lg,.04,.035,.65,c1,0,-.32,0);org(lg,.06,.03,.1,c1,0,-.66,.05);(u.legs=u.legs||[]).push({g:lg,ph:s>0?0:Math.PI})});
 if(k==1){spk(b,.4,1.1,0x2a2236,0,.6,0);limb(b,.025,.025,1.5,0x3a2a1a,.5,.85,.3);org(b,.12,.12,.12,c2,.5,1.65,.3,{e:gl(c2,.9)})}
 u.k=3;return b}
function mkDrake(g,c1,c2,k){const b=new THREE.Group(),u=b.userData,E=k==1?gl(c2,.35):0;g.add(b);
 org(b,.38,.36,.7,c1,0,.9,0,{sh:30,e:E});org(b,.16,.3,.16,c1,0,1.25,.62,{sh:30});org(b,.22,.2,.34,c1,0,1.55,.82,{sh:30});org(b,.12,.1,.2,c2,0,1.5,1.12);
 for(let i=0;i<5;i++)spk(b,.06,.22,c2,0,1.26,.4-i*.25,0,0,gl(c2,.3));
 [[.85,-.9,.22],[.8,-1.2,.17],[.75,-1.5,.12]].forEach(p=>org(b,p[2],p[2],.3,c1,0,p[0],p[1]));spk(b,.07,.3,c2,0,.74,-1.8,-Math.PI/2,0);
 [-1,1].forEach(s=>{eye(b,s*.12,1.6,.92,.045,0xffcc22);spk(b,.05,.34,c2,s*.12,1.78,.7,-.7,-s*.3);
  const w=grp(b,s*.3,1.1,-.05);org(w,.9,.03,.45,c2,s*.8,.1,-.1,{a:.92,sh:10,e:E});(u.wings=u.wings||[]).push({g:w,s});
  [.35,-.4].forEach(z=>{const lg=grp(b,s*.26,.8,z);limb(lg,.09,.06,.6,c1,0,-.3,0);org(lg,.1,.05,.14,c2,0,-.6,.05);(u.legs=u.legs||[]).push({g:lg,ph:(s>0)==(z>0)?0:Math.PI})})});
 u.k=1.5;return b}
function mkPlant(g,c1,c2,k){const b=new THREE.Group(),u=b.userData;g.add(b);
 if(k==0){org(b,.3,.7,.3,c1,0,.75,0,{sh:15});[-1,1].forEach(s=>{org(b,.12,.28,.12,c1,s*.42,.98,0);org(b,.28,.1,.1,c1,s*.27,.8,0);eye(b,s*.1,.95,.27,.06,0x221122)});
  for(let i=0;i<8;i++){const a=i*.785;spk(b,.025,.14,0xf0f0c0,Math.cos(a)*.3,.55+(i%3)*.25,Math.sin(a)*.3,Math.sin(a)*1.3,-Math.cos(a)*1.3)}org(b,.14,.07,.14,c2,0,1.5,0,{e:gl(c2,.4)})}
 else{limb(b,.1,.07,.8,c1,0,.4,0);[-1,1].forEach(s=>org(b,.3,.05,.12,dk(c1,-.1),s*.3,.3,0));
  org(b,.38,.2,.32,c2,0,1.0,0,{sh:40});org(b,.36,.12,.3,dk(c2,-.1),0,.78,.05,{sh:40});
  for(let i=0;i<5;i++)[.86,.98].forEach(y=>spk(b,.03,.12,0xffffff,-.24+i*.12,y,.28,y>.9?Math.PI:0,0));
  [-1,1].forEach(s=>eye(b,s*.13,1.14,.22,.05,0x221122));u.spin=undefined}
 u.k=3;return b}

const mons=[],mq=[];
function spawn(ty){const T=MT[ty],lvl=T.lv+Math.floor(R(0,2)),g=new THREE.Group();let b;try{b=T.mk(g)}catch(err){console.error('怪物建模失敗',T.id||T.n,err);while(g.children.length)g.remove(g.children[0]);b=mkPoring(g,0x888899,0)}let p;
 if(T.boss)p=new THREE.Vector3(-27,0,-27);else{const a=R(0,6.28),d=R(T.z[0],T.z[1]);p=new THREE.Vector3(Math.cos(a)*d,0,Math.sin(a)*d)}
 g.position.copy(p);const hp=Math.round(T.hp*(1+(lvl-T.lv)*.3)),m={ty,T,g,b,by:1,hp,max:hp,lvl,home:p.clone(),wt:0,wd:p.clone(),atk:0,dead:false,sq:0};
 g.userData.m=m;scene.add(g);mons.push(m);return m}
const MKF={poring:mkPoring,mush:mkMush,wolf:mkWolf,boss:mkBoss,bird:mkBird,spirit:mkSpirit,demon:mkDemon,spider:mkSpider,golem:mkGolem,undead:mkUndead,drake:mkDrake,plant:mkPlant};
