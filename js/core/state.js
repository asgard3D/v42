/* 遊戲狀態與數值公式 */
function ITN(slot,t,d,cls){return Loot.itemName(slot,t,d,cls||S.cls)}
const tierOf=Loot.tierOf;
const S={cls:'warrior',hs:0,lv:1,exp:0,hp:70,mp:48,cd:0,skcd:0,dest:null,tm:null,atk:0,offline:null};
const maxHp=()=>Rules.maxHp(S),maxMp=()=>Rules.maxMp(S),nextExp=()=>Rules.nextExp(S.lv);
Object.assign(S,{eq:{weapon:null,armor:null,boots:null,ring:null,amulet:null},auto:false,inv:[],gold:0,pot:3,mpPot:3,ae:1,mode:'create',name:'冒險者',hc:0,buff:{atk:0,spd:0,def:0,hp:0,crit:0,eva:0},bp:{},bo:{},bfx:{},skcd:{},skl:{},books:{},sbar:Array(6).fill(null),autoHp:35,autoMp:30,autoLootTier:0,quick:Array(30).fill(null)});
let quickAssign=false,mpQuickAssign=false,quickTarget=-1;
