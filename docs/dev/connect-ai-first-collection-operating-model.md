# CONNECT AI-First Collection Operating Model

Version: 1.0  
Prepared On: 2026-04-17  
Default Language: English

## Why This Exists

CONNECT intelligence should not depend on a human repeatedly checking feeds by hand.

The target state is:

- AI continuously discovers new public signals
- AI revisits fixed watchlists for weakly indexed channels
- AI classifies, deduplicates, and appends qualified records
- humans only step in for access-gated exceptions or policy-sensitive review

This document defines that operating model.

## Core Principle

Use an automation-first loop:

1. AI discovers
2. AI revisits
3. AI classifies
4. AI appends
5. humans handle only blocked surfaces or edge-case review

The user should mainly consume:

- one dashboard
- one weekly readout

## Collection Layers

### Layer 1. Public-Web Discovery

Primary sources:

- Reddit
- public web search
- public blogs and press
- public marketplace pages
- public forum threads
- public creator pages

AI tasks:

- search approved keyword bundles
- collect candidate URLs and snippets
- remove duplicates
- reject obvious generic `connect` noise
- create candidate records for qualification

### Layer 2. Revisit Panels

Used for channels where broad search is weak but repeated observation is still useful.

Examples:

- Instagram public creator accounts
- public YouTube creator channels
- public LinkedIn creator/company pages (posts + comments)
- public creator landing pages
- semi-private but accessible creator communities

AI tasks:

- revisit a fixed panel list on a schedule
- inspect recent visible posts, captions, bios, pinned content, descriptions, and comment surfaces when accessible
- record either:
  - qualified mentions
  - borderline mentions
  - zero-signal observations

Panel sampling here means "AI repeatedly checks a fixed watchlist."
It does not mean the user must manually browse everything.

### Layer 3. Access-Gated Exceptions

Examples:

- Discord communities behind login
- member-only CG communities
- heavily rate-limited or anti-bot environments
- spaces where aggressive automation would be risky or inappropriate

Default rule:

- do not force full automation
- use summary observation where allowed
- request human help only for access setup or blocked verification

## Role Split

### What AI Should Do By Default

- public signal discovery
- panel revisits
- mention qualification
- use-case tagging
- value scoring
- mention-log appends
- dashboard refresh
- weekly summary generation

### What Humans Should Rarely Need To Do

- provide login or access to a closed space
- approve a high-risk follow-up
- review a small set of low-confidence edge cases
- curate or replace weak panel targets

## Panel Sampling Reframed

Old interpretation:

- "someone manually checks Instagram every week"

Correct interpretation:

- "AI maintains a repeatable watchlist and revisits it on schedule"

Panel sampling is still useful because it creates directional evidence from weakly indexed channels.
But operationally, it should behave like an AI watchlist system, not a manual browsing routine.

## Minimum Human Touch Model

Target weekly model:

- AI runs discovery automatically
- AI revisits Instagram and creator panels automatically
- AI appends qualified records automatically
- AI updates the dashboard automatically
- humans review only:
  - blocked channels
  - policy-sensitive records
  - very low-confidence candidates

This keeps the system data-driven without creating hidden labor.

## Weekly Operating Loop

### Step 1. Automated Discovery Run

AI collects new public-web candidates and prepares a qualified-candidate list.

### Step 2. Automated Panel Revisit

AI checks fixed watchlists for:

- Instagram public panels
- YouTube public panels
- creator proof surfaces
- semi-private but accessible communities

### Step 3. Automated Classification

AI assigns:

- qualified / rejected / borderline
- source
- domain
- use case
- intent
- value signal
- confidence

### Step 4. Automated Append

AI appends verified rows to the main mention log and preserves metadata such as:

- collection method
- visibility
- sample scope
- review state

### Step 5. Exception Queue

AI surfaces only the small set that still needs human attention.

Examples:

- access blocked
- evidence too weak to auto-qualify
- private-channel note requires sensitivity review

### Step 6. Dashboard And Readout Refresh

AI regenerates:

- counts
- source mix
- use-case mix
- quote appendix
- weekly strategic readout

## Success Criteria

This model is working if:

- data volume grows without proportional human effort
- source mix broadens beyond Reddit
- Instagram and creator-proof signals start appearing
- manual review load stays small
- the dashboard becomes the main place the user checks

## Guardrails

- do not represent sampled private-channel evidence as market totals
- keep confidence visible for weakly indexed channels
- store minimum necessary private-community evidence
- favor repeatability over one-off exploration
