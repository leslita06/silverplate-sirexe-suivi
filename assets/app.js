(function(){
var P=window.P, $=function(s){return document.querySelector(s)};
function ic(n){return '<i class="ic" style="-webkit-mask-image:url(assets/icons/'+n+'.svg);mask-image:url(assets/icons/'+n+'.svg)"></i>'}
function hydrate(){Array.prototype.forEach.call(document.querySelectorAll('[data-ic]'),function(e){var u='url(assets/icons/'+e.dataset.ic+'.svg)';e.style.webkitMaskImage=u;e.style.maskImage=u})}
function fm(n){return Math.round(n).toLocaleString('fr-FR').replace(/\u202f|\u00a0/g,' ')}
function pc1(x){return (Math.round(x*1000)/10).toLocaleString('fr-FR')}
function mf(n){return (n/1e6).toLocaleString('fr-FR',{minimumFractionDigits:1,maximumFractionDigits:1})}
function D(s){var a=s.split('-');return new Date(+a[0],+a[1]-1,+a[2])}
var JOURS=['dim.','lun.','mar.','mer.','jeu.','ven.','sam.'],MOIS=['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];
function dd(s){var d=D(s);return ('0'+d.getDate()).slice(-2)+'/'+('0'+(d.getMonth()+1)).slice(-2)}
function dlong(s){var d=D(s);return JOURS[d.getDay()]+' '+d.getDate()+' '+MOIS[d.getMonth()]}
var T=D(P.today), J=D(P.jourJ);
function jr(s){var n=Math.round((D(s)-J)/864e5);return n===0?'Jour J':(n<0?'J'+n:'J+'+n)}
function inDays(s){return Math.round((D(s)-T)/864e5)}
var LBL={ok:'Dans les temps',vigilance:'À surveiller',retard:'En retard',surcout:'Surcoût',fait:'Fait',cours:'En cours',avenir:'À venir'};
function pill(s){return '<span class="pill '+s+'">'+LBL[s]+'</span>'}
function who(k,full){var p=P.personnes[k];return '<span class="who"><span class="av" style="background:'+p.c+'">'+p.ini+'</span>'+(full?p.nom:p.court)+'</span>'}
var tot={devis:0,budget:0,engage:0},avp=0;
P.lots.forEach(function(l){tot.devis+=l.devis;tot.budget+=l.budget;tot.engage+=l.engage;avp+=l.av*l.budget});
var AV=Math.round(avp/tot.budget), JM=Math.round((J-T)/864e5);
var retards=P.taches.filter(function(t){return t.s==='retard'});
var aFaire7=P.taches.filter(function(t){var n=inDays(t.d);return t.s!=='fait'&&n>=0&&n<=7});
var arr=$('#arrete'); if(arr) arr.textContent='Situation au '+dlong(P.today)+' 2026, J-'+JM;

/* ---------- tableau de bord ---------- */
if(document.body.dataset.page==='tdb'){
  var marge=tot.devis-tot.budget;
  var surc=P.lots.reduce(function(a,l){return a+Math.max(0,l.engage-l.budget)},0);
  $('#phrase').innerHTML='Le stand de 36 m² ouvre le <b>mercredi 18 novembre</b>, dans <b>'+JM+' jours</b>. Le travail est fait à <b>'+AV+' %</b>. '
   +'<b>'+mf(tot.engage)+' M FCFA</b> de commandes sont signées sur '+mf(tot.budget)+' M FCFA prévus. '
   +'<b>'+retards.length+' échéances</b> sont en retard, et un surcoût de '+fm(surc)+' FCFA attend une décision.';
  $('#kpis').innerHTML=[
   ['calendar-clock','Avant l\'ouverture','J-'+JM,'','Montage du 15 au 17 nov., salon du 18 au 22 nov.'],
   ['circle-check','Avancement du stand',AV,'%','Moyenne des 7 lots, pondérée par leur coût',AV],
   ['file-text','Commandes signées',mf(tot.engage),'M FCFA HT',Math.round(tot.engage/tot.budget*100)+' % du coût prévu ('+mf(tot.budget)+' M FCFA HT)',Math.round(tot.engage/tot.budget*100)],
   ['wallet','Devis du stand',mf(tot.devis),'M FCFA HT',fm(P.devisTTC)+' FCFA TTC, acompte de 50 % reçu le 19/10']
  ].map(function(k){return '<div class="kpi"><div class="h"><span class="bx">'+ic(k[0])+'</span><span class="l">'+k[1]+'</span></div><p class="v">'+k[2]+'<small>'+k[3]+'</small></p>'+(k[5]!=null?'<div class="bar"><i style="width:'+k[5]+'%"></i></div>':'')+'<p class="d">'+k[4]+'</p></div>'}).join('');
  var al=[];
  P.lots.forEach(function(l){
    if(l.etat==='retard') al.push(['','triangle-alert','<b>'+l.alerte+'</b><span>'+l.note+'. Suivi : '+P.personnes[l.qui].court+'.</span>']);
  });
  al.push(['warn','hourglass','<b>Moquette : '+fm(surc)+' FCFA HT de plus que prévu.</b><span>Accepter, ou revenir à la moquette standard. Décision : Jamal, le 06/11.</span>']);
  al.push(['warn','users','<b>Une hôtesse sur deux retenue.</b><span>Les noms partent à l\'organisateur le 09/11 pour les badges.</span>']);
  $('#alerts').innerHTML=al.map(function(a){return '<div class="al '+a[0]+'"><span class="bx">'+ic(a[1])+'</span><p>'+a[2]+'</p></div>'}).join('');
  $('#lots').innerHTML=P.lots.map(function(l){
    return '<div class="lot"><p class="n">'+l.nom+'<span>'+fm(l.devis)+' FCFA HT au devis</span></p>'
     +'<p class="e"><b>'+l.etape+'.</b><br>Ensuite : '+l.prochaine+'.</p>'
     +'<div class="prog"><div class="bar"><i style="width:'+l.av+'%"></i></div><em>'+l.av+' %</em></div>'
     +'<div class="st">'+pill(l.etat)+' '+who(l.qui)+'</div></div>'}).join('');
  var mx=Math.max.apply(null,P.lots.map(function(l){return l.devis}));
  $('#budget').innerHTML=P.lots.map(function(l){
    var over=l.engage>l.budget;
    return '<div class="row"><span class="t">'+l.nom+'</span><div class="track"><span class="b" style="width:'+(l.budget/mx*100)+'%"></span><span class="g'+(over?' over':'')+'" style="width:'+(l.engage/mx*100)+'%"></span><span class="tk" style="left:'+(l.devis/mx*100)+'%"></span></div><span class="m">'+mf(l.engage)+' / '+mf(l.budget)+'</span></div>'}).join('')
   +'<div class="legend"><span><i style="background:#262C51"></i>Signé</span><span><i style="background:#C9D1EA"></i>Coût prévu</span><span><i style="background:#141830;width:3px"></i>Prix au devis</span><span><i style="background:#B91C1C"></i>Signé au-delà du prévu</span></div>';
  $('#t-bud').innerHTML='<thead><tr><th>Lot</th><th style="text-align:right">Devis HT</th><th style="text-align:right">Coût prévu</th><th style="text-align:right">Signé</th><th style="text-align:right">Reste à signer</th></tr></thead><tbody>'
   +P.lots.map(function(l){return '<tr><td>'+l.nom+'</td><td class="n">'+fm(l.devis)+'</td><td class="n">'+fm(l.budget)+'</td><td class="n"'+(l.engage>l.budget?' style="color:#B91C1C;font-weight:700"':'')+'>'+fm(l.engage)+'</td><td class="n">'+fm(Math.max(0,l.budget-l.engage))+'</td></tr>'}).join('')
   +'<tr class="tot"><td>Total</td><td class="n">'+fm(tot.devis)+'</td><td class="n">'+fm(tot.budget)+'</td><td class="n">'+fm(tot.engage)+'</td><td class="n">'+fm(P.lots.reduce(function(a,l){return a+Math.max(0,l.budget-l.engage)},0))+'</td></tr></tbody>';
  var margeAuj=tot.devis-(tot.budget+surc);
  $('#money').innerHTML=[
   ['Marge prévue au devis',fm(marge)+' FCFA',Math.round(marge/tot.devis*100)+' % du prix HT'],
   ['Marge si le surcoût est accepté',fm(margeAuj)+' FCFA',pc1(margeAuj/tot.devis)+' % du prix HT'],
   ['Encaissé sur le devis',fm(P.acompte)+' FCFA TTC','Solde de '+fm(P.solde)+' FCFA TTC le 25/11']
  ].map(function(m){return '<div class="mi"><p class="l">'+m[0]+'</p><p class="v">'+m[1]+'</p><p class="l" style="margin-top:4px">'+m[2]+'</p></div>'}).join('');
  /* échéances */
  var start=D('2026-11-02'),days=[];for(var i=0;i<26;i++){var d=new Date(start);d.setDate(d.getDate()+i);days.push(d)}
  $('#scale').style.setProperty('--days',days.length);
  $('#scale').innerHTML=days.map(function(d){var c=+d===+T?'today':(+d===+J?'jj':(d.getDay()===1?'wk':''));
    var n=P.taches.filter(function(t){return t.s!=='fait'&&+D(t.d)===+d}).length, r=P.taches.filter(function(t){return t.s==='retard'&&+D(t.d)===+d}).length;
    var dots='';for(var k=0;k<n;k++)dots+='<i class="'+(k<r?'r':'')+'"></i>';
    return '<div class="dy"><span class="'+c+'">'+d.getDate()+'</span><b>'+dots+'</b></div>'}).join('');
  var up=P.taches.filter(function(t){return t.s!=='fait'&&D(t.d)<=D('2026-11-18')});
  $('#ech').innerHTML=up.map(function(t){var n=inDays(t.d);var w=n<0?'il y a '+(-n)+' j':(n===0?'aujourd\'hui':'dans '+n+' j');
    return '<div class="ech"><p class="dt">'+dd(t.d)+(t.f?' au '+dd(t.f):'')+'<span>'+jr(t.d)+', '+w+'</span></p><p class="tx">'+t.t+'<span>'+t.lot+'</span></p>'+who(t.q)+pill(t.s)+'</div>'}).join('');
}

/* ---------- qui fait quoi ---------- */
if(document.body.dataset.page==='tracker'){
  var cur='all',st='all';
  function cnt(k){var a=P.taches.filter(function(t){return k==='all'||t.q===k});return {n:a.length,f:a.filter(function(t){return t.s==='fait'}).length,r:a.filter(function(t){return t.s==='retard'}).length,o:a.filter(function(t){return t.s!=='fait'}).length}}
  function people(){
    var c=cnt('all');
    var h='<button class="pc'+(cur==='all'?' on':'')+'" data-k="all"><div class="top"><span class="av" style="background:#A0A6B8">3</span><p class="nm">Toute l\'équipe</p></div><p class="rl">'+c.n+' tâches du devis signé au bilan</p><div class="ct"><span class="pill fait">'+c.f+' faites</span>'+(c.r?'<span class="pill retard">'+c.r+' en retard</span>':'')+'</div></button>';
    ['J','A','R'].forEach(function(k){var p=P.personnes[k],c=cnt(k);
      h+='<button class="pc'+(cur===k?' on':'')+'" data-k="'+k+'"><div class="top"><span class="av" style="background:'+p.c+'">'+p.ini+'</span><p class="nm">'+p.nom+'</p></div><p class="rl">'+p.role+'</p><div class="ct"><span class="pill avenir">'+c.o+' à faire</span>'+(c.r?'<span class="pill retard">'+c.r+' en retard</span>':'<span class="pill fait">aucun retard</span>')+'</div></button>'});
    $('#people').innerHTML=h;
    Array.prototype.forEach.call(document.querySelectorAll('.pc'),function(b){b.onclick=function(){cur=b.dataset.k;render()}});
  }
  function render(){
    people();
    Array.prototype.forEach.call(document.querySelectorAll('.chipb[data-s]'),function(b){b.classList.toggle('on',b.dataset.s===st)});
    var sel=$('#f-p'); if(sel) sel.value=cur;
    var rows=P.taches.filter(function(t){return (cur==='all'||t.q===cur)&&(st==='all'||(st==='open'?t.s!=='fait':t.s===st))});
    var ord={retard:0,cours:1,avenir:2,fait:3};
    rows.sort(function(a,b){return st==='all'?(D(a.d)-D(b.d)):(ord[a.s]-ord[b.s]||D(a.d)-D(b.d))});
    $('#count').textContent=rows.length+' tâche'+(rows.length>1?'s':'')+(cur==='all'?'':' pour '+P.personnes[cur].court);
    $('#t-tasks').innerHTML='<thead><tr><th>Échéance</th><th>Tâche</th><th>Lot</th><th>Responsable</th><th>Statut</th></tr></thead><tbody>'+rows.map(function(t){
      return '<tr class="'+t.s+'"><td><b>'+dd(t.d)+(t.f?' au '+dd(t.f):'')+'</b><br><span style="color:#6B7189;font-size:12.5px">'+jr(t.d)+'</span></td><td>'+t.t+'</td><td style="color:#4A5068">'+t.lot+'</td><td>'+who(t.q)+'</td><td>'+pill(t.s)+'</td></tr>'}).join('')+'</tbody>';
    $('#mcards').innerHTML=rows.map(function(t){return '<div class="mc '+t.s+'"><p class="t1">'+t.t+'</p><div class="t2"><b style="color:#262C51">'+dd(t.d)+(t.f?' au '+dd(t.f):'')+'</b><span>'+jr(t.d)+'</span>'+who(t.q)+pill(t.s)+'</div></div>'}).join('');
  }
  Array.prototype.forEach.call(document.querySelectorAll('.chipb[data-s]'),function(b){b.onclick=function(){st=b.dataset.s;render()}});
  var q=(location.hash||'').replace('#','');var m={jamal:'J',alice:'A',arnaud:'R'};if(m[q])cur=m[q];
  render();
}

/* ---------- revue ---------- */
if(document.body.dataset.page==='revue'){
  var faits=P.taches.filter(function(t){var n=inDays(t.d);return t.s==='fait'&&n>=-7});
  $('#rv-kpi').innerHTML=[
    ['J-'+JM,'avant l\'ouverture'],[AV+' %','du stand fait, pondéré par le coût des lots'],[mf(tot.engage)+' M','FCFA HT signés sur '+mf(tot.budget)+' M prévus'],[retards.length+' retards','à lever avant lundi 9']
  ].map(function(k){return '<div class="mi"><p class="v">'+k[0]+'</p><p class="l" style="margin-top:4px">'+k[1]+'</p></div>'}).join('');
  $('#rv-avance').innerHTML=faits.map(function(t){return '<li><p>'+t.t+'<span class="s">'+dd(t.d)+', '+t.lot+'</span></p>'+who(t.q)+'</li>'}).join('');
  var bloc=[['Épreuves d\'impression non signées par l\'exposant','Attendues le 04/11. Sans elles, pas de commande ferme ni de livraison le 12/11.','A'],
            ['Pas d\'accusé de l\'organisateur sur l\'électricité','Commande envoyée le 30/10, relance le 05/11. Le raccordement du 16/11 en dépend.','R'],
            ['Moquette aux couleurs de l\'exposant : +90 000 FCFA HT','Commande passée, surcoût non prévu au devis.','J']];
  $('#rv-bloque').innerHTML=bloc.map(function(b){return '<li><p>'+b[0]+'<span class="s">'+b[1]+'</span></p>'+who(b[2])+'</li>'}).join('');
  $('#rv-dec').innerHTML='<thead><tr><th>Décision à prendre</th><th>Options</th><th>Qui tranche</th><th>Pour le</th></tr></thead><tbody>'+[
    ['Surcoût de la moquette','Accepter (marge ramenée à '+pc1((tot.devis-tot.budget-90000)/tot.devis)+' %), le refacturer à l\'exposant, ou revenir au standard','J','ven. 6/11'],
    ['Épreuves non signées','Appel de Jamal à l\'exposant, ou livraison décalée au 13/11 avec pose le 16/11','J','lun. 9/11'],
    ['Seconde hôtesse','Retenir l\'un des 2 profils reçus','A','ven. 6/11'],
    ['Électricité sans accusé','Passer au guichet de l\'organisateur le 09/11, ou louer un groupe d\'appoint','R','lun. 9/11']
  ].map(function(d){return '<tr><td><b>'+d[0]+'</b></td><td>'+d[1]+'</td><td class="q">'+who(d[2],true)+'</td><td class="q">'+d[3]+'</td></tr>'}).join('')+'</tbody>';
  var nx=P.taches.filter(function(t){var n=inDays(t.d);return t.s!=='fait'&&n>0&&n<=8});
  $('#rv-next').innerHTML=nx.map(function(t){return '<li><p>'+t.t+'<span class="s">'+dlong(t.d)+(t.f?' au '+dlong(t.f):'')+', '+jr(t.d)+'</span></p>'+who(t.q)+'</li>'}).join('');
  var pr=$('#print'); if(pr) pr.onclick=function(){window.print()};
}
hydrate();
})();
