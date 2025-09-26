document.getElementById("chat-toggle").addEventListener("click", () => {
  const box = document.getElementById("chat-box");
  box.style.display = (box.style.display === "none") ? "block" : "none";
});

// Función para convertir en loadstring
function convertirEnLoadstring(url) {
  let rawUrl = url;

  // Si es link de GitHub con /blob/, convertirlo a raw
  if (rawUrl.includes("github.com") && rawUrl.includes("/blob/")) {
    rawUrl = rawUrl.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/");
  }

  return `loadstring(game:HttpGet("${rawUrl}", true))()`;
}

function sendChat() {
  const input = document.getElementById("chat-in");
  const msg = input.value.trim();
  if (!msg) return;

  const chatMessages = document.getElementById("chat-messages");

  // Mensaje del usuario
  const userMsg = document.createElement("div");
  userMsg.className = "user";
  userMsg.textContent = "🧑 " + msg;
  chatMessages.appendChild(userMsg);

  // Mensaje del bot
  const botMsg = document.createElement("div");
  botMsg.className = "bot";

  // Si detecta un link
  if (msg.startsWith("http")) {
    botMsg.textContent = "📜 Aquí tienes tu loadstring listo:\n\n" +
      convertirEnLoadstring(msg);
  } else {
    botMsg.textContent = "🤖 Escribe un link de GitHub o URL de script y te daré el loadstring.";
  }

  chatMessages.appendChild(botMsg);
  input.value = "";
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Matrix background
(function(){
  const c = document.getElementById('matrixCanvas'), ctx = c.getContext('2d');
  let cols = 0, drops = [];
  function resize(){ c.width = innerWidth; c.height = innerHeight; cols = Math.floor(c.width/12); drops = new Array(cols).fill(0); }
  resize(); addEventListener('resize', resize);
  const letters = 'アァイィウヴエェオカガキギクグケゲコゴサザシジスズセゼソゾタダチッヂツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
  function draw(){
    ctx.fillStyle='rgba(0,0,0,0.06)'; ctx.fillRect(0,0,c.width,c.height);
    ctx.fillStyle='#00ff88'; ctx.font='13px monospace';
    for(let i=0;i<cols;i++){
      const text = letters[Math.floor(Math.random()*letters.length)];
      ctx.fillText(text, i*12, drops[i]*12);
      if(drops[i]*12 > c.height && Math.random() > 0.975) drops[i]=0;
      drops[i]++;
    }
  }
  setInterval(draw, 33);
})();

// SPA nav
function navTo(view){
  ['home','shop','services','testimonials','blog','faq','contact'].forEach(v=>{
    document.getElementById('view-'+v)?.classList.remove('active');
    document.getElementById('nav-'+v)?.classList.remove('active');
  });
  document.getElementById('view-'+view).classList.add('active');
  document.getElementById('nav-'+view)?.classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
}

// Products: simple interactions
let cart = [];
function addToCart(name,price){ cart.push({name,price}); renderCart(); }
function viewProduct(name,desc){ alert(name + '\n\n' + desc); }
function renderCart(){
  document.getElementById('cartCount').innerText = cart.length;
  const total = cart.reduce((a,p)=>a+p.price,0);
  document.getElementById('cartTotal').innerText = total.toFixed(2);
  document.getElementById('cartTotalBig').innerText = total.toFixed(2);
  document.getElementById('ck-total').innerText = total.toFixed(2);
  const tbody = document.getElementById('cartRows');
  if(!tbody) return;
  tbody.innerHTML = '';
  cart.forEach((p,i)=>{
    const tr = document.createElement('tr');
    tr.innerHTML = '<td>'+p.name+'</td><td>$'+p.price.toFixed(2)+'</td><td><button class="btn ghost" onclick="removeFromCart('+i+')">Quitar</button></td>';
    tbody.appendChild(tr);
  });
}
function removeFromCart(i){ cart.splice(i,1); renderCart(); }
function clearCart(){ cart = []; renderCart(); }

// Filters
function applyFilters(){
  const q = document.getElementById('search').value.toLowerCase();
  const cat = document.getElementById('filter-cat').value;
  document.querySelectorAll('#product-grid .product').forEach(a=>{
    const title = a.querySelector('h3')?.innerText.toLowerCase() || '';
    const acat = a.dataset.cat || '';
    const match = (title.includes(q) || q==='') && (cat==='all' || acat===cat);
    a.style.display = match ? '' : 'none';
  });
}

// Checkout
function openCart(){ document.getElementById('cartModal').style.display='flex'; }
function closeCart(){ document.getElementById('cartModal').style.display='none'; }
function openCheckout(){ if(cart.length===0){ alert('Tu carrito está vacío'); return; } closeCart(); document.getElementById('checkoutModal').style.display='flex'; }
function closeCheckout(){ document.getElementById('checkoutModal').style.display='none'; }
function validateCheckout(){ const name=document.getElementById('ck-name').value.trim(); const email=document.getElementById('ck-email').value.trim(); if(!name||!email) return 'Completa todos los campos.'; return ''; }
function payNow(){ const err=validateCheckout(); const status=document.getElementById('ck-status'); status.innerHTML=''; if(err){ status.innerHTML='<p style="color:var(--err)">'+err+'</p>'; return; } status.innerHTML='<p style="color:var(--brand)">Procesando pago...</p>'; setTimeout(()=>{ status.innerHTML='<p style="color:var(--brand)"><strong>Pago aprobado.</strong></p>'; clearCart(); setTimeout(()=>{ closeCheckout(); navTo('home'); },1200); },900); }

// FAQ toggle
function toggleFaq(el){ const a = el.nextElementSibling; a.style.display = (a.style.display==='block' ? 'none' : 'block'); }

// Chat
document.getElementById('chat-toggle').onclick = function() {
  const box = document.getElementById('chat-box');
  box.style.display = (box.style.display === 'flex') ? 'none' : 'flex';
  box.style.flexDirection = 'column';
}

// Función que convierte el link en loadstring
function convertirEnLoadstring(url) {
  let rawUrl = url;

  // Si el link es de GitHub con /blob/, convertirlo a raw
  if (rawUrl.includes("github.com") && rawUrl.includes("/blob/")) {
    rawUrl = rawUrl.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/");
  }

  return `loadstring(game:HttpGet("${rawUrl}", true))()`;
}

function sendChat() {
  const inpt = document.getElementById('chat-in');
  const msg = inpt.value.trim();
  if (!msg) return;

  const msgs = document.getElementById('chat-messages');
  msgs.innerHTML += '<div class="user">🙋 ' + msg + '</div>';
  inpt.value = '';

  setTimeout(() => {
    let respuesta = "";

    if (msg.startsWith("http")) {
      // Si es un link → devolver loadstring convertido
      respuesta = "📜 Aquí está tu loadstring listo:<br><pre><code>" +
                  convertirEnLoadstring(msg) +
                  "</code></pre>";
    } else {
      // Si no es un link → respuesta normal
      respuesta = "🤖 No detecté un link. Envíame un enlace de GitHub o cualquier URL de script.";
    }

    msgs.innerHTML += '<div class="bot">' + respuesta + '</div>';
    msgs.scrollTop = msgs.scrollHeight;
  }, 800);
}

// Terminal controls
function openTerminal(){ document.getElementById('hack-terminal').style.display='block'; }
function simulateDeploy(){ const log=document.getElementById('hack-log'); log.innerHTML += '\n» deploy: marketing-payload (OK)'; log.scrollTop = log.scrollHeight; }
function simulateScan(){ const log=document.getElementById('hack-log'); log.innerHTML += '\n» scan: vulnerabilities (0)'; log.scrollTop = log.scrollHeight; }

// Init
document.addEventListener('DOMContentLoaded',()=>{ renderCart(); });