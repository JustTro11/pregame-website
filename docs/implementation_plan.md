# PreGame Coffee Shop Website - Implementation Plan

A modern, visually stunning website for PreGame (泡沫紅茶店), a coffee/tea shop inside Blank Galleria clothing store. The primary feature is an **automated reservation system** requiring zero human involvement.

## Decisions Made

✅ **Backend:** Node.js + Express with SQLite database for reservations  
✅ **Language:** Bilingual (繁體中文 primary, English secondary)  
✅ **Design:** Dark streetwear aesthetic with warm amber accents

---

## Proposed Changes

### Project Structure

```
C:\Users\jenti\.gemini\antigravity\scratch\pregame-website\
├── index.html              # Homepage
├── menu.html               # Menu/drinks page
├── reservations.html       # Reservation system
├── about.html              # About & location
├── confirmation.html       # Reservation confirmation
├── css/
│   └── styles.css          # Design system & styles
├── js/
│   ├── main.js             # Global functionality
│   ├── reservations.js     # Reservation logic
│   └── menu.js             # Menu interactions
└── assets/
    └── images/             # Generated images
```

---

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

## Development Order

1. **Set up project structure** and basic HTML skeleton
2. **Create design system** (`styles.css`) with all tokens
3. **Build homepage** with all sections
4. **Build reservation system** (priority #1 feature)
5. **Build confirmation page**
6. **Build menu page**
7. **Build about page**
8. **Add animations and polish**
9. **Test on multiple devices**
10. **Generate images** for drinks and hero

---

*Ready to begin implementation upon approval.*
