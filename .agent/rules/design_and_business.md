# Design and Business Configuration Rules

## Source of Truth (SOT) Policy
To maintain consistency across the multilingual site and ensure the "Dark Streetwear" aesthetic remains intact, follow these rules:

1. **Business Identity**: All business-specific information (Shop Name, Address, Social Media Links, Operating Hours) MUST be imported from `app/config/business.ts`. 
   - **DO NOT** hardcode these values in React components.
   - If a new business field is needed, add it to the config first.

2. **Design Tokens**: All styling constants (Colors, Spacing, Radius, Shadows, Glassmorphism) MUST be imported from `app/config/design.ts`.
   - **DO NOT** use ad-hoc hex codes or arbitrary spacing values.
   - Use `designTokens.colors.accent.primary` for consistent amber highlights.

3. **Multilingual Business Info**: When adding business info to `business.ts`, ensure it supports the project's 5 locales (`en`, `zh-TW`, `zh-CN`, `ja`, `ko`) if it is user-facing.

## Fail-Safe Procedures
- **Browser Failures**: If the AI assistant's browser tool fails with `ECONNREFUSED` on port 9222, assume an environment restriction. Use `curl` for basic connectivity checks and ask the user for visual confirmation rather than attempting repeated browser launches.
