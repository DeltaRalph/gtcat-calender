# GTCAT Calendar — DESIGN.md

> **Design System & Visual Language Specification**  
> Inspired by **Amie.so**, **Linear**, **Cron / Notion Calendar**, and **Porsche 911 GT3 RS Cockpit Engineering**.

---

## 🏎️ 1. Design Philosophy & Aesthetic Identity

GTCAT Calendar is built for **Erdal Çetin**: Istanbul University Faculty of Law (İÜHF) double-branch student (9 courses, 63 ECTS) and tech startup founder. It blends high-end legal rigor with tech speed.

### Core Principles
1. **Todos + Calendar in One (Amie.so DNA):** Never separate tasks from time. The left pane holds the actionable task inbox; the right pane maps time reality. Tasks convert into calendar blocks via drag & drop.
2. **Cockpit Minimalism (Porsche GT3 RS DNA):** High contrast, zero visual clutter, micro-hairline borders, pure titanium and obsidian textures.
3. **Strict Color Discipline (Anti-Blue Policy):** Childish royal/cyan blues are strictly prohibited. Legal courses use clinical **Ice Titanium / Slate Silver** (`#94A3B8`) and **Racing Emerald** (`#10B981`), accented with **GT3 RS Racing Yellow** (`#FACC15`).
4. **Keyboard Velocity:** Full flow operable without touching the mouse (`B` for sidebar, `T` for today, `1/2/3` for views).

---

## 🎨 2. Design Tokens & Color Palette

### Base Surfaces (Dark Mode Cockpit)
* `bg-canvas`: `#090A0F` (Pure Deep Obsidian)
* `bg-card`: `#12151C` (Carbon Graphite Surface)
* `bg-card-hover`: `#181D26` (Subtle elevated graphite)
* `border-hairline`: `#1F2430` (Precision 1px border)
* `border-subtle`: `#171B24` (Background dividers)

### Base Surfaces (Light Mode)
* `bg-canvas`: `#F8FAFC` (Slate 50 Clean Clinical Canvas)
* `bg-card`: `#FFFFFF` (Pure Paper White)
* `border-hairline`: `#E2E8F0` (Slate 200 hairline)

### Accent & Identity Colors
* **Primary Spark:** `#FACC15` (GT3 RS Racing Yellow)
* **Hover Accent:** `#FFE033` (Warm Yellow Glow)
* **Highlight Shadow:** `0 0 20px -3px rgba(250, 204, 21, 0.2)`

### Domain Categories
* **1. Sınıf Hukuk (Amfi 8 / Öğleden Sonra):**
  - Emerald / Olive (`#10B981` / `border-l-emerald-500 bg-emerald-500/10`)
* **2. Sınıf Hukuk (Amfi 1 / Sabah):**
  - Ice Titanium / Slate Silver (`#94A3B8` / `border-l-slate-400 bg-slate-500/10 text-slate-800 dark:text-slate-200`)
  - *Rule: Never use blue-500.*
* **Merkez Kütüphane & Pratik Olay Çözümü:**
  - Warm Amber Bronze (`#F59E0B` / `border-l-amber-500 bg-amber-500/10`)
* **Startup, Yazılım & Deep Work:**
  - Amethyst Violet (`#8B5CF6` / `border-l-purple-500 bg-purple-500/10`)
* **Öğle Yemeği & Mola:**
  - Neutral Slate (`#64748B` / dashed border)

---

## 📐 3. Layout Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Header: [B] SidebarToggle | GT3 Logo | < Bugün > 14-20 Eyl (Güz 1) | Views  │
├──────────────────────┬──────────────────────────────────────────────────────┤
│ Amie Todo Sidebar    │ Right Canvas:                                        │
│ • Date & Streak      │ • Telemetry Bar (Total ECTS, Attended, Study Hours)  │
│ • Progress Bar       │ • Filter Bar & Search Input                          │
│ • Quick Add Input    │ • Active View:                                       │
│ • Category Chips     │   - 40-Min İÜHF Matrix (Drag & Drop Target)          │
│ • Draggable Todos    │   - Daily Agenda & Pomodoro Counter                  │
│ • Amie Drag Helper   │   - 7-Day Kanban Cards                               │
└──────────────────────┴──────────────────────────────────────────────────────┘
```

---

## ⚡ 4. Interaction Patterns

1. **Drag-to-Schedule:**
   - Any card from `AmieTodoSidebar` has `draggable={true}` with data `TODO:<id>`.
   - Dropping onto `MatrixGrid` cell or `CalendarGrid` column automatically calls `convertTodoToSlot()`, schedules the time block, and marks todo as completed.
2. **Attendance Confetti:**
   - Marking any lecture as "Katıldım" triggers multi-colored confetti particles.
3. **Keyboard Shortcuts:**
   - `B`: Toggle Amie Sidebar
   - `T`: Go to current week & Today
   - `ArrowLeft` / `ArrowRight`: Week backward/forward
   - `1`: 40-Min Matrix
   - `2`: Daily Agenda & Focus
   - `3`: Weekly Cards
   - `,`: Settings & Database Hub
