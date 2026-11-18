(function(){
var P=window.P, KEY='silverplate-sirexe-pilotage-v1';
var $=function(s){return document.querySelector(s)}, $$=function(s){return Array.prototype.slice.call(document.querySelectorAll(s))};
function ic(n){return '<i class="ic" style="-webkit-mask-image:url(assets/icons/'+n+'.svg);mask-image:url(assets/icons/'+n+'.svg)"></i>'}
function hydrate(){$$('[data-ic]').forEach(function(e){var u='url(assets/icons/'+e.dataset.ic+'.svg)';e.style.webkitMaskImage=u;e.style.maskImage=u})}
function fm(n){return Math.round(n).toLocaleString('fr-FR').replace(/\u202f|\u00a0/g,' ')}
function mf(n){return (n/1e6).toLocaleString('fr-FR',{minimumFractionDigits:1,maximumFractionDigits:1})}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function D(s){var a=s.split('-');return new Date(+a[0],+a[1]-1,+a[2])}
var JOURS=['dim.','lun.','mar.','mer.','jeu.','ven.','sam.'],MOIS=['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];
function dd(s){var d=D(s);return ('0'+d.getDate()).slice(-2)+'/'+('0'+(d.getMonth()+1)).slice(-2)}
function dlong(s){var d=D(s);return JOURS[d.getDay()]+' '+d.getDate()+' '+MOIS[d.getMonth()]}
var T=D(P.today), J=D(P.jourJ), D0=D(P.debut), D1=D(P.fin), SPAN=(D1-D0)/864e5;
function jr(s){var n=Math.round((D(s)-J)/864e5);return n===0?'Jour J':(n<0?'J'+n:'J+'+n)}
function inDays(s){return Math.round((D(s)-T)/864e5)}
var JM=Math.round((J-T)/864e5);
function who(k,full){var p=P.personnes[k];return '<span class="who"><span class="av" style="background:'+p.c+'">'+p.ini+'</span>'+(full?p.nom:p.court)+'</span>'}
function toast(m){var t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.h);toast.h=setTimeout(function(){t.classList.remove('on')},2600)}

/* ---------- état, sauvegardé dans le navigateur ---------- */
function fresh(){return {v:P.version,taches:P.taches.map(function(t){return Object.assign({},t)}),client:P.client.map(function(c){return Object.assign({email:'',rel:[]},c)}),def:''}}
var S;
try{S=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){S=null}
if(!S||S.v!==P.version)S=fresh();
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}

function lc(s){return s.charAt(0).toLowerCase()+s.slice(1)}
function late(t){return t.s!=='fait'&&D(t.d)<T}
function etat(t){return t.s==='fait'?'fait':(late(t)?'retard':t.s)}
function pct(){var n=S.taches.length,f=0;S.taches.forEach(function(t){f+=t.s==='fait'?1:(t.s==='cours'?.5:0)});return n?Math.round(f/n*100):0}
function counts(){var c={afaire:0,cours:0,fait:0};S.taches.forEach(function(t){c[t.s]++});return c}

/* ---------- points bloquants ---------- */
function bloquants(){
  var L=[];
  S.taches.forEach(function(t){
    if(late(t))L.push({niv:'r',k:'t',id:t.id,d:t.d,tt:t.t,ss:'Échéance du '+dd(t.d)+' dépassée de '+(-inDays(t.d))+' j. '+(t.s==='cours'?'En cours.':'Pas commencée.'),q:t.q,lot:t.lot});
    else if(t.s!=='fait'&&inDays(t.d)<=3)L.push({niv:'a',k:'t',id:t.id,d:t.d,tt:t.t,ss:(inDays(t.d)===0?'Échéance aujourd\'hui':'Échéance le '+dlong(t.d)+', dans '+inDays(t.d)+' j')+(t.s==='afaire'?', pas commencée.':', en cours.'),q:t.q,lot:t.lot});
  });
  S.client.forEach(function(c){
    if(c.recu)return;var n=inDays(c.att);
    if(n<0)L.push({niv:'r',k:'c',id:c.id,d:c.att,tt:'Non reçu du client : '+lc(c.nom),ss:'Attendu le '+dd(c.att)+', demandé le '+dd(c.dem)+'. '+c.pq+(c.rel.length?' Relancé le '+c.rel.map(dd).join(', ')+'.':' Jamais relancé.'),q:c.q});
    else if(n<=7)L.push({niv:'a',k:'c',id:c.id,d:c.att,tt:'À recevoir du client : '+lc(c.nom),ss:'Attendu le '+dlong(c.att)+', dans '+n+' j. '+c.pq,q:c.q});
  });
  P.lots.forEach(function(l){if(l.engage>l.budget)L.push({niv:'a',k:'b',id:l.nom,d:P.today,tt:'Budget dépassé : '+l.nom,ss:'Signé '+fm(l.engage)+' FCFA HT pour '+fm(l.budget)+' prévus, soit +'+fm(l.engage-l.budget)+' FCFA.'+(l.note?' '+l.note+'.':''),q:'J'})});
  L.sort(function(a,b){return (a.niv===b.niv?0:(a.niv==='r'?-1:1))||(D(a.d)-D(b.d))});
  return L;
}

/* ---------- relance par e-mail (brouillon, jamais envoyé seul) ---------- */
var EMRX=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
function mailto(c){
  var p=P.personnes[c.q], n=inDays(c.att);
  var sub='Stand SIREXE 2026 : '+c.nom.charAt(0).toLowerCase()+c.nom.slice(1)+', échéance du '+dd(c.att);
  var body='Bonjour,\n\nPour votre stand au SIREXE 2026, nous attendons de votre part : '+c.nom.charAt(0).toLowerCase()+c.nom.slice(1)+'.\n'
   +'Nous vous l\'avions demandé le '+dd(c.dem)+', pour le '+dd(c.att)+'. '+c.pq+'\n\n'
   +(n<0?'Pourriez-vous nous transmettre cet élément dès que possible ?':'Pourriez-vous nous transmettre cet élément d\'ici le '+dlong(c.att)+' ?')+' Si un point vous bloque, nous pouvons en parler par téléphone.\n\n'
   +'Merci, et belle journée,\n\n'+p.court+'\nSN Silverplate Services';
  return 'mailto:'+encodeURIComponent(c.email)+'?subject='+encodeURIComponent(sub)+'&body='+encodeURIComponent(body);
}
function relancer(id){
  var c=S.client.filter(function(x){return x.id===id})[0]; if(!c)return;
  if(!EMRX.test(c.email||'')){
    if(EMRX.test(S.def||'')){c.email=S.def}else{
      show('client');var i=$('#em-'+id)||$('#cl-def');if(i){i.focus();i.classList.add('flash');setTimeout(function(){i.classList.remove('flash')},1300)}
      toast('Saisissez d\'abord l\'adresse e-mail du contact.');return}
  }
  if(c.rel.indexOf(P.today)<0)c.rel.push(P.today);save();
  var a=document.createElement('a');a.href=mailto(c);a.id='last-mailto';a.style.display='none';document.body.appendChild(a);
  window.__lastMailto=a.href;
  try{a.click()}catch(e){}
  setTimeout(function(){a.remove()},500);
  toast('Brouillon ouvert dans votre messagerie. Rien n\'est envoyé sans vous.');
  render();
}
function setRecu(id,v){var c=S.client.filter(function(x){return x.id===id})[0];if(!c)return;c.recu=v?P.today:'';save();toast(v?'Marqué reçu le '+dd(P.today)+'.':'Marqué non reçu.');render()}
function moveTask(id,s){var t=S.taches.filter(function(x){return x.id===id})[0];if(!t||t.s===s)return;t.s=s;save();toast('« '+t.t.slice(0,48)+(t.t.length>48?'…':'')+' » : '+LBL[s]+'. Réalisation : '+pct()+' %.');render()}
var LBL={afaire:'À faire',cours:'En cours',fait:'Fait',retard:'En retard'};

/* ---------- navigation ---------- */
var VIEWS=['apercu','frise','kanban','bloquants','client'], cur='apercu';
function show(v){if(VIEWS.indexOf(v)<0)v='apercu';cur=v;$$('.view').forEach(function(e){e.classList.toggle('on',e.id==='v-'+v)});$$('#tabs .tb').forEach(function(a){a.classList.toggle('on',a.dataset.v===v)});if(location.hash!=='#'+v)history.replaceState(null,'','#'+v);var a=$('#tabs .tb.on');if(a&&a.scrollIntoView){var tb=$('#tabs');tb.scrollLeft=a.offsetLeft-16}}
$$('#tabs .tb').forEach(function(a){a.href='#'+a.dataset.v;a.onclick=function(e){e.preventDefault();show(a.dataset.v);window.scrollTo(0,0)}});
window.addEventListener('hashchange',function(){show(location.hash.slice(1))});

/* ---------- rendus ---------- */
var kbWho='all';
function render(){
  var p=pct(), c=counts(), B=bloquants(), nr=B.filter(function(b){return b.niv==='r'}).length, na=B.length-nr;
  var recus=S.client.filter(function(x){return x.recu}).length, nRet=S.taches.filter(late).length;
  $('#arrete').textContent='Situation au '+dlong(P.today)+' 2026, J-'+JM;
  $('#nb-bl').textContent=nr; $('#nb-bl').style.display=nr?'':'none';
  /* vue d'ensemble */
  $('#pct').textContent=p+' %'; $('#ring').setAttribute('stroke-dashoffset',(452.4*(1-p/100)).toFixed(1));
  $('#pct-txt').textContent=c.fait+' tâches faites et '+c.cours+' en cours, sur '+S.taches.length+'. Une tâche en cours compte pour moitié.';
  $('#jm').textContent='J-'+JM;
  var tot={devis:0,budget:0,engage:0};P.lots.forEach(function(l){tot.devis+=l.devis;tot.budget+=l.budget;tot.engage+=l.engage});
  $('#phrase').innerHTML='Le stand ouvre le <b>mercredi 18 novembre</b>, dans <b>'+JM+' jours</b>. L\'événement est réalisé à <b>'+p+' %</b>. '
   +'<b>'+nr+' point'+(nr>1?'s':'')+' bloquant'+(nr>1?'s':'')+'</b> en rouge, dont '+S.client.filter(function(x){return !x.recu&&D(x.att)<T}).length+' élément(s) que le client n\'a pas remis.';
  $('#mini').innerHTML=[
    ['triangle-alert','Points bloquants',nr,'en rouge',na+' autre'+(na>1?'s':'')+' à surveiller','bloquants',nr?'red':''],
    ['inbox','Éléments du client',recus+'/'+S.client.length,'reçus',(S.client.length-recus)+' en attente, dont '+S.client.filter(function(x){return !x.recu&&D(x.att)<T}).length+' en retard','client',(S.client.length-recus)?'amb':''],
    ['clock','Tâches en retard',nRet,'',nRet?'Échéance passée, pas encore faites':'Aucune échéance dépassée','kanban',nRet?'red':''],
    ['file-text','Commandes signées',mf(tot.engage),'M FCFA HT',Math.round(tot.engage/tot.budget*100)+' % du coût prévu ('+mf(tot.budget)+' M FCFA HT)','apercu','']
  ].map(function(k){return '<div class="kpi '+k[6]+'" data-go="'+k[5]+'"><div class="h"><span class="bx">'+ic(k[0])+'</span><span class="l">'+k[1]+'</span></div><p class="v">'+k[2]+'<small>'+k[3]+'</small></p><p class="d">'+k[4]+'</p></div>'}).join('');
  $$('#mini .kpi').forEach(function(e){e.onclick=function(){show(e.dataset.go);window.scrollTo(0,0)}});
  var n=S.taches.length;
  $('#cols3').innerHTML=[['afaire','À faire'],['cours','En cours'],['fait','Fait']].map(function(x){return '<div class="colsum"><p class="l">'+x[1]+'</p><p class="v">'+c[x[0]]+'</p><div class="bar"><i style="width:'+Math.round(c[x[0]]/n*100)+'%;background:'+(x[0]==='fait'?'#047857':(x[0]==='cours'?'#4C63D2':'#A0A6B8'))+'"></i></div></div>'}).join('');
  var mx=Math.max.apply(null,P.lots.map(function(l){return l.devis}));
  $('#budget').innerHTML=P.lots.map(function(l){var over=l.engage>l.budget;
    return '<div class="row"><span class="t">'+l.nom+'</span><div class="track"><span class="b" style="width:'+(l.budget/mx*100)+'%"></span><span class="g'+(over?' over':'')+'" style="width:'+(l.engage/mx*100)+'%"></span><span class="tk" style="left:'+(l.devis/mx*100)+'%"></span></div><span class="m">'+mf(l.engage)+' / '+mf(l.budget)+'</span></div>'}).join('')
   +'<div class="legend"><span><i style="background:#262C51"></i>Signé</span><span><i style="background:#C9D1EA"></i>Coût prévu</span><span><i style="background:#141830;width:3px"></i>Prix au devis</span><span><i style="background:#B91C1C"></i>Signé au-delà du prévu</span></div>';
  var marge=tot.devis-tot.budget;
  $('#money').innerHTML=[['Devis du stand',fm(tot.devis)+' FCFA HT',fm(P.devisTTC)+' FCFA TTC, TVA 18 %'],['Marge prévue au devis',fm(marge)+' FCFA HT',Math.round(marge/tot.devis*100)+' % du prix HT'],['Encaissé',fm(P.acompte)+' FCFA TTC','Acompte de 50 % reçu le 19/10 ; solde de '+fm(P.solde)+' FCFA TTC le 25/11']]
   .map(function(m){return '<div class="mi"><p class="l">'+m[0]+'</p><p class="v">'+m[1]+'</p><p class="l" style="margin-top:4px">'+m[2]+'</p></div>'}).join('');
  renderFrise(); renderKanban(); renderBloquants(B); renderClient(); hydrate();
}

/* échelle en deux temps : l'avant-projet (J-60 à J-23) resserré, la fin du projet au large */
var SPL=D('2026-10-26'), A1=0.2;
function fx(d){var n=(d-D0)/864e5, a=(SPL-D0)/864e5, b=(D1-SPL)/864e5+1;return n<=a?n/a*A1:A1+(n-a)/b*(1-A1)}
function x(s){return fx(D(s))*100}
function ipos(f){return 'calc(170px + (100% - 214px) * '+f.toFixed(4)+')'}
function pos(s){return 'left:'+ipos(x(s)/100)}
function renderFrise(){
  var h='<div class="g-ph">'+P.phases.map(function(ph){var a=x(ph.d),e=D(ph.f);e.setDate(e.getDate()+1);var b=fx(e)*100;return '<div style="left:'+ipos(a/100)+';width:calc((100% - 214px) * '+((b-a)/100).toFixed(4)+' - 3px);background:'+ph.c+'" title="'+ph.nom+'">'+ph.nom+'</div>'}).join('')+'</div>';
  h+='<div class="g-wk">';[-56,-42,-28,-14,-7,0,7].forEach(function(k){var d=new Date(J);d.setDate(d.getDate()+k);var s=d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);h+='<span style="'+pos(s)+'">'+(k===0?'J':(k<0?'J'+k:'J+'+k))+', '+dd(s)+'</span>'});h+='</div>';
  var lots=[];S.taches.forEach(function(t){if(lots.indexOf(t.lot)<0)lots.push(t.lot)});
  var order=['Projet','Menuiserie et sol','Impression','Mobilier','Électricité','Écran','Personnel','Transport et assurance','Montage','Salon','Démontage'];
  lots.sort(function(a,b){var i=order.indexOf(a),j=order.indexOf(b);return (i<0?99:i)-(j<0?99:j)});
  h+='<div class="g-rows">'+lots.map(function(l){return '<div class="g-row"><span class="lb">'+l+'</span>'+S.taches.filter(function(t){return t.lot===l}).map(function(t){var e=t.f?D(t.f):null;if(e)e.setDate(e.getDate()+1);var w=t.f?'width:calc((100% - 214px) * '+(fx(e)-x(t.d)/100).toFixed(4)+' - 4px);':'';
    return '<span class="g-dot '+etat(t)+'" style="'+pos(t.d)+';'+w+'margin-left:-6px" title="'+esc(dd(t.d)+(t.f?' au '+dd(t.f):'')+' : '+t.t+' ('+P.personnes[t.q].court+', '+LBL[etat(t)]+')')+'" data-t="'+t.id+'"></span>'}).join('')+'</div>'}).join('');
  h+='<div class="g-line today" style="'+pos(P.today)+'"><b>Aujourd\'hui</b></div><div class="g-line jj" style="'+pos(P.jourJ)+'"><b>Jour J</b></div></div>';
  var ms=S.taches.filter(function(t){return t.j}), rows=[], gw=Math.max(300,($('#gantt').clientWidth||1000)-214), mr=0;
  var lay=ms.map(function(t){var px=x(t.d)/100*gw, w=t.j.length*6.6+30, rv=px+w>gw+40, l=rv?px-w+12:px-12, r=0;
    while(rows[r]!=null&&l<rows[r]+6)r++;rows[r]=l+w;mr=Math.max(mr,r);return {r:r,rv:rv}});
  h+='<div class="g-ms" style="height:'+(34+mr*26)+'px">'+ms.map(function(t,i){return '<div class="m '+etat(t)+(lay[i].rv?' rv':'')+'" style="'+pos(t.d)+';top:'+(4+lay[i].r*26)+'px"><i></i><span>'+t.j+'</span></div>'}).join('')+'</div>';
  $('#gantt').innerHTML=h;
  $$('#gantt .g-dot').forEach(function(e){e.onclick=function(){toast(e.getAttribute('title'))}});
  $('#jal').innerHTML=ms.map(function(t){var e=etat(t);return '<div><b>'+t.j+'</b><span>'+dlong(t.d)+', '+jr(t.d)+'</span><p class="jw"><span class="pill '+(e==='afaire'?'avenir':e)+'">'+LBL[e]+'</span>'+who(t.q)+'</p></div>'}).join('');
}

function renderKanban(){
  $('#kb-pct').textContent=pct()+' %';
  $('#kb-who').innerHTML=[['all','Toute l\'équipe']].concat(['J','A','R'].map(function(k){return [k,P.personnes[k].court]})).map(function(o){return '<button class="chipb'+(kbWho===o[0]?' on':'')+'" data-w="'+o[0]+'">'+o[1]+'</button>'}).join('');
  $$('#kb-who .chipb').forEach(function(b){b.onclick=function(){kbWho=b.dataset.w;renderKanban();hydrate()}});
  var cols=[['afaire','À faire','#A0A6B8'],['cours','En cours','#4C63D2'],['fait','Fait','#047857']];
  $('#kb').innerHTML=cols.map(function(c,ci){
    var cards=S.taches.filter(function(t){return t.s===c[0]&&(kbWho==='all'||t.q===kbWho)}).sort(function(a,b){return c[0]==='fait'?(D(b.d)-D(a.d)):(D(a.d)-D(b.d))});
    return '<div class="kcol" data-s="'+c[0]+'"><div class="kh"><span class="dt" style="background:'+c[2]+'"></span><h3>'+c[1]+'</h3><span class="c">'+cards.length+'</span></div><div class="kcards">'
     +cards.map(function(t){var e=etat(t),n=inDays(t.d);var soon=t.s!=='fait'&&!late(t)&&n<=3;
       return '<div class="card-k '+(e==='retard'?'retard':(soon?'soon':''))+'" data-id="'+t.id+'"><span class="grip" title="Glisser">'+ic('grip-vertical')+'</span><p class="t">'+t.t+'</p><div class="m2"><span class="d'+(e==='retard'?' r':'')+'">'+dd(t.d)+(t.f?' au '+dd(t.f):'')+(e==='retard'?', en retard':'')+'</span><span>'+jr(t.d)+'</span><span class="lt">'+t.lot+'</span>'+who(t.q)
       +'<span class="mv">'+(ci>0?'<button data-mv="'+cols[ci-1][0]+'" title="Vers '+cols[ci-1][1]+'" aria-label="Vers '+cols[ci-1][1]+'">'+ic('arrow-left')+'</button>':'')+(ci<2?'<button data-mv="'+cols[ci+1][0]+'" title="Vers '+cols[ci+1][1]+'" aria-label="Vers '+cols[ci+1][1]+'">'+ic('arrow-right')+'</button>':'')+'</span></div></div>'}).join('')
     +(cards.length?'':'<p class="empty">Aucune tâche</p>')+'</div></div>'}).join('');
  $$('#kb .mv button').forEach(function(b){b.onclick=function(e){e.stopPropagation();moveTask(b.closest('.card-k').dataset.id,b.dataset.mv)}});
  $$('#kb .grip').forEach(function(g){g.addEventListener('pointerdown',startDrag)});
}
/* glisser-déposer à la souris et au doigt */
var drag=null;
function startDrag(e){
  if(e.button>0)return; e.preventDefault();
  var card=e.currentTarget.closest('.card-k'), r=card.getBoundingClientRect(), cl=card.cloneNode(true);
  cl.classList.add('drag-clone');cl.style.width=r.width+'px';cl.style.left=r.left+'px';cl.style.top=r.top+'px';document.body.appendChild(cl);
  card.classList.add('ghost');
  drag={id:card.dataset.id,card:card,cl:cl,dx:e.clientX-r.left,dy:e.clientY-r.top,over:null};
  document.addEventListener('pointermove',onDrag);document.addEventListener('pointerup',endDrag);document.addEventListener('pointercancel',endDrag);
}
function onDrag(e){
  if(!drag)return; drag.cl.style.left=(e.clientX-drag.dx)+'px'; drag.cl.style.top=(e.clientY-drag.dy)+'px';
  var el=document.elementFromPoint(e.clientX,e.clientY), col=el&&el.closest?el.closest('.kcol'):null;
  if(drag.over&&drag.over!==col)drag.over.classList.remove('over');
  if(col){col.classList.add('over');drag.over=col}else drag.over=null;
  if(e.clientY<60)window.scrollBy(0,-12); else if(e.clientY>window.innerHeight-60)window.scrollBy(0,12);
}
function endDrag(){
  if(!drag)return; document.removeEventListener('pointermove',onDrag);document.removeEventListener('pointerup',endDrag);document.removeEventListener('pointercancel',endDrag);
  var d=drag; drag=null; d.cl.remove(); d.card.classList.remove('ghost');
  if(d.over){d.over.classList.remove('over');moveTask(d.id,d.over.dataset.s)}
}

function renderBloquants(B){
  var nr=B.filter(function(b){return b.niv==='r'}).length, nc=B.filter(function(b){return b.k==='c'}).length;
  $('#bl-sum').innerHTML='<div class="mi r"><p class="v">'+nr+'</p><p class="l">alertes rouges</p></div><div class="mi a"><p class="v">'+(B.length-nr)+'</p><p class="l">à surveiller</p></div><div class="mi"><p class="v">'+nc+'</p><p class="l">attendus du client</p></div>';
  $('#bl').innerHTML=B.length?B.map(function(b){
    var tag=b.niv==='r'?'<span class="tag r">Rouge</span>':'<span class="tag a">À surveiller</span>';
    var act='';
    if(b.k==='c')act='<button class="btn pri sm" data-rel="'+b.id+'">'+ic('mail')+'Relancer le client</button><button class="btn sm" data-rc="'+b.id+'">'+ic('check')+'Reçu</button>';
    else if(b.k==='t')act='<button class="btn sm" data-go-k="'+b.id+'">'+ic('square-kanban')+'Voir la carte</button><button class="btn sm" data-done="'+b.id+'">'+ic('check')+'Fait</button>';
    return '<div class="bl '+b.niv+'"><span class="bx">'+ic(b.k==='c'?'inbox':(b.k==='b'?'wallet':(b.niv==='r'?'triangle-alert':'clock')))+'</span><div><p class="tt">'+tag+b.tt+'</p><p class="ss">'+b.ss+' Suivi : <b>'+P.personnes[b.q].court+'</b>.</p></div><div class="act">'+act+'</div></div>'}).join('')
    :'<p class="empty">Aucun point bloquant. Tout est dans les temps.</p>';
  $$('#bl [data-rel]').forEach(function(b){b.onclick=function(){relancer(b.dataset.rel)}});
  $$('#bl [data-rc]').forEach(function(b){b.onclick=function(){setRecu(b.dataset.rc,true)}});
  $$('#bl [data-done]').forEach(function(b){b.onclick=function(){moveTask(b.dataset.done,'fait')}});
  $$('#bl [data-go-k]').forEach(function(b){b.onclick=function(){var id=b.dataset.goK;kbWho='all';show('kanban');renderKanban();hydrate();var c=$('.card-k[data-id="'+id+'"]');if(c){c.scrollIntoView({block:'center'});c.classList.add('flash')}}});
}

function renderClient(){
  var act=document.activeElement&&document.activeElement.id;
  $('#cl-def').value=S.def||'';
  $('#cl-stat').textContent=S.client.filter(function(c){return c.recu}).length+'/'+S.client.length;
  var L=S.client.slice().sort(function(a,b){return (a.recu?1:0)-(b.recu?1:0)||(D(a.att)-D(b.att))});
  $('#cl').innerHTML=L.map(function(c){var n=inDays(c.att),lt=!c.recu&&n<0;
    return '<div class="cl'+(c.recu?' recu':'')+'"><p class="nm">'+(lt?'<em class="tag r">En retard</em>':'')+c.nom+'<span>'+c.pq+' Suivi : '+P.personnes[c.q].court+'.</span></p>'
     +'<p class="dts">Demandé le <b>'+dd(c.dem)+'</b><br>Attendu le <span class="'+(lt?'r':'')+'">'+dd(c.att)+'</span>'+(c.recu?'<br>Reçu le <b>'+dd(c.recu)+'</b>':'')+'</p>'
     +'<div class="em"><input class="in" type="email" id="em-'+c.id+'" data-em="'+c.id+'" value="'+esc(c.email||'')+'" placeholder="'+(S.def?esc(S.def):'Adresse e-mail du contact')+'" aria-label="Adresse e-mail du contact pour '+esc(c.nom)+'"'+(c.recu?' disabled':'')+'><p class="log">'+(c.rel.length?'Relancé le '+c.rel.map(dd).join(', ')+' ('+c.rel.length+' fois)':(c.recu?'Aucune relance nécessaire':'Jamais relancé'))+'</p></div>'
     +'<div class="ac"><button class="tg'+(c.recu?' ok':'')+'" data-tg="'+c.id+'">'+ic(c.recu?'circle-check':'hourglass')+(c.recu?'Reçu':'Non reçu')+'</button>'+(c.recu?'':'<button class="btn pri sm" data-rel="'+c.id+'">'+ic('mail')+'Relancer</button>')+'</div></div>'}).join('');
  $$('#cl [data-em]').forEach(function(i){i.oninput=function(){var c=S.client.filter(function(x){return x.id===i.dataset.em})[0];c.email=i.value.trim();i.style.borderColor=c.email&&!EMRX.test(c.email)?'#B91C1C':'';save()}});
  $$('#cl [data-tg]').forEach(function(b){b.onclick=function(){var c=S.client.filter(function(x){return x.id===b.dataset.tg})[0];setRecu(c.id,!c.recu)}});
  $$('#cl [data-rel]').forEach(function(b){b.onclick=function(){relancer(b.dataset.rel)}});
  if(act&&$('#'+act)&&act.indexOf('em-')===0)$('#'+act).focus();
}
$('#cl-def').oninput=function(){S.def=this.value.trim();save()};
$('#cl-apply').onclick=function(){if(!EMRX.test(S.def||'')){toast('Adresse e-mail incomplète.');$('#cl-def').focus();return}var n=0;S.client.forEach(function(c){if(!c.recu&&!c.email){c.email=S.def;n++}});save();toast(n+' élément'+(n>1?'s':'')+' mis à jour.');render()};
$('#kb-add').onclick=function(){$('#addf').classList.toggle('on');if($('#addf').classList.contains('on'))$('#af-t').focus()};
$('#addf').onsubmit=function(e){e.preventDefault();var t=$('#af-t').value.trim();if(!t)return;var id='N'+Date.now().toString(36);
  S.taches.push({id:id,d:$('#af-d').value||P.today,t:t,lot:'Ajout',q:$('#af-q').value,s:'afaire'});save();$('#af-t').value='';$('#addf').classList.remove('on');toast('Tâche ajoutée dans « À faire ».');render()};
$('#reset').onclick=function(e){e.preventDefault();if(!window.confirm('Remettre l\'exemple à zéro ? Vos changements dans ce navigateur seront effacés.'))return;localStorage.removeItem(KEY);S=fresh();save();render();toast('Exemple remis à zéro.')};
$$('[data-reset]').forEach(function(b){b.onclick=$('#reset').onclick});

show(location.hash.slice(1)||'apercu');
render();
})();
