/* 主角骨架模型（取代舊版方塊人身體）
 * 資料：js/data/hero-model.js（HERO_MODEL，18 根骨頭＋約 4 萬頂點＋貼圖圖集，由 tools/ 內腳本產生）
 * 作法：舊的 hero.legs / arms / fore / up / head 仍是「動作代理」——hero-anim.js 照舊只改它們的 rotation；
 *       這裡的 sync() 每幀把代理的角度換算成骨頭旋轉，並把武器掛點釘在實際的手上。
 *       因此 5 職業的攻擊／待機／走路動作、武器、特效、增益光環都不用重寫。
 * 沒有 HERO_MODEL 資料時 ready=false，makeHero 會原樣使用舊的方塊人。 */
const HeroModel=(()=>{
 /* 模型表：window.HERO_MODEL＝預設（5 職業共用的基底模型）；window.HERO_MODELS[職業]＝該職業專用模型（目前：priest 聖職者、rogue 盜賊、mage 法師）。
  * 專用模型優先，沒有就退回預設；兩者都沒有則 ready=false，makeHero 原樣使用舊方塊人。 */
 const DEF=window.HERO_MODEL,SPEC=window.HERO_MODELS||{};
 if(!DEF&&!Object.keys(SPEC).length)return {ready:false,dress:g=>g,sync(){},legs:{}};
 const V3=THREE.Vector3,Q=THREE.Quaternion,NBN=18;
 const IX={Hips:0,Spine:1,Spine1:2,Spine2:3,Neck:4,Head:5,LArm:6,LFore:7,LHand:8,RArm:9,RFore:10,RHand:11,LUp:12,LLeg:13,LFoot:14,RUp:15,RLeg:16,RFoot:17};
 /* ---------- 色調（加深）：只作用在有設定的職業，其餘職業維持原貌 ----------
  * sat 飽和度倍率；gamma >1 壓暗中間調（黑與純白幾乎不變）；gain 總亮度；emis 自發光（越低暗部越深） */
 const TONE={
  // 角色材質改為「深底＋高飽和主色＋少量亮邊」。
  // 目的不是單純壓黑，而是讓暗部有輪廓、主色不泛白、金屬／眼睛仍保留焦點。
  priest:{sat:1.45,gamma:1.14,gain:.90,emis:0x0a0b10},
  rogue:{sat:1.55,gamma:1.26,gain:.92,emis:0x06050a},
  warrior:{sat:1.60,gamma:1.12,gain:.94,emis:0x080609},
  mage:{sat:1.72,gamma:1.10,gain:.94,emis:0x06120a}
 };
 const toneLUT=T=>{const L=new Uint8Array(256);for(let i=0;i<256;i++)L[i]=Math.max(0,Math.min(255,Math.round(Math.pow(i/255,T.gamma)*T.gain*255)));return L};
 function toneBuf(arr,T){ // arr: RGB 或 RGBA 的 8 位元陣列，原地處理
  const L=toneLUT(T),st=arr.length%4===0&&arr.__rgba?4:3;
  for(let i=0;i<arr.length;i+=st){const r=arr[i],g=arr[i+1],b=arr[i+2],y=.299*r+.587*g+.114*b;
   arr[i]=L[Math.max(0,Math.min(255,Math.round(y+(r-y)*T.sat)))];arr[i+1]=L[Math.max(0,Math.min(255,Math.round(y+(g-y)*T.sat)))];arr[i+2]=L[Math.max(0,Math.min(255,Math.round(y+(b-y)*T.sat)))]}
 }
 /* ---------- 解碼（幾何每份資料解一次，材質每個職業各一份） ---------- */
 const geoCache=new Map(),colCache=new Map();
 function decodeGeo(D){
  if(geoCache.has(D))return geoCache.get(D);
  const bin=Uint8Array.from(atob(D.buf),c=>c.charCodeAt(0)).buffer,o=D.off,nv=D.nv,nt=D.nt;
  const q16=new Uint16Array(bin,o.pos,nv*3),pos=new Float32Array(nv*3);
  for(let i=0;i<nv;i++)for(let a=0;a<3;a++)pos[i*3+a]=D.min[a]+q16[i*3+a]/65535*(D.max[a]-D.min[a]);
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  geo.setAttribute('normal',new THREE.BufferAttribute(new Int8Array(bin,o.nrm,nv*3),3,true));
  geo.setAttribute('skinIndex',new THREE.BufferAttribute(new Uint8Array(bin,o.jnt,nv*4),4));
  geo.setAttribute('skinWeight',new THREE.BufferAttribute(new Uint8Array(bin,o.wgt,nv*4),4,true));
  geo.setIndex(new THREE.BufferAttribute(new Uint16Array(bin,o.idx,nt*3),1));
  if(o.col!=null)colCache.set(geo,new Uint8Array(bin.slice(o.col,o.col+nv*3))); // 原始頂點色（各職業再各自調色）
  else geo.setAttribute('uv',new THREE.BufferAttribute(new Uint16Array(bin,o.uv,nv*2),2,true));
  geo.computeBoundingSphere();geoCache.set(D,geo);return geo;
 }
 function decode(D,k){
  const HD=window.HeroDetail&&HeroDetail.has(k)?HeroDetail:null; // 五職統一走 HeroDetail；法師也必須保留同一套材質／紋理處理
  const T=(HD||k==='mage')?null:TONE[k],base=decodeGeo(D);let geo=base,mat;
  if(D.off.col!=null){ // 頂點色模型（聖職者）
   if(T){geo=base.clone();const c=new Uint8Array(colCache.get(base));toneBuf(c,T);geo.setAttribute('color',new THREE.BufferAttribute(c,3,true))}
   else geo.setAttribute('color',new THREE.BufferAttribute(colCache.get(base),3,true));
   mat=new THREE.MeshLambertMaterial({vertexColors:true,side:THREE.DoubleSide,emissive:HD?HD.emis(k):T?T.emis:0x2a2a30,emissiveIntensity:HD?((k==='mage'||k==='monk')?0.10:0.18):(k==='mage'?0.18:0.18),skinning:true});
  }else{ // 貼圖模型（基底模型）
   const img=new Image(),tex=new THREE.Texture(img);
   tex.generateMipmaps=false;tex.minFilter=THREE.LinearFilter;tex.magFilter=THREE.LinearFilter;
   img.onload=()=>{
    if(T){const cv=document.createElement('canvas');cv.width=img.width;cv.height=img.height;const cx=cv.getContext('2d');cx.drawImage(img,0,0);
     const id=cx.getImageData(0,0,cv.width,cv.height);id.data.__rgba=true;toneBuf(id.data,T);cx.putImageData(id,0,0);tex.image=cv}
    tex.needsUpdate=true};
   img.src=D.tex;
   mat=new THREE.MeshLambertMaterial({map:tex,side:THREE.DoubleSide,emissive:HD?HD.emis(k):T?T.emis:0x1c1c22,emissiveIntensity:HD?((k==='mage'||k==='monk')?0.10:0.18):0.18,skinning:true});
  }
  if(HD)HD.apply(mat,k); // 重新染色＋程式生成的細節紋理（織紋／拉絲／髮絲），見 render/hero-detail.js
  /* 骨架（所有骨頭靜止旋轉＝單位，方便用世界軸直接驅動） */
  const rest=D.bones.map(b=>new V3(b.t[0],b.t[1],b.t[2])),par=D.bones.map(b=>b.p);
  const off=rest.map((r,i)=>par[i]<0?r.clone():r.clone().sub(rest[par[i]]));
  // 腿長（髖→膝、膝→地面），給 hero-anim 算蹲低量與步幅
  const leg=[rest[IX.LUp].y-rest[IX.LLeg].y,rest[IX.LLeg].y];
  return {D,geo,mat,rest,par,off,leg,ADD:D.adj!=null?D.adj:.30,names:D.bones.map(b=>b.n)};
 }
 const cache={},modelFor=k=>{const D=SPEC[k]||DEF;if(!D)return null;const key=(SPEC[k]?k:'*')+((TONE[k]||(window.HeroDetail&&HeroDetail.has(k)))?':'+k:'');return cache[key]||(cache[key]=decode(D,k))};
 const legs={};Object.keys(SPEC).forEach(k=>{legs[k]=modelFor(k).leg});
 function makeRig(M){
  const bones=M.names.map(n=>{const x=new THREE.Bone();x.name=n;return x});
  bones.forEach((b,i)=>{b.position.copy(M.off[i]);if(M.par[i]>=0)bones[M.par[i]].add(b)});
  const inv=M.rest.map(r=>new THREE.Matrix4().makeTranslation(-r.x,-r.y,-r.z));
  const sk=new THREE.Skeleton(bones,inv),mesh=new THREE.SkinnedMesh(M.geo,M.mat);
  mesh.add(bones[0]);mesh.bind(sk,new THREE.Matrix4());mesh.frustumCulled=false;mesh.castShadow=true;mesh.name='heroSkin';
  return {mesh,bones,M,D:bones.map(()=>new Q()),P:bones.map(()=>new V3())};
 }
 /* ---------- 換裝：把舊方塊人的身體零件拿掉，只留武器／光環／翅膀／光環環，再掛上骨架模型 ---------- */
 function dress(g,k){
  const M=modelFor(k);if(!M)return g;
  const keep=g.userData.keep||new Set(),inKeep=o=>{for(let p=o;p&&p!==g;p=p.parent)if(keep.has(p))return true;return false},rm=[];
  g.traverse(o=>{if(o.isMesh&&!inKeep(o))rm.push(o)});rm.forEach(o=>o.parent&&o.parent.remove(o));
  const rig=makeRig(M);g.add(rig.mesh);g.rig=rig;
  // 武器掛點：位置＝實際手骨，朝向＝舊代理前臂（所以武器仍照原本的揮砍角度動）
  g.mount=[0,1].map(i=>{const m=new THREE.Group(),n=new THREE.Group();n.position.y=.27;m.add(n);m.inner=n;g.add(m);
   const f=g.fore[i];f.children.slice().forEach(c=>{if(keep.has(c)||g.fxF.includes(c))n.add(c)});return m});
  g.userData.keep=null;return g;
 }
 /* ---------- 每幀：代理角度 → 骨頭 ---------- */
 const I=new Q(),tq=new Q(),qa=new Q(),qb=new Q(),tv=new V3(),AX=new V3(1,0,0),AZc={};
 const azOf=add=>AZc[add]||(AZc[add]=[new Q().setFromAxisAngle(new V3(0,0,1),add),new Q().setFromAxisAngle(new V3(0,0,1),-add)]);
 function sync(H){
  const r=H.rig;if(!r||!H.up)return;const M=r.M,rest=M.rest,off=M.off,par=M.par,d=r.D,up=H.up.quaternion,AZ=azOf(M.ADD);
  d[0].copy(I);d[1].copy(I).slerp(up,.34);d[2].copy(I).slerp(up,.67);d[3].copy(up);
  tq.copy(up).multiply(H.head.quaternion);d[5].copy(tq);d[4].copy(up).slerp(tq,.5);
  // 手臂：arms[0]＝角色右手(x<0)、arms[1]＝左手(x>0)；上臂＝軀幹×肩擺×內收，前臂再疊肘彎
  [[0,9],[1,6]].forEach(([i,b])=>{qa.copy(up).multiply(H.arms[i].quaternion);d[b].copy(qa).multiply(AZ[i===0?0:1]);
   d[b+1].copy(qa).multiply(H.fore[i].quaternion).multiply(AZ[i===0?0:1]);d[b+2].copy(d[b+1])});
  // 腿：大腿＝代理腿，小腿再疊膝彎，腳掌只跟隨一半角度（避免腳底翹起）
  [[0,15],[1,12]].forEach(([i,b])=>{const L=H.legs[i],a=L.rotation.x+L.shin.rotation.x;d[b].copy(L.quaternion);
   d[b+1].copy(L.quaternion).multiply(L.shin.quaternion);d[b+2].setFromAxisAngle(AX,Math.max(-.5,Math.min(.5,a*.5)))});
  // 世界旋轉 → 區域旋轉，並以正向運動學求手的位置
  r.P[0].copy(rest[0]);
  for(let i=1;i<NBN;i++){const p=par[i];r.bones[i].quaternion.copy(d[p]).conjugate().multiply(d[i]);r.P[i].copy(off[i]).applyQuaternion(d[p]).add(r.P[p])}
  [[0,IX.RHand],[1,IX.LHand]].forEach(([i,b])=>{const m=H.mount[i];m.position.copy(r.P[b]);m.quaternion.copy(up).multiply(H.arms[i].quaternion).multiply(H.fore[i].quaternion)});
 }
 // 創角畫面：模型的髮型／髮色已烘進貼圖／頂點色，隱藏這兩列選項
 ['ch','cs'].forEach(id=>{const e=document.getElementById(id);if(e){e.style.display='none';if(e.previousElementSibling)e.previousElementSibling.style.display='none'}});
 return {ready:true,dress,sync,legs,modelFor};
})();
