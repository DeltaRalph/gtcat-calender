# AGENTS.md — Coding Agent Playbook for GTCAT Calendar

> **System Memory & Engineering Architecture Guide for AI Assistants**  
> Repository: [github.com/DeltaRalph/gtcat-calender](https://github.com/DeltaRalph/gtcat-calender)  
> Working Directory: `C:\projeler\gtcat-calender`

---

## 👤 1. Project Owner & Persona Context
* **Owner:** Erdal Çetin (Student ID: `0201230222`)
* **Academic Curriculum:** Istanbul University Faculty of Law (İÜHF) — Double Branch (`1. Sınıf Çift` & `2. Sınıf Çift`).
* **Workload:** 9 core legal courses (`63 ECTS / AKTS` total):
  - *2. Sınıf:* Borçlar Hukuku Genel Hükümler (Amfi 1), Ceza Hukuku Genel Hükümler (Amfi 1), İdare Hukuku, Türk Hukuk Tarihi.
  - *1. Sınıf:* Medeni Hukuk (Amfi 8), Anayasa Hukuku (Amfi 8), Roma Hukuku, Hukuk Başlangıcı, İktisat.
* **Secondary Track:** Tech entrepreneur, software engineer (Deep work, startup meetings, product development).

---

## 🛠️ 2. Tech Stack & Architecture
* **Frontend:** React 19 + TypeScript + Vite 8.
* **Styling:** Tailwind CSS v3 with custom GT3 RS / Amie.so theme (`tailwind.config.js`).
* **Icons:** `lucide-react`.
* **Animations & Micro-interactions:** `canvas-confetti`.
* **Storage Engine:**
  - `localStorage` primary (`gtcat_schedule_slots_v1`, `gtcat_schedule_todos_v1`, `gtcat_schedule_overrides_v1`).
  - Automatic Rolling Snapshots (last 12 states) with instant rollback in `DatabaseModal.tsx`.
* **Deployment Targets:**
  - **Hostinger:** Pre-configured with `public/.htaccess` and `public/api/sync.php` (PHP cloud sync). Run `npm run pack:hostinger` to generate `hostinger-deploy.zip`.
  - **Vercel:** Fully compatible zero-config deployment.

---

## 📂 3. Key Components & File Map

| Path | Purpose |
| :--- | :--- |
| `src/types/calendar.ts` | Complete TypeScript type definitions (`SlotItem`, `TodoItem`, `DayOfWeek`, `Category`, `ViewMode`). |
| `src/hooks/useScheduleStorage.ts` | Central reactive store for slots, todos, dynamic week navigation, snapshots, and date overrides. |
| `src/hooks/useKeyboardShortcuts.ts` | Global keyboard shortcut listeners (`B`, `T`, `←`, `→`, `1`, `2`, `3`, `C`, `,`). |
| `src/utils/dateUtils.ts` | Infinite multi-week calendar engine (Monday calculation, Turkish date formatting, academic semester week logic). |
| `src/components/AmieTodoSidebar.tsx` | Collapsible left split-pane: actionable todos, category filters, progress bar, draggable cards. |
| `src/components/MatrixGrid.tsx` | 40-minute İÜHF time-slot matrix with drag-to-schedule target cells. |
| `src/components/DailyAgendaView.tsx` | Day-by-day executive view + Pomodoro focus timer (with manual `+5m/-5m` adjustments and session history). |
| `src/components/CalendarGrid.tsx` | 7-day Kanban style weekly cards view. |
| `src/components/Header.tsx` | Single-row frosted glass header with week navigator, sidebar toggle, and view modes. |
| `src/components/SettingsModal.tsx` | Master hub for Hostinger cloud sync, JSON export/import, snapshot restore, and print. |
| `src/components/SlotDrawer.tsx` | Slide-over inspector for lecture notes, case law checklists, and status tracking. |
| `src/components/QuickSyllabusModal.tsx` | 9-course İÜHF exam strategies and ECTS guide modal. |

---

## 🛑 4. Immutable Engineering Rules
1. **Never use childish blue (`blue-500`):** 2. Sınıf courses MUST use **Ice Titanium / Slate Silver** (`#94A3B8`).
2. **Preserve Amie.so Split-Pane:** The left Todo panel must remain draggable into the calendar matrix.
3. **Preserve Offline-First Reliability:** Every feature must run without requiring an active backend connection.
4. **Preserve Git Sync:** The repository is linked to `https://github.com/DeltaRalph/gtcat-calender` on branch `main`.
