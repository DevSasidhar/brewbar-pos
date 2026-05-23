import { useMemo } from 'react'
import { CartFooter } from './CartFooter'
import { CategoryList } from './CategoryList'
import { ErrorState, LoadingState } from './StatusState'
import { MenuHeader } from './MenuHeader'
import { MenuStats } from './MenuStats'

export function MenuScreen({
  categories,
  clearSearch,
  decrementItem,
  errorMessage,
  getItemQuantity,
  handleSearchChange,
  handleWorkerChange,
  incrementItem,
  itemRefs,
  normalizedSearchQuery,
  openCategoryIds,
  searchMatches,
  searchQuery,
  selectedWorkerId,
  selectedWorkerName,
  setScreen,
  source,
  status,
  toggleCategory,
  totalAmount,
  totalItems,
  workers,
}) {
  const itemCount = useMemo(
    () =>
      categories.reduce(
        (total, category) => total + (category.menu_items?.length ?? 0),
        0,
      ),
    [categories],
  )

  function showReviewScreen() {
    if (!selectedWorkerId || totalItems === 0) {
      return
    }

    setScreen('review')
  }

  return (
    <main className="min-h-screen bg-brew-cream pb-24 text-brew-ink">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-4 sm:px-6">
        <MenuHeader
          clearSearch={clearSearch}
          handleSearchChange={handleSearchChange}
          handleWorkerChange={handleWorkerChange}
          searchQuery={searchQuery}
          selectedWorkerId={selectedWorkerId}
          source={source}
          workers={workers}
        />

        {status === 'loading' && <LoadingState />}
        {status === 'error' && <ErrorState message={errorMessage} />}

        {status === 'ready' && (
          <>
            <MenuStats
              categoryCount={categories.length}
              itemCount={itemCount}
              normalizedSearchQuery={normalizedSearchQuery}
              searchMatches={searchMatches}
              searchQuery={searchQuery}
            />

            <CategoryList
              categories={categories}
              decrementItem={decrementItem}
              getItemQuantity={getItemQuantity}
              incrementItem={incrementItem}
              itemRefs={itemRefs}
              normalizedSearchQuery={normalizedSearchQuery}
              openCategoryIds={openCategoryIds}
              searchMatches={searchMatches}
              toggleCategory={toggleCategory}
            />
          </>
        )}
      </section>

      <CartFooter
        selectedWorkerId={selectedWorkerId}
        selectedWorkerName={selectedWorkerName}
        showReviewScreen={showReviewScreen}
        totalAmount={totalAmount}
        totalItems={totalItems}
      />
    </main>
  )
}
