import React, { useState } from 'react';
import {
  Layers,
  Link,
  AlertOctagon,
  Maximize2,
  Palette,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
  Grid,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import type { WorkbookAuditReport } from '../types/audit';
import { SheetHeatmapBox } from './SheetHeatmapBox';

interface ExecutiveSummaryProps {
  report: WorkbookAuditReport;
  onNavigateTab: (tabId: string) => void;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({
  report,
  onNavigateTab,
}) => {
  const [showHeatmap, setShowHeatmap] = useState<boolean>(false);

  // Default to sheet with stray cells if available, else first sheet
  const defaultSheetIndex = React.useMemo(() => {
    const strayIdx = report.sheets.findIndex((s) => s.boundary.hasStrayCells);
    return strayIdx >= 0 ? strayIdx : 0;
  }, [report.sheets]);

  const [selectedSheetIdx, setSelectedSheetIdx] = useState<number>(defaultSheetIndex);
  const activeSheet = report.sheets[selectedSheetIdx] || report.sheets[0];

  const hasIssues =
    report.totalErrors > 0 ||
    report.totalExternalLinks > 0 ||
    report.veryHiddenSheetsCount > 0 ||
    report.strayDataWarningCount > 0;

  return (
    <div className="space-y-6">
      
      {/* Watchdog Verdict Banner (Bento Hero) */}
      <div
        className={`p-5 rounded-3xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs transition ${
          hasIssues
            ? 'bg-gradient-to-r from-amber-500/10 via-amber-50 to-white border-amber-200'
            : 'bg-gradient-to-r from-emerald-500/10 via-emerald-50 to-white border-emerald-200'
        }`}
      >
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-2xl shadow-xs shrink-0">
            {hasIssues ? '🐕🐾' : '🐕🦴'}
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                {hasIssues
                  ? 'Watchdog Notice: Issues detected before distribution'
                  : 'Clean Bill of Health: SheetHound approves this workbook!'}
              </h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  hasIssues
                    ? 'bg-amber-200 text-amber-900'
                    : 'bg-emerald-200 text-emerald-900'
                }`}
              >
                {hasIssues ? 'Review Advised' : 'Safe to Send'}
              </span>
            </div>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              {hasIssues
                ? `SheetHound caught ${report.totalErrors} formula errors, ${report.totalExternalLinks} external workbook links, and ${report.strayDataWarningCount} isolated stray cell islands. Review the deep dives below before hitting Send.`
                : 'All formula references are self-contained, boundaries are compact, and zero broken links were detected.'}
            </p>
          </div>
        </div>

        {/* Quick Action Pills */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {report.totalExternalLinks > 0 && (
            <button
              onClick={() => onNavigateTab('external-links')}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition shadow-2xs cursor-pointer flex items-center gap-1"
            >
              <span>{report.totalExternalLinks} External Links</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
          {report.totalErrors > 0 && (
            <button
              onClick={() => onNavigateTab('errors')}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition shadow-2xs cursor-pointer flex items-center gap-1"
            >
              <span>{report.totalErrors} Errors</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Bento-Style KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Card 1: Sheets & Visibility */}
        <div
          onClick={() => onNavigateTab('tabs')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Worksheets
            </span>
            <Layers className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition" />
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {report.totalSheets}
            </div>
            <div className="flex items-center gap-1.5 mt-2.5 flex-wrap text-[11px]">
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 font-medium">
                <Eye className="w-3 h-3" /> {report.visibleSheetsCount}
              </span>
              {report.hiddenSheetsCount > 0 && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-100 font-medium">
                  <EyeOff className="w-3 h-3" /> {report.hiddenSheetsCount}
                </span>
              )}
              {report.veryHiddenSheetsCount > 0 && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200 font-bold animate-pulse">
                  <EyeOff className="w-3 h-3 text-rose-600" /> {report.veryHiddenSheetsCount} VeryHidden
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card 2: External Links */}
        <div
          onClick={() => onNavigateTab('external-links')}
          className={`p-5 rounded-2xl border shadow-xs hover:shadow-sm transition cursor-pointer flex flex-col justify-between group ${
            report.totalExternalLinks > 0
              ? 'bg-amber-50/40 border-amber-300 hover:border-amber-400'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              External Links
            </span>
            <Link className={`w-4 h-4 ${report.totalExternalLinks > 0 ? 'text-amber-600' : 'text-slate-400'}`} />
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {report.totalExternalLinks}
            </div>
            <div className="text-[11px] mt-2.5">
              {report.totalExternalLinks > 0 ? (
                <span className="text-amber-900 font-semibold bg-amber-100/80 px-2 py-0.5 rounded-full">
                  Across {report.uniqueExternalFiles.length} external file(s)
                </span>
              ) : (
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Zero dependencies
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card 3: Formula Errors */}
        <div
          onClick={() => onNavigateTab('errors')}
          className={`p-5 rounded-2xl border shadow-xs hover:shadow-sm transition cursor-pointer flex flex-col justify-between group ${
            report.totalErrors > 0
              ? 'bg-rose-50/40 border-rose-300 hover:border-rose-400'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Formula Errors
            </span>
            <AlertOctagon className={`w-4 h-4 ${report.totalErrors > 0 ? 'text-rose-600' : 'text-slate-400'}`} />
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {report.totalErrors}
            </div>
            <div className="text-[11px] mt-2.5">
              {report.totalErrors > 0 ? (
                <span className="text-rose-800 font-bold bg-rose-100/80 px-2 py-0.5 rounded-full">
                  Contains #REF! / #DIV/0!
                </span>
              ) : (
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> All calculations valid
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card 4: Stray Data Alerts */}
        <div
          onClick={() => onNavigateTab('tabs')}
          className={`p-5 rounded-2xl border shadow-xs hover:shadow-sm transition cursor-pointer flex flex-col justify-between group ${
            report.strayDataWarningCount > 0
              ? 'bg-purple-50/40 border-purple-300 hover:border-purple-400'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Stray Data
            </span>
            <Maximize2 className={`w-4 h-4 ${report.strayDataWarningCount > 0 ? 'text-purple-600' : 'text-slate-400'}`} />
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {report.strayDataWarningCount}
            </div>
            <div className="text-[11px] mt-2.5">
              {report.strayDataWarningCount > 0 ? (
                <span className="text-purple-800 font-semibold bg-purple-100/80 px-2 py-0.5 rounded-full">
                  Isolated cell islands found
                </span>
              ) : (
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Compact data bounds
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card 5: Typography & Colors */}
        <div
          onClick={() => onNavigateTab('design')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Styling Footprint
            </span>
            <Palette className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition" />
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {report.uniqueFontsCount} <span className="text-xs font-normal text-slate-400 font-sans">fonts</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-2.5">
              <span>{report.uniqueColorsCount} unique color swatches</span>
            </div>
          </div>
        </div>

      </div>

      {/* Spatial Data Heatmap Option Section (Hidden by Default) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden transition">
        <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 text-white">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
              🗺️
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-bold text-slate-100 tracking-tight">
                  Worksheet Spatial Data Heatmap &amp; Radar
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Optional Tool
                </span>
                {report.strayDataWarningCount > 0 && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                    ⚠️ Stray Outliers Detected
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Inspect 2D visual maps of where data is accumulated, scattered, or isolated across all {report.totalSheets} tabs.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowHeatmap((prev) => !prev)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-xs flex items-center gap-2 cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <Grid className="w-4 h-4" />
            <span>{showHeatmap ? 'Hide Data Heatmap' : 'Open Data Heatmap'}</span>
            {showHeatmap ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Collapsible Heatmap Drawer with Tab Circling */}
        {showHeatmap && (
          <div className="p-5 sm:p-6 border-t border-slate-200 bg-slate-50/50 space-y-4 animate-in fade-in duration-200">
            {activeSheet && (
              <SheetHeatmapBox
                sheet={activeSheet}
                allSheets={report.sheets}
                currentSheetIndex={selectedSheetIdx}
                onSelectSheet={(newIdx) => setSelectedSheetIdx(newIdx)}
              />
            )}
          </div>
        )}
      </div>

    </div>
  );
};
