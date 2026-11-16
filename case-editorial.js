"use strict";
document.addEventListener('DOMContentLoaded',()=>{let selected='exhibition';
function detail(){const g=window.JLM_GALLERIES.find(x=>x.id===selected);if(!g)return;const i=selected==='terrace'?0:Math.min(1,g.images.length-1);const img=document.querySelector('#case-detail-image');img.src='assets/'+g.images[i];img.alt=g.captions[i];document.querySelector('#case-detail-focus').textContent='應用重點｜'+g.focus;}
document.querySelectorAll('[data-feature]').forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.feature;detail();}));
document.querySelector('#case-open-album').addEventListener('click',()=>{const card=[...document.querySelectorAll('.project-card')].find(c=>c.dataset.project===selected);if(card)card.click();});detail();});
