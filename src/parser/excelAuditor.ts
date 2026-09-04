import ExcelJS from 'exceljs';
import JSZip from 'jszip';
import type {
  ColorAuditItem,
  ExternalLinkItem,
  FontAuditItem,
  FormulaDirectoryItem,
  FormulaErrorItem,
  FormulaErrorType,
  SheetAudit,
  SheetBoundary,
  SheetVisibility,
  WorkbookAuditReport,
} from '../types/audit';
import { normalizeExcelColor } from '../utils/colorUtils';
import { analyzeFormula } from './formulaAnalyzer';

/**
 * Converts a 1-indexed column number to Excel column letters (e.g. 1 -> A, 27 -> AA)
 */
export function colToLetter(col: number): string {
  let temp = col;
  let letter = '';
  while (temp > 0) {
    const rem = (temp - 1) % 26;
    letter = String.fromCharCode(65 + rem) + letter;
    temp = Math.floor((temp - 1) / 26);
  }
  return letter;
}
/**

 * Parses raw OpenXML files inside the .xlsx package using JSZip to reliably detect:
 * 1. Sheet visibility (especially 'veryHidden' which some parsers overlook)
 * 2. External workbook relationships in xl/externalLinks
 */
async function inspectRawOpenXml(fileBuffer: ArrayBuffer) {
  const sheetStates: Map<string, SheetVisibility> = new Map();
  const rawExternalFiles: string[] = [];

  try {
    const zip = await JSZip.loadAsync(fileBuffer);

    // 1. Inspect xl/workbook.xml for sheet visibility states
    const workbookXmlStr = await zip.file('xl/workbook.xml')?.async('text');
    if (workbookXmlStr) {
      const sheetTagRegex = /<sheet\b([^>]*)\/?>/gi;
      let match: RegExpExecArray | null;
      while ((match = sheetTagRegex.exec(workbookXmlStr)) !== null) {
        const attrs = match[1];
        const nameMatch = attrs.match(/name="([^"]+)"/i);
        const stateMatch = attrs.match(/state="([^"]+)"/i);
        if (nameMatch) {
          const sheetName = nameMatch[1];
          const stateAttr = stateMatch ? stateMatch[1] : 'visible';
          let state: SheetVisibility = 'visible';
          if (stateAttr === 'veryHidden') {
            state = 'veryHidden';
          } else if (stateAttr === 'hidden') {
            state = 'hidden';
          }
          sheetStates.set(sheetName, state);
        }
      }
    }

    // 2. Inspect xl/externalLinks/_rels/*.rels to find linked workbook paths
    const relsFiles = Object.keys(zip.files).filter((path) =>
      path.startsWith('xl/externalLinks/_rels/') && path.endsWith('.rels')
    );

    for (const relsPath of relsFiles) {
      const relsXml = await zip.file(relsPath)?.async('text');
      if (relsXml) {
        const targetRegex = /Target="([^"]+)"/gi;
        let tMatch: RegExpExecArray | null;
        while ((tMatch = targetRegex.exec(relsXml)) !== null) {
          const target = tMatch[1];
          if (target && !rawExternalFiles.includes(target)) {
            const cleanTarget = target.replace(/^file:\/\/\/?/, '');
            rawExternalFiles.push(cleanTarget);
          }
        }
      }
    }
  } catch (err) {
    console.warn('Could not inspect raw OpenXML parts:', err);
  }

  return { sheetStates, rawExternalFiles };
}

/**
 * Audits an uploaded Excel file completely in-memory on the client side.
 */
export async function auditExcelWorkbook(
  fileBuffer: ArrayBuffer,
  fileName: string
): Promise<WorkbookAuditReport> {
  const { sheetStates, rawExternalFiles } = await inspectRawOpenXml(fileBuffer);

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(fileBuffer);

  const allSheetNames = workbook.worksheets.map((ws) => ws.name);
  const sheetAudits: SheetAudit[] = [];
  const globalErrors: FormulaErrorItem[] = [];
  const globalExternalLinks: ExternalLinkItem[] = [];
  const globalFormulas: FormulaDirectoryItem[] = [];

  const fontUsageMap = new Map<string, { sizes: Set<number>; count: number; sheets: Set<string> }>();
  const colorUsageMap = new Map<string, { type: 'fill' | 'font'; count: number; sheets: Set<string> }>();

  let totalStrayDataCount = 0;

  // Iterate over each worksheet
  workbook.worksheets.forEach((sheet, idx) => {
    const rawState = sheetStates.get(sheet.name);
    const visibility: SheetVisibility =
      rawState ||
      (sheet.state === 'veryHidden'
        ? 'veryHidden'
        : sheet.state === 'hidden'
        ? 'hidden'
        : 'visible');

    const sheetErrors: FormulaErrorItem[] = [];
    const sheetExternalLinks: ExternalLinkItem[] = [];
    const sheetFonts = new Set<string>();
    const sheetColors = new Set<string>();

    let populatedRows: number[] = [];
    let populatedCols: number[] = [];
    let minR = Infinity;
    let maxR = 0;
    let minC = Infinity;
    let maxC = 0;
    let farthestCellAddress = 'A1';

    let sheetFormulaCount = 0;

    const populatedCellsMap = new Map<string, { addr: string; row: number; col: number; preview: string }>();
    let maxRowCell: { addr: string; row: number; col: number; preview: string } | null = null;
    let maxColCell: { addr: string; row: number; col: number; preview: string } | null = null;

    sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
        const val = cell.value;
        const cellAddr = cell.address || `${colToLetter(colNumber)}${rowNumber}`;

        let previewStr = '';
        if (val !== null && val !== undefined) {
          if (typeof val === 'object') {
            if ('formula' in val) previewStr = `=${(val as any).formula}`;
            else if ('result' in val) previewStr = String((val as any).result);
            else if ('error' in val) previewStr = (val as any).error;
            else previewStr = JSON.stringify(val);
          } else {
            previewStr = String(val);
          }
        }
        if (previewStr.length > 60) {
          previewStr = previewStr.slice(0, 57) + '...';
        }

        const cellInfo = { addr: cellAddr, row: rowNumber, col: colNumber, preview: previewStr };
        populatedCellsMap.set(`${rowNumber}:${colNumber}`, cellInfo);

        // Track boundaries
        populatedRows.push(rowNumber);
        populatedCols.push(colNumber);

        if (rowNumber < minR) minR = rowNumber;
        if (rowNumber > maxR) {
          maxR = rowNumber;
          maxRowCell = cellInfo;
          farthestCellAddress = cellAddr;
        }
        if (colNumber < minC) minC = colNumber;
        if (colNumber > maxC) {
          maxC = colNumber;
          maxColCell = cellInfo;
          if (rowNumber === maxR) {
            farthestCellAddress = cellAddr;
          }
        }

        // Style tracking (Fonts)
        if (cell.font) {
          const fontName = cell.font.name || 'Calibri';
          const fontSize = cell.font.size || 11;
          sheetFonts.add(fontName);

          if (!fontUsageMap.has(fontName)) {
            fontUsageMap.set(fontName, {
              sizes: new Set<number>(),
              count: 0,
              sheets: new Set<string>(),
            });
          }
          const fEntry = fontUsageMap.get(fontName)!;
          fEntry.sizes.add(fontSize);
          fEntry.count += 1;
          fEntry.sheets.add(sheet.name);

          // Font color
          if (cell.font.color) {
            const hex = normalizeExcelColor(cell.font.color);
            if (hex) {
              sheetColors.add(hex);
              if (!colorUsageMap.has(hex)) {
                colorUsageMap.set(hex, {
                  type: 'font',
                  count: 0,
                  sheets: new Set<string>(),
                });
              }
              const cEntry = colorUsageMap.get(hex)!;
              cEntry.count += 1;
              cEntry.sheets.add(sheet.name);
            }
          }
        }

        // Style tracking (Fill Colors)
        if (cell.fill && cell.fill.type === 'pattern' && cell.fill.fgColor) {
          const hex = normalizeExcelColor(cell.fill.fgColor);
          if (hex) {
            sheetColors.add(hex);
            if (!colorUsageMap.has(hex)) {
              colorUsageMap.set(hex, {
                type: 'fill',
                count: 0,
                sheets: new Set<string>(),
              });
            }
            const cEntry = colorUsageMap.get(hex)!;
            cEntry.count += 1;
            cEntry.sheets.add(sheet.name);
          }
        }

        // Formula & Result extraction
        let formulaStr: string | undefined = undefined;
        let cachedResultStr: string | undefined = undefined;

        if (cell.formula) {
          formulaStr = cell.formula;
        } else if (val && typeof val === 'object' && 'formula' in val) {
          formulaStr = (val as { formula: string }).formula;
        }

        // Determine cached result string
        const candidateResult =
          (cell as any).result !== undefined
            ? (cell as any).result
            : val && typeof val === 'object' && 'result' in val
            ? (val as any).result
            : undefined;

        if (candidateResult !== undefined && candidateResult !== null) {
          if (typeof candidateResult === 'object' && 'error' in candidateResult) {
            cachedResultStr = candidateResult.error;
          } else {
            cachedResultStr = String(candidateResult);
          }
        } else if (val && typeof val === 'object' && 'error' in val) {
          cachedResultStr = (val as any).error;
        } else if (typeof val === 'string' && val.startsWith('#')) {
          cachedResultStr = val;
        }

        // Check for direct error value
        const knownErrors: FormulaErrorType[] = [
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

        if (cachedResultStr && knownErrors.includes(cachedResultStr as FormulaErrorType)) {
          const errItem: FormulaErrorItem = {
            sheetName: sheet.name,
            cell: cellAddr,
            row: rowNumber,
            col: colNumber,
            errorType: cachedResultStr as FormulaErrorType,
            formula: formulaStr,
            cachedValue: cachedResultStr,
          };
          sheetErrors.push(errItem);
          globalErrors.push(errItem);
        }

        if (formulaStr) {
          sheetFormulaCount++;
          const analysis = analyzeFormula(
            formulaStr,
            allSheetNames,
            sheet.name,
            cachedResultStr
          );

          // If formula error detected
          if (analysis.hasError && analysis.errorType) {
            const errExists = sheetErrors.some((e) => e.cell === cellAddr);
            if (!errExists) {
              const errItem: FormulaErrorItem = {
                sheetName: sheet.name,
                cell: cellAddr,
                row: rowNumber,
                col: colNumber,
                errorType: analysis.errorType,
                formula: formulaStr,
                cachedValue: cachedResultStr,
              };
              sheetErrors.push(errItem);
              globalErrors.push(errItem);
            }
          }

          // If external link detected
          if (analysis.isExternal) {
            const extItem: ExternalLinkItem = {
              sheetName: sheet.name,
              cell: cellAddr,
              row: rowNumber,
              col: colNumber,
              targetWorkbook: analysis.externalFile || 'Unknown External Workbook',
              targetSheet: analysis.externalSheet,
              targetRange: analysis.externalRange,
              formula: formulaStr,
            };
            sheetExternalLinks.push(extItem);
            globalExternalLinks.push(extItem);
          }

          // Push to global Formula Directory
          globalFormulas.push({
            id: `${sheet.name}!${cellAddr}`,
            sheetName: sheet.name,
            cell: cellAddr,
            row: rowNumber,
            col: colNumber,
            formula: formulaStr,
            cachedValue: cachedResultStr,
            isCrossSheet: analysis.isCrossSheet,
            referencedSheets: analysis.referencedSheets,
            isExternal: analysis.isExternal,
            referencedWorkbook: analysis.externalFile,
            hasError: analysis.hasError,
            errorType: analysis.errorType,
          });
        }
      });
    });

    // Handle empty sheet case
    if (populatedRows.length === 0) {
      minR = 0;
      maxR = 0;
      minC = 0;
      maxC = 0;
      farthestCellAddress = 'None';
    }

    // Stray cell analysis:
    // Determine if there's an extreme outlier far from the main data block.
    // Helper to count how many populated cells exist around (r, c) within a radius of ±5 rows and ±5 cols (10-cell span)
    const getNeighborhoodCount = (centerR: number, centerC: number, radius = 5): number => {
      let count = 0;
      for (let dr = -radius; dr <= radius; dr++) {
        for (let dc = -radius; dc <= radius; dc++) {
          if (dr === 0 && dc === 0) continue;
          if (populatedCellsMap.has(`${centerR + dr}:${centerC + dc}`)) {
            count++;
          }
        }
      }
      return count;
    };

    let hasStrayCells = false;
    let isIsolatedStray = false;
    let strayExplanation: string | undefined = undefined;
    interface PopulatedCellMeta {
      addr: string;
      row: number;
      col: number;
      preview: string;
    }

    const vCell = maxRowCell as PopulatedCellMeta | null;
    const hCell = maxColCell as PopulatedCellMeta | null;
    let primaryFarthestCell: PopulatedCellMeta | null = vCell || hCell;
    let nearbyCount = 0;

    if (populatedRows.length > 5) {
      populatedRows.sort((a, b) => a - b);
      populatedCols.sort((a, b) => a - b);

      const p90Row = populatedRows[Math.floor(populatedRows.length * 0.9)];
      const p90Col = populatedCols[Math.floor(populatedCols.length * 0.9)];

      const rowGap = maxR - p90Row;
      const colGap = maxC - p90Col;

      // Check vertical extremity
      const vertNearby = vCell ? getNeighborhoodCount(vCell.row, vCell.col, 5) : 0;
      const isVertIsolated = vertNearby < 4; // fewer than 4 cells in 10-cell neighborhood
      const isVertOutlier = rowGap > 25;

      // Check horizontal extremity
      const horizNearby = hCell ? getNeighborhoodCount(hCell.row, hCell.col, 5) : 0;
      const isHorizIsolated = horizNearby < 4;
      const isHorizOutlier = colGap > 10;

      if (isVertOutlier && isVertIsolated) {
        hasStrayCells = true;
        isIsolatedStray = true;
        totalStrayDataCount++;
        primaryFarthestCell = vCell;
        nearbyCount = vertNearby;
        const valSnippet = vCell?.preview ? ` (Content: "${vCell.preview}")` : '';
        strayExplanation = `Isolated stray cell at ${vCell?.addr}: only ${vertNearby} other cell(s) within a 10-cell radius, separated by ${rowGap} blank rows from the main table.${valSnippet}`;
      } else if (isHorizOutlier && isHorizIsolated) {
        hasStrayCells = true;
        isIsolatedStray = true;
        totalStrayDataCount++;
        primaryFarthestCell = hCell;
        nearbyCount = horizNearby;
        const valSnippet = hCell?.preview ? ` (Content: "${hCell.preview}")` : '';
        strayExplanation = `Isolated stray cell at ${hCell?.addr}: only ${horizNearby} other cell(s) within a 10-cell radius, located ${colGap} columns to the right of the main content.${valSnippet}`;
      } else if (rowGap > 50 || colGap > 15) {
        // Distant table or secondary section (has >= 4 cells nearby, not an isolated single-cell drop)
        hasStrayCells = false;
        isIsolatedStray = false;
        nearbyCount = vertNearby;
        strayExplanation = `Farthest boundary at ${vCell?.addr || farthestCellAddress} is part of a cluster (${vertNearby + 1} cells nearby, not an isolated stray drop).`;
      }
    }

    const boundary: SheetBoundary = {
      minRow: minR === Infinity ? 0 : minR,
      maxRow: maxR,
      minCol: minC === Infinity ? 0 : minC,
      maxCol: maxC,
      farthestCell: primaryFarthestCell?.addr || farthestCellAddress,
      farthestRow: maxR,
      farthestCol: maxC,
      farthestCellValue: primaryFarthestCell?.preview,
      verticalFarthestCell: vCell?.addr,
      horizontalFarthestCell: hCell?.addr,
      nearbyCellsCount: nearbyCount,
      isIsolatedStray,
      hasStrayCells,
      strayCellExplanation: strayExplanation,
    };

    sheetAudits.push({
      id: idx + 1,
      name: sheet.name,
      visibility,
      rowCount: sheet.rowCount || maxR,
      columnCount: sheet.columnCount || maxC,
      boundary,
      formulaCount: sheetFormulaCount,
      errorCount: sheetErrors.length,
      externalLinkCount: sheetExternalLinks.length,
      errors: sheetErrors,
      externalLinks: sheetExternalLinks,
      fonts: Array.from(sheetFonts),
      colors: Array.from(sheetColors),
    });
  });

  // Extract unique external files
  const uniqueExternalFilesSet = new Set<string>();
  globalExternalLinks.forEach((link) => uniqueExternalFilesSet.add(link.targetWorkbook));
  rawExternalFiles.forEach((file) => uniqueExternalFilesSet.add(file));

  // Build color palette audit items
  const colorPalette: ColorAuditItem[] = Array.from(colorUsageMap.entries())
    .map(([hex, data]) => ({
      hex,
      type: data.type,
      count: data.count,
      sheets: Array.from(data.sheets),
    }))
    .sort((a, b) => b.count - a.count);

  // Build font inventory audit items
  const fontInventory: FontAuditItem[] = Array.from(fontUsageMap.entries())
    .map(([name, data]) => ({
      name,
      sizes: Array.from(data.sizes).sort((a, b) => a - b),
      count: data.count,
      sheets: Array.from(data.sheets),
    }))
    .sort((a, b) => b.count - a.count);

  const visibleCount = sheetAudits.filter((s) => s.visibility === 'visible').length;
  const hiddenCount = sheetAudits.filter((s) => s.visibility === 'hidden').length;
  const veryHiddenCount = sheetAudits.filter((s) => s.visibility === 'veryHidden').length;

  return {
    fileName,
    fileSizeBytes: fileBuffer.byteLength,
    totalSheets: sheetAudits.length,
    visibleSheetsCount: visibleCount,
    hiddenSheetsCount: hiddenCount,
    veryHiddenSheetsCount: veryHiddenCount,
    totalFormulas: globalFormulas.length,
    totalErrors: globalErrors.length,
    totalExternalLinks: globalExternalLinks.length,
    uniqueExternalFiles: Array.from(uniqueExternalFilesSet),
    strayDataWarningCount: totalStrayDataCount,
    uniqueFontsCount: fontInventory.length,
    uniqueColorsCount: colorPalette.length,
    sheets: sheetAudits,
    externalLinksRegistry: globalExternalLinks,
    errorsRegistry: globalErrors,
    formulaDirectory: globalFormulas,
    colorPalette,
    fontInventory,
  };
}
