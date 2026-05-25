/**
 * downloadHelper.js
 * Utility functions for file downloads and format conversions.
 */

export function formatLocalDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

/**
 * Generate a filename with optional date.
 * Format: reportType-YYYY-MM-DD.xlsx
 *
 * @param {string} reportType - 'daily', 'weekly', or 'monthly'
 * @param {Date} date - reference date for the report
 * @returns {string} formatted filename
 */
export function generateFilename(reportType, date) {
  const dateStr = formatLocalDate(date)
  const reportLabel = reportType.charAt(0).toUpperCase() + reportType.slice(1)
  return `${reportLabel}-Report-${dateStr}.xlsx`
}

/**
 * Generate a report name/title based on type and date.
 * Format: "Daily Report - 2024-05-23" or "Weekly Report - Week of 2024-05-20"
 *
 * @param {string} reportType - 'daily', 'weekly', or 'monthly'
 * @param {Date} date - reference date
 * @returns {string} report title
 */
export function generateReportTitle(reportType, date) {
  const dateStr = formatLocalDate(date)
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })

  switch (reportType) {
    case 'daily':
      return `Daily Report - ${dayName}, ${dateStr}`

    case 'weekly': {
      const dayOfWeek = date.getDay()
      const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - daysFromMonday)
      const weekStartStr = formatLocalDate(weekStart)
      return `Weekly Report - Week of ${weekStartStr}`
    }

    case 'monthly': {
      const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      return `Monthly Report - ${monthName}`
    }

    default:
      return `Sales Report - ${dateStr}`
  }
}

/**
 * Convert a date to YYYY-MM-DD using the browser's local timezone.
 * @param {Date} date
 * @returns {string}
 */
export function toISODateString(date) {
  return formatLocalDate(date)
}

/**
 * Get the start and end dates for a report period.
 *
 * @param {string} reportType - 'daily', 'weekly', or 'monthly'
 * @param {Date} date - reference date within the period
 * @returns {Object} { startDate, endDate }
 */
export function getReportPeriod(reportType, date) {
  switch (reportType) {
    case 'daily': {
      const startDate = new Date(date)
      startDate.setHours(0, 0, 0, 0)
      const endDate = new Date(date)
      endDate.setHours(23, 59, 59, 999)
      return { startDate, endDate }
    }

    case 'weekly': {
      const dayOfWeek = date.getDay()
      const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
      const startDate = new Date(date)
      startDate.setDate(date.getDate() - daysFromMonday)
      startDate.setHours(0, 0, 0, 0)
      const endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 6)
      endDate.setHours(23, 59, 59, 999)
      return { startDate, endDate }
    }

    case 'monthly': {
      const startDate = new Date(date.getFullYear(), date.getMonth(), 1)
      startDate.setHours(0, 0, 0, 0)
      const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      endDate.setHours(23, 59, 59, 999)
      return { startDate, endDate }
    }

    default:
      return { startDate: date, endDate: date }
  }
}

/**
 * Format currency for display.
 * @param {number} amount
 * @returns {string} formatted as ₹X.XX
 */
export function formatCurrency(amount) {
  return `₹${(Math.round(amount * 100) / 100).toFixed(2)}`
}

/**
 * Parse currency string back to number.
 * @param {string} str - e.g., "₹123.45"
 * @returns {number}
 */
export function parseCurrency(str) {
  return Number(String(str).replace(/[₹,\s]/g, ''))
}
