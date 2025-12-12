/* =========================================
   1. SETUP & UTILITIES
   ========================================= */
const pageIds = ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
const pages = {};
pageIds.forEach(id => {
    pages[id] = document.getElementById(id);
});

const sounds = {
    confetti: document.getElementById("confettiSound"),
    smash: document.getElementById("smashSound")
};

function showPage(id) {
    pageIds.forEach(pid => {
        pages[pid].classList.remove("show");
    });
    if (pages[id]) {
        pages[id].classList.add("show");
    }
}

function playSound(name) {
    try {
        if (sounds[name]) {
            sounds[name].currentTime = 0;
            sounds[name].play().catch(e => console.log("Audio autoplay blocked"));
        }
    } catch (e) { console.warn("Audio error", e); }
}

/* =========================================
   2. CONFETTI ENGINE
   ========================================= */
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const colors = ["#e53935", "#ffeb3b", "#4caf50", "#2196f3", "#9c27b0", "#ff9800", "#e91e63"];

function launchConfetti(count = 200) {
    const pieces = [];
    for (let i = 0; i < count; i++) {
        pieces.push({
            x: Math.random() * canvas.width,
            y: -20,
            size: Math.random() * 6 + 4,
            speedY: Math.random() * 3 + 2,
            speedX: (Math.random() - 0.5) * 2,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }

    function frame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pieces.forEach(p => {
            p.y += p.speedY; p.x += p.speedX;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, p.size, p.size);
        });
        if (pieces.some(p => p.y < canvas.height)) requestAnimationFrame(frame);
        else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    frame();
    playSound("confetti");
}

/* =========================================
   3. GAME LOGIC
   ========================================= */

// Intro -> Welcome
let p1Switched = false;
pages.p1.addEventListener('click', () => {
    if (p1Switched) return;
    p1Switched = true;
    
    // Animate Door/Background
    setTimeout(() => { 
        showPage("p2"); 
        const sub = pages.p2.querySelector(".welcome-sub");
        const main = pages.p2.querySelector(".welcome-main");
        if(sub) { sub.style.opacity = 1; sub.style.transform = "translateY(0)"; }
        if(main) { main.style.opacity = 1; main.style.transform = "translateY(0)"; }
        launchConfetti(100); 
    }, 300);
});

// Welcome -> Track
document.getElementById("enterBtn").addEventListener('click', () => showPage("p3"));

// Tap Game
let tapCount = 0;
const gameSequence = ["p4", "p5", "p6"];
const tapBtn = document.getElementById("tapBtn");

function handleGameTap() {
    if (tapCount < 3) { 
        playSound("smash");
        showPage(gameSequence[tapCount]); 
        tapCount++;
    } else { 
        showPage("p7"); 
        launchConfetti(300);
    }
}

pages.p3.addEventListener('click', handleGameTap);
tapBtn.addEventListener('click', (e) => { e.stopPropagation(); handleGameTap(); });
gameSequence.forEach(pid => pages[pid].addEventListener('click', handleGameTap));

// Navigation
document.getElementById("to8").addEventListener('click', () => showPage("p8"));

pages.p8.addEventListener('click', () => {
    showPage("p9");
    document.getElementById("nameModal").style.display = "flex";
    document.getElementById("nameInput").focus();
});

/* =========================================
   4. TICKET SYSTEM (FIXED)
   ========================================= */

// Save Name
document.getElementById("saveName").addEventListener('click', () => {
    const name = document.getElementById("nameInput").value.trim();
    if (!name) { alert("Please enter your name!"); return; }
    document.getElementById("preview").textContent = name;
    document.getElementById("nameModal").style.display = "none";
    document.getElementById("confirmModal").style.display = "flex";
});

// Confirm YES -> Show Ticket -> Create "Done" Button
document.getElementById("yes").addEventListener('click', () => {
    document.getElementById("confirmModal").style.display = "none";
    
    // Fill Name
    document.getElementById("tName").textContent = document.getElementById("preview").textContent;
    
    // Show Ticket
    const ticket = document.getElementById("ticket");
    ticket.classList.remove("hidden");
    ticket.style.display = "block";
    
    // === THE FIX IS HERE ===
    // 1. We do NOT show the 'shotModal' automatically anymore.
    // 2. We inject a "Done" button right into the ticket so you can click it when ready.
    
    // Check if button already exists (to prevent duplicates)
    if (!document.getElementById("dynamicDoneBtn")) {
        const btn = document.createElement("button");
        btn.id = "dynamicDoneBtn";
        btn.textContent = "I SAVED IT → FINISH";
        btn.className = "btn-main"; 
        btn.style.marginTop = "20px";
        btn.style.width = "100%";
        btn.style.fontSize = "0.9rem";
        
        // When clicked, GO TO PAGE 10
        btn.onclick = () => {
            showPage("p10");
            launchConfetti(400);
        };
        
        // Add button inside the ticket box
        ticket.appendChild(btn);
    }
});

// Confirm NO
document.getElementById("no").addEventListener('click', () => {
    document.getElementById("confirmModal").style.display = "none";
    document.getElementById("nameModal").style.display = "flex";
});

// (Optional) Keep the old 'ok' listener just in case logic triggers the modal elsewhere
document.getElementById("ok").addEventListener('click', () => {
    document.getElementById("shotModal").style.display = "none";
    showPage("p10");
});
