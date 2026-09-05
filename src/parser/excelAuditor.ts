import ExcelJS from 'exceljs';
import JSZip from 'jszip';
import type {
  ColorAuditItem,
  ExternalLinkItem,
  FontAuditItem,
  FormulaDirectoryItem,
  FormulaErrorItem,
  FormulaErrorType,
  HeatmapBlock,
  SheetAudit,
  SheetBoundary,
  SheetHeatmapData,
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

export interface PopulatedCellMeta {
  addr: string;
  row: number;
  col: number;
  preview: string;
}

/**
 * Builds an adaptive 2D spatial density matrix and stray radar for a worksheet.
 */
export function buildSheetHeatmap(
  populatedCells: PopulatedCellMeta[],
  maxRow: number,
  maxCol: number,
  errors: FormulaErrorItem[],
  boundary: SheetBoundary
): SheetHeatmapData {
  if (populatedCells.length === 0 || maxRow === 0 || maxCol === 0) {
    return {
      gridRows: 8,
      gridCols: 16,
      totalCells: 0,
      maxBlockCount: 0,
      matrix: [],
      mainClusterSummary: 'Empty sheet (0 populated cells)',
      mainClusterBounds: {
        rowStart: 0,
        rowEnd: 0,
        colStart: 0,
        colEnd: 0,
        colStartLetter: '—',
        colEndLetter: '—',
        percentageOfData: 0,
      },
    };
  }

  // Adaptive grid dimensions: 12-24 cols, 6-12 rows
  const gridCols = Math.min(24, Math.max(12, maxCol));
  const gridRows = Math.min(12, Math.max(6, maxRow));

  const matrix: HeatmapBlock[][] = [];
  for (let r = 0; r < gridRows; r++) {
    const rowBlocks: HeatmapBlock[] = [];
    const rStart = Math.floor((r * maxRow) / gridRows) + 1;
    const rEnd = Math.floor(((r + 1) * maxRow) / gridRows);

    for (let c = 0; c < gridCols; c++) {
      const cStart = Math.floor((c * maxCol) / gridCols) + 1;
      const cEnd = Math.floor(((c + 1) * maxCol) / gridCols);

      rowBlocks.push({
        rowIdx: r,
        colIdx: c,
        rowStart: rStart,
        rowEnd: Math.max(rStart, rEnd),
        colStart: cStart,
        colEnd: Math.max(cStart, cEnd),
        colStartLetter: colToLetter(cStart),
        colEndLetter: colToLetter(Math.max(cStart, cEnd)),
        cellCount: 0,
        density: 0,
        hasFormulas: false,
        hasErrors: false,
        errorCount: 0,
        hasStray: false,
      });
    }
    matrix.push(rowBlocks);
  }

  const errorCoords = new Map<string, FormulaErrorItem>();
  errors.forEach((err) => {
    errorCoords.set(`${err.row}:${err.col}`, err);
  });

  let maxBlockCount = 0;
  populatedCells.forEach((cell) => {
    const rBin = Math.min(gridRows - 1, Math.floor(((cell.row - 1) / maxRow) * gridRows));
    const cBin = Math.min(gridCols - 1, Math.floor(((cell.col - 1) / maxCol) * gridCols));

    const block = matrix[rBin][cBin];
    block.cellCount++;
    if (!block.previewSample && cell.preview) {
      block.previewSample = cell.preview;
    }
    if (cell.preview && cell.preview.startsWith('=')) {
      block.hasFormulas = true;
    }

    if (errorCoords.has(`${cell.row}:${cell.col}`)) {
      block.hasErrors = true;
      block.errorCount++;
    }

    if (block.cellCount > maxBlockCount) {
      maxBlockCount = block.cellCount;
    }
  });

  // Flag stray outlier block
  let strayOutlierSummary: string | undefined = undefined;
  if (boundary.hasStrayCells && boundary.farthestRow && boundary.farthestCol) {
    const sRBin = Math.min(gridRows - 1, Math.floor(((boundary.farthestRow - 1) / maxRow) * gridRows));
    const sCBin = Math.min(gridCols - 1, Math.floor(((boundary.farthestCol - 1) / maxCol) * gridCols));
    const strayBlock = matrix[sRBin][sCBin];
    strayBlock.hasStray = true;
    strayBlock.strayCellAddress = boundary.farthestCell;
    if (boundary.farthestCellValue) {
      strayBlock.previewSample = boundary.farthestCellValue;
    }
    const distanceRows = maxRow - (boundary.farthestRow === maxRow ? 40 : 0);
    strayOutlierSummary = `Isolated stray cell at ${boundary.farthestCell} (${boundary.farthestCellValue ? `"${boundary.farthestCellValue}"` : 'populated'}), isolated ~${distanceRows} rows away from the main data block.`;
  }

  // Calculate density
  for (let r = 0; r < gridRows; r++) {
    for (let c = 0; c < gridCols; c++) {
      const block = matrix[r][c];
      block.density = maxBlockCount > 0 ? Number((block.cellCount / maxBlockCount).toFixed(3)) : 0;
    }
  }

  // Calculate 90% main cluster bounds
  const sortedRows = populatedCells.map((c) => c.row).sort((a, b) => a - b);
  const sortedCols = populatedCells.map((c) => c.col).sort((a, b) => a - b);
  const pMinRow = sortedRows[0] || 1;
  const pMaxRow = sortedRows[Math.floor(sortedRows.length * 0.9)] || maxRow;
  const pMinCol = sortedCols[0] || 1;
  const pMaxCol = sortedCols[Math.floor(sortedCols.length * 0.9)] || maxCol;

  const clusterCellsCount = populatedCells.filter(
    (c) => c.row >= pMinRow && c.row <= pMaxRow && c.col >= pMinCol && c.col <= pMaxCol
  ).length;
  const clusterPct = Math.round((clusterCellsCount / populatedCells.length) * 100);

  const mainClusterBounds = {
    rowStart: pMinRow,
    rowEnd: pMaxRow,
    colStart: pMinCol,
    colEnd: pMaxCol,
    colStartLetter: colToLetter(pMinCol),
    colEndLetter: colToLetter(pMaxCol),
    percentageOfData: clusterPct,
  };

  const mainClusterSummary = `Rows ${pMinRow}–${pMaxRow}, Cols ${colToLetter(pMinCol)}–${colToLetter(pMaxCol)} contain ${clusterPct}% of all data (${clusterCellsCount} of ${populatedCells.length} cells).`;

  return {
    gridRows,
    gridCols,
    totalCells: populatedCells.length,
    maxBlockCount,
    matrix,
    mainClusterSummary,
    strayOutlierSummary,
    mainClusterBounds,
  };
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

    const populatedCellsMap = new Map<string, PopulatedCellMeta>();
    let maxRowCell: PopulatedCellMeta | null = null;
    let maxColCell: PopulatedCellMeta | null = null;

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

    const vCell = maxRowCell as unknown as PopulatedCellMeta | null;
    const hCell = maxColCell as unknown as PopulatedCellMeta | null;
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

    const heatmap = buildSheetHeatmap(
      Array.from(populatedCellsMap.values()),
      maxR,
      maxC,
      sheetErrors,
      boundary
    );

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
      heatmap,
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
