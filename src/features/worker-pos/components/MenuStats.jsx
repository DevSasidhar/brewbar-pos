export function MenuStats({
  categoryCount,
  itemCount,
  normalizedSearchQuery,
  searchMatches,
  searchQuery,
}) {
  return (
    <>
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-md border border-brew-line bg-white p-4">
          <p className="text-sm font-semibold text-brew-muted">Categories</p>
          <p className="mt-1 text-3xl font-bold">{categoryCount}</p>
        </div>
        <div className="rounded-md border border-brew-line bg-white p-4">
          <p className="text-sm font-semibold text-brew-muted">Items</p>
          <p className="mt-1 text-3xl font-bold">{itemCount}</p>
        </div>
        {normalizedSearchQuery && (
          <div className="col-span-2 rounded-md border border-brew-line bg-white p-4 sm:col-span-2">
            <p className="text-sm font-semibold text-brew-muted">
              Search results
            </p>
            <p className="mt-1 text-3xl font-bold">
              {searchMatches.totalItems}
            </p>
          </div>
        )}
      </div>

      {normalizedSearchQuery && searchMatches.totalItems === 0 && (
        <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-4 font-bold text-amber-900">
          {`No items found for "${searchQuery.trim()}"`}
        </div>
      )}
    </>
  )
}
