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
    pfEditT:'Mon profil', pfLName:'Nom', pfLRole:'Fonction · Société', pfLCountry:'Pays', pfLLook:'Je recherche…', pfLInterests:"Centres d'intérêt (séparés par des virgules)", pfLVisible:"Visible dans l'annuaire (networking)", pfSaveBtn:'Enregistrer mon profil', tSaved:'Profil enregistré ✓', pfPhotoBtn:'Photo', tPhoto:'Photo mise à jour ✓', obT:'👋 Complétez votre profil', obS:'Ajoutez vos centres d’intérêt et ce que vous recherchez pour obtenir des suggestions de mise en relation pertinentes.', obBtn:'Compléter mon profil', reqTitle:'🤝 Demandes de connexion', accept:'Accepter', tAccepted:'Connexion acceptée ✓',
    connect:'＋ Se connecter', connected:'✓ Connecté', meet:'📅 RDV', live:'● LIVE', schedule:'Voir le programme',
    bookmarks:'sessions enregistrées', connections:'connexions', tConnect:'Demande envoyée à ', tBook:'Ajouté à mon agenda ⭐', tUnbook:'Retiré', tReset:'Démo réinitialisée ✓',
    agEmpty:'Aucune séance dans votre agenda. Touchez ☆ sur une séance pour l’ajouter.', plNone:'Aucun participant trouvé.', agMall:'Programme', agMine:'★ Mon agenda', plSearchPh:'🔍 Rechercher (nom, fonction, intérêt)',
    ifT:'Infos pratiques', ifS:"Tout ce qu'il faut savoir sur le forum.", ifVenue:'Lieu', ifAddress:'Adresse', ifDates:'Dates', ifHours:'Horaires', ifContacts:'Contacts & accès', ifContact:'Téléphone', ifEmergency:'Urgences', ifNotes:'Bon à savoir',
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
    pfEditT:'My profile', pfLName:'Name', pfLRole:'Role · Company', pfLCountry:'Country', pfLLook:'I\'m looking for…', pfLInterests:'Interests (comma-separated)', pfLVisible:'Visible in the directory (networking)', pfSaveBtn:'Save my profile', tSaved:'Profile saved ✓', pfPhotoBtn:'Photo', tPhoto:'Photo updated ✓', obT:'👋 Complete your profile', obS:'Add your interests and what you’re looking for to get relevant networking suggestions.', obBtn:'Complete my profile', reqTitle:'🤝 Connection requests', accept:'Accept', tAccepted:'Connection accepted ✓',
    connect:'＋ Connect', connected:'✓ Connected', meet:'📅 Meet', live:'● LIVE', schedule:'See program',
    bookmarks:'saved sessions', connections:'connections', tConnect:'Request sent to ', tBook:'Added to My Agenda ⭐', tUnbook:'Removed', tReset:'Demo reset ✓',
    agEmpty:'No sessions in your agenda yet. Tap ☆ on a session to add it.', plNone:'No attendees found.', agMall:'Program', agMine:'★ My agenda', plSearchPh:'🔍 Search (name, role, interest)',
    ifT:'Practical info', ifS:'Everything you need to know about the forum.', ifVenue:'Venue', ifAddress:'Address', ifDates:'Dates', ifHours:'Hours', ifContacts:'Contacts & access', ifContact:'Phone', ifEmergency:'Emergency', ifNotes:'Good to know',
    delegates:'delegates', countries:'countries', speakers:'speakers', empty:'Nothing yet.'
  }
};
let lang = OAF.lang();
const t = k => (L[lang] && L[lang][k]) || L.en[k] || k;
const ini = n => n.replace(/Dr\.\s|Fmr\.\s/,'').split(' ').map(x=>x[0]).slice(0,2).join('');
const $ = s => document.querySelector(s);
let curView = 'events', curDay = 0, curFilter = 'all', incomingReqs = [], chatWith = null, chatSubscribed = false;
let curSession = null, curSpeaker = null, qaChannel = null, qaList = [], nameMap = {};
let blockedIds = new Set(); // ids des contacts bloqués (dans un sens ou l'autre)

function show(v){
  curView = v;
  document.querySelectorAll('.view').forEach(s => s.classList.toggle('on', s.dataset.v === v));
  const tabFor = { home:'home', program:'program', session:'program', speaker:'program', people:'people', notif:'chat', chat:'chat', thread:'chat', profile:'profile', events:'home', partners:'home', partner:'home', meetings:'home', info:'home' };
  document.querySelectorAll('.tabbar button').forEach(b => b.classList.toggle('on', b.dataset.t === tabFor[v]));
  if (v !== 'thread') $('#scroll').scrollTop = 0;
  if (v !== 'session' && qaChannel){ try{ OAFAuth.client().removeChannel(qaChannel); }catch(_){} qaChannel=null; }
  if (v === 'home') renderHome();
  if (v === 'program') renderAgenda();
  if (v === 'session') renderSessionDetail();
  if (v === 'speaker') renderSpeaker();
  if (v === 'people'){ renderPeople(); maybeRefreshDirectory(); }
  if (v === 'partners') renderPartners();
  if (v === 'partner') renderPartnerDetail();
  if (v === 'info') renderInfo();
  if (v === 'notif') renderNotif();
  if (v === 'chat') renderConversations();
  if (v === 'meetings') loadMeetings();
}
const TIER_RANK={'Platinum Partner':0,'Gold Partner':1,'Silver Partner':2,'Institutional Partner':3,'Strategic Partner':4,'Sponsor':5,'Exhibitor':6};
function tierClass(tr){ return /platinum/i.test(tr||'')?'p':/gold/i.test(tr||'')?'gold':''; }
function isPremium(s){ return s.featured || /platinum|gold/i.test(s.tier||''); }
function renderPartners(){
  $('#prtT').textContent=t('prtT'); $('#prtS').textContent=t('prtS'); $('#bkPart').textContent=t('bkPart');
  const list=OAF.sponsors().slice().sort((a,b)=>((TIER_RANK[a.tier]??9)-(TIER_RANK[b.tier]??9))||((a.sort||0)-(b.sort||0))||String(a.name).localeCompare(String(b.name)));
  if(!list.length){ $('#prtList').innerHTML=`<div class="empty">${t('empty')}</div>`; return; }
  const groups=[], seen={};
  list.forEach(s=>{ const k=s.tier||'Sponsor'; if(!seen[k]){seen[k]={tier:k,items:[]};groups.push(seen[k]);} seen[k].items.push(s); });
  $('#prtList').innerHTML = groups.map(g=>`<div class="sec" style="margin-top:14px"><b>${escapeHtml(g.tier)}</b></div>`+
    g.items.map(s=>{ const prem=isPremium(s); const sub=(s.desc&&s.desc[lang])||s.tier;
      return `<div class="card" onclick="openPartner('${s.id}')" style="cursor:pointer;${prem?'border:1.5px solid var(--yellow,#F2E500);background:linear-gradient(180deg,#fffdf3,#fff)':''}"><div class="row">
        <div class="av" style="width:${prem?'58px':'48px'};height:${prem?'58px':'48px'};border-radius:13px;overflow:hidden;background:${s.logo?'#fff':s.color};color:${s.tc}">${s.logo?`<img src="${s.logo}" style="width:100%;height:100%;object-fit:cover">`:ini(s.name)}</div>
        <div class="m"><b>${escapeHtml(s.name)}${prem?' ⭐':''}</b><small>${escapeHtml(sub)}</small></div>
        <span class="tag ${tierClass(s.tier)}">${escapeHtml(s.tier)}</span></div></div>`; }).join('')
  ).join('');
}
let curPartner=null;
function openPartner(id){ curPartner=String(id); show('partner'); }
function renderPartnerDetail(){
  const box=$('#partnerDetail'); if(!box) return;
  if($('#bkPartDet')) $('#bkPartDet').textContent = lang==='fr'?'‹ Partenaires':'‹ Partners';
  const s=OAF.sponsors().find(x=>String(x.id)===String(curPartner));
  if(!s){ box.innerHTML=`<div class="empty">—</div>`; return; }
  const desc=(s.desc&&(s.desc[lang]||s.desc.fr||s.desc.en))||'';
  const link=(href,label,icon)=>href?`<a class="btn" href="${escapeHtml(href)}" target="_blank" rel="noopener" style="margin:4px 6px 0 0;display:inline-flex">${icon} ${label}</a>`:'';
  const contacts=(s.contacts||[]).filter(c=>c&&c.name);
  box.innerHTML=`
    <div class="card" style="text-align:center">
      <div class="av" style="width:84px;height:84px;border-radius:18px;overflow:hidden;margin:4px auto 10px;background:${s.logo?'#fff':s.color};color:${s.tc}">${s.logo?`<img src="${s.logo}" style="width:100%;height:100%;object-fit:cover">`:ini(s.name)}</div>
      <h2 style="margin:0;font-size:20px">${escapeHtml(s.name)}</h2>
      <span class="tag ${tierClass(s.tier)}" style="margin-top:6px;display:inline-block">${escapeHtml(s.tier)}</span>
      ${desc?`<p style="color:var(--muted);font-size:13.5px;margin-top:12px;text-align:left;white-space:pre-line">${escapeHtml(desc)}</p>`:''}
      <div style="text-align:left;margin-top:6px">
        ${link(s.website,lang==='fr'?'Site web':'Website','🌐')}
        ${link(s.linkedin,'LinkedIn','💼')}
        ${link(s.brochure,'Brochure','📄')}
        ${link(s.video,lang==='fr'?'Vidéo':'Video','🎬')}
      </div>
    </div>
    ${contacts.length?`<div class="sec"><b>${lang==='fr'?'Contacts clés':'Key contacts'}</b></div>`+contacts.map(c=>`<div class="card"><div class="row">
        <div class="av" style="width:46px;height:46px;border-radius:50%;overflow:hidden;background:${c.photo?'#fff':'#111'}">${c.photo?`<img src="${c.photo}" style="width:100%;height:100%;object-fit:cover">`:ini(c.name)}</div>
        <div class="m"><b>${escapeHtml(c.name)}</b><small>${escapeHtml(c.role||'')}</small></div></div>
        <div style="margin-top:8px">
          ${c.email?`<a class="btn" href="mailto:${escapeHtml(c.email)}" style="margin:3px 6px 0 0">✉️ ${lang==='fr'?'E-mail':'Email'}</a>`:''}
          ${c.phone?`<a class="btn" href="tel:${escapeHtml(c.phone)}" style="margin:3px 6px 0 0">📞 ${escapeHtml(c.phone)}</a>`:''}
          ${c.linkedin?`<a class="btn" href="${escapeHtml(c.linkedin)}" target="_blank" rel="noopener" style="margin:3px 6px 0 0">💼 LinkedIn</a>`:''}
        </div></div>`).join(''):''}
  `;
}
function renderInfo(){
  $('#ifT').textContent=t('ifT'); $('#ifS').textContent=t('ifS'); if($('#bkInfo'))$('#bkInfo').textContent=t('bkPart');
  const e=OAF.currentEvent()||{}; const inf=e.info||{};
  const row=(ic,label,val,href)=>{ if(!val) return ''; const inner=href?`<a href="${href}" style="color:var(--green,#1B998B);text-decoration:none">${escapeHtml(val)}</a>`:escapeHtml(val); return `<div class="row" style="align-items:flex-start;padding:9px 0;border-top:1px solid var(--line,#eee)"><div style="width:26px;font-size:16px">${ic}</div><div class="m"><small style="color:var(--muted)">${label}</small><b style="font-weight:600;font-size:14px">${inner}</b></div></div>`; };
  const notes=inf.notes&&inf.notes[lang];
  let html=`<div class="card"><div class="row"><div class="m"><b style="font-size:15px">${escapeHtml(e.name||'')}</b><small>${escapeHtml((e.theme&&e.theme[lang])||'')}</small></div></div>
    <div style="margin-top:4px">${row('📍',t('ifVenue'),inf.venue||e.city)}${row('🗺️',t('ifAddress'),inf.address)}${row('🗓️',t('ifDates'),(e.dates&&e.dates[lang])||'')}${row('🕒',t('ifHours'),inf.hours)}</div></div>`;
  const conn=`${row('📶','Wi-Fi',inf.wifi)}${row('☎️',t('ifContact'),inf.contact,inf.contact?('tel:'+String(inf.contact).replace(/[^+0-9]/g,'')):'')}${row('✉️','Email',inf.email,inf.email?('mailto:'+inf.email):'')}${row('🆘',t('ifEmergency'),inf.emergency)}`;
  if(conn.replace(/\s/g,'')) html+=`<div class="card"><b style="font-size:13px">${t('ifContacts')}</b><div style="margin-top:4px">${conn}</div></div>`;
  if(notes) html+=`<div class="card"><b style="font-size:13px">${t('ifNotes')}</b><p style="font-size:13.5px;line-height:1.55;margin-top:8px;white-space:pre-line">${escapeHtml(notes)}</p></div>`;
  html+=`<div class="card" style="cursor:pointer" onclick="show('partners')"><div class="row"><div style="width:26px;font-size:16px">⭐</div><div class="m"><b style="font-size:14px">${t('tiPartners')}</b><small>${OAF.sponsors().length} ${lang==='fr'?'partenaires':'partners'}</small></div><span style="color:var(--muted)">›</span></div></div>`;
  $('#infoBody').innerHTML=html;
}

function toast(m){const el=$('#toast');el.textContent=m;el.classList.add('on');clearTimeout(toast._t);toast._t=setTimeout(()=>el.classList.remove('on'),2200);}

/* ---- renders ---- */
const DEFAULT_LOGO='<svg class="oa" viewBox="0 0 400 400"><rect width="400" height="400" fill="#F2E500"/><text x="200" y="190" text-anchor="middle" fill="#111" font-family="\'Arial Black\',Arial,sans-serif" font-weight="900" font-size="168">one</text><text x="200" y="272" text-anchor="middle" fill="#111" font-family="Arial,sans-serif" font-weight="700" font-size="56" letter-spacing="9">AFRICA</text><text x="200" y="338" text-anchor="middle" fill="#111" font-family="Arial,sans-serif" font-weight="700" font-size="56" letter-spacing="9">FORUMS</text></svg>';
function paintLogo(){ const d=OAF.appLogo(); const el=$('#abLogo'); if(el) el.innerHTML = d?`<img src="${d}" style="width:100%;height:100%;object-fit:cover">`:DEFAULT_LOGO; }
/* Statut administrateur (organisateur) en mode réel — défaut : simple participant. */
let isAdmin = false;
/* Affiche/masque les outils réservés à l'organisateur selon le mode et les droits.
   - Mode démo : on garde tout (ce sont des outils de démonstration).
   - Mode réel : « Réinitialiser la démo » masqué pour tous ; « Espace organisateur »
     visible UNIQUEMENT pour les administrateurs, et sans la mention « (démo) ». */
function applyModeUI(){
  const live = !!(OAFAuth && OAFAuth.live && OAFAuth.live());
  const banner=$('#pfAdminBanner'), resetCard=$('#pfResetCard'), adminLbl=$('#pfAdmin');
  if(!live){ if(banner) banner.style.display=''; if(resetCard) resetCard.style.display=''; return; }
  if(resetCard) resetCard.style.display='none';
  if(banner) banner.style.display = isAdmin ? '' : 'none';
  if(adminLbl) adminLbl.textContent = (lang==='fr' ? 'Espace organisateur' : 'Organizer space');
}
function renderChrome(){
  document.documentElement.lang = lang;
  paintLogo();
  $('#lFr').classList.toggle('on', lang==='fr'); $('#lEn').classList.toggle('on', lang==='en');
  document.querySelectorAll('[data-l]').forEach(e => e.textContent = t(e.dataset.l));
  $('#evWelcome').textContent=t('welcome'); $('#evWelcomeSub').textContent=t('welcomeSub');
  [['#bkEvents','bkEvents'],['#hNow','now'],['#hMeetT','meetT'],['#pgT','pgT'],['#pgS','pgS'],['#plT','plT'],['#plS','plS'],['#ntT','ntT'],['#ntS','ntS'],['#pfStatT','statT'],['#pfLang','lang'],['#pfLangS','langS'],['#pfFund','fund'],['#pfAdmin','admin'],['#pfReset','reset'],['#pfResetS','resetS'],['#pfEditT','pfEditT'],['#pfLName','pfLName'],['#pfLRole','pfLRole'],['#pfLCountry','pfLCountry'],['#pfLLook','pfLLook'],['#pfLInterests','pfLInterests'],['#pfLVisible','pfLVisible'],['#pfSaveBtn','pfSaveBtn'],['#pgModeAll','agMall'],['#pgModeMine','agMine']].forEach(([sel,k])=>{const el=$(sel);if(el)el.textContent=t(k);});
  if($('#plSearch')) $('#plSearch').placeholder=t('plSearchPh');
  const seg=$('#evSeg').children; seg[0].textContent=t('segAll');seg[1].textContent=t('segLive');seg[2].textContent=t('segUp');seg[3].textContent=t('segPast');
  $('#pfLangBtn').textContent = lang==='fr'?'EN':'FR';
  applyModeUI();
  const me=OAF.me();
  if($('#pfName')) $('#pfName').textContent = me.name||'';
  if($('#pfAvatar')) $('#pfAvatar').innerHTML = me.photo?`<img src="${me.photo}" alt="" style="width:100%;height:100%;object-fit:cover">`:ini(me.name||'· ·');
  if($('#pfPhotoBtn')) $('#pfPhotoBtn').textContent = t('pfPhotoBtn');
  $('#pfRole').textContent = (me.role&&me.role[lang]||'') + ' · ' + (me.country||'');
  fillProfileInputs();
  const st = OAF.stats();
  $('#pfStatS').textContent = `${st.bookmarks} ${t('bookmarks')} · ${st.connections} ${t('connections')}`;
  renderOnboarding();
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

/* ===== Avatar : photo si disponible, sinon initiales ===== */
function avBox(p, extra){ extra=extra||''; const ph=p&&p.photo; return `<div class="av" style="overflow:hidden;background:${ph?'#fff':((p&&p.color)||'#111')};${extra}">${ph?`<img src="${ph}" alt="" style="width:100%;height:100%;object-fit:cover">`:ini((p&&p.name)||'· ·')}</div>`; }

/* ===== Image → data URL réduite (photo de profil, gardée légère) ===== */
function oafImg(file, cb, max){ max=max||256; const r=new FileReader(); r.onload=()=>{ const im=new Image(); im.onload=()=>{ try{ const sc=Math.min(1,max/Math.max(im.width,im.height)); const c=document.createElement('canvas'); c.width=Math.max(1,Math.round(im.width*sc)); c.height=Math.max(1,Math.round(im.height*sc)); c.getContext('2d').drawImage(im,0,0,c.width,c.height); cb(c.toDataURL('image/jpeg',0.82)); }catch(e){ cb(r.result); } }; im.onerror=()=>cb(r.result); im.src=r.result; }; r.readAsDataURL(file); }
function setMyPhoto(ev){ const f=ev.target.files&&ev.target.files[0]; ev.target.value=''; if(!f) return; oafImg(f,(url)=>{ OAF.updateMe({photo:url}); renderChrome(); toast(t('tPhoto')); if(OAFAuth&&OAFAuth.live&&OAFAuth.live()&&OAFAuth.client()){ const sb=OAFAuth.client(),u=OAFAuth.user(); if(u) sb.from('profiles').update({photo_url:url}).eq('id',u.id).then(({error})=>{ if(error) toast(error.message); }); } },256); }

/* ===== Score d'affinité de mise en relation (intérêts communs + recherche) ===== */
function _norm(s){ return String(s==null?'':s).toLowerCase().trim(); }
function buildMatch(myTags, myLook, p){
  const mineMap={}; (myTags||[]).forEach(x=>{ const n=_norm(x); if(n) mineMap[n]=x; });
  const shared=[];
  (p.tags||[]).forEach(x=>{ const n=_norm(x); if(n&&mineMap[n]&&shared.indexOf(mineMap[n])<0) shared.push(mineMap[n]); });
  const myLookTxt=_norm(((myLook&&myLook.fr)||'')+' '+((myLook&&myLook.en)||''));
  const lookHits=[];
  (p.tags||[]).forEach(x=>{ const n=_norm(x); if(n&&myLookTxt&&myLookTxt.indexOf(n)>=0&&lookHits.indexOf(x)<0) lookHits.push(x); });
  const theirLookTxt=_norm(((p.look&&p.look.fr)||'')+' '+((p.look&&p.look.en)||''));
  let reverse=0; Object.keys(mineMap).forEach(n=>{ if(theirLookTxt&&theirLookTxt.indexOf(n)>=0) reverse++; });
  let score=52 + shared.length*12 + lookHits.length*6 + reverse*6;
  if(p.look&&(p.look.fr||p.look.en)) score+=3;
  if((p.tags||[]).length) score+=2;
  score=Math.max(45,Math.min(98,Math.round(score)));
  let why;
  if(shared.length){ const l=shared.slice(0,3).join(', '); const n=shared.length; why={fr:`${n} intérêt${n>1?'s':''} en commun · ${l}`, en:`${n} shared interest${n>1?'s':''} · ${l}`}; }
  else if(lookHits.length){ const l=lookHits.slice(0,2).join(', '); why={fr:`Correspond à votre recherche · ${l}`, en:`Matches what you seek · ${l}`}; }
  else if(p.look&&(p.look.fr||p.look.en)){ why=p.look; }
  else if((p.tags||[]).length){ const l=p.tags.slice(0,3).join(', '); why={fr:l,en:l}; }
  else { why={fr:'Participe à ce forum',en:'Attending this forum'}; }
  return {score, why};
}

/* ===== Incitation à compléter le profil (1er lancement) ===== */
function profileIncomplete(){ const me=OAF.me(); if(!me) return false; const noRole=!(me.role&&(me.role.fr||me.role.en)); const noTags=!(me.interests&&me.interests.length); const noLook=!(me.look&&(me.look.fr||me.look.en)); const noName=!me.name || String(me.name).indexOf('@')>=0; return noRole||noTags||noLook||noName; }
function renderOnboarding(){ const box=$('#hOnboard'); if(!box) return; const live=OAFAuth&&OAFAuth.live&&OAFAuth.live(); if(live && profileIncomplete()){ box.innerHTML=`<div class="card" style="border:1.5px solid var(--yellow);background:linear-gradient(180deg,#fffdf3,#fff)"><b style="font-size:13.5px">${t('obT')}</b><p style="font-size:12.5px;color:var(--muted);margin:6px 0 10px">${t('obS')}</p><button class="btn solid" style="width:100%" onclick="show('profile')">${t('obBtn')}</button></div>`; } else { box.innerHTML=''; } }

/* Statut effectif d'un événement : calculé d'après les dates réelles si le mode
   automatique est activé (et les dates renseignées), sinon le statut manuel. */
function evStatus(e){
  if(e && e.auto && e.starts && e.ends){
    const now=Date.now(), s=Date.parse(e.starts), en=Date.parse(e.ends);
    if(!isNaN(s)&&!isNaN(en)){ if(now<s) return 'upcoming'; if(now>en) return 'past'; return 'live'; }
  }
  return (e&&e.status)||'upcoming';
}
function renderEvents(){
  const order={live:0,upcoming:1,past:2};
  const stTxt={live:lang==='fr'?'● EN COURS':'● LIVE',upcoming:lang==='fr'?'À VENIR':'UPCOMING',past:lang==='fr'?'PASSÉ':'PAST'};
  const tops={0:'linear-gradient(135deg,#1c1c1c,#000)',1:'linear-gradient(135deg,#0f6e4f,#1B998B)',2:'linear-gradient(135deg,#7a3b12,#c2691e)'};
  const list = OAF.events().map(e=>({e,st:evStatus(e)})).filter(x=>curFilter==='all'||x.st===curFilter).sort((a,b)=>order[a.st]-order[b.st]);
  $('#evList').innerHTML = list.length ? list.map(({e,st})=>`
    <div class="evc" onclick="enterEvent('${e.id}')">
      <div class="top" style="background:${e.cover?`#222 url(${e.cover}) center/cover`:(e.top||tops[e.id]||'#222')}"><span class="st ${st}">${stTxt[st]}</span><b>${escapeHtml(e.name)}</b></div>
      <div class="bd"><div class="r1">📍 ${escapeHtml(e.city)} · 🗓️ ${escapeHtml((e.dates&&e.dates[lang])||'')}</div><div class="th">${escapeHtml((e.theme&&e.theme[lang])||'')}</div></div>
    </div>`).join('') : `<div class="empty" style="color:var(--muted);font-size:13px;padding:18px;text-align:center">${lang==='fr'?'Aucun événement dans cette catégorie.':'No event in this category.'}</div>`;
}
function setFilter(f, btn){
  curFilter=f;
  const seg=$('#evSeg'); if(seg) Array.prototype.forEach.call(seg.children, b=>b.classList.toggle('on', b===btn));
  renderEvents();
}
async function joinEvent(id){
  const sb=(typeof OAFAuth!=='undefined')&&OAFAuth.client&&OAFAuth.client();
  const me=(typeof OAFAuth!=='undefined')&&OAFAuth.user&&OAFAuth.user();
  if(!sb||!me||id==null) return;
  try{ await sb.from('event_attendees').upsert({event_id:id,profile_id:me.id},{onConflict:'event_id,profile_id',ignoreDuplicates:true}); }catch(_){}
}
function enterEvent(id){
  OAF.setCurrentEvent(id);
  joinEvent(id);
  show('home');
}
function renderHome(){
  const e=OAF.currentEvent(); if(!e){ show('events'); return; }
  $('#abTitle').textContent=e.name; $('#abSub').textContent=e.cityShort;
  $('#hKicker').textContent='📍 '+(e.cityShort||'').toUpperCase()+' · '+((e.dates&&e.dates[lang])||'').toUpperCase();
  $('#hTheme').textContent=(e.theme&&e.theme[lang])||''; $('#hCity').textContent=e.city||'';
  $('#hTiles').innerHTML = [
    ['🗓️','tiProgram','program'],['🎤','tiSpeakers','people'],['🤝','tiPeople','people'],['📅','tiMeet','meetings'],['⭐','tiPartners','partners'],['ℹ️','tiInfo','info']
  ].map(([ic,k,v])=>`<div class="tile" onclick="show('${v}')"><div class="ic">${ic}</div><b>${t(k)}</b></div>`).join('');
  // live + matches
  const live = OAF.sessions(e.id,0).find(s=>s.track[lang].toLowerCase().includes('invest')||s.title[lang].includes('Keynote'))||OAF.sessions(e.id,0)[0];
  $('#hLive').innerHTML = live?`<div class="card"><div class="row"><div class="av" style="background:#111;border-radius:12px">🎤</div><div class="m"><b>${escapeHtml(live.title[lang])}</b><small>${escapeHtml(live.room[lang])} · ${escapeHtml(live.time)}</small></div><span class="tag live">${t('live')}</span></div></div>`:`<div class="card" style="color:var(--muted);font-size:13px">${lang==='fr'?'Le programme en direct s’affichera ici pendant le forum.':'Live sessions will appear here during the forum.'}</div>`;
  const p = OAF.attendees()[0];
  $('#hMatch').innerHTML = p ? `<div class="card"><div class="row">${avBox(p)}<div class="m"><b>${escapeHtml(p.name)}</b><small>${escapeHtml(p.role[lang])} · ${escapeHtml(p.country)}</small></div><div class="score" style="--p:${p.score}%"><span>${p.score}</span></div></div><div style="font-size:11.5px;color:var(--muted);margin-top:9px">🎯 ${escapeHtml((p.why&&p.why[lang])||'')}</div><button class="btn solid" style="width:100%;margin-top:11px" onclick="doConnect('${p.id}',this)">${OAF.isConnected(p.id)?t('connected'):t('connect')}</button></div>` : `<div class="card" style="color:var(--muted);font-size:13px">${lang==='fr'?'Les participants apparaîtront ici dès les premières inscriptions.':'Attendees will appear here as people sign up.'}</div>`;
  renderOnboarding();
}
function renderDayTabs(){
  $('#dayTabs').innerHTML = OAF.days().map((d,i)=>`<button class="${i===curDay?'on':''}" onclick="setDay(${i})">${d[lang]}</button>`).join('');
}
function setDay(i){curDay=i;renderDayTabs();renderAgenda();}
let agendaMode='all';
function setAgendaMode(m){ agendaMode=m; const a=$('#pgModeAll'),b=$('#pgModeMine'); if(a)a.classList.toggle('on',m==='all'); if(b)b.classList.toggle('on',m==='mine'); renderAgenda(); }
function sesRow(s){ return `
    <div class="ses" style="cursor:pointer" onclick="openSession('${s.id}')">
      <div class="t">${s.time}<small>${s.dur}</small></div>
      <div class="b"><b>${escapeHtml(s.title[lang])}</b><small>${escapeHtml(s.room[lang])}</small><br><span class="trk" style="background:${s.color}1f;color:${s.color}">${escapeHtml(s.track[lang])}</span>${s.lineup&&s.lineup.length?`<span class="trk" style="background:#1113;color:#444">🎤 ${s.lineup.length}</span>`:''}</div>
      <button class="star ${OAF.isBookmarked(s.id)?'on':''}" onclick="event.stopPropagation();bm('${s.id}',this)">${OAF.isBookmarked(s.id)?'★':'☆'}</button>
    </div>`; }
function renderAgenda(){
  const dt=$('#dayTabs');
  if(agendaMode==='mine'){
    if(dt) dt.style.display='none';
    const all=OAF.sessions(OAF.currentEvent().id).filter(s=>OAF.isBookmarked(s.id)).sort((a,b)=>(a.day-b.day)||String(a.time).localeCompare(String(b.time)));
    if(!all.length){ $('#agenda').innerHTML=`<div class="empty">${t('agEmpty')}</div>`; return; }
    const days=OAF.days(); let html='',last=-1;
    all.forEach(s=>{ if(s.day!==last){ last=s.day; const dl=(days[s.day]&&days[s.day][lang])||''; if(dl) html+=`<div class="sec"><b>${dl}</b></div>`; } html+=sesRow(s); });
    $('#agenda').innerHTML=html; return;
  }
  if(dt) dt.style.display='';
  renderDayTabs();
  const list = OAF.sessions(OAF.currentEvent().id, curDay);
  $('#agenda').innerHTML = list.length ? list.map(sesRow).join('') : `<div class="empty">${t('empty')}</div>`;
}
function bm(id,btn){const on=OAF.toggleBookmark(id);btn.classList.toggle('on',on);btn.textContent=on?'★':'☆';toast(on?t('tBook'):t('tUnbook'));renderChrome();if(agendaMode==='mine')renderAgenda();
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
  const card=x=>`<div class="card" style="cursor:pointer" onclick="openSpeaker('${x.sp.id}')"><div class="row">${avBox(x.sp)}<div class="m"><b>${escapeHtml(x.sp.name)} ${x.role==='moderator'?`<span class="tag" style="background:#111;color:#fff;font-size:9px">${lang==='fr'?'Modérateur':'Moderator'}</span>`:''}</b><small>${escapeHtml(x.sp.role[lang])} · ${escapeHtml(x.sp.country)}</small></div><span style="color:var(--muted)">›</span></div></div>`;
  box.innerHTML=`
    <div class="card">
      <span class="trk" style="background:${s.color}1f;color:${s.color}">${escapeHtml(s.track[lang])}</span>
      <h2 style="margin:8px 0 4px;font-size:19px">${escapeHtml(s.title[lang])}</h2>
      <div style="color:var(--muted);font-size:13px">🕒 ${escapeHtml(s.time)} · ${escapeHtml(s.dur)} &nbsp;&nbsp; 📍 ${escapeHtml(s.room[lang])}</div>
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
  box.innerHTML=`<div class="card"><div class="row">${avBox(sp,'width:64px;height:64px;font-size:22px')}<div class="m"><b style="font-size:17px">${escapeHtml(sp.name)}</b><small>${escapeHtml(sp.role[lang])} · ${escapeHtml(sp.country)}</small></div></div>${(sp.bio&&sp.bio[lang])?`<p style="font-size:13.5px;line-height:1.55;margin-top:12px">${escapeHtml(sp.bio[lang])}</p>`:`<p style="color:var(--muted);font-size:13px;margin-top:12px">${lang==='fr'?'Biographie à venir.':'Bio coming soon.'}</p>`}</div>`;
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
    <div class="card"><div class="row"><div class="av" style="background:#111">${ini(r.name||'?')}</div><div class="m"><b>${escapeHtml(r.name||'—')}</b><small>${escapeHtml(r.role||'')}</small></div>
    <button class="btn solid" style="padding:8px 12px" onclick="acceptReq('${r.id}')">${t('accept')}</button></div></div>`).join('');
}
function acceptReq(id){
  if(OAFAuth&&OAFAuth.live()&&OAFAuth.client()){ OAFAuth.client().from('connections').update({status:'accepted'}).eq('id',id).then(({error})=>{ if(error){toast(error.message);return;} incomingReqs=incomingReqs.filter(r=>String(r.id)!==String(id)); renderRequests(); toast(t('tAccepted')); }); }
  else { incomingReqs=incomingReqs.filter(r=>String(r.id)!==String(id)); renderRequests(); toast(t('tAccepted')); }
}
let peopleShown=60, _lastPeopleQ=null;
function renderPeople(){
  renderRequests();
  const q=_norm(($('#plSearch')&&$('#plSearch').value)||'');
  // Nouvelle recherche → on repart du premier paquet.
  if(q!==_lastPeopleQ){ peopleShown=60; _lastPeopleQ=q; }
  let list=OAF.attendees();
  if(q) list=list.filter(p=>_norm(p.name+' '+((p.role&&p.role[lang])||'')+' '+(p.country||'')+' '+((p.tags||[]).join(' '))+' '+((p.look&&p.look[lang])||'')).indexOf(q)>=0);
  // Bandeau « complétez votre profil » tant qu'il manque des infos clés (fonction/intérêts…).
  let banner='';
  if((OAFAuth&&OAFAuth.live&&OAFAuth.live()) && profileIncomplete()){
    banner=`<div class="card" style="border:1.5px solid var(--yellow,#F2E500);background:linear-gradient(180deg,#fffdf3,#fff);cursor:pointer" onclick="show('profile')">
      <b style="font-size:13.5px">📝 ${lang==='fr'?'Complétez votre profil':'Complete your profile'}</b>
      <p style="font-size:12.5px;color:var(--muted);margin:6px 0 10px">${lang==='fr'?"Ajoutez votre fonction, société et centres d'intérêt pour apparaître avec vos infos et obtenir de meilleures correspondances.":'Add your role, company and interests to appear with your details and get better matches.'}</p>
      <button class="btn solid" style="width:100%" onclick="event.stopPropagation();show('profile')">${lang==='fr'?'Compléter maintenant':'Complete now'}</button></div>`;
  }
  if(!list.length){ $('#plList').innerHTML=banner+`<div class="empty">${t('plNone')}</div>`; return; }
  // Rendu par paquets : on ne peint que les `peopleShown` premières fiches pour
  // éviter de figer l'écran avec des centaines/milliers de profils.
  const slice=list.slice(0, peopleShown);
  let html = slice.map(p=>{
    const actions = p.guest
      ? `<div style="font-size:11px;color:var(--muted);margin-top:10px;font-style:italic">${lang==='fr'?'📇 Profil importé — networking dès son inscription':'📇 Imported profile — networking once they sign in'}</div>`
      : `<div style="display:flex;gap:8px;margin-top:10px"><button class="btn solid" style="flex:1" onclick="doConnect('${p.id}',this)">${OAF.isConnected(p.id)?t('connected'):t('connect')}</button><button class="btn" onclick="openThread('${p.id}')" style="padding:11px 14px">💬</button><button class="btn" onclick="openPropose('${p.id}')" style="padding:11px 14px">📅</button></div>`;
    return `<div class="card"><div class="row">${avBox(p)}<div class="m"><b>${escapeHtml(p.name)}</b><small>${escapeHtml(p.role[lang])} · ${escapeHtml(p.country)}</small></div><div class="score" style="--p:${p.score}%"><span>${p.score}</span></div></div>
    <div style="font-size:11px;color:var(--muted);margin-top:8px">🎯 ${escapeHtml(p.why[lang])}</div>
    ${actions}</div>`;
  }).join('');
  if(list.length>peopleShown){
    html += `<button class="btn" style="width:100%;margin-top:6px" onclick="showMorePeople()">${lang==='fr'?'Voir plus':'Show more'} (${list.length-peopleShown})</button>`;
  }
  $('#plList').innerHTML = banner + html;
}
function showMorePeople(){ peopleShown+=60; renderPeople(); }
function doConnect(id,btn){if(String(id).indexOf('g_')===0){toast(lang==='fr'?"Ce participant pourra échanger dès son inscription.":'This attendee can connect once they sign in.');return;}OAF.addConnection(id);btn.textContent=t('connected');btn.disabled=true;btn.style.opacity=.7;const a=OAF.attendees().find(x=>String(x.id)===String(id));toast(t('tConnect')+(a?a.name.split(' ')[0]:''));renderChrome();
  if(OAFAuth&&OAFAuth.live()&&OAFAuth.client()){const sb=OAFAuth.client(),me=OAFAuth.user();if(me) sb.from('connections').upsert({requester:me.id,addressee:id,status:'pending'}).then(()=>{},()=>{});}}
function renderNotif(){
  const list = OAF.notifications();
  $('#ntList').innerHTML = list.length ? list.map(n=>`<div class="notif"><div class="ni">${n.icon||'🔔'}</div><div><b>${escapeHtml(n.title[lang]||n.title.en||n.title)}</b><small>${timeAgo(n.ts)}</small></div></div>`).join('') : `<div class="empty">${t('empty')}</div>`;
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
  const refresh=async ()=>{ const u=OAFAuth.user(); if(!u) isAdmin=false; gate.classList.toggle('on', !u); setAuthBadge(); if(u) await hydrate(); };
  OAFAuth.onChange(refresh); refresh();
  // Si Google/Supabase a renvoyé une erreur dans l'URL et qu'on n'est pas
  // connecté, on l'affiche sur l'écran de connexion (aide au diagnostic).
  try{ const m=$('#authMsg'), err=OAFAuth.error&&OAFAuth.error(); if(err&&!OAFAuth.user()&&m) m.textContent=err; }catch(_){}
}

/* Charge le contenu réel depuis la base (mode réel). Repli silencieux sur la démo si échec. */
async function hydrate(){
  const sb=OAFAuth.client(), me=OAFAuth.user(); if(!sb||!me) return;
  try{
    const palette=['#5b8def','#1B998B','#b5559a','#9a6b00','#E2622C','#13476b'];
    const tops=['linear-gradient(135deg,#1c1c1c,#000)','linear-gradient(135deg,#0f6e4f,#1B998B)','linear-gradient(135deg,#13476b,#2f7bb0)','linear-gradient(135deg,#7a3b12,#c2691e)','linear-gradient(135deg,#5a4a8a,#8a6fb5)'];
    const [ev,se,sp,po,no,bk,cn,prof,ea,gu,ss,bl,sc] = await Promise.all([
      sb.from('events').select('*'),
      sb.from('sessions').select('*'),
      sb.from('speakers').select('*'),
      sb.from('sponsors').select('*'),
      sb.from('notifications').select('*').order('created_at',{ascending:false}),
      sb.from('bookmarks').select('session_id').eq('profile_id',me.id),
      sb.from('connections').select('addressee').eq('requester',me.id),
      sb.from('profiles').select('*').eq('is_visible',true),
      sb.from('event_attendees').select('event_id,profile_id'),
      sb.from('guests').select('id,event_id,name,role,country,interests,looking_for'),
      sb.from('session_speakers').select('session_id,speaker_id,role'),
      sb.from('blocks').select('blocker,blocked'),
      sb.from('sponsor_contacts').select('*')
    ]);
    if(ev.error) throw ev.error;
    blockedIds=new Set(); ((bl&&bl.data)||[]).forEach(b=>{ if(String(b.blocker)===String(me.id)) blockedIds.add(String(b.blocked)); if(String(b.blocked)===String(me.id)) blockedIds.add(String(b.blocker)); });
    const eaMap={}; ((ea&&ea.data)||[]).forEach(r=>{ (eaMap[r.profile_id]=eaMap[r.profile_id]||[]).push(r.event_id); });
    const ssMap={}; ((ss&&ss.data)||[]).forEach(r=>{ (ssMap[r.session_id]=ssMap[r.session_id]||[]).push({id:r.speaker_id,role:r.role}); });
    const order={live:0,upcoming:1,past:2};
    const events=(ev.data||[]).map((e,i)=>({id:e.id,name:e.name,city:e.city||'',cityShort:e.city_short||(e.city||'').split(',')[0],status:e.status||'upcoming',starts:e.starts_at||null,ends:e.ends_at||null,auto:!!e.auto_status,dates:e.dates||{fr:'',en:''},theme:e.theme||{fr:'',en:''},cover:e.cover_url||null,info:e.info||{},top:tops[i%tops.length]}))
      .sort((a,b)=>(order[a.status]??9)-(order[b.status]??9));
    const sessions=(se.data||[]).map(s=>({id:s.id,ev:s.event_id,day:s.day||0,time:s.time||'',dur:s.dur||'',title:s.title||{fr:'',en:''},room:s.room||{fr:'',en:''},track:s.track||{fr:'',en:''},desc:s.description||{fr:'',en:''},color:s.color||'#5b8def',star:false,sp:[],lineup:ssMap[s.id]||[]}));
    const speakers=(sp.data||[]).map((s,i)=>({id:s.id,ev:s.event_id,name:s.name,role:s.role||{fr:'',en:''},country:s.country||'🌍',color:s.color||palette[i%palette.length],photo:s.photo_url||null,bio:s.bio||{fr:'',en:''},tags:s.tags||[],ses:{fr:[],en:[]}}));
    const scMap={}; ((sc&&sc.data)||[]).forEach(c=>{ (scMap[c.sponsor_id]=scMap[c.sponsor_id]||[]).push(c); });
    Object.values(scMap).forEach(arr=>arr.sort((x,y)=>(x.sort_order||0)-(y.sort_order||0)));
    const sponsors=(po.data||[]).map((s,i)=>({id:s.id,ev:s.event_id,name:s.name,tier:s.tier||'Sponsor',color:s.color||palette[i%palette.length],tc:'#fff',role:s.role||{fr:'',en:''},desc:s.description||{fr:'',en:''},booth:s.booth||{fr:'',en:''},reps:{fr:[],en:[]},logo:s.logo_url||null,website:s.website||'',linkedin:s.linkedin||'',brochure:s.brochure_url||'',video:s.video_url||'',featured:!!s.featured,sort:s.sort_order||0,contacts:(scMap[s.id]||[]).map(c=>({id:c.id,name:c.name,role:c.role||'',email:c.email||'',phone:c.phone||'',linkedin:c.linkedin||'',photo:c.photo_url||null}))}));
    const _myP=(prof.data||[]).find(p=>p.id===me.id)||{};
    const _myTags=_myP.interests||[]; const _myLook=_myP.looking_for||{fr:'',en:''};
    const attendees=(prof.data||[]).filter(p=>p.id!==me.id).map((p,i)=>{ const a={id:p.id,name:p.name||'—',role:p.role||{fr:'',en:''},country:p.country||'🌍',color:palette[i%palette.length],photo:p.photo_url||null,look:p.looking_for||{fr:'',en:''},tags:p.interests||[],evs:eaMap[p.id]||[]}; const m=buildMatch(_myTags,_myLook,a); a.score=m.score; a.why=m.why; return a; });
    ((gu&&gu.data)||[]).forEach((g,i)=>{ const a={id:'g_'+g.id,gid:g.id,guest:true,name:g.name||'—',role:g.role||{fr:'',en:''},country:g.country||'🌍',color:palette[(attendees.length+i)%palette.length],photo:g.photo_url||null,look:g.looking_for||{fr:'',en:''},tags:g.interests||[],evs:[g.event_id]}; const m=buildMatch(_myTags,_myLook,a); a.score=m.score; a.why=m.why; attendees.push(a); });
    attendees.sort((a,b)=>b.score-a.score);
    const notifications=(no.data||[]).map(n=>({id:n.id,icon:n.icon||'🔔',ts:new Date(n.created_at).getTime(),title:n.title||{fr:'',en:''}}));
    const profById={}; (prof.data||[]).forEach(p=>profById[p.id]=p);
    const myProf=profById[me.id] || {};
    isAdmin = !!myProf.is_admin;   // réservé à l'organisateur (droits is_admin)
    // Récupère automatiquement nom + photo depuis Google/LinkedIn (comme Whova),
    // une seule fois : on ne touche pas un nom/une photo déjà personnalisés.
    try{
      const mm=(me&&me.user_metadata)||{};
      const oauthPhoto=mm.avatar_url||mm.picture||null, oauthName=mm.full_name||mm.name||null, patch={};
      if(oauthPhoto && !myProf.photo_url){ patch.photo_url=oauthPhoto; myProf.photo_url=oauthPhoto; }
      if(oauthName && !myProf.name){ patch.name=oauthName; myProf.name=oauthName; }
      if(Object.keys(patch).length && OAFAuth.client()) OAFAuth.client().from('profiles').update(patch).eq('id',me.id).then(()=>{},()=>{});
    }catch(_){}
    nameMap={}; (prof.data||[]).forEach(p=>{ nameMap[p.id]=p.name||'—'; }); ((gu&&gu.data)||[]).forEach(g=>{ nameMap['g_'+g.id]=g.name||'—'; }); nameMap[me.id]=myProf.name||me.email;
    // demandes de connexion reçues (en attente)
    try{
      const inc=await sb.from('connections').select('id,requester,status').eq('addressee',me.id).eq('status','pending');
      incomingReqs=(inc.data||[]).map(c=>({id:c.id,name:(profById[c.requester]||{}).name||'—',role:(((profById[c.requester]||{}).role)||{})[lang]||''}));
    }catch(e){ incomingReqs=[]; }
    OAF.loadServer({
      events: events.length?events:undefined,
      sessions, speakers, sponsors, attendees: attendees.filter(a=>!blockedIds.has(String(a.id))), notifications,
      bookmarks:(bk.data||[]).map(b=>String(b.session_id)),
      connections:(cn.data||[]).map(c=>String(c.addressee)),
      currentEvent: (function(){ const c=(OAF.currentEvent()||{}).id; return (c!=null)?c:(events.length?events[0].id:undefined); })(),
      me: { name: myProf.name||me.email, role: myProf.role||{fr:'Participant',en:'Attendee'}, country: myProf.country||'🌍', look: myProf.looking_for||{fr:'',en:''}, interests: myProf.interests||[], visible: myProf.is_visible!==false, photo: myProf.photo_url||null }
    });
    renderAll();
    lastHydrate=Date.now();
    subscribeChat();
    subscribeContent();
  }catch(e){ console.warn('Hydratation Supabase échouée — données démo conservées', e); }
}
function authOAuth(provider){
  if(!(OAFAuth&&OAFAuth.signInWith)) return;
  const m=$('#authMsg'); if(m) m.textContent='…';
  OAFAuth.signInWith(provider).then(({error})=>{ if(error&&m) m.textContent=error.message; }).catch(e=>{ if(m) m.textContent=String(e&&e.message||e); });
}
function authSend(){
  const email=$('#authEmail').value.trim(); const msg=$('#authMsg');
  if(!email){ if(msg) msg.textContent=lang==='fr'?'Entrez votre e-mail.':'Enter your email.'; return; }
  if(msg) msg.textContent='…';
  // Promise.resolve + .catch : aucune erreur ne doit échouer en SILENCE
  // (sinon le bouton « semble » ne rien faire).
  Promise.resolve(OAFAuth.sendCode(email)).then(({error})=>{
    if(error){ if(msg) msg.textContent=authErrMsg(error); return; }
    $('#authStep2').style.display='block';
    if(msg) msg.textContent = lang==='fr'?'Code envoyé ✉️ — vérifiez vos e-mails.':'Code sent ✉️ — check your email.';
  }).catch(e=>{ if(msg) msg.textContent=(lang==='fr'?'Erreur : ':'Error: ')+String((e&&e.message)||e); });
}
/* Traduit une erreur d'authentification en message clair. Le serveur refuse la
   création d'un compte non invité (trigger handle_new_user) : Supabase renvoie
   alors une erreur générique « Database error… » qu'on remplace par un message
   explicite « accès sur invitation ». */
function authErrMsg(error){
  const m=String((error&&error.message)||error||'');
  if(/OAF_NOT_INVITED|Database error|not allowed|Signups? not allowed/i.test(m)){
    return lang==='fr'
      ? "Cet e-mail n'est pas sur la liste des invités. Contactez l'organisateur."
      : 'This email is not on the guest list. Please contact the organizer.';
  }
  return m;
}
function authVerify(){
  const email=$('#authEmail').value.trim(), code=$('#authCode').value.trim(); const msg=$('#authMsg');
  if(!code)return; if(msg) msg.textContent='…';
  Promise.resolve(OAFAuth.verify(email,code)).then(({error})=>{ if(error && msg) msg.textContent=authErrMsg(error); })
    .catch(e=>{ if(msg) msg.textContent=(lang==='fr'?'Erreur : ':'Error: ')+String((e&&e.message)||e); });
}
function authSignOut(){
  // Ferme proprement les canaux temps réel + réinitialise l'état, sinon une
  // reconnexion laisse des abonnements fantômes (fuite de connexions Realtime).
  try{ if(OAFAuth&&OAFAuth.client&&OAFAuth.client()) OAFAuth.client().removeAllChannels(); }catch(_){}
  chatSubscribed=false; contentSubscribed=false; qaChannel=null; chatWith=null;
  if(OAFAuth&&OAFAuth.signOut) OAFAuth.signOut();
}

/* ============ CHAT 1:1 ============ */
function nameOf(id){ const a=OAF.attendees().find(x=>String(x.id)===String(id)); if(a) return a.name; return nameMap[id]||'—'; }
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
  if(OAFAuth&&OAFAuth.live()&&OAFAuth.client()){ const sb=OAFAuth.client(),me=OAFAuth.user(); sb.from('messages').insert({sender:me.id,recipient:chatWith.id,body:txt}).then(({error})=>{ if(error) toast(chatErr(error)); }); }
}
/* Traduit les erreurs des garde-fous messagerie (trigger serveur) en clair. */
function chatErr(error){
  const m=String((error&&error.message)||error||'');
  if(/OAF_BLOCKED/i.test(m)) return lang==='fr'?'Échange indisponible avec ce contact.':'Messaging unavailable with this contact.';
  if(/OAF_RATE/i.test(m))    return lang==='fr'?'Trop de messages — patientez un instant.':'Too many messages — please wait a moment.';
  return m;
}
/* Bloquer / signaler le contact du fil ouvert (anti-abus, P2 de l'audit). */
function blockChat(){
  if(!chatWith) return;
  if(!confirm(lang==='fr'?('Bloquer '+chatWith.name+' ? Vous ne recevrez plus ses messages.'):('Block '+chatWith.name+'? You will no longer receive their messages.'))) return;
  if(OAFAuth&&OAFAuth.live()&&OAFAuth.client()){ const sb=OAFAuth.client(),me=OAFAuth.user();
    sb.from('blocks').insert({blocker:me.id,blocked:chatWith.id}).then(({error})=>{ if(error){toast(chatErr(error));return;} blockedIds.add(String(chatWith.id)); toast(lang==='fr'?'Contact bloqué 🚫':'Contact blocked 🚫'); chatWith=null; show('chat'); hydrate(); }); }
  else { toast(lang==='fr'?'(démo) Blocage indisponible':'(demo) Blocking unavailable'); }
}
function reportChat(){
  if(!chatWith) return;
  const reason=prompt(lang==='fr'?"Décrivez le problème (transmis à l'organisateur) :":'Describe the issue (sent to the organizer):','');
  if(reason===null) return;
  if(OAFAuth&&OAFAuth.live()&&OAFAuth.client()){ const sb=OAFAuth.client(),me=OAFAuth.user();
    sb.from('reports').insert({reporter:me.id,reported:chatWith.id,reason:String(reason).slice(0,500)}).then(({error})=>{ if(error){toast(chatErr(error));return;} toast(lang==='fr'?'Signalement envoyé ✓':'Report sent ✓'); }); }
  else { toast(lang==='fr'?'(démo) Signalement indisponible':'(demo) Reporting unavailable'); }
}
function renderConversations(){
  const box=$('#convList'); if(!box) return;
  $('#chT').textContent=t('chT'); $('#chS').textContent=t('chS');
  if(!(OAFAuth&&OAFAuth.live()&&OAFAuth.client())){ box.innerHTML=`<div class="empty" style="color:var(--muted);font-size:13px;padding:14px">${t('chEmpty')}</div>`; return; }
  const sb=OAFAuth.client(), me=OAFAuth.user();
  sb.from('messages').select('*').or(`sender.eq.${me.id},recipient.eq.${me.id}`).order('created_at',{ascending:false}).then(({data,error})=>{
    if(error){ box.innerHTML=`<div class="empty">${error.message}</div>`; return; }
    const seen={}, convs=[];
    (data||[]).forEach(m=>{ const other=m.sender===me.id?m.recipient:m.sender; if(blockedIds.has(String(other))) return; if(!seen[other]){ seen[other]=1; convs.push({id:other,last:m.body}); } });
    box.innerHTML = convs.length ? convs.map(c=>`<div class="card" onclick="openThread('${c.id}')" style="cursor:pointer"><div class="row"><div class="av" style="background:#111">${ini(nameOf(c.id))}</div><div class="m"><b>${escapeHtml(nameOf(c.id))}</b><small>${escapeHtml(c.last)}</small></div></div></div>`).join('') : `<div class="empty" style="color:var(--muted);font-size:13px;padding:14px">${t('chEmpty')}</div>`;
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
let contentSubscribed=false, contentTimer=null, lastHydrate=0;
function subscribeContent(){
  if(contentSubscribed || !(OAFAuth&&OAFAuth.live()&&OAFAuth.client())) return;
  try{
    const sb=OAFAuth.client();
    // Rechargement COMPLET réservé aux modifs admin RARES (programme, intervenants,
    // partenaires, bannière) — débounce pour grouper les rafales (ex. import CSV).
    const refresh=()=>{ clearTimeout(contentTimer); contentTimer=setTimeout(()=>{ hydrate(); }, 1200); };
    sb.channel('content')
      .on('postgres_changes',{event:'*',schema:'public',table:'events'},refresh)
      .on('postgres_changes',{event:'*',schema:'public',table:'sessions'},refresh)
      .on('postgres_changes',{event:'*',schema:'public',table:'speakers'},refresh)
      .on('postgres_changes',{event:'*',schema:'public',table:'sponsors'},refresh)
      .on('postgres_changes',{event:'*',schema:'public',table:'session_speakers'},refresh)
      // Notifications : mise à jour INCRÉMENTALE (on ajoute juste la ligne reçue),
      // JAMAIS de rechargement global — c'était le principal risque de saturation
      // quand l'admin diffuse une notif à des centaines de connectés en même temps.
      .on('postgres_changes',{event:'INSERT',schema:'public',table:'notifications'},addIncomingNotif)
      .subscribe();
    contentSubscribed=true;
  }catch(e){ console.warn('realtime content', e); }
}
// NB : event_attendees et guests ne déclenchent PLUS de rechargement temps réel
// (cela créait une tempête de requêtes quand beaucoup rejoignaient en même temps).
// L'annuaire se rafraîchit à la connexion et à l'ouverture de l'onglet Participants
// (maybeRefreshDirectory), ce qui borne la charge à l'usage réel, pas aux arrivées.
function addIncomingNotif(payload){
  const r=payload&&payload.new; if(!r) return;
  const notif={id:r.id, icon:r.icon||'🔔', ts:r.created_at?new Date(r.created_at).getTime():Date.now(), title:r.title||{fr:'',en:''}};
  const arr=OAF.get().notifications;
  if(!arr.some(n=>String(n.id)===String(notif.id))) arr.push(notif);
  if(curView==='notif') renderNotif();
  const ev=OAF.currentEvent();
  if(!r.event_id || !ev || String(r.event_id)===String(ev.id)){
    const ti=(notif.title&&(notif.title[lang]||notif.title.fr||notif.title.en))||'';
    if(ti) toast('🔔 '+ti);
  }
}
// Rafraîchit l'annuaire à la demande (ouverture de l'onglet Participants), au plus
// une fois toutes les 20 s — évite la tempête tout en montrant les nouveaux arrivés.
function maybeRefreshDirectory(){
  if(!(OAFAuth&&OAFAuth.live&&OAFAuth.live()&&OAFAuth.client())) return;
  if(Date.now()-lastHydrate < 20000) return;
  hydrate();
}

/* ============ RENDEZ-VOUS (RDV) ============ */
let localMeetings=[], proposeTarget=null;
function slots(){ const d=OAF.days(); const times=['11:00','13:15','10:00']; return d.slice(0,3).map((x,i)=>`${x[lang]} · ${times[i]}`); }
function openPropose(id){ if(String(id).indexOf('g_')===0){toast(lang==='fr'?"Ce participant pourra échanger dès son inscription.":'This attendee can connect once they sign in.');return;} proposeTarget=String(id); show('meetings'); }
function renderPropose(){
  const box=$('#meetPropose'); if(!box) return;
  if(!proposeTarget){ box.innerHTML=''; return; }
  box.innerHTML=`<div class="card"><b style="font-size:13px">${t('meProposeT')} ${escapeHtml(nameOf(proposeTarget))}</b>
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
  if(OAFAuth&&OAFAuth.live()&&OAFAuth.client()){ const sb=OAFAuth.client(),me=OAFAuth.user(),ev=OAF.currentEvent();
    let q=sb.from('meetings').select('*').or(`organizer.eq.${me.id},guest.eq.${me.id}`);
    if(ev&&ev.id!=null) q=q.eq('event_id',ev.id); // RDV du forum courant uniquement
    q.order('created_at',{ascending:false}).then(({data,error})=>{
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
  wrap.innerHTML = inc.length ? `<div class="sec"><b>${t('meReqT')}</b></div>`+inc.map(m=>`<div class="card"><div class="row"><div class="av" style="background:#111">${ini(nameOf(m.counterId))}</div><div class="m"><b>${escapeHtml(nameOf(m.counterId))}</b><small>${escapeHtml(m.label)}</small></div></div><div style="display:flex;gap:8px;margin-top:10px"><button class="btn solid" style="flex:1" onclick="meetAct('${m.id}','confirmed')">${t('accept')}</button><button class="btn" onclick="meetAct('${m.id}','declined')">${t('decline')}</button></div></div>`).join('') : '';
  const rest=myMeetings.filter(m=>!(m.incoming && m.status==='pending'));
  $('#meetList').innerHTML = rest.length ? rest.map(m=>`<div class="card"><div class="row"><div class="av" style="background:#1B998B">${ini(nameOf(m.counterId))}</div><div class="m"><b>${escapeHtml(nameOf(m.counterId))}</b><small>${escapeHtml(m.label)}</small></div>${statusTag(m.status)}</div></div>`).join('') : `<div class="empty" style="color:var(--muted);font-size:13px;padding:14px">${t('meEmpty')}</div>`;
}
function meetAct(id,status){
  if(OAFAuth&&OAFAuth.live()&&OAFAuth.client()){ OAFAuth.client().from('meetings').update({status}).eq('id',id).then(({error})=>{ if(error){toast(error.message);return;} loadMeetings(); toast(status==='confirmed'?t('tMeetOk'):t('tMeetNo')); }); }
  else { const m=localMeetings.find(x=>x.id===id); if(m)m.status=status; loadMeetings(); toast(status==='confirmed'?t('tMeetOk'):t('tMeetNo')); }
}

renderAll();
show('events');
bootstrapAuth();
