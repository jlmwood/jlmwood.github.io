'use strict';
const $ = (selector) => document.querySelector(selector);
const series = {
 '板材': {number:'01',description:'以平整板材，承接家具面板、產品與展示製作的設計需求。',specs:['JLM-C-6079600｜7.9 × 600 mm','JLM-C-6009450｜9 × 450 mm','JLM-C-6012450｜12 × 450 mm','JLM-C-6015600｜15 × 600 mm','JLM-C-6019600｜19 × 600 mm']},
 '襯板': {number:'02',description:'以不同截面與尺寸，回應牆面、外飾面板與收邊的設計細節。',specs:['JLM-A-6010090｜10 × 90 mm','JLM-A-6015090｜15 × 90 mm','JLM-A-6014155｜14 × 155 mm','JLM-A-6015158｜15 × 158 mm']},
 '角材': {number:'03',description:'用於裝修框架與固定配置；依用途、支撐條件與尺寸評估製作方式。',specs:['JLM-A-6030030｜30 × 30 mm','JLM-A-6030040｜30 × 40 mm','JLM-A-6030060｜30 × 60 mm','JLM-A-6040050｜40 × 50 mm']}
};
const colors = [{name:'灰',hex:'#8c8e86'},{name:'白',hex:'#e8e6dc'},{name:'淺咖',hex:'#ba976f'},{name:'深咖',hex:'#73563d'},{name:'黑',hex:'#3a3d36'},{name:'木紋押花',hex:'#9b7550'}];
let chosenSeries='板材',chosenColor='淺咖',summary='';
function selection(){return chosenSeries+'系列 / '+$('#spec').value+' / '+chosenColor;}
function updateSelection(){$('#selection-result').textContent='目前選擇：'+selection();}
function updateSeries(){const data=series[chosenSeries];$('#series-number').textContent=data.number;$('#material-title').textContent=chosenSeries+'系列';$('#material-description').textContent=data.description;$('#spec').replaceChildren(...data.specs.map(value=>{const o=document.createElement('option');o.value=value;o.textContent=value;return o;}));updateSelection();}
for(const color of colors){const b=document.createElement('button');b.type='button';b.style.background=color.hex;b.setAttribute('aria-label',color.name+'（螢幕示意）');b.title=color.name;b.setAttribute('aria-pressed',String(color.name===chosenColor));if(color.name===chosenColor)b.classList.add('active');b.addEventListener('click',()=>{chosenColor=color.name;$('#color-name').textContent=chosenColor;document.querySelectorAll('#swatches button').forEach(button=>{const active=button===b;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});updateSelection();});$('#swatches').append(b);}
document.querySelectorAll('#uses button').forEach(b=>b.addEventListener('click',()=>{chosenSeries=b.dataset.use;document.querySelectorAll('#uses button').forEach(button=>{const active=button===b;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});updateSeries();}));
$('#spec').addEventListener('change',updateSelection);updateSeries();
function addInquiry(text){const message=$('#message');message.value=(message.value?message.value+'\n':'')+text;$('#contact').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});message.focus({preventScroll:true});}
$('#add-material').addEventListener('click',()=>addInquiry('希望了解：'+selection()));
$('#menu').addEventListener('click',()=>{const open=$('#navigation').classList.toggle('open');$('#menu').setAttribute('aria-expanded',String(open));});
document.querySelectorAll('#navigation a').forEach(a=>a.addEventListener('click',()=>{$('#navigation').classList.remove('open');$('#menu').setAttribute('aria-expanded','false');}));
const projects=Object.fromEntries(window.JLM_GALLERIES.map(g=>[g.id,g]));
let currentProject='',photoIndex=0,featuredProject='exhibition',touchStart=null;
document.querySelectorAll('#project-filters button').forEach(b=>b.addEventListener('click',()=>{
 document.querySelectorAll('#project-filters button').forEach(button=>{const active=button===b;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
 let visible=0;document.querySelectorAll('.project-card').forEach(card=>{card.hidden=b.dataset.filter!=='all'&&card.dataset.category!==b.dataset.filter;if(!card.hidden)visible++;});
 $('#gallery-status').textContent='顯示 '+visible+' 組圖集';
}));
function showPhoto(index){
 const p=projects[currentProject];photoIndex=(index+p.images.length)%p.images.length;
 const image=$('#dialog-image');image.src='assets/'+p.images[photoIndex];image.alt=p.title+'・'+p.captions[photoIndex];
 $('#photo-counter').textContent=String(photoIndex+1).padStart(2,'0')+' / '+String(p.images.length).padStart(2,'0');
 $('#photo-caption').textContent=p.captions[photoIndex];
 document.querySelectorAll('#photo-thumbnails button').forEach((b,i)=>{b.classList.toggle('active',i===photoIndex);b.setAttribute('aria-pressed',String(i===photoIndex));});
}
function openProject(id){
 currentProject=id;const p=projects[id];
 $('#dialog-label').textContent=p.label;$('#dialog-title').textContent=p.title;$('#dialog-description').textContent=p.description;
 $('#dialog-focus').textContent=p.focus;$('#dialog-source').textContent=p.source;
 $('#photo-thumbnails').replaceChildren(...p.images.map((file,i)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label','查看第 '+(i+1)+' 張：'+p.captions[i]);const img=document.createElement('img');img.src='assets/'+file;img.alt='';b.append(img);b.addEventListener('click',()=>showPhoto(i));return b;}));
 $('#photo-thumbnails').hidden=p.images.length===1;$('#photo-next').hidden=p.images.length===1;$('#photo-previous').hidden=p.images.length===1;
 showPhoto(0);$('#project-dialog').showModal();$('#project-dialog').scrollTop=0;
}
document.querySelectorAll('[data-project]').forEach(b=>b.addEventListener('click',()=>openProject(b.dataset.project)));
document.querySelectorAll('[data-feature]').forEach(b=>b.addEventListener('click',()=>{
 featuredProject=b.dataset.feature;const p=projects[featuredProject];$('#feature-image').src='assets/'+p.images[0];$('#feature-image').alt=p.title+'・'+p.captions[0];$('#feature-label').textContent=p.label;$('#feature-title').textContent=p.title;$('#feature-description').textContent=p.subtitle;
 document.querySelectorAll('[data-feature]').forEach(button=>{button.classList.toggle('active',button===b);button.setAttribute('aria-pressed',String(button===b));});
}));
$('#feature-open').addEventListener('click',()=>openProject(featuredProject));
$('#photo-previous').addEventListener('click',()=>showPhoto(photoIndex-1));$('#photo-next').addEventListener('click',()=>showPhoto(photoIndex+1));
$('#project-dialog').addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();showPhoto(photoIndex+1);}if(e.key==='ArrowLeft'){e.preventDefault();showPhoto(photoIndex-1);}});
$('.dialog-photo').addEventListener('touchstart',e=>{touchStart={x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY};},{passive:true});
$('.dialog-photo').addEventListener('touchend',e=>{if(!touchStart)return;const dx=e.changedTouches[0].clientX-touchStart.x,dy=e.changedTouches[0].clientY-touchStart.y;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5)showPhoto(photoIndex+(dx<0?1:-1));touchStart=null;},{passive:true});
$('.dialog-close').addEventListener('click',()=>$('#project-dialog').close());
$('#project-dialog').addEventListener('click',e=>{const rect=e.currentTarget.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)e.currentTarget.close();});
$('#project-inquiry').addEventListener('click',()=>{$('#project-dialog').close();addInquiry('希望提出空間應用需求：'+projects[currentProject].title);});
$('#inquiry').addEventListener('submit',e=>{e.preventDefault();const data=new FormData(e.currentTarget);summary=['捷綠盟合作需求','聯絡人：'+data.get('name'),'公司／單位：'+(data.get('company')||'未填寫'),'Email：'+data.get('email'),'計畫類型：'+data.get('type'),'','需求內容：',data.get('message')].join('\n');$('#summary-text').textContent=summary;$('#email-draft').href='mailto:Eco@jlmwood.com?subject='+encodeURIComponent('捷綠盟合作詢問｜'+data.get('type'))+'&body='+encodeURIComponent(summary);$('#inquiry-result').hidden=false;$('#inquiry-result').scrollIntoView({block:'nearest',behavior:'smooth'});});
$('#inquiry').addEventListener('input',()=>{$('#inquiry-result').hidden=true;});
$('#download-summary').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob(['\ufeff'+summary],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='捷綠盟-合作需求.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);});
$('#year').textContent=new Date().getFullYear();

document.querySelectorAll('.service-inquiry').forEach(b=>b.addEventListener('click',()=>{document.querySelector('#inquiry select[name=type]').value=b.dataset.type;addInquiry(b.dataset.inquiry);}));

// Opening gallery: pause on focus/hover, hidden pages and reduced motion.
const bannerProjects=['exhibition','commercial','terrace'];
let bannerIndex=0,bannerTimer=null,bannerPaused=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const banner=$('.case-banner');
function renderBanner(index){banner.classList.toggle('is-sunny',bannerProjects[(index+bannerProjects.length)%bannerProjects.length]==='terrace');bannerIndex=(index+bannerProjects.length)%bannerProjects.length;document.querySelectorAll('.banner-image').forEach((img,i)=>img.classList.toggle('active',i===bannerIndex));document.querySelectorAll('[data-banner]').forEach((button,i)=>{button.classList.toggle('active',i===bannerIndex);button.setAttribute('aria-pressed',String(i===bannerIndex));});const item=projects[bannerProjects[bannerIndex]];$('#banner-title').textContent=item.title;$('#banner-label').textContent=item.label;$('.banner-case small').textContent=item.source;}
function scheduleBanner(){clearInterval(bannerTimer);if(!bannerPaused&&!document.hidden&&!banner.matches(':hover')&&!banner.contains(document.activeElement))bannerTimer=setInterval(()=>renderBanner(bannerIndex+1),6500);$('#banner-pause').textContent=bannerPaused?'播放':'暫停';$('#banner-pause').setAttribute('aria-label',bannerPaused?'開始自動輪播':'暫停自動輪播');$('#banner-pause').setAttribute('aria-pressed',String(bannerPaused));}
$('#banner-prev').addEventListener('click',()=>{renderBanner(bannerIndex-1);scheduleBanner();});$('#banner-next').addEventListener('click',()=>{renderBanner(bannerIndex+1);scheduleBanner();});document.querySelectorAll('[data-banner]').forEach(button=>button.addEventListener('click',()=>{renderBanner(Number(button.dataset.banner));scheduleBanner();}));$('#banner-pause').addEventListener('click',()=>{bannerPaused=!bannerPaused;scheduleBanner();});$('#banner-open').addEventListener('click',()=>openProject(bannerProjects[bannerIndex]));banner.addEventListener('mouseenter',()=>clearInterval(bannerTimer));banner.addEventListener('mouseleave',scheduleBanner);banner.addEventListener('focusin',()=>clearInterval(bannerTimer));banner.addEventListener('focusout',()=>setTimeout(scheduleBanner,0));document.addEventListener('visibilitychange',scheduleBanner);window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',e=>{bannerPaused=e.matches;scheduleBanner();});scheduleBanner();

if(window.matchMedia('(max-width:700px)').matches){renderBanner(2);scheduleBanner();}
