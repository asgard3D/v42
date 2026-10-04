/* 開始冒險／繼續遊戲 */
const begin=()=>{S.mode='play';document.body.classList.remove('create');$('autoBtn').style.display='flex';S.hp=maxHp();S.mp=maxMp();hero.position.set(0,0,0);hero.rotation.y=0;S.offline={start:Date.now(),z:Z,lv:S.lv,cls:S.cls,lootTier:Math.max(0,Math.min(4,Number(S.autoLootTier)||0)),active:true};save();renderSk();ui();bagUI();offlineUI();say('歡迎來到艾諾 Online，'+S.name+'！')};
$('go').onclick=()=>{S.name=$('nm').value.trim()||'冒險者';enterZone(0);begin()};
