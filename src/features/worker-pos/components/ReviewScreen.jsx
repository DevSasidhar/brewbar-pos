import { ArrowLeft, Banknote, CreditCard, ReceiptText } from 'lucide-react'
import { formatPrice } from '../utils/formatPrice'
import { useState } from 'react'
import { submitOrder } from '../../../services/workerService'
import { useCartStore } from '../../../store/cartStore'

export function ReviewScreen({
  cartItems,
  paymentMode,
  selectedWorkerId,
  selectedWorkerName,
  setPaymentMode,
  setScreen,
  totalAmount,
  totalItems,
  onOrderSuccess,
}) {
  const [loading, setLoading] = useState(false)
  const clearCart = useCartStore((s) => s.clearCart)

  async function handleSubmit() {
    if (!paymentMode || cartItems.length === 0 || !selectedWorkerId) return

    setLoading(true)

    try {
      const payload = {
        workerId: selectedWorkerId,
        items: cartItems,
        paymentMode,
        totalAmount,
        totalItems,
      }

      const result = await submitOrder(payload)

      const orderId = result?.data?.id

      clearCart()
      if (onOrderSuccess) {
        onOrderSuccess(orderId)
      } else {
        setScreen('menu')
        window.alert(`Order submitted ${orderId ? ` — id: ${orderId}` : ''}`)
      }
    } catch (err) {
      console.error(err)
      window.alert('Failed to submit order. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  return (
    <main className="min-h-screen bg-brew-cream pb-28 text-brew-ink">
      <section className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 py-4 sm:px-6">
        <header className="sticky top-0 z-20 -mx-4 mb-4 border-b border-brew-line bg-brew-cream/95 px-4 pb-4 pt-3 backdrop-blur sm:-mx-6 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <button
              className="grid size-12 place-items-center rounded-md border border-brew-line bg-white text-brew-ink"
              onClick={() => setScreen('menu')}
              type="button"
            >
              <ArrowLeft aria-hidden="true" size={24} />
              <span className="sr-only">Back to menu</span>
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-black leading-tight">
                Review Order
              </h1>
              <p className="text-sm font-bold text-brew-muted">
                {selectedWorkerName}
              </p>
            </div>
            <div className="grid size-12 place-items-center rounded-md bg-brew-tea text-white">
              <ReceiptText aria-hidden="true" size={26} />
            </div>
          </div>
        </header>

        <div className="grid gap-3">
          <section className="rounded-md border border-brew-line bg-white">
            <div className="border-b border-brew-line px-4 py-3">
              <h2 className="text-xl font-black">Items</h2>
            </div>
            <div className="grid gap-2 p-3">
              {cartItems.map((item) => (
                <div
                  className="grid min-h-20 grid-cols-[1fr_auto] gap-3 rounded-md bg-slate-50 px-4 py-3 sm:grid-cols-[1fr_90px_120px]"
                  key={item.id}
                >
                  <div>
                    <p className="font-black">{item.name}</p>
                    <p className="text-sm font-bold text-brew-muted">
                      {formatPrice(item.price)} each
                    </p>
                  </div>
                  <div className="self-center text-right text-lg font-black">
                    x{item.quantity}
                  </div>
                  <div className="col-span-2 text-right text-lg font-black text-brew-coffee sm:col-span-1 sm:self-center">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-md border border-brew-line bg-white p-4">
            <h2 className="mb-3 text-xl font-black">Payment</h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                className={`flex min-h-16 items-center justify-center gap-2 rounded-md border px-4 text-lg font-black ${
                  paymentMode === 'CASH'
                    ? 'border-brew-tea bg-brew-tea text-white'
                    : 'border-brew-line bg-white text-brew-ink'
                }`}
                onClick={() => setPaymentMode('CASH')}
                type="button"
              >
                <Banknote aria-hidden="true" size={24} />
                CASH
              </button>
              <button
                className={`flex min-h-16 items-center justify-center gap-2 rounded-md border px-4 text-lg font-black ${
                  paymentMode === 'UPI'
                    ? 'border-brew-tea bg-brew-tea text-white'
                    : 'border-brew-line bg-white text-brew-ink'
                }`}
                onClick={() => setPaymentMode('UPI')}
                type="button"
              >
                <CreditCard aria-hidden="true" size={24} />
                UPI
              </button>
            </div>
          </section>

          <section className="rounded-md border border-brew-line bg-white p-4">
            <div className="flex items-center justify-between border-b border-brew-line pb-3 text-lg font-black">
              <span>Total items</span>
              <span>{totalItems}</span>
            </div>
            <div className="flex items-center justify-between pt-3 text-2xl font-black">
              <span>Total</span>
              <span className="text-brew-coffee">{formatPrice(totalAmount)}</span>
            </div>
          </section>
        </div>
      </section>

      <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-brew-line bg-white px-4 py-3 shadow-[0_-8px_30px_rgba(31,41,51,0.12)]">
        <div className="mx-auto grid w-full max-w-4xl grid-cols-[112px_1fr] gap-3 sm:grid-cols-[140px_1fr]">
          <button
            className="min-h-12 rounded-md border border-brew-line bg-white px-4 font-black text-brew-ink"
            onClick={() => setScreen('menu')}
            type="button"
          >
            Back
          </button>
          <button
            className="min-h-12 rounded-md bg-brew-coffee px-4 text-base font-black text-white disabled:bg-slate-300"
            disabled={!paymentMode || loading}
            onClick={handleSubmit}
            type="button"
          >
            {loading ? 'Submitting…' : 'Submit Order'}
          </button>
        </div>
      </footer>
    </main>
  )
}
