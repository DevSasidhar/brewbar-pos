import { workers as localWorkers } from '../data/menuSeed'
import { hasSupabaseConfig, supabase } from '../lib/supabase'

const fallbackWorkers = localWorkers.map((worker, index) => ({
  id: `local-worker-${index + 1}`,
  ...worker,
}))

export async function getAdminWorkers() {
  if (!hasSupabaseConfig) {
    return { data: fallbackWorkers, source: 'local' }
  }

  const { data, error } = await supabase
    .from('workers')
    .select('id, name, is_active')
    .order('name', { ascending: true })

  if (error) {
    throw error
  }

  return { data, source: 'supabase' }
}

export async function addAdminWorker(name) {
  if (!hasSupabaseConfig) {
    return {
      data: { id: `local-worker-${Date.now()}`, name, is_active: true },
      source: 'local',
    }
  }

  const { data, error } = await supabase
    .from('workers')
    .insert([{ name, is_active: true }])
    .select('id, name, is_active')

  if (error) {
    throw error
  }

  return { data: data?.[0], source: 'supabase' }
}

export async function updateAdminWorkerStatus(workerId, isActive) {
  if (!hasSupabaseConfig) {
    return {
      data: { id: workerId, is_active: isActive },
      source: 'local',
    }
  }

  const { data, error } = await supabase
    .from('workers')
    .update({ is_active: isActive })
    .eq('id', workerId)
    .select('id, name, is_active')

  if (error) {
    throw error
  }

  return { data: data?.[0], source: 'supabase' }
}

export async function getOrders() {
  if (!hasSupabaseConfig) {
    return { data: [], source: 'local' }
  }

  const { data, error } = await supabase
    .from('orders')
    .select(
      `id, worker_id, payment_mode, total_amount, total_items, created_at, workers(id, name), order_items(id, item_name, item_price, quantity, subtotal)`,
    )
    .order('created_at', { ascending: false })
    .limit(15)

  if (error) {
    throw error
  }

  return { data, source: 'supabase' }
}

export async function getCategories() {
  if (!hasSupabaseConfig) {
    return { data: [], source: 'local' }
  }

  const { data, error } = await supabase
    .from('categories')
    .select('id, name, display_order, is_active')
    .order('display_order', { ascending: true })

  if (error) {
    throw error
  }

  return { data, source: 'supabase' }
}

export async function addCategory(name) {
  if (!hasSupabaseConfig) {
    return { data: { id: `local-category-${Date.now()}`, name, display_order: 0, is_active: true }, source: 'local' }
  }

  const { data, error } = await supabase
    .from('categories')
    .insert([{ name, display_order: 0, is_active: true }])
    .select('id, name, display_order, is_active')

  if (error) {
    throw error
  }

  return { data: data?.[0], source: 'supabase' }
}

export async function updateCategoryStatus(categoryId, isActive) {
  if (!hasSupabaseConfig) {
    return { data: { id: categoryId, is_active: isActive }, source: 'local' }
  }

  const { data, error } = await supabase
    .from('categories')
    .update({ is_active: isActive })
    .eq('id', categoryId)
    .select('id, name, display_order, is_active')

  if (error) {
    throw error
  }

  return { data: data?.[0], source: 'supabase' }
}

export async function getMenuItems() {
  if (!hasSupabaseConfig) {
    return { data: [], source: 'local' }
  }

  const { data, error } = await supabase
    .from('menu_items')
    .select('id, category_id, name, price, is_available, display_order, categories(name)')
    .order('display_order', { ascending: true })

  if (error) {
    throw error
  }

  return { data, source: 'supabase' }
}

export async function addMenuItem({ categoryId, name, price, isAvailable }) {
  if (!hasSupabaseConfig) {
    return {
      data: { id: `local-menuitem-${Date.now()}`, category_id: categoryId, name, price, is_available: isAvailable, display_order: 0, categories: { name: '' } },
      source: 'local',
    }
  }

  const { data, error } = await supabase
    .from('menu_items')
    .insert([{
      category_id: categoryId,
      name,
      price,
      is_available: isAvailable,
      display_order: 0,
    }])
    .select('id, category_id, name, price, is_available, display_order, categories(name)')

  if (error) {
    throw error
  }

  return { data: data?.[0], source: 'supabase' }
}

export async function updateMenuItem({ itemId, price, isAvailable }) {
  if (!hasSupabaseConfig) {
    return {
      data: { id: itemId, price, is_available: isAvailable },
      source: 'local',
    }
  }

  const { data, error } = await supabase
    .from('menu_items')
    .update({ price, is_available: isAvailable })
    .eq('id', itemId)
    .select('id, category_id, name, price, is_available, display_order, categories(name)')

  if (error) {
    throw error
  }

  return { data: data?.[0], source: 'supabase' }
}

export async function deleteMenuItem(itemId) {
  if (!hasSupabaseConfig) {
    return { data: { id: itemId }, source: 'local' }
  }

  const { error } = await supabase.from('menu_items').delete().eq('id', itemId)

  if (error) {
    throw error
  }

  return { data: { id: itemId }, source: 'supabase' }
}
