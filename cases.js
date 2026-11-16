'use strict';
const dialog=document.querySelector('#case-dialog');
const groups=window.JLM_GALLERIES;
let current=null,index=0,opener=null,touchX=null,previousOverflow='';
const image=document.querySelector('#album-image');
function show(){window.jlmImage(image,'assets/'+current.images[index]);image.alt=current.captions[index]||current.title;document.querySelector('#album-caption').textContent=(index+1)+' / '+current.images.length+'　'+image.alt;document.querySelector('#album-prev').disabled=index===0;document.querySelector('#album-next').disabled=index===current.images.length-1;}
function move(step){index=Math.max(0,Math.min(current.images.length-1,index+step));show();}
document.querySelectorAll('[data-gallery]').forEach(button=>button.addEventListener('click',()=>{current=groups.find(g=>g.id===button.dataset.gallery);index=0;opener=button;document.querySelector('#album-title').textContent=current.title;document.querySelector('#album-source').textContent=current.source||'';show();previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';dialog.showModal();document.querySelector('#album-close').focus();}));
document.querySelector('#album-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{document.body.style.overflow=previousOverflow;opener?.focus();});
dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();move(-1)}if(e.key==='ArrowRight'){e.preventDefault();move(1)}});
document.querySelector('#album-prev').addEventListener('click',()=>move(-1));document.querySelector('#album-next').addEventListener('click',()=>move(1));
image.addEventListener('touchstart',e=>{touchX=e.changedTouches[0].clientX},{passive:true});image.addEventListener('touchend',e=>{if(touchX!==null){const delta=e.changedTouches[0].clientX-touchX;if(Math.abs(delta)>50)move(delta<0?1:-1)}touchX=null},{passive:true});
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));let count=0;document.querySelectorAll('[data-category]').forEach(card=>{card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter;if(!card.hidden)count++});document.querySelector('#case-count').textContent='顯示 '+count+' 組相簿';}));
