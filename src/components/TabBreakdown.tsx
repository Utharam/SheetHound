import React, { useState } from 'react';
import {
  Layers,
  Eye,
  EyeOff,
  Link,
  AlertOctagon,
  Maximize2,
  ChevronDown,
  ChevronRight,
  Grid,
} from 'lucide-react';
import type { SheetAudit } from '../types/audit';
import { SheetHeatmapBox } from './SheetHeatmapBox';

interface TabBreakdownProps {
  sheets: SheetAudit[];
}

export const TabBreakdown: React.FC<TabBreakdownProps> = ({ sheets }) => {
  const [expandedSheets, setExpandedSheets] = useState<Record<string, boolean>>(() => {
    // Expand the first sheet or sheets with errors/stray cells by default
    const initial: Record<string, boolean> = {};
    sheets.forEach((s, idx) => {
      if (idx === 0 || s.errorCount > 0 || s.boundary.hasStrayCells || s.externalLinkCount > 0) {
        initial[s.name] = true;
      }
    });
    return initial;
  });

  const [openHeatmaps, setOpenHeatmaps] = useState<Record<string, boolean>>({});

  const toggleExpand = (sheetName: string) => {
    setExpandedSheets((prev) => ({
      ...prev,
      [sheetName]: !prev[sheetName],
    }));
  };

  const toggleHeatmap = (sheetName: string) => {
    setOpenHeatmaps((prev) => ({
      ...prev,
      [sheetName]: !prev[sheetName],
    }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    sheets.forEach((s) => (all[s.name] = true));
    setExpandedSheets(all);
  };

  const collapseAll = () => {
    setExpandedSheets({});
  };

  return (
    <div className="space-y-4">
      {/* Header with expand/collapse all */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            Tab-by-Tab Inspection Breakdown
          </h2>
          <p className="text-xs text-slate-500">
            Examine boundary limits, visibility states, hidden errors, and typography per worksheet
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={expandAll}
            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition cursor-pointer"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition cursor-pointer"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Sheets List */}
      <div className="space-y-3">
        {sheets.map((sheet) => {
          const isExpanded = !!expandedSheets[sheet.name];

          return (
            <div
              key={sheet.id}
              className={`bg-white rounded-xl border transition-all ${
                sheet.visibility === 'veryHidden'
                  ? 'border-rose-300 shadow-xs'
                  : sheet.boundary.hasStrayCells || sheet.errorCount > 0
                  ? 'border-amber-300 shadow-xs'
                  : 'border-slate-200 shadow-xs'
              }`}
            >
              {/* Sheet Summary Bar */}
              <div
                onClick={() => toggleExpand(sheet.name)}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer select-none hover:bg-slate-50/50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="text-slate-400 hover:text-slate-600">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-900 font-mono">
                        {sheet.name}
                      </span>

                      {/* Visibility Badge */}
                      {sheet.visibility === 'visible' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Eye className="w-3 h-3" /> Visible
                        </span>
                      )}
                      {sheet.visibility === 'hidden' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          <EyeOff className="w-3 h-3" /> Hidden
                        </span>
                      )}
                      {sheet.visibility === 'veryHidden' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
                          <EyeOff className="w-3 h-3 text-rose-700" /> xlSheetVeryHidden
                        </span>
                      )}

                      {/* Stray cell warning pill */}
                      {sheet.boundary.hasStrayCells && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                          <Maximize2 className="w-3 h-3" /> Stray Data at {sheet.boundary.farthestCell}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-3 flex-wrap">
                      <span>
                        Farthest Boundary: <strong className="text-slate-700 font-mono">{sheet.boundary.farthestCell}</strong> (Row {sheet.boundary.farthestRow}, Col {sheet.boundary.farthestCol})
                      </span>
                      <span>•</span>
                      <span>{sheet.formulaCount} formulas</span>
                      {sheet.errorCount > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-rose-600 font-semibold">
                            {sheet.errorCount} error{sheet.errorCount > 1 ? 's' : ''}
                          </span>
                        </>
                      )}
                      {sheet.externalLinkCount > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-amber-600 font-semibold">
                            {sheet.externalLinkCount} external link{sheet.externalLinkCount > 1 ? 's' : ''}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Indicators on right */}
                <div className="flex items-center gap-2 self-start md:self-center">
                  {sheet.heatmap && sheet.heatmap.totalCells > 0 && (
                    <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200 shadow-2xs">
                      <Grid className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{sheet.heatmap.totalCells} cells</span>
                      {sheet.boundary.hasStrayCells ? (
                        <span className="text-amber-700 font-bold bg-amber-100/80 px-1.5 py-0.2 rounded text-[10px]">
                          ⚠️ Stray Outlier
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-semibold text-[10px]">
                          ✓ Clustered
                        </span>
                      )}
                    </div>
                  )}

                  {sheet.fonts.length > 0 && (
                    <div className="text-[11px] text-slate-500 bg-slate-100 px-2 py-1 rounded">
                      {sheet.fonts.slice(0, 2).join(', ')}
                      {sheet.fonts.length > 2 && ` +${sheet.fonts.length - 2}`}
                    </div>
                  )}
                  {sheet.colors.length > 0 && (
                    <div className="flex items-center -space-x-1">
                      {sheet.colors.slice(0, 4).map((c, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 rounded-full border border-white shadow-xs"
                          style={{ backgroundColor: c }}
                          title={c}
                        />
                      ))}
                      {sheet.colors.length > 4 && (
                        <span className="text-[10px] text-slate-400 pl-1.5">
                          +{sheet.colors.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Collapsible Details */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-3 border-t border-slate-100 space-y-4 text-xs">
                  {/* Spatial Heatmap Option Button */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <Grid className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 text-xs block">
                          Worksheet Spatial Heatmap &amp; Radar
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {sheet.heatmap ? `${sheet.heatmap.totalCells} cells • ${sheet.heatmap.mainClusterSummary}` : 'Spatial density map'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleHeatmap(sheet.name)}
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-semibold border border-slate-200 text-xs shadow-2xs transition cursor-pointer flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                    >
                      <Grid className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{openHeatmaps[sheet.name] ? 'Hide Heatmap' : 'View Heatmap'}</span>
                    </button>
                  </div>

                  {openHeatmaps[sheet.name] && (
                    <div className="animate-in fade-in duration-150">
                      <SheetHeatmapBox sheet={sheet} />
                    </div>
                  )}

                  {/* Stray Data Callout */}
                  {sheet.boundary.hasStrayCells && (
                    <div className="p-3.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-900 flex items-start gap-3">
                      <Maximize2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                      <div className="space-y-1 w-full">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="font-bold text-xs text-purple-950">
                            Accidental Stray Cell Alert: {sheet.boundary.farthestCell}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-200 text-purple-800">
                            {sheet.boundary.nearbyCellsCount ?? 0} nearby cell(s) within 10 cells
                          </span>
                        </div>
                        <p className="text-xs text-purple-800 leading-relaxed">
                          {sheet.boundary.strayCellExplanation || `Farthest populated cell is ${sheet.boundary.farthestCell}.`}
                        </p>
                        {sheet.boundary.farthestCellValue && (
                          <div className="mt-1 p-2 rounded bg-white/80 border border-purple-200 font-mono text-[11px] text-slate-800 break-all">
                            <span className="text-purple-600 font-sans font-semibold text-[10px] uppercase block mb-0.5">
                              Cell Content Preview:
                            </span>
                            "{sheet.boundary.farthestCellValue}"
                          </div>
                        )}
                        <p className="text-[11px] text-purple-700 pt-0.5">
                          💡 <strong>Check cell {sheet.boundary.farthestCell} in Excel:</strong> Since it has almost no neighboring data, it may be an accidental scratch note or typo inflating your file bounds.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Errors in this Tab */}
                  {sheet.errorCount > 0 && (
                    <div className="space-y-1.5">
                      <div className="font-bold text-rose-700 flex items-center gap-1.5">
                        <AlertOctagon className="w-3.5 h-3.5" />
                        Formula Errors in this sheet ({sheet.errorCount})
                      </div>
                      <div className="bg-rose-50/50 rounded-lg border border-rose-200 divide-y divide-rose-100 overflow-hidden">
                        {sheet.errors.map((err, i) => (
                          <div key={i} className="p-2.5 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="px-1.5 py-0.5 rounded bg-rose-200 text-rose-800 font-mono font-bold text-[11px]">
                                {err.cell}
                              </span>
                              <span className="font-bold text-rose-700">{err.errorType}</span>
                              {err.formula && (
                                <code className="text-slate-600 bg-white/70 px-1.5 py-0.5 rounded border border-rose-100 font-mono text-[11px]">
                                  {err.formula.startsWith('=') ? err.formula : `=${err.formula}`}
                                </code>
                              )}
                            </div>
                            <span className="text-slate-400 text-[10px]">Row {err.row}, Col {err.col}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* External Links in this Tab */}
                  {sheet.externalLinkCount > 0 && (
                    <div className="space-y-1.5">
                      <div className="font-bold text-amber-700 flex items-center gap-1.5">
                        <Link className="w-3.5 h-3.5" />
                        External Workbook Links in this sheet ({sheet.externalLinkCount})
                      </div>
                      <div className="bg-amber-50/50 rounded-lg border border-amber-200 divide-y divide-amber-100 overflow-hidden">
                        {sheet.externalLinks.map((ext, i) => (
                          <div key={i} className="p-2.5 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 font-mono font-bold text-[11px]">
                                {ext.cell}
                              </span>
                              <span className="text-slate-600">points to</span>
                              <span className="font-semibold text-amber-900 font-mono">
                                [{ext.targetWorkbook}]
                              </span>
                              {ext.targetSheet && (
                                <span className="text-slate-500 font-mono">
                                  {ext.targetSheet}!{ext.targetRange || ''}
                                </span>
                              )}
                            </div>
                            <code className="text-slate-500 text-[10px] font-mono hidden md:block">
                              {ext.formula}
                            </code>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Fonts & Colors used in this tab */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <span className="font-semibold text-slate-700 block mb-1">Fonts Used</span>
                      <div className="flex flex-wrap gap-1.5">
                        {sheet.fonts.length > 0 ? (
                          sheet.fonts.map((f, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 text-[11px]"
                            >
                              {f}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400">Default sheet font</span>
                        )}
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <span className="font-semibold text-slate-700 block mb-1">Colors Used</span>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {sheet.colors.length > 0 ? (
                          sheet.colors.map((c, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-1 bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[11px] font-mono"
                            >
                              <div
                                className="w-3 h-3 rounded-full border border-slate-300"
                                style={{ backgroundColor: c }}
                              />
                              <span>{c}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-slate-400">Default monochrome styling</span>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
