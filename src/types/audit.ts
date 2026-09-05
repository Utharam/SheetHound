export type SheetVisibility = 'visible' | 'hidden' | 'veryHidden';

export type FormulaErrorType = 
  | '#REF!'
  | '#VALUE!'
  | '#DIV/0!'
  | '#NAME?'
  | '#N/A'
  | '#NUM!'
  | '#NULL!'
  | '#GETTING_DATA'
  | '#SPILL!'
  | '#CALC!';

export interface CellCoordinate {
  address: string; // e.g. "C12"
  row: number;     // 1-indexed
  col: number;     // 1-indexed
}

export interface FormulaErrorItem {
  sheetName: string;
  cell: string;
  row: number;
  col: number;
  errorType: FormulaErrorType;
  formula?: string;
  cachedValue?: string;
}

export interface ExternalLinkItem {
  sheetName: string;
  cell: string;
  row: number;
  col: number;
  targetWorkbook: string;
  targetSheet?: string;
  targetRange?: string;
  formula: string;
}

export interface FormulaDirectoryItem {
  id: string;
  sheetName: string;
  cell: string;
  row: number;
  col: number;
  formula: string;
  cachedValue?: string;
  isCrossSheet: boolean;
  referencedSheets: string[];
  isExternal: boolean;
  referencedWorkbook?: string;
  hasError: boolean;
  errorType?: FormulaErrorType;
}

export interface ColorAuditItem {
  hex: string;
  type: 'fill' | 'font';
  count: number;
  sheets: string[];
}

export interface FontAuditItem {
  name: string;
  sizes: number[];
  count: number;
  sheets: string[];
}

export interface SheetBoundary {
  minRow: number;
  maxRow: number;
  minCol: number;
  maxCol: number;
  farthestCell: string; // e.g. "Z450"
  farthestRow: number;
  farthestCol: number;
  farthestCellValue?: string;
  verticalFarthestCell?: string;
  horizontalFarthestCell?: string;
  nearbyCellsCount?: number;
  isIsolatedStray: boolean;
  hasStrayCells: boolean;
  strayCellExplanation?: string;
}

export interface HeatmapBlock {
  rowIdx: number;
  colIdx: number;
  rowStart: number;
  rowEnd: number;
  colStart: number;
  colEnd: number;
  colStartLetter: string;
  colEndLetter: string;
  cellCount: number;
  density: number; // 0.0 to 1.0 relative to peak bin
  hasFormulas: boolean;
  hasErrors: boolean;
  errorCount: number;
  hasStray: boolean;
  strayCellAddress?: string;
  previewSample?: string;
}

export interface SheetHeatmapData {
  gridRows: number;
  gridCols: number;
  totalCells: number;
  maxBlockCount: number;
  matrix: HeatmapBlock[][];
  mainClusterSummary: string;
  strayOutlierSummary?: string;
  mainClusterBounds: {
    rowStart: number;
    rowEnd: number;
    colStart: number;
    colEnd: number;
    colStartLetter: string;
    colEndLetter: string;
    percentageOfData: number;
  };
}

export interface SheetAudit {
  id: number;
  name: string;
  visibility: SheetVisibility;
  rowCount: number;
  columnCount: number;
  boundary: SheetBoundary;
  formulaCount: number;
  errorCount: number;
  externalLinkCount: number;
  errors: FormulaErrorItem[];
  externalLinks: ExternalLinkItem[];
  fonts: string[];
  colors: string[];
  heatmap?: SheetHeatmapData;
}

export interface WorkbookAuditReport {
  fileName: string;
  fileSizeBytes: number;
  totalSheets: number;
  visibleSheetsCount: number;
  hiddenSheetsCount: number;
  veryHiddenSheetsCount: number;
  totalFormulas: number;
  totalErrors: number;
  totalExternalLinks: number;
  uniqueExternalFiles: string[];
  strayDataWarningCount: number;
  uniqueFontsCount: number;
  uniqueColorsCount: number;
  sheets: SheetAudit[];
  externalLinksRegistry: ExternalLinkItem[];
  errorsRegistry: FormulaErrorItem[];
  formulaDirectory: FormulaDirectoryItem[];
  colorPalette: ColorAuditItem[];
  fontInventory: FontAuditItem[];
}
