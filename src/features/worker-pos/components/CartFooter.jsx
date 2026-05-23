import { ShoppingCart, Trash2 } from 'lucide-react'
import { formatPrice } from '../utils/formatPrice'
import { useCartStore } from '../../../store/cartStore'
import { useState } from 'react'
import { ConfirmDialog } from './ConfirmDialog'

export function CartFooter({
  selectedWorkerId,
  selectedWorkerName,
  showReviewScreen,
  totalAmount,
  totalItems,
}) {
  const clearCart = useCartStore((s) => s.clearCart)
  const [showConfirm, setShowConfirm] = useState(false)

  function handleClearClick() {
    setShowConfirm(true)
  }

  function handleConfirmClear() {
    clearCart()
    setShowConfirm(false)
  }

  function handleCancelClear() {
    setShowConfirm(false)
  }
  return (
    <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-brew-line bg-white px-4 py-3 shadow-[0_-8px_30px_rgba(31,41,51,0.12)]">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-bold text-brew-muted">
            <ShoppingCart aria-hidden="true" size={18} />
            {selectedWorkerName || 'No worker selected'}
          </div>
          <p className="mt-1 text-lg font-black">
            {totalItems} items - {formatPrice(totalAmount)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <>
            <button
              className="flex items-center gap-2 rounded-md border border-brew-line bg-white px-4 py-2 text-sm font-bold text-brew-muted disabled:opacity-50"
              disabled={totalItems === 0}
              onClick={handleClearClick}
              type="button"
            >
              <Trash2 size={16} />
              Clear Cart
            </button>

            <ConfirmDialog
              open={showConfirm}
              title="Clear cart"
              description="This will remove all selected items. Are you sure you want to continue?"
              onConfirm={handleConfirmClear}
              onCancel={handleCancelClear}
              confirmLabel="Clear"
              cancelLabel="Keep"
            />
          </>

          <button
            className="min-h-12 rounded-md bg-brew-coffee px-5 text-base font-black text-white disabled:bg-slate-300"
            disabled={!selectedWorkerId || totalItems === 0}
            onClick={showReviewScreen}
            type="button"
          >
            Review Order
          </button>
        </div>
      </div>
    </footer>
  )
}
