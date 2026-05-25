import { useState } from 'react'
import { useAnalyticsFilters } from '../hooks/useAnalyticsFilters'
import { useAnalyticsData } from '../hooks/useAnalyticsData'
import { AnalyticsFilterBar } from './AnalyticsFilterBar'
import { AnalyticsSummaryCards } from './AnalyticsSummaryCards'
import { RevenueTrendChart } from './RevenueTrendChart'
import { CategoryDistributionChart } from './CategoryDistributionChart'
import { TopItemsChart } from './TopItemsChart'
import { PaymentSplitChart } from './PaymentSplitChart'
import { WorkerPerformanceChart } from './WorkerPerformanceChart'

export function AnalyticsDashboard() {
  const { startDate, endDate } = useAnalyticsFilters()
  const [itemSortBy, setItemSortBy] = useState('quantity')
  const { loading, error, refresh, summary, revenueTrend, categoryDistribution, topSellingItems, paymentSplit, workerPerformance } = useAnalyticsData({
    startDate,
    endDate,
    itemSortBy,
  })

  return (
    <div className="grid gap-4">
      <AnalyticsFilterBar onRefresh={refresh} loading={loading} />

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {!loading && !error ? (
        <>
          <AnalyticsSummaryCards summary={summary} />

          <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
            <RevenueTrendChart data={revenueTrend} />
            <CategoryDistributionChart data={categoryDistribution} />
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.1fr_1.4fr]">
            <PaymentSplitChart data={paymentSplit} />
            <WorkerPerformanceChart data={workerPerformance} />
          </div>

          <div className="rounded-md border border-brew-line bg-white px-4 py-3 sm:px-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-black text-brew-ink">Top Selling Items</h2>
                <p className="text-sm text-brew-muted">Sort the list by quantity or revenue.</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setItemSortBy('quantity')}
                  className={`rounded-md px-3 py-2 text-sm font-bold ${itemSortBy === 'quantity' ? 'bg-brew-coffee text-white' : 'border border-brew-line bg-white text-brew-ink'}`}
                >
                  Quantity
                </button>
                <button
                  type="button"
                  onClick={() => setItemSortBy('revenue')}
                  className={`rounded-md px-3 py-2 text-sm font-bold ${itemSortBy === 'revenue' ? 'bg-brew-coffee text-white' : 'border border-brew-line bg-white text-brew-ink'}`}
                >
                  Revenue
                </button>
              </div>
            </div>
          </div>

          <TopItemsChart data={topSellingItems} />
        </>
      ) : (
        <div className="rounded-md border border-brew-line bg-white px-4 py-8 text-center text-sm text-brew-muted">
          Loading analytics...
        </div>
      )}
    </div>
  )
}
