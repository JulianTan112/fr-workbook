
(function(){
  const completedKey='faWorkbookV8Completed';
  const themeKey='faWorkbookV8Theme';
  const quizKey='faWorkbookV8Quiz';
  const completed=new Set(JSON.parse(localStorage.getItem(completedKey)||'[]'));
  function saveCompleted(){localStorage.setItem(completedKey,JSON.stringify([...completed]));updateProgress();}
  function updateProgress(){const el=document.getElementById('doneCount'); if(el) el.textContent=completed.size; document.querySelectorAll('[data-complete]').forEach(cb=>{cb.checked=completed.has(cb.dataset.complete)});}
  document.addEventListener('change',e=>{if(e.target.matches('[data-complete]')){e.target.checked?completed.add(e.target.dataset.complete):completed.delete(e.target.dataset.complete);saveCompleted();}});
  const s=document.getElementById('siteSearch');
  if(s){s.addEventListener('input',()=>{const q=s.value.trim().toLowerCase();document.querySelectorAll('.searchable').forEach(el=>{const hay=(el.dataset.search||el.textContent||'').toLowerCase();el.classList.toggle('hidden-by-search',q && !hay.includes(q));});});}
  const warm=document.getElementById('warmToggle');
  if(localStorage.getItem(themeKey)==='cool') document.body.classList.add('cool');
  if(warm){warm.textContent=document.body.classList.contains('cool')?'Neutral mode':'Warm mode';warm.addEventListener('click',()=>{document.body.classList.toggle('cool');localStorage.setItem(themeKey,document.body.classList.contains('cool')?'cool':'warm');warm.textContent=document.body.classList.contains('cool')?'Neutral mode':'Warm mode';});}
  document.querySelectorAll('[data-save]').forEach(t=>{const k='faWorkbookV8Draft:'+t.dataset.save;t.value=localStorage.getItem(k)||'';t.addEventListener('input',()=>localStorage.setItem(k,t.value));});
  document.querySelectorAll('[data-toggle]').forEach(btn=>btn.addEventListener('click',()=>{const id=btn.dataset.toggle;const panel=document.getElementById(id);if(!panel)return;panel.hidden=!panel.hidden;document.querySelectorAll(`[data-toggle="${id}"]`).forEach(b=>{if(b.classList.contains('answer-toggle')) b.textContent=panel.hidden?'Show model answer':'Hide model answer';});if(!panel.hidden) panel.scrollIntoView({behavior:'smooth',block:'nearest'});}));
  document.querySelectorAll('[data-q]').forEach(btn=>btn.addEventListener('click',()=>{const group=btn.closest('.quiz-item');const correct=btn.dataset.correct==='1';group.querySelectorAll('[data-q]').forEach(b=>{b.classList.remove('correct','wrong');b.disabled=true;});btn.classList.add(correct?'correct':'wrong');const fb=group.querySelector('.feedback');if(fb){fb.classList.add('show');fb.innerHTML=(correct?'Correct. ':'Review this. ')+fb.dataset.why;}const scores=JSON.parse(localStorage.getItem(quizKey)||'{}');scores[group.dataset.module]=(scores[group.dataset.module]||{right:0,total:0});scores[group.dataset.module].total+=1;if(correct)scores[group.dataset.module].right+=1;localStorage.setItem(quizKey,JSON.stringify(scores));}));
  document.querySelectorAll('.flash').forEach(card=>card.addEventListener('click',()=>card.classList.toggle('flipped')));
  let dragged=null;document.querySelectorAll('.drag-item').forEach(item=>{item.addEventListener('dragstart',()=>{dragged=item;setTimeout(()=>item.style.opacity=.4,0)});item.addEventListener('dragend',()=>{item.style.opacity=1;dragged=null;});});
  document.querySelectorAll('.drop-zone,.drag-bank').forEach(zone=>{zone.addEventListener('dragover',e=>{e.preventDefault();zone.classList.add('over')});zone.addEventListener('dragleave',()=>zone.classList.remove('over'));zone.addEventListener('drop',e=>{e.preventDefault();zone.classList.remove('over');if(dragged)zone.appendChild(dragged);});});
  document.querySelectorAll('[data-check-drag]').forEach(btn=>btn.addEventListener('click',()=>{const ex=btn.dataset.checkDrag;let total=0,right=0;document.querySelectorAll(`[data-ex="${ex}"] .drag-item, [data-bank="${ex}"] .drag-item`).forEach(item=>{total++;const z=item.closest('.drop-zone');if(z&&z.dataset.zone===item.dataset.answer){right++;item.classList.add('correct');item.classList.remove('wrong')}else{item.classList.add('wrong');item.classList.remove('correct')}});const out=document.getElementById('score-'+ex);if(out)out.textContent=`Score: ${right}/${total}. Items left in the bank are incomplete.`;}));

  const topBtn=document.querySelector('.back-top-floating');
  if(topBtn){
    const syncTop=()=>{topBtn.style.opacity=window.scrollY>450?'1':'.55';};
    window.addEventListener('scroll',syncTop,{passive:true});
    syncTop();
  }

  function enhanceWideTables(){
    document.querySelectorAll('.table-wrap').forEach((wrap, idx)=>{
      if(wrap.dataset.scrollEnhanced === '1') return;
      const table = wrap.querySelector('table');
      if(!table) return;
      const caption = (table.querySelector('caption')?.textContent || '').trim();
      const shouldForce = wrap.classList.contains('no-truncate') || wrap.classList.contains('sticky-head') || wrap.classList.contains('tall-table') || caption.length > 0;
      if(shouldForce) wrap.classList.add('force-scroll');
      const needsScroll = shouldForce || wrap.scrollWidth > wrap.clientWidth + 8 || table.scrollWidth > wrap.clientWidth + 8;
      if(!needsScroll) return;
      wrap.dataset.scrollEnhanced = '1';
      wrap.classList.add('is-scrollable');
      const controls = document.createElement('div');
      controls.className = 'table-scroll-controls';
      controls.innerHTML = '<span class="scroll-hint">↔ Scroll table left/right — use the buttons or the horizontal scrollbar.</span><span class="scroll-buttons"><button type="button" data-scroll-left>← Left</button><button type="button" data-scroll-right>Right →</button></span>';
      wrap.parentNode.insertBefore(controls, wrap);
      const leftBtn = controls.querySelector('[data-scroll-left]');
      const rightBtn = controls.querySelector('[data-scroll-right]');
      const step = () => Math.max(260, Math.floor(wrap.clientWidth * 0.72));
      const sync = () => {
        leftBtn.disabled = wrap.scrollLeft <= 2;
        rightBtn.disabled = wrap.scrollLeft + wrap.clientWidth >= wrap.scrollWidth - 2;
      };
      leftBtn.addEventListener('click', () => wrap.scrollBy({left:-step(), behavior:'smooth'}));
      rightBtn.addEventListener('click', () => wrap.scrollBy({left:step(), behavior:'smooth'}));
      wrap.addEventListener('scroll', sync, {passive:true});
      window.addEventListener('resize', sync, {passive:true});
      setTimeout(sync, 0);
    });
  }
  window.addEventListener('load', enhanceWideTables);
  enhanceWideTables();

  updateProgress();
})();
