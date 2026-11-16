"use strict";
document.addEventListener('DOMContentLoaded',()=>{
 const films=document.querySelector('.collaboration-films-grid');
 const covers=['assets/project-000.jpg','assets/boards-real-8.jpg','assets/project-000.jpg'];
 // Use each case's existing photo where available.
 const groups=window.JLM_GALLERIES||[];
 
 [...films.children].forEach((article,i)=>{
  const frame=article.querySelector('iframe');if(!frame)return;
  const title=frame.title;const src=frame.src;
  const g=groups.find(g=>(i===0?/雄獅/.test(g.title):i===1?/澎湖/.test(g.title):/亞太/.test(g.title)));
  const poster=document.createElement('button');poster.type='button';poster.className='jlm-video-poster';poster.setAttribute('aria-label','播放影片：'+title);
  const img=document.createElement('img');img.loading='lazy';window.jlmImage(img,g?'assets/'+g.images[0]:covers[i],'(max-width: 600px) 85vw, 550px');img.alt=title;const icon=document.createElement('span');icon.textContent='▶';icon.setAttribute('aria-hidden','true');poster.append(img,icon);
  frame.replaceWith(poster);poster.addEventListener('click',()=>{frame.src=src+(src.includes('?')?'&':'?')+'autoplay=1';poster.replaceWith(frame);});
  article.addEventListener('carousel:inactive',()=>{if(frame.isConnected){frame.src='about:blank';frame.replaceWith(poster);}});
 });
 function setup(selector,oldControls,label,initial){
  const track=document.querySelector(selector);if(!track)return;
  document.querySelector(oldControls)?.remove();
  const wrap=document.createElement('div');wrap.className='jlm-carousel';wrap.setAttribute('role','region');wrap.setAttribute('aria-label',label);track.before(wrap);wrap.append(track);track.classList.add('jlm-track');track.tabIndex=0;track.setAttribute('aria-label',label+'，可左右滑動');
  const prev=document.createElement('button'),next=document.createElement('button'),status=document.createElement('p');
  [prev,next].forEach((b,i)=>{b.type='button';b.className='jlm-arrow '+(i?'next':'prev');b.textContent=i?'›':'‹';b.setAttribute('aria-label',(i?'下一個':'上一個')+label);wrap.append(b);});status.className='jlm-carousel-status';wrap.append(status);
  let current=null,timer;const slides=()=>[...track.children].filter(e=>!e.hidden);
  const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  function update(){const list=slides();const mid=track.getBoundingClientRect().left+track.clientWidth/2;current=list.reduce((best,e)=>Math.abs(e.getBoundingClientRect().left+e.getBoundingClientRect().width/2-mid)<Math.abs(best.getBoundingClientRect().left+best.getBoundingClientRect().width/2-mid)?e:best,list[0]);[...track.children].forEach(e=>{e.classList.add('jlm-slide');const active=e===current;e.classList.toggle('is-current',active);if(!active)e.dispatchEvent(new Event('carousel:inactive'));});const i=list.indexOf(current);prev.disabled=i<=0;next.disabled=i>=list.length-1;status.textContent=list.length?(i+1)+' / '+list.length+(list.length>1?'　左右滑動，探索更多':''):'暫無內容';}
  function center(el,smooth=true){if(!el)return;const left=track.scrollLeft+el.getBoundingClientRect().left-track.getBoundingClientRect().left+(el.getBoundingClientRect().width-track.clientWidth)/2;track.scrollTo({left,behavior:smooth&&!reduced()?'smooth':'instant'});requestAnimationFrame(update);}
  function move(d){const list=slides();center(list[Math.max(0,Math.min(list.length-1,list.indexOf(current)+d))]);}
  prev.onclick=()=>move(-1);next.onclick=()=>move(1);track.addEventListener('keydown',e=>{if(e.target!==track)return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();move(e.key==='ArrowRight'?1:-1);}});
  track.addEventListener('scroll',()=>{clearTimeout(timer);timer=setTimeout(update,90);},{passive:true});
  [...track.children].forEach(e=>e.classList.add('jlm-slide'));
  requestAnimationFrame(()=>center(slides()[initial]||slides()[0],false));
  new ResizeObserver(()=>center(current||slides()[initial]||slides()[0],false)).observe(track);
  if(selector==='.project-grid')document.querySelectorAll('#project-filters button').forEach(b=>b.addEventListener('click',()=>requestAnimationFrame(()=>requestAnimationFrame(()=>center(slides()[Math.min(1,slides().length-1)],false)))));
 }
 setup('.collaboration-films-grid','.no-film-controls','合作影片',1);
 setup('.project-grid','.case-slider-controls','應用案例',3);
 setup('.material-evidence-grid','.material-slider-controls','材料照片',1);
});
