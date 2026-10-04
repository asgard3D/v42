/* 自動喝水設定 */
// ---------- auto-potion settings ----------
function pcv(x,d){const n=Number(x);return x==null||!Number.isFinite(n)?d:Math.max(0,Math.min(95,Math.round(n/5)*5))}
function asSync(){const a=$('ahr'),b=$('amr');if(!a)return;if(document.activeElement!==a)a.value=S.autoHp;if(document.activeElement!==b)b.value=S.autoMp;$('ahv').textContent=S.autoHp?S.autoHp+'%':'關閉';$('amv').textContent=S.autoMp?S.autoMp+'%':'關閉'}
$('ahr').oninput=e=>{S.autoHp=+e.target.value;asSync();save()};$('amr').oninput=e=>{S.autoMp=+e.target.value;asSync();save()};
$('asp').onclick=e=>{if(e.target.closest('[data-x]'))$('asp').classList.remove('o')};$('autoCfg').onclick=()=>$('asp').classList.toggle('o');

const altBox=$('lootTierSelect'),altBtn=$('altBtn'),altText=$('altText'),altMenu=$('altMenu');
const lootSheet=$('lootTierSheet'),lootSheetOptions=$('lootSheetOptions'),lootSheetClose=$('lootSheetClose');
const ALT_NAMES=['全部階級','精良以上','稀有以上','史詩以上','傳說'];
const ALT_TIER_CLASS=['tier0','tier1','tier2','tier3','tier4'];
function isPhoneLootUI(){return document.body.classList.contains('dev-phone') || window.matchMedia('(max-width: 640px)').matches}
function syncAltUI(){const v=Math.max(0,Math.min(4,Number(S.autoLootTier)||0));S.autoLootTier=v;if(altText)altText.textContent=ALT_NAMES[v];if(altBtn){altBtn.dataset.tier=String(v);altBtn.setAttribute('aria-expanded',altMenu?.classList.contains('o')?'true':'false')}if(altMenu)[...altMenu.querySelectorAll('[data-alt]')].forEach(b=>{const on=Number(b.dataset.alt)===v;b.classList.toggle('on',on);b.setAttribute('aria-selected',on?'true':'false')});if(lootSheetOptions)[...lootSheetOptions.querySelectorAll('[data-alt]')].forEach(b=>{const on=Number(b.dataset.alt)===v;b.classList.toggle('on',on);b.setAttribute('aria-selected',on?'true':'false')})}
function closeAlt(){if(!altMenu)return;altMenu.classList.remove('o');altBtn?.setAttribute('aria-expanded','false')}
function closeLootSheet(){if(!lootSheet)return;lootSheet.classList.remove('o');lootSheet.setAttribute('aria-hidden','true');document.body.classList.remove('loot-sheet-open')}
function openLootSheet(){if(!lootSheet)return;closeAlt();lootSheet.classList.add('o');lootSheet.setAttribute('aria-hidden','false');document.body.classList.add('loot-sheet-open');syncAltUI()}
function chooseLootTier(v){S.autoLootTier=Math.max(0,Math.min(4,Number(v)||0));syncAltUI();try{localStorage.setItem('ainor_auto_loot_tier',String(S.autoLootTier))}catch(e){}save();closeAlt();closeLootSheet()}
if(altBox&&altBtn&&altMenu){
 try{const pv=localStorage.getItem('ainor_auto_loot_tier');if(pv!==null&&Number.isFinite(Number(pv)))S.autoLootTier=Math.max(0,Math.min(4,Number(pv)||0))}catch(e){}
 syncAltUI();
 altBtn.onclick=e=>{e.stopPropagation();if(isPhoneLootUI()){openLootSheet();return}const open=altMenu.classList.toggle('o');altBtn.setAttribute('aria-expanded',open?'true':'false')};
 altMenu.onclick=e=>{const b=e.target.closest('[data-alt]');if(!b)return;chooseLootTier(b.dataset.alt)};
 document.addEventListener('click',e=>{if(!altBox.contains(e.target))closeAlt()});
}
if(lootSheet&&lootSheetOptions){
 lootSheetOptions.innerHTML=ALT_NAMES.map((n,i)=>`<button type="button" role="option" data-alt="${i}" class="lootSheetOption ${ALT_TIER_CLASS[i]}"><span class="tierDot"></span><span>${n}</span><span class="lootSheetCheck">✓</span></button>`).join('');
 lootSheetOptions.onclick=e=>{const b=e.target.closest('[data-alt]');if(b)chooseLootTier(b.dataset.alt)};
 lootSheet.querySelector('.lootSheetShade')?.addEventListener('click',closeLootSheet);
 lootSheetClose?.addEventListener('click',closeLootSheet);
}
window.addEventListener('resize',()=>{if(!isPhoneLootUI())closeLootSheet();syncAltUI()});
