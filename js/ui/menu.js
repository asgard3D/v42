/* 功能表 */
const tb=$('top');
// 功能表：把原本散落在畫面上的控制集中到右下角。
const menuBtn=$('menuBtn'),menuPanel=$('menuPanel');
menuBtn.onclick=()=>{const on=menuPanel.classList.toggle('o');menuBtn.setAttribute('aria-expanded',on?'true':'false')};
$('menuActions').innerHTML='<b>功能</b><div id="menuStats" style="margin-top:6px;font-size:12px;line-height:1.6"></div>';
$('menuSkills').innerHTML='';
$('menuMap').innerHTML='';
$('menuHelp').innerHTML='<b>操作</b>';
menuPanel.querySelector('#menuActions').appendChild(tb);
// 快捷欄僅綁定 HP 水／MP 水，技能系統完全獨立。
// 地圖切換固定放在小地圖正下方，不放入功能表。
menuPanel.querySelector('#menuHelp').appendChild($('help'));
menuPanel.querySelector('#menuHelp').appendChild($('log'));
const b1=document.createElement('button');b1.textContent='+10級（預覽外觀）';b1.onclick=()=>{S.lv=Math.min(99,S.lv+10);S.exp=0;S.hp=maxHp();rebuild()};tb.appendChild(b1);
const b2=document.createElement('button');b2.textContent='重新創角';b2.onclick=()=>{S.mode='create';document.body.classList.add('create');Object.assign(S,{skl:{},books:{},sbar:Array(6).fill(null),lv:1,exp:0,tm:null,dest:null,auto:false,inv:[],gold:0,pot:3,mpPot:3,autoLootTier:0,quick:Array(30).fill(null),eq:{weapon:null,armor:null,boots:null,ring:null,amulet:null}});S.buff={atk:0,spd:0,def:0,hp:0,crit:0,eva:0};S.bp={};S.bo={};S.bfx={};S.skcd={};hero.position.set(0,0,0);rebuild()};tb.appendChild(b2);
