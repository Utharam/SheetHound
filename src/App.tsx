import { useState, useRef } from 'react';
import {
  Layers,
  Link,
  AlertOctagon,
  FileCode,
  Palette,
  LayoutDashboard,
  ShieldCheck,
  FileDown,
} from 'lucide-react';
import type { WorkbookAuditReport } from './types/audit';
import { auditExcelWorkbook } from './parser/excelAuditor';
import { generateDemoWorkbook } from './utils/demoWorkbook';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BentoGrid } from './components/BentoGrid';
import { HelpReadme } from './components/HelpReadme';
import { ExecutiveSummary } from './components/ExecutiveSummary';
import { TabBreakdown } from './components/TabBreakdown';
import { FormulaDirectory } from './components/FormulaDirectory';
import { ExternalLinksView } from './components/ExternalLinksView';
import { ErrorRegistryView } from './components/ErrorRegistryView';
import { DesignAuditView } from './components/DesignAuditView';
import { ExportReportModal } from './components/ExportReportModal';
import { PrivacyModal } from './components/PrivacyModal';
import { VeeranEasterEggModal } from './components/VeeranEasterEggModal';

type ViewMode = 'summary' | 'tabs' | 'formulas' | 'external-links' | 'errors' | 'design';

export function App() {
  const [report, setReport] = useState<WorkbookAuditReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<ViewMode>('summary');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isVeeranModalOpen, setIsVeeranModalOpen] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);

  const handleFileLoaded = async (buffer: ArrayBuffer, fileName: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const auditResult = await auditExcelWorkbook(buffer, fileName);
      setReport(auditResult);
      setActiveView('summary');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Audit failed:', err);
      setErrorMessage(
        err?.message || 'Failed to inspect Excel file. Please ensure it is a valid .xlsx or .xlsm file.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadDemo = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const { buffer, fileName } = await generateDemoWorkbook();
      const auditResult = await auditExcelWorkbook(buffer, fileName);
      setReport(auditResult);
      setActiveView('summary');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Demo generation failed:', err);
      setErrorMessage('Failed to generate sample workbook.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setReport(null);
    setErrorMessage(null);
    setActiveView('summary');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBento = () => {
    const el = document.getElementById('features-bento');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToDocs = () => {
    const el = document.getElementById('docs-faq');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToUpload = () => {
    if (report) {
      handleReset();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-amber-500 selection:text-white">
      
      {/* Unified Top Navigation (Eliminates Duplicate Header Repetition!) */}
      <Navbar
        onGoToUpload={scrollToUpload}
        onGoToDocs={scrollToDocs}
        onGoToBento={scrollToBento}
        report={report}
        onBackToHome={handleReset}
        onResetFile={handleReset}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        
        {/* Error Alert if any */}
        {errorMessage && (
          <div className="max-w-7xl mx-auto px-4 mt-4">
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between shadow-xs">
              <span>{errorMessage}</span>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-rose-600 hover:text-rose-900 font-bold px-2 py-1 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* State 1: Landing Page (When no report is loaded) */}
        {!report ? (
          <div ref={heroRef}>
            {/* Hero with DropZone */}
            <Hero
              onFileLoaded={handleFileLoaded}
              onLoadDemo={handleLoadDemo}
              isLoading={isLoading}
              onLearnMore={scrollToBento}
            />

            {/* Bento Grid Feature Showcase */}
            <BentoGrid />

            {/* Readme, Handbook & FAQs */}
            <HelpReadme />
          </div>
        ) : (
          /* State 2: Active Audit Dashboard (Single Clean Header Bar!) */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            
            {/* View Navigation Tabs */}
            <div className="flex items-center gap-1.5 border-b border-slate-200 overflow-x-auto pb-px">
              
              {/* Executive Summary Tab */}
              <button
                onClick={() => setActiveView('summary')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-b-2 cursor-pointer whitespace-nowrap ${
                  activeView === 'summary'
                    ? 'border-amber-500 text-amber-900 bg-white shadow-2xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Executive Summary</span>
              </button>

              {/* Tab Breakdown */}
              <button
                onClick={() => setActiveView('tabs')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-b-2 cursor-pointer whitespace-nowrap ${
                  activeView === 'tabs'
                    ? 'border-amber-500 text-amber-900 bg-white shadow-2xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Tab Breakdown</span>
                <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                  {report.totalSheets}
                </span>
              </button>

              {/* Formula Directory */}
              <button
                onClick={() => setActiveView('formulas')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-b-2 cursor-pointer whitespace-nowrap ${
                  activeView === 'formulas'
                    ? 'border-amber-500 text-amber-900 bg-white shadow-2xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <FileCode className="w-4 h-4" />
                <span>Formula Directory</span>
                <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                  {report.totalFormulas}
                </span>
              </button>

              {/* External Links */}
              <button
                onClick={() => setActiveView('external-links')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-b-2 cursor-pointer whitespace-nowrap ${
                  activeView === 'external-links'
                    ? 'border-amber-500 text-amber-900 bg-white shadow-2xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <Link className="w-4 h-4" />
                <span>External Links</span>
                {report.totalExternalLinks > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                    {report.totalExternalLinks}
                  </span>
                )}
              </button>

              {/* Errors & Warnings */}
              <button
                onClick={() => setActiveView('errors')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-b-2 cursor-pointer whitespace-nowrap ${
                  activeView === 'errors'
                    ? 'border-rose-500 text-rose-900 bg-white shadow-2xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <AlertOctagon className="w-4 h-4" />
                <span>Errors &amp; Warnings</span>
                {report.totalErrors > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                    {report.totalErrors}
                  </span>
                )}
              </button>

              {/* Typography & Colors */}
              <button
                onClick={() => setActiveView('design')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-b-2 cursor-pointer whitespace-nowrap ${
                  activeView === 'design'
                    ? 'border-indigo-500 text-indigo-900 bg-white shadow-2xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <Palette className="w-4 h-4" />
                <span>Design &amp; Colors</span>
                <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                  {report.uniqueColorsCount}
                </span>
              </button>

              {/* Quick Export Action in Tab Bar */}
              <div className="ml-auto pl-2 hidden sm:block">
                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold transition cursor-pointer"
                >
                  <FileDown className="w-3.5 h-3.5 text-amber-600" />
                  <span>Export Report</span>
                </button>
              </div>

            </div>

            {/* Active View Container */}
            <div className="pt-2">
              {activeView === 'summary' && (
                <ExecutiveSummary
                  report={report}
                  onNavigateTab={(tab) => setActiveView(tab as ViewMode)}
                />
              )}

              {activeView === 'tabs' && <TabBreakdown sheets={report.sheets} />}

              {activeView === 'formulas' && (
                <FormulaDirectory
                  formulas={report.formulaDirectory}
                  allSheetNames={report.sheets.map((s) => s.name)}
                />
              )}

              {activeView === 'external-links' && (
                <ExternalLinksView
                  externalLinks={report.externalLinksRegistry}
                  uniqueFiles={report.uniqueExternalFiles}
                />
              )}

              {activeView === 'errors' && (
                <ErrorRegistryView errors={report.errorsRegistry} />
              )}

              {activeView === 'design' && (
                <DesignAuditView
                  colorPalette={report.colorPalette}
                  fontInventory={report.fontInventory}
                />
              )}
            </div>

            {/* Export Modal */}
            <ExportReportModal
              report={report}
              isOpen={isExportModalOpen}
              onClose={() => setIsExportModalOpen(false)}
            />

          </div>
        )}

        {/* Privacy & LLM Verification Modal */}
        <PrivacyModal
          isOpen={isPrivacyModalOpen}
          onClose={() => setIsPrivacyModalOpen(false)}
        />

        {/* Veeran Easter Egg Modal */}
        <VeeranEasterEggModal
          isOpen={isVeeranModalOpen}
          onClose={() => setIsVeeranModalOpen(false)}
        />

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 font-bold text-slate-800">
              <span className="text-sm select-none">🐕</span>
              <span>SheetHound</span>
              <span className="text-slate-300">•</span>
              <span>The Spreadsheet Watchdog</span>
            </div>
            <p className="text-slate-400 text-[11px] flex items-center justify-center sm:justify-start gap-1 flex-wrap">
              <span>Created with care by</span>
              <a
                href="https://utharam.github.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-slate-700 hover:text-amber-800 underline underline-offset-2 transition cursor-pointer"
                title="Visit Utharam (utharam.github.io)"
              >
                Utharam
              </a>
              <button
                type="button"
                onClick={() => setIsVeeranModalOpen(true)}
                className="inline-flex items-center justify-center text-xs opacity-50 hover:opacity-100 hover:scale-125 active:scale-95 transition-all duration-150 cursor-pointer p-0.5 ml-0.5 select-none"
                title="🐾"
                aria-label="Secret Tribute"
              >
                🐾
              </button>
              <span className="text-slate-300 mx-1">—</span>
              <span>Part of the Spreadsheet Zoo (</span>
              <a
                href="https://utharam.github.io/LedgerDuck/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-slate-600 hover:text-amber-800 underline underline-offset-2 transition cursor-pointer"
                title="LedgerDuck - Balance & Ledger Reconciliation"
              >
                LedgerDuck 🦆
              </a>
              <span className="text-slate-400">, </span>
              <span className="font-bold text-amber-800">SheetHound 🐕</span>
              <span className="text-slate-400">, </span>
              <a
                href="https://utharam.github.io/excel-cleaner/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-slate-600 hover:text-amber-800 underline underline-offset-2 transition cursor-pointer"
                title="SheetMonkey - The Spreadsheet Grunt Work Engine"
              >
                SheetMonkey 🐒
              </a>
              <span>)</span>
            </p>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-[11px] justify-center sm:justify-end">
            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              className="flex items-center gap-1 text-emerald-700 font-medium hover:underline cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe &amp; Private (Verify with AI)</span>
            </button>
            <span>•</span>
            <span>Zero Server Storage</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
