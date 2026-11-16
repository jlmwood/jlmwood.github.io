"use strict";
(()=>{
 const cards=[...document.querySelectorAll('[data-series-pick]')];
 function sync(){const active=document.querySelector('#uses button.active')?.dataset.use;cards.forEach(b=>{const selected=b.dataset.seriesPick===active;b.setAttribute('aria-pressed',String(selected));b.closest('article').classList.toggle('is-selected',selected);});}
 cards.forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('#uses button').forEach(use=>{if(use.dataset.use===b.dataset.seriesPick)use.click();});document.querySelector('#material-specifications').scrollIntoView({behavior:'instant',block:'start'});document.querySelector('#spec').focus({preventScroll:true});sync();}));
 document.querySelectorAll('#uses button').forEach(b=>b.addEventListener('click',sync));sync();
})();
