# Market Research & Competitive Analysis
### OneAfricaForums Networking Platform ("OAF Connect")

*Prepared: May 2026 · Status: Discovery / pre-build*

---

## 1. The opportunity

OneAfricaForums runs multiple pan-African events. Today the journey looks like
most conferences: a PDF agenda, a paper badge, business cards that get lost, a
WhatsApp group that dies a week after the event, and no durable record of who
met whom. The ambition is to replace all of that with **one branded app that
runs every OneAfricaForums event AND keeps the community alive between events** —
a "year-round home" rather than a throwaway conference tool.

This is exactly the gap the best platforms (Whova, Swapcard, Brella, Grip) are
chasing, but none of them is *African-first*: built for low-bandwidth networks,
multilingual (EN/FR/PT/AR + local languages), mobile-money / pan-African payment
realities, and a diaspora that spans continents.

**Strategic bet:** Don't out-feature Swapcard. Win on *community continuity*,
*African context*, and *networking quality*, packaged in a beautiful, fast,
offline-friendly app.

---

## 2. Competitor landscape

| Platform | Best at | Pricing (public) | Weakness for us |
|---|---|---|---|
| **Whova** | High adoption, easy networking, community board, agenda, "SmartProfile" business-card scanning | Custom quote; **free for attendees** | Generic look; not customizable as *your* brand; community fades post-event |
| **Swapcard** | AI matchmaking, Smart Meeting Generator, exhibitor/sponsor ROI, hybrid | Starter from **~$570 / up to 1,000 attendees**; Pro & Enterprise custom | Expensive at scale; B2B-trade-show feel; overkill UX for a forum |
| **Brella** | AI 1:1 meeting matchmaking, meeting scheduling, virtual booths, analytics | Custom by event size | Meetings-centric; thinner "always-on community" |
| **Grip** | Strongest AI matchmaking ("300% better than base"), MustMeet auto-scheduler, lead gen | Enterprise/custom | Enterprise price + complexity; not built for a single recurring organizer |
| **Bizzabo** | Enterprise "Event Experience OS", integrations, AI networking | From **~$17,999 / yr**, 3-user min | Heavy + costly; built for large event teams, not a forum brand |
| **Hubilo / Airmeet / EventMobi / Cvent** | Webinars / large managed events / registration depth | Custom, mostly enterprise | Platform lock-in; the *app* is one module, not the hero |

### What they all do (table-stakes — we must match)
- Personalized **agenda / program** with session bookmarking & reminders
- **Attendee, speaker, partner directories** with rich profiles
- **1:1 messaging** + group chat + a **community / discussion board**
- **Meeting scheduling** with availability & calendar sync
- **Sponsor/exhibitor** visibility + **lead capture (QR badge scan)**
- **Push notifications**, live polls/Q&A, surveys, **gamification** (points, badges, leaderboards)
- Web + iOS + Android, offline-tolerant

### Where the leaders differentiate (we should adopt the best)
- **AI matchmaking** that improves with behavioral data (Grip/Swapcard). ~60% of valuable networking happens *pre-event* — start matching early.
- **Automated meeting scheduling** that resolves conflicts/cancellations in real time (Grip MustMeet).
- **Monetization toolkit** — tiered sponsor packages (bronze/silver/gold), sponsored sessions, branded gamification, capped lead lists with paid upgrades, CRM export (Salesforce/HubSpot/Zapier).
- **365 / year-round community** (ExpoPlatform "365 community", Bizzabo positioning) — the engagement layer that doesn't switch off after the event.

---

## 3. Where OAF Connect wins (our differentiation)

1. **Multi-event hub, one identity.** Every OneAfricaForums event lives in *one* app. A profile, contacts, and conversations carry from event to event — your network compounds instead of resetting.
2. **Always-on community ("Beyond the Forum").** Topic circles, country/diaspora chapters, a content feed, job/deal board, and member spotlights keep the app open 51 weeks a year, not just the 3 days of the forum.
3. **African-first engineering.** Offline-first PWA, aggressive caching, low-data mode, SMS/WhatsApp fallbacks for notifications, multilingual (EN/FR/PT/AR), and mobile-money-aware payments.
4. **Quality networking, not contact spam.** AI matchmaking tuned for *intent* (raise capital / find partners / hire / learn / invest) with curated intros and warm "double opt-in" connections.
5. **Sponsor value that's measurable.** Pan-African brands get branded booths, lead capture, sponsored circles & sessions, and a clear ROI dashboard — our revenue engine.

---

## 4. Recommended technology approach

- **Build a PWA-first app** (installable web app) with React + service workers for **offline browsing, caching, and low-network resilience** — ideal for African connectivity and avoids app-store friction for first-time attendees. Add thin **native iOS/Android wrappers** later for power users (push, badge scanning, calendar).
- **Backend:** API + realtime (chat/notifications via websockets), Postgres, object storage for media, a matchmaking service (rules + embeddings), and an analytics pipeline.
- **Integrations:** Calendar (Google/Outlook/ICS), CRM export (HubSpot/Salesforce/Zapier), payment (Stripe + pan-African/mobile-money provider), email + WhatsApp/SMS for notifications.
- **Rationale:** the modern strategy is a fast PWA for reach + a native option for loyalty — exactly right for a recurring organizer serving a continent-wide, mixed-bandwidth audience.

---

## 5. Sources

- [Whova — Event Networking Software](https://whova.com/event-management-software/event-networking-software/)
- [Whova — Best Features for Conference & Event Apps](https://whova.com/whova-event-app/)
- [Whova — 10 Best Event Apps for Conferences](https://whova.com/blog/best-event-conference-apps/)
- [Swapcard — Event Networking & Matchmaking](https://www.swapcard.com/features/event-networking)
- [Swapcard — AI Personalized Recommendations](https://www.swapcard.com/features/ai-personalized-recomendations)
- [Swapcard — Event Monetization](https://www.swapcard.com/features/event-monetization)
- [Grip — AI Event Matchmaking](https://www.grip.events/products/event-matchmaking)
- [Grip — Sponsorship & Monetization](https://www.grip.events/products/sponsorship-and-monetization)
- [Brella / Bizzabo / Swapcard comparison — Spreadly](https://spreadly.app/en/blog/best-networking-tools-for-conferences)
- [Best matchmaking apps for conferences — Converve](https://www.converve.com/event-networking-blog/top-23-event-networking-apps-for-2026/)
- [ExpoPlatform — Sponsorship monetization & 365 community](https://expoplatform.com/sponsorship-monetization/)
- [Guidebook — Which event app features can be monetized](https://www.guidebook.com/post/which-event-app-features-can-be-monetized)
- [PWA vs Native in 2025 — Wezom](https://wezom.com/blog/progressive-web-apps-vs-native-apps-in-2025)
- [How to build PWAs with React — F22 Labs](https://www.f22labs.com/blogs/how-to-build-progressive-web-apps-pwas-with-react/)
