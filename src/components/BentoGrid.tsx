import React from 'react';
import { Map, Link2, EyeOff, FileCode2, Printer } from 'lucide-react';

export const BentoGrid: React.FC = () => {
  return (
    <section id="features-bento" className="py-16 border-t border-slate-200/90 bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-slate-800 border border-slate-200 text-xs font-bold uppercase tracking-wider shadow-2xs">
            <span className="text-amber-700 font-mono">[Core Diagnostic Suite]</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Engineered to catch what Excel keeps hidden
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            SheetHound is an objective, deterministic watchdog. It inspects calculation dependencies, 
            ghost paths, and spatial outliers before your workbook reaches stakeholders.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Bento Card 1 (Wide): Ghost External Links & #REF! Hunter */}
          <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-4 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs text-xl">
                <Link2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                MODULE: LINK_HUNTER
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-slate-950 tracking-tight">
                Ghost External Links &amp; #REF! Breaker Sniffer
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
                Formulas pointing to <code className="bg-slate-100 px-1 py-0.5 rounded text-amber-900 font-mono text-xs">[2024_Budget.xlsx]</code> resolve on your local machine, 
                but explode into <strong className="text-rose-600 font-mono">#REF!</strong> when emailed to leadership. 
                SheetHound extracts every external reference with sheet names and cell coordinates.
              </p>
            </div>

            {/* Visual Mini Mockup */}
            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200 font-mono text-xs text-slate-700 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Coordinates: Sheet1!D5</span>
                <span className="text-rose-600 font-bold">Severity: Breaking Dependency</span>
              </div>
              <div className="text-rose-800 font-semibold truncate">
                ='[C:\FinModel\2024_Master_Budget.xlsx]Summary'!$C$10
              </div>
            </div>
          </div>

          {/* Bento Card 2: Spatial Data Density Heatmap & Minimap Radar */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-4 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center shadow-xs text-xl">
                <Map className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                24×12 RADAR
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-slate-950 tracking-tight">
                Spatial Data Density Heatmap
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Adaptive canvas minimap showing where tables accumulate and pinpointing stray outlier calculations 150+ rows away.
              </p>
            </div>

            {/* Simulated Heatmap Tiles */}
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="grid grid-cols-8 gap-1">
                <div className="h-3 rounded-xs bg-amber-600" title="Dense cluster" />
                <div className="h-3 rounded-xs bg-amber-500" title="Dense cluster" />
                <div className="h-3 rounded-xs bg-amber-400" title="Medium cluster" />
                <div className="h-3 rounded-xs bg-slate-200" />
                <div className="h-3 rounded-xs bg-slate-200" />
                <div className="h-3 rounded-xs bg-slate-200" />
                <div className="h-3 rounded-xs bg-slate-200" />
                <div className="h-3 rounded-xs bg-rose-500 animate-pulse" title="Stray outlier W180" />
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Cluster: A1..C7 (94%)</span>
                <span className="text-rose-600 font-bold">Stray: W180</span>
              </div>
            </div>
          </div>

          {/* Bento Card 3: Deep Tab Visibility */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-4 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs text-xl">
                <EyeOff className="w-5 h-5 text-white" />
              </div>
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-rose-100 text-rose-900 border border-rose-200">
                VBA / XML AUDIT
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-slate-950 tracking-tight">
                xlSheetVeryHidden Unmasker
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Standard Excel completely conceals <code className="bg-rose-50 px-1 py-0.5 rounded text-rose-800 text-[11px] font-mono">xlSheetVeryHidden</code> tabs. 
                SheetHound parses raw workbook XML to unmask hidden payroll, margin, or cap table sheets.
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[10px]">Visible</span>
              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold text-[10px]">Hidden</span>
              <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-900 border border-rose-300 font-bold text-[10px] animate-pulse">VeryHidden</span>
            </div>
          </div>

          {/* Bento Card 4 (Wide): Formula Directory & Linking Map */}
          <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-4 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs text-xl">
                <FileCode2 className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                CROSS-SHEET MAP
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-slate-950 tracking-tight">
                Searchable Formula Directory &amp; Dependency Index
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
                Search, filter, and inspect every formula across every worksheet. Pinpoint cross-sheet dependencies (e.g. <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono text-xs">XLOOKUP</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono text-xs">INDEX/MATCH</code>) to verify calculation continuity.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Direct Precedent</span>
                <span className="font-semibold text-slate-900">=A1 + B2</span>
              </div>
              <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200">
                <span className="text-amber-700 block text-[10px] font-sans font-bold">🔗 Cross-Tab Reference: Q3_Data</span>
                <span className="font-semibold text-slate-900">='Q3_Data'!C4 * 1.08</span>
              </div>
            </div>
          </div>

          {/* Bento Card 5: Executive Print & Multi-Format Export */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-4 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs text-xl">
                <Printer className="w-5 h-5 text-white" />
              </div>
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-200">
                EXECUTIVE EXPORT
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-slate-950 tracking-tight">
                Standalone Print &amp; PDF Certificate
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dedicated print-to-PDF engine with custom print stylesheets, clean A4/letter page breaks, and zero website chrome for board distribution.
              </p>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 pt-1">
              <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">.pdf</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">.html</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">.md</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">.json</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
