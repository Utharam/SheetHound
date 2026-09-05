# 🐕 SheetHound

> **The Spreadsheet Watchdog** — Sniffing Out Ghost Links, Leaks & Stray Cells  
> *Created with care by [Utharam](https://utharam.github.io/)* • *Dedicated to **Veeran, the Indian Spitz** 🐾*

[![Live App](https://img.shields.io/badge/Live%20Demo-sheethound.utharam.workers.dev-amber?style=for-the-badge&logo=cloudflare)](https://sheethound.utharam.workers.dev/)
[![Privacy Guaranteed](https://img.shields.io/badge/Privacy-100%25%20In--Browser%20Memory-emerald.svg)](#-100-in-browser-privacy--safety)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.x-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com/)

---

## ⚡ What is SheetHound?

**SheetHound** is a fast, pre-flight inspection tool built for accountants, finance managers, and spreadsheet inhabitants. 

Before emailing a sensitive model to your CFO, clients, or audit committee, drop it into SheetHound to catch embarrassing formula errors, broken external references, hidden tabs, and stray scratchpad cells in milliseconds.

### 🛡️ Core Philosophy: The Pure Watcher
- **Read-Only Inspection:** SheetHound never modifies, rewrites, or saves over your files. Zero risk of workbook corruption.
- **100% Client-Side Privacy:** Your spreadsheet never leaves your computer. Parsing and auditing run entirely in your local browser memory (`exceljs` + `jszip`). Turn off Wi-Fi and it still audits flawlessly.

---

## ✨ Features

### 🔗 Ghost Link & `#REF!` Sniffer (The FM Shield)
Detects formulas referencing external workbooks (e.g. `='[2024_Budget.xlsx]Sheet1'!$B$12`) that will break and explode into `#REF!` as soon as the file is opened by someone outside your network.

### 🏝️ Isolated Stray Cell Radar
Financial models often have stray scratchpad calculations forgotten 100+ rows or columns away. SheetHound uses a **10-cell neighborhood density algorithm** ($\pm 5$ rows, $\pm 5$ cols) to pinpoint isolated outlier cells with content previews while ignoring legitimate table expansions.

### 🕵️ Hidden & `xlSheetVeryHidden` Unmasker
Finds standard hidden worksheets as well as VBA-level `xlSheetVeryHidden` tabs (which cannot be unhidden from the normal Excel right-click menu and often contain sensitive payroll, cap table, or margin formulas).

### 💥 Complete Formula Error Registry
Instantly indexes every `#REF!`, `#DIV/0!`, `#VALUE!`, `#N/A`, `#NAME?`, and `#NUM!` error with exact cell coordinates, sheet names, formula logic, and cached values.

### 🎨 Typography & Design Palette Audit
Catalogs all font families and cell colors used across the workbook, helping you maintain brand consistency and spot rogue formatting before client delivery.

### 📜 Executive Audit Certificate & Multi-Format Export
- **Print / Save as PDF:** Formatted executive audit certificate with zero website chrome, clean A4/letter page breaks, and exact print color reproduction.
- **Standalone HTML Report (`.html`):** Offline-ready, styled certificate viewable in any browser.
- **Markdown (`.md`):** Formatted tables ready to copy-paste into Slack, Notion, or GitHub.
- **JSON Data (`.json`):** Complete programmatic audit schema for automated pipelines.

---

## 🔒 100% In-Browser Privacy & Safety

Your spreadsheets contain sensitive financial numbers, payroll, and proprietary business logic. SheetHound was built with strict privacy-first principles:

1. **We Can't See Your Data:** We do not have servers, databases, or analytics tracking your spreadsheets.
2. **Local Memory Only:** Your file is loaded directly into your browser's local RAM and discarded when you close or refresh the tab.
3. **Works 100% Offline:** Disconnect from the internet or go into Airplane Mode — SheetHound will function identically.

### 🤖 Ask Your LLM (Copy & Paste Verification)
If you or your compliance team want to verify this, paste this prompt into ChatGPT, Claude, or Gemini:

```text
Explain how client-side web apps like SheetHound (built with ExcelJS and JSZip in React) process files locally in browser memory without sending data to any external server or backend. Is my spreadsheet private if the app runs entirely in the browser DOM?
```

---

## 🐕 Dedication: Veeran the Indian Spitz

SheetHound is dedicated with pride and affection to **Veeran**, a brave, loyal Indian Spitz. Just like Veeran guarded the home with sharp ears and a vigilant bark, SheetHound stands watch over your workbooks to ensure nothing suspicious slips past.

Click the 🐕 dog mascot in the top navbar or footer to open the Veeran Easter egg!

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/Utharam/SheetHound.git
cd SheetHound

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
```

The output bundle will be generated in `dist/`, ready to deploy to GitHub Pages, Cloudflare Pages, Vercel, or any static web host.

---

## 🛠️ Built With

- **Framework:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Spreadsheet Parsing:** [ExcelJS](https://github.com/exceljs/exceljs) & [JSZip](https://stuk.github.io/jszip/)
- **Icons:** [Lucide React](https://lucide.dev/)

---

## 📄 License & Credits

Created by **[Utharam](https://utharam.github.io/)**.  
All rights reserved.
