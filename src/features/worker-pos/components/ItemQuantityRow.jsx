import { Minus, Plus } from 'lucide-react'
import { formatPrice } from '../utils/formatPrice'

export function ItemQuantityRow({
  decrementItem,
  incrementItem,
  isSearchMatch,
  item,
  itemRefs,
  quantity,
}) {
  return (
    <div
      className={`grid min-h-20 scroll-mt-56 grid-cols-[1fr_auto] gap-3 rounded-md px-4 py-3 sm:grid-cols-[1fr_auto_156px] sm:items-center ${
        isSearchMatch ? 'bg-amber-50 ring-2 ring-amber-300' : 'bg-slate-50'
      }`}
      key={item.id}
      ref={(element) => {
        if (element) {
          itemRefs.current.set(item.id, element)
        } else {
          itemRefs.current.delete(item.id)
        }
      }}
    >
      <div>
        <span className="block font-bold">{item.name}</span>
        <span className="text-sm font-semibold text-brew-coffee">
          {formatPrice(item.price)}
        </span>
      </div>

      <div className="hidden text-right font-bold text-brew-coffee sm:block">
        {quantity > 0 ? formatPrice(quantity * Number(item.price)) : ''}
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
}
