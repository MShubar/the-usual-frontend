export const calculateOrderSummary = (cartItems, orderType, deliveryFee = 0.40) => {
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )
  
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  
  const delivery = orderType === 'delivery' ? deliveryFee : 0
  
  const total = subtotal + delivery
  
  const summaryItems = [
    {
      label: `Subtotal (${totalItems} ${totalItems === 1 ? 'item' : 'items'})`,
      value: subtotal
    },
    {
      label: orderType === 'delivery' ? 'Delivery Fee' : 'Pickup Fee',
      value: delivery
    }
  ]
  
  return {
    subtotal,
    delivery,
    total,
    totalItems,
    summaryItems
  }
}

export const DELIVERY_FEE = 0.40

export const ORDER_TYPES = {
  DELIVERY: 'delivery',
  PICKUP: 'pickup'
}
