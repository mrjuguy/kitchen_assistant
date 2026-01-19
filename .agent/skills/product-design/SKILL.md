---
name: product-design
description: Principles for creating low-friction, high-value AI-powered products.
---

# Product Design Principles

## 1. Friction vs. Value
- **CRITICAL**: Never propose features that require high-friction manual data entry (e.g., entering prices for every grocery item). Users will abandon the app.
- **AI-First**: Always prefer automated extraction (OCR, API) or "Smart Defaults" (remembering last used value) over manual input.
- **Aggregation**: If precision is high-effort, offer "Low-Resolution" value (e.g., enter Total Receipt Amount once, rather than line-items).

## 2. Natural Progression (Feature Sequencing)
- **Foundations First**: Ensure the database and types are ready before building UI.
- **Core Utility Early**: Build features that provide immediate value with minimal new data (e.g., "Ready to Cook" list using existing pantry data).
- **Feedback Loops**: Build deduction/write features (e.g., "Cook Recipe") before discovery/read features (e.g., "What can I cook?") so the discovery data is accurate.
- **Premium Layers Last**: Higher-complexity features like Budgeting and AI Chat should come after the core workflow is solid.
