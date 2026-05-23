import { useEffect, useMemo, useRef, useState } from 'react'

export function useMenuSearch(categories, setOpenCategoryIds) {
  const [searchQuery, setSearchQuery] = useState('')
  const itemRefs = useRef(new Map())
  const normalizedSearchQuery = searchQuery.trim().toLowerCase()

  const searchMatches = useMemo(() => {
    if (!normalizedSearchQuery) {
      return {
        firstItemId: '',
        itemIds: new Set(),
        totalItems: 0,
      }
    }

    const itemIds = new Set()
    let firstItemId = ''
    let totalMatchedItems = 0

    categories.forEach((category) => {
      category.menu_items
        ?.filter((item) => item.is_available)
        .forEach((item) => {
          if (item.name.toLowerCase().includes(normalizedSearchQuery)) {
            itemIds.add(item.id)
            firstItemId ||= item.id
            totalMatchedItems += 1
          }
        })
    })

    return {
      firstItemId,
      itemIds,
      totalItems: totalMatchedItems,
    }
  }, [categories, normalizedSearchQuery])

  // Keep the first search match in reach for workers using the app one-handed.
  useEffect(() => {
    if (!normalizedSearchQuery || !searchMatches.firstItemId) {
      return
    }

    const scrollTimer = window.setTimeout(() => {
      itemRefs.current
        .get(searchMatches.firstItemId)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 120)

    return () => window.clearTimeout(scrollTimer)
  }, [normalizedSearchQuery, searchMatches.firstItemId])

  function clearSearch() {
    setSearchQuery('')
    setOpenCategoryIds(
      new Set(categories.slice(0, 3).map((category) => category.id)),
    )
  }

  function handleSearchChange(event) {
    const nextQuery = event.target.value
    const normalizedNextQuery = nextQuery.trim().toLowerCase()

    setSearchQuery(nextQuery)

    if (!normalizedNextQuery) {
      return
    }

    const matchingCategoryIds = categories
      .filter((category) =>
        category.menu_items?.some(
          (item) =>
            item.is_available &&
            item.name.toLowerCase().includes(normalizedNextQuery),
        ),
      )
      .map((category) => category.id)

    setOpenCategoryIds((currentIds) => {
      const nextIds = new Set(currentIds)
      matchingCategoryIds.forEach((categoryId) => nextIds.add(categoryId))
      return nextIds
    })
  }

  return {
    clearSearch,
    handleSearchChange,
    itemRefs,
    normalizedSearchQuery,
    searchMatches,
    searchQuery,
  }
}
