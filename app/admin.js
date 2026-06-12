/* OAF Connect — admin console logic (writes to the shared OAF store) */
const AL = {
  fr: { nDash:'Tableau de bord', nProgram:'Programme', nNotif:'Notifications', nPeople:'Participants', nSettings:'Réglages',
    lgT:'Espace organisateur', lgS:"Réservé à l'équipe OneAfricaForums.", lgBtn:'Se connecter', openApp:"Voir l'app ↗",
    dEngageT:'Engagement en direct', dEngageS:"Mis à jour en temps réel d'après l'activité dans l'app.",
    pAddT:'Ajouter / modifier une session', pAddS:"Elle apparaît immédiatement dans le programme de l'app.", pAddBtn:'＋ Ajouter la session', pUpdBtn:'✓ Enregistrer les modifications', pCancelBtn:'Annuler',
    pListT:'Programme actuel', fTitle:'Titre (FR)', fTitleEn:'Titre (EN)', fDay:'Jour', fTime:'Heure', fRoom:'Salle (FR)', fRoomEn:'Salle (EN)', fTrack:'Thème (FR)', fTrackEn:'Thème (EN)', fDur:'Durée',
    pImpT:'Importer un programme (CSV)', pImpS:"Chargez tout le programme d'un coup depuis un fichier CSV bilingue. Idéal pour publier ou rafraîchir le programme complet. Utilisez le modèle ci-dessous.", pImpBtn:'📥 Importer le programme', pImpTplBtn:'⬇ Modèle de programme', pImpReplace:'Remplacer tout le programme existant', confirmReplace:'Remplacer TOUT le programme existant de cet événement ?', tProgImp:'{n} session(s) importée(s) ✓', tUpd:'Session mise à jour ✓',
    nSendT:'Envoyer une notification', nSendS:"Diffusée à tous les participants — visible immédiatement dans l'app.", nSendBtn:'Diffuser', nHistT:'Historique', fIcon:'Icône', fMsg:'Message',
    peSpkT:'Intervenants', peSpkBtn:'＋ Ajouter', peAttT:'Participants', peSpoT:'Partenaires',
    setEvT:'Événement actif', setEvS:"Choisissez l'édition gérée par l'app.", setRT:'Données', setRS:"Restaurer les données d'exemple.", setRBtn:'Réinitialiser la démo', setOut:'Se déconnecter',
    kAtt:'Participants', kSpk:'Intervenants', kSpo:'Partenaires', kSes:'Sessions', kConn:'Connexions', kBook:'Sessions enregistrées',
    tAdd:'Session ajoutée ✓', tDel:'Session supprimée', tNotif:'Notification diffusée 📣', tSpk:'Intervenant ajouté ✓', tReset:'Démo réinitialisée ✓', tEvent:'Événement actif mis à jour',
    needTitle:'Saisissez un titre.', needMsg:'Saisissez un message.', confirmDel:'Supprimer cette session ?', empty:'Aucun élément.',
    engageConn:'connexions créées par les participants', engageBook:'sessions ajoutées aux agendas', wrongPass:'Code incorrect (démo : admin)',
    peImpS:'Importez une liste en masse (fichier CSV : nom, fonction, pays, intérêts).', peImpBtn:'📥 Importer un CSV', peTplBtn:'⬇ Modèle CSV', peSpoS:"Cliquez « Logo » pour téléverser le logo d'un partenaire.", sponsorLogoBtn:'Logo',
    setBrandT:"Identité de l'app", setBrandS:"Téléversez votre logo — il s'applique partout (app + admin).", setLogoBtn:'🖼️ Choisir un logo', setLogoClr:'Logo par défaut',
    setCoverT:"Bannière de l'événement", setCoverS:"Image de couverture affichée sur la carte de l'événement.", setCoverBtn:'🖼️ Choisir une image', setCoverClr:'Retirer',
    tLogo:'Logo mis à jour ✓ — visible dans l’app', tLogoClr:'Logo par défaut rétabli', tCover:"Bannière de l'événement mise à jour ✓", tImport:'{n} participant(s) importé(s) ✓', csvEmpty:'Fichier vide ou illisible', tSponsorLogo:'Logo du partenaire mis à jour ✓' },
  en: { nDash:'Dashboard', nProgram:'Program', nNotif:'Notifications', nPeople:'People', nSettings:'Settings',
    lgT:'Organizer space', lgS:'For the OneAfricaForums team only.', lgBtn:'Sign in', openApp:'Open app ↗',
    dEngageT:'Live engagement', dEngageS:'Updated in real time from activity in the app.',
    pAddT:'Add / edit a session', pAddS:'It appears instantly in the app program.', pAddBtn:'＋ Add session', pUpdBtn:'✓ Save changes', pCancelBtn:'Cancel',
    pListT:'Current program', fTitle:'Title (FR)', fTitleEn:'Title (EN)', fDay:'Day', fTime:'Time', fRoom:'Room (FR)', fRoomEn:'Room (EN)', fTrack:'Track (FR)', fTrackEn:'Track (EN)', fDur:'Duration',
    pImpT:'Import a program (CSV)', pImpS:'Load the whole program at once from a bilingual CSV file. Ideal to publish or refresh the full program. Use the template below.', pImpBtn:'📥 Import program', pImpTplBtn:'⬇ Program template', pImpReplace:'Replace the entire existing program', confirmReplace:'Replace the ENTIRE existing program for this event?', tProgImp:'{n} session(s) imported ✓', tUpd:'Session updated ✓',
    nSendT:'Send a notification', nSendS:'Broadcast to all attendees — visible instantly in the app.', nSendBtn:'Broadcast', nHistT:'History', fIcon:'Icon', fMsg:'Message',
    peSpkT:'Speakers', peSpkBtn:'＋ Add', peAttT:'Attendees', peSpoT:'Partners',
    setEvT:'Active event', setEvS:'Choose the edition managed by the app.', setRT:'Data', setRS:'Restore sample data.', setRBtn:'Reset demo', setOut:'Sign out',
    kAtt:'Attendees', kSpk:'Speakers', kSpo:'Partners', kSes:'Sessions', kConn:'Connections', kBook:'Saved sessions',
    tAdd:'Session added ✓', tDel:'Session removed', tNotif:'Notification broadcast 📣', tSpk:'Speaker added ✓', tReset:'Demo reset ✓', tEvent:'Active event updated',
    needTitle:'Enter a title.', needMsg:'Enter a message.', confirmDel:'Delete this session?', empty:'No items.',
    engageConn:'connections made by attendees', engageBook:'sessions added to agendas', wrongPass:'Wrong code (demo: admin)',
    peImpS:'Bulk-import a list (CSV file: name, role, country, interests).', peImpBtn:'📥 Import CSV', peTplBtn:'⬇ CSV template', peSpoS:'Click “Logo” to upload a partner logo.', sponsorLogoBtn:'Logo',
    setBrandT:'App identity', setBrandS:'Upload your logo — it applies everywhere (app + admin).', setLogoBtn:'🖼️ Choose a logo', setLogoClr:'Default logo',
    setCoverT:'Event banner', setCoverS:'Cover image shown on the event card.', setCoverBtn:'🖼️ Choose an image', setCoverClr:'Remove',
    tLogo:'Logo updated ✓ — live in the app', tLogoClr:'Default logo restored', tCover:'Event banner updated ✓', tImport:'{n} attendee(s) imported ✓', csvEmpty:'Empty or unreadable file', tSponsorLogo:'Partner logo updated ✓' }
};
let lang = OAF.lang();
const a = k => (AL[lang] && AL[lang][k]) || AL.en[k] || k;
const ini = n => n.replace(/Dr\.\s|Fmr\.\s/,'').split(' ').map(x=>x[0]).slice(0,2).join('');
const $ = s => document.querySelector(s);
// Neutralise le HTML des champs saisis par les participants (nom, fonction…)
// AVANT injection via innerHTML : empêche toute exécution de code (XSS) dans la
// console organisateur, cible la plus sensible.
const escapeHtml = s => String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let page = 'dash';

function adToast(m){const el=$('#adToast');el.textContent=m;el.classList.add('on');clearTimeout(adToast._t);adToast._t=setTimeout(()=>el.classList.remove('on'),2200);}

/* auth (prototype only) */
function adLogin(){ if($('#lgPass').value.trim().toLowerCase()==='admin'||$('#lgPass').value===''){ sessionStorage.setItem('oaf_admin','1'); showConsole(); } else adToast(a('wrongPass')); }
function adLogout(){ sessionStorage.removeItem('oaf_admin'); $('#console').style.display='none'; $('#loginWrap').style.display='block'; }
function showConsole(){ $('#loginWrap').style.display='none'; $('#console').style.display='block'; renderAll(); }

function nav(p){ page=p; document.querySelectorAll('.adnav button').forEach(b=>b.classList.toggle('on',b.dataset.p===p)); document.querySelectorAll('.adpage').forEach(s=>s.classList.toggle('on',s.dataset.p===p)); renderPage(); }

function renderLabels(){
  document.documentElement.lang=lang;
  $('#lFr').classList.toggle('on',lang==='fr');$('#lEn').classList.toggle('on',lang==='en');
  document.querySelectorAll('[data-l]').forEach(e=>e.textContent=a(e.dataset.l));
  [['#lgT','lgT'],['#lgS','lgS'],['#lgBtn','lgBtn'],['#openApp','openApp'],['#dEngageT','dEngageT'],['#dEngageS','dEngageS'],['#pAddT','pAddT'],['#pAddS','pAddS'],['#pAddBtn','pAddBtn'],['#pListT','pListT'],['#fTitle','fTitle'],['#fTitleEn','fTitleEn'],['#fDay','fDay'],['#fTime','fTime'],['#fRoom','fRoom'],['#fRoomEn','fRoomEn'],['#fTrack','fTrack'],['#fTrackEn','fTrackEn'],['#fDur','fDur'],['#pCancelBtn','pCancelBtn'],['#pImpT','pImpT'],['#pImpS','pImpS'],['#pImpTplBtn','pImpTplBtn'],['#pImpReplaceL','pImpReplace'],['#nSendT','nSendT'],['#nSendS','nSendS'],['#nSendBtn','nSendBtn'],['#nHistT','nHistT'],['#fIcon','fIcon'],['#fMsg','fMsg'],['#peSpkT','peSpkT'],['#peSpkBtn','peSpkBtn'],['#peAttT','peAttT'],['#peSpoT','peSpoT'],['#setEvT','setEvT'],['#setEvS','setEvS'],['#setRT','setRT'],['#setRS','setRS'],['#setRBtn','setRBtn'],['#setOut','setOut'],
   ['#peImpS','peImpS'],['#peTplBtn','peTplBtn'],['#peSpoS','peSpoS'],['#setBrandT','setBrandT'],['#setBrandS','setBrandS'],['#setLogoClr','setLogoClr'],['#setCoverT','setCoverT'],['#setCoverS','setCoverS'],['#setCoverClr','setCoverClr']
  ].forEach(([sel,k])=>{const el=$(sel);if(el)el.textContent=a(k);});
  // buttons that contain a hidden <input>: only translate the leading text node
  [['#peImpBtn','peImpBtn'],['#setLogoBtn','setLogoBtn'],['#setCoverBtn','setCoverBtn'],['#pImpBtn','pImpBtn']].forEach(([sel,k])=>{const el=$(sel);if(el&&el.childNodes[0])el.childNodes[0].nodeValue=a(k);});
  $('#adEvent').textContent = OAF.currentEvent().name;
}
function renderKpis(){
  const s=OAF.stats();
  const items=[['kAtt',s.attendees,'#5b8def'],['kSpk',s.speakers,'#1B998B'],['kSpo',s.sponsors,'#9a6b00'],['kSes',s.sessions,'#111'],['kConn',s.connections,'#1E8C5A'],['kBook',s.bookmarks,'#b5559a']];
  $('#kpis').innerHTML=items.map(([k,v,c])=>`<div class="kpi"><b>${v}</b><small>${a(k)}</small><div class="bar"><i style="width:${Math.min(100,v*8+10)}%;background:${c}"></i></div></div>`).join('');
  const st=OAF.stats();
  $('#engage').innerHTML=`<div class="li"><div class="av" style="width:38px;height:38px;background:#1E8C5A">🤝</div><div class="m"><b>${st.connections}</b><small>${a('engageConn')}</small></div></div><div class="li"><div class="av" style="width:38px;height:38px;background:#b5559a">⭐</div><div class="m"><b>${st.bookmarks}</b><small>${a('engageBook')}</small></div></div>`;
}
function renderProgram(){
  const days=OAF.days();
  $('#sDay').innerHTML=days.map((d,i)=>`<option value="${i}">${d[lang]}</option>`).join('');
  $('#pListS').textContent=OAF.currentEvent().name;
  let html='';
  days.forEach((d,i)=>{const ss=OAF.sessions(OAF.currentEvent().id,i);if(!ss.length)return;
    html+=`<div style="font-weight:800;font-size:13px;margin:12px 0 8px">${d[lang]}</div>`;
    html+=ss.map(s=>`<div class="li"><div class="av" style="width:38px;height:38px;border-radius:10px;background:${s.color}">🗓️</div><div class="m"><b>${escapeHtml(s.time)} · ${escapeHtml(s.title[lang])}</b><small>${escapeHtml(s.room[lang])} · ${escapeHtml(s.track[lang])} · ${escapeHtml(s.dur)}</small></div><button class="btn" onclick="adEditSession('${s.id}')" title="Modifier / Edit">✎</button><button class="btn danger" onclick="adDelSession('${s.id}')">✕</button></div>`).join('');
  });
  $('#progList').innerHTML=html||`<div class="empty">${a('empty')}</div>`;
}
function renderNotifAdmin(){
  const list=OAF.notifications();
  $('#notifList').innerHTML=list.length?list.map(n=>`<div class="li"><div class="av" style="width:38px;height:38px;border-radius:10px;background:#FFF4BF;color:#111">${n.icon||'🔔'}</div><div class="m"><b>${escapeHtml(n.title[lang]||n.title.en||n.title)}</b><small>${new Date(n.ts).toLocaleString()}</small></div></div>`).join(''):`<div class="empty">${a('empty')}</div>`;
}
function renderPeople(){
  $('#spkList').innerHTML=OAF.speakers().map(s=>`<div class="li"><div class="av" style="width:38px;height:38px;background:${s.color}">${ini(s.name)}</div><div class="m"><b>${escapeHtml(s.name)}</b><small>${escapeHtml(s.role[lang])} · ${escapeHtml(s.country)}</small></div><button class="btn danger" onclick="adDelSpeaker('${s.id}')">✕</button></div>`).join('');
  $('#attList').innerHTML=OAF.attendees().map(p=>`<div class="li"><div class="av" style="width:38px;height:38px;background:${p.color}">${ini(p.name)}</div><div class="m"><b>${escapeHtml(p.name)}${p.guest?' <span class="tag" style="font-size:9px">importé</span>':''}</b><small>${escapeHtml(p.role[lang])} · ${escapeHtml(p.country)}</small></div><span class="tag match">${p.score}</span>${p.guest?`<button class="btn danger" onclick="adDelGuest('${p.gid}')">✕</button>`:''}</div>`).join('');
  ensureTierOptions();
  const spo=OAF.sponsors().slice().sort((a,b)=>(a.sort||0)-(b.sort||0));
  $('#spoList').innerHTML=spo.map((s,idx)=>`<div class="li"><div class="av" style="width:38px;height:38px;border-radius:10px;background:${s.logo?'#fff':s.color};color:${s.tc};overflow:hidden">${s.logo?`<img src="${s.logo}" style="width:100%;height:100%;object-fit:cover">`:ini(s.name)}</div><div class="m"><b>${escapeHtml(s.name)}${s.featured?' ⭐':''}</b><small>${escapeHtml(s.tier)}${s.contacts&&s.contacts.length?(' · '+s.contacts.length+' contact(s)'):''}</small></div><button class="btn" title="Monter" onclick="adMoveSponsor('${s.id}',-1)" ${idx===0?'disabled':''}>↑</button><button class="btn" title="Descendre" onclick="adMoveSponsor('${s.id}',1)" ${idx===spo.length-1?'disabled':''}>↓</button><button class="btn" title="Dupliquer vers un autre forum" onclick="adDupSponsor('${s.id}')">⧉</button><button class="btn" onclick="adEditSponsor('${s.id}')">✏️</button><button class="btn danger" onclick="adDelSponsor('${s.id}')">✕</button></div>`).join('');
  renderReports();
}
let adReports=[], adNames={};
function renderReports(){
  const box=$('#reportList'); if(!box) return;
  const open=adReports.filter(r=>r.status==='open');
  const list=open.length?open:adReports.slice(0,20);
  if(!list.length){ box.innerHTML=`<div class="desc">${lang==='fr'?'Aucun signalement. 🎉':'No reports. 🎉'}</div>`; return; }
  box.innerHTML=list.map(r=>{
    const who=escapeHtml(adNames[r.reported]||'—'), by=escapeHtml(adNames[r.reporter]||'—');
    const when=new Date(r.created_at).toLocaleString();
    const done=r.status!=='open';
    return `<div class="li" style="align-items:flex-start"><div class="m"><b>⚠️ ${who}</b>`
      +`<small>${lang==='fr'?'signalé par':'reported by'} ${by} · ${when}${done?` · ✓ ${escapeHtml(r.status)}`:''}</small>`
      +(r.reason?`<div style="font-size:13px;margin-top:4px;white-space:pre-line">${escapeHtml(r.reason)}</div>`:'')+`</div>`
      +(done?'':`<button class="btn" onclick="adReportStatus('${r.id}','reviewed')">${lang==='fr'?'Traité':'Done'}</button><button class="btn" onclick="adReportStatus('${r.id}','dismissed')">${lang==='fr'?'Ignorer':'Dismiss'}</button>`)
      +`</div>`;
  }).join('');
}
async function adReportStatus(id,status){
  if(!L())return; const {error}=await OAFAuth.client().from('reports').update({status}).eq('id',id);
  if(error){adToast(error.message);return;}
  const r=adReports.find(x=>String(x.id)===String(id)); if(r)r.status=status;
  renderReports(); adToast(lang==='fr'?'Mis à jour ✓':'Updated ✓');
}
const DEFAULT_LOGO='<svg class="oa" viewBox="0 0 400 400"><rect width="400" height="400" fill="#F2E500"/><text x="200" y="190" text-anchor="middle" fill="#111" font-family="\'Arial Black\',Arial,sans-serif" font-weight="900" font-size="168">one</text><text x="200" y="272" text-anchor="middle" fill="#111" font-family="Arial,sans-serif" font-weight="700" font-size="56" letter-spacing="9">AFRICA</text><text x="200" y="338" text-anchor="middle" fill="#111" font-family="Arial,sans-serif" font-weight="700" font-size="56" letter-spacing="9">FORUMS</text></svg>';
const logoMarkup=d=>d?`<img src="${d}" style="width:100%;height:100%;object-fit:cover">`:DEFAULT_LOGO;
function paintBrand(){const el=$('#adLogo');if(el)el.innerHTML=logoMarkup(OAF.appLogo());}
function updateCoverPreview(){const sel=$('#coverEvent');if(!sel)return;const e=OAF.events().find(x=>String(x.id)===String(sel.value));const cv=e&&e.cover;$('#coverPreview').innerHTML=cv?`<img src="${cv}" style="width:100%;height:100%;object-fit:cover">`:'';}
function renderSettings(){
  $('#setEvent').innerHTML=OAF.events().map(e=>`<option value="${e.id}" ${e.id===OAF.currentEvent().id?'selected':''}>${e.name}</option>`).join('');
  $('#coverEvent').innerHTML=OAF.events().map(e=>`<option value="${e.id}">${e.name}</option>`).join('');
  paintBrand();
  $('#brandPreview').innerHTML=logoMarkup(OAF.appLogo());
  updateCoverPreview();
  const ce=OAF.currentEvent()||{}; const set=(id,v)=>{const el=$('#'+id);if(el)el.value=v||'';};
  set('evName',ce.name); set('evDatesFr',ce.dates&&ce.dates.fr); set('evDatesEn',ce.dates&&ce.dates.en); set('evCity',ce.city);
  set('evThemeFr',ce.theme&&ce.theme.fr); set('evThemeEn',ce.theme&&ce.theme.en);
  set('evStatus', ce.auto ? 'auto' : (ce.status||'upcoming'));
  set('evStart', isoToLocal(ce.starts)); set('evEnd', isoToLocal(ce.ends));
  adToggleAutoFields();
  const inf=ce.info||{}; set('infVenue',inf.venue); set('infAddress',inf.address); set('infHours',inf.hours); set('infWifi',inf.wifi); set('infContact',inf.contact); set('infEmail',inf.email); set('infEmergency',inf.emergency); set('infNotesFr',inf.notes&&inf.notes.fr); set('infNotesEn',inf.notes&&inf.notes.en);
}
/* datetime-local <-> ISO helpers (le navigateur travaille en heure locale) */
function isoToLocal(iso){ if(!iso) return ''; const d=new Date(iso); if(isNaN(d)) return ''; const p=n=>String(n).padStart(2,'0'); return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`; }
function localToIso(v){ if(!v) return null; const d=new Date(v); return isNaN(d)?null:d.toISOString(); }
function adToggleAutoFields(){ const sel=$('#evStatus'), box=$('#evAutoFields'); if(sel&&box) box.style.display = sel.value==='auto' ? 'block' : 'none'; }
async function adSaveEvent(){
  const ev=OAF.currentEvent(); if(!ev){adToast(a('csvEmpty'));return;}
  const name=($('#evName').value||'').trim()||ev.name;
  const dfr=($('#evDatesFr').value||'').trim(); const den=($('#evDatesEn').value||'').trim()||dfr;
  const city=($('#evCity').value||'').trim();
  const tfr=($('#evThemeFr').value||'').trim(); const ten=($('#evThemeEn').value||'').trim()||tfr;
  const cityShort=city.split(',')[0].trim()||city;
  const sel=($('#evStatus')&&$('#evStatus').value)||ev.status||'upcoming';
  const auto=sel==='auto';
  const status=auto?(ev.status||'upcoming'):sel; // on garde un statut manuel valide en repli
  const starts=auto?localToIso($('#evStart')&&$('#evStart').value):null;
  const ends=auto?localToIso($('#evEnd')&&$('#evEnd').value):null;
  const gv=id=>(($('#'+id)&&$('#'+id).value)||'').trim();
  const info={venue:gv('infVenue'),address:gv('infAddress'),hours:gv('infHours'),wifi:gv('infWifi'),contact:gv('infContact'),email:gv('infEmail'),emergency:gv('infEmergency'),notes:{fr:gv('infNotesFr'),en:gv('infNotesEn')||gv('infNotesFr')}};
  if(L()){
    const {error}=await OAFAuth.client().from('events').update({name,dates:{fr:dfr,en:den},city,city_short:cityShort,theme:{fr:tfr,en:ten},status,auto_status:auto,starts_at:starts,ends_at:ends,info}).eq('id',ev.id);
    if(error){adToast(error.message);return;}
    await reloadAndRender();
  } else {
    OAF.updateEvent(ev.id,{name,dates:{fr:dfr,en:den},city,cityShort,theme:{fr:tfr,en:ten},status,auto,starts,ends,info}); renderAll();
  }
  adToast(lang==='fr'?'Événement enregistré ✓':'Event saved ✓');
}
async function adCreateEvent(){
  const name=($('#newEvName').value||'').trim();
  if(!name){adToast(lang==='fr'?'Indiquez un nom':'Enter a name');return;}
  const city=($('#newEvCity').value||'').trim();
  const dfr=($('#newEvDatesFr').value||'').trim(); const den=($('#newEvDatesEn').value||'').trim()||dfr;
  const status=$('#newEvStatus').value||'upcoming';
  const cityShort=city.split(',')[0].trim();
  if(L()){
    const {data,error}=await OAFAuth.client().from('events').insert({name,city,city_short:cityShort,status,dates:{fr:dfr,en:den}}).select('id').single();
    if(error){adToast(error.message);return;}
    await reloadAndRender();
    if(data&&data.id){ OAF.setCurrentEvent(data.id); }
    renderAll();
  } else {
    const id=OAF.addEvent({name,city,cityShort,status,dates:{fr:dfr,en:den}});
    OAF.setCurrentEvent(id); renderAll();
  }
  ['newEvName','newEvCity','newEvDatesFr','newEvDatesEn'].forEach(id=>{const el=$('#'+id);if(el)el.value='';});
  adToast(lang==='fr'?'Événement créé ✓':'Event created ✓');
}

function renderPage(){ if(page==='dash')renderKpis(); else if(page==='program')renderProgram(); else if(page==='notif')renderNotifAdmin(); else if(page==='people')renderPeople(); else if(page==='settings')renderSettings(); }
function renderAll(){ renderLabels(); paintBrand(); renderKpis(); renderProgram(); renderNotifAdmin(); renderPeople(); renderSettings(); }

/* ---- image upload (downscaled to a data URL, kept small for storage) ---- */
function processImg(file, cb, max){
  max = max || 256;
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      try {
        const sc = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.max(1, Math.round(img.width * sc)); c.height = Math.max(1, Math.round(img.height * sc));
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        cb(c.toDataURL('image/png'));
      } catch (e) { cb(reader.result); }
    };
    img.onerror = () => cb(reader.result);
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}
function adSetLogo(e){ const f=e.target.files[0]; if(!f)return; processImg(f,d=>{OAF.setAppLogo(d);renderSettings();adToast(a('tLogo'));},192); e.target.value=''; }
function adClearLogo(){ OAF.setAppLogo(null); renderSettings(); adToast(a('tLogoClr')); }
function adSetCover(e){ const f=e.target.files[0]; if(!f)return; const id=$('#coverEvent').value; processImg(f,async d=>{ OAF.setEventCover(id,d); if(L()){ const {error}=await OAFAuth.client().from('events').update({cover_url:d}).eq('id',id); if(error){adToast(error.message);return;} } renderSettings(); adToast(a('tCover')); },560); e.target.value=''; }
async function adClearCover(){ const id=$('#coverEvent').value; OAF.setEventCover(id,null); if(L()){ const {error}=await OAFAuth.client().from('events').update({cover_url:null}).eq('id',id); if(error){adToast(error.message);return;} } renderSettings(); adToast(a('tCover')); }
function adSponsorLogo(e,id){ const f=e.target.files[0]; if(!f)return; processImg(f,d=>{OAF.setSponsorLogo(id,d);renderPeople();adToast(a('tSponsorLogo'));},160); e.target.value=''; }

/* ===================== PARTENAIRES (console premium) ===================== */
const SP_TIERS=['Platinum Partner','Gold Partner','Silver Partner','Institutional Partner','Strategic Partner','Sponsor','Exhibitor'];
let spLogoData=null, spContactsState=[];
function ensureTierOptions(){ const sel=$('#spTier'); if(sel && !sel.options.length){ sel.innerHTML=SP_TIERS.map(t=>`<option value="${t}">${t}</option>`).join(''); } }
function spLogoPreview(){ const b=$('#spLogoPrev'); if(!b)return; b.innerHTML=spLogoData?`<img src="${spLogoData}" style="width:100%;height:100%;object-fit:cover">`:''; b.style.background=spLogoData?'#fff':'#eee'; }
function spPickLogo(e){ const f=e.target.files&&e.target.files[0]; e.target.value=''; if(!f)return; processImg(f,d=>{ spLogoData=d; spLogoPreview(); },200); }
function spClearLogo(){ spLogoData=null; spLogoPreview(); }
function spRenderContacts(){ const box=$('#spContacts'); if(!box)return;
  box.innerHTML=spContactsState.map((c,i)=>`<div class="li" style="flex-wrap:wrap;gap:6px;align-items:center;border:1px solid var(--line,#e3e3e3);border-radius:10px;padding:8px;margin-bottom:8px">
    <div class="av" style="width:34px;height:34px;border-radius:50%;overflow:hidden;background:#eee">${c.photo?`<img src="${c.photo}" style="width:100%;height:100%;object-fit:cover">`:''}</div>
    <label class="btn" style="padding:5px 8px;font-size:11px;cursor:pointer">📷<input type="file" accept="image/*" hidden onchange="spContactPhoto(event,${i})"></label>
    <input placeholder="Nom & prénom" value="${escapeHtml(c.name)}" oninput="spContactsState[${i}].name=this.value" style="flex:1;min-width:130px" />
    <input placeholder="Fonction" value="${escapeHtml(c.role)}" oninput="spContactsState[${i}].role=this.value" style="flex:1;min-width:120px" />
    <input placeholder="E-mail" value="${escapeHtml(c.email)}" oninput="spContactsState[${i}].email=this.value" style="flex:1;min-width:130px" />
    <input placeholder="Téléphone" value="${escapeHtml(c.phone)}" oninput="spContactsState[${i}].phone=this.value" style="flex:1;min-width:110px" />
    <input placeholder="LinkedIn" value="${escapeHtml(c.linkedin)}" oninput="spContactsState[${i}].linkedin=this.value" style="flex:1;min-width:130px" />
    <button class="btn danger" type="button" onclick="spDelContact(${i})">✕</button></div>`).join('');
}
function spAddContact(data){ spContactsState.push(Object.assign({name:'',role:'',email:'',phone:'',linkedin:'',photo:null},data||{})); spRenderContacts(); }
function spDelContact(i){ spContactsState.splice(i,1); spRenderContacts(); }
function spContactPhoto(e,i){ const f=e.target.files&&e.target.files[0]; e.target.value=''; if(!f)return; processImg(f,d=>{ if(spContactsState[i]){ spContactsState[i].photo=d; spRenderContacts(); } },160); }
function adResetSponsorForm(){ ensureTierOptions();
  $('#spEditId').value=''; $('#spName').value=''; if($('#spTier'))$('#spTier').selectedIndex=0;
  $('#spDescFr').value=''; $('#spDescEn').value=''; $('#spWebsite').value=''; $('#spLinkedin').value=''; $('#spBrochure').value=''; $('#spVideo').value='';
  if($('#spFeatured'))$('#spFeatured').checked=false; spLogoData=null; spLogoPreview(); spContactsState=[]; spRenderContacts();
  if($('#spSaveBtn'))$('#spSaveBtn').textContent=lang==='fr'?'Enregistrer le partenaire':'Save partner'; }
function adEditSponsor(id){ const s=OAF.sponsors().find(x=>String(x.id)===String(id)); if(!s)return; ensureTierOptions();
  $('#spEditId').value=s.id; $('#spName').value=s.name||''; if($('#spTier'))$('#spTier').value=s.tier||SP_TIERS[5];
  $('#spDescFr').value=(s.desc&&s.desc.fr)||''; $('#spDescEn').value=(s.desc&&s.desc.en)||'';
  $('#spWebsite').value=s.website||''; $('#spLinkedin').value=s.linkedin||''; $('#spBrochure').value=s.brochure||''; $('#spVideo').value=s.video||'';
  if($('#spFeatured'))$('#spFeatured').checked=!!s.featured; spLogoData=s.logo||null; spLogoPreview();
  spContactsState=(s.contacts||[]).map(c=>Object.assign({},c)); spRenderContacts();
  if($('#spSaveBtn'))$('#spSaveBtn').textContent=lang==='fr'?'Mettre à jour':'Update';
  try{ $('#spName').scrollIntoView({behavior:'smooth',block:'center'}); }catch(_){} }
async function adSaveSponsor(){
  const name=$('#spName').value.trim(); if(!name){ adToast(lang==='fr'?'Le nom du partenaire est obligatoire.':'Partner name is required.'); return; }
  if(!L()){ adToast(lang==='fr'?'(démo) Connexion requise.':'(demo) Sign in required.'); return; }
  const sb=OAFAuth.client(), ev=evId();
  const rec={ event_id:ev, name, tier:$('#spTier').value,
    description:{fr:$('#spDescFr').value.trim(),en:($('#spDescEn').value.trim()||$('#spDescFr').value.trim())},
    website:$('#spWebsite').value.trim(), linkedin:$('#spLinkedin').value.trim(),
    brochure_url:$('#spBrochure').value.trim(), video_url:$('#spVideo').value.trim(),
    featured:$('#spFeatured').checked, logo_url:spLogoData||null };
  const editId=$('#spEditId').value; let sid=editId;
  if(editId){ const {error}=await sb.from('sponsors').update(rec).eq('id',editId); if(error){adToast(error.message);return;} }
  else { rec.sort_order=(OAF.sponsors().reduce((m,s)=>Math.max(m,s.sort||0),0))+1; const {data,error}=await sb.from('sponsors').insert(rec).select('id').single(); if(error){adToast(error.message);return;} sid=data.id; }
  await sb.from('sponsor_contacts').delete().eq('sponsor_id',sid);
  const cr=spContactsState.filter(c=>(c.name||'').trim()).map((c,i)=>({sponsor_id:sid,name:c.name.trim(),role:c.role||'',email:c.email||'',phone:c.phone||'',linkedin:c.linkedin||'',photo_url:c.photo||null,sort_order:i}));
  if(cr.length){ const {error:ce}=await sb.from('sponsor_contacts').insert(cr); if(ce){adToast(ce.message);} }
  await reloadAndRender(); adResetSponsorForm(); adToast(lang==='fr'?'Partenaire enregistré ✓':'Partner saved ✓');
}
async function adDelSponsor(id){ if(!confirm(lang==='fr'?'Supprimer ce partenaire et ses contacts ?':'Delete this partner and its contacts?'))return; if(!L())return; const {error}=await OAFAuth.client().from('sponsors').delete().eq('id',id); if(error){adToast(error.message);return;} await reloadAndRender(); adToast(lang==='fr'?'Supprimé ✓':'Deleted ✓'); }
async function adMoveSponsor(id,dir){ if(!L())return; const list=OAF.sponsors().slice().sort((a,b)=>(a.sort||0)-(b.sort||0)); const i=list.findIndex(s=>String(s.id)===String(id)); const j=i+dir; if(i<0||j<0||j>=list.length)return; const sb=OAFAuth.client(); const A=list[i],B=list[j]; await sb.from('sponsors').update({sort_order:(B.sort||0)}).eq('id',A.id); await sb.from('sponsors').update({sort_order:(A.sort||0)}).eq('id',B.id); await reloadAndRender(); }
async function adDupSponsor(id){ const evs=OAF.events().filter(e=>String(e.id)!==String(evId())); if(!evs.length){ adToast(lang==='fr'?'Aucun autre forum.':'No other event.'); return; }
  const menu=evs.map((e,i)=>`${i+1}) ${e.name}${e.cityShort?(' · '+e.cityShort):''}`).join('\n');
  const pick=prompt((lang==='fr'?'Dupliquer ce partenaire vers :\n':'Duplicate this partner to:\n')+menu); const n=parseInt(pick,10);
  if(isNaN(n)||n<1||n>evs.length)return; const target=evs[n-1].id; const s=OAF.sponsors().find(x=>String(x.id)===String(id)); if(!s||!L())return; const sb=OAFAuth.client();
  const rec={event_id:target,name:s.name,tier:s.tier,description:s.desc,website:s.website||'',linkedin:s.linkedin||'',brochure_url:s.brochure||'',video_url:s.video||'',featured:!!s.featured,logo_url:s.logo||null,sort_order:s.sort||0};
  const {data,error}=await sb.from('sponsors').insert(rec).select('id').single(); if(error){adToast(error.message);return;}
  if(s.contacts&&s.contacts.length){ await sb.from('sponsor_contacts').insert(s.contacts.map((c,i)=>({sponsor_id:data.id,name:c.name,role:c.role||'',email:c.email||'',phone:c.phone||'',linkedin:c.linkedin||'',photo_url:c.photo||null,sort_order:i}))); }
  adToast(lang==='fr'?'Partenaire dupliqué ✓':'Partner duplicated ✓'); }

/* ---- CSV import ---- */
function splitCsvLine(line){ const r=[]; let cur='',q=false; for(let i=0;i<line.length;i++){const ch=line[i]; if(ch==='"'){ if(q&&line[i+1]==='"'){cur+='"';i++;} else q=!q; } else if(ch===','&&!q){r.push(cur);cur='';} else cur+=ch;} r.push(cur); return r; }
function parseCsv(text){
  const lines=text.split(/\r?\n/).filter(l=>l.trim());
  if(!lines.length)return [];
  let start=0; if(/name|nom/i.test(lines[0]) && /role|fonction|pays|country/i.test(lines[0])) start=1;
  const out=[];
  for(let i=start;i<lines.length;i++){ const c=splitCsvLine(lines[i]); if(!c[0]||!c[0].trim())continue;
    out.push({ name:c[0].trim(), role:(c[1]||'').trim(), country:(c[2]||'').trim(), interests:(c[3]||'').trim(), email:(c[4]||'').trim() }); }
  return out;
}
/* ---- Import participants ROBUSTE : mapping par en-tête + validation e-mail + déduplication ---- */
function isValidEmail(e){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function splitCsvLineDelim(line, delim){ const r=[]; let cur='',q=false;
  for(let i=0;i<line.length;i++){ const ch=line[i];
    if(ch==='"'){ if(q&&line[i+1]==='"'){cur+='"';i++;} else q=!q; }
    else if(ch===delim&&!q){ r.push(cur); cur=''; } else cur+=ch; }
  r.push(cur); return r.map(x=>x.trim()); }
function parseParticipantsCsv(text){
  text=String(text||'').replace(/^﻿/,''); // retire le BOM
  const lines=text.split(/\r?\n/).filter(l=>l.trim().length);
  if(!lines.length) return {rows:[],invalid:0,dupInFile:0};
  const head=lines[0];
  const delim=(head.split(';').length>head.split(',').length)?';':',';
  const norm=s=>s.toLowerCase().replace(/[^a-z]/g,'');
  const H=splitCsvLineDelim(head,delim).map(norm);
  const col=(...names)=>{ for(const n of names){ const i=H.indexOf(n); if(i>=0) return i; } return -1; };
  const ix={ name:col('name','nom','nomprenom','prenomnom'),
    role:col('role','fonction','titre','poste','fonctionsociete'),
    country:col('country','pays'),
    interests:col('interests','interets','centresdinteret','tags','secteur'),
    email:col('email','courriel','mail','adresseemail','emailaddress') };
  const hasHeader = ix.name>=0;              // en-tête reconnu ?
  const start = hasHeader ? 1 : 0;            // sinon, repli en mode positionnel (compat)
  const get=(c,arr)=>(c>=0&&c<arr.length)?arr[c]:'';
  const seen=new Set(); let invalid=0, dupInFile=0; const rows=[];
  for(let li=start; li<lines.length; li++){
    const c=splitCsvLineDelim(lines[li],delim);
    let name,role,country,interests,email;
    if(hasHeader){ name=get(ix.name,c); role=get(ix.role,c); country=get(ix.country,c); interests=get(ix.interests,c); email=get(ix.email,c); }
    else { name=c[0]||''; role=c[1]||''; country=c[2]||''; interests=c[3]||''; email=c[4]||''; }
    name=(name||'').trim(); if(!name) continue;        // sans nom → ignoré
    email=(email||'').trim().toLowerCase();
    if(email && !isValidEmail(email)){ invalid++; email=''; } // e-mail cassé → ignoré (fiche gardée)
    if(email){ if(seen.has(email)){ dupInFile++; continue; } seen.add(email); } // doublon dans le fichier
    rows.push({ name, role:(role||'').trim(), country:(country||'').trim(),
      interests:(interests||'').split(/[,;]/).map(s=>s.trim()).filter(Boolean), email:email||null });
  }
  return {rows,invalid,dupInFile};
}
function adImportReport(imported, dups, invalid){
  const fr = imported+' importé(s)' + (dups?' · '+dups+' doublon(s) ignoré(s)':'') + (invalid?' · '+invalid+' e-mail(s) invalide(s)':'');
  const en = imported+' imported' + (dups?' · '+dups+' duplicate(s) skipped':'') + (invalid?' · '+invalid+' invalid email(s)':'');
  adToast(lang==='fr'?fr:en);
}
async function adImportCsv(e){
  const f=e.target.files[0]; if(!f)return;
  let text=''; try{ text=await f.text(); }catch(_){ text=await new Promise(res=>{const r=new FileReader();r.onload=()=>res(r.result);r.readAsText(f);}); }
  e.target.value='';
  const {rows,invalid,dupInFile}=parseParticipantsCsv(text);
  if(!rows.length){ adToast(a('csvEmpty')); return; }
  if(L()){
    const sb=OAFAuth.client(), ev=evId();
    // Déduplication contre les invités DÉJÀ importés sur CE forum (par e-mail).
    const existing=new Set();
    try{ const {data}=await sb.from('guests').select('email').eq('event_id',ev); (data||[]).forEach(g=>{ if(g.email) existing.add(String(g.email).toLowerCase()); }); }catch(_){}
    let dupDb=0; const recs=[];
    for(const x of rows){
      if(x.email && existing.has(x.email)){ dupDb++; continue; }
      recs.push({event_id:ev,name:x.name,email:x.email,role:{fr:x.role||'',en:x.role||''},country:x.country||'🌍',interests:x.interests});
    }
    if(recs.length){ const {error}=await sb.from('guests').insert(recs); if(error){adToast(error.message);return;} await reloadAndRender(); }
    adImportReport(recs.length, dupInFile+dupDb, invalid);
  } else {
    OAF.importAttendees(rows); renderPeople(); renderKpis();
    adImportReport(rows.length, dupInFile, invalid);
  }
}
async function adDelGuest(gid){ if(!confirm(a('confirmDel')))return; if(L()){ const {error}=await OAFAuth.client().from('guests').delete().eq('id',gid); if(error){adToast(error.message);return;} await reloadAndRender(); adToast(a('tDel')); } }
async function adClearGuests(){ if(!confirm(lang==='fr'?'Supprimer tous les participants importés de ce forum ?':'Delete all imported attendees of this forum?'))return; if(L()){ const {error}=await OAFAuth.client().from('guests').delete().eq('event_id',evId()); if(error){adToast(error.message);return;} await reloadAndRender(); adToast(a('tDel')); } }
function adCsvTemplate(){
  const csv='name,role,country,interests,email\nAmadou Diallo,CEO · SolarMali,🇲🇱,"Énergie, Climat",amadou@solarmali.com\nGrace Mwangi,Founder · AgriKenya,🇰🇪,"Agritech, Investissement",grace@agrikenya.co\nJoseph Banda,Investor · Lusaka Capital,🇿🇲,"Fintech, Seed",joseph@lusaka.capital\n';
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));
  const link=document.createElement('a'); link.href=url; link.download='participants_modele.csv'; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
}

/* helpers live */
function L(){ return window.OAF_LIVE && window.OAFAuth && OAFAuth.client(); }
function evId(){ return OAF.currentEvent() ? OAF.currentEvent().id : null; }
async function reloadAndRender(){ if(L()){ await adminHydrate(); } renderProgram(); renderNotifAdmin(); renderPeople(); renderKpis(); renderSettings(); }

/* actions */
function clearSessionForm(){ ['sTitle','sTitleEn','sRoom','sRoomEn','sTrack','sTrackEn'].forEach(id=>{const el=$('#'+id);if(el)el.value='';}); }
function adCancelEdit(){
  $('#sEditId').value=''; clearSessionForm();
  $('#sTime').value='14:30'; $('#sDur').value='45m';
  $('#pAddBtn').textContent=a('pAddBtn'); $('#pCancelBtn').style.display='none';
  renderLineupPicker(null);
}
function adEditSession(id){
  const s=OAF.get().sessions.find(x=>String(x.id)===String(id)); if(!s)return;
  $('#sEditId').value=id;
  $('#sTitle').value=(s.title&&s.title.fr)||''; $('#sTitleEn').value=(s.title&&s.title.en)||'';
  $('#sDay').value=s.day||0; $('#sTime').value=s.time||''; $('#sDur').value=s.dur||'';
  $('#sRoom').value=(s.room&&s.room.fr)||''; $('#sRoomEn').value=(s.room&&s.room.en)||'';
  $('#sTrack').value=(s.track&&s.track.fr)||''; $('#sTrackEn').value=(s.track&&s.track.en)||'';
  $('#pAddBtn').textContent=a('pUpdBtn'); $('#pCancelBtn').style.display='';
  lineupDraft=(s.lineup||[]).map(l=>({id:String(l.id),role:l.role}));
  renderLineupPicker(s);
  const top=$('#pAddT'); if(top&&top.scrollIntoView) top.scrollIntoView({behavior:'smooth',block:'start'});
}
let lineupDraft=[], lineupEditing=false;
function renderLineupPicker(s){
  const box=$('#sLineup'); if(!box) return;
  if(!s){ lineupEditing=false; lineupDraft=[]; box.innerHTML=`<div class="desc">${lang==='fr'?'Enregistrez la séance, puis cliquez ✎ dessus pour ajouter ses intervenants.':'Save the session, then click ✎ to add its speakers.'}</div>`; return; }
  lineupEditing=true;
  const spk=OAF.speakers();
  if(!spk.length){ box.innerHTML=`<div class="desc">${lang==='fr'?'Ajoutez d’abord des intervenants (onglet Personnes).':'Add speakers first (People tab).'}</div>`; return; }
  const byId=id=>spk.find(p=>String(p.id)===String(id));
  const rows=lineupDraft.map(l=>{ const p=byId(l.id); if(!p) return ''; const mod=l.role==='moderator';
    return `<div class="li" style="gap:8px"><div class="m"><b>${escapeHtml(p.name)} ${mod?`<span class="tag" style="background:#111;color:#fff;font-size:9px">${lang==='fr'?'Modérateur':'Moderator'}</span>`:''}</b><small>${escapeHtml(p.role[lang])} · ${escapeHtml(p.country)}</small></div>
      <button type="button" class="btn ${mod?'solid':''}" onclick="luSetMod('${p.id}')" title="${lang==='fr'?'Désigner modérateur':'Set moderator'}" style="padding:5px 10px;font-size:13px">⭐</button>
      <button type="button" class="btn danger" onclick="luRemove('${p.id}')" style="padding:5px 10px;font-size:13px">✕</button></div>`;
  }).join('');
  const assignedIds=lineupDraft.map(l=>String(l.id));
  const avail=spk.filter(p=>!assignedIds.includes(String(p.id)));
  const opts=`<option value="">${lang==='fr'?'＋ Ajouter un intervenant…':'＋ Add a speaker…'}</option>`+avail.map(p=>`<option value="${p.id}">${escapeHtml(p.name)} — ${escapeHtml(p.role[lang])}</option>`).join('');
  box.innerHTML=`${lineupDraft.length?rows:`<div class="desc">${lang==='fr'?'Aucun intervenant pour cette séance.':'No speakers for this session yet.'}</div>`}
    <div class="field" style="margin-top:8px"><select id="luAdd" onchange="luAdd(this.value)">${opts}</select></div>
    <div class="desc">${lang==='fr'?'⭐ = modérateur (un seul) · ✕ = retirer':'⭐ = moderator (one) · ✕ = remove'}</div>`;
}
function luAdd(id){ if(!id) return; if(!lineupDraft.some(l=>String(l.id)===String(id))) lineupDraft.push({id:String(id),role:'speaker'}); renderLineupPicker(true); }
function luRemove(id){ lineupDraft=lineupDraft.filter(l=>String(l.id)!==String(id)); renderLineupPicker(true); }
function luSetMod(id){ const cur=lineupDraft.find(l=>String(l.id)===String(id)); if(!cur) return; const wasMod=cur.role==='moderator'; lineupDraft.forEach(l=>l.role='speaker'); if(!wasMod) cur.role='moderator'; renderLineupPicker(true); }
function collectLineup(){ return lineupDraft.map(l=>({speaker_id:l.id,role:l.role})); }
async function adAutofillLineups(){
  if(!L()){ adToast(lang==='fr'?'Disponible en mode réel uniquement.':'Live mode only.'); return; }
  const speakers=OAF.speakers();
  if(!speakers.length){ adToast(lang==='fr'?'Importez d’abord les intervenants (onglet Personnes → Intervenants).':'Import speakers first (People → Speakers).'); return; }
  adToast(lang==='fr'?'Analyse des descriptions…':'Scanning descriptions…');
  const norm=s=>(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const sessions=OAF.sessions(evId()); let filled=0; const recs=[];
  sessions.forEach(s=>{
    if(s.lineup&&s.lineup.length) return;
    const d=norm(((s.desc&&s.desc.fr)||'')+' '+((s.desc&&s.desc.en)||''));
    if(!d) return;
    let modIdx=-1; ['moderateur','moderator','modere par'].forEach(k=>{const i=d.indexOf(k); if(i>=0&&(modIdx<0||i<modIdx)) modIdx=i;});
    const found=[];
    speakers.forEach(p=>{
      const clean=p.name.replace(/^(hon\.?|dr|col\.?|mme|m\.)\s+/i,'').trim();
      const parts=clean.split(/\s+/); const full=norm(clean); const first=norm(parts[0]||''), last=norm(parts[parts.length-1]||'');
      let pos=-1;
      if(full&&d.includes(full)) pos=d.indexOf(full);
      else if(last.length>3&&d.includes(last)&&first&&d.includes(first)) pos=d.indexOf(last);
      if(pos>=0) found.push({id:p.id,role:(modIdx>=0&&pos>=modIdx)?'moderator':'speaker'});
    });
    if(found.length){ filled++; found.forEach(f=>recs.push({session_id:s.id,speaker_id:f.id,role:f.role})); }
  });
  if(!recs.length){ adToast(lang==='fr'?'Aucun intervenant détecté (déjà fait ?).':'None detected (already done?).'); return; }
  const {error}=await OAFAuth.client().from('session_speakers').insert(recs);
  if(error){ adToast(error.message); return; }
  await reloadAndRender();
  adToast(lang==='fr'?('✓ '+filled+' séance(s) pré-remplie(s)'):('✓ '+filled+' session(s) prefilled'));
}
async function saveLineup(sessionId){ if(!L())return; const sb=OAFAuth.client(); await sb.from('session_speakers').delete().eq('session_id',sessionId); const recs=collectLineup().map(x=>({session_id:sessionId,speaker_id:x.speaker_id,role:x.role})); if(recs.length){ const {error}=await sb.from('session_speakers').insert(recs); if(error){adToast(error.message);} } }
async function adSaveSession(){
  const tfr=$('#sTitle').value.trim(); if(!tfr){adToast(a('needTitle'));return;}
  const pair=(fr,en)=>({fr:fr,en:(en||fr)});
  const editId=$('#sEditId').value;
  const fields={
    day:+$('#sDay').value, time:$('#sTime').value||'12:00', dur:$('#sDur').value||'45m',
    title:pair(tfr,$('#sTitleEn').value.trim()),
    room:pair($('#sRoom').value.trim()||'—',$('#sRoomEn').value.trim()),
    track:pair($('#sTrack').value.trim()||'—',$('#sTrackEn').value.trim())
  };
  if(L()){
    const sb=OAFAuth.client();
    if(editId){
      const {error}=await sb.from('sessions').update({day:fields.day,time:fields.time,dur:fields.dur,title:fields.title,room:fields.room,track:fields.track}).eq('id',editId);
      if(error){adToast(error.message);return;}
      await saveLineup(editId);
      adCancelEdit(); await reloadAndRender(); adToast(a('tUpd'));
    } else {
      const {error}=await sb.from('sessions').insert(Object.assign({event_id:evId(),color:'#5b8def',description:{fr:'',en:''}},fields));
      if(error){adToast(error.message);return;}
      clearSessionForm(); await reloadAndRender(); adToast(a('tAdd'));
    }
  } else {
    if(editId){ OAF.updateSession(editId,fields); adCancelEdit(); }
    else { OAF.addSession(Object.assign({color:'#5b8def',desc:{fr:'',en:''}},fields)); clearSessionForm(); }
    renderProgram(); renderKpis(); adToast(a(editId?'tUpd':'tAdd'));
  }
}

/* ---- import du programme (CSV bilingue) ---- */
function parseProgramCsv(text){
  text=text.replace(/^﻿/,'');
  const lines=text.split(/\r?\n/).filter(l=>l.trim().length);
  if(!lines.length)return [];
  const head=lines[0];
  const delim=(head.split(';').length>head.split(',').length)?';':',';
  const split=line=>{const r=[];let cur='',q=false;for(let i=0;i<line.length;i++){const ch=line[i];if(ch==='"'){if(q&&line[i+1]==='"'){cur+='"';i++;}else q=!q;}else if(ch===delim&&!q){r.push(cur);cur='';}else cur+=ch;}r.push(cur);return r.map(x=>x.trim());};
  const norm=s=>s.toLowerCase().replace(/[^a-z]/g,'');
  const H=split(head).map(norm);
  const col=(...names)=>{for(const n of names){const i=H.indexOf(n);if(i>=0)return i;}return -1;};
  const ix={ day:col('jour','day'), time:col('heure','time','horaire'), dur:col('duree','dur','duration'),
    tfr:col('titrefr','titlefr','titre','title'), ten:col('titreen','titleen'),
    rfr:col('sallefr','roomfr','salle','room'), ren:col('salleen','roomen'),
    kfr:col('themefr','trackfr','theme','track'), ken:col('themeen','tracken'),
    dfr:col('descriptionfr','descfr','description','desc'), den:col('descriptionen','descen'),
    color:col('couleur','color') };
  if(ix.tfr<0)return []; // en-tête non reconnu
  const palette=['#1E8C5A','#13476b','#1B998B','#9a6b00','#E2622C','#5b8def','#b5559a','#111111'];
  const trackColor={}; let ci=0;
  const get=(c,arr)=>(c>=0&&c<arr.length)?arr[c]:'';
  const out=[];
  for(let li=1;li<lines.length;li++){
    const c=split(lines[li]);
    const tfr=get(ix.tfr,c); if(!tfr)continue;
    const kfr=get(ix.kfr,c)||'—'; const ken=get(ix.ken,c)||kfr;
    let jour=parseInt(get(ix.day,c),10); if(isNaN(jour))jour=1; const day=Math.max(0,jour-1);
    let color=get(ix.color,c);
    if(!color){const key=ken||kfr; if(!trackColor[key]){trackColor[key]=palette[ci%palette.length];ci++;} color=trackColor[key];}
    const rfr=get(ix.rfr,c)||'—'; const dfr=get(ix.dfr,c);
    out.push({ day, time:get(ix.time,c)||'12:00', dur:get(ix.dur,c)||'45m', color,
      title:{fr:tfr,en:get(ix.ten,c)||tfr}, room:{fr:rfr,en:get(ix.ren,c)||rfr},
      track:{fr:kfr,en:ken}, desc:{fr:dfr,en:get(ix.den,c)||dfr} });
  }
  return out;
}
async function adImportProgram(e){
  const f=e.target.files[0]; if(!f)return;
  let text='';
  try{ text=await f.text(); }
  catch(_){ text=await new Promise(res=>{const r=new FileReader();r.onload=()=>res(r.result);r.readAsText(f);}); }
  e.target.value='';
  const rows=parseProgramCsv(text);
  if(!rows.length){ adToast(a('csvEmpty')); return; }
  const replace=$('#pImpReplace').checked;
  if(replace&&!confirm(a('confirmReplace')))return;
  if(L()){
    const sb=OAFAuth.client(); const ev=evId();
    if(replace){ const {error:de}=await sb.from('sessions').delete().eq('event_id',ev); if(de){adToast(de.message);return;} }
    const recs=rows.map(r=>({event_id:ev,day:r.day,time:r.time,dur:r.dur,color:r.color,title:r.title,room:r.room,track:r.track,description:r.desc}));
    const {error}=await sb.from('sessions').insert(recs);
    if(error){ adToast(error.message); return; }
    await reloadAndRender();
  } else {
    if(replace){ OAF.get().sessions.filter(s=>String(s.ev)===String(evId())).slice().forEach(s=>OAF.removeSession(s.id)); }
    rows.forEach(r=>OAF.addSession({day:r.day,time:r.time,dur:r.dur,color:r.color,title:r.title,room:r.room,track:r.track,desc:r.desc}));
    renderProgram(); renderKpis();
  }
  $('#pImpReplace').checked=false;
  adToast(a('tProgImp').replace('{n}',rows.length));
}
function adProgramTemplate(){
  const rows=[
    ['jour','heure','duree','titre_fr','titre_en','salle_fr','salle_en','theme_fr','theme_en','description_fr','description_en','couleur'],
    ['1','09:00','30m','Ouverture & bienvenue','Opening & welcome','Grande scène','Main Stage','Plénière','Plenary','Le Président ouvre le forum.','The Chair opens the forum.',''],
    ['1','09:30','60m','Keynote : financer la ZLECAf','Keynote: Financing the AfCFTA','Grande scène','Main Stage','Investissement','Investment','Capital public & privé.','Public & private capital.',''],
    ['2','10:30','45m','Transition énergétique','Energy transition','Salle A','Room A','Énergie','Energy','Financer la transition juste.','Financing a just transition.','']
  ];
  const esc=v=>/[",;\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v;
  const csv='﻿'+rows.map(r=>r.map(esc).join(',')).join('\r\n')+'\r\n';
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
  const link=document.createElement('a'); link.href=url; link.download='programme_modele.csv'; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
}
function adDelSession(id){
  if(!confirm(a('confirmDel'))) return;
  if(L()){ OAFAuth.client().from('sessions').delete().eq('id',id).then(({error})=>{ if(error){adToast(error.message);return;} reloadAndRender(); adToast(a('tDel')); }); }
  else { OAF.removeSession(id); renderProgram(); renderKpis(); adToast(a('tDel')); }
}
function adSendNotif(){
  const m=$('#nMsg').value.trim(); if(!m){adToast(a('needMsg'));return;}
  if(L()){ OAFAuth.client().from('notifications').insert({event_id:evId(),icon:$('#nIcon').value,title:{fr:m,en:m}}).then(({error})=>{ if(error){adToast(error.message);return;} $('#nMsg').value=''; reloadAndRender(); adToast(a('tNotif')); }); }
  else { OAF.addNotification({icon:$('#nIcon').value,title:{fr:m,en:m}}); $('#nMsg').value=''; renderNotifAdmin(); renderKpis(); adToast(a('tNotif')); }
}
async function adSendInvites(){
  if(!L()){ adToast(lang==='fr'?'Disponible uniquement sur la base réelle.':'Available on the live database only.'); return; }
  const raw=$('#invEmails').value||'';
  const emails=raw.split(/[\s,;]+/).map(e=>e.trim().toLowerCase()).filter(e=>e.indexOf('@')>0);
  if(!emails.length){ adToast(lang==='fr'?'Ajoutez au moins une adresse.':'Add at least one address.'); return; }
  const ev=OAF.currentEvent&&OAF.currentEvent(); const name=(ev&&ev.name)||'OneAfricaForums';
  const btn=$('#invBtn'); if(btn){ btn.disabled=true; btn.textContent='…'; }
  try{
    const {data,error}=await OAFAuth.client().rpc('send_event_invites',{
      emails, event_name:name, app_url:($('#invUrl').value||'').trim()||location.origin,
      event_id:(ev&&typeof ev.id==='number')?ev.id:null, from_email:($('#invFrom').value||'').trim()||undefined
    });
    if(error) throw error;
    const n=(data&&data.sent)||emails.length;
    $('#invEmails').value='';
    adToast((lang==='fr'?'Invitations envoyées : ':'Invitations sent: ')+n+' ✉️');
  }catch(e){ adToast(e.message||String(e)); }
  finally{ if(btn){ btn.disabled=false; btn.textContent='📨 '+(lang==='fr'?'Envoyer les invitations':'Send invitations'); } }
}
/* Santé e-mail : envoie 1 test à sa propre adresse + lit le VRAI statut Resend
   (200 = OK, 401 = clé invalide…). Rend tout échec immédiatement visible. */
async function adEmailTest(){
  if(!L()){ adToast(lang==='fr'?'Base réelle uniquement.':'Live database only.'); return; }
  const u=OAFAuth.user&&OAFAuth.user(); const email=u&&u.email;
  if(!email){ adToast(lang==='fr'?'Connexion requise.':'Sign in required.'); return; }
  const btn=$('#emTestBtn'); if(btn){ btn.disabled=true; btn.textContent=lang==='fr'?'Envoi…':'Sending…'; }
  try{
    const sb=OAFAuth.client();
    const {error}=await sb.rpc('invite_event_guests',{ p_event: evId(), p_only: email,
      app_url:($('#invUrl').value||'').trim()||'https://app.oneafricaforums.com/app/' });
    if(error) throw error;
    if(btn) btn.textContent=lang==='fr'?'Vérification…':'Checking…';
    await new Promise(r=>setTimeout(r,4500)); // laisse pg_net traiter la requête
    const {data,error:e2}=await sb.rpc('email_last_status');
    if(e2) throw e2;
    const row=(data&&data[0])||null;
    if(!row){ adToast(lang==='fr'?'Envoyé. Statut pas encore prêt — réessaie dans 5 s.':'Sent. Status not ready — retry in 5s.'); }
    else if(row.status_code>=200 && row.status_code<300){ adToast('✅ Resend OK ('+row.status_code+') — e-mail envoyé à '+email); }
    else { adToast('❌ Resend '+row.status_code+' : '+String(row.reponse||'').slice(0,90)); }
  }catch(e){ adToast(e.message||String(e)); }
  finally{ if(btn){ btn.disabled=false; btn.textContent='🩺 '+(lang==='fr'?"Tester l'e-mail (Resend)":'Test email (Resend)'); } }
}
/* 1 clic : invite TOUS les participants importés (guests) du forum actif.
   Les e-mails sont lus côté serveur (fonction SECURITY DEFINER) — l'admin n'a
   pas à les coller, et ils restent masqués dans la console. */
async function adInviteAllGuests(){
  if(!L()){ adToast(lang==='fr'?'Disponible sur la base réelle uniquement.':'Live database only.'); return; }
  const btn=$('#invAllBtn'); if(btn){ btn.disabled=true; btn.textContent='…'; }
  try{
    const sb=OAFAuth.client();
    const {data:emails,error:e1}=await sb.rpc('guest_emails',{ p_event: evId() });
    if(e1) throw e1;
    const list=(emails||[]).filter(Boolean);
    if(!list.length){ adToast(lang==='fr'?'Aucun e-mail importé sur ce forum.':'No imported emails for this event.'); return; }
    if(!confirm((lang==='fr'?'Envoyer une invitation NOMINATIVE à ':'Send a personalized invitation to ')+list.length+(lang==='fr'?' participants importés ?':' imported attendees?'))) { if(btn){btn.disabled=false;btn.textContent=lang==='fr'?'👥 Inviter tous les participants importés':'👥 Invite all imported attendees';} return; }
    const {data,error}=await sb.rpc('invite_event_guests',{
      p_event: evId(),
      app_url:($('#invUrl').value||'').trim()||'https://app.oneafricaforums.com/app/'
    });
    if(error) throw error;
    adToast((lang==='fr'?'Invitations envoyées : ':'Invitations sent: ')+((data&&data.sent)||list.length)+' ✉️');
  }catch(e){ adToast(e.message||String(e)); }
  finally{ if(btn){ btn.disabled=false; btn.textContent=lang==='fr'?'👥 Inviter tous les participants importés':'👥 Invite all imported attendees'; } }
}
async function adShowQR(){
  const url=($('#qrUrl').value||'').trim()||location.origin; const box=$('#qrBox'); if(!box)return;
  box.textContent='…';
  try{
    const mod=await import('https://esm.sh/qrcode@1.5.3'); const QR=mod.default||mod;
    const data=await QR.toDataURL(url,{width:480,margin:2,color:{dark:'#111111',light:'#ffffff'}});
    box.innerHTML='<img src="'+data+'" alt="QR" style="width:240px;height:240px;border-radius:14px;border:1px solid var(--line);background:#fff"/>'
      +'<div class="desc" style="margin-top:8px;word-break:break-all">'+url+'</div>'
      +'<div class="desc">'+(lang==='fr'?'Appui long sur l’image pour l’enregistrer, ou imprimez cette page.':'Long-press the image to save, or print this page.')+'</div>';
  }catch(e){ box.textContent=(lang==='fr'?'QR indisponible (hors-ligne ?) : ':'QR unavailable (offline?): ')+(e.message||e); }
}
function adAddSpeaker(){
  const n=$('#spkName').value.trim(); if(!n)return; const r=$('#spkRole').value||'—';
  if(L()){ OAFAuth.client().from('speakers').insert({event_id:evId(),name:n,role:{fr:r,en:r},country:'🌍'}).then(({error})=>{ if(error){adToast(error.message);return;} $('#spkName').value='';$('#spkRole').value=''; reloadAndRender(); adToast(a('tSpk')); }); }
  else { OAF.addSpeaker({name:n,role:{fr:r,en:r},country:'🌍',color:'#5b8def'}); $('#spkName').value='';$('#spkRole').value=''; renderPeople(); renderKpis(); adToast(a('tSpk')); }
}
function adImportSpeakers(e){ const f=e.target.files[0]; if(!f)return; const r=new FileReader();
  r.onload=async ()=>{ const rows=parseCsv(r.result); if(!rows.length){adToast(a('csvEmpty'));return;}
    if(L()){
      const ev=evId();
      const recs=rows.map(x=>({event_id:ev,name:x.name,role:{fr:x.role||'',en:x.role||''},country:x.country||'🌍',bio:{fr:x.interests||'',en:x.interests||''}}));
      const {error}=await OAFAuth.client().from('speakers').insert(recs);
      if(error){adToast(error.message);return;}
      await reloadAndRender();
    } else { rows.forEach(x=>OAF.addSpeaker({name:x.name,role:{fr:x.role||'',en:x.role||''},country:x.country||'🌍',color:'#5b8def'})); renderPeople(); renderKpis(); }
    adToast(a('tImport').replace('{n}',rows.length)); };
  r.readAsText(f); e.target.value=''; }
function adSpeakerTemplate(){
  const csv='﻿name,role,country,bio\r\nDominique Lafont,CEO · Lafont Africa Corporation,🇫🇷,"Expert des infrastructures portuaires africaines."\r\nAmina Okonkwo,Chef économiste · BAD,🇳🇬,"Spécialiste du financement des infrastructures."\r\n';
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
  const link=document.createElement('a'); link.href=url; link.download='intervenants_modele.csv'; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
}
function adDelSpeaker(id){
  if(!confirm(a('confirmDel'))) return;
  if(L()){ OAFAuth.client().from('speakers').delete().eq('id',id).then(({error})=>{ if(error){adToast(error.message);return;} reloadAndRender(); adToast(a('tDel')); }); }
  else { OAF.get().speakers=OAF.get().speakers.filter(s=>String(s.id)!==String(id)); renderPeople(); renderKpis(); adToast(a('tDel')); }
}
function adSetEvent(){ OAF.setCurrentEvent($('#setEvent').value); renderAll(); adToast(a('tEvent')); }
function adReset(){ if(L()){ adToast(lang==='fr'?'Reset désactivé en mode réel':'Reset disabled in live mode'); return; } OAF.reset(); lang=OAF.lang(); renderAll(); adToast(a('tReset')); }
function adToggleLang(){ lang=lang==='fr'?'en':'fr'; OAF.setLang(lang); renderAll(); }

/* ===== mode réel : auth admin + chargement depuis Supabase ===== */
async function adminHydrate(){
  const sb=OAFAuth.client(); if(!sb) return;
  try{
    const palette=['#5b8def','#1B998B','#b5559a','#9a6b00','#E2622C','#13476b'];
    const tops=['linear-gradient(135deg,#1c1c1c,#000)','linear-gradient(135deg,#0f6e4f,#1B998B)','linear-gradient(135deg,#13476b,#2f7bb0)','linear-gradient(135deg,#7a3b12,#c2691e)'];
    const [ev,se,sp,po,no,prof,ea,gu,ss,rep,sc]=await Promise.all([
      sb.from('events').select('*'),
      sb.from('sessions').select('*'),
      sb.from('speakers').select('*'),
      sb.from('sponsors').select('*'),
      sb.from('notifications').select('*').order('created_at',{ascending:false}),
      sb.from('profiles').select('*'),
      sb.from('event_attendees').select('event_id,profile_id'),
      sb.from('guests').select('id,event_id,name,role,country,interests,looking_for'),
      sb.from('session_speakers').select('session_id,speaker_id,role'),
      sb.from('reports').select('*').order('created_at',{ascending:false}),
      sb.from('sponsor_contacts').select('*')
    ]);
    adNames={}; ((prof&&prof.data)||[]).forEach(p=>{ adNames[p.id]=p.name||'—'; });
    adReports=(rep&&!rep.error&&rep.data)||[];
    const eaMap={}; ((ea&&ea.data)||[]).forEach(r=>{ (eaMap[r.profile_id]=eaMap[r.profile_id]||[]).push(r.event_id); });
    const ssMap={}; ((ss&&ss.data)||[]).forEach(r=>{ (ssMap[r.session_id]=ssMap[r.session_id]||[]).push({id:r.speaker_id,role:r.role}); });
    const order={live:0,upcoming:1,past:2};
    const events=(ev.data||[]).map((e,i)=>({id:e.id,name:e.name,city:e.city||'',cityShort:e.city_short||'',status:e.status||'upcoming',starts:e.starts_at||null,ends:e.ends_at||null,auto:!!e.auto_status,dates:e.dates||{fr:'',en:''},theme:e.theme||{fr:'',en:''},cover:e.cover_url||null,info:e.info||{},top:tops[i%tops.length]})).sort((a,b)=>(order[a.status]??9)-(order[b.status]??9));
    const sessions=(se.data||[]).map(s=>({id:s.id,ev:s.event_id,day:s.day||0,time:s.time||'',dur:s.dur||'',title:s.title||{fr:'',en:''},room:s.room||{fr:'',en:''},track:s.track||{fr:'',en:''},desc:s.description||{fr:'',en:''},color:s.color||'#5b8def',star:false,sp:[],lineup:ssMap[s.id]||[]}));
    const speakers=(sp.data||[]).map((s,i)=>({id:s.id,ev:s.event_id,name:s.name,role:s.role||{fr:'',en:''},country:s.country||'🌍',color:palette[i%palette.length],bio:s.bio||{fr:'',en:''},tags:s.tags||[],ses:{fr:[],en:[]}}));
    const scMap={}; ((sc&&sc.data)||[]).forEach(c=>{ (scMap[c.sponsor_id]=scMap[c.sponsor_id]||[]).push(c); });
    Object.values(scMap).forEach(arr=>arr.sort((x,y)=>(x.sort_order||0)-(y.sort_order||0)));
    const sponsors=(po.data||[]).map((s,i)=>({id:s.id,ev:s.event_id,name:s.name,tier:s.tier||'Sponsor',color:s.color||palette[i%palette.length],tc:'#fff',role:s.role||{fr:'',en:''},desc:s.description||{fr:'',en:''},booth:s.booth||{fr:'',en:''},reps:{fr:[],en:[]},logo:s.logo_url||null,website:s.website||'',linkedin:s.linkedin||'',brochure:s.brochure_url||'',video:s.video_url||'',featured:!!s.featured,sort:s.sort_order||0,contacts:(scMap[s.id]||[]).map(c=>({id:c.id,name:c.name,role:c.role||'',email:c.email||'',phone:c.phone||'',linkedin:c.linkedin||'',photo:c.photo_url||null}))})).sort((a,b)=>(a.sort||0)-(b.sort||0));
    const attendees=(prof.data||[]).map((p,i)=>({id:p.id,name:p.name||'—',role:p.role||{fr:'',en:''},country:p.country||'🌍',color:palette[i%palette.length],score:80,why:p.looking_for||{fr:'',en:''},look:p.looking_for||{fr:'',en:''},tags:p.interests||[],evs:eaMap[p.id]||[]}));
    ((gu&&gu.data)||[]).forEach((g,i)=>{ attendees.push({id:'g_'+g.id,gid:g.id,guest:true,name:g.name||'—',role:g.role||{fr:'',en:''},country:g.country||'🌍',color:palette[(attendees.length+i)%palette.length],score:75,why:g.looking_for||{fr:'',en:''},look:g.looking_for||{fr:'',en:''},tags:g.interests||[],evs:[g.event_id]}); });
    const notifications=(no.data||[]).map(n=>({id:n.id,icon:n.icon||'🔔',ts:new Date(n.created_at).getTime(),title:n.title||{fr:'',en:''}}));
    OAF.loadServer({ events:events.length?events:undefined, sessions, speakers, sponsors, attendees, notifications });
  }catch(e){ console.warn('adminHydrate', e); }
}
async function bootstrapAdminAuth(){
  $('#loginWrap').style.display='none';
  await OAFAuth.ready();
  const gate=$('#adAuthGate');
  async function refresh(){
    const u=OAFAuth.user();
    if(!u){ gate.classList.add('on'); $('#console').style.display='none'; return; }
    let admin=false;
    try{ const {data}=await OAFAuth.client().from('profiles').select('is_admin').eq('id',u.id).single(); admin=data&&data.is_admin; }catch(e){}
    if(!admin){ gate.classList.add('on'); $('#adAuthMsg').textContent=lang==='fr'?"Ce compte n'a pas les droits administrateur.":'This account is not an admin.'; return; }
    gate.classList.remove('on'); $('#console').style.display='block';
    await adminHydrate(); renderAll();
  }
  OAFAuth.onChange(refresh); refresh();
}
function adAuthSend(){ const e=$('#adEmail').value.trim(); if(!e)return; $('#adAuthMsg').textContent='…'; OAFAuth.sendCode(e).then(({error})=>{ if(error){$('#adAuthMsg').textContent=error.message;return;} $('#adAuthStep2').style.display='block'; $('#adAuthMsg').textContent=lang==='fr'?'Code envoyé ✉️':'Code sent ✉️'; }); }
function adAuthVerify(){ const e=$('#adEmail').value.trim(),c=$('#adCode').value.trim(); if(!c)return; OAFAuth.verify(e,c).then(({error})=>{ if(error)$('#adAuthMsg').textContent=error.message; }); }
function adLogout(){ if(L()){ OAFAuth.signOut(); location.reload(); return; } sessionStorage.removeItem('oaf_admin'); $('#console').style.display='none'; $('#loginWrap').style.display='block'; }

document.getElementById('adnav').addEventListener('click', e=>{const b=e.target.closest('button[data-p]');if(b)nav(b.dataset.p);});
const _ce=document.getElementById('coverEvent'); if(_ce) _ce.addEventListener('change', updateCoverPreview);

/* init */
renderLabels();
paintBrand();
if(window.OAF_LIVE){ bootstrapAdminAuth(); }
else if(sessionStorage.getItem('oaf_admin')==='1'){ showConsole(); }
