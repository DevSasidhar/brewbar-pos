import { create } from 'zustand'

export const useCartStore = create((set, get) => ({
  items: {},
  paymentMode: '',
  selectedWorkerId: '',
  selectedWorkerName: '',
  setWorker: (worker) =>
    set({
      selectedWorkerId: worker?.id ?? '',
      selectedWorkerName: worker?.name ?? '',
    }),
  setPaymentMode: (paymentMode) => set({ paymentMode }),
  incrementItem: (item) =>
    set((state) => {
      const existingItem = state.items[item.id]

      return {
        items: {
          ...state.items,
          [item.id]: {
            id: item.id,
            name: item.name,
            price: Number(item.price),
            quantity: (existingItem?.quantity ?? 0) + 1,
          },
        },
      }
    }),
  decrementItem: (itemId) =>
    set((state) => {
      const existingItem = state.items[itemId]

      if (!existingItem) {
        return state
      }

      const nextItems = { ...state.items }

      if (existingItem.quantity <= 1) {
        delete nextItems[itemId]
      } else {
        nextItems[itemId] = {
          ...existingItem,
          quantity: existingItem.quantity - 1,
        }
      }

      return { items: nextItems }
    }),
  clearCart: () => set({ items: {}, paymentMode: '' }),
  getItemQuantity: (itemId) => get().items[itemId]?.quantity ?? 0,
  getCartItems: () => Object.values(get().items),
  getTotalItems: () =>
    Object.values(get().items).reduce(
      (total, item) => total + item.quantity,
      0,
    ),
  getTotalAmount: () =>
    Object.values(get().items).reduce(
      (total, item) => total + item.quantity * item.price,
      0,
    ),
}))
