import React, { useState } from 'react';
import {
  Grid,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
} from 'lucide-react';
import type { SheetAudit, HeatmapBlock } from '../types/audit';

interface SheetHeatmapBoxProps {
  sheet: SheetAudit;
}

export const SheetHeatmapBox: React.FC<SheetHeatmapBoxProps> = ({
  sheet,
}) => {
  const heatmap = sheet.heatmap;

  // Find default highlighted block (stray block if exists, else top-left block)
  const defaultBlock = React.useMemo(() => {
    if (!heatmap || !heatmap.matrix.length) return null;
    for (const row of heatmap.matrix) {
      for (const block of row) {
        if (block.hasStray) return block;
      }
    }
    for (const row of heatmap.matrix) {
      for (const block of row) {
        if (block.cellCount > 0) return block;
      }
    }
    return heatmap.matrix[0]?.[0] || null;
  }, [heatmap]);

  const [hoveredBlock, setHoveredBlock] = useState<HeatmapBlock | null>(null);

  if (!heatmap || heatmap.matrix.length === 0 || heatmap.totalCells === 0) {
    return (
      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center text-slate-500 text-xs">
        <Grid className="w-5 h-5 mx-auto mb-1 text-slate-400 opacity-60" />
        Empty worksheet — zero populated cells detected.
      </div>
    );
  }

  const activeBlock = hoveredBlock || defaultBlock;

  return (
    <div className="bg-slate-950 text-slate-100 rounded-xl p-4 border border-slate-800 shadow-md space-y-3 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Grid className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-100 flex items-center gap-2">
              Spatial Data Density &amp; Stray Radar
              {sheet.boundary.hasStrayCells ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  <AlertTriangle className="w-2.5 h-2.5" /> Stray Cell at {sheet.boundary.farthestCell}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Compact Bounds
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400">
              Mapped bounds: Rows 1..{sheet.boundary.maxRow} • Cols A..{sheet.boundary.maxCol ? String.fromCharCode(64 + Math.min(26, sheet.boundary.maxCol)) : 'A'} ({heatmap.totalCells} cells total)
            </p>
          </div>
        </div>

        {/* Top-Right Quick Stat */}
        <div className="text-[11px] text-slate-400 flex items-center gap-2">
          <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-slate-300 font-mono text-[10px]">
            Peak Block: {heatmap.maxBlockCount} cells
          </span>
        </div>
      </div>

      {/* Grid Container with Axes */}
      <div className="space-y-1">
        {/* Top Column Axis Indicators */}
        <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 px-7">
          <span>Col A</span>
          <span className="text-slate-400">Horizontal Span →</span>
          <span>Col {heatmap.matrix[0]?.[heatmap.gridCols - 1]?.colEndLetter || 'End'}</span>
        </div>

        <div className="flex items-stretch gap-1.5">
          {/* Left Row Axis Indicator */}
          <div className="flex flex-col justify-between text-[9px] font-mono text-slate-400 py-0.5 text-right w-6 shrink-0">
            <span>R1</span>
            <span className="text-slate-400 rotate-90 my-auto text-[8px]">↓</span>
            <span>R{sheet.boundary.maxRow}</span>
          </div>

          {/* Interactive Heatmap Matrix */}
          <div
            className="flex-1 bg-slate-900/90 p-2 rounded-lg border border-slate-800 grid gap-1 relative select-none"
            style={{
              gridTemplateColumns: `repeat(${heatmap.gridCols}, minmax(0, 1fr))`,
            }}
            onMouseLeave={() => setHoveredBlock(null)}
          >
            {heatmap.matrix.map((row, rIdx) =>
              row.map((block, cIdx) => {
                const isSelected =
                  activeBlock?.rowIdx === rIdx && activeBlock?.colIdx === cIdx;

                // Color calculation
                let bgClass = 'bg-slate-800/40 border-slate-800/80';
                let glowClass = '';

                if (block.hasStray) {
                  bgClass = 'bg-amber-400 border-amber-300 text-slate-950 font-bold';
                  glowClass = 'shadow-[0_0_10px_rgba(251,191,36,0.9)] ring-2 ring-amber-400 animate-pulse';
                } else if (block.hasErrors) {
                  bgClass = 'bg-rose-500 border-rose-400 text-white';
                  glowClass = 'shadow-[0_0_8px_rgba(244,63,94,0.7)]';
                } else if (block.cellCount > 0) {
                  if (block.density > 0.6) {
                    bgClass = 'bg-emerald-400 border-emerald-300 shadow-[0_0_6px_rgba(52,211,153,0.4)]';
                  } else if (block.density > 0.25) {
                    bgClass = 'bg-emerald-600 border-emerald-500';
                  } else {
                    bgClass = 'bg-emerald-800/80 border-emerald-700/60';
                  }
                }

                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    onMouseEnter={() => setHoveredBlock(block)}
                    className={`h-3 sm:h-3.5 rounded-[2.5px] border transition-all duration-100 cursor-pointer flex items-center justify-center relative ${bgClass} ${glowClass} ${
                      isSelected ? 'ring-2 ring-white scale-125 z-10' : 'hover:scale-110'
                    }`}
                    title={`Rows ${block.rowStart}..${block.rowEnd}, Cols ${block.colStartLetter}..${block.colEndLetter}: ${block.cellCount} cells`}
                  >
                    {block.hasStray && (
                      <span className="text-[8px] leading-none font-bold text-slate-950">⚠️</span>
                    )}
                    {!block.hasStray && block.hasErrors && (
                      <span className="text-[7px] leading-none font-bold text-white">!</span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Live Block Inspector Readout */}
      {activeBlock && (
        <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-xs space-y-1 animate-in fade-in duration-150">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-emerald-400 text-[11px]">
                Rows {activeBlock.rowStart}–{activeBlock.rowEnd}, Cols {activeBlock.colStartLetter}–{activeBlock.colEndLetter}
              </span>
              <span className="text-slate-400 text-[11px]">•</span>
              <span className="text-slate-200 text-[11px] font-semibold">
                {activeBlock.cellCount === 0
                  ? 'Empty Block (0 cells)'
                  : `${activeBlock.cellCount} cell${activeBlock.cellCount > 1 ? 's' : ''} (${Math.round(activeBlock.density * 100)}% density)`}
              </span>
            </div>

            {/* Block Badges */}
            <div className="flex items-center gap-1.5">
              {activeBlock.hasStray && (
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold text-[10px] flex items-center gap-1">
                  <AlertTriangle className="w-2.5 h-2.5" /> Isolated Stray ({activeBlock.strayCellAddress})
                </span>
              )}
              {activeBlock.hasErrors && (
                <span className="px-1.5 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 font-semibold text-[10px] flex items-center gap-1">
                  <AlertOctagon className="w-2.5 h-2.5" /> {activeBlock.errorCount} Error{activeBlock.errorCount > 1 ? 's' : ''}
                </span>
              )}
              {!activeBlock.hasStray && !activeBlock.hasErrors && activeBlock.density > 0.5 && (
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold">
                  Main Table Cluster
                </span>
              )}
            </div>
          </div>

          {/* Outlier content explanation or sample */}
          {activeBlock.hasStray && activeBlock.previewSample && (
            <div className="text-[11px] text-amber-200/90 font-mono bg-amber-950/40 border border-amber-900/50 p-1.5 rounded mt-1 break-all">
              <span className="text-amber-400 font-sans font-semibold text-[10px] uppercase block mb-0.5">
                Stray Cell Content:
              </span>
              "{activeBlock.previewSample}"
            </div>
          )}
          {!activeBlock.hasStray && activeBlock.previewSample && (
            <p className="text-[10px] text-slate-400 truncate">
              Sample data: <span className="font-mono text-slate-300">"{activeBlock.previewSample}"</span>
            </p>
          )}
        </div>
      )}

      {/* Footer: Legend & Plain-Language Summary */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-[10px] text-slate-400">
        {/* Legend */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-slate-800/50 border border-slate-700" />
            <span>Empty</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-emerald-800" />
            <span>Sparse</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-emerald-400" />
            <span>Dense Table</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-amber-400 ring-1 ring-amber-300" />
            <span className="text-amber-300 font-semibold">Stray Outlier</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-rose-500" />
            <span className="text-rose-300">Error</span>
          </div>
        </div>

        {/* Spatial Summary */}
        <div className="text-slate-300 font-medium text-right truncate max-w-sm sm:max-w-md">
          {heatmap.mainClusterSummary}
        </div>
      </div>
    </div>
  );
};
