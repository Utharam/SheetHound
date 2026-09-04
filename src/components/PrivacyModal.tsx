import { useState } from 'react';
import { ShieldCheck, Copy, Check, X, Sparkles, WifiOff, Lock } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  if (!isOpen) return null;

  const llmVerificationPrompt = `I am using an in-browser spreadsheet audit tool called SheetHound (by Utharam). The creator claims that it is 100% private because all Excel file reading, OpenXML zip inspection, and formula parsing happen strictly client-side in my web browser's memory (using FileReader, JSZip, and in-memory JavaScript/WASM), with zero server uploads and zero backend APIs.

Can you explain in plain English to an accountant/finance professional:
1. Is it technically possible for a web page to audit an Excel file without uploading it to a server?
2. If I turn off my internet/Wi-Fi and the tool still works, does that prove no data is leaving my computer?
3. How does local browser memory guarantee that the website owner cannot see my company's confidential payroll, numbers, or formulas?`;

  const handleCopy = () => {
    navigator.clipboard.writeText(llmVerificationPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 text-xl font-bold">
              🛡️
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                Your Data Never Leaves Your Device
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Plain-language privacy guarantee for finance professionals
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-slate-600">
          
          {/* 3 Plain English Promises */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                <Lock className="w-3.5 h-3.5 text-emerald-700" />
              </div>
              <h4 className="font-bold text-slate-900 text-xs">We Can't See It</h4>
              <p className="text-[11px] text-slate-500 leading-tight">
                No human, server, database, or API ever receives your file.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm">
                💻
              </div>
              <h4 className="font-bold text-slate-900 text-xs">Stays In Your Browser</h4>
              <p className="text-[11px] text-slate-500 leading-tight">
                Calculated entirely within your laptop's local temporary memory.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-sm">
                <WifiOff className="w-3.5 h-3.5 text-purple-700" />
              </div>
              <h4 className="font-bold text-slate-900 text-xs">Works 100% Offline</h4>
              <p className="text-[11px] text-slate-500 leading-tight">
                Disconnect your Wi-Fi and drop a sheet. It still audits normally!
              </p>
            </div>
          </div>

          {/* Still Doubtful? Ask your LLM Section */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Still doubtful? Ask ChatGPT, Claude, or Gemini to verify
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-200 hover:bg-amber-300 px-2.5 py-1 rounded-lg transition cursor-pointer shadow-2xs"
              >
                {copiedPrompt ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-700" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Prompt</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-amber-900 leading-relaxed">
              Don't take our word for it. Copy this query, paste it into any AI model of your choice, and ask it to verify whether SheetHound's architecture can ever leak your numbers:
            </p>

            <div className="p-3 rounded-xl bg-white/90 border border-amber-200/80 font-mono text-[10px] text-slate-700 leading-relaxed max-h-32 overflow-y-auto select-all">
              {llmVerificationPrompt}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>SheetHound by Utharam</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition cursor-pointer"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
};
