/* 戰鬥：傷害、浮動文字、投射物 */
function fl(pos,t,col){const v=pos.clone();v.y+=1.6;v.project(cam);const d=document.createElement('div');d.className='fl';d.textContent=t;d.style.color=col||'#fff';
 d.style.left=((v.x+1)/2*innerWidth-10)+'px';d.style.top=((1-v.y)/2*innerHeight)+'px';document.body.appendChild(d);setTimeout(()=>d.remove(),950)}
function hit(m,d){if(m.dead)return;
 const r=Rules.rollHit(S,d,Math.random);d=r.dmg;m.hp-=d;m.sq=.15;alertGroup(m);
 Events.emit('damage',{m,dmg:d,crit:r.crit});
 if(m.hp<=0){m.dead=true;const x=Rules.killExp(m.T,m.lvl,m.sum),lv0=S.lv,up=Rules.gainExp(S,x)>0;
  if(S.tm===m)S.tm=null;Events.emit('kill',{m,exp:x});if(!m.sum)dropLoot(m);if(m.T.boss)killSummons();
  const zi=Z;setTimeout(()=>{if(Z!=zi)return;scene.remove(m.g);mons.splice(mons.indexOf(m),1);setTimeout(()=>{if(Z==zi&&!m.sum)spawn(m.ty)},m.T.boss?25000:4000)},900);
  if(up){S.hp=maxHp();rebuild();Events.emit('levelup',{lv:S.lv,from:lv0})}}}
const fx=[],proj=[];
function ring(pos,col,max){const r=new THREE.Mesh(new THREE.RingGeometry(.9,1,40),new THREE.MeshBasicMaterial({color:col,transparent:true,side:THREE.DoubleSide}));
 r.rotation.x=-Math.PI/2;r.position.copy(pos);r.position.y=.05;scene.add(r);fx.push({r,t:0,max})}
function shoot(m,col,sz,tr,bc){const p=new THREE.Mesh(new THREE.SphereGeometry(sz||.18,10,8),new THREE.MeshBasicMaterial({color:col||CL[S.cls].g}));p.position.copy(hero.position);p.position.y=1.2;if(hero.tipO){hero.updateMatrixWorld(true);hero.tipO.getWorldPosition(p.position)}scene.add(p);proj.push({p,m,tr,bc})}
