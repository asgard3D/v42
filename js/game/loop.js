/* 主迴圈 */
function loop(){requestAnimationFrame(loop);const dt=Math.min(clk.getDelta(),.05);T+=dt;
 const cr=S.mode=='create',cl=CL[S.cls],hp=hero.position;let mv=false;
 if(cr)hero.rotation.y+=dt*.9;
 else{S.cd-=dt;S.mp=Math.min(maxMp(),S.mp+maxMp()*.02*dt);for(const k in S.skcd)S.skcd[k]=Math.max(0,S.skcd[k]-dt);Skills.tickBuffs(S,dt);if(S.hp>maxHp())S.hp=maxHp();
  if(S.auto)autoAct();dropTick(dt);
  const kx=(K.ArrowRight?1:0)-(K.ArrowLeft?1:0),kz=(K.ArrowDown?1:0)-(K.ArrowUp?1:0);
  if(kx||kz){const fx=-Math.sin(cmY),fz=-Math.cos(cmY),mx=-fx*kz-fz*kx,mz=-fz*kz+fx*kx,l=Math.hypot(mx,mz);S.dest=new THREE.Vector3(hp.x+mx/l*3,0,hp.z+mz/l*3);S.tm=null}
  const pt=portals.find(q=>Math.hypot(hp.x-q.x,hp.z-q.z)<2.25);
  if(pt){
    if(S.lv>=ZN[pt.to].lv){
      const fw=pt.to>Z;
      const targetZone=pt.to;
      enterZone(targetZone);
      // 出生位置放在新地圖內側，避免立刻再次碰到傳送門
      hp.set(fw?-27:27,0,0);
      S.dest=null;S.tm=null;mk2.visible=false;
      say('已傳送至 '+ZN[targetZone].n);
    }else if(T-pw>2.5){pw=T;say('需要 Lv.'+ZN[pt.to].lv+' 才能進入 '+ZN[pt.to].n)}
  }
  let tgt=null;if(S.tm&&!S.tm.dead)tgt=S.tm.g.position;else if(S.dest)tgt=S.dest;
  if(tgt){const dx=tgt.x-hp.x,dz=tgt.z-hp.z,d=Math.hypot(dx,dz),live=S.tm&&!S.tm.dead,stop=live?cl.range:.15;face(hero,dx,dz,dt);
   if(d>stop){const s=Rules.moveSpeed(S)*dt;hp.x+=dx/d*s;hp.z+=dz/d*s;mv=true}
   else if(live){S.fT=.9;if(S.cd<=0){S.cd=Rules.attackCooldown(cl,S);S.atk=.0001;S.fT=.9;S.pd=!S.pd;const dm=Rules.basicDamage(S,cl,Math.random);
     {const t0=S.tm,ad=AT[S.cls]||AT.warrior;setTimeout(()=>{if(t0&&!t0.dead&&mons.includes(t0)){if(cl.ranged)shoot(t0);hit(t0,dm)}},Math.round(ad.c/ad.r*1000))}if(cl.heal)S.hp=Math.min(maxHp(),S.hp+cl.heal)}}
   else{S.dest=null;mk2.visible=false}}
  // 玩家移動不再與場景物件碰撞，可穿過樹木與裝飾物，避免追怪/打怪時卡住。
  // 只保留地圖邊界限制。
  hp.x=Math.max(-38,Math.min(38,hp.x));hp.z=Math.max(-38,Math.min(38,hp.z))}
 const w=mv?Math.sin(T*11)*.7:0;animHero(dt,mv,w);BuffFx.update(dt,T);
 hp.y=gH(hp.x,hp.z)+(mv?Math.abs(Math.sin(T*11))*.08:Math.sin(T*2)*.02)-(hero.dr||0)*.85;hero.head.rotation.z=Math.sin(T*2)*.03;
 if(hero.aura)hero.aura.rotation.z+=dt*2;hero.tails.forEach((t,i)=>t.rotation.x=.1+(mv?.3+Math.abs(w)*.5+Math.sin(T*9+i)*.08:Math.sin(T*2+i)*.03));
 mons.slice().forEach(m=>monTick(m,dt,hp,cr));tickQ(dt);
 proj.forEach((o,i)=>{const t=o.m.g.position.clone();t.y=.6;o.p.position.lerp(t,Math.min(1,dt*10));if(o.tr)trail(o.p.position,o.tr);if(o.p.position.distanceTo(t)<.3){if(o.bc)burst(t,o.bc,14,4,4);scene.remove(o.p);proj.splice(i,1)}});
 for(let vi=vfx.length-1;vi>=0;vi--){const vv=vfx[vi];vv.t+=dt;const vk=Math.min(1,vv.t/vv.life);vv.up(vv.o,vk,dt);if(vk>=1){scene.remove(vv.o);vv.o.traverse(x=>{if(x.geometry)x.geometry.dispose();if(x.material)x.material.dispose()});vfx.splice(vi,1)}}
 fx.forEach((o,i)=>{o.t+=dt*2.2;const s=1+o.t*o.max;o.r.scale.set(s,s,1);o.r.material.opacity=Math.max(0,1-o.t);if(o.t>=1){scene.remove(o.r);fx.splice(i,1)}});
 ff.position.y=Math.sin(T)*.3;ff.rotation.y=T*.02;
 const tg=!cr&&S.tm&&!S.tm.dead;$('tgt').style.display=tg?'block':'none';if(tg){const pc=Math.max(0,S.tm.hp/S.tm.max*100);$('tn').innerHTML='<span class="tnn">'+S.tm.T.n+'</span> <small style="opacity:.7">'+(RACE[S.tm.T.race]||'')+'</small><span class="tnl"> Lv.'+S.tm.lvl+'</span>';$('tb').style.width=pc+'%';
  $('tgt').style.setProperty('--hp',pc.toFixed(1));$('tgL').textContent=S.tm.lvl;$('tgI').textContent=RACE_IC[S.tm.T.race]||'👾';$('tgt').classList.toggle('boss',!!S.tm.T.boss)}
 const off=cr?new THREE.Vector3(0,1.9,4.6):new THREE.Vector3(Math.sin(cmY)*Math.cos(cmP),Math.sin(cmP),Math.cos(cmY)*Math.cos(cmP)).multiplyScalar(cmD);cam.position.lerp(hp.clone().add(off),1-Math.exp(-9*dt));if(shk>0){cam.position.x+=R(-1,1)*shk*.4;cam.position.y+=R(-1,1)*shk*.25;shk=Math.max(0,shk-dt*1.6)}cam.lookAt(hp.x,hp.y+(cr?1:.8),hp.z);
 dn(hp);sun.target.position.copy(hp);if((uT-=dt)<=0){uT=.12;ui();drawMiniMap()}if(!cr&&(sT-=dt)<=0){sT=5;offlineHeartbeat()}ren.render(scene,cam)}
