import { formatCurrency } from '../utils/formatters'

function SummaryCard({ label, value, subtext }) {
  return (
    <div className="rounded-md border border-brew-line bg-white px-4 py-4 shadow-sm sm:px-5">
      <p className="text-sm font-bold text-brew-muted">{label}</p>
      <p className="mt-2 text-2xl font-black text-brew-ink sm:text-[1.7rem]">{value}</p>
      {subtext ? <p className="mt-2 text-sm text-brew-muted">{subtext}</p> : null}
    </div>
  )
}

export function AnalyticsSummaryCards({ summary }) {
  const payment = summary.paymentSplit || {}

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      <SummaryCard
        label="Today's Revenue"
        value={formatCurrency(summary.totalRevenue || 0)}
        subtext="Revenue generated"
      />
      <SummaryCard
        label="Orders Count"
        value={summary.totalOrders || 0}
        subtext="Orders placed"
      />
      <SummaryCard
        label="Items Sold"
        value={summary.itemsSold || 0}
        subtext="Items sold"
      />
      <SummaryCard
        label="Average Order Value"
        value={formatCurrency(summary.averageOrderValue || 0)}
        subtext="Per order"
      />
      <SummaryCard
        label="Payment Split"
        value={`${payment.cashPercent || 0}% cash`}
        subtext={`${payment.upiPercent || 0}% UPI`}
      />
    </div>
  )
}
