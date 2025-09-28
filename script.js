
// Matrix background
(function(){
  const c=document.getElementById('matrixCanvas'), ctx=c.getContext('2d');
  let cols=0, drops=[];
  function resize(){ c.width=innerWidth; c.height=innerHeight; cols=Math.floor(c.width/12); drops=new Array(cols).fill(0); }
  resize(); addEventListener('resize', resize);
  const letters = 'アァイィウヴエェオカガキギクグケゲコゴサザシジスズセゼソゾタダチツテトナニヌネノハバパヒビピフブプヘベペホボポマミムメモヤユヨラリルレロワンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
  function draw(){ ctx.fillStyle='rgba(0,0,0,0.06)'; ctx.fillRect(0,0,c.width,c.height); ctx.fillStyle='#00ff88'; ctx.font='13px monospace'; for(let i=0;i<cols;i++){ const txt=letters[Math.floor(Math.random()*letters.length)]; ctx.fillText(txt,i*12,drops[i]*12); if(drops[i]*12>c.height && Math.random()>0.975) drops[i]=0; drops[i]++; } }
  setInterval(draw,33);
})();

// SPA navigation
function navTo(view){
  const views = ['home','repo','market','pricing','blog','faq','contact'];
  views.forEach(v=>{
    const el = document.getElementById('view-'+v);
    if(!el) return;
    el.style.display = (v===view) ? 'block' : 'none';
    document.getElementById('nav-'+v)?.classList.toggle('active', v===view);
  });
  window.scrollTo({top:0,behavior:'smooth'});
}

// Repo selection and data
const repoSelection = new Set();
function toggleRepoSelect(id, checked){
  if(checked) repoSelection.add(id); else repoSelection.delete(id);
  document.getElementById('repo-selected-count').innerText = repoSelection.size;
}
function clearRepoSelection(){ repoSelection.clear(); document.querySelectorAll('#repo-grid input[type=checkbox]').forEach(cb=>cb.checked=false); document.getElementById('repo-selected-count').innerText = 0; }
function selectAllVisibleRepo(){ document.querySelectorAll('#repo-grid .script-card').forEach(card=>{ const id = Number(card.dataset.id); repoSelection.add(id); const cb = card.querySelector('input[type=checkbox]'); if(cb) cb.checked=true; }); document.getElementById('repo-selected-count').innerText = repoSelection.size; }

// Renderers and modal controls
function openRepoScript(id){
  const card = document.querySelector(`#repo-grid .script-card[data-id='${id}']`);
  if(!card) return alert('Script no encontrado');
  const title = card.dataset.title || 'Script';
  const cat = card.dataset.cat || '';
  const code = `# Demo script ${id}\necho "Este es un script demo ${id}"\n`;
  document.getElementById('repoModalTitle').innerText = title;
  document.getElementById('repoModalBody').innerHTML = `<div class="muted">Categoría: ${cat} • ID: ${id}</div><pre class="code">${escapeHtml(code)}</pre>`;
  document.getElementById('repoModal').style.display = 'flex';
}
function closeRepoModal(){ document.getElementById('repoModal').style.display='none'; }

function downloadRepoScript(id){
  const card = document.querySelector(`#repo-grid .script-card[data-id='${id}']`);
  if(!card) return alert('Script no encontrado');
  const title = card.dataset.title || `script_${id}`;
  const code = `# Demo script ${id}\necho "Script ${id}"\n`;
  const blob = new Blob([code], {type:'text/plain;charset=utf-8'});
  saveAs(blob, `${title.replace(/\s+/g,'_')}.txt`);
}

async function downloadSelectedRepoZip(){
  if(repoSelection.size===0) return alert('Selecciona al menos un script');
  const zip = new JSZip();
  repoSelection.forEach(id=>{
    const title = document.querySelector(`#repo-grid .script-card[data-id='${id}']`)?.dataset.title || `script_${id}`;
    const code = `# Demo script ${id}\necho "Script ${id}"\n`;
    zip.file(`${title.replace(/\s+/g,'_')}.txt`, code);
  });
  const content = await zip.generateAsync({type:'blob'});
  saveAs(content, 'unitec_repo_bundle.zip');
}

function installRepoScript(id){
  const card = document.querySelector(`#repo-grid .script-card[data-id='${id}']`);
  if(!card) return alert('Script no encontrado');
  const title = card.dataset.title || `script_${id}`;
  const installCmd = `# Guardar como ${title.replace(/\s+/g,'_')}.sh\nchmod +x ${title.replace(/\s+/g,'_')}.sh\n./${title.replace(/\s+/g,'_')}.sh`;
  document.getElementById('repoModalTitle').innerText = `Instalación — ${title}`;
  document.getElementById('repoModalBody').innerHTML = `<pre class="code">${escapeHtml(installCmd)}</pre>`;
  document.getElementById('repoModal').style.display='flex';
}

// Filter repo grid
function filterRepo(){
  const q = document.getElementById('search-repo').value.toLowerCase();
  const cat = document.getElementById('repo-cat').value;
  document.querySelectorAll('#repo-grid .script-card').forEach(card=>{
    const title = (card.dataset.title||'').toLowerCase();
    const desc = (card.querySelector('.muted')?.innerText||'').toLowerCase();
    const c = (card.dataset.cat||'');
    const visible = (q==='' || title.includes(q) || desc.includes(q)) && (cat==='all' || c===cat);
    card.style.display = visible ? '' : 'none';
  });
}

// Chat & terminal simulation
function toggleChat(){ const box = document.getElementById('chat-box'); box.style.display = box.style.display==='flex' ? 'none' : 'flex'; box.style.flexDirection='column'; }
function sendChat(){ const inpt = document.getElementById('chat-in'); const msg = inpt.value.trim(); if(!msg) return; const msgs = document.getElementById('chat-messages'); msgs.innerHTML += `<div class="user">🙋 ${escapeHtml(msg)}</div>`; inpt.value=''; setTimeout(()=>{ msgs.innerHTML += '<div class="bot">🤖 Respuesta automatizada: Gracias, recibimos tu mensaje.</div>'; msgs.scrollTop = msgs.scrollHeight; },800); }

// Utility
function escapeHtml(text){ return String(text).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

// Init: ensure repo grid populated count visible
document.addEventListener('DOMContentLoaded', ()=>{ document.getElementById('repo-selected-count').innerText = 0; });


