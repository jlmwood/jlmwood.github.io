(() => {
  'use strict';
  const links = [...document.querySelectorAll('a[href*="jlm-catalog-company-20261013.pdf"]:not([download])')];
  if (!links.length || !window.HTMLDialogElement) return;
  const dialog = document.createElement('dialog');
  dialog.id = 'catalog-reader';
  dialog.setAttribute('aria-labelledby','catalog-reader-title');
  dialog.innerHTML = `<header class="reader-toolbar"><h2 id="catalog-reader-title" class="reader-title">捷綠盟・產品目錄</h2><a class="reader-download" href="${links[0].getAttribute('href')}" download="捷綠盟-2026材料與空間目錄.pdf">下載 PDF ↓</a><button type="button" class="reader-close" aria-label="關閉目錄">✕</button></header><div class="reader-stage"><button type="button" class="reader-prev" aria-label="目錄上一頁">‹</button><div class="reader-page"><img class="reader-image" alt="" decoding="async"><div class="reader-links"></div><p class="reader-status" role="status"></p><p class="reader-text"></p></div><button type="button" class="reader-next" aria-label="目錄下一頁">›</button></div><footer class="reader-footer"><span class="reader-counter" aria-live="polite"></span><span class="reader-hint">左右滑動或按箭頭換頁</span></footer>`;
  document.body.append(dialog);
  const image=dialog.querySelector('.reader-image'),status=dialog.querySelector('.reader-status'),counter=dialog.querySelector('.reader-counter'),prev=dialog.querySelector('.reader-prev'),next=dialog.querySelector('.reader-next'),stage=dialog.querySelector('.reader-stage');
  const linkLayer=dialog.querySelector('.reader-links');
  const sizeLinks=()=>{if(!pages)return;const box=dialog.querySelector('.reader-page');const w=Math.min(box.clientWidth,box.clientHeight*pages[page].ratio);linkLayer.style.width=w+'px';linkLayer.style.height=(w/pages[page].ratio)+'px';};
  new ResizeObserver(sizeLinks).observe(dialog.querySelector('.reader-page'));
  let pages=null,page=0,opener=null,scrollY=0,oldOverflow='',start=null;
  const render = () => {
    if(!pages)return;
    image.alt=`捷綠盟產品目錄，第 ${page+1} 頁，共 ${pages.length} 頁`;
    status.textContent='載入中…';
    image.src=pages[page].src;
    counter.textContent=`${String(page+1).padStart(2,'0')} / ${pages.length}`;
    dialog.querySelector('.reader-text').textContent=pages[page].text;
    linkLayer.replaceChildren();
    for(const l of pages[page].links||[]){const a=document.createElement(l.href?'a':'button');a.className='reader-page-link';a.setAttribute('aria-label',l.label||(l.href?'開啟連結':`跳至第 ${l.page+1} 頁`));if(l.href){a.href=l.href;a.target='_blank';a.rel='noopener';}else{a.type='button';a.onclick=()=>{page=l.page;render();};}Object.assign(a.style,{left:(l.x*100)+'%',top:(l.y*100)+'%',width:(l.w*100)+'%',height:(l.h*100)+'%'});linkLayer.append(a);}
    sizeLinks();
    prev.disabled=page===0;next.disabled=page===pages.length-1;
    for(const i of [page-1,page+1])if(pages[i]){const preload=new Image();preload.src=pages[i].src;}
  };
  image.addEventListener('load',()=>{status.textContent='';});
  image.addEventListener('error',()=>{status.textContent='圖片暫時無法載入，請下載 PDF 閱讀。';});
  const turn=d=>{if(!pages)return;const n=Math.max(0,Math.min(pages.length-1,page+d));if(n!==page){page=n;render();}};
  links.forEach(link=>link.addEventListener('click',async event=>{
    if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
    event.preventDefault();opener=link;scrollY=window.scrollY;oldOverflow=document.body.style.overflow;document.body.style.overflow='hidden';dialog.showModal();status.textContent='載入目錄…';
    try{if(!pages){const res=await fetch('catalog-pages.json');if(!res.ok)throw Error('catalog');pages=await res.json();}render();}
    catch(e){dialog.close();window.location.href=link.href;}
  }));
  prev.addEventListener('click',()=>turn(-1));next.addEventListener('click',()=>turn(1));
  dialog.querySelector('.reader-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('keydown',e=>{if(pages&&(e.key==='Home'||e.key==='End')){e.preventDefault();page=e.key==='Home'?0:pages.length-1;render();return;}if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();turn(e.key==='ArrowLeft'?-1:1);}});
  dialog.addEventListener('close',()=>{document.body.style.overflow=oldOverflow;opener?.focus({preventScroll:true});window.scrollTo(0,scrollY);});
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
  stage.addEventListener('touchstart',e=>{start=e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY}:null;},{passive:true});
  stage.addEventListener('touchend',e=>{if(!start||!e.changedTouches.length)return;const dx=e.changedTouches[0].clientX-start.x,dy=e.changedTouches[0].clientY-start.y;start=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.5)turn(dx<0?1:-1);},{passive:true});
  stage.addEventListener('touchcancel',()=>{start=null;},{passive:true});
})();
