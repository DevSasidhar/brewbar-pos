export const FILTER_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: 'thisWeek', label: 'This Week' },
  { value: 'thisMonth', label: 'This Month' },
  { value: 'custom', label: 'Custom Range' },
]

function formatLocalDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatDateISO(date) {
  return formatLocalDate(date)
}

export function getRangeDates(filterKey, referenceDate = new Date()) {
  const now = new Date(referenceDate)
  now.setHours(0, 0, 0, 0)

  switch (filterKey) {
    case 'today': {
      const startDate = new Date(now)
      const endDate = new Date(now)
      endDate.setHours(23, 59, 59, 999)
      return { startDate, endDate }
    }

    case 'thisWeek': {
      const dayOfWeek = now.getDay()
      const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
      const startDate = new Date(now)
      startDate.setDate(now.getDate() - daysFromMonday)
      startDate.setHours(0, 0, 0, 0)
      const endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 6)
      endDate.setHours(23, 59, 59, 999)
      return { startDate, endDate }
    }

    case 'thisMonth': {
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      startDate.setHours(0, 0, 0, 0)
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      endDate.setHours(23, 59, 59, 999)
      return { startDate, endDate }
    }

    default:
      return {
        startDate: new Date(now),
        endDate: new Date(now),
      }
  }
}
