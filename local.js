// The opener is revealed atomically only once the personalized monogram is decoded.
// Motion coordinates use the original 1080 x 1920 composition at every viewport size.
(()=>{
 const seal=new Image();seal.src='/assets/monogram-aa.png';seal.alt='';seal.setAttribute('aria-hidden','true');seal.className='local-monogram';
 const ready=Promise.all([fetch('/assets/seal-motion.json').then(r=>{if(!r.ok)throw Error('Motion data unavailable');return r.json()}),seal.decode()]);
 let installed=false;
 function install(){
  const stage=document.querySelector('[aria-label="Open wedding invitation"], [aria-label="Buka undangan pernikahan"]');
  const video=stage?.querySelector('video');if(!video||installed)return false;installed=true;
  ready.then(([track])=>{
   if(!stage.isConnected)return;
   stage.append(seal);
   let raf=0,bounds=stage.getBoundingClientRect();
   const sample=time=>{
    const next=track.findIndex(k=>k.time>=time);
    if(next===0)return track[0].matrix;
    if(next<0)return track.at(-1).matrix;
    const a=track[next-1],b=track[next],t=(time-a.time)/(b.time-a.time);
    return a.matrix.map((n,i)=>n+(b.matrix[i]-n)*t);
   };
   function draw(){
    if(!stage.isConnected){cancelAnimationFrame(raf);resize.disconnect();return;}
    const time=video.currentTime||0;
    const [a,c,tx,b,d,ty]=sample(time);
    const scale=Math.max(bounds.width/1080,bounds.height/1920),ox=(bounds.width-1080*scale)/2,oy=(bounds.height-1920*scale)/2;
    const x=330,y=730;
    seal.style.transform=`matrix(${scale*a},${scale*b},${scale*c},${scale*d},${ox+scale*(a*x+c*y+tx)},${oy+scale*(b*x+d*y+ty)})`;
    seal.style.opacity=time>3.15?'0':'1';
    if(!video.paused&&!video.ended)raf=requestAnimationFrame(draw);
   }
   const resize=new ResizeObserver(()=>{bounds=stage.getBoundingClientRect();cancelAnimationFrame(raf);draw()});resize.observe(stage);
   video.addEventListener('play',()=>{cancelAnimationFrame(raf);draw()});video.addEventListener('seeked',()=>{cancelAnimationFrame(raf);draw()});
   draw();stage.dataset.monogramReady='true';
  }).catch(error=>{console.error('Personalized opener unavailable',error);});
  return true;
 }
 if(!install()){const observer=new MutationObserver(()=>{if(install())observer.disconnect()});observer.observe(document.querySelector('#root'),{childList:true,subtree:true});}
})();
