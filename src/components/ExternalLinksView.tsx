import React from 'react';
import { Link, AlertTriangle, FileSpreadsheet, Copy, Check } from 'lucide-react';
import type { ExternalLinkItem } from '../types/audit';

interface ExternalLinksViewProps {
  externalLinks: ExternalLinkItem[];
  uniqueFiles: string[];
}

export const ExternalLinksView: React.FC<ExternalLinksViewProps> = ({
  externalLinks,
  uniqueFiles,
}) => {
  const [copiedCell, setCopiedCell] = React.useState<string | null>(null);

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
          <Link className="w-5 h-5 text-amber-600" />
          External Workbook Links Registry ({externalLinks.length})
        </h2>
        <p className="text-xs text-slate-500">
          Cells pointing to external workbooks that risk returning #REF! when opened by third parties
        </p>
      </div>

      {/* Warning Callout */}
      <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold">Why external links break for other users:</span>
          <p className="text-amber-800 leading-relaxed">
            When you email this spreadsheet to a client or colleague, Excel attempts to find the linked files on their hard drive.
            Because the target file path doesn't exist on their computer, Excel will prompt them to update values or return{' '}
            <strong className="font-mono text-rose-700">#REF!</strong>.
          </p>
        </div>
      </div>

      {/* Unique Referenced Workbooks List */}
      {uniqueFiles.length > 0 && (
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Referenced External Workbooks ({uniqueFiles.length}):
          </span>
          <div className="flex flex-wrap gap-2">
            {uniqueFiles.map((file, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono font-semibold"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-amber-600" />
                <span>{file}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table of all links */}
      {externalLinks.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500">
          🎉 No external links detected in this workbook.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">Cell Location</th>
                  <th className="py-2.5 px-3">Target External Workbook</th>
                  <th className="py-2.5 px-3">Target Range</th>
                  <th className="py-2.5 px-3">Formula Expression</th>
                  <th className="py-2.5 px-3 text-right">Copy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {externalLinks.map((link, i) => {
                  const fullAddress = `${link.sheetName}!${link.cell}`;
                  return (
                    <tr key={i} className="hover:bg-amber-50/30 transition">
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="font-sans text-slate-500 font-medium">
                          {link.sheetName}
                        </span>
                        <span className="text-slate-300">!</span>
                        <span className="font-bold text-slate-900 bg-amber-100/60 text-amber-900 px-1.5 py-0.5 rounded border border-amber-200">
                          {link.cell}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap font-bold text-slate-800">
                        [{link.targetWorkbook}]
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap text-slate-600">
                        {link.targetSheet ? `${link.targetSheet}!${link.targetRange || ''}` : '—'}
                      </td>

                      <td className="py-2.5 px-3 text-slate-700 break-all max-w-md">
                        {link.formula.startsWith('=') ? link.formula : `=${link.formula}`}
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
