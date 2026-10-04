/* 增益（Buff）顯示：技能圖示＋剩餘秒數＋倒數條，最後 4 秒閃爍。
   位置由 CSS 依裝置決定：電腦／平板在技能列正上方；手機直向在時間框正下方；手機橫向在技能列上方。 */
let bfSig='';
function buffUI(){const el=$('buffs');if(!el)return;
 const list=S.mode==='play'?Skills.activeBuffs(S):[],sig=list.map(b=>b.id+':'+b.lv).join();
 if(sig!==bfSig){bfSig=sig;
  el.innerHTML=list.map(b=>'<div class="bf" data-id="'+b.id+'" title="'+b.sk.n+' Lv.'+b.lv+'：'+Skills.describe(b.sk,b.lv)+'"><i>'+b.sk.ic+'</i><span class="bt"></span><s></s></div>').join('')}
 [...el.children].forEach((n,i)=>{const b=list[i];if(!b)return;
  const t=Math.ceil(b.t),txt=t>=60?Math.ceil(t/60)+'m':t+'s';
  const bt=n.firstChild.nextSibling;if(bt.textContent!==txt)bt.textContent=txt;
  n.lastChild.style.width=Math.max(0,Math.min(100,b.t/b.d*100))+'%';n.classList.toggle('low',b.t<=4)})}
