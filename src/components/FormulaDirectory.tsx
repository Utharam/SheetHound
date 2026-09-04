import React, { useState, useMemo } from 'react';
import {
  FileCode,
  Search,
  Link,
  AlertOctagon,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Layers,
} from 'lucide-react';
import type { FormulaDirectoryItem } from '../types/audit';

interface FormulaDirectoryProps {
  formulas: FormulaDirectoryItem[];
  allSheetNames: string[];
}

export const FormulaDirectory: React.FC<FormulaDirectoryProps> = ({
  formulas,
  allSheetNames,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSheet, setSelectedSheet] = useState('ALL');
  const [filterType, setFilterType] = useState<'all' | 'cross-sheet' | 'external' | 'errors'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;

  const filteredFormulas = useMemo(() => {
    return formulas.filter((item) => {
      // Sheet filter
      if (selectedSheet !== 'ALL' && item.sheetName !== selectedSheet) {
        return false;
      }

      // Filter type
      if (filterType === 'cross-sheet' && !item.isCrossSheet) return false;
      if (filterType === 'external' && !item.isExternal) return false;
      if (filterType === 'errors' && !item.hasError) return false;

      // Search term
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesCell = item.cell.toLowerCase().includes(query);
        const matchesFormula = item.formula.toLowerCase().includes(query);
        const matchesSheet = item.sheetName.toLowerCase().includes(query);
        const matchesExt = (item.referencedWorkbook || '').toLowerCase().includes(query);
        const matchesCross = item.referencedSheets.some((s) => s.toLowerCase().includes(query));

        if (!matchesCell && !matchesFormula && !matchesSheet && !matchesExt && !matchesCross) {
          return false;
        }
      }

      return true;
    });
  }, [formulas, selectedSheet, filterType, searchTerm]);

  const totalPages = Math.ceil(filteredFormulas.length / pageSize) || 1;
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredFormulas.slice(start, start + pageSize);
  }, [filteredFormulas, currentPage]);

  const handleCopy = (formulaText: string, id: string) => {
    const textToCopy = formulaText.startsWith('=') ? formulaText : `=${formulaText}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="space-y-4">
      
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileCode className="w-5 h-5 text-emerald-600" />
            Formula Directory & Linking Catalog
          </h2>
          <p className="text-xs text-slate-500">
            Comprehensive index of every formula used across all tabs with cross-sheet dependencies
          </p>
        </div>

        <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
          Showing {filteredFormulas.length} of {formulas.length} formulas
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
        
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search formulas, cell addresses (e.g. C1), functions (e.g. SUM), or sheets..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Sheet Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Sheet:</span>
          <select
            value={selectedSheet}
            onChange={(e) => {
              setSelectedSheet(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="ALL">All Sheets ({formulas.length})</option>
            {allSheetNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => {
              setFilterType('all');
              setCurrentPage(1);
            }}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition cursor-pointer ${
              filterType === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => {
              setFilterType('cross-sheet');
              setCurrentPage(1);
            }}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition cursor-pointer flex items-center gap-1 ${
              filterType === 'cross-sheet'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
            }`}
          >
            <Layers className="w-3 h-3" /> Cross-Sheet
          </button>
          <button
            onClick={() => {
              setFilterType('external');
              setCurrentPage(1);
            }}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition cursor-pointer flex items-center gap-1 ${
              filterType === 'external'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <Link className="w-3 h-3" /> External
          </button>
          <button
            onClick={() => {
              setFilterType('errors');
              setCurrentPage(1);
            }}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition cursor-pointer flex items-center gap-1 ${
              filterType === 'errors'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <AlertOctagon className="w-3 h-3" /> Errors
          </button>
        </div>

      </div>

      {/* Formulas Table */}
      {filteredFormulas.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
          No formulas matched your search or filters.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">Tab & Cell</th>
                  <th className="py-2.5 px-3">Formula</th>
                  <th className="py-2.5 px-3">Cached Value</th>
                  <th className="py-2.5 px-3">Link Attributes</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {paginatedList.map((item) => {
                  const formulaDisplay = item.formula.startsWith('=')
                    ? item.formula
                    : `=${item.formula}`;

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/60 transition ${
                        item.hasError ? 'bg-rose-50/30' : ''
                      }`}
                    >
                      {/* Tab & Cell Reference */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="font-sans text-slate-500 font-medium">
                            {item.sheetName}
                          </span>
                          <span className="text-slate-300">!</span>
                          <span className="font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                            {item.cell}
                          </span>
                        </div>
                      </td>

                      {/* Formula Text */}
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-800 break-all max-w-lg">
                          {formulaDisplay}
                        </div>
                      </td>

                      {/* Cached Result */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        {item.hasError ? (
                          <span className="font-bold text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded text-[11px]">
                            {item.errorType || item.cachedValue || '#ERROR'}
                          </span>
                        ) : (
                          <span className="text-slate-600 font-sans">
                            {item.cachedValue !== undefined && item.cachedValue !== ''
                              ? item.cachedValue
                              : '—'}
                          </span>
                        )}
                      </td>

                      {/* Link Attributes / Badges */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5 flex-wrap font-sans">
                          {item.isCrossSheet && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-medium">
                              <Layers className="w-3 h-3" />
                              {item.referencedSheets.join(', ')}
                            </span>
                          )}

                          {item.isExternal && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-semibold">
                              <Link className="w-3 h-3" />
                              [{item.referencedWorkbook}]
                            </span>
                          )}

                          {item.hasError && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 text-[11px] font-bold">
                              <AlertOctagon className="w-3 h-3" />
                              {item.errorType}
                            </span>
                          )}

                          {!item.isCrossSheet && !item.isExternal && !item.hasError && (
                            <span className="text-slate-400 text-[11px]">Self-contained</span>
                          )}
                        </div>
                      </td>

                      {/* Copy Action */}
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleCopy(item.formula, item.id)}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                          title="Copy formula to clipboard"
                        >
                          {copiedId === item.id ? (
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <div>
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-2 py-1 rounded bg-white border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 rounded bg-white border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
