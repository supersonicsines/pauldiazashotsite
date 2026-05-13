# Pawly Market

Prediction market correlation intelligence platform. Finds mispriced
beta correlations between Polymarket contracts, surfaces them as alerts
to paying subscribers via the website AND `@pawlymkt_bot`.

## Tech Stack

- **Frontend**: React 19 + Vite + RainbowKit. `src/App.jsx` is the
  public landing page, `src/pages/Community.jsx` is the gated members
  area (4 tabs: profile, discussions, leaderboard, copytrading),
  `src/pages/Trader.jsx` is the trader profile page,
  `src/pages/Browser.jsx` is the Kitsune explorer (approved pairs
  browser with saved pairs + notes, production at `#/explorer`),
  `src/pages/ModDashboard.jsx` is the mod dashboard (production at
  `#/mod`), `src/pages/Explorer.jsx` is the admin CRM backend
  (dev-only at `#/backend`, stripped from prod builds).
- **Shared components**: `src/components/AlertPreferences.jsx`
  (used by both Account modal and Community profile tab),
  `src/components/Avatar.jsx` (deterministic 5×5 SVG blockie).
- **Backend**: Python 3.9 + FastAPI (`engine/server.py`). SQLite at
  `data/pawly.db`. Auto-reload on prod via `uvicorn --reload`.
- **Engine**: `engine/` — `scraper`, `backfill`, `tagger`, `analyzer`,
  `scoring`, `daemon`, `tui`, `payment_monitor`, `position_reader`,
  `subscriptions`, `broadcast`, `publisher`, `bot`, `db`, `config`.
- **Polymarket-only**: kalshi files exist but are dormant since
  v0.3.2. See `project_kalshi_purge.md` (memory).
- **Deploy**: single DigitalOcean droplet (`agora`). nginx serves
  static frontend + proxies API. 3 systemd services: `pawly-server`,
  `pawly-daemon`, `pawly-bot`. All on healthchecks.io heartbeats.
  Production at `https://pawly.market`.

## Conventions

- **No Docker.** File-based storage, simple local processes.
- **No hover scale/zoom effects.** Use color, glow, box-shadow, opacity.
- **Aesthetic**: see `AESTHETIC.md`. Doki-doki ASCII symbols
  (`✦ ✧ ⊛ ◈ → ✕ ・`), kanji for tier names (`狐` kitsune, `猫` neko),
  monospace, dark palette. Never use multicolor emoji.
- **Pricing**: Neko ($59/mo) alert feed, Kitsune ($599/mo) full access
  including community + copytrading.
- **Crypto-native**: Polygon for payments + position tracking.
  Multi-chain safety net (ETH, Base, Arb, OP) logs wrong-chain sends
  for manual review — only Polygon auto-credits. Single deposit
  address `0x22d9B7Bd3447c24FB83196ea8470eB766de37Ed6` across all
  EVM chains. USDC/USDT ERC-20, no payment processor, no KYC.
- **Spreads** displayed in rounded cents (¢), not percentages.
- **Alert types** use Greek symbols: β-NEG, β-PARTIAL, β-DRIFT, θ-THETA, ✕-DEAD.
- **No auto-renewal.** Subscriptions naturally end on their date.
  No "cancel" button — users just stop paying.

## Key Files

| File | Purpose |
|---|---|
| `PRD.md` | Full product requirements, schema, architecture |
| `TASKS.md` | Active work items only (done items live in ARCHIVE.md) |
| `ARCHIVE.md` | Completed features + scrapped ideas |
| `NEXT_STEPS.md` | Tomorrow's plan + dev workflow reference |
| `V067_DEBUG.md` | Ephemeral v0.6.7 testing list (delete when closed out) |
| `AESTHETIC.md` | Visual design language reference |
| `PERFORMANCE_INDEX.md` | PPI scoring spec (leaderboard + airdrop) |
| `brainstorm.md` | Quick ideas not yet scoped |
| `SCALING_DEVOPS.md` | Deploy architecture, security model |
| `V2_SCOPE.md` / `V2_ANALYSIS.md` | Deferred features + Tier 2 analytics |
| `internal_docs/STRATEGIES.md` | The six trading strategies |
| `internal_docs/TRADING_GUIDE.md` | Spread trading primer |
| `internal_docs/ENGINE_LOGIC.md` | Alert engine deep dive |
| `internal_docs/QUALITY_SCORING_SPEC.md` | Authoritative pair scoring spec |
| `internal_docs/TELEGRAM_BOT_SETUP.md` | Bot operational reference |
| `internal_docs/WALLET_SWEEPING_DEPLOY.md` | Per-user wallet gen + sweep TUI activation guide (v0.6.6+) |
| `LOCAL_NOTES.md` | **Gitignored** — password hints, machine-specific context |

## Pipeline (current)

1. **Daemon scrapes** Polymarket every 5 min (cadence dropped from
   15 → 5 in v0.5.7), tags markets, runs the analyzer every 2h.
2. **Analyzer** writes Tier 1 stats (Spearman, lagged ρ, volume-weighted,
   Engle-Granger cointegration, half-life) to `candidate_pairs`.
   `pair_type` precedence: dead → theta → negative → drift → partial.
3. **`/analyze`** (Codex slash command, run from mac via tunnel)
   promotes raw → pending → approved with macro commentary.
   Pass 4 fills `quality_score` per `internal_docs/QUALITY_SCORING_SPEC.md`.
4. **Editorial publish** via Explorer (admin-only) → calls
   `publisher.publish_alert` → writes `published_alerts` + dispatches
   broadcast via `engine/broadcast.py` → enqueued in `alert_queue` →
   bot's `alert_dispatch_loop` sends to Telegram subscribers.
5. **Daemon** also polls `position_reader` every 2 min for copytrading
   feed events, dispatches the same way through `broadcast.py`.

## Auth & Subscriptions (v0.6+)

See `project_auth_current.md` in memory for the full state machine.
Quick summary:

- **Telegram-first onboarding** for new users via `@pawlymkt_bot`.
  `/start` → paste wallet → tier picker → payment → auto-credit.
- **Wallet-connect (CONNECT-only)** for legacy + returning members.
  No EIP-191 signature required since v0.5.
- **Multi-wallet** per account (`user_wallets` table). First linked
  wallet is permanent primary.
- **Subscription blocks** (`subscription_blocks` table) instead of a
  single tier+expires field. Block model handles stack/upgrade/queue
  rules. `users.tier` and `users.subscription_expires` are
  denormalized cache fields refreshed by
  `subscriptions.recompute_user_state`.
- **Renewal**: never auto-renews. Same-tier payment queues at chain
  end. Upgrade mutates active block + queues new tier. Trial gets
  voided on any paid purchase.
- **Trial**: 12h kitsune, single-use per `telegram_id`.
- **Admin**: `role='admin'` bypasses the block system entirely.
  Founder wallet `0xa9b0b6E866f2f5C8a333bF11B254BA2276cc4a1d` seeded
  on every `init_db()`.
- **Mod**: `role='mod'` gets kitsune-equivalent content access (community,
  explorer, browser) without paid-tier broadcast eligibility. Mod
  dashboard at `#/mod`. Rate-limited moderation actions. Cannot see
  customer financials. Promoted/demoted via admin CRM.
- **Alert preferences**: `users.alert_preferences` JSON column,
  shared between web Account modal and bot's `/alerts` keyboard.

## Pair Scoring (1-10 quality_score, agentic)

Filled in by a Codex agent during `/analyze` Pass 4, reading
`internal_docs/QUALITY_SCORING_SPEC.md`. Dispatches by pair type
(dead / theta / negative / drift / partial), all multiplicative
(confidence × magnitude). 7+ publishable, 4-6 worth watching.

The reference implementation in `engine/scoring.py:compute_quality_score`
is NOT called automatically — it's documentation + fallback.

## Analysis Principles

When analyzing pairs, prioritize:

1. **Dead cell** (mutual exclusion, YES sum > 100¢) — guaranteed structural profit
2. **Theta with β < 1** decay edge — mathematical, high conviction
3. **High-σ reconvergence** with strong β — statistical bread and butter
4. **Macro chain plays** where upstream already moved — highest subscriber value
5. **β regime breaks** — hardest, flag with lower confidence

Always skip: entertainment, social media metrics, weather, awards
shows, reality TV, same-party primaries, pairs without macro thesis.

When running `/analyze`, always pull existing approved pairs as
context to avoid redundancy. Don't approve duplicates of an
already-approved thesis.

## Production Status (v0.6.7)

Live at **https://pawly.market**. All three services healthy and on
healthchecks.io.

**v0.6.7 (current):** Admin CRM backend at `#/backend` (dev-only,
SSH tunnel via TUI `V` keybind) with 17 endpoints — customer management,
payment review queue, treasury balances, mod promotion, audit trail.
Mod dashboard at `#/mod` (production, web-accessible) — content
moderation, alert pruning, community bans (7d cap), self-audit.
Kitsune explorer at `#/explorer` (production) — approved pairs browser
with save/bookmark, personal notes, submit-to-community. Three schema
migrations: `role='mod'`, `outcome='pruned'`, user admin columns.
`DELETE /api/alerts/{id}` now fenced with `_require_admin`. Public
alerts feed filters out pruned/wrong outcomes.

**v0.6.6:** Per-user deposit wallet generation + moshimoshi sweep TUI +
treasury management. See `internal_docs/WALLET_SWEEPING_DEPLOY.md`.

What's still open: see `V067_DEBUG.md` for the ephemeral test list
and `TASKS.md` for the durable backlog.
