import React from 'react';
import { ShieldCheck, ArrowDown } from 'lucide-react';
import { DropZone } from './DropZone';

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
  onLearnMore,
}) => {
  return (
    <div className="relative overflow-hidden pt-10 pb-16 bg-radial from-amber-50/60 via-slate-50 to-white">
      {/* Background ambient decorative shapes */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-amber-200/20 via-emerald-200/20 to-blue-200/20 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
        
        {/* Brand Persona Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200 shadow-2xs text-xs font-bold text-slate-800">
          <span className="text-base">🐕</span>
          <span>SheetHound</span>
          <a
            href="https://utharam.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-800 hover:text-amber-900 font-semibold hover:underline transition cursor-pointer"
            title="Visit Utharam (utharam.github.io)"
          >
            by Utharam
          </a>
          <span className="text-slate-300">•</span>
          <span className="text-emerald-700 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% In-Browser Privacy
          </span>
        </div>

        {/* Hero Title */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
            Never send a broken spreadsheet again.
          </h1>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            The loyal watchdog for financial analysts and accountants. Sniffs out broken external links, 
            hidden payroll tabs, stray scratchpad cells, and formula spaghetti in seconds.
          </p>
        </div>

        {/* Embedded Interactive DropZone */}
        <div className="pt-2">
          <DropZone
            onFileLoaded={onFileLoaded}
            onLoadDemo={onLoadDemo}
            isLoading={isLoading}
          />
        </div>

        {/* Quick Anchor to Features */}
        <div className="pt-4">
          <button
            onClick={onLearnMore}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition cursor-pointer"
          >
            <span>Explore all inspection features</span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          </button>
        </div>

      </div>
    </div>
  );
};
