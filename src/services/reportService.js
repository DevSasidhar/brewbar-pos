import { hasSupabaseConfig, supabase } from '../lib/supabase'

/**
 * Fetch sales data for a given date range.
 * Joins orders, order_items, workers, menu_items, and categories tables.
 * Returns flattened structure: one row per sold item (not per order).
 *
 * @param {Date} startDate - inclusive start date
 * @param {Date} endDate - inclusive end date
 * @returns {Promise<Array>} array of sales records with all required data
 */
export async function getSalesData({ startDate, endDate }) {
  if (!hasSupabaseConfig) {
    // Return mock data for offline/demo mode
    return getMockSalesData({ startDate, endDate })
  }

  // Format dates for Supabase query (YYYY-MM-DD)
  const startDateStr = startDate.toISOString().split('T')[0]
  const endDateStr = endDate.toISOString().split('T')[0]

  // Query: orders -> order_items -> menu_items -> categories
  const { data, error } = await supabase
    .from('orders')
    .select(
      `
      id,
      created_at,
      payment_mode,
      workers(name),
      order_items(
        id,
        quantity,
        item_name,
        item_price,
        menu_items(
          id,
          name,
          categories(id, name)
        )
      )
    `
    )
    .gte('created_at', `${startDateStr}T00:00:00`)
    .lte('created_at', `${endDateStr}T23:59:59`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching sales data:', error)
    throw error
  }

  // Flatten the nested structure: one row per order_item
  const flattenedData = []

  if (data && Array.isArray(data)) {
    data.forEach((order) => {
      const orderItems = order.order_items || []

      if (orderItems.length === 0) {
        // Handle orders with no items (edge case)
        flattenedData.push({
          order_id: order.id,
          created_at: order.created_at,
          payment_mode: order.payment_mode,
          worker_name: order.workers?.name || 'Unknown',
          category_name: null,
          item_name: null,
          quantity: 0,
          item_price: 0,
          subtotal: 0,
        })
      } else {
        // Create one row per item in the order
        orderItems.forEach((item) => {
          flattenedData.push({
            order_id: order.id,
            created_at: order.created_at,
            payment_mode: order.payment_mode,
            worker_name: order.workers?.name || 'Unknown',
            category_name: item.menu_items?.categories?.name || 'Unknown',
            item_name: item.item_name || 'Unknown',
            quantity: item.quantity,
            item_price: item.item_price,
            subtotal: item.quantity * item.item_price,
          })
        })
      }
    })
  }

  return flattenedData
}

/**
 * Get sales data for a specific day.
 * @param {Date} date - the day to query
 * @returns {Promise<Array>}
 */
export async function getDailySalesData(date) {
  const startDate = new Date(date)
  startDate.setHours(0, 0, 0, 0)
  const endDate = new Date(date)
  endDate.setHours(23, 59, 59, 999)

  return getSalesData({ startDate, endDate })
}

/**
 * Get sales data for a specific week.
 * Week starts on Monday.
 * @param {Date} date - any date within the week
 * @returns {Promise<Array>}
 */
export async function getWeeklySalesData(date) {
  const dayOfWeek = date.getDay()
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Mon = 0, Sun = 6
  const startDate = new Date(date)
  startDate.setDate(date.getDate() - daysFromMonday)
  startDate.setHours(0, 0, 0, 0)

  const endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + 6)
  endDate.setHours(23, 59, 59, 999)

  return getSalesData({ startDate, endDate })
}

/**
 * Get sales data for a specific month.
 * @param {number} year - the year
 * @param {number} month - the month (1-12)
 * @returns {Promise<Array>}
 */
export async function getMonthlySalesData(year, month) {
  const startDate = new Date(year, month - 1, 1) // month is 0-indexed
  startDate.setHours(0, 0, 0, 0)

  const endDate = new Date(year, month, 0) // last day of the month
  endDate.setHours(23, 59, 59, 999)

  return getSalesData({ startDate, endDate })
}

/**
 * Mock data for development/demo mode.
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {Array}
 */
function getMockSalesData({ startDate, endDate }) {
  const items = [
    { category: 'Coffee', name: 'Espresso', unitPrice: 3.5 },
    { category: 'Coffee', name: 'Latte', unitPrice: 4.5 },
    { category: 'Coffee', name: 'Cappuccino', unitPrice: 4.5 },
    { category: 'Pastry', name: 'Croissant', unitPrice: 3.0 },
    { category: 'Pastry', name: 'Muffin', unitPrice: 2.5 },
    { category: 'Beverage', name: 'Juice', unitPrice: 3.0 },
  ]
  const workers = ['Alice', 'Bob', 'Charlie']
  const paymentModes = ['cash', 'upi']

  const data = []
  let orderId = 1001

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const numOrders = Math.floor(Math.random() * 5) + 3 // 3-7 orders per day
    for (let i = 0; i < numOrders; i++) {
      const numItems = Math.floor(Math.random() * 3) + 1
      for (let j = 0; j < numItems; j++) {
        const item = items[Math.floor(Math.random() * items.length)]
        const quantity = Math.floor(Math.random() * 3) + 1
        const timestamp = new Date(d)
        timestamp.setHours(Math.floor(Math.random() * 12) + 8)
        timestamp.setMinutes(Math.floor(Math.random() * 60))

        data.push({
          order_id: `order-${orderId}`,
          created_at: timestamp.toISOString(),
          payment_mode: paymentModes[Math.floor(Math.random() * paymentModes.length)],
          worker_name: workers[Math.floor(Math.random() * workers.length)],
          category_name: item.category,
          item_name: item.name,
          quantity,
          unit_price: item.unitPrice,
          subtotal: quantity * item.unitPrice,
        })
      }
      orderId++
    }
  }

  return data
}
