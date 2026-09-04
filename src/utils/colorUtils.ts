/**
 * Normalizes Excel ARGB/RGB or theme color string into standard #RRGGBB hex.
 */
export function normalizeExcelColor(colorValue: unknown): string | null {
  if (!colorValue) return null;

  if (typeof colorValue === 'string') {
    let clean = colorValue.trim();
    if (clean.startsWith('#')) {
      clean = clean.slice(1);
    }
    // 8-character ARGB (e.g. FFFF0000 or 00FFFFFF)
    if (clean.length === 8) {
      // slice off the Alpha channel if it's opaque (FF) or standard
      return '#' + clean.slice(2).toUpperCase();
    }
    // 6-character RGB
    if (clean.length === 6) {
      return '#' + clean.toUpperCase();
    }
    // 3-character RGB
    if (clean.length === 3) {
      return (
        '#' +
        clean
          .split('')
          .map((c) => c + c)
          .join('')
          .toUpperCase()
      );
    }
  }

  // If color is an ExcelJS color object { argb?: string, theme?: number }
  if (typeof colorValue === 'object' && colorValue !== null) {
    const obj = colorValue as { argb?: string; theme?: number };
    if (obj.argb) {
      return normalizeExcelColor(obj.argb);
    }
  }

  return null;
}

/**
 * Determines if text on this hex background should be black or white for readability.
 */
export function getContrastColor(hexColor: string): '#000000' | '#ffffff' {
  const hex = hexColor.replace('#', '');
  if (hex.length !== 6) return '#000000';

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Perceptive luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#000000' : '#ffffff';
}
