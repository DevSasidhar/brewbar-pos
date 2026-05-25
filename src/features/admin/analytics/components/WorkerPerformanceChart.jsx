import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

const chartOptions = ({ categories, revenueSeries, ordersSeries }) => ({
  chart: {
    backgroundColor: '#ffffff',
  },
  title: { text: null },
  xAxis: {
    categories,
    labels: { style: { fontSize: '12px' } },
  },
  yAxis: [
    {
      title: { text: 'Revenue' },
      labels: { format: '₹{value}' },
    },
    {
      title: { text: 'Orders' },
      opposite: true,
    },
  ],
  tooltip: {
    shared: true,
  },
  series: [
    {
      name: 'Revenue',
      type: 'column',
      data: revenueSeries,
      yAxis: 0,
    },
    {
      name: 'Orders',
      type: 'line',
      data: ordersSeries,
      yAxis: 1,
    },
  ],
})

export function WorkerPerformanceChart({ data }) {
  return (
    <div className="rounded-md border border-brew-line bg-white p-4 sm:p-5">
      <div className="mb-3">
        <h2 className="text-lg font-black text-brew-ink">Worker Performance</h2>
        <p className="text-sm text-brew-muted">Revenue and order count by worker.</p>
      </div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions(data)} />
    </div>
  )
}
