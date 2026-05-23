// MenuItemManagementPanel.jsx
// Renders menu item creation, price editing, and availability toggling.
import { Trash2 } from 'lucide-react'

export function MenuItemManagementPanel({
  categories,
  menuItems,
  newMenuItemName,
  setNewMenuItemName,
  newMenuItemPrice,
  setNewMenuItemPrice,
  newMenuItemCategoryId,
  setNewMenuItemCategoryId,
  newMenuItemAvailable,
  setNewMenuItemAvailable,
  priceEdits,
  setPriceEdits,
  loading,
  handleAddMenuItem,
  handleUpdateMenuItem,
  handleToggleMenuItemAvailability,
  handleDeleteMenuItem,
}) {
  return (
    <section className="grid gap-4">
      <div className="rounded-md border border-brew-line bg-white px-5 py-4">
        <h2 className="text-xl font-black">Menu item management</h2>
        <p className="mt-2 text-sm text-brew-muted">
          Add items, edit prices, and toggle item availability.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-[2fr_1fr]">
          <input
            className="w-full rounded-md border border-brew-line bg-slate-50 px-4 py-3 text-base text-brew-ink outline-none focus:border-brew-coffee"
            value={newMenuItemName}
            onChange={(event) => setNewMenuItemName(event.target.value)}
            placeholder="Menu item name"
            type="text"
          />
          <input
            className="w-full rounded-md border border-brew-line bg-slate-50 px-4 py-3 text-base text-brew-ink outline-none focus:border-brew-coffee"
            value={newMenuItemPrice}
            onChange={(event) => setNewMenuItemPrice(event.target.value)}
            placeholder="Price"
            type="number"
            min="0"
            required
          />
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-[2fr_1fr]">
          <select
            className="w-full rounded-md border border-brew-line bg-slate-50 px-4 py-3 text-base text-brew-ink outline-none focus:border-brew-coffee"
            value={newMenuItemCategoryId}
            onChange={(event) => setNewMenuItemCategoryId(event.target.value)}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-3 rounded-md border border-brew-line bg-white px-4 py-3 text-base font-bold text-brew-ink">
            <input
              type="checkbox"
              checked={newMenuItemAvailable}
              onChange={(event) => setNewMenuItemAvailable(event.target.checked)}
            />
            Available
          </label>
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            className="min-h-12 rounded-md bg-brew-coffee px-4 text-base font-black text-white disabled:bg-slate-300"
            onClick={handleAddMenuItem}
            disabled={!newMenuItemName.trim() || !newMenuItemCategoryId || !newMenuItemPrice || Number(newMenuItemPrice) <= 0 || loading}
          >
            Add menu item
          </button>
        </div>
      </div>

      <div className="grid gap-3">
        {menuItems.length ? (
          menuItems.map((item) => (
            <div key={item.id} className="rounded-md border border-brew-line bg-white p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-black">{item.name}</p>
                  <p className="text-sm text-brew-muted">
                    Category: {item.categories?.name || 'Unknown'} · {item.is_available ? 'Available' : 'Unavailable'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className={`rounded-md px-3 py-2 text-sm font-bold ${item.is_available ? 'border border-brew-line bg-white text-brew-ink' : 'bg-brew-coffee text-white'}`}
                    onClick={() => handleToggleMenuItemAvailability(item.id)}
                    disabled={loading}
                  >
                    {item.is_available ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    type="button"
                    className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-red-700 disabled:opacity-50"
                    onClick={() => handleDeleteMenuItem(item.id)}
                    disabled={loading}
                    aria-label="Delete menu item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_120px]">
                <div>
                  <label className="block text-sm font-bold text-brew-muted">Price</label>
                  <input
                    className="mt-1 w-full rounded-md border border-brew-line bg-slate-50 px-4 py-3 text-base text-brew-ink outline-none focus:border-brew-coffee"
                    type="number"
                    min="0"
                    value={priceEdits[item.id] ?? item.price}
                    onChange={(event) =>
                      setPriceEdits((current) => ({ ...current, [item.id]: event.target.value }))
                    }
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    className="min-h-12 w-full rounded-md bg-brew-coffee px-4 text-base font-black text-white disabled:bg-slate-300"
                    onClick={() => handleUpdateMenuItem(item.id)}
                    disabled={loading}
                  >
                    Save price
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-md border border-brew-line bg-slate-50 px-4 py-8 text-center text-sm text-brew-muted">
            No menu items available yet.
          </div>
        )}
      </div>
    </section>
  )
}
