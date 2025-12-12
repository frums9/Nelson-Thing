/* =========================================
   1. SETUP & UTILITIES
   ========================================= */
// Map all page IDs to DOM elements for quick access
const pageIds = ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
const pages = {};
pageIds.forEach(id => {
    pages[id] = document.getElementById(id);
});

// Audio Controller
const sounds = {
    confetti: document.getElementById("confettiSound"),
    smash: document.getElementById("smashSound")
};

// Helper: Show a specific page and hide others
function showPage(id) {
    // Hide all pages first
    pageIds.forEach(pid => {
        pages[pid].classList.remove("show");
    });
    // Show the requested page
    if (pages[id]) {
        pages[id].classList.add("show");
    } else {
        console.error("Page not found:", id);
    }
}

// Helper: Safe Audio Play (Prevents browser errors if user hasn't interacted yet)
function playSound(name) {
    try {
        if (sounds[name]) {
            sounds[name].currentTime = 0; // Rewind to start
            sounds[name].play().catch(e => console.log("Audio autoplay blocked:", e));
        }
    } catch (e) {
        console.warn("Audio error:", e);
    }
}

/* =========================================
   2. CONFETTI ENGINE (Rainbow Version)
   ========================================= */
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

// Resize canvas to fill screen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Rainbow Colors (Matches the video vibe)
const colors = ["#e53935", "#ffeb3b", "#4caf50", "#2196f3", "#9c27b0", "#ff9800", "#e91e63"];

function launchConfetti(count = 200) {
    const pieces = [];
    
    // Create particles
    for (let i = 0; i < count; i++) {
        pieces.push({
            x: Math.random() * canvas.width,
            y: -20, // Start above screen
            size: Math.random() * 6 + 4,
            speedY: Math.random() * 3 + 2,
            speedX: (Math.random() - 0.5) * 2,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }

    // Animation Loop
    function frame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        pieces.forEach(p => {
            p.y += p.speedY;
            p.x += p.speedX;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, p.size, p.size);
        });

        // Keep animating if pieces are still visible
        if (pieces.some(p => p.y < canvas.height)) {
            requestAnimationFrame(frame);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clean up
        }
    }
    
    frame();
    playSound("confetti");
}

/* =========================================
   3. GAME LOGIC (The Flow)
   ========================================= */

// --- PAGE 1: Intro (Door) -> Page 2 (Welcome) ---
let p1Switched = false;
pages.p1.addEventListener('click', () => {
    if (p1Switched) return; // Prevent double clicks
    p1Switched = true;
    
    // NOTE: This assumes you have the 'open door' image. 
    // If not, it just fades. That's fine!
    
    setTimeout(() => { 
        showPage("p2"); 
        
        // Trigger Welcome Animations
        const sub = pages.p2.querySelector(".welcome-sub");
        const main = pages.p2.querySelector(".welcome-main");
        
        if(sub) { sub.style.opacity = 1; sub.style.transform = "translateY(0)"; }
        if(main) { main.style.opacity = 1; main.style.transform = "translateY(0)"; }
        
        launchConfetti(100); // Small burst
    }, 300);
});

// --- PAGE 2 -> PAGE 3 (Enter) ---
document.getElementById("enterBtn").addEventListener('click', () => {
    showPage("p3");
});

// --- PAGE 3: The Tap Game (Pot Breaking) ---
let tapCount = 0;
const gameSequence = ["p4", "p5", "p6"]; // The backgrounds (Pot 1, 2, 3)
const tapBtn = document.getElementById("tapBtn");

function handleGameTap() {
    if (tapCount < 3) { 
        // 1. Play Smash Sound
        playSound("smash");
        
        // 2. Show next broken pot image
        showPage(gameSequence[tapCount]); 
        
        tapCount++;
    } else { 
        // 3. Game Over -> Reveal Mascot
        showPage("p7"); 
        launchConfetti(300); // Big burst
    }
}

// Allow clicking the button OR the screen to play
pages.p3.addEventListener('click', handleGameTap);
tapBtn.addEventListener('click', (e) => { 
    e.stopPropagation(); // Prevent double-triggering if clicking button
    handleGameTap(); 
});
// Add listener to the game pages too, so they can keep tapping fast
gameSequence.forEach(pid => {
    pages[pid].addEventListener('click', handleGameTap);
});


// --- PAGE 7 (Reveal) -> PAGE 8 (Program) ---
document.getElementById("to8").addEventListener('click', () => {
    showPage("p8");
});

// --- PAGE 8 -> PAGE 9 (Ticket Entry) ---
pages.p8.addEventListener('click', () => {
    showPage("p9");
    // Open the Name Input Modal immediately
    document.getElementById("nameModal").style.display = "flex";
    document.getElementById("nameInput").focus();
});


/* =========================================
   4. TICKET SYSTEM
   ========================================= */

// Step 1: User enters name -> Click OK
document.getElementById("saveName").addEventListener('click', () => {
    const nameInput = document.getElementById("nameInput");
    const name = nameInput.value.trim();

    if (!name) {
        alert("Please enter your name!");
        return;
    }

    // Update Preview and Switch Modals
    document.getElementById("preview").textContent = name;
    document.getElementById("nameModal").style.display = "none";
    document.getElementById("confirmModal").style.display = "flex";
});

// Step 2: User Confirms -> "YES"
document.getElementById("yes").addEventListener('click', () => {
    document.getElementById("confirmModal").style.display = "none";
    
    // Update the Real Ticket
    const finalName = document.getElementById("preview").textContent;
    document.getElementById("tName").textContent = finalName;
    
    // Reveal Ticket
    document.getElementById("ticket").classList.remove("hidden");
    document.getElementById("ticket").style.display = "block"; // Force display
    
    // Show Screenshot Reminder after a short delay
    setTimeout(() => {
        document.getElementById("shotModal").style.display = "flex";
    }, 800);
});

// Step 2 Alternative: User Cancels -> "NO"
document.getElementById("no").addEventListener('click', () => {
    document.getElementById("confirmModal").style.display = "none";
    document.getElementById("nameModal").style.display = "flex";
    document.getElementById("nameInput").focus();
});

// Step 3: Screenshot OK -> End (Page 10)
document.getElementById("ok").addEventListener('click', () => {
    document.getElementById("shotModal").style.display = "none";
    showPage("p10"); // Go to Thank You page
    launchConfetti(400); // Grand Finale
});