/**
 * analyticsTransform.js
 * Converts raw analytics rows into chart-friendly structures.
 */

function groupBy(array, keyFn) {
  return array.reduce((acc, item) => {
    const key = keyFn(item)
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(item)
    return acc
  }, {})
}

function getISOWeekNumber(date) {
  const tempDate = new Date(date)
  tempDate.setHours(0, 0, 0, 0)
  tempDate.setDate(tempDate.getDate() + 4 - (tempDate.getDay() || 7))
  const yearStart = new Date(tempDate.getFullYear(), 0, 1)
  return Math.ceil(((tempDate - yearStart) / 86400000 + 1) / 7)
}

function formatLocalDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function normalizeDate(dateString) {
  const date = new Date(dateString)
  return {
    date: formatLocalDate(date),
    time: date.toTimeString().slice(0, 5),
    dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
    hourBucket: `${date.getHours()}-${date.getHours() + 1}`,
    weekNumber: getISOWeekNumber(date),
    month: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
  }
}

function normalizeRow(row) {
  const normalized = normalizeDate(row.created_at)
  return {
    ...row,
    date: normalized.date,
    time: normalized.time,
    day_name: normalized.dayName,
    hour_bucket: normalized.hourBucket,
    week_number: normalized.weekNumber,
    month: normalized.month,
    payment_mode: String(row.payment_mode || '').toLowerCase(),
    revenue: row.subtotal,
  }
}

export function calculateDashboardSummary(rows) {
  const normalized = rows.map(normalizeRow)
  const totalRevenue = normalized.reduce((sum, row) => sum + row.revenue, 0)
  const totalOrders = new Set(normalized.map((row) => row.order_id)).size
  const itemsSold = normalized.reduce((sum, row) => sum + row.quantity, 0)
  const averageOrderValue = totalOrders ? totalRevenue / totalOrders : 0

  const paymentTotals = normalized.reduce(
    (acc, row) => {
      if (row.payment_mode === 'cash') acc.cash += row.revenue
      else if (row.payment_mode === 'upi') acc.upi += row.revenue
      return acc
    },
    { cash: 0, upi: 0 },
  )

  const cashSplit = paymentTotals.cash + paymentTotals.upi ? (paymentTotals.cash / (paymentTotals.cash + paymentTotals.upi)) * 100 : 0
  const upiSplit = paymentTotals.cash + paymentTotals.upi ? (paymentTotals.upi / (paymentTotals.cash + paymentTotals.upi)) * 100 : 0

  return {
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalOrders,
    itemsSold,
    averageOrderValue: Math.round(averageOrderValue * 100) / 100,
    paymentSplit: {
      cash: Math.round(paymentTotals.cash * 100) / 100,
      upi: Math.round(paymentTotals.upi * 100) / 100,
      cashPercent: Math.round(cashSplit),
      upiPercent: Math.round(upiSplit),
    },
  }
}

export function buildRevenueTrend(rows) {
  const normalized = rows.map(normalizeRow)
  const buckets = Array.from({ length: 24 }, (_, index) => ({
    bucket: `${index}-${index + 1}`,
    revenue: 0,
  }))

  normalized.forEach((row) => {
    const hour = Number(row.hour_bucket.split('-')[0])
    if (!Number.isNaN(hour) && buckets[hour]) {
      buckets[hour].revenue += row.revenue
    }
  })

  return {
    categories: buckets.map((bucket) => bucket.bucket),
    series: [
      {
        name: 'Revenue',
        data: buckets.map((bucket) => Math.round(bucket.revenue * 100) / 100),
      },
    ],
  }
}

export function buildCategoryDistribution(rows) {
  const normalized = rows.map(normalizeRow)
  const grouped = groupBy(normalized, (row) => row.category_name || 'Unknown')

  const data = Object.entries(grouped).map(([category, items]) => ({
    name: category,
    y: Math.round(items.reduce((sum, row) => sum + row.revenue, 0) * 100) / 100,
  }))

  return {
    series: [
      {
        name: 'Revenue',
        colorByPoint: true,
        data: data.sort((a, b) => b.y - a.y),
      },
    ],
  }
}

export function buildTopSellingItems(rows, { limit = 10, sortBy = 'quantity' } = {}) {
  const normalized = rows.map(normalizeRow)
  const grouped = Object.values(
    groupBy(normalized, (row) => row.item_name || 'Unknown'),
  ).map((items) => ({
    item_name: items[0].item_name || 'Unknown',
    quantity: items.reduce((sum, row) => sum + row.quantity, 0),
    revenue: items.reduce((sum, row) => sum + row.revenue, 0),
  }))

  const sorted = grouped.sort((a, b) => b[sortBy] - a[sortBy]).slice(0, limit)

  return {
    categories: sorted.map((item) => item.item_name),
    series: [
      {
        name: sortBy === 'revenue' ? 'Revenue' : 'Quantity',
        data: sorted.map((item) => Math.round(item[sortBy] * 100) / 100),
      },
    ],
  }
}

export function buildPaymentSplit(rows) {
  const normalized = rows.map(normalizeRow)
  const grouped = groupBy(normalized, (row) => row.payment_mode || 'Unknown')

  const seriesData = Object.entries(grouped).map(([paymentMode, items]) => ({
    name: paymentMode.toUpperCase(),
    y: Math.round(items.reduce((sum, row) => sum + row.revenue, 0) * 100) / 100,
  }))

  return {
    series: [
      {
        name: 'Payment Split',
        colorByPoint: true,
        data: seriesData.sort((a, b) => b.y - a.y),
      },
    ],
  }
}

export function buildWorkerPerformance(rows) {
  const normalized = rows.map(normalizeRow)
  const workerGroups = groupBy(normalized, (row) => row.worker_name || 'Unknown')

  const performance = Object.entries(workerGroups).map(([workerName, items]) => {
    const revenue = items.reduce((sum, row) => sum + row.revenue, 0)
    const orders = new Set(items.map((row) => row.order_id)).size
    return {
      workerName,
      revenue: Math.round(revenue * 100) / 100,
      orders,
    }
  })

  const sorted = performance.sort((a, b) => b.revenue - a.revenue)

  return {
    categories: sorted.map((item) => item.workerName),
    revenueSeries: sorted.map((item) => item.revenue),
    ordersSeries: sorted.map((item) => item.orders),
  }
}
