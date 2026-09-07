import React, { useState, useRef } from 'react';
import { Sparkles, UploadCloud, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onFileLoaded: (buffer: ArrayBuffer, fileName: string) => void;
  onLoadDemo: () => void;
  isLoading: boolean;
  onLearnMore?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onFileLoaded,
  onLoadDemo,
  isLoading,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showBlastRadius, setShowBlastRadius] = useState(true);
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
          
          {/* LEFT COLUMN (5 cols on lg screens): Option B Messaging & Primary Actions */}
          <div className="lg:col-span-5 space-y-6 text-left">
            
            {/* Telemetry Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-2xs text-[11px] font-mono text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-slate-900">Engine v1.0</span>
              <span className="text-slate-300">|</span>
              <span className="text-emerald-700 font-medium">100% In-Browser Memory (Air-Gapped)</span>
            </div>

            {/* Main Headline (Option B) */}
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

            {/* Action Buttons */}
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

          {/* RIGHT COLUMN (7 cols on lg screens): Interactive Diagnostic Proof & Drag Target */}
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
              
              {/* Window Header / Tab Bar */}
              <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="text-sm">🐕</span> SheetHound Forensic Scanner
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-200">
                    Income_Statement.xlsx
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowBlastRadius(!showBlastRadius)}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 transition cursor-pointer shadow-2xs"
                  title="Toggle calculation break visualization"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  <span>{showBlastRadius ? 'Hide Blast Radius' : 'Trace Error Blast Radius'}</span>
                </button>
              </div>

              {/* Simulated Spreadsheet Table */}
              <div className="p-4 sm:p-5 space-y-4">
                
                {/* Table Mockup */}
                <div className="rounded-xl border border-slate-200 overflow-hidden font-mono text-[11px] sm:text-xs bg-white">
                  {/* Column Headers */}
                  <div className="grid grid-cols-12 bg-slate-100/80 border-b border-slate-200 font-bold text-slate-500 divide-x divide-slate-200 text-center py-1.5">
                    <div className="col-span-1 text-slate-400">#</div>
                    <div className="col-span-5 text-left px-2">A: Line Item</div>
                    <div className="col-span-3">C: FY25 Budget</div>
                    <div className="col-span-3">D: FY26 Forecast</div>
                  </div>

                  {/* Row 1: Revenue */}
                  <div className="grid grid-cols-12 border-b border-slate-100 divide-x divide-slate-100 py-1.5 text-slate-700">
                    <div className="col-span-1 text-center text-slate-400">11</div>
                    <div className="col-span-5 px-2 font-sans font-medium text-slate-900">Total Gross Revenue</div>
                    <div className="col-span-3 text-right px-2">$14,200,000</div>
                    <div className="col-span-3 text-right px-2 font-semibold text-slate-900">$16,800,000</div>
                  </div>

                  {/* Row 2: Opex */}
                  <div className="grid grid-cols-12 border-b border-slate-100 divide-x divide-slate-100 py-1.5 text-slate-700">
                    <div className="col-span-1 text-center text-slate-400">12</div>
                    <div className="col-span-5 px-2 font-sans font-medium text-slate-900">Operating Expenses</div>
                    <div className="col-span-3 text-right px-2 text-rose-600">($9,300,000)</div>
                    <div className="col-span-3 text-right px-2 text-rose-600">($10,200,000)</div>
                  </div>

                  {/* Row 3: Operating Income */}
                  <div className="grid grid-cols-12 border-b border-slate-100 divide-x divide-slate-100 py-1.5 bg-slate-50/50 text-slate-900 font-bold">
                    <div className="col-span-1 text-center text-slate-400 font-normal">13</div>
                    <div className="col-span-5 px-2 font-sans">EBITDA / Operating Margin</div>
                    <div className="col-span-3 text-right px-2">$4,900,000</div>
                    <div className="col-span-3 text-right px-2">$6,600,000</div>
                  </div>

                  {/* Row 4: Culprit Row (D14) with #REF! break */}
                  <div className={`grid grid-cols-12 border-b border-slate-100 divide-x divide-slate-100 py-1.5 transition-colors ${
                    showBlastRadius ? 'bg-rose-50/80' : 'bg-white'
                  }`}>
                    <div className="col-span-1 text-center text-slate-400">14</div>
                    <div className="col-span-5 px-2 font-sans text-slate-800 flex items-center justify-between">
                      <span>Tax Provision Rate</span>
                      <span className="text-[10px] font-mono px-1 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">D14</span>
                    </div>
                    <div className="col-span-3 text-right px-2 text-slate-600">($980,000)</div>
                    <div className="col-span-3 text-right px-2 font-bold text-rose-600 flex items-center justify-end gap-1">
                      <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
                      <span>#REF! ERROR</span>
                    </div>
                  </div>

                  {/* Row 5: Net Income Cascade */}
                  <div className="grid grid-cols-12 py-1.5 divide-x divide-slate-100 bg-slate-50 font-bold">
                    <div className="col-span-1 text-center text-slate-400 font-normal">15</div>
                    <div className="col-span-5 px-2 font-sans text-slate-900">Net Distributable Income</div>
                    <div className="col-span-3 text-right px-2">$3,920,000</div>
                    <div className="col-span-3 text-right px-2 text-rose-600 flex items-center justify-end">
                      <span>#REF! (Cascade)</span>
                    </div>
                  </div>
                </div>

                {/* Blast Radius Visual Trace Overlay */}
                {showBlastRadius && (
                  <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-2 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between font-bold text-amber-950">
                      <span className="flex items-center gap-1.5">
                        <span className="text-sm">⚡</span> Ghost Link Break Identified at Cell D14
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-200 text-rose-900 font-mono uppercase">
                        Severity: High
                      </span>
                    </div>

                    <div className="font-mono text-[11px] text-amber-900 bg-white/80 p-2 rounded-lg border border-amber-200/80 space-y-1">
                      <div className="text-slate-500 text-[10px]">Active Formula Logic:</div>
                      <div className="font-semibold text-rose-700 truncate">
                        =D13 * '[C:\Corporate\2024_Master_Budget.xlsx]Assumptions'!$C$8
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      <strong className="text-slate-800">Why this explodes:</strong> Formula references an external file on your local machine. 
                      When shared with leadership or auditors, Excel cannot locate the path and turns your bottom line into <code className="text-rose-700 font-bold">#REF!</code>.
                    </p>
                  </div>
                )}

                {/* Dropzone Callout on the Card */}
                <div 
                  onClick={() => !isLoading && fileInputRef.current?.click()}
                  className="p-4 rounded-xl border border-dashed border-slate-300 hover:border-amber-500 bg-slate-50/60 hover:bg-amber-50/30 transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left select-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 text-lg shadow-2xs">
                      🐕
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        Drop your workbook here to run pre-flight diagnostic
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Evaluates formulas, ghost links, hidden tabs, and stray cells in milliseconds
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shrink-0 shadow-2xs pointer-events-none"
                  >
                    Browse Files
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
