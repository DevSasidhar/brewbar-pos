import { menuSeed } from '../data/menuSeed'
import { hasSupabaseConfig, supabase } from '../lib/supabase'

const localCategories = menuSeed.map((category, categoryIndex) => ({
  id: `local-category-${categoryIndex + 1}`,
  name: category.name,
  display_order: categoryIndex + 1,
  is_active: true,
  menu_items: category.items.map(([name, price], itemIndex) => ({
    id: `local-item-${categoryIndex + 1}-${itemIndex + 1}`,
    name,
    price,
    is_available: true,
    display_order: itemIndex + 1,
  })),
}))

export async function getCategoriesWithItems() {
  if (!hasSupabaseConfig) {
    return { data: localCategories, source: 'local' }
  }

  const { data, error } = await supabase
    .from('categories')
    .select(
      `
        id,
        name,
        display_order,
        is_active,
        menu_items (
          id,
          name,
          price,
          is_available,
          display_order
        )
      `,
    )
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .order('display_order', { foreignTable: 'menu_items', ascending: true })

  if (error) {
    throw error
  }

  return { data, source: 'supabase' }
}
