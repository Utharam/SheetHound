import React, { useState } from 'react';
import { Palette, Type, AlertCircle, Copy, Check } from 'lucide-react';
import type { ColorAuditItem, FontAuditItem } from '../types/audit';
import { getContrastColor } from '../utils/colorUtils';

interface DesignAuditViewProps {
  colorPalette: ColorAuditItem[];
  fontInventory: FontAuditItem[];
}

export const DesignAuditView: React.FC<DesignAuditViewProps> = ({
  colorPalette,
  fontInventory,
}) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const fillColors = colorPalette.filter((c) => c.type === 'fill');
  const fontColors = colorPalette.filter((c) => c.type === 'font');

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Palette className="w-5 h-5 text-emerald-600" />
          Typography & Color Palette Audit
        </h2>
        <p className="text-xs text-slate-500">
          Audit workbook styling consistency, detect rogue fonts, and inspect brand color usage
        </p>
      </div>

      {/* Font Inventory Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Type className="w-4 h-4 text-indigo-600" />
            Detected Fonts ({fontInventory.length} Families)
          </h3>
          {fontInventory.length > 2 && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Tip: Best practice recommends no more than 1-2 fonts per workbook
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {fontInventory.map((f, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-slate-900" style={{ fontFamily: f.name }}>
                  {f.name}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {f.count} cells
                </span>
              </div>

              <div className="text-xs text-slate-500 space-y-1">
                <div>
                  <span className="font-semibold text-slate-700">Sizes used:</span>{' '}
                  {f.sizes.map((s) => `${s}pt`).join(', ')}
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Appears in:</span>{' '}
                  <span className="text-slate-600">{f.sheets.join(', ')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Background Fill Colors Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
          <Palette className="w-4 h-4 text-emerald-600" />
          Background Fill Swatches ({fillColors.length} Unique Colors)
        </h3>

        {fillColors.length === 0 ? (
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-400">
            No custom background fills detected (standard white/transparent).
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {fillColors.map((color, i) => {
              const contrast = getContrastColor(color.hex);
              return (
                <div
                  key={i}
                  onClick={() => copyHex(color.hex)}
                  className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden cursor-pointer hover:border-slate-400 transition group"
                  title="Click to copy HEX"
                >
                  {/* Visual Color Block */}
                  <div
                    className="h-16 w-full flex items-center justify-center font-mono font-bold text-xs shadow-inner"
                    style={{ backgroundColor: color.hex, color: contrast }}
                  >
                    {color.hex}
                  </div>

                  <div className="p-2.5 text-[11px] text-slate-600 flex items-center justify-between">
                    <span>{color.count} cells</span>
                    <button className="text-slate-400 group-hover:text-slate-700">
                      {copiedHex === color.hex ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Font / Text Colors Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
          <Palette className="w-4 h-4 text-purple-600" />
          Font Text Colors ({fontColors.length} Unique Colors)
        </h3>

        {fontColors.length === 0 ? (
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-400">
            Default text colors used across all sheets.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {fontColors.map((color, i) => {
              const contrast = getContrastColor(color.hex);
              return (
                <div
                  key={i}
                  onClick={() => copyHex(color.hex)}
                  className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden cursor-pointer hover:border-slate-400 transition group"
                  title="Click to copy HEX"
                >
                  <div
                    className="h-16 w-full flex items-center justify-center font-mono font-bold text-xs shadow-inner"
                    style={{ backgroundColor: color.hex, color: contrast }}
                  >
                    {color.hex}
                  </div>

                  <div className="p-2.5 text-[11px] text-slate-600 flex items-center justify-between">
                    <span>{color.count} cells</span>
                    <button className="text-slate-400 group-hover:text-slate-700">
                      {copiedHex === color.hex ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
