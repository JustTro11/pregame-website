# 🧠 PreGame Coffee Website - Brainstorming Document

## Brand Identity Research

### PreGame (泡沫紅茶店)
**What We Know:**
- Name: PreGame ★泡沫紅茶店★ (Bubble Tea Shop)
- Platform: Instagram @pregame.tw
- Following: ~700 followers, 69 posts
- Location: Taiwan (indicated by .tw handle)
- Products: 茶飲 (tea drinks), 漂浮蘇打 (float sodas), 無酒精特調 (non-alcoholic specialty drinks)
- Vibe: Classic Taiwanese tea shop with a modern twist
- The "PreGame" name suggests preparation/energy before an activity - perfect for coffee/tea

### Blank Galleria (Host Store)
**What We Know:**
- Premium streetwear & designer clothing reseller
- Brands: Supreme, Vivienne Westwood, Cav Empt, Human Made, Diesel, Kenzo, CARHARTT WIP, Maison Margiela, STUSSY, BAPE, Nike, and more
- Multi-currency support (international appeal)
- Clean, minimalist e-commerce design
- Dark aesthetic common in streetwear culture
- Categories: New arrivals, Sale, Flash Pre-orders, Vintage items

---

## 💡 Concept Ideas

### 1. "Streetwear Meets Tea Culture" 
Blend the premium streetwear aesthetic of Blank Galleria with the traditional Taiwanese tea shop vibe of PreGame.

**Visual Direction:**
- Dark mode primary with warm accent colors (amber, terracotta)
- High-contrast typography (bold streetwear fonts)
- Japanese/Taiwanese aesthetic influences
- Subtle grain/texture overlays
- Premium feel matching luxury streetwear

### 2. "The Third Space"
Position PreGame as the ultimate "pre-game" spot - where you come before shopping, before an event, before life happens.

### 3. "Gallery Café"
Since it's inside a "Galleria" - lean into the gallery/art concept with drinks as art pieces.

---

## 🎯 Core Value Proposition

> "Premium drinks, zero friction reservations, seamless experience"

**Key Differentiators:**
1. **Automated Reservations** - Book a table without calling or messaging
2. **In-Store Synergy** - Browse clothing while waiting for drinks
3. **Curated Experience** - Limited, quality-focused menu

---

## 🚀 Feature Brainstorming

### PRIORITY 1: Reservation System (Must Have)
The user explicitly requested **zero human involvement** for reservations.

**Core Functionality:**
- [ ] Calendar-based date selection
- [ ] Time slot availability display
- [ ] Party size selection (1-6 people?)
- [ ] Customer contact info collection
- [ ] Instant confirmation via email/SMS
- [ ] Confirmation code generation

**Advanced Features:**
- [ ] Table preference (window, private, bar seating)
- [ ] Special occasion notes (birthday, meeting, etc.)
- [ ] Pre-order drinks with reservation
- [ ] Waitlist for fully booked times
- [ ] Reservation modification/cancellation
- [ ] Google Calendar integration
- [ ] Reminder notifications

**Technical Considerations:**
- Real-time availability checking
- Prevent double-bookings
- Admin dashboard for shop owner
- Business hours configuration
- Holiday/special hours handling

### PRIORITY 2: Menu & Drinks Display
**Sections:**
- 茶飲 (Tea Drinks) - Traditional & Modern
- 漂浮蘇打 (Float Sodas) - Instagram-worthy
- 無酒精特調 (Non-Alcoholic Cocktails) - Specialty
- Seasonal Specials

**Features:**
- Beautiful drink photography
- Ingredient lists
- Customization options display
- Price display
- "Most Popular" indicators

### PRIORITY 3: Homepage / Landing
**Sections:**
- Hero with stunning imagery
- Quick reservation CTA
- Featured drinks
- About the space (in Blank Galleria)
- Location & hours
- Instagram feed integration (or styled gallery)

### PRIORITY 4: About & Location
- Story of PreGame
- Connection to Blank Galleria
- Map integration
- Contact information
- Operating hours

---

## 👥 User Personas

### 1. The Streetwear Shopper
- Already at Blank Galleria
- Wants quick coffee while browsing
- Values aesthetic experience
- Likely to Instagram their drink

### 2. The Planner
- Wants to book ahead for a specific time
- Meeting friends or clients
- Appreciates knowing their table is ready

### 3. The Tea Enthusiast
- Specifically coming for PreGame
- Interested in tea culture
- May browse Blank Galleria afterward

### 4. The Tourist/Visitor
- Discovered via Instagram
- Wants the full experience
- Will take photos for social media

---

## 🎨 Design Inspiration

### Color Palette Options

**Option A: Dark Streetwear**
- Primary: #0A0A0A (Near Black)
- Secondary: #1A1A1A (Dark Gray)
- Accent: #E8A849 (Warm Amber)
- Text: #FFFFFF (White)

**Option B: Tea House Modern**
- Primary: #1C1C1C (Charcoal)
- Secondary: #2D2D2D (Gray)
- Accent: #C45C26 (Terracotta)
- Text: #F5F5F5 (Off-White)

**Option C: Minimalist Gallery**
- Primary: #FAFAFA (Off-White)
- Secondary: #EEEEEE (Light Gray)
- Accent: #000000 (Black)
- Pop: #8B4513 (Coffee Brown)

### Typography Ideas
- Headlines: Bold sans-serif (Bebas Neue, Oswald, or custom)
- Body: Clean sans-serif (Inter, Outfit)
- Accent: Maybe subtle Traditional Chinese characters

### Visual Elements
- Subtle animations on hover
- Smooth page transitions
- Floating/parallax effects
- Grain texture overlay
- Premium photography (or generated images)

---

## 📊 Reservation System Deep Dive

### User Flow
```
1. Click "Reserve" → 
2. Select Date → 
3. See Available Time Slots → 
4. Select Time & Party Size →
5. Enter Contact Details →
6. Review & Confirm →
7. Receive Confirmation
```

### Data to Collect
- **Required:**
  - Name
  - Phone number
  - Date
  - Time slot
  - Party size

- **Optional:**
  - Special requests
  - Pre-order drinks
  - Occasion

### Business Rules to Consider
- Maximum party size
- Minimum/maximum advance booking time
- Cancellation policy
- No-show handling
- Peak hours definition

### Storage Options
Since this is a frontend-only site initially:
- LocalStorage (demo purposes)
- Google Forms/Sheets integration (simple & free)
- Formspree/Netlify Forms (contact handling)
- Future: Backend API with database

---

## 🏆 MVP Feature List (Prioritized)

### Must Have (V1)
1. ✅ Stunning homepage
2. ✅ Reservation form with datetime selection
3. ✅ Menu display
4. ✅ Location & hours info
5. ✅ Mobile responsive design

### Nice to Have (V1.5)
1. Time slot availability logic
2. Email confirmation
3. Instagram gallery
4. Multi-language (EN/繁體中文)

### Future (V2)
1. Admin dashboard
2. Real-time availability
3. Pre-ordering
4. Loyalty program
5. Blank Galleria integration

---

## 🤔 Questions to Consider

1. **Business Hours?** - What are PreGame's operating hours?
2. **Seating Capacity?** - How many tables/seats total?
3. **Time Slot Duration?** - 30 min? 1 hour?
4. **Advance Booking Limit?** - Can book 7 days ahead? 30 days?
5. **Confirmation Method?** - Email? SMS? Both?
6. **Language Preference?** - Primary Chinese? Bilingual?
7. **Menu Items?** - Full drink list with prices?

---

## 🎬 Next Steps

1. **Create Implementation Plan** - Detailed technical approach
2. **Design System** - Define colors, typography, components
3. **Build Homepage** - Hero, navigation, key sections
4. **Build Reservation System** - The core feature
5. **Build Menu Page** - Showcase drinks
6. **Polish & Test** - Responsive, animations, UX

---

*This document will be updated as we refine the concept.*
