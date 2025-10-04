# Smart Old Photo Reviver - Design Guidelines

## Design Approach: Reference-Based (Professional Photo Editing Apps)

**Primary Inspiration:** Adobe Lightroom, Remini, Pixlr, and modern AI-powered photo apps
**Key Principles:**
- Photos are the hero - interface should enhance, not compete
- Build trust through professional, clean aesthetics
- Showcase AI capabilities with dramatic before/after reveals
- Emphasize simplicity for emotional, memory-focused experience

---

## Core Design Elements

### A. Color Palette

**Light Mode:**
- **Primary:** 240 6% 10% (Charcoal) - Professional, non-intrusive
- **Background:** 0 0% 98% (Soft White) - Clean canvas for photos
- **Accent:** 217 91% 60% (Vibrant Blue) - Trust, technology, AI
- **Success:** 142 71% 45% (Emerald) - Restoration complete
- **Surface:** 0 0% 100% (Pure White) - Cards and panels

**Dark Mode:**
- **Primary:** 217 91% 60% (Vibrant Blue)
- **Background:** 240 10% 4% (Deep Charcoal) - Cinematic backdrop
- **Surface:** 240 6% 10% (Elevated Charcoal)
- **Text:** 0 0% 98%

---

### B. Typography

**Font Stack:** Inter (via Google Fonts CDN)
- **Hero Headline:** 3.5rem (56px), font-weight: 700, tracking-tight
- **Section Headers:** 2.25rem (36px), font-weight: 600
- **Body:** 1rem (16px), font-weight: 400, line-height: 1.6
- **Captions:** 0.875rem (14px), font-weight: 500

---

### C. Layout System

**Spacing Primitives:** Tailwind units of **2, 4, 8, 12, 16, 20**
- Container: max-w-7xl
- Section padding: py-20 (desktop), py-12 (mobile)
- Card padding: p-8
- Element gaps: gap-4, gap-8, gap-12

---

### D. Component Library

**1. Hero Section (Full Viewport)**
- Split layout: Left side - headline + CTA, Right side - Animated before/after showcase
- Background: Subtle gradient (240 10% 4% to 240 8% 6%)
- Large hero headline with emphasized "AI-Powered" text in accent color
- Primary CTA button (large, accent color) + secondary "See Examples" link
- Trust indicators below CTA: "10,000+ photos restored" with small icon

**2. Upload Interface**
- Large drag-and-drop zone (min-h-96) with dashed border (border-dashed border-2)
- Icon: Upload cloud icon (Heroicons) centered, large scale
- Clear instructions: "Drag your old photo here or click to browse"
- Supported formats badge: "JPG, PNG up to 10MB"
- Instant preview thumbnail grid on upload

**3. Processing State**
- Full-screen overlay (backdrop-blur-sm) during AI processing
- Centered card with animated progress indicator
- Stage descriptions: "Analyzing photo → Removing damage → Applying colors → Enhancing quality"
- Estimated time remaining with subtle pulsing animation
- Loading bar with gradient fill matching accent color

**4. Comparison Slider**
- Full-width before/after image display
- Vertical draggable divider with circular handle
- Labels: "Original" (left) and "Restored" (right) in subtle badges
- Toggle buttons: "Show Original" | "Show Restored" | "Compare"
- Download button (accent color) positioned prominently below

**5. Feature Showcase Grid**
- 3-column layout (lg:grid-cols-3, md:grid-cols-2, grid-cols-1)
- Each card: Icon (top), Feature name (bold), Description (subtle)
- Cards with subtle hover lift effect (hover:-translate-y-1 transition-transform)
- Icons: Heroicons - SparklesIcon, PhotoIcon, ArrowTrendingUpIcon

**6. Examples Gallery**
- Masonry-style grid showing real before/after transformations
- Hover reveals: Quick before/after flip animation
- 2-column on mobile, 3-column on tablet, 4-column on desktop
- Each example in rounded card with shadow

**7. Results Panel**
- Side-by-side layout on desktop, stacked on mobile
- Download options: "Original Size" | "HD (2x)" | "4K (4x)"
- Share buttons: Social media icons with subtle hover states
- "Restore Another Photo" secondary button

**8. Navigation**
- Transparent header with backdrop blur on scroll
- Logo (left), Nav links (center): "How It Works" | "Examples" | "Pricing"
- "Upload Photo" CTA button (right, accent color)

**9. Footer**
- 3-column layout: About + Quick Links + Contact
- Newsletter signup with inline form
- Social icons with hover color transitions
- Trust badges: "Secure Processing" | "Privacy Guaranteed"

---

### E. Animations

**Sparingly Applied:**
- Upload zone: Subtle scale on drag-over (scale-105)
- Processing: Smooth progress bar animation (transition-all duration-300)
- Comparison slider: Smooth drag with requestAnimationFrame
- Success state: Gentle fade-in for restored image (animate-fadeIn)

---

## Images

**Hero Section:**
- Large before/after split image showcasing dramatic restoration
- Left: Faded, scratched vintage photo
- Right: Same photo restored, colorized, enhanced
- Positioned right side of viewport, taking ~50% width on desktop

**Examples Gallery:**
- 8-12 real restoration examples
- Mix of portrait, landscape, and group photos
- Each showing clear before/after transformation
- Vintage aesthetic (1920s-1980s era photos)

**Feature Cards:**
- Small illustrative icons (not photos) using Heroicons library
- No decorative images - keep focus on functionality

---

## Page Structure (5 Sections)

1. **Hero:** Headline + CTA + showcase image
2. **How It Works:** 3-step process with icons
3. **Features:** 3-column grid of restoration capabilities
4. **Examples:** Gallery of before/after transformations
5. **CTA + Footer:** Final upload prompt + footer links