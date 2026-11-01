export const wedding={
  // Google Apps Script Web App URL untuk integrasi Spreadsheet Database
  gasEndpoint:'https://script.google.com/macros/s/AKfycbw-GkjU5zsMLjDF7zZG3H5UGYY9aWUqrzFSHJRyKAKqpQ2gtJNJC5nSGOYW1gxvCSUpkw/exec',
  groom:{nickname:'Arfid',name:'Arfid Gamal S.T',parents:'First son of Mr. Capt. H. Gamluddin, M.Mar. & Mrs. Hj. Ida Faridah, S.H.I.'},
  bride:{nickname:'Arin',name:'dr. Vanetka Daarin Haya',parents:'First daughter of the late Mr. H. Irpan, S.Sos., M.M. & Mrs. Hj. Henny Arifianti, S.Sos.'},
  date:'2026-12-05',start:'2026-12-05T19:00:00+08:00',dateLabel:'Saturday, 5 December 2026',timeLabel:'19.00 WITA',
  event:'Intimate Dinner',venue:'Grand Ballroom Hotel Aruna Senggigi Resort & Convention',
  address:'Jl. Raya Senggigi, Senggigi, Kec. Batu Layar, Kabupaten Lombok Barat, Nusa Tenggara Bar. 83355',
  map:'https://maps.app.goo.gl/nTXHCgNFbq2P4xjP6?g_st=ic',
  photos:[{"src":"/assets/couple/moment-her01668.jpg","alt":"Arfid and Arin holding a bouquet on the coastal hill","pos":"50% 50%"},{"src":"/assets/couple/moment-her02438.jpg","alt":"Arfid and Arin walking hand in hand on the hill","pos":"50% 45%"},{"src":"/assets/couple/moment-dsc09889.jpg","alt":"Arfid and Arin sharing a warm gaze","pos":"52% 65%"},{"src":"/assets/couple/moment-her03836.jpg","alt":"Arfid and Arin in a joyful embrace by the sea","pos":"50% 50%"},{"src":"/assets/couple/moment-her03678.jpg","alt":"Arfid and Arin at golden hour on the beach","pos":"46% 55%"},{"src":"/assets/couple/moment-her04254.jpg","alt":"Arfid and Arin embracing under the fireworks","pos":"50% 42%"}]
};

export const loveStory=[
  {
    date:'18 July 2021',
    title:'We Said "I Love You"',
    text:'We chose each other, even though miles stood between us.'
  },
  {
    date:'3 November 2021',
    title:'We Finally Met',
    text:'After three months of long distance, Arfid surprised Arin in Yogyakarta, and we met for the very first time.'
  },
  {
    date:'8 April 2026',
    title:'The Proposal',
    text:'Five years of long distance, yet we always made time to be together. Then Arfid asked for her hand in the very city where we first met.'
  },
  {
    date:'11 April 2026',
    title:'The Engagement',
    text:'Together with our families in Lombok, we made it official.'
  },
  {
    date:'5 December 2026',
    title:'Forever Begins',
    text:'And now, we are getting married.'
  }
];

export function createPersonalization(React,Motion){
 const h=React.createElement;
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 const reveal={initial:{opacity:0,y:24},whileInView:{opacity:1,y:0},viewport:{once:true,amount:0.2},transition:{duration:.85,ease:[0.22,1,0.36,1]}};
 const wrap=(tag,props,...children)=>h(Motion[tag],{...(!reduced()?reveal:{}),...props},...children);
 const button=(label,href)=>h('a',{className:'pearl-button',href,target:'_blank',rel:'noopener noreferrer'},h('span',null,label));
 
 const parentLines=text=>{
  const [father,mother]=text.split(' & Mrs. ');
  return h('p',{className:'personal-parents'},
   h('span',{className:'personal-parent-line'},father),
   h('span',{className:'personal-parent-line'},'& Mrs. '+mother));
 };

 function Family(){
  const isReduced=reduced();
  return h('section',{id:'mempelai',className:'personal-family'},
   h(Motion.div,{
     className:'personal-family-curtain',
     'aria-hidden':true,
     initial:!isReduced?{scale:1.05,opacity:0.88}:{opacity:1},
     whileInView:{scale:1,opacity:1},
     viewport:{once:false,amount:0.25},
     transition:{duration:1.35,ease:[0.22,1,0.36,1]}
   }),
   h('div',{className:'personal-family-inner'},
    h(Motion.div,{
      className:'personal-family-header',
      initial:!isReduced?{opacity:0,y:-16,filter:'blur(5px)'}:{opacity:1},
      whileInView:{opacity:1,y:0,filter:'blur(0px)'},
      viewport:{once:false,amount:0.3},
      transition:{duration:0.9,ease:[0.22,1,0.36,1]}
    },
     h('p',{className:'personal-eyebrow'},'With joyful hearts'),
     h('h2',{className:'personal-heading'},'The Couple'),
     h('p',{className:'personal-intro'},'Together with our families, we joyfully invite you to celebrate our wedding.')
    ),
    h('div',{className:'personal-couple'},
     h(Motion.div,{
       className:'personal-person personal-person-left',
       initial:!isReduced?{opacity:0,x:-30,y:10,filter:'blur(6px)'}:{opacity:1},
       whileInView:{opacity:1,x:0,y:0,filter:'blur(0px)'},
       viewport:{once:false,amount:0.25},
       transition:{duration:1.05,delay:0.15,ease:[0.16,1,0.3,1]}
     },
      h(Motion.p,{
        className:'personal-nickname',
        initial:!isReduced?{opacity:0,x:-18,scale:0.94}:{opacity:1},
        whileInView:{opacity:1,x:0,scale:1},
        viewport:{once:false,amount:0.25},
        transition:{duration:0.95,delay:0.22,ease:[0.16,1,0.3,1]}
      },wedding.bride.nickname),
      h(Motion.span,{
        className:'personal-person-divider',
        'aria-hidden':true,
        initial:!isReduced?{scaleX:0,opacity:0}:{opacity:0.7},
        whileInView:{scaleX:1,opacity:0.7},
        viewport:{once:false,amount:0.25},
        transition:{duration:0.8,delay:0.32,ease:[0.22,1,0.36,1]}
      }),
      h('h3',null,wedding.bride.name),
      parentLines(wedding.bride.parents)
     ),
     h(Motion.div,{
       className:'personal-person personal-person-right',
       initial:!isReduced?{opacity:0,x:30,y:10,filter:'blur(6px)'}:{opacity:1},
       whileInView:{opacity:1,x:0,y:0,filter:'blur(0px)'},
       viewport:{once:false,amount:0.25},
       transition:{duration:1.05,delay:0.3,ease:[0.16,1,0.3,1]}
     },
      h(Motion.p,{
        className:'personal-nickname',
        initial:!isReduced?{opacity:0,x:18,scale:0.94}:{opacity:1},
        whileInView:{opacity:1,x:0,scale:1},
        viewport:{once:false,amount:0.25},
        transition:{duration:0.95,delay:0.36,ease:[0.16,1,0.3,1]}
      },wedding.groom.nickname),
      h(Motion.span,{
        className:'personal-person-divider',
        'aria-hidden':true,
        initial:!isReduced?{scaleX:0,opacity:0}:{opacity:0.7},
        whileInView:{scaleX:1,opacity:0.7},
        viewport:{once:false,amount:0.25},
        transition:{duration:0.8,delay:0.46,ease:[0.22,1,0.36,1]}
      }),
      h('h3',null,wedding.groom.name),
      parentLines(wedding.groom.parents)
     )
    )
   )
  );
 }

 function LoveStory(){
  return h('section',{id:'love-story',className:'personal-story'},
   h('div',{className:'personal-story-curtain','aria-hidden':true}),
   wrap('div',{className:'personal-story-bouquet-top'},
    h(Motion.img,{
      src:'/assets/calla-bouquet.png',
      alt:'Bouquet of Calla Lilies',
      className:'personal-story-bouquet',
      initial:!reduced()?{opacity:0,scale:0.85,y:-12}:{opacity:1},
      whileInView:{opacity:1,scale:1,y:0},
      viewport:{once:true,amount:0.25},
      transition:{duration:0.9,ease:[0.22,1,0.36,1]}
    })
   ),
   wrap('div',{className:'personal-story-header'},
    h('p',{className:'personal-eyebrow'},'Our Journey'),
    h('h2',{className:'personal-heading'},'Love Story'),
    h('p',{className:'personal-intro'},'Every step and distance has brought us toward the same destination.')
   ),
   h('div',{className:'personal-story-timeline'},
    ...loveStory.map((item,idx)=>
     h(Motion.div,{
       key:item.date,
       className:'personal-story-item',
       initial:!reduced()?{opacity:0,y:20,x:idx%2===0?-10:10}:{opacity:1},
       whileInView:{opacity:1,y:0,x:0},
       viewport:{once:true,amount:0.2},
       transition:{duration:0.75,delay:0.06*idx,ease:[0.22,1,0.36,1]}
     },
      h('div',{className:'personal-story-node','aria-hidden':true}),
      h('div',{className:'personal-story-content'},
       h('div',{className:'personal-story-date-badge'},item.date),
       h('h3',{className:'personal-story-title'},item.title),
       h('p',{className:'personal-story-text'},item.text)
      )
     )
    )
   )
  );
 }

 function WeddingDinner(){
  return h('section',{id:'acara',className:'personal-dinner'},
   h('div',{className:'personal-curtain','aria-hidden':true}),
   wrap('div',{className:'personal-dinner-content'},
    h('p',{className:'personal-eyebrow'},'Celebrate with us'),
    h('h2',{className:'personal-dinner-title'},'Intimate',h('br'),'Dinner'),
    h('div',{className:'personal-event-date'},h('span',null,'Saturday'),h('strong',null,'05'),h('span',null,'December 2026')),
    h('div',{className:'personal-rule'}),
    h('p',{className:'personal-time'},'19.00 ',h('small',null,'WITA')),
    h('p',{className:'personal-venue-short'},'Grand Ballroom'),
    h('p',{className:'personal-venue-name'},'Hotel Aruna Senggigi',h('br'),'Resort & Convention'),
    h('p',{className:'personal-address'},wedding.address),
    button('Open in Google Maps',wedding.map),
    h('img',{className:'personal-resort-illustration',src:'/assets/aruna-resort-watercolor.png',alt:'Watercolor illustration of the pool at Aruna Senggigi Resort',width:1586,height:992,loading:'lazy',decoding:'async'})
   )
  );
 }

 function WeddingLocation(){
  return h('section',{id:'lokasi',className:'personal-location'},
   wrap('div',{className:'personal-venue-card'},
    h('img',{
      src:'/assets/hotel-pearl-frame-DwCN7mtx.png',
      alt:'',
      'aria-hidden':true,
      className:'personal-venue-frame',
      loading:'lazy',
      decoding:'async',
      draggable:false
    }),
    h('div',{className:'personal-venue-content'},
      h('p',{className:'personal-eyebrow'},'Senggigi, Lombok'),
      h('h2',{className:'personal-heading'},'The Venue'),
      h('div',{className:'personal-venue-rule','aria-hidden':true}),
      h('p',{className:'personal-location-title'},'Grand Ballroom'),
      h('h3',{className:'personal-venue-name'},'Hotel Aruna Senggigi',h('br'),'Resort & Convention'),
      h('p',{className:'personal-address'},wedding.address),
      button('Open in Google Maps',wedding.map)
    )
   )
  );
 }

 function Gallery(){
  const [selected,setSelected]=React.useState(null);
  const dialog=React.useRef(null);
  const trigger=React.useRef(null);
  React.useEffect(()=>{if(selected!==null&&!dialog.current.open)dialog.current.showModal()},[selected]);
  const close=()=>{dialog.current.close();setSelected(null);trigger.current?.focus()};
  return h('section',{id:'galeri',className:'personal-gallery'},
   h(Motion.img,{
     src:'/assets/calla-stem.png',
     alt:'',
     'aria-hidden':true,
     className:'botanical-accent botanical-gallery-corner',
     initial:!reduced()?{opacity:0,y:-30,x:30,rotate:12}:{opacity:0.85},
     whileInView:{opacity:0.85,y:0,x:0,rotate:0},
     viewport:{once:true,amount:0.2},
     transition:{duration:1,delay:0.2,ease:[0.22,1,0.36,1]}
   }),
   h(Motion.img,{
     src:'/assets/calla-stem.png',
     alt:'',
     'aria-hidden':true,
     className:'botanical-accent botanical-gallery-bottom-left',
     initial:!reduced()?{opacity:0,y:40,x:-30,rotate:-12}:{opacity:0.85},
     whileInView:{opacity:0.85,y:0,x:0,rotate:0},
     viewport:{once:true,amount:0.2},
     transition:{duration:1,delay:0.15,ease:[0.22,1,0.36,1]}
   }),
   wrap('div',{className:'personal-gallery-inner'},
    h('p',{className:'personal-eyebrow'},'Arfid & Arin'),
    h('h2',{className:'personal-heading'},'Moments in Frames'),
    h('div',{className:'personal-gallery-grid'},
     ...wedding.photos.map((p,i)=>h(Motion.button,{
       key:p.src,
       type:'button',
       className:'personal-gallery-item personal-gallery-item-'+(i+1),
       'aria-label':'View photo '+(i+1),
       initial:!reduced()?{opacity:0,y:24,scale:0.97}:{opacity:1},
       whileInView:{opacity:1,y:0,scale:1},
       viewport:{once:true,amount:0.18},
       transition:{duration:0.8,delay:(i%2)*0.12,ease:[0.22,1,0.36,1]},
       onClick:e=>{trigger.current=e.currentTarget;setSelected(i)}
     },
      h('img',{src:p.src,alt:p.alt,loading:'lazy',decoding:'async',style:p.pos?{objectPosition:p.pos}:undefined})
     ))
    )
   ),
   h('dialog',{
     ref:dialog,
     className:'personal-lightbox',
     'aria-label':'Arfid and Arin Photo Gallery',
     onCancel:()=>{setSelected(null);trigger.current?.focus()},
     onClick:e=>{if(e.target===e.currentTarget)close()},
     onKeyDown:e=>{
       if(e.key==='ArrowRight'){e.preventDefault();setSelected(v=>(v+1)%wedding.photos.length)}
       if(e.key==='ArrowLeft'){e.preventDefault();setSelected(v=>(v+wedding.photos.length-1)%wedding.photos.length)}
     }
   },
    h('button',{type:'button',className:'lightbox-close',onClick:close,'aria-label':'Close photo'},'×'),
    selected!==null&&h('img',{src:wedding.photos[selected].src,alt:wedding.photos[selected].alt}),
    h('div',{className:'lightbox-controls'},
     h('button',{type:'button',onClick:()=>setSelected(v=>(v+wedding.photos.length-1)%wedding.photos.length),'aria-label':'Previous photo'},'←'),
     h('span',null,`${(selected??0)+1} / ${wedding.photos.length}`),
     h('button',{type:'button',onClick:()=>setSelected(v=>(v+1)%wedding.photos.length),'aria-label':'Next photo'},'→')
    )
   )
  );
 }

 function QuoteVideo(){
  const section=React.useRef(null),video=React.useRef(null);
  const [desktop,setDesktop]=React.useState(()=>matchMedia('(min-width: 768px)').matches);
  const [allowMotion,setAllowMotion]=React.useState(()=>!matchMedia('(prefers-reduced-motion: reduce)').matches&&!navigator.connection?.saveData);
  const [visible,setVisible]=React.useState(false),[pageVisible,setPageVisible]=React.useState(!document.hidden);
  const [pausedByUser,setPausedByUser]=React.useState(false),[playing,setPlaying]=React.useState(false),[ready,setReady]=React.useState(false),[failed,setFailed]=React.useState(false);
  const format=desktop?'desktop':'mobile';
  React.useEffect(()=>{
   const size=matchMedia('(min-width: 768px)'),motion=matchMedia('(prefers-reduced-motion: reduce)');
   const onSize=()=>{setDesktop(size.matches);setReady(false);setFailed(false)};
   const onMotion=()=>setAllowMotion(!motion.matches);
   const onVisibility=()=>setPageVisible(!document.hidden);
   size.addEventListener('change',onSize);motion.addEventListener('change',onMotion);document.addEventListener('visibilitychange',onVisibility);
   const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.15});observer.observe(section.current);
   return()=>{observer.disconnect();size.removeEventListener('change',onSize);motion.removeEventListener('change',onMotion);document.removeEventListener('visibilitychange',onVisibility)};
  },[]);
  React.useEffect(()=>{
   const player=video.current;if(!player)return;
   if(allowMotion&&visible&&pageVisible&&!pausedByUser){player.muted=true;player.preload='auto';player.play().catch(()=>setPlaying(false))}else player.pause();
  },[allowMotion,visible,pageVisible,pausedByUser,format]);
  const toggle=()=>{if(!allowMotion){setAllowMotion(true);setPausedByUser(false)}else setPausedByUser(value=>!value)};
  return h('section',{id:'quote',ref:section,className:'quote-film','aria-label':'A quote about love'},
   h('img',{className:'quote-film-poster',src:`/assets/quote/poster-${format}.jpg`,alt:'','aria-hidden':true,loading:'lazy',decoding:'async'}),
   allowMotion&&!failed&&h('video',{key:format,ref:video,className:'quote-film-video'+(ready?' is-ready':''),src:`/assets/quote/arfid-arin-${format}.mp4`,poster:`/assets/quote/poster-${format}.jpg`,muted:true,loop:true,playsInline:true,preload:'none',disablePictureInPicture:true,'aria-hidden':true,tabIndex:-1,onCanPlay:()=>setReady(true),onPlay:()=>setPlaying(true),onPause:()=>setPlaying(false),onError:()=>{setFailed(true);setPlaying(false)}}),
   h('div',{className:'quote-film-shade','aria-hidden':true}),
   h('blockquote',{className:'quote-film-copy'},h('p',null,"Meeting you was the best thing that ever happened to me, and loving you is the best decision I've ever made.")),
   !failed&&h('button',{type:'button',className:'quote-film-toggle',onClick:toggle,'aria-label':playing?'Pause background video':'Play background video','aria-pressed':playing},
    h('svg',{width:16,height:16,viewBox:'0 0 20 20',fill:'currentColor','aria-hidden':true},playing?h(React.Fragment,null,h('rect',{x:5,y:4,width:3,height:12,rx:.7}),h('rect',{x:12,y:4,width:3,height:12,rx:.7})):h('path',{d:'M6 3.5 16 10 6 16.5Z'}))));
 }

 return {Family,WeddingDinner,WeddingLocation,Gallery,QuoteVideo,LoveStory};
}