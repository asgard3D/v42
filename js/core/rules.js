/* 遊戲規則（純函式）：不讀全域、不碰 DOM／THREE，只吃 state 與 rng，可直接搬到伺服器執行。
   st = { lv, exp, eq:{weapon,armor,boots,ring,amulet}, buff:{atk,spd,def,hp,crit,eva}, bp:{同 buff 的強度}, skl:{技能id:等級}, cls }；rng = () => 0..1
   技能被動／增益強度由 Skills（core/skills.js）提供；沒有載入 Skills 時一律視為 0（舊測試相容） */
const Rules=(()=>{
 const eqv=(st,k)=>st.eq&&st.eq[k]?st.eq[k].v:0,rand=(rng,a,b)=>a+rng()*(b-a);
 const pas=(st,k)=>(typeof Skills!=='undefined'&&st.skl)?Skills.passive(st,k):0;
 /* 增益強度：有施放過的技能用其強度，否則用舊版預設值 */
 const bpow=(st,k,d)=>st.buff&&st.buff[k]>0?(st.bp&&st.bp[k]!=null?st.bp[k]:d):0;
 const R={
  maxHp:st=>Math.round((60+st.lv*15+eqv(st,'armor'))*(1+pas(st,'hp')/100+bpow(st,'hp',0))),
  maxMp:st=>Math.round((40+st.lv*8+(st.eq&&st.eq.armor?Math.round(st.eq.armor.v*.25):0))*(1+pas(st,'mp')/100)),
  nextExp:lv=>expNeed(lv), // 升級經驗表在 data/levels.js
  atkBonus:st=>eqv(st,'weapon'),
  spdBonus:st=>eqv(st,'boots'),
  critChance:st=>Math.min(100,5+eqv(st,'ring')+pas(st,'crit')+bpow(st,'crit',0)),
  /* 傷害倍率：增益（舊版預設 +50%）＋ 被動（%） */
  atkMult:st=>1+bpow(st,'atk',.5)+pas(st,'atk')/100,
  /* 閃避機率（%）：被動＋增益；上限 80 */
  dodgeChance:st=>Math.min(80,pas(st,'eva')+bpow(st,'eva',0)*100),
  dodge:(st,rng)=>rng()*100<R.dodgeChance(st),
  defReduce:st=>eqv(st,'amulet'),
  itemPrice:it=>(it.r+1)*(4+it.lv),
  moveSpeed:st=>5*(1+bpow(st,'spd',.5))*(1+R.spdBonus(st)/100),
  attackCooldown:(cl,st)=>cl.cd*(st.buff.spd>0?Math.max(.35,1-bpow(st,'spd',.5)*.8):1),
  basicDamage:(st,cl,rng)=>Math.round((rand(rng,cl.d[0],cl.d[1])+st.lv+R.atkBonus(st))*R.atkMult(st)),
  skillDamage:(st,cl,sk,rng)=>Math.round((rand(rng,cl.d[0],cl.d[1])*sk.m+st.lv+R.atkBonus(st))*R.atkMult(st)),
  healAmount:(st,pct)=>Math.round(R.maxHp(st)*pct),
  /* 暴擊判定：回傳 {dmg,crit} */
  rollHit:(st,d,rng)=>{const crit=rng()*100<R.critChance(st);return{dmg:crit?Math.round(d*1.8):d,crit}},
  /* 怪物打玩家 */
  monsterDamage:(st,T,lvl,mul,rng)=>Math.round(rand(rng,.8,1.2)*T.dm*mul*(1+(lvl-T.lv)*.2)*(1-bpow(st,'def',.65))*(1-R.defReduce(st)/100)),
  killExp:(T,lvl,isSummon)=>Math.max(1,Math.round(T.exp*(isSummon?.3:1))), // T.exp 已由 mobExp(怪物等級) 依經驗表換算
  /* 加經驗並處理升級（直接修改 st），回傳升了幾級 */
  gainExp:(st,amount)=>{st.exp+=amount;let n=0;while(st.lv<99&&st.exp>=R.nextExp(st.lv)){st.exp-=R.nextExp(st.lv);st.lv++;n++}return n}
 };
 return R})();
