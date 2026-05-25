import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

const chartOptions = ({ categories, series }) => {
  const seriesName = series?.[0]?.name || 'Quantity'
  const isRevenue = seriesName === 'Revenue'

  return {
    chart: {
      type: 'bar',
      backgroundColor: '#ffffff',
    },
    title: { text: null },
    xAxis: {
      categories,
      labels: {
        style: { fontSize: '12px' },
      },
    },
    yAxis: {
      title: { text: isRevenue ? 'Revenue' : 'Quantity' },
      labels: {
        formatter() {
          return isRevenue ? `₹${this.value}` : this.value
        },
      },
    },
    tooltip: {
      shared: true,
      pointFormat: `${seriesName}: <b>${isRevenue ? '₹' : ''}{point.y}</b>`,
    },
    legend: { enabled: false },
    series,
  }
}

export function TopItemsChart({ data }) {
  return (
    <div className="rounded-md border border-brew-line bg-white p-4 sm:p-5">
      <div className="mb-3">
        <h2 className="text-lg font-black text-brew-ink">Top Selling Items</h2>
        <p className="text-sm text-brew-muted">Best-performing menu items by quantity or revenue.</p>
      </div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions(data)} />
    </div>
  )
}
