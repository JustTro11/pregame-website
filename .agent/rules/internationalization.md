---
trigger: always_on
---

# Antigravity Project Rules

## Internationalization (i18n) Policy
This project supports 5 languages: [en](cci:2://file:///home/jthsu/workspace/pregame-website/app/actions/menu.ts:8:0-21:1), `zh-TW`, `zh-CN`, `ja`, `ko`.

**CRITICAL RULE:**
When adding ANY new user-facing text to the UI, you MUST add the corresponding translation key to **ALL 5** message files in the `messages/` directory:
1. [messages/en.json](cci:7://file:///home/jthsu/workspace/pregame-website/messages/en.json:0:0-0:0)
2. [messages/zh-TW.json](cci:7://file:///home/jthsu/workspace/pregame-website/messages/zh-TW.json:0:0-0:0)
3. [messages/zh-CN.json](cci:7://file:///home/jthsu/workspace/pregame-website/messages/zh-CN.json:0:0-0:0)
4. [messages/ja.json](cci:7://file:///home/jthsu/workspace/pregame-website/messages/ja.json:0:0-0:0)
5. [messages/ko.json](cci:7://file:///home/jthsu/workspace/pregame-website/messages/ko.json:0:0-0:0)

**Guidelines:**
- Ensure translation keys are identical across all 5 files.
- Never hardcode text strings in React components ([.tsx](cci:7://file:///home/jthsu/workspace/pregame-website/app/%5Blocale%5D/page.tsx:0:0-0:0)). Always use `next-intl` (e.g., [t('key')](cci:2://file:///home/jthsu/workspace/pregame-website/app/components/reservation/ReservationForm.tsx:17:0-23:2)).
- If you cannot verify a translation, use English or a reasonable placeholder, but the KEY must exist in all files to prevent application errors.