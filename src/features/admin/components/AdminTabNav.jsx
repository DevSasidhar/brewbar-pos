// AdminTabNav.jsx
// Renders the top-level tab navigation for the admin module.
export function AdminTabNav({ tab, setTab }) {
  const tabs = [
    { id: 'workers', label: 'Workers' },
    { id: 'orders', label: 'Orders' },
    { id: 'categories', label: 'Categories' },
    { id: 'menu', label: 'Menu Items' },
    { id: 'reports', label: 'Reports' },
    { id: 'analytics', label: 'Analytics' },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`rounded-md px-4 py-2 font-black ${tab === item.id ? 'bg-brew-coffee text-white' : 'border border-brew-line bg-white text-brew-ink'}`}
          onClick={() => setTab(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
