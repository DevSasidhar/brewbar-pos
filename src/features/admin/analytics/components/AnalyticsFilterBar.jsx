import { CalendarRange, RefreshCw } from 'lucide-react'
import { useAnalyticsFilters } from '../hooks/useAnalyticsFilters'

export function AnalyticsFilterBar({ onRefresh, loading }) {
  const { range, startDate, endDate, setRange, setCustomRange, options } = useAnalyticsFilters()

  return (
    <div className="rounded-md border border-brew-line bg-white px-4 py-3 sm:px-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-bold text-brew-muted">Analytics range</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setRange(option.value)}
                className={`rounded-md px-3 py-2 text-sm font-bold ${
                  range === option.value
                    ? 'bg-brew-coffee text-white'
                    : 'border border-brew-line bg-white text-brew-ink'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[420px]">
          <label className="grid gap-1 text-sm font-bold text-brew-muted">
            Start date
            <div className="flex items-center gap-2 rounded-md border border-brew-line bg-slate-50 px-3 py-2">
              <CalendarRange size={16} className="text-brew-muted" />
              <input
                type="date"
                value={startDate}
                onChange={(event) => setCustomRange(event.target.value, endDate)}
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </label>

          <label className="grid gap-1 text-sm font-bold text-brew-muted">
            End date
            <div className="flex items-center gap-2 rounded-md border border-brew-line bg-slate-50 px-3 py-2">
              <CalendarRange size={16} className="text-brew-muted" />
              <input
                type="date"
                value={endDate}
                onChange={(event) => setCustomRange(startDate, event.target.value)}
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </label>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-md bg-brew-coffee px-4 py-2 text-sm font-black text-white disabled:bg-slate-300"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>
    </div>
  )
}
