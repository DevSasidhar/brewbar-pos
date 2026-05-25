import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

const chartOptions = ({ categories, series }) => ({
  chart: {
    type: 'line',
    backgroundColor: '#ffffff',
    style: {
      fontFamily: 'Inter, sans-serif',
    },
  },
  title: { text: null },
  xAxis: {
    categories,
    labels: {
      style: { fontSize: '12px' },
    },
  },
  yAxis: {
    title: { text: 'Revenue' },
    labels: {
      formatter() {
        return `₹${this.value}`
      },
    },
  },
  tooltip: {
    shared: true,
    valuePrefix: '₹',
  },
  legend: { enabled: false },
  series,
  responsive: {
    rules: [{
      condition: { maxWidth: 768 },
      chartOptions: {
        xAxis: { labels: { rotation: -45 } },
      },
    }],
  },
})

export function RevenueTrendChart({ data }) {
  return (
    <div className="rounded-md border border-brew-line bg-white p-4 sm:p-5">
      <div className="mb-3">
        <h2 className="text-lg font-black text-brew-ink">Revenue Trend</h2>
        <p className="text-sm text-brew-muted">Hourly revenue performance for the selected range.</p>
      </div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions(data)} />
    </div>
  )
}
