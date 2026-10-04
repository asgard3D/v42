/* 職業基本資料（純資料）。技能樹資料在 data/skills.js */
const CL={
 warrior:{n:'戰士',c:0xa01818,g:0xff4455,w:'sword',range:1.8,cd:.8,d:[8,12]},
 priest:{n:'聖職者',c:0xe8ecff,g:0x4a8cff,w:'staff',range:6.5,cd:1,d:[5,8],heal:2,ranged:1},
 mage:{n:'法師',c:0x1c6b3c,g:0x33ff99,w:'staff',range:6.5,cd:1.1,d:[10,14],ranged:1},
 rogue:{n:'盜賊',c:0x5a2a90,g:0xc070ff,w:'dagger',range:1.7,cd:.5,d:[5,8]},
 monk:{n:'武道家',c:0xc04e18,g:0xffb830,w:'fist',range:1.7,cd:.6,d:[6,9]}};
const DESC={warrior:'近戰重裝。衝鋒、重擊、新月斬等斧劍技，並有防禦、閃躲、咆嘯等強化。',priest:'遠程輔助。多段治療與護盾、增益，以及驅邪／結界系列聖光範圍技。',mage:'遠程爆發。火、風、水、地四系魔法，後期有隕石、毀滅電擊、寒凍冰霜。血量低，保持距離。',rogue:'高速近戰。突刺連擊、各式炸彈、步伐加速與隱身閃避。',monk:'連擊近戰。拳腳連擊、氣功波、鬥氣強化，被動提升 HP 與閃避。'};
