import { useEffect, useMemo, useState } from 'react'
import { Coffee, Loader2, WifiOff } from 'lucide-react'
import { getCategoriesWithItems } from '../services/menuService'

function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}

export default function WorkerHome() {
  const [categories, setCategories] = useState([])
  const [source, setSource] = useState('local')
  const [status, setStatus] = useState('loading')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isCurrent = true

    async function loadCategories() {
      try {
        const result = await getCategoriesWithItems()

        if (!isCurrent) return

        setCategories(result.data)
        setSource(result.source)
        setStatus('ready')
      } catch (error) {
        if (!isCurrent) return

        setErrorMessage(error.message)
        setStatus('error')
      }
    }

    loadCategories()

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

  return (
    <main className="min-h-screen bg-brew-cream text-brew-ink">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-5 sm:px-6">
        <header className="mb-5 flex flex-col gap-4 border-b border-brew-line pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-md bg-brew-tea text-white">
              <Coffee aria-hidden="true" size={26} />
            </div>
            <div>
              <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
                Brewbar POS
              </h1>
              <p className="text-sm font-medium text-brew-muted">
                Phase 1: menu categories
              </p>
            </div>
          </div>

          <div className="rounded-md border border-brew-line bg-white px-4 py-3 text-sm font-semibold text-brew-muted">
            {source === 'supabase' ? 'Connected to Supabase' : 'Using local seed'}
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
                  <div className="flex min-h-16 items-center justify-between gap-3 border-b border-brew-line px-4 py-3">
                    <h2 className="text-xl font-bold">{category.name}</h2>
                    <span className="rounded-md bg-brew-cream px-3 py-2 text-sm font-bold text-brew-muted">
                      {category.menu_items?.length ?? 0} items
                    </span>
                  </div>
                  <div className="grid gap-2 p-3 sm:grid-cols-2">
                    {category.menu_items?.map((item) => (
                      <div
                        className="flex min-h-14 items-center justify-between rounded-md bg-slate-50 px-4 py-3"
                        key={item.id}
                      >
                        <span className="font-semibold">{item.name}</span>
                        <span className="font-bold text-brew-coffee">
                          {formatPrice(item.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  )
}
