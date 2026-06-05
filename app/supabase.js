/* OAF Connect — couche d'authentification Supabase (sans effet en mode démo).
   Charge supabase-js depuis un CDN uniquement si des clés sont configurées. */
window.OAFAuth = (function () {
  let client = null, user = null, lastError = '';
  const listeners = [];

  // Récupère une éventuelle erreur OAuth renvoyée par Google/Supabase dans
  // l'URL (présente soit dans le hash #..., soit dans la query ?...). Sert au
  // diagnostic : on l'affiche sur l'écran de connexion si la session échoue.
  function readUrlError() {
    try {
      const h = new URLSearchParams((location.hash || '').replace(/^#/, ''));
      const q = new URLSearchParams(location.search || '');
      return h.get('error_description') || h.get('error') ||
             q.get('error_description') || q.get('error') || '';
    } catch (e) { return ''; }
  }

  async function init() {
    if (!window.OAF_LIVE) return null;
    lastError = readUrlError();
    try {
      const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
      client = createClient(window.OAF_CONFIG.SUPABASE_URL, window.OAF_CONFIG.SUPABASE_ANON_KEY, {
        // flowType 'implicit' : le jeton revient directement dans l'URL (hash),
        // sans dépendre d'un « code_verifier » stocké localement — bien plus
        // fiable sur Safari/iOS, qui efface ce stockage pendant l'aller-retour
        // OAuth (sinon la connexion « tourne » et renvoie à l'écran de login).
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'implicit', storageKey: 'oaf-auth' }
      });
      const { data } = await client.auth.getSession();
      user = data && data.session ? data.session.user : null;
      client.auth.onAuthStateChange((_e, session) => {
        user = session ? session.user : null;
        listeners.forEach(f => { try { f(user); } catch (e) {} });
      });
      return client;
    } catch (e) {
      console.warn('Supabase indisponible :', e);
      lastError = lastError || String(e && e.message || e);
      return null;
    }
  }
  const ready = init();

  return {
    live: () => !!window.OAF_LIVE,
    ready: () => ready,
    client: () => client,
    user: () => user,
    error: () => lastError,
    onChange: (f) => listeners.push(f),
    async signInWith(provider) { await ready; return client.auth.signInWithOAuth({ provider, options: { redirectTo: location.origin + location.pathname } }); },
    async sendCode(email) { await ready; return client.auth.signInWithOtp({ email }); },
    async verify(email, token) { await ready; return client.auth.verifyOtp({ email, token, type: 'email' }); },
    async signOut() { await ready; if (client) return client.auth.signOut(); }
  };
})();
