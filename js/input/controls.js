/* 滑鼠／觸控／鍵盤輸入 */
// ---------- input ----------
const ray=new THREE.Raycaster(),mk2=new THREE.Mesh(new THREE.RingGeometry(.25,.35,20),new THREE.MeshBasicMaterial({color:0xffe9a0,transparent:true,side:THREE.DoubleSide}));
mk2.rotation.x=-Math.PI/2;mk2.visible=false;scene.add(mk2);
const pick=e=>{if(S.mode!='play')return;
 ray.setFromCamera(new THREE.Vector2(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1),cam);
 const hd=ray.intersectObjects(drops.map(d=>d.o),true)[0];
 if(hd){let o=hd.object,d=null;while(o&&!d){d=drops.find(x=>x.o===o);o=o.parent}if(!d)d=drops.find(x=>x.o===hd.object);if(d){startDropFly(d);return}}
 const hm=ray.intersectObjects(mons.filter(m=>!m.dead).map(m=>m.g),true)[0];
 if(hm){let o=hm.object;while(o&&!o.userData.m)o=o.parent;S.tm=o.userData.m;S.dest=null;return}
 // 傳送門：優先判定，避免被地面點擊邏輯吃掉
 const pm=ray.intersectObjects(portals.map(q=>q.o).filter(Boolean),true)[0];
 if(pm){let o=pm.object,pt=null;while(o&&!pt){pt=portals.find(q=>q.o===o);o=o.parent}
   if(!pt){pt=portals.find(q=>q.o===pm.object||q.o?.children?.includes(pm.object))}
   if(pt){
     if(S.lv<ZN[pt.to].lv){say('需要 Lv.'+ZN[pt.to].lv+' 才能進入 '+ZN[pt.to].n);return}
     // 點擊傳送門後，先走到門口；靠近後由 loop 統一執行傳送
     S.tm=null;S.dest=new THREE.Vector3(pt.x,0,pt.z);
     mk2.position.set(pt.x,.05,pt.z);mk2.visible=true;
     say('前往 '+ZN[pt.to].n);return;
   }
 }
 const hg=ray.intersectObject(ground)[0];if(hg){S.dest=hg.point.clone();S.dest.y=0;S.tm=null;mk2.position.set(hg.point.x,.05,hg.point.z);mk2.visible=true}};
const P=new Map(),cv=ren.domElement,K={},clp=(v,a,b)=>Math.max(a,Math.min(b,v));let cmY=.785,cmP=.75,cmD=16,mv0=0,mul=0;
cv.addEventListener('pointerdown',e=>{P.set(e.pointerId,{x:e.clientX,y:e.clientY});if(P.size==1){mv0=0;mul=0}else mul=1;try{cv.setPointerCapture(e.pointerId)}catch(_){}});
cv.addEventListener('pointermove',e=>{const o=P.get(e.pointerId);if(!o)return;const dx=e.clientX-o.x,dy=e.clientY-o.y;let d0=0;
 if(P.size==2){const[a,b]=[...P.values()];d0=Math.hypot(a.x-b.x,a.y-b.y)}
 o.x=e.clientX;o.y=e.clientY;
 if(P.size==2){const[a,b]=[...P.values()];cmD=clp(cmD-(Math.hypot(a.x-b.x,a.y-b.y)-d0)*.04,6,30)}
 else if(S.mode=='play'){mv0+=Math.abs(dx)+Math.abs(dy);if(mv0>8){cmY-=dx*.007;cmP=clp(cmP+dy*.006,.2,1.45)}}});
const pup=e=>{if(!P.has(e.pointerId))return;P.delete(e.pointerId);if(!mul&&mv0<=8&&e.type=='pointerup')pick(e);if(!P.size)mul=0};
cv.addEventListener('pointerup',pup);cv.addEventListener('pointercancel',pup);cv.addEventListener('contextmenu',e=>e.preventDefault());
cv.addEventListener('wheel',e=>{cmD=clp(cmD+e.deltaY*.015,6,30);e.preventDefault()},{passive:false});
addEventListener('keydown',e=>{if(document.activeElement.tagName=='INPUT')return;K[e.code]=1;if(e.code=='KeyB'&&S.mode=='play'){$('bag').classList.toggle('o');bagUI()}if(e.code=='KeyR')usePot();if(e.code.startsWith('Arrow'))e.preventDefault()});
addEventListener('keyup',e=>K[e.code]=0);
