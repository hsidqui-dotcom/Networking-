// =============================================================================
// TEARDOWN STAGING — supprime les comptes de test + l’événement de test.
// ⚠️ STAGING uniquement.   STAGING_URL, STAGING_SERVICE_ROLE
// =============================================================================
import { createClient } from '@supabase/supabase-js';

const URL = need('STAGING_URL');
const SERVICE = need('STAGING_SERVICE_ROLE');
function need(k){ const v = process.env[k]; if(!v){ console.error(`Variable manquante: ${k}`); process.exit(1); } return v; }

const admin = createClient(URL, SERVICE, { auth: { persistSession:false, autoRefreshToken:false } });

async function main(){
  console.log('▶ Suppression des comptes de test (loadtest+…@example.com)…');
  let removed = 0, page = 1;
  for (;;){
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    const users = data?.users || [];
    if (!users.length) break;
    for (const u of users){
      if (u.email && /^loadtest\+\d+@example\.com$/.test(u.email)){
        await admin.auth.admin.deleteUser(u.id).catch(() => {});
        removed++;
      }
    }
    if (users.length < 1000) break;
    page++;
  }
  console.log(`   ${removed} comptes supprimés.`);

  console.log('▶ Suppression de l’événement de test (cascade)…');
  const { error } = await admin.from('events').delete().eq('name', 'LOADTEST Forum');
  if (error) throw error;
  console.log('✅ Nettoyage terminé.');
}

main().catch((e) => { console.error('❌', e); process.exit(1); });
