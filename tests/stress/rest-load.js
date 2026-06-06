// k6 — charge REST (lectures annuaire / messages / notifs) avec montée en puissance.
//   k6 run -e STAGING_URL=... -e STAGING_ANON_KEY=... rest-load.js
import http from 'k6/http';
import { sleep } from 'k6';
import { SharedArray } from 'k6/data';

const URL = __ENV.STAGING_URL;
const ANON = __ENV.STAGING_ANON_KEY;
const tokens = new SharedArray('tokens', () => JSON.parse(open('./tokens.json')));

export const options = {
  stages: [
    { duration: '30s', target: 50 },
    { duration: '1m',  target: 200 },
    { duration: '1m',  target: 500 },
    { duration: '1m',  target: 0 },
  ],
  thresholds: {
    http_req_failed:   ['rate<0.01'],   // < 1 % d'erreurs
    http_req_duration: ['p(95)<300'],   // p95 < 300 ms
  },
};

export default function () {
  const t = tokens[Math.floor(Math.random() * tokens.length)];
  const headers = { apikey: ANON, Authorization: `Bearer ${t.token}`, Accept: 'application/json' };
  const base = `${URL}/rest/v1`;

  // 1) Annuaire — le plus lourd (RLS shares_event + index event_attendees)
  http.get(`${base}/profiles?select=id,name,role,country,interests,looking_for,photo_url&is_visible=eq.true&limit=200`,
    { headers, tags: { name: 'profiles' } });
  // 2) Mes inscriptions
  http.get(`${base}/event_attendees?select=event_id,profile_id&profile_id=eq.${t.id}`,
    { headers, tags: { name: 'event_attendees' } });
  // 3) Mes conversations récentes
  http.get(`${base}/messages?select=*&or=(sender.eq.${t.id},recipient.eq.${t.id})&order=created_at.desc&limit=50`,
    { headers, tags: { name: 'messages' } });
  // 4) Notifications
  http.get(`${base}/notifications?select=*&order=created_at.desc&limit=30`,
    { headers, tags: { name: 'notifications' } });

  sleep(Math.random() * 3 + 1); // pause « humaine » 1–4 s
}
