/* OAF Connect — admin console logic (writes to the shared OAF store) */
const AL = {
  fr: { nDash:'Tableau de bord', nProgram:'Programme', nNotif:'Notifications', nPeople:'Participants', nSettings:'Réglages',
    lgT:'Espace organisateur', lgS:"Réservé à l'équipe OneAfricaForums.", lgBtn:'Se connecter', openApp:"Voir l'app ↗",
    dEngageT:'Engagement en direct', dEngageS:"Mis à jour en temps réel d'après l'activité dans l'app.",
    pAddT:'Ajouter une session', pAddS:"Elle apparaît immédiatement dans le programme de l'app.", pAddBtn:'＋ Ajouter la session',
    pListT:'Programme actuel', fTitle:'Titre', fDay:'Jour', fTime:'Heure', fRoom:'Salle', fTrack:'Thème', fDur:'Durée',
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
    pAddT:'Add a session', pAddS:'It appears instantly in the app program.', pAddBtn:'＋ Add session',
    pListT:'Current program', fTitle:'Title', fDay:'Day', fTime:'Time', fRoom:'Room', fTrack:'Track', fDur:'Duration',
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
  [['#lgT','lgT'],['#lgS','lgS'],['#lgBtn','lgBtn'],['#openApp','openApp'],['#dEngageT','dEngageT'],['#dEngageS','dEngageS'],['#pAddT','pAddT'],['#pAddS','pAddS'],['#pAddBtn','pAddBtn'],['#pListT','pListT'],['#fTitle','fTitle'],['#fDay','fDay'],['#fTime','fTime'],['#fRoom','fRoom'],['#fTrack','fTrack'],['#fDur','fDur'],['#nSendT','nSendT'],['#nSendS','nSendS'],['#nSendBtn','nSendBtn'],['#nHistT','nHistT'],['#fIcon','fIcon'],['#fMsg','fMsg'],['#peSpkT','peSpkT'],['#peSpkBtn','peSpkBtn'],['#peAttT','peAttT'],['#peSpoT','peSpoT'],['#setEvT','setEvT'],['#setEvS','setEvS'],['#setRT','setRT'],['#setRS','setRS'],['#setRBtn','setRBtn'],['#setOut','setOut'],
   ['#peImpS','peImpS'],['#peTplBtn','peTplBtn'],['#peSpoS','peSpoS'],['#setBrandT','setBrandT'],['#setBrandS','setBrandS'],['#setLogoClr','setLogoClr'],['#setCoverT','setCoverT'],['#setCoverS','setCoverS'],['#setCoverClr','setCoverClr']
  ].forEach(([sel,k])=>{const el=$(sel);if(el)el.textContent=a(k);});
  // buttons that contain a hidden <input>: only translate the leading text node
  [['#peImpBtn','peImpBtn'],['#setLogoBtn','setLogoBtn'],['#setCoverBtn','setCoverBtn']].forEach(([sel,k])=>{const el=$(sel);if(el&&el.childNodes[0])el.childNodes[0].nodeValue=a(k);});
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
    html+=ss.map(s=>`<div class="li"><div class="av" style="width:38px;height:38px;border-radius:10px;background:${s.color}">🗓️</div><div class="m"><b>${s.time} · ${s.title[lang]}</b><small>${s.room[lang]} · ${s.track[lang]} · ${s.dur}</small></div><button class="btn danger" onclick="adDelSession(${s.id})">✕</button></div>`).join('');
  });
  $('#progList').innerHTML=html||`<div class="empty">${a('empty')}</div>`;
}
function renderNotifAdmin(){
  const list=OAF.notifications();
  $('#notifList').innerHTML=list.length?list.map(n=>`<div class="li"><div class="av" style="width:38px;height:38px;border-radius:10px;background:#FFF4BF;color:#111">${n.icon||'🔔'}</div><div class="m"><b>${n.title[lang]||n.title.en||n.title}</b><small>${new Date(n.ts).toLocaleString()}</small></div></div>`).join(''):`<div class="empty">${a('empty')}</div>`;
}
function renderPeople(){
  $('#spkList').innerHTML=OAF.speakers().map(s=>`<div class="li"><div class="av" style="width:38px;height:38px;background:${s.color}">${ini(s.name)}</div><div class="m"><b>${s.name}</b><small>${s.role[lang]} · ${s.country}</small></div></div>`).join('');
  $('#attList').innerHTML=OAF.attendees().map(p=>`<div class="li"><div class="av" style="width:38px;height:38px;background:${p.color}">${ini(p.name)}</div><div class="m"><b>${p.name}</b><small>${p.role[lang]} · ${p.country}</small></div><span class="tag match">${p.score}</span></div>`).join('');
  $('#spoList').innerHTML=OAF.sponsors().map(s=>`<div class="li"><div class="av" style="width:38px;height:38px;border-radius:10px;background:${s.logo?'#fff':s.color};color:${s.tc};overflow:hidden">${s.logo?`<img src="${s.logo}" style="width:100%;height:100%;object-fit:cover">`:ini(s.name)}</div><div class="m"><b>${s.name}</b></div><label class="btn" style="padding:6px 10px;font-size:12px;margin-right:6px">${a('sponsorLogoBtn')}<input type="file" accept="image/*" hidden onchange="adSponsorLogo(event,${s.id})"></label><span class="tag ${s.tier==='PLATINUM'?'p':s.tier==='GOLD'?'gold':''}">${s.tier}</span></div>`).join('');
}
const DEFAULT_LOGO='<svg class="oa" viewBox="0 0 400 400"><rect width="400" height="400" rx="72" fill="#FFE400"/><text x="200" y="237" text-anchor="middle" fill="#111" font-family="\'Arial Black\',Arial,sans-serif" font-weight="900" font-size="188">one</text><text x="203" y="306" text-anchor="middle" fill="#111" font-family="Arial,sans-serif" font-weight="700" font-size="55" letter-spacing="11">AFRICA</text></svg>';
const logoMarkup=d=>d?`<img src="${d}" style="width:100%;height:100%;object-fit:cover">`:DEFAULT_LOGO;
function paintBrand(){const el=$('#adLogo');if(el)el.innerHTML=logoMarkup(OAF.appLogo());}
function updateCoverPreview(){const sel=$('#coverEvent');if(!sel)return;const e=OAF.events().find(x=>x.id===+sel.value);const cv=e&&e.cover;$('#coverPreview').innerHTML=cv?`<img src="${cv}" style="width:100%;height:100%;object-fit:cover">`:'';}
function renderSettings(){
  $('#setEvent').innerHTML=OAF.events().map(e=>`<option value="${e.id}" ${e.id===OAF.currentEvent().id?'selected':''}>${e.name}</option>`).join('');
  $('#coverEvent').innerHTML=OAF.events().map(e=>`<option value="${e.id}">${e.name}</option>`).join('');
  paintBrand();
  $('#brandPreview').innerHTML=logoMarkup(OAF.appLogo());
  updateCoverPreview();
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
function adSetCover(e){ const f=e.target.files[0]; if(!f)return; const id=+$('#coverEvent').value; processImg(f,d=>{OAF.setEventCover(id,d);renderSettings();adToast(a('tCover'));},560); e.target.value=''; }
function adClearCover(){ OAF.setEventCover(+$('#coverEvent').value,null); renderSettings(); adToast(a('tCover')); }
function adSponsorLogo(e,id){ const f=e.target.files[0]; if(!f)return; processImg(f,d=>{OAF.setSponsorLogo(id,d);renderPeople();adToast(a('tSponsorLogo'));},160); e.target.value=''; }

/* ---- CSV import ---- */
function splitCsvLine(line){ const r=[]; let cur='',q=false; for(let i=0;i<line.length;i++){const ch=line[i]; if(ch==='"'){ if(q&&line[i+1]==='"'){cur+='"';i++;} else q=!q; } else if(ch===','&&!q){r.push(cur);cur='';} else cur+=ch;} r.push(cur); return r; }
function parseCsv(text){
  const lines=text.split(/\r?\n/).filter(l=>l.trim());
  if(!lines.length)return [];
  let start=0; if(/name|nom/i.test(lines[0]) && /role|fonction|pays|country/i.test(lines[0])) start=1;
  const out=[];
  for(let i=start;i<lines.length;i++){ const c=splitCsvLine(lines[i]); if(!c[0]||!c[0].trim())continue;
    out.push({ name:c[0].trim(), role:(c[1]||'').trim(), country:(c[2]||'').trim(), interests:(c[3]||'').trim() }); }
  return out;
}
function adImportCsv(e){ const f=e.target.files[0]; if(!f)return; const r=new FileReader();
  r.onload=()=>{ const rows=parseCsv(r.result); if(!rows.length){adToast(a('csvEmpty'));return;} const n=OAF.importAttendees(rows); renderPeople(); renderKpis(); adToast(a('tImport').replace('{n}',n)); };
  r.readAsText(f); e.target.value=''; }
function adCsvTemplate(){
  const csv='name,role,country,interests\nAmadou Diallo,CEO · SolarMali,🇲🇱,"Énergie, Climat"\nGrace Mwangi,Founder · AgriKenya,🇰🇪,"Agritech, Investissement"\nJoseph Banda,Investor · Lusaka Capital,🇿🇲,"Fintech, Seed"\n';
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));
  const link=document.createElement('a'); link.href=url; link.download='participants_modele.csv'; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
}

/* helpers live */
function L(){ return window.OAF_LIVE && window.OAFAuth && OAFAuth.client(); }
function evId(){ return OAF.currentEvent() ? OAF.currentEvent().id : null; }
async function reloadAndRender(){ if(L()){ await adminHydrate(); } renderProgram(); renderNotifAdmin(); renderPeople(); renderKpis(); renderSettings(); }

/* actions */
function adAddSession(){
  const title=$('#sTitle').value.trim(); if(!title){adToast(a('needTitle'));return;}
  const txt=v=>({fr:v,en:v});
  if(L()){
    const rec={ event_id:evId(), day:+$('#sDay').value, time:$('#sTime').value||'12:00', dur:$('#sDur').value||'45m', color:'#5b8def',
      title:txt(title), room:txt($('#sRoom').value||'—'), track:txt($('#sTrack').value||'—'), description:txt('') };
    OAFAuth.client().from('sessions').insert(rec).then(({error})=>{ if(error){adToast(error.message);return;} $('#sTitle').value=''; reloadAndRender(); adToast(a('tAdd')); });
  } else {
    OAF.addSession({ day:+$('#sDay').value, time:$('#sTime').value||'12:00', dur:$('#sDur').value||'45m', color:'#5b8def',
      title:txt(title), room:txt($('#sRoom').value||'—'), track:txt($('#sTrack').value||'—'), desc:txt('') });
    $('#sTitle').value=''; renderProgram(); renderKpis(); adToast(a('tAdd'));
  }
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
function adAddSpeaker(){
  const n=$('#spkName').value.trim(); if(!n)return; const r=$('#spkRole').value||'—';
  if(L()){ OAFAuth.client().from('speakers').insert({event_id:evId(),name:n,role:{fr:r,en:r},country:'🌍'}).then(({error})=>{ if(error){adToast(error.message);return;} $('#spkName').value='';$('#spkRole').value=''; reloadAndRender(); adToast(a('tSpk')); }); }
  else { OAF.addSpeaker({name:n,role:{fr:r,en:r},country:'🌍',color:'#5b8def'}); $('#spkName').value='';$('#spkRole').value=''; renderPeople(); renderKpis(); adToast(a('tSpk')); }
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
    const [ev,se,sp,po,no,prof]=await Promise.all([
      sb.from('events').select('*'),
      sb.from('sessions').select('*'),
      sb.from('speakers').select('*'),
      sb.from('sponsors').select('*'),
      sb.from('notifications').select('*').order('created_at',{ascending:false}),
      sb.from('profiles').select('*')
    ]);
    const order={live:0,upcoming:1,past:2};
    const events=(ev.data||[]).map((e,i)=>({id:e.id,name:e.name,city:e.city||'',cityShort:e.city_short||'',status:e.status||'upcoming',dates:e.dates||{fr:'',en:''},theme:e.theme||{fr:'',en:''},cover:e.cover_url||null,top:tops[i%tops.length]})).sort((a,b)=>(order[a.status]??9)-(order[b.status]??9));
    const sessions=(se.data||[]).map(s=>({id:s.id,ev:s.event_id,day:s.day||0,time:s.time||'',dur:s.dur||'',title:s.title||{fr:'',en:''},room:s.room||{fr:'',en:''},track:s.track||{fr:'',en:''},desc:s.description||{fr:'',en:''},color:s.color||'#5b8def',star:false,sp:[]}));
    const speakers=(sp.data||[]).map((s,i)=>({id:s.id,name:s.name,role:s.role||{fr:'',en:''},country:s.country||'🌍',color:palette[i%palette.length],bio:s.bio||{fr:'',en:''},tags:s.tags||[],ses:{fr:[],en:[]}}));
    const sponsors=(po.data||[]).map((s,i)=>({id:s.id,name:s.name,tier:s.tier||'SILVER',color:s.color||palette[i%palette.length],tc:'#fff',role:s.role||{fr:'',en:''},desc:s.description||{fr:'',en:''},booth:s.booth||{fr:'',en:''},reps:{fr:[],en:[]},logo:s.logo_url||null}));
    const attendees=(prof.data||[]).map((p,i)=>({id:p.id,name:p.name||'—',role:p.role||{fr:'',en:''},country:p.country||'🌍',color:palette[i%palette.length],score:80,why:p.looking_for||{fr:'',en:''},look:p.looking_for||{fr:'',en:''},tags:p.interests||[]}));
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
