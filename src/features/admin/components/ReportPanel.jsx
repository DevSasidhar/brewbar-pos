// ReportPanel.jsx
// Admin interface for generating and exporting sales reports.
import { useState } from 'react'
import { Download, Calendar } from 'lucide-react'
import { getDailySalesData, getWeeklySalesData, getMonthlySalesData } from '../../../services/reportService'
import { generateAndDownloadReport } from '../utils/excelGenerator'
import { formatLocalDate, generateFilename, generateReportTitle } from '../utils/downloadHelper'

export function ReportPanel() {
  const [reportType, setReportType] = useState('daily')
  const [selectedDate, setSelectedDate] = useState(() => formatLocalDate(new Date()))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleExportReport = async () => {
    if (!selectedDate) {
      setError('Please select a date.')
      return
    }

    try {
      setLoading(true)
      setError('')
      setSuccessMessage('')

      const date = new Date(selectedDate + 'T00:00:00')

      // Fetch data based on report type
      let salesData
      switch (reportType) {
        case 'daily':
          salesData = await getDailySalesData(date)
          break
        case 'weekly':
          salesData = await getWeeklySalesData(date)
          break
        case 'monthly':
          salesData = await getMonthlySalesData(date.getFullYear(), date.getMonth() + 1)
          break
        default:
          salesData = await getDailySalesData(date)
      }

      if (!salesData || salesData.length === 0) {
        setError('No sales data found for the selected period.')
        setLoading(false)
        return
      }

      // Generate and download Excel file
      const reportTitle = generateReportTitle(reportType, date)
      const filename = generateFilename(reportType, date)
      generateAndDownloadReport(salesData, reportTitle, filename)

      setSuccessMessage(`✓ ${reportTitle} exported successfully!`)
      setLoading(false)
    } catch (err) {
      console.error('Error generating report:', err)
      setError('Unable to generate report. Please try again.')
      setLoading(false)
    }
  }

  return (
    <section className="grid gap-4">
      <div className="rounded-md border border-brew-line bg-white px-5 py-4">
        <h2 className="text-xl font-black">Sales Reports & Excel Export</h2>
        <p className="mt-2 text-sm text-brew-muted">
          Generate and download sales reports in Excel format with multiple views.
        </p>

        {/* Error message */}
        {error && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Success message */}
        {successMessage && (
          <div className="mt-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        {/* Report type selection */}
        <div className="mt-4 grid gap-3">
          <label className="text-sm font-bold text-brew-muted">Report Type</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'daily', label: 'Daily' },
              { value: 'weekly', label: 'Weekly' },
              { value: 'monthly', label: 'Monthly' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setReportType(option.value)}
                className={`rounded-md px-4 py-3 text-base font-bold transition-colors ${
                  reportType === option.value
                    ? 'bg-brew-coffee text-white'
                    : 'border border-brew-line bg-white text-brew-ink hover:border-brew-coffee'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date selection */}
        <div className="mt-4 grid gap-3">
          <label className="text-sm font-bold text-brew-muted">
            {reportType === 'daily' && 'Select Date'}
            {reportType === 'weekly' && 'Select Date (any day within the week)'}
            {reportType === 'monthly' && 'Select Date (any day within the month)'}
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Calendar className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brew-muted" size={20} />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full rounded-md border border-brew-line bg-slate-50 px-4 py-3 pl-10 text-base text-brew-ink outline-none focus:border-brew-coffee"
              />
            </div>
          </div>
        </div>

        {/* Export button */}
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={handleExportReport}
            disabled={loading}
            className="flex items-center gap-2 rounded-md bg-brew-coffee px-4 py-3 text-base font-black text-white disabled:bg-slate-300"
          >
            <Download size={20} aria-hidden="true" />
            {loading ? 'Generating...' : 'Export to Excel'}
          </button>
        </div>
      </div>

      {/* Information panel */}
      <div className="rounded-md border border-amber-200 bg-amber-50 px-5 py-4">
        <h3 className="text-sm font-bold text-amber-900">What's Included in the Export?</h3>
        <ul className="mt-3 space-y-2 text-sm text-amber-800">
          <li>
            <strong>Raw Sales Data:</strong> One row per item sold with detailed transaction info
          </li>
          <li>
            <strong>Summary Sheet:</strong> Total revenue, orders, and payment mode breakdown
          </li>
          <li>
            <strong>Category Summary:</strong> Sales by category (quantity and revenue)
          </li>
          <li>
            <strong>Item Summary:</strong> Sales by menu item (quantity and revenue)
          </li>
          <li className="mt-3">
            <em>✓ Pivot-table ready format • ✓ Multiple analysis angles • ✓ Excel formulas compatible</em>
          </li>
        </ul>
      </div>
    </section>
  )
}
