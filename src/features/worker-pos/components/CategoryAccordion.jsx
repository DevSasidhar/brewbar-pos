import { ChevronDown, ChevronUp } from 'lucide-react'
import { ItemQuantityRow } from './ItemQuantityRow'

export function CategoryAccordion({
  category,
  decrementItem,
  getItemQuantity,
  incrementItem,
  itemRefs,
  normalizedSearchQuery,
  openCategoryIds,
  searchMatches,
  toggleCategory,
}) {
  // All items (including inactive ones) for display, but only active ones for interaction.
  const allItems = category.menu_items ?? []
  const activeItems = allItems.filter((item) => item.is_available)
  const visibleItems = normalizedSearchQuery
    ? allItems.filter((item) => searchMatches.itemIds.has(item.id))
    : allItems

  if (normalizedSearchQuery && visibleItems.length === 0) {
    return null
  }

  // Show category even if no active items, but indicate count of available items.
  const activeItemsCount = activeItems.length

  return (
    <section className="rounded-md border border-brew-line bg-white">
      <button
        className="flex min-h-16 w-full items-center justify-between gap-3 border-b border-brew-line px-4 py-3 text-left"
        onClick={() => toggleCategory(category.id)}
        type="button"
      >
        <span>
          <span className="block text-xl font-bold">{category.name}</span>
          <span className="text-sm font-semibold text-brew-muted">
            {normalizedSearchQuery
              ? `${visibleItems.length} matches`
              : `${activeItemsCount} items available`}
          </span>
        </span>
        <span className="grid size-11 place-items-center rounded-md bg-brew-cream text-brew-muted">
          {openCategoryIds.has(category.id) ? (
            <ChevronUp aria-hidden="true" />
          ) : (
            <ChevronDown aria-hidden="true" />
          )}
        </span>
      </button>

      {openCategoryIds.has(category.id) && (
        <div className="grid gap-2 p-3">
          {visibleItems.map((item) => (
            <ItemQuantityRow
              decrementItem={decrementItem}
              incrementItem={incrementItem}
              isSearchMatch={searchMatches.itemIds.has(item.id)}
              item={item}
              itemRefs={itemRefs}
              key={item.id}
              quantity={getItemQuantity(item.id)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
