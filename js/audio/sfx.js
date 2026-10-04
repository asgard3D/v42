/* 音效（純 WebAudio 合成，不需任何音檔，離線也能用）
   - Sfx.skill(sk)：依技能的 fx 類型與技能資料（連擊數、範圍）播放；Sfx.ui(name)：學習／技能書／升級／閃避
   - 瀏覽器需要使用者操作後才能出聲：第一次點擊／按鍵時自動解鎖
   - 靜音與音量記在 localStorage('ainoSfx')；Sfx._use(ctx) 供測試改用 OfflineAudioContext */
const Sfx=(()=>{
 let ac=null,master=null,dest=null,nbuf=null,muted=false,vol=.55;const subs=[];
 try{const o=JSON.parse(localStorage.getItem('ainoSfx')||'{}');if(typeof o.m==='boolean')muted=o.m;if(Number.isFinite(o.v))vol=Math.max(0,Math.min(1,o.v))}catch(_){}
 const persist=()=>{try{localStorage.setItem('ainoSfx',JSON.stringify({m:muted,v:vol}))}catch(_){}},emit=()=>subs.forEach(f=>f({muted,vol}));
 function build(ctx){ac=ctx;master=ac.createGain();master.gain.value=muted?0:vol;const c=ac.createDynamicsCompressor();master.connect(c);c.connect(ac.destination);dest=master;
  nbuf=ac.createBuffer(1,ac.sampleRate*2,ac.sampleRate);const d=nbuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}
 function init(){if(ac)return ac;const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;try{build(new C())}catch(_){ac=null}return ac}
 const ready=()=>{if(muted)return false;const a=init();if(!a)return false;if(a.state==='suspended')a.resume().catch(()=>{});return a.state!=='closed'};
 /* 音高滑動的震盪器：f0→f1，dur 秒，音量 v，延遲 dl 秒 */
 function tone(f0,f1,dur,type,v,dl){dl=dl||0;const t=ac.currentTime+dl,o=ac.createOscillator(),g=ac.createGain();o.type=type||'sine';
  o.frequency.setValueAtTime(Math.max(20,f0),t);if(f1&&f1!==f0)o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+dur);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.001,v),t+Math.min(.015,dur/3));g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  o.connect(g);g.connect(dest);o.start(t);o.stop(t+dur+.05)}
 /* 濾波雜訊：風聲、爆炸、揮砍。ft=濾波類型，f0→f1 為濾波頻率掃動 */
 function nz(dur,v,ft,f0,f1,dl,q){dl=dl||0;const t=ac.currentTime+dl,s=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain();s.buffer=nbuf;s.loop=true;
  f.type=ft||'lowpass';f.Q.value=q||1;f.frequency.setValueAtTime(Math.max(20,f0),t);if(f1&&f1!==f0)f.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+dur);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.001,v),t+Math.min(.02,dur/3));g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  s.connect(f);f.connect(g);g.connect(dest);s.start(t,Math.random()*1.5);s.stop(t+dur+.05)}
 const boom=(dl,big)=>{nz(big?.7:.45,big?.9:.6,'lowpass',big?1400:900,70,dl);tone(big?110:90,38,big?.6:.35,'sine',big?.9:.6,dl)};
 const FX={
  smash:()=>{tone(170,45,.22,'sine',.8);nz(.16,.5,'lowpass',2200,300);tone(900,300,.06,'square',.12)},
  slash:()=>{nz(.2,.45,'highpass',1800,5200,0,2);nz(.14,.3,'bandpass',3000,900,.04,3);tone(1400,500,.1,'triangle',.12,.03)},
  multi:(sk)=>{const n=Math.min(6,sk.hits||1);for(let i=0;i<n;i++){const d=i*.15;nz(.1,.4,'highpass',2400,1200,d,2);tone(220-i*8,80,.1,'square',.2,d);tone(700,300,.05,'square',.1,d)}},
  dash:()=>{nz(.32,.5,'bandpass',500,4200,0,2);tone(180,700,.3,'sawtooth',.12);tone(120,40,.2,'sine',.5,.28);nz(.12,.4,'lowpass',1800,200,.28)},
  spin:()=>{for(let i=0;i<3;i++)nz(.2,.4,'bandpass',900+i*350,2800-i*300,i*.12,2.5);tone(300,900,.5,'triangle',.08)},
  shout:()=>{tone(110,170,.55,'sawtooth',.28);tone(165,255,.55,'sawtooth',.14);nz(.5,.25,'lowpass',900,300);for(let i=0;i<3;i++)tone(90,50,.18,'sine',.4,i*.16)},
  shield:()=>{tone(523,523,.55,'triangle',.22);tone(784,784,.5,'triangle',.16,.04);tone(1568,1500,.35,'sine',.1,.08);tone(2400,1800,.12,'square',.05);nz(.25,.18,'highpass',4000,6500)},
  swift:()=>{nz(.45,.4,'highpass',1200,6500,0,1.5);tone(500,1500,.35,'sine',.1)},
  cloud:()=>{nz(.7,.35,'lowpass',500,1600,0,.8);nz(.6,.18,'bandpass',2200,900,.1,4);tone(140,90,.5,'sine',.15)},
  proj:()=>{tone(900,260,.22,'sawtooth',.2);nz(.22,.25,'bandpass',2500,700,0,2);tone(120,45,.18,'sine',.45,.26);nz(.15,.3,'lowpass',1500,200,.26)},
  blast:()=>{tone(700,250,.2,'sawtooth',.14);nz(.2,.2,'bandpass',2200,800,0,2);boom(.2)},
  meteor:()=>{tone(1300,170,.45,'sawtooth',.16);nz(.45,.3,'bandpass',3500,500,0,3);boom(.45,1)},
  nova:()=>{[1568,2093,2637,3136,2349].forEach((f,i)=>tone(f,f*.9,.28,'sine',.14,i*.05));nz(.35,.3,'highpass',3500,8000,.02,1);tone(200,70,.3,'sine',.35,.02)},
  bolt:()=>{nz(.09,.9,'highpass',800,4000,0,.7);tone(2400,90,.18,'sawtooth',.28);boom(.02);nz(.07,.7,'highpass',1000,5000,.12);tone(60,35,.5,'sine',.5,.1)},
  storm:()=>{nz(.7,.5,'lowpass',1800,200,0,1);for(let i=0;i<5;i++){nz(.08,.4,'bandpass',900+i*200,300,i*.1,3);tone(110,50,.14,'sine',.35,i*.1)}tone(70,40,.7,'sawtooth',.14)},
  pillar:()=>{[523,659,784].forEach((f,i)=>{tone(f,f,.9,'sine',.18,i*.05);tone(f*2,f*2,.7,'triangle',.05,i*.05)});tone(1568,1568,.5,'sine',.07,.15);nz(.5,.12,'highpass',5000,7000,.05)},
  heal:()=>{[523,659,784,1046,1318].forEach((f,i)=>{tone(f,f,.26,'sine',.2,i*.07);tone(f*2,f*2,.18,'sine',.04,i*.07)})},
  bless:()=>{[784,988,1318].forEach((f,i)=>{tone(f,f,.7,'triangle',.14,i*.1);tone(f*1.5,f*1.5,.4,'sine',.05,i*.1)});nz(.6,.1,'highpass',6000,9000,.1)}
 };
 const UI={
  learn:()=>{tone(660,660,.12,'triangle',.22);tone(880,880,.12,'triangle',.22,.09);tone(1320,1320,.3,'triangle',.2,.18)},
  book:()=>{nz(.12,.3,'bandpass',3000,1500,0,1.5);nz(.12,.28,'bandpass',3200,1700,.1,1.5);tone(988,988,.18,'sine',.16,.14);tone(1480,1480,.3,'sine',.14,.2)},
  levelup:()=>{[523,659,784,1046].forEach((f,i)=>tone(f,f,.22,'square',.1,i*.1));tone(1046,1046,.6,'triangle',.2,.4);tone(1318,1318,.6,'triangle',.14,.4)},
  miss:()=>{nz(.14,.25,'bandpass',2500,900,0,2);tone(500,300,.1,'sine',.08)},
  buffend:()=>{tone(600,300,.15,'sine',.1)}
 };
 /* 各音效的音量校正（實測峰值後調整，讓不同技能聽起來響度接近；重大技能略大聲） */
 const GAIN={smash:1.7,slash:2.4,multi:.75,dash:.9,spin:4,shout:1.2,shield:2.3,swift:2.2,cloud:4.5,proj:1,blast:.8,meteor:.62,nova:1.4,bolt:.55,storm:1.25,pillar:1.2,heal:1.8,bless:1.8,
  learn:2,book:2.8,levelup:1.4,miss:4,buffend:2};
 const run=(name,fn,arg)=>{const g=ac.createGain();g.gain.value=GAIN[name]||1;g.connect(master);dest=g;try{fn(arg)}finally{dest=master}};
 const S={
  skill(sk){if(!sk||!ready())return;try{const n=FX[sk.fx]?sk.fx:'smash';run(n,FX[n],sk)}catch(_){}},
  ui(n){if(!ready())return;try{UI[n]&&run(n,UI[n])}catch(_){}},
  isMuted:()=>muted,volume:()=>vol,
  setMuted(m){muted=!!m;if(master)master.gain.value=muted?0:vol;persist();emit();if(!muted)S.ui('learn')},
  toggle(){S.setMuted(!muted)},
  setVolume(v){vol=Math.max(0,Math.min(1,Number(v)||0));if(master&&!muted)master.gain.value=vol;persist();emit()},
  onChange(f){subs.push(f)},
  types:()=>Object.keys(FX),
  _use(ctx){build(ctx)},_nodes:()=>!!ac
 };
 const unlock=()=>{if(!muted){const a=init();if(a&&a.state==='suspended')a.resume().catch(()=>{})}};
 if(typeof addEventListener==='function'){addEventListener('pointerdown',unlock,{passive:true});addEventListener('keydown',unlock,{passive:true})}
 return S})();
