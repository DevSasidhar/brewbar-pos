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
