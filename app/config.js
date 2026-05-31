/* OAF Connect — configuration
   ------------------------------------------------------------------
   Pour activer le MODE RÉEL (comptes + base de données multi-utilisateurs),
   créez un projet Supabase gratuit puis collez vos 2 clés ci-dessous
   (voir supabase/README.md). Laissez vide pour rester en MODE DÉMO
   (données locales à l'appareil — aucun compte requis).
   ------------------------------------------------------------------ */
window.OAF_CONFIG = {
  SUPABASE_URL: 'https://qxxjsqctkltnjptqdbye.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_2WGlAPX6X9qLAIc-Bin5GQ_s5kpDutB'
};
window.OAF_LIVE = !!(window.OAF_CONFIG.SUPABASE_URL && window.OAF_CONFIG.SUPABASE_ANON_KEY);
