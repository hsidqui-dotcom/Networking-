/* OAF Connect — attendee PWA logic (reads/writes the shared OAF store) */
const L = {
  fr: {
    'tab.home':'Accueil','tab.program':'Programme','tab.people':'Personnes','tab.notif':'Notifs','tab.chat':'Chat','tab.profile':'Profil',
    chT:'Messagerie', chS:'Vos conversations.', bkChat:'‹ Messagerie', chEmpty:"Aucune conversation. Écrivez à quelqu'un depuis l'onglet Participants (bouton 💬).", msg:'Message', newMsg:'💬 Nouveau message',
    meT:'Rendez-vous', meS:'Proposez et gérez vos rendez-vous 1:1.', tiMeet:'Rendez-vous', meReqT:'📥 Demandes de RDV reçues', meListT:'Mes rendez-vous', meProposeT:'Proposer un RDV à', meSlot:'Choisissez un créneau :', accept:'Accepter', decline:'Refuser', meEmpty:'Aucun rendez-vous pour l’instant.', stPending:'En attente', stConfirmed:'Confirmé', stDeclined:'Refusé', tMeetSent:'Demande de RDV envoyée 📅', tMeetOk:'Rendez-vous confirmé ✓', tMeetNo:'Rendez-vous refusé',
    welcome:'Bienvenue chez OneAfricaForums 🌍', welcomeSub:'Une seule maison pour chaque forum du continent.',
    segAll:'Tous', segLive:'En cours', segUp:'À venir', segPast:'Passés',
    bkEvents:'‹ Tous les événements', now:'🔴 En direct', meetT:'✨ À rencontrer',
    pgT:'Programme', pgS:'Touchez une séance pour le détail et les intervenants.',
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
    'tab.home':'Home','tab.program':'Program','tab.people':'People','tab.notif':'Alerts','tab.chat':'Chat','tab.profile':'Profile',
    chT:'Messages', chS:'Your conversations.', bkChat:'‹ Messages', chEmpty:'No conversations yet. Message someone from the Attendees tab (💬 button).', msg:'Message', newMsg:'💬 New message',
    meT:'Meetings', meS:'Propose and manage your 1:1 meetings.', tiMeet:'Meetings', meReqT:'📥 Incoming meeting requests', meListT:'My meetings', meProposeT:'Propose a meeting to', meSlot:'Pick a slot:', accept:'Accept', decline:'Decline', meEmpty:'No meetings yet.', stPending:'Pending', stConfirmed:'Confirmed', stDeclined:'Declined', tMeetSent:'Meeting request sent 📅', tMeetOk:'Meeting confirmed ✓', tMeetNo:'Meeting declined',
    welcome:'Welcome to OneAfricaForums 🌍', welcomeSub:'One home for every forum across the continent.',
    segAll:'All', segLive:'Live', segUp:'Upcoming', segPast:'Past',
    bkEvents:'‹ All events', now:'🔴 Happening now', meetT:'✨ To meet',
    pgT:'Program', pgS:'Tap a session for details & speakers.',
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
let curView = 'events', curDay = 0, curFilter = 'all', incomingReqs = [], chatWith = null, chatSubscribed = false;
let curSession = null, curSpeaker = null, qaChannel = null, qaList = [];

function show(v){
  curView = v;
  document.querySelectorAll('.view').forEach(s => s.classList.toggle('on', s.dataset.v === v));
  const tabFor = { home:'home', program:'program', session:'program', speaker:'program', people:'people', notif:'chat', chat:'chat', thread:'chat', profile:'profile', events:'home', partners:'home', meetings:'home' };
  document.querySelectorAll('.tabbar button').forEach(b => b.classList.toggle('on', b.dataset.t === tabFor[v]));
  if (v !== 'thread') $('#scroll').scrollTop = 0;
  if (v !== 'session' && qaChannel){ try{ OAFAuth.client().removeChannel(qaChannel); }catch(_){} qaChannel=null; }
  if (v === 'program') renderAgenda();
  if (v === 'session') renderSessionDetail();
  if (v === 'speaker') renderSpeaker();
  if (v === 'people') renderPeople();
  if (v === 'partners') renderPartners();
  if (v === 'notif') renderNotif();
  if (v === 'chat') renderConversations();
  if (v === 'meetings') loadMeetings();
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
const DEFAULT_LOGO='<svg class="oa" viewBox="0 0 400 400"><rect width="400" height="400" fill="#F2E500"/><text x="200" y="190" text-anchor="middle" fill="#111" font-family="\'Arial Black\',Arial,sans-serif" font-weight="900" font-size="168">one</text><text x="200" y="272" text-anchor="middle" fill="#111" font-family="Arial,sans-serif" font-weight="700" font-size="56" letter-spacing="9">AFRICA</text><text x="200" y="338" text-anchor="middle" fill="#111" font-family="Arial,sans-serif" font-weight="700" font-size="56" letter-spacing="9">FORUMS</text></svg>';
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
async function joinEvent(id){
  const sb=(typeof OAFAuth!=='undefined')&&OAFAuth.client&&OAFAuth.client();
  const me=(typeof OAFAuth!=='undefined')&&OAFAuth.user&&OAFAuth.user();
  if(!sb||!me||id==null) return;
  try{ await sb.from('event_attendees').upsert({event_id:id,profile_id:me.id},{onConflict:'event_id,profile_id',ignoreDuplicates:true}); }catch(_){}
}
function enterEvent(id){
  OAF.setCurrentEvent(id); const e=OAF.currentEvent();
  joinEvent(id);
  $('#abTitle').textContent=e.name; $('#abSub').textContent=e.cityShort;
  $('#hKicker').textContent='📍 '+e.cityShort.toUpperCase()+' · '+e.dates[lang].toUpperCase();
  $('#hTheme').textContent=e.theme[lang]; $('#hCity').textContent=e.city;
  $('#hTiles').innerHTML = [
    ['🗓️','tiProgram','program'],['🎤','tiSpeakers','people'],['🤝','tiPeople','people'],['📅','tiMeet','meetings'],['⭐','tiPartners','partners'],['ℹ️','tiInfo','home']
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
    <div class="ses" style="cursor:pointer" onclick="openSession('${s.id}')">
      <div class="t">${s.time}<small>${s.dur}</small></div>
      <div class="b"><b>${s.title[lang]}</b><small>${s.room[lang]}</small><br><span class="trk" style="background:${s.color}1f;color:${s.color}">${s.track[lang]}</span>${s.lineup&&s.lineup.length?`<span class="trk" style="background:#1113;color:#444">🎤 ${s.lineup.length}</span>`:''}</div>
      <button class="star ${OAF.isBookmarked(s.id)?'on':''}" onclick="event.stopPropagation();bm('${s.id}',this)">${OAF.isBookmarked(s.id)?'★':'☆'}</button>
    </div>`).join('') : `<div class="empty">${t('empty')}</div>`;
}
function bm(id,btn){const on=OAF.toggleBookmark(id);btn.classList.toggle('on',on);btn.textContent=on?'★':'☆';toast(on?t('tBook'):t('tUnbook'));renderChrome();
  if(OAFAuth&&OAFAuth.live()&&OAFAuth.client()){const sb=OAFAuth.client(),me=OAFAuth.user();if(me){ if(on) sb.from('bookmarks').upsert({profile_id:me.id,session_id:id}).then(()=>{},()=>{}); else sb.from('bookmarks').delete().eq('profile_id',me.id).eq('session_id',id).then(()=>{},()=>{}); }}}

/* ===== Fiche de séance : intervenants, modérateur, agenda, Q&A ===== */
function escapeHtml(s){ return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
function sessionById(id){ return OAF.sessions(OAF.currentEvent().id).find(x=>String(x.id)===String(id)); }
function speakerById(id){ return OAF.speakers().find(x=>String(x.id)===String(id)); }
function openSession(id){ curSession=String(id); show('session'); }
function openSpeaker(id){ curSpeaker=String(id); show('speaker'); }
function bmDetail(id){
  const on=OAF.toggleBookmark(id); toast(on?t('tBook'):t('tUnbook')); renderChrome();
  if(OAFAuth&&OAFAuth.live()&&OAFAuth.client()){const sb=OAFAuth.client(),me=OAFAuth.user();if(me){ if(on) sb.from('bookmarks').upsert({profile_id:me.id,session_id:id}).then(()=>{},()=>{}); else sb.from('bookmarks').delete().eq('profile_id',me.id).eq('session_id',id).then(()=>{},()=>{}); }}
  renderSessionDetail();
}
function renderSessionDetail(){
  const s=sessionById(curSession); const box=$('#sessionDetail'); if(!box) return;
  if(!s){ box.innerHTML=`<div class="empty">${t('empty')}</div>`; return; }
  const booked=OAF.isBookmarked(s.id);
  const lineup=(s.lineup||[]).map(l=>({sp:speakerById(l.id),role:l.role})).filter(x=>x.sp);
  const mods=lineup.filter(x=>x.role==='moderator'), spks=lineup.filter(x=>x.role!=='moderator');
  const card=x=>`<div class="card" style="cursor:pointer" onclick="openSpeaker('${x.sp.id}')"><div class="row"><div class="av" style="background:${x.sp.color}">${ini(x.sp.name)}</div><div class="m"><b>${x.sp.name} ${x.role==='moderator'?`<span class="tag" style="background:#111;color:#fff;font-size:9px">${lang==='fr'?'Modérateur':'Moderator'}</span>`:''}</b><small>${x.sp.role[lang]} · ${x.sp.country}</small></div><span style="color:var(--muted)">›</span></div></div>`;
  box.innerHTML=`
    <div class="card">
      <span class="trk" style="background:${s.color}1f;color:${s.color}">${s.track[lang]}</span>
      <h2 style="margin:8px 0 4px;font-size:19px">${s.title[lang]}</h2>
      <div style="color:var(--muted);font-size:13px">🕒 ${s.time} · ${s.dur} &nbsp;&nbsp; 📍 ${s.room[lang]}</div>
      ${(s.desc&&s.desc[lang])?`<p style="font-size:13.5px;line-height:1.5;margin-top:10px">${escapeHtml(s.desc[lang])}</p>`:''}
      <button class="btn ${booked?'':'solid'}" style="width:100%;margin-top:12px" onclick="bmDetail('${s.id}')">${booked?'★ '+(lang==='fr'?'Dans mon agenda':'In my agenda'):'☆ '+(lang==='fr'?'Ajouter à mon agenda':'Add to my agenda')}</button>
    </div>
    ${lineup.length?`<div class="sec"><b>${lang==='fr'?'Intervenants & modérateur':'Speakers & moderator'}</b></div>${mods.map(card).join('')}${spks.map(card).join('')}`:`<div class="card" style="color:var(--muted);font-size:13px">${lang==='fr'?'Intervenants bientôt annoncés.':'Speakers to be announced.'}</div>`}
    <div class="sec" style="margin-top:16px"><b>${lang==='fr'?'Questions du public':'Audience Q&A'}</b></div>
    <div class="card">
      <textarea id="qaInput" placeholder="${lang==='fr'?'Posez une question…':'Ask a question…'}" style="width:100%;min-height:54px;border:1px solid var(--line);border-radius:10px;padding:10px;font-size:13px;font-family:inherit;box-sizing:border-box"></textarea>
      <button class="btn solid" style="width:100%;margin-top:8px" onclick="postQuestion()">${lang==='fr'?'Envoyer ma question':'Send my question'}</button>
    </div>
    <div id="qaList"></div>`;
  loadQA();
}
function renderSpeaker(){
  const sp=speakerById(curSpeaker); const box=$('#speakerDetail'); if(!box) return;
  if(!sp){ box.innerHTML=`<div class="empty">${t('empty')}</div>`; return; }
  box.innerHTML=`<div class="card"><div class="row"><div class="av" style="width:64px;height:64px;font-size:22px;background:${sp.color}">${ini(sp.name)}</div><div class="m"><b style="font-size:17px">${sp.name}</b><small>${sp.role[lang]} · ${sp.country}</small></div></div>${(sp.bio&&sp.bio[lang])?`<p style="font-size:13.5px;line-height:1.55;margin-top:12px">${escapeHtml(sp.bio[lang])}</p>`:`<p style="color:var(--muted);font-size:13px;margin-top:12px">${lang==='fr'?'Biographie à venir.':'Bio coming soon.'}</p>`}</div>`;
}
async function loadQA(){
  const box=$('#qaList'); if(!box) return;
  if(!(OAFAuth&&OAFAuth.live()&&OAFAuth.client())){ box.innerHTML=`<div class="card" style="color:var(--muted);font-size:13px">${lang==='fr'?'Connectez-vous pour voir et poser des questions.':'Sign in to view and ask questions.'}</div>`; return; }
  const sb=OAFAuth.client(), me=OAFAuth.user();
  const [{data:qs},{data:vs}]=await Promise.all([
    sb.from('questions').select('*').eq('session_id',curSession),
    sb.from('question_votes').select('question_id,profile_id')
  ]);
  const count={}, mine={};
  (vs||[]).forEach(v=>{ count[v.question_id]=(count[v.question_id]||0)+1; if(me&&v.profile_id===me.id) mine[v.question_id]=true; });
  const names={}; (OAF.attendees()||[]).forEach(p=>names[p.id]=p.name); if(me) names[me.id]=(OAF.me().name||(lang==='fr'?'Moi':'Me'));
  qaList=(qs||[]).map(q=>Object.assign({},q,{votes:count[q.id]||0,mine:!!mine[q.id]}))
    .sort((a,b)=> (b.votes-a.votes) || (new Date(a.created_at)-new Date(b.created_at)));
  box.innerHTML = qaList.length ? qaList.map(q=>`
    <div class="card"><div style="font-size:13.5px;line-height:1.45">${escapeHtml(q.body)}</div>
    <div style="display:flex;align-items:center;gap:10px;margin-top:8px">
      <button class="btn ${q.mine?'solid':''}" style="padding:6px 12px;font-size:12px" onclick="voteQuestion('${q.id}',${q.mine})">▲ ${q.votes}</button>
      <small style="color:var(--muted)">${escapeHtml(names[q.author]||(lang==='fr'?'Participant':'Attendee'))}</small>
    </div></div>`).join('') : `<div class="card" style="color:var(--muted);font-size:13px">${lang==='fr'?'Aucune question pour l’instant. Soyez le premier ! 🙋':'No questions yet. Be the first! 🙋'}</div>`;
  subscribeQA();
}
async function postQuestion(){
  const el=$('#qaInput'); const body=((el&&el.value)||'').trim(); if(!body) return;
  if(!(OAFAuth&&OAFAuth.live()&&OAFAuth.client())){ toast(lang==='fr'?'Connexion requise':'Sign in required'); return; }
  const sb=OAFAuth.client(), me=OAFAuth.user();
  const {error}=await sb.from('questions').insert({session_id:curSession,event_id:OAF.currentEvent().id,author:me.id,body});
  if(error){ toast(error.message); return; }
  el.value=''; toast(lang==='fr'?'Question envoyée ✓':'Question sent ✓'); loadQA();
}
async function voteQuestion(qid,mine){
  if(!(OAFAuth&&OAFAuth.live()&&OAFAuth.client())) return;
  const sb=OAFAuth.client(), me=OAFAuth.user();
  if(mine){ await sb.from('question_votes').delete().eq('question_id',qid).eq('profile_id',me.id); }
  else { await sb.from('question_votes').upsert({question_id:qid,profile_id:me.id}); }
  loadQA();
}
function subscribeQA(){
  if(qaChannel || !(OAFAuth&&OAFAuth.live()&&OAFAuth.client())) return;
  try{
    qaChannel=OAFAuth.client().channel('qa-'+curSession)
      .on('postgres_changes',{event:'*',schema:'public',table:'questions',filter:`session_id=eq.${curSession}`},()=>{ if(curView==='session') loadQA(); })
      .on('postgres_changes',{event:'*',schema:'public',table:'question_votes'},()=>{ if(curView==='session') loadQA(); })
      .subscribe();
  }catch(e){ console.warn('realtime qa', e); }
}
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
  $('#plList').innerHTML = OAF.attendees().map(p=>{
    const actions = p.guest
      ? `<div style="font-size:11px;color:var(--muted);margin-top:10px;font-style:italic">${lang==='fr'?'📇 Profil importé — networking dès son inscription':'📇 Imported profile — networking once they sign in'}</div>`
      : `<div style="display:flex;gap:8px;margin-top:10px"><button class="btn solid" style="flex:1" onclick="doConnect('${p.id}',this)">${OAF.isConnected(p.id)?t('connected'):t('connect')}</button><button class="btn" onclick="openThread('${p.id}')" style="padding:11px 14px">💬</button><button class="btn" onclick="openPropose('${p.id}')" style="padding:11px 14px">📅</button></div>`;
    return `<div class="card"><div class="row"><div class="av" style="background:${p.color}">${ini(p.name)}</div><div class="m"><b>${p.name}</b><small>${p.role[lang]} · ${p.country}</small></div><div class="score" style="--p:${p.score}%"><span>${p.score}</span></div></div>
    <div style="font-size:11px;color:var(--muted);margin-top:8px">🎯 ${p.why[lang]}</div>
    ${actions}</div>`;
  }).join('');
}
function doConnect(id,btn){if(String(id).indexOf('g_')===0){toast(lang==='fr'?"Ce participant pourra échanger dès son inscription.":'This attendee can connect once they sign in.');return;}OAF.addConnection(id);btn.textContent=t('connected');btn.disabled=true;btn.style.opacity=.7;const a=OAF.attendees().find(x=>String(x.id)===String(id));toast(t('tConnect')+(a?a.name.split(' ')[0]:''));renderChrome();
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
    const [ev,se,sp,po,no,bk,cn,prof,ea,gu,ss] = await Promise.all([
      sb.from('events').select('*'),
      sb.from('sessions').select('*'),
      sb.from('speakers').select('*'),
      sb.from('sponsors').select('*'),
      sb.from('notifications').select('*').order('created_at',{ascending:false}),
      sb.from('bookmarks').select('session_id').eq('profile_id',me.id),
      sb.from('connections').select('addressee').eq('requester',me.id),
      sb.from('profiles').select('*').eq('is_visible',true),
      sb.from('event_attendees').select('event_id,profile_id'),
      sb.from('guests').select('*'),
      sb.from('session_speakers').select('session_id,speaker_id,role')
    ]);
    if(ev.error) throw ev.error;
    const eaMap={}; ((ea&&ea.data)||[]).forEach(r=>{ (eaMap[r.profile_id]=eaMap[r.profile_id]||[]).push(r.event_id); });
    const ssMap={}; ((ss&&ss.data)||[]).forEach(r=>{ (ssMap[r.session_id]=ssMap[r.session_id]||[]).push({id:r.speaker_id,role:r.role}); });
    const order={live:0,upcoming:1,past:2};
    const events=(ev.data||[]).map((e,i)=>({id:e.id,name:e.name,city:e.city||'',cityShort:e.city_short||(e.city||'').split(',')[0],status:e.status||'upcoming',dates:e.dates||{fr:'',en:''},theme:e.theme||{fr:'',en:''},cover:e.cover_url||null,top:tops[i%tops.length]}))
      .sort((a,b)=>(order[a.status]??9)-(order[b.status]??9));
    const sessions=(se.data||[]).map(s=>({id:s.id,ev:s.event_id,day:s.day||0,time:s.time||'',dur:s.dur||'',title:s.title||{fr:'',en:''},room:s.room||{fr:'',en:''},track:s.track||{fr:'',en:''},desc:s.description||{fr:'',en:''},color:s.color||'#5b8def',star:false,sp:[],lineup:ssMap[s.id]||[]}));
    const speakers=(sp.data||[]).map((s,i)=>({id:s.id,ev:s.event_id,name:s.name,role:s.role||{fr:'',en:''},country:s.country||'🌍',color:s.color||palette[i%palette.length],bio:s.bio||{fr:'',en:''},tags:s.tags||[],ses:{fr:[],en:[]}}));
    const sponsors=(po.data||[]).map((s,i)=>({id:s.id,ev:s.event_id,name:s.name,tier:s.tier||'SILVER',color:s.color||palette[i%palette.length],tc:'#fff',role:s.role||{fr:'',en:''},desc:s.description||{fr:'',en:''},booth:s.booth||{fr:'',en:''},reps:{fr:[],en:[]},logo:s.logo_url||null}));
    const attendees=(prof.data||[]).filter(p=>p.id!==me.id).map((p,i)=>({id:p.id,name:p.name||'—',role:p.role||{fr:'',en:''},country:p.country||'🌍',color:palette[i%palette.length],score:80,why:p.looking_for||{fr:'',en:''},look:p.looking_for||{fr:'',en:''},tags:p.interests||[],evs:eaMap[p.id]||[]}));
    ((gu&&gu.data)||[]).forEach((g,i)=>{ const has=g.looking_for&&(g.looking_for.fr||g.looking_for.en); const why=has?g.looking_for:{fr:(g.interests||[]).join(', ')||'Participant',en:(g.interests||[]).join(', ')||'Attendee'}; attendees.push({id:'g_'+g.id,gid:g.id,guest:true,name:g.name||'—',role:g.role||{fr:'',en:''},country:g.country||'🌍',color:palette[(attendees.length+i)%palette.length],score:75,why,look:g.looking_for||{fr:'',en:''},tags:g.interests||[],evs:[g.event_id]}); });
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
      currentEvent: (function(){ const c=(OAF.currentEvent()||{}).id; return (c!=null)?c:(events.length?events[0].id:undefined); })(),
      me: { name: myProf.name||me.email, role: myProf.role||{fr:'Participant',en:'Attendee'}, country: myProf.country||'🌍', look: myProf.looking_for||{fr:'',en:''}, interests: myProf.interests||[], visible: myProf.is_visible!==false }
    });
    renderAll();
    subscribeChat();
    subscribeContent();
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

/* ============ CHAT 1:1 ============ */
function nameOf(id){ const a=OAF.attendees().find(x=>String(x.id)===String(id)); return a?a.name:'—'; }
function appendBubble(side,text,time){
  const th=$('#thread'); if(!th) return;
  const b=document.createElement('div'); b.className='bub '+side; b.textContent=text;
  const s=document.createElement('small'); s.textContent=time||(new Date()).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}); b.appendChild(s);
  th.appendChild(b); th.scrollTop=th.scrollHeight; $('#scroll').scrollTop=$('#scroll').scrollHeight;
}
function openThread(id){
  if(String(id).indexOf('g_')===0){toast(lang==='fr'?"Ce participant pourra échanger dès son inscription.":'This attendee can connect once they sign in.');return;}
  chatWith={id:String(id), name:nameOf(id)};
  $('#thName').textContent=chatWith.name; $('#thAv').textContent=ini(chatWith.name||'· ·');
  $('#thread').innerHTML=''; $('#bkChat').textContent=t('bkChat');
  show('thread'); loadMessages(id);
}
function loadMessages(id){
  if(!(OAFAuth&&OAFAuth.live()&&OAFAuth.client())){ $('#thread').innerHTML=`<div class="empty" style="color:var(--muted);font-size:13px">${lang==='fr'?'(démo) Tapez un message ci-dessous.':'(demo) Type a message below.'}</div>`; return; }
  const sb=OAFAuth.client(), me=OAFAuth.user();
  sb.from('messages').select('*').or(`and(sender.eq.${me.id},recipient.eq.${id}),and(sender.eq.${id},recipient.eq.${me.id})`).order('created_at',{ascending:true}).then(({data,error})=>{
    if(error){ $('#thread').innerHTML=`<div class="empty">${error.message}</div>`; return; }
    $('#thread').innerHTML='';
    (data||[]).forEach(m=>appendBubble(m.sender===me.id?'me':'them', m.body, new Date(m.created_at).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})));
    if(!data||!data.length) $('#thread').innerHTML=`<div class="empty" style="color:var(--muted);font-size:13px">${lang==='fr'?'Démarrez la conversation 👋':'Start the conversation 👋'}</div>`;
  });
}
function sendMsg(){
  const i=$('#msgIn'); const txt=i.value.trim(); if(!txt||!chatWith) return; i.value='';
  if($('#thread').querySelector('.empty')) $('#thread').innerHTML='';
  appendBubble('me',txt);
  if(OAFAuth&&OAFAuth.live()&&OAFAuth.client()){ const sb=OAFAuth.client(),me=OAFAuth.user(); sb.from('messages').insert({sender:me.id,recipient:chatWith.id,body:txt}).then(({error})=>{ if(error) toast(error.message); }); }
}
function renderConversations(){
  const box=$('#convList'); if(!box) return;
  $('#chT').textContent=t('chT'); $('#chS').textContent=t('chS');
  if(!(OAFAuth&&OAFAuth.live()&&OAFAuth.client())){ box.innerHTML=`<div class="empty" style="color:var(--muted);font-size:13px;padding:14px">${t('chEmpty')}</div>`; return; }
  const sb=OAFAuth.client(), me=OAFAuth.user();
  sb.from('messages').select('*').or(`sender.eq.${me.id},recipient.eq.${me.id}`).order('created_at',{ascending:false}).then(({data,error})=>{
    if(error){ box.innerHTML=`<div class="empty">${error.message}</div>`; return; }
    const seen={}, convs=[];
    (data||[]).forEach(m=>{ const other=m.sender===me.id?m.recipient:m.sender; if(!seen[other]){ seen[other]=1; convs.push({id:other,last:m.body}); } });
    box.innerHTML = convs.length ? convs.map(c=>`<div class="card" onclick="openThread('${c.id}')" style="cursor:pointer"><div class="row"><div class="av" style="background:#111">${ini(nameOf(c.id))}</div><div class="m"><b>${nameOf(c.id)}</b><small>${c.last}</small></div></div></div>`).join('') : `<div class="empty" style="color:var(--muted);font-size:13px;padding:14px">${t('chEmpty')}</div>`;
  });
}
function subscribeChat(){
  if(chatSubscribed || !(OAFAuth&&OAFAuth.live()&&OAFAuth.client())) return;
  try{
    const sb=OAFAuth.client(), me=OAFAuth.user();
    sb.channel('msg-'+me.id).on('postgres_changes',{event:'INSERT',schema:'public',table:'messages',filter:`recipient=eq.${me.id}`},payload=>{
      const m=payload.new;
      if(chatWith && String(m.sender)===String(chatWith.id) && curView==='thread'){ appendBubble('them',m.body); }
      else { toast(t('newMsg')); }
      if(curView==='chat') renderConversations();
    }).subscribe();
    chatSubscribed=true;
  }catch(e){ console.warn('realtime chat', e); }
}
let contentSubscribed=false, contentTimer=null;
function subscribeContent(){
  if(contentSubscribed || !(OAFAuth&&OAFAuth.live()&&OAFAuth.client())) return;
  try{
    const sb=OAFAuth.client();
    // Rafraîchit le contenu (programme, intervenants, partenaires, bannière, notifs,
    // participants) dès qu'une modif admin survient — débounce pour grouper les rafales.
    const refresh=()=>{ clearTimeout(contentTimer); contentTimer=setTimeout(()=>{ hydrate(); }, 400); };
    sb.channel('content')
      .on('postgres_changes',{event:'*',schema:'public',table:'events'},refresh)
      .on('postgres_changes',{event:'*',schema:'public',table:'sessions'},refresh)
      .on('postgres_changes',{event:'*',schema:'public',table:'speakers'},refresh)
      .on('postgres_changes',{event:'*',schema:'public',table:'sponsors'},refresh)
      .on('postgres_changes',{event:'*',schema:'public',table:'notifications'},refresh)
      .on('postgres_changes',{event:'*',schema:'public',table:'event_attendees'},refresh)
      .on('postgres_changes',{event:'*',schema:'public',table:'guests'},refresh)
      .on('postgres_changes',{event:'*',schema:'public',table:'session_speakers'},refresh)
      .subscribe();
    contentSubscribed=true;
  }catch(e){ console.warn('realtime content', e); }
}

/* ============ RENDEZ-VOUS (RDV) ============ */
let localMeetings=[], proposeTarget=null;
function slots(){ const d=OAF.days(); const times=['11:00','13:15','10:00']; return d.slice(0,3).map((x,i)=>`${x[lang]} · ${times[i]}`); }
function openPropose(id){ if(String(id).indexOf('g_')===0){toast(lang==='fr'?"Ce participant pourra échanger dès son inscription.":'This attendee can connect once they sign in.');return;} proposeTarget=String(id); show('meetings'); }
function renderPropose(){
  const box=$('#meetPropose'); if(!box) return;
  if(!proposeTarget){ box.innerHTML=''; return; }
  box.innerHTML=`<div class="card"><b style="font-size:13px">${t('meProposeT')} ${nameOf(proposeTarget)}</b>
    <div style="font-size:12px;color:var(--muted);margin:6px 0 8px">${t('meSlot')}</div>
    <div style="display:flex;gap:7px;flex-wrap:wrap">${slots().map(s=>`<button class="btn" onclick="pickSlot('${s.replace(/'/g,'')}')">${s}</button>`).join('')}</div></div>`;
}
function pickSlot(label){
  const gid=proposeTarget; if(!gid) return;
  if(OAFAuth&&OAFAuth.live()&&OAFAuth.client()){ const sb=OAFAuth.client(),me=OAFAuth.user();
    sb.from('meetings').insert({event_id:OAF.currentEvent().id,organizer:me.id,guest:gid,location:label,status:'pending'}).then(({error})=>{ if(error){toast(error.message);return;} proposeTarget=null; loadMeetings(); toast(t('tMeetSent')); }); }
  else { localMeetings.push({id:'m'+Date.now(),org:'me',guest:String(gid),label,status:'pending'}); proposeTarget=null; loadMeetings(); toast(t('tMeetSent')); }
}
function loadMeetings(){
  $('#meT').textContent=t('meT'); $('#meS').textContent=t('meS');
  if(OAFAuth&&OAFAuth.live()&&OAFAuth.client()){ const sb=OAFAuth.client(),me=OAFAuth.user();
    sb.from('meetings').select('*').or(`organizer.eq.${me.id},guest.eq.${me.id}`).order('created_at',{ascending:false}).then(({data,error})=>{
      if(error){ $('#meetList').innerHTML=`<div class="empty">${error.message}</div>`; renderPropose(); return; }
      myMeetings=(data||[]).map(m=>({id:m.id, incoming:String(m.guest)===String(me.id), counterId:String(m.organizer)===String(me.id)?m.guest:m.organizer, label:m.location||'', status:m.status}));
      renderMeetings();
    }); }
  else { myMeetings=localMeetings.map(m=>({id:m.id,incoming:false,counterId:m.guest,label:m.label,status:m.status})); renderMeetings(); }
}
let myMeetings=[];
function statusTag(s){ const m={pending:['stPending','gold'],confirmed:['stConfirmed','match'],declined:['stDeclined','']}; const x=m[s]||m.pending; return `<span class="tag ${x[1]}">${t(x[0])}</span>`; }
function renderMeetings(){
  $('#meListT').textContent=t('meListT');
  renderPropose();
  const inc=myMeetings.filter(m=>m.incoming && m.status==='pending');
  const wrap=$('#meetReqWrap');
  wrap.innerHTML = inc.length ? `<div class="sec"><b>${t('meReqT')}</b></div>`+inc.map(m=>`<div class="card"><div class="row"><div class="av" style="background:#111">${ini(nameOf(m.counterId))}</div><div class="m"><b>${nameOf(m.counterId)}</b><small>${m.label}</small></div></div><div style="display:flex;gap:8px;margin-top:10px"><button class="btn solid" style="flex:1" onclick="meetAct('${m.id}','confirmed')">${t('accept')}</button><button class="btn" onclick="meetAct('${m.id}','declined')">${t('decline')}</button></div></div>`).join('') : '';
  const rest=myMeetings.filter(m=>!(m.incoming && m.status==='pending'));
  $('#meetList').innerHTML = rest.length ? rest.map(m=>`<div class="card"><div class="row"><div class="av" style="background:#1B998B">${ini(nameOf(m.counterId))}</div><div class="m"><b>${nameOf(m.counterId)}</b><small>${m.label}</small></div>${statusTag(m.status)}</div></div>`).join('') : `<div class="empty" style="color:var(--muted);font-size:13px;padding:14px">${t('meEmpty')}</div>`;
}
function meetAct(id,status){
  if(OAFAuth&&OAFAuth.live()&&OAFAuth.client()){ OAFAuth.client().from('meetings').update({status}).eq('id',id).then(({error})=>{ if(error){toast(error.message);return;} loadMeetings(); toast(status==='confirmed'?t('tMeetOk'):t('tMeetNo')); }); }
  else { const m=localMeetings.find(x=>x.id===id); if(m)m.status=status; loadMeetings(); toast(status==='confirmed'?t('tMeetOk'):t('tMeetNo')); }
}

renderAll();
show('events');
bootstrapAuth();
