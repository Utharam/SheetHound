import React from 'react';
import { ShieldCheck, Lock, Cpu, EyeOff, Sparkles } from 'lucide-react';

interface ComplianceBarProps {
  onOpenPrivacyModal?: () => void;
}

export const ComplianceBar: React.FC<ComplianceBarProps> = ({ onOpenPrivacyModal }) => {
  const safeguards = [
    {
      icon: <Lock className="w-4 h-4 text-emerald-600 shrink-0" />,
      title: 'Air-Gapped Local Runtime',
      desc: '100% in-browser RAM execution. Zero server round-trips or cloud storage.',
    },
    {
      icon: <EyeOff className="w-4 h-4 text-emerald-600 shrink-0" />,
      title: 'Immutable Read-Only Parsing',
      desc: 'Never writes to or alters your original spreadsheet. Zero corruption risk.',
    },
    {
      icon: <Cpu className="w-4 h-4 text-emerald-600 shrink-0" />,
      title: 'Sub-Second AST Processing',
      desc: 'Parses 50,000+ formulas, dependencies, and styles in ~500ms on your device.',
    },
    {
      icon: <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />,
      title: 'Zero Data Retention',
      desc: 'Memory wiped cleanly on tab close. Never trained on AI or scraped.',
    },
  ];

  return (
    <section className="border-y border-slate-200 bg-white/80 backdrop-blur-xs py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          {/* Safeguard Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full lg:w-auto flex-1">
            {safeguards.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  {item.icon}
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick AI Verification Trigger */}
          {onOpenPrivacyModal && (
            <div className="shrink-0 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={onOpenPrivacyModal}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-2xs cursor-pointer w-full sm:w-auto justify-center"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Verify with AI Prompt</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};
