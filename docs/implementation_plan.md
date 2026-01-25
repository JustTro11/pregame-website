# PreGame Coffee Shop Website - Implementation Plan

A modern, visually stunning website for PreGame (泡沫紅茶店), a coffee/tea shop inside Blank Galleria clothing store. The primary feature is an **automated reservation system** requiring zero human involvement.

## Decisions Made

✅ **Backend:** Node.js + Express with SQLite database for reservations
✅ **Language:** Bilingual (繁體中文 primary, English secondary)
✅ **Design:** Dark streetwear aesthetic with warm amber accents
✅ **Database Update:** Switching to **Supabase (PostgreSQL)** for production-grade reliability and ease of use.

---

## Phase 2: Supabase Integration (Backend)

We are moving from a local-only demo to a live Supabase backend.

### 1. Database Schema

#### Table: `reservations`
| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | Primary Key |
| `created_at` | timestamptz | Auto-generated |
| `date` | date | The booking date |
| `time_slot` | time | The booking time |
| `party_size` | int | Number of guests |
| `customer_name` | text | |
| `customer_phone` | text | |
| `customer_email` | text | Optional |
| `status` | text | 'confirmed', 'cancelled', 'completed' |
| `confirmation_code` | text | Unique 6-char code |

#### Table: `menu_categories`
| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `name_en` | text | e.g., "Tea Classics" |
| `name_zh` | text | e.g., "經典茶飲" |
| `sort_order` | int | For display ordering |

#### Table: `menu_items`
| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `category_id` | uuid | FK to menu_categories |
| `name_en` | text | |
| `name_zh` | text | |
| `description_en` | text | |
| `description_zh` | text | |
| `price` | int | TWD |
| `image_url` | text | Supabase Storage URL |
| `is_available` | boolean | default true |

### 2. Infrastructure Setup
- **Create Project:** "PreGame Website" in Organization `JustTro11's Org`.
- **Region:** `asia-east1` (Taiwan) or `ap-northeast-1` (Tokyo) for lowest latency in Taiwan.
- **Environment Variables:**
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. API & Integration
- Install `@supabase/supabase-js`.
- Create `lib/supabase.ts` client.
- **Reservation Flow:**
    1.  Check availability (Select count from `reservations` where date/time matches).
    2.  Insert new record.
    3.  Return confirmation.

---

## Phase 1: Frontend (In Progress)

### Project Structure (Updated)

```
C:\Users\jenti\.gemini\antigravity\scratch\pregame-website\
├── app/
│   ├── [locale]/
│   │   ├── page.tsx            # Homepage
│   │   ├── menu/page.tsx       # Menu (Fetch from Supabase)
│   │   ├── reserve/page.tsx    # Reservation Form (Post to Supabase)
│   │   ├── about/page.tsx      # About
│   │   └── confirmation/page.tsx
│   ├── api/
│   │   └── webhooks/
│   │       └── line/route.ts   # Future LINE Bot webhook
├── lib/
│   └── supabase.ts             # Database Client
```

### Core Design System

#### [NEW] styles.css

**Design Philosophy:** Dark streetwear aesthetic inspired by Blank Galleria, merged with warm tea-house accents.

| Element | Value |
|---------|-------|
| Primary Background | `#0A0A0A` (Near Black) |
| Secondary Background | `#1A1A1A` (Dark Gray) |
| Card Background | `#141414` |
| Accent Color | `#E8A849` (Warm Amber) |
| Text Primary | `#FFFFFF` |
| Text Secondary | `#888888` |
| Fonts | Outfit (headings), Inter (body) |

**Features:**
- CSS custom properties for theming
- Responsive grid system
- Premium button styles with hover effects
- Card components with glassmorphism
- Form styling for reservation system
- Smooth animations and transitions

---

### Homepage

#### [NEW] index.html

**Sections:**
1. **Hero Section** - Full viewport with stunning imagery, tagline, and CTA
2. **Featured Drinks** - 3 signature drinks with images
3. **About Preview** - Brief intro to PreGame × Blank Galleria
4. **Quick Reserve** - Prominent reservation button
5. **Location & Hours** - Address and operating times
6. **Footer** - Links, social, copyright

---

### Menu Page

#### [NEW] menu.html

**Categories:**
- 🍵 **Tea Classics** - Traditional Taiwanese teas
- 🥤 **Float Sodas** - Creative soda floats
- 🍹 **Specialty Mocktails** - Non-alcoholic crafted drinks
- ☕ **Coffee** - Espresso-based drinks

**Features:**
- Category filtering
- Beautiful drink cards with images
- Price display
- Popular/new item badges
- Smooth scroll between categories

---

### Reservation System (Core Feature)

#### [NEW] reservations.html

**User Flow:**
```
Select Date → Choose Time Slot → Select Party Size → Enter Details → Confirm Booking → Confirmation Page
```

**Form Fields:**
| Field | Type | Required |
|-------|------|----------|
| Date | Date picker | ✅ |
| Time Slot | Select dropdown | ✅ |
| Party Size | Number (1-6) | ✅ |
| Name | Text | ✅ |
| Phone | Tel | ✅ |
| Email | Email | Optional |
| Special Requests | Textarea | Optional |

#### [NEW] reservations.js

**Core Logic:**
- Date validation (no past dates, max 14 days ahead)
- Dynamic time slot generation based on business hours
- Slot availability checking (localStorage for demo)
- Form validation with user-friendly errors
- Confirmation code generation
- Booking storage and retrieval

**Business Rules:**
- Operating hours: 11:00 AM - 9:00 PM
- Time slots: Every 30 minutes
- Max party size: 6
- Advance booking: Up to 14 days
- Same-day booking: At least 1 hour ahead

---

### About & Location Page

#### [NEW] about.html

**Content:**
- Story of PreGame (泡沫紅茶店)
- The concept: Tea shop inside streetwear gallery
- Connection to Blank Galleria
- Embedded map (or static map image)
- Full operating hours
- Contact information
- Instagram link

---

### Confirmation Page

#### [NEW] confirmation.html

**Displays:**
- Confirmation code
- Date & time of reservation
- Party size
- Name
- Instructions/what to expect
- Option to add to calendar
- Link to modify/cancel (future feature)

---

### JavaScript Modules

#### [NEW] main.js

- Mobile navigation toggle
- Smooth scroll functionality
- Page transition effects
- Active nav highlighting

#### [NEW] menu.js

- Category filtering
- Smooth animations on reveal
- Optional: drink detail modal

---

## Verification Plan

### Manual Testing

1. **Homepage Load** - Verify hero, sections render correctly
2. **Navigation** - Test all nav links work
3. **Responsive Design** - Check mobile, tablet, desktop views
4. **Reservation Flow:**
   - Select today's date → verify only future time slots show
   - Select past date → verify it's blocked
   - Try to book without required fields → verify validation
   - Complete booking → verify confirmation page shows
   - Check localStorage for saved booking
5. **Menu Page** - Verify category filtering works
6. **Cross-browser** - Test in Chrome, Firefox, Edge

### Automated Tests
- Browser automation to walk through reservation flow
- Screenshot comparison for visual regression

---

### Development Order (Updated)

1. **Set up project structure** and basic HTML skeleton
2. **Create design system** (`styles.css`) with all tokens
3. **Build homepage** with all sections
4. **Setup Supabase Backend** (Create project, schema, client)
5. **Build reservation system** connected to Supabase
6. **Build confirmation page**
7. **Build menu page**
8. **Build about page**
9. **Add animations and polish**
10. **Test on multiple devices**
11. **Generate images** for drinks and hero

---

*Ready to begin implementation upon approval.*
