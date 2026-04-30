# Pawlymarket

Type: popup
Window id: `pawlymarket`
Source: `src/pages/index.astro`

## Current Lead Text

Pawlymarket — decentralised quantitative-analysis community for Polymarket.

## Current Link

- https://pawlymarket.com

## Replacement Content

A members' room built over Polymarket. The engine runs statistical regression
on the full live order book, AI curates the survivors, and members assemble
hedges against the curated pairs to extract yield from mispriced beta. Closer
to a small quant desk than another arbitrage bot.

The analyzer scrapes Polymarket every five minutes and computes Tier 1 stats
on every viable pair — Spearman, lagged correlation, volume-weighted beta,
Engle-Granger cointegration, half-life — then a three-pass funnel (thresholds
→ AI categorical screen → written macro thesis) lands at roughly 250 curated
pairs at any given time. Output sorts into five signal types: ✕-DEAD
(mutual-exclusion arbitrage where YES prices sum past 100¢), θ-THETA
(calendar-spread decay with a β < 1 edge), β-NEG, β-PARTIAL, and β-DRIFT.
Yield comes from spread reconvergence, not directional bets.

$59/mo opens the curated Telegram and web alert feed; $599/mo opens the
explorer — charts, outcome modelers, saved pairs — and a Kitsune-only
community where members submit and discuss their own pairs and copytrade the
top wallets tracked on Polygon's Conditional Token Framework.

Built end-to-end on Claude Code and Codex CLI. Haiku, Sonnet, Opus, and
GPT-5.5 each run the part of the workflow where they are strongest.
Wallet-connect auth, USDC/USDT on Polygon, no KYC.

## Media

This popout should feature the screenshot at roughly 65% width, about 30% larger than the prior 50% modal treatment. The screenshot is in the folder.
