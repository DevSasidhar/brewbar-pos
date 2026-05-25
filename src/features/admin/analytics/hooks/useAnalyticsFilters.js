import { create } from 'zustand'
import { FILTER_OPTIONS, getRangeDates, formatDateISO } from '../utils/analyticsFilterUtils'

const defaultRange = 'today'
const defaultDates = getRangeDates(defaultRange)

export const useAnalyticsFilters = create((set) => ({
  range: defaultRange,
  startDate: formatDateISO(defaultDates.startDate),
  endDate: formatDateISO(defaultDates.endDate),
  setRange: (range) => {
    const { startDate, endDate } = getRangeDates(range)
    set({ range, startDate: formatDateISO(startDate), endDate: formatDateISO(endDate) })
  },
  setStartDate: (startDate) => set({ startDate }),
  setEndDate: (endDate) => set({ endDate }),
  setCustomRange: (startDate, endDate) => set({ range: 'custom', startDate, endDate }),
  options: FILTER_OPTIONS,
}))
