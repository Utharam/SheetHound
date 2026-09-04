import React from 'react';
import {
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  FileSpreadsheet,
  FileDown,
  RefreshCw,
} from 'lucide-react';
import type { WorkbookAuditReport } from '../types/audit';

interface NavbarProps {
  onGoToUpload?: () => void;
  onGoToDocs?: () => void;
  onGoToBento?: () => void;
  report: WorkbookAuditReport | null;
  onBackToHome?: () => void;
  onResetFile?: () => void;
  onOpenExport?: () => void;
  onOpenPrivacyModal?: () => void;
  onOpenVeeranModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onGoToUpload,
  onGoToDocs,
  onGoToBento,
  report,
  onBackToHome,
  onResetFile,
  onOpenExport,
  onOpenPrivacyModal,
  onOpenVeeranModal,
}) => {
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Mascot (Clickable Mascot opens Veeran Easter Egg!) */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenVeeranModal}
            className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20 text-xl hover:scale-110 active:scale-95 transition cursor-pointer"
            title="Click to meet Veeran! 🐾"
          >
            🐕
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span
                onClick={onBackToHome}
                className="text-lg font-black text-slate-900 tracking-tight cursor-pointer hover:text-amber-800 transition"
              >
                SheetHound
              </span>
              <a
                href="https://utharam.github.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100/80 hover:bg-amber-200/80 text-amber-900 border border-amber-200 uppercase tracking-wide transition cursor-pointer"
                title="Visit Utharam (utharam.github.io)"
              >
                by Utharam
              </a>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              The Spreadsheet Watchdog • Pre-Flight Auditor
            </p>
          </div>
        </div>

        {/* Mode A: Landing Page Nav Controls */}
        {!report ? (
          <>
            <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
              <button
                onClick={onGoToBento}
                className="hover:text-slate-900 transition cursor-pointer"
              >
                Features
              </button>
              <button
                onClick={onGoToDocs}
                className="hover:text-slate-900 transition cursor-pointer flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                Docs &amp; FAQ
              </button>

              {/* Plain English Privacy Pill */}
              <button
                onClick={onOpenPrivacyModal}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200 text-emerald-800 text-[11px] font-bold transition cursor-pointer"
                title="Click to see why your data never leaves your device"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Safe &amp; Private (Zero Uploads)</span>
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
                title="Open Source on GitHub"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>Star on GitHub</span>
              </a>

              <button
                onClick={onGoToUpload}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs hover:shadow cursor-pointer"
              >
                <span>Audit a Sheet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        ) : (
          /* Mode B: Unified Active Dashboard Top Bar (NO duplicate header!) */
          <div className="flex items-center gap-3 flex-wrap justify-end">
            
            {/* File Info Badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <div className="text-left leading-tight">
                <span className="font-bold text-slate-800 block truncate max-w-[220px]" title={report.fileName}>
                  {report.fileName}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {formatBytes(report.fileSizeBytes)} • {report.totalSheets} worksheets
                </span>
              </div>
            </div>

            {/* Plain English Privacy Pill */}
            <button
              onClick={onOpenPrivacyModal}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition cursor-pointer"
              title="Click to see why your data is 100% private and copy an LLM verification prompt"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe &amp; Private</span>
            </button>

            {/* Export Report Action Button */}
            <button
              onClick={onOpenExport}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-2xs hover:shadow-xs cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Export Report</span>
            </button>

            {/* Change File Button */}
            <button
              onClick={onResetFile}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
              title="Inspect another workbook"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Change File</span>
            </button>

            {/* Back to Home Button */}
            <button
              onClick={onBackToHome}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
              title="Return to Landing Page"
            >
              Home
            </button>

          </div>
        )}

      </div>
    </nav>
  );
};
