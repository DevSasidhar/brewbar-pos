// CategoryManagementPanel.jsx
// Displays category creation and status toggling UI.
export function CategoryManagementPanel({
  categories,
  categoryName,
  setCategoryName,
  loading,
  handleAddCategory,
  handleToggleCategory,
}) {
  return (
    <section className="grid gap-4">
      <div className="rounded-md border border-brew-line bg-white px-5 py-4">
        <h2 className="text-xl font-black">Category management</h2>
        <p className="mt-2 text-sm text-brew-muted">
          Add new categories and toggle active status for the menu.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            className="w-full rounded-md border border-brew-line bg-slate-50 px-4 py-3 text-base text-brew-ink outline-none focus:border-brew-coffee"
            value={categoryName}
            onChange={(event) => setCategoryName(event.target.value)}
            placeholder="New category name"
            type="text"
          />
          <button
            type="button"
            className="min-h-12 rounded-md bg-brew-coffee px-4 text-base font-black text-white disabled:bg-slate-300"
            onClick={handleAddCategory}
            disabled={!categoryName.trim() || loading}
          >
            Add category
          </button>
        </div>
      </div>
      <div className="rounded-md border border-brew-line bg-white p-4">
        <h3 className="text-lg font-black">Categories</h3>
        <div className="mt-3 space-y-3">
          {categories.length ? (
            categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between gap-3 rounded-md border border-brew-line bg-slate-50 px-4 py-3">
                <div>
                  <p className="font-black">{category.name}</p>
                  <p className="text-sm text-brew-muted">Display order: {category.display_order}</p>
                </div>
                <button
                  type="button"
                  className="rounded-md border border-brew-line bg-white px-3 py-2 text-sm font-bold text-brew-ink"
                  onClick={() => handleToggleCategory(category.id, !category.is_active)}
                  disabled={loading}
                >
                  {category.is_active ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-brew-muted">No categories available.</p>
          )}
        </div>
      </div>
    </section>
  )
}
