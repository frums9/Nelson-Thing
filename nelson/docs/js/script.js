/* --- Page controller --- */
const pageIds = ['p1','p2','p3','p4','p5','p6','p7','p8','p9'];
const pages = Object.fromEntries(pageIds.map(id=>[id, document.getElementById(id)]));
function showPage(id){
  pageIds.forEach(pid=>{
    pages[pid].style.zIndex = (pid === id ? 50 : 10);
    pages[pid].classList.toggle('show', pid === id);
  });
}

/* --- Confetti --- */
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');
function resize(){ canvas.width=innerWidth; canvas.height=innerHeight; }
resize(); addEventListener('resize', resize);

function launchConfetti(color = getComputedStyle(document.documentElement).getPropertyValue('--team-color') || '#e53935', count=140, duration=3500){
  const pieces = []; const now=performance.now();
  for(let i=0;i<count;i++){
    pieces.push({x:Math.random()*canvas.width,y:-Math.random()*200,w:6+Math.random()*12,h:8+Math.random()*10,vx:(Math.random()-0.5)*1.4,vy:2+Math.random()*4,rot:Math.random()*360,rotV:(Math.random()-0.5)*0.2,color:color.trim(),dieAt:now+duration+Math.random()*600});
  }
  function frame(t){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(const p of pieces){ p.x+=p.vx; p.y+=p.vy; p.rot+=p.rotV;
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot); ctx.fillStyle=p.color; ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h); ctx.restore();
    }
    let alive = pieces.filter(p => t < p.dieAt && p.y < canvas.height+50);
    if(alive.length){ requestAnimationFrame(frame); } else { ctx.clearRect(0,0,canvas.width,canvas.height); }
  }
  requestAnimationFrame(frame);
}

/* --- Page 1 click -> swap image -> show Page 2 + confetti --- */
let p1Switched=false;
pages.p1.addEventListener('click',()=>{
  if(p1Switched) return;
  p1Switched=true;
  pages.p1.style.backgroundImage="url('placeholder-red-1b.jpg')";
  setTimeout(()=>{ showPage('p2'); launchConfetti(); },300);
});

/* --- Page 2 ENTER -> Page 3 --- */
document.getElementById('enterBtn').addEventListener('click',()=>showPage('p3'));

/* --- Page3: sequential taps for color reveal --- */
let tapCount=0;
const seq=['p4','p5','p6'];
function colorAdvance(){
  if(tapCount<seq.length){ showPage(seq[tapCount]); tapCount++; } 
  else{ showPage('p7'); launchConfetti(getComputedStyle(document.documentElement).getPropertyValue('--team-color') || '#e53935',220,3800); }
}
pages.p3.addEventListener('click',colorAdvance);
document.getElementById('tapBtn').addEventListener('click',colorAdvance);
seq.forEach(pid=>pages[pid].addEventListener('click',colorAdvance));

/* --- Page7 Continue -> Page8 --- */
document.getElementById('to8').addEventListener('click',()=>{
  // Show PAGE 8
  pageIds.forEach(pid=>pages[pid].classList.remove('show'));
  pages['p8'].classList.add('show');
  pages['p8'].style.zIndex=50;
  // Tap anywhere to go to ticket
  pages['p8'].onclick = ()=>{
    pages['p8'].onclick=null;
    showPage('p9');
    document.getElementById('nameInput').focus();
  };
});

/* --- Page9 ticket workflow --- */
// NAME input → ticket
document.getElementById('openNameInput').addEventListener('click',()=>{document.getElementById('nameModal').style.display='flex';});
document.getElementById('nameSubmit').addEventListener('click',()=>{
  const name=document.getElementById('nameInput').value.trim();
  if(!name){alert('Enter your name!');return;}
  document.getElementById('ticketName').textContent=name;
  document.getElementById('ticket').style.display='block';
  document.getElementById('nameModal').style.display='none';
});

document.getElementById('yesBtn').addEventListener('click',()=>{
  const name=document.getElementById('confirmModal').dataset.tempName||'[NAME]';
  document.getElementById('confirmModal').style.display='none';
  document.getElementById('ticketName').textContent=name;
  document.getElementById('ticketColor').textContent='RED — TAPANG';
  document.getElementById('screenshotModal').style.display='flex';
});
document.getElementById('noBtn').addEventListener('click',()=>{
  document.getElementById('confirmModal').style.display='none';
  const re = prompt('Re-enter your name (max 40 chars):')||'';
  const name=re.trim().slice(0,40);
  if(!name) return;
  document.getElementById('ticketName').textContent=name;
  document.getElementById('ticketColor').textContent='RED — TAPANG';
  document.getElementById('screenshotModal').style.display='flex';
});
document.getElementById('okShot').addEventListener('click',()=>document.getElementById('screenshotModal').style.display='none');
document.addEventListener('keydown',e=>{ if(e.key==='Enter'&&document.querySelector('.page.show')===pages.p9){ document.getElementById('confirmBtn').click(); }});

resize();