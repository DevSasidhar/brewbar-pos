import { useMemo, useState } from 'react'
import { useCartStore } from '../../../store/cartStore'
import { useMenuSearch } from '../hooks/useMenuSearch'
import { useWorkerPosData } from '../hooks/useWorkerPosData'
import { MenuScreen } from './MenuScreen'
import { ReviewScreen } from './ReviewScreen'

export function WorkerPos() {
  const [screen, setScreen] = useState('menu')
  const {
    categories,
    errorMessage,
    openCategoryIds,
    setOpenCategoryIds,
    source,
    status,
    workers,
  } = useWorkerPosData()
  const {
    clearSearch,
    handleSearchChange,
    itemRefs,
    normalizedSearchQuery,
    searchMatches,
    searchQuery,
  } = useMenuSearch(categories, setOpenCategoryIds)
  const {
    decrementItem,
    getItemQuantity,
    incrementItem,
    paymentMode,
    selectedWorkerId,
    selectedWorkerName,
    setPaymentMode,
    setWorker,
  } = useCartStore()
  const totalItems = useCartStore((state) => state.getTotalItems())
  const totalAmount = useCartStore((state) => state.getTotalAmount())
  const cartItemMap = useCartStore((state) => state.items)
  const cartItems = useMemo(() => Object.values(cartItemMap), [cartItemMap])

  function handleWorkerChange(event) {
    const worker = workers.find(
      (workerOption) => workerOption.id === event.target.value,
    )

    setWorker(worker)
  }

  function toggleCategory(categoryId) {
    setOpenCategoryIds((currentIds) => {
      const nextIds = new Set(currentIds)

      if (nextIds.has(categoryId)) {
        nextIds.delete(categoryId)
      } else {
        nextIds.add(categoryId)
      }

      return nextIds
    })
  }

  if (screen === 'review') {
    return (
      <ReviewScreen
        cartItems={cartItems}
        paymentMode={paymentMode}
        selectedWorkerName={selectedWorkerName}
        setPaymentMode={setPaymentMode}
        setScreen={setScreen}
        totalAmount={totalAmount}
        totalItems={totalItems}
      />
    )
  }

  return (
    <MenuScreen
      categories={categories}
      clearSearch={clearSearch}
      decrementItem={decrementItem}
      errorMessage={errorMessage}
      getItemQuantity={getItemQuantity}
      handleSearchChange={handleSearchChange}
      handleWorkerChange={handleWorkerChange}
      incrementItem={incrementItem}
      itemRefs={itemRefs}
      normalizedSearchQuery={normalizedSearchQuery}
      openCategoryIds={openCategoryIds}
      searchMatches={searchMatches}
      searchQuery={searchQuery}
      selectedWorkerId={selectedWorkerId}
      selectedWorkerName={selectedWorkerName}
      setScreen={setScreen}
      source={source}
      status={status}
      toggleCategory={toggleCategory}
      totalAmount={totalAmount}
      totalItems={totalItems}
      workers={workers}
    />
  )
}
