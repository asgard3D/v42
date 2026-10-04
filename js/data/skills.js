/* 技能樹資料（純資料）：每職業 15 技能，來源為「技能描述.txt」。無轉職，單一技能樹。
   欄位：id 技能代號｜n 名稱｜lv 需求等級｜cat 技能/魔法｜k 類型 hit/aoe/heal/buff/passive
   m 傷害倍率(Lv1)｜hits 連擊數｜r 施放距離｜rad 範圍半徑｜at 以目標為中心｜dash 衝刺
   cd 冷卻秒｜mp 耗魔｜fx 特效類型｜col 特效顏色｜max 技能等級上限
   pct 治療比例｜buf 增益 {atk,spd,def,hp,crit,eva}｜dur 持續秒｜cond 施放條件｜st/v 被動屬性與每級數值
   pos [欄,列] 技能樹座標｜pre [[前置技能id,最低等級]]｜dp 技能書掉落機率(%)（怪物等級 ≥ lv-10 才會掉） */
const SK_ELEM={fire:'🔥',wind:'🌪️',water:'❄️',earth:'🪨',holy:'✨',dark:'🌑',none:''};
const SKILLS={
 warrior:[
  {id:'w_charge',n:'衝鋒突擊',lv:1,cat:'技能',k:'hit',m:1.5,r:8,dash:1,cd:5,mp:5,fx:'dash',col:0xffc070,max:5,ic:'🐗',pos:[2,0],pre:[],dp:6,desc:'向目標衝鋒突擊並造成傷害'},
  {id:'w_smash',n:'重擊',lv:5,cat:'技能',k:'hit',m:1.9,r:2.4,cd:3,mp:6,fx:'smash',col:0xffd0a0,max:5,ic:'💥',pos:[1,1],pre:[['w_charge',1]],dp:6,desc:'斧類或鈍器基本攻擊技巧'},
  {id:'w_stab',n:'刺擊',lv:10,cat:'技能',k:'hit',m:2.1,r:2.6,cd:3,mp:7,fx:'slash',col:0xdfe8ff,max:5,ic:'🗡️',pos:[3,1],pre:[['w_charge',1]],dp:6,desc:'用劍器攻擊敵方的技巧'},
  {id:'w_hammer',n:'鎚擊',lv:20,cat:'技能',k:'hit',m:2.6,r:2.4,cd:5,mp:10,fx:'smash',col:0xffa860,max:5,ic:'🔨',pos:[0,2],pre:[['w_smash',2]],dp:5,desc:'斧類或鈍器強烈的揮擊技巧'},
  {id:'w_shield',n:'防衛之盾',lv:35,cat:'技能',k:'buff',buf:{def:.3},dur:15,cd:20,mp:12,fx:'shield',col:0x7ab8ff,max:5,ic:'🛡️',pos:[2,2],pre:[['w_smash',2]],dp:4,desc:'增加防禦敵方的攻擊，減少受到的傷害'},
  {id:'w_crescent',n:'新月斬',lv:30,cat:'技能',k:'aoe',m:1.8,rad:4,cd:6,mp:12,fx:'spin',col:0xaad8ff,max:5,ic:'🌙',pos:[3,2],pre:[['w_stab',2]],dp:5,desc:'揮出如弦月般的劍氣，攻擊周圍敵人'},
  {id:'w_double',n:'雙重擊破',lv:60,cat:'技能',k:'hit',m:1.9,hits:2,r:2.6,cd:5,mp:18,fx:'multi',col:0xffd070,max:5,ic:'⚔️',pos:[0,3],pre:[['w_hammer',3]],dp:3,desc:'連續揮擊出 2 次的致命攻擊'},
  {id:'w_evade',n:'閃躲',lv:65,cat:'技能',k:'passive',st:'eva',v:3,max:5,ic:'💨',pos:[2,3],pre:[['w_shield',3]],dp:3,desc:'戰鬥時閃躲敵方攻擊的技巧（被動，閃避率提升）'},
  {id:'w_flame',n:'烈焰斬',lv:50,cat:'技能',k:'hit',m:3,r:2.6,cd:6,mp:16,fx:'slash',col:0xff7a30,max:5,ic:'🔥',elem:'fire',pos:[3,3],pre:[['w_crescent',3]],dp:4,desc:'使用燃燒的火劍攻擊對方'},
  {id:'w_sword',n:'秘劍之道',lv:71,cat:'技能',k:'passive',st:'atk',v:4,max:5,ic:'📜',pos:[0,4],pre:[['w_double',3]],dp:3,desc:'增加使用武器的攻擊威力（被動，傷害提升）'},
  {id:'w_roar',n:'戰士的咆嘯',lv:81,cat:'技能',k:'buff',buf:{hp:.12},dur:40,cd:60,mp:30,fx:'shout',col:0xff5a44,max:5,ic:'📣',pos:[2,4],pre:[['w_evade',3]],dp:2,desc:'一定時間內提升 HP 最大值'},
  {id:'w_berserk',n:'狂戰士之怒',lv:86,cat:'技能',k:'buff',buf:{spd:.4,atk:.3},dur:15,cd:45,mp:25,fx:'shout',col:0xff2a2a,cond:'lowhp',max:5,ic:'😡',pos:[3,4],pre:[['w_flame',3]],dp:2,desc:'HP 低於 30% 時才能使用，大幅增加攻擊速度與移動速度'},
  {id:'w_fury',n:'忿怒之擊',lv:90,cat:'技能',k:'hit',m:1.6,hits:4,r:2.6,cd:9,mp:30,fx:'multi',col:0xff4455,max:5,ic:'👊',pos:[0,5],pre:[['w_sword',3]],dp:2,desc:'強烈的連續攻擊後，再狠狠的踹敵人一腳'},
  {id:'w_iron',n:'鐵慕',lv:97,cat:'技能',k:'buff',buf:{def:.55},dur:20,cd:30,mp:35,fx:'shield',col:0xb0b8c8,max:5,ic:'🏰',pos:[2,5],pre:[['w_roar',3]],dp:1.5,desc:'戰士強力的防禦技能，更能承受更多的攻擊'},
  {id:'w_power',n:'威力攻擊',lv:99,cat:'技能',k:'hit',m:6,r:2.8,cd:12,mp:50,fx:'smash',col:0xffe27a,max:5,ic:'☄️',pos:[3,5],pre:[['w_berserk',3]],dp:1.5,desc:'使出驚天劈地的強烈猛擊'}],
 mage:[
  {id:'m_bolt',n:'魔法彈',lv:1,cat:'魔法',k:'hit',m:1.4,r:9,cd:2,mp:4,fx:'proj',col:0xb0a0ff,max:5,ic:'🔮',pos:[2,0],pre:[],dp:6,desc:'將魔法能量凝成球狀射出的攻擊'},
  {id:'m_firearrow',n:'火箭術',lv:5,cat:'魔法',k:'hit',m:1.9,r:9,cd:3,mp:6,fx:'proj',col:0xff8a2a,max:5,ic:'🏹',elem:'fire',pos:[1,1],pre:[['m_bolt',1]],dp:6,desc:'施展出像火一樣的箭'},
  {id:'m_heal',n:'治療術',lv:10,cat:'魔法',k:'heal',pct:.25,cd:8,mp:14,fx:'heal',col:0x8fffb0,max:5,ic:'💚',pos:[3,1],pre:[['m_bolt',1]],dp:6,desc:'魔法師的自我治療法術'},
  {id:'m_fireball',n:'火球術',lv:15,cat:'魔法',k:'aoe',m:2.2,rad:3,at:1,r:9,cd:5,mp:14,fx:'blast',col:0xff6a1a,max:5,ic:'🔥',elem:'fire',pos:[0,2],pre:[['m_firearrow',2]],dp:5,desc:'火燄的球體爆炸後會造成廣大的傷害'},
  {id:'m_windarrow',n:'風箭術',lv:20,cat:'魔法',k:'hit',m:2.2,r:9,cd:3,mp:8,fx:'proj',col:0xbfffd0,max:5,ic:'🌪️',elem:'wind',pos:[2,2],pre:[['m_firearrow',2]],dp:5,desc:'施展出像風刃的箭'},
  {id:'m_blast',n:'爆炎彈',lv:25,cat:'魔法',k:'aoe',m:2,rad:3.5,at:1,r:9,cd:6,mp:18,fx:'blast',col:0xff4a10,max:5,ic:'💣',elem:'fire',pos:[0,3],pre:[['m_fireball',3]],dp:5,desc:'發射數個火球術'},
  {id:'m_icearrow',n:'冰箭術',lv:30,cat:'魔法',k:'hit',m:2.6,r:9,cd:3,mp:10,fx:'proj',col:0x9adfff,max:5,ic:'🧊',elem:'water',pos:[2,3],pre:[['m_windarrow',2]],dp:5,desc:'施展出的冰一樣的箭'},
  {id:'m_stone',n:'碎石彈術',lv:35,cat:'魔法',k:'hit',m:2.8,r:9,cd:4,mp:12,fx:'proj',col:0xc0a070,max:5,ic:'🪨',elem:'earth',pos:[3,3],pre:[['m_windarrow',2]],dp:4,desc:'聚集碎石將他施放出去'},
  {id:'m_plain',n:'燎原之火',lv:38,cat:'魔法',k:'aoe',m:2.2,rad:5,at:1,r:9,cd:8,mp:24,fx:'blast',col:0xff7a20,max:5,ic:'🌋',elem:'fire',pos:[1,3],pre:[['m_fireball',3]],dp:4,desc:'施展出廣大的火燄'},
  {id:'m_icestorm',n:'冰風暴',lv:70,cat:'魔法',k:'aoe',m:3.2,rad:5,at:1,r:9,cd:10,mp:40,fx:'nova',col:0xbfeaff,max:5,ic:'🌨️',elem:'water',pos:[2,4],pre:[['m_icearrow',3]],dp:3,desc:'從天空中落下無數的冰錐'},
  {id:'m_mastery',n:'法術精深',lv:81,cat:'技能',k:'passive',st:'mpred',v:4,max:5,ic:'📘',pos:[4,4],pre:[['m_heal',3]],dp:2,desc:'減少自己施展魔法時 MP 減損的量（被動）'},
  {id:'m_meteor',n:'隕石術',lv:95,cat:'魔法',k:'aoe',m:5,rad:5,at:1,r:9,cd:12,mp:70,fx:'meteor',col:0xff7a22,max:5,ic:'☄️',elem:'fire',pos:[1,5],pre:[['m_plain',3]],dp:1.5,desc:'燃火的隕石自天而降，造成大範圍的攻擊'},
  {id:'m_thunder',n:'毀滅電擊',lv:97,cat:'魔法',k:'hit',m:6,r:9,cd:10,mp:60,fx:'bolt',col:0xfff070,max:5,ic:'⚡',elem:'wind',pos:[3,5],pre:[['m_stone',3]],dp:1.5,desc:'強烈的閃電將敵人炭烤成灰'},
  {id:'m_frost',n:'寒凍冰霜',lv:99,cat:'魔法',k:'aoe',m:5,rad:6,at:1,r:9,cd:14,mp:75,fx:'nova',col:0x8fd4ff,max:5,ic:'🥶',elem:'water',pos:[2,5],pre:[['m_icestorm',3]],dp:1.5,desc:'冷烈的冰寒刺入體內，使敵人受到強烈的凍傷'},
  {id:'m_firewall',n:'火牆術',lv:99,cat:'魔法',k:'aoe',m:4.5,rad:4.5,at:1,r:9,cd:12,mp:70,fx:'storm',col:0xff5a1a,max:5,ic:'🧱',elem:'fire',pos:[0,5],pre:[['m_blast',3]],dp:1.5,desc:'製造一面火燄的牆壁造成敵人莫大的傷害'}],
 rogue:[
  {id:'r_stab',n:'突刺',lv:1,cat:'技能',k:'hit',m:1.6,r:2.4,cd:2.5,mp:4,fx:'slash',col:0xe6c8ff,max:5,ic:'🔪',pos:[2,0],pre:[],dp:6,desc:'使用小刀強烈突擊敵人的攻擊'},
  {id:'r_spin',n:'迥旋突刺',lv:15,cat:'技能',k:'aoe',m:1.7,rad:3.2,cd:5,mp:10,fx:'spin',col:0xc070ff,max:5,ic:'🌀',pos:[1,1],pre:[['r_stab',1]],dp:5,desc:'使用小刀旋轉著突擊敵人'},
  {id:'r_heal',n:'回復術',lv:15,cat:'魔法',k:'heal',pct:.2,cd:9,mp:14,fx:'heal',col:0x8fffb0,max:5,ic:'💚',pos:[3,1],pre:[['r_stab',1]],dp:5,desc:'恢復少量的生命值'},
  {id:'r_double',n:'雙重突刺',lv:40,cat:'技能',k:'hit',m:1.5,hits:2,r:2.4,cd:4,mp:14,fx:'multi',col:0xe6c8ff,max:5,ic:'⚔️',pos:[0,2],pre:[['r_spin',2]],dp:4,desc:'使用小刀連續突擊敵人 2 次'},
  {id:'r_hide',n:'隱身',lv:51,cat:'魔法',k:'buff',buf:{eva:.5},dur:10,cd:25,mp:20,fx:'swift',col:0xaaaaff,max:5,ic:'👻',pos:[3,2],pre:[['r_heal',2]],dp:3,desc:'隱藏技巧，大幅提升閃避，敵方難以命中你'},
  {id:'r_claw',n:'雙刺抓擊',lv:50,cat:'技能',k:'hit',m:1.7,hits:3,r:2.4,cd:6,mp:18,fx:'multi',col:0xff8aff,max:5,ic:'🐾',pos:[0,3],pre:[['r_double',3]],dp:3,desc:'連續突擊敵人 2 次後再順勢割裂傷口'},
  {id:'r_rupture',n:'破裂突刺',lv:65,cat:'技能',k:'hit',m:2.2,hits:2,r:2.4,cd:6,mp:22,fx:'slash',col:0xff5a5a,max:5,ic:'🩸',pos:[1,3],pre:[['r_double',3]],dp:3,desc:'使用小刀連續突擊敵人的同一傷口 2 次'},
  {id:'r_breeze',n:'微風步伐',lv:70,cat:'魔法',k:'buff',buf:{spd:.3},dur:15,cd:25,mp:20,fx:'swift',col:0xbff6ff,max:5,ic:'🍃',pos:[3,3],pre:[['r_hide',2]],dp:3,desc:'借助風的力量來移動，移動速度上昇'},
  {id:'r_poison',n:'下毒',lv:71,cat:'技能',k:'buff',buf:{atk:.25},dur:25,cd:30,mp:24,fx:'cloud',col:0x7ad43a,max:5,ic:'☠️',pos:[0,4],pre:[['r_claw',3]],dp:3,desc:'在武器上塗上毒液，攻擊威力提升'},
  {id:'r_sand',n:'沙幕炸彈',lv:75,cat:'技能',k:'aoe',m:2.6,rad:4,at:1,r:7,cd:7,mp:28,fx:'blast',col:0xd8c080,max:5,ic:'💨',pos:[1,4],pre:[['r_rupture',3]],dp:2.5,desc:'發射出沙子的炸彈'},
  {id:'r_wind',n:'風疾步伐',lv:90,cat:'魔法',k:'buff',buf:{spd:.5},dur:15,cd:30,mp:30,fx:'swift',col:0xd8fbff,max:5,ic:'🌬️',pos:[3,4],pre:[['r_breeze',3]],dp:2,desc:'借助狂風的力量來移動，移動速度大幅上昇'},
  {id:'r_pepper',n:'胡椒炸彈',lv:81,cat:'技能',k:'aoe',m:2.9,rad:4,at:1,r:7,cd:8,mp:32,fx:'blast',col:0xff5a3a,max:5,ic:'🌶️',pos:[1,5],pre:[['r_sand',3]],dp:2,desc:'發射含有辛辣的粉末的炸彈'},
  {id:'r_toxin',n:'毒素炸彈',lv:86,cat:'技能',k:'aoe',m:3.2,rad:4.5,at:1,r:7,cd:9,mp:36,fx:'cloud',col:0x7ad43a,max:5,ic:'🧪',pos:[2,5],pre:[['r_sand',3]],dp:2,desc:'發射含有毒性的炸彈'},
  {id:'r_clone',n:'分身刺擊',lv:97,cat:'技能',k:'hit',m:1.2,hits:6,r:2.4,cd:10,mp:45,fx:'multi',col:0xe6c8ff,max:5,ic:'👥',pos:[0,5],pre:[['r_poison',3]],dp:1.5,desc:'快速的亂揮擊，分身同時刺擊敵人'},
  {id:'r_shadow',n:'影丶輪舞斬',lv:99,cat:'技能',k:'aoe',m:5,rad:5,cd:14,mp:60,fx:'spin',col:0x6a2aaa,max:5,ic:'🌑',elem:'dark',pos:[3,5],pre:[['r_wind',3]],dp:1.5,desc:'黑色的領域，範圍內怪物持續受到攻擊'}],
 priest:[
  {id:'p_heal',n:'回復術',lv:5,cat:'魔法',k:'heal',pct:.2,cd:6,mp:10,fx:'heal',col:0x8fffb0,max:5,ic:'💚',pos:[2,0],pre:[],dp:6,desc:'聖職者的治療法術'},
  {id:'p_bigheal',n:'大回復術',lv:10,cat:'魔法',k:'heal',pct:.35,cd:8,mp:18,fx:'heal',col:0x7dffa0,max:5,ic:'💖',pos:[1,1],pre:[['p_heal',1]],dp:6,desc:'聖職者的強力的治療法術'},
  {id:'p_shield',n:'護盾術',lv:35,cat:'魔法',k:'buff',buf:{def:.3},dur:20,cd:30,mp:16,fx:'shield',col:0x9ad0ff,max:5,ic:'🛡️',pos:[3,1],pre:[['p_heal',1]],dp:4,desc:'增強物理防禦的法術'},
  {id:'p_strong',n:'強力治療術',lv:40,cat:'魔法',k:'heal',pct:.5,cd:9,mp:28,fx:'heal',col:0x66ffa0,max:5,ic:'💝',pos:[0,2],pre:[['p_bigheal',2]],dp:4,desc:'聖職者的高級的治療法術'},
  {id:'p_cure',n:'痊癒術',lv:50,cat:'魔法',k:'heal',pct:.65,cd:10,mp:36,fx:'heal',col:0x55ffb0,max:5,ic:'🌿',pos:[1,2],pre:[['p_bigheal',2]],dp:3,desc:'聖職者的強力的治療法術'},
  {id:'p_guard',n:'神聖護體',lv:55,cat:'魔法',k:'buff',buf:{def:.4},dur:20,cd:40,mp:24,fx:'shield',col:0xfff0a8,max:5,ic:'🔰',elem:'holy',pos:[3,2],pre:[['p_shield',2]],dp:3,desc:'增加防禦的法術'},
  {id:'p_exorcism',n:'驅邪術',lv:60,cat:'魔法',k:'aoe',m:2.6,rad:4,at:1,r:7,cd:6,mp:26,fx:'pillar',col:0xfff0a8,max:5,ic:'✝️',elem:'holy',pos:[2,2],pre:[['p_heal',3]],dp:3,desc:'淨化惡魔的邪氣，以聖光傷害範圍內敵人'},
  {id:'p_rescue',n:'救援術',lv:65,cat:'魔法',k:'buff',buf:{hp:.15},dur:60,cd:60,mp:30,fx:'bless',col:0xffe9a0,max:5,ic:'🆘',pos:[0,3],pre:[['p_strong',3]],dp:3,desc:'增加指定對象最大 HP 值'},
  {id:'p_super',n:'超級痊癒術',lv:70,cat:'魔法',k:'heal',pct:.85,cd:14,mp:50,fx:'heal',col:0x44ffc0,max:5,ic:'🌟',pos:[1,3],pre:[['p_cure',3]],dp:2.5,desc:'恢復大量的 HP'},
  {id:'p_barrier',n:'避邪結界',lv:81,cat:'魔法',k:'aoe',m:3,rad:4.5,cd:8,mp:38,fx:'pillar',col:0xaad0ff,max:5,ic:'⛪',elem:'holy',pos:[2,3],pre:[['p_exorcism',3]],dp:2,desc:'產生結界，以聖光驅逐周圍的怪物'},
  {id:'p_grace',n:'優雅靈氣',lv:81,cat:'技能',k:'passive',st:'mpred',v:4,max:5,ic:'🕊️',pos:[0,4],pre:[['p_rescue',3]],dp:2,desc:'減少自己施展魔法時 MP 減損的量（被動）'},
  {id:'p_hand',n:'神聖之手',lv:83,cat:'魔法',k:'buff',buf:{crit:20},dur:30,cd:40,mp:30,fx:'bless',col:0xffe27a,max:5,ic:'🙌',elem:'holy',pos:[3,3],pre:[['p_guard',2]],dp:2,desc:'提昇命中，大幅增加暴擊機率'},
  {id:'p_revelation',n:'天啟',lv:91,cat:'技能',k:'buff',buf:{atk:.4,def:.3,spd:.2},dur:30,cd:60,mp:50,fx:'bless',col:0xffffff,max:5,ic:'🌅',elem:'holy',pos:[3,4],pre:[['p_hand',3]],dp:1.5,desc:'能力大幅提升（攻擊、防禦、速度）'},
  {id:'p_field',n:'聖光之域',lv:95,cat:'魔法',k:'aoe',m:4,rad:5,at:1,r:7,cd:10,mp:55,fx:'pillar',col:0xfff6c8,max:5,ic:'🌞',elem:'holy',pos:[2,4],pre:[['p_barrier',3]],dp:1.5,desc:'產生聖光結界，對範圍內敵人造成聖光傷害'},
  {id:'p_totem',n:'避邪圖騰',lv:99,cat:'魔法',k:'aoe',m:5.5,rad:6,cd:12,mp:70,fx:'pillar',col:0xffe9a0,max:5,ic:'🗿',elem:'holy',pos:[2,5],pre:[['p_field',3]],dp:1.5,desc:'產生強大結界，無情淨化範圍內的怪物'}],
 monk:[
  {id:'k_smash',n:'重擊',lv:5,cat:'技能',k:'hit',m:1.8,r:2.4,cd:3,mp:5,fx:'smash',col:0xffd070,max:5,ic:'👊',pos:[2,0],pre:[],dp:6,desc:'武道家的基本拳法技巧'},
  {id:'k_lightning',n:'閃電拳',lv:10,cat:'技能',k:'hit',m:2,r:2.4,cd:3,mp:6,fx:'multi',col:0xfff070,max:5,ic:'⚡',elem:'wind',pos:[1,1],pre:[['k_smash',1]],dp:6,desc:'使出如雷似的拳法技巧'},
  {id:'k_martial',n:'武學之道',lv:15,cat:'魔法',k:'passive',st:'hp',v:5,max:5,ic:'📖',pos:[3,1],pre:[['k_smash',1]],dp:5,desc:'武道家基本的武學技巧，HP 值上升（被動）'},
  {id:'k_kick',n:'蹴擊',lv:25,cat:'技能',k:'hit',m:2.4,r:2.4,cd:4,mp:8,fx:'slash',col:0xffb830,max:5,ic:'🦵',pos:[0,2],pre:[['k_lightning',2]],dp:5,desc:'武道家的基本踢擊技巧'},
  {id:'k_fight',n:'格鬥之道',lv:28,cat:'魔法',k:'passive',st:'atk',v:3,max:5,ic:'🥋',pos:[2,2],pre:[['k_martial',2]],dp:5,desc:'武道家基本的格鬥技巧，DAM 值上升（被動）'},
  {id:'k_heal',n:'回復術',lv:20,cat:'魔法',k:'heal',pct:.2,cd:9,mp:14,fx:'heal',col:0x8fffb0,max:5,ic:'💚',pos:[3,2],pre:[['k_martial',2]],dp:5,desc:'武道家醫療法術'},
  {id:'k_spiral',n:'螺旋拳',lv:35,cat:'技能',k:'hit',m:2.6,r:2.4,cd:4,mp:10,fx:'multi',col:0xffa030,max:5,ic:'🌀',pos:[0,3],pre:[['k_kick',3]],dp:4,desc:'拳頭旋轉著攻擊灌入敵方的體內的技巧'},
  {id:'k_double',n:'二段連擊',lv:55,cat:'技能',k:'hit',m:1.6,hits:2,r:2.4,cd:5,mp:14,fx:'multi',col:0xffd070,max:5,ic:'✌️',pos:[1,3],pre:[['k_lightning',3]],dp:3,desc:'拳頭連續在敵人身上攻擊兩次'},
  {id:'k_iron',n:'鐵布衫',lv:51,cat:'技能',k:'buff',buf:{def:.35},dur:15,cd:25,mp:18,fx:'shield',col:0xffd45a,max:5,ic:'🦺',pos:[3,3],pre:[['k_heal',2]],dp:3,desc:'增加武道家防禦能力'},
  {id:'k_hundred',n:'百裂踢',lv:65,cat:'技能',k:'hit',m:1,hits:6,r:2.4,cd:8,mp:28,fx:'multi',col:0xffb830,max:5,ic:'🦶',pos:[0,4],pre:[['k_spiral',3]],dp:3,desc:'在敵人身上連續使用踢擊'},
  {id:'k_fistqi',n:'鬥氣拳',lv:86,cat:'魔法',k:'hit',m:4,r:2.6,cd:7,mp:34,fx:'smash',col:0xff8a2a,max:5,ic:'🔥',pos:[1,4],pre:[['k_double',3]],dp:2,desc:'把鬥氣集中在拳頭上攻擊'},
  {id:'k_qigong',n:'氣功波',lv:61,cat:'魔法',k:'hit',m:3,r:7,cd:5,mp:18,fx:'proj',col:0x55b8ff,max:5,ic:'🔵',pos:[2,4],pre:[['k_fight',3]],dp:3,desc:'聚集鬥氣所放出的強烈攻擊'},
  {id:'k_rampage',n:'暴走',lv:90,cat:'技能',k:'buff',buf:{atk:.3,spd:.4},dur:20,cd:40,mp:36,fx:'shout',col:0xff5a44,max:5,ic:'💢',pos:[1,5],pre:[['k_fistqi',3]],dp:2,desc:'在一定時間內可使用連續攻擊，攻擊與速度提升'},
  {id:'k_dragon',n:'滅龍拳',lv:99,cat:'魔法',k:'hit',m:7,r:8,cd:12,mp:60,fx:'proj',col:0xffd23a,max:5,ic:'🐉',pos:[2,5],pre:[['k_qigong',3]],dp:1.5,desc:'聚集威力強大足以將龍擊倒的鬥氣'},
  {id:'k_reflect',n:'反射閃避',lv:97,cat:'技能',k:'passive',st:'eva',v:4,max:5,ic:'🪞',pos:[3,5],pre:[['k_iron',3]],dp:1.5,desc:'增加物理攻擊的閃避效果（被動）'}]
};
const SK_BY_ID={};
Object.keys(SKILLS).forEach(c=>SKILLS[c].forEach(s=>{s.cls=c;if(!s.elem)s.elem='none';SK_BY_ID[s.id]=s}));
const SK_STAT_NAME={atk:'傷害',hp:'最大 HP',mp:'最大 MP',crit:'暴擊率',eva:'閃避率',mpred:'技能耗魔減少',spd:'移動速度'};
const SK_BUF_NAME={atk:'攻擊力',spd:'移動／攻擊速度',def:'受到傷害',hp:'最大 HP',crit:'暴擊率',eva:'閃避率'};
