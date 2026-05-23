import { useEffect, useMemo, useState } from 'react'
import {
  ChevronDown,
  ChevronUp,
  Coffee,
  Loader2,
  Minus,
  Plus,
  ShoppingCart,
  UserRound,
  WifiOff,
} from 'lucide-react'
import { getCategoriesWithItems } from '../services/menuService'
import { getActiveWorkers } from '../services/workerService'
import { useCartStore } from '../store/cartStore'

function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}

export default function WorkerHome() {
  const [categories, setCategories] = useState([])
  const [workers, setWorkers] = useState([])
  const [source, setSource] = useState('local')
  const [status, setStatus] = useState('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [openCategoryIds, setOpenCategoryIds] = useState(new Set())
  const {
    decrementItem,
    getItemQuantity,
    incrementItem,
    selectedWorkerId,
    selectedWorkerName,
    setWorker,
  } = useCartStore()

  useEffect(() => {
    let isCurrent = true

    async function loadInitialData() {
      try {
        const [categoryResult, workerResult] = await Promise.all([
          getCategoriesWithItems(),
          getActiveWorkers(),
        ])

        if (!isCurrent) return

        setCategories(categoryResult.data)
        setWorkers(workerResult.data)
        setSource(categoryResult.source)
        setOpenCategoryIds(
          new Set(categoryResult.data.slice(0, 3).map((category) => category.id)),
        )
        setStatus('ready')
      } catch (error) {
        if (!isCurrent) return

        setErrorMessage(error.message)
        setStatus('error')
      }
    }

    loadInitialData()

    return () => {
      isCurrent = false
    }
  }, [])

  const itemCount = useMemo(
    () =>
      categories.reduce(
        (total, category) => total + (category.menu_items?.length ?? 0),
        0,
      ),
    [categories],
  )
  const totalItems = useCartStore((state) => state.getTotalItems())
  const totalAmount = useCartStore((state) => state.getTotalAmount())

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

  return (
    <main className="min-h-screen bg-brew-cream pb-24 text-brew-ink">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-4 sm:px-6">
        <header className="sticky top-0 z-20 -mx-4 mb-4 border-b border-brew-line bg-brew-cream/95 px-4 pb-4 pt-3 backdrop-blur sm:-mx-6 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-md bg-brew-tea text-white">
              <Coffee aria-hidden="true" size={26} />
            </div>
            <div>
              <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
                Brewbar POS
              </h1>
              <p className="text-sm font-medium text-brew-muted">
                Worker order screen
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(260px,360px)_1fr] sm:items-center">
            <label className="grid gap-2">
              <span className="flex items-center gap-2 text-sm font-bold text-brew-muted">
                <UserRound aria-hidden="true" size={18} />
                Worker
              </span>
              <select
                className="h-12 rounded-md border border-brew-line bg-white px-3 text-base font-bold outline-none focus:border-brew-tea focus:ring-2 focus:ring-brew-tea/20"
                onChange={handleWorkerChange}
                value={selectedWorkerId}
              >
                <option value="">Select worker</option>
                {workers.map((worker) => (
                  <option key={worker.id} value={worker.id}>
                    {worker.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="rounded-md border border-brew-line bg-white px-4 py-3 text-sm font-semibold text-brew-muted sm:justify-self-end">
              {source === 'supabase'
                ? 'Connected to Supabase'
                : 'Using local seed'}
            </div>
          </div>
        </header>

        {status === 'loading' && (
          <div className="flex flex-1 items-center justify-center rounded-md border border-dashed border-brew-line bg-white">
            <div className="flex items-center gap-3 text-brew-muted">
              <Loader2 className="animate-spin" aria-hidden="true" />
              <span className="font-semibold">Loading menu categories</span>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="rounded-md border border-red-200 bg-red-50 p-5 text-red-800">
            <div className="mb-2 flex items-center gap-2 font-bold">
              <WifiOff aria-hidden="true" size={20} />
              Could not load Supabase menu data
            </div>
            <p className="text-sm">{errorMessage}</p>
          </div>
        )}

        {status === 'ready' && (
          <>
            <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-md border border-brew-line bg-white p-4">
                <p className="text-sm font-semibold text-brew-muted">
                  Categories
                </p>
                <p className="mt-1 text-3xl font-bold">{categories.length}</p>
              </div>
              <div className="rounded-md border border-brew-line bg-white p-4">
                <p className="text-sm font-semibold text-brew-muted">Items</p>
                <p className="mt-1 text-3xl font-bold">{itemCount}</p>
              </div>
            </div>

            <div className="grid gap-3 pb-6">
              {categories.map((category) => (
                <section
                  className="rounded-md border border-brew-line bg-white"
                  key={category.id}
                >
                  <button
                    className="flex min-h-16 w-full items-center justify-between gap-3 border-b border-brew-line px-4 py-3 text-left"
                    onClick={() => toggleCategory(category.id)}
                    type="button"
                  >
                    <span>
                      <span className="block text-xl font-bold">
                        {category.name}
                      </span>
                      <span className="text-sm font-semibold text-brew-muted">
                        {category.menu_items?.length ?? 0} items
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
                      {category.menu_items
                        ?.filter((item) => item.is_available)
                        .map((item) => {
                          const quantity = getItemQuantity(item.id)

                          return (
                            <div
                              className="grid min-h-20 grid-cols-[1fr_auto] gap-3 rounded-md bg-slate-50 px-4 py-3 sm:grid-cols-[1fr_auto_156px] sm:items-center"
                              key={item.id}
                            >
                              <div>
                                <span className="block font-bold">
                                  {item.name}
                                </span>
                                <span className="text-sm font-semibold text-brew-coffee">
                                  {formatPrice(item.price)}
                                </span>
                              </div>

                              <div className="hidden text-right font-bold text-brew-coffee sm:block">
                                {quantity > 0
                                  ? formatPrice(quantity * Number(item.price))
                                  : ''}
                              </div>

                              <div className="col-span-2 grid grid-cols-[48px_48px_48px] justify-end gap-2 sm:col-span-1">
                                <button
                                  aria-label={`Remove ${item.name}`}
                                  className="grid size-12 place-items-center rounded-md border border-brew-line bg-white text-brew-ink disabled:opacity-35"
                                  disabled={quantity === 0}
                                  onClick={() => decrementItem(item.id)}
                                  type="button"
                                >
                                  <Minus aria-hidden="true" size={22} />
                                </button>
                                <div className="grid size-12 place-items-center rounded-md bg-white text-xl font-bold">
                                  {quantity}
                                </div>
                                <button
                                  aria-label={`Add ${item.name}`}
                                  className="grid size-12 place-items-center rounded-md bg-brew-tea text-white"
                                  onClick={() => incrementItem(item)}
                                  type="button"
                                >
                                  <Plus aria-hidden="true" size={24} />
                                </button>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  )}
                </section>
              ))}
            </div>
          </>
        )}
      </section>

      <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-brew-line bg-white px-4 py-3 shadow-[0_-8px_30px_rgba(31,41,51,0.12)]">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-sm font-bold text-brew-muted">
              <ShoppingCart aria-hidden="true" size={18} />
              {selectedWorkerName || 'No worker selected'}
            </div>
            <p className="mt-1 text-lg font-black">
              {totalItems} items · {formatPrice(totalAmount)}
            </p>
          </div>
          <button
            className="min-h-12 rounded-md bg-brew-coffee px-5 text-base font-black text-white disabled:bg-slate-300"
            disabled={!selectedWorkerId || totalItems === 0}
            type="button"
          >
            Review Order
          </button>
        </div>
      </footer>
    </main>
  )
}
