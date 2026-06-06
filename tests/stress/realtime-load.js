// k6 — connexions temps réel SIMULTANÉES tenues (trouve le plafond réel).
//   k6 run -e STAGING_URL=... -e STAGING_ANON_KEY=... -e VUS=1500 -e HOLD_S=120 realtime-load.js
// Astuce : lance d'abord VUS=100, puis 300, 500, 1000, 1500.
import ws from 'k6/ws';
import { check } from 'k6';
import { SharedArray } from 'k6/data';
import { Counter } from 'k6/metrics';

const URL = __ENV.STAGING_URL;
const ANON = __ENV.STAGING_ANON_KEY;
const VUS = parseInt(__ENV.VUS || '200', 10);
const HOLD_S = parseInt(__ENV.HOLD_S || '60', 10);
const tokens = new SharedArray('tokens', () => JSON.parse(open('./tokens.json')));
const connFailed = new Counter('ws_connect_failed');

const WS_URL = URL.replace('https://', 'wss://') + `/realtime/v1/websocket?apikey=${ANON}&vsn=1.0.0`;

export const options = {
  scenarios: {
    realtime: { executor: 'per-vu-iterations', vus: VUS, iterations: 1, maxDuration: (HOLD_S + 30) + 's' },
  },
  thresholds: {
    ws_connect_failed: ['count<1'],
  },
};

export default function () {
  const t = tokens[(__VU - 1) % tokens.length];

  const res = ws.connect(WS_URL, {}, function (socket) {
    socket.on('open', function () {
      // Rejoint un canal et écoute les nouveaux messages qui me sont destinés.
      socket.send(JSON.stringify({
        topic: `realtime:loadtest_${__VU}`,
        event: 'phx_join',
        payload: {
          config: { postgres_changes: [{ event: 'INSERT', schema: 'public', table: 'messages', filter: `recipient=eq.${t.id}` }] },
          access_token: t.token,
        },
        ref: '1', join_ref: '1',
      }));
      // Battement de cœur Phoenix toutes les 25 s (sinon le serveur ferme).
      socket.setInterval(function () {
        socket.send(JSON.stringify({ topic: 'phoenix', event: 'heartbeat', payload: {}, ref: String(Date.now()) }));
      }, 25000);
      // Maintient la connexion ouverte pendant HOLD_S puis se déconnecte proprement.
      socket.setTimeout(function () { socket.close(); }, HOLD_S * 1000);
    });
    socket.on('error', function () { connFailed.add(1); });
  });

  const ok = check(res, { 'handshake 101': (r) => r && r.status === 101 });
  if (!ok) connFailed.add(1);
}
