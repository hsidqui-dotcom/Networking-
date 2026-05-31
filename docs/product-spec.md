# Product Spec & Roadmap
### OAF Connect — the OneAfricaForums networking app

*Vision: One beautiful, African-first app that runs every OneAfricaForums event
and keeps the community alive all year — before, during, and long after.*

---

## 1. Personas

| Persona | Wants | Key features |
|---|---|---|
| **Attendee / delegate** | Meet the right people, plan their days, not miss sessions | Agenda, AI matchmaking, meetings, chat, community |
| **Speaker** | Promote sessions, connect with delegates, share materials | Speaker profile, session manager, slides upload, Q&A |
| **Partner / sponsor** | Visibility, qualified leads, measurable ROI | Branded booth, lead capture (QR), sponsored circles, ROI dashboard |
| **Organizer (OAF team)** | Run the event, drive engagement, prove value, monetize | Admin console, push, analytics, monetization tools |
| **Alumni / community member** | Stay connected between events | Year-round circles, feed, jobs/deals board, next-event discovery |

---

## 2. Feature set (the eight pillars)

### 1. Multi-Event Hub — *"all our events, one home"*
- Switch between live, upcoming, and past OneAfricaForums events.
- One persistent profile + contact graph across every event.
- Event discovery + registration / ticketing.

### 2. Program / Agenda
- Multi-track schedule, filter by track/day/room/theme.
- Add sessions to **My Agenda**; reminders + calendar sync (Google/Outlook/ICS).
- Session detail: speakers, materials/slides, live Q&A, polls, post-session rating.

### 3. People — Attendees, Speakers, Partners
- Rich profiles (role, company, country, interests, "I'm looking for…").
- Powerful filters & search (country, sector, intent, language).
- Speaker directory; partner/sponsor directory with tiers.

### 4. AI Matchmaking & Networking
- Intent-based matching (raise capital / invest / find partners / hire / learn).
- "People you should meet" with a match score + *why* you matched.
- Improves with behavior (sessions viewed, profiles opened, connections).
- Double opt-in "Connect" + QR contact exchange (digital business card).

### 5. Meetings & Calendar
- Book 1:1 or group meetings from shared availability.
- Assign physical location/table or virtual room; conflict detection.
- Automated/speed-networking scheduler; real-time reschedule on cancellation.

### 6. Chat & Community
- 1:1 direct messaging + group chats.
- **Community Board / Circles**: topic, country, and diaspora chapters.
- Live event feed (posts, photos, announcements), reactions, polls.

### 7. Engagement & Gamification
- Points, badges, challenges, leaderboard; sponsor-branded challenges.
- Live polls, Q&A, surveys, photo wall.
- Push / WhatsApp / SMS notifications (low-data fallback).

### 8. Sponsorship & Monetization (revenue engine)
- Tiered packages (Bronze/Silver/Gold/Platinum): logo placement, booth, sponsored sessions & circles, push.
- **Lead capture** via QR badge scan; exportable lead lists (CRM/Zapier), with caps + paid upgrades.
- Sponsor ROI dashboard (impressions, booth visits, leads, meetings).

### Always-on: "Beyond the Forum"
Year-round circles, member spotlights, a jobs & deals board, content/replays,
and proactive nudges toward the next event — the layer that keeps engagement
alive between events.

---

## 3. Mockup screens (in this prototype)

The interactive prototype (`index.html`) demonstrates:
`Home / Event Hub` · `Program` · `People + AI Matchmaking` · `Meetings &
Calendar` · `Chat` · `Community feed` · `Sponsors` · `Profile`.

> The data shown is illustrative sample content for a fictional
> *OneAfrica Forum 2026 — Kigali* edition. Names are placeholders.

---

## 4. Suggested delivery roadmap

| Phase | Scope | Outcome |
|---|---|---|
| **0 — Mockup (now)** | Clickable prototype + research (this repo) | Align on vision, demo to stakeholders/sponsors |
| **1 — MVP** | Auth, multi-event hub, agenda, people directories, 1:1 chat, profile, push | Usable at one live forum |
| **2 — Networking core** | AI matchmaking, meeting scheduler, QR contact exchange, community board | Real networking value |
| **3 — Monetization** | Sponsor booths, tiers, lead capture, ROI dashboard, gamification | Revenue + sponsor renewals |
| **4 — Always-on** | Year-round circles, jobs/deals board, content hub, multilingual, native apps | Retention between events |

---

## 5. Tech recommendation (summary)

- **PWA-first** (React + service workers): offline-tolerant, installable, no app-store gate — built for African bandwidth realities. Native wrappers in Phase 4.
- Realtime backend (websockets) for chat/notifications; Postgres; matchmaking
  service (rules + embeddings); analytics pipeline.
- Integrations: calendars, CRM/Zapier, Stripe + mobile-money, WhatsApp/SMS/email.
- Multilingual from the core: EN / FR / PT / AR.
