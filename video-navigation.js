/* Chapter navigation for the illustrated lessons. */
(()=>{
 const time=t=>Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,'0');
 async function enhance(video){
  if(video.dataset.navigationReady)return;video.dataset.navigationReady='true';
  const source=video.querySelector('source')?.src||video.src;if(!source)return;
  const url=new URL(source,location.href);url.pathname=url.pathname.replace(/\.mp4$/,'.chapters.json');url.search='?v=illustrated1';
  try{
   const r=await fetch(url);if(!r.ok)return;const entries=await r.json();if(!video.isConnected)return;
   const unique=entries.filter((x,i)=>i===0||x.chapter!==entries[i-1].chapter);
   const details=document.createElement('details');details.className='video-chapters';const summary=document.createElement('summary');summary.textContent='Jump to a chapter';details.append(summary);
   for(const e of unique){const b=document.createElement('button');b.type='button';b.textContent=time(e.time)+' · '+e.title;b.onclick=()=>{video.currentTime=e.time;video.play().catch(()=>{});};details.append(b);}
   video.parentNode.insertBefore(details,video.nextSibling);
  }catch{}
 }
 const scan=()=>document.querySelectorAll('video').forEach(enhance);new MutationObserver(scan).observe(document.querySelector('main'),{childList:true,subtree:true});scan();
})();
