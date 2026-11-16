"use strict";
document.addEventListener('DOMContentLoaded',()=>{
 const series={boards:'板材',profiles:'角材',cladding:'襯板'};
 function selectSeries(key){const name=series[key];if(!name)return;document.querySelectorAll('#uses button').forEach(b=>{if(b.dataset.use===name)b.click();});}
 const initial=new URLSearchParams(location.search).get('series');selectSeries(initial);
 const box=document.querySelector('#case-material-links');
 const mapping={exhibition:[['boards','板材規格'],['profiles','角材規格']],commercial:[['boards','板材規格'],['cladding','襯板規格']],terrace:[[null,'比較材料系列與規格']]};
 function render(id){box.replaceChildren();const label=document.createElement('p');label.className='connection-label';label.textContent='延伸選材';box.append(label);const links=document.createElement('div');links.className='connection-links';for(const [key,text] of mapping[id]||[]){const a=document.createElement('a');a.textContent=text+' ↗';a.href='#material-specifications';a.addEventListener('click',()=>selectSeries(key));links.append(a);}box.append(links);}
 document.querySelectorAll('[data-feature]').forEach(b=>b.addEventListener('click',()=>render(b.dataset.feature)));render(document.querySelector('[data-feature].active')?.dataset.feature||'exhibition');
});
