# Design Guidelines: Manim Animation Generator SaaS Platform

## Design Approach

**Selected Approach:** Design System (Linear + Vercel) with educational focus

**Justification:** This is a utility-focused SaaS tool requiring clarity, efficiency, and trust. Linear's workflow elegance combined with Vercel's developer-friendly polish creates the perfect foundation for a technical educational platform.

**Core Principles:**
- Workflow clarity over decoration
- Progressive disclosure of complexity
- Educational and approachable
- Professional technical credibility

---

## Typography

**Font Families:**
- Primary: Inter (400, 500, 600) via Google Fonts
- Monospace: JetBrains Mono (400, 500) for code displays

**Hierarchy:**
- Hero headline: text-5xl md:text-6xl font-semibold tracking-tight
- Section headers: text-3xl md:text-4xl font-semibold
- Component titles: text-xl font-semibold
- Body text: text-base font-normal leading-relaxed
- Code/technical: text-sm font-mono
- Labels: text-sm font-medium
- Captions: text-xs text-gray-600

---

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 3, 4, 6, 8, 12, 16, 24

**Containers:**
- Marketing sections: max-w-7xl mx-auto px-6
- App interface: Full viewport with sidebar layout
- Content areas: max-w-4xl for optimal readability
- Form sections: max-w-2xl

**Grid Patterns:**
- Feature cards: grid-cols-1 md:grid-cols-3 gap-8
- Pipeline agents: grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4
- Gallery: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6

---

## Component Library

### Landing Page Components

**Hero Section (80vh):**
- Split layout: Left side with headline + description + CTA, Right side with animated preview/demo
- Headline emphasizing "Natural Language to Educational Animation"
- Primary CTA: "Start Creating Animations" + Secondary: "View Examples"
- Trust indicator: "Powered by Gemini AI • Trusted by Educators"

**Feature Grid (3 columns):**
1. Multi-Agent Intelligence - Scene planning, code generation, validation
2. Sandboxed Execution - Safe rendering with timeout controls
3. Instant Preview - Download MP4 animations instantly

**How It Works (4-step timeline):**
- Step cards with numbers, icons, descriptions
- Visual connector lines between steps
- Show: Prompt → Plan → Generate → Render

**Example Animations Gallery:**
- Masonry grid showcasing generated animations
- Hover overlay with prompt used
- "View in Editor" button on each

**Pricing Section:**
- 3-tier pricing cards with feature comparison
- Highlight recommended tier
- Include API key requirement callout

**Footer:**
- Newsletter signup ("Get animation tips weekly")
- Quick links (Docs, Examples, API Reference, Support)
- Social proof metrics (Animations created, Active users)

### App Interface Components

**Main Layout:**
- Left sidebar (240px): Navigation with active state indicators
- Top bar: Project name, User menu, Credits/usage display
- Main area: Full-height workspace

**Prompt Builder:**
- Large textarea with placeholder examples
- Template selector dropdown above input
- Character count and complexity indicator
- "Generate Animation" primary button
- Advanced options collapse panel

**Multi-Agent Pipeline Visualizer:**
- Horizontal progress stepper showing 4 agents
- Each agent card displays: Name, Status (waiting/active/complete), Time elapsed
- Active agent shows pulsing indicator
- Expandable logs for each agent's output

**Code Preview Panel:**
- Split pane: Generated Manim code (left) + Live preview (right)
- Syntax highlighted code with line numbers
- Copy code button, Download script button
- Validation warnings/errors displayed inline

**Video Preview:**
- Centered video player with controls
- Download MP4 button prominently placed
- Share link generator
- Re-generate with modifications option

**Animation Gallery (User Dashboard):**
- Card grid with thumbnails
- Filters: Date, Duration, Subject
- Quick actions: Preview, Download, Edit, Delete
- Batch operations toolbar

**Settings Panel:**
- Gemini API key input fields (4 separate inputs for each agent)
- Rate limit configurations
- Sandbox timeout settings
- Export preferences

### Shared Components

**Navigation:**
- Sidebar with icons + labels
- Sections: Dashboard, Create New, My Animations, Templates, Settings
- Collapsed state on mobile

**Status Indicators:**
- Pills for job status (Queued, Processing, Complete, Failed)
- Progress bars for rendering
- Toast notifications for completions/errors

**Forms:**
- Clean input fields with floating labels
- Validation states with inline messages
- Helper text below fields
- Grouped related fields with subtle borders

**Buttons:**
- Primary: Solid with prominent contrast
- Secondary: Outlined
- Tertiary: Ghost style for less important actions
- Icon buttons: Square with padding-3
- Blurred backgrounds when over images

**Cards:**
- Subtle border, rounded corners (rounded-xl)
- Padding: p-6 for content, p-4 for compact
- Hover state: subtle elevation change
- Click area extends to full card

---

## Images

**Landing Page:**
1. **Hero Image (Right side):** Animated GIF or video showing a Manim animation being generated in real-time. Should demonstrate mathematical concepts (equations animating, graphs forming). Aspect ratio 16:9 or square.

2. **Feature Icons:** Use Heroicons for feature sections (Sparkles for AI, Shield for sandbox, Play for preview)

3. **Gallery Thumbnails:** Actual generated Manim animations as examples (math proofs, physics simulations, chemistry diagrams). 6-9 examples in masonry grid.

4. **Step Illustrations:** Simple iconographic representations for the 4-step workflow

**App Interface:**
1. **Empty States:** Illustration for "No animations yet" with encouraging CTA
2. **Avatar Placeholders:** User profile images
3. **Template Previews:** Small thumbnails for animation templates

**Icon Library:** Heroicons via CDN for all interface icons

---

## Animations

Use sparingly:
- Fade in for page transitions (200ms)
- Agent status pulse during active processing
- Smooth scroll for navigation jumps
- Skeleton loaders for video previews
- Progress bar animations for rendering status