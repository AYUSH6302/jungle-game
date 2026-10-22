const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const coinsEl = document.getElementById("coins");
const speedEl = document.getElementById("speed");
const bestEl = document.getElementById("bestScore");
const startOverlay = document.getElementById("startOverlay");
const gameOverOverlay = document.getElementById("gameOverOverlay");
const toast = document.getElementById("toast");

let running = false;
let lastTime = 0;
let elapsed = 0;
let score = 0;
let coins = 0;
let speed = 1;
let distance = 0;
let spawnTimer = 0;
let objects = [];
let particles = [];
let best = Number(localStorage.getItem("jungleDashBest") || 0);
bestEl.textContent = best;

const player = { lane: 0, xLane: 0, jump: 0, jumpV: 0, slide: 0, hitFlash: 0 };
const lanes = [-1, 0, 1];
const W = canvas.width, H = canvas.height;

function resetGame() {
  elapsed = 0; score = 0; coins = 0; speed = 1; distance = 0;
  spawnTimer = 0.6; objects = []; particles = [];
  player.lane = 0; player.xLane = 0; player.jump = 0; player.jumpV = 0; player.slide = 0; player.hitFlash = 0;
  updateHud();
}
function startGame() {
  resetGame(); running = true;
  startOverlay.classList.add("hidden"); gameOverOverlay.classList.add("hidden");
  lastTime = performance.now();
}
function endGame() {
  running = false;
  const finalScore = Math.floor(score);
  if (finalScore > best) { best = finalScore; localStorage.setItem("jungleDashBest", best); bestEl.textContent = best; }
  document.getElementById("finalScore").textContent = finalScore.toLocaleString();
  document.getElementById("finalCoins").textContent = coins;
  gameOverOverlay.classList.remove("hidden");
}
document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("restartBtn").addEventListener("click", startGame);

function move(dir) { if (running) player.lane = Math.max(-1, Math.min(1, player.lane + dir)); }
function jump() { if (running && player.jump <= 0 && player.slide <= 0) player.jumpV = 690; }
function slide() { if (running && player.jump <= 0) player.slide = 0.65; }
document.addEventListener("keydown", e => {
  if (["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"," "].includes(e.key)) e.preventDefault();
  if (!running && (e.key === "Enter" || e.key === " ")) { startGame(); return; }
  if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") move(-1);
  if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") move(1);
  if (e.key === "ArrowUp" || e.key === "w" || e.key === " ") jump();
  if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") slide();
});
let touchStart = null;
canvas.addEventListener("touchstart", e => { const t=e.changedTouches[0]; touchStart={x:t.clientX,y:t.clientY}; }, {passive:true});
canvas.addEventListener("touchend", e => {
  if (!touchStart) return;
  const t=e.changedTouches[0], dx=t.clientX-touchStart.x, dy=t.clientY-touchStart.y;
  if (Math.max(Math.abs(dx),Math.abs(dy)) > 22) {
    if (Math.abs(dx)>Math.abs(dy)) move(dx>0?1:-1); else if (dy<0) jump(); else slide();
  }
  touchStart=null;
}, {passive:true});

function spawnObject() {
  const lane = lanes[Math.floor(Math.random()*3)];
  const r = Math.random();
  let type = r < 0.52 ? "coin" : r < 0.75 ? "rock" : r < 0.9 ? "gate" : "log";
  // Keep the game fair: a small share of spawns are coins, obstacles are spaced.
  objects.push({lane, z: 0.02, type, taken:false});
  if (Math.random() < 0.28) {
    const other = lanes.filter(n => n !== lane)[Math.floor(Math.random()*2)];
    objects.push({lane:other,z:0.02,type:"coin",taken:false});
  }
}
function updateHud() {
  scoreEl.textContent = String(Math.floor(score)).padStart(5,"0");
  coinsEl.textContent = coins;
  speedEl.textContent = speed.toFixed(1)+"×";
}
function project(lane, z) {
  const horizonY = H*0.27, bottomY = H*0.94;
  const depth = Math.max(0, Math.min(1, z));
  const y = horizonY + Math.pow(depth, 1.55)*(bottomY-horizonY);
  const roadTop = W*0.13, roadBottom = W*0.48;
  const roadHalf = roadTop + (roadBottom-roadTop)*depth;
  const center = W/2 + lane*roadHalf*0.58;
  const scale = 0.18 + depth*1.28;
  return {x:center,y,scale,roadHalf};
}
function update(dt) {
  elapsed += dt; speed = Math.min(2.65, 1 + elapsed/38);
  score += dt * 12 * speed;
  distance += dt * speed;
  player.xLane += (player.lane-player.xLane)*Math.min(1,dt*12);
  if (player.jumpV !== 0 || player.jump > 0) {
    player.jump += player.jumpV*dt;
    player.jumpV -= 1750*dt;
    if (player.jump <= 0) { player.jump=0; player.jumpV=0; }
  }
  if (player.slide > 0) player.slide = Math.max(0,player.slide-dt);
  if (player.hitFlash > 0) player.hitFlash -= dt;
  spawnTimer -= dt;
  if (spawnTimer <= 0) { spawnObject(); spawnTimer = Math.max(0.48, 1.05/speed) + Math.random()*0.42; }
  for (const o of objects) {
    o.z += dt*0.34*speed;
    if (!o.taken && o.z > 0.83 && o.z < 0.96 && o.lane === Math.round(player.xLane)) {
      if (o.type === "coin") {
        o.taken = true; coins++; score += 30;
        toast.classList.remove("hidden"); toast.style.top = "28%";
        setTimeout(()=>toast.classList.add("hidden"), 450);
      } else if (o.z > 0.88) {
        const cleared = (o.type === "rock" && player.jump > 48) || (o.type === "gate" && player.slide > 0.1);
        if (!cleared) { endGame(); return; }
        o.taken = true;
      }
    }
  }
  objects = objects.filter(o => o.z < 1.12 && !o.taken);
  updateHud();
}

function polygon(points, fill, stroke=null, lineWidth=1) {
  ctx.beginPath(); ctx.moveTo(points[0][0],points[0][1]);
  for(let i=1;i<points.length;i++) ctx.lineTo(points[i][0],points[i][1]);
  ctx.closePath(); ctx.fillStyle=fill; ctx.fill();
  if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lineWidth;ctx.stroke();}
}
function drawBackground() {
  const sky = ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,"#163b2a"); sky.addColorStop(.44,"#527b42"); sky.addColorStop(1,"#152c1c");
  ctx.fillStyle=sky; ctx.fillRect(0,0,W,H);
  // distant jungle silhouettes
  for(let i=0;i<18;i++){
    const x=i*58-18, h=60+(i*37%70);
    ctx.fillStyle=i%2?"#214b30":"#1a4029";
    ctx.beginPath();ctx.moveTo(x,H*.32);ctx.lineTo(x+28,H*.32-h);ctx.lineTo(x+55,H*.32);ctx.fill();
  }
  // warm opening in the canopy
  const glow=ctx.createRadialGradient(W/2,H*.28,10,W/2,H*.28,260);
  glow.addColorStop(0,"#d7d98a55");glow.addColorStop(1,"#d7d98a00");
  ctx.fillStyle=glow;ctx.fillRect(0,0,W,H*.7);
  // road
  polygon([[W*.39,H*.27],[W*.61,H*.27],[W*.98,H],[W*.02,H]],"#554a32");
  polygon([[W*.405,H*.27],[W*.414,H*.27],[W*.15,H],"#b1a16a"]);
  polygon([[W*.586,H*.27],[W*.595,H*.27],[W*.85,H]],"#b1a16a");
  // lane dividers, moving dashed segments
  ctx.strokeStyle="#d5c99b88";ctx.lineWidth=2;
  for(let lane=1;lane<=2;lane++){
    const topX=W*.39+W*.22*(lane/3), botX=W*(lane/3);
    for(let i=0;i<9;i++){
      let z=((i/9 + distance*.23)%1);
      const y=H*.27+Math.pow(z,1.55)*(H*.67);
      const x=W/2+(lane-1.5)*((W*.22)+(W*.55-W*.22)*z)*.58;
      ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+(lane===1?-1:1)*(2+z*4),y+8+z*17);ctx.stroke();
    }
  }
  // foliage on the sides
  for(let side of [-1,1]){
    for(let i=0;i<11;i++){
      const z=((i/11+distance*.12)%1), y=H*.24+Math.pow(z,1.5)*H*.74;
      const x=W/2+side*(W*.16+z*W*.39);
      const s=7+z*32;
      ctx.fillStyle=i%2?"#173b25":"#24542f";
      ctx.beginPath();ctx.ellipse(x,y,s*1.3,s*.55,side*.3,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle="#527a3d";ctx.lineWidth=1+z*2;
      ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-side*s*.5,y-s*1.6);ctx.stroke();
    }
  }
}
function drawCoin(x,y,s) {
  ctx.save();ctx.translate(x,y);
  ctx.shadowColor="#ffd44d";ctx.shadowBlur=12*s;
  ctx.fillStyle="#f8c844";ctx.beginPath();ctx.ellipse(0,0,8*s,11*s,0,0,Math.PI*2);ctx.fill();
  ctx.shadowBlur=0;ctx.strokeStyle="#fff0a3";ctx.lineWidth=2*s;ctx.beginPath();ctx.ellipse(0,0,4*s,7*s,0,0,Math.PI*2);ctx.stroke();
  ctx.restore();
}
function drawObject(o) {
  const p=project(o.lane,o.z), s=p.scale;
  if(o.type==="coin"){drawCoin(p.x,p.y-12*s,s);return;}
  if(o.type==="rock"){
    ctx.fillStyle="#252d25";ctx.beginPath();ctx.ellipse(p.x,p.y-7*s,22*s,13*s,0,0,Math.PI*2);ctx.fill();
    polygon([[p.x-20*s,p.y-7*s],[p.x-11*s,p.y-22*s],[p.x+6*s,p.y-25*s],[p.x+21*s,p.y-8*s]],"#58604b","#29352a",2*s);
    polygon([[p.x-10*s,p.y-20*s],[p.x+6*s,p.y-24*s],[p.x+2*s,p.y-11*s]],"#899078");
  } else if(o.type==="gate"){
    ctx.fillStyle="#3b2416";ctx.fillRect(p.x-25*s,p.y-55*s,8*s,57*s);
    ctx.fillRect(p.x+17*s,p.y-55*s,8*s,57*s);
    ctx.fillStyle="#9a6236";ctx.fillRect(p.x-29*s,p.y-59*s,58*s,13*s);
    ctx.fillStyle="#d5a05c";ctx.fillRect(p.x-29*s,p.y-59*s,58*s,3*s);
  } else {
    ctx.save();ctx.translate(p.x,p.y-18*s);ctx.rotate(-.12);
    ctx.fillStyle="#3b2416";ctx.fillRect(-25*s,-9*s,50*s,19*s);
    ctx.fillStyle="#a86c39";ctx.fillRect(-23*s,-8*s,46*s,15*s);
    ctx.strokeStyle="#e0aa66";ctx.lineWidth=2*s;ctx.beginPath();ctx.ellipse(-22*s,0,4*s,8*s,0,0,Math.PI*2);ctx.stroke();
    ctx.restore();
  }
}
function drawPlayer() {
  const p=project(player.xLane,0.88);
  const x=p.x, ground=p.y, jumpY=player.jump*0.48;
  const slideFactor=player.slide>0?0.48:1;
  const scale=1.18;
  ctx.save();ctx.translate(x,ground-jumpY);
  // shadow
  ctx.fillStyle="#06100a88";ctx.beginPath();ctx.ellipse(0,2,25*(1-player.jump/500),8,0,0,Math.PI*2);ctx.fill();
  ctx.scale(scale,scale*slideFactor);
  if(player.hitFlash>0 && Math.floor(player.hitFlash*18)%2===0) ctx.globalAlpha=.45;
  // legs
  ctx.strokeStyle="#172d35";ctx.lineWidth=9;ctx.lineCap="round";
  if(player.slide>0){ctx.beginPath();ctx.moveTo(-5,-22);ctx.lineTo(18,-10);ctx.moveTo(2,-22);ctx.lineTo(25,-12);ctx.stroke();}
  else {ctx.beginPath();ctx.moveTo(-6,-24);ctx.lineTo(-12,-5);ctx.moveTo(6,-24);ctx.lineTo(13,-5);ctx.stroke();}
  // shoes
  ctx.strokeStyle="#e5d5a1";ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(-15,-5);ctx.lineTo(-7,-5);ctx.moveTo(10,-5);ctx.lineTo(18,-5);ctx.stroke();
  // torso
  ctx.fillStyle="#e0a14c";ctx.beginPath();ctx.roundRect(-12,-52,24,30,6);ctx.fill();
  ctx.fillStyle="#2c5941";ctx.fillRect(-10,-49,20,17);
  // arms
  ctx.strokeStyle="#d78c4c";ctx.lineWidth=7;
  ctx.beginPath();ctx.moveTo(-10,-45);ctx.lineTo(-20,-31);ctx.moveTo(10,-45);ctx.lineTo(20,-35);ctx.stroke();
  // head
  ctx.fillStyle="#b96f3c";ctx.beginPath();ctx.arc(0,-62,12,0,Math.PI*2);ctx.fill();
  // hair / headband
  ctx.fillStyle="#20251c";ctx.beginPath();ctx.arc(0,-66,12,Math.PI,Math.PI*2);ctx.fill();
  ctx.fillStyle="#c5f36a";ctx.fillRect(-11,-66,22,4);
  ctx.restore();
}
function draw() {
  drawBackground();
  // far objects first, nearest objects last
  [...objects].sort((a,b)=>a.z-b.z).forEach(drawObject);
  drawPlayer();
  // subtle vignette
  const v=ctx.createRadialGradient(W/2,H/2,H*.2,W/2,H/2,H*.78);
  v.addColorStop(0,"#00000000");v.addColorStop(1,"#06100b55");
  ctx.fillStyle=v;ctx.fillRect(0,0,W,H);
}
function frame(now) {
  const dt=Math.min((now-lastTime)/1000||0,0.04);lastTime=now;
  if(running) update(dt);
  draw();
  requestAnimationFrame(frame);
}
resetGame();
requestAnimationFrame(frame);
