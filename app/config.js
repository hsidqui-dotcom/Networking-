/* OAF Connect — configuration
   ------------------------------------------------------------------
   Pour activer le MODE RÉEL (comptes + base de données multi-utilisateurs),
   créez un projet Supabase gratuit puis collez vos 2 clés ci-dessous
   (voir supabase/README.md). Laissez vide pour rester en MODE DÉMO
   (données locales à l'appareil — aucun compte requis).
   ------------------------------------------------------------------ */
window.OAF_CONFIG = {
  SUPABASE_URL: '',          // ex. https://abcd1234.supabase.co
  SUPABASE_ANON_KEY: ''      // clé "anon public"
};
window.OAF_LIVE = !!(window.OAF_CONFIG.SUPABASE_URL && window.OAF_CONFIG.SUPABASE_ANON_KEY);
