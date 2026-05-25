import { useCallback, useEffect, useState } from 'react'
import { getAnalyticsOverview } from '../services/analyticsService'

const initialPayload = {
  summary: {
    totalRevenue: 0,
    totalOrders: 0,
    itemsSold: 0,
    averageOrderValue: 0,
    paymentSplit: {
      cash: 0,
      upi: 0,
      cashPercent: 0,
      upiPercent: 0,
    },
  },
  revenueTrend: { categories: [], series: [] },
  categoryDistribution: { series: [] },
  topSellingItems: { categories: [], series: [] },
  paymentSplit: { series: [] },
  workerPerformance: { categories: [], revenueSeries: [], ordersSeries: [] },
}

export function useAnalyticsData({ startDate, endDate, itemLimit = 10, itemSortBy = 'quantity' }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState(initialPayload)

  const loadAnalytics = useCallback(async () => {
    if (!startDate || !endDate) {
      setError('A valid date range is required.')
      return
    }

    try {
      setLoading(true)
      setError('')
      const result = await getAnalyticsOverview({
        startDate: new Date(`${startDate}T00:00:00`),
        endDate: new Date(`${endDate}T23:59:59`),
        itemLimit,
        itemSortBy,
      })
      setData(result)
    } catch (err) {
      console.error('Analytics load failed:', err)
      setError('Unable to load analytics data.')
    } finally {
      setLoading(false)
    }
  }, [startDate, endDate, itemLimit, itemSortBy])

  useEffect(() => {
    loadAnalytics()
  }, [loadAnalytics])

  return {
    ...data,
    loading,
    error,
    refresh: loadAnalytics,
  }
}
