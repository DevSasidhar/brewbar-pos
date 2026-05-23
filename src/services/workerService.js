import { workers as localWorkers } from '../data/menuSeed'
import { hasSupabaseConfig, supabase } from '../lib/supabase'

const fallbackWorkers = localWorkers.map((worker, index) => ({
  id: `local-worker-${index + 1}`,
  ...worker,
}))

export async function getActiveWorkers() {
  if (!hasSupabaseConfig) {
    return { data: fallbackWorkers, source: 'local' }
  }

  const { data, error } = await supabase
    .from('workers')
    .select('id, name, is_active')
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error) {
    throw error
  }

  return { data, source: 'supabase' }
}

export async function submitOrder({
  workerId,
  items,
  paymentMode,
  totalAmount,
  totalItems,
}) {
  if (!hasSupabaseConfig) {
    // mock a local submission
    return {
      data: { id: `local-order-${Date.now()}` },
      source: 'local',
    }
  }

  // insert order
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert([
      {
        worker_id: workerId,
        payment_mode: paymentMode,
        total_amount: totalAmount,
        total_items: totalItems,
      },
    ])
    .select('id')

  if (orderError) {
    throw orderError
  }

  const orderId = orderData?.[0]?.id

  if (!orderId) {
    throw new Error('Failed to create order')
  }

  // prepare order_items rows
  const orderItems = items.map((it) => ({
    order_id: orderId,
    menu_item_id: it.id || null,
    item_name: it.name,
    item_price: it.price,
    quantity: it.quantity,
    subtotal: Number((it.price * it.quantity).toFixed(2)),
  }))

  const { data: itemsData, error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) {
    throw itemsError
  }

  return { data: { id: orderId }, source: 'supabase' }
}
