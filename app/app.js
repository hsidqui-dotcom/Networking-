/* OAF Connect — attendee PWA logic (reads/writes the shared OAF store) */
const L = {
  fr: {
    'tab.home':'Accueil','tab.program':'Programme','tab.people':'Personnes','tab.notif':'Notifs','tab.profile':'Profil',
    welcome:'Bienvenue chez OneAfricaForums 🌍', welcomeSub:'Une seule maison pour chaque forum du continent.',
    segAll:'Tous', segLive:'En cours', segUp:'À venir', segPast:'Passés',
    bkEvents:'‹ Tous les événements', now:'🔴 En direct', meetT:'✨ À rencontrer',
    pgT:'Programme', pgS:'Touchez ☆ pour ajouter à votre agenda.',
    plT:'Participants', plS:'Classés par correspondance IA.',
    ntT:'Notifications', ntS:'Rappels, correspondances & infos.',
    statT:'Mon activité', lang:'🌐 Langue', langS:'Français · EN · PT · AR', fund:'Levée de fonds',
    admin:'Espace organisateur (démo)', reset:'Réinitialiser la démo', resetS:"Restaurer les données d'exemple",
    tiProgram:'Programme', tiPeople:'Participants', tiSpeakers:'Intervenants', tiPartners:'Partenaires', tiNotif:'Notifications', tiInfo:'Infos',
    prtT:'Partenaires', prtS:'Nos partenaires & sponsors.', bkPart:'‹ Accueil',
    connect:'＋ Se connecter', connected:'✓ Connecté', meet:'📅 RDV', live:'● LIVE', schedule:'Voir le programme',
    bookmarks:'sessions enregistrées', connections:'connexions', tConnect:'Demande envoyée à ', tBook:'Ajouté à mon agenda ⭐', tUnbook:'Retiré', tReset:'Démo réinitialisée ✓',
    delegates:'délégués', countries:'pays', speakers:'intervenants', empty:'Rien pour le moment.'
  },
  en: {
    'tab.home':'Home','tab.program':'Program','tab.people':'People','tab.notif':'Alerts','tab.profile':'Profile',
    welcome:'Welcome to OneAfricaForums 🌍', welcomeSub:'One home for every forum across the continent.',
    segAll:'All', segLive:'Live', segUp:'Upcoming', segPast:'Past',
    bkEvents:'‹ All events', now:'🔴 Happening now', meetT:'✨ To meet',
    pgT:'Program', pgS:'Tap ☆ to add to your agenda.',
    plT:'Attendees', plS:'Ranked by AI match.',
    ntT:'Notifications', ntS:'Reminders, matches & updates.',
    statT:'My activity', lang:'🌐 Language', langS:'English · FR · PT · AR', fund:'Fundraising',
    admin:'Organizer space (demo)', reset:'Reset the demo', resetS:'Restore sample data',
    tiProgram:'Program', tiPeople:'Attendees', tiSpeakers:'Speakers', tiPartners:'Partners', tiNotif:'Notifications', tiInfo:'Info',
    prtT:'Partners', prtS:'Our partners & sponsors.', bkPart:'‹ Home',
    connect:'＋ Connect', connected:'✓ Connected', meet:'📅 Meet', live:'● LIVE', schedule:'See program',
    bookmarks:'saved sessions', connections:'connections', tConnect:'Request sent to ', tBook:'Added to My Agenda ⭐', tUnbook:'Removed', tReset:'Demo reset ✓',
    delegates:'delegates', countries:'countries', speakers:'speakers', empty:'Nothing yet.'
  }
};
let lang = OAF.lang();
const t = k => (L[lang] && L[lang][k]) || L.en[k] || k;
const ini = n => n.replace(/Dr\.\s|Fmr\.\s/,'').split(' ').map(x=>x[0]).slice(0,2).join('');
const $ = s => document.querySelector(s);
let curView = 'events', curDay = 0, curFilter = 'all';

function show(v){
  curView = v;
  document.querySelectorAll('.view').forEach(s => s.classList.toggle('on', s.dataset.v === v));
  const tabFor = { home:'home', program:'program', people:'people', notif:'notif', profile:'profile', events:'home', partners:'home' };
  document.querySelectorAll('.tabbar button').forEach(b => b.classList.toggle('on', b.dataset.t === tabFor[v]));
  $('#scroll').scrollTop = 0;
  if (v === 'program') renderAgenda();
  if (v === 'people') renderPeople();
  if (v === 'partners') renderPartners();
  if (v === 'notif') renderNotif();
}
function renderPartners(){
  $('#prtT').textContent=t('prtT'); $('#prtS').textContent=t('prtS'); $('#bkPart').textContent=t('bkPart');
  $('#prtList').innerHTML = OAF.sponsors().map(s=>`
    <div class="card"><div class="row">
      <div class="av" style="width:50px;height:50px;border-radius:13px;overflow:hidden;background:${s.logo?'#fff':s.color};color:${s.tc}">${s.logo?`<img src="${s.logo}" style="width:100%;height:100%;object-fit:cover">`:ini(s.name)}</div>
      <div class="m"><b>${s.name}</b><small>${s.tier}</small></div>
      <span class="tag ${s.tier==='PLATINUM'?'p':s.tier==='GOLD'?'gold':''}">${s.tier}</span></div></div>`).join('');
}

function toast(m){const el=$('#toast');el.textContent=m;el.classList.add('on');clearTimeout(toast._t);toast._t=setTimeout(()=>el.classList.remove('on'),2200);}

/* ---- renders ---- */
const DEFAULT_LOGO='<svg class="oa" viewBox="0 0 400 400"><rect width="400" height="400" rx="72" fill="#FFE400"/><text x="200" y="237" text-anchor="middle" fill="#111" font-family="\'Arial Black\',Arial,sans-serif" font-weight="900" font-size="188">one</text><text x="203" y="306" text-anchor="middle" fill="#111" font-family="Arial,sans-serif" font-weight="700" font-size="55" letter-spacing="11">AFRICA</text></svg>';
function paintLogo(){ const d=OAF.appLogo(); const el=$('#abLogo'); if(el) el.innerHTML = d?`<img src="${d}" style="width:100%;height:100%;object-fit:cover">`:DEFAULT_LOGO; }
function renderChrome(){
  document.documentElement.lang = lang;
  paintLogo();
  $('#lFr').classList.toggle('on', lang==='fr'); $('#lEn').classList.toggle('on', lang==='en');
  document.querySelectorAll('[data-l]').forEach(e => e.textContent = t(e.dataset.l));
  $('#evWelcome').textContent=t('welcome'); $('#evWelcomeSub').textContent=t('welcomeSub');
  [['#bkEvents','bkEvents'],['#hNow','now'],['#hMeetT','meetT'],['#pgT','pgT'],['#pgS','pgS'],['#plT','plT'],['#plS','plS'],['#ntT','ntT'],['#ntS','ntS'],['#pfStatT','statT'],['#pfLang','lang'],['#pfLangS','langS'],['#pfFund','fund'],['#pfAdmin','admin'],['#pfReset','reset'],['#pfResetS','resetS']].forEach(([sel,k])=>{const el=$(sel);if(el)el.textContent=t(k);});
  const seg=$('#evSeg').children; seg[0].textContent=t('segAll');seg[1].textContent=t('segLive');seg[2].textContent=t('segUp');seg[3].textContent=t('segPast');
  $('#pfLangBtn').textContent = lang==='fr'?'EN':'FR';
  $('#pfRole').textContent = OAF.me().role[lang] + ' · ' + OAF.me().country;
  const st = OAF.stats();
  $('#pfStatS').textContent = `${st.bookmarks} ${t('bookmarks')} · ${st.connections} ${t('connections')}`;
}
function renderEvents(){
  const order={live:0,upcoming:1,past:2};
  const list = OAF.events().filter(e=>curFilter==='all'||e.status===curFilter).sort((a,b)=>order[a.status]-order[b.status]);
  const stTxt={live:lang==='fr'?'● EN COURS':'● LIVE',upcoming:lang==='fr'?'À VENIR':'UPCOMING',past:lang==='fr'?'PASSÉ':'PAST'};
  const tops={0:'linear-gradient(135deg,#1c1c1c,#000)',1:'linear-gradient(135deg,#0f6e4f,#1B998B)',2:'linear-gradient(135deg,#7a3b12,#c2691e)'};
  $('#evList').innerHTML = list.map(e=>`
    <div class="evc" onclick="enterEvent(${e.id})">
      <div class="top" style="background:${e.cover?`#222 url(${e.cover}) center/cover`:(tops[e.id]||'#222')}"><span class="st ${e.status}">${stTxt[e.status]}</span><b>${e.name}</b></div>
      <div class="bd"><div class="r1">📍 ${e.city} · 🗓️ ${e.dates[lang]}</div><div class="th">${e.theme[lang]}</div></div>
    </div>`).join('');
}
function enterEvent(id){
  OAF.setCurrentEvent(id); const e=OAF.currentEvent();
  $('#abTitle').textContent=e.name; $('#abSub').textContent=e.cityShort;
  $('#hKicker').textContent='📍 '+e.cityShort.toUpperCase()+' · '+e.dates[lang].toUpperCase();
  $('#hTheme').textContent=e.theme[lang]; $('#hCity').textContent=e.city;
  $('#hTiles').innerHTML = [
    ['🗓️','tiProgram','program'],['🎤','tiSpeakers','people'],['🤝','tiPeople','people'],['⭐','tiPartners','partners'],['🔔','tiNotif','notif'],['ℹ️','tiInfo','home']
  ].map(([ic,k,v])=>`<div class="tile" onclick="show('${v}')"><div class="ic">${ic}</div><b>${t(k)}</b></div>`).join('');
  // live + matches
  const live = OAF.sessions(id,0).find(s=>s.track[lang].toLowerCase().includes('invest')||s.title[lang].includes('Keynote'))||OAF.sessions(id,0)[0];
  $('#hLive').innerHTML = live?`<div class="card"><div class="row"><div class="av" style="background:#111;border-radius:12px">🎤</div><div class="m"><b>${live.title[lang]}</b><small>${live.room[lang]} · ${live.time}</small></div><span class="tag live">${t('live')}</span></div></div>`:'';
  const p = OAF.attendees()[0];
  $('#hMatch').innerHTML = `<div class="card"><div class="row"><div class="av" style="background:${p.color}">${ini(p.name)}</div><div class="m"><b>${p.name}</b><small>${p.role[lang]} · ${p.country}</small></div><div class="score" style="--p:${p.score}%"><span>${p.score}</span></div></div><div style="font-size:11.5px;color:var(--muted);margin-top:9px">🎯 ${p.why[lang]}</div><button class="btn solid" style="width:100%;margin-top:11px" onclick="doConnect(${p.id},this)">${OAF.isConnected(p.id)?t('connected'):t('connect')}</button></div>`;
  show('home');
}
function renderDayTabs(){
  $('#dayTabs').innerHTML = OAF.days().map((d,i)=>`<button class="${i===curDay?'on':''}" onclick="setDay(${i})">${d[lang]}</button>`).join('');
}
function setDay(i){curDay=i;renderDayTabs();renderAgenda();}
function renderAgenda(){
  renderDayTabs();
  const list = OAF.sessions(OAF.currentEvent().id, curDay);
  $('#agenda').innerHTML = list.length ? list.map(s=>`
    <div class="ses">
      <div class="t">${s.time}<small>${s.dur}</small></div>
      <div class="b"><b>${s.title[lang]}</b><small>${s.room[lang]}</small><br><span class="trk" style="background:${s.color}1f;color:${s.color}">${s.track[lang]}</span></div>
      <button class="star ${OAF.isBookmarked(s.id)?'on':''}" onclick="bm(${s.id},this)">${OAF.isBookmarked(s.id)?'★':'☆'}</button>
    </div>`).join('') : `<div class="empty">${t('empty')}</div>`;
}
function bm(id,btn){const on=OAF.toggleBookmark(id);btn.classList.toggle('on',on);btn.textContent=on?'★':'☆';toast(on?t('tBook'):t('tUnbook'));renderChrome();}
function renderPeople(){
  $('#plList').innerHTML = OAF.attendees().map(p=>`
    <div class="card"><div class="row"><div class="av" style="background:${p.color}">${ini(p.name)}</div><div class="m"><b>${p.name}</b><small>${p.role[lang]} · ${p.country}</small></div><div class="score" style="--p:${p.score}%"><span>${p.score}</span></div></div>
    <div style="font-size:11px;color:var(--muted);margin-top:8px">🎯 ${p.why[lang]}</div>
    <button class="btn solid" style="width:100%;margin-top:10px" onclick="doConnect(${p.id},this)">${OAF.isConnected(p.id)?t('connected'):t('connect')}</button></div>`).join('');
}
function doConnect(id,btn){OAF.addConnection(id);btn.textContent=t('connected');btn.disabled=true;btn.style.opacity=.7;const a=OAF.attendees().find(x=>x.id===id);toast(t('tConnect')+(a?a.name.split(' ')[0]:''));renderChrome();}
function renderNotif(){
  const list = OAF.notifications();
  $('#ntList').innerHTML = list.length ? list.map(n=>`<div class="notif"><div class="ni">${n.icon||'🔔'}</div><div><b>${n.title[lang]||n.title.en||n.title}</b><small>${timeAgo(n.ts)}</small></div></div>`).join('') : `<div class="empty">${t('empty')}</div>`;
}
function timeAgo(ts){const m=Math.round((Date.now()-ts)/60000);if(m<1)return lang==='fr'?'à l’instant':'just now';if(m<60)return (lang==='fr'?'il y a ':'')+m+' min'+(lang==='fr'?'':' ago');const h=Math.round(m/60);return (lang==='fr'?'il y a ':'')+h+' h'+(lang==='fr'?'':' ago');}

function toggleLang(){lang=lang==='fr'?'en':'fr';OAF.setLang(lang);renderAll();}
function resetDemo(){OAF.reset();lang=OAF.lang();renderAll();show('events');toast(t('tReset'));}
function renderAll(){renderChrome();renderEvents();renderAgenda();renderPeople();renderNotif();
  // refresh event-scoped header if inside an event
  if(curView!=='events'){const e=OAF.currentEvent();$('#abTitle').textContent=e.name;$('#abSub').textContent=e.cityShort;$('#hTheme').textContent=e.theme[lang];$('#hCity').textContent=e.city;}
}

/* live refresh when admin (other tab) changes the store */
window.addEventListener('storage', e=>{ if(e.key===OAF.KEY){ location.reload(); } });
window.addEventListener('oaf-change', ()=>{ /* same-page change already handled by callers */ });

/* ---- authentication (real mode only; demo mode unaffected) ---- */
function setAuthBadge(){
  const b=$('#authBadge'),so=$('#signOutBtn');
  if(!OAFAuth || !OAFAuth.live()){ b.textContent='démo'; b.className='modepill'; so.style.display='none'; return; }
  const u=OAFAuth.user();
  if(u){ b.textContent='● '+(u.email||'connecté'); b.className='modepill live'; so.style.display='inline-flex'; }
  else { b.textContent=lang==='fr'?'non connecté':'signed out'; b.className='modepill'; so.style.display='none'; }
}
async function bootstrapAuth(){
  if(!OAFAuth || !OAFAuth.live()){ setAuthBadge(); return; }
  await OAFAuth.ready();
  const gate=$('#authGate');
  const refresh=()=>{ gate.classList.toggle('on', !OAFAuth.user()); setAuthBadge(); };
  OAFAuth.onChange(refresh); refresh();
}
function authSend(){
  const email=$('#authEmail').value.trim(); if(!email)return;
  $('#authMsg').textContent='…';
  OAFAuth.sendCode(email).then(({error})=>{
    if(error){ $('#authMsg').textContent=error.message; return; }
    $('#authStep2').style.display='block';
    $('#authMsg').textContent = lang==='fr'?'Code envoyé ✉️ — vérifiez vos e-mails.':'Code sent ✉️ — check your email.';
  });
}
function authVerify(){
  const email=$('#authEmail').value.trim(), code=$('#authCode').value.trim();
  if(!code)return; $('#authMsg').textContent='…';
  OAFAuth.verify(email,code).then(({error})=>{ if(error) $('#authMsg').textContent=error.message; });
}
function authSignOut(){ if(OAFAuth&&OAFAuth.signOut) OAFAuth.signOut(); }

renderAll();
show('events');
bootstrapAuth();
