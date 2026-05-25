import { formatCurrency, parseCurrency } from './downloadHelper.js'

/**
 * reportTransform.js
 * Transforms flattened sales data and adds computed columns.
 * Prepares data for Excel export and analysis.
 */

function normalizePaymentMode(value) {
  return String(value || '').trim().toUpperCase()
}

function getLocalDateString(timestamp) {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

/**
 * Add computed columns to raw sales data.
 * - Date: extracted from created_at (YYYY-MM-DD)
 * - Time: extracted from created_at (HH:MM)
 * - Day Name: Monday, Tuesday, etc.
 * - Hour Bucket: 8-9, 9-10, etc. for hourly analysis
 * - Week Number: ISO week number for weekly analysis
 * - Month: Month name for monthly analysis
 *
 * @param {Array} rawData - flattened sales records from reportService
 * @returns {Array} enriched data with computed columns
 */
export function enrichSalesData(rawData) {
  return rawData.map((row) => {
    const timestamp = new Date(row.created_at)

    const date = getLocalDateString(row.created_at)
    const time = timestamp.toTimeString().slice(0, 5)
    const dayName = timestamp.toLocaleDateString('en-US', { weekday: 'long' })
    const hour = timestamp.getHours()
    const hourBucket = `${hour}-${hour + 1}`
    const weekNumber = getISOWeekNumber(timestamp)
    const month = timestamp.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

    const unitPrice = row.item_price ?? row.unit_price ?? 0
    const quantity = row.quantity ?? 0
    const subtotal = row.subtotal ?? quantity * unitPrice

    return {
      ...row,
      date,
      time,
      day_name: dayName,
      hour_bucket: hourBucket,
      week_number: weekNumber,
      month,
      item_price: unitPrice,
      quantity,
      subtotal,
    }
  })
}

/**
 * Calculate ISO week number (Monday = start of week).
 * @param {Date} date
 * @returns {number}
 */
function getISOWeekNumber(date) {
  const tempDate = new Date(date)
  tempDate.setHours(0, 0, 0, 0)
  tempDate.setDate(tempDate.getDate() + 4 - (tempDate.getDay() || 7))
  const yearStart = new Date(tempDate.getFullYear(), 0, 1)
  const weekNumber = Math.ceil(((tempDate - yearStart) / 86400000 + 1) / 7)
  return weekNumber
}

/**
 * Transform raw sales data into Excel-friendly structure.
 * One row per sold item with all required columns.
 *
 * @param {Array} rawData - from reportService
 * @returns {Array} array of objects ready for XLSX
 */
export function prepareRawSalesSheet(rawData) {
  const enriched = enrichSalesData(rawData)

  const rows = enriched.map((row) => ({
    'Order ID': row.order_id,
    Timestamp: row.created_at,
    Date: row.date,
    Time: row.time,
    'Day Name': row.day_name,
    'Worker Name': row.worker_name,
    Category: row.category_name,
    'Item Name': row.item_name,
    Quantity: row.quantity,
    'Unit Price': row.item_price,
    Subtotal: row.subtotal,
    'Payment Mode': row.payment_mode,
    'Hour Bucket': row.hour_bucket,
    'Week Number': row.week_number,
    Month: row.month,
  }))

  if (rows.length === 0) {
    return rows
  }

  const totalSubtotal = enriched.reduce((sum, row) => sum + row.subtotal, 0)

  return [
    ...rows,
    {
      'Order ID': 'Grand Total',
      Timestamp: '',
      Date: '',
      Time: '',
      'Day Name': '',
      'Worker Name': '',
      Category: '',
      'Item Name': '',
      Quantity: '',
      'Unit Price': '',
      Subtotal: totalSubtotal,
      'Payment Mode': '',
      'Hour Bucket': '',
      'Week Number': '',
      Month: '',
    },
  ]
}

/**
 * Calculate summary statistics from raw sales data.
 * Returns object with totals and key metrics.
 *
 * @param {Array} rawData
 * @returns {Object} summary stats
 */
export function calculateSummaryStats(rawData) {
  const enriched = enrichSalesData(rawData)

  const totalRevenue = enriched.reduce((sum, row) => sum + row.subtotal, 0)
  const totalQuantity = enriched.reduce((sum, row) => sum + row.quantity, 0)
  const uniqueOrders = new Set(enriched.map((row) => row.order_id)).size

  const cashRevenue = enriched
    .filter((row) => normalizePaymentMode(row.payment_mode) === 'CASH')
    .reduce((sum, row) => sum + row.subtotal, 0)

  const upiRevenue = enriched
    .filter((row) => normalizePaymentMode(row.payment_mode) === 'UPI')
    .reduce((sum, row) => sum + row.subtotal, 0)

  const itemSales = {}
  enriched.forEach((row) => {
    const key = row.item_name || 'Unknown'
    if (!itemSales[key]) {
      itemSales[key] = { quantity: 0, revenue: 0 }
    }
    itemSales[key].quantity += row.quantity
    itemSales[key].revenue += row.subtotal
  })

  const bestItem = Object.entries(itemSales).reduce((best, [name, stats]) => {
    if (!best || stats.revenue > best.revenue) {
      return { name, ...stats }
    }
    return best
  }, null)

  return {
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalQuantity,
    totalOrders: uniqueOrders,
    cashRevenue: Math.round(cashRevenue * 100) / 100,
    upiRevenue: Math.round(upiRevenue * 100) / 100,
    bestSellingItem: bestItem?.name || 'N/A',
    bestItemQuantity: bestItem?.quantity || 0,
    bestItemRevenue: bestItem?.revenue ? Math.round(bestItem.revenue * 100) / 100 : 0,
    averageOrderValue: uniqueOrders ? Math.round((totalRevenue / uniqueOrders) * 100) / 100 : 0,
  }
}

/**
 * Prepare summary sheet data for Excel.
 * @param {Array} rawData
 * @returns {Array} array of summary rows
 */
export function prepareSummarySheet(rawData) {
  const stats = calculateSummaryStats(rawData)

  return [
    { Metric: 'Total Revenue', Value: formatCurrency(stats.totalRevenue) },
    { Metric: 'Total Orders', Value: stats.totalOrders },
    { Metric: 'Total Items Sold', Value: stats.totalQuantity },
    { Metric: 'Cash Revenue', Value: formatCurrency(stats.cashRevenue) },
    { Metric: 'UPI Revenue', Value: formatCurrency(stats.upiRevenue) },
    { Metric: 'Average Order Value', Value: formatCurrency(stats.averageOrderValue) },
    { Metric: 'Best Selling Item', Value: stats.bestSellingItem },
    { Metric: 'Best Item Quantity', Value: stats.bestItemQuantity },
    { Metric: 'Best Item Revenue', Value: formatCurrency(stats.bestItemRevenue) },
  ]
}

/**
 * Prepare category summary sheet.
 * @param {Array} rawData
 * @returns {Array} category summary rows
 */
export function prepareCategorySummarySheet(rawData) {
  const enriched = enrichSalesData(rawData)

  const categoryStats = {}

  enriched.forEach((row) => {
    const category = row.category_name || 'Unknown'
    if (!categoryStats[category]) {
      categoryStats[category] = {
        quantity: 0,
        revenue: 0,
      }
    }
    categoryStats[category].quantity += row.quantity
    categoryStats[category].revenue += row.subtotal
  })

  return Object.entries(categoryStats)
    .map(([category, stats]) => ({
      Category: category,
      'Quantity Sold': stats.quantity,
      Revenue: formatCurrency(stats.revenue),
    }))
    .sort((a, b) => {
      const revA = parseCurrency(a.Revenue)
      const revB = parseCurrency(b.Revenue)
      return revB - revA
    })
}

/**
 * Prepare item summary sheet.
 * @param {Array} rawData
 * @returns {Array} item summary rows
 */
export function prepareItemSummarySheet(rawData) {
  const enriched = enrichSalesData(rawData)

  const itemStats = {}

  enriched.forEach((row) => {
    const key = `${row.item_name || 'Unknown'} (${row.category_name || 'Unknown'})`
    if (!itemStats[key]) {
      itemStats[key] = {
        quantity: 0,
        revenue: 0,
      }
    }
    itemStats[key].quantity += row.quantity
    itemStats[key].revenue += row.subtotal
  })

  return Object.entries(itemStats)
    .map(([item, stats]) => ({
      Item: item,
      'Quantity Sold': stats.quantity,
      Revenue: formatCurrency(stats.revenue),
    }))
    .sort((a, b) => {
      const revA = parseCurrency(a.Revenue)
      const revB = parseCurrency(b.Revenue)
      return revB - revA
    })
}
