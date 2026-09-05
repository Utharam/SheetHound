# 🐕 SheetHound

> **The Spreadsheet Watchdog** — Sniffing Out Ghost Links, Leaks & Stray Cells  
> *Created with care by [Utharam](https://utharam.github.io/)* • *Dedicated to **Veeran, the Indian Spitz** 🐾*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-sheethound.utharam.workers.dev-amber?style=for-the-badge&logo=cloudflare)](https://sheethound.utharam.workers.dev/)
[![Privacy Guaranteed](https://img.shields.io/badge/Privacy-100%25%20In--Browser%20Memory-emerald.svg)](#-100-in-browser-privacy--safety)
[![Tests Passing](https://img.shields.io/badge/Audit%20Tests-9%2F9%20Passing-emerald.svg)](#-automated-verification-suite)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.x-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com/)

---

## ⚡ What is SheetHound?

**SheetHound** is an ultra-fast, pre-flight inspection tool built for accountants, financial analysts, and corporate modelers.

Before emailing a critical financial model to your CFO, investment committee, or client, drop it into SheetHound. In milliseconds, it sniffs out embarrassing formula errors, broken external references, hidden tabs, rogue formatting, and stray scratchpad cells.

### 🛡️ Core Philosophy: The Pure Watcher
- **Read-Only Inspection:** SheetHound never modifies, rewrites, or touches your original file. Zero risk of workbook corruption.
- **100% Client-Side Privacy:** Your spreadsheet never leaves your machine. Parsing and auditing execute completely inside your browser's local RAM (`exceljs` + `jszip`). Disconnect your internet and it still works flawlessly.

---

## ✨ Features

### 🗺️ Interactive Spatial Data Density Heatmap & Minimap *(New)*
Gain instant visual awareness of your worksheet geography with an adaptive 24×12 grid radar:
- **Visual Accumulation vs. Dispersion:** See where data is concentrated in dense tables versus scattered across the canvas.
- **Primary Cluster Detection:** Automatically identifies and bounds the main data block (e.g. *96% of data concentrated in `A1:E7`*).
- **Stray Cell Outlier Tagging:** Instantly pins isolated scratchpad calculations stranded far outside the primary table range (e.g., at `W180`).
- **Zero-Flicker Live Inspector:** Hover over any tile to preview its cell coordinates and sample data values with guaranteed stable layout height.
- **Tab Cycling Controls:** Seamlessly loop through all worksheets using `[← Prev Tab]` / `[Next Tab →]` buttons or direct tab indicator pills.
- **Clean Toggle Mode:** Tucked behind an on-demand toggle in both the Executive Summary and Tab Breakdown to keep your audit review focused and clutter-free.

### 🔗 Ghost Link & `#REF!` Sniffer (The FM Shield)
Detects formulas referencing external workbooks (e.g. `='[2024_Budget.xlsx]Sheet1'!$B$12`) that will instantly break and trigger `#REF!` errors as soon as the file is opened outside your local company drive.

### 🏝️ Isolated Stray Cell Radar
Pinpoint stray scratchpad math forgotten 100+ rows or columns away. SheetHound's **10-cell neighborhood density algorithm** ($\pm 5$ rows, $\pm 5$ columns) isolates rogue outlier calculations with content previews while ignoring legitimate table expansions.

### 🕵️ Hidden & `xlSheetVeryHidden` Unmasker
Reveals standard hidden worksheets as well as VBA-level `xlSheetVeryHidden` tabs (which cannot be viewed from the normal Excel right-click menu and often house sensitive payroll, margin, or cap table numbers).

### 💥 Complete Formula Error Registry
Instantly indexes every `#REF!`, `#DIV/0!`, `#VALUE!`, `#N/A`, `#NAME?`, and `#NUM!` error with exact cell coordinates, sheet names, formula definitions, and cached values.

### 🎨 Typography & Design Palette Audit
Catalogs all font families and cell fill colors across the workbook, helping you maintain brand consistency and spot rogue formatting before board presentations.

### 📜 Executive Audit Certificate & Multi-Format Export
- **Print / Save as PDF:** Generates a pristine, standalone executive audit certificate. Features custom print stylesheets, clean A4/letter page breaks, exact color rendition, and zero website UI chrome.
- **Markdown Report (`.md`):** Formatted tables ready to copy-paste directly into Slack, Notion, PRs, or GitHub discussions.
- **Standalone HTML Report (`.html`):** Offline-ready, self-contained audit summary viewable in any web browser.
- **JSON Data Schema (`.json`):** Full structured programmatic audit payload for automated CI/CD validation pipelines.

---

## 🔒 100% In-Browser Privacy & Safety

Spreadsheets frequently contain sensitive financial figures, payroll details, and trade secrets. SheetHound is engineered with strict client-only principles:

1. **We Never See Your Data:** There are zero backend servers, databases, or tracking telemetry receiving your files.
2. **Volatile Browser RAM:** Your file is loaded strictly into your browser's temporary memory and immediately discarded upon page refresh or tab close.
3. **Works 100% Offline:** Disconnect from Wi-Fi or turn on Airplane Mode — SheetHound runs completely uninterrupted.

### 🤖 Verify with AI (Prompt for ChatGPT / Claude / Gemini)
If your compliance or security team wants independent verification, copy and paste this into any LLM:

```text
Explain how client-side web apps like SheetHound (built with ExcelJS and JSZip in React) process files locally in browser memory without sending data to any external server or backend. Is my spreadsheet private if the app runs entirely in the browser DOM?
```

---

## 🐕 Dedication: Veeran the Indian Spitz

SheetHound was built in affectionate tribute to **Veeran**, a brave, loyal Indian Spitz. Just as Veeran watched over the home with razor-sharp ears and unwavering loyalty, SheetHound stands guard over your workbooks to ensure no rogue error slips past unnoticed.

> **Quirky Easter Egg:** Click the subtle `🐾` paw emoji next to Utharam in the footer to reveal the Veeran tribute!

---

## 🧪 Automated Verification Suite

SheetHound includes an automated end-to-end verification suite testing all core auditing mechanics against simulated enterprise workbooks:

```bash
npx tsx src/test/verifyAudit.ts
```

**Passing 9/9 Automated Checks:**
- ✅ `xlSheetVeryHidden` sheet detected correctly
- ✅ Hidden sheet detected correctly
- ✅ External link references detected
- ✅ Formula errors (`#REF!`, `#DIV/0!`) cataloged
- ✅ Farthest cell identified
- ✅ Cross-sheet formula references mapped
- ✅ Spatial heatmaps computed for all worksheets
- ✅ Stray outliers pinned with coordinate radar
- ✅ Primary cluster bounding and density percentages verified

---

## 🚀 Getting Started

### Local Development

```bash
# Clone repository
git clone https://github.com/Utharam/SheetHound.git
cd SheetHound

# Install dependencies
npm install

# Start local Vite dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
```

Generates a production-ready static bundle in `dist/` with automated Single Page Application fallback routing and asset caching headers.

### Cloudflare Deployment

SheetHound is deployed to Cloudflare Workers Static Assets with automated GitHub CI/CD:
- Configuration handled via [`wrangler.jsonc`](./wrangler.jsonc).
- Automated builds triggered on push to `main`.
- Live production endpoint: **[https://sheethound.utharam.workers.dev/](https://sheethound.utharam.workers.dev/)**

---

## 🛠️ Built With

- **Framework:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Spreadsheet Parsing:** [ExcelJS](https://github.com/exceljs/exceljs) & [JSZip](https://stuk.github.io/jszip/)
- **Deployment:** [Cloudflare Workers Static Assets](https://developers.cloudflare.com/workers/)
- **Icons:** [Lucide React](https://lucide.dev/)

---

## 📄 License & Credits

Created by **[Utharam](https://utharam.github.io/)**.  
All rights reserved.
