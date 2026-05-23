import { ShoppingCart } from 'lucide-react'
import { formatPrice } from '../utils/formatPrice'

export function CartFooter({
  selectedWorkerId,
  selectedWorkerName,
  showReviewScreen,
  totalAmount,
  totalItems,
}) {
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
        <button
          className="min-h-12 rounded-md bg-brew-coffee px-5 text-base font-black text-white disabled:bg-slate-300"
          disabled={!selectedWorkerId || totalItems === 0}
          onClick={showReviewScreen}
          type="button"
        >
          Review Order
        </button>
      </div>
    </footer>
  )
}
