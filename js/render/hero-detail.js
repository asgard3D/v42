/* 主角重新染色＋細節紋理（程式生成，不需貼圖檔、不參考圖像顏色）
 * 為什麼：原本角色顏色來自參考圖投影的頂點色／低解析貼圖，又糊又灰又偏亮。
 * 作法（fragment shader）：
 *   1) 只用原本的顏色「判斷這裡是什麼材質」（深色皮革／主色布料／金屬／白色／皮膚／眼睛），用陡峭的門檻讓糊掉的邊界變銳利；
 *   2) 每種材質改用「職業指定的實色」重新上色（暗／中／亮三段色階），不是在原色上疊色調；
 *   3) 紋理的深淺直接在三段色階裡取色（布料織紋、金屬拉絲、皮革細紋、髮絲），所以紋理本身就有自己的顏色；
 *   4) 原圖的亮度只保留一小部分（當作皺褶／陰影的暗示），避免整體泛白。
 * 職業配色：戰士 黑紅金／盜賊 黑紫金／聖職者 黑白藍金。
 * 紋理座標＝模型靜止姿勢的頂點座標，所以貼在身上、跟著骨架動；過細的紋理依螢幕像素大小淡出，遠看不閃爍。
 * 數值皆為「受光前的反照率」：遊戲場景光（半球光 .9＋太陽 .8）約把顏色放大 1.2～1.5 倍，所以配色刻意偏深。
 * 用法：HeroDetail.apply(material, 職業key) 由 hero-model.js 的 decode() 呼叫；HeroDetail.set(強度) 即時調整（0＝只換色不加紋理）。
 * GLSL 字串（FN）與 THREE 無關，tools 的預覽頁直接共用。 */
const HeroDetail=(()=>{
 /* ---------- 各職業配色 ----------
  * dk/mn/gd/wh：深色(皮革、深色布)／主色布料／金屬／白色，各為 [暗,中,亮] 三段色階
  * skin 皮膚；eye 眼睛（含戰士髮間紅絲）；hairBase/hairAcc/hairK 髮色底色／亮絲色／亮絲比例
  * mainHue/mainHueW/mainSat 主色的色相中心、半寬、最低飽和度（用來從糊掉的原色判斷「這裡是主色布料」）
  * mainRef/goldRef 原圖該材質的典型亮度（用來算明暗比）；headY 頭部起點高度；emis 自發光（越低越不泛白） */
 const PROF={
  warrior:{
   dk:[[.006,.004,.008],[.018,.006,.010],[.055,.010,.018]],
   mn:[[.190,.004,.010],[.620,.006,.022],[.980,.018,.055]],
   gd:[[.260,.075,.004],[.600,.260,.015],[1.000,.720,.060]],
   wh:[[.620,.640,.690],[.930,.950,.990],[1.000,1.000,1.000]],
   skin:[.88,.66,.55],eye:[1.00,.025,.035],hairBase:[.012,.008,.012],hairAcc:[1.00,.015,.035],hairK:.82,
   mainHue:.985,mainHueW:.090,mainSat:.38,mainLum:.07,mainRef:.27,goldRef:.40,goldSat:.26,eyeSat:.44,skinBody:0,headY:1.34,emis:0x160207,amt:1.05},
  rogue:{
   dk:[[.006,.003,.014],[.014,.006,.030],[.045,.018,.085]],
   mn:[[.105,.004,.255],[.390,.012,.690],[.880,.045,1.000]],
   gd:[[.250,.070,.004],[.590,.255,.015],[1.000,.700,.055]],
   wh:[[.560,.560,.640],[.900,.910,.980],[1.000,1.000,1.000]],
   skin:[.88,.66,.55],eye:[1.00,.025,.10],hairBase:[.010,.006,.018],hairAcc:[.62,.08,1.00],hairK:.80,
   mainHue:.765,mainHueW:.095,mainSat:.32,mainLum:.08,mainRef:.25,goldRef:.40,goldSat:.25,eyeSat:.45,skinBody:1,headY:1.44,emis:0x10051c,amt:1.05},
  mage:{
   dk:[[.010,.020,.012],[.025,.055,.030],[.070,.130,.070]],
   mn:[[.012,.090,.028],[.025,.360,.095],[.060,.920,.220]],
   gd:[[.260,.075,.004],[.610,.270,.012],[1.000,.760,.070]],
   wh:[[.650,.640,.570],[.940,.920,.820],[1.000,1.000,.940]],
   skin:[.92,.70,.58],eye:[.12,1.00,.18],hairBase:[.035,.025,.018],hairAcc:[.10,.78,.25],hairK:.66,
   mainHue:.385,mainHueW:.115,mainSat:.24,mainLum:.055,mainRef:.25,goldRef:.40,goldSat:.26,eyeSat:.38,skinBody:0,headY:1.50,emis:0x06240c,amt:1.06},
  monk:{
   dk:[[.006,.004,.006],[.018,.006,.010],[.050,.014,.022]],
   mn:[[.160,.004,.008],[.620,.010,.022],[.980,.028,.070]],
   gd:[[.260,.060,.003],[.650,.260,.010],[1.000,.680,.045]],
   wh:[[.500,.500,.540],[.860,.850,.820],[1.000,.980,.930]],
   skin:[.90,.68,.57],eye:[1.00,.025,.035],hairBase:[.012,.008,.010],hairAcc:[1.00,.018,.035],hairK:.84,
   mainHue:.985,mainHueW:.095,mainSat:.30,mainLum:.055,mainRef:.24,goldRef:.39,goldSat:.25,eyeSat:.43,skinBody:0,headY:1.43,emis:0x160207,amt:1.02},
  priest:{
   dk:[[.006,.008,.016],[.012,.022,.045],[.045,.065,.130]],
   mn:[[.015,.070,.300],[.025,.220,.720],[.070,.500,1.000]],
   gd:[[.260,.085,.004],[.610,.280,.015],[1.000,.730,.065]],
   wh:[[.680,.700,.780],[.960,.970,1.000],[1.000,1.000,1.000]],
   skin:[.88,.66,.55],eye:[.95,.035,.12],hairBase:[.010,.008,.018],hairAcc:[.08,.32,1.00],hairK:.78,
   mainHue:.640,mainHueW:.100,mainSat:.16,mainLum:.08,mainRef:.28,goldRef:.40,goldSat:.26,eyeSat:.45,skinBody:0,headY:1.44,emis:0x071226,amt:1.05}
 };
 const NAMES=['dk','mn','gd','wh'],ID={dk:'Dk',mn:'Mn',gd:'Gd',wh:'Wh'};
 const VARY='varying vec3 vHdP;varying vec3 vHdN;\n';
 /* 一個職業的 uniform 表：名稱 → 數字或 3 元陣列（apply 與預覽頁共用） */
 function uniforms(P,amount,k){
  const U={};
  NAMES.forEach(n=>['Lo','Mid','Hi'].forEach((s,i)=>{U['u'+ID[n]+s]=P[n][i]}));
  U.uSkin=P.skin;U.uEye=P.eye;U.uHairBase=P.hairBase;U.uHairAcc=P.hairAcc;U.uHairK=P.hairK;
  U.uMage=(k==='mage'?1:0);U.uMonk=(k==='monk'?1:0);U.uMainHue=P.mainHue;U.uMainHueW=P.mainHueW;U.uMainSat=P.mainSat;U.uMainRef=P.mainRef;U.uGoldRef=P.goldRef;U.uHeadY=P.headY;U.uMainLum=P.mainLum;U.uGoldSat=P.goldSat;U.uEyeSat=P.eyeSat;U.uSkinBody=P.skinBody;
  U.uAmt=(amount==null?1:amount)*P.amt;return U;
 }
 const DECL=(()=>{let s='';NAMES.forEach(n=>['Lo','Mid','Hi'].forEach(x=>{s+='uniform vec3 u'+ID[n]+x+';\n'}));
  return s+'uniform vec3 uSkin;uniform vec3 uEye;uniform vec3 uHairBase;uniform vec3 uHairAcc;uniform float uHairK;\n'+
  'uniform float uMage;uniform float uMonk;uniform float uMainHue;uniform float uMainHueW;uniform float uMainSat;uniform float uMainRef;uniform float uGoldRef;uniform float uHeadY;uniform float uAmt;uniform float uMainLum;uniform float uGoldSat;uniform float uEyeSat;uniform float uSkinBody;\n'})();
 const FN=DECL+`
float hdH(vec3 p){p=fract(p*0.3183099+vec3(.1,.2,.3));p*=17.0;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float hdN(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.0-2.0*f);
 return mix(mix(mix(hdH(i),hdH(i+vec3(1,0,0)),f.x),mix(hdH(i+vec3(0,1,0)),hdH(i+vec3(1,1,0)),f.x),f.y),
            mix(mix(hdH(i+vec3(0,0,1)),hdH(i+vec3(1,0,1)),f.x),mix(hdH(i+vec3(0,1,1)),hdH(i+vec3(1,1,1)),f.x),f.y),f.z)*2.0-1.0;}
float hdFade(float freq,float fp){return 1.0-smoothstep(0.30,0.85,fp*freq);}
float hdTwill(vec2 q,float f){vec2 a=q*f;return 0.65*sin(6.2832*(a.x+a.y))+0.35*sin(6.2832*a.x)*sin(6.2832*a.y);}
float hdWeave(vec3 p,vec3 w,float f){return w.x*hdTwill(p.yz,f)+w.y*hdTwill(p.xz,f)+w.z*hdTwill(p.xy,f);}
/* 三段色階取色：t=0 暗、0.5 中、1 亮 */
vec3 hdRamp(vec3 lo,vec3 mid,vec3 hi,float t){return t<0.5?mix(lo,mid,t*2.0):mix(mid,hi,t*2.0-1.0);}
float hdT(float v,float lumRel,float lg){float src=clamp((lumRel-1.0)*0.22,-0.18,0.18);return clamp(0.52+v*0.34+src,0.12,0.98);}
vec3 hdMage(vec3 c,vec3 p,vec3 nn){
 // 法師 FBX 沒有 Material/Texture，因此不再把參考圖的白平衡當成材質。
 // 直接以幾何區域＋固定高飽和色階重建：綠袍、深綠內層、金飾、肉色、翠綠眼睛。
 float head=smoothstep(1.34,1.40,p.y);
 float front=smoothstep(.10,.34,nn.z)*smoothstep(.04,.18,p.z);
 float faceY=smoothstep(1.43,1.50,p.y)*(1.0-smoothstep(1.70,1.80,p.y));
 float faceX=1.0-smoothstep(.20,.30,abs(p.x));
 float face=clamp(head*front*faceY*faceX,0.0,1.0);
 float eyeX=1.0-smoothstep(.045,.075,abs(abs(p.x)-.078));
 float eyeY=1.0-smoothstep(.014,.030,abs(p.y-1.595));
 float eye=clamp(face*eyeX*eyeY*smoothstep(.14,.28,p.z),0.0,1.0);
 float hair=max(0.0,head-face);
 float low=smoothstep(.00,.24,.30-p.y);
 float white=smoothstep(.72,.88,dot(c,vec3(.299,.587,.114)))
            *(1.0-smoothstep(.10,.20,max(c.r,c.g)-min(c.r,min(c.g,c.b))))
            *(low+.20*smoothstep(.62,.82,p.y));
 float gold=smoothstep(.035,.075,c.r-c.b)*smoothstep(.18,.32,c.g-c.b)
            *smoothstep(.10,.24,dot(c,vec3(.299,.587,.114)));
 float body=(1.0-head)*(1.0-white);
 vec3 green=mix(vec3(.018,.105,.045),vec3(.035,.38,.105),smoothstep(.18,.62,p.y));
 green=mix(green,vec3(.075,.72,.22),smoothstep(.50,.90,abs(nn.z))*.22);
 vec3 dark=vec3(.012,.028,.018);
 vec3 hairCol=mix(vec3(.018,.012,.015),vec3(.075,.035,.025),smoothstep(.15,.80,p.y));
 vec3 goldCol=mix(vec3(.34,.16,.025),vec3(1.0,.62,.08),smoothstep(.25,.75,p.y));
 vec3 skin=mix(vec3(.55,.25,.18),vec3(.98,.66,.50),smoothstep(.25,.75,p.z));
 vec3 outc=body*(mix(dark,green,smoothstep(.16,.55,dot(c,vec3(.299,.587,.114)))));
 outc=mix(outc,goldCol,gold*(1.0-body*.35));
 outc=mix(outc,vec3(.86,.90,.96),white*.82);
 outc=mix(outc,hairCol,hair);
 outc=mix(outc,skin,face*(1.0-eye));
 outc=mix(outc,vec3(.12,1.0,.24),eye);
 return clamp(outc,0.0,1.0);
}

vec3 hdApply(vec3 c,vec3 p,vec3 nn){
 if(uMainHue>.30 && uMainHue<.46) return hdMage(c,p,nn);
 if(uMonk>.5){
  // V6：武道家顏色已在建模時依語意烘進頂點色（髮／臉／眼／護肩／護腕／繃帶／手／鞋），不再用高度位置遮罩（舊版 hands 遮罩會把腰到下襬整片塗白，手臂因此看不見）
  return clamp(c,0.0,1.0);
 }
 float amt=uAmt;
 float fp=length(fwidth(p))+1e-6;
 vec3 w3=pow(abs(nn),vec3(4.0));w3/=(w3.x+w3.y+w3.z+1e-5);
 float mx=max(c.r,max(c.g,c.b)),mn=min(c.r,min(c.g,c.b)),d=max(mx-mn,1e-4);
 float lum=dot(c,vec3(.299,.587,.114)),sat=d/max(mx,1e-3);
 float hue=(mx==c.r)?mod((c.g-c.b)/d,6.0):((mx==c.g)?(c.b-c.r)/d+2.0:(c.r-c.g)/d+4.0);hue=fract(hue/6.0);
 float h2=hue>0.5?hue-1.0:hue;                       // 紅色附近連續：約 -0.05..0.05
 float head=smoothstep(uHeadY-0.02,uHeadY+0.02,p.y);
 /* ---- 1) 材質判斷：法師 FBX 的原頂點色不足以可靠分辨臉／衣服，加入幾何遮罩 ---- */
 float skinS=max(head,uSkinBody)*smoothstep(.010,.030,h2)*(1.0-smoothstep(.095,.125,h2))*smoothstep(.09,.15,sat)*(1.0-smoothstep(.42,.48,sat))*smoothstep(.46,.54,lum);
 float eyeS=head*(1.0-smoothstep(.02,.05,h2))*smoothstep(-.07,-.04,h2)*smoothstep(uEyeSat-.05,uEyeSat+.03,sat)*smoothstep(.10,.16,lum)*(1.0-smoothstep(.70,.80,lum));
 float goldS=(1.0-head)*smoothstep(.040,.060,hue)*(1.0-smoothstep(.17,.20,hue))*smoothstep(uGoldSat-.04,uGoldSat+.02,sat)*smoothstep(.20,.27,lum)*(1.0-skinS);
 float hd=abs(fract(hue-uMainHue+.5)-.5);
 float mainS=(1.0-head)*(1.0-smoothstep(uMainHueW,uMainHueW+.03,hd))*smoothstep(uMainSat-.04,uMainSat+.03,sat)*smoothstep(uMainLum-.03,uMainLum+.02,lum)*(1.0-goldS);
 float whiteS=(1.0-head)*(1.0-smoothstep(.15,.22,sat))*smoothstep(.56,.64,lum)*(1.0-mainS);
 if(uMonk>.5) whiteS*=smoothstep(.30,.42,p.y);
 /* 法師專用：正面臉部固定肉色、眼睛固定翠綠；身體非白／非金區強制使用鮮綠主色，避免 FBX 原灰色把整套衣服洗灰。 */
 float mFront=smoothstep(.18,.55,nn.z);
 float mFaceY=smoothstep(1.315,1.355,p.y)*(1.0-smoothstep(1.455,1.485,p.y));
 float mFaceZ=smoothstep(.035,.105,p.z);
 float mFace=mFront*mFaceY*mFaceZ*uMage;
 float mEyeX=(1.0-smoothstep(.055,.105,abs(abs(p.x)-.065)));
 float mEyeY=(1.0-smoothstep(.012,.032,abs(p.y-1.405)));
 float mEye=mFront*mFaceZ*mEyeX*mEyeY*uMage;
 skinS=max(skinS,mFace*(1.0-mEye));
 eyeS=max(eyeS,mEye);
 mainS=max(mainS,uMage*(1.0-head)*.82*(1.0-whiteS)*(1.0-goldS));
 mainS=max(mainS,uMonk*(1.0-head)*.72*(1.0-whiteS)*(1.0-goldS));
 float sum=skinS+eyeS+goldS+mainS+whiteS;
 float darkS=max(0.0,1.0-sum);
 vec4 wa=vec4(mainS,goldS,whiteS,darkS),wb=vec4(skinS,eyeS,0.,0.);
 wa=wa*wa;wb=wb*wb;float tot=dot(wa,vec4(1.0))+wb.x+wb.y+1e-5;wa/=tot;wb/=tot;
 float wMain=wa.x,wGold=wa.y,wWhite=wa.z,wDark=wa.w,wSkin=wb.x,wEye=wb.y;
 /* ---- 2) 各材質用自己的色階＋花紋取色 ---- */
 vec3 o=vec3(0.0);
 // 主色布料：斜紋織紋＋縱向皺褶＋下襬放射細褶
 if(wMain>0.01){
  float wv=hdWeave(p,w3,95.0)*hdFade(95.0,fp)*0.55+hdWeave(p,w3,38.0)*hdFade(38.0,fp)*0.45;
  float fold=hdN(p*vec3(22.0,3.2,22.0))*0.6+hdN(p*vec3(52.0,6.0,52.0))*0.4*hdFade(52.0,fp);
  float pl=sin(atan(p.x,p.z-0.05)*34.0+hdN(p*vec3(5.0,2.0,5.0))*2.2)*smoothstep(1.05,0.75,p.y);
  float v=(wv*0.12+fold*0.18+pl*0.12)*amt;
  float t=hdT(v,clamp(lum/uMainRef,.55,1.5),.55);
  o+=wMain*hdRamp(uMnLo,uMnMid,uMnHi,t);
 }
 // 金屬：縱向拉絲＋亮點；亮端淡金、暗端古銅
 if(wGold>0.01){
  float br=hdN(p*vec3(210.0,16.0,210.0))*hdFade(210.0,fp)*0.6+hdN(p*vec3(70.0,9.0,70.0))*0.4;
  float sp=step(.985,hdH(floor(p*120.0)))*hdFade(120.0,fp);
  float v=(br*0.30+sp*0.55)*amt;
  float t=hdT(v,clamp(lum/uGoldRef,.55,1.5),.6);
  o+=wGold*hdRamp(uGdLo,uGdMid,uGdHi,t);
 }
 // 白色：細亞麻紋
 if(wWhite>0.01){
  float wv=hdWeave(p,w3,80.0)*hdFade(80.0,fp)*0.5+hdN(p*vec3(26.0,10.0,26.0))*0.5;
  float t=hdT(wv*0.28*amt,clamp(lum/.85,.6,1.1),.9);
  o+=wWhite*hdRamp(uWhLo,uWhMid,uWhHi,t);
 }
 // 深色：身體＝皮革／深色布細紋；頭部＝頭髮（細髮絲＋髮束，亮絲取職業亮絲色）
 if(wDark>0.01){
  float bodyW=1.0-head;
  vec3 dcol=vec3(0.0);
  if(bodyW>0.01){
   float wv=hdWeave(p,w3,70.0)*hdFade(70.0,fp);
   float lt=hdN(p*vec3(34.0,8.0,34.0))*0.65+hdN(p*vec3(120.0,14.0,120.0))*0.35*hdFade(120.0,fp);
   float t=hdT((wv*0.28+lt*0.35)*amt,clamp(lum/.12,.5,1.6),.35);
   dcol+=bodyW*hdRamp(uDkLo,uDkMid,uDkHi,t);
  }
  if(head>0.01){
   float st=hdN(p*vec3(260.0,26.0,260.0))*hdFade(260.0,fp)*0.5+hdN(p*vec3(120.0,16.0,120.0))*hdFade(120.0,fp)*0.5;
   float cl=hdN(p*vec3(34.0,7.0,34.0));
   float v=(st*0.35+cl*0.30);
   float hi=smoothstep(.20,.80,v+(lum-.18)*1.2);
   vec3 hr=mix(uHairBase*(0.75+0.5*clamp(lum/.15,0.,2.)),uHairAcc,hi*uHairK*min(amt,1.5));
   dcol+=head*hr;
  }
  o+=wDark*dcol;
 }
 o+=wSkin*uSkin*clamp(lum/.72,.82,1.10);
 o+=wEye*uEye*clamp(lum/.40,.80,1.35);
 return o;
}
`;
 const api={amount:1,PROF,FN,VARY,uniforms,mats:[],
  has(k){return !!PROF[k]},
  emis(k){return PROF[k]?PROF[k].emis:0},
  apply(mat,k){
   const P=PROF[k];if(!P||typeof THREE==='undefined')return mat;
   const raw=uniforms(P,api.amount,k),U={};
   Object.keys(raw).forEach(n=>{const v=raw[n];U[n]={value:Array.isArray(v)?new THREE.Vector3(v[0],v[1],v[2]):v}});
   mat.extensions=Object.assign(mat.extensions||{},{derivatives:true});
   mat.onBeforeCompile=sh=>{
    Object.assign(sh.uniforms,U);
    sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\n'+VARY)
     .replace('#include <begin_vertex>','#include <begin_vertex>\n vHdP=position; vHdN=normal;');
    sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\n'+VARY+FN)
     .replace('#include <color_fragment>','#include <color_fragment>\n diffuseColor.rgb=hdApply(diffuseColor.rgb,vHdP,normalize(vHdN));');
   };
   mat.customProgramCacheKey=()=>'hd2';
   U.k={value:P.amt};(mat.userData=mat.userData||{}).hd=U;api.mats.push(U);
   return mat;
  },
  /* 即時調整紋理強度（0＝只換色不加紋理，1＝預設，可到 2）。主控台：HeroDetail.set(1.5) */
  set(a){api.amount=Math.max(0,a);api.mats.forEach(U=>{U.uAmt.value=api.amount*U.k.value})}
 };
 return api;
})();