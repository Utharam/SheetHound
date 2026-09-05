import { generateDemoWorkbook } from '../utils/demoWorkbook';
import { auditExcelWorkbook } from '../parser/excelAuditor';

async function runVerification() {
  console.log('🚀 Starting Excel Auditor Verification Test...');

  // 1. Generate demo workbook
  console.log('Generating demo workbook...');
  const { buffer, fileName } = await generateDemoWorkbook();
  console.log(`✓ Demo workbook generated: ${fileName} (${buffer.byteLength} bytes)`);

  // 2. Audit workbook
  console.log('Auditing workbook...');
  const report = await auditExcelWorkbook(buffer, fileName);

  console.log('\n--- Audit Results Summary ---');
  console.log(`Total Sheets: ${report.totalSheets}`);
  console.log(`  Visible: ${report.visibleSheetsCount}`);
  console.log(`  Hidden: ${report.hiddenSheetsCount}`);
  console.log(`  Very Hidden: ${report.veryHiddenSheetsCount}`);
  console.log(`Total Formulas: ${report.totalFormulas}`);
  console.log(`Total Errors: ${report.totalErrors}`);
  console.log(`Total External Links: ${report.totalExternalLinks}`);
  console.log(`Stray Data Alerts: ${report.strayDataWarningCount}`);
  console.log(`Unique Fonts: ${report.uniqueFontsCount}`);
  console.log(`Unique Colors: ${report.uniqueColorsCount}`);

  // 3. Assertions
  let passed = true;

  // Check 1: Very Hidden Sheet detected
  if (report.veryHiddenSheetsCount === 1) {
    console.log('✅ Check 1 Passed: xlSheetVeryHidden sheet detected correctly.');
  } else {
    console.error(`❌ Check 1 Failed: Expected 1 veryHidden sheet, found ${report.veryHiddenSheetsCount}`);
    passed = false;
  }

  // Check 2: Hidden Sheet detected
  if (report.hiddenSheetsCount === 1) {
    console.log('✅ Check 2 Passed: Hidden sheet detected correctly.');
  } else {
    console.error(`❌ Check 2 Failed: Expected 1 hidden sheet, found ${report.hiddenSheetsCount}`);
    passed = false;
  }

  // Check 3: External link detected with [2024_Master_Budget.xlsx]
  const hasTargetBudget = report.externalLinksRegistry.some((l) =>
    l.targetWorkbook.includes('2024_Master_Budget.xlsx')
  );
  if (hasTargetBudget) {
    console.log('✅ Check 3 Passed: External reference to 2024_Master_Budget.xlsx detected.');
  } else {
    console.error('❌ Check 3 Failed: External reference not detected in externalLinksRegistry.');
    passed = false;
  }

  // Check 4: #REF! and #DIV/0! errors detected
  const hasRef = report.errorsRegistry.some((e) => e.errorType === '#REF!');
  const hasDiv0 = report.errorsRegistry.some((e) => e.errorType === '#DIV/0!');
  if (hasRef && hasDiv0) {
    console.log('✅ Check 4 Passed: Formula errors #REF! and #DIV/0! detected.');
  } else {
    console.error(`❌ Check 4 Failed: #REF! found: ${hasRef}, #DIV/0! found: ${hasDiv0}`);
    passed = false;
  }

  // Check 5: Stray data detected at W180
  const execSheet = report.sheets.find((s) => s.name === 'Executive_Summary');
  if (execSheet && execSheet.boundary.farthestCell === 'W180') {
    console.log('✅ Check 5 Passed: Farthest cell correctly identified at W180.');
  } else {
    console.error(
      `❌ Check 5 Failed: Expected farthest cell W180, got ${execSheet?.boundary.farthestCell}`
    );
    passed = false;
  }

  // Check 6: Cross-sheet references identified
  const crossSheetFormulas = report.formulaDirectory.filter((f) => f.isCrossSheet);
  if (crossSheetFormulas.length > 0) {
    console.log(`✅ Check 6 Passed: Found ${crossSheetFormulas.length} cross-sheet formulas.`);
  } else {
    console.error('❌ Check 6 Failed: No cross-sheet formulas identified.');
    passed = false;
  }

  // Check 7: Heatmap computed for each sheet
  const allSheetsHaveHeatmap = report.sheets.every(
    (s) => s.heatmap && s.heatmap.gridRows > 0 && s.heatmap.gridCols > 0
  );
  if (allSheetsHaveHeatmap) {
    console.log(`✅ Check 7 Passed: Spatial heatmaps computed for all ${report.sheets.length} sheets.`);
  } else {
    console.error('❌ Check 7 Failed: Some sheets are missing heatmap data.');
    passed = false;
  }

  // Check 8: Stray outlier cell detected in heatmap matrix
  const straySheet = report.sheets.find((s) => s.boundary.hasStrayCells);
  const foundStrayInHeatmap = straySheet?.heatmap?.matrix.some((row) =>
    row.some((b) => b.hasStray && b.strayCellAddress === 'W180')
  );
  if (foundStrayInHeatmap) {
    console.log('✅ Check 8 Passed: Stray outlier W180 correctly pinned in spatial heatmap radar.');
  } else {
    console.error('❌ Check 8 Failed: Outlier block with W180 not found in heatmap matrix.');
    passed = false;
  }

  // Check 9: Main cluster density bounds computed
  if (straySheet?.heatmap?.mainClusterBounds && straySheet.heatmap.mainClusterBounds.percentageOfData > 70) {
    console.log(
      `✅ Check 9 Passed: Primary cluster identified with ${straySheet.heatmap.mainClusterBounds.percentageOfData}% of data in ${straySheet.heatmap.mainClusterBounds.colStartLetter}${straySheet.heatmap.mainClusterBounds.rowStart}..${straySheet.heatmap.mainClusterBounds.colEndLetter}${straySheet.heatmap.mainClusterBounds.rowEnd}.`
    );
  } else {
    console.error('❌ Check 9 Failed: Main cluster bounds not computed properly.');
    passed = false;
  }

  if (passed) {
    console.log('\n🎉 ALL 9 VERIFICATION CHECKS PASSED!\n');
    process.exit(0);
  } else {
    console.error('\n❌ SOME CHECKS FAILED!\n');
    process.exit(1);
  }
}

runVerification().catch((err) => {
  console.error('Verification encountered an unhandled exception:', err);
  process.exit(1);
});
