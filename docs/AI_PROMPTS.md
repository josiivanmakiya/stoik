# Stoik AI Prompts

## Codex / Cursor Prompt — Stoik System Expansion & Analysis

You are a senior product and systems engineer.

You are analyzing an existing MERN-based subscription platform called STOIK.

STOIK currently supports:
1. One core product (white innerwear).
2. Subscription plans.
3. Billing, fulfillment, retries, and grace periods.
4. Minimalist frontend and backend architecture.

Your task:
1. Analyze the existing codebase from start to finish.
2. Compare the current implementation to the long-term goal.
3. Identify missing functions, services, and abstractions.
4. Identify what is overbuilt versus underbuilt.
5. Identify where the system will break at scale.
6. Identify where future consumables could plug in cleanly.
7. Propose an extensible architecture that supports multiple consumable types, cadences, and bundles.
8. Suggest additional consumable categories that fit Stoik’s philosophy.
9. For each category, explain why it fits and how it would integrate.
10. Output a system-level overview, gap analysis, and concrete next steps.

Constraints:
1. Focus on calm, minimalist subscription service behavior.
2. Consumables should degrade silently, be hygiene-adjacent, and require low decision effort.
3. Respect the existing codebase and avoid rewrites unless justified.
4. No fluff, no marketing language, no hype.
