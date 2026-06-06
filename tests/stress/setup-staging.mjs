// =============================================================================
// SETUP STAGING — crée des utilisateurs de test + leurs jetons pour le stress test.
// ⚠️ À exécuter UNIQUEMENT sur un projet Supabase de STAGING, jamais la prod.
//
//   STAGING_URL, STAGING_ANON_KEY, STAGING_SERVICE_ROLE, N_USERS (def. 500)
// =============================================================================
import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'node:fs';

const URL = need('STAGING_URL');
const ANON = need('STAGING_ANON_KEY');
const SERVICE = need('STAGING_SERVICE_ROLE');
const N = parseInt(process.env.N_USERS || '500', 10);
const PASSWORD = 'LoadTest!2026';
const EMAIL = (i) => `loadtest+${i}@example.com`;

function need(k){ const v = process.env[k]; if(!v){ console.error(`Variable manquante: ${k}`); process.exit(1); } return v; }

const admin = createClient(URL, SERVICE, { auth: { persistSession:false, autoRefreshToken:false } });
const anon  = createClient(URL, ANON,    { auth: { persistSession:false, autoRefreshToken:false } });

// Petite file d'attente à concurrence limitée (évite de saturer l'API admin).
async function pool(items, worker, concurrency = 20){
  let i = 0, ok = 0, ko = 0;
  await Promise.all(Array.from({ length: concurrency }, async () => {
    while (i < items.length){
      const idx = i++;
      try { await worker(items[idx], idx); ok++; }
      catch (e) { ko++; if (ko <= 5) console.warn('  …échec', e.message || e); }
      if ((ok + ko) % 100 === 0) console.log(`  ${ok + ko}/${items.length}`);
    }
  }));
  return { ok, ko };
}

async function main(){
  console.log(`▶ Staging: ${URL}  —  ${N} utilisateurs de test`);

  // 1) Événement de test
  console.log('1) Création de l’événement de test…');
  const { data: ev, error: evErr } = await admin
    .from('events').insert({ name: 'LOADTEST Forum', status: 'live' }).select('id').single();
  if (evErr) throw evErr;
  const eventId = ev.id;
  console.log('   event_id =', eventId);

  // 2) Pré-charge les e-mails dans guests (passe l’allowlist H2 + rattache au forum)
  console.log('2) Pré-chargement des invités (guests)…');
  const guests = Array.from({ length: N }, (_, i) => ({ email: EMAIL(i), event_id: eventId, name: `LoadTest ${i}` }));
  for (let s = 0; s < guests.length; s += 500){
    const { error } = await admin.from('guests').insert(guests.slice(s, s + 500));
    if (error) throw error;
  }

  // 3) Création des comptes (le trigger crée le profil + rattache au forum)
  console.log('3) Création des comptes…');
  const ids = Array.from({ length: N }, (_, i) => i);
  await pool(ids, async (i) => {
    const { error } = await admin.auth.admin.createUser({
      email: EMAIL(i), password: PASSWORD, email_confirm: true,
      user_metadata: { full_name: `LoadTest ${i}` }
    });
    if (error && !/already.*registered/i.test(error.message)) throw error;
  }, 15);

  // 4) Connexion de chacun → jeton d’accès
  console.log('4) Récupération des jetons…');
  const tokens = [];
  await pool(ids, async (i) => {
    const { data, error } = await anon.auth.signInWithPassword({ email: EMAIL(i), password: PASSWORD });
    if (error) throw error;
    if (data?.session) tokens.push({ id: data.user.id, token: data.session.access_token });
  }, 20);

  writeFileSync('tokens.json', JSON.stringify(tokens));
  console.log(`✅ Terminé : ${tokens.length} jetons écrits dans tokens.json (event_id ${eventId}).`);
}

main().catch((e) => { console.error('❌', e); process.exit(1); });
