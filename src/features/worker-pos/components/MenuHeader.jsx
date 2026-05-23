import { Coffee, Search, UserRound, X } from 'lucide-react'

export function MenuHeader({
  clearSearch,
  handleSearchChange,
  handleWorkerChange,
  searchQuery,
  selectedWorkerId,
  source,
  workers,
}) {
  return (
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

      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(220px,280px)_1fr_auto] lg:items-end">
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

        <label className="grid gap-2">
          <span className="flex items-center gap-2 text-sm font-bold text-brew-muted">
            <Search aria-hidden="true" size={18} />
            Search menu
          </span>
          <div className="flex h-12 overflow-hidden rounded-md border border-brew-line bg-white focus-within:border-brew-tea focus-within:ring-2 focus-within:ring-brew-tea/20">
            <input
              className="min-w-0 flex-1 px-3 text-base font-bold outline-none"
              onChange={handleSearchChange}
              placeholder="Search tea, coffee, sandwich..."
              type="search"
              value={searchQuery}
            />
            {searchQuery && (
              <button
                aria-label="Clear search"
                className="grid size-12 place-items-center border-l border-brew-line text-brew-muted"
                onClick={clearSearch}
                type="button"
              >
                <X aria-hidden="true" size={22} />
              </button>
            )}
          </div>
        </label>

        <div className="rounded-md border border-brew-line bg-white px-4 py-3 text-sm font-semibold text-brew-muted lg:justify-self-end">
          {source === 'supabase' ? 'Connected to Supabase' : 'Using local seed'}
        </div>
      </div>
    </header>
  )
}
