/* Visible links between chapter notes and their illustrated lessons. */
(()=>{
 const main=document.querySelector('main'),lb=location.pathname.includes('/load-balancing/'),base=lb?'../':'';
 const time=t=>Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,'0');
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let index;
 const route=()=>{const p=location.hash.slice(1).split('/');return lb?{id:'load-balancing',chapter:location.hash.startsWith('#chapter-')?Number(location.hash.split('-')[1]):null,overview:!location.hash||location.hash==='#home'}:{id:p[1],chapter:p[2]==='chapter'?Number(p[3])+1:null,overview:p[0]==='unit'&&!p[2]};};
 const chapterURL=(id,n)=>id==='load-balancing'?(lb?'':'load-balancing/index.html')+'#chapter-'+n:'#unit/'+id+'/chapter/'+(n-1);
 function seek(video,t,play=true){const go=()=>{video.currentTime=t;if(play)video.play().catch(()=>{});};if(video.readyState>=1)go();else video.addEventListener('loadedmetadata',go,{once:true});}
 async function enhance(video){
  if(video.dataset.navigationReady)return;video.dataset.navigationReady='true';
  const source=video.querySelector('source')?.src||video.src;if(!source)return;
  const url=new URL(source,location.href);url.pathname=url.pathname.replace(/\.mp4$/,'.chapters.json');url.search='?v=illustrated1';url.hash='';
  try{
   const r=await fetch(url);if(!r.ok)return;const entries=await r.json();if(!video.isConnected)return;
   const unique=entries.filter((x,i)=>i===0||x.chapter!==entries[i-1].chapter);
   const section=document.createElement('section');section.className='video-chapters';section.setAttribute('aria-label','Chapters in this video');
   const heading=document.createElement('h3');heading.textContent='Chapters in this video';section.append(heading);
   for(const e of unique){const row=document.createElement('div');row.className='video-chapter-row';const b=document.createElement('button');b.type='button';b.textContent=time(e.time)+' · '+e.title;b.onclick=()=>seek(video,e.time);row.append(b);const a=document.createElement('a');a.textContent='Read chapter '+e.chapter;a.href=chapterURL(route().id,e.chapter);row.append(a);section.append(row);}
   video.parentNode.insertBefore(section,video.nextSibling);
  }catch{}
 }
 function scan(){
  const r=route(),entries=index?.[r.id];
  if(entries&&!main.querySelector('.lesson-links')&&(r.overview||r.chapter)){
   const box=document.createElement('section');box.className='lesson-links';
   if(r.chapter){
    const e=entries.find(e=>e.chapter===r.chapter);if(e){
     box.innerHTML=`<h2>Video for this chapter</h2><p>Unit ${esc(r.id==='load-balancing'?'12':String(Object.keys(index).indexOf(r.id)+1).padStart(2,'0'))} · Chapter ${e.chapter} · Part ${e.part} · Starts at ${time(e.start)}</p>`;
     let video=main.querySelector('video');if(!video){video=document.createElement('video');video.controls=true;video.preload='metadata';video.poster=base+e.path+'.jpg?v=illustrated1';video.innerHTML=`<source src="${base+e.path}.mp4?v=illustrated1" type="video/mp4"><track default kind="captions" srclang="en" label="English" src="${base+e.path}.vtt?v=illustrated1">`;box.append(video);}
     const b=document.createElement('button');b.className='button';b.textContent=`Watch chapter ${e.chapter} from ${time(e.start)}`;b.onclick=()=>{seek(video,e.start);video.scrollIntoView({block:'center',behavior:'smooth'});};box.append(b);
     const a=document.createElement('a');a.className='button';a.href=lb?'#home':'#unit/'+r.id;a.textContent='All videos and chapters in this unit';box.append(a);
    }
   }else{
    box.innerHTML='<h2>Chapter and video guide</h2><p>Open a chapter to read its notes and watch the relevant video section.</p><ol>'+entries.map(e=>`<li><a href="${chapterURL(r.id,e.chapter)}">Chapter ${e.chapter}: ${esc(e.title)}</a><span>Video part ${e.part} · ${time(e.start)}</span></li>`).join('')+'</ol>';
   }
   if(box.childNodes.length){const anchor=main.querySelector(r.chapter?'h1':'.unit-actions, .hero');anchor?anchor.after(box):main.prepend(box);}
  }
  main.querySelectorAll('video').forEach(enhance);
 }
 new MutationObserver(scan).observe(main,{childList:true,subtree:true});
 fetch(base+'video-index.json?v=chapterlinks1').then(r=>r.json()).then(d=>{index=d;scan();}).catch(()=>{});scan();
})();
