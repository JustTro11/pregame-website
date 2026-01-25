# PreGame Project Guidelines & Learnings

This document captures key architectural decisions and engineering practices established during development.

## 1. Architectural Patterns

### Configuration-Driven Design
We use a "Config-First" approach to manage both business logic and UI styling.
- **Business Data**: All business-specific info (hours, address, social links) MUST reside in [app/config/business.ts](file:///home/jthsu/workspace/pregame-website/app/config/business.ts).
- **Design Tokens**: All styling constants (colors, spacing, glass effects) MUST reside in [app/config/design.ts](file:///home/jthsu/workspace/pregame-website/app/config/design.ts).

### Internationalization (i18n)
- We support 5 languages: `en`, `zh-TW`, `zh-CN`, `ja`, `ko`.
- **Synchronization Rule**: Any new translation key MUST be added to all 5 files in `messages/` simultaneously.
- **Placeholder Policy**: If a translation is unavailable, use the English version as a placeholder to prevent runtime errors, but never omit the key.

## 2. Engineering Procedures

### Browser Tool Limitations
- The internal browser tool may experience `ECONNREFUSED` on port 9222 due to environment restrictions.
- **Fail-Forward Strategy**: If browser verification fails, switch to `curl` for basic URL connectivity checks or request manual verification from the user. Do not spend excessive cycles re-trying system-level browser launches.

### Coding Style
- **React Components**: Use Functional Components with TypeScript.
- **Styling**: Prefer the centralized `designTokens` for colors and spacing to maintain the "Dark Streetwear" aesthetic.
- **Routing**: Use `next-intl`'s navigation (e.g., `Link` from `i18n/navigation.ts`) to ensure locale persistence.

## 3. Deployment & Git workflow
- Pushes to `main` should only occur after verification of the current feature set.
- Ensure all i18n keys are committed together with the UI changes.
