import ExcelJS from 'exceljs';
import JSZip from 'jszip';

/**
 * Generates an in-memory .xlsx file buffer populated with realistic audit scenarios:
 * - External link formulas pointing to '[2024_Master_Budget.xlsx]'
 * - Cross-sheet formulas
 * - #REF! and #DIV/0! formula errors
 * - A hidden sheet
 * - A 'veryHidden' sheet (using JSZip post-processing on xl/workbook.xml)
 * - Farthest stray cells dropped at row 180 and col W
 * - Multiple fonts (Aptos, Calibri, Arial, Consolas) and color palettes
 */
export async function generateDemoWorkbook(): Promise<{ buffer: ArrayBuffer; fileName: string }> {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Demo Generator';
  wb.created = new Date();

  // -------------------------------------------------------------
  // Sheet 1: Executive_Summary (Visible)
  // -------------------------------------------------------------
  const ws1 = wb.addWorksheet('Executive_Summary', {
    views: [{ showGridLines: true }],
  });

  // Title
  const titleCell = ws1.getCell('A1');
  titleCell.value = 'Q3 Performance Dashboard';
  titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FF1F4E78' } };

  // Headers
  ws1.getRow(3).values = ['Category', 'Q1 Actual', 'Q2 Actual', 'Q3 Forecast', 'Variance %'];
  ws1.getRow(3).font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
  ws1.getRow(3).eachCell((c) => {
    c.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1F4E78' },
    };
  });

  // Row 4: Hardware
  ws1.getCell('A4').value = 'Hardware Sales';
  ws1.getCell('B4').value = 450000;
  ws1.getCell('C4').value = 480000;
  ws1.getCell('D4').value = { formula: "='Q3_Data'!C4 * 1.08", result: 518400 };
  ws1.getCell('E4').value = { formula: '=(D4-C4)/C4', result: 0.08 };

  // Row 5: Cloud Services
  ws1.getCell('A5').value = 'Cloud Subscriptions';
  ws1.getCell('B5').value = 210000;
  ws1.getCell('C5').value = 230000;
  // External link!
  ws1.getCell('D5').value = {
    formula: "='[2024_Master_Budget.xlsx]Forecast'!$C$12",
    result: 260000,
  };
  ws1.getCell('E5').value = { formula: '=(D5-C5)/C5', result: 0.13 };

  // Row 6: Consulting
  ws1.getCell('A6').value = 'Consulting Services';
  ws1.getCell('B6').value = 120000;
  ws1.getCell('C6').value = 115000;
  // Broken formula error (#REF!)
  ws1.getCell('D6').value = {
    formula: '=SUM(B6:#REF!)',
    result: { error: '#REF!' } as any,
  };
  ws1.getCell('E6').value = { formula: '=(D6-C6)/C6', result: { error: '#REF!' } as any };

  // Row 7: Total Summary
  ws1.getCell('A7').value = 'Total Revenue';
  ws1.getCell('A7').font = { name: 'Calibri', bold: true, size: 11 };
  ws1.getCell('B7').value = { formula: '=SUM(B4:B6)', result: 780000 };
  ws1.getCell('C7').value = { formula: '=SUM(C4:C6)', result: 825000 };
  ws1.getCell('D7').value = { formula: '=SUM(D4:D6)', result: { error: '#REF!' } as any };
  ws1.getRow(7).font = { bold: true };

  // Accidental Stray Scratchpad Cell dropped far away!
  const strayCell = ws1.getCell('W180');
  strayCell.value = 'scratchpad: verify offshore numbers before Friday presentation';
  strayCell.font = { name: 'Consolas', size: 9, italic: true, color: { argb: 'FF808080' } };

  // -------------------------------------------------------------
  // Sheet 2: Q3_Data (Visible)
  // -------------------------------------------------------------
  const ws2 = wb.addWorksheet('Q3_Data');
  ws2.getCell('A1').value = 'Regional Breakdown Raw Figures';
  ws2.getCell('A1').font = { name: 'Segoe UI', size: 14, bold: true };

  ws2.getRow(3).values = ['Region', 'Units Sold', 'Base Price', 'Margin Error'];
  ws2.getRow(3).eachCell((c) => {
    c.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF385723' },
    };
    c.font = { name: 'Segoe UI', color: { argb: 'FFFFFFFF' }, bold: true };
  });

  ws2.getCell('A4').value = 'North America';
  ws2.getCell('B4').value = 1200;
  ws2.getCell('C4').value = 480000;
  // Intentional division by zero error
  ws2.getCell('D4').value = { formula: '=C4/(B4-1200)', result: { error: '#DIV/0!' } as any };

  ws2.getCell('A5').value = 'Europe';
  ws2.getCell('B5').value = 850;
  ws2.getCell('C5').value = 340000;
  ws2.getCell('D5').value = { formula: '=C5/B5', result: 400 };

  // -------------------------------------------------------------
  // Sheet 3: Hidden_Calculations (Hidden)
  // -------------------------------------------------------------
  const ws3 = wb.addWorksheet('Hidden_Calculations');
  ws3.state = 'hidden';
  ws3.getCell('A1').value = 'Internal Discount Matrices & Tax Deductions';
  ws3.getCell('A2').value = 0.18;
  ws3.getCell('B2').value = { formula: "='Executive_Summary'!B7 * A2", result: 140400 };

  // -------------------------------------------------------------
  // Sheet 4: Confidential_Salaries (Very Hidden)
  // -------------------------------------------------------------
  const ws4 = wb.addWorksheet('Confidential_Salaries');
  ws4.state = 'veryHidden';
  ws4.getCell('A1').value = 'CONFIDENTIAL EXECUTIVE COMPENSATION';
  ws4.getCell('A1').font = { bold: true, color: { argb: 'FFFF0000' } };
  ws4.getCell('A2').value = 'CEO Base Salary';
  ws4.getCell('B2').value = 450000;
  ws4.getCell('A3').value = 'CTO Base Salary';
  ws4.getCell('B3').value = 380000;
  ws4.getCell('A4').value = 'CFO Base Salary';
  ws4.getCell('B4').value = 350000;

  // Generate buffer from ExcelJS
  const rawBuffer = await wb.xlsx.writeBuffer();

  // Post-process via JSZip to ensure 'Confidential_Salaries' has state="veryHidden"
  const zip = await JSZip.loadAsync(rawBuffer);
  const wbXmlPath = 'xl/workbook.xml';
  let wbXml = await zip.file(wbXmlPath)?.async('text');

  if (wbXml) {
    if (wbXml.includes('state="')) {
      wbXml = wbXml.replace(
        /(<sheet\b[^>]*name="Confidential_Salaries"[^>]*?)state="[^"]*"/i,
        '$1state="veryHidden"'
      );
    } else {
      wbXml = wbXml.replace(
        /(<sheet\b[^>]*name="Confidential_Salaries")/i,
        '$1 state="veryHidden"'
      );
    }
    zip.file(wbXmlPath, wbXml);
  }

  const finalBuffer = await zip.generateAsync({ type: 'arraybuffer' });
  return {
    buffer: finalBuffer,
    fileName: 'Demo_Enterprise_Financial_Model.xlsx',
  };
}
