const ARCS=[
 {name:'Romance Dawn',saga:'East Blue',from:1,to:3,type:'Canon',desc:'O início da tripulação.'},
 {name:'Orange Town',saga:'East Blue',from:4,to:8,type:'Canon',desc:'Um encontro no caminho.'},
 {name:'Vila Syrup',saga:'East Blue',from:9,to:18,type:'Canon',desc:'Uma nova promessa a bordo.'},
 {name:'Baratie',saga:'East Blue',from:19,to:30,type:'Canon',desc:'Um restaurante no meio do mar.'},
 {name:'Arlong Park',saga:'East Blue',from:31,to:44,type:'Canon',desc:'Uma ilha guarda uma história antiga.'},
 {name:'Loguetown',saga:'East Blue',from:45,to:53,type:'Misto',desc:'A última parada antes da Grand Line.'},
 {name:'Fillers de East Blue',saga:'East Blue',from:54,to:61,type:'Filler',desc:'Aventura opcional antes da Grand Line.'},
 {name:'Reverse Mountain & Whiskey Peak',saga:'Alabasta',from:62,to:67,type:'Canon',desc:'A entrada na Grand Line.'},
 {name:'Little Garden',saga:'Alabasta',from:70,to:77,type:'Canon',desc:'Uma ilha parada no tempo.'},
 {name:'Drum Island',saga:'Alabasta',from:78,to:91,type:'Canon',desc:'Uma busca por médico.'},
 {name:'Alabasta',saga:'Alabasta',from:92,to:130,type:'Misto',desc:'Uma corrida para salvar um reino.'},
 {name:'Jaya & Skypiea',saga:'Sky Island',from:144,to:195,type:'Canon',desc:'Uma aventura acima das nuvens.'},
 {name:'G-8',saga:'Sky Island',from:196,to:206,type:'Filler',desc:'Uma parada opcional após Skypiea.'},
 {name:'Water 7 & Enies Lobby',saga:'Water 7',from:207,to:312,type:'Canon',desc:'Uma decisão que muda a tripulação.'},
 {name:'Thriller Bark',saga:'Thriller Bark',from:337,to:381,type:'Canon',desc:'Uma ilha envolta em neblina.'},
 {name:'Arquipélago Sabaody',saga:'Summit War',from:385,to:405,type:'Canon',desc:'Todos os caminhos se cruzam.'},
 {name:'Amazon Lily & Impel Down',saga:'Summit War',from:408,to:458,type:'Canon',desc:'Uma missão impossível começa.'},
 {name:'Marineford & Pós-Guerra',saga:'Summit War',from:459,to:516,type:'Canon',desc:'O mundo inteiro está em movimento.'},
 {name:'Ilha dos Homens-Peixe',saga:'Ilha dos Homens-Peixe',from:517,to:574,type:'Canon',desc:'O reencontro depois de dois anos.'},
 {name:'Punk Hazard',saga:'Dressrosa',from:579,to:625,type:'Misto',desc:'Uma ilha de extremos.'},
 {name:'Dressrosa',saga:'Dressrosa',from:629,to:746,type:'Canon',desc:'Uma cidade esconde um grande segredo.'},
 {name:'Zou',saga:'Whole Cake',from:751,to:779,type:'Canon',desc:'Uma jornada por uma ilha viva.'},
 {name:'Whole Cake Island',saga:'Whole Cake',from:783,to:877,type:'Canon',desc:'Uma missão em território desconhecido.'},
 {name:'Reverie',saga:'Whole Cake',from:878,to:889,type:'Canon',desc:'Líderes de todo o mundo se reúnem.'},
 {name:'Wano',saga:'Wano',from:890,to:1085,type:'Misto',desc:'Um país fechado aguarda sua libertação.'},
 {name:'Egghead',saga:'Saga Final',from:1086,to:null,type:'Canon',desc:'Uma ilha futurista e um novo mistério.'}
];
const FILMS=[
 {name:'One Piece: O Filme',after:53,desc:'A primeira aventura cinematográfica.',id:'film-1'},
 {name:'Aventura na Ilha Nejimaki',after:130,desc:'Uma história independente da série.',id:'film-2'},
 {name:'Strong World',after:381,desc:'Uma aventura com roteiro de Eiichiro Oda.',id:'film-10'},
 {name:'Film Z',after:578,desc:'Uma ameaça cruza o caminho dos Chapéus de Palha.',id:'film-z'},
 {name:'Film Gold',after:750,desc:'Uma cidade extravagante em alto-mar.',id:'film-gold'},
 {name:'Stampede',after:889,desc:'Uma grande celebração dos piratas.',id:'film-stampede'},
 {name:'Film Red',after:1030,desc:'Uma nova história ligada à música.',id:'film-red'}
];
const BADGES=[
 {at:1,icon:'⚓',name:'Lançou âncora'},
 {at:5,icon:'🧭',name:'Bom navegador'},
 {at:10,icon:'🌊',name:'Mar aberto'},
 {at:20,icon:'🏴‍☠️',name:'Grande aventure'},
 {at:25,icon:'✦',name:'Lenda dos mares'}
];
const STORAGE='grand-line-save-v1';
let save=loadSave(),filter='todos',query='',deferredInstall=null;
function loadSave(){try{return JSON.parse(localStorage.getItem(STORAGE))||{arcs:{},films:{}}}catch{return{arcs:{},films:{}}}}
function persist(){localStorage.setItem(STORAGE,JSON.stringify(save));renderProgress();renderBadges()}
function status(id){return save.arcs[id]||''}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function episodeText(a){return a.to?`${a.from}–${a.to}`:`${a.from}+`}
function stateLabel(s){return s==='done'?'Assistido':s==='skipped'?'Pulado':'Marcar visto'}
function arcMarkup(a,i){const id=String(i),s=status(id),typeClass=a.type.toLowerCase(),action=s==='done'?'Assistido':s==='skipped'?'Pulado':'Marcar visto';return `<article class="arc-row"><span class="arc-index">${String(i+1).padStart(2,'0')}</span><div><h3>${esc(a.name)}</h3><div class="arc-detail"><span class="range">EP. ${episodeText(a)}</span><span class="type-tag ${typeClass}">${a.type==='Canon'?'HISTÓRIA':a.type==='Misto'?'HISTÓRIA + FILLER':'FILLER'}</span>${esc(a.saga)} · ${esc(a.desc)}</div></div><div class="row-actions"><button class="row-action ${s==='done'?'done':''} ${s==='skipped'?'skip':''}" data-arc="${id}" aria-pressed="${Boolean(s)}">${action}</button>${a.type==='Filler'&&!s?`<button class="row-action skip" data-skip="${id}">Pular</button>`:''}</div></article>`}
function visibleArcs(){return ARCS.map((a,i)=>({a,i})).filter(({a,i})=>(filter==='todos'||(filter==='pendentes'?!status(String(i)):status(String(i))))&&(`${a.name} ${a.saga} ${a.type}`.toLowerCase().includes(query.toLowerCase())))}
function renderArcs(){document.querySelector('#arc-list').innerHTML=visibleArcs().map(x=>arcMarkup(x.a,x.i)).join('')||'<p class="empty-state">Nenhum arco encontrado.</p>';document.querySelector('#full-arc-list').innerHTML=ARCS.map(arcMarkup).join('');document.querySelector('#total-count').textContent=ARCS.length;document.querySelector('#journey-summary').innerHTML=`<strong>${ARCS.filter((_,i)=>status(String(i))).length} de ${ARCS.length}</strong> arcos registrados · ${Object.values(save.arcs).filter(v=>v==='skipped').length} filler(s) pulado(s)`}
function renderProgress(){const count=ARCS.filter((_,i)=>status(String(i))).length,pct=Math.round(count/ARCS.length*100);document.querySelector('#progress-percent').textContent=pct;document.querySelector('#progress-fill').style.width=`${pct}%`;document.querySelector('#progress-count').textContent=`${count} de ${ARCS.length} arcos concluídos`;let next=ARCS.findIndex((_,i)=>!status(String(i)));if(next<0){document.querySelector('#current-position').textContent='Jornada registrada';document.querySelector('#next-title').textContent='Uma jornada completa';document.querySelector('#next-description').textContent='Você já percorreu todos os arcos desta lista.';document.querySelector('#next-episodes').textContent='✦';document.querySelector('#next-mark').hidden=true;return}document.querySelector('#next-mark').hidden=false;let a=ARCS[next];document.querySelector('#current-position').textContent=`Próximo: ${a.name}`;document.querySelector('#next-title').textContent=a.name;document.querySelector('#next-description').textContent=a.desc;document.querySelector('#next-episodes').textContent=episodeText(a);document.querySelector('#next-mark').dataset.arc=String(next);document.querySelector('#continue-button').onclick=()=>{document.querySelector('#next-card').scrollIntoView({behavior:'smooth',block:'center'});document.querySelector('#next-card').classList.add('highlight');setTimeout(()=>document.querySelector('#next-card').classList.remove('highlight'),800)}}
function renderBadges(){const count=ARCS.filter((_,i)=>status(String(i))).length;document.querySelector('#badge-list').innerHTML=BADGES.map(b=>`<div class="badge ${count>=b.at?'earned':''}" title="${count>=b.at?'Conquistada':'Desbloqueia em '+b.at+' arcos'}"><span>${count>=b.at?b.icon:'?'}</span><small>${esc(b.name)}</small></div>`).join('')}
function renderFilms(){document.querySelector('#film-list').innerHTML=FILMS.map((f,i)=>{let done=save.films[f.id];return `<article class="film-card"><span class="film-number">FILME<br>${String(i+1).padStart(2,'0')}</span><div><h3>${esc(f.name)}</h3><p>${esc(f.desc)}</p></div><span class="watch-point">DEPOIS DO EP. ${f.after}</span><button class="row-action ${done?'done':''}" data-film="${f.id}" aria-pressed="${Boolean(done)}">${done?'Assistido':'Marcar visto'}</button></article>`}).join('')}
function showToast(msg){const t=document.querySelector('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>t.classList.remove('show'),2600)}
function setView(name){document.querySelectorAll('.view').forEach(v=>v.classList.add('hidden'));document.querySelector(`#view-${name}`).classList.remove('hidden');document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.view===name));window.scrollTo({top:0,behavior:'smooth'})}
function download(name,content,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([content],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function exportSave(){download('grand-line-save.json',JSON.stringify({app:'Rota da Grand Line',version:1,exportedAt:new Date().toISOString(),...save},null,2),'application/json')}
function importSave(file){const reader=new FileReader();reader.onload=()=>{try{const parsed=JSON.parse(reader.result);if(!parsed.arcs||typeof parsed.arcs!=='object')throw Error();save={arcs:parsed.arcs,films:parsed.films||{}};persist();renderArcs();renderFilms();showToast('Save importado neste dispositivo.')}catch{showToast('Arquivo inválido. Escolha um save exportado pelo app.')}};reader.readAsText(file)}
document.querySelectorAll('.nav-item').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));document.querySelectorAll('[data-goto]').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.goto)));
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.classList.toggle('selected',x===b));renderArcs()}));
document.querySelector('#search-input').addEventListener('input',e=>{query=e.target.value;renderArcs()});
document.addEventListener('click',e=>{const skip=e.target.closest('[data-skip]');if(skip){save.arcs[skip.dataset.skip]='skipped';persist();renderArcs();showToast('Filler pulado. A jornada continua!');return}const a=e.target.closest('[data-arc]');if(a){const id=a.dataset.arc;save.arcs[id]=status(id)==='done'?'':status(id)==='skipped'?'done':'done';persist();renderArcs();showToast(status(id)?'Arco registrado no seu diário.':'Marcação removida.');return}const f=e.target.closest('[data-film]');if(f){save.films[f.dataset.film]=!save.films[f.dataset.film];localStorage.setItem(STORAGE,JSON.stringify(save));renderFilms()}});
document.querySelector('#next-mark').addEventListener('click',e=>{save.arcs[e.currentTarget.dataset.arc]='done';persist();renderArcs();showToast('Arco registrado no seu logbook.')});
document.querySelector('#export-button').addEventListener('click',exportSave);document.querySelector('#backup-button').addEventListener('click',exportSave);document.querySelector('#import-button').addEventListener('click',()=>document.querySelector('#import-file').click());document.querySelector('#import-file').addEventListener('change',e=>{if(e.target.files[0])importSave(e.target.files[0]);e.target.value=''});
document.querySelector('#bookmark-button').addEventListener('click',()=>showToast(/Android|iPhone|iPad/i.test(navigator.userAgent)?'No menu do navegador, escolha “Adicionar aos favoritos”.':'Pressione Ctrl+D (ou ⌘D) para salvar este site nos favoritos.'));
document.querySelector('#install-button').addEventListener('click',async()=>{if(deferredInstall){deferredInstall.prompt();await deferredInstall.userChoice;deferredInstall=null}else showToast('No menu do navegador, escolha “Instalar este site como app” ou “Adicionar à tela inicial”.')});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstall=e;document.querySelector('#install-button').classList.add('ready')});
window.addEventListener('online',()=>document.querySelector('#connection-label').textContent='PRONTO PARA OFFLINE');window.addEventListener('offline',()=>document.querySelector('#connection-label').textContent='MODO OFFLINE');
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
renderArcs();renderProgress();renderFilms();renderBadges();
