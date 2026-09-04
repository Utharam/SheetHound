import React, { useState, useRef } from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface DropZoneProps {
  onFileLoaded: (buffer: ArrayBuffer, fileName: string) => void;
  onLoadDemo: () => void;
  isLoading: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({
  onFileLoaded,
  onLoadDemo,
  isLoading,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
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
    <div className="max-w-3xl mx-auto">
      {/* Main Drag & Drop Card */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-10 sm:p-12 text-center transition-all cursor-pointer select-none ${
          isDragOver
            ? 'border-amber-500 bg-amber-50/60 scale-[1.01] shadow-lg'
            : 'border-slate-300/80 bg-white hover:border-slate-400 hover:bg-slate-50/50 shadow-sm'
        } ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}
      >
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

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-inner text-2xl">
            {isLoading ? (
              <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>🐕</span>
            )}
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {isLoading ? 'SheetHound is sniffing your workbook...' : 'Drop your Excel spreadsheet here'}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Supports <strong className="text-slate-700">.xlsx</strong> and <strong className="text-slate-700">.xlsm</strong> • Safe &amp; private in your browser (no servers, no uploads)
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              Browse Computer
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onLoadDemo();
              }}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200/80 text-amber-900 text-xs font-bold transition cursor-pointer border border-amber-200/80 shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Try with Sample Model (1-Click Demo)</span>
            </button>
          </div>

          <div className="pt-2 flex items-center gap-2 text-[11px] text-emerald-800 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>100% Client-Side: We can't see your data. It stays on your device.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
