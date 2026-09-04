import { Heart, X, Sparkles } from 'lucide-react';

interface VeeranEasterEggModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VeeranEasterEggModal: React.FC<VeeranEasterEggModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-amber-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-center">
        
        {/* Banner with Warm Ambient Gradient */}
        <div className="relative p-8 bg-gradient-to-b from-amber-100/80 via-amber-50 to-white flex flex-col items-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white/80 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Doggo Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-amber-500 text-white flex items-center justify-center text-5xl shadow-xl shadow-amber-500/30 border-4 border-white animate-bounce-short">
              🐕
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white border-2 border-amber-200 flex items-center justify-center text-sm shadow-xs">
              🐾
            </div>
          </div>

          <div className="mt-4 space-y-1">
            <div className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900">
              <Sparkles className="w-3 h-3 text-amber-700" /> Official Mascot
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              Meet Veeran, the Indian Spitz
            </h3>
            <p className="text-xs text-amber-900/70 font-semibold">
              The Chief Spreadsheet Watchdog &amp; Heart of SheetHound
            </p>
          </div>
        </div>

        {/* Story */}
        <div className="px-6 pb-6 space-y-4 text-xs text-slate-600 leading-relaxed text-left">
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 space-y-2">
            <p className="text-slate-700">
              Loyal, sharp, and ever-vigilant. An Indian Spitz never misses a whisper in the house—and neither does SheetHound when auditing your Excel workbooks.
            </p>
            <p className="text-slate-700">
              Built as a tribute to <strong>Veeran</strong>, whose protective spirit watches over every formula, hidden payroll tab, and ghost link so you never take a bullet from leadership again.
            </p>
          </div>

          <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 border-t border-slate-100">
            <span className="flex items-center gap-1 font-medium text-slate-600">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> Created by{' '}
              <a
                href="https://utharam.github.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-slate-800 hover:text-amber-800 underline transition cursor-pointer"
              >
                Utharam
              </a>
            </span>
            <span>100% Free &amp; Private</span>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer shadow-xs"
          >
            Good Doggo! Back to Work 🐾
          </button>
        </div>

      </div>
    </div>
  );
};
