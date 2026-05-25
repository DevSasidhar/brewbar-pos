import { hasSupabaseConfig, supabase } from '../../../../lib/supabase'
import {
  calculateDashboardSummary,
  buildRevenueTrend,
  buildCategoryDistribution,
  buildTopSellingItems,
  buildPaymentSplit,
  buildWorkerPerformance,
} from '../utils/analyticsTransform'

/**
 * Fetch flattened analytics rows from Supabase for a date range.
 * One row represents one sold item.
 */
export async function fetchAnalyticsRows({ startDate, endDate }) {
  if (!hasSupabaseConfig) {
    throw new Error('Supabase configuration is required for analytics queries.')
  }

  const startIso = startDate.toISOString()
  const endIso = endDate.toISOString()

  const { data, error } = await supabase
    .from('order_items')
    .select(
      `
      id,
      order_id,
      quantity,
      item_name,
      item_price,
      menu_items(name, categories(name)),
      orders!inner(created_at, payment_mode, worker_id, workers(name))
    `,
    )
    .gte('orders.created_at', startIso)
    .lte('orders.created_at', endIso)

  if (error) {
    console.error('Analytics query error:', error)
    throw error
  }

  return (data || [])
    .map((item) => ({
      order_id: item.order_id,
      created_at: item.orders?.created_at,
      payment_mode: item.orders?.payment_mode,
      worker_name: item.orders?.workers?.name || 'Unknown',
      category_name: item.menu_items?.categories?.name || 'Unknown',
      item_name: item.item_name || item.menu_items?.name || 'Unknown',
      quantity: item.quantity,
      item_price: item.item_price,
      subtotal: item.quantity * item.item_price,
    }))
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
}

/**
 * Fetch a full analytics overview for the given date range.
 * This is the centralized service entry point for dashboard data.
 */
export async function getAnalyticsOverview({ startDate, endDate, itemLimit = 10, itemSortBy = 'quantity' }) {
  const rows = await fetchAnalyticsRows({ startDate, endDate })

  return {
    summary: calculateDashboardSummary(rows),
    revenueTrend: buildRevenueTrend(rows),
    categoryDistribution: buildCategoryDistribution(rows),
    topSellingItems: buildTopSellingItems(rows, { limit: itemLimit, sortBy: itemSortBy }),
    paymentSplit: buildPaymentSplit(rows),
    workerPerformance: buildWorkerPerformance(rows),
  }
}

export async function getDashboardSummary({ startDate, endDate }) {
  const rows = await fetchAnalyticsRows({ startDate, endDate })
  return calculateDashboardSummary(rows)
}

export async function getRevenueTrend({ startDate, endDate }) {
  const rows = await fetchAnalyticsRows({ startDate, endDate })
  return buildRevenueTrend(rows)
}

export async function getCategoryDistribution({ startDate, endDate }) {
  const rows = await fetchAnalyticsRows({ startDate, endDate })
  return buildCategoryDistribution(rows)
}

export async function getTopSellingItems({ startDate, endDate, limit = 10, sortBy = 'quantity' }) {
  const rows = await fetchAnalyticsRows({ startDate, endDate })
  return buildTopSellingItems(rows, { limit, sortBy })
}

export async function getPaymentSplit({ startDate, endDate }) {
  const rows = await fetchAnalyticsRows({ startDate, endDate })
  return buildPaymentSplit(rows)
}

export async function getWorkerPerformance({ startDate, endDate }) {
  const rows = await fetchAnalyticsRows({ startDate, endDate })
  return buildWorkerPerformance(rows)
}
