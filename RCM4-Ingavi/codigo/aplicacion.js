'use strict';
const $ = s => document.querySelector(s);
const ICONS = {
 stop:'<rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" stroke="none"/>',
 home:'<path d="m3 11 9-8 9 8M5 10v11h5v-7h4v7h5V10"/>',
 plan:'<path d="M4 3h16v18H4Zm0 7h10V3m0 7v7h6M9 21v-7H4"/>',
 satellite:'<path d="m9 9 6-6 6 6-6 6Zm-6 6 6-6 6 6-6 6Zm3-9 3 3m6 6 3 3M3 3h4M3 3v4m14 14h4v-4"/>',
 search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/>',
 arrow:'<path d="M4 12h15m-5-5 5 5-5 5"/>',back:'<path d="M20 12H5m5-5-5 5 5 5"/>',
 expand:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',minus:'<path d="M5 12h14"/>',
 focus:'<path d="M7 3H3v4m14-4h4v4M3 17v4h4m14-4v4h-4"/><circle cx="12" cy="12" r="4"/>',
 map:'<path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2Zm6-2v16m6-14v16"/>',
 walk:'<circle cx="13" cy="4" r="2"/><path d="m7 21 4-8 4 3 1 5M5 12l4-4 4 1 2 4h4M11 9l-1 6"/>',
 play:'<path d="m8 5 11 7-11 7Z"/>',volume:'<path d="M3 9h4l5-4v14l-5-4H3Zm13-1a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
 straight:'<path d="M12 21V4m-5 5 5-5 5 5"/>',right:'<path d="M7 21V10h13m-5-5 5 5-5 5"/>',left:'<path d="M17 21V10H4m5-5-5 5 5 5"/>',
 arrive:'<path d="M6 22V3m0 1c4-4 8 4 12 0v10c-4 4-8-4-12 0"/>',
 close:'<path d="m6 6 12 12M6 18 18 6"/>',print:'<path d="M7 8V3h10v5M6 17H3V9h18v8h-3M7 14h10v7H7Zm10-3h1"/>'
};
const icon = name => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ICONS.straight}</svg>`;
document.querySelectorAll('[data-icon]').forEach(el => el.outerHTML = icon(el.dataset.icon));
const svg=$('#mapSvg'), stage=$('#mapStage');
const NS='http://www.w3.org/2000/svg';
const state={route:null,step:-1,speed:3,panelOpen:true,stepsOpen:true,layer:'sketch',view:{x:150,y:15,w:960,h:730},animation:0,speaking:false};
const normal = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const pathD = pts => pts.map((p,i)=>(i?'L':'M')+p[0]+','+p[1]).join(' ');
const allPoints = r => r.steps.flatMap((s,i)=>i?s.points.slice(1):s.points);
const formatDistance = d => d.toLocaleString('es-BO',{minimumFractionDigits:2,maximumFractionDigits:2})+' m';
function timeFor(distance,speed=state.speed){const seconds=Math.round(distance*3.6/speed);return `${Math.floor(seconds/60)} min ${String(seconds%60).padStart(2,'0')} s`;}
function node(tag,attrs={},parent){const n=document.createElementNS(NS,tag);for(const [key,value] of Object.entries(attrs))n.setAttribute(key,String(value));if(parent)parent.append(n);return n;}
function announce(s){$('#status').textContent=s;}
let toastTimer;
function toast(s){const el=$('#toast');el.textContent=s;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3600);}
function dismissToast(){clearTimeout(toastTimer);$('#toast').classList.remove('show');}
function placeImage(id){
 const asset=MARKER_ASSETS[PLACE_STYLE[id].image];
 return `<svg class="place-picture${asset.round?' round-picture':''}" viewBox="${asset.viewBox.join(' ')}" aria-hidden="true" focusable="false"><image href="${asset.src}" width="${asset.width}" height="${asset.height}"/></svg>`;
}
function routeTheme(route){
 const color=route?PLACE_STYLE[route.id].color:'#ff9f35';
 const rgb=color.match(/[\da-f]{2}/gi).map(value=>parseInt(value,16));
 const dark='#'+rgb.map(value=>Math.round(value*.62).toString(16).padStart(2,'0')).join('');
 $('#app').style.setProperty('--route-color',color);
 $('#app').style.setProperty('--route-dark',dark);
 $('#app').style.setProperty('--route-soft',`rgba(${rgb.join(',')},.12)`);
 $('#destinationBadge').style.setProperty('--place-color',color);
}
function renderDirectory(){
 const q=normal($('#search').value);const matches=ROUTES.filter(r=>!q||(/^[b-j]$/.test(q)?r.id.toLowerCase()===q:normal(`${r.id} ${r.name} ${r.key} ${r.category} ${r.key==='compania'?'inteligencia reconocimiento':''} ${r.key==='batallon'?'transportes':''}`).includes(q)));
 $('#count').textContent=matches.length+(matches.length===1?' lugar':' lugares');
 $('#destinationList').innerHTML=matches.length?matches.map(r=>`<div role="listitem"><button class="destination" data-destination="${r.id}" aria-label="Ver ruta desde A a ${r.name}, ${formatDistance(r.distance)}"><span class="letter place-icon" style="--place-color:${PLACE_STYLE[r.id].color}">${placeImage(r.id)}</span><span class="destination-text"><strong>${r.name}</strong><small>${r.category} · ${timeFor(r.distance)}</small></span><span class="distance">${Math.round(r.distance)} m</span></button></div>`).join(''):'<div class="empty"><strong>No encontramos ese lugar.</strong>Prueba con el nombre o la letra del destino, por ejemplo: Comando o B.</div>';
 $('#destinationList').querySelectorAll('[data-destination]').forEach(el=>el.addEventListener('click',()=>choose(el.dataset.destination)));
 return matches;
}
const pinData=[{id:'A',name:'Inicio',point:A,label:'left'},...ROUTES].map(p=>({...p,...PLACE_STYLE[p.id]}));
function createPins(){
 for(const p of pinData){
  const asset=MARKER_ASSETS[p.image];
  const g=node('g',{'class':'map-pin','role':'button','tabindex':'0','data-id':p.id,'style':`--pin-color:${p.color}`,'aria-label':p.id==='A'?'Punto A, inicio de todos los recorridos':`Ruta A a ${p.id}, ${p.name}`},$('#pins'));
  node('title',{},g).textContent=p.id==='A'?'Inicio del recorrido':p.name;
  node('path',{'class':'pin-leader',fill:'none',stroke:p.color,'stroke-width':1.2},g);
  node('circle',{'class':'pin-anchor',r:3,fill:p.color,stroke:'#fff','stroke-width':1,hidden:''},g);
  node('rect',{'class':'pin-hit',x:-30,y:-30,width:60,height:60,rx:14,fill:'transparent'},g);
  node('rect',{'class':'pin-ring',x:-30,y:-30,width:60,height:60,rx:16,fill:'none',stroke:p.color,'stroke-width':2,opacity:0},g);
  node('rect',{'class':'pin-core',x:-26,y:-26,width:52,height:52,rx:12,fill:'#fff',stroke:p.color,'stroke-width':2.5},g);
  const picture=node('svg',{'class':'pin-picture'+(asset.round?' round-picture':''),x:-23,y:-23,width:46,height:46,viewBox:asset.viewBox.join(' '),'aria-hidden':'true','preserveAspectRatio':'xMidYMid meet'},g);
  node('image',{href:asset.src,width:asset.width,height:asset.height},picture);
  const left=p.label==='left';const label=node('text',{'class':'pin-label',x:left?-34:34,y:4,'text-anchor':left?'end':'start'},g);label.textContent=p.id==='A'?'INICIO DEL RECORRIDO':p.short||p.name;
  function activate(){if(p.id==='A'){reset();toast('A es el punto de partida de todas las rutas.');}else choose(p.id);}
  g.addEventListener('click',activate);g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate();}});
 }
}
function updatePins(){
 const scale=state.view.w/Math.max(1,stage.clientWidth);
 const compact=stage.clientWidth<=900&&scale>1.7;
 const positions=pinData.map(p=>({data:p,x:(p.point[0]-state.view.x)/scale,y:(p.point[1]-state.view.y)/scale}));
 // Las imágenes mantienen un tamaño legible. Las líneas conservan el anclaje original.
 const gap=60;
 for(let iter=0;iter<12;iter++)for(let i=0;i<positions.length;i++)for(let j=i+1;j<positions.length;j++){
  const a=positions[i],b=positions[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);
  if(d>=gap)continue;
  const fixedA=a.data.id==='A'||a.data.id===state.route?.id,fixedB=b.data.id==='A'||b.data.id===state.route?.id;
  if(fixedA&&fixedB)continue;
  const move=(gap-d)/(fixedA||fixedB?1:2),ux=d?dx/d:1,uy=d?dy/d:0;
  if(!fixedA){a.x-=ux*move;a.y-=uy*move;}if(!fixedB){b.x+=ux*move;b.y+=uy*move;}
 }
 for(const pos of positions){
  const p=pos.data,g=$(`#pins [data-id="${p.id}"]`),active=state.route?.id===p.id;
  const worldX=state.view.x+pos.x*scale,worldY=state.view.y+pos.y*scale;
  g.setAttribute('transform',`translate(${worldX} ${worldY}) scale(${scale})`);
  g.classList.toggle('dim',!!state.route&&p.id!=='A'&&!active);g.setAttribute('aria-pressed',String(active));
  g.classList.toggle('active',active);g.querySelector('.pin-ring').style.display=active?'':'none';
  const label=g.querySelector('.pin-label');label.textContent=p.id==='A'?(compact?'INICIO':'INICIO DEL RECORRIDO'):p.short||p.name;label.style.display=compact&&p.id!=='A'&&!active?'none':'';
  const labelWidth=label.getComputedTextLength();let left=p.label==='left';if(left&&pos.x-34-labelWidth<12)left=false;if(!left&&pos.x+34+labelWidth>stage.clientWidth-12)left=true;label.setAttribute('x',left?-34:34);label.setAttribute('text-anchor',left?'end':'start');
  const dx=(p.point[0]-worldX)/scale,dy=(p.point[1]-worldY)/scale,shifted=Math.hypot(dx,dy)>3;
  g.querySelector('.pin-leader').setAttribute('d',shifted?`M0 0 L${dx} ${dy}`:'');
  const anchor=g.querySelector('.pin-anchor');anchor.setAttribute('cx',dx);anchor.setAttribute('cy',dy);anchor.toggleAttribute('hidden',!shifted);
 }
 if(state.route&&state.step>=0){const pts=state.route.steps[state.step].points;const p=pts[Math.floor((pts.length-1)/2)];$('#walker').setAttribute('transform',`translate(${p[0]} ${p[1]}) scale(${scale})`);}
}
function arrows(){
 const g=$('#arrows');g.replaceChildren();if(!state.route)return;
 const p=$('#routePath');const len=p.getTotalLength();const s=state.view.w/Math.max(1,stage.clientWidth);const spacing=76*s;
 for(let d=35*s;d<len-24*s;d+=spacing){const a=p.getPointAtLength(Math.max(0,d-1)),b=p.getPointAtLength(Math.min(len,d+1)),v=p.getPointAtLength(d);const angle=Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI;node('path',{d:'M-4 -4 L1 0 L-4 4',transform:`translate(${v.x} ${v.y}) rotate(${angle}) scale(${s})`,fill:'none',stroke:'#67451e','stroke-width':2,'stroke-linecap':'round','stroke-linejoin':'round'},g);}
}
function applyView(v){state.view=v;svg.setAttribute('viewBox',`${v.x} ${v.y} ${v.w} ${v.h}`);updatePins();arrows();}
function moveView(v,animate=true){cancelAnimationFrame(state.animation);if(!animate||matchMedia('(prefers-reduced-motion: reduce)').matches){applyView(v);return;}const from={...state.view},start=performance.now();function tick(now){const t=Math.min(1,(now-start)/340),e=1-Math.pow(1-t,3);const next={};for(const key of ['x','y','w','h'])next[key]=from[key]+(v[key]-from[key])*e;applyView(next);if(t<1)state.animation=requestAnimationFrame(tick);}state.animation=requestAnimationFrame(tick);}
function availableRect(){
 const w=stage.clientWidth,h=stage.clientHeight;
 const dock=$('.map-dock').getBoundingClientRect(),nav=$('.navigation-bar').getBoundingClientRect();
 let left=35,right=w-210,top=nav.bottom+24,bottom=h-64;
 if(w<=900&&h>520){left=24;right=w-24;top=nav.bottom+25;bottom=state.panelOpen?$('#panel').getBoundingClientRect().top-22:dock.top-22;}
 else if(state.panelOpen){left=$('#panel').getBoundingClientRect().right+37;}
 if(bottom-top<100)bottom=top+100;
 return {left,right:Math.max(left+100,right),top,bottom};
}
function fitPoints(points,animate=true,whole=false){
 const w=stage.clientWidth,h=stage.clientHeight,a=availableRect();let xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);let minx=Math.min(...xs),maxx=Math.max(...xs),miny=Math.min(...ys),maxy=Math.max(...ys);const pad=whole?24:38;minx-=pad;maxx+=pad;miny-=pad;maxy+=pad;
 let s=Math.max((maxx-minx)/Math.max(100,a.right-a.left),(maxy-miny)/Math.max(100,a.bottom-a.top));s=Math.max(.22,Math.min(7,s));
 moveView({x:(minx+maxx)/2-(a.left+a.right)/2*s,y:(miny+maxy)/2-(a.top+a.bottom)/2*s,w:w*s,h:h*s},animate);
}
// Al iniciar se prioriza el área de destinos; el botón de encuadre muestra todo el recinto.
function fitCurrent(animate=true){if(state.route)fitPoints(allPoints(state.route),animate);else fitPoints([[190,47],[1040,500]],animate,true);}
function zoom(factor,cx=stage.clientWidth/2,cy=stage.clientHeight/2){const v=state.view,s=v.w/stage.clientWidth;const ns=Math.max(.16,Math.min(7,s*factor));const r=ns/s;moveView({x:v.x+cx*s*(1-r),y:v.y+cy*s*(1-r),w:v.w*r,h:v.h*r},false);}
function setPanel(open,refit=true){state.panelOpen=open;$('#app').classList.toggle('panel-closed',!open);$('#panel').inert=!open;$('#panel').setAttribute('aria-hidden',String(!open));$('#panelToggle').setAttribute('aria-label',open?'Ocultar panel':'Mostrar indicaciones');if(refit){if(state.route&&state.step>=0)fitPoints(state.route.steps[state.step].points);else fitCurrent();}}

// Cada reproducción tiene una identidad. Los eventos tardíos de una voz cancelada
// nunca pueden avanzar una ruta nueva ni reactivar el modo automático.
let voiceRun=0,activeUtterance=null;
function updateVoiceUI(){
 const playing=state.speaking,button=$('#listen');
 const label=playing?'Detener audio':'Reproducir audio y seguir los tramos';
 button.setAttribute('aria-pressed',String(playing));
 button.setAttribute('aria-label',label);button.title=label;
 button.innerHTML=icon(playing?'stop':'volume');
 $('#app').classList.toggle('voice-active',playing);
 $('#stopAudio').hidden=!playing;$('#toggleSteps').hidden=playing;
 $('#guideHeadingTitle').textContent=playing
  ?(state.step>=0?`Audio · tramo ${state.step+1} de ${state.route.steps.length}`:'Audio · presentación de la ruta')
  :'Tu recorrido, paso a paso';
 $('#guideNav small').textContent=playing?'Avance con el audio':'Vista guiada del recorrido';
}
function cancelVoice(){
 voiceRun++;
 if(activeUtterance){activeUtterance.onstart=activeUtterance.onend=activeUtterance.onerror=null;activeUtterance=null;}
 state.speaking=false;$('#app').classList.remove('audio-step-speaking');updateVoiceUI();
 if('speechSynthesis' in window)speechSynthesis.cancel();
}
function showArrival(){
 if(!state.route)return;
 $('#arrivalName').textContent=`Punto ${state.route.id} · ${state.route.name}`;
 $('#arrival').hidden=false;
 announce('Vista guiada completa. Este es el destino señalado en el croquis.');
}
function timeForSpeech(distance){
 const seconds=Math.round(distance*3.6/state.speed),minutes=Math.floor(seconds/60),remaining=seconds%60;
 return `${minutes} ${minutes===1?'minuto':'minutos'} y ${remaining} ${remaining===1?'segundo':'segundos'}`;
}
function startVoice(){
 if(!state.route)return;
 if(!('speechSynthesis' in window)||!('SpeechSynthesisUtterance' in window)){
  toast('Este navegador no dispone de lectura en voz alta. Puedes usar la guía manual.');return;
 }
 dismissToast();endGuide();setPanel(true,false);$('#arrival').hidden=true;
 const route=state.route,run=voiceRun;
 const voices=speechSynthesis.getVoices();
 const voice=voices.find(v=>v.lang.toLowerCase()==='es-bo')||voices.find(v=>v.lang.toLowerCase().startsWith('es'));
 const segments=[
  {step:null,text:`Ruta desde el punto A a ${route.name}. Distancia ${route.distance.toLocaleString('es-BO')} metros. Tiempo estimado ${timeForSpeech(route.distance)}.`},
  ...route.steps.map((step,index)=>({step:index,text:`Tramo ${index+1} de ${route.steps.length}. ${step.title}. ${step.text}`}))
 ];
 state.speaking=true;updateVoiceUI();
 const current=()=>state.speaking&&voiceRun===run&&state.route===route;
 function speakSegment(index){
  if(!current())return;
  const segment=segments[index],utterance=new SpeechSynthesisUtterance(segment.text);
  activeUtterance=utterance;utterance.lang='es-BO';utterance.rate=.95;
  if(voice)utterance.voice=voice;
  utterance.onstart=()=>{
   if(!current()||activeUtterance!==utterance)return;
   // El mapa cambia cuando comienza la locución del tramo, nunca por un temporizador.
   if(segment.step!==null){setStep(segment.step,true);$('#app').classList.add('audio-step-speaking');}
   updateVoiceUI();
  };
  utterance.onend=()=>{
   if(!current()||activeUtterance!==utterance)return;
   $('#app').classList.remove('audio-step-speaking');
   activeUtterance=null;
   if(index+1<segments.length){speakSegment(index+1);return;}
   voiceRun++;state.speaking=false;updateVoiceUI();showArrival();
  };
  utterance.onerror=event=>{
   if(!current()||activeUtterance!==utterance)return;
   cancelVoice();
   if(!['canceled','interrupted'].includes(event.error))toast('No se pudo reproducir el audio. Puedes continuar con los botones de la guía.');
  };
  try{speechSynthesis.speak(utterance);}catch{cancelVoice();toast('No se pudo iniciar el audio. Puedes usar la guía manual.');}
 }
 if(speechSynthesis.paused)speechSynthesis.resume();
 speakSegment(0);
}
function updateMetrics(){if(!state.route)return;$('#distance').textContent=formatDistance(state.route.distance);$('#eta').textContent=timeFor(state.route.distance);}
function renderSteps(){
 $('#steps').innerHTML=state.route.steps.map((s,i)=>`<li class="step ${state.step===i?'active':''}"><button class="stepbutton" data-step="${i}" aria-label="Paso ${i+1}: ${s.title}" ${state.step===i?'aria-current="step"':''}><span class="step-number">${icon(s.icon)}</span><span class="step-content"><span class="step-index">PASO ${i+1}</span><strong>${s.title}</strong><small>${s.text}</small></span></button></li>`).join('');
 $('#steps').querySelectorAll('[data-step]').forEach(el=>el.addEventListener('click',()=>setStep(Number(el.dataset.step))));
}
function choose(id){
 const r=ROUTES.find(r=>r.id===id||r.key===id);if(!r)return;dismissToast();cancelVoice();state.route=r;state.step=-1;$('#app').classList.remove('guiding');$('#search').value='';$('#directory').hidden=true;$('#routePanel').hidden=false;$('#routeLayer').removeAttribute('hidden');$('#stepHighlight').setAttribute('d','');$('#walker').setAttribute('hidden','');$('#arrival').hidden=true;$('#destinationName').textContent=r.name;$('#destinationBadge').innerHTML=placeImage(r.id);routeTheme(r);$('#legendText').textContent=`Ruta A → ${r.id}`;$('#guideNav').hidden=true;$('#guide').innerHTML=icon('play')+'<span>Iniciar guía</span>';$('#guide').setAttribute('aria-label','Iniciar guía por pasos');
 const d=pathD(allPoints(r));for(const id of ['routeHalo','routeOutline','routePath','routeFlow'])$('#'+id).setAttribute('d',d);
 state.stepsOpen=true;$('#routePanel').classList.remove('steps-collapsed');$('#toggleSteps').textContent='Ocultar';$('#toggleSteps').setAttribute('aria-expanded','true');
 renderSteps();updateMetrics();setPanel(true,false);fitCurrent();try{history.replaceState(null,'','#'+r.id);}catch{}document.title=`A → ${r.id} · ${r.name} | Ingavi`;announce(`Ruta desde A hasta ${r.name}. ${formatDistance(r.distance)}. Tiempo estimado: ${timeFor(r.distance)}. ${r.steps.length} indicaciones.`);
}
function endGuide(){cancelVoice();state.step=-1;$('#app').classList.remove('guiding');$('#guideNav').hidden=true;$('#walker').setAttribute('hidden','');$('#stepHighlight').setAttribute('d','');$('#guide').innerHTML=icon('play')+'<span>Iniciar guía</span>';renderSteps();fitCurrent();}
function scrollActiveStep(){const list=$('#steps'),active=list.querySelector('.active');if(active)list.scrollTop+=active.getBoundingClientRect().top-list.getBoundingClientRect().top-6;}
function setStep(index,fromAudio=false){
 if(!fromAudio)cancelVoice();
 if(!state.route)return;$('#app').classList.add('guiding');state.step=Math.max(0,Math.min(index,state.route.steps.length-1));const s=state.route.steps[state.step];$('#stepHighlight').setAttribute('d',pathD(s.points));$('#walker').removeAttribute('hidden');$('#guideNav').hidden=false;$('#guide').innerHTML=icon('focus')+'<span>Ver ruta completa</span>';$('#guide').setAttribute('aria-label','Ver ruta completa');$('#stepCounter').textContent=`Paso ${state.step+1} de ${state.route.steps.length}`;$('#previousStep').disabled=state.step===0;$('#nextStep').innerHTML=(state.step===state.route.steps.length-1?'Ver llegada':'Siguiente')+icon('arrow');renderSteps();
 if(!state.stepsOpen){state.stepsOpen=true;$('#routePanel').classList.remove('steps-collapsed');$('#toggleSteps').textContent='Ocultar';$('#toggleSteps').setAttribute('aria-expanded','true');}
 fitPoints(s.points);scrollActiveStep();if(!fromAudio)announce(`Paso ${state.step+1}. ${s.title}. ${s.text}`);
}
function reset(){dismissToast();cancelVoice();state.route=null;state.step=-1;$('#app').classList.remove('guiding');$('#directory').hidden=false;$('#routePanel').hidden=true;$('#routeLayer').setAttribute('hidden','');$('#walker').setAttribute('hidden','');$('#arrows').replaceChildren();$('#arrival').hidden=true;$('#search').value='';$('#legendText').textContent='Selecciona un destino';routeTheme(null);renderDirectory();setPanel(true,false);fitCurrent();try{const url=new URL(location.href);url.hash='';url.searchParams.delete('dest');history.replaceState(null,'',url);}catch{}document.title='Ingavi · Rutas desde A';announce('Mapa general. Selecciona uno de los nueve destinos.');}
$('#home').addEventListener('click',reset);$('#back').addEventListener('click',reset);$('#panelToggle').addEventListener('click',()=>setPanel(!state.panelOpen));
$('#search').addEventListener('input',()=>{cancelVoice();$('#directory').hidden=false;$('#routePanel').hidden=true;setPanel(true,false);renderDirectory();});
$('#searchForm').addEventListener('submit',e=>{e.preventDefault();const q=normal($('#search').value);if(!q){$('#search').focus();return;}const choices=renderDirectory();const r=choices.find(r=>normal(r.name)===q||normal(r.id)===q||normal(r.key)===q)||choices[0];if(r){choose(r.id);$('#search').blur();}else toast('No encontramos ese destino. Busca por nombre o letra.');});
$('#search').addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();$('#destinationList button')?.focus();}else if(e.key==='Escape'){$('#search').value='';if(state.route){$('#directory').hidden=true;$('#routePanel').hidden=false;}else renderDirectory();$('#search').blur();}});
$('#speed').addEventListener('change',e=>{state.speed=Number(e.target.value);updateMetrics();renderDirectory();});
$('#guide').addEventListener('click',()=>state.step<0?setStep(0):endGuide());$('#previousStep').addEventListener('click',()=>setStep(state.step-1));$('#nextStep').addEventListener('click',()=>{if(state.step<state.route.steps.length-1)setStep(state.step+1);else{endGuide();showArrival();}});$('#closeArrival').addEventListener('click',()=>$('#arrival').hidden=true);
$('#toggleSteps').addEventListener('click',()=>{state.stepsOpen=!state.stepsOpen;$('#routePanel').classList.toggle('steps-collapsed',!state.stepsOpen);$('#toggleSteps').textContent=state.stepsOpen?'Ocultar':'Mostrar';$('#toggleSteps').setAttribute('aria-expanded',String(state.stepsOpen));});
$('#listen').addEventListener('click',()=>state.speaking?cancelVoice():startVoice());
$('#stopAudio').addEventListener('click',cancelVoice);
window.addEventListener('pagehide',cancelVoice);
$('#zoomIn').addEventListener('click',()=>{const r=availableRect();zoom(.78,(r.left+r.right)/2,(r.top+r.bottom)/2);});$('#zoomOut').addEventListener('click',()=>{const r=availableRect();zoom(1.28,(r.left+r.right)/2,(r.top+r.bottom)/2);});$('#fit').addEventListener('click',()=>{if(state.route)endGuide();else fitPoints([[190,47],[1040,712]],true,true);});
$('#fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();else toast('Usa la opción de pantalla completa de tu navegador.');}catch{toast('Usa F11 o la opción de pantalla completa de tu navegador.');}});
let satelliteStatus='idle',satelliteTimer;
function applyLayer(){
 const sat=state.layer==='satellite',ready=satelliteStatus==='ready';
 $('#croquisLayer').toggleAttribute('hidden',state.layer!=='sketch'&&!(sat&&!ready));
 $('#originalLayer').toggleAttribute('hidden',state.layer!=='original');
 $('#satelliteLayer').toggleAttribute('hidden',!sat||!ready);
 $('#app').classList.toggle('original-mode',state.layer==='original');
 $('#app').classList.toggle('satellite-mode',sat&&ready);$('#app').classList.toggle('satellite-selected',sat);
 for(const [name,id]of [['sketch','showSketch'],['original','showOriginal'],['satellite','showSatellite']]){
  $('#'+id).classList.toggle('selected',state.layer===name);$('#'+id).setAttribute('aria-pressed',String(state.layer===name));
 }
 $('#satelliteNotice').hidden=!sat;$('#satelliteCredit').hidden=!sat||!ready;
 $('#satelliteNotice').classList.toggle('load-error',satelliteStatus==='error');
 $('#satelliteMessage').textContent=ready?'Satelital · alineación aproximada':satelliteStatus==='error'?'No se pudo cargar. Se muestra el croquis de respaldo.':'Cargando satelital · requiere internet…';
 $('#retrySatellite').hidden=satelliteStatus!=='error';
}
function loadSatellite(){
 clearTimeout(satelliteTimer);satelliteStatus='loading';applyLayer();
 const img=$('#satelliteImage');img.setAttribute('transform',`matrix(${SATELLITE.imageToPlan.join(' ')})`);
 const params=new URLSearchParams({bbox:SATELLITE.bbox.join(','),bboxSR:'4326',imageSR:'4326',size:SATELLITE.imageSize.join(','),format:'jpg',f:'image'});
 img.onload=()=>{clearTimeout(satelliteTimer);satelliteStatus='ready';applyLayer();if(state.layer==='satellite')announce('Vista satelital cargada. Alineación aproximada con el plano.');};
 img.onerror=()=>{clearTimeout(satelliteTimer);satelliteStatus='error';applyLayer();};
 img.removeAttribute('href');img.setAttribute('href',SATELLITE.service+'/export?'+params);
 satelliteTimer=setTimeout(()=>{if(satelliteStatus==='loading'){satelliteStatus='error';applyLayer();}},15000);
}
function setLayer(layer){state.layer=layer;if(layer==='satellite'&&satelliteStatus==='idle')loadSatellite();else applyLayer();announce('Vista '+({sketch:'croquis',original:'plano original',satellite:'satelital'}[layer])+'. Se conserva el recorrido.');}
$('#showSketch').addEventListener('click',()=>setLayer('sketch'));$('#showOriginal').addEventListener('click',()=>setLayer('original'));$('#showSatellite').addEventListener('click',()=>setLayer('satellite'));$('#retrySatellite').addEventListener('click',loadSatellite);
window.addEventListener('online',()=>{if(state.layer==='satellite'&&satelliteStatus==='error')loadSatellite();});
$('#about').addEventListener('click',()=>$('#infoDialog').showModal());$('#closeInfo').addEventListener('click',()=>$('#infoDialog').close());$('#closeInfoBottom').addEventListener('click',()=>$('#infoDialog').close());$('#infoDialog').addEventListener('click',e=>{if(e.target===$('#infoDialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
$('#print').addEventListener('click',()=>{if(!state.route)return;endGuide();setTimeout(()=>window.print(),380);});
window.addEventListener('beforeprint',()=>{const pts=state.route?allPoints(state.route):[[185,40],[1050,720]];const w=stage.clientWidth,h=stage.clientHeight;const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);const minx=Math.min(...xs)-40,maxx=Math.max(...xs)+40,miny=Math.min(...ys)-40,maxy=Math.max(...ys)+40;const scale=Math.max((maxx-minx)/w,(maxy-miny)/h);moveView({x:(maxx+minx-w*scale)/2,y:(maxy+miny-h*scale)/2,w:w*scale,h:h*scale},false);});
window.addEventListener('afterprint',()=>fitCurrent(false));
const pointers=new Map();let drag=null,pinchDistance=0;
function pointerDistance(){const p=[...pointers.values()];return Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);}
svg.addEventListener('pointerdown',e=>{if(e.target.closest('.map-pin'))return;cancelAnimationFrame(state.animation);svg.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});svg.classList.add('dragging');if(pointers.size===1)drag={x:e.clientX,y:e.clientY,view:{...state.view}};if(pointers.size===2)pinchDistance=pointerDistance();});
svg.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===1&&drag){const s=drag.view.w/stage.clientWidth;moveView({...drag.view,x:drag.view.x-(e.clientX-drag.x)*s,y:drag.view.y-(e.clientY-drag.y)*s},false);}else if(pointers.size===2){const d=pointerDistance(),pts=[...pointers.values()];if(d>0&&pinchDistance>0)zoom(pinchDistance/d,(pts[0].x+pts[1].x)/2,(pts[0].y+pts[1].y)/2);pinchDistance=d;}});
function release(e){pointers.delete(e.pointerId);if(pointers.size===1){const p=[...pointers.values()][0];drag={...p,view:{...state.view}};}else if(!pointers.size){drag=null;svg.classList.remove('dragging');}}
svg.addEventListener('pointerup',release);svg.addEventListener('pointercancel',release);svg.addEventListener('wheel',e=>{e.preventDefault();zoom(Math.exp(Math.max(-180,Math.min(180,e.deltaY))*.002),e.clientX,e.clientY);},{passive:false});
let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{if(state.route&&state.step>=0){fitPoints(state.route.steps[state.step].points,false);scrollActiveStep();}else fitCurrent(false);},140);});
window.addEventListener('hashchange',()=>{const id=decodeURIComponent(location.hash.slice(1));if(ROUTES.some(r=>r.id===id||r.key===id))choose(id);else if(!id)reset();});
document.querySelectorAll('[data-place="A"]').forEach(el=>el.innerHTML=placeImage('A'));
routeTheme(null);createPins();renderDirectory();
const requested=decodeURIComponent(location.hash.slice(1))||new URLSearchParams(location.search).get('dest')||INITIAL_DESTINATION;
const initial=ROUTES.find(r=>r.id===requested||r.key===requested);
if(initial)choose(initial.id);else fitCurrent(false);
