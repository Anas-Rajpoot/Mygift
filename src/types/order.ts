export type OrderType = 'standard' | 'giftlab' | 'send-to-pakistan'
export type PaymentMethod = 'card' | 'jazzcash' | 'easypaisa' | 'cod' | 'paypal' | 'wise'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'
export type OrderStatus =
  | 'pending'          // just placed, awaiting confirmation
  | 'confirmed'        // admin confirmed
  | 'packed'           // order is packed and ready
  | 'dispatched'       // out for delivery
  | 'delivered'        // delivered to recipient
  | 'cancelled'        // cancelled
  | 'payment_received' // COD — cash collected

export interface GiftLabOrderData {
  occasion: string
  box: {
    id: string
    name: string
    size: string
    basePrice: number
    dimensions: string
  }
  items: Array<{
    id: number
    name: string
    price: number
    imageUrl: string
    quantity: number
  }>
  ribbon: string
  message: string
  senderName: string
  cardDesign: string
  addOns: Array<{
    id: string
    name: string
    price: number
  }>
  delivery: string
  deliveryPrice: number
}

export interface DiasporaOrderData {
  giftCategory: string
  product: {
    id: number
    name: string
    price: number
    imageUrl: string
  }
  packing: {
    id: string
    name: string
    price: number
  } | null
  recipient: {
    name: string
    phone: string
    relation: string
    city: string
    deliveryDate: string | null
    deliverySlot: string
    specialInstructions: string
  }
  giftNote: {
    message: string
    senderName: string
    cardDesign: string
    waNotify: boolean
    waNumber: string
    photoUrl: string | null
  }
  buyerCurrency: string
  exchangeRate: number
  foreignTotal: number
}

export interface Order {
  id: string                    // our internal ID
  wcOrderId?: number            // WooCommerce order ID (synced)
  orderNumber: string           // display number e.g. "MGP-2025-001"
  type: OrderType
  
  // Customer (the person paying)
  customer: {
    name: string
    email: string
    phone: string
    country: string
    ip?: string
  }
  
  // Pricing
  subtotal: number
  deliveryPrice: number
  discount: number
  promoCode: string | null
  total: number
  currency: 'PKR'
  
  // Payment
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  transactionId?: string
  
  // Order status
  status: OrderStatus
  statusHistory: Array<{
    status: OrderStatus
    timestamp: string
    note?: string
    updatedBy?: string  // 'system' | 'admin' | 'customer'
  }>
  
  // Type-specific data
  giftlabData?: GiftLabOrderData
  diasporaData?: DiasporaOrderData
  
  // Standard product order items
  items?: Array<{
    productId: number
    name: string
    price: number
    quantity: number
    imageUrl: string
  }>
  
  // Delivery
  deliveryAddress?: {
    name: string
    phone: string
    address: string
    city: string
    province: string
    country: string
  }
  
  // Notes
  customerNote: string
  adminNote: string
  
  // Timestamps
  createdAt: string
  updatedAt: string
  packedAt?: string
  dispatchedAt?: string
  deliveredAt?: string
}
