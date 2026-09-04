import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const BentoGrid: React.FC = () => {
  return (
    <section id="features-bento" className="py-16 border-t border-slate-200/80 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/70 text-amber-900 border border-amber-200/80 text-xs font-bold uppercase tracking-wider">
            <span>🐕</span> Pre-Flight Inspection Suite
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Engineered to catch what Excel keeps hidden
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            SheetHound is your loyal pre-flight watchdog. It inspects every layer of your spreadsheet 
            before you email it to managers, clients, or investors.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Bento Card 1 (Wide): External Links & #REF! Hunter */}
          <div className="md:col-span-2 bg-gradient-to-br from-white to-amber-50/40 p-6 sm:p-8 rounded-3xl border border-amber-200/80 shadow-xs space-y-4 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 text-2xl">
                🔗
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-200/80 text-amber-900">
                The Financial Manager Shield
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">
                Ghost External Links &amp; #REF! Breaker Sniffer
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
                Formulas pointing to <code className="bg-amber-100/80 px-1 py-0.5 rounded text-amber-900 font-mono text-xs">[2024_Budget.xlsx]</code> work on your PC, 
                but when emailed to someone else, Excel displays <strong className="text-rose-600">#REF!</strong>. 
                SheetHound catches every external workbook reference and pinpoints the exact cell coordinates.
              </p>
            </div>

            {/* Visual Mini Mockup */}
            <div className="p-3 bg-white/90 rounded-2xl border border-amber-200/80 font-mono text-xs text-slate-700 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Formula found at Sheet1!D5</span>
                <span className="text-rose-600 font-bold">Risk: #REF! on recipient's PC</span>
              </div>
              <div className="text-amber-900 font-semibold truncate">
                ='[C:\FinModel\2024_Master_Budget.xlsx]Summary'!$C$10
              </div>
            </div>
          </div>

          {/* Bento Card 2: Isolated Stray Cell Radar */}
          <div className="bg-gradient-to-br from-white to-purple-50/40 p-6 sm:p-8 rounded-3xl border border-purple-200/80 shadow-xs space-y-4 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20 text-2xl">
                🏝️
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-200/80 text-purple-900">
                Density Radar
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">
                Isolated Stray Cell Radar
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Uses our <strong>10-cell neighborhood density algorithm</strong> to distinguish between real tables and accidental scratchpad notes dropped 200 rows down.
              </p>
            </div>

            <div className="p-3 bg-white/90 rounded-2xl border border-purple-200/80 text-xs font-mono text-purple-900 shadow-2xs">
              <span className="font-bold text-[10px] uppercase text-purple-700 block mb-0.5">Cell W180 Content:</span>
              "scratchpad: check offshore numbers..."
            </div>
          </div>

          {/* Bento Card 3: Deep Tab Visibility */}
          <div className="bg-gradient-to-br from-white to-rose-50/40 p-6 sm:p-8 rounded-3xl border border-rose-200/80 shadow-xs space-y-4 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-600/20 text-2xl">
                🕵️
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-200/80 text-rose-900">
                Deep Inspection
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">
                xlSheetVeryHidden Unmasker
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Standard Excel hides <code className="bg-rose-100 px-1 py-0.5 rounded text-rose-800 text-[11px]">xlSheetVeryHidden</code> tabs completely. 
                SheetHound unpacks the raw workbook XML to reveal sensitive payroll, draft, or internal calculation sheets.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[11px]">Visible</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold text-[11px]">Hidden</span>
              <span className="px-2 py-0.5 rounded-full bg-rose-200 text-rose-900 font-bold text-[11px] animate-pulse">Very Hidden</span>
            </div>
          </div>

          {/* Bento Card 4 (Wide): Formula Directory & Linking Map */}
          <div className="md:col-span-2 bg-gradient-to-br from-white to-blue-50/40 p-6 sm:p-8 rounded-3xl border border-blue-200/80 shadow-xs space-y-4 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20 text-2xl">
                🗺️
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-200/80 text-blue-900">
                Full Index
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">
                Searchable Formula Directory &amp; Linking Map
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
                A complete catalog of every single formula in your workbook. Filter by sheet, search for functions (e.g. <code className="bg-blue-100 px-1 py-0.5 rounded text-blue-900 font-mono text-xs">XLOOKUP</code>), 
                and see cross-sheet dependency tags indicating which tabs feed each calculation.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 bg-white/90 rounded-xl border border-blue-200/80">
                <span className="text-slate-400 block text-[10px]">Sheet1!C1</span>
                <span className="font-semibold text-slate-800">=A1 + B2</span>
              </div>
              <div className="p-2.5 bg-white/90 rounded-xl border border-blue-200/80">
                <span className="text-blue-600 block text-[10px] font-sans font-semibold">🔗 Cross-Sheet: Q3_Data</span>
                <span className="font-semibold text-slate-800">='Q3_Data'!C4 * 1.08</span>
              </div>
            </div>
          </div>

          {/* Bento Card 5: Typography & Color Swatch Board */}
          <div className="bg-gradient-to-br from-white to-emerald-50/40 p-6 sm:p-8 rounded-3xl border border-emerald-200/80 shadow-xs space-y-4 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 text-2xl">
                🎨
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-200/80 text-emerald-900">
                Style Audit
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">
                Color Palette &amp; Font Audit
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Extracts all brand colors with HEX swatches and checks font consistency to ensure you don't violate brand guidelines or exceed Excel's 64k style limit.
              </p>
            </div>

            <div className="flex items-center gap-1.5 pt-1">
              <div className="w-6 h-6 rounded-lg bg-[#1F4E78] shadow-xs border border-white" title="#1F4E78" />
              <div className="w-6 h-6 rounded-lg bg-[#2E75B6] shadow-xs border border-white" title="#2E75B6" />
              <div className="w-6 h-6 rounded-lg bg-[#385723] shadow-xs border border-white" title="#385723" />
              <div className="w-6 h-6 rounded-lg bg-[#D9E1F2] shadow-xs border border-white" title="#D9E1F2" />
              <span className="text-[11px] text-slate-500 font-mono pl-1">+ copy HEX</span>
            </div>
          </div>

          {/* Bento Card 6 (Full Width or span 2): Privacy Fortress */}
          <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 p-6 sm:p-8 rounded-3xl text-white shadow-md space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-2xl">
                🛡️
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                100% In-Browser Privacy
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">
                Zero Cloud Uploads. Confidential Financials Stay on Your Machine.
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                Corporate finance requires strict confidentiality. SheetHound never uploads your files to any remote server or cloud. 
                Everything is processed right inside your browser's memory using JavaScript and WebAssembly.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap pt-1">
              <span className="flex items-center gap-1.5 text-emerald-300 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Client-Side Only
              </span>
              <span className="flex items-center gap-1.5 text-emerald-300 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> No Backend Databases
              </span>
              <span className="flex items-center gap-1.5 text-emerald-300 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Pure Read-Only Watcher
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
