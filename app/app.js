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
    pfEditT:'Mon profil', pfLName:'Nom', pfLRole:'Fonction · Société', pfLCountry:'Pays', pfLLook:'Je recherche…', pfLInterests:"Centres d'intérêt (séparés par des virgules)", pfLVisible:"Visible dans l'annuaire (networking)", pfSaveBtn:'Enregistrer mon profil', tSaved:'Profil enregistré ✓', reqTitle:'🤝 Demandes de connexion', accept:'Accepter', tAccepted:'Connexion acceptée ✓',
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
    pfEditT:'My profile', pfLName:'Name', pfLRole:'Role · Company', pfLCountry:'Country', pfLLook:'I\'m looking for…', pfLInterests:'Interests (comma-separated)', pfLVisible:'Visible in the directory (networking)', pfSaveBtn:'Save my profile', tSaved:'Profile saved ✓', reqTitle:'🤝 Connection requests', accept:'Accept', tAccepted:'Connection accepted ✓',
    connect:'＋ Connect', connected:'✓ Connected', meet:'📅 Meet', live:'● LIVE', schedule:'See program',
    bookmarks:'saved sessions', connections:'connections', tConnect:'Request sent to ', tBook:'Added to My Agenda ⭐', tUnbook:'Removed', tReset:'Demo reset ✓',
    delegates:'delegates', countries:'countries', speakers:'speakers', empty:'Nothing yet.'
  }
};
let lang = OAF.lang();
const t = k => (L[lang] && L[lang][k]) || L.en[k] || k;
const ini = n => n.replace(/Dr\.\s|Fmr\.\s/,'').split(' ').map(x=>x[0]).slice(0,2).join('');
const $ = s => document.querySelector(s);
let curView = 'events', curDay = 0, curFilter = 'all', incomingReqs = [];

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
  [['#bkEvents','bkEvents'],['#hNow','now'],['#hMeetT','meetT'],['#pgT','pgT'],['#pgS','pgS'],['#plT','plT'],['#plS','plS'],['#ntT','ntT'],['#ntS','ntS'],['#pfStatT','statT'],['#pfLang','lang'],['#pfLangS','langS'],['#pfFund','fund'],['#pfAdmin','admin'],['#pfReset','reset'],['#pfResetS','resetS'],['#pfEditT','pfEditT'],['#pfLName','pfLName'],['#pfLRole','pfLRole'],['#pfLCountry','pfLCountry'],['#pfLLook','pfLLook'],['#pfLInterests','pfLInterests'],['#pfLVisible','pfLVisible'],['#pfSaveBtn','pfSaveBtn']].forEach(([sel,k])=>{const el=$(sel);if(el)el.textContent=t(k);});
  const seg=$('#evSeg').children; seg[0].textContent=t('segAll');seg[1].textContent=t('segLive');seg[2].textContent=t('segUp');seg[3].textContent=t('segPast');
  $('#pfLangBtn').textContent = lang==='fr'?'EN':'FR';
  const me=OAF.me();
  if($('#pfName')) $('#pfName').textContent = me.name||'';
  if($('#pfAvatar')) $('#pfAvatar').textContent = ini(me.name||'· ·');
  $('#pfRole').textContent = (me.role&&me.role[lang]||'') + ' · ' + (me.country||'');
  fillProfileInputs();
  const st = OAF.stats();
  $('#pfStatS').textContent = `${st.bookmarks} ${t('bookmarks')} · ${st.connections} ${t('connections')}`;
}
function fillProfileInputs(){
  const me=OAF.me();
  const set=(id,v)=>{const el=$(id);if(el&&document.activeElement!==el)el.value=v;};
  set('#pfInName', me.name||'');
  set('#pfInRole', (me.role&&me.role[lang])||'');
  set('#pfInCountry', me.country||'');
  set('#pfInLook', (me.look&&me.look[lang])||'');
  set('#pfInInterests', (me.interests||[]).join(', '));
  const vis=$('#pfInVisible'); if(vis) vis.checked = me.visible!==false;
}
function saveProfile(){
  const name=$('#pfInName').value.trim()||'—';
  const role=$('#pfInRole').value.trim();
  const country=$('#pfInCountry').value.trim()||'🌍';
  const look=$('#pfInLook').value.trim();
  const interests=$('#pfInInterests').value.split(',').map(s=>s.trim()).filter(Boolean);
  const visible=$('#pfInVisible').checked;
  OAF.updateMe({name, role:{fr:role,en:role}, country, look:{fr:look,en:look}, interests, visible});
  if(OAFAuth&&OAFAuth.live()&&OAFAuth.client()){const sb=OAFAuth.client(),u=OAFAuth.user();
    if(u) sb.from('profiles').update({name, role:{fr:role,en:role}, country, looking_for:{fr:look,en:look}, interests, is_visible:visible}).eq('id',u.id).then(({error})=>{ if(error) toast(error.message); });}
  renderChrome(); toast(t('tSaved'));
}
function renderEvents(){
  const order={live:0,upcoming:1,past:2};
  const list = OAF.events().filter(e=>curFilter==='all'||e.status===curFilter).sort((a,b)=>order[a.status]-order[b.status]);
  const stTxt={live:lang==='fr'?'● EN COURS':'● LIVE',upcoming:lang==='fr'?'À VENIR':'UPCOMING',past:lang==='fr'?'PASSÉ':'PAST'};
  const tops={0:'linear-gradient(135deg,#1c1c1c,#000)',1:'linear-gradient(135deg,#0f6e4f,#1B998B)',2:'linear-gradient(135deg,#7a3b12,#c2691e)'};
  $('#evList').innerHTML = list.map(e=>`
    <div class="evc" onclick="enterEvent('${e.id}')">
      <div class="top" style="background:${e.cover?`#222 url(${e.cover}) center/cover`:(e.top||tops[e.id]||'#222')}"><span class="st ${e.status}">${stTxt[e.status]}</span><b>${e.name}</b></div>
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
  const live = OAF.sessions(e.id,0).find(s=>s.track[lang].toLowerCase().includes('invest')||s.title[lang].includes('Keynote'))||OAF.sessions(e.id,0)[0];
  $('#hLive').innerHTML = live?`<div class="card"><div class="row"><div class="av" style="background:#111;border-radius:12px">🎤</div><div class="m"><b>${live.title[lang]}</b><small>${live.room[lang]} · ${live.time}</small></div><span class="tag live">${t('live')}</span></div></div>`:'';
  const p = OAF.attendees()[0];
  $('#hMatch').innerHTML = p ? `<div class="card"><div class="row"><div class="av" style="background:${p.color}">${ini(p.name)}</div><div class="m"><b>${p.name}</b><small>${p.role[lang]} · ${p.country}</small></div><div class="score" style="--p:${p.score}%"><span>${p.score}</span></div></div><div style="font-size:11.5px;color:var(--muted);margin-top:9px">🎯 ${(p.why&&p.why[lang])||''}</div><button class="btn solid" style="width:100%;margin-top:11px" onclick="doConnect('${p.id}',this)">${OAF.isConnected(p.id)?t('connected'):t('connect')}</button></div>` : `<div class="card" style="color:var(--muted);font-size:13px">${lang==='fr'?'Les participants apparaîtront ici dès les premières inscriptions.':'Attendees will appear here as people sign up.'}</div>`;
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
      <button class="star ${OAF.isBookmarked(s.id)?'on':''}" onclick="bm('${s.id}',this)">${OAF.isBookmarked(s.id)?'★':'☆'}</button>
    </div>`).join('') : `<div class="empty">${t('empty')}</div>`;
}
function bm(id,btn){const on=OAF.toggleBookmark(id);btn.classList.toggle('on',on);btn.textContent=on?'★':'☆';toast(on?t('tBook'):t('tUnbook'));renderChrome();
  if(OAFAuth&&OAFAuth.live()&&OAFAuth.client()){const sb=OAFAuth.client(),me=OAFAuth.user();if(me){ if(on) sb.from('bookmarks').upsert({profile_id:me.id,session_id:id}).then(()=>{},()=>{}); else sb.from('bookmarks').delete().eq('profile_id',me.id).eq('session_id',id).then(()=>{},()=>{}); }}}
function renderRequests(){
  const box=$('#reqList'); if(!box) return;
  if(!incomingReqs.length){ box.innerHTML=''; return; }
  box.innerHTML = `<div class="sec"><b>${t('reqTitle')}</b></div>` + incomingReqs.map(r=>`
    <div class="card"><div class="row"><div class="av" style="background:#111">${ini(r.name||'?')}</div><div class="m"><b>${r.name||'—'}</b><small>${r.role||''}</small></div>
    <button class="btn solid" style="padding:8px 12px" onclick="acceptReq('${r.id}')">${t('accept')}</button></div></div>`).join('');
}
function acceptReq(id){
  if(OAFAuth&&OAFAuth.live()&&OAFAuth.client()){ OAFAuth.client().from('connections').update({status:'accepted'}).eq('id',id).then(({error})=>{ if(error){toast(error.message);return;} incomingReqs=incomingReqs.filter(r=>String(r.id)!==String(id)); renderRequests(); toast(t('tAccepted')); }); }
  else { incomingReqs=incomingReqs.filter(r=>String(r.id)!==String(id)); renderRequests(); toast(t('tAccepted')); }
}
function renderPeople(){
  renderRequests();
  $('#plList').innerHTML = OAF.attendees().map(p=>`
    <div class="card"><div class="row"><div class="av" style="background:${p.color}">${ini(p.name)}</div><div class="m"><b>${p.name}</b><small>${p.role[lang]} · ${p.country}</small></div><div class="score" style="--p:${p.score}%"><span>${p.score}</span></div></div>
    <div style="font-size:11px;color:var(--muted);margin-top:8px">🎯 ${p.why[lang]}</div>
    <button class="btn solid" style="width:100%;margin-top:10px" onclick="doConnect('${p.id}',this)">${OAF.isConnected(p.id)?t('connected'):t('connect')}</button></div>`).join('');
}
function doConnect(id,btn){OAF.addConnection(id);btn.textContent=t('connected');btn.disabled=true;btn.style.opacity=.7;const a=OAF.attendees().find(x=>String(x.id)===String(id));toast(t('tConnect')+(a?a.name.split(' ')[0]:''));renderChrome();
  if(OAFAuth&&OAFAuth.live()&&OAFAuth.client()){const sb=OAFAuth.client(),me=OAFAuth.user();if(me) sb.from('connections').upsert({requester:me.id,addressee:id,status:'pending'}).then(()=>{},()=>{});}}
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
  const refresh=async ()=>{ const u=OAFAuth.user(); gate.classList.toggle('on', !u); setAuthBadge(); if(u) await hydrate(); };
  OAFAuth.onChange(refresh); refresh();
}

/* Charge le contenu réel depuis la base (mode réel). Repli silencieux sur la démo si échec. */
async function hydrate(){
  const sb=OAFAuth.client(), me=OAFAuth.user(); if(!sb||!me) return;
  try{
    const palette=['#5b8def','#1B998B','#b5559a','#9a6b00','#E2622C','#13476b'];
    const tops=['linear-gradient(135deg,#1c1c1c,#000)','linear-gradient(135deg,#0f6e4f,#1B998B)','linear-gradient(135deg,#13476b,#2f7bb0)','linear-gradient(135deg,#7a3b12,#c2691e)','linear-gradient(135deg,#5a4a8a,#8a6fb5)'];
    const [ev,se,sp,po,no,bk,cn,prof] = await Promise.all([
      sb.from('events').select('*'),
      sb.from('sessions').select('*'),
      sb.from('speakers').select('*'),
      sb.from('sponsors').select('*'),
      sb.from('notifications').select('*').order('created_at',{ascending:false}),
      sb.from('bookmarks').select('session_id').eq('profile_id',me.id),
      sb.from('connections').select('addressee').eq('requester',me.id),
      sb.from('profiles').select('*').eq('is_visible',true)
    ]);
    if(ev.error) throw ev.error;
    const order={live:0,upcoming:1,past:2};
    const events=(ev.data||[]).map((e,i)=>({id:e.id,name:e.name,city:e.city||'',cityShort:e.city_short||(e.city||'').split(',')[0],status:e.status||'upcoming',dates:e.dates||{fr:'',en:''},theme:e.theme||{fr:'',en:''},cover:e.cover_url||null,top:tops[i%tops.length]}))
      .sort((a,b)=>(order[a.status]??9)-(order[b.status]??9));
    const sessions=(se.data||[]).map(s=>({id:s.id,ev:s.event_id,day:s.day||0,time:s.time||'',dur:s.dur||'',title:s.title||{fr:'',en:''},room:s.room||{fr:'',en:''},track:s.track||{fr:'',en:''},desc:s.description||{fr:'',en:''},color:s.color||'#5b8def',star:false,sp:[]}));
    const speakers=(sp.data||[]).map((s,i)=>({id:s.id,name:s.name,role:s.role||{fr:'',en:''},country:s.country||'🌍',color:s.color||palette[i%palette.length],bio:s.bio||{fr:'',en:''},tags:s.tags||[],ses:{fr:[],en:[]}}));
    const sponsors=(po.data||[]).map((s,i)=>({id:s.id,name:s.name,tier:s.tier||'SILVER',color:s.color||palette[i%palette.length],tc:'#fff',role:s.role||{fr:'',en:''},desc:s.description||{fr:'',en:''},booth:s.booth||{fr:'',en:''},reps:{fr:[],en:[]},logo:s.logo_url||null}));
    const attendees=(prof.data||[]).filter(p=>p.id!==me.id).map((p,i)=>({id:p.id,name:p.name||'—',role:p.role||{fr:'',en:''},country:p.country||'🌍',color:palette[i%palette.length],score:80,why:p.looking_for||{fr:'',en:''},look:p.looking_for||{fr:'',en:''},tags:p.interests||[]}));
    const notifications=(no.data||[]).map(n=>({id:n.id,icon:n.icon||'🔔',ts:new Date(n.created_at).getTime(),title:n.title||{fr:'',en:''}}));
    const profById={}; (prof.data||[]).forEach(p=>profById[p.id]=p);
    const myProf=profById[me.id] || {};
    // demandes de connexion reçues (en attente)
    try{
      const inc=await sb.from('connections').select('id,requester,status').eq('addressee',me.id).eq('status','pending');
      incomingReqs=(inc.data||[]).map(c=>({id:c.id,name:(profById[c.requester]||{}).name||'—',role:(((profById[c.requester]||{}).role)||{})[lang]||''}));
    }catch(e){ incomingReqs=[]; }
    OAF.loadServer({
      events: events.length?events:undefined,
      sessions, speakers, sponsors, attendees, notifications,
      bookmarks:(bk.data||[]).map(b=>String(b.session_id)),
      connections:(cn.data||[]).map(c=>String(c.addressee)),
      currentEvent: events.length?events[0].id:undefined,
      me: { name: myProf.name||me.email, role: myProf.role||{fr:'Participant',en:'Attendee'}, country: myProf.country||'🌍', look: myProf.looking_for||{fr:'',en:''}, interests: myProf.interests||[], visible: myProf.is_visible!==false }
    });
    renderAll();
  }catch(e){ console.warn('Hydratation Supabase échouée — données démo conservées', e); }
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
