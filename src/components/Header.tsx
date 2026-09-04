import { ShieldCheck, RefreshCw, FileDown } from 'lucide-react';
import type { WorkbookAuditReport } from '../types/audit';

interface HeaderProps {
  report: WorkbookAuditReport | null;
  onReset: () => void;
  onOpenExport?: () => void;
  onGoToHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  report,
  onReset,
  onOpenExport,
  onGoToHome,
}) => {
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div
            onClick={onGoToHome}
            className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-sm shadow-amber-500/20 text-xl cursor-pointer hover:scale-105 transition"
            title="SheetHound Home"
          >
            🐕
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                onClick={onGoToHome}
                className="text-lg font-black text-slate-900 tracking-tight cursor-pointer hover:text-amber-800 transition"
              >
                SheetHound
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 uppercase tracking-wide">
                by Utharam
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              The Spreadsheet Watchdog • Pure Watcher (Read-Only)
            </p>
          </div>
        </div>

        {/* Status / File Meta / Actions */}
        <div className="flex items-center gap-2.5 flex-wrap justify-end">
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% In-Browser Memory (Zero Uploads)</span>
          </div>

          {report && (
            <div className="flex items-center gap-2">
              {/* File Info */}
              <div className="text-xs text-right hidden md:block pl-2 border-l border-slate-200">
                <span className="font-bold text-slate-800 block truncate max-w-[200px]" title={report.fileName}>
                  {report.fileName}
                </span>
                <span className="text-slate-400 text-[11px]">
                  {formatBytes(report.fileSizeBytes)} • {report.totalSheets} tabs
                </span>
              </div>

              {/* Export Report Action */}
              <button
                onClick={onOpenExport}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-2xs hover:shadow-xs cursor-pointer"
                title="Export audit report as PDF, Markdown, or JSON"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Export Report</span>
              </button>

              {/* Reset / Change File Action */}
              <button
                onClick={onReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition cursor-pointer"
                title="Inspect another workbook"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Change File</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
