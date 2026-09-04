import React, { useState } from 'react';
import { AlertOctagon, Copy, Check } from 'lucide-react';
import type { FormulaErrorItem } from '../types/audit';

interface ErrorRegistryViewProps {
  errors: FormulaErrorItem[];
}

export const ErrorRegistryView: React.FC<ErrorRegistryViewProps> = ({ errors }) => {
  const [copiedCell, setCopiedCell] = useState<string | null>(null);

  const copyCellRef = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCell(text);
    setTimeout(() => setCopiedCell(null), 1800);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-rose-600" />
          Formula Errors & Broken References ({errors.length})
        </h2>
        <p className="text-xs text-slate-500">
          Cells returning #REF!, #DIV/0!, #VALUE!, or broken formula evaluations
        </p>
      </div>

      {errors.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500">
          🎉 No formula errors detected in this workbook. All calculated cells evaluated cleanly.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">Cell Address</th>
                  <th className="py-2.5 px-3">Error Type</th>
                  <th className="py-2.5 px-3">Formula</th>
                  <th className="py-2.5 px-3">Cached Value</th>
                  <th className="py-2.5 px-3 text-right">Copy Cell</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {errors.map((err, i) => {
                  const fullAddress = `${err.sheetName}!${err.cell}`;
                  return (
                    <tr key={i} className="hover:bg-rose-50/30 transition">
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="font-sans text-slate-500 font-medium">
                          {err.sheetName}
                        </span>
                        <span className="text-slate-300">!</span>
                        <span className="font-bold text-rose-900 bg-rose-100 px-1.5 py-0.5 rounded border border-rose-200">
                          {err.cell}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded font-bold text-[11px] bg-rose-600 text-white shadow-xs">
                          {err.errorType}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-slate-700 break-all max-w-md">
                        {err.formula ? (
                          err.formula.startsWith('=') ? err.formula : `=${err.formula}`
                        ) : (
                          <span className="text-slate-400 font-sans italic">Direct cell error value</span>
                        )}
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap text-rose-700 font-bold">
                        {err.cachedValue || err.errorType}
                      </td>

                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => copyCellRef(fullAddress)}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                          title={`Copy ${fullAddress}`}
                        >
                          {copiedCell === fullAddress ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
