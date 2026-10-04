/* 怪物圖鑑（純資料／純函式）
   種族 race、造型 kind（對應 render/monsters.js 的 MKF）、行為 ai／gait、數值皆在這裡。
   ai：bump=近身衝撞（會圍攻）、spore=遠程拋射（保持距離）、lunge=繞圈後撲擊／俯衝、boss=Boss 技能組
   gait：hop 跳行、sway 搖擺、run 四足奔跑、fly 飛行／漂浮、walk 人形步行、stomp 沉重步行 */
const RACE={slime:'史萊姆',plant:'植物',beast:'野獸',bird:'鳥類',insect:'蟲類',spirit:'精靈',golem:'魔像',demon:'惡魔',undead:'亡靈',dragon:'龍族',giant:'巨人'};
const RACE_IC={slime:'🟢',plant:'🌿',beast:'🐺',bird:'🐦',insect:'🐛',spirit:'✨',golem:'🗿',demon:'😈',undead:'💀',dragon:'🐉',giant:'👹'};
// 行為範本（基礎數值，之後再依地圖乘上 zoneScale）。z=出生距離範圍 c=每張地圖數量
const MON_TPL={
 hopper:{ai:'bump',gait:'hop',pr:8.5,hp:24,dm:3,sp:1,ch:2.2,ag:5,rg:1.6,cd:1.2,exp:10,z:[8,18],c:6},
 shooter:{ai:'spore',gait:'sway',pr:7,hp:60,dm:7,sp:.8,ch:1.5,ag:8.5,rg:1.6,cd:1.4,exp:22,z:[14,26],c:5},
 pouncer:{ai:'lunge',gait:'run',pr:10.5,hp:48,dm:6,sp:2,ch:3.6,ag:8,rg:1.7,cd:.9,exp:28,z:[22,36],c:6},
 swooper:{ai:'lunge',gait:'fly',pr:9,hp:34,dm:6,sp:2.4,ch:4.4,ag:9.5,rg:1.6,cd:1,exp:22,z:[12,32],c:5},
 caster:{ai:'spore',gait:'fly',pr:6,hp:30,dm:9,sp:1.2,ch:1.8,ag:9.5,rg:1.6,cd:1.5,exp:26,z:[16,30],c:5},
 crawler:{ai:'lunge',gait:'run',pr:12,hp:58,dm:7,sp:1.6,ch:3,ag:7.5,rg:1.7,cd:1,exp:28,z:[16,32],c:5},
 brute:{ai:'bump',gait:'stomp',pr:3.2,hp:150,dm:11,sp:.6,ch:1.1,ag:5.5,rg:2.3,cd:1.9,exp:50,z:[10,26],c:3},
 fiend:{ai:'lunge',gait:'walk',pr:9,hp:72,dm:12,sp:1.6,ch:3.4,ag:9,rg:1.8,cd:.9,exp:42,z:[16,32],c:4},
 skeleton:{ai:'bump',gait:'walk',pr:8,hp:62,dm:9,sp:1.2,ch:2.3,ag:7,rg:1.9,cd:1.1,exp:30,z:[10,26],c:5},
 mage:{ai:'spore',gait:'walk',pr:6,hp:40,dm:11,sp:.9,ch:1.6,ag:9,rg:1.6,cd:1.5,exp:34,z:[18,32],c:4},
 drakeling:{ai:'lunge',gait:'run',pr:8,hp:110,dm:14,sp:1.8,ch:3.8,ag:10,rg:2.1,cd:1.1,exp:62,z:[20,34],c:3},
 plantShooter:{ai:'spore',gait:'sway',pr:5,hp:80,dm:8,sp:.2,ch:.9,ag:8.5,rg:1.6,cd:1.6,exp:26,z:[12,28],c:4},
 boss:{ai:'boss',gait:'stomp',pr:3.6,boss:1,hp:420,dm:16,sp:.8,ch:1.8,ag:8,rg:3,cd:1.5,exp:260,c:1}};
// [id, 名稱, 種族, 造型 kind, 造型參數, 範本, 覆寫]；pc=投射物顏色 an=攻擊名稱 sc=模型縮放
const MON_ROWS=[
 ['poring','波利','slime','poring',[0xff9fc4,0],'hopper'],
 ['mush','蘑菇怪','plant','mush',[0xd23a3a,0],'shooter',{an:'孢子'}],
 ['forest_wolf','森林狼','beast','wolf',[0x777c86,0x3a3d46,0],'pouncer',{an:'撲咬'}],
 ['woodpecker','森林啄木鳥','bird','bird',[0x8a6a42,0xc04a30,0],'swooper',{an:'啄擊',hp:26,dm:5}],
 ['boss_tree','古樹之王','giant','boss',[0x5a3a22,0x1f7a3a,0],'boss'],
 ['scorpion','沙漠蠍','insect','spider',[0xc0904a,0x6a4a20,1],'crawler',{an:'毒針'}],
 ['cactus','仙人掌怪','plant','plant',[0x3a9a4a,0xff7ab0,0],'plantShooter',{an:'尖刺',pc:0xe8ffa0}],
 ['vulture','禿鷹','bird','bird',[0x4a3a32,0xb89a6a,1],'swooper',{an:'俯衝',hp:46,dm:8}],
 ['dust_spirit','沙塵精靈','spirit','spirit',[0xe0c080,0xfff0c0,0],'caster',{an:'沙暴',pc:0xe8c070}],
 ['boss_sand','沙漠巨像','golem','golem',[0x9a7a4a,0xd0a030,0],'boss',{sc:2.4,hp:520,dm:15}],
 ['frost_wolf','霜狼','beast','wolf',[0xe8eef8,0x8a9ab0,1],'pouncer',{an:'冰牙'}],
 ['ice_spirit','冰晶精靈','spirit','spirit',[0x8ad0ff,0xe8f8ff,1],'caster',{an:'冰錐',pc:0x9adfff}],
 ['snowy_owl','雪鴞','bird','bird',[0xf0f4fa,0x9ab0c8,0],'swooper',{an:'俯衝'}],
 ['ice_golem','冰魔像','golem','golem',[0x9ac8e8,0x5ac8ff,1],'brute'],
 ['boss_frost','冰霜巨人','giant','boss',[0x8aa0c0,0x5ac8ff,1],'boss'],
 ['imp','小惡魔','demon','demon',[0x8a2a2a,0xffa030,0],'fiend',{an:'爪擊'}],
 ['fire_spirit','火焰精靈','spirit','spirit',[0xff6a20,0xffd060,2],'caster',{an:'火球',pc:0xff8a30}],
 ['hellhound','地獄犬','beast','wolf',[0x3a1a1a,0xc02010,1],'pouncer',{an:'烈焰撕咬'}],
 ['lava_golem','熔岩魔像','golem','golem',[0x3a2420,0xff5a10,0],'brute'],
 ['boss_balrog','炎魔','demon','demon',[0x4a1410,0xff5a10,2],'boss',{sc:2.7,hp:480,dm:20}],
 ['swamp_spider','沼澤蜘蛛','insect','spider',[0x3a4a2a,0x7a8a3a,0],'crawler',{an:'毒咬'}],
 ['flytrap','食人花','plant','plant',[0x2f7a2a,0xc02a4a,1],'plantShooter',{an:'毒液',pc:0x9aff3a,hp:90}],
 ['drowned','溺亡者','undead','undead',[0xb8c0a0,0x7aff9a,0],'skeleton'],
 ['toxic_slime','毒沼史萊姆','slime','poring',[0x7acb3a,1],'hopper',{hp:34,dm:4}],
 ['boss_witch','沼澤巫樹','giant','boss',[0x2a3a22,0x7aff3a,0],'boss'],
 ['crystal_bat','水晶蝙蝠','bird','bird',[0x6a4ac0,0xc0a0ff,2],'swooper',{an:'音波'}],
 ['crystal_spirit','晶簇精靈','spirit','spirit',[0xd070ff,0xf0d0ff,1],'caster',{an:'晶刺',pc:0xd890ff}],
 ['crystal_spider','水晶蜘蛛','insect','spider',[0x5a5ad8,0xb0b0ff,0],'crawler',{an:'晶牙'}],
 ['crystal_golem','水晶魔像','golem','golem',[0x6a5ad0,0xd08aff,1],'brute'],
 ['boss_crystal','水晶守衛','golem','golem',[0x4a3a9a,0xc08aff,1],'boss',{sc:2.8,hp:560,dm:16}],
 ['thunderbird','雷鳥','bird','bird',[0xe8e8f4,0xf0d040,2],'swooper',{an:'雷擊',dm:8}],
 ['wind_spirit','風之精靈','spirit','spirit',[0xaad8ff,0xffffff,0],'caster',{an:'風刃',pc:0xcceeff}],
 ['cloud_slime','雲霧史萊姆','slime','poring',[0xdff0ff,0],'hopper',{hp:34,dm:4}],
 ['wyvern','雲龍幼體','dragon','drake',[0xd8e0f0,0x6aa0e0,0],'drakeling',{an:'龍爪',sc:.8}],
 ['boss_skydrake','天空飛龍王','dragon','drake',[0xd8c890,0xfff0a0,0],'boss',{sc:2.6,hp:400,dm:21,ch:2.6}],
 ['skeleton','骷髏兵','undead','undead',[0xe0d8c0,0xff6a30,0],'skeleton'],
 ['skel_mage','骷髏法師','undead','undead',[0xd8d0b8,0xb080ff,1],'mage',{an:'暗影彈',pc:0xb080ff}],
 ['gargoyle','石像鬼','demon','demon',[0x7a7f8a,0xff8a40,3],'fiend',{gait:'fly',an:'俯衝'}],
 ['undead_wolf','亡靈狼','beast','wolf',[0xb8b0a0,0x4a4440,2],'pouncer',{an:'腐爛撕咬'}],
 ['boss_knight','古城騎士','giant','boss',[0x6a6a78,0x7aa8ff,1],'boss'],
 ['void_fiend','虛空惡魔','demon','demon',[0x3a1a5a,0xd04aff,1],'fiend',{an:'虛空爪',pc:0xc060ff}],
 ['shadow_spirit','暗影精靈','spirit','spirit',[0x2a1a3a,0x9a4aff,0],'caster',{an:'暗影彈',pc:0xa05aff}],
 ['void_bug','虛空蟲','insect','spider',[0x1a1028,0x8a2aff,0],'crawler',{an:'虛空咬'}],
 ['void_drake','虛空龍','dragon','drake',[0x1a1028,0x8a2aff,1],'drakeling',{an:'虛空吐息'}],
 ['boss_abyss','深淵領主','demon','demon',[0x1a0a2a,0xd04aff,2],'boss',{sc:3,hp:520,dm:22}],
 ['light_spirit','聖輝精靈','spirit','spirit',[0xffe070,0xffffff,0],'caster',{an:'聖光彈',pc:0xffe890}],
 ['sky_eagle','天鷹','bird','bird',[0xfff4d0,0xd0a030,1],'swooper',{an:'俯衝',hp:70,dm:10}],
 ['sky_wolf','天狼','beast','wolf',[0xfff4d0,0xd0a030,2],'pouncer',{an:'聖牙'}],
 ['temple_golem','守殿魔像','golem','golem',[0xe8d8a0,0xffa030,1],'brute'],
 ['boss_titan','終焉神將','giant','boss',[0xe8d8a0,0xff8a20,1],'boss']];
const MONSTERS={};
MON_ROWS.forEach(([id,n,race,kind,a,tpl,o])=>{MONSTERS[id]=Object.assign({id,n,race,kind,a},MON_TPL[tpl],o||{})});
// 每張地圖 4 種一般怪 + 1 隻 Boss；LV_OFF 為相對地圖等級的加成
const LV_OFF=[0,2,3,4,7];
const EXP_REF=30; // 圖鑑 exp 欄位的平均值＝1 倍；實際經驗＝mobExp(怪物等級)×(該怪 exp÷30)
// 地圖成長倍率：f=血量 d=傷害 e=經驗（e 已不再用於經驗，改由經驗表決定）
function zoneScale(zi,lv){return{f:[1,3.5,8,16][zi]||1+lv*.43,d:[1,2.6,5,9][zi]||1+lv*.23,e:[1,4,9,18][zi]||1+lv*.5}}
// 某張地圖的怪物名冊（已套用地圖成長）。ZN[zi].m 為圖鑑 id 清單
function zoneRoster(zi){const z=ZN[zi],sc=zoneScale(zi,z.lv);
 return z.m.map((id,j)=>{const d=MONSTERS[id];return Object.assign({},d,{lv:z.lv+LV_OFF[j],hp:Math.round(d.hp*sc.f),dm:Math.round(d.dm*sc.d),exp:Math.max(1,Math.round(mobExp(z.lv+LV_OFF[j])*d.exp/EXP_REF))})})}
