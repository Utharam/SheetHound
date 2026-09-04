import React, { useState } from 'react';
import {
  FileDown,
  Printer,
  FileCode,
  FileText,
  Check,
  X,
  Copy,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import type { WorkbookAuditReport } from '../types/audit';
import {
  exportJsonReport,
  exportMarkdownReport,
  exportHtmlReport,
  generateMarkdownReport,
  triggerPrintReport,
} from '../utils/exportUtils';

interface ExportReportModalProps {
  report: WorkbookAuditReport;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  report,
  isOpen,
  onClose,
}) => {
  const [copiedMd, setCopiedMd] = useState(false);

  if (!isOpen) return null;

  const markdownPreview = generateMarkdownReport(report);

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdownPreview);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs font-bold text-lg">
              🐕
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Export Audit Certificate & Report
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Ready
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Download or print the pre-flight audit for {report.fileName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: 4 Action Cards */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Option 1: Print / PDF */}
            <button
              onClick={() => {
                triggerPrintReport(report);
                onClose();
              }}
              className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition text-left space-y-2 group cursor-pointer shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition mb-2">
                  <Printer className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                  Print / Save PDF
                </div>
                <div className="text-[11px] text-slate-500 leading-tight mt-1">
                  Dedicated audit certificate with zero UI clutter
                </div>
              </div>
              <span className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wide">
                Direct Print →
              </span>
            </button>

            {/* Option 2: HTML */}
            <button
              onClick={() => exportHtmlReport(report)}
              className="p-4 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/40 transition text-left space-y-2 group cursor-pointer shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center group-hover:scale-110 transition mb-2">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-teal-800">
                  HTML Certificate
                </div>
                <div className="text-[11px] text-slate-500 leading-tight mt-1">
                  Offline-ready styled certificate (.html)
                </div>
              </div>
              <span className="text-[10px] font-semibold text-teal-700 uppercase tracking-wide">
                Download .html →
              </span>
            </button>

            {/* Option 3: Markdown */}
            <button
              onClick={() => exportMarkdownReport(report)}
              className="p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 transition text-left space-y-2 group cursor-pointer shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-110 transition mb-2">
                  <FileDown className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-blue-800">
                  Markdown (.md)
                </div>
                <div className="text-[11px] text-slate-500 leading-tight mt-1">
                  Clean tables for Slack, GitHub, or Notion
                </div>
              </div>
              <span className="text-[10px] font-semibold text-blue-700 uppercase tracking-wide">
                Download .md →
              </span>
            </button>

            {/* Option 4: JSON */}
            <button
              onClick={() => exportJsonReport(report)}
              className="p-4 rounded-xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50/40 transition text-left space-y-2 group cursor-pointer shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center group-hover:scale-110 transition mb-2">
                  <FileCode className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-purple-800">
                  JSON Data (.json)
                </div>
                <div className="text-[11px] text-slate-500 leading-tight mt-1">
                  Full schema for pipelines &amp; code
                </div>
              </div>
              <span className="text-[10px] font-semibold text-purple-700 uppercase tracking-wide">
                Download .json →
              </span>
            </button>

          </div>

          {/* Markdown Preview Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Report Preview (Markdown)
              </span>
              <button
                onClick={handleCopyMarkdown}
                className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded transition cursor-pointer"
              >
                {copiedMd ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy to Clipboard</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] max-h-48 overflow-y-auto leading-relaxed select-all">
              {markdownPreview}
            </pre>
          </div>

          {/* Privacy Note */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              This report contains metadata and formulas only. Your raw underlying spreadsheet data is never uploaded anywhere.
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
