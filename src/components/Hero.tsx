import React, { useState, useRef } from 'react';
import { Sparkles, UploadCloud, AlertTriangle, CheckCircle2, FileSpreadsheet, AlertOctagon, ArrowRight } from 'lucide-react';

interface HeroProps {
  onFileLoaded: (buffer: ArrayBuffer, fileName: string) => void;
  onLoadDemo: () => void;
  isLoading: boolean;
  onLearnMore?: () => void;
}

interface MockCellInfo {
  address: string;
  label: string;
  formula: string;
  displayValue: string;
  status: 'root_error' | 'cascade_error' | 'clean';
  badgeText: string;
  badgeClass: string;
  explanation: string;
  lineage: string;
  impactOrFix: string;
}

const MOCK_CELLS: Record<string, MockCellInfo> = {
  D14: {
    address: 'D14',
    label: 'Tax Provision Rate (FY26 Forecast)',
    formula: "=D13 * '[C:\\Corporate\\2024_Master_Budget.xlsx]Assumptions'!$C$8",
    displayValue: '#REF! ERROR',
    status: 'root_error',
    badgeText: '🔴 CRITICAL ROOT CAUSE ERROR',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
    explanation:
      "Broken Ghost External Link: Formula references an external file on a local computer directory ('C:\\Corporate\\2024_Master_Budget.xlsx'). When emailed to clients or leadership, Excel cannot resolve the path and breaks into #REF!.",
    lineage: 'Sheet1!D14 [Root #REF!] ──► Spills downstream and corrupts Sheet1!D15 [Cascade #REF!]',
    impactOrFix:
      'Poisons downstream Net Income (D15). Fix by embedding an assumptions sheet inside this workbook or pasting the agreed rate as a value.',
  },
  D15: {
    address: 'D15',
    label: 'Net Distributable Income (FY26 Forecast)',
    formula: '=D13 - D14',
    displayValue: '#REF! (Cascade)',
    status: 'cascade_error',
    badgeText: '🟠 CASCADING DEPENDENCY ERROR',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-200',
    explanation:
      'Precedent Corruption: Cell D15’s formula syntax (=D13 - D14) is 100% valid! However, because upstream precedent D14 is broken, the error cascades down and pollutes the bottom line.',
    lineage: 'Sheet1!D14 [Root #REF!] ──► Sheet1!D15 [Cascade #REF!] (D15 is a downstream victim)',
    impactOrFix:
      'Zero formula edits needed in D15! Once the root cause at D14 is resolved, D15 will automatically restore to $5,620,000.',
  },
  D13: {
    address: 'D13',
    label: 'EBITDA / Operating Margin (FY26 Forecast)',
    formula: '=D11 + D12',
    displayValue: '$6,600,000',
    status: 'clean',
    badgeText: '🟢 VERIFIED HEALTHY FORMULA',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    explanation:
      'Verified Clean: Standard summation of local line items D11 ($16,800,000) and D12 (-$10,200,000). All precedents are internal to this sheet and evaluated cleanly.',
    lineage: 'Precedents: D11 ($16.8M) + D12 (-$10.2M) ──► D13 ($6.6M Clean)',
    impactOrFix: '0 external links, 0 division by zero, 0 circular references.',
  },
  D11: {
    address: 'D11',
    label: 'Total Gross Revenue (FY26 Forecast)',
    formula: '=SUM(D5:D10)',
    displayValue: '$16,800,000',
    status: 'clean',
    badgeText: '🟢 VERIFIED HEALTHY SUM',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    explanation:
      'Clean aggregation: Bounded sum over internal revenue rows D5:D10. All precedent cells are strictly numeric inputs within sheet boundaries.',
    lineage: 'Range D5:D10 ──► D11 ($16,800,000)',
    impactOrFix: 'Feeds cleanly into Operating Margin (D13).',
  },
  D12: {
    address: 'D12',
    label: 'Operating Expenses (FY26 Forecast)',
    formula: '=SUM(D7:D9)',
    displayValue: '($10,200,000)',
    status: 'clean',
    badgeText: '🟢 VERIFIED HEALTHY SUM',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    explanation:
      'Clean opex rollup: Expense rows aggregated with consistent sign conventions. No string values or stray empty gaps.',
    lineage: 'Range D7:D9 ──► D12 (-$10,200,000)',
    impactOrFix: 'Feeds cleanly into Operating Margin (D13).',
  },
  C14: {
    address: 'C14',
    label: 'Tax Provision Rate (FY25 Budget)',
    formula: '=C13 * Assumptions!$B$4',
    displayValue: '($980,000)',
    status: 'clean',
    badgeText: '🟢 VERIFIED INTERNAL REFERENCE',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    explanation:
      "Clean Cross-Sheet Link: Unlike D14, this formula references the internal 'Assumptions' worksheet inside the same workbook. It evaluates safely across all computers.",
    lineage: 'Assumptions!$B$4 * C13 ──► C14 (-$980,000)',
    impactOrFix: 'Internal dependency verified. No ghost link risks.',
  },
  C15: {
    address: 'C15',
    label: 'Net Distributable Income (FY25 Budget)',
    formula: '=C13 + C14',
    displayValue: '$3,920,000',
    status: 'clean',
    badgeText: '🟢 VERIFIED CLEAN CALCULATION',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    explanation:
      'Healthy baseline: Sums FY25 operating margin ($4.9M) and tax provision (-$980k) with zero formula errors.',
    lineage: 'C13 ($4.9M) + C14 (-$980k) ──► C15 ($3,920,000)',
    impactOrFix: 'Benchmark model reference. Clean.',
  },
  C13: {
    address: 'C13',
    label: 'EBITDA / Operating Margin (FY25 Budget)',
    formula: '=C11 + C12',
    displayValue: '$4,900,000',
    status: 'clean',
    badgeText: '🟢 VERIFIED CLEAN BENCHMARK',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    explanation: 'Clean historical budget subtotal evaluated without errors.',
    lineage: 'C11 ($14.2M) + C12 (-$9.3M) ──► C13 ($4.9M)',
    impactOrFix: 'Healthy.',
  },
  C11: {
    address: 'C11',
    label: 'Total Gross Revenue (FY25 Budget)',
    formula: '=SUM(C5:C10)',
    displayValue: '$14,200,000',
    status: 'clean',
    badgeText: '🟢 VERIFIED CLEAN INPUT',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    explanation: 'Prior year budget revenue baseline.',
    lineage: 'Range C5:C10 ──► C11 ($14,200,000)',
    impactOrFix: 'Clean.',
  },
  C12: {
    address: 'C12',
    label: 'Operating Expenses (FY25 Budget)',
    formula: '=SUM(C7:C9)',
    displayValue: '($9,300,000)',
    status: 'clean',
    badgeText: '🟢 VERIFIED CLEAN INPUT',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    explanation: 'Prior year budget expense baseline.',
    lineage: 'Range C7:C9 ──► C12 (-$9,300,000)',
    impactOrFix: 'Clean.',
  },
};

export const Hero: React.FC<HeroProps> = ({
  onFileLoaded,
  onLoadDemo,
  isLoading,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [activeTab, setActiveTab] = useState<'sheet' | 'errorRegistry'>('sheet');
  const [selectedCell, setSelectedCell] = useState<string>('D14');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file) return;
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xlsm') && !file.name.endsWith('.xlsb')) {
      alert('Please upload an Excel workbook (.xlsx or .xlsm)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      if (buffer) {
        onFileLoaded(buffer, file.name);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const activeInfo = MOCK_CELLS[selectedCell] || MOCK_CELLS['D14'];

  return (
    <section className="relative overflow-hidden pt-10 pb-12 lg:pt-14 lg:pb-16 bg-[#F9FAFB]">
      
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xlsm"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* LEFT COLUMN (5 cols): Option B Messaging & The ONE Primary Upload Action */}
          <div className="lg:col-span-5 space-y-6 text-left">
            
            {/* Telemetry Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-2xs text-[11px] font-mono text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-slate-900">Engine v1.0</span>
              <span className="text-slate-300">|</span>
              <span className="text-emerald-700 font-medium">100% In-Browser Memory (Air-Gapped)</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Pre-flight inspection for mission-critical spreadsheets
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-5xl font-black text-slate-950 tracking-tight leading-[1.08]">
                Never send a broken Excel file again.
              </h1>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Run a comprehensive pre-flight check in milliseconds. SheetHound spots formula errors, 
                broken external references, and stray scratchpad cells—without a single byte of your data 
                ever leaving your machine.
              </p>
            </div>

            {/* Single Primary Action Button Pair */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => !isLoading && fileInputRef.current?.click()}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-sm font-bold transition shadow-xs cursor-pointer active:scale-98"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <UploadCloud className="w-4 h-4 text-amber-400" />
                )}
                <span>{isLoading ? 'Sniffing Workbook...' : 'Upload Workbook for Diagnostic'}</span>
              </button>

              <button
                type="button"
                onClick={onLoadDemo}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-amber-100 hover:bg-amber-200/80 text-amber-950 text-xs font-bold transition cursor-pointer border border-amber-300/70 shadow-2xs active:scale-98"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Try Sample Model (1-Click)</span>
              </button>
            </div>

            {/* Reassurance Checklist */}
            <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> No account or signup
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Zero server uploads
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> .xlsx &amp; .xlsm ready
              </span>
            </div>

          </div>

          {/* RIGHT COLUMN (7 cols): Interactive Forensic Proof & Cell Inspector */}
          <div className="lg:col-span-7">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`relative bg-white rounded-2xl border transition-all duration-200 shadow-sm overflow-hidden text-left ${
                isDragOver
                  ? 'border-amber-500 ring-4 ring-amber-500/10 bg-amber-50/40'
                  : 'border-slate-200/90'
              }`}
            >
              
              {/* Window Header & Dual Tab Bar */}
              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="text-sm">🐕</span> SheetHound Forensic Scanner
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-200">
                    Income_Statement.xlsx
                  </span>
                </div>

                {/* View Switcher: Model Grid vs Error Registry */}
                <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-200/70 border border-slate-200 text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setActiveTab('sheet')}
                    className={`px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'sheet'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <FileSpreadsheet className="w-3 h-3 text-emerald-600" />
                    <span>Model Grid</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('errorRegistry')}
                    className={`px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'errorRegistry'
                        ? 'bg-white text-rose-900 shadow-2xs font-extrabold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <AlertOctagon className="w-3 h-3 text-rose-600" />
                    <span>Error Sheet (2)</span>
                  </button>
                </div>
              </div>

              {/* Main Interactive Stage */}
              <div className="p-4 sm:p-5 space-y-3.5">
                
                {/* 1. Live Excel Formula Bar (Shows active cell & formula) */}
                <div className="flex items-center gap-2 p-1.5 bg-slate-100/80 rounded-xl border border-slate-200 font-mono text-xs">
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white border border-slate-200 font-bold text-slate-700 shrink-0">
                    <span className="text-slate-400 italic font-serif">fx</span>
                    <span className="text-amber-800">{activeInfo.address}</span>
                  </div>
                  <div className="flex-1 px-2 py-1 rounded-md bg-white border border-slate-200/90 text-slate-800 font-semibold truncate text-[11px] sm:text-xs">
                    {activeInfo.formula}
                  </div>
                  <div className="hidden sm:block text-[10px] text-slate-400 font-sans pr-1">
                    Click cells to inspect
                  </div>
                </div>

                {/* View A: Spreadsheet Grid with Clickable Cells */}
                {activeTab === 'sheet' ? (
                  <div className="rounded-xl border border-slate-200 overflow-hidden font-mono text-[11px] sm:text-xs bg-white">
                    {/* Column Headers */}
                    <div className="grid grid-cols-12 bg-slate-100/90 border-b border-slate-200 font-bold text-slate-500 divide-x divide-slate-200 text-center py-1.5 select-none">
                      <div className="col-span-1 text-slate-400">#</div>
                      <div className="col-span-5 text-left px-2">A: Line Item</div>
                      <div className={`col-span-3 transition-colors ${selectedCell.startsWith('C') ? 'bg-amber-100/50 text-amber-900' : ''}`}>
                        C: FY25 Budget
                      </div>
                      <div className={`col-span-3 transition-colors ${selectedCell.startsWith('D') ? 'bg-amber-100/50 text-amber-900' : ''}`}>
                        D: FY26 Forecast
                      </div>
                    </div>

                    {/* Row 11: Revenue */}
                    <div className={`grid grid-cols-12 border-b border-slate-100 divide-x divide-slate-100 py-1.5 text-slate-700 transition-colors ${
                      selectedCell.includes('11') ? 'bg-slate-50/70' : ''
                    }`}>
                      <div className="col-span-1 text-center text-slate-400 font-normal">11</div>
                      <div className="col-span-5 px-2 font-sans font-medium text-slate-900 flex items-center">
                        Total Gross Revenue
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedCell('C11')}
                        className={`col-span-3 text-right px-2 transition-all cursor-pointer rounded-sm ${
                          selectedCell === 'C11'
                            ? 'ring-2 ring-amber-500 bg-amber-50/80 font-bold text-slate-950'
                            : 'hover:bg-slate-100'
                        }`}
                      >
                        $14,200,000
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedCell('D11')}
                        className={`col-span-3 text-right px-2 font-semibold transition-all cursor-pointer rounded-sm ${
                          selectedCell === 'D11'
                            ? 'ring-2 ring-amber-500 bg-amber-50/80 text-slate-950'
                            : 'text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        $16,800,000
                      </button>
                    </div>

                    {/* Row 12: Opex */}
                    <div className={`grid grid-cols-12 border-b border-slate-100 divide-x divide-slate-100 py-1.5 text-slate-700 transition-colors ${
                      selectedCell.includes('12') ? 'bg-slate-50/70' : ''
                    }`}>
                      <div className="col-span-1 text-center text-slate-400 font-normal">12</div>
                      <div className="col-span-5 px-2 font-sans font-medium text-slate-900 flex items-center">
                        Operating Expenses
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedCell('C12')}
                        className={`col-span-3 text-right px-2 text-rose-600 transition-all cursor-pointer rounded-sm ${
                          selectedCell === 'C12'
                            ? 'ring-2 ring-amber-500 bg-amber-50/80 font-bold'
                            : 'hover:bg-slate-100'
                        }`}
                      >
                        ($9,300,000)
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedCell('D12')}
                        className={`col-span-3 text-right px-2 text-rose-600 transition-all cursor-pointer rounded-sm ${
                          selectedCell === 'D12'
                            ? 'ring-2 ring-amber-500 bg-amber-50/80 font-bold'
                            : 'hover:bg-slate-100'
                        }`}
                      >
                        ($10,200,000)
                      </button>
                    </div>

                    {/* Row 13: EBITDA */}
                    <div className={`grid grid-cols-12 border-b border-slate-100 divide-x divide-slate-100 py-1.5 bg-slate-50/40 text-slate-900 font-bold transition-colors ${
                      selectedCell.includes('13') ? 'bg-slate-100/60' : ''
                    }`}>
                      <div className="col-span-1 text-center text-slate-400 font-normal">13</div>
                      <div className="col-span-5 px-2 font-sans flex items-center">
                        EBITDA / Operating Margin
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedCell('C13')}
                        className={`col-span-3 text-right px-2 transition-all cursor-pointer rounded-sm ${
                          selectedCell === 'C13'
                            ? 'ring-2 ring-amber-500 bg-amber-50/80 text-amber-950 font-bold'
                            : 'hover:bg-slate-200/60'
                        }`}
                      >
                        $4,900,000
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedCell('D13')}
                        className={`col-span-3 text-right px-2 transition-all cursor-pointer rounded-sm ${
                          selectedCell === 'D13'
                            ? 'ring-2 ring-amber-500 bg-amber-50/80 text-amber-950 font-bold'
                            : 'hover:bg-slate-200/60'
                        }`}
                      >
                        $6,600,000
                      </button>
                    </div>

                    {/* Row 14: Culprit Row (D14 Root Error) */}
                    <div className="grid grid-cols-12 border-b border-slate-100 divide-x divide-slate-100 py-1.5 transition-colors bg-rose-50/40">
                      <div className="col-span-1 text-center text-slate-400 font-normal">14</div>
                      <div className="col-span-5 px-2 font-sans text-slate-800 flex items-center justify-between">
                        <span>Tax Provision Rate</span>
                        <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-amber-100 text-amber-900 font-bold">
                          D14
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedCell('C14')}
                        className={`col-span-3 text-right px-2 text-slate-600 transition-all cursor-pointer rounded-sm ${
                          selectedCell === 'C14'
                            ? 'ring-2 ring-amber-500 bg-amber-50/80 font-bold text-slate-950'
                            : 'hover:bg-rose-100/60'
                        }`}
                      >
                        ($980,000)
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedCell('D14')}
                        className={`col-span-3 text-right px-2 font-bold text-rose-600 flex items-center justify-end gap-1 transition-all cursor-pointer rounded-sm ${
                          selectedCell === 'D14'
                            ? 'ring-2 ring-rose-500 bg-rose-100/90 shadow-2xs'
                            : 'hover:bg-rose-100/60'
                        }`}
                        title="Click to inspect Root Cause Error at D14"
                      >
                        <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
                        <span>#REF! ERROR</span>
                      </button>
                    </div>

                    {/* Row 15: Net Income (D15 Cascade Error) */}
                    <div className="grid grid-cols-12 py-1.5 divide-x divide-slate-100 bg-slate-50 font-bold">
                      <div className="col-span-1 text-center text-slate-400 font-normal">15</div>
                      <div className="col-span-5 px-2 font-sans text-slate-900 flex items-center justify-between">
                        <span>Net Distributable Income</span>
                        <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-amber-100 text-amber-900 font-bold">
                          D15
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedCell('C15')}
                        className={`col-span-3 text-right px-2 transition-all cursor-pointer rounded-sm ${
                          selectedCell === 'C15'
                            ? 'ring-2 ring-amber-500 bg-amber-50/80 font-bold text-slate-950'
                            : 'hover:bg-slate-200/60'
                        }`}
                      >
                        $3,920,000
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedCell('D15')}
                        className={`col-span-3 text-right px-2 text-rose-600 flex items-center justify-end transition-all cursor-pointer rounded-sm ${
                          selectedCell === 'D15'
                            ? 'ring-2 ring-amber-500 bg-amber-100/90 shadow-2xs font-extrabold'
                            : 'hover:bg-amber-100/50'
                        }`}
                        title="Click to inspect Cascading Error at D15"
                      >
                        <span>#REF! (Cascade)</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* View B: Dedicated Error Sheet (Unambiguous List of All Detected Errors) */
                  <div className="rounded-xl border border-slate-200 overflow-hidden font-mono text-[11px] sm:text-xs bg-white">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-600 font-bold text-[10px] uppercase tracking-wider">
                          <th className="py-2 px-2.5">Cell</th>
                          <th className="py-2 px-2.5">Error</th>
                          <th className="py-2 px-2.5">Classification</th>
                          <th className="py-2 px-2.5">Formula</th>
                          <th className="py-2 px-2.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {/* Error 1: D14 Root Cause */}
                        <tr 
                          onClick={() => setSelectedCell('D14')}
                          className={`cursor-pointer transition ${selectedCell === 'D14' ? 'bg-rose-50/90' : 'hover:bg-slate-50'}`}
                        >
                          <td className="py-2.5 px-2.5 font-bold text-rose-900">
                            Sheet1!D14
                          </td>
                          <td className="py-2.5 px-2.5">
                            <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-bold text-[10px]">
                              #REF!
                            </span>
                          </td>
                          <td className="py-2.5 px-2.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-bold bg-rose-100 text-rose-800 border border-rose-200">
                              🔴 Root Cause (Ghost Link)
                            </span>
                          </td>
                          <td className="py-2.5 px-2.5 text-slate-700 max-w-[180px] truncate text-[10px]">
                            =D13 * &apos;[2024_Master_Budget.xlsx]&apos;!$C$8
                          </td>
                          <td className="py-2.5 px-2.5 text-right text-[10px] font-sans font-bold text-amber-700">
                            Inspect →
                          </td>
                        </tr>

                        {/* Error 2: D15 Cascade */}
                        <tr 
                          onClick={() => setSelectedCell('D15')}
                          className={`cursor-pointer transition ${selectedCell === 'D15' ? 'bg-amber-50/90' : 'hover:bg-slate-50'}`}
                        >
                          <td className="py-2.5 px-2.5 font-bold text-amber-900">
                            Sheet1!D15
                          </td>
                          <td className="py-2.5 px-2.5">
                            <span className="px-1.5 py-0.5 rounded bg-amber-600 text-white font-bold text-[10px]">
                              #REF!
                            </span>
                          </td>
                          <td className="py-2.5 px-2.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-bold bg-amber-100 text-amber-900 border border-amber-200">
                              🟠 Cascade (Corrupted Precedent)
                            </span>
                          </td>
                          <td className="py-2.5 px-2.5 text-slate-700 max-w-[180px] truncate text-[10px]">
                            =D13 - D14 (Precedent D14 failed)
                          </td>
                          <td className="py-2.5 px-2.5 text-right text-[10px] font-sans font-bold text-amber-700">
                            Inspect →
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 2. Dynamic Forensic Cell Inspector Card */}
                <div className={`p-3.5 sm:p-4 rounded-xl border text-xs space-y-2.5 transition-all ${
                  activeInfo.status === 'root_error'
                    ? 'bg-rose-50/60 border-rose-200'
                    : activeInfo.status === 'cascade_error'
                    ? 'bg-amber-50/70 border-amber-200'
                    : 'bg-emerald-50/40 border-emerald-200'
                }`}>
                  
                  {/* Card Header: Coordinate + Classification Badge */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-900 text-xs shadow-2xs">
                        Cell {activeInfo.address}
                      </span>
                      <span className="font-bold text-slate-800 text-xs">
                        {activeInfo.label}
                      </span>
                    </div>

                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border uppercase tracking-wider ${activeInfo.badgeClass}`}>
                      {activeInfo.badgeText}
                    </span>
                  </div>

                  {/* Formula and Evaluation Breakdown */}
                  <div className="font-mono text-[11px] bg-white/90 p-2.5 rounded-lg border border-slate-200/80 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-sans">
                      <span>Evaluated Value: <strong className="font-mono text-slate-900 font-bold">{activeInfo.displayValue}</strong></span>
                      <span>Lineage &amp; Precedents</span>
                    </div>
                    <div className="font-semibold text-slate-800 text-[11px] truncate">
                      {activeInfo.formula}
                    </div>
                    <div className="text-[10px] text-slate-500 pt-0.5 flex items-center gap-1 font-sans">
                      <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{activeInfo.lineage}</span>
                    </div>
                  </div>

                  {/* Plain-English Root Cause & Fix Explanation */}
                  <div className="text-[11px] leading-relaxed text-slate-700 space-y-1">
                    <p>
                      <strong className="text-slate-900">Diagnosis:</strong> {activeInfo.explanation}
                    </p>
                    <p className="text-slate-600">
                      <strong className="text-slate-900">Action:</strong> {activeInfo.impactOrFix}
                    </p>
                  </div>

                  {/* Quick-Inspect Switcher Chips */}
                  <div className="pt-1.5 border-t border-slate-200/60 flex items-center gap-1.5 flex-wrap text-[10px] font-mono">
                    <span className="text-slate-400 font-sans pr-1">Quick Inspect:</span>
                    <button
                      type="button"
                      onClick={() => { setSelectedCell('D14'); setActiveTab('sheet'); }}
                      className={`px-2 py-0.5 rounded-md border transition cursor-pointer ${
                        selectedCell === 'D14'
                          ? 'bg-rose-600 text-white border-rose-700 font-bold'
                          : 'bg-white hover:bg-rose-50 text-rose-800 border-rose-200'
                      }`}
                    >
                      🔴 Root: D14
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSelectedCell('D15'); setActiveTab('sheet'); }}
                      className={`px-2 py-0.5 rounded-md border transition cursor-pointer ${
                        selectedCell === 'D15'
                          ? 'bg-amber-600 text-white border-amber-700 font-bold'
                          : 'bg-white hover:bg-amber-50 text-amber-900 border-amber-200'
                      }`}
                    >
                      🟠 Cascade: D15
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSelectedCell('D13'); setActiveTab('sheet'); }}
                      className={`px-2 py-0.5 rounded-md border transition cursor-pointer ${
                        selectedCell === 'D13'
                          ? 'bg-emerald-600 text-white border-emerald-700 font-bold'
                          : 'bg-white hover:bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      🟢 Subtotal: D13
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSelectedCell('D11'); setActiveTab('sheet'); }}
                      className={`px-2 py-0.5 rounded-md border transition cursor-pointer ${
                        selectedCell === 'D11'
                          ? 'bg-emerald-600 text-white border-emerald-700 font-bold'
                          : 'bg-white hover:bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      🟢 Revenue: D11
                    </button>
                  </div>

                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
