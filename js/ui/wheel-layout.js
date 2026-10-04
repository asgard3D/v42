/* 手機半圓輪版面計算（純函式，不碰 DOM，可在 Node 測試）
   攻擊鍵在圓心、6 個技能圓框排成上半圓、HP／MP 藥水在底線兩側。
   直向：整組放在下方中間（扣掉右側按鈕列）；橫向：靠右，按鈕列在最右邊。 */
const WheelLayout=(()=>{
 const BASE={A:64,K:40,P:34,R:74,PX:112,STEP:33,START:187.5,STACK:46,GAP:8};
 const FULL=2*(BASE.PX+BASE.P/2);                    // 整組寬度（s=1）≈258
 function calc(W,H,sa,land){
  sa=sa||{t:0,r:0,b:0,l:0};
  const reserve=BASE.STACK+BASE.GAP+(land?10:6);     // 右側按鈕列（自動／聊天／功能）
  const availW=W-sa.l-sa.r-8-reserve;
  let s=Math.min(1,availW/FULL);
  if(H<360)s=Math.min(s,.9);
  s=Math.max(.72,s);
  const A=BASE.A*s,K=BASE.K*s,P=BASE.P*s,R=BASE.R*s,PX=BASE.PX*s;
  const cx=land?W-sa.r-reserve-FULL/2*s:sa.l+8+availW/2;
  const cy=H-sa.b-(land?10:22)-A/2;                  // 直向底部多留空間給經驗條（13px）
  const sk=[];
  for(let i=0;i<6;i++){const th=(BASE.START+i*BASE.STEP)*Math.PI/180;
   sk.push({x:cx+R*Math.cos(th)-K/2,y:cy+R*Math.sin(th)-K/2})}
  return{s,A,K,P,R,cx,cy,sk,
   atk:{x:cx-A/2,y:cy-A/2},
   hp:{x:cx-PX-P/2,y:cy+4*s-P/2},
   mp:{x:cx+PX-P/2,y:cy+4*s-P/2},
   wTop:H-(cy-R-K/2)};                                // 輪子頂端距畫面底部
 }
 return{calc,BASE,FULL};
})();
