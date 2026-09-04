import type { FormulaErrorType } from '../types/audit';

export interface ParsedFormulaInfo {
  isExternal: boolean;
  externalFile?: string;
  externalSheet?: string;
  externalRange?: string;
  isCrossSheet: boolean;
  referencedSheets: string[];
  hasError: boolean;
  errorType?: FormulaErrorType;
}

const ERROR_STRINGS: FormulaErrorType[] = [
  '#REF!',
  '#VALUE!',
  '#DIV/0!',
  '#NAME?',
  '#N/A',
  '#NUM!',
  '#NULL!',
  '#SPILL!',
  '#CALC!',
  '#GETTING_DATA',
];

/**
 * Analyzes a raw Excel formula string to detect:
 * 1. External file links (e.g. '[Budget.xlsx]Sheet1'!A1 or '[1]Sheet1'!A1)
 * 2. Cross-sheet references within the workbook (e.g. Sheet2!C1, 'Summary 2024'!B4)
 * 3. Embedded formula errors (e.g. #REF!, #VALUE!)
 */
export function analyzeFormula(
  rawFormula: string,
  allKnownSheetNames: string[],
  currentSheetName: string,
  cachedValStr?: string
): ParsedFormulaInfo {
  const formula = (rawFormula || '').trim();
  const info: ParsedFormulaInfo = {
    isExternal: false,
    isCrossSheet: false,
    referencedSheets: [],
    hasError: false,
  };

  if (!formula) {
    return info;
  }

  // 1. Check for Formula Errors
  for (const err of ERROR_STRINGS) {
    if (formula.includes(err) || cachedValStr === err) {
      info.hasError = true;
      info.errorType = err;
      break;
    }
  }

  // 2. Check for External Links: e.g. '[Budget 2024.xlsx]Sheet1'!A1 or 'C:\path\[file.xlsx]Sheet'!A1
  // Regex matches [something.xlsx], [something.xlsm], or [1] (bracketed workbook index/name)
  const externalMatch = formula.match(/(?:'?[^'\[]*\[([^\]]+)\](?:([^'!]+)|'([^']+)')'?!([$A-Z0-9:]+)?)/i);
  if (externalMatch) {
    info.isExternal = true;
    info.externalFile = externalMatch[1];
    info.externalSheet = externalMatch[2] || externalMatch[3] || '';
    info.externalRange = externalMatch[4] || '';
  }

  // 3. Check for Cross-sheet References (referencing other sheets in this workbook)
  const lowerKnownSheets = allKnownSheetNames.map((s) => ({
    original: s,
    lower: s.toLowerCase(),
  }));

  // Matches either 'Sheet Name'! or SheetName!
  const sheetRefRegex = /(?:'([^']+)'|([A-Za-z0-9_\u00A0-\uFFFF]+))!/g;
  let match: RegExpExecArray | null;

  while ((match = sheetRefRegex.exec(formula)) !== null) {
    const rawRef = match[1] || match[2] || '';
    // Skip if it contains brackets (which means external link)
    if (rawRef.includes('[') || rawRef.includes(']')) {
      continue;
    }

    const matchedSheet = lowerKnownSheets.find(
      (s) => s.lower === rawRef.toLowerCase()
    );

    if (matchedSheet && matchedSheet.lower !== currentSheetName.toLowerCase()) {
      if (!info.referencedSheets.includes(matchedSheet.original)) {
        info.referencedSheets.push(matchedSheet.original);
      }
      info.isCrossSheet = true;
    }
  }

  return info;
}
