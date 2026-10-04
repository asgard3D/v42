/* 外觀資料：髮色、髮型、配色（純資料） */
const HC=[
 [0x1c1620,0x8a1626], // 黑紅
 [0x15121a,0x2e2a36], // 黑灰
 [0x2a1a1e,0xb02030], // 黑紅亮
 [0x8a8a96,0xc8c8d8], // 銀白
 [0x1a2a5a,0x4a8aff], // 黑藍
 [0x17110d,0xff8a24], // 黑橙
 [0x10180f,0x43c96b], // 黑綠
 [0x17101d,0xa855f7], // 黑紫
 [0x0d1420,0x3f8cff], // 黑藍
 [0x8c8a9a,0xc6c4d6], // 灰銀
 [0xd92f3d,0xd92f3d], // 戰士・純紅
 [0xe67e22,0xe67e22], // 武道家・純橙
 [0x15351f,0x35d36a], // 法師・純綠
 [0xf2f2f2,0xf2f2f2], // 聖職者・純白
 [0x8e44ad,0x8e44ad]  // 盜賊・純紫
];
const HC_NAME=['黑紅','黑灰','黑紅亮','銀白','藍黑','黑橙','黑綠','黑紫','黑藍','灰銀','戰士・純紅','武道家・純橙','法師・純綠','聖職者・純白','盜賊・純紫'];
const GR={warrior:[0x15151c,0xb01c1c],priest:[0x161a26,0x7aa0e8],mage:[0x10231a,0x2a8a4a],rogue:[0x1a1226,0x7a3ac0],monk:[0x2a1410,0xd05a1a]};
const HS=['短髮・經典','中長髮・流浪','俐落短髮・戰士','長髮・優雅','狼尾髮・野性','斜分髮・瀟灑'];
// [髮長,頂部上翹,瀏海長,斜分方向,後髮型(1後層 4高馬尾 5狼尾),捲度,呆毛數,中分]
const HP=[[.24,.06,.26,0,0,0,1,0],[.4,0,.3,0,1,0,0,0],[.16,.3,.14,0,0,0,0,0],[.34,0,.2,0,4,0,0,1],[.32,.14,.28,0,5,0,2,0],[.26,.04,.36,1,0,0,0,0]];
/* 裝備外觀：等級決定階段，職業決定主色。每套裝備只使用黑色底＋同色系深／亮色，避免過多雜色。 */
const EQUIP_LEVEL_TIERS=[1,11,21,41,61,71,81,91];
const EQUIP_PAL={
 warrior:[0x111116,0x2a090d,0x6f111b,0x991724,0xb51f2b,0xd52b36,0xef4650,0xff6670],
 mage:[0x111513,0x0b2a1c,0x0f5534,0x167346,0x1e914f,0x31ae62,0x4bd879,0x73f09a],
 priest:[0x10131a,0x0c2442,0x123f70,0x185da0,0x2477c8,0x3b91e3,0x5aaaf5,0x82c5ff],
 monk:[0x17120e,0x3a1d0a,0x6a300b,0x91440e,0xb75a12,0xd8731b,0xf08b2d,0xffad4a],
 rogue:[0x141018,0x2b123e,0x4a1c68,0x64278d,0x7e31b0,0x9848ce,0xb263e8,0xcf82ff]
};
const equipVisualTier=it=>{const lv=Math.max(1,Number(it&&it.lv)||1);let t=0;for(let i=1;i<EQUIP_LEVEL_TIERS.length;i++)if(lv>=EQUIP_LEVEL_TIERS[i])t=i;return t};
const equipColors=(job,t)=>{const p=EQUIP_PAL[job]||EQUIP_PAL.warrior;const i=Math.max(0,Math.min(p.length-1,t|0));const a=p[i];const prev=p[Math.max(0,i-1)];return {base:0x101114,accent:a,shadow:prev,highlight:a};};
const PALB=[[0x2d514d,0x173a36,0x65a69f],[0x4d211b,0x2a100d,0x9a5144],[0x203f5d,0x10263a,0x6fa8d8],[0x47505c,0x252a31,0xa7b0bb],[0x5a2817,0x2d1209,0xc86a39],[0x452b66,0x211235,0xa878d6]];
const WKM={warrior:'sword',rogue:'dagger',mage:'mage',priest:'priest',monk:'fist'};
