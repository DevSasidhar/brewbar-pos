import { formatPrice } from '../../worker-pos/utils/formatPrice'

// OrdersPanel.jsx
// Displays recent orders along with order item details.
export function OrdersPanel({ orders }) {
  return (
    <section className="grid gap-4">
      <div className="rounded-md border border-brew-line bg-white p-4">
        <h2 className="text-xl font-black">Recent orders</h2>
        <p className="mt-2 text-sm text-brew-muted">View recent order totals and checkout details.</p>
      </div>
      <div className="grid gap-3">
        {orders.length ? (
          orders.map((order) => (
            <div key={order.id} className="rounded-md border border-brew-line bg-white p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-bold text-brew-muted">Order ID</p>
                  <p className="text-lg font-black">{order.id}</p>
                  <p className="mt-1 text-sm text-brew-muted">
                    {order.workers?.name || 'Unknown worker'} · {order.payment_mode} · {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-brew-muted">Total items</p>
                  <p className="text-lg font-black">{order.total_items}</p>
                </div>
              </div>
              <div className="mt-4 grid gap-2 border-t border-brew-line pt-3 text-sm text-brew-muted">
                {order.order_items?.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3">
                    <span>{item.item_name} x{item.quantity}</span>
                    <span>{formatPrice(item.subtotal)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-brew-line pt-3 text-base font-black">
                <span>Total</span>
                <span>{formatPrice(order.total_amount)}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-md border border-brew-line bg-slate-50 px-4 py-8 text-center text-sm text-brew-muted">
            No recent orders available yet.
          </div>
        )}
      </div>
    </section>
  )
}
