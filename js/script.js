/* =========================================
   1. PAGE CONTROLLER
   ========================================= */
const pageIds = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9'];
const pages = {};

// Cache DOM elements for better performance
pageIds.forEach(id => {
    pages[id] = document.getElementById(id);
});

function showPage(id) {
    pageIds.forEach(pid => {
        const isCurrent = (pid === id);
        // Manage Visibility
        pages[pid].classList.toggle('show', isCurrent);
        // Manage Z-Index (Current page is top)
        pages[pid].style.zIndex = isCurrent ? 50 : 10;
    });
}

/* =========================================
   2. CONFETTI ENGINE
   ========================================= */
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function launchConfetti(colorVar, count = 140, duration = 3500) {
    // Get team color from CSS or default to red
    const color = colorVar || getComputedStyle(document.documentElement).getPropertyValue('--team-color') || '#e53935';
    
    const pieces = [];
    const now = performance.now();

    for (let i = 0; i < count; i++) {
        pieces.push({
            x: Math.random() * canvas.width,
            y: -Math.random() * 200,
            w: 6 + Math.random() * 12,
            h: 8 + Math.random() * 10,
            vx: (Math.random() - 0.5) * 1.4,
            vy: 2 + Math.random() * 4,
            rot: Math.random() * 360,
            rotV: (Math.random() - 0.5) * 0.2,
            color: color.trim(),
            dieAt: now + duration + Math.random() * 600
        });
    }

    function frame(t) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (const p of pieces) {
            p.x += p.vx;
            p.y += p.vy;
            p.rot += p.rotV;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
        }

        let alive = pieces.filter(p => t < p.dieAt && p.y < canvas.height + 50);
        if (alive.length) {
            requestAnimationFrame(frame);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    requestAnimationFrame(frame);
}

/* =========================================
   3. INTERACTION LOGIC
   ========================================= */

/* --- Page 1: Click -> Swap Image -> Show Page 2 --- */
let p1Switched = false;
pages.p1.addEventListener('click', () => {
    if (p1Switched) return;
    p1Switched = true;
    
    // Change image before transition (ensure this image exists in your folder)
    pages.p1.style.backgroundImage = "url('images/placeholder-red-1b.jpg')"; 
    
    setTimeout(() => {
        showPage('p2');
        launchConfetti();
    }, 300);
});

/* --- Page 2: Enter -> Page 3 --- */
document.getElementById('enterBtn').addEventListener('click', () => showPage('p3'));

/* --- Page 3: Sequential Taps -> Page 7 (Surprise) --- */
let tapCount = 0;
const seq = ['p4', 'p5', 'p6'];

function colorAdvance() {
    if (tapCount < seq.length) {
        showPage(seq[tapCount]);
        tapCount++;
    } else {
        showPage('p7');
        launchConfetti(null, 220, 3800);
    }
}

// Add listeners to P3 and the sequence pages
pages.p3.addEventListener('click', colorAdvance);
document.getElementById('tapBtn').addEventListener('click', colorAdvance);
seq.forEach(pid => pages[pid].addEventListener('click', colorAdvance));

/* --- Page 7: Continue -> Page 8 --- */
document.getElementById('to8').addEventListener('click', () => {
    // Show Page 8
    showPage('p8');
    
    // One-time click on P8 moves to P9
    pages.p8.onclick = () => {
        pages.p8.onclick = null; // Remove listener
        showPage('p9');
        document.getElementById('openNameInput').click(); // Auto-open modal? Optional.
    };
});

/* =========================================
   4. TICKET & MODAL FLOW
   ========================================= */

// 1. Open Input Modal
document.getElementById('openNameInput').addEventListener('click', () => {
    document.getElementById('nameModal').style.display = 'flex';
    document.getElementById('nameInput').focus();
});

// 2. Submit Name -> Open Confirm Modal
document.getElementById('nameSubmit').addEventListener('click', () => {
    const nameInput = document.getElementById('nameInput');
    const name = nameInput.value.trim();

    if (!name) {
        alert('Please enter your name!');
        return;
    }

    // Hide input modal, Show Confirm modal
    document.getElementById('nameModal').style.display = 'none';
    document.getElementById('confirmModal').style.display = 'flex';
    
    // Set preview text
    document.getElementById('previewName').textContent = name;
    // Store name in dataset for retrieval
    document.getElementById('confirmModal').dataset.tempName = name;
});

// 3. Confirm "YES" -> Generate Ticket -> Show Screenshot Reminder
document.getElementById('yesBtn').addEventListener('click', () => {
    const name = document.getElementById('confirmModal').dataset.tempName;
    
    document.getElementById('confirmModal').style.display = 'none';
    
    // Update Ticket
    document.getElementById('ticketName').textContent = name;
    document.getElementById('openNameInput').style.display = 'none'; // Hide button
    document.getElementById('ticket').style.display = 'block'; // Show ticket

    // Show Screenshot Reminder
    setTimeout(() => {
        document.getElementById('screenshotModal').style.display = 'flex';
    }, 500);
});

// 4. Confirm "NO" -> Return to Input
document.getElementById('noBtn').addEventListener('click', () => {
    document.getElementById('confirmModal').style.display = 'none';
    document.getElementById('nameModal').style.display = 'flex';
    document.getElementById('nameInput').focus();
});

// 5. Screenshot "OKAY" -> Close
document.getElementById('okShot').addEventListener('click', () => {
    document.getElementById('screenshotModal').style.display = 'none';
});

// Allow "Enter" key to submit name
document.getElementById('nameInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('nameSubmit').click();
    }
});