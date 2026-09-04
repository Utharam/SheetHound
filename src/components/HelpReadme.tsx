import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Link,
  EyeOff,
  Maximize2,
} from 'lucide-react';

export const HelpReadme: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Why do external links return #REF! when I email an Excel file?',
      a: "When you write a formula like `='[C:\\Projects\\Budget.xlsx]Sheet1'!A1`, Excel relies on the target file existing at that exact path on your local hard drive. Once you email that workbook to your Financial Manager or an external client, their computer does not have that file at that path. When they open the file or refresh calculations, Excel breaks and returns #REF! or prompts them to find the missing workbook.",
      icon: <Link className="w-4 h-4 text-amber-600" />,
    },
    {
      q: "What is 'xlSheetVeryHidden' and why doesn't standard Excel show it?",
      a: "Excel worksheets have three visibility states: Visible (0), Hidden (-1), and VeryHidden (2). While regular hidden sheets can be unhidden by right-clicking any tab, 'VeryHidden' sheets cannot be unhidden from Excel's standard user interface—they can only be revealed using VBA code or raw XML editing. People often use VeryHidden tabs to hide executive salaries, internal tax models, or proprietary formulas, forgetting that the data is still embedded in the file and inspectable by technical tools.",
      icon: <EyeOff className="w-4 h-4 text-rose-600" />,
    },
    {
      q: 'How does the Neighborhood Density algorithm detect stray scratchpad cells?',
      a: 'Excel files can be huge, and a real table located 100 rows down is completely normal. To avoid false alarms, SheetHound inspects an 11×11 cell window (±5 rows, ±5 columns) around the farthest horizontal and vertical coordinates. If a distant cell has fewer than 4 populated cells in its vicinity, it is classified as an isolated stray island (a scratchpad note, stray date, or typo) rather than a legitimate data table.',
      icon: <Maximize2 className="w-4 h-4 text-purple-600" />,
    },
    {
      q: 'Is my financial spreadsheet data secure and confidential?',
      a: 'Yes, 100%. SheetHound is a pure client-side application built with JavaScript and WebAssembly. When you drop an Excel file, your browser parses the file entirely in local memory (RAM). Not a single byte of your financial data, formulas, or numbers is ever sent to any external server or API. You can even disconnect your internet and SheetHound will continue working flawlessly.',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
    },
    {
      q: 'Can SheetHound break or alter my Excel file?',
      a: 'Never. SheetHound is strictly a "Watcher" (Read-Only). We do not modify, rewrite, or reserialize your files. It simply reads the data and provides you with the exact cell addresses so you can make informed decisions in Excel.',
      icon: <CheckCircle2 className="w-4 h-4 text-blue-600" />,
    },
  ];

  return (
    <section id="docs-faq" className="py-16 border-t border-slate-200/80 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider border border-slate-200">
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            Readme &amp; Pre-Flight Handbook
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions &amp; Best Practices
          </h2>
          <p className="text-slate-600 text-sm">
            Everything you need to know about spreadsheet health, hidden risks, and audit hygiene.
          </p>
        </div>

        {/* 5-Step Pre-Flight Checklist */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            The 5-Minute Pre-Flight Checklist for Financial Analysts
          </h3>
          <ol className="space-y-2.5 text-xs text-slate-600 list-decimal list-inside leading-relaxed">
            <li>
              <strong className="text-slate-800">Check External Links:</strong> Break or paste-as-values any formulas linking to files stored on your local drive.
            </li>
            <li>
              <strong className="text-slate-800">Resolve Broken References:</strong> Search for and fix all <code className="bg-rose-100 px-1 py-0.5 rounded text-rose-800 font-mono">#REF!</code>, <code className="bg-rose-100 px-1 py-0.5 rounded text-rose-800 font-mono">#DIV/0!</code>, and <code className="bg-rose-100 px-1 py-0.5 rounded text-rose-800 font-mono">#VALUE!</code> cells.
            </li>
            <li>
              <strong className="text-slate-800">Audit Hidden &amp; VeryHidden Tabs:</strong> Ensure no confidential compensation, client data, or draft figures are sitting in forgotten tabs.
            </li>
            <li>
              <strong className="text-slate-800">Clear Stray Scratchpad Data:</strong> Press <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 text-[10px] font-mono">Ctrl + End</kbd> in Excel to make sure your used range doesn't extend thousands of rows beyond your table.
            </li>
            <li>
              <strong className="text-slate-800">Standardize Styling:</strong> Keep font families to 1 or 2 (e.g. Aptos or Calibri) and clean up rogue fill colors before presenting to leadership.
            </li>
          </ol>
        </div>

        {/* Accordion FAQs */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 bg-white hover:bg-slate-50/70 transition cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      {faq.icon}
                    </div>
                    <span className="text-sm font-bold text-slate-900">
                      {faq.q}
                    </span>
                  </div>
                  <div className="text-slate-400">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="p-4 pt-1 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-600 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Dedication Card */}
        <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 text-center space-y-1">
          <div className="text-2xl">🐕 🐾</div>
          <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
            Dedicated to Veeran, the Indian Spitz
          </h4>
          <p className="text-xs text-amber-800 max-w-lg mx-auto leading-relaxed">
            Loyal, sharp, and always watchful. SheetHound was built in honor of Veeran to sniff out errors and watch over your spreadsheets before you hit Send.
          </p>
        </div>

      </div>
    </section>
  );
};
