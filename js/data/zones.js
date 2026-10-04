/* 地圖資料（純資料）。m = 圖鑑 id 清單（4 種一般怪 + Boss），定義見 data/monsters.js */
const ZN=[
{n:'新手森林',lv:1,bg:0x10281c,fog:0x10281c,gr:0x3a7a3a,g2:0x6a8a4a,sk:.6,st:0,ha:1,ff:0xffee88,pd:0x2a6ab0,t:0,tc:[0x1f6a3a,0x2a7a42,0x185a32],m:['poring','mush','forest_wolf','woodpecker','boss_tree']},
{n:'赤砂荒漠',lv:10,bg:0x4a3a22,fog:0x5a4528,gr:0xb89a5a,g2:0x8a6a3a,sk:.6,st:1,ha:1.2,ff:0xffe8b0,pd:0x3aa0a0,t:1,tc:[0x3a8a4a,0x2f7a3e,0x4a9a55],m:['scorpion','cactus','vulture','dust_spirit','boss_sand']},
{n:'霜雪山脈',lv:20,bg:0x1c2a40,fog:0x2a3a55,gr:0xdce6f2,g2:0xffffff,sk:.6,st:2,ha:1.3,ff:0xffffff,pd:0x9ad8ff,t:2,tc:[0xe8f0fa,0xcfe0f0,0xf4f8ff],m:['frost_wolf','ice_spirit','snowy_owl','ice_golem','boss_frost']},
{n:'熔岩煉獄',lv:35,bg:0x1a0a08,fog:0x2a100c,gr:0x2a1612,g2:0x5a2a18,sk:0,st:3,ha:1,ff:0xff7a30,pd:0xff4a10,t:3,tc:[0x3a2220,0x2a1818,0x4a2a26],m:['imp','fire_spirit','hellhound','lava_golem','boss_balrog']},
{n:'幽暗沼澤',lv:45,bg:0x1a2a1a,fog:0x24331f,gr:0x3a4a2a,g2:0x5a5a3a,sk:.3,st:0,ha:.5,ff:0xb8ff6a,pd:0x4a6a2a,t:4,tc:[0x2a4a28,0x35552e,0x203d22],m:['swamp_spider','flytrap','drowned','toxic_slime','boss_witch']},
{n:'水晶洞窟',lv:55,bg:0x14143a,fog:0x1c1c4a,gr:0x2a2a5a,g2:0x6a5ad0,sk:0,st:3,ha:1,ff:0xc09aff,pd:0x7a6aff,t:5,tc:[0x8a6aff,0x6ac0ff,0xc070ff],m:['crystal_bat','crystal_spirit','crystal_spider','crystal_golem','boss_crystal']},
{n:'雲海天空',lv:65,bg:0x4a6a9a,fog:0x6a8ac0,gr:0xe8eef8,g2:0xffffff,sk:1,st:0,ha:1.4,ff:0xffffff,pd:0xaadcff,t:6,tc:[0xffffff,0xeef4ff,0xdcecff],m:['thunderbird','wind_spirit','cloud_slime','wyvern','boss_skydrake']},
{n:'廢墟古城',lv:75,bg:0x2a2428,fog:0x3a3238,gr:0x5a5560,g2:0x8a8590,sk:.35,st:4,ha:1,ff:0xffd08a,pd:0x4a6a8a,t:7,tc:[0x8a8590,0x7a7580,0x9a95a0],m:['skeleton','skel_mage','gargoyle','undead_wolf','boss_knight']},
{n:'虛空深淵',lv:85,bg:0x0a0612,fog:0x140a24,gr:0x1a1028,g2:0x4a2a7a,sk:0,st:3,ha:1.1,ff:0xd070ff,pd:0x8a2aff,t:8,tc:[0x6a2ad0,0x9a4aff,0x4a1a9a],m:['void_fiend','shadow_spirit','void_bug','void_drake','boss_abyss']},
{n:'神域星殿',lv:92,bg:0x1a1630,fog:0x2a2448,gr:0xd8c890,g2:0xfff0b0,sk:.5,st:0,ha:1.2,ff:0xffe070,pd:0xffd860,t:9,tc:[0xf0d890,0xe8c860,0xfff0b0],m:['light_spirit','sky_eagle','sky_wolf','temple_golem','boss_titan']}];
