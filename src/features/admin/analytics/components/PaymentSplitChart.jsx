import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

const chartOptions = ({ series }) => ({
  chart: {
    type: 'pie',
    backgroundColor: '#ffffff',
  },
  title: { text: null },
  tooltip: {
    pointFormat: '{series.name}: <b>₹{point.y}</b>',
  },
  plotOptions: {
    pie: {
      innerSize: '55%',
      dataLabels: {
        enabled: true,
        format: '<b>{point.name}</b><br>{point.percentage:.1f} %',
      },
    },
  },
  series,
})

export function PaymentSplitChart({ data }) {
  return (
    <div className="rounded-md border border-brew-line bg-white p-4 sm:p-5">
      <div className="mb-3">
        <h2 className="text-lg font-black text-brew-ink">Payment Split</h2>
        <p className="text-sm text-brew-muted">Cash vs UPI contribution.</p>
      </div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions(data)} />
    </div>
  )
}
