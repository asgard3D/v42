/* 地圖場景：地形、日夜、傳送門、進入地圖 */
// ---------- zones ----------
const trees=[],portals=[];
let zoneHint=null,Z=0,zg=new THREE.Group(),MT={},pw=0;scene.add(zg);
function tree(x,z,s){const t=new THREE.Group(),zz=ZN[Z],c=zz.tc[Math.floor(R(0,3))],ad=m=>{m.castShadow=true;t.add(m);return m},ty=zz.t,
 cy=(a,b,h,y,m,sg)=>{const o=new THREE.Mesh(new THREE.CylinderGeometry(a,b,h,sg||7),m);o.position.y=y;return ad(o)},
 cn=(r,h,y,m,sg)=>{const o=new THREE.Mesh(new THREE.ConeGeometry(r,h,sg||7),m);o.position.y=y;return ad(o)},
 bl=(r,y,m,px,pz)=>{const o=new THREE.Mesh(new THREE.IcosahedronGeometry(r,1),m);o.position.set(px||0,y,pz||0);return ad(o)},
 gl=(e,i)=>new THREE.MeshLambertMaterial({color:c,emissive:e,emissiveIntensity:i||.5});
 if(ty==1){const m=M(c);cy(.25*s,.3*s,2.2*s,1.1*s,m);[-1,1].forEach(q=>{const a=cy(.1*s,.1*s,.55*s,1.2*s,m);a.rotation.z=1.57;a.position.x=q*.3*s;cy(.1*s,.1*s,.7*s,1.55*s,m).position.x=q*.55*s})}
 else if(ty==3){const o=new THREE.Mesh(new THREE.ConeGeometry(.5*s,3.4*s,5),new THREE.MeshLambertMaterial({color:c,emissive:0x5a1408}));o.position.y=1.7*s;ad(o)}
 else if(ty==4){cy(.15*s,.3*s,2.4*s,1.2*s,M(0x3a2e22),6);bl(1.1*s,2.5*s,M(c),.3*s,0);bl(.8*s,2.2*s,M(c),-.6*s,.3*s);cy(.03*s,.03*s,1.2*s,1.6*s,M(0x6a8a4a),4).position.x=.9*s}
 else if(ty==5){[[0,0,2.6],[.6,.3,1.6],[-.5,-.4,1.2]].forEach(a=>{const o=cn(.35*s,a[2]*s,a[2]*s/2,gl(c,.45),5);o.position.x=a[0]*s;o.position.z=a[1]*s;o.rotation.z=a[0]*.3})}
 else if(ty==6){bl(.9*s,1.2*s,M(c,0x223344));bl(.7*s,1.1*s,M(c,0x223344),.8*s,.2*s);bl(.6*s,1*s,M(c,0x223344),-.7*s,-.2*s)}
 else if(ty==7){cy(.45*s,.5*s,2.8*s,1.4*s,M(c),8);cy(.6*s,.6*s,.3*s,.15*s,M(c),8);cy(.3*s,.4*s,.9*s,3.1*s,M(c),5).rotation.z=.25}
 else if(ty==8){const o=new THREE.Mesh(new THREE.OctahedronGeometry(.6*s),gl(c,.8));o.scale.y=2.2;o.position.y=2.2*s;ad(o)}
 else if(ty==9){cy(.35*s,.42*s,3.4*s,1.7*s,gl(0x6a4a10,.5),12);cy(.55*s,.55*s,.25*s,3.5*s,gl(0x6a4a10,.5),12)}
 else{cy(.18*s,.28*s,1.2*s,.6*s,M(ty==2?0x6a5a4a:0x5a3a22),6);const l1=new THREE.Mesh(new THREE.ConeGeometry(1.3*s,2.2*s,7),M(c)),l2=new THREE.Mesh(new THREE.ConeGeometry(s,1.8*s,7),M(c));l1.position.y=2*s;l2.position.y=3.1*s;ad(l1);ad(l2)}
 t.position.set(x,gH(x,z),z);t.rotation.y=R(0,6);zg.add(t);trees.push({x,z,r:(ty==3?.45:.55)*s})}
// ---------- terrain / day-night ----------
function gH(x,z){const z0=ZN[Z],st=z0.st,s1=Math.sin(x*.11+1)*Math.cos(z*.09)*1.1+Math.sin(x*.23+z*.17)*.4+Math.sin(z*.31-x*.13)*.2;let h;
 if(st==1)h=(1-Math.abs(Math.sin(x*.13+z*.06+Math.sin(z*.08)*2)))*1.7-.6;
 else if(st==2)h=(1-Math.abs(s1))*2.2-.9;
 else if(st==3)h=s1*.7-Math.exp(-((x-10)**2+(z+8)**2)/40)*1.6-Math.exp(-((x+18)**2+(z-6)**2)/50)*1.4;
 else if(st==4)h=Math.round(s1*1.6)/1.6;else h=s1;
 h*=z0.ha;const r=Math.max(Math.abs(x),Math.abs(z));if(r>33)h+=Math.pow(r-33,1.6)*.35;
 const f=Math.min(1,Math.max(0,(Math.hypot(x,z)-5)/9))*Math.min(1,Math.hypot(x-31,z-31)/7)*Math.min(1,Math.hypot(x+31,z-31)/7),pw=Math.max(0,1-Math.hypot(x+14,z+10)/6.5);
 return h*f*(1-pw)-pw*1.1}
const segD=(x,z,a,b,c,d)=>{const t=Math.max(0,Math.min(1,((x-a)*(c-a)+(z-b)*(d-b))/((c-a)**2+(d-b)**2)));return Math.hypot(x-a-t*(c-a),z-b-t*(d-b))};
function terrain(z0){const ge=new THREE.PlaneGeometry(80,80,110,110);ge.rotateX(-Math.PI/2);const p=ge.attributes.position,c=new THREE.Color(z0.gr),hi=new THREE.Color(z0.g2),pa=new THREE.Color(z0.gr).offsetHSL(.02,-.15,.12),k=new THREE.Color(),cs=[];
 for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i),h=gH(x,z);p.setY(i,h);
  k.copy(c).offsetHSL(0,0,Math.sin(x*1.7)*Math.cos(z*1.3)*.03+Math.sin(x*.5+z*.4)*.025).lerp(hi,Math.min(1,Math.max(0,(h-.5)/2.2)));
  const d=Math.min(segD(x,z,0,0,31,31),segD(x,z,0,0,-31,31));if(d<1.8)k.lerp(pa,.7*(1-d/1.8));if(h<-.1)k.multiplyScalar(.7);cs.push(k.r,k.g,k.b)}
 ge.setAttribute('color',new THREE.Float32BufferAttribute(cs,3));ge.computeVertexNormals();return ge}
const SKY=new THREE.Color(0x8cc0f0),TW=new THREE.Color(0xff8a50),NT=new THREE.Color(),WM=new THREE.Color(0xfff0d0),bgC=new THREE.Color();let lastClk='';
const orb=new THREE.Mesh(new THREE.SphereGeometry(1,16,12),new THREE.MeshBasicMaterial({fog:false}));scene.add(orb);
const stars=(()=>{const a=new Float32Array(1500);for(let i=0;i<500;i++){const u=R(0,6.283),v=R(.05,1.4);a[i*3]=Math.cos(u)*Math.cos(v)*95;a[i*3+1]=Math.sin(v)*95;a[i*3+2]=Math.sin(u)*Math.cos(v)*95}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(a,3));const s=new THREE.Points(g,new THREE.PointsMaterial({color:0xffffff,size:1.6,fog:false,transparent:true,depthWrite:false}));scene.add(s);return s})();
function dn(hp){const d=new Date(),h=(d.getUTCHours()+8)%24+d.getUTCMinutes()/60+d.getUTCSeconds()/3600,a=(h-6)/12*Math.PI,s=Math.sin(a),dl=Math.min(1,Math.max(0,(s+.2)/.55)),tw=Math.max(0,1-Math.abs(s)/.3),z=ZN[Z];
 bgC.set(z.fog).multiplyScalar(2.4).lerp(SKY,z.sk).lerp(NT.set(z.fog).multiplyScalar(.28),1-dl).lerp(TW,tw*.3*z.sk);scene.background.copy(bgC);scene.fog.color.copy(bgC);
 hemi.intensity=.3+.6*dl;sun.intensity=.18+.75*dl;sun.color.set(0x7f95e0).lerp(WM,dl).lerp(TW,tw*.5);sun.position.set(hp.x+Math.cos(a)*14,Math.abs(s)*12+4,hp.z+6);
 orb.position.set(hp.x+Math.cos(a)*70,Math.abs(s)*50+4,hp.z-60);orb.material.color.set(s>0?0xffe9a0:0xdfe8ff);orb.scale.setScalar(s>0?7:4);
 stars.material.opacity=1-dl;stars.visible=dl<.95;stars.position.copy(hp);
 const hh=Math.floor(h),mm=Math.floor((h-hh)*60),ph=h>=19||h<5?'🌙 夜晚':h<7?'🌅 黎明':h<17?'☀️ 白天':'🌇 黃昏',tm=String(hh).padStart(2,'0')+':'+String(mm).padStart(2,'0'),tx=ph+'　香港時間 '+tm;if(tx!==lastClk){lastClk=tx;$('clock').innerHTML='<span class="ckd">'+ph+'　香港時間 </span><span class="ckt">'+tm+'</span>'}}
function portal(x,z,to){const z2=ZN[to],g=new THREE.Group(),col=z2.ff,
 r=new THREE.Mesh(new THREE.TorusGeometry(1.7,.16,8,28),new THREE.MeshBasicMaterial({color:col})),
 d=new THREE.Mesh(new THREE.CircleGeometry(1.6,24),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.35,side:2})),
 c=document.createElement('canvas');c.width=256;c.height=64;const q=c.getContext('2d');q.fillStyle='#fff';q.textAlign='center';q.font='bold 28px sans-serif';q.fillText((to>Z?'▶ ':'◀ ')+z2.n,128,30);q.font='20px sans-serif';q.fillText('Lv.'+z2.lv+'+',128,58);
 const sp2=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthTest:false}));sp2.scale.set(4,1,1);sp2.position.y=4.2;r.position.y=d.position.y=1.9;
 g.add(r,d,sp2);g.position.set(x,0,z);g.rotation.y=Math.atan2(-x,-z);zg.add(g);portals.push({x,z,to})}
function buildMT(zi){const o={};zoneRoster(zi).forEach((d,j)=>{o['m'+j]=Object.assign({},d,{mk:g=>{const b=MKF[d.kind](g,...d.a);if(d.sc)g.scale.setScalar(d.sc);return b}})});return o}
const fa=new Float32Array(240);for(let i=0;i<80;i++){fa[i*3]=R(-30,30);fa[i*3+1]=R(.5,2.5);fa[i*3+2]=R(-30,30)}
const fg=new THREE.BufferGeometry();fg.setAttribute('position',new THREE.BufferAttribute(fa,3));
const ff=new THREE.Points(fg,new THREE.PointsMaterial({color:0xffee88,size:.2}));scene.add(ff);
function enterZone(zi){zoneHint=null;Z=zi;const z=ZN[zi];scene.remove(zg);zg=new THREE.Group();scene.add(zg);trees.length=0;portals.length=0;
 mons.forEach(m=>scene.remove(m.g));mons.length=0;mq.length=0;drops.forEach(d=>scene.remove(d.o));drops.length=0;
 ff.material.color.set(z.ff);grid.visible=false;ground.geometry.dispose();ground.geometry=terrain(z);ground.rotation.x=0;ground.material.vertexColors=true;ground.material.color.set(0xffffff);ground.material.needsUpdate=true;
 const gc=new THREE.Color(z.gr),wt=new THREE.Mesh(new THREE.CircleGeometry(4.6,32),new THREE.MeshPhongMaterial({color:z.pd,transparent:true,opacity:.8,shininess:90}));wt.rotation.x=-Math.PI/2;wt.position.set(-14,-.3,-10);zg.add(wt);
 for(let i=0;i<300&&trees.length<120;i++){const x=R(-39,39),y=R(-39,39);if(Math.hypot(x,y)<8||Math.hypot(x+14,y+10)<5.5||Math.hypot(Math.abs(x)-31,y-31)<5)continue;tree(x,y,R(.8,1.5))}
 if(zi==0)for(let i=0;i<24;i++){const g=new THREE.Group(),x=R(-36,36),y=R(-36,36);mkMush(g,0xd23a3a,0);g.scale.setScalar(R(.25,.4));g.position.set(x,gH(x,y),y);zg.add(g)}
 for(let i=0;i<16;i++){const x=R(-36,36),y=R(-36,36),r=new THREE.Mesh(new THREE.DodecahedronGeometry(R(.3,.8)),M(zi?gc.clone().offsetHSL(0,0,-.18).getHex():0x7a8088));r.position.set(x,gH(x,y)+.2,y);r.rotation.set(R(0,3),R(0,3),0);r.castShadow=true;zg.add(r)}
 if(zi<ZN.length-1)portal(31,31,zi+1);if(zi>0)portal(-31,31,zi-1);
 MT=buildMT(zi);Object.keys(MT).forEach(k=>{for(let i=0;i<MT[k].c;i++)spawn(k)})}
