/* 事件匯流排：規則層只負責「發生了什麼」，顯示層（UI／特效／音效）自行訂閱 */
const Events=(()=>{const h={};return{
 on(e,f){(h[e]||(h[e]=[])).push(f);return()=>Events.off(e,f)},
 off(e,f){h[e]=(h[e]||[]).filter(x=>x!==f)},
 emit(e,d){(h[e]||[]).slice().forEach(f=>f(d))}}})();
