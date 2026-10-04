/* 主角戰鬥姿勢／動畫 */
// ---------- loop ----------
const clk=new THREE.Clock(),camOff=new THREE.Vector3(9,11,9);let T=0,uT=0,sT=5;
// ---------- 戰鬥姿勢／攻擊動作 ----------
const LT=.30,LS=.49,ss=x=>x*x*(3-2*x),lp=(a,b,t)=>a+(b-a)*t;
// r=揮擊速度 c=命中時間點 tf/kf=前腳大腿/膝 tb=後腳大腿；k=關鍵幀[p,武器臂上臂,前臂,副手上臂,前臂,軀幹扭轉,前傾,手腕]（p=0與p=1為備戰姿勢）
const AT={
 warrior:{r:2.6,c:.46,tf:-.7,kf:.7,tb:.52,k:[[0,-.9,-.9,-.3,-1.3,.3,.1,0],[.22,-2.7,-.5,-.1,-1.6,.75,-.12,0],[.46,-1.1,-.1,.5,-.6,-.6,.32,0],[.62,-1,-.15,.4,-.7,-.5,.28,0]]},
 rogue:{r:3.4,c:.42,tf:-.85,kf:1,tb:.6,k:[[0,-.7,-1.5,-.9,-1.3,.45,.3,0],[.2,-.4,-1.95,-.6,-1.6,.8,.25,0],[.42,-1.55,-.05,-.4,-1.9,-.25,.42,0],[.58,-1.5,-.1,-.5,-1.8,-.2,.4,0]]},
 monk:{r:3.8,c:.4,tf:-.75,kf:.75,tb:.55,k:[[0,-.55,-1.5,-.55,-1.5,.2,.05,0],[.18,.1,-1.8,-.4,-1.8,.5,.05,0],[.4,-1.5,-.05,-.2,-2,-.55,.15,0],[.6,-1.4,-.15,-.3,-1.9,-.4,.12,0]]},
 priest:{r:2.4,c:.5,tf:-.65,kf:.65,tb:.5,k:[[0,-.5,-1,-.6,-1,.25,.08,0],[.24,-1.7,-.3,-1.2,-.6,.7,-.1,0],[.5,-.7,-.15,-.5,-.5,-.6,.3,.9],[.66,-.6,-.2,-.5,-.6,-.45,.25,.8]]},
 mage:{r:2.3,c:.5,tf:-.5,kf:.5,tb:.4,k:[[0,-.6,-1,-.2,-.5,.15,.04,0],[.26,-1.9,-.35,-.9,-.5,.5,-.08,-.1],[.5,-1,-.1,-1.3,-.4,-.4,.2,1.2],[.66,-.9,-.2,-1.2,-.5,-.3,.18,1.1]]}};
for(const n in AT){const a=AT[n],[LT,LS]=(HeroModel.legs&&HeroModel.legs[n])||[.30,.49]; // 專用模型（如聖職者）用自己的腿長，其餘沿用基底模型
 const hf=LT*Math.cos(a.tf)+LS*Math.cos(a.tf+a.kf);a.tb=Math.min(a.tb,Math.acos(Math.min(1,hf/(LT+LS))));
 const c=Math.max(-1,Math.min(1,(hf-LT*Math.cos(a.tb))/LS));a.kb=Math.max(0,Math.acos(c)-a.tb);a.drop=Math.max(0,LT+LS-hf);a.k.push([1].concat(a.k[0].slice(1)))}
function sk(k,p){let i=0;while(i<k.length-2&&p>k[i+1][0])i++;const a=k[i],b=k[i+1],t=ss(Math.min(1,Math.max(0,(p-a[0])/(b[0]-a[0]))));return a.map((v,j)=>j?lp(v,b[j],t):0)}
function animHero(dt,mv,w){const H=hero,A=AT[S.cls]||AT.warrior,HZ=H.rest,cr=S.mode=='create';
 S.fT=Math.max(0,(S.fT||0)-dt);let p=0;if(S.atk>0){S.atk+=dt*A.r;p=Math.min(S.atk,1);if(S.atk>=1)S.atk=0}
 const want=!cr&&!mv&&(S.fT>0||p>0)?1:0;H.sb=(H.sb||0)+(want-(H.sb||0))*Math.min(1,dt*(want?16:5));const sb=H.sb;
 // 待機／戰鬥姿態：平常雙臂自然下垂、武器放低；有目標、戰鬥中或剛戰鬥完 3 秒內才切換為備戰姿勢
 S.rdT=((S.tm&&!S.tm.dead)||S.fT>0||p>0)?3:Math.max(0,(S.rdT||0)-dt);
 H.rd=(H.rd||0)+((S.rdT>0?1:0)-(H.rd||0))*Math.min(1,dt*(S.rdT>0?10:3));
 const RX=[{ru:.04,rf:-.08},{ru:-.05,rf:-.2}],Z=[0,1].map(i=>({ru:lp(RX[i].ru,HZ[i].ru,H.rd),rf:lp(RX[i].rf,HZ[i].rf,H.rd),sw:HZ[i].sw}));
 const kf=p>0?sk(A.k,p):A.k[0],sg=S.cls=='monk'&&!S.pd?-1:1,br=p>0?0:Math.sin(T*3)*.02;
 const n0=w,n1=-w,t0=lp(n0,A.tf,sb),t1=lp(n1,A.tb,sb);
 H.legs[0].rotation.x=t0;H.legs[1].rotation.x=t1;H.legs[0].shin.rotation.x=lp(Math.max(0,n0)*.9,A.kf,sb);H.legs[1].shin.rotation.x=lp(Math.max(0,n1)*.9,A.kb,sb);
 if(H.cape){const bk=Math.max(t0,t1);H.cape.rotation.x+=((.25+bk*.5+Math.sin(T*2)*.02)-H.cape.rotation.x)*Math.min(1,dt*10)}
 if(H.skF){const fw=Math.min(.6,Math.max(0,-t0,-t1)),tg=-(fw*1.05+(mv?.05:0))+Math.sin(T*2)*.01;H.skF.rotation.x+=(tg-H.skF.rotation.x)*Math.min(1,dt*16)}
 const pa=sg>0?1:0,ga=1-pa,nu=[Z[0].ru-(Z[0].sw?0:w*.8),Z[1].ru+(mv?w*.12:0)],nf=[Z[0].rf,Z[1].rf],su=[0,0],sf=[0,0];
 su[pa]=kf[1]+br;sf[pa]=kf[2];su[ga]=kf[3]+br;sf[ga]=kf[4];
 for(let i=0;i<2;i++){H.arms[i].rotation.x=lp(nu[i],su[i],sb);H.fore[i].rotation.x=lp(nf[i],sf[i],sb)}
 const u=H.up;if(u){u.rotation.x=sb*kf[6];u.rotation.y=sb*kf[5]*sg;H.head.rotation.y=-u.rotation.y*.6}
 if(H.wp){const stf=CL[S.cls].w=='staff';/* 法杖：放下手臂時保持杖身接近直立，不隨前臂指向前方 */H.wp.rotation.x=H.wp0+sb*kf[7]+(stf?(HZ[1].ru+HZ[1].rf)-(Z[1].ru+Z[1].rf)+.1*(1-H.rd):0)}H.dr=sb*A.drop;
 if(H.rig)HeroModel.sync(H); // 代理角度 → 骨架（需在 swingFx 取武器世界座標之前）
 swingFx(H,p,A,sg)}
const _fa=new THREE.Vector3(),_fb=new THREE.Vector3();
function swingFx(H,p,A,sg){
 if(S.mode=='create'||p<=.12||p>.78){H._pa=null;return}
 const col=S.cls=='warrior'?0xcfe6ff:CL[S.cls].g;H.updateMatrixWorld(true);
 if(H.bladeO){H.bladeO.getWorldPosition(_fa);H.fxF[1].getWorldPosition(_fb);_fb.lerp(_fa,.3);
  if(H._pa){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array([H._pa.x,H._pa.y,H._pa.z,H._pb.x,H._pb.y,H._pb.z,_fa.x,_fa.y,_fa.z,_fb.x,_fb.y,_fb.z]),3));g.setIndex([0,1,2,2,1,3]);
   const m=new THREE.Mesh(g,bm(col,.6));m.frustumCulled=false;vf(m,.25,(o,k)=>fade(o,.6*(1-k)))}
  H._pa=(H._pa||new THREE.Vector3()).copy(_fa);H._pb=(H._pb||new THREE.Vector3()).copy(_fb)}
 else if(H.tipO){H.tipO.getWorldPosition(_fa);trail(_fa,col);if(Math.abs(p-A.c)<.03&&!H._gl){H._gl=1;burst(_fa.clone(),col,10,2.5,2.5,.07)}if(p>A.c+.1)H._gl=0}
 else if(H.fxF){const pa=sg>0?1:0;H.fxF[pa].getWorldPosition(_fa);trail(_fa,col)}}
function face(o,dx,dz,dt,s){let a=Math.atan2(dx,dz)-o.rotation.y;a=Math.atan2(Math.sin(a),Math.cos(a));o.rotation.y+=a*Math.min(1,dt*(s||12))}
