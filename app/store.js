/* OAF Connect — shared data store (prototype)
   Persists to localStorage; same origin => shared between the attendee app
   (index.html) and the admin console (admin.html). Emits change events so
   open pages refresh live. This is the prototype "database". */
(function (global) {
  const KEY = 'oaf_proto_v1';

  function seed() {
    return {
      lang: 'fr',
      currentEvent: 0,
      branding: { logo: null },
      events: [
        { id: 0, name: 'OneAfrica Forum 2026', city: 'Kigali, Rwanda', cityShort: 'Kigali', status: 'live',
          dates: { fr: '12–14 juin 2026', en: '12–14 Jun 2026' }, theme: { fr: 'Business, Investissement & Leadership', en: 'Business, Investment & Leadership' } },
        { id: 1, name: 'Lagos Forum 2026', city: 'Lagos, Nigeria', cityShort: 'Lagos', status: 'upcoming',
          dates: { fr: '18–20 nov. 2026', en: '18–20 Nov 2026' }, theme: { fr: 'Commerce, Tech & Économie créative', en: 'Trade, Tech & Creative Economy' } },
        { id: 2, name: 'Nairobi Forum 2025', city: 'Nairobi, Kenya', cityShort: 'Nairobi', status: 'past',
          dates: { fr: 'Oct. 2025', en: 'Oct 2025' }, theme: { fr: 'L’économie numérique', en: 'The Digital Economy' } }
      ],
      speakers: [
        { id: 1, name: 'Dr. Amara Okonkwo', role: { fr: 'Chef économiste · BAD', en: 'Chief Economist · AfDB' }, country: '🇳🇬', color: '#E2622C' },
        { id: 2, name: 'Thabo Nkosi', role: { fr: 'CEO · Continental Energy', en: 'CEO · Continental Energy' }, country: '🇿🇦', color: '#13476b' },
        { id: 3, name: 'Fatou Ndiaye', role: { fr: 'Associée · Sahel Ventures', en: 'Partner · Sahel Ventures' }, country: '🇸🇳', color: '#5b8def' }
      ],
      attendees: [
        { id: 1, name: 'Fatou Ndiaye', role: { fr: 'Associée · Sahel Ventures', en: 'Partner · Sahel Ventures' }, country: '🇸🇳', color: '#5b8def', score: 94, why: { fr: 'Capital agritech en commun.', en: 'Shared agritech capital focus.' } },
        { id: 2, name: 'Kwame Mensah', role: { fr: 'CEO · Accra FinLabs', en: 'CEO · Accra FinLabs' }, country: '🇬🇭', color: '#1B998B', score: 90, why: { fr: 'Paiements transfrontaliers.', en: 'Cross-border payments.' } },
        { id: 3, name: 'Dr. Lindiwe Dube', role: { fr: 'Dir. Impact · AfriBank', en: 'Head of Impact · AfriBank' }, country: '🇿🇦', color: '#b5559a', score: 87, why: { fr: 'Finance climat & alimentaire.', en: 'Climate & food finance.' } },
        { id: 4, name: 'Tunde Bakare', role: { fr: 'Fondateur · HarvestLink', en: 'Founder · HarvestLink' }, country: '🇳🇬', color: '#9a6b00', score: 83, why: { fr: 'Distribution Afrique de l’Ouest.', en: 'West Africa distribution.' } }
      ],
      sponsors: [
        { id: 1, name: 'AfriBank Group', tier: 'PLATINUM', color: 'linear-gradient(135deg,#FFE400,#EAC700)', tc: '#111' },
        { id: 2, name: 'Sahel Ventures', tier: 'GOLD', color: '#1B998B', tc: '#fff' },
        { id: 3, name: 'TerraConnect Telecom', tier: 'SILVER', color: '#5b8def', tc: '#fff' }
      ],
      sessions: [
        { id: 1, ev: 0, day: 0, time: '09:00', dur: '30m', track: { fr: 'Plénière', en: 'Plenary' }, color: '#1E8C5A', room: { fr: 'Grande scène', en: 'Main Stage' }, title: { fr: 'Ouverture & bienvenue', en: 'Opening & welcome' }, desc: { fr: 'Le Président ouvre l’édition 2026.', en: 'The Chair opens the 2026 forum.' } },
        { id: 2, ev: 0, day: 0, time: '09:30', dur: '60m', track: { fr: 'Investissement', en: 'Investment' }, color: '#111', room: { fr: 'Grande scène', en: 'Main Stage' }, title: { fr: 'Keynote : financer la décennie de la ZLECAf', en: 'Keynote: Financing the AfCFTA decade' }, desc: { fr: 'Capital public & privé pour la ZLECAf.', en: 'Public & private capital for the AfCFTA.' } },
        { id: 3, ev: 0, day: 0, time: '11:00', dur: '45m', track: { fr: 'Agritech', en: 'Agritech' }, color: '#1B998B', room: { fr: 'Salle B', en: 'Room B' }, title: { fr: 'Agritech : débouchés & climat', en: 'Agritech offtake & climate' }, desc: { fr: 'Modèles agritech bancables.', en: 'Bankable agritech models.' } },
        { id: 4, ev: 0, day: 1, time: '10:30', dur: '45m', track: { fr: 'Énergie', en: 'Energy' }, color: '#1E8C5A', room: { fr: 'Salle A', en: 'Room A' }, title: { fr: 'Transition énergétique & capital vert', en: 'Energy transition & green capital' }, desc: { fr: 'Financer la transition juste.', en: 'Financing a just transition.' } },
        { id: 5, ev: 0, day: 1, time: '13:15', dur: '30m', track: { fr: 'Networking', en: 'Networking' }, color: '#9a6b00', room: { fr: 'Salle B', en: 'Room B' }, title: { fr: 'RDV express Agritech (IA)', en: 'Agritech speed-meetings (AI)' }, desc: { fr: 'Vous + 7 délégués matchés.', en: 'You + 7 matched delegates.' } },
        { id: 6, ev: 0, day: 2, time: '14:00', dur: '45m', track: { fr: 'Plénière', en: 'Plenary' }, color: '#1E8C5A', room: { fr: 'Grande scène', en: 'Main Stage' }, title: { fr: 'Clôture & annonce Lagos', en: 'Closing & Lagos reveal' }, desc: { fr: 'Bilan et prochaine destination.', en: 'Wrap-up and next destination.' } }
      ],
      notifications: [
        { id: 1, icon: '🤝', ts: Date.now() - 120000, title: { fr: 'Fatou Ndiaye a accepté votre connexion', en: 'Fatou Ndiaye accepted your connection' } },
        { id: 2, icon: '📅', ts: Date.now() - 600000, title: { fr: 'RDV confirmé · 13:15, Salle B', en: 'Meeting confirmed · 13:15, Room B' } }
      ],
      days: [ { fr: 'Jeu 12', en: 'Thu 12' }, { fr: 'Ven 13', en: 'Fri 13' }, { fr: 'Sam 14', en: 'Sat 14' } ],
      me: { name: 'Amina Keïta', role: { fr: 'Fondatrice & CEO · GreenHarvest Agritech', en: 'Founder & CEO · GreenHarvest Agritech' }, country: '🇲🇱', bookmarks: [], connections: [] }
    };
  }

  let state = load();
  if (!state.branding) state.branding = { logo: null };
  function load() {
    try { const s = JSON.parse(global.localStorage.getItem(KEY)); return s && s.events ? s : seed(); }
    catch (e) { return seed(); }
  }
  function persist(silent) {
    try { global.localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { /* storage unavailable (private mode / opaque origin): keep in-memory */ }
    if (!silent && global.dispatchEvent) { try { global.dispatchEvent(new global.Event('oaf-change')); } catch (e) {} }
  }

  const nextId = arr => arr.reduce((m, x) => Math.max(m, x.id), 0) + 1;

  const API = {
    KEY,
    get: () => state,
    lang: () => state.lang,
    setLang(l) { state.lang = l; persist(); },
    currentEvent() { return state.events.find(e => String(e.id) === String(state.currentEvent)) || state.events[0]; },
    setCurrentEvent(id) { state.currentEvent = id; persist(); },
    events: () => state.events,
    speakers: () => state.speakers,
    attendees: () => state.attendees,
    sponsors: () => state.sponsors,
    days: () => state.days,
    sessions: (ev, day) => state.sessions.filter(s => s.ev === (ev ?? state.currentEvent) && (day == null || s.day === day)).sort((a, b) => a.time.localeCompare(b.time)),
    notifications: () => [...state.notifications].sort((a, b) => b.ts - a.ts),
    me: () => state.me,

    addSession(s) { s.id = nextId(state.sessions); s.ev = s.ev ?? state.currentEvent; state.sessions.push(s); persist(); return s.id; },
    updateSession(id, patch) { const s = state.sessions.find(x => x.id === id); if (s) Object.assign(s, patch); persist(); },
    removeSession(id) { state.sessions = state.sessions.filter(x => x.id !== id); persist(); },

    addNotification(n) { n.id = nextId(state.notifications); n.ts = Date.now(); state.notifications.push(n); persist(); return n.id; },

    addSpeaker(s) { s.id = nextId(state.speakers); state.speakers.push(s); persist(); },
    addAttendee(a) { a.id = nextId(state.attendees); a.score = a.score || 75; state.attendees.push(a); persist(); },
    addSponsor(s) { s.id = nextId(state.sponsors); state.sponsors.push(s); persist(); },

    // branding & media (images stored as data URLs)
    appLogo() { return state.branding && state.branding.logo; },
    setAppLogo(dataUrl) { state.branding.logo = dataUrl || null; persist(); },
    setSponsorLogo(id, dataUrl) { const s = state.sponsors.find(x => x.id === id); if (s) { s.logo = dataUrl || null; persist(); } },
    setEventCover(id, dataUrl) { const e = state.events.find(x => x.id === id); if (e) { e.cover = dataUrl || null; persist(); } },
    importAttendees(rows) {
      const palette = ['#5b8def', '#1B998B', '#b5559a', '#9a6b00', '#E2622C', '#13476b'];
      rows.forEach(r => {
        state.attendees.push({
          id: nextId(state.attendees), name: r.name,
          role: { fr: r.role || '—', en: r.role || '—' },
          country: r.country || '🌍', color: palette[state.attendees.length % palette.length],
          score: r.score || (60 + Math.floor(Math.random() * 35)),
          why: { fr: r.interests || 'Profil importé', en: r.interests || 'Imported profile' }
        });
      });
      persist();
      return rows.length;
    },

    toggleBookmark(id) { id = String(id); const b = state.me.bookmarks; const i = b.indexOf(id); if (i >= 0) b.splice(i, 1); else b.push(id); persist(); return b.indexOf(id) >= 0; },
    isBookmarked(id) { return state.me.bookmarks.indexOf(String(id)) >= 0; },
    addConnection(id) { id = String(id); if (state.me.connections.indexOf(id) < 0) state.me.connections.push(id); persist(); },
    isConnected(id) { return state.me.connections.indexOf(String(id)) >= 0; },

    stats() {
      return {
        attendees: state.attendees.length,
        speakers: state.speakers.length,
        sponsors: state.sponsors.length,
        sessions: state.sessions.filter(s => s.ev === state.currentEvent).length,
        connections: state.me.connections.length,
        bookmarks: state.me.bookmarks.length,
        notifications: state.notifications.length
      };
    },
    reset() { state = seed(); persist(); },

    // Charge les données du serveur (mode réel) dans le miroir en mémoire.
    loadServer(p) {
      if (p.events)        state.events = p.events;
      if (p.sessions)      state.sessions = p.sessions;
      if (p.attendees)     state.attendees = p.attendees;
      if (p.speakers)      state.speakers = p.speakers;
      if (p.sponsors)      state.sponsors = p.sponsors;
      if (p.notifications) state.notifications = p.notifications;
      if (p.days)          state.days = p.days;
      if (p.bookmarks)     state.me.bookmarks = p.bookmarks;
      if (p.connections)   state.me.connections = p.connections;
      if (p.currentEvent != null) state.currentEvent = p.currentEvent;
      if (p.me)            state.me = Object.assign(state.me, p.me);
    }
  };

  global.OAF = API;
})(typeof window !== 'undefined' ? window : globalThis);
