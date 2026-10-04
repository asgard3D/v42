/* 創角畫面視角偏移、離線確認鍵 */
(function(){
 const ok=document.getElementById('offOk');if(ok)ok.onclick=()=>document.getElementById('offm').classList.remove('o');
 const cr=document.getElementById('cr');
 function applyView(){
  try{
   const W=innerWidth,H=innerHeight;
   if(!document.body.classList.contains('create')||!cr){cam.clearViewOffset();cam.updateProjectionMatrix();return}
   const r=cr.getBoundingClientRect();let x=0,y=0;
   if(r.width>W*.8)y=r.height/2;       // 底部面板：角色上移到剩餘空間中央
   else x=-(r.right/2);                 // 側欄：角色右移到剩餘空間中央
   cam.setViewOffset(W,H,x,y,W,H);
  }catch(_){}
 }
 const run=()=>requestAnimationFrame(applyView);
 new MutationObserver(run).observe(document.body,{attributes:true,attributeFilter:['class']});
 addEventListener('resize',run);addEventListener('orientationchange',()=>setTimeout(run,250));
 run();setTimeout(run,300);
})();
