let pages=["page1","page2","page3","page4","page5"];
let currentPage=0;

// Page navigation
function nextPage(){
  if(currentPage<pages.length-1){
    document.getElementById(pages[currentPage]).classList.remove("active");
    currentPage++;
    document.getElementById(pages[currentPage]).classList.add("active");
    if(pages[currentPage]==="page2") launchConfetti();
  }
}

document.getElementById("page1").onclick=nextPage;
document.getElementById("page2").onclick=nextPage;
document.getElementById("page4").onclick=nextPage;

// Confetti
function launchConfetti(){
  for(let i=0;i<40;i++){
    let c=document.createElement("div");
    c.classList.add("confetti");
    c.style.left=Math.random()*100+"vw";
    c.style.background=`hsl(${Math.random()*360},100%,60%)`;
    c.style.animationDelay=(Math.random()*2)+"s";
    document.body.appendChild(c);
    setTimeout(()=>{c.remove()},3000);
  }
}

// Palayok taps
let hits=0;
document.getElementById("page3").onclick=()=>{
  hits++;
  if(hits===1){ document.getElementById("palayokImg").style.display="none"; document.getElementById("palayokCrack1").style.display="block"; }
  if(hits===2){ document.getElementById("palayokCrack1").style.display="none"; document.getElementById("palayokCrack2").style.display="block"; }
  if(hits===3){
    document.getElementById("palayokCrack2").style.display="none";
    document.getElementById("palayokCrack3").style.display="block";
    document.getElementById("darkenLayer").style.display="block";
    setTimeout(()=>{
      document.getElementById("colorPopup").style.display="block";
      launchConfetti();
    },400);
    setTimeout(()=>nextPage(),2000);
  }
};

// Name input with confirmation (30-40 chars)
document.getElementById("nameInput").addEventListener("keyup", function(e) {
  let val = this.value.trim();

  // Limit input to 50 characters
  if (val.length > 50) {
    val = val.substring(0, 50);
    this.value = val; // update the input field
  }

  // Show confirmation when Enter is pressed or any input exists
  if (val.length > 0 && e.key === "Enter") {
    document.getElementById("generatedName").textContent = val;
    this.style.display = "none";
    document.getElementById("confirmText").innerText = "Is this your name?\n" + val;
    document.getElementById("confirmPopup").style.display = "block";
  }
});


function confirmYes(){
  document.getElementById("confirmPopup").style.display="none";
  alert("Take a screenshot of your ticket!");
}

function confirmNo(){
  document.getElementById("confirmPopup").style.display="none";
  document.getElementById("generatedName").textContent="";
  document.getElementById("nameInput").style.display="block";
  document.getElementById("nameInput").value="";
}