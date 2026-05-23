import { useEffect, useMemo, useState } from 'react'
import {
  getAdminWorkers,
  addAdminWorker,
  updateAdminWorkerStatus,
  getOrders,
  getCategories,
  addCategory,
  updateCategoryStatus,
  getMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../services/adminService'
import { formatPrice } from '../features/worker-pos/utils/formatPrice'
import { AdminTabNav } from '../features/admin/components/AdminTabNav'
import { WorkersPanel } from '../features/admin/components/WorkersPanel'
import { OrdersPanel } from '../features/admin/components/OrdersPanel'
import { CategoryManagementPanel } from '../features/admin/components/CategoryManagementPanel'
import { MenuItemManagementPanel } from '../features/admin/components/MenuItemManagementPanel'

export default function AdminHome() {
  // Tab state drives which admin panel is visible.
  const [tab, setTab] = useState('workers')

  // Core entity state.
  const [workers, setWorkers] = useState([])
  const [orders, setOrders] = useState([])
  const [categories, setCategories] = useState([])
  const [menuItems, setMenuItems] = useState([])

  // UI state.
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Worker form state.
  const [workerName, setWorkerName] = useState('')

  // Category form state.
  const [categoryName, setCategoryName] = useState('')

  // Menu item form state.
  const [newMenuItemName, setNewMenuItemName] = useState('')
  const [newMenuItemPrice, setNewMenuItemPrice] = useState('')
  const [newMenuItemCategoryId, setNewMenuItemCategoryId] = useState('')
  const [newMenuItemAvailable, setNewMenuItemAvailable] = useState(true)
  const [priceEdits, setPriceEdits] = useState({})

  // Fetch all admin data once on mount.
  useEffect(() => {
    async function loadData() {
      setLoading(true)
      setError('')

      try {
        const [{ data: workersData }, { data: ordersData }, { data: categoriesData }, { data: menuItemsData }] = await Promise.all([
          getAdminWorkers(),
          getOrders(),
          getCategories(),
          getMenuItems(),
        ])

        setWorkers(workersData ?? [])
        setOrders(ordersData ?? [])
        setCategories(categoriesData ?? [])
        setMenuItems(menuItemsData ?? [])
        setNewMenuItemCategoryId(categoriesData?.[0]?.id ?? '')
      } catch (err) {
        console.error(err)
        setError('Unable to load admin data. Please refresh.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Derived worker subsets for display.
  const activeWorkers = useMemo(() => workers.filter((worker) => worker.is_active), [workers])
  const inactiveWorkers = useMemo(() => workers.filter((worker) => !worker.is_active), [workers])

  // Worker actions.
  async function handleAddWorker() {
    if (!workerName.trim()) return

    try {
      setLoading(true)
      setError('')
      const { data } = await addAdminWorker(workerName.trim())
      setWorkers((current) => [...current, data])
      setWorkerName('')
    } catch (err) {
      console.error(err)
      setError('Unable to add worker. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleToggleStatus(workerId, isActive) {
    try {
      setLoading(true)
      setError('')
      const { data } = await updateAdminWorkerStatus(workerId, isActive)
      setWorkers((current) =>
        current.map((worker) =>
          worker.id === workerId ? { ...worker, is_active: data.is_active } : worker,
        ),
      )
    } catch (err) {
      console.error(err)
      setError('Unable to update worker status. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Category actions.
  async function handleAddCategory() {
    if (!categoryName.trim()) return

    try {
      setLoading(true)
      setError('')
      const { data } = await addCategory(categoryName.trim())
      setCategories((current) => [...current, data])
      setCategoryName('')
    } catch (err) {
      console.error(err)
      setError('Unable to add category. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleToggleCategory(categoryId, isActive) {
    try {
      setLoading(true)
      setError('')
      const { data } = await updateCategoryStatus(categoryId, isActive)
      setCategories((current) =>
        current.map((category) =>
          category.id === categoryId ? { ...category, is_active: data.is_active } : category,
        ),
      )
    } catch (err) {
      console.error(err)
      setError('Unable to update category. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Menu item actions.
  async function handleAddMenuItem() {
    if (!newMenuItemName.trim() || !newMenuItemCategoryId) return

    try {
      setLoading(true)
      setError('')
      const { data } = await addMenuItem({
        categoryId: newMenuItemCategoryId,
        name: newMenuItemName.trim(),
        price: Number(newMenuItemPrice) || 0,
        isAvailable: newMenuItemAvailable,
      })

      setMenuItems((current) => [...current, data])
      setNewMenuItemName('')
      setNewMenuItemPrice('')
      setNewMenuItemAvailable(true)
    } catch (err) {
      console.error(err)
      setError('Unable to add menu item. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdateMenuItem(itemId) {
    const price = Number(priceEdits[itemId] ?? '')
    if (Number.isNaN(price)) return

    const item = menuItems.find((menuItem) => menuItem.id === itemId)
    if (!item) return

    try {
      setLoading(true)
      setError('')
      const { data } = await updateMenuItem({
        itemId,
        price,
        isAvailable: item.is_available,
      })

      setMenuItems((current) =>
        current.map((menuItem) =>
          menuItem.id === itemId ? { ...menuItem, price: data.price } : menuItem,
        ),
      )
      setPriceEdits((current) => ({ ...current, [itemId]: undefined }))
    } catch (err) {
      console.error(err)
      setError('Unable to update menu item. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleToggleMenuItemAvailability(itemId) {
    const item = menuItems.find((menuItem) => menuItem.id === itemId)
    if (!item) return

    try {
      setLoading(true)
      setError('')
      const { data } = await updateMenuItem({
        itemId,
        price: item.price,
        isAvailable: !item.is_available,
      })

      setMenuItems((current) =>
        current.map((menuItem) =>
          menuItem.id === itemId ? { ...menuItem, is_available: data.is_available } : menuItem,
        ),
      )
    } catch (err) {
      console.error(err)
      setError('Unable to update menu item availability. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteMenuItem(itemId) {
    if (!window.confirm('Are you sure you want to delete this menu item? This action cannot be undone.')) {
      return
    }

    try {
      setLoading(true)
      setError('')
      await deleteMenuItem(itemId)
      setMenuItems((current) => current.filter((item) => item.id !== itemId))
    } catch (err) {
      console.error(err)
      setError('Unable to delete menu item. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-brew-cream text-brew-ink">
      <section className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
        <header className="mb-6 flex flex-col gap-4 rounded-md border border-brew-line bg-white px-6 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-black">Admin Module</h1>
            <p className="mt-2 text-sm font-bold text-brew-muted">
              Manage workers and review recent orders.
            </p>
          </div>
          <AdminTabNav tab={tab} setTab={setTab} />
        </header>

        {error ? (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {tab === 'workers' && (
          <WorkersPanel
            activeWorkers={activeWorkers}
            inactiveWorkers={inactiveWorkers}
            workerName={workerName}
            setWorkerName={setWorkerName}
            loading={loading}
            handleAddWorker={handleAddWorker}
            handleToggleStatus={handleToggleStatus}
          />
        )}

        {tab === 'orders' && <OrdersPanel orders={orders} />}

        {tab === 'categories' && (
          <CategoryManagementPanel
            categories={categories}
            categoryName={categoryName}
            setCategoryName={setCategoryName}
            loading={loading}
            handleAddCategory={handleAddCategory}
            handleToggleCategory={handleToggleCategory}
          />
        )}

        {tab === 'menu' && (
          <MenuItemManagementPanel
            categories={categories}
            menuItems={menuItems}
            newMenuItemName={newMenuItemName}
            setNewMenuItemName={setNewMenuItemName}
            newMenuItemPrice={newMenuItemPrice}
            setNewMenuItemPrice={setNewMenuItemPrice}
            newMenuItemCategoryId={newMenuItemCategoryId}
            setNewMenuItemCategoryId={setNewMenuItemCategoryId}
            newMenuItemAvailable={newMenuItemAvailable}
            setNewMenuItemAvailable={setNewMenuItemAvailable}
            priceEdits={priceEdits}
            setPriceEdits={setPriceEdits}
            loading={loading}
            handleAddMenuItem={handleAddMenuItem}
            handleUpdateMenuItem={handleUpdateMenuItem}
            handleToggleMenuItemAvailability={handleToggleMenuItemAvailability}
            handleDeleteMenuItem={handleDeleteMenuItem}
          />
        )}
      </section>
    </main>
  )
}
