'use strict';
const $ = (selector) => document.querySelector(selector);
const series = {
 '板材': {number:'01',description:'以平整板材，承接家具面板、產品與展示製作的設計需求。',specs:['JLM-C-6079600｜7.9 × 600 mm','JLM-C-6009450｜9 × 450 mm','JLM-C-6012450｜12 × 450 mm','JLM-C-6015600｜15 × 600 mm','JLM-C-6019600｜19 × 600 mm']},
 '襯板': {number:'02',description:'以不同截面與尺寸，回應牆面、外飾面板與收邊的設計細節。',specs:['JLM-A-6010090｜10 × 90 mm','JLM-A-6015090｜15 × 90 mm','JLM-A-6014155｜14 × 155 mm','JLM-A-6015158｜15 × 158 mm']},
 '角材': {number:'03',description:'用於裝修框架與固定配置；依用途、支撐條件與尺寸評估製作方式。',specs:['JLM-A-6030030｜30 × 30 mm','JLM-A-6030040｜30 × 40 mm','JLM-A-6030060｜30 × 60 mm','JLM-A-6040050｜40 × 50 mm']}
};
const colors = [{name:'灰',hex:'#8c8e86'},{name:'白',hex:'#e8e6dc'},{name:'淺咖',hex:'#ba976f'},{name:'深咖',hex:'#73563d'},{name:'黑',hex:'#3a3d36'},{name:'木紋押花',hex:'#9b7550'}];
let chosenSeries='板材',chosenColor='淺咖',summary='';
function selection(){return document.querySelector('#uses button.active').textContent.trim()+' / '+chosenSeries+'系列 / '+$('#spec').value+' / '+chosenColor;}
function updateSelection(){$('#selection-result').textContent='目前選擇：'+selection();}
function updateSeries(){const data=series[chosenSeries];$('#series-number').textContent=data.number;$('#material-title').textContent=chosenSeries+'系列';$('#material-description').textContent=data.description;$('#spec').replaceChildren(...data.specs.map(value=>{const o=document.createElement('option');o.value=value;o.textContent=value;return o;}));updateSelection();}
for(const color of colors){const b=document.createElement('button');b.type='button';b.style.background=color.hex;b.setAttribute('aria-label',color.name+'（螢幕示意）');b.title=color.name;b.setAttribute('aria-pressed',String(color.name===chosenColor));if(color.name===chosenColor)b.classList.add('active');b.addEventListener('click',()=>{chosenColor=color.name;$('#color-name').textContent=chosenColor;document.querySelectorAll('#swatches button').forEach(button=>{const active=button===b;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});updateSelection();});$('#swatches').append(b);}
document.querySelectorAll('#uses button').forEach(b=>b.addEventListener('click',()=>{chosenSeries=b.dataset.use;document.querySelectorAll('#uses button').forEach(button=>{const active=button===b;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});updateSeries();}));
$('#spec').addEventListener('change',updateSelection);updateSeries();
function emailDraftUrl(text,keepText=false){return 'mailto:wishlite1111@gmail.com?subject='+encodeURIComponent(JLM_I18N.t('捷綠盟合作需求'))+'&body='+encodeURIComponent(keepText?text:JLM_I18N.t(text));}
function emailDraft(text,keepText=false){window.location.href=emailDraftUrl(text,keepText);}
let inquiryTypeChosen=false;
const inquiryType=$('#inquiry [name=type]');
inquiryType.addEventListener('change',()=>{inquiryTypeChosen=true;});
function addInquiry(text,type=null,source='一般合作'){
 const field=$('#message'), form=$('#inquiry');
 const hasUserInput=Array.from(form.querySelectorAll('input:not([type=hidden]),textarea')).some(input=>input.value.trim());
 const addition=JLM_I18N.t(text);
 const current=field.value;
 if(!current.includes(addition)){
  const combined=current+(current?'\n\n':'')+addition;
  if(combined.length>field.maxLength){$('#inquiry-prefill-status').textContent=JLM_I18N.t('需求文字已接近上限，原內容已保留，請自行補充。');}
  else{field.value=combined;$('#inquiry-prefill-status').textContent=JLM_I18N.t('已加入需求，原本填寫的內容已保留。');}
 }
 const conflict=type&&type!==inquiryType.value&&(inquiryTypeChosen||hasUserInput);
 if(type&&!inquiryTypeChosen&&!hasUserInput){inquiryType.value=type;inquiryTypeChosen=true;}
 if(conflict)$('#inquiry-prefill-status').textContent=JLM_I18N.t('已保留原合作類型，新入口資訊已加入需求來源。');
 const sources=$('#inquiry-source').value==='直接填寫'?[]:$('#inquiry-source').value.split(' / ');
 if(!sources.includes(source))sources.push(source);
 $('#inquiry-source').value=sources.join(' / ');
 $('#inquiry-result').hidden=true;
 $('#contact').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
 field.focus({preventScroll:true});
}
$('#add-material').addEventListener('click',()=>addInquiry('希望了解：'+selection(),'材料採購','選材規格'));
$('#menu').addEventListener('click',()=>{const open=$('#navigation').classList.toggle('open');$('#menu').setAttribute('aria-expanded',String(open));});
document.querySelectorAll('#navigation a').forEach(a=>a.addEventListener('click',()=>{$('#navigation').classList.remove('open');$('#menu').setAttribute('aria-expanded','false');}));
const projects=Object.fromEntries(window.JLM_GALLERIES.map(g=>[g.id,g]));
let currentProject='',photoIndex=0,featuredProject='exhibition',touchStart=null;
let allCasesExpanded=false;
$('#show-all-cases').addEventListener('click',()=>{allCasesExpanded=!allCasesExpanded;document.querySelectorAll('#project-filters button').forEach(b=>{const active=b.dataset.filter==='all';b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});document.querySelectorAll('.project-card').forEach((card,i)=>card.hidden=!allCasesExpanded&&i>=6);$('#show-all-cases').textContent=allCasesExpanded?'收起案例 ↑':'查看全部案例（20 組） ↓';$('#show-all-cases').setAttribute('aria-expanded',String(allCasesExpanded));$('#gallery-status').textContent=allCasesExpanded?'顯示全部 20 組圖集':'精選 6 組案例';});
document.querySelectorAll('#project-filters button').forEach(b=>b.addEventListener('click',()=>{
 document.querySelectorAll('#project-filters button').forEach(button=>{const active=button===b;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
 let visible=0;document.querySelectorAll('.project-card').forEach(card=>{card.hidden=b.dataset.filter!=='all'&&card.dataset.category!==b.dataset.filter;if(!card.hidden)visible++;});
 allCasesExpanded=true;$('#show-all-cases').textContent='收起案例 ↑';$('#show-all-cases').setAttribute('aria-expanded','true');$('#gallery-status').textContent='顯示 '+visible+' 組圖集';
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
 featuredProject=b.dataset.feature;const p=projects[featuredProject];const featurePhoto=featuredProject==='terrace'?1:0;$('#feature-image').src='assets/'+p.images[featurePhoto];$('#feature-image').alt=p.title+'・'+p.captions[featurePhoto];$('#feature-label').textContent=p.label;$('#feature-title').textContent=p.title;$('#feature-description').textContent=p.subtitle;
 document.querySelectorAll('[data-feature]').forEach(button=>{button.classList.toggle('active',button===b);button.setAttribute('aria-pressed',String(button===b));});
}));

$('#photo-previous').addEventListener('click',()=>showPhoto(photoIndex-1));$('#photo-next').addEventListener('click',()=>showPhoto(photoIndex+1));
$('#project-dialog').addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();showPhoto(photoIndex+1);}if(e.key==='ArrowLeft'){e.preventDefault();showPhoto(photoIndex-1);}});
$('.dialog-photo').addEventListener('touchstart',e=>{touchStart={x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY};},{passive:true});
$('.dialog-photo').addEventListener('touchend',e=>{if(!touchStart)return;const dx=e.changedTouches[0].clientX-touchStart.x,dy=e.changedTouches[0].clientY-touchStart.y;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5)showPhoto(photoIndex+(dx<0?1:-1));touchStart=null;},{passive:true});
$('.dialog-close').addEventListener('click',()=>$('#project-dialog').close());
$('#project-dialog').addEventListener('click',e=>{const rect=e.currentTarget.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)e.currentTarget.close();});
$('#project-inquiry').addEventListener('click',()=>{$('#project-dialog').close();addInquiry('希望提出空間應用需求：'+projects[currentProject].title,'空間／展場應用','案例應用');});
function prepareInquirySummary(){const data=new FormData($('#inquiry'));summary=[JLM_I18N.t('捷綠盟合作需求'),JLM_I18N.t('聯絡人：')+data.get('name'),JLM_I18N.t('公司／單位：')+(data.get('company')||JLM_I18N.t('未填寫')),'Email: '+data.get('email'),JLM_I18N.t('計畫類型：')+JLM_I18N.t(data.get('type')),JLM_I18N.t('需求來源：')+String(data.get('source')).split(' / ').map(source=>JLM_I18N.t(source)).join(' / '),'',JLM_I18N.t('需求內容：'),data.get('message')].join('\n');$('#summary-text').textContent=summary;$('#inquiry-result').hidden=false;$('#copy-status').textContent='';}
$('#inquiry').addEventListener('submit',e=>{e.preventDefault();prepareInquirySummary();});
document.addEventListener('jlm-language-change',()=>{if(!$('#inquiry-result').hidden)prepareInquirySummary();});
$('#inquiry').addEventListener('input',()=>{$('#inquiry-result').hidden=true;});
$('#download-summary').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob(['\ufeff'+summary],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=JLM_I18N.t('捷綠盟-合作需求.txt');document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);});
$('#year').textContent=new Date().getFullYear();

document.querySelectorAll('.service-inquiry').forEach(b=>b.addEventListener('click',()=>{const type=b.dataset.type==='其他合作'?'技術合作':b.dataset.type;addInquiry(b.dataset.inquiry,type,type);}));

// Opening gallery: pause on focus/hover, hidden pages and reduced motion.
const bannerProjects=['exhibition','commercial','terrace'];
let bannerIndex=0,bannerTimer=null,bannerPaused=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const banner=$('.case-banner');
function renderBanner(index){bannerIndex=(index+bannerProjects.length)%bannerProjects.length;document.querySelectorAll('.banner-image').forEach((img,i)=>img.classList.toggle('active',i===bannerIndex));document.querySelectorAll('[data-banner]').forEach((button,i)=>{button.classList.toggle('active',i===bannerIndex);button.setAttribute('aria-pressed',String(i===bannerIndex));});const item=projects[bannerProjects[bannerIndex]];$('#banner-title').textContent=item.title;$('#banner-label').textContent=item.label;$('.banner-case small').textContent=item.source;}
function scheduleBanner(){clearInterval(bannerTimer);if(!bannerPaused&&!document.hidden&&!banner.matches(':hover')&&!banner.contains(document.activeElement))bannerTimer=setInterval(()=>renderBanner(bannerIndex+1),6500);$('#banner-pause').textContent=bannerPaused?'播放':'暫停';$('#banner-pause').setAttribute('aria-label',bannerPaused?'開始自動輪播':'暫停自動輪播');$('#banner-pause').setAttribute('aria-pressed',String(bannerPaused));}
$('#banner-prev').addEventListener('click',()=>{renderBanner(bannerIndex-1);scheduleBanner();});$('#banner-next').addEventListener('click',()=>{renderBanner(bannerIndex+1);scheduleBanner();});document.querySelectorAll('[data-banner]').forEach(button=>button.addEventListener('click',()=>{renderBanner(Number(button.dataset.banner));scheduleBanner();}));$('#banner-pause').addEventListener('click',()=>{bannerPaused=!bannerPaused;scheduleBanner();});$('#banner-open').addEventListener('click',()=>openProject(bannerProjects[bannerIndex]));banner.addEventListener('mouseenter',()=>clearInterval(bannerTimer));banner.addEventListener('mouseleave',scheduleBanner);banner.addEventListener('focusin',()=>clearInterval(bannerTimer));banner.addEventListener('focusout',()=>setTimeout(scheduleBanner,0));document.addEventListener('visibilitychange',scheduleBanner);window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',e=>{bannerPaused=e.matches;scheduleBanner();});scheduleBanner();



// All entry points prepare a draft locally; nothing is sent by this website.
document.querySelectorAll('[data-inquiry-source]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();addInquiry('需求來源：'+a.dataset.inquirySource,a.dataset.inquiryType||null,a.dataset.inquirySource);}));
$('#open-email-draft').addEventListener('click',()=>emailDraft(summary,true));
$('#copy-summary').addEventListener('click',async()=>{
 try{await navigator.clipboard.writeText(summary);$('#copy-status').textContent=JLM_I18N.t('已複製需求摘要，尚未寄出。');}
 catch(error){$('#copy-status').textContent=JLM_I18N.t('無法自動複製，請選取上方摘要手動複製，或下載摘要。');const range=document.createRange();range.selectNodeContents($('#summary-text'));const selected=window.getSelection();selected.removeAllRanges();selected.addRange(range);}
});
