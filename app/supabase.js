/* OAF Connect — couche d'authentification Supabase (sans effet en mode démo).
   Charge supabase-js depuis un CDN uniquement si des clés sont configurées. */
window.OAFAuth = (function () {
  let client = null, user = null;
  const listeners = [];

  async function init() {
    if (!window.OAF_LIVE) return null;
    try {
      const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
      client = createClient(window.OAF_CONFIG.SUPABASE_URL, window.OAF_CONFIG.SUPABASE_ANON_KEY, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storageKey: 'oaf-auth' }
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
      return null;
    }
  }
  const ready = init();

  return {
    live: () => !!window.OAF_LIVE,
    ready: () => ready,
    client: () => client,
    user: () => user,
    onChange: (f) => listeners.push(f),
    async signInWith(provider) { await ready; return client.auth.signInWithOAuth({ provider, options: { redirectTo: location.origin + location.pathname } }); },
    async sendCode(email) { await ready; return client.auth.signInWithOtp({ email }); },
    async verify(email, token) { await ready; return client.auth.verifyOtp({ email, token, type: 'email' }); },
    async signOut() { await ready; if (client) return client.auth.signOut(); }
  };
})();
