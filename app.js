(() => {
  const colors = {infectious:'#df7059',immune:'#8b70c9',parasitic:'#c99035'};
  const tints = {infectious:'#fff0ec',immune:'#f3effb',parasitic:'#fbf4e8'};
  const labels = {infectious:'Infectious Diseases',immune:'Inflammatory & Autoimmune',parasitic:'Parasitic Diseases'};
  const icons = ['01','02','03','04','05','06','07','08'];
  const grid = document.getElementById('diseaseGrid');
  const search = document.getElementById('diseaseSearch');
  const count = document.getElementById('resultsCount');
  const noResults = document.getElementById('noResults');
  let filter = 'all';
  let currentDisease = null;
  const escapeHtml = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function renderCards(){
    const q = search.value.trim().toLowerCase();
    const list = window.DISEASES.filter(d => (filter==='all'||d.category===filter) && (!q || [d.name,d.short,d.tags,d.species].join(' ').toLowerCase().includes(q)));
    count.textContent = `Showing ${list.length} of 17 diseases`;
    noResults.hidden = list.length!==0;
    grid.innerHTML = list.map(d => {
      const idx = window.DISEASES.indexOf(d)+1;
      return `<article class="disease-card" role="button" tabindex="0" data-id="${d.id}" style="--card-color:${colors[d.category]};--card-tint:${tints[d.category]}">
        <div class="disease-card-top"><span class="disease-icon">${d.icon}</span><span class="disease-index">TOPIC ${String(idx).padStart(2,'0')}</span></div>
        <h3>${escapeHtml(d.name)}</h3><p>${escapeHtml(d.short)}</p>
        <div class="disease-card-bottom"><span class="disease-category">${labels[d.category]}</span><span class="open-topic">Explore <span>↗</span></span></div>
      </article>`;
    }).join('');
    grid.querySelectorAll('.disease-card').forEach(card => {
      card.addEventListener('click',()=>openDisease(card.dataset.id));
      card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openDisease(card.dataset.id)}});
    });
  }

  function openDisease(id){
    const d = window.DISEASES.find(x=>x.id===id); if(!d)return;
    currentDisease=d;
    const idx=window.DISEASES.indexOf(d)+1;
    const modal=document.getElementById('diseaseModal');
    modal.style.setProperty('--card-color',colors[d.category]);
    document.getElementById('modalCategory').textContent=labels[d.category].toUpperCase();
    document.getElementById('modalNumber').textContent=`${String(idx).padStart(2,'0')} / 17`;
    document.getElementById('modalTitle').textContent=d.name;
    document.getElementById('modalSubtitle').textContent=d.short+'  •  '+d.species;
    const index=document.getElementById('modalIndex');
    const content=document.getElementById('modalContent');
    const sectionIcons=['◎','⌁','↗','◉','⌕','♡','⊙','✦'];
    index.innerHTML=d.sections.map((s,i)=>`<a href="#detail-${i}" class="${i===0?'active':''}">${String(i+1).padStart(2,'0')} · ${escapeHtml(s[0])}</a>`).join('');
    content.innerHTML=d.sections.map((s,i)=>`<article class="detail-section" id="detail-${i}"><h3><span>${sectionIcons[i]}</span>${escapeHtml(s[0])}</h3><p>${escapeHtml(s[1])}</p></article>`).join('')+`<div class="topic-refs"><b>Further reading & references</b>${(d.refs||[]).map(r=>`<a href="${r[1]}" target="_blank" rel="noopener">${escapeHtml(r[0])} ↗</a>`).join('')}</div>`;
    modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
    document.getElementById('modalClose').focus();
    index.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{index.querySelectorAll('a').forEach(x=>x.classList.remove('active'));a.classList.add('active')}));
  }
  function closeModal(){const modal=document.getElementById('diseaseModal');modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow='';currentDisease=null}

  document.querySelectorAll('.category-tab').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.category-tab').forEach(b=>b.classList.remove('active'));btn.classList.add('active');filter=btn.dataset.filter;renderCards()}));
  search.addEventListener('input',renderCards);
  document.getElementById('modalClose').addEventListener('click',closeModal);
  document.getElementById('modalDone').addEventListener('click',closeModal);
  document.getElementById('diseaseModal').addEventListener('click',e=>{if(e.target.id==='diseaseModal')closeModal()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
  const menuToggle=document.getElementById('menuToggle'),nav=document.getElementById('mainNav');
  menuToggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuToggle.setAttribute('aria-expanded',String(open));menuToggle.textContent=open?'×':'☰'});
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menuToggle.setAttribute('aria-expanded','false');menuToggle.textContent='☰'}));
  const back=document.getElementById('backToTop');window.addEventListener('scroll',()=>back.classList.toggle('show',window.scrollY>500));back.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  renderCards();
})();
