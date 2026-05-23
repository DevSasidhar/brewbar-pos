/**
 * excelGenerator.js
 * Generates Excel workbooks with multiple sheets for sales reports.
 * Uses XLSX library for Excel file creation.
 */

import * as XLSX from 'xlsx'
import {
  prepareRawSalesSheet,
  prepareSummarySheet,
  prepareCategorySummarySheet,
  prepareItemSummarySheet,
} from './reportTransform'

/**
 * Create and generate Excel workbook from sales data.
 * Returns the workbook object (not directly downloaded).
 *
 * @param {Array} rawData - flattened sales records
 * @param {string} reportName - name for the workbook (e.g., "Daily Report")
 * @returns {Object} XLSX workbook object
 */
export function generateReportWorkbook(rawData, reportName = 'Sales Report') {
  // Prepare all sheet data
  const rawSalesData = prepareRawSalesSheet(rawData)
  const summaryData = prepareSummarySheet(rawData)
  const categorySummaryData = prepareCategorySummarySheet(rawData)
  const itemSummaryData = prepareItemSummarySheet(rawData)

  // Create worksheet objects
  const wsRawSales = XLSX.utils.json_to_sheet(rawSalesData)
  const wsSummary = XLSX.utils.json_to_sheet(summaryData)
  const wsCategorySummary = XLSX.utils.json_to_sheet(categorySummaryData)
  const wsItemSummary = XLSX.utils.json_to_sheet(itemSummaryData)

  // Apply column widths for better readability
  applyColumnWidths(wsRawSales, rawSalesData)
  applyColumnWidths(wsSummary, summaryData)
  applyColumnWidths(wsCategorySummary, categorySummaryData)
  applyColumnWidths(wsItemSummary, itemSummaryData)

  // Apply formatting
  applyFormatting(wsRawSales, rawSalesData)
  applyFormatting(wsSummary, summaryData)
  applyFormatting(wsCategorySummary, categorySummaryData)
  applyFormatting(wsItemSummary, itemSummaryData)

  // Create workbook with multiple sheets
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, wsRawSales, 'Raw Sales Data')
  XLSX.utils.book_append_sheet(workbook, wsSummary, 'Summary')
  XLSX.utils.book_append_sheet(workbook, wsCategorySummary, 'Category Summary')
  XLSX.utils.book_append_sheet(workbook, wsItemSummary, 'Item Summary')

  // Set workbook properties
  workbook.Props = {
    Title: reportName,
    Author: 'Brewbar Cafe POS',
    CreatedDate: new Date(),
  }

  return workbook
}

/**
 * Apply column widths to worksheet for better readability.
 * Dynamically calculates width based on content.
 *
 * @param {Object} worksheet - XLSX worksheet object
 * @param {Array} data - array of row objects
 */
function applyColumnWidths(worksheet, data) {
  if (!data || data.length === 0) return

  const colWidths = {}

  // Get column headers from first row
  const headers = Object.keys(data[0])

  headers.forEach((header) => {
    // Start with header length
    let maxLength = header.length

    // Check all rows for this column
    data.forEach((row) => {
      const cellValue = String(row[header] || '')
      maxLength = Math.max(maxLength, cellValue.length)
    })

    // Set width with some padding
    colWidths[header] = { wch: Math.min(maxLength + 2, 50) } // cap at 50 chars
  })

  // Apply to worksheet
  const colArray = Object.keys(colWidths).map((col) => colWidths[col])
  worksheet['!cols'] = colArray
}

/**
 * Apply cell formatting (bold headers, number formatting, etc.).
 * XLSX library has limited formatting, so we focus on column widths
 * and data type handling.
 *
 * @param {Object} worksheet
 * @param {Array} data
 */
function applyFormatting(worksheet, data) {
  // Basic formatting: ensure numeric columns are treated as numbers
  // This is handled by XLSX automatically when using json_to_sheet

  // Note: For advanced formatting (colors, borders, etc.),
  // would need to use xlsx-style or similar plugin
  // For now, keep format simple and Excel-friendly
}

/**
 * Export workbook to Excel file and trigger download.
 * Wraps the XLSX write_file function.
 *
 * @param {Object} workbook - XLSX workbook object
 * @param {string} filename - filename for download (e.g., "sales-report.xlsx")
 */
export function downloadWorkbook(workbook, filename) {
  XLSX.writeFile(workbook, filename)
}

/**
 * Convenience function: generate and download report in one call.
 *
 * @param {Array} rawData - sales data from reportService
 * @param {string} reportName - display name for the report
 * @param {string} filename - filename for Excel file
 */
export function generateAndDownloadReport(rawData, reportName, filename) {
  const workbook = generateReportWorkbook(rawData, reportName)
  downloadWorkbook(workbook, filename)
}
