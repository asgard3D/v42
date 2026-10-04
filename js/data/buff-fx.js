/* 增益外觀（純資料）：每個增益技能在主角身上的持續視覺效果。
   key = 技能 id（需有 buf 欄位）。
   col 主色｜col2 副色
   circle {t 魔法陣圖樣, r 半徑, spd 旋轉速度(負=逆時針)}  —— 腳下持續魔法陣
   glow   身體發光強度 0~1（會與其他增益的光色疊加）
   dome   {t:'hex'|'ring', r}  —— 包住角色的護罩（防禦類）
   col    emblem {t 紋章圖樣, ch 文字(t=text 時)}  —— 頭頂紋章
   ptc    {t 粒子動作 rise|orbit|swirl|fall|spark|smoke|bubble, n 數量, sp 速度}
   alpha  角色透明度（隱身）｜pillar 光柱強度｜pulse 發光閃動速度 */
const BUFF_FX={
 /* ---- 戰士 ---- */
 w_shield:{col:0x7ab8ff,col2:0xdff0ff,circle:{t:'shield',r:1.5,spd:.35},glow:.30,dome:{t:'hex',r:1.2},emblem:{t:'shield'},ptc:{t:'orbit',n:10,sp:1.2}},
 w_roar:{col:0xff5a44,col2:0xffc070,circle:{t:'rune',r:1.6,spd:.5},glow:.38,emblem:{t:'heart'},ptc:{t:'rise',n:16,sp:1.4},pillar:.25},
 w_berserk:{col:0xff2a2a,col2:0xffa040,circle:{t:'pent',r:1.7,spd:-1.6},glow:.6,pulse:9,emblem:{t:'swords'},ptc:{t:'rise',n:26,sp:2.6},pillar:.4},
 w_iron:{col:0xb0b8c8,col2:0xffffff,circle:{t:'fortress',r:1.6,spd:.2},glow:.35,dome:{t:'hex',r:1.3},emblem:{t:'tower'},ptc:{t:'spark',n:12,sp:1}},
 /* ---- 盜賊 ---- */
 r_hide:{col:0x9a8aff,col2:0x6a4ad0,circle:{t:'crescent',r:1.45,spd:-.5},glow:.15,alpha:.42,emblem:{t:'eye'},ptc:{t:'smoke',n:14,sp:.6}},
 r_breeze:{col:0xaef6ff,col2:0xe6fffb,circle:{t:'wind',r:1.4,spd:1.2},glow:.2,emblem:{t:'wing'},ptc:{t:'swirl',n:14,sp:1.6}},
 r_poison:{col:0x7ad43a,col2:0xb050e0,circle:{t:'poison',r:1.45,spd:.45},glow:.3,emblem:{t:'drop'},ptc:{t:'bubble',n:16,sp:1}},
 r_wind:{col:0xd8fbff,col2:0x70e0ff,circle:{t:'wind',r:1.75,spd:-2},glow:.35,emblem:{t:'wings'},ptc:{t:'swirl',n:24,sp:2.6},pillar:.2},
 /* ---- 祭司 ---- */
 p_shield:{col:0x9ad0ff,col2:0xffffff,circle:{t:'holycross',r:1.5,spd:.3},glow:.3,dome:{t:'ring',r:1.2},emblem:{t:'shieldcross'},ptc:{t:'orbit',n:10,sp:1}},
 p_guard:{col:0xffe9a0,col2:0xffffff,circle:{t:'sun',r:1.65,spd:.35},glow:.4,dome:{t:'hex',r:1.28},emblem:{t:'ankh'},ptc:{t:'fall',n:16,sp:1}},
 p_rescue:{col:0x7dffa8,col2:0xffe9a0,circle:{t:'life',r:1.55,spd:.4},glow:.35,emblem:{t:'heartplus'},ptc:{t:'rise',n:16,sp:.9},pillar:.2},
 p_hand:{col:0xffe27a,col2:0xffffff,circle:{t:'star',r:1.55,spd:-.7},glow:.5,pulse:5,emblem:{t:'crit'},ptc:{t:'spark',n:20,sp:1.6}},
 p_revelation:{col:0xffffff,col2:0xffd870,circle:{t:'halo',r:1.95,spd:.3},glow:.7,emblem:{t:'crown'},ptc:{t:'fall',n:30,sp:1.3},pillar:.55},
 /* ---- 武道家 ---- */
 k_iron:{col:0xffd45a,col2:0xb8742a,circle:{t:'bagua',r:1.55,spd:.3},glow:.4,dome:{t:'ring',r:1.15},emblem:{t:'text',ch:'鐵'},ptc:{t:'spark',n:12,sp:1}},
 k_rampage:{col:0xff7a2a,col2:0xffd070,circle:{t:'flame',r:1.75,spd:-1.4},glow:.55,pulse:7,emblem:{t:'text',ch:'暴'},ptc:{t:'rise',n:26,sp:2.8},pillar:.35}
};
