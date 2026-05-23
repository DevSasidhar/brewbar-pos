import { CheckCircle2 } from 'lucide-react'

export function OrderSuccessScreen({ orderId, setScreen }) {
  return (
    <main className="min-h-screen bg-brew-cream pb-28 text-brew-ink">
      <section className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center gap-6 px-4 py-8 sm:px-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brew-tea text-white shadow-lg">
          <CheckCircle2 aria-hidden="true" size={36} />
        </div>
        <div className="rounded-md border border-brew-line bg-white p-6 text-center">
          <h1 className="text-3xl font-black">Order Submitted</h1>
          <p className="mt-3 text-sm font-bold text-brew-muted">
            Your order has been placed successfully.
          </p>
          {orderId ? (
            <p className="mt-4 rounded-md bg-brew-cream px-4 py-3 text-left text-sm font-bold text-brew-ink">
              Order ID: <span className="font-black">{orderId}</span>
            </p>
          ) : null}
        </div>
        <div className="grid w-full max-w-sm gap-3">
          <button
            type="button"
            className="min-h-12 rounded-md bg-brew-coffee px-4 text-base font-black text-white"
            onClick={() => setScreen('menu')}
          >
            New Order
          </button>
          <button
            type="button"
            className="min-h-12 rounded-md border border-brew-line bg-white px-4 text-base font-black text-brew-ink"
            onClick={() => setScreen('menu')}
          >
            Back to menu
          </button>
        </div>
      </section>
    </main>
  )
}
