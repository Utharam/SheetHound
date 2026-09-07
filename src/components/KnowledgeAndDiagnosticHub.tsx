import React, { useState } from 'react';
import {
  Link2,
  Map,
  EyeOff,
  FileCode2,
  Printer,
  Palette,
  BookOpen,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Link,
  X,
  ArrowRight,
  Layers,
} from 'lucide-react';

interface KnowledgeAndDiagnosticHubProps {
  initialTab?: 'suite' | 'handbook' | null;
}

export const KnowledgeAndDiagnosticHub: React.FC<KnowledgeAndDiagnosticHubProps> = ({
  initialTab = null,
}) => {
  // 'suite' | 'handbook' | null (null = compact sideways overview)
  const [activeExpandedView, setActiveExpandedView] = useState<'suite' | 'handbook' | null>(initialTab);
  const [expandedCardIndex, setExpandedCardIndex] = useState<number | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Why do external links return #REF! when I email an Excel file?',
      a: "When you write a formula like `='[C:\\Projects\\Budget.xlsx]Sheet1'!A1`, Excel relies on the target file existing at that exact path on your local hard drive. Once you email that workbook to your manager, client, or auditor, their machine does not have that file at that path. When they open the workbook or refresh calculations, Excel breaks and evaluates to #REF!.",
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
      a: 'Never. SheetHound is strictly a read-only watchdog. We do not modify, rewrite, or reserialize your files. It simply reads the data and provides you with the exact cell addresses so you can make informed decisions in Excel.',
      icon: <CheckCircle2 className="w-4 h-4 text-blue-600" />,
    },
  ];

  const diagnosticModules = [
    {
      title: 'Ghost External Links & #REF! Hunter',
      module: 'MODULE: LINK_HUNTER',
      icon: <Link2 className="w-5 h-5 text-white" />,
      iconBg: 'bg-amber-500',
      summary:
        "Formulas pointing to external files (e.g. '[2024_Budget.xlsx]') resolve locally, but explode into #REF! when shared with leadership.",
      details:
        'SheetHound deterministic regex parses workbook formula trees to extract workbook names, sheets, and cell addresses before you email the file.',
      snippet: {
        label: 'Sheet1!D5 (Breaking Dependency)',
        code: "='[C:\\FinModel\\2024_Master_Budget.xlsx]Summary'!$C$10",
      },
      tags: ['Ghost Links', 'External Files', '#REF! Breakers'],
    },
    {
      title: 'Spatial Data Density Heatmap & Minimap',
      module: '24×12 RADAR',
      icon: <Map className="w-5 h-5 text-amber-400" />,
      iconBg: 'bg-slate-950',
      summary:
        'Adaptive canvas minimap showing where tables accumulate and pinpointing stray outlier calculations 150+ rows away.',
      details:
        'Divides active sheets into a normalized 24×12 density matrix, visually distinguishing dense financial tables from stray scratchpad notes.',
      snippet: {
        label: 'Cluster: A1..C7 (94% Data)',
        code: 'Stray Outlier: W180 (scratchpad notes)',
      },
      tags: ['24×12 Radar', 'Stray Cells', 'Canvas Heatmap'],
    },
    {
      title: 'xlSheetVeryHidden Deep XML Tab Unmasker',
      module: 'VBA / XML AUDIT',
      icon: <EyeOff className="w-5 h-5 text-white" />,
      iconBg: 'bg-rose-600',
      summary:
        'Standard Excel completely conceals xlSheetVeryHidden tabs. SheetHound parses raw workbook XML to unmask confidential sheets.',
      details:
        'Inspects xl/workbook.xml directly. Identifies hidden compensation models, internal formulas, and draft tabs that standard right-click cannot unhide.',
      snippet: {
        label: 'Visibility Audit',
        code: 'Visible: 2 | Hidden: 1 | VeryHidden: 1',
      },
      tags: ['VeryHidden', 'VBA Security', 'Payroll Protection'],
    },
    {
      title: 'Searchable Formula Directory & Cross-Sheet Index',
      module: 'CROSS-SHEET MAP',
      icon: <FileCode2 className="w-5 h-5 text-amber-400" />,
      iconBg: 'bg-slate-900',
      summary:
        'Search, filter, and inspect every formula across every worksheet. Pinpoint cross-sheet dependencies (e.g. XLOOKUP, INDEX/MATCH).',
      details:
        'Classifies formulas into direct precedents, cross-tab dependencies, and external links with real-time text search and sheet filters.',
      snippet: {
        label: 'Cross-Tab Reference',
        code: "='Q3_Data'!C4 * 1.08",
      },
      tags: ['XLOOKUP', 'INDEX/MATCH', 'Dependencies'],
    },
    {
      title: 'Typography & Color Palette Hygiene Auditor',
      module: 'DESIGN HYGIENE',
      icon: <Palette className="w-5 h-5 text-white" />,
      iconBg: 'bg-indigo-600',
      summary:
        'Audits typography fragmentation (Aptos, Calibri, Arial) and catalogs rogue cell fills to ensure presentation readiness.',
      details:
        'Detects messy copy-pasted formatting, mixed font families, unapproved font sizes, and excessive fill color usage across worksheets.',
      snippet: {
        label: 'Font Inventory',
        code: 'Aptos (82%) • Calibri (14%) • Arial (4%)',
      },
      tags: ['Brand Compliance', 'Font Audit', 'Color Palette'],
    },
    {
      title: 'Standalone Print & PDF Board Certificate',
      module: 'EXECUTIVE EXPORT',
      icon: <Printer className="w-5 h-5 text-white" />,
      iconBg: 'bg-emerald-600',
      summary:
        'Dedicated print-to-PDF engine with custom print stylesheets, clean page breaks, and zero website chrome for board distribution.',
      details:
        'Exports complete forensic inspection certificates as .pdf, .html, .md, or .json for compliance sign-offs and stakeholder packages.',
      snippet: {
        label: 'Export Formats',
        code: '.pdf  •  .html  •  .md  •  .json',
      },
      tags: ['Board PDF', 'Print Engine', 'Audit Trail'],
    },
  ];

  return (
    <section id="features-bento" className="py-16 border-t border-slate-200/90 bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-slate-800 border border-slate-200 text-xs font-bold uppercase tracking-wider shadow-2xs">
            <span className="text-amber-700 font-mono">[Knowledge &amp; Feature Hub]</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Engineered to catch what Excel keeps hidden
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            SheetHound is an objective watchdog. Explore the 6 deterministic inspection engines 
            or review the pre-flight handbook before sending your workbook.
          </p>
        </div>

        {/* SIDEWAYS DUAL CARDS (Clean Overview State) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Sideways Card 1: Core Diagnostic Suite */}
          <div 
            onClick={() => setActiveExpandedView('suite')}
            className={`p-6 sm:p-7 rounded-2xl border transition-all duration-200 cursor-pointer text-left space-y-5 shadow-xs hover:shadow-md ${
              activeExpandedView === 'suite'
                ? 'bg-white border-amber-500 ring-2 ring-amber-500/20 shadow-md'
                : 'bg-white border-slate-200/90 hover:border-amber-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs text-xl">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200 uppercase">
                    6 Diagnostic Engines
                  </span>
                  <h3 className="text-lg font-black text-slate-950 tracking-tight pt-1">
                    Core Diagnostic Suite
                  </h3>
                </div>
              </div>

              <button
                type="button"
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition flex items-center gap-1 shrink-0"
              >
                <span>{activeExpandedView === 'suite' ? 'Active' : 'Reveal Suite'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Deep deterministic inspection engines: Ghost links, 24×12 spatial density radars, 
              xlSheetVeryHidden tabs, cross-sheet formula mapping, design hygiene, and board-ready PDF exports.
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">
                Ghost Links
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">
                24×12 Radar
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">
                VeryHidden Tabs
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">
                Formula Index
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">
                Design Hygiene
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">
                PDF Export
              </span>
            </div>
          </div>

          {/* Sideways Card 2: Readme & Pre-Flight Handbook */}
          <div 
            onClick={() => setActiveExpandedView('handbook')}
            className={`p-6 sm:p-7 rounded-2xl border transition-all duration-200 cursor-pointer text-left space-y-5 shadow-xs hover:shadow-md ${
              activeExpandedView === 'handbook'
                ? 'bg-white border-amber-500 ring-2 ring-amber-500/20 shadow-md'
                : 'bg-white border-slate-200/90 hover:border-amber-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-slate-950 text-white flex items-center justify-center shadow-xs text-xl">
                  <BookOpen className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200 uppercase">
                    Handbook &amp; FAQ
                  </span>
                  <h3 className="text-lg font-black text-slate-950 tracking-tight pt-1">
                    Readme &amp; Pre-Flight Handbook
                  </h3>
                </div>
              </div>

              <button
                type="button"
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition flex items-center gap-1 shrink-0"
              >
                <span>{activeExpandedView === 'handbook' ? 'Active' : 'Open Handbook'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              The 5-minute pre-flight checklist for financial analysts, why external links break into #REF!, 
              how air-gapped in-memory WebAssembly guarantees zero data leakage, and FAQ.
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">
                5-Min Checklist
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">
                #REF! Traps
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">
                Zero Uploads
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">
                Stray Cleanup
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">
                FAQs
              </span>
            </div>
          </div>

        </div>

        {/* EXPANDED REVEAL STAGE */}
        {activeExpandedView && (
          <div className="pt-4 space-y-6 animate-in fade-in duration-300">
            
            {/* Top Navigation & Collapse Bar */}
            <div className="flex items-center justify-between p-2 rounded-2xl bg-white border border-slate-200 shadow-2xs flex-wrap gap-3">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveExpandedView('suite')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeExpandedView === 'suite'
                      ? 'bg-slate-950 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>Core Diagnostic Suite (6 Engines)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveExpandedView('handbook')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeExpandedView === 'handbook'
                      ? 'bg-slate-950 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>Readme &amp; Pre-Flight Handbook</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setActiveExpandedView(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                title="Collapse this section"
              >
                <X className="w-3.5 h-3.5" />
                <span>Collapse View</span>
              </button>
            </div>

            {/* STAGE A: Core Diagnostic Suite (Balanced 3x2 Grid of 6 Symmetrical Expandable Cards) */}
            {activeExpandedView === 'suite' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {diagnosticModules.map((item, idx) => {
                  const isExpanded = expandedCardIndex === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setExpandedCardIndex(isExpanded ? null : idx)}
                      className={`bg-white p-5 sm:p-6 rounded-2xl border transition-all duration-200 text-left space-y-3 cursor-pointer shadow-2xs hover:shadow-xs relative ${
                        isExpanded
                          ? 'border-amber-500 ring-2 ring-amber-500/10'
                          : 'border-slate-200/90 hover:border-slate-300'
                      }`}
                    >
                      {/* Top Header */}
                      <div className="flex items-center justify-between">
                        <div className={`w-9 h-9 rounded-xl ${item.iconBg} text-white flex items-center justify-center shadow-xs text-base`}>
                          {item.icon}
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {item.module}
                        </span>
                      </div>

                      {/* Title & Summary */}
                      <div className="space-y-1">
                        <h4 className="text-base font-black text-slate-950 tracking-tight">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {item.summary}
                        </p>
                      </div>

                      {/* Expandable Live Snippet / Technical Insight */}
                      {isExpanded ? (
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs font-mono animate-in fade-in duration-150">
                          <div className="text-[10px] font-bold text-amber-900 font-sans">
                            {item.snippet.label}
                          </div>
                          <div className="p-2 rounded bg-white border border-slate-200 text-slate-800 text-[11px] truncate">
                            {item.snippet.code}
                          </div>
                          <p className="text-[11px] text-slate-600 font-sans leading-relaxed pt-1">
                            {item.details}
                          </p>
                        </div>
                      ) : (
                        <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 font-sans">
                          <span>Click to expand details</span>
                          <ChevronDown className="w-3.5 h-3.5" />
                        </div>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {item.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-50 border border-slate-200 text-slate-500"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

            {/* STAGE B: Pre-Flight Handbook & FAQ */}
            {activeExpandedView === 'handbook' && (
              <div id="docs-faq" className="max-w-4xl mx-auto space-y-8 text-left">
                
                {/* 5-Step Pre-Flight Checklist */}
                <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
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

                {/* FAQ Accordion */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 px-1">
                    Frequently Asked Questions
                  </h3>
                  {faqs.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div
                        key={idx}
                        className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs transition"
                      >
                        <button
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-slate-50/70 transition cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-3">
                            <span className="p-1 rounded-lg bg-slate-100 shrink-0">
                              {faq.icon}
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-slate-800">
                              {faq.q}
                            </span>
                          </div>
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
};
